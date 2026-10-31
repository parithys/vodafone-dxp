import { EXCEPTION_ROUTED_ID_TYPES } from '../data/idTypes';
import type { EligibilityDecision } from '../domain/eligibility';
import { PORT_IN_DUES_THRESHOLD_QAR } from '../data/portInRules';
import { formatQar } from '../lib/format';
/**
 * The customer fields these checks read - a structural shape rather than an
 * import of the full CustomerRecord, so both that type and the narrower local
 * records the wizard steps declare satisfy it without either being widened.
 */
export interface CustomerForEligibility {
  customerId: string;
  idType?: string;
  dob?: string;
  blacklisted: boolean;
  blacklistReason?: string;
  blacklistCategory?: 'collections' | 'security';
}

/**
 * What a failed check DOES, which is not the same as whether it passed. The
 * 2026-09-25 eligibility matrix defines four distinct outcomes and only one of
 * them stops the journey:
 *
 *   - 'hard-stop'        the journey cannot continue at this counter.
 *   - 'soft-stop'        this product cannot be issued; a fallback exists.
 *   - 'approval-routing' not a failure - the order diverts for approval and
 *                        proceeds once granted.
 *   - 'pass'             the check is satisfied.
 *
 * Collapsing these into a boolean is what the step did before, which is why a
 * line-cap breach and a security block were indistinguishable on screen.
 */
export type EligibilityOutcome = 'pass' | 'hard-stop' | 'soft-stop' | 'approval-routing';

export interface EligibilityCheck {
  id: string;
  /** Row heading - the check's NAME, matching the matrix's "Eligibility Check" column. */
  label: string;
  passed: boolean;
  outcome: EligibilityOutcome;
  message: string;
  /** The approval rules behind an approval-routing outcome (e.g. PB-01), so a screen can tell an ID-type approval from a line-count one. */
  approvalRuleIds?: string[];
}

export interface IdentityDocForEligibility {
  documentType?: string;
  documentNumber?: string;
  /** Seeded 2026-09-25 - see identity-documents.json's _expiryNote. */
  expiryDate?: string;
  docStatus?: string;
}

export interface DealForEligibility {
  customerId?: string;
  status?: string;
  /** Seeded 2026-09-25 - see commitment-penalties.json's _blockingNote. */
  blocksNewConnection?: boolean;
}

export interface EligibilityContext {
  customer: CustomerForEligibility;
  doc?: IdentityDocForEligibility;
  deals: DealForEligibility[];
  /** Outstanding balance for the collections message, in QAR. */
  outstandingQar: number;
  /** Postpaid line cap for this customer, from the line-cap rules. */
  lineCapReached: boolean;
  /** The line-cap rule says no further line can be added at all (expat at the 5-line maximum). */
  lineCapHardStop?: boolean;
  /** The Connection Eligibility & Approval Rule Engine's decision. When present it IS the Active Lines check; the line-cap fields above are then not read. */
  lineDecision?: EligibilityDecision;
  /**
   * The line-cap rule's OWN message (BR-288/BR-347 in ruleEngine.ts), which
   * already states the customer's actual active-connections count against
   * the cap - e.g. "1/2 postpaid mobile lines used (expat cap)" or "2/5
   * postpaid mobile lines used (Qatari cap)." Passed through rather than recomputed here:
   * the count and the cap the Active Lines check must report are exactly
   * what that rule already worked out, and restating the arithmetic in a
   * second place risks the two disagreeing.
   */
  activeLinesDetail: string;
  /**
   * Which journey is checking. Defaults to postpaid. Prepaid differs in three places, each from the Mobile Prepaid
   * BRSD: all four prepaid ID types (QID, Diplomatic, GCC, Passport) are permitted outright (MPRA_001_KYC_01); a
   * collections block does not restrict prepaid; and the line-limit wording names prepaid, not postpaid.
   */
  journeyType?: 'postpaid' | 'prepaid';
  /**
   * 'common' returns only the checks that read the same for every product - ID validity, age, security and unclassified
   * blacklist, deals - so Customer Verification, which happens before the agent has chosen a product, can report them.
   * 'product' (default) is the full set, judged for `journeyType`: the ID-type routing, collections block and line cap
   * differ by product and are only meaningful once one is chosen.
   */
  scope?: 'common' | 'product';
  /** An MNP port-in: adds the outstanding-dues threshold check (BR-MNP-024), which no other product has. */
  portIn?: boolean;
  /** The port-in dues threshold in QAR; defaults to the configured one (none is defined yet, see data/portInRules). */
  portInDuesThresholdQar?: number;
}

/** The checks that do not depend on the product (see EligibilityContext.scope). */
export const COMMON_CHECK_IDS: ReadonlySet<string> = new Set(['id-validity', 'age', 'blacklist-security', 'blacklist-unclassified', 'deals']);

/**
 * ID types that divert to the Back Office Fulfilment / exception-approval workflow rather than
 * being sold directly.
 *
 * SPECIFIED 2026-09-25, replacing an assumption. This previously listed
 * Diplomatic ID and Other ID, guessed from their non-MOI validationPath and
 * flagged in this comment as needing confirmation. The actual rule is the
 * near-inverse: a postpaid connection may be sold directly only against a
 * valid QID or Diplomatic ID; Passport, GCC ID and other exception
 * identification must go through Back Office Fulfilment approval.
 *
 * Kept as a check rather than removed now that the postpaid ID Type selector
 * only offers QID and Diplomatic ID: the other journeys share this engine and
 * still accept the wider set, and a customer can reach eligibility with a
 * Passport on record through them.
 */

export const MINIMUM_AGE = 18;

/**
 * An ID is expired when its expiry date is TODAY or earlier (the rule: expiry on or before the current date). Compared as calendar days in
 * the agent's local date, so the answer never depends on the time of day or on a date parsed as UTC midnight. An expiry that cannot be read as
 * a date is treated as expired: unknown is not valid.
 */
export function isIdExpired(expiry: string, asOf: Date): boolean {
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(expiry.trim())?.[1];
  const day = iso ?? (Number.isNaN(new Date(expiry).getTime()) ? undefined : localDay(new Date(expiry)));
  return day === undefined || day <= localDay(asOf);
}
const localDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Whole years between a date of birth and `asOf`. */
export function ageOn(dob: string | undefined, asOf: Date): number | undefined {
  if (!dob) return undefined;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return undefined;
  let age = asOf.getFullYear() - born.getFullYear();
  const beforeBirthday =
    asOf.getMonth() < born.getMonth() ||
    (asOf.getMonth() === born.getMonth() && asOf.getDate() < born.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// The seven checks of the 2026-09-25 eligibility matrix, in its order, with
// its wording. Every check returns a row either way - a passed check states
// what it verified rather than staying silent, so the agent can see that all
// seven actually ran.
//
// `asOf` is injected rather than read from the clock inside, so expiry and age
// are testable and so the whole result is a pure function of its inputs.
export function evaluateEligibilityChecks(ctx: EligibilityContext, asOf: Date): EligibilityCheck[] {
  const { customer, doc, deals, outstandingQar, lineCapReached, lineCapHardStop, activeLinesDetail, journeyType = 'postpaid' } = ctx;
  const prepaid = journeyType === 'prepaid';
  const checks: EligibilityCheck[] = [];

  // 1. ID validity / expiry.
  const expiry = doc?.expiryDate;
  if (expiry) {
    const expired = isIdExpired(expiry, asOf);
    checks.push({
      id: 'id-validity',
      label: 'ID Validity',
      passed: !expired,
      outcome: expired ? 'hard-stop' : 'pass',
      message: expired
        ? `This ID expired on ${formatDate(expiry)}. Please request a valid, unexpired ID to continue.`
        : `Valid through ${formatDate(expiry)}`,
    });
  } else {
    // No expiry on the record is NOT a pass. Saying "ID verified" with nothing
    // to verify against is the false confirmation this app avoids elsewhere.
    checks.push({
      id: 'id-validity',
      label: 'ID Validity',
      passed: false,
      outcome: 'approval-routing',
      message: 'No expiry date on file for this document - manual validity check required before issue.',
    });
  }

  // 2. Age.
  const age = ageOn(customer.dob, asOf);
  const underage = age !== undefined && age < MINIMUM_AGE;
  checks.push({
    id: 'age',
    label: 'Age Check',
    passed: !underage,
    // Under-18 is a HARD STOP (VFQ business, 2026-10-02, for new and existing
    // customers alike). It was briefly Approval Routing ("Under 18 approval")
    // after the 2026-09-27 walkthrough; that is superseded.
    outcome: underage ? 'hard-stop' : 'pass',
    message: underage
      ? 'MOI records indicate this applicant is under 18. The connection cannot proceed.'
      // The age itself, per 2026-09-26 direction. An agent judging a
      // borderline applicant against the document in their hand needs the
      // number the check used, not just its verdict. Falls back to the plain
      // wording when dob is absent, since "age is undefined years" is worse
      // than saying less.
      : age === undefined
        ? 'Age verified - eligible to proceed'
        : `Customer's age is ${age} years - eligible to proceed`,
  });

  // 3. ID-type exception routing. Not a failure - a diversion.
  const presentedIdType = doc?.documentType ?? customer.idType ?? '';
  // Prepaid permits QID, Diplomatic ID, GCC ID and Passport (KYC_01), so only an ID outside that set diverts.
  const routed = prepaid ? presentedIdType === 'Other ID' : EXCEPTION_ROUTED_ID_TYPES.has(presentedIdType);
  checks.push({
    id: 'id-type-routing',
    // One result for the ID type's approval (2026-10-22): Credit Control. The passport BAU approval the line rules also derive is the same
    // requirement, so the Active Lines check below does not repeat it.
    label: routed ? 'Credit Control Approval Required' : 'ID Type',
    passed: !routed,
    outcome: routed ? 'approval-routing' : 'pass',
    message: routed
      ? 'The selected ID type requires Credit Control approval. You may continue with the journey; the order will be automatically routed to Credit Control for approval upon submission.'
      : 'Accepted ID type - eligible to proceed',
  });

  // 4/5. The blacklist splits by CATEGORY, because the two halves do different
  // things: a collections block stops postpaid only and offers prepaid, while a
  // security block ends the interaction. One boolean could not express that.
  const blocked = Boolean(customer.blacklisted);
  const category = customer.blacklistCategory;
  // A collections block needs an actual amount owed: a balance of QAR 0 is no
  // outstanding amount, so it triggers no block, stop or restriction (VFQ
  // business, 2026-10-02). The flag alone is not enough.
  const collectionsBlocked = blocked && category === 'collections' && outstandingQar > 0;
  const securityBlocked = blocked && category === 'security';

  checks.push({
    id: 'blacklist-collections',
    label: 'Collections Check',
    passed: !collectionsBlocked || prepaid,
    // A collections block stops postpaid only; prepaid is what such a customer is still offered.
    outcome: collectionsBlocked && !prepaid ? 'soft-stop' : 'pass',
    message: collectionsBlocked
      ? prepaid
        ? `This account has an outstanding balance of ${formatQar(outstandingQar)}. This does not restrict a prepaid connection.`
        : `This account has an outstanding balance of ${formatQar(outstandingQar)}. Postpaid cannot be issued. Prepaid is available on this QID.`
      : 'No collections block on this account',
  });

  checks.push({
    id: 'blacklist-security',
    // Label/pass-message reverted to "Security Check" / "No security block on
    // this account" (2026-09-28), matching the reference eligibility panel
    // exactly. This reverses the 2026-09-27 rename to "Corporate Security
    // Blacklist" - the fail MESSAGE still names the corporate security
    // blacklist explicitly (and that exact phrase is what the hard-stop
    // exception pattern names), so which list blocked the customer is still
    // on screen; only the row's own title changed back.
    label: 'Security Check',
    passed: !securityBlocked,
    outcome: securityBlocked ? 'hard-stop' : 'pass',
    message: securityBlocked
      ? 'This customer is on the corporate security blacklist and is restricted from new connections. No further action available at this counter.'
      : 'No security block on this account',
  });

  // A blacklisted customer whose category is absent is treated as a hard stop
  // rather than sliding through both rows above: the block is real, only its
  // classification is missing, and guessing the lenient branch would issue a
  // connection the registry says to withhold.
  if (blocked && category !== 'collections' && category !== 'security') {
    checks.push({
      id: 'blacklist-unclassified',
      label: 'Blacklist Check',
      passed: false,
      outcome: 'hard-stop',
      message: `This customer is blacklisted (${customer.blacklistReason ?? 'reason not recorded'}) and the block is unclassified - escalate before issuing.`,
    });
  }

  // 6. Deals.
  const blockingDeal = deals.find((d) => d.customerId === customer.customerId && d.blocksNewConnection);
  checks.push({
    id: 'deals',
    label: 'Deals Check',
    passed: !blockingDeal,
    outcome: blockingDeal ? 'hard-stop' : 'pass',
    message: blockingDeal
      ? 'An existing deal on this account prevents this connection.'
      : 'No blocking deal conflicts',
  });

  // 7. Active lines. A diversion, not a stop - the order proceeds once the
  // approval task is granted, so this deliberately does NOT hard-stop even
  // though the underlying cap rule reports `pass: false`.
  const decision = ctx.lineDecision;
  // When the ID type itself is routed (above), the passport BAU approval is that same requirement: it is reported once, as the ID type's
  // Credit Control result, not again here. A line-ordinal Credit Control approval or any other rule's approval still shows.
  const lineApprovals = decision ? (routed ? decision.approvals.filter((a) => a.ruleId !== 'PB-01') : decision.approvals) : [];
  const lineApprovalOnly = decision?.outcome === 'ALLOW_WITH_APPROVAL' && lineApprovals.length === 0;
  if (decision) {
    const c = decision.countsBefore;
    const held = `Customer holds ${c.mobileTotal} mobile lines (${c.prepaid} prepaid, ${c.postpaid} postpaid) and ${c.fixedFwa} Fixed/FWA lines.`;
    checks.push({
      id: 'active-lines',
      label: 'Active Lines',
      passed: decision.outcome === 'ALLOW' || lineApprovalOnly,
      // A block is a hard stop (no approval overrides it); the engine's approvals are Approval Routing: the journey continues and the order is held.
      outcome: decision.outcome === 'BLOCK' ? 'hard-stop' : decision.outcome === 'ALLOW_WITH_APPROVAL' && !lineApprovalOnly ? 'approval-routing' : 'pass',
      approvalRuleIds: lineApprovals.map((a) => a.ruleId),
      message:
        decision.outcome === 'BLOCK'
          ? (decision.block?.message ?? held)
          : decision.outcome === 'ALLOW_WITH_APPROVAL' && !lineApprovalOnly
            ? `Approval Required\n${lineApprovals.map((a) => a.message).join(' ')} The journey can continue, but the order will be routed for approval upon submission.`
            : held,
    });
  } else {
  checks.push({
    id: 'active-lines',
    // 2026-09-28: reports the customer's ACTUAL active-connections count
    // against the cap (activeLinesDetail), not just a pass/fail verdict -
    // "Within permitted active line count" said nothing an agent could check
    // the reasoning behind.
    label: 'Active Lines',
    passed: !lineCapReached,
    // Reaching the limit is Approval Routing - the journey continues and the order
    // goes to the Collection Team once submitted. Only the expat's absolute
    // maximum is a hard stop. Never a Soft Stop.
    outcome: lineCapHardStop ? 'hard-stop' : lineCapReached ? 'approval-routing' : 'pass',
    message: lineCapHardStop
      ? activeLinesDetail
      : lineCapReached && prepaid
        ? `Prepaid Line Limit Reached\n${activeLinesDetail} The journey can continue, but the order will be routed for approval upon submission.`
      : lineCapReached
        ? `Postpaid Line Limit Reached\nThe maximum limit of ${activeLinesDetail.match(/limit of (\d+)/)?.[1] ?? 'the permitted number of'} active postpaid lines has been reached. The journey can continue, but the order will be routed to the Collection Team for approval upon submission.`
        : activeLinesDetail,
  });
  }

  // 8. MNP only: outstanding dues against the Collections Policy threshold (BR-MNP-024). The threshold is not defined (the rule is Open
  // in the BRSD), so with none configured the check never restricts; it states the amount it did not act on rather than passing silently.
  if (ctx.portIn && ctx.scope !== 'common') {
    const threshold = ctx.portInDuesThresholdQar ?? PORT_IN_DUES_THRESHOLD_QAR;
    const exceeded = threshold !== undefined && outstandingQar > threshold;
    checks.push({
      id: 'port-in-dues',
      label: 'Outstanding Dues Check',
      passed: !exceeded,
      outcome: exceeded ? 'hard-stop' : 'pass',
      message: exceeded
        ? `This account has outstanding dues of ${formatQar(outstandingQar)}, above the ${formatQar(threshold)} threshold for a port-in. The port-in cannot proceed until the dues are settled.`
        : threshold === undefined
          ? outstandingQar > 0
            ? `Outstanding dues of ${formatQar(outstandingQar)}. The port-in dues threshold is not defined yet, so it does not restrict this request.`
            : 'No outstanding dues'
          : `Outstanding dues are within the ${formatQar(threshold)} port-in threshold`,
    });
  }

  return ctx.scope === 'common' ? checks.filter((c) => COMMON_CHECK_IDS.has(c.id)) : checks;
}

/** Any hard stop means the journey halts on the Eligibility step. */
export function hasHardStop(checks: EligibilityCheck[]): boolean {
  return checks.some((c) => c.outcome === 'hard-stop');
}

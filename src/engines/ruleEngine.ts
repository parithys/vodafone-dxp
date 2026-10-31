import { isSlaStopped } from '../lib/statusTone';
import { defaultCreditLimit, hrnAdvanceQar, isHrn } from './hrnConfiguration';
import { PREPAID_CAPPED_ID_TYPES } from '../data/idTypes';
import { simCardCharge } from '../data/prepaidSimCharge';
import { formatQar } from '../lib/format';


// Rule Engine per frontend-architecture.md §5. 346 business rules are catalogued
// (config/business-rules.json) but most are free-text descriptions, not formal
// condition/action pairs - only rules actually exercised by a screen get a real
// implementation here. Referencing an unimplemented rule fails LOUDLY (a visible
// warning), never silently, so gaps stay visible during development.

export interface RuleContext {
  [key: string]: unknown;
}

export type RuleImplementation = (ctx: RuleContext) => { pass: boolean; message?: string; hardStop?: boolean };

// Priority subset per frontend-architecture.md §5 "illustrative high-value rules" -
// all Explicit/high-confidence, directly evidenced across multiple guided journeys.
// High-Risk Nationality: which nationalities, the advance payment and the credit limit are configured in hrnConfiguration.ts.
/** BR-076: the default credit limit on a new account - the HRN category's for a High Risk Nationality customer, the standard one otherwise. */
export const defaultCreditLimitQar = (hrnFlag: boolean, nationality?: string): number => defaultCreditLimit({ hrn: hrnFlag, nationality: hrnFlag ? undefined : nationality });

export const isHrnNationality = (nationality: string | undefined): boolean => isHrn(nationality);

/** Absolute ceiling on an expat's postpaid lines: reaching it is a hard stop. */
const EXPAT_MAX_POSTPAID_LINES = 5;

const ruleImplementations: Record<string, RuleImplementation> = {
  // Bill Limit / Smart Limit Agent Minimum guardrail - evidenced across multiple
  // New Postpaid walkthroughs (e.g. guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90:
  // per-product Agent Minimum thresholds, Mobile=50, Mobile Plus=75).
  'BR-AGENT-MIN-THRESHOLD': (ctx) => {
    const { limitAmount, agentMinimum } = ctx as { limitAmount: number; agentMinimum: number };
    if (typeof limitAmount !== 'number' || typeof agentMinimum !== 'number') {
      return { pass: false, message: 'Missing limitAmount/agentMinimum in rule context.' };
    }
    return limitAmount >= agentMinimum
      ? { pass: true }
      : {
          pass: false,
          message: `Entries above the Agent Minimum value (${formatQar(agentMinimum)}) allow the journey to proceed - ${formatQar(limitAmount)} is below it.`,
        };
  },

  // Fibre outstanding-dues credit-check threshold - conflict-report.md Conflict 1
  // (High severity, verified against data/VFQ_Fibre_BRSD_v1.2.xlsx). The BRSD's own
  // Open Items log (OI-04) and Business Rule BR-033 admit the fibre threshold is
  // *unresolved*: one position says it must be fibre-specific and distinct, another
  // says it should equal the mobile/postpaid threshold - no numeric value is agreed
  // anywhere in the source. Per ai-coding-agent-implementation-guide.md §5's
  // instruction to "resolve or explicitly stub" this before building Fixed
  // Line/Fibre credit-check logic: this rule NEVER silently picks a threshold. It
  // always reports the conflict as unresolved when there's an outstanding balance
  // to evaluate - the UI must surface this as a visible, explicit business-owner
  // decision point, never as a quiet pass/fail.
  'BR-FIBRE-OUTSTANDING-THRESHOLD': (ctx) => {
    const { collectionStatus } = ctx as { collectionStatus: string };
    if (collectionStatus === 'Good Standing') {
      return { pass: true, message: 'No outstanding balance on this billing profile - threshold policy is moot for this order.' };
    }
    return {
      pass: false,
      message:
        `Unresolved: the fibre outstanding-dues threshold is contradictorily specified - ` +
        `one position requires a fibre-specific QAR limit, another says it must equal the mobile/postpaid threshold. No value is agreed. ` +
        `Escalate to VFQ Collections/Credit Control before this account (collection status: ${collectionStatus}) can proceed on a definitive rule.`,
    };
  },

  // ZSB-mandatory-for-mobile - conflict-report.md Conflict 2 (Medium severity).
  // Consumer Activation Process Manual v8.0 says ZSB capture is mandatory in
  // both mobile Prepaid (§2.1.15) and Postpaid (§3.1.12) sections, with no
  // fixed/FWA qualifier. A Day 7 stack-modernization workshop says the opposite:
  // ZSB is mandatory only for FWA 5G/fixed, NOT mobile, which uses a shared
  // unchangeable dummy address record. Per
  // ai-coding-agent-implementation-guide.md §5's instruction to "resolve or
  // explicitly stub" this before building mobile address-capture logic: this
  // rule never hard-blocks on ZSB, because the field-level evidence itself
  // (FLD-523–526, MNP Postpaid Address) shows Zone/Street/Building/Apt marked
  // Mandatory: No with an explicit "Skip Address" button in the same screen -
  // i.e. the actual UI behavior already leans toward the workshop's "not
  // mandatory for mobile" position, not the legacy manual's. That's a real,
  // cited signal, not a coin flip - but the conflict itself remains genuinely
  // unresolved, so this is surfaced to the agent, not silently dropped.
  'BR-ZSB-MANDATORY-FOR-MOBILE': () => ({
    pass: true,
    message:
      `Unresolved: Consumer Activation Process Manual v8.0 §2.1.15/§3.1.12 requires ZSB for mobile; a Day 7 workshop says it's ` +
      `FWA/fixed-only. Not blocking here - the evidenced screen itself (MNP Postpaid Address, FLD-523–526) marks these fields ` +
      `Mandatory: No with a "Skip Address" option - but confirm with COPS & Digital / Customer Data Management before treating this as final.`,
  }),

  // Enterprise account credit limit requires Business Finance approval - FLD-028,
  // UJ-004 Enterprise Account Creation: "enterprise has no default credit limit
  // and requires business finance approval." Unlike the two conflict stubs
  // above, this isn't contradictory evidence - it's a single, unambiguous rule -
  // so it's a real hard gate, not an advisory.
  'BR-ENTERPRISE-CREDIT-LIMIT-APPROVAL': (ctx) => {
    const { approved } = ctx as { approved: boolean };
    return approved
      ? { pass: true }
      : { pass: false, message: 'Enterprise accounts have no default credit limit - Business Finance approval is required before this account can be created.' };
  },

  // Fibre 12-month lock-in disconnection fee calculation (BR-001).
  'BR-001': (ctx) => {
    const { monthsCompleted } = ctx as { monthsCompleted: number };
    if (typeof monthsCompleted !== 'number') {
      return { pass: false, message: 'Missing monthsCompleted in rule context.' };
    }
    if (monthsCompleted >= 12) return { pass: true, message: 'Lock-in complete - no disconnection fee applies.' };
    const remainingOfMinimum = Math.max(0, 3 - monthsCompleted);
    const remainingLockInMonths = 12 - monthsCompleted;
    const fee = remainingLockInMonths * 80;
    return {
      pass: false,
      message: `Disconnecting before 12-month lock-in completes: remainder of the 3-month minimum service period (${remainingOfMinimum} mo) plus QAR 80 x ${remainingLockInMonths} remaining months = ${formatQar(fee)} lock-in charge.`,
    };
  },

  // SIM Swap Charging Rule (BR-056): eSIM to eSIM is free, eSIM to physical is
  // charged, lost SIM replacement is chargeable, damaged SIM replacement is
  // not charged. Informational, not blocking - matches the evidenced flow
  // where the reason selection just determines the fee shown, not eligibility.
  'BR-056': (ctx) => {
    const { reason } = ctx as { reason: string };
    const charged = reason === 'eSIM to Physical' || reason === 'Lost SIM';
    return {
      pass: true,
      message: charged ? 'This SIM Swap reason is chargeable.' : 'This SIM Swap reason is free of charge.',
    };
  },

  // Postpaid eligibility gate (BR-113): eligibility for a NEW postpaid
  // subscription is decided by blacklist/collection status alone, explicitly
  // NOT by the outstanding amount owed - so this rule only ever inspects
  // `blacklisted`, never a balance figure.
  'BR-113': (ctx) => {
    const { blacklisted, blacklistReason } = ctx as { blacklisted: boolean; blacklistReason?: string };
    return blacklisted
      ? { pass: false, message: `Blacklisted (${blacklistReason ?? 'reason not recorded'}) - postpaid activation is blocked. Escalate to Risk/Collections; no agent override.` }
      : { pass: true };
  },

  // Postpaid active-line limit (VFQ business, 2026-10-02):
  //  - Qatari: 5 active postpaid lines. At or over 5 the connection needs
  //    approval; there is NO maximum above that.
  //  - Expat: 2 active postpaid lines. At or over 2 it needs approval, up to a
  //    maximum of 5; at 5 the connection is a HARD STOP.
  // Reaching a limit is Approval Routing (the journey continues, the order is
  // routed after submission) - never a Soft Stop, which is reserved for the
  // collections scenario. BR-111: any override is an authorized-officer role
  // flag on the account, not an in-journey bypass.
  'BR-288': (ctx) => {
    const { nationality, activePostpaidLines } = ctx as { nationality: string; activePostpaidLines: number };
    const isQatari = nationality === 'Qatari';
    const cap = isQatari ? 5 : 2;
    const who = isQatari ? 'Qatari' : 'Expat';
    if (activePostpaidLines < cap) {
      return { pass: true, message: `${activePostpaidLines}/${cap} postpaid mobile lines used (${who.toLowerCase()} cap).` };
    }
    if (!isQatari && activePostpaidLines >= EXPAT_MAX_POSTPAID_LINES) {
      return {
        pass: false,
        hardStop: true,
        message: `Expat maximum of ${EXPAT_MAX_POSTPAID_LINES} postpaid mobile lines reached (${activePostpaidLines} active) - no further postpaid connection can be added.`,
      };
    }
    return {
      pass: false,
      message: `${who} limit of ${cap} active postpaid lines reached (${activePostpaidLines} active).`,
    };
  },

  // Prepaid mobile-voice connection cap by ID type - this is
  // VFQ_Mobile_Prepaid_Activation_BRSD_V0.1.xlsx's own document-scoped BR-003
  // ("Line count"), an entirely different rule from this catalogue's BR-003
  // ("Try & Buy 30-Day Waiver Condition"); the two numbering schemes collide
  // coincidentally since they come from separate documents. Source rule text:
  // "Passport holder and GCC ID Holder can have 2 Mobile Voice Prepaid
  // connections. Qatari, Sawfa and Sawfa Plus Customer will not have any
  // restrictions. Expatriate with QID can hold 5 Mobile Voice connections
  // (Including Postpaid and Prepaid)." That source row is marked Status: Open
  // (not yet Agreed) but the numeric thresholds are corroborated by the same
  // BRSD's Confirmed configurable parameters P-04 (5, expat QID) and P-06
  // (unrestricted, Qatari) - implemented despite the Open status on that
  // basis. Sawfa/Sawfa Plus aren't modelled as distinct customer values in
  // this app's schema, so only the Qatari-nationality branch of that clause
  // is checked. Diplomatic ID isn't covered by the source rule text at all -
  // left unrestricted rather than inventing a cap for it.
  'BR-347': (ctx) => {
    const { idType, nationality, activePrepaidLines, activePostpaidLines } = ctx as {
      idType?: string;
      nationality: string;
      activePrepaidLines: number;
      activePostpaidLines: number;
    };
    if (nationality === 'Qatari') {
      return { pass: true, message: 'Qatari nationals have no prepaid connection cap.' };
    }
    if (PREPAID_CAPPED_ID_TYPES.has(String(idType))) {
      const cap = 2;
      return activePrepaidLines < cap
        ? { pass: true, message: `${activePrepaidLines}/${cap} prepaid mobile lines used (${idType} cap).` }
        : {
            pass: false,
            message: `${idType} holders are capped at ${cap} prepaid mobile lines - this customer already has ${activePrepaidLines}.`,
          };
    }
    if (idType === 'QID') {
      const cap = 5;
      const total = activePrepaidLines + activePostpaidLines;
      return total < cap
        ? { pass: true, message: `${total}/${cap} combined postpaid+prepaid mobile lines used (expat QID cap).` }
        : {
            pass: false,
            message: `Expatriate QID holders are capped at ${cap} combined postpaid+prepaid mobile lines - this customer already has ${total}.`,
          };
    }
    return { pass: true, message: `No line cap is specified for ID type "${idType ?? 'unknown'}" - not blocking.` };
  },

  // Prepaid SIM card charge threshold by ID type - again the Prepaid BRSD's
  // own document-scoped BR-013 ("SIM Card Charges"), a different rule from
  // whatever this catalogue's own BR-013 covers (same numbering collision as
  // BR-347/BR-003 above). Source rule text: "SIM Card charges will be
  // collected based on the Recharge Amount for each ID Type, if the Recharge
  // amount is less than the below mentioned limit then System would collect
  // the SIM Card charges - QID: Recharge 10 QR, PASSPORT: Recharge 40 QR."
  // Marked Agreed in the source (unlike BR-003, no Open-status caveat here).
  // The thresholds and the charge amounts now live in data/prepaidSimCharge.ts: the V0.1 BRSD names the charge
  // amounts (QID 10, Passport 40); the recharge limit they apply below is a placeholder pending VFQ. Open Items OI-01/OI-03
  // (both Closed) separately note that in practice prepaid is expected to
  // always be sold bundled with a plan from DXP, so this charge is expected
  // to rarely apply - implemented regardless since BR-013 remains a
  // Must-priority row in the requirements register.
  'BR-348': (ctx) => {
    const { idType, rechargeAmountQar } = ctx as { idType?: string; rechargeAmountQar: number };
    const { applies, message } = simCardCharge(idType, rechargeAmountQar);
    return { pass: !applies, message };
  },

  // Trouble Ticket SLA breach -> RAG + auto-escalation - the Trouble Ticket
  // BRSD's own document-scoped BR-015 ("SLA Notification"), a different rule
  // from whatever this catalogue's own BR-015 ("Volumetric Discount
  // Proration Rule") covers (same numbering collision pattern as
  // BR-347/BR-348 above, and the only Business Rule in that BRSD's own
  // register still marked Status: Open rather than Agreed). Source: ESC-01
  // "the system shall...escalate the ticket and change the status as
  // 'Escalate' automatically when SLA is breached", ESC-03 (RAG status
  // update), P-16/17/18 (RAG thresholds, Confirmed) and P-10/P-11 (SLA
  // target 24h non-Expatriate / 48h Expatriate, AS-IS baseline). Computes RAG
  // from elapsed time against slaDueAt; Red means breached (auto-escalate).
  'BR-349': (ctx) => {
    const { slaDueAt, firstNotifyAt, status } = ctx as { slaDueAt?: string; firstNotifyAt?: string; status?: string };
    if (!slaDueAt) return { pass: true, message: 'No SLA target set on this ticket.' };
    const now = Date.now();
    const due = new Date(slaDueAt).getTime();
    const terminal = isSlaStopped(status);
    if (terminal) return { pass: true, message: 'Ticket is in a terminal status - SLA clock stopped.' };
    if (now >= due) {
      return { pass: false, message: 'SLA target breached - RAG Red (P-18). Ticket auto-escalates.' };
    }
    const firstNotify = firstNotifyAt ? new Date(firstNotifyAt).getTime() : undefined;
    if (firstNotify && now >= firstNotify) {
      return { pass: true, message: 'Past the first SLA notification threshold - RAG Amber (P-17).' };
    }
    return { pass: true, message: 'Within the applicable SLA target - RAG Green (P-16).' };
  },

  // HRN (High-Risk Nationality) advance payment (BR-187/BR-194/BR-252, all
  // independently evidenced at QAR 100): amount is driven by nationality/sales
  // channel, explicitly NOT by plan value (BR-112) - so this never reads plan
  // context, only the HRN flag itself.
  'BR-187': (ctx) => {
    const { hrnFlag } = ctx as { hrnFlag: boolean };
    return hrnFlag
      ? { pass: true, message: `HRN customer - ${formatQar(hrnAdvanceQar())} advance payment required at checkout.` }
      : { pass: true };
  },

  // Default credit limit by nationality (BR-076) - informational, not a gate;
  // surfaced so the agent sees the limit the Bill Limit step will enforce as
  // its Agent Minimum floor before they pick a plan.
  // The HRN/non-HRN classification that drives the amount is no longer stated
  // in this message's parenthetical - it is its own Eligibility row now (see
  // EligibilityGateStep), because it is a property of the customer rather than
  // a footnote about the limit. The amount and `pass` are unchanged; only the
  // sentence is shorter.
  'BR-076': (ctx) => {
    const { hrnFlag, nationality } = ctx as { hrnFlag: boolean; nationality?: string };
    const amount = defaultCreditLimitQar(hrnFlag, nationality);
    return { pass: true, message: `Default credit limit: ${formatQar(amount)} on a new account.` };
  },

  // Unsubmitted ticket never routes to a queue (BR-068) - gates queue
  // assignment on the ticket having its required fields (issue type +
  // template content) filled before Submit commits it.
  'BR-068': (ctx) => {
    const { issueType, templateContent } = ctx as { issueType?: string; templateContent?: string };
    return issueType && templateContent
      ? { pass: true }
      : { pass: false, message: 'Ticket is unsubmitted - Issue Type and template content are required before it can route to a queue.' };
  },

  // Only an agent can reopen a closed ticket, never the customer (BR-066).
  // Every screen in this app is agent-facing (no customer self-service
  // persona is modeled), so this always passes here - kept as a real rule
  // so the restriction is documented and evaluated, not silently assumed.
  'BR-066': () => ({
    pass: true,
    message: 'Only an agent can reopen a closed ticket - this restriction is moot for agent-facing screens, but customers cannot self-reopen.',
  }),
};

export function evaluateRule(ruleId: string, ctx: RuleContext): { pass: boolean; message?: string; hardStop?: boolean } {
  const impl = ruleImplementations[ruleId];
  if (!impl) {
    // Fails loudly per §5 - surfaced as a visible dev-mode warning banner, not a silent no-op.
    console.warn(`[ruleEngine] Rule ${ruleId} has no implementation - see gap-analysis.md / business-rules.md`);
    return { pass: true, message: `⚠ Rule ${ruleId} has no implementation yet (dev mode: allowing by default)` };
  }
  return impl(ctx);
}

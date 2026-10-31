import { useEffect, useRef, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { Button } from '../../components/primitives/Button';
import { evaluateRule } from '../../engines/ruleEngine';
import { defaultCreditLimit, isHrn } from '../../engines/hrnConfiguration';
import { creditRiskPatch, creditSegmentOf, customerCategoryOf, hrnFeeApplies, resolveCreditRisk, type BigDataCreditRisk, type CreditRiskSource } from '../../engines/creditLimit';
import { useNotificationStore } from '../../stores/notificationStore';
import { evaluateEligibilityChecks, hasHardStop, type EligibilityCheck } from '../../engines/eligibilityEngine';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { outstandingBalance } from '../../engines/billingBalance';
import { evaluateConnection } from '../../engines/connectionEligibility';
import type { ConnectionType, RequestKind } from '../../domain/eligibility';
import { callService, ServiceError, type FailureKind, type ServiceName } from '../../engines/serviceCall';
import { TechnicalFailure } from '../../components/patterns/ValidationStatus';
import type { EligibilityResult, CustomerRecord, IdentityDocRecord } from '../../components/domain/eligibilityTypes';
import { buildEligibilityRows } from '../../components/domain/eligibilityRowsModel';
import { EligibilityChecksList } from '../../components/domain/EligibilityRows';
import { useActedForCustomer } from '../../components/patterns/useActedForCustomer';


interface EligibilityGateStepProps {
  idNumber: string | undefined;
  onResult: (result: EligibilityResult | undefined) => void;
  /**
   * A result already computed earlier in this journey, from the wizard draft.
   *
   * The eligibility check is a ONE-TIME task: leaving the step and coming
   * back re-mounts this component, and without this it would re-read four
   * datasets and flash "Checking eligibility..." before redrawing the same
   * seven rows. Passing the previous result back in lets the step render
   * immediately from it.
   *
   * Reused only when its `idNumber` still matches - see EligibilityResult.
   */
  result?: EligibilityResult;
  /**
   * Pattern 2 (Approval Workflow), rendered as a "Proceed to Approval" button
   * when an approval-routing check applies and nothing harder blocks the
   * order (2026-09-28). Omit to render no button at all - NewPrepaidWizard's
   * separate Eligibility step still relies on the plain-text routing message
   * below rather than this action.
   */
  onProceedToApproval?: () => void;
  /** Set false to skip the dark "Eligibility confirmed" toast on a clean pass (New Connection shows only the Existing customer toast). Defaults to true. */
  announcePass?: boolean;
  /** New Customer journey: check whoever this ID belongs to as a genuine new customer. */
  asNewCustomer?: boolean;
  /** Journey started from Customer 360: check this customer (and their own ID document), whatever ID the scan returned. */
  asCustomerId?: string;
  /** The journey adds no line (a plan change), so the active-line limit does not apply: it neither shows nor routes the order for approval. */
  skipLineLimit?: boolean;
  /**
   * The connection being sold, for the line-count rules (Connection Eligibility & Approval Rule Engine). Defaults to the mobile line the
   * journey type names; a Fixed/FWA product says so.
   */
  connectionType?: ConnectionType;
  /** NEW_ACTIVATION (default) or PREPAID_TO_POSTPAID_MIGRATION. */
  requestKind?: RequestKind;
  /**
   * Pattern 3 (Alternative Product), rendered as a "Switch to Prepaid" button
   * when a collections block soft-stops the order (2026-09-28). Only makes
   * sense for `journeyType: 'postpaid'` - Prepaid customers hitting this same
   * collections block have no "switch to Prepaid" to offer, since that is
   * already the product they are on.
   */
  onSwitchToPrepaid?: () => void;
  // Defaults to 'postpaid' so the existing New Postpaid Activation call site
  // is unaffected. 'prepaid' switches the line-cap check from BR-288
  // (postpaid-specific expat-QID cap of 2) to BR-347 (the Mobile Prepaid
  // Activation BRSD's own BR-003 - Passport/GCC ID capped at 2 prepaid
  // lines, Qatari unrestricted, expat QID capped at 5 combined
  // postpaid+prepaid lines), and hides the HRN-advance-payment banner and
  // credit-limit badge, since MPRA_001_CAM_04 and MPRA_001_ECC_03/BAM_01
  // explicitly exclude both from the Prepaid Activation journey. The HRN
  // flag itself is still derived and returned on the result
  // (MPRA_001_CAM_03) - it's just never displayed as a payment prompt here.
  journeyType?: 'postpaid' | 'prepaid';
  /**
   * 'common' (Customer Verification, before a product is chosen): only the checks that are the same for every product.
   * 'product' (default): the full set for `journeyType`, once the agent has chosen the product.
   */
  scope?: 'common' | 'product';
  /** An MNP port-in: adds the outstanding-dues check (BR-MNP-024). */
  portIn?: boolean;
  /**
   * Narrows which of the rows that did not pass are shown (the checks are judged in full either way). A journey that already showed
   * the customer's checks at Customer Verification uses this at Product Selection to show only what the product adds or blocks.
   */
  showRow?: (row: { id: string; tone: string; approvalRuleIds?: string[] }) => boolean;
  /**
   * A customer the agent CREATED at Customer Verification (no registry knows the ID): the identity they entered, which stands in for the
   * registry record the checks would otherwise read. Only used when no registry record matches the ID.
   */
  newIdentity?: { idNumber: string; idType: string; nationality: string; dob: string; expiryDate?: string };
  /** A QID that Customer Verification linked to an EXISTING customer (through their Passport): the QID is not on file yet, so it stands in for the customer's own document. */
  linkedIdDocument?: { customerId: string; documentNumber: string; documentType: string; expiryDate?: string };
}

// Gate 2 of the reference activation flow: blacklist + connection-limit +
// HRN-advance-payment checks, run once the customer's identity is resolved
// from Contact/MOI (Gate 1). Re-looks up the customer via the same
// identity-documents -> customers chain IdLookupStep uses, since MOI results
// don't carry a customerId forward. BR-113/BR-288/BR-187/BR-076 - see
// ruleEngine.ts for the evidenced business-rules.json citations.
type Subject = {
  doc: IdentityDocRecord;
  nasCustomer: CustomerRecord | undefined;
  match: CustomerRecord;
  deals: { customerId?: string; status?: string; blocksNewConnection?: boolean }[];
  bills: { customerId?: string; type?: string; totalAmount?: number; status?: string }[];
  payments: { customerId?: string; chargeType?: string; amountQar?: number; status?: string }[];
};

// Big Data updates already written to a customer's record this session (one write per update, however often the checks are re-judged).
const appliedRiskUpdates = new Set<string>();

export function EligibilityGateStep({
  idNumber,
  onResult,
  result,
  journeyType = 'postpaid',
  scope = 'product',
  portIn = false,
  showRow,
  onProceedToApproval,
  onSwitchToPrepaid,
  announcePass = true,
  asNewCustomer = false,
  asCustomerId: explicitCustomerId,
  skipLineLimit = false,
  connectionType,
  requestKind = 'NEW_ACTIVATION',
  newIdentity,
  linkedIdDocument,
}: EligibilityGateStepProps) {
  const asCustomerId = useActedForCustomer(explicitCustomerId, asNewCustomer);
  const requestedType: ConnectionType = connectionType ?? (journeyType === 'prepaid' ? 'MOBILE_PREPAID' : 'MOBILE_POSTPAID');
  // A cached result for THIS identity. Computed during render rather than in
  // an effect so the first paint on re-entry already shows the rows.
  const cached =
    result && idNumber && result.idNumber === idNumber && (result.scope ?? 'product') === scope && (result.journeyType ?? 'postpaid') === journeyType && Boolean(result.portIn) === portIn && Boolean(result.lineLimitSkipped) === skipLineLimit && (result.connectionType ?? (journeyType === 'prepaid' ? 'MOBILE_PREPAID' : 'MOBILE_POSTPAID')) === requestedType && (result.requestKind ?? 'NEW_ACTIVATION') === requestKind
      ? result
      : undefined;

  // undefined = still resolving, null = no customer for this identity,
  // object = resolved. One piece of state rather than a customer record plus a
  // separate check list, because a cached result carries the checks and the
  // HRN flag but not the customer row they came from - and the render only
  // ever needed those two things.
  const [resolved, setResolved] = useState<
    { checks: EligibilityCheck[]; hrnFlag: boolean; nationality?: string; existing?: boolean } | null | undefined
  >(cached
      ? { checks: cached.checks, hrnFlag: cached.requiresHrnAdvance, nationality: cached.nationality, existing: cached.isExistingCustomer }
      : undefined
  );
  const pushToast = useNotificationStore((s) => s.pushToast);
  // A failure to RUN the checks (a lookup or the eligibility service failed) is not a
  // verdict: it leaves eligibility UNRESOLVED - neither eligible nor ineligible - with
  // Retry, then a controlled recovery once attempts are spent. Continue stays
  // unavailable because no result is ever reported.
  const [failure, setFailure] = useState<{ service: ServiceName; kind: FailureKind; attempts: number } | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const attemptsRef = useRef<{ id: string; n: number }>({ id: '', n: 0 });
  // The records read for an identity, and the connection decisions made on them, kept while this step is mounted (see the effect).
  const loadedRef = useRef<{ key: string; data: Subject } | undefined>(undefined);
  const decisionsRef = useRef(new Map<string, NonNullable<EligibilityResult['connectionDecision']>>());

  useEffect(() => {
    // The one-time guarantee. Nothing is re-read and onResult is not called
    // again - the draft already holds exactly this result.
    if (cached) return;
    if (!idNumber) {
      setResolved(undefined);
      onResult(undefined);
      return;
    }
    let cancelled = false;
    (async () => {
     try {
      // What is read about the identity does not depend on the product, so it is read once and kept: switching the plan type re-judges
      // the rules over the same records instead of fetching them all again. The independent reads run together, not one after another.
      const subjectKey = `${idNumber}|${asCustomerId ?? ''}|${newIdentity?.nationality ?? ''}|${newIdentity?.dob ?? ''}|${linkedIdDocument?.customerId ?? ''}`;
      let loaded = loadedRef.current?.key === subjectKey ? loadedRef.current.data : undefined;
      if (!loaded) {
        const [docs, customers, [deals, bills, payments]] = await Promise.all([
          callService('moi', () => mockDataEngine.list<IdentityDocRecord>('identity-documents')),
          callService('customer-lookup', () => mockDataEngine.list<CustomerRecord>('customers')),
          callService('eligibility', () =>
            Promise.all([
              mockDataEngine.list<{ customerId?: string; status?: string; blocksNewConnection?: boolean }>('commitment-penalties'),
              mockDataEngine.list<{ customerId?: string; type?: string; totalAmount?: number; status?: string }>('bills'),
              mockDataEngine.list<{ customerId?: string; chargeType?: string; amountQar?: number; status?: string }>('payments'),
            ])
          ),
        ]);
        // The presented ID decides who is checked; the selected customer is only a fallback for an ID with no document record.
        let foundDoc: IdentityDocRecord | undefined =
          docs.find((d) => d.documentNumber === idNumber) ??
          (linkedIdDocument && linkedIdDocument.documentNumber === idNumber ? { ...linkedIdDocument } : undefined) ??
          (asCustomerId ? docs.find((d) => d.customerId === asCustomerId) : undefined);
        // Known to NAS but with no customer record = a NEW customer. Nothing on
        // file to block them: no blacklist, no lines, no deals, no balance.
        let nasCustomerFound: CustomerRecord | undefined;
        if (!foundDoc) {
          const nas = (
            await callService('nas', () =>
              mockDataEngine.list<{ documentNumber: string; documentType?: string; expiryDate?: string; nationality: string; dob?: string }>('nas-records')
            )
          ).find((r) => r.documentNumber === idNumber);
          if (nas) {
            foundDoc = { documentNumber: nas.documentNumber, customerId: '', documentType: nas.documentType, expiryDate: nas.expiryDate };
            nasCustomerFound = { customerId: '', idType: nas.documentType, dob: nas.dob, nationality: nas.nationality, blacklisted: false };
          }
        }
        // No registry knows the ID but the agent created the customer: the identity they entered stands in for the record - a new customer, with nothing
        // on file to block them (no blacklist, lines, deals or balance), judged on their nationality, date of birth and the ID's expiry.
        if (!foundDoc && newIdentity && newIdentity.idNumber === idNumber) {
          foundDoc = { documentNumber: idNumber, customerId: '', documentType: newIdentity.idType, expiryDate: newIdentity.expiryDate };
          nasCustomerFound = { customerId: '', idType: newIdentity.idType, dob: newIdentity.dob, nationality: newIdentity.nationality, blacklisted: false };
        }
        if (!foundDoc) {
          if (!cancelled) {
            setResolved(null);
            onResult(undefined);
          }
          return;
        }
        const matched = nasCustomerFound ?? customers.find((c) => c.customerId === foundDoc.customerId) ?? null;
        if (cancelled) return;
        // The identity points at a customer record the lookup cannot return: a lookup
        // failure to retry, not "no customer" and not "new".
        if (!matched) throw new ServiceError('customer-lookup', 'partial');
        // A record without the details the checks need cannot be judged either way.
        if (!matched.nationality || (!nasCustomerFound && !matched.dob)) throw new ServiceError('customer-lookup', 'partial');
        loaded = { doc: foundDoc, nasCustomer: nasCustomerFound, match: matched, deals, bills, payments };
        loadedRef.current = { key: subjectKey, data: loaded };
      }
      const { doc, nasCustomer, match, deals, bills, payments } = loaded;
      const blacklist = evaluateRule('BR-113', { blacklisted: match.blacklisted, blacklistReason: match.blacklistReason });
      // The line-count rules: the engine's decision where it covers this customer and connection (QID and Passport; a journey that adds a
      // line, judged at product scope), otherwise the older line-cap rules below.
      const decision =
        skipLineLimit || scope !== 'product'
          ? null
          : (decisionsRef.current.get(`${subjectKey}|${requestedType}|${requestKind}`) ??
            (await callService('eligibility', () =>
              evaluateConnection({
                customerId: nasCustomer ? undefined : match.customerId,
                nationality: match.nationality,
                idType: doc.documentType ?? match.idType,
                dob: match.dob,
                requestedType,
                requestKind,
              })
            )));
      if (decision) decisionsRef.current.set(`${subjectKey}|${requestedType}|${requestKind}`, decision);
      if (cancelled) return;
      const lineCap =
        skipLineLimit
          ? { pass: true, hardStop: false, message: undefined as string | undefined }
          : journeyType === 'prepaid'
          ? evaluateRule('BR-347', {
              idType: match.idType,
              nationality: match.nationality,
              activePrepaidLines: match.activePrepaidLines ?? 0,
              activePostpaidLines: match.activePostpaidLines ?? 0,
            })
          : evaluateRule('BR-288', {
              nationality: match.nationality,
              activePostpaidLines: match.activePostpaidLines ?? 0,
            });
      // Derived from nationality (VFQ list in ruleEngine.ts), not read from a
      // per-record flag, so a NAS-only new customer is classified too.
      // The QAR 100 advance applies to new AND existing customers (VFQ business,
      // 2026-10-02). What differs: an existing customer gets no separate
      // "Non-HRN new account" row (that check is for new accounts), and neither
      // is ever told they are HRN - see buildEligibilityRows.
      const isExistingCustomer = !nasCustomer && !asNewCustomer;
      // The HRN CATEGORY follows the nationality; the HRN FEE (advance) is NOT marked when the customer's Credit Risk Exemption is Low or No. The
      // credit risk in force is Big Data's input for the customer, else what their record carries.
      const bigData = await mockDataEngine.list<BigDataCreditRisk>('big-data-credit-risk');
      const risk = resolveCreditRisk(match as CreditRiskSource & { customerId?: string }, bigData);
      // Big Data's input updates the customer's Credit Risk as soon as they are identified (not only when Customer 360 is opened): written to their record
      // when it differs, once. A person with no customer record (a new customer) has none to update.
      const riskPatch = creditRiskPatch(match as CreditRiskSource & { customerId?: string }, bigData);
      if (riskPatch && match.customerId && !appliedRiskUpdates.has(`${match.customerId}|${riskPatch.creditRiskUpdatedAt}`)) {
        appliedRiskUpdates.add(`${match.customerId}|${riskPatch.creditRiskUpdatedAt}`);
        void useEntityStore.getState().updateRecord('customers', 'customerId', match.customerId, riskPatch as Record<string, unknown>, { how: 'Big Data credit risk update', by: 'Big Data' });
      }
      const hrnCategory = isHrn(match.nationality);
      const hrnFlag = hrnCategory && hrnFeeApplies(risk.creditRiskExemption);
      evaluateRule('BR-187', { hrnFlag });
      // Still computed though the Credit limit ROW was removed from this step
      // on 2026-09-25: the amount is not display-only. DeviceInstallmentStep
      // reads defaultCreditLimitQar off this result to judge instalment
      // affordability, so dropping it from the result would silently change
      // that step's behaviour rather than just hide a row.
      const creditLimit = evaluateRule('BR-076', { hrnFlag: hrnCategory, nationality: match.nationality });
      const creditLimitAmount = defaultCreditLimit({ nationality: match.nationality });

      // The seven matrix checks. Deals and the outstanding balance are the
      // only extra reads: the line cap comes from the rule already evaluated
      // above, so the cap logic stays in one place rather than being restated
      // inside the eligibility engine.
      if (cancelled) return;
      // What the customer owes, as Customer 360 shows it (billingBalance.ts): issued, unsettled invoices less collected bill payments. Not every bill
      // that is not 'Paid' - no bill has that status, so that counted hot bills and simulations as debt.
      const outstandingQar = outstandingBalance(
        bills.filter((b) => b.customerId === match.customerId),
        payments.filter((p) => p.customerId === match.customerId)
      );

      const resolvedChecks = evaluateEligibilityChecks(
        {
          customer: match,
          doc,
          deals,
          outstandingQar,
          lineCapReached: decision ? decision.outcome !== 'ALLOW' : !lineCap.pass,
          lineDecision: decision ?? undefined,
          lineCapHardStop: Boolean(lineCap.hardStop),
          // The line-cap rule's own message already has the count - see the
          // note on EligibilityContext.activeLinesDetail.
          activeLinesDetail: lineCap.message ?? '',
          journeyType,
          scope,
          portIn,
        },
        new Date()
      );

      attemptsRef.current = { id: idNumber, n: 0 };
      setFailure(null);
      setRetrying(false);
      setResolved({ checks: resolvedChecks, hrnFlag, nationality: match.nationality, existing: isExistingCustomer });
      const hardStop = hasHardStop(resolvedChecks);
      const softStop = resolvedChecks.some((c) => c.outcome === 'soft-stop');
      // Confirmation toast on a clear pass (2026-09-25). It is pushed HERE,
      // in the branch that computes the result, for two reasons:
      //
      // - The step auto-advances the moment it clears, so this component is
      //   unmounting as the agent reads it. A message rendered inside the
      //   step would vanish with it; a toast outlives the step and follows
      //   them to Address.
      // - The cached path returns before this point, so re-entering the step
      //   cannot re-announce a check it did not re-run.
      //
      // Keyed on the identity so a recompute after an ID change replaces the
      // previous confirmation rather than stacking a second one.
      if (!hardStop && !softStop && announcePass) {
        pushToast('success', 'Eligibility confirmed', {
          key: `eligibility-${idNumber}`,
          detail: `Customer is eligible for a ${journeyType === 'prepaid' ? 'prepaid' : 'postpaid'} connection. Continuing to the next step.`,
        });
      }

      // The upfront (HRN advance) payment is not announced by a toast: it is listed with the other checks (the info row below).
      onResult({
        // Soft stop blocks too - see the note on EligibilityResult.pass.
        pass: !hardStop && !softStop,
        hardStop,
        softStop,
        checks: resolvedChecks,
        blacklisted: !blacklist.pass,
        blacklistReason: match.blacklistReason,
        lineCapExceeded: decision ? decision.outcome !== 'ALLOW' : !lineCap.pass,
        connectionType: requestedType,
        lineLimitSkipped: skipLineLimit,
        requestKind,
        connectionDecision: decision ?? undefined,
        requiresHrnAdvance: hrnFlag,
        isExistingCustomer,
        nationality: match.nationality,
        segment: match.segment,
        scope,
        journeyType,
        portIn,
        defaultCreditLimitQar: creditLimitAmount,
        customerCategory: customerCategoryOf(match.nationality),
        creditSegment: creditSegmentOf(match.nationality),
        creditRisk: risk.creditRisk,
        creditRiskExemption: risk.creditRiskExemption,
        // The checks above ran on the real record whoever the journey treats the person as;
        // a New Customer journey just does not carry that customer's id forward.
        customerId: nasCustomer || asNewCustomer ? undefined : match.customerId,
        idNumber,
      });
      void creditLimit;
     } catch (err) {
      if (cancelled) return;
      const e = err instanceof ServiceError ? err : new ServiceError('eligibility', 'unexpected');
      attemptsRef.current = { id: idNumber, n: attemptsRef.current.id === idNumber ? attemptsRef.current.n + 1 : 1 };
      setFailure({ service: e.service, kind: e.kind, attempts: attemptsRef.current.n });
      setRetrying(false);
      setResolved(undefined);
      onResult(undefined);
     }
    })();
    return () => {
      cancelled = true;
    };
    // onResult is deliberately excluded: NewPostpaidWizard passes a fresh
    // inline arrow function on every render, so including it here retriggers
    // this effect every time onResult fires - an infinite update loop caught
    // live via the ErrorBoundary ("Maximum update depth exceeded").
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idNumber, journeyType, scope, portIn, cached, retryNonce, newIdentity?.nationality, newIdentity?.dob, newIdentity?.expiryDate, linkedIdDocument?.customerId]);

  // Nothing to show before an identity is resolved - this panel lives
  // permanently inside the Contact step now (2026-09-28, no more separate
  // Eligibility step to mount a HEADLESS instance ahead of), so there is no
  // "go back and complete Contact first" to say: the agent is already there,
  // simply not far enough into it yet for eligibility to have anything to
  // report. Silence is the correct state, same as the clean-pass case below.
  if (!idNumber) return null;
  if (failure || retrying) {
    return (
      <TechnicalFailure
        service={failure?.service ?? 'eligibility'}
        kind={failure?.kind ?? 'unexpected'}
        attempts={failure?.attempts ?? 0}
        retrying={retrying}
        onRetry={() => {
          setRetrying(true);
          setRetryNonce((n) => n + 1);
        }}
        exhaustedHint="Eligibility has not been checked, so this order cannot continue. Use Save as Draft to resume later."
      />
    );
  }
  if (resolved === undefined) {
    return <p className="text-muted text-[length:var(--fs-body)]">Checking eligibility…</p>;
  }
  if (resolved === null) {
    return <p className="text-danger text-[length:var(--fs-body)]">No customer record found for this identity - cannot evaluate eligibility.</p>;
  }

  const { checks, hrnFlag, nationality, existing } = resolved;
  const hardStop = hasHardStop(checks);
  const softStop = checks.some((c) => c.outcome === 'soft-stop');
  const routed = checks.filter((c) => c.outcome === 'approval-routing');

  // Folding HRN into the same list rather than rendering it as a separate
  // block below is what keeps the panel reading as a single report - it was
  // previously a lone card floating under the seven, which implied it was an
  // eighth verdict. See buildEligibilityRows' own note on why this
  // construction lives there now, not inline here.
  const rows = buildEligibilityRows(checks, hrnFlag, nationality, journeyType, existing, scope === 'product');

  // ONLY the rows that did not pass (2026-09-27). A clean run is not reported
  // here at all - the step is skipped outright by the wizard (see
  // NewPostpaidWizard's `skip`), so eight green "Passed" rows the agent had to
  // read past and then dismiss are gone. What remains on screen is only ever
  // something that needs a decision.
  //
  // "Did not pass" deliberately includes approval-routing as well as the two
  // stops. Routing is not a failure, but it IS a diversion the agent must know
  // about - an under-18 applicant silently proceeding behind an approval task
  // nobody mentioned would be worse than one extra screen.
  // The upfront payment (HRN) result is listed with the other checks, as well as announced by the info toast when the result was computed.
  const unresolved = rows.filter((row) => row.tone !== 'pass' && (showRow?.(row) ?? true));

  // NOTHING rendered on a clean pass (2026-09-28: "advance automatically
  // without showing pass indicators"). This panel now lives inside the
  // Contact step rather than a separate Eligibility step the wizard could
  // skip past, so a clean run has to be silence here, not even a one-line
  // confirmation - the toast pushed above already told the agent it cleared,
  // and Continue simply becomes available. Any text here, however muted,
  // is still a pass indicator the agent has to read past.
  if (unresolved.length === 0) return null;

  return (
    <div className="space-y-3">
      <EligibilityChecksList rows={unresolved} />

      {/* Pattern 1: Hard Stop. No button of any kind - "no option to proceed"
          means exactly that, not a disabled one sitting here as a tease. */}
      {hardStop && (
        <p className="text-danger text-[length:var(--fs-caption)]">
          This journey cannot continue for this customer - resolve the blocking check above before retrying.
        </p>
      )}
      {/* Pattern 3: Alternative Product. Only a collections soft-stop reaches
          here (the engine's only 'soft-stop' outcome), and only Postpaid has
          an alternative to offer - a Prepaid customer hitting the same block
          has nowhere else to switch to. onSwitchToPrepaid is left unset by
          NewPrepaidWizard for exactly that reason, so the button is absent
          there even though the message above still applies. */}
      {!hardStop && softStop && (
        <div className="space-y-2">
          {onSwitchToPrepaid && (
            <Button variant="secondary" compact onClick={onSwitchToPrepaid}>
              Switch to Prepaid
            </Button>
          )}
        </div>
      )}
      {/* Pattern 2: Approval Workflow. "Proceed to Approval" replaces the
          ordinary Continue action for this order - the wizard still gathers
          plan/number/SIM/CAF/payment normally, but the order that eventually
          submits is held for approval rather than completing outright (see
          NewPostpaidWizard's pendingApproval). The plain-text fallback below
          the button covers NewPrepaidWizard, whose separate Eligibility step
          still auto-advances on its own rather than taking this action. */}
      {!hardStop && !softStop && routed.length > 0 && (
        <div className="space-y-2">
          {onProceedToApproval && (
            <Button variant="primary" compact onClick={onProceedToApproval}>
              Proceed to Approval
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

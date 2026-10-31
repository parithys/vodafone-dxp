import type { MilestoneDef } from '../../engines/milestoneEngine';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';

/**
 * The five milestones of Mobile Postpaid Activation (MOB_POST_ACT_CBU_001, BRSD v0.4), each wired to the completion of the step behind it,
 * never to a screen change. Copy is English only: the app has no i18n layer yet, so the strings live here, in one place, keyed by milestone id.
 * See reference/docs/VFQ_DXP_Milestones_Reference.md.
 */
export const POSTPAID_MILESTONE_IDS = ['identified', 'billing', 'checkout', 'caf', 'submitted'] as const;

/** The journeys the milestones apply to: New Connection until a product is chosen, then only when it is Postpaid. */
export const postpaidMilestonesApply = (values: Record<string, unknown>): boolean => values.product === undefined || values.product === 'postpaid';

const at = <T,>(values: Record<string, unknown>, key: string) => values[key] as T | undefined;

const cartFingerprint = (values: Record<string, unknown>): string | null => {
  const sim = at<SimTypeValue>(values, 'simType');
  const simOk = sim?.simType === 'Physical' ? sim.simValid === true : sim?.simType === 'eSIM' ? sim.esimIssued === true : false;
  const totals = at<{ dueTodayQar?: number; totalDueQar?: number }>(values, 'checkoutTotals');
  if (!values.productId || !values.msisdn || !simOk || !totals) return null;
  return JSON.stringify([values.productId, [...((values.addonIds as string[] | undefined) ?? [])].sort(), values.discountId ?? null, values.msisdn, sim?.simSerial ?? sim?.simType ?? null, totals.dueTodayQar ?? totals.totalDueQar ?? null]);
};

export const POSTPAID_MILESTONES: readonly MilestoneDef[] = [
  {
    id: 'identified',
    stepKey: 'contact',
    label: 'Customer Verified',
    title: 'Customer Verified',
    message: 'Customer identified and eligibility confirmed.',
    // MOI validated the ID but no customer record exists: a new Vodafone customer, not an identified one.
    wording: (values) =>
      (values.eligibility as EligibilityResult | undefined)?.isExistingCustomer === false
        ? { title: 'New Customer', message: 'MOI validated; no existing customer record found.' }
        : { title: 'Customer Verified', message: 'Customer identified and eligibility confirmed.' },
    // ID captured and MOI-verified, and the eligibility checks passed (a hard or soft stop - blacklist, collections, expired ID - blocks it).
    evidence: ({ values }) => {
      const contact = at<GuidedContactValue>(values, 'contact');
      const eligibility = at<EligibilityResult>(values, 'eligibility');
      if (!contact?.moiResult || !eligibility || eligibility.hardStop || eligibility.softStop) return null;
      return eligibility.idNumber === contact.idNumber ? (contact.idNumber ?? null) : null;
    },
  },
  {
    id: 'billing',
    stepKey: 'billingAccount',
    label: 'Billing',
    title: 'Billing Profile Ready',
    message: 'Billing profile created for this customer.',
    // Resolved quietly after Customer Verification; the toast belongs to Recommended Offers, the page it leads to, and shows nowhere else.
    announceAt: 'product',
    // The existing profile selected, or a new one created with its contact and bill cycle.
    evidence: ({ values }) => {
      // Collected before Recommended Offers now, so it may be reached before a product is chosen; not for a product with no billing profile.
      if (values.product !== undefined && values.product !== 'postpaid') return null;
      const billing = at<BillingAccountValue>(values, 'billingAccount');
      // Evidence is everything the agent can change on the profile, so amending it re-reaches the milestone; merely visiting the step does not.
      if (billing?.selectedProfileId) return `profile:${billing.selectedProfileId}`;
      const created = billing?.creatingNew ? billing.newAccount : undefined;
      return created?.profileName && created.billCycleDay ? `new:${JSON.stringify(created)}` : null;
    },
  },
  {
    id: 'checkout',
    stepKey: 'checkout',
    label: 'Cart Checked Out',
    title: 'Cart Checked Out',
    message: 'Cart validated and ready for the contract.',
    // The cart is complete (plan, number, SIM, totals) and the agent has confirmed Checkout by moving past it. Going back to look keeps it;
    // changing the cart drops it, and it is reached again when Checkout is confirmed again.
    evidence: ({ values, pastStep, previous }) => {
      const fingerprint = cartFingerprint(values);
      if (!fingerprint) return null;
      return pastStep('checkout') || previous.checkout?.evidence === fingerprint ? fingerprint : null;
    },
  },
  {
    id: 'caf',
    stepKey: 'caf',
    label: 'CAF Signed',
    title: 'CAF Signed',
    message: 'Customer agreement signed successfully.',
    evidence: ({ values }) => {
      const caf = at<{ cafType?: string; signatureDataUrl?: string }>(values, 'caf');
      return caf?.cafType && caf.signatureDataUrl ? `${caf.cafType}:${caf.signatureDataUrl.length}` : null;
    },
  },
  {
    id: 'submitted',
    label: 'Order Submitted',
    title: 'Order Submitted',
    message: 'Order submitted successfully.',
    // Reached the moment the order is in, and the page the agent lands on is the Order Submitted page: no toast on top of it.
    noToast: true,
    // Event-driven: reached when the order is submitted after payment (see NewConnectionWizard).
  },
];

/** Milestone 5's wording when the order was held for approval: submitted, not approved. */
export const SUBMITTED_FOR_APPROVAL_MESSAGE = 'Order submitted and sent for approval.';

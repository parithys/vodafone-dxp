import type { NumberWaiver } from '../../engines/numberWaiver';
import type { EligibilityResult } from '../domain/eligibilityTypes';
import type { SimTypeValue } from '../domain/SimTypeStep';
import type { CheckoutTotals, TncLegalFacts } from './checkoutSummaryModel';
import { SummaryTables } from './CheckoutSummaryTables';
import { CheckoutDefaultLayout } from './CheckoutDefaultLayout';
import { buildDetailedTables } from './checkoutDetailedTables';
import { insertRowsAfter } from './checkoutSummaryRows';
import { useCheckoutSummary } from './useCheckoutSummary';
import type { AddonBillingFrequency } from '../../engines/addonCategories';

interface CheckoutSummaryStepProps {
  /** The Waive Off chosen on Number Selection; Checkout shows the waived amount and the revised upfront charge. */
  numberWaiver?: NumberWaiver;
  customerName: string | undefined;
  /**
   * Service-notification contact, echoed here under the SAME label the
   * Contact step uses ("Alternate phone #" - GuidedContactStep.tsx) rather
   * than a re-worded "Alternate Number", so the agent reads the same phrase
   * on both screens (2026-09-28 request).
   */
  altPhone: string | undefined;
  /** Optional - the postpaid journey no longer collects one. */
  billingMethod?: string;
  productId: string | undefined;
  /**
   * The chosen discount, if any. Added 2026-09-26 because this step did not
   * receive one and so priced every order at full plan rate: with a 15%
   * loyalty discount on a QAR 750 plan it read QAR 800/mo and reported that
   * through onTotalsComputed, while NewPostpaidWizard's onSubmit applied the
   * discount and created the order at 687.50. The agent read the customer a
   * monthly price the order did not carry.
   */
  discountId: string | undefined;
  addonIds: string[];
  addonBilling?: Record<string, AddonBillingFrequency>;
  msisdn: string | undefined;
  numberPriceQar: number | undefined;
  eligibility: EligibilityResult | undefined;
  /** The credit limit in force for the order's new account (the agent's choice, else the default). */
  creditLimitQar?: number;
  /**
   * The agent-set value from Plan & Add-ons' BillLimitEditor (2026-09-28
   * re-integration) - undefined when the agent never touched it, in which
   * case this screen falls back to stating the credit-limit cap rather than
   * a figure nobody actually set.
   */
  billLimit: number | undefined;
  /**
   * SIM Type's own selection (2026-09-28 "Update the Customer Confirmation
   * screen" request) - needed only for the customer-facing Key Information
   * recap below, which reads back what was issued. The agent's own <dl>
   * on this screen has never shown SIM details (2026-09-28 "Customer ID
   * Number, Customer Contact Number and SIM Type are deliberately absent");
   * that decision stands for the agent view, this is a second, separate
   * surface with its own requirements.
   */
  simType: SimTypeValue | undefined;
  onTotalsComputed: (totals: CheckoutTotals) => void;
  /**
   * The same facts, as label/value rows, for the CAF step to read back to the
   * customer before signature. Published from HERE rather than rebuilt there
   * so both surfaces derive from one calculation - the drift this component's
   * own discount bug (2026-09-26) was caused by.
   */
  onSummaryComputed?: (rows: { label: string; value: string }[]) => void;
  /**
   * Returns the agent to Plan & Add-ons (2026-09-28 "Edit" action). The
   * agent then walks Continue forward through Number/SIM Type as normal -
   * both retain their prior values, so this only re-opens the plan/discount/
   * add-ons/bill-limit choice, not a special skip-back-to-Checkout path.
   */
  onEdit: () => void;
  /**
   * 'detailed' renders the two-table read-back (Order Summary, Approximate
   * Bill Explainer) used by New Connection. Default keeps the original layout.
   */
  layout?: 'default' | 'detailed';
  /** See TncLegalFacts - powers the CAF step's dynamic bullet summary. */
  onLegalFactsComputed?: (facts: TncLegalFacts) => void;
  /** Rows the order adds after the plan, in the read-back and the CAF's key information (a Family Plan's package and line). */
  familyRows?: { label: string; value: string }[];
}

// "Checkout" (reference flow step 9, evidenced as SCR "checkout-screen-retail-
// new-postpaid") - read-only order summary presented before CAF generation,
// consolidating every prior step's selections and computing what's due today
// (premium-number delta + device down payment + HRN advance) versus the
// ongoing monthly recurring charge (plan + add-ons + device installment).
export function CheckoutSummaryStep({
  customerName,
  altPhone,
  billingMethod,
  productId,
  discountId,
  addonIds,
  addonBilling,
  msisdn,
  numberPriceQar,
  eligibility,
  creditLimitQar,
  billLimit,
  simType,
  numberWaiver,
  onTotalsComputed,
  onSummaryComputed,
  onEdit,
  onLegalFactsComputed,
  familyRows,
  layout = 'default',
}: CheckoutSummaryStepProps) {
  const derived = useCheckoutSummary({
    customerName,
    productId,
    discountId,
    addonIds,
    addonBilling,
    msisdn,
    numberPriceQar,
    eligibility,
    creditLimitQar,
    simType,
    numberWaiver,
    onTotalsComputed,
    onSummaryComputed,
    onLegalFactsComputed,
    extraRows: familyRows,
  });

  if (layout === 'detailed') {
    const tables = buildDetailedTables({
      ...derived,
      customerName,
      msisdn,
      billLimit,
      simType,
    }).map((t) => (t.title === 'Order Summary' ? { ...t, rows: insertRowsAfter(t.rows, 'Plan Name', familyRows) } : t));
    return (
      <div className="space-y-6">
        <SummaryTables tables={tables} />
      </div>
    );
  }

  return (
    <CheckoutDefaultLayout
      {...derived}
      customerName={customerName}
      altPhone={altPhone}
      billingMethod={billingMethod}
      msisdn={msisdn}
      billLimit={billLimit}
      onEdit={onEdit}
    />
  );
}

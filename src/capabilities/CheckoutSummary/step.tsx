import { isNumberWaiver } from '../../engines/numberWaiver';
import type { ReactNode } from 'react';
import { effectiveCreditLimitQar } from '../../components/patterns/billingAccountModel';
import { CHECKOUT_LABEL, SUBSCRIPTIONS_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { CheckoutSummary, PrepaidCheckout } from './CheckoutSummary';
import { PrepaidCartBody } from './PrepaidCartBody';
import { allLines, isCartValid } from '../../components/patterns/prepaidCartModel';
import type { PrepaidCheckoutTotals, PrepaidLine } from '../../components/patterns/prepaidCartModel';
import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';
import { checkoutSummary } from './summary';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { formatQar } from '../../lib/format';

/**
 * Checkout summary: reads the order's facts from the standard value keys (contact, billingAccount, productId,
 * discountId, addonIds, msisdn, numberPriceQAR, eligibility, billLimit, simType) and stores what it computes
 * (checkoutTotals, cafSummary, legalFacts) for the CAF & Signature step. `editStepKey` says which step
 * the summary's Edit action returns to (the plan step, unless an accepted offer skipped it).
 */
export function checkoutSummaryStep(
  opts: {
    editStepKey?: (values: Record<string, unknown>) => string;
    /** The number the order is for, when it is not `msisdn` (an MNP port-in's donor number). */
    msisdn?: (values: Record<string, unknown>) => string | undefined;
    /** Content above the read-back (a port-in's validation gate). */
    before?: (ctx: { values: Record<string, unknown>; goToStepKey: (key: string) => void }) => ReactNode;
    /** A further condition on continuing (the gate holds); the read-back itself never blocks. */
    isValid?: (values: Record<string, unknown>) => boolean;
    /** Rows the order adds to the read-back and the CAF's key information, after the plan (a Family Plan's package and line). */
    familyRows?: (values: Record<string, unknown>) => { label: string; value: string }[];
  } = {}
): WizardStep {
  return {
    key: 'checkout',
    label: CHECKOUT_LABEL,
    summary: checkoutSummary,
    render: ({ values, setValue, goToStepKey }) => {
      const contact = values.contact as GuidedContactValue | undefined;
      const billingAccount = values.billingAccount as BillingAccountValue | undefined;
      const billingMethod = billingAccount?.selectedProfileId
        ? `Existing account ending …${billingAccount.selectedProfileId.slice(-4)}`
        : billingAccount?.newAccount?.profileName
          ? `${billingAccount.newAccount.profileName} (${billingAccount.newAccount.billMedia ?? 'Email'})`
          : undefined;
      const summary = (
        <CheckoutSummary
          layout="detailed"
          customerName={
            [contact?.firstName, contact?.middleName, contact?.lastName].filter(Boolean).join(' ') || contact?.moiResult?.name
 }
          altPhone={contact?.altPhone}
          billingMethod={billingMethod}
          productId={values.productId as string | undefined}
          discountId={values.discountId as string | undefined}
          addonIds={(values.addonIds as string[] | undefined) ?? []}
          addonBilling={values.addonBilling as Record<string, import('../../engines/addonCategories').AddonBillingFrequency> | undefined}
          msisdn={opts.msisdn ? opts.msisdn(values) : (values.msisdn as string | undefined)}
          numberPriceQar={values.numberPriceQAR as number | undefined}
          eligibility={values.eligibility as EligibilityResult | undefined}
          creditLimitQar={effectiveCreditLimitQar(values.eligibility as EligibilityResult | undefined, values.billingAccount as BillingAccountValue | undefined)}
          billLimit={values.billLimit as number | undefined}
          simType={values.simType as SimTypeValue | undefined}
          numberWaiver={isNumberWaiver(values.numberWaiver) ? values.numberWaiver : undefined}
          onTotalsComputed={(totals) => setValue('checkoutTotals', totals)}
          onSummaryComputed={(rows) => setValue('cafSummary', rows)}
          onLegalFactsComputed={(facts) => setValue('legalFacts', facts)}
          familyRows={opts.familyRows?.(values)}
          onEdit={() => goToStepKey(opts.editStepKey?.(values) ?? 'plan')}
        />
      );
      if (!opts.before) return summary;
      return (
        <div className="space-y-6">
          {opts.before({ values, goToStepKey })}
          {summary}
        </div>
      );
    },
    isValid: (values) => opts.isValid?.(values) ?? true,
 };
}

/** The subscriptions on a prepaid order, for the running Summary panel. */
const subscriptionsSummary: SummaryField[] = [
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    type: 'text',
    value: (v) => {
      const lines = allLines(v);
      return lines.length === 0 ? undefined : lines.map((l) => l.msisdn).join(', ');
    },
  },
];

/**
 * Prepaid "Add another subscription?" (process flow #8.1): lists the subscriptions so far; the footer's Continue is
 * the "No" branch (go on to checkout). Valid once there is a finished subscription and none repeats a number or SIM.
 */
export function prepaidCartStep(): WizardStep {
  return {
    key: 'cart',
    label: SUBSCRIPTIONS_LABEL,
    heading: 'Add another subscription?',
    subheading: 'Each subscription is one pack, one number and one SIM.',
    summary: subscriptionsSummary,
    render: ({ values, setValue, goToStepKey }) => <PrepaidCartBody values={values} setValue={setValue} goToStepKey={goToStepKey} />,
    isValid: isCartValid,
  };
}

/**
 * Prepaid checkout: the read-back of the whole cart. `idType` is the customer's ID type, which decides the SIM card
 * charge. Stores `checkoutTotals` (totalDueQar is what the Payment step collects).
 *
 * A prepaid port-in uses the same step with its own inputs: `lines` (its one subscription), `details` (the port-in number and
 * donor operator), `fees` (the port-in charges: the amount due is those alone, not the pack), `before` (the validation gate above
 * the read-back), `isValid`, `editStepKey` and `totals` (how what it computed is stored, as the port-in's Payment step reads it).
 */
export function prepaidCheckoutStep(opts: {
  idType: (values: Record<string, unknown>) => string | undefined;
  customerName: (values: Record<string, unknown>) => string | undefined;
  lines?: (values: Record<string, unknown>) => PrepaidLine[];
  details?: (values: Record<string, unknown>) => { label: string; value: string }[];
  fees?: { label: string; amountQar: number }[];
  before?: (ctx: { values: Record<string, unknown>; goToStepKey: (key: string) => void }) => ReactNode;
  isValid?: (values: Record<string, unknown>) => boolean;
  editStepKey?: string;
  editLabel?: string;
  totals?: (totals: PrepaidCheckoutTotals) => unknown;
  /** The order changes a line the customer already has (a pack change, an add-on): no SIM rows or SIM card charge; `excludePack` for an add-on on the current pack. */
  existingLine?: { existingSim?: boolean; excludePack?: boolean };
}): WizardStep {
  const linesOf = opts.lines ?? allLines;
  return {
    key: 'checkout',
    label: CHECKOUT_LABEL,
    summary: [{ key: 'due', label: 'Total Payable Today', type: 'text', value: (v) => {
      const due = at(v, 'checkoutTotals', 'totalDueQar') ?? at(v, 'checkoutTotals', 'dueTodayQar');
      return typeof due === 'number' ? formatQar(due) : undefined;
    } }],
    render: ({ values, setValue, goToStepKey }) => {
      const checkout = (
        <PrepaidCheckout
          customerName={opts.customerName(values)}
          idType={opts.idType(values)}
          lines={linesOf(values)}
          details={opts.details?.(values)}
          fees={opts.fees}
          editLabel={opts.editLabel}
          existingLine={opts.existingLine}
          onTotalsComputed={(totals) => setValue('checkoutTotals', opts.totals ? opts.totals(totals) : totals)}
          onEdit={() => goToStepKey(opts.editStepKey ?? 'cart')}
        />
      );
      if (!opts.before) return checkout;
      return (
        <div className="space-y-6">
          {opts.before({ values, goToStepKey })}
          {checkout}
        </div>
      );
    },
    isValid: (values) => opts.isValid?.(values) ?? isCartValid(values),
  };
}

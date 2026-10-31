import { formatQar } from '../../engines/postpaidPricing';
import type { AddonBillingFrequency } from '../../engines/addonCategories';
import { numberWaiverLabel } from '../../engines/numberWaiver';
import type { SimTypeValue } from '../domain/SimTypeStep';
import type { Product, StarNumberTier } from './checkoutSummaryModel';
import type { CheckoutSummaryDerived } from './useCheckoutSummary';
import { toLocalMsisdn } from '../domain/msisdnPickerModel';

/** "Name (QAR 20/mo)" - the suffix follows the add-on's effective billing cadence, never assumes monthly. */
export function addonSummaryLabel(a: Product & { billingFrequency?: AddonBillingFrequency }): string {
  const suffix = a.billingFrequency === 'weekly' ? '/wk' : a.billingFrequency === 'one-time' ? ' one-time' : '/mo';
  return `${a.name} (${formatQar(a.mrcQAR)}${suffix})`;
}

interface CafSummaryRowsArgs
  extends Pick<
    CheckoutSummaryDerived,
    | 'discount'
    | 'addons'
    | 'isStarNumber'
    | 'numberDelta'
    | 'starEntitlementQar'
    | 'numberChargeQar'
    | 'numberWaiver'
    | 'numberWaivedQar'
    | 'dueTodayQar'
    | 'hrnAdvance'
    | 'firstBill'
    | 'monthlyRecurringQar'
    | 'charges'
  > {
  plan: Product;
  customerName: string | undefined;
  msisdn: string | undefined;
  simType: SimTypeValue | undefined;
  starTier: StarNumberTier | undefined;
}

// Customer-facing rows for the CAF step's "Key Information" panel.
//
// Reworked 2026-09-28 ("Ensure all relevant commercial and billing
// information is visible to the customer in the confirmation view, not
// only in the agent view") - this used to be a shorter recap (no SIM
// details, no split-out lock-ins/charges, and it carried Credit limit/Bill
// limit, which are operational figures for the agent to manage, not facts
// the customer signs against). Customer ID Number and VAT stay off this
// panel for the same reason the agent's own <dl> omits the first and never
// itemises the second as a standalone figure: every quoted price here is
// already VAT-inclusive (see monthlyCharges), so a separate VAT line would
// assert a second, uninclusive number alongside it.
export function buildCafSummaryRows({
  plan,
  customerName,
  msisdn,
  simType,
  discount,
  addons,
  isStarNumber,
  numberDelta,
  starTier,
  starEntitlementQar,
  numberChargeQar,
  numberWaiver,
  numberWaivedQar,
  dueTodayQar,
  hrnAdvance,
  firstBill,
  monthlyRecurringQar,
  charges,
}: CafSummaryRowsArgs): { label: string; value: string }[] {
  const simSerial = simType?.simSerial;
  return [
    { label: 'Customer Name', value: customerName ?? '-' },
    { label: 'Selected Number', value: msisdn ? `${toLocalMsisdn(msisdn)} (${isStarNumber ? 'Star' : 'Free'})` : '-' },
    // The number's own catalogue value, separate from what it's actually
    // BILLED at (that's Star Number Charges below, net of BR-115's
    // entitlement) - a free-tier number still has a real catalogue price
    // (2026-09-28 "show its actual price"), it's simply not charged.
    {
      label: 'Number Value',
      value: msisdn ? (isStarNumber ? `${formatQar(numberDelta)} one-time` : `${formatQar(numberDelta)} (no charge to customer)`) : '-',
    },
    { label: 'Plan', value: plan.name },
    { label: 'Plan Price', value: `${formatQar(plan.mrcQAR)}/mo` },
    {
      label: 'Discount',
      value: discount
        ? `${discount.name} (${Math.round(Math.abs(discount.price) * 100)}%) - ${formatQar(charges.discountQar)}/mo`
        : 'None',
    },
    {
      label: 'Discount Duration',
      value: discount ? (discount.durationMonths ? `${discount.durationMonths} months` : 'No expiry') : 'N/A',
    },
    { label: 'Add-Ons', value: addons.length ? addons.map(addonSummaryLabel).join(', ') : 'None' },
    { label: 'SIM Type', value: simType?.simType ?? '-' },
    ...(simType?.simType === 'Physical' ? [{ label: 'SIM Serial Number', value: simSerial ?? '-' }] : []),
    // The eSIM's activation code is deliberately NOT read back here - it is the string that generates the QR, and nothing eSIM-shaped is shown active before payment.
    { label: 'Plan Lock-In', value: plan.commitmentMonths ? `${plan.commitmentMonths} months` : 'No lock-in' },
    ...(isStarNumber
      ? [
          {
            label: 'Star Number Lock-In',
            value: starTier ? `${starTier.lockInDurationMonths} months` : 'To be confirmed',
          },
          {
            label: 'Star Number Charges',
            value:
              starEntitlementQar !== undefined && numberChargeQar > 0
                ? `${formatQar(numberChargeQar)} (${formatQar(numberDelta)} sticker price, ${formatQar(starEntitlementQar)} entitled on this plan)`
                : `No extra charge${starEntitlementQar !== undefined ? ` - within the ${formatQar(starEntitlementQar)} plan entitlement` : ''}`,
          },
          ...(numberWaiver && numberWaivedQar > 0
            ? [{ label: numberWaiverLabel(numberWaiver), value: `${formatQar(numberWaivedQar)} waived off the Star Number charge` }]
            : []),
        ]
      : []),
    {
      label: 'Key Charges',
      value: `${formatQar(dueTodayQar)} today · ${formatQar(firstBill.totalQar)} first bill · ${formatQar(monthlyRecurringQar)}/mo thereafter`,
    },
    {
      label: 'Cancellation Implications',
      value:
        [
          plan.commitmentMonths
            ? `Ending the plan before ${plan.commitmentMonths} months incurs early-termination charges.`
            : null,
          isStarNumber && starTier?.lockInDurationMonths
            ? `The star number carries a separate ${starTier.lockInDurationMonths}-month lock-in.`
            : null,
        ]
          .filter(Boolean)
          .join(' ') || 'No lock-in - this order can be cancelled anytime without early-termination charges.',
    },
    {
      label: 'Total Payable Today',
      value: `${formatQar(dueTodayQar)}${
        [
          hrnAdvance > 0 ? `${formatQar(hrnAdvance)} HRN advance` : null,
          isStarNumber && numberChargeQar > 0 ? `${formatQar(numberChargeQar - numberWaivedQar)} Star Number charge${numberWaivedQar > 0 ? ' after waiver' : ''}` : null,
        ].filter(Boolean).length
          ? ` (includes ${[
              hrnAdvance > 0 ? `${formatQar(hrnAdvance)} HRN advance` : null,
              isStarNumber && numberChargeQar > 0 ? `${formatQar(numberChargeQar - numberWaivedQar)} Star Number charge${numberWaivedQar > 0 ? ' after waiver' : ''}` : null,
            ]
              .filter(Boolean)
              .join(' + ')})`
          : ''
      }`,
    },
    {
      label: 'Prorated First Bill',
      value: `${formatQar(firstBill.totalQar)} (${firstBill.proratedDays} of ${firstBill.cycleDays} days this cycle)`,
    },
    { label: 'Approximate Subsequent Bill', value: `${formatQar(monthlyRecurringQar)}/mo` },
  ];
}

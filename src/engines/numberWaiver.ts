// "Waive Off" on Number Selection: the agent waives a FIXED AMOUNT (QAR) of the Star number's upfront charge - the amount of the number's value above
// the plan's entitlement - never a percentage. The waiver is that amount, kept on the journey as `numberWaiver`. One definition, read by Number
// Selection, Checkout, Payment and the order, so they quote the same figures.

/** The fixed amount waived, in QAR. */
export type NumberWaiver = number;

import { formatQar } from './postpaidPricing';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Whether a value read from a draft is a waiver amount (anything else is no waiver). */
export const isNumberWaiver = (v: unknown): v is NumberWaiver => typeof v === 'number' && Number.isFinite(v) && v > 0;

/** The label the waiver carries wherever it is listed. */
export const numberWaiverLabel = (_w?: NumberWaiver): string => 'Additional Discount';

/** Why an amount cannot be applied to this charge, or undefined when it can: a positive amount, not more than the charge. */
export function waiverAmountProblem(amountQar: number | undefined, chargeQar: number): string | undefined {
  if (amountQar === undefined || !Number.isFinite(amountQar) || amountQar <= 0) return 'Enter an amount greater than zero.';
  if (amountQar > chargeQar) return `The waiver cannot be more than the upfront charge of ${formatQar(chargeQar)}.`;
  return undefined;
}

/** The amount waived off an upfront charge: nothing without a waiver or a charge, otherwise the fixed amount - never more than the charge. */
export function waivedQar(chargeQar: number, waiver: NumberWaiver | undefined): number {
  if (!isNumberWaiver(waiver) || chargeQar <= 0) return 0;
  return round2(Math.min(waiver, chargeQar));
}

/** What is still payable of the charge after the waiver. */
export const chargeAfterWaiverQar = (chargeQar: number, waiver: NumberWaiver | undefined): number => round2(chargeQar - waivedQar(chargeQar, waiver));

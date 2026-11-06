import type { PrepaidLine } from './prepaidCartModel';
import { duplicateIn, isSimComplete } from './prepaidCartModel';
import { offeredPrepaidPacks } from './prepaidPlanModel';
import type { PrepaidPlan } from './prepaidPlanModel';

/**
 * The checks run on a New Prepaid order before it is summarised, simulated from what the journey holds (there is no back-end validation service in the prototype): the
 * customer's account information, the pack's compatibility, the number and the SIM. Each failure is one message for the banner under the page title; none is a postpaid
 * billing-details check (a prepaid order has no billing account).
 */
export interface PrepaidOrderValidationInput {
  customerName: string | undefined;
  idNumber: string | undefined;
  lines: readonly PrepaidLine[];
  /** The Prepaid Plan products, to judge a pack's compatibility with the customer's segment; absent while loading (the compatibility check is then not run). */
  packs?: readonly PrepaidPlan[];
  segment?: string;
}

/** A Qatar mobile number in the E.164 form the number inventory holds: +974 and eight digits. */
const VALID_MSISDN = /^\+?974\d{8}$/;

export function prepaidOrderErrors({ customerName, idNumber, lines, packs, segment }: PrepaidOrderValidationInput): string[] {
  const errors: string[] = [];
  if (!customerName || !idNumber) errors.push('Customer account information is incomplete: the customer\'s name and ID number are required.');
  if (lines.length === 0) errors.push('There is no subscription on this order yet: choose the pack, number and SIM.');
  lines.forEach((line, i) => {
    const label = lines.length > 1 ? `Subscription ${i + 1}: ` : '';
    if (!line.productId) errors.push(`${label}No prepaid pack is selected.`);
    else if (packs && !offeredPrepaidPacks(packs, { segment }).some((p) => p.productId === line.productId)) errors.push(`${label}The selected pack is not compatible with this customer.`);
    if (!VALID_MSISDN.test(line.msisdn.replace(/\s/g, ''))) errors.push(`${label}The selected mobile number is not valid.`);
    if (!isSimComplete(line.simType)) errors.push(`${label}The selected SIM is not valid: scan or enter a valid SIM serial number, or issue the eSIM.`);
  });
  const duplicate = duplicateIn([...lines]);
  if (duplicate) errors.push(`The ${duplicate.kind} ${duplicate.value} is on more than one subscription.`);
  return errors;
}

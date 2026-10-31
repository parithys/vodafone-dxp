// Which discounts a customer is eligible for, driven by their record - never by a hardcoded segment name.
//
// `benefitEligibility` (customers.json, seeded from Customer-Inventory.xlsx's 'Discount eligibility' column by
// reference/scripts/build_customer_inventory.py) lists the benefits a customer holds. Each benefit maps to one
// discount type in the catalogue (addons-discounts.json `addonType`). A segment can add benefits of its own via
// SEGMENT_BENEFITS; none of the inventory's segments carries a discount of its own today, so it is empty and a
// segment without benefits simply sees the standard offers.

export type CustomerBenefit = 'retired' | 'mada' | 'b2b2c' | 'loyalty' | 'prepaid-welcome';

/** Benefit -> the catalogue discount type it unlocks. */
export const BENEFIT_DISCOUNT_TYPE: Record<CustomerBenefit, string> = {
  retired: 'Retired Discount',
  mada: 'MADA Discount',
  b2b2c: 'B2B2C Discount',
  loyalty: 'Loyalty Discount',
  'prepaid-welcome': 'Prepaid Welcome Discount',
};

/** Benefits every customer of a segment holds. Segments: Consumer, Consumer (HRN), Premium, Enterprise (EBU) - none defined. */
export const SEGMENT_BENEFITS: Record<string, CustomerBenefit[]> = {};

const KNOWN = new Set<string>(Object.keys(BENEFIT_DISCOUNT_TYPE));
const DISCOUNT_TYPES = new Set<string>(Object.values(BENEFIT_DISCOUNT_TYPE));

export interface BenefitSource {
  segment?: string;
  benefitEligibility?: string[];
}

/** The benefits a customer holds: their own plus their segment's. */
export function benefitsFor(c: BenefitSource | undefined): CustomerBenefit[] {
  if (!c) return [];
  const own = (c.benefitEligibility ?? []).filter((b): b is CustomerBenefit => KNOWN.has(b));
  const fromSegment = (c.segment && SEGMENT_BENEFITS[c.segment]) || [];
  return [...new Set([...own, ...fromSegment])];
}

/**
 * Keeps the discounts this customer may be offered. `benefits` undefined means the customer is not known (a
 * walk-in who has not been identified), so nothing is filtered. A discount type outside the benefit map is not
 * customer-specific and always stays. `accepted` is a benefit the agent validated in the journey (e.g. Retired
 * confirmed with the government system), which counts even if the record did not list it.
 */
export function discountsForCustomer<T extends { addonType: string }>(discounts: T[], benefits: CustomerBenefit[] | undefined, accepted?: string): T[] {
  if (!benefits) return discounts;
  const allowed = new Set<string>(benefits.map((b) => BENEFIT_DISCOUNT_TYPE[b]));
  if (accepted && KNOWN.has(accepted)) allowed.add(BENEFIT_DISCOUNT_TYPE[accepted as CustomerBenefit]);
  return discounts.filter((d) => !DISCOUNT_TYPES.has(d.addonType) || allowed.has(d.addonType));
}

/**
 * The segment label an agent sees on a customer: Consumer, or Consumer · B2B2C / Retired / MADA when the customer holds
 * that benefit (an employer-reimbursed line first, then Retired, then MADA), or Business for a business account.
 * `reimbursed` is whether the customer's line is paid by their employer and reimbursed to them (billing responsibility USER).
 */
export function segmentLabelFor(c: BenefitSource & { reimbursed?: boolean; business?: boolean }): string {
  if (c.business) return 'Business';
  if (c.reimbursed) return 'Consumer · B2B2C';
  const own = benefitsFor(c);
  if (own.includes('b2b2c')) return 'Consumer · B2B2C';
  if (own.includes('retired')) return 'Consumer · Retired';
  if (own.includes('mada')) return 'Consumer · MADA';
  return 'Consumer';
}

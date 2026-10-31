// The one rule that decides a linked user's segment: billing responsibility, nothing else. Being linked to a business
// does not make a user EBU. Every place that shows or filters a linked user's segment goes through here.

export type AccountType = 'INDIVIDUAL' | 'BUSINESS';
export type BillingResponsibility = 'COMPANY' | 'USER';
export type LinkedUserSegment = 'EBU' | 'CBU';

/** COMPANY pays (and receives the bill) -> EBU; the user pays and is reimbursed -> CBU with B2B2C benefits. */
export function segmentFor(billing: BillingResponsibility): LinkedUserSegment {
  return billing === 'COMPANY' ? 'EBU' : 'CBU';
}

export const SEGMENT_LABEL: Record<LinkedUserSegment, string> = {
  EBU: 'EBU · Company-paid',
  CBU: 'CBU · B2B2C',
};

export const BILLING_LABEL: Record<BillingResponsibility, string> = {
  COMPANY: 'Company',
  USER: 'User (reimbursed)',
};

/** Whether the user receives the company's B2B2C benefits: only when they carry the billing themselves. */
export const hasB2b2cBenefit = (billing: BillingResponsibility) => segmentFor(billing) === 'CBU';

export const isBusinessId = (id: string | undefined) => /^ENT-ACC-/i.test(id ?? '');

/**
 * Whether a customer record's `segment` is a business one. The values in the data are Consumer, Consumer (HRN), Premium and Enterprise (EBU);
 * this is the one reading of it (Customer 360, Telesales, the demo values, queue lookups, billing profile limits and ticket priority each had
 * their own pattern, one of them comparing against the literal 'Enterprise', which no record carries). A linked user's EBU / CBU split is
 * a different question: that is `segmentFor`, by billing responsibility.
 */
export const isBusinessSegment = (segment: string | undefined | null): boolean => /enterprise|business|b2b|ebu|corporate|government/i.test(segment ?? '');

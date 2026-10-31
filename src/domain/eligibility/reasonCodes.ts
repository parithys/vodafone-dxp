import type { ApprovalType, CountSnapshot } from './types';

/** Stable, i18n-ready keys. Never reword a code; add a new one. */
export const REASON = {
  INPUT_INVALID: 'INPUT_INVALID',
  PROFILE_UNRESOLVED: 'PROFILE_UNRESOLVED',
  ELIG_MOBILE_TOTAL_CAP_REACHED: 'ELIG_MOBILE_TOTAL_CAP_REACHED',
  ELIG_POSTPAID_CAP_REACHED: 'ELIG_POSTPAID_CAP_REACHED',
  ELIG_PREPAID_CAP_REACHED: 'ELIG_PREPAID_CAP_REACHED',
  ELIG_FIXED_FWA_CAP_REACHED: 'ELIG_FIXED_FWA_CAP_REACHED',
  APPR_CC_POSTPAID_THRESHOLD: 'APPR_CC_POSTPAID_THRESHOLD',
  APPR_CC_FIXED_FWA_THRESHOLD: 'APPR_CC_FIXED_FWA_THRESHOLD',
  APPR_BAU_PASSPORT_POSTPAID: 'APPR_BAU_PASSPORT_POSTPAID',
  APPR_CC_PASSPORT_POSTPAID_THRESHOLD: 'APPR_CC_PASSPORT_POSTPAID_THRESHOLD',
  APPR_EXCEPTION_UNDER_18: 'APPR_EXCEPTION_UNDER_18',
} as const;

/** The deterministic order approvals are returned in. */
export const APPROVAL_ORDER: readonly ApprovalType[] = ['BAU', 'CREDIT_CONTROL', 'EXCEPTION_UNDER_18'];

const heldMobile = (c: CountSnapshot) => `${c.mobileTotal} mobile lines (${c.prepaid} prepaid, ${c.postpaid} postpaid)`;
const limitText = (max: number | null) => (max === null ? 'no limit' : String(max));

// Agent-facing messages: plain language, with the counts the decision rests on.
export const message = {
  inputInvalid: (problems: string[]) => `The request is not valid: ${problems.join('; ')}.`,
  profileUnresolved: () => 'The customer segment cannot be resolved: the nationality is missing or not a two-letter country code.',
  mobileTotalCap: (c: CountSnapshot, max: number | null) =>
    `Customer holds ${c.mobileTotal} of ${limitText(max)} mobile lines (${c.prepaid} prepaid, ${c.postpaid} postpaid). New mobile activation not permitted.`,
  postpaidCap: (c: CountSnapshot, max: number | null) => `Customer holds ${c.postpaid} of ${limitText(max)} postpaid lines. New postpaid activation not permitted.`,
  prepaidCap: (c: CountSnapshot, max: number | null) => `Customer holds ${c.prepaid} of ${limitText(max)} prepaid lines (${heldMobile(c)} in all). New prepaid activation not permitted.`,
  fixedFwaCap: (c: CountSnapshot, max: number | null) => `Customer holds ${c.fixedFwa} of ${limitText(max)} Fixed/FWA lines. New Fixed/FWA activation not permitted.`,
  creditControlPostpaid: (ordinal: number) => `Postpaid line number ${ordinal} for this customer needs Credit Control approval.`,
  creditControlFixedFwa: (ordinal: number) => `Fixed/FWA line number ${ordinal} for this customer needs Credit Control approval.`,
  bauPassport: () => 'A postpaid activation on a passport needs BAU approval.',
  creditControlPassport: (ordinal: number) => `Postpaid line number ${ordinal} on a passport needs Credit Control approval.`,
  exceptionUnder18: (age: number) => `The account holder is ${age}, under the minimum age: an under-18 exception approval is needed.`,
};

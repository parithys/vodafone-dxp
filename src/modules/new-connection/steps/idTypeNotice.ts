import type { EligibilityCheck } from '../../../engines/eligibilityEngine';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';

/** The draft value that carries the notice to the page after the Recommended Offer: `true` until a page claims it, then that page's step key. */
export const ID_TYPE_NOTICE = 'idTypeNotice';

/** The ID-type check, when the journey chosen routes the order for approval because of it (a Passport on postpaid, say; never a Passport on prepaid). */
export const idTypeApprovalOf = (eligibility: EligibilityResult | undefined): EligibilityCheck | undefined =>
  eligibility?.checks.find((c) => c.id === 'id-type-routing' && c.outcome === 'approval-routing');

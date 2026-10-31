import type { CompanySelection } from './CompanySearchInput';
import type { QidImageUploadValue } from './qidImageUploadModel';

export type SpecialDiscountType = 'none' | 'b2b2c' | 'retired' | 'mada';

export interface SpecialDiscountsValue {
  type?: SpecialDiscountType;
  company?: CompanySelection;
  /** B2B2C: the employee's ID number at the partner company. Optional. */
  idNumber?: string;
  officeId?: QidImageUploadValue;
  /** The supporting document (scanned or uploaded) is accepted automatically once it is complete and clear; recomputed on every retake or new upload. */
  officeAccepted?: boolean;
  /** The supporting document was uploaded instead of scanned (file name and size only). */
  /** The agent rejected the benefit: the customer continues as Standard, and an employer on the MOI record no longer makes the order B2B2C. */
  rejected?: boolean;
}

/** Job title that approves a manually-entered identity. There is no separate "Store Manager" title in the agent directory; Sales Manager is the store-level approver (it already approves MNP port-ins). */
export const STORE_MANAGER_ROLE = 'Sales Manager';

/** Job title that approves an order held for an active-postpaid-line limit. The directory has no "Collection Team" title; Credit Control is its collections role. */
export const COLLECTION_TEAM_ROLE = 'Credit Control';

/** Job title that approves an order routed for its ID type (Passport, GCC ID, other exception documents). */
export const ID_TYPE_APPROVER_ROLE = 'Back Office Fulfilment';

export const TYPE_OPTIONS: { key: SpecialDiscountType; label: string; description: string }[] = [
  { key: 'none', label: 'Standard Customer', description: 'None of B2B2C, Retiree or MADA applies' },
  { key: 'b2b2c', label: 'Consumer B2B2C', description: 'Employee of a supported partner company' },
  { key: 'retired', label: 'Retiree', description: 'Agent validates the applicable information' },
  { key: 'mada', label: 'MADA', description: 'Agent validates the applicable information' },
];

/** A company counts as found and supported when it is in the enterprise-accounts
 * registry; "Add new company" (companyIsNew) is not a supported company. */
export const isCompanySupported = (c: CompanySelection | undefined) => Boolean(c?.companyAccountId) && !c?.companyIsNew;

export function isCustomerTypeValid(v: SpecialDiscountsValue | undefined): boolean {
  if (!v?.type) return false;
  if (v.type === 'none') return true;
  // Evidence is a scanned OR an uploaded supporting document, and it must be clear (accepted automatically).
  const scanned = Boolean(v.officeId?.frontScanned && v.officeId?.backScanned && v.officeAccepted);
  // Retired and MADA: the supporting document, accepted by the agent - nothing is sent to any government system. B2B2C: the company is the only
  // requirement; the ID number and the ID scan/upload are optional.
  if (v.type === 'b2b2c') return isCompanySupported(v.company);
  return scanned;
}

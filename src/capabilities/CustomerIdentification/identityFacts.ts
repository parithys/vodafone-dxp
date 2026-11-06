import type { QidType } from '../../components/domain/QidInput';
import { idNumberLabel } from '../../components/domain/qidModel';

/** The icon tile a fact is drawn with. */
export type FactIcon = 'user' | 'users' | 'calendar' | 'globe' | 'gender' | 'idCard' | 'building';

export interface Fact {
  label: string;
  value: string;
  icon: FactIcon;
  /** Ends its row early (the next fact starts a new row), instead of filling it to three. */
  endsRow?: boolean;
}

/** The identity facts every Customer Verification result shows. */
export interface IdentityFields {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  idExpiryDate?: string;
  nationality?: string;
  gender?: string;
  idTypeLabel?: string;
  /** The ID number looked up. Listed only when the caller asks for it (see identityFacts' `idType`). */
  idNumber?: string;
  companyName?: string;
  occupation?: string;
}

/**
 * One list of facts for every journey, so the card reads the same everywhere. The content follows the context:
 * the document type is left out where the agent already chose it (`showDocumentType` false). Sponsor and Occupation are not listed:
 * they are captured, and shown in Customer 360 only.
 */
export function identityFacts(f: IdentityFields, opts: { showDocumentType?: boolean; idType?: QidType } = {}): Fact[] {
  const { showDocumentType = true, idType } = opts;
  const expiry: Fact = { icon: 'calendar', label: 'ID Expiry Date', value: f.idExpiryDate ?? '' };
  const names: Fact[] = [
    { icon: 'user', label: 'First Name', value: f.firstName ?? '' },
    { icon: 'users', label: 'Middle Name(s)', value: f.middleName ?? '' },
    { icon: 'user', label: 'Last Name', value: f.lastName ?? '' },
  ];
  const dob: Fact = { icon: 'calendar', label: 'Date of Birth', value: f.dob ?? '' };
  const rest: Fact[] = [
    { icon: 'globe', label: 'Nationality', value: f.nationality ?? '' },
    { icon: 'gender', label: 'Gender', value: f.gender ?? '' },
    ...(showDocumentType ? [{ icon: 'idCard' as const, label: 'Document Type', value: f.idTypeLabel ?? '' }] : []),
    // Sponsor and Occupation are captured (on the contact and the order) but not shown in a journey: they are visible in Customer 360 only.
  ];
  // The ID that was looked up leads, read-only, when the caller passes the ID type that names it ("Qatar ID (QID) Number"): the ID number and
  // its expiry and the date of birth on the first row, the three names on the second, then nationality and gender.
  if (idType && f.idNumber) {
    return [
      { icon: 'idCard', label: idNumberLabel(idType), value: f.idNumber },
      expiry,
      { ...dob, endsRow: true },
      names[0],
      names[1],
      { ...names[2], endsRow: true },
      ...rest,
    ];
  }
  return [names[0], names[1], names[2], dob, expiry, ...rest];
}

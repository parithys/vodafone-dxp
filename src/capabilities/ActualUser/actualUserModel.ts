import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { isValidEmail, isValidAltPhone } from '../../components/patterns/guidedContactModel';
import { ageOn, isIdExpired, MINIMUM_AGE } from '../../engines/eligibilityEngine';
import { toLocalMsisdn } from '../../components/domain/msisdnPickerModel';
import type { AdditionalDocument } from '../DocumentUpload';

/**
 * ACTUAL USER - who will really use the line when it is not the customer who owns it (a parent buys, the daughter uses the SIM).
 * The customer stays the primary owner and signs the CAF; the actual user is identified like the primary (ID type, scan, MOI, email,
 * phone) and is named on the Supplementary Form.
 *
 * `choice` absent means the default: the primary customer uses the line.
 *
 * The eligibility checks are NOT run for an actual user, because the primary customer stays accountable for the MSISDN and the connection
 * counts against the primary customer's own limit: Number of Connections, HRN, and the Collections, Grey List and Security blacklists.
 * The one rule that applies to the actual user is age: a Secondary Contact must be 18 or over, so a minor cannot be added (see actualUserAgeProblem).
 * Associating the actual user with the service does NOT count it as an active line against the actual user's ID: the line stays on the primary
 * customer's ID (the order carries the primary's customerId; the actual user is only named on it).
 */
/** The Exception Request for a Secondary Contact under 18: the Court Order, made for the person it was attached for. */
export interface ActualUserException {
  document: AdditionalDocument;
  /** The ID number of the minor it was made for: a different person means it no longer stands. */
  idNumber: string;
  submittedAt: string;
}

export interface ActualUserValue {
  choice?: 'primary' | 'other';
  /** Set when the Secondary Contact is under 18 and the agent applied for the exception with the supporting document (the Court Order). */
  exception?: ActualUserException;
  /** The actual user's identification and contact details - the same value Customer Verification produces for the primary. */
  identity?: GuidedContactValue;
}

export const isOtherUser = (v: ActualUserValue | undefined): boolean => v?.choice === 'other';

/** The actual user's details once they are complete: identified (MOI), a valid email, an alternate phone only if it is valid. */
export function actualUserIdentity(v: ActualUserValue | undefined): GuidedContactValue | undefined {
  const i = v?.identity;
  if (!isOtherUser(v) || !i?.moiResult) return undefined;
  if (!isValidEmail(i.email)) return undefined;
  if (i.altPhone && !isValidAltPhone(i.altPhone)) return undefined;
  return i;
}

/**
 * Why this person cannot be the actual user on age, or undefined when they can: the actual user (the Secondary Contact) must be 18 or over;
 * a minor cannot be added. A date of birth that is not on record cannot be judged, so it blocks too (unknown stays unknown).
 */
export function actualUserAgeProblem(identity: GuidedContactValue | undefined, asOf: Date = new Date()): string | undefined {
  const dob = identity?.moiResult?.dob;
  if (!identity?.moiResult) return undefined;
  const age = ageOn(dob, asOf);
  if (age === undefined) return 'The date of birth is not on record, so the age cannot be checked. An actual user must be 18 or over.';
  return age < MINIMUM_AGE ? `An actual user must be ${MINIMUM_AGE} or over; a minor cannot be added. This customer is ${age}.` : undefined;
}

/** The person is a minor: their date of birth is on record and they are under 18 (a date of birth that is not on record is not a minor, it is unknown). */
export function actualUserIsMinor(identity: GuidedContactValue | undefined, asOf: Date = new Date()): boolean {
  const age = ageOn(identity?.moiResult?.dob, asOf);
  return age !== undefined && age < MINIMUM_AGE;
}

/** The exception stands: the person is under 18, and the Court Order was attached for THIS person (a different ID, or a removed document, means it does not). */
export function minorExceptionHolds(v: ActualUserValue | undefined, asOf: Date = new Date()): boolean {
  if (!isOtherUser(v) || !v?.exception?.document) return false;
  const i = v.identity;
  return actualUserIsMinor(i, asOf) && sameId(v.exception.idNumber, i?.idNumber);
}

/** The step may continue when the primary customer uses the line, or the actual user is fully identified and is not the primary themself. */
export function isActualUserValid(v: ActualUserValue | undefined, primaryIdNumber?: string): boolean {
  if (!isOtherUser(v)) return true;
  const i = actualUserIdentity(v);
  if (!i) return false;
  // A minor cannot be added through the standard flow; only with the Exception Request (Court Order) for them.
  if (actualUserAgeProblem(i) && !minorExceptionHolds(v)) return false;
  return !sameId(i.idNumber, primaryIdNumber);
}

/** The actual user cannot be the primary customer: the same ID number means "the primary customer uses the line". */
export const sameId = (a?: string, b?: string): boolean => Boolean(a && b) && a!.replace(/\s/g, '').toUpperCase() === b!.replace(/\s/g, '').toUpperCase();

/** What the Supplementary Form shows about the actual user (label/value rows), or none when the primary customer uses the line. */
export function supplementaryRows(v: ActualUserValue | undefined): { label: string; value: string }[] {
  const i = actualUserIdentity(v);
  if (!i) return [];
  return [
    { label: 'Actual User', value: i.moiResult?.name ?? '-' },
    { label: i.idType ? `${i.idType} number` : 'ID number', value: i.idNumber ?? '-' },
    { label: 'Nationality', value: i.moiResult?.nationality ?? '-' },
    { label: 'Date of Birth', value: i.moiResult?.dob ?? '-' },
    { label: 'Email', value: i.email ?? '-' },
    ...(i.altPhone ? [{ label: 'Work Number', value: toLocalMsisdn(i.altPhone) }] : []),
  ];
}

const phoneKey = (p: string | undefined) => (p ?? '').replace(/[\s-]/g, '').replace(/^\+?974/, '');

/**
 * Identifying an actual user who is already a customer pre-fills their phone from the customer record (their email already arrives with the
 * MOI result). Only when a DIFFERENT person is resolved than before, so what the agent then edits is kept, and only a number that is a valid
 * Qatar mobile (the field's own rule): an unknown or unusable value stays empty, never guessed. A new person has no record to read.
 */
export function withRecordPhone(prev: GuidedContactValue | undefined, next: GuidedContactValue): GuidedContactValue {
  const m = next.moiResult;
  if (!m?.customerId || m.isNewCustomer || m.customerId === prev?.moiResult?.customerId) return next;
  return isValidAltPhone(m.phone) ? { ...next, altPhone: m.phone } : next;
}

/**
 * For an actual user who is already a customer: what the agent confirmed or changed, to write back so their records and the Supplementary Form
 * agree. `patch` is the email (the customer record holds it); `contactPatch` is the phone, for their existing contact-level record
 * (`customer-contacts`, `cellNumber`). Only what differs from the record is returned; nothing for a new person, nothing for a cleared field.
 */
export function contactUpdateFor(v: ActualUserValue | undefined): { customerId: string; patch: { email?: string }; contactPatch?: { cellNumber: string } } | undefined {
  const i = actualUserIdentity(v);
  const m = i?.moiResult;
  if (!i || !m?.customerId || m.isNewCustomer) return undefined;
  const patch: { email?: string } = {};
  if (i.email && i.email !== m.email) patch.email = i.email;
  const contactPatch = i.altPhone && phoneKey(i.altPhone) !== phoneKey(m.phone) ? { cellNumber: i.altPhone } : undefined;
  if (!Object.keys(patch).length && !contactPatch) return undefined;
  return { customerId: m.customerId, patch, ...(contactPatch ? { contactPatch } : {}) };
}

/**
 * Which customer the simulated card reader presents for the actual user: the first customer aged 18 or over, other than the primary, holding an
 * unexpired QID with a real QID number (11-14 digits). By rule, not by name.
 */
export function pickDemoReaderCustomer(
  customers: { customerId: string; dob?: string }[],
  docs: { customerId: string; documentType: string; documentNumber: string; expiryDate?: string }[],
  primaryCustomerId: string | undefined,
  asOf: Date = new Date()
): string | undefined {
  return customers.find((c) => {
    if (c.customerId === primaryCustomerId) return false;
    const age = ageOn(c.dob, asOf);
    if (age === undefined || age < MINIMUM_AGE) return false;
    return docs.some(
      (d) => d.customerId === c.customerId && d.documentType === 'QID' && /^\d{11,14}$/.test(d.documentNumber) && (!d.expiryDate || !isIdExpired(d.expiryDate, asOf))
    );
  })?.customerId;
}

/**
 * Which customer the simulated card reader presents for "Scan Below 18": the first customer under 18, other than the primary, of the SAME nationality as the
 * primary contact, holding an unexpired QID with a real QID number (11-14 digits). By rule, not by name; undefined when nobody qualifies (the demo data has no
 * such person for that nationality) - never someone of another nationality.
 */
export function pickDemoUnderEighteenCustomer(
  customers: { customerId: string; dob?: string; nationality?: string }[],
  docs: { customerId: string; documentType: string; documentNumber: string; expiryDate?: string }[],
  primaryCustomerId: string | undefined,
  primaryNationality: string | undefined,
  asOf: Date = new Date()
): string | undefined {
  const nat = primaryNationality?.trim().toLowerCase();
  if (!nat) return undefined;
  return customers.find((c) => {
    if (c.customerId === primaryCustomerId) return false;
    if (c.nationality?.trim().toLowerCase() !== nat) return false;
    const age = ageOn(c.dob, asOf);
    if (age === undefined || age >= MINIMUM_AGE) return false;
    return docs.some(
      (d) => d.customerId === c.customerId && d.documentType === 'QID' && /^\d{11,14}$/.test(d.documentNumber) && (!d.expiryDate || !isIdExpired(d.expiryDate, asOf))
    );
  })?.customerId;
}

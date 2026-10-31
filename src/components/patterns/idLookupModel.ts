import type { QidImageUploadValue } from '../domain/qidImageUploadModel';
import type { QidType } from '../domain/QidInput';
import { isHrn } from '../../engines/hrnConfiguration';
import { isIdExpired } from '../../engines/eligibilityEngine';

/** A customer record that shares the scanned ID with others - offered to the agent to choose from. */
export interface DuplicateCandidate {
  customerId: string;
  name: string;
  dob: string;
}

/**
 * The address the NAS (national address register) holds for a person. A record of the register, kept as it was returned: it is stored with the
 * order, NEVER shown to the agent, and never used to fill or overwrite the Address step - the customer's address is captured through the address flow.
 */
export interface NationalAddress {
  zone?: string;
  streetNo?: string;
  buildingNo?: string;
  area?: string;
  city?: string;
}

export interface MoiResult {
  /** Mobile number and notification language on the customer record - shown by
   * the verify-then-fetch flow only. */
  phone?: string;
  preferredLanguage?: string;
  name: string;
  /** Set when the ID resolved to an existing Vodafone customer (Siebel); absent for a NAS-only new customer. */
  customerId?: string;
  /** The registry's own name parts, when it returns them. The Contact step prefers these over splitting `name` by position, so a middle name of several tokens is never guessed at. */
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob: string;
  nationality: string;
  email?: string;
  /** A new customer's mobile number as the NAS holds it (E.164): offered, masked, as the Personal Mobile. */
  mobile?: string;
  /** Where `email` came from: Siebel for an existing customer, NAS for a new one. */
  emailSource?: 'Siebel' | 'NAS' | 'Billing Profile';
  /** No customer record exists for this ID - details come from NAS, not Siebel. */
  isNewCustomer?: boolean;
  /** Set when a QID known only to the registry resolved to an EXISTING customer (through the Passport linked to it): the order adds the QID to that customer's record. */
  linkedIdUpdate?: import('./idLinkModel').LinkedIdUpdate;
  /** The agent created this customer: no registry knows the ID, so the identity was typed (see buildNewCustomerIdentity). */
  createdByAgent?: boolean;
  /** A NEW customer's National Address, as the NAS returned it. Hidden: carried with the identity, stored with the order, never displayed or edited. */
  nationalAddress?: NationalAddress;
  // Added 2026-09-24 so Gender can be registry-sourced. It has to be: the
  // identity fields are non-editable, and a mandatory field with no source
  // and no way to type into it would block Continue forever. customers.json
  // has carried `gender` all along; only MoiResult was not passing it on.
  gender?: string;
  // The sponsoring employer, when the registry has one on file. Added
  // 2026-09-26 so B2B2C can be DERIVED rather than ticked: the Contact step's
  // "B2B2C Order" checkbox was removed, and this is what replaces it.
  //
  // Strictly this is not MOI data - an employment relationship is not held by
  // the interior ministry - but it travels with the customer record the lookup
  // resolves, and inventing a second round trip to a system this app has no
  // evidence of would be pretending to know more about the integration than
  // the corpus says. Named companyName to match the field it comes from.
  companyName?: string;
  /**
   * The employer's row in `enterprise-accounts`, resolved here rather than by
   * the Contact step.
   *
   * Resolved at the same point the customer is, because this is where the data
   * layer already is - GuidedContactStep is a pure presentational component
   * with no state, no effects and no dataset reads, and giving it one just to
   * turn a name into an id would change its character for no gain. Carrying
   * the id matters because a NAME is not a link: two Lulu branches share a CR
   * prefix and differ only by suffix, so downstream needs the id to know which
   * account sponsors the line.
   */
  companyAccountId?: string;
  /** The occupation on the registry record, when it holds one. */
  occupation?: string;
  /**
   * The scanned document's own expiry date (ISO), not a customer-record field -
   * it comes off the `identity-documents` match, not `customers`. This is the
   * same date eligibilityEngine already reads off that record to run its ID
   * validity check; it just never travelled any further than that engine
   * until now. See identity-documents.json's `_expiryNote` for why the field
   * exists on that dataset at all.
   */
  expiryDate?: string;
  /**
   * When this lookup last resolved (ISO), stamped by runMoiValidation below.
   * Evidenced as "MOI Update Time" on the backend Contact/Account record
   * across multiple guided-journey walkthroughs (e.g. "MOI Update Time
   * 8/18/2025 03:58:20") - not previously carried into this app. Overwritten
   * on every fresh validation, so it always reads the latest one, not the
   * first.
   */
  moiUpdateTime?: string;
}

// TWO, per 2026-09-28 direction ("Allow a maximum of two scanning attempts").
// Was four, from the reference asset's "Scan Attempts: 0 / 4".
//
// Both attempts pass over the reader; after the second the scanner locks and
// the manual fallback opens. Nothing in the UI names this number or shows a
// count - see the scanner block below.
export const MAX_SCAN_ATTEMPTS = 2;

// The original budget, still used by the eight journeys that lead with a type
// selector rather than auto-detection.
export const LEGACY_MAX_SCAN_ATTEMPTS = 4;

/**
 * ID types with a physical card the reader can capture, and therefore the
 * scan-first workflow: both faces in one operation, the number read off the
 * document, a four-attempt budget and a manual fallback behind it.
 *
 * Diplomatic ID joined QID on 2026-09-25 - a postpaid connection may be sold
 * directly against either, so both get the same process rather than QID
 * getting a scanner and its equal being typed in by hand.
 *
 * All four supported ID types (Qatar ID, Passport, GCC ID, Diplomatic ID) are scanned before the
 * journey can proceed (2026-10-04): the number is read from the scan, not typed in.
 */
export { SCANNABLE_ID_TYPES } from '../../data/idTypes';

export type IdLookupValue = {
  idType?: QidType;
  idNumber?: string;
  moiResult?: MoiResult;
  qidScans?: QidImageUploadValue;
  /** verifyThenFetch only: the expiry read off the scan (DD/MM/YYYY), editable so the agent can correct it after comparing with the card. */
  scannedExpiry?: string;
  /** verifyThenFetch only: the attribute-level result of comparing what was captured with what MOI returned (kept with the identity evidence). */
  idReconciliation?: import('./idReconciliation').AttributeMatch[];
  /** The number was typed after the scan budget ran out, not read from a scan: the order needs Store Manager approval. */
  manualEntry?: boolean;
};

// ISO (YYYY-MM-DD) -> DD/MM/YYYY, the format the card shows and the field takes.
// Simulated OCR misread for the blurred first pass: swaps look-alike digits
// (3/8, 1/7, 0/6), guaranteed to differ from the real number.
export const misread = (n: string) => {
  const swap: Record<string, string> = { '3': '8', '8': '3', '1': '7', '7': '1', '0': '6', '6': '0' };
  const i = [...n].findIndex((c) => c in swap);
  if (i < 0) return n.slice(0, -1) + (n.endsWith('9') ? '8' : '9');
  return n.slice(0, i) + swap[n[i]] + n.slice(i + 1);
};

export const isoToDmy = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

/**
 * Which identity documents the reader can resolve a scan to.
 *  - The customer's own documents (journey opened from Customer 360): the one of the type the agent selected, never a
 *    different one - a customer who also holds a QID must not have it substituted for the Passport that was chosen.
 *    With no selection (scan-first flow) their QID is preferred where they hold one.
 *  - Otherwise every document of a detectable type.
 */
export function selectScanCandidates<D extends { documentType: string }>({
  docs,
  ownDocs,
  chosenType,
  detectable,
}: {
  docs: D[];
  ownDocs: D[] | undefined;
  chosenType: string | undefined;
  detectable: readonly string[];
}): D[] {
  if (!ownDocs) return docs.filter((d) => detectable.includes(d.documentType));
  if (chosenType) return ownDocs.filter((d) => d.documentType === chosenType);
  return [...ownDocs].sort((a, b) => Number(b.documentType === 'QID') - Number(a.documentType === 'QID'));
}

/** A NAS identity record as the demo scan needs it. */
export interface DemoNasRecord {
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
  name: string;
  dob: string;
  nationality: string;
  mobile?: string;
}

/**
 * The person the demo reader returns in the New Customer journey (every ID there is treated as a new customer, so the card is a NAS
 * identity, never a Siebel customer): the first unexpired NAS record of the given document type whose nationality is HRN. Demo scope,
 * stated plainly - a real reader returns whatever card is in it. The same record drives the card drawn in the reader, the number the
 * reader reads and what MOI returns, so the scan reconciles. Undefined when the type has no HRN record (the reader then behaves as before).
 */
export function pickHrnDemoNas<R extends DemoNasRecord>(records: readonly R[], documentType: string, now: Date = new Date()): R | undefined {
  return records.find((r) => r.documentType === documentType && isHrn(r.nationality) && !(r.expiryDate && isIdExpired(r.expiryDate, now)));
}

/**
 * How the ID number and expiry came in at Customer Verification, which decides what the agent may change:
 *   'upload'      a file was uploaded: nothing is read; the agent types the number and the expiry, then Fetch.
 *   'ocr-auto'    the first scan and Retake 1: a clear capture, number and expiry read correctly, MOI called automatically. Nothing to edit.
 *   'ocr-number'  Retake 2: the number is read (locked); the expiry is typed and stays editable, then Fetch.
 *   'barcode'     Retake 3 and after: the number comes from the barcode button; the expiry is typed and stays editable, then Fetch.
 */
export type CaptureMode = 'upload' | 'ocr-auto' | 'ocr-number' | 'barcode';

/** The capture mode for a completed capture: an upload, or the number of passes over the reader so far. */
export function captureModeOf(uploaded: boolean, readerPasses: number): CaptureMode {
  if (uploaded) return 'upload';
  if (readerPasses <= 2) return 'ocr-auto';
  if (readerPasses === 3) return 'ocr-number';
  return 'barcode';
}

/** A DD/MM/YYYY date as a blurred read would get it wrong: the last digit of the year is off. */
export function misreadDate(dmy: string): string {
  return dmy.replace(/(\d)$/, (d) => String((Number(d) + 3) % 10));
}

/**
 * A typed date tidied to DD/MM/YYYY when the agent leaves the field: eight digits ("30112029") get their separators, and a date written with
 * other separators or without leading zeros ("30-11-2029", "3.1.2029") is put in the same form. Anything else is left exactly as typed.
 */
export function formatDmyOnBlur(text: string): string {
  const t = text.trim();
  const digits = /^\d{8}$/.exec(t);
  if (digits) return `${t.slice(0, 2)}/${t.slice(2, 4)}/${t.slice(4)}`;
  const parts = /^(\d{1,2})[\s./-](\d{1,2})[\s./-](\d{4})$/.exec(t);
  return parts ? `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[3]}` : text;
}

/** What the agent enters to create a customer no registry knows. */
export interface NewCustomerInput {
  nationality: string;
  firstName: string;
  middleName: string;
  lastName: string;
  /** DD/MM/YYYY. */
  dob: string;
  gender: string;
  /** DD/MM/YYYY: the ID's own expiry. */
  expiry: string;
}

/** DD/MM/YYYY -> ISO, or undefined when it is not a real calendar date. */
export function dmyToIso(dmy: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dmy.trim());
  if (!m) return undefined;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d ? `${m[3]}-${m[2]}-${m[1]}` : undefined;
}

export type NewCustomerErrors = Partial<Record<keyof NewCustomerInput, string>>;

/**
 * The MOI-shaped identity for a customer the agent creates, or what is wrong with the entry. Nothing is assumed: every field but the middle
 * name is required, the dates must be real, the birth date cannot be in the future, and the nationality must be one the app knows.
 */
export function buildNewCustomerIdentity(
  input: NewCustomerInput,
  nationalities: readonly string[],
  now: Date = new Date()
): { errors: NewCustomerErrors } | { errors?: undefined; moi: NewCustomerMoi } {
  const errors: NewCustomerErrors = {};
  const first = input.firstName.trim();
  const middle = input.middleName.trim();
  const last = input.lastName.trim();
  if (!nationalities.includes(input.nationality)) errors.nationality = 'Choose the nationality.';
  if (!first) errors.firstName = 'Enter the first name.';
  if (!last) errors.lastName = 'Enter the last name.';
  const dob = dmyToIso(input.dob);
  if (!dob) errors.dob = 'Enter a valid date of birth as DD/MM/YYYY.';
  else if (new Date(`${dob}T00:00:00Z`).getTime() > now.getTime()) errors.dob = 'The date of birth cannot be in the future.';
  if (!input.gender) errors.gender = 'Choose the gender.';
  const expiry = dmyToIso(input.expiry);
  if (!expiry) errors.expiry = 'Enter a valid expiry date as DD/MM/YYYY.';
  if (Object.keys(errors).length || !dob || !expiry) return { errors };
  return {
    moi: {
      name: [first, middle, last].filter(Boolean).join(' '),
      firstName: first,
      middleName: middle,
      lastName: last,
      dob,
      nationality: input.nationality,
      gender: input.gender,
      expiryDate: expiry,
      isNewCustomer: true,
      createdByAgent: true,
      moiUpdateTime: now.toISOString(),
    },
  };
}

/** The ID types a customer can be created for when no registry knows the document. */
export const NEW_CUSTOMER_ID_TYPES: readonly string[] = ['QID', 'Passport', 'Diplomatic ID'];

/**
 * What the value gains when the agent creates a customer: the typed identity as the MOI result, the expiry as the entered one, and the
 * identity marked as manually entered (so the order is routed for manager approval, as for any identity the reader did not read).
 */
export type NewCustomerMoi = Pick<MoiResult, 'name' | 'firstName' | 'middleName' | 'lastName' | 'dob' | 'nationality' | 'gender' | 'expiryDate' | 'isNewCustomer' | 'createdByAgent' | 'moiUpdateTime'>;

export function buildNewCustomerPatch(moi: NewCustomerMoi): { moiResult: MoiResult; manualEntry: true; scannedExpiry?: string } {
  return { moiResult: moi as MoiResult, manualEntry: true, scannedExpiry: moi.expiryDate ? isoToDmy(moi.expiryDate) : undefined };
}

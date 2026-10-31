import type { QidType } from '../domain/QidInput';
import type { QidImageUploadValue } from '../domain/qidImageUploadModel';
import { isQatarMobileLocalNumber } from '../primitives/countryDialCodes';

// Mirrors IdLookupStep's MoiResult - this step receives the value that step
// produces. Kept as a local shape rather than imported because it is a subset:
// only the fields this step reads appear here.
interface MoiResult {
  phone?: string;
  preferredLanguage?: string;
  name: string;
  customerId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob: string;
  nationality: string;
  email?: string;
  /** A new customer's mobile from the NAS (see idLookupModel.MoiResult.mobile). */
  mobile?: string;
  /** Siebel for an existing customer, NAS for a new one. */
  emailSource?: 'Siebel' | 'NAS' | 'Billing Profile';
  /** No customer record exists for this ID (details came from NAS). */
  isNewCustomer?: boolean;
  /** See idLookupModel.MoiResult.linkedIdUpdate. */
  linkedIdUpdate?: import('./idLinkModel').LinkedIdUpdate;
  /** The agent created this customer (no registry knows the ID); the identity was typed. */
  createdByAgent?: boolean;
  /** A new customer's National Address from the NAS: hidden, stored with the order, never shown or edited (see idLookupModel.NationalAddress). */
  nationalAddress?: import('./idLookupModel').NationalAddress;
  gender?: string;
  /** When the registry last confirmed the record (ISO); mirrors IdLookupStep's MoiResult. */
  moiUpdateTime?: string;
  /** Sponsoring employer, when on file. What isB2B2C is derived from. */
  companyName?: string;
  /** That employer's enterprise-accounts row, when it has one. */
  companyAccountId?: string;
  /** The occupation on the registry record, when it holds one. */
  occupation?: string;
  /** The scanned document's own expiry date (ISO), off the identity-documents
   * match rather than the customer record. */
  expiryDate?: string;
}

export interface GuidedContactValue {
  idType?: QidType;
  idNumber?: string;
  moiResult?: MoiResult;
  /** Front/back QID capture - only collected when idType is 'QID'. */
  qidScans?: QidImageUploadValue;
  /** verifyThenFetch: the scanned expiry the agent verifies before Fetch (DD/MM/YYYY). */
  scannedExpiry?: string;
  /** The attribute-level result of comparing the captured ID with MOI (see idReconciliation). */
  idReconciliation?: import('./idReconciliation').AttributeMatch[];
  /** verifyThenFetch: the mobile number on the customer record (read-only). */
  mobileNumber?: string;
  /**
   * Identity fields, agent-editable as of 2026-09-24 and prefilled from the
   * MOI result when one is found. This reverses the supplied asset's "State
   * MOI Registry Records (Read Only) / all identity fields are locked to
   * read-only" rule, on explicit direction - the asset is still what governs
   * their visual treatment, just not their editability.
   *
   * `gender` has no MOI source: MoiResult carries name/dob/nationality/email
   * only, so it is always agent-entered even for a customer on file.
   */
  firstName?: string;
  /**
   * Added 2026-09-27. Positional, from the middle tokens of MOI's single
   * `name` string - see identityFromMoi. Optional by design: a two-token name
   * has no middle, and a mandatory read-only field with no source deadlocks
   * Continue (the exact failure `gender` was added to fix).
   *
   * Displayed as "Middle Name(s)" (2026-09-28): this can hold up to three
   * combined tokens (the 2nd-4th names), not a single middle name, and the
   * plural label says so rather than implying one name where several may
   * sit.
   */
  middleName?: string;
  lastName?: string;
  dob?: string;
  /**
   * ID Expiry - the header comment's evidenced field set ("ID Expiry/
   * Nationality/Gender/Name/DOB auto-populate from the ID scan") always named
   * this one, but nothing rendered it until 2026-09-28. Masked DD/MM/YYYY,
   * same as `dob` - see identityFromMoi.
   */
  idExpiryDate?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  altPhone?: string;
  /** The customer's personal mobile: optional, validated as a Qatar mobile when entered. */
  personalMobile?: string;
  /** How the customer is addressed (Mr, Ms ...): captured by the agent at Contact, optional, and kept on the contact. */
  salutation?: string;
  /** The customer's work email: optional for everyone, kept on the contact next to the (mandatory) personal email. */
  workEmail?: string;
  language?: string;
  getIptv?: 'Yes' | 'No';
  /**
   * DERIVED, never agent-entered (2026-09-26). True when the customer the ID
   * lookup resolved has a sponsoring employer on file.
   *
   * This was a "B2B2C Order" checkbox, removed along with "Digital Lead /
   * Sale". The corpus is clear that B2B2C is an ACCOUNT-level classification -
   * completing one stamps Special Management "B2B2C Consumer" on the account,
   * and a later order against that account makes the agent confirm before
   * proceeding without B2B2C. A per-order checkbox modelled it as a choice the
   * agent makes fresh each time, which is the wrong shape: whether a walk-in
   * is sponsored by their employer is a fact about them, not a decision at the
   * counter.
   *
   * Still carried on the value (four wizards read it to set orderSubType and
   * to route to manager approval) - only its source changed.
   */
  isB2B2C?: boolean;
  /** Identity number was entered manually (scan failed): routes the order to Store Manager approval. */
  manualEntry?: boolean;
  /** The chosen employer. Committed only by a pick or an explicit "Add new
   * company" - never by typing. See CompanySearchInput. */
  companyName?: string;
  /** Set when companyName came from the `enterprise-accounts` registry, so a
   * linked employer is distinguishable from one that still has to be created.
   * The two were indistinguishable while this was a free-text box. */
  companyAccountId?: string;
  /** The occupation read from the registry record (shown on Identity Details when present). */
  occupation?: string;
  /** Set when the agent chose "Add new company" instead. */
  companyIsNew?: boolean;
}

// Single source of truth for "is this a valid Alternate phone #" - exported
// so every wizard's Contact step isValid gate checks the exact same rule as
// the field's own inline error.
//
// QATAR ONLY: +974 followed by exactly 8 digits, e.g. +97474018245.
//
// This reverses the previous direction and returns to the evidenced rule.
// field-inventory/business-rules.json says this field "must be a local mobile
// number" - repeated across 5+ journeys, FLD-352 et al. - because it is the
// SMS notification contact. That was overridden during the rebuild on the
// reasoning that a postpaid customer might only have a foreign number on file
// (a GCC, expat or diplomatic customer), so the validator accepted any
// 7-to-15-digit international number. Direction on 2026-09-26 is the
// documented rule after all, so the override is gone.
//
// Consequence worth knowing: a customer who genuinely has no Qatar mobile can
// no longer be given one here, and the Contact step of all four journeys that
// share this gate will hold until a +974 number is entered. That was the
// exact objection the override existed to answer, so it is recorded in
// reference/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md rather
// than only in this comment.
//
// Separators and an optional 974/+974 prefix are tolerated on INPUT, because
// the field displays itself grouped ("5551 2345") and the stored value is
// E.164 - so the same digits arrive here in several shapes and none of them
// is the agent making a mistake.
export function isValidAltPhone(raw: string | undefined): boolean {
  if (!raw) return false;
  const local = raw.replace(/[\s-]/g, '').replace(/^\+?974/, '');
  // 8 digits is necessary but not sufficient - Qatar landline numbers are
  // also 8 digits (leading 4), so length alone would accept a landline in a
  // field the helper text and error copy both call a mobile number
  // (2026-09-28 direction, reversing the 2026-09-26 note that used to sit
  // here). isQatarMobileLocalNumber applies the same 3/5/6/7 leading-digit
  // rule MsisdnPicker's isValidMsisdn uses for inventory MSISDNs, so a
  // landline is rejected the same way here as it always was there.
  return isQatarMobileLocalNumber(local);
}

// Same contract as isValidAltPhone - one rule shared by the field's inline
// error and every wizard's Contact isValid gate, so the two can't disagree.
//
// Email is mandatory: all four Contact-step wizards already required a
// truthy `email` to advance, but the field was disabled and populated only
// from the MOI result. That made the gate unsatisfiable whenever the MOI
// record carried no email - Continue stayed dead with nothing the agent
// could do about it. The field is now agent-editable, which is also what
// this file's own header comment always claimed ("Email/Alt Phone/Language/
// Digital Lead-Sale/B2B2C are agent-entered in both"), and the gates check
// this instead of mere truthiness, so "x" no longer passes.
//
// That quote is the evidenced field set, and as of 2026-09-26 this app no
// longer matches the last two entries: Digital Lead-Sale is gone entirely and
// B2B2C is derived from the resolved customer's employer rather than entered.
// Email, Alt Phone and Language are still agent-entered, which is the part
// this paragraph relies on.
//
// Deliberately a shape check, not RFC 5322: one @, no whitespace, a dot-led
// TLD of 2+ letters. Over-strict email regexes reject valid addresses, and
// nothing here can confirm deliverability anyway.
export function isValidEmail(raw: string | undefined): boolean {
  if (!raw) return false;
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(raw.trim());
}

// MOI's YYYY-MM-DD into the field's DD/MM/YYYY. Anything not in that exact
// ISO shape is passed through untouched rather than mangled - better a value
// the agent can see and correct than a silently rearranged one.
function isoToMaskedDob(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

// A real calendar date, not just the right shape - 31/02/2000 matches the mask
// but isn't a day. Rejects the future and anything implying an age over 120,
// both of which are typos rather than customers.
export function isValidDob(masked: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(masked);
  if (!m) return false;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  const date = new Date(year, month - 1, day);
  const now = new Date();
  if (date > now) return false;
  return year > now.getFullYear() - 120;
}

// Mandatory identity fields, checked by the field markers and by every
// Contact isValid gate. Trimmed, because a space is not a name.
export function hasIdentityDetails(v: {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  idExpiryDate?: string;
}): boolean {
  return Boolean(
    v.firstName?.trim() &&
      v.lastName?.trim() &&
      isValidDob(v.dob ?? '') &&
      v.gender?.trim() &&
      v.nationality?.trim() &&
      // A presence check, not isValidDob - unlike DOB, an expiry date is
      // routinely in the future, which isValidDob rejects by design. This
      // field is read-only and registry-sourced, so "did MOI return one" is
      // the only thing worth asking here.
      v.idExpiryDate?.trim()
  );
}

/**
 * Email verification state (2026-09-27 walkthrough).
 *
 * There is no email-verification service in this app, so this reports only
 * what can actually be known and never asserts a check that did not run:
 *
 *   verified  - unchanged from what the MOI registry returned (tick shown)
 *   pending   - agent typed a different, well-formed address
 *   unverified- no registry address, or the value is not a valid address yet
 *
 * Only `verified` earns the tick. The other two are said in words underneath
 * rather than marked, because a tick is a claim and neither state supports
 * one - an absent tick is the honest rendering of "not confirmed".
 *
 * Exported 2026-09-28 so NewPostpaidWizard's onSubmit can gate the
 * confirmation email on the SAME definition of "verified" this screen
 * already uses, rather than re-deriving a second one that could drift from
 * what the tick on screen actually promised.
 */
export function emailVerification(email: string | undefined, registryEmail: string | undefined) {
  if (!email || !isValidEmail(email)) return { verified: false, hint: undefined };
  if (registryEmail && email.trim().toLowerCase() === registryEmail.trim().toLowerCase()) {
    return { verified: true, hint: undefined };
  }
  return { verified: false, hint: 'Verification pending - address differs from the registry record.' };
}

/**
 * The personal email as the screen shows it. A new customer's NAS address is masked while it is the address NAS returned;
 * once the agent types a different one (the field is editable) that address is shown as typed.
 */
export function displayedEmail(contact: { email?: string; moiResult?: { isNewCustomer?: boolean; createdByAgent?: boolean; email?: string } } | undefined, opts: { registry?: boolean } = {}): string {
  const email = contact?.email ?? '';
  const moi = contact?.moiResult;
  // `registry`: a person identified apart from the customer (a Secondary Contact) - whoever the registry returned, an existing customer included, is shown masked.
  const fromNas = Boolean((opts.registry || moi?.isNewCustomer) && !moi?.createdByAgent && email && moi?.email && email.trim().toLowerCase() === moi.email.trim().toLowerCase());
  return fromNas ? maskEmail(email) : email;
}

/**
 * The customer's primary contact mobile number, for the billing contact: the personal mobile entered at Customer Verification, else
 * the number on the customer record. One definition, so the number the Billing step shows is the one the billing profile is saved with.
 */
export function primaryContactMobile(contact: { personalMobile?: string; mobileNumber?: string; moiResult?: { phone?: string } } | undefined): string | undefined {
  return contact?.personalMobile?.trim() || contact?.mobileNumber?.trim() || contact?.moiResult?.phone?.trim() || undefined;
}

/**
 * A new customer's NAS mobile is masked the same way as the email: first and last digit kept, a fixed run of stars between - 5******5.
 * The number of stars is fixed, so the length is not revealed.
 */
export function maskMobile(mobile: string | undefined): string {
  const digits = (mobile ?? '').replace(/\D/g, '').replace(/^974/, '');
  if (digits.length < 2) return '';
  return `${digits[0]}******${digits[digits.length - 1]}`;
}

/**
 * The personal mobile as the screen shows it: a new customer's NAS number is masked while it is still the number NAS returned; once the agent types
 * a different one (the field is editable) it is shown as typed. Undefined: show the field's own value.
 */
export function displayedMobile(contact: { personalMobile?: string; moiResult?: { isNewCustomer?: boolean; createdByAgent?: boolean; mobile?: string; phone?: string } } | undefined, opts: { registry?: boolean } = {}): string | undefined {
  const moi = contact?.moiResult;
  const mobile = contact?.personalMobile;
  const registryMobile = opts.registry ? moi?.mobile ?? moi?.phone : moi?.mobile;
  const fromNas = Boolean((opts.registry || moi?.isNewCustomer) && !moi?.createdByAgent && mobile && registryMobile && mobile === registryMobile);
  return fromNas ? maskMobile(mobile) : undefined;
}

/**
 * A new customer's NAS email is never shown in full: first and last character of the name
 * and of the domain are kept, the rest hidden, and the domain ending stays - j***e@e****e.com.
 * The number of stars is fixed, so it does not reveal the length of the address.
 */
export function maskEmail(email: string | undefined): string {
  if (!email) return '';
  const at = email.lastIndexOf('@');
  if (at < 1) return 'xxx@xxx.xx';
  const part = (text: string, stars: string) => (text.length <= 1 ? `${text}${stars}` : `${text[0]}${stars}${text[text.length - 1]}`);
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const dot = domain.indexOf('.');
  const name = dot === -1 ? domain : domain.slice(0, dot);
  const ending = dot === -1 ? '' : domain.slice(dot);
  return `${part(local, '***')}@${part(name, '****')}${ending}`;
}

export function identityFromMoi(moi: MoiResult | undefined) {
  if (!moi)
    return {
      firstName: undefined,
      middleName: undefined,
      lastName: undefined,
      dob: undefined,
      idExpiryDate: undefined,
      nationality: undefined,
      email: undefined,
      gender: undefined,
      // Another person: how the last one was addressed does not carry over.
      salutation: undefined,
      workEmail: undefined,
      personalMobile: undefined,
      // Cleared with the rest. An employer link belongs to the resolved
      // customer, so losing the customer has to lose the link - otherwise
      // re-typing an ID would leave the previous person's employer attached,
      // and with it a B2B2C order subtype and an approval route.
      isB2B2C: undefined,
      companyName: undefined,
      companyAccountId: undefined,
      companyIsNew: undefined,
      occupation: undefined,
    };
  const parts = moi.name.trim().split(/\s+/);
  const employer = moi.companyName?.trim();
  return {
    // An employer on file IS the B2B2C signal - there is nothing else for the
    // flag to key off now the checkbox is gone. companyAccountId is resolved
    // separately against the enterprise-accounts registry (see the effect
    // below) because that needs a dataset read this pure function cannot do.
    isB2B2C: employer ? true : undefined,
    companyName: employer || undefined,
    companyAccountId: employer ? moi.companyAccountId : undefined,
    occupation: moi.occupation?.trim() || undefined,
    // Nothing can create a company from this step any more - the only control
    // that could is gone - so a derived employer is never a new one.
    companyIsNew: undefined,
    // Split three ways as of 2026-09-27, when Middle Name was added as its own
    // field. MOI returns ONE `name` string, so first/middle/last are positional:
    // first token, last token, and whatever sits between them. Arabic names in
    // this corpus routinely carry 3-4 tokens ("Ahmed Abdulla Al-Sulaiti"), which
    // the old two-way split folded entirely into Last Name.
    // A two-token name yields an empty middle rather than a guessed one.
    //
    // Capped to the 2nd-4th name specifically as of 2026-09-28 (Qatar ID's own
    // five-slot convention: given name, up to three father's/grandfather's
    // names, then family name) rather than "everything between first and
    // last" - the old slice(1, -1) would have folded a hypothetical 6th token
    // into Middle Name(s) too. No name in this corpus actually reaches five
    // tokens, so this only changes behaviour nothing here has ever exercised;
    // it does not invent a rule for a sixth name, which stays uncaptured
    // rather than guessed at.
    // The registry's own parts win when it supplies them (customers.json and
    // nas-records.json carry firstName/middleName/lastName since 2026-10-02);
    // the positional split above is the fallback for a record that has only a
    // single `name` string.
    firstName: moi.firstName ?? parts[0] ?? '',
    middleName: moi.middleName ?? (parts.length > 2 ? parts.slice(1, Math.min(4, parts.length - 1)).join(' ') : ''),
    lastName: moi.lastName ?? (parts.length > 1 ? parts[parts.length - 1] : ''),
    // MOI returns ISO (1985-03-12); the field is masked DD/MM/YYYY. Without
    // this the prefilled value would fail isValidDob and block Continue for
    // exactly the customers the registry DID find - reformatted, not
    // reinterpreted, so the date itself is unchanged.
    dob: isoToMaskedDob(moi.dob),
    // Same ISO -> masked reformatting as dob, and the same reason: a raw ISO
    // value sitting in a DD/MM/YYYY-shaped field would just be wrong to read,
    // even though nothing here validates it the way isValidDob does.
    idExpiryDate: moi.expiryDate ? isoToMaskedDob(moi.expiryDate) : undefined,
    nationality: moi.nationality,
    email: moi.email,
    // A new customer's NAS mobile is offered as the Personal Mobile (shown masked, like the email); an existing customer's is not (theirs is the record's own).
    personalMobile: moi.isNewCustomer && !moi.createdByAgent ? moi.mobile : undefined,
    gender: moi.gender,
  };
}

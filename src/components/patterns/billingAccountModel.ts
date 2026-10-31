import { creditLimitOptions } from '../../engines/creditLimit';

export interface AccountRecord {
  accountId: string;
  customerId: string;
  accountType: string;
  billingProfileId: string;
}

export interface BillingProfileRecord {
  billingProfileId: string;
  accountId: string;
  name: string;
  billingCycle: string;
  billingAddress: string;
  billMedium: string;
  billingContactName: string;
  billingContactEmail: string;
}

export interface ContactRecord {
  contactRecordId: string;
  customerId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  /** What the contact's record holds to reach them: filled into the billing details when they are chosen. */
  cellNumber?: string | null;
  workPhone?: string | null;
  employerEmail?: string | null;
}

export interface CustomerRecord {
  customerId: string;
  segment: string;
}

export interface NewBillingAccountValue {
  /** A new account's credit limit, chosen by the agent from the options for the customer's segment (blank: the default applies). */
  creditLimitQar?: number;
  primaryContactId?: string;
  /** The primary contact's own details from their record - set only for a contact who is not the customer (the customer's come from Customer Verification). */
  primaryContactPhone?: string;
  primaryContactEmail?: string;
  /** The optional secondary contact, picked from the account's other contacts; their details are read from their record. */
  secondaryContactId?: string;
  hasSecondaryContact?: boolean;
  secondaryContactName?: string;
  secondaryContactPhone?: string;
  secondaryContactEmail?: string;
  preferredInvoiceRecipient?: string;
  /** The day of the month the bill cycle starts on. Defaults to computeBillCycleDay() (see that function's note on the
   * evidenced vs. assumed halves of the rule) and is editable by the agent. */
  billCycleDay?: number;
  /** How the profile is billed: the billing-profiles records carry 'Arrears' (every profile but one) or 'Hybrid (PIA + Arrears)'. */
  billingMode?: string;
  /** Editing an existing account: its billing address as one line (the profile on file holds one line, not street / building / area). */
  editAddressLine?: string;
  /** Editing an existing account: the name of the contact picked as primary, written to the profile's contact. */
  primaryContactName?: string;
  /** Whether this profile is the customer's primary payment profile. Defaults to true when the customer has no other billing
   * profile; saved as the profile's `isDefault`. */
  primaryPaymentProfile?: boolean;
  /** Only the last 4 digits and a generated token ever persist here - see
   * tokenizeCard()'s own note on why the full number is never stored. */
  cardLast4?: string;
  cardToken?: string;
  profileName?: string;
  billMedia?: string;
  billingSchedule?: string;
  /** How detailed the bill is: BILL_TYPES, Detailed by default. */
  billType?: string;
  /** The language the bill is printed in: BILL_LANGUAGES, English by default. */
  billLanguage?: string;
  /** Optional VAT details. A VAT registration number makes the VAT document mandatory in Additional Documents. */
  vatRegistrationNumber?: string;
  /** The VAT registration's expiry, DD/MM/YYYY. */
  vatExpiryDate?: string;
}

export interface BillingAccountValue {
  /** Set when the agent picked an account already on file. Mutually
   * exclusive with `creatingNew`. */
  selectedProfileId?: string;
  creatingNew?: boolean;
  /** The existing account being edited: its details are in `newAccount`, pre-filled from the profile on file, and are saved back onto that profile. */
  editingProfileId?: string;
  newAccount?: NewBillingAccountValue;
  /** Set by BillingAccountAutoResolver: the customer this value was resolved
   * for ('new' when there is no customer record yet). */
  autoResolvedFor?: string;
}

/**
 * "Bill Cycle" (2026-09-28 request): "VIP customers default to the 7th of
 * every month. All other customer segments are assigned to either the 1st
 * or 15th, depending on which date is closer to the three-day submission
 * window."
 *
 * EVIDENCED HALF: business-rules.json's "Default Postpaid Billing Cycle
 * Rule" confirms postpaid profiles default to automatic 1st/15th cycles.
 * ASSUMED HALF: no rule in the corpus defines a "VIP" customer segment or a
 * 7th-of-month VIP default - customers.json's own `segment` values are only
 * ever "Consumer"/"Enterprise" in this app's seed data. Implemented exactly
 * as directed, gated on `segment === 'VIP'` so it activates the moment a
 * VIP-segmented customer record exists, without inventing one now.
 */
export function computeBillCycleDay(segment: string | undefined, asOf: Date): number {
  if (segment === 'VIP') return 7;
  const submissionWindowEnd = new Date(asOf);
  submissionWindowEnd.setDate(submissionWindowEnd.getDate() + 3);
  const day = submissionWindowEnd.getDate();
  return Math.abs(day - 1) <= Math.abs(day - 15) ? 1 : 15;
}

/** 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 11 -> "11th", 22 -> "22nd". */
export function ordinal(day: number): string {
  const teen = day % 100 >= 11 && day % 100 <= 13;
  const suffix = teen ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] ?? 'th';
  return `${day}${suffix}`;
}

/** Billing modes, as the billing-profiles records name them; arrears is the default. */
export const BILLING_MODES = [
  { value: 'Arrears', label: 'In Arrears' },
  { value: 'Hybrid (PIA + Arrears)', label: 'Hybrid (PIA + Arrears)' },
];
export const DEFAULT_BILLING_MODE = 'Arrears';

/** The days a postpaid bill cycle can start on by rule: the 1st or the 15th (a VIP customer's 7th is added where it is the default). */
export const BILL_CYCLE_DAYS = [1, 15];

/**
 * "Validation of payment details ... is required for successful processing,
 * with only the last four digits of the card and a generated token number
 * stored for security" (2026-09-28) - the raw number this function receives
 * is never returned or stored anywhere past this call, matching that rule.
 *
 * UNEVIDENCED: no payment gateway is named anywhere in this corpus. The
 * screenshot accompanying this request said "Gatan gateway simulation" -
 * kept verbatim in the token prefix and the field's own helper text as a
 * demo label, not a real integration.
 */
/** A card number is exactly this many digits. */
export const CARD_NUMBER_LENGTH = 16;
/** A card number is typed and stored as digits only, at most CARD_NUMBER_LENGTH of them. */
export const cardDigits = (text: string) => text.replace(/\D/g, '').slice(0, CARD_NUMBER_LENGTH);
/** The digits shown in groups of four ("4111 1111 1111 1111"). Display only - the value held and validated has no spaces. */
export const formatCardNumber = (digits: string) => digits.replace(/(\d{4})(?=\d)/g, '$1 ');

export function tokenizeCard(cardNumber: string): { last4: string; token: string } | null {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length !== CARD_NUMBER_LENGTH) return null;
  const last4 = digits.slice(-4);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 10; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return { last4, token: `GATAN-${suffix}` };
}

export const INVOICE_RECIPIENTS = [
  { value: 'Primary Contact', label: 'Primary Contact' },
  { value: 'Secondary Contact', label: 'Secondary Contact' },
];

/** The bill's level of detail and language: the options, and what a new account starts on. */
export const BILL_TYPES = [
  { value: 'Detailed', label: 'Detailed' },
  { value: 'Summary', label: 'Summary' },
];
export const DEFAULT_BILL_TYPE = 'Detailed';
export const BILL_LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Arabic', label: 'Arabic' },
];
export const DEFAULT_BILL_LANGUAGE = 'English';

/** A VAT expiry date is DD/MM/YYYY and a real calendar date. Empty is fine (the field is optional); the caller decides what to do with a bad one. */
export function isValidVatExpiry(text: string | undefined): boolean {
  const t = text?.trim();
  if (!t) return true;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
  if (!m) return false;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return d.getFullYear() === Number(m[3]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[1]);
}

export const BILL_MEDIA_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'Paper Bill', label: 'Paper Bill' },
  { value: 'SMS', label: 'SMS' },
];

export const BILLING_SCHEDULE_OPTIONS = [
  { value: 'Immediate', label: 'Immediate' },
  { value: 'Next Cycle', label: 'Next Cycle' },
];

/** Same gate the wizard's own isValid reads - kept alongside the component so
 * the two cannot drift apart. */
/** The profile fields an edited account writes back: contact, address, bill cycle, mode and name - only what the agent can see and change in the form. */
export function profilePatchFromEdit(a: NewBillingAccountValue): Record<string, unknown> {
  const line = a.editAddressLine?.trim();
  const primaryContactName = a.primaryContactName?.trim();
  return {
    ...(primaryContactName ? { billingContactName: primaryContactName } : {}),
    ...(line ? { billingAddress: line } : {}),
    ...(a.billCycleDay ? { billingCycle: `Monthly - Day ${a.billCycleDay}` } : {}),
    ...(a.billingMode ? { billingType: a.billingMode } : {}),
    ...(a.profileName?.trim() ? { name: a.profileName.trim() } : {}),
    ...(a.billMedia ? { billMedium: a.billMedia } : {}),
  };
}

export function isBillingAccountValid(value: BillingAccountValue): boolean {
  if (value.selectedProfileId) return true;
  if (!value.creatingNew) return false;
  const a = value.newAccount ?? {};
  if (!a.primaryContactId) return false;
  if (a.hasSecondaryContact && !a.secondaryContactName?.trim()) return false;
  if (!a.preferredInvoiceRecipient) return false;
  if (!isValidVatExpiry(a.vatExpiryDate)) return false;
  if (!a.profileName?.trim()) return false;
  return true;
}

/**
 * The credit limit this order's NEW account carries: the agent's choice when it is one of the options for the customer (HRN has none), else the default
 * the rules give. What checkout, the order and the account record all show, so they cannot differ.
 */
export function effectiveCreditLimitQar(
  eligibility: { defaultCreditLimitQar?: number; nationality?: string } | undefined,
  billing: { creatingNew?: boolean; selectedProfileId?: string; newAccount?: { creditLimitQar?: number } } | undefined
): number | undefined {
  const chosen = billing?.creatingNew && !billing.selectedProfileId ? billing.newAccount?.creditLimitQar : undefined;
  return chosen !== undefined && creditLimitOptions(eligibility?.nationality).includes(chosen) ? chosen : eligibility?.defaultCreditLimitQar;
}

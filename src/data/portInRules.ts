// MNP Port-In rules from VFQ_Mobile_MNP_PORTIN_PORTOUT_V1.1 (BRSD): the status model (Annex_02), the donor rejection codes
// (OI-MNP-006), the porting window (BR-MNP-027, OI-MNP-012/013/014), the donor-field lists (Annex_01) and the Port-In number
// check. Pure: no stores, no I/O. Every consumer (the wizard steps, the submit, the status screen) reads it from here.

// ---------------------------------------------------------------- status model (Annex_02)

/** MNP Port-In Order statuses. The agent journey reaches Pending NPAS Approval and what follows from NPAS's answer. */
export type PortInOrderStatus =
  | 'Draft'
  | 'Pending Payment'
  | 'Submitted'
  | 'Pending NPAS Approval'
  | 'NPAS Approved'
  | 'NPAS Rejected'
  | 'Completed Rejected'
  | 'Cancelled'
  | 'Closed';

/** NPAS Request statuses (DF-MNP-032 / DF-MNP-034 as the agent sees them). */
export type PortStatus = 'Submitted' | 'Pending Approval' | 'Approved' | 'Rejected';

/** Tracking Record statuses. */
export type TrackingStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed' | 'Cancelled';

/** Permitted next status per order status (Annex_02). Only the statuses the agent journey drives are listed. */
export const ORDER_NEXT: Partial<Record<PortInOrderStatus, PortInOrderStatus[]>> = {
  Submitted: ['Pending NPAS Approval'],
  'Pending NPAS Approval': ['NPAS Approved', 'NPAS Rejected', 'Cancelled'],
  'NPAS Rejected': ['Completed Rejected', 'Cancelled'],
  'Completed Rejected': ['Closed'],
};

export const canMoveOrder = (from: PortInOrderStatus, to: PortInOrderStatus): boolean => ORDER_NEXT[from]?.includes(to) ?? false;

// ---------------------------------------------------------------- donor rejection (OI-MNP-006)

/** The reason NPAS gives when the donor operator rejects a port. The code and reason are the customer-facing message: the BRSD
 * lists no separate wording. */
export interface RejectionReason {
  code: string;
  reason: string;
}

export const REJECTION_REASONS: readonly RejectionReason[] = [
  { code: '1', reason: 'ID Number does not match' },
  { code: '2', reason: 'Name is not authorised signatory' },
  { code: '3', reason: 'CR number does not match' },
  { code: '4', reason: 'Incorrect donor service type (e.g. C1S, B3M, etc.)' },
  { code: '5', reason: 'Signature does not match (Business only)' },
  { code: '6', reason: 'Service for Number currently barred or suspended' },
  { code: '7', reason: 'GCC country identifier does not match customer nationality' },
  { code: '8', reason: 'Porting request date is not a working day' },
  { code: '9', reason: 'Porting request date is outside of permitted range' },
  { code: '10', reason: "Number is on the Donor operator's account" },
  { code: '11', reason: 'Customer ID type submitted with application is not accepted' },
  { code: '12', reason: 'Non-active MSISDN' },
  { code: '13', reason: 'Customer has Mobile Money transaction pending' },
];

export const rejectionReason = (code: string | undefined): RejectionReason | undefined => REJECTION_REASONS.find((r) => r.code === code);

// ---------------------------------------------------------------- donor fields (Annex_01 DF-MNP-010..015)

/** DF-MNP-011's ID types are the `donor` preset in data/idTypes.ts. */
export const DONOR_CUSTOMER_TYPES = ['Individual', 'Business'] as const;
export const DONOR_SUBSCRIPTION_TYPES = ['Prepaid', 'Postpaid'] as const;
/**
 * DF-MNP-013 lists "Other Operator, Vodafone, Other Licensed Operators". Vodafone is left out of what the agent can choose: BR-MNP-001
 * is a port-in "from another licensed operator", so Vodafone cannot be the donor of a port into Vodafone. "Other Licensed Operator"
 * is not offered either (direction 2026-10-18), so Other Operator is the one donor operator.
 */
export const DONOR_OPERATORS = ['Other Operator'] as const;
/** The one donor operator, so the journey sets it rather than asking for it. */
export const DONOR_OPERATOR = DONOR_OPERATORS[0];

// ---------------------------------------------------------------- porting window (BR-MNP-027, OI-MNP-012..014)

/** Qatar has no daylight saving: a fixed UTC+3 offset is exact. */
const QATAR_OFFSET_HOURS = 3;
/** Working days are Sunday to Thursday (OI-MNP-012). Date.getUTCDay(): Sunday 0 ... Saturday 6. */
const WORKING_WEEKDAYS: readonly number[] = [0, 1, 2, 3, 4];
/** Public holidays (ISO dates) the team configures a day ahead (OI-MNP-014). None are known to the app, so none are listed. */
export const PUBLIC_HOLIDAYS: readonly string[] = [];
/** "The initial window is 11:00 to 12:00, subject to business configuration" (BR-MNP-027). */
export const PORT_IN_WINDOW = { start: '11:00', end: '12:00' } as const;
/**
 * The configured daily cut-off (BR-MNP-027). PLACEHOLDER: the BRSD says it is configured and gives no time (open item). It is
 * set before the window opens, so an approval received after it moves to the next working day's window.
 */
export const PORT_IN_CUTOFF = '10:00';
/** The SLA for both operators to approve or reject a request in NPAS (OI-MNP-004). */
export const NPAS_SLA_HOURS = 24;

interface QatarParts {
  /** YYYY-MM-DD in Qatar time. */
  date: string;
  weekday: number;
  minutes: number;
}

function qatarParts(at: Date): QatarParts {
  const shifted = new Date(at.getTime() + QATAR_OFFSET_HOURS * 3_600_000);
  return { date: shifted.toISOString().slice(0, 10), weekday: shifted.getUTCDay(), minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes() };
}

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Whether a calendar date (YYYY-MM-DD) is a working day: Sunday to Thursday and not a configured public holiday. */
export function isWorkingDay(date: string): boolean {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  return WORKING_WEEKDAYS.includes(d.getUTCDay()) && !PUBLIC_HOLIDAYS.includes(date);
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const nextWorkingDay = (date: string): string => {
  let next = addDays(date, 1);
  while (!isWorkingDay(next)) next = addDays(next, 1);
  return next;
};

export interface ConfirmedPortInWindow {
  /** The Confirmed Port-In Date, YYYY-MM-DD (Qatar). */
  date: string;
  start: string;
  end: string;
  /** DF-MNP-053: the window opening as an instant. */
  startsAt: string;
}

/**
 * BR-MNP-027 / MNP_PI_001_SEQ_031. Approval received before the cut-off on a working day: that day's window. After the cut-off, or
 * on a non-working day: the next working day's window.
 */
export function confirmedPortInWindow(approvedAt: Date): ConfirmedPortInWindow {
  const { date, minutes } = qatarParts(approvedAt);
  const sameDay = isWorkingDay(date) && minutes < toMinutes(PORT_IN_CUTOFF);
  const day = sameDay ? date : nextWorkingDay(date);
  return { date: day, start: PORT_IN_WINDOW.start, end: PORT_IN_WINDOW.end, startsAt: `${day}T${PORT_IN_WINDOW.start}:00+03:00` };
}

/** The NPAS answer is due 24 hours after submission (OI-MNP-004). */
export const npasDeadline = (submittedAt: Date): string => new Date(submittedAt.getTime() + NPAS_SLA_HOURS * 3_600_000).toISOString();

// ---------------------------------------------------------------- charges and dues (BR-MNP-011, BR-MNP-024)

/**
 * DF-MNP-027 lists "Port-In Fee, Deposit, Advance Payment" as what a port-in may collect, but the BRSD gives no Port-In fee and no
 * deposit amount. None is charged until VFQ states one; the Postpaid HRN advance payment still applies as for any postpaid line.
 * When nothing is due, a zero-value receipt is issued (BR-MNP-011).
 */
export const PORT_IN_FEE_QAR = 0;
export const PORT_IN_DEPOSIT_QAR = 0;

/**
 * BR-MNP-024: port-in is restricted when outstanding dues exceed "the configured threshold defined by VFQ Collections Policy". The
 * rule is Open in the BRSD and no figure is given anywhere, so none is assumed (the same rule as the fibre dues threshold in
 * ruleEngine): undefined means "not defined", and the check does not restrict. Set the amount here once VFQ confirms it.
 */
export const PORT_IN_DUES_THRESHOLD_QAR: number | undefined = undefined;

/** SIM Inventory status while a port-in waits on NPAS (Annex_02: Reserved). The SIM scanner refuses a Reserved SIM for any other order. */
export const SIM_RESERVED = 'Reserved';

// ---------------------------------------------------------------- Port-In number (DF-MNP-009, SEQ_014, OI-MNP-003)

/**
 * The number as the order carries it: Qatar country code + 8 digits (97466000666). Accepts what an agent types or pastes: spaces,
 * dashes, a leading + or 00, with or without the 974 country code. A Qatar mobile number is 8 digits starting 3, 5, 6 or 7.
 */
export function normalizePortInNumber(raw: string): string | undefined {
  let digits = raw.replace(/[\s-]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) return undefined;
  if (digits.startsWith('974') && digits.length === 11) digits = digits.slice(3);
  return /^[3567]\d{7}$/.test(digits) ? `974${digits}` : undefined;
}

export interface PortInNumberContext {
  /** Numbers (normalised) that already have a port-in request awaiting NPAS. */
  inFlight: ReadonlySet<string>;
  /** Numbers (normalised) already on Vodafone's own inventory. */
  vodafone: ReadonlySet<string>;
}

/**
 * What can be checked before submission. Whether the number is an active, portable subscription at the donor is NPAS's to say
 * (OI-MNP-003 is still open): that comes back as a rejection (codes 6, 10, 12), not as a check here.
 */
export function portInNumberError(raw: string, ctx?: PortInNumberContext): string | undefined {
  if (!raw.trim()) return undefined;
  const number = normalizePortInNumber(raw);
  if (!number) return 'Enter a valid Qatar mobile number: 8 digits starting 3, 5, 6 or 7 (country code 974 optional).';
  if (ctx?.vodafone.has(number)) return 'This number is already on the Vodafone network, so it cannot be ported in.';
  if (ctx?.inFlight.has(number)) return 'A port-in request for this number is already awaiting NPAS approval.';
  return undefined;
}

/** A scheduled Port-In date must be a working day (DF-MNP-015). */
export function scheduledDateError(date: string | undefined): string | undefined {
  if (!date) return undefined;
  return isWorkingDay(date) ? undefined : 'The Port-In date must be a working day (Sunday to Thursday, not a public holiday).';
}

// ---------------------------------------------------------------- MNP Form (SEQ_018 / DF-MNP-025)

/** A unique MNP Form reference: MNPF- + the date + a sequence from the clock, so two forms never share one. */
export function newMnpFormNumber(at: Date = new Date()): string {
  const stamp = at.toISOString().slice(2, 10).replace(/-/g, '');
  return `MNPF-${stamp}-${String(at.getTime()).slice(-6)}`;
}

import { isWorkingDay } from '../../data/portInRules';

// The rules of the installation Appointment Booking, apart from how it is drawn.

export interface AppointmentBookingValue {
  cluster?: string;
  date?: string;
  /** 'HH:MM-HH:MM', the format appointment records carry. */
  timeSlot?: string;
  /** The appointment notes the technician reads. */
  comments?: string;
  /** The customer asked for a specific date and time; `requestedDate` and `requestedTime` then say which. */
  requestSpecific?: boolean;
  requestedDate?: string;
  requestedTime?: string;
  /** The documents the technician collects (ids from APPOINTMENT_DOCUMENTS). Absent until set: the persona's defaults apply. */
  documents?: string[];
}

/** One appointment record, as far as booking needs it. */
export interface BookedAppointment {
  cluster: string;
  appointmentDate: string;
  timeSlot: string;
}

export const CLUSTERS = ['West Bay Cluster', 'Al Sadd Cluster', 'Pearl Cluster'];
export const TIME_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];
/** Technicians per slot: a slot is full once this many appointments are booked in it. */
export const SLOT_CAPACITY = 5;
/** The earliest bookable date is this many days from today (moved on to a working day). */
export const LEAD_TIME_DAYS = 3;
/** The date strip shows this many working days from the earliest. */
export const DATE_STRIP_DAYS = 7;
/** A requested date is at most this many days ahead (the Future Dated Orders rule: "maximum 30 days ahead"). */
export const MAX_DAYS_AHEAD = 30;

export interface AppointmentDocument {
  id: string;
  label: string;
}
export const APPOINTMENT_DOCUMENTS: AppointmentDocument[] = [
  { id: 'caf', label: 'Contract Application Form (CAF)' },
  { id: 'tenancy', label: 'Tenancy Document' },
  { id: 'qid', label: 'QID Copy' },
];

/**
 * The documents a persona's technician visit collects by default. The CAF for every persona; no source gives a persona-specific
 * difference, so none is invented. A role that differs goes in here.
 */
const DEFAULT_DOCUMENTS_BY_PERSONA: Record<string, string[]> = {};
export const defaultDocumentsFor = (personaId: string | undefined): string[] => (personaId && DEFAULT_DOCUMENTS_BY_PERSONA[personaId]) || ['caf'];

// ---- dates (YYYY-MM-DD, calendar arithmetic in UTC so a time zone never shifts a day) -----------------------------------------

export const todayIso = (now: Date = new Date()): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export function addDaysIso(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The first working day on or after today plus the lead time. */
export function earliestDate(today: string = todayIso()): string {
  let d = addDaysIso(today, LEAD_TIME_DAYS);
  while (!isWorkingDay(d)) d = addDaysIso(d, 1);
  return d;
}

/** `count` working days from `from` (inclusive), the date strip. */
export function workingDaysFrom(from: string, count: number = DATE_STRIP_DAYS): string[] {
  const days: string[] = [];
  let d = from;
  while (days.length < count) {
    if (isWorkingDay(d)) days.push(d);
    d = addDaysIso(d, 1);
  }
  return days;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parts = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  return { weekday: WEEKDAYS[d.getUTCDay()], day: d.getUTCDate(), month: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
};
/** '2026-10-18' -> '18/10/2026'. */
const isoToDmy = (date: string) => date.slice(0, 10).split('-').reverse().join('/');
export const weekdayShort = (date: string) => parts(date).weekday.slice(0, 3);
export const dayOfMonth = (date: string) => parts(date).day;
/** 'October 2026' */
export const monthYear = (date: string) => `${parts(date).month} ${parts(date).year}`;
/** 'Sun 18 Oct' */
export const dateShort = (date: string) => `${weekdayShort(date)} ${isoToDmy(date)}`;
/** 'Sunday 18 Oct 2026' */
export const dateLong = (date: string) => `${parts(date).weekday} ${isoToDmy(date)}`;

/** '10:00-12:00' shown as '10:00 - 12:00'. */
export const slotLabel = (slot: string) => slot.replace('-', ' - ');

// ---- capacity ---------------------------------------------------------------------------------------------------------------

export const bookedIn = (existing: BookedAppointment[], cluster: string, date: string, slot: string) =>
  existing.filter((a) => a.cluster === cluster && a.appointmentDate === date && a.timeSlot === slot).length;

export const isSlotFull = (existing: BookedAppointment[], cluster: string, date: string, slot: string) => bookedIn(existing, cluster, date, slot) >= SLOT_CAPACITY;

/** How many of the day's time slots can still be booked in the cluster. */
export const bookableSlots = (existing: BookedAppointment[], cluster: string, date: string) =>
  TIME_SLOTS.filter((s) => !isSlotFull(existing, cluster, date, s)).length;

/** The technicians still free in the chosen slot, or in the day's emptiest slot while none is chosen. */
export function techniciansAvailable(existing: BookedAppointment[], cluster: string, date: string, slot?: string): number {
  const free = (s: string) => SLOT_CAPACITY - bookedIn(existing, cluster, date, s);
  return slot ? free(slot) : Math.max(...TIME_SLOTS.map(free));
}

// ---- the customer's own request ---------------------------------------------------------------------------------------------

/** Why a requested date cannot be used, or undefined when it can. */
export function requestedDateError(date: string | undefined, today: string = todayIso()): string | undefined {
  if (!date) return undefined;
  const earliest = earliestDate(today);
  if (date < earliest) return `The earliest date is ${dateShort(earliest)} (lead time ${LEAD_TIME_DAYS} days).`;
  if (date > addDaysIso(today, MAX_DAYS_AHEAD)) return `A date can be at most ${MAX_DAYS_AHEAD} days ahead.`;
  if (!isWorkingDay(date)) return 'The date must be a working day (Sunday to Thursday).';
  return undefined;
}

/** Why a requested time cannot be used (it must fall within the working slots, 08:00 to 18:00). */
export function requestedTimeError(time: string | undefined): string | undefined {
  if (!time) return undefined;
  const first = TIME_SLOTS[0].slice(0, 5);
  const last = TIME_SLOTS[TIME_SLOTS.length - 1].slice(6);
  return time >= first && time < last ? undefined : `The time must be between ${first} and ${last}.`;
}

/** The request puts the visit later than the earliest date: a future-dated order. */
export const isFutureDated = (value: AppointmentBookingValue, today: string = todayIso()): boolean =>
  Boolean(value.requestSpecific && value.requestedDate && value.requestedDate > earliestDate(today) && !requestedDateError(value.requestedDate, today));

/** A cluster, a date and a time slot are chosen and, when the customer asked for a specific date and time, that request is complete and usable. */
export function isAppointmentComplete(value: AppointmentBookingValue | undefined, today: string = todayIso()): boolean {
  if (!value?.cluster || !value.date || !value.timeSlot) return false;
  if (!value.requestSpecific) return true;
  return Boolean(value.requestedDate && value.requestedTime) && !requestedDateError(value.requestedDate, today) && !requestedTimeError(value.requestedTime);
}

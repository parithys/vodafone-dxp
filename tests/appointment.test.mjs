import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Appointment Booking: the date strip, the slots and technicians, the customer's own request, the documents the technician collects.
let m, stepMod;
before(async () => {
  await boot();
  m = await load('/src/components/patterns/appointmentModel.ts');
  stepMod = await load('/src/capabilities/AppointmentBooking/step.tsx');
});
after(close);

// 2026-10-15 is a Thursday; the lead time is 3 days, so 2026-10-18 (a Sunday, a working day) is the earliest.
const TODAY = '2026-10-15';

test('the earliest date is the lead time from today, moved on to a working day', () => {
  assert.equal(m.earliestDate(TODAY), '2026-10-18');
  // Monday 19 + 3 = Thursday 22 (a working day); Tuesday 20 + 3 = Friday 23 -> Sunday 25.
  assert.equal(m.earliestDate('2026-10-19'), '2026-10-22');
  assert.equal(m.earliestDate('2026-10-20'), '2026-10-25');
});

test('the date strip is seven working days from the earliest, skipping Friday and Saturday', () => {
  assert.deepEqual(m.workingDaysFrom('2026-10-18'), ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-25', '2026-10-26']);
  assert.equal(m.dateShort('2026-10-18'), 'Sun 18/10/2026');
  assert.equal(m.dateLong('2026-10-18'), 'Sunday 18/10/2026');
  assert.equal(m.monthYear('2026-10-18'), 'October 2026');
  assert.equal(m.slotLabel('10:00-12:00'), '10:00 - 12:00');
});

test('a slot is full at capacity; the day counts its bookable slots and the technicians still free', () => {
  const booked = (slot, n) => Array.from({ length: n }, () => ({ cluster: 'West Bay Cluster', appointmentDate: '2026-10-18', timeSlot: slot }));
  const existing = [...booked('08:00-10:00', m.SLOT_CAPACITY), ...booked('14:00-16:00', m.SLOT_CAPACITY), ...booked('10:00-12:00', 1)];
  assert.equal(m.isSlotFull(existing, 'West Bay Cluster', '2026-10-18', '08:00-10:00'), true);
  assert.equal(m.isSlotFull(existing, 'Al Sadd Cluster', '2026-10-18', '08:00-10:00'), false, 'another cluster has its own technicians');
  assert.equal(m.bookableSlots(existing, 'West Bay Cluster', '2026-10-18'), 3);
  assert.equal(m.techniciansAvailable(existing, 'West Bay Cluster', '2026-10-18', '10:00-12:00'), m.SLOT_CAPACITY - 1);
  assert.equal(m.techniciansAvailable(existing, 'West Bay Cluster', '2026-10-18'), m.SLOT_CAPACITY, 'with no slot chosen: the emptiest slot');
});

test('a requested date must be between the earliest date and 30 days ahead, on a working day; the time within 08:00-18:00', () => {
  assert.equal(m.requestedDateError('2026-10-25', TODAY), undefined);
  assert.match(m.requestedDateError('2026-10-16', TODAY), /earliest date is Sun 18\/10\/2026/);
  assert.match(m.requestedDateError('2026-11-20', TODAY), /at most 30 days/);
  assert.match(m.requestedDateError('2026-10-30', TODAY), /working day/, 'a Friday');
  assert.equal(m.requestedTimeError('09:30'), undefined);
  assert.match(m.requestedTimeError('07:00'), /between 08:00 and 18:00/);
  assert.match(m.requestedTimeError('18:00'), /between 08:00 and 18:00/);
});

test('a requested date later than the earliest makes the order future-dated', () => {
  assert.equal(m.isFutureDated({ requestSpecific: true, requestedDate: '2026-10-25', requestedTime: '10:00' }, TODAY), true);
  assert.equal(m.isFutureDated({ requestSpecific: true, requestedDate: '2026-10-18', requestedTime: '10:00' }, TODAY), false, 'the earliest date is not later');
  assert.equal(m.isFutureDated({ requestSpecific: false, requestedDate: '2026-10-25' }, TODAY), false);
  assert.equal(m.isFutureDated({ requestSpecific: true, requestedDate: '2026-12-25' }, TODAY), false, 'a date that cannot be used is not a request');
});

test('the booking is complete with a cluster, date and slot, and a specific request, when made, is complete and usable', () => {
  const base = { cluster: 'West Bay Cluster', date: '2026-10-18', timeSlot: '10:00-12:00' };
  assert.equal(m.isAppointmentComplete(base, TODAY), true);
  assert.equal(m.isAppointmentComplete({ ...base, timeSlot: undefined }, TODAY), false);
  assert.equal(m.isAppointmentComplete({ ...base, requestSpecific: true }, TODAY), false, 'a request needs its date and time');
  assert.equal(m.isAppointmentComplete({ ...base, requestSpecific: true, requestedDate: '2026-10-25', requestedTime: '10:00' }, TODAY), true);
  assert.equal(m.isAppointmentComplete({ ...base, requestSpecific: true, requestedDate: '2026-10-16', requestedTime: '10:00' }, TODAY), false, 'before the earliest date');
  assert.equal(stepMod.appointmentBookingStep().isValid({ appointment: base }) , Boolean(m.isAppointmentComplete(base)));
});

test('the technician collects the CAF by default; the persona default list is the one place a role would differ', () => {
  assert.deepEqual(m.defaultDocumentsFor(undefined), ['caf']);
  assert.deepEqual(m.defaultDocumentsFor('ROLE-01'), ['caf']);
  assert.deepEqual(m.APPOINTMENT_DOCUMENTS.map((d) => d.id), ['caf', 'tenancy', 'qid']);
});

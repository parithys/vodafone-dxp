import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../primitives/Badge';
import { Checkbox } from '../primitives/Checkbox';
import { Icon } from '../primitives/Icon';
import { Input } from '../primitives/Input';
import { Textarea } from '../primitives/Textarea';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { usePersonaStore } from '../../stores/personaStore';
import * as mockDataEngine from '../../engines/mockDataEngine';
import {
  APPOINTMENT_DOCUMENTS,
  CLUSTERS,
  LEAD_TIME_DAYS,
  MAX_DAYS_AHEAD,
  TIME_SLOTS,
  addDaysIso,
  bookableSlots,
  dateLong,
  dateShort,
  dayOfMonth,
  defaultDocumentsFor,
  earliestDate,
  isFutureDated,
  isSlotFull,
  monthYear,
  requestedDateError,
  requestedTimeError,
  slotLabel,
  techniciansAvailable,
  todayIso,
  weekdayShort,
  workingDaysFrom,
} from './appointmentModel';
import type { AppointmentBookingValue, BookedAppointment } from './appointmentModel';

export type { AppointmentBookingValue } from './appointmentModel';

interface AppointmentBookingStepProps {
  value: AppointmentBookingValue;
  onChange: (value: AppointmentBookingValue) => void;
}

const CLOCK = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2';

// Pattern 9: Appointment Booking - the SLA cluster, then the date strip (the next working days from the earliest date, each with the
// slots it still has), the day's time slots with the technicians free, the customer's own request for a specific date and time
// (a later date makes the order future-dated), the appointment notes and the documents the technician collects (defaulted from
// the persona). Bounded by the location's SLA cluster (SCR-028/049/083/109/115). Book Appointment fields (FLD-372-377): Collect
// QID/CAF are the document choices here; the FNP Identifier is handled by the caller.
export function AppointmentBookingStep({ value, onChange }: AppointmentBookingStepProps) {
  const [existing, setExisting] = useState<BookedAppointment[]>([]);
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const today = todayIso();
  const earliest = earliestDate(today);
  const strip = useMemo(() => workingDaysFrom(earliest), [earliest]);

  useEffect(() => {
    mockDataEngine.list<BookedAppointment>('appointments').then(setExisting);
    // Starts on the earliest date with the persona's documents; a date outside the strip or a slot this step no longer offers is dropped.
    const dateOk = value.date !== undefined && strip.includes(value.date);
    const slotOk = dateOk && value.timeSlot !== undefined && TIME_SLOTS.includes(value.timeSlot);
    const patch: AppointmentBookingValue = {};
    if (!dateOk) patch.date = earliest;
    if (!slotOk && value.timeSlot !== undefined) patch.timeSlot = undefined;
    if (value.documents === undefined) patch.documents = defaultDocumentsFor(personaId);
    if (Object.keys(patch).length > 0) onChange({ ...value, ...patch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { cluster, date, timeSlot } = value;
  const slotFull = (c: string | undefined, d: string | undefined, s: string) => Boolean(c && d && isSlotFull(existing, c, d, s));
  // A cluster or date change keeps the chosen slot only while it is still free there.
  const choose = (patch: Partial<AppointmentBookingValue>) => {
    const next = { ...value, ...patch };
    onChange(next.timeSlot && slotFull(next.cluster, next.date, next.timeSlot) ? { ...next, timeSlot: undefined } : next);
  };

  const documents = value.documents ?? defaultDocumentsFor(personaId);
  const defaults = defaultDocumentsFor(personaId);
  const toggleDocument = (id: string, on: boolean) => onChange({ ...value, documents: on ? [...documents, id] : documents.filter((d) => d !== id) });

  const dateError = value.requestSpecific ? requestedDateError(value.requestedDate, today) : undefined;
  const timeError = value.requestSpecific ? requestedTimeError(value.requestedTime) : undefined;
  const technicians = cluster && date ? techniciansAvailable(existing, cluster, date, timeSlot) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[length:var(--fs-label)] text-fg-2 mb-1">SLA Cluster</div>
        <div className="flex gap-2 flex-wrap">
          {CLUSTERS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cluster === c}
              onClick={() => choose({ cluster: c })}
              className={`px-3 py-1.5 rounded-[var(--radius-pill)] border text-[length:var(--fs-body)] ${
                cluster === c ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)] shadow-[var(--shadow-selected-ring)] text-[var(--field-card-selected)]' : 'border-border-soft bg-bg text-fg'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Appointment date" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-fg font-bold text-[length:var(--fs-h5)]">Select appointment date - {monthYear(date ?? earliest)}</h3>
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--icon-tile-bg)] px-3 py-1 text-fg-2 text-[length:var(--fs-caption)] font-semibold">
            <Icon path={CLOCK} className="w-4 h-4" />
            Earliest: {dateShort(earliest)} (lead time {LEAD_TIME_DAYS} days)
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {strip.map((d) => {
            const selected = date === d;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={selected}
                onClick={() => choose({ date: d })}
                className={`relative rounded-[var(--radius-card)] border px-2 py-3 text-center ${selected ? CARD_SELECTED : CARD_IDLE}`}
              >
                {selected && <SelectedTick />}
                <span className="block text-fg-2 text-[length:var(--fs-body)]">{weekdayShort(d)}</span>
                <span className="block text-fg font-bold text-[length:var(--fs-h4)]">{dayOfMonth(d)}</span>
                {cluster && <span className="block text-muted text-[length:var(--fs-caption)]">{bookableSlots(existing, cluster, d)} slots</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Available slots" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-fg font-bold text-[length:var(--fs-h5)]">Available slots - {dateLong(date ?? earliest)}</h3>
          {technicians !== undefined && (
            <Badge variant="success">
              {technicians} technician{technicians === 1 ? '' : 's'} available
            </Badge>
          )}
        </div>
        {cluster ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {TIME_SLOTS.map((slot) => {
              const full = slotFull(cluster, date, slot);
              const selected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={selected}
                  disabled={full}
                  onClick={() => choose({ timeSlot: slot })}
                  className={`relative rounded-[var(--radius-card)] border px-2 py-3 text-center disabled:cursor-not-allowed ${
                    full ? 'border-border-soft bg-surface text-muted' : selected ? CARD_SELECTED : CARD_IDLE
                  }`}
                >
                  {selected && !full && <SelectedTick />}
                  <span className={`block font-bold text-[length:var(--fs-body-lg)] ${full ? 'text-muted' : 'text-fg'}`}>{slotLabel(slot)}</span>
                  <span className={`block text-[length:var(--fs-body)] ${full ? 'text-muted' : 'text-fg-2'}`}>{full ? 'Full' : selected ? 'Selected' : 'Available'}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-muted text-[length:var(--fs-body)]">Choose an SLA cluster to see its slots.</p>
        )}
      </section>

      <section aria-label="Specific date and time" className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg p-4 space-y-3">
        <label className="flex items-center gap-3 text-[length:var(--fs-body-lg)] text-fg cursor-pointer">
          <Checkbox
            checked={Boolean(value.requestSpecific)}
            onChange={(e) =>
              onChange(e.target.checked ? { ...value, requestSpecific: true } : { ...value, requestSpecific: false, requestedDate: undefined, requestedTime: undefined })
            }
          />
          Customer requests a specific date and time
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Requested Date"
            type="date"
            disabled={!value.requestSpecific}
            min={earliest}
            max={addDaysIso(today, MAX_DAYS_AHEAD)}
            value={value.requestedDate ?? ''}
            onChange={(e) => onChange({ ...value, requestedDate: e.target.value || undefined })}
            error={dateError}
          />
          <Input
            label="Requested Time"
            type="time"
            disabled={!value.requestSpecific}
            min={TIME_SLOTS[0].slice(0, 5)}
            max={TIME_SLOTS[TIME_SLOTS.length - 1].slice(6)}
            value={value.requestedTime ?? ''}
            onChange={(e) => onChange({ ...value, requestedTime: e.target.value || undefined })}
            error={timeError}
          />
          <Input
            label="Future-Dated Order"
            readOnly
            disabled
            value={isFutureDated(value, today) ? `Yes - ${dateShort(value.requestedDate!)}` : 'Not set'}
          />
        </div>
      </section>

      <Textarea
        label="Appointment Notes"
        placeholder="Customer available after 10:00. Gate code 4471. Call before arrival."
        value={value.comments ?? ''}
        onChange={(e) => onChange({ ...value, comments: e.target.value })}
      />

      <section aria-label="Documents the technician collects" className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-fg font-bold text-[length:var(--fs-h5)]">Documents the Technician Collects</h3>
          <span className="text-muted text-[length:var(--fs-caption)]">Defaulted from Persona</span>
        </div>
        <ul className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg divide-y divide-border-soft">
          {APPOINTMENT_DOCUMENTS.map((doc) => {
            const checked = documents.includes(doc.id);
            return (
              <li key={doc.id}>
                <label className="flex items-center gap-3 px-4 py-3 text-[length:var(--fs-body)] text-fg cursor-pointer">
                  <Checkbox checked={checked} onChange={(e) => toggleDocument(doc.id, e.target.checked)} />
                  <span className="flex-1">{doc.label}</span>
                  <Badge>{checked ? (defaults.includes(doc.id) ? 'Default' : 'Added') : 'Not required'}</Badge>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

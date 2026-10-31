import { CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { BARCODE_DEMO_NUMBERS } from '../../data/synthetic/idScanSamples';
import { ID_TYPES, idTypeLabel, type IdType } from '../../data/idTypes';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../primitives/Icon';
import { Button } from '../primitives/Button';

export type QidType = IdType;
export { idTypeLabel };

interface QidTypeSelectorProps {
  /** Undefined = nothing chosen yet (verify-then-fetch flow: the agent picks first). */
  idType: QidType | undefined;
  onIdTypeChange: (type: QidType) => void;
  /**
   * Which types this journey offers. Defaults to all four, which is what the
   * six journeys other than New Postpaid rely on - Passport-to-QID in
   * particular exists to handle a passport, so this could not be narrowed
   * globally.
   *
   * New Postpaid passes ['QID', 'Diplomatic ID']: a postpaid connection may
   * be sold directly only against one of those, and Passport / GCC ID route
   * to Back Office Fulfilment approval instead of this flow.
   */
  allowedTypes?: QidType[];
  /**
   * Types shown but NOT selectable, with `unavailableHint` underneath
   * (2026-09-27 walkthrough: "keep visibly disabled until approval workflows
   * designed"). Rendering them greyed rather than omitting them is the point -
   * an agent holding a passport needs to see that the option exists and why it
   * is closed, which an absent card cannot tell them.
   *
   * These are additive to `allowedTypes`: a type named here is offered even
   * when `allowedTypes` excludes it.
   */
  unavailableTypes?: QidType[];
  unavailableHint?: string;
}

interface QidNumberFieldProps {
  idType: QidType;
  value: string;
  onChange: (value: string) => void;
  onFetch: () => void;
  fetching?: boolean;
  error?: string;
  /** Lets the owner move the cursor into the field - used after an ID Type
   * switch clears it, so the agent lands on the field they must retype
   * rather than on the chip they just clicked. */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The number came off a scan rather than the keyboard, so it is displayed
   * rather than typed - and Fetch is HIDDEN, because the scan already
   * triggered the lookup. Fetch appears only when the field is editable,
   * i.e. when there is a number the agent could have changed.
   */
  readOnly?: boolean;
  /** Sits under the field. */
  hint?: string;
  /** Extra reason Fetch cannot be pressed yet (beyond an empty number). */
  fetchDisabled?: boolean;
  /**
   * A second, labelled field placed in the SAME row between the number and
   * Fetch (verify-then-fetch: QID | Expiry Date | Fetch). The caller supplies
   * the complete field including its own label.
   */
  inlineField?: ReactNode;
  /** The acted-for customer's own ID number: the demo barcode button pushes this instead of the fixed specimen number. */
  barcodeNumber?: string;
  /** The barcode button's own handler (the reader supplies the number); without it the button pushes `barcodeNumber` / the demo number. */
  onBarcodeScan?: () => void;
  /** Show Fetch even though the number is read-only. */
  showFetch?: boolean;
  /**
   * Right-aligned on the label line - for a lookup status that belongs to
   * this number (the MOI badge). Kept as a slot rather than a boolean so the
   * caller owns what the status says; this component knows nothing about MOI.
   */
  status?: ReactNode;
  /**
   * A second, smaller line under the label row, right-aligned under `status`
   * (2026-09-28) - for a fact ABOUT that status, such as when a lookup was
   * last refreshed (e.g. "MOI Update Time: ..."). Same slot philosophy as
   * `status`: this component only positions it and still knows nothing about
   * MOI specifically.
   */
  statusDetail?: ReactNode;
}
const SEARCH_ICON = 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3';
/** A row of bars of varying width, standing in for a 1D barcode symbol at the
 * small size this renders at (the field's trailing icon, ~16px). */
const BARCODE_ICON = 'M3 4v16 M6 4v16 M8 4v16 M11 4v16 M13 4v16 M14 4v16 M17 4v16 M19 4v16 M21 4v16';


/**
 * DEMO ONLY (2026-09-28, requested as such): the barcode icon inside this
 * field simulates reading the number off a physical barcode rather than
 * requiring the agent to type it. There is no real scanner integration -
 * same simulated shape as every other "scan" in this app - so the click
 * fills a fixed, realistic number per type instead of reading one.
 *
 * Grounded in the SAME four identity-documents.json records the auto-detect
 * scan flow resolves (see ScannedIdPreview's SPECIMENS, and its note on why
 * Diplomatic ID resolves to Henrik Lindqvist/DIP-QA-004977 rather than the
 * array-first, but expired, Sophie Laurent/DIP-QA-004521 record) - not the
 * DIFFERENT numbers this file's own placeholder text shows. A barcode-filled
 * QID or Passport number was already going to match its placeholder (both
 * happen to be the same record), but Diplomatic ID's placeholder is
 * Sophie's - keeping the two demo paths pointed at the same identity per type
 * matters more than matching the placeholder text.
 */

// QID/Passport/GCC/Diplomatic ID lookup control, per component-catalogue.md §2
// (ENT-023/037 Customer/Contact) - a 4-way ID Type card selector (only QID and
// Passport have evidenced identity-documents records to resolve against; GCC
// ID/Diplomatic ID are included as selectable per the reference but have no
// seeded MOI matches yet) driving the label/placeholder of a single number
// field with an inline Fetch action, replacing the earlier plain text input +
// separate below-field submit button.

// The ID Type card selector. Split out from the number field on
// 2026-09-25 so a caller can put content BETWEEN them - IdLookupStep now
// renders the QID scanner in that gap, and only reveals the number once a
// scan has produced one.
export function QidTypeSelector({
  idType,
  onIdTypeChange,
  allowedTypes,
  unavailableTypes,
  unavailableHint,
}: QidTypeSelectorProps) {
  const unavailable = new Set(unavailableTypes ?? []);
  const offered = allowedTypes
    ? ID_TYPES.filter((t) => allowedTypes.includes(t.type) || unavailable.has(t.type))
    : ID_TYPES;
  return (
    <div>
      <p className="text-[length:var(--fs-label)] text-fg-2">ID Type</p>
      {/* Sub-title: the types that cannot be picked here without pre-approval. */}
      <p className={`text-[length:var(--fs-caption)] text-muted ${unavailable.size > 0 ? 'mt-0.5 mb-2' : 'mb-2'}`}>
        {unavailable.size > 0 &&
          `Required pre-approval: ${offered.filter((t) => unavailable.has(t.type)).map((t) => t.label).join(', ')}`}
      </p>
      {/* Columns follow the count offered, so two cards fill the row rather
          than leaving two empty quarter-width gaps. */}
      <div className={`grid gap-3 ${offered.length > 2 ? 'grid-cols-[repeat(auto-fill,minmax(min(100%,12rem),1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))]'}`}>
        {offered.map((t) => {
          const isUnavailable = unavailable.has(t.type);
          // NOT gated on availability (2026-09-28) - `idType` is the type
          // the app actually detected or was last attempting, regardless of
          // whether that type can be clicked into here. Gating this on
          // `!isUnavailable` used to hide the checkmark entirely whenever the
          // detected type was one requiring exception approval (Passport/GCC
          // ID in Postpaid): a scan could correctly resolve to "Passport" and
          // drive the number field below with Passport's label and
          // placeholder, while this selector showed nothing chosen at all -
          // the one card that WAS the answer looked identical to the three
          // that weren't.
          const selected = t.type === idType;
          return (
            <button
              key={t.type}
              type="button"
              disabled={isUnavailable}
              aria-disabled={isUnavailable || undefined}
              aria-pressed={selected}
              onClick={() => !isUnavailable && onIdTypeChange(t.type)}
              className={`relative flex flex-row items-center justify-start gap-3 rounded-[var(--radius-card)] border p-4 ${
                isUnavailable
                  ? 'border-border-soft bg-bg text-muted opacity-60'
                  : selected
                    ? `${CARD_SELECTED} text-[var(--field-card-selected)]`
                    : 'border-[var(--field-card-border)] bg-bg text-fg enabled:hover:border-[var(--field-card-hover-border)] enabled:hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]'
              }`}
            >
              {selected && <SelectedTick />}
              {/* White tile behind the icon when selected. Padding is always
                  present so the card does not change size between states. */}
              <span className={`inline-flex p-2 rounded-[var(--radius-card)] ${selected && !isUnavailable ? 'bg-[var(--field-card-selected)] text-on-dark' : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'}`}>
                <Icon path={t.icon} className="w-6 h-6" />
              </span>
              <span className="text-[length:var(--fs-caption)] font-bold whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>
      {unavailable.size > 0 && unavailableHint && (
        <p className="mt-2 text-[length:var(--fs-caption)] text-muted">{unavailableHint}</p>
      )}
    </div>
  );
}

// The number field and its Fetch action. The label and placeholder follow the
// selected ID Type. Whether this renders AT ALL is the caller's decision.
/** The label of an ID type's number field, e.g. "Qatar ID (QID) Number". */
export function idNumberLabel(idType: QidType): string {
  return (ID_TYPES.find((t) => t.type === idType) ?? ID_TYPES[0]).numberLabel;
}

export function QidNumberField({
  idType,
  value,
  onChange,
  onFetch,
  fetching,
  error,
  inputRef,
  readOnly = false,
  hint,
  fetchDisabled = false,
  inlineField,
  barcodeNumber,
  onBarcodeScan,
  showFetch = false,
  status,
  statusDetail,
}: QidNumberFieldProps) {
  const current = ID_TYPES.find((t) => t.type === idType) ?? ID_TYPES[0];

  return (
    <div>
      {/* Label left, status right, on one line. The status sits here rather
          than beside the input because the input is flex-1 and consumes the
          whole row whenever Fetch is hidden - which is exactly the state that
          HAS a status to show. min-h keeps the line the same height with and
          without a badge, so the field below does not shift when the lookup
          resolves. */}
      <div className={`flex items-center gap-3 min-h-7 mb-1 ${inlineField ? 'justify-start' : 'justify-between'}`}>
        {inlineField ? null : (
          <label htmlFor="qid-number-input" className="block text-[length:var(--fs-label)] text-fg">
            {current.numberLabel}
          </label>
        )}
        {status}
      </div>
      {/* Right-aligned under `status`, same reasoning as that slot - a fact
          about the lookup, not about the field itself, so it reads as an
          annex to the badge above it rather than a second label. */}
      {statusDetail && <p className="text-[length:var(--fs-caption)] text-muted text-right -mt-0.5 mb-1">{statusDetail}</p>}
      <div className={`flex gap-2 ${inlineField ? 'items-end' : ''}`}>
        {/* readOnly, not disabled: a scanned number is data the agent reads
            back off the screen, and disabled styling drops it to
            --field-label-disabled at about 2.3:1. readOnly keeps --fg.
            NOT selectable/focusable/clickable as of 2026-09-28, matching
            Input.tsx's primitive - select-none plus blocking focus-on-click
            below. This reverses the "stays selectable so it can be copied"
            note that used to sit here; see Input.tsx for the fuller
            rationale and the tradeoff this gives up. */}
        {/* Relative wrapper so the barcode icon sits INSIDE the field's
            border rather than beside it - it fills the same box the agent
            would otherwise type into, the way a real barcode reader's output
            lands in the field it's wired to. Only wrapped (not a plain
            input) when the icon can actually render, so the readOnly/scanned
            state keeps its original markup untouched. */}
        <div className={inlineField ? 'flex-1 min-w-0 flex flex-col gap-1' : 'contents'}>
          {inlineField && (
            <label htmlFor="qid-number-input" className="block text-[length:var(--fs-label)] text-fg">
              {current.numberLabel}
            </label>
          )}
        {/* Read-only: resting border only - no filled/hover/focus styling, the
            same as every other read-only field. */}
        {readOnly ? (
          <input
            id="qid-number-input"
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            className={`flex-1 min-w-0 rounded-[var(--field-radius)] border px-3 py-2 text-[length:var(--fs-body)] text-fg
              bg-surface cursor-default select-none
              ${error ? 'border-[var(--field-border-error)]' : 'border-[var(--field-border)]'}
              focus:outline-none`}
          />
        ) : (
          <div className="relative flex-1 min-w-0">
            <input
              id="qid-number-input"
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={current.placeholder}
              // A touch device opens the numeric keypad for a digits-only number (QID, GCC ID, Diplomatic ID), the full keyboard for a passport.
              inputMode={current.numericNumber ? 'numeric' : 'text'}
              className={`w-full rounded-[var(--field-radius)] border py-2 pl-3 pr-9 text-[length:var(--fs-body)] text-[var(--color-field-text-filled)] bg-bg
                ${error ? 'border-[var(--field-border-error)]' : value ? 'border-[var(--field-border-filled)]' : 'border-[var(--field-border)]'}
                focus:outline-none focus-visible:border-[var(--field-focus-border)]! focus-visible:bg-[var(--field-focus-bg)] focus-visible:shadow-[var(--field-focus-ring)]`}
            />
            {/* DEMO ONLY - see BARCODE_DEMO_NUMBERS. Real hardware would push
                a read into this same field; this simulates that push with a
                fixed number for whichever ID type is currently selected. */}
            <button
              type="button"
              onClick={() => (onBarcodeScan ? onBarcodeScan() : onChange(barcodeNumber ?? BARCODE_DEMO_NUMBERS[idType]))}
              aria-label={`Simulate scanning the ${current.numberLabel.replace(/ Number$/, '')} barcode`}
              title="Scan barcode"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-[var(--radius-button)] text-muted
                hover:text-accent focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
              <Icon path={BARCODE_ICON} className="w-4 h-4" />
            </button>
          </div>
        )}
        </div>
        {inlineField && <div className="w-48 shrink-0">{inlineField}</div>}
        {/* Only when the number is typeable. A scanned number has already
            been looked up by the act of scanning, so a Fetch beside it asked
            the agent to perform an action that had no effect they could
            observe - and its presence implied the read-only value might still
            need submitting. Hidden rather than disabled: there is no state
            from which it becomes usable without the field becoming editable
            first, so a greyed-out button would never light up in place. */}
        {(!readOnly || showFetch) && (
          <Button variant="primary" onClick={onFetch} disabled={!value || fetching || fetchDisabled}>
            <Icon path={SEARCH_ICON} className="w-4 h-4" />
            {fetching ? 'Fetching…' : 'Fetch'}
          </Button>
        )}
      </div>
      {error && <p className="text-[var(--field-border-error)] text-[length:var(--fs-caption)] mt-1">{error}</p>}
      {!error && hint && <p className="text-muted text-[length:var(--fs-caption)] mt-1">{hint}</p>}
    </div>
  );
}

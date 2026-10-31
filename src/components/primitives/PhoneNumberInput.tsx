import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from './Input';
import { Icon } from './Icon';
import { CountryMarker } from './CountryMarker';
import { COUNTRY_DIAL_CODES, DEFAULT_COUNTRY_ISO, countryByIso, countryFromNumber } from './countryDialCodes';

const CHEVRON_DOWN = 'M6 9l6 6 6-6';

// Presentation-only formatting ("+974 50350824": the digits of the number are never split by a space) for a complete, valid
// +974-prefixed 8-digit local number (mobile or landline - Qatar numbers of
// either kind are 8 digits after the country code, so this isn't restricted
// to mobile-prefix digits). Kept exported: callers outside this field still
// format stored numbers for display.
export function formatQatarPhoneForDisplay(raw: string): string {
  const digits = raw.replace(/^\+/, '');
  if (!digits.startsWith('974')) return raw;
  const local = digits.slice(3);
  if (!/^\d{8}$/.test(local)) return raw;
  return `+974 ${local}`;
}

function groupDigits(national: string): string {
  return national;
}

interface PhoneNumberInputProps {
  label?: string;
  error?: string;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Hard cap on NATIONAL digits, below the E.164 ceiling.
   *
   * Without this the limit is 15 minus the dial code - 12 digits on +974 -
   * so a Qatar-pinned field happily accepted "777777777777". A field that is
   * fixed to one country has a known length, and the keystroke that would
   * exceed it should simply not land rather than being typed and then
   * rejected by a validator underneath.
   */
  maxNationalDigits?: number;
  className?: string;
  required?: boolean;
  helperText?: string;
  /**
   * Pin the dial code and hide the country picker.
   *
   * For a field whose rule names ONE country: the Alternate phone # must be
   * +974 followed by 8 digits (FLD-352), so offering 200 other dial codes
   * would present a choice where every alternative fails validation. The
   * picker stays for consumers that genuinely accept an international number.
   */
  fixedIso?: string;
  /** Keep the wizard's arrival auto-focus off this field (an optional one). */
  noAutoFocus?: boolean;
  /** Text shown in the field instead of the digits (a masked number); focusing selects it, so typing replaces it. */
  maskedDisplay?: string;
  /** Shown, not editable. */
  readOnly?: boolean;
}

// Shared phone-number field: a country-code dropdown locked inside the field's
// left edge, then the national digits.
//
// The stored value is always E.164 (dial code + national), so every consumer
// and validator keeps receiving one string - the split is presentational.
// Changing the country rewrites the prefix and KEEPS the digits, which is what
// an agent correcting "right number, wrong country" expects.
//
// The selected country is component state rather than derived from the stored
// value on every render, because dial codes are not unique (+1 covers the US,
// Canada and much of the Caribbean), so a number cannot tell you which country
// was picked. It IS seeded from the value via countryFromNumber, so a
// persisted draft or an MOI prefill reopens on the right country.
//
// This restores international entry, which the fixed +974 prefix had removed -
// see the note on isValidAltPhone, which always accepted foreign numbers.
export function PhoneNumberInput({
  label,
  error,
  value,
  placeholder: _noPlaceholder,
  onChange,
  maxNationalDigits,
  className,
  required,
  helperText,
  fixedIso,
  noAutoFocus,
  maskedDisplay,
  readOnly,
}: PhoneNumberInputProps) {
  const [iso, setIso] = useState(() => fixedIso ?? countryFromNumber(value)?.iso ?? DEFAULT_COUNTRY_ISO);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-countries`;
  const optionId = (i: number) => `${baseId}-country-${i}`;
  const country = countryByIso(iso);

  // Re-seed when a value arrives after mount (MOI prefill, draft rehydrate),
  // but stop once the agent has chosen a country themselves - otherwise this
  // would fight their selection on the next keystroke.
  const userPickedCountry = useRef(false);
  useEffect(() => {
    if (userPickedCountry.current) return;
    const detected = countryFromNumber(value);
    if (fixedIso) return;
    if (detected && detected.iso !== iso) setIso(detected.iso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const national = value.startsWith(country.dial) ? value.slice(country.dial.length) : value.replace(/^\+/, '');
  const nationalDigits = national.replace(/\D/g, '');

  // E.164 allows 15 digits including the country code, so the national cap
  // depends on which country is selected rather than being Qatar's 8.
  const maxNational = Math.min(maxNationalDigits ?? Infinity, 15 - (country.dial.length - 1));

  const handleDigits = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, maxNational);
    // Empty stays empty rather than becoming a bare dial code, which would
    // read as filled to the required check and to Input's isFilled border.
    e.target.value = digits ? `${country.dial}${digits}` : '';
    onChange(e);
  };

  // Keep the highlighted country in view in the long list.
  useEffect(() => {
    if (open) document.getElementById(optionId(highlighted))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, highlighted]);

  const pickCountry = (nextIso: string) => {
    const next = countryByIso(nextIso);
    userPickedCountry.current = true;
    setIso(nextIso);
    setOpen(false);
    triggerRef.current?.focus();
    // Synthesised so the parent's onChange signature is unchanged; every call
    // site only ever reads e.target.value.
    onChange({
      target: { value: nationalDigits ? `${next.dial}${nationalDigits}` : '' },
    } as ChangeEvent<HTMLInputElement>);
  };

  // Focus stays on the trigger; the highlighted country is named through aria-activedescendant.
  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = COUNTRY_DIAL_CODES.length - 1;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setHighlighted(Math.max(0, COUNTRY_DIAL_CODES.findIndex((c) => c.iso === iso)));
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        setHighlighted((i) => Math.min(last, i + 1));
        break;
      case 'ArrowUp':
        setHighlighted((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        setHighlighted(0);
        break;
      case 'End':
        setHighlighted(last);
        break;
      case 'PageDown':
        setHighlighted((i) => Math.min(last, i + 8));
        break;
      case 'PageUp':
        setHighlighted((i) => Math.max(0, i - 8));
        break;
      case 'Enter':
      case ' ':
        pickCountry(COUNTRY_DIAL_CODES[highlighted]?.iso ?? iso);
        break;
      case 'Escape':
        // Closes the list only - not the dialog the field sits in (Modal/Drawer listen for Escape on the document).
        e.stopPropagation();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        return;
      default: {
        // Type-ahead by country name.
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        const ch = e.key.toLowerCase();
        const from = highlighted + 1;
        const hit = [...COUNTRY_DIAL_CODES.slice(from), ...COUNTRY_DIAL_CODES.slice(0, from)].findIndex((c) => c.name.toLowerCase().startsWith(ch));
        if (hit >= 0) setHighlighted((from + hit) % COUNTRY_DIAL_CODES.length);
        return;
      }
    }
    e.preventDefault();
  };

  return (
    <Input
      label={label}
      error={error}
      required={required}
      helperText={helperText}
      data-no-autofocus={noAutoFocus ? '' : undefined}
      inputMode="tel"
      autoComplete="tel-national"
      leadingAddon={
        <span ref={containerRef} className="contents">
            {/* Pinned: a plain, non-focusable label. Not a disabled button -
                a disabled control still says "there is a choice here, just not
                for you", where the point is that this field has one country by
                rule. Nothing to tab through either. */}
            {fixedIso ? (
              <span className="flex items-center gap-1 text-fg-2">
                <CountryMarker iso={country.iso} />
                {country.dial}
              </span>
            ) : (
            <>
            <button
              type="button"
              role="combobox"
              ref={triggerRef}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              aria-activedescendant={open ? optionId(highlighted) : undefined}
              aria-label={`Country calling code, currently ${country.name} ${country.dial}`}
              onClick={() => setOpen((v) => !v)}
              onKeyDown={onTriggerKeyDown}
              className="flex items-center gap-1 text-fg-2 focus:outline-none focus-visible:underline"
            >
              <CountryMarker iso={country.iso} />
              {country.dial}
              <Icon path={CHEVRON_DOWN} className="w-3.5 h-3.5 text-muted" />
            </button>
            {open && (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Country calling code"
                // Anchored to the field wrapper rather than the dial-code
                // button, so the panel is exactly as wide as the input it
                // belongs to instead of a fixed w-64. Inset by -1px each side
                // because left-0/right-0 resolve to the wrapper's padding box,
                // which excludes its 1px border - without this the panel is
                // 2px narrower than the field and the edges do not line up.
                className="absolute z-[var(--z-popover)] top-full -left-px -right-px mt-2 max-h-64 overflow-y-auto rounded-[var(--field-radius)] border border-border-soft bg-bg shadow-raised py-1"
              >
                {COUNTRY_DIAL_CODES.map((c, i) => (
                  <li
                    key={c.iso}
                    id={optionId(i)}
                    role="option"
                    aria-selected={c.iso === iso}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => pickCountry(c.iso)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 text-[length:var(--fs-caption)] cursor-pointer text-fg-2 ${
                      i === highlighted ? 'bg-[var(--field-focus-bg)]' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <CountryMarker iso={c.iso} />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="text-muted shrink-0">{c.dial}</span>
                  </li>
                ))}
              </ul>
            )}
            </>
            )}
        </span>
      }
      value={maskedDisplay ?? groupDigits(nationalDigits)}
      readOnly={readOnly}
      onFocus={maskedDisplay ? (e) => e.currentTarget.select() : undefined}
      className={className}
      onChange={handleDigits}
    />
  );
}

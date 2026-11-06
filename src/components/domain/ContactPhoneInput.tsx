import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { formatQatarPhoneForDisplay } from '../primitives/phoneFormat';
import { useSearchListNav } from '../../hooks/useSearchListNav';
import { CHEVRON_DOWN, CHEVRON_UP } from '../../assets/icons';

interface ContactRecord {
  contactRecordId: string;
  customerId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  cellNumber?: string;
  workPhone?: string;
}

interface ContactPhoneInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  /** Saved-contacts panel is scoped to this customer's own `customer-contacts`
   * records - omitted entirely (chevron/panel not rendered) when there's no
   * active customer to source it from, rather than showing an empty panel. */
  customerId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}


function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

// Mobile-number field with a saved-contacts picker, per Contact-Open.svg.
// Sourced from the customer's real `customer-contacts` records (cellNumber +
// name) - the mockup's per-row "Primary" badge and photo avatars have no
// backing field in that dataset, so this renders initials avatars and omits
// the badge rather than fabricating either.
export function ContactPhoneInput({
  label,
  error,
  helperText,
  value,
  onChange,
  customerId,
  placeholder,
  disabled,
  className = '',
  id,
}: ContactPhoneInputProps) {
  const autoId = useId();
  const inputId = id ?? `contact-phone-${autoId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customerId) return;
    mockDataEngine.list<ContactRecord>('customer-contacts').then((all) => setContacts(all.filter((c) => c.customerId === customerId && c.cellNumber)));
  }, [customerId]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const pick = (c: ContactRecord) => {
    if (c.cellNumber) onChange(c.cellNumber);
    setOpen(false);
  };

  // Keyboard: ArrowDown opens the saved-contacts list, Arrow keys move through it, Enter picks, Escape closes.
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = `${inputId}-listbox`;
  const optionPrefix = `${inputId}-opt`;
  const nav = useSearchListNav({
    idPrefix: optionPrefix,
    count: contacts.length,
    enabled: open,
    resetKey: `${open}|${contacts.length}`,
    inputRef,
    onSelect: (i) => pick(contacts[i]),
    onEscape: () => setOpen(false),
  });
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (customerId && !open && e.key === 'ArrowDown' && contacts.length > 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    nav.inputProps.onKeyDown(e);
  };

  const isFilled = value.trim().length > 0;
  const borderClass = error
    ? 'border-[var(--field-border-error)]'
    : isFilled
      ? 'border-[var(--field-border-filled)] hover:border-[var(--field-hover-border)]'
      : 'border-[var(--field-border)] hover:border-[var(--field-hover-border)]';

  return (
    <div className="stack gap-1">
      {label && (
        <label htmlFor={inputId} className={`text-[length:var(--fs-label)] ${disabled ? 'text-[var(--field-label-disabled)]' : 'text-fg'}`}>
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <div
          // bg set via this JS ternary, not Tailwind's disabled: pseudo-class:
          // `disabled` sits on the <input> below, not on this wrapper div.
          className={`input-shell
 ${disabled ? 'bg-[var(--field-bg-disabled)] border-[var(--field-border-disabled)]' : 'bg-bg ' + borderClass}
 ${className}`}
        >
          <span aria-hidden="true" className="text-base leading-none">🇶🇦</span>
          <span className="text-secondary shrink-0">+974</span>
          <span className="vrule h-5 bg-[var(--field-border-disabled)]" />
          <input
            ref={inputRef}
            id={inputId}
            onKeyDown={onInputKeyDown}
            {...(customerId
              ? { role: 'combobox' as const, 'aria-expanded': open, 'aria-controls': open ? listboxId : undefined, 'aria-autocomplete': 'none' as const, 'aria-activedescendant': nav.inputProps['aria-activedescendant'] }
              : {})}
            aria-invalid={error ? true : undefined}
            disabled={disabled}
            value={focused ? value : formatQatarPhoneForDisplay(value)}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            aria-describedby={describedBy}
            className="input-bare"
          />
          {customerId && (
            <button
              type="button"
              disabled={disabled}
              aria-label="Choose a saved contact"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              onClick={() => setOpen((v) => !v)}
              className={`shrink-0 p-1 ${disabled ? 'text-muted' : isFilled ? 'text-[var(--field-icon-active)]' : 'text-[var(--field-icon)]'}`}
            >
              <Icon path={open ? CHEVRON_UP : CHEVRON_DOWN} className="size-4 " />
            </button>
          )}
        </div>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Saved contacts"
            className="dropdown-popover"
          >
            {contacts.map((c, i) => (
              <li
                key={c.contactRecordId}
                id={`${optionPrefix}-${i}`}
                role="option"
                aria-selected={nav.active === i}
                onClick={() => pick(c)}
                className={`row pad-row cursor-pointer hover:bg-[var(--field-focus-bg)] ${nav.active === i ? 'bg-[var(--field-focus-bg)]' : ''}`}
              >
                <span className="avatar size-8 shrink-0">
                  {initials(c.firstName, c.lastName)}
                </span>
                <span className="min-w-0">
                  <span className="line-body">{formatQatarPhoneForDisplay(c.cellNumber ?? '')}</span>
                  <span className="line-caption">{[c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ')}</span>
                </span>
              </li>
            ))}
            {contacts.length === 0 && <li className="cell-body text-muted">No saved contacts.</li>}
          </ul>
        )}
      </div>
      {helperText && !error && (
        <span id={helperId} className="caption-muted">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-[length:var(--fs-caption)] text-[var(--field-border-error)]">
          {error}
        </span>
      )}
    </div>
  );
}

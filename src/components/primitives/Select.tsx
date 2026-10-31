import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Icon } from './Icon';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  /** Required marker + aria-required, mirroring Input's prop of the same name. */
  required?: boolean;
  className?: string;
  id?: string;
  /** Dark-panel styling for the login page (Role field) - same mechanism, different trigger/panel skin. */
  dark?: boolean;
  /** For call sites with no visible `label` (e.g. a dense table-cell filter) -
   * gives the trigger an accessible name without rendering visible text. */
  'aria-label'?: string;
  /** Kept for existing callers. Every Select is searchable now: the field takes typing and the list narrows as the user types. */
  searchable?: boolean;
  /** Opens the option list above the field - for a select at the bottom of a panel, where a list below would be cut off. */
  openUp?: boolean;
  /** Gives the option list a tinted surface so it stands apart from a same-coloured panel behind it (a drawer, a modal footer). */
  tintedPanel?: boolean;
}

const CHEVRON_DOWN = 'M6 9l6 6 6-6';

// Every dropdown in the app is this one searchable combobox (the pattern of the Kahramaa Meter ID field): the field itself takes the typing,
// the list narrows as the agent types, a chevron opens it, and there is no separate search box or search icon. Typing never changes the
// value; only choosing a row does, and leaving the field with text that was not chosen puts the selected label back.
//
// A custom-positioned listbox, not a native <select>. Native <select> option
// popups are rendered by the browser/OS and their placement relative to the
// trigger can't be controlled via CSS - that's what produced the
// inconsistent gap this replaces. This panel is a normal absolutely
// positioned DOM node (`top-full` + a small `mt-1`), so it opens directly
// under the trigger's bottom edge identically everywhere the component is
// used. `onChange` synthesizes a minimal `{ target: { value } }` event -
// every call site in the app only ever reads `e.target.value`, so this is a
// drop-in replacement with no caller changes required.
export function Select({
  label,
  error,
  helperText,
  options,
  placeholder: _noPlaceholder,
  value,
  onChange,
  disabled,
  required,
  className = '',
  id,
  dark = false,
  'aria-label': ariaLabel,
  searchable: _searchable,
  openUp = false,
  tintedPanel = false,
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? `select-${autoId}`;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;
  const labelId = `${selectId}-label`;
  const optionId = (i: number) => `${selectId}-opt-${i}`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLInputElement>(null);
  const skipFocusOpen = useRef(false);
  // True from the first keystroke until the list closes: only then does the text in the field filter the list.
  const [typing, setTyping] = useState(false);

  const selected = options.find((o) => o.value === value);
  // Options shown in the open panel: narrowed by what was typed.
  const shown = typing && query.trim() ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())) : options;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        setTyping(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // Keep the highlighted option in view when the list is longer than its box.
  useEffect(() => {
    if (open) document.getElementById(optionId(highlighted))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, highlighted]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    setQuery('');
    setTyping(false);
    if (returnFocus) {
      // Focus comes back to the field without reopening the list its own onFocus would otherwise open.
      skipFocusOpen.current = true;
      triggerRef.current?.focus();
      skipFocusOpen.current = false;
    }
  };

  const commit = (optionValue: string | undefined) => {
    if (optionValue === undefined) return;
    onChange?.({ target: { value: optionValue } } as ChangeEvent<HTMLSelectElement>);
    close(true);
  };

  const openList = () => {
    setHighlighted(Math.max(0, options.findIndex((o) => o.value === value)));
    setQuery('');
    setTyping(false);
    setOpen(true);
  };

  // Keys on the field: focus never leaves it; the highlighted option is named through aria-activedescendant.
  const onFieldKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        openList();
      }
      return;
    }
    const last = shown.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        setHighlighted((i) => Math.min(last, i + 1));
        break;
      case 'ArrowUp':
        setHighlighted((i) => Math.max(0, i - 1));
        break;
      case 'PageDown':
        setHighlighted((i) => Math.min(last, i + 8));
        break;
      case 'PageUp':
        setHighlighted((i) => Math.max(0, i - 8));
        break;
      case 'Enter':
        commit(shown[highlighted]?.value);
        break;
      case 'Escape':
        // Closes the list only - not the dialog the field sits in (Modal/Drawer listen for Escape on the document).
        e.stopPropagation();
        close(true);
        break;
      case 'Tab':
        close(false);
        return; // let focus move on
      default:
        return; // Home / End / characters: the caret and the text behave as in any field
    }
    e.preventDefault();
  };

  const triggerClasses = dark
    ? 'border-on-dark-line-2 bg-on-dark-fill-1 text-on-dark focus-visible:border-accent'
    : `${
        error
          ? 'border-[var(--field-border-error)]'
          : selected
            ? 'border-[var(--field-border-filled)] enabled:hover:border-[var(--field-hover-border)]'
            : 'border-[var(--field-border)] enabled:hover:border-[var(--field-hover-border)]'
      } bg-bg text-[var(--color-field-text-filled)] focus-visible:border-[var(--field-focus-border)]! focus-visible:bg-[var(--field-focus-bg)] focus-visible:shadow-[var(--field-focus-ring)]
      disabled:border-[var(--field-border-disabled)] disabled:bg-[var(--field-bg-disabled)]`;
  const panelClasses = dark
    ? 'border-on-dark-line-2 bg-[var(--charcoal-panel)] divide-y divide-on-dark-line-1'
    : tintedPanel
      ? 'border-[var(--field-card-border)] bg-surface divide-y divide-[var(--field-divider)]'
      : 'border-border-soft bg-bg divide-y divide-[var(--field-divider)]';
  const optionClasses = dark ? 'text-on-dark' : 'text-fg-2';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label id={labelId} htmlFor={selectId} className={`text-[length:var(--fs-label)] ${dark ? 'text-on-dark-2' : disabled ? 'text-[var(--field-label-disabled)]' : 'text-fg'}`}>
          {label}
          {/* Same treatment as Input's required marker - aria-hidden, with the
              state carried by aria-required on the combobox below. */}
          {required && (
            <span className="text-[var(--field-border-error)]" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <input
          type="text"
          id={selectId}
          disabled={disabled}
          role="combobox"
          ref={triggerRef}
          autoComplete="off"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && shown.length > 0 ? optionId(highlighted) : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          // Closed: the chosen label. Open and typing: what was typed.
          value={open && typing ? query : (selected?.label ?? '')}
          onFocus={(e) => {
            if (disabled || open || skipFocusOpen.current) return;
            openList();
            e.currentTarget.select();
          }}
          onClick={() => !disabled && !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value);
            setTyping(true);
            setHighlighted(0);
            setOpen(true);
          }}
          onKeyDown={onFieldKeyDown}
          className={`w-full truncate rounded-[var(--field-radius)] ${openUp ? 'focus-visible:rounded-t-none' : 'focus-visible:rounded-b-none'} ${open ? (openUp ? 'rounded-t-none' : 'rounded-b-none') : ''} border pl-3 pr-9 py-2 text-[length:var(--fs-body)] text-left
            ${dark ? 'placeholder:text-on-dark-4' : 'placeholder:text-muted'}
            disabled:cursor-not-allowed disabled:placeholder:text-[var(--field-label-disabled)] disabled:text-[var(--field-label-disabled)]
            focus:outline-none
            ${triggerClasses}
            ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={open ? 'Close list' : 'Open list'}
          onClick={() => {
            if (open) return close(false);
            openList();
            triggerRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
        >
          <Icon
            path={CHEVRON_DOWN}
            className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${
              dark ? 'text-on-dark-3' : disabled ? 'text-muted' : selected ? 'text-[var(--field-icon-active)]' : 'text-muted'
            }`}
          />
        </button>

        {/* Square on the edge that meets the field, rounded on the far edge, so the panel reads as attached to it (the open or focused field squares off its matching edge, and the shared border is drawn once). */}
        {open && (
          <div className={`absolute z-[var(--z-popover)] ${openUp ? 'bottom-full rounded-t-[var(--field-radius)] rounded-b-none border-b-0' : 'top-full rounded-b-[var(--field-radius)] rounded-t-none border-t-0'} left-0 right-0 border shadow-raised overflow-hidden ${panelClasses}`} onMouseDown={(e) => e.preventDefault()}>
          <ul
            id={listboxId}
            role="listbox"
            {...(label ? { 'aria-labelledby': labelId } : { 'aria-label': ariaLabel ?? 'Options' })}
            className="max-h-64 overflow-y-auto py-1"
          >
            {shown.map((opt, i) => (
              <li
                key={opt.value}
                id={optionId(i)}
                role="option"
                aria-selected={opt.value === value}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => commit(opt.value)}
                className={`px-4 py-3 text-[length:var(--fs-body)] cursor-pointer ${optionClasses} ${
                  i === highlighted ? `${dark ? 'bg-on-dark-fill-2' : 'bg-[var(--field-focus-bg)]'}` : ''
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
          {shown.length === 0 && (
            <p role="status" className="px-4 py-3 text-muted text-[length:var(--fs-body)]">
              No Matches
            </p>
          )}
          </div>
        )}
      </div>
      {helperText && !error && (
        <span id={helperId} className="text-[length:var(--fs-caption)] text-muted">
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

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';
import { SearchField } from '../primitives/SearchField';
import { useSearchListNav } from '../../hooks/useSearchListNav';
import type { ServiceLocationOption } from '../../engines/serviceLocationLookup';
import { CHEVRON_DOWN, PIN_ICON } from '../../assets/icons';


interface ServiceLocationSearchInputProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  /** The IDs on offer (see listServiceLocationOptions). */
  options: ServiceLocationOption[];
  /** The text changed by typing: committed as typed, like the plain field it replaces. */
  onTextChange: (text: string) => void;
  /** A row was chosen: the caller looks the ID up and fills the address. */
  onSelect: (option: ServiceLocationOption) => void;
}

// Sentence case on purpose: the wording the business asked for, shown as a message rather than a title or label.
const NOT_FOUND = 'No location found';
const norm = (s: string) => s.trim().toUpperCase();

/**
 * A searchable dropdown for a Kahramaa Meter ID or a Vodafone Premise ID, in the same shape as CompanySearchInput: search icon, a
 * chevron, and a list that narrows as the agent types (nothing typed offers every ID). Choosing a row fills the address; text that
 * matches no ID is reported as "No location found" rather than silently kept.
 */
export function ServiceLocationSearchInput({ label, id, placeholder, value, options, onTextChange, onSelect }: ServiceLocationSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The other ID (or a lookup) can change this one from outside.
  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const q = norm(query);
  const results = q ? options.filter((o) => norm(o.value).includes(q) || o.detail.toUpperCase().includes(q)).slice(0, 20) : options;
  // Typed text that is not an ID the lookup knows: reported once the list is closed, and as the list's own empty row while it is open.
  const notFound = q !== '' && !options.some((o) => norm(o.value) === q);

  const pick = (o: ServiceLocationOption) => {
    setQuery(o.value);
    setOpen(false);
    onSelect(o);
  };

  const optionPrefix = `${id}-opt`;
  const nav = useSearchListNav({
    idPrefix: optionPrefix,
    count: results.length,
    enabled: open,
    resetKey: `${q}|${results.length}`,
    inputRef,
    onSelect: (i) => results[i] && pick(results[i]),
    onEscape: () => setOpen(false),
  });
  const activeRow = 'bg-[var(--field-focus-bg)]';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[length:var(--fs-label)] text-fg">
        {label}
      </label>
      <SearchField
        hideIcon
        wrapperRef={containerRef}
        ref={inputRef}
        {...nav.inputProps}
        id={id}
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onTextChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? `Close ${label} list` : `Open ${label} list`}
          onClick={() => setOpen((o) => !o)}
          className="field-clear-btn"
        >
          <Icon path={CHEVRON_DOWN} className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className="dropdown-popover"
          >
            {results.map((o, i) => (
              <li
                key={o.value}
                id={`${optionPrefix}-${i}`}
                role="option"
                aria-selected={norm(o.value) === q}
                onClick={() => pick(o)}
                className={`row-start pad-row cursor-pointer hover:bg-[var(--field-focus-bg)] ${nav.active === i ? activeRow : ''}`}
              >
                <span className="mt-0.5 text-[var(--field-icon)] shrink-0">
                  <Icon path={PIN_ICON} className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block heading-strong truncate">{o.value}</span>
                  {o.detail && <span className="line-caption">{o.detail}</span>}
                </span>
              </li>
            ))}
            {results.length === 0 && <li className="pad-row text-[length:var(--fs-caption)] text-danger">{NOT_FOUND}</li>}
          </ul>
        )}
      </SearchField>
      {!open && notFound && (
        <p role="status" className="text-[length:var(--fs-caption)] text-danger">
          {NOT_FOUND}
        </p>
      )}
    </div>
  );
}

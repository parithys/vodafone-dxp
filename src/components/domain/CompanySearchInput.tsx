import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { SearchField } from '../primitives/SearchField';
import { useSearchListNav } from '../../hooks/useSearchListNav';

interface EnterpriseAccount {
  enterpriseAccountId: string;
  name: string;
  crNumber?: string;
  businessType: string;
  level: string;
}

/** What the field commits upward. All three move together. */
export interface CompanySelection {
  companyName?: string;
  /** Set only when the company came from the registry. */
  companyAccountId?: string;
  /** Set only when the agent chose "Add new company". */
  companyIsNew?: boolean;
}

interface CompanySearchInputProps {
  label?: string;
  value: CompanySelection;
  onChange: (next: CompanySelection) => void;
  id?: string;
  /** Offer "Add new company" for text no registry row matches. Default true. */
  allowAddNew?: boolean;
  /** Marks the field mandatory: a red asterisk after the label and aria-required on the input. */
  required?: boolean;
  /** Shown in the same row as the "Linked to …" line once a company is picked. */
  statusNote?: ReactNode;
}

const BUILDING_ICON = 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16 M15 21V9h4a1 1 0 0 1 1 1v11 M8 8h3 M8 12h3 M8 16h3';
const PLUS_ICON = 'M12 5v14 M5 12h14';
const CHEVRON_ICON = 'M6 9l6 6 6-6';

// Company search and selection for a B2B2C order, replacing the free-text
// "Company Name (B2B2C)" box. Mirrors LocationInput's interaction (search
// icon, typeahead listbox, click-outside close, filled-border logic) rather
// than inventing a second combobox shape, and resolves against the app's real
// seeded `enterprise-accounts` dataset.
//
// A TYPED STRING IS NOT A COMPANY. The old field committed every keystroke to
// `companyName`, so a half-typed word was indistinguishable from a real
// employer. Here `query` is local UI state and nothing is committed until the
// agent either picks a registry row or explicitly chooses "Add new company" -
// and the commit records WHICH of those happened, so downstream can tell a
// linked account from one that still has to be created.
//
// Editing the text after a commit clears it. Without that, an agent could
// select "Lulu Hypermarket - Al Waab Branch", edit the name to something else
// and leave `companyAccountId` pointing at Al Waab - the same stale-link class
// of bug that switching ID Type without clearing the number produced in
// IdLookupStep.
export function CompanySearchInput({ label, value, onChange, id, allowAddNew = true, statusNote, required }: CompanySearchInputProps) {
  const inputId = id ?? 'company-search';
  const [accounts, setAccounts] = useState<EnterpriseAccount[]>([]);
  const [query, setQuery] = useState(value.companyName ?? '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mockDataEngine.list<EnterpriseAccount>('enterprise-accounts').then(setAccounts);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const q = query.trim().toLowerCase();
  // Name AND CR number, because a B2B2C employer is as often identified by its
  // commercial registration as by a name the agent would have to spell.
  // A dropdown with search (2026-10-27): with nothing typed, the whole registry is on offer; typing narrows it.
  const results = q
    ? accounts.filter((a) => a.name.toLowerCase().includes(q) || (a.crNumber ?? '').toLowerCase().includes(q)).slice(0, 20)
    : accounts;

  // An exact name match means "Add new company" would create a duplicate of a
  // row already on offer, so it is withheld in that one case.
  const exactMatch = results.some((a) => a.name.toLowerCase() === q);
  const committed = Boolean(value.companyName);

  const pickExisting = (a: EnterpriseAccount) => {
    setQuery(a.name);
    setOpen(false);
    onChange({ companyName: a.name, companyAccountId: a.enterpriseAccountId, companyIsNew: false });
  };

  const addNew = () => {
    setOpen(false);
    onChange({ companyName: query.trim(), companyAccountId: undefined, companyIsNew: true });
  };

  // Keyboard: Arrow keys walk the registry rows and then "Add new company"; Enter picks the highlighted row; Escape closes
  // the list but keeps the text. Same hook (and same markup contract) as PlanSearchBox and GlobalSearch.
  const showAddNew = allowAddNew && Boolean(q) && !exactMatch;
  const inputRef = useRef<HTMLInputElement>(null);
  const optionPrefix = `${inputId}-opt`;
  const nav = useSearchListNav({
    idPrefix: optionPrefix,
    count: results.length + (showAddNew ? 1 : 0),
    enabled: open,
    resetKey: `${q}|${results.length}`,
    inputRef,
    onSelect: (i) => (i < results.length ? pickExisting(results[i]) : addNew()),
    onEscape: () => setOpen(false),
  });
  const activeRow = 'bg-[var(--field-focus-bg)]';

  const selectedAccount = value.companyAccountId
    ? accounts.find((a) => a.enterpriseAccountId === value.companyAccountId)
    : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[length:var(--fs-label)] text-fg">
          {label}
          {required && (
            <span className="text-[var(--field-border-error)]" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      <SearchField
        hideIcon
        wrapperRef={containerRef}
        ref={inputRef}
        {...nav.inputProps}
        id={inputId}
        value={query}
        role="combobox"
        aria-required={required || undefined}
        aria-expanded={open}
        aria-controls={open ? `${inputId}-listbox` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Search by company name"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          // Any edit invalidates a previous selection - see the note above.
          if (committed) onChange({ companyName: undefined, companyAccountId: undefined, companyIsNew: undefined });
        }}
        onFocus={() => setOpen(true)}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? 'Close company list' : 'Open company list'}
          onClick={() => setOpen((o) => !o)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
        >
          <Icon path={CHEVRON_ICON} className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <ul
            id={`${inputId}-listbox`}
            role="listbox"
            className="absolute z-[var(--z-popover)] top-full left-0 right-0 max-h-80 overflow-y-auto rounded-[var(--field-radius)] border border-border-soft bg-bg shadow-raised py-1 divide-y divide-[var(--field-divider)]"
          >
            {results.map((a, i) => (
              <li
                key={a.enterpriseAccountId}
                id={`${optionPrefix}-${i}`}
                role="option"
                aria-selected={a.enterpriseAccountId === value.companyAccountId}
                onClick={() => pickExisting(a)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--field-focus-bg)] ${nav.active === i ? activeRow : ''}`}
              >
                <span className="mt-0.5 text-[var(--field-icon)] shrink-0">
                  <Icon path={BUILDING_ICON} className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[length:var(--fs-body)] font-semibold text-fg truncate">{a.name}</span>
                  <span className="block text-[length:var(--fs-caption)] text-muted truncate">
                    {[a.crNumber, a.businessType, a.level === 'parent' ? 'Parent account' : 'Sub-account'].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </li>
            ))}

            {/* "Add new company", per the 2026-09-25 direction. Offered
                whenever the agent has typed something no registry row matches
                exactly - not only when there are zero results, because a
                partial match ("Lulu") can list four neighbours while the
                employer in hand is still absent. Withheld on an exact name
                match, where it could only create a duplicate.

                It also replaces LocationInput's dead "No matching addresses."
                row: a B2B2C employer that is not yet on file is an ordinary
                case, not an error, and the seed shows it - the one seeded
                B2B2C contact's employer is deliberately absent from
                enterprise-accounts. */}
            {!allowAddNew && results.length === 0 && (
              <li className="px-4 py-3 text-[length:var(--fs-caption)] text-muted">No matching company.</li>
            )}
            {showAddNew && (
              <li
                id={`${optionPrefix}-${results.length}`}
                role="option"
                aria-selected={false}
                onClick={addNew}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--field-focus-bg)] ${nav.active === results.length ? activeRow : ''}`}
              >
                <span className="mt-0.5 text-accent shrink-0">
                  <Icon path={PLUS_ICON} className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[length:var(--fs-body)] font-semibold text-accent">Add New Company</span>
                  <span className="block text-[length:var(--fs-caption)] text-muted truncate">
                    {results.length === 0
                      ? `No registered company matches "${query.trim()}".`
                      : `Register "${query.trim()}" as a new company.`}
                  </span>
                </span>
              </li>
            )}
          </ul>
        )}
      </SearchField>

      {/* What was actually committed. Without this the two outcomes look
          identical in the input - the same name sits there whether it links to
          an existing account or is waiting to be created. */}
      {committed && value.companyIsNew && (
        <span className="text-[length:var(--fs-caption)] text-muted">
          New company - will be registered when the order is submitted.
        </span>
      )}
      {committed && selectedAccount && statusNote && <div className="flex flex-wrap items-center gap-x-3">{statusNote}</div>}
    </div>
  );
}

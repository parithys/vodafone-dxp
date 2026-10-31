import { useRef } from 'react';
import type { RefObject } from 'react';
import { useSearchListNav } from '../../hooks/useSearchListNav';
import type { PostpaidPlan } from './postpaidPlanModel';
import { SearchField } from '../primitives/SearchField';
import { formatQarAny } from '../../lib/format';

interface PlanSearchBoxProps {
  searchRef: RefObject<HTMLDivElement | null>;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  planSearch: string;
  setPlanSearch: (value: string) => void;
  suggestions: PostpaidPlan[];
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
  /** The tab the search is scoped to; shown in the placeholder. */
  scopeLabel?: string;
  /** Picking a result: the step selects it and scrolls to its card. Defaults to plain selection. */
  onPickResult?: (plan: PostpaidPlan) => void;
}

export function PlanSearchBox({
  searchRef,
  searchOpen,
  setSearchOpen,
  planSearch,
  setPlanSearch,
  suggestions,
  selectedProductId,
  onSelectProduct,
  scopeLabel,
  onPickResult,
}: PlanSearchBoxProps) {
  const pick = (p: PostpaidPlan) => {
    if (onPickResult) onPickResult(p);
    else {
      onSelectProduct(p.productId);
      setPlanSearch(p.name);
      setSearchOpen(false);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useSearchListNav({
    idPrefix: 'plan-search-opt',
    count: suggestions.length,
    enabled: searchOpen && Boolean(planSearch.trim()),
    resetKey: `${planSearch}|${suggestions.length}`,
    inputRef,
    onSelect: (i) => pick(suggestions[i]),
    onEscape: () => {
      setPlanSearch('');
      setSearchOpen(false);
    },
  });
  return (
    <div ref={searchRef} className="relative">
      <SearchField
        ref={inputRef}
        {...nav.inputProps}
        aria-label={`Search ${scopeLabel ?? 'plans'} by name or price`}
        role="combobox"
        aria-expanded={Boolean(searchOpen && planSearch.trim())}
        aria-controls={searchOpen && planSearch.trim() ? 'plan-search-listbox' : undefined}
        autoComplete="off"
        placeholder={`Search ${scopeLabel ?? 'plans'} by name or price`}
        value={planSearch}
        onChange={(e) => {
          setPlanSearch(e.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => setSearchOpen(true)}
      />
      {searchOpen && planSearch.trim() && (
        <ul
          id="plan-search-listbox"
          role="listbox"
          aria-label="Plan suggestions"
          className="absolute z-[var(--z-popover)] top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-[var(--field-radius)] border border-border-soft bg-bg shadow-raised py-1 divide-y divide-[var(--field-divider)]"
        >
          {suggestions.map((p, i) => (
            <li
              key={p.productId}
              id={`plan-search-opt-${i}`}
              role="option"
              aria-selected={selectedProductId === p.productId}
              onClick={() => pick(p)}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface ${nav.active === i ? 'bg-surface ring-2 ring-inset ring-[var(--field-focus-border)]' : ''}`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-fg text-[length:var(--fs-body)] truncate">{p.name}</span>
              </span>
              <span className="text-muted text-[length:var(--fs-caption)] shrink-0">{formatQarAny(p.mrcQAR)}/mo</span>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className="px-4 py-2.5 text-muted text-[length:var(--fs-caption)]">No matching plans.</li>
          )}
        </ul>
      )}
    </div>
  );
}

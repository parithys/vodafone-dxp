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
          className="dropdown-popover mt-1 max-h-72"
        >
          {suggestions.map((p, i) => (
            <li
              key={p.productId}
              id={`plan-search-opt-${i}`}
              role="option"
              aria-selected={selectedProductId === p.productId}
              onClick={() => pick(p)}
              className={`split-nowrap pick-row ${nav.active === i ? 'pick-row-active' : ''}`}
            >
              <span className="row gap-2 min-w-0">
                <span className="body-text truncate">{p.name}</span>
              </span>
              <span className="caption-muted shrink-0">{formatQarAny(p.mrcQAR)}/mo</span>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className="px-4 py-2.5 caption-muted">No matching plans.</li>
          )}
        </ul>
      )}
    </div>
  );
}

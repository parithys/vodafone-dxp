import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomerSearchResults, useCustomerSearch, MIN_QUERY_LENGTH } from './CustomerSearchResults';
import { SearchField } from '../../components/primitives/SearchField';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';
import { PageHeader } from '../../components/patterns/PageHeader';



// The new primary entry point (replaces browsing a module to find a
// customer-adjacent screen): one box, matched-field badges so an agent can
// see *why* a result surfaced. 2026-10-01: searches on Enter, and only once
// at least MIN_QUERY_LENGTH characters have been typed - it used to search
// as you typed (debounced), which fired on one- and two-character fragments.

export function CustomerSearchPage() {
  // The Dashboard search hands its text over here, so it opens already searched.
  const locationState = useLocation().state as { query?: string; newTicket?: boolean } | null;
  const handedOver = locationState?.query ?? '';
  // Arrived from a "New Ticket" button: the customer opened next starts on the "How can we help today?" search.
  const newTicket = Boolean(locationState?.newTicket);
  const [query, setQuery] = useState(handedOver);
  // The query the results on screen belong to - set only by pressing Enter.
  const [submitted, setSubmitted] = useState(handedOver.length >= MIN_QUERY_LENGTH ? handedOver : '');
  const { results, businesses, searching } = useCustomerSearch(submitted);

  const trimmed = query.trim();
  const canSearch = trimmed.length >= MIN_QUERY_LENGTH;
  // Results are stale the moment the text no longer matches what was searched.
  const showingResults = submitted !== '' && trimmed === submitted;

  const runSearch = () => {
    // Nothing runs for empty / too-short text, or while a search is already in flight (repeat clicks and
    // Enter presses are ignored until it finishes).
    if (!canSearch || searching) return;
    setSubmitted(trimmed);
  };

  return (
    <div className="p-8 w-full">
      <PageHeader title={<>Customer Search</>} description={<>Look up a customer by mobile number, QID, customer number, account number, name, email, or service ID.</>} />

      {/* Field and Search button on one row (the field shrinks, the button keeps its width); Enter in the
          field and the button run the same search. The text stays in the field after a search. */}
      <form
        role="search"
        aria-label="Customer search"
        className="flex items-stretch gap-3 mb-2"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
      >
        <div className="relative flex-1 min-w-0 rounded-[var(--radius-card-lg)] bg-bg p-2 shadow-[var(--shadow-dash-card-hover)]">
        <SearchField
          aria-label="Customer search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runSearch();
            }
          }}
          placeholder="Search a customer by mobile, QID, account number…"
          onClear={() => {
            setQuery('');
            setSubmitted('');
          }}
          className="!border-transparent !bg-transparent !py-4 !text-[length:var(--fs-body-lg)] focus-visible:!border-[var(--field-focus-border)] focus-visible:!bg-[var(--field-focus-bg)]"
        />
        </div>
        <Button type="submit" variant="primary" disabled={!canSearch || searching} aria-busy={searching} aria-label={searching ? 'Searching' : 'Search'} className="shrink-0 self-stretch !px-6 !rounded-[var(--radius-card-lg)]">
          {searching ? (
            <span aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin rounded-[var(--radius-pill)] border-2 border-current border-t-transparent" />
          ) : (
            <Icon path="M21 21l-4.3-4.3 M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" className="w-7 h-7" />
          )}
        </Button>
      </form>

      {!showingResults && (
        <p className="text-muted text-[length:var(--fs-caption)] mt-3">
          {canSearch
            ? 'Press Enter or Search to search.'
            : `Enter at least ${MIN_QUERY_LENGTH} characters, then press Enter or Search to see results.`}
        </p>
      )}

      {showingResults && (
        <div className="mt-4">
          <CustomerSearchResults submitted={submitted} results={results} businesses={businesses} searching={searching} newTicket={newTicket} />
        </div>
      )}
    </div>
  );
}

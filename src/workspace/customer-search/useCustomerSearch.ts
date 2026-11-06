import { useEffect, useState } from 'react';
import { searchCustomers, type CustomerSearchResult } from '../../engines/customer360Engine';
import { searchBusinessAccounts, type BusinessAccount } from '../../engines/businessAccountEngine';

/** Runs the customer + business-account search for a submitted query. An empty query clears the results. */
export function useCustomerSearch(submitted: string) {
  const [settled, setSettled] = useState<{ query: string; results: CustomerSearchResult[]; businesses: BusinessAccount[] }>({ query: '', results: [], businesses: [] });
  // An empty query clears the results: adjusted during render (not in an effect) so no stale row paints.
  if (!submitted && (settled.query || settled.results.length || settled.businesses.length)) {
    setSettled({ query: '', results: [], businesses: [] });
  }
  const { results, businesses } = settled;
  // Searching from the moment a new query is submitted until its results (or its failure) have settled.
  const searching = !!submitted && settled.query !== submitted;

  useEffect(() => {
    if (!submitted) return;
    let cancelled = false;
    Promise.all([searchCustomers(submitted), searchBusinessAccounts(submitted)])
      .then(([matches, accounts]) => {
        if (cancelled) return;
        setSettled({ query: submitted, results: matches, businesses: accounts });
      })
      .catch(() => {
        // A failed search ends the spinner and reads as "no results" rather than hanging.
        if (cancelled) return;
        setSettled({ query: submitted, results: [], businesses: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [submitted]);

  return { results, businesses, searching };
}

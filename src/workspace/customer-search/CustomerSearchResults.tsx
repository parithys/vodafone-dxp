import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCustomers, toActiveCustomerSummary, type CustomerSearchResult } from '../../engines/customer360Engine';
import { searchBusinessAccounts, type BusinessAccount } from '../../engines/businessAccountEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { Badge } from '../../components/primitives/Badge';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { usePersonaStore } from '../../stores/personaStore';

/** Shortest text a customer search will run on. Shared by the Customer Search page and the Dashboard search. */
export const MIN_QUERY_LENGTH = 3;

const MATCH_LABEL: Record<string, string> = {
  mobile: 'Mobile',
  qid: 'QID',
  customerNumber: 'Customer #',
  accountNumber: 'Account #',
  name: 'Name',
  email: 'Email',
  serviceId: 'Service ID',
  idDocument: 'ID number',
};

/**
 * Marks the part of `text` that the agent typed, so the reason a result matched
 * is visible. A name is matched word by word (the search itself requires every
 * typed word to appear in the name, in any order); identifiers are matched as
 * the whole typed string, which is how the search matches them.
 */
function Highlight({ text, query, words }: { text: string | undefined; query: string; words?: boolean }) {
  const value = text ?? '';
  const needles = (words ? query.trim().split(/\s+/) : [query.trim()]).filter(Boolean);
  if (!value || needles.length === 0) return <>{value}</>;
  const pattern = new RegExp(`(${needles.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return (
    <>
      {value.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-[var(--radius-sm)] bg-[var(--highlight-bg)] text-inherit px-0.5 -mx-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/** Runs the customer + business-account search for a submitted query. An empty query clears the results. */
export function useCustomerSearch(submitted: string) {
  const [results, setResults] = useState<CustomerSearchResult[]>([]);
  const [businesses, setBusinesses] = useState<BusinessAccount[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!submitted) {
      setResults([]);
      setBusinesses([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    Promise.all([searchCustomers(submitted), searchBusinessAccounts(submitted)])
      .then(([matches, accounts]) => {
        if (cancelled) return;
        setResults(matches);
        setBusinesses(accounts);
        setSearching(false);
      })
      .catch(() => {
        // A failed search ends the spinner and reads as "no results" rather than hanging.
        if (cancelled) return;
        setResults([]);
        setBusinesses([]);
        setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [submitted]);

  return { results, businesses, searching };
}

/**
 * The result list for a customer search - one implementation for the Customer Search page and the Dashboard.
 *
 * Product decision (2026-09-15, overrides the BRSD's own CUS-001-CAM-04-A/BR-01 framing, which reads as gating
 * Customer 360 *entry* itself): a plain lookup is read-only and shouldn't require an ID scan up front. BR-01
 * verification still gates every actual mutation - Customer360Layout (Edit profile), ContactSection,
 * AddressSection, and BillingAccountPage each carry their own independent useVerificationGate() at the point an
 * agent tries to change something, so opening a result needs no gate.
 */
export function CustomerSearchResults({
  submitted,
  results,
  businesses,
  searching,
  newTicket = false,
}: {
  submitted: string;
  results: CustomerSearchResult[];
  businesses: BusinessAccount[];
  searching: boolean;
  /** Opened from a "New Ticket" button: the customer opened next starts on the "How can we help today?" search. */
  newTicket?: boolean;
}) {
  const navigate = useNavigate();
  const setActiveCustomer = useCustomerContext((s) => s.setActiveCustomer);
  const personaId = usePersonaStore((s) => s.activePersonaId);

  const openCustomer = (result: CustomerSearchResult) => {
    setActiveCustomer(toActiveCustomerSummary(result.customer));
    // Origin recorded so the rail keeps Customer Search lit on the record
    // screen, which has no nav destination of its own.
    navigate(`/customer/${result.customer.customerId}`, { state: { navKey: 'customer-search', ...(newTicket ? { newTicket: true } : {}) } });
  };

  return (
      <div className="space-y-2">
        {searching && <p className="text-muted text-[length:var(--fs-body)]">Searching…</p>}
        {!searching && results.length === 0 && businesses.length === 0 && (
          <div role="status" className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border bg-[var(--surface-subtle)] px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3 M8.5 8.5l5 5 M13.5 8.5l-5 5" />
              </svg>
            </span>
            <p className="text-fg font-bold text-[length:var(--fs-body-lg)]">Customer Data Not Found</p>
            <p className="max-w-md text-fg-2 text-[length:var(--fs-body)]">
              No customer record matches <span className="font-bold text-fg">“{submitted}”</span>. Check the ID/number, or try searching by name or email instead.
            </p>
          </div>
        )}
        {!searching &&
          businesses.map(({ account, users }) => (
            <button type="button"
              key={account.enterpriseAccountId}
              onClick={() => navigate(`/customer/${account.enterpriseAccountId}`, { state: { navKey: 'customer-search' } })}
              className="w-full text-left card p-4 hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-fg text-[length:var(--fs-body-lg)] truncate">
                    <Highlight text={account.name} query={submitted} words />
                  </span>
                  <Badge variant="outlined-red">Business</Badge>
                </div>
                <div className="text-fg-2 text-[length:var(--fs-caption)]">
                  <Highlight text={account.enterpriseAccountId} query={submitted} /> · {users.length} linked user{users.length === 1 ? '' : 's'}
                </div>
              </div>
            </button>
          ))}
        {!searching &&
          results.map(({ customer, matchedOn, matchedDocumentNumber }) =>
            // A customer in a protected segment the signed-in role may not see: nothing about them is drawn - no name, ID, number or segment - and
            // the row cannot be opened. Decided here, on the same render that would have drawn the row, so it is never shown first.
            !canViewCustomerSegment(personaId, customer.segment) ? (
              <RestrictedCustomerNotice key={customer.customerId} compact />
            ) : (
            <button type="button"
              key={customer.customerId}
              onClick={() => openCustomer({ customer, matchedOn })}
              className="w-full text-left card p-4 hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] transition-all flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-fg text-[length:var(--fs-body-lg)] truncate"><Highlight text={customer.name} query={submitted} words />
                  </span>
                  {customer.blacklisted && <Badge variant="danger">Blacklisted</Badge>}
                </div>
                <div className="text-fg-2 text-[length:var(--fs-caption)]">
                  <Highlight text={customer.customerId} query={submitted} /> · {customer.idType} <Highlight text={customer.qid} query={submitted} /> · {customer.segment}
                  {customer.phone ? <> · <Highlight text={customer.phone} query={submitted} /></> : null}
                  {matchedDocumentNumber ? <> · ID document <Highlight text={matchedDocumentNumber} query={submitted} /></> : null}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {matchedOn.map((field) => (
                  <Badge key={field} variant="outlined-red">
                    {MATCH_LABEL[field] ?? field}
                  </Badge>
                ))}
              </div>
            </button>
            )
          )}
      </div>
  );
}

import { currentAgentId } from '../../../stores/authStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Icon } from '../../../components/primitives/Icon';
import { Select } from '../../../components/primitives/Select';
import { buildNewTicketRecord, derivePriorityFromSegment, slaTargetHours } from '../../../data/reference/ticketReferenceData';
import { useEntityStore } from '../../../stores/entityStore';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { IC, IconTile, Pill, SearchBox } from '../sections/C360Kit';
import { QueryPreviewModal } from './QueryPreviewModal';
import { TAB_LABELS, revealContainer, searchContainers } from './containerIndex';
import { QUERY_SERVICE_TYPES, deriveQueryServiceType, matchRanges, queryKeywords, routeTicket, searchQueryIssues, serviceTypeLabel, useQueryIssueCatalogue } from './queryFlowModel';
import type { QueryIssue } from './queryFlowModel';

const BACK_ICON = 'M19 12H5 M12 19l-7-7 7-7';
const CHEVRON_RIGHT = 'M9 18l6-6-6-6';

// Service type is always blue, so a category never uses blue: Network Related red, every other category purple.
const categoryTone = (c: string | undefined) => (/network/i.test(c ?? '') ? 'red' : c ? 'purple' : 'grey');
const PENDING = 'Category pending';

/** The issue name with every matched keyword wrapped in <mark> (the app's search-match highlight). */
function Highlighted({ text, keywords }: { text: string; keywords: string[] }) {
  const ranges = matchRanges(text, keywords) ?? [];
  const parts: React.ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([a, b], i) => {
    if (a > pos) parts.push(text.slice(pos, a));
    parts.push(
      <mark key={i} className="rounded-[var(--radius-sm)] bg-[var(--highlight-bg)] text-inherit font-semibold">
        {text.slice(a, b)}
      </mark>
    );
    pos = b;
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return <>{parts}</>;
}

function Banner({ tone, children }: { tone: 'info' | 'success' | 'warn'; children: React.ReactNode }) {
  const bg = tone === 'info' ? 'bg-tone-blue-soft text-[var(--signal-blue)]' : tone === 'success' ? 'bg-tone-success text-success' : 'bg-[var(--warn-bg)] text-[var(--warn-text)]';
  return <p className={`rounded-[var(--radius-card)] px-4 py-3 text-[length:var(--fs-body)] ${bg}`}>{children}</p>;
}

/**
 * Customer 360's "How can we help today?" journey: find the customer's issue, confirm its category and service type,
 * preview the account facts that matter, then close the interaction or raise a trouble ticket - all without leaving
 * the customer.
 */
export function QueryFlowCard({
  data,
  services,
  onTicketCreated,
  focusSignal = 0,
  goToTab,
  hasTab,
}: {
  data: Customer360Data;
  services: CustomerService[];
  onTicketCreated?: (ticket: Record<string, unknown>) => void;
  /** Bumped by "New Ticket" elsewhere: returns to the search step, focuses the box and brings the card into view. */
  focusSignal?: number;
  goToTab?: (key: string) => void;
  /** Whether this role has the Customer 360 tab; sections of tabs it lacks are not offered. */
  hasTab?: (key: string) => boolean;
}) {
  const catalogue = useQueryIssueCatalogue();
  const createRecord = useEntityStore((s) => s.createRecord);
  const [query, setQuery] = useState('');
  const [issue, setIssue] = useState<QueryIssue | null>(null);
  const [msisdnRef, setMsisdnRef] = useState('');
  const [manualType, setManualType] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [note, setNote] = useState<string | undefined>();

  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!focusSignal || !catalogue) return;
    setIssue(null);
    setPreviewOpen(false);
    const t = window.setTimeout(() => {
      cardRef.current?.scrollIntoView({ block: 'center' });
      cardRef.current?.querySelector('input')?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [focusSignal, catalogue]);

  const keywords = useMemo(() => queryKeywords(query), [query]);
  const sectionHits = useMemo(() => (goToTab ? searchContainers(query, hasTab ?? (() => true)) : []), [query, goToTab, hasTab]);
  const results = useMemo(() => (catalogue ? searchQueryIssues(catalogue.issues, query) : []), [catalogue, query]);
  // Results grouped by Service Type > Category, in the order each group first appears.
  const resultGroups = useMemo(() => {
    const groups = new Map<string, { key: string; serviceType?: string; category?: string; issues: QueryIssue[] }>();
    for (const r of results) {
      const serviceType = r.serviceType ? serviceTypeLabel(r.serviceType) : undefined;
      const key = `${serviceType ?? ''}|${r.category ?? ''}`;
      const g = groups.get(key) ?? { key, serviceType, category: r.category, issues: [] };
      g.issues.push(r);
      groups.set(key, g);
    }
    return [...groups.values()];
  }, [results]);
  const lines = useMemo(() => services.filter((s) => s.tab === 'mobile' || s.tab === 'fibre'), [services]);
  const service = lines.find((s) => s.ref === msisdnRef);
  const derivedType = issue ? deriveQueryServiceType(issue, service) : undefined;
  const serviceType = derivedType ?? (manualType || undefined);
  const routing = issue ? routeTicket(issue, data.customer, (data.contacts[0] as { preferredLanguage?: string } | undefined)?.preferredLanguage) : undefined;

  const reset = (message?: string) => {
    setQuery('');
    setIssue(null);
    setMsisdnRef('');
    setManualType('');
    setPreviewOpen(false);
    setNote(message);
  };

  // Raises the ticket straight from the Preview: everything it needs is already known from the query and the customer.
  const createTicket = async (queue: string, description: string) => {
    if (!issue || !serviceType) return;
    const ticketId = `TT-${Date.now().toString().slice(-6)}`;
    const record = buildNewTicketRecord({
      ticketId,
      customerId: data.customer.customerId,
      issueType: serviceType,
      area: [issue.area, issue.subArea].filter(Boolean).join(' - '),
      template: issue.name,
      templateContent: description,
      actualIssue: issue.ticketActualIssue,
      queue,
      priority: derivePriorityFromSegment(data.customer.segment),
      slaTargetHours: slaTargetHours(data.customer.nationality),
      severity: issue.severity,
      createdBy: currentAgentId(),
    });
    await createRecord('trouble-tickets', record);
    onTicketCreated?.(record);
    reset(`Ticket ${ticketId} was created for "${issue.name}".`);
  };

  if (!catalogue) return null;

  return (
    <section ref={cardRef} className="card overflow-hidden" aria-label="How can we help today?">
      {!issue ? (
        <>
          <div className="bg-[image:var(--dash-hero-gradient)] p-5 space-y-4">
          <div>
            <h2 className="text-on-dark font-bold text-[length:var(--fs-h4)]">How can we help today?</h2>
            <p className="text-on-dark-2 text-[length:var(--fs-body)] mt-1">Search for customer issues, queries or requests.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={query} onChange={(v) => { setQuery(v); setNote(undefined); }} placeholder="Search for customer issues, queries or requests" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[length:var(--fs-caption)]">
            <span className="text-on-dark-2">Examples:</span>
            {catalogue.examples.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => { setQuery(e); setNote(undefined); }}
                className="rounded-[var(--radius-pill)] border border-transparent bg-on-dark-fill-2 px-3 py-1 text-on-dark hover:bg-on-dark-fill-3 focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                {e}
              </button>
            ))}
          </div>
          </div>
          {(note || query.trim()) && (
          <div className="p-5 space-y-4">
          {note && <Banner tone="success">{note}</Banner>}
          {query.trim() && (
            <div aria-live="polite" className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 items-start">
              <div>
              <p className="text-fg font-bold text-[length:var(--fs-h5)] mb-3 flex items-center gap-2">Query Issues<span className="rounded-[var(--radius-pill)] bg-surface text-fg-2 px-2.5 py-0.5 text-[length:var(--fs-caption)] font-medium">{results.length}</span></p>
              {results.length === 0 ? (
                <p className="text-muted text-[length:var(--fs-body)]">No Query Issues match "{query.trim()}". Try fewer or different keywords.</p>
              ) : (
                <div className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] divide-y divide-border-soft overflow-hidden">
                  {resultGroups.map((g) => (
                    <div key={g.key}>
                      {/* One header per Service Type > Category, then its issues. */}
                      <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-surface">
                        {g.serviceType && (
                          <>
                            <Pill tone="blue">{g.serviceType}</Pill>
                            <Icon path={CHEVRON_RIGHT} className="w-3.5 h-3.5 text-fg-2 shrink-0" />
                          </>
                        )}
                        <Pill tone={categoryTone(g.category)}>{g.category ?? PENDING}</Pill>
                        <span className="text-fg-2 text-[length:var(--fs-caption)]">{g.issues.length}</span>
                      </div>
                      <ul className="divide-y divide-border-soft">
                        {g.issues.map((r) => (
                          <li key={r.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setIssue(r);
                                // The issue's own service type pre-selects the Query Service Type (a selected MSISDN still overrides it).
                                const own = (QUERY_SERVICE_TYPES as readonly string[]).includes(r.serviceType ?? '') && r.serviceType !== 'Any';
                                setManualType(own ? (r.serviceType as string) : '');
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
                            >
                              <span className="flex-1 min-w-0 text-fg text-[length:var(--fs-body)]"><Highlighted text={r.name} keywords={keywords} /></span>
                              <Icon path={CHEVRON_RIGHT} className="w-4 h-4 text-fg shrink-0" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              </div>
              {goToTab && (
                <div>
                  <p className="text-fg font-bold text-[length:var(--fs-h5)] mb-3 flex items-center gap-2">Sections<span className="rounded-[var(--radius-pill)] bg-surface text-fg-2 px-2.5 py-0.5 text-[length:var(--fs-caption)] font-medium">{sectionHits.length}</span></p>
                  {sectionHits.length === 0 ? (
                    <p className="text-muted text-[length:var(--fs-body)]">No sections match "{query.trim()}". Search by section title, e.g., Account Details.</p>
                  ) : (
                    <ul className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] divide-y divide-border-soft overflow-hidden">
                      {sectionHits.map((h) => (
                        <li key={h.tab + h.id}>
                          <button
                            type="button"
                            onClick={() => {
                              goToTab(h.tab);
                              revealContainer(h.id);
                            }}
                            className="w-full flex flex-wrap items-center gap-3 px-4 py-2.5 text-left hover:bg-surface focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
                          >
                            <span className="flex-1 min-w-48 text-fg text-[length:var(--fs-body)]"><Highlighted text={h.title} keywords={keywords} /></span>
                            <span className="text-muted text-[length:var(--fs-caption)]">{TAB_LABELS[h.tab]}</span>
                            <Icon path={CHEVRON_RIGHT} className="w-4 h-4 text-fg shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
          )}
        </>
      ) : (
        <div className="p-5 space-y-4">
          <Button variant="tertiary" compact onClick={() => reset()}>
            <Icon path={BACK_ICON} className="w-4 h-4" />
            Back to Search
          </Button>

          <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-4 items-stretch">
          <div className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-[var(--icon-tile-bg)] p-4 space-y-3">
            <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Selected Query Issue</h3>
            <div className="flex items-center gap-3">
              <IconTile icon={IC.phone} tone="red" />
              <span className="text-fg font-bold text-[length:var(--fs-h5)]">{issue.name}</span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-x-4 gap-y-2 items-center text-[length:var(--fs-body)]">
              <dt className="text-fg">Query Category</dt>
              <dd><Pill tone={categoryTone(issue.category)}>{issue.category ?? PENDING}</Pill></dd>
              <dt className="text-fg">Query Issue</dt>
              <dd className="text-fg">{issue.name}</dd>
              <dt className="text-fg">Query Service Type</dt>
              <dd>{serviceType ? <Pill tone="blue">{serviceTypeLabel(serviceType)}</Pill> : <span className="text-muted">Not Selected</span>}</dd>
            </dl>
            {!issue.category && <Banner tone="warn">No Query Category is mapped for this issue yet.</Banner>}
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-[var(--icon-tile-bg)] p-4 space-y-3">
            <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Service Line</h3>
            <Select
              label="Selected MSISDN"
              value={msisdnRef}
              onChange={(e) => setMsisdnRef(e.target.value)}
              options={[{ value: '', label: 'Not Selected' }, ...lines.map((l) => ({ value: l.ref, label: `${l.identifier} (${l.status ?? 'Active'})` }))]}
            />
            {(!service || !derivedType) && (
              <>
                {!service && <Banner tone="warn">If MSISDN is not selected, please choose the Query Service Type.</Banner>}
                <Select
                  label="Query Service Type"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  placeholder="Select Query Service Type"
                  options={QUERY_SERVICE_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </>
            )}
            <div className="flex justify-end">
              <Button variant="primary" disabled={!serviceType} onClick={() => setPreviewOpen(true)}>
                Preview Details
              </Button>
            </div>
          </div>
          </div>

          {serviceType && (
            <QueryPreviewModal
              open={previewOpen}
              issue={issue}
              serviceType={serviceType}
              service={service}
              data={data}
              services={services}
              catalogue={catalogue}
              onClose={() => setPreviewOpen(false)}
              onCloseInteraction={() => reset('Interaction closed without raising a ticket.')}
              onOpenTickets={() => {
                setPreviewOpen(false);
                goToTab?.('tickets-support');
              }}
              routing={routing}
              onCreateTicket={createTicket}
            />
          )}
        </div>
      )}
    </section>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchListNav } from '../hooks/useSearchListNav';
import { useNavigate } from 'react-router-dom';
import { getAllModules, getAllRoutes, getPersona } from '../engines/configEngine';
import { usePersonaStore } from '../stores/personaStore';
import { canViewCustomerSegment } from '../engines/agentPrivilegeEngine';
import { searchScopeFor, type SearchGroup } from '../engines/searchScopeEngine';
import * as mockDataEngine from '../engines/mockDataEngine';
import { SearchField } from '../components/primitives/SearchField';
import { screenDisplayName } from '../lib/screenName';


interface RecordResult {
  key: string;
  kind: string;
  label: string;
  sub: string;
  path: string;
}

interface LeadRecord { leadId: string; serviceNeeded: string; status: string }
interface TicketRecord { ticketId: string; category: string; status: string }
interface OrderRecord { orderId: string; orderType: string; status: string }
interface SimSwapRecord { simSwapOrderId: string; msisdn: string; status: string }
interface CustomerSearchRecord { customerId: string; name: string; segment: string; msisdn?: string }
interface CatalogSearchRecord { catalogItemId: string; name: string; productLine: string; status: string }
interface CampaignSearchRecord { campaignId: string; name: string; status: string; productLine: string }

// Topbar-wide global search across modules, screens/pages and the entity kinds
// that have a real destination to land on.
//
// SCOPE IS PER-APPROACH (searchScopeEngine): one `groups` array drives both
// which kinds are fetched and the order sections render in, so the placeholder
// can never advertise a scope the results don't actually cover.
//
// Customers are now included. They were previously excluded with the note that
// "no customer-profile screen is registered anywhere in this build" - that
// stopped being true once /customer/:customerId -> Customer360Layout was
// built, so excluding them was withholding the single most useful result type.
//
// The "no fabricated destinations" rule still holds: a catalogue hit lands on
// its product-line page, which names the requested id rather than pretending to
// render an item detail that isn't built.
export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  // Keyboard-highlighted row across Modules, Screens and Records (in display order); -1 = none.
  const [recordResults, setRecordResults] = useState<RecordResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePersonaId = usePersonaStore((st) => st.activePersonaId);
  const scope = searchScopeFor(getPersona(activePersonaId)?.approach);
  const modules = getAllModules();
  const routes = getAllRoutes();
  const q = query.trim().toLowerCase();

  const moduleMatches = useMemo(() => {
    if (!q) return [];
    return modules.filter((m) => m.module.toLowerCase().includes(q)).slice(0, 5);
  }, [q, modules]);

  const screenMatches = useMemo(() => {
    if (!q) return [];
    return routes.filter((r) => r.screenName.toLowerCase().includes(q) || r.screenId.toLowerCase().includes(q)).slice(0, 6);
  }, [q, routes]);

  useEffect(() => {
    if (!q) {
      setRecordResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      // Only the groups in scope are fetched, and results are appended in
      // scope order, so a Product-First role sees catalogue hits first.
      const searchers: Record<SearchGroup, () => Promise<RecordResult[]>> = {
        customers: async () =>
          (await mockDataEngine.list<CustomerSearchRecord>('customers'))
            .filter((c) =>
              c.customerId.toLowerCase().includes(q)
              || c.name.toLowerCase().includes(q)
              || (c.msisdn ?? '').includes(q)
            )
            .slice(0, 3)
            .map((c) =>
              // A protected segment the signed-in role may not see: the hit says so and carries no name, ID or segment.
              canViewCustomerSegment(usePersonaStore.getState().activePersonaId, c.segment)
                ? { key: `customer-${c.customerId}`, kind: 'Customer', label: c.name, sub: `${c.customerId} · ${c.segment}`, path: `/customer/${c.customerId}` }
                : { key: `customer-${c.customerId}`, kind: 'Customer', label: 'Restricted Customer', sub: 'Access restricted for your role', path: `/customer/${c.customerId}` }
            ),
        leads: async () =>
          (await mockDataEngine.list<LeadRecord>('leads'))
            .filter((l) => l.leadId.toLowerCase().includes(q) || l.serviceNeeded.toLowerCase().includes(q))
            .slice(0, 3)
            .map((l) => ({
              key: `lead-${l.leadId}`,
              kind: 'Lead',
              label: l.leadId,
              sub: `${l.serviceNeeded} · ${l.status}`,
              path: `/lead-management/lead-details-view?id=${l.leadId}`,
            })),
        tickets: async () =>
          (await mockDataEngine.list<TicketRecord>('trouble-tickets'))
            .filter((t) => t.ticketId.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
            .slice(0, 3)
            .map((t) => ({
              key: `ticket-${t.ticketId}`,
              kind: 'Ticket',
              label: t.ticketId,
              sub: `${t.category} · ${t.status}`,
              path: `/trouble-ticketing-complaints/ticket-detail-screen-public-notes-bell-icon-notifications?id=${t.ticketId}`,
            })),
        orders: async () =>
          (await mockDataEngine.list<OrderRecord>('orders'))
            .filter((o) => o.orderId.toLowerCase().includes(q) || o.orderType.toLowerCase().includes(q))
            .slice(0, 3)
            .map((o) => ({
              key: `order-${o.orderId}`,
              kind: 'Order',
              label: o.orderId,
              sub: `${o.orderType} · ${o.status}`,
              path: `/order-management/order-approval-detail-attachments-order-details-activities-a?id=${o.orderId}`,
            })),
        'sim-swaps': async () =>
          (await mockDataEngine.list<SimSwapRecord>('sim-swap-orders'))
            .filter((x) => x.simSwapOrderId.toLowerCase().includes(q) || x.msisdn.toLowerCase().includes(q))
            .slice(0, 3)
            .map((x) => ({
              key: `simswap-${x.simSwapOrderId}`,
              kind: 'SIM Swap',
              label: x.simSwapOrderId,
              sub: `${x.msisdn} · ${x.status}`,
              path: `/sim-number-management/sim-swap-queue-order-tasks-tab?id=${x.simSwapOrderId}`,
            })),
        catalog: async () => {
          const [items, campaigns] = await Promise.all([
            mockDataEngine.list<CatalogSearchRecord>('catalog-items'),
            mockDataEngine.list<CampaignSearchRecord>('campaigns'),
          ]);
          const lineTo = (line: string) => (line === 'Mobile' ? '/mobile' : '/fibre-home');
          return [
            ...items
              .filter((c) => c.name.toLowerCase().includes(q) || c.catalogItemId.toLowerCase().includes(q))
              .slice(0, 3)
              .map((c) => ({
                key: `catalog-${c.catalogItemId}`,
                kind: 'Product',
                label: c.name,
                sub: `${c.productLine} · ${c.status}`,
                path: `${lineTo(c.productLine)}?id=${c.catalogItemId}`,
              })),
            ...campaigns
              .filter((c) => c.name.toLowerCase().includes(q) || c.campaignId.toLowerCase().includes(q))
              .slice(0, 2)
              .map((c) => ({
                key: `campaign-${c.campaignId}`,
                kind: 'Campaign',
                label: c.name,
                sub: `${c.campaignId} · ${c.status}`,
                path: `${lineTo(c.productLine)}?id=${c.campaignId}`,
              })),
          ];
        },
      };

      const grouped = await Promise.all(scope.groups.map((g) => searchers[g]()));
      if (cancelled) return;
      setRecordResults(grouped.flat());
    })();
    return () => {
      cancelled = true;
    };
  }, [q, scope]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const flat = [
    ...moduleMatches.map((m) => `/${m.moduleSlug}`),
    ...screenMatches.map((r) => r.path),
    ...recordResults.map((r) => r.path),
  ];
  const screenBase = moduleMatches.length;
  const recordBase = moduleMatches.length + screenMatches.length;
  const go = (path: string) => {
    navigate(path);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const nav = useSearchListNav({
    idPrefix: 'global-search-opt',
    count: flat.length,
    enabled: Boolean(q),
    resetKey: `${q}|${recordResults.length}`,
    inputRef,
    onSelect: (i) => go(flat[i]),
    // Enter with nothing highlighted opens the best match: an exact record id/label first, then the first record, screen or module.
    onEnterWithoutSelection: () => {
      if (!q) return false;
      const exact = recordResults.find((r) => r.label.toLowerCase() === q);
      const target = exact?.path ?? recordResults[0]?.path ?? screenMatches[0]?.path ?? (moduleMatches[0] ? `/${moduleMatches[0].moduleSlug}` : undefined);
      if (!target) return false;
      go(target);
      return true;
    },
    onEscape: () => {
      setQuery('');
      setOpen(false);
    },
  });
  const { active } = nav;

  const hasResults = moduleMatches.length > 0 || screenMatches.length > 0 || recordResults.length > 0;

  return (
    <SearchField
      ref={inputRef}
      wrapperRef={containerRef}
      wrapperClassName="w-full max-w-md min-w-0"
      className="py-2!"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      {...nav.inputProps}
      placeholder={scope.placeholder}
      aria-label="Global search"
      onClear={() => {
        setQuery('');
        setOpen(false);
        inputRef.current?.focus();
      }}
    >
      {open && q && (
        <div className="absolute z-[var(--z-popover)] top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto card shadow-raised">
          {!hasResults && <p className="px-4 py-6 text-center text-muted text-[length:var(--fs-body)]">No matches for &ldquo;{query}&rdquo;.</p>}

          {moduleMatches.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">Modules</p>
              {moduleMatches.map((m, i) => (
                <button type="button"
                  key={m.moduleId}
                  id={`global-search-opt-${i}`}
                  onClick={() => go(`/${m.moduleSlug}`)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-surface ${active === i ? 'bg-surface' : ''}`}
                >
                  <span className="text-fg truncate">{m.module}</span>
                  <span className="text-muted text-[length:var(--fs-caption)] shrink-0">{m.screenCount} screens</span>
                </button>
              ))}
            </div>
          )}

          {screenMatches.length > 0 && (
            <div className="border-t border-border-soft">
              <p className="px-4 pt-3 pb-1 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">Screens</p>
              {screenMatches.map((r, i) => (
                <button type="button"
                  key={r.routeId}
                  id={`global-search-opt-${screenBase + i}`}
                  onClick={() => go(r.path)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-surface ${active === screenBase + i ? 'bg-surface' : ''}`}
                >
                  <span className="text-fg truncate">{screenDisplayName(r.screenName)}</span>
                  <span className="text-muted text-[length:var(--fs-caption)] shrink-0">{r.module}</span>
                </button>
              ))}
            </div>
          )}

          {recordResults.length > 0 && (
            <div className="border-t border-border-soft">
              <p className="px-4 pt-3 pb-1 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">Records</p>
              {recordResults.map((r, i) => (
                <button type="button"
                  key={r.key}
                  id={`global-search-opt-${recordBase + i}`}
                  onClick={() => go(r.path)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-surface ${active === recordBase + i ? 'bg-surface' : ''}`}
                >
                  <span className="text-fg truncate">
                    {r.label} <span className="text-muted text-[length:var(--fs-caption)]">· {r.kind}</span>
                  </span>
                  <span className="text-muted text-[length:var(--fs-caption)] shrink-0">{r.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </SearchField>
  );
}

import { useEffect, useRef, useState } from 'react';
import { canViewCustomerSegment } from '../engines/agentPrivilegeEngine';
import { useNavigate } from 'react-router-dom';
import { getPersona } from '../engines/configEngine';
import { usePersonaStore } from '../stores/personaStore';
import { useAuthStore } from '../stores/authStore';
import { useCustomerContext } from '../stores/customerContextStore';
import { useRegionStore, REGIONS } from '../stores/regionStore';
import { canUseFeature } from '../engines/personaEngine';
import * as mockDataEngine from '../engines/mockDataEngine';
import { SearchField } from '../components/primitives/SearchField';
import { DashboardZone } from './dashboard/DashboardZone';
import { useZoneMetrics } from './dashboard/useZoneMetrics';
import { customerOpsSpec, productWorkSpec } from './dashboard/zoneSpecs';
import { layoutFor, productZoneVariantFor } from './dashboard/dashboardLayout';
import { AVERAGE_WAIT_TIME_DEMO } from './dashboard/heroFigures';
import { useQnomyQueueStore } from '../stores/qnomyQueueStore';
import { ensureWalkInWaiting } from '../engines/qnomyWalkIns';
import { waitingCountFor, queueScope } from '../engines/qnomyQueueEngine';
import { canSeeQnomyTicketNumber } from '../engines/agentPrivilegeEngine';
import type { QTicketRecord } from '../navigation/sessionReferenceLookups';
import { formatDate } from '../lib/format';


interface CustomerRecord {
  customerId: string;
  name: string;
  segment: string;
}

// ONE dashboard route for all 26 roles. Approach chooses which zone(s) render
// and in what order (dashboardLayout); the zones themselves are data
// (zoneSpecs) rendered by one component (DashboardZone).
//
// The whole point is that this is not four dashboards. A Hybrid role's Focus
// control re-orders and re-sizes the same two zones - it does not navigate, and
// because useZoneMetrics loads every kind on mount it cannot refetch either.
export function Dashboard() {
  const navigate = useNavigate();
  const [customerQuery, setCustomerQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const persona = getPersona(activePersonaId);
  const profileName = useAuthStore((s) => s.profile?.name);
  const recentCustomerIds = useCustomerContext((s) => s.recentCustomerIds);
  const regionId = useRegionStore((s) => s.regionId);
  const [recentCustomers, setRecentCustomers] = useState<CustomerRecord[]>([]);
  const [waiting, setWaiting] = useState<number | null>(null);
  const customersServed = useQnomyQueueStore((s) => s.customersServed);

  // Greeting uses the signed-in person's first name, falling back to the role
  // label when no profile has resolved yet.
  const firstName = profileName?.split(' ')[0] ?? persona?.name ?? 'there';
  // Auto-detected from the signed-in agent's own persona record - see
  // dashboardLayout.ts's header note on why there is no agent-facing override
  // of this any more (Focus, removed 2026-09-27).
  const approach = persona?.approach ?? 'Customer-First';
  const layout = layoutFor(approach, firstName);
  const variant = productZoneVariantFor(persona);
  const regionLabel = REGIONS.find((r) => r.id === regionId)?.label ?? 'Vodafone Qatar';
  // Only an oversight role is scoped to a region; everyone else sees the
  // national rollup and the real directory count.
  const regional = persona?.capabilities.includes('agent-oversight') ?? false;
  const m = useZoneMetrics(regional ? regionId : 'NATIONAL');

  // Customers waiting in this role's live queue, for the hero line. Absent for a role with no queue.
  useEffect(() => {
    if (!canSeeQnomyTicketNumber(activePersonaId)) {
      setWaiting(null);
      return;
    }
    let cancelled = false;
    ensureWalkInWaiting(activePersonaId).then(() => Promise.all([mockDataEngine.list<QTicketRecord>('qtickets'), mockDataEngine.list<{ phone?: string }>('customers')])).then(([q, customers]) => {
      if (!cancelled) setWaiting(waitingCountFor(activePersonaId, q, queueScope(customers)));
    });
    return () => {
      cancelled = true;
    };
  }, [activePersonaId]);

  // "/" focuses the search box on this page, as the hint in the search bar says.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.key !== '/' || el?.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (recentCustomerIds.length === 0) {
      setRecentCustomers([]);
      return;
    }
    mockDataEngine.list<CustomerRecord>('customers').then((all) => {
      const byId = new Map(all.map((c) => [c.customerId, c]));
      // A customer in a protected segment this role may not see is not listed (the role may have changed since they were opened).
      setRecentCustomers(
        recentCustomerIds.map((id) => byId.get(id)).filter((c): c is CustomerRecord => c !== undefined && canViewCustomerSegment(activePersonaId, c.segment))
      );
    });
  }, [recentCustomerIds, activePersonaId]);

  // A Hybrid role always has two zones (dashboardLayout.ts no longer offers a
  // way to collapse to one), so this is just "does this approach have one
  // zone or two" now, not a Focus-dependent computation.
  const framing = layout.zones.length > 1 ? 'one-of-two' : 'primary';
  const specFor = (id: string, compact: boolean) =>
    id === 'customer-ops'
      ? customerOpsSpec(m, { compact, framing, regional, regionLabel, recentCustomers })
      : productWorkSpec(m, { variant, compact, framing, regionLabel, regional, queueWaiting: waiting });

  const twoUp = layout.zones.filter((z) => z.size === 'half').length === 2;

  const today = `${new Date().toLocaleDateString('en-GB', { weekday: 'long' })}, ${formatDate(new Date())}`;

  return (
    <div className="p-8">
      {/* The heading owns the gap to whatever follows when there is no note
          under it, so removing the note does not pull the search bar up
          against the greeting. No Focus control sits beside it any more
          (removed 2026-09-27) - see dashboardLayout.ts's header note - so
          this is just the heading now, not a row splitting space with a
          control that no longer exists. */}
      <header className="-mx-8 -mt-8 px-8 pt-8 pb-24 bg-[image:var(--dash-hero-gradient)] text-on-dark rounded-b-[var(--radius-lg)]">
        <p className="flex items-center gap-2 text-on-dark font-semibold text-[length:var(--fs-caption)]">
          <span className="w-3 h-3 rounded-[var(--radius-pill)] bg-success" aria-hidden="true" />
          {regional ? regionLabel : 'Doha Retail'} · Live operations
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div className="min-w-0 max-w-3xl">
            <p className="text-on-dark text-[length:var(--fs-caption)]">{today}</p>
            <h1 className="mt-1 text-[length:clamp(1.75rem,4vw,2.25rem)] leading-tight font-extrabold tracking-tight break-words">{layout.heading}</h1>
          </div>
          <dl className="flex flex-wrap gap-3">
            {[
              { value: waiting === null ? '-' : String(waiting), label: 'Customers in Queue' },
              { value: String(customersServed), label: 'Customers Served' },
              { value: AVERAGE_WAIT_TIME_DEMO, label: 'Average Wait Time', demo: true },
            ].map((s) => (
              <div key={s.label} title={'demo' in s ? 'Demo value - not yet connected to a live feed' : undefined} className="min-w-[7.5rem] rounded-[var(--radius-card)] border border-on-dark-line-2 bg-on-dark-fill-2 px-5 py-4">
                <dd className="text-[length:var(--fs-stat-sm)] font-extrabold">{s.value}</dd>
                <dt className="text-on-dark text-[length:var(--fs-sm)]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Customer search is the entry point for customer-centric work, so it
          only leads for roles that hold it. */}
      {canUseFeature(activePersonaId, 'workspace.customer-search') && (
        <div className="relative z-[var(--z-raised)] -mt-8 mb-10 mx-auto w-[94%]">
          <div className="relative rounded-[var(--radius-card-lg)] bg-bg p-2 shadow-[var(--shadow-dash-card-hover)]">
            <SearchField
              ref={searchRef}
              aria-label="Search a customer"
              value={customerQuery}
              onChange={(e) => {
                setCustomerQuery(e.target.value);
              }}
              // The lookup runs here, on the dashboard, when Enter is pressed - the same search Customer Search runs.
              // Enter opens Customer Search with the typed text, which runs the lookup and shows the results there.
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                navigate('/customer-search', { state: { query: customerQuery.trim() } });
              }}
              onClear={() => {
                setCustomerQuery('');
              }}
              placeholder="Search a customer by mobile, QID, account number…"
              className="!border-transparent !bg-transparent !py-4 !text-[length:var(--fs-body-lg)] focus-visible:!border-[var(--field-focus-border)] focus-visible:!bg-[var(--field-focus-bg)]"
            />
            {customerQuery === '' && (
              <kbd className="pointer-events-none absolute right-5 hidden sm:block top-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] bg-[var(--icon-tile-bg)] px-2.5 py-1 text-[length:var(--fs-xs)] font-medium text-fg-2">Press /</kbd>
            )}
          </div>
        </div>
      )}

      <div className={`${canUseFeature(activePersonaId, 'workspace.customer-search') ? '' : 'mt-8 '}${twoUp ? 'grid grid-cols-1 xl:grid-cols-2 gap-8' : 'space-y-8'}`}>
        {layout.zones.map((zone, zi) => (
          <DashboardZone
            key={zone.id}
            leadsPage={zi === 0}
            spec={specFor(zone.id, zone.size === 'half')}
            size={zone.size}
            readOnly={layout.readOnly}
            loading={m.loading}
            errors={m.errors}
          />
        ))}
      </div>
    </div>
  );
}

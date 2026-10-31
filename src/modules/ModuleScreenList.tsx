import { SearchField } from '../components/primitives/SearchField';
import { PageHeader } from '../components/patterns/PageHeader';
import { useState } from 'react';
import { NotFound } from './NotFound';
import { useParams, Link } from 'react-router-dom';
import { getAllModules, getAllRoutes, getJourneyIdsForScreen, getJourneyMeta } from '../engines/configEngine';
import { MODULE_DESCRIPTIONS } from '../engines/moduleDescriptions';
import { usePersonaStore } from '../stores/personaStore';
import { screensVisibleFor } from '../engines/personaEngine';
import { groupRoutesByFeature } from '../engines/screenGrouping';
import { Badge } from '../components/primitives/Badge';
import { Icon } from '../components/primitives/Icon';
import { Button } from '../components/primitives/Button';
import { getScreenComponent } from './screenRegistry';
import type { Route } from '../types/config';
import { screenDisplayName } from '../lib/screenName';

const ICONS = {
  chevronLeft: 'M15 18l-6-6 6-6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
  openArrow: 'M7 17L17 7 M7 7h10v10',
};

type Filter = 'all' | 'built' | 'not-built' | 'no-access';

// "No access" replaced "Not RBAC-evidenced" on 2026-09-24. Access now comes
// from each role's explicit feature grants rather than sparse rbac.json
// evidence, so a screen with no permission level is one this role was
// deliberately not granted - not one the source corpus happened to be silent
// about. The old label asserted an evidence stance that no longer exists.
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'built', label: 'Built' },
  { key: 'not-built', label: 'Not Built' },
  { key: 'no-access', label: 'No Access' },
];

interface Enriched {
  route: Route;
  permissionLevel: string | null | undefined;
  built: boolean;
}

// Secondary navigation = a module's screens (frontend-architecture.md §9).
// Screen-level access is surfaced as a badge (granted permission level, or
// "No access") rather than hiding the row outright, and `built` is computed
// independently of it - which is what keeps a granted-but-unimplemented
// screen visible as a planned placeholder instead of vanishing.
//
// Screens are grouped under their sub-module/feature via
// screenGrouping.ts - real evidence (traceability-matrix.md) where it
// exists, a keyword heuristic otherwise (~25% of screens have real
// evidence; see that file's header comment for the coverage caveat and a
// concrete example of evidence overriding the "obvious" grouping). Anything
// neither evidenced nor heuristically matched falls into "Other Screens"
// rather than being silently dropped or force-fit.
export function ModuleScreenList() {
  const { moduleSlug } = useParams();
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const module = getAllModules().find((m) => m.moduleSlug === moduleSlug);
  const routes = getAllRoutes().filter((r) => r.module === module?.module);
  const withAccess = screensVisibleFor(activePersonaId, routes);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  if (!module) {
    return <NotFound />;
  }

  const enrichedByScreenId = new Map<string, Enriched>(
    withAccess.map(({ route, permissionLevel }) => [
      route.screenId,
      { route, permissionLevel, built: Boolean(getScreenComponent(route.screenId)) },
    ])
  );

  const catalogued = enrichedByScreenId.size;
  const built = [...enrichedByScreenId.values()].filter((e) => e.built).length;
  const notBuilt = catalogued - built;
  const grantedToRole = [...enrichedByScreenId.values()].filter((e) => e.permissionLevel).length;

  const passesFilters = (e: Enriched) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || e.route.screenName.toLowerCase().includes(q) || e.route.screenId.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter === 'built') return e.built;
    if (filter === 'not-built') return !e.built;
    if (filter === 'no-access') return !e.permissionLevel;
    return true;
  };

  const { groups, ungrouped } = groupRoutesByFeature(module, routes);
  const visibleCount = [...enrichedByScreenId.values()].filter(passesFilters).length;

  const renderCard = (route: Route) => {
    const e = enrichedByScreenId.get(route.screenId);
    if (!e || !passesFilters(e)) return null;
    // Only present when this screen has a confident match in the CRM Journeys
    // catalogue crosswalk (journey-catalogue-map.json) - absent for every
    // other screen, which renders exactly as it did before this was added.
    const journeyIds = getJourneyIdsForScreen(route.screenId);
    return (
      <Link
        key={route.routeId}
        to={route.path}
        className="group card p-5 hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] transition-all"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="font-medium text-fg text-[length:var(--fs-body-lg)]">{screenDisplayName(route.screenName)}</div>
          <Icon path={ICONS.openArrow} className="w-4 h-4 text-muted shrink-0 mt-1 group-hover:text-accent transition-colors" />
        </div>
        <div className="text-accent text-[length:var(--fs-micro)] font-semibold uppercase tracking-wide mb-3">
          <span className="hidden">{route.screenId} · {route.screenType}</span>
          {journeyIds.map((id, i) => (
            <span key={id} title={getJourneyMeta(id)?.name ?? id}>
              {i > 0 && <span className="mx-1.5">·</span>}
              {id}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={e.built ? 'success' : 'filled-neutral'}>{e.built ? 'Built' : 'Not built'}</Badge>
          <Badge variant={e.permissionLevel ? 'outlined-red' : 'filled-neutral'}>{e.permissionLevel ?? 'No access'}</Badge>
        </div>
      </Link>
    );
  };

  return (
    <div className="p-8">
      <PageHeader
        title={module.module}
        actions={
          <Link
            to="/"
            className="shrink-0 flex items-center gap-1 rounded-[var(--radius-button)] border border-on-dark-line-3 px-3 py-1.5 text-[length:var(--fs-caption)] text-on-dark-2 hover:bg-on-dark-fill-2 hover:text-on-dark"
          >
            <Icon path={ICONS.chevronLeft} className="w-3.5 h-3.5" />
            All modules
          </Link>
        }
        description={<>{module.screenCount} screens evidenced in this module. {MODULE_DESCRIPTIONS[module.module] ?? ''}</>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-[length:var(--fs-h4)] font-bold text-accent">{catalogued}</div>
          <div className="text-[length:var(--fs-caption)] text-muted">Catalogued Screens</div>
        </div>
        <div className="card p-4">
          <div className="text-[length:var(--fs-h4)] font-bold text-success">{built}</div>
          <div className="text-[length:var(--fs-caption)] text-muted">Built</div>
        </div>
        <div className="card p-4">
          <div className="text-[length:var(--fs-h4)] font-bold text-fg-2">{notBuilt}</div>
          <div className="text-[length:var(--fs-caption)] text-muted">Not Built</div>
        </div>
        <div className="card p-4">
          <div className="text-[length:var(--fs-h4)] font-bold text-accent">{grantedToRole}</div>
          <div className="text-[length:var(--fs-caption)] text-muted">Granted to This Role</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <SearchField
          aria-label="Search screen ID or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search screen ID or name…"
          wrapperClassName="flex-1 max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <span className="sm:ml-auto text-[length:var(--fs-caption)] text-muted">{visibleCount} screens</span>
      </div>

      {groups.map(({ subModule, feature, routes: featureRoutes }) => {
        const cards = featureRoutes.map(renderCard).filter(Boolean);
        if (cards.length === 0) return null;
        return (
          <div key={`${subModule}::${feature}`} className="mb-6">
            <h2 className="text-[length:var(--fs-h5)] font-bold text-fg-2 mb-1">{subModule}</h2>
            <p className="mb-3 text-[length:var(--fs-caption)] text-muted">{feature}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{cards}</div>
          </div>
        );
      })}

      {(() => {
        const cards = ungrouped.map(renderCard).filter(Boolean);
        if (cards.length === 0) return null;
        return (
          <div className="mb-6">
            <h2 className="text-[length:var(--fs-h5)] font-bold text-fg-2 mb-1">Other Screens</h2>
            <p className="mb-3 text-[length:var(--fs-caption)] text-muted">
              Not evidenced or heuristically matched to a sub-module/feature above.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{cards}</div>
          </div>
        );
      })()}

      {visibleCount === 0 && <div className="px-4 py-6 text-center text-muted">No screens match this search/filter.</div>}
    </div>
  );
}

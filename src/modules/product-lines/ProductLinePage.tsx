import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { usePersonaStore } from '../../stores/personaStore';
import { canUseFeature } from '../../engines/personaEngine';
import { getAllRoutes, getPersona } from '../../engines/configEngine';
import { resolveJourneyTarget } from '../../navigation/journeyTarget';
import { Icon } from '../../components/primitives/Icon';
import { SECONDARY_BUTTON_SURFACE, PRIMARY_SURFACE } from '../../components/primitives/Button';
import { NotYetBuiltPanel } from '../NotYetBuiltPanel';
import { JourneyCard } from './JourneyCard';
import { launchJourney, readLaunch, type LaunchContext } from '../../navigation/customerLaunch';
import {
  PRODUCT_LINE_BY_KEY,
  reachableCategories,
  visibleJourneys,
  type JourneyCategory,
  type ProductLine,
} from '../../navigation/journeyCatalogue';
import { PageHeader } from '../../components/patterns/PageHeader';
import { NotFound } from '../NotFound';

// A product line's journey catalogue, filtered to the active role.
//
// Visibility rules (see journeyCatalogue.ts for the reasoning):
//   - a journey with a featureKey shows only if the role holds that grant
//   - a journey without one is roadmap-only: it shows if the role already
//     holds at least one journey in the same category, so the roadmap is
//     visible to the people who work in that area and nobody else
//   - a category with no visible journeys is omitted entirely
//
// One page serves both the line root (all categories stacked) and each
// category route (that section only), because they are the same content at
// different scope - the pill row switches between them.

function CategorySection({ category, personaId, launch }: { category: JourneyCategory; personaId: string; launch?: LaunchContext }) {
  const journeys = visibleJourneys(category, (k) => canUseFeature(personaId, k));
  if (journeys.length === 0) return null;
  const availableCount = journeys.filter((j) => j.status === 'available').length;

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] overflow-hidden mb-6">
      <header className="flex items-start gap-3 px-5 py-4 bg-bg border-b border-border-soft rounded-t-[var(--radius-card)]">
        <span className="shrink-0 w-9 h-9 rounded-[var(--radius-sm)] bg-tone-accent flex items-center justify-center">
          <Icon path={category.icon} className="w-4.5 h-4.5 text-accent" />
        </span>
        <div className="min-w-0">
          <h2 className="font-bold text-fg text-[length:var(--fs-body-lg)]">{category.heading}</h2>
          <p className="text-fg-2 text-[length:var(--fs-body)]">{category.description}</p>
        </div>
      </header>

      <div className="p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {journeys.map((journey, i) => {
          const target = resolveJourneyTarget(journey);
          // Opened from a customer (Customer 360): journeys with a customer-aware destination go straight to it.
          const launched = launch && target ? launchJourney(journey, target, launch, (id) => getAllRoutes().find((r) => r.screenId === id)?.path) : undefined;
          return <JourneyCard key={journey.id} journey={journey} index={i} to={launched?.to ?? target} state={launched?.state} />;
        })}
      </div>

      <footer className="flex items-center justify-between px-5 py-3 border-t border-border-soft text-[length:var(--fs-caption)] text-muted">
        <span>
          {availableCount} of {journeys.length} available
        </span>
      </footer>
    </section>
  );
}

export function ProductLinePage({ lineKey }: { lineKey: ProductLine['key'] }) {
  const { category: categoryParam } = useParams();
  const [searchParams] = useSearchParams();
  const launch = readLaunch(useLocation().state);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const line = PRODUCT_LINE_BY_KEY.get(lineKey);
  const persona = getPersona(activePersonaId);

  if (!line) return <NotYetBuiltPanel title="Unknown Product Line" body="This product line is not in the catalogue." />;

  const reachable = reachableCategories(lineKey, (k) => canUseFeature(activePersonaId, k));

  if (reachable.length === 0) {
    return (
      <NotYetBuiltPanel
        badge="No access"
        title={line.label}
        body={
          `${persona?.name ?? 'This role'} holds no granted journeys in ${line.label}. `
          + 'Journeys appear here only where the role is granted the underlying feature.'
        }
      />
    );
  }

  // /mobile/<anything> is a category URL: one the line does not have is a 404, not the line page under a wrong address.
  if (categoryParam && !line.categories.some((c) => c.key === categoryParam)) return <NotFound />;
  const active = categoryParam ? reachable.find((c) => c.key === categoryParam) : undefined;
  const shown = active ? [active] : reachable;

  return (
    <div className="p-8">
      <PageHeader title={<>{line.label}</>} description={<>
        {active ? active.description : `Journeys available to ${persona?.name ?? 'this role'} across ${line.label}.`}
      </>} />

      {launch && (
        <p className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 card card-surface px-4 py-3 text-fg-2 text-[length:var(--fs-body)]">
          <span>
            Acting for <span className="text-fg font-medium">{launch.customerName ?? launch.customerId}</span>
            {launch.serviceLabel && (
              <>
                {' '}
                on <span className="text-fg font-medium">{launch.serviceLabel}</span>
              </>
            )}
            .
          </span>
          <Link to={`/customer/${launch.customerId}`} className="text-link font-medium hover:underline">
            Back to Customer 360
          </Link>
        </p>
      )}

      {/* Chip row - same class strings as ModuleScreenList's filter chips, so
          this is a composition of the existing pattern, not a new control.
          8px corner (--radius-button) as of 2026-09-27, not a pill - see
          this file's button-radius note below and Button.tsx's own. */}
      {/* Global search can land a catalogue hit here. Naming the requested id
          keeps the "no fabricated destinations" rule intact - the page says
          plainly that an item detail is planned rather than silently showing
          the whole line as if it had honoured the link. */}
      {searchParams.get('id') && (
        <p className="mb-6 card card-surface px-4 py-3 text-fg-2 text-[length:var(--fs-caption)]">
          A detail view for <code>{searchParams.get('id')}</code> is planned here. Showing the {line.label} journey
          catalogue in the meantime.
        </p>
      )}

      {/* Both chip states come from shared constants (see Button.tsx), so the
          colours here are whatever the current asset says and are not restated
          at this call site. Unselected is SECONDARY_SURFACE - a 1px --accent
          edge around --bg, warming to --surface-warm on hover; selected is
          PRIMARY_SURFACE's gradient.

          The one thing worth keeping local: BOTH states carry a 1px border, so
          the row never shifts by 2px as selection moves between them.

          The chip label follows the secondary button surface (SECONDARY_BUTTON_SURFACE), which keeps it above 4.5:1
          on the hover fill at --fs-caption. */}
      {line.categories.length > 1 && (
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link
          to={line.to}
          state={launch ? { launch } : undefined}
          className={`rounded-[var(--radius-button)] border px-3 py-1.5 text-[length:var(--fs-caption)] ${
            active ? SECONDARY_BUTTON_SURFACE : `${PRIMARY_SURFACE} hover:bg-[image:var(--accent-gradient-hover)]`
          }`}
        >
          All
        </Link>
        {reachable.map((c) => (
          <Link
            key={c.key}
            to={`${line.to}/${c.key}`}
            state={launch ? { launch } : undefined}
            className={`rounded-[var(--radius-button)] border px-3 py-1.5 text-[length:var(--fs-caption)] ${
              active?.key === c.key
                ? `${PRIMARY_SURFACE} hover:bg-[image:var(--accent-gradient-hover)]`
                : SECONDARY_BUTTON_SURFACE
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>
      )}

      {shown.map((c) => (
        <CategorySection key={c.key} category={c} personaId={activePersonaId} launch={launch} />
      ))}
    </div>
  );
}

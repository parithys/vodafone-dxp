import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllModules, getAllRoutes } from '../engines/configEngine';
import { useCustomerContext } from '../stores/customerContextStore';
import { Icon } from '../components/primitives/Icon';
import { NAV_MANIFEST, navItemByPath } from './navManifest';
import { screenDisplayName } from '../lib/screenName';
import { journeyPlaceOf } from './journeyLocation';

const CHEVRON_RIGHT = 'M9 18l6-6-6-6';
const CHEVRON_LEFT = 'M15 18l-6-6 6-6';

function Crumb() {
  return <Icon path={CHEVRON_RIGHT} className="w-3 h-3 text-muted shrink-0" />;
}

// Derived automatically from the route's module -> screen path, not hand-authored
// per screen, per frontend-architecture.md §9.
export function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeCustomerName = useCustomerContext((s) => s.customer?.name);
  const [, moduleSlug, screenSlug] = location.pathname.split('/');
  if (!moduleSlug) return null;

  const module = getAllModules().find((m) => m.moduleSlug === moduleSlug);
  const route = screenSlug ? getAllRoutes().find((r) => r.path === location.pathname) : undefined;
  // Customer 360 has no legacy module/screenName entry (it's part of the
  // newer primary workspace shell, built after routes.json's module catalogue),
  // so it needs its own crumb rather than falling through to a bare "Dashboard".
  const isCustomer360 = moduleSlug === 'customer' && Boolean(screenSlug);
  // Nav manifest destinations (/products, /products/mobile, /customers,
  // /operations, /leads) are likewise not module slugs, so without this they
  // rendered a bare "Dashboard" crumb. Mirrors the isCustomer360 branch.
  const navItem = navItemByPath(location.pathname);
  const navParent = navItem
    ? NAV_MANIFEST.find((i) => i.children?.some((c) => c.key === navItem.key))
    : undefined;

  // A page a journey opens (the Number Management Portal, a wizard, Port-In Status): the trail follows the menu it was opened from - line,
  // then the tab (category) it sits under - instead of the old module catalogue, so it always matches the tab structure of Mobile Services,
  // Fibre & Home Services and New Connections.
  const place = navItem ? undefined : journeyPlaceOf(location.pathname, (location.state as { navJourney?: string } | null)?.navJourney);
  const sameLabel = place ? place.line.label === place.category.label : false;

  return (
    // --nav-border (#e0e0e0), matching the topbar's divider directly above
    // rather than the softer --border-soft this carried. The two are stacked
    // rules in the same column, so an #eeeeee line under an #e0e0e0 one read
    // as a mistake. Same token, not the same literal, so they stay matched in
    // dark mode where --border-soft and --nav-border diverge.
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 px-6 py-2.5 text-[length:var(--fs-caption)] text-fg border-b border-[var(--nav-border)] bg-bg">
      {/* Single global back affordance - this bar is the one persistent
       * element mounted above every routed page (App.tsx), so placing it
       * here guarantees it's always in the same spot, rather than the
       * scattered/inconsistent per-page "Go Back" buttons some screens
       * already have buried in their own action rows. Never rendered on the
       * Dashboard itself (component returns null there - see above), which
       * doubles as "nowhere sensible to go back to" for this button too.
       * Styled as a bordered chip in the same caption size/muted tone as the
       * crumb trail beside it, rather than a bare icon circle, so it reads as
       * part of the same navigation component instead of a separate control.
       * 8px corner (--radius-button) as of 2026-09-27, matching every other
       * button in the app - was a full pill before that pass. */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="breadcrumb-back"
      >
        <Icon path={CHEVRON_LEFT} className="w-3.5 h-3.5" />
        Back
      </button>
      <Link to="/" className="ml-1 inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
        Dashboard
      </Link>
      {navItem && (
        <>
          {navParent && (
            <>
              <Crumb />
              <Link to={navParent.to} className="inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
                {navParent.label}
              </Link>
            </>
          )}
          <Crumb />
          <span className="text-fg font-medium">{navItem.label}</span>
        </>
      )}
      {place && (
        <>
          <Crumb />
          <Link to={place.line.to} className="inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
            {place.line.label}
          </Link>
          {!sameLabel && (
            <>
              <Crumb />
              <Link to={`${place.line.to}/${place.category.key}`} className="inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
                {place.category.label}
              </Link>
            </>
          )}
          <Crumb />
          <span className="text-fg font-medium">{place.journey.title}</span>
        </>
      )}
      {module && !isCustomer360 && !navItem && !place && (
        <>
          <Crumb />
          <Link to={`/${module.moduleSlug}`} className="inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
            {module.module}
          </Link>
        </>
      )}
      {route && !place && (
        <>
          <Crumb />
          <span className="text-fg font-medium">{screenDisplayName(route.screenName)}</span>
        </>
      )}
      {isCustomer360 && (
        <>
          <Crumb />
          <Link to="/customer-search" className="inline-flex min-h-6 items-center text-fg hover:underline underline-offset-4 transition-colors">
            Customers
          </Link>
          <Crumb />
          <span className="text-fg font-medium">{/^ENT-ACC-/i.test(screenSlug ?? '') ? 'Business 360' : (activeCustomerName ?? 'Customer 360')}</span>
        </>
      )}
    </nav>
  );
}

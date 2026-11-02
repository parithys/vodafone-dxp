import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchListNav } from '../hooks/useSearchListNav';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/primitives/Icon';
import { useSidebarStore } from '../stores/sidebarStore';
import { usePersonaStore } from '../stores/personaStore';
import { resolveNavFor } from '../engines/navigationEngine';
import { NavCollapseButton } from './NavLogoToggle';
import { VodafoneMark } from '../components/primitives/VodafoneMark';
import { VodafoneWordmark } from '../components/primitives/VodafoneWordmark';
import { detectDeviceType } from '../lib/deviceType';
import { NAV_MANIFEST, resolveActiveNavPath } from './navManifest';
import { CHEVRON_DOWN, PANEL_TOGGLE_ICON, SEARCH_ICON } from '../assets/icons';

// The row the keyboard has reached while searching the menu.
const KBD_ACTIVE = 'data-[kbd-active=true]:bg-[var(--nav-hover-bg)] data-[kbd-active=true]:text-[var(--nav-fg)] data-[kbd-active=true]:ring-2 data-[kbd-active=true]:ring-inset data-[kbd-active=true]:ring-[var(--nav-fg-muted)]';
const DESKTOP_QUERY = '(min-width: 768px)';
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
// Points down when collapsed, rotated 180deg to point up when expanded -
// matching the reference disclosure pattern.

// The rail is now driven by navManifest.ts, filtered and reordered per role by
// its approach (navigationEngine.resolveNavFor) - the same closed manifest for
// everyone, so a role never sees an item that doesn't belong to its IA.
//
// This replaced a hardcoded six-item array plus a comment asserting the rail
// "can never grow past six". See navManifest.ts for why that cap moved to nine
// (a Hybrid role legitimately spans both halves of the platform) and how the
// load-bearing half of the rule - the manifest being a closed set - is now
// enforced in code rather than by comment.
//
// Items applicable to the role but not yet implemented are styled EXACTLY like
// the rest - no dimming, no disabled state, no special tooltip. They are real
// destinations that navigate and render a Planned page explaining what is
// coming; the page is where that belongs. Dimming them in the rail made a
// planned area read as broken or forbidden rather than forthcoming, and split
// the rail into two visual tiers for a distinction the user does not need while
// navigating.
//
// `implemented` on the manifest is therefore declarative only - it records
// which destinations are placeholder-backed (and pairs with the `planned` copy
// that WorkspaceNotYetBuilt renders). It drives no styling here.

// Fully collapsible: the collapse button in the rail's header hides the whole
// panel at md:+ (background, icons, labels and its width), so the main content
// takes the full width; the top bar's menu button brings it back. The
// preference is persisted via sidebarStore.
//
// Below `md:`, the sidebar instead renders as an off-canvas drawer (see
// `mobileOpen` in sidebarStore); the desktop collapse preference does not apply to it.
/** Of the journeys that open the same page, the one the rail highlights: the one that was opened, else the first. */
function isActiveJourney(journeys: { id: string; to?: string }[], journey: { id: string; to?: string }, opened: string | undefined): boolean {
  const sharing = journeys.filter((x) => x.to === journey.to);
  if (sharing.length < 2) return true;
  const openedHere = sharing.find((x) => x.id === opened);
  return (openedHere ?? sharing[0]).id === journey.id;
}

export function Sidebar() {
  const {
    pinned,
    togglePinned,
    mobileOpen,
    closeMobile,
    peeking,
    openPeek,
    closePeekSoon,
    closePeek,
    expandedNavKeys,
    toggleNavGroup,
    expandNavGroup,
  } = useSidebarStore();
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const location = useLocation();
  // The nav destination the rail should highlight for wherever we are. For a
  // nav destination this is just the pathname; for a record or task route it
  // is resolved, using the origin the navigation carried in location state.
  const activeNavPath = resolveActiveNavPath(
    location.pathname,
    (location.state as { navKey?: string } | null)?.navKey
  );
  const navItems = resolveNavFor(activePersonaId);
  const navigate = useNavigate();
  // Pinning is a desktop feature: below md the navigation is always an overlay drawer.
  const isDesktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => true);
  // Web (pointer devices) docks the pinned navigation beside the page, which narrows to make room; unpinned it is still revealed over
  // the page on hover. Tablet / touch keeps the floating overlay, so the page keeps its full width there.
  const docked = isDesktop && pinned && detectDeviceType() === 'web';
  const shownDesktop = isDesktop && (pinned || peeking);
  const offScreen = isDesktop ? !shownDesktop : !mobileOpen;
  // Menu search: filters this menu only. A group whose own label matches keeps all its sub-items; otherwise just the
  // matching sub-items are shown, with the group forced open.
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visibleItems = q
    ? navItems.flatMap((item) => {
        if (item.label.toLowerCase().includes(q)) return [item];
        const kids = (item.children ?? []).flatMap((c) => {
          if (c.label.toLowerCase().includes(q)) return [c];
          const js = c.journeys?.filter((j) => j.label.toLowerCase().includes(q));
          return js?.length ? [{ ...c, journeys: js }] : [];
        });
        return kids.length ? [{ ...item, children: kids }] : [];
      })
    : navItems;
  // Every navigable row in the filtered menu, in display order: leaf items, categories and journeys (groups only open
  // and close, so they are skipped). The shared search hook walks this list.
  const searchEntries: { id: string; to: string }[] = visibleItems.flatMap((item) =>
    item.children?.length
      ? item.children.flatMap((c) => [
          { id: `child:${c.key}`, to: c.to },
          ...(c.journeys ?? []).map((j) => ({ id: `journey:${c.key}:${j.id}`, to: j.to ?? c.to })),
        ])
      : [{ id: `item:${item.key}`, to: item.to }]
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listNav = useSearchListNav({
    idPrefix: 'nav-search-opt',
    count: searchEntries.length,
    enabled: Boolean(q),
    resetKey: q,
    inputRef: searchInputRef,
    onSelect: (i) => {
      navigate(searchEntries[i].to);
      setQuery('');
    },
    onEnterWithoutSelection: () => {
      if (!searchEntries[0]) return false;
      navigate(searchEntries[0].to);
      setQuery('');
      return true;
    },
    onEscape: () => setQuery(''),
  });
  // id + highlight for a row while the menu is being searched.
  const optProps = (rowId: string) => {
    const i = q ? searchEntries.findIndex((e) => e.id === rowId) : -1;
    return {
      id: i >= 0 ? `nav-search-opt-${i}` : undefined,
      'data-kbd-active': i >= 0 && i === listNav.active ? 'true' : undefined,
    };
  };

  // Below `md:`, the sidebar is an off-canvas drawer - close it automatically
  // whenever the route changes so it doesn't stay open over the new screen.
  useEffect(() => {
    closeMobile();
    closePeek();
    // The floating navigation also closes on arrival, so it doesn't stay over the new screen.
    if (isDesktop && pinned) togglePinned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Reveal the group that owns the route when you arrive from OUTSIDE the rail
  // - a breadcrumb, a dashboard quick action, a reload on a deep link. Landing
  // on /mobile/service-management with Mobile shut would hide where you are.
  //
  // Resolved against the STATIC manifest, not the role-filtered `navItems`.
  // navItems comes from resolveNavFor, which returns [] until loadConfig()
  // resolves, so on a cold deep-link load this effect ran once against an
  // empty array, found no owner, and - keyed on pathname, which never changes
  // - never ran again. The group stayed shut on exactly the arrival it exists
  // for. The manifest is a module constant, so it is always populated.
  // Expanding a group the role cannot reach is harmless: its row isn't
  // rendered, so the key is inert.
  //
  // Deliberately an effect keyed on pathname alone, rather than deriving
  // `expanded = isOpen || childActive`. That derivation was the previous
  // behaviour and it made a group impossible to CLOSE while you stood on one
  // of its children: the toggle flipped the stored key and the derivation
  // forced it straight back open. Adding expandedNavKeys to the deps here
  // would reintroduce exactly that - collapse, effect fires, re-opens.
  //
  // expandNavGroup, not toggleNavGroup: an effect must be idempotent. See the
  // store - StrictMode's double invocation made the toggle open the group and
  // then immediately close it.
  useEffect(() => {
    const owner = NAV_MANIFEST.find((i) => i.children?.some((c) => c.to === location.pathname));
    if (owner) expandNavGroup(owner.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Mobile-only backdrop: sits below the drawer, above the page content,
          and is only present in the DOM/visible when the drawer is open. */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[var(--z-scrim)] bg-scrim md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
      <nav
        inert={offScreen}
        aria-label="Main navigation"
        className={`${docked ? 'md:static md:shrink-0' : ''} nav-drawer ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          // Desktop: pinned or previewing it slides in. Docked (web, pinned) it is a flex sibling of the page and takes its own width;
          // otherwise it is an overlay.
          shownDesktop ? 'md:translate-x-0 md:opacity-100' : 'md:-translate-x-full md:opacity-0'
        } ${shownDesktop && !docked ? 'md:shadow-xl' : ''}`}
        onMouseEnter={!pinned ? openPeek : undefined}
        onMouseLeave={!pinned ? closePeekSoon : undefined}
      >
      {/* Mobile drawer header: the drawer ignores the desktop collapse preference. */}
      <div className="nav-header md:hidden">
        <NavLink to="/" className="row-tight min-w-0">
          <VodafoneMark className="w-7 h-7 shrink-0" />
          <VodafoneWordmark className="h-[18px] w-auto" />
        </NavLink>
        <button type="button"
          onClick={closeMobile}
          aria-label="Close navigation"
          className="nav-icon-btn shrink-0"
        >
          <Icon path={PANEL_TOGGLE_ICON} className="w-4.5 h-4.5" />
        </button>
      </div>
      <div className="nav-header hidden md:flex">
        <NavLink to="/" className="row-tight min-w-0" aria-label="Vodafone - home">
          <VodafoneMark className="w-7 h-7 shrink-0" />
          <VodafoneWordmark className="h-[18px] w-auto" />
        </NavLink>
        {/* Expanded: the collapse icon sits on the right. (Collapsed, the logo in the top bar expands it.) */}
        <NavCollapseButton onToggle={togglePinned} />
      </div>
      <div className="px-2 pt-3 pb-1">
        <label className="nav-search">
          <Icon path={SEARCH_ICON} className="icon-sm" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            {...listNav.inputProps}
            placeholder="Search menu"
            aria-label="Search menu"
            className="nav-search-input"
          />
        </label>
      </div>
      {q && visibleItems.length === 0 && (
        <p className="pad-row text-[length:var(--fs-caption)] text-[var(--nav-fg-muted)]">No menu items match “{query.trim()}”.</p>
      )}
      <ul className="py-1.5 space-y-0.5">
          {visibleItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const childActive = item.children?.some((c) => c.to === activeNavPath) ?? false;
            const expanded = Boolean(q) || expandedNavKeys.includes(item.key);
            // A leaf parent is `end`-matched per the manifest. Parents WITH
            // children no longer link at all, so NavLink's old prefix-matching
            // problem (both /fibre-home and /fibre-home/plans-installation lighting up
            // as red pills) can't arise.
            const parentEnd = item.end ?? hasChildren;
            const exactlyActive = item.to === activeNavPath;
            // A parent with children is a DISCLOSURE, not a destination: one
            // click opens or closes its sub-menu and nothing else. Only a
            // sub-menu item navigates.
            //
            // So it renders as a <button type="button">, not a link. That is the whole fix
            // rather than an `e.preventDefault()` on a NavLink: an <a href>
            // advertises a destination the keyboard, the screen reader and
            // cmd-click all believe, and it is what put `aria-current="page"`
            // and a real `href="/fibre-home"` on a control that must not
            // navigate. A <button type="button" aria-expanded> states what it actually does.
            //
            // The whole row stays one hit target - icon, label and chevron
            // alike. The chevron used to be a separate 14px button, which left
            // dead space between it and the label.
            const rowClass = 'nav-row ';
            const activeClass = 'nav-active';
            // Open group holding the active child: a quiet tint, so the group
            // reads as "you are in here" without competing with the child's
            // own accent marker.
            const inGroupClass = 'nav-in-group';
            const idleClass = 'nav-row-idle';
            const body = (
              <>
                <Icon path={item.icon} className="w-4.5 h-4.5 shrink-0" />
                <span className="truncate">{item.label}</span>
                {hasChildren && (
                  <Icon
                    path={CHEVRON_DOWN}
                    className={`icon-xs ml-auto opacity-70 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                )}
              </>
            );
            return (
              <li key={item.key}>
                <div className="flex items-center">
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleNavGroup(item.key)}
                        aria-expanded={expanded}
                        // The line root (/mobile) is still a real page, reached
                        // from a child's breadcrumb. Keep marking the row when
                        // you are standing on it so a deep link isn't orphaned
                        // in the rail.
                        className={rowClass + (exactlyActive ? activeClass : childActive ? inGroupClass : idleClass)}
                      >
                        {body}
                      </button>
                    ) : (
                      // Highlight comes from activeNavPath, not NavLink's own
                      // isActive: isActive only knows the URL, so a record or
                      // task route - which is not a nav destination - lit
                      // nothing. NavLink still owns navigation and its own
                      // aria-current, which stays URL-accurate: on a record
                      // screen this row is the SECTION, not the current page,
                      // so claiming aria-current="page" for it would be false.
                      <NavLink
                        to={item.to}
                        end={parentEnd}
                        {...optProps(`item:${item.key}`)}
                        className={rowClass + KBD_ACTIVE + ' ' + (exactlyActive ? activeClass : idleClass)}
                      >
                        {body}
                      </NavLink>
                    )}
                </div>
                {/* Sub-menu items hang off a single vertical connector line.
                    The line runs behind the group and
                    the active child draws an accent segment over it, instead of
                    each child being its own filled pill: with a pill, a
                    selected child looked identical in weight to a selected
                    top-level item, so the hierarchy was invisible.
                    The rail's colours are now tokenised (--nav-* in tokens.css
                    / index.css), so the active child's fill follows the theme:
                    in light mode --nav-active-bg is the solid red row the
                    2026-09-24 reference specifies, and in dark mode it stays a
                    subtle white fill with the accent border doing the work,
                    because accent red on the charcoal rail still reads poorly
                    there. Either way the left border is what keeps the
                    hierarchy legible, so the mechanism is unchanged. */}
                {hasChildren && expanded && (
                  <ul className="mt-0.5 ml-[26px] border-l border-[var(--nav-border)]">
                    {item.children!.map((child) => {
                      const hasJourneys = Boolean(child.journeys?.length);
                      const childOpen = Boolean(q) || expandedNavKeys.includes(child.key);
                      return (
                      <li key={child.key}>
                        <div className="flex items-center">
                          <NavLink
                            to={child.to}
                            // The whole row opens the sub-menu: a click on a category that is not the current page
                            // navigates AND opens its journeys; a click on the current page toggles them.
                            onClick={() => {
                              if (!hasJourneys) return;
                              if (child.to === activeNavPath) toggleNavGroup(child.key);
                              else expandNavGroup(child.key);
                            }}
                            {...optProps(`child:${child.key}`)}
                            className={() =>
                              `${KBD_ACTIVE} nav-child ${
                                child.to === activeNavPath
                                  ? 'nav-child-active'
                                  : 'nav-child-idle'
                              }`
                            }
                          >
                            <Icon path={child.icon} className="icon-sm" />
                            <span className="truncate">{child.label}</span>
                          </NavLink>
                          {hasJourneys && (
                            <button
                              type="button"
                              onClick={() => toggleNavGroup(child.key)}
                              aria-expanded={childOpen}
                              aria-label={`${childOpen ? 'Collapse' : 'Expand'} ${child.label}`}
                              className="nav-icon-btn icon-tile h-9 w-8 mr-4"
                            >
                              <Icon path={CHEVRON_DOWN} className={`w-3.5 h-3.5 transition-transform ${childOpen ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        {hasJourneys && childOpen && (
                          // Third level: the journeys this role can see in the category. A planned journey has no
                          // entry point yet and opens its category page, which carries the explanation.
                          <ul className="ml-[22px] border-l border-[var(--nav-border)]">
                            {child.journeys!.map((j) => (
                              <li key={j.id}>
                                {(() => {
                                  // A Link rather than a NavLink: NavLink marks every link to the current page active (aria-current included), and
                                  // several journeys can share one page. Only the one that was opened is.
                                  const target = j.to ?? child.to;
                                  const path = target.split('?')[0];
                                  const onPage = location.pathname === path || location.pathname.startsWith(`${path}/`);
                                  const active = onPage && Boolean(j.to) && isActiveJourney(child.journeys!, j, (location.state as { navJourney?: string } | null)?.navJourney);
                                  return (
                                    <Link
                                      to={target}
                                      // Which journey was opened travels with the navigation (New Number Selection, Number Reservation and
                                      // Special / Gold Number all open the Number Management Portal).
                                      state={{ navJourney: j.id }}
                                      aria-current={active ? 'page' : undefined}
                                      {...optProps(`journey:${child.key}:${j.id}`)}
                                      className={`${KBD_ACTIVE} nav-leaf ${
                                        // A planned journey has no page of its own (it links to its category), so it is never the active row.
                                        active
                                          ? 'nav-leaf-active'
                                          : 'nav-leaf-idle'
                                      }`}
                                    >
                                      <span className="truncate">{j.label}</span>
                                    </Link>
                                  );
                                })()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>
    </nav>
    </>
  );
}

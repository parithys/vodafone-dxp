import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/primitives/Button';
import { Drawer } from '../../components/primitives/Drawer';
import { Icon } from '../../components/primitives/Icon';
import { IconTile } from './sections/C360Kit';
import type { CustomerService } from '../../engines/customerServicesEngine';
import { resolveNavFor } from '../../engines/navigationEngine';
import type { NavItem } from '../../navigation/navManifest';
import { canUseFeature } from '../../engines/personaEngine';
import { getAllRoutes } from '../../engines/configEngine';
import { resolveJourneyTarget } from '../../navigation/journeyTarget';
import { journeyIcon } from '../../navigation/journeyIcons';
import { serviceActionsFor, type ServiceFacts } from '../../navigation/serviceActions';
import { reachableCategories, type Journey } from '../../navigation/journeyCatalogue';
import { usePersonaStore } from '../../stores/personaStore';
import { appliesToCustomer, launchFor, launchJourney, resolveAction, serviceKind, type LaunchContext } from '../../navigation/customerLaunch';

const CHEVRON_DOWN = 'M6 9l6 6 6-6';
const PRODUCT_LINES = new Set(['mobile', 'fibre-home']);
const HUB_KEY = 'new-connections';
const NEW_CONNECTION_ICON = 'M12 5v14 M5 12h14';

/** Closes the menu on an outside click or Escape. */
function useDismiss(open: boolean, close: () => void, onEscape?: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Element;
      // The menu panel is portalled out of `ref` (see MenuPanel), so a click inside it is not an outside click.
      if (ref.current && !ref.current.contains(t) && !t.closest?.('[data-actions-menu]')) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (onEscape ?? close)();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, onEscape]);
  return ref;
}

/** The trigger button inside a menu's container, as a ref for MenuPanel's positioning. */
const triggerOf = (container: RefObject<HTMLElement | null>): RefObject<HTMLElement | null> => ({
  get current() {
    return container.current?.querySelector('button') ?? null;
  },
}) as RefObject<HTMLElement | null>;

/** Runs a menu item for a customer / service: the wired journeys directly, everything else by navigation. */
function useActionRunner(onSupport?: () => void) {
  const navigate = useNavigate();
  return (child: NavItem, launch: LaunchContext) => {
    const outcome = resolveAction(child, launch);
    if (outcome.kind === 'support' && onSupport) return onSupport();
    navigate(outcome.kind === 'navigate' ? outcome.to : child.to, outcome.kind === 'navigate' ? { state: outcome.state } : { state: { launch } });
  };
}

/**
 * The persona's groups, each narrowed to the children that pass `applies`; empty groups are dropped. New Connections comes first
 * as one entry that opens the hub (every connection type, with the customer carried in), then the product lines.
 */
function useGroups(applies: (child: NavItem) => boolean) {
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const nav = resolveNavFor(personaId);
  const hub = nav.find((i) => i.key === HUB_KEY);
  const lines = nav
    .filter((i) => PRODUCT_LINES.has(i.key) && i.children?.length)
    .map((line) => ({ line, children: line.children!.filter(applies) }))
    .filter((g) => g.children.length > 0);
  return hub ? [{ line: hub, children: [{ ...hub, label: 'Start a New Connection' }] }, ...lines] : lines;
}

/** One row of a menu. A disabled one is shown dimmed with its hint (an action that applies but is not open yet). */
interface MenuEntry {
  key: string;
  label: string;
  icon: string;
  disabled?: boolean;
  hint?: string;
}
interface MenuGroup {
  key: string;
  label: string;
  children: MenuEntry[];
}

function MenuPanel({
  groups,
  onPick,
  className = '',
  label,
  anchor,
  id,
  onClose,
}: {
  groups: MenuGroup[];
  onPick: (child: MenuEntry) => void;
  className?: string;
  label: string;
  /** The button the menu hangs from. */
  anchor: RefObject<HTMLElement | null>;
  id: string;
  /** Esc and Tab close the menu and hand focus back to the button. */
  onClose: () => void;
}) {
  // Portalled to <body> and positioned against the button: inside a table or card that scrolls or clips
  // (overflow-hidden/auto), an absolutely positioned menu is cut off and painted under the content below it.
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    const place = () => {
      const a = anchor.current?.getBoundingClientRect();
      const h = panelRef.current?.offsetHeight ?? 0;
      const w = panelRef.current?.offsetWidth ?? 240;
      if (!a) return;
      const below = a.bottom + 4;
      // Flip above the button when there is no room underneath; keep it inside the viewport horizontally.
      const top = below + h > window.innerHeight - 8 && a.top - h - 4 > 8 ? a.top - h - 4 : below;
      const left = Math.max(8, Math.min(a.right - w, window.innerWidth - w - 8));
      setPos({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchor]);
  // Focus moves into the menu when it opens (the first item), so the keyboard user lands in it rather than behind it.
  useEffect(() => {
    if (pos) panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos === null]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = [...(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    const at = items.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  return createPortal(
    <div
      ref={panelRef}
      id={id}
      data-actions-menu
      role="menu"
      aria-label={label}
      onKeyDown={onKeyDown}
      style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden' }}
      className={`fixed z-[var(--z-popover)] w-72 card shadow-raised py-1 text-left ${className}`}
    >
      {groups.map(({ key, label: groupLabel, children }, i) => (
        <div key={key} className={i > 0 ? 'border-t border-border-soft mt-1 pt-1' : ''}>
          <p className="px-4 pt-2 pb-1 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">{groupLabel}</p>
          {children.map((child) => (
            <button
              key={child.key}
              type="button"
              role="menuitem"
              aria-disabled={child.disabled || undefined}
              title={child.disabled ? child.hint : undefined}
              onClick={() => !child.disabled && onPick(child)}
              className={`w-full flex items-center gap-2.5 px-4 py-1.5 min-h-11 text-left text-[length:var(--fs-body)] focus:outline-none focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-outline)] ${
                child.disabled ? 'text-muted cursor-default' : 'text-fg hover:bg-surface'
              }`}
            >
              <span className={child.disabled ? 'opacity-50' : ''}>
                <IconTile icon={child.icon} size="sm" />
              </span>
              <span className="truncate">{child.label}</span>
              {child.disabled && child.hint && <span className="ml-auto shrink-0 text-[length:var(--fs-caption)]">{child.hint}</span>}
            </button>
          ))}
        </div>
      ))}
    </div>,
    document.body
  );
}

/**
 * "Actions" launcher in the Customer 360 header: the side navigation's New Connections hub and its Mobile Services and
 * Fibre & Home Services menus (Plans & Numbers, Service Management, Customer & Account, Plans & Installation, Support &
 * Requests) for the customer being viewed. The list comes from the same navigation manifest, filtered for the signed-in persona, so a role
 * sees here what it sees in the side navigation. Items that act on a kind of service (mobile line, fibre / home
 * service) appear only when the customer holds one; New Connections and Support always do.
 *
 * New Connections opens the hub, whose cards start each journey for this customer (the Existing Customer flow); Support
 * & Requests opens the Tickets & Support tab (when the layout has one); the others open their product-line page for
 * this customer.
 */
export function CustomerActionsMenu({
  customerId,
  customerName,
  services,
  onSupport,
}: {
  customerId: string | undefined;
  customerName?: string;
  /** The customer's services; undefined until they have loaded (nothing is hidden meanwhile). */
  services: CustomerService[] | undefined;
  /** Opens this customer's Tickets & Support tab; undefined when the layout has no such tab. */
  onSupport?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const ref = useDismiss(open, () => setOpen(false), () => closeAndRefocus());
  const closeAndRefocus = () => {
    setOpen(false);
    triggerOf(ref).current?.focus();
  };
  const run = useActionRunner(onSupport);
  const groups = useGroups((c) => appliesToCustomer(c.key, services));
  if (groups.length === 0 || !customerId) return null;
  const primaryMobile = services?.find((s) => serviceKind(s) === 'mobile');
  const launch = launchFor(customerId, customerName, undefined, primaryMobile?.identifier);
  return (
    <div ref={ref} className="relative">
      <Button variant="primary" compact onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}>
        Actions
        <Icon path={CHEVRON_DOWN} className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>
      {open && (
        <MenuPanel
          anchor={triggerOf(ref)}
          id={menuId}
          onClose={closeAndRefocus}
          label="Customer Actions"
          groups={groups.map((g) => ({ key: g.line.key, label: g.line.label, children: g.children }))}
          onPick={(child) => {
            setOpen(false);
            run(groups.flatMap((g) => g.children).find((c) => c.key === child.key)!, launch);
          }}
        />
      )}
    </div>
  );
}

/**
 * The actions for ONE service: only the journeys that apply to it as it is now (its kind, status and the customer's
 * eligibility - see navigation/serviceActions.ts), for the signed-in role. They open in a side drawer rather than a
 * popover: each one carries a description, and the list can run to a dozen rows. Each action carries the service, so
 * the page it opens knows which line. An action that applies but is not open yet is listed dimmed, so an agent can see
 * it exists.
 */
export function ServiceActionsMenu({
  customerId,
  customerName,
  service,
  facts,
}: {
  customerId: string | undefined;
  customerName?: string;
  service: CustomerService;
  facts: ServiceFacts;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const can = (k: string) => canUseFeature(personaId, k);
  const applicable = serviceActionsFor(facts, can);
  // Adding a connection is not an action on this line: it goes through the New Connections hub (every connection type), for this customer.
  const hub = reachableCategories('new-connections', can).length > 0;
  if ((applicable.length === 0 && !hub) || !customerId) return null;
  const launch = launchFor(customerId, customerName, service);
  const pathOfScreen = (id: string) => getAllRoutes().find((r) => r.screenId === id)?.path;
  const run = (journey: Journey) => {
    const target = resolveJourneyTarget(journey);
    if (!target) return;
    const go = launchJourney(journey, target, launch, pathOfScreen);
    setOpen(false);
    navigate(go.to, { state: go.state });
  };
  return (
    <>
      <Button
        variant="secondary"
        compact
        aria-label={`Actions for ${service.identifier}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Actions
        <Icon path={CHEVRON_DOWN} className="w-3.5 h-3.5 -rotate-90" />
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title={`Actions for ${service.identifier}`} bodyClassName="px-6 py-5">
        <p className="text-fg-2 text-[length:var(--fs-body)] mb-5">
          {facts.kind === 'mobile' ? `Mobile · ${service.category}` : service.label}
          {facts.status ? ` · ${facts.status}` : ''}. Only what applies to this service as it is now is listed.
        </p>
        <div className="space-y-6">
          {hub && (
            <section aria-label="New Connections">
              <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted mb-2">New Connections</h3>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/new-connections', { state: { launch } });
                }}
                className="w-full flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg p-4 text-left transition-colors hover:border-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <IconTile icon={NEW_CONNECTION_ICON} />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[length:var(--fs-body)] text-fg">Start a New Connection</span>
                  <span className="block text-fg-2 text-[length:var(--fs-caption)]">New mobile or home connection, or add a line, for this customer</span>
                </span>
              </button>
            </section>
          )}
          {applicable.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted mb-2">{group.label}</h3>
              <ul className="space-y-2">
                {group.actions.map(({ journey, category, open: isOpen }) => {
                  const reachable = isOpen && Boolean(resolveJourneyTarget(journey));
                  return (
                    <li key={journey.id}>
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => run(journey)}
                        className="w-full flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg p-4 text-left transition-colors hover:border-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] disabled:cursor-default disabled:border-dashed disabled:hover:border-[var(--field-card-border)] disabled:hover:bg-bg focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
                      >
                        <span className={reachable ? '' : 'opacity-50'}>
                          <IconTile icon={journeyIcon(journey.id, category.icon)} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block font-medium text-[length:var(--fs-body)] ${reachable ? 'text-fg' : 'text-fg-2'}`}>{journey.title}</span>
                          <span className="block text-fg-2 text-[length:var(--fs-caption)]">{journey.description}</span>
                        </span>
                        {!reachable && <span className="shrink-0 text-muted text-[length:var(--fs-caption)]">Not Yet Open</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Drawer>
    </>
  );
}

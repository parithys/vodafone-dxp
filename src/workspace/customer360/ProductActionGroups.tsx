import { Button } from '../../components/primitives/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRoutes } from '../../engines/configEngine';
import { useCustomerContext, type ActiveCustomerSummary } from '../../stores/customerContextStore';
import { Icon } from '../../components/primitives/Icon';
import { Tooltip } from '../../components/primitives/Tooltip';

const CHEVRON_DOWN = 'M6 9l6 6 6-6';
const CHEVRON_UP = 'M18 15l-6-6-6 6';
// Clock face - a clearer, at-a-glance "not available yet" signal than the
// dashed-border/muted-text treatment alone, which was too subtle to notice
// without hovering for the tooltip.
const CLOCK_ICON = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.2 2';

export interface ProductAction {
  label: string;
  /** One or two plain-English sentences on what this action actually does -
   * same style as the MNP Port-In choice screen's Postpaid/Prepaid cards
   * (MnpProcessChoiceScreen.tsx), so an agent can tell what an action means
   * without launching it first. */
  description: string;
  /** Existing screen this action launches, if one exists yet. Omit to show
   * an honest "not yet built" state instead of a fabricated screen. */
  screenId?: string;
  /**
   * Launches a route computed from the customer instead of a registered screen
   * - for a journey that needs the customer's identity in its URL (the
   * Existing Customer flow of New Connection). Counts as built.
   */
  path?: (customer: ActiveCustomerSummary) => string;
  /**
   * Whether this action needs the customer to already hold a service on this
   * tab. Drives the default filter; omit for an action that applies either
   * way, which is then always shown.
   *
   * Per ACTION rather than per group, because the groups genuinely mix the
   * two: "Number & SIM Services" holds SIM Replacement (needs a line) next to
   * MNP Port-In (how a customer with NO line brings one in), and "New
   * Activation" holds Fibre Activation next to IPTV, whose own description
   * says it goes "on top of the customer's home broadband service". Filtering
   * by group would have hidden exactly the action a new customer came in for.
   */
  appliesWhen?: 'has-service' | 'no-service';
}

export interface ProductActionGroup {
  title: string;
  actions: ProductAction[];
}

// The progressive-disclosure layer for Customer 360's product tabs: groups
// (Existing Customer Services / Number & SIM Services / New Connection,
// etc.) all expand by default so an agent sees every action group at once
// without expanding them one at a time - each group can still be collapsed
// independently via its own header. Launching an action sets the
// active-customer bridge then navigates to the EXISTING screen registered
// for it - no wizard is rewritten to support this, per GuidedContactStep's
// pre-fill patch.
export function ProductActionGroups({
  groups,
  customer,
  hasExistingService,
}: {
  groups: ProductActionGroup[];
  customer: ActiveCustomerSummary;
  /**
   * Whether the customer holds a service on this tab. `undefined` means NOT
   * YET KNOWN - the service inventory is still loading - and suppresses
   * filtering entirely rather than defaulting to false, which would briefly
   * hide every existing-customer action and then flip them back in.
   */
  hasExistingService?: boolean;
}) {
  const navigate = useNavigate();
  const setActiveCustomer = useCustomerContext((s) => s.setActiveCustomer);
  const [openTitles, setOpenTitles] = useState<Set<string>>(() => new Set(groups.map((g) => g.title)));
  const [showAll, setShowAll] = useState(false);

  const toggleGroup = (title: string) => {
    setOpenTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const launch = (action: ProductAction) => {
    if (action.path) {
      setActiveCustomer(customer);
      // startFresh: starting a journey from Customer Details never resumes an old draft.
      navigate(action.path(customer), { state: { startFresh: true } });
      return;
    }
    const route = action.screenId ? getAllRoutes().find((r) => r.screenId === action.screenId) : undefined;
    if (!route) return;
    setActiveCustomer(customer);
    navigate(route.path);
  };

  // An action applies if it is unmarked, or if its marker matches what the
  // customer actually holds. Unknown state applies everything.
  const applies = (action: ProductAction) =>
    hasExistingService === undefined ||
    action.appliesWhen === undefined ||
    (action.appliesWhen === 'has-service') === hasExistingService;

  // Groups are filtered by their ACTIONS, and a group left with none drops
  // out entirely - so a mobile-only customer does not see an empty "New
  // Activation" header on the Fibre tab.
  const applicableGroups = groups
    .map((group) => ({ ...group, actions: group.actions.filter(applies) }))
    .filter((group) => group.actions.length > 0);

  const totalActions = groups.reduce((n, g) => n + g.actions.length, 0);
  const applicableActions = applicableGroups.reduce((n, g) => n + g.actions.length, 0);
  const hiddenCount = totalActions - applicableActions;
  const visibleGroups = showAll ? groups : applicableGroups;

  return (
    <div className="space-y-2.5">
      {/* Only when something is actually hidden. A permanent toggle that
          sometimes changes nothing is worse than no toggle: the agent cannot
          tell whether they are seeing everything. */}
      {hiddenCount > 0 && (
        <div className="flex items-center justify-between gap-3 pb-1">
          <p className="text-muted text-[length:var(--fs-caption)]">
            {showAll
              ? `Showing all ${totalActions} services.`
              : `Showing ${applicableActions} services for this customer's connection.`}
          </p>
          <Button variant="tertiary" compact className="shrink-0" onClick={() => setShowAll((prev) => !prev)} aria-pressed={showAll}>
            {showAll ? 'Show applicable only' : `Show all (${hiddenCount} more)`}
          </Button>
        </div>
      )}
      {visibleGroups.map((group) => {
        const isOpen = openTitles.has(group.title);
        return (
          <div key={group.title} className="card overflow-hidden">
            <button type="button"
              onClick={() => toggleGroup(group.title)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface"
            >
              <span className="font-medium text-fg text-[length:var(--fs-body)]">{group.title}</span>
              <Icon path={isOpen ? CHEVRON_UP : CHEVRON_DOWN} className="w-4 h-4 text-muted shrink-0" />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-border-soft pt-3">
                {group.actions.map((action) => {
                  const available = Boolean(action.path || (action.screenId && getAllRoutes().find((r) => r.screenId === action.screenId)));
                  if (!available) {
                    return (
                      <Tooltip key={action.label} content="Not yet built for this action" placement="top">
                        <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-dashed border-border bg-light-neutral p-4 text-muted cursor-not-allowed">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[length:var(--fs-btn-compact)] font-medium uppercase tracking-wide">{action.label}</span>
                            <Icon path={CLOCK_ICON} className="w-3.5 h-3.5 shrink-0" />
                          </div>
                          <p className="text-[length:var(--fs-caption)] leading-snug">{action.description}</p>
                        </div>
                      </Tooltip>
                    );
                  }
                  return (
                    // Same soft-pink treatment as every other secondary/
                    // clickable button in the app (2026-09-27) - see
                    // DashboardZone's Quick actions for the identical change
                    // and the same reasoning. The description line keeps its
                    // own --fg-2 explicitly, so only the action label itself
                    // takes the deep-red - a card that turned entirely one
                    // colour would lose the label/description hierarchy this
                    // already had.
                    <button type="button"
                      key={action.label}
                      onClick={() => launch(action)}
                      className={`flex flex-col gap-2 card p-4 text-left text-fg hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)] transition-colors`}
                    >
                      <span className="text-[length:var(--fs-btn-compact)] font-medium uppercase tracking-wide">{action.label}</span>
                      <p className="text-[length:var(--fs-caption)] text-fg-2 leading-snug">{action.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

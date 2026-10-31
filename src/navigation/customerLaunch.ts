import type { CustomerService } from '../engines/customerServicesEngine';
import type { NavItem } from './navManifest';
import { existingCustomerPath, existingHomeCustomerPath } from './journeyPaths';

// What the Mobile / Fibre & Home menus mean when they are launched FROM a customer (the Customer 360 Actions
// menu and the per-service row menu): which actions apply to what the customer holds, and where each one goes.

/** Travels in router state to the page an action opens, so it can say who and which service it is for. */
export interface LaunchContext {
  customerId: string;
  customerName?: string;
  /** The service the action was launched from (a row menu), if any. */
  serviceRef?: string;
  serviceLabel?: string;
  serviceTab?: CustomerService['tab'];
  /** The line's number, for destinations that start from an MSISDN. */
  msisdn?: string;
}

export const readLaunch = (state: unknown): LaunchContext | undefined => (state as { launch?: LaunchContext } | null)?.launch;

type ServiceKind = 'mobile' | 'home' | 'other';

export function serviceKind(s: CustomerService): ServiceKind {
  if (s.category === 'Prepaid' || s.category === 'Postpaid') return 'mobile';
  if (s.category === 'Smart Devices') return 'other';
  return 'home';
}

/** Actions that only make sense for a customer who already holds that kind of service. Everything else always applies. */
const NEEDS: Record<string, ServiceKind> = {
  'mobile.plans-numbers': 'mobile',
  'mobile.service-management': 'mobile',
  'fibre-home.plans-installation': 'home',
  'fibre-home.service-management': 'home',
};

/** Customer level: shown unless the customer is known to hold no service of the kind it acts on. `services` is undefined while loading. */
export function appliesToCustomer(childKey: string, services: CustomerService[] | undefined): boolean {
  const need = NEEDS[childKey];
  if (!need || services === undefined) return true;
  return services.some((s) => serviceKind(s) === need);
}

/** Service level (row menu): acts on this service, so the New Connections hub is out and the kind must match. */
export function appliesToService(childKey: string, service: CustomerService): boolean {
  if (childKey === 'new-connections') return false;
  // A service belongs to one product line: a mobile line gets the Mobile menu, a fibre / home service the Fibre & Home one.
  const kind = serviceKind(service);
  if (kind === 'other') return false;
  return childKey.startsWith(kind === 'mobile' ? 'mobile.' : 'fibre-home.');
}

export function launchFor(customerId: string, customerName: string | undefined, service?: CustomerService, fallbackMsisdn?: string): LaunchContext {
  return {
    customerId,
    customerName,
    serviceRef: service?.ref,
    serviceLabel: service ? `${service.label} (${service.identifier})` : undefined,
    serviceTab: service?.tab,
    msisdn: service && serviceKind(service) === 'mobile' ? service.identifier : fallbackMsisdn,
  };
}

export type ActionOutcome = { kind: 'support' } | { kind: 'navigate'; to: string; state: Record<string, unknown> };

/** Where a navigation-manifest child goes when launched for this customer / service. */
export function resolveAction(child: NavItem, launch: LaunchContext): ActionOutcome {
  if (child.key.endsWith('.support-requests')) return { kind: 'support' };
  return { kind: 'navigate', to: child.to, state: { launch } };
}

/**
 * A product-line journey card, opened for the customer in `launch`. Journeys with a customer-aware destination go
 * straight to it; the rest open as usual (they get the launch context in router state).
 */
export function launchJourney(
  journey: { id: string; path?: string; screenId?: string },
  target: string,
  launch: LaunchContext,
  pathOfScreen: (screenId: string) => string | undefined
): { to: string; state: Record<string, unknown> } {
  // The New Connections hub: each card starts its journey for this customer (the Existing Customer flow, identity already known).
  if (journey.id === 'mob-new-connection') return { to: existingCustomerPath(launch.customerId), state: { startFresh: true } };
  if (journey.id === 'fib-new-home') return { to: existingHomeCustomerPath(launch.customerId), state: { startFresh: true } };
  // "View service" / "Contact update" point at the customer finder; with a customer already chosen, open them.
  if (journey.path === '/customer-search') {
    return {
      to: `/customer/${launch.customerId}`,
      state: launch.serviceRef && launch.serviceTab ? { tab: launch.serviceTab, serviceRef: launch.serviceRef } : {},
    };
  }
  // SIM Replacement / Swap: the request is raised from Global Search by MSISDN (the card itself opens the swap queue),
  // so with a line known it opens that search with the number already entered.
  if (journey.id === 'mob-sim-replacement' && launch.msisdn) {
    const search = pathOfScreen('SCR-195');
    if (search) return { to: `${search}?msisdn=${encodeURIComponent(launch.msisdn)}`, state: { startFresh: true, launch } };
  }
  // Ticket journeys open the creation form for this customer.
  if (journey.screenId === 'SCR-211') return { to: `${target}?create=1&customerId=${encodeURIComponent(launch.customerId)}`, state: { startFresh: true, launch } };
  return { to: target, state: { startFresh: true, launch } };
}

import type { CustomerService } from '../engines/customerServicesEngine';
import { PRODUCT_LINES, visibleJourneys, type Journey, type JourneyCategory } from './journeyCatalogue';

// Which journeys the row menu of ONE service (an MSISDN, a fibre line) offers: only the ones that apply to what that
// service is right now - its kind, its status and whether the customer / line is eligible. The product-line pages
// keep listing every journey; this is the "what can I do to THIS line" cut of the same catalogue.

/** What the rules look at. Everything here is read from the customer's own records, nothing is assumed. */
export interface ServiceFacts {
  kind: 'mobile' | 'home';
  category: CustomerService['category'];
  /** The service's own status: Active, Suspended, Barred, a GigaHome subscription state, ... (undefined = not recorded). */
  status?: string;
  /** The customer is on the collections / security blacklist. */
  blacklisted: boolean;
  /** The account carries a barring (not 'Not Barred'). */
  barred: boolean;
  /** An approved device instalment is on the customer's account (what a device upgrade replaces). */
  hasDeviceInstalment: boolean;
}

const active = (f: ServiceFacts) => /^active/i.test(f.status ?? '') || /trial|home move/i.test(f.status ?? '');
const suspended = (f: ServiceFacts) => /suspend/i.test(f.status ?? '');
const terminated = (f: ServiceFacts) => /terminat|closed|disconnect/i.test(f.status ?? '');
/** Free of anything that blocks a commercial change: not blacklisted, not barred. */
const clear = (f: ServiceFacts) => !f.blacklisted && !f.barred;

/**
 * One rule per service-level journey. A journey with NO rule here is not an action on a line (Port-In, Number
 * Reservation, Customer Validation, Contact Update, Authorised Representative, New Connections, ticket tracking ...):
 * those belong to the customer-level Actions menu and are never offered on a row.
 *
 * Gaps in the data are handled by not guessing: no line in the data is an eSIM, so "eSIM to Physical SIM" never applies
 * and "Physical SIM to eSIM" is offered to every active line.
 */
const RULES: Record<string, (f: ServiceFacts) => boolean> = {
  // Mobile - Existing Service
  'mob-view-service': () => true,
  'mob-change-postpaid-plan': (f) => f.category === 'Postpaid' && active(f) && clear(f),
  'mob-change-prepaid-pack': (f) => f.category === 'Prepaid' && active(f) && !f.barred,
  'mob-add-addon': (f) => active(f) && !f.barred,
  'mob-suspend': (f) => active(f) && !f.barred,
  'mob-resume': (f) => suspended(f),
  'mob-terminate': (f) => !terminated(f),
  // Mobile - SIM & Device
  'mob-sim-replacement': (f) => active(f) || suspended(f), // replacement and swap are one journey (one screen, SCR-196)
  'mob-phys-to-esim': (f) => active(f) && !f.barred,
  'mob-esim-to-phys': () => false,
  'mob-device-upgrade': (f) => f.category === 'Postpaid' && active(f) && f.hasDeviceInstalment,
  // Mobile - Customer & Ownership (the ones that move this line)
  'mob-ownership-change': (f) => active(f) && clear(f),
  // Fibre & Home - Existing Service
  'fib-view-service': () => true,
  'fib-fwa-5g-service': (f) => f.category === 'GigaHome 5G',
  'fib-fnp-change': (f) => active(f) && !f.barred, // FNP is fibre-to-fibre only; not offered on a mobile line
  'fib-change-plan': (f) => active(f) && clear(f),
  'fib-upgrade': (f) => active(f) && clear(f),
  'fib-suspend': (f) => active(f) && !f.barred,
  'fib-resume': (f) => suspended(f),
  'fib-terminate': (f) => !terminated(f),
  // Fibre & Home - Relocation
  'fib-relocate': (f) => active(f) && clear(f),
  'fib-home-move': (f) => active(f) && clear(f),
  'fib-change-install-address': (f) => active(f),
  'fib-install-appointment': (f) => active(f),
  // Fibre & Home - Equipment
  'fib-router-mgmt': (f) => f.category === 'GigaHome Fibre' && active(f),
  'fib-equip-replacement': (f) => active(f),
  'fib-device-return': (f) => !terminated(f),
  'fib-iptv-equipment': (f) => f.category === 'TV / Entertainment' || f.category === 'GigaHome Fibre',
  // Fibre & Home - Support (raised against this service)
  'fib-create-ticket': () => true,
  'fib-connectivity-issue': (f) => active(f),
  'fib-complaint': () => true,
  'fib-install-issue': (f) => active(f),
};

export interface ServiceAction {
  journey: Journey;
  category: JourneyCategory;
  /** False for a journey that applies to the line but is not open yet (status 'planned'): shown dimmed, not clickable. */
  open: boolean;
}

export interface ServiceActionGroup {
  key: string;
  label: string;
  actions: ServiceAction[];
}

/**
 * The journeys that apply to this service, grouped by catalogue category, for the role behind `canUse`.
 * Role gating is the product-line pages' own rule (visibleJourneys); the facts then narrow it to the line.
 */
export function serviceActionsFor(facts: ServiceFacts, canUse: (featureKey: string) => boolean): ServiceActionGroup[] {
  const line = PRODUCT_LINES.find((l) => l.key === (facts.kind === 'mobile' ? 'mobile' : 'fibre-home'));
  if (!line) return [];
  return line.categories
    .map((category) => ({
      key: `${line.key}.${category.key}`,
      label: category.label,
      actions: visibleJourneys(category, canUse)
        .filter((j) => RULES[j.id]?.(facts))
        .map((journey) => ({ journey, category, open: journey.status !== 'planned' })),
    }))
    .filter((g) => g.actions.length > 0);
}

/** Journey ids that have a service-level rule (the catalogue test checks every one still exists). */
export const SERVICE_ACTION_IDS = Object.keys(RULES);

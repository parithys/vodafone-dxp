// The New Connections hub and the Mobile and Fibre & Home product-line journey catalogue: what an agent can
// actually DO to a service, grouped the way the business talks about it rather
// than the way the screens happen to be implemented.
//
// Each product line renders one page (ProductLinePage) with a pill row for its
// categories; a category route shows just that section, "All" stacks them.
//
// Two fields decide what a role sees, and they are deliberately separate:
//
//   featureKey  Visibility. The card renders only if the role holds a grant for
//               this key in personas.json. Absent = a roadmap-only journey with
//               no catalogue entry yet; those render for any role that already
//               holds at least one journey in the same category, so the roadmap
//               stays visible without leaking irrelevant journeys to unrelated
//               roles (a Field Engineer should not be shown "Change Postpaid
//               Plan" just because it is unbuilt).
//
//   status      Product judgement, authored - NOT derived from built-ness.
//               'available' means the journey has a working end-to-end entry
//               point; 'partly' means only part of it is reachable (e.g. the
//               SIM swap QUEUE exists but the replacement journey does not);
//               'planned' means none of it is. Deriving this from
//               registerScreen() alone would over-promise: numbers.management-
//               portal is built, but that does not make "Special / Gold Number"
//               a finished journey. validateJourneyCatalogue() guards the one
//               thing that must hold - an 'available' journey must resolve to a
//               screen that is actually registered.

export type JourneyStatus = 'available' | 'partly' | 'planned';

export interface Journey {
  id: string;
  title: string;
  description: string;
  status: JourneyStatus;
  /** Gates visibility against personas.json grants. */
  featureKey?: string;
  /** Entry point. screenId is resolved to a path via routes.json. */
  screenId?: string;
  path?: string;
  /** The product a New Connections card starts, shown on the card (the other lines' journeys are already under their line). */
  product?: string;
}

export interface JourneyCategory {
  key: string;
  /** Pill label - deliberately shorter than the section heading. */
  label: string;
  heading: string;
  description: string;
  icon: string;
  journeys: Journey[];
}

export interface ProductLine {
  key: 'new-connections' | 'mobile' | 'fibre-home';
  label: string;
  to: string;
  categories: JourneyCategory[];
}

const CAT_ICONS = {
  plans: 'M4 6h16 M4 12h16 M4 18h10 M18 16v4 M16 18h4',
  newConnection: 'M12 5v14 M5 12h14',
  existingService: 'M21 12a9 9 0 0 1-9 9 9 9 0 0 1-8.5-6 M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8.5 6 M21 3v6h-6 M3 21v-6h6',
  numberServices: 'M9 3L7 21 M17 3l-2 18 M3.5 8.5h17 M3 15.5h17',
  simDevice: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 9h6v6H9z M2 9h2 M2 15h2 M20 9h2 M20 15h2',
  customerOwnership: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M17 11l2 2 4-4',
  relocation: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  equipment: 'M14.7 6.3a4 4 0 0 1 5 5L21 12l-9 9-3-3 9-9z M7 17l-3 3 M4.5 13.5l6 6',
  support: 'M4 14v-2a8 8 0 0 1 16 0v2 M4 14a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2z M20 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z M18 16v1a3 3 0 0 1-3 3h-3',
};

export const PRODUCT_LINES: readonly ProductLine[] = [
  // New Connections is common to every product, so it is one cross-line hub rather than a section inside each line. Each card
  // names the product it starts (`product`), and a journey that spans products (Add a New Line) picks the product inside it.
  {
    key: 'new-connections',
    label: 'New Connections',
    to: '/new-connections',
    categories: [
      {
        key: 'new-connections',
        label: 'New Connections',
        heading: 'New Connections',
        description: 'Start a new mobile or home connection, add a line to an account, or activate an IPTV service.',
        icon: CAT_ICONS.newConnection,
        journeys: [
          { id: 'mob-new-connection', title: 'New Connection', description: 'Start a new mobile connection: Postpaid, Prepaid or MNP', status: 'available', featureKey: 'postpaid.new-postpaid-wizard', path: '/mobile/start-connection', product: 'Mobile' },
          { id: 'fib-new-home', title: 'New Home Connection', description: 'Activate a new home connection: fibre, fixed line, FWA or 5G Home', status: 'available', featureKey: 'fixedline.new-fixed-line-wizard', screenId: 'SCR-043', product: 'Fibre & Home' },
          { id: 'mob-add-line', title: 'Add a New Line', description: 'Add a line to an existing account: Postpaid, Prepaid or Fibre', status: 'planned', product: 'All products' },
          { id: 'fib-new-iptv', title: 'New IPTV Service', description: 'Add an IPTV subscription to a fibre account', status: 'planned', product: 'Fibre & Home' },
        ],
      },
    ],
  },
  {
    key: 'mobile',
    label: 'Mobile Services',
    to: '/mobile',
    categories: [
      {
        key: 'plans-numbers',
        label: 'Plans & Numbers',
        heading: 'Plans & Numbers',
        description: 'Change plans and packs, add add-ons, and select, port, reserve, or change mobile numbers.',
        icon: CAT_ICONS.plans,
        journeys: [
          { id: 'mob-change-postpaid-plan', title: 'Change Postpaid Plan', description: 'Move a customer to a different postpaid plan', status: 'available', featureKey: 'mobile.change-postpaid-plan', path: '/mobile/change-postpaid-plan' },
          { id: 'mob-change-prepaid-pack', title: 'Change Prepaid Pack', description: 'Change a prepaid bundle or top-up', status: 'available', featureKey: 'mobile.change-prepaid-pack', path: '/mobile/change-prepaid-pack' },
          { id: 'mob-add-addon', title: 'Add Add-On', description: 'Add a roaming, data, or IDD add-on', status: 'available', featureKey: 'mobile.add-addon', path: '/mobile/add-addon' },
          { id: 'mob-number-selection', title: 'New Number Selection', description: 'Reserve and assign a preferred number', status: 'partly', featureKey: 'numbers.management-portal', screenId: 'SCR-024' },
          { id: 'mob-mnp-portin', title: 'MNP Port-In', description: 'Port a number from another Qatari operator', status: 'available', featureKey: 'mnp.process-choice', screenId: 'SCR-120' },
          { id: 'mob-number-reservation', title: 'Number Reservation', description: 'Reserve a standard or preferred number', status: 'partly', featureKey: 'numbers.management-portal', screenId: 'SCR-024' },
          { id: 'mob-gold-number', title: 'Special / Gold Number', description: 'Select and assign a premium or gold number', status: 'partly', featureKey: 'numbers.management-portal', screenId: 'SCR-024' },
          { id: 'mob-port-in-status', title: 'Port-In Status', description: 'Track a port-in request: NPAS status, confirmed date, rejection', status: 'available', featureKey: 'mnp.port-in-status', screenId: 'SCR-136' },
        ],
      },
      {
        key: 'service-management',
        label: 'Service Management',
        heading: 'Service Management',
        description: 'View and manage active mobile services: SIM replacements and swaps, eSIM activation and conversions, device upgrades, suspension and termination.',
        icon: CAT_ICONS.existingService,
        journeys: [
          { id: 'mob-view-service', title: 'View Mobile Service', description: 'View account, usage, and service details', status: 'available', featureKey: 'workspace.customer360-view', path: '/customer-search' },
          { id: 'mob-sim-replacement', title: 'SIM Replacement / Swap', description: 'Replace a lost, damaged, or expired SIM, or move the number to a new SIM card', status: 'partly', featureKey: 'numbers.sim-swap-queue', screenId: 'SCR-196' },
          { id: 'mob-esim-activation', title: 'eSIM Activation', description: 'Provision an eSIM for a compatible device', status: 'planned' },
          { id: 'mob-phys-to-esim', title: 'Physical SIM to eSIM', description: 'Convert a physical SIM to an eSIM profile', status: 'planned' },
          { id: 'mob-esim-to-phys', title: 'eSIM to Physical SIM', description: 'Revert an eSIM to a physical SIM card', status: 'planned' },
          { id: 'mob-device-upgrade', title: 'Device Upgrade', description: 'Upgrade a bundled handset on an active contract', status: 'planned' },
          { id: 'mob-suspend', title: 'Suspend Service', description: 'Temporarily suspend a mobile line', status: 'planned' },
          { id: 'mob-resume', title: 'Resume Service', description: 'Reactivate a suspended mobile line', status: 'planned' },
          { id: 'mob-terminate', title: 'Terminate Service', description: 'Close and terminate a mobile contract', status: 'planned' },
        ],
      },
      {
        key: 'customer-account',
        label: 'Customer & Account',
        heading: 'Customer & Account',
        description: 'Validate identity, update customer details, and manage service ownership.',
        icon: CAT_ICONS.customerOwnership,
        journeys: [
          { id: 'mob-customer-validation', title: 'Customer Validation', description: "Validate a customer's identity and QID", status: 'available', featureKey: 'identity.passport-to-qid', screenId: 'SCR-151' },
          { id: 'mob-contact-update', title: 'Contact Information Update', description: 'Update email, address, or phone details', status: 'partly', featureKey: 'workspace.customer360-view', path: '/customer-search' },
          { id: 'mob-ownership-change', title: 'Ownership Change', description: 'Transfer service ownership to another person', status: 'planned', featureKey: 'numbers.ton-wizard', screenId: 'SCR-035' },
          { id: 'mob-authorised-rep', title: 'Authorised Representative', description: 'Add or manage an authorised representative', status: 'planned' },
        ],
      },
      {
        key: 'support-requests',
        label: 'Support & Requests',
        heading: 'Support & Requests',
        description: 'Create and track tickets, fault reports, complaints, and escalations.',
        icon: CAT_ICONS.support,
        journeys: [
          { id: 'mob-create-ticket', title: 'Create Ticket', description: 'Raise a new support or fault ticket', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'mob-track-ticket', title: 'Track Ticket', description: 'Find and review an existing ticket', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'mob-connectivity-issue', title: 'Report Connectivity Issue', description: 'Log a mobile network or voice connectivity fault', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'mob-complaint', title: 'Complaint', description: 'Log a formal customer complaint', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'mob-escalation', title: 'Escalation', description: 'Escalate an unresolved ticket to a senior team', status: 'planned' },
        ],
      },
    ],
  },
  {
    key: 'fibre-home',
    label: 'Fibre & Home Services',
    to: '/fibre-home',
    categories: [
      {
        key: 'plans-installation',
        label: 'Plans & Installation',
        heading: 'Plans & Installation',
        description: 'Manage FWA / 5G services and plans, check coverage, relocate or move a service, and book installations.',
        icon: CAT_ICONS.plans,
        journeys: [
          { id: 'fib-fwa-5g-service', title: 'FWA / 5G Service', description: 'Manage FWA and 5G home services', status: 'available', featureKey: 'fwa.serial-number-check', screenId: 'SCR-093' },
          { id: 'fib-fnp-change', title: 'FNP Number Change', description: 'Change to a number within Vodafone Qatar (fibre-to-fibre number portability)', status: 'available', featureKey: 'mnp.port-in-wizard', screenId: 'SCR-121' },
          { id: 'fib-change-plan', title: 'Change Plan', description: 'Move a customer to a different plan tier', status: 'planned' },
          { id: 'fib-upgrade', title: 'Upgrade Service', description: 'Upgrade speed tier or service type', status: 'planned' },
          { id: 'fib-coverage-check', title: 'Coverage Check', description: 'Check fibre or FWA availability at an address', status: 'partly', featureKey: 'fixedline.new-fixed-line-wizard', screenId: 'SCR-043' },
          { id: 'fib-relocate', title: 'Relocate Fibre Service', description: 'Move an active fibre service to a new address', status: 'planned' },
          { id: 'fib-home-move', title: 'Home Move', description: 'Coordinate a full home move with service transfer', status: 'planned', featureKey: 'fwa.appointment-booking', screenId: 'SCR-115' },
          { id: 'fib-change-install-address', title: 'Change Installation Address', description: 'Update the registered installation address', status: 'planned' },
          { id: 'fib-install-appointment', title: 'Installation Appointment', description: 'Schedule or reschedule a field installation', status: 'planned', featureKey: 'fwa.appointment-booking', screenId: 'SCR-109' },
        ],
      },
      {
        key: 'service-management',
        label: 'Service Management',
        heading: 'Service Management',
        description: 'View and manage active fibre and home services, routers and equipment, and suspend, resume, or terminate a service.',
        icon: CAT_ICONS.existingService,
        journeys: [
          { id: 'fib-view-service', title: 'View Existing Service', description: 'View account details, usage, and plan', status: 'available', featureKey: 'workspace.customer360-view', path: '/customer-search' },
          { id: 'fib-router-mgmt', title: 'Router Management', description: 'View router details and perform a remote reset', status: 'planned' },
          { id: 'fib-equip-replacement', title: 'Equipment Replacement', description: 'Replace a faulty or damaged CPE device', status: 'planned' },
          { id: 'fib-device-return', title: 'Device Return', description: 'Initiate a CPE return on contract termination', status: 'planned' },
          { id: 'fib-iptv-equipment', title: 'IPTV Equipment', description: 'Manage set-top boxes and IPTV hardware', status: 'planned' },
          { id: 'fib-suspend', title: 'Suspend Service', description: 'Temporarily suspend a fixed service', status: 'planned' },
          { id: 'fib-resume', title: 'Resume Service', description: 'Reactivate a suspended fixed service', status: 'planned' },
          { id: 'fib-terminate', title: 'Terminate Service', description: 'Close and terminate a fixed contract', status: 'planned' },
        ],
      },
      {
        key: 'customer-account',
        label: 'Customer & Account',
        heading: 'Customer & Account',
        description: 'Validate identity, update customer details, and manage service ownership.',
        icon: CAT_ICONS.customerOwnership,
        journeys: [
          { id: 'fib-customer-validation', title: 'Customer Validation', description: "Validate a customer's identity and QID", status: 'available', featureKey: 'identity.passport-to-qid', screenId: 'SCR-151' },
          { id: 'fib-contact-update', title: 'Contact Information Update', description: 'Update email, address, or phone details', status: 'partly', featureKey: 'workspace.customer360-view', path: '/customer-search' },
          { id: 'fib-ownership-change', title: 'Ownership Change', description: 'Transfer service ownership to another person', status: 'planned', featureKey: 'numbers.ton-wizard', screenId: 'SCR-035' },
          { id: 'fib-authorised-rep', title: 'Authorised Representative', description: 'Add or manage an authorised representative', status: 'planned' },
        ],
      },
      {
        key: 'support-requests',
        label: 'Support & Requests',
        heading: 'Support & Requests',
        description: 'Create and track tickets, fault reports, installation issues, complaints, and escalations.',
        icon: CAT_ICONS.support,
        journeys: [
          { id: 'fib-create-ticket', title: 'Create Ticket', description: 'Raise a new support or fault ticket', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'fib-track-ticket', title: 'Track Ticket', description: 'Find and review an existing ticket', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'fib-connectivity-issue', title: 'Report Connectivity Issue', description: 'Log a broadband or voice connectivity fault', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'fib-install-issue', title: 'Report Installation Issue', description: 'Escalate a problem with a field installation', status: 'planned' },
          { id: 'fib-complaint', title: 'Complaint', description: 'Log a formal customer complaint', status: 'available', featureKey: 'tickets.dashboard', screenId: 'SCR-211' },
          { id: 'fib-escalation', title: 'Escalation', description: 'Escalate an unresolved ticket to a senior team', status: 'planned' },
        ],
      },
    ],
  },
];

export const PRODUCT_LINE_BY_KEY = new Map(PRODUCT_LINES.map((l) => [l.key, l]));

/** Journeys in this category visible to a role, given a grant predicate.
 *
 * Takes the predicate rather than importing personaEngine so this file stays
 * pure data + selectors, and so both the sidebar (navigationEngine) and the
 * page (ProductLinePage) filter through exactly the same rule. They diverged
 * once - the page hid empty categories while the rail still listed all five,
 * so a role could click a sub-menu item and land on someone else's content. */
export function visibleJourneys(
  category: JourneyCategory,
  canUse: (featureKey: string) => boolean
): Journey[] {
  const gated = category.journeys.filter((j) => j.featureKey);
  // A category whose every journey is roadmap-only (Equipment & Installation
  // today) has nothing to gate on. Returning [] there hid the whole category
  // from every role, which is wrong: it is a real part of the IA that simply
  // isn't built yet, and the roadmap rule below already says such journeys
  // should stay visible.
  if (gated.length === 0) return category.journeys;
  const granted = gated.filter((j) => canUse(j.featureKey!));
  if (granted.length === 0) return [];
  // Roadmap-only journeys (no featureKey) ride along with the category.
  return category.journeys.filter((j) => !j.featureKey || granted.includes(j));
}

/** Categories in this line the role can reach.
 *
 * A gated category needs at least one granted journey. A roadmap-only category
 * rides along with the line - the same rule as a roadmap journey within a
 * category, one level up - but only if the role reaches the line at all, so a
 * role with no business in Mobile doesn't inherit Mobile's roadmap. */
export function reachableCategories(
  lineKey: ProductLine['key'],
  canUse: (featureKey: string) => boolean
): JourneyCategory[] {
  const line = PRODUCT_LINE_BY_KEY.get(lineKey);
  if (!line) return [];
  const isGated = (c: JourneyCategory) => c.journeys.some((j) => j.featureKey);
  const reachableGated = line.categories.filter((c) => isGated(c) && visibleJourneys(c, canUse).length > 0);
  if (reachableGated.length === 0) return [];
  return line.categories.filter((c) => reachableGated.includes(c) || !isGated(c));
}

/** What the catalogue is checked against. Passed in, so this file stays pure data + selectors and the same check runs
 * in the test suite (against the source) and could run at start-up (against the live registries). */
export interface JourneyCatalogueEnv {
  /** Feature keys in feature-catalogue.json. */
  featureKeys: ReadonlySet<string>;
  /** screenId -> URL path, from routes.json (undefined when the screen is not catalogued). */
  screenPath: (screenId: string) => string | undefined;
  /** Is there a real screen behind this id (a registerScreen() call), not the "not yet built" panel? */
  isScreenBuilt: (screenId: string) => boolean;
  /** Does the router mount a page at this path? */
  isKnownPath: (path: string) => boolean;
}

/** Problems that would make a journey card lie: returns one message each, empty when the catalogue is sound.
 *
 * - ids are unique, category keys are unique within a line;
 * - a featureKey exists in the feature catalogue (a typo would hide the journey from every role);
 * - a screenId is in routes.json, and a path is one the router serves;
 * - an 'available' journey leads somewhere that works: a built screen, or a served path. */
export function validateJourneyCatalogue(env: JourneyCatalogueEnv, lines: readonly ProductLine[] = PRODUCT_LINES): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();
  for (const line of lines) {
    const seenKeys = new Set<string>();
    for (const category of line.categories) {
      if (seenKeys.has(category.key)) problems.push(`${line.key}: duplicate category key "${category.key}"`);
      seenKeys.add(category.key);
      for (const j of category.journeys) {
        const where = `${line.key}/${category.key}/${j.id}`;
        if (seenIds.has(j.id)) problems.push(`${where}: duplicate journey id`);
        seenIds.add(j.id);
        if (j.featureKey && !env.featureKeys.has(j.featureKey)) problems.push(`${where}: unknown featureKey "${j.featureKey}"`);
        if (j.screenId && env.screenPath(j.screenId) === undefined) problems.push(`${where}: screenId ${j.screenId} is not in routes.json`);
        if (j.path && !env.isKnownPath(j.path)) problems.push(`${where}: path ${j.path} is not served by the router`);
        if (j.status === 'available') {
          const works = j.screenId ? env.isScreenBuilt(j.screenId) : Boolean(j.path);
          if (!works) problems.push(`${where}: marked available but ${j.screenId ? `screen ${j.screenId} is not built` : 'it has no screenId or path'}`);
        }
      }
    }
  }
  return problems;
}

import * as mockDataEngine from '../engines/mockDataEngine';
import { isBusinessSegment } from '../engines/businessSegment';
import { getAllRoutes } from '../engines/configEngine';
import { existingCustomerPath } from './journeyPaths';
import { mobileMatches, purposeOfVisit, JOURNEY_LAUNCH_SCREENS } from '../engines/qnomyQueueEngine';
import { type AccountRecord, type CustomerRecord } from '../engines/customer360Engine';
import { groupServicesByCategory, listCustomerServices, type ServiceSources } from '../engines/customerServicesEngine';
import type { ToastBrand, ToastKind, ToastOptions, ToastRow, ToastServiceLink } from '../stores/notificationStore';

export interface QTicketRecord {
  qTicketId: string;
  kioskMobileNumber: string | null;
  customerId: string | null;
  journeyCode: string | null;
  queueName: string | null;
  generatedAt: string;
  status: string;
  agentInDxpSessionId: string | null;
  /** Per-ticket purpose refinement - see purposeOfVisit()'s own note. */
  taskType?: string | null;
}

export interface TroubleTicketRecord {
  ticketId: string;
  customerId: string;
  category: string;
  createdAt: string;
}

// Everything the notification says about WHO is at the counter: which
// operator they belong to, their relationship on this number, and how many
// lines they hold.
//
// Resolved from the KIOSK-ENTERED MOBILE NUMBER, not the ticket's customerId,
// per the 2026-09-25 direction ("determined based on the customer number
// received from Qnomy"). That is also the honest source: the kiosk only knows
// what the walk-in typed, and matching it is the step that decides whether
// this is a Vodafone customer at all. It reuses the same mobileMatches() the
// assignment path already resolves identity with, so the mark can never
// disagree with the record the agent is shown.
//
// One resolution returns BOTH facts, so the operator mark and the Active lines
// row cannot end up describing different people.
//
// Yields operator 'other' - the Other Operator mark - for a number with no Vodafone
// record. Reachable with the current seed: QTK-7006 carries +97455519999 and a
// null customerId, which matches nobody in customers.json.
export interface KioskCustomerFacts {
  brand: ToastBrand;
  /** One link per service CATEGORY the customer holds. Empty for none. */
  links: ToastServiceLink[];
  /**
   * Total services across those categories. Carried explicitly rather than
   * summed back out of the link labels - those are formatted display strings
   * ("Postpaid (2)"), and re-parsing a number out of presentation text is a
   * dependency on the wording that would break the moment it changed.
   */
  serviceCount: number;
  /** The number belongs to a customer in a protected segment this role may not see: nothing about them is carried (see factsForKioskNumber). */
  restricted?: true;
}

// The Active lines row. The COUNT lives in the label - "Active lines (4)" -
// so the value cell holds the breakdown alone rather than a number with a
// list hanging under it, which read as two separate values stacked in one
// cell.
//
// Three link-less shapes, each a different claim and none of them "0":
//
//   - (omitted)        - a competitor's customer. The question does not apply
//     to them, so there is no column at all.
//   - 'None'           - a Vodafone customer who genuinely holds nothing.
//   - 'Not recorded'   - facts never resolved, so nothing is known either way.
function activeLinesRow(facts: KioskCustomerFacts | undefined): ToastRow | undefined {
  if (!facts) return { label: 'Active Lines', value: 'Not recorded' };
  // A competitor's customer has no Vodafone lines to report, so the column is omitted rather than shown as 'Not applicable'.
  if (facts.brand.operator === 'other') return undefined;
  if (facts.serviceCount === 0) return { label: 'Active Lines', value: 'None' };
  // Empty value, not a repeat of the count: it is in the label now.
  // The count is SERVICES, not category rows: facts.links.length would have
  // read "Active lines (2)" for a customer holding four services across two
  // categories.
  return { label: `Active lines (${facts.serviceCount})`, value: '', links: facts.links };
}

export function factsForKioskNumber(
  mobile: string | null,
  customers: CustomerRecord[],
  sources: ServiceSources,
  /** Whether the signed-in role may see a customer of this segment; a protected customer's facts are replaced by a bare `restricted` marker. */
  canView: (segment: string | undefined) => boolean = () => true
): KioskCustomerFacts {
  const matched = mobile ? customers.find((c) => mobileMatches(mobile, c.phone)) : undefined;
  if (matched && !canView(matched.segment)) return { brand: { operator: 'other' }, links: [], serviceCount: 0, restricted: true };
  if (!matched) {
    // Not "None": a competitor's customer does not hold zero Vodafone
    // services, the question does not apply to them. Zero is a different
    // claim.
    return { brand: { operator: 'other' }, links: [], serviceCount: 0 };
  }

  // The customer's WHOLE relationship, not their mobile lines - mobile,
  // GigaHome, OSNtv, IPTV, smart devices, installed services. This replaced
  // activePostpaidLines + activePrepaidLines, which are mobile-only and so
  // reported "None" for CUST-1003 (active GigaHome) and CUST-1004 (GigaHome
  // plus a smart plug).
  //
  // The count shown is the length of this list, so the figure and the
  // breakdown can never disagree. The mobile part of it matches the two count
  // fields on the customer record: every line they declare has an installed
  // asset on an account of the matching type (build_customer_inventory.py
  // --seed, seed_mobile_lines), and verify_customer_inventory_sync.py checks
  // it. (Before 2026-10-11 CUST-1005 carried 4 lines by count but listed 1.)
  const services = listCustomerServices(matched, sources);
  // GROUPED BY CATEGORY as of 2026-09-25, not one row per service. Four
  // identifiers under a count told the agent what the services ARE called,
  // which is not a question they have at the moment of greeting; the shape of
  // the relationship is. "Postpaid (2), GigaHome Fibre (1)" answers that in
  // one glance where "+97455512001 / SVC-30011 / GHO-15001 / IPTV-2001" did
  // not.
  const groups = groupServicesByCategory(services);
  return {
    brand: { operator: 'vodafone', segment: segmentOf(matched), relationship: relationshipOf(matched) },
    serviceCount: services.length,
    links: groups.map((group) => ({
      label: `${group.category} (${group.count})`,
      customerId: matched.customerId,
      tab: group.tab,
      // No serviceRef: a category opens its tab, it does not select one
      // service. Customer360Layout leaves nothing highlighted, which is right
      // - the agent asked for the category, not a row in it.
      note: `${group.count} ${group.count === 1 ? 'service' : 'services'}`,
    })),
  };
}

// Resolves a journey code to the route its screen lives at, or undefined when
// the code has no mapped screen or the screen is not in routes.json.
/**
 * Where a queue ticket's purpose of visit launches, for this customer. A purpose that opens the New Connection
 * journey goes to the Existing Customer flow when the walk-in IS a Vodafone customer on file (their record is
 * resolved), and to the New Customer flow when they are not. Every launch is a fresh start.
 */
export function launchTargetFor(journeyCode: string | null, customerId: string | null): { to: string; state: Record<string, unknown> } | undefined {
  const to = launchPathFor(journeyCode);
  if (!to) return undefined;
  const opensNewConnection = Boolean(journeyCode) && JOURNEY_LAUNCH_SCREENS[journeyCode!] === 'SCR-037';
  return { to: opensNewConnection && customerId ? existingCustomerPath(customerId) : to, state: { startFresh: true } };
}

export function launchPathFor(journeyCode: string | null): string | undefined {
  if (!journeyCode) return undefined;
  const screenId = JOURNEY_LAUNCH_SCREENS[journeyCode];
  if (!screenId) return undefined;
  return getAllRoutes().find((r) => r.screenId === screenId)?.path;
}

// The four datasets the service inventory needs beyond `customers`. Bundled
// into one helper because both entry points - the queue assignment and the
// info-icon reopen - need exactly the same set, and listing them twice is how
// the two would come to disagree about what counts as a service.
export function loadServiceSources(): Promise<ServiceSources> {
  return Promise.all([
    mockDataEngine.list<AccountRecord>('accounts'),
    mockDataEngine.list<Record<string, unknown>>('installed-assets'),
    mockDataEngine.list<Record<string, unknown>>('gigahome-osntv-subscriptions'),
    mockDataEngine.list<Record<string, unknown>>('iptv-stb-bundles'),
    mockDataEngine.list<Record<string, unknown>>('smart-devices'),
  ]).then(([accounts, installedAssets, gigahome, iptvBundles, smartDevices]) => ({
    accounts,
    installedAssets,
    gigahome,
    iptvBundles,
    smartDevices,
  }));
}

// Consumer or Business, collapsed from customers.json's three segment values:
// 'Consumer', 'Consumer (HRN)' and 'Enterprise (EBU)'.
//
// HRN stays CONSUMER on purpose. It is a risk classification layered on top
// of a consumer account - it drives an advance payment, not a different line
// of business - and the Eligibility step already reports it in its own row.
// Folding it into "Business" would misfile a consumer as an enterprise.
//
// Anything unrecognised returns undefined rather than defaulting to Consumer,
// so a new segment value surfaces as a missing label instead of being
// silently filed as the commoner of the two.
function segmentOf(customer: CustomerRecord): string | undefined {
  const segment = customer.segment ?? '';
  if (isBusinessSegment(segment)) return 'Business';
  if (/consumer/i.test(segment)) return 'Consumer';
  return undefined;
}

// Prepaid or Postpaid for THE NUMBER Qnomy handed over - never both.
//
// Reads `lineType`, which describes the single line `phone` identifies, and
// NOT activePostpaidLines/activePrepaidLines. Those are counts across the
// whole customer, so they cannot answer the question this notification asks:
// a customer holding lines of both kinds made them report "Prepaid +
// Postpaid", which is a fact about the customer and not about the walk-in's
// number. Reading one field rather than comparing two also means "both" is
// now unrepresentable rather than merely unreached.
//
// `undefined` when the customer has no line, which is a REAL state: four of
// the eight seeded customers are registered with none, and CUST-1004 is the
// one queued for a new postpaid connection. Defaulting those to either value
// would put a relationship on screen that the customer does not have.
function relationshipOf(customer: CustomerRecord): string | undefined {
  return customer.lineType;
}

// The facts an agent reads off the ticket, built in ONE place.
//
// Three call sites want them: the two assignment toasts and the header's info
// button, which re-shows the notification after it has been dismissed. Three
// inline copies would drift, and the one most likely to drift is the re-show -
// the copy nobody looks at until a customer is standing at the counter.
//
// "Customer status" ("Existing registered customer" / "New customer") was
// removed on 2026-09-25. The operator mark on the header line now carries the
// same distinction and carries it better: a Vodafone mark IS "existing
// registered", and the Other Operator mark says "not ours" more directly than the
// word "New" did. Keeping both put the same fact on screen twice, in two
// vocabularies, one of which called a competitor's customer "New".
//
// With no name to show, the fallback is chosen by the OPERATOR, not merely by
// the name being absent - the two are not the same condition, and conflating
// them would mislabel people. `brand` comes from resolving the kiosk number,
// while `customerName` can be null for a Vodafone customer whose record
// simply is not loaded: the info-icon reopen reads the active customer store,
// which Finish clears. Keying "Unknown Customer" off a missing name would
// therefore have relabelled a Vodafone walk-in as a competitor's customer the
// moment the agent reopened the notification.
//
//   - no name, operator 'other'    -> "Unknown Customer" (2026-09-25)
//   - no name, operator 'vodafone' -> "Not on file", as before
function ticketToastRows(
  ticket: QTicketRecord,
  customerName: string | null,
  customerId: string | null,
  mobile: string | null,
  facts: KioskCustomerFacts | undefined
): ToastRow[] {
  // A protected-segment customer this role may not see: the notification names no one, shows no number or services, and launches nothing.
  if (facts?.restricted) {
    // Just the neutral name: no 'Access restricted' row, and no link or launch, so nothing the role cannot do is offered or announced.
    return [{ label: 'Customer Name', value: 'Restricted customer' }];
  }
  const launchTarget = launchTargetFor(ticket.journeyCode, customerId);
  const activeLines = activeLinesRow(facts);
  return [
    // "Ticket number" is no longer a row (2026-09-25): the id moved into the
    // headline, where it names the notification rather than sitting as the
    // first of five equal-weight facts. It keeps its 'id' tone nowhere now,
    // so the cyan value treatment only appears if another row asks for it.
    {
      label: 'Customer Name',
      value: customerName ?? (facts?.brand.operator === 'other' ? 'Unknown Customer' : 'Not on file'),
      // Clicking the name opens Customer 360 (2026-09-27) - same `to`
      // mechanism "Purpose of visit" already uses below, so a customer row
      // and a journey row are actionable the same way rather than two
      // different link conventions on one toast. Only when there IS a
      // customer: "Unknown Customer" and "Not on file" both mean no record
      // exists to open, so neither gets a link.
      to: customerId ? `/customer/${customerId}` : undefined,
    },
    {
      label: 'Mobile Number',
      value: mobile ?? 'Not captured',
      // The relationship on THIS number, in brackets beneath it (2026-09-25).
      // Absent rather than guessed for a competitor's customer and for a
      // Vodafone customer with no active line - neither has a prepaid or
      // postpaid standing on this number to state.
      sub: facts?.brand.relationship ? `(${facts.brand.relationship})` : undefined,
    },
    ...(activeLines ? [activeLines] : []),
    {
      label: 'Purpose of Visit',
      // The journey the kiosk code stands for, not the queue the customer is
      // queuing in - refined by the ticket's own taskType when it carries
      // one (2026-09-27), the same derivation the Ticket History page uses,
      // so a ticket cannot read one purpose here and a different one there.
      value: purposeOfVisit(ticket),
      // Clicking the purpose LAUNCHES it (2026-09-25), so the agent starts the
      // journey from the greeting rather than re-finding it in the nav.
      //
      // Undefined for a purpose with no mapped screen, which leaves the value
      // as plain text - see JOURNEY_LAUNCH_SCREENS for why only J011 is
      // mapped. Resolved here rather than stored as a screen id because the
      // notification store holds no engine lookups.
      //
      // The active customer is deliberately NOT cleared first, unlike
      // SalesWorkspace's blank-start acquisition buttons: the queue has
      // already put this walk-in in the bridge, and the wizard prefilling
      // with the person standing at the counter is the entire point.
      to: launchTarget?.to,
      state: launchTarget?.state,
    },
  ];
}

// The whole notification, not just its rows: kind, headline and key together.
//
// Both entry points - the queue assigning a ticket, and the header info icon
// reopening it - call this, so they cannot drift. They previously built the
// kind separately and disagreed: an assignment for a customer on file was
// 'success' (green dot) while the reopen was always 'info' (grey), so the
// same notification looked like two different ones.
//
// The key is the ticket, so reopening REPLACES the notification rather than
// pushing another. Without it, four clicks of the info icon meant four
// stacked toasts and four unread items in the bell.
export function ticketToast(
  ticket: QTicketRecord,
  customerName: string | null,
  customerId: string | null,
  mobile: string | null,
  facts: KioskCustomerFacts | undefined
): [ToastKind, string, ToastOptions] {
  return [
    customerName ? 'success' : 'info',
    // The ticket id is IN the headline as of 2026-09-25, replacing "New ticket
    // assigned" and the Ticket number row both. The structured header renders
    // uppercase and tracked, which is left as-is: it is the shared treatment
    // for every structured toast, and the id is uppercase already, so only its
    // letter-spacing changes.
    //
    // The id goes in `reference`, NOT interpolated into this string, so it can
    // keep the colour it had as a `tone: 'id'` row. Interpolating it is exactly
    // what made it plain white when it first moved up here.
    'Assigned Ticket Number:',
    {
      rows: ticketToastRows(ticket, customerName, customerId, mobile, facts),
      key: `qticket-${ticket.qTicketId}`,
      // A restricted customer's facts carry a placeholder 'other' brand, which the toast would draw as Other Operator - show no operator mark.
      brand: facts?.restricted ? undefined : facts?.brand,
      reference: ticket.qTicketId,
    },
  ];
}

export function mostRecentFor<T extends { customerId: string }>(records: T[], customerId: string, dateField: keyof T): T | undefined {
  return records
    .filter((r) => r.customerId === customerId)
    .sort((a, b) => String(a[dateField]).localeCompare(String(b[dateField])))
    .at(-1);
}

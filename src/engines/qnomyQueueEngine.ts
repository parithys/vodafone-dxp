import { getPersona } from './configEngine';

// Which Qnomy queues a role may be handed a ticket from.
//
// `journeyCode` is the queue dimension already present on qtickets.json (J011
// is the Mobile Postpaid Activation journey named on the BRSD's J011 slide), so
// "the relevant queue" is keyed to evidenced data rather than a new field
// invented for it. Two further codes were seeded so the distinction is
// demonstrable - with a single queue, "relevant" is unfalsifiable.
//
// Role -> queues is derived from the persona's GROUP, which already exists,
// rather than a per-role table that would need editing for all 26 roles:
//
//   Sales & Acquisition            -> J011  new connections / activations
//   Customer Service & Retention   -> J020  care and complaints
//   Billing, Credit & Collections  -> J030  billing and payments
//   Management, Approval & Gov.    -> all   oversight roles cover the floor
//
// Only roles whose contextCard is 'Queue Number + Ticket Number' (plus
// oversight) ever see the control at all - see canSeeQnomyTicketNumber - so
// this is about WHICH queue, not WHETHER.

export const QUEUE_LABELS: Record<string, string> = {
  J011: 'New Connections',
  J020: 'Care & Complaints',
  J030: 'Billing & Payments',
};

// What the customer is at the counter FOR, as opposed to which queue they are
// standing in. QUEUE_LABELS above answers "which queue" ("New Connections");
// this answers "why" ("New Postpaid Connection").
//
// Both are needed because they are different questions and the ticket only
// carries the code. The labels are the app's own journey names, not invented:
// J011 is the Mobile Postpaid Activation journey named on the BRSD's J011
// slide (see the note at the top of this file), and "New Postpaid Connection"
// is exactly what journeyCatalogue.ts titles that journey.
//
// Unknown codes fall back to the queue label at the call site rather than
// guessing a purpose.
export const JOURNEY_PURPOSE_LABELS: Record<string, string> = {
  J011: 'New Postpaid Connection',
  J020: 'Care & Complaint',
  J030: 'Billing & Payment',
};

// The screen a purpose LAUNCHES, so the agent can start the journey straight
// from the assignment notification instead of re-finding it in the nav.
//
// Keyed by screenId rather than by path, matching SalesWorkspace: SCR-037 is
// filed under the sim-number-management module route in routes.json despite
// being the Mobile Postpaid wizard, so resolving it avoids baking in that
// quirk. The caller looks the path up via getAllRoutes().
//
// ONLY J011 IS MAPPED, deliberately. Its label is literally the title of a
// built, registered journey (SCR-037, the postpaid wizard; no longer listed as
// its own card in journeyCatalogue.ts), so the destination is evidenced rather
// than chosen.
// J020 "Care & Complaint" and J030 "Billing & Payment" name QUEUES, not
// journeys - there is no one screen either obviously means, and picking one
// would send an agent somewhere plausible but wrong. A purpose with no entry
// here is simply not a link.
export const JOURNEY_LAUNCH_SCREENS: Record<string, string> = {
  J011: 'SCR-037',
};

/**
 * What the customer is at the counter FOR, on a specific ticket - the single
 * place both the assignment notification and the Ticket History page derive
 * this from, so a ticket cannot read one purpose live and a different one in
 * history.
 *
 * `taskType` is a per-TICKET refinement, added 2026-09-27 for Ticket History:
 * a Care & Complaints ticket can be a technical issue or a service request
 * without that needing a new queue, so it takes priority over the QUEUE-level
 * label when a ticket carries one. Most tickets don't - the fallback to
 * JOURNEY_PURPOSE_LABELS is exactly the pre-existing behaviour, unchanged. See
 * qtickets.json's own note on why this taxonomy is a demo convenience, not an
 * evidenced Qnomy vocabulary.
 */
export function purposeOfVisit(ticket: {
  journeyCode: string | null;
  taskType?: string | null;
  queueName: string | null;
}): string {
  return (
    ticket.taskType ??
    (ticket.journeyCode ? JOURNEY_PURPOSE_LABELS[ticket.journeyCode] : undefined) ??
    ticket.queueName ??
    'Not recorded'
  );
}

const GROUP_QUEUES: Record<string, string[]> = {
  'Sales & Acquisition': ['J011'],
  'Customer Service & Retention': ['J020'],
  'Billing, Credit & Collections': ['J030'],
};

const ALL_QUEUES = Object.keys(QUEUE_LABELS);

/** The journey codes this role may be served from. An oversight role, or a
 * group with no explicit mapping, gets the whole floor rather than nothing -
 * handing a supervisor an empty queue would read as a broken queue rather
 * than as a scoping decision. */
export function queuesForRole(personaId: string | undefined): string[] {
  const persona = personaId ? getPersona(personaId) : undefined;
  if (!persona) return ALL_QUEUES;
  if (persona.capabilities.includes('agent-oversight')) return ALL_QUEUES;
  return GROUP_QUEUES[persona.group] ?? ALL_QUEUES;
}

export function queueLabelsForRole(personaId: string | undefined): string {
  return queuesForRole(personaId)
    .map((c) => QUEUE_LABELS[c] ?? c)
    .join(' · ');
}

export interface QueueTicket {
  qTicketId: string;
  kioskMobileNumber: string | null;
  customerId: string | null;
  journeyCode: string | null;
  queueName: string | null;
  status: string;
  generatedAt: string;
  branch?: string | null;
  counterNumber?: string | null;
}

/**
 * DEMO SWITCH (2026-10-27): when true, the walk-in queue serves Unknown customers only - a ticket counts, is called and is issued
 * only if its kiosk number is NOT a customer on file (the same test `factsForKioskNumber` uses to call someone Other Operator's). Set to
 * false after the demo to restore the full queue (Vodafone and Other Operator walk-ins); nothing else needs undoing.
 */
export const DEMO_UNKNOWN_ONLY_QUEUE = true;

/** Which tickets the queue serves: all of them, or - under the demo switch - only those whose kiosk number matches no customer on file. */
export type TicketScope = (t: { kioskMobileNumber?: string | null }) => boolean;

export function queueScope(customers: { phone?: string }[], unknownOnly = DEMO_UNKNOWN_ONLY_QUEUE): TicketScope {
  if (!unknownOnly) return () => true;
  return (t) => !customers.some((c) => mobileMatches(t.kioskMobileNumber, c.phone));
}

/** Oldest waiting ticket in any queue this role serves. Oldest-first across
 * the role's queues combined, so a role covering several is served strictly in
 * arrival order rather than queue-by-queue. */
export function nextTicketFor<T extends QueueTicket>(
  personaId: string | undefined,
  tickets: T[],
  inScope: TicketScope = () => true
): T | undefined {
  const mine = new Set(queuesForRole(personaId));
  return tickets
    .filter((t) => t.status === 'Waiting' && t.journeyCode && mine.has(t.journeyCode) && inScope(t))
    .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))[0];
}

export function waitingCountFor(personaId: string | undefined, tickets: QueueTicket[], inScope: TicketScope = () => true): number {
  const mine = new Set(queuesForRole(personaId));
  return tickets.filter((t) => t.status === 'Waiting' && t.journeyCode && mine.has(t.journeyCode) && inScope(t)).length;
}

/** Normalises for comparison - a kiosk keypad entry may carry spaces or omit
 * the country code, while customers.json stores full E.164. Compared on the
 * last 8 digits, which is the national subscriber number in Qatar. */
export function mobileMatches(kiosk: string | null | undefined, onFile: string | null | undefined): boolean {
  if (!kiosk || !onFile) return false;
  const digits = (v: string) => v.replace(/\D/g, '');
  const a = digits(kiosk);
  const b = digits(onFile);
  if (!a || !b) return false;
  return a.slice(-8) === b.slice(-8);
}

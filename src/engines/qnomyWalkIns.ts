import * as mockDataEngine from './mockDataEngine';
import { canViewCustomerSegment } from './agentPrivilegeEngine';
import { queuesForRole, waitingCountFor, queueScope, mobileMatches, customerKindDue, ticketKind, DEMO_UNKNOWN_ONLY_QUEUE, QUEUE_CUSTOMER_MODE, QUEUE_LABELS, type CustomerKind, type QueueTicket } from './qnomyQueueEngine';

/**
 * The walk-in queue is never empty. A branch always has someone arriving at a kiosk, so when a role's queue has been worked down to nobody, the
 * kiosk issues the next walk-in: a new Waiting ticket in one of the role's own queues, for a customer on file the role may see (a protected-segment
 * customer is never handed to a role that cannot see them). Under `unknownOnly` (the demo switch) the walk-in is instead an Unknown customer: a
 * kiosk number that matches nobody on file. Pure: returns the ticket to issue, or undefined when someone is already waiting.
 */
export function nextWalkInTicket(
  personaId: string | undefined,
  tickets: (QueueTicket & { kioskMobileNumber: string | null })[],
  customers: { customerId: string; phone?: string; segment?: string }[],
  now = new Date(),
  unknownOnly = false
): Record<string, unknown> | undefined {
  if (waitingCountFor(personaId, tickets, queueScope(customers, unknownOnly)) > 0) return undefined;
  return walkInTicket(personaId, tickets, customers, now, unknownOnly ? 'unknown' : 'existing');
}

/** A walk-in of the given kind, whether or not anyone is waiting (the alternating queue issues the kind whose turn it is). */
export function walkInTicket(
  personaId: string | undefined,
  tickets: (QueueTicket & { kioskMobileNumber: string | null })[],
  customers: { customerId: string; phone?: string; segment?: string }[],
  now: Date,
  kind: CustomerKind
): Record<string, unknown> {
  const unknownOnly = kind === 'unknown';
  const queues = queuesForRole(personaId);
  const journeyCode = queues[tickets.length % queues.length];
  const eligible = unknownOnly ? [] : customers.filter((c) => c.phone && canViewCustomerSegment(personaId, c.segment));
  const customer = eligible.length ? eligible[tickets.length % eligible.length] : undefined;
  // An Other Operator walk-in: a Qatari mobile number that no customer on file holds.
  let unknownNumber: string | null = null;
  if (unknownOnly) {
    for (let n = tickets.length; !unknownNumber; n++) {
      const candidate = `+9746${String(1000000 + ((n * 7919 + now.getTime()) % 9000000)).padStart(7, '0')}`;
      if (!customers.some((c) => mobileMatches(candidate, c.phone))) unknownNumber = candidate;
    }
  }
  return {
    qTicketId: `QTK-W${now.getTime().toString().slice(-8)}`,
    kioskMobileNumber: unknownNumber ?? customer?.phone ?? null,
    customerId: customer?.customerId ?? null,
    orderId: null,
    journeyCode,
    queueName: QUEUE_LABELS[journeyCode] ?? journeyCode,
    generatedInSystem: 'Qnomy',
    generatedAt: now.toISOString(),
    branch: 'Doha City Center',
    counterNumber: null,
    status: 'Waiting',
    agentInDxpSessionId: null,
    handledByUserId: null,
    releasedAt: null,
    taskType: null,
  };
}

let inFlight: Promise<void> | undefined;

/** Issues a walk-in when the role's queue is empty (see nextWalkInTicket). One at a time, so two screens asking together issue one ticket. */
export function ensureWalkInWaiting(personaId: string | undefined): Promise<void> {
  inFlight ??= (async () => {
    const [tickets, customers] = await Promise.all([
      mockDataEngine.list<QueueTicket & { kioskMobileNumber: string | null }>('qtickets'),
      mockDataEngine.list<{ customerId: string; phone?: string; segment?: string }>('customers'),
    ]);
    // Alternating queue: an empty queue gets the kind whose turn it is; otherwise the original rule (the full queue, or Unknown only).
    const ticket =
      QUEUE_CUSTOMER_MODE === 'alternate'
        ? waitingCountFor(personaId, tickets) > 0
          ? undefined
          : walkInTicket(personaId, tickets, customers, new Date(), customerKindDue(tickets, customers))
        : nextWalkInTicket(personaId, tickets, customers, new Date(), DEMO_UNKNOWN_ONLY_QUEUE);
    if (ticket) await mockDataEngine.create('qtickets', ticket);
  })().finally(() => {
    inFlight = undefined;
  });
  return inFlight;
}

/**
 * Alternating queue: makes sure a ticket of `kind` is waiting in the role's queues, issuing one at the kiosk when none is. Next Customer calls this for
 * the kind whose turn it is, so Existing and Unknown customers really alternate however the seeded queue happens to be mixed.
 */
export async function ensureKindWaiting(personaId: string | undefined, kind: CustomerKind): Promise<void> {
  const [tickets, customers] = await Promise.all([
    mockDataEngine.list<QueueTicket & { kioskMobileNumber: string | null }>('qtickets'),
    mockDataEngine.list<{ customerId: string; phone?: string; segment?: string }>('customers'),
  ]);
  const mine = new Set(queuesForRole(personaId));
  if (tickets.some((t) => t.status === 'Waiting' && t.journeyCode && mine.has(t.journeyCode) && ticketKind(t, customers) === kind)) return;
  await mockDataEngine.create('qtickets', walkInTicket(personaId, tickets, customers, new Date(), kind));
}

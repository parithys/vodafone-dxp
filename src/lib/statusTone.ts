/**
 * Status text -> colour, defined once. Every table, pill and header that shows a status (orders, tasks, tickets, leads,
 * bulk jobs, billing, Customer 360, Telesales) asks here, so "Open" is the same colour on every screen.
 *
 * The mapping is by meaning: done/good = green, stopped/bad = red, waiting/in motion = amber, new/informational = blue,
 * anything else = neutral grey. Add a word to the matching list rather than writing a local map.
 */
export type Tone = 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'grey';

export function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (/^(active|completed|complete|resolved|paid|eligible|yes|enabled|verified|whitelisted|clear|allowed|closed - won|default|solved|closed|available|done|accepted|processed|lead converted|converted)$/.test(s)) return 'green';
  if (/(suspend|cancel|reject|overdue|unpaid|critical|high|lost|failed|not eligible|blocked|blacklisted|breach|error)/.test(s)) return 'red';
  if (/(progress|pending|medium|at risk|warning|expir|stage|draft|submitted|escalate|not solved|abandon|partial|processing|offered)/.test(s)) return 'amber';
  if (/(open|low|new|info|assigned)/.test(s)) return 'blue';
  return 'grey';
}

/** The Badge variant for a status, for places that render a plain <Badge>. */
export type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'filled-neutral';

const BADGE: Record<Tone, StatusBadgeVariant> = {
  green: 'success',
  red: 'danger',
  amber: 'warning',
  blue: 'info',
  purple: 'info',
  grey: 'filled-neutral',
};

export const badgeVariantFor = (status: string | undefined | null): StatusBadgeVariant => BADGE[toneFor(String(status ?? ''))];

/**
 * Ticket lifecycle, defined once.
 *  - isClosedTicket: nothing left for the agent to do (Solved, Completed, Closed, Cancelled) - what "open tickets" counts
 *    and what stops a ticket from being "overdue" on screen.
 *  - isSlaStopped: the SLA clock has stopped (Closed or Cancelled only). A Solved/Completed ticket still waits on its
 *    closing step, so its SLA keeps running until then.
 */
const CLOSED_TICKET = new Set(['Solved', 'Completed', 'Closed', 'Cancelled']);
export const isClosedTicket = (status: unknown): boolean => CLOSED_TICKET.has(String(status ?? ''));
export const isSlaStopped = (status: unknown): boolean => status === 'Closed' || status === 'Cancelled';

/**
 * Order lifecycle, defined once: where an order is in its life, from its status string.
 *  - 'cancelled': Cancelled, Rejected (incl. "Rejected - Correction"), Dropped.
 *  - 'completed': Complete / Completed, Approved/Completed, Migrated to Prepaid.
 *  - 'progress': everything else - Draft, Open, Pending, Submitted for Approval.
 * Customer 360's order lists and the dashboard's fulfilment queue use this, not their own string tests.
 */
export type OrderBucket = 'progress' | 'completed' | 'cancelled';
export function orderBucket(status: unknown): OrderBucket {
  const s = String(status ?? '');
  if (/cancel|reject|dropped/i.test(s)) return 'cancelled';
  if (/^(complete|completed|approved\/completed|migrated to prepaid)$/i.test(s)) return 'completed';
  return 'progress';
}

/**
 * Transfer of Ownership: a case is pending while it is 'created' - not yet completed and not yet ended by migrating the line to prepaid (both
 * are outcomes, as the order lifecycle above reads them). Customer 360's Account Information and Orders tabs use this one reading.
 */
export const isTonPending = (status: unknown): boolean => /^created$/i.test(String(status ?? ''));

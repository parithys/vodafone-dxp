// The walk-in queue is never empty: a role whose queue has been worked down is issued the next walk-in, in a queue it serves, for a customer it may see.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let w, q;
before(async () => {
  await boot();
  w = await load('/src/engines/qnomyWalkIns.ts');
  q = await load('/src/engines/qnomyQueueEngine.ts');
});
after(close);
const rd = (n) => JSON.parse(fs.readFileSync(new URL(`../public/mock-data/${n}.json`, import.meta.url), 'utf8'));
const customers = rd('customers');

test('someone already waiting: nothing is issued', () => {
  const tickets = rd('qtickets');
  assert.ok(q.waitingCountFor(undefined, tickets) > 0);
  assert.equal(w.nextWalkInTicket(undefined, tickets, customers), undefined);
});

test('queue emptied: a Waiting ticket is issued in a queue the role serves, and the count is then at least 1 - for every role', () => {
  const cfg = JSON.parse(fs.readFileSync(new URL('../public/config/personas.json', import.meta.url), 'utf8'));
  const list = cfg;
  assert.ok(list.length >= 26);
  const worked = rd('qtickets').map((t) => ({ ...t, status: t.status === 'Waiting' ? 'Completed' : t.status }));
  for (const p of list) {
    const id = p.id ?? p.personaId;
    assert.equal(q.waitingCountFor(id, worked), 0, id);
    const t = w.nextWalkInTicket(id, worked, customers);
    assert.ok(t, id);
    assert.equal(t.status, 'Waiting');
    assert.ok(q.queuesForRole(id).includes(t.journeyCode), id);
    assert.ok(q.waitingCountFor(id, [...worked, t]) >= 1, id);
  }
});

test('the customer handed over is one the role may see, and the ticket carries their kiosk number', async () => {
  const { canViewCustomerSegment } = await load('/src/engines/agentPrivilegeEngine.ts');
  const worked = rd('qtickets').map((t) => ({ ...t, status: 'Completed' }));
  for (let i = 0; i < 12; i++) {
    const t = w.nextWalkInTicket(undefined, worked.slice(i), customers);
    const c = customers.find((x) => x.customerId === t.customerId);
    assert.ok(c && canViewCustomerSegment(undefined, c.segment));
    assert.equal(t.kioskMobileNumber, c.phone);
  }
});

// Demo switch (DEMO_UNKNOWN_ONLY_QUEUE): the queue serves Unknown customers only. Expected values come from the data, not from the scope.
test('Other Operator-only scope: only tickets whose number is on no customer count, are called, or are issued', () => {
  const all = rd('qtickets').map((t) => ({ ...t, status: 'Waiting' }));
  const onFile = (t) => customers.some((c) => q.mobileMatches(t.kioskMobileNumber, c.phone));
  const scope = q.queueScope(customers, true);
  const expected = all.filter((t) => !onFile(t));
  assert.ok(expected.length > 0 && expected.length < all.length, 'the seed has both kinds');
  assert.equal(all.filter((t) => scope(t)).length, expected.length);
  assert.ok(!onFile(q.nextTicketFor(undefined, all, scope)), 'the ticket called is not a Vodafone customer');
  assert.equal(q.waitingCountFor(undefined, all, scope), expected.length);
  assert.equal(q.waitingCountFor(undefined, all), all.filter((t) => q.queuesForRole(undefined).includes(t.journeyCode)).length, 'switched off: unchanged');
  const vodafoneOnly = all.filter(onFile).map((t) => ({ ...t }));
  const issued = w.nextWalkInTicket(undefined, vodafoneOnly, customers, new Date(), true);
  assert.ok(issued && !onFile(issued) && issued.kioskMobileNumber, 'an empty Other Operator queue is refilled with an Other Operator walk-in');
});

// ---- Alternating queue (QUEUE_CUSTOMER_MODE 'alternate'): Next Customer alternates Existing / Unknown -------------------------------------
test('alternating queue: the turn is the opposite of the last customer called, an Existing Customer first; the call takes the kind due, oldest first, and the kiosk issues one when none waits', async () => {
  const q = await load('/src/engines/qnomyQueueEngine.ts');
  const w = await load('/src/engines/qnomyWalkIns.ts');
  assert.equal(q.QUEUE_CUSTOMER_MODE, 'alternate');
  const customers = [{ customerId: 'C1', phone: '+97455512001', segment: 'Consumer' }, { customerId: 'C2', phone: '+97455512002', segment: 'Consumer' }];
  const mk = (id, mobile, at, extra = {}) => ({ qTicketId: id, kioskMobileNumber: mobile, customerId: null, journeyCode: 'J011', queueName: 'N', status: 'Waiting', generatedAt: at, ...extra });
  const E1 = mk('E1', '+97455512001', '2026-11-01T08:00:00Z');
  const U1 = mk('U1', '+97455519999', '2026-11-01T08:05:00Z');
  const E2 = mk('E2', '+97455512002', '2026-11-01T08:10:00Z');
  assert.equal(q.ticketKind(E1, customers), 'existing');
  assert.equal(q.ticketKind(U1, customers), 'unknown');
  assert.equal(q.customerKindDue([E1, U1, E2], customers), 'existing', 'nobody called yet: an Existing Customer first');
  // Simulate the calls in turn: each is the kind due, the oldest of that kind, and the next turn flips.
  let tickets = [E1, U1, E2];
  const served = [];
  for (let i = 0; i < 4; i++) {
    const due = q.customerKindDue(tickets, customers);
    const next = q.nextTicketFor(undefined, tickets, q.queueScope(customers), (t) => q.ticketKind(t, customers) === due);
    served.push([due, next?.qTicketId]);
    if (!next) break;
    tickets = tickets.map((t) => (t === next ? { ...t, status: 'Fed to Agent-in-DXP', calledAt: `2026-11-01T09:0${i}:00Z` } : t));
  }
  assert.deepEqual(served.map((s) => s[0]), ['existing', 'unknown', 'existing', 'unknown'], 'strictly alternating turns');
  assert.deepEqual(served.slice(0, 3).map((s) => s[1]), ['E1', 'U1', 'E2'], 'the oldest of the kind due each time');
  assert.equal(served[3][1], undefined, 'nothing of the kind due is waiting: Next Customer asks the kiosk for one');
  // The kiosk issues exactly the kind due, so the alternation never breaks.
  const issuedUnknown = w.walkInTicket(undefined, tickets, customers, new Date('2026-11-01T10:00:00Z'), 'unknown');
  assert.equal(q.ticketKind(issuedUnknown, customers), 'unknown');
  const issuedExisting = w.walkInTicket(undefined, tickets, customers, new Date('2026-11-01T10:00:00Z'), 'existing');
  assert.equal(q.ticketKind(issuedExisting, customers), 'existing');
  // With no ticket of the kind due waiting, the oldest of any kind is still called rather than nobody.
  assert.equal(q.nextTicketFor(undefined, [U1], q.queueScope(customers), (t) => q.ticketKind(t, customers) === 'existing')?.qTicketId, 'U1');
});

test('Next Customer stamps when a ticket was called, asks for the kind due, and the walk-in issue follows the mode', () => {
  const src = fs.readFileSync('src/navigation/SessionReferenceNumbers.tsx', 'utf8');
  assert.match(src, /calledAt: new Date\(\)\.toISOString\(\)/);
  assert.match(src, /customerKindDue\(qTickets, customers\)/);
  assert.match(src, /await ensureKindWaiting\(activePersonaId, due\)/);
  assert.match(fs.readFileSync('src/engines/qnomyWalkIns.ts', 'utf8'), /QUEUE_CUSTOMER_MODE === 'alternate'/);
});

test('Next Customer opens an Existing Customer\'s Customer 360 profile; an Unknown Customer, a restricted one and a role without Customer 360 stay on the Dashboard', () => {
  const src = fs.readFileSync('src/navigation/SessionReferenceNumbers.tsx', 'utf8');
  assert.match(src, /navigate\(matched && canUseFeature\(activePersonaId, 'workspace\.customer360-view'\) \? `\/customer\/\$\{matched\.customerId\}` : '\/'\)/);
  // The restricted-segment branch returns early to the Dashboard, before any profile link is built.
  assert.match(src, /if \(matched && !canView\(matched\.segment\)\) \{[\s\S]*?navigate\('\/'\);\s*return;/);
});

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

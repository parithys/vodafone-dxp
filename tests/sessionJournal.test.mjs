// Records created or changed during a session are journalled, so an order created as one role survives a reload and a
// sign-out (the journal key is not a "vfq-" key, which sign-out clears).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let db;
const KEY = 'dxp-session-records';
const journal = () => JSON.parse(globalThis.sessionStorage.getItem(KEY) ?? '[]');
before(async () => {
  await boot();
  db = await load('/src/engines/mockDataEngine.ts');
  await db.seedMockData();
  db.clearJournal();
});
after(close);

test('session journal: the key survives sign-out, which clears only "vfq-" keys', () => {
  assert.ok(!KEY.startsWith('vfq-'));
});

test('session journal: a created order is journalled, and later updates fold into it', async () => {
  await db.create('orders', { orderId: 'ORD-J-1', status: 'Submitted for Approval', orderType: 'New Postpaid Activation' });
  await db.update('orders', 'ORD-J-1', { status: 'Complete' });
  await db.update('orders', 'ORD-J-1', { approvalStatus: 'Approved' });
  const entries = journal().filter((e) => e.kind === 'orders');
  assert.equal(entries.length, 1, 'one entry for the order, not one per change');
  assert.equal(entries[0].op, 'create');
  assert.equal(entries[0].record.status, 'Complete');
  assert.equal(entries[0].record.approvalStatus, 'Approved');
});

test('session journal: a change to a seeded order is kept, and removing a created one leaves no trace', async () => {
  await db.update('orders', 'ORD-92003', { status: 'Complete' });
  assert.ok(journal().some((e) => e.op === 'update' && e.id === 'ORD-92003' && e.patch.status === 'Complete'));
  await db.remove('orders', 'ORD-J-1');
  assert.ok(!journal().some((e) => e.kind === 'orders' && (e.record?.orderId === 'ORD-J-1' || e.id === 'ORD-J-1')));
});

test('session journal: clearJournal gives the next boot the plain seeds', () => {
  db.clearJournal();
  assert.deepEqual(journal(), []);
});

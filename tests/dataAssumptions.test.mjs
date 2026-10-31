import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Rules that read records and decide what they mean, each checked against the WHOLE dataset and an expectation written independently of the code.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rows = (kind) => JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'mock-data', `${kind}.json`), 'utf8'));

let engine, balance, tone, approval, offers, db;
before(async () => {
  await boot();
  engine = await load('/src/engines/customerServicesEngine.ts');
  balance = await load('/src/engines/billingBalance.ts');
  tone = await load('/src/lib/statusTone.ts');
  approval = await load('/src/engines/approvalAuthority.ts');
  offers = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  db = await load('/src/engines/mockDataEngine.ts');
});
after(close);

// ---- an asset's plan --------------------------------------------------------------------------------------------------------
const PLAN_CASES = [
  // name | promotion code | expected plan | why
  ['Postpaid Essential', 'PROD-107', 'PROD-107', 'a catalogue postpaid plan, name and code agree'],
  ['Prepaid Red 25', 'PROD-301', 'PROD-301', 'a catalogue prepaid pack'],
  ['Postpaid Mobile Plan - Red 150', 'PROD-200', undefined, 'a postpaid line whose code is an FWA plan: the code is not its plan'],
  ['Broadband 500Mbps Promotion', 'PROD-100', undefined, 'a broadband service whose code is a postpaid plan'],
  ['SIM Card - Postpaid', 'PROD-201', undefined, 'a postpaid SIM carrying a fixed-line plan code'],
  ['Postpaid Essential', 'PROD-NOPE', 'PROD-107', 'the name finds the plan when the code is unknown'],
  ['Postpaid Essential', undefined, 'PROD-107', 'no code'],
  ['IoT Smart Plug', 'PROD-IOT', undefined, 'a device has no catalogue plan'],
  ['OSNtv Premium', 'PROD-OSN', undefined, 'TV has no catalogue plan'],
  [undefined, undefined, undefined, 'nothing is known'],
];
for (const [name, promotion, expected, why] of PLAN_CASES) {
  test(`planOfAsset(${JSON.stringify(name)}, ${JSON.stringify(promotion)}) is ${expected}: ${why}`, () => {
    assert.equal(engine.planOfAsset({ productServiceName: name, promotion }, rows('products'))?.productId, expected);
  });
}

test('over every asset: a plan is returned only when its type fits the service, and none is missed when the name finds one', () => {
  const products = rows('products');
  const allowed = { Prepaid: ['Prepaid Plan'], Postpaid: ['Postpaid Plan'] };
  let found = 0;
  for (const a of rows('installed-assets')) {
    const { category } = engine.classifyProductName(a.productServiceName);
    const plan = engine.planOfAsset(a, products);
    if (plan) {
      found++;
      assert.ok(plan.name === a.productServiceName || plan.productId === a.promotion, `${a.installedAssetId}: the plan comes from the asset's own name or code`);
      if (allowed[category]) assert.ok(allowed[category].includes(plan.type), `${a.installedAssetId}: a ${category} asset got a ${plan.type}`);
    }
    // false negatives: a catalogue product of the right type with exactly this name must be found
    const byName = products.find((p) => p.name === a.productServiceName && (allowed[category] ?? []).includes(p.type));
    if (byName) assert.equal(plan?.productId, byName.productId, `${a.installedAssetId}: the plan named for the service was missed`);
  }
  assert.ok(found > 100, `most assets have an established plan (${found})`);
});

test('Customer 360 never attaches another plan\'s add-ons to a line through a contradicting promotion code', async () => {
  const c360 = await load('/src/engines/customer360Engine.ts');
  const data = await c360.getCustomer360('CUST-3082');
  const conflicting = data.installedAssets.filter((a) => engine.mobileLineTypeOfName(a.productServiceName) && a.promotion === 'PROD-200');
  assert.ok(conflicting.length >= 19);
  for (const a of conflicting) assert.equal(data.assetPlanIds[a.installedAssetId], undefined);
  assert.ok(data.addonsDiscounts.every((ad) => ad.planId !== 'PROD-200'), 'the FWA plan\'s IPTV and data add-ons are not attached to postpaid mobile lines');
});

// ---- what a customer owes ---------------------------------------------------------------------------------------------------
// Expected, from reading the bills and payments by hand: an invoice (type bill) that is billed or overdue is owed; hot bills and simulations
// are not; only an authorised Monthly Bill payment settles an invoice.
const OWED = { 'CUST-1001': 215.25, 'CUST-1002': 0, 'CUST-1003': 0, 'CUST-1004': 450, 'CUST-2001': 0, 'CUST-3046': 310.5, 'CUST-3081': 1260 };
test('the outstanding balance of every customer with a bill matches the independently written expectation', () => {
  const bills = rows('bills');
  const payments = rows('payments');
  for (const id of new Set(bills.map((b) => b.customerId))) {
    assert.equal(balance.outstandingBalance(bills.filter((b) => b.customerId === id), payments.filter((p) => p.customerId === id)), OWED[id], id);
  }
  assert.deepEqual([...new Set(bills.map((b) => b.customerId))].sort(), Object.keys(OWED).sort(), 'every customer with a bill has an expectation');
});

test('a balance counts issued unsettled invoices only: not a hot bill, a simulation, a pending payment or an order charge', () => {
  const inv = (status, total, type = 'bill') => ({ type, status, totalAmount: total });
  assert.equal(balance.outstandingBalance([inv('billed', 100), inv('overdue', 50)]), 150);
  assert.equal(balance.outstandingBalance([inv('unbilled', 100, 'hotBill'), inv('simulated', 80, 'billSimulation')]), 0);
  assert.equal(balance.outstandingBalance([inv('billed', 100)], [{ chargeType: 'Monthly Bill', status: 'Authorized', amountQar: 40 }]), 60);
  assert.equal(balance.outstandingBalance([inv('billed', 100)], [{ chargeType: 'Monthly Bill', status: 'Pending Authorization', amountQar: 40 }]), 100, 'not collected yet');
  assert.equal(balance.outstandingBalance([inv('billed', 100)], [{ chargeType: 'Deposit', status: 'Authorized', amountQar: 500 }]), 100, 'a deposit does not pay an invoice');
  assert.equal(balance.outstandingBalance([inv('billed', 100)], [{ chargeType: 'Monthly Bill', status: 'Authorized', amountQar: 900 }]), 0, 'never below zero');
  assert.equal(balance.outstandingBalance([{ status: 'billed', totalAmount: 100 }]), 0, 'a record that does not say it is an invoice is not assumed to be one');
  assert.equal(balance.outstandingBalance([]), 0);
});

// ---- statuses ---------------------------------------------------------------------------------------------------------------
test('ticket statuses: a ticket is open unless Solved, Completed, Closed or Cancelled - over every ticket in the data', () => {
  const tickets = rows('trouble-tickets');
  const open = tickets.filter((t) => !tone.isClosedTicket(t.status));
  assert.deepEqual(open.map((t) => t.status).sort(), ['Assigned', 'Assigned', 'Escalate', 'Not Solved', 'Not Solved', 'Not Solved']); // incl. TT-40101, the protected-segment demo ticket
  assert.equal(tickets.length - open.length, 2);
});

test('order lifecycle over every order: cancelled, completed or in progress, and nothing is left out', () => {
  const orders = rows('orders');
  const by = { cancelled: [], completed: [], progress: [] };
  for (const o of orders) by[tone.orderBucket(o.status)].push(o.status);
  assert.deepEqual([...new Set(by.cancelled)].sort(), ['Cancelled', 'Rejected - Correction']);
  assert.deepEqual([...new Set(by.completed)], ['Complete']);
  assert.ok(by.progress.every((s) => ['Submitted for Approval', 'Pending', 'Draft', 'Open'].includes(s)));
  assert.equal(by.cancelled.length + by.completed.length + by.progress.length, orders.length, 'conservation: every order is in exactly one bucket');
  assert.equal(tone.orderBucket(undefined), 'progress');
});

test('a SIM swap awaits a decision under both vocabularies in use, and under no other', () => {
  const statuses = rows('sim-swap-orders').map((s) => s.status);
  assert.deepEqual(statuses.filter((s) => approval.isSimSwapAwaitingDecision(s)), ['Pending Approval']);
  for (const [status, expected] of [['Submitted for Approval', true], ['Pending Approval', true], ['Approved/Completed', false], ['Rejected/Dropped', false], [undefined, false], ['', false]]) {
    assert.equal(approval.isSimSwapAwaitingDecision(status), expected, String(status));
  }
});

// ---- offers -----------------------------------------------------------------------------------------------------------------
test('a fixed-line offer is one for the New Fixed Line journey: 4 of 139, not every Cross Sell offer', () => {
  const all = rows('cross-sales-offers');
  const fixed = all.filter(offers.isFixedLineOffer);
  assert.equal(fixed.length, 4);
  assert.ok(fixed.every((o) => /GigaHome Fiber/.test(o.offerName)));
  assert.ok(all.filter((o) => o.offerType === 'Cross Sell').length > 100, 'most offers are Cross Sell - the old test matched them all');
  assert.equal(offers.isFixedLineOffer({}), false);
});

// ---- the data engine ----------------------------------------------------------------------------------------------------------
test('an update by the record\'s real id field lands, even where the first key ending in "Id" is a foreign key', async () => {
  const [a] = rows('addresses');
  assert.equal(Object.keys(a)[0], 'id');
  const updated = await db.update('addresses', a.id, { zone: 'ZZ' }, 'id');
  assert.equal(updated?.zone, 'ZZ');
  assert.equal((await db.get('addresses', a.id, 'id'))?.zone, 'ZZ');
});

test('every updateRecord(kind, idField, ...) in the source names a real key of that kind\'s records', () => {
  const SRC = path.join(ROOT, 'src');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
  const bad = [];
  for (const f of walk(SRC)) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/updateRecord\(\s*'([a-z0-9-]+)',\s*'([A-Za-z]+)'/g)) {
      const [, kind, field] = m;
      const file = path.join(ROOT, 'public', 'mock-data', `${kind}.json`);
      if (!fs.existsSync(file)) continue;
      const list = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (list.length && !(field in list[0])) bad.push(`${path.relative(ROOT, f)}: updateRecord('${kind}', '${field}')`);
    }
  }
  assert.deepEqual(bad, []);
});

// ---- the entity store -----------------------------------------------------------------------------------------------------------
test('the entity store keeps its cached list and the engine in step: an update of a missing id changes neither, a remove drops it from both', async () => {
  const { useEntityStore } = await load('/src/stores/entityStore.ts');
  const store = useEntityStore.getState();
  await store.loadKind('addresses');
  await store.createRecord('addresses', { id: 'ADDR-GATE', contactId: 'CONT-X', zone: '1' });
  const cached = () => useEntityStore.getState().records.addresses.find((r) => r.id === 'ADDR-GATE');
  assert.equal(cached().zone, '1');
  await store.updateRecord('addresses', 'id', 'ADDR-NOPE', { zone: '999' });
  assert.equal(useEntityStore.getState().records.addresses.some((r) => r.zone === '999'), false, 'no record has that id: the cache must not show a change');
  await store.updateRecord('addresses', 'id', 'ADDR-GATE', { zone: '2' });
  assert.equal(cached().zone, '2');
  assert.equal((await db.get('addresses', 'ADDR-GATE', 'id')).zone, '2', 'and the engine agrees');
  await store.removeRecord('addresses', 'id', 'ADDR-GATE');
  assert.equal(cached(), undefined);
  assert.equal(await db.get('addresses', 'ADDR-GATE', 'id'), undefined);
});

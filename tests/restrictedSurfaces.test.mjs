// The protected-segment restriction on every other surface that lists or opens a customer's records: orders, tickets, tasks, queue tickets, the
// ticket form, the billing account page, the Passport-to-QID check, the dashboard and the Next Customer notification. Expectations come from the
// role table and the seeded records, not from the code under test.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const personas = json('public/config/personas.json');
const customers = json('public/mock-data/customers.json');
const CAP = { Safwa: 'view-safwa-customers', 'Safwa+': 'view-safwa-plus-customers', Royal: 'view-royal-customers' };
const protectedIds = customers.filter((c) => CAP[c.segment]).map((c) => c.customerId);
const read = (f) => fs.readFileSync(f, 'utf8');

let idx, priv, lookups, p2q, seg;
before(async () => {
  await boot();
  idx = await load('/src/engines/restrictedCustomers.ts');
  priv = await load('/src/engines/agentPrivilegeEngine.ts');
  lookups = await load('/src/navigation/sessionReferenceLookups.tsx');
  p2q = await load('/src/modules/identity-customer-management/passportToQidModel.ts');
  seg = await load('/src/data/customerSegments.ts');
});
after(close);

const indexFor = (roleId) => idx.buildRestrictedIndex(customers, (s) => priv.canViewCustomerSegment(roleId, s));

test('nothing is shown until the customers are known: not ready means restricted, and no rows', () => {
  const pending = idx.buildRestrictedIndex(null, () => true);
  assert.equal(pending.ready, false);
  assert.equal(pending.isRestricted('CUST-1001'), true);
  assert.deepEqual(pending.filter([{ c: 'CUST-1001' }], (r) => r.c), { visible: [], hiddenCount: 0 });
  assert.deepEqual(pending.exclude([1, 2], () => false), { visible: [], hiddenCount: 0 });
});

test('every role, every customer: the rows left are exactly those of customers it may see (conservation holds)', () => {
  const rows = customers.map((c) => ({ id: c.customerId }));
  for (const p of personas) {
    const ix = indexFor(p.id);
    const { visible, hiddenCount } = ix.filter(rows, (r) => r.id);
    const expectedHidden = customers.filter((c) => CAP[c.segment] && !p.capabilities.includes(CAP[c.segment]));
    assert.equal(hiddenCount, expectedHidden.length, p.name);
    assert.equal(visible.length + hiddenCount, rows.length);
    assert.ok(!visible.some((r) => expectedHidden.some((c) => c.customerId === r.id)), `${p.name}: a hidden customer is still listed`);
    for (const c of customers) assert.equal(ix.isRestricted(c.customerId), expectedHidden.includes(c), `${p.name} / ${c.customerId}`);
  }
  assert.equal(indexFor('ROLE-12').filter(rows, (r) => r.id).hiddenCount, 0, 'Premium sees them all');
});

test('a record with no customer, or an unknown customer, is not restricted; free text naming a protected customer is', () => {
  const ix = indexFor('ROLE-01');
  assert.equal(ix.isRestricted(undefined), false);
  assert.equal(ix.isRestricted(null), false);
  assert.equal(ix.isRestricted('CUST-NOT-THERE'), false);
  const hessa = customers.find((c) => c.customerId === 'CUST-3101');
  assert.equal(ix.mentionsRestricted(`${hessa.name} – Follow up`), true);
  assert.equal(ix.mentionsRestricted('New Customer – Draft Order'), false);
  assert.equal(indexFor('ROLE-12').mentionsRestricted(`${hessa.name} – Follow up`), false);
});

test('the seeded records of protected customers exist on each surface, so the restriction has something to hide', () => {
  const has = (kind, key) => json(`public/mock-data/${kind}.json`).some((r) => protectedIds.includes(r[key]));
  assert.ok(has('orders', 'customerId'), 'an order');
  assert.ok(has('trouble-tickets', 'customerId'), 'a ticket');
  assert.ok(has('qtickets', 'customerId'), 'a queue ticket');
  const orderIds = json('public/mock-data/orders.json').filter((o) => protectedIds.includes(o.customerId)).map((o) => o.orderId);
  assert.ok(json('public/mock-data/tasks.json').some((t) => orderIds.includes(t.relatedOrderId)), 'a task through its order');
  // For an unauthorised role every one of them is held back; for Premium none is.
  const ix = indexFor('ROLE-01');
  for (const [kind, key] of [['orders', 'customerId'], ['trouble-tickets', 'customerId'], ['qtickets', 'customerId']]) {
    const rows = json(`public/mock-data/${kind}.json`);
    const { visible, hiddenCount } = ix.filter(rows, (r) => r[key]);
    assert.ok(hiddenCount >= 1, kind);
    assert.ok(!visible.some((r) => protectedIds.includes(r[key])), kind);
  }
});

test('the queue notification (Next Customer) names no one and shows nothing for a protected customer\'s number', () => {
  const phone = customers.find((c) => c.customerId === 'CUST-3101').phone;
  const sources = { accounts: [], installedAssets: [], gigahome: [], iptvBundles: [], smartDevices: [] };
  const open = lookups.factsForKioskNumber(phone, customers, sources, () => true);
  assert.ok(!open.restricted);
  const blocked = lookups.factsForKioskNumber(phone, customers, sources, (s) => !CAP[s]);
  assert.equal(blocked.restricted, true);
  assert.deepEqual([blocked.links.length, blocked.serviceCount], [0, 0]);
  const rows = lookups.ticketToast({ qTicketId: 'QTK-7101', journeyCode: 'J011', queueName: 'New Connections', status: 'Waiting', kioskMobileNumber: phone }, null, null, null, blocked);
  const text = JSON.stringify(rows);
  assert.match(text, /Restricted customer/);
  for (const v of [phone, 'Hessa', 'CUST-3101', 'Safwa']) assert.ok(!text.includes(v), `${v} leaked into the notification`);
  const ordinary = customers.find((c) => c.customerId === 'CUST-1001');
  assert.ok(!lookups.factsForKioskNumber(ordinary.phone, customers, sources, (s) => !CAP[s]).restricted, 'an ordinary customer is unaffected');
});

const wd = { customers: customers.map((c) => ({ ...c })), documents: json('public/mock-data/identity-documents.json'), assets: json('public/mock-data/installed-assets.json'), accounts: json('public/mock-data/accounts.json') };

test('Passport to QID: a protected line owner or Passport holder is refused with no detail', () => {
  const hessa = customers.find((c) => c.customerId === 'CUST-3101');
  const passportDocs = [...wd.documents, { customerId: 'CUST-3101', documentType: 'Passport', documentNumber: 'PROT0001', identityDocumentId: 'IDD-T' }];
  const data = { ...wd, documents: passportDocs };
  const canView = (id) => priv.canViewCustomerSegment('ROLE-01', customers.find((c) => c.customerId === id)?.segment);
  const r = p2q.checkPassportOwner({ msisdn: hessa.phone, passportNumber: 'PROT0001' }, data, canView);
  assert.equal(r.ok, false);
  assert.equal(r.restricted, true);
  for (const v of ['Hessa', 'CUST-3101', 'PROT0001']) assert.ok(!r.message.includes(v), v);
  // Someone else's Passport quoted against a protected customer's line: still refused without naming the Passport's holder.
  const r2 = p2q.checkPassportOwner({ msisdn: hessa.phone, passportNumber: 'P0998812' }, data, canView);
  assert.equal(r2.restricted, true);
  // An authorised role gets the ordinary check.
  assert.equal(p2q.checkPassportOwner({ msisdn: hessa.phone, passportNumber: 'PROT0001' }, data, () => true).ok, true);
  // Ordinary customers are unaffected.
  assert.equal(p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'P0998812' }, wd, canView).ok, true);
});

test('every surface is wired to the check', () => {
  const lists = {
    'src/modules/order-management/MySalesOrders.tsx': /guard\.filter\(sortedOrders, \(o\) => o\.customerId\)/,
    'src/modules/order-management/OrderApprovalQueue.tsx': /guard\.filter\([\s\S]*?\(o\) => o\.customerId\s*\)/,
    'src/modules/trouble-ticketing-complaints/screens/TicketsDashboard.tsx': /guard\.filter\(allTickets, \(t\) => t\.customerId\)/,
    'src/modules/trouble-ticketing-complaints/screens/TicketApprovalQueue.tsx': /guard\.filter\([\s\S]*?\(t\) => t\.customerId\s*\)/,
    'src/workspace/tickets/QnomyTicketHistory.tsx': /guard\.filter\(mine, \(t\) => t\.customerLinkId\)/,
    'src/workspace/tasks/TaskListView.tsx': /guard\.exclude\(unfiltered/,
    'src/workspace/orders/OrdersWorkspace.tsx': /guard\.filter\(orders,/,
  };
  for (const [f, re] of Object.entries(lists)) {
    const src = read(f);
    assert.match(src, re, f);
    assert.match(src, /useRestrictedCustomers\(\)/, f);
  }
  for (const f of Object.keys(lists).filter((x) => !x.includes('OrdersWorkspace'))) {
    assert.match(read(f), /!guard\.ready/, `${f}: loading until the customers are known`);
    assert.match(read(f), /RestrictedRowsNotice/, f);
  }
  const details = {
    'src/modules/order-management/OrderApprovalDetail.tsx': /restricted\.isRestricted\(order\.customerId\)/,
    'src/modules/trouble-ticketing-complaints/screens/TicketApprovalReview.tsx': /restricted\.isRestricted\(ticket\.customerId\)/,
    'src/modules/trouble-ticketing-complaints/screens/TicketDetail.tsx': /restricted\.isRestricted\(ticket\.customerId\)/,
  };
  for (const [f, re] of Object.entries(details)) {
    const src = read(f);
    assert.match(src, re, f);
    assert.match(src, /!restricted\.ready\) return/, `${f}: nothing before authorisation completes`);
    assert.ok(src.indexOf('RestrictedCustomerNotice backTo') > src.indexOf('restricted.isRestricted'), f);
  }
  const modal = read('src/components/patterns/TicketCreationModal.tsx');
  assert.match(modal, /blocked && <RestrictedCustomerNotice/);
  assert.match(modal, /canViewCustomerSegment\(usePersonaStore\.getState\(\)\.activePersonaId, found\.segment\) \? found : null/);
  assert.match(modal, /submitting \|\| blocked \|\| !restrictedCustomers\.ready/);
  const billing = read('src/workspace/customer360/BillingAccountPage.tsx');
  const gate = billing.indexOf('canViewCustomerSegment(activePersonaId, customer.segment)');
  assert.ok(gate > 0 && gate < billing.indexOf('setProfile(found);'), 'authorised before the account is kept');
  assert.match(billing, /if \(blocked\) \{[\s\S]*RestrictedCustomerNotice/);
  assert.match(read('src/modules/Dashboard.tsx'), /canViewCustomerSegment\(activePersonaId, c\.segment\)/);
  const next = read('src/navigation/SessionReferenceNumbers.tsx');
  assert.match(next, /if \(matched && !canView\(matched\.segment\)\) \{[\s\S]*?clearActiveCustomer\(\);[\s\S]*?navigate\('\/'\);\s*return;/, 'Next Customer: no active customer, no journey launched');
  assert.match(read('src/modules/identity-customer-management/screens/PassportOwnerCheck.tsx'), /canView\)/);
});

test('the refusal text for the lists carries no customer information', () => {
  const notice = read('src/components/patterns/RestrictedRowsNotice.tsx');
  assert.match(notice, /access restricted for your role/);
  assert.ok(!/segment|Safwa|Royal/i.test(notice.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')));
  assert.ok(!/Safwa|Royal/i.test(seg.RESTRICTED_CUSTOMER_MESSAGE));
});

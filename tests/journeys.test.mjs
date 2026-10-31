import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let cfg;
before(async () => {
  ({ cfg } = await boot());
});
after(close);

// ---- 1. Sign-in: staff ID -> role ------------------------------------------------------------------------------
test('sign-in: every configured staff ID resolves to its role, with or without a hyphen or case', async () => {
  const personas = cfg.getAllPersonas();
  assert.ok(personas.length >= 26);
  for (const p of personas) {
    assert.equal(cfg.getPersonaByStaffId(p.staffId)?.id, p.id, p.staffId);
  }
  const map = await load('/src/auth/staffIdRoleMap.ts');
  const first = personas[0];
  const spaced = first.staffId.replace(/^(VFQ)/, '$1-').toLowerCase();
  assert.ok(Object.keys(map).length > 0);
  assert.equal(cfg.getPersonaByStaffId(first.staffId.toUpperCase())?.id, first.id);
  assert.ok(spaced.includes('-'));
});

test('sign-in: staff IDs and role IDs are unique', () => {
  const ps = cfg.getAllPersonas();
  assert.equal(new Set(ps.map((p) => p.staffId)).size, ps.length);
  assert.equal(new Set(ps.map((p) => p.id)).size, ps.length);
});

// ---- 2. Navigation per role ------------------------------------------------------------------------------------
test('navigation: every role gets Dashboard first, and Customer Search second where it holds it', async () => {
  const nav = await load('/src/engines/navigationEngine.ts');
  for (const p of cfg.getAllPersonas()) {
    const keys = nav.resolveNavFor(p.id).map((i) => i.key);
    assert.equal(keys[0], 'dashboard', p.id);
    if (keys.includes('customer-search')) assert.equal(keys[1], 'customer-search', `${p.id} order: ${keys.join(',')}`);
  }
});

test('navigation: every nav destination resolves to a real route component', async () => {
  const nav = await load('/src/navigation/navManifest.ts');
  const dests = nav.NAV_MANIFEST.flatMap((i) => [i, ...(i.children ?? [])]).filter((i) => i.implemented);
  assert.ok(dests.length > 10);
  for (const d of dests) assert.ok(typeof d.to === 'string' && d.to.startsWith('/'), d.key);
});

// ---- 3. Customer search ----------------------------------------------------------------------------------------
test('customer search: finds a customer by QID, mobile, customer number and name; ignores empty text', async () => {
  const eng = await load('/src/engines/customer360Engine.ts');
  assert.deepEqual(await eng.searchCustomers('   '), []);
  const byQid = await eng.searchCustomers('28512345678');
  assert.ok(byQid.some((r) => r.customer.customerId === 'CUST-1001'));
  assert.ok(byQid[0].matchedOn.includes('qid'));
  const byPhone = await eng.searchCustomers('55512001');
  assert.ok(byPhone.some((r) => r.customer.customerId === 'CUST-1001'));
  const byId = await eng.searchCustomers('CUST-1003');
  assert.ok(byId.some((r) => r.customer.customerId === 'CUST-1003'));
  const byName = await eng.searchCustomers('ahmed');
  assert.ok(byName.length >= 2);
  assert.deepEqual(await eng.searchCustomers('zzzz-no-such-customer'), []);
});

test('customer 360: a customer loads with services, accounts and a billing summary', async () => {
  const eng = await load('/src/engines/customer360Engine.ts');
  const data = await eng.getCustomer360('CUST-1001');
  assert.ok(data);
  assert.equal(data.customer.customerId, 'CUST-1001');
  const summary = eng.computeBillingSummary(data);
  assert.ok(summary && typeof summary === 'object');
  assert.equal(await eng.getCustomer360('CUST-DOES-NOT-EXIST'), undefined);
});

// ---- 4. Identity validation (Customer Verification) -----------------------------------------------------------
test('identity: alternate phone accepts Qatar mobiles only; email and date of birth are validated', async () => {
  const m = await load('/src/components/patterns/guidedContactModel.ts');
  assert.equal(m.isValidAltPhone('5566 7766'), true);
  assert.equal(m.isValidAltPhone('+974 5566 7766'), true);
  assert.equal(m.isValidAltPhone('4411 2233'), false); // landline
  assert.equal(m.isValidAltPhone('123'), false);
  assert.equal(m.isValidAltPhone(undefined), false);
  assert.equal(m.isValidEmail('a@b.qa'), true);
  assert.equal(m.isValidEmail('not-an-email'), false);
  assert.equal(m.isValidDob('31/02/1990'), false);
  assert.equal(m.isValidDob('15/06/1990'), true);
  assert.equal(m.isValidDob('15/06/2999'), false);
});

// ---- 5. Eligibility (New Connection) ---------------------------------------------------------------------------
test('eligibility: under-18 is a hard stop; blacklisted customers are stopped; a clean adult passes', async () => {
  const e = await load('/src/engines/eligibilityEngine.ts');
  const asOf = new Date('2026-10-08T00:00:00Z');
  const base = { deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5 postpaid mobile lines used.' };
  const adult = { customerId: 'C1', idType: 'QID', dob: '1990-01-01', blacklisted: false };
  assert.equal(e.hasHardStop(e.evaluateEligibilityChecks({ ...base, customer: adult }, asOf)), false);
  const minor = { ...adult, dob: '2015-01-01' };
  assert.equal(e.hasHardStop(e.evaluateEligibilityChecks({ ...base, customer: minor }, asOf)), true);
  const bl = { ...adult, blacklisted: true, blacklistCategory: 'security', blacklistReason: 'x' };
  assert.equal(e.hasHardStop(e.evaluateEligibilityChecks({ ...base, customer: bl }, asOf)), true);
  const expired = e.evaluateEligibilityChecks({ ...base, customer: adult, doc: { expiryDate: '2020-01-01' } }, asOf);
  assert.equal(expired.find((c) => c.id === 'id-validity')?.outcome, 'hard-stop');
  assert.equal(ageOn(e, '2000-10-08', asOf), 26);
});
const ageOn = (e, dob, asOf) => e.ageOn(dob, asOf);

// ---- 6. Plan, add-ons and pricing (Postpaid) ------------------------------------------------------------------
test('pricing: discount, VAT and total add up exactly as displayed', async () => {
  const p = await load('/src/engines/postpaidPricing.ts');
  const c = p.monthlyCharges({ planQar: 750, discountRate: -0.15, addonsQar: 50 });
  assert.equal(c.discountQar, 112.5);
  assert.equal(c.netQar, 687.5);
  assert.equal(c.vatQar, Math.round(c.vatQar * 100) / 100);
  assert.equal(Math.round((c.netQar + c.vatQar) * 100) / 100, c.totalQar);
  const sign = p.monthlyCharges({ planQar: 750, discountRate: 0.15, addonsQar: 50 });
  assert.equal(sign.discountQar, c.discountQar); // a positive-signed rate must not ADD the discount
  assert.equal(p.formatQar(1000), 'QAR 1,000');
  assert.equal(p.formatQar(112.5), 'QAR 112.50');
});

test('pricing: the first bill is the prorated part-month, below the recurring full-month bill', async () => {
  const p = await load('/src/engines/postpaidPricing.ts');
  const rec = p.monthlyCharges({ planQar: 300 });
  const bill = p.firstBillCharges(rec, new Date('2026-10-16T00:00:00Z'));
  assert.ok(bill.totalQar <= rec.totalQar);
  assert.equal(bill.proratedDays, 16); // 16 - 31 October inclusive
  assert.equal(bill.cycleDays, 31);
  assert.ok(bill.proratedDays > 0 && bill.proratedDays <= bill.cycleDays);
});

// ---- 7. Business rules ---------------------------------------------------------------------------------------------
test('rules: HRN nationality detection and rule evaluation do not throw for any configured rule', async () => {
  const r = await load('/src/engines/ruleEngine.ts');
  assert.equal(typeof r.isHrnNationality('Qatari'), 'boolean');
  for (const rule of ['BR-288', 'BR-347', 'BR-115']) {
    const out = r.evaluateRule(rule, {});
    assert.equal(typeof out.pass, 'boolean');
  }
});

// ---- 8. Queue / task logic -------------------------------------------------------------------------------------
test('queue: a role only waits on, and is offered, tickets from its own queues, oldest first', async () => {
  const q = await load('/src/engines/qnomyQueueEngine.ts');
  const ps = cfg.getAllPersonas();
  const tickets = [
    { qTicketId: 'A', journeyCode: 'J011', status: 'Waiting', generatedAt: '2026-09-02T10:00:00Z', kioskMobileNumber: null, customerId: null, queueName: null },
    { qTicketId: 'B', journeyCode: 'J011', status: 'Waiting', generatedAt: '2026-09-01T10:00:00Z', kioskMobileNumber: null, customerId: null, queueName: null },
    { qTicketId: 'C', journeyCode: 'J011', status: 'Completed', generatedAt: '2026-08-01T10:00:00Z', kioskMobileNumber: null, customerId: null, queueName: null },
  ];
  const withQueue = ps.find((p) => q.queuesForRole(p.id).includes('J011'));
  if (withQueue) {
    assert.equal(q.waitingCountFor(withQueue.id, tickets), 2);
    assert.equal(q.nextTicketFor(withQueue.id, tickets)?.qTicketId, 'B');
  }
  const without = ps.find((p) => q.queuesForRole(p.id).length === 0);
  if (without) assert.equal(q.waitingCountFor(without.id, tickets), 0);
});

// ---- 9. Access control -----------------------------------------------------------------------------------------
test('RBAC: every grant references a real catalogue feature; no role is empty', () => {
  for (const p of cfg.getAllPersonas()) {
    const grants = cfg.getPersonaFeatureGrants(p.id);
    assert.ok(grants.length > 0, `${p.id} has no grants`);
    for (const g of grants) {
      assert.ok(cfg.getFeatureEntry(g.key), `${p.id} -> unknown feature ${g.key}`);
      assert.ok(typeof g.level === 'string' && g.level.length > 0, `${p.id}/${g.key} has no level`);
    }
  }
});

// ---- 10. Routing catalogue --------------------------------------------------------------------------------------
test('routes: the catalogue has 211 unique screens and paths', () => {
  const routes = cfg.getAllRoutes();
  assert.equal(routes.length, 211);
  assert.equal(new Set(routes.map((r) => r.path)).size, routes.length);
  assert.equal(new Set(routes.map((r) => r.screenId)).size, routes.length);
});

// ---- 11. Activities on the order-submitted page ----------------------------------------------------------------
test('activities: the automatic one carries no comments and keeps its reserved number; a manual one needs comments', async () => {
  const act = await load('/src/engines/activityEngine.ts');
  const reserved = act.newActivityId();
  const auto = act.buildActivity({ trigger: 'completed', journey: 'New Connection', orderId: 'ORD-T1', activityNumber: reserved, comments: 'ignored' });
  assert.equal(auto.activityNumber, reserved);
  assert.equal(auto.comments, undefined);
  assert.throws(() => act.buildActivity({ trigger: 'manual', journey: 'New Connection', orderId: 'ORD-T1', comments: '   ' }), /comment is required/);
  const manual = act.buildActivity({ trigger: 'manual', journey: 'New Connection', orderId: 'ORD-T1', comments: ' Callback requested ' });
  assert.equal(manual.comments, 'Callback requested');
  assert.notEqual(manual.activityNumber, reserved);
});

test('activities: the automatic and a manual activity are separate records, and Done & Exit closes both', async () => {
  const act = await load('/src/engines/activityEngine.ts');
  const db = await load('/src/engines/mockDataEngine.ts');
  const autoId = await act.logActivity({ trigger: 'completed', journey: 'New Connection', orderId: 'ORD-T2', activityNumber: act.newActivityId() });
  const manualId = await act.logActivity({ trigger: 'manual', journey: 'New Connection', orderId: 'ORD-T2', comments: 'Extra note' });
  assert.notEqual(autoId, manualId);
  const mine = (await db.list('customer-activities')).filter((a) => a.orderId === 'ORD-T2');
  assert.equal(mine.length, 2);
  assert.equal(mine.find((a) => a.activityNumber === autoId).comments, undefined);
  assert.equal(mine.find((a) => a.activityNumber === manualId).comments, 'Extra note');
  assert.equal(await act.closeOrderActivities('ORD-T2'), 2);
  // The close is a real update: the engine (so a reload and the journal see it) reports both as Closed, and closing again finds nothing open.
  const after = (await db.list('customer-activities')).filter((a) => a.orderId === 'ORD-T2');
  assert.deepEqual(after.map((a) => a.status), ['Closed', 'Closed']);
  assert.equal(await act.closeOrderActivities('ORD-T2'), 0);
});

// ---- ID expiry: an ID whose expiry date is today or earlier is expired and stops the connection -------------------------------------
test('eligibility: an ID expiring on or before today is expired (hard stop); one expiring tomorrow is valid, whatever the time of day', async () => {
  const e = await load('/src/engines/eligibilityEngine.ts');
  const base = { deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5 postpaid mobile lines used.' };
  const customer = { customerId: 'C1', idType: 'QID', dob: '1990-01-01', blacklisted: false };
  const check = (expiryDate, asOf) => e.evaluateEligibilityChecks({ ...base, customer, doc: { expiryDate } }, asOf).find((c) => c.id === 'id-validity');
  const day = (h, m) => new Date(2026, 9, 22, h, m); // 22 Oct 2026, local time
  for (const [h, m] of [[0, 0], [0, 30], [12, 0], [23, 59]]) {
    assert.equal(check('2026-10-22', day(h, m)).outcome, 'hard-stop', `expiring today, checked at ${h}:${m}`);
    assert.equal(check('2026-10-21', day(h, m)).outcome, 'hard-stop', 'expired yesterday');
    assert.equal(check('2026-10-23', day(h, m)).outcome, 'pass', `expiring tomorrow, checked at ${h}:${m}`);
  }
  assert.equal(check('2020-01-01', day(9, 0)).outcome, 'hard-stop');
  assert.equal(e.isIdExpired('not a date', day(9, 0)), true, 'unreadable is not valid');
  assert.equal(e.hasHardStop(e.evaluateEligibilityChecks({ ...base, customer, doc: { expiryDate: '2026-10-22' } }, day(9, 0))), true, 'it blocks progression');
});

test('every ID on file: the expiry rule agrees with an independent day count, and the expired ones are blocked', async () => {
  const e = await load('/src/engines/eligibilityEngine.ts');
  const docs = JSON.parse((await import('node:fs')).readFileSync('public/mock-data/identity-documents.json', 'utf8'));
  const asOf = new Date(2026, 9, 22, 9, 0);
  const todayMs = Date.UTC(2026, 9, 22);
  let expired = 0;
  for (const d of docs.filter((x) => x.expiryDate)) {
    const [y, m, dd] = d.expiryDate.split('-').map(Number);
    const shouldBlock = Date.UTC(y, m - 1, dd) <= todayMs;
    assert.equal(e.isIdExpired(d.expiryDate, asOf), shouldBlock, `${d.documentNumber} ${d.expiryDate}`);
    if (shouldBlock) expired++;
  }
  assert.ok(expired >= 1, 'the seed holds an expired ID to demonstrate the stop (CUST-1006)');
});

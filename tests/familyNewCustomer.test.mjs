// A customer identified for the first time holds no Family Package (a Family Plan is selected and activated only in the journey), and the Add Another
// Connection dialog names the real reason when a package has nothing to add.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let start, engine;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  start = await load('/src/modules/new-connection/familyStart.ts');
  engine = await load('/src/engines/familyPackage.ts');
});
after(close);

const ID = '29555000000999';
const products = [{ productId: 'PROD-142', name: 'Family', mrcQAR: 1, planClass: 'Postpaid Family Plans' }];
const cleared = { checks: [], hardStop: false, softStop: false };
const heldById = [{ lineId: 'L1', packageId: 'FPK-X', idNumber: ID, role: 'Primary', sequence: 1, planId: 'PROD-142', orderId: 'O-1' }];
const values = (contact, eligibility) => ({ productId: 'PROD-142', contact, eligibility });

test('a new customer has no Family Package, even when lines carry their ID: the Family Plan starts a new package', () => {
  const check = start.familyStartFor(values({ idNumber: ID, moiResult: { isNewCustomer: true } }, cleared), products, heldById);
  assert.equal(check.applies && check.ok, true);
  assert.equal(check.lineLabel, 'Primary Line 1');
  assert.equal(check.additional, undefined);
});

test('a customer who is NOT new, held by ID, still has the package (unchanged)', () => {
  const check = start.familyStartFor(values({ idNumber: ID, moiResult: { isNewCustomer: false } }, cleared), products, heldById);
  assert.equal(check.applies && !check.ok && check.kind, 'package');
  // By record too.
  const byRecord = start.familyStartFor(values({ idNumber: 'other', moiResult: { isNewCustomer: false } }, { ...cleared, customerId: 'CUST-1' }), products, [{ ...heldById[0], idNumber: undefined, customerId: 'CUST-1' }]);
  assert.equal(byRecord.applies && !byRecord.ok && byRecord.kind, 'package');
});

test('a new customer who has not cleared eligibility still cannot start a package', () => {
  const check = start.familyStartFor(values({ idNumber: ID, moiResult: { isNewCustomer: true } }, { checks: [], hardStop: true }), products, []);
  assert.equal(check.applies && !check.ok && check.kind, 'eligibility');
});

const line = (role, sequence, orderId, extra = {}) => ({ lineId: `${role}${sequence}`, packageId: 'P', customerId: 'C', role, sequence, planId: 'PROD-142', orderId, ...extra });
const catalogue = { supplementaryPlanId: 'PROD-311', secondaryPlanIds: ['PROD-310', 'PROD-312'] };

test('nothing to add: the reason is the real one - Primary Line 1 awaiting approval, naming the order status', () => {
  const lines = [line('Primary', 1, 'O1')];
  const pending = engine.connectionUnavailable(lines, [{ orderId: 'O1', approvalStatus: 'Pending Approval', status: 'Submitted for Approval' }], catalogue);
  assert.equal(pending.title, 'Primary Line 1 Awaiting Approval');
  assert.match(pending.reasons[0], /not approved yet \(its order is Pending Approval\)/);
  const missing = engine.connectionUnavailable(lines, [], catalogue);
  assert.match(missing.reasons[0], /not approved yet/);
});

test('nothing to add: the reason is the real one for each state - an approved package with both Primary Lines active and no plan to offer says why per plan; something to add: no reason', () => {
  const approved = [{ orderId: 'O1', approvalStatus: 'Approved', status: 'Complete' }, { orderId: 'O2', approvalStatus: 'Approved', status: 'Complete' }];
  const open = engine.connectionUnavailable([line('Primary', 1, 'O1')], approved, catalogue);
  assert.equal(open, undefined, 'Primary Line 2 can be added');
  const p2Pending = engine.connectionUnavailable([line('Primary', 1, 'O1'), line('Primary', 2, 'O2')], [approved[0], { orderId: 'O2', approvalStatus: 'Pending Approval', status: 'Submitted for Approval' }], catalogue);
  assert.equal(p2Pending.title, 'Primary Line 2 Awaiting Approval');
  assert.match(p2Pending.reasons[0], /Primary Line 2 is not active yet \(its order is Pending Approval\)/);
  const noPlans = engine.connectionUnavailable([line('Primary', 1, 'O1'), line('Primary', 2, 'O2')], approved, {});
  assert.equal(noPlans.title, 'No Additional Plan Is Available');
  assert.match(noPlans.reasons[0], /No Family-equivalent plan is available yet\. No Secondary plan is available yet\./);
  const exhausted = engine.connectionUnavailable([line('Primary', 1, 'O1'), line('Primary', 2, 'O2'), line('Supplementary', 1, 'O1'), line('Supplementary', 2, 'O1')], approved, { supplementaryPlanId: 'PROD-311' });
  assert.match(exhausted.reasons[0], /already has its 2 Supplementary lines/);
});

test('the dialog is titled by the reason and lists it, instead of "Family Package Already Active" / one generic sentence', () => {
  const src = fs.readFileSync('src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'utf8');
  assert.match(src, /title=\{pkg\?\.unavailable\?\.title \?\? \(alreadyActive \? 'Family Package Already Active' : 'Add Another Connection'\)\}/);
  assert.match(src, /pkg\.unavailable\?\.reasons/);
});

test('one record per ID: a second order for a person who already has a record is given it, not a duplicate', async () => {
  const records = await load('/src/modules/new-connection/newCustomerRecords.ts');
  const engineData = await load('/src/engines/mockDataEngine.ts');
  const ID2 = '29555000000777';
  assert.equal(await records.existingCustomerIdFor(ID2), undefined, 'nobody yet: a record is created');
  await engineData.create('customers', { customerId: 'CUST-777001', qid: ID2, name: 'Dup Test' });
  assert.equal(await records.existingCustomerIdFor(ID2), 'CUST-777001', 'found by the customer record');
  const ID3 = '29555000000778';
  await engineData.create('identity-documents', { identityDocumentId: 'IDD-1', customerId: 'CUST-777002', documentNumber: ID3 });
  assert.equal(await records.existingCustomerIdFor(ID3), 'CUST-777002', 'found by the identity document');
  assert.equal(await records.existingCustomerIdFor(undefined), undefined);
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /const knownCustomerId = needsRecord \? await existingCustomerIdFor\(contact\.idNumber\) : undefined;/);
  assert.match(submit, /const createdCustomerId = needsRecord && !knownCustomerId \? newCustomerId\(\) : undefined;/);
  assert.match(submit, /eligibility\?\.customerId \?\? knownCustomerId \?\? createdCustomerId/);
});

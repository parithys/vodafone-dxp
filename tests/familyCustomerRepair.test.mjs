// A Family Package held by a customer's ID alone (no customer record) must not leave the agent pointed at a Customer 360 that does not exist: the
// record is created from what Customer Verification captured, the package's lines are linked to it, and Customer Search then finds the customer.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let repair, engine, c360, familyStart;
before(async () => {
  await boot();
  // The capabilities barrel pulls in UI that registers window listeners at import.
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  repair = await load('/src/modules/new-connection/repairFamilyCustomer.ts');
  engine = await load('/src/engines/mockDataEngine.ts');
  c360 = await load('/src/engines/customer360Engine.ts');
  familyStart = await load('/src/engines/familyPackage.ts');
});
after(close);

const ID = '29555000000999';
const contact = { idType: 'QID', idNumber: ID, firstName: 'Test', lastName: 'Person', moiResult: { isNewCustomer: true, name: 'Test Person', dob: '1990-01-01', nationality: 'Indian', expiryDate: '2030-01-01' } };
const eligibility = { checks: [], segment: 'Consumer' };
const line = (over = {}) => ({ lineId: 'FPL-ORPHAN-P1', packageId: 'FPK-ORPHAN', idNumber: ID, role: 'Primary', sequence: 1, planId: 'PROD-142', orderId: 'ORD-ORPHAN', ...over });
const write = () => ({
  createRecord: (kind, record) => engine.create(kind, record).then(() => undefined),
  updateRecord: (kind, idField, id, patch) => engine.update(kind, id, patch, idField).then(() => undefined),
});

test('only lines with no customer named, for this ID, are orphans', () => {
  const lines = [line(), line({ lineId: 'B', customerId: 'CUST-1001' }), line({ lineId: 'C', idNumber: 'OTHER' }), line({ lineId: 'D', idNumber: undefined })];
  assert.deepEqual(repair.orphanFamilyLines(lines, ID).map((l) => l.lineId), ['FPL-ORPHAN-P1']);
  assert.deepEqual(repair.orphanFamilyLines(lines, undefined), []);
});

test('nothing is invented: an ID the journey did not identify as new, and a customer with no orphans, are left alone', async () => {
  const calls = [];
  const w = { createRecord: async (k) => calls.push(k), updateRecord: async (k) => calls.push(k) };
  assert.equal(await repair.repairFamilyCustomer({ contact: { ...contact, moiResult: { isNewCustomer: false } }, eligibility, orphanLines: [line()] }, w), undefined);
  assert.equal(await repair.repairFamilyCustomer({ contact, eligibility, orphanLines: [] }, w), undefined);
  assert.deepEqual(calls, []);
});

test('the package held by the ID gets a customer: searchable, with its identity document, and the line linked', async () => {
  assert.equal((await c360.searchCustomers(ID)).length, 0, 'the bug: Customer Search finds nobody for this ID');
  await engine.create('family-package-lines', line());
  const customerId = await repair.repairFamilyCustomer({ contact, eligibility, orphanLines: [line()] }, write());
  assert.match(customerId, /^CUST-\d+$/);
  const found = await c360.searchCustomers(ID);
  assert.equal(found.length, 1);
  assert.equal(found[0].customer.customerId, customerId);
  assert.equal(found[0].customer.name, 'Test Person');
  const lines = await engine.list('family-package-lines');
  assert.equal(lines.find((l) => l.lineId === 'FPL-ORPHAN-P1').customerId, customerId, 'the line is linked');
  assert.ok((await engine.list('identity-documents')).some((d) => d.customerId === customerId && d.documentNumber === ID));
  // The package is now the customer's by record: the check finds it by customerId as well as by the ID.
  assert.equal(familyStart.linesOfCustomer(lines, { customerId }).length, 1);
});

test('safe to run again: the record that now exists for the ID is used, not created twice', async () => {
  const before = (await c360.searchCustomers(ID)).length;
  const again = await repair.repairFamilyCustomer({ contact, eligibility, orphanLines: [line({ lineId: 'FPL-ORPHAN-2', sequence: 2, role: 'Secondary' })] }, write());
  assert.equal((await c360.searchCustomers(ID)).length, before);
  assert.equal(again, (await c360.searchCustomers(ID))[0].customer.customerId);
});

test('a customer who already has a record only has the lines linked, no second record', async () => {
  const calls = [];
  const w = { createRecord: async (k) => calls.push(`create ${k}`), updateRecord: async (k, f, id, patch) => calls.push(`update ${k} ${patch.customerId}`) };
  const id = await repair.repairFamilyCustomer({ contact, eligibility: { ...eligibility, customerId: 'CUST-1001' }, orphanLines: [line()] }, w);
  assert.equal(id, 'CUST-1001');
  assert.ok(calls.every((c) => c.startsWith('update')), calls.join());
  assert.ok(calls.includes('update family-package-lines CUST-1001'));
});

test('the plan step runs the repair and hands the gate the repaired customer', () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /<FamilyCustomerRepair lines=\{familyLines\} values=\{values\} setValue=\{setValue\} \/>/);
  assert.match(steps, /owner\?\.customerId \?\? \(c\.values\.eligibility as \{ customerId\?: string \} \| undefined\)\?\.customerId/);
});

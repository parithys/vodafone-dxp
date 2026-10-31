// An existing customer's ID details follow MOI's latest answer (Diplomatic ID sets the ID Type), and every change to the customer's information
// is written to the audit trail with what changed. Expectations come from the rule and from the dataset, not from the code under test.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m, a;
before(async () => {
  await boot();
  m = await load('/src/components/patterns/moiIdRefresh.ts');
  a = await load('/src/engines/customerChangeAudit.ts');
});
after(close);

const rd = (n) => JSON.parse(fs.readFileSync(new URL(`../public/mock-data/${n}.json`, import.meta.url), 'utf8'));
const docs = rd('identity-documents');
const customers = rd('customers');

test('a Diplomatic ID returned by MOI makes the customer a Diplomatic ID holder, with its number', () => {
  const doc = docs.find((d) => d.documentNumber === 'DIP-QA-004977');
  const cust = customers.find((c) => c.customerId === doc.customerId);
  assert.equal(cust.idType, 'QID', 'fixture: the record disagrees with MOI');
  assert.deepEqual(m.moiIdDetailsPatch(cust, doc, docs), { idType: 'Diplomatic ID', qid: 'DIP-QA-004977' });
});

test('already in agreement changes nothing; a Passport looked up for a customer whose ID of record is their QID changes nothing', () => {
  const doc = { customerId: 'C', documentType: 'QID', documentNumber: '1' };
  assert.equal(m.moiIdDetailsPatch({ idType: 'QID', qid: '1' }, doc, [doc]), undefined);
  const passport = { customerId: 'C', documentType: 'Passport', documentNumber: 'P1' };
  assert.equal(m.moiIdDetailsPatch({ idType: 'QID', qid: '1' }, passport, [doc, passport]), undefined);
});

test('over the whole dataset: the patch exists exactly when the record disagrees with the customer\'s only document', () => {
  let patched = 0;
  for (const c of customers) {
    const own = docs.filter((d) => d.customerId === c.customerId);
    for (const d of own) {
      const p = m.moiIdDetailsPatch(c, d, docs);
      const ofRecord = d.documentType === 'Diplomatic ID' || own.length === 1 || d.documentNumber === c.qid;
      const differs = c.idType !== d.documentType || c.qid !== d.documentNumber;
      assert.equal(Boolean(p), ofRecord && differs, `${c.customerId} ${d.documentNumber}`);
      if (p) patched += 1;
    }
  }
  assert.ok(patched >= 1);
});

test('every Diplomatic ID document in the dataset is validated through MOI', () => {
  for (const d of docs.filter((x) => x.documentType === 'Diplomatic ID')) assert.equal(d.validationPath, 'MOI Validation', d.documentNumber);
});

test('audit rows: one per field that really changed, with old and new value, who and how; none for an unchanged field', () => {
  const rows = a.customerChangeAuditRows({ kind: 'customers', before: { customerId: 'CUST-1', idType: 'QID', qid: '1', name: 'A' }, patch: { idType: 'Diplomatic ID', qid: '2', name: 'A' }, by: 'MOI', how: 'Updated from MOI response' });
  assert.deepEqual(rows.map((r) => [r.fieldModified, r.oldValue, r.newValue]), [['ID Type', 'QID', 'Diplomatic ID'], ['ID Number', '1', '2']]);
  assert.ok(rows.every((r) => r.recordId === 'CUST-1' && r.employeeUser === 'MOI' && r.changeBasis === 'Updated from MOI response' && r.recordType === 'Customer'));
  assert.equal(new Set(rows.map((r) => r.auditId)).size, rows.length);
});

test('derived counters are not customer information; contacts and addresses are filed under their record / customer; other kinds are not audited', () => {
  assert.deepEqual(a.customerChangeAuditRows({ kind: 'customers', before: { customerId: 'C', activePrepaidLines: 1 }, patch: { activePrepaidLines: 2 }, by: 'x', how: 'y' }), []);
  const c = a.customerChangeAuditRows({ kind: 'customer-contacts', before: { contactRecordId: 'CON-1', cellNumber: '3' }, patch: { cellNumber: '4' }, by: 'x', how: 'y' });
  assert.equal(c[0].recordId, 'CON-1');
  assert.equal(c[0].fieldModified, 'Mobile Number');
  const ad = a.customerChangeAuditRows({ kind: 'addresses', before: { id: 'A', customerId: 'CUST-9', city: 'Doha' }, patch: { city: 'Al Wakrah' }, by: 'x', how: 'y' });
  assert.equal(ad[0].recordId, 'CUST-9');
  assert.deepEqual(a.customerChangeAuditRows({ kind: 'orders', before: { id: 1, s: 1 }, patch: { s: 2 }, by: 'x', how: 'y' }), []);
});

test('the entity store writes the audit rows on every update of a customer, contact or address, and on an ID document added', async () => {
  const { useEntityStore } = await load('/src/stores/entityStore.ts');
  const engine = await load('/src/engines/mockDataEngine.ts');
  await engine.seedMockData();
  const s = useEntityStore.getState();
  const before = (await engine.list('audit-trail')).length;
  await s.updateRecord('customers', 'customerId', 'CUST-1007', { idType: 'Diplomatic ID' }, { how: 'Updated from MOI response', by: 'MOI' });
  await s.updateRecord('customers', 'customerId', 'CUST-1007', { idType: 'Diplomatic ID' }); // unchanged: no row
  let rows = await engine.list('audit-trail');
  assert.equal(rows.length, before + 1);
  assert.deepEqual([rows.at(-1).recordId, rows.at(-1).fieldModified, rows.at(-1).oldValue, rows.at(-1).newValue, rows.at(-1).changeBasis], ['CUST-1007', 'ID Type', 'QID', 'Diplomatic ID', 'Updated from MOI response']);
  await s.createRecord('identity-documents', { identityDocumentId: 'IDD-T1', customerId: 'CUST-1007', documentType: 'QID', documentNumber: '29999999999' });
  rows = await engine.list('audit-trail');
  assert.equal(rows.at(-1).fieldModified, 'ID Document Added');
  assert.equal(rows.at(-1).newValue, 'QID 29999999999');
});

test('account-status and billing-profile edits are audited and filed under the account, where Customer 360 reads them', async () => {
  const s = a.customerChangeAuditRows({ kind: 'accounts', before: { accountId: 'ACC-1', status: 'Active' }, patch: { status: 'Suspended' }, by: 'x', how: 'y' });
  assert.deepEqual([s[0].recordType, s[0].recordId, s[0].fieldModified, s[0].oldValue, s[0].newValue], ['Account', 'ACC-1', 'Account Status', 'Active', 'Suspended']);
  const b = a.customerChangeAuditRows({ kind: 'billing-profiles', before: { billingProfileId: 'BP-1', accountId: 'ACC-1', billingContactEmail: 'a@x.qa', billMedium: 'Email' }, patch: { billingContactEmail: 'b@x.qa', billMedium: 'Email' }, by: 'x', how: 'y' });
  assert.deepEqual(b.map((r) => [r.recordType, r.recordId, r.fieldModified, r.oldValue, r.newValue]), [['Billing Profile', 'ACC-1', 'Billing Contact Email', 'a@x.qa', 'b@x.qa']]);
  // Every seeded profile carries the account id the trail is filed under.
  for (const p of rd('billing-profiles')) assert.ok(p.accountId, p.billingProfileId);
});

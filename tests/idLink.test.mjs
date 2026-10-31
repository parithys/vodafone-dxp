// QID <-> Passport reconciliation at Customer Verification, and the Passport-to-QID update. Expectations are written from the rules and
// from a table of what each seeded registry person IS, not from the code under test.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

const data = (n) => JSON.parse(fs.readFileSync(`public/mock-data/${n}.json`, 'utf8'));
let link, p2q, save, nc;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  link = await load('/src/components/patterns/idLinkModel.ts');
  p2q = await load('/src/modules/identity-customer-management/passportToQidModel.ts');
  save = await load('/src/modules/new-connection/saveLinkedIdDocument.ts');
  nc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
});
after(close);

const docs = data('identity-documents');
const customers = data('customers');
const nas = data('nas-records');
const personOf = (n) => ({ name: n.name, dob: n.dob, nationality: n.nationality, linkedPassportNumber: n.linkedPassportNumber });

// What each registry-only person IS, written from the seed's own notes: three are plain new people, one has a linked Passport that no customer
// holds, one is the same person as an existing Passport customer.
const EXPECTED = {
  'NAS-7001': { kind: 'none' },
  'NAS-7002': { kind: 'none' },
  'NAS-7003': { kind: 'none' }, // linked Passport S7712345 is on file for nobody
  'NAS-7004': { kind: 'none' },
  'NAS-7005': { kind: 'linked', customerId: 'CUST-1002', via: 'passport' }, // Passport P0998812
  'NAS-7006': { kind: 'none' }, // the HRN demo person (Pakistani): a plain new person
};

test('SCENARIO 1: QID -> mapped Passport -> no Passport customer: the person is new (and the unmatched link is not mistaken for a customer)', () => {
  const anil = nas.find((n) => n.nasRecordId === 'NAS-7003');
  assert.equal(anil.linkedPassportNumber, 'S7712345');
  assert.ok(!docs.some((d) => d.documentNumber === 'S7712345'), 'no customer holds that Passport');
  assert.deepEqual(link.resolveExistingCustomer(personOf(anil), docs, customers, anil.documentNumber), { kind: 'none' });
});

test('SCENARIO 2: QID -> mapped Passport -> Passport customer exists: linked to THAT customer (no duplicate), with the QID to add to their record', () => {
  const bimal = nas.find((n) => n.nasRecordId === 'NAS-7005');
  assert.equal(bimal.linkedPassportNumber, 'P0998812');
  const r = link.resolveExistingCustomer(personOf(bimal), docs, customers, bimal.documentNumber);
  assert.deepEqual(r, { kind: 'linked', customerId: 'CUST-1002', via: 'passport', passportNumber: 'P0998812' });
  // The QID is new to the registry of documents: that is what makes adding it, rather than creating a customer, the right outcome.
  assert.ok(!docs.some((d) => d.documentNumber === bimal.documentNumber));
});

test('SCENARIO 3: QID -> existing QID customer: found by the document itself, and no number is held by two customers', () => {
  const qids = docs.filter((d) => d.documentType === 'QID');
  assert.ok(qids.length > 10);
  const owners = new Map();
  for (const d of docs) {
    assert.ok(!owners.has(d.documentNumber) || owners.get(d.documentNumber) === d.customerId, `${d.documentNumber} is held by two customers`);
    owners.set(d.documentNumber, d.customerId);
  }
  const found = docs.find((d) => d.documentNumber === '28456701234');
  assert.equal(found.customerId, 'CUST-1001');
});

test('every registry-only person resolves as the table says: nobody who is already a customer is treated as new, nobody new is linked', () => {
  for (const n of nas) {
    const r = link.resolveExistingCustomer(personOf(n), docs, customers, n.documentNumber);
    assert.ok(EXPECTED[n.nasRecordId], `${n.nasRecordId} needs an expected row`);
    assert.equal(r.kind, EXPECTED[n.nasRecordId].kind, n.nasRecordId);
    if (r.kind === 'linked') assert.equal(r.customerId, EXPECTED[n.nasRecordId].customerId);
  }
  // The identity fallback is only safe if no two customers are the same person.
  for (const c of customers) {
    const same = customers.filter((o) => link.samePerson(c, o));
    assert.equal(same.length, 1, `${c.customerId} shares name, date of birth and nationality with another customer`);
  }
});

test('a linked Passport that belongs to a DIFFERENT person is a conflict, not a link; so is a customer who holds another QID', () => {
  const bimal = personOf(nas.find((n) => n.nasRecordId === 'NAS-7005'));
  const other = link.resolveExistingCustomer({ ...bimal, nationality: 'Indian' }, docs, customers, '29007223400104');
  assert.equal(other.kind, 'conflict');
  assert.match(other.message, /CUST-1002/);
  // CUST-1001 holds QID 28456701234: the same person arriving with a different QID is not silently given a second one.
  const ahmed = customers.find((c) => c.customerId === 'CUST-1001');
  const diff = link.resolveExistingCustomer({ name: ahmed.name, dob: ahmed.dob, nationality: ahmed.nationality }, docs, customers, '29999999999');
  assert.equal(diff.kind, 'conflict');
  assert.match(diff.message, /28456701234/);
  assert.deepEqual(link.resolveExistingCustomer({ name: ahmed.name, dob: ahmed.dob, nationality: ahmed.nationality }, docs, customers, '28456701234').kind, 'linked');
});

test('with no link, the same name, date of birth and nationality finds the existing customer (duplicates are refused); more than one is an ambiguity', () => {
  const bimal = customers.find((c) => c.customerId === 'CUST-1002');
  const typed = { name: 'bimal  BAHADUR thapa', dob: bimal.dob, nationality: 'nepalese' };
  const r = link.resolveExistingCustomer(typed, docs, customers);
  assert.equal(r.kind, 'linked');
  assert.equal(r.via, 'identity');
  assert.match(link.duplicateCustomerMessage(r), /already on file \(CUST-1002\)/);
  assert.equal(link.duplicateCustomerMessage(link.resolveExistingCustomer({ name: 'Nobody Known', dob: '2000-01-01', nationality: 'Qatari' }, docs, customers)), undefined);
  const twin = [...customers, { ...bimal, customerId: 'CUST-TWIN' }];
  assert.equal(link.resolveExistingCustomer(typed, docs, twin).kind, 'conflict');
});

test('the document added for a linked QID has the shape of identity-documents.json, is added once, and only to the linked customer', async () => {
  const update = { customerId: 'CUST-1002', documentType: 'QID', documentNumber: '29007223400104', expiryDate: '2031-02-28', via: 'passport', passportNumber: 'P0998812' };
  const rec = link.qidDocumentRecord(update, new Date('2026-10-22T09:00:00Z'));
  for (const k of ['identityDocumentId', 'customerId', 'documentType', 'documentNumber', 'expiryDate', 'validationPath', 'status', 'docStatus', 'serviceReference']) assert.ok(k in rec, k);
  assert.equal(rec.customerId, 'CUST-1002');
  const created = [];
  const create = async (kind, r) => void created.push({ kind, r });
  assert.equal(await save.saveLinkedIdDocument(update, create, async () => docs), true);
  assert.equal(created.length, 1);
  assert.equal(created[0].kind, 'identity-documents');
  assert.equal(await save.saveLinkedIdDocument(update, create, async () => [...docs, { customerId: 'CUST-1002', documentNumber: '29007223400104' }]), false, 'never a duplicate document');
  assert.equal(await save.saveLinkedIdDocument(undefined, create, async () => docs), false);
  assert.equal(created.length, 1);
});

test('submitting an order for a linked person adds the QID to the EXISTING customer and creates no second customer', async () => {
  const run = async (linkedIdUpdate) => {
    const created = [];
    await nc.submitNewConnectionOrder(
      {
        contact: { idNumber: '29007223400104', idType: 'QID', email: 'bimal@example.qa', moiResult: { name: 'Bimal Bahadur Thapa', nationality: 'Nepalese', dob: '1990-07-22', customerId: 'CUST-1002', linkedIdUpdate } },
        eligibility: { customerId: 'CUST-1002', checks: [], nationality: 'Nepalese' },
        productId: 'PROD-104',
      },
      { flow: 'new', createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async () => {} }
    );
    return created;
  };
  const withLink = await run({ customerId: 'CUST-1002', documentType: 'QID', documentNumber: '29007223400104', expiryDate: '2031-02-28', via: 'passport', passportNumber: 'P0998812' });
  const doc = withLink.find((c) => c.kind === 'identity-documents');
  assert.ok(doc, 'the QID is added to the customer');
  assert.equal(doc.rec.customerId, 'CUST-1002');
  assert.ok(!withLink.some((c) => c.kind === 'customers'), 'no customer is created');
  const order = withLink.find((c) => c.kind === 'orders').rec;
  assert.equal(order.customerId, 'CUST-1002');
  assert.deepEqual(order.idLink, { customerId: 'CUST-1002', via: 'passport', passportNumber: 'P0998812', qid: '29007223400104' });
  const without = await run(undefined);
  assert.ok(!without.some((c) => c.kind === 'identity-documents'), 'nothing to add when nothing was linked');
  assert.equal(without.find((c) => c.kind === 'orders').rec.idLink, undefined);
});

// ---- Passport to QID update --------------------------------------------------------------------------------------------------------
const wizardData = { customers: data('customers'), documents: docs, assets: data('installed-assets'), accounts: data('accounts') };

test('Passport to QID: the Passport must be on file under the customer who owns the line', () => {
  const ok = p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'P0998812' }, wizardData);
  assert.equal(ok.ok, true);
  assert.equal(ok.owner.customerId, 'CUST-1002');
  assert.ok(ok.owner.passportDocumentId);
  assert.equal(p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'p0998812' }, wizardData).ok, true, 'case');
  const stranger = p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'E58321097' }, wizardData);
  assert.equal(stranger.ok, false);
  assert.match(stranger.message, /CUST-3016/);
  assert.match(p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'NOPE123' }, wizardData).message, /not on file/);
  assert.match(p2q.checkPassportOwner({ msisdn: '+97400000000', passportNumber: 'P0998812' }, wizardData).message, /No customer/);
});

test('Passport to QID: every line owner the check names is the account holder of that line (whole installed base)', () => {
  const acct = new Map(wizardData.accounts.map((a) => [a.accountId, a.customerId]));
  let checked = 0;
  for (const a of wizardData.assets.filter((x) => (x.serviceId ?? '').startsWith('+974') && acct.has(x.accountId))) {
    assert.equal(p2q.ownerOfMsisdn(a.serviceId, wizardData), acct.get(a.accountId), a.serviceId);
    checked++;
  }
  assert.ok(checked > 100);
});

test('Passport to QID: the QID must be the owner\'s - not another customer\'s, not a stranger\'s', () => {
  const owner = p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'P0998812' }, wizardData).owner;
  const same = { name: 'Bimal Bahadur Thapa', dob: '1990-07-22', nationality: 'Nepalese' };
  assert.equal(p2q.qidProblem(owner, undefined), undefined);
  assert.equal(p2q.qidProblem(owner, { ...same, linkedIdUpdate: { customerId: 'CUST-1002' } }), undefined);
  assert.equal(p2q.qidProblem(owner, { ...same }), undefined, 'the registry knows the same person');
  assert.match(p2q.qidProblem(owner, { ...same, customerId: 'CUST-1001' }), /already belongs to customer CUST-1001/);
  assert.match(p2q.qidProblem(owner, { ...same, linkedIdUpdate: { customerId: 'CUST-1001' } }), /linked to customer CUST-1001/);
  assert.match(p2q.qidProblem(owner, { name: 'Someone Else', dob: '1990-07-22', nationality: 'Nepalese' }), /different person/);
  assert.equal(p2q.qidProblem(owner, { ...same, customerId: 'CUST-1002' }), undefined);
});

test('Passport to QID: the update adds the QID, retires the Passport and updates the customer', () => {
  const owner = p2q.checkPassportOwner({ msisdn: '+97455512002', passportNumber: 'P0998812' }, wizardData).owner;
  const w = p2q.passportToQidWrites(owner, { number: '29007223400104', expiryDate: '2031-02-28' });
  assert.equal(w.qidDocument.customerId, 'CUST-1002');
  assert.equal(w.qidDocument.documentNumber, '29007223400104');
  assert.equal(w.retirePassport.id, owner.passportDocumentId);
  assert.equal(w.retirePassport.patch.docStatus, 'Archived');
  assert.deepEqual(w.customerPatch, { idType: 'QID', qid: '29007223400104' });
  const src = fs.readFileSync('src/modules/identity-customer-management/screens/PassportToQidWizard.tsx', 'utf8');
  for (const needle of ["createRecord('identity-documents'", "updateRecord('identity-documents'", "updateRecord('customers'", 'allowNewCustomer={false}']) assert.ok(src.includes(needle), needle);
});

// ---- the data ------------------------------------------------------------------------------------------------------------------------
test('every ID document is filed under its own type: a QID is 11-14 digits, a Passport is not a number (CUST-9001 was swapped)', () => {
  for (const d of docs) {
    if (d.documentType === 'QID') assert.match(d.documentNumber, /^\d{11,14}$/, `${d.customerId} QID ${d.documentNumber}`);
    if (d.documentType === 'Passport') assert.ok(!/^\d+$/.test(d.documentNumber), `${d.customerId} Passport ${d.documentNumber} looks like a QID`);
  }
  const mine = docs.filter((d) => d.customerId === 'CUST-9001');
  assert.deepEqual(mine.map((d) => [d.documentType, d.documentNumber]).sort(), [['Passport', 'P1234567'], ['QID', '12345678910']]);
  const cust = customers.find((c) => c.customerId === 'CUST-9001');
  assert.equal(cust.qid, '12345678910', 'the customer record carries the QID, not the Passport');
  assert.equal(data('customer-contacts').find((c) => c.customerId === 'CUST-9001').idNumber, '12345678910');
});

test('the lookup, the eligibility step, the submits and the wizard are wired to the link', () => {
  const hook = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.match(hook, /resolveExistingCustomer\(/g);
  assert.ok((hook.match(/resolveExistingCustomer\(/g) ?? []).length >= 2, 'both the registry-only path and the typed-new-customer guard');
  assert.match(hook, /linkedIdUpdate: linked/);
  assert.match(fs.readFileSync('src/capabilities/EligibilityGate/EligibilityGateStep.tsx', 'utf8'), /linkedIdDocument/);
  for (const f of ['src/modules/new-connection/submitNewConnectionOrder.ts', 'src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts', 'src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts', 'src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts', 'src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts']) {
    assert.match(fs.readFileSync(f, 'utf8'), /saveLinkedIdDocument\(/, f);
  }
});

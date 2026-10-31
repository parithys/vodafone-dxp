import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

// Actual User: who will use the line when it is not the customer who owns it.
let m, sub, caf;
before(async () => {
  await boot();
  m = await load('/src/capabilities/ActualUser/actualUserModel.ts');
  sub = await load('/src/capabilities/ActualUser/submit.ts');
  caf = await load('/src/capabilities/CafSignature/step.tsx');
});
after(close);

const identified = (over = {}) => ({
  choice: 'other',
  identity: { idType: 'QID', idNumber: '29001012345', email: 'sara@example.qa', moiResult: { name: 'Sara Al-Kuwari', dob: '1990-05-20', nationality: 'Qatari', customerId: 'CUST-1002', email: 'old@example.qa' }, ...over },
});

test('the primary customer using the line needs nothing more; no choice means the same', () => {
  assert.equal(m.isActualUserValid(undefined, '1'), true);
  assert.equal(m.isActualUserValid({ choice: 'primary' }, '1'), true);
  assert.deepEqual(m.supplementaryRows({ choice: 'primary' }), []);
  assert.deepEqual(sub.actualUserOrderFields({ choice: 'primary' }), {});
});

test('an actual user must be identified (MOI), have a valid email, and be a different person', () => {
  assert.equal(m.isActualUserValid({ choice: 'other' }, '1'), false, 'chosen but nobody identified');
  assert.equal(m.isActualUserValid(identified({ moiResult: undefined }), '1'), false, 'no MOI result');
  assert.equal(m.isActualUserValid(identified({ email: 'not-an-email' }), '1'), false, 'bad email');
  assert.equal(m.isActualUserValid(identified({ altPhone: '123' }), '1'), false, 'bad alternate phone');
  assert.equal(m.isActualUserValid(identified(), '29001012345'), false, 'the primary customer is not an actual user');
  assert.equal(m.isActualUserValid(identified(), ' 29001012345 '.trim().toLowerCase()), false);
  assert.equal(m.isActualUserValid(identified(), '28456701234'), true);
});

test('the actual user must be 18 or over: a minor cannot be added; unknown age blocks; no eligibility check is run for them', async () => {
  const on = new Date('2026-10-21');
  const withDob = (dob) => identified({ moiResult: { name: 'X', dob, nationality: 'Qatari' } }).identity;
  assert.match(m.actualUserAgeProblem(withDob('2008-10-22'), on), /18 or over/, '17 on the day before the 18th birthday');
  assert.equal(m.actualUserAgeProblem(withDob('2008-10-21'), on), undefined, 'exactly 18 is allowed');
  assert.equal(m.actualUserAgeProblem(withDob('1990-01-01'), on), undefined);
  assert.match(m.actualUserAgeProblem(withDob('2015-01-01'), on), /minor/);
  assert.match(m.actualUserAgeProblem(withDob(undefined), on), /not on record/);
  assert.equal(m.isActualUserValid(identified({ moiResult: { name: 'Minor', dob: '2015-01-01', nationality: 'Qatari' } }), '1'), false, 'a minor is rejected');
  assert.equal(m.isActualUserValid(identified(), '1'), true, 'an adult is accepted');
  // The primary stays accountable: none of the primary's eligibility checks is wired into this capability.
  const fs = await import('node:fs');
  for (const f of fs.readdirSync('src/capabilities/ActualUser').filter((n) => /\.tsx?$/.test(n))) {
    assert.ok(!/EligibilityGate|blacklist|isHrn|connectionLimit|checkEligibility/i.test(fs.readFileSync(`src/capabilities/ActualUser/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')), `${f} must not run eligibility checks`);
  }
});

test('the Supplementary Form rows and the order record carry the actual user', () => {
  const rows = m.supplementaryRows(identified());
  assert.equal(rows[0].value, 'Sara Al-Kuwari');
  assert.ok(rows.some((r) => r.label === 'Email' && r.value === 'sara@example.qa'));
  const f = sub.actualUserOrderFields(identified());
  assert.equal(f.actualUser.customerId, 'CUST-1002');
  assert.equal(f.supplementaryForm.signedWithCaf, true);
});

test('an existing customer\'s changed email is written back to their record; unchanged or new writes nothing', async () => {
  const calls = [];
  const update = async (...a) => calls.push(a);
  assert.equal(await sub.saveActualUserContact(identified(), update), true);
  assert.deepEqual(calls[0], ['customers', 'customerId', 'CUST-1002', { email: 'sara@example.qa' }]);
  calls.length = 0;
  assert.equal(await sub.saveActualUserContact(identified({ email: 'old@example.qa' }), update), false, 'email unchanged');
  assert.equal(await sub.saveActualUserContact(identified({ moiResult: { name: 'New Person', dob: '01/01/2000', nationality: 'Qatari', isNewCustomer: true } }), update), false, 'a new person has no record');
  assert.equal(await sub.saveActualUserContact({ choice: 'primary' }, update), false);
  assert.equal(calls.length, 0);
});

test('with an actual user: one primary signature covers both forms (after both consents); the secondary contact signs the Supplementary Form on their own', () => {
  const step = caf.cafSignatureStep({ variant: 'full' });
  const primary = { cafType: 'Digital', signatureDataUrl: 'data:image/png;base64,AA' };
  assert.equal(step.isValid({ caf: primary }), true, 'no actual user: the one signature is enough');
  assert.equal(step.isValid({ caf: primary, actualUser: { choice: 'primary' } }), true);
  assert.equal(step.isValid({ caf: primary, actualUser: identified() }), false, 'primary consent and the secondary signature are missing');
  assert.equal(step.isValid({ caf: { ...primary, supplementaryAgreed: true }, actualUser: identified() }), false, 'the secondary contact has not signed');
  assert.equal(step.isValid({ caf: { ...primary, secondarySignatureDataUrl: 'data:image/png;base64,BB' }, actualUser: identified() }), false, 'the primary has not agreed to the Supplementary Form');
  assert.equal(step.isValid({ caf: { ...primary, supplementaryAgreed: true, secondarySignatureDataUrl: 'data:image/png;base64,BB' }, actualUser: identified() }), true);
});

test('the demo reader presents someone else, by rule: 18 or over, not the primary, an unexpired QID with a real number', () => {
  const on = new Date('2026-10-21');
  const customers = [{ customerId: 'M', dob: '2012-01-01' }, { customerId: 'A', dob: '1985-03-12' }, { customerId: 'B', dob: '1990-05-20' }, { customerId: 'C', dob: '1992-01-01' }, { customerId: 'D', dob: '1988-03-15' }];
  const docs = [
    { customerId: 'M', documentType: 'QID', documentNumber: '31201010000099', expiryDate: '2030-01-01' },
    { customerId: 'A', documentType: 'QID', documentNumber: '28456701234', expiryDate: '2029-11-30' },
    { customerId: 'B', documentType: 'QID', documentNumber: 'P1234567', expiryDate: '2029-11-30' },
    { customerId: 'C', documentType: 'QID', documentNumber: '31201010000012', expiryDate: '2025-01-01' },
    { customerId: 'D', documentType: 'QID', documentNumber: '31403153400090', expiryDate: '2030-03-31' },
  ];
  assert.equal(m.pickDemoReaderCustomer(customers, docs, 'A', on), 'D', 'a minor, the primary, an odd number and an expired card are all skipped');
  assert.equal(m.pickDemoReaderCustomer(customers, docs, 'D', on), 'A', 'the primary is never offered; the next qualifying adult is');
  assert.equal(m.pickDemoReaderCustomer(customers.filter((c) => c.customerId === 'D'), docs, 'D', on), undefined, 'nobody else qualifies');
  assert.equal(m.pickDemoReaderCustomer([], docs, 'A', on), undefined);
});

test('the line is counted against the primary customer, never the actual user: the submitted records carry only the primary\'s ID', async () => {
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  const nc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
  const run = async (actualUser) => {
    const created = [];
    const updated = [];
    await nc.submitNewConnectionOrder(
      {
        contact: { idNumber: '28456701234', idType: 'QID', email: 'primary@example.qa', moiResult: { name: 'Primary', nationality: 'Qatari', dob: '1985-03-12', customerId: 'CUST-1001' } },
        eligibility: { customerId: 'CUST-1001', checks: [], nationality: 'Qatari' },
        productId: 'PROD-104',
        actualUser,
      },
      { flow: 'existing', createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, id, patch }) }
    );
    return { created, updated };
  };
  const other = identified({ moiResult: { name: 'Sara', dob: '1990-05-20', nationality: 'Qatari', customerId: 'CUST-1002', email: 'old@example.qa' } });
  const [without, withUser] = [await run(undefined), await run(other)];
  const ownerIds = (r) => r.created.map((c) => c.rec.customerId).filter(Boolean);
  assert.ok(ownerIds(withUser).length > 0, 'the order is owned by someone');
  assert.deepEqual([...new Set(ownerIds(withUser))], ['CUST-1001'], 'every created record belongs to the primary customer');
  assert.deepEqual(withUser.created.map((c) => c.kind), without.created.map((c) => c.kind), 'adding an actual user creates no extra record (no line of their own)');
  const order = withUser.created.find((c) => c.kind === 'orders').rec;
  assert.equal(order.actualUser.customerId, 'CUST-1002', 'the actual user is only named on the order');
  assert.equal(order.customerId, 'CUST-1001');
  // The only write that touches the actual user's own record is their confirmed email - no line count, no status.
  const theirs = withUser.updated.filter((u) => u.id === 'CUST-1002');
  assert.deepEqual(theirs.map((u) => Object.keys(u.patch)), [['email']]);
  assert.ok(!withUser.updated.some((u) => u.id === 'CUST-1002' && /Lines$/.test(Object.keys(u.patch).join())));
});

// ---- Secondary Contact who is already a customer: pre-fill from the record, write changes back -------------------------------------
const existing = (over = {}, moi = {}) =>
  identified({ altPhone: '+97455512002', email: 'old@example.qa', moiResult: { name: 'Sara', dob: '1990-05-20', nationality: 'Qatari', customerId: 'CUST-1002', email: 'old@example.qa', phone: '+97455512002', ...moi }, ...over });

test('identifying an existing customer pre-fills their phone from the record, once; a new person, a different resolved person and bad data behave', () => {
  const fresh = { moiResult: { name: 'Sara', dob: '1990-05-20', nationality: 'Qatari', customerId: 'CUST-1002', email: 'old@example.qa', phone: '+97455512002' }, email: 'old@example.qa' };
  assert.equal(m.withRecordPhone(undefined, fresh).altPhone, '+97455512002', 'the record phone is pre-filled');
  const edited = { ...fresh, altPhone: '+97455599999' };
  assert.equal(m.withRecordPhone(fresh, edited).altPhone, '+97455599999', 'the same person re-resolved keeps what the agent typed');
  assert.equal(m.withRecordPhone({ ...fresh, moiResult: { ...fresh.moiResult, customerId: 'CUST-1003' } }, edited).altPhone, '+97455512002', 'a different person re-seeds');
  assert.equal(m.withRecordPhone(undefined, { ...fresh, moiResult: { ...fresh.moiResult, isNewCustomer: true } }).altPhone, undefined, 'a new person has no record');
  assert.equal(m.withRecordPhone(undefined, { ...fresh, moiResult: { ...fresh.moiResult, phone: '+97444123456' } }).altPhone, undefined, 'a landline is not a valid mobile: left empty, not guessed');
  assert.equal(m.withRecordPhone(undefined, { ...fresh, moiResult: { ...fresh.moiResult, phone: undefined } }).altPhone, undefined, 'no phone on record stays empty');
  assert.equal(m.withRecordPhone(undefined, { name: 'x' }).altPhone, undefined, 'nothing resolved yet');
});

test('a changed phone is written to the existing contact-level record, and a changed email to the customer record; unchanged or cleared writes nothing', async () => {
  const contacts = [{ contactRecordId: 'CTC-4002', customerId: 'CUST-1002' }, { contactRecordId: 'CTC-4001', customerId: 'CUST-1001' }];
  const list = async () => contacts;
  const calls = [];
  const update = async (...a) => void calls.push(a);
  // Phone only.
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: '+97455599999' }), update, list), true);
  assert.deepEqual(calls, [['customer-contacts', 'contactRecordId', 'CTC-4002', { cellNumber: '+97455599999' }]]);
  // Email and phone: each to its own record, and no other customer's record is touched.
  calls.length = 0;
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: '+97455599999', email: 'new@example.qa' }), update, list), true);
  assert.deepEqual(calls, [['customers', 'customerId', 'CUST-1002', { email: 'new@example.qa' }], ['customer-contacts', 'contactRecordId', 'CTC-4002', { cellNumber: '+97455599999' }]]);
  // Same number in another shape (spaces, no +) is not a change.
  calls.length = 0;
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: '974 5551 2002' }), update, list), false);
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: undefined }), update, list), false, 'a cleared phone does not blank the record');
  // No contact-level record on file: nothing is created.
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: '+97455599999' }), update, async () => []), false);
  // A new person has no record to update.
  assert.equal(await sub.saveActualUserContact(existing({ altPhone: '+97455599999' }, { isNewCustomer: true }), update, list), false);
  assert.equal(calls.length, 0);
});

test('submitting the order writes the Secondary Contact\'s changed phone to their contact record, never to the primary\'s', async () => {
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  const nc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
  const updated = [];
  await nc.submitNewConnectionOrder(
    {
      contact: { idNumber: '28456701234', idType: 'QID', email: 'primary@example.qa', moiResult: { name: 'Primary', nationality: 'Qatari', dob: '1985-03-12', customerId: 'CUST-1001' } },
      eligibility: { customerId: 'CUST-1001', checks: [], nationality: 'Qatari' },
      productId: 'PROD-104',
      actualUser: existing({ altPhone: '+97455599999' }),
    },
    { flow: 'existing', createRecord: async () => {}, updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, id, patch }) }
  );
  const contactWrites = updated.filter((u) => u.kind === 'customer-contacts');
  assert.equal(contactWrites.length, 1);
  assert.equal(contactWrites[0].patch.cellNumber, '+97455599999');
  const contactsOf = JSON.parse((await import('node:fs')).readFileSync('public/mock-data/customer-contacts.json', 'utf8'));
  assert.equal(contactsOf.find((c) => c.contactRecordId === contactWrites[0].id)?.customerId, 'CUST-1002', 'it is the Secondary Contact\'s own contact record');
});

test('a Secondary Contact\'s email and mobile from the registry are masked and read-only, an existing customer included; the primary page rule is unchanged', async () => {
  const cm = await load('/src/components/patterns/guidedContactModel.ts');
  const existing = { email: 'sophie.laurent@embassy.example', personalMobile: '55512001', moiResult: { customerId: 'CUST-1001', isNewCustomer: false, email: 'sophie.laurent@embassy.example', phone: '55512001' } };
  // as a Secondary Contact (registry)
  assert.equal(cm.displayedEmail(existing, { registry: true }), cm.maskEmail(existing.email));
  assert.equal(cm.displayedMobile(existing, { registry: true }), cm.maskMobile('55512001'));
  // on the primary page an existing customer's own values are not masked (unchanged)
  assert.equal(cm.displayedEmail(existing), existing.email);
  assert.equal(cm.displayedMobile(existing), undefined);
  // what the agent types instead is shown as typed; a person the registry knows nothing about is never masked
  assert.equal(cm.displayedEmail({ ...existing, email: 'other@example.qa' }, { registry: true }), 'other@example.qa');
  assert.equal(cm.displayedEmail({ email: 'x@example.qa', moiResult: {} }, { registry: true }), 'x@example.qa');
  assert.equal(cm.displayedMobile({ personalMobile: '55512001', moiResult: { customerId: 'C' } }, { registry: true }), undefined);
});

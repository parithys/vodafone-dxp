// Secondary Contact under 18: not added through the standard flow; the Exception Request (Court Order) is the one way on, and holds the order for approval.
// "Scan Below 18" is the demo reader presenting an under-18 person of the primary contact's nationality.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let m;
before(async () => {
  await boot();
  m = await load('/src/capabilities/ActualUser/actualUserModel.ts');
});
after(close);

const read = (f) => JSON.parse(fs.readFileSync(`public/mock-data/${f}.json`, 'utf8'));
const AS_OF = new Date('2026-11-04T00:00:00Z');
const person = (dob, idNumber = '28000000001') => ({ idNumber, email: 'a@example.qa', moiResult: { name: 'X', dob, nationality: 'Qatari' } });
const doc = { id: 'd1', label: 'Court Type Order', fileName: 'order.pdf', sizeBytes: 10 };

test('a minor is told apart from an unknown date of birth: only a date on record under 18 is a minor', () => {
  assert.equal(m.actualUserIsMinor(person('2010-05-20'), AS_OF), true);
  assert.equal(m.actualUserIsMinor(person('2008-11-05'), AS_OF), true, 'turns 18 tomorrow');
  assert.equal(m.actualUserIsMinor(person('2008-11-04'), AS_OF), false, 'turns 18 today');
  assert.equal(m.actualUserIsMinor(person(undefined), AS_OF), false, 'unknown is not a minor');
  assert.equal(m.actualUserIsMinor(undefined, AS_OF), false);
});

test('standard flow: an under-18 Secondary Contact is not valid; only the Exception Request for THAT person makes it valid', () => {
  const minor = person('2010-05-20');
  const v = { choice: 'other', identity: minor };
  assert.equal(m.isActualUserValid(v, '28999999999'), false, 'no exception: a minor cannot be added');
  const withEx = { ...v, exception: { document: doc, idNumber: minor.idNumber, submittedAt: 'x' } };
  assert.equal(m.minorExceptionHolds(withEx), true);
  assert.equal(m.isActualUserValid(withEx, '28999999999'), true);
  // The exception was for another person, or the document is gone: it does not stand.
  assert.equal(m.minorExceptionHolds({ ...withEx, identity: person('2010-05-20', '28000000002') }), false);
  assert.equal(m.isActualUserValid({ ...withEx, identity: person('2010-05-20', '28000000002') }, '28999999999'), false);
  assert.equal(m.minorExceptionHolds({ ...withEx, exception: undefined }), false);
  // The exception never waives anything for an adult, an unknown age, or the primary customer themself.
  assert.equal(m.minorExceptionHolds({ choice: 'other', identity: person('1990-01-01'), exception: { document: doc, idNumber: '28000000001', submittedAt: 'x' } }), false);
  assert.equal(m.isActualUserValid({ choice: 'other', identity: person(undefined), exception: { document: doc, idNumber: '28000000001', submittedAt: 'x' } }, '28999999999'), false, 'unknown stays unknown');
  assert.equal(m.isActualUserValid(withEx, minor.idNumber), false, 'the primary customer is not their own Secondary Contact');
  assert.equal(m.isActualUserValid({ choice: 'other', identity: person('1990-01-01') }, '28999999999'), true, 'an adult needs none');
});

test('Scan Below 18 presents someone under 18, of the primary contact\'s nationality, with a usable unexpired QID - checked over the whole customer data, both ways', () => {
  const customers = read('customers');
  const docs = read('identity-documents');
  const age = (dob) => { const [y, mo, d] = dob.split('-').map(Number); return AS_OF.getUTCFullYear() - y - ((AS_OF.getUTCMonth() + 1 < mo || (AS_OF.getUTCMonth() + 1 === mo && AS_OF.getUTCDate() < d)) ? 1 : 0); };
  const usable = (id) => docs.some((d) => d.customerId === id && d.documentType === 'QID' && /^\d{11,14}$/.test(d.documentNumber) && (!d.expiryDate || new Date(d.expiryDate) >= AS_OF));
  const nationalities = [...new Set(customers.map((c) => c.nationality))];
  for (const nat of nationalities) {
    // Independent expectation: the under-18 customers of that nationality that hold a usable QID.
    const expected = customers.filter((c) => c.nationality === nat && age(c.dob) < 18 && usable(c.customerId)).map((c) => c.customerId);
    const got = m.pickDemoUnderEighteenCustomer(customers, docs, undefined, nat, AS_OF);
    if (expected.length === 0) assert.equal(got, undefined, `${nat}: nobody qualifies, so nobody is presented`);
    else assert.ok(expected.includes(got), `${nat}: ${got}`);
    if (got) {
      const c = customers.find((x) => x.customerId === got);
      assert.equal(c.nationality, nat);
      assert.ok(age(c.dob) < 18);
    }
  }
  assert.ok(m.pickDemoUnderEighteenCustomer(customers, docs, undefined, 'Qatari', AS_OF), 'the demo data has an under-18 Qatari');
  assert.equal(m.pickDemoUnderEighteenCustomer(customers, docs, undefined, undefined, AS_OF), undefined, 'no nationality, no match');
  assert.equal(m.pickDemoUnderEighteenCustomer(customers, docs, undefined, '  qatari ', AS_OF) !== undefined, true, 'case and spacing do not matter');
  // Never the primary customer themself.
  const first = m.pickDemoUnderEighteenCustomer(customers, docs, undefined, 'Qatari', AS_OF);
  assert.notEqual(m.pickDemoUnderEighteenCustomer(customers, docs, first, 'Qatari', AS_OF), first);
});

test('wiring: the link is before Initiate scan, runs the same scan, is demo-only; the exception holds the order for approval with the Court Order attached', () => {
  const scanner = fs.readFileSync('src/components/domain/QidImageUpload.tsx', 'utf8');
  const link = scanner.indexOf('demoVariant.label');
  const button = scanner.indexOf("'Initiate scan'");
  assert.ok(link > -1 && link < button, 'the text link comes immediately before the button');
  assert.match(scanner, /demoVariant && SHOW_DEMO_CONTENT/);
  assert.match(scanner, /setTimeout\(\(\) => runScanRef\.current\(\), 0\)/, 'the same reader pass, from the latest render');
  assert.match(scanner, /capturedFromCard\(documentType, identityRef\.current\)/, 'what the pass reads is the card at its end');
  const au = fs.readFileSync('src/capabilities/ActualUser/ActualUser.tsx', 'utf8');
  assert.match(au, /label: 'Scan Below 18'/);
  assert.match(au, /Apply for Exception/);
  assert.match(au, /isMinor && \(/, 'the exception is offered for a minor only');
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /minorContactException \|\|/, 'the order is held for approval');
  assert.match(submit, /Under-18 Secondary Contact exception - Court Order attached/);
  assert.match(fs.readFileSync('src/capabilities/ActualUser/submit.ts', 'utf8'), /underEighteenException/);
});

test('"Scan Below 18" can present someone for a primary contact of EVERY nationality the customer data holds', () => {
  const customers = read('customers');
  const docs = read('identity-documents');
  const asOf = new Date('2026-11-04T00:00:00Z');
  for (const nat of [...new Set(customers.map((c) => c.nationality))]) {
    const id = m.pickDemoUnderEighteenCustomer(customers, docs, undefined, nat, asOf);
    assert.ok(id, `${nat}: an under-18 of the same nationality is on file`);
    assert.equal(customers.find((c) => c.customerId === id).nationality, nat);
  }
});

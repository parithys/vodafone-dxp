// A Passport needs a valid visa from MOI: without one the journey hard-stops. The visa details MOI returns are kept on the customer's record
// and on the order, never displayed in a journey, and shown in Customer 360. Expectations are written from the rule, over the whole data.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let visa, engine;
const NOW = new Date('2026-11-01');
before(async () => {
  await boot();
  visa = await load('/src/data/passportVisa.ts');
  engine = await load('/src/engines/eligibilityEngine.ts');
});
after(close);
const docs = JSON.parse(fs.readFileSync('public/mock-data/identity-documents.json', 'utf8'));
const passports = docs.filter((d) => d.documentType === 'Passport');

const checks = (doc) =>
  engine.evaluateEligibilityChecks(
    { customer: { customerId: 'C', idType: doc.documentType, dob: '1990-01-01', blacklisted: false }, doc, deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5', scope: 'common' },
    NOW
  );
const visaCheck = (doc) => checks(doc).find((c) => c.id === 'visa-validity');

test('a visa is valid only with a number and an expiry after today; the expiry day itself and an unreadable date are not', () => {
  const v = { visaNumber: 'V1', visaType: 'Work Visa', expiryDate: '2027-01-01' };
  assert.equal(visa.isVisaValid(v, NOW), true);
  assert.equal(visa.isVisaValid({ ...v, expiryDate: '2026-11-01' }, NOW), false, 'expires today');
  assert.equal(visa.isVisaValid({ ...v, expiryDate: '2026-10-31' }, NOW), false, 'expired');
  assert.equal(visa.isVisaValid({ ...v, expiryDate: 'soon' }, NOW), false);
  assert.equal(visa.isVisaValid({ ...v, visaNumber: ' ' }, NOW), false);
  assert.equal(visa.isVisaValid(undefined, NOW), false);
});

test('what MOI returns is kept only when complete', () => {
  assert.deepEqual(visa.visaFromMoi({ visaNumber: ' V1 ', visaType: 'Work Visa', expiryDate: '2027-01-01' }), { visaNumber: 'V1', visaType: 'Work Visa', expiryDate: '2027-01-01' });
  assert.equal(visa.visaFromMoi({ visaNumber: 'V1', expiryDate: '2027-01-01' }), undefined, 'no type');
  assert.equal(visa.visaFromMoi(undefined), undefined);
});

test('every Passport in the inventory: a valid visa passes, an expired or missing one is a hard stop - and no other ID type has the check', () => {
  assert.ok(passports.length >= 5);
  let passed = 0, stopped = 0;
  for (const d of passports) {
    const c = visaCheck(d);
    assert.ok(c, d.documentNumber);
    const valid = visa.isVisaValid(d.visa, NOW);
    assert.equal(c.outcome, valid ? 'pass' : 'hard-stop', `${d.documentNumber}`);
    assert.equal(c.passed, valid);
    if (valid) passed++; else stopped++;
  }
  assert.ok(passed > 0 && stopped > 0, 'the data exercises both outcomes');
  assert.ok(passports.some((d) => !d.visa), 'one Passport has no visa at all');
  assert.ok(passports.some((d) => d.visa && !visa.isVisaValid(d.visa, NOW)), 'one has an expired visa');
  for (const d of docs.filter((x) => x.documentType !== 'Passport')) assert.equal(visaCheck(d), undefined, `${d.documentType} ${d.documentNumber}`);
});

test('the hard stop blocks the journey and says nothing about the visa itself', () => {
  const noVisa = passports.find((d) => !d.visa);
  const c = visaCheck(noVisa);
  assert.equal(engine.hasHardStop(checks(noVisa)), true);
  assert.equal(c.message, 'No valid visa was found for this Passport. The journey cannot continue.');
  const expired = passports.find((d) => d.visa && !visa.isVisaValid(d.visa, NOW));
  const shown = JSON.stringify(visaCheck(expired));
  for (const secret of [expired.visa.visaNumber, expired.visa.visaType, expired.visa.expiryDate]) assert.ok(!shown.includes(secret), `the check does not show ${secret}`);
  // A Passport someone typed in (no MOI record, so no visa) is stopped the same way.
  assert.equal(visaCheck({ documentType: 'Passport', documentNumber: 'X1', expiryDate: '2030-01-01' }).outcome, 'hard-stop');
});

test('the visa is kept on the customer record and the order, shown in Customer 360, and shown nowhere in a journey', () => {
  const lookup = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.match(lookup, /passportVisa = docMatch\?\.documentType === 'Passport' \? visaFromMoi\(docMatch\.visa\)/);
  assert.match(lookup, /\{ passportVisa \}, \{ how: 'MOI visa details', by: 'MOI' \}/);
  assert.match(fs.readFileSync('src/modules/new-connection/contactIdentityOrderFields.ts', 'utf8'), /customerVisa: contact\.moiResult\.visa/);
  const c360 = fs.readFileSync('src/workspace/customer360/sections/C360ContactIdentity.tsx', 'utf8');
  for (const label of ['Visa Number', 'Visa Type', 'Visa Expiry Date']) assert.match(c360, new RegExp(`label: '${label}'`));
  // No journey component reads the visa to show it.
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
  const readers = walk('src').filter((f) => /\.tsx$/.test(f) && /visaNumber|visaType|\.visa\b|passportVisa/.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(readers.map((f) => f.replace(/^src\//, '')).sort(), ['workspace/customer360/sections/C360ContactIdentity.tsx']);
});

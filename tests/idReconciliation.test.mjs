// ID reconciliation: each attribute captured from the scanned ID (number, expiry, name, date of birth, nationality) is compared with MOI's,
// the result is kept per attribute, and progression needs every captured attribute to match. Expectations are written from the rule.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let r, preview, upload;
before(async () => {
  await boot();
  r = await load('/src/components/patterns/idReconciliation.ts');
  preview = await load('/src/components/domain/ScannedIdPreview.tsx');
  upload = await load('/src/components/domain/idUploadModel.ts');
});
after(close);

const moi = { idNumber: '28456701234', expiry: '2029-11-30', name: 'Ahmed Abdulla Hassan Al-Sulaiti', dob: '1985-03-12', nationality: 'Qatari' };
const card = { idNumber: '28456701234', expiry: '30/11/2029', name: 'Ahmed Abdulla Hassan Al-Sulaiti', dob: '12/03/1985', nationality: 'Qatari' };
const byAttr = (list) => Object.fromEntries(list.map((a) => [a.attribute, a.result]));

test('all five attributes are compared and each result is kept; DD/MM/YYYY and ISO dates are the same date', () => {
  const list = r.reconcileIdentity(card, moi);
  assert.deepEqual(list.map((a) => a.attribute), ['idNumber', 'expiry', 'name', 'dob', 'nationality']);
  assert.deepEqual(byAttr(list), { idNumber: 'match', expiry: 'match', name: 'match', dob: 'match', nationality: 'match' });
  assert.equal(list[1].captured, '30/11/2029');
  assert.equal(list[1].moi, '2029-11-30');
  assert.equal(r.reconciliationPasses(list), true);
});

test('each attribute can fail on its own, and the message names exactly the ones that differ', () => {
  const cases = [
    ['idNumber', { idNumber: '28456701235' }, 'ID number'],
    ['expiry', { expiry: '30/11/2030' }, 'ID expiry date'],
    ['name', { name: 'Ahmed Abdulla Hassan Al-Sulayti' }, 'Name'],
    ['dob', { dob: '13/03/1985' }, 'Date of birth'],
    ['nationality', { nationality: 'Egyptian' }, 'Nationality'],
  ];
  for (const [attr, change, label] of cases) {
    const list = r.reconcileIdentity({ ...card, ...change }, moi);
    assert.equal(byAttr(list)[attr], 'mismatch', attr);
    assert.equal(Object.values(byAttr(list)).filter((x) => x === 'mismatch').length, 1, `only ${attr} differs`);
    assert.equal(r.reconciliationPasses(list), false);
    assert.match(r.mismatchMessage(list), new RegExp(label));
  }
  const two = r.reconcileIdentity({ ...card, expiry: '01/01/2031', dob: '01/01/1990' }, moi);
  assert.match(r.mismatchMessage(two), /ID expiry date, Date of birth/);
  assert.equal(r.mismatchMessage(r.reconcileIdentity(card, moi)), undefined);
});

test('formatting is not a difference (case, spacing, punctuation, accents); a real difference and an unreadable date are', () => {
  assert.equal(byAttr(r.reconcileIdentity({ ...card, name: '  AHMED  abdulla hassan  al sulaiti ', nationality: ' qatari ', idNumber: '2845 6701 234' }, moi)).name, 'match');
  assert.equal(byAttr(r.reconcileIdentity({ ...card, idNumber: '2845 6701 234', nationality: ' qatari ' }, moi)).idNumber, 'match');
  assert.equal(byAttr(r.reconcileIdentity({ ...card, nationality: ' qatari ' }, moi)).nationality, 'match');
  assert.equal(byAttr(r.reconcileIdentity({ ...card, name: 'Ahmed Abdulla Hassan' }, moi)).name, 'mismatch', 'a missing part of the name is a difference');
  assert.equal(byAttr(r.reconcileIdentity({ ...card, dob: '31/02/xx' }, moi)).dob, 'mismatch', 'an unreadable date does not pass');
  assert.equal(byAttr(r.reconcileIdentity({ ...card, name: 'José Núñez' }, { ...moi, name: 'Jose Nunez' })).name, 'match', 'accents');
});

test('what was not captured (an upload) or that MOI cannot answer is recorded, and does not block', () => {
  const upload = r.reconcileIdentity({ idNumber: card.idNumber, expiry: card.expiry }, moi);
  assert.deepEqual(byAttr(upload), { idNumber: 'match', expiry: 'match', name: 'not-captured', dob: 'not-captured', nationality: 'not-captured' });
  assert.equal(r.reconciliationPasses(upload), true);
  const noExpiryOnMoi = r.reconcileIdentity(card, { ...moi, expiry: undefined });
  assert.equal(byAttr(noExpiryOnMoi).expiry, 'moi-missing');
  assert.equal(r.reconciliationPasses(noExpiryOnMoi), true);
  assert.equal(r.reconciliationPasses(r.reconcileIdentity({ ...card, name: 'Someone Else' }, { ...moi, expiry: undefined })), false, 'a mismatch still blocks beside a missing one');
});

test('a scan captures what is printed on the card; an upload clears it', () => {
  const c = preview.capturedFromCard('QID');
  assert.deepEqual(Object.keys(c).sort(), ['dob', 'name', 'nationality']);
  const own = preview.capturedFromCard('QID', { name: 'Sara', idNo: '1', nationality: 'Qatari', dob: '01/01/2000', expiry: '01/01/2030' });
  assert.equal(own.name, 'Sara', 'a journey bound to a customer shows, and captures, that customer');
  const scanned = { frontScanned: true, backScanned: true, source: 'scan', captured: c };
  const replaced = upload.applyIdUpload(scanned, { sides: 'both', files: [{ name: 'q.png', image: 'data:x' }] });
  assert.equal(replaced.captured, undefined, 'an upload reads nothing');
});

test('every simulated card reconciles with the records it resolves to: no demo scan is blocked by the check', async () => {
  const { SPECIMENS } = await load('/src/data/synthetic/idScanSamples.ts');
  const docs = JSON.parse(fs.readFileSync('public/mock-data/identity-documents.json', 'utf8'));
  const customers = JSON.parse(fs.readFileSync('public/mock-data/customers.json', 'utf8'));
  for (const [type, s] of Object.entries(SPECIMENS)) {
    const doc = docs.find((d) => d.documentNumber === s.idNo);
    assert.ok(doc, `${type}: the card's number is on file`);
    const cust = customers.find((c) => c.customerId === doc.customerId);
    const list = r.reconcileIdentity(
      { idNumber: s.idNo, expiry: s.expiry, ...preview.capturedFromCard(type) },
      { idNumber: doc.documentNumber, expiry: doc.expiryDate, name: cust.name, dob: cust.dob, nationality: cust.nationality }
    );
    assert.deepEqual(list.filter((a) => a.result !== 'match').map((a) => `${type}:${a.attribute}:${a.result}`), []);
  }
});

test('the identity lookup reconciles before it accepts MOI, keeps the result on the value, and the order records it', () => {
  const hook = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.match(hook, /reconcileIdentity\(/);
  assert.match(hook, /!reconciliationPasses\(result\)/);
  assert.match(hook, /idReconciliation: result/);
  // A mismatch is one inline error under the ID number naming the field(s) that differ - no reconciliation table.
  const step = fs.readFileSync('src/components/patterns/IdLookupStep.tsx', 'utf8');
  assert.match(step, /mismatchMessage\(reconciliation\)/);
  assert.doesNotMatch(step, /IdReconciliationPanel/);
  assert.match(fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8'), /idReconciliation: contact\.moiResult \? contact\.idReconciliation : undefined/);
});

test('for an upload, the card\'s printed details are not "captured": only the typed number and expiry are (a reader pass, barcode included, did read the card)', () => {
  const hook = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.match(hook, /captureMode === 'upload' \? undefined : latest\.current\.qidScans\?\.captured/);
});

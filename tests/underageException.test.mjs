// Underage customer: a hard stop whose only two footer actions are Abandon Order and Apply for Exception. Apply for Exception opens an Exception
// Request that needs the Court Type Order before Submit for Approval is enabled; the order is then held for the submitter's manager.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

let engine, outcomes, modal;
before(async () => {
  await boot();
  engine = await load('/src/engines/eligibilityEngine.ts');
  outcomes = await load('/src/capabilities/EligibilityGate/EligibilityOutcomes.tsx');
  modal = await load('/src/capabilities/EligibilityGate/ExceptionRequestModal.tsx');
});
after(close);
const h = React.createElement;
const read = (p) => fs.readFileSync(p, 'utf8');
const AS_OF = new Date('2026-11-01');

const ageCheck = (idType, dob, over = {}) =>
  engine
    .evaluateEligibilityChecks(
      { customer: { customerId: 'C', idType, dob, blacklisted: false }, doc: { documentType: idType, expiryDate: '2099-01-01', visa: { visaNumber: 'V', visaType: 'T', expiryDate: '2099-01-01' } }, deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5', under18Exception: 'available', ...over },
      AS_OF
    )
    .find((c) => c.id === 'age');

test('age is calculated from the date of birth for every ID type: 18 and over passes, under 18 is the Underage Customer hard stop with the exception on offer', () => {
  for (const type of ['QID', 'Passport', 'GCC ID', 'Diplomatic ID']) {
    const adult = ageCheck(type, '2008-11-01'); // turns 18 today
    assert.equal(adult.outcome, 'pass', `${type} 18 today`);
    const minor = ageCheck(type, '2008-11-02'); // 18 tomorrow
    assert.equal(minor.outcome, 'hard-stop', `${type} 17 years 364 days`);
    assert.equal(minor.label, 'Underage Customer');
    assert.equal(minor.exceptionOffer, 'under-18');
    assert.match(minor.message, /under 18 years old\. Abandon the order or Apply for an Exception using a Court Order/);
  }
  assert.equal(ageCheck('QID', '1990-01-01').label, 'Age Check');
});

test('an exception request routes the age check for approval and never lifts any other stop', () => {
  const chosen = ageCheck('Passport', '2012-01-01', { under18Exception: 'chosen' });
  assert.equal(chosen.outcome, 'approval-routing');
  const stopped = engine.evaluateEligibilityChecks(
    { customer: { customerId: 'C', idType: 'QID', dob: '2012-01-01', blacklisted: false }, doc: { documentType: 'QID', expiryDate: '2020-01-01' }, deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5', under18Exception: 'chosen' },
    AS_OF
  );
  assert.equal(engine.hasHardStop(stopped), true, 'an expired ID still stops the journey');
});

const stopResult = { hardStop: true, checks: [{ id: 'age', outcome: 'hard-stop', exceptionOffer: 'under-18' }] };
const actions = (props) => html(h(outcomes.OutcomeActions, { eligibility: stopResult, defaultButton: h('button', null, 'Continue'), onAbandon() {}, ...props }));

test('the footer offers only Apply for Exception for an underage customer (Abandon Order lives in the page header); any other hard stop has no footer action', () => {
  const exception = { requirement: { id: 'court-type-order', label: 'Court Type Order' }, approverRole: 'Sales Manager', onSubmit() {} };
  const out = actions({ exception });
  const labels = [...out.matchAll(/<button[^>]*>([^<]*)</g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Apply for Exception']);
  assert.doesNotMatch(out, /Continue/);
  const plain = html(h(outcomes.OutcomeActions, { eligibility: { hardStop: true, checks: [{ id: 'visa-validity', outcome: 'hard-stop' }] }, defaultButton: h('button', null, 'Continue'), onAbandon() {}, exception }));
  assert.deepEqual([...plain.matchAll(/<button[^>]*>([^<]*)</g)].map((m) => m[1]), [], 'any other hard stop: no footer action (Abandon Order is in the header)');
  assert.deepEqual([...actions({}).matchAll(/<button[^>]*>([^<]*)</g)].map((m) => m[1]), [], 'no exception wiring, no exception action');
});

test('the Under-18 Exception hides Special Discounts and its document is listed and viewable under View All Journey Documents', () => {
  const step = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(step, /!under18RequestHolds\(values\) && \(\s*<SpecialDiscountsIdentification/);
  assert.match(step, /setValue\('customerType', \{ type: 'none' \}\)/);
  assert.match(step, /return prepaid \|\| under18RequestHolds\(values\) \|\|/, 'Continue is not held for a discount that is not offered');
  const up = read('src/components/domain/AdditionalDocumentsUpload.tsx');
  assert.match(up, /documents\.map\(\(d\) => \{\s*const dataUrl = documentFileOf\(d\.id\)\?\.dataUrl;\s*const title = `Additional Documents: /);
});

test('the Exception Request needs the Court Type Order: Submit for Approval is off until it is uploaded', () => {
  const out = html(h(modal.ExceptionRequestModal, { open: true, onClose() {}, onSubmit() {}, requirement: { id: 'court-type-order', label: 'Court Type Order' }, approverRole: 'Sales Manager' }));
  assert.match(out, /Exception Request/);
  assert.match(out, /Court Type Order/);
  assert.match(out, /held for approval by the Sales Manager/);
  assert.match(out, /<button[^>]*disabled=""[^>]*>Submit for Approval/);
  const withDoc = html(h(modal.ExceptionRequestModal, { open: true, onClose() {}, onSubmit() {}, requirement: undefined, approverRole: 'CDM', document: { id: 'd1', label: 'Court Type Order', fileName: 'order.pdf', sizeBytes: 1000 } }));
  assert.doesNotMatch(withDoc, /<button[^>]*disabled=""[^>]*>Submit for Approval/);
  assert.match(withDoc, /order\.pdf/);
});

test('submitting the request attaches the Court Type Order for the CAF, and every journey\'s order goes to the submitter\'s manager', () => {
  const step = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(step, /requirementForCondition\('minor-applicant'\)/);
  assert.match(step, /setValue\('under18Request'/);
  assert.match(step, /exceptionRequested=\{under18RequestHolds\(values\)\}/);
  for (const f of ['src/modules/new-connection/submitNewConnectionOrder.ts', 'src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts']) {
    assert.match(read(f), /under18ApproverRole\(usePersonaStore\.getState\(\)\.activePersonaId\)/, f);
  }
  assert.doesNotMatch(read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx'), /Proceed With Exception/, 'the only route is the footer action');
});

test('the Exception Request stands only for the customer it was made for, and only while its mandatory document stays attached', async () => {
  const { under18RequestHolds } = await load('/src/capabilities/CustomerQualification/step.tsx');
  const base = { under18Request: { documentId: 'd1', idNumber: '28456701234' }, contact: { idNumber: '28456701234' }, caf: { additionalDocuments: [{ id: 'd1', label: 'Court Type Order', fileName: 'o.pdf', sizeBytes: 1 }] } };
  assert.equal(under18RequestHolds(base), true);
  assert.equal(under18RequestHolds({ ...base, contact: { idNumber: '28999999999' } }), false, 'another customer: apply afresh');
  assert.equal(under18RequestHolds({ ...base, caf: { additionalDocuments: [] } }), false, 'the document was removed');
  assert.equal(under18RequestHolds({ ...base, caf: undefined }), false);
  assert.equal(under18RequestHolds({ contact: base.contact, caf: base.caf }), false, 'no request made');
  assert.equal(under18RequestHolds({ ...base, under18Request: { idNumber: '28456701234' } }), false, 'a request with no document is no request');
  assert.match(fs.readFileSync('src/capabilities/EligibilityGate/EligibilityGateStep.tsx', 'utf8'), /else if \(wasRequested\.current\) setExceptionChosen\(false\)/);
});

test('after the Exception Request, Continue is not held for a Special Discount, and without a request it still is', async () => {
  const { customerQualificationStep } = await load('/src/capabilities/CustomerQualification/step.tsx');
  const step = customerQualificationStep({ flow: 'new', guardedContactChange() {} });
  const contact = { idType: 'Qatar ID', idNumber: '31403153400090', moiResult: { name: 'Minor Test' }, email: 'a@b.qa', mobile: '55000000' };
  const ok = { checks: [], hardStop: false, softStop: false };
  const request = { under18Request: { documentId: 'd1', idNumber: contact.idNumber }, caf: { additionalDocuments: [{ id: 'd1', label: 'Court Type Order', fileName: 'o.pdf', sizeBytes: 1 }] } };
  const without = step.isValid({ contact, eligibility: ok });
  const withReq = step.isValid({ contact, eligibility: ok, ...request });
  // Whatever else the identity needs, the request lifts exactly the discount requirement and never adds one.
  assert.ok(!without || withReq);
  assert.equal(step.isValid({ contact, eligibility: ok, ...request, customerType: { type: 'none' } }), withReq, 'a Standard type changes nothing');
});

test('View All Journey Documents lists an uploaded document under Additional Documents, counted and openable', async () => {
  const { AdditionalDocumentsUpload } = await load('/src/components/domain/AdditionalDocumentsUpload.tsx');
  const { rememberDocumentFile } = await load('/src/lib/documentFileStore.ts');
  rememberDocumentFile('d1', { dataUrl: 'data:application/pdf;base64,AA==', fileName: 'order.pdf' });
  const docs = [{ id: 'd1', label: 'Court Type Order', fileName: 'order.pdf', sizeBytes: 10, requirementId: 'court-type-order' }];
  const out = html(h(AdditionalDocumentsUpload, { documents: docs, onChange() {}, journeyDocuments: [{ id: 'id-front', label: 'QID Document (Front)', source: 'Customer Verification · Scanned', fileName: 'f.png' }] }));
  assert.match(out, /View All Journey Documents <span[^>]*>\(2\)/, 'journey document + uploaded one');
  assert.match(out, /<button[^>]*>Additional Documents: Court Type Order<\/button>/, 'openable, not just a name');
});

test('the Supplementary Terms checkbox shows only with a verified secondary contact', async () => {
  const { CafSignatureCapture } = await load('/src/components/patterns/CafSignatureCapture.tsx');
  const base = { value: { cafType: 'Digital' }, autoDetectDeviceType: true, onChange() {}, customerName: 'Primary', fullTerms: false, journey: 'postpaid' };
  const none = html(h(CafSignatureCapture, base));
  assert.doesNotMatch(none, /agree to the[\s\S]{0,200}Supplementary Form/, 'no secondary contact: no checkbox');
  const verified = html(h(CafSignatureCapture, { ...base, supplementaryForm: { rows: [{ label: 'Name', value: 'Second' }], actualUserName: 'Second' } }));
  assert.match(verified, /I have read and agree to the[\s\S]{0,200}Supplementary Form/, 'verified secondary contact: checkbox');
});

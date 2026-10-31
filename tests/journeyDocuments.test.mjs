// Additional Documents: the required documents come from the scenario and the role and are asked for once, at the end of the journey; every
// document the journey holds is listed there to view and download.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
const read = (p) => fs.readFileSync(p, 'utf8');
let jd;
let cfg;
before(async () => { await boot(); cfg = await load('/src/engines/configEngine.ts'); await cfg.loadConfig(); jd = await load('/src/engines/journeyDocuments.ts'); });
after(close);

test('a Waive Off requires its supporting document; no waiver, no requirement', () => {
  assert.deepEqual(jd.requiredDocumentsFor({ values: {}, journey: 'new-connection' }), []);
  for (const mode of [2000, 12500.5]) {
    const r = jd.requiredDocumentsFor({ values: { numberWaiver: mode }, journey: 'new-connection' });
    assert.deepEqual(r.map((x) => x.id), ['star-number-discount-approval']);
  }
  assert.deepEqual(jd.requiredDocumentsFor({ values: { numberWaiver: 2000 }, journey: 'prepaid' }), [], 'a journey that has no Waive Off is never asked');
});

test('a VAT registration number on a new billing account requires the VAT document; none, blank or an existing account asks for nothing', () => {
  const vat = (billingAccount) => jd.requiredDocumentsFor({ values: { billingAccount }, journey: 'new-connection' }).map((x) => x.id);
  assert.deepEqual(vat({ creatingNew: true, newAccount: { vatRegistrationNumber: 'VAT-123' } }), ['vat-document']);
  assert.deepEqual(vat({ creatingNew: true, newAccount: { vatRegistrationNumber: '   ' } }), [], 'blank is not a number');
  assert.deepEqual(vat({ creatingNew: true, newAccount: {} }), []);
  assert.deepEqual(vat({ selectedProfileId: 'BILL-1', newAccount: { vatRegistrationNumber: 'VAT-123' } }), [], 'an account picked from the customer\'s own is not a new one');
  assert.deepEqual(jd.requiredDocumentsFor({ values: {}, journey: 'new-connection' }), []);
});

test('an applicant under 18 requires the court order; unknown stays unknown', () => {
  const now = new Date();
  const dob = (years) => `01/01/${now.getFullYear() - years}`;
  assert.equal(jd.ageFromDob(dob(17), new Date(now.getFullYear(), 11, 31)), 17);
  const minor = jd.requiredDocumentsFor({ values: { contact: { moiResult: { dob: dob(16) } } } });
  assert.deepEqual(minor.map((x) => x.label), ['Court Type Order']);
  assert.deepEqual(jd.requiredDocumentsFor({ values: { contact: { moiResult: { dob: dob(30) } } } }), []);
  assert.deepEqual(jd.requiredDocumentsFor({ values: { contact: { moiResult: {} } } }), [], 'no date of birth on record: nothing is assumed');
  assert.equal(jd.ageFromDob('31/12/2000', new Date(2020, 11, 30)), 19);
  assert.equal(jd.ageFromDob('31/12/2000', new Date(2020, 11, 31)), 20);
  assert.equal(jd.ageFromDob('garbage'), undefined);
});

test('the consolidated list holds the ID scans, the evidence, the signature and the uploads, in order, only what exists', () => {
  assert.deepEqual(jd.consolidatedDocuments({}), []);
  const values = {
    contact: { idType: 'QID', qidScans: { frontScanned: true, backScanned: true, source: 'upload', frontImage: 'data:image/png;base64,AA==', backImage: 'data:image/png;base64,BB==', frontFile: 'f.png', backFile: 'b.png' } },
    customerType: { type: 'retired', officeId: { frontScanned: true, backScanned: true } },
    caf: { signatureDataUrl: 'data:image/png;base64,CC==' },
  };
  const docs = jd.consolidatedDocuments(values, [{ id: 'u1', label: 'Employer Letter', fileName: 'e.pdf' }]);
  assert.deepEqual(docs.map((d) => d.label), ['QID Document (Front)', 'QID Document (Back)', 'Retiree Supporting Document (Front)', 'Retiree Supporting Document (Back)', 'Signed CAF', 'Employer Letter']);
  assert.ok(docs[0].dataUrl && docs[4].dataUrl, 'an uploaded ID and the signature can be opened');
  assert.equal(docs[2].dataUrl, undefined, 'a capture the reader kept no image of has nothing to open');
  // a rejected benefit's evidence is not on the order
  assert.ok(!jd.consolidatedDocuments({ customerType: { type: 'mada', rejected: true, officeId: { frontScanned: true, backScanned: true } } }).length);
});

test('the requirements are asked for in Additional Documents after signing - not on the Waive Off dialog or the Number step - and hold Continue until uploaded', () => {
  const comp = read('src/components/domain/AdditionalDocumentsUpload.tsx');
  assert.match(comp, /aria-label="Required documents"/);
  assert.match(comp, /aria-label="Journey documents"/, 'every document held, in one flat list');
  assert.match(comp, /setViewing\(\{ title, dataUrl, scan:/, "a document opens in the side drawer");
  assert.doesNotMatch(comp, /downloadDocument/, 'viewing is enough: no download');
  const cap = read('src/components/patterns/CafSignatureCapture.tsx');
  assert.match(cap, /disabled=\{documentsBlock\}/);
  assert.match(read('src/capabilities/CafSignature/step.tsx'), /requiredDocumentsFor\(\{ values, personaId/);
  // The Additional Discount dialog takes the same document up front, and Apply waits for it.
  const dialog = read('src/capabilities/NumberSelection/WaiveOff.tsx');
  assert.match(dialog, /type="file"/);
  assert.match(dialog, /disabled=\{Boolean\(problem\) \|\| \(onDocumentChange !== undefined && !draftDoc\)\}/, 'Apply needs the amount and the document');
  assert.match(dialog, /uploadFileProblem\(file, UPLOAD_RULES\.supporting\)/, 'the same rules as every other upload');
});

test('the document uploaded with the Additional Discount satisfies the requirement Additional Documents would otherwise ask for', () => {
  const req = jd.requirementForCondition('number-waiver');
  assert.ok(req, 'a document type is required when there is a waiver');
  const needed = jd.requiredDocumentsFor({ values: { numberWaiver: 2000 }, journey: 'new-connection', personaId: 'ROLE-01' });
  assert.deepEqual(needed.map((r) => r.id), [req.id]);
  assert.equal(jd.requirementForCondition('no-such-condition'), undefined);
  // the step reads what is attached by requirement id, the key the dialog writes under
  assert.match(read('src/capabilities/NumberSelection/step.tsx'), /requirementId: requirement\.id|d\.requirementId === requirement\.id/);
  assert.match(read('src/capabilities/CafSignature/step.tsx'), /attached\.includes\(r\.id\)/);
});

// ---- configurable document types: public/config/document-types.json ----------------------------------------------------
const base = { journey: 'new-connection', personaId: 'ROLE-01' };
const labels = (values, extra = {}) => jd.documentTypeOptionsFor({ ...base, values, ...extra });

test('every document type the business named is configured, with a unique id and label', () => {
  const types = cfg.getDocumentTypes();
  const named = ['QID', 'Passport', 'GCC ID', 'Employee ID', 'Special Needs Card', 'CAF', 'Supplementary Form', 'MNP Form', 'TON Form', 'Blue Plate', 'House Contract', 'Star Number Discount Approval', 'Upfront Payment Receipt', "Authorized Person's QID", 'Chooser Email Confirmation', "Chooser's QID", 'Commercial Registration', 'Company Letter Head', 'Computer Card', 'Contract Document', 'Customer Acceptance Document', 'Customer PO', 'Master Services Agreement', 'Plan Builder Form', 'Plan Discount Approval', 'Service Handover Document', 'Start-Billing Confirmation', 'Tender Document', 'Trade License', 'Volumetric Addendum Form', 'eKYC'];
  assert.deepEqual(named.filter((n) => !types.some((t) => t.label === n)), []);
  assert.equal(new Set(types.map((t) => t.id)).size, types.length);
  assert.ok(types.every((t) => t.basis), 'each rule says where it comes from');
});

test('the list offered is narrowed by the customer, the scenario, the journey and the role - nothing is hardcoded', () => {
  const plain = { product: 'postpaid', contact: { idType: 'QID' }, eligibility: { segment: 'Consumer' } };
  // Seven types are offered to everyone, in this order; the rest follow only where they apply (the contextual ones below).
  const ALWAYS = ['QID', 'Passport', 'GCC ID', 'Employee ID', 'CAF', 'Special Needs Card', 'Star Number Discount Approval'];
  assert.deepEqual(labels(plain), ALWAYS);
  assert.deepEqual(labels({ ...plain, contact: { idType: 'Passport' } }), ALWAYS);
  assert.deepEqual(labels({ ...plain, customerType: { type: 'mada', rejected: true } }), ALWAYS, 'a rejected benefit adds nothing');
  assert.ok(labels({ ...plain, actualUser: { choice: 'other' } }).includes('Supplementary Form'));
  assert.ok(labels({ ...plain, actualUser: { choice: 'primary' } }).every((l) => l !== 'Supplementary Form'));
  assert.ok(labels({ ...plain, checkoutTotals: { dueTodayQar: 50 } }).includes('Upfront Payment Receipt'));
  assert.ok(labels({ ...plain, checkoutTotals: { dueTodayQar: 0 } }).every((l) => l !== 'Upfront Payment Receipt'));
  assert.ok(labels({ ...plain, product: 'mnp' }).includes('MNP Form') && !labels(plain).includes('MNP Form'));
  assert.ok(!labels({ ...plain, eligibility: { segment: 'Consumer' } }).includes('Trade License'));
  assert.deepEqual(labels({ ...plain, eligibility: { segment: 'Enterprise (EBU)' } }).slice(0, 7), ALWAYS, 'the always-offered types stay first');
  assert.ok(labels({ ...plain, eligibility: { segment: 'Enterprise (EBU)' } }).includes('Trade License'), 'segment matched by prefix');
  assert.ok(!labels(plain).includes('eKYC'), 'an empty applicability list means never');
  assert.deepEqual(labels(plain, { journey: undefined }).includes('TON Form'), false);
});

test('a required type is asked for as its own card, not repeated in the list; unknown conditions never hold', () => {
  const waived = { product: 'postpaid', contact: { idType: 'QID' }, numberWaiver: 2000 };
  assert.deepEqual(jd.requiredDocumentsFor({ ...base, values: waived }).map((r) => r.label), ['Star Number Discount Approval']);
  assert.ok(!labels(waived).includes('Star Number Discount Approval'), 'offered as a card, not repeated in the list');
  assert.equal(jd.documentTypeApplies({ id: 'x', label: 'X', appliesTo: { conditions: ['no-such-condition'] } }, { values: {} }), false);
  assert.equal(jd.documentTypeApplies({ id: 'x', label: 'X', appliesTo: { personas: ['ROLE-99'] } }, { values: {}, personaId: 'ROLE-01' }), false);
  assert.equal(jd.documentTypeApplies({ id: 'x', label: 'X', appliesTo: { personas: ['ROLE-01'] } }, { values: {}, personaId: 'ROLE-01' }), true);
});

test('a VAT registration number on a new billing account needs its document before Continue, and the upload is kept under the requirement Additional Documents matches', () => {
  const req = jd.requirementForCondition('vat-registration');
  assert.ok(req, 'a document type is required when a VAT number is entered');
  const needed = (vat) => jd.requiredDocumentsFor({ values: { billingAccount: { creatingNew: true, newAccount: { vatRegistrationNumber: vat } } }, journey: 'new-connection', personaId: 'ROLE-01' }).map((r) => r.id);
  assert.ok(needed('300123456700003').includes(req.id));
  assert.ok(!needed('   ').includes(req.id), 'a blank number asks for nothing');
  const step = read('src/capabilities/BillingAccount/step.tsx');
  assert.match(step, /vatRegistrationNumber\?\.trim\(\)\) \{\s*const req = requirementForCondition\('vat-registration'\)/, 'Continue is gated on the document');
  assert.match(step, /requirementId === vatRequirement\.id/);
  assert.match(read('src/components/patterns/BillingAccountStep.tsx'), /newAccount\.vatRegistrationNumber\?\.trim\(\) &&[\s\S]*SupportingDocumentField/, 'the upload shows once a number is entered');
});

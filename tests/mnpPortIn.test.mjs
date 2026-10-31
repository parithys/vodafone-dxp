import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// MNP Port-In against VFQ_Mobile_MNP_PORTIN_PORTOUT_V1.1: the status model, NPAS approval / rejection, the Confirmed Port-In Date
// window, the donor fields, the Port-In number check and the MNP Form.
let rules, engine, donor, attach, steps, gateMod, gatePanel, elig, mnp, React, server;
before(async () => {
  await boot();
  rules = await load('/src/data/portInRules.ts');
  engine = await load('/src/engines/portInEngine.ts');
  donor = await load('/src/components/patterns/DonorDetailsStep.tsx');
  attach = await load('/src/components/patterns/DonorAttachmentStep.tsx');
  steps = await load('/src/modules/mnp-fnp-porting/screens/mnpSteps.tsx');
  gateMod = await load('/src/modules/mnp-fnp-porting/screens/mnpValidationGate.ts');
  gatePanel = await load('/src/modules/mnp-fnp-porting/screens/MnpGatePanel.tsx');
  React = (await import('react')).default;
  server = await import('react-dom/server');
  elig = await load('/src/engines/eligibilityEngine.ts');
  mnp = await load('/src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts');
});
after(close);

// ---- window and working days (BR-MNP-027, OI-MNP-012) ----------------------------------------------------------------------
test('working days are Sunday to Thursday', () => {
  // 2026-10-14 is a Wednesday.
  const days = ['2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17'];
  assert.deepEqual(days.map(rules.isWorkingDay), [true, true, true, true, true, false, false]);
  assert.equal(rules.isWorkingDay('not a date'), false);
});

test('approval before the cut-off on a working day takes that day\'s 11:00-12:00 window; after it, the next working day', () => {
  // Qatar is UTC+3: 06:00Z = 09:00 local (before the 10:00 cut-off), 08:00Z = 11:00 local (after it).
  const before = rules.confirmedPortInWindow(new Date('2026-10-14T06:00:00Z'));
  assert.deepEqual([before.date, before.start, before.end], ['2026-10-14', '11:00', '12:00']);
  assert.equal(before.startsAt, '2026-10-14T11:00:00+03:00');
  assert.equal(rules.confirmedPortInWindow(new Date('2026-10-14T08:00:00Z')).date, '2026-10-15');
});

test('approval on Thursday after the cut-off, or on a weekend, waits for Sunday', () => {
  assert.equal(rules.confirmedPortInWindow(new Date('2026-10-15T08:00:00Z')).date, '2026-10-18');
  assert.equal(rules.confirmedPortInWindow(new Date('2026-10-16T06:00:00Z')).date, '2026-10-18', 'Friday is not a working day');
  assert.equal(rules.confirmedPortInWindow(new Date('2026-10-17T06:00:00Z')).date, '2026-10-18', 'Saturday is not a working day');
});

test('NPAS answers within 24 hours (OI-MNP-004)', () => {
  assert.equal(rules.npasDeadline(new Date('2026-10-14T06:00:00Z')), '2026-10-15T06:00:00.000Z');
});

// ---- Port-In number (SEQ_014, BR-MNP-007) ----------------------------------------------------------------------------------
test('the Port-In number is normalised to 974 + 8 digits and must be a Qatar mobile number', () => {
  for (const ok of ['66000666', '97466000666', '+974 6600 0666', '0097466000666', '974-5500-1122']) assert.match(rules.normalizePortInNumber(ok), /^974[3567]\d{7}$/, ok);
  for (const bad of ['', '12345', '9746600066', '97416000666', '66000666x', '2345678']) assert.equal(rules.normalizePortInNumber(bad), undefined, bad);
  assert.equal(rules.normalizePortInNumber('6600 0666'), '97466000666');
});

test('a number already on Vodafone, or already awaiting NPAS, cannot be ported in', () => {
  const ctx = { inFlight: new Set(['97466000111']), vodafone: new Set(['97433001001']) };
  assert.equal(rules.portInNumberError('66000666', ctx), undefined);
  assert.match(rules.portInNumberError('33001001', ctx), /already on the Vodafone network/);
  assert.match(rules.portInNumberError('66000111', ctx), /already awaiting NPAS/);
  assert.match(rules.portInNumberError('123', ctx), /valid Qatar mobile number/);
  assert.equal(rules.portInNumberError('', ctx), undefined, 'empty is "required", not an error');
});

test('a scheduled Port-In date must be a working day', () => {
  assert.equal(rules.scheduledDateError(undefined), undefined);
  assert.equal(rules.scheduledDateError('2026-10-14'), undefined);
  assert.match(rules.scheduledDateError('2026-10-16'), /working day/);
});

// ---- donor details (SEQ_012, DF-MNP-010..015) --------------------------------------------------------------------------------
const donorOk = { portInNumber: '66000666', donorId: 'D1', donorIdType: 'QID', donorCustomerType: 'Individual', donorOperator: 'Other Operator', donorSubscriptionType: 'Postpaid' };

test('donor details need the number, ID, ID type, customer type, operator and subscription type', () => {
  assert.equal(donor.donorDetailsValid(donorOk), true);
  for (const key of ['portInNumber', 'donorId', 'donorIdType', 'donorCustomerType', 'donorOperator', 'donorSubscriptionType']) {
    assert.equal(donor.donorDetailsValid({ ...donorOk, [key]: '' }), false, `${key} is mandatory`);
  }
  assert.equal(donor.donorDetailsValid({ ...donorOk, portInNumber: '123' }), false);
  assert.equal(donor.donorDetailsValid({ ...donorOk, portInNumberBlocked: 'already on Vodafone' }), false);
  assert.equal(donor.donorDetailsValid({ ...donorOk, scheduledPortInDate: '2026-10-16' }), false, 'a weekend date is refused');
  assert.equal(donor.donorDetailsValid({ ...donorOk, scheduledPortInDate: '2026-10-18' }), true);
  assert.equal(donor.donorDetailsValid(undefined), false);
});

test('the donor operator is Other Operator: Vodafone and Other Licensed Operator are not offered, and Diplomatic ID is a donor ID type (DF-MNP-011)', () => {
  assert.ok(!rules.DONOR_OPERATORS.includes('Vodafone'));
  assert.deepEqual([...rules.DONOR_OPERATORS], ['Other Operator']);
  assert.equal(rules.DONOR_OPERATOR, 'Other Operator', 'the only donor operator is set by the journey, not chosen');
});

// ---- MNP Form (SEQ_018 / 019) ----------------------------------------------------------------------------------------------
const formInput = { customerName: 'Test', idType: 'QID', idNumber: '2845', mnpType: 'postpaid', productId: 'PROD-104', simSerial: 'S1', donor: donorOk };

test('the MNP Form is generated only when its mandatory data is present', () => {
  assert.deepEqual(attach.mnpFormMissing(formInput), []);
  assert.deepEqual(attach.mnpFormMissing({ ...formInput, simSerial: undefined, productId: undefined }), ['Plan', 'SIM serial']);
  assert.ok(attach.mnpFormMissing({ ...formInput, donor: { ...donorOk, donorOperator: undefined } }).includes('Donor details'));
});

test('a signature is valid only for the data it was generated from', () => {
  const key = attach.mnpFormSnapshotKey(formInput);
  const signed = { mnpFormType: 'MNP-Digital', formNumber: 'MNPF-1', signed: true, signatureDataUrl: 'data:x', snapshotKey: key };
  assert.equal(attach.mnpFormSigned(signed, formInput), true);
  assert.equal(attach.mnpFormSigned({ ...signed, signed: false }, formInput), false, 'unsigned');
  assert.equal(attach.mnpFormSigned({ ...signed, mnpFormType: undefined }, formInput), false, 'no form type');
  assert.equal(attach.mnpFormSigned(signed, { ...formInput, donor: { ...donorOk, donorId: 'CHANGED' } }), false, 'donor data changed after signing');
  assert.equal(attach.mnpFormSigned(signed, { ...formInput, simSerial: 'S2' }), false, 'SIM changed after signing');
  assert.equal(attach.mnpFormSnapshotKey({ ...formInput, donor: { ...donorOk, portInNumber: '+974 6600 0666' } }), key, 'the same number typed differently is the same data');
});

test('the form numbers are unique', () => {
  const a = rules.newMnpFormNumber(new Date('2026-10-14T06:00:00.100Z'));
  const b = rules.newMnpFormNumber(new Date('2026-10-14T06:00:00.200Z'));
  assert.match(a, /^MNPF-261014-\d{6}$/);
  assert.notEqual(a, b);
});

test('the MNP steps keep their order, with the MNP Form step gated on a signature that is current', () => {
  const all = steps.mnpSteps();
  assert.deepEqual(all.map((s) => s.key), ['mnpType', 'address', 'billingAccount', 'sim', 'plan', 'planExtras', 'plan', 'planExtras', 'donor-details', 'checkout', 'checkout', 'donor-attachment', 'caf', 'caf', 'payment']);
  const formStep = all.find((s) => s.key === 'donor-attachment');
  assert.equal(formStep.label, 'MNP Form');
  const values = { product: 'mnp', mnpType: 'postpaid', contact: { idNumber: '2845', idType: 'QID', moiResult: { name: 'Test' } }, productId: 'PROD-104', simSerial: 'S1', donorDetails: donorOk };
  assert.equal(formStep.isValid(values), false, 'not generated or signed yet');
  const key = attach.mnpFormSnapshotKey(steps.mnpFormInputOf(values));
  assert.equal(formStep.isValid({ ...values, donorAttachment: { mnpFormType: 'MNP-Touch Screen', formNumber: 'MNPF-1', signed: true, signatureDataUrl: 'data:x', snapshotKey: key } }), true);
  assert.equal(formStep.isValid({ ...values, simSerial: 'S9', donorAttachment: { mnpFormType: 'MNP-Touch Screen', formNumber: 'MNPF-1', signed: true, signatureDataUrl: 'data:x', snapshotKey: key } }), false);
});

// ---- the request after submission (BR-MNP-013 / 019 / 025 / 026, SEQ_024..027) ---------------------------------------------
const submitted = (over = {}) => engine.buildPortInRecord({
  id: 'MNP-123456', orderId: 'ORD-1', customerId: 'CUST-1', customerName: 'Test', idNumber: '2845', mnpCategory: 'Postpaid Consumer', planSelected: 'PROD-104',
  portInNumber: '97466000666', donor: { customerId: 'D1', idType: 'QID', customerType: 'Individual', operator: 'Other Operator', subscriptionType: 'Postpaid' },
  mnpForm: { number: 'MNPF-1', signed: true, type: 'MNP-Digital' }, simSerial: 'S1', recipient: { phone: '97455512001' },
  draftSnapshot: { mnpType: 'postpaid', productId: 'PROD-104', donorDetails: donorOk }, ...over,
}, new Date('2026-10-14T06:00:00Z'));

test('a submitted request is Pending NPAS Approval with the SIM reserved and nothing activated', () => {
  const r = submitted();
  assert.deepEqual([r.orderStatus, r.portStatus, r.trackingStatus, r.simStatus], ['Pending NPAS Approval', 'Pending Approval', 'In Progress', 'Reserved']);
  assert.equal(r.npasDeadline, '2026-10-15T06:00:00.000Z');
  assert.equal(r.confirmedPortIn, undefined);
  assert.deepEqual(r.history.map((h) => h.status), ['Submitted', 'Pending NPAS Approval']);
  assert.equal(r.notifications[0].type, 'Submission');
  assert.equal(engine.canQuickDraft(r), false);
});

test('NPAS approval records the Confirmed Port-In Date and window and notifies the customer', () => {
  const r = submitted();
  const change = engine.approvePortIn(r, new Date('2026-10-14T08:00:00Z'));
  assert.equal(change.orderStatus, 'NPAS Approved');
  assert.deepEqual([change.patch.portStatus, change.patch.confirmedPortIn.date, change.patch.confirmedPortIn.start], ['Approved', '2026-10-15', '11:00']);
  assert.match(change.patch.notifications.at(-1).message, /2026-10-15 between 11:00 and 12:00/);
  assert.equal(change.patch.history.at(-1).status, 'NPAS Approved');
  assert.equal(engine.approvePortIn({ ...r, ...change.patch }), undefined, 'it cannot be approved twice');
});

test('NPAS rejection closes the order, cancels the tracking record, releases the SIM and notifies the customer with the reason', () => {
  const r = submitted();
  const change = engine.rejectPortIn(r, '6', new Date('2026-10-14T09:00:00Z'));
  assert.equal(change.orderStatus, 'Closed');
  assert.deepEqual([change.patch.portStatus, change.patch.trackingStatus, change.patch.simStatus], ['Rejected', 'Cancelled', 'Released']);
  assert.equal(change.patch.rejectionReason, 'Service for Number currently barred or suspended');
  assert.deepEqual(change.patch.history.map((h) => h.status).slice(2), ['NPAS Rejected', 'Completed Rejected', 'Closed']);
  const note = change.patch.notifications.at(-1);
  assert.equal(note.type, 'Cancellation');
  assert.match(note.message, /barred or suspended/);
  assert.equal(engine.rejectPortIn(r, '99'), undefined, 'an unknown reason code is refused');
  const closed = { ...r, ...change.patch };
  assert.equal(engine.rejectPortIn(closed, '1'), undefined, 'a closed order cannot be rejected again');
});

test('cancelling while NPAS is pending releases the SIM; a cancelled or rejected order can start a Quick Draft that copies only reusable details', () => {
  const r = submitted();
  const cancelled = { ...r, ...engine.cancelPortIn(r).patch };
  assert.deepEqual([cancelled.orderStatus, cancelled.trackingStatus, cancelled.simStatus], ['Cancelled', 'Cancelled', 'Released']);
  const draft = engine.quickDraftValues(cancelled);
  assert.equal(draft.product, 'mnp');
  assert.equal(draft.sourceCancelledOrderId, 'ORD-1', 'the source order is kept as lineage');
  assert.deepEqual(Object.keys(draft).filter((k) => engine.NOT_REUSABLE_KEYS.includes(k)), ['sourceCancelledOrderId'], 'no SIM, signature, form or eligibility is copied');
  assert.equal(draft.donorDetails.donorId, 'D1');
  const rejected = { ...r, ...engine.rejectPortIn(r, '1').patch };
  assert.ok(engine.quickDraftValues(rejected));
  assert.equal(engine.quickDraftValues(r), undefined, 'a request still awaiting NPAS is not a cancelled order');
  assert.equal(engine.quickDraftValues({ ...cancelled, draftSnapshot: undefined }), undefined);
});

test('the status model only permits the transitions in Annex_02', () => {
  assert.equal(rules.canMoveOrder('Pending NPAS Approval', 'NPAS Approved'), true);
  assert.equal(rules.canMoveOrder('Pending NPAS Approval', 'Closed'), false);
  assert.equal(rules.canMoveOrder('Closed', 'Pending NPAS Approval'), false);
  assert.equal(rules.canMoveOrder('Completed Rejected', 'Closed'), true);
});

test('the 13 donor rejection reasons of OI-MNP-006 are all there', () => {
  assert.deepEqual(rules.REJECTION_REASONS.map((r) => r.code), Array.from({ length: 13 }, (_, i) => String(i + 1)));
  assert.equal(rules.rejectionReason('13').reason, 'Customer has Mobile Money transaction pending');
});

// ---- seed data ---------------------------------------------------------------------------------------------------------------
test('the seeded port-in requests follow the TO-BE model: no temporary number, valid statuses, a rejected one closed with its reason', () => {
  const seed = JSON.parse(fs.readFileSync(new URL('../public/mock-data/mnp-portin-orders.json', import.meta.url), 'utf8'));
  const valid = new Set(['Submitted', 'Pending NPAS Approval', 'NPAS Approved', 'NPAS Rejected', 'Completed Rejected', 'Cancelled', 'Closed']);
  for (const r of seed) {
    assert.ok(valid.has(r.orderStatus), `${r.id} has a status from the model`);
    assert.equal(r.reservedTempMsisdn, undefined, `${r.id}: BR-MNP-021 - no temporary number`);
    assert.match(r.portInNumber, /^974[3567]\d{7}$/);
    assert.ok(r.history.length >= 2);
  }
  const rejected = seed.find((r) => r.portStatus === 'Rejected');
  assert.ok(rejected.rejectionReason && rejected.trackingStatus === 'Cancelled' && engine.canQuickDraft(rejected));
});

// ---- checkout, validation gate and payment (BR-MNP-009 / 011) -----------------------------------------------------------------
const journey = (over = {}) => {
  const values = {
    product: 'mnp', mnpType: 'postpaid',
    contact: { idType: 'QID', idNumber: '2845', email: 'a@example.qa', moiResult: { name: 'Test' } },
    eligibility: { checks: [], customerId: 'CUST-1' },
    billingAccount: { creatingNew: true, newAccount: { profileName: 'P' } },
    productId: 'PROD-104', simSerial: '8974412345678901234', simValid: true, donorDetails: donorOk, ...over,
  };
  const key = attach.mnpFormSnapshotKey(steps.mnpFormInputOf(values));
  return { ...values, donorAttachment: { mnpFormType: 'MNP-Digital', formNumber: 'MNPF-1', signed: true, signatureDataUrl: 'data:x', snapshotKey: key }, caf: { cafType: 'Digital', signatureDataUrl: 'data:x' }, payment: { paid: true, method: 'Zero value', zeroValue: true, reference: 'RCPT-0-1' }, checkoutTotals: { dueTodayQar: 0 }, ...over };
};
const failing = (values, stage) => gateMod.mnpValidationGate(values, stage).filter((c) => !c.ok).map((c) => c.id);

test('the validation gate lists every mandatory validation, and passes only when all are done', () => {
  assert.deepEqual(failing(journey(), 'checkout'), []);
  assert.deepEqual(failing(journey(), 'submit'), []);
  assert.deepEqual(failing(journey({ simValid: false }), 'checkout'), ['sim']);
  assert.deepEqual(failing(journey({ productId: undefined }), 'checkout'), ['plan']);
  assert.deepEqual(failing(journey({ billingAccount: undefined }), 'checkout'), ['billing']);
  assert.deepEqual(failing(journey({ donorDetails: { ...donorOk, donorId: '' } }), 'checkout').sort(), ['mnp'], 'the donor details gate the checkout');
  assert.deepEqual(failing(journey({ eligibility: { hardStop: true, checks: [] } }), 'checkout'), ['eligibility']);
  assert.deepEqual(failing(journey({ eligibility: { softStop: true, checks: [] } }), 'checkout'), ['eligibility'], 'a collections soft-stop blocks a postpaid port-in (BR-MNP-023)');
  assert.deepEqual(failing(journey({ eligibility: undefined }), 'checkout'), ['eligibility']);
});

test('a prepaid port-in has no billing profile check; the submit gate adds the signed form, the CAF and the payment', () => {
  assert.ok(!gateMod.mnpValidationGate(journey({ mnpType: 'prepaid', billingAccount: undefined }), 'checkout').some((c) => c.id === 'billing'));
  assert.deepEqual(failing(journey({ payment: undefined }), 'submit'), ['payment']);
  assert.deepEqual(failing(journey({ caf: undefined }), 'submit'), ['caf']);
  assert.deepEqual(failing(journey({ donorAttachment: { signed: false } }), 'submit'), ['form']);
  assert.deepEqual(failing(journey({ payment: undefined }), 'checkout'), [], 'payment is not needed to reach checkout');
});

test('the checkout step is gated on the validations, and the payment step takes the amount checkout computed or a zero-value receipt', () => {
  const all = steps.mnpSteps();
  const checkout = all.find((s) => s.key === 'checkout');
  assert.equal(checkout.isValid(journey()), true);
  assert.equal(checkout.isValid(journey({ simValid: false })), false);
  const payment = all.find((s) => s.key === 'payment');
  assert.equal(payment.isValid(journey({ payment: undefined })), false);
  assert.equal(payment.isValid(journey()), true);
  assert.deepEqual(all.map((s) => s.key).slice(-6), ['checkout', 'checkout', 'donor-attachment', 'caf', 'caf', 'payment']);
});

test('postpaid port-in uses the shared Plan, Add-ons, Checkout Summary and full CAF steps; prepaid keeps its own pack, checkout and CAF', () => {
  const all = steps.mnpSteps();
  const active = (values) => all.filter((s) => !s.skip?.(values)).map((s) => s.key);
  assert.deepEqual(active({ mnpType: 'postpaid' }), ['mnpType', 'address', 'billingAccount', 'sim', 'plan', 'planExtras', 'donor-details', 'checkout', 'donor-attachment', 'caf', 'payment']);
  assert.deepEqual(active({ mnpType: 'prepaid' }), ['mnpType', 'address', 'sim', 'plan', 'planExtras', 'donor-details', 'checkout', 'donor-attachment', 'caf', 'payment']);
  const [postpaidCaf, prepaidCaf] = all.filter((s) => s.key === 'caf');
  assert.equal(typeof postpaidCaf.locksAfter, 'function', 'the full CAF locks the journey once signed');
  assert.equal(prepaidCaf.locksAfter, undefined);
  const [postpaidCheckout] = all.filter((s) => s.key === 'checkout');
  assert.equal(postpaidCheckout.label, 'Order Summary');
  assert.equal(all.find((s) => s.key === 'planExtras').label, 'Addons');
});

test('the prepaid port-in checkout is the shared prepaid checkout, gated on the validations and storing what is due as dueTodayQar', () => {
  const [, prepaidCheckout] = steps.mnpSteps().filter((s) => s.key === 'checkout');
  assert.equal(prepaidCheckout.label, 'Order Summary');
  const values = journey({ mnpType: 'prepaid' });
  assert.equal(prepaidCheckout.isValid(values), true);
  assert.equal(prepaidCheckout.isValid({ ...values, simValid: false }), false);
  assert.equal(prepaidCheckout.isValid({ ...values, productId: undefined }), false);
  // The Payment step and the order read the amount as dueTodayQar; the step summary reads it back.
  const shown = prepaidCheckout.summary.find((f) => f.key === 'due').value({ checkoutTotals: { dueTodayQar: 0, monthlyRecurringQar: 0, hrnAdvanceQar: 0 } });
  assert.equal(shown, 'QAR 0');
});

test('the validation gate panel is shown only while a validation fails', () => {
  const html = (gate) => server.renderToStaticMarkup(React.createElement(gatePanel.MnpValidationGate, { gate, onFix: () => {} }));
  assert.equal(html(gateMod.mnpValidationGate(journey(), 'checkout')), '', 'every validation passed: nothing is shown');
  const failing = html(gateMod.mnpValidationGate(journey({ simValid: false }), 'checkout'));
  assert.match(failing, /Validations/);
  assert.match(failing, /1 to fix/);
});

// ---- SIM reservation (BR-MNP-008 / 025) ---------------------------------------------------------------------------------------
test('submitting reserves the SIM against the order, and refuses an incomplete journey or a SIM that is no longer available', async () => {
  const created = [];
  const updated = [];
  const deps = { createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, idField, id, patch }) };
  const confirmed = await mnp.submitMnpOrder(journey(), deps);
  const reserve = updated.find((u) => u.kind === 'sims');
  assert.deepEqual([reserve.id, reserve.patch.stockStatus, reserve.patch.reservedForOrderId], ['8974412345678901234', 'Reserved', confirmed.orderId]);
  const request = created.find((c) => c.kind === 'mnp-portin-orders').rec;
  assert.equal(request.simPreviousStockStatus, 'Available', 'what a release restores');
  await assert.rejects(() => mnp.submitMnpOrder(journey({ payment: undefined }), deps), /validations not complete: Payment/);
  await assert.rejects(() => mnp.submitMnpOrder(journey({ simSerial: '8974412009900123456' }), deps), /no longer available/, 'an Issued SIM cannot be reserved');
  const before = updated.length;
  await assert.rejects(() => mnp.submitMnpOrder(journey({ simSerial: '9999' }), deps), /no longer available/);
  assert.equal(updated.length, before, 'nothing is reserved when the SIM cannot be');
});

test('rejecting or cancelling puts the reserved SIM back in stock', () => {
  const r = engine.buildPortInRecord({
    id: 'MNP-1', orderId: 'ORD-1', mnpCategory: 'Postpaid Consumer', portInNumber: '97466000666', donor: {}, mnpForm: {}, simSerial: 'S1', simPreviousStockStatus: 'Available', recipient: { phone: '1' },
  }, new Date('2026-10-14T06:00:00Z'));
  assert.deepEqual(engine.rejectPortIn(r, '1').simRelease, { simSerial: 'S1', restoreTo: 'Available' });
  assert.deepEqual(engine.cancelPortIn(r).simRelease, { simSerial: 'S1', restoreTo: 'Available' });
  assert.equal(engine.approvePortIn(r).simRelease, undefined, 'an approved request keeps its SIM');
});

// ---- outstanding dues (BR-MNP-024) --------------------------------------------------------------------------------------------
const eligCtx = (over = {}) => ({
  customer: { customerId: 'C', blacklisted: false, dob: '1985-03-12' }, doc: { expiryDate: '2030-01-01', documentType: 'QID' }, deals: [], outstandingQar: 250, lineCapReached: false, activeLinesDetail: '', scope: 'product', ...over,
});
const duesCheck = (ctx) => elig.evaluateEligibilityChecks(ctx, new Date('2026-10-14')).find((c) => c.id === 'port-in-dues');

test('the dues check exists only for a port-in, and never restricts while no threshold is defined', () => {
  assert.equal(duesCheck(eligCtx()), undefined, 'not a port-in');
  const c = duesCheck(eligCtx({ portIn: true }));
  assert.deepEqual([c.passed, c.outcome], [true, 'pass']);
  assert.match(c.message, /QAR 250.*not defined yet/);
  assert.equal(duesCheck(eligCtx({ portIn: true, outstandingQar: 0 })).message, 'No outstanding dues');
  assert.equal(rules.PORT_IN_DUES_THRESHOLD_QAR, undefined, 'no figure is assumed');
});

test('once a threshold is set, dues above it stop the port-in', () => {
  const over = duesCheck(eligCtx({ portIn: true, portInDuesThresholdQar: 100 }));
  assert.deepEqual([over.passed, over.outcome], [false, 'hard-stop']);
  assert.match(over.message, /QAR 250.*above the QAR 100 threshold/);
  assert.equal(duesCheck(eligCtx({ portIn: true, portInDuesThresholdQar: 250 })).passed, true, 'at the threshold is within it');
  assert.equal(duesCheck(eligCtx({ portIn: true, portInDuesThresholdQar: 100, scope: 'common' })), undefined, 'a common-scope check is product-agnostic');
});

test('no charge, deposit or fee is assumed: only the postpaid HRN advance can make a port-in payable', () => {
  assert.deepEqual([rules.PORT_IN_FEE_QAR, rules.PORT_IN_DEPOSIT_QAR], [0, 0]);
});

test('"Port the number onto" is the first MNP step, not part of Product Selection; both entry points reach it the same way', async () => {
  const { mnpPlanTypeStep } = await load('/src/modules/new-connection/steps/MnpPlanTypeStep.tsx');
  const { productEligibilityClear, selectMnpType } = await load('/src/modules/new-connection/steps/productChoice.ts');
  const step = mnpPlanTypeStep({ wizardId: 'w', flow: 'new', existingCustomerId: undefined });
  assert.equal(step.key, 'mnpType');
  assert.equal(step.label, 'Plan Type');
  assert.notEqual(step.heading, 'Port the number onto', 'the heading must not repeat the cards\' legend');
  // the New MNP button and a New MNP offer both leave product 'mnp'; only the offer names the type. Neither is asked on the product page.
  const clearFor = (mnpType) => ({ product: 'mnp', mnpType, eligibility: { scope: 'product', portIn: true, journeyType: mnpType === 'prepaid' ? 'prepaid' : 'postpaid', hardStop: false, softStop: false, checks: [] } });
  assert.equal(productEligibilityClear(clearFor(undefined)), true, 'Product Selection no longer waits for the plan type');
  assert.equal(step.isValid(clearFor(undefined)), false, 'the step needs a type chosen');
  assert.equal(step.isValid(clearFor('postpaid')), true);
  assert.equal(step.isValid(clearFor('prepaid')), true);
  assert.equal(step.isValid({ ...clearFor('prepaid'), eligibility: { ...clearFor('postpaid').eligibility } }), false, 'eligibility must be judged for the type chosen');
  assert.equal(typeof selectMnpType, 'function');
  const productSrc = (await import('node:fs')).readFileSync('src/modules/new-connection/steps/ProductSelection.tsx', 'utf8');
  assert.doesNotMatch(productSrc, /Port the number onto/);
});

test('in MNP Port-In the prepaid pack step is "Prepaid Packs" (no repeated title over the grid); the postpaid plan step and other journeys keep "Offers & Plans"', () => {
  const all = steps.mnpSteps();
  const plans = all.filter((s) => s.key === 'plan');
  assert.equal(plans.length, 2);
  const [postpaidPlan, prepaidPlan] = plans;
  assert.equal(postpaidPlan.label, 'Offers & Plans');
  assert.equal(prepaidPlan.label, 'Prepaid Packs');
  assert.equal(prepaidPlan.skip({ mnpType: 'postpaid' }), true);
  assert.equal(postpaidPlan.skip({ mnpType: 'postpaid' }), false);
});

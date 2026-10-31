// Mobile Prepaid Activation (BRSD VFQ_Mobile_Prepaid_Activation_BRSD_V0.1, requirement ids MPRA_001_*): the rules where
// Prepaid differs from Postpaid, and the cart, Pre-Paired SIM and submit behaviour the process flow adds.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

// The step modules touch window at import time; the harness window is a bare object.
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let ids, charge, engine, cart, cross, sim, num, submit, db, caf;
before(async () => {
  ({ db } = await boot());
  ids = await load('/src/data/idTypes.ts');
  charge = await load('/src/data/prepaidSimCharge.ts');
  engine = await load('/src/engines/eligibilityEngine.ts');
  cart = await load('/src/components/patterns/prepaidCartModel.ts');
  cross = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  sim = await load('/src/capabilities/SimType/step.tsx');
  num = await load('/src/capabilities/NumberSelection/step.tsx');
  submit = await load('/src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts');
  caf = await load('/src/capabilities/CafSignature/step.tsx');
});
after(close);

// ---- KYC_01 / ECC: eligibility --------------------------------------------------------------------------------------
const baseCtx = (over = {}) => ({
  customer: { customerId: 'CUST-X', idType: 'Passport', dob: '1990-01-01', blacklisted: false },
  doc: { documentType: 'Passport', expiryDate: '2099-01-01' },
  deals: [],
  outstandingQar: 0,
  lineCapReached: false,
  activeLinesDetail: '1/2 prepaid mobile lines used (Passport cap).',
  ...over,
});
const outcome = (checks, id) => checks.find((c) => c.id === id)?.outcome;

test('KYC_01: the prepaid ID types are QID, Diplomatic ID, GCC ID and Passport', () => {
  assert.deepEqual(ids.idTypesFor('prepaid').sort(), ['Diplomatic ID', 'GCC ID', 'Passport', 'QID']);
});

test('KYC_01: Passport and GCC ID are permitted outright on prepaid, but still route on postpaid', () => {
  const asOf = new Date('2026-10-13');
  for (const type of ['Passport', 'GCC ID']) {
    const ctx = baseCtx({ doc: { documentType: type, expiryDate: '2099-01-01' } });
    assert.equal(outcome(engine.evaluateEligibilityChecks({ ...ctx, journeyType: 'prepaid' }, asOf), 'id-type-routing'), 'pass', `${type} on prepaid`);
    assert.equal(outcome(engine.evaluateEligibilityChecks(ctx, asOf), 'id-type-routing'), 'approval-routing', `${type} on postpaid`);
  }
  // An ID outside the four (an "Other ID" on record) is still not sold directly.
  const other = baseCtx({ doc: { documentType: 'Other ID', expiryDate: '2099-01-01' }, journeyType: 'prepaid' });
  assert.equal(outcome(engine.evaluateEligibilityChecks(other, asOf), 'id-type-routing'), 'approval-routing');
});

test('ECC_01: a collections block stops postpaid only; prepaid is still offered', () => {
  const asOf = new Date('2026-10-13');
  const ctx = baseCtx({ customer: { customerId: 'C', idType: 'QID', dob: '1990-01-01', blacklisted: true, blacklistCategory: 'collections' }, outstandingQar: 250 });
  assert.equal(outcome(engine.evaluateEligibilityChecks(ctx, asOf), 'blacklist-collections'), 'soft-stop');
  assert.equal(outcome(engine.evaluateEligibilityChecks({ ...ctx, journeyType: 'prepaid' }, asOf), 'blacklist-collections'), 'pass');
  // A security block is a hard stop on either.
  const sec = { ...ctx, customer: { ...ctx.customer, blacklistCategory: 'security' }, journeyType: 'prepaid' };
  assert.equal(outcome(engine.evaluateEligibilityChecks(sec, asOf), 'blacklist-security'), 'hard-stop');
});

test('ECC_01: reaching the prepaid line limit names prepaid and routes for approval', () => {
  const checks = engine.evaluateEligibilityChecks(baseCtx({ lineCapReached: true, journeyType: 'prepaid', activeLinesDetail: 'Passport holders are capped at 2 prepaid mobile lines - this customer already has 2.' }), new Date('2026-10-13'));
  const lines = checks.find((c) => c.id === 'active-lines');
  assert.equal(lines.outcome, 'approval-routing');
  assert.match(lines.message, /^Prepaid Line Limit Reached/);
  assert.doesNotMatch(lines.message, /postpaid/i);
});

// ---- PAY_02: SIM card charge ----------------------------------------------------------------------------------------
test('PAY_02: the SIM card charge is QID 10 / Passport 40 when the recharge is under the limit, and none for other ID types', () => {
  assert.equal(charge.simCardCharge('QID', 0).chargeQar, 10);
  assert.equal(charge.simCardCharge('Passport', 0).chargeQar, 40);
  assert.equal(charge.simCardCharge('QID', 500).applies, false);
  for (const t of ['GCC ID', 'Diplomatic ID', undefined]) assert.equal(charge.simCardCharge(t, 0).applies, false);
});

// ---- #8.1 cart ------------------------------------------------------------------------------------------------------
const simOk = { simType: 'Physical', simValid: true, simSerial: 'S1' };
const draft = (over = {}) => ({ productId: 'PROD-301', msisdn: '+97433001001', simType: simOk, ...over });

test('cart: a subscription needs a pack, a number and a finished SIM; the cart is the committed lines plus the one being edited', () => {
  assert.equal(cart.currentLine({ productId: 'PROD-301', msisdn: '+97433001001' }), undefined);
  assert.equal(cart.currentLine(draft({ simType: { simType: 'Physical', simValid: false } })), undefined);
  assert.ok(cart.currentLine(draft({ simType: { simType: 'eSIM', esimIssued: true } })));
  const committed = cart.currentLine(draft());
  const values = { ...draft({ msisdn: '+97433001002', simType: { ...simOk, simSerial: 'S2' } }), cart: [committed] };
  assert.deepEqual(cart.allLines(values).map((l) => l.msisdn), ['+97433001001', '+97433001002']);
  assert.equal(cart.isCartValid(values), true);
  assert.equal(cart.isCartValid({}), false);
});

test('cart: a number or SIM repeated across subscriptions is refused', () => {
  const a = cart.currentLine(draft());
  const sameNumber = cart.currentLine(draft({ simType: { ...simOk, simSerial: 'S2' } }));
  const sameSim = cart.currentLine(draft({ msisdn: '+97433001002' }));
  assert.equal(cart.duplicateIn([a, sameNumber])?.kind, 'number');
  assert.equal(cart.duplicateIn([a, sameSim])?.kind, 'SIM');
  assert.equal(cart.isCartValid({ cart: [a], ...draft({ msisdn: '+97433001002' }) }), false);
});

test('CVC_02: totals add every subscription\'s starter pack (net of discount), add-ons, premium number and SIM charge', () => {
  const products = [{ productId: 'PROD-301', name: 'Red 25', starterPackChargeQAR: 25 }, { productId: 'PROD-300', name: 'SIM only', starterPackChargeQAR: 0 }];
  const extras = [{ addonDiscountId: 'D1', name: 'Welcome', price: -0.1 }, { addonDiscountId: 'A1', name: 'Roaming', price: 40 }];
  const one = cart.currentLine(draft({ discountId: 'D1', addonIds: ['A1'], priceQAR: 500 }));
  const simOnly = cart.currentLine(draft({ productId: 'PROD-300', msisdn: '+97433001002', simType: { ...simOk, simSerial: 'S2' } }));
  const c1 = cart.priceLine(one, 'QID', products, extras);
  assert.deepEqual([c1.starterPackQar, c1.addonsQar, c1.numberQar, c1.simCardChargeQar, c1.totalQar], [23, 40, 500, 0, 563]);
  // A SIM-only line (recharge 0) triggers the QID SIM card charge.
  assert.equal(cart.priceLine(simOnly, 'QID', products, extras).simCardChargeQar, 10);
  assert.equal(cart.cartTotals([one, simOnly], 'QID', products, extras).totalDueQar, 563 + 10);
});

// ---- NUM_02 / SIM_02: Pre-Paired SIM --------------------------------------------------------------------------------
test('NUM_02: choosing a Pre-Paired SIM satisfies the Number step without a number', () => {
  const step = num.numberSelectionStep({ priceField: 'priceQAR', prePairedOption: true });
  assert.equal(step.isValid({}), false);
  assert.equal(step.isValid({ prePaired: true }), true);
  assert.equal(step.isValid({ msisdn: '+97433001001' }), true);
  // Journeys that do not offer the option are unchanged.
  assert.equal(num.numberSelectionStep().isValid({ prePaired: true }), false);
});

test('SIM_02: a Pre-Paired SIM step needs a validated Pre-Paired SIM and its MSISDN, and does not auto-advance', () => {
  const step = sim.simTypeStep({ prePaired: (v) => v.prePaired === true });
  const scanned = { simType: 'Physical', simValid: true, prePaired: true, prePairedMsisdn: '+97433990001' };
  assert.equal(step.isValid({ prePaired: true, simType: scanned }), false, 'the MSISDN has not reached the journey yet');
  assert.equal(step.isValid({ prePaired: true, msisdn: '+97433990001', simType: scanned }), true);
  // No SIM step moves on by itself any more: the SIM Type and ICCID are on screen for the agent to read before Continue.
  assert.equal(step.autoAdvanceWhen, undefined);
});

test('Pre-Paired SIMs are in their own stock, with an MSISDN and Available', async () => {
  const sims = await db.list('sims');
  const prePaired = sims.filter((s) => s.prePaired);
  assert.ok(prePaired.length >= 2);
  assert.ok(prePaired.every((s) => s.msisdn && s.stockStatus === 'Available'));
  assert.ok(sims.some((s) => s.type === 'Printed eSIM' && s.stockStatus === 'Available'), 'a stocked Printed eSIM to deplete at payment');
});

// ---- CRS_001: cross-sales offers on the prepaid journey --------------------------------------------------------------
test('CRS_001: New Prepaid offers continue in the prepaid wizard, and New Postpaid offers hand off to New Connection', () => {
  assert.equal(cross.continuesHere('new-prepaid', 'new-prepaid'), true);
  assert.equal(cross.continuesHere('new-postpaid', 'new-prepaid'), false);
  assert.equal(cross.hasDestination('new-postpaid', 'new-prepaid'), true, 'New Postpaid has a route to hand off to');
  assert.ok(cross.offerTypesFor('new-prepaid').some((t) => t.key === 'new-prepaid'));
  // The Postpaid Offers step is unchanged: no New Prepaid section, and only New Postpaid continues there.
  assert.ok(!cross.offerTypesFor().some((t) => t.key === 'new-prepaid'));
  assert.equal(cross.continuesHere('new-postpaid'), true);
  assert.equal(cross.continuesHere('new-prepaid'), false);
});

// ---- submit: CAM_03/04, PAY_03/04, NET_01-05 ------------------------------------------------------------------------
async function runSubmit({ customerId = 'CUST-3017', idType = 'QID', hrn = false, manualEntry = false, lines, checks = [] }) {
  const created = [];
  const updated = [];
  const values = {
    contact: { idType, idNumber: '29904063400099', email: 'a@example.qa', manualEntry, moiResult: { name: 'Test Customer', email: 'a@example.qa' } },
    eligibility: { pass: true, checks, requiresHrnAdvance: hrn, customerId },
    cart: lines,
    payment: { paid: true, method: 'Cash' },
    caf: { cafType: 'Digital', signatureDataUrl: 'data:image/png;base64,AAAA' },
  };
  const confirmed = await submit.submitPrepaidOrder(values, {
    createRecord: async (kind, rec) => void created.push({ kind, rec }),
    updateRecord: async (kind, key, id, patch) => void updated.push({ kind, key, id, patch }),
  }, 'tablet');
  return { confirmed, created, updated, order: created.find((c) => c.kind === 'orders')?.rec };
}
const line = (over = {}) => ({ productId: 'PROD-301', addonIds: [], prePaired: false, msisdn: '+97433001001', numberPriceQAR: 0, simType: { simType: 'Physical', simValid: true, simSerial: '8974412009900129000', simKind: 'Physical' }, ...over });

test('CAM_03 / CAM_04: an HRN customer is not routed for approval; the flag is stored on the prepaid account', async () => {
  const { order, created, updated, confirmed } = await runSubmit({ hrn: true, lines: [line()] });
  assert.equal(confirmed.pendingApproval, false);
  assert.equal(order.orderSubType, 'Consumer');
  assert.notEqual(order.status, 'Submitted for Approval');
  const account = created.find((c) => c.kind === 'accounts')?.rec ?? updated.find((u) => u.kind === 'accounts')?.patch;
  assert.equal(account.hrnFlag, true);
  // No credit limit or billing account is created for prepaid (CAM_02).
  assert.equal(created.find((c) => c.kind === 'accounts')?.rec.billingProfileId, undefined);
});

test('ORD: only an approval-routing eligibility outcome or a manual ID entry routes a prepaid order', async () => {
  const cap = { id: 'active-lines', outcome: 'approval-routing', message: 'Prepaid Line Limit Reached\nPassport holders are capped at 2 prepaid mobile lines - this customer already has 2.' };
  const routed = await runSubmit({ lines: [line()], checks: [cap] });
  assert.equal(routed.confirmed.pendingApproval, true);
  assert.match(routed.order.approvalReason, /Active prepaid line limit reached/);
  const manual = await runSubmit({ lines: [line()], manualEntry: true });
  assert.equal(manual.order.approverRole, 'Sales Manager');
});

test('ORD / sourceChannel: the order is stamped with the device', async () => {
  const { order } = await runSubmit({ lines: [line()] });
  assert.equal(order.sourceChannel, 'Tablet');
});

test('PAY_03 / PAY_04: a stocked SIM is depleted on payment; a Virtual eSIM is depleted at fulfilment', async () => {
  const printed = line({ msisdn: '+97433001002', simType: { simType: 'Physical', simValid: true, simSerial: '8974412009900140101', simKind: 'Printed eSIM' } });
  const virtual = line({ msisdn: '+97433001003', simType: { simType: 'eSIM', esimIssued: true, esimActivationCode: 'LPA:1$x$y' } });
  const { updated } = await runSubmit({ lines: [printed, virtual] });
  assert.deepEqual(updated.filter((u) => u.kind === 'sims').map((u) => u.id), ['8974412009900140101']);
  const trail = updated.find((u) => u.kind === 'orders' && u.patch.fulfilmentEvents)?.patch.fulfilmentEvents ?? [];
  assert.ok(trail.some((e) => e.requirement === 'MPRA_001_PAY_03'));
  assert.ok(trail.some((e) => e.requirement === 'MPRA_001_PAY_04' && /Virtual eSIM/.test(e.event)));
});

test('NET_01-04: each subscription gets a service and a charging account, a Pre-Paired SIM has its barring removed, and the order ends Complete', async () => {
  const pre = line({ prePaired: true, msisdn: '+97433990001', simType: { simType: 'Physical', simValid: true, simSerial: '8974412009900140001', simKind: 'Physical', prePaired: true, prePairedMsisdn: '+97433990001' } });
  const { created, updated, confirmed } = await runSubmit({ lines: [pre, line({ msisdn: '+97433001004', simType: { simType: 'Physical', simValid: true, simSerial: '8974412345678901234', simKind: 'Physical' } })] });
  const assets = created.filter((c) => c.kind === 'installed-assets').map((c) => c.rec);
  assert.equal(assets.length, 2);
  assert.equal(assets.find((a) => a.msisdn === '+97433990001').barringStatus, 'Removed');
  assert.equal(assets.find((a) => a.msisdn === '+97433001004').barringStatus, 'None');
  assert.equal(created.filter((c) => c.kind === 'in-platform-balances').length, 2);
  const statuses = updated.filter((u) => u.kind === 'orders' && u.patch.status).map((u) => u.patch.status);
  assert.deepEqual(statuses, ['In Progress', 'Complete']);
  assert.equal(confirmed.msisdn, '+97433990001, +97433001004');
});

test('PAY_02: the order carries the SIM card charge per line and the total payable', async () => {
  // A SIM-only pack (starter charge 0) on a QID triggers the QID SIM card charge.
  const { order } = await runSubmit({ idType: 'QID', lines: [line({ productId: 'PROD-300' })] });
  assert.equal(order.simCardChargeQAR, 10);
  assert.equal(order.totalQAR, 10);
  assert.equal(order.lines[0].simCardChargeQAR, 10);
});

// ---- CAF (CAF_01-03, Milestone 4) -----------------------------------------------------------------------------------
test('CAF: the full variant needs the signature on a tablet (Touch Screen) as well as the web (Digital), and locks once signed', () => {
  const step = caf.cafSignatureStep({ variant: 'full', journey: 'prepaid' });
  for (const cafType of ['Digital', 'Touch Screen']) {
    assert.equal(step.isValid({ caf: { cafType } }), false, `${cafType} unsigned`);
    assert.equal(step.locksAfter({ caf: { cafType } }), false, `${cafType} unsigned must not lock`);
    const signed = { caf: { cafType, signatureDataUrl: 'data:image/png;base64,AAAA' } };
    assert.equal(step.isValid(signed), true, `${cafType} signed`);
    assert.equal(step.locksAfter(signed), true);
    assert.equal(step.customerFacing(signed), true);
  }
});

test('Offers step lists the offer types in the agreed order', async () => {
  const m = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  assert.deepEqual(m.OFFER_TYPES.map((t) => t.label), ['New Postpaid', 'New Home', 'New MNP', 'New Prepaid', 'Prepaid to Postpaid Upgrade', 'Postpaid to Postpaid Upgrade']);
});

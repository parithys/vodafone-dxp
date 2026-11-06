// New Connection is ONE journey: Customer Verification once, then the chosen product's steps in the same wizard.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let conn, products, engine, billing, store, mnp, cross, pstep, mnpSteps, attach;
before(async () => {
  await boot();
  conn = await load('/src/modules/new-connection/connectionSteps.tsx');
  products = await load('/src/modules/new-connection/products.ts');
  engine = await load('/src/engines/eligibilityEngine.ts');
  billing = await load('/src/capabilities/Billing/persistBillingAccount.ts');
  store = await load('/src/stores/workflowStore.ts');
  mnp = await load('/src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts');
  cross = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  pstep = await load('/src/modules/new-connection/steps/productStep.tsx');
  mnpSteps = await load('/src/modules/mnp-fnp-porting/screens/mnpSteps.tsx');
  attach = await load('/src/components/patterns/donorModel.ts');
});
after(close);

const ctx = { device: 'web', wizardId: 'new-connection', flow: 'new', existingCustomerId: undefined, guardedContactChange: () => {}, applyCrossSales: () => {}, navigate: () => {}, createRecord: async () => {}, products: [], customerBenefits: undefined };
const activeKeys = (values) => conn.buildConnectionSteps(ctx).filter((s) => !s.skip?.(values)).map((s) => s.key);

// ---- Continue and Back ---------------------------------------------------------------------------------------------------
// Customer Verification always goes on to Recommended Offers: Address and Billing Profile are passed over (their data is resolved for the
// agent), and Back mirrors it - it never lands the agent on a page Continue skipped. Every product, with and without a billing profile.
const PRODUCT_CASES = [{}, { product: 'postpaid' }, { product: 'prepaid' }, { product: 'fixed-line' }, { product: 'mnp', mnpType: 'postpaid' }, { product: 'mnp', mnpType: 'prepaid' }];
test('Continue from Customer Verification lands on Recommended Offers for every product, whatever the customer', async () => {
  const nav = await load('/src/components/patterns/wizard/wizardNavigation.ts');
  for (const customer of [{}, { contact: { moiResult: { isNewCustomer: true, createdByAgent: true } } }, { contact: { moiResult: { isNewCustomer: false } } }]) {
    for (const p of PRODUCT_CASES) {
      const values = { ...customer, ...p };
      const steps = conn.buildConnectionSteps(ctx).filter((s) => !s.skip?.(values));
      assert.equal(steps[nav.nextStepIndex(steps, 0, values)].key, 'product', JSON.stringify(values));
      // ...and Back from it returns to Customer Verification, not to a page Continue skipped.
      const at = steps.findIndex((s) => s.key === 'product');
      assert.equal(steps[nav.previousStepIndex(steps, at, values)].key, 'contact', JSON.stringify(values));
    }
  }
});

test('Continue never lands on a step that is passed over, and Back never lands on one except to reach the first step', async () => {
  const nav = await load('/src/components/patterns/wizard/wizardNavigation.ts');
  for (const values of PRODUCT_CASES) {
    const steps = conn.buildConnectionSteps(ctx).filter((s) => !s.skip?.(values));
    for (let i = 0; i < steps.length - 1; i++) {
      const to = nav.nextStepIndex(steps, i, values);
      assert.ok(to > i && to <= steps.length - 1);
      if (to < steps.length - 1) assert.ok(!steps[to].autoPass?.(values), `${steps[i].key} -> ${steps[to].key}`);
    }
    for (let i = 1; i < steps.length; i++) {
      const to = nav.previousStepIndex(steps, i, values);
      assert.ok(to < i && to >= 0);
      if (to > 0) assert.ok(!steps[to].autoPass?.(values), `${steps[i].key} <- ${steps[to].key}`);
    }
  }
});

// ---- one wizard, four products ----------------------------------------------------------------------------------------
test('before a product is chosen the journey is Customer Verification, Address and Product Selection (Billing comes later)', () => {
  assert.deepEqual(activeKeys({}), ['contact', 'address', 'product']);
});

test('every product continues the same wizard: identification, address, billing profile (where the product has one), product selection, then that product\'s own steps', () => {
  assert.deepEqual(activeKeys({ product: 'postpaid' }), ['contact', 'address', 'product', 'plan', 'planExtras', 'number', 'simType', 'billingAccount', 'checkout', 'caf', 'payment'], 'New Postpaid: SIM Selection -> Billing -> Order Summary (the add-ons are reviewed on the Addons page)');
  assert.deepEqual(activeKeys({ product: 'prepaid' }), ['contact', 'address', 'product', 'plan', 'planExtras', 'recharge', 'number', 'simType', 'cart', 'checkout', 'caf', 'payment']);
  assert.deepEqual(activeKeys({ product: 'fixed-line' }), ['contact', 'address', 'billingAccount', 'product', 'homeKind', 'installation', 'plan', 'number', 'checkout', 'caf', 'payment', 'appointment']);
  assert.deepEqual(activeKeys({ product: 'mnp', mnpType: 'postpaid' }), ['contact', 'address', 'billingAccount', 'product', 'mnpType', 'sim', 'plan', 'planExtras', 'donor-details', 'checkout', 'donor-attachment', 'caf', 'payment']);
  assert.deepEqual(activeKeys({ product: 'mnp', mnpType: 'prepaid' }), ['contact', 'address', 'product', 'mnpType', 'sim', 'plan', 'planExtras', 'donor-details', 'checkout', 'donor-attachment', 'caf', 'payment']);
});

test('no two active steps share a key, for any product', () => {
  for (const values of [{ product: 'postpaid' }, { product: 'prepaid' }, { product: 'fixed-line' }, { product: 'mnp', mnpType: 'postpaid' }, { product: 'mnp', mnpType: 'prepaid' }]) {
    const keys = activeKeys(values);
    assert.equal(new Set(keys).size, keys.length, `${JSON.stringify(values)} has a duplicate key: ${keys}`);
  }
});

test('a product\'s steps never leak into another product\'s journey', () => {
  assert.ok(!activeKeys({ product: 'postpaid' }).includes('cart'));
  assert.ok(!activeKeys({ product: 'prepaid' }).includes('billingAccount'), 'prepaid has no billing account');
  assert.ok(!activeKeys({ product: 'fixed-line' }).includes('simType'));
});

test('eligibility is judged by the product chosen; billing exists only where the product has one', () => {
  assert.equal(products.eligibilityJourney({ product: 'prepaid' }), 'prepaid');
  assert.equal(products.eligibilityJourney({ product: 'mnp', mnpType: 'prepaid' }), 'prepaid');
  for (const v of [{ product: 'postpaid' }, { product: 'fixed-line' }, { product: 'mnp', mnpType: 'postpaid' }]) assert.equal(products.eligibilityJourney(v), 'postpaid');
  assert.equal(products.hasBillingAccount({ product: 'postpaid' }), true);
  assert.equal(products.hasBillingAccount({ product: 'fixed-line' }), true);
  assert.equal(products.hasBillingAccount({ product: 'prepaid' }), false);
  assert.equal(products.hasBillingAccount({ product: 'mnp', mnpType: 'prepaid' }), false);
});

test('switching product drops what the old product chose but keeps identity, eligibility and customer type', () => {
  for (const kept of ['contact', 'eligibility', 'customerType', 'crossSales', 'product']) assert.ok(!products.PRODUCT_OWNED_KEYS.includes(kept), kept);
  for (const kept of ['address', 'addressId', 'billingAccount']) assert.ok(!products.PRODUCT_OWNED_KEYS.includes(kept), `${kept} is collected before the product, so it stays`);
  for (const dropped of ['msisdn', 'simType', 'productId', 'cart', 'caf', 'payment', 'installation']) assert.ok(products.PRODUCT_OWNED_KEYS.includes(dropped), dropped);
});

test('patchDraft changes values together and pulls progress back to the product step', () => {
  const { useWorkflowStore } = store;
  const id = 'test-wizard';
  useWorkflowStore.getState().clearDraft(id);
  const s = useWorkflowStore.getState();
  s.setFieldValue(id, 'product', 'prepaid');
  s.setFieldValue(id, 'msisdn', '+97433001001');
  s.setFieldValue(id, 'contact', { idNumber: 'X' });
  s.setStep(id, 7);
  assert.equal(useWorkflowStore.getState().getDraft(id).maxStepReached, 7);
  useWorkflowStore.getState().patchDraft(id, { set: { product: 'postpaid' }, unset: products.PRODUCT_OWNED_KEYS, progressTo: 1 });
  const d = useWorkflowStore.getState().getDraft(id);
  assert.equal(d.values.product, 'postpaid');
  assert.equal(d.values.msisdn, undefined);
  assert.deepEqual(d.values.contact, { idNumber: 'X' });
  assert.equal(d.maxStepReached, 1, 'progress is lowered, which setStep alone never does');
  assert.equal(d.currentStep, 1);
  useWorkflowStore.getState().clearDraft(id);
});

test('an offer for any of the four products continues in the wizard; an upgrade still hands off', () => {
  assert.deepEqual(Object.values(products.PRODUCT_OF_OFFER_JOURNEY).sort(), ['fixed-line', 'fixed-line', 'mnp', 'mnp', 'postpaid', 'prepaid']);
  for (const j of products.IN_JOURNEY_OFFERS) assert.equal(cross.continuesHere(j, products.IN_JOURNEY_OFFERS), true, j);
  assert.equal(cross.continuesHere('pre-to-post', products.IN_JOURNEY_OFFERS), false);
  assert.equal(cross.hasDestination('pre-to-post', products.IN_JOURNEY_OFFERS), true, 'an upgrade has a route to hand off to');
  assert.equal(products.mnpTypeOfOffer('mnp-prepaid'), 'prepaid');
});

// ---- eligibility: common scope at identification, product scope once a product is chosen -----------------------------------
test('identification reports only the checks common to every product; the product step reports the full set', () => {
  const ctx = {
    customer: { customerId: 'C', idType: 'Passport', dob: '1990-01-01', blacklisted: true, blacklistCategory: 'collections' },
    doc: { documentType: 'Passport', expiryDate: '2099-01-01' },
    deals: [], outstandingQar: 100, lineCapReached: true, activeLinesDetail: 'cap',
  };
  const common = engine.evaluateEligibilityChecks({ ...ctx, scope: 'common' }, new Date('2026-10-13')).map((c) => c.id);
  // A Passport also reports its visa (visa-validity), which does not depend on the product either.
  assert.deepEqual(common.sort(), ['age', 'blacklist-security', 'deals', 'id-validity', 'visa-validity']);
  const full = engine.evaluateEligibilityChecks({ ...ctx, scope: 'product' }, new Date('2026-10-13'));
  assert.ok(['id-type-routing', 'blacklist-collections', 'active-lines'].every((id) => full.some((c) => c.id === id)));
  assert.equal(full.find((c) => c.id === 'blacklist-collections').outcome, 'soft-stop', 'a collections block stops a postpaid product');
  const prepaid = engine.evaluateEligibilityChecks({ ...ctx, scope: 'product', journeyType: 'prepaid' }, new Date('2026-10-13'));
  assert.equal(prepaid.find((c) => c.id === 'blacklist-collections').outcome, 'pass', 'but not prepaid');
});

// ---- billing account: create one and make it the default ---------------------------------------------------------------
const run = async (billingValue, extra = {}) => {
  const created = [];
  const id = await billing.persistBillingAccount(billingValue, { createRecord: async (kind, rec) => void created.push({ kind, rec }), kind: 'Consumer Mobile Postpaid', customerId: 'CUST-1', idNumber: '2845', contactName: 'Test Customer', contactEmail: 't@example.qa', ...extra });
  return { id, created };
};

test('a customer with no billing account gets the new one created and set as the default', async () => {
  const { id, created } = await run({ creatingNew: true, newAccount: { profileName: 'Test - Postpaid', billCycleDay: 15, billMedia: 'Email' } }, { creditLimitQar: 1000 });
  const profile = created.find((c) => c.kind === 'billing-profiles').rec;
  const account = created.find((c) => c.kind === 'accounts').rec;
  assert.equal(id, profile.billingProfileId);
  assert.equal(profile.isDefault, true);
  assert.equal(profile.accountId, account.accountId);
  assert.equal(account.billingProfileId, profile.billingProfileId);
  assert.equal(account.accountType, 'Consumer Mobile Postpaid');
  assert.equal(account.customerId, 'CUST-1');
  assert.equal(profile.billingCycle, 'Monthly - Day 15');
  assert.equal(profile.creditLimitQAR, 1000);
});

test('an existing billing account is reused, and nothing is created when there is none to make', async () => {
  const existing = await run({ selectedProfileId: 'BILL-7001' });
  assert.equal(existing.id, 'BILL-7001');
  assert.equal(existing.created.length, 0);
  const none = await run(undefined);
  assert.equal(none.id, undefined);
  assert.equal(none.created.length, 0);
});

// ---- MNP in the same journey ----------------------------------------------------------------------------------------
const mnpValues = (over = {}) => withSignedForm({
  product: 'mnp', mnpType: 'postpaid',
  contact: { idNumber: '2845', email: 'a@example.qa', isB2B2C: false, moiResult: { name: 'Test Customer', email: 'a@example.qa' } },
  eligibility: { checks: [], customerId: 'CUST-1', defaultCreditLimitQar: 1000 },
  billingAccount: { creatingNew: true, newAccount: { profileName: 'Test - Postpaid', billCycleDay: 1 } },
  donorDetails: { portInNumber: '97466000666', donorId: 'P1', donorIdType: 'Passport', donorCustomerType: 'Individual', donorOperator: 'Other Operator', donorSubscriptionType: 'Postpaid' },
  productId: 'PROD-104', simSerial: '8974412345678901234', simValid: true, comments: 'note',
  caf: { cafType: 'Digital', signatureDataUrl: 'data:image/png;base64,x' },
  checkoutTotals: { dueTodayQar: 0, monthlyRecurringQar: 350, hrnAdvanceQar: 0 },
  payment: { paid: true, method: 'Zero value', zeroValue: true, reference: 'RCPT-0-12345678' },
  ...over,
});
// The MNP Form is signed on the data the journey holds: its key is computed from the values, as the step does.
function withSignedForm(values) {
  const key = attach.mnpFormSnapshotKey(mnpSteps.mnpFormInputOf(values));
  return { ...values, donorAttachment: { mnpFormType: 'MNP-Digital', formNumber: 'MNPF-261001-000001', signed: true, signatureDataUrl: 'data:image/png;base64,x', snapshotKey: key } };
}
const submitMnp = async (values) => {
  const created = [];
  const updated = [];
  const confirmed = await mnp.submitMnpOrder(values, { createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, idField, id, patch }) });
  return { confirmed, created, updated, order: created.find((c) => c.kind === 'orders').rec };
};

test('MNP: a port request is Pending NPAS Approval, takes no payment, and a postpaid port-in gets a default billing account', async () => {
  const { confirmed, created, order } = await submitMnp(mnpValues());
  assert.equal(order.status, 'Pending NPAS Approval');
  assert.equal(confirmed.dueTodayQar, 0, 'nothing is due on a port-in with no HRN advance');
  assert.equal(confirmed.statusLabel, 'Pending NPAS Approval');
  assert.equal(confirmed.msisdn, '97466000666');
  const request = created.find((c) => c.kind === 'mnp-portin-orders').rec;
  assert.equal(request.donorOperator, 'Other Operator');
  assert.equal(request.orderStatus, 'Pending NPAS Approval');
  assert.equal(request.portStatus, 'Pending Approval');
  assert.equal(request.trackingStatus, 'In Progress');
  assert.equal(request.simStatus, 'Reserved');
  assert.equal(request.paymentAmountQar, 0);
  assert.equal(request.receiptNumber, 'RCPT-0-12345678');
  assert.ok(confirmed.extraLines.some((l) => l.label === 'Zero-value receipt'));
  assert.equal(request.mnpFormNumber, 'MNPF-261001-000001');
  assert.equal(request.notifications[0].type, 'Submission');
  assert.ok(confirmed.trackAction.to.includes(request.id), 'the confirmation links to the request');
  assert.equal(order.billingProfileId, created.find((c) => c.kind === 'billing-profiles').rec.billingProfileId);
});

test('MNP: B2B2C postpaid goes for manager approval; prepaid has no billing account and ignores B2B2C', async () => {
  const b2b = await submitMnp(mnpValues({ contact: { ...mnpValues().contact, isB2B2C: true } }));
  assert.equal(b2b.order.status, 'Submitted for Approval');
  assert.equal(b2b.confirmed.pendingApproval, true);
  assert.equal(b2b.created.find((c) => c.kind === 'mnp-portin-orders').rec.orderStatus, 'Submitted', 'it reaches NPAS only after the manager approves');
  const prepaid = await submitMnp(mnpValues({ mnpType: 'prepaid', contact: { ...mnpValues().contact, isB2B2C: true }, discountId: 'ADO-7109' }));
  assert.equal(prepaid.order.status, 'Pending NPAS Approval');
  assert.equal(prepaid.order.orderType, 'MNP Prepaid Port-In');
  assert.ok(!prepaid.created.some((c) => c.kind === 'billing-profiles'));
});

// ---- New Home Connection: the same journey with the four home products ----------------------------------------------------
const homeKeys = (values) => conn.buildConnectionSteps({ ...ctx, journey: 'home' }).filter((s) => !s.skip?.(values)).map((s) => s.key);

test('New Home Connection: Identification, Product Selection, then the home steps - and nothing of the mobile products', () => {
  assert.deepEqual(homeKeys({}), ['contact', 'productSelection']);
  assert.deepEqual(homeKeys({ product: 'fixed-line', homeProduct: 'fibre' }), ['contact', 'productSelection', 'address', 'billingAccount', 'plan', 'number', 'checkout', 'caf', 'payment', 'appointment']);
  assert.ok(!homeKeys({ product: 'postpaid' }).includes('simType'), 'a mobile product is not part of the home journey');
  assert.deepEqual(homeKeys({ product: 'postpaid' }), ['contact', 'productSelection']);
});

test('the four home products are Fibre, Fixed-Line, FWA and 5G Home, with no service type assumed for any', () => {
  assert.deepEqual(products.HOME_PRODUCTS.map((p) => p.key), ['fibre', 'fixed-line', 'fwa', '5g-home']);
  assert.deepEqual(products.HOME_PRODUCTS.map((p) => p.label), ['New Fibre Connection', 'New Fixed-Line Connection', 'New FWA Connection', 'New 5G Home Connection']);
  assert.equal(products.homeProductOfOffer('new-fwa'), 'fwa');
  assert.equal(products.homeProductOfOffer('new-fixed-line'), undefined, 'an offer for a fixed line does not say which home product');
});

test('Fixed Line\'s connection type is asked on its own step, not on Recommended Offers; New Home Connection still picks it on Product Selection', () => {
  const e = { scope: 'product', journeyType: 'postpaid', hardStop: false, softStop: false, checks: [] };
  const step = pstep.productStep(ctx);
  const eFixed = { ...e, connectionType: 'FIXED_FWA' };
  assert.equal(step.isValid({ product: 'fixed-line', eligibility: eFixed }), true, 'Recommended Offers does not wait for the connection type');
  assert.equal(step.isValid({ product: 'fixed-line', eligibility: e }), false, 'a decision judged for a mobile line is not the Fixed Line one');
  assert.equal(step.isValid({ product: 'fixed-line', eligibility: { ...eFixed, lineLimitSkipped: true } }), false, 'a result whose line count was not judged is not clear');
  assert.equal(step.isValid({ product: 'postpaid', eligibility: { ...e, journeyType: 'postpaid' } }), true);
  const home = pstep.productStep({ ...ctx, journey: 'home' });
  assert.equal(home.isValid({ product: 'fixed-line', eligibility: eFixed }), false, 'New Home Connection: no home product chosen yet');
  assert.equal(home.isValid({ product: 'fixed-line', homeProduct: '5g-home', eligibility: eFixed }), true);
  assert.ok(products.PRODUCT_OWNED_KEYS.includes('homeProduct'));
});

test('Product Selection\'s position follows the steps before it: after Address and Billing, or just Address when the product has no billing profile or (New Postpaid) takes it later', async () => {
  const pc = await load('/src/modules/new-connection/steps/productChoice.ts');
  assert.equal(pc.productStepIndex('connection', { product: 'postpaid' }), 2, 'New Postpaid takes its Billing after SIM Selection');
  assert.equal(pc.productStepIndex('connection', { product: 'prepaid' }), 2);
  assert.equal(pc.productStepIndex('connection', { product: 'mnp', mnpType: 'prepaid' }), 2);
  assert.equal(pc.productStepIndex('connection', { product: 'mnp', mnpType: 'postpaid' }), 3);
  assert.equal(pc.productStepIndex('home', { product: 'fixed-line' }), 1, 'New Home Connection has neither step');
  // The index points at the product step in the journey the steps really produce.
  for (const values of [{ product: 'postpaid' }, { product: 'prepaid' }, { product: 'mnp', mnpType: 'prepaid' }]) {
    assert.equal(activeKeys(values)[pc.productStepIndex('connection', values)], 'product', JSON.stringify(values));
  }
});

test('Recommended Offers for an existing customer: every offer type has standard offers to fill it, each an ordinary selectable offer for a real catalogue plan, named and priced as that plan is', async () => {
  const { STANDARD_OFFERS, OFFERS_PER_TYPE } = await load('/src/data/standardOffers.ts');
  const sj = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  const fs = await import('node:fs');
  const products = new Map(JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8')).map((p) => [p.productId, p]));
  assert.equal(OFFERS_PER_TYPE, 3);
  assert.deepEqual(Object.keys(STANDARD_OFFERS).sort(), sj.OFFER_TYPES.map((t) => t.key).sort(), 'no offer type is left out');
  const ids = new Set();
  for (const type of sj.OFFER_TYPES) {
    const offers = STANDARD_OFFERS[type.key];
    // Three, except New Home: the catalogue holds two home plans, and none is invented to make a third.
    assert.equal(offers.length, type.key === 'new-home' ? 2 : 3, type.key);
    for (const o of offers) {
      assert.ok(!ids.has(o.offerId), `${o.offerId} is unique`);
      ids.add(o.offerId);
      assert.equal(sj.offerTypeOf(o.serviceJourney), type.key, `${o.offerId} belongs to its own type`);
      assert.equal('sample' in o, false, 'not a sample: nothing marks it as one');
      assert.equal(sj.hasDestination(o.serviceJourney, ['new-postpaid', 'new-prepaid', 'new-fixed-line', 'new-fwa', 'mnp-postpaid', 'mnp-prepaid']) || Boolean(sj.SERVICE_JOURNEYS.find((j) => j.key === o.serviceJourney)?.route), true, `${o.offerId} leads somewhere, so Select Offer is open`);
      // Over the whole set: it links a plan that exists, of the kind its journey sells, at the price that plan has.
      assert.equal(o.linkedProductIds.length, 1, o.offerId);
      const p = products.get(o.linkedProductIds[0]);
      assert.ok(p, `${o.offerId} links a catalogue product`);
      const kind = { 'new-prepaid': 'Prepaid Plan', 'mnp-prepaid': 'Prepaid Plan', 'new-fixed-line': 'Fixed Line Plan', 'new-fwa': 'FWA 5G Home Plan' }[o.serviceJourney] ?? 'Postpaid Plan';
      assert.equal(p.type, kind, `${o.offerId} links a ${kind}`);
      assert.equal(o.monthlyRental, p.mrcQAR ?? p.starterPackChargeQAR, `${o.offerId} is priced as ${p.name}`);
      if (p.type === 'Postpaid Plan') assert.notEqual(p.listed, false, 'a plan that is sold');
    }
  }
});

test('a customer known to be new has no cross-sales offer: the Recommended Offers page gives way to the five start cards (New Postpaid first); everyone else keeps Recommended Offers', async () => {
  const active = activeKeys;
  assert.ok(active({ eligibility: { isExistingCustomer: false } }).includes('productCards'));
  assert.ok(!active({ eligibility: { isExistingCustomer: false } }).includes('product'));
  assert.ok(active({ eligibility: { isExistingCustomer: true } }).includes('product'));
  assert.ok(!active({ eligibility: { isExistingCustomer: true } }).includes('productCards'));
  assert.ok(active({}).includes('product') && !active({}).includes('productCards'), 'unknown stays on the original page');
  const src = (await import('node:fs')).readFileSync('src/modules/new-connection/steps/StartCards.tsx', 'utf8');
  const order = ['New Postpaid', 'New Home Connection', 'New Fixed Line', 'New MNP', 'New Prepaid'].map((t) => src.indexOf(`title: '${t}'`));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'cards in the requested order');
});

test('every journey floats its Back and Continue footer: it is the wizard default, and only a framed preview opts out', async () => {
  const fs = await import('node:fs');
  const router = fs.readFileSync('src/router.tsx', 'utf8');
  const connectionWizard = fs.readFileSync('src/modules/new-connection/NewConnectionWizard.tsx', 'utf8');
  const guidedWizard = fs.readFileSync('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx', 'utf8');
  const footer = fs.readFileSync('src/components/patterns/wizard/WizardFooter.tsx', 'utf8');
  const previews = fs.readFileSync('src/capabilities/previewDemos.tsx', 'utf8');

  assert.match(guidedWizard, /fixedFooter = true/);
  assert.doesNotMatch(router, /<NewConnectionWizard[^>]*fixedFooter/, 'no route needs to opt in');
  assert.match(connectionWizard, /fixedFooter=\{fixedFooter\}/);
  assert.doesNotMatch(connectionWizard, /fixedFooter = (true|false)/, 'the wizard default is the only default');
  assert.match(guidedWizard, /fixedToViewport=\{fixedFooter\}/);
  assert.doesNotMatch(guidedWizard, /hasSummaryAside/);
  assert.match(footer, /action-bar \$\{fixedPosition\}/);
  assert.match(fs.readFileSync('src/ui-components.css', 'utf8'), /\.action-bar \{[^}]*fixed inset-x-0 z-\[var\(--z-sticky-raised\)\] border-t/);
  assert.match(footer, /row-between w-full/);
  assert.match(guidedWizard, /fixedFooter \?[\s\S]*'pb-24'/);
  // The capability library's framed previews stay inline: a viewport-fixed bar would escape the frame.
  assert.equal((previews.match(/fixedFooter=\{false\}/g) ?? []).length, 2);
});

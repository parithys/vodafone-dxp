import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Change Postpaid Plan, Change Prepaid Pack and Add Add-On: the lines of a customer, the steps each journey runs, the pricing of an
// existing line, and what a submitted order does.
let lines, steps, submit, cart, approval, addons, apply, eng;
before(async () => {
  await boot();
  lines = await load('/src/components/patterns/lineSelectionModel.ts');
  steps = await load('/src/modules/mobile-service-changes/serviceChangeSteps.tsx');
  submit = await load('/src/modules/mobile-service-changes/submitServiceChangeOrder.ts');
  cart = await load('/src/components/patterns/prepaidCartModel.ts');
  approval = await load('/src/modules/new-connection/approvalRouting.ts');
  addons = await load('/src/capabilities/AddonsSelection/step.tsx');
  apply = await load('/src/modules/mobile-service-changes/applyServiceChange.ts');
  eng = await load('/src/engines/customerServicesEngine.ts');
});
after(close);

const ctx = { flow: 'new', existingCustomerId: undefined, guardedContactChange: () => true, products: [], customerBenefits: undefined };
const keys = (list, values = {}) => list.filter((s) => !s.skip?.(values)).map((s) => s.key);

test('a customer\'s lines are their services named Postpaid or Prepaid, by type - including lines whose record carries another plan\'s promotion code', async () => {
  const postpaid = await lines.loadCustomerLines('CUST-1001', 'postpaid');
  assert.deepEqual(postpaid.map((l) => [l.identifier, l.productName]), [['+97455512001', 'Postpaid Essential']], 'the broadband service carrying a postpaid promotion code is not a mobile line');
  const many = await lines.loadCustomerLines('CUST-3082', 'postpaid');
  assert.equal(many.length, 20, 'a customer with 20 postpaid lines is offered all 20, not only the one named for a catalogue plan');
  assert.ok(many.every((l) => l.lineType === 'postpaid' && l.priceQAR > 0));
  const prepaid = await lines.loadCustomerLines('CUST-1001', 'prepaid');
  assert.deepEqual(prepaid.map((l) => l.lineType), ['prepaid', 'prepaid']);
  assert.equal((await lines.loadCustomerLines('CUST-1001')).length, 3, 'with no type: every mobile line');
  assert.deepEqual(await lines.loadCustomerLines('CUST-NONE'), []);
});

test('a line can be changed only when it is active, not barred and its billing profile is not in collections', () => {
  const ok = { status: 'Active', barred: false, inCollections: false };
  assert.equal(lines.lineIneligibility(ok), undefined);
  assert.match(lines.lineIneligibility({ ...ok, status: 'Suspended' }), /suspended/);
  assert.match(lines.lineIneligibility({ ...ok, barred: true }), /barred/);
  assert.match(lines.lineIneligibility({ ...ok, inCollections: true }), /collections/);
});

test('the three journeys run the shared steps in order; Add Add-On has one checkout for each line type', () => {
  assert.deepEqual(steps.changePostpaidPlanSteps(ctx).map((s) => s.key), ['contact', 'line', 'plan', 'planExtras', 'checkout', 'caf', 'payment']);
  assert.deepEqual(steps.changePrepaidPackSteps(ctx).map((s) => s.key), ['contact', 'line', 'plan', 'planExtras', 'checkout', 'payment']);
  const add = steps.addAddonSteps(ctx);
  assert.deepEqual(keys(add, { line: { lineType: 'postpaid' } }), ['contact', 'line', 'addons', 'checkout', 'payment']);
  assert.deepEqual(keys(add, { line: { lineType: 'prepaid' } }), ['contact', 'line', 'addons', 'checkout', 'payment']);
  assert.equal(add.filter((s) => s.key === 'checkout').length, 2);
});

test('a step is complete only with a line that can be changed, and add-ons need at least one chosen', () => {
  const line = steps.changePostpaidPlanSteps(ctx).find((s) => s.key === 'line');
  assert.equal(line.isValid({}), false);
  assert.equal(line.isValid({ line: { status: 'Active', barred: false, inCollections: false } }), true);
  assert.equal(line.isValid({ line: { status: 'Active', barred: true, inCollections: false } }), false);
  const add = addons.addonsSelectionStep({ planId: () => 'PROD-107' });
  assert.equal(add.isValid({}), false);
  assert.equal(add.isValid({ addonIds: ['PROD-101'] }), true);
});

test('choosing a line clears the previous choices; Add Add-On carries the line\'s plan and both bill the line\'s own profile', () => {
  const line = { productId: 'PROD-107', billingProfileId: 'BILL-7001' };
  const planChange = {};
  steps.selectLineForPlanChange(line, (k, v) => void (planChange[k] = v));
  assert.deepEqual([planChange.productId, planChange.discountId, planChange.addonIds], [undefined, undefined, []]);
  assert.deepEqual(planChange.billingAccount, { selectedProfileId: 'BILL-7001' });
  const add = {};
  steps.selectLineForAddon(line, (k, v) => void (add[k] = v));
  assert.deepEqual([add.productId, add.addonIds], ['PROD-107', []]);
  const none = {};
  steps.selectLineForAddon(undefined, (k, v) => void (none[k] = v));
  assert.equal(none.productId, undefined, 'clearing the line clears its plan');
});

test('an existing prepaid line has no SIM card charge; an add-on on the current pack has no starter pack charge', () => {
  const products = [{ productId: 'PROD-302', name: 'Prepaid Red 50', starterPackChargeQAR: 50 }];
  const extras = [{ addonDiscountId: 'ADO-1', name: 'Roaming', price: 40 }];
  const line = { productId: 'PROD-302', addonIds: ['ADO-1'], prePaired: false, msisdn: 'SVC-1', numberPriceQAR: 0, simType: { simType: 'Physical', simValid: true } };
  const fresh = cart.priceLine(line, 'Passport', products, extras);
  const packChange = cart.priceLine(line, 'Passport', products, extras, { existingSim: true });
  const addOn = cart.priceLine(line, 'Passport', products, extras, { existingSim: true, excludePack: true });
  assert.equal(packChange.simCardChargeQar, 0);
  assert.equal(packChange.totalQar, 50 + 40);
  assert.deepEqual([addOn.starterPackQar, addOn.totalQar], [0, 40]);
  assert.ok(fresh.totalQar >= packChange.totalQar, 'a new SIM can carry a SIM card charge');
});

test('an order is held for the manager for the reasons New Mobile Postpaid holds one', () => {
  const base = { contact: {}, eligibility: { checks: [] }, customerType: undefined };
  assert.equal(approval.routesToApproval(base), false);
  assert.equal(approval.routesToApproval({ ...base, contact: { manualEntry: true } }), true);
  assert.equal(approval.routesToApproval({ ...base, eligibility: { checks: [], requiresHrnAdvance: true } }), true);
  assert.equal(approval.routesToApproval({ ...base, eligibility: { checks: [{ outcome: 'approval-routing' }] } }), true);
  assert.equal(approval.routesToApproval({ ...base, discountType: 'MADA Discount' }), true);
  assert.equal(approval.routesToApproval({ ...base, discountType: 'Loyalty Discount' }), false);
  // Prepaid: no HRN, B2B2C or special-discount routing; only an identity entered by hand and eligibility's own approval routes.
  const hrn = { ...base, eligibility: { checks: [], requiresHrnAdvance: true }, contact: { isB2B2C: true }, discountType: 'MADA Discount', prepaid: true };
  assert.equal(approval.routesToApproval(hrn), false);
  assert.equal(approval.routesToApproval({ ...hrn, contact: { manualEntry: true } }), true);
  assert.equal(approval.routesToApproval({ ...hrn, eligibility: { checks: [{ outcome: 'approval-routing' }] } }), true);
});

const deps = () => {
  const created = [];
  const updated = [];
  return { created, updated, createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, idField, id, patch }) };
};
const base = (line, over = {}) => ({
  contact: { idNumber: '28456701234', idType: 'QID', moiResult: { name: 'Test Customer' } },
  eligibility: { customerId: 'CUST-1001', checks: [] },
  line,
  ...over,
});

test('a completed plan change records the order and moves the line to the new plan; a held one leaves the line as it is', async () => {
  const [line] = await lines.loadCustomerLines('CUST-1001', 'postpaid');
  const d = deps();
  const done = await submit.submitServiceChangeOrder('change-postpaid-plan', base(line, { productId: 'PROD-104', checkoutTotals: { dueTodayQar: 0, monthlyRecurringQar: 0, hrnAdvanceQar: 0 } }), d);
  const order = d.created.find((c) => c.kind === 'orders').rec;
  assert.deepEqual([order.orderType, order.orderSubType, order.status, order.previousProductId, order.productId], ['Plan Change', 'Post2Post', 'Complete', line.productId, 'PROD-104']);
  assert.equal(d.updated[0].id, line.installedAssetId);
  assert.equal(d.updated[0].patch.promotion, 'PROD-104');
  assert.equal(done.pendingApproval, false);
  assert.ok(done.monthlyRecurringQar > 0);

  const held = deps();
  const pending = await submit.submitServiceChangeOrder('change-postpaid-plan', base(line, { productId: 'PROD-104', eligibility: { customerId: 'CUST-1001', checks: [], requiresHrnAdvance: true } }), held);
  assert.equal(pending.pendingApproval, true);
  assert.equal(held.updated.length, 0, 'the line changes only once the order completes');
  assert.equal(held.created.find((c) => c.kind === 'orders').rec.status, 'Submitted for Approval');
});

test('a prepaid pack change collects the pack; an add-on records the add-ons and leaves the plan', async () => {
  const [prepaid] = await lines.loadCustomerLines('CUST-1001', 'prepaid');
  const d = deps();
  const pack = await submit.submitServiceChangeOrder('change-prepaid-pack', base(prepaid, { productId: 'PROD-303', checkoutTotals: { totalDueQar: 100 } }), d);
  assert.equal(pack.dueTodayQar, 100);
  assert.equal(d.created.find((c) => c.kind === 'orders').rec.orderType, 'Prepaid Pack Change');
  assert.equal(d.updated[0].patch.promotion, 'PROD-303');

  const [postpaid] = await lines.loadCustomerLines('CUST-1001', 'postpaid');
  const a = deps();
  const added = await submit.submitServiceChangeOrder('add-addon', base(postpaid, { productId: postpaid.productId, addonIds: ['PROD-101'], checkoutTotals: { dueTodayQar: 0 } }), a);
  const order = a.created.find((c) => c.kind === 'orders').rec;
  assert.deepEqual([order.orderType, order.orderSubType, order.addonIds], ['Add-On', 'Postpaid Add-On', ['PROD-101']]);
  assert.equal(a.updated.length, 0, 'an add-on does not change the line\'s plan');
  assert.match(added.planName, /International 50/);
});

test('an approved plan or pack change moves the line, by the same function a completed one uses; an add-on or an unknown plan changes nothing', async () => {
  assert.deepEqual(apply.lineChangeOf({ orderType: 'Plan Change', installedAssetId: 'IA-1', productId: 'PROD-104' }), { installedAssetId: 'IA-1', productId: 'PROD-104' });
  assert.deepEqual(apply.lineChangeOf({ orderType: 'Prepaid Pack Change', installedAssetId: 'IA-2', productId: 'PROD-303' }), { installedAssetId: 'IA-2', productId: 'PROD-303' });
  for (const o of [{ orderType: 'Add-On', installedAssetId: 'IA-1', productId: 'PROD-104' }, { orderType: 'Plan Change', productId: 'PROD-104' }, { orderType: 'Plan Change', installedAssetId: 'IA-1' }, { orderType: 'New Postpaid Activation', installedAssetId: 'IA-1', productId: 'P' }, {}]) {
    assert.equal(apply.lineChangeOf(o), undefined, JSON.stringify(o));
  }
  const updates = [];
  const update = async (kind, idField, id, patch) => void updates.push({ kind, idField, id, patch });
  assert.equal(await apply.applyLineChange({ installedAssetId: 'IA-9154', productId: 'PROD-104' }, update), true);
  const post = updates[0].patch;
  assert.equal(eng.mobileLineTypeOfName(post.productServiceName), 'postpaid', 'the renamed line is still a postpaid line');
  assert.deepEqual([updates[0].kind, updates[0].idField, post.promotion, post.price], ['installed-assets', 'installedAssetId', 'PROD-104', 350]);
  assert.equal(await apply.applyLineChange({ installedAssetId: 'IA-9004', productId: 'PROD-303' }, update), true);
  assert.equal(eng.mobileLineTypeOfName(updates[1].patch.productServiceName), 'prepaid');
  assert.equal(updates[1].patch.price, 100, 'a prepaid pack is priced at its starter charge, not a rental');
  assert.equal(await apply.applyLineChange({ installedAssetId: 'IA-1', productId: 'PROD-NOPE' }, update), false);
  assert.equal(updates.length, 2, 'an unknown plan writes nothing');
});

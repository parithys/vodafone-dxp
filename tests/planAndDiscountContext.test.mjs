// Plan, add-on and discount offers follow the customer: nationality promotions, plans placed on the right tab, plan-family add-ons, a new customer's
// discounts, and a discount that survives a change of Special Discount type. Over the whole data, in both directions.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let model, elig, benefits;
before(async () => {
  await boot();
  model = await load('/src/components/patterns/postpaidPlanModel.ts');
  elig = await load('/src/engines/addonEligibility.ts');
  benefits = await load('/src/engines/customerBenefitEngine.ts');
});
after(close);

const products = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8'));
const plans = products.filter((p) => p.type === 'Postpaid Plan' && p.listed !== false);
const addons = products.filter((p) => p.type === 'Add-on');
const discounts = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8')).filter((d) => d.category === 'Discount');
const read = (f) => fs.readFileSync(f, 'utf8');

test('nationality promotion plans are offered to their nationality only (and to nobody of unknown nationality); every other plan to everyone', () => {
  const TABLE = { 'PROD-130': 'Indian', 'PROD-136': 'Indian', 'PROD-131': 'Pakistani', 'PROD-137': 'Pakistani', 'PROD-132': 'Filipino', 'PROD-138': 'Filipino', 'PROD-135': 'Bangladeshi', 'PROD-141': 'Bangladeshi' };
  for (const p of plans) {
    for (const nat of ['Indian', 'Pakistani', 'Filipino', 'Bangladeshi', 'Qatari', 'Egyptian', undefined]) {
      const expected = TABLE[p.productId] ? TABLE[p.productId] === nat : true;
      assert.equal(model.isPlanOfferedTo(p, nat), expected, `${p.productId} ${nat}`);
    }
  }
  assert.equal(Object.keys(TABLE).length, plans.filter((p) => p.eligibleNationalities).length, 'no other plan carries a restriction');
  assert.ok(plans.some((p) => !p.eligibleNationalities), 'unrestricted plans exist');
});

test('the Unlimited range sits on the Plans tab (not the pre-bundled Offers tab), so its add-ons and discounts can be reached; Offers plans are not on the Special Offers tab', () => {
  for (const id of ['PROD-110', 'PROD-111', 'PROD-112', 'PROD-113']) {
    const p = plans.find((x) => x.productId === id);
    assert.equal(model.planGroupOf(p), 'for-you', id);
  }
  assert.equal(model.planGroupOf(plans.find((x) => x.productId === 'PROD-107')), 'specials', 'a real offer stays an offer');
  assert.match(read('src/components/patterns/usePostpaidPlanAddons.ts'), /planGroupOf\(plan\) !== 'specials'/);
});

test('plan-family add-ons are offered on that family\'s plans only; the unrestricted add-ons on every plan', () => {
  const FAMILY = { 'PROD-162': 'Essential', 'PROD-163': 'Extra', 'PROD-164': 'Unlimited', 'PROD-211': 'Unlimited', 'PROD-215': 'Unlimited' };
  for (const a of addons) {
    for (const p of plans) {
      const family = FAMILY[a.productId];
      const expected = family ? p.name.includes(family) : true;
      assert.equal(elig.isAddonEligible(a, { planId: p.productId }), expected, `${a.productId} on ${p.productId}`);
    }
  }
});

test('a new customer holds no benefit: Loyalty (an existing-customer discount) is not offered, an accepted Special Discount still is', () => {
  const all = discounts;
  const forNew = benefits.discountsForCustomer(all, [], undefined);
  assert.ok(forNew.every((d) => d.addonType !== 'Loyalty Discount'));
  const withMada = benefits.discountsForCustomer(all, [], 'mada');
  assert.ok(withMada.some((d) => d.addonType === 'MADA Discount') && !withMada.some((d) => d.addonType === 'Loyalty Discount'));
  const existing = benefits.discountsForCustomer(all, ['loyalty'], undefined);
  assert.ok(existing.some((d) => d.addonType === 'Loyalty Discount'), 'an existing customer with the benefit keeps it');
  assert.match(read('src/modules/new-connection/hooks/useNewConnectionJourney.ts'), /session\.draftIsNewCustomer \? \[\] : benefitsOnRecord/);
});

test('changing the Special Discount type retires the old discount, and a discount no longer offered is dropped', () => {
  const step = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(step, /before\.type !== v\.type \|\| Boolean\(before\.rejected\) !== Boolean\(v\.rejected\)\)\)\s*setValue\('discountId', undefined\)/);
  assert.match(read('src/components/patterns/usePostpaidPlanAddons.ts'), /if \(!discounts\.some\(\(d\) => d\.addonDiscountId === discountId\)\) onSelectDiscount\(undefined\)/);
});

test('an accepted offer skips Plan and Addons & Discounts whatever the customer type; a plan chosen on the Offers tab also skips Addons & Discounts; the offer\'s plan is a postpaid plan open to the customer', async () => {
  const ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
  const list = ps.postpaidSteps({ products: [], customerBenefits: [] });
  const plan = list.find((s) => s.key === 'plan'), extras = list.find((s) => s.key === 'planExtras');
  const accepted = { crossSales: { decision: 'accepted' } };
  const doc = { frontScanned: true, backScanned: true };
  for (const [customerType, expectExtrasSkipped] of [
    [undefined, true],
    [{ type: 'none' }, true],
    [{ type: 'mada', rejected: true }, true],
    [{ type: 'mada', officeId: doc, officeAccepted: false }, true],      // chosen but not validated
    [{ type: 'mada', officeId: doc, officeAccepted: true }, true],
    [{ type: 'retired', officeId: doc, officeAccepted: true }, true],
  ]) {
    const v = { ...accepted, customerType };
    assert.equal(Boolean(plan.skip(v)), true, 'the plan is fixed by the offer');
    assert.equal(Boolean(extras.skip(v)), expectExtrasSkipped, JSON.stringify(customerType));
  }
  assert.equal(Boolean(extras.skip({ customerType: { type: 'mada', officeId: doc, officeAccepted: true } })), false, 'no offer: the step runs');
  const hook = read('src/modules/new-connection/hooks/useNewConnectionJourney.ts');
  assert.match(hook, /p\.type === 'Postpaid Plan' && isPlanOfferedTo\(p, session\.draftNationality\)/);
});

test('a plan chosen on the Offers tab of Offers & Plans goes straight to Number Selection; one chosen on Plans keeps Addons & Discounts', async () => {
  const ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
  const extras = ps.postpaidSteps({ products: [], customerBenefits: [] }).find((s) => s.key === 'planExtras');
  assert.equal(Boolean(extras.skip({ selectionSource: 'OFFER', productId: 'PROD-107' })), true);
  assert.equal(Boolean(extras.skip({ selectionSource: 'PLAN', productId: 'PROD-107' })), false);
  assert.equal(Boolean(extras.skip({ productId: 'PROD-107' })), false);
});

test('Offers → Number Selection is a standing rule: every plan on the Offers tab skips Addons & Discounts, decided from the plan itself, over the whole catalogue', async () => {
  const ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
  const pm = await load('/src/components/patterns/postpaidPlanModel.ts');
  const all = products.filter((p) => p.type === 'Postpaid Plan');
  const extras = ps.postpaidSteps({ products: all, customerBenefits: [] }).find((s) => s.key === 'planExtras');
  const offers = all.filter((p) => pm.planGroupOf(p) === 'specials');
  assert.ok(offers.length > 0);
  for (const p of all) {
    // no selectionSource value in the draft (a resumed draft, or before the Plan step has written it): the plan alone decides
    assert.equal(Boolean(extras.skip({ productId: p.productId })), pm.isOffersTabPlan(p), p.productId);
  }
  for (const p of offers) {
    for (const customerType of [undefined, { type: 'retired', officeAccepted: true, officeId: { frontScanned: true, backScanned: true } }]) {
      assert.equal(Boolean(extras.skip({ productId: p.productId, customerType })), true, `${p.productId} ${customerType?.type}`);
    }
  }
  // the plans that are not on the Offers tab keep the step
  for (const p of all.filter((p) => pm.planGroupOf(p) !== 'specials' && !p.preBundledOffer)) assert.equal(Boolean(extras.skip({ productId: p.productId, selectionSource: 'PLAN' })), false, p.productId);
});

test('a plan chosen under Special Offers keeps the Addons & Discounts step; the tab is still recorded when the plan is chosen and reset with the product', async () => {
  const ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
  const extras = ps.postpaidSteps({ products: [], customerBenefits: [] }).find((s) => s.key === 'planExtras');
  assert.equal(Boolean(extras.skip({ productId: 'PROD-131', planTab: 'special' })), false, 'Special Offers plans get Addons & Discounts');
  assert.equal(Boolean(extras.skip({ productId: 'PROD-131', planTab: 'for-you' })), false, 'the same plan chosen under Standard Plans keeps the step');
  assert.equal(Boolean(extras.skip({ planTab: 'special' })), false, 'no plan chosen: nothing to skip');
  assert.match(read('src/components/patterns/PostpaidPlanAddonsStep.tsx'), /onPlanTabChange\?\.\(activeTab\)/);
  assert.match(read('src/capabilities/PlanSelection/postpaidStep.tsx'), /setValue\('planTab', tab\)/);
  assert.ok((await load('/src/modules/new-connection/products.ts')).PRODUCT_OWNED_KEYS.includes('planTab'));
});

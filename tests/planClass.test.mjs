// planClass: every postpaid plan is a Postpaid Voice, Broadband or Family Plan, by its primary focus, stored on the plan - never derived from the presence of minutes or data.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
before(boot);
after(close);

const plans = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8')).filter((p) => p.type === 'Postpaid Plan');
// Written out independently of the code: which plans lead with data (Broadband) - the rest lead with calling or sit on the lower data tiers (Voice).
const BROADBAND = ['PROD-104', 'PROD-105', 'PROD-106', 'PROD-111', 'PROD-140'];
// The Family Plans added 2026-10-27 for the Special Offers tab.
const FAMILY = ['PROD-142', 'PROD-143', 'PROD-144', 'PROD-145'];

test('every postpaid plan carries exactly one of the three classes, and the assignment is the documented one', () => {
  assert.equal(plans.length, 30);
  for (const p of plans) {
    assert.ok(['Postpaid Voice Plans', 'Postpaid Broadband Plans', 'Postpaid Family Plans'].includes(p.planClass), p.productId);
    assert.equal(p.planClass === 'Postpaid Broadband Plans', BROADBAND.includes(p.productId), p.productId);
    assert.equal(p.planClass === 'Postpaid Family Plans', FAMILY.includes(p.productId), p.productId);
  }
  assert.equal(plans.filter((p) => p.planClass === 'Postpaid Family Plans').length, FAMILY.length);
  assert.equal(plans.filter((p) => p.planClass === 'Postpaid Broadband Plans').length, BROADBAND.length);
  assert.ok(plans.some((p) => p._planClassNote), 'the rule is written down with the data');
});

test('the card shows the plan\'s class as its tag, in its own colour; a plan with no class keeps the plain Postpaid tag (the short Offers-tab card leaves it out)', async () => {
  const tags = await load('/src/lib/serviceTypeTag.ts');
  const model = await load('/src/components/patterns/postpaidPlanModel.ts');
  assert.equal(tags.SERVICE_TYPE_TAGS[model.PLAN_CLASS_TAG['Postpaid Voice Plans']].label, 'Voice Plan');
  assert.equal(tags.SERVICE_TYPE_TAGS[model.PLAN_CLASS_TAG['Postpaid Broadband Plans']].label, 'Broadband Plan');
  assert.equal(tags.SERVICE_TYPE_TAGS[model.PLAN_CLASS_TAG['Postpaid Family Plans']].label, 'Family Plan');
  const colours = ['postpaid-voice', 'postpaid-broadband', 'postpaid-family'].map((k) => tags.SERVICE_TYPE_TAGS[k].colour);
  assert.equal(new Set(colours).size, 3, 'each class has its own colour');
  assert.equal(model.isPlanClass('Postpaid Voice Plans'), true);
  assert.equal(model.isPlanClass('Postpaid'), false);
  assert.equal(model.isPlanClass(undefined), false);
  assert.match(fs.readFileSync('src/components/patterns/PostpaidPlanCard.tsx', 'utf8'), /isPlanClass\(p\.planClass\) \? <ServiceTypeTag type=\{PLAN_CLASS_TAG\[p\.planClass\]\} \/> : <ConnectionTypeTag category="Postpaid" \/>/);
  assert.match(fs.readFileSync('src/components/patterns/PlanGroupPanel.tsx', 'utf8'), /compact=\{activeTab === 'specials'\}/, 'only the Offers tab gets the short card');
});

test('every Family Plan carries each Special Discount type, so it shows on the Special Offers tab whichever the customer holds; none is on the Offers tab', async () => {
  const discounts = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8'));
  const model = await load('/src/components/patterns/postpaidPlanModel.ts');
  for (const id of FAMILY) {
    for (const type of ['MADA Discount', 'B2B2C Discount', 'Retired Discount']) {
      assert.equal(discounts.filter((d) => d.planId === id && d.addonType === type).length, 1, `${id} ${type}`);
    }
    assert.notEqual(model.planGroupOf(plans.find((p) => p.productId === id)), 'specials', id);
  }
});

test('the Offers tab lists exactly six offers for the demo: the catalogue holds six Offers-group plans, and the tab never shows more than the limit', async () => {
  const model = await load('/src/components/patterns/postpaidPlanModel.ts');
  const listed = plans.filter((p) => p.listed !== false && model.planGroupOf(p) === 'specials');
  assert.equal(model.OFFERS_TAB_LIMIT, 6);
  assert.equal(listed.length, 6);
  assert.ok(listed.every((p) => p.planClass && !p.eligibleNationalities), 'open to every customer, so six are always on offer');
  assert.match(fs.readFileSync('src/components/patterns/usePostpaidPlanAddons.ts', 'utf8'), /key === 'specials' \? list\.slice\(0, OFFERS_TAB_LIMIT\)/);
});

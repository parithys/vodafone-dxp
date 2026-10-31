// The "Addons & Discounts" page: renamed once (a shared step label), no repeated "Add-ons (optional)" heading, and Eligible Discounts always has one
// selection - "No Discount" by default, the Special Discount once a validated Consumer B2B2C / Retiree / MADA applies.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let model, labels;
before(async () => {
  await boot();
  model = await load('/src/components/patterns/postpaidPlanModel.ts');
  labels = await load('/src/data/stepLabels.ts');
});
after(close);

const discounts = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8')).filter((d) => d.category === 'Discount');
const TYPE_OF = { mada: 'MADA Discount', b2b2c: 'B2B2C Discount', retired: 'Retired Discount' };

test('the page is named "Addons" from one shared label, in the postpaid and prepaid extras steps', () => {
  assert.equal(labels.ADDONS_DISCOUNTS_LABEL, 'Addons');
  for (const f of ['src/capabilities/PlanSelection/postpaidStep.tsx', 'src/capabilities/PlanSelection/step.tsx']) {
    assert.match(fs.readFileSync(f, 'utf8'), /label: ADDONS_DISCOUNTS_LABEL/, f);
  }
});

test('the Add-ons page no longer carries its own "Add-ons (optional)" heading above the category tabs', () => {
  const src = fs.readFileSync('src/components/patterns/PostpaidPlanAddonsStep.tsx', 'utf8');
  assert.doesNotMatch(src, /Add-ons <span[^>]*>\(optional\)/);
});

test('the Special Discount to preselect is the plan\'s discount of the held type, over every plan; none for Standard or no benefit (both directions)', () => {
  const byPlan = new Map();
  for (const d of discounts) byPlan.set(d.planId, [...(byPlan.get(d.planId) ?? []), d]);
  assert.ok(byPlan.size > 5);
  for (const [plan, ds] of byPlan) {
    for (const [benefit, type] of Object.entries(TYPE_OF)) {
      const got = model.specialDiscountToPreselect(ds, benefit);
      const expected = ds.find((d) => d.addonType === type);
      assert.equal(got?.addonDiscountId, expected?.addonDiscountId, `${plan} ${benefit}`);
      if (got) assert.equal(got.addonType, type, 'never another special type, never Loyalty');
    }
    assert.equal(model.specialDiscountToPreselect(ds, 'none'), undefined, plan);
    assert.equal(model.specialDiscountToPreselect(ds, undefined), undefined, plan);
  }
});

test('Eligible Discounts always has one selection: No Discount when none is chosen, and choosing the selected card changes nothing', () => {
  const panel = fs.readFileSync('src/components/patterns/PostpaidDiscountsPanel.tsx', 'utf8');
  assert.match(panel, /selected=\{!discountId\}/);                                        // No Discount is selected whenever no discount is
  assert.match(panel, /onToggle=\{\(\) => onSelectDiscount\(undefined\)\}/);                // ... and is a choice
  assert.match(panel, /onToggle=\{\(\) => onSelectDiscount\(d\.addonDiscountId\)\}/);       // a discount card selects it; it never clears itself
  assert.doesNotMatch(panel, /discountId === d\.addonDiscountId \? undefined/);
  const hook = fs.readFileSync('src/components/patterns/usePostpaidPlanAddons.ts', 'utf8');
  assert.match(hook, /specialDiscountToPreselect\(discounts\.filter\(\(d\) => d\.planId === selectedProductId\), customerBenefit\)/);           // the Special Discount selects itself
});

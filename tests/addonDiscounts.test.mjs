import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

after(close);

// Apply Discount on the postpaid Add-ons page: a discount record names the add-ons it is eligible on; a free add-on is never discounted; the charge is reduced by the percentage.
const discounts = JSON.parse(fs.readFileSync('public/mock-data/addon-discounts.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8'));
const addons = products.filter((p) => p.type === 'Add-on');

test('every add-on discount names add-ons that exist, a percentage in (0, 100) and no supporting document', () => {
  const ids = new Set(addons.map((a) => a.productId));
  assert.ok(discounts.length > 0);
  for (const d of discounts) {
    assert.ok(d.appliesToAddons.length > 0, d.addonDiscountId);
    for (const id of d.appliesToAddons) assert.ok(ids.has(id), `${d.addonDiscountId} names ${id}, which is not an add-on`);
    assert.ok(d.percent > 0 && d.percent < 100, d.addonDiscountId);
    assert.ok(!('document' in d) && !('requiresDocument' in d), 'no supporting document is asked for');
  }
});

test('an add-on is eligible only for the discounts that name it, and a free add-on for none', async () => {
  const { discountsForAddon } = await load('/src/engines/addonDiscounts.ts');
  const { isFreeAddon } = await load('/src/engines/addonCategories.ts');
  // Whole-population invariants over every add-on, against what the records say (not against what the function selected).
  for (const a of addons) {
    const got = discountsForAddon(discounts, a).map((d) => d.addonDiscountId).sort();
    const expected = isFreeAddon(a) ? [] : discounts.filter((d) => d.appliesToAddons.includes(a.productId)).map((d) => d.addonDiscountId).sort();
    assert.deepEqual(got, expected, a.productId);
  }
  // The mixed cases: a paid add-on with two discounts, one with none, and a free add-on that a record names.
  assert.equal(discountsForAddon(discounts, addons.find((a) => a.productId === 'PROD-160')).length, 2);
  assert.equal(discountsForAddon(discounts, addons.find((a) => a.productId === 'PROD-162')).length, 0);
  const free = addons.find((a) => a.productId === 'PROD-210');
  assert.equal(discountsForAddon([{ ...discounts[0], appliesToAddons: ['PROD-210'] }], free).length, 0, 'a free add-on is never discounted');
});

test('the discounted charge is the percentage off, on every billing option too; nothing applied leaves the add-on unchanged', async () => {
  const { discountedAddon, appliedDiscountFor } = await load('/src/engines/addonDiscounts.ts');
  const a = addons.find((x) => x.productId === 'PROD-250'); // 2 GB data every week, with Monthly and Weekly options
  assert.ok(a.billingOptions?.length > 1);
  const off = discountedAddon(a, { percent: 20 });
  assert.equal(off.mrcQAR, Math.round(a.mrcQAR * 0.8 * 100) / 100);
  a.billingOptions.forEach((o, i) => assert.equal(off.billingOptions[i].priceQAR, Math.round(o.priceQAR * 0.8 * 100) / 100));
  assert.equal(discountedAddon(a, undefined), a);
  // A stale choice (the discount no longer names the add-on) is not applied.
  assert.equal(appliedDiscountFor(discounts, { 'PROD-162': 'ADD-DSC-001' }, addons.find((x) => x.productId === 'PROD-162')), undefined);
  assert.equal(appliedDiscountFor(discounts, { 'PROD-160': 'ADD-DSC-001' }, addons.find((x) => x.productId === 'PROD-160'))?.percent, 10);
});

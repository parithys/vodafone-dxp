// The plan step offers only the Special Discount chosen at Customer Verification (never all three), the other discounts are untouched, and a
// customer holds one discount at a time. Expectations come from a table of what each discount type IS, checked over the whole discounts dataset.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let model;
before(async () => { await boot(); model = await load('/src/components/patterns/postpaidPlanModel.ts'); });
after(close);

const all = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8')).filter((d) => d.category === 'Discount');
// What each discount type in the data IS (independent of the model's own set): special = held through Customer Verification.
const SPECIAL = new Set(['MADA Discount', 'B2B2C Discount', 'Retired Discount']);
const CHOICE = { mada: 'MADA Discount', b2b2c: 'B2B2C Discount', retired: 'Retired Discount' };

test('every discount type in the data is classified, and the model agrees on which are special', () => {
  assert.ok(all.length > 3);
  assert.deepEqual([...model.SPECIAL_DISCOUNT_ADDON_TYPES].sort(), [...SPECIAL].sort());
  assert.ok([...SPECIAL].every((t) => all.some((d) => d.addonType === t)), 'each special type exists in the data');
});

test('a chosen special type keeps only itself among the special three, leaves the rest alone, and loses nothing else (conservation)', () => {
  for (const [key, type] of Object.entries(CHOICE)) {
    const out = model.discountsForSpecialType(all, key);
    assert.ok(out.length > 0);
    assert.deepEqual([...new Set(out.filter((d) => SPECIAL.has(d.addonType)).map((d) => d.addonType))].sort(), [type]);
    const others = all.filter((d) => !SPECIAL.has(d.addonType));
    assert.deepEqual(out.filter((d) => !SPECIAL.has(d.addonType)), others, 'non-special discounts are unchanged');
    const dropped = all.filter((d) => !out.includes(d));
    assert.ok(dropped.every((d) => SPECIAL.has(d.addonType) && d.addonType !== type), 'only other special types are removed');
    assert.equal(out.length + dropped.length, all.length);
  }
});

test('a Standard customer (none chosen, or the benefit rejected) is offered none of the three Special Discounts - and keeps every other discount', () => {
  const out = model.discountsForSpecialType(all, 'none');
  assert.ok(out.every((d) => !SPECIAL.has(d.addonType)), 'no Special Discount card without a validated benefit behind it');
  assert.deepEqual(out, all.filter((d) => !SPECIAL.has(d.addonType)));
  assert.ok(out.some((d) => d.addonType === 'Loyalty Discount'));
  assert.equal(out.length + all.filter((d) => SPECIAL.has(d.addonType)).length, all.length, 'conservation');
  // The plan step tells Standard apart from "this journey has no such choice".
  const step = fs.readFileSync('src/capabilities/PlanSelection/postpaidStep.tsx', 'utf8');
  assert.match(step, /\(v \? \(v\.type && v\.type !== 'none' && !v\.rejected && isCustomerTypeValid\(v\) \? v\.type : 'none'\) : undefined\)/);
});

test('nothing chosen / unknown: the list is returned as it is', () => {
  assert.equal(model.discountsForSpecialType(all, undefined), all);
});

test('plan step: the special card is titled "Special Discount" and the hook applies the choice', () => {
  assert.equal(model.SPECIAL_DISCOUNT_CARD_TITLE, 'Special Discount 25%');
  assert.match(fs.readFileSync('src/components/patterns/PostpaidDiscountsPanel.tsx', 'utf8'), /SPECIAL_DISCOUNT_ADDON_TYPES\.has\(d\.addonType\) \? SPECIAL_DISCOUNT_CARD_TITLE/);
  assert.match(fs.readFileSync('src/components/patterns/usePostpaidPlanAddons.ts', 'utf8'), /discountsForSpecialType\(discountsForCustomer\(/);
});

test('rule: every Special Discount (MADA, B2B2C, Retired) is a higher discount than every Loyalty Discount, on every plan', () => {
  const all = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8')).filter((d) => d.category === 'Discount');
  const rate = (d) => Math.abs(d.price);
  const special = all.filter((d) => SPECIAL.has(d.addonType));
  const loyalty = all.filter((d) => d.addonType === 'Loyalty Discount');
  assert.ok(special.length > 0 && loyalty.length > 0);
  const lowestSpecial = Math.min(...special.map(rate));
  const highestLoyalty = Math.max(...loyalty.map(rate));
  assert.ok(lowestSpecial > highestLoyalty, `lowest Special ${lowestSpecial} must exceed highest Loyalty ${highestLoyalty}`);
  // On any one plan the customer is offered both, the special one is the better of the two.
  const byPlan = new Map();
  for (const d of all) byPlan.set(d.planId, [...(byPlan.get(d.planId) ?? []), d]);
  for (const [plan, ds] of byPlan) {
    const s = ds.filter((d) => SPECIAL.has(d.addonType)).map(rate);
    const l = ds.filter((d) => d.addonType === 'Loyalty Discount').map(rate);
    if (s.length && l.length) assert.ok(Math.min(...s) > Math.max(...l), plan);
  }
});

test('rule: every Special Discount row (MADA, B2B2C, Retired), on every plan, is the one fixed rate the card title states', () => {
  const rows = all.filter((d) => SPECIAL.has(d.addonType));
  assert.ok(rows.length > 0);
  assert.equal(model.SPECIAL_DISCOUNT_RATE, 0.25);
  for (const type of SPECIAL) assert.ok(rows.some((d) => d.addonType === type), `${type} has rows`);
  assert.deepEqual(rows.filter((d) => Math.abs(d.price) !== model.SPECIAL_DISCOUNT_RATE).map((d) => d.addonDiscountId), []);
  assert.equal(model.SPECIAL_DISCOUNT_CARD_TITLE, `Special Discount ${model.SPECIAL_DISCOUNT_RATE * 100}%`);
});

test('discounts are listed from low to high, whatever order the catalogue gives them, and none is lost', () => {
  const rows = all.filter((d) => d.planId === all.find((x) => SPECIAL.has(x.addonType)).planId);
  const shuffled = [...rows].reverse();
  const out = model.discountsAscending(shuffled);
  assert.equal(out.length, shuffled.length, 'conservation');
  for (let i = 1; i < out.length; i++) assert.ok(Math.abs(out[i - 1].price) <= Math.abs(out[i].price));
  assert.deepEqual(model.discountsAscending([]), []);
});

test('a discount card names how long the discount runs, except a Special Discount; a missing duration adds nothing', () => {
  assert.equal(model.discountDescription({ addonType: 'Promotional Discount', description: '10% off the monthly plan fee', durationMonths: 6 }), '10% off the monthly plan fee for 6 months');
  assert.equal(model.discountDescription({ addonType: 'Promotional Discount', description: 'x', durationMonths: 1 }), 'x for 1 month');
  assert.equal(model.discountDescription({ addonType: 'Promotional Discount', description: 'x', durationMonths: null }), 'x');
  assert.equal(model.discountDescription({ addonType: 'Promotional Discount', description: 'x' }), 'x');
  for (const d of all) {
    const text = model.discountDescription(d);
    if (SPECIAL.has(d.addonType)) assert.equal(text, d.description, `${d.addonDiscountId}: Special Discount carries no duration`);
    else if (d.durationMonths) assert.ok(text.includes(`${d.durationMonths} month`), d.addonDiscountId);
    else assert.equal(text, d.description);
  }
  // the 10% and 15% discounts carry a duration in the catalogue
  assert.ok(all.filter((d) => /^(10|15)% Discount$/.test(d.name)).every((d) => d.durationMonths > 0));
});

test('the mid-priced plan is the median by price, deterministic on ties, and undefined for none', () => {
  const p = (id, mrcQAR) => ({ productId: id, mrcQAR });
  assert.equal(model.midPricedPlan([]), undefined);
  assert.equal(model.midPricedPlan([p('A', 100)]).productId, 'A');
  assert.equal(model.midPricedPlan([p('C', 300), p('A', 100), p('B', 200)]).productId, 'B', 'odd count: the middle');
  assert.equal(model.midPricedPlan([p('D', 400), p('A', 100), p('B', 200), p('C', 300)]).productId, 'B', 'even count: the lower middle');
  assert.equal(model.midPricedPlan([p('B', 115), p('A', 115), p('C', 115)]).productId, 'B', 'equal prices: by product id');
  const input = [p('C', 300), p('A', 100), p('B', 200)];
  model.midPricedPlan(input);
  assert.deepEqual(input.map((x) => x.productId), ['C', 'A', 'B'], 'the list is not reordered');
});

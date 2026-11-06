// Plan search (Standard Plans, Special Offers, Offers): every word typed must appear somewhere in what the plan shows - not only its name.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => { await boot(); m = await load('/src/components/patterns/postpaidPlanModel.ts'); });
after(close);

const plans = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8')).filter((p) => p.type === 'Postpaid Plan' && p.listed !== false); // the plans the app lists and searches (the extra-line plans are chosen only when a line is added to a package)
const find = (q) => plans.filter((p) => m.planMatchesSearch(p, q)).map((p) => p.productId);

test('an empty search matches every plan; a plan is always found by its own name', () => {
  assert.equal(plans.filter((p) => m.planMatchesSearch(p, '')).length, plans.length);
  assert.equal(plans.filter((p) => m.planMatchesSearch(p, '   ')).length, plans.length);
  for (const p of plans) assert.ok(m.planMatchesSearch(p, p.name), p.productId);
});

test('benefits and allowances are searched, not only the name (independent expectation from each record)', () => {
  // Every plan that lists a feature on its card is found by a distinctive word from it, and by that whole line.
  for (const p of plans.filter((x) => x.features?.length)) {
    for (const f of p.features) assert.ok(m.planMatchesSearch(p, f), `${p.productId}: "${f}"`);
  }
  for (const p of plans.filter((x) => x.benefits?.length)) {
    for (const b of p.benefits) assert.ok(m.planMatchesSearch(p, b), `${p.productId}: "${b}"`);
  }
  // The data allowance: a plan with a stated allowance is found by it.
  for (const p of plans.filter((x) => x.dataAllowanceGB)) assert.ok(m.planMatchesSearch(p, `${p.dataAllowanceGB} GB data`), p.productId);
});

test('price: the raw figure matches anywhere in it; a promotional plan is found by its original price too', () => {
  for (const p of plans) assert.ok(find(String(p.mrcQAR)).includes(p.productId), `${p.productId} by ${p.mrcQAR}`);
  const promo = plans.filter((p) => p.originalMrcQAR !== undefined);
  assert.ok(promo.length > 0);
  for (const p of promo) assert.ok(find(`QAR ${p.originalMrcQAR}`).includes(p.productId), `${p.productId} by original price`);
});

test('plan type and Multi-SIM are searchable; every word must match (AND), none is ignored', () => {
  const byClass = (label) => plans.filter((p) => p.planClass === label).map((p) => p.productId).sort();
  assert.deepEqual(find('broadband plan').sort(), byClass('Postpaid Broadband Plans'));
  assert.deepEqual(find('family plan').sort(), byClass('Postpaid Family Plans'));
  assert.deepEqual(find('multi-sim').sort(), plans.filter((p) => p.multiSimCount > 0).map((p) => p.productId).sort());
  assert.deepEqual(find('2 multi-sims included').sort(), plans.filter((p) => p.multiSimCount === 2).map((p) => p.productId).sort());
  assert.deepEqual(find('broadband zzzz-nothing'), [], 'a word nothing shows excludes every plan');
  assert.ok(find('pakistan').length > 0);
  assert.ok(find('promotion pakistan').length <= find('pakistan').length, 'more words never widen a search');
});

test('the type-ahead lists matches by name first, then by other details; with no match it still offers the closest names', () => {
  const tab = plans.filter((p) => p.commitmentMonths && !p.popular && !p.offer);
  const s = m.searchPlans('unlimited local minutes', tab);
  assert.ok(s.length > 0 && s.length <= 5);
  for (const p of s) assert.ok(m.planMatchesSearch(p, 'unlimited local minutes'));
  const byName = m.searchPlans('pakistan', tab);
  assert.ok(byName[0].name.toLowerCase().includes('pakistan'), 'a name hit ranks above an attribute hit');
  assert.ok(m.searchPlans('Postpaid Re 550', tab).length > 0, 'a mistyped name still finds its neighbour');
  assert.deepEqual(m.searchPlans('', tab), []);
});

test('the search is the same on every tab: the list filter and the type-ahead both use it', () => {
  const hook = fs.readFileSync('src/components/patterns/usePostpaidPlans.ts', 'utf8');
  assert.match(hook, /return planMatchesSearch\(p, planSearch\);/);
  assert.match(hook, /searchPlans\(planSearch, tabPlans\)/);
  // tabPlans is the active tab's plans, so Standard Plans, Special Offers and Offers all search their own.
  assert.match(hook, /activeTab === 'special' \? specialPlanIds\.has\(p\.productId\) : planGroupOf\(p\) === activeTab/);
});

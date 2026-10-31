// Defects found auditing the demo journeys: each is pinned here so it cannot return.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
const read = (p) => fs.readFileSync(p, 'utf8');
before(boot);
after(close);

test('a customer the agent created is judged on what they entered on every page that judges eligibility, not only Customer Verification', async () => {
  const { newIdentityOf } = await load('/src/capabilities/EligibilityGate/newIdentity.ts');
  const created = { idNumber: '28677712345601', idType: 'QID', moiResult: { createdByAgent: true, isNewCustomer: true, nationality: 'Saudi', dob: '1992-09-03', expiryDate: '2033-10-31' } };
  assert.deepEqual(newIdentityOf(created), { idNumber: '28677712345601', idType: 'QID', nationality: 'Saudi', dob: '1992-09-03', expiryDate: '2033-10-31' });
  assert.equal(newIdentityOf({ ...created, moiResult: { ...created.moiResult, createdByAgent: false } }), undefined, 'a registry customer is looked up, not taken from the form');
  assert.equal(newIdentityOf({ idNumber: '1' }), undefined);
  assert.equal(newIdentityOf(undefined), undefined);
  assert.match(read('src/modules/new-connection/steps/ProductEligibility.tsx'), /newIdentity=\{newIdentityOf\(contact\)\}/, 'Product Selection and the MNP plan type');
  assert.match(read('src/capabilities/CustomerQualification/step.tsx'), /newIdentity=\{newIdentityOf\(contact\)\}/, 'Customer Verification');
});

test('the journey header names the kind of ID, not "QID" for a passport', () => {
  const badge = read('src/capabilities/JourneyCustomerLock/JourneyCustomerBadge.tsx');
  assert.doesNotMatch(badge, /- QID \{/);
  assert.match(badge, /active\.idType/);
  assert.match(read('src/capabilities/JourneyCustomerLock/useJourneyCustomerLock.ts'), /idType: draftContact\.idType/);
});

test('the Checkout customer name is the name, not first, middle and last joined by commas', () => {
  assert.doesNotMatch(read('src/capabilities/CheckoutSummary/step.tsx'), /lastName\]\.filter\(Boolean\)\.join\(', '\)/);
});

test('no available journey opens a detail screen that needs a record id (it would land on "could not find this record")', async () => {
  const cat = await load('/src/navigation/journeyCatalogue.ts');
  const routes = JSON.parse(read('public/config/routes.json'));
  const byScreen = new Map((Array.isArray(routes) ? routes : routes.routes).map((r) => [r.screenId, r]));
  const bare = [];
  for (const line of cat.PRODUCT_LINES ?? Object.values(cat).find(Array.isArray) ?? []) {
    for (const category of line.categories ?? []) {
      for (const j of category.journeys ?? []) {
        if (j.status !== 'available' || !j.screenId) continue;
        const r = byScreen.get(j.screenId);
        if (r && /^ticket detail screen/i.test(r.screenName)) bare.push(`${j.id} -> ${r.screenName}`);
      }
    }
  }
  assert.deepEqual(bare, []);
});

test('the Salutation options come from public/config/lookup-lists.json, in its order, not from code', async () => {
  const cfg = JSON.parse(read('public/config/lookup-lists.json'));
  assert.deepEqual(cfg.salutations, ['Mr', 'Mrs', 'Ms', 'Sheikh', 'Sheikha']);
  assert.ok(!fs.existsSync('src/data/salutations.ts'), 'no hardcoded list');
  const step = read('src/components/patterns/GuidedContactStep.tsx');
  assert.match(step, /getLookupList\('salutations'\)/);
  assert.doesNotMatch(step, /'Sheikha'|'Miss'/);
  const engine = await load('/src/engines/configEngine.ts');
  await engine.loadConfig();
  assert.deepEqual(engine.getLookupList('salutations'), cfg.salutations);
  assert.deepEqual(engine.getLookupList('nope'), []);
});

test('SIM Type and ICCID are shown on SIM Selection for a Physical SIM and an eSIM, and carried to Checkout', () => {
  const sim = read('src/components/domain/SimTypeStep.tsx');
  assert.match(sim, /<dt className="text-fg">SIM Type<\/dt>\s*<dd className="text-fg font-medium">eSIM<\/dd>/);
  // The SIM's identifier is called SIM Serial Number: an eSIM's row carries its ICCID under that name, and a Physical SIM's card lists it once (no second ICCID row).
  assert.match(sim, /<dt className="text-fg">SIM Serial Number<\/dt>\s*<dd className="text-fg font-medium">\{value\.simIccid/);
  assert.doesNotMatch(read('src/components/domain/SimSerialScanner.tsx'), /<dt className="text-fg">ICCID<\/dt>/, 'a Physical SIM');
  assert.doesNotMatch(read('src/capabilities/SimType/step.tsx'), /autoAdvanceWhen: \(values\) => \{\s*const s = values\.simType/, 'the page stays so the details can be read');
  for (const f of ['checkoutSummaryRows', 'checkoutDetailedTables']) {
    const src = read(`src/components/patterns/${f}.ts`);
    // The detailed Order Summary no longer lists the SIM Type (the SIM page shows it); the standard summary rows still do.
    if (f === 'checkoutSummaryRows') assert.match(src, /label: 'SIM Type'/, f);
    else assert.doesNotMatch(src, /label: 'SIM Type'/, f);
    assert.doesNotMatch(src, /label: 'ICCID'/, `${f}: the checkout summary no longer lists the ICCID`);
  }
  assert.match(read('src/capabilities/SimType/summary.ts'), /label: 'ICCID'/);
});

test('the plan-type filter: All Plans, Voice Plan, Broadband Plan, Family Plan - conservation over the whole catalogue, reset on each tab', async () => {
  const m = await load('/src/components/patterns/postpaidPlanModel.ts');
  assert.deepEqual(m.PLAN_TYPE_FILTERS.map((f) => f.label), ['All Plans', 'Voice Plan', 'Broadband Plan', 'Family Plan']);
  const products = JSON.parse(read('public/mock-data/products.json'));
  const plans = products.filter((p) => p.type === 'Postpaid Plan' && p.listed !== false);
  const voice = plans.filter((p) => m.matchesPlanType(p, 'Postpaid Voice Plans'));
  const broadband = plans.filter((p) => m.matchesPlanType(p, 'Postpaid Broadband Plans'));
  assert.equal(plans.filter((p) => m.matchesPlanType(p, 'all')).length, plans.length);
  const family = plans.filter((p) => m.matchesPlanType(p, 'Postpaid Family Plans'));
  assert.equal(voice.length + broadband.length + family.length, plans.filter((p) => p.planClass).length, 'a class-less plan is under All Plans only; no plan is in two classes');
  assert.ok(voice.length > 0 && broadband.length > 0 && family.length > 0);
  assert.equal(m.matchesPlanType({}, 'Postpaid Voice Plans'), false, 'unknown stays unknown');
  const hook = read('src/components/patterns/usePostpaidPlanAddons.ts');
  assert.match(hook, /setActiveTabState\(tab\);\s*setPlanTypeFilter\('all'\)/, 'each tab starts at All Plans');
  assert.match(hook, /matchesPlanType\(p, planTypeFilter\)/);
  assert.match(read('src/components/patterns/PostpaidPlanAddonsStep.tsx'), /<Select\s+aria-label="Plan Type"\s+options=\{PLAN_TYPE_FILTERS/);
});

test('every selectable card in the app marks its selected state with the shared corner tick, and has no Select button of its own', () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
  const files = walk('src').filter((f) => /\.tsx$/.test(f));
  // Files that use the selected-card surface for something that is not a choice: the restated plan summary (offerCardParts) and the capability previews.
  const exempt = new Set(['src/components/primitives/offerCardParts.tsx']);
  const missing = files.filter((f) => !exempt.has(f)).filter((f) => /CARD_SELECTED/.test(read(f)) && !/<SelectedTick \/>/.test(read(f)));
  assert.deepEqual(missing, []);
  // The old per-card marks are gone: no small top-right check, no ring-at-rest mark.
  for (const f of files) assert.doesNotMatch(read(f), /absolute top-2 right-2 w-4 h-4/, f);
  for (const f of ['PostpaidPlanCard']) assert.doesNotMatch(read(`src/components/patterns/${f}.tsx`), /Select plan|'Selected'/);
});

test('the tooltip reads its pixel tokens with a numeric fallback, so an expression-valued token never leaves it without a position', () => {
  const t = read('src/components/primitives/Tooltip.tsx');
  assert.match(t, /function pxToken/);
  assert.doesNotMatch(t, /parseInt\(getComputedStyle\(document\.documentElement\)\.getPropertyValue\('--tooltip-(offset|max-width)'\)/);
});

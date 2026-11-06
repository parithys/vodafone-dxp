// The Add-ons & Discounts page: category tabs (Local Data, Local Minutes, International, Roaming, Combo, Others) and a Free / Paid filter that applies
// to the category selected. The expected catalogue is the business workbook Addons.xlsx, written out by hand below (name, category, pricing, QAR price),
// and checked against every add-on in products.json in both directions (nothing missing, nothing extra, nothing in the wrong category).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => { await boot(); m = await load('/src/engines/addonCategories.ts'); });
after(close);

const allAddons = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8')).filter((p) => p.type === 'Add-on');
// The workbook's add-ons. The demo add-ons that show the other billing frequencies (weekly, one-time) state `billingFrequency` and are checked on their own below.
const addons = allAddons.filter((p) => !p.billingFrequency);

// From Addons.xlsx: productId -> [name, category, pricing, QAR price (0 where the workbook gives no fixed QR amount)].
const WORKBOOK = {
  'PROD-160': ["Data Booster", 'Local Data', 'paid', 20],
  'PROD-161': ["Data Booster", 'Local Data', 'paid', 50],
  'PROD-162': ["Data Add-on", 'Local Data', 'paid', 20],
  'PROD-163': ["Data Add-on", 'Local Data', 'paid', 20],
  'PROD-164': ["Data Add-on", 'Local Data', 'paid', 20],
  'PROD-165': ["5G Data Booster", 'Local Data', 'paid', 10],
  'PROD-166': ["5G Data Booster", 'Local Data', 'paid', 100],
  'PROD-167': ["Local Booster", 'Local Minutes', 'paid', 20],
  'PROD-168': ["Local Add-on Essential", 'Local Minutes', 'paid', 20],
  'PROD-169': ["Local Add-on Extra", 'Local Minutes', 'paid', 20],
  'PROD-170': ["Local Minutes Plus", 'Local Minutes', 'paid', 0],
  'PROD-171': ["International Booster", 'International', 'paid', 20],
  'PROD-172': ["India Booster", 'International', 'paid', 20],
  'PROD-173': ["Pakistan Booster", 'International', 'paid', 20],
  'PROD-174': ["Philippines Booster", 'International', 'paid', 20],
  'PROD-175': ["Bangladesh Booster", 'International', 'paid', 20],
  'PROD-176': ["Egypt Add-on", 'International', 'paid', 0],
  'PROD-177': ["Sri Lanka Add-on", 'International', 'paid', 0],
  'PROD-178': ["Daily Passport Pack", 'Roaming', 'paid', 35],
  'PROD-179': ["Weekly Passport Pack", 'Roaming', 'paid', 100],
  'PROD-180': ["Monthly Passport Pack", 'Roaming', 'paid', 320],
  'PROD-181': ["GCC Roaming Pack", 'Roaming', 'paid', 150],
  'PROD-182': ["Roam Like Home Daily", 'Roaming', 'paid', 50],
  'PROD-183': ["Roam Like Home Weekly", 'Roaming', 'paid', 150],
  'PROD-184': ["Data and Local Combo", 'Combo', 'paid', 0],
  'PROD-185': ["Data and International Combo", 'Combo', 'paid', 0],
  'PROD-186': ["Sri Lanka Combo", 'Combo', 'paid', 10],
  'PROD-187': ["Sri Lanka Combo Plus", 'Combo', 'paid', 20],
  'PROD-188': ["Combo Plus Booster", 'Combo', 'paid', 0],
  'PROD-189': ["Vodafone World QR 30", 'Others', 'paid', 0],
  'PROD-190': ["Vodafone World QR 50", 'Others', 'paid', 0],
  'PROD-191': ["Vodafone World QR 100", 'Others', 'paid', 0],
  'PROD-192': ["Vodafone World QR 150", 'Others', 'paid', 0],
  'PROD-193': ["Mute Service", 'Others', 'paid', 0],
  'PROD-194': ["International Call Block", 'Others', 'paid', 0],
  'PROD-195': ["Multi SIM", 'Others', 'paid', 50],
  'PROD-196': ["Free Local Multi SIM", 'Others', 'free', 0],
  'PROD-197': ["Two Free Multi SIMs", 'Others', 'free', 0],
};
// The one add-on that pre-dates the workbook and is referenced by seeded orders.
const LEGACY = { 'PROD-101': ['International 50 Add-on', 'International', 'paid', 50] };
// One SAMPLE add-on of each pricing model under Local Data and Local Minutes (2026-10-26): not in the workbook, replaced when the real ones are given.
const SAMPLES = {
  'PROD-210': ['Welcome Data', 'Local Data', 'free', 0],
  'PROD-211': ['Plan Data Bonus', 'Local Data', 'free', 0],
  'PROD-212': ['Data Trial', 'Local Data', 'free', 25],
  'PROD-213': ['Data Booster Intro', 'Local Data', 'paid', 20],
  'PROD-214': ['Welcome Minutes', 'Local Minutes', 'free', 0],
  'PROD-215': ['Plan Minutes Bonus', 'Local Minutes', 'free', 0],
  'PROD-216': ['Local Calls Trial', 'Local Minutes', 'free', 15],
  'PROD-217': ['Local Booster Intro', 'Local Minutes', 'paid', 20],
};
const EXPECTED = { ...WORKBOOK, ...SAMPLES, ...LEGACY };
// Not in the postpaid catalogue: the prepaid-only add-on in the workbook.
const EXCLUDED_NAMES = ['Local Minutes Booster'];

test('the categories and the filter are exactly those asked for, in order, and the page opens on Paid', () => {
  assert.deepEqual([...m.ADDON_CATEGORIES], ['Local Data', 'Local Minutes', 'International', 'Roaming', 'Combo', 'Others']);
  assert.deepEqual(m.ADDON_PRICING_FILTERS.map((f) => f.label), ['Paid', 'Free']);
  assert.equal(m.DEFAULT_ADDON_PRICING, 'paid');
});

test('products.json holds exactly the workbook add-ons (plus the one legacy add-on): none missing, none extra, none prepaid-only', () => {
  assert.deepEqual(addons.map((a) => a.productId).sort(), Object.keys(EXPECTED).sort());
  for (const a of addons) {
    const [name, category, pricing, mrc] = EXPECTED[a.productId];
    assert.equal(a.name, name, a.productId);
    assert.equal(a.addonCategory, category, a.productId);
    assert.equal(m.addonCategoryOf(a), category, a.productId);
    assert.equal(m.isFreeAddon(a), pricing === 'free', a.productId);
    assert.equal(a.mrcQAR, mrc, a.productId);
  }
  assert.ok(!addons.some((a) => EXCLUDED_NAMES.includes(a.name)));
});

test('every add-on is listed under its own category only, and per category Free + Paid together are exactly its add-ons (conservation)', () => {
  let total = 0;
  for (const c of m.ADDON_CATEGORIES) {
    const free = m.addonsFor(addons, c, 'free');
    const paid = m.addonsFor(addons, c, 'paid');
    const expected = addons.filter((a) => EXPECTED[a.productId][1] === c).map((a) => a.productId).sort();
    assert.deepEqual([...free, ...paid].map((a) => a.productId).sort(), expected, c);
    assert.ok(expected.length > 0, `${c} has add-ons`);
    assert.ok(free.every((a) => EXPECTED[a.productId][2] === 'free') && paid.every((a) => EXPECTED[a.productId][2] === 'paid'));
    total += free.length + paid.length;
  }
  assert.equal(total, addons.length);
});

test('category sizes match the workbook, and Free holds only the add-ons included with a plan', () => {
  const size = (c, p) => m.addonsFor(addons, c, p).length;
  assert.deepEqual(Object.fromEntries(m.ADDON_CATEGORIES.map((c) => [c, size(c, 'free') + size(c, 'paid')])), { 'Local Data': 11, 'Local Minutes': 8, International: 8, Roaming: 6, Combo: 5, Others: 9 });
  assert.equal(size('Others', 'free'), 2);
  // Local Data and Local Minutes hold one free add-on of each free model; the other categories hold none.
  assert.equal(size('Local Data', 'free'), 3);
  assert.equal(size('Local Minutes', 'free'), 3);
  for (const c of m.ADDON_CATEGORIES.filter((c) => !['Others', 'Local Data', 'Local Minutes'].includes(c))) assert.equal(size(c, 'free'), 0, c);
});

test('prices the workbook leaves open stay open: wording kept, never turned into a number, never Free', () => {
  const open = addons.filter((a) => a.priceLabel && a.pricing === 'paid');
  assert.ok(open.length >= 10);
  for (const a of open) assert.ok(a.mrcQAR === 0 || a.priceLabel === 'QR 50 per additional SIM', a.productId);
  assert.ok(open.some((a) => a.priceLabel === 'TBC'));
  assert.ok(open.some((a) => a.priceLabel === 'Plan-based'));
  for (const a of open) assert.equal(m.isFreeAddon(a), false, a.productId);
});

test('an add-on that states no known category is listed under Others, never dropped; negative prices are not free', () => {
  assert.equal(m.addonCategoryOf({ mrcQAR: 5 }), 'Others');
  assert.equal(m.addonCategoryOf({ mrcQAR: 5, addonCategory: 'Gaming' }), 'Others');
  assert.equal(m.addonsFor([{ mrcQAR: 5 }], 'Others', 'paid').length, 1);
  assert.equal(m.isFreeAddon({ mrcQAR: -1 }), false);
  assert.equal(m.isFreeAddon({ mrcQAR: 0 }), true, 'no statement: priced QAR 0 is Free');
  assert.equal(m.isFreeAddon({ mrcQAR: 0, pricing: 'paid' }), false, 'a stated Paid add-on with an open price is not Free');
});

test('the chosen add-ons are counted per category, across both filters', () => {
  const ids = Object.entries(EXPECTED);
  const pick = (cat, n) => ids.filter(([, v]) => v[1] === cat).slice(0, n).map(([id]) => id);
  const counts = m.selectedPerCategory(addons, [...pick('Local Data', 2), ...pick('Roaming', 1), ...pick('Others', 3)]);
  assert.deepEqual(counts, { 'Local Data': 2, 'Local Minutes': 0, 'International': 0, Roaming: 1, Combo: 0, Others: 3 });
});

test('the Add-ons page mounts the picker with the category tabs, and under them the selected category in two counted columns: Paid Addons, Free Addons', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /<TabStrip[\s\S]*tabs\.map/);
  assert.match(picker, /\[\.\.\.ADDON_CATEGORIES, FREQUENTLY_USED_TAB\]/);
  assert.match(picker, /addonsFor\(addons, activeTab, pricing\)/);
  assert.match(picker, /inTab\('paid'\)/);
  assert.match(picker, /inTab\('free'\)/);
  assert.ok(picker.indexOf("'Paid Addons'") < picker.indexOf("'Free Addons'"), 'Paid on the left, free on the right');
  assert.match(picker, /\{list\.length\}/);
  assert.match(picker, /md:grid-cols-2/);
  // The Addons page of the Add-Ons capability asks for it (the same page Add Add-On shows).
  assert.match(fs.readFileSync('src/capabilities/AddonsSelection/PostpaidAddonsStep.tsx', 'utf8'), /categorized/);
});

test('the catalogue status (Demo Only / TBC ...) is kept with the data and never displayed on the Add-ons page', () => {
  assert.ok(addons.some((a) => /Demo Only \/ TBC/.test(a.addonStatus ?? '')), 'the data still carries it');
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.doesNotMatch(picker, /\{a\.addonStatus/);
  assert.doesNotMatch(picker, /tint-pink-bg/);
});

test('open values are not displayed on the rows: no OPTIONAL / ADDED tag, no TBC / Plan-based / Plan-dependent price; a stated QAR amount still shows', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.doesNotMatch(picker, /'Added' : 'Optional'/);
  assert.match(picker, /a\.priceLabel && \/QR\\s\*\\d\/\.test\(a\.priceLabel\)/);
  const hiddenPrices = addons.filter((a) => a.pricing === 'paid' && a.priceLabel && !/QR\s*\d/.test(a.priceLabel)).map((a) => a.priceLabel);
  assert.ok(hiddenPrices.length >= 8);
  for (const l of hiddenPrices) assert.ok(/TBC|Plan-based|Plan-dependent/i.test(l), l);
  const shownPrices = addons.filter((a) => a.priceLabel && /QR\s*\d/.test(a.priceLabel)).map((a) => a.priceLabel);
  assert.deepEqual([...new Set(shownPrices)].sort(), ['QR 10 after promotional period', 'QR 50 per additional SIM']);
});

test('postpaid add-ons carry no validity: not in the data, not displayed (a postpaid add-on is monthly)', () => {
  for (const a of addons) assert.equal('validity' in a, false, a.productId);
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.doesNotMatch(picker, /[Vv]alidity/);
});

test('the five pricing models: free for all, free with the plan, free for 3 months; standard paid, introductory discount - each worded as asked', () => {
  const d = (a) => m.addonPriceDisplay(a);
  assert.deepEqual(d({ mrcQAR: 0, pricingModel: 'free-all' }), { primary: 'Free' });
  assert.deepEqual(d({ mrcQAR: 0, pricingModel: 'free-with-plan' }), { primary: 'Free', secondary: 'Included with the selected plan' });
  assert.deepEqual(d({ mrcQAR: 25, pricingModel: 'free-first-3' }), { primary: 'Free', secondary: 'for Months 1\u20133, then QAR 25/month from Month 4' });
  assert.deepEqual(d({ mrcQAR: 20, pricingModel: 'standard' }), { primary: 'QAR 20' });
  assert.deepEqual(d({ mrcQAR: 20, introPriceQAR: 10, pricingModel: 'intro-discount' }), { primary: 'QAR 10', secondary: 'for Months 1\u20133, then QAR 20/month from Month 4' });
  assert.equal(d({ mrcQAR: 20 }), undefined, 'a record with no model keeps its own wording');
  for (const model of ['free-all', 'free-with-plan', 'free-first-3']) assert.equal(m.isFreeAddon({ mrcQAR: 9, pricingModel: model }), true, model);
  for (const model of ['standard', 'intro-discount']) assert.equal(m.isFreeAddon({ mrcQAR: 0, pricingModel: model }), false, model);
  // over the data: every Local Data / Local Calls add-on states a model, except the one with an open price
  for (const a of addons.filter((x) => ['Local Data', 'Local Minutes'].includes(x.addonCategory) && x.productId !== 'PROD-170')) assert.ok(a.pricingModel, a.productId);
  for (const a of addons.filter((x) => x.pricingModel === 'intro-discount')) assert.ok(a.introPriceQAR > 0 && a.introPriceQAR < a.mrcQAR, a.productId);
  for (const a of addons.filter((x) => x.pricingModel === 'free-with-plan')) assert.ok(a.eligibility?.plans?.length, a.productId);
});

test('there is no Paid | Free filter: the page header and the picker draw none, and a category lists both kinds side by side', () => {
  const read = (f) => fs.readFileSync(f, 'utf8');
  assert.deepEqual(m.ADDON_PRICING_FILTERS.map((f) => f.key), ['paid', 'free']);
  assert.doesNotMatch(read('src/capabilities/PlanSelection/postpaidStep.tsx'), /SegmentedTabs|headerAction|addonPricing/);
  const picker = read('src/capabilities/AddonsSelection/AddonsPicker.tsx');
  assert.doesNotMatch(picker, /setPricing|pricingProp/);
  assert.match(picker, /<SegmentedTabs[\s\S]*Billing frequency/);
});

test('the first months\' charge of an add-on (what the monthly summary, checkout and the order carry): free models and the free trial cost nothing, the intro price applies, standard is its price', () => {
  assert.equal(m.addonChargeNowQar({ mrcQAR: 25, pricingModel: 'free-first-3' }), 0);
  assert.equal(m.addonChargeNowQar({ mrcQAR: 0, pricingModel: 'free-all' }), 0);
  assert.equal(m.addonChargeNowQar({ mrcQAR: 0, pricingModel: 'free-with-plan' }), 0);
  assert.equal(m.addonChargeNowQar({ mrcQAR: 20, introPriceQAR: 10, pricingModel: 'intro-discount' }), 10);
  assert.equal(m.addonChargeNowQar({ mrcQAR: 20, pricingModel: 'standard' }), 20);
  assert.equal(m.addonChargeNowQar({ mrcQAR: 20 }), 20, 'a record with no model is charged its price');
  for (const a of addons) assert.ok(m.addonChargeNowQar(a) <= a.mrcQAR, a.productId);
});

test('Addons reads in this order: Add-ons, Bill Limit - no Eligible Discounts (they are added from Add Discount on the plan page) and no Monthly Summary', () => {
  const s = fs.readFileSync('src/capabilities/AddonsSelection/PostpaidAddonsStep.tsx', 'utf8');
  const at = (needle) => s.indexOf(needle);
  const order = [at('<AddonsPicker'), at('<BillLimitEditor')];
  assert.ok(order.every((i) => i > 0), 'both are on the step');
  assert.equal(at('<PostpaidDiscountsPanel'), -1, 'no Eligible Discounts section on this page');
  assert.equal(at('PostpaidMonthlySummary'), -1, 'the Monthly Summary is not on this page');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'in source order, so in page order');
});

test('weekly and one-time add-ons: labelled by what the record states; a weekly one is billed 52/12 weeks a month, a one-time one is paid at activation and adds nothing monthly', () => {
  const demo = allAddons.filter((p) => p.billingFrequency);
  assert.deepEqual([...new Set(demo.map((p) => p.billingFrequency))].sort(), ['one-time', 'weekly']);
  for (const a of demo) assert.equal(m.addonChargeType(a), a.billingFrequency === 'weekly' ? 'Recurring Weekly' : 'One-time', a.productId);
  assert.equal(m.addonChargeType({ mrcQAR: 20, pricingModel: 'standard' }), 'Recurring Monthly', 'no frequency stated: monthly');
  assert.equal(m.addonChargeNowQar({ mrcQAR: 12, billingFrequency: 'weekly' }), 52, '12 x 52/12');
  assert.equal(m.addonChargeNowQar({ mrcQAR: 30, billingFrequency: 'one-time' }), 0);
  assert.equal(m.addonOneTimeQar({ mrcQAR: 30, billingFrequency: 'one-time' }), 30);
  assert.equal(m.addonOneTimeQar({ mrcQAR: 30, billingFrequency: 'weekly' }), 0);
  assert.equal(m.addonOneTimeQar({ mrcQAR: 30 }), 0);
});

test('an add-on may offer weekly and monthly billing; the chosen option drives its label, displayed price and monthly charge', () => {
  const dual = allAddons.find((a) => a.productId === 'PROD-250');
  assert.deepEqual(dual.billingOptions, [
    { frequency: 'monthly', priceQAR: 20 },
    { frequency: 'weekly', priceQAR: 5 },
  ]);
  assert.equal(m.addonChargeType(dual, 'catalogue', 'monthly'), 'Recurring Monthly');
  assert.equal(m.addonChargeType(dual, 'catalogue', 'weekly'), 'Recurring Weekly');
  assert.deepEqual(m.addonPriceDisplay(dual, 'monthly'), { primary: 'QAR 20' });
  assert.deepEqual(m.addonPriceDisplay(dual, 'weekly'), { primary: 'QAR 5', secondary: 'per week' });
  assert.equal(m.addonChargeNowQar(dual, 'monthly'), 20);
  assert.equal(m.addonChargeNowQar(dual, 'weekly'), 21.67);
});

test('availability excludes unpriced and discontinued offers while retaining fixed-price and free offers', () => {
  assert.equal(m.isAddonAvailable({ mrcQAR: 0, pricing: 'paid', priceLabel: 'TBC' }), false);
  assert.equal(m.isAddonAvailable({ mrcQAR: 0, pricing: 'paid', priceLabel: 'Plan-based' }), false);
  assert.equal(m.isAddonAvailable({ mrcQAR: 20, pricing: 'paid', addonStatus: 'Discontinued' }), false);
  assert.equal(m.isAddonAvailable({ mrcQAR: 20, pricing: 'paid', addonStatus: 'Confirmed' }), true);
  assert.equal(m.isAddonAvailable({ mrcQAR: 0, pricing: 'free' }), true);
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /eligibleAddons\.filter\(isAddonAvailable\)/);
});

test('the postpaid New Connection Addons summary sits in the step card header on desktop (as wide as the Journey Summary) and floats at the bottom on a small screen, its panel scrollable within the viewport', () => {
  const read = (file) => fs.readFileSync(file, 'utf8');
  const tray = read('src/components/patterns/wizard/SelectedAddonsHeader.tsx');
  const footer = read('src/components/patterns/wizard/WizardFooter.tsx');
  const wizard = read('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx');
  const stepHeader = read('src/components/patterns/wizard/WizardStepHeader.tsx');
  const connection = read('src/modules/new-connection/NewConnectionWizard.tsx');

  assert.match(tray, /tray-fixed/);
  assert.match(read('src/ui-components.css'), /\.tray-fixed \{[^}]*fixed inset-x-4 bottom-0/);
  assert.match(footer, /bottom-20 lg:bottom-0/);
  assert.match(footer, /action-bar \$\{fixedPosition\}/);
  // Continue is at the right end of the bar on every step: nothing on desktop sits beside it, so it reserves no gap for the summary.
  assert.doesNotMatch(footer, /lg:pr-\[calc/);
  assert.match(wizard, /avoidBottomTray=\{showSelectedAddonsTray && currentStep\?\.key === 'planExtras'\}/);
  assert.match(wizard, /'pb-44 lg:pb-24' : 'pb-24'/);
  // Desktop: the tray is the step header's top-right action, the Journey Summary's width, its panel dropping down.
  assert.match(tray, /'relative w-80'/);
  assert.match(tray, /tray-below/);
  assert.match(read('src/ui-components.css'), /\.tray-below \{[^}]*top-full mt-3/);
  assert.match(wizard, /trayAside=\{selectedAddonsTray && isDesktop \? selectedAddonsTray\('header'\)/);
  assert.match(wizard, /selectedAddonsTray && !isDesktop && selectedAddonsTray\('floating'\)/);
  assert.match(stepHeader, /trayAside/);
  assert.match(stepHeader, /lg:pr-\[22rem\]/);
  assert.match(wizard, /hasSummary && <StepSummaryPanel/);
  assert.match(read('src/components/patterns/wizard/StepSummaryPanel.tsx'), /rail-end card[\s\S]*w-80/);
  assert.match(tray, /\{count\} add-ons · \{formatQar\(monthlyQar\)\}\/month/);
  assert.match(tray, /tray-anchor \$\{variant === 'header'/);
  assert.match(tray, /tray-above/);
  assert.match(read('src/ui-components.css'), /\.tray-above \{[^}]*bottom-full mb-3/);
  assert.match(read('src/ui-components.css'), /\.tray-above \{[^}]*max-h-\[calc\(100dvh-var\(--spacing\)\*24\)\]/);
  assert.match(tray, /scroll-list-ruled/);
  assert.match(read('src/ui-components.css'), /\.scroll-list-ruled \{[^}]*min-h-0/);
  assert.match(tray, /addon-line-grid/);
  assert.match(read('src/ui-components.css'), /\.addon-line-grid \{[^}]*grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(tray, /addon-name/);
  assert.match(read('src/ui-components.css'), /\.addon-name \{[^}]*break-words/);
  assert.doesNotMatch(tray, /<p className="truncate/);
  assert.doesNotMatch(wizard, /titleAction=\{/);
  assert.match(wizard, /showSelectedAddonsTray && currentStep\?\.key === 'planExtras'/);
  assert.match(connection, /showSelectedAddonsTray=\{product === 'postpaid'\}/);
});

test('postpaid New Connection has no separate Add-On Review page: the add-ons are reviewed and managed on the Addons page', () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.doesNotMatch(steps, /addonReview/i);
  assert.ok(!fs.existsSync('src/modules/new-connection/steps/AddonReviewStep.tsx'));
  assert.ok(!fs.existsSync('src/modules/new-connection/steps/AddonReview.tsx'));
  // The Addons page is still in the flow, and Order Summary follows SIM Selection and Billing directly.
  assert.match(steps, /postpaidAddonsStep\(/);
  assert.ok(steps.indexOf('simTypeStep(') < steps.indexOf('checkoutSummaryStep('));
});

test('selected add-on card ticks render above the card and are not clipped at the corner', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  const cardParts = fs.readFileSync('src/components/primitives/offerCardParts.tsx', 'utf8');
  const css = fs.readFileSync('src/ui-components.css', 'utf8');
  assert.match(cardParts, /SelectedTick[\s\S]*card-tick/);
  assert.match(css, /\.card-tick \{[^}]*z-index: var\(--z-raised\)/);
  assert.doesNotMatch(picker, /relative overflow-hidden rounded-\[var\(--radius-card\)\] border/);
});

test('row-card icon tiles align to the top when add-on copy wraps', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /icon-tile-raised size-14 self-start card/);
});

test('the order summary labels each add-on with its effective cadence, not always "/mo"', async () => {
  const rows = await load('/src/components/patterns/checkoutSummaryRows.ts');
  const resolve = (id, choice) => m.addonWithBillingChoice(allAddons.find((a) => a.productId === id), choice);
  assert.equal(rows.addonSummaryLabel(resolve('PROD-250', 'monthly')), 'Weekend Data Pass (QAR 20/mo)');
  assert.equal(rows.addonSummaryLabel(resolve('PROD-250', 'weekly')), 'Weekend Data Pass (QAR 5/wk)');
  const oneTime = allAddons.find((a) => a.billingFrequency === 'one-time');
  assert.match(rows.addonSummaryLabel(oneTime), /one-time\)$/);
  const plain = allAddons.find((a) => !a.billingFrequency);
  assert.match(rows.addonSummaryLabel(plain), /\/mo\)$/);
});

// ---- Frequently Used: a tab across the categories, driven only by a record's own `frequentlyUsedFor` block ----
test('Frequently Used is the last tab and lists only add-ons whose record says so (nothing is read from a name or description)', () => {
  assert.equal(m.FREQUENTLY_USED_TAB, 'Frequently Used');
  assert.ok(!m.ADDON_CATEGORIES.includes(m.FREQUENTLY_USED_TAB), 'it is a view, not a category an add-on is filed under');
  // The independent expectation: the add-ons the business has named, and who they are frequently used for.
  const STATED = { 'PROD-172': { nationalities: ['Indian'] } };
  const withBlock = Object.fromEntries(addons.filter((a) => a.frequentlyUsedFor).map((a) => [a.productId, a.frequentlyUsedFor]));
  assert.deepEqual(withBlock, STATED);
  const indian = addons.filter((a) => m.isFrequentlyUsed(a, { nationality: 'Indian', planId: 'PROD-104' })).map((a) => a.productId);
  assert.deepEqual(indian, ['PROD-172']);
  // The other country add-ons are NOT assumed to suit their nationalities until the business states it.
  for (const nat of ['Pakistani', 'Filipino', 'Bangladeshi', 'Egyptian', 'Qatari']) assert.deepEqual(addons.filter((a) => m.isFrequentlyUsed(a, { nationality: nat })).map((a) => a.productId), [], nat);
  assert.deepEqual(addons.filter((a) => m.isFrequentlyUsed(a, {})).map((a) => a.productId), [], 'an unknown nationality satisfies nothing');
});

test('every condition present must hold; an empty or absent block never matches', () => {
  const both = { frequentlyUsedFor: { nationalities: ['Indian'], plans: ['PROD-104'] } };
  assert.equal(m.isFrequentlyUsed(both, { nationality: 'Indian', planId: 'PROD-104' }), true);
  assert.equal(m.isFrequentlyUsed(both, { nationality: 'indian ', planId: 'PROD-104' }), true, 'case and spacing');
  assert.equal(m.isFrequentlyUsed(both, { nationality: 'Indian', planId: 'PROD-105' }), false);
  assert.equal(m.isFrequentlyUsed(both, { nationality: 'Pakistani', planId: 'PROD-104' }), false);
  assert.equal(m.isFrequentlyUsed(both, { nationality: 'Indian' }), false, 'no plan chosen yet');
  assert.equal(m.isFrequentlyUsed({ frequentlyUsedFor: { plans: ['PROD-104'] } }, { planId: 'PROD-104' }), true, 'a plan-only rule');
  assert.equal(m.isFrequentlyUsed({ frequentlyUsedFor: {} }, { nationality: 'Indian', planId: 'PROD-104' }), false);
  assert.equal(m.isFrequentlyUsed({}, { nationality: 'Indian', planId: 'PROD-104' }), false);
});

test('the picker always shows the Frequently Used tab, and says so when nothing matches the customer', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /const tabs: AddonTab\[\] = \[\.\.\.ADDON_CATEGORIES, FREQUENTLY_USED_TAB\]/);
  assert.match(picker, /No frequently used add-ons for this customer/);
});

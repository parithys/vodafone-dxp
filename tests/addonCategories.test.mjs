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
  'PROD-167': ["Local Booster", 'Local Calls', 'paid', 20],
  'PROD-168': ["Local Add-on Essential", 'Local Calls', 'paid', 20],
  'PROD-169': ["Local Add-on Extra", 'Local Calls', 'paid', 20],
  'PROD-170': ["Local Minutes Plus", 'Local Calls', 'paid', 0],
  'PROD-171': ["International Booster", 'International Calls', 'paid', 20],
  'PROD-172': ["India Booster", 'International Calls', 'paid', 20],
  'PROD-173': ["Pakistan Booster", 'International Calls', 'paid', 20],
  'PROD-174': ["Philippines Booster", 'International Calls', 'paid', 20],
  'PROD-175': ["Bangladesh Booster", 'International Calls', 'paid', 20],
  'PROD-176': ["Egypt Add-on", 'International Calls', 'paid', 0],
  'PROD-177': ["Sri Lanka Add-on", 'International Calls', 'paid', 0],
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
const LEGACY = { 'PROD-101': ['International 50 Add-on', 'International Calls', 'paid', 50] };
// One SAMPLE add-on of each pricing model under Local Data and Local Calls (2026-10-26): not in the workbook, replaced when the real ones are given.
const SAMPLES = {
  'PROD-210': ['Welcome Data', 'Local Data', 'free', 0],
  'PROD-211': ['Plan Data Bonus', 'Local Data', 'free', 0],
  'PROD-212': ['Data Trial', 'Local Data', 'free', 25],
  'PROD-213': ['Data Booster Intro', 'Local Data', 'paid', 20],
  'PROD-214': ['Welcome Minutes', 'Local Calls', 'free', 0],
  'PROD-215': ['Plan Minutes Bonus', 'Local Calls', 'free', 0],
  'PROD-216': ['Local Calls Trial', 'Local Calls', 'free', 15],
  'PROD-217': ['Local Booster Intro', 'Local Calls', 'paid', 20],
};
const EXPECTED = { ...WORKBOOK, ...SAMPLES, ...LEGACY };
// Not in the postpaid catalogue: the prepaid-only add-on in the workbook.
const EXCLUDED_NAMES = ['Local Minutes Booster'];

test('the categories and the filter are exactly those asked for, in order, and the page opens on Paid', () => {
  assert.deepEqual([...m.ADDON_CATEGORIES], ['Local Data', 'Local Calls', 'International Calls', 'Roaming', 'Combo', 'Others']);
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
  assert.deepEqual(Object.fromEntries(m.ADDON_CATEGORIES.map((c) => [c, size(c, 'free') + size(c, 'paid')])), { 'Local Data': 11, 'Local Calls': 8, 'International Calls': 8, Roaming: 6, Combo: 5, Others: 9 });
  assert.equal(size('Others', 'free'), 2);
  // Local Data and Local Calls hold one free add-on of each free model; the other categories hold none.
  assert.equal(size('Local Data', 'free'), 3);
  assert.equal(size('Local Calls', 'free'), 3);
  for (const c of m.ADDON_CATEGORIES.filter((c) => !['Others', 'Local Data', 'Local Calls'].includes(c))) assert.equal(size(c, 'free'), 0, c);
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
  assert.deepEqual(counts, { 'Local Data': 2, 'Local Calls': 0, 'International Calls': 0, Roaming: 1, Combo: 0, Others: 3 });
});

test('the Add-ons page mounts the picker with the category tabs, and under them the selected category in two counted columns: Paid Add-Ons, Complimentary', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /<TabStrip[\s\S]*ADDON_CATEGORIES\.map/);
  assert.match(picker, /addonsFor\(addons, category, 'paid'\)/);
  assert.match(picker, /addonsFor\(addons, category, 'free'\)/);
  assert.ok(picker.indexOf("'PAID ADD-ONS'") < picker.indexOf("'COMPLIMENTARY'"), 'Paid on the left, complimentary on the right');
  assert.match(picker, /\{list\.length\}/);
  assert.match(picker, /md:grid-cols-2/);
  assert.match(fs.readFileSync('src/components/patterns/PostpaidAddonsPanel.tsx', 'utf8'), /categorized/);
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
  for (const a of addons.filter((x) => ['Local Data', 'Local Calls'].includes(x.addonCategory) && x.productId !== 'PROD-170')) assert.ok(a.pricingModel, a.productId);
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
  const s = fs.readFileSync('src/components/patterns/PostpaidPlanAddonsStep.tsx', 'utf8');
  const at = (needle) => s.indexOf(needle);
  const order = [at('<PostpaidAddonsPanel'), at('<BillLimitEditor')];
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

test('the postpaid New Connection Addons summary floats above the viewport edge and keeps its panel scrollable within the viewport', () => {
  const read = (file) => fs.readFileSync(file, 'utf8');
  const tray = read('src/components/patterns/wizard/SelectedAddonsHeader.tsx');
  const footer = read('src/components/patterns/wizard/WizardFooter.tsx');
  const wizard = read('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx');
  const connection = read('src/modules/new-connection/NewConnectionWizard.tsx');

  assert.match(tray, /fixed inset-x-4 bottom-0/);
  assert.match(footer, /bottom-20 lg:bottom-0/);
  assert.match(footer, /fixed inset-x-0 \$\{fixedPosition\}/);
  assert.match(footer, /lg:pr-\[calc\(var\(--spacing\)\*96\)\]/);
  assert.match(wizard, /avoidBottomTray=\{showSelectedAddonsTray && currentStep\?\.key === 'planExtras'\}/);
  assert.match(wizard, /'pb-44 lg:pb-24' : 'pb-24'/);
  assert.match(tray, /lg:left-auto lg:right-8 lg:w-80/);
  assert.match(wizard, /hasSummary && <StepSummaryPanel/);
  assert.match(read('src/components/patterns/wizard/StepSummaryPanel.tsx'), /w-80[\s\S]*my-8 mr-8 card/);
  assert.match(tray, /\{count\} add-ons · \{formatQar\(monthlyQar\)\}\/month/);
  assert.match(tray, /absolute inset-x-0 bottom-full/);
  assert.match(tray, /max-h-\[calc\(100dvh-var\(--spacing\)\*24\)\]/);
  assert.match(tray, /min-h-0 overflow-y-auto/);
  assert.match(tray, /grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(tray, /break-words/);
  assert.doesNotMatch(tray, /<p className="truncate/);
  assert.doesNotMatch(wizard, /titleAction=\{/);
  assert.match(wizard, /showSelectedAddonsTray && currentStep\?\.key === 'planExtras'/);
  assert.match(connection, /showSelectedAddonsTray=\{product === 'postpaid'\}/);
});

test('postpaid New Connection reviews add-on cadence, recurring charges and bill-limit impact before customer confirmation', () => {
  const review = fs.readFileSync('src/modules/new-connection/steps/AddonReview.tsx', 'utf8');
  const reviewStep = fs.readFileSync('src/modules/new-connection/steps/AddonReviewStep.tsx', 'utf8');
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /addonReviewStep\(products/);
  assert.ok(steps.indexOf('addonReviewStep(products') < steps.indexOf('checkoutSummaryStep('));
  assert.match(reviewStep, /key: 'addonReview'/);
  assert.match(review, /Billing Frequency/);
  assert.match(review, /month equivalent/);
  assert.match(review, /Bill-Limit Impact/);
  assert.match(review, /Plan \+ Add-Ons/);
  assert.match(reviewStep, /Continue to Customer Confirmation/);
  assert.match(reviewStep, /goToStepKey\('planExtras'\)/);
});

test('selected add-on card ticks render above the card and are not clipped at the corner', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  const cardParts = fs.readFileSync('src/components/primitives/offerCardParts.tsx', 'utf8');
  assert.match(cardParts, /SelectedTick[\s\S]*z-\[var\(--z-raised\)\]/);
  assert.doesNotMatch(picker, /relative overflow-hidden rounded-\[var\(--radius-card\)\] border/);
});

test('row-card icon tiles align to the top when add-on copy wraps', () => {
  const picker = fs.readFileSync('src/capabilities/AddonsSelection/AddonsPicker.tsx', 'utf8');
  assert.match(picker, /h-14 w-14 shrink-0 self-start items-center justify-center card/);
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

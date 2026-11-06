// "Plan Selection" and "Add-Ons" are two capabilities, each its own page with its own content and behaviour, structured as the Mobile Postpaid Activation journey's two
// steps (Offers & Plans, then Addons). A journey's rules about them (skip, validity, what a plan change clears, whether a pre-bundled offer takes add-ons) stay in
// its step builders; changing either capability reaches every journey that mounts it.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let model, labels, ps;
before(async () => {
  await boot();
  model = await load('/src/components/patterns/postpaidPlanModel.ts');
  labels = await load('/src/data/stepLabels.ts');
  ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
});
after(close);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const code = (f) => strip(fs.readFileSync(f, 'utf8'));
const products = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8'));

test('Plan Selection is the plan only: its components carry no add-on, billing-frequency, bill-limit or service-option props, and no "mode" that turns them on', () => {
  const COMPONENTS = ['src/capabilities/PlanSelection/PlanSelection.tsx', 'src/components/patterns/PostpaidPlanStep.tsx', 'src/components/patterns/usePostpaidPlans.ts', 'src/components/patterns/PrepaidPlanStep.tsx', 'src/components/patterns/FixedPlanStep.tsx'];
  for (const f of COMPONENTS) {
    const c = code(f);
    assert.doesNotMatch(c, /addonIds|addonBilling|onAddonsChange|onSelectAddons|AddonsPicker|serviceOptions|onBillLimitChange|billLimitMax|\bmode\b|extras/, `${f} holds add-on logic`);
  }
  // The builders mention add-ons only to hand over to the Addons page (Customise Add-ons) and to clear them when the plan changes - this journey's rule.
  for (const f of ['src/capabilities/PlanSelection/postpaidStep.tsx', 'src/capabilities/PlanSelection/step.tsx']) {
    assert.doesNotMatch(code(f), /AddonsPicker|addonBilling|serviceOptions|billLimitMax|onBillLimitChange|ADDONS_DISCOUNTS_LABEL|postpaidAddonsStep|prepaidAddonsStep/, f);
  }
  // The card shows the limit chosen on the Addons page, read-only; nothing on the plan side edits it.
  assert.match(code('src/components/patterns/PostpaidPlanStep.tsx'), /billLimit\?: number/);
});

test('Add-Ons is its own page: it imports nothing from Plan Selection (the plan\'s id is all it takes), and is the only home of the add-ons, bill limit and service options', () => {
  const files = walk('src/capabilities/AddonsSelection').filter((f) => /\.(ts|tsx)$/.test(f));
  assert.ok(files.length >= 8);
  for (const f of files) {
    const imports = code(f).match(/from '[^']+'/g) ?? [];
    for (const i of imports) assert.doesNotMatch(i, /PlanSelection|PostpaidPlanStep|usePostpaidPlans|PostpaidPlanCard|PrepaidPlanStep|PlanGroupPanel|PlanDetailsDrawer/, `${f} imports ${i}`);
  }
  const page = code('src/capabilities/AddonsSelection/PostpaidAddonsStep.tsx');
  for (const part of ['<AddonsPicker', 'categorized', '<BillLimitEditor', 'SERVICE_OPTIONS']) assert.ok(page.includes(part), `the Addons page has ${part}`);
});

test('the registry lists them as two capabilities with their own entries, step builders and parts', () => {
  const reg = JSON.parse(fs.readFileSync('src/capabilities/registry.json', 'utf8'));
  const plan = reg.find((c) => c.id === 'plan-selection');
  const addons = reg.find((c) => c.id === 'addons-selection');
  assert.deepEqual(plan.stepBuilders, ['planSelectionStep', 'postpaidPlanStep', 'fixedPlanSelectionStep']);
  assert.deepEqual(addons.stepBuilders, ['postpaidAddonsStep', 'prepaidAddonsStep', 'addonsSelectionStep']);
  assert.equal(addons.entry, 'AddonsSelection');
  assert.equal(plan.home, 'capabilities/PlanSelection');
  assert.equal(addons.home, 'capabilities/AddonsSelection');
  assert.ok(!plan.parts.some((p) => /Addon/i.test(p)), 'no add-on part under Plan Selection');
  assert.ok(addons.parts.every((p) => fs.existsSync(`src/${p}`)), 'every part exists');
  assert.doesNotMatch(plan.summary, /then Add-ons/);
});

test('the postpaid journey is still two steps in the same order with the same keys and names: Offers & Plans, then Addons', () => {
  const steps = ps.postpaidSteps({ products: [], customerBenefits: [], familyLines: [] });
  const keys = steps.map((s) => s.key);
  assert.ok(keys.indexOf('plan') > 0 && keys.indexOf('planExtras') === keys.indexOf('plan') + 1, `plan then planExtras (${keys.join(', ')})`);
  assert.equal(steps.find((s) => s.key === 'plan').label, labels.PLAN_SELECTION_LABEL);
  assert.equal(steps.find((s) => s.key === 'planExtras').label, 'Addons');
  assert.equal(labels.ADDONS_DISCOUNTS_LABEL, 'Addons');
});

test('the same Addons page serves the activation journey and Add Add-On; each journey passes only its own rules', () => {
  const step = code('src/capabilities/AddonsSelection/step.tsx');
  const activation = step.slice(step.indexOf('export function postpaidAddonsStep'), step.indexOf('export function prepaidAddonsStep'));
  const addOn = step.slice(step.indexOf('export function addonsSelectionStep'));
  for (const s of [activation, addOn]) assert.match(s, /<AddonsSelection\s+kind="postpaid"/);
  // The activation journey's rules: a pre-bundled plan takes no add-ons, the billing frequency is recorded, the bill limit and service options are set.
  for (const rule of ['bundledPlansTakeNoAddons', 'onAddonBillingChange', 'billLimit={{', 'serviceOptions={{']) assert.ok(activation.includes(rule), `activation: ${rule}`);
  // Add Add-On's: none of those (the line already has its plan; its order does not price a billing frequency), and at least one add-on is needed.
  for (const rule of ['bundledPlansTakeNoAddons', 'onAddonBillingChange', 'billLimit', 'serviceOptions']) assert.ok(!addOn.includes(rule), `Add Add-On does not pass ${rule}`);
  assert.match(addOn, /isValid: \(values\) => \(\(values\.addonIds as string\[\] \| undefined\) \?\? \[\]\)\.length > 0/);
  // A prepaid line's add-ons are its own list, as before.
  assert.match(addOn, /source="prepaid"/);
});

test('what a different plan clears is the journey\'s rule: it is in the postpaid plan step, and no component clears add-ons when the plan changes', () => {
  const builder = code('src/capabilities/PlanSelection/postpaidStep.tsx');
  assert.equal((builder.match(/setValue\('addonIds', \[\]\)/g) ?? []).length, 2, 'on choosing another plan and on clearing the plan');
  assert.match(builder, /if \(id !== values\.productId && addonsChosen\)/);
  for (const f of ['src/components/patterns/usePostpaidPlans.ts', 'src/components/patterns/PostpaidPlanStep.tsx', ...fs.readdirSync('src/capabilities/AddonsSelection').filter((n) => /\.tsx?$/.test(n)).map((n) => `src/capabilities/AddonsSelection/${n}`)]) {
    assert.doesNotMatch(code(f), /onAddonsChange\(\[\]\)/, `${f} clears add-ons on a plan change`);
  }
  // The discount is the plan page's own and still goes with the plan.
  assert.match(code('src/components/patterns/usePostpaidPlans.ts'), /if \(discountId\) onSelectDiscount\(undefined\)/);
});

test('where the chosen plan came from is one definition for both pages, over the whole catalogue: the Offers group (or a flagged pre-bundled offer) is an OFFER, every other postpaid plan a PLAN', () => {
  const plans = products.filter((p) => p.type === 'Postpaid Plan');
  assert.ok(plans.length > 20);
  let offers = 0;
  for (const p of plans) {
    const expectedOffer = Boolean(p.preBundledOffer) || Boolean(p.popular) || Boolean(p.offer); // written independently of planGroupOf
    const got = model.planSelectionOf(p);
    assert.equal(got.preBundled, expectedOffer, p.productId);
    assert.equal(got.source, expectedOffer ? 'OFFER' : 'PLAN', p.productId);
    assert.deepEqual(got.bundled, expectedOffer ? p.benefits ?? [] : [], `${p.productId}: only an offer bundles anything`);
    if (expectedOffer) offers++;
  }
  assert.ok(offers > 0 && offers < plans.length, 'both outcomes are present');
  // Unknown stays unknown: no plan, no source.
  assert.deepEqual(model.planSelectionOf(undefined), { preBundled: false, source: undefined, bundled: [] });
});

test('rendered: the activation Addons page says nothing is listed until a plan is chosen; Add Add-On, whose line already has its plan, lists the add-ons from the plan\'s id', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { PostpaidAddonsStep } = await load('/src/capabilities/AddonsSelection/PostpaidAddonsStep.tsx');
  const none = renderToStaticMarkup(React.createElement(PostpaidAddonsStep, { planId: undefined, addonIds: [], onAddonsChange: () => {}, bundledPlansTakeNoAddons: true }));
  assert.match(none, /Select a plan first/);
  const addOn = renderToStaticMarkup(React.createElement(PostpaidAddonsStep, { planId: 'PROD-107', addonIds: [], onAddonsChange: () => {} }));
  assert.match(addOn, /aria-label="Add-ons"/, 'the picker is mounted for the line\'s plan');
  assert.doesNotMatch(addOn, /Select a plan first|Bill Limit|Do Not Disturb/);
});

// ---- Prepaid mirrors Postpaid; Special Offers is Postpaid Plan's, Recommended Offers is not --------------------------------------------------------------

test('the prepaid Addons page is built like the postpaid one: the add-ons only, in the same section and rows, with the pack, its benefits, discounts and total left to the pack page', () => {
  const prepaid = code('src/capabilities/AddonsSelection/PrepaidAddonsStep.tsx');
  const postpaid = code('src/capabilities/AddonsSelection/PostpaidAddonsStep.tsx');
  for (const shared of ['aria-label="Add-ons"', '<AddonsPicker', 'hideHeader', 'layout="rows"', 'Select a plan first'.replace('plan', 'pack')]) assert.ok(prepaid.includes(shared), `prepaid: ${shared}`);
  assert.ok(postpaid.includes('aria-label="Add-ons"') && postpaid.includes('layout="rows"'), 'the postpaid page has the same shell');
  assert.doesNotMatch(prepaid, /Eligible Discounts|Selected Pack|Starter Pack|Benefits|Pack summary|Pack Total|onSelectDiscount|discountId|SelectedPlanFigure/, 'nothing of the pack page is repeated, and the discount is not here');
  // Prepaid add-ons carry no category, so there are no category tabs to build: one list of the same rows.
  assert.match(prepaid, /source="prepaid"/);
  assert.doesNotMatch(prepaid, /categorized/);
});

test('the prepaid flow is the postpaid flow: Continue passes over the Addons page, Customise Add-ons is the way there, and Edit Discount is on the pack page', () => {
  const addons = code('src/capabilities/AddonsSelection/step.tsx');
  const prepaid = addons.slice(addons.indexOf('export function prepaidAddonsStep'), addons.indexOf('export function addonsSelectionStep'));
  const postpaid = addons.slice(addons.indexOf('export function postpaidAddonsStep'), addons.indexOf('export function prepaidAddonsStep'));
  for (const s of [prepaid, postpaid]) {
    assert.match(s, /key: 'planExtras'/);
    assert.match(s, /label: ADDONS_DISCOUNTS_LABEL/);
    assert.match(s, /autoPass: \(values\) => !values\.customiseAddons/);
    assert.match(s, /<SpendFlag active=\{Boolean\(values\.customiseAddons\)\}/);
  }
  // Postpaid add-ons are products and carry the Summary rows with the step; a prepaid add-on is an add-ons/discounts record, so each prepaid journey attaches its own.
  assert.match(postpaid, /summary: addonsSummary/);
  assert.doesNotMatch(prepaid, /summary:/);
  const pack = code('src/capabilities/PlanSelection/step.tsx');
  assert.match(pack, /primaryAction:[\s\S]*<PrepaidPackActions/, 'the pack step carries the actions');
  const actions = code('src/capabilities/PlanSelection/PrepaidPackActions.tsx');
  assert.match(actions, /<CustomiseAddonsAction/);
  assert.match(actions, /<AddDiscountAction/, 'the same Edit Discount as the postpaid plan page');
  assert.match(code('src/capabilities/PlanSelection/postpaidStep.tsx'), /<CustomiseAddonsAction[\s\S]*<AddDiscountAction/, 'the postpaid page has the same two');
  // The journey's own rule still clears what belongs to the old pack when the pack changes.
  assert.match(pack, /setValue\('addonIds', \[\]\)/);
});

test('"Customise Add-ons" is offered on a pack only when the pack has an add-on - over every prepaid pack in the catalogue', async () => {
  const hook = await load('/src/capabilities/AddonsSelection/usePackHasAddons.ts');
  const rows = JSON.parse(fs.readFileSync('public/mock-data/addons-discounts.json', 'utf8'));
  const packs = products.filter((p) => p.type === 'Prepaid Plan');
  assert.ok(packs.length >= 4);
  let withAddons = 0;
  for (const pack of packs) {
    const expected = rows.some((r) => r.category === 'Paid Add-on' && r.planId === pack.productId); // written independently of the hook
    assert.equal(hook.packHasAddons(rows, pack.productId), expected, pack.productId);
    if (expected) withAddons++;
  }
  assert.ok(withAddons > 0 && withAddons < packs.length, 'both outcomes exist');
  assert.equal(hook.packHasAddons(rows, 'PROD-NONE'), false, 'unknown stays unknown');
  // A discount is not an add-on.
  assert.equal(hook.packHasAddons([{ category: 'Discount', planId: 'P' }], 'P'), false);
});

test('Postpaid Plan\'s tabs are Offers, Standard Plans and Special Offers (a validated Special Discount); Recommended Offers is not one of them - it stays its own capability', () => {
  assert.deepEqual(model.PLAN_GROUPS.map((g) => g.label).slice(0, 2), ['Offers', 'Standard Plans']);
  assert.equal(model.SPECIAL_OFFERS_TAB_LABEL, 'Special Offers');
  // Plan Selection reaches nothing of Recommended Offers (its own capability, registered as cross-sell-offers), in code.
  const plan = [
    ...walk('src/capabilities/PlanSelection'),
    'src/components/patterns/PostpaidPlanStep.tsx', 'src/components/patterns/usePostpaidPlans.ts', 'src/components/patterns/PlanTabStrip.tsx', 'src/components/patterns/PlanGroupPanel.tsx',
  ].filter((f) => /\.(ts|tsx)$/.test(f));
  for (const f of plan) assert.doesNotMatch(code(f), /CrossSell|CrossSales|Recommended Offers|offersStep/, `${f} reaches Recommended Offers`);
  // ... which keeps its own registry entry, entry point and step.
  const reg = JSON.parse(fs.readFileSync('src/capabilities/registry.json', 'utf8'));
  const cross = reg.find((c) => c.id === 'cross-sell-offers');
  assert.deepEqual([cross.name, cross.entry, cross.stepBuilders], ['Recommended Offers', 'CrossSalesStep', ['offersStep']]);
  assert.ok(!reg.find((c) => c.id === 'plan-selection').parts.some((p) => /CrossSell/.test(p)));
  // The library lets Special Offers be seen: the Postpaid Plan preview can hold each Special Discount, which is what makes the tab appear.
  const previews = fs.readFileSync('src/capabilities/previewDemos.tsx', 'utf8');
  for (const held of ["'b2b2c'", "'retired'", "'mada'"]) assert.ok(previews.includes(held), `preview holds ${held}`);
  assert.match(previews, /specialDiscountType=\{held\}/);
  assert.match(previews, /customerBenefit=\{held === 'none' \? undefined : held\}/);
});

// The Family Package model: STATE -> remaining entitlement -> eligible plans -> the agent SELECTS A PLAN -> the line type is DERIVED. The agent is never asked for a connection type.
//   new package + first connection -> PRIMARY_LINE_1; Primary Line 1 active + included second Primary -> PRIMARY_LINE_2 (same package, same plan, included);
//   both Primary Lines active + the Family-equivalent plan -> SUPPLEMENTARY; both active + the Net/Data plan -> SECONDARY. Nothing else is in scope.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let fp, start;
before(async () => {
  await boot();
  fp = await load('/src/engines/familyPackage.ts');
  start = await load('/src/modules/new-connection/familyStart.ts');
});
after(close);

const products = JSON.parse(fs.readFileSync('public/mock-data/products.json', 'utf8'));
const CAT = () => fp.lineCatalogueOf(products);
const SUPP = 'PROD-311';
const NET = 'PROD-312';
const KIDS = 'PROD-310';
const SECONDARY_PLANS = [KIDS, NET];
const ln = (role, sequence, planId = 'PROD-143') => ({ lineId: `L-${role}-${sequence}`, packageId: 'P', customerId: 'C', role, sequence, planId, orderId: `ORD-${role}-${sequence}` });
const ord = (orderId, approvalStatus = 'Approved', status = 'Complete') => ({ orderId, approvalStatus, status });
const active = (...lines) => lines.map((l) => ord(l.orderId));
const P1 = ln('Primary', 1);
const P2 = ln('Primary', 2);
const BOTH = [P1, P2];

test('A. no package: the next connection is Primary Line 1, and only that', () => {
  const state = fp.resolvePackageState([], []);
  assert.equal(state.nextAction, 'START_PACKAGE');
  const d = fp.deriveFamilyLine({ lines: [], orders: [], catalogue: CAT() });
  assert.deepEqual([d.ok, d.type, d.role, d.sequence], [true, 'PRIMARY_LINE_1', 'Primary', 1]);
  for (const role of ['Supplementary', 'Secondary']) assert.equal(fp.canAddLine([], [], role, CAT()).ok, false, `${role} cannot start a package`);
  // Selecting an additional plan does not skip Primary Line 1.
  assert.equal(fp.deriveFamilyLine({ lines: [], orders: [], catalogue: CAT(), selectedPlanId: SUPP }).type, 'PRIMARY_LINE_1');
});

test('B. Primary Line 1 active, Primary Line 2 not: Primary Line 2 is next, on the SAME package and plan, included - whatever plan was selected', () => {
  const orders = active(P1);
  const state = fp.resolvePackageState([P1], orders);
  assert.deepEqual([state.nextAction, state.primary1, state.primary2, state.primaryActive, state.primaryRemaining], ['PRIMARY_LINE_2', 'Active', 'None', 1, 1]);
  for (const selectedPlanId of [undefined, 'PROD-145', SUPP, NET, KIDS]) {
    const d = fp.deriveFamilyLine({ lines: [P1], orders, catalogue: CAT(), selectedPlanId });
    assert.deepEqual([d.ok, d.type, d.role, d.sequence, d.planId, d.charge], [true, 'PRIMARY_LINE_2', 'Primary', 2, 'PROD-143', 'Free'], `selected ${selectedPlanId}`);
  }
  assert.deepEqual(fp.eligibleAdditionalPlans(state, CAT()), [], 'no additional plan while Primary Line 2 remains');
  // Never classified as Supplementary or Secondary, never charged as a paid additional line.
  for (const role of ['Supplementary', 'Secondary']) assert.equal(fp.canAddLine([P1], orders, role, CAT()).ok, false, `${role} before Primary Line 2`);
});

test('Primary Line 1 must be active first, and neither Primary Line can be activated twice', () => {
  // Primary Line 2 cannot precede Primary Line 1: with Primary Line 1 pending, nothing opens.
  const pending = [ord(P1.orderId, 'Pending Approval', 'Submitted for Approval')];
  assert.equal(fp.resolvePackageState([P1], pending).nextAction, 'AWAIT_PRIMARY_1');
  for (const role of fp.FAMILY_ROLES) assert.equal(fp.canAddLine([P1], pending, role, CAT()).ok, false, role);
  assert.equal(fp.deriveFamilyLine({ lines: [P1], orders: pending, catalogue: CAT() }).ok, false);
  // Primary Line 1 twice: a customer who holds a package cannot start another.
  assert.equal(fp.familyStartCheck({ plan: { productId: 'PROD-143', planClass: 'Postpaid Family Plans' }, eligibilityCleared: true, customerLines: [P1] }).kind, 'package');
  // Primary Line 2 twice: once it is on record (even awaiting approval) there is no second one and nothing else opens yet.
  const p2Pending = [...active(P1), ord(P2.orderId, 'Pending Approval', 'Submitted for Approval')];
  assert.equal(fp.resolvePackageState(BOTH, p2Pending).nextAction, 'AWAIT_PRIMARY_2');
  assert.equal(fp.canAddLine(BOTH, p2Pending, 'Primary', CAT()).ok, false);
  for (const role of ['Supplementary', 'Secondary']) assert.match(fp.canAddLine(BOTH, p2Pending, role, CAT()).reason, /Primary Line 2 is not active yet/);
  const afterTwo = [...active(P1, P2)];
  assert.match(fp.canAddLine(BOTH, afterTwo, 'Primary', CAT()).reason, /already has its 2 Primary lines/);
});

test('C. both Primary Lines active: the eligible additional plans are the Family-equivalent plan and both Secondary plans, and the agent selects one', () => {
  const orders = active(P1, P2);
  const state = fp.resolvePackageState(BOTH, orders);
  assert.deepEqual([state.nextAction, state.primaryActive, state.primaryRemaining], ['ADDITIONAL_PLAN', 2, 0]);
  assert.deepEqual(fp.eligibleAdditionalPlans(state, CAT()).map((e) => [e.planId, e.type]), [[SUPP, 'SUPPLEMENTARY'], [KIDS, 'SECONDARY'], [NET, 'SECONDARY']]);
  const pendingChoice = fp.deriveFamilyLine({ lines: BOTH, orders, catalogue: CAT() });
  assert.equal(pendingChoice.ok && pendingChoice.pending, true, 'the plan is still to be selected: no type has been chosen for the agent');
  assert.deepEqual(pendingChoice.eligiblePlans.map((e) => e.planId), [SUPP, KIDS, NET]);
});

test('D. the Family-equivalent plan derives SUPPLEMENTARY; E. either Secondary plan derives SECONDARY - whatever the agent did before', () => {
  const orders = active(P1, P2);
  const d = fp.deriveFamilyLine({ lines: BOTH, orders, catalogue: CAT(), selectedPlanId: SUPP });
  assert.deepEqual([d.ok, d.type, d.role, d.sequence, d.planId, d.charge], [true, 'SUPPLEMENTARY', 'Supplementary', 1, SUPP, 'Paid']);
  for (const secondary of SECONDARY_PLANS) {
    const e = fp.deriveFamilyLine({ lines: BOTH, orders, catalogue: CAT(), selectedPlanId: secondary });
    assert.deepEqual([e.ok, e.type, e.role, e.sequence, e.planId, e.charge], [true, 'SECONDARY', 'Secondary', 1, secondary, 'Paid']);
  }
  // The derivation is the plan's alone: the same selection gives the same type on any package tier.
  for (const tier of ['PROD-142', 'PROD-143', 'PROD-144', 'PROD-145']) {
    const lines = [ln('Primary', 1, tier), ln('Primary', 2, tier)];
    assert.equal(fp.deriveFamilyLine({ lines, orders, catalogue: CAT(), selectedPlanId: SUPP }).type, 'SUPPLEMENTARY', tier);
    for (const secondary of SECONDARY_PLANS) assert.equal(fp.deriveFamilyLine({ lines, orders, catalogue: CAT(), selectedPlanId: secondary }).type, 'SECONDARY', `${tier} ${secondary}`);
  }
});

test('only these additional plans are in scope: the Family-equivalent plan and the two Secondary plans; no other plan or product is an additional option', () => {
  const orders = active(P1, P2);
  assert.deepEqual(CAT().secondaryPlanIds, SECONDARY_PLANS, 'Ahli Lite (Kids Plan) and Ahli Net (Data-only Plan)');
  for (const p of products) {
    const d = fp.deriveFamilyLine({ lines: BOTH, orders, catalogue: CAT(), selectedPlanId: p.productId });
    const expected = p.productId === SUPP ? 'SUPPLEMENTARY' : SECONDARY_PLANS.includes(p.productId) ? 'SECONDARY' : undefined;
    assert.equal(d.ok ? d.type : undefined, expected, `${p.productId} ${p.name}`);
    if (!expected) assert.equal(d.ok, false, p.productId);
  }
});

test('F. entitlement is calculated from the lines each time; G. an exhausted Supplementary entitlement removes the Family-equivalent plan and leaves Net/Data', () => {
  const orders = (...ls) => active(...ls);
  const one = [...BOTH, ln('Supplementary', 1)];
  let state = fp.resolvePackageState(one, orders(...one));
  assert.deepEqual([state.supplementaryUsed, state.supplementaryRemaining], [1, 1], 'partially consumed');
  assert.deepEqual(fp.eligibleAdditionalPlans(state, CAT()).map((e) => e.planId), [SUPP, KIDS, NET]);
  assert.equal(fp.deriveFamilyLine({ lines: one, orders: orders(...one), catalogue: CAT(), selectedPlanId: SUPP }).sequence, 2, 'numbering continues');
  const two = [...one, ln('Supplementary', 2)];
  state = fp.resolvePackageState(two, orders(...two));
  assert.deepEqual([state.supplementaryUsed, state.supplementaryRemaining], [2, 0]);
  assert.deepEqual(fp.eligibleAdditionalPlans(state, CAT()).map((e) => e.planId), [KIDS, NET], 'exhausted: the Secondary plans remain');
  const refused = fp.deriveFamilyLine({ lines: two, orders: orders(...two), catalogue: CAT(), selectedPlanId: SUPP });
  assert.equal(refused.ok, false, 'a plan selected before the entitlement ran out cannot be activated (stale selection)');
  assert.equal(fp.deriveFamilyLine({ lines: two, orders: orders(...two), catalogue: CAT(), selectedPlanId: NET }).type, 'SECONDARY');
  // Secondary has no limit: the plan stays available however many there are.
  const many = [...two, ...Array.from({ length: 10 }, (_, i) => ln('Secondary', i + 1))];
  assert.equal(fp.deriveFamilyLine({ lines: many, orders: orders(...many), catalogue: CAT(), selectedPlanId: NET }).sequence, 11);
});

test('a catalogue with no plan for a path offers none for it - never assumed, never invented', () => {
  const orders = active(P1, P2);
  const state = fp.resolvePackageState(BOTH, orders);
  assert.deepEqual(fp.eligibleAdditionalPlans(state, {}), []);
  assert.deepEqual(fp.eligibleAdditionalPlans(state, { supplementaryPlanId: SUPP }).map((e) => e.type), ['SUPPLEMENTARY']);
  assert.deepEqual(fp.eligibleAdditionalPlans(state, { secondaryPlanIds: [NET] }).map((e) => e.type), ['SECONDARY']);
  assert.equal(fp.deriveFamilyLine({ lines: BOTH, orders, catalogue: {} }).ok, false);
  assert.equal(fp.connectionUnavailable(BOTH, orders, {}).title, 'No Additional Plan Is Available');
});

test('over every combination of line counts: the derived type, the sequence and what is eligible follow the counts exactly (independent expectation)', () => {
  let checked = 0;
  for (const supp of [0, 1, 2, 3]) for (const sec of [0, 1, 4]) for (const p2 of ['none', 'pending', 'active']) {
    const lines = [P1, ...(p2 === 'none' ? [] : [P2]), ...Array.from({ length: supp }, (_, i) => ln('Supplementary', i + 1)), ...Array.from({ length: sec }, (_, i) => ln('Secondary', i + 1))];
    const orders = [ord(P1.orderId), ...(p2 === 'pending' ? [ord(P2.orderId, 'Pending Approval', 'Submitted for Approval')] : p2 === 'active' ? [ord(P2.orderId)] : []), ...lines.slice(p2 === 'none' ? 1 : 2).map((l) => ord(l.orderId))];
    const eligible = fp.eligibleAdditionalPlans(fp.resolvePackageState(lines, orders), CAT()).map((e) => e.type);
    const expected = p2 !== 'active' ? [] : [...(supp < 2 ? ['SUPPLEMENTARY'] : []), 'SECONDARY', 'SECONDARY'];
    assert.deepEqual(eligible, expected, `supp ${supp} sec ${sec} primary2 ${p2}`);
    const d = fp.deriveFamilyLine({ lines, orders, catalogue: CAT(), selectedPlanId: SUPP });
    if (p2 === 'none') assert.equal(d.type, 'PRIMARY_LINE_2');
    else if (p2 === 'pending') assert.equal(d.ok, false);
    else if (supp < 2) assert.deepEqual([d.type, d.sequence], ['SUPPLEMENTARY', supp + 1]);
    else assert.equal(d.ok, false);
    checked += 1;
  }
  assert.equal(checked, 36);
});

test('the journey derives the line from its own values: no connection type in the draft, only the package and the plan selected', () => {
  const catalogue = products.map((p) => ({ productId: p.productId, name: p.name, mrcQAR: p.mrcQAR, planClass: p.planClass, secondaryPlanType: p.secondaryPlanType }));
  const pkg = { ...P1, packageId: 'FPK-X', customerId: 'CUST-9' };
  const second = { ...P2, packageId: 'FPK-X', customerId: 'CUST-9' };
  const values = (over = {}) => ({ familyLine: { packageId: 'FPK-X' }, eligibility: { customerId: 'CUST-9', hardStop: false, softStop: false }, contact: { idNumber: '1' }, ...over });
  // Primary Line 2: the package's plan whatever is selected.
  const p2 = start.familyStartFor(values({ productId: 'PROD-108' }), catalogue, [pkg], active(P1));
  assert.deepEqual([p2.ok, p2.planId, p2.lineLabel, p2.additional.type, p2.additional.charge], [true, 'PROD-143', 'Primary Line 2', 'PRIMARY_LINE_2', 'Free']);
  // Both active, nothing selected: pending, the plan to be chosen - Continue is not possible.
  const pending = start.familyStartFor(values(), catalogue, [pkg, second], active(P1, P2));
  assert.deepEqual([pending.ok, pending.planId, pending.additional.pending], [true, undefined, true]);
  assert.deepEqual(pending.additional.eligiblePlans.map((e) => e.planId), [SUPP, KIDS, NET]);
  // Selected: derived.
  const supp = start.familyStartFor(values({ productId: SUPP }), catalogue, [pkg, second], active(P1, P2));
  assert.deepEqual([supp.planId, supp.lineLabel, supp.additional.type], [SUPP, 'Supplementary Line 1', 'SUPPLEMENTARY']);
  const net = start.familyStartFor(values({ productId: NET }), catalogue, [pkg, second], active(P1, P2));
  assert.deepEqual([net.planId, net.lineLabel, net.additional.type], [NET, 'Secondary Line 1', 'SECONDARY']);
  // Stale or ineligible selections are refused, not carried forward.
  for (const secondary of SECONDARY_PLANS) assert.equal(start.familyStartFor(values({ productId: secondary }), catalogue, [pkg, second], active(P1, P2)).additional.type, 'SECONDARY', secondary);
  assert.equal(start.familyStartFor(values({ productId: 'PROD-145' }), catalogue, [pkg, second], active(P1, P2)).ok, false);
  const exhausted = [pkg, second, { ...ln('Supplementary', 1), packageId: 'FPK-X', customerId: 'CUST-9' }, { ...ln('Supplementary', 2), packageId: 'FPK-X', customerId: 'CUST-9' }];
  assert.equal(start.familyStartFor(values({ productId: SUPP }), catalogue, exhausted, active(...exhausted)).ok, false, 'Supplementary exhausted');
  assert.equal(start.familyStartFor(values({ productId: NET }), catalogue, exhausted, active(...exhausted)).additional.type, 'SECONDARY');
  // A draft saved before this model carried a role: it is ignored.
  assert.deepEqual(start.familyLineContextOf({ familyLine: { packageId: 'FPK-X', role: 'Secondary' } }), { packageId: 'FPK-X' });
});

test('the classification lives in the engine, not in components, and no plan name or price decides it', () => {
  const engine = fs.readFileSync('src/engines/familyPackage.ts', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.doesNotMatch(engine, /\.name\s*===|=== ?['"]Ahli|['"]Ahli Net|['"]Ahli Lite|\b199\b/, 'no name or price in the rules');
  for (const f of ['src/components/patterns/FamilyPackageNotice.tsx', 'src/capabilities/PlanSelection/AdditionalPlanPicker.tsx', 'src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'src/modules/new-connection/FamilyPackageActiveGate.tsx']) {
    const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(src, /role === 'Supplementary'|role === 'Secondary'|type === 'SUPPLEMENTARY'|type === 'SECONDARY'|PROD-31\d|\b199\b/, `${f} derives nothing itself`);
  }
  // The configured limits are the one place that states them.
  assert.match(fs.readFileSync('src/engines/familyPackage.ts', 'utf8'), /export const FAMILY_CONFIG = \{ primaryIncluded: 2, supplementaryMax: 2 as number \| null, secondaryMax: null as number \| null \}/);
});

test('duplicate submission cannot create a second line: a package that already holds Primary Line 1 / Primary Line 2 refuses it at submission, on the lines on record then', () => {
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /const familyLinesNow = await mockDataEngine\.list<FamilyLine>\('family-package-lines'\)/, 'judged on the records now, not the draft');
  assert.match(submit, /if \(family\.applies && !family\.ok\) throw new Error\(family\.reason\)/);
  const submitGuard = fs.readFileSync('src/components/patterns/wizard/useWizardStepNavigation.ts', 'utf8');
  assert.match(submitGuard, /submittingRef/, 'one submission at a time');
  // A second Primary Line 1 / Primary Line 2 after the first is on record is a refusal from the engine itself.
  assert.equal(fp.familyStartCheck({ plan: { productId: 'PROD-143', planClass: 'Postpaid Family Plans' }, eligibilityCleared: true, customerLines: [P1] }).ok, false);
  assert.equal(fp.canAddLine([P1, P2], active(P1, P2), 'Primary', CAT()).ok, false);
});

test('Primary Line 2 is included: its plan rental is not charged again (read back as included, nothing in the monthly total); every other line is charged at its own plan', async () => {
  const pricing = await load('/src/engines/postpaidPricing.ts');
  // Independent expectation: a line charged at its plan adds the plan price; an included line adds nothing, whatever the plan costs.
  const paid = pricing.monthlyCharges({ planQar: 450, discountRate: undefined, addonsQar: 0 });
  const included = pricing.monthlyCharges({ planQar: 0, discountRate: undefined, addonsQar: 0 });
  assert.ok(paid.totalQar >= 450, 'a charged line carries its plan price (and what the price formula adds)');
  assert.equal(included.totalQar, 0);
  assert.match(fs.readFileSync('src/components/patterns/checkoutSummaryRows.ts', 'utf8'), /plan\.rentalIncludedInPackage \? 'Included in the Family Package'/, 'read back as included');
  // The submission and the read-back share the rule: only the engine's included charge (Primary Line 2) zeroes the plan.
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /family\.additional\.charge === 'Free' \? 0 : plan\?\.mrcQAR \?\? 0/);
  assert.match(fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8'), /c\.additional\?\.type === 'PRIMARY_LINE_2'/);
  assert.match(fs.readFileSync('src/components/patterns/useCheckoutSummary.ts', 'utf8'), /planQar: plan\?\.rentalIncludedInPackage \? 0 : plan\?\.mrcQAR \?\? 0/);
});

test('a selection the package no longer accepts is taken out of the draft, and what stops an additional connection is said on the plan page', () => {
  const notice = fs.readFileSync('src/components/patterns/FamilyPackageNotice.tsx', 'utf8');
  assert.match(notice, /const refused = additionalContext && check\.applies && !check\.ok;/);
  assert.match(notice, /if \(refused && productId\) \{\s*setValue\('productId', undefined\);/);
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /additionalContext=\{Boolean\(familyLineContextOf\(values\)\)\}/);
  assert.match(steps, /\{k\.applies && !k\.ok && \(\s*<p role="alert" className="notice-danger pad-row mb-6">\s*\{k\.reason\}/);
});

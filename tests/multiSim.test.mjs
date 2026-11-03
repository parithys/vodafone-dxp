// Multi-SIM: the count comes only from `multiSimCount` on the plan and the selected add-ons, summed and held to 4; each gets a Free-pool number
// automatically; a Multi-SIM is never a customer's active line or a reservation; and the SIM Selection page titles itself only when they apply.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m, model;
before(async () => {
  await boot();
  m = await load('/src/engines/multiSim.ts');
  model = await load('/src/capabilities/SimType/multiSimModel.ts');
});
after(close);

const read = (p) => fs.readFileSync(p, 'utf8');
const products = JSON.parse(read('public/mock-data/products.json'));

test('a count is a stated whole number of at least 1; anything else is none (unknown stays 0)', () => {
  assert.equal(m.multiSimCountOf({ multiSimCount: 2 }), 2);
  for (const v of [undefined, null, 0, -1, 1.5, '2', NaN]) assert.equal(m.multiSimCountOf({ multiSimCount: v }), 0, String(v));
  assert.equal(m.multiSimCountOf(undefined), 0);
});

test('plan + add-ons are summed and held between 0 and 4', () => {
  const e = (plan, addons) => m.multiSimEntitlement(plan, addons);
  assert.deepEqual(e(undefined, []), { fromPlan: 0, fromAddons: 0, requested: 0, provisionable: 0 });
  assert.equal(e({ multiSimCount: 2 }, [{ multiSimCount: 1 }]).provisionable, 3, 'the example: 2 + 1 = 3');
  assert.equal(e({ multiSimCount: 3 }, [{ multiSimCount: 2 }]).provisionable, 4, 'held at 4');
  assert.equal(e({ multiSimCount: 3 }, [{ multiSimCount: 2 }]).requested, 5);
  assert.equal(e({}, [{ multiSimCount: 1 }, { multiSimCount: 2 }]).provisionable, 3);
  assert.equal(e({ multiSimCount: 1 }, [{}, { name: 'Multi SIM' }]).provisionable, 1, 'a name is not a count');
});

test('an add-on that would take the total above 4 is blocked; one that adds none, or fits, is not', () => {
  assert.equal(m.exceedsMultiSimMax({ multiSimCount: 3 }, [], { multiSimCount: 2 }), true);
  assert.equal(m.exceedsMultiSimMax({ multiSimCount: 3 }, [], { multiSimCount: 1 }), false, 'exactly 4 is allowed');
  assert.equal(m.exceedsMultiSimMax({ multiSimCount: 2 }, [{ multiSimCount: 2 }], { multiSimCount: 1 }), true);
  assert.equal(m.exceedsMultiSimMax({ multiSimCount: 4 }, [], {}), false, 'an add-on with no Multi-SIMs is never blocked');
});

test('the catalogue: only the records that state a count provide one, across the whole product set', () => {
  assert.equal(m.multiSimBenefitText({ multiSimCount: 2 }), '2 Multi-SIMs included');
  assert.equal(m.multiSimBenefitText({ multiSimCount: 1 }), '1 Multi-SIM included');
  assert.equal(m.multiSimBenefitText({ multiSimCount: 9 }), '4 Multi-SIMs included', 'held at the maximum');
  assert.equal(m.multiSimBenefitText({}), undefined);
  // The independent expectation: the two add-ons and four demo plans given a count (seeded 2026-11-03): Offers tab PROD-108 / PROD-109, Standard Plans PROD-139 / PROD-140.
  const STATED = { 'PROD-196': 1, 'PROD-197': 2, 'PROD-108': 1, 'PROD-109': 2, 'PROD-139': 2, 'PROD-140': 1 };
  const withCount = Object.fromEntries(products.filter((p) => p.multiSimCount !== undefined).map((p) => [p.productId, p.multiSimCount]));
  assert.deepEqual(withCount, STATED);
  for (const p of products) assert.equal(m.multiSimCountOf(p), STATED[p.productId] ?? 0, p.productId);
  // A product whose NAME says Multi SIM but states no count (PROD-195) provides none.
  assert.equal(m.multiSimCountOf(products.find((p) => p.productId === 'PROD-195')), 0);
});

test('Free-pool numbers: Free and AVAILABLE only, never the primary or one already given, lowest first; too few throws', () => {
  const pool = [
    { msisdn: '+97433000005', category: 'Free', status: 'AVAILABLE' },
    { msisdn: '+97433000001', category: 'Free', status: 'AVAILABLE' },
    { msisdn: '+97433000002', category: 'Free', status: 'Reserved' },
    { msisdn: '+97433000003', category: 'Free', status: 'BLOCKED' },
    { msisdn: '+97433000004', category: 'Star', status: 'AVAILABLE' },
    { msisdn: '+97433000006', category: 'Free', status: 'AVAILABLE' },
  ];
  assert.deepEqual(m.assignMultiSimMsisdns(pool, new Set(), 2), ['+97433000001', '+97433000005']);
  assert.deepEqual(m.assignMultiSimMsisdns(pool, new Set(['+97433000001']), 2), ['+97433000005', '+97433000006'], 'the primary is skipped');
  assert.deepEqual(m.assignMultiSimMsisdns(pool, new Set(), 0), []);
  assert.throws(() => m.assignMultiSimMsisdns(pool, new Set(), 4), /Not enough free numbers/);
  // The real inventory covers the maximum.
  const numbers = JSON.parse(read('public/mock-data/numbers.json'));
  const got = m.assignMultiSimMsisdns(numbers, new Set(), m.MULTI_SIM_MAX);
  assert.equal(new Set(got).size, 4);
  for (const n of got) assert.ok(numbers.some((x) => x.msisdn === n && x.category === 'Free' && x.status === 'AVAILABLE'));
});

test('the Multi-SIMs held: at most the count, complete only when all are in and provisioned, no serial twice', () => {
  const physical = (serial) => ({ simType: 'Physical', simSerial: serial, simValid: true });
  const esim = (iccid) => ({ simType: 'eSIM', esimIssued: true, simIccid: iccid });
  const values = { simType: physical('A'), multiSims: [physical('B'), esim('E1'), physical('D')] };
  assert.equal(model.multiSimsFor(values, 2).length, 2, 'trimmed to the count');
  assert.equal(model.multiSimsFor({}, 3).length, 0, 'nothing held yet');
  assert.deepEqual(model.multiSimsFor({}, 0), []);
  assert.equal(model.allMultiSimsComplete(values, 3), true);
  assert.equal(model.allMultiSimsComplete(values, 4), false, 'one more is still needed');
  assert.equal(model.allMultiSimsComplete({ ...values, multiSims: [physical('B'), { simType: 'Physical', simSerial: 'C', simValid: false }] }, 2), false, 'a serial that did not validate');
  assert.equal(model.allMultiSimsComplete({}, 0), true, 'none to provision');
  assert.equal(model.hasDuplicateSerial(values, 3), false);
  assert.equal(model.hasDuplicateSerial({ ...values, multiSims: [physical('A')] }, 1), true, 'the same serial as the primary');
  assert.equal(model.hasDuplicateSerial({ ...values, multiSims: [physical('B'), physical('B')] }, 2), true);
  assert.deepEqual(model.serialsInUse(values, 3), ['A', 'B', 'D']);
  assert.deepEqual(model.iccidsOfEsims({ simType: esim('E0'), multiSims: [physical('B'), esim('E1')] }, 2), ['E0', 'E1']);
});

test('ONE Multi-SIM panel, whatever the count: a single scanner field and eSIM action, each SIM an entry with a Remove', () => {
  const step = read('src/capabilities/SimType/step.tsx');
  assert.equal((step.match(/<MultiSimPanel/g) ?? []).length, 1);
  assert.doesNotMatch(step, /Multi-SIM \$\{i \+ 1\}|multiSimsFor\([^)]*\)\.map\(/, 'no panel per Multi-SIM');
  const panel = read('src/components/domain/MultiSimPanel.tsx');
  assert.equal((panel.match(/<SimSerialScanner/g) ?? []).length, 1, 'one barcode field');
  assert.equal((panel.match(/Select eSIM'/g) ?? []).length, 1, 'one Select eSIM');
  assert.match(panel, /Remove/);
  assert.match(panel, /SIM Type/);
  assert.match(panel, /SIM Serial Number/);
  // Physical and eSIM entries share the one count; a full panel takes no more.
  assert.match(panel, /const full = value\.length >= count/);
  assert.match(panel, /disabled=\{full\}/);
  assert.match(panel, /if \(latest\.current\.length >= count\) return;/);
});

test('the SIM Selection page is titled "Primary SIM Selection" only when Multi-SIMs apply', async () => {
  const src = read('src/capabilities/SimType/step.tsx');
  assert.match(src, /headingFor: \(values\) => \(multiCount\(values\) > 0 \? 'Primary SIM Selection' : undefined\)/);
  assert.match(src, /Multi-SIM Selection/);
  const header = read('src/components/patterns/wizard/WizardStepHeader.tsx');
  assert.match(header, /currentStep\?\.headingFor\?\.\(values\)\) \?\? currentStep\?\.heading \?\? currentStep\?\.label/);
  // The step label (the rail and the summary) keeps the one name.
  assert.match(read('src/data/stepLabels.ts'), /SIM_TYPE_LABEL = 'SIM Selection'/);
  // New Postpaid is the journey that passes a count.
  assert.match(read('src/modules/new-connection/postpaidSteps.tsx'), /multiSimCount: multiSimCountFor\(products\)/);
});

test('no step is ever valid with an unprovisioned Multi-SIM, and the numbers are never shown to the agent', () => {
  const step = read('src/capabilities/SimType/step.tsx');
  assert.match(step, /allMultiSimsComplete\(values, multiCount\(values\)\) \|\| hasDuplicateSerial/);
  // Nothing in the journey's UI reads an assigned number: only the submit writes them, onto the Multi-SIM lines.
  for (const f of ['src/capabilities/SimType/step.tsx', 'src/capabilities/SimType/summary.ts', 'src/capabilities/SimType/multiSimModel.ts']) assert.doesNotMatch(read(f), /secondaryMsisdn|assignMultiSimMsisdns/, f);
  const submit = read('src/modules/new-connection/submitNewConnectionOrder.ts');
  assert.match(submit, /assignMultiSimMsisdns\(/);
  // Not a customer's line and not a reservation: no customerId, no Reserved status written.
  const lineBlock = submit.slice(submit.indexOf("createRecord('multi-sim-lines'"), submit.indexOf("createRecord('multi-sim-lines'") + 700);
  assert.doesNotMatch(lineBlock, /customerId/);
  assert.doesNotMatch(lineBlock, /Reserved/);
});

test('add-ons a Multi-SIM maximum blocks cannot be selected (picker and panel)', () => {
  const picker = read('src/capabilities/AddonsSelection/AddonsPicker.tsx');
  assert.match(picker, /exceedsMultiSimMax\(multiSimPlan,/);
  assert.match(picker, /if \(!removing && candidate && multiSimBlocked\(candidate\)\) return;/);
  assert.match(read('src/components/patterns/PostpaidAddonsPanel.tsx'), /multiSimPlan=\{selectedPlan\}/);
});

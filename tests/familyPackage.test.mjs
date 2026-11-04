// Family Package rules. Primary Line 1 first and approved; after it Second Primary, Supplementary and Secondary in ANY order, held only by their limits
// (Primary 2, Supplementary 2, Secondary unlimited). Plans: Primary lines on the package's Ahli plan, Supplementary on the Supplementary plan, Secondary on a
// Secondary plan the agent chooses (Ahli Lite, Ahli Net).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let fp;
before(async () => {
  await boot();
  fp = await load('/src/engines/familyPackage.ts');
});
after(close);

const read = (f) => JSON.parse(fs.readFileSync(`public/mock-data/${f}.json`, 'utf8'));
const products = read('products');
const ln = (role, sequence, planId = 'PROD-143', orderId = `ORD-${role}-${sequence}`) => ({ lineId: `L-${role}-${sequence}`, packageId: 'P', customerId: 'C', role, sequence, planId, orderId });
const ord = (orderId, approvalStatus, status = 'Open') => ({ orderId, approvalStatus, status });
const APPROVED = ord('ORD-Primary-1', 'Approved');
/** The catalogue as the real products file gives it, and one with nothing to put extra lines on. */
const CAT = () => fp.lineCatalogueOf(products);
const NO_EXTRA = {};

test('the catalogue holds the extra-line plans from the Extra Lines sheet, unlisted, in their own classes', () => {
  const by = (cls) => products.filter((p) => p.planClass === cls);
  assert.deepEqual(by('Postpaid Supplementary Plans').map((p) => [p.name, p.mrcQAR]), [['Postpaid Ahli Plus / Pro / Premium / Platinum Member Promotion', 199]]);
  assert.deepEqual(by('Postpaid Secondary Plans').map((p) => [p.name, p.mrcQAR]), [['Postpaid Ahli Lite Member Promotion', 65], ['Postpaid Ahli Net Member Promotion', 99]]);
  for (const p of [...by('Postpaid Supplementary Plans'), ...by('Postpaid Secondary Plans')]) assert.equal(p.listed, false, `${p.productId} is not sold on its own`);
  assert.deepEqual(CAT(), { supplementaryPlanId: 'PROD-311', secondaryPlanIds: ['PROD-310', 'PROD-312'] });
});

test('an empty package takes Primary Line 1 only; the plan is the agent\'s choice', () => {
  assert.deepEqual(fp.canAddLine([], [], 'Primary', CAT()), { ok: true, role: 'Primary', sequence: 1, planId: undefined });
  for (const role of ['Supplementary', 'Secondary']) assert.equal(fp.canAddLine([], [], role, CAT()).ok, false, role);
});

test('nothing opens until Primary Line 1\'s order is approved: pending, returned, rejected, draft, a missing order and a not-yet-complete "Not Required" all keep it closed', () => {
  const lines = [ln('Primary', 1)];
  const closed = [ord('ORD-Primary-1', 'Pending Approval'), ord('ORD-Primary-1', 'Pending Store Manager'), ord('ORD-Primary-1', 'Pending Credit Control'), ord('ORD-Primary-1', 'Returned'), ord('ORD-Primary-1', 'Rejected'), ord('ORD-Primary-1', 'Not Required', 'Draft'), ord('ORD-Primary-1', undefined)];
  for (const o of closed) for (const role of fp.FAMILY_ROLES) assert.equal(fp.canAddLine(lines, [o], role, CAT()).ok, false, `${o.approvalStatus}/${o.status} ${role}`);
  for (const role of fp.FAMILY_ROLES) assert.equal(fp.canAddLine(lines, [], role, CAT()).ok, false, `no order ${role}`);
  assert.equal(fp.canAddLine([ln('Primary', 1), ln('Secondary', 1)], [ord('ORD-Secondary-1', 'Approved')], 'Secondary', CAT()).ok, false, 'another line\'s approval does not open it');
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Supplementary', CAT()).ok, true);
  assert.equal(fp.canAddLine(lines, [ord('ORD-Primary-1', 'Not Required', 'Complete')], 'Supplementary', CAT()).ok, true);
});

test('each added line is on the plan its type is on: Second Primary the package\'s, Supplementary the Supplementary plan, Secondary the agent\'s choice', () => {
  const lines = [ln('Primary', 1, 'PROD-144')];
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Primary', CAT()).planId, 'PROD-144');
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Supplementary', CAT()).planId, 'PROD-311');
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Secondary', CAT()).planId, undefined);
  assert.equal(fp.packagePlanId(lines), 'PROD-144');
  assert.equal(fp.packagePlanId([ln('Primary', 2)]), undefined, 'Primary Line 2 alone does not set the plan');
});

test('limits: Primary 2, Supplementary 2, Secondary unlimited; numbering continues from the highest', () => {
  assert.deepEqual(fp.FAMILY_ROLE_LIMITS, { Primary: 2, Supplementary: 2, Secondary: null });
  const base = [ln('Primary', 1)];
  assert.equal(fp.canAddLine(base, [APPROVED], 'Primary', CAT()).sequence, 2);
  assert.equal(fp.canAddLine([...base, ln('Primary', 2)], [APPROVED], 'Primary', CAT()).ok, false);
  assert.equal(fp.canAddLine([...base, ln('Supplementary', 1), ln('Supplementary', 2)], [APPROVED], 'Supplementary', CAT()).ok, false);
  const many = [...base, ...Array.from({ length: 25 }, (_, i) => ln('Secondary', i + 1))];
  const next = fp.canAddLine(many, [APPROVED], 'Secondary', CAT());
  assert.ok(next.ok);
  assert.equal(next.sequence, 26);
  assert.equal(fp.lineLabel({ role: 'Secondary', sequence: 3 }), 'Secondary Line 3');
});

test('packageViolations flags a Primary line on another plan, a missing Primary Line 1, an over-limit role and gapped numbering', () => {
  assert.deepEqual(fp.packageViolations([]), []);
  assert.deepEqual(fp.packageViolations([ln('Primary', 1), ln('Secondary', 1, 'PROD-310'), ln('Supplementary', 1, 'PROD-311')]), []);
  assert.equal(fp.packageViolations([ln('Primary', 1, 'PROD-143'), ln('Primary', 2, 'PROD-142')]).length, 1);
  assert.equal(fp.packageViolations([ln('Secondary', 1)]).length, 1);
  assert.ok(fp.packageViolations([ln('Primary', 1), ln('Supplementary', 1), ln('Supplementary', 2), ln('Supplementary', 3)]).some((v) => /exceed/.test(v)));
  assert.ok(fp.packageViolations([ln('Primary', 1), ln('Secondary', 2)]).some((v) => /numbers/.test(v)));
});

test('the seeded packages obey the rules, over the whole data file: each line is on a plan of its type\'s class, its order exists and is the customer\'s, Primary lines share the package plan', () => {
  const lines = read('family-package-lines');
  const byId = new Map(products.map((p) => [p.productId, p]));
  const orders = new Map(read('orders').map((o) => [o.orderId, o]));
  const CLASS = { Primary: 'Postpaid Family Plans', Supplementary: 'Postpaid Supplementary Plans', Secondary: 'Postpaid Secondary Plans' };
  const customers = new Set(lines.map((l) => l.customerId));
  assert.ok(customers.size >= 2);
  for (const l of lines) {
    assert.equal(byId.get(l.planId)?.planClass, CLASS[l.role], l.lineId);
    assert.equal(orders.get(l.orderId)?.customerId, l.customerId, l.lineId);
    assert.deepEqual(orders.get(l.orderId)?.productIds, [l.planId], l.lineId);
  }
  for (const c of customers) {
    const own = lines.filter((l) => l.customerId === c);
    assert.deepEqual(fp.packageViolations(own), [], c);
    const os = own.map((l) => orders.get(l.orderId));
    const open = fp.primaryLine1Activated(own, os);
    assert.equal(fp.connectionOptions(own, os, CAT()).length > 0, open, c);
  }
  assert.equal(fp.primaryLine1Activated(lines.filter((l) => l.customerId === 'CUST-1001'), [...orders.values()]), true);
  assert.equal(fp.primaryLine1Activated(lines.filter((l) => l.customerId === 'CUST-3084'), [...orders.values()]), false);
});

// ---- Primary Line 1: the New Postpaid journey with a Family Plan -------------------------------------------------------------------------------
const plan = (id) => products.find((p) => p.productId === id);

test('familyStartCheck: only a Family Plan applies; it starts Primary Line 1 when eligibility is clear and the customer holds no package', () => {
  assert.deepEqual(fp.familyStartCheck({ plan: plan('PROD-143'), eligibilityCleared: true, customerLines: [] }), { applies: true, ok: true, lineLabel: 'Primary Line 1', planId: 'PROD-143' });
  assert.equal(fp.familyStartCheck({ plan: plan('PROD-143'), eligibilityCleared: false, customerLines: [] }).kind, 'eligibility');
  assert.equal(fp.familyStartCheck({ plan: plan('PROD-143'), eligibilityCleared: true, customerLines: [ln('Primary', 1)] }).kind, 'package');
  assert.deepEqual(fp.familyStartCheck({ plan: undefined, eligibilityCleared: true, customerLines: [] }), { applies: false });
});

test('over the whole catalogue: the start rule applies to exactly the four Ahli plans, and to no other plan, extra-line plan, add-on or product', () => {
  const family = products.filter((p) => p.planClass === 'Postpaid Family Plans').map((p) => p.productId).sort();
  const applies = products.filter((p) => fp.familyStartCheck({ plan: p, eligibilityCleared: true, customerLines: [] }).applies).map((p) => p.productId).sort();
  assert.deepEqual(applies, family);
  assert.deepEqual(family, ['PROD-142', 'PROD-143', 'PROD-144', 'PROD-145']);
  for (const p of products.filter((x) => !family.includes(x.productId))) {
    for (const eligibilityCleared of [true, false]) assert.deepEqual(fp.familyStartCheck({ plan: p, eligibilityCleared, customerLines: [ln('Primary', 1)] }), { applies: false }, p.productId);
  }
});

test('the extra-line plans never reach the normal plan lists: unlisted, so Offers, Standard Plans and the search skip them', () => {
  const listed = products.filter((p) => p.type === 'Postpaid Plan' && p.listed !== false).map((p) => p.planClass);
  assert.equal(listed.includes('Postpaid Supplementary Plans'), false);
  assert.equal(listed.includes('Postpaid Secondary Plans'), false);
  assert.match(fs.readFileSync('src/components/patterns/usePostpaidPlanAddons.ts', 'utf8'), /p\.listed !== false/);
});

test('a customer\'s lines are found by their record or, with none, by the ID they were identified with; nobody known finds nothing', () => {
  const lines = [{ ...ln('Primary', 1), customerId: 'CUST-A' }, { ...ln('Primary', 1), lineId: 'x', customerId: undefined, idNumber: '123' }, { ...ln('Primary', 1), lineId: 'y', customerId: 'CUST-B' }];
  assert.deepEqual(fp.linesOfCustomer(lines, { customerId: 'CUST-A' }).map((l) => l.lineId), ['L-Primary-1']);
  assert.deepEqual(fp.linesOfCustomer(lines, { idNumber: '123' }).map((l) => l.lineId), ['x']);
  assert.deepEqual(fp.linesOfCustomer(lines, {}), []);
  assert.equal(fp.linesOfCustomer(lines, { customerId: 'CUST-A', idNumber: '123' }).length, 2);
});

test('the journey reads the check from its own values: the selected plan, the eligibility result and the identified customer', async () => {
  const { familyStartFor } = await load('/src/modules/new-connection/familyStart.ts');
  const catalogue = products.map((p) => ({ productId: p.productId, name: p.name, mrcQAR: p.mrcQAR, planClass: p.planClass }));
  const clear = { customerId: 'CUST-9', hardStop: false, softStop: false };
  const values = (over = {}) => ({ productId: 'PROD-143', eligibility: clear, contact: { idNumber: '555' }, ...over });
  assert.equal(familyStartFor(values(), catalogue, []).ok, true);
  assert.equal(familyStartFor(values({ productId: 'PROD-108' }), catalogue, []).applies, false);
  assert.equal(familyStartFor(values({ productId: undefined }), catalogue, []).applies, false);
  for (const eligibility of [undefined, { ...clear, hardStop: true }, { ...clear, softStop: true }]) assert.equal(familyStartFor(values({ eligibility }), catalogue, []).kind, 'eligibility');
  assert.equal(familyStartFor(values(), catalogue, [{ ...ln('Primary', 1), customerId: 'CUST-9' }]).kind, 'package');
  assert.equal(familyStartFor(values(), catalogue, [{ ...ln('Primary', 1), customerId: undefined, idNumber: '555' }]).kind, 'package');
  assert.equal(familyStartFor(values(), catalogue, [{ ...ln('Primary', 1), customerId: 'CUST-OTHER' }]).ok, true);
});

test('wiring: the plan page holds a blocked Family Plan and passes over an accepted offer only for a plan that is not one; submission re-checks and writes the line with the number', () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /offerAccepted\(values\) && !family\(values\)\.applies/);
  assert.match(steps, /canContinue/);
  assert.match(steps, /familyRows/);
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /if \(family\.applies && !family\.ok\) throw new Error\(family\.reason\)/);
  assert.match(submit, /createRecord\('family-package-lines', \{[\s\S]*role: family\.additional\?\.role \?\? 'Primary',[\s\S]*sequence: family\.additional\?\.sequence \?\? 1,[\s\S]*planId: family\.planId,[\s\S]*orderId,[\s\S]*msisdn: values\.msisdn/);
  const done = fs.readFileSync('src/components/patterns/ActivationCompleteScreen.tsx', 'utf8');
  assert.match(done, /order\.familyPackage && !order\.pendingApproval && order\.customerId && onAddConnection/, 'Add Another Connection only once the line is activated');
});

test('Customer 360 never adds a line itself: an empty package starts the New Postpaid journey, a package with lines opens Add Another Connection', () => {
  const panel = fs.readFileSync('src/workspace/customer360/sections/FamilyPackagePanel.tsx', 'utf8');
  assert.match(panel, /Start Family Package/);
  assert.match(panel, /AddConnectionModal/);
  assert.doesNotMatch(panel, /createRecord/, 'no order is written from Customer 360: the journey does it');
});

// ---- Add Another Connection: any eligible type after Primary Line 1, in any order ---------------------------------------------------------------
/** Independent of the engine: what a package holding these counts allows. */
const allowedByCounts = (counts, type) => (type === 'Primary' ? counts.Primary < 2 : type === 'Supplementary' ? counts.Supplementary < 2 : true);

test('connectionOptions: none before Primary Line 1 is approved; then every type with room, recalculated from the lines each time', () => {
  assert.deepEqual(fp.connectionOptions([], [], CAT()), []);
  assert.deepEqual(fp.connectionOptions([ln('Primary', 1)], [ord('ORD-Primary-1', 'Pending Approval')], CAT()), []);
  const lines = [ln('Primary', 1)];
  assert.deepEqual(fp.connectionOptions(lines, [APPROVED], CAT()).map((o) => [o.label, o.lineLabel]), [['Second Primary', 'Primary Line 2'], ['Supplementary', 'Supplementary Line 1'], ['Secondary', 'Secondary Line 1']]);
  assert.deepEqual(fp.connectionOptions([...lines, ln('Primary', 2)], [APPROVED], CAT()).map((o) => o.role), ['Supplementary', 'Secondary'], 'Second Primary goes once Primary Line 2 exists');
  assert.deepEqual(fp.connectionOptions([...lines, ln('Supplementary', 1)], [APPROVED], CAT()).map((o) => o.role), ['Primary', 'Supplementary', 'Secondary']);
  assert.deepEqual(fp.connectionOptions([...lines, ln('Supplementary', 1), ln('Supplementary', 2)], [APPROVED], CAT()).map((o) => o.role), ['Primary', 'Secondary'], 'Supplementary goes at 2');
  assert.deepEqual(fp.connectionOptions([...lines, ln('Primary', 2), ln('Supplementary', 1), ln('Supplementary', 2)], [APPROVED], CAT()).map((o) => o.role), ['Secondary'], 'a limit on one type leaves the others');
});

test('Supplementary and Secondary are offered only while the catalogue has a plan to put them on: never assumed, never invented', () => {
  const lines = [ln('Primary', 1)];
  assert.deepEqual(fp.connectionOptions(lines, [APPROVED], NO_EXTRA).map((o) => o.role), ['Primary']);
  assert.deepEqual(fp.connectionOptions(lines, [APPROVED], { supplementaryPlanId: 'PROD-311' }).map((o) => o.role), ['Primary', 'Supplementary']);
  assert.deepEqual(fp.connectionOptions(lines, [APPROVED], { secondaryPlanIds: ['PROD-310'] }).map((o) => o.role), ['Primary', 'Secondary']);
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Secondary', { secondaryPlanIds: [] }).ok, false, 'the business rule refuses it too, not only the list');
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Supplementary', NO_EXTRA).ok, false);
});

test('no mandatory order after Primary Line 1: every sequence of types is allowed exactly when the counts allow it (the eight scenarios and all the rest)', () => {
  const TYPES = ['Primary', 'Supplementary', 'Secondary'];
  let sequences = 0;
  const walk = (lines, counts, depth) => {
    for (const type of TYPES) {
      const check = fp.canAddLine(lines, [APPROVED], type, CAT());
      assert.equal(check.ok, allowedByCounts(counts, type), `${lines.map(fp.lineLabel).join(' > ')} then ${type}`);
      if (!check.ok) continue;
      assert.equal(fp.connectionOptions(lines, [APPROVED], CAT()).some((o) => o.role === type), true);
      assert.equal(check.sequence, counts[type] + 1);
      sequences += 1;
      if (depth < 5) walk([...lines, ln(type, check.sequence)], { ...counts, [type]: counts[type] + 1 }, depth + 1);
    }
  };
  walk([ln('Primary', 1)], { Primary: 1, Supplementary: 0, Secondary: 0 }, 0);
  assert.ok(sequences > 100);
  const scenarios = [['Primary'], ['Supplementary'], ['Secondary'], ['Supplementary', 'Primary'], ['Secondary', 'Primary'], ['Supplementary', 'Supplementary'], ['Supplementary', 'Secondary', 'Primary'], ['Primary', 'Supplementary', 'Supplementary', 'Secondary']];
  for (const seq of scenarios) {
    let lines = [ln('Primary', 1)];
    for (const type of seq) {
      const c = fp.canAddLine(lines, [APPROVED], type, CAT());
      assert.ok(c.ok, `${seq.join(' > ')} at ${type}`);
      lines = [...lines, ln(type, c.sequence, c.planId ?? 'PROD-310')];
    }
    assert.deepEqual(fp.packageViolations(lines), [], seq.join(' > '));
  }
});

test('a line added to an existing package is judged by the same rule as the list, on the plan its type is on, and refused when it is not allowed', () => {
  const pkg = [ln('Primary', 1, 'PROD-143')];
  const base = { packageId: 'P', eligibilityCleared: true, packageLines: pkg, orders: [APPROVED], catalogue: CAT() };
  assert.deepEqual(fp.familyAdditionalCheck({ ...base, role: 'Supplementary' }), { applies: true, ok: true, lineLabel: 'Supplementary Line 1', planId: 'PROD-311', additional: { packageId: 'P', role: 'Supplementary', sequence: 1 } });
  const second = fp.familyAdditionalCheck({ ...base, role: 'Primary' });
  assert.equal(second.additional.sequence, 2);
  assert.equal(second.planId, 'PROD-143', 'Second Primary is on the package plan');
  // Secondary: no plan until the agent picks one of the Secondary plans; any other plan is no plan.
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Secondary' }).planId, undefined);
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Secondary', chosenPlanId: 'PROD-312' }).planId, 'PROD-312');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Secondary', chosenPlanId: 'PROD-143' }).planId, undefined, 'an Ahli plan is not a Secondary plan');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Supplementary', eligibilityCleared: false }).kind, 'eligibility');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Supplementary', packageLines: [] }).kind, 'package');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Supplementary', orders: [ord('ORD-Primary-1', 'Pending Approval')] }).ok, false, 'Primary Line 1 not approved');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Primary', packageLines: [...pkg, ln('Primary', 2)] }).ok, false, 'Second Primary once Primary Line 2 exists');
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Supplementary', packageLines: [...pkg, ln('Supplementary', 1), ln('Supplementary', 2)] }).ok, false);
  assert.equal(fp.familyAdditionalCheck({ ...base, role: 'Secondary', catalogue: NO_EXTRA }).ok, false);
});

test('the journey takes the connection type from its draft: the line joins the customer\'s own package on its type\'s plan, whatever plan is selected', async () => {
  const { familyStartFor, familyLineContextOf } = await load('/src/modules/new-connection/familyStart.ts');
  const catalogue = products.map((p) => ({ productId: p.productId, name: p.name, mrcQAR: p.mrcQAR, planClass: p.planClass }));
  const pkg = { ...ln('Primary', 1, 'PROD-143'), packageId: 'FPK-X', customerId: 'CUST-9' };
  const values = (over = {}) => ({ familyLine: { packageId: 'FPK-X', role: 'Supplementary' }, productId: 'PROD-108', eligibility: { customerId: 'CUST-9' }, contact: { idNumber: '1' }, ...over });
  const r = familyStartFor(values(), catalogue, [pkg], [APPROVED]);
  assert.equal(r.ok, true);
  assert.equal(r.planId, 'PROD-311', 'the Supplementary plan, not the one selected');
  assert.equal(r.lineLabel, 'Supplementary Line 1');
  assert.equal(familyStartFor(values({ familyLine: { packageId: 'FPK-X', role: 'Primary' } }), catalogue, [pkg], [APPROVED]).planId, 'PROD-143');
  assert.equal(familyStartFor(values({ familyLine: { packageId: 'FPK-X', role: 'Secondary' }, productId: 'PROD-310' }), catalogue, [pkg], [APPROVED]).planId, 'PROD-310');
  assert.equal(familyStartFor(values({ familyLine: { packageId: 'FPK-X', role: 'Secondary' } }), catalogue, [pkg], [APPROVED]).planId, undefined, 'a Secondary plan has to be chosen');
  assert.equal(familyStartFor(values({ familyLine: { packageId: 'FPK-OTHER', role: 'Supplementary' } }), catalogue, [pkg], [APPROVED]).ok, false, 'a package that is not this customer\'s');
  assert.equal(familyStartFor(values({ eligibility: { customerId: 'CUST-8' } }), catalogue, [pkg], [APPROVED]).ok, false, 'another customer\'s lines are not this one\'s');
  assert.equal(familyLineContextOf({}), undefined);
  assert.equal(familyLineContextOf({ familyLine: { packageId: 'P', role: 'Primary' } }).role, 'Primary');
});

test('wiring: Add Another Connection reads the package on every opening, rechecks on Continue, and the journey starts it from Customer Verification with no new package', () => {
  const modal = fs.readFileSync('src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'utf8');
  assert.match(modal, /props\.open \? <AddConnectionDialog/, 'mounted per opening, so never stale');
  assert.match(modal, /const fresh = await readPackage\(customerId\)/, 'read again on Continue');
  assert.match(modal, /connectionOptions\(/);
  const wizard = fs.readFileSync('src/modules/new-connection/NewConnectionWizard.tsx', 'utf8');
  assert.match(wizard, /startFresh: true, familyLine/);
  assert.match(wizard, /initialProductProp \?\? \(familyLine \? 'postpaid'/);
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /family\.additional \? family\.additional\.packageId : `FPK-/, 'a line joins the existing package; only Primary Line 1 makes a new one');
  assert.match(submit, /!family\.planId \|\| values\.productId !== family\.planId\)\) throw/);
});

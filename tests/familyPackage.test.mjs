// Family Package rules. Primary Line 1 first and approved, then Primary Line 2 (the same package and plan, included), then - both Primary Lines active - additional
// connections BY THE PLAN SELECTED: the Family-equivalent plan makes a Supplementary line, a Secondary plan (Ahli Lite, Ahli Net) a Secondary line. The state model itself is tested in
// familyModel.test.mjs; this file covers the catalogue, the seeded data, the journey wiring and the surrounding rules.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

// The journey modules load the capability barrel, which wants a window.
globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

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

test('the catalogue holds the extra-line plans from the Extra Lines sheet, unlisted, in their own classes; both Secondary plans are Secondary-eligible', () => {
  const by = (cls) => products.filter((p) => p.planClass === cls);
  assert.deepEqual(by('Postpaid Supplementary Plans').map((p) => [p.name, p.mrcQAR]), [['Postpaid Ahli Plus / Pro / Premium / Platinum Member Promotion', 199]]);
  assert.deepEqual(by('Postpaid Secondary Plans').map((p) => [p.name, p.mrcQAR]), [['Postpaid Ahli Lite Member Promotion', 65], ['Postpaid Ahli Net Member Promotion', 99]]);
  for (const p of [...by('Postpaid Supplementary Plans'), ...by('Postpaid Secondary Plans')]) assert.equal(p.listed, false, `${p.productId} is not sold on its own`);
  // The Secondary plans are the catalogue's Secondary class: Ahli Lite (the Kids Plan) and Ahli Net (the Data-only Plan).
  assert.deepEqual(CAT(), { supplementaryPlanId: 'PROD-311', secondaryPlanIds: ['PROD-310', 'PROD-312'] });
});

test('an empty package takes Primary Line 1 only; the plan is the agent\'s choice', () => {
  assert.deepEqual(fp.canAddLine([], [], 'Primary', CAT()), { ok: true, role: 'Primary', sequence: 1, planId: undefined });
  for (const role of ['Supplementary', 'Secondary']) assert.equal(fp.canAddLine([], [], role, CAT()).ok, false, role);
});

test('nothing opens until Primary Line 1\'s order is approved: pending, returned, rejected, draft, a missing order and a not-yet-complete "Not Required" all keep it closed', () => {
  const lines = [ln('Primary', 1)];
  const closed = [ord('ORD-Primary-1', 'Pending Approval'), ord('ORD-Primary-1', 'Pending Store Manager'), ord('ORD-Primary-1', 'Pending Credit Control'), ord('ORD-Primary-1', 'Returned'), ord('ORD-Primary-1', 'Rejected'), ord('ORD-Primary-1', 'Draft'), ord('ORD-Primary-1', 'Not Required', 'Submitted for Approval')];
  for (const o of closed) for (const role of fp.FAMILY_ROLES) assert.equal(fp.canAddLine(lines, [o], role, CAT()).ok, false, `${o.approvalStatus}/${o.status} ${role}`);
  for (const role of fp.FAMILY_ROLES) assert.equal(fp.canAddLine(lines, [], role, CAT()).ok, false, `no order ${role}`);
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Primary', CAT()).ok, true, 'approved: Primary Line 2 opens');
  assert.equal(fp.canAddLine(lines, [ord('ORD-Primary-1', 'Not Required', 'Complete')], 'Primary', CAT()).ok, true);
});

test('each added line is on the plan it is derived from: Primary Line 2 the package\'s, Supplementary the Family-equivalent plan, Secondary the plan selected', () => {
  const lines = [ln('Primary', 1, 'PROD-144')];
  assert.equal(fp.canAddLine(lines, [APPROVED], 'Primary', CAT()).planId, 'PROD-144');
  const both = [...lines, ln('Primary', 2, 'PROD-144')];
  const orders = [APPROVED, ord('ORD-Primary-2', 'Approved')];
  assert.equal(fp.canAddLine(both, orders, 'Supplementary', CAT()).planId, 'PROD-311');
  assert.equal(fp.canAddLine(both, orders, 'Secondary', CAT()).planId, undefined, 'two Secondary plans: the agent selects');
  assert.equal(fp.canAddLine(both, orders, 'Secondary', { secondaryPlanIds: ['PROD-312'] }).planId, 'PROD-312');
  assert.equal(fp.packagePlanId(lines), 'PROD-144');
});

test('limits: Primary 2, Supplementary 2, Secondary unlimited; numbering continues from the highest', () => {
  assert.deepEqual(fp.FAMILY_ROLE_LIMITS, { Primary: 2, Supplementary: 2, Secondary: null });
  const base = [ln('Primary', 1)];
  const both = [...base, ln('Primary', 2)];
  const orders = [APPROVED, ord('ORD-Primary-2', 'Approved')];
  assert.equal(fp.canAddLine(base, [APPROVED], 'Primary', CAT()).sequence, 2);
  assert.equal(fp.canAddLine(both, orders, 'Primary', CAT()).ok, false);
  assert.equal(fp.canAddLine([...both, ln('Supplementary', 1), ln('Supplementary', 2)], orders, 'Supplementary', CAT()).ok, false);
  const many = [...both, ...Array.from({ length: 25 }, (_, i) => ln('Secondary', i + 1))];
  const next = fp.canAddLine(many, orders, 'Secondary', CAT());
  assert.ok(next.ok);
  assert.equal(next.sequence, 26);
  assert.equal(fp.lineLabel({ role: 'Secondary', sequence: 3 }), 'Secondary Line 3');
});

test('packageViolations flags a Primary line on another plan, a missing Primary Line 1, an additional line before Primary Line 2, an over-limit role and gapped numbering', () => {
  assert.deepEqual(fp.packageViolations([]), []);
  assert.deepEqual(fp.packageViolations([ln('Primary', 1), ln('Primary', 2), ln('Secondary', 1, 'PROD-312'), ln('Supplementary', 1, 'PROD-311')]), []);
  assert.equal(fp.packageViolations([ln('Primary', 1, 'PROD-143'), ln('Primary', 2, 'PROD-142')]).length, 1);
  assert.equal(fp.packageViolations([ln('Secondary', 1)]).length, 1);
  assert.ok(fp.packageViolations([ln('Primary', 1), ln('Supplementary', 1)]).some((v) => /before Primary Line 2/.test(v)), 'an additional line before Primary Line 2');
  assert.ok(fp.packageViolations([ln('Primary', 1), ln('Primary', 2), ln('Supplementary', 1), ln('Supplementary', 2), ln('Supplementary', 3)]).some((v) => /exceed/.test(v)));
  assert.ok(fp.packageViolations([ln('Primary', 1), ln('Primary', 2), ln('Secondary', 2)]).some((v) => /numbers/.test(v)));
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
    // Independent expectation: something can be added when Primary Line 1 is active and Primary Line 2 is either not yet taken or is itself active (the Net/Data plan is unlimited).
    const p2 = own.find((l) => l.role === 'Primary' && l.sequence === 2);
    const p2Active = p2 ? fp.isOrderApproved(orders.get(p2.orderId)) : undefined;
    assert.equal(fp.connectionOptions(own, os, CAT()).length > 0, open && (p2 === undefined || p2Active), c);
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
  assert.match(submit, /createRecord\('family-package-lines', \{[\s\S]*role: familyDerived\?\.role \?\? 'Primary',[\s\S]*sequence: familyDerived\?\.sequence \?\? 1,[\s\S]*lineType: familyDerived\?\.type \?\? 'PRIMARY_LINE_1',[\s\S]*planId: family\.planId,[\s\S]*orderId,[\s\S]*msisdn: values\.msisdn/);
  const done = fs.readFileSync('src/components/patterns/ActivationCompleteScreen.tsx', 'utf8');
  assert.match(done, /order\.familyPackage && !order\.pendingApproval && order\.customerId && onAddConnection/, 'Add Another Connection only once the line is activated');
});

test('Customer 360 never adds a line itself: an empty package starts the New Postpaid journey, a package with lines opens Add Another Connection', () => {
  const panel = fs.readFileSync('src/workspace/customer360/sections/FamilyPackagePanel.tsx', 'utf8');
  assert.match(panel, /Start Family Package/);
  assert.match(panel, /AddConnectionModal/);
  assert.doesNotMatch(panel, /createRecord\('(orders|family-package-lines)'/, 'no order or line is written from Customer 360: the journey does it');
});

// ---- Add Another Connection: any eligible type after Primary Line 1, in any order ---------------------------------------------------------------
test('wiring: Add Another Connection reads the package on every opening, rechecks on Continue, asks for no connection type, and the journey starts it from Customer Verification with no new package', () => {
  const modal = fs.readFileSync('src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'utf8');
  assert.match(modal, /props\.open \? <AddConnectionDialog/, 'mounted per opening, so never stale');
  assert.match(modal, /const fresh = await readPackage\(customerId\)/, 'read again on Continue');
  assert.match(modal, /fresh\.nextAction !== pkg\.nextAction/, 'a package that changed meanwhile is not started from a stale screen');
  assert.doesNotMatch(modal, /role="radiogroup"|type="radio"|Second Primary/, 'no connection-type choice');
  assert.match(modal, /onStart\(\{ packageId: fresh\.packageId \}\)/, 'only the package is handed on: the type is derived');
  const wizard = fs.readFileSync('src/modules/new-connection/NewConnectionWizard.tsx', 'utf8');
  assert.match(wizard, /startFresh: true, familyLine/);
  assert.match(wizard, /initialProductProp \?\? \(familyLine \? 'postpaid'/);
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /family\.additional \? family\.additional\.packageId : `FPK-/, 'a line joins the existing package; only Primary Line 1 makes a new one');
  assert.match(submit, /!family\.planId \|\| values\.productId !== family\.planId\)\) throw/);
  assert.match(submit, /family\.additional\?\.pending\) throw new Error\('Select the plan/);
});

// ---- A new customer's first Family Package line creates their Customer 360 record --------------------------------------------------------------------
test('a newly identified customer: the records built for them carry what Customer Verification captured, and nothing that was not', async () => {
  const m = await load('/src/modules/new-connection/newCustomerRecords.ts');
  const moi = { name: 'Farhan Aslam Javed Chaudhry', firstName: 'Farhan', middleName: 'Aslam Javed', lastName: 'Chaudhry', dob: '1993-03-05', nationality: 'Pakistani', gender: 'Male', expiryDate: '2030-10-31', isNewCustomer: true, mobile: '5******1' };
  const contact = { idType: 'QID', idNumber: '29303051200106', email: 'f@example.qa', personalMobile: '+97455678901', moiResult: moi };
  const eligibility = { nationality: 'Pakistani', segment: 'Consumer (HRN)' };
  const r = m.buildNewCustomerRecords('CUST-777001', contact, eligibility, new Date('2026-11-04T10:00:00Z'));
  assert.equal(r.customer.customerId, 'CUST-777001');
  assert.equal(r.customer.qid, '29303051200106');
  assert.equal(r.customer.segment, 'Consumer (HRN)');
  assert.equal(r.customer.phone, '+97455678901', 'the captured mobile, not the registry\'s masked one');
  assert.equal(r.customer.moiValidationStatus, 'Verified');
  assert.equal('segment' in m.buildNewCustomerRecords('CUST-1', contact, undefined).customer, false, 'no segment judged: none recorded');
  assert.equal('preferredLanguage' in r.customer, false, 'not captured: left off, not defaulted');
  assert.deepEqual([r.document.customerId, r.document.documentType, r.document.documentNumber, r.document.expiryDate], ['CUST-777001', 'QID', '29303051200106', '2030-10-31']);
  assert.equal(r.contact.contactRecordId, 'CTC-CUST-777001');
  assert.equal(r.contact.cellNumber, '+97455678901');
  // An identity the agent typed is not claimed as registry-verified.
  const typed = m.buildNewCustomerRecords('CUST-2', { ...contact, moiResult: { ...moi, createdByAgent: true } }, eligibility);
  assert.equal('moiValidationStatus' in typed.customer, false);
  assert.equal(typed.document.status, 'Captured');
  // Only a customer with no record is newly identified.
  assert.equal(m.isNewlyIdentifiedCustomer(contact, eligibility), true);
  assert.equal(m.isNewlyIdentifiedCustomer(contact, { ...eligibility, customerId: 'CUST-1' }), false);
  assert.equal(m.isNewlyIdentifiedCustomer({ ...contact, moiResult: { ...moi, isNewCustomer: false } }, eligibility), false);
  assert.match(m.newCustomerId(new Date(1700000123456)), /^CUST-\d{6}$/);
});

test('wiring: only a Family Package\'s first line creates the customer, before anything that belongs to them is written, and the new id is the order\'s, the line\'s and the confirmation\'s', () => {
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /const needsRecord = family\.applies && family\.ok && isNewlyIdentifiedCustomer\(contact, eligibility\);/);
  assert.match(submit, /createdCustomerId = needsRecord && !knownCustomerId \? newCustomerId\(\)/);
  assert.ok(submit.indexOf("createRecord('customers'") < submit.indexOf('persistBillingAccount(billingAccount'), 'the customer exists before their billing account');
  assert.equal(submit.match(/eligibility\?\.customerId,/g).length, 1, 'every customer id the order writes is the resolved one (the salutation, for an existing customer only, is the one left)');
  assert.match(submit, /const customerId = eligibility\?\.customerId \?\? knownCustomerId \?\? createdCustomerId/);
});

test('every order held for approval names the team it waits on under the confirmation heading, for every journey: the role it was routed to, else the approval matrix\'s', async () => {
  const aa = await load('/src/engines/approvalAuthority.ts');
  const matrix = JSON.parse(fs.readFileSync('public/config/approval-matrix.json', 'utf8'));
  assert.equal(aa.approvalTeamOf({ approverRole: 'Credit Control' }), 'Credit Control', 'a routed role is named as it is');
  assert.equal(aa.approvalTeamOf({ approverRole: 'Back Office Fulfilment', orderType: 'MNP Postpaid Port-In' }), 'Backoffice Fulfillment Team', 'the role it was routed to wins over the matrix');
  assert.equal(aa.approvalTeamOf(undefined), undefined);
  assert.equal(aa.approvalTeamOf({}), undefined, 'nothing known, nothing named');
  const screen = fs.readFileSync('src/components/patterns/ActivationCompleteScreen.tsx', 'utf8');
  assert.match(screen, /headingNote=\{order\.pendingApproval && approvalTeam \? `\(\$\{approvalTeam\}\)` : undefined\}/);
  assert.match(screen, /approvalTeamOf\(all\.find\(\(o\) => o\.orderId === order\.orderId\)\)/, 'read from the order as placed, so no journey has to supply it');
  assert.ok(matrix.some((m) => m.category === 'New Postpaid Activation'));
});

// ---- Family Owner, billing ------------------------------------------------------------------------------------------------------------------------
test('Family Owner: a connection is added only after the owner\'s ID is validated: another person\'s ID, or a customer the package is not under, is refused with the owner reason', async () => {
  const { familyStartFor } = await load('/src/modules/new-connection/familyStart.ts');
  const catalogue = products.map((p) => ({ productId: p.productId, name: p.name, mrcQAR: p.mrcQAR, planClass: p.planClass, secondaryPlanType: p.secondaryPlanType }));
  const pkg = { ...ln('Primary', 1, 'PROD-143'), packageId: 'FPK-X', customerId: 'CUST-9', idNumber: '555' };
  const free = { ...ln('Primary', 2, 'PROD-143'), packageId: 'FPK-X', customerId: 'CUST-9', idNumber: '555' };
  const BOTH = [APPROVED, ord('ORD-Primary-2', 'Approved')];
  const values = (who) => ({ familyLine: { packageId: 'FPK-X' }, productId: 'PROD-311', eligibility: { customerId: who.customerId }, contact: { idNumber: who.idNumber } });
  assert.equal(familyStartFor(values({ customerId: 'CUST-9' }), catalogue, [pkg, free], BOTH).ok, true, 'the owner by record');
  assert.equal(familyStartFor(values({ idNumber: '555' }), catalogue, [pkg, free], BOTH).ok, true, 'the owner by ID, with no record');
  const other = familyStartFor(values({ customerId: 'CUST-8', idNumber: '999' }), catalogue, [pkg, free], BOTH);
  assert.equal(other.ok, false);
  assert.equal(other.kind, 'owner');
  assert.match(other.reason, /Family Owner/);
  assert.equal(familyStartFor(values({}), catalogue, [pkg, free], BOTH).kind, 'owner', 'nobody identified is nobody\'s package');
  assert.equal(familyStartFor({ ...values({ customerId: 'CUST-9' }), familyLine: { packageId: 'FPK-NONE' } }, catalogue, [pkg, free], BOTH).kind, 'package', 'no such package');
});

test('billing: every line of a package is billed under Primary Line 1\'s billing account; unknown stays unknown', () => {
  const lines = [ln('Primary', 1, 'PROD-143', 'O1'), ln('Supplementary', 1, 'PROD-311', 'O2')];
  const orders = [{ orderId: 'O1', billingProfileId: 'BILL-1' }, { orderId: 'O2', billingProfileId: 'BILL-OTHER' }];
  assert.equal(fp.packageBillingProfileId(lines, orders), 'BILL-1', 'the first line\'s, whatever a later order says');
  assert.equal(fp.packageBillingProfileId(lines, [{ orderId: 'O1' }]), undefined);
  assert.equal(fp.packageBillingProfileId(lines, [{ orderId: 'O1', billingProfileId: '' }]), undefined);
  assert.equal(fp.packageBillingProfileId([], orders), undefined);
  assert.equal(fp.packageBillingProfileId([ln('Secondary', 1)], orders), undefined, 'no Primary Line 1');
  // Seeded packages: Primary Line 1 records the customer's own postpaid billing account.
  const accounts = read('accounts');
  for (const l of read('family-package-lines').filter((x) => x.role === 'Primary' && x.sequence === 1)) {
    const profile = fp.packageBillingProfileId([l], read('orders'));
    assert.ok(profile, l.lineId);
    assert.ok(accounts.some((a) => a.customerId === l.customerId && a.billingProfileId === profile && /Postpaid/.test(a.accountType)), `${l.lineId} is billed on its customer's postpaid account`);
  }
});

test('wiring: the billing step holds the package\'s account for an added line, and submission uses it whatever the draft says; the SIM page offers the optional Secondary Contact', () => {
  const steps = fs.readFileSync('src/modules/new-connection/connectionSteps.tsx', 'utf8');
  assert.match(steps, /FamilyBillingApplier/);
  assert.match(steps, /selectedProfileId === target/);
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /const billingProfileId = packageBilling \?\? await persistBillingAccount/);
  assert.match(submit, /!packageBilling && billingAccount\?\.creatingNew/);
  const sim = fs.readFileSync('src/capabilities/SimType/step.tsx', 'utf8');
  assert.match(sim, /Add Secondary Contact/);
  assert.match(fs.readFileSync('src/capabilities/ActualUser/actualUserModel.ts', 'utf8'), /a Secondary Contact must be 18 or over/);
});

test('Recommended Offers > New Postpaid: every customer\'s three offers are one Voice, one Broadband and one Family plan, whole population', () => {
  const offers = read('cross-sales-offers').filter((o) => o.serviceJourney === 'new-postpaid');
  const cls = new Map(products.map((p) => [p.productId, p.planClass]));
  const by = new Map();
  for (const o of offers) {
    assert.equal(o.linkedProductIds.length, 1, o.offerId);
    assert.ok(cls.has(o.linkedProductIds[0]), `${o.offerId} links a catalogue plan`);
    by.set(o.contactId, [...(by.get(o.contactId) ?? []), cls.get(o.linkedProductIds[0])]);
  }
  assert.ok(by.size >= 60);
  for (const [contact, list] of by) assert.deepEqual([...list].sort(), ['Postpaid Broadband Plans', 'Postpaid Family Plans', 'Postpaid Voice Plans'], contact);
});

// ---- Add-ons are managed at the package level, from Customer 360 -----------------------------------------------------------------------------------
test('package add-ons: the options are the catalogue add-ons that are available, eligible for the package plan and owner, and not already held - whole catalogue, both ways', async () => {
  const fa = await load('/src/engines/familyPackageAddons.ts');
  const addons = products.filter((p) => p.type === 'Add-on');
  assert.ok(addons.length > 20);
  const ctx = { planId: 'PROD-143', nationality: 'Qatari', idType: 'QID' };
  const opts = fa.packageAddonOptions(products, [], ctx);
  const ids = new Set(opts.map((o) => o.productId));
  // Independent expectation, written from the rules rather than the engine: not discontinued, priced or free, and every stated restriction satisfied.
  const satisfies = (a) => {
    const r = a.eligibility ?? {};
    if (r.plans?.length && !r.plans.includes(ctx.planId)) return false;
    if (r.nationalityGroups?.length && !r.nationalityGroups.includes('Qatari')) return false;
    if (r.customerTypes?.length && !r.customerTypes.includes('none')) return false;
    if (r.idTypes?.length && !r.idTypes.includes('QID')) return false;
    return true;
  };
  const usable = (a) => !/discontinued/i.test(a.addonStatus ?? '') && (a.mrcQAR > 0 || a.pricing === 'free' || a.pricingModel?.startsWith('free') || a.billingOptions?.some((o) => o.priceQAR > 0) || /QR\s*\d/i.test(a.priceLabel ?? ''));
  for (const a of addons) assert.equal(ids.has(a.productId), satisfies(a) && usable(a), a.productId);
  assert.ok(opts.length > 0);
  // Held ones are not offered again; conservation: offered + held = what was offered before.
  const held = [{ addonId: opts[0].productId }];
  const after = fa.packageAddonOptions(products, held, ctx);
  assert.equal(after.length, opts.length - 1);
  assert.equal(after.some((o) => o.productId === opts[0].productId), false);
  // No plan, no options (an unknown plan satisfies no plan restriction); a plan the add-on is limited away from does not get it.
  assert.deepEqual(fa.packageAddonOptions(products, [], { planId: undefined }), []);
  const limited = addons.find((a) => a.eligibility?.plans?.length && !a.eligibility.plans.includes('PROD-143'));
  if (limited) assert.equal(ids.has(limited.productId), false);
  assert.equal(opts.every((o) => o.type === 'Add-on'), true, 'only add-ons');
});

test('package add-ons are charged per line: each line pays the add-on\'s own charge, and the package total is that times its lines', async () => {
  const fa = await load('/src/engines/familyPackageAddons.ts');
  const paid = { productId: 'A', name: 'A', mrcQAR: 20, type: 'Add-on' };
  assert.equal(fa.addonChargePerLineQar(paid), 20);
  assert.equal(fa.addonChargeForLinesQar(paid, 3), 60);
  assert.equal(fa.addonChargeForLinesQar(paid, 0), 0);
  assert.equal(fa.addonChargeForLinesQar({ ...paid, mrcQAR: 0, pricing: 'free' }, 4), 0, 'a free add-on stays free on every line');
  assert.equal(fa.addonChargeForLinesQar({ ...paid, billingFrequency: 'weekly', mrcQAR: 10 }, 2), 86.66, 'the same weekly-to-monthly rule as any line');
});

test('wiring: no Family journey takes add-ons (the action is hidden, the step never stops, submission refuses them); Customer 360 holds and removes the package\'s', async () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /addonsHidden: \(values: Record<string, unknown>\) => family\(values\)\.applies/);
  const plan = fs.readFileSync('src/capabilities/PlanSelection/postpaidStep.tsx', 'utf8');
  assert.match(plan, /!ctx\.addonsHidden\?\.\(values\) && \(/);
  assert.match(plan, /autoPass: \(values\) => !values\.customiseAddons \|\| Boolean\(ctx\.addonsHidden\?\.\(values\)\)/);
  assert.match(fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8'), /family\.applies && family\.ok && addonIds\.length > 0\) throw/);
  const panel = fs.readFileSync('src/workspace/customer360/sections/FamilyPackagePanel.tsx', 'utf8');
  assert.match(panel, /createRecord\('family-package-addons'/);
  assert.match(panel, /removeRecord\('family-package-addons', 'addonRecordId'/);
  assert.match(panel, /packageAddonOptions\(/);
  assert.equal(JSON.parse(fs.readFileSync('public/mock-data/family-package-addons.json', 'utf8')).length, 0);
  // Non-Family orders are unchanged: the hide rule is the Family check and nothing else.
  const ps = await load('/src/modules/new-connection/postpaidSteps.tsx');
  const catalogue = products.map((p) => ({ productId: p.productId, name: p.name, mrcQAR: p.mrcQAR, planClass: p.planClass, offer: p.offer, popular: p.popular, commitmentMonths: p.commitmentMonths }));
  const list = ps.postpaidSteps({ products: catalogue, customerBenefits: [], familyLines: [], familyOrders: [] });
  const extras = list.find((x) => x.key === 'planExtras');
  assert.equal(Boolean(extras.autoPass({ productId: 'PROD-108', customiseAddons: true })), false, 'an ordinary plan: Customise Add-ons still reaches the step');
  assert.equal(Boolean(extras.autoPass({ productId: 'PROD-143', customiseAddons: true })), true, 'a Family Plan: the step never stops');
});

test('an additional line follows the package\'s Family Plan tier; Secondary plans are named Kids Plan and Data-only Plan', async () => {
  const pkg = [ln('Primary', 1, 'PROD-144')];
  const afterFree = [...pkg, ln('Primary', 2, 'PROD-144')];
  const orders = [APPROVED, ord('ORD-Primary-2', 'Approved')];
  const base = { packageId: 'P', eligibilityCleared: true, orders, catalogue: CAT() };
  const supp = fp.familyAdditionalCheck({ ...base, packageLines: afterFree, chosenPlanId: 'PROD-311' });
  assert.equal(supp.additional.tierPlanId, 'PROD-144', 'the tier is the package\'s, whatever the additional plan is');
  assert.equal(supp.planId, 'PROD-311');
  assert.equal(fp.familyAdditionalCheck({ ...base, packageLines: pkg, orders: [APPROVED] }).additional.tierPlanId, 'PROD-144');
  assert.equal(fp.familyAdditionalCheck({ ...base, packageLines: afterFree, chosenPlanId: 'PROD-312' }).additional.tierPlanId, 'PROD-144');
  const by = Object.fromEntries(products.filter((p) => p.planClass === 'Postpaid Secondary Plans').map((p) => [p.productId, p.secondaryPlanType]));
  assert.deepEqual(by, { 'PROD-310': 'Kids Plan', 'PROD-312': 'Data-only Plan' });
  const model = await load('/src/components/patterns/postpaidPlanModel.ts');
  const tags = await load('/src/lib/serviceTypeTag.ts');
  for (const t of Object.values(by)) assert.equal(tags.SERVICE_TYPE_TAGS[model.SECONDARY_PLAN_TYPE_TAG[t]].label.toLowerCase(), t.toLowerCase());
  const submit = fs.readFileSync('src/modules/new-connection/submitNewConnectionOrder.ts', 'utf8');
  assert.match(submit, /tierPlanId: family\.additional\.tierPlanId/);
  assert.match(fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8'), /label: 'Family Plan', value: tier/);
});

test('the customer Actions menu has no Family Package group: Add Another Connection is not offered there', () => {
  const menu = fs.readFileSync('src/workspace/customer360/CustomerActionsMenu.tsx', 'utf8');
  assert.doesNotMatch(menu, /Family Package|AddConnectionModal|useFamilyConnections/);
});

test('new customers start with no Family Package: none of the "not a customer yet" profiles has a line, an order or a package, so Primary Line 1 of a new package is allowed', () => {
  const lines = read('family-package-lines');
  const orders = read('orders');
  const nas = read('nas-records').filter((n) => n.nasRecordId);
  const docs = read('identity-documents');
  const customers = new Map(read('customers').map((c) => [c.customerId, c]));
  assert.ok(nas.length > 0, 'there are new-customer profiles to check');
  const packageHolders = new Set(lines.map((l) => l.customerId));
  for (const n of nas) {
    // A new customer is on the national address register only: no customer id, and no customer record that carries the same identity document.
    const sameDocument = docs.filter((d) => d.documentNumber === n.documentNumber).map((d) => d.customerId);
    assert.deepEqual(sameDocument, [], `${n.nasRecordId} must not already be a customer`);
    assert.ok(!customers.has(n.nasRecordId));
    assert.ok(!lines.some((l) => l.customerId === n.nasRecordId) && !orders.some((o) => o.customerId === n.nasRecordId && /^ORD-FAM/.test(o.orderId)), `${n.nasRecordId} has no package`);
    assert.ok(!packageHolders.has(n.nasRecordId));
  }
  // The Family Plan start check lets a customer with no lines begin a package, and blocks one who has a package.
  const ahli = products.find((p) => p.productId === 'PROD-142');
  assert.equal(fp.familyStartCheck({ plan: ahli, eligibilityCleared: true, customerLines: [] }).ok, true);
  assert.equal(fp.familyStartCheck({ plan: ahli, eligibilityCleared: true, customerLines: [ln('Primary', 1)] }).ok, false);
});

test('only customers that exist to demonstrate a package hold one: the Family Plan scenarios plus the two original demo packages', () => {
  const holders = new Set(read('family-package-lines').map((l) => l.customerId));
  const allowed = new Set(['CUST-1001', 'CUST-3084', ...Array.from({ length: 12 }, (_, i) => `CUST-${3201 + i}`)]);
  for (const id of holders) assert.ok(allowed.has(id), `${id} holds a Family Package but is not a package demonstration customer`);
});

test('the included line is Primary Line 2 and nothing else: every other line is charged at its plan, and an additional line waits for Primary Line 2 to be active', () => {
  assert.deepEqual(fp.FREE_LINE, { role: 'Primary', sequence: 2 });
  assert.equal(fp.isFreeLine({ role: 'Primary', sequence: 2 }), true);
  for (const l of [{ role: 'Primary', sequence: 1 }, { role: 'Supplementary', sequence: 1 }, { role: 'Supplementary', sequence: 2 }, { role: 'Secondary', sequence: 1 }]) assert.equal(fp.isFreeLine(l), false, fp.lineLabel(l));
  const p1 = [ln('Primary', 1)];
  for (const role of ['Supplementary', 'Secondary']) assert.match(fp.canAddLine(p1, [APPROVED], role, CAT()).reason, /Primary Line 2 is still available/, role);
  assert.equal(fp.canAddLine(p1, [APPROVED], 'Primary', CAT()).ok, true);
  assert.equal(fp.freeLineOpen(p1), true);
  assert.equal(fp.freeLineOpen([...p1, ln('Primary', 2)]), false, 'a Primary Line 2 on record (even awaiting approval) is the included line taken');
});

test('packageSummary: what the active package holds, what is left, and which of it is included or charged', () => {
  const none = fp.packageSummary([ln('Primary', 1, 'PROD-144')], [APPROVED], CAT());
  assert.equal(none.planId, 'PROD-144');
  assert.deepEqual(none.activated.map((a) => [a.label, a.count, a.lines]), [['Primary', 1, ['Primary Line 1']]]);
  assert.deepEqual(none.available.map((a) => [a.role, a.remaining]), [['Primary', 1], ['Supplementary', 2], ['Secondary', null]]);
  assert.deepEqual(none.free.map((o) => o.lineLabel), ['Primary Line 2']);
  assert.deepEqual(none.paid, [], 'no additional option while Primary Line 2 is left');
  assert.equal(none.paidOpen, false);
  const orders = [APPROVED, ord('ORD-Primary-2', 'Approved')];
  const used = fp.packageSummary([ln('Primary', 1), ln('Primary', 2), ln('Supplementary', 1)], orders, CAT());
  assert.deepEqual(used.free, []);
  assert.deepEqual(used.paid.map((o) => [o.lineLabel, o.charge]), [['Supplementary Line 2', 'Paid'], ['Secondary Line 1', 'Paid']]);
  assert.equal(used.paidOpen, true);
  assert.deepEqual(used.available.map((a) => a.role), ['Supplementary', 'Secondary'], 'Primary is full');
  const pending = fp.packageSummary([ln('Primary', 1)], [ord('ORD-Primary-1', 'Pending Approval')], CAT());
  assert.deepEqual([pending.free, pending.paid, pending.paidOpen], [[], [], false], 'nothing is open before Primary Line 1 is approved');
});

test('wiring: a Family Plan chosen by a customer who already has a package opens the package dialog on the plan page, and adding to it puts the connection in the draft', () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.match(steps, /held\.kind === 'package'/);
  assert.match(steps, /<FamilyPackageActiveGate/);
  assert.match(steps, /c\.setValue\('familyLine', familyLine\)/);
  const gate = fs.readFileSync('src/modules/new-connection/FamilyPackageActiveGate.tsx', 'utf8');
  assert.match(gate, /<AddConnectionModal open=\{open\} alreadyActive/);
  const modal = fs.readFileSync('src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'utf8');
  for (const text of ['Family Package Already Active', 'Lines activated', 'Free lines available', 'Add Primary Line 2', 'Select A Plan']) assert.ok(modal.includes(text), text);
});

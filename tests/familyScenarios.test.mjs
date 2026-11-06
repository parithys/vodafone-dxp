// Family Plan scenarios: the 12 numbered scenarios and the two overlay packages of "Family-Plan-Scenarios.xlsx", as an independent expectation table.
// Each row is transcribed from the workbook (the customer, the lines it lists, each line's approval, and the next connection it names), never read back from the
// engine. Two things are checked against it, over the real seeded data (public/mock-data):
//   1. the data IS the scenario: the customer, ID number, package, each line's type / plan / number and approval are what the workbook says;
//   2. the Family Package engine derives the workbook's "next connection" from that package: what is offered, what each plan selected becomes, and why nothing is offered
//      when the package is locked.
// The line-count caps (#8, #11) and the HRN rules (#12) belong to the eligibility and HRN engines; only their premise (whose package, which nationality) is checked here.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

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
const familyLines = read('family-package-lines');
const orders = read('orders');
const customers = read('customers');
const identityDocs = read('identity-documents');

// The plans the agent can select to add a line, named as the workbook names them.
const SUPP = 'PROD-311'; // Postpaid Ahli Plus / Pro / Premium / Platinum Member Promotion (QAR 199/mo)
const KIDS = 'PROD-310'; // Postpaid Ahli Lite Member Promotion (QAR 65/mo)
const NET = 'PROD-312'; // Postpaid Ahli Net Member Promotion (QAR 99/mo)
const PICKS = { [SUPP]: 'Plus/Pro/Premium/Platinum', [KIDS]: 'Lite', [NET]: 'Net' };

const PLAN = {
  Ahli: 'Postpaid Ahli Member Promotion',
  Pro: 'Postpaid Ahli Pro Member Promotion',
  Premium: 'Postpaid Ahli Premium Member Promotion',
  Platinum: 'Postpaid Ahli Platinum Member Promotion',
  Supp: 'Postpaid Ahli Plus / Pro / Premium / Platinum Member Promotion',
  Lite: 'Postpaid Ahli Lite Member Promotion',
  Net: 'Postpaid Ahli Net Member Promotion',
};

// line = [role, sequence, plan, msisdn, approved]
const L = (role, sequence, plan, msisdn, approved = true) => ({ role, sequence, plan, msisdn, approved });
const NEXT_P2 = { options: [['Primary', 2, 'Free']], unavailable: null };
const NEXT_NONE = (title) => ({ options: [], unavailable: title });
// Both Primary Lines active: what the plan selected becomes (workbook "Select a plan"), or undefined where the workbook says it is not offered.
const picks = (supp, kids, net) => ({ [SUPP]: supp, [KIDS]: kids, [NET]: net });

const SCENARIOS = [
  { n: '1', id: 'CUST-3201', name: 'Hamda Saeed Khalid Al-Dosari', idNumber: '28803143400201', pkg: 'FPK-CUST-3201', lines: [L('Primary', 1, PLAN.Ahli, '+97455513060')], ...NEXT_P2 },
  {
    n: '2', id: 'CUST-3202', name: 'Nasser Hamad Jassim Al-Attiyah', idNumber: '28407223400202', pkg: 'FPK-CUST-3202',
    lines: [L('Primary', 1, PLAN.Premium, '+97455513061'), L('Primary', 2, PLAN.Premium, '+97455520129')],
    options: [['Supplementary', 1, 'Paid'], ['Secondary', 1, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 1], ['SECONDARY', 1], ['SECONDARY', 1]),
  },
  {
    n: '3', id: 'CUST-3203', name: 'Moza Rashid Ali Al-Kaabi', idNumber: '29111053400203', pkg: 'FPK-CUST-3203',
    lines: [L('Primary', 1, PLAN.Pro, '+97455513062'), L('Primary', 2, PLAN.Pro, '+97455520130', false)], ...NEXT_NONE('Primary Line 2 Awaiting Approval'),
  },
  {
    n: '4', id: 'CUST-3204', name: 'Yousef Mansoor Saeed Al-Ghanim', idNumber: '28702183400204', pkg: 'FPK-CUST-3204',
    lines: [L('Primary', 1, PLAN.Pro, '+97455513063'), L('Primary', 2, PLAN.Pro, '+97455520131'), L('Secondary', 1, PLAN.Lite, '+97455520145')],
    options: [['Supplementary', 1, 'Paid'], ['Secondary', 2, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 1], ['SECONDARY', 2], ['SECONDARY', 2]),
  },
  {
    n: '5', id: 'CUST-3205', name: 'Latifa Khalifa Nasser Al-Suwaidi', idNumber: '29009093400205', pkg: 'FPK-CUST-3205',
    lines: [L('Primary', 1, PLAN.Platinum, '+97455513064'), L('Primary', 2, PLAN.Platinum, '+97455520132'), L('Secondary', 1, PLAN.Lite, '+97455520133'), L('Secondary', 2, PLAN.Net, '+97455520146')],
    options: [['Supplementary', 1, 'Paid'], ['Secondary', 3, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 1], ['SECONDARY', 3], ['SECONDARY', 3]),
  },
  {
    n: '6', id: 'CUST-3206', name: 'Abdulrahman Salem Hamad Al-Ali', idNumber: '28312013400206', pkg: 'FPK-CUST-3206',
    lines: [L('Primary', 1, PLAN.Ahli, '+97455513065'), L('Primary', 2, PLAN.Ahli, '+97455520134'), L('Supplementary', 1, PLAN.Supp, '+97455520135'), L('Supplementary', 2, PLAN.Supp, '+97455520147')],
    options: [['Secondary', 1, 'Paid']], unavailable: null, picks: picks(undefined, ['SECONDARY', 1], ['SECONDARY', 1]),
  },
  {
    n: '7', id: 'CUST-3207', name: 'Shaikha Jassim Rashid Al-Mohannadi', idNumber: '28606273400207', pkg: 'FPK-CUST-3207',
    lines: [L('Primary', 1, PLAN.Premium, '+97455513066'), L('Primary', 2, PLAN.Premium, '+97455520136'), L('Supplementary', 1, PLAN.Supp, '+97455520137')],
    options: [['Supplementary', 2, 'Paid'], ['Secondary', 1, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 2], ['SECONDARY', 1], ['SECONDARY', 1]),
  },
  {
    n: '8', id: 'CUST-3208', name: 'Hamad Khalid Saeed Al-Bakri', idNumber: '27904303400208', pkg: 'FPK-CUST-3208',
    lines: [
      L('Primary', 1, PLAN.Platinum, '+97455513067'), L('Primary', 2, PLAN.Platinum, '+97455520138'),
      L('Supplementary', 1, PLAN.Supp, '+97455520139'), L('Supplementary', 2, PLAN.Supp, '+97455520140'), L('Secondary', 1, PLAN.Net, '+97455520141'),
    ],
    options: [['Secondary', 2, 'Paid']], unavailable: null, picks: picks(undefined, ['SECONDARY', 2], ['SECONDARY', 2]), nationality: 'Qatari',
  },
  { n: '9', id: 'CUST-3209', name: 'Reem Abdulla Nasser Al-Jaber', idNumber: '29308163400209', pkg: 'FPK-CUST-3209', lines: [L('Primary', 1, PLAN.Pro, '+97455513068', false)], ...NEXT_NONE('Primary Line 1 Awaiting Approval') },
  {
    n: '10', id: 'CUST-3210', name: 'Ghanim Ali Mubarak Al-Sulaiti', idNumber: '28101193400210', pkg: 'FPK-CUST-3210',
    lines: [L('Primary', 1, PLAN.Premium, '+97455513069'), L('Primary', 2, PLAN.Premium, '+97455520142'), L('Supplementary', 1, PLAN.Supp, '+97455520148', false)],
    options: [['Supplementary', 2, 'Paid'], ['Secondary', 1, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 2], ['SECONDARY', 1], ['SECONDARY', 1]),
  },
  {
    n: '11', id: 'CUST-3211', name: 'Vikram Anand Rao Iyengar', idNumber: '28505123400211', pkg: 'FPK-CUST-3211',
    lines: [L('Primary', 1, PLAN.Pro, '+97455513070'), L('Primary', 2, PLAN.Pro, '+97455520143')],
    options: [['Supplementary', 1, 'Paid'], ['Secondary', 1, 'Paid']], unavailable: null, picks: picks(['SUPPLEMENTARY', 1], ['SECONDARY', 1], ['SECONDARY', 1]), nationality: 'Indian',
  },
  { n: '12', id: 'CUST-3212', name: 'Naveed Iqbal Ahmed Chaudhry', idNumber: '28910033400212', pkg: 'FPK-CUST-3212', lines: [L('Primary', 1, PLAN.Ahli, '+97455513071')], ...NEXT_P2, nationality: 'Pakistani', segment: 'Consumer (HRN)' },
  { n: 'overlay', id: 'CUST-1001', name: 'Ahmed Abdulla Hassan Al-Sulaiti', idNumber: '28512345678', pkg: 'FPK-CUST-1001', lines: [L('Primary', 1, PLAN.Pro, '+97455512001')], ...NEXT_P2 },
  { n: 'overlay', id: 'CUST-3084', name: 'Aisha Mohammed Khalid Al-Kuwari', idNumber: '28911063400084', pkg: 'FPK-CUST-3084', lines: [L('Primary', 1, PLAN.Ahli, '+97455513053', false)], ...NEXT_NONE('Primary Line 1 Awaiting Approval') },
];

const planName = (id) => products.find((p) => p.productId === id)?.name;
const CAT = () => fp.lineCatalogueOf(products);
const linesOf = (id) => familyLines.filter((l) => l.customerId === id);
const ordersOf = (id) => linesOf(id).map((l) => orders.find((o) => o.orderId === l.orderId));
const label = (s) => `#${s.n} ${s.id}`;

test('the workbook is complete: 12 numbered scenarios in order, 2 overlays, each customer once, and every seeded package is one of them', () => {
  assert.deepEqual(SCENARIOS.filter((s) => s.n !== 'overlay').map((s) => s.n), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  assert.equal(SCENARIOS.filter((s) => s.n === 'overlay').length, 2);
  assert.equal(new Set(SCENARIOS.map((s) => s.id)).size, SCENARIOS.length);
  // Conservation over the whole data file: the packages seeded are exactly the packages scenarioed, no more, no fewer, and no line is unaccounted for.
  assert.deepEqual([...new Set(familyLines.map((l) => l.customerId))].sort(), SCENARIOS.map((s) => s.id).sort());
  assert.equal(familyLines.length, SCENARIOS.reduce((n, s) => n + s.lines.length, 0));
});

test('the seeded data is the scenario: customer, ID number, package, and every line\'s type, plan, number and approval match the workbook', () => {
  for (const s of SCENARIOS) {
    const c = customers.find((x) => x.customerId === s.id);
    assert.ok(c, `${label(s)} customer exists`);
    assert.equal(c.fullName ?? c.name, s.name, `${label(s)} name`);
    // The workbook's "ID number (use for lookup)" is the customer record's QID, which is what Customer Search and ID lookup match.
    assert.equal(c.qid, s.idNumber, `${label(s)} is found by ID number ${s.idNumber}`);
    // The identity document agrees with it (CUST-1001 is the one known exception: see the todo test below).
    if (s.id !== 'CUST-1001') assert.ok(identityDocs.some((d) => d.customerId === s.id && d.documentNumber === s.idNumber), `${label(s)} identity document`);

    const own = linesOf(s.id);
    assert.equal(own.length, s.lines.length, `${label(s)} line count`);
    assert.ok(own.every((l) => l.packageId === s.pkg), `${label(s)} all lines in ${s.pkg}`);
    // Lines in the order the workbook lists them: Primary 1, Primary 2, then additional lines.
    const sorted = [...own].sort((a, b) => ['Primary', 'Supplementary', 'Secondary'].indexOf(a.role) - ['Primary', 'Supplementary', 'Secondary'].indexOf(b.role) || a.sequence - b.sequence);
    const expected = [...s.lines].sort((a, b) => ['Primary', 'Supplementary', 'Secondary'].indexOf(a.role) - ['Primary', 'Supplementary', 'Secondary'].indexOf(b.role) || a.sequence - b.sequence);
    sorted.forEach((l, i) => {
      const e = expected[i];
      assert.deepEqual([l.role, l.sequence, planName(l.planId), l.msisdn], [e.role, e.sequence, e.plan, e.msisdn], `${label(s)} line ${i + 1}`);
      const o = orders.find((x) => x.orderId === l.orderId);
      assert.equal(fp.isOrderApproved(o), e.approved, `${label(s)} ${e.role} ${e.sequence} approval (${o?.approvalStatus})`);
    });
    assert.deepEqual(fp.packageViolations(own), [], `${label(s)} obeys the package rules`);
  }
});

// Found while testing this feature, not caused by it and outside the Family Package boundary: CUST-1001's record says QID 28512345678 (the workbook's lookup ID and
// Customer Search) but its identity document, which Customer 360's header shows, says 28456701234 - the long-standing demo value that other tests rely on.
// Reported rather than "fixed" here. Remove `todo` once the two agree.
test('CUST-1001: the identity document carries the same QID as the customer record', { todo: 'customers.json qid 28512345678 vs identity-documents.json IDD-5501 28456701234' }, () => {
  const doc = identityDocs.find((d) => d.customerId === 'CUST-1001' && d.documentType === 'QID');
  assert.equal(doc.documentNumber, customers.find((c) => c.customerId === 'CUST-1001').qid);
});

test('the next connection is derived from the package state: what is offered, in what order, at what charge', () => {
  for (const s of SCENARIOS) {
    const opts = fp.connectionOptions(linesOf(s.id), ordersOf(s.id), CAT());
    assert.deepEqual(opts.map((o) => [o.role, o.sequence, o.charge]), s.options, `${label(s)} options`);
    assert.ok(opts.every((o) => o.lineLabel === `${o.role} Line ${o.sequence}`), `${label(s)} labels`);
  }
});

test('a package that cannot take a connection says why, naming the line it waits on; a package that can says nothing', () => {
  for (const s of SCENARIOS) {
    const u = fp.connectionUnavailable(linesOf(s.id), ordersOf(s.id), CAT());
    if (s.unavailable) {
      assert.equal(u?.title, s.unavailable, `${label(s)} title`);
      assert.match(u.reasons[0], /Pending Approval/, `${label(s)} names the order status it waits on`);
    } else assert.equal(u, undefined, `${label(s)} nothing to explain`);
  }
});

test('with both Primary Lines active, the plan the agent selects decides the line: Supplementary, Secondary, or refused when that limit is reached', () => {
  const open = SCENARIOS.filter((s) => s.picks);
  assert.deepEqual(open.map((s) => s.n), ['2', '4', '5', '6', '7', '8', '10', '11']);
  for (const s of open) {
    for (const [planId, expected] of Object.entries(s.picks)) {
      const d = fp.deriveFamilyLine({ lines: linesOf(s.id), orders: ordersOf(s.id), catalogue: CAT(), selectedPlanId: planId });
      const what = `${label(s)} selecting ${PICKS[planId]}`;
      if (expected === undefined) {
        assert.equal(d.ok, false, `${what} is refused (limit reached)`);
        assert.match(d.reason, /cannot be added to this Family Package now/, what);
      } else {
        assert.deepEqual([d.ok, d.type, d.sequence, d.planId, d.charge], [true, expected[0], expected[1], planId, 'Paid'], what);
      }
    }
    // No plan selected yet: the agent is offered exactly the plans that still have room, and never a connection type.
    const pending = fp.deriveFamilyLine({ lines: linesOf(s.id), orders: ordersOf(s.id), catalogue: CAT() });
    assert.equal(pending.pending, true, `${label(s)} waits for a plan`);
    assert.deepEqual(pending.eligiblePlans.map((e) => e.planId).sort(), Object.entries(s.picks).filter(([, v]) => v).map(([k]) => k).sort(), `${label(s)} eligible plans`);
  }
});

test('Primary Line 2 is the included line on the package\'s own plan - whatever plan was selected - and nothing else is free', () => {
  for (const s of SCENARIOS.filter((x) => x.options[0]?.[0] === 'Primary')) {
    const own = linesOf(s.id);
    const pkgPlan = own.find((l) => l.role === 'Primary' && l.sequence === 1).planId;
    for (const selectedPlanId of [undefined, SUPP, KIDS, NET]) {
      const d = fp.deriveFamilyLine({ lines: own, orders: ordersOf(s.id), catalogue: CAT(), selectedPlanId });
      assert.deepEqual([d.ok, d.type, d.sequence, d.planId, d.charge], [true, 'PRIMARY_LINE_2', 2, pkgPlan, 'Free'], `${label(s)} selecting ${selectedPlanId}`);
    }
  }
  // Charge over every offered connection of every package: Free only for Primary Line 2.
  for (const s of SCENARIOS) for (const o of fp.connectionOptions(linesOf(s.id), ordersOf(s.id), CAT())) assert.equal(o.charge === 'Free', o.role === 'Primary' && o.sequence === 2, `${label(s)} ${o.lineLabel}`);
});

test('a locked package opens nothing, whatever plan is selected: Primary Line 1 or Primary Line 2 awaiting approval', () => {
  for (const s of SCENARIOS.filter((x) => x.unavailable)) {
    for (const selectedPlanId of [undefined, SUPP, KIDS, NET]) {
      const d = fp.deriveFamilyLine({ lines: linesOf(s.id), orders: ordersOf(s.id), catalogue: CAT(), selectedPlanId });
      assert.equal(d.ok, false, `${label(s)} selecting ${selectedPlanId}`);
    }
    for (const role of ['Primary', 'Supplementary', 'Secondary']) assert.equal(fp.canAddLine(linesOf(s.id), ordersOf(s.id), role, CAT()).ok, false, `${label(s)} ${role}`);
  }
});

test('a line awaiting approval still counts toward its limit and its numbering (#10), but it is not an active line', () => {
  const s = SCENARIOS.find((x) => x.n === '10');
  const state = fp.resolvePackageState(linesOf(s.id), ordersOf(s.id));
  assert.equal(state.supplementaryUsed, 1, 'the pending Supplementary counts as used');
  assert.equal(state.supplementaryRemaining, 1);
  // The same package with that line approved gives the same next connection: approval does not change the count.
  const approved = ordersOf(s.id).map((o) => ({ ...o, approvalStatus: 'Approved', status: 'Complete' }));
  assert.deepEqual(fp.connectionOptions(linesOf(s.id), approved, CAT()).map((o) => [o.role, o.sequence]), [['Supplementary', 2], ['Secondary', 1]]);
});

test('Family Owner: a connection is added only for the package\'s owner, and eligibility must be cleared, for every scenario that can take one', () => {
  for (const s of SCENARIOS.filter((x) => x.options.length > 0)) {
    const base = { packageId: s.pkg, packageLines: linesOf(s.id), orders: ordersOf(s.id), catalogue: CAT() };
    const ok = fp.familyAdditionalCheck({ ...base, eligibilityCleared: true, chosenPlanId: s.picks ? KIDS : undefined });
    assert.equal(ok.ok, true, `${label(s)} the owner may add`);
    const other = fp.familyAdditionalCheck({ ...base, eligibilityCleared: true, isOwner: false });
    assert.deepEqual([other.ok, other.kind], [false, 'owner'], `${label(s)} another person's ID is refused`);
    const blocked = fp.familyAdditionalCheck({ ...base, eligibilityCleared: false });
    assert.deepEqual([blocked.ok, blocked.kind], [false, 'eligibility'], `${label(s)} not cleared is refused`);
  }
});

test('billing: every line of every scenario package is billed under Primary Line 1\'s account; a package with none stays unknown', () => {
  for (const s of SCENARIOS) {
    const own = linesOf(s.id);
    const p1 = own.find((l) => l.role === 'Primary' && l.sequence === 1);
    const expected = orders.find((o) => o.orderId === p1.orderId)?.billingProfileId ?? orders.find((o) => o.orderId === p1.orderId)?.billingAccountId;
    assert.equal(fp.packageBillingProfileId(own, ordersOf(s.id)), expected, `${label(s)} one billing account`);
  }
  assert.equal(fp.packageBillingProfileId([], []), undefined);
});

test('the owner premises the workbook notes rely on: #8 Qatari with five mobile lines, #11 Indian expat with two, #12 Pakistani (HRN) segment', () => {
  const nat = (id) => customers.find((c) => c.customerId === id);
  assert.equal(nat('CUST-3208').nationality, 'Qatari');
  assert.equal(linesOf('CUST-3208').length, 5, 'five mobile lines in the package');
  assert.equal(nat('CUST-3211').nationality, 'Indian');
  assert.equal(linesOf('CUST-3211').length, 2, 'two postpaid lines = the expat cap');
  assert.equal(nat('CUST-3212').nationality, 'Pakistani');
  assert.equal(nat('CUST-3212').segment, 'Consumer (HRN)');
});

test('line types: each role and sequence maps to exactly one type, and every type maps back to its role', () => {
  const cases = [
    [{ role: 'Primary', sequence: 1 }, 'PRIMARY_LINE_1'],
    [{ role: 'Primary', sequence: 2 }, 'PRIMARY_LINE_2'],
    [{ role: 'Supplementary', sequence: 1 }, 'SUPPLEMENTARY'],
    [{ role: 'Supplementary', sequence: 2 }, 'SUPPLEMENTARY'],
    [{ role: 'Secondary', sequence: 1 }, 'SECONDARY'],
    [{ role: 'Secondary', sequence: 7 }, 'SECONDARY'],
  ];
  for (const [line, type] of cases) assert.equal(fp.familyLineTypeOf(line), type, `${line.role} ${line.sequence}`);
  for (const [type, role] of Object.entries(fp.FAMILY_LINE_TYPE_ROLE)) assert.ok(cases.some(([l, t]) => t === type && l.role === role), `${type} -> ${role}`);
  // Every seeded line classifies, and to a type of its own role.
  for (const l of familyLines) assert.equal(fp.FAMILY_LINE_TYPE_ROLE[fp.familyLineTypeOf(l)], l.role, l.lineId);
});

test('limits: Primary 2, Supplementary 2, Secondary unlimited - held by the engine, and the workbook\'s counts never exceed them', () => {
  assert.deepEqual([fp.FAMILY_ROLE_LIMITS.Primary, fp.FAMILY_ROLE_LIMITS.Supplementary, fp.FAMILY_ROLE_LIMITS.Secondary], [2, 2, null]);
  for (const s of SCENARIOS) {
    const n = (role) => s.lines.filter((l) => l.role === role).length;
    assert.ok(n('Primary') <= 2 && n('Supplementary') <= 2, `${label(s)} within limits`);
  }
  // #5 shows Secondary has no limit: two already, a third is offered.
  assert.deepEqual(fp.connectionOptions(linesOf('CUST-3205'), ordersOf('CUST-3205'), CAT()).find((o) => o.role === 'Secondary')?.sequence, 3);
});

test('the additional plans are priced as the workbook says: Plus/Pro/Premium/Platinum QAR 199, Lite QAR 65, Net QAR 99', () => {
  const rent = (id) => products.find((p) => p.productId === id);
  const price = (p) => p.monthlyRentalQAR ?? p.mrcQAR;
  assert.deepEqual([SUPP, KIDS, NET].map((id) => price(rent(id))), [199, 65, 99]);
  assert.deepEqual([SUPP, KIDS, NET].map((id) => rent(id).planClass), ['Postpaid Supplementary Plans', 'Postpaid Secondary Plans', 'Postpaid Secondary Plans']);
});

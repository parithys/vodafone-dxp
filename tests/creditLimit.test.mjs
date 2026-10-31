// Credit-limit rules. Expectations are written from the requirement and from tables of what each seeded value IS, not from the code under test.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

const json = (n) => JSON.parse(fs.readFileSync(`public/mock-data/${n}.json`, 'utf8'));
const read = (f) => fs.readFileSync(f, 'utf8');
const customers = json('customers');
const HRN_NATIONALITIES = ['pakistani', 'bangladeshi', 'cambodian', 'myanmar', 'laotian', 'kenyan', 'ugandan', 'swazi'];

let cl, change, persist, hrn;
before(async () => {
  await boot();
  cl = await load('/src/engines/creditLimit.ts');
  hrn = await load('/src/engines/hrnConfiguration.ts');
  change = await load('/src/workspace/customer360/creditLimitChange.ts');
  persist = await load('/src/capabilities/BillingAccount/persistBillingAccount.ts');
});
after(close);

test('1. the account type is Consumer, set by the journey the agent started - never picked', () => {
  assert.equal(cl.accountTypeForJourney('postpaid'), 'Consumer Mobile Postpaid');
  assert.equal(cl.accountTypeForJourney('fixed-line'), 'Consumer Fixed Line (GigaHome)');
  assert.equal(cl.accountTypeForJourney('prepaid'), 'Consumer Mobile Prepaid');
  for (const j of ['postpaid', 'fixed-line', 'prepaid']) assert.ok(cl.isConsumerAccountType(cl.accountTypeForJourney(j)), j);
  assert.ok(!cl.isConsumerAccountType('Enterprise'));
  assert.match(read('src/modules/new-connection/submitNewConnectionOrder.ts'), /kind: accountTypeForJourney\('postpaid'\)/);
});

test('2. the customer segment is Qatari or Expat, from the nationality (every customer on file)', () => {
  assert.equal(cl.creditSegmentOf('Qatari'), 'Qatari');
  assert.equal(cl.creditSegmentOf(' qatar '), 'Qatari');
  assert.equal(cl.creditSegmentOf('Indian'), 'Expat');
  assert.equal(cl.creditSegmentOf('Kenyan'), 'Expat', 'an HRN customer is an Expat');
  assert.equal(cl.creditSegmentOf(undefined), undefined, 'no nationality: nothing is guessed');
  assert.equal(cl.creditSegmentOf(''), undefined);
  let q = 0;
  for (const c of customers) {
    const expected = c.nationality.trim().toLowerCase() === 'qatari' ? 'Qatari' : 'Expat';
    assert.equal(cl.creditSegmentOf(c.nationality), expected, c.customerId);
    if (expected === 'Qatari') q++;
  }
  assert.ok(q > 5 && q < customers.length);
});

test('3. the customer category is HRN or Non-HRN, from the nationality MOI returned', () => {
  for (const c of customers) {
    const expectHrn = HRN_NATIONALITIES.includes(c.nationality.trim().toLowerCase());
    assert.equal(cl.customerCategoryOf(c.nationality), expectHrn ? 'HRN' : 'Non-HRN', `${c.customerId} ${c.nationality}`);
    if (c.segment === 'Consumer (HRN)') assert.ok(expectHrn, `${c.customerId} is filed as HRN but its nationality is not`);
  }
  assert.equal(cl.customerCategoryOf('Egypt'), 'Non-HRN');
  assert.equal(cl.customerCategoryOf(undefined), 'Non-HRN');
});

test('4. default credit limit: Expat 1000, Qatari 4000, HRN 50; the amount payable is still computed (checkout shows it)', () => {
  assert.equal(cl.defaultCreditLimitFor('Qatari'), 4000);
  assert.equal(cl.defaultCreditLimitFor('Egyptian'), 1000);
  assert.equal(cl.defaultCreditLimitFor('Pakistani'), 50);
  assert.equal(cl.defaultCreditLimitFor('Swazi'), 50);
  for (const c of customers) {
    const n = c.nationality.trim().toLowerCase();
    assert.equal(cl.defaultCreditLimitFor(c.nationality), HRN_NATIONALITIES.includes(n) ? 50 : n === 'qatari' ? 4000 : 1000, c.customerId);
  }
  assert.equal(cl.payableAtActivationQar('Kenyan'), 100, 'an HRN customer pays the advance');
  assert.equal(cl.payableAtActivationQar('Qatari'), 0);
  assert.equal(cl.payableAtActivationQar('Indian'), 0);
});

test('5. only the limits that apply to the segment are offered; the agent chooses; HRN has no choice', () => {
  assert.deepEqual(cl.creditLimitOptions('Egyptian'), [0, 50, 200, 500, 800, 1000]);
  assert.deepEqual(cl.creditLimitOptions('Qatari'), [0, 50, 200, 500, 800, 1000, 1500, 2000, 4000]);
  assert.deepEqual(cl.creditLimitOptions('Pakistani'), [50]);
  assert.ok(!cl.creditLimitOptions('Egyptian').includes(1500), 'an Expat is not offered the Qatari values');
  assert.ok(cl.creditLimitOptions('Qatari').every((v) => v <= 4000));
  assert.deepEqual(cl.creditLimitOptions(undefined), cl.creditLimitOptions('Egyptian'));
  for (const v of cl.CREDIT_LIMIT_PRESETS_QAR) assert.equal(Number.isInteger(v), true);
  const card = read('src/components/patterns/CreditLimitCard.tsx');
  assert.match(card, /policy\.editable \?/, 'HRN and protected segments: no selector, the limit is shown as text');
  assert.match(read('src/capabilities/BillingAccount/step.tsx'), /<CreditLimitCard/);
});

test('a new account takes the agent\'s choice only when it is one of the options (HRN: never); the default otherwise', async () => {
  const run = async (nationality, chosen, customerId = 'C1') => {
    const created = [];
    await persist.persistBillingAccount(
      { creatingNew: true, newAccount: { creditLimitQar: chosen } },
      { createRecord: async (kind, rec) => void created.push({ kind, rec }), kind: 'Consumer Mobile Postpaid', customerId, creditLimitQar: cl.defaultCreditLimitFor(nationality), nationality, agentId: 'USR-1' }
    );
    return { limit: created.find((c) => c.kind === 'credit-limits').rec, profile: created.find((c) => c.kind === 'billing-profiles').rec, audit: created.find((c) => c.kind === 'audit-trail').rec };
  };
  const qatariChoice = await run('Qatari', 1500);
  assert.equal(qatariChoice.limit.creditLimitQar, 1500);
  assert.equal(qatariChoice.limit.defaultCreditLimitQar, 4000);
  assert.equal(qatariChoice.limit.selectedCreditLimitQar, 1500);
  assert.equal(qatariChoice.limit.creditControlLimitQar, null, 'Credit Control has not set one');
  assert.equal(qatariChoice.profile.creditLimitQAR, 1500);
  assert.equal(qatariChoice.audit.changeBasis, 'Selected on a new account');
  assert.equal((await run('Qatari', undefined)).limit.creditLimitQar, 4000, 'no choice: the Qatari default');
  assert.equal((await run('Indian', 1500)).limit.creditLimitQar, 1000, 'an Expat cannot take a Qatari value: the default');
  assert.equal((await run('Indian', 800)).limit.creditLimitQar, 800);
  assert.equal((await run('Pakistani', 1000)).limit.creditLimitQar, 50, 'HRN: no modification');
  assert.equal((await run('Pakistani', undefined)).audit.changeBasis, 'Default on a new account');
});

test('9/8/6. an existing account\'s limit: not Safwa / Safwa+ / Royal, not HRN, not one Credit Control set - and otherwise by the same options', () => {
  for (const segment of ['Safwa', 'Safwa+', 'Royal']) {
    const p = cl.creditLimitPolicy({ segment, nationality: 'Qatari' });
    assert.deepEqual([p.editable, p.lock], [false, 'protected-segment'], segment);
    assert.match(p.message, /Safwa, Safwa\+ or Royal/);
  }
  assert.equal(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Kenyan' }).lock, 'hrn');
  assert.equal(cl.creditLimitPolicy({ segment: 'Consumer (HRN)', nationality: undefined }).lock, 'hrn');
  assert.equal(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Qatari', creditControlLimitQar: 5000 }).lock, 'credit-control');
  assert.equal(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Qatari', creditControlLimitQar: 0 }).lock, 'credit-control', 'a Credit Control limit of 0 is still one');
  for (const blank of [null, undefined]) assert.equal(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Egyptian', creditControlLimitQar: blank }).editable, true, `blank Credit Control limit (${blank}): the agent may change it`);
  assert.deepEqual(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Egyptian' }).options, cl.creditLimitOptions('Egyptian'), 'by the new-customer rules');
  assert.equal(cl.creditLimitPolicy({ segment: 'Safwa', nationality: 'Kenyan', creditControlLimitQar: 100 }).lock, 'protected-segment', 'the protected segment is checked first');
  // Over every customer on file, with their credit-limit record: a lock exactly where the rules say.
  const records = new Map(json('credit-limits').map((r) => [r.customerId, r]));
  for (const c of customers) {
    const rec = records.get(c.customerId);
    const protectedSeg = ['Safwa', 'Safwa+', 'Royal'].includes(c.segment);
    const hrnCustomer = HRN_NATIONALITIES.includes(c.nationality.toLowerCase()) || /HRN/.test(c.segment);
    const expected = protectedSeg ? 'protected-segment' : hrnCustomer ? 'hrn' : typeof rec?.creditControlLimitQar === 'number' ? 'credit-control' : undefined;
    assert.equal(cl.creditLimitPolicy({ segment: c.segment, nationality: c.nationality, creditControlLimitQar: rec?.creditControlLimitQar }).lock, expected, c.customerId);
  }
});

test('an agent\'s change is applied only when the policy allows it, is audited, and otherwise writes nothing', async () => {
  const calls = [];
  const deps = { list: async () => [], updateRecord: async (...a) => void calls.push(['update', ...a]), createRecord: async (...a) => void calls.push(['create', ...a]) };
  const ok = await change.applyAgentCreditLimitChange({ customer: { customerId: 'C1', segment: 'Consumer', nationality: 'Qatari' }, record: { id: 'CRL-9', creditLimitQar: 1000, creditControlLimitQar: null }, accountId: 'ACC-9', toQar: 2000, agentId: 'USR-1' }, deps, '2026-10-22');
  assert.deepEqual(ok, { ok: true });
  assert.deepEqual(calls[0], ['update', 'credit-limits', 'id', 'CRL-9', { creditLimitQar: 2000, selectedCreditLimitQar: 2000, setByAgentId: 'USR-1', lastUpdated: '2026-10-22' }]);
  assert.equal(calls[1][1], 'audit-trail');
  assert.deepEqual([calls[1][2].fromQar, calls[1][2].oldValue, calls[1][2].newValue, calls[1][2].recordType, calls[1][2].recordId, calls[1][2].changeBasis], [undefined, 'QAR 1,000', 'QAR 2,000', 'Credit Limit', 'ACC-9', 'Selected by agent']);
  const refused = async (customer, record, toQar) => {
    calls.length = 0;
    const r = await change.applyAgentCreditLimitChange({ customer: { customerId: 'C1', ...customer }, record, toQar, agentId: 'USR-1' }, deps);
    assert.equal(r.ok, false);
    assert.equal(calls.length, 0, 'nothing is written or audited');
    return r.message;
  };
  assert.match(await refused({ segment: 'Royal', nationality: 'Qatari' }, { id: 'X' }, 1000), /Safwa, Safwa\+ or Royal/);
  assert.match(await refused({ segment: 'Consumer', nationality: 'Kenyan' }, { id: 'X' }, 50), /HRN/);
  assert.match(await refused({ segment: 'Consumer', nationality: 'Qatari' }, { id: 'X', creditControlLimitQar: 5000 }, 1000), /Credit Control Team/);
  assert.match(await refused({ segment: 'Consumer', nationality: 'Egyptian' }, { id: 'X' }, 1500), /Choose one of the credit limits/);
  assert.match(await refused({ segment: 'Consumer', nationality: 'Egyptian' }, { id: 'X' }, 1234), /Choose one of the credit limits/);
  calls.length = 0;
  await change.applyAgentCreditLimitChange({ customer: { customerId: 'C2', segment: 'Consumer', nationality: 'Egyptian' }, record: undefined, accountId: 'ACC-2', toQar: 500, agentId: 'USR-1' }, deps);
  assert.equal(calls[0][0], 'create', 'no record on file: one is created');
  assert.equal(calls[0][2].defaultCreditLimitQar, 1000);
  const drawer = read('src/workspace/customer360/AccountEditDrawer.tsx');
  assert.match(drawer, /disabled=\{!policy\.editable\}/);
  assert.match(drawer, /cannot be changed\./);
  assert.ok(!/ChoiceCards[\s\S]{0,80}Customer Segment/.test(drawer), 'the segment is not editable');
  assert.match(drawer, /Account Type[\s\S]*Customer Segment/);
});

test('7. the four figures under Credit Limit: overall, default, Credit Control Team, increase due to a deposit', () => {
  const b = cl.creditLimitBreakdown({ creditLimitQar: 1000, selectedCreditLimitQar: 1000, creditControlLimitQar: null }, 4000, 500);
  assert.deepEqual(b, { overall: 1500, default: 4000, creditControl: null, depositIncrease: 500 });
  assert.deepEqual(cl.creditLimitBreakdown({ creditLimitQar: 5000, creditControlLimitQar: 5000 }, 4000, 0), { overall: 5000, default: 4000, creditControl: 5000, depositIncrease: 0 });
  assert.equal(cl.creditLimitBreakdown({ creditLimitQar: 1000 }, 1000, 0).overall, 1000, 'a record with no breakdown keeps its stored limit');
  assert.equal(cl.creditLimitBreakdown(undefined, 1000, 0).overall, undefined);
  assert.equal(cl.creditLimitBreakdown({ creditLimitQar: 800, selectedCreditLimitQar: 800 }, 1000, 0).creditControl, null);
  assert.equal(cl.depositIncreaseOf('A', [{ accountId: 'A', depositAmountQar: 500, status: 'Active' }, { accountId: 'A', depositAmountQar: 300, status: 'Refunded' }, { accountId: 'B', depositAmountQar: 9, status: 'Active' }]), 500, 'only an Active deposit on that account');
  // The seeded records, against a table of what each IS.
  const bundles = json('deposit-bundles');
  const expected = { 'CRL-4001': [1500, 4000, null, 500], 'CRL-4002': [1000, 1000, null, 0], 'CRL-4003': [5750, 4000, 5000, 750], 'CRL-4301': [5000, 4000, 5000, 0] };
  for (const r of json('credit-limits')) {
    const cust = customers.find((c) => c.customerId === r.customerId);
    const got = cl.creditLimitBreakdown(r, cl.defaultCreditLimitFor(cust.nationality), cl.depositIncreaseOf(r.accountId, bundles));
    assert.deepEqual([got.overall, got.default, got.creditControl, got.depositIncrease], expected[r.id], r.id);
  }
  for (const f of ['src/workspace/customer360/sections/C360AccountInformation.tsx', 'src/workspace/customer360/sections/C360Overview.tsx']) {
    const src = read(f);
    for (const label of ['Default', 'Credit Control Team', 'Credit Limit Increased Due to Deposit']) assert.ok(src.includes(`"${label}"`), `${f}: ${label}`);
    assert.match(src, /creditBreakdownOf\(data\)/);
  }
});

test('10. the HRN fee is not marked when the Credit Risk Exemption is Low or No', () => {
  for (const v of ['Low', 'low', ' No ', 'NO']) assert.equal(cl.hrnFeeApplies(v), false, v);
  for (const v of ['High', 'Medium', 'Yes', '', undefined]) assert.equal(cl.hrnFeeApplies(v), true, String(v));
  const feed = json('big-data-credit-risk');
  const byId = new Map(feed.map((f) => [f.customerId, f]));
  for (const c of customers.filter((x) => HRN_NATIONALITIES.includes(x.nationality.toLowerCase()))) {
    const risk = cl.resolveCreditRisk(c, feed);
    const fee = hrn.isHrn(c.nationality) && cl.hrnFeeApplies(risk.creditRiskExemption);
    const expectNoFee = ['CUST-3017', 'CUST-3026'].includes(c.customerId); // exemption Low / No in the feed
    assert.equal(fee, !expectNoFee, `${c.customerId} (${byId.get(c.customerId)?.creditRiskExemption ?? 'no feed'})`);
    assert.equal(hrn.isHrn(c.nationality), true, 'the category is still HRN: only the fee is exempt');
  }
  const gate = read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx');
  assert.match(gate, /hrnCategory && hrnFeeApplies\(risk\.creditRiskExemption\)/);
  assert.match(gate, /defaultCreditLimit\(\{ nationality: match\.nationality \}\)/, 'the limit default still follows the category, fee or not');
  assert.match(read('src/workspace/customer360/sections/BillingSection.tsx'), /hrnFeeApplies\(risk\.creditRiskExemption\)/);
});

test('11. Big Data updates the customer\'s Credit Risk', () => {
  const customer = { customerId: 'C1', creditRisk: 'High', creditRiskExemption: 'High' };
  const feed = [{ customerId: 'C1', creditRisk: 'Low', creditRiskExemption: 'Low', creditRiskUpdatedAt: '2026-10-20' }];
  assert.deepEqual(cl.creditRiskPatch(customer, feed), { creditRisk: 'Low', creditRiskExemption: 'Low', creditRiskUpdatedAt: '2026-10-20' });
  assert.equal(cl.creditRiskPatch({ ...customer, ...cl.creditRiskPatch(customer, feed) }, feed), undefined, 'already current: nothing to write');
  assert.equal(cl.creditRiskPatch(customer, []), undefined, 'no input from Big Data: the record stands');
  assert.deepEqual([cl.resolveCreditRisk(customer, feed).source, cl.resolveCreditRisk(customer, []).source, cl.resolveCreditRisk({ customerId: 'C9' }, []).source], ['Big Data', 'Customer record', undefined]);
  const layout = read('src/workspace/customer360/Customer360Layout.tsx');
  assert.match(layout, /creditRiskPatch\(/);
  assert.match(layout, /updateRecord\('customers', 'customerId', customerId, patch/);
  const known = new Set(customers.map((c) => c.customerId));
  for (const f of json('big-data-credit-risk')) assert.ok(known.has(f.customerId), `${f.bigDataId} names a customer on file`);
});

test('12. every credit-limit change is audited: new account, agent change, Credit Control approval', () => {
  const rec = cl.creditLimitAuditRecord({ recordId: 'ACC-1', fromQar: 1000, toQar: 1500, by: 'USR-1', how: 'Selected by agent', now: new Date('2026-10-22T09:00:00Z') });
  for (const k of ['auditId', 'recordType', 'recordId', 'employeeUser', 'fieldModified', 'newValue', 'timestamp']) assert.ok(k in rec, k);
  assert.deepEqual([rec.recordType, rec.fieldModified, rec.oldValue, rec.newValue, rec.employeeUser], ['Credit Limit', 'Credit Limit', 'QAR 1,000', 'QAR 1,500', 'USR-1']);
  assert.equal(cl.creditLimitAuditRecord({ recordId: 'A', toQar: 50, by: 'x', how: 'Default on a new account' }).oldValue, undefined);
  // The audit rows are shown by Customer 360's Audit Trail, which joins on the account id.
  assert.match(read('src/engines/customer360Engine.ts'), /auditTrail\.filter\(\(r\) => recordIds\.has/);
  assert.match(read('src/capabilities/BillingAccount/persistBillingAccount.ts'), /'audit-trail'/);
  assert.match(read('src/workspace/customer360/creditLimitChange.ts'), /how: 'Set by Credit Control'/);
});

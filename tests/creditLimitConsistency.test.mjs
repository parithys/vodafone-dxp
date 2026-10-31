// The credit-limit rules held ONE way across every journey and screen: one source for the account type, one reading of the limit on every Customer 360
// screen, the agent's choice carried to checkout, the exemption honoured on the card, Credit Control able to set a limit, Big Data applied at
// identification, and an audit trail that shows what changed. Expectations come from the requirement and the seeded records.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

const h = React.createElement;
const read = (f) => fs.readFileSync(f, 'utf8');
const json = (n) => JSON.parse(read(`public/mock-data/${n}.json`));

let cl, view, engine, card, model, persist, change;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  cl = await load('/src/engines/creditLimit.ts');
  view = await load('/src/workspace/customer360/creditLimitView.ts');
  engine = await load('/src/engines/customer360Engine.ts');
  card = await load('/src/components/patterns/CreditLimitCard.tsx');
  model = await load('/src/components/patterns/billingAccountModel.ts');
  persist = await load('/src/capabilities/BillingAccount/persistBillingAccount.ts');
  change = await load('/src/workspace/customer360/creditLimitChange.ts');
});
after(close);

test('1. one source for the account type: every submit reads it from the journey, and the card is told the journey\'s type', () => {
  for (const [f, journey] of [
    ['src/modules/new-connection/submitNewConnectionOrder.ts', 'postpaid'],
    ['src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts', 'postpaid'],
    ['src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts', 'postpaid'],
    ['src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts', 'fixed-line'],
    ['src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts', 'prepaid'],
  ]) {
    const src = read(f);
    assert.match(src, new RegExp(`accountTypeForJourney\\('${journey}'\\)`), f);
    assert.ok(!/'Consumer (Mobile|Fixed)[^']*'/.test(src.replace(/\/\/.*$/gm, '')), `${f} still hard-codes an account type`);
  }
  assert.equal(cl.accountTypeForJourney('fixed-line'), 'Consumer Fixed Line (GigaHome)');
  const step = read('src/capabilities/BillingAccount/step.tsx');
  assert.match(step, /accountType=\{accountTypeForJourney\(/);
  assert.match(read('src/modules/fixed-line-fibre/fixedActivation/fixedSteps.tsx'), /journey: 'fixed-line'/);
  assert.match(read('src/modules/new-connection/connectionSteps.tsx'), /values\.product === 'fixed-line' \? 'fixed-line' : 'postpaid'/);
  const html = renderToStaticMarkup(h(card.CreditLimitCard, { nationality: 'Qatari', selected: undefined, onChange() {}, accountType: cl.accountTypeForJourney('fixed-line') }));
  assert.match(html, /Account Type[\s\S]*Consumer/);
});

test('2. Customer 360 shows the Qatari / Expat segment and the HRN category, derived from the nationality in one place', () => {
  for (const f of ['src/workspace/customer360/sections/C360Overview.tsx', 'src/workspace/customer360/sections/C360AccountInformation.tsx']) {
    const src = read(f);
    assert.match(src, /creditSegmentOf\(/, f);
    assert.match(src, /customerCategoryOf\(/, f);
    assert.ok(/Customer Segment \(Qatari \/ Expat\)/.test(src) && /Customer Category \(HRN \/ Non-HRN\)/.test(src), f);
  }
});

test('3. one reading of the limit: every Customer 360 screen shows the overall figure, and it includes the deposit', async () => {
  const one = await engine.getCustomer360('CUST-1001');
  const four = await engine.getCustomer360('CUST-1004');
  const two = await engine.getCustomer360('CUST-1002');
  assert.ok(Array.isArray(one.depositBundles));
  assert.deepEqual([view.creditBreakdownOf(one).overall, view.creditBreakdownOf(one).depositIncrease], [1500, 500], 'stored 1000 + 500 deposit');
  assert.deepEqual([view.creditBreakdownOf(four).overall, view.creditBreakdownOf(four).creditControl, view.creditBreakdownOf(four).depositIncrease], [5750, 5000, 750]);
  assert.equal(view.overallCreditLimitOf(two), 1000);
  const screens = {
    'src/workspace/customer360/Customer360Layout.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/sections/BillingSection.tsx': /creditBreakdownOf\(data\)/,
    'src/workspace/customer360/sections/C360ProductsServices.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/telesales/TelesalesUsageSection.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/telesales/TelesalesConnectionsSection.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/queryFlow/QueryPreviewModal.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/sections/accountInformationResolvers.tsx': /overallCreditLimitOf\(data\)/,
    'src/workspace/customer360/sections/C360Overview.tsx': /creditBreakdownOf\(data\)/,
    'src/workspace/customer360/sections/C360AccountInformation.tsx': /creditBreakdownOf\(data\)/,
    'src/workspace/customer360/BillingAccountPage.tsx': /useCustomerCreditBreakdown\(/,
  };
  for (const [f, re] of Object.entries(screens)) assert.match(read(f), re, f);
});

test('4. the agent\'s choice reaches checkout and the order; Pre-to-Post and every journey use the rules\' default, not a fixed figure', () => {
  const elig = { defaultCreditLimitQar: 4000, nationality: 'Qatari' };
  assert.equal(model.effectiveCreditLimitQar(elig, { creatingNew: true, newAccount: { creditLimitQar: 1500 } }), 1500);
  assert.equal(model.effectiveCreditLimitQar(elig, { creatingNew: true, newAccount: {} }), 4000, 'no choice: the default');
  assert.equal(model.effectiveCreditLimitQar({ defaultCreditLimitQar: 1000, nationality: 'Indian' }, { creatingNew: true, newAccount: { creditLimitQar: 4000 } }), 1000, 'a value outside the options is ignored');
  assert.equal(model.effectiveCreditLimitQar({ defaultCreditLimitQar: 50, nationality: 'Kenyan' }, { creatingNew: true, newAccount: { creditLimitQar: 1000 } }), 50, 'HRN: no choice');
  assert.equal(model.effectiveCreditLimitQar(elig, { selectedProfileId: 'BILL-1', newAccount: { creditLimitQar: 1500 } }), 4000, 'an existing account keeps its own limit: the card choice does not apply');
  assert.match(read('src/capabilities/CheckoutSummary/step.tsx'), /creditLimitQar=\{effectiveCreditLimitQar\(/);
  assert.match(read('src/components/patterns/useCheckoutSummary.ts'), /creditLimitOverride \?\? eligibility\?\.defaultCreditLimitQar/);
  const pre = read('src/modules/pre-to-post-migration/screens/BaseManagementWizard.tsx');
  assert.ok(!/creditLimit: 1000/.test(pre));
  assert.match(pre, /defaultCreditLimitFor\(qid\.moiResult\?\.nationality\)/);
});

test('5. the card lists account type, segment and category, then the credit limit: the default for the segment, QAR 50 and locked for an HRN customer', () => {
  const html = (props) => renderToStaticMarkup(h(card.CreditLimitCard, { onChange() {}, selected: undefined, ...props }));
  const expat = html({ nationality: 'Egyptian' });
  for (const label of ['Account Type', 'Customer Segment', 'Customer Category', 'Credit Limit (QAR)']) assert.match(expat, new RegExp(label.replace(/[()]/g, '\\$&')));
  assert.ok(!/Default Credit Limit|Amount Payable/.test(expat), 'the card no longer restates the default or the amount payable');
  assert.match(expat, /<input[^>]*role="combobox"[^>]*value="QAR 1,000"/, 'an Expat starts on QAR 1,000, in a dropdown');
  const hrn = html({ nationality: 'Kenyan' });
  assert.ok(!/role="combobox"/.test(hrn), 'an HRN customer has no dropdown');
  assert.match(hrn, /Credit Limit \(QAR\)<\/dt><dd[^>]*>QAR 50</, 'it is a plain row: QAR 50');
  assert.ok(!/not allowed for an HRN customer/.test(hrn), 'and no explanation is shown');
  assert.ok(!/role="combobox"/.test(html({ nationality: 'Egyptian', customerSegment: 'Royal' })), 'a protected segment cannot choose either');
});

test('6. the fixed-line journey follows the same rules: default, nationality and agent reach the account and its limit record', async () => {
  const src = read('src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts');
  for (const k of ['creditLimitQar: eligibility?.defaultCreditLimitQar', 'nationality: eligibility?.nationality', 'agentId: currentAgentId()']) assert.ok(src.includes(k), k);
  const created = [];
  await persist.persistBillingAccount({ creatingNew: true, newAccount: { creditLimitQar: 1500 } }, { createRecord: async (kind, rec) => void created.push({ kind, rec }), kind: cl.accountTypeForJourney('fixed-line'), customerId: 'C1', creditLimitQar: cl.defaultCreditLimitFor('Qatari'), nationality: 'Qatari', agentId: 'USR-1' });
  assert.equal(created.find((c) => c.kind === 'accounts').rec.accountType, 'Consumer Fixed Line (GigaHome)');
  assert.equal(created.find((c) => c.kind === 'credit-limits').rec.creditLimitQar, 1500, 'judged as a Qatari: 1500 is one of the options');
  assert.match(read('src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts'), /prepaid account carries no credit limit/);
  assert.ok(!created.some((c) => c.kind === 'accounts' && /Prepaid/.test(c.rec.accountType)));
});

test('7. Credit Control can set a limit: an agent requests it, approval makes it Credit Control\'s, and an agent can then no longer change it', async () => {
  const drawer = read('src/workspace/customer360/AccountEditDrawer.tsx');
  assert.match(drawer, /orderType: CREDIT_LIMIT_CHANGE_ORDER_TYPE/);
  assert.match(drawer, /approverRole: COLLECTION_TEAM_ROLE/);
  assert.match(drawer, /canRequest = policy\.lock !== 'protected-segment' && policy\.lock !== 'hrn'/, 'no request for a protected segment or HRN customer');
  assert.ok(drawer.indexOf('setRequestError(') < drawer.indexOf("await updateRecord('accounts'"), 'a bad request is refused before anything is saved');
  const calls = [];
  const deps = { list: async () => [{ id: 'CRL-1', customerId: 'C1', creditLimitQar: 1000 }], updateRecord: async (...a) => void calls.push(['update', ...a]), createRecord: async (...a) => void calls.push(['create', ...a]) };
  const before = cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Egyptian', creditControlLimitQar: null });
  assert.equal(before.editable, true);
  await change.applyCreditLimitChange({ customerId: 'C1', creditLimitQar: 3000, accountId: 'ACC-1', by: 'USR-CC' }, deps, '2026-10-22');
  const patch = calls[0][4];
  assert.equal(patch.creditControlLimitQar, 3000);
  assert.equal(cl.creditLimitPolicy({ segment: 'Consumer', nationality: 'Egyptian', creditControlLimitQar: patch.creditControlLimitQar }).lock, 'credit-control');
  assert.equal(calls[1][2].changeBasis, 'Set by Credit Control');
});

test('8. Big Data updates the Credit Risk at identification, once, and the result is stable', () => {
  const gate = read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx');
  assert.match(gate, /creditRiskPatch\(match as CreditRiskSource/);
  assert.match(gate, /useEntityStore\.getState\(\)\.updateRecord\('customers', 'customerId', match\.customerId, riskPatch/);
  assert.match(gate, /appliedRiskUpdates/);
  const feed = json('big-data-credit-risk');
  const customers = json('customers');
  for (const f of feed) {
    const c = customers.find((x) => x.customerId === f.customerId);
    const patch = cl.creditRiskPatch(c, feed);
    assert.ok(patch, `${f.customerId}: the record differs from Big Data, so it is updated`);
    assert.equal(cl.creditRiskPatch({ ...c, ...patch }, feed), undefined, `${f.customerId}: once written, nothing more to write`);
    assert.equal(cl.resolveCreditRisk({ ...c, ...patch }, feed).source, 'Big Data');
  }
});

test('9. the audit trail shows what changed and how, and finds the rows that belong to the customer', async () => {
  const section = read('src/workspace/customer360/sections/AuditTrailSection.tsx');
  assert.match(section, /key: 'oldValue', header: 'Old Value'/);
  assert.match(section, /key: 'changeBasis', header: 'How'/);
  assert.match(read('src/workspace/customer360/telesales/TelesalesAuditSection.tsx'), /old: str\(a\.oldValue\)/);
  assert.match(read('src/engines/customer360Engine.ts'), /recordIds\.has\(r\.recordId as string\) \|\| r\.recordId === customerId/);
  const rec = cl.creditLimitAuditRecord({ recordId: 'ACC-9', fromQar: 1000, toQar: 1500, by: 'USR-1', how: 'Selected by agent' });
  assert.deepEqual([rec.oldValue, rec.newValue, rec.changeBasis], ['QAR 1,000', 'QAR 1,500', 'Selected by agent']);
  // A change keyed by the customer (no account yet) is found on that customer's page.
  const created = [];
  await change.applyCreditLimitChange({ customerId: 'C-NOACC', creditLimitQar: 800 }, { list: async () => [], updateRecord: async () => {}, createRecord: async (k, r) => void created.push({ k, r }) }, '2026-10-22');
  assert.equal(created.find((c) => c.k === 'audit-trail').r.recordId, 'C-NOACC');
});

// A journey opened for a known customer (Change Postpaid Plan, Change Prepaid Pack, Add Add-On) scans THAT customer's document.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

test('scan candidates are the acted-for customer\'s own documents, QID first', async () => {
  const { selectScanCandidates } = await load('/src/components/patterns/idLookupModel.ts');
  const docs = [
    { customerId: 'A', documentType: 'Passport', documentNumber: 'P1' },
    { customerId: 'B', documentType: 'QID', documentNumber: 'Q2' },
    { customerId: 'A', documentType: 'QID', documentNumber: 'Q1' },
  ];
  const own = docs.filter((d) => d.customerId === 'A');
  const out = selectScanCandidates({ docs, ownDocs: own, chosenType: undefined, detectable: ['QID', 'Passport'] });
  assert.deepEqual(out.map((d) => d.documentNumber), ['Q1', 'P1']);
});

test('known-customer journeys hand the customer to the scan, eligibility and barcode simulator', () => {
  const step = fs.readFileSync('src/capabilities/CustomerQualification/step.tsx', 'utf8');
  assert.equal((step.match(/existingCustomerId : actedForId/g) ?? []).length, 2);
  assert.match(fs.readFileSync('src/components/patterns/wizard/useJourneyStartResume.ts', 'utf8'), /LAUNCH_CUSTOMER_KEY\]: launchCustomerId/);
  assert.match(step, /values\[LAUNCH_CUSTOMER_KEY\]/);
  assert.match(fs.readFileSync('src/components/domain/QidInput.tsx', 'utf8'), /barcodeNumber \?\? BARCODE_DEMO_NUMBERS/);
});

test('scan and eligibility resolve the customer through the shared acted-for hook (context persists across sidebar launches)', () => {
  const read = (f) => fs.readFileSync(f, 'utf8');
  const hook = read('src/components/patterns/useActedForCustomer.ts');
  assert.match(hook, /if \(asNewCustomer\) return undefined;/);
  assert.match(hook, /explicitCustomerId \?\? contextCustomerId/);
  assert.match(read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx'), /useActedForCustomer\(explicitCustomerId, asNewCustomer\)/);
  // The lookup also takes `unbound` (identifying someone other than the customer on screen, e.g. an actual user): then no context customer applies.
  assert.match(read('src/components/patterns/useIdLookup.ts'), /useActedForCustomer\(explicitCustomerId, asNewCustomer \|\| unbound\)/);
});



test('Change Postpaid Plan, Change Prepaid Pack and Add Add-On skip the line limit; the other journeys keep it', async () => {
  const src = fs.readFileSync('src/modules/mobile-service-changes/serviceChangeSteps.tsx', 'utf8');
  const plan = src.slice(src.indexOf('export function changePostpaidPlanSteps'), src.indexOf('export function changePrepaidPackSteps'));
  assert.match(plan, /skipLineLimit: true/);
  assert.match(src.slice(src.indexOf('export function addAddonSteps')), /skipLineLimit: true/);
  assert.match(src.slice(src.indexOf('export function changePrepaidPackSteps'), src.indexOf('export function addAddonSteps')), /skipLineLimit: true/);
  assert.equal((src.match(/skipLineLimit: true/g) ?? []).length, 3);
  assert.match(fs.readFileSync('src/capabilities/EligibilityGate/EligibilityGateStep.tsx', 'utf8'), /skipLineLimit\s*\? \{ pass: true/);
});
test('the line-change routes are guarded by their feature grants', () => {
  const router = fs.readFileSync('src/router.tsx', 'utf8');
  for (const [path, key] of [['change-postpaid-plan', 'mobile.change-postpaid-plan'], ['change-prepaid-pack', 'mobile.change-prepaid-pack'], ['add-addon', 'mobile.add-addon']]) {
    assert.match(router, new RegExp(`path="/mobile/${path}" element=\\{<RequireFeature featureKey="${key.replace('.', '\\.')}">`), path);
  }
});

test('a consumer billing profile carries its own customer\'s contact, not another customer\'s', () => {
  const read = (f) => JSON.parse(fs.readFileSync(`public/mock-data/${f}.json`, 'utf8'));
  const customers = new Map(read('customers').map((c) => [c.customerId, c]));
  const owner = new Map(read('accounts').map((a) => [a.billingProfileId, a.customerId]));
  const bad = read('billing-profiles').filter((b) => {
    const c = customers.get(owner.get(b.billingProfileId));
    return c && c.segment !== 'Enterprise (EBU)' && c.email && b.billingContactEmail !== c.email;
  });
  assert.deepEqual(bad.map((b) => b.billingProfileId), []);
});

test('checkout shows the plan\'s own bill limit (never above the credit limit) when the agent set none, as Plan & Add-ons does', () => {
  for (const f of ['src/components/patterns/checkoutDetailedTables.ts', 'src/components/patterns/CheckoutDefaultLayout.tsx']) {
    assert.match(fs.readFileSync(f, 'utf8'), /billLimit \?\? \(plan \? defaultBillLimitQar\(plan\.mrcQAR, creditLimitQar\)/, f);
  }
});


test('the presented ID decides who is identified; the selected customer only steers the scanner', () => {
  const lookup = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.match(lookup, /\(boundHoldsIt \? explicitCustomerId : match\.customerId\)/);
  assert.doesNotMatch(lookup, /opts\.forceCustomerId \?\? asCustomerId/);
  assert.match(lookup, /setOwnerMismatch\(/);
  const elig = fs.readFileSync('src/capabilities/EligibilityGate/EligibilityGateStep.tsx', 'utf8');
  assert.match(elig, /docs\.find\(\(d\) => d\.documentNumber === idNumber\) \?\?[\s\S]*?\(asCustomerId/);
});
test('a journey opened for a customer is never a New Customer journey, whatever its flow', () => {
  const step = fs.readFileSync('src/capabilities/CustomerQualification/step.tsx', 'utf8');
  assert.match(step, /const asNewCustomer = flow === 'new' && !knownCustomer && !launchedFor;/);
  assert.match(step, /const actedForId = knownCustomer \? \(knownCustomerId \?\? launchedFor\) : launchedFor;/);
  const product = fs.readFileSync('src/modules/new-connection/steps/ProductEligibility.tsx', 'utf8');
  assert.match(product, /asNewCustomer=\{flow === 'new' && !values\[LAUNCH_CUSTOMER_KEY\] && !contact\.moiResult\?\.linkedIdUpdate\}/);
});

test.after(close);

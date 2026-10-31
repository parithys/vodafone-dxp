import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test.before(boot);
test.after(close);

test('B2B2C: the accepted customer type decides; an employer on the record decides only when no type was chosen', async () => {
  const { isB2B2COrder } = await load('/src/modules/new-connection/approvalRouting.ts');
  const employed = { isB2B2C: true };
  const plain = { isB2B2C: undefined };
  assert.equal(isB2B2COrder(employed, undefined), true, 'no customer type chosen: the employer stands');
  assert.equal(isB2B2COrder(employed, { type: 'none' }), false, 'Standard chosen: not B2B2C');
  assert.equal(isB2B2COrder(employed, { type: 'none', rejected: true }), false, 'benefit rejected: not B2B2C');
  assert.equal(isB2B2COrder(employed, { type: 'retired' }), false);
  assert.equal(isB2B2COrder(plain, { type: 'b2b2c' }), true, 'accepted B2B2C');
  assert.equal(isB2B2COrder(plain, { type: 'b2b2c', rejected: true }), false);
  assert.equal(isB2B2COrder(plain, undefined), false);
});

test('Product eligibility is clear only when judged for this product (line type, port-in) and with the line count judged', async () => {
  const { productEligibilityClear } = await load('/src/modules/new-connection/steps/productChoice.ts');
  const base = { scope: 'product', journeyType: 'postpaid', hardStop: false, softStop: false, checks: [] };
  const mobile = { ...base, connectionType: 'MOBILE_POSTPAID' };
  assert.equal(productEligibilityClear({ product: 'postpaid', eligibility: mobile }), true);
  assert.equal(productEligibilityClear({ product: 'postpaid', eligibility: base }), true, 'older result without a type reads as mobile');
  assert.equal(productEligibilityClear({ product: 'fixed-line', homeProduct: 'fibre', eligibility: mobile }), false);
  assert.equal(productEligibilityClear({ product: 'fixed-line', homeProduct: 'fibre', eligibility: { ...base, connectionType: 'FIXED_FWA' } }), true);
  assert.equal(productEligibilityClear({ product: 'mnp', mnpType: 'postpaid', eligibility: mobile }), false, 'not judged as a port-in');
  assert.equal(productEligibilityClear({ product: 'mnp', mnpType: 'postpaid', eligibility: { ...mobile, portIn: true } }), true);
  assert.equal(productEligibilityClear({ product: 'postpaid', eligibility: { ...mobile, lineLimitSkipped: true } }), false);
});

test('Customer Verification of a product-agnostic journey does not judge the line count; the gate never reuses such a result', () => {
  const q = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(q, /skipLineLimit=\{skipLineLimit \|\| productAgnostic\}/);
  const g = read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx');
  assert.match(g, /Boolean\(result\.lineLimitSkipped\) === skipLineLimit/);
  assert.match(g, /lineLimitSkipped: skipLineLimit/);
});

test('A bound journey refuses a registry-only ID that no customer holds, instead of creating a new customer', () => {
  const look = read('src/components/patterns/useIdLookup.ts');
  assert.match(look, /explicitCustomerId && !asNewCustomer && !opts\.forceCustomerId && nasRecord && !docMatch && !wantedId && !linked/);
});

test('Billing auto-resolver selects only an account of the journey\'s type', () => {
  const r = read('src/components/patterns/BillingAccountAutoResolver.tsx');
  assert.match(r, /a\.accountType === accountType \|\| a\.accountType\.startsWith/);
  assert.match(read('src/capabilities/BillingAccount/step.tsx'), /accountType=\{accountTypeForJourney\(/);
  assert.match(read('src/capabilities/CustomerQualification/step.tsx'), /accountType=\{accountTypeForJourney\('postpaid'\)\}/);
});

test('Handing an existing customer over to New Home Connection stays in the existing flow', () => {
  const c = read('src/modules/new-connection/steps/productChoice.ts');
  assert.match(c, /ctx\.flow === 'existing' && ctx\.existingCustomerId \? `\$\{HOME_WIZARD_ID_BY_FLOW\.existing\}-\$\{ctx\.existingCustomerId\}`/);
  assert.match(read('src/modules/new-connection/steps/homeConnectionRoute.ts'), /\/fibre-home\/start-connection\/existing\//);
});

test('Bill limit cannot exceed the credit limit', () => {
  const e = read('src/components/domain/BillLimitEditor.tsx');
  assert.match(e, /amount > maxLimit/);
  assert.match(e, /r\.pass && !overCredit\(amount\)/);
  const s = read('src/capabilities/PlanSelection/postpaidStep.tsx');
  assert.match(s, /billLimitMax=\{eligibility\?\.defaultCreditLimitQar\}/);
  assert.match(s, /limit > cap/);
});

test('The Reserved tab lists only holds placed for the customer being served', () => {
  const m = read('src/components/domain/MsisdnPicker.tsx');
  assert.match(m, /n\.reservedForQid === customerIdNumber/);
  assert.match(read('src/capabilities/NumberSelection/step.tsx'), /customerIdNumber=\{\(values\.contact/);
});

test('Reserved Numbers: always a tab, first when the customer has holds, by customer not agent, at most two, newest first', () => {
  const m = read('src/components/domain/MsisdnPicker.tsx');
  assert.match(m, /n\.status === 'Reserved' && Boolean\(customerIdNumber\) && n\.reservedForQid === customerIdNumber/);
  assert.doesNotMatch(m, /reservedBy === agentName/, 'a hold is the customer\'s, not the agent\'s');
  assert.match(m, /\.slice\(0, MAX_RESERVATIONS_PER_AGENT\)/);
  assert.match(m, /heldReservations > 0\s*\? TAB_ORDER\s*: PORTAL_TAB_ORDER/, 'first with holds, last (with its empty state) without');
  assert.match(m, /No numbers have been reserved for this customer\./);
  assert.match(m, /Reserved \{formatDateTime\(n\.reservedAt\)\}/);
});

test('the default bill limit is the plan charge, never above the credit limit', async () => {
  const { defaultBillLimitQar } = await load('/src/engines/postpaidPricing.ts');
  assert.equal(defaultBillLimitQar(115, 50), 50);
  assert.equal(defaultBillLimitQar(115, 4000), 115);
  assert.equal(defaultBillLimitQar(115, undefined), 115);
  assert.equal(defaultBillLimitQar(50, 50), 50);
});

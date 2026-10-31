// Waive Off on Number Selection: Partial (half) or Full waiver of the Star number's upfront charge, carried to Checkout, Payment and the order.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
const read = (p) => fs.readFileSync(p, 'utf8');
before(boot);
after(close);

test('the waiver is a fixed amount: nothing without one or without a charge, the amount itself, never more than the charge; conservation (waived + payable = charge)', async () => {
  const w = await load('/src/engines/numberWaiver.ts');
  assert.equal(w.waivedQar(1000, undefined), 0);
  assert.equal(w.waivedQar(0, 2000), 0);
  assert.equal(w.waivedQar(-5, 2000), 0);
  assert.equal(w.waivedQar(25000, 2000), 2000, 'a fixed QAR 2,000, not a percentage');
  assert.equal(w.chargeAfterWaiverQar(25000, 2000), 23000);
  assert.equal(w.waivedQar(1000, 5000), 1000, 'never more than the charge');
  assert.equal(w.waivedQar(1000, 0), 0);
  for (const charge of [0, 1, 47125, 333.33, 999.99]) for (const amount of [undefined, 0, 1, 250.5, 100000]) {
    assert.equal(Math.round((w.waivedQar(charge, amount) + w.chargeAfterWaiverQar(charge, amount)) * 100) / 100, charge, `${charge} ${amount}`);
  }
  assert.equal(w.isNumberWaiver(2000), true);
  assert.equal(w.isNumberWaiver('full'), false);
  assert.equal(w.isNumberWaiver(0), false);
  assert.equal(w.isNumberWaiver(-5), false);
  assert.equal(w.waiverAmountProblem(2000, 25000), undefined);
  assert.ok(w.waiverAmountProblem(0, 25000));
  assert.ok(w.waiverAmountProblem(undefined, 25000));
  assert.ok(w.waiverAmountProblem(30000, 25000), 'more than the charge');
  assert.doesNotMatch(read('src/capabilities/NumberSelection/WaiveOff.tsx'), /Partial|Full|%/, 'no percentage options');
});

test('Waive Off sits before Continue on the number step, only for a journey that asks for it, and a new number drops the waiver', async () => {
  const { numberSelectionStep } = await load('/src/capabilities/NumberSelection/step.tsx');
  assert.equal(numberSelectionStep({}).primaryAction, undefined, 'no Waive Off unless asked for');
  const step = numberSelectionStep({ waiveOff: true, priceField: 'numberPriceQAR', plan: () => ({ mrcQar: 115, starEntitlementQar: 2875 }) });
  assert.equal(typeof step.primaryAction, 'function');
  assert.match(read('src/capabilities/NumberSelection/step.tsx'), /if \(msisdn !== values\.msisdn\) setValue\('numberWaiver', undefined\)/);
  assert.match(read('src/modules/new-connection/postpaidSteps.tsx'), /waiveOff: true/);
  assert.ok((await load('/src/modules/new-connection/products.ts')).PRODUCT_OWNED_KEYS.includes('numberWaiver'));
});

test('Checkout, the customer view, the order and its approval carry the waiver', () => {
  const hook = read('src/components/patterns/useCheckoutSummary.ts');
  assert.match(hook, /dueTodayQar = numberPayableQar \+ hrnAdvance/);
  assert.match(read('src/components/patterns/checkoutDetailedTables.ts'), /Number Charge After Waiver/);
  assert.match(read('src/components/patterns/CheckoutDefaultLayout.tsx'), /numberWaiverLabel\(numberWaiver\)/);
  assert.match(read('src/components/patterns/checkoutSummaryRows.ts'), /waived off the Star Number charge/);
  const order = read('src/modules/new-connection/submitNewConnectionOrder.ts');
  assert.match(order, /waived \|\|/, 'a waiver routes the order for approval');
  assert.match(order, /numberWaivedQAR: waivedAmountQar/);
  assert.match(order, /waived off the Star number upfront charge/);
  assert.match(read('src/capabilities/Payment/step.tsx'), /checkoutTotals as CheckoutTotals \| undefined\)\?\.dueTodayQar/, 'Payment reads the revised due-today figure');
});

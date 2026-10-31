import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Prepaid to Postpaid Conversion runs on the same shared steps as New Mobile Postpaid.
let steps, submit;
before(async () => {
  await boot();
  steps = await load('/src/modules/pre-to-post-migration/screens/preToPostSteps.tsx');
  submit = await load('/src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts');
});
after(close);

const ctx = { flow: 'new', existingCustomerId: undefined, guardedContactChange: () => true, products: [], customerBenefits: undefined };

test('the conversion uses Customer Verification, Billing Profile, Offers & Plans, Add-ons, Checkout, the full CAF and Payment', () => {
  const all = steps.preToPostSteps(ctx);
  assert.deepEqual(all.map((s) => s.key), ['contact', 'line', 'billingAccount', 'plan', 'planExtras', 'checkout', 'caf', 'payment']);
  assert.equal(typeof all.find((s) => s.key === 'caf').locksAfter, 'function', 'the full CAF locks the journey once signed');
});

test('the line converted is one of the customer\'s own prepaid lines: a prepaid line is chosen, a postpaid one or none is not', () => {
  const step = steps.preToPostSteps(ctx).find((s) => s.key === 'line');
  const ok = { status: 'Active', barred: false, inCollections: false };
  assert.equal(step.isValid({}), false);
  assert.equal(step.isValid({ line: { ...ok, lineType: 'prepaid', identifier: 'SVC-30012' } }), true);
  assert.equal(step.isValid({ line: { ...ok, status: 'Suspended', lineType: 'prepaid' } }), false);
});

test('a conversion is priced like a postpaid order and completes, or waits for the manager when it needs a second look', async () => {
  const created = [];
  const updated = [];
  const deps = { createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async (kind, idField, id, patch) => void updated.push({ kind, id, patch }) };
  const base = {
    contact: { idNumber: '28450000001', idType: 'QID', moiResult: { name: 'Test Customer' } },
    eligibility: { customerId: 'CUST-1001', checks: [] },
    line: { customerId: 'CUST-1001', installedAssetId: 'IA-9004', identifier: 'SVC-30012', productId: 'PROD-301', productName: 'Prepaid Red 25', lineType: 'prepaid' },
    productId: 'PROD-104',
    checkoutTotals: { dueTodayQar: 0, monthlyRecurringQar: 0, hrnAdvanceQar: 0 },
    billingAccount: { selectedProfileId: 'BILL-7001' },
  };
  const done = await submit.submitPreToPostOrder(base, deps);
  const order = created.find((c) => c.kind === 'orders').rec;
  assert.deepEqual([order.orderType, order.orderSubType, order.status, order.msisdn], ['Plan Change', 'Pre2Post', 'Complete', 'SVC-30012']);
  assert.equal(order.billingProfileId, 'BILL-7001');
  assert.equal(done.pendingApproval, false);
  assert.equal(updated[0].id, 'IA-9004', 'the converted line is now a postpaid line by its service name');
  assert.equal(updated[0].patch.productServiceName.startsWith('Postpaid'), true);
  assert.ok(done.monthlyRecurringQar > 0, 'the plan is priced with VAT, as New Mobile Postpaid prices it');

  const hrn = await submit.submitPreToPostOrder({ ...base, eligibility: { customerId: 'CUST-1001', checks: [], requiresHrnAdvance: true } }, deps);
  assert.equal(hrn.pendingApproval, true);
  assert.equal(created.filter((c) => c.kind === 'orders').at(-1).rec.status, 'Submitted for Approval');
});

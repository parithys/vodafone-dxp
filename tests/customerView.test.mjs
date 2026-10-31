// "Customer view" is offered on the same screens in every journey: one policy, keyed by the shared step keys.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load, close } from './harness.mjs';

test('Customer view is offered on Recommended Offers, Plans & Offers, Number Selection, Checkout, CAF & Signature and Order Submitted only', async () => {
  const { hasCustomerView } = await load('/src/components/patterns/wizard/customerViewPolicy.ts');
  for (const key of ['product', 'crossSales', 'plan', 'number', 'checkout', 'caf', 'order-submitted']) assert.equal(hasCustomerView(key), true, key);
  for (const key of ['contact', 'productSelection', 'addons', 'planExtras', 'donor-attachment', 'homeKind', 'mnpType', 'installation', 'line',  'sim', 'simType', 'address', 'billingAccount', 'payment', 'cart', 'subscriptions', 'appointment', 'activity', undefined]) {
    assert.equal(hasCustomerView(key), false, String(key));
  }
});

test('no step decides Customer view for itself', async () => {
  const { execSync } = await import('node:child_process');
  assert.equal(execSync('grep -rn hideCustomerView src || true').toString().trim(), '');
});

test.after(close);

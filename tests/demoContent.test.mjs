// The Demo Content column explains every order in plain telecom wording, seeded or created in the app.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let describe;
before(async () => {
  await boot();
  ({ describeOrderScenario: describe } = await load('/src/modules/order-management/demoContentColumn.tsx'));
});
after(close);

test('demo content: a seeded order shows its own scenario text', () => {
  assert.deepEqual(describe({ demoTitle: 'Passport ID', demoDetail: 'x' }), { title: 'Passport ID', detail: 'x' });
});

test('demo content: a line-limit order names the limit and the approving team', () => {
  const r = describe({ approvalReason: 'Active postpaid line limit reached - 2/2', approverRole: 'Credit Control', status: 'Submitted for Approval' });
  assert.equal(r.title, 'Line-limit approval');
  assert.equal(r.detail, 'Customer has reached the allowed postpaid line limit. The order requires Credit Control approval.');
});

test('demo content: an order routed for its ID type is named as Credit Control', () => {
  const r = describe({ approvalReason: 'ID type requires Credit Control approval - routed to Credit Control', approverRole: 'Credit Control' });
  assert.equal(r.title, 'ID type routed to Credit Control');
  assert.match(r.detail, /requires Credit Control approval\.$/);
});

test('demo content: an ID-type order is routed to Back Office Fulfilment', () => {
  const r = describe({ approvalReason: 'ID type cannot be sold directly - routed to Back Office Fulfilment approval workflow', approverRole: 'Back Office Fulfilment' });
  assert.equal(r.title, 'ID type routed to Back Office Fulfilment Agent');
  assert.match(r.detail, /requires Back Office Fulfilment approval\.$/);
});

test('demo content: combined reasons read as one scenario with a single approval sentence', () => {
  const r = describe({ approvalReason: 'ID type cannot be sold directly - x | HRN customer - QAR 100 advance payment applies' });
  assert.equal(r.title, 'ID type routed to Back Office Fulfilment Agent + HRN advance');
  assert.equal(r.detail.match(/requires approval/g).length, 1);
});

test('demo content: an order with no approval reason falls back to its status', () => {
  assert.equal(describe({ status: 'Complete' }).title, 'Standard customer');
  assert.equal(describe({ status: 'Draft' }).title, 'Saved draft');
});

// Approval workflow audit: the people authorised to decide an approval are offered Approve / Reject, nobody else is,
// and nothing is offered once a decision has been made. Role, grant and order-state rules are checked together.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const json = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const personas = json('public/config/personas.json');
const agents = json('public/mock-data/users-agents.json');
const matrix = json('public/config/approval-matrix.json');
const jobOf = (p) => agents.find((u) => u.userId === p.identityUserId)?.jobTitle;
const grant = (p, key) => p.features.find((f) => f.key === key)?.level;

let auth;
before(async () => {
  await boot();
  auth = await load('/src/engines/approvalAuthority.ts');
});
after(close);

// The kinds of awaiting order the app produces: each approval-matrix category, plus the two routings the New Connection
// wizard applies itself (line limit -> Credit Control, manual ID entry -> Sales Manager).
const KINDS = [
  ...matrix.map((m) => ({ label: m.category, orderType: m.category, approverRole: undefined, required: m.requiredRole })),
  { label: 'line limit', orderType: 'New Postpaid Activation', approverRole: 'Credit Control', required: 'Credit Control' },
  { label: 'manual ID entry', orderType: 'New Postpaid Activation', approverRole: 'Sales Manager', required: 'Sales Manager' },
];
const decide = (p, k, status = 'Submitted for Approval') =>
  auth.orderApprovalAuthority({ personaId: p.id, jobTitle: jobOf(p), status, orderType: k.orderType, approverRole: k.approverRole });

test('approvals: every role an order is routed to can approve and reject it', () => {
  for (const k of KINDS) {
    const approvers = personas.filter((p) => jobOf(p) === k.required);
    assert.ok(approvers.length > 0, `no role has the job title "${k.required}" that "${k.label}" orders are routed to`);
    for (const p of approvers) {
      assert.equal(grant(p, 'orders.approval-queue'), 'Approve', `${p.name} lacks Approve on the approval queue`);
      assert.equal(grant(p, 'orders.approval-detail'), 'Approve', `${p.name} lacks Approve on the approval detail`);
      assert.equal(decide(p, k).mayDecide, true, `${p.name} cannot decide a "${k.label}" order`);
    }
  }
});

test('approvals: nobody else is offered the buttons, and is told why', () => {
  for (const k of KINDS) {
    for (const p of personas.filter((x) => jobOf(x) !== k.required)) {
      const a = decide(p, k);
      assert.equal(a.mayDecide, false, `${p.name} may decide a "${k.label}" order`);
      assert.ok(['no-grant', 'wrong-role'].includes(a.blockedBy));
      assert.ok(auth.approvalBlockMessage('order', a), `${p.name} sees no explanation on a "${k.label}" order`);
    }
  }
});

test('approvals: a role without the Approve permission never decides, even with the right job title', () => {
  const credit = personas.find((p) => p.name === 'Credit Control');
  const a = auth.orderApprovalAuthority({ personaId: credit.id, jobTitle: 'Credit Control', status: 'Submitted for Approval', orderType: 'New Postpaid Activation', approverRole: 'Credit Control' });
  assert.equal(a.mayDecide, true);
  const viewOnly = personas.find((p) => p.name === 'View Only');
  assert.equal(grant(viewOnly, 'orders.approval-detail'), 'View');
  const b = auth.orderApprovalAuthority({ personaId: viewOnly.id, jobTitle: 'Credit Control', status: 'Submitted for Approval', orderType: 'New Postpaid Activation', approverRole: 'Credit Control' });
  assert.equal(b.mayDecide, false);
  assert.equal(b.blockedBy, 'no-grant');
});

test('approvals: no buttons for an order that is not awaiting a decision', () => {
  for (const status of ['Complete', 'Draft', 'Pending', 'Open', 'Cancelled', 'Rejected - Correction', 'Approved']) {
    for (const k of KINDS) {
      for (const p of personas.filter((x) => jobOf(x) === k.required)) {
        const a = decide(p, k, status);
        assert.equal(a.mayDecide, false, `${p.name} is offered Approve on a "${status}" order`);
        assert.equal(a.blockedBy, 'not-awaiting');
        assert.equal(auth.approvalBlockMessage('order', a), undefined, 'a decided order needs no warning');
      }
    }
  }
});

test('approvals: the queue lets exactly the deciding roles claim an order', () => {
  for (const k of KINDS) {
    for (const p of personas) {
      const claim = auth.mayClaimOrder({ personaId: p.id, jobTitle: jobOf(p), orderType: k.orderType, approverRole: k.approverRole });
      assert.equal(claim, decide(p, k).mayDecide, `${p.name} / "${k.label}": claim and decide disagree`);
    }
  }
});

test('approvals: only roles named by the approval rules (or oversight roles) hold Approve on order approvals', () => {
  const routed = new Set(KINDS.map((k) => k.required));
  const oversight = new Set(['Supervisor']); // grants Approve for unrouted order types; the matrix names no other role for them
  for (const p of personas) {
    if (grant(p, 'orders.approval-detail') !== 'Approve') continue;
    assert.ok(routed.has(jobOf(p)) || oversight.has(jobOf(p)), `${p.name} (${jobOf(p)}) holds Approve on order approvals but no order is routed to it`);
  }
});

test('approvals: SIM swap decisions need Edit on the queue and an order that is awaiting', () => {
  for (const p of personas) {
    const level = grant(p, 'numbers.sim-swap-queue');
    const a = auth.simSwapDecisionAuthority({ personaId: p.id, status: 'Submitted for Approval' });
    assert.equal(a.mayDecide, level === 'Edit' || level === 'Approve' || level === 'Full', `${p.name} (${level}) SIM swap decision`);
    assert.equal(auth.simSwapDecisionAuthority({ personaId: p.id, status: 'Approved/Completed' }).mayDecide, false);
  }
});

// ---- Cross-role flow: one shared set of orders, seen differently by each role --------------------------------------
const byName = (n) => personas.find((p) => p.name === n);
const who = (p) => ({ personaId: p.id, jobTitle: jobOf(p), userId: p.identityUserId });
const lineCapOrder = (over = {}) => ({ orderId: 'ORD-X1', orderType: 'New Postpaid Activation', status: 'Submitted for Approval', approverRole: 'Credit Control', createdBy: 'USR-1101', ...over });

test('shared state: an order submitted by Retail Sales appears in the Credit Control queue and nobody else\'s', () => {
  const orders = [lineCapOrder()];
  const mine = (n) => auth.ordersAwaitingDecisionBy(orders, who(byName(n))).map((o) => o.orderId);
  assert.deepEqual(mine('Credit Control'), ['ORD-X1']);
  for (const n of ['Retail Sales', 'Back Office Fulfilment', 'View Only', 'Customer Care']) assert.deepEqual(mine(n), [], `${n} should not have ORD-X1 in its queue`);
});

test('shared state: an order claimed by one approver leaves everyone else\'s queue', () => {
  const orders = [lineCapOrder({ assignedApproverId: 'USR-9999' })];
  assert.deepEqual(auth.ordersAwaitingDecisionBy(orders, who(byName('Credit Control'))), []);
  assert.equal(auth.ordersAwaitingDecisionBy(orders, { ...who(byName('Credit Control')), userId: 'USR-9999' }).length, 1);
});

test('shared state: the decision reaches the creator, newest first, and only for their own orders', () => {
  const orders = [lineCapOrder({ status: 'Rejected - Correction' }), lineCapOrder({ orderId: 'ORD-X2', status: 'Complete' }), lineCapOrder({ orderId: 'ORD-X3', status: 'Complete', createdBy: 'USR-5555' })];
  const acts = [
    { orderId: 'ORD-X1', actionTaken: 'Rejected - Correction', notes: 'ID mismatch', transactionDate: '2026-10-11T10:00:00Z' },
    { orderId: 'ORD-X2', actionTaken: 'Approved', notes: '', transactionDate: '2026-10-11T11:00:00Z' },
    { orderId: 'ORD-X3', actionTaken: 'Approved', notes: '', transactionDate: '2026-10-11T12:00:00Z' },
  ];
  const d = auth.decisionsOnMyOrders(orders, acts, 'USR-1101');
  assert.deepEqual(d.map((x) => [x.orderId, x.outcome]), [['ORD-X2', 'Approved'], ['ORD-X1', 'Rejected']]);
  assert.equal(d[1].note, 'ID mismatch');
  assert.deepEqual(auth.decisionsOnMyOrders(orders, acts, undefined), []);
});

test('shared state: only the creator may resubmit, and only a rejected order; resubmitting puts it back in the approver\'s queue', () => {
  const rejected = lineCapOrder({ status: 'Rejected - Correction' });
  assert.equal(auth.mayResubmitOrder(rejected, 'USR-1101'), true);
  assert.equal(auth.mayResubmitOrder(rejected, 'USR-1219'), false);
  assert.equal(auth.mayResubmitOrder(lineCapOrder(), 'USR-1101'), false);
  const resubmitted = { ...rejected, status: 'Submitted for Approval', assignedApproverId: null };
  assert.equal(auth.ordersAwaitingDecisionBy([resubmitted], who(byName('Credit Control'))).length, 1);
  assert.equal(auth.ordersAwaitingDecisionBy([rejected], who(byName('Credit Control'))).length, 0, 'a rejected order is not awaiting anyone');
});

test('approvals: an order routed for its ID type is decided by the Back Office Fulfilment and by no other role', () => {
  const idTypeOrder = { orderType: 'New Postpaid Activation', status: 'Submitted for Approval', approverRole: 'Back Office Fulfilment' };
  const bo = personas.find((p) => jobOf(p) === 'Back Office Fulfilment');
  assert.ok(bo, 'a Back Office Fulfilment persona exists');
  assert.equal(auth.orderApprovalAuthority({ personaId: bo.id, jobTitle: 'Back Office Fulfilment', ...idTypeOrder }).mayDecide, true);
  const other = personas.find((p) => grant(p, 'orders.approval-detail') === 'Approve' && jobOf(p) !== 'Back Office Fulfilment');
  assert.equal(auth.orderApprovalAuthority({ personaId: other.id, jobTitle: jobOf(other), ...idTypeOrder }).blockedBy, 'wrong-role');
});

// ---- every order type the app writes has an approver role; nobody decides their own order ------------------------------------------
test('every order type a journey writes has an approval-matrix entry, so no held order is open to any Approve holder', () => {
  const SRC = path.join(ROOT, 'src/modules');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /submit[A-Za-z]*\.ts$/.test(e.name) ? [path.join(d, e.name)] : []));
  const written = new Set();
  for (const f of walk(SRC)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(/orderType:\s*([^,\n]+),/g)) for (const lit of m[1].replace(/\w+\s*===\s*'[^']*'/g, '').matchAll(/'([^']+)'/g)) written.add(lit[1]); // the values, not the conditions of a ternary
  }
  assert.ok(written.size >= 6, `found the order types the submit functions write (${[...written].join(', ')})`);
  const missing = [...written].filter((t) => !matrix.some((m) => m.category === t));
  assert.deepEqual(missing, []);
});

test('the line-change and Prepaid MNP order types are routed to the roles chosen for them', () => {
  const role = (c) => matrix.find((m) => m.category === c)?.requiredRole;
  assert.deepEqual(['Plan Change', 'Prepaid Pack Change', 'Add-On', 'MNP Prepaid Port-In'].map(role), ['Back Office Fulfilment', 'Back Office Fulfilment', 'Back Office Fulfilment', 'Sales Manager']);
});

test('an approver cannot decide an order they created, but can decide the same order created by someone else', () => {
  const approver = personas.find((p) => p.features.some((f) => f.key === 'orders.approval-detail' && ['Approve', 'Full'].includes(f.level)) && jobOf(p) === 'Back Office Fulfilment')
    ?? personas.find((p) => grant(p, 'orders.approval-detail') === 'Approve' || grant(p, 'orders.approval-detail') === 'Full');
  const base = { personaId: approver.id, jobTitle: jobOf(approver), status: 'Submitted for Approval', orderType: 'Plan Change' };
  const mine = auth.orderApprovalAuthority({ ...base, createdBy: 'USR-1', userId: 'USR-1' });
  assert.equal(mine.mayDecide, false);
  assert.equal(mine.blockedBy, 'own-order');
  assert.match(auth.approvalBlockMessage('order', mine), /created this order/);
  assert.equal(auth.orderApprovalAuthority({ ...base, createdBy: 'USR-2', userId: 'USR-1' }).blockedBy === 'own-order', false);
  assert.equal(auth.orderApprovalAuthority({ ...base, userId: 'USR-1' }).blockedBy === 'own-order', false, 'an order with no recorded creator (seeded) is not blocked');
  // The same rule keeps it out of the approver's queue.
  assert.deepEqual(auth.ordersAwaitingDecisionBy([{ orderId: 'O1', orderType: 'Plan Change', status: 'Submitted for Approval', createdBy: 'USR-1' }], { personaId: approver.id, jobTitle: jobOf(approver), userId: 'USR-1' }), []);
});

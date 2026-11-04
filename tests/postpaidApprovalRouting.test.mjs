// Mobile Postpaid orders raised by Retail Sales that need approval go to the Manager/Approver, whatever held them, and the Manager/Approver can decide them.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
let routing, auth;
before(async () => {
  await boot();
  routing = await load('/src/data/approvalRouting.ts');
  auth = await load('/src/engines/approvalAuthority.ts');
});
after(close);

const personas = JSON.parse(fs.readFileSync('public/config/personas.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('public/mock-data/users-agents.json', 'utf8'));
const jobTitleOf = (roleId) => users.find((u) => u.userId === personas.find((p) => p.id === roleId).identityUserId)?.jobTitle;

test('only Retail Sales is routed to its manager for every Mobile Postpaid order; every other persona keeps the reason\'s own route', () => {
  assert.equal(routing.postpaidManagerRoute('ROLE-01'), 'Sales Manager');
  for (const p of personas.filter((x) => x.id !== 'ROLE-01')) assert.equal(routing.postpaidManagerRoute(p.id), undefined, p.name);
  assert.equal(routing.postpaidManagerRoute(undefined), undefined);
});

test('the route names the Manager/Approver: the queue Retail Sales\' orders go to is the job title of the Manager/Approver persona, which holds the Approve grants', () => {
  const manager = personas.find((p) => p.name.startsWith('Manager/Approver'));
  assert.equal(jobTitleOf(manager.id), routing.postpaidManagerRoute('ROLE-01'));
  const grants = Object.fromEntries(manager.features.map((f) => [f.key, f.level]));
  assert.equal(grants['orders.approval-queue'], 'Approve');
  assert.equal(grants['orders.approval-detail'], 'Approve');
  const retail = personas.find((p) => p.id === 'ROLE-01');
  assert.ok(!retail.features.some((f) => f.key === 'orders.approval-detail' && f.level === 'Approve'), 'Retail Sales cannot decide');
});

test('such an order awaits the Manager/Approver: they may decide it (review, approve or reject), Retail Sales and other roles may not, and nobody decides their own', () => {
  const manager = personas.find((p) => p.name.startsWith('Manager/Approver')).id;
  const order = { status: 'Submitted for Approval', orderType: 'New Postpaid Activation', approverRole: routing.postpaidManagerRoute('ROLE-01'), createdBy: 'USR-1101' };
  assert.equal(auth.orderApprovalAuthority({ ...order, personaId: manager, jobTitle: jobTitleOf(manager), userId: 'USR-1103' }).mayDecide, true);
  assert.equal(auth.orderApprovalAuthority({ ...order, personaId: 'ROLE-01', jobTitle: jobTitleOf('ROLE-01'), userId: 'USR-1101' }).mayDecide, false);
  assert.equal(auth.orderApprovalAuthority({ ...order, personaId: manager, jobTitle: jobTitleOf(manager), userId: 'USR-1101' }).blockedBy, 'own-order');
  // Without the route, the matrix would have sent a plain postpaid order to Back Office Fulfilment, whom the Manager/Approver is not.
  assert.equal(auth.orderApprovalAuthority({ ...order, approverRole: undefined, personaId: manager, jobTitle: jobTitleOf(manager), userId: 'USR-1103' }).mayDecide, false);
  const queued = auth.ordersAwaitingDecisionBy([{ ...order, orderId: 'O1' }, { ...order, orderId: 'O2', approverRole: 'Credit Control' }], { personaId: manager, jobTitle: jobTitleOf(manager), userId: 'USR-1103' });
  assert.deepEqual(queued.map((o) => o.orderId), ['O1']);
});

test('wiring: every Mobile Postpaid submission applies the route to its approval order, and prepaid / fixed-line / prepaid-pack orders do not', () => {
  const read = (f) => fs.readFileSync(f, 'utf8');
  assert.match(read('src/modules/new-connection/submitNewConnectionOrder.ts'), /approverRole: postpaidManagerRoute\(usePersonaStore\.getState\(\)\.activePersonaId\) \?\? \(creditControl/);
  assert.match(read('src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts'), /needsApproval && !isPrepaid && postpaidManagerRoute/);
  assert.match(read('src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts'), /pendingApproval && postpaidManagerRoute/);
  assert.match(read('src/modules/mobile-service-changes/submitServiceChangeOrder.ts'), /kind === 'change-postpaid-plan' && postpaidManagerRoute/);
  for (const f of ['src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts', 'src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts']) assert.doesNotMatch(read(f), /postpaidManagerRoute/, f);
});

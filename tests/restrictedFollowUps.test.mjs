// Protected-segment (Safwa / Safwa+ / Royal) leaks found after the first round: the CSV export, task detail by URL, the bell, a route-bound journey,
// and what a role switch leaves behind. Expectations come from the role table and the seeded records.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const read = (f) => fs.readFileSync(f, 'utf8');
const personas = json('public/config/personas.json');
const customers = json('public/mock-data/customers.json');
const orders = json('public/mock-data/orders.json');
const tickets = json('public/mock-data/trouble-tickets.json');
const tasks = json('public/mock-data/tasks.json');
const agents = json('public/mock-data/users-agents.json');
const CAP = { Safwa: 'view-safwa-customers', 'Safwa+': 'view-safwa-plus-customers', Royal: 'view-royal-customers' };
const protectedIds = customers.filter((c) => CAP[c.segment]).map((c) => c.customerId);
const NO_GRANT = 'ROLE-01'; // Retail Sales: holds none of the three

let idx, priv, auth, purge, ctx, notif, wf;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  idx = await load('/src/engines/restrictedCustomers.ts');
  priv = await load('/src/engines/agentPrivilegeEngine.ts');
  auth = await load('/src/engines/approvalAuthority.ts');
  purge = await load('/src/engines/roleSwitchPurge.ts');
  ctx = await load('/src/stores/customerContextStore.ts');
  notif = await load('/src/stores/notificationStore.ts');
  wf = await load('/src/stores/workflowStore.ts');
});
after(close);

const indexFor = (roleId) => idx.buildRestrictedIndex(customers, (s) => priv.canViewCustomerSegment(roleId, s));

test('#1 the CSV export carries only what the role may see: protected customers\' orders and tickets are left out, counted, and nothing exports before customers load', () => {
  assert.ok(personas.find((p) => p.id === NO_GRANT) && !personas.find((p) => p.id === NO_GRANT).capabilities.some((c) => Object.values(CAP).includes(c)));
  for (const [rows, label] of [[orders, 'orders'], [tickets, 'tickets']]) {
    const mine = indexFor(NO_GRANT).filter(rows, (r) => r.customerId);
    assert.ok(mine.hiddenCount >= 1, `${label}: a protected record exists to hold back`);
    assert.ok(!mine.visible.some((r) => protectedIds.includes(r.customerId)), label);
    const csvLike = JSON.stringify(mine.visible);
    for (const c of customers.filter((x) => CAP[x.segment])) for (const v of [c.name, c.qid, c.phone, c.customerId]) assert.ok(!csvLike.includes(v), `${label}: ${v} would be exported`);
    assert.equal(indexFor('ROLE-12').filter(rows, (r) => r.customerId).hiddenCount, 0, `${label}: Premium exports them`);
    assert.equal(mine.visible.length + mine.hiddenCount, rows.length, 'conservation');
  }
  assert.deepEqual(idx.buildRestrictedIndex(null, () => true).filter(orders, (r) => r.customerId), { visible: [], hiddenCount: 0 });
  const src = read('src/workspace/profile/AgentProfileWorkspace.tsx');
  assert.match(src, /restricted\.filter\(exportRows as \{ customerId\?: string \}\[\], \(r\) => r\.customerId\)/);
  assert.match(src, /downloadCsv\(`[^`]*`, exportRecords\)/, 'the file is written from the filtered rows');
  assert.match(src, /left out: access restricted for your role/);
});

test('#2 task detail by URL: a task about a protected customer shows only the restriction, nothing until orders and customers are known', () => {
  const ix = indexFor(NO_GRANT);
  const customerOf = (t) => (t.relatedOrderId ? orders.find((o) => o.orderId === t.relatedOrderId)?.customerId : undefined);
  const hiddenTasks = tasks.filter((t) => ix.isRestricted(customerOf(t)) || ix.mentionsRestricted(t.taskName));
  assert.deepEqual(hiddenTasks.map((t) => t.taskId), ['TASK-70101'], 'only the protected customer\'s task is held back');
  assert.equal(tasks.filter((t) => indexFor('ROLE-12').isRestricted(customerOf(t))).length, 0);
  const src = read('src/workspace/tasks/TaskDetailView.tsx');
  const gate = src.indexOf('restricted.isRestricted(taskCustomerId)');
  assert.ok(gate > 0);
  assert.ok(gate < src.indexOf('title={<>{task.taskName}</>}'), 'authorised before the task name is drawn');
  assert.match(src, /!restricted\.ready \|\| \(task\.relatedOrderId && ordersPending\)/);
  assert.match(src, /RestrictedCustomerNotice backTo="\/tasks"/);
});

test('#3 the bell never announces an order of a protected customer: the awaiting list, over the real approval rules, loses exactly those orders', () => {
  const jobOf = (p) => agents.find((u) => u.userId === p.identityUserId)?.jobTitle;
  let proved = 0;
  for (const p of personas.filter((x) => auth.holdsApproveGrant(x.id, 'SCR-061'))) {
    const who = { personaId: p.id, jobTitle: jobOf(p), userId: p.identityUserId };
    const raw = auth.ordersAwaitingDecisionBy(orders, who);
    const visibleOrders = indexFor(p.id).filter(orders, (o) => o.customerId).visible;
    const filtered = auth.ordersAwaitingDecisionBy(visibleOrders, who);
    const mustHide = raw.filter((o) => protectedIds.includes(o.customerId) && !p.capabilities.includes(CAP[customers.find((c) => c.customerId === o.customerId).segment]));
    assert.deepEqual(raw.filter((o) => !filtered.includes(o)).map((o) => o.orderId), mustHide.map((o) => o.orderId), p.name);
    proved += mustHide.length;
  }
  assert.ok(proved >= 1, 'at least one approver role was shown ORD-93101 before the fix');
  const src = read('src/navigation/useWorkflowInbox.ts');
  assert.match(src, /guard\.filter\(allOrders, \(o\) => o\.customerId\)\.visible/);
  assert.match(src, /const guard = useRestrictedCustomers\(\)/);
});

test('#4 a route-bound journey for a protected customer is blocked before the badge, the scanner card or the owner message show them', () => {
  const wiz = read('src/modules/new-connection/NewConnectionWizard.tsx');
  const block = wiz.indexOf("restricted.isRestricted(existingCustomerId)");
  assert.ok(block > 0 && block < wiz.indexOf('<GuidedActivationWizard'), 'blocked before the wizard renders');
  assert.match(wiz, /!restricted\.ready\) return/);
  assert.match(wiz, /canViewCustomerSegment\(usePersonaStore\.getState\(\)\.activePersonaId, \(c as \{ segment\?: string \}\)\.segment\)\)\?\.name/, 'the badge name is only taken for a customer the role may see');
  const look = read('src/components/patterns/useIdLookup.ts');
  assert.match(look, /cardRestrictedRef\.current = Boolean\(c && !canViewCustomerSegment/);
  assert.match(look, /if \(cardRestrictedRef\.current\) return undefined;/, 'the simulated scan reads nothing');
  assert.ok((look.match(/!canViewCustomerSegment\(usePersonaStore\.getState\(\)\.activePersonaId, bound\.segment\)/g) ?? []).length === 3, 'the owner-mismatch message never names a protected customer');
  const ownerAt = look.indexOf('setOwnerMismatch(bound?.name');
  assert.ok(look.lastIndexOf('setAccessRestricted(true)', ownerAt) > look.lastIndexOf('const bound = customers.find', ownerAt));
});

test('#5 switching role drops what was kept about a protected customer the new role may not see; a role that may see them keeps everything', async () => {
  const hessa = customers.find((c) => c.customerId === 'CUST-3101');
  const ahmed = customers.find((c) => c.customerId === 'CUST-1001');
  const seed = () => {
    ctx.useCustomerContext.setState({ customer: { customerId: hessa.customerId, name: hessa.name, qid: hessa.qid, phone: hessa.phone, segment: hessa.segment }, recentCustomerIds: [hessa.customerId, ahmed.customerId], journey: { wizardId: 'new-connection', path: '/x', journey: 'New Connection', customerName: hessa.name, idNumber: hessa.qid, customerId: hessa.customerId, startedAt: 'now', taskId: 'T' } });
    wf.useWorkflowStore.setState({ drafts: { 'new-connection': { step: 1, maxStep: 1, values: { eligibility: { customerId: hessa.customerId } } }, 'other-journey': { step: 0, maxStep: 0, values: { eligibility: { customerId: ahmed.customerId } } } } });
    notif.useNotificationStore.setState({ toasts: [], history: [
      { id: 'a', kind: 'info', message: `A journey for ${hessa.name} is in progress`, at: 1, read: false },
      { id: 'b', kind: 'info', message: `Customer ${hessa.customerId} queued`, at: 2, read: false },
      { id: 'c', kind: 'info', message: `A journey for ${ahmed.name} is in progress`, at: 3, read: false },
    ] });
  };
  seed();
  await purge.purgeProtectedDataForRole('ROLE-12');
  assert.equal(ctx.useCustomerContext.getState().customer?.customerId, hessa.customerId, 'Premium keeps the customer');
  assert.ok(ctx.useCustomerContext.getState().journey);
  assert.equal(Object.keys(wf.useWorkflowStore.getState().drafts).length, 2);
  assert.equal(notif.useNotificationStore.getState().history.length, 3);
  await purge.purgeProtectedDataForRole(NO_GRANT);
  const c = ctx.useCustomerContext.getState();
  assert.equal(c.customer, null, 'the active customer is gone');
  assert.deepEqual(c.recentCustomerIds, [ahmed.customerId], 'only the protected one leaves the recent list');
  assert.equal(c.journey, null, 'the journey hold is gone');
  assert.deepEqual(Object.keys(wf.useWorkflowStore.getState().drafts), ['other-journey'], 'only the protected customer\'s draft is dropped');
  assert.deepEqual(notif.useNotificationStore.getState().history.map((h) => h.id), ['c'], 'only the notifications that named the protected customer are dropped');
  // An ordinary customer in the context is never touched.
  ctx.useCustomerContext.setState({ customer: { customerId: ahmed.customerId, name: ahmed.name, qid: ahmed.qid, phone: ahmed.phone, segment: ahmed.segment }, recentCustomerIds: [ahmed.customerId], journey: null });
  await purge.purgeProtectedDataForRole(NO_GRANT);
  assert.equal(ctx.useCustomerContext.getState().customer?.customerId, ahmed.customerId);
  assert.match(read('src/navigation/PersonaSwitcher.tsx'), /purgeProtectedDataForRole\(activePersonaId\)[\s\S]*\[activePersonaId\]/, 'run on every role change and on load');
  assert.deepEqual(purge.hiddenCustomersFor(customers, 'ROLE-12'), []);
  assert.deepEqual(purge.hiddenCustomersFor(customers, NO_GRANT).map((c) => c.customerId).sort(), [...protectedIds].sort());
});

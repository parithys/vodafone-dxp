// A postpaid Passport order is approved by the submitting agent's manager: routed to the Sales Manager queue for a sales persona, and to Credit
// Control as before for any persona with no manager route, and for any ID type other than a Passport.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let nc, persona, routing, engine, auth;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  nc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
  persona = (await load('/src/stores/personaStore.ts')).usePersonaStore;
  routing = await load('/src/data/approvalRouting.ts');
  engine = await load('/src/engines/eligibilityEngine.ts');
  auth = await load('/src/engines/approvalAuthority.ts');
});
after(close);

const idRouted = (idType) => ({ id: 'id-type-routing', label: 'x', passed: false, outcome: 'approval-routing', message: `${idType} routed` });
const submit = async (personaId, idType) => {
  persona.setState({ activePersonaId: personaId });
  const created = [];
  await nc.submitNewConnectionOrder(
    {
      contact: { idNumber: 'P0998812', idType, email: 'a@example.qa', moiResult: { name: 'Passport Holder', nationality: 'Egyptian', dob: '1990-01-01', customerId: 'CUST-1001' } },
      eligibility: { customerId: 'CUST-1001', nationality: 'Egyptian', checks: [idRouted(idType)] },
      productId: 'PROD-104',
    },
    { flow: 'existing', createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async () => {} }
  );
  return created.find((c) => c.kind === 'orders').rec;
};

test('a sales persona\'s Passport order goes to the Sales Manager queue, with the reason named', async () => {
  for (const id of ['ROLE-01', 'ROLE-02', 'ROLE-03', 'ROLE-04', 'ROLE-05', 'ROLE-06', 'ROLE-07', 'ROLE-08', 'ROLE-22']) {
    const order = await submit(id, 'Passport');
    assert.equal(order.status, 'Submitted for Approval', id);
    assert.equal(order.approverRole, 'Sales Manager', id);
    assert.match(order.approvalReason, /Passport requires Sales Manager approval - routed to Sales Manager/, id);
    assert.doesNotMatch(order.approvalReason, /Credit Control/, id);
  }
});

test('a persona with no manager route keeps Credit Control for a Passport; no other ID type is rerouted', async () => {
  const noRoute = await submit('ROLE-15', 'Passport');
  assert.equal(noRoute.approverRole, 'Credit Control');
  assert.match(noRoute.approvalReason, /ID type requires Credit Control approval/);
  const gcc = await submit('ROLE-01', 'GCC ID');
  assert.equal(gcc.approverRole, 'Credit Control', 'GCC ID is not a Passport');
  assert.match(gcc.approvalReason, /ID type requires Credit Control approval/);
});

test('the mapping covers exactly the sales personas and their supervisor; every route is to the one manager title', () => {
  assert.deepEqual(Object.keys(routing.SUBMITTER_MANAGER_ROLE).sort(), ['ROLE-01', 'ROLE-02', 'ROLE-03', 'ROLE-04', 'ROLE-05', 'ROLE-06', 'ROLE-07', 'ROLE-08', 'ROLE-22']);
  assert.ok(Object.values(routing.SUBMITTER_MANAGER_ROLE).every((r) => r === 'Sales Manager'));
  assert.equal(routing.managerRoleOfSubmitter('ROLE-01'), 'Sales Manager');
  assert.equal(routing.managerRoleOfSubmitter('ROLE-19'), undefined);
  assert.equal(routing.managerRoleOfSubmitter(undefined), undefined);
});

test('the queue: the Sales Manager sees and may decide the order; Credit Control does not, and the submitter never decides their own', async () => {
  const order = { orderId: 'ORD-P1', orderType: 'New Postpaid Activation', status: 'Submitted for Approval', approverRole: 'Sales Manager', createdBy: 'USR-1101' };
  assert.equal(auth.ordersAwaitingDecisionBy([order], { personaId: 'ROLE-23', jobTitle: 'Sales Manager', userId: 'USR-1103' }).length, 1);
  assert.equal(auth.ordersAwaitingDecisionBy([order], { personaId: 'ROLE-19', jobTitle: 'Credit Control', userId: 'USR-1219' }).length, 0);
  assert.equal(auth.ordersAwaitingDecisionBy([order], { personaId: 'ROLE-01', jobTitle: 'Sales Manager', userId: 'USR-1101' }).length, 0, 'maker-checker');
});

test('the eligibility result names the manager queue for a postpaid Passport, and is unchanged without one, for a GCC ID and for prepaid', () => {
  const run = (idType, extra = {}) =>
    engine.evaluateEligibilityChecks(
      { customer: { customerId: 'C1', idType, dob: '1990-01-01', blacklisted: false }, doc: { documentType: idType, expiryDate: '2030-01-01' }, deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5', ...extra },
      new Date('2026-10-01')
    ).find((c) => c.id === 'id-type-routing');
  const withManager = run('Passport', { passportApprover: 'Sales Manager' });
  assert.equal(withManager.label, 'Sales Manager Approval Required');
  assert.match(withManager.message, /routed to the Sales Manager queue/);
  assert.equal(withManager.outcome, 'approval-routing');
  assert.equal(run('Passport').label, 'Credit Control Approval Required');
  assert.equal(run('GCC ID', { passportApprover: 'Sales Manager' }).label, 'Credit Control Approval Required');
  assert.equal(run('Passport', { passportApprover: 'Sales Manager', journeyType: 'prepaid' }).outcome, 'pass', 'prepaid permits a Passport outright');
});

test('the ID type\'s Credit Control approval is announced once the product is chosen: not at product-agnostic Customer Verification, never for Prepaid', async () => {
  const fs = await import('node:fs');
  const step = fs.readFileSync('src/capabilities/CustomerQualification/step.tsx', 'utf8');
  assert.match(step, /!\(productAgnostic && \(row\.id === 'hrn' \|\| row\.id === 'id-type-routing'\)\)/);
  const product = fs.readFileSync('src/modules/new-connection/steps/ProductEligibility.tsx', 'utf8');
  assert.match(product, /eligibilityJourney\(values\) === 'prepaid' \? undefined : \(row\) =>[^\n]*\(row\.id === 'id-type-routing' && row\.tone === 'approval-routing'\)/);
  // The engine itself: a Passport routes on a postpaid line and not on a prepaid one, so the product stage has the right answer for each.
  const run = (journeyType) =>
    engine.evaluateEligibilityChecks(
      { customer: { customerId: 'C', idType: 'Passport', dob: '1990-01-01', blacklisted: false }, doc: { documentType: 'Passport', expiryDate: '2099-01-01', visa: { visaNumber: 'V', visaType: 'T', expiryDate: '2099-01-01' } }, deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '0/5', journeyType },
      new Date('2026-11-01')
    ).find((c) => c.id === 'id-type-routing');
  assert.equal(run('postpaid').outcome, 'approval-routing');
  assert.equal(run('prepaid').outcome, 'pass');
});

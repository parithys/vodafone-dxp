import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Gates between steps and at submit: a hard stop cannot be walked past, a resumed draft cannot submit without eligibility, a line must belong to the customer.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const personas = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/config/personas.json'), 'utf8'));

let nav, guard, steps, submitMod, submitNc, React, server, router, persona, req;
before(async () => {
  await boot();
  nav = await load('/src/components/patterns/wizard/wizardNavigation.ts');
  guard = await load('/src/engines/eligibilityGuard.ts');
  steps = await load('/src/modules/mobile-service-changes/serviceChangeSteps.tsx');
  submitMod = await load('/src/modules/mobile-service-changes/submitServiceChangeOrder.ts');
  submitNc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
  persona = await load('/src/stores/personaStore.ts');
  req = await load('/src/navigation/RequireFeature.tsx');
  React = (await import('react')).default;
  server = await import('react-dom/server');
  router = await import('react-router-dom');
});
after(close);

// ---- forward jumps -----------------------------------------------------------------------------------------------------------------
const step = (key, valid) => ({ key, label: key, render: () => null, isValid: valid === undefined ? undefined : () => valid });

test('a forward jump needs every step from the current one up to the target to be valid; going back is never blocked', () => {
  const list = [step('a', true), step('b', true), step('c', false), step('d', true), step('e')];
  assert.equal(nav.forwardJumpAllowed(list, 0, 2, {}), true, 'a and b are valid');
  assert.equal(nav.forwardJumpAllowed(list, 0, 3, {}), false, 'c is invalid and lies in between');
  assert.equal(nav.forwardJumpAllowed(list, 2, 3, {}), false, 'the step the agent is on is itself invalid');
  assert.equal(nav.forwardJumpAllowed(list, 3, 4, {}), true);
  assert.equal(nav.forwardJumpAllowed(list, 3, 0, {}), true, 'back');
  assert.equal(nav.forwardJumpAllowed(list, 2, 2, {}), true, 'same step');
  assert.equal(nav.forwardJumpAllowed(list, 0, 1, {}), true, 'a step with no isValid counts as valid');
});

test('a hard stop on Customer Verification blocks a jump straight back to the furthest step, in the line-change journey', () => {
  const ctx = { flow: 'new', existingCustomerId: undefined, guardedContactChange: () => true, products: [], customerBenefits: undefined };
  const list = steps.changePostpaidPlanSteps(ctx);
  const contact = { moiResult: { name: 'X', nationality: 'Qatari' }, idNumber: '28456701234', idType: 'QID', firstName: 'A', lastName: 'B', dob: '12/03/1985', nationality: 'Qatari', gender: 'Male', idExpiryDate: '2030-01-01', email: 'a@example.qa', altPhone: '' };
  const stopped = { contact, eligibility: { hardStop: true, softStop: false, pass: false, checks: [], customerId: 'CUST-1001' } };
  const clear = { contact, eligibility: { hardStop: false, softStop: false, pass: true, checks: [], customerId: 'CUST-1001' }, customerType: { type: 'none' } };
  assert.equal(nav.forwardJumpAllowed(list, 0, list.length - 1, stopped), false);
  assert.equal(nav.forwardJumpAllowed(list, 0, 1, stopped), false);
  assert.equal(nav.forwardJumpAllowed(list, 0, 1, clear), true);
});

// ---- eligibility and the line --------------------------------------------------------------------------------------------------------
test('an order cannot be submitted without an eligibility result, in every submit that reads one', async () => {
  for (const values of [{}, { eligibility: undefined }, { eligibility: {} }, { eligibility: { checks: 'x' } }]) assert.throws(() => guard.assertEligibilityChecked(values), /eligibility has not been checked/);
  assert.doesNotThrow(() => guard.assertEligibilityChecked({ eligibility: { checks: [] } }));
  const deps = { createRecord: async () => {}, updateRecord: async () => {} };
  await assert.rejects(() => submitNc.submitNewConnectionOrder({ contact: {} }, { flow: 'new', createRecord: deps.createRecord }), /eligibility has not been checked/);
  await assert.rejects(() => submitMod.submitServiceChangeOrder('add-addon', { contact: { moiResult: {} }, line: { customerId: 'CUST-1001' } }, deps), /eligibility has not been checked/);
});

test('a line that belongs to another customer than the one identified now is not valid and cannot be submitted', async () => {
  const ctx = { flow: 'new', existingCustomerId: undefined, guardedContactChange: () => true, products: [], customerBenefits: undefined };
  const lineStep = steps.changePostpaidPlanSteps(ctx).find((s) => s.key === 'line');
  const line = { customerId: 'CUST-1001', status: 'Active', barred: false, inCollections: false };
  assert.equal(lineStep.isValid({ line, eligibility: { customerId: 'CUST-1001', checks: [] } }), true);
  assert.equal(lineStep.isValid({ line, eligibility: { customerId: 'CUST-2002', checks: [] } }), false, 'the customer was changed after the line was chosen');
  assert.equal(lineStep.isValid({ line }), false, 'no customer identified');
  const deps = { createRecord: async () => {}, updateRecord: async () => {} };
  await assert.rejects(
    () => submitMod.submitServiceChangeOrder('change-postpaid-plan', { contact: { moiResult: {} }, eligibility: { customerId: 'CUST-2002', checks: [] }, line: { ...line, productId: 'P' }, productId: 'PROD-104' }, deps),
    /Return to Customer Verification/
  );
});

// ---- the one route that is an access boundary ----------------------------------------------------------------------------------------
test('the Administration grant is held by some roles and not others, and canUseFeature says exactly that for every role', async () => {
  const pe = await load('/src/engines/personaEngine.ts');
  const granted = personas.filter((p) => p.features.some((f) => f.key === 'workspace.admin-role-access-viewer')).map((p) => p.id);
  assert.ok(granted.length > 0 && granted.length < personas.length);
  for (const p of personas) assert.equal(pe.canUseFeature(p.id, 'workspace.admin-role-access-viewer'), granted.includes(p.id), p.id);
  assert.equal(pe.canUseFeature('NOT-A-ROLE', 'workspace.admin-role-access-viewer'), false, 'an unknown role has no access');
});

test('RequireFeature shows its page for a granted feature and "No access" for any other, never the page', () => {
  // (zustand renders the initial persona on the server, so the persona is the default one; the feature key is what varies.)
  const render = (featureKey) =>
    server.renderToStaticMarkup(React.createElement(router.MemoryRouter, null, React.createElement(req.RequireFeature, { featureKey }, React.createElement('p', null, 'THE PAGE'))));
  const initial = persona.usePersonaStore.getInitialState().activePersonaId;
  const mine = personas.find((p) => p.id === initial);
  const held = mine.features[0].key;
  assert.match(render(held), /THE PAGE/);
  assert.doesNotMatch(render(held), /No Access/);
  assert.match(render('no.such.feature'), /No Access/);
  assert.doesNotMatch(render('no.such.feature'), /THE PAGE/);
});

// The plan page's Family Package notice: a new package for a customer with none who passed eligibility says nothing and goes on; every other outcome still speaks.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import fs from 'node:fs';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

let Notice, engine;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  ({ FamilyPackageNotice: Notice } = await load('/src/components/patterns/FamilyPackageNotice.tsx'));
  engine = await load('/src/engines/familyPackage.ts');
});
after(close);

const familyPlan = { productId: 'PROD-142', planClass: 'Postpaid Family Plans' };
const render = (check, planName = 'Plan') => html(React.createElement(Notice, { check, planName }));

test('no Family Package and eligibility cleared: no notice at all, and the order carries on as Primary Line 1', () => {
  const check = engine.familyStartCheck({ plan: familyPlan, eligibilityCleared: true, customerLines: [] });
  assert.equal(check.applies && check.ok, true);
  assert.equal(check.lineLabel, 'Primary Line 1');
  assert.equal(render(check), '');
});

test('a plan that is not a Family Plan: nothing either', () => {
  assert.equal(render(engine.familyStartCheck({ plan: { productId: 'PROD-107', planClass: 'Postpaid Voice Plans' }, eligibilityCleared: true, customerLines: [] })), '');
});

test('the cases that still need saying are still said: eligibility not cleared and a line added to a package; a package already held is the gate\'s to say', () => {
  assert.match(render(engine.familyStartCheck({ plan: familyPlan, eligibilityCleared: false, customerLines: [] })), /not cleared eligibility/);
  const held = [{ lineId: 'L1', packageId: 'P', customerId: 'CUST-1', role: 'Primary', sequence: 1, planId: 'PROD-142', orderId: 'O' }];
  // A package already held is NOT said by this notice: the plan page's gate says it, once its dialog is closed.
  const heldCheck = engine.familyStartCheck({ plan: familyPlan, eligibilityCleared: true, customerLines: held });
  assert.match(heldCheck.reason, /already has an active Family Package\. Further Family Lines can be added to the existing package from Customer 360\./);
  assert.equal(render(heldCheck), '');
  const joined = render({ applies: true, ok: true, lineLabel: 'Supplementary Line 1', planId: 'PROD-311', additional: { packageId: 'P', role: 'Supplementary', sequence: 1 } }, 'Supp');
  assert.match(joined, /Supplementary Line 1 of the customer&#x27;s Family Package, on Supp/);
});

test('the Family Package Already Active dialog opens by itself once per session per customer; the reason is said only after it is closed', async () => {
  const session = await load('/src/modules/new-connection/familyGateSession.ts');
  assert.equal(session.familyModalSeen('CUST-A'), false);
  session.markFamilyModalSeen('CUST-A');
  assert.equal(session.familyModalSeen('CUST-A'), true, 'seen after it has opened');
  assert.equal(session.familyModalSeen('CUST-B'), false, 'another customer still gets it');
  session.markFamilyModalSeen('CUST-A');
  assert.deepEqual(JSON.parse(sessionStorage.getItem('vfq-family-package-active-modal-shown')), ['CUST-A'], 'recorded once');
  const gate = fs.readFileSync('src/modules/new-connection/FamilyPackageActiveGate.tsx', 'utf8');
  assert.match(gate, /useState\(\(\) => !familyModalSeen\(customerId\)\)/, 'opens by itself only if not seen this session');
  assert.match(gate, /\{!open && \(\s*<p role="alert" className="notice-danger pad-row mb-6">/, 'the message shows only while the dialog is closed');
  assert.doesNotMatch(gate, /<Button/, 'no button: the message is text');
  assert.match(gate, /This customer already has an\{' '\}\s*<button type="button" className="link focus-ring" onClick=\{\(\) => setOpen\(true\)\}>\s*active Family Package\s*<\/button>\s*\. Further Family Lines can be added to the existing package from Customer 360\./, 'the link is "active Family Package"');
  assert.match(gate, /onClose=\{\(\) => setOpen\(false\)\}/, 'Cancel and close both end in the same close');
  assert.match(gate, /onClick=\{\(\) => setOpen\(true\)\}/, 'the link brings it back');
  // Nowhere else in the journey says it: the plan notice is silent for a held package, and the gate is mounted on the plan page only.
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  assert.equal((steps.match(/<FamilyPackageActiveGate/g) ?? []).length, 1);
});

test('a line added to a package with its plan settled goes straight to Number Selection, and the dialog\'s dismiss button reads Skip when the package is already active', () => {
  const steps = fs.readFileSync('src/modules/new-connection/postpaidSteps.tsx', 'utf8');
  const cond = "Boolean(familyLineContextOf(values)) && c.applies && c.ok && Boolean(c.planId)";
  assert.equal(steps.split(cond).length - 1, 2, 'autoPass (moving forward) and autoAdvanceWhen (arriving on it) share one condition');
  assert.match(steps, /autoAdvanceWhen: \(values\) => \{/);
  const modal = fs.readFileSync('src/capabilities/ActivationComplete/AddConnectionModal.tsx', 'utf8');
  assert.match(modal, /\{alreadyActive \? 'Skip' : 'Cancel'\}/);
});

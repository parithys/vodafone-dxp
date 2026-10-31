// Journey milestones (BRSD MPAR_001_QPC_09/10): reached once, in order, invalidated by amendments, restored silently, never on a stop.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, close } from './harness.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

after(close);
const h = React.createElement;

const eng = await load('/src/engines/milestoneEngine.ts');
// Milestone toasts are not displayed by default (the code is kept). The tests of WHEN and WHAT a toast announces switch them on for this file.
const jm = await load('/src/components/patterns/wizard/useJourneyMilestones.ts');
jm.setMilestoneToastsVisible(true);
const cfg = await load('/src/modules/new-connection/milestones.ts');
const defs = cfg.POSTPAID_MILESTONES;

const clean = { scope: 'product', journeyType: 'postpaid', hardStop: false, softStop: false, checks: [], idNumber: '29001234567' };
const identified = { contact: { idNumber: '29001234567', moiResult: { name: 'A' } }, eligibility: clean };
const billed = { ...identified, product: 'postpaid', billingAccount: { selectedProfileId: 'BP-1' } };
const cart = { productId: 'P1', msisdn: '97455500000', simType: { simType: 'Physical', simValid: true, simSerial: 'S1' }, checkoutTotals: { dueTodayQar: 100 }, addonIds: [] };
const carted = { ...billed, ...cart };
const signed = { ...carted, caf: { cafType: 'Digital', signatureDataUrl: 'data:image/png;base64,AAAA' } };
const ctx = (values, past = []) => ({ values, pastStep: (k) => past.includes(k) });
const run = (values, state = {}, past = [], opts) => eng.reconcileMilestones(defs, state, ctx(values, past), opts);
const ids = (events, type) => events.filter((e) => e.type === type).map((e) => e.id);

test('each milestone fires once, when its completion event succeeds, in order', () => {
  let r = run({});
  assert.deepEqual(r.events, []);
  r = run(identified, r.state);
  assert.deepEqual(ids(r.events, 'reached'), ['identified']);
  r = run(billed, r.state);
  assert.deepEqual(ids(r.events, 'reached'), ['billing']);
  r = run(carted, r.state);
  assert.deepEqual(r.events, [], 'a complete cart is not "checked out" until the agent moves past Checkout');
  r = run(carted, r.state, ['checkout']);
  assert.deepEqual(ids(r.events, 'reached'), ['checkout']);
  r = run(signed, r.state, ['checkout']);
  assert.deepEqual(ids(r.events, 'reached'), ['caf']);
  assert.deepEqual(Object.keys(r.state), ['identified', 'billing', 'checkout', 'caf']);
});

test('no duplicate toast on a repeat evaluation', () => {
  const first = run(identified);
  const again = run(identified, first.state);
  assert.deepEqual(again.events, []);
  assert.deepEqual(Object.keys(again.state), ['identified']);
});

test('ordering: a later milestone is never reached ahead of an earlier one, and is warned about', () => {
  const r = run({ ...signed, eligibility: { ...clean, hardStop: true } }, {}, ['checkout']);
  assert.deepEqual(r.state, {});
  assert.deepEqual(r.events, []);
  assert.ok(r.warnings.length >= 1);
  // Order Submitted is event-driven and needs all four before it.
  assert.deepEqual(eng.reachOnEvent(defs, {}, 'submitted').events, []);
  assert.ok(eng.reachOnEvent(defs, {}, 'submitted').warnings[0].includes('not reached'));
});

test('a hard stop, a soft stop (collections), a missing MOI result or another customer\'s eligibility reaches nothing', () => {
  for (const values of [
    { ...identified, eligibility: { ...clean, hardStop: true } },
    { ...identified, eligibility: { ...clean, softStop: true } },
    { contact: { idNumber: '29001234567' }, eligibility: clean },
    { ...identified, eligibility: { ...clean, idNumber: '99999999999' } },
  ]) assert.deepEqual(run(values).events, []);
});

test('amending the cart after checkout invalidates it and every later milestone; it fires again once Checkout is confirmed again', () => {
  const all = run(signed, run(carted, run(billed, run(identified).state).state).state, ['checkout']);
  let r = run(signed, all.state, ['checkout']);
  assert.deepEqual(Object.keys(r.state), ['identified', 'billing', 'checkout', 'caf']);
  // The agent changes the plan: Checkout no longer matches what was confirmed.
  const amended = { ...signed, productId: 'P2', caf: undefined };
  r = run(amended, r.state, []);
  assert.deepEqual(ids(r.events, 'invalidated'), ['checkout', 'caf']);
  assert.deepEqual(Object.keys(r.state), ['identified', 'billing']);
  // Going Back to look at Checkout without changing anything keeps it.
  const kept = run(carted, run(carted, run(billed, run(identified).state).state, ['checkout']).state, []);
  assert.deepEqual(kept.events, []);
  assert.ok(kept.state.checkout);
  // Confirming the amended cart reaches it again.
  r = run(amended, r.state, ['checkout']);
  assert.deepEqual(ids(r.events, 'reached'), ['checkout']);
});

test('changing the customer drops every milestone, so the new customer re-earns them', () => {
  const s = run(carted, run(billed, run(identified).state).state, ['checkout']).state;
  const other = { ...carted, contact: { idNumber: '28800000000', moiResult: { name: 'B' } }, eligibility: undefined };
  const r = run(other, s, ['checkout']);
  assert.deepEqual(ids(r.events, 'invalidated'), ['identified', 'billing', 'checkout']);
  assert.deepEqual(r.state, {});
});

test('restoring a draft shows its progress without announcing it', () => {
  const restored = run(carted, {}, ['checkout'], { silent: true });
  assert.deepEqual(restored.events, []);
  assert.deepEqual(Object.keys(restored.state), ['identified', 'billing', 'checkout']);
  // A later change after the restore is announced as usual.
  assert.deepEqual(ids(run(signed, restored.state, ['checkout']).events, 'reached'), ['caf']);
});

test('Order Submitted is event-driven: it needs the four before it, is reached once, and never by data alone', () => {
  const four = run(signed, run(carted, run(billed, run(identified).state).state, ['checkout']).state, ['checkout']).state;
  assert.equal(four.submitted, undefined);
  const r = eng.reachOnEvent(defs, four, 'submitted');
  assert.deepEqual(ids(r.events, 'reached'), ['submitted']);
  assert.deepEqual(eng.reachOnEvent(defs, r.state, 'submitted').events, [], 'a second submission event does not announce again');
  // If an earlier milestone is later invalidated, Order Submitted goes with it.
  const dropped = run({ ...signed, productId: 'P2' }, r.state, []);
  assert.ok(!dropped.state.submitted);
});

test('the milestones apply to Mobile Postpaid Activation only', () => {
  assert.equal(cfg.postpaidMilestonesApply({}), true);
  assert.equal(cfg.postpaidMilestonesApply({ product: 'postpaid' }), true);
  for (const product of ['prepaid', 'mnp', 'fixed-line']) assert.equal(cfg.postpaidMilestonesApply({ product }), false, product);
  assert.deepEqual(cfg.POSTPAID_MILESTONES.map((d) => d.id), cfg.POSTPAID_MILESTONE_IDS);
});

test('the milestone toast: success, the milestone\'s own text, a polite status, closes itself and can be dismissed; Order Submitted is recorded without a toast', async () => {
  const { useNotificationStore } = await load('/src/stores/notificationStore.ts');
  const { announceMilestone, reachMilestoneOnEvent, MILESTONE_TOAST_MS } = await load('/src/components/patterns/wizard/useJourneyMilestones.ts');
  const config = { defs, applies: cfg.postpaidMilestonesApply };
  useNotificationStore.setState({ toasts: [], history: [] });
  announceMilestone(defs[0]);
  let { toasts } = useNotificationStore.getState();
  assert.equal(toasts.length, 1);
  assert.equal(toasts[0].kind, 'success');
  assert.equal(MILESTONE_TOAST_MS, 4000);
  assert.equal(toasts[0].message, 'Customer Verified');
  assert.equal(toasts[0].detail, 'Customer identified and eligibility confirmed.');
  // How the container presents a success toast (react-dom/server cannot render it: it reads the store's initial state, and the app has
  // no DOM test environment), so it is checked in the source: a polite status, with a dismiss button, Escape and click-away clearing.
  const container = fs.readFileSync(path.join(root, 'src/capabilities/Toasts/Toast.tsx'), 'utf8');
  assert.match(container, /role=\{t\.kind === 'error' \? 'alert' : 'status'\}/);
  assert.match(container, /aria-live=\{t\.kind === 'error' \? 'assertive' : 'polite'\}/);
  assert.match(container, /dismissToast\(t\.id\)/);
  assert.match(container, /e\.key === 'Escape'/);
  // Announcing the same milestone again while it is showing replaces it rather than stacking a duplicate.
  announceMilestone(defs[0]);
  assert.equal(useNotificationStore.getState().toasts.length, 1);
  // Order Submitted is reached and recorded, but gets no toast: the Order Submitted page already says it.
  useNotificationStore.setState({ toasts: [], history: [] });
  const four = run(signed, run(carted, run(billed, run(identified).state).state, ['checkout']).state, ['checkout']).state;
  assert.equal(defs.find((d) => d.id === 'submitted').noToast, true);
  assert.equal(reachMilestoneOnEvent('new-connection', config, { milestones: four }, 'submitted', cfg.SUBMITTED_FOR_APPROVAL_MESSAGE), true);
  assert.equal(useNotificationStore.getState().toasts.length, 0);
  // Not reached out of order: no toast.
  useNotificationStore.setState({ toasts: [], history: [] });
  assert.equal(reachMilestoneOnEvent('new-connection', config, { milestones: {} }, 'submitted'), false);
  assert.equal(useNotificationStore.getState().toasts.length, 0);
});

test('auto-dismiss: a toast with autoDismissMs closes itself', async () => {
  const { useNotificationStore } = await load('/src/stores/notificationStore.ts');
  useNotificationStore.setState({ toasts: [], history: [] });
  useNotificationStore.getState().pushToast('success', 'x', { key: 'k', autoDismissMs: 20 });
  assert.equal(useNotificationStore.getState().toasts.length, 1);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(useNotificationStore.getState().toasts.length, 0);
});

test('the step summary marks a milestone step with a flag in place of the tick, and only that step', async () => {
  const { StepSummarySection } = await load('/src/components/patterns/wizard/StepSummarySection.tsx');
  const row = (milestone) => html(h(StepSummarySection, { title: 'Customer Verification', open: false, onToggle() {}, milestone }, null));
  const plain = row(false);
  const flagged = row(true);
  assert.match(plain, /M7\.5 12\.5l3 3 6-6\.5/, 'the tick');
  assert.doesNotMatch(plain, /milestone reached/);
  assert.doesNotMatch(flagged, /M7\.5 12\.5l3 3 6-6\.5/, 'no tick on a milestone step');
  assert.match(flagged, /M4 15s1-1 4-1/, 'the flag');
  assert.match(flagged, /text-\[var\(--summary-milestone\)\]/, 'a distinct colour');
  assert.match(plain, /text-success/);
  assert.doesNotMatch(flagged, /class="text-success"/);
  assert.match(flagged, /\(milestone reached\)/);
  // Which step each milestone flags.
  assert.deepEqual(defs.filter((d) => d.stepKey).map((d) => [d.id, d.stepKey]), [['identified', 'contact'], ['billing', 'billingAccount'], ['checkout', 'checkout'], ['caf', 'caf']]);
});

test('Billing profile ready is announced only when Recommended Offers loads, and nowhere else in the journey', () => {
  const billing = defs.find((d) => d.id === 'billing');
  assert.equal(billing.announceAt, 'product');
  const reachedBilling = [{ type: 'reached', id: 'billing', at: 1 }];
  const state = { identified: { at: 1 }, billing: { at: 1 } };
  // Reached while on Address or Billing Profile: recorded, but no toast yet.
  for (const step of ['contact', 'address', 'billingAccount']) {
    const r = eng.routeAnnouncements(defs, reachedBilling, state, step, new Set());
    assert.deepEqual(r.announce, [], step);
    assert.ok(r.pending.has('billing'), step);
  }
  // Still waiting while the journey moves between other steps...
  assert.deepEqual(eng.routeAnnouncements(defs, [], state, 'address', new Set(['billing'])).announce, []);
  // ...and shown when Recommended Offers loads, once.
  const onOffers = eng.routeAnnouncements(defs, [], state, 'product', new Set(['billing']));
  assert.deepEqual(onOffers.announce, ['billing']);
  assert.equal(onOffers.pending.size, 0);
  assert.deepEqual(eng.routeAnnouncements(defs, [], state, 'product', onOffers.pending).announce, [], 'not announced a second time');
  // Reached while already on Recommended Offers: shown at once.
  assert.deepEqual(eng.routeAnnouncements(defs, reachedBilling, state, 'product', new Set()).announce, ['billing']);
  // Later steps never show it.
  assert.deepEqual(eng.routeAnnouncements(defs, [], state, 'plan', new Set(['billing'])).announce, []);
  // Invalidated before the page loads: the waiting toast is dropped; re-reached, it waits again.
  const dropped = eng.routeAnnouncements(defs, [{ type: 'invalidated', id: 'billing', at: 2 }], { identified: { at: 1 } }, 'address', new Set(['billing']));
  assert.equal(dropped.pending.size, 0);
  // The other milestones are not held back.
  assert.deepEqual(eng.routeAnnouncements(defs, [{ type: 'reached', id: 'identified', at: 1 }], { identified: { at: 1 } }, 'contact', new Set()).announce, ['identified']);
});

test('the Billing profile flag in the summary also waits for Recommended Offers, and stays once shown', () => {
  const state = { identified: { at: 1 }, billing: { at: 1 } };
  const stepIndexOf = (key) => ['contact', 'address', 'billingAccount', 'product', 'plan'].indexOf(key);
  // On Address (index 1): billing is reached but held back, so its row is not flagged.
  let r = eng.holdUntilStep(defs, state, new Set(), stepIndexOf, 1);
  assert.deepEqual([...r.held], ['billing']);
  // On Recommended Offers (index 3): shown.
  r = eng.holdUntilStep(defs, state, r.released, stepIndexOf, 3);
  assert.equal(r.held.size, 0);
  // Later steps keep it; going back to Address does not hide it again.
  r = eng.holdUntilStep(defs, state, r.released, stepIndexOf, 4);
  r = eng.holdUntilStep(defs, state, r.released, stepIndexOf, 1);
  assert.equal(r.held.size, 0);
  // Not reached any more: forgotten, so it is held again when re-reached before the page.
  r = eng.holdUntilStep(defs, { identified: { at: 1 } }, r.released, stepIndexOf, 4);
  r = eng.holdUntilStep(defs, state, r.released, stepIndexOf, 1);
  assert.deepEqual([...r.held], ['billing']);
  // A resumed draft already past the page shows it at once.
  assert.equal(eng.holdUntilStep(defs, state, new Set(), stepIndexOf, 4).held.size, 0);
});

test('amending a completed stage re-reaches its milestone; only looking at it changes nothing', () => {
  const upTo = (values, past = []) => run(values, run(billed, run(identified).state, past).state, past);
  const newProfile = (cycle) => ({ ...identified, product: 'postpaid', billingAccount: { creatingNew: true, newAccount: { profileName: 'A - Postpaid', billCycleDay: cycle, billMedia: 'Email' } } });
  const first = run(newProfile(15), run(identified).state);
  assert.deepEqual(ids(first.events, 'reached'), ['billing']);
  // Viewing the step again (same values, however many evaluations): no event, state untouched.
  let again = run(newProfile(15), first.state);
  assert.deepEqual(again.events, []);
  assert.deepEqual(again.state, first.state);
  // Changing a field on it: the milestone is dropped, then reached again on the next evaluation (a fresh toast, held for Recommended Offers).
  const amended = run(newProfile(7), first.state);
  assert.deepEqual(ids(amended.events, 'invalidated'), ['billing']);
  assert.equal(amended.state.billing, undefined);
  const reReached = run(newProfile(7), amended.state);
  assert.deepEqual(ids(reReached.events, 'reached'), ['billing']);
  assert.notEqual(reReached.state.billing.evidence, first.state.billing.evidence);
  // Changing the customer's ID amends Customer Verification, and everything after it re-earns.
  const other = run({ ...identified, contact: { idNumber: '28800000000', moiResult: { name: 'B' } }, eligibility: { ...clean, idNumber: '28800000000' } }, reReached.state);
  assert.deepEqual(ids(other.events, 'invalidated'), ['identified', 'billing']);
  assert.equal(upTo(carted).state.identified.evidence, '29001234567');
});

test('Customer verified reads "New Customer" when MOI validated the ID but no customer record exists', async () => {
  const { useNotificationStore } = await load('/src/stores/notificationStore.ts');
  const { announceMilestone } = await load('/src/components/patterns/wizard/useJourneyMilestones.ts');
  const first = defs[0];
  const toastFor = (isExistingCustomer) => {
    useNotificationStore.setState({ toasts: [], history: [] });
    announceMilestone(first, undefined, { eligibility: { ...clean, isExistingCustomer } });
    return useNotificationStore.getState().toasts[0];
  };
  assert.deepEqual([toastFor(false).message, toastFor(false).detail], ['New Customer', 'MOI validated; no existing customer record found.']);
  assert.deepEqual([toastFor(true).message, toastFor(true).detail], ['Customer Verified', 'Customer identified and eligibility confirmed.']);
  assert.equal(toastFor(undefined).message, 'Customer Verified', 'unknown is not assumed to be new');
});


test('milestone toasts are not displayed by default: reached and recorded, but nothing is pushed; switching them on shows them again', async () => {
  const { useNotificationStore } = await load('/src/stores/notificationStore.ts');
  assert.equal(jm.MILESTONE_TOASTS_VISIBLE_DEFAULT, false);
  const def = { id: 'custom-test', title: 'Customer Verified', message: 'Customer identified and eligibility confirmed.' };
  useNotificationStore.setState({ toasts: [], history: [] });
  jm.setMilestoneToastsVisible(false);
  try {
    jm.announceMilestone(def);
    assert.equal(useNotificationStore.getState().toasts.length, 0);
    assert.equal(useNotificationStore.getState().history.length, 0, 'not in the bell either');
    jm.setMilestoneToastsVisible(true);
    jm.announceMilestone(def);
    assert.equal(useNotificationStore.getState().toasts.length, 1, 'the toast code still works when switched on');
  } finally {
    jm.setMilestoneToastsVisible(true);
  }
});

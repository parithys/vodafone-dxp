// The row menu of one service offers only what applies to that service now (kind, status, eligibility).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let actions;
let catalogue;
before(async () => {
  await boot();
  catalogue = await load('/src/navigation/journeyCatalogue.ts');
  actions = await load('/src/navigation/serviceActions.ts');
});
after(close);

const everyone = () => true;
const base = { kind: 'mobile', category: 'Postpaid', status: 'Active', blacklisted: false, barred: false, hasDeviceInstalment: false };
const titles = (facts, canUse = everyone) => actions.serviceActionsFor(facts, canUse).flatMap((g) => g.actions.map((a) => a.journey.id));

test('service actions: every rule names a journey that exists in the catalogue', () => {
  const ids = new Set(catalogue.PRODUCT_LINES.flatMap((l) => l.categories.flatMap((c) => c.journeys.map((j) => j.id))));
  for (const id of actions.SERVICE_ACTION_IDS) assert.ok(ids.has(id), `${id} is not a catalogue journey`);
});

test('service actions: an active postpaid line offers suspend, not resume; a suspended one the reverse', () => {
  const active = titles(base);
  assert.ok(active.includes('mob-suspend') && !active.includes('mob-resume'));
  const suspended = titles({ ...base, status: 'Suspended' });
  assert.ok(suspended.includes('mob-resume') && !suspended.includes('mob-suspend'));
  assert.ok(!suspended.includes('mob-change-postpaid-plan'), 'a suspended line cannot change plan');
});

test('service actions: postpaid and prepaid lines get their own plan journey', () => {
  assert.ok(titles(base).includes('mob-change-postpaid-plan') && !titles(base).includes('mob-change-prepaid-pack'));
  const prepaid = titles({ ...base, category: 'Prepaid' });
  assert.ok(prepaid.includes('mob-change-prepaid-pack') && !prepaid.includes('mob-change-postpaid-plan'));
});

test('service actions: a blacklisted customer or barred line cannot change plan or transfer ownership', () => {
  for (const f of [{ ...base, blacklisted: true }, { ...base, barred: true }]) {
    const ids = titles(f);
    assert.ok(!ids.includes('mob-change-postpaid-plan') && !ids.includes('mob-ownership-change'));
    assert.ok(ids.includes('mob-view-service'), 'viewing the service is always possible');
  }
  assert.ok(!titles({ ...base, barred: true }).includes('mob-suspend'));
});

test('service actions: a device upgrade needs a postpaid line with an approved device instalment', () => {
  assert.ok(!titles(base).includes('mob-device-upgrade'));
  assert.ok(titles({ ...base, hasDeviceInstalment: true }).includes('mob-device-upgrade'));
  assert.ok(!titles({ ...base, category: 'Prepaid', hasDeviceInstalment: true }).includes('mob-device-upgrade'));
});

test('service actions: customer-level journeys never appear on a line', () => {
  const ids = titles(base);
  for (const id of ['mob-mnp-portin', 'mob-number-reservation', 'mob-customer-validation', 'mob-contact-update', 'mob-authorised-rep', 'mob-new-connection']) {
    assert.ok(!ids.includes(id), `${id} is a customer-level action`);
  }
});

test('service actions: a fibre line gets the Fibre & Home journeys only, and FWA only on a 5G service', () => {
  const home = { ...base, kind: 'home', category: 'GigaHome Fibre' };
  const ids = titles(home);
  assert.ok(ids.includes('fib-view-service') && ids.includes('fib-change-plan'));
  assert.ok(!ids.some((id) => id.startsWith('mob-')));
  assert.ok(!ids.includes('fib-fwa-5g-service') && titles({ ...home, category: 'GigaHome 5G' }).includes('fib-fwa-5g-service'));
});

test('service actions: a role without the grant does not get the journey', () => {
  const noMnpOrSim = (k) => k !== 'numbers.sim-swap-queue';
  const ids = titles(base, noMnpOrSim);
  assert.ok(!ids.includes('mob-sim-replacement'));
  assert.ok(ids.includes('mob-view-service'));
});

test('service actions: a planned journey that applies is listed but not open', () => {
  const groups = actions.serviceActionsFor(base, everyone);
  const suspend = groups.flatMap((g) => g.actions).find((a) => a.journey.id === 'mob-suspend');
  assert.equal(suspend.open, false);
  const view = groups.flatMap((g) => g.actions).find((a) => a.journey.id === 'mob-view-service');
  assert.equal(view.open, true);
});

test('service actions: Gold Number is not a line action, SIM Replacement/Swap is one entry, FNP is fibre-only', () => {
  const mobile = titles(base);
  assert.ok(!mobile.includes('mob-gold-number'), 'assigning a number is not an action on this line');
  assert.ok(!mobile.includes('mob-fnp-change') && !mobile.includes('fib-fnp-change'), 'FNP is not offered on a mobile line');
  assert.ok(mobile.includes('mob-sim-replacement') && !mobile.includes('mob-sim-swap'));
  const home = { ...base, kind: 'home', category: 'GigaHome Fibre' };
  assert.ok(titles(home).includes('fib-fnp-change'));
  assert.ok(!titles({ ...home, status: 'Suspended' }).includes('fib-fnp-change'));
});

test('service actions: every service-level journey has its own icon, none shared within a product line', async () => {
  const icons = await load('/src/navigation/journeyIcons.ts');
  for (const id of actions.SERVICE_ACTION_IDS) assert.ok(icons.JOURNEY_ICON_IDS.includes(id), `${id} has no icon`);
  for (const prefix of ['mob-', 'fib-']) {
    const paths = actions.SERVICE_ACTION_IDS.filter((id) => id.startsWith(prefix)).map((id) => icons.journeyIcon(id, ''));
    assert.equal(new Set(paths).size, paths.length, `${prefix} journeys share an icon`);
  }
});

// One New Prepaid journey for web and tablet: the device changes how steps are operated, never which steps there are.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

// The step modules touch window at import time; the harness window is a bare object.
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
let lib;
let connection;
let cfg;
before(async () => {
  ({ cfg } = await boot());
  lib = await load('/src/lib/deviceType.ts');
  connection = await load('/src/modules/new-connection/connectionSteps.tsx');
});
after(close);

test('device type: any touch point or a coarse pointer is a tablet, otherwise web', () => {
  assert.equal(lib.deviceTypeFrom({ maxTouchPoints: 0, coarsePointer: false }), 'web');
  assert.equal(lib.deviceTypeFrom({}), 'web');
  assert.equal(lib.deviceTypeFrom({ maxTouchPoints: 5 }), 'tablet');
  assert.equal(lib.deviceTypeFrom({ maxTouchPoints: 0, coarsePointer: true }), 'tablet');
});

test('New Prepaid: web and tablet run the same steps in the same order', () => {
  const ctx = (device) => ({ device, wizardId: 'new-connection', flow: 'new', existingCustomerId: undefined, guardedContactChange: () => {}, applyCrossSales: () => {}, navigate: () => {}, createRecord: async () => {}, products: [], customerBenefits: undefined });
  const keys = (device) => connection.buildConnectionSteps(ctx(device)).filter((s) => !s.skip?.({ product: 'prepaid' })).map((s) => s.key);
  assert.deepEqual(keys('web'), keys('tablet'));
  assert.deepEqual(keys('web'), ['contact', 'address', 'product', 'plan', 'planExtras', 'number', 'simType', 'cart', 'checkout', 'caf', 'payment']);
});

test('New Prepaid: one catalogued screen, one feature, no Tablet-only journey', () => {
  const routes = cfg.getAllRoutes().filter((r) => r.module === 'Mobile Prepaid');
  assert.deepEqual(routes.filter((r) => /prepaid/i.test(r.path)).map((r) => r.screenId), ['SCR-190']);
  assert.ok(routes.every((r) => !/tablet/i.test(r.screenName)), 'no screen is named for a device');
  const feature = cfg.getFeatureEntry('prepaid.new-prepaid-wizard');
  assert.deepEqual(feature?.screenIds, ['SCR-190']);
});

test('SIM serial: tablet is scan-led (visible Scan button), web is type-led (field takes focus)', async () => {
  const { SimSerialScanner } = await load('/src/components/domain/SimSerialScanner.tsx');
  const render = (device) => html(React.createElement(SimSerialScanner, { value: '', onChange: () => {}, device }));
  assert.match(render('tablet'), />Scan SIM barcode</);
  assert.doesNotMatch(render('web'), />Scan SIM barcode</);
  assert.doesNotMatch(render('tablet'), /autofocus/i);
  // No device given (every other journey): unchanged - no extra button.
  assert.doesNotMatch(render(undefined), />Scan SIM barcode</);
});

test('CAF type follows the device: Touch Screen on a tablet, Digital on the web', async () => {
  const { detectCafType } = await load('/src/components/patterns/cafTypes.ts');
  assert.equal(detectCafType(), lib.detectDeviceType() === 'tablet' ? 'Touch Screen' : 'Digital');
});

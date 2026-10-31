import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

// Service / line classification, validated against the WHOLE mock dataset and against an expectation written down independently of the
// classifier (a table of what each distinct service name is), never against records the classifier itself selected.
const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'mock-data');
const rows = (kind) => JSON.parse(fs.readFileSync(path.join(DATA, `${kind}.json`), 'utf8'));

let engine, lines;
before(async () => {
  await boot();
  engine = await load('/src/engines/customerServicesEngine.ts');
  lines = await load('/src/components/patterns/lineSelectionModel.ts');
});
after(close);

// What each distinct installed-asset service name IS, from the names themselves and the product catalogue (not from the classifier). A
// new name in the data fails the coverage test below until someone decides what it is.
const EXPECTED_CATEGORY = {
  'Postpaid Mobile Plan - Red 150': 'Postpaid',
  'Postpaid Essential': 'Postpaid',
  'Postpaid Extra': 'Postpaid',
  'Postpaid Max': 'Postpaid',
  'Postpaid Unlimited': 'Postpaid',
  'Postpaid Unlimited Premium': 'Postpaid',
  'SIM Card - Postpaid': 'Postpaid',
  'Prepaid Red 25': 'Prepaid',
  'Prepaid Red 50': 'Prepaid',
  'Prepaid Red 100': 'Prepaid',
  'GigaHome Fiber 1Gbps': 'GigaHome Fibre',
  'Broadband 500Mbps Promotion': 'GigaHome Fibre',
  'Fixed Voice Line - Home': 'Fixed Line',
  'OSNtv Premium': 'TV / Entertainment',
  'IoT Smart Plug': 'Smart Devices',
  'IoT Indoor Tracker': 'Smart Devices',
};

test('every distinct service name in the data has an expected category, and the classifier agrees with all of them (no false positives, no false negatives)', () => {
  const names = [...new Set(rows('installed-assets').map((a) => a.productServiceName))];
  const unexpected = names.filter((n) => !(n in EXPECTED_CATEGORY));
  assert.deepEqual(unexpected, [], 'a service name nobody has classified: decide what it is and add it to the table');
  const diffs = names.filter((n) => engine.classifyProductName(n).category !== EXPECTED_CATEGORY[n]);
  assert.deepEqual(diffs, []);
  for (const cat of ['Postpaid', 'Prepaid']) {
    const expected = new Set(names.filter((n) => EXPECTED_CATEGORY[n] === cat));
    const actual = new Set(names.filter((n) => engine.classifyProductName(n).category === cat));
    assert.deepEqual([...actual].filter((n) => !expected.has(n)), [], `${cat}: false positives`);
    assert.deepEqual([...expected].filter((n) => !actual.has(n)), [], `${cat}: false negatives`);
  }
});

// Table-driven: input | expected | why.
const CASES = [
  ['Postpaid Mobile Plan - Red 150', 'postpaid', 'a postpaid line whose record carries an FWA promotion code'],
  ['Postpaid Essential', 'postpaid', 'a catalogue postpaid plan'],
  ['SIM Card - Postpaid', 'postpaid', 'a SIM named for postpaid'],
  ['Prepaid Red 25', 'prepaid', 'a prepaid pack'],
  ['prepaid red 50', 'prepaid', 'case-insensitive'],
  ['Broadband 500Mbps Promotion', undefined, 'broadband is not a mobile line'],
  ['GigaHome Fiber 1Gbps', undefined, 'fibre'],
  ['Fixed Voice Line - Home', undefined, 'fixed line'],
  ['OSNtv Premium', undefined, 'TV'],
  ['IoT Smart Plug', undefined, 'a device'],
  ['Something Nobody Has Seen', undefined, 'unknown stays unknown, not postpaid'],
  ['SIM Card', undefined, 'a SIM that does not say postpaid or prepaid is not assumed to be postpaid'],
  ['Mobile Broadband Add-on', undefined, '"mobile" alone does not make a postpaid line'],
  ['Simple Plan', undefined, 'a name merely containing "sim" is not a SIM'],
  ['Smart Home Camera', undefined, 'a device is not a mobile line'],
  ['IoT SIM 1GB', undefined, 'an IoT SIM is a device, not a mobile line'],
  ['PREPAID RED 25', 'prepaid', 'case'],
  ['Postpaid + Prepaid Bundle', 'prepaid', 'a name carrying both words: prepaid is checked first, as Customer 360 does'],
  ['', undefined, 'empty'],
  [undefined, undefined, 'missing'],
];
for (const [name, expected, why] of CASES) {
  test(`mobileLineTypeOfName(${JSON.stringify(name)}) is ${expected}: ${why}`, () => assert.equal(engine.mobileLineTypeOfName(name), expected));
}

test('an IoT SIM is a device and a bare SIM is Other', () => {
  assert.equal(engine.classifyProductName('IoT SIM 1GB').category, 'Smart Devices');
  assert.equal(engine.classifyProductName('SIM Card').category, 'Other');
  assert.equal(engine.classifyProductName('Simple Plan').category, 'Other');
});

test('an unrecognised service is Other, never silently a service type', () => {
  assert.deepEqual(engine.classifyProductName('Something Nobody Has Seen'), { tab: 'assets', category: 'Other' });
  assert.deepEqual(engine.classifyProductName(undefined), { tab: 'assets', category: 'Other' });
});

const sourcesOf = () => ({ accounts: rows('accounts'), installedAssets: rows('installed-assets'), gigahome: rows('gigahome-osntv-subscriptions'), iptvBundles: rows('iptv-stb-bundles'), smartDevices: rows('smart-devices') });

test('for EVERY customer, the lines a journey offers are exactly the mobile services Customer 360 lists (no line lost, none invented)', async () => {
  const customers = rows('customers');
  const src = sourcesOf();
  const accounts = rows('accounts');
  const assets = rows('installed-assets');
  const problems = [];
  let most = 0;
  for (const c of customers) {
    const ssot = engine.listCustomerServices(c, src).filter((s) => s.tab === 'mobile' && (s.category === 'Postpaid' || s.category === 'Prepaid'));
    const offered = await lines.loadCustomerLines(c.customerId);
    most = Math.max(most, offered.length);
    const ssotIds = new Set(ssot.map((s) => s.identifier));
    const offeredIds = new Set(offered.map((l) => l.identifier));
    const lost = [...ssotIds].filter((i) => !offeredIds.has(i));
    const invented = [...offeredIds].filter((i) => !ssotIds.has(i));
    if (lost.length || invented.length) problems.push({ customer: c.customerId, lost, invented });
    // Per type, against the Customer 360 categories.
    for (const [type, category] of [['postpaid', 'Postpaid'], ['prepaid', 'Prepaid']]) {
      const expectedN = ssot.filter((s) => s.category === category).length;
      assert.equal(offered.filter((l) => l.lineType === type).length, expectedN, `${c.customerId}: ${type} lines`);
    }
    // Conservation: the customer's live assets = their mobile lines + everything that is not a mobile line (nothing silently dropped).
    const own = new Set(accounts.filter((a) => a.customerId === c.customerId).map((a) => a.accountId));
    const live = assets.filter((a) => own.has(a.accountId) && engine.LIVE_SERVICE_STATUSES.includes(a.status));
    const mobileAssets = live.filter((a) => engine.mobileLineTypeOfName(a.productServiceName));
    assert.equal(offered.length, mobileAssets.length, `${c.customerId}: offered lines + dropped = live mobile assets`);
    assert.equal(live.length, mobileAssets.length + live.filter((a) => !engine.mobileLineTypeOfName(a.productServiceName)).length);
  }
  assert.deepEqual(problems, []);
  assert.ok(most >= 20, `the dataset has a customer with many lines (largest: ${most}), so the many-line case is really exercised`);
});

test('the population has the shapes the rules must handle: no lines, one line, many lines, postpaid + prepaid, mobile + other services', async () => {
  const counts = [];
  for (const c of rows('customers')) {
    const ls = await lines.loadCustomerLines(c.customerId);
    counts.push({ id: c.customerId, n: ls.length, types: new Set(ls.map((l) => l.lineType)) });
  }
  assert.ok(counts.some((c) => c.n === 0), 'a customer with no mobile line');
  assert.ok(counts.some((c) => c.n === 1), 'a one-line customer');
  assert.ok(counts.some((c) => c.n >= 20), 'a many-line customer');
  assert.ok(counts.some((c) => c.types.has('postpaid') && c.types.has('prepaid')), 'a customer with both postpaid and prepaid');
});

test('a customer whose records disagree (service named Postpaid, promotion code of an FWA plan) is still offered the line', async () => {
  const products = new Map(rows('products').map((p) => [p.productId, p]));
  const conflicting = rows('installed-assets').filter((a) => engine.mobileLineTypeOfName(a.productServiceName) && products.get(a.promotion)?.type === 'FWA 5G Home Plan');
  assert.ok(conflicting.length >= 19, 'the conflicting records exist in the data');
  const accounts = rows('accounts');
  const owner = accounts.find((a) => a.accountId === conflicting[0].accountId).customerId;
  const offered = await lines.loadCustomerLines(owner, 'postpaid');
  for (const a of conflicting.filter((x) => x.accountId === conflicting[0].accountId)) {
    const line = offered.find((l) => l.installedAssetId === a.installedAssetId);
    assert.ok(line, `${a.installedAssetId} is offered`);
    assert.equal(line.productId, undefined, 'the FWA promotion code is not taken as the line\'s plan: the plan is unknown, not guessed');
    assert.equal(line.productName, a.productServiceName);
  }
});

test('missing or unknown customers give no lines rather than an error or a guess', async () => {
  assert.deepEqual(await lines.loadCustomerLines(''), []);
  assert.deepEqual(await lines.loadCustomerLines('CUST-DOES-NOT-EXIST'), []);
});

test('every catalogue plan name classifies back to its own type, so a line renamed to its new plan (plan change, Pre-to-Post) stays the kind of line it was moved to', () => {
  const wrong = [];
  for (const p of rows('products')) {
    const kind = engine.mobileLineTypeOfName(p.name);
    if (p.type === 'Postpaid Plan' && kind !== 'postpaid') wrong.push(`${p.productId} ${p.name} (Postpaid Plan) -> ${kind}`);
    if (p.type === 'Prepaid Plan' && kind !== 'prepaid') wrong.push(`${p.productId} ${p.name} (Prepaid Plan) -> ${kind}`);
    if (p.type !== 'Postpaid Plan' && p.type !== 'Prepaid Plan' && kind) wrong.push(`${p.productId} ${p.name} (${p.type}) -> ${kind}`);
  }
  assert.deepEqual(wrong, []);
});

test('lines whose service id is not an MSISDN are still offered (and are the known data limitation), never dropped or given a made-up number', async () => {
  const all = [];
  for (const c of rows('customers')) all.push(...(await lines.loadCustomerLines(c.customerId)));
  const odd = all.filter((l) => !/^\+974\d{8}$/.test(l.identifier));
  assert.ok(odd.length > 0 && odd.every((l) => /^SVC-/.test(l.identifier)), 'the identifier is the record\'s own service id');
});

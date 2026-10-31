// Every Qatar phone number in the seeded data is 8 digits; mobile numbers lead with 3/5/6/7, landline/fixed numbers with 4.
// The field -> type table is written independently of the code: a field name says what the number IS.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, close } from './harness.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANDLINE_FIELDS = new Set(['workPhone', 'voipNumber']);
// line-items.json's voipNumber sits on a SIM Card row and holds that line's mobile MSISDN (the same +97433001003 the customer's
// other screens use), so the column name does not make it a landline. Every other voipNumber (cpe-devices.json) is a fixed line.
const MOBILE_IN_FILE = new Set(['public/mock-data/line-items.json:voipNumber']);
const MOBILE_FIELDS = new Set([
  'cellNumber', 'mobile', 'mobileNumber', 'msisdn', 'phone', 'billingContactPhone', 'altPhone', 'accountManagerMobile',
  'primaryMsisdn', 'secondaryMsisdn', 'assignedNumber', 'portInNumber', 'kioskMobileNumber', 'attrib01Msisdn',
]);

function* jsonFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* jsonFiles(p);
    else if (e.name.endsWith('.json')) yield p;
  }
}
function* phones(o, file, k) {
  if (Array.isArray(o)) for (const v of o) yield* phones(v, file, k);
  else if (o && typeof o === 'object') for (const [a, b] of Object.entries(o)) yield* phones(b, file, a);
  else if (typeof o === 'string' && (LANDLINE_FIELDS.has(k) || MOBILE_FIELDS.has(k)) && file.startsWith('public/mock-data/')) yield { file, field: k, value: o };
}
const toLocal = (v) => v.replace(/[\s-]/g, '').replace(/^\+?974/, '');

after(close);

test('every seeded Qatar phone number is 8 digits and matches its field type', async () => {
  const { isQatarMobileLocalNumber, isQatarLandlineLocalNumber } = await load('/src/components/primitives/countryDialCodes.ts');
  const all = [];
  for (const f of jsonFiles(path.join(ROOT, 'public'))) all.push(...phones(JSON.parse(fs.readFileSync(f, 'utf8')), path.relative(ROOT, f)));
  assert.ok(all.length > 400, `expected a real population, saw ${all.length}`);
  const wrong = all.filter(({ file, field, value }) => {
    const local = toLocal(value);
    return !(LANDLINE_FIELDS.has(field) && !MOBILE_IN_FILE.has(`${file}:${field}`) ? isQatarLandlineLocalNumber(local) : isQatarMobileLocalNumber(local));
  });
  assert.deepEqual(wrong, []);
});

test('the mobile and landline rules are exact complements on the 8-digit space', async () => {
  const { isQatarMobileLocalNumber, isQatarLandlineLocalNumber } = await load('/src/components/primitives/countryDialCodes.ts');
  for (let d = 0; d <= 9; d++) {
    const n = `${d}1234567`;
    assert.equal(isQatarMobileLocalNumber(n), '3567'.includes(String(d)), n);
    assert.equal(isQatarLandlineLocalNumber(n), d === 4, n);
  }
  for (const bad of ['', '5123456', '512345678', '5123456x', '+97455123456']) {
    assert.equal(isQatarMobileLocalNumber(bad), false, bad);
    assert.equal(isQatarLandlineLocalNumber(bad), false, bad);
  }
});

// The Address (the secondary address) is filled for the agent from the billing profile's address, or "-" when there is none, and the step is passed
// over. Expectations come from a table of what each billing-address string IS, checked over the whole billing-profiles dataset.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => { await boot(); m = await load('/src/components/patterns/addressFromBilling.ts'); });
after(close);

const profiles = JSON.parse(fs.readFileSync('public/mock-data/billing-profiles.json', 'utf8'));

// What each distinct billing address in the data IS, written out by hand: [zone, street, building] it labels, or '-' where it does not.
const TABLE = {
  'Doha, Qatar': ['-', '-', '-'],
  'Zone 55, Street 8, Al Sadd, Doha': ['55', '8', '-'],
  'Zone 66, Street 214, The Pearl, Doha': ['66', '214', '-'],
  'Office 302, West Bay Tower, Doha': ['-', '-', '-'],
};

test('every billing address in the data resolves as the table says; the line is kept whole; nothing is guessed', () => {
  const seen = new Set();
  for (const p of profiles) {
    const a = p.billingAddress;
    const got = m.addressFromBillingLine(a);
    if (!a || /^none$/i.test(a)) {
      assert.deepEqual([got.zone, got.streetNo, got.buildingNo], ['-', '-', '-'], p.billingProfileId);
      assert.equal(got.addressLine, undefined, 'no address: no line');
      continue;
    }
    seen.add(a);
    assert.equal(got.addressLine, a, 'the billing line is kept whole');
    const m1 = /^Zone (\d+), Street (\d+), [^,]+$/.exec(a);
    const expected = m1 ? [m1[1], m1[2], '-'] : TABLE[a];
    assert.ok(expected, `${a} needs a row in the table`);
    assert.deepEqual([got.zone, got.streetNo, got.buildingNo], expected, a);
  }
  assert.ok(seen.size > 3);
});

test('empty and unlabelled input: placeholders only', () => {
  for (const v of [undefined, null, '', '   ', 'None', 'none']) {
    assert.deepEqual(m.addressFromBillingLine(v), { zone: '-', streetNo: '-', buildingNo: '-' });
  }
});

test('an address the agent typed is never treated as a prefill; an untouched or automatic one is', () => {
  assert.equal(m.addressIsEntered(undefined), false);
  assert.equal(m.addressIsEntered({}), false);
  assert.equal(m.addressIsEntered({ zone: '-', prefilledKey: 'BILL-7001' }), false);
  assert.equal(m.addressIsEntered({ zone: '12', prefilledKey: undefined }), true);
  assert.equal(m.addressIsEntered({ zone: '12', prefilledKey: 'BILL-7001' }), false, 'still the automatic one until an edit drops the marker');
});

test('every journey that passes the Address over wires the prefill, and an edit drops the marker', () => {
  const step = fs.readFileSync('src/capabilities/ServiceAddress/step.tsx', 'utf8');
  assert.match(step, /headless:[\s\S]*<AddressPrefill/);
  assert.match(step, /prefilledKey: undefined/);
  for (const f of ['src/modules/new-connection/connectionSteps.tsx', 'src/modules/new-connection/postpaidSteps.tsx', 'src/modules/mobile-prepaid/screens/prepaidSteps.tsx', 'src/modules/mnp-fnp-porting/screens/mnpSteps.tsx']) {
    assert.match(fs.readFileSync(f, 'utf8'), /serviceAddressStep\([\s\S]*?autoPass: true/, f);
  }
  assert.match(fs.readFileSync('src/modules/mobile-prepaid/screens/prepaidSteps.tsx', 'utf8'), /billing: \(\) => false/);
  // The NAS National Address is never the source.
  assert.doesNotMatch(fs.readFileSync('src/capabilities/ServiceAddress/AddressPrefill.tsx', 'utf8'), /nas-records|nationalAddress/);
});

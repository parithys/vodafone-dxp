import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let lookup;
before(async () => {
  await boot();
  ({ lookupServiceLocation: lookup } = await load('/src/engines/serviceLocationLookup.ts'));
});
after(close);

test('service location: a Kahramaa ID on a customer address fills zone, street, building, unit and area', async () => {
  const r = await lookup({ kid: ' kid-1101 ' });
  assert.equal(r.found, true);
  assert.deepEqual(
    { zone: r.fields.zone, streetNo: r.fields.streetNo, buildingNo: r.fields.buildingNo, aptFlatUnit: r.fields.aptFlatUnit, area: r.fields.area },
    { zone: '55', streetNo: '12', buildingNo: '34', aptFlatUnit: 'Flat 2', area: 'Doha' },
  );
});

test('service location: a Vodafone ID, with or without dashes, finds its service point, KID and unit', async () => {
  for (const q of ['WKR-0231-A', 'wkr0231a']) {
    const r = await lookup({ vodafoneId: q });
    assert.equal(r.found, true, q);
    assert.equal(r.fields.kidLocationId, 'KID-70011234');
    assert.equal(r.fields.vodafoneId, 'WKR-0231-A');
    assert.equal(r.fields.aptFlatUnit, 'Flat 2');
    assert.equal(r.fields.zone, '55');
  }
});

test('service location: a KID shared by several flats gives only what they share (no unit, no Vodafone ID)', async () => {
  const r = await lookup({ kid: 'KID-70011234' });
  assert.equal(r.found, true);
  assert.equal(r.fields.streetNo, '12');
  assert.equal(r.fields.aptFlatUnit, undefined);
  assert.equal(r.fields.vodafoneId, undefined);
});

test('service location: an ID that matches no record is not found, and an empty search is too', async () => {
  assert.equal((await lookup({ kid: 'KID-0000' })).found, false);
  assert.equal((await lookup({ vodafoneId: 'ZZZ-0000-Z' })).found, false);
  assert.equal((await lookup({})).found, false);
});

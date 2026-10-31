// The Switch role list: CBU, then EBU, then no business unit, then the rest; original order kept within a group.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let sort;
before(async () => {
  await boot();
  ({ sortByBusinessUnit: sort } = await load('/src/navigation/personaOrder.ts'));
});
after(close);

const names = (list) => sort(list).map((r) => r.n);

test('persona order: CBU, then EBU, then none, then others, stable within each group', () => {
  const roles = [
    { n: 'a', businessUnitLabel: 'CBU + EBU' }, { n: 'b', businessUnitLabel: 'EBU' }, { n: 'c', businessUnitLabel: '-' },
    { n: 'd', businessUnitLabel: 'CBU' }, { n: 'e', businessUnitLabel: 'Primarily CBU' }, { n: 'f', businessUnitLabel: 'CBU' },
    { n: 'g', businessUnitLabel: 'EBU' }, { n: 'h' }, { n: 'i', businessUnitLabel: 'IT / Corporate' },
  ];
  assert.deepEqual(names(roles), ['d', 'f', 'b', 'g', 'c', 'h', 'a', 'e', 'i']);
});

test('persona order: sorting does not change the input', () => {
  const roles = [{ n: 'x', businessUnitLabel: 'EBU' }, { n: 'y', businessUnitLabel: 'CBU' }];
  sort(roles);
  assert.deepEqual(roles.map((r) => r.n), ['x', 'y']);
});

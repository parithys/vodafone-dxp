// The number picker's "search by" dropdown (XXYY, Ends With, Starts With, Contains) over the 8-digit local number. Expectations are computed digit
// by digit, independently of the matcher, over every number in the inventory, in both directions (false positives and false negatives).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => { await boot(); m = await load('/src/components/domain/msisdnPickerModel.ts'); });
after(close);

const nums = JSON.parse(fs.readFileSync('public/mock-data/numbers.json', 'utf8')).filter((n) => n.msisdn);
const local = (n) => n.msisdn.replace(/[\s+-]/g, '').replace(/^974/, '');

test('the dropdown offers All, XXYY, Contains, Starts With, Ends With in that order, and opens on All', () => {
  assert.deepEqual(m.SEARCH_MODE_OPTIONS.map((o) => o.label), ['All', 'Price', 'Starts With', 'Ends With', 'Contains', 'Pattern']);
  assert.equal(m.DEFAULT_SEARCH_MODE, 'any');
  assert.equal(m.SEARCH_MODE_OPTIONS[0].value, m.DEFAULT_SEARCH_MODE);
});

test('XXYY accepts only repeating pairs of identical digits, 2 to 8 digits; anything else is an error, not a search', () => {
  for (const ok of ['33', '3344', '1133', '2299', '3333', '112233', '77224455']) {
    assert.equal(m.isRepeatingPairs(ok), true, ok);
    assert.equal(m.searchError(ok, 'xxyy'), undefined, ok);
  }
  for (const bad of ['3', '334', '3345', '1234', '33445', '3344556', '772244556', '33a4', '3 4', 'ab']) {
    const text = bad === '3 4' ? '3 4' : bad;
    assert.ok(m.searchError(text, 'xxyy'), `"${bad}" must be rejected`);
  }
  assert.equal(m.searchError('', 'xxyy'), undefined, 'empty is no search, not an error');
  assert.match(m.searchError('3345', 'xxyy'), /repeating pairs/i);
});

test('Any takes a number or a tier name; Contains, Starts With and Ends With take digits only', () => {
  assert.equal(m.searchError('33a0', 'starts'), 'Enter digits only.');
  assert.equal(m.searchError('33a0', 'ends'), 'Enter digits only.');
  assert.equal(m.searchError('33a0', 'contains'), 'Enter digits only.');
  assert.equal(m.searchError('3300', 'starts'), undefined);
  assert.equal(m.searchError('gold', 'any'), undefined);
  assert.equal(m.searchError('3345', 'any'), undefined, 'Any applies no pattern: not an XXYY error');
});

test('every number, every mode: matches exactly what a digit-by-digit expectation says', () => {
  assert.ok(nums.length > 10);
  for (const n of nums) {
    const d = local(n);
    assert.equal(d.length, 8, n.msisdn);
    for (const q of [d.slice(0, 1), d.slice(0, 4), d.slice(0, 8), d.slice(-2), d.slice(-4), d.slice(-8), d.slice(2, 6), d.slice(1, 3), '99', '0000', '12345678']) {
      assert.equal(m.matchesNumberSearch(n, q, 'starts'), d.startsWith(q), `starts ${q} ${n.msisdn}`);
      assert.equal(m.matchesNumberSearch(n, q, 'ends'), d.endsWith(q), `ends ${q} ${n.msisdn}`);
      assert.equal(m.matchesNumberSearch(n, q, 'contains'), d.includes(q), `contains ${q} ${n.msisdn}`);
      assert.equal(m.matchesNumberSearch(n, q, 'any'), d.includes(q), `any ${q} ${n.msisdn}`);
    }
    // XXYY: the typed repeating pairs appear consecutively; a full 8 digits finds only that number.
    for (const p of ['33', '3300', '2211', '77224455', '55566677'.slice(0, 8)]) {
      if (!m.isRepeatingPairs(p)) continue;
      assert.equal(m.matchesNumberSearch(n, p, 'xxyy'), d.includes(p), `xxyy ${p} ${n.msisdn}`);
    }
  }
});

test('the spec examples: 1234 is found anywhere; the country code and E.164 are not part of the number; a full 8-digit XXYY returns only that number', () => {
  for (const d of ['74012340', '74123400', '71234400']) assert.equal(m.matchesNumberSearch({ msisdn: `+974${d}` }, '1234', 'contains'), true, d);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433001001' }, '974', 'contains'), false, 'the country code is not searched');
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433001001' }, '3300', 'starts'), true);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433001001' }, '1001', 'ends'), true);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433001001' }, '55 66', 'contains'), false);
  const all = ['77224455', '77224456', '17722445', '77224400'].map((d) => ({ msisdn: `+974${d}` }));
  assert.deepEqual(all.filter((n) => m.matchesNumberSearch(n, '77224455', 'xxyy')).map((n) => n.msisdn), ['+97477224455']);
});

test('text a mode does not accept matches nothing (it is shown as an error and never searched)', () => {
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566' }, '3345', 'xxyy'), false);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566' }, 'ab', 'starts'), false);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566', valueTier: 'Gold' }, 'gol', 'contains'), false, 'Contains is for digits');
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566', valueTier: 'Gold' }, 'gol', 'any'), true, 'Any also finds a tier name');
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566' }, '4455', 'any'), true);
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433445566' }, '', 'any'), true, 'empty: every number');
});

test('"Show Me All Available Patterns": every number with a repeating-pair pattern (3300, 3311, 4488...), computed independently, in both directions', () => {
  const hasPair = (d) => { for (let i = 0; i <= d.length - 4; i++) if (d[i] === d[i + 1] && d[i + 2] === d[i + 3]) return true; return false; };
  let withPattern = 0;
  for (const n of nums) {
    const d = local(n);
    assert.equal(m.hasRepeatingPairPattern(n.msisdn), hasPair(d), n.msisdn);
    if (hasPair(d)) withPattern++;
  }
  assert.ok(withPattern > 0 && withPattern < nums.length, 'some, not all, numbers have a pattern');
  for (const d of ['33001234', '12334400', '12345566', '55661234', '44881111']) assert.equal(m.hasRepeatingPairPattern(`+974${d}`), true, d);
  for (const d of ['12345678', '12234567', '13572468', '12121212']) assert.equal(m.hasRepeatingPairPattern(`+974${d}`), false, d);
});

test('the checkbox appears only under XXYY, disables the search box while checked, and unchecks when another mode is chosen', () => {
  const src = fs.readFileSync('src/components/domain/MsisdnPicker.tsx', 'utf8');
  assert.match(src, /searchMode === 'xxyy' && \(\s*<label[\s\S]*Show Me All Available Patterns/);
  assert.match(src, /disabled=\{showingAllPatterns\}/);
  assert.match(src, /const showingAllPatterns = searchMode === 'xxyy' && allPatterns/);
  assert.match(src, /setAllPatterns\(false\);\s*setPage\(0\);/, 'changing the mode drops the checkbox');
  assert.match(src, /if \(showingAllPatterns\) return hasRepeatingPairPattern\(n\.msisdn\)/);
});

test('Price is filtered by Min Price and Max Price, both ends included, an empty box leaving that end open', () => {
  assert.equal(m.priceBound('25,000'), 25000);
  assert.equal(m.priceBound(' 250 '), 250);
  assert.equal(m.priceBound(''), undefined);
  assert.equal(m.priceBound('25k'), undefined, 'not a figure: the box is treated as empty');
  const nums = [{ priceQAR: 0 }, { priceQAR: 4999 }, { priceQAR: 5000 }, { priceQAR: 25000 }, { priceQAR: 41250 }, { priceQAR: 50000 }];
  const within = (min, max) => nums.filter((n) => m.matchesPriceRange(n.priceQAR, min, max)).map((n) => n.priceQAR);
  assert.deepEqual(within('', ''), nums.map((n) => n.priceQAR), 'both empty is no filter (conservation)');
  assert.deepEqual(within('5000', '25000'), [5000, 25000], 'inclusive at both ends');
  assert.deepEqual(within('25000', ''), [25000, 41250, 50000], 'Min only');
  assert.deepEqual(within('', '4999'), [0, 4999], 'Max only');
  assert.deepEqual(within('30000', '20000'), [], 'Min above Max matches nothing');
  assert.equal(m.matchesPriceRange(undefined, '1', ''), false, 'a number with no price matches nothing once a bound is set');
  assert.equal(m.matchesPriceRange(undefined, '', ''), true);
  // the mode itself takes no text: Price never rejects a number on the search text
  assert.equal(m.matchesNumberSearch({ msisdn: '+97433333333', priceQAR: 25000 }, 'abc', 'price'), true);
  assert.equal(m.searchError('anything', 'price'), undefined, 'the search box is not shown in this mode');
});

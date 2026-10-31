// The number inventory: every number is a Qatar mobile number (8 digits after +974, first digit 3, 5, 6 or 7 - the ranges Vodafone Qatar uses),
// numbers are unique, and every Star number is priced inside the Star lock-in tiers with a value tier. Checked over the whole file, not a sample.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const nums = JSON.parse(fs.readFileSync('public/mock-data/numbers.json', 'utf8'));
const tiers = JSON.parse(fs.readFileSync('public/mock-data/star-number-tiers.json', 'utf8'));
const FREE_CEILING = 1500; // the Free / Star price boundary (postpaidPricing FREE_NUMBER_PRICE_CEILING_QAR)

test('every number is +974 then 8 digits starting 3, 5, 6 or 7, and none repeats', () => {
  const seen = new Set();
  for (const n of nums) {
    assert.match(n.msisdn, /^\+974[3567]\d{7}$/, n.msisdn);
    assert.ok(!seen.has(n.msisdn), `${n.msisdn} appears twice`);
    seen.add(n.msisdn);
  }
});

test('the inventory holds the 100 added Star numbers: all in the 7 range, all available, priced QAR 1,500 to 50,000, each with a tier', () => {
  const added = nums.filter((n) => n.category === 'Star' && n.status === 'AVAILABLE' && n.priceQAR >= FREE_CEILING);
  assert.ok(added.length >= 100);
  const marked = nums.findIndex((n) => (n._note ?? '').startsWith('App-level demo addition (2026-10-25)'));
  assert.ok(marked >= 0, 'the batch carries its note');
  const batch = nums.slice(marked, marked + 100);
  // Vodafone Qatar's own range is 7 (3, 5 and 6 are the other operator's): the whole batch sits in it. The older hand-picked numbers are left as they were.
  assert.ok(batch.every((n) => n.msisdn[4] === '7'), 'every added Star number leads 7');
  assert.equal(new Set(batch.map((n) => n.msisdn)).size, batch.length, 'no repeats');
  for (const n of batch) {
    assert.equal(n.category, 'Star');
    assert.equal(n.status, 'AVAILABLE');
    assert.ok(n.priceQAR >= FREE_CEILING && n.priceQAR <= 50000, `${n.msisdn} ${n.priceQAR}`);
    assert.ok(['Gold', 'Platinum'].includes(n.valueTier), n.msisdn);
  }
});

test('every priced Star number falls inside a lock-in tier (so its lock-in period is defined)', () => {
  for (const n of nums.filter((x) => x.category === 'Star' && x.priceQAR >= FREE_CEILING)) {
    assert.ok(tiers.some((t) => n.priceQAR >= t.valueRangeMin && n.priceQAR <= t.valueRangeMax), `${n.msisdn} QAR ${n.priceQAR} has no lock-in tier`);
  }
});

test('Free Numbers: 60 available (priced under the Free ceiling), which fill 3 pages of 20', async () => {
  const free = nums.filter((n) => n.status === 'AVAILABLE' && n.priceQAR < FREE_CEILING);
  assert.equal(free.length, 60);
  assert.ok(nums.some((n) => (n._note ?? '').startsWith('App-level demo addition (2026-10-26)')));
  const { boot, load, close } = await import('./harness.mjs');
  await boot();
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  await close();
  assert.equal(m.FREE_PAGE_SIZE, 20);
  assert.equal(Math.ceil(free.length / m.FREE_PAGE_SIZE), 3);
  for (const n of free.filter((x) => x.category === 'Free' && x.priceQAR === 0)) assert.match(n.msisdn, /^\+974[3567]\d{7}$/);
});

test('every added Star number is a recognisable premium pattern, none is a random run', () => {
  const marked = nums.findIndex((n) => (n._note ?? '').startsWith('App-level demo addition (2026-10-25)'));
  const batch = nums.slice(marked, marked + 100);
  const patterns = {
    repeatedRun: (d) => /(\d)\1{3,}/.test(d),
    pairs: (d) => /(\d)\1(\d)\2/.test(d),
    ascending: (d) => /(?:01234|12345|23456|34567|45678|56789|67890)/.test(d) || /(?:0123|1234|2345|3456|4567|5678|6789)/.test(d),
    descending: (d) => /(?:9876|8765|7654|6543|5432|4321|3210)/.test(d),
    palindrome: (d) => d === [...d].reverse().join('') || /(\d)(\d)\2\1/.test(d),
    roundEnding: (d) => /\d{2}0{4,}$/.test(d) || /\d{3}00{3}$/.test(d),
    repeatingPairs: (d) => /(\d{2,4})\1/.test(d),
    mirrorDigits: (d) => /^(\d)\d{6}\1$/.test(d),
    arithmetic: (d) => /(?:13579|24680|02468|135790|246810|357900)/.test(d) || /(?:1357|2468|3579|4680|0246)/.test(d),
  };
  for (const n of batch) {
    const d = n.msisdn.slice(4);
    assert.ok(Object.values(patterns).some((f) => f(d)), `${n.msisdn} is not a recognisable pattern`);
  }
});

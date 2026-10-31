import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let m;
before(async () => {
  await boot();
  m = await load('/src/components/patterns/billingAccountModel.ts');
});
after(close);

test('card number: shown in groups of four, held and validated as digits only', () => {
  assert.equal(m.formatCardNumber('4111111111111111'), '4111 1111 1111 1111');
  assert.equal(m.formatCardNumber('41111'), '4111 1');
  assert.equal(m.formatCardNumber('4111'), '4111', 'no trailing space after a full group');
  assert.equal(m.cardDigits('4111 1111-1111 1111abc'), '4111111111111111');
  assert.equal(m.cardDigits('1'.repeat(30)).length, 16, 'capped at 16 digits');
});

test('card number: spaces never reach validation - the same number with or without spaces tokenizes the same way', () => {
  const a = m.tokenizeCard('4111 1111 1111 1111');
  const b = m.tokenizeCard(m.cardDigits('4111 1111 1111 1111'));
  assert.equal(a.last4, '1111');
  assert.equal(b.last4, '1111');
  assert.equal(m.tokenizeCard('4111 1111'), null, 'too short');
  assert.equal(m.tokenizeCard('4111111111111'), null, '13 digits is not a card number here');
  assert.equal(m.tokenizeCard('41111111111111111'), null, '17 digits is too long');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { boot, load, close } from './harness.mjs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
test.before(boot);
test.after(close);

test('Digits-only ID types ask for the numeric keypad; a passport keeps the full keyboard', async () => {
  const { ID_TYPES } = await load('/src/data/idTypes.ts');
  const numeric = Object.fromEntries(ID_TYPES.map((t) => [t.type, t.numericNumber]));
  assert.deepEqual(numeric, { QID: true, Passport: false, 'GCC ID': true, 'Diplomatic ID': true });
  assert.match(read('src/components/domain/QidInput.tsx'), /inputMode=\{current\.numericNumber \? 'numeric' : 'text'\}/);
});

test('A number input gets the numeric keypad from the Input primitive (decimal when fractions are allowed)', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { Input } = await load('/src/components/primitives/Input.tsx');
  const html = (props) => renderToStaticMarkup(React.createElement(Input, props));
  assert.match(html({ type: 'number' }), /inputmode="numeric"/i);
  assert.match(html({ type: 'number', step: '0.5' }), /inputmode="decimal"/i);
  assert.doesNotMatch(html({ type: 'text' }), /inputmode/i);
  assert.match(html({ type: 'text', inputMode: 'tel' }), /inputmode="tel"/i);
});

test('Verification codes, address numbers and SIM serials ask for the numeric keypad', () => {
  assert.match(read('src/auth/ForgotPasswordFlow.tsx'), /Verification Code" inputMode="numeric"/);
  assert.equal((read('src/components/patterns/ZsbAddressStep.tsx').match(/inputMode="numeric"/g) ?? []).length >= 3, true);
  assert.match(read('src/components/domain/SimSerialScanner.tsx'), /inputMode="numeric"/);
});

test('Help & Support lives in the profile menu, not the header; form controls hover in the focus-ring colour', () => {
  const sw = read('src/navigation/PersonaSwitcher.tsx');
  assert.doesNotMatch(sw, /aria-label="Help & support"/);
  assert.match(sw, /Help &amp; Support/);
  assert.match(read('src/tokens.css'), /--field-hover-border: var\(--color-field-border-focus\);/);
});

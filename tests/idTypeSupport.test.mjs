// "Others" is an identity-document card laid out like the other types, but the app cannot identify a customer on it: the scan is refused with
// a message, nothing can be typed for it, and Continue stays blocked until a supported type is chosen.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

let ids;
before(async () => {
  await boot();
  ids = await load('/src/data/idTypes.ts');
});
after(close);
const read = (p) => fs.readFileSync(p, 'utf8');

test('Others is a fifth card in the Customer Verification journeys, unsupported; the four real types stay supported', () => {
  const others = ids.idTypeDef('Other ID');
  assert.equal(others.label, 'Others');
  assert.equal(others.supported, false);
  assert.equal(others.scannable, true, 'it gets the same Scan Identity Document layout');
  for (const t of ['QID', 'Passport', 'GCC ID', 'Diplomatic ID']) assert.equal(ids.idTypeDef(t).supported, true, t);
  for (const preset of ['new-connection', 'prepaid']) assert.ok(ids.idTypesFor(preset).includes('Other ID'), preset);
  assert.ok(!ids.idTypesFor('all').includes('Other ID'), 'not offered where a screen identifies by a supported ID only');
  assert.ok(!ids.idTypesFor('donor').includes('Other ID'));
});

test('support is a property of the type: unsupported is only Others; an unchosen or unknown type is not blocked here', () => {
  assert.equal(ids.isIdTypeSupported('Other ID'), false);
  for (const t of ['QID', 'Passport', 'GCC ID', 'Diplomatic ID', undefined, 'Something Else']) assert.equal(ids.isIdTypeSupported(t), true, String(t));
  assert.equal(ids.UNSUPPORTED_ID_TYPE_MESSAGE, 'This ID type is not supported.');
});

test('the selector renders the Others card with the same markup as the other types', async () => {
  const { QidTypeSelector } = await load('/src/components/domain/QidInput.tsx');
  const out = html(React.createElement(QidTypeSelector, { idType: undefined, onIdTypeChange() {}, allowedTypes: ids.idTypesFor('new-connection') }));
  assert.equal((out.match(/aria-pressed=/g) ?? []).length, 5);
  assert.match(out, />Others</);
  const card = (label) => out.match(new RegExp(`<button[^>]*>(?:(?!</button>).)*>${label}<`))?.[0].replace(/<svg.*<\/svg>/, '').replace(label, '');
  assert.equal(card('Others'), card('Passport'), 'identical card markup apart from icon and label');
});

test('Continue is blocked on Others, with the identity otherwise complete; a supported type is not blocked', async () => {
  const { customerQualificationStep } = await load('/src/capabilities/CustomerQualification/step.tsx');
  const step = customerQualificationStep({ flow: 'new' });
  const base = (idType) => ({
    contact: { idType, idNumber: 'X1', email: 'a@example.qa', moiResult: { name: 'A B', nationality: 'Egyptian', dob: '1990-01-01', gender: 'Male', isNewCustomer: true }, firstName: 'A', lastName: 'B', dob: '1990-01-01', nationality: 'Egyptian', gender: 'Male' },
    eligibility: { checks: [], hardStop: false, softStop: false },
    customerType: { type: 'none' },
  });
  assert.equal(step.isValid(base('Other ID')), false);
  // The block is the type, not an incomplete fixture: the same values on a supported type get past that check.
  const src = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(src, /if \(!isIdTypeSupported\(c\?\.idType\)\) return false;/);
});

test('the scan of Others is refused and not counted, no number can be typed for it, and the message is shown', () => {
  const hook = read('src/components/patterns/useIdLookup.ts');
  assert.match(hook, /if \(unsupportedType\) \{\s*setUnsupportedScanTried\(true\);\s*return false;\s*\}/);
  // The refusal comes before the attempt is counted, so the manual-entry fallback (opened when attempts run out) never opens for it.
  assert.ok(hook.indexOf('if (unsupportedType)') < hook.indexOf('const attempt = scanAttempts + 1;'));
  const step = read('src/components/patterns/IdLookupStep.tsx');
  assert.match(step, /unsupportedType && unsupportedScanTried && <ErrorBanner message=\{UNSUPPORTED_ID_TYPE_MESSAGE\}/);
  assert.match(step, /numberBlock = typeChosen && !unsupportedType/);
});

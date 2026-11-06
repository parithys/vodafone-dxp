import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

after(close);
const h = React.createElement;
const read = (f) => fs.readFileSync(f, 'utf8');

test('OptionToggle: a radio group, one option checked and in the Tab order, the chosen one filled', async () => {
  const { OptionToggle } = await load('/src/components/primitives/OptionToggle.tsx');
  const out = html(h(OptionToggle, { label: 'Billing frequency', items: [{ key: 'm', label: 'Monthly · QAR 20' }, { key: 'w', label: 'Weekly · QAR 5' }, { key: 'o', label: 'One-Time · QAR 8' }], active: 'w', onChange() {} }));
  assert.match(out, /role="radiogroup" aria-label="Billing frequency"/);
  assert.equal((out.match(/role="radio"/g) ?? []).length, 3);
  assert.equal((out.match(/aria-checked="true"/g) ?? []).length, 1);
  assert.equal((out.match(/tabindex="0"/g) ?? []).length, 1);
  assert.match(out, /aria-checked="true"[^>]*class="toggle-option toggle-option-active"/);
  assert.doesNotMatch(out, /role="tab"/, 'a toggle is not tabs');
});

test('the Key Information statements are the first lines of Key Terms & Conditions, not a section of their own', async () => {
  const { FullTerms } = await load('/src/components/patterns/CafTerms.tsx');
  const sections = [{ sectionId: 'S1', title: 'Billing', body: 'Billed monthly.' }];
  const out = html(h(FullTerms, { enabled: true, sections, keyInformation: ['No plan lock-in period applies to prepaid packs.'] }, h('span', null, 'form')));
  assert.match(out, /Key Terms &amp; Conditions/);
  assert.ok(out.indexOf('No plan lock-in period') > out.indexOf('Key Terms &amp; Conditions'), 'inside the terms panel');
  assert.ok(out.indexOf('No plan lock-in period') < out.indexOf('Billing'), 'ahead of the sections');
  assert.doesNotMatch(out, /Key Information/, 'no heading of its own');
  const caf = read('src/capabilities/CafSignature/CafSignature.tsx');
  assert.match(caf, /mergeIntoTerms/);
});

test('SIM Selection (New Prepaid): Paired / Unpaired inside the SIM container, the SIM charge outside it, no SIM Details section, no Mobile Number card for a chosen number', () => {
  const panels = read('src/capabilities/SimType/PrepaidSimPanels.tsx');
  assert.doesNotMatch(panels, /SIM Details|SIM details/);
  assert.match(panels, /export function PrepaidSimCharge/);
  assert.match(panels, /allocatedHere/, 'the number card is only for a number allocated on this page');
  const step = read('src/capabilities/SimType/step.tsx');
  assert.match(step, /extraRows=\{opts\.prepaidActivation \? \[\['Paired \/ Unpaired'/);
  assert.match(step, /<PrepaidSimCharge/);
  // One container: a Pre-Paired SIM's scanner shows no read-back of its own.
  assert.match(read('src/components/domain/SimTypeStep.tsx'), /hideDetails/);
  assert.match(read('src/components/domain/SimSerialScanner.tsx'), /!hideDetails && !suppressValidation/);
});

test('the prepaid cart lists the number, the SIM and the add-ons as separate items with room between them', () => {
  const cart = read('src/components/patterns/PrepaidCartStep.tsx');
  assert.match(cart, /className="cluster caption-secondary mt-1 gap-x-6"/);
  assert.doesNotMatch(cart, /\{line\.msisdn\} ·/);
});

test('iPAY Activation is a toggle placed before the iPAY Terms & Conditions, which show only while it is Yes', async () => {
  const { FullTerms } = await load('/src/components/patterns/CafTerms.tsx');
  const sections = [{ sectionId: 'P', title: 'Prepaid Terms & Conditions', body: 'Prepaid terms.' }];
  const ipaySections = [{ sectionId: 'I', title: 'iPAY Terms & Conditions', body: 'iPAY terms.' }];
  const render = (value) => html(h(FullTerms, { enabled: true, sections, ipay: { value, onChange() {}, sections: ipaySections } }, h('span', null, 'form')));
  const on = render(true);
  assert.match(on, /role="radiogroup" aria-label="iPAY Activation"/);
  assert.doesNotMatch(on, /role="tab"/, 'a toggle, not tabs');
  assert.ok(on.indexOf('Prepaid Terms') < on.indexOf('iPAY Activation') && on.indexOf('iPAY Activation') < on.indexOf('iPAY Terms'), 'terms, then the toggle, then the iPAY terms');
  const off = render(false);
  assert.match(off, /iPAY Activation/);
  assert.doesNotMatch(off, /iPAY Terms &amp; Conditions/, 'hidden while iPAY is not enabled');
  assert.match(html(h(FullTerms, { enabled: true, signed: true, sections, ipay: { value: true, onChange() {}, sections: ipaySections } }, h('span', null, 'form'))), /iPAY Activation<\/span><span class="text-fg font-medium">Yes/);
});

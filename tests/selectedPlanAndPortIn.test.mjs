// The selected plan/pack figure is on the selected-card highlight; the Port-in Number is the standard Qatar mobile field.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

test('the chosen plan or pack figure uses the shared selected highlight, not a white card', async () => {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const React = (await import('react')).default;
  const { SelectedPlanFigure, CARD_SELECTED } = await load('/src/components/primitives/offerCardParts.tsx');
  const html = renderToStaticMarkup(React.createElement(SelectedPlanFigure, { label: 'Monthly plan' }, 'QAR 145'));
  assert.ok(html.includes(CARD_SELECTED.split(' ')[0]) && html.includes('Monthly plan'));
  // The Add-ons page no longer repeats the selected plan (name, tag, price, benefits); the pack step still shows its figure.
  assert.doesNotMatch(fs.readFileSync('src/components/patterns/PostpaidPlanAddonsStep.tsx', 'utf8'), /SelectedPlanFigure|Selected Plan</);
  for (const f of ['src/components/patterns/PrepaidPlanStep.tsx']) {
    const src = fs.readFileSync(f, 'utf8');
    assert.match(src, /<SelectedPlanFigure label=/, f);
    assert.doesNotMatch(src, /card px-4 py-2\.5 text-right/, `${f}: no hand-made white figure card`);
  }
});

test('Port-in Number is the standard phone field pinned to Qatar, and its stored value is a valid port-in number', async () => {
  const src = fs.readFileSync('src/components/patterns/DonorDetailsStep.tsx', 'utf8');
  assert.match(src, /<PhoneNumberInput\s+label="Port-In Number"[\s\S]*?fixedIso="QA"[\s\S]*?maxNationalDigits=\{8\}/);
  const { portInNumberError, normalizePortInNumber } = await load('/src/data/portInRules.ts');
  assert.equal(portInNumberError('+97466000666'), undefined);
  assert.equal(normalizePortInNumber('+97466000666'), '97466000666');
  assert.ok(portInNumberError('+97411000666'));
});

test.after(close);

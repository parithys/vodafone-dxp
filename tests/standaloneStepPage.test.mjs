import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

after(close);
const h = React.createElement;
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

// The Number Management Portal is held to the postpaid New Connection journey's chrome: same title band, step card, header action and
// fixed action bar - built from the shared parts, not restyled on the page.

test('StandaloneStepPage: the title band, step card, heading and fixed Continue bar are the guided journey\'s own', async () => {
  const { StandaloneStepPage } = await load('/src/components/patterns/wizard/StandaloneStepPage.tsx');
  const { RefreshNumbersButton } = await load('/src/capabilities/NumberSelection/step.tsx');
  const out = html(
    h(
      StandaloneStepPage,
      {
        title: 'Number Management Portal',
        description: 'Search and reserve numbers.',
        titleActions: { onAbandon() {} },
        step: { key: 'number', label: 'Number Selection', headerAction: () => h(RefreshNumbersButton, { onClick() {} }), render: () => null },
        onNext() {},
        canProceed: false,
      },
      h('p', null, 'content')
    )
  );
  assert.match(out, /px-4 sm:px-8 pt-6 sm:pt-8 pb-6 bg-\[var\(--title-band-bg\)\]/, 'the wizard title band');
  assert.match(out, /<h1[^>]*>Number Management Portal<\/h1>/);
  assert.match(out, /Search and reserve numbers\./);
  assert.match(out, /Abandon Order/);
  assert.doesNotMatch(out, /Save as Draft/, 'a portal has no draft');
  assert.match(out, /m-8 card p-6/, 'the step card, 32px from the page edges');
  assert.match(out, /<h2[^>]*>Number Selection<\/h2>/);
  assert.match(out, /Refresh/);
  assert.match(out, /fixed inset-x-0 bottom-0 [^"]*border-t border-border-soft bg-bg shadow-raised/, 'the full-width fixed action bar');
  const primary = out.match(/<button[^>]*>Continue/)?.[0] ?? '';
  assert.match(primary, /disabled=""/, 'Continue is off until a number is chosen');
  assert.doesNotMatch(out, /Save &amp; Finish/, 'the first of several pages reads Continue');
});

test('StandaloneStepPage: without onNext there is no action bar and no room reserved for one', async () => {
  const { StandaloneStepPage } = await load('/src/components/patterns/wizard/StandaloneStepPage.tsx');
  const out = html(h(StandaloneStepPage, { title: 'T', step: { key: 'k', label: 'Done', render: () => null } }, h('p', null, 'x')));
  assert.doesNotMatch(out, /fixed inset-x-0/);
  assert.doesNotMatch(out, /pb-24/);
});

test('Number Management Portal and Reserve Number lay out with the shared wizard parts, not their own', () => {
  const portal = read('src/modules/sim-number-management/screens/NumberManagementPortal.tsx');
  assert.match(portal, /StandaloneStepPage/);
  assert.match(portal, /WizardTitleBand/);
  assert.doesNotMatch(portal, /PageHeader/, 'the band is the wizard title band');
  assert.doesNotMatch(portal, /\bfixed\b[^"']*bottom-/, 'no floating action card: the action bar is the wizard footer');
  assert.doesNotMatch(portal, /shadow-\[var\(--shadow-dash-card\)\]/);
  assert.doesNotMatch(portal, /className="p-8/, 'no page padding of its own: the wizard\'s card already sits 32px in');
  const wizard = read('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx');
  assert.match(wizard, /WizardStepPanel/, 'guided journeys lay out with the same panel');
});

test('MsisdnPicker: one toolbar layout (search and sort on one row) wherever it is used', () => {
  assert.doesNotMatch(read('src/components/domain/MsisdnPicker.tsx'), /inlineToolbar/);
  assert.doesNotMatch(read('src/capabilities/NumberSelection/NumberSelection.tsx'), /inlineToolbar/);
});

test('PrepaidPlanCard: the card itself selects like a postpaid plan card - no Select button, Popular is a flag only', () => {
  const card = read('src/components/patterns/PrepaidPlanCard.tsx');
  assert.doesNotMatch(card, /Select pack/);
  assert.doesNotMatch(card, /<Button/);
  assert.doesNotMatch(card, /CARD_HIGHLIGHT/, 'Popular does not tint the card');
  assert.match(card, /selected \? CARD_SELECTED : CARD_IDLE/);
  assert.match(read('src/components/patterns/PrepaidPlanStep.tsx'), /Popular pack is listed first/);
});

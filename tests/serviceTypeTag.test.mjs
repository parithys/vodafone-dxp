// Service-type tags: one mapping, the Recommended Offers colours, used by every surface.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { load, close } from './harness.mjs';

// The colours the Recommended Offers page used before the mapping moved (the SSOT), written out independently of the code.
const tint = (n) => `bg-[var(--tint-${n}-bg)] text-[var(--tint-${n}-fg)]`;
const SSOT = {
  'new-postpaid': ['New Postpaid', 'blue'],
  'new-prepaid': ['New Prepaid', 'green'],
  'mnp-postpaid': ['MNP Postpaid', 'teal'],
  'mnp-prepaid': ['MNP Prepaid', 'amber'],
  'new-fixed-line': ['New Fixed Line', 'pink'],
  'new-fwa': ['New FWA', 'indigo'],
  'pre-to-post': ['Prepaid to Postpaid', 'green'],
  'post-to-post': ['Postpaid to Postpaid Upgrade', 'indigo'],
};

test('every offer tag keeps its Recommended Offers colour and wording', async () => {
  const { SERVICE_TYPE_TAGS } = await load('/src/lib/serviceTypeTag.ts');
  const { SERVICE_JOURNEYS } = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  for (const [key, [label, colour]] of Object.entries(SSOT)) {
    assert.equal(SERVICE_TYPE_TAGS[key].colour, tint(colour), key);
    assert.equal(SERVICE_TYPE_TAGS[key].label, label, key);
    assert.equal(SERVICE_JOURNEYS.find((j) => j.key === key).label, label, `${key}: journey title and tag wording agree`);
  }
});

test('a line type is the colour of the journey that sells it', async () => {
  const { SERVICE_TYPE_TAGS: T } = await load('/src/lib/serviceTypeTag.ts');
  assert.equal(T.postpaid.colour, T['new-postpaid'].colour);
  assert.equal(T.prepaid.colour, T['new-prepaid'].colour);
  assert.equal(T['fixed-line'].colour, T['new-fixed-line'].colour);
  const { connectionTag } = await load('/src/lib/connectionType.ts');
  assert.deepEqual(['Postpaid', 'Prepaid', 'Fixed Line'].map((c) => connectionTag(c).serviceTag), ['postpaid', 'prepaid', 'fixed-line']);
});

test('no surface defines service-tag colours or a hand-made Postpaid/Prepaid pill of its own', () => {
  const grep = (cmd) => execSync(`${cmd} || true`).toString().trim();
  assert.equal(grep('grep -rn JOURNEY_PILL src'), '');
  assert.equal(grep("grep -rnE \"<Badge[^>]*>[^<]*'(Postpaid|Prepaid)'\" src"), '');
  assert.equal(grep("grep -rlE 'tint-(blue|green|teal|amber|pink|indigo)-bg' src/capabilities/CrossSellOffers src/components/patterns/LineSelectionStep.tsx src/components/primitives/ConnectionTypeTag.tsx src/lib/connectionType.ts"), '');
  assert.match(fs.readFileSync('src/components/patterns/LineSelectionStep.tsx', 'utf8'), /<ServiceTypeTag type=\{line\.lineType\} \/>/);
});

test.after(close);

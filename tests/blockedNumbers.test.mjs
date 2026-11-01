import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

after(close);
const nums = JSON.parse(fs.readFileSync('public/mock-data/numbers.json', 'utf8'));
const blocked = nums.filter((n) => n.status === 'BLOCKED');

const RETAIL = 'Retail Sales';

test('Blocked Numbers: a blocked number is found only by its complete 8 digits', async () => {
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  const vip = '55551234';
  assert.ok(blocked.some((n) => n.msisdn === `+974${vip}`), 'the demo VIP number is blocked in the inventory');
  assert.equal(m.findBlockedNumber(nums, vip, RETAIL)?.msisdn, `+974${vip}`);
  // Spaces, dashes and the country code are the same number.
  for (const form of ['5555 1234', '5555-1234', '+97455551234', '974 5555 1234']) assert.equal(m.findBlockedNumber(nums, form, RETAIL)?.msisdn, `+974${vip}`, form);
  // Every partial of it finds nothing - the blocked inventory cannot be browsed by prefix.
  for (let len = 0; len < 8; len++) assert.equal(m.findBlockedNumber(nums, vip.slice(0, len), RETAIL), undefined, `"${vip.slice(0, len)}"`);
  assert.equal(m.findBlockedNumber(nums, '555512345', RETAIL), undefined, 'longer than a number');
  assert.equal(m.findBlockedNumber(nums, '5555123a', RETAIL), undefined, 'letters');
});

test('Blocked Numbers: only the viewer\'s own group\'s blocked numbers are found - another group\'s look exactly like a number that is not blocked', async () => {
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  const local = (n) => m.toLocalMsisdn(n.msisdn);
  const groups = [...new Set(blocked.map((n) => n.blockedByTeam).filter(Boolean))];
  assert.ok(groups.length >= 2, 'the data has numbers blocked by different groups');
  // Over the whole population, for every group as the viewer: found exactly when that group blocked it - never by a group name hardcoded in the code.
  for (const viewer of [...groups, 'Some Other Group', undefined, '']) {
    for (const n of nums) {
      const found = m.findBlockedNumber(nums, local(n), viewer);
      const expected = n.status === 'BLOCKED' && Boolean(n.blockedByTeam) && n.blockedByTeam.toLowerCase() === String(viewer ?? '').trim().toLowerCase();
      assert.equal(Boolean(found), expected, `${local(n)} (${n.status}, blocked by ${n.blockedByTeam}) as ${viewer}`);
    }
  }
  // The examples: Retail Sales finds its own; the Premium-blocked number is not exposed to Retail Sales, and Premium finds it.
  const premium = blocked.find((n) => n.blockedByTeam === 'Premium');
  assert.equal(m.findBlockedNumber(nums, local(premium), 'Retail Sales'), undefined);
  assert.equal(m.findBlockedNumber(nums, local(premium), 'Premium')?.msisdn, premium.msisdn);
  assert.equal(m.findBlockedNumber(nums, '55551234', 'Premium'), undefined);
  assert.equal(m.findBlockedNumber(nums, '55551234', ' retail sales ')?.msisdn, '+97455551234', 'case and spacing do not matter');
  // A blocked record that names no group belongs to nobody the lookup can verify, so it is not shown to anyone.
  const unowned = blocked.filter((n) => !n.blockedByTeam);
  assert.ok(unowned.length > 0);
  for (const n of unowned) for (const viewer of groups) assert.equal(m.findBlockedNumber(nums, local(n), viewer), undefined);
});

test('Blocked Numbers: no number that is not blocked is ever found', async () => {
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  for (const n of nums.filter((x) => x.status !== 'BLOCKED')) for (const viewer of ['Retail Sales', 'Premium']) assert.equal(m.findBlockedNumber(nums, m.toLocalMsisdn(n.msisdn), viewer), undefined, `${n.msisdn} (${n.status}) is not blocked`);
});

test('Blocked Numbers: the tab is the fourth, in the journeys\' order and the portal\'s', async () => {
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  assert.equal(m.TAB_LABELS.Blocked, 'Blocked Numbers');
  assert.equal(m.TAB_ORDER.at(-1), 'Blocked');
  assert.equal(m.PORTAL_TAB_ORDER.at(-1), 'Blocked');
  assert.equal(m.PORTAL_TAB_ORDER.length, 4);
});

test('Blocked Numbers: the tab lists nothing until a complete number is typed; a number\'s group, reason and details show only for the viewer\'s own group; the no-match answer is one message', async () => {
  const { BlockedNumberLookup } = await load('/src/components/domain/BlockedNumberLookup.tsx');
  const tiers = [{ valueRangeMin: 1000, valueRangeMax: 19999, lockInDurationMonths: 12 }];
  const empty = html(React.createElement(BlockedNumberLookup, { numbers: nums, loaded: true, starTiers: tiers, viewerGroup: 'Retail Sales' }));
  assert.doesNotMatch(empty, /Retail Sales|Premium|Reserved for Villaggio Mall Branch|Blocked Reason/, 'no blocked number is listed by default');
  assert.doesNotMatch(empty, /role="button"/);
  const src = fs.readFileSync('src/components/domain/BlockedNumberLookup.tsx', 'utf8');
  assert.match(src, /No blocked number matches found\./);
  assert.doesNotMatch(src, /Retail Sales|Premium/, 'the group comes from the signed-in persona, not from the code');
  assert.match(fs.readFileSync('src/components/domain/MsisdnPicker.tsx', 'utf8'), /viewerGroup = getPersona\(activePersonaId\)\?\.name/);
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  const vip = m.findBlockedNumber(nums, '55551234', 'Retail Sales');
  assert.equal(vip.blockedByTeam, 'Retail Sales');
  assert.equal(vip.blockedReason, 'Reserved for Villaggio Mall Branch');
  assert.equal(vip.category, 'Star');
});

test('Blocked Numbers: the field keeps digits only, at most 8, and a pasted number with its country code is reduced to the 8 local digits', async () => {
  const m = await load('/src/components/domain/msisdnPickerModel.ts');
  assert.equal(m.blockedNumberInput('5555abcd1234'), '55551234');
  assert.equal(m.blockedNumberInput('555512349999'), '55551234', 'never more than 8');
  assert.equal(m.blockedNumberInput('5555'), '5555');
  assert.equal(m.blockedNumberInput(''), '');
  assert.equal(m.blockedNumberInput('+974 5555 1234'), '55551234');
  assert.equal(m.blockedNumberInput('97455551'), '97455551', 'eight digits typed are kept as typed');
  for (const raw of ['5555abcd1234', '+974 5555 1234', '55551234999']) assert.ok(m.blockedNumberInput(raw).length <= 8);
});

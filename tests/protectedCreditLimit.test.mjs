// A Safwa, Safwa+ or Royal customer's credit limit cannot be changed at Billing Profile: the card is locked and a chosen limit is ignored when the account is
// created. Checked for every segment value in the data, in both directions.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let cl;
before(async () => { await boot(); cl = await load('/src/engines/creditLimit.ts'); });
after(close);

const customers = JSON.parse(fs.readFileSync('public/mock-data/customers.json', 'utf8'));
const PROTECTED = new Set(['Safwa', 'Safwa+', 'Royal']);

test('every customer segment in the data: protected ones are locked, no other segment is locked by segment alone', () => {
  const segments = [...new Set(customers.map((c) => c.segment))];
  assert.ok([...PROTECTED].every((s) => segments.includes(s)), 'the data holds all three protected segments');
  for (const seg of segments) {
    const policy = cl.creditLimitPolicy({ segment: seg, nationality: 'Qatari' });
    assert.equal(policy.lock === 'protected-segment', PROTECTED.has(seg), seg);
    if (PROTECTED.has(seg)) assert.equal(policy.editable, false, seg);
  }
});

test('the card disables the limit for a protected segment; account creation ignores a chosen limit for one and records the restriction', () => {
  const card = fs.readFileSync('src/components/patterns/CreditLimitCard.tsx', 'utf8');
  assert.match(card, /creditLimitPolicy\(\{ segment: customerSegment, nationality \}\)/);
  assert.match(card, /policy\.editable \?/);
  assert.match(fs.readFileSync('src/capabilities/BillingAccount/step.tsx', 'utf8'), /customerSegment=\{eligibility\?\.segment\}/);
  const persist = fs.readFileSync('src/capabilities/BillingAccount/persistBillingAccount.ts', 'utf8');
  assert.match(persist, /const chosen = policy\.editable && /);
  assert.match(persist, /restrictionApplied: Boolean\(policy\.lock\)/);
  for (const f of ['src/modules/new-connection/submitNewConnectionOrder.ts', 'src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts', 'src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts', 'src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts']) {
    assert.match(fs.readFileSync(f, 'utf8'), /segment: eligibility\?\.segment/, f);
  }
});

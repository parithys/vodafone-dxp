// Select Offer goes where the offer goes: an offer for a journey the wizard runs continues in the wizard; an offer for another journey (the upgrades)
// opens that journey straight away, for the customer already identified.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let sj, products;
before(async () => {
  await boot();
  sj = await load('/src/capabilities/CrossSellOffers/serviceJourneys.ts');
  products = await load('/src/modules/new-connection/products.ts');
});
after(close);
const read = (p) => fs.readFileSync(p, 'utf8');
const offers = JSON.parse(read('public/mock-data/cross-sales-offers.json'));

test('every offer journey in the data has a destination: continues in New Connection, or has a route of its own - and only an offer naming no journey has none', () => {
  const here = products.IN_JOURNEY_OFFERS;
  const kinds = new Set(offers.map((o) => o.serviceJourney));
  for (const j of kinds) {
    if (!j) continue;
    assert.equal(sj.hasDestination(j, here), true, `${j} leads somewhere`);
  }
  assert.equal(sj.hasDestination(undefined, here), false, 'an offer that names no journey has nowhere to go');
});

test('the destination follows the offer: in-wizard journeys continue here, the upgrades hand off to their own route', () => {
  const here = products.IN_JOURNEY_OFFERS;
  for (const j of ['new-postpaid', 'new-prepaid', 'new-fixed-line', 'new-fwa', 'mnp-postpaid', 'mnp-prepaid']) assert.equal(sj.continuesHere(j, here), true, j);
  for (const j of ['pre-to-post', 'post-to-post']) {
    assert.equal(sj.continuesHere(j, here), false, j);
    const route = sj.SERVICE_JOURNEYS.find((x) => x.key === j)?.route;
    assert.match(route, /^\//, `${j} has a route`);
  }
  // Each in-wizard journey names the product it continues as (the wizard then goes straight on).
  for (const j of ['new-postpaid', 'new-prepaid', 'new-fixed-line', 'new-fwa', 'mnp-postpaid', 'mnp-prepaid']) assert.ok(products.PRODUCT_OF_OFFER_JOURNEY[j], `${j} maps to a product`);
});

test('Select Offer on an upgrade opens its journey at once for the identified customer, and the hand-off releases the draft', () => {
  const card = read('src/capabilities/CrossSellOffers/CrossSalesStep.tsx');
  assert.match(card, /if \(route\) onHandOff\(route, customerId \? \{ customerId \} : undefined\)/);
  assert.match(card, /continuesHere\(o\.serviceJourney, journey\)\) \{\s*if \(!selected\) toggle\(\);\s*setAdvanceFor\(o\.offerId\);\s*return;/);
  assert.match(card, /This offer does not name a journey to continue in/);
  const choice = read('src/modules/new-connection/steps/productChoice.ts');
  assert.match(choice, /export function handOverToJourney[\s\S]*endJourney\(ctx\.wizardId\)[\s\S]*clearDraft\(ctx\.wizardId\)[\s\S]*state: \{ launch: customer \}/);
  assert.match(read('src/modules/new-connection/steps/ProductSelection.tsx'), /onHandOff=\{\(route, customer\) => handOverToJourney\(ctx, route, customer\)\}/);
  assert.match(read('src/capabilities/CrossSellOffers/step.tsx'), /state: \{ launch: customer \}/);
});

test('Select Offer on the New Connection offers page moves the wizard on - also when the order will be routed for approval, since that page has no Continue', () => {
  const ps = read('src/modules/new-connection/steps/ProductSelection.tsx');
  assert.match(ps, /onContinue=\{\(\) => \{\s*setValue\('advanceOnApproval', true\);\s*setValue\('productPreselected', true\);\s*\}\}/);
  assert.match(ps, /values\.advanceOnApproval === true \? productEligibilityClear\(values/);
  assert.match(ps, /setValue\('advanceOnApproval', false\);\s*goNext\(\);/, 'the flag is cleared as it fires, so Back never skips the page again');
});

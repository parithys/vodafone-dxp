// Safwa, Safwa+ and Royal customers: shown only to a role holding THAT segment's grant, decided before anything about the customer is kept or drawn,
// and refused with a message that carries no customer information. Expectations come from the role table (personas.json) and the segment list, not
// from the code under test.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { boot, load, close } from './harness.mjs';

const h = React.createElement;
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const personas = json('public/config/personas.json');
const customers = json('public/mock-data/customers.json');
const CAP = { Safwa: 'view-safwa-customers', 'Safwa+': 'view-safwa-plus-customers', Royal: 'view-royal-customers' };

let seg, priv, cfg, notice, results, personaStore;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  seg = await load('/src/data/customerSegments.ts');
  priv = await load('/src/engines/agentPrivilegeEngine.ts');
  cfg = await load('/src/engines/configEngine.ts');
  notice = await load('/src/components/patterns/RestrictedCustomerNotice.tsx');
  results = await load('/src/workspace/customer-search/CustomerSearchResults.tsx');
  personaStore = await load('/src/stores/personaStore.ts');
});
after(close);

test('only Safwa, Safwa+ and Royal are protected; matching ignores case and spaces; Safwa and Safwa+ are different segments', () => {
  assert.equal(seg.restrictedSegmentOf('Safwa'), 'Safwa');
  assert.equal(seg.restrictedSegmentOf('Safwa+'), 'Safwa+');
  assert.equal(seg.restrictedSegmentOf(' royal '), 'Royal');
  assert.equal(seg.restrictedSegmentOf('SAFWA+'), 'Safwa+');
  for (const not of ['Consumer', 'Consumer (HRN)', 'Enterprise (EBU)', 'Small Business', 'Safwa Plus', 'Premium', '', undefined]) assert.equal(seg.restrictedSegmentOf(not), undefined, String(not));
  assert.deepEqual({ ...seg.RESTRICTED_SEGMENT_CAPABILITY }, CAP);
  assert.equal(new Set(Object.values(seg.RESTRICTED_SEGMENT_CAPABILITY)).size, 3, 'one grant per segment');
});

test('Safwa, Safwa+ and Royal are validated independently: a role holding one is refused the other two', () => {
  const premium = cfg.getPersona('ROLE-12');
  const original = [...premium.capabilities];
  try {
    for (const [granted, cap] of Object.entries(CAP)) {
      premium.capabilities = [...original.filter((c) => !Object.values(CAP).includes(c)), cap];
      for (const segment of Object.keys(CAP)) assert.equal(priv.canViewCustomerSegment('ROLE-12', segment), segment === granted, `holding ${granted} only, asking for ${segment}`);
      assert.equal(priv.canViewCustomerSegment('ROLE-12', 'Consumer'), true, 'an ordinary customer is never affected');
    }
    premium.capabilities = original.filter((c) => !Object.values(CAP).includes(c));
    for (const segment of Object.keys(CAP)) assert.equal(priv.canViewCustomerSegment('ROLE-12', segment), false, `no grant, ${segment}`);
  } finally {
    premium.capabilities = original;
  }
});

test('every role against every segment follows its declared grants; no role, or an unknown one, sees none; ordinary segments are open to all', () => {
  let checked = 0;
  for (const p of personas) {
    for (const [segment, cap] of Object.entries(CAP)) {
      assert.equal(priv.canViewCustomerSegment(p.id, segment), p.capabilities.includes(cap), `${p.name} / ${segment}`);
      checked++;
    }
    assert.equal(priv.canViewCustomerSegment(p.id, 'Consumer'), true);
  }
  assert.equal(checked, personas.length * 3);
  for (const segment of Object.keys(CAP)) {
    assert.equal(priv.canViewCustomerSegment(undefined, segment), false);
    assert.equal(priv.canViewCustomerSegment('NOT-A-ROLE', segment), false);
  }
  // The role table: Premium holds all three, every other role none.
  const holders = personas.filter((p) => Object.values(CAP).some((c) => p.capabilities.includes(c)));
  assert.deepEqual(holders.map((p) => p.name), ['Premium']);
  assert.deepEqual(Object.values(CAP).filter((c) => !holders[0].capabilities.includes(c)), []);
});

test('mock data: each protected segment has a customer, and over the whole population visibility is exactly "not protected, or granted"', () => {
  for (const segment of Object.keys(CAP)) assert.ok(customers.some((c) => c.segment === segment), `a ${segment} customer is seeded`);
  for (const p of personas) {
    const visible = customers.filter((c) => priv.canViewCustomerSegment(p.id, c.segment));
    const hidden = customers.filter((c) => !priv.canViewCustomerSegment(p.id, c.segment));
    assert.equal(visible.length + hidden.length, customers.length, 'conservation');
    const expectedHidden = customers.filter((c) => CAP[c.segment] && !p.capabilities.includes(CAP[c.segment]));
    assert.deepEqual(hidden.map((c) => c.customerId), expectedHidden.map((c) => c.customerId), p.name);
  }
});

test('the refusal carries no customer information, not even the segment', () => {
  for (const word of ['Safwa', 'Royal', 'VIP']) assert.ok(!new RegExp(word, 'i').test(seg.RESTRICTED_CUSTOMER_MESSAGE + seg.RESTRICTED_CUSTOMER_TITLE), word);
  const html = renderToStaticMarkup(h(MemoryRouter, null, h(notice.RestrictedCustomerNotice, { backTo: '/customer-search' })));
  assert.match(html, /Access restricted/);
  assert.match(html, /not authorised/);
  for (const c of customers.filter((x) => CAP[x.segment])) for (const v of [c.name, c.customerId, c.qid, c.phone]) assert.ok(!html.includes(v), v);
});

// Server rendering reads the store's INITIAL persona, so the signed-in role under test is that one: its grants are set on the loaded role.
const searchHtml = () => {
  const rows = customers
    .filter((c) => ['CUST-1001', 'CUST-3101', 'CUST-3102', 'CUST-3103'].includes(c.customerId))
    .map((customer) => ({ customer, matchedOn: ['name'] }));
  return renderToStaticMarkup(h(MemoryRouter, null, h(results.CustomerSearchResults, { submitted: 'zzz', results: rows, businesses: [], searching: false })));
};
const withGrants = (grants, fn) => {
  const role = cfg.getPersona(personaStore.usePersonaStore.getInitialState().activePersonaId);
  const original = [...role.capabilities];
  try {
    role.capabilities = [...original.filter((c) => !Object.values(CAP).includes(c)), ...grants];
    return fn();
  } finally {
    role.capabilities = original;
  }
};

test('Customer Search: an unauthorised role gets a restriction in place of each protected customer, with no name, ID, number or segment; an ordinary customer is unaffected', () => {
  const html = withGrants([], searchHtml);
  assert.equal((html.match(/Access restricted/g) ?? []).length, 3, 'one restriction per protected customer');
  for (const c of customers.filter((x) => CAP[x.segment])) for (const v of [c.name, c.customerId, c.qid, c.phone, c.segment]) assert.ok(!html.includes(v), `${v} leaked`);
  const ahmed = customers.find((c) => c.customerId === 'CUST-1001');
  assert.ok(html.includes(ahmed.name), 'an ordinary customer is still listed');
});

test('Customer Search: each protected customer is shown only to the role granted THAT segment', () => {
  const protectedOnes = customers.filter((x) => CAP[x.segment]);
  assert.equal(withGrants(Object.values(CAP), searchHtml).includes('Access restricted'), false, 'granted all three: all shown');
  for (const c of protectedOnes) assert.ok(withGrants(Object.values(CAP), searchHtml).includes(c.name), c.name);
  for (const [granted, cap] of Object.entries(CAP)) {
    const html = withGrants([cap], searchHtml);
    for (const c of protectedOnes) assert.equal(html.includes(c.name), c.segment === granted, `${granted} only: ${c.segment}`);
    assert.equal((html.match(/Access restricted/g) ?? []).length, 2, `${granted} only: the other two are restricted`);
  }
});

test('the check runs before the customer is kept or drawn: in Customer 360, in the ID lookup, in global search', () => {
  const c360 = fs.readFileSync('src/workspace/customer360/Customer360Layout.tsx', 'utf8');
  const gate = c360.indexOf('canViewCustomerSegment(activePersonaId, result.customer.segment)');
  assert.ok(gate > 0);
  assert.ok(gate < c360.indexOf('setData(result ?? undefined)'), 'authorised before the data is put in state');
  assert.ok(gate < c360.indexOf('setActiveCustomer(toActiveCustomerSummary(result.customer))'), 'and before the active-customer context is set');
  assert.match(c360, /clearActiveCustomer\(\);/);
  assert.match(c360, /if \(blocked\) \{[\s\S]*RestrictedCustomerNotice/);
  const lookup = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  const lg = lookup.indexOf('!canViewCustomerSegment(usePersonaStore.getState().activePersonaId, customer.segment)');
  assert.ok(lg > 0 && lg < lookup.indexOf('settle({', lg), 'authorised before the MOI result is built');
  assert.ok(lookup.indexOf('setAccessRestricted(true)') > 0);
  assert.match(fs.readFileSync('src/components/patterns/IdLookupStep.tsx', 'utf8'), /accessRestricted && <RestrictedCustomerNotice/);
  const global = fs.readFileSync('src/navigation/GlobalSearch.tsx', 'utf8');
  assert.match(global, /canViewCustomerSegment\(usePersonaStore\.getState\(\)\.activePersonaId, c\.segment\)/);
  assert.match(global, /label: 'Restricted Customer'/);
});

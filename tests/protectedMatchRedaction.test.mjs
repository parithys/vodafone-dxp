// A protected-segment customer (Safwa, Safwa+, Royal) is never named to a role without the grant by the link / duplicate messages of Customer Verification.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let link;
before(async () => { await boot(); link = await load('/src/components/patterns/idLinkModel.ts'); });
after(close);

const customers = JSON.parse(fs.readFileSync('public/mock-data/customers.json', 'utf8'));
const docs = JSON.parse(fs.readFileSync('public/mock-data/identity-documents.json', 'utf8'));
const PROTECTED = new Set(['Safwa', 'Safwa+', 'Royal']);
const canSee = (c) => !PROTECTED.has(c.segment);
const personOf = (c) => ({ name: c.name, dob: c.dob, nationality: c.nationality });

test('a QID conflict with a protected customer names no one to a role that may not see them, and still names ordinary customers', () => {
  const prot = customers.filter((c) => PROTECTED.has(c.segment));
  assert.ok(prot.length >= 3);
  for (const c of prot) {
    const held = docs.find((d) => d.customerId === c.customerId && d.documentType === 'QID');
    if (!held) continue;
    const different = '29999999999';
    const hidden = link.resolveExistingCustomer(personOf(c), docs, customers, different, canSee);
    assert.equal(hidden.kind, 'conflict', c.customerId);
    assert.equal(hidden.message, link.RESTRICTED_MATCH_MESSAGE);
    assert.ok(!hidden.message.includes(c.customerId) && !hidden.message.includes(held.documentNumber));
    // With access it is the specific message (the agent may know who they are).
    const shown = link.resolveExistingCustomer(personOf(c), docs, customers, different, () => true);
    assert.match(shown.message, new RegExp(c.customerId));
  }
  const ordinary = customers.find((c) => !PROTECTED.has(c.segment) && docs.some((d) => d.customerId === c.customerId && d.documentType === 'QID'));
  const r = link.resolveExistingCustomer(personOf(ordinary), docs, customers, '29999999999', canSee);
  assert.match(r.message, new RegExp(ordinary.customerId), 'an ordinary customer is still named');
});

test('an ambiguity that includes a protected customer lists nobody; the duplicate message for a protected match is generic', () => {
  const prot = customers.find((c) => PROTECTED.has(c.segment));
  const twin = { ...customers.find((c) => !PROTECTED.has(c.segment)), name: prot.name, dob: prot.dob, nationality: prot.nationality, customerId: 'CUST-TWIN' };
  const r = link.resolveExistingCustomer(personOf(prot), docs, [...customers, twin], undefined, canSee);
  assert.equal(r.kind, 'conflict');
  assert.ok(!r.message.includes(prot.customerId) && !r.message.includes('CUST-TWIN'));
  const linked = { kind: 'linked', customerId: prot.customerId, via: 'identity' };
  assert.equal(link.duplicateCustomerMessage(linked, false), link.RESTRICTED_MATCH_MESSAGE);
  assert.match(link.duplicateCustomerMessage(linked, true), new RegExp(prot.customerId));
});

test('the lookup passes the role\'s visibility into the resolver at both call sites', () => {
  const hook = fs.readFileSync('src/components/patterns/useIdLookup.ts', 'utf8');
  assert.equal((hook.match(/canViewCustomerSegment\(usePersonaStore\.getState\(\)\.activePersonaId, c\.segment\)/g) ?? []).length >= 1, true);
  assert.match(hook, /\(c\) => canViewCustomerSegment\(personaId, c\.segment\)/);
  assert.match(hook, /duplicateCustomerMessage\(found, !matched \|\| canViewCustomerSegment\(personaId, matched\.segment\)\)/);
});

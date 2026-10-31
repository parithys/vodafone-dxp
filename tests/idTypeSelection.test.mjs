// The ID type the agent selects stays the type through the scan: the reader's result never replaces it with a QID.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { boot, load, close } from './harness.mjs';

let pick;
before(async () => {
  await boot();
  ({ selectScanCandidates: pick } = await load('/src/components/patterns/idLookupModel.ts'));
});
after(close);

const qid = { documentType: 'QID', documentNumber: '28203063400002' };
const passport = { documentType: 'Passport', documentNumber: 'P0998812' };
const gcc = { documentType: 'GCC ID', documentNumber: '784202312345678' };
const all = ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'];

test('id type selection: a customer holding a QID and a Passport scans the Passport when Passport was selected', () => {
  for (const [type, doc] of [['Passport', passport], ['GCC ID', gcc], ['QID', qid]]) {
    assert.deepEqual(pick({ docs: [], ownDocs: [qid, passport, gcc], chosenType: type, detectable: [type] }), [doc]);
  }
});

test('id type selection: a customer with no document of the selected type is never given another type', () => {
  assert.deepEqual(pick({ docs: [], ownDocs: [qid], chosenType: 'Passport', detectable: ['Passport'] }), []);
});

test('id type selection: scan-first flow (no selection) still prefers the customer\'s QID', () => {
  assert.equal(pick({ docs: [], ownDocs: [passport, qid], chosenType: undefined, detectable: all })[0], qid);
});

test('id type selection: without a customer, only documents of the selected type are candidates', () => {
  assert.deepEqual(pick({ docs: [qid, passport, gcc], ownDocs: undefined, chosenType: 'GCC ID', detectable: ['GCC ID'] }), [gcc]);
});

import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// A config file that fails to load is a different state from a category the file has no entry for. Run in its own process (node --test starts one per file)
// with the approval matrix and the Customer 360 field registry unavailable, then assert nothing is silently opened up.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { boot, load, close } = await import('./harness.mjs'); // installs the harness's fetch, which reads public/
const realFetch = globalThis.fetch;
const BROKEN = ['approval-matrix.json', 'customer360-fields.json'];
globalThis.fetch = async (url) => (BROKEN.some((f) => String(url).includes(f)) ? { ok: false, status: 500, json: async () => ({}) } : realFetch(url));

let auth, cfg;
const personas = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/config/personas.json'), 'utf8'));
const approver = personas.find((p) => p.features.some((f) => f.key === 'orders.approval-detail' && ['Approve', 'Full'].includes(f.level)))
  ?? personas.find((p) => p.features.some((f) => ['Approve', 'Full'].includes(f.level)));
before(async () => {
  await boot();
  auth = await load('/src/engines/approvalAuthority.ts');
  cfg = await load('/src/engines/configEngine.ts');
});
after(close);

test('the app still boots with the optional files missing, and records which ones', () => {
  assert.equal(cfg.isApprovalMatrixAvailable(), false);
});

test('with no approval matrix, an order with no role of its own cannot be decided by anyone, and the reason is stated', () => {
  const a = auth.orderApprovalAuthority({ personaId: approver.id, jobTitle: 'Anything', status: 'Submitted for Approval', orderType: 'New Postpaid Activation' });
  assert.equal(a.mayDecide, false);
  assert.equal(a.blockedBy, 'matrix-unavailable');
  assert.match(auth.approvalBlockMessage('order', a), /could not be loaded/);
});

test('an order that carries its own approver role is still decided by that role, matrix or not', () => {
  const ok = auth.orderApprovalAuthority({ personaId: approver.id, jobTitle: 'Credit Control', status: 'Submitted for Approval', orderType: 'New Postpaid Activation', approverRole: 'Credit Control' });
  assert.equal(ok.blockedBy === 'matrix-unavailable', false);
  const wrong = auth.orderApprovalAuthority({ personaId: approver.id, jobTitle: 'Sales Manager', status: 'Submitted for Approval', orderType: 'New Postpaid Activation', approverRole: 'Credit Control' });
  assert.equal(wrong.mayDecide, false);
});

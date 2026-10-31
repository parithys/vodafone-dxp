import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load, close } from './harness.mjs';

after(close);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('screen display names: project phase, tool and vendor remarks are dropped; abbreviation expansions stay', async () => {
  const { screenDisplayName } = await load('/src/lib/screenName.ts');
  assert.equal(screenDisplayName('Bulk Adjustment Portal (DXP, Target State)'), 'Bulk Adjustment Portal');
  assert.equal(screenDisplayName('Siebel Excel Export (Uncontrolled)'), 'Excel Export');
  assert.equal(screenDisplayName('Statement of Account (SOA) View'), 'Statement of Account (SOA) View');
  assert.equal(screenDisplayName('Ticket detail screen (public notes / bell icon notifications)'), 'Ticket detail screen');
});

test('screen display names: no catalogue entry reads as a project phase or a vendor tool', async () => {
  const { screenDisplayName } = await load('/src/lib/screenName.ts');
  const routes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/config/routes.json'), 'utf8'));
  const bad = routes.map((r) => screenDisplayName(r.screenName)).filter((n) => /target state|current state|\(dxp|powerapps|grafana|\bmacro\b/i.test(n));
  assert.deepEqual(bad, []);
});

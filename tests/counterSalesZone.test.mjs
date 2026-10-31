// The Retail Sales dashboard's second zone: My Orders, Drafts, Leads and Queue - not catalogue KPIs the role cannot act on.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};
before(boot);
after(close);

const personas = JSON.parse(fs.readFileSync('public/config/personas.json', 'utf8'));
const list = Array.isArray(personas) ? personas : personas.personas;

test('a sales role that works the walk-in queue gets the counter-sales zone; no other role does', async () => {
  const { productZoneVariantFor, layoutFor } = await load('/src/modules/dashboard/dashboardLayout.ts');
  const retail = list.find((p) => p.name === 'Retail Sales');
  assert.equal(productZoneVariantFor(retail), 'counter-sales');
  // Among the roles that actually show a product zone (Hybrid and Product-First), only Retail Sales gets it.
  const showsProductZone = (p) => layoutFor(p.approach, 'x').zones.some((z) => z.id === 'product-work');
  for (const p of list.filter((p) => p.name !== 'Retail Sales' && showsProductZone(p))) assert.notEqual(productZoneVariantFor(p), 'counter-sales', p.name);
});

test('the zone shows exactly My Orders, Drafts, Leads and Queue, and none of the catalogue tiles', async () => {
  const { productWorkSpec } = await load('/src/modules/dashboard/zoneSpecs.ts');
  const m = { taskTiles: [{ key: 'draft-orders', label: 'Draft Orders', count: 2 }], myOrders: 28, myLeads: 1, totalLeads: 15, perf: undefined, loading: {}, errors: {}, recentCatalogItems: [] };
  const spec = productWorkSpec(m, { variant: 'counter-sales', compact: true, framing: 'one-of-two', regionLabel: '', regional: false, queueWaiting: 4 });
  assert.deepEqual(spec.tiles.map((t) => [t.label, t.count]), [['My Orders', 28], ['Drafts', 2], ['Leads', 1], ['Queue', 4]]);
  assert.equal(spec.cards.length, 0);
  const text = JSON.stringify(spec);
  for (const gone of ['Price exceptions', 'Campaigns live', 'Mobile Attach Rate', 'Channel Mix', 'Review Exceptions', 'Start a Campaign']) assert.ok(!text.toLowerCase().includes(gone.toLowerCase()), gone);
  // a role with no queue has no Queue tile
  const noQueue = productWorkSpec(m, { variant: 'counter-sales', compact: true, framing: 'one-of-two', regionLabel: '', regional: false, queueWaiting: null });
  assert.deepEqual(noQueue.tiles.map((t) => t.label), ['My Orders', 'Drafts', 'Leads']);
});

test('My Orders counts the agent\'s own submitted orders (drafts are Drafts), and Leads the agent\'s own leads', () => {
  const src = fs.readFileSync('src/modules/dashboard/useZoneMetrics.ts', 'utf8');
  assert.match(src, /o\.createdBy === currentAgentId && o\.status !== 'Draft'/);
  assert.match(src, /l\.ownerId === currentAgentId/);
});

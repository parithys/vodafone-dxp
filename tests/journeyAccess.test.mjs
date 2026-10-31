// New Connection access: the journey routes and the product buttons follow the role's grants (public/config/personas.json), for every role.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

const personas = JSON.parse(fs.readFileSync('public/config/personas.json', 'utf8'));
const roles = Array.isArray(personas) ? personas : personas.roles;
let access;
before(async () => { await boot(); access = await load('/src/modules/new-connection/productAccess.ts'); });
after(close);

test('every role may start a product exactly when its grants hold that product\'s feature (all 26 roles, all 4 products)', () => {
  assert.equal(roles.length, 26);
  for (const role of roles) {
    const held = new Set(role.features.map((f) => f.key));
    for (const [product, feature] of Object.entries(access.PRODUCT_FEATURE)) {
      assert.equal(access.canStartProduct(role.id, product), held.has(feature), `${role.id} ${product}`);
    }
  }
  // The documented cases: Premium holds only Postpaid; Direct Sales none of the four mobile products.
  const premium = roles.find((r) => r.id === 'ROLE-12'), direct = roles.find((r) => r.id === 'ROLE-03');
  assert.deepEqual(Object.keys(access.PRODUCT_FEATURE).filter((p) => access.canStartProduct(premium.id, p)), ['postpaid']);
  assert.equal(access.canStartProduct(direct.id, 'postpaid'), false);
});

test('the journey routes are guarded by their grants, so a typed URL is refused like the menu', () => {
  const router = fs.readFileSync('src/router.tsx', 'utf8');
  for (const path of ['/mobile/start-connection"', '/mobile/start-connection/existing/:customerId"']) {
    assert.match(router, new RegExp(`path="${path.replace(/[/:]/g, (c) => `\\${c}`)}[^>]*<RequireFeature featureKey="postpaid\\.new-postpaid-wizard">`));
  }
  assert.match(router, /path="\/fibre-home\/start-connection\/existing\/:customerId" element=\{<RequireFeature featureKey="fixedline\.new-fixed-line-wizard">/);
});

test('the product buttons, the product choice and the Customer 360 start buttons follow the grant', () => {
  const step = fs.readFileSync('src/modules/new-connection/steps/productStep.tsx', 'utf8');
  assert.match(step, /allowed=\{\(j\) =>/);
  assert.match(step, /canUseFeature\(personaId, HOME_CONNECTION_FEATURE\) &&/);
  assert.match(fs.readFileSync('src/capabilities/CrossSellOffers/JourneyActions.tsx', 'utf8'), /b\.journey === here \|\| !allowed \|\| allowed\(b\.journey\)/);
  assert.match(fs.readFileSync('src/modules/new-connection/steps/productChoice.ts', 'utf8'), /if \(!canStartProduct\(usePersonaStore\.getState\(\)\.activePersonaId, next\)\) return false;/);
  for (const f of ['src/workspace/customer360/sections/C360ProductsServices.tsx', 'src/workspace/customer360/sections/C360Orders.tsx']) {
    assert.match(fs.readFileSync(f, 'utf8'), /onClick=\{startNewConnection\} disabled=\{!canStartNewConnection\}/, f);
  }
});

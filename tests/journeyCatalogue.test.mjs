// The journey catalogue (what the Mobile and Fibre & Home pages offer) must only promise what the app can do.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const walk = (d, out = []) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
};
const src = walk(path.join(ROOT, 'src'));
// Screens registered by registerScreen('SCR-n', ...) or by a loop over a list of ids (the MNP wizard steps); comments don't count.
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
const built = new Set(
  src.flatMap((f) => {
    const t = stripComments(fs.readFileSync(f, 'utf8'));
    return t.includes('registerScreen(') ? [...t.matchAll(/['"](SCR-\d+)['"]/g)].map((m) => m[1]) : [];
  })
);
const routerPaths = [...fs.readFileSync(path.join(ROOT, 'src/router.tsx'), 'utf8').matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);
const toRegex = (p) => new RegExp('^' + p.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*') + '$');

let cfg;
let catalogue;
before(async () => {
  ({ cfg } = await boot());
  catalogue = await load('/src/navigation/journeyCatalogue.ts');
});
after(close);

const env = () => {
  const routes = cfg.getAllRoutes();
  const featureKeys = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'public/config/feature-catalogue.json'), 'utf8')).map((f) => f.key));
  return {
    featureKeys,
    screenPath: (id) => routes.find((r) => r.screenId === id)?.path,
    isScreenBuilt: (id) => built.has(id),
    isKnownPath: (p) => routerPaths.some((rp) => toRegex(rp).test(p)) || routes.some((r) => r.path === p),
  };
};

test('journey catalogue: every journey resolves (feature keys, screens, paths, available => works)', () => {
  assert.ok(env().featureKeys.size > 0, 'feature catalogue was not read');
  assert.deepEqual(catalogue.validateJourneyCatalogue(env()), []);
});

test('journey catalogue: the validator catches an available journey with no built screen', () => {
  const bad = [{ key: 'mobile', label: 'M', to: '/mobile', categories: [{ key: 'c', label: 'C', heading: 'C', description: '', icon: '', journeys: [{ id: 'x', title: 'X', description: '', status: 'available', screenId: 'SCR-999' }] }] }];
  const problems = catalogue.validateJourneyCatalogue(env(), bad);
  assert.ok(problems.some((p) => p.includes('SCR-999')), problems.join('\n'));
});

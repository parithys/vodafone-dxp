// One colour per connection type, everywhere it is shown.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let lib;
before(async () => {
  await boot();
  lib = await load('/src/lib/connectionType.ts');
});
after(close);

test('connection tags: Postpaid, Prepaid and Fixed Line use the shared service-type tags, Home Internet amber, the rest neutral', () => {
  assert.deepEqual(['Postpaid', 'Prepaid', 'Fixed Line'].map((c) => lib.connectionTag(c).serviceTag), ['postpaid', 'prepaid', 'fixed-line']);
  assert.equal(lib.connectionTag('GigaHome Fibre').variant, 'tag-amber');
  assert.equal(lib.connectionTag('GigaHome Fibre').label, 'Home Internet');
  assert.equal(lib.connectionTag('GigaHome 5G').variant, 'tag-amber');
  for (const c of ['TV / Entertainment', 'Smart Devices', 'Something New']) assert.equal(lib.connectionTag(c).variant, 'filled-neutral');
});

test('connection tags: an unknown category keeps its own name', () => {
  assert.equal(lib.connectionTag('Something New').label, 'Something New');
});

test('connection tags: no screen hand-colours a Postpaid / Prepaid / Home Internet pill', () => {
  const walk = (d, out = []) => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p, out);
      else if (/\.tsx$/.test(p)) out.push(p);
    }
    return out;
  };
  const bad = [];
  for (const f of walk(path.join(ROOT, 'src'))) {
    const t = fs.readFileSync(f, 'utf8');
    // a span styled as a pill whose only content is one of the type names
    if (/<span[^>]*radius-pill[^>]*>\s*(Postpaid|Prepaid|Home Internet)\s*<\/span>/.test(t)) bad.push(path.relative(ROOT, f));
  }
  assert.deepEqual(bad, [], `use <ConnectionTypeTag> in: ${bad.join(', ')}`);
});

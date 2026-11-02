// One source of truth per style: no two semantic classes in src/ui-components.css may carry the same (or almost the same) utility set, and
// none may be left defined but unused. Classes that share base properties are written as ONE grouped rule (`.a, .b { ... }`), a variant is
// a modifier on its base, not a copy of it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync('src/ui-components.css', 'utf8');

// Single-class @apply blocks: `.name { @apply a b c; }` (a class defined in several blocks has the union).
const sets = new Map();
for (const m of css.matchAll(/^ {2}\.([a-z][a-z0-9-]*) \{\n((?: {4}@apply [^;]*;\n)+) {2}\}/gm)) {
  const tokens = [...m[2].matchAll(/@apply ([^;]*);/g)].flatMap((x) => x[1].split(/\s+/)).filter(Boolean);
  sets.set(m[1], new Set([...(sets.get(m[1]) ?? []), ...tokens]));
}

const jaccard = (a, b) => [...a].filter((x) => b.has(x)).length / new Set([...a, ...b]).size;

test('no two semantic classes define the same utility set', () => {
  const names = [...sets.keys()];
  const dup = [];
  for (let i = 0; i < names.length; i++)
    for (let j = i + 1; j < names.length; j++) {
      const a = sets.get(names[i]);
      const b = sets.get(names[j]);
      if (a.size >= 2 && jaccard(a, b) >= 0.85) dup.push(`${names[i]} ~ ${names[j]} (${jaccard(a, b).toFixed(2)})`);
    }
  assert.deepEqual(dup, [], 'merge these into one class (or a base class plus a modifier)');
});

test('every semantic class is used somewhere', () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(tsx?|mjs)$/.test(e.name) ? [path.join(d, e.name)] : []));
  const source = [...walk('src'), ...walk('tests')].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const dynamic = new Set([...source.matchAll(/([a-z][a-z0-9-]*-)\$\{/g)].map((m) => m[1]));
  const defined = new Set([...css.matchAll(/^ {2}\.([a-z][a-z0-9-]*)\b/gm)].map((m) => m[1]));
  const unused = [...defined].filter((n) => !new RegExp(`(?<![\\w-])${n}(?![\\w-])`).test(source.replace(css, '')) && ![...dynamic].some((p) => n.startsWith(p)));
  assert.deepEqual(unused, [], 'delete these definitions');
});

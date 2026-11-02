// Styling budget: a className that spells out a run of utilities should be a semantic class (src/ui-components.css, src/index.css) instead.
// Classes defined in those two stylesheets are "semantic" and are free; every other class in a static className is a utility, and more than
// MAX_UTILITIES of them fails - except in the files in tests/classNameBudget.baseline.json, which hold the strings that predate the rule
// (context-specific layout and spacing). That list is a ratchet: it may only shrink - a file may not gain an over-budget className, and when
// one is fixed the baseline must be lowered (run `UPDATE_BASELINE=1 npm test` to rewrite it).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const MAX_UTILITIES = 3;
const BASELINE = 'tests/classNameBudget.baseline.json';
const CLASS_NAME = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;

const semantic = new Set(
  ['src/ui-components.css', 'src/index.css'].flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/^\s*\.([a-z][a-z0-9-]*)/gm)].map((m) => m[1])),
);
semantic.delete('flex');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

// Static text only: a `${...}` interpolation counts as nothing, so a conditional adds its own words only where they are written out.
function overBudget() {
  const found = {};
  for (const file of walk('src')) {
    const source = fs.readFileSync(file, 'utf8');
    for (const m of source.matchAll(CLASS_NAME)) {
      const words = (m[1] ?? m[2] ?? '').replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, ' ').split(/\s+/).filter(Boolean);
      if (words.filter((w) => !semantic.has(w)).length > MAX_UTILITIES) found[file] = (found[file] ?? 0) + 1;
    }
  }
  return found;
}

test(`no className carries more than ${MAX_UTILITIES} utility classes beyond the recorded baseline`, () => {
  const found = overBudget();
  if (process.env.UPDATE_BASELINE) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(Object.fromEntries(Object.entries(found).sort()), null, 2)}\n`);
    return;
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const worse = Object.entries(found).filter(([f, n]) => n > (baseline[f] ?? 0));
  assert.deepEqual(
    worse.map(([f, n]) => `${f}: ${n} over-budget classNames (allowed ${baseline[f] ?? 0}); move the repeated utilities into a semantic class in src/ui-components.css`),
    [],
  );
});

test('the baseline only lists files that still need it', () => {
  if (process.env.UPDATE_BASELINE) return;
  const found = overBudget();
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const stale = Object.entries(baseline).filter(([f, n]) => (found[f] ?? 0) < n);
  assert.deepEqual(
    stale.map(([f, n]) => `${f}: baseline says ${n}, now ${found[f] ?? 0}; lower it (UPDATE_BASELINE=1 npm test)`),
    [],
  );
});

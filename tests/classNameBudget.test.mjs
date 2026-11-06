// Styling budget: no class or className carries more than MAX_UTILITIES utility classes. Classes defined in src/ui-components.css or
// src/index.css are "semantic" and free; every other class word is a utility. Two things are measured:
//   1. a className attribute: its static classes plus, for each ${...} in it, the largest class string written inside that expression
//      (what the element can carry at one time); comments and dynamic pieces (`btn-${x}`) do not count;
//   2. any other string in src that is a list of classes (a constant such as `const CARD = '...'`, a branch `cond ? '...' : '...'`).
// tests/classNameBudget.baseline.json lists the exceptions (file -> count); it is a ratchet and may only shrink
// (`UPDATE_BASELINE=1 npm test` rewrites it).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const MAX_UTILITIES = 3;
const BASELINE = 'tests/classNameBudget.baseline.json';

const semantic = new Set(
  ['src/ui-components.css', 'src/index.css'].flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/^\s*\.([a-z][a-z0-9-]*)/gm)].map((m) => m[1])),
);
['card-inherit-fill', 'group', 'peer', 'no-print', 'agent-only', 'login-field'].forEach((n) => semantic.add(n));
semantic.delete('flex');

const WORD = /^[\w:[\]()\-./%!@#&>*,=+~'"$^|]+$/;
const STRING = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const stripComments = (x) => x.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
const withoutInterpolations = (x) => x.replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, ' ');
const utilities = (x) => withoutInterpolations(x).split(/\s+/).filter((w) => w && WORD.test(w) && !w.includes('${') && !w.endsWith('-') && !semantic.has(w));

function interpolations(body) {
  const out = [];
  for (let i = body.indexOf('${'); i >= 0; i = body.indexOf('${', i)) {
    let depth = 1;
    let k = i + 2;
    while (k < body.length && depth) {
      depth += body[k] === '{' ? 1 : body[k] === '}' ? -1 : 0;
      k++;
    }
    out.push(stripComments(body.slice(i + 2, k - 1)));
    i = k;
  }
  return out;
}

// End of a template literal starting after its opening backtick (skips nested `${ ... `...` ... }` pieces).
function templateEnd(source, from) {
  let depth = 0;
  for (let i = from; i < source.length; i++) {
    const c = source[i];
    if (c === '\\') i++;
    else if (depth === 0 && c === '`') return i;
    else if (c === '$' && source[i + 1] === '{') {
      depth++;
      i++;
    }
    else if (depth > 0 && c === '{') depth++;
    else if (depth > 0 && c === '}') depth--;
    else if (depth > 0 && c === '`') i = templateEnd(source, i + 1);
  }
  return source.length;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : [];
  });
}

function overBudget() {
  const found = {};
  const hit = (file) => (found[file] = (found[file] ?? 0) + 1);
  for (const file of walk('src')) {
    const source = fs.readFileSync(file, 'utf8');
    // 1. className attributes
    for (const m of source.matchAll(/className=(?:"([^"]*)"|\{`)/g)) {
      let effective;
      if (m[1] !== undefined) effective = utilities(m[1]).length;
      else {
        const body = stripComments(source.slice(m.index + m[0].length, templateEnd(source, m.index + m[0].length)));
        effective = utilities(body).length;
        for (const expr of interpolations(body)) {
          const literals = [...expr.replace(/(?:===|!==|==|!=)\s*(?:'[^']*'|"[^"]*")/g, ' ').matchAll(STRING)].map((s) => s[1] ?? s[2] ?? s[3] ?? '');
          effective += Math.max(0, ...literals.map((l) => utilities(l).length));
        }
      }
      if (effective > MAX_UTILITIES) hit(file);
    }
    // 2. any other class-list string (a constant or a branch)
    for (const m of source.matchAll(STRING)) {
      const text = m[1] ?? m[2] ?? m[3] ?? '';
      const words = withoutInterpolations(text).split(/\s+/).filter(Boolean);
      if (words.length < 4 || !words.every((w) => WORD.test(w) && !/^[A-Z]/.test(w) && !/[.,;]$/.test(w))) continue;
      if (words.filter((w) => /[-:[]/.test(w)).length < 2) continue;
      const used = utilities(text).length;
      const known = words.filter((w) => semantic.has(w)).length;
      if (used > MAX_UTILITIES && used + known >= 0.8 * words.length && /(?:^|\s)(?:flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|w-|h-|p[xytblr]?-|m[xytblr]?-|gap-|text-|font-|bg-|border|rounded|shadow|items-|justify-|overflow|min-|max-|size-|px-|py-)/.test(text)) hit(file);
    }
  }
  return found;
}

test(`no class or className carries more than ${MAX_UTILITIES} utility classes beyond the recorded baseline`, () => {
  const found = overBudget();
  if (process.env.UPDATE_BASELINE) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(Object.fromEntries(Object.entries(found).sort()), null, 2)}\n`);
    return;
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const worse = Object.entries(found).filter(([f, n]) => n > (baseline[f] ?? 0));
  assert.deepEqual(
    worse.map(([f, n]) => `${f}: ${n} over-budget class strings (allowed ${baseline[f] ?? 0}); move the repeated utilities into a semantic class in src/ui-components.css`),
    [],
  );
});

test('the baseline only lists files that still need it', () => {
  if (process.env.UPDATE_BASELINE) return;
  const found = overBudget();
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const stale = Object.entries(baseline).filter(([f, n]) => (found[f] ?? 0) < n);
  assert.deepEqual(stale.map(([f, n]) => `${f}: baseline says ${n}, now ${found[f] ?? 0}; lower it (UPDATE_BASELINE=1 npm test)`), []);
});

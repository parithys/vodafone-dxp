// Architecture guards, computed from the source's own import graph (value imports only - `import type` is erased).
//
// Layers (an arrow means "may import"): lib / data / types / stores / engines  <-  components/primitives  <-  components/domain
//   <-  components (patterns)  and capabilities  <-  modules / workspace / navigation / auth.
// What is enforced: no import cycles; components never import modules or workspace; capabilities never import modules or
// workspace; primitives and domain never import capabilities, patterns, modules or workspace.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
})(SRC);

const EXTS = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
function resolve(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(from), spec);
  for (const e of ['', ...EXTS]) {
    const p = base + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
const graph = new Map();
for (const f of files) {
  const text = strip(fs.readFileSync(f, 'utf8'));
  const deps = new Set();
  for (const m of text.matchAll(/(?:^|\n)\s*(import|export)\s+(type\s+)?([^'";]*?)\s*from\s*['"]([^'"]+)['"]/g)) {
    if (m[2]) continue; // import type / export type
    // `import { type A, type B }` with nothing else is also erased
    const clause = m[3];
    if (/^\{[^}]*\}$/.test(clause.trim())) {
      const names = clause.trim().slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
      if (names.length && names.every((n) => n.startsWith('type '))) continue;
    }
    const r = resolve(f, m[4]);
    if (r) deps.add(r);
  }
  for (const m of text.matchAll(/(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g)) {
    const r = resolve(f, m[1]);
    if (r) deps.add(r);
  }
  graph.set(f, deps);
}

const rel = (p) => path.relative(SRC, p);
const area = (p) => {
  const r = rel(p).split(path.sep);
  if (r[0] === 'components') return r[1] === 'primitives' ? 'primitives' : r[1] === 'domain' ? 'domain' : 'components';
  return r[0];
};

test('architecture: there are no import cycles', () => {
  // Tarjan's strongly connected components.
  let index = 0;
  const stack = [];
  const idx = new Map();
  const low = new Map();
  const on = new Set();
  const cycles = [];
  const visit = (v) => {
    idx.set(v, index);
    low.set(v, index);
    index++;
    stack.push(v);
    on.add(v);
    for (const w of graph.get(v) ?? []) {
      if (!graph.has(w)) continue;
      if (!idx.has(w)) {
        visit(w);
        low.set(v, Math.min(low.get(v), low.get(w)));
      } else if (on.has(w)) low.set(v, Math.min(low.get(v), idx.get(w)));
    }
    if (low.get(v) === idx.get(v)) {
      const comp = [];
      let w;
      do {
        w = stack.pop();
        on.delete(w);
        comp.push(w);
      } while (w !== v);
      if (comp.length > 1) cycles.push(comp.map(rel).sort());
    }
  };
  for (const v of graph.keys()) if (!idx.has(v)) visit(v);
  assert.deepEqual(cycles, []);
});

const FORBIDDEN = {
  primitives: ['domain', 'components', 'capabilities', 'modules', 'workspace', 'navigation', 'auth'],
  domain: ['components', 'capabilities', 'modules', 'workspace', 'navigation', 'auth'],
  components: ['modules', 'workspace', 'navigation', 'auth'],
  capabilities: ['modules', 'workspace', 'navigation', 'auth'],
  lib: ['components', 'capabilities', 'modules', 'workspace', 'navigation', 'auth', 'stores', 'engines'],
};

test('architecture: layers only import downward', () => {
  const bad = [];
  for (const [file, deps] of graph) {
    const from = area(file);
    const banned = FORBIDDEN[from];
    if (!banned) continue;
    for (const dep of deps) {
      const to = area(dep);
      if (to !== from && banned.includes(to)) bad.push(`${rel(file)} -> ${rel(dep)}`);
    }
  }
  assert.deepEqual(bad.sort(), []);
});

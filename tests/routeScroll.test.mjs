import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('the shell applies the one global route-scroll rule', () => {
  const app = read('src/App.tsx');
  assert.match(app, /useRouteScroll\(pathname, hash\)/);
  const hook = read('src/navigation/useRouteScroll.ts');
  // keyed on the pathname only: query / hash / in-page state changes keep the position
  assert.match(hook, /previous\.current === pathname\) return/);
  assert.match(hook, /getElementById\(MAIN_ID\)\?\.scrollTo\(\{ top: 0/);
});

test('no page scrolls to the top on its own route change (the shell owns that)', () => {
  const walk = (d) => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });
  const offenders = walk(new URL('../src', import.meta.url).pathname)
    .filter((p) => !p.endsWith('useRouteScroll.ts'))
    .filter((p) => /scrollTo\(\s*\{?\s*(0|top:\s*0)/.test(readFileSync(p, 'utf8')));
  assert.deepEqual(offenders, []);
});

// The Pagination capability: ONE definition of paging (page maths, summary, pager, hook), used by every paged list. The maths is checked against a
// table written by hand; the "single source of truth" claim is checked against the import graph and the source, not asserted.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

let P;
before(async () => { await boot(); P = await load('/src/components/primitives/Pagination.tsx'); });
after(close);

test('pageWindow: pages, first and last shown, clamping, empty and infinite page sizes', () => {
  const rows = [
    // total, size, page -> page, pages, from, to
    [60, 20, 1, 1, 3, 1, 20],
    [60, 20, 3, 3, 3, 41, 60],
    [61, 20, 4, 4, 4, 61, 61],
    [0, 20, 1, 1, 1, 0, 0],
    [5, 20, 1, 1, 1, 1, 5],
    [60, 20, 9, 3, 3, 41, 60],   // a page past the end is clamped to the last
    [60, 20, 0, 1, 3, 1, 20],    // below 1 is clamped to the first
    [47, 10, 5, 5, 5, 41, 47],
    [30, Infinity, 1, 1, 1, 1, 30],
  ];
  for (const [total, size, page, wantPage, wantPages, from, to] of rows) {
    const w = P.pageWindow(total, size, page);
    assert.deepEqual([w.page, w.pages, w.from, w.to], [wantPage, wantPages, from, to], `${total}/${size}@${page}`);
  }
});

test('pageWindow conserves every item: the pages cover 1..total exactly once, whatever the size', () => {
  for (const total of [0, 1, 19, 20, 21, 60, 61, 133]) {
    for (const size of [1, 7, 8, 10, 20]) {
      const covered = [];
      const { pages } = P.pageWindow(total, size, 1);
      for (let p = 1; p <= pages; p++) { const w = P.pageWindow(total, size, p); for (let i = w.from; i <= w.to && w.from > 0; i++) covered.push(i); }
      assert.deepEqual(covered, Array.from({ length: total }, (_, i) => i + 1), `${total}/${size}`);
    }
  }
});

test('the label reads "Page a of b"', () => {
  assert.equal(P.pageLabel(2, 10), 'Page 2 of 10');
  assert.equal(P.pageLabel(1, 1), 'Page 1 of 1');
});

test('which pages the pager lists: all up to 7; otherwise the first 3, the last 3 and the current page with its neighbours, with gaps', async () => {
  const { pageItems } = await load('/src/components/primitives/Pager.tsx');
  assert.deepEqual(pageItems(1, 3), [1, 2, 3]);
  assert.deepEqual(pageItems(4, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(pageItems(1, 10), [1, 2, 3, 'gap', 8, 9, 10]);   // the attached layout
  assert.deepEqual(pageItems(5, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'a gap that would hide one page shows that page');
  assert.deepEqual(pageItems(7, 12), [1, 2, 3, 'gap', 6, 7, 8, 9, 10, 11, 12]);
  assert.deepEqual(pageItems(10, 20), [1, 2, 3, 'gap', 9, 10, 11, 'gap', 18, 19, 20]);
  assert.deepEqual(pageItems(10, 10), [1, 2, 3, 'gap', 8, 9, 10]);
  assert.deepEqual(pageItems(5, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9], 'a gap that would hide one page shows that page');
  // Every list ends cover first and last page, the current page is always listed, and no page appears twice or out of order.
  for (const pages of [8, 10, 25, 100]) for (let page = 1; page <= pages; page++) {
    const items = pageItems(page, pages);
    const nums = items.filter((x) => x !== 'gap');
    assert.ok(nums.includes(page) && nums.includes(1) && nums.includes(pages), `${page}/${pages}`);
    assert.deepEqual(nums, [...new Set(nums)].sort((a, b) => a - b));
    assert.notEqual(items[0], 'gap'); assert.notEqual(items.at(-1), 'gap');
  }
});

test('the Pagination bar renders nothing on one page; on several it is "Page a of b" with Previous, numbered pages, "...", Next, the current one marked', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  assert.equal(renderToStaticMarkup(React.createElement(P.Pagination, { page: 1, total: 20, pageSize: 20, onPage() {} })), '');
  const html = renderToStaticMarkup(React.createElement(P.Pagination, { page: 1, total: 100, pageSize: 10, onPage() {} }));
  assert.match(html, /Page 1 of 10/);
  assert.match(html, /aria-label="Pagination"/);
  assert.match(html, /aria-current="page"[^>]*>1</);
  assert.match(html, /aria-label="Previous page"[^>]*disabled=""/);
  assert.match(html, />\s*Previous\s*</);
  assert.match(html, />\s*Next\s*</);
  assert.match(html, />\.\.\.</);
  // No container or background of its own: the wrapper carries no border, fill, radius or padding; only the pager group is bordered.
  const wrapper = html.slice(0, html.indexOf('<span'));
  assert.doesNotMatch(wrapper, /border|bg-|rounded|px-|py-/);
  assert.match(html.slice(html.indexOf('<nav')), /border border-\[var\(--field-card-border\)\]/, 'the pager group keeps its border');
});

// ---- single source of truth, read from the source ----
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
const files = walk('src');
const read = (f) => fs.readFileSync(f, 'utf8');

test('the capability is registered, exported from the barrel, previewable, and its implementation lives with the primitives', () => {
  const reg = JSON.parse(read('src/capabilities/registry.json'));
  const entry = reg.find((c) => c.id === 'pagination');
  assert.ok(entry, 'registry entry');
  assert.equal(entry.entry, 'Pagination');
  assert.match(read('src/capabilities/index.ts'), /export \* from '\.\/Pagination'/);
  assert.match(read('src/capabilities/previews.tsx'), /pagination: \(\) => <PaginationDemo \/>/);
  assert.match(read('src/capabilities/Pagination/index.ts'), /components\/primitives\/Pagination/);
});

test('the numbered Pager control is used by the Pagination bar only: no list builds its own pager', () => {
  const importers = files.filter((f) => /from '(\.\/|[./]+\/)*(components\/)?(primitives\/)?Pager'/.test(read(f)) && !f.endsWith('primitives/Pager.tsx'));
  assert.deepEqual(importers.map((f) => f.replace(/\\/g, '/')).sort(), ['src/capabilities/Pagination/index.ts', 'src/components/primitives/Pagination.tsx']);
});

test('no screen hand-rolls paging: no own Previous/Next buttons, no own "Showing a-b" or "Page a of b" text, no own page-number buttons, no own page maths', () => {
  const own = [];
  for (const f of files) {
    if (f.endsWith('primitives/Pagination.tsx') || f.endsWith('primitives/Pager.tsx')) continue;
    const s = read(f);
    if (/>\s*(Previous|Next)\s*<\/(Button|button)>/.test(s)) own.push(`${f}: own Previous/Next`);
    if (/Showing \{[^}]*\}\s*(-|–|&ndash;)/.test(s)) own.push(`${f}: own "Showing a-b" text`);
    if (/Page \{[^}]*\} of \{/.test(s)) own.push(`${f}: own "Page a of b" text`);
    if (/Array\.from\(\{ length: pages? \}/.test(s)) own.push(`${f}: own page-number buttons`);
    if (/Math\.ceil\([^)]*\/\s*(pageSize|PAGE|PAGE_SIZE|AUDIT_PAGE|FREE_PAGE_SIZE)\)/.test(s)) own.push(`${f}: own page-count maths`);
  }
  assert.deepEqual(own, []);
});

test('the paged lists use the capability: number picker, data tables, Customer 360 and Telesales', () => {
  const uses = {
    'src/components/domain/MsisdnPicker.tsx': /<Pagination page=\{safePage \+ 1\} total=\{filtered\.length\} pageSize=\{pageSize\}/,
    'src/components/primitives/DataTable.tsx': /<Pagination /,
    'src/workspace/customer360/sections/C360Activities.tsx': /<Pagination /,
    'src/workspace/customer360/sections/C360AlertsRisks.tsx': /<Pagination /,
    'src/workspace/customer360/sections/C360Orders.tsx': /<Pagination /,
    'src/workspace/customer360/telesales/TelesalesOrdersTicketsSection.tsx': /<Pagination /,
    'src/workspace/customer360/telesales/TelesalesAuditSection.tsx': /<Pagination /,
  };
  for (const [f, rx] of Object.entries(uses)) assert.match(read(f), rx, f);
  // Journeys and workspaces reach it through the barrel; the layers below (components) import the primitive directly.
  assert.match(read('src/workspace/customer360/sections/C360Kit.tsx'), /usePagination as usePaging, Pagination, Pager\b.*'\.\.\/\.\.\/\.\.\/capabilities'/);
});

test('the current page uses the Primary button style (accent gradient, on-accent text, bold); the others are plain', async () => {
  const { Pager } = await load('/src/components/primitives/Pager.tsx');
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(React.createElement(Pager, { page: 3, pages: 5, onPage() {} }));
  const buttons = html.match(/<button[^>]*>[^<]*(?:<svg.*?<\/svg>[^<]*)?<\/button>/g);
  const cur = html.match(/<button[^>]*aria-current="page"[^>]*>/)[0];
  assert.match(cur, /bg-\[image:var\(--accent-gradient\)\]/);
  assert.match(cur, /text-accent-on/);
  assert.match(cur, /font-bold/);
  assert.doesNotMatch(cur, /text-fg/);
  const other = html.match(/<button[^>]*aria-label="Page 2"[^>]*>/)[0];
  assert.doesNotMatch(other, /accent-gradient/);
  assert.ok(buttons.length >= 5);
});

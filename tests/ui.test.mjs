import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { load, close } from './harness.mjs';

after(close);
const h = React.createElement;

test('Button: variants render the design-system classes, sizes and disabled state', async () => {
  const { Button } = await load('/src/components/primitives/Button.tsx');
  const primary = html(h(Button, { variant: 'primary' }, 'Continue'));
  assert.match(primary, /accent-gradient/);
  assert.match(primary, /Continue/);
  assert.match(html(h(Button, { variant: 'secondary' }, 'Back')), /btn-secondary/);
  assert.match(html(h(Button, { variant: 'tertiary' }, 'View')), /text-link/);
  assert.match(html(h(Button, { variant: 'destructive' }, 'Drop')), /bg-danger/);
  assert.match(html(h(Button, { size: 'sm' }, 'x')), /fs-btn-compact/);
  assert.match(html(h(Button, { disabled: true }, 'x')), /disabled=""/);
  assert.doesNotMatch(primary, /shadow-\[/); // no glow on any button
});

test('ChoiceCards: one radiogroup of icon cards - the chosen one is checked, ticked and highlighted; no native radio inputs', async () => {
  const { ChoiceCards } = await load('/src/components/primitives/ChoiceCards.tsx');
  const out = html(h(ChoiceCards, { legend: 'Port the number onto', items: [{ key: 'postpaid', label: 'Postpaid Plan', icon: 'M0 0' }, { key: 'prepaid', label: 'Prepaid Plan', icon: 'M0 0' }], value: 'prepaid', onChange() {} }));
  assert.match(out, /role="radiogroup"/);
  assert.equal((out.match(/role="radio"/g) ?? []).length, 2);
  assert.equal((out.match(/aria-checked="true"/g) ?? []).length, 1);
  assert.match(out, /aria-checked="true"[^>]*>.*Prepaid Plan/);
  assert.ok(!/type="radio"/.test(out));
});

test('TabStrip: tablist semantics, one tab in the tab order, accent underline and count badge on the selected tab', async () => {
  const { TabStrip } = await load('/src/components/primitives/TabStrip.tsx');
  const out = html(h(TabStrip, { items: [{ key: 'a', label: 'Open Tasks', count: 4 }, { key: 'b', label: 'Drafts', count: 3 }], active: 'a', onChange() {} }));
  assert.match(out, /role="tablist"/);
  assert.equal((out.match(/role="tab"/g) ?? []).length, 2);
  assert.equal((out.match(/tabindex="0"/g) ?? []).length, 1);
  assert.match(out, /aria-selected="true"[^>]*class="[^"]*border-accent[^"]*text-\[var\(--accent-text\)\][^"]*font-bold/);
  assert.match(out, />4</);
});

test('SegmentedTabs: tablist semantics, one tab in the tab order, the Level 2 pill tab', async () => {
  const { SegmentedTabs } = await load('/src/components/primitives/SegmentedTabs.tsx');
  const out = html(h(SegmentedTabs, { items: [{ key: 'a', label: 'Offers' }, { key: 'b', label: 'Plans' }], active: 'a', onChange() {} }));
  assert.match(out, /role="tablist"/);
  assert.equal((out.match(/role="tab"/g) ?? []).length, 2);
  assert.equal((out.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.equal((out.match(/tabindex="0"/g) ?? []).length, 1);
  assert.equal((out.match(/tabindex="-1"/g) ?? []).length, 1);
  assert.match(out, /icon-tile-bg\)\] p-1/, 'the pill track');
  assert.doesNotMatch(out, /border-b-\[length:var\(--tab-active-w\)\]/, 'never an underline');
});

test('Pager: hidden for one page; marks the current page; previous/next disable at the ends', async () => {
  const { Pager } = await load('/src/components/primitives/Pager.tsx');
  assert.equal(html(h(Pager, { page: 1, pages: 1, onPage() {} })), '');
  const out = html(h(Pager, { page: 1, pages: 3, onPage() {} }));
  assert.match(out, /aria-current="page"/);
  assert.equal((out.match(/disabled=""/g) ?? []).length, 1); // only Previous, on page 1
  const last = html(h(Pager, { page: 3, pages: 3, onPage() {} }));
  assert.equal((last.match(/disabled=""/g) ?? []).length, 1); // only Next, on the last page
});

test('Badge, Input and Select render labelled, accessible markup', async () => {
  const { Badge } = await load('/src/components/primitives/Badge.tsx');
  assert.match(html(h(Badge, { variant: 'success' }, 'Active')), /Active/);
  const { Input } = await load('/src/components/primitives/Input.tsx');
  const input = html(h(Input, { label: 'Email', value: '', onChange() {} }));
  assert.match(input, /<label/);
  assert.match(input, /Email/);
  const { Select } = await load('/src/components/primitives/Select.tsx');
  assert.match(html(h(Select, { label: 'Role', value: '', onChange() {}, options: [{ value: 'a', label: 'A' }], placeholder: 'Pick' })), /role="combobox"/);
});

test('ErrorBanner is an alert; Spinner is a status with a name', async () => {
  const { ErrorBanner } = await load('/src/components/primitives/ErrorBanner.tsx');
  assert.match(html(h(ErrorBanner, { message: 'Failed to load' })), /role="alert"/);
  assert.equal(html(h(ErrorBanner, {})), '');
  const { Spinner } = await load('/src/components/primitives/Spinner.tsx');
  assert.match(html(h(Spinner, { label: 'Loading' })), /role="status"[^>]*aria-label="Loading"|aria-label="Loading"[^>]*role="status"/);
});

// ---- Source-level guards for the rules this app enforces (fast, no browser) -----------------------------------------
const SRC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx')) files.push(p);
  }
})(SRC);
const read = (p) => fs.readFileSync(p, 'utf8');

test('guard: every <img> has alt text', () => {
  // `[^>]` would stop at the `=>` of an inline handler, so match the whole element up to its closing `/>`.
  const bad = files.filter((f) => (read(f).match(/<img\b[\s\S]*?\/>/g) ?? []).some((el) => !/\balt=/.test(el)));
  assert.deepEqual(bad.map((f) => path.relative(SRC, f)), []);
});

// The opening tag of every <name ...> in a source string, found by walking braces and strings - a regex that stops at the
// first `>` would stop at the `=>` of an inline handler and miss the attributes after it.
function openingTags(source, name) {
  const tags = [];
  const re = new RegExp(`<${name}(?=[\\s>/])`, 'g');
  let m;
  while ((m = re.exec(source))) {
    let i = m.index + m[0].length, depth = 0, quote = null;
    for (; i < source.length; i++) {
      const c = source[i];
      if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; }
      else if (depth === 0 && (c === '"' || c === "'")) quote = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (depth > 0 && (c === '"' || c === "'" || c === '`')) quote = c;
      else if (depth === 0 && c === '>') break;
    }
    tags.push({ attrs: source.slice(m.index + m[0].length, i), line: source.slice(0, m.index).split('\n').length });
  }
  return tags;
}

test('guard: every hand-written <button> declares a type (so it never submits a form by accident)', () => {
  const bad = [];
  for (const f of files) {
    for (const t of openingTags(read(f), 'button')) {
      if (!/\btype=/.test(t.attrs) && !t.attrs.includes('{...')) bad.push(`${path.relative(SRC, f)}:${t.line}`);
    }
  }
  assert.deepEqual(bad, []);
});

// Data tables go through DataTable (sorting, paging, sticky header, keyboard rows, one look). These three are not data
// lists, so they stay hand-written semantic tables: a promo-policy legal table with row headers, the Checkout / CAF
// two-column key-value read-back, and the dark "Monthly summary" / "Pack summary" receipts.
const NON_DATA_TABLES = [
  'capabilities/CrossSellOffers/OfferDetailsDrawer.tsx',
  'components/patterns/CheckoutSummaryTables.tsx',
  'components/patterns/PrepaidPlanStep.tsx',
];
test('guard: data tables use DataTable - a raw <table> is only for the allow-listed key-value / legal tables', () => {
  const bad = files
    .map((f) => path.relative(SRC, f))
    .filter((r) => r !== 'components/primitives/DataTable.tsx' && !NON_DATA_TABLES.includes(r))
    .filter((r) => /<table[\s>]/.test(read(path.join(SRC, r))));
  assert.deepEqual(bad, []);
});

test('guard: no red text links - links use --link', () => {
  const bad = [];
  for (const f of files) {
    const s = read(f);
    if (/<(?:a|Link|NavLink)\b[^>]*className="[^"]*\btext-accent\b(?![^"]*\bbg-)/.test(s)) bad.push(path.relative(SRC, f));
  }
  assert.deepEqual(bad, []);
});

test('guard: components use radius tokens, not Tailwind rounded-lg/xl/2xl', () => {
  const bad = files.filter((f) => !f.includes('/primitives/') && /\brounded-(?:md|lg|xl|2xl|3xl)\b/.test(read(f)));
  assert.deepEqual(bad.map((f) => path.relative(SRC, f)), []);
});

test('guard: colours, stacking and motion come from tokens - no hex/rgba, white/70, color-mix(), z-N or duration-N in components', () => {
  // Scans .ts as well as .tsx (class strings live in both). Comment lines are ignored. Brand artwork that
  // paints with literal SVG colours is a separate, allow-listed case and is not matched here.
  const all = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(p)) all.push(p);
    }
  })(SRC);
  const rawWhiteBlack = /(?<![\w-])(?:text|bg|border|ring|divide|from|to|via|fill|stroke|outline)-(?:white|black)(?![\w-])/;
  const alphaOnToken = /(?<![\w-])(?:text|bg|border|ring|divide)-(?:accent|danger|success|warn|info|link|fg|muted|surface|bg|white|black)\/\d+/;
  const literalColour = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
  const literalRadius = /(?<![\w-])rounded-full(?![\w-])/;
  const literalScale = /(?<![\w-])-?z-(?:\d+|\[\d+\])(?![\w-])|(?<![\w-])duration-\d+(?![\w-])/;
  const bad = [];
  for (const f of all) {
    // Synthetic specimen artwork is demo data, not interface: its palette lives in src/data/synthetic.
    if (f.includes('/data/synthetic/')) continue;
    read(f).split('\n').forEach((line, i) => {
      if (/^\s*(?:\/\/|\*|\/\*|\{\/\*)/.test(line)) return;
      if (literalColour.test(line.replace(/\/\/.*$/, '')) || literalScale.test(line) || literalRadius.test(line)) bad.push(`${path.relative(SRC, f)}:${i + 1}`);
      if (rawWhiteBlack.test(line) || alphaOnToken.test(line) || /color-mix\(/.test(line)) bad.push(`${path.relative(SRC, f)}:${i + 1}`);
    });
  }
  assert.deepEqual(bad, []);
});

test('guard: no console.log or debugger left in the app', () => {
  const bad = files.filter((f) => /\bconsole\.log\(|\bdebugger\b/.test(read(f)));
  assert.deepEqual(bad.map((f) => path.relative(SRC, f)), []);
});

// Dates are dd/mm/yyyy everywhere: only lib/format.ts may format a date, so no screen can show another style.
test('no source formats dates outside lib/format.ts', async () => {
  const { readdirSync, readFileSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');
  const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const bad = walk('src')
    .filter((f) => /\.tsx?$/.test(f) && !f.endsWith('lib/format.ts') && !f.includes('data/synthetic'))
    .filter((f) => /toLocaleDateString\(|Intl\.DateTimeFormat|dateStyle:|month: '(short|long)'/.test(readFileSync(f, 'utf8').replace(/weekday: 'long'/g, '')))
    .filter((f) => !/Dashboard|TelesalesOrdersTicketsSection|appointmentModel/.test(f));
  assert.deepEqual(bad, []);
});

// ID capture by device: web uses the reader, tablet uploads; with no reader, upload stays on any device.
test('idCaptureOptions: reader on web, upload on tablet, upload when there is no reader', async () => {
  const { idCaptureOptions } = await load('/src/components/domain/idUploadModel.ts');
  assert.deepEqual(idCaptureOptions('web', true), { scan: true, upload: false });
  assert.deepEqual(idCaptureOptions('tablet', true), { scan: false, upload: true });
  assert.deepEqual(idCaptureOptions('web', false), { scan: false, upload: true });
  assert.deepEqual(idCaptureOptions('tablet', false), { scan: false, upload: true });
});

// Special Discounts Identification is an independent copy of the Mobile Postpaid Special Discounts section: it imports none of the shared
// identification / customer-type parts or the device rule, and always offers both capture actions.
test('Special Discounts Identification is decoupled from Customer Verification (it has its own capture rule, which reads the device since 2026-10-27)', async () => {
  const dir = 'src/capabilities/SpecialDiscountsIdentification';
  const shared = /from '(?:\.\.\/)+(?:components\/(?:patterns|domain)\/(?:IdFileUpload|PassportScanSections|QidImageUpload|QidInput|ScannedIdPreview|idUploadModel|qidImageUploadModel|GuidedContactStep|IdLookupStep|useIdLookup|CompanySearchInput)|capabilities\/(?:CustomerIdentification|CustomerType))'/;
  for (const f of fs.readdirSync(dir).filter((n) => /\.tsx?$/.test(n))) assert.ok(!shared.test(fs.readFileSync(path.join(dir, f), 'utf8')), `${f} reaches into a shared part`);
  const { idCaptureOptions } = await load('/src/capabilities/SpecialDiscountsIdentification/idUploadModel.ts');
  assert.deepEqual(idCaptureOptions(true, 'web'), { scan: true, upload: false });
  assert.deepEqual(idCaptureOptions(true, 'tablet'), { scan: true, upload: true });
  assert.deepEqual(idCaptureOptions(false, 'web'), { scan: false, upload: true }, 'no reader: upload stays on the web');
  assert.deepEqual(idCaptureOptions(false, 'tablet'), { scan: false, upload: true });
  const m = await load('/src/capabilities/SpecialDiscountsIdentification/specialDiscountsModel.ts');
  assert.deepEqual(m.TYPE_OPTIONS.map((o) => o.label), ['Standard Customer', 'Consumer B2B2C', 'Retiree', 'MADA']);
});

test('idCaptureOptions: a step that needs both offers both on any device', async () => {
  const { idCaptureOptions } = await load('/src/components/domain/idUploadModel.ts');
  for (const d of ['web', 'tablet']) assert.deepEqual(idCaptureOptions(d, true, true), { scan: true, upload: true });
});

test('Tab hierarchy: a page-level TabStrip is the underline; inside a tab panel it is the pill; Tabs nests its content', async () => {
  const { TabStrip } = await load('/src/components/primitives/TabStrip.tsx');
  const { NestedTabs } = await load('/src/components/primitives/TabLevel.tsx');
  const { Tabs } = await load('/src/components/primitives/Tabs.tsx');
  const strip = () => h(TabStrip, { items: [{ key: 'a', label: 'One' }, { key: 'b', label: 'Two' }], active: 'a', onChange() {} });
  const page = html(strip());
  assert.match(page, /border-b-\[length:var\(--tab-active-w\)\]/, 'level 1 is the underline');
  const nested = html(h(NestedTabs, null, strip()));
  assert.match(nested, /icon-tile-bg\)\] p-1/, 'level 2 is the pill');
  assert.doesNotMatch(nested, /border-b-\[length:var\(--tab-active-w\)\]/, 'never an underline when nested');
  const inTab = html(h(Tabs, { items: [{ key: 'x', label: 'X', content: strip() }] }));
  assert.equal((inTab.match(/role="tablist"/g) ?? []).length, 2);
  assert.equal((inTab.match(/border-b-\[length:var\(--tab-active-w\)\]/g) ?? []).length, 1, 'only the page-level strip is an underline');
});

test('no field shows placeholder / watermark text: the shared Input, Textarea, PhoneNumberInput and Select drop the prop', () => {
  for (const f of ['Input', 'Textarea']) assert.match(fs.readFileSync(`src/components/primitives/${f}.tsx`, 'utf8'), /placeholder: _noPlaceholder/, f);
  assert.doesNotMatch(fs.readFileSync('src/components/primitives/PhoneNumberInput.tsx', 'utf8'), /placeholder=\{/);
  assert.doesNotMatch(fs.readFileSync('src/components/primitives/Select.tsx', 'utf8'), /placeholder=\{/);
});

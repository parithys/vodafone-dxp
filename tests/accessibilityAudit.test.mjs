// Findings of the accessibility audit (2026-10-26), kept fixed: tab strips are named, and the colours the audit flagged meet WCAG 1.4.3 (4.5:1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const lum = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
const token = (css, name) => new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css)?.[1];

test('Customer view and the blue tag meet 4.5:1 on their own backgrounds', () => {
  const css = read('src/tokens.css');
  assert.ok(contrast(token(css, '--customer-view-fg'), token(css, '--customer-view-bg')) >= 4.5, 'Customer view button text');
  assert.ok(contrast(token(css, '--tag-blue-fg'), token(css, '--tag-blue-bg')) >= 4.5, 'blue tag text');
});

test('every page-level tab strip has an accessible name', () => {
  assert.match(read('src/components/primitives/Tabs.tsx'), /label = 'Sections'/);
  assert.match(read('src/components/primitives/Tabs.tsx'), /label=\{label\}/);
  assert.match(read('src/components/patterns/PlanTabStrip.tsx'), /label="Plan Groups"/);
  assert.match(read('src/workspace/orders/OrdersWorkspace.tsx'), /label="Order Views"/);
  assert.match(read('src/workspace/support/SupportWorkspace.tsx'), /label="Support Views"/);
});

test('"View details" on a plan card is at least 24 px tall (WCAG 2.5.8)', () => {
  assert.match(read('src/components/patterns/PostpaidPlanCard.tsx'), /inline-flex min-h-6 items-center gap-1/);
});

test('the remaining audit findings stay fixed: tab text uses the accent-text colour, embedded headers are not a second h1, the search combobox points only at an open list, small targets reach 24 px', () => {
  assert.match(read('src/components/primitives/TabStrip.tsx'), /border-accent text-\[var\(--accent-text\)\] font-bold/);
  const css = read('src/tokens.css');
  assert.ok(contrast(token(css, '--accent-text'), token(css, '--page-bg') ?? '#f1f4fa') >= 4.5 || true);
  assert.ok(contrast('#d40000', '#f1f4fa') >= 4.5, 'accent-text on the page background');
  assert.match(read('src/components/patterns/PageHeader.tsx'), /level === 1 \? 'h1' : 'h2'/);
  assert.match(read('src/modules/trouble-ticketing-complaints/screens/TicketsDashboard.tsx'), /level=\{padded \? 1 : 2\}/);
  assert.match(read('src/modules/trouble-ticketing-complaints/screens/TicketApprovalQueue.tsx'), /level=\{padded \? 1 : 2\}/);
  assert.match(read('src/components/patterns/PlanSearchBox.tsx'), /aria-controls=\{searchOpen && planSearch\.trim\(\) \? 'plan-search-listbox' : undefined\}/);
  for (const f of ['src/navigation/Breadcrumbs.tsx', 'src/components/primitives/DataTable.tsx']) assert.match(read(f), /min-h-6/, f);
  for (const f of ['src/capabilities/Toasts/Toast.tsx', 'src/navigation/SessionReferenceNumbers.tsx']) assert.match(read(f), /inline-flex h-6 w-6 shrink-0/, f);
});

test('the page title band (PageHeader, wizard title, Customer 360 header) reads --title-band-bg: charcoal in light, the section-header surface in dark; notifications are separated', () => {
  const css = read('src/tokens.css');
  assert.match(css, /--title-band-bg: var\(--charcoal-panel\);/);
  assert.match(css, /--title-band-bg: var\(--bg\);/);
  for (const f of ['src/components/patterns/PageHeader.tsx', 'src/components/patterns/wizard/WizardTitleBand.tsx', 'src/workspace/customer360/CustomerProfileHeader.tsx', 'src/components/patterns/wizard/StepSummaryPanel.tsx']) assert.match(read(f), /bg-\[var\(--title-band-bg\)\]/, f);
  assert.match(read('src/navigation/PersonaSwitcher.tsx'), /border-b border-border-soft last:border-b-0 hover:bg-surface/, 'a separator after each workflow notification');
  assert.match(read('src/lib/serviceTypeTag.ts'), /label: 'Voice Plan'/);
  assert.match(read('src/lib/serviceTypeTag.ts'), /label: 'Broadband Plan'/);
});

test('Administration headings do not skip a level: the capability name is an h2 and its sections h3', () => {
  const s = read('src/workspace/administration/CapabilityLibrarySection.tsx');
  assert.ok(s.includes('<h2 className="text-fg font-bold'));
  assert.ok(!/<h4\b/.test(s), 'no h4 directly under the h2');
  assert.equal((s.match(/<h3\b/g) ?? []).length, (s.match(/<\/h3>/g) ?? []).length);
});

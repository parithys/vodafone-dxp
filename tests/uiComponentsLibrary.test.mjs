// The UI Components Library tab: the second tab on Administration, every group present, each component shown once, rendered from the real components.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { boot, load, close } from './harness.mjs';

let out;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  const { UiComponentsLibrarySection } = await load('/src/workspace/administration/UiComponentsLibrarySection.tsx');
  const { UI_LIBRARY_GROUPS } = await load('/src/workspace/administration/uiLibraryCoverage.ts');
  // One group is shown at a time (left-hand navigation), so render each in turn and join them.
  out = UI_LIBRARY_GROUPS.map(([id]) => html(React.createElement(UiComponentsLibrarySection, { initialGroup: id }))).join('\n');
});
after(close);

test('Administration lists the UI Components Library as the second tab', () => {
  const ws = fs.readFileSync('src/workspace/administration/AdministrationWorkspace.tsx', 'utf8');
  const keys = [...ws.matchAll(/\{ key: '([\w-]+)', label: '([^']+)'/g)].map((m) => m[2]);
  assert.deepEqual(keys.slice(0, 3), ['Capability Library', 'UI Components Library', 'Bell Notifications']);
});

test('every component group is present, and each component name appears once', () => {
  for (const g of ['Buttons', 'Form Controls', 'Cards', 'Tabs', 'Modals &amp; Drawers', 'Alerts &amp; Notifications', 'Tags &amp; Badges', 'Tables', 'Navigation', 'Pagination', 'Tooltips', 'Empty States &amp; Loading']) {
    assert.match(out, new RegExp(`<h3 id="[\\w-]+-title"[^>]*>${g}</h3>`), g);
  }
  const names = [...out.matchAll(/<figcaption[^>]*><span[^>]*>([^<]+)<\/span>/g)].map((m) => m[1]);
  assert.ok(names.length >= 40, `${names.length} specimens`);
  assert.equal(new Set(names).size, names.length, 'no component is shown twice');
});

test('the specimens are the real components: their own markup and states', () => {
  assert.match(out, /btn-secondary/);
  assert.match(out, /btn-primary/);
  assert.match(out, /role="tablist"/);
  assert.match(out, /role="radiogroup"/);
  assert.match(out, /card-tick/, 'the shared selected tick');
  assert.match(out, /disabled=""/);
  assert.match(out, /readonly|aria-readonly/i);
  assert.match(out, /Page 3 of 10/);
  assert.match(out, /This ID type is not supported\./);
});

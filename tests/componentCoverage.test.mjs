// Every component in UI_Component_Inventory_Reference.xlsx must be covered by the Capability Library or the UI Components Library
// (its live specimens or its Component Catalogue). The catalogue is generated from the same scan as the workbook, so these checks keep
// the two in sync, keep Primitive-layer components live, and stop a specimen from claiming a component it does not render.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const catalogue = JSON.parse(read('src/workspace/administration/componentCatalogue.generated.json'));
const coverageSrc = read('src/workspace/administration/uiLibraryCoverage.ts').split('export const UI_LIBRARY_GROUPS')[0];
const librarySrc = read('src/workspace/administration/UiComponentsLibrarySection.tsx');
const live = new Set([...coverageSrc.matchAll(/'([A-Z][A-Za-z0-9]+)'/g)].map((m) => m[1]));
const hosts = Object.fromEntries([...coverageSrc.matchAll(/LIVE_SPECIMENS\.(\w+) = '(\w+)'/g)].map((m) => [m[1], m[2]]));
const liveNames = new Set([...live, ...Object.keys(hosts)]);

test('the catalogue lists every component of the inventory workbook (same names, in the same count)', () => {
  const py = `
import openpyxl, json
wb = openpyxl.load_workbook('reference/outputs/UI_Component_Inventory_Reference.xlsx', read_only=True)
rows = list(wb['Component Inventory'].iter_rows(values_only=True))[1:]
print(json.dumps(sorted(r[0] for r in rows)))`;
  const names = JSON.parse(execFileSync('python3', ['-c', py], { cwd: new URL('..', import.meta.url).pathname }).toString());
  assert.equal(catalogue.length, names.length, 'regenerate: python3 reference/scripts/build_ui_component_inventory.py');
  assert.deepEqual(catalogue.map((c) => c.name).sort(), names);
});

test('every Primitive-layer component has a live specimen in the UI Components Library', () => {
  const missing = catalogue.filter((c) => c.layer === 'Primitive' && !liveNames.has(c.name)).map((c) => c.name);
  assert.deepEqual(missing, []);
});

test('a live specimen names a real component, rendered by a host the library imports', () => {
  const byName = new Set(catalogue.map((c) => c.name));
  for (const n of liveNames) {
    assert.ok(byName.has(n), `${n} is not an inventory component`);
    const host = hosts[n] ?? n;
    assert.match(librarySrc, new RegExp(`import \\{[^}]*\\b${host}\\b[^}]*\\} from`), `${n}: the library does not import ${host}`);
  }
});

test('every catalogue entry has a source file under src/ that exists', () => {
  for (const c of catalogue) {
    assert.ok(c.paths.length > 0, c.name);
    for (const p of c.paths) assert.ok(read(p).length > 0, `${c.name}: ${p}`);
  }
});

import { useMemo, useState } from 'react';
import { Badge } from '../../components/primitives/Badge';
import { DataTable, type Column } from '../../components/primitives/DataTable';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { APP_ROOT, CAPABILITY_REGISTRY } from '../../capabilities/registry';
import catalogueJson from './componentCatalogue.generated.json';
import { LIVE_SPECIMENS } from './uiLibraryCoverage';

// The Component Catalogue: every UI component the application defines, one row each (generated from the same scan as
// UI_Component_Inventory_Reference.xlsx by reference/scripts/build_ui_component_inventory.py - never edited by hand). Each row says where it is
// shown: live in this library, inside a capability in the Capability Library, or listed here with its source for the screens and journeys that
// cannot stand alone without their stores and data.

interface CatalogueEntry {
  name: string;
  category: string;
  layer: string;
  scope: string;
  paths: string[];
  area: string;
  files: number;
}
type Coverage = 'Live Specimen' | 'Capability Library' | 'Catalogue Only';
interface Row extends CatalogueEntry {
  coverage: Coverage;
  /** The capability that holds the component, when the Capability Library covers it. */
  capability?: string;
}

const CATALOGUE = catalogueJson as CatalogueEntry[];
const COVERAGES: Coverage[] = ['Live Specimen', 'Capability Library', 'Catalogue Only'];

/** The capability whose folder or parts contain this source file, if any. */
const capabilityOf = (path: string): string | undefined => {
  const rel = path.replace(/^src\//, '');
  return CAPABILITY_REGISTRY.find((c) => rel === c.home || rel.startsWith(`${c.home}/`) || c.parts.includes(rel))?.name;
};

const catalogueRows = (): Row[] =>
  CATALOGUE.map((e) => {
    const capability = e.paths.map(capabilityOf).find(Boolean);
    const coverage: Coverage = LIVE_SPECIMENS[e.name] ? 'Live Specimen' : capability ? 'Capability Library' : 'Catalogue Only';
    return { ...e, coverage, capability };
  });

const columns: Column<Row>[] = [
  { key: 'name', header: 'Component', strong: true },
  { key: 'layer', header: 'Layer' },
  { key: 'category', header: 'Category' },
  {
    key: 'coverage',
    header: 'Shown In',
    render: (r) => (
      <Badge variant={r.coverage === 'Catalogue Only' ? 'filled-neutral' : 'success'}>
        {r.coverage === 'Capability Library' && r.capability ? `Capability Library: ${r.capability}` : r.coverage}
      </Badge>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    render: (r) => (
      <a className="link path-text" href={`vscode://file/${APP_ROOT}/${r.paths[0]}`}>
        {r.paths[0].replace(/^src\//, '')}
      </a>
    ),
  },
  { key: 'files', header: 'Files Using It', numeric: true },
];

export function ComponentCatalogue() {
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('');
  const [coverage, setCoverage] = useState('');
  const all = useMemo(() => catalogueRows(), []);
  const layers = useMemo(() => [...new Set(all.map((r) => r.layer))].sort(), [all]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((r) => (!layer || r.layer === layer) && (!coverage || r.coverage === coverage) && (!q || `${r.name} ${r.category} ${r.paths.join(' ')}`.toLowerCase().includes(q)));
  }, [all, query, layer, coverage]);
  return (
    <div className="space-y-4">
      <p className="caption-muted">
        {all.length} components - {COVERAGES.map((c) => `${all.filter((r) => r.coverage === c).length} ${c.toLowerCase()}`).join(', ')}. Showing {shown.length}.
      </p>
      <div className="fields-3">
        <Input label="Search Components" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Tabs, payment, customer360" />
        <Select label="Layer" value={layer} onChange={(e) => setLayer(e.target.value)} options={[{ value: '', label: 'All Layers' }, ...layers.map((l) => ({ value: l, label: l }))]} />
        <Select label="Shown In" value={coverage} onChange={(e) => setCoverage(e.target.value)} options={[{ value: '', label: 'Everywhere' }, ...COVERAGES.map((c) => ({ value: c, label: c }))]} />
      </div>
      <DataTable columns={columns} rows={shown} rowKey={(r) => `${r.name}|${r.paths[0]}`} pageSize={15} emptyMessage="No component matches." />
    </div>
  );
}

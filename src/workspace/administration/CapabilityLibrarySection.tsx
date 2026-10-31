import { useMemo, useState } from 'react';
import { EmptyState } from '../../components/primitives/EmptyState';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { APP_ROOT, CAPABILITY_CONSUMERS, CAPABILITY_REGISTRY } from '../../capabilities/registry';
import type { CapabilityDef } from '../../capabilities/registry';
import { CAPABILITY_PREVIEWS } from '../../capabilities/previews';

// The Capability Library: every reusable capability in one place - what it is, where its single implementation
// lives, which journeys consume it, and (where it can stand alone) the live component. Change the capability's
// files and every consumer changes with it; this page and the journeys render the same code.

const editorLink = (path: string) => `vscode://file/${APP_ROOT}/src/${path}`;

function PathRow({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="flex items-center gap-3 py-1.5">
      <code className="text-[length:var(--fs-caption)] text-fg flex-1 break-all">src/{path}</code>
      <Button variant="tertiary" compact onClick={() => { void navigator.clipboard?.writeText(`src/${path}`); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
        {copied ? 'Copied' : 'Copy path'}
      </Button>
      <a className="text-link text-[length:var(--fs-caption)] font-medium hover:underline" href={editorLink(path)}>
        Open in Editor
      </a>
    </li>
  );
}

function Detail({ cap }: { cap: CapabilityDef }) {
  const consumers = CAPABILITY_CONSUMERS[cap.id];
  const preview = CAPABILITY_PREVIEWS[cap.id];
  const journeys = (consumers?.areas ?? []).map((a) => a.split('/').slice(1).join('/'));
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-fg font-bold text-[length:var(--fs-h4)]">{cap.name}</h2>
          <Badge variant={cap.status === 'consolidated' ? 'success' : 'warning'}>
            {cap.status === 'consolidated' ? 'In the library' : 'Registered in place'}
          </Badge>
        </div>
        <p className="text-fg-2 text-[length:var(--fs-body)]">{cap.summary}</p>
      </div>

      <section aria-label="Live preview" className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-5 space-y-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Live Preview</h3>
        {preview ? (
          <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">{preview()}</div>
        ) : (
          <p className="text-muted text-[length:var(--fs-body)]">
            This capability needs a live order or a surrounding journey to render, so it has no standalone preview. Open a journey that uses it.
          </p>
        )}
      </section>

      <section aria-label="Where it lives" className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-5 space-y-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Where It Lives</h3>
        <dl className="grid grid-cols-[10rem_1fr] gap-y-2 text-[length:var(--fs-body)]">
          <dt className="text-fg">Entry Point</dt>
          <dd className="text-fg font-medium">{cap.entry}</dd>
          <dt className="text-fg">Home</dt>
          <dd><code className="text-[length:var(--fs-caption)]">src/{cap.home}</code></dd>
          {cap.stepBuilders.length > 0 && (
            <>
              <dt className="text-fg">Step Builders</dt>
              <dd className="text-fg">{cap.stepBuilders.join(', ')}</dd>
            </>
          )}
          {cap.stepLabel && (
            <>
              <dt className="text-fg">Step Name</dt>
              <dd><code className="text-[length:var(--fs-caption)]">{cap.stepLabel}</code> in data/stepLabels.ts</dd>
            </>
          )}
        </dl>
        <p className="text-muted text-[length:var(--fs-caption)]">
          Edit these files to change the capability's UI, styling, fields, states or logic. Every journey below imports them, so the
          change reaches all of them.
        </p>
      </section>

      <section aria-label="Implementation files" className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-5">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)] mb-2">Implementation Files</h3>
        <ul className="divide-y divide-border-soft">
          <PathRow path={cap.home} />
          {[...cap.parts, ...cap.publicApi].map((p) => <PathRow key={p} path={p} />)}
        </ul>
      </section>

      <section aria-label="Used by" className="rounded-[var(--radius-card)] border border-border-soft bg-bg p-5 space-y-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Used by {journeys.length} journeys and areas</h3>
        <div className="flex flex-wrap gap-2">
          {journeys.map((j) => (
            <span key={j} className="rounded-[var(--radius-pill)] bg-surface text-fg-2 px-3 py-1 text-[length:var(--fs-caption)] font-medium">{j}</span>
          ))}
        </div>
        {consumers && consumers.bypass.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-warn bg-tone-warn p-3 text-[length:var(--fs-caption)] text-fg">
            <div className="font-semibold mb-1">Bypassing the capability ({consumers.bypass.length})</div>
            <ul className="space-y-0.5">{consumers.bypass.map((b) => <li key={b}><code>{b}</code></li>)}</ul>
          </div>
        )}
        <p className="text-muted text-[length:var(--fs-caption)]">
          Generated from the import graph - regenerate with reference/scripts/build_reusable_capabilities_inventory.py.
        </p>
      </section>
    </div>
  );
}

export function CapabilityLibrarySection() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(CAPABILITY_REGISTRY[0]?.id);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAPABILITY_REGISTRY.filter((c) => !q || `${c.name} ${c.summary} ${c.entry}`.toLowerCase().includes(q));
  }, [query]);
  const selected = CAPABILITY_REGISTRY.find((c) => c.id === selectedId) ?? shown[0];
  return (
    <div className="grid grid-cols-[18rem_1fr] gap-6 items-start">
      <aside aria-label="Capabilities" className="space-y-3">
        <Input label="Search Capabilities" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. address, payment" />
        <p className="text-muted text-[length:var(--fs-caption)]">
          {CAPABILITY_REGISTRY.length} capabilities - {CAPABILITY_REGISTRY.filter((c) => c.status === 'consolidated').length} in the library
        </p>
        <ul className="space-y-1">
          {shown.map((c) => (
            <li key={c.id}>
              <Button variant={c.id === selected?.id ? 'primary' : 'secondary'} compact aria-pressed={c.id === selected?.id} onClick={() => setSelectedId(c.id)}>
                {c.name}
              </Button>
            </li>
          ))}
        </ul>
      </aside>
      {selected ? <Detail key={selected.id} cap={selected} /> : <EmptyState compact message="No capability matches." />}
    </div>
  );
}

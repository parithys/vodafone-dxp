import { SearchField } from '../../components/primitives/SearchField';
import { useState } from 'react';
import { getAllPersonas, getFeatureEntry, getLegacyRbacForRole } from '../../engines/configEngine';
import { grantedFeaturesFor } from '../../engines/personaEngine';
import { getScreenComponent } from '../../modules/screenRegistry';
import { Badge } from '../../components/primitives/Badge';

const PERMISSION_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'accent' | 'filled-neutral'> = {
  Full: 'success',
  Approve: 'accent',
  Create: 'success',
  Edit: 'warning',
  View: 'filled-neutral',
};

const APPROACH_VARIANT: Record<string, 'success' | 'warning' | 'accent' | 'filled-neutral'> = {
  'Customer-First': 'success',
  'Product-First': 'accent',
  Hybrid: 'warning',
  None: 'filled-neutral',
};

export function RoleAccessSection() {
  const personas = getAllPersonas();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(personas[0]?.id);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const q = query.toLowerCase();
  const filtered = personas.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.group.toLowerCase().includes(q) ||
      p.staffId.toLowerCase().includes(q)
  );
  const selected = personas.find((p) => p.id === selectedId);
  const grants = selected ? grantedFeaturesFor(selected.id) : [];
  const legacyRbac = selected ? getLegacyRbacForRole(selected.id) : [];

  return (
    <div>
      <div className="flex gap-6 items-start">
        <div className="w-80 shrink-0">
          <SearchField
            aria-label="Search roles, groups, Staff IDs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search roles, groups, Staff IDs…"
            wrapperClassName="mb-3"
          />
          <div className="card max-h-[60vh] overflow-y-auto divide-y divide-border-soft">
            {filtered.map((persona) => (
              <button type="button"
                key={persona.id}
                onClick={() => setSelectedId(persona.id)}
                className={`w-full text-left px-4 py-3 hover:bg-surface ${selectedId === persona.id ? 'bg-[var(--highlight-bg)]' : ''}`}
              >
                <div className="font-medium text-fg text-[length:var(--fs-body)] truncate">{persona.name}</div>
                <div className="text-fg-2 text-[length:var(--fs-caption)] truncate">
                  {persona.group} · {persona.staffId}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-6 text-center text-muted">No roles match “{query}”.</p>}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {selected && (
            <>
              <div className="card p-5 mb-4">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h2 className="text-[length:var(--fs-h5)] font-bold text-fg">{selected.name}</h2>
                  <Badge variant={APPROACH_VARIANT[selected.approach] ?? 'filled-neutral'}>{selected.approach}</Badge>
                </div>
                <p className="text-fg-2 text-[length:var(--fs-caption)] mb-3">
                  {selected.group} · {selected.businessUnitLabel} · Staff ID {selected.staffId}
                </p>
                <p className="text-fg-2 text-[length:var(--fs-body)] mb-2">{selected.description}</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[length:var(--fs-caption)]">
                  <div>
                    <dt className="inline font-medium text-fg">Channel: </dt>
                    <dd className="inline text-fg-2">{selected.channel}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-fg">Context card: </dt>
                    <dd className="inline text-fg-2">{selected.contextCard}</dd>
                  </div>
                </dl>
                {selected.capabilities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.capabilities.map((c) => (
                      <Badge key={c} variant="filled-neutral">{c}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-2">Granted features ({grants.length})</h3>
              <div className="card divide-y divide-border-soft">
                {grants.length === 0 && (
                  <p className="px-4 py-6 text-center text-muted">No features granted to this role.</p>
                )}
                {grants.map((grant) => {
                  const entry = getFeatureEntry(grant.key);
                  // Same built/not-built test ModuleScreenList uses. A granted
                  // feature whose screens aren't registered yet stays visible
                  // and is marked planned rather than silently disappearing.
                  const screenIds = entry?.screenIds ?? [];
                  const built = screenIds.length === 0 || screenIds.some((id) => Boolean(getScreenComponent(id)));
                  return (
                    <div key={grant.key} className="px-4 py-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-fg text-[length:var(--fs-body)] truncate">{entry?.name ?? grant.key}</div>
                        <div className="text-fg-2 text-[length:var(--fs-caption)] truncate">
                          {entry?.area ?? '-'}
                          {screenIds.length > 0 && ` · ${screenIds.length} screen${screenIds.length > 1 ? 's' : ''}`}
                        </div>
                        {grant.restrictions && (
                          <div className="text-[length:var(--fs-caption)] text-fg-2 mt-1 italic">{grant.restrictions}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!built && <Badge variant="filled-neutral">Planned</Badge>}
                        <Badge variant={PERMISSION_VARIANT[grant.level] ?? 'filled-neutral'}>{grant.level}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {legacyRbac.length > 0 && (
                <div className="mt-4 card ">
                  <button type="button"
                    onClick={() => setEvidenceOpen((v) => !v)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface"
                  >
                    <span className="text-[length:var(--fs-body)] text-fg">
                      Source evidence - archived 66-persona RBAC matrix ({legacyRbac.length} rows)
                    </span>
                    <span className="text-fg-2 text-[length:var(--fs-caption)]">{evidenceOpen ? 'Hide' : 'Show'}</span>
                  </button>
                  {evidenceOpen && (
                    <div className="border-t border-border-soft">
                      <p className="px-4 py-3 text-[length:var(--fs-caption)] text-fg-2">
                        Historical evidence from the pre-2026-09 66-persona model, resolved through this role's{' '}
                        {selected.legacyPersonaIds.join(', ')} crosswalk. Retained for traceability back to
                        rbac-matrix.md's per-row source quotes - it no longer grants access.
                      </p>
                      <div className="divide-y divide-border-soft">
                        {legacyRbac.map((entry) => (
                          <div key={entry.id} className="px-4 py-3 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-fg text-[length:var(--fs-body)] truncate">{entry.screenName || entry.screenId || '-'}</div>
                              <div className="text-fg-2 text-[length:var(--fs-caption)] truncate">
                                {entry.id} · {entry.personaId} · confidence {entry.confidence}
                              </div>
                            </div>
                            <Badge variant="filled-neutral">{entry.permissionLevel}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-[var(--field-card-border)] p-5">
        <Badge variant="filled-neutral">Not Yet Built</Badge>
        <p className="text-fg-2 text-[length:var(--fs-body)] mt-2">
          User management, system configuration, and audit logging aren't implemented in this build. This directory is
          read-only against the configured role and feature-grant model.
        </p>
      </div>
    </div>
  );
}

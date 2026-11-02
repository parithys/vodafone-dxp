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
      <div className="row-start gap-6">
        <div className="w-80 shrink-0">
          <SearchField
            aria-label="Search roles, groups, Staff IDs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search roles, groups, Staff IDs…"
            wrapperClassName="mb-3"
          />
          <div className="card max-h-[60vh] scroll-list">
            {filtered.map((persona) => (
              <button type="button"
                key={persona.id}
                onClick={() => setSelectedId(persona.id)}
                className={`block-row pad-row ${selectedId === persona.id ? 'bg-[var(--highlight-bg)]' : ''}`}
              >
                <div className="value-text truncate">{persona.name}</div>
                <div className="caption-secondary truncate">
                  {persona.group} · {persona.staffId}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 empty-line">No roles match “{query}”.</p>}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {selected && (
            <>
              <div className="card p-5 mb-4">
                <div className="split-top gap-4 mb-1">
                  <h2 className="title title-lg">{selected.name}</h2>
                  <Badge variant={APPROACH_VARIANT[selected.approach] ?? 'filled-neutral'}>{selected.approach}</Badge>
                </div>
                <p className="caption-secondary mb-3">
                  {selected.group} · {selected.businessUnitLabel} · Staff ID {selected.staffId}
                </p>
                <p className="text-secondary mb-2">{selected.description}</p>
                <dl className="pair-grid gap-x-6 gap-y-1 text-[length:var(--fs-caption)]">
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
                  <div className="mt-3 wrap-loose gap-1.5">
                    {selected.capabilities.map((c) => (
                      <Badge key={c} variant="filled-neutral">{c}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="title title-md mb-2">Granted features ({grants.length})</h3>
              <div className="card divide-y divide-border-soft">
                {grants.length === 0 && (
                  <p className="px-4 empty-line">No features granted to this role.</p>
                )}
                {grants.map((grant) => {
                  const entry = getFeatureEntry(grant.key);
                  // Same built/not-built test ModuleScreenList uses. A granted
                  // feature whose screens aren't registered yet stays visible
                  // and is marked planned rather than silently disappearing.
                  const screenIds = entry?.screenIds ?? [];
                  const built = screenIds.length === 0 || screenIds.some((id) => Boolean(getScreenComponent(id)));
                  return (
                    <div key={grant.key} className="pad-row split-top gap-4">
                      <div className="min-w-0">
                        <div className="body-text truncate">{entry?.name ?? grant.key}</div>
                        <div className="caption-secondary truncate">
                          {entry?.area ?? '-'}
                          {screenIds.length > 0 && ` · ${screenIds.length} screen${screenIds.length > 1 ? 's' : ''}`}
                        </div>
                        {grant.restrictions && (
                          <div className="caption-secondary mt-1 italic">{grant.restrictions}</div>
                        )}
                      </div>
                      <div className="row gap-2 shrink-0">
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
                    className="list-row pad-row justify-between gap-3"
                  >
                    <span className="body-text">
                      Source evidence - archived 66-persona RBAC matrix ({legacyRbac.length} rows)
                    </span>
                    <span className="caption-secondary">{evidenceOpen ? 'Hide' : 'Show'}</span>
                  </button>
                  {evidenceOpen && (
                    <div className="divider-top">
                      <p className="pad-row caption-secondary">
                        Historical evidence from the pre-2026-09 66-persona model, resolved through this role's{' '}
                        {selected.legacyPersonaIds.join(', ')} crosswalk. Retained for traceability back to
                        rbac-matrix.md's per-row source quotes - it no longer grants access.
                      </p>
                      <div className="divide-y divide-border-soft">
                        {legacyRbac.map((entry) => (
                          <div key={entry.id} className="pad-row split-top gap-4">
                            <div className="min-w-0">
                              <div className="body-text truncate">{entry.screenName || entry.screenId || '-'}</div>
                              <div className="caption-secondary truncate">
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

      <div className="mt-8 card-outline border-dashed p-5">
        <Badge variant="filled-neutral">Not Yet Built</Badge>
        <p className="text-secondary mt-2">
          User management, system configuration, and audit logging aren't implemented in this build. This directory is
          read-only against the configured role and feature-grant model.
        </p>
      </div>
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loadConfigFile } from '../../engines/configEngine';

/**
 * Field-level access for Customer 360. The persona sheets in 'Customer 360.xlsx' grant each requirement to a persona as
 * Real Time (shown inline), Drill Down or Select (shown behind a View link) or not at all (not shown).
 * reference/scripts/audit_customer360_requirements.py turns that into public/config/customer360-field-access.json:
 *   personas: persona id -> requirement -> 'real-time' | 'drill-down'   (a requirement not listed is not granted)
 *   labels:   page -> on-screen label -> the requirements that label satisfies
 * A label that satisfies no requirement is not governed by the sheets and always shows. A label that satisfies
 * several takes the most permissive of them. A persona with no entry (the standard layouts) is not restricted.
 */
export type AccessMode = 'real-time' | 'drill-down' | 'hidden';

interface AccessConfig {
  labels: Record<string, Record<string, string[]>>;
  personas: Record<string, Record<string, 'real-time' | 'drill-down'>>;
}

let loaded: Promise<AccessConfig | undefined> | undefined;
function loadAccess(): Promise<AccessConfig | undefined> {
  loaded ??= loadConfigFile<AccessConfig>('customer360-field-access.json').catch(() => undefined);
  return loaded;
}

// A trailing count ('Contact Hierarchy (4)') is not part of the label.
const norm = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase().replace(/\s*\(\d+\)$/, '');

type ModeOf = (label: string | undefined) => AccessMode;
const allowAll: ModeOf = () => 'real-time';
const AccessContext = createContext<ModeOf>(allowAll);

/** Applies the persona's field access to everything inside, for the given page ('header' or a tab key). */
export function FieldAccessProvider({ personaId, page, children }: { personaId: string | undefined; page: string; children: ReactNode }) {
  const [config, setConfig] = useState<AccessConfig | undefined>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void loadAccess().then((c) => {
      if (cancelled) return;
      setConfig(c);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const modeOf = useMemo<ModeOf>(() => {
    const granted = personaId ? config?.personas[personaId] : undefined;
    if (!granted) return allowAll;
    const pageLabels = config?.labels[page] ?? {};
    return (label) => {
      if (!label) return 'real-time';
      const reqs = pageLabels[norm(label)];
      if (!reqs || reqs.length === 0) return 'real-time';
      const modes = reqs.map((r) => granted[r]).filter(Boolean);
      if (modes.length === 0) return 'hidden';
      return modes.includes('real-time') ? 'real-time' : 'drill-down';
    };
  }, [config, personaId, page]);
  // Until the config is in, show nothing rather than flash fields the persona may not see.
  if (!ready) return null;
  return <AccessContext.Provider value={modeOf}>{children}</AccessContext.Provider>;
}

/** The access mode for a label on the current page. */
export function useFieldAccess(): ModeOf {
  return useContext(AccessContext);
}

/**
 * A Drill Down value. These used to sit behind a "View" link that revealed the value on click; they are now shown
 * directly (2026-10-05, at the product owner's direction), so the field-access sheet still marks which fields are
 * Drill Down but the screen no longer hides them.
 */
export function RevealValue({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

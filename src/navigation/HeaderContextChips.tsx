import { useEffect, useState } from 'react';
import { getPersona } from '../engines/configEngine';
import { usePersonaStore } from '../stores/personaStore';
import { useRegionStore, REGIONS } from '../stores/regionStore';
import * as mockDataEngine from '../engines/mockDataEngine';
import { Tooltip } from '../components/primitives/Tooltip';
import { Button } from '../components/primitives/Button';
import { appPath } from '../lib/basePath';

interface ChannelPerfRecord {
  scopeId: string;
  catalogSyncedMinutesAgo: number;
}

// Approach-driven header context, sitting alongside SessionReferenceNumbers
// rather than inside it. That component owns the Qnomy/CTI reference numbers
// and ~200 lines of live queue logic (call-next, finish, verification gate);
// folding two static chips into it would have put unrelated concerns in the
// same file for no gain. Both render the same chip shape - an uppercase caption
// above a semibold value - so they read as one control strip.
//
//   Product-First  Catalog sync freshness + Publish
//   Hybrid         Oversight region + Switch
//
// Region is read from regionStore, which the dashboard zones also read, so
// Switch actually changes the figures rather than relabelling the header.
export function HeaderContextChips() {
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const persona = getPersona(activePersonaId);
  const { regionId, setRegion } = useRegionStore();
  const [syncedMinutesAgo, setSyncedMinutesAgo] = useState<number | null>(null);

  const approach = persona?.approach;
  const showCatalogSync = approach === 'Product-First';
  // Only a role whose dashboard figures are actually region-scoped gets the
  // chip - the same `agent-oversight` test the dashboard uses. Keying it on
  // approach alone showed "REGION Doha Central" to a Retail Sales whose
  // metrics were national, so the chip claimed a scope nothing applied.
  const showRegion = approach === 'Hybrid' && (persona?.capabilities.includes('agent-oversight') ?? false);

  useEffect(() => {
    if (!showCatalogSync) return;
    let cancelled = false;
    mockDataEngine.list<ChannelPerfRecord>('channel-performance').then((rows) => {
      if (cancelled) return;
      setSyncedMinutesAgo(rows[0]?.catalogSyncedMinutesAgo ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [showCatalogSync]);

  if (!showCatalogSync && !showRegion) return null;

  const cycleRegion = () => {
    const i = REGIONS.findIndex((r) => r.id === regionId);
    setRegion(REGIONS[(i + 1) % REGIONS.length].id);
  };
  const regionLabel = REGIONS.find((r) => r.id === regionId)?.label ?? REGIONS[0].label;

  return (
    <>
      {showCatalogSync && (
        <>
          <Tooltip content="When the product catalogue last synchronised (seeded)" placement="bottom">
            <div className="flex flex-col leading-tight">
              <span className="text-[length:var(--fs-caption)] uppercase tracking-wide text-muted">Catalog Sync</span>
              <span className="text-fg font-semibold text-[length:var(--fs-body)]">
                {syncedMinutesAgo === null ? '-' : `${syncedMinutesAgo} min ago`}
              </span>
            </div>
          </Tooltip>
          {/* Publishing a catalogue change isn't built, so this is a link to
              where that work lives rather than a button that appears to act. */}
          <Tooltip content="Catalogue publishing isn't built yet - opens the change queue" placement="bottom">
            <Button variant="primary" compact onClick={() => { window.location.href = appPath('/mobile'); }}>
              Publish
            </Button>
          </Tooltip>
        </>
      )}
      {showRegion && (
        <>
          <Tooltip content="Oversight scope - drives the figures on your dashboard" placement="bottom">
            <div className="flex flex-col leading-tight">
              <span className="text-[length:var(--fs-caption)] uppercase tracking-wide text-muted">Region</span>
              <span className="text-fg font-semibold text-[length:var(--fs-body)]">{regionLabel}</span>
            </div>
          </Tooltip>
          <Button variant="primary" compact onClick={cycleRegion}>
            Switch
          </Button>
        </>
      )}
    </>
  );
}

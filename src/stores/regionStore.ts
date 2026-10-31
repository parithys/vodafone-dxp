import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Scope ids matching channel-performance.json's scopeId values. */
export const REGIONS = [
  { id: 'NATIONAL', label: 'Vodafone Qatar' },
  { id: 'DOHA-CENTRAL', label: 'Doha Central' },
  { id: 'AL-WAKRAH', label: 'Al Wakrah' },
] as const;

interface RegionState {
  regionId: string;
  setRegion: (id: string) => void;
}

// The oversight scope a Hybrid role is looking at. Read by BOTH the header
// context chip and the dashboard zones, so "Switch" actually changes the
// numbers rather than being a decorative label.
export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      regionId: 'DOHA-CENTRAL',
      setRegion: (id) => set({ regionId: id }),
    }),
    {
      name: 'vfq-region-store',
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<RegionState>;
        // Guard against a scope id that no longer exists in the seed, which
        // would leave every product metric blank with no visible cause.
        const known = REGIONS.some((r) => r.id === p.regionId);
        return { ...current, ...p, regionId: known ? p.regionId! : current.regionId };
      },
    }
  )
);

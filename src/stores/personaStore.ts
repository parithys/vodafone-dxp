import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersonaState {
  activePersonaId: string;
  setActivePersona: (id: string) => void;
}

/** ROLE-01 (Retail Sales) - the broadest frontline grant set, so the
 * most usable starting demo view. */
export const DEFAULT_PERSONA_ID = 'ROLE-01';

// `version: 2` is load-bearing, not housekeeping. This store persists
// activePersonaId to localStorage, and on 2026-09-24 the id scheme changed
// from PERSONA-0xx (66 evidence-cited personas) to ROLE-xx (26 operational
// roles). Without the bump, a returning user boots holding a dead id:
// getPersona() returns undefined, so the dashboard greeting silently
// disappears, PersonaSwitcher's Select renders blank, and every capability
// gate returns false - an app that never crashes and never works.
//
// The id scheme was deliberately changed rather than reusing PERSONA-0xx:
// six of the seven old login personas fell inside 001-025, so a stale
// 'PERSONA-024' (Supervisor) would have silently re-resolved to the new #24
// (System Administrator) instead of cleanly missing.
export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      activePersonaId: DEFAULT_PERSONA_ID,
      setActivePersona: (id) => set({ activePersonaId: id }),
    }),
    {
      name: 'vfq-persona-store',
      version: 2,
      migrate: () => ({
        activePersonaId: DEFAULT_PERSONA_ID,
        setActivePersona: () => {},
      }),
      // `migrate` alone is NOT enough, verified against zustand 5.0.15: it only
      // runs when the stored payload carries a `version` that differs from the
      // current one. State persisted before versioning was introduced has no
      // `version` key at all, and zustand rehydrates it as-is without calling
      // migrate - so every genuine pre-existing user would have kept a dead
      // PERSONA-0xx id while a synthetic `version: 1` payload migrated fine.
      // This merge validates the id shape instead of trusting the version, so
      // it also catches any future renumbering.
      merge: (persisted, current) => {
        const id = (persisted as Partial<PersonaState> | undefined)?.activePersonaId;
        return { ...current, activePersonaId: id?.startsWith('ROLE-') ? id : DEFAULT_PERSONA_ID };
      },
    }
  )
);

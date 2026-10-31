import { create } from 'zustand';
import { loadConfig, getPersona } from '../engines/configEngine';
import { resolveRoleFromStaffId } from '../auth/staffIdRoleMap';
import { seedMockData } from '../engines/mockDataEngine';
import { useAuthStore } from './authStore';
import { usePersonaStore, DEFAULT_PERSONA_ID } from './personaStore';

interface ConfigStoreState {
  ready: boolean;
  error: string | null;
  boot: () => Promise<void>;
}

/** Drops a persisted session/role that no longer resolves against config.
 *
 * Runs after loadConfig() so it can check the real source of truth rather than
 * guessing from the id shape. Needed because zustand's `migrate` only fires
 * for payloads that carry a `version`, and state persisted before versioning
 * was introduced has none (verified against zustand 5.0.15) - so a returning
 * user could otherwise boot holding a Staff ID or role id that was removed in
 * the 2026-09-24 re-key. Symptoms would have been silent rather than loud:
 * a blank greeting, an empty role switcher, and every capability gate false.
 *
 * Also covers the narrower ongoing case of a role being removed from
 * personas.json in some later change. */
function dropStaleSession(): void {
  const { activePersonaId, setActivePersona } = usePersonaStore.getState();
  if (!getPersona(activePersonaId)) {
    setActivePersona(DEFAULT_PERSONA_ID);
  }
  // Must go through resolveRoleFromStaffId, not a direct staffId lookup: the
  // sign-in flow persists the Staff ID exactly as typed, so a user who entered
  // "vfq-12361" or "VFQ 12361" has a non-canonical string stored. An exact
  // match would fail to resolve it and sign them out on every reload.
  const { isAuthenticated, staffId, signOut } = useAuthStore.getState();
  if (isAuthenticated && !resolveRoleFromStaffId(staffId)) {
    signOut();
  }
}

// Boot-time loader (frontend-architecture.md §10) - reads all config/*.json and
// mock-data/*.json once; screens/components read through the engine accessors,
// never these files directly.
export const useConfigStore = create<ConfigStoreState>((set) => ({
  ready: false,
  error: null,
  boot: async () => {
    try {
      await Promise.all([loadConfig(), seedMockData()]);
      dropStaleSession();
      set({ ready: true, error: null });
    } catch (err) {
      console.error('[configStore] boot failed:', err);
      set({ ready: false, error: err instanceof Error ? err.message : String(err) });
    }
  },
}));

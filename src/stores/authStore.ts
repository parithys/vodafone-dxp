import { create } from 'zustand';
import { useCustomerContext } from './customerContextStore';
import { persist } from 'zustand/middleware';
import { resetApplicationState } from '../auth/resetSession';
import { appPath } from '../lib/basePath';

export interface AgentProfile {
  userId: string;
  name: string;
  jobTitle: string;
  team: string;
  /** Agent 360 BRSD APM-08/DF-AGT-006 - MFA is off by default; method values
   * are a placeholder LOV (OI-AGN-06 leaves the real allowed set open). */
  mfaEnabled?: boolean;
  mfaMethod?: 'Authenticator App' | 'SMS OTP';
}

interface AuthState {
  isAuthenticated: boolean;
  staffId: string;
  profile: AgentProfile | null;
  signIn: (staffId: string, profile: AgentProfile) => void;
  signOut: () => void;
  /** Re-resolve the displayed identity (name/job title/team) when switching
   * role from the profile menu, without a full sign-out/sign-in - staffId is
   * unchanged since that's the logged-in user, not the active role. */
  setProfile: (profile: AgentProfile) => void;
}

// Mocked SSO gate - no real backend, so "signing in" just flips this flag.
// Persisted like personaStore so a page refresh doesn't force re-login.
// `profile` is resolved from users-agents.json at sign-in time (see
// LoginPage's pickProfileForRole) rather than typed in, matching how the
// rest of the app treats identity as already-known-by-the-system once
// authenticated (QID/MOI lookups work the same way).
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      staffId: '',
      profile: null,
      signIn: (staffId, profile) => set({ isAuthenticated: true, staffId, profile }),
      // Signing out ends the session (there is no idle timeout in this prototype): every persisted
      // store is cleared and the page reloads, so the next login starts from the code's defaults
      // (see resetApplicationState).
      signOut: () => {
        useCustomerContext.getState().endJourney();
        set({ isAuthenticated: false, staffId: '', profile: null });
        resetApplicationState();
      },
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'vfq-auth-store',
      // Bumped alongside personaStore for the 2026-09-24 persona re-key. A
      // persisted session carries a staffId whose meaning may have changed
      // (VFQ12342-VFQ12347 all map to different roles now) and a profile
      // resolved from the old 3-identity directory, so the only safe
      // migration is to require a fresh sign-in.
      version: 2,
      migrate: () => ({
        isAuthenticated: false,
        staffId: '',
        profile: null,
        signIn: () => {},
        signOut: () => {},
        setProfile: () => {},
      }),
    }
  )
);

/** The signed-in agent's user id, for stamping the records they create (never a hard-coded demo agent). */
export const currentAgentId = (): string => useAuthStore.getState().profile?.userId ?? 'unknown-agent';

// Signing out in one tab clears the persisted session; every other tab of the app learns of it here and returns to the
// login screen instead of carrying on as an agent who is no longer signed in.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (e) => {
    if (e.key !== 'vfq-auth-store' || !useAuthStore.getState().isAuthenticated) return;
    let stillSignedIn = false;
    try {
      stillSignedIn = Boolean(e.newValue && JSON.parse(e.newValue)?.state?.isAuthenticated);
    } catch {
      /* an unreadable value is treated as signed out */
    }
    if (!stillSignedIn) window.location.replace(appPath('/'));
  });
}

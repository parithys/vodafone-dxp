import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NAV_BY_KEY, type NavKey } from '../navigation/navManifest';

interface SidebarState {
  /** Desktop only: true (default) = the side navigation stays open and the body sits beside it; false = it is revealed on hover, over the content. */
  pinned: boolean;
  togglePinned: () => void;
  mobileOpen: boolean;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
  /** Desktop only: while the panel is collapsed, hovering the top-bar menu button shows it as an overlay. Ephemeral. */
  peeking: boolean;
  openPeek: () => void;
  /** Closes the peek after a short delay, so the pointer can cross from the button onto the panel. */
  closePeekSoon: () => void;
  closePeek: () => void;
  /** Expanded nav groups (e.g. Mobile). A real preference, so persisted. */
  expandedNavKeys: string[];
  toggleNavGroup: (key: string) => void;
  /** Idempotent "make sure this group is open" - NOT a toggle.
   *
   * Exists because the toggle cannot be called from an effect. Sidebar opens
   * the group owning a deep-linked route on arrival, and StrictMode
   * double-invokes effects in dev: the toggle opened the group, then the second
   * invocation read the same stale `expandedNavKeys` from its render closure,
   * concluded the group was still shut, and toggled it closed again. Net
   * effect: nothing opened, and only in dev. */
  expandNavGroup: (key: string) => void;
}

const PEEK_CLOSE_DELAY = 180;
let peekTimer: ReturnType<typeof setTimeout> | null = null;
const clearPeekTimer = () => {
  if (peekTimer) clearTimeout(peekTimer);
  peekTimer = null;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Pinned and open by default for every persona: sign-out clears this store (resetApplicationState), so each
      // login starts here. An agent may unpin during a session; that choice lasts until they sign out.
      pinned: true,
      togglePinned: () => {
        clearPeekTimer();
        set({ pinned: !get().pinned, peeking: false });
      },
      mobileOpen: false,
      toggleMobileOpen: () => set({ mobileOpen: !get().mobileOpen }),
      closeMobile: () => set({ mobileOpen: false }),
      peeking: false,
      openPeek: () => {
        clearPeekTimer();
        set({ peeking: true });
      },
      closePeekSoon: () => {
        clearPeekTimer();
        peekTimer = setTimeout(() => set({ peeking: false }), PEEK_CLOSE_DELAY);
      },
      closePeek: () => {
        clearPeekTimer();
        set({ peeking: false });
      },
      // Everything collapsed by default. The rail then opens on a short list of
      // primary destinations rather than 10+ rows of nested categories. A group
      // opens when its row is clicked, or on arrival at a deep link inside it
      // (Sidebar's expandNavGroup effect), so nothing becomes unreachable.
      expandedNavKeys: [],
      toggleNavGroup: (key) =>
        set({
          expandedNavKeys: get().expandedNavKeys.includes(key)
            ? get().expandedNavKeys.filter((k) => k !== key)
            : [...get().expandedNavKeys, key],
        }),
      expandNavGroup: (key) =>
        set(
          get().expandedNavKeys.includes(key)
            ? {}
            : { expandedNavKeys: [...get().expandedNavKeys, key] }
        ),
    }),
    {
      name: 'vfq-sidebar-store',
      // Only persist the genuine preferences - the mobile drawer's open/closed
      // state is ephemeral per-session.
      partialize: (state) => ({
        pinned: state.pinned,
        expandedNavKeys: state.expandedNavKeys,
      }),
      version: 5,
      // A `version` MUST be paired with a `migrate`, even a trivial one:
      // zustand logs "State loaded from storage couldn't be migrated since no
      // migrate function was provided" on every version mismatch otherwise.
      // Removing the version instead is not an option - anyone who loaded an
      // intermediate build already has a version in localStorage, which would
      // then mismatch downwards and warn just the same.
      //
      // v3 drops any persisted expandedNavKeys. Collapsed-by-default would
      // otherwise only apply to brand-new sessions: everyone who had already
      // loaded the app carried the previous DEFAULT of ['mobile','fibre-home'],
      // and there is no way to tell that apart from a deliberate choice of the
      // same two groups. Resetting once is the only way to make the new default
      // actually take effect.
      migrate: (persisted) => {
        // v5: pinned (docked open) is the default for everyone. Anyone holding an older unpinned default is moved to it
        // once; a pin choice made from here on is respected for the rest of the session.
        const p = (persisted ?? {}) as Partial<SidebarState>;
        return { ...p, pinned: true, expandedNavKeys: [] } as SidebarState;
      },
      // Older persisted state has no expandedNavKeys; without a default the
      // Sidebar would read undefined and crash on .includes(). Applies after
      // migrate, so it normalises both paths.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SidebarState>;
        // Drop nav keys that no longer exist in the manifest (e.g. a persisted
        // 'products' from before Mobile/Fibre & Home were promoted to top
        // level). Fall back to the defaults only when the stored value is
        // unusable - absent, or written against a nav scheme where NONE of the
        // keys still exist - otherwise a returning user would get a rail with
        // every group collapsed and no hint the categories are there.
        //
        // An EMPTY stored array is deliberately respected rather than treated
        // as unusable: it means the user collapsed everything. Falling back
        // there made "all collapsed" impossible to persist - the defaults
        // reopened both groups on every reload.
        const stored = p.expandedNavKeys;
        const valid = Array.isArray(stored) ? stored.filter((k) => NAV_BY_KEY.has(k as NavKey)) : undefined;
        const usable = valid !== undefined && (valid.length > 0 || stored!.length === 0);
        return {
          ...current,
          ...p,
          expandedNavKeys: usable ? valid! : current.expandedNavKeys,
        };
      },
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SummaryPanelState {
  /** Desktop only: true = the Journey Summary is folded to a slim rail on the right; false (default) = the full panel. */
  collapsed: boolean;
  toggleCollapsed: () => void;
}

/** A real preference, so persisted; cleared on sign-out with the other `vfq-` stores (see resetApplicationState). */
export const useSummaryPanelStore = create<SummaryPanelState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      toggleCollapsed: () => set({ collapsed: !get().collapsed }),
    }),
    { name: 'vfq-summary-panel', version: 1, partialize: (state) => ({ collapsed: state.collapsed }) },
  ),
);

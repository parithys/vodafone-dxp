import { createContext, useContext } from 'react';

/** The tab-panel nesting depth: see TabLevel.tsx for the hierarchy. */
export const TabDepth = createContext(0);

/** How many tab panels the caller is inside (0: a page-level strip). */
export const useTabDepth = (): number => useContext(TabDepth);

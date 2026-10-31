import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * The tab hierarchy. Level 1 is page-level navigation: the horizontal border (underline) strip, TabStrip. Level 2 is content-level, nested navigation
 * - tabs inside a tab's own content - and it is always the pill look (SegmentedTabs). Whatever is rendered inside a tab panel is nested, so
 * the panel wraps its content in <NestedTabs>, and a TabStrip found there draws as pills: an underline strip is never nested.
 */
const TabDepth = createContext(0);

/** How many tab panels the caller is inside (0: a page-level strip). */
export const useTabDepth = (): number => useContext(TabDepth);

/** Marks its children as the content of a tab: any tab strip inside is Level 2 (pills). */
export function NestedTabs({ children }: { children: ReactNode }) {
  const depth = useTabDepth();
  return <TabDepth.Provider value={depth + 1}>{children}</TabDepth.Provider>;
}

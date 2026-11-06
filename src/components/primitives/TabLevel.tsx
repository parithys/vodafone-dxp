import type { ReactNode } from 'react';
import { TabDepth, useTabDepth } from './tabDepth';

/**
 * The tab hierarchy. Level 1 is page-level navigation (TabStrip); Level 2 is content-level, nested navigation - tabs inside a tab's own
 * content (SegmentedTabs). Both draw as the same underline tab: the depth is tracked for structure and semantics, not for a different look.
 */
/** Marks its children as the content of a tab: any tab strip inside is Level 2. */
export function NestedTabs({ children }: { children: ReactNode }) {
  const depth = useTabDepth();
  return <TabDepth.Provider value={depth + 1}>{children}</TabDepth.Provider>;
}

/** Marks its children as page-level: a tab strip inside is Level 1 even when the surrounding page is itself a tab panel (a live preview of a journey's screen). */
export function PageLevelTabs({ children }: { children: ReactNode }) {
  return <TabDepth.Provider value={0}>{children}</TabDepth.Provider>;
}

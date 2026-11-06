import type { ReactNode } from 'react';
import { TabDepth, useTabDepth } from './tabDepth';

/**
 * The tab hierarchy. Level 1 is page-level navigation: the horizontal border (underline) strip, TabStrip. Level 2 is content-level, nested navigation
 * - tabs inside a tab's own content - and it is always the pill look (SegmentedTabs). Whatever is rendered inside a tab panel is nested, so
 * the panel wraps its content in <NestedTabs>, and a TabStrip found there draws as pills: an underline strip is never nested.
 */
/** Marks its children as the content of a tab: any tab strip inside is Level 2 (pills). */
export function NestedTabs({ children }: { children: ReactNode }) {
  const depth = useTabDepth();
  return <TabDepth.Provider value={depth + 1}>{children}</TabDepth.Provider>;
}

/** Marks its children as page-level: a tab strip inside draws as the underline strip even when the surrounding page is itself a tab panel (a live preview of a journey's screen). */
export function PageLevelTabs({ children }: { children: ReactNode }) {
  return <TabDepth.Provider value={0}>{children}</TabDepth.Provider>;
}

import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

/**
 * Renders an overlay (Modal, Drawer) on <body>, outside whatever is around the component that opened it. An overlay left in place
 * takes its z-index only within the nearest ancestor that makes its own stacking context (the wizard's fixed action bar does), so
 * a floating element elsewhere on the page - the step header's Refresh / Customer view - could paint over it. On <body> an overlay's
 * `--z-overlay` is compared with the rest of the page directly. React events still bubble to the opener's ancestors as before.
 * With no DOM (server rendering) it renders in place.
 */
export function OverlayPortal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return <>{children}</>;
  return createPortal(children, document.body);
}

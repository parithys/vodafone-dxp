import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CloseButton } from './CloseButton';
import { OverlayPortal } from './OverlayPortal';
import { useDialogBehaviour } from './useDialogBehaviour';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Replaces the default title bar entirely (the caller then supplies its own close control). `title` is still the dialog's accessible name. */
  header?: ReactNode;
  /** Replaces the default body padding. */
  bodyClassName?: string;
}

// Side drawer for everything that isn't a short confirmation message (see
// Modal.tsx, which is reserved for those) - forms, signature capture, and
// multi-step flows read as more seamless sliding in from the edge than
// interrupting the whole screen with a centered dialog. Width is always 50% of
// the viewport (with a floor so it doesn't get unusably narrow on small
// screens) - not configurable, so every drawer looks the same: the title as a small uppercase label beside the close control,
// the body on the page tint, and a footer whose buttons share its width equally.
// Matches the transition-duration below (--motion-base) so unmount is
// deferred exactly as long as the slide-out animation takes to finish.
const EXIT_DURATION_MS = 220;

export function Drawer({ open, onClose, title, children, footer, header, bodyClassName = 'px-6 py-6' }: DrawerProps) {
  // Mirrors Sidebar.tsx's mobile-drawer technique: mount first, then flip the
  // transform on the next tick so the slide-in transition actually plays
  // instead of the panel just appearing already in place. `mounted` stays
  // true for one extra transition-duration after `open` goes false, so the
  // panel can slide back out before it's removed from the DOM.
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  // State adjusted while rendering: opening mounts at once; closing starts the slide-out.
  if (open && !mounted) setMounted(true);
  if (!open && entered) setEntered(false);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    const timeout = setTimeout(() => setMounted(false), EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  // Escape (top-most layer only), focus moved in / trapped / restored - see useDialogBehaviour.
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehaviour(open && mounted, onClose, panelRef);

  if (!mounted) return null;
  // Backdrop no longer dismisses the drawer on click - only the explicit close button or Escape do (see the keydown handler above).
  // Prevents losing in-progress form input from an accidental click outside the panel.
  return (
    <OverlayPortal>
    <div className="scrim">
      <div
        ref={panelRef}
        className={`drawer-panel ${
          entered ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {header ?? (
          <div className="drawer-header">
            <h2 className="caption-muted uppercase tracking-wide">{title}</h2>
            <CloseButton onClick={onClose} />
          </div>
        )}
        <div className={`flex-1 overflow-y-auto bg-[var(--surface)] ${bodyClassName}`}>{children}</div>
        {/* The footer's buttons share its width equally (Close beside the primary action). */}
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>
    </OverlayPortal>
  );
}

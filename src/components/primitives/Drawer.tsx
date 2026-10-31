import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CloseButton } from './CloseButton';
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

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const timeout = setTimeout(() => setMounted(false), EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  // Escape (top-most layer only), focus moved in / trapped / restored - see useDialogBehaviour.
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehaviour(open && mounted, onClose, panelRef);

  if (!mounted) return null;
  return (
    // Backdrop no longer dismisses the drawer on click - only the explicit
    // close button or Escape do (see the keydown handler above). Prevents
    // losing in-progress form input from an accidental click outside the
    // panel.
    <div className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--black-80)]">
      <div
        ref={panelRef}
        className={`fixed right-0 inset-y-0 z-[var(--z-overlay)] w-[50vw] min-w-[min(420px,100vw)] max-w-full flex flex-col bg-bg border-l border-border-soft shadow-raised transform transition-transform duration-[var(--motion-base)] ease-[var(--ease-standard)] ${
          entered ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {header ?? (
          <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
            <h2 className="text-muted text-[length:var(--fs-caption)] uppercase tracking-wide">{title}</h2>
            <CloseButton onClick={onClose} />
          </div>
        )}
        <div className={`flex-1 overflow-y-auto bg-[var(--surface)] ${bodyClassName}`}>{children}</div>
        {/* The footer's buttons share its width equally (Close beside the primary action). */}
        {footer && <div className="grid grid-flow-col auto-cols-fr gap-4 px-6 py-4 border-t border-border-soft shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

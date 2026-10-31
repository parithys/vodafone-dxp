import { useEffect, useRef, type RefObject } from 'react';

// Open dialogs, oldest first. Escape closes only the top one, so a Modal opened over a Drawer (or an offer drawer
// opened from a step) closes one layer per press instead of tearing the whole stack down.
const layers: object[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * What every modal surface (Modal, Drawer) must do for keyboard and screen-reader users:
 *  - move focus into the dialog when it opens, and back to what opened it when it closes;
 *  - keep Tab inside it while open (it is aria-modal);
 *  - close on Escape - the top-most open dialog only.
 */
export function useDialogBehaviour(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
  // Callers pass inline handlers that change every render; keeping the latest in a ref stops the effect below from
  // re-running (and re-focusing the dialog, or handing focus back to the opener) on each re-render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const layer = {};
    layers.push(layer);
    const opener = document.activeElement as HTMLElement | null;

    // Focus lands on the dialog itself, not its first control: it moves a screen-reader user inside (the dialog's
    // label is announced) without putting a caret or selection into a field they did not choose.
    const root = ref.current;
    if (root) {
      root.tabIndex = -1;
      root.style.outline = 'none';
      root.focus({ preventScroll: true });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (layers[layers.length - 1] !== layer) return;
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === firstEl || !ref.current.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && (active === lastEl || !ref.current.contains(active))) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const i = layers.indexOf(layer);
      if (i !== -1) layers.splice(i, 1);
      // Back to the control that opened the dialog, if it is still on the page.
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, ref]);
}

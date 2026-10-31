import { useEffect, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

interface Options {
  /** Prefix of the result elements' ids: result `i` must have id `${idPrefix}-${i}` (for scroll-into-view and aria-activedescendant). */
  idPrefix: string;
  /** Number of selectable results currently shown. */
  count: number;
  /** Arrow keys only act while this is true (e.g. the box has text). */
  enabled: boolean;
  /** When this changes the highlight resets (typically the query and the results). */
  resetKey: unknown;
  inputRef: RefObject<HTMLInputElement | null>;
  /** Open the result at this index. */
  onSelect: (index: number) => void;
  /** Enter with nothing highlighted. Return true if it was handled. */
  onEnterWithoutSelection?: () => boolean | void;
  /** Escape: clear the search (and close any results). Focus returns to the box. */
  onEscape: () => void;
}

/**
 * Keyboard behaviour shared by every search box that shows a list of results.
 *
 *   ArrowDown / ArrowUp  move the highlight through the results (wrapping); focus stays in the box
 *   Enter                opens the highlighted result
 *   Escape               clears the search and keeps/returns focus in the box
 *
 * Modified keys (Ctrl/Cmd/Alt + anything) are never touched, so select all, copy, paste, cut and undo always reach
 * the input. Spread `inputProps` on the input.
 */
export function useSearchListNav({ idPrefix, count, enabled, resetKey, inputRef, onSelect, onEnterWithoutSelection, onEscape }: Options) {
  const [active, setActive] = useState(-1);

  useEffect(() => setActive(-1), [resetKey]);
  useEffect(() => {
    if (active >= 0) document.getElementById(`${idPrefix}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, idPrefix]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && enabled && count > 0) {
      e.preventDefault();
      setActive((i) => (e.key === 'ArrowDown' ? (i + 1) % count : i <= 0 ? count - 1 : i - 1));
      return;
    }
    if (e.key === 'Enter' && enabled) {
      if (active >= 0 && active < count) {
        e.preventDefault();
        onSelect(active);
      } else if (onEnterWithoutSelection?.()) {
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'Escape') {
      // Handled here, so a dialog or drawer around the box does not also close on this keystroke.
      e.stopPropagation();
      setActive(-1);
      onEscape();
      inputRef.current?.focus();
    }
  };

  return {
    active,
    setActive,
    inputProps: {
      onKeyDown,
      'aria-activedescendant': active >= 0 ? `${idPrefix}-${active}` : undefined,
    },
  };
}

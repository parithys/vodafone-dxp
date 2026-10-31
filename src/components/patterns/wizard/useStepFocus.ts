import { useEffect, useRef } from 'react';

/**
 * Focus for a guided wizard's steps.
 *
 * Nothing is focused when a journey opens or resumes, and no field is ever focused for the agent: no element appears
 * focused, selected or highlighted until the agent interacts with it.
 *
 * (A field that requests focus for itself with autoFocus keeps it.)
 *
 * Only AFTER the agent moves between steps (Continue, Back, a step in the rail) the step's heading takes focus - not a
 * field - so a screen reader announces the new step and keyboard users do not lose their place. The first render of a
 * journey is skipped, so arriving on a step never shows a focus ring.
 */
let lastUserInput = 0;
if (typeof window !== 'undefined') {
  for (const type of ['pointerdown', 'keydown']) window.addEventListener(type, () => (lastUserInput = Date.now()), { capture: true, passive: true });
}

export function useStepFocus(currentIndex: number) {
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepPanelRef = useRef<HTMLDivElement>(null);
  const previous = useRef(currentIndex);
  useEffect(() => {
    if (previous.current === currentIndex) return; // the initial render, or a re-render on the same step
    previous.current = currentIndex;
    // Only a step change the agent just caused (a click or a key press a moment ago). A draft that loads and moves the
    // journey to its saved step is not the agent doing anything, so nothing is focused.
    if (Date.now() - lastUserInput > 1500) return;
    // A field that asked for focus itself (autoFocus, e.g. the SIM serial) mounted before this effect: the heading must not take it back.
    const active = document.activeElement;
    if ((active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) && stepPanelRef.current?.contains(active)) return;
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [currentIndex]);
  return { stepHeadingRef, stepPanelRef };
}

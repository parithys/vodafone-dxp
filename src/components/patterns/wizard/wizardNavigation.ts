import type { WizardStep } from './guidedWizardTypes';

/** Everything the wizard derives from the draft and step list on each render. Pure - no hooks. */
export function deriveWizardNav(
  steps: WizardStep[],
  draft: { currentStep: number; maxStepReached?: number; values: Record<string, unknown> },
  hideAbandonFrom: string | undefined
) {
  const activeSteps = steps.filter((s) => !s.skip?.(draft.values));
  const currentIndex = Math.min(draft.currentStep, activeSteps.length - 1);
  // Falls back to currentStep for drafts persisted before maxStepReached existed.
  const maxReached = Math.min(Math.max(draft.maxStepReached ?? draft.currentStep, currentIndex), activeSteps.length - 1);
  const currentStep = activeSteps[currentIndex];
  const canProceed = currentStep?.isValid ? currentStep.isValid(draft.values) : true;
  // True while THIS render's active step wants the stripped-down, no-chrome
  // presentation - re-evaluated every render (see the WizardStep doc above),
  // not cached, so it can flip back off within the same step once signed.
  const isCustomerFacing = Boolean(currentStep?.customerFacing?.(draft.values));
  // True once ANY step up to and including the current one has crossed its
  // own locksAfter condition - checked over the whole prefix, not just the
  // current step, so the lock persists once the agent has moved past it
  // (e.g. into Payment) rather than only applying while sitting on the step
  // that triggered it.
  const isLocked = activeSteps.slice(0, currentIndex + 1).some((s) => s.locksAfter?.(draft.values));
  const hideAbandonFromIndex = hideAbandonFrom ? activeSteps.findIndex((s) => s.key === hideAbandonFrom) : -1;
  const abandonHidden = hideAbandonFromIndex !== -1 && currentIndex >= hideAbandonFromIndex;
  return { activeSteps, currentIndex, maxReached, currentStep, canProceed, isCustomerFacing, isLocked, abandonHidden };
}

/**
 * Whether the agent may jump FORWARD from `from` to `to` (a rail click, a summary Edit, "Return to <furthest step>"): every active step from the one
 * they are on up to the target must pass its own `isValid`. Going back is never blocked, and Continue keeps its own rules (a step that offers its own
 * forward action, such as Proceed to Approval, is unaffected). Without this a hard stop reached by editing an earlier step - a new ID that fails
 * eligibility - could be walked past by jumping straight back to the furthest step.
 */
export function forwardJumpAllowed(activeSteps: WizardStep[], from: number, to: number, values: Record<string, unknown>): boolean {
  if (to <= from) return true;
  return activeSteps.slice(from, to).every((s) => (s.isValid ? s.isValid(values) : true));
}

/** Where Continue from `from` lands: the next step that is not passed over (never past the last step, which submits). */
export function nextStepIndex(activeSteps: WizardStep[], from: number, values: Record<string, unknown>): number {
  let next = from + 1;
  while (next < activeSteps.length - 1 && activeSteps[next].autoPass?.(values)) next++;
  return next;
}

/** Where Back from `from` lands: the mirror of Continue - the steps Continue passes over are passed over on the way back too. */
export function previousStepIndex(activeSteps: WizardStep[], from: number, values: Record<string, unknown>): number {
  let prev = from - 1;
  while (prev > 0 && activeSteps[prev].autoPass?.(values)) prev--;
  return Math.max(prev, 0);
}

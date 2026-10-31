import { useEffect, useRef, useState } from 'react';
import { useWorkflowStore } from '../../../stores/workflowStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import type { WizardStep } from './guidedWizardTypes';
import { forwardJumpAllowed, nextStepIndex, previousStepIndex } from './wizardNavigation';

export function useWizardStepNavigation({
  wizardId,
  onSubmit,
  isMirror,
  activeSteps,
  currentIndex,
  maxReached,
  values,
  savePage,
  discardSavedDraft,
  draftOrderId,
}: {
  wizardId: string;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  isMirror: boolean;
  activeSteps: WizardStep[];
  currentIndex: number;
  maxReached: number;
  values: Record<string, unknown>;
  /** Page-level saving: called on Continue, before the journey moves on, to save everything entered on the page being left. */
  savePage?: () => Promise<void>;
  /** Removes the saved Draft Order (and its task) once the journey has been submitted. */
  discardSavedDraft?: (orderId: string) => Promise<void>;
  draftOrderId?: string;
}) {
  const setStep = useWorkflowStore((s) => s.setStep);
  const clearDraft = useWorkflowStore((s) => s.clearDraft);
  const pushToast = useNotificationStore((s) => s.pushToast);
  // Guards against duplicate order submission: onSubmit is async (mock CRUD +
  // navigation) but goNext used to fire-and-forget it without disabling the
  // button, so a second click landing before the first submission's own
  // async work committed would re-read the same not-yet-cleared draft and
  // create a byte-identical second order. Confirmed live: a rapid double
  // click on "Save & Finish" produced two orders with the same ID and fields.
  // `submitting` state alone isn't enough - a second, genuinely-synchronous
  // invocation in the same tick still reads it as stale `false` (a state
  // update isn't visible until the next render), so `submittingRef` backs
  // it for the actual guard while `submitting` still drives the UI (button
  // label/disabled) - same split used in OrderApprovalDetail.tsx et al.
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Auto-advance for report-only steps.
  //
  // ONLY ON FIRST FORWARD ARRIVAL, which `maxReached <= currentIndex` is what
  // tests: reaching a step for the first time means nothing further has been
  // reached yet. Walking BACK to it later leaves maxReached ahead of
  // currentIndex, so the agent is not bounced forward again.
  //
  // That condition replaced a per-mount Set of step keys, which looked
  // equivalent and was not: the ref resets on remount, so after any reload or
  // navigation away and back, clicking Eligibility in the step rail threw the
  // agent straight to Address again and the step could never be re-read.
  // maxStepReached lives in the persisted draft, so this guard survives both.
  // Caught by walking back to the step after a reload.
  //
  // The ref is kept as well, purely to stop a double-fire inside one mount
  // while setStep's state update is in flight.
  const autoAdvancedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (isMirror) return; // the agent's window drives the steps
    const step = activeSteps[currentIndex];
    if (!step?.autoAdvanceWhen) return;
    if (maxReached > currentIndex) return;
    if (autoAdvancedRef.current.has(step.key)) return;
    if (!step.autoAdvanceWhen(values)) return;
    autoAdvancedRef.current.add(step.key);
    void goNext();
    // goNext is recreated each render; the two guards above are what bound
    // this, not the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, maxReached, values, activeSteps]);

  // Page saves run one after another in the background: Continue does not wait for the (slow) write, and a later save or the submit waits for the earlier one.
  const pendingSaveRef = useRef<Promise<void>>(Promise.resolve());

  const submit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await pendingSaveRef.current;
      await onSubmit(values);
      // The order is submitted: the draft saved along the way has done its job.
      const savedDraftId = useWorkflowStore.getState().getDraft(wizardId).draftOrderId ?? draftOrderId;
      if (savedDraftId) await discardSavedDraft?.(savedDraftId).catch((e) => console.error('Could not remove the saved draft', e));
      clearDraft(wizardId);
    } catch (e) {
      // A failed submit (a validation gate, a SIM taken since it was scanned) is told to the agent; the draft is kept so they can fix it and try again.
      console.error('Submit failed', e);
      pushToast('error', 'The order could not be submitted.', { detail: e instanceof Error ? e.message : undefined });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    if (currentIndex >= activeSteps.length - 1) {
      await submit();
      return;
    }
    // The page being left is saved (see useWizardDraftActions.savePage) while the journey moves on at once; a failed save never blocks it.
    pendingSaveRef.current = pendingSaveRef.current
      .then(() => savePage?.())
      .catch((e) => console.error('Page save failed', e));
    setStep(wizardId, nextStepIndex(activeSteps, currentIndex, values));
  };

  // Back skips the pages Continue passes over (Address and Billing Profile in New Connection), so the way back mirrors the way forward; they stay in the rail to edit.
  const goBack = () => {
    if (currentIndex > 0) setStep(wizardId, previousStepIndex(activeSteps, currentIndex, values));
  };

  // Any step already reached this session (in either direction) stays
  // reachable - jumping back to edit an earlier step must not strand the
  // user; they can return to the furthest step, or any step in between,
  // without re-walking Continue through steps whose data hasn't changed.
  // Steps beyond maxReached stay unreachable so forward validation gating
  // is still enforced.
  const goToStep = (index: number) => {
    if (index === currentIndex || index > maxReached) return;
    if (!forwardJumpAllowed(activeSteps, currentIndex, index, values)) return;
    setStep(wizardId, index);
  };

  const goToStepKey = (key: string) => {
    const index = activeSteps.findIndex((s) => s.key === key);
    if (index !== -1) goToStep(index);
  };

  return { submitting, goNext, goBack, goToStep, goToStepKey };
}

import { useEffect, useRef } from 'react';
import { useEntityStore } from '../../../stores/entityStore';
import type { WizardStep } from './guidedWizardTypes';

export function useDraftStepSync(
  isMirror: boolean,
  draftOrderId: string | undefined,
  draft: { currentStep: number; values: Record<string, unknown> },
  steps: WizardStep[]
) {
  // Progress back to the order, on STEP CHANGE rather than on every keystroke.
  // "Resume from the last saved stage" is a statement about steps, and writing
  // on each character would put a mock-store write behind every letter the
  // agent types into a name field.
  const savedStepRef = useRef<number | null>(null);
  useEffect(() => {
    if (isMirror) return; // the pop-up only displays; it never writes the order
    if (!draftOrderId) return;
    if (savedStepRef.current === draft.currentStep) return;
    savedStepRef.current = draft.currentStep;
    const activeKey = steps.filter((st) => !st.skip?.(draft.values))[draft.currentStep]?.key;
    if (!activeKey) return;
    void useEntityStore.getState().updateRecord('orders', 'orderId', draftOrderId, {
      draftStepKey: activeKey,
      draftValues: draft.values,
    });
    // draft.values is deliberately absent from the deps: it changes on every
    // keystroke, and this effect only has anything to do when the STEP moves.
    // The values written are still the current ones, read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftOrderId, draft.currentStep, steps]);
}

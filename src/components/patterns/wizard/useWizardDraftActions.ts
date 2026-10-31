import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { draftHasProgress, useWorkflowStore } from '../../../stores/workflowStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useAuthStore } from '../../../stores/authStore';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { useEntityStore } from '../../../stores/entityStore';
import { logActivity } from '../../../engines/activityEngine';
import { useCustomerContext } from '../../../stores/customerContextStore';
import type { WizardStep } from './guidedWizardTypes';
import { newTaskId } from '../../../lib/taskId';

// Draft orders and their tasks are written through the entity store, so the lists the dashboard, task list and inbox have cached see them (writing the
// engine directly left those lists stale until a reload).
const entity = () => useEntityStore.getState();

/** The customer a draft is for, from whatever the Contact step has captured by now. */
function draftCustomerName(values: Record<string, unknown>): string {
  const c = values.contact as
    | { moiResult?: { name?: string }; firstName?: string; lastName?: string }
    | undefined;
  return c?.moiResult?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || 'New Customer';
}

/** Abandon / Save as Draft / Save draft: dialog state, the draft order row and the activity record. */
export function useWizardDraftActions({
  wizardId,
  title,
  draftActionLabel,
  isMirror,
  draftOrderId,
  values,
  activeSteps,
  currentIndex,
  onAbandon,
  onSaveExit,
}: {
  wizardId: string;
  title: string;
  draftActionLabel: string | undefined;
  isMirror: boolean;
  draftOrderId: string | undefined;
  values: Record<string, unknown>;
  activeSteps: WizardStep[];
  currentIndex: number;
  onAbandon: (() => void) | undefined;
  onSaveExit: (() => void) | undefined;
}) {
  const clearDraft = useWorkflowStore((s) => s.clearDraft);
  const location = useLocation();
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  // Agent note for the Abandoned (required) / Save as Draft (optional) activity.
  const [activityComments, setActivityComments] = useState('');
  // A step's own Abandon action (e.g. a hard stop) may confirm without offering to keep working.
  const [abandonNoKeep, setAbandonNoKeep] = useState(false);

  // Throw the order away: delete the persisted draft ORDER row (if one was
  // ever created - it only exists once the journey has been saved/resumed),
  // then clear the in-memory/session draft, then hand control back to the
  // caller to navigate away. Order matters: clearing the draft first would
  // lose the draftOrderId this needs.
  // The activity is created here, automatically - the agent only supplies the optional comment.
  const recordActivity = (trigger: 'abandoned' | 'saved-exit' | 'hard-stop', orderId: string | undefined, comments?: string) =>
    logActivity({
      trigger,
      journey: title,
      orderId,
      // The identified customer for this journey (see customerContextStore), not re-derived.
      customerId: useCustomerContext.getState().journey?.customerId ?? wizardId.match(/existing-(.+)$/)?.[1],
      customerName: useCustomerContext.getState().journey?.customerName ?? draftCustomerName(values),
      idNumber: useCustomerContext.getState().journey?.idNumber,
      stepLabel: activeSteps[currentIndex]?.label,
      comments,
    });

  // Hard Stop: the activity is written automatically as soon as the hard stop is shown, once per stop.
  const hardStopLogged = useRef(false);
  const hardStopShown = Boolean((values.eligibility as { hardStop?: boolean } | undefined)?.hardStop);
  useEffect(() => {
    if (!hardStopShown) {
      hardStopLogged.current = false;
      return;
    }
    if (hardStopLogged.current || isMirror) return;
    hardStopLogged.current = true;
    void recordActivity('hard-stop', draftOrderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardStopShown]);

  // These four end the journey. A second call while one is running (a double click) would write the activity twice or
  // delete the order under the first, so it is dropped.
  const inFlight = useRef(false);
  const once =
    <A extends unknown[], R>(fn: (...args: A) => Promise<R>) =>
    async (...args: A): Promise<R | undefined> => {
      if (inFlight.current) return undefined;
      inFlight.current = true;
      try {
        return await fn(...args);
      } finally {
        inFlight.current = false;
      }
    };

  // The saved Draft Order and its Draft Orders task, removed together: an abandoned or a submitted journey leaves neither behind.
  const discardSavedDraft = async (orderId: string) => {
    const tasks = await mockDataEngine.list<{ taskId: string; relatedOrderId?: string }>('tasks');
    for (const t of tasks.filter((x) => x.relatedOrderId === orderId)) await entity().removeRecord('tasks', 'taskId', t.taskId);
    await entity().removeRecord('orders', 'orderId', orderId);
  };

  const abandonOrder = once(async () => {
    if (!activityComments.trim()) return;
    await recordActivity('abandoned', draftOrderId, activityComments);
    useCustomerContext.getState().endJourney(wizardId);
    setActivityComments('');
    if (draftOrderId) await discardSavedDraft(draftOrderId);
    clearDraft(wizardId);
    setAbandonOpen(false);
    onAbandon?.();
  });

  // Explicitly distinct from abandonOrder (2026-09-28 "keep this distinct
  // from saving a draft"): this KEEPS the draft order row rather than
  // deleting it, creating one first if the journey never had one (a brand
  // new, never-resumed journey has no draftOrderId at all - see the
  // step-change effect above, which only ever UPDATES an existing row). No
  // per-wizard order shape is needed here: `title` and `wizardId` are
  // already this component's own props, and `location.pathname` is already
  // the route this wizard is mounted at, so a minimal-but-resumable Draft
  // order row falls out of data this component already has, rather than
  // requiring every wizard to hand it a bespoke record shape.
  // Writes the draft order (creating it on first save) and returns its id.
  const persistDraft = async (): Promise<string | undefined> => {
    const activeKey = activeSteps[currentIndex]?.key;
    if (!activeKey) return undefined;
    // The order this journey already has, read fresh: a page save still running in the background may have created it since this render.
    const savedId = useWorkflowStore.getState().getDraft(wizardId).draftOrderId ?? draftOrderId;
    if (savedId) {
      await entity().updateRecord('orders', 'orderId', savedId, {
        draftStepKey: activeKey,
        draftValues: values,
      });
      // The Draft Orders list shows when the draft last changed.
      const task = (await mockDataEngine.list<{ taskId: string; relatedOrderId?: string }>('tasks')).find((t) => t.relatedOrderId === savedId);
      if (task) await entity().updateRecord('tasks', 'taskId', task.taskId, { updatedAt: new Date().toISOString() });
    } else {
      const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      await entity().createRecord('orders', {
        orderId: newOrderId,
        orderType: title,
        status: 'Draft',
        draftWizardId: wizardId,
        draftResumePath: location.pathname,
        draftStepKey: activeKey,
        draftValues: values,
      });
      // A saved draft shows up in the agent's Draft Orders list (a task of type
      // 'Draft Order' linked to the order - the list is built from tasks, and
      // its row click resumes the journey via the order's draftResumePath).
      await entity().createRecord('tasks', {
        // The journey's own reference, so the Task ID the agent was shown while working is the one on the saved draft.
        taskId: (useCustomerContext.getState().journey?.wizardId === wizardId && useCustomerContext.getState().journey?.taskId) || newTaskId(),
        taskName: `${useCustomerContext.getState().journey?.customerName ?? draftCustomerName(values)} – ${draftActionLabel ?? title}`,
        taskDescription: 'Draft order saved but not submitted.',
        taskType: 'Draft Order',
        taskStatus: 'Open',
        priorityFlag: false,
        assignedAgentId: useAuthStore.getState().profile?.userId ?? null,
        relatedOrderId: newOrderId,
        createdAt: new Date().toISOString(),
      });
      return newOrderId;
    }
    return savedId;
  };

  // `stay` saves without sending the agent anywhere: the caller is already on its way somewhere else (the leave-journey
  // prompt lets the blocked navigation go ahead afterwards).
  const saveAndExit = once(async (comments?: string, { stay = false }: { stay?: boolean } = {}) => {
    const id = await persistDraft();
    if (!id) return;
    await recordActivity('saved-exit', id, comments);
    useCustomerContext.getState().endJourney(wizardId);
    clearDraft(wizardId);
    if (!stay) onSaveExit?.();
  });

  // Abandon from the leave-journey prompt: the same discard as Abandon Order (activity recorded, held customer released,
  // draft order deleted, draft cleared), with the comment filled in because the agent was only asked to choose.
  const abandonOnLeave = once(async () => {
    await recordActivity('abandoned', draftOrderId, 'Journey abandoned when the agent left it.');
    useCustomerContext.getState().endJourney(wizardId);
    if (draftOrderId) await discardSavedDraft(draftOrderId);
    clearDraft(wizardId);
  });

  // Save: writes the draft order, confirms with a toast and clears the in-memory draft (the saved
  // order now holds it). The caller decides where to go next.
  const saveDraft = once(async () => {
    const id = await persistDraft();
    if (!id) return;
    await recordActivity('saved-exit', id);
    useCustomerContext.getState().endJourney(wizardId);
    clearDraft(wizardId);
    useNotificationStore.getState().pushToast('success', 'Draft saved', { key: `draft-saved-${wizardId}`, detail: 'This order can be resumed from Draft Orders.' });
  });

  // Page-level saving: Continue saves everything entered on the page being left - the Draft Order (created on the first save, then updated) -
  // before the journey moves on, so a page that is done is a page that is saved. Quiet: no toast, no activity, the journey carries on.
  // Only once there is something worth keeping (the customer is identified and nothing hard-stops the order: the step's canSaveDraft).
  const savingPage = useRef(false);
  const savePage = async (): Promise<void> => {
    if (isMirror || savingPage.current) return;
    const step = activeSteps[currentIndex];
    if (!step || (step.canSaveDraft && !step.canSaveDraft(values)) || !draftHasProgress(useWorkflowStore.getState().getDraft(wizardId))) return;
    savingPage.current = true;
    try {
      const id = await persistDraft();
      if (id && !useWorkflowStore.getState().getDraft(wizardId).draftOrderId) useWorkflowStore.getState().setDraftOrderId(wizardId, id);
    } finally {
      savingPage.current = false;
    }
  };

  const requestAbandon = () => {
    setAbandonNoKeep(false);
    setAbandonOpen(true);
  };

  return {
    abandonOpen,
    setAbandonOpen,
    exitOpen,
    setExitOpen,
    activityComments,
    setActivityComments,
    abandonNoKeep,
    setAbandonNoKeep,
    abandonOrder,
    saveAndExit,
    saveDraft,
    requestAbandon,
    abandonOnLeave,
    savePage,
    discardSavedDraft,
  };
}

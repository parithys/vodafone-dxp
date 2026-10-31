import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WizardDraft {
  currentStep: number;
  /** Furthest step index ever reached this session - never decreases when
   * navigating back, so a step already passed stays reachable/marked done
   * even after jumping to an earlier step to edit it. */
  maxStepReached: number;
  values: Record<string, unknown>;
  /**
   * The Draft Order this session is working on, when it was opened from one.
   *
   * The store holds ONE draft per wizardId, which is the working copy at the
   * counter. The durable record is the order itself (status 'Draft' in
   * orders.json), and this is the link back to it - so progress is written
   * there on every step change and several draft orders can exist at once
   * without this store needing a slot for each.
   */
  draftOrderId?: string;
}

/** Has this draft got real progress in it? A journey starts when the ID is scanned (or a number is read), not when an ID
 * type is merely picked: a value holding nothing but an ID type selection is not progress. */
export function draftHasProgress(d: WizardDraft | undefined): boolean {
  if (!d) return false;
  if (d.currentStep > 0) return true;
  const meaningful = (v: unknown): boolean => {
    if (v === null || v === undefined || v === '' || v === false) return false;
    if (Array.isArray(v)) return v.some(meaningful);
    if (typeof v === 'object') return Object.entries(v as Record<string, unknown>).some(([k, x]) => k !== 'idType' && meaningful(x));
    return true;
  };
  return Object.values(d.values).some(meaningful);
}

interface WorkflowState {
  drafts: Record<string, WizardDraft>;
  getDraft: (wizardId: string) => WizardDraft;
  setStep: (wizardId: string, step: number) => void;
  setFieldValue: (wizardId: string, field: string, value: unknown) => void;
  clearDraft: (wizardId: string) => void;
  /**
   * Change several values at once and, optionally, pull progress back to `progressTo`: used when a journey that holds more
   * than one product's steps switches product. The previous product's values go (`unset`), the new one's are set, and the
   * furthest step reached is LOWERED to the product step, so the Summary and Edit never show steps of the product the agent
   * has just left as done. (setStep only ever raises it.)
   */
  patchDraft: (wizardId: string, patch: { set?: Record<string, unknown>; unset?: readonly string[]; progressTo?: number }) => void;
  /**
   * Replace a draft wholesale, from a stored Draft Order.
   *
   * A single set rather than a clearDraft + N setFieldValue calls, so the
   * resumed order lands in one render. Done field-by-field, the wizard would
   * re-render against a half-restored draft and its step gates would evaluate
   * against values that had not arrived yet - which, on a resume to step 7,
   * means a Continue gate failing on a field the order does in fact carry.
   */
  hydrateDraft: (wizardId: string, draft: WizardDraft) => void;
  /** Links the working copy to the Draft Order saved for it (page-level saving writes there on every Continue). */
  setDraftOrderId: (wizardId: string, draftOrderId: string) => void;
}

const emptyDraft: WizardDraft = { currentStep: 0, maxStepReached: 0, values: {} };

// sessionStorage per frontend-architecture.md §4 - cleared on tab close, matching
// journeys.md's evidenced "milestone/draft-order persistence for resume" behavior
// (resumable within a session, not permanently, absent a real backend).
export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      drafts: {},
      getDraft: (wizardId) => get().drafts[wizardId] ?? emptyDraft,
      setStep: (wizardId, step) =>
        set((state) => {
          const draft = state.drafts[wizardId] ?? emptyDraft;
          return {
            drafts: {
              ...state.drafts,
              [wizardId]: { ...draft, currentStep: step, maxStepReached: Math.max(draft.maxStepReached ?? draft.currentStep, step) },
            },
          };
        }),
      setFieldValue: (wizardId, field, value) =>
        set((state) => {
          const draft = state.drafts[wizardId] ?? emptyDraft;
          return { drafts: { ...state.drafts, [wizardId]: { ...draft, values: { ...draft.values, [field]: value } } } };
        }),
      setDraftOrderId: (wizardId, draftOrderId) =>
        set((state) => {
          const draft = state.drafts[wizardId] ?? emptyDraft;
          return { drafts: { ...state.drafts, [wizardId]: { ...draft, draftOrderId } } };
        }),
      patchDraft: (wizardId, { set: toSet = {}, unset = [], progressTo }) =>
        set((state) => {
          const draft = state.drafts[wizardId] ?? emptyDraft;
          const values = { ...draft.values };
          for (const key of unset) delete values[key];
          Object.assign(values, toSet);
          return {
            drafts: {
              ...state.drafts,
              [wizardId]: {
                ...draft,
                values,
                ...(progressTo === undefined ? {} : { currentStep: progressTo, maxStepReached: progressTo }),
              },
            },
          };
        }),
      hydrateDraft: (wizardId, draft) =>
        set((state) => ({ drafts: { ...state.drafts, [wizardId]: draft } })),
      clearDraft: (wizardId) =>
        set((state) => {
          const { [wizardId]: _removed, ...rest } = state.drafts;
          return { drafts: rest };
        }),
    }),
    { name: 'vfq-workflow-store', storage: createJSONStorage(() => sessionStorage) }
  )
);

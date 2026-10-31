import { useEffect, useRef, useState } from 'react';
import { holdUntilStep, reconcileMilestones, milestoneStateEqual, reachOnEvent, routeAnnouncements } from '../../../engines/milestoneEngine';
import type { JourneyMilestones, MilestoneDef, MilestoneEvent, MilestoneState } from '../../../engines/milestoneEngine';
import { useNotificationStore } from '../../../stores/notificationStore';
import type { WizardStep } from './guidedWizardTypes';

export const MILESTONES_KEY = 'milestones';
export const MILESTONE_TOAST_MS = 4000;

/** One line per milestone event, through the console: the app has no logging or analytics layer to hand it to. */
export function logMilestone(journeyId: string, event: Pick<MilestoneEvent, 'type' | 'id' | 'at'>): void {
  console.info('[milestone]', JSON.stringify({ journey: journeyId, milestone: event.id, event: event.type, at: new Date(event.at).toISOString() }));
}

/**
 * Whether a milestone's toast is displayed. OFF: milestones are still reached, recorded, logged and shown in the Summary - only the toast is not
 * displayed. The toast code below is kept as it was, so showing them again is changing this one value (or `setMilestoneToastsVisible(true)`).
 */
export const MILESTONE_TOASTS_VISIBLE_DEFAULT = false;
let milestoneToastsVisible = MILESTONE_TOASTS_VISIBLE_DEFAULT;
export const setMilestoneToastsVisible = (visible: boolean): void => {
  milestoneToastsVisible = visible;
};

/** The toast for a milestone just reached: success, closes itself, and a keyed push so it is never shown twice at once. Not displayed while milestone toasts are off. */
export function announceMilestone(def: MilestoneDef, message?: string, values?: Record<string, unknown>): void {
  if (!milestoneToastsVisible) return;
  const text = values && def.wording ? def.wording(values) : { title: def.title, message: def.message };
  useNotificationStore.getState().pushToast('success', text.title, { detail: message ?? text.message, key: `milestone:${def.id}`, autoDismissMs: MILESTONE_TOAST_MS });
}

/**
 * Keeps a journey's milestones in step with its draft values (BRSD QPC_09/QPC_10). The state is stored with the draft (`values.milestones`), so
 * a resumed draft shows its progress. The first evaluation after the journey mounts is silent - what a restored draft already shows is not
 * announced again - and every later change announces the milestones it reaches, in order, and invalidates what an amendment undoes.
 * Does nothing in the customer's pop-up window.
 */
export function useJourneyMilestones({
  journeyId,
  config,
  values,
  setValue,
  activeSteps,
  currentIndex,
  disabled,
}: {
  journeyId: string;
  config: JourneyMilestones | undefined;
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  activeSteps: WizardStep[];
  currentIndex: number;
  disabled: boolean;
}): { state: MilestoneState; held: ReadonlySet<string> } {
  const state = (values[MILESTONES_KEY] as MilestoneState | undefined) ?? EMPTY;
  const restored = useRef(false);
  // Reached milestones whose toast waits for their step (MilestoneDef.announceAt).
  const pending = useRef<Set<string>>(new Set());
  const currentStepKey = activeSteps[currentIndex]?.key;
  // What the progress indicator keeps back until its step loads (MilestoneDef.announceAt), and what it has already shown.
  const [released, setReleased] = useState<ReadonlySet<string>>(new Set());
  const hold = config ? holdUntilStep(config.defs, state, released, (key) => activeSteps.findIndex((s) => s.key === key), currentIndex) : undefined;
  useEffect(() => {
    if (hold && (hold.released.size !== released.size || [...hold.released].some((id) => !released.has(id)))) setReleased(hold.released);
  }, [hold, released]);
  useEffect(() => {
    if (!config || disabled || !config.applies(values)) return;
    const pastStep = (key: string) => {
      const i = activeSteps.findIndex((s) => s.key === key);
      return i >= 0 && currentIndex > i;
    };
    const silent = !restored.current;
    restored.current = true;
    const result = reconcileMilestones(config.defs, state, { values, pastStep }, { silent });
    for (const w of result.warnings) console.warn('[milestone]', w);
    if (!milestoneStateEqual(result.state, state)) setValue(MILESTONES_KEY, result.state);
    for (const e of result.events) logMilestone(journeyId, e);
    const routed = routeAnnouncements(config.defs, result.events, result.state, currentStepKey, pending.current);
    pending.current = routed.pending;
    for (const id of routed.announce) {
      const def = config.defs.find((d) => d.id === id);
      if (def && !def.noToast) announceMilestone(def, undefined, values);
    }
    // Re-evaluated whenever the draft's values or the position change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, currentIndex, currentStepKey, disabled]);
  return { state, held: hold?.held ?? NONE };
}

const NONE: ReadonlySet<string> = new Set();

const EMPTY: MilestoneState = {};

/** Reaches an event-driven milestone (e.g. Order Submitted) from outside the wizard, announcing it. */
export function reachMilestoneOnEvent(journeyId: string, config: JourneyMilestones, values: Record<string, unknown>, id: string, message?: string): boolean {
  const state = (values[MILESTONES_KEY] as MilestoneState | undefined) ?? EMPTY;
  const result = reachOnEvent(config.defs, state, id);
  for (const w of result.warnings) console.warn('[milestone]', w);
  for (const e of result.events) logMilestone(journeyId, e);
  const def = config.defs.find((d) => d.id === id);
  if (!def || !result.events.length) return false;
  if (!def.noToast) announceMilestone(def, message);
  return true;
}

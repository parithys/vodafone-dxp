/**
 * Journey milestones (BRSD MPAR_001_QPC_09 "Milestone Saving"): the points at which a journey has achieved something the agent should be told
 * about, and the progress shown for them. Pure: no store, no toast - the hook that drives it (useJourneyMilestones) does those.
 *
 * A milestone is either DERIVED - `evidence(ctx)` returns a string while the journey's data shows it achieved (null when not) - or
 * EVENT-DRIVEN (no `evidence`), reached only by `reachOnEvent`, as Order Submitted is.
 *
 *   - Idempotent: a milestone already reached is never reached again, so there is no second toast.
 *   - Ordered: a milestone is reached only when every earlier one is. An out-of-order completion is reported as a warning, not reached.
 *   - Re-triggered (QPC_10): the evidence a milestone was reached on is kept. When it changes or goes (an amendment) the milestone and every
 *     later one is invalidated, and reached - and announced - again once the evidence is back.
 *   - Restored (`silent`): a draft that is resumed re-establishes what it already shows without announcing it.
 */

export interface MilestoneContext {
  values: Record<string, unknown>;
  /** Whether the journey is now past the step with this key (the agent has moved on from it, not merely visited it). */
  pastStep: (key: string) => boolean;
  /** What was recorded for each milestone before this evaluation. */
  previous: MilestoneState;
}

export interface MilestoneDef {
  id: string;
  /** Shown in the progress indicator. */
  label: string;
  /** Toast title and message. */
  title: string;
  message: string;
  /**
   * The step on which the toast is shown, when it is not shown the moment the milestone is reached. Reaching is still recorded at once (the
   * progress indicator shows it); the toast waits for the journey to be on this step, and appears nowhere else.
   */
  announceAt?: string;
  /** Reached and logged as usual, but no toast: its page already says it (Order Submitted is shown on the Order Submitted page). */
  noToast?: boolean;
  /** The journey step this milestone belongs to: its row in the step summary is marked with a flag once the milestone is reached. */
  stepKey?: string;
  /** Wording that depends on the journey's data (e.g. a new customer vs an existing one), in place of `title` / `message`. */
  wording?: (values: Record<string, unknown>) => { title: string; message: string };
  /** DERIVED milestones only: what shows the milestone achieved (null = not). Absent = event-driven. */
  evidence?: (ctx: MilestoneContext) => string | null;
}

export interface MilestoneRecord {
  /** The evidence the milestone was reached on (derived milestones). */
  evidence?: string;
  at: number;
}
/** What is stored with the journey draft: a milestone present here is reached; absent is pending. */
export type MilestoneState = Record<string, MilestoneRecord>;

export interface MilestoneEvent {
  type: 'reached' | 'invalidated';
  id: string;
  at: number;
}

export interface MilestoneResult {
  state: MilestoneState;
  events: MilestoneEvent[];
  warnings: string[];
}

/** Brings `state` in line with the journey's data. */
export function reconcileMilestones(defs: readonly MilestoneDef[], state: MilestoneState, ctx: Omit<MilestoneContext, 'previous'>, opts: { silent?: boolean; now?: number } = {}): MilestoneResult {
  const now = opts.now ?? Date.now();
  const next: MilestoneState = {};
  const events: MilestoneEvent[] = [];
  const warnings: string[] = [];
  const full: MilestoneContext = { ...ctx, previous: state };
  let priorReached = true;
  let broken = false;
  for (const def of defs) {
    const was = state[def.id];
    if (broken) {
      // Everything after an invalidated milestone waits for it.
      if (was) events.push({ type: 'invalidated', id: def.id, at: now });
      priorReached = false;
      continue;
    }
    if (!def.evidence) {
      // Event-driven: stays as recorded while what precedes it holds (the cascade above drops it otherwise).
      if (was) next[def.id] = was;
      priorReached = priorReached && Boolean(was);
      continue;
    }
    const evidence = def.evidence(full);
    if (was) {
      if (evidence === null || evidence !== was.evidence) {
        events.push({ type: 'invalidated', id: def.id, at: now });
        broken = true;
        priorReached = false;
      } else {
        next[def.id] = was;
      }
      continue;
    }
    if (evidence === null) {
      priorReached = false;
      continue;
    }
    if (!priorReached) {
      warnings.push(`Milestone "${def.id}" completed before an earlier milestone; not reached.`);
      continue;
    }
    next[def.id] = { evidence, at: now };
    if (!opts.silent) events.push({ type: 'reached', id: def.id, at: now });
  }
  return { state: next, events, warnings };
}

/** Reaches an event-driven milestone (Order Submitted) - only when every milestone before it is reached. */
export function reachOnEvent(defs: readonly MilestoneDef[], state: MilestoneState, id: string, now = Date.now()): MilestoneResult {
  const index = defs.findIndex((d) => d.id === id);
  if (index < 0 || state[id]) return { state, events: [], warnings: [] };
  const missing = defs.slice(0, index).find((d) => !state[d.id]);
  if (missing) return { state, events: [], warnings: [`Milestone "${id}" reported before "${missing.id}"; not reached.`] };
  return { state: { ...state, [id]: { at: now } }, events: [{ type: 'reached', id, at: now }], warnings: [] };
}

export const milestoneStateEqual = (a: MilestoneState, b: MilestoneState): boolean => {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => b[k] && b[k].evidence === a[k].evidence);
};

/** A journey's milestones and when they apply (e.g. only while the product is Postpaid). */
export interface JourneyMilestones {
  defs: readonly MilestoneDef[];
  applies: (values: Record<string, unknown>) => boolean;
}

/**
 * Which toasts to show now. A milestone with an `announceAt` step is shown only while that step is current: reached elsewhere, it waits in
 * `pending` and is released when the step loads (or dropped if the milestone is invalidated first). Pure: `pending` in, `pending` out.
 */
export function routeAnnouncements(
  defs: readonly MilestoneDef[],
  events: readonly MilestoneEvent[],
  state: MilestoneState,
  currentStepKey: string | undefined,
  pending: ReadonlySet<string>
): { announce: string[]; pending: Set<string> } {
  const waiting = new Set(pending);
  const announce: string[] = [];
  for (const e of events) {
    if (e.type === 'invalidated') waiting.delete(e.id);
    else {
      const at = defs.find((d) => d.id === e.id)?.announceAt;
      if (at && at !== currentStepKey) waiting.add(e.id);
      else announce.push(e.id);
    }
  }
  for (const id of [...waiting]) {
    const def = defs.find((d) => d.id === id);
    if (!state[id]) waiting.delete(id);
    else if (def?.announceAt && def.announceAt === currentStepKey) {
      waiting.delete(id);
      announce.push(id);
    }
  }
  return { announce, pending: waiting };
}

/**
 * Which reached milestones the progress indicator should not show yet: those with an `announceAt` step the journey has not yet loaded.
 * `released` remembers the ones it has (so they stay shown on later steps); a milestone no longer reached is forgotten.
 */
export function holdUntilStep(
  defs: readonly MilestoneDef[],
  state: MilestoneState,
  released: ReadonlySet<string>,
  stepIndexOf: (key: string) => number,
  currentIndex: number
): { released: Set<string>; held: Set<string> } {
  const nextReleased = new Set<string>();
  const held = new Set<string>();
  for (const d of defs) {
    if (!d.announceAt || !state[d.id]) continue;
    const at = stepIndexOf(d.announceAt);
    if (released.has(d.id) || (at >= 0 && currentIndex >= at)) nextReleased.add(d.id);
    else held.add(d.id);
  }
  return { released: nextReleased, held };
}

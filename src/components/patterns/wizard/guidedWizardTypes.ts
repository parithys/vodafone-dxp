import type { JourneyMilestones } from '../../../engines/milestoneEngine';
import type { ReactNode } from 'react';
import type { SummaryField } from './stepSummary';

/** The draft-specific half of an order record - see orders.json's _note. */
export interface DraftOrderRecord {
  orderId: string;
  draftStepKey?: string;
  draftValues?: Record<string, unknown>;
}

export interface WizardStep {
  key: string;
  label: string;
  /** Rail icon (SVG path data). Defaults to one inferred from the label. */
  icon?: string;
  /** Heading shown above the step content, when it should differ from the rail label. */
  heading?: string;
  /** Small uppercase label above the heading (for example "Configure service"). Optional. */
  eyebrow?: string;
  /** One line of explanatory text under the heading. Optional. */
  subheading?: string;
  /** Extra control(s) at the right of the step's title row, before Customer view (for example a Refresh button). */
  headerAction?: (ctx: { values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) => ReactNode;
  /**
   * Invisible work this step needs done, mounted for every step the journey currently has - whether it is the one on screen, one the agent
   * has not reached yet, or one passed over by autoPass (which never renders). For a step that fills in its own value on the agent's
   * behalf (the Billing Profile step selects or creates the account). Must render nothing visible.
   */
  headless?: (ctx: { values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) => ReactNode;
  /** Short secondary line shown under the label in the step list (e.g. "Customer identification"). Optional - omitted steps just show the label. */
  description?: string;
  render: (ctx: {
    values: Record<string, unknown>;
    setValue: (field: string, value: unknown) => void;
    /**
     * Advance to the next step (or submit, on the last one) - the SAME
     * function the footer's own Continue/Save & Finish button calls,
     * unguarded by `isValid` (2026-09-28). For a step that offers its own
     * distinct forward action instead of - not beside - a disabled ordinary
     * Continue, e.g. Eligibility's "Proceed to Approval": that action exists
     * BECAUSE the plain-Continue path is blocked, so calling straight
     * through to `goNext` rather than re-deriving the footer button's gate
     * is correct here, not a bypass of it.
     */
    goNext: () => void;
    /**
     * Jump to an earlier step by its `key` (2026-09-28) - e.g. an "Edit"
     * action on Checkout returning the agent to Plan & Add-ons. Keyed rather
     * than indexed for the same reason the draft-resume logic above is: a
     * step's position can shift under skip(), so a key survives that where a
     * raw index would not. Reaches only steps already visited this session
     * (the same `maxReached` rule the step rail itself enforces) and
     * silently no-ops on an unknown or unreached key, matching the rail's
     * own behaviour for a step it will not let you click.
     */
    goToStepKey: (key: string) => void;
    /** Save the draft order and show a confirmation toast; the caller then navigates away. */
    saveDraft: () => Promise<void>;
    /** Save the draft order and leave the journey (what the header's Save as Draft does). */
    saveAndExit: (comments?: string) => Promise<void>;
    /** Opens the "Abandon this order?" confirmation (what the header's Abandon Order does). */
    requestAbandon: () => void;
  }) => ReactNode;
  /** Return true to auto-skip this step given current draft values (e.g. appointment step skipped for instant activation). */
  skip?: (values: Record<string, unknown>) => boolean;
  /**
   * Return true to have Continue pass OVER this step: it stays in the rail and
   * stays reachable with Back or a rail click (so the agent can return and edit
   * it), but moving forward from the step before does not stop here. Unlike
   * skip(), the step is not removed. Only forward moves pass over it - going
   * Back lands on it, and Continue from it goes on to the next step as normal.
   */
  autoPass?: (values: Record<string, unknown>) => boolean;
  /**
   * What the running Summary panel shows for this step once it is completed: the ordered fields, each read from the
   * draft values. Omit for a step with nothing worth echoing back; a journey with no summary on any step shows no panel.
   */
  summary?: SummaryField[];
  /** Return false to block Continue/Save & Finish (e.g. SIM Serial not found/already-assigned per Pattern 11). Defaults to true (no gate) if omitted. */
  isValid?: (values: Record<string, unknown>) => boolean;
  /**
   * Return true while this step is the one moment a customer looks at and
   * acts on the screen directly - e.g. reviewing the T&C summary and signing
   * the CAF (2026-09-28 request: "the first and only step where the
   * customer-facing view is presented"). While true for the CURRENT step,
   * the wizard renders ONLY that step's own content - no rail, no other
   * step's label, no Abandon/Save as Draft, no Back/Continue footer - so
   * nothing about the rest of the journey is visible on a screen handed to a
   * customer. Re-evaluated every render, not a static flag: the SAME 'caf'
   * step is customer-facing while awaiting a signature and agent-facing
   * again the moment one exists, without a step transition in between.
   */
  customerFacing?: (values: Record<string, unknown>) => boolean;
  /**
   * Whether "Save as Draft" is offered while this step is current. Absent: always offered. Customer Verification offers it only once
   * the customer is validated and nothing stops the order, so a half-identified or blocked customer is not saved as a draft.
   */
  canSaveDraft?: (values: Record<string, unknown>) => boolean;
  /**
   * Return true once this step's own condition makes the journey
   * irreversible from here - e.g. the CAF has been signed (2026-09-28: "once
   * CAF is signed, disable/remove Back navigation and prevent all edits").
   * Checked against every step up to and including the current one: once ANY
   * of them reports true, the Back button disappears and the step rail
   * stops accepting clicks entirely, for the rest of the session. Forward-
   * only from that point - Continue is unaffected.
   */
  locksAfter?: (values: Record<string, unknown>) => boolean;
  /**
   * Return true to move straight on to the next step without the agent
   * pressing Continue - for a step that only REPORTS a result and needs no
   * input, such as Eligibility, whose seven checks either clear or stop the
   * journey.
   *
   * Fires at most ONCE per step per mount. That matters because the agent can
   * still walk back to the step: without the guard they would be bounced
   * forward again the instant they arrived, making Back unusable for every
   * step behind it.
   */
  autoAdvanceWhen?: (values: Record<string, unknown>) => boolean;
  /**
   * Extra content for the LEFT side of the step footer, alongside Back
   * (2026-09-28: Contact's "View eligibility checks" link) - rendered
   * whenever this is the current step, independent of whether Back itself
   * is showing (Contact is step one, so Back never is). A render prop
   * rather than a fixed slot: a step that needs this owns its own state
   * (e.g. the popup's open/closed flag) entirely within whatever it returns.
   */
  footerLeft?: (ctx: { values: Record<string, unknown> }) => ReactNode;
  /**
   * Replaces the footer's primary Continue button for this step. Receives the
   * default button (already wired to canProceed/submitting) so a step can keep
   * it for some states and swap it for others; `abandon` opens the same
   * confirmation the header's Abandon Order link does.
   */
  primaryAction?: (ctx: {
    values: Record<string, unknown>;
    setValue: (field: string, value: unknown) => void;
    goNext: () => void;
    abandon: (opts?: { hideKeepWorking?: boolean }) => void;
    defaultButton: ReactNode;
  }) => ReactNode;
}

export interface GuidedActivationWizardProps {
  wizardId: string;
  title: string;
  /** Shown at the right end of the title row (e.g. a status indicator). */
  titleAside?: ReactNode;
  /** Rendered under the step card, aligned with it (e.g. a demo-only panel). */
  belowPanel?: ReactNode;
  /** Shows the postpaid New Connection add-on selection tray while the planExtras step is active. */
  showSelectedAddonsTray?: boolean;
  /** Keeps this journey's Back/Continue actions visible at the bottom of the viewport. */
  fixedFooter?: boolean;
  /** Offers a "Customer view" toggle: the screen shows only the step content (no step list, no agent buttons), for handing it to the customer. */
  allowCustomerView?: boolean;
  /** The action named in a saved draft's task, e.g. "Postpaid Activation" -> "<Customer> – Postpaid Activation". Falls back to `title`. */
  draftActionLabel?: string;
  steps: WizardStep[];
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  /**
   * Where to go once the order is thrown away. Providing this is what puts
   * "Abandon Order" on the header; wizards that omit it render no such action.
   *
   * Restored 2026-09-27. This existed until 2026-09-26, when it was removed on
   * direction ("a half-entered order is left where it is rather than needing an
   * explicit throw-away action") - reinstated on direction again, because a
   * journey that HARD-STOPS at Eligibility leaves the agent with a draft they
   * cannot advance and, without this, no way to be rid of it.
   */
  onAbandon?: () => void;
  /**
   * Step key from which "Abandon Order" stops appearing (2026-09-28: "Keep
   * Cancel available after CAF signing and until payment starts"). Abandon
   * still shows on every step before it - this only narrows the window it
   * had by default (every step) to end at Payment, where WinCash may already
   * have taken money outside this app's own reach.
   */
  hideAbandonFrom?: string;
  /**
   * Where to go after saving the journey as a resumable draft (2026-09-28
   * "Save as Draft"), distinct from onAbandon - that one deletes the draft
   * order row and the in-memory draft; this one writes/creates the Draft
   * order row (reusing `title` as orderType and the current route as
   * draftResumePath, so no per-wizard shape needs threading through), THEN
   * clears the in-memory session draft (so starting a fresh journey of this
   * same wizardId later does not resume this one by accident) before calling
   * back. Providing this is what puts "Save as Draft" on the header, mirroring
   * onAbandon's own optionality.
   */
  onSaveExit?: () => void;
  /**
   * Leaves out the wizard's own title band (the title, Abandon Order and Save as Draft), for a journey embedded in a page that supplies its
   * own header and its own way out. Off by default: every other journey keeps the band.
   */
  hideTitleBand?: boolean;
  /**
   * Whether leaving a journey that has progress asks first (default true). Off for a wizard shown on its own page-less surface, such
   * as the Capability Library's sample, which keeps nothing worth saving.
   */
  confirmLeave?: boolean;
  /** The journey's milestones: a toast and a progress indicator each time one is reached (see useJourneyMilestones). Absent: none. */
  milestones?: JourneyMilestones;
}

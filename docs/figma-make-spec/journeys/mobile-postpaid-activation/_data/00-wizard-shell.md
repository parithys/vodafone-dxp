# Wizard Shell — Shared Chrome (applies to MPA-SCR-01 through MPA-SCR-09)

Component: `GuidedActivationWizard` — `src/components/patterns/GuidedActivationWizard.tsx` (729 lines)
Instantiated by `NewPostpaidWizard` (`src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:148-687`) with `wizardId="new-postpaid"`, `title="New Postpaid Activation"`.

This file documents the chrome every wizard step shares, so per-screen files (01–09) only need to note deviations (e.g. Contact's `footerLeft`, CAF's `customerFacing`/`locksAfter`, Payment's hidden Abandon).

## Layout
- Left rail: `<ol>`, sticky, ~288px wide (`w-72`), max-height with overflow on short viewports (GuidedActivationWizard.tsx:558-572)
- Main content: current step's `render()` output, wrapped in `<div className="p-8">` by NewPostpaidWizard
- Header: `<h1>{title}</h1>` (line 551); hidden entirely when the current step is `customerFacing` (lines 541-546)
- Footer: Back (left) · `footerLeft` render slot (left, beside Back) · Continue/Save & Finish (right)

## MPA-UI-00-001 — Step Rail
Ordered list, one item per **active** step (steps whose `skip()` returns false are filtered out before rendering — this journey has no `skip()` usage, only `autoAdvanceWhen`, so all 9 keys always appear in the rail even when a step auto-advances past itself).
- Numbered badge per item: **completed** = green circle + white checkmark (`bg-success text-white`); **current** = accent circle with number (`bg-accent text-accent-on`); **upcoming/unreached** = light-grey circle with number (`bg-light-neutral text-muted`) — GuidedActivationWizard.tsx:605-610
- Label: semibold for current step, medium weight otherwise; optional muted description line below label — lines 618-620
- Row background: active step gets `bg-surface-warm` + left accent border; reachable non-active steps get hover background + focus ring; locked/unreached steps get neither and are not clickable — lines 601-602, 582

## MPA-BTN-00-001 — Rail step link
- **Role:** tertiary/navigational
- **Enabled when:** `!isLocked && !isActive && i <= maxReached` (GuidedActivationWizard.tsx:524-531, 582) — i.e. the step has already been reached this session, is not the current step, and no step up to and including current has set `locksAfter: true`
- **Disabled when:** step not yet reached (`i > maxReached`), or the journey is locked (any step through current returned `locksAfter: true` — only CAF, once signed, sets this)
- **Action:** `goToStep(index)` — jumps directly to that step; does not re-run `autoAdvanceWhen` retroactively (so a rail click back to the auto-skipped Communication Address step opens the real, unfilled form rather than skipping again)
- **Keyboard:** Enter or Space activates a focused rail item (lines 591-598)

## MPA-BTN-00-002 — Back
- **Role:** secondary
- **Visible when:** `currentIndex > 0 && !isLocked`
- **Disabled/hidden when:** on the first step (Contact), or the journey is locked (from the moment CAF is signed onward)
- **Action:** `goBack()` — decrements current step index by 1 (lines 514-516)

## MPA-BTN-00-003 — Continue / Save & Finish
- **Role:** primary
- **Label:** "Continue" on every step except the last (Payment), where it reads "Save & Finish"; reads "Submitting…" while the submit promise is in flight
- **Disabled when:** `!isValid(values)` for the current step, OR `submitting === true`
- **Action:** `goNext()` — advances to the next active step, or (on the last step) invokes `onSubmit(values)` and awaits it. A `submittingRef` guard prevents double-submission from rapid double-clicks (lines 456, 463-464)
- **Loading state:** label "Submitting…", button implicitly disabled by the `submitting` flag; icon hidden while submitting (line 697)

## MPA-BTN-00-004 — Save & Exit
- **Role:** secondary
- **Visible on:** **every step, including Payment** — confirmed no `hideSaveExitFrom` mechanism exists (see MPA-SCN catalogue for the Payment-step asymmetry this creates against Abandon)
- **Action (GuidedActivationWizard.tsx:490-512):**
  1. Read current step's key
  2. If `draftOrderId` already set (this journey was already saved once), `mockDataEngine.update('orders', draftOrderId, { draftStepKey, draftValues })`
  3. Else `mockDataEngine.create('orders', { orderId: 'ORD-'+timestamp, orderType: title, status: 'Draft', draftWizardId, draftResumePath: location.pathname, draftStepKey, draftValues })`
  4. Clear in-memory draft (`clearDraft(wizardId)`)
  5. Call `onSaveExit()` → `navigate(POST_EXIT_DESTINATION)` (`'/'` — explicitly a placeholder pending business confirmation, NewPostpaidWizard.tsx:31-38)
- **No confirmation prompt** — Save & Exit executes immediately on click, unlike Abandon

## MPA-BTN-00-005 — Abandon Order
- **Role:** destructive
- **Visible when:** `onAbandon` provided (always, for this journey) AND (`hideAbandonFrom` index === -1 OR `currentIndex < hideAbandonFromIndex`). NewPostpaidWizard sets `hideAbandonFrom="payment"`, so this button is present on Contact through CAF, and **disappears the instant the Payment step is reached** (GuidedActivationWizard.tsx:125-126, 285-286, 667)
- **Action:** opens MPA-SCR-11 confirmation modal
- **On confirm (lines 473-478):** if `draftOrderId` exists, `mockDataEngine.remove('orders', draftOrderId)`; clear in-memory draft; close modal; `onAbandon()` → `navigate(POST_EXIT_DESTINATION)` (`'/'`)

## MPA-NAV-001 — Draft resume
Not part of the wizard shell's own UI, but its mechanism: on mount, `NewPostpaidWizard`/`GuidedActivationWizard` checks `location.state.resumeOrderId` (GuidedActivationWizard.tsx:199-230). If set: fetch the order record, read `draftStepKey`/`draftValues`, resolve the step key to an index against the *currently active* step list (in case skip logic differs from when it was saved), hydrate the draft, and replace the history entry so a page refresh doesn't re-trigger resume. Entry point confirmed at `src/workspace/tasks/TaskListView.tsx:122`: `navigate(order.draftResumePath, { state: { resumeOrderId: order.orderId } })` — the "My Tasks" workspace is where a saved draft is found and resumed; there is no resume affordance inside the wizard itself.

## MPA-NAV-002 — `location.state.startFresh`
If set, clears any previous in-progress draft before mounting (GuidedActivationWizard.tsx:233) — used when a fresh journey is explicitly started (e.g. "Start Another Activation" on the confirmation screen calls `setConfirmedOrder(null)`, which unmounts/remounts the wizard fresh; this is a local component-state reset rather than a `startFresh` navigation, so `startFresh` itself is used by whichever caller launches the journey the very first time from the journey catalogue — not confirmed to be explicitly set by the catalogue card in source read so far; flagged as a minor unverified point, non-blocking since the net behaviour — starting empty — is directly observable).

## No session-timeout handling in the wizard shell itself
Grep of `GuidedActivationWizard.tsx` found no timeout logic. The only session-expiry behaviour in this journey is `WinCashPaymentStep`'s own simulated "Simulate session expiry (test)" affordance (MPA-SCR-09), which is scoped to that one step and not a wizard-wide session timeout.

## No analytics/tracking instrumentation
Grep of `GuidedActivationWizard.tsx`, `NewPostpaidWizard.tsx`, and every step component under `src/components/patterns/` and `src/components/domain/` used by this journey for `track(`, `analytics`, `logEvent`, `trackEvent` returned no matches. **This journey emits no analytics events.** The `customer-activities` record written on submission (MPA-INT catalogue) is a business audit record, not telemetry.

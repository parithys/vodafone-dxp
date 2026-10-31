# MPA-SCR-09 — Payment

Route: step 9 of 9 in the wizard rail (key `payment`), the last step — the wizard's Continue button reads "Save & Finish" here. Component: `WinCashPaymentStep` (`src/components/patterns/WinCashPaymentStep.tsx`, full file, 172 lines), wired at `NewPostpaidWizard.tsx:503-531`.

## 9.1 Purpose
Hand the agent off to the external WinCash cash-drawer terminal to actually collect payment, then let the agent self-report the outcome back into DXP (there is no live connection between DXP and WinCash — see §9.11). On a self-reported success, the step auto-submits the entire order.

## 9.2 Entry / exit conditions
- **Entry:** reached only once the CAF step's `isValid` is satisfied (§8.2) — subject to MPA-SCR-08's MPA-BR-032 discrepancy, meaning entry to this step does not strictly guarantee a captured signature for a Touch-Screen-detected CAF.
- **Exit (Continue/"Save & Finish" enabled) — `isValid`** (`NewPostpaidWizard.tsx:523`): `Boolean(payment?.paid)`.
- **Auto-submit:** `autoAdvanceWhen: (values) => Boolean(payment?.paid)` (`NewPostpaidWizard.tsx:530`) — the moment `paid` flips true, the wizard's generic auto-advance effect calls `goNext()` without waiting for a manual Continue click. Since this is the last step, `goNext()` on this step invokes `onSubmit(values)` directly (`GuidedActivationWizard.tsx:451-465`), submitting the order and transitioning the screen to MPA-SCR-10 (Confirmation).

## 9.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-09-ST01 | Idle — payment not started | Fresh arrival at Payment, `value = {}` |
| MPA-SCR-09-ST02 | Handoff in progress | Click "Continue in WinCash" |
| MPA-SCR-09-ST03 | Returning to DXP (processing) | Click either return button during the 500 ms `processing` delay |
| MPA-SCR-09-ST04 | Paid | `returnFromWinCash('success')` resolves |
| MPA-SCR-09-ST05 | Declined (idle, post-decline) | `returnFromWinCash('decline')` resolves |
| MPA-SCR-09-ST06 | Retry-in-progress after decline | Click "Retry in WinCash" from ST05 |
| MPA-SCR-09-ST07 | Session expired | Click "Simulate session expiry (test)" while in handoff |
| MPA-SCR-09-ST08 | Session-expiry resume → paid | `resumeAfterSessionExpiry(true)` from ST07 |
| MPA-SCR-09-ST09 | Session-expiry resume → back to idle (not declined) | `resumeAfterSessionExpiry(false)` from ST07 |
| MPA-SCR-09-ST10 | Auto-advance transition | Instant — the render between `paid` flipping true and the screen replacing itself with MPA-SCR-10 |

## 9.4 UI elements and content
- **Amount Due card** (always visible, `border-border-soft bg-surface`): label `"Amount Due (WinCash)"`, value `"QR {amountDueQAR}"` — `amountDueQAR` is `values.checkoutTotals.dueTodayQar`, the exact same figure Checkout computed and displayed (`NewPostpaidWizard.tsx:513-514`), not re-derived from a raw sticker price.
- **Paid state:** `Badge variant="success"` reading `"Paid"`, plus `"Reference: {value.reference}"`.
- **Session-expired state** (danger-tinted card): `Badge variant="danger"` reading `"Session expired"`; body text verbatim: *"Your DXP session timed out while you were completing this payment in WinCash. If the payment actually went through there, confirm it below to record it and continue - otherwise, try again."*; two buttons (§9.6).
- **Handoff state** (accent-tinted card): `Badge variant="filled-neutral"` reading `"Continue in WinCash"`; body text verbatim: *"DXP cannot access the cash drawer directly - complete this payment on the WinCash terminal, then come back here."*; two return buttons plus a muted test-only link (§9.6).
- **Idle/declined state:** if `value.declined`, a danger-tinted banner with `Badge variant="danger"` reading `"Payment declined"` and body text verbatim: *"WinCash declined the authorization. Retry the same amount, or take payment by another method."*; below it, a single primary button whose label depends on `value.declined` (§9.6).

## 9.5 Field specifications
This step has no agent-entered form fields — every value in `WinCashPaymentValue` (`paid`, `reference`, `declined`, `handoffStarted`, `sessionExpired`) is set exclusively by the step's own button handlers, never typed in.
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-09-001 | Amount Due (WinCash) | Read-only display | Yes | No | `values.checkoutTotals.dueTodayQar`, falls back to `0` if `checkoutTotals` is undefined | n/a |
| MPA-FLD-09-002 | Payment reference | Read-only display | Only once paid | No | Demo-generated `` `WC-${Date.now().toString().slice(-8)}` `` — **not a real payment-gateway reference**, see §9.8/§9.11 | n/a |

## 9.6 Buttons and actions
For shared wizard-chrome buttons (Back/Continue/Save & Exit/Abandon), see [00-wizard-shell.md](00-wizard-shell.md). **Abandon is HIDDEN from Payment onward** (`hideAbandonFrom="payment"`) — confirmed directly against `GuidedActivationWizard.tsx:667` (`{onAbandon && !abandonHidden && (...)}`). **Save & Exit is NOT hidden here or on any later step** — confirmed directly against `GuidedActivationWizard.tsx:649` (`{onSaveExit && (...)}`, no `abandonHidden`/`hideAbandonFrom` condition anywhere near it). This asymmetry is deliberate per the code's own comment (`NewPostpaidWizard.tsx:156-159`): Abandon is withdrawn once WinCash may already hold the transaction outside DXP's reach, while Save & Exit remains because a signed-but-unpaid order is exactly the kind of thing an agent needs to be able to set aside and come back to.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-09-001 | "Continue in WinCash" (idle, not declined) | Primary | Always, in idle/not-declined state | `beginHandoff()` → sets `handoffStarted: true, declined: false, sessionExpired: false` |
| MPA-BTN-09-002 | "Retry in WinCash" (idle, declined — same button, relabelled) | Primary | Always, in idle/declined state | Same handler as 09-001, `beginHandoff()` |
| MPA-BTN-09-003 | "Payment completed in WinCash" / "Returning to DXP…" while processing | Primary | Not `processing` | `returnFromWinCash('success')` — 500 ms simulated delay, then sets `paid: true, declined: false, handoffStarted: false, sessionExpired: false, reference: 'WC-'+…` |
| MPA-BTN-09-004 | "Payment declined in WinCash" | Secondary (`ghost-rect`) | Not `processing` | `returnFromWinCash('decline')` — 500 ms delay, then sets `paid: false, declined: true, handoffStarted: false, sessionExpired: false` |
| MPA-BTN-09-005 | "Simulate session expiry (test)" | Tertiary text link | Not `processing` | `simulateSessionExpiry()` → sets `sessionExpired: true, handoffStarted: false` |
| MPA-BTN-09-006 | "Payment completed in WinCash - resume" | Primary | Always, in session-expired state | `resumeAfterSessionExpiry(true)` → sets `paid: true, declined: false, sessionExpired: false, handoffStarted: false, reference: 'WC-'+…` |
| MPA-BTN-09-007 | "It didn't complete - try again" | Secondary (`ghost-rect`) | Always, in session-expired state | `resumeAfterSessionExpiry(false)` → sets `paid: false, declined: false, sessionExpired: false, handoffStarted: false` (returns to plain idle, **not** the declined sub-state) |

## 9.7 User interactions
- Click "Continue in WinCash"/"Retry in WinCash" → immediate state change to handoff card, no delay
- Click either return button → button disables, label swaps to "Returning to DXP…" for ~500 ms (`setProcessing(true)` → `await new Promise(r => setTimeout(r, 500))` → `setProcessing(false)`), then the outcome state renders
- Click "Simulate session expiry (test)" → immediate state change to the session-expired card; no delay, no confirmation
- Click either session-expiry resume button → immediate state change, no delay
- The instant `value.paid` becomes `true`, the wizard's own effect (not this component) calls `goNext()` automatically, which — being the last step — submits the order and unmounts this step entirely in favour of MPA-SCR-10
- Keyboard: all controls are native `<button>` elements; standard tab order; Enter/Space activate the focused control

## 9.8 Business rules
- MPA-BR-033 — Amount due is read from Checkout's already-computed `checkoutTotals.dueTodayQar`, never re-derived from the number's raw sticker price (`NewPostpaidWizard.tsx:507-514`). The code's own comment notes this specifically avoids re-skipping BR-115's Star-number entitlement/overage logic, which a second independent derivation used to do.
- MPA-BR-034 — Auto-submit on success: "On successful WinCash confirmation, return to DXP, submit the order, and create the interaction activity" (2026-09-28 direction, `NewPostpaidWizard.tsx:524-530`) — the Return moment (`paid: true`) submits immediately via `autoAdvanceWhen`, since Payment is the wizard's last step and a manual Continue click here would only ever mean "submit" anyway.
- MPA-BR-035 — Payment reference is demo-generated (`` `WC-${Date.now().toString().slice(-8)}` ``), not issued by a real payment gateway or WinCash itself — see §9.11.
- MPA-BR-036 — Abandon/Save & Exit asymmetry (see §9.6) — confirmed directly against source for this file, not inherited from an unverified prior claim.

## 9.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| "Paid" badge + reference | `value.paid === true` | MPA-DP-063 |
| Session-expired card | `!paid && value.sessionExpired === true` | MPA-DP-064 |
| Handoff card | `!paid && !sessionExpired && value.handoffStarted === true` | MPA-DP-065 |
| Idle/declined card | `!paid && !sessionExpired && !handoffStarted` (default branch) | MPA-DP-066 |
| "Payment declined" banner (within idle card) | `value.declined === true` | MPA-DP-067 |
| "Retry in WinCash" vs "Continue in WinCash" label | `value.declined` | MPA-DP-068 |
| "Returning to DXP…" label swap on both return buttons | local `processing === true` | MPA-DP-069 |

## 9.10 Validation and error handling
This step has no field-level validation (§9.5) — its "errors" are step-level outcome states with fixed, non-editable recovery actions:
- MPA-VAL-012 — Decline message, verbatim: *"WinCash declined the authorization. Retry the same amount, or take payment by another method."* Recovery: click "Retry in WinCash" (MPA-BTN-09-002). "Take payment by another method" is stated in the message but **there is no in-app alternate-payment-method control on this step** — it is guidance for the agent to act on outside this screen, not a button.
- MPA-VAL-013 — Session-expiry message, verbatim: *"Your DXP session timed out while you were completing this payment in WinCash. If the payment actually went through there, confirm it below to record it and continue - otherwise, try again."* Recovery: two explicit choices (MPA-BTN-09-006/007), both genuine forward paths rather than a dead end — the code's own comment states this was a deliberate 2026-09-28 request ("show a clear recovery/error state").

## 9.11 Integration trigger points
Trigger point only — not a live integration in the current implementation.
- **MPA-INT-018 — WinCash cash-drawer handoff.** The component's own header comment (`WinCashPaymentStep.tsx:33-51`) states this explicitly: *"WinCash is an EXTERNAL system running the cash drawer, which this app was never able to reach - the step used to simulate the whole transaction in-app as if DXP itself were the POS. It now says so instead."* Concretely: "Continue in WinCash" (MPA-BTN-09-001) calls no external API — it only sets local component state and displays hand-off instructions. "Payment completed/declined in WinCash" (MPA-BTN-09-003/004) do not poll, subscribe to a webhook, or query any WinCash system — they are the agent **self-reporting** an outcome that happened on a separate physical terminal DXP cannot see. "Simulate session expiry (test)" (MPA-BTN-09-005) is an explicit UI-only test affordance, not a simulation of a real timeout detector — the same comment block states plainly: *"there is no session-timeout mechanism anywhere in this app (authStore is persistence-only, per its own note) to hook a real detector into."*
- MPA-INT-019 — `createRecord('orders', {...})` and `createRecord('customer-activities', {...})` in `onSubmit` (`NewPostpaidWizard.tsx:626-647, 654-661`) — writes to the local mock entity store (`useEntityStore`), not a real order-management or CRM back end.

## 9.12 Navigation behaviour
- MPA-NAV-018 — Auto-submit: `autoAdvanceWhen(paid === true)` calls `goNext()` automatically; being the final step, this invokes `onSubmit(values)` directly and — on success — replaces the wizard render with `OrderConfirmationScreen` (MPA-SCR-10), since `NewPostpaidWizard` sets `confirmedOrder` state rather than routing to a new URL.
- MPA-NAV-019 — Manual fallback: the wizard's own Continue/"Save & Finish" button remains clickable once `isValid` is satisfied (i.e. once `paid === true`), for the edge case where auto-advance has not already fired by the time the agent looks at the screen; a `submittingRef` guard (`GuidedActivationWizard.tsx:456-464`) prevents a double-submit from a rapid double-click.

## 9.13 Related edge cases
- MPA-SCN-039 — Happy path: Continue in WinCash → Payment completed in WinCash → auto-submits.
- MPA-SCN-040 — Decline-then-succeed loop: decline → Retry in WinCash → Payment completed → auto-submits.
- MPA-SCN-041 — Repeated decline: the decline→retry loop has no attempt cap — an agent can cycle it indefinitely; no lockout or escalation exists in this component.
- MPA-SCN-042 — Session expiry, resumed as completed: handoff → Simulate session expiry → "Payment completed in WinCash - resume" → `paid: true`, auto-submits with a freshly generated reference (the reference is generated at resume time, not carried over from any real WinCash transaction record, since none exists).
- MPA-SCN-043 — Session expiry, resumed as not completed: handoff → Simulate session expiry → "It didn't complete - try again" → returns to **plain idle**, not the declined sub-state (`declined` is explicitly set `false`), so the next primary button reads "Continue in WinCash," not "Retry in WinCash."
- MPA-SCN-044 — Save & Exit remains available through this entire step (§9.6) even once locked by CAF's `locksAfter` (MPA-SCR-08 §8.2) — an agent can save a signed-but-unpaid draft and resume it later via the "My Tasks" draft-resume mechanism documented in [00-wizard-shell.md](00-wizard-shell.md) MPA-NAV-001.
- MPA-SCN-045 — Double-submit guard: `submittingRef` in `GuidedActivationWizard.goNext()` prevents a second `onSubmit` call if the agent clicks Continue/Save & Finish again while a prior submission is still in flight.

## 9.14 Persona-specific behaviour
None found conditional on role within this screen's own component (`WinCashPaymentStep.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.

## 9.15 Accessibility
To be completed live in Phase 12.

## 9.16 Source references
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:503-531` (step wiring, `isValid`, `autoAdvanceWhen`, `amountDueQAR` sourcing)
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:541-686` (`onSubmit` — order/activity persistence, `pendingApproval` computation, cross-referenced fully in MPA-SCR-10)
- `src/components/patterns/WinCashPaymentStep.tsx` (full file — state machine, all button handlers, the component's own explanatory comment on WinCash's external nature)
- `src/components/patterns/GuidedActivationWizard.tsx:451-465` (`goNext`/submit flow), `:649` (Save & Exit, unconditional), `:667` (Abandon, `!abandonHidden`-gated), `:125-126,285-286` (`hideAbandonFrom`/`abandonHidden` computation)

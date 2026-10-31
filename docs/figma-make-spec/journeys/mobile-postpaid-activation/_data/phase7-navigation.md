# Phase7 Navigation

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.12

MPA-NAV-003 (Continue → Address, auto-skipped), MPA-NAV-004 (Proceed to Approval → Address, bypassing isValid), MPA-NAV-005 (Switch to Prepaid → external journey, terminal for this journey). Standard shell nav in [00-wizard-shell.md](00-wizard-shell.md).


## MPA-SCR-02 Communication Address — §2.12

- MPA-NAV-006 — Unconditional auto-advance: on first forward arrival at this step, `autoAdvanceWhen` returns true immediately, firing `GuidedActivationWizard`'s auto-advance effect (`GuidedActivationWizard.tsx:437-449`) and calling `goNext()` to Billing Profile without agent action, on every run of this journey (`NewPostpaidWizard.tsx:285`).
- MPA-NAV-007 — Rail re-entry: clicking "Communication Address" in the rail after the skip (allowed once `maxReached` ≥ its index — MPA-BTN-00-001 in [00-wizard-shell.md](00-wizard-shell.md)) opens the real form; the `autoAdvancedRef` guard (`GuidedActivationWizard.tsx:441-444`) prevents the effect from re-firing, so this visit behaves like any ordinary step (Continue still always enabled per §2.2).


## MPA-SCR-03 Billing Profile — §3.12

- MPA-NAV-008 — Continue → Plan & Add-ons, gated by `isBillingAccountValid()` (`NewPostpaidWizard.tsx:319`); no auto-advance defined on this step (§3.2).
- MPA-NAV-009 — "+ Add" opens the Billing Profile Setup drawer (MPA-SCR-13) as an in-place overlay, not a route/step change (`BillingAccountStep.tsx:472-475, 501-506`); closing or saving it returns to this same step with `newAccount` patched.


## MPA-SCR-04 Plan & Add-ons — §4.12

MPA-NAV-010 (Continue → Number Selection, standard). MPA-NAV-011 (selecting a `preBundledOffer` plan → auto-advance directly to Number Selection, bypassing the rest of this step for that session — rail click-back re-opens the real unfilled Add-ons/Discounts panels per the shared shell's own note in [00-wizard-shell.md](00-wizard-shell.md)). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged.


## MPA-SCR-05 Number Selection — §5.12

MPA-NAV-012 (Continue → SIM Type, standard). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged; no step-specific auto-advance/auto-skip exists on Number Selection itself (contrast with Plan & Add-ons' pre-bundled auto-advance and SIM Type's Physical auto-advance).


## MPA-SCR-06 SIM Type — §6.12

MPA-NAV-013 (Physical, valid → auto-advance to Checkout, no Continue click required). MPA-NAV-014 (eSIM, issued → manual Continue to Checkout, no auto-advance). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged.


## MPA-SCR-07 Checkout — §7.12

- MPA-NAV-015 — Edit button → `goToStepKey('plan')`, jumps directly to Plan & Add-ons (bypassing Number/SIM Type without discarding their values)
- MPA-NAV-016 — Continue → CAF & Signature (MPA-SCR-08), always available (`isValid: () => true`)


## MPA-SCR-08 CAF & Signature — §8.12

- Back is hidden once `locksAfter` fires (i.e. once `isValid`'s predicate is satisfied for the first time — see MPA-BR-029 for exactly when that is per device type)
- Rail stops accepting clicks for the same reason, even for previously-reached steps
- No "Edit"-style jump-back exists on this screen (unlike Checkout's MPA-BTN-07-001)
- MPA-NAV-017 — Continue → Payment (MPA-SCR-09), gated by §8.2's `isValid`


## MPA-SCR-09 Payment — §9.12

- MPA-NAV-018 — Auto-submit: `autoAdvanceWhen(paid === true)` calls `goNext()` automatically; being the final step, this invokes `onSubmit(values)` directly and — on success — replaces the wizard render with `OrderConfirmationScreen` (MPA-SCR-10), since `NewPostpaidWizard` sets `confirmedOrder` state rather than routing to a new URL.
- MPA-NAV-019 — Manual fallback: the wizard's own Continue/"Save & Finish" button remains clickable once `isValid` is satisfied (i.e. once `paid === true`), for the edge case where auto-advance has not already fired by the time the agent looks at the screen; a `submittingRef` guard (`GuidedActivationWizard.tsx:456-464`) prevents a double-submit from a rapid double-click.


## MPA-SCR-10 Order Confirmation — §10.12

- MPA-NAV-020 — View Order → `navigate()` to the Order Approval Detail screen, leaving this journey entirely
- MPA-NAV-021 — Start Another Activation → `setConfirmedOrder(null)`, a component-state reset (not a route navigation); `NewPostpaidWizard` remounts its wizard branch with an empty draft. This is distinct from the `location.state.startFresh` mechanism documented in [00-wizard-shell.md](00-wizard-shell.md) MPA-NAV-002, which concerns the very first external launch of the journey, not this in-place reset.
- MPA-NAV-022 — Back to Dashboard → `navigate(DASHBOARD_ROUTE)`, `DASHBOARD_ROUTE = '/'` (`NewPostpaidWizard.tsx:49`) — per the code's own comment, this is a **confirmed** destination (the button says "Dashboard" and `'/'` routes to `<Dashboard />`), in contrast to `POST_EXIT_DESTINATION` (also currently `'/'`, used by Save & Exit/Abandon mid-journey) which the code explicitly flags as an unconfirmed placeholder pending business decision (`NewPostpaidWizard.tsx:31-38`). The two constants currently share the same value but are conceptually distinct and independently changeable.


## MPA-SCR-11 Abandon Confirmation Modal — §11.12

MPA-NAV-023 — On confirm, navigates to `POST_EXIT_DESTINATION` (`'/'`), the same destination as Save & Exit — a named constant in `NewPostpaidWizard.tsx:31-38` explicitly flagged in a code comment as "Placeholder pending business confirmation... Do not assume Agent 360 as the destination."


## MPA-SCR-12 Eligibility Checks Drawer — §12.12

None — this is a non-navigating overlay.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.12

None — non-navigating overlay.


## MPA-SCR-14 Signature Pad Drawer — §14.12

Closing on "Done" returns to the CAF screen, now showing the "Signed" badge and a thumbnail of the captured signature; the step's `customerFacing` flag flips to false at this same moment (see MPA-SCR-08 §8.9), restoring the normal wizard chrome (rail, Back/Continue footer) the customer-facing render had hidden.


## MPA-SCR-15 Plan Details Drawer — §15.12

Non-navigating overlay; closing returns to MPA-SCR-04 with selection state unchanged.

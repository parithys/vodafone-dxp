# Phase9 Personas

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.14

None found conditional on role within this screen's own components (preliminary — Phase 9 will grep exhaustively). All 5 granted roles see identical Contact-step behaviour.


## MPA-SCR-02 Communication Address — §2.14

None found. `ZsbAddressStep` and `FibreReadinessBanner` take no role/persona prop and contain no persona-conditional logic anywhere in either file (confirmed by full-file read). Preliminary — Phase 9 will re-verify exhaustively across the whole journey, including whether any role's navigation/visibility config affects reachability of this step itself (not the step's own content).


## MPA-SCR-03 Billing Profile — §3.14

None found. `BillingAccountStep` and `BillingProfileSetupDrawer` take no role/persona prop and contain no persona-conditional logic anywhere in either function (confirmed by full-file read of `BillingAccountStep.tsx`). Preliminary — Phase 9 will re-verify exhaustively.


## MPA-SCR-04 Plan & Add-ons — §4.14

None found conditional on role within `PostpaidPlanAddonsStep.tsx`, `AddonsPicker.tsx`, or `BillLimitEditor.tsx` (preliminary — Phase 9 will grep exhaustively). The Bill Limit agent-minimum thresholds (BR-226/227) apply uniformly to whichever role reaches this step; no role-gated bypass was found in source.


## MPA-SCR-05 Number Selection — §5.14

The Reserved tab is inherently agent-identity-scoped: `myReserved` filters `numbers.json` by `reservedBy === agentName`, where `agentName` is the signed-in identity's display name from `useAuthStore`. This is not a role-based branch (no `PersonaCapability` or role-id check found in `MsisdnPicker.tsx`) but a data-scoping behaviour that differs by *which agent* is signed in — every one of the 26 roles sees the same component logic, but the Reserved tab's contents differ per the signed-in identity's own holds in `numbers.json`. Confirmed for ROLE-01 (Fatima Al-Kuwari) per §5.13; not yet checked against every other role's bound identity (preliminary — Phase 9 will verify exhaustively).


## MPA-SCR-06 SIM Type — §6.14

None found conditional on role within `SimTypeStep.tsx` or `SimSerialScanner.tsx` (preliminary — Phase 9 will grep exhaustively). All 5 granted roles see identical SIM Type behaviour; the simulated inventory check (`sims.json`) is not scoped by store/agent identity in source.


## MPA-SCR-07 Checkout — §7.14

None found conditional on role within this screen's own component (`CheckoutSummaryStep.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.


## MPA-SCR-08 CAF & Signature — §8.14

None found conditional on role within this screen's own component (`CafSignatureCapture.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.


## MPA-SCR-09 Payment — §9.14

None found conditional on role within this screen's own component (`WinCashPaymentStep.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.


## MPA-SCR-10 Order Confirmation — §10.14

None found conditional on role within this screen's own components (`OrderConfirmationScreen.tsx`, `EsimActivationPanel.tsx`) — heading text, receipt rows, and all three exit actions render identically regardless of the agent's role. Preliminary; Phase 9 will grep exhaustively across the granted-role set.


## MPA-SCR-11 Abandon Confirmation Modal — §11.14

None found.


## MPA-SCR-12 Eligibility Checks Drawer — §12.14

None found.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.14

None found.


## MPA-SCR-14 Signature Pad Drawer — §14.14

None found.


## MPA-SCR-15 Plan Details Drawer — §15.14

None found.

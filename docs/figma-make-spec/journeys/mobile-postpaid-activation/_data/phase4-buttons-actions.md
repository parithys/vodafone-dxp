# Phase4 Buttons Actions

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-01-001 | Fetch / scan trigger | Primary (within IdLookupStep) | ID number present, or scan hardware event fires | Runs MOI lookup against `identity-documents.json` → `customers.json` → (if `companyName`) `enterprise-accounts.json` |
| MPA-BTN-01-002 | "View eligibility checks" | Tertiary/link, footer-left | `eligibility` result is set | Opens MPA-SCR-12 drawer |
| MPA-BTN-01-003 | "Proceed to Approval" | Primary (eligibility panel) | `!hardStop && !softStop` AND 1+ checks are `approval-routing` | Calls `goNext()` directly (bypasses `isValid`) |
| MPA-BTN-01-004 | "Switch to Prepaid" | Secondary (eligibility panel) | `softStop === true` (collections block only) | Navigates to `/mobile-prepaid/new-prepaid-tablet-step-1-contact-id-capture`, leaving this journey with no order created |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Back disabled (first step); Continue per §1.2 gate | — |


## MPA-SCR-02 Communication Address — §2.6

This component renders **no buttons of its own** — the evidenced Save Address / Skip Address / Go back / Cancel row was removed 2026-09-26 (`ZsbAddressStep.tsx:88-95`), and nothing replaced it since every field already writes on change.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Back enabled; Continue always enabled (§2.2) | — |


## MPA-SCR-03 Billing Profile — §3.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-03-001 | Existing account card | Selectable card/button | Always (per rendered card) | `onChange({ selectedProfileId: p.billingProfileId, creatingNew: false })` — mutually exclusive with Create New (`BillingAccountStep.tsx:292`) |
| MPA-BTN-03-002 | "[+]/[-] Create New Billing Account" | Toggle/disclosure | Only rendered when **not** at Consumer cap (§3.9 MPA-DP-012) | Toggles `creatingNew`, clears `selectedProfileId` (`BillingAccountStep.tsx:326`) |
| MPA-BTN-03-003 | "+ Add" (Billing Profile Setup) | Ghost/compact | Always, within Create New | Opens `BillingProfileSetupDrawer` (MPA-SCR-13) — full button/field spec lives in that screen's own file, not repeated here |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §3.2 gate | — |


## MPA-SCR-04 Plan & Add-ons — §4.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-04-001 | Plan-group / Add-ons / Eligible Discounts tab buttons | Tab/navigational | Always (tab only renders if its plan group is non-empty for group tabs) | `setActiveTab(key)` — switches which panel is showing; never changes selection state |
| MPA-BTN-04-002 | Type-ahead suggestion row | List option | Query non-empty, `searchOpen` | Sets `selectedProductId`, fills the search box with the plan name, closes the dropdown |
| MPA-BTN-04-003 | Plan details chevron (per card) | Icon button, `aria-label="View details for {name}"` | Always, per plan card | Opens Plan Details drawer (MPA-SCR-15) for that plan |
| MPA-BTN-04-004 | "Edit Bill Limit" | Ghost/tertiary | Not already editing | Opens the Bill Limit inline editor |
| MPA-BTN-04-005 | −50 / +50 steppers | Ghost, compact | Editing mode | Adjusts the draft value by ±50, floored at 0 |
| MPA-BTN-04-006 | "Apply" (Bill Limit) | Primary | Editing mode, draft parses as a number | Runs BR-AGENT-MIN-THRESHOLD, calls `onBillLimitChange(amount, pass)`, closes editor |
| MPA-BTN-04-007 | "Browse…" (proof document) | Ghost-rect | Only shown when no document is yet attached, and discount requires a supporting ID | Opens native file picker; on selection runs the 5 MB size check |
| MPA-BTN-04-008 | "Remove" (proof document) | Text link | A document is attached | Clears `discountProofDocument` |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §4.2 gate | — |


## MPA-SCR-05 Number Selection — §5.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-05-001 | Tab buttons (Free/Star/Reserved) | Tab/navigational | Always | `setTab(t)`; also resets `page` to 0 |
| MPA-BTN-05-002 | Number card (any) | Selectable card, full-card click target | Always for every listed row (no disabled state — only `AVAILABLE` or the agent's own `Reserved` rows are ever listed) | `onSelect(n.msisdn, n.priceQAR)` — sets `values.msisdn`/`values.numberPriceQAR` |
| MPA-BTN-05-003 | "Previous" / "Next" | Ghost, compact | Previous: `safePage > 0`; Next: `safePage < pageCount - 1` | Paginates the current tab's filtered/sorted list, 10 rows per page |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §5.2 gate | — |


## MPA-SCR-06 SIM Type — §6.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-06-001 | Barcode-scan trailing icon (SIM Serial field) | Icon button, `aria-label="Scan SIM barcode"` | Not currently scanning or checking | Runs a simulated scan: picks the first `sims.json` record with `stockStatus !== 'Issued'`, waits ~600 ms, fills the field, then runs the same validation as manual entry (`SimSerialScanner.tsx:101-114`) |
| MPA-BTN-06-002 | "Select eSIM" | Primary | `!issuing` | `generateEsim()` — 500 ms simulated delay, then sets `simType: 'eSIM', esimIssued: true, esimActivationCode: <generated>` |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §6.2 gate | Continue is effectively bypassed on the Physical path by auto-advance; remains the only forward control on the eSIM path |


## MPA-SCR-07 Checkout — §7.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-07-001 | Edit | Secondary (`ghost-rect`, compact) | Always | `goToStepKey('plan')` (`NewPostpaidWizard.tsx:446`) |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | — | Continue always enabled (`isValid: () => true`) | See [00-wizard-shell.md](00-wizard-shell.md) |


## MPA-SCR-08 CAF & Signature — §8.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-08-001 | Please Sign | Primary | Always (while unsigned) | Opens the Signature Pad drawer (MPA-SCR-14) |
| MPA-BTN-08-002 | Browse… | Secondary (`ghost-rect`) | `label.trim()` non-empty AND < 10 documents attached | Opens native file picker; on selection, validates size and appends to `additionalDocuments` |
| MPA-BTN-08-003 | Remove document (trash icon) | Tertiary, per row | Always, per attached document | Removes that document from `additionalDocuments` |
| MPA-BTN-08-004 | "View Full Terms & Conditions" | Link | `termsUrl` provided (always, for this journey) | Opens `termsUrl` in a new tab (`target="_blank" rel="noreferrer"`) |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | — | Back hidden once locked; Continue per §8.2's `isValid` (subject to the MPA-BR-029 discrepancy) | See [00-wizard-shell.md](00-wizard-shell.md). Abandon is still visible on this step (it disappears only from Payment onward — `hideAbandonFrom="payment"`) but is functionally moot once `locksAfter` fires, since Back/rail are already frozen at that point. |


## MPA-SCR-09 Payment — §9.6

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


## MPA-SCR-10 Order Confirmation — §10.6

**This screen renders entirely outside `GuidedActivationWizard`** — none of the shared wizard-chrome buttons documented in [00-wizard-shell.md](00-wizard-shell.md) (Back/Continue/Save & Exit/Abandon, rail) exist here.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-10-001 | View Order | Primary (`primary-rect`) | Always | `navigate(`/order-management/order-approval-detail-attachments-order-details-activities-a?id=${orderId}`)` — leaves this journey |
| MPA-BTN-10-002 | Start Another Activation | Secondary (`secondary-rect`) | Always | `setConfirmedOrder(null)` — component-state reset; `NewPostpaidWizard` remounts its wizard branch fresh, in place, no route change |
| MPA-BTN-10-003 | Back to Dashboard | Secondary (`secondary-rect`) | Always | `navigate(DASHBOARD_ROUTE)` — `DASHBOARD_ROUTE = '/'` (`NewPostpaidWizard.tsx:49`), routes to `<Dashboard />` per the app router; per the code's own comment this is a *confirmed* destination, unlike the placeholder below |
| MPA-BTN-10-004 | Send to email | Secondary (`secondary-rect`) | `!sending && canSend` (`canSend = Boolean(email) && verified`) | `sendEmail()` — 500 ms simulated delay, sets local `sentTo`, pushes a success toast; label reads `"Sending…"` while in flight |


## MPA-SCR-11 Abandon Confirmation Modal — §11.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-11-001 | "Keep working" | Ghost/tertiary | Always | Closes the modal, no side effect (`setAbandonOpen(false)`) |
| MPA-BTN-11-002 | "Abandon Order" | Primary/destructive | Always | Executes `abandonOrder()`: if `draftOrderId` exists, deletes that order record via `mockDataEngine.remove('orders', draftOrderId)`; clears in-memory draft; closes modal; calls `onAbandon()` → navigates to `POST_EXIT_DESTINATION` (`/`) |


## MPA-SCR-12 Eligibility Checks Drawer — §12.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-12-001 | Drawer close (×) | Tertiary | Always | Closes drawer, returns focus to the triggering link (standard Drawer behavior, not independently re-verified) |


## MPA-SCR-13 Billing Profile Setup Drawer — §13.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-13-001 | "Save" | Primary | `profileName.trim()` is non-empty | Calls `onSave({ profileName: trimmed, billMedia, billingSchedule })`, then closes the drawer |


## MPA-SCR-14 Signature Pad Drawer — §14.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-14-001 | "Done" | Primary | Presumed always enabled (not confirmed whether disabled on an empty canvas — flagged for live verification) | Captures canvas as data URL, calls `onDone(dataUrl)`, which sets `caf.signatureDataUrl` on the parent step and closes the drawer |
| MPA-BTN-14-002 | "Clear" | Secondary | Presumed always enabled | Resets the canvas without closing the drawer |


## MPA-SCR-15 Plan Details Drawer — §15.6

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-15-001 | Drawer close | Tertiary | Always | Closes (`setDetailPlan(null)`) |
| MPA-BTN-15-002 | Chevron/details trigger (on each plan card, MPA-SCR-04) | Tertiary | Always, one per visible plan card | Opens this drawer for that plan (`setDetailPlan(plan)`) — documented here for completeness; visually lives on MPA-SCR-04 |

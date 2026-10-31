# Phase10 Integration Triggers

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.11

- MPA-INT-001 — MOI identity lookup (trigger point only, see Phase 10)
- MPA-INT-002 — Eligibility check evaluation (trigger point only, reads multiple mock collections)


## MPA-SCR-02 Communication Address — §2.11

- MPA-INT-003 — MOI-linked address lookup: `identity-documents` (match `documentNumber === idNumber`) → `addresses` (match `customerId` + `primaryStatus === 'Primary'` + `activeFlag`) (`ZsbAddressStep.tsx:130-152`). Trigger point only — not a live integration.
- MPA-INT-004 — Area/Kahramaa suggestion list load: `kid-address-records` + `addresses` read on mount to build `areaOptions` (`ZsbAddressStep.tsx:113-123`). Trigger point only — not a live integration.
- MPA-INT-005 — Fibre readiness lookup: `ims-site-zsb` read on mount, matched client-side against the typed Zone/Street/Building (`FibreReadinessBanner.tsx:52-53, 63-65`). Trigger point only — not a live integration.


## MPA-SCR-03 Billing Profile — §3.11

- MPA-INT-006 — Existing billing data load: on `customerId` change, reads `accounts`, `billing-profiles`, `customer-contacts`, `customers` in parallel, filters `accounts`/`customer-contacts` to the current `customerId`, joins each owned account to its `billing-profiles` row, and reads the customer's own `segment` (`BillingAccountStep.tsx:224-245`). Trigger point only — not a live integration.
- MPA-INT-007 — Card tokenization simulation ("Gatan gateway simulation" — demo label, no real gateway, see MPA-BR-010) (`BillingAccountStep.tsx:120-128`). Trigger point only — not a live integration.
- MPA-INT-008 — Order submission write-through: on final wizard submit, `billingProfileId` (Path A) or `newBillingProfileName`/`billCardLast4` (Path B) are written onto the new `orders` record (`NewPostpaidWizard.tsx:621-641`). **This is a trigger point only, and notably a partial one:** the submission does **not** write any new record into the `accounts` or `billing-profiles` mock-data collections themselves — confirmed by reading the full `onSubmit` handler (`NewPostpaidWizard.tsx:541-686`), which calls `createRecord` only for `'orders'` and `'customer-activities'`. A billing account created via Path B is therefore recorded only as free-text fields on the order, and never becomes a real selectable account for that customer in any later journey run within this build.


## MPA-SCR-04 Plan & Add-ons — §4.11

- MPA-INT-009 — Product/plan catalogue read (trigger point only — `mockDataEngine.list('products')`, filtered to `type === 'Postpaid Plan'` and `type === 'Add-on'`, `PostpaidPlanAddonsStep.tsx:264-269`)
- MPA-INT-010 — Discount catalogue read (trigger point only — `mockDataEngine.list('addons-discounts')`, filtered to `category === 'Discount'` and `planId === selectedProductId`, re-run on every plan change, `:271-279`)


## MPA-SCR-05 Number Selection — §5.11

- MPA-INT-011 — MSISDN inventory read (trigger point only — `mockDataEngine.list('numbers')`, `MsisdnPicker.tsx:180-182`)


## MPA-SCR-06 SIM Type — §6.11

- MPA-INT-012 — SIM inventory read/validate (trigger point only — `mockDataEngine.list('sims')`, called both from the scan action and from blur-validation, `SimSerialScanner.tsx:76`, `:103`)
- MPA-INT-013 — eSIM activation code generation (trigger point only — local mock generator, no external SM-DP+/provisioning API call; explicitly not fabricated as a live integration per the component's own comment, `SimTypeStep.tsx:26-36`)


## MPA-SCR-07 Checkout — §7.11

Trigger point only — not a live integration in the current implementation.
- MPA-INT-014 — `mockDataEngine.list('products')` (`CheckoutSummaryStep.tsx:154`)
- MPA-INT-015 — `mockDataEngine.list('addons-discounts')` (`CheckoutSummaryStep.tsx:155-159`)
- MPA-INT-016 — `mockDataEngine.list('star-number-tiers')` (`CheckoutSummaryStep.tsx:160`)

All three read local static JSON under `public/mock-data/`; no network call, no external pricing/inventory service.


## MPA-SCR-08 CAF & Signature — §8.11

Trigger point only — not a live integration in the current implementation.
- MPA-INT-017 — `mockDataEngine.list('tnc-summary-bullets')` (`CafSignatureCapture.tsx:166`) — reads local static JSON, fires only when `autoDetectDeviceType` is set.


## MPA-SCR-09 Payment — §9.11

Trigger point only — not a live integration in the current implementation.
- **MPA-INT-018 — WinCash cash-drawer handoff.** The component's own header comment (`WinCashPaymentStep.tsx:33-51`) states this explicitly: *"WinCash is an EXTERNAL system running the cash drawer, which this app was never able to reach - the step used to simulate the whole transaction in-app as if DXP itself were the POS. It now says so instead."* Concretely: "Continue in WinCash" (MPA-BTN-09-001) calls no external API — it only sets local component state and displays hand-off instructions. "Payment completed/declined in WinCash" (MPA-BTN-09-003/004) do not poll, subscribe to a webhook, or query any WinCash system — they are the agent **self-reporting** an outcome that happened on a separate physical terminal DXP cannot see. "Simulate session expiry (test)" (MPA-BTN-09-005) is an explicit UI-only test affordance, not a simulation of a real timeout detector — the same comment block states plainly: *"there is no session-timeout mechanism anywhere in this app (authStore is persistence-only, per its own note) to hook a real detector into."*
- MPA-INT-019 — `createRecord('orders', {...})` and `createRecord('customer-activities', {...})` in `onSubmit` (`NewPostpaidWizard.tsx:626-647, 654-661`) — writes to the local mock entity store (`useEntityStore`), not a real order-management or CRM back end.


## MPA-SCR-10 Order Confirmation — §10.11

Trigger point only — not a live integration in the current implementation.
- MPA-INT-020 — "View Order" navigation to `/order-management/order-approval-detail-attachments-order-details-activities-a?id={orderId}` — an internal app route (Order Management module), not an external system call.
- MPA-INT-021 — `sendEmail()` in `EsimActivationPanel.tsx:47-54` — a 500 ms `setTimeout` simulation followed by a local success toast; **no real email-sending API or service is called.** Grep of `EsimActivationPanel.tsx` confirms no `fetch`/network call exists in this function.


## MPA-SCR-11 Abandon Confirmation Modal — §11.11

MPA-INT-022 — Draft order deletion (`mockDataEngine.remove('orders', draftOrderId)`). **Trigger point only — not a live integration in the current implementation.** Fires only if a draft was actually persisted (i.e., Save & Exit had been used at least once before Abandon); if the agent never saved, there is nothing to delete and this call is skipped implicitly (no `draftOrderId` to pass).


## MPA-SCR-12 Eligibility Checks Drawer — §12.11

None new — reuses MPA-INT-002 (eligibility evaluation)'s already-computed result; no re-fetch occurs on open.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.11

None — purely local state, patched into the parent step's in-memory form values on Save.


## MPA-SCR-14 Signature Pad Drawer — §14.11

None — signature capture is purely local (canvas → data URL), no external signing service.


## MPA-SCR-15 Plan Details Drawer — §15.11

None — uses the same in-memory `products` list already fetched for the Plan & Add-ons step (no separate fetch on open).

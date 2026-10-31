# Phase 12 — Accessibility

Journey: Mobile Postpaid Activation (MPA)
Method: source-read against commit `73c1fbb208b61acb983347c55f5bd713d89758d3`, plus live verification in the running dev server (port 5173, logged in as ROLE-01 / Fatima Al-Kuwari) for the items marked **[LIVE-VERIFIED]** below. All other implemented-behaviour claims are **[SOURCE-VERIFIED]** (read directly in code, not independently re-tabbed through in the browser for every one of the 15 screens/surfaces in this pass) — stated explicitly per the workflow's own distinction, not asserted as live-tested where it was not.

## MPA-A11Y-001 — Global: shared field primitives carry the app's accessibility wiring

Nearly every field across this journey's 9 steps is built from `src/components/primitives/Input.tsx`, `Select.tsx`, `Textarea.tsx`, `Autocomplete.tsx`, or `PhoneNumberInput.tsx` — not hand-rolled per screen. This is why most step-level files (`EligibilityGateStep.tsx`, `ZsbAddressStep.tsx`, `SimTypeStep.tsx`, `CheckoutSummaryStep.tsx`, `CafSignatureCapture.tsx`, `WinCashPaymentStep.tsx`, `OrderConfirmationScreen.tsx`) contain **zero** explicit `aria-*`/`role` attributes of their own [SOURCE-VERIFIED, grep across all 13 step/domain components] — the accessibility semantics are inherited from the primitive, not restated at each call site.

Confirmed in the primitives:
- **Label association**: every `Input`/`Select`/`Textarea`/`Autocomplete` renders `<label htmlFor={id}>`, with `id` auto-derived from the `label` prop if not supplied (`Input.tsx:40`, `Select.tsx` similar, `Textarea.tsx:22`, `Autocomplete.tsx:63`).
- **Required marker**: a visual `*` rendered `aria-hidden="true"` alongside `aria-required` on the control itself, so a screen reader announces "required" once, via the control's own state, not twice via a redundant visible glyph (`Input.tsx:96-104,134,153`).
- **Error/helper association**: `aria-describedby` points at a computed `${inputId}-error` or `${inputId}-helper` id, error taking precedence over helper when both could apply, and `aria-invalid={true}` set whenever `error` is passed (`Input.tsx:41-47,135-136,154-155`; identical pattern in `Autocomplete.tsx:78-80` and `Select.tsx`'s `describedBy`/`aria-required`).
- **Read-only vs disabled distinction**: `readOnly` fields (e.g. MOI-resolved identity fields on Contact) are removed from **sequential** tab order via `tabIndex={-1}` but keep native role/name/value so a screen reader still reaches them in browse mode; `disabled` fields are natively unfocusable by the browser and drop to a lower-contrast disabled style. The two are deliberately not conflated (`Input.tsx:49-85`, with the rationale spelled out in the surrounding code comment: registry data the agent must still read, not edit, should not look "unavailable").
- **Combobox pattern** (`Select.tsx:143-180`, `PhoneNumberInput.tsx:191-221`, `Autocomplete.tsx:74-121`): `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, with the popup itself `role="listbox"` containing `role="option"`/`aria-selected` children.

## MPA-A11Y-002 — Contact step (MPA-SCR-01): ID-type selector disabled-state handling

**[LIVE-VERIFIED]** Navigated directly to the wizard's default state (`/sim-number-management/new-postpaid-connection-journey-single-scroll-flow`). The four ID-type buttons (Qatar ID (QID), Passport, GCC ID, Diplomatic ID) are all present in the DOM; Passport and GCC ID both carry the native `disabled` attribute (source: `src/components/domain/QidInput.tsx:161-162`, `disabled={isUnavailable}` and `aria-disabled={isUnavailable || undefined}`). Live-checked with a DOM query for all visible focusable elements: disabled buttons report `tabIndex === 0` as a raw DOM property (a browser quirk — `HTMLElement.tabIndex` does not reflect the disabled state) but are correctly skipped by the browser's actual Tab-key traversal because `disabled` removes a control from focus regardless of its `tabIndex` property. Net effect confirmed correct: an agent tabbing through the ID-type row lands only on QID and Diplomatic ID.

**[LIVE-VERIFIED]** `unavailableIdTypesHint` ("Passport and GCC ID are available through the exception approval flow.") renders as visible static text alongside the disabled buttons rather than being announced only on focus/hover — visible to sighted and screen-reader users alike without requiring interaction (`GuidedContactStep.tsx:193-194` passing the hint through; confirmed rendered in the live DOM snapshot).

## MPA-A11Y-003 — Wizard shell (`GuidedActivationWizard.tsx`): step-change announcements and focus management

**[LIVE-VERIFIED]** A visually-hidden, `aria-live="polite"` span announces `"Step {n} of {total}: {label}"` on every step render (`GuidedActivationWizard.tsx:553-555`) — confirmed present in the live DOM as `"Step 1 of 9: Contact"` on initial load.

**[LIVE-VERIFIED]** On arrival at the Contact step with no fields yet populated (nothing scanned/typed), focus lands on the step's own `<h2 tabIndex={-1}>Contact</h2>` heading, not on `<body>` — confirmed via `document.activeElement` immediately after navigation, matching the documented fallback (`GuidedActivationWizard.tsx:323-324,376-383,634-637`: "no focusable field at all... falls back to the step heading... a screen-reader user hears the new step title rather than silence").

**[SOURCE-VERIFIED, not re-tabbed live per step]** The same effect (`GuidedActivationWizard.tsx:325-417`) runs on every step change across all 9 steps, not just Contact:
- Claims the first **outstanding** editable control in DOM order (a control is "outstanding" if empty for text/select, or if its radio group has no checked member) — `readonly`, `disabled`, `hidden`, and `type=checkbox` inputs are deliberately excluded from candidacy (checkboxes in this journey are always optional flags, never the thing gating Continue).
- A `MutationObserver` (childList + subtree + the `disabled` attribute specifically) re-runs the claim for up to 4 seconds after the step mounts, so a field that starts enabled and becomes disabled mid-render (e.g. the Address step's four fields disabling the instant an MOI address-prefetch resolves) doesn't strand focus on an element the browser is about to blur.
- Once the agent has focused a control of their own choosing, the observer backs off for the rest of that step (`agentOwnsFocus` check) — it does not fight the agent for focus.

**[SOURCE-VERIFIED]** Step rail semantics (`GuidedActivationWizard.tsx:582-624`): each reachable step is `role="button"`, `tabIndex={0}`, `aria-label="Go to {label} step"`, `aria-current="step"` on the active one, and responds to both Enter and Space via an explicit `onKeyDown` handler — not relying on native button semantics, since the rail item is a `<li>`, not a `<button>`. Unreachable steps (beyond `maxReached`, or any step once `isLocked` is true) render with none of these attributes at all, removing them from the tab order and the accessibility tree's interactive surface rather than presenting a focusable-but-inert control.

## MPA-A11Y-004 — Modal (Abandon confirmation, MPA-SCR-11) and Drawer (Signature Pad MPA-SCR-14, Billing Setup MPA-SCR-13, Plan Details MPA-SCR-15) surfaces

**[SOURCE-VERIFIED]** Both `Modal.tsx` and `Drawer.tsx` render `role="dialog"`, `aria-modal="true"`, `aria-label={title}` (`Modal.tsx:43-45`, `Drawer.tsx:64-66`), and both close on `Escape` via a document-level keydown listener attached only while `open` (`Modal.tsx:25-32`, `Drawer.tsx:44-47`) — an explicit non-mouse path to dismiss, independent of the backdrop click-to-close (which the code comments note is deliberately *not* keyboard-actionable itself, "a full-screen dismiss surface should not read as clickable the way a button does").

**Not implemented** (see Observations below): neither component moves focus into the dialog on open, traps Tab within it, or restores focus to the triggering element on close.

## MPA-A11Y-005 — Toast/notification layer

**[SOURCE-VERIFIED]** `Toast.tsx:170-171`: error-kind toasts render `role="alert"` with `aria-live="assertive"` (interrupts a screen reader immediately); success/info/warning toasts render `role="status"` with `aria-live="polite"` (announced without interrupting). Dismiss controls carry `aria-label="Dismiss notification"` (`Toast.tsx:202,316`). This journey's own steps do not raise toasts directly in the code I traced, but the layer they would use is announced correctly if triggered by a shared action.

## MPA-A11Y-006 — CAF & Signature (MPA-SCR-08) customer-facing mode

**[SOURCE-VERIFIED]** While `customerFacing` is true, `GuidedActivationWizard` renders *only* `currentStep.render(...)` inside a bare `<div>` — no step rail, no wizard heading, no Abandon/Save & Exit, no Back/Continue footer (`GuidedActivationWizard.tsx:541-547`). This means the accessibility tree handed to a customer reviewing/signing is deliberately minimal: nothing in it announces the rest of the journey (other steps' labels, product/pricing detail) that a customer being handed the screen should not be reading.

## Accessibility observations (WCAG 2.2 AA) — gaps found, NOT part of current implemented behaviour

These are documented as findings for remediation planning. None of the items below describe behaviour the app claims to have; they are the inverse — places the implementation does not meet the referenced criterion as built.

1. **Signature Pad has no keyboard alternative** (`src/components/primitives/SignaturePad.tsx`, backing MPA-SCR-14, the only mechanism to complete a Digital/Touch-Screen CAF). The canvas only binds `onPointerDown/Move/Up/Leave` (`SignaturePad.tsx:20,28,39,55-62`); there is no keyboard-operable equivalent action, and the canvas carries no `aria-label` describing its purpose. A keyboard-only agent cannot produce a signature and therefore cannot complete this journey past the CAF step at all. Likely relevant: **WCAG 2.1.1 Keyboard (Level A)**.

2. **MSISDN picker's Free / Star / Reserved tab control lacks tab semantics** (`src/components/domain/MsisdnPicker.tsx:288-303`, MPA-SCR-05). The three tabs are plain `<button>` elements with no `role="tablist"`/`role="tab"`/`role="tabpanel"` and no `aria-selected`; a screen reader announces three unrelated buttons rather than a tab set, and gives no indication which one is currently selected beyond visual styling (accent border/text colour). Likely relevant: **WCAG 4.1.2 Name, Role, Value (Level A)**.

3. **Plan search combobox has ARIA roles but no keyboard interaction** (`src/components/patterns/PostpaidPlanAddonsStep.tsx:355-384`, MPA-SCR-04). The search input and its suggestion list carry the full combobox/listbox/option role set (`role="combobox"`, `aria-expanded`, `role="listbox"`, `role="option"`, `aria-selected`), but no `onKeyDown` handler exists anywhere in the file — there is no Arrow-Up/Down to move through suggestions and no Enter-to-select; a keyboard user can open the suggestion list but cannot navigate or choose from it without a pointer. Likely relevant: **WCAG 2.1.1 Keyboard (Level A)**, and arguably 4.1.2 since the roles promise ARIA Authoring Practices combobox behaviour the implementation doesn't deliver.

4. **Modal/Drawer do not manage focus on open or close.** Neither `Modal.tsx` nor `Drawer.tsx` moves focus to the dialog (or a control within it) when it opens, nor restores focus to the element that triggered it when it closes; neither traps Tab within the dialog while open, so a sighted keyboard user can Tab out of an open Abandon-confirmation modal or Signature Pad drawer into the page behind it while it is still visually open. Likely relevant: **WCAG 2.4.3 Focus Order (Level A)**.

5. **Add-on discount proof-document upload and Additional Documents upload controls were not independently checked for File-input labelling/keyboard operability in this pass** — flagged as unverified rather than asserted either way; see the Uncaptured/Unverified list in the main document's Verification section (Phase 16).

## Scope note

Tab order was live-verified only for the Contact step's default (empty) state in this pass, plus the ID-type disabled-button behaviour on that same screen. The remaining 8 steps' and 6 modal/drawer surfaces' focus/tab-order claims in §MPA-A11Y-003–006 above are source-read, cross-referenced against the one shell mechanism (`GuidedActivationWizard`'s shared focus-management effect) that governs all of them identically — not independently re-tabbed screen-by-screen through the running app. This is recorded explicitly rather than implied as exhaustive live testing, per the workflow's own instruction not to overclaim verification.

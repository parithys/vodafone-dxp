# Mobile Postpaid Activation — Figma Make Prompt Pack


Derived only from the verified specification (`Mobile_Postpaid_Activation_Complete_Functional_UX_Specification.docx`) and its `_data/*.md` sources. Paste order: Prompt 0, Prompt 1, then Prompts 2 through 16 in the order listed, then the Scenario prompts, then the Final prompt.


## Prompt 0 — Apply the design system


Apply this Figma Make file's own design system tokens (color, type, spacing, radii) to everything built from these prompts. Do not introduce one-off colors, spacing, or type sizes — every element below is described by semantic role and behavior, never by a current color/pixel value, so that it maps cleanly onto whatever component set this file already has.

Before building any screen, map each semantic role below to this file's own equivalent component. If an exact equivalent does not exist, build it as a reusable component in this file's own component library — not as a one-off inside a single screen.

**Semantic component role list** (map each to this file's own design system):

| Semantic role | Behavior |
|---|---|
| Primary action button | Solid/filled, one per view, advances the flow |
| Secondary / ghost action | Outlined or text-only, secondary weight |
| Destructive / abandon action | Text-only, muted by default, warns on hover; triggers a confirmation before acting |
| Text field (single line) | Label above, helper/error text below, error state = distinct border color + inline message |
| Read-only / registry-sourced field | Visually distinct from an editable field (e.g. recessed fill), removed from the keyboard tab order, but still announced by assistive tech |
| Disabled field/button | Lower-contrast, not focusable, not announced as an actionable control |
| Select / dropdown | Combobox pattern: closed value display, opens a listbox on activation |
| Selectable radio card | A card-shaped radio option; selected state shows a distinct border/fill |
| Checkbox (optional flag) | Never gates a primary action's enabled state in this journey |
| Status chip / badge | Small pill, color-coded by semantic status (success/danger/warning/info/neutral) |
| Stepper / step rail | Numbered vertical list of steps; current step highlighted, completed steps checked, unreached steps unclickable |
| Modal (short confirmation) | Centered overlay, dismissible via backdrop click and Escape |
| Drawer (form / multi-field panel) | Side-anchored panel, dismissible via backdrop click and Escape |
| Toast / transient notification | Auto-dismissing, positioned consistently, distinguishes error from success/info by both color and (for screen readers) an alert vs. status role |
| Error banner (persistent) | Stays visible until the underlying error is resolved, not auto-dismissed |
| Tabs | Horizontal or vertical, one active tab at a time |
| Data table with sorting | Header row, click-to-sort columns, row click/link to detail |
| Signature capture | A draw surface plus Clear/Done actions |
| File/image upload | A trigger control plus inline validation messaging (size/type) |
| Tooltip | Hover/focus-triggered contextual text |
| Loading indicator | A spinner or equivalent, shown only while an async mock call is pending |

Nothing above should be built as a new one-off widget if this file's design system already has an equivalent — reuse it.


## Prompt 1 — Journey shell


Build the shell every one of this journey's 9 steps renders inside. This is shared chrome, not any one screen's content.


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

### Save & Exit, Resume, session behavior (for the shell)

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


### Scenario switcher (for this Figma Make build only — not part of the production behavior)
Since there is no live backend, add a lightweight, clearly-labeled dev-only control (e.g. a small panel or menu, visually distinct from the product UI) that lets a reviewer jump straight to a given mock customer/scenario without re-driving the whole Contact step by hand each time. At minimum it should let the reviewer pick: the happy-path customer, a customer that produces the malformed-email/phone validation state, and the Abandon-modal trigger — the three states actually verified in Phase 13 (see the specification's Section 10). Do not present this switcher as if it were part of the real agent-facing product.


## Prompt 2 — MPA-SCR-01 — Contact (incl. stacked Eligibility panel)

Route: reached via SCR-037 → step 1 of 9. Components: `GuidedContactStep` (`src/components/patterns/GuidedContactStep.tsx`) wrapping `IdLookupStep` (`src/components/patterns/IdLookupStep.tsx`), plus `EligibilityGateStep`/`EligibilityChecksLink` (`src/components/domain/EligibilityGateStep.tsx`) stacked below a `border-t` divider. Wired at `NewPostpaidWizard.tsx:166-256`.

## 1.1 Purpose
Capture and verify the customer's identity (QID or Diplomatic ID only, scan-first), resolve their MOI (Ministry of Interior) registry record, collect two agent-editable contact fields (email, alternate phone), and run the seven-check eligibility matrix inline the moment identity resolves — before any product selection happens.

## 1.2 Entry / exit conditions
- **Entry:** always the first step; no precondition.
- **Exit (Continue enabled):** MOI resolved AND all identity fields present (`hasIdentityDetails`) AND email valid AND alt phone valid AND eligibility result present AND `!hardStop && !softStop` AND no check has outcome `approval-routing` (NewPostpaidWizard.tsx:236-245).
- **Alternate exit (bypasses the isValid gate):** "Proceed to Approval" button — available only when eligibility resolved cleanly except for one or more `approval-routing` outcomes; calls `goNext()` directly, unguarded by `isValid`.
- **Terminal exit (leaves the journey):** "Switch to Prepaid" — available only on a collections soft-stop; navigates to `/mobile-prepaid/new-prepaid-tablet-step-1-contact-id-capture`.
- **Dead end (no forward path at all):** any hard-stop (expired ID, security blacklist, blocking deal) — Continue stays disabled, no alternate button appears.

## 1.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-01-ST01 | Empty/default | Fresh step, nothing entered |
| MPA-SCR-01-ST02 | MOI loading | Mid-lookup after scan/entry (200-600ms window) |
| MPA-SCR-01-ST03 | Identity resolved, eligibility loading | Immediately after MOI resolves, before the 7-check evaluation lands |
| MPA-SCR-01-ST04 | Clean pass (silent) | QID `28456701234` (CUST-1001, Ahmed Al-Sulaiti) |
| MPA-SCR-01-ST05 | Hard-stop (expired ID + security) | Diplomatic ID `DIP-QA-004521` (CUST-1006, Sophie Laurent) |
| MPA-SCR-01-ST06 | Soft-stop (collections) | QID `29011122233` (CUST-1004, Mohammed Al-Emadi) — must show "Switch to Prepaid" |
| MPA-SCR-01-ST07 | Approval-routing (under-18) | QID `P1234567` (CUST-9001, QA Test User, age 16) |
| MPA-SCR-01-ST08 | Email invalid | Type a malformed email |
| MPA-SCR-01-ST09 | Alt phone invalid | Type a non-Qatar-mobile number |
| MPA-SCR-01-ST10 | Email verification pending | Edit email to differ from MOI record |
| MPA-SCR-01-ST11 | Default with disabled ID types visible | Default render, before any scan |

**Confirmed unreachable in this journey (not screenshotted — see Phase 1 §9 item 3):** HRN-advisory row, `isB2B2C`/Employer field. Both fixtures (CUST-1002, CUST-2001) hold ID document types this journey's Contact step disables.

## 1.4 UI elements and content
- **IdLookupStep panel** (top): ID type selector (auto-detect scan-first; manual fallback unlocks after 2 failed scan attempts), ID number input/scanner, Fetch button, "Not found" message state
- **Disabled ID type hint:** static text below the (greyed) Passport/GCC ID options — verbatim: *"Passport and GCC ID are available through the exception approval flow."*
- **Identity fields section** (renders only once `moiResult` is truthy): 3-column grid, First/Middle/Last Name, Expiry Date, DOB, Nationality (all read-only), Gender (disabled radio), Email/Alt Phone/Notification Language (editable)
- **Separator:** `border-t border-border-soft`, `mt-6 pt-6`
- **Eligibility panel** (renders only when 1+ checks are non-passing; renders `null` on a clean pass): heading "One eligibility check needs attention before this order can proceed." (singular) or "{count} eligibility checks need attention before this order can proceed." (plural), list of unresolved check rows, pattern-specific message + action button
- **Footer-left link** ("View eligibility checks"): only visible once `eligibility` is set; opens MPA-SCR-12

## 1.5 Field specifications

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-01-001 | ID Type | Radio/segmented (auto-detect, manual fallback after 2 failed scans) | Yes (implicit — no identity without it) | Yes, but constrained: only QID/Diplomatic ID selectable; Passport/GCC ID shown greyed with hint | none | Must be QID or Diplomatic ID to proceed in this journey |
| MPA-FLD-01-002 | ID Number | Text (scanned or manually entered) | Yes | Yes | Scan result, or manual entry | Must resolve a match in `identity-documents.json` (else "Not found" state); MOI-resolved documents drive Check 1 (ID Validity) via `expiryDate` |
| MPA-FLD-01-003 | First Name | Read-only text | Yes (post-MOI) | No | MOI `customers.name`, first token | `hasIdentityDetails()` requires non-empty |
| MPA-FLD-01-004 | Middle Name(s) | Read-only text | No | No | MOI `customers.name`, 2nd–4th tokens | none (optional) |
| MPA-FLD-01-005 | Last Name | Read-only text | Yes (post-MOI) | No | MOI `customers.name`, last token | `hasIdentityDetails()` requires non-empty |
| MPA-FLD-01-006 | Expiry Date | Read-only, DD/MM/YYYY masked | Yes (post-MOI) | No | `identity-documents.expiryDate`, reformatted | `hasIdentityDetails()` requires non-empty |
| MPA-FLD-01-007 | Date of Birth | Read-only, DD/MM/YYYY masked | Yes (post-MOI) | No | MOI `customers.dob`, reformatted | `hasIdentityDetails()` requires non-empty; feeds Age Check |
| MPA-FLD-01-008 | Nationality | Read-only text | Yes (post-MOI) | No | MOI `customers.nationality` | `hasIdentityDetails()` requires non-empty; feeds line-cap rule (BR-288) |
| MPA-FLD-01-009 | Gender | Disabled radio (Male/Female) | Yes (post-MOI) | No (disabled, not merely read-only, to preserve control shape) | MOI `customers.gender` | `hasIdentityDetails()` requires non-empty |
| MPA-FLD-01-010 | Email Address | Email input | Yes | Yes | none — agent enters | `isValidEmail()`: `/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/`; placeholder `"customer@example.qa"`; error MPA-VAL-001 |
| MPA-FLD-01-011 | Alternate phone # | Phone input, `+974` pinned | Yes | Yes | none — agent enters | `isValidAltPhone()`: Qatar mobile only, `+974` + 8 digits, first digit 3/5/6/7; placeholder `"5566 7766"`; error MPA-VAL-002 |
| MPA-FLD-01-012 | Notification Language | Select | No | Yes | Default `'English'` | Options: English, Arabic, Hindi, Malayalam (evidenced in CRM SMS templates), Filipino (demo addition, no template evidence) |
| MPA-FLD-01-013 | Employer (B2B2C) | Read-only text | N/A — **unreachable in this journey** (see §1.2/Phase 1 §9 item 3) | No | MOI `customers.companyName` | Renders only if `isB2B2C && companyName` — condition never true for any ID type this journey allows |

`showIptvToggle={false}` for this journey — the "Get IPTV?" field (present in the shared component for Fixed Line contexts) never renders here.

## 1.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-01-001 | Fetch / scan trigger | Primary (within IdLookupStep) | ID number present, or scan hardware event fires | Runs MOI lookup against `identity-documents.json` → `customers.json` → (if `companyName`) `enterprise-accounts.json` |
| MPA-BTN-01-002 | "View eligibility checks" | Tertiary/link, footer-left | `eligibility` result is set | Opens MPA-SCR-12 drawer |
| MPA-BTN-01-003 | "Proceed to Approval" | Primary (eligibility panel) | `!hardStop && !softStop` AND 1+ checks are `approval-routing` | Calls `goNext()` directly (bypasses `isValid`) |
| MPA-BTN-01-004 | "Switch to Prepaid" | Secondary (eligibility panel) | `softStop === true` (collections block only) | Navigates to `/mobile-prepaid/new-prepaid-tablet-step-1-contact-id-capture`, leaving this journey with no order created |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Back disabled (first step); Continue per §1.2 gate | — |

## 1.7 User interactions
- Type/scan ID number → debounced or Enter-triggered MOI fetch (IdLookupStep)
- Scan failure ×2 → manual fallback unlocks (type selector + manual number entry + explicit Fetch button appear)
- MOI resolves → identity fields populate; eligibility check fires automatically (not gated on Continue click)
- Edit email/alt phone/language → local state update, re-validated on change
- Change ID number after a prior resolve → clears cached eligibility result, re-evaluates
- Change ID type → clears number, MOI result, and eligibility entirely
- Click "View eligibility checks" → opens drawer (MPA-SCR-12); does not re-run checks (uses cached result)
- Keyboard: standard tab order through the form; Fetch button and CTA buttons are native `<button>` elements (Enter/Space activate when focused)

## 1.8 Business rules
- MPA-BR-001 (BR-113 Blacklist) — see Phase 5 catalogue
- MPA-BR-002 (BR-288 Postpaid line cap, expat QID)
- MPA-BR-003 (BR-187 HRN advance payment) — unreachable in this journey (§1.3)
- MPA-BR-004 (BR-076 Default credit limit)
- MPA-BR-005 — the seven-check eligibility matrix itself (`src/engines/eligibilityEngine.ts:114-266`)

## Prompt 2b — MPA-SCR-01 — Contact (incl. stacked Eligibility panel) (continued)

## 1.9 Conditional display rules
| Element | Condition | Controlling rule |
|---|---|---|
| Identity fields section | `moiResult` truthy | MPA-DP-001 |
| Eligibility panel (any content) | 1+ checks non-passing | MPA-DP-002 |
| "Proceed to Approval" button | `!hardStop && !softStop &&` 1+ `approval-routing` checks | MPA-DP-003 |
| "Switch to Prepaid" button | `softStop === true` | MPA-DP-004 |
| Pattern-1 (hard-stop) message, no button | `hardStop === true` | MPA-DP-005 |
| Employer (B2B2C) field | `isB2B2C && companyName` | MPA-DP-006 (unreachable, see §1.5) |
| "View eligibility checks" link | `eligibility` set | MPA-DP-007 |

## 1.10 Validation and error handling
See Phase 6 catalogue: MPA-VAL-001 (email format), MPA-VAL-002 (alt phone format). Both are inline, on-change/on-blur, block the wizard-level Continue gate via `isValid` rather than a separate submit-time check.

## 1.11 Integration trigger points
- MPA-INT-001 — MOI identity lookup (trigger point only, see Phase 10)
- MPA-INT-002 — Eligibility check evaluation (trigger point only, reads multiple mock collections)

## 1.12 Navigation behaviour
MPA-NAV-003 (Continue → Address, auto-skipped), MPA-NAV-004 (Proceed to Approval → Address, bypassing isValid), MPA-NAV-005 (Switch to Prepaid → external journey, terminal for this journey). Standard shell nav in [00-wizard-shell.md](00-wizard-shell.md).

## 1.13 Related edge cases
MPA-SCN-001 (happy path), MPA-SCN-002 (hard-stop expired+security), MPA-SCN-003 (soft-stop collections → prepaid), MPA-SCN-004 (approval-routing under-18), MPA-SCN-005 (email/phone validation errors), MPA-SCN-006 (mid-flight lookup supersession), MPA-SCN-007 (HRN/B2B2C unreachable-in-build note).

## 1.14 Persona-specific behaviour
None found conditional on role within this screen's own components (preliminary — Phase 9 will grep exhaustively). All 5 granted roles see identical Contact-step behaviour.

## 1.15 Accessibility
To be completed live in Phase 12 (tab order, ARIA, focus-on-error, screen-reader announcement of the eligibility panel appearing).

## 1.16 Source references
- `NewPostpaidWizard.tsx:166-256` (step wiring, isValid gate, footerLeft)
- `GuidedContactStep.tsx` (full component; identity fields, validators `isValidEmail`/`isValidAltPhone`/`hasIdentityDetails`/`emailVerification`)
- `IdLookupStep.tsx` (MOI lookup, scan/manual-fallback logic, `MoiResult` type)
- `EligibilityGateStep.tsx` (7-check evaluation, display patterns, `EligibilityChecksLink`)
- `src/engines/eligibilityEngine.ts:114-266` (check definitions)
- `src/engines/ruleEngine.ts` (BR-113, BR-288, BR-187, BR-076)
- `public/mock-data/customers.json`, `identity-documents.json`, `commitment-penalties.json`, `bills.json` (fixtures)

## Prompt 3 — MPA-SCR-02 — Communication Address

Route: step 2 of 9, reached via Contact's Continue/Proceed-to-Approval. Component: `ZsbAddressStep` (`src/components/patterns/ZsbAddressStep.tsx`, full file), which nests `FibreReadinessBanner` (`src/components/domain/FibreReadinessBanner.tsx`). Wired at `NewPostpaidWizard.tsx:257-286`.

## 2.1 Purpose
Capture an optional mobile-line communication/service address (Zone, Street, Building, Floor, Unit/Apartment, Area/City, Kahramaa ID, Vodafone ID, free-text Address Line), auto-prefilled from the customer's on-file MOI-linked registered address when the resolved identity is Qatari, plus a purely informational fibre-readiness indicator checked against the ZSB the agent has typed. Because a mobile line needs no serviceable premises (per the code's own citation of FLD-523–526, all fields evidenced Mandatory: No), this step is configured to auto-skip on every run of this journey rather than block progression.

## 2.2 Entry / exit conditions
- **Entry:** automatically follows Contact once its own `isValid`/"Proceed to Approval" gate clears; step index 2 of 9.
- **`isValid: () => true`** (`NewPostpaidWizard.tsx:272`) — Continue is unconditionally enabled; nothing entered or omitted on this screen can block the wizard.
- **`autoAdvanceWhen: () => true`** (`NewPostpaidWizard.tsx:285`) — evaluates to true unconditionally, so `GuidedActivationWizard`'s one-time auto-advance effect (`autoAdvancedRef`, `GuidedActivationWizard.tsx:437-449`) fires the instant this step is reached on first forward arrival (`maxReached <= currentIndex` at line 441) and immediately calls `goNext()`, moving the agent straight to Billing Profile. **This fires on every single run of this journey** — there is no condition (nationality, existing address, anything) that varies the outcome; the step is never actually seen on a clean forward pass.
- **Re-entry via rail:** the auto-advance effect guards itself with `autoAdvancedRef.current.has(step.key)` (`GuidedActivationWizard.tsx:442-444`), which is set the moment it fires once. Clicking "Communication Address" in the left rail after the skip (permitted once `maxReached` has passed index 2 — see `00-wizard-shell.md` MPA-BTN-00-001) lands on the real, unfilled or MOI-prefilled form exactly as if the agent had walked through it normally — it does **not** re-skip a second time.
- **Exit:** Continue is always enabled; Back returns to Contact.

## 2.3 Screenshots (state plan)
Because the step auto-skips on every normal run, every state below except ST01 requires a deliberate rail-revisit after the skip.

| ID | State | How to reach |
|---|---|---|
| MPA-SCR-02-ST01 | Auto-skip in transit | Complete Contact normally for any customer — step 2 is never rendered on this pass; the rail jumps straight from Contact (completed) to Billing Profile (current) |
| MPA-SCR-02-ST02 | Empty/default form, no MOI prefill | After the skip, click "Communication Address" in the rail for a non-Qatari customer (e.g. CUST-1007, Henrik Lindqvist, Swedish) — the MOI-fetch effect's `nationality !== 'Qatari'` guard (`ZsbAddressStep.tsx:126`) short-circuits, so all fields render blank |
| MPA-SCR-02-ST03 | MOI prefill loading | Rail-revisit for a Qatari customer with a resolved `idNumber` (e.g. CUST-1001, QID 28456701234, Qatari) — briefly shows "Checking for an address on file…" (`ZsbAddressStep.tsx:162`) |
| MPA-SCR-02-ST04 | MOI-prefilled address | Same as ST03, once `identity-documents.json` → `addresses.json` resolves a Primary/active address record for that `customerId` |
| MPA-SCR-02-ST05 | Fibre Readiness — ready | Rail-revisit, then type a Zone/Street/Building combination whose bare values match a record in `ims-site-zsb.json` |
| MPA-SCR-02-ST06 | Fibre Readiness — not ready | Rail-revisit, type any Zone/Street/Building combination with no match in `ims-site-zsb.json` |
| MPA-SCR-02-ST07 | Area/City autocomplete open | Rail-revisit, focus/type into the Area/City field to show the suggestion list (`ims-site-zsb`/`kid-address-records` area names + `addresses.city`) |

## 2.4 UI elements and content
- **Fetching indicator:** `<p>` text, shown only while `fetching === true` — verbatim: *"Checking for an address on file…"* (`ZsbAddressStep.tsx:162`)
- **Field grid:** 2-column grid (`grid grid-cols-2 gap-4`) holding, in order: Zone, Street, Building, Floor, Unit/Apartment, Area/City, Kahramaa ID, Vodafone ID (`ZsbAddressStep.tsx:168-234`), followed by a full-width (`col-span-2`) Address Line input (`ZsbAddressStep.tsx:235-245`)
- **Fibre Readiness banner** (`FibreReadinessBanner.tsx:49-85`), rendered unconditionally in JSX but internally returns `null` until Zone+Street+Building are all non-blank (line 59) and the `ims-site-zsb` dataset has loaded (line 61). When shown: signal icon, heading *"Fibre Readiness"*, and one of two verbatim subtext lines depending on match: *"Fibre infrastructure is available at this address."* (success styling, check icon) or *"Fibre infrastructure is not currently available at this address."* (neutral styling, cross icon) — `FibreReadinessBanner.tsx:77-82`
- **Removed since original evidence (documented in code comments, not present on screen):** the provenance caption *"Retrieved from the customer's Qatar ID. Edit any field if the customer confirms a change."* (removed 2026-09-27, `ZsbAddressStep.tsx:163-167`); the Save Address / Skip Address / Go back / Cancel button row and the `skipped` flag it set (removed 2026-09-26, `ZsbAddressStep.tsx:88-95`); an on-screen "Unresolved policy conflict" advisory banner (removed 2026-09-25, `ZsbAddressStep.tsx:97-104` — see §2.8/§2.13 below for what this means for the ZSB-mandatory-for-mobile conflict)

## 2.5 Field specifications

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-02-001 | Zone | Text input | No (FLD-523–526, Mandatory: No) | Yes | MOI prefill: `AddressRecord.zone` when Qatari + resolved + not yet fetched (`ZsbAddressStep.tsx:125-151`) | None — free text, no format check |
| MPA-FLD-02-002 | Street | Text input (placeholder "e.g. Al Corniche Street") | No | Yes | MOI prefill: `AddressRecord.streetNo` | None |
| MPA-FLD-02-003 | Building | Text input (placeholder "e.g. Tower A") | No | Yes | MOI prefill: `AddressRecord.buildingNo` | None |
| MPA-FLD-02-004 | Floor | Text input (placeholder "e.g. 4th Floor") | No | Yes | None — no evidenced source prefills it (`ZsbAddressStep.tsx:11-13`); added 2026-09-28 | None |
| MPA-FLD-02-005 | Unit / Apartment | Text input (placeholder "e.g. Apt 4B") | No | Yes | MOI prefill: `AddressRecord.aptFlatUnit` | None |
| MPA-FLD-02-006 | Area/City | Autocomplete (options from `kid-address-records.area` + `addresses.city`, deduped/sorted) | No | Yes | MOI prefill: `AddressRecord.city` (labelled "Area/City" since that field holds exactly the mockup's Area concept, per `ZsbAddressStep.tsx:15-18`) | None — free entry, suggestions only |
| MPA-FLD-02-007 | Kahramaa ID | Text input (placeholder "e.g. KID-00123456") | No, and explicitly labelled so in comments (`ZsbAddressStep.tsx:212-219`) — unlike the fibre journeys where a KID is mandatory | Yes | MOI prefill: `AddressRecord.kahramaaId` | None — free text, no lookup/resolution against any dataset |
| MPA-FLD-02-008 | Vodafone ID | Text input (placeholder "e.g. WKR-0231-A") | No | Yes | None — free text; not validated or resolved against `vodafone-ids.json` (`ZsbAddressStep.tsx:37-45`) | None |
| MPA-FLD-02-009 | Address Line | Text input (placeholder "e.g. Near City Center Mall, opposite Al Rayyan park"), full-width | No | Yes | None — catch-all free text, added 2026-09-28, independent of the granular fields | None |

**No field on this step has any format validation, error state, or `error` prop wired anywhere in `ZsbAddressStep.tsx`** — confirmed by reading the full component: every `Input`/`Autocomplete` call passes only `value`/`onChange`/`placeholder`/`label`, matching the evidenced Mandatory: No status of FLD-523–526.

## 2.6 Buttons and actions
This component renders **no buttons of its own** — the evidenced Save Address / Skip Address / Go back / Cancel row was removed 2026-09-26 (`ZsbAddressStep.tsx:88-95`), and nothing replaced it since every field already writes on change.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Back enabled; Continue always enabled (§2.2) | — |

## 2.7 User interactions
- Type into any of the 9 fields → immediate `onChange({ ...value, [key]: newValue })` merge, no debounce (`ZsbAddressStep.tsx:172-244`)
- On mount (or when `idNumber`/`nationality` change) → MOI-prefill effect runs once per combination, guarded against re-fetch by `fetchedFromMoi` and against overwriting a filled `zone` (`ZsbAddressStep.tsx:125-158`); an in-flight fetch can be cancelled by unmount (`cancelled` flag)
- Typing Zone/Street/Building → `FibreReadinessBanner` recomputes its match on every keystroke once all three are non-blank (no debounce; pure prop-driven re-render)
- Focus/type into Area/City → Autocomplete suggestion list filters against the loaded `areaOptions`
- Keyboard: standard tab order through 9 native form controls; no custom keyboard handling found in this component

## 2.8 Business rules
- **MPA-BR-006** — `BR-ZSB-MANDATORY-FOR-MOBILE` (conflict-report.md Conflict 2, Medium severity). Defined in `src/engines/ruleEngine.ts:74-80`: `() => ({ pass: true, message: "Unresolved: Consumer Activation Process Manual v8.0 §2.1.15/§3.1.12 requires ZSB for mobile; a Day 7 workshop says it's FWA/fixed-only. Not blocking here - the evidenced screen itself (MNP Postpaid Address, FLD-523–526) marks these fields Mandatory: No with a \"Skip Address\" option - but confirm with COPS & Digital / Customer Data Management before treating this as final." })`.
  **Important correction to how this rule is actually wired:** `ZsbAddressStep.tsx`'s own comment (lines 97-104) says the conflict "stays recorded in reference/blueprint conflict-report.md (Conflict 2) and in ruleEngine's BR-ZSB-MANDATORY-FOR-MOBILE, **which still evaluates**." A grep of the entire `src/` tree for both `BR-ZSB-MANDATORY-FOR-MOBILE` and every `evaluateRule(` call site (`src/engines/ruleEngine.ts:305-321` is the only place that dispatches into `ruleImplementations`) found **no caller anywhere that invokes `evaluateRule('BR-ZSB-MANDATORY-FOR-MOBILE', …)`** — not in `ZsbAddressStep.tsx`, not in `NewPostpaidWizard.tsx`, not anywhere else. The rule function exists and would return the message above if called, but as built it is dead code: the advisory text is **never rendered on this screen or anywhere in the running app**. Documenting this as observed rather than assuming the comment's "still evaluates" claim is accurate.

## Prompt 3b — MPA-SCR-02 — Communication Address (continued)

## 2.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| "Checking for an address on file…" message | `fetching === true` | MPA-DP-008 |
| MOI address-prefill fetch fires | `nationality === 'Qatari' && idNumber` truthy `&& !value.fetchedFromMoi && !value.zone` (`ZsbAddressStep.tsx:126`) | MPA-DP-009 |
| Fibre Readiness banner renders at all | `zone`, `streetNo`, `buildingNo` all non-blank (trimmed) (`FibreReadinessBanner.tsx:59`) AND `ims-site-zsb` dataset loaded (line 61) | MPA-DP-010 |
| Fibre Readiness banner styling/text (ready vs. not-ready) | bare-value match of Zone+Street+Building against any `ims-site-zsb.json` record (`FibreReadinessBanner.tsx:63-64`) | MPA-DP-011 |

## 2.10 Validation and error handling
**None.** No `MPA-VAL-` ID is assigned by this screen — every field is unvalidated free text (see §2.5's closing note), matching the evidenced Mandatory: No status. This is a deliberate, evidenced state (FLD-523–526), not a gap to be filled by inference.

## 2.11 Integration trigger points
- MPA-INT-003 — MOI-linked address lookup: `identity-documents` (match `documentNumber === idNumber`) → `addresses` (match `customerId` + `primaryStatus === 'Primary'` + `activeFlag`) (`ZsbAddressStep.tsx:130-152`). Trigger point only — not a live integration.
- MPA-INT-004 — Area/Kahramaa suggestion list load: `kid-address-records` + `addresses` read on mount to build `areaOptions` (`ZsbAddressStep.tsx:113-123`). Trigger point only — not a live integration.
- MPA-INT-005 — Fibre readiness lookup: `ims-site-zsb` read on mount, matched client-side against the typed Zone/Street/Building (`FibreReadinessBanner.tsx:52-53, 63-65`). Trigger point only — not a live integration.

## 2.12 Navigation behaviour
- MPA-NAV-006 — Unconditional auto-advance: on first forward arrival at this step, `autoAdvanceWhen` returns true immediately, firing `GuidedActivationWizard`'s auto-advance effect (`GuidedActivationWizard.tsx:437-449`) and calling `goNext()` to Billing Profile without agent action, on every run of this journey (`NewPostpaidWizard.tsx:285`).
- MPA-NAV-007 — Rail re-entry: clicking "Communication Address" in the rail after the skip (allowed once `maxReached` ≥ its index — MPA-BTN-00-001 in [00-wizard-shell.md](00-wizard-shell.md)) opens the real form; the `autoAdvancedRef` guard (`GuidedActivationWizard.tsx:441-444`) prevents the effect from re-firing, so this visit behaves like any ordinary step (Continue still always enabled per §2.2).

## 2.13 Related edge cases
- MPA-SCN-008 — Happy path: any customer, this screen is auto-skipped in full; the agent never sees it unless they deliberately click back into the rail.
- MPA-SCN-009 — Non-Qatari / no `idNumber`: MOI prefill never attempts to run (`nationality !== 'Qatari'` or `idNumber` falsy short-circuits `ZsbAddressStep.tsx:126`); the auto-skip still happens regardless — prefill eligibility has no bearing on whether the step is shown.
- MPA-SCN-010 — Rail-click-back after skip: reopens the real form (empty, or MOI-prefilled for a Qatari customer with an on-file address), fully editable, Continue remains enabled throughout since `isValid` never depends on this screen's values.
- MPA-SCN-011 — ZSB-mandatory-for-mobile conflict: the advisory defined in `ruleEngine.ts` (MPA-BR-006) is **not surfaced anywhere in the running UI** — confirmed no call site invokes it. The underlying policy conflict (Consumer Activation Process Manual vs. Day 7 workshop) therefore remains genuinely unresolved and, as currently built, invisible to the agent using this screen.
- MPA-SCN-012 — Fibre Readiness banner: only reachable at all via a rail-revisit (since the step is normally skipped), and only renders once Zone+Street+Building are all filled in; demonstrates both the "ready" and "not ready" match states against `ims-site-zsb.json`.

## 2.14 Persona-specific behaviour
None found. `ZsbAddressStep` and `FibreReadinessBanner` take no role/persona prop and contain no persona-conditional logic anywhere in either file (confirmed by full-file read). Preliminary — Phase 9 will re-verify exhaustively across the whole journey, including whether any role's navigation/visibility config affects reachability of this step itself (not the step's own content).

## 2.15 Accessibility
To be completed live in Phase 12.

## 2.16 Source references
- `NewPostpaidWizard.tsx:257-286` (step wiring, `isValid`/`autoAdvanceWhen`, render props)
- `ZsbAddressStep.tsx` (full file — component, `ZsbAddressValue` type, MOI-prefill effect, area-options effect, JSX field grid)
- `FibreReadinessBanner.tsx` (full file — readiness check, `bareValue()` normalizer, render states)
- `src/engines/ruleEngine.ts:59-80, 305-321` (BR-ZSB-MANDATORY-FOR-MOBILE definition and `evaluateRule`/`hasImplementation` dispatch — confirming no caller)
- `src/components/patterns/GuidedActivationWizard.tsx:437-449` (auto-advance effect and `autoAdvancedRef` guard), `:524-531, 582` (rail click reachability, cross-referenced via `00-wizard-shell.md`)
- `public/mock-data/identity-documents.json`, `addresses.json`, `kid-address-records.json`, `ims-site-zsb.json`, `customers.json` (fixtures; `customers.json` confirms CUST-1001/CUST-9001 nationality Qatari, CUST-1007 nationality Swedish)

## Prompt 4 — MPA-SCR-03 — Billing Profile

Route: step 3 of 9, immediately after Communication Address (which auto-skips — see [screen-02-address.md](screen-02-address.md)). Component: `BillingAccountStep` (`src/components/patterns/BillingAccountStep.tsx`, full file), which internally renders `BillingProfileSetupDrawer` (documented separately as MPA-SCR-13 — not duplicated here). Wired at `NewPostpaidWizard.tsx:300-320`.

## 3.1 Purpose
Let the agent either select one of the customer's existing billing accounts, or create a new one — capturing contact, billing address, card-on-file tokenization, bill cycle, and the profile's own name/media/schedule (via the nested Billing Profile Setup drawer) — before Plan & Add-ons. Per `NewPostpaidWizard.tsx:287-299`, this is a wholly new Step 3 (2026-09-28 request), distinct from the old "Billing" step (Language/Payment Type/Payment Method/Bill Media, removed 2026-09-25) whose component (`BillingProfileStep.tsx`) still exists untouched and is used only by `NewMnpWizard`.

## 3.2 Entry / exit conditions
- **Entry:** follows Communication Address; step index 3 of 9. **No `autoAdvanceWhen` is defined on this step** (confirmed absent from the step object at `NewPostpaidWizard.tsx:300-320`, unlike Address/Plan/SIM Type/Payment) — this screen is always actually shown to the agent, never auto-skipped.
- **Exit (Continue enabled):** `isBillingAccountValid(values.billingAccount)` (`NewPostpaidWizard.tsx:319`, implementation `BillingAccountStep.tsx:513-526`). Two **mutually exclusive** satisfying paths:
  - **Path A — Existing account:** `selectedProfileId` is set → valid immediately; no other field on this screen is required.
  - **Path B — Create new:** `creatingNew === true` AND all of: `newAccount.primaryContactId` set; if `hasSecondaryContact` then `secondaryContactName` non-blank; if `useSameAddress` is `false` then `newStreet`/`newArea`/`newBuilding` all non-blank; `preferredInvoiceRecipient` set; `newAccount.cardToken` set (i.e. a card number that tokenized successfully); `newAccount.profileName` non-blank (i.e. the Billing Profile Setup drawer, MPA-SCR-13, has been saved at least once).
  - Neither path satisfied (nothing selected, or Create New open but incomplete) → Continue disabled.
- **Zero-account customer:** with no accounts on file, "No billing accounts on file for this customer yet." shows in place of the account grid, and Path B is the only route forward (it can never simultaneously be at-cap with 0 profiles — see §3.9 MPA-DP-012).

## 3.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-03-ST01 | Loading | Immediately on step arrival, before `accounts`/`billing-profiles`/`customer-contacts`/`customers` resolve (`BillingAccountStep.tsx:274-276`) |
| MPA-SCR-03-ST02 | Existing account(s), none selected | CUST-1001 (Ahmed Al-Sulaiti) — 1 seeded account, ACC-5001 / BILL-7001, badge "Default" |
| MPA-SCR-03-ST03 | Existing account selected | Same as ST02, after clicking the account card — card highlights, Continue enables |
| MPA-SCR-03-ST04 | No accounts on file | CUST-1007 (Henrik Lindqvist) or CUST-9001 (QA Test User) — 0 seeded accounts for either (confirmed against `accounts.json`, see §3.16) |
| MPA-SCR-03-ST05 | Create New — Contact section | Toggle "[+] Create New Billing Account" open on ST04's customer |
| MPA-SCR-03-ST06 | Create New — Secondary Contact revealed | Check "Secondary Contact" |
| MPA-SCR-03-ST07 | Create New — custom billing address revealed | Uncheck "Use same address as Communication Address" |
| MPA-SCR-03-ST08 | Card entered, tokenized | Type ≥12 digits into Card Number, blur — green confirmation line appears |
| MPA-SCR-03-ST09 | Card validation error | Type <12 digits into Card Number, blur — red error state |
| MPA-SCR-03-ST10 | Billing Profile Setup not yet configured | Create New open, drawer never opened/saved — "Not yet configured - required before this account can be finalised." |
| MPA-SCR-03-ST11 | Billing Profile Setup summary populated | After saving the drawer (MPA-SCR-13) once |
| MPA-SCR-03-ST12 | VIP bill-cycle branch — **unreachable in current build** | No screenshot possible: `customers.json` contains no `segment: "VIP"` record (confirmed, see §3.16); documented from source only |
| MPA-SCR-03-ST13 | At-cap branch — **unreachable in current build** | No screenshot possible: no Consumer `customerId` in `accounts.json` holds ≥2 accounts (confirmed, see §3.16); documented from source only |

## 3.4 UI elements and content
- **"Existing Billing Accounts"** `<h3>` heading (`BillingAccountStep.tsx:281`), followed by either *"No billing accounts on file for this customer yet."* (line 283) or a responsive grid (`grid-cols-1 sm:grid-cols-2`) of account cards (lines 285-310)
- **Account card content:** *"Account ending …{last 4 of billingProfileId}"*, a `filled-neutral` **Badge** reading *"Default"* on the first (`i === 0`) card only, *"Primary contact: {billingContactName}"*, and `{billingAddress} · {billingContactEmail}` (lines 299-306)
- **At-cap message** (Consumer only, ≥2 profiles): *"This customer already holds the maximum of two billing profiles for a Consumer account - select one above."* (line 319-321) — see §3.9/§3.13, unreachable with current seed data
- **"Create New Billing Account" toggle**, verbatim button text: `[+] Create New Billing Account` collapsed / `[-] Create New Billing Account` expanded (line 329)
- **Section headings inside Create New:** "Contact" (line 336), "Billing Address" (line 373), "Payment" (line 409), "Billing Profile Setup" (line 472)
- **Checkbox labels (verbatim):** "Secondary Contact" (line 358), "Use same address as Communication Address" (line 379), "Requires VIP segment details - use a different date" (line 439, VIP-only), "Primary Payment Profile" with trailing muted note "(the only profile being created here)" (lines 462-466, disabled/always checked)
- **Address default text:** shows `defaultAddressLine` (piped in from the Communication Address step's own values, `NewPostpaidWizard.tsx:306-309`) or, if none, *"No communication address on file yet."* (line 382)
- **Bill Cycle display:** label "Bill Cycle" with a muted *" (DEMO ONLY)"* suffix (lines 423-426), value line `"{ordinal(billCycleDay)} of the Month{' (VIP default)' or ' (Default)'}"` (lines 427-429)
- **Card Number helper text (verbatim):** *"Only the last 4 digits and a generated token are stored (Gatan gateway simulation)."* (line 455)
- **Card error text (verbatim, on failed tokenization):** *"Enter a valid card number."* (line 266)
- **Tokenized confirmation text (verbatim, green/success):** `"Card ending {cardLast4} tokenized - {cardToken}"` (lines 458-460)
- **Billing Profile Setup summary** — `<dl>` with rows "Billing Profile Name" / "Bill Media" / "Billing Schedule" once `profileName` is set (lines 478-491), else *"Not yet configured - required before this account can be finalised."* (line 493)
- **"+ Add" button** beside the "Billing Profile Setup" heading (lines 473-475), opens the drawer (MPA-SCR-13 — see that file for its own full field/button spec, not repeated here)

## 3.5 Field specifications

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-03-001 | Primary Contact | Select (options: `customer-contacts` filtered by `customerId`, `"{firstName} {lastName}"`) | Yes, within Path B | Yes | none | Required for `isBillingAccountValid` (`BillingAccountStep.tsx:517`) |
| MPA-FLD-03-002 | Secondary Contact | Checkbox | No | Yes | `false` | Toggling off clears `secondaryContactName` (line 354) |
| MPA-FLD-03-003 | Secondary Contact Name | Text input | Yes, only if MPA-FLD-03-002 checked | Yes | none | Required (non-blank, trimmed) when `hasSecondaryContact` (line 518) |
| MPA-FLD-03-004 | Use same address as Communication Address | Checkbox | No | Yes | `true` (`newAccount.useSameAddress ?? true`) | — |
| MPA-FLD-03-005 | Street | Text input | Yes, only if MPA-FLD-03-004 unchecked | Yes | none | Required (non-blank, trimmed) when `!useSameAddress` (line 519-520) |
| MPA-FLD-03-006 | Area | Text input | Yes, only if MPA-FLD-03-004 unchecked | Yes | none | Same as above |
| MPA-FLD-03-007 | Building | Text input | Yes, only if MPA-FLD-03-004 unchecked | Yes | none | Same as above |
| MPA-FLD-03-008 | Preferred Invoice Recipient | Select (options: "Primary Contact" always; "Secondary Contact" only if MPA-FLD-03-002 checked) | Yes | Yes | none | Required (line 522) |
| MPA-FLD-03-009 | Bill Cycle (display) | Read-only derived text | N/A (not a user input) | No | `computeBillCycleDay(segment, asOf)` — see MPA-BR-007/009 | Not user-editable; feeds no validation directly |
| MPA-FLD-03-010 | "…use a different date" override | Checkbox, **only rendered when `customerSegment === 'VIP'`** | No | Yes, VIP-only | `false` | Unreachable with current seed data (no VIP customer) — see §3.8/§3.13 |
| MPA-FLD-03-011 | Card Number | Text input, masked placeholder `"•••• •••• •••• ••••"` | Yes | Yes | none | `tokenizeCard()`: strips non-digits, requires ≥12 digits (`BillingAccountStep.tsx:120-127`); on-blur validation, error MPA-VAL-003 |
| MPA-FLD-03-012 | Primary Payment Profile | Checkbox, **always checked, disabled** | N/A | No | `true`, fixed | Cannot be unchecked — this journey only ever creates one payment profile |
| MPA-FLD-03-013 | Billing Profile Name (drawer) | Text input, in MPA-SCR-13 | Yes (drawer's own Save is disabled without it, line 192) | Yes | none | Full spec is MPA-SCR-13's own; listed here only because `profileName` gates this step's `isBillingAccountValid` (line 524) |
| MPA-FLD-03-014 | Bill Media (drawer) | Select, in MPA-SCR-13 (Email/Paper Bill/SMS) | No | Yes | `'Email'` | See MPA-SCR-13 |
| MPA-FLD-03-015 | Billing Schedule (drawer) | Select, in MPA-SCR-13 (Immediate/Next Cycle) | No | Yes | `'Immediate'` | See MPA-SCR-13 |

## 3.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-03-001 | Existing account card | Selectable card/button | Always (per rendered card) | `onChange({ selectedProfileId: p.billingProfileId, creatingNew: false })` — mutually exclusive with Create New (`BillingAccountStep.tsx:292`) |
| MPA-BTN-03-002 | "[+]/[-] Create New Billing Account" | Toggle/disclosure | Only rendered when **not** at Consumer cap (§3.9 MPA-DP-012) | Toggles `creatingNew`, clears `selectedProfileId` (`BillingAccountStep.tsx:326`) |
| MPA-BTN-03-003 | "+ Add" (Billing Profile Setup) | Ghost/compact | Always, within Create New | Opens `BillingProfileSetupDrawer` (MPA-SCR-13) — full button/field spec lives in that screen's own file, not repeated here |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §3.2 gate | — |

## 3.7 User interactions
- Click an existing account card → selects it, collapses/clears any in-progress Create New state
- Click "Create New Billing Account" toggle → expands/collapses the disclosure, clearing `selectedProfileId` on expand
- Check "Secondary Contact" → reveals Secondary Contact Name; unchecking clears its value
- Uncheck "Use same address…" → reveals Street/Area/Building inputs in place of the `defaultAddressLine` text
- Type in Card Number → clears any previously tokenized `cardLast4`/`cardToken` and the error state immediately on each keystroke (line 448-452); on blur, `validateCard()` runs `tokenizeCard()` and either sets the error or the token
- Click "+ Add" → opens the Billing Profile Setup drawer (MPA-SCR-13); Save patches `profileName`/`billMedia`/`billingSchedule` back onto `newAccount` and closes the drawer
- Keyboard: standard tab order through native form controls; account cards and the Create New toggle are native `<button type="button">` elements (Enter/Space activate)

## 3.8 Business rules
- **MPA-BR-008** — Consumer Billing Profile Cap (catalogue id `BR-071`, `public/config/business-rules.json`: *"A consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more."*). **Not routed through `ruleEngine.ts`'s `evaluateRule`/`ruleImplementations`** (no `'BR-071'` key exists there) — the logic is hand-coded directly in the component as `atConsumerCap = customerSegment !== 'Enterprise' && profiles.length >= 2` (`BillingAccountStep.tsx:257-261`).
- **MPA-BR-007** — Default Postpaid Billing Cycle Rule (catalogue id `BR-024`: *"Billing profiles default to postpaid with automatic 1st/15th bill cycles."*). Evidenced half of `computeBillCycleDay()` (`BillingAccountStep.tsx:94-100`): for a non-VIP segment, picks whichever of the 1st or 15th is closer to the date 3 days from now (the "three-day submission window"). Also not routed through `ruleEngine.ts` — implemented directly in this component.
- **MPA-BR-009** — VIP / 7th-of-month default (**UNEVIDENCED assumption layered onto MPA-BR-007**). Per the component's own comment (`BillingAccountStep.tsx:80-93`): *"VIP customers default to the 7th of every month... no rule in the corpus defines a 'VIP' customer segment or a 7th-of-month VIP default - customers.json's own `segment` values are only ever 'Consumer'/'Enterprise' in this app's seed data. Implemented exactly as directed, gated on `segment === 'VIP'`... without inventing one now."* **Confirmed unreachable:** a full scan of `public/mock-data/customers.json` (9 customer records) found `segment` values of only `"Consumer"`, `"Consumer (HRN)"`, and `"Enterprise (EBU)"` — no `"VIP"` record exists, so the `segment === 'VIP'` branch at `BillingAccountStep.tsx:95, 253, 433` can never execute in this build.
- **MPA-BR-010** — Card tokenization / last-4-plus-token-only storage rule. Per the component's own comment (`BillingAccountStep.tsx:109-119`): *"Validation of payment details ... is required for successful processing, with only the last four digits of the card and a generated token number stored for security ... UNEVIDENCED: no payment gateway is named anywhere in this corpus. The screenshot accompanying this request said 'Gatan gateway simulation' - kept verbatim in the token prefix and the field's own helper text as a demo label, not a real integration."* The raw card number is never returned from `tokenizeCard()` or stored anywhere past the call (`BillingAccountStep.tsx:120-128`); only `last4` and a `GATAN-`-prefixed random token persist.

## Prompt 4b — MPA-SCR-03 — Billing Profile (continued)

## 3.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| "No billing accounts on file for this customer yet." | `profiles.length === 0` | MPA-DP-013 |
| "Default" badge on an account card | `i === 0` (first profile in the customer's own array) | MPA-DP-014 |
| At-cap message replaces "Create New" toggle entirely | `customerSegment !== 'Enterprise' && profiles.length >= 2` (`BillingAccountStep.tsx:261, 318`) | MPA-DP-012 — **unreachable with current seed data**, see §3.13 |
| Create New disclosure body | `value.creatingNew === true` | MPA-DP-015 |
| Secondary Contact Name input | `newAccount.hasSecondaryContact === true` | MPA-DP-016 |
| New-address 3-field grid vs. `defaultAddressLine` text | `!(newAccount.useSameAddress ?? true)` shows the grid; otherwise the text | MPA-DP-017 |
| "Secondary Contact" option in Preferred Invoice Recipient | `newAccount.hasSecondaryContact === true` (else filtered out of options, line 417-420) | MPA-DP-018 |
| VIP bill-cycle override checkbox | `customerSegment === 'VIP'` (line 433) | MPA-DP-019 — **unreachable with current seed data**, see §3.13 |
| Tokenized-card confirmation line | `newAccount.cardToken` is set | MPA-DP-020 |
| Billing Profile Setup `<dl>` summary vs. "Not yet configured…" message | `newAccount.profileName` truthy shows the `<dl>`; otherwise the message | MPA-DP-021 |

## 3.10 Validation and error handling
- **MPA-VAL-003 — Card Number.** `tokenizeCard(cardNumber)` strips all non-digit characters and requires at least 12 remaining digits (`BillingAccountStep.tsx:120-122`); on failure, `validateCard()` (called `onBlur`, line 453) sets `cardError` to the exact text **"Enter a valid card number."** (line 266) and clears any `cardLast4`/`cardToken` already on the value. The `Input`'s `error` prop renders this message and switches the field to error-border styling. **Recovery:** re-enter a card number with ≥12 digits and blur again — success clears the error and shows the tokenized-confirmation line (MPA-DP-020).
- **No other field on this screen carries an inline error message.** Every other required-in-context field (Primary Contact, Secondary Contact Name, Street/Area/Building, Preferred Invoice Recipient, Billing Profile Name) is marked only via the shared `Input`/`Select` "required" red `*` suffix (`src/components/primitives/Input.tsx:96-107`, `Select.tsx:129-131`) plus `aria-required`; leaving them blank produces **no per-field inline error text** — the only feedback is that the wizard-level Continue button stays disabled (§3.2), matching the pattern already noted for this journey's other steps.

## 3.11 Integration trigger points
- MPA-INT-006 — Existing billing data load: on `customerId` change, reads `accounts`, `billing-profiles`, `customer-contacts`, `customers` in parallel, filters `accounts`/`customer-contacts` to the current `customerId`, joins each owned account to its `billing-profiles` row, and reads the customer's own `segment` (`BillingAccountStep.tsx:224-245`). Trigger point only — not a live integration.
- MPA-INT-007 — Card tokenization simulation ("Gatan gateway simulation" — demo label, no real gateway, see MPA-BR-010) (`BillingAccountStep.tsx:120-128`). Trigger point only — not a live integration.
- MPA-INT-008 — Order submission write-through: on final wizard submit, `billingProfileId` (Path A) or `newBillingProfileName`/`billCardLast4` (Path B) are written onto the new `orders` record (`NewPostpaidWizard.tsx:621-641`). **This is a trigger point only, and notably a partial one:** the submission does **not** write any new record into the `accounts` or `billing-profiles` mock-data collections themselves — confirmed by reading the full `onSubmit` handler (`NewPostpaidWizard.tsx:541-686`), which calls `createRecord` only for `'orders'` and `'customer-activities'`. A billing account created via Path B is therefore recorded only as free-text fields on the order, and never becomes a real selectable account for that customer in any later journey run within this build.

## 3.12 Navigation behaviour
- MPA-NAV-008 — Continue → Plan & Add-ons, gated by `isBillingAccountValid()` (`NewPostpaidWizard.tsx:319`); no auto-advance defined on this step (§3.2).
- MPA-NAV-009 — "+ Add" opens the Billing Profile Setup drawer (MPA-SCR-13) as an in-place overlay, not a route/step change (`BillingAccountStep.tsx:472-475, 501-506`); closing or saving it returns to this same step with `newAccount` patched.

## 3.13 Related edge cases
- MPA-SCN-013 — **Existing-account path:** CUST-1001 has exactly one seeded account (ACC-5001 / BILL-7001), shown with the "Default" badge; selecting it satisfies `isBillingAccountValid` immediately with zero further input, and the "Create New" toggle remains available alongside it (one existing profile is below the 2-profile cap).
- MPA-SCN-014 — **Create-new path, with a real gap:** CUST-1007 and CUST-9001 both have zero seeded accounts (confirmed against `accounts.json`, §3.16), so "No billing accounts on file for this customer yet." shows and Create New is the only route. However, `public/mock-data/customer-contacts.json` contains rows **only** for CUST-1001, CUST-1002, and CUST-1003 — neither CUST-1007 nor CUST-9001 has any `customer-contacts` row. That means for either demo customer, the Primary Contact **Select renders with zero options** (`BillingAccountStep.tsx:343-347`), and MPA-FLD-03-001 can never be set — `isBillingAccountValid` can never pass Path B for these two customers as currently seeded. This is logged as an open item, not resolved by inference, per the evidence-over-inference policy: a demo walkthrough of the create-new path needs either a seeded contact added for one of these customers, or a different 0-account customer with contacts, neither of which exists in the current corpus.
- MPA-SCN-015 — **At-cap state — unreachable in current build.** `atConsumerCap` requires `profiles.length >= 2` for a non-Enterprise customer. A full read of `accounts.json` (6 records total: ACC-5001 through ACC-5006) shows every Consumer `customerId` (CUST-1001, CUST-1002, CUST-1003, CUST-1006) owns exactly one account; only the Enterprise customer CUST-2001 owns two (ACC-5004/ACC-5005), and Enterprise is explicitly exempted from the cap. §3.11's finding that Path B never writes back to `accounts.json` also means this state cannot be reached dynamically by running the wizard twice for the same customer within this build. Documented as unreachable rather than fabricated.
- MPA-SCN-016 — **Card validation failure:** enter fewer than 12 digits, blur — MPA-VAL-003 fires, Continue stays blocked (both because the required-field gate is unmet and because no token exists).
- MPA-SCN-017 — **VIP bill-cycle override — unreachable in current build.** No `customers.json` record carries `segment: "VIP"` (9 records checked, values are `"Consumer"`, `"Consumer (HRN)"`, `"Enterprise (EBU)"` only); the 7th-of-month default and its override checkbox (MPA-FLD-03-010) exist only in source and can never be exercised end-to-end with seeded data.
- MPA-SCN-018 — **Billing Profile Setup drawer round-trip:** "+ Add" opens MPA-SCR-13; saving it populates the summary `<dl>` (MPA-DP-021) and satisfies the `profileName` half of `isBillingAccountValid`'s Path B gate — the only point of contact between this screen and that one.

## 3.14 Persona-specific behaviour
None found. `BillingAccountStep` and `BillingProfileSetupDrawer` take no role/persona prop and contain no persona-conditional logic anywhere in either function (confirmed by full-file read of `BillingAccountStep.tsx`). Preliminary — Phase 9 will re-verify exhaustively.

## 3.15 Accessibility
To be completed live in Phase 12.

## 3.16 Source references
- `NewPostpaidWizard.tsx:287-320` (step wiring, `defaultAddressLine` derivation, `isValid`)
- `NewPostpaidWizard.tsx:541-686` (full `onSubmit` handler — confirms what is and is not persisted from this step)
- `BillingAccountStep.tsx` (full file — component, `computeBillCycleDay()`, `tokenizeCard()`, `BillingProfileSetupDrawer`, `isBillingAccountValid()`)
- `src/components/primitives/Input.tsx:96-107`, `Select.tsx:129-146` (required-marker/`aria-required` behaviour, no inline required-message)
- `public/config/business-rules.json` (`id: "BR-024"` Default Postpaid Billing Cycle Rule; `id: "BR-071"` Consumer Billing Profile Cap)
- `src/engines/ruleEngine.ts:305-321` (`evaluateRule`/`hasImplementation` — confirms BR-024/BR-071 are catalogue-only, not in `ruleImplementations`)
- `public/mock-data/accounts.json` (6 records; confirms exactly one account each for CUST-1001/1002/1003/1006, two for Enterprise CUST-2001, zero for CUST-1004/1005/1007/9001 — no customer reaches a 2-account Consumer state)
- `public/mock-data/billing-profiles.json` (BILL-7001 through BILL-7004, joined 1:1 to the accounts above)
- `public/mock-data/customer-contacts.json` (rows only for CUST-1001/1002/1003 — confirms the Primary Contact dropdown is empty for CUST-1007/CUST-9001, MPA-SCN-014)
- `public/mock-data/customers.json` (9 records; confirms `segment` is only ever `"Consumer"`, `"Consumer (HRN)"`, or `"Enterprise (EBU)"` — no `"VIP"` record, MPA-BR-009/MPA-SCN-017)

## Prompt 5 — MPA-SCR-04 — Plan & Add-ons

Route: step 4 of 9 (`plan` key), reached from Billing Profile. Component: `PostpaidPlanAddonsStep` (`src/components/patterns/PostpaidPlanAddonsStep.tsx`, 873 lines). Wired at `NewPostpaidWizard.tsx:321-358`.

## 4.1 Purpose
Let the agent choose exactly one postpaid plan from the catalogue (grouped into three offer tabs), optionally add multi-select add-ons, optionally apply one eligible discount (with supporting-ID + proof-document capture for MADA/B2B2C discounts), review/edit the Bill Limit, and see a running Monthly summary that is the single pricing source of truth for this order (`src/engines/postpaidPricing.ts`).

## 4.2 Entry / exit conditions
- **Entry:** always reached after Billing Profile; no precondition beyond a valid billing account.
- **Exit (Continue enabled):** `Boolean(values.productId) && values.billLimitPass !== false` (`NewPostpaidWizard.tsx:350`) — a plan must be selected, and if the Bill Limit was edited, it must not have failed the BR-226/BR-227 agent-minimum check. Add-ons, discount, and Bill Limit are all otherwise optional.
- **Auto-advance:** if the selected plan has `preBundledOffer: true`, the wizard auto-advances straight to Number Selection, skipping the rest of this step for that pick (`NewPostpaidWizard.tsx:356-357`, `autoAdvanceWhen`). In the seeded catalogue this is PROD-100 ("Postpaid Extra Promotion") only.

## 4.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-04-ST01 | Default — "Today's Special Promotions" tab active, no plan selected | Fresh arrival at the step |
| MPA-SCR-04-ST02 | "Offers for this QID" tab | Click that tab (populated by any plan carrying a `commitmentMonths` value — every seeded postpaid plan qualifies) |
| MPA-SCR-04-ST03 | "Standard BAU Catalogue" tab | Click that tab (populated by any plan neither `popular` nor carrying a commitment — none of the five seeded postpaid plans fall here, since all five carry `commitmentMonths: 3`; tab renders empty/absent per §4.9) |
| MPA-SCR-04-ST04 | Search narrows the active tab's plan list | Type into "Search plans by name or price", e.g. "350" or "Red" |
| MPA-SCR-04-ST05 | Type-ahead suggestions dropdown open | Focus or type in the search box with a non-empty query |
| MPA-SCR-04-ST06 | Plan selected (non-pre-bundled), "What's included" + Monthly summary cards visible | Select e.g. PROD-104 "Postpaid Red 350 Promotion" |
| MPA-SCR-04-ST07 | Pre-bundled plan selected, in-card note shown | Select PROD-100 "Postpaid Extra Promotion" — this state is transient, since selecting it fires the wizard's auto-advance to Number Selection immediately |
| MPA-SCR-04-ST08 | Plan Details drawer open | Click the chevron on any plan card — cross-reference MPA-SCR-15 for full drawer documentation, not duplicated here |
| MPA-SCR-04-ST09 | Add-ons tab, enabled state, none selected | Select a non-pre-bundled plan, click "Add-ons (optional)" |
| MPA-SCR-04-ST10 | Add-ons tab, 1+ selected, Bill Limit editor visible (read mode) | Check an add-on in `AddonsPicker` |
| MPA-SCR-04-ST11 | Add-ons tab, disabled state (pre-bundled plan) | Select PROD-100, then navigate back to the step via the rail (auto-advance already passed this tab once) and open "Add-ons" |
| MPA-SCR-04-ST12 | Bill Limit editor, edit mode open | Click "Edit Bill Limit" |
| MPA-SCR-04-ST13 | Bill Limit editor, validation error (below agent minimum) | Enter e.g. QR 20 for a Mobile product (agent min 50), click Apply |
| MPA-SCR-04-ST14 | Eligible Discounts tab, no plan selected yet | Click "Eligible Discounts" before choosing a plan |
| MPA-SCR-04-ST15 | Eligible Discounts tab, list populated, "No discount" default selected | Select a plan (e.g. PROD-104), open "Eligible Discounts" |
| MPA-SCR-04-ST16 | Eligible Discounts tab, disabled state (pre-bundled plan) | Same reachability path as ST11, opening "Eligible Discounts" instead |
| MPA-SCR-04-ST17 | MADA/B2B2C discount selected — supporting-ID + proof-upload fields shown, empty | Select ADO-7112 (MADA Discount, PROD-104) or ADO-7113 (B2B2C Discount, PROD-105) |
| MPA-SCR-04-ST18 | Proof document attached | Browse and pick a file ≤ 5 MB of an accepted type |
| MPA-SCR-04-ST19 | Proof document rejected — oversized file | Browse and pick a file > 5 MB |
| MPA-SCR-04-ST20 | Monthly summary with discount + add-ons all itemised | Plan + discount + 1 add-on all selected together |

**Confirmed unreachable in this journey — not screenshotted:** the HRN advance-collection message (`requiresHrnAdvance && …` block, `PostpaidPlanAddonsStep.tsx:330-334`, verbatim text "Please collect QAR {HRN_ADVANCE_QAR} from the customer."). This journey's Contact step only accepts QID or Diplomatic ID (`unavailableIdTypes` excludes Passport/GCC ID). The only fixture with `hrnAdvancePaymentRequired: true` (CUST-1002, Bimal Thapa) holds a Passport document, per `phase1-boundary-map.md:130-134` — already confirmed directly against `customers.json` + `identity-documents.json`. No reachable customer in this journey ever sets `requiresHrnAdvance` true, so this block never renders live; documented as designed-but-unreachable rather than invented.

## 4.4 UI elements and content
- **Section heading:** "RED Plan" (h3) / subtitle "Select your plan" (`PostpaidPlanAddonsStep.tsx:344-346`)
- **Search box:** placeholder/aria-label "Search plans by name or price" — combobox role, matches plan name substring OR the raw MRC number anywhere in the string (so "35" matches 350) (`:354-367`, `:234-238`)
- **Type-ahead listbox** (`id="plan-search-listbox"`, role="listbox"): up to 5 closest matches ranked by prefix > substring > Levenshtein edit distance (`closestPlans()`, `:37-49`); each option row shows plan name (left) and "QAR {mrcQAR}/mo" (right); empty state "No matching plans." (`:391-393`)
- **Tab strip** (six possible tabs, only non-empty plan-group tabs render): "Today's Special Promotions" / "Offers for this QID" / "Standard BAU Catalogue" (each with a count `Badge`), then "Add-ons (optional)" or "Add-ons ({n} selected)", then "Eligible Discounts" — active tab styled red text + underline, matching MsisdnPicker's tab treatment (`:407-436`)
- **Plan group derivation** (deliberately derived, not a hand-tagged field, `:138-170`): a plan with `popular: true` → "Today's Special Promotions"; else a plan carrying `commitmentMonths` → "Offers for this QID"; else → "Standard BAU Catalogue". Against the seeded catalogue: PROD-104 (`popular: true`) is the only "Special Promotions" member; PROD-100/105/106 (all carry `commitmentMonths: 3`, none `popular`) are "Offers for this QID"; "Standard BAU Catalogue" is empty for the current seed.
- **Plan card** (per plan, in the active plan-group tab): Radio + plan name (bold) + optional "POPULAR" accent badge + right-aligned "QAR {mrcQAR}/mo"; a 3-column allowances table (Data / Voice / Speed headers) with one data row; a benefits list (checkmark bullets) beside the table when the plan has any; a chevron button opening the Plan Details drawer (MPA-SCR-15); for a `preBundledOffer` plan, an accent-coloured note: verbatim *"Pre-bundled offer - selecting this skips add-ons/discount and goes straight to Number Selection."* (`:455-567`)
- **Add-ons panel:** `AddonsPicker` (hideHeader — this step's own tab already labels the section) rendering one row per catalogue Add-on product (checkbox, name, optional description, "QR {mrcQAR}/mo"); below it, `BillLimitEditor` once a plan is selected
- **Add-ons disabled state (pre-bundled plan):** warning-styled card, heading *"Add-ons unavailable for this plan"*, body verbatim: *"The selected pre-bundled offer already includes its extras and does not accept add-ons. Choose another plan to add extras."* (`:577-583`)
- **Eligible Discounts panel:** "Select a plan to see eligible discounts." prompt before a plan is chosen; otherwise a "No discount" radio row (default-selected) plus one row per discount scoped to the selected plan's `planId` via `addons-discounts.json`, each showing name, description, and a green "{rate}%" badge; "No discounts configured for this plan." when the filtered list is empty (`:600-656`)
- **Discounts disabled state (pre-bundled plan):** warning card, heading *"Discounts unavailable for this plan"*, body verbatim: *"The selected pre-bundled offer already includes its offer and does not accept extra discounts. Choose another plan to apply a discount."* (`:610-616`)
- **Supporting ID + proof document block** (MADA/B2B2C discounts only): `Input` labelled "Supporting ID" (required), placeholder "MADA card / reference number" for MADA or "Sponsor / employer reference ID" for B2B2C, helper text *"Required, along with a proof document below, before this order can be finalised."*; "Proof document" sub-label; either an attached-file row (filename · size, "Remove" link) or a "Browse…" button (`:663-710`)
- **Bill Limit editor card** (`BillLimitEditor.tsx`): label "Bill Limit ({product})" where product is "Mobile" for this journey; "Edit Bill Limit" button when not editing; read display "QR {value}" (`:52-77`)
- **"What's included" summary card:** heading "What's included" (h4), selected plan name (bold), benefits checklist, "Add-ons" label with either the comma-joined selected add-on names or "None selected - optional" (`:723-746`)
- **Monthly summary card:** left accent border; a `<table>` captioned "Monthly summary" with rows Plan / (discount, if any) / Add-ons (if > 0) / VAT — see §4.4 pricing formula below; right side "Total monthly" label over the bold total figure with a small "/mo" suffix (`:748-820`)
- **Plan Details drawer (MPA-SCR-15, documented separately):** opened via the chevron button; not duplicated here.

## 4.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-04-001 | Plan search | Text combobox | No | Yes | empty | Filters active plan-group tab by name substring or raw price digits; also drives type-ahead suggestions |
| MPA-FLD-04-002 | Plan selection | Radio, one per plan card | Yes (gates Continue) | Yes | none | Must select exactly one `Postpaid Plan` product; `selectedProductId` |
| MPA-FLD-04-003 | Add-ons | Multi-select checkboxes | No | Yes, unless selected plan is `preBundledOffer` (then the whole tab is disabled) | none selected | No validation — purely additive to `addonsQar` |
| MPA-FLD-04-004 | Discount | Radio, "No discount" + one row per eligible discount | No | Yes, unless selected plan is `preBundledOffer` | "No discount" | Only discounts where `addons-discounts.json` `planId` matches the selected plan are offered |
| MPA-FLD-04-005 | Supporting ID | Text input | Yes, only when selected discount's `addonType` is "MADA Discount" or "B2B2C Discount" (`SUPPORTING_ID_DISCOUNT_TYPES`) | Yes | empty | No inline format validator found in source — required by helper text and by order-finalisation gating (per the component's own note), not by a blocking `isValid` check on this step itself (see MPA-SCN item) |
| MPA-FLD-04-006 | Proof document | File upload | Yes, same condition as Supporting ID | Yes | none | Accept types `.pdf,.jpg,.jpeg,.png` (`PROOF_DOCUMENT_ACCEPT`); max size 5 MB (`PROOF_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024`); error MPA-VAL-004 on oversize |
| MPA-FLD-04-007 | Bill Limit | Numeric, +50/−50 steppers + free-text | No (defaults from plan MRC) | Yes | `billLimit ?? selectedPlan.mrcQAR` | BR-226 (Mobile, agent minimum QR 50) via `evaluateRule('BR-AGENT-MIN-THRESHOLD', …)`; error MPA-VAL-005 below the minimum |

## 4.6 Buttons and actions
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

## 4.7 User interactions
- Type in the plan search box → filters the active tab's list live, AND opens/repopulates the type-ahead dropdown (`searchOpen`)
- Click a type-ahead suggestion → selects that plan, fills the search box with its name, closes the dropdown; click outside the dropdown closes it without a selection (`mousedown` listener, `:255-262`)
- Click a plan card's radio/label area → selects the plan (`onSelectProduct`); the chevron is a separate click target that does not also select the plan (deliberate split, per the component's own comment at `:447-454`)
- Selecting a `preBundledOffer` plan → wizard-level `autoAdvanceWhen` fires (`NewPostpaidWizard.tsx:356-357`), leaving the rest of this step unvisited for that pick
- Switch discount away from a MADA/B2B2C pick → clears `discountSupportingId` and `discountProofDocument` for the stale entry (`useEffect` keyed on `discountId`, `:289-294`)
- Type/select the Bill Limit stepper or free-text, click Apply → recomputes pass/fail against the agent minimum and stores both the amount and the pass flag
- Attach a file exceeding 5 MB → the file is rejected (not stored), inline error shown, input not cleared until a valid file is chosen
- Keyboard: search box is a native `<input role="combobox">`; suggestion `<li role="option">` items are click-only in source (no explicit keydown/arrow-key handler found — not confirmed as keyboard-navigable beyond native tab order)

## 4.8 Business rules
- MPA-BR-011 (BR-120 / BR-269 — 3-month postpaid minimum subscription period / lock-in, disclosed via the Plan Details drawer's "Commitment" field; all five seeded postpaid plans carry `commitmentMonths: 3`)
- MPA-BR-012 (BR-226 — Bill Limit Mobile promotion agent-minimum threshold, QR 50; `AGENT_MINIMUMS.Mobile` in `BillLimitEditor.tsx:10`)
- MPA-BR-013 (BR-227 — Bill Limit Mobile Plus promotion agent-minimum threshold, QR 75; present in the same lookup table but this journey only ever passes `product="Mobile"`, so the Mobile Plus branch is unreachable from this screen specifically)
- MPA-BR-014 (BR-112 — HRN upfront advance; unreachable in this journey per §4.3/4.9 — logged here for numbering continuity, not exercised)
- MPA-BR-015 (pricing formula — `monthlyCharges()`, `postpaidPricing.ts:122-138`: `discountQar = round2(planQar * |discountRate|)`; `netQar = round2(planQar - discountQar + addonsQar + installmentQar)` [installmentQar always 0 on this screen, Device & DOI removed from this journey]; `vatQar = round2(netQar * VAT_RATE)` at `VAT_RATE = 0.05`, assumed/unevidenced per that module's own note; `totalQar = round2(netQar + vatQar)`)

## Prompt 5b — MPA-SCR-04 — Plan & Add-ons (continued)

## 4.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Plan-group tab (each of the three) | At least one plan in the full catalogue falls into that group (`planGroupTabs`) | MPA-DP-022 |
| "What's included" card | `selectedPlan` truthy | MPA-DP-023 |
| Monthly summary card | `selectedPlan && charges` truthy | MPA-DP-024 |
| Add-ons tab content: enabled picker vs. disabled warning | `selectedPlan?.preBundledOffer` false vs. true | MPA-DP-025 |
| Eligible Discounts tab content: prompt / disabled warning / picker | No plan selected → prompt; plan is `preBundledOffer` → warning; else → picker | MPA-DP-026 |
| Supporting ID + proof-document fields | `requiresSupportingId` — selected discount's `addonType` is "MADA Discount" or "B2B2C Discount" | MPA-DP-027 |
| Bill Limit editor | `selectedPlan` truthy | MPA-DP-028 |
| HRN advance-collection message | `requiresHrnAdvance` true | MPA-DP-029 (unreachable in this journey, see §4.3) |
| Type-ahead suggestions dropdown | `searchOpen && planSearch.trim()` non-empty | MPA-DP-030 |

## 4.10 Validation and error handling
- MPA-VAL-004 — Proof document oversize. Exact message (template-interpolated): `` `${file.name} is ${formatDocSize(file.size)}. The limit is 5 MB.` `` (`PostpaidPlanAddonsStep.tsx:299`). Size formatted as `"{n.n} MB"` above 1 MB, else `"{n} KB"` rounded (`formatDocSize`, `:108-111`). Recovery: choose a different file via "Browse…" again; the rejected file is never stored.
- MPA-VAL-005 — Bill Limit below agent minimum. Exact message (template-interpolated, from `ruleEngine.ts:30`): `` `Entries above the Agent Minimum value (QR ${agentMinimum}) allow the journey to proceed - QR ${limitAmount} is below it.` `` Shown below the editor once Apply is clicked with a failing amount; `onBillLimitChange(amount, false)` also sets `values.billLimitPass = false`, which blocks Continue per §4.2. Recovery: re-open "Edit Bill Limit", raise the value to ≥ the minimum, Apply again.
- No inline format validator was found in source for the Supporting ID text field itself (checked `PostpaidPlanAddonsStep.tsx` in full) — its "Required" state is enforced only insofar as the component's own comment states the order cannot be *finalised* without it; it does **not** appear in this step's `isValid` (`NewPostpaidWizard.tsx:350` gates only on `productId` and `billLimitPass`), so leaving it blank does not block Continue at this step. Documented as an open point, not inferred as blocking.

## 4.11 Integration trigger points
- MPA-INT-009 — Product/plan catalogue read (trigger point only — `mockDataEngine.list('products')`, filtered to `type === 'Postpaid Plan'` and `type === 'Add-on'`, `PostpaidPlanAddonsStep.tsx:264-269`)
- MPA-INT-010 — Discount catalogue read (trigger point only — `mockDataEngine.list('addons-discounts')`, filtered to `category === 'Discount'` and `planId === selectedProductId`, re-run on every plan change, `:271-279`)

## 4.12 Navigation behaviour
MPA-NAV-010 (Continue → Number Selection, standard). MPA-NAV-011 (selecting a `preBundledOffer` plan → auto-advance directly to Number Selection, bypassing the rest of this step for that session — rail click-back re-opens the real unfilled Add-ons/Discounts panels per the shared shell's own note in [00-wizard-shell.md](00-wizard-shell.md)). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged.

## 4.13 Related edge cases
- MPA-SCN-019 — Pre-bundled plan selected: Add-ons and Discounts tabs, if reached via rail click-back after the auto-advance, both render their disabled-warning state rather than the normal picker.
- MPA-SCN-020 — Switching plans after selecting a MADA/B2B2C discount and partially filling Supporting ID/proof document silently discards both (the `useEffect` keyed on `discountId` at `:289-294` fires whenever the discount no longer requires a supporting ID, including via a plan change that invalidates the prior discount selection).
- MPA-SCN-021 — Bill Limit failing validation blocks the wizard-level Continue even though the plan itself is validly selected — a plan-valid, bill-limit-invalid state is a real, reachable dead end until corrected.
- MPA-SCN-022 — HRN advance-collection message: designed but unreachable in this build (§4.3/4.9) — no QID/Diplomatic-ID fixture in `customers.json`/`identity-documents.json` carries `hrnAdvancePaymentRequired: true`.

## 4.14 Persona-specific behaviour
None found conditional on role within `PostpaidPlanAddonsStep.tsx`, `AddonsPicker.tsx`, or `BillLimitEditor.tsx` (preliminary — Phase 9 will grep exhaustively). The Bill Limit agent-minimum thresholds (BR-226/227) apply uniformly to whichever role reaches this step; no role-gated bypass was found in source.

## 4.15 Accessibility
To be completed live in Phase 12.

## 4.16 Source references
- `NewPostpaidWizard.tsx:321-358` (step wiring, isValid gate, autoAdvanceWhen)
- `PostpaidPlanAddonsStep.tsx` (full component, 873 lines)
- `src/components/domain/AddonsPicker.tsx` (full component)
- `src/components/domain/BillLimitEditor.tsx` (full component)
- `src/engines/postpaidPricing.ts` (full module, `monthlyCharges`, `VAT_RATE`, `HRN_ADVANCE_QAR`, `formatQar`)
- `src/engines/ruleEngine.ts:21-32` (`BR-AGENT-MIN-THRESHOLD`)
- `public/config/business-rules.json` (BR-112, BR-120, BR-226, BR-227, BR-269 definitions)
- `public/mock-data/products.json` (PROD-100/104/105/106 postpaid plans, PROD-101 addon — confirmed field-by-field via direct read)
- `public/mock-data/addons-discounts.json` (ADO-7105/7106/7107/7108 Loyalty Discount rows, ADO-7112 MADA Discount, ADO-7113 B2B2C Discount — confirmed field-by-field via direct read)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/phase1-boundary-map.md:130-134` (HRN reachability determination, cited not re-derived)

## Prompt 6 — MPA-SCR-05 — Number Selection

Route: step 5 of 9 (`number` key), reached from Plan & Add-ons (or by auto-advance from a pre-bundled plan). Component: `MsisdnPicker` (`src/components/domain/MsisdnPicker.tsx`, 534 lines). Wired at `NewPostpaidWizard.tsx:359-377`.

## 5.1 Purpose
Let the agent choose and reserve one MSISDN for the new line, browsing three tabs (Free / Star / Reserved) that are priced-band and status driven rather than the raw `category` field, with BR-115's star-number entitlement note surfaced up front. Manual/custom MSISDN entry, offered by every other journey sharing this component, is explicitly disabled here.

## 5.2 Entry / exit conditions
- **Entry:** reached after a non-pre-bundled plan is confirmed on Plan & Add-ons, or immediately (auto-advanced) after selecting a pre-bundled plan.
- **Exit (Continue enabled):** `Boolean(values.msisdn)` (`NewPostpaidWizard.tsx:376`) — any number picked from Free, Star, or Reserved satisfies this; there is no separate "confirm" step beyond the pick itself.
- No skip/auto-advance logic on this step itself (unlike its neighbours).

## 5.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-05-ST01 | Default — Free Numbers tab, page 1 of the available list | Fresh arrival at the step, for a customer/agent with no existing reservation |
| MPA-SCR-05-ST02 | Auto-opened on the Reserved tab | Sign in as ROLE-01/VFQ12341 (Fatima Al-Kuwari, USR-1101) — `numbers.json` seeds `+97433001001` with `status: "Reserved", reservedBy: "Fatima Al-Kuwari"`, so the auto-select-on-load effect (`MsisdnPicker.tsx:184-196`) lands on Reserved rather than Free the moment the number list arrives |
| MPA-SCR-05-ST03 | Star Numbers tab, with Sort control visible | Click "Star Numbers" |
| MPA-SCR-05-ST04 | Star Numbers tab, sorted "Price: high to low" (default) vs. re-sorted by another option | Change the Sort select |
| MPA-SCR-05-ST05 | Star-number overage note shown on a card | Any Star card whose price exceeds `planMrcQar × 25`. Confirmed against the live seed: `+97499990000` is priced QAR 20,000, which exceeds even the highest entitlement in this journey's catalogue (PROD-106, MRC 750 → entitlement QAR 18,750), so it shows `+QR 1,250 extra` regardless of which plan was chosen upstream; a lower-MRC plan such as PROD-104 (MRC 350 → entitlement QAR 8,750) shows a larger overage (`+QR 11,250 extra`) on the same card |
| MPA-SCR-05-ST06 | Search narrows Free/Star list | Type an 8-digit fragment into "Search 8-digit number" (Free or Star tab only — hidden on Reserved) |
| MPA-SCR-05-ST07 | Pagination controls (Previous/Next) | Free tab with its 24 available numbers (> PAGE_SIZE of 10) — pagination renders since `pageCount > 1` |
| MPA-SCR-05-ST08 | Number selected — confirmation line | Click any available card; verbatim confirmation "Number selected and reserved for this order." appears |
| MPA-SCR-05-ST09 | Reservation cap reached / "You hold 2 of 2" state | Reach the Reserved tab for an agent already holding `MAX_RESERVATIONS_PER_AGENT` (2) numbers |

**Explicit negative/contrast state — Manual MSISDN Entry:** this journey passes `allowManualEntry={false}` (`NewPostpaidWizard.tsx:373`), so the "Manual MSISDN Entry" form (`MsisdnPicker.tsx:512-530` — Custom MSISDN input + "Reserve Custom Number" button) **never renders** in Mobile Postpaid Activation, regardless of selection state. This is a deliberate design decision specific to this journey — confirmed via the prop default: `allowManualEntry = true` is the component default, and the other four journeys sharing `MsisdnPicker` (FWA, Fixed Line Fibre, SIM & Number Management, Prepaid) omit the prop and therefore keep the form. Document this contrast explicitly rather than screenshotting an absent control; no MPA-SCR-05-ST for it.

## 5.4 UI elements and content
- **Tab strip** (fixed order for every channel as of 2026-09-28): "Free Numbers" / "Star Numbers" / "Reserved Numbers" (`TAB_LABELS`, `TAB_ORDER`, `:45-61`) — same active-tab red-text-plus-underline treatment as Plan & Add-ons' tabs
- **Reservation-cap line** (Reserved tab only): `"You hold {n} of {MAX_RESERVATIONS_PER_AGENT} reserved numbers."`, appending `" Release one before reserving another."` in warn colour once at cap (`:309-314`)
- **Search box** (Free/Star only, hidden on Reserved): aria-label/placeholder "Search 8-digit number" (`:319-329`)
- **Sort control** (Star tab only): label "Sort" (uppercase, muted) + `Select` with options "Price: high to low" (default) / "Price: low to high" / "Number: ascending" / "Number: descending" (`SORT_OPTIONS`, `:106-111`, `:341-351`)
- **BR-115 entitlement note** (Free and Star tabs, only when `planMrcQar` is known): verbatim, template-interpolated: `` `This plan entitles a Star Number up to QR ${planMrcQar * 25} at no extra charge. Anything above that is billed the difference.` `` (`:357-362`)
- **Number card grid:** two columns on Free/Star, one column on Reserved; each card shows (Reserved tab only) a "Reserved" `Badge`, the local-format number ("XXXX XXXX", `+974` prefix stripped, `toLocalMsisdn()`), and right-aligned "QR {priceQAR}"; a Star-range card with an overage additionally shows a small warn-coloured `"+QR {overage} extra"` line, rendered only when the overage is > 0 (`:396-457`)
- **Empty-list message** (per tab): Reserved → "You have no reserved numbers."; Free/Star with an active search → "No available numbers match that search."; Free/Star with no search → "No available numbers in this category." (`:461-469`)
- **Pagination footer:** "Previous"/"Next" ghost buttons plus `"Showing {from}-{to} of {total}"`, shown only when `pageCount > 1` (`:475-493`)
- **Selection confirmation:** verbatim "Number selected and reserved for this order." once any number is chosen (`:498-502`)
- **Manual MSISDN Entry section:** present only when `allowManualEntry` is true — **not applicable to this journey**, see §5.3 negative state above.

## 5.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-05-001 | Search 8-digit number | Text | No | Yes | empty | Free-text match against stored E.164 or displayed local digits (`:265-277`); not shown on Reserved tab |
| MPA-FLD-05-002 | Sort | Select | No | Yes, Star tab only | `'price-desc'` | Only 4 options listed above; Free/Reserved always effectively sort `number-asc` with no visible control |
| MPA-FLD-05-003 | MSISDN selection | Card click | Yes (gates Continue) | Yes — re-selectable | none | `Boolean(values.msisdn)`; selecting fires `onSelect(msisdn, priceQAR)`, populating both `values.msisdn` and `values.numberPriceQAR` |
| — | Custom MSISDN / "Reserve Custom Number" | N/A | N/A | N/A — **not rendered in this journey** | N/A | N/A — see §5.3 negative state; documented here only to record the field IDs are intentionally not allocated for this screen |

## 5.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-05-001 | Tab buttons (Free/Star/Reserved) | Tab/navigational | Always | `setTab(t)`; also resets `page` to 0 |
| MPA-BTN-05-002 | Number card (any) | Selectable card, full-card click target | Always for every listed row (no disabled state — only `AVAILABLE` or the agent's own `Reserved` rows are ever listed) | `onSelect(n.msisdn, n.priceQAR)` — sets `values.msisdn`/`values.numberPriceQAR` |
| MPA-BTN-05-003 | "Previous" / "Next" | Ghost, compact | Previous: `safePage > 0`; Next: `safePage < pageCount - 1` | Paginates the current tab's filtered/sorted list, 10 rows per page |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §5.2 gate | — |

## 5.7 User interactions
- Switch tabs → resets to page 0 of that tab's list; Reserved shows only this agent's own held numbers (`myReserved`, filtered by `reservedBy === agentName`, where `agentName` comes from `useAuthStore((s) => s.profile?.name)` — the sign-in identity's display name, **not** the persona/role label, `:169-173`)
- Type in search (Free/Star) → filters live, resets to page 0
- Change Sort (Star only) → re-sorts live, no page reset called out in source beyond the existing `safePage` clamp
- Click a card → immediately selects and "reserves" the number (no separate confirm step); confirmation line appears below the grid
- On first load of the number list, if this agent already holds a Reserved number, the tab auto-switches to Reserved once (`hasAutoSelectedTab` ref guards a single fire; does not re-fire on a later reservation made within the same session, `:190-196`)
- Keyboard: cards are native `<button>` elements (Enter/Space activate); tab buttons and Previous/Next likewise native buttons

## 5.8 Business rules
- MPA-BR-016 (BR-115 — star-number entitlement by plan value: `entitlementQar = planMrcQar × STAR_NUMBER_ENTITLEMENT_MULTIPLIER (25)`; overage billed is `max(0, round2(numberPriceQar − entitlementQar))`, `postpaidPricing.ts:56-73`. The 25× ratio is stated in source as the confirmed figure over a competing 50× figure that surfaced in the same request — see that module's own comment)
- MPA-BR-017 (Free/Star price-boundary rule: a number is "Free" if `priceQAR < FREE_NUMBER_PRICE_CEILING_QAR (1000)`, "Star" if `priceQAR >= 1000` — this is a price band, not the stored `category` field, per 2026-09-28 direction quoted in source: "Treat all numbers below QAR 1,000 as free to the customer". Confirmed in the live seed: `+97433001002` is stored `category: 'Star'` but priced QAR 500, so it lists under the Free tab by this rule)
- MPA-BR-018 (Reservation cap — `MAX_RESERVATIONS_PER_AGENT = 2`, enforced only on the action that CREATES a new hold via manual entry, not on re-selecting an existing hold; not independently evidenced as a numbered BR in `business-rules.json` — app-level constant per the component's own comment, `MsisdnPicker.tsx:74-79`)

## Prompt 6b — MPA-SCR-05 — Number Selection (continued)

## 5.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Search box | `tab !== 'Reserved'` | MPA-DP-031 |
| Sort control | `tab === 'Star'` | MPA-DP-032 |
| BR-115 entitlement note | `tab !== 'Reserved' && planMrcQar !== undefined` | MPA-DP-033 |
| Per-card overage line | `planMrcQar !== undefined && n.priceQAR >= FREE_NUMBER_PRICE_CEILING_QAR &&` `starNumberOverageQar(...) > 0` | MPA-DP-034 |
| Reservation-cap warning line | `tab === 'Reserved'` (base line always shows; the "Release one…" clause additionally requires `atReservationCap`) | MPA-DP-035 |
| Pagination footer | `pageCount > 1` for the current filtered/sorted list | MPA-DP-036 |
| Selection confirmation line | `selected` (a number is chosen) | MPA-DP-037 |
| Manual MSISDN Entry section | `allowManualEntry && !selected` — **`allowManualEntry` is hard-set `false`** for this journey, so this element is permanently absent regardless of selection state | MPA-DP-038 |
| "Reserved" badge on a card | `tab === 'Reserved'` | MPA-DP-039 |

## 5.10 Validation and error handling
No screen-level validation exists on this step beyond the Continue gate itself (`Boolean(values.msisdn)`) — every listed card is selectable with no disabled/error state, since only `AVAILABLE` or self-owned `Reserved` rows are ever shown (`:222-246`, component's own comment). The Manual MSISDN Entry validators (`isValidMsisdn`, reservation-cap error, already-taken error) exist in source (`:198-220`, `:604-617` approx.) but are **never reachable in this journey** since `allowManualEntry={false}` prevents that form from ever rendering here — not documented as MPA-VAL items for this screen because the code path is unreachable, not because it is undocumented.

## 5.11 Integration trigger points
- MPA-INT-011 — MSISDN inventory read (trigger point only — `mockDataEngine.list('numbers')`, `MsisdnPicker.tsx:180-182`)

## 5.12 Navigation behaviour
MPA-NAV-012 (Continue → SIM Type, standard). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged; no step-specific auto-advance/auto-skip exists on Number Selection itself (contrast with Plan & Add-ons' pre-bundled auto-advance and SIM Type's Physical auto-advance).

## 5.13 Related edge cases
- MPA-SCN-023 — Manual MSISDN Entry, offered by four sibling journeys sharing this same component, is unconditionally absent here (`allowManualEntry={false}`) — a deliberate Postpaid-only restriction per the 2026-09-28 direction quoted in source ("This section is not required"), not a bug or an omission.
- MPA-SCN-024 — The demo login persona ROLE-01/VFQ12341 (Fatima Al-Kuwari, USR-1101) already holds a Reserved number (`+97433001001`, priced QAR 0/Free-band despite `category: "Star"` in the raw record) — confirmed via `users-agents.json`/`personas.json` cross-reference. This makes the Reserved-tab auto-open state (MPA-SCR-05-ST02) directly reachable for the chosen demo persona, resolving the open question logged in `phase1-boundary-map.md:108` (which flagged this as needing Phase 2 verification against the actual demo agent identity `AGENT-KARTHIKK` — that placeholder id has since been repointed to Fatima Al-Kuwari/USR-1101 in `numbers.json`, per that file's own `_reservedByNote`).
- MPA-SCN-025 — Selecting a number already selected/reserved earlier in the same session is a no-op re-selection, not a new reservation against the 2-number cap (cap only applies to manually-entered new holds, which this journey cannot reach at all).

## 5.14 Persona-specific behaviour
The Reserved tab is inherently agent-identity-scoped: `myReserved` filters `numbers.json` by `reservedBy === agentName`, where `agentName` is the signed-in identity's display name from `useAuthStore`. This is not a role-based branch (no `PersonaCapability` or role-id check found in `MsisdnPicker.tsx`) but a data-scoping behaviour that differs by *which agent* is signed in — every one of the 26 roles sees the same component logic, but the Reserved tab's contents differ per the signed-in identity's own holds in `numbers.json`. Confirmed for ROLE-01 (Fatima Al-Kuwari) per §5.13; not yet checked against every other role's bound identity (preliminary — Phase 9 will verify exhaustively).

## 5.15 Accessibility
To be completed live in Phase 12.

## 5.16 Source references
- `NewPostpaidWizard.tsx:359-377` (step wiring, isValid gate, `allowManualEntry={false}`)
- `MsisdnPicker.tsx` (full component, 534 lines)
- `src/engines/postpaidPricing.ts:53-73` (`FREE_NUMBER_PRICE_CEILING_QAR`, `STAR_NUMBER_ENTITLEMENT_MULTIPLIER`, `starNumberOverageQar`)
- `public/mock-data/numbers.json` (38 records; confirmed Free/Star/Reserved seeding, and `+97433001001` reserved by "Fatima Al-Kuwari" via direct read)
- `public/mock-data/users-agents.json` (USR-1101 = Fatima Al-Kuwari)
- `public/config/personas.json` (ROLE-01/VFQ12341 → `identityUserId: USR-1101`)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/phase1-boundary-map.md:108` (prior open question this screen's fixture-check resolves)

## Prompt 7 — MPA-SCR-06 — SIM Type

Route: step 6 of 9 (`simType` key), reached from Number Selection. Component: `SimTypeStep` (`src/components/domain/SimTypeStep.tsx`), which composes `SimSerialScanner` (`src/components/domain/SimSerialScanner.tsx`) for the Physical path. Wired at `NewPostpaidWizard.tsx:386-414`.

## 6.1 Purpose
Let the agent issue a SIM for the new line via one of two side-by-side paths — Physical (barcode/manual serial scan against store inventory) or eSIM (generate a demo LPA activation code) — with Physical auto-advancing the wizard the instant a scanned/entered serial validates, while eSIM stays a manual-Continue choice the agent reviews rather than acts on immediately.

## 6.2 Entry / exit conditions
- **Entry:** reached after a number is selected on Number Selection.
- **Exit (Continue enabled):** `isValid` branches on the chosen path (`NewPostpaidWizard.tsx:399-404`): Physical → `s.simValid === true`; eSIM → `s.esimIssued === true`. If neither `simType` is set at all, `isValid` returns `false` (the `return false` fallback).
- **Auto-advance:** Physical only — `autoAdvanceWhen: (values) => s?.simType === 'Physical' && s.simValid === true` (`:410-413`). eSIM never auto-advances, deliberately: "Select eSIM" is "a choice to review... not a validation result to act on immediately" per the component's own comment.

## 6.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-06-ST01 | Default — both paths empty, Physical serial field auto-focused | Fresh arrival at the step |
| MPA-SCR-06-ST02 | Physical: scanning in progress | Click the barcode-icon trailing addon inside the SIM Serial Number field |
| MPA-SCR-06-ST03 | Physical: checking stock (post-entry, pre-validation) | Blur the field after typing/scanning a serial, mid-lookup |
| MPA-SCR-06-ST04 | Physical: validated — read-back `<dl>` (SIM Type/SIM Serial Number/ICCID/Stock Status) shown | A valid, in-stock serial resolves — **transient**: `autoAdvanceWhen` carries the wizard forward the instant `simValid` is true, so this state is visible only briefly (same "flash then advance" shape as the Eligibility panel's own clean-pass auto-advance); capture via slow-motion/pause if the harness allows, else best-effort per `phase1-boundary-map.md:107` |
| MPA-SCR-06-ST05 | Physical: not-found error | Enter/scan a serial absent from `sims.json` |
| MPA-SCR-06-ST06 | Physical: already-assigned error | Enter/scan a serial whose `stockStatus === 'Issued'` |
| MPA-SCR-06-ST07 | eSIM: pre-selection message | Default render, right panel, before clicking "Select eSIM" |
| MPA-SCR-06-ST08 | eSIM: issuing (transient, ~500 ms) | Click "Select eSIM" |
| MPA-SCR-06-ST09 | eSIM: selected — "eSIM selected" badge + explanatory copy, Continue now enabled | Issuance completes; this state persists (no auto-advance) until the agent clicks Continue |

## 6.4 UI elements and content
- **Two-column responsive grid** (`md:grid-cols-2`), Physical (left) and eSIM (right) shown side by side from the start — a 2026-09-28 rework from an earlier tab-pair design (component's own comment, `SimTypeStep.tsx:38-52`)
- **Physical column heading:** "Physical SIM" (h4)
- **SIM Serial Number field** (`SimSerialScanner`): label "SIM Serial Number", `required` attribute present unless `suppressValidation` (true only while eSIM is the agent's current choice — see §6.9), placeholder "Enter the SIM serial number, or use the barcode scanner", trailing barcode-icon button (aria-label "Scan SIM barcode") inside the field itself
- **Scanning feedback line:** "Scanning…" while a simulated scan runs; "Checking stock…" while post-entry validation runs; success `Badge` "SIM available in this store's stock" once validated in-stock (`SimSerialScanner.tsx:154-162`)
- **Physical validated read-back `<dl>`** (success-tinted card, only once `simType === 'Physical' && simValid`): rows "SIM Type" → "Physical", "SIM Serial Number" → the value, "ICCID" → value or "-", "Stock Status" → value or "-" (`SimTypeStep.tsx:97-116`)
- **eSIM column heading:** "eSIM" (h4)
- **eSIM pre-selection state:** "Select eSIM" primary button (label "Selecting eSIM…" while issuing) + caption, verbatim: *"The eSIM QR code is generated only after successful payment and order submission."* (`:143-154`)
- **eSIM selected state:** success `Badge` reading exactly **"eSIM selected"** (not "eSIM issued" — deliberate wording, see §6.8), body text `` `An eSIM activation QR code will be generated and sent to ${customerEmail ?? 'the customer'}.` ``, and a muted caption, verbatim: *"The eSIM QR code will be available only after successful payment and order submission - it is never shown active before then."* (`:127-141`)

**Design note on eSIM activation timing (per the task brief, understood but not re-documented here since it renders on a different screen):** the actual QR code / LPA string and the "Send to email" affordance live in `EsimActivationPanel` (`src/components/domain/EsimActivationPanel.tsx`), which is only rendered on the Order Confirmation screen (MPA-SCR-10, documented separately) — after payment and submission. `SimTypeStep` itself only *issues* the code (`generateActivationCode()`, an in-memory mock GSMA SGP.22-style `LPA:1$smdp.vodafone.qa$<16-char matching id>` string, `SimTypeStep.tsx:29-36`) and stores it in `values.simType.esimActivationCode`; it is never displayed as scannable or "active" on this screen. This is an explicit, code-enforced design guarantee, not merely a UI convention: `EsimActivationPanel` requires the order's provisioning to have already happened (component's own comment) and gates its own "Send to email" action on `verified` (does the account email match the MOI-registry email) — an unverified email is shown, not hidden, so the agent can see why sending is blocked, but nothing is ever sent to it.

## 6.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-06-001 | SIM Serial Number | Text input, barcode-scan trailing addon | Yes, unless eSIM is the current choice (`suppressValidation`) | Yes | empty | On blur, resolved against `mockDataEngine.list('sims')`: empty → MPA-VAL-006; not found → MPA-VAL-007; `stockStatus === 'Issued'` → MPA-VAL-008; else valid, `simValid: true` |
| MPA-FLD-06-002 | (derived, read-only) ICCID | Text, in the validated read-back `<dl>` | N/A | No | `found.iccid` from the matched `sims.json` record | none — display only |
| MPA-FLD-06-003 | (derived, read-only) Stock Status | Text, in the validated read-back `<dl>` | N/A | No | `found.stockStatus` from the matched `sims.json` record | none — display only |
| MPA-FLD-06-004 | eSIM selection | Button-triggered action, not a form field | Yes, alternative path to Physical | Yes (re-clickable? no — once `esimIssued` the button is replaced by the selected-state panel; no "change your mind back to Physical" affordance was found in source beyond re-focusing the Physical field directly, which sets `simType: 'Physical'` and overwrites the eSIM choice) | none | `esimIssued: true` on completion; no format validation, since nothing is typed |

## 6.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-06-001 | Barcode-scan trailing icon (SIM Serial field) | Icon button, `aria-label="Scan SIM barcode"` | Not currently scanning or checking | Runs a simulated scan: picks the first `sims.json` record with `stockStatus !== 'Issued'`, waits ~600 ms, fills the field, then runs the same validation as manual entry (`SimSerialScanner.tsx:101-114`) |
| MPA-BTN-06-002 | "Select eSIM" | Primary | `!issuing` | `generateEsim()` — 500 ms simulated delay, then sets `simType: 'eSIM', esimIssued: true, esimActivationCode: <generated>` |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Continue per §6.2 gate | Continue is effectively bypassed on the Physical path by auto-advance; remains the only forward control on the eSIM path |

## 6.7 User interactions
- Type or paste into SIM Serial Number → local state update only, no validation until blur (`onChange={(e) => onChange(e.target.value, false)}`)
- Blur the SIM Serial Number field → `validate(serial)` runs against `sims.json`; sets `simValid`/error/`inStock` accordingly
- Click the trailing barcode icon → simulated scan, auto-fills a genuinely-available serial from `sims.json` (never fabricates one) and immediately validates it
- On a valid, in-stock Physical serial → wizard auto-advances directly to Checkout (step 7, the immediately next step after SIM Type) — no manual Continue click needed
- Click "Select eSIM" → 500 ms simulated issuance, then shows the selected-state panel; does **not** auto-advance; agent must click Continue
- Switching from an issued eSIM back to typing in the Physical field re-sets `simType: 'Physical'` on that field's next `onChange`, effectively abandoning the eSIM choice (no explicit "undo eSIM" confirmation found in source)
- Keyboard: SIM Serial Number field is `autoFocus` on step arrival; barcode icon and "Select eSIM" are native `<button>` elements (Enter/Space activate)

## 6.8 Business rules
- MPA-BR-019 — eSIM-before-payment guarantee: the activation code/QR is generated at this step but never rendered as scannable here — only on `EsimActivationPanel` post-payment (MPA-SCR-10) — and the on-screen copy is deliberately "eSIM **selected**", not "eSIM **issued**", because (per the component's own comment) "the profile is not live" and "the walkthrough is explicit that an eSIM must not reach the customer before payment." Not a numbered BR in `business-rules.json` — a UX/process guarantee stated directly in source comments, not backed by a separate rule-engine entry.
- MPA-BR-020 — Physical/eSIM mutual exclusivity as validation alternatives: "Require either eSIM selection or SIM Serial Number" (2026-09-28 direction quoted in `SimTypeStep.tsx:71-76`) — selecting eSIM suppresses the Physical panel's own blur validation (`suppressValidation`) rather than requiring both to be satisfied.

## Prompt 7b — MPA-SCR-06 — SIM Type (continued)

## 6.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Physical validated read-back `<dl>` | `value.simType === 'Physical' && value.simValid` | MPA-DP-040 |
| SIM Serial Number field's blur validation / required asterisk / inline error | Suppressed (`suppressValidation`) when `value.simType === 'eSIM'`; active otherwise | MPA-DP-041 |
| eSIM pre-selection button + caption | `!(value.simType === 'eSIM' && value.esimIssued && value.esimActivationCode)` | MPA-DP-042 |
| eSIM selected-state panel (badge, body text, caption) | `value.simType === 'eSIM' && value.esimIssued && value.esimActivationCode` all truthy | MPA-DP-043 |
| "Scanning…" line | `scanning` true (during the ~600 ms simulated scan) | MPA-DP-044 |
| "Checking stock…" line | `checking` true and not `scanning` | MPA-DP-045 |
| "SIM available in this store's stock" badge | `inStock` true and neither `checking` nor `scanning` | MPA-DP-046 |

## 6.10 Validation and error handling
- MPA-VAL-006 — SIM Serial required. Exact message: `"SIM Serial is required."` (`SimSerialScanner.tsx:71`). Triggered on blur with an empty field (and only when `suppressValidation` is false). Recovery: enter or scan a serial.
- MPA-VAL-007 — Serial not found. Exact message: `"SIM not found in this store's stock."` (`:83`, and reused at `:108` for the "no available SIM to scan" branch). Recovery: try a different serial, or use the barcode scan which self-selects an available one.
- MPA-VAL-008 — Serial already assigned. Exact message: `"This SIM is already assigned."` (`:88`). Recovery: enter a different, unissued serial.
- No dedicated error path exists for the eSIM button beyond its own disabled-while-issuing state — no failure branch (e.g. "issuance failed") was found in `generateEsim()`; it always succeeds after the simulated delay.

## 6.11 Integration trigger points
- MPA-INT-012 — SIM inventory read/validate (trigger point only — `mockDataEngine.list('sims')`, called both from the scan action and from blur-validation, `SimSerialScanner.tsx:76`, `:103`)
- MPA-INT-013 — eSIM activation code generation (trigger point only — local mock generator, no external SM-DP+/provisioning API call; explicitly not fabricated as a live integration per the component's own comment, `SimTypeStep.tsx:26-36`)

## 6.12 Navigation behaviour
MPA-NAV-013 (Physical, valid → auto-advance to Checkout, no Continue click required). MPA-NAV-014 (eSIM, issued → manual Continue to Checkout, no auto-advance). Standard shell nav (Back/Save & Exit/Abandon) otherwise unchanged.

## 6.13 Related edge cases
- MPA-SCN-026 — Physical auto-advance is a "flash then advance" transient state: the validated read-back `<dl>` (MPA-SCR-06-ST04) is genuinely visible for a moment before the wizard moves on, same pattern as the Eligibility panel's own clean-pass auto-advance on Contact (MPA-SCR-01) — both need slow-motion capture to screenshot reliably.
- MPA-SCN-027 — An agent who selects eSIM, then clicks back into the (still-rendered) Physical serial field and types something, silently overwrites `simType` back to `'Physical'` — there is no explicit "switch away from eSIM" confirmation, and the previously generated `esimActivationCode` is discarded from `values.simType` the next time `onChange` fires from the Physical panel (both panels share the same `value` object and only one `simType` can be current at a time).
- MPA-SCN-028 — Rail click-back to SIM Type after auto-advance re-opens the real, already-validated Physical state (the wizard shell's own "does not re-skip on rail click-back" behaviour, documented in [00-wizard-shell.md](00-wizard-shell.md)); this screen has no `skip()` of its own, only `autoAdvanceWhen`, consistent with the shell note that `autoAdvanceWhen` never retroactively re-fires.

## 6.14 Persona-specific behaviour
None found conditional on role within `SimTypeStep.tsx` or `SimSerialScanner.tsx` (preliminary — Phase 9 will grep exhaustively). All 5 granted roles see identical SIM Type behaviour; the simulated inventory check (`sims.json`) is not scoped by store/agent identity in source.

## 6.15 Accessibility
To be completed live in Phase 12.

## 6.16 Source references
- `NewPostpaidWizard.tsx:386-414` (step wiring, isValid gate, autoAdvanceWhen)
- `SimTypeStep.tsx` (full component)
- `SimSerialScanner.tsx` (full component — scan simulation, blur validation, error text)
- `src/components/domain/EsimActivationPanel.tsx` (full component — read for context only; renders on MPA-SCR-10, not this screen)
- `public/mock-data/sims.json` (serial/ICCID/stockStatus fixtures, referenced not enumerated here)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/phase1-boundary-map.md:107` (prior note on ST03/auto-advance transience, cited not re-derived)

## Prompt 8 — MPA-SCR-07 — Checkout

Route: step 7 of 9 in the wizard rail (key `checkout`). Component: `CheckoutSummaryStep` (`src/components/patterns/CheckoutSummaryStep.tsx`, full file, 565 lines), wired at `NewPostpaidWizard.tsx:415-451`.

## 7.1 Purpose
Read-only order summary presented before CAF generation — consolidates every prior step's selections (contact, plan, discount, add-ons, number, SIM type) and computes what is due today versus the ongoing monthly recurring charge, so the agent can read the customer a single reconciled figure before the CAF is drafted. It is also the single computation point for three downstream artefacts, published via callback rather than recomputed later: `onTotalsComputed` (→ Payment's amount due, and the order/confirmation figures), `onSummaryComputed` (→ CAF's customer-facing recap), `onLegalFactsComputed` (→ CAF's dynamic T&C bullets).

## 7.2 Entry / exit conditions
- **Entry:** reached from SIM Type via Continue, or auto-advance when a Physical SIM scan validates (`NewPostpaidWizard.tsx:410-413`).
- **Exit (Continue enabled):** always — `isValid: () => true` (`NewPostpaidWizard.tsx:450`). This step has no gate of its own; it is pure read-back.
- **Alternate exit:** "Edit" button — `onEdit={() => goToStepKey('plan')}` (`NewPostpaidWizard.tsx:446`), jumps back to the Plan & Add-ons step. The agent then walks Continue forward through Number Selection and SIM Type again; both retain their prior values (`CheckoutSummaryStep.tsx:115-120`), so this re-opens only the plan/discount/add-ons/bill-limit choice, not a full re-walk.

## 7.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-07-ST01 | Default — Free number, no discount, no add-ons, no HRN | Plan with no commitment/discount selected, MSISDN below QAR 1,000 |
| MPA-SCR-07-ST02 | Plan with commitment + discount + add-ons | Select a plan with `commitmentMonths`, apply a discount, add 1+ add-ons |
| MPA-SCR-07-ST03 | Star number within plan entitlement (no overage) | Select a Star number (≥ QAR 1,000) whose price is ≤ `plan.mrcQAR × 25` |
| MPA-SCR-07-ST04 | Star number exceeding plan entitlement (overage billed) | Select a Star number priced above the plan's entitlement |
| MPA-SCR-07-ST05 | HRN advance applies | `eligibility.requiresHrnAdvance === true` — **flagged unreachable in this build**, see §7.8/§7.13 |
| MPA-SCR-07-ST06 | Billing Profile shown (existing account) | Billing Profile step selected an existing profile |
| MPA-SCR-07-ST07 | Billing Profile shown (new account) | Billing Profile step created a new profile |
| MPA-SCR-07-ST08 | Physical SIM — SIM Number/ICCID row populated | SIM Type step completed with a scanned physical SIM |
| MPA-SCR-07-ST09 | eSIM — "active after payment" row | SIM Type step completed with eSIM issuance |
| MPA-SCR-07-ST10 | Credit limit / Bill limit rows, agent never touched Bill Limit | `eligibility.defaultCreditLimitQar` set, `billLimit` undefined → "Up to QR {creditLimit}" |
| MPA-SCR-07-ST11 | Credit limit / Bill limit rows, agent set a Bill Limit | `billLimit` set via Plan & Add-ons' BillLimitEditor |

**Flagged unreachable in this build:** the HRN-advance state (ST05) — see §7.8.

## 7.4 UI elements and content
- Helper line + Edit button row: *"Review with the customer before generating the CAF."* (`CheckoutSummaryStep.tsx:413`), Edit button right-aligned (`ghost-rect`, compact)
- **Agent-facing `<dl>` card** (`border border-border-soft bg-surface`), row order fixed (`CheckoutSummaryStep.tsx:429-496`):
  1. Customer Name
  2. Alternate phone #
  3. Plan — `"{name} - QR {mrc}/mo"`, detail: `"{months}-month lock-in"` or `"No lock-in"`
  4. Discount *(conditional)* — `"{name} ({pct}%) - {discountQar}/mo"`, detail: `"Valid {months} months"` or `"No expiry"`
  5. Add-ons — every activated add-on with price and, if the catalogue carries one, data allowance in GB; `"None"` if empty
  6. Number — `"{msisdn} - Star/Free"`, detail: composed from Star value, BR-115 entitlement/overage text, `"Discount: None"` (literal — no per-number discount concept exists in the catalogue), and lock-in text
  7. Credit limit *(conditional)*
  8. Bill limit *(conditional)* — detail: `"Capped at the QR {creditLimit} credit limit"`
  9. Billing *(conditional)*
  10. VAT (labelled `"VAT ({rate}%)"`) — value `"{vatQar}/mo"`
  11. HRN advance payment *(conditional, flagged unreachable — see §7.8)*
- **Due Today itemisation card** (`border border-accent/40 bg-surface-warm`, `CheckoutSummaryStep.tsx:499-561`):
  1. "Due today" — bold total
  2. "Star Number charge" *(conditional, isStarNumber)*, with nested caption `"QR {sticker} sticker price, QR {entitlement} entitled on this plan"` shown only when an overage is actually billed
  3. "Upfront / HRN fee" *(conditional, hrnAdvance > 0 — unreachable, §7.8)*
  4. "First month's bill (approximate)" with caption `"{proratedDays} of {cycleDays} days this cycle, plus one month in advance"`
  5. "Recurring monthly bill, from month 2"
  6. Reserved placeholder box (dashed border): *"Full second-bill breakdown"* / *"Reserved - detailed content not yet designed."* — explicitly unimplemented content, not a bug

## 7.5 Field specifications
All rows are read-only displays computed from prior-step values plus three mock catalogues (`products`, `addons-discounts`, `star-number-tiers`). "Type" is `read-only display` for every row below.

**Agent-facing `<dl>` (11 possible rows):**
| ID | Label | Mandatory (always shown) | Default/source |
|---|---|---|---|
| MPA-FLD-07-001 | Customer Name | Yes | `contact.moiResult.name` |
| MPA-FLD-07-002 | Alternate phone # | Yes | `contact.altPhone` |
| MPA-FLD-07-003 | Plan | Yes | selected `productId` resolved against `products` |
| MPA-FLD-07-004 | Discount | No — only if `discountId` set | `addons-discounts` |
| MPA-FLD-07-005 | Add-ons | Yes (shows "None") | `addonIds` resolved against `products` |
| MPA-FLD-07-006 | Number | Yes | `msisdn` + `numberPriceQar` |
| MPA-FLD-07-007 | Credit limit | No — only if `eligibility.defaultCreditLimitQar !== undefined` | `EligibilityResult.defaultCreditLimitQar` |
| MPA-FLD-07-008 | Bill limit | No — same condition as 007 | agent-set `billLimit`, or fallback cap text |
| MPA-FLD-07-009 | Billing | No — only if `billingMethod` computed | `billingAccount.selectedProfileId` / `newAccount` (`NewPostpaidWizard.tsx:425-429`) |
| MPA-FLD-07-010 | VAT (n%) | Yes | `postpaidPricing.VAT_RATE` (5%, assumed — see MPA-BR-021) |
| MPA-FLD-07-011 | HRN advance payment | No — `hrnAdvance > 0`; **unreachable**, see §7.8 | `eligibility.requiresHrnAdvance` × `HRN_ADVANCE_QAR` |

**Due Today card (6 rows/blocks):**
| ID | Label | Mandatory | Default/source |
|---|---|---|---|
| MPA-FLD-07-012 | Due today | Yes | `numberChargeQar + hrnAdvance` |
| MPA-FLD-07-013 | Star Number charge | No — `isStarNumber` | `starNumberOverageQar()` |
| MPA-FLD-07-014 | Upfront / HRN fee | No — unreachable, §7.8 | `HRN_ADVANCE_QAR` constant (100) |
| MPA-FLD-07-015 | First month's bill (approximate) | Yes | `firstBillCharges()` |
| MPA-FLD-07-016 | Recurring monthly bill, from month 2 | Yes | `monthlyCharges().totalQar` |
| MPA-FLD-07-017 | Full second-bill breakdown | Yes (placeholder text, not data) | none — "not yet designed" |

**Customer-facing summary rows** (`onSummaryComputed`, published to `values.cafSummary`, consumed by MPA-SCR-08's `orderSummary` prop — `CheckoutSummaryStep.tsx:252-347`), exact order:
| ID | Label | Mandatory | Notes |
|---|---|---|---|
| MPA-FLD-07-018 | Customer Name | Yes | |
| MPA-FLD-07-019 | Selected Number | Yes | `"{msisdn} ({Star|Free})"` |
| MPA-FLD-07-020 | Number Value | Yes | Star: `"QR {x} one-time"`; Free: `"QR {x} (no charge to customer)"` |
| MPA-FLD-07-021 | Plan | Yes | `plan.name` |
| MPA-FLD-07-022 | Plan Price | Yes | `"QR {mrc}/mo"` |
| MPA-FLD-07-023 | Discount | Yes (shows "None") | |
| MPA-FLD-07-024 | Discount Duration | Yes | `"{n} months"` / `"No expiry"` / `"N/A"` |
| MPA-FLD-07-025 | Add-ons | Yes (shows "None") | |
| MPA-FLD-07-026 | SIM Type | Yes | `simType?.simType ?? '-'` |
| MPA-FLD-07-027 | SIM Number / ICCID | Yes | Physical: serial (+ICCID); eSIM: `"eSIM - active after payment and order submission"` — activation code itself deliberately withheld pre-payment |
| MPA-FLD-07-028 | Plan Lock-in | Yes | |
| MPA-FLD-07-029 | Star Number Lock-in | No — `isStarNumber` only | |
| MPA-FLD-07-030 | Star Number Charges | No — `isStarNumber` only | |
| MPA-FLD-07-031 | Key Charges | Yes | `"QR {due} today · QR {firstBill} first bill · QR {recurring}/mo thereafter"` |
| MPA-FLD-07-032 | Cancellation Implications | Yes | composed sentence(s) or fallback "no lock-in" statement |
| MPA-FLD-07-033 | Total Payable Today | Yes | total + optional `"(includes ...)"` breakdown |
| MPA-FLD-07-034 | Prorated First Bill | Yes | |
| MPA-FLD-07-035 | Approximate Subsequent Bill | Yes | |

**Callback payload shapes** (`CheckoutSummaryStep.tsx:43-62`):
- `CheckoutTotals`: `{ dueTodayQar, monthlyRecurringQar, hrnAdvanceQar }` — stored as `values.checkoutTotals`; consumed by the Payment step (`amountDueQAR`) and by `onSubmit` for the order record and confirmation summary.
- `TncLegalFacts`: `{ planCommitmentMonths?, starLockInMonths?, discountName?, discountDurationMonths?, hrnAdvanceQar }` — stored as `values.legalFacts`; consumed by MPA-SCR-08's `buildTncBullets()`. Raw numeric facts, not pre-formatted strings, so they can be substituted into a wording template.

## 7.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-07-001 | Edit | Secondary (`ghost-rect`, compact) | Always | `goToStepKey('plan')` (`NewPostpaidWizard.tsx:446`) |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | — | Continue always enabled (`isValid: () => true`) | See [00-wizard-shell.md](00-wizard-shell.md) |

## 7.7 User interactions
- On mount: three `mockDataEngine.list()` fetches (`products`, `addons-discounts`, `star-number-tiers`), no user action required
- No text/selection inputs on this screen — it is entirely derived
- Click Edit → `goToStepKey('plan')`; returning agent walks Continue through Number/SIM Type again with prior values retained
- Effects recompute and re-publish `onTotalsComputed`/`onLegalFactsComputed`/`onSummaryComputed` whenever their numeric/id dependencies change (`CheckoutSummaryStep.tsx:215-364`) — not on every render
- Keyboard: standard tab order; Edit is a native button (Enter/Space activates)

## 7.8 Business rules
- MPA-BR-022 — BR-115 Star Number Entitlement: a plan's MRC entitles the customer to a Star number worth up to `MRC × 25` at no extra one-time charge; only the amount above that is billed (`STAR_NUMBER_ENTITLEMENT_MULTIPLIER`, `postpaidPricing.ts:55-73`; applied `CheckoutSummaryStep.tsx:181-188`). The 25× figure is confirmed (2026-09-28) over a competing 50× figure that surfaced in the same request.
- MPA-BR-023 — HRN advance amount: fixed QAR 100 flat, per BR-112 as cited in `postpaidPricing.ts:31-43` ("driven by nationality and sales channel; explicitly confirmed to NOT be driven by plan value"). **Confirmed unreachable in this journey** — see below.
  - **Reachability check performed directly for this file:** only one seeded customer (`CUST-1002`, Bimal Thapa) has `hrnAdvancePaymentRequired: true` in `public/mock-data/customers.json`, and that customer's only identity document in `public/mock-data/identity-documents.json` is a `Passport`. This journey's Contact step (`NewPostpaidWizard.tsx:188`) allows only QID and Diplomatic ID — Passport is explicitly in `unavailableIdTypes`. No fixture reachable through this journey's Contact step can set `eligibility.requiresHrnAdvance === true`, so MPA-FLD-07-011, MPA-FLD-07-014, and the HRN-advance bullet on MPA-SCR-08 are all unreachable in the current build/fixture set — not merely unlikely. This matches MPA-SCR-01 §1.8's MPA-BR-024 finding (BR-187, same underlying constraint, different rule id) and independently confirms it against `EligibilityGateStep.tsx:353` (`hrnFlag = Boolean(match.hrnAdvancePaymentRequired)`).
- MPA-BR-025 — Free/Star price boundary: numbers priced below QAR 1,000 are "free to the customer" regardless of catalogue price; QAR 1,000+ is a Star number (`FREE_NUMBER_PRICE_CEILING_QAR`, `postpaidPricing.ts:45-53`). App-level direction (2026-09-28), not tied to an evidenced BR-number in the corpus.
- MPA-BR-021 — VAT rate: 5%, **assumed, not evidenced** (`postpaidPricing.ts:18-29`) — no corpus document states a VAT rate or whether postpaid charges are quoted inclusive/exclusive; logged in `reference/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md` per the code's own comment.
- MPA-BR-026 — First-bill proration: evidenced wording ("your first month's charges will be prorated, plus the full charge of your plan for the following month" — four corpus CAF/guided-journey documents), **assumed cycle day** (defaults to the 1st of the calendar month — the function's own assumption, not a business rule; `postpaidPricing.ts:151-178`).
- MPA-BR-027 — Bill limit cap = account credit limit ("Maximum Bill Limit equals account Credit Limit" — `business-rules.json`, cited `CheckoutSummaryStep.tsx:190-194`). This journey has no Bill Limit editor of its own value to show by default, so the cap is what's displayed absent an agent-set figure.

## Prompt 8b — MPA-SCR-07 — Checkout (continued)

## 7.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Discount row (agent `<dl>`) | `discountId` resolves to a catalogue discount | MPA-DP-047 |
| Credit limit / Bill limit rows | `eligibility.defaultCreditLimitQar !== undefined` | MPA-DP-048 |
| Billing row | `billingMethod` computed (an existing or new Billing Profile chosen) | MPA-DP-049 |
| HRN advance payment row (agent `<dl>`) | `eligibility.requiresHrnAdvance === true` — unreachable, §7.8 | MPA-DP-050 |
| Star Number charge line (Due Today card) | `isStarNumber` (`numberDelta ≥ 1000`) | MPA-DP-051 |
| Star Number sticker/entitlement caption | `numberChargeQar > 0` (actual overage billed) | MPA-DP-052 |
| Upfront/HRN fee line (Due Today card) | `hrnAdvance > 0` — unreachable, §7.8 | MPA-DP-053 |
| Star Number Lock-in / Charges rows (customer summary) | `isStarNumber` | MPA-DP-054 |

## 7.10 Validation and error handling
None. This screen has no editable fields and no `isValid` gate beyond the constant `true` (§7.2) — it is a pure read-back of upstream state.

## 7.11 Integration trigger points
Trigger point only — not a live integration in the current implementation.
- MPA-INT-014 — `mockDataEngine.list('products')` (`CheckoutSummaryStep.tsx:154`)
- MPA-INT-015 — `mockDataEngine.list('addons-discounts')` (`CheckoutSummaryStep.tsx:155-159`)
- MPA-INT-016 — `mockDataEngine.list('star-number-tiers')` (`CheckoutSummaryStep.tsx:160`)

All three read local static JSON under `public/mock-data/`; no network call, no external pricing/inventory service.

## 7.12 Navigation behaviour
- MPA-NAV-015 — Edit button → `goToStepKey('plan')`, jumps directly to Plan & Add-ons (bypassing Number/SIM Type without discarding their values)
- MPA-NAV-016 — Continue → CAF & Signature (MPA-SCR-08), always available (`isValid: () => true`)

## 7.13 Related edge cases
- MPA-SCN-029 — Star number fully within plan entitlement: "No extra charge" text renders, no Star Number charge line in the Due Today card
- MPA-SCN-030 — Star number overage: entitlement/sticker-price caption renders alongside a nonzero Star Number charge
- MPA-SCN-031 — No discount selected: Discount row omitted from the agent `<dl>`; customer-facing Discount/Discount Duration rows show "None"/"N/A"
- MPA-SCN-032 — HRN advance required: **flagged unreachable in this build** — see MPA-BR-023's fixture-level confirmation; if it were reachable, an extra Due Today line and customer-facing row would appear, but no seeded customer combination can trigger it through this journey's Contact step
- MPA-SCN-033 — Edit round-trip: agent clicks Edit, changes plan/discount/add-ons/bill-limit, walks Continue back through Number Selection and SIM Type (both pre-filled, unchanged), lands back on Checkout with updated totals

## 7.14 Persona-specific behaviour
None found conditional on role within this screen's own component (`CheckoutSummaryStep.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.

## 7.15 Accessibility
To be completed live in Phase 12.

## 7.16 Source references
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:415-451` (step wiring, `isValid`, prop plumbing)
- `src/components/patterns/CheckoutSummaryStep.tsx` (full file — component, `CheckoutTotals`/`TncLegalFacts` types, all row content)
- `src/engines/postpaidPricing.ts` (full file — `VAT_RATE`, `HRN_ADVANCE_QAR`, `FREE_NUMBER_PRICE_CEILING_QAR`, `STAR_NUMBER_ENTITLEMENT_MULTIPLIER`, `starNumberOverageQar`, `monthlyCharges`, `firstBillCharges`, `formatQar`)
- `src/components/domain/EligibilityGateStep.tsx:353` (`hrnFlag` derivation)
- `public/mock-data/customers.json`, `public/mock-data/identity-documents.json` (fixture-level HRN-reachability check performed for this file)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/screen-01-contact.md` §1.8 MPA-BR-024 (parallel HRN-unreachability finding, different rule id — BR-187 vs BR-112)

## Prompt 9 — MPA-SCR-08 — CAF & Signature

Route: step 8 of 9 in the wizard rail (key `caf`). Component: `CafSignatureCapture` (`src/components/patterns/CafSignatureCapture.tsx`, full file, 409 lines) called with `autoDetectDeviceType` (Postpaid-only opt-in), wired at `NewPostpaidWizard.tsx:452-501`.

## 8.1 Purpose
Auto-detect the signing device type, present the customer with a CAF preview plus a dynamic, business-maintained Terms & Conditions bullet summary and the commercial recap carried forward from Checkout, capture an in-app signature, then — once signed — let the agent review the signed CAF and attach any additional supporting documents. This is the **only step in this journey** with `customerFacing` and `locksAfter` step-level behaviour (`NewPostpaidWizard.tsx:490-501`).

## 8.2 Entry / exit conditions
- **Entry:** reached from Checkout via Continue (always enabled there).
- **Exit (Continue enabled) — `isValid`** (`NewPostpaidWizard.tsx:480-484`):
  ```
  if (!c?.cafType) return false;
  return c.cafType !== 'Digital' || Boolean(c.signatureDataUrl);
  ```
  Given `autoDetectDeviceType` only ever sets `cafType` to `'Digital'` or `'Touch Screen'` (§8.8, MPA-BR-028), this predicate behaves asymmetrically by detected type — see the discrepancy documented at MPA-BR-029.
- **`customerFacing`** (`NewPostpaidWizard.tsx:490-494`) uses the negation of the same predicate. While `customerFacing` is true, `GuidedActivationWizard` strips ALL chrome for this render — no rail, no Abandon/Save & Exit, no wizard heading, no Back/Continue footer (`GuidedActivationWizard.tsx:535-547`) — leaving only `CafSignatureCapture`'s own render output in a centred `max-w-2xl` column.
- **`locksAfter`** (`NewPostpaidWizard.tsx:498-501`) reuses the exact same predicate again. Once any step through the current one returns `locksAfter: true`, the whole journey locks: Back is hidden, the rail stops accepting clicks even for previously-reached steps, and this state persists into Payment and Confirmation (there is no unlock mechanism).

## 8.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-08-ST01 | Detecting device type (transient) | Instant on mount, before `detectCafType()`'s effect resolves `cafType` |
| MPA-SCR-08-ST02 | Customer-facing signing screen — Digital device, unsigned | Non-touch device; bullets + commercial recap + "Please Sign" button, no wizard chrome |
| MPA-SCR-08-ST03 | Signed — Digital, post-signature agent view | Signature captured; wizard chrome restored, "Signed" badge + signature image, Additional Documents panel visible |
| MPA-SCR-08-ST04 | Touch Screen device detected — pre-signature, already locked/valid | Touch-capable device (`maxTouchPoints > 0` or `pointer: coarse`) — see MPA-BR-029 discrepancy; Continue is clickable and the journey is locked before any signature exists |
| MPA-SCR-08-ST05 | Touch Screen — agent signs anyway | Agent voluntarily presses "Please Sign" on a Touch Screen device even though the gate did not require it |
| MPA-SCR-08-ST06 | Bullets: plan lock-in only | Plan with `commitmentMonths`, no discount, no Star number |
| MPA-SCR-08-ST07 | Bullets: plan + discount (with expiry) | Plan with commitment + a discount carrying `durationMonths` |
| MPA-SCR-08-ST08 | Bullets: plan + discount (no expiry) | Discount with `durationMonths: null` |
| MPA-SCR-08-ST09 | Bullets: plan + Star lock-in | Star number selected at Number Selection, banded to a tier |
| MPA-SCR-08-ST10 | Bullets: fallback "no minimum commitment" | No plan commitment, no Star number, no discount |
| MPA-SCR-08-ST11 | Additional Documents — empty state | Immediately post-signature, no documents added yet |
| MPA-SCR-08-ST12 | Additional Documents — 1+ attached | Agent labels and browses a file |
| MPA-SCR-08-ST13 | Additional Documents — validation error (missing label) | Agent clicks Browse with an empty label field (button is actually disabled in this state, see §8.10) |
| MPA-SCR-08-ST14 | Additional Documents — file-too-large error | File > 5 MB selected |
| MPA-SCR-08-ST15 | Additional Documents — 10-document limit reached | 10 documents already attached |

**Confirmed unreachable in this build:** the HRN-advance bullet (`hrn-advance` scenario key) — see §8.8, same fixture-level finding as MPA-SCR-07 §7.8/MPA-BR-030.

## 8.4 UI elements and content
- **Heading:** `"Please review and sign"` — renders only while `!signed` (`CafSignatureCapture.tsx:194`); stands in for the wizard's own `<h1>`, which is hidden while `customerFacing` is true.
- **CAF preview card:** header row `"Vodafone Customer Application Form"` / Arabic `"نموذج طلب عميل فودافون"` (`dir="rtl"`); `"Applicant: {customerName}"`; `idLabel`/`idValue` rows — **not passed by this journey** (`NewPostpaidWizard.tsx:456-478` omits both props), so these rows never render for MPA-SCR-08 specifically; disclaimer text verbatim: *"By signing below, the applicant accepts the General Terms and Conditions of Vodafone Qatar."*; either a "Signed" success badge + signature image, or a "Please Sign" primary button.
- **Key Information panel** (renders only while `!signed` and content exists): heading `"Key Information"` (renamed 2026-09-28 to match the shared heading other journeys use); dynamic bullet `<ul>` from `buildTncBullets()`; commercial `<dl>` fed by `orderSummary` (the exact 18-row set published by MPA-SCR-07's `onSummaryComputed` — not duplicated here, see MPA-SCR-07 §7.5); fallback line: *"For anything not covered above, [View Full Terms & Conditions]."* linking to `termsUrl="https://www.vodafone.qa/en/terms-and-conditions"`.
- **Signature Pad drawer** — title "Please Sign"; see MPA-SCR-14 for the shared component's own field/interaction detail (not duplicated here).
- **Post-signature Additional Documents panel** (`AdditionalDocumentsUpload`, renders only once `signed`): heading `"Additional documents"`; description verbatim: *"Optional - label and attach anything else this order needs. No signature required. Up to 10 files, 5 MB each."*; document list (icon, filename, `"{label} · {size}"`, remove button); "Document label" text input; "Browse…" button (disabled until label is non-empty); inline error region.

## 8.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-08-001 | CAF Type | Auto-detected, not a manual picker under this journey | Yes (implicit) | No — set once by `detectCafType()`, never re-offered | `navigator.maxTouchPoints > 0 \|\| matchMedia('(pointer: coarse)')` → `'Touch Screen'`, else `'Digital'` (`CafSignatureCapture.tsx:38-42`) | n/a |
| MPA-FLD-08-002 | Signature | Drawn signature, captured as data URL | Effectively yes for Digital, **not enforced for Touch Screen** — see MPA-BR-029 | Yes, via Signature Pad drawer (MPA-SCR-14) | none until captured | n/a — no format validation, presence is the whole gate (and only enforced for Digital) |
| MPA-FLD-08-003 | Additional Document — Label | Free text | Yes, per document | Yes | agent-typed | Must be non-empty (trimmed) before Browse is enabled/before upload proceeds — MPA-VAL-009 |
| MPA-FLD-08-004 | Additional Document — File | File picker, `.pdf,.jpg,.jpeg,.png` | Yes, per document | Yes | agent-selected | ≤ 5 MB — MPA-VAL-010; total documents ≤ 10 — MPA-VAL-011 |

## 8.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-08-001 | Please Sign | Primary | Always (while unsigned) | Opens the Signature Pad drawer (MPA-SCR-14) |
| MPA-BTN-08-002 | Browse… | Secondary (`ghost-rect`) | `label.trim()` non-empty AND < 10 documents attached | Opens native file picker; on selection, validates size and appends to `additionalDocuments` |
| MPA-BTN-08-003 | Remove document (trash icon) | Tertiary, per row | Always, per attached document | Removes that document from `additionalDocuments` |
| MPA-BTN-08-004 | "View Full Terms & Conditions" | Link | `termsUrl` provided (always, for this journey) | Opens `termsUrl` in a new tab (`target="_blank" rel="noreferrer"`) |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | — | Back hidden once locked; Continue per §8.2's `isValid` (subject to the MPA-BR-029 discrepancy) | See [00-wizard-shell.md](00-wizard-shell.md). Abandon is still visible on this step (it disappears only from Payment onward — `hideAbandonFrom="payment"`) but is functionally moot once `locksAfter` fires, since Back/rail are already frozen at that point. |

## 8.7 User interactions
- Mount → `detectCafType()` effect fires once, guarded on `!value.cafType` so a returning agent's recorded type is never silently replaced (`CafSignatureCapture.tsx:174-178`)
- Click "Please Sign" → opens Drawer with `SignaturePad` → draw → "Done" → `signatureDataUrl` set, drawer closes (see MPA-SCR-14 for the pad's own Clear/Done interaction)
- Once signed (`showsInAppSignature && signatureDataUrl`): "Please review and sign" heading disappears, Key Information panel disappears, "Signed" badge + signature thumbnail render, Additional Documents panel appears
- Type a document label → local state; error clears on change
- Select a file via Browse → validated (label present, size ≤ 5 MB, count < 10) → appended or rejected with an inline message
- Click a document's trash icon → removed immediately, no confirmation
- Keyboard: standard tab order; Please Sign/Browse/remove are native buttons (Enter/Space activate)

## 8.8 Business rules
- MPA-BR-028 — Runtime device-capability detection (`detectCafType()`, `CafSignatureCapture.tsx:38-42`): real hardware capability, not a persona/channel guess. Resolves only to `'Digital'` or `'Touch Screen'` — `'Manual'` (paper) is unreachable under `autoDetectDeviceType`, by design (the component's own comment, lines 27-37: Manual was always an agent override for an edge case such as a system outage, not a device type, so there is nothing for a capability check to detect it from).
- MPA-BR-031 — Dynamic T&C bullet system (`tnc-summary-bullets.json` + `buildTncBullets()`, `CafSignatureCapture.tsx:49-87`). **App-level demo addition, not evidenced legal text** — the JSON's own `_note` field states no evidenced T&C wording exists in the corpus for these scenarios; templates are representative and business-owner-editable. Scenario keys and reachability in this journey:
  - `plan-lockin` — reachable whenever the chosen plan carries `commitmentMonths`
  - `star-lockin` — reachable only when a Star number (≥ QAR 1,000, banded to a tier) was selected at Number Selection
  - `discount-expiry` / `discount-no-expiry` — reachable whenever a discount is chosen, branching on whether it has a `durationMonths`
  - `hrn-advance` — **confirmed unreachable in this journey**, same fixture-level finding as MPA-SCR-07 §7.8 (MPA-BR-030): the only customer fixture with `hrnAdvancePaymentRequired: true` carries a Passport, an ID type this journey's Contact step disallows
  - `no-lockin` — fallback, renders only when none of the above bullets fired (`CafSignatureCapture.tsx:82-85`)
- MPA-BR-029 — **Discrepancy, source-confirmed, not an inference.** The CAF step's `isValid`, `customerFacing`, and `locksAfter` predicates (`NewPostpaidWizard.tsx:480-501`) all reuse one condition — `Boolean(cafType) && (cafType !== 'Digital' || Boolean(signatureDataUrl))` — carried over unchanged from the pre-`autoDetectDeviceType` three-way CAF-Type picker model, where Manual/Touch Screen meant "signed off-screen" and therefore never needed `signatureDataUrl`. Under `autoDetectDeviceType`, `detectCafType()` can resolve `'Touch Screen'`, and for that value the shared predicate evaluates `true` the instant `cafType` is set — **before any in-app signature is captured** — because `cafType !== 'Digital'` alone already satisfies the OR. This directly contradicts `CafSignatureCapture.tsx`'s own documented intent (lines 116-124: *"CAF-Touch Screen requires the SAME in-app signature CAF-Digital does ... both detectable outcomes now mean 'sign on THIS screen'"*).
  - **Practical effect on a touch-capable device:** the moment device detection resolves to `'Touch Screen'` on mount, `isValid` returns `true` (Continue becomes clickable), `customerFacing` returns `false` (the customer-facing "Please review and sign" presentation never displays, or displays only for the single render before detection resolves), and `locksAfter` returns `true` (Back hides, the rail freezes) — all without a signature ever having been captured. An agent could click Continue straight through to Payment with `values.caf.signatureDataUrl` still `undefined`, i.e. an **unsigned CAF is possible for touch-capable devices** in this build. The in-page UI (§8.4) still shows a "Please Sign" button in that state — signing is not blocked, only not enforced.
  - This is scoped strictly to `'Touch Screen'`; the `'Digital'` branch is unaffected, since for `cafType === 'Digital'` the predicate's left disjunct is false and `Boolean(signatureDataUrl)` must be true to satisfy it.

## Prompt 9b — MPA-SCR-08 — CAF & Signature (continued)

## 8.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| "Please review and sign" heading | `!signed` | MPA-DP-055 |
| Key Information panel (bullets + commercial recap) | `!signed && (bullets.length > 0 \|\| orderSummary.length > 0)` | MPA-DP-056 |
| Bullet `<ul>` | `bullets.length > 0` | MPA-DP-057 |
| `orderSummary` `<dl>` | `orderSummary && orderSummary.length > 0` | MPA-DP-058 |
| "View Full Terms & Conditions" link | `termsUrl` provided (always, this journey) | MPA-DP-059 |
| Additional Documents panel | `signed === true` | MPA-DP-060 |
| `idLabel`/`idValue` rows | `idLabel` provided | MPA-DP-061 — **unreachable**: `NewPostpaidWizard.tsx:456-478` never passes these props for this journey |
| "Signed" badge + signature image vs "Please Sign" button | `Boolean(signatureDataUrl)` within the `showsInAppSignature` branch | MPA-DP-062 |

## 8.10 Validation and error handling
- MPA-VAL-009 — *"Enter a label for this document before uploading."* (`AdditionalDocumentsUpload.tsx:54`) — shown if a file is somehow submitted with an empty/whitespace label; in practice the Browse button is already disabled in that state (`disabled={!label.trim()}`, line 122), so this message is a defence-in-depth path rather than the primary block. Recovery: type a label, then Browse.
- MPA-VAL-010 — *"{fileName} is {size}. The limit is 5 MB per file."* (`AdditionalDocumentsUpload.tsx:58`) — shown when the selected file exceeds `MAX_FILE_BYTES` (5 MB). Recovery: pick a smaller file.
- MPA-VAL-011 — *"Maximum of 10 documents reached. Remove one to upload another."* (`AdditionalDocumentsUpload.tsx:103`) — replaces the upload row entirely once `documents.length >= MAX_DOCUMENTS` (10). Recovery: remove an existing document first.
- No validation message exists for the signature/CAF-type gate itself — its behaviour is entirely the `isValid` predicate of §8.2/MPA-BR-029, which is silent (Continue is simply enabled or disabled, with no inline error text either way).

## 8.11 Integration trigger points
Trigger point only — not a live integration in the current implementation.
- MPA-INT-017 — `mockDataEngine.list('tnc-summary-bullets')` (`CafSignatureCapture.tsx:166`) — reads local static JSON, fires only when `autoDetectDeviceType` is set.

## 8.12 Navigation behaviour
- Back is hidden once `locksAfter` fires (i.e. once `isValid`'s predicate is satisfied for the first time — see MPA-BR-029 for exactly when that is per device type)
- Rail stops accepting clicks for the same reason, even for previously-reached steps
- No "Edit"-style jump-back exists on this screen (unlike Checkout's MPA-BTN-07-001)
- MPA-NAV-017 — Continue → Payment (MPA-SCR-09), gated by §8.2's `isValid`

## 8.13 Related edge cases
- MPA-SCN-034 — Digital device, happy path: detect → sign → review bullets/recap → sign → Additional Documents → Continue, fully gated as intended.
- MPA-SCN-035 — **Touch Screen device, unsigned Continue (see MPA-BR-029):** Continue/lock/customerFacing all flip on detection alone; if the agent proceeds without pressing "Please Sign," the order is submitted with `values.caf.signatureDataUrl` undefined.
- MPA-SCN-036 — Zero applicable bullet scenarios: only the `no-lockin` fallback bullet renders.
- MPA-SCN-037 — Reachable bullet combination is bounded by this journey's own intake constraints: `plan-lockin` and `discount-expiry`/`discount-no-expiry` are reachable given any plan/discount choice; `star-lockin` is reachable only when a Star number was chosen; `hrn-advance` is **confirmed unreachable** (§8.8) — independently verified against `public/mock-data/customers.json` and `identity-documents.json` for this file, not merely asserted from a prior screen's finding.
- MPA-SCN-038 — Re-entry after signing is impossible in the normal flow: `locksAfter` freezes the rail, so there is no UI path back to this step once signed, short of a full page reload discarding wizard state (no resume-into-locked-step behaviour was found in `GuidedActivationWizard.tsx`).

## 8.14 Persona-specific behaviour
None found conditional on role within this screen's own component (`CafSignatureCapture.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.

## 8.15 Accessibility
To be completed live in Phase 12.

## 8.16 Source references
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:452-501` (step wiring, `isValid`/`customerFacing`/`locksAfter` — MPA-BR-029's exact citation)
- `src/components/patterns/CafSignatureCapture.tsx` (full file — `detectCafType`, `buildTncBullets`, `autoDetectDeviceType` branch, both CAF-preview branches)
- `src/components/patterns/GuidedActivationWizard.tsx:535-547` (customer-facing chrome-stripping), `:284` (`isLocked` computed over the whole prefix), `:667` (Abandon's `!abandonHidden` gate, contrasted with Save & Exit's unconditional render at line 649)
- `src/components/domain/AdditionalDocumentsUpload.tsx` (full file — validation messages, limits)
- `src/components/primitives/SignaturePad.tsx` (signature capture primitive — cross-reference MPA-SCR-14, not duplicated here)
- `public/mock-data/tnc-summary-bullets.json` (bullet templates, including the file's own `_note` disclaiming evidenced-legal-text status)
- `public/mock-data/customers.json`, `public/mock-data/identity-documents.json` (HRN-reachability check independently re-run for this file)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/screen-07-checkout.md` §7.5 (the 18-row `orderSummary`/`cafSummary` set this screen consumes, documented there rather than duplicated here)

## Prompt 10 — MPA-SCR-09 — Payment

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

## Prompt 10b — MPA-SCR-09 — Payment (continued)

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

## Prompt 11 — MPA-SCR-10 — Order Confirmation

**Not a wizard step.** Rendered *instead of* `GuidedActivationWizard` once `confirmedOrder` state is set (`NewPostpaidWizard.tsx:105-144`) — a terminal state, not step 10 of a 9-step rail. Components: `OrderConfirmationScreen` (`src/components/patterns/OrderConfirmationScreen.tsx`, full file, 127 lines) plus, for eSIM orders only, `EsimActivationPanel` (`src/components/domain/EsimActivationPanel.tsx`, full file, 103 lines) embedded as its `handoverPanel` slot.

## 10.1 Purpose
Announce the order outcome (Complete vs Submitted for Approval) with a persistent, non-toast confirmation; present a receipt of what was submitted; for eSIM orders, hand over the QR/activation code the customer needs before leaving the counter; and offer three explicit exit paths.

## 10.2 Entry / exit conditions
- **Entry:** `confirmedOrder` is set only at the end of `onSubmit` (`NewPostpaidWizard.tsx:673-685`), i.e. only after `createRecord('orders', ...)` and `createRecord('customer-activities', ...)` have both completed (`NewPostpaidWizard.tsx:626-661`) — reached exclusively via Payment's auto-submit (MPA-SCR-09 §9.2) or its manual Continue fallback.
- **Exit:** three actions (§10.6) — View Order (leaves this journey for Order Management), Start Another Activation (resets in place), Back to Dashboard (leaves this journey for the Dashboard). There is no "Back" to the wizard — once here, the submitted order cannot be edited from this screen.

## 10.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-10-ST01 | Complete — Physical SIM, single-column (no handover panel) | Physical SIM order, no approval trigger |
| MPA-SCR-10-ST02 | Complete — eSIM, two-column, email verified | eSIM order, `customerEmailVerified === true` |
| MPA-SCR-10-ST03 | Complete — eSIM, email present but unverified | eSIM order, contact email differs from MOI record |
| MPA-SCR-10-ST04 | Complete — eSIM, no contact email on file | eSIM order, `contact.email` empty |
| MPA-SCR-10-ST05 | Submitted for Approval — approval-routing check (e.g. under-18) | Contact step's eligibility approval-routing outcome, proceeded via "Proceed to Approval" |
| MPA-SCR-10-ST06 | Submitted for Approval — MADA/B2B2C discount chosen | Plan & Add-ons: MADA Discount or B2B2C Discount selected |
| MPA-SCR-10-ST07 | eSIM — "Sending…" in-flight state | Click "Send to email" on ST02, mid-500ms delay |
| MPA-SCR-10-ST08 | eSIM — sent-successfully confirmation | Send completes on ST02 |

**Confirmed unreachable in this build:** Submitted-for-Approval via the `isB2B2C` or `requiresHrnAdvance` triggers — see §10.8, MPA-BR-037.

## 10.4 UI elements and content
- Centred success icon (green circle, white checkmark) above the fold, spanning both columns
- `<h1>` heading — dynamic, see §10.9 MPA-DP-070: `"Postpaid activation complete"` or `"Order submitted for approval"`
- Subtitle: `"Order {orderId}"`
- **Receipt `<dl>`** (left column, or the sole centred column when there is no handover panel) — `summaryLines`, exact order (`NewPostpaidWizard.tsx:123-131`):
  1. Customer
  2. MSISDN
  3. Plan
  4. SIM Type
  5. Due today (`"QR {dueTodayQar}"`)
  6. Monthly recurring (`"QR {monthlyRecurringQar}/mo"`)
  7. Status (`"Submitted for Approval"` or `"Complete"`)
- **Handover column** (right column, eSIM orders only) — `EsimActivationPanel`:
  - QR code (`QRCodeSVG`, 160px, white background regardless of theme — "a QR has to stay dark-on-light to scan")
  - Text verbatim: *"Scan this QR code on the customer's device to install the eSIM, or enter the activation code manually."*
  - Monospace code block showing the raw `activationCode`
  - Read-only "Send eSIM details to email" input, value = the account's own contact email (not retypeable here), placeholder `"No contact email on file"`
  - Conditional warning (email present, unverified), verbatim: *"This email could not be verified against the customer's ID record, so eSIM details cannot be sent to it."*
  - Conditional success line, verbatim: *"eSIM details sent successfully to {email}."* (also pushed as a toast)
  - "Send to email" button
- **Actions row** (spans both columns): View Order (primary), Start Another Activation (secondary), Back to Dashboard (secondary) — `secondary-rect`, deliberately not `ghost-rect`, per the component's own comment: every action here is a real next step, not a Cancel/Back-shaped action.

## 10.5 Field specifications
Every item on this screen is a read-only display fed from `confirmedOrder` (set once, at submission) or, for the eSIM panel, from props passed at that same moment. "Type" is `read-only display` throughout.
| ID | Label | Mandatory | Default/source |
|---|---|---|---|
| MPA-FLD-10-001 | Customer | Yes | `contact.moiResult?.name ?? '-'` |
| MPA-FLD-10-002 | MSISDN | Yes | `values.msisdn ?? '-'` |
| MPA-FLD-10-003 | Plan | Yes | `plan?.name ?? '-'` |
| MPA-FLD-10-004 | SIM Type | Yes | `simType?.simType ?? '-'` |
| MPA-FLD-10-005 | Due today | Yes | `checkoutTotals?.dueTodayQar ?? 0`, the same figure Checkout/Payment displayed |
| MPA-FLD-10-006 | Monthly recurring | Yes | `monthlyCharges(...).totalQar`, recomputed once more in `onSubmit` from plan/discount/add-ons (same formula as Checkout, not a second independent one) |
| MPA-FLD-10-007 | Status | Yes | `pendingApproval ? 'Submitted for Approval' : 'Complete'` |
| MPA-FLD-10-008 | eSIM activation code / QR | No — eSIM orders only | `simType?.esimActivationCode` |
| MPA-FLD-10-009 | Send-to email address | No — eSIM orders only | `contact.email`, read-only, **not editable on this screen** (2026-09-28: no longer lets the agent retype or substitute an address at send time) |

## 10.6 Buttons and actions
**This screen renders entirely outside `GuidedActivationWizard`** — none of the shared wizard-chrome buttons documented in [00-wizard-shell.md](00-wizard-shell.md) (Back/Continue/Save & Exit/Abandon, rail) exist here.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-10-001 | View Order | Primary (`primary-rect`) | Always | `navigate(`/order-management/order-approval-detail-attachments-order-details-activities-a?id=${orderId}`)` — leaves this journey |
| MPA-BTN-10-002 | Start Another Activation | Secondary (`secondary-rect`) | Always | `setConfirmedOrder(null)` — component-state reset; `NewPostpaidWizard` remounts its wizard branch fresh, in place, no route change |
| MPA-BTN-10-003 | Back to Dashboard | Secondary (`secondary-rect`) | Always | `navigate(DASHBOARD_ROUTE)` — `DASHBOARD_ROUTE = '/'` (`NewPostpaidWizard.tsx:49`), routes to `<Dashboard />` per the app router; per the code's own comment this is a *confirmed* destination, unlike the placeholder below |
| MPA-BTN-10-004 | Send to email | Secondary (`secondary-rect`) | `!sending && canSend` (`canSend = Boolean(email) && verified`) | `sendEmail()` — 500 ms simulated delay, sets local `sentTo`, pushes a success toast; label reads `"Sending…"` while in flight |

## 10.7 User interactions
- Click View Order / Back to Dashboard → immediate `navigate()`, no confirmation prompt
- Click Start Another Activation → immediate reset, no confirmation prompt; agent lands back on Contact (step 1) with an empty draft
- Click Send to email (eSIM, verified) → button disables, label becomes "Sending…" for ~500 ms, then an inline success line and a toast both appear; `sentTo` is local component state, not persisted to the order record and not read by anything downstream
- Send to email is inert (disabled) whenever `canSend` is false — clicking does nothing; there is no click-through error message, only the pre-existing warning text (§10.4) explaining why
- Keyboard: all actions are native buttons; standard tab order

## 10.8 Business rules
- MPA-BR-037 — `pendingApproval` computation (`NewPostpaidWizard.tsx:589-593`), four independent OR triggers:
  1. `contact.isB2B2C` — **confirmed unreachable in this build.** `isB2B2C` is derived as `employer ? true : undefined` (`GuidedContactStep.tsx:339`) from the same `companyName`/employer signal that gates the Employer field MPA-SCR-01 §1.5 (MPA-FLD-01-013) already found "never true for any ID type this journey allows." Since both the Employer field's visibility and `isB2B2C` itself derive from the same underlying truthiness, `isB2B2C` cannot be `true` through this journey's Contact step either.
  2. `eligibility?.requiresHrnAdvance` — **confirmed unreachable in this build**, same fixture-level finding as MPA-SCR-07 §7.8 / MPA-SCR-08 §8.8 (the one HRN-flagged customer fixture carries a Passport, an ID type this journey disallows).
  3. `eligibility?.checks.some(c => c.outcome === 'approval-routing')` — **reachable** (e.g. MPA-SCR-01's under-18 fixture, ST07).
  4. `discount && SUPPORTING_ID_DISCOUNT_TYPES.has(discount.addonType)` — **reachable**; `SUPPORTING_ID_DISCOUNT_TYPES = new Set(['MADA Discount', 'B2B2C Discount'])` (`PostpaidPlanAddonsStep.tsx:103`). The agent is **not** blocked from submitting without the supporting document/ID upload (`NewPostpaidWizard.tsx:580-588`, no `isValid` gate was requested for this) — choosing either discount type alone is sufficient to force `pendingApproval: true`.
  - In this build, only triggers 3 and 4 are reachable; the heading branch (§10.9) therefore only ever flips to "Order submitted for approval" via an approval-routing eligibility outcome or a MADA/B2B2C discount selection.
- MPA-BR-038 — `orderSubType` labelling quirk (`NewPostpaidWizard.tsx:629`): `contact.isB2B2C ? 'B2B2C' : eligibility?.requiresHrnAdvance ? 'HRN' : 'Consumer'`. Since triggers 1 and 2 above are unreachable, `orderSubType` is effectively **always `'Consumer'`** in this build — including for an order that is `pendingApproval: true` because of an approval-routing check or a MADA/B2B2C discount. The order's `orderSubType` field does not reflect the actual reason it is pending approval in either of the two reachable cases.
- MPA-BR-039 — eSIM handover is deliberately placed on Confirmation, not SIM Type (`EsimActivationPanel.tsx:31-39`, component's own comment): by the time this screen renders, the order is submitted and the code is provisioned — showing the QR earlier (on SIM Type, four steps before submission) risked a customer scanning a code for an order later abandoned at Payment.
- MPA-BR-040 — Send-to-email gate: `verified` is computed once, at submission, using the identical `emailVerification()` definition the Contact step's own tick uses — does `contact.email` match `contact.moiResult.email`? (`NewPostpaidWizard.tsx:671`, `emailVerification(contact.email, contact.moiResult?.email).verified`) — passed down as `confirmedOrder.customerEmailVerified` and never recomputed live on this screen. As of 2026-09-28 the email address itself is always shown (even unverified), so the agent can see *why* sending is blocked rather than finding a blank field.

## Prompt 11b — MPA-SCR-10 — Order Confirmation (continued)

## 10.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| Heading text | `confirmedOrder.pendingApproval` | MPA-DP-070 |
| Handover column / two-column layout | `confirmedOrder.esimActivationCode` truthy (eSIM order) | MPA-DP-071 |
| Email-unverified warning (in `EsimActivationPanel`) | `email` truthy AND `!verified` | MPA-DP-072 |
| "eSIM details sent successfully…" line | `sentTo` set (post-successful send) | MPA-DP-073 |
| "Send to email" disabled | `sending \|\| !canSend` | MPA-DP-074 |
| Single-column, width-capped receipt vs two-column grid | presence of `handoverPanel` | MPA-DP-075 |

## 10.10 Validation and error handling
No field-level validation exists on this screen — every value is a read-only display, and the eSIM email address is not editable here (§10.5, MPA-FLD-10-009).
- MPA-VAL-014 — Closest thing to a validation message: the unverified-email warning, verbatim: *"This email could not be verified against the customer's ID record, so eSIM details cannot be sent to it."* **No recovery action exists on this screen** — the only way to fix an unverified email is to correct it at the Contact step (MPA-SCR-01), which is no longer reachable once the order has been submitted and this terminal screen is showing. The agent's only options are to relay the eSIM details another way (verbally, via the visible QR/code) or resolve the email/ID mismatch through a separate process outside this journey.

## 10.11 Integration trigger points
Trigger point only — not a live integration in the current implementation.
- MPA-INT-020 — "View Order" navigation to `/order-management/order-approval-detail-attachments-order-details-activities-a?id={orderId}` — an internal app route (Order Management module), not an external system call.
- MPA-INT-021 — `sendEmail()` in `EsimActivationPanel.tsx:47-54` — a 500 ms `setTimeout` simulation followed by a local success toast; **no real email-sending API or service is called.** Grep of `EsimActivationPanel.tsx` confirms no `fetch`/network call exists in this function.

## 10.12 Navigation behaviour
- MPA-NAV-020 — View Order → `navigate()` to the Order Approval Detail screen, leaving this journey entirely
- MPA-NAV-021 — Start Another Activation → `setConfirmedOrder(null)`, a component-state reset (not a route navigation); `NewPostpaidWizard` remounts its wizard branch with an empty draft. This is distinct from the `location.state.startFresh` mechanism documented in [00-wizard-shell.md](00-wizard-shell.md) MPA-NAV-002, which concerns the very first external launch of the journey, not this in-place reset.
- MPA-NAV-022 — Back to Dashboard → `navigate(DASHBOARD_ROUTE)`, `DASHBOARD_ROUTE = '/'` (`NewPostpaidWizard.tsx:49`) — per the code's own comment, this is a **confirmed** destination (the button says "Dashboard" and `'/'` routes to `<Dashboard />`), in contrast to `POST_EXIT_DESTINATION` (also currently `'/'`, used by Save & Exit/Abandon mid-journey) which the code explicitly flags as an unconfirmed placeholder pending business decision (`NewPostpaidWizard.tsx:31-38`). The two constants currently share the same value but are conceptually distinct and independently changeable.

## 10.13 Related edge cases
- MPA-SCN-046 — Complete, Physical SIM: single-column receipt, no handover panel.
- MPA-SCN-047 — Complete, eSIM, verified email: full send-to-email flow succeeds.
- MPA-SCN-048 — Complete, eSIM, unverified email: Send blocked, warning shown; agent relays the QR/code manually instead.
- MPA-SCN-049 — Complete, eSIM, no contact email on file at all: Send always disabled (`canSend` requires `Boolean(email)`); the unverified-email warning does **not** render in this case either (it only shows when email is truthy), so the placeholder text alone communicates nothing-to-send.
- MPA-SCN-050 — Submitted for Approval via an eligibility approval-routing check (e.g. under-18): reaches this screen only via Contact's "Proceed to Approval" bypass (MPA-SCR-01 §1.2); `orderSubType` still reads `'Consumer'` per MPA-BR-038.
- MPA-SCN-051 — Submitted for Approval via a MADA/B2B2C discount selection with **zero** supporting document attached: reachable, since submission is never blocked on the document (§10.8); same `orderSubType` quirk applies.
- MPA-SCN-052 — B2B2C / HRN-advance approval triggers: **confirmed unreachable** in this build (§10.8, MPA-BR-037) — the heading never flips to "Submitted for Approval" for either reason through any fixture this journey's Contact step can resolve.
- MPA-SCN-053 — Start Another Activation is an in-place component reset, not a fresh route/history entry — a browser back button after clicking it would not return to the just-submitted confirmation screen in the same way a route-based flow would (not independently verified against router history behaviour in this pass; flagged as a minor unverified point).

## 10.14 Persona-specific behaviour
None found conditional on role within this screen's own components (`OrderConfirmationScreen.tsx`, `EsimActivationPanel.tsx`) — heading text, receipt rows, and all three exit actions render identically regardless of the agent's role. Preliminary; Phase 9 will grep exhaustively across the granted-role set.

## 10.15 Accessibility
To be completed live in Phase 12.

## 10.16 Source references
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:60-80` (`ConfirmedOrder` interface), `:105-144` (render branch), `:541-686` (full `onSubmit` — `pendingApproval`, `orderSubType`, `emailVerified`, `createRecord` calls)
- `src/components/patterns/OrderConfirmationScreen.tsx` (full file)
- `src/components/domain/EsimActivationPanel.tsx` (full file)
- `src/components/patterns/GuidedContactStep.tsx:339` (`isB2B2C` derivation)
- `src/components/patterns/PostpaidPlanAddonsStep.tsx:103` (`SUPPORTING_ID_DISCOUNT_TYPES`)
- `src/engines/postpaidPricing.ts` (`monthlyCharges` — reused in `onSubmit` for the confirmation's Monthly recurring figure)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/screen-01-contact.md` §1.5 (MPA-FLD-01-013, Employer/B2B2C field unreachability, the basis for MPA-BR-037 trigger 1)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/screen-07-checkout.md` §7.8 (MPA-BR-041, HRN-advance fixture-level unreachability, the basis for MPA-BR-037 trigger 2)

## Prompt 12 — MPA-SCR-11 — Abandon Confirmation Modal

Component: `Modal` (`src/components/primitives/Modal.tsx`) instance inside `GuidedActivationWizard.tsx:707-725`.

## 11.1 Purpose
Confirm an irreversible, destructive action (discarding all entered data and deleting any persisted draft) before executing it.

## 11.2 Entry / exit conditions
- **Entry:** click MPA-BTN-00-005 (Abandon Order), available on every step from Contact through CAF & Signature (hidden from Payment onward).
- **Exit:** "Keep working" (closes, no side effect) or "Abandon Order" (confirms, executes abandonment, navigates away).

## 11.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-11-ST01 | Modal open | Click Abandon Order from any pre-Payment step |

## 11.4 UI elements and content
- Modal component, not a Drawer — per the codebase's own convention (comment at `GuidedActivationWizard.tsx:702-705`): Modal is "reserved for exactly this short confirmation," Drawer used for everything else in this journey (Eligibility Checks, Billing Profile Setup, Signature Pad, Plan Details).
- **Title (verbatim):** "Abandon this order?"
- **Body text (verbatim):** "Everything entered for this customer will be discarded and the saved draft deleted. This cannot be undone."

## 11.5 Field specifications
None — this surface has no input fields.

## 11.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-11-001 | "Keep working" | Ghost/tertiary | Always | Closes the modal, no side effect (`setAbandonOpen(false)`) |
| MPA-BTN-11-002 | "Abandon Order" | Primary/destructive | Always | Executes `abandonOrder()`: if `draftOrderId` exists, deletes that order record via `mockDataEngine.remove('orders', draftOrderId)`; clears in-memory draft; closes modal; calls `onAbandon()` → navigates to `POST_EXIT_DESTINATION` (`/`) |

## 11.7 User interactions
Standard modal focus trap expected (not yet confirmed live — see §11.15). Click-outside/Escape behavior depends on `Modal.tsx`'s own implementation, not read in this pass.

## 11.8 Business rules
None specific to this surface.

## 11.9 Conditional display rules
Modal visibility is a pure boolean (`abandonOpen` state), toggled only by MPA-BTN-00-005 and this surface's own two buttons.

## 11.10 Validation and error handling
None — no inputs to validate.

## 11.11 Integration trigger points
MPA-INT-022 — Draft order deletion (`mockDataEngine.remove('orders', draftOrderId)`). **Trigger point only — not a live integration in the current implementation.** Fires only if a draft was actually persisted (i.e., Save & Exit had been used at least once before Abandon); if the agent never saved, there is nothing to delete and this call is skipped implicitly (no `draftOrderId` to pass).

## 11.12 Navigation behaviour
MPA-NAV-023 — On confirm, navigates to `POST_EXIT_DESTINATION` (`'/'`), the same destination as Save & Exit — a named constant in `NewPostpaidWizard.tsx:31-38` explicitly flagged in a code comment as "Placeholder pending business confirmation... Do not assume Agent 360 as the destination."

## 11.13 Related edge cases
MPA-SCN-054 — Abandoning a journey that was never saved (no draft to delete, only in-memory state discarded). MPA-SCN-055 — Abandoning a journey with a persisted draft (draft order row deleted).

## 11.14 Persona-specific behaviour
None found.

## 11.15 Accessibility
To be completed live in Phase 12.

## 11.16 Source references
- `GuidedActivationWizard.tsx:473-478` (abandonOrder logic)
- `GuidedActivationWizard.tsx:700-725` (Modal markup, exact copy)
- `GuidedActivationWizard.tsx:667` (visibility condition, hideAbandonFrom)

## Prompt 13 — MPA-SCR-12 — Eligibility Checks Drawer

Component: `EligibilityChecksLink` + `Drawer` (`src/components/domain/EligibilityGateStep.tsx:148-174`), `Drawer` primitive (`src/components/primitives/Drawer.tsx`).

## 12.1 Purpose
Let the agent review the full 7-check eligibility report (including checks that passed silently) at any time after it has run, since a clean pass renders nothing inline on the Contact step.

## 12.2 Entry / exit conditions
- **Entry:** click MPA-BTN-01-002 ("View eligibility checks"), visible only once `eligibility` is set.
- **Exit:** close the drawer (returns to Contact step underneath, unaffected).

## 12.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-12-ST01 | Open, clean pass | After CUST-1001 (QID `28456701234`) resolves — shows all 7 checks as passed + the non-HRN advisory row |
| MPA-SCR-12-ST02 | Open, mixed outcomes | After CUST-9001 (under-18) resolves — shows the Age Check as approval-routing alongside the other 6 passing |

## 12.4 UI elements and content
- **Drawer title (verbatim):** "Eligibility Checks"
- **Trigger link text (verbatim):** "View eligibility checks" (underlined, accent color, caption size)
- **Body:** `EligibilityChecksList` component rendering `buildEligibilityRows()` output — one row per check (all 7, regardless of pass/fail) plus the HRN advisory row (non-HRN wording for every reachable customer in this journey, since the one HRN fixture is unreachable via this journey's Contact step)
- Each row shows: check label, outcome badge (Passed/Failed/Blocked/Approval required/For information — see MPA-SCR-01's badge table), and the check's message text

## 12.5 Field specifications
None — read-only display surface.

## 12.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-12-001 | Drawer close (×) | Tertiary | Always | Closes drawer, returns focus to the triggering link (standard Drawer behavior, not independently re-verified) |

## 12.7 User interactions
Opens on click of the footer-left link; does not re-run the eligibility evaluation — reuses the cached `EligibilityResult` already computed on Contact.

## 12.8 Business rules
Same rule set as MPA-SCR-01 (§1.8) — this is purely a display of that same result.

## 12.9 Conditional display rules
Drawer content is static once `eligibility` is set; no further conditional branching beyond what's documented for the Contact step's own panel logic.

## 12.10 Validation and error handling
None.

## 12.11 Integration trigger points
None new — reuses MPA-INT-002 (eligibility evaluation)'s already-computed result; no re-fetch occurs on open.

## 12.12 Navigation behaviour
None — this is a non-navigating overlay.

## 12.13 Related edge cases
None beyond MPA-SCR-01's own eligibility scenarios (MPA-SCN-001 through MPA-SCN-007) — this drawer is a pure view of those same outcomes.

## 12.14 Persona-specific behaviour
None found.

## 12.15 Accessibility
To be completed live in Phase 12.

## 12.16 Source references
- `EligibilityGateStep.tsx:148-174` (EligibilityChecksLink)
- `EligibilityGateStep.tsx:89-111` (buildEligibilityRows)

## Prompt 14 — MPA-SCR-13 — Billing Profile Setup Drawer

Component: `BillingProfileSetupDrawer` (`src/components/patterns/BillingAccountStep.tsx:153-203`), `Drawer` primitive.

## 13.1 Purpose
Collect the three fields (Profile Name, Bill Media, Billing Schedule) needed to finalise a newly-created billing account, in a focused sub-form separate from the larger create-new form.

## 13.2 Entry / exit conditions
- **Entry:** click MPA-BTN-03 "+ Add" inside the Billing Profile step's create-new form (only reachable via Path B — creating a new billing account).
- **Exit:** "Save" (validates, patches parent form state, closes) — no explicit Cancel/close-without-saving button documented beyond the Drawer's own generic close affordance.

## 13.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-13-ST01 | Open, empty | Click "+ Add" for the first time on a fresh create-new form |
| MPA-SCR-13-ST02 | Open, prefilled from a prior save | Reopen after already saving once (fields retain their last-saved values) |
| MPA-SCR-13-ST03 | Save disabled (empty name) | Clear Billing Profile Name |

## 13.4 UI elements and content
- **Drawer title (verbatim):** "Billing Profile Setup"
- Three-field vertical form (`space-y-4`), then a Save button

## 13.5 Field specifications
| ID | Label | Type | Mandatory | Default | Validation |
|---|---|---|---|---|---|
| MPA-FLD-13-001 | Billing Profile Name | Text input | Yes | `value.profileName ?? ''` | Save disabled while `profileName.trim()` is empty |
| MPA-FLD-13-002 | Bill Media | Select | No (has default) | `value.billMedia ?? 'Email'` | Options: Email, Paper Bill, SMS |
| MPA-FLD-13-003 | Billing Schedule | Select | No (has default) | `value.billingSchedule ?? 'Immediate'` | Options: Immediate, Next Cycle |

Placeholder for Profile Name (verbatim): "e.g. My Account"

## 13.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-13-001 | "Save" | Primary | `profileName.trim()` is non-empty | Calls `onSave({ profileName: trimmed, billMedia, billingSchedule })`, then closes the drawer |

## 13.7 User interactions
Standard form fill; Save is the only action that commits — there is no separate "Cancel" button distinct from the Drawer's own dismiss affordance (closing without Save discards the three local `useState` values, since they aren't lifted until Save fires).

## 13.8 Business rules
None specific — values feed into MPA-SCR-03's `isBillingAccountValid()` gate (the parent step's Continue is blocked until `profileName` is set via this drawer at least once).

## 13.9 Conditional display rules
Only reachable when creating a new billing account (Path B); never shown when selecting an existing account (Path A).

## 13.10 Validation and error handling
Save-button disablement is the only validation surfaced (no separate inline error message for an empty Profile Name — the button simply stays disabled).

## 13.11 Integration trigger points
None — purely local state, patched into the parent step's in-memory form values on Save.

## 13.12 Navigation behaviour
None — non-navigating overlay.

## 13.13 Related edge cases
MPA-SCN-056 — reopening the drawer after a prior save shows the previously-saved values (state is preserved on the parent, re-hydrated into the drawer's local `useState` on each open via its own initializer reading `value.profileName` etc.).

## 13.14 Persona-specific behaviour
None found.

## 13.15 Accessibility
To be completed live in Phase 12.

## 13.16 Source references
- `BillingAccountStep.tsx:153-203` (full drawer component)
- `BillingAccountStep.tsx:135-144` (BILL_MEDIA_OPTIONS, BILLING_SCHEDULE_OPTIONS constants)

## Prompt 15 — MPA-SCR-14 — Signature Pad Drawer

Component: `Drawer` wrapping `SignaturePad` primitive (`src/components/patterns/CafSignatureCapture.tsx:284-291` for the customer-facing/auto-detect render path used by this journey; an equivalent instance also exists at lines 398-405 for the legacy non-postpaid render path, not used here).

## 14.1 Purpose
Capture an in-app hand-drawn signature as a data URL, for the Digital and Touch Screen CAF types (both require in-app signing under this journey's `autoDetectDeviceType` behavior — see MPA-SCR-08).

## 14.2 Entry / exit conditions
- **Entry:** click "Please Sign" button on the CAF preview box (MPA-SCR-08), available once `cafType` auto-detection has resolved.
- **Exit:** "Done" (captures the drawn signature as a data URL, closes, marks the CAF step signed and locked) or "Clear" (resets the canvas, stays open).

## 14.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-14-ST01 | Open, empty canvas | Click "Please Sign" |
| MPA-SCR-14-ST02 | Mid-draw | Draw a partial signature stroke |
| MPA-SCR-14-ST03 | Drawn, ready to confirm | Complete a signature stroke before clicking Done |

## 14.4 UI elements and content
- **Drawer title (verbatim):** "Please Sign"
- `SignaturePad` canvas component (drawing surface), with "Done" and "Clear" controls (exact button labels/layout not independently re-verified beyond the component name — `SignaturePad.tsx` itself was not read in this pass; flagged for Phase 12/13 live confirmation)

## 14.5 Field specifications
| ID | Label | Type | Mandatory | Validation |
|---|---|---|---|---|
| MPA-FLD-14-001 | Signature canvas | Drawing/canvas input | Yes (for Digital CAF type; see MPA-SCR-08 isValid) | Must have at least one stroke to produce a non-empty data URL on Done |

## 14.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-14-001 | "Done" | Primary | Presumed always enabled (not confirmed whether disabled on an empty canvas — flagged for live verification) | Captures canvas as data URL, calls `onDone(dataUrl)`, which sets `caf.signatureDataUrl` on the parent step and closes the drawer |
| MPA-BTN-14-002 | "Clear" | Secondary | Presumed always enabled | Resets the canvas without closing the drawer |

## 14.7 User interactions
Pointer/touch drag to draw; "Done" commits, "Clear" resets. Exact keyboard-accessibility of a canvas-based signature pad is a known general accessibility risk for this pattern — flagged explicitly for Phase 12 (WCAG 2.2 AA observations), since canvas drawing has no native keyboard equivalent unless the component provides one.

## 14.8 Business rules
None specific — feeds MPA-SCR-08's `isValid`/`locksAfter` gates directly (a non-empty `signatureDataUrl` is what satisfies the Digital-CAF-type validity condition and triggers the lock).

## 14.9 Conditional display rules
Only rendered for Digital and Touch Screen CAF types (both require in-app signing under `autoDetectDeviceType`); never shown for a Manual CAF type — though Manual is documented as dropped entirely under auto-detection for this journey (see MPA-SCR-08), so in practice this drawer is used on every run of this journey once CAF type resolves.

## 14.10 Validation and error handling
No explicit inline validation message found; the gate is structural (Continue disabled at the wizard level until `signatureDataUrl` is present).

## 14.11 Integration trigger points
None — signature capture is purely local (canvas → data URL), no external signing service.

## 14.12 Navigation behaviour
Closing on "Done" returns to the CAF screen, now showing the "Signed" badge and a thumbnail of the captured signature; the step's `customerFacing` flag flips to false at this same moment (see MPA-SCR-08 §8.9), restoring the normal wizard chrome (rail, Back/Continue footer) the customer-facing render had hidden.

## 14.13 Related edge cases
MPA-SCN-057 — signing on a touch-capable device (Touch Screen CAF type) vs. a desktop/laptop (Digital CAF type) — both funnel through this same drawer under `autoDetectDeviceType`, per MPA-SCR-08's own auto-detection logic.

## 14.14 Persona-specific behaviour
None found.

## 14.15 Accessibility
To be completed live in Phase 12 — flagged in advance (§14.7) as a likely WCAG 2.2 AA gap given the canvas-drawing interaction pattern.

## 14.16 Source references
- `CafSignatureCapture.tsx:284-291` (Drawer + SignaturePad instantiation, postpaid/auto-detect render path)
- `CafSignatureCapture.tsx:213-222` ("Please Sign" trigger button / "Signed" badge post-capture)

## Prompt 16 — MPA-SCR-15 — Plan Details Drawer

Component: `Drawer` instance inside `PostpaidPlanAddonsStep.tsx:830-870`.

## 15.1 Purpose
Show the full fact sheet for one catalogue plan (monthly charge, data/voice/speed allowances, commitment term, product code, benefits) without leaving the Plan & Add-ons step or changing the current selection.

## 15.2 Entry / exit conditions
- **Entry:** click the chevron/details button on any plan card (separate from the card's own selection control, deliberately — clicking the chevron must not select the plan, per the component's own comment: "a DIV with a label+radio and a separate details button... to prevent selection on chevron click").
- **Exit:** close the drawer; the plan being viewed (`detailPlan`) is independent of the plan actually selected (`selectedProductId`) — viewing details never changes selection.

## 15.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-15-ST01 | Open, plan with benefits | View details for PROD-104 "Postpaid Red 350 Promotion" (has 2 benefits) |
| MPA-SCR-15-ST02 | Open, plan with no benefits array | View details for a plan lacking `benefits` (if any exists — verify against `products.json` in Phase 13) |

## 15.4 UI elements and content
- **Drawer title:** the plan's own name (`detailPlan?.name`), falling back to "Plan details" if none
- **`<dl>` definition list**, six rows, each `label ↔ value`:
  1. Monthly charge — `QAR {mrcQAR}/mo`
  2. Data — `{dataAllowanceGB} GB` or `Unlimited` if `dataAllowanceGB` is falsy
  3. Voice — `{minutesAllowance}`
  4. Speed — `{speedTier}`
  5. Commitment — `{commitmentMonths} months` or `No commitment`
  6. Product code — `{productId}`
- **Benefits section** (only if `benefits.length > 0`, rendered separately below the `<dl>`, not inside it — per a 2026-09-28 code comment explaining benefits are a list, not a label/value pair): heading "Included benefits", then a `<ul>` with a checkmark icon per item

## 15.5 Field specifications
None — entirely read-only display, no inputs.

## 15.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-15-001 | Drawer close | Tertiary | Always | Closes (`setDetailPlan(null)`) |
| MPA-BTN-15-002 | Chevron/details trigger (on each plan card, MPA-SCR-04) | Tertiary | Always, one per visible plan card | Opens this drawer for that plan (`setDetailPlan(plan)`) — documented here for completeness; visually lives on MPA-SCR-04 |

## 15.7 User interactions
Read-only; no interaction beyond open/close.

## 15.8 Business rules
None specific — a pure formatted read of the same `products.json` catalogue fields the plan card itself already reads.

## 15.9 Conditional display rules
Benefits section renders only if the plan has 1+ entries in its `benefits` array; otherwise the `<dl>` is the entire drawer content.

## 15.10 Validation and error handling
None — no inputs.

## 15.11 Integration trigger points
None — uses the same in-memory `products` list already fetched for the Plan & Add-ons step (no separate fetch on open).

## 15.12 Navigation behaviour
Non-navigating overlay; closing returns to MPA-SCR-04 with selection state unchanged.

## 15.13 Related edge cases
None beyond the general plan catalogue (MPA-SCN entries already covering MPA-SCR-04).

## 15.14 Persona-specific behaviour
None found.

## 15.15 Accessibility
To be completed live in Phase 12.

## 15.16 Source references
- `PostpaidPlanAddonsStep.tsx:830-870` (full drawer markup)
- `PostpaidPlanAddonsStep.tsx:444-571` (plan card, chevron trigger separate from selection control)

## Prompt 17 — Scenario wiring: alternative and failure paths


The screens above describe each step's own default/happy behavior. Wire the following alternative, edge-case and failure paths to the same screens using the scenario switcher from Prompt 1 (or the equivalent mock-data condition), rather than building them as separate screens. Every scenario ID below cites its screen(s) and the exact trigger condition already specified in those screens' prompts — do not invent trigger conditions beyond what is stated.


Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.13

MPA-SCN-001 (happy path), MPA-SCN-002 (hard-stop expired+security), MPA-SCN-003 (soft-stop collections → prepaid), MPA-SCN-004 (approval-routing under-18), MPA-SCN-005 (email/phone validation errors), MPA-SCN-006 (mid-flight lookup supersession), MPA-SCN-007 (HRN/B2B2C unreachable-in-build note).


## MPA-SCR-02 Communication Address — §2.13

- MPA-SCN-008 — Happy path: any customer, this screen is auto-skipped in full; the agent never sees it unless they deliberately click back into the rail.
- MPA-SCN-009 — Non-Qatari / no `idNumber`: MOI prefill never attempts to run (`nationality !== 'Qatari'` or `idNumber` falsy short-circuits `ZsbAddressStep.tsx:126`); the auto-skip still happens regardless — prefill eligibility has no bearing on whether the step is shown.
- MPA-SCN-010 — Rail-click-back after skip: reopens the real form (empty, or MOI-prefilled for a Qatari customer with an on-file address), fully editable, Continue remains enabled throughout since `isValid` never depends on this screen's values.
- MPA-SCN-011 — ZSB-mandatory-for-mobile conflict: the advisory defined in `ruleEngine.ts` (MPA-BR-006) is **not surfaced anywhere in the running UI** — confirmed no call site invokes it. The underlying policy conflict (Consumer Activation Process Manual vs. Day 7 workshop) therefore remains genuinely unresolved and, as currently built, invisible to the agent using this screen.
- MPA-SCN-012 — Fibre Readiness banner: only reachable at all via a rail-revisit (since the step is normally skipped), and only renders once Zone+Street+Building are all filled in; demonstrates both the "ready" and "not ready" match states against `ims-site-zsb.json`.


## MPA-SCR-03 Billing Profile — §3.13

- MPA-SCN-013 — **Existing-account path:** CUST-1001 has exactly one seeded account (ACC-5001 / BILL-7001), shown with the "Default" badge; selecting it satisfies `isBillingAccountValid` immediately with zero further input, and the "Create New" toggle remains available alongside it (one existing profile is below the 2-profile cap).
- MPA-SCN-014 — **Create-new path, with a real gap:** CUST-1007 and CUST-9001 both have zero seeded accounts (confirmed against `accounts.json`, §3.16), so "No billing accounts on file for this customer yet." shows and Create New is the only route. However, `public/mock-data/customer-contacts.json` contains rows **only** for CUST-1001, CUST-1002, and CUST-1003 — neither CUST-1007 nor CUST-9001 has any `customer-contacts` row. That means for either demo customer, the Primary Contact **Select renders with zero options** (`BillingAccountStep.tsx:343-347`), and MPA-FLD-03-001 can never be set — `isBillingAccountValid` can never pass Path B for these two customers as currently seeded. This is logged as an open item, not resolved by inference, per the evidence-over-inference policy: a demo walkthrough of the create-new path needs either a seeded contact added for one of these customers, or a different 0-account customer with contacts, neither of which exists in the current corpus.
- MPA-SCN-015 — **At-cap state — unreachable in current build.** `atConsumerCap` requires `profiles.length >= 2` for a non-Enterprise customer. A full read of `accounts.json` (6 records total: ACC-5001 through ACC-5006) shows every Consumer `customerId` (CUST-1001, CUST-1002, CUST-1003, CUST-1006) owns exactly one account; only the Enterprise customer CUST-2001 owns two (ACC-5004/ACC-5005), and Enterprise is explicitly exempted from the cap. §3.11's finding that Path B never writes back to `accounts.json` also means this state cannot be reached dynamically by running the wizard twice for the same customer within this build. Documented as unreachable rather than fabricated.
- MPA-SCN-016 — **Card validation failure:** enter fewer than 12 digits, blur — MPA-VAL-003 fires, Continue stays blocked (both because the required-field gate is unmet and because no token exists).
- MPA-SCN-017 — **VIP bill-cycle override — unreachable in current build.** No `customers.json` record carries `segment: "VIP"` (9 records checked, values are `"Consumer"`, `"Consumer (HRN)"`, `"Enterprise (EBU)"` only); the 7th-of-month default and its override checkbox (MPA-FLD-03-010) exist only in source and can never be exercised end-to-end with seeded data.
- MPA-SCN-018 — **Billing Profile Setup drawer round-trip:** "+ Add" opens MPA-SCR-13; saving it populates the summary `<dl>` (MPA-DP-021) and satisfies the `profileName` half of `isBillingAccountValid`'s Path B gate — the only point of contact between this screen and that one.


## MPA-SCR-04 Plan & Add-ons — §4.13

- MPA-SCN-019 — Pre-bundled plan selected: Add-ons and Discounts tabs, if reached via rail click-back after the auto-advance, both render their disabled-warning state rather than the normal picker.
- MPA-SCN-020 — Switching plans after selecting a MADA/B2B2C discount and partially filling Supporting ID/proof document silently discards both (the `useEffect` keyed on `discountId` at `:289-294` fires whenever the discount no longer requires a supporting ID, including via a plan change that invalidates the prior discount selection).
- MPA-SCN-021 — Bill Limit failing validation blocks the wizard-level Continue even though the plan itself is validly selected — a plan-valid, bill-limit-invalid state is a real, reachable dead end until corrected.
- MPA-SCN-022 — HRN advance-collection message: designed but unreachable in this build (§4.3/4.9) — no QID/Diplomatic-ID fixture in `customers.json`/`identity-documents.json` carries `hrnAdvancePaymentRequired: true`.


## MPA-SCR-05 Number Selection — §5.13

- MPA-SCN-023 — Manual MSISDN Entry, offered by four sibling journeys sharing this same component, is unconditionally absent here (`allowManualEntry={false}`) — a deliberate Postpaid-only restriction per the 2026-09-28 direction quoted in source ("This section is not required"), not a bug or an omission.
- MPA-SCN-024 — The demo login persona ROLE-01/VFQ12341 (Fatima Al-Kuwari, USR-1101) already holds a Reserved number (`+97433001001`, priced QAR 0/Free-band despite `category: "Star"` in the raw record) — confirmed via `users-agents.json`/`personas.json` cross-reference. This makes the Reserved-tab auto-open state (MPA-SCR-05-ST02) directly reachable for the chosen demo persona, resolving the open question logged in `phase1-boundary-map.md:108` (which flagged this as needing Phase 2 verification against the actual demo agent identity `AGENT-KARTHIKK` — that placeholder id has since been repointed to Fatima Al-Kuwari/USR-1101 in `numbers.json`, per that file's own `_reservedByNote`).
- MPA-SCN-025 — Selecting a number already selected/reserved earlier in the same session is a no-op re-selection, not a new reservation against the 2-number cap (cap only applies to manually-entered new holds, which this journey cannot reach at all).


## MPA-SCR-06 SIM Type — §6.13

- MPA-SCN-026 — Physical auto-advance is a "flash then advance" transient state: the validated read-back `<dl>` (MPA-SCR-06-ST04) is genuinely visible for a moment before the wizard moves on, same pattern as the Eligibility panel's own clean-pass auto-advance on Contact (MPA-SCR-01) — both need slow-motion capture to screenshot reliably.
- MPA-SCN-027 — An agent who selects eSIM, then clicks back into the (still-rendered) Physical serial field and types something, silently overwrites `simType` back to `'Physical'` — there is no explicit "switch away from eSIM" confirmation, and the previously generated `esimActivationCode` is discarded from `values.simType` the next time `onChange` fires from the Physical panel (both panels share the same `value` object and only one `simType` can be current at a time).
- MPA-SCN-028 — Rail click-back to SIM Type after auto-advance re-opens the real, already-validated Physical state (the wizard shell's own "does not re-skip on rail click-back" behaviour, documented in [00-wizard-shell.md](00-wizard-shell.md)); this screen has no `skip()` of its own, only `autoAdvanceWhen`, consistent with the shell note that `autoAdvanceWhen` never retroactively re-fires.


## MPA-SCR-07 Checkout — §7.13

- MPA-SCN-029 — Star number fully within plan entitlement: "No extra charge" text renders, no Star Number charge line in the Due Today card
- MPA-SCN-030 — Star number overage: entitlement/sticker-price caption renders alongside a nonzero Star Number charge
- MPA-SCN-031 — No discount selected: Discount row omitted from the agent `<dl>`; customer-facing Discount/Discount Duration rows show "None"/"N/A"
- MPA-SCN-032 — HRN advance required: **flagged unreachable in this build** — see MPA-BR-023's fixture-level confirmation; if it were reachable, an extra Due Today line and customer-facing row would appear, but no seeded customer combination can trigger it through this journey's Contact step
- MPA-SCN-033 — Edit round-trip: agent clicks Edit, changes plan/discount/add-ons/bill-limit, walks Continue back through Number Selection and SIM Type (both pre-filled, unchanged), lands back on Checkout with updated totals


## MPA-SCR-08 CAF & Signature — §8.13

- MPA-SCN-034 — Digital device, happy path: detect → sign → review bullets/recap → sign → Additional Documents → Continue, fully gated as intended.
- MPA-SCN-035 — **Touch Screen device, unsigned Continue (see MPA-BR-029):** Continue/lock/customerFacing all flip on detection alone; if the agent proceeds without pressing "Please Sign," the order is submitted with `values.caf.signatureDataUrl` undefined.
- MPA-SCN-036 — Zero applicable bullet scenarios: only the `no-lockin` fallback bullet renders.
- MPA-SCN-037 — Reachable bullet combination is bounded by this journey's own intake constraints: `plan-lockin` and `discount-expiry`/`discount-no-expiry` are reachable given any plan/discount choice; `star-lockin` is reachable only when a Star number was chosen; `hrn-advance` is **confirmed unreachable** (§8.8) — independently verified against `public/mock-data/customers.json` and `identity-documents.json` for this file, not merely asserted from a prior screen's finding.
- MPA-SCN-038 — Re-entry after signing is impossible in the normal flow: `locksAfter` freezes the rail, so there is no UI path back to this step once signed, short of a full page reload discarding wizard state (no resume-into-locked-step behaviour was found in `GuidedActivationWizard.tsx`).


## MPA-SCR-09 Payment — §9.13

- MPA-SCN-039 — Happy path: Continue in WinCash → Payment completed in WinCash → auto-submits.
- MPA-SCN-040 — Decline-then-succeed loop: decline → Retry in WinCash → Payment completed → auto-submits.
- MPA-SCN-041 — Repeated decline: the decline→retry loop has no attempt cap — an agent can cycle it indefinitely; no lockout or escalation exists in this component.
- MPA-SCN-042 — Session expiry, resumed as completed: handoff → Simulate session expiry → "Payment completed in WinCash - resume" → `paid: true`, auto-submits with a freshly generated reference (the reference is generated at resume time, not carried over from any real WinCash transaction record, since none exists).
- MPA-SCN-043 — Session expiry, resumed as not completed: handoff → Simulate session expiry → "It didn't complete - try again" → returns to **plain idle**, not the declined sub-state (`declined` is explicitly set `false`), so the next primary button reads "Continue in WinCash," not "Retry in WinCash."
- MPA-SCN-044 — Save & Exit remains available through this entire step (§9.6) even once locked by CAF's `locksAfter` (MPA-SCR-08 §8.2) — an agent can save a signed-but-unpaid draft and resume it later via the "My Tasks" draft-resume mechanism documented in [00-wizard-shell.md](00-wizard-shell.md) MPA-NAV-001.
- MPA-SCN-045 — Double-submit guard: `submittingRef` in `GuidedActivationWizard.goNext()` prevents a second `onSubmit` call if the agent clicks Continue/Save & Finish again while a prior submission is still in flight.


## MPA-SCR-10 Order Confirmation — §10.13

- MPA-SCN-046 — Complete, Physical SIM: single-column receipt, no handover panel.
- MPA-SCN-047 — Complete, eSIM, verified email: full send-to-email flow succeeds.
- MPA-SCN-048 — Complete, eSIM, unverified email: Send blocked, warning shown; agent relays the QR/code manually instead.
- MPA-SCN-049 — Complete, eSIM, no contact email on file at all: Send always disabled (`canSend` requires `Boolean(email)`); the unverified-email warning does **not** render in this case either (it only shows when email is truthy), so the placeholder text alone communicates nothing-to-send.
- MPA-SCN-050 — Submitted for Approval via an eligibility approval-routing check (e.g. under-18): reaches this screen only via Contact's "Proceed to Approval" bypass (MPA-SCR-01 §1.2); `orderSubType` still reads `'Consumer'` per MPA-BR-038.
- MPA-SCN-051 — Submitted for Approval via a MADA/B2B2C discount selection with **zero** supporting document attached: reachable, since submission is never blocked on the document (§10.8); same `orderSubType` quirk applies.
- MPA-SCN-052 — B2B2C / HRN-advance approval triggers: **confirmed unreachable** in this build (§10.8, MPA-BR-037) — the heading never flips to "Submitted for Approval" for either reason through any fixture this journey's Contact step can resolve.
- MPA-SCN-053 — Start Another Activation is an in-place component reset, not a fresh route/history entry — a browser back button after clicking it would not return to the just-submitted confirmation screen in the same way a route-based flow would (not independently verified against router history behaviour in this pass; flagged as a minor unverified point).


## MPA-SCR-11 Abandon Confirmation Modal — §11.13

MPA-SCN-054 — Abandoning a journey that was never saved (no draft to delete, only in-memory state discarded). MPA-SCN-055 — Abandoning a journey with a persisted draft (draft order row deleted).


## MPA-SCR-12 Eligibility Checks Drawer — §12.13

None beyond MPA-SCR-01's own eligibility scenarios (MPA-SCN-001 through MPA-SCN-007) — this drawer is a pure view of those same outcomes.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.13

MPA-SCN-056 — reopening the drawer after a prior save shows the previously-saved values (state is preserved on the parent, re-hydrated into the drawer's local `useState` on each open via its own initializer reading `value.profileName` etc.).


## MPA-SCR-14 Signature Pad Drawer — §14.13

MPA-SCN-057 — signing on a touch-capable device (Touch Screen CAF type) vs. a desktop/laptop (Digital CAF type) — both funnel through this same drawer under `autoDetectDeviceType`, per MPA-SCR-08's own auto-detection logic.


## MPA-SCR-15 Plan Details Drawer — §15.13

None beyond the general plan catalogue (MPA-SCN entries already covering MPA-SCR-04).

## Prompt 18 — Final: end-to-end wiring and verification checklist


Wire the full journey together:

1. **Navigation.** Back moves to the previous reached step (never past a locked step — see the CAF & Signature prompt's `locksAfter` behavior). Continue is disabled until the current step's own validity condition (stated in that step's prompt) is met, and advances to the next step, or submits on the last step (Payment).
2. **Save & Exit / Resume.** Wire per Prompt 1's navigation section: Save & Exit persists the current step and all entered values and exits; a resumed session restores both.
3. **Abandon.** Available on every step up to (not including) Payment. Confirms via the Abandon modal (Prompt 12) before discarding all entered values.
4. **Modals and drawers.** Abandon confirmation (Prompt 12), Eligibility checks (Prompt 13), Billing Profile setup (Prompt 14), Signature pad (Prompt 15), and Plan details (Prompt 16) all overlay the current step without navigating away from it, and all dismiss via backdrop click and Escape.
5. **Toasts.** Any success/error toast named in a screen's own prompt uses the toast component from Prompt 0's role list, positioned consistently across every step.
6. **Customer-facing mode.** On the CAF & Signature step specifically, while awaiting signature, hide the step rail and all agent-only chrome (Save & Exit, Abandon, Back/Continue) per that step's own prompt — render only that step's own content.

**Verification checklist** (cross-check against Appendix I of the specification document):

- [ ] Every business rule and validation named in each screen's prompt is enforced exactly as stated (no simplification, no invented default).
- [ ] Every conditional-display rule fires on the exact condition stated, not on an approximation of it.
- [ ] Auto-populated vs. editable vs. locked fields are visually distinguishable, matching the distinction each screen's prompt makes.
- [ ] The step rail correctly marks completed / current / unreached / locked steps.
- [ ] Save & Exit and Abandon behave per Prompt 1 and this prompt's item 2-3.
- [ ] Every scenario in the Scenario wiring prompt reproduces the exact screen state its trigger condition describes.
- [ ] No screen exposes a color, spacing, or type value outside this file's own design system tokens.
- [ ] The dev-only scenario switcher (Prompt 1) is visually distinct from the product UI and does not appear in any exported/handed-off view of the product screens themselves.


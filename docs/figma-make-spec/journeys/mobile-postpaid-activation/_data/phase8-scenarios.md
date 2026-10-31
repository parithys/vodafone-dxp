# Phase8 Scenarios

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

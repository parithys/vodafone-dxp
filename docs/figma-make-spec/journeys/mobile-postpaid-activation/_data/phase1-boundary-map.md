# Phase 1 — Journey Boundary Map and State Plan (CHECKPOINT)

Journey: Mobile Postpaid Activation (MPA) · ID prefix: MPA
Implementation: `NewPostpaidWizard` (`src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx`), rendered inside the shared `GuidedActivationWizard` shell (`src/components/patterns/GuidedActivationWizard.tsx`).

## 1. Entry points

| # | Entry | Mechanism | Notes |
|---|---|---|---|
| 1 | Journey catalogue card | Mobile workspace → "New Connections" category page renders card `mob-new-postpaid` ("New Postpaid Connection") from `journeyCatalogue.ts`, gated on feature key `postpaid.new-postpaid-wizard` | Primary, evidenced entry point |
| 2 | Direct route | `/sim-number-management/new-postpaid-connection-journey-single-scroll-flow` (SCR-037) | Same component, reachable directly |
| 3 | Resume a saved draft | `location.state.resumeOrderId` set, pointing at an `orders` record with `status: 'Draft'` | `GuidedActivationWizard` itself has no resume button/list — **open question for Phase 2**: which screen (Order Management? a "My Drafts" list? Dashboard?) actually surfaces a Resume action and sets this state. Not yet confirmed against source. |
| 4 | Dashboard quick action | Mentioned but **not yet confirmed against source** | To verify directly in Phase 2, not assumed here |

## 2. Step sequence (wizard order, as coded)

| Order | Step key | Label | Screen ID | Auto-skip / auto-advance | isValid gate (summary) |
|---|---|---|---|---|---|
| 1 | `contact` | Contact (+ stacked Eligibility panel) | MPA-SCR-01 | — | MOI resolved + identity complete + email/phone valid + eligibility resolved with no hard-stop/soft-stop/approval-routing |
| 2 | `address` | Communication Address | MPA-SCR-02 | **Always auto-skipped** for this journey (`autoAdvanceWhen: () => true`) | Always valid (never blocks) — mandatory-per-blueprint but a documented, unresolved policy conflict (ZSB-mandatory-for-mobile) is surfaced as advisory only, not enforced |
| 3 | `billingAccount` | Billing Profile | MPA-SCR-03 | — | `isBillingAccountValid()` — existing account selected, or full create-new path complete (contact, address, tokenized card, profile setup) |
| 4 | `plan` | Plan & Add-ons | MPA-SCR-04 | Auto-advances to Number Selection if selected plan has `preBundledOffer: true` | Product selected AND bill-limit rule not failed |
| 5 | `number` | Number Selection | MPA-SCR-05 | — | MSISDN selected. Manual entry **disabled** for this journey (`allowManualEntry={false}`) — a deliberate Postpaid-only restriction versus four sibling journeys that keep it |
| 6 | `simType` | SIM Type | MPA-SCR-06 | Physical auto-advances the instant scan validates; eSIM never auto-advances | Physical: `simValid===true`. eSIM: `esimIssued===true` |
| 7 | `checkout` | Checkout | MPA-SCR-07 | — | Always valid (read-only summary, never blocks) |
| 8 | `caf` | CAF & Signature | MPA-SCR-08 | — | `cafType` set AND (not Digital OR signature captured). Also carries **`customerFacing`** (strips wizard chrome while awaiting signature) and **`locksAfter`** (disables Back once signed) — the only step with either behaviour |
| 9 | `payment` | Payment | MPA-SCR-09 | Auto-submits the instant WinCash reports `paid: true` (this is the last step) | `payment.paid === true` |
| — | *(terminal, not a step)* | Order Confirmation | MPA-SCR-10 | Rendered in place of the wizard once `confirmedOrder` state is set | N/A |

Removed from this journey (present in the reference 12-step flow / earlier builds, explicitly deleted per code comments — **out of scope**, not part of this spec):
- Eligibility as its own rail step (merged into Contact, 2026-09-28)
- Billing (old Language/Payment Type/Payment Method/Bill Media step, SCR-156) — removed 2026-09-25, replaced by the current Billing Profile step; the old component still exists and is still used by `NewMnpWizard`, untouched, but is a different journey
- Device & DOI (device bundling, BR-114 DOI declaration, down-payment/installment terms) — removed 2026-09-27
- Activity (free-text comment box) — removed 2026-09-26

## 3. Modals / drawers / non-step surfaces

| Screen ID | Surface | Opened from | Notes |
|---|---|---|---|
| MPA-SCR-11 | Abandon confirmation modal | "Abandon Order" action, available on every step **except** Payment (`hideAbandonFrom="payment"`) | Title "Abandon this order?"; deletes the draft order record |
| MPA-SCR-12 | Eligibility Checks drawer/popup | "View eligibility checks" footer link on Contact step | Only interactive path back to the full 7-check + HRN-row report once a clean pass renders nothing inline |
| MPA-SCR-13 | Billing Profile Setup drawer | "+ Add" inside Billing Profile step's create-new form | Profile Name / Bill Media / Billing Schedule |
| MPA-SCR-14 | Signature Pad drawer | "Please Sign" on CAF & Signature step | Digital signature capture canvas |
| MPA-SCR-15 | Plan Details drawer | Chevron button on a plan card, Plan & Add-ons step | Read-only `<dl>` of plan facts |

## 4. Exit / completion conditions

| Condition | Trigger | Data effect | Destination |
|---|---|---|---|
| A. Complete | Payment succeeds AND no approval-routing reason applies | Order `status: 'Complete'`; `customer-activities` record logged | Confirmation screen, heading "Postpaid activation complete" |
| B. Submitted for Approval | Payment succeeds AND (B2B2C contact, OR HRN advance required, OR any eligibility check outcome was `approval-routing`, OR a MADA/B2B2C discount was chosen) | Order `status: 'Submitted for Approval'` | Confirmation screen, heading "Order submitted for approval" |
| C. Abandon | "Abandon Order" confirmed, any step before Payment | Draft order record deleted | `POST_EXIT_DESTINATION` (currently `/`, explicitly a placeholder pending business confirmation) |
| D. Save & Exit | "Save & Exit", **appears available on every step including Payment** (no `hideSaveExitFrom` equivalent found — needs Phase 2 confirmation as it is an asymmetry against Abandon worth verifying precisely) | Draft order record created/updated with `status:'Draft'`, `draftStepKey`, `draftValues` | Same `POST_EXIT_DESTINATION` (`/`) |
| E. Switch to Prepaid | Collections soft-stop only, "Switch to Prepaid" button on the inline Eligibility panel | No order created | Navigates to `/mobile-prepaid/new-prepaid-tablet-step-1-contact-id-capture` (a different journey — out of scope for this spec beyond the trigger point) |
| F. Hard-stop dead end | Expired ID, security blacklist, or blocking-deal check fails | No order created | No in-panel forward path; only Abandon or browser navigation leaves the journey |
| G. Resume | Re-entry with `location.state.resumeOrderId` | Draft rehydrated into the in-session wizard state | N/A — re-enters at the saved step |

## 5. Persona / variant matrix

Feature key gating this journey: `postpaid.new-postpaid-wizard`, level `Create`, granted to exactly five roles (confirmed directly against `personas.json`):

| Role ID | Role name | Level | Restriction on this grant |
|---|---|---|---|
| ROLE-01 | Retail Sales Agent | Create | None |
| ROLE-02 | Telesales Agent | Create | None |
| ROLE-04 | Tablet / Field Sales Agent | Create | None |
| ROLE-05 | Mass Market Agent | Create | None |
| ROLE-12 | Premium Agent | Create | None |

No explicit persona-conditional rendering (role/persona checks) was found inside the wizard's own step components during Phase 0 exploration — **preliminary finding, to be exhaustively re-verified in Phase 9** by grepping every component this journey uses for role/persona branching before the document asserts "no persona differences" as fact. The one apparent per-agent restriction found in research (a Bill-Limit floor "for ROLE-01 only") did **not** hold up against direct source verification of the persona grant; the real floor is `BillLimitEditor`'s own business rule (BR-226 Mobile / BR-227 Mobile Plus, Agent Minimum QAR 50/75), which applies uniformly regardless of role — to be confirmed with a rule-engine file:line citation in Phase 5.

There is no separate customer-self-service variant of this journey — it is agent-run only. The `customerFacing` behaviour on the CAF step is a UI-chrome mode within the same agent session (the screen is handed to the customer to review/sign), not a distinct persona or route.

## 6. Out-of-scope screens / surfaces

- SCR-154 through SCR-162 (legacy per-step screen catalogue entries) — resolve to the exact same `NewPostpaidWizard` component as SCR-037; not independently reachable, not separately specified
- The destination journey behind "Switch to Prepaid" (`/mobile-prepaid/...`) — only the trigger point is in scope
- The destination screen behind "View Order" on the confirmation screen (Order Management / Order Approval Detail) — only the trigger point is in scope
- Removed steps listed in §2 (old Billing, Device & DOI, Activity) — historical, not present in the current build

## 7. Screenshot state plan (screen-state ID → how to reach it)

Desktop 1440×900 for all states; mobile 390×844 additionally wherever the component visibly uses responsive Tailwind breakpoints (confirmed present in at least `SimTypeStep`, `BillingAccountStep`; to be checked per-component in Phase 2/13).

| Screen-state ID | How to reach | Risk / open question |
|---|---|---|
| MPA-SCR-01-ST01 | Fresh Contact step, nothing entered | — |
| MPA-SCR-01-ST02 | Mid-scan / MOI loading | Timing-dependent, may need slow-motion or network throttling to capture |
| MPA-SCR-01-ST03 | MOI resolved (any clean customer), eligibility still "Checking eligibility…" | Timing-dependent |
| MPA-SCR-01-ST04 | Enter/scan `28456701234` (CUST-1001) — clean pass | All 7 checks pass, panel renders nothing (silent) — screenshot must show the *absence* of the panel plus the success toast if still visible |
| MPA-SCR-01-ST05 | Enter/scan `DIP-QA-004521` (CUST-1006) — expired ID + security blacklist compound hard-stop | — |
| MPA-SCR-01-ST06 | Enter/scan `29011122233` (CUST-1004) — collections soft-stop | Must also capture the "Switch to Prepaid" button in this state |
| MPA-SCR-01-ST07 | Enter/scan `P1234567` (CUST-9001) — under-18 approval-routing | Only reachable approval-routing fixture given this journey's QID/Diplomatic-ID-only selector; HRN (CUST-1002, Passport) and line-cap (CUST-1005, GCC ID) fixtures are **not reachable** here — to record as uncaptured/unreachable with reason, not screenshotted |
| MPA-SCR-01-ST08 | Enter malformed email | — |
| MPA-SCR-01-ST09 | Enter non-Qatar / malformed alt phone | — |
| MPA-SCR-01-ST10 | Edit email to differ from MOI record | Verification-pending helper text |
| MPA-SCR-01-ST11 | ID-type selector showing Passport/GCC ID greyed with hint | Default-visible state, easy |
| MPA-SCR-12-ST01 | Click "View eligibility checks" after a clean pass | — |
| MPA-SCR-02-ST01 | Click "Communication Address" in the rail after auto-skip | Confirms the "opens unfilled, doesn't re-skip" behaviour |
| MPA-SCR-02-ST02 | Same, for a Qatari customer (CUST-1001) mid MOI-address-prefetch | Timing-dependent; loading text "Checking for an address on file…" |
| MPA-SCR-02-ST03 | Same, prefilled result | — |
| MPA-SCR-03-ST01 | Billing Profile step, loading | Timing-dependent |
| MPA-SCR-03-ST02..13 | Per the sub-states catalogued in Phase 2 (existing-account list, at-cap message, create-new form branches, card tokenization success/error, setup drawer) | Requires confirming seeded `billing-profiles.json` data per customer (who has 0, who has 2) — Phase 2 |
| MPA-SCR-04-ST01..16 | Tab states, search, plan selected, details drawer, add-ons tab (enabled/disabled), discounts tab incl. MADA/B2B2C supporting-ID + proof upload, Bill Limit editor incl. validation error | HRN-advance message sub-state likely unreachable (see Phase 0 note) — verify in Phase 2 whether any QID/Diplomatic customer has `hrnAdvancePaymentRequired: true`; if not, record as unreachable rather than invent one |
| MPA-SCR-15-ST01 | Plan Details drawer open | — |
| MPA-SCR-05-ST01..07 | Free/Star/Reserved tabs, sort, overage note, search, pagination, selection confirmed | Reserved-tab-with-contents may be unreachable for the actual demo login agent (`AGENT-KARTHIKK` per order `createdBy`) since seeded reservations belong to other named agents — verify in Phase 2; if empty for this agent, capture the empty Reserved-tab state instead and note why |
| MPA-SCR-06-ST01..06 | Default, Physical scanning, Physical validated (transient), eSIM pre-message, eSIM issuing, eSIM issued | Auto-advance on Physical success makes ST03 transient — capture via slow-motion/pause if the harness allows, else record as best-effort |
| MPA-SCR-07-ST01..03 | Default summary, Star-number due-today line item (needs a Star number selected upstream), HRN line item (same reachability caveat as MPA-SCR-04) | — |
| MPA-SCR-08-ST01..05 | Customer-facing detecting (transient), awaiting signature, Signature Pad drawer open, signed/locked agent view, Back-button-absent confirmation | — |
| MPA-SCR-14-ST01 | Signature Pad drawer, mid-draw | — |
| MPA-SCR-09-ST01..06 | Idle, handoff, success (transient, auto-advances), declined, session-expired (via the in-UI "Simulate session expiry (test)" button), Abandon-button-absent confirmation | Declined and session-expired both use in-app test affordances, not external state — fully reachable |
| MPA-SCR-10-ST01..04 | Complete/Physical, Submitted-for-approval, eSIM handover panel, eSIM handover with unverified email | — |
| MPA-SCR-11-ST01 | Abandon confirmation modal open | From any pre-Payment step |
| MPA-SCR-13-ST01 | Billing Profile Setup drawer open | — |

Counts at this checkpoint: **15 screens/surfaces**, **~75 planned states** (exact count will firm up in Phase 2 once seeded-data reachability questions above are resolved — a few states may collapse to "documented as unreachable" rather than screenshotted).

## 8. Reference blueprint

`REFERENCE_BLUEPRINT_PATH` was left empty in the journey scope — no blueprint cross-mapping will be performed (§Phase 1 step 4 of the workflow is skipped as not applicable).

---

## 9. Open items — RESOLVED (2026-09-29, confirmed directly against source)

1. **Resume a draft.** `src/workspace/tasks/TaskListView.tsx:122` — `navigate(order.draftResumePath, { state: { resumeOrderId: order.orderId } })`. The "My Tasks" workspace (Task List view) is the resume entry point, not Order Management or a dedicated drafts screen. Draft postpaid orders surface there as a task an agent can click to resume. **In scope for MPA-NAV** as a navigation behaviour; the Task List screen itself remains out of scope beyond this one trigger.

2. **Save & Exit vs. Payment.** Confirmed by reading `GuidedActivationWizard.tsx` in full: there is **no `hideSaveExitFrom` prop or equivalent** — only `onAbandon`/`hideAbandonFrom` has a hide-from mechanism. Save & Exit is gated purely on whether `onSaveExit` is provided (it always is, for this journey) and renders on **every step, including Payment**. This is a real, confirmed asymmetry: Abandon disappears at Payment (WinCash may already hold the transaction) but Save & Exit does not — an agent could in principle click Save & Exit while a WinCash handoff is in progress. Recorded as a scenario (see MPA-SCN catalogue, Phase 8) rather than treated as a defect — the spec documents behaviour as built.

3. **HRN / B2B2C / line-cap reachability.** Confirmed directly against `customers.json` + `identity-documents.json`:
   - CUST-1002 (Bimal Thapa) — the only `hrnAdvancePaymentRequired: true` fixture — holds only a **Passport** document. Passport is in this journey's `unavailableIdTypes`.
   - CUST-1002 and CUST-2001 (Layla Hassan) are the only two customers with `companyName` set (B2B2C employer-sponsorship fixture) — CUST-1002 is Passport-only; CUST-2001 holds only an **Other ID** document, also not in `allowedIdTypes={['QID','Diplomatic ID']}`.
   - CUST-1005 (Khalid Al-Mazrouei, line-cap fixture) holds only a **GCC ID**, also unavailable.
   - **Conclusion:** the HRN-advisory eligibility row, the derived `isB2B2C`/Employer field, the HRN-advance QAR 100 message (Plan step) and due-today line item (Checkout), and the line-cap approval-routing outcome are all **unreachable through this journey's own Contact-step identification** given its QID/Diplomatic-ID-only selector. These will be documented as designed-but-unreachable-in-current-build, not screenshotted, with this exact reasoning cited.
   - **Important distinction:** the separate **"B2B2C Discount"** (`ADO-7113`, a Plan & Add-ons discount choice tied to product PROD-105, requiring a supporting ID + proof document) is **unrelated to the `isB2B2C` contact flag** and **is** reachable by any customer regardless of ID type, since it is simply a discount selection, not derived from employer sponsorship. Both MADA and B2B2C discount states remain in scope and screenshot-able.

4. **Billing profiles per customer.** Confirmed via `accounts.json` (join key to `billing-profiles.json`): CUST-1001, CUST-1002, CUST-1003, CUST-1006 each have exactly 1 account (→ 1 billing profile — use for the "existing account" path). CUST-1004, CUST-1005, CUST-1007, CUST-9001 have 0 (→ empty-list + create-new path). **No seeded customer reaches 2 profiles** — the "at Consumer cap" state (MPA-SCR-03-ST04) is confirmed **unreachable with current seed data**; will be documented as designed-but-unreachable, not screenshotted.

5. **MSISDN reservations vs. demo agent.** Confirmed via `MsisdnPicker.tsx:172-173` (explicit code comment) and `useAuthStore`: the reservation match key is the signed-in identity's **display name**, resolved from `users-agents.json` at sign-in (e.g. "Fatima Al-Kuwari" for staff ID VFQ12341 / ROLE-01 Retail Sales Agent) — **not** the wizard's own hardcoded `createdBy: 'AGENT-KARTHIKK'` order field (a separate, unrelated literal). `numbers.json` confirms `+97433001001` (Free, QAR 0) is already reserved by "Fatima Al-Kuwari." **Reachable and confirmed**: logging in as ROLE-01 (VFQ12341 / Vodafone@123) reaches the Reserved-tab-with-contents state, and additionally demonstrates the "auto-open Reserved tab on load when the agent already holds a reservation" behaviour live.

6. **B2B2C employer field.** Superseded by item 3 above — unreachable in this journey's current build for the same reason (both B2B2C-flagged customers hold disallowed ID types here).

**Demo persona selected for screenshot capture:** ROLE-01 Retail Sales Agent, Staff ID `VFQ12341`, password `Vodafone@123` (per `src/auth/staffIdRoleMap.ts`), resolved identity "Fatima Al-Kuwari" — chosen because it is both a granted role for this feature and the only identity that reaches the Reserved Numbers non-empty state.

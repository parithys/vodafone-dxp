# MPA-SCR-10 — Order Confirmation

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

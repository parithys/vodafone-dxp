# MPA-SCR-07 — Checkout

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

# MPA-SCR-04 — Plan & Add-ons

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

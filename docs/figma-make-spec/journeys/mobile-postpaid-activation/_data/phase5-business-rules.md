# Phase5 Business Rules

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.8

- MPA-BR-001 (BR-113 Blacklist) — see Phase 5 catalogue
- MPA-BR-002 (BR-288 Postpaid line cap, expat QID)
- MPA-BR-003 (BR-187 HRN advance payment) — unreachable in this journey (§1.3)
- MPA-BR-004 (BR-076 Default credit limit)
- MPA-BR-005 — the seven-check eligibility matrix itself (`src/engines/eligibilityEngine.ts:114-266`)


## MPA-SCR-01 Contact — §1.9

| Element | Condition | Controlling rule |
|---|---|---|
| Identity fields section | `moiResult` truthy | MPA-DP-001 |
| Eligibility panel (any content) | 1+ checks non-passing | MPA-DP-002 |
| "Proceed to Approval" button | `!hardStop && !softStop &&` 1+ `approval-routing` checks | MPA-DP-003 |
| "Switch to Prepaid" button | `softStop === true` | MPA-DP-004 |
| Pattern-1 (hard-stop) message, no button | `hardStop === true` | MPA-DP-005 |
| Employer (B2B2C) field | `isB2B2C && companyName` | MPA-DP-006 (unreachable, see §1.5) |
| "View eligibility checks" link | `eligibility` set | MPA-DP-007 |


## MPA-SCR-02 Communication Address — §2.8

- **MPA-BR-006** — `BR-ZSB-MANDATORY-FOR-MOBILE` (conflict-report.md Conflict 2, Medium severity). Defined in `src/engines/ruleEngine.ts:74-80`: `() => ({ pass: true, message: "Unresolved: Consumer Activation Process Manual v8.0 §2.1.15/§3.1.12 requires ZSB for mobile; a Day 7 workshop says it's FWA/fixed-only. Not blocking here - the evidenced screen itself (MNP Postpaid Address, FLD-523–526) marks these fields Mandatory: No with a \"Skip Address\" option - but confirm with COPS & Digital / Customer Data Management before treating this as final." })`.
  **Important correction to how this rule is actually wired:** `ZsbAddressStep.tsx`'s own comment (lines 97-104) says the conflict "stays recorded in reference/blueprint conflict-report.md (Conflict 2) and in ruleEngine's BR-ZSB-MANDATORY-FOR-MOBILE, **which still evaluates**." A grep of the entire `src/` tree for both `BR-ZSB-MANDATORY-FOR-MOBILE` and every `evaluateRule(` call site (`src/engines/ruleEngine.ts:305-321` is the only place that dispatches into `ruleImplementations`) found **no caller anywhere that invokes `evaluateRule('BR-ZSB-MANDATORY-FOR-MOBILE', …)`** — not in `ZsbAddressStep.tsx`, not in `NewPostpaidWizard.tsx`, not anywhere else. The rule function exists and would return the message above if called, but as built it is dead code: the advisory text is **never rendered on this screen or anywhere in the running app**. Documenting this as observed rather than assuming the comment's "still evaluates" claim is accurate.


## MPA-SCR-02 Communication Address — §2.9

| Element | Condition | Controlling ID |
|---|---|---|
| "Checking for an address on file…" message | `fetching === true` | MPA-DP-008 |
| MOI address-prefill fetch fires | `nationality === 'Qatari' && idNumber` truthy `&& !value.fetchedFromMoi && !value.zone` (`ZsbAddressStep.tsx:126`) | MPA-DP-009 |
| Fibre Readiness banner renders at all | `zone`, `streetNo`, `buildingNo` all non-blank (trimmed) (`FibreReadinessBanner.tsx:59`) AND `ims-site-zsb` dataset loaded (line 61) | MPA-DP-010 |
| Fibre Readiness banner styling/text (ready vs. not-ready) | bare-value match of Zone+Street+Building against any `ims-site-zsb.json` record (`FibreReadinessBanner.tsx:63-64`) | MPA-DP-011 |


## MPA-SCR-03 Billing Profile — §3.8

- **MPA-BR-008** — Consumer Billing Profile Cap (catalogue id `BR-071`, `public/config/business-rules.json`: *"A consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more."*). **Not routed through `ruleEngine.ts`'s `evaluateRule`/`ruleImplementations`** (no `'BR-071'` key exists there) — the logic is hand-coded directly in the component as `atConsumerCap = customerSegment !== 'Enterprise' && profiles.length >= 2` (`BillingAccountStep.tsx:257-261`).
- **MPA-BR-007** — Default Postpaid Billing Cycle Rule (catalogue id `BR-024`: *"Billing profiles default to postpaid with automatic 1st/15th bill cycles."*). Evidenced half of `computeBillCycleDay()` (`BillingAccountStep.tsx:94-100`): for a non-VIP segment, picks whichever of the 1st or 15th is closer to the date 3 days from now (the "three-day submission window"). Also not routed through `ruleEngine.ts` — implemented directly in this component.
- **MPA-BR-009** — VIP / 7th-of-month default (**UNEVIDENCED assumption layered onto MPA-BR-007**). Per the component's own comment (`BillingAccountStep.tsx:80-93`): *"VIP customers default to the 7th of every month... no rule in the corpus defines a 'VIP' customer segment or a 7th-of-month VIP default - customers.json's own `segment` values are only ever 'Consumer'/'Enterprise' in this app's seed data. Implemented exactly as directed, gated on `segment === 'VIP'`... without inventing one now."* **Confirmed unreachable:** a full scan of `public/mock-data/customers.json` (9 customer records) found `segment` values of only `"Consumer"`, `"Consumer (HRN)"`, and `"Enterprise (EBU)"` — no `"VIP"` record exists, so the `segment === 'VIP'` branch at `BillingAccountStep.tsx:95, 253, 433` can never execute in this build.
- **MPA-BR-010** — Card tokenization / last-4-plus-token-only storage rule. Per the component's own comment (`BillingAccountStep.tsx:109-119`): *"Validation of payment details ... is required for successful processing, with only the last four digits of the card and a generated token number stored for security ... UNEVIDENCED: no payment gateway is named anywhere in this corpus. The screenshot accompanying this request said 'Gatan gateway simulation' - kept verbatim in the token prefix and the field's own helper text as a demo label, not a real integration."* The raw card number is never returned from `tokenizeCard()` or stored anywhere past the call (`BillingAccountStep.tsx:120-128`); only `last4` and a `GATAN-`-prefixed random token persist.


## MPA-SCR-03 Billing Profile — §3.9

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


## MPA-SCR-04 Plan & Add-ons — §4.8

- MPA-BR-011 (BR-120 / BR-269 — 3-month postpaid minimum subscription period / lock-in, disclosed via the Plan Details drawer's "Commitment" field; all five seeded postpaid plans carry `commitmentMonths: 3`)
- MPA-BR-012 (BR-226 — Bill Limit Mobile promotion agent-minimum threshold, QR 50; `AGENT_MINIMUMS.Mobile` in `BillLimitEditor.tsx:10`)
- MPA-BR-013 (BR-227 — Bill Limit Mobile Plus promotion agent-minimum threshold, QR 75; present in the same lookup table but this journey only ever passes `product="Mobile"`, so the Mobile Plus branch is unreachable from this screen specifically)
- MPA-BR-014 (BR-112 — HRN upfront advance; unreachable in this journey per §4.3/4.9 — logged here for numbering continuity, not exercised)
- MPA-BR-015 (pricing formula — `monthlyCharges()`, `postpaidPricing.ts:122-138`: `discountQar = round2(planQar * |discountRate|)`; `netQar = round2(planQar - discountQar + addonsQar + installmentQar)` [installmentQar always 0 on this screen, Device & DOI removed from this journey]; `vatQar = round2(netQar * VAT_RATE)` at `VAT_RATE = 0.05`, assumed/unevidenced per that module's own note; `totalQar = round2(netQar + vatQar)`)


## MPA-SCR-04 Plan & Add-ons — §4.9

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


## MPA-SCR-05 Number Selection — §5.8

- MPA-BR-016 (BR-115 — star-number entitlement by plan value: `entitlementQar = planMrcQar × STAR_NUMBER_ENTITLEMENT_MULTIPLIER (25)`; overage billed is `max(0, round2(numberPriceQar − entitlementQar))`, `postpaidPricing.ts:56-73`. The 25× ratio is stated in source as the confirmed figure over a competing 50× figure that surfaced in the same request — see that module's own comment)
- MPA-BR-017 (Free/Star price-boundary rule: a number is "Free" if `priceQAR < FREE_NUMBER_PRICE_CEILING_QAR (1000)`, "Star" if `priceQAR >= 1000` — this is a price band, not the stored `category` field, per 2026-09-28 direction quoted in source: "Treat all numbers below QAR 1,000 as free to the customer". Confirmed in the live seed: `+97433001002` is stored `category: 'Star'` but priced QAR 500, so it lists under the Free tab by this rule)
- MPA-BR-018 (Reservation cap — `MAX_RESERVATIONS_PER_AGENT = 2`, enforced only on the action that CREATES a new hold via manual entry, not on re-selecting an existing hold; not independently evidenced as a numbered BR in `business-rules.json` — app-level constant per the component's own comment, `MsisdnPicker.tsx:74-79`)


## MPA-SCR-05 Number Selection — §5.9

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


## MPA-SCR-06 SIM Type — §6.8

- MPA-BR-019 — eSIM-before-payment guarantee: the activation code/QR is generated at this step but never rendered as scannable here — only on `EsimActivationPanel` post-payment (MPA-SCR-10) — and the on-screen copy is deliberately "eSIM **selected**", not "eSIM **issued**", because (per the component's own comment) "the profile is not live" and "the walkthrough is explicit that an eSIM must not reach the customer before payment." Not a numbered BR in `business-rules.json` — a UX/process guarantee stated directly in source comments, not backed by a separate rule-engine entry.
- MPA-BR-020 — Physical/eSIM mutual exclusivity as validation alternatives: "Require either eSIM selection or SIM Serial Number" (2026-09-28 direction quoted in `SimTypeStep.tsx:71-76`) — selecting eSIM suppresses the Physical panel's own blur validation (`suppressValidation`) rather than requiring both to be satisfied.


## MPA-SCR-06 SIM Type — §6.9

| Element | Condition | Controlling ID |
|---|---|---|
| Physical validated read-back `<dl>` | `value.simType === 'Physical' && value.simValid` | MPA-DP-040 |
| SIM Serial Number field's blur validation / required asterisk / inline error | Suppressed (`suppressValidation`) when `value.simType === 'eSIM'`; active otherwise | MPA-DP-041 |
| eSIM pre-selection button + caption | `!(value.simType === 'eSIM' && value.esimIssued && value.esimActivationCode)` | MPA-DP-042 |
| eSIM selected-state panel (badge, body text, caption) | `value.simType === 'eSIM' && value.esimIssued && value.esimActivationCode` all truthy | MPA-DP-043 |
| "Scanning…" line | `scanning` true (during the ~600 ms simulated scan) | MPA-DP-044 |
| "Checking stock…" line | `checking` true and not `scanning` | MPA-DP-045 |
| "SIM available in this store's stock" badge | `inStock` true and neither `checking` nor `scanning` | MPA-DP-046 |


## MPA-SCR-07 Checkout — §7.8

- MPA-BR-022 — BR-115 Star Number Entitlement: a plan's MRC entitles the customer to a Star number worth up to `MRC × 25` at no extra one-time charge; only the amount above that is billed (`STAR_NUMBER_ENTITLEMENT_MULTIPLIER`, `postpaidPricing.ts:55-73`; applied `CheckoutSummaryStep.tsx:181-188`). The 25× figure is confirmed (2026-09-28) over a competing 50× figure that surfaced in the same request.
- MPA-BR-023 — HRN advance amount: fixed QAR 100 flat, per BR-112 as cited in `postpaidPricing.ts:31-43` ("driven by nationality and sales channel; explicitly confirmed to NOT be driven by plan value"). **Confirmed unreachable in this journey** — see below.
  - **Reachability check performed directly for this file:** only one seeded customer (`CUST-1002`, Bimal Thapa) has `hrnAdvancePaymentRequired: true` in `public/mock-data/customers.json`, and that customer's only identity document in `public/mock-data/identity-documents.json` is a `Passport`. This journey's Contact step (`NewPostpaidWizard.tsx:188`) allows only QID and Diplomatic ID — Passport is explicitly in `unavailableIdTypes`. No fixture reachable through this journey's Contact step can set `eligibility.requiresHrnAdvance === true`, so MPA-FLD-07-011, MPA-FLD-07-014, and the HRN-advance bullet on MPA-SCR-08 are all unreachable in the current build/fixture set — not merely unlikely. This matches MPA-SCR-01 §1.8's MPA-BR-024 finding (BR-187, same underlying constraint, different rule id) and independently confirms it against `EligibilityGateStep.tsx:353` (`hrnFlag = Boolean(match.hrnAdvancePaymentRequired)`).
- MPA-BR-025 — Free/Star price boundary: numbers priced below QAR 1,000 are "free to the customer" regardless of catalogue price; QAR 1,000+ is a Star number (`FREE_NUMBER_PRICE_CEILING_QAR`, `postpaidPricing.ts:45-53`). App-level direction (2026-09-28), not tied to an evidenced BR-number in the corpus.
- MPA-BR-021 — VAT rate: 5%, **assumed, not evidenced** (`postpaidPricing.ts:18-29`) — no corpus document states a VAT rate or whether postpaid charges are quoted inclusive/exclusive; logged in `reference/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md` per the code's own comment.
- MPA-BR-026 — First-bill proration: evidenced wording ("your first month's charges will be prorated, plus the full charge of your plan for the following month" — four corpus CAF/guided-journey documents), **assumed cycle day** (defaults to the 1st of the calendar month — the function's own assumption, not a business rule; `postpaidPricing.ts:151-178`).
- MPA-BR-027 — Bill limit cap = account credit limit ("Maximum Bill Limit equals account Credit Limit" — `business-rules.json`, cited `CheckoutSummaryStep.tsx:190-194`). This journey has no Bill Limit editor of its own value to show by default, so the cap is what's displayed absent an agent-set figure.


## MPA-SCR-07 Checkout — §7.9

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


## MPA-SCR-08 CAF & Signature — §8.8

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


## MPA-SCR-08 CAF & Signature — §8.9

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


## MPA-SCR-09 Payment — §9.8

- MPA-BR-033 — Amount due is read from Checkout's already-computed `checkoutTotals.dueTodayQar`, never re-derived from the number's raw sticker price (`NewPostpaidWizard.tsx:507-514`). The code's own comment notes this specifically avoids re-skipping BR-115's Star-number entitlement/overage logic, which a second independent derivation used to do.
- MPA-BR-034 — Auto-submit on success: "On successful WinCash confirmation, return to DXP, submit the order, and create the interaction activity" (2026-09-28 direction, `NewPostpaidWizard.tsx:524-530`) — the Return moment (`paid: true`) submits immediately via `autoAdvanceWhen`, since Payment is the wizard's last step and a manual Continue click here would only ever mean "submit" anyway.
- MPA-BR-035 — Payment reference is demo-generated (`` `WC-${Date.now().toString().slice(-8)}` ``), not issued by a real payment gateway or WinCash itself — see §9.11.
- MPA-BR-036 — Abandon/Save & Exit asymmetry (see §9.6) — confirmed directly against source for this file, not inherited from an unverified prior claim.


## MPA-SCR-09 Payment — §9.9

| Element | Condition | Controlling ID |
|---|---|---|
| "Paid" badge + reference | `value.paid === true` | MPA-DP-063 |
| Session-expired card | `!paid && value.sessionExpired === true` | MPA-DP-064 |
| Handoff card | `!paid && !sessionExpired && value.handoffStarted === true` | MPA-DP-065 |
| Idle/declined card | `!paid && !sessionExpired && !handoffStarted` (default branch) | MPA-DP-066 |
| "Payment declined" banner (within idle card) | `value.declined === true` | MPA-DP-067 |
| "Retry in WinCash" vs "Continue in WinCash" label | `value.declined` | MPA-DP-068 |
| "Returning to DXP…" label swap on both return buttons | local `processing === true` | MPA-DP-069 |


## MPA-SCR-10 Order Confirmation — §10.8

- MPA-BR-037 — `pendingApproval` computation (`NewPostpaidWizard.tsx:589-593`), four independent OR triggers:
  1. `contact.isB2B2C` — **confirmed unreachable in this build.** `isB2B2C` is derived as `employer ? true : undefined` (`GuidedContactStep.tsx:339`) from the same `companyName`/employer signal that gates the Employer field MPA-SCR-01 §1.5 (MPA-FLD-01-013) already found "never true for any ID type this journey allows." Since both the Employer field's visibility and `isB2B2C` itself derive from the same underlying truthiness, `isB2B2C` cannot be `true` through this journey's Contact step either.
  2. `eligibility?.requiresHrnAdvance` — **confirmed unreachable in this build**, same fixture-level finding as MPA-SCR-07 §7.8 / MPA-SCR-08 §8.8 (the one HRN-flagged customer fixture carries a Passport, an ID type this journey disallows).
  3. `eligibility?.checks.some(c => c.outcome === 'approval-routing')` — **reachable** (e.g. MPA-SCR-01's under-18 fixture, ST07).
  4. `discount && SUPPORTING_ID_DISCOUNT_TYPES.has(discount.addonType)` — **reachable**; `SUPPORTING_ID_DISCOUNT_TYPES = new Set(['MADA Discount', 'B2B2C Discount'])` (`PostpaidPlanAddonsStep.tsx:103`). The agent is **not** blocked from submitting without the supporting document/ID upload (`NewPostpaidWizard.tsx:580-588`, no `isValid` gate was requested for this) — choosing either discount type alone is sufficient to force `pendingApproval: true`.
  - In this build, only triggers 3 and 4 are reachable; the heading branch (§10.9) therefore only ever flips to "Order submitted for approval" via an approval-routing eligibility outcome or a MADA/B2B2C discount selection.
- MPA-BR-038 — `orderSubType` labelling quirk (`NewPostpaidWizard.tsx:629`): `contact.isB2B2C ? 'B2B2C' : eligibility?.requiresHrnAdvance ? 'HRN' : 'Consumer'`. Since triggers 1 and 2 above are unreachable, `orderSubType` is effectively **always `'Consumer'`** in this build — including for an order that is `pendingApproval: true` because of an approval-routing check or a MADA/B2B2C discount. The order's `orderSubType` field does not reflect the actual reason it is pending approval in either of the two reachable cases.
- MPA-BR-039 — eSIM handover is deliberately placed on Confirmation, not SIM Type (`EsimActivationPanel.tsx:31-39`, component's own comment): by the time this screen renders, the order is submitted and the code is provisioned — showing the QR earlier (on SIM Type, four steps before submission) risked a customer scanning a code for an order later abandoned at Payment.
- MPA-BR-040 — Send-to-email gate: `verified` is computed once, at submission, using the identical `emailVerification()` definition the Contact step's own tick uses — does `contact.email` match `contact.moiResult.email`? (`NewPostpaidWizard.tsx:671`, `emailVerification(contact.email, contact.moiResult?.email).verified`) — passed down as `confirmedOrder.customerEmailVerified` and never recomputed live on this screen. As of 2026-09-28 the email address itself is always shown (even unverified), so the agent can see *why* sending is blocked rather than finding a blank field.


## MPA-SCR-10 Order Confirmation — §10.9

| Element | Condition | Controlling ID |
|---|---|---|
| Heading text | `confirmedOrder.pendingApproval` | MPA-DP-070 |
| Handover column / two-column layout | `confirmedOrder.esimActivationCode` truthy (eSIM order) | MPA-DP-071 |
| Email-unverified warning (in `EsimActivationPanel`) | `email` truthy AND `!verified` | MPA-DP-072 |
| "eSIM details sent successfully…" line | `sentTo` set (post-successful send) | MPA-DP-073 |
| "Send to email" disabled | `sending \|\| !canSend` | MPA-DP-074 |
| Single-column, width-capped receipt vs two-column grid | presence of `handoverPanel` | MPA-DP-075 |


## MPA-SCR-11 Abandon Confirmation Modal — §11.8

None specific to this surface.


## MPA-SCR-11 Abandon Confirmation Modal — §11.9

Modal visibility is a pure boolean (`abandonOpen` state), toggled only by MPA-BTN-00-005 and this surface's own two buttons.


## MPA-SCR-12 Eligibility Checks Drawer — §12.8

Same rule set as MPA-SCR-01 (§1.8) — this is purely a display of that same result.


## MPA-SCR-12 Eligibility Checks Drawer — §12.9

Drawer content is static once `eligibility` is set; no further conditional branching beyond what's documented for the Contact step's own panel logic.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.8

None specific — values feed into MPA-SCR-03's `isBillingAccountValid()` gate (the parent step's Continue is blocked until `profileName` is set via this drawer at least once).


## MPA-SCR-13 Billing Profile Setup Drawer — §13.9

Only reachable when creating a new billing account (Path B); never shown when selecting an existing account (Path A).


## MPA-SCR-14 Signature Pad Drawer — §14.8

None specific — feeds MPA-SCR-08's `isValid`/`locksAfter` gates directly (a non-empty `signatureDataUrl` is what satisfies the Digital-CAF-type validity condition and triggers the lock).


## MPA-SCR-14 Signature Pad Drawer — §14.9

Only rendered for Digital and Touch Screen CAF types (both require in-app signing under `autoDetectDeviceType`); never shown for a Manual CAF type — though Manual is documented as dropped entirely under auto-detection for this journey (see MPA-SCR-08), so in practice this drawer is used on every run of this journey once CAF type resolves.


## MPA-SCR-15 Plan Details Drawer — §15.8

None specific — a pure formatted read of the same `products.json` catalogue fields the plan card itself already reads.


## MPA-SCR-15 Plan Details Drawer — §15.9

Benefits section renders only if the plan has 1+ entries in its `benefits` array; otherwise the `<dl>` is the entire drawer content.

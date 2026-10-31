# Phase3 Field Specifications

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.5

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


## MPA-SCR-02 Communication Address — §2.5

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


## MPA-SCR-03 Billing Profile — §3.5

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


## MPA-SCR-04 Plan & Add-ons — §4.5

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-04-001 | Plan search | Text combobox | No | Yes | empty | Filters active plan-group tab by name substring or raw price digits; also drives type-ahead suggestions |
| MPA-FLD-04-002 | Plan selection | Radio, one per plan card | Yes (gates Continue) | Yes | none | Must select exactly one `Postpaid Plan` product; `selectedProductId` |
| MPA-FLD-04-003 | Add-ons | Multi-select checkboxes | No | Yes, unless selected plan is `preBundledOffer` (then the whole tab is disabled) | none selected | No validation — purely additive to `addonsQar` |
| MPA-FLD-04-004 | Discount | Radio, "No discount" + one row per eligible discount | No | Yes, unless selected plan is `preBundledOffer` | "No discount" | Only discounts where `addons-discounts.json` `planId` matches the selected plan are offered |
| MPA-FLD-04-005 | Supporting ID | Text input | Yes, only when selected discount's `addonType` is "MADA Discount" or "B2B2C Discount" (`SUPPORTING_ID_DISCOUNT_TYPES`) | Yes | empty | No inline format validator found in source — required by helper text and by order-finalisation gating (per the component's own note), not by a blocking `isValid` check on this step itself (see MPA-SCN item) |
| MPA-FLD-04-006 | Proof document | File upload | Yes, same condition as Supporting ID | Yes | none | Accept types `.pdf,.jpg,.jpeg,.png` (`PROOF_DOCUMENT_ACCEPT`); max size 5 MB (`PROOF_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024`); error MPA-VAL-004 on oversize |
| MPA-FLD-04-007 | Bill Limit | Numeric, +50/−50 steppers + free-text | No (defaults from plan MRC) | Yes | `billLimit ?? selectedPlan.mrcQAR` | BR-226 (Mobile, agent minimum QR 50) via `evaluateRule('BR-AGENT-MIN-THRESHOLD', …)`; error MPA-VAL-005 below the minimum |


## MPA-SCR-05 Number Selection — §5.5

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-05-001 | Search 8-digit number | Text | No | Yes | empty | Free-text match against stored E.164 or displayed local digits (`:265-277`); not shown on Reserved tab |
| MPA-FLD-05-002 | Sort | Select | No | Yes, Star tab only | `'price-desc'` | Only 4 options listed above; Free/Reserved always effectively sort `number-asc` with no visible control |
| MPA-FLD-05-003 | MSISDN selection | Card click | Yes (gates Continue) | Yes — re-selectable | none | `Boolean(values.msisdn)`; selecting fires `onSelect(msisdn, priceQAR)`, populating both `values.msisdn` and `values.numberPriceQAR` |
| — | Custom MSISDN / "Reserve Custom Number" | N/A | N/A | N/A — **not rendered in this journey** | N/A | N/A — see §5.3 negative state; documented here only to record the field IDs are intentionally not allocated for this screen |


## MPA-SCR-06 SIM Type — §6.5

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-06-001 | SIM Serial Number | Text input, barcode-scan trailing addon | Yes, unless eSIM is the current choice (`suppressValidation`) | Yes | empty | On blur, resolved against `mockDataEngine.list('sims')`: empty → MPA-VAL-006; not found → MPA-VAL-007; `stockStatus === 'Issued'` → MPA-VAL-008; else valid, `simValid: true` |
| MPA-FLD-06-002 | (derived, read-only) ICCID | Text, in the validated read-back `<dl>` | N/A | No | `found.iccid` from the matched `sims.json` record | none — display only |
| MPA-FLD-06-003 | (derived, read-only) Stock Status | Text, in the validated read-back `<dl>` | N/A | No | `found.stockStatus` from the matched `sims.json` record | none — display only |
| MPA-FLD-06-004 | eSIM selection | Button-triggered action, not a form field | Yes, alternative path to Physical | Yes (re-clickable? no — once `esimIssued` the button is replaced by the selected-state panel; no "change your mind back to Physical" affordance was found in source beyond re-focusing the Physical field directly, which sets `simType: 'Physical'` and overwrites the eSIM choice) | none | `esimIssued: true` on completion; no format validation, since nothing is typed |


## MPA-SCR-07 Checkout — §7.5

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


## MPA-SCR-08 CAF & Signature — §8.5

| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-08-001 | CAF Type | Auto-detected, not a manual picker under this journey | Yes (implicit) | No — set once by `detectCafType()`, never re-offered | `navigator.maxTouchPoints > 0 \|\| matchMedia('(pointer: coarse)')` → `'Touch Screen'`, else `'Digital'` (`CafSignatureCapture.tsx:38-42`) | n/a |
| MPA-FLD-08-002 | Signature | Drawn signature, captured as data URL | Effectively yes for Digital, **not enforced for Touch Screen** — see MPA-BR-029 | Yes, via Signature Pad drawer (MPA-SCR-14) | none until captured | n/a — no format validation, presence is the whole gate (and only enforced for Digital) |
| MPA-FLD-08-003 | Additional Document — Label | Free text | Yes, per document | Yes | agent-typed | Must be non-empty (trimmed) before Browse is enabled/before upload proceeds — MPA-VAL-009 |
| MPA-FLD-08-004 | Additional Document — File | File picker, `.pdf,.jpg,.jpeg,.png` | Yes, per document | Yes | agent-selected | ≤ 5 MB — MPA-VAL-010; total documents ≤ 10 — MPA-VAL-011 |


## MPA-SCR-09 Payment — §9.5

This step has no agent-entered form fields — every value in `WinCashPaymentValue` (`paid`, `reference`, `declined`, `handoffStarted`, `sessionExpired`) is set exclusively by the step's own button handlers, never typed in.
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-09-001 | Amount Due (WinCash) | Read-only display | Yes | No | `values.checkoutTotals.dueTodayQar`, falls back to `0` if `checkoutTotals` is undefined | n/a |
| MPA-FLD-09-002 | Payment reference | Read-only display | Only once paid | No | Demo-generated `` `WC-${Date.now().toString().slice(-8)}` `` — **not a real payment-gateway reference**, see §9.8/§9.11 | n/a |


## MPA-SCR-10 Order Confirmation — §10.5

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


## MPA-SCR-11 Abandon Confirmation Modal — §11.5

None — this surface has no input fields.


## MPA-SCR-12 Eligibility Checks Drawer — §12.5

None — read-only display surface.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.5

| ID | Label | Type | Mandatory | Default | Validation |
|---|---|---|---|---|---|
| MPA-FLD-13-001 | Billing Profile Name | Text input | Yes | `value.profileName ?? ''` | Save disabled while `profileName.trim()` is empty |
| MPA-FLD-13-002 | Bill Media | Select | No (has default) | `value.billMedia ?? 'Email'` | Options: Email, Paper Bill, SMS |
| MPA-FLD-13-003 | Billing Schedule | Select | No (has default) | `value.billingSchedule ?? 'Immediate'` | Options: Immediate, Next Cycle |

Placeholder for Profile Name (verbatim): "e.g. My Account"


## MPA-SCR-14 Signature Pad Drawer — §14.5

| ID | Label | Type | Mandatory | Validation |
|---|---|---|---|---|
| MPA-FLD-14-001 | Signature canvas | Drawing/canvas input | Yes (for Digital CAF type; see MPA-SCR-08 isValid) | Must have at least one stroke to produce a non-empty data URL on Done |


## MPA-SCR-15 Plan Details Drawer — §15.5

None — entirely read-only display, no inputs.

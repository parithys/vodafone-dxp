# MPA-SCR-03 — Billing Profile

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

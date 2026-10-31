# MPA-SCR-01 — Contact (incl. stacked Eligibility panel)

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

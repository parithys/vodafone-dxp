# MPA-SCR-06 — SIM Type

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

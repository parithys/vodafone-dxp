# MPA-SCR-02 — Communication Address

Route: step 2 of 9, reached via Contact's Continue/Proceed-to-Approval. Component: `ZsbAddressStep` (`src/components/patterns/ZsbAddressStep.tsx`, full file), which nests `FibreReadinessBanner` (`src/components/domain/FibreReadinessBanner.tsx`). Wired at `NewPostpaidWizard.tsx:257-286`.

## 2.1 Purpose
Capture an optional mobile-line communication/service address (Zone, Street, Building, Floor, Unit/Apartment, Area/City, Kahramaa ID, Vodafone ID, free-text Address Line), auto-prefilled from the customer's on-file MOI-linked registered address when the resolved identity is Qatari, plus a purely informational fibre-readiness indicator checked against the ZSB the agent has typed. Because a mobile line needs no serviceable premises (per the code's own citation of FLD-523–526, all fields evidenced Mandatory: No), this step is configured to auto-skip on every run of this journey rather than block progression.

## 2.2 Entry / exit conditions
- **Entry:** automatically follows Contact once its own `isValid`/"Proceed to Approval" gate clears; step index 2 of 9.
- **`isValid: () => true`** (`NewPostpaidWizard.tsx:272`) — Continue is unconditionally enabled; nothing entered or omitted on this screen can block the wizard.
- **`autoAdvanceWhen: () => true`** (`NewPostpaidWizard.tsx:285`) — evaluates to true unconditionally, so `GuidedActivationWizard`'s one-time auto-advance effect (`autoAdvancedRef`, `GuidedActivationWizard.tsx:437-449`) fires the instant this step is reached on first forward arrival (`maxReached <= currentIndex` at line 441) and immediately calls `goNext()`, moving the agent straight to Billing Profile. **This fires on every single run of this journey** — there is no condition (nationality, existing address, anything) that varies the outcome; the step is never actually seen on a clean forward pass.
- **Re-entry via rail:** the auto-advance effect guards itself with `autoAdvancedRef.current.has(step.key)` (`GuidedActivationWizard.tsx:442-444`), which is set the moment it fires once. Clicking "Communication Address" in the left rail after the skip (permitted once `maxReached` has passed index 2 — see `00-wizard-shell.md` MPA-BTN-00-001) lands on the real, unfilled or MOI-prefilled form exactly as if the agent had walked through it normally — it does **not** re-skip a second time.
- **Exit:** Continue is always enabled; Back returns to Contact.

## 2.3 Screenshots (state plan)
Because the step auto-skips on every normal run, every state below except ST01 requires a deliberate rail-revisit after the skip.

| ID | State | How to reach |
|---|---|---|
| MPA-SCR-02-ST01 | Auto-skip in transit | Complete Contact normally for any customer — step 2 is never rendered on this pass; the rail jumps straight from Contact (completed) to Billing Profile (current) |
| MPA-SCR-02-ST02 | Empty/default form, no MOI prefill | After the skip, click "Communication Address" in the rail for a non-Qatari customer (e.g. CUST-1007, Henrik Lindqvist, Swedish) — the MOI-fetch effect's `nationality !== 'Qatari'` guard (`ZsbAddressStep.tsx:126`) short-circuits, so all fields render blank |
| MPA-SCR-02-ST03 | MOI prefill loading | Rail-revisit for a Qatari customer with a resolved `idNumber` (e.g. CUST-1001, QID 28456701234, Qatari) — briefly shows "Checking for an address on file…" (`ZsbAddressStep.tsx:162`) |
| MPA-SCR-02-ST04 | MOI-prefilled address | Same as ST03, once `identity-documents.json` → `addresses.json` resolves a Primary/active address record for that `customerId` |
| MPA-SCR-02-ST05 | Fibre Readiness — ready | Rail-revisit, then type a Zone/Street/Building combination whose bare values match a record in `ims-site-zsb.json` |
| MPA-SCR-02-ST06 | Fibre Readiness — not ready | Rail-revisit, type any Zone/Street/Building combination with no match in `ims-site-zsb.json` |
| MPA-SCR-02-ST07 | Area/City autocomplete open | Rail-revisit, focus/type into the Area/City field to show the suggestion list (`ims-site-zsb`/`kid-address-records` area names + `addresses.city`) |

## 2.4 UI elements and content
- **Fetching indicator:** `<p>` text, shown only while `fetching === true` — verbatim: *"Checking for an address on file…"* (`ZsbAddressStep.tsx:162`)
- **Field grid:** 2-column grid (`grid grid-cols-2 gap-4`) holding, in order: Zone, Street, Building, Floor, Unit/Apartment, Area/City, Kahramaa ID, Vodafone ID (`ZsbAddressStep.tsx:168-234`), followed by a full-width (`col-span-2`) Address Line input (`ZsbAddressStep.tsx:235-245`)
- **Fibre Readiness banner** (`FibreReadinessBanner.tsx:49-85`), rendered unconditionally in JSX but internally returns `null` until Zone+Street+Building are all non-blank (line 59) and the `ims-site-zsb` dataset has loaded (line 61). When shown: signal icon, heading *"Fibre Readiness"*, and one of two verbatim subtext lines depending on match: *"Fibre infrastructure is available at this address."* (success styling, check icon) or *"Fibre infrastructure is not currently available at this address."* (neutral styling, cross icon) — `FibreReadinessBanner.tsx:77-82`
- **Removed since original evidence (documented in code comments, not present on screen):** the provenance caption *"Retrieved from the customer's Qatar ID. Edit any field if the customer confirms a change."* (removed 2026-09-27, `ZsbAddressStep.tsx:163-167`); the Save Address / Skip Address / Go back / Cancel button row and the `skipped` flag it set (removed 2026-09-26, `ZsbAddressStep.tsx:88-95`); an on-screen "Unresolved policy conflict" advisory banner (removed 2026-09-25, `ZsbAddressStep.tsx:97-104` — see §2.8/§2.13 below for what this means for the ZSB-mandatory-for-mobile conflict)

## 2.5 Field specifications

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

## 2.6 Buttons and actions
This component renders **no buttons of its own** — the evidenced Save Address / Skip Address / Go back / Cancel row was removed 2026-09-26 (`ZsbAddressStep.tsx:88-95`), and nothing replaced it since every field already writes on change.

| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | see [00-wizard-shell.md](00-wizard-shell.md) | Back enabled; Continue always enabled (§2.2) | — |

## 2.7 User interactions
- Type into any of the 9 fields → immediate `onChange({ ...value, [key]: newValue })` merge, no debounce (`ZsbAddressStep.tsx:172-244`)
- On mount (or when `idNumber`/`nationality` change) → MOI-prefill effect runs once per combination, guarded against re-fetch by `fetchedFromMoi` and against overwriting a filled `zone` (`ZsbAddressStep.tsx:125-158`); an in-flight fetch can be cancelled by unmount (`cancelled` flag)
- Typing Zone/Street/Building → `FibreReadinessBanner` recomputes its match on every keystroke once all three are non-blank (no debounce; pure prop-driven re-render)
- Focus/type into Area/City → Autocomplete suggestion list filters against the loaded `areaOptions`
- Keyboard: standard tab order through 9 native form controls; no custom keyboard handling found in this component

## 2.8 Business rules
- **MPA-BR-006** — `BR-ZSB-MANDATORY-FOR-MOBILE` (conflict-report.md Conflict 2, Medium severity). Defined in `src/engines/ruleEngine.ts:74-80`: `() => ({ pass: true, message: "Unresolved: Consumer Activation Process Manual v8.0 §2.1.15/§3.1.12 requires ZSB for mobile; a Day 7 workshop says it's FWA/fixed-only. Not blocking here - the evidenced screen itself (MNP Postpaid Address, FLD-523–526) marks these fields Mandatory: No with a \"Skip Address\" option - but confirm with COPS & Digital / Customer Data Management before treating this as final." })`.
  **Important correction to how this rule is actually wired:** `ZsbAddressStep.tsx`'s own comment (lines 97-104) says the conflict "stays recorded in reference/blueprint conflict-report.md (Conflict 2) and in ruleEngine's BR-ZSB-MANDATORY-FOR-MOBILE, **which still evaluates**." A grep of the entire `src/` tree for both `BR-ZSB-MANDATORY-FOR-MOBILE` and every `evaluateRule(` call site (`src/engines/ruleEngine.ts:305-321` is the only place that dispatches into `ruleImplementations`) found **no caller anywhere that invokes `evaluateRule('BR-ZSB-MANDATORY-FOR-MOBILE', …)`** — not in `ZsbAddressStep.tsx`, not in `NewPostpaidWizard.tsx`, not anywhere else. The rule function exists and would return the message above if called, but as built it is dead code: the advisory text is **never rendered on this screen or anywhere in the running app**. Documenting this as observed rather than assuming the comment's "still evaluates" claim is accurate.

## 2.9 Conditional display rules
| Element | Condition | Controlling ID |
|---|---|---|
| "Checking for an address on file…" message | `fetching === true` | MPA-DP-008 |
| MOI address-prefill fetch fires | `nationality === 'Qatari' && idNumber` truthy `&& !value.fetchedFromMoi && !value.zone` (`ZsbAddressStep.tsx:126`) | MPA-DP-009 |
| Fibre Readiness banner renders at all | `zone`, `streetNo`, `buildingNo` all non-blank (trimmed) (`FibreReadinessBanner.tsx:59`) AND `ims-site-zsb` dataset loaded (line 61) | MPA-DP-010 |
| Fibre Readiness banner styling/text (ready vs. not-ready) | bare-value match of Zone+Street+Building against any `ims-site-zsb.json` record (`FibreReadinessBanner.tsx:63-64`) | MPA-DP-011 |

## 2.10 Validation and error handling
**None.** No `MPA-VAL-` ID is assigned by this screen — every field is unvalidated free text (see §2.5's closing note), matching the evidenced Mandatory: No status. This is a deliberate, evidenced state (FLD-523–526), not a gap to be filled by inference.

## 2.11 Integration trigger points
- MPA-INT-003 — MOI-linked address lookup: `identity-documents` (match `documentNumber === idNumber`) → `addresses` (match `customerId` + `primaryStatus === 'Primary'` + `activeFlag`) (`ZsbAddressStep.tsx:130-152`). Trigger point only — not a live integration.
- MPA-INT-004 — Area/Kahramaa suggestion list load: `kid-address-records` + `addresses` read on mount to build `areaOptions` (`ZsbAddressStep.tsx:113-123`). Trigger point only — not a live integration.
- MPA-INT-005 — Fibre readiness lookup: `ims-site-zsb` read on mount, matched client-side against the typed Zone/Street/Building (`FibreReadinessBanner.tsx:52-53, 63-65`). Trigger point only — not a live integration.

## 2.12 Navigation behaviour
- MPA-NAV-006 — Unconditional auto-advance: on first forward arrival at this step, `autoAdvanceWhen` returns true immediately, firing `GuidedActivationWizard`'s auto-advance effect (`GuidedActivationWizard.tsx:437-449`) and calling `goNext()` to Billing Profile without agent action, on every run of this journey (`NewPostpaidWizard.tsx:285`).
- MPA-NAV-007 — Rail re-entry: clicking "Communication Address" in the rail after the skip (allowed once `maxReached` ≥ its index — MPA-BTN-00-001 in [00-wizard-shell.md](00-wizard-shell.md)) opens the real form; the `autoAdvancedRef` guard (`GuidedActivationWizard.tsx:441-444`) prevents the effect from re-firing, so this visit behaves like any ordinary step (Continue still always enabled per §2.2).

## 2.13 Related edge cases
- MPA-SCN-008 — Happy path: any customer, this screen is auto-skipped in full; the agent never sees it unless they deliberately click back into the rail.
- MPA-SCN-009 — Non-Qatari / no `idNumber`: MOI prefill never attempts to run (`nationality !== 'Qatari'` or `idNumber` falsy short-circuits `ZsbAddressStep.tsx:126`); the auto-skip still happens regardless — prefill eligibility has no bearing on whether the step is shown.
- MPA-SCN-010 — Rail-click-back after skip: reopens the real form (empty, or MOI-prefilled for a Qatari customer with an on-file address), fully editable, Continue remains enabled throughout since `isValid` never depends on this screen's values.
- MPA-SCN-011 — ZSB-mandatory-for-mobile conflict: the advisory defined in `ruleEngine.ts` (MPA-BR-006) is **not surfaced anywhere in the running UI** — confirmed no call site invokes it. The underlying policy conflict (Consumer Activation Process Manual vs. Day 7 workshop) therefore remains genuinely unresolved and, as currently built, invisible to the agent using this screen.
- MPA-SCN-012 — Fibre Readiness banner: only reachable at all via a rail-revisit (since the step is normally skipped), and only renders once Zone+Street+Building are all filled in; demonstrates both the "ready" and "not ready" match states against `ims-site-zsb.json`.

## 2.14 Persona-specific behaviour
None found. `ZsbAddressStep` and `FibreReadinessBanner` take no role/persona prop and contain no persona-conditional logic anywhere in either file (confirmed by full-file read). Preliminary — Phase 9 will re-verify exhaustively across the whole journey, including whether any role's navigation/visibility config affects reachability of this step itself (not the step's own content).

## 2.15 Accessibility
To be completed live in Phase 12.

## 2.16 Source references
- `NewPostpaidWizard.tsx:257-286` (step wiring, `isValid`/`autoAdvanceWhen`, render props)
- `ZsbAddressStep.tsx` (full file — component, `ZsbAddressValue` type, MOI-prefill effect, area-options effect, JSX field grid)
- `FibreReadinessBanner.tsx` (full file — readiness check, `bareValue()` normalizer, render states)
- `src/engines/ruleEngine.ts:59-80, 305-321` (BR-ZSB-MANDATORY-FOR-MOBILE definition and `evaluateRule`/`hasImplementation` dispatch — confirming no caller)
- `src/components/patterns/GuidedActivationWizard.tsx:437-449` (auto-advance effect and `autoAdvancedRef` guard), `:524-531, 582` (rail click reachability, cross-referenced via `00-wizard-shell.md`)
- `public/mock-data/identity-documents.json`, `addresses.json`, `kid-address-records.json`, `ims-site-zsb.json`, `customers.json` (fixtures; `customers.json` confirms CUST-1001/CUST-9001 nationality Qatari, CUST-1007 nationality Swedish)

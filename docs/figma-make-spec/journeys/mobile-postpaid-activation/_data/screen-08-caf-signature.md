# MPA-SCR-08 — CAF & Signature

Route: step 8 of 9 in the wizard rail (key `caf`). Component: `CafSignatureCapture` (`src/components/patterns/CafSignatureCapture.tsx`, full file, 409 lines) called with `autoDetectDeviceType` (Postpaid-only opt-in), wired at `NewPostpaidWizard.tsx:452-501`.

## 8.1 Purpose
Auto-detect the signing device type, present the customer with a CAF preview plus a dynamic, business-maintained Terms & Conditions bullet summary and the commercial recap carried forward from Checkout, capture an in-app signature, then — once signed — let the agent review the signed CAF and attach any additional supporting documents. This is the **only step in this journey** with `customerFacing` and `locksAfter` step-level behaviour (`NewPostpaidWizard.tsx:490-501`).

## 8.2 Entry / exit conditions
- **Entry:** reached from Checkout via Continue (always enabled there).
- **Exit (Continue enabled) — `isValid`** (`NewPostpaidWizard.tsx:480-484`):
  ```
  if (!c?.cafType) return false;
  return c.cafType !== 'Digital' || Boolean(c.signatureDataUrl);
  ```
  Given `autoDetectDeviceType` only ever sets `cafType` to `'Digital'` or `'Touch Screen'` (§8.8, MPA-BR-028), this predicate behaves asymmetrically by detected type — see the discrepancy documented at MPA-BR-029.
- **`customerFacing`** (`NewPostpaidWizard.tsx:490-494`) uses the negation of the same predicate. While `customerFacing` is true, `GuidedActivationWizard` strips ALL chrome for this render — no rail, no Abandon/Save & Exit, no wizard heading, no Back/Continue footer (`GuidedActivationWizard.tsx:535-547`) — leaving only `CafSignatureCapture`'s own render output in a centred `max-w-2xl` column.
- **`locksAfter`** (`NewPostpaidWizard.tsx:498-501`) reuses the exact same predicate again. Once any step through the current one returns `locksAfter: true`, the whole journey locks: Back is hidden, the rail stops accepting clicks even for previously-reached steps, and this state persists into Payment and Confirmation (there is no unlock mechanism).

## 8.3 Screenshots (state plan)
| ID | State | How to reach |
|---|---|---|
| MPA-SCR-08-ST01 | Detecting device type (transient) | Instant on mount, before `detectCafType()`'s effect resolves `cafType` |
| MPA-SCR-08-ST02 | Customer-facing signing screen — Digital device, unsigned | Non-touch device; bullets + commercial recap + "Please Sign" button, no wizard chrome |
| MPA-SCR-08-ST03 | Signed — Digital, post-signature agent view | Signature captured; wizard chrome restored, "Signed" badge + signature image, Additional Documents panel visible |
| MPA-SCR-08-ST04 | Touch Screen device detected — pre-signature, already locked/valid | Touch-capable device (`maxTouchPoints > 0` or `pointer: coarse`) — see MPA-BR-029 discrepancy; Continue is clickable and the journey is locked before any signature exists |
| MPA-SCR-08-ST05 | Touch Screen — agent signs anyway | Agent voluntarily presses "Please Sign" on a Touch Screen device even though the gate did not require it |
| MPA-SCR-08-ST06 | Bullets: plan lock-in only | Plan with `commitmentMonths`, no discount, no Star number |
| MPA-SCR-08-ST07 | Bullets: plan + discount (with expiry) | Plan with commitment + a discount carrying `durationMonths` |
| MPA-SCR-08-ST08 | Bullets: plan + discount (no expiry) | Discount with `durationMonths: null` |
| MPA-SCR-08-ST09 | Bullets: plan + Star lock-in | Star number selected at Number Selection, banded to a tier |
| MPA-SCR-08-ST10 | Bullets: fallback "no minimum commitment" | No plan commitment, no Star number, no discount |
| MPA-SCR-08-ST11 | Additional Documents — empty state | Immediately post-signature, no documents added yet |
| MPA-SCR-08-ST12 | Additional Documents — 1+ attached | Agent labels and browses a file |
| MPA-SCR-08-ST13 | Additional Documents — validation error (missing label) | Agent clicks Browse with an empty label field (button is actually disabled in this state, see §8.10) |
| MPA-SCR-08-ST14 | Additional Documents — file-too-large error | File > 5 MB selected |
| MPA-SCR-08-ST15 | Additional Documents — 10-document limit reached | 10 documents already attached |

**Confirmed unreachable in this build:** the HRN-advance bullet (`hrn-advance` scenario key) — see §8.8, same fixture-level finding as MPA-SCR-07 §7.8/MPA-BR-030.

## 8.4 UI elements and content
- **Heading:** `"Please review and sign"` — renders only while `!signed` (`CafSignatureCapture.tsx:194`); stands in for the wizard's own `<h1>`, which is hidden while `customerFacing` is true.
- **CAF preview card:** header row `"Vodafone Customer Application Form"` / Arabic `"نموذج طلب عميل فودافون"` (`dir="rtl"`); `"Applicant: {customerName}"`; `idLabel`/`idValue` rows — **not passed by this journey** (`NewPostpaidWizard.tsx:456-478` omits both props), so these rows never render for MPA-SCR-08 specifically; disclaimer text verbatim: *"By signing below, the applicant accepts the General Terms and Conditions of Vodafone Qatar."*; either a "Signed" success badge + signature image, or a "Please Sign" primary button.
- **Key Information panel** (renders only while `!signed` and content exists): heading `"Key Information"` (renamed 2026-09-28 to match the shared heading other journeys use); dynamic bullet `<ul>` from `buildTncBullets()`; commercial `<dl>` fed by `orderSummary` (the exact 18-row set published by MPA-SCR-07's `onSummaryComputed` — not duplicated here, see MPA-SCR-07 §7.5); fallback line: *"For anything not covered above, [View Full Terms & Conditions]."* linking to `termsUrl="https://www.vodafone.qa/en/terms-and-conditions"`.
- **Signature Pad drawer** — title "Please Sign"; see MPA-SCR-14 for the shared component's own field/interaction detail (not duplicated here).
- **Post-signature Additional Documents panel** (`AdditionalDocumentsUpload`, renders only once `signed`): heading `"Additional documents"`; description verbatim: *"Optional - label and attach anything else this order needs. No signature required. Up to 10 files, 5 MB each."*; document list (icon, filename, `"{label} · {size}"`, remove button); "Document label" text input; "Browse…" button (disabled until label is non-empty); inline error region.

## 8.5 Field specifications
| ID | Label | Type | Mandatory | Editable | Default/source | Validation |
|---|---|---|---|---|---|---|
| MPA-FLD-08-001 | CAF Type | Auto-detected, not a manual picker under this journey | Yes (implicit) | No — set once by `detectCafType()`, never re-offered | `navigator.maxTouchPoints > 0 \|\| matchMedia('(pointer: coarse)')` → `'Touch Screen'`, else `'Digital'` (`CafSignatureCapture.tsx:38-42`) | n/a |
| MPA-FLD-08-002 | Signature | Drawn signature, captured as data URL | Effectively yes for Digital, **not enforced for Touch Screen** — see MPA-BR-029 | Yes, via Signature Pad drawer (MPA-SCR-14) | none until captured | n/a — no format validation, presence is the whole gate (and only enforced for Digital) |
| MPA-FLD-08-003 | Additional Document — Label | Free text | Yes, per document | Yes | agent-typed | Must be non-empty (trimmed) before Browse is enabled/before upload proceeds — MPA-VAL-009 |
| MPA-FLD-08-004 | Additional Document — File | File picker, `.pdf,.jpg,.jpeg,.png` | Yes, per document | Yes | agent-selected | ≤ 5 MB — MPA-VAL-010; total documents ≤ 10 — MPA-VAL-011 |

## 8.6 Buttons and actions
| ID | Label | Role | Enabled when | Action |
|---|---|---|---|---|
| MPA-BTN-08-001 | Please Sign | Primary | Always (while unsigned) | Opens the Signature Pad drawer (MPA-SCR-14) |
| MPA-BTN-08-002 | Browse… | Secondary (`ghost-rect`) | `label.trim()` non-empty AND < 10 documents attached | Opens native file picker; on selection, validates size and appends to `additionalDocuments` |
| MPA-BTN-08-003 | Remove document (trash icon) | Tertiary, per row | Always, per attached document | Removes that document from `additionalDocuments` |
| MPA-BTN-08-004 | "View Full Terms & Conditions" | Link | `termsUrl` provided (always, for this journey) | Opens `termsUrl` in a new tab (`target="_blank" rel="noreferrer"`) |
| MPA-BTN-00-002/003/004/005 | Back / Continue / Save & Exit / Abandon | — | Back hidden once locked; Continue per §8.2's `isValid` (subject to the MPA-BR-029 discrepancy) | See [00-wizard-shell.md](00-wizard-shell.md). Abandon is still visible on this step (it disappears only from Payment onward — `hideAbandonFrom="payment"`) but is functionally moot once `locksAfter` fires, since Back/rail are already frozen at that point. |

## 8.7 User interactions
- Mount → `detectCafType()` effect fires once, guarded on `!value.cafType` so a returning agent's recorded type is never silently replaced (`CafSignatureCapture.tsx:174-178`)
- Click "Please Sign" → opens Drawer with `SignaturePad` → draw → "Done" → `signatureDataUrl` set, drawer closes (see MPA-SCR-14 for the pad's own Clear/Done interaction)
- Once signed (`showsInAppSignature && signatureDataUrl`): "Please review and sign" heading disappears, Key Information panel disappears, "Signed" badge + signature thumbnail render, Additional Documents panel appears
- Type a document label → local state; error clears on change
- Select a file via Browse → validated (label present, size ≤ 5 MB, count < 10) → appended or rejected with an inline message
- Click a document's trash icon → removed immediately, no confirmation
- Keyboard: standard tab order; Please Sign/Browse/remove are native buttons (Enter/Space activate)

## 8.8 Business rules
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

## 8.9 Conditional display rules
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

## 8.10 Validation and error handling
- MPA-VAL-009 — *"Enter a label for this document before uploading."* (`AdditionalDocumentsUpload.tsx:54`) — shown if a file is somehow submitted with an empty/whitespace label; in practice the Browse button is already disabled in that state (`disabled={!label.trim()}`, line 122), so this message is a defence-in-depth path rather than the primary block. Recovery: type a label, then Browse.
- MPA-VAL-010 — *"{fileName} is {size}. The limit is 5 MB per file."* (`AdditionalDocumentsUpload.tsx:58`) — shown when the selected file exceeds `MAX_FILE_BYTES` (5 MB). Recovery: pick a smaller file.
- MPA-VAL-011 — *"Maximum of 10 documents reached. Remove one to upload another."* (`AdditionalDocumentsUpload.tsx:103`) — replaces the upload row entirely once `documents.length >= MAX_DOCUMENTS` (10). Recovery: remove an existing document first.
- No validation message exists for the signature/CAF-type gate itself — its behaviour is entirely the `isValid` predicate of §8.2/MPA-BR-029, which is silent (Continue is simply enabled or disabled, with no inline error text either way).

## 8.11 Integration trigger points
Trigger point only — not a live integration in the current implementation.
- MPA-INT-017 — `mockDataEngine.list('tnc-summary-bullets')` (`CafSignatureCapture.tsx:166`) — reads local static JSON, fires only when `autoDetectDeviceType` is set.

## 8.12 Navigation behaviour
- Back is hidden once `locksAfter` fires (i.e. once `isValid`'s predicate is satisfied for the first time — see MPA-BR-029 for exactly when that is per device type)
- Rail stops accepting clicks for the same reason, even for previously-reached steps
- No "Edit"-style jump-back exists on this screen (unlike Checkout's MPA-BTN-07-001)
- MPA-NAV-017 — Continue → Payment (MPA-SCR-09), gated by §8.2's `isValid`

## 8.13 Related edge cases
- MPA-SCN-034 — Digital device, happy path: detect → sign → review bullets/recap → sign → Additional Documents → Continue, fully gated as intended.
- MPA-SCN-035 — **Touch Screen device, unsigned Continue (see MPA-BR-029):** Continue/lock/customerFacing all flip on detection alone; if the agent proceeds without pressing "Please Sign," the order is submitted with `values.caf.signatureDataUrl` undefined.
- MPA-SCN-036 — Zero applicable bullet scenarios: only the `no-lockin` fallback bullet renders.
- MPA-SCN-037 — Reachable bullet combination is bounded by this journey's own intake constraints: `plan-lockin` and `discount-expiry`/`discount-no-expiry` are reachable given any plan/discount choice; `star-lockin` is reachable only when a Star number was chosen; `hrn-advance` is **confirmed unreachable** (§8.8) — independently verified against `public/mock-data/customers.json` and `identity-documents.json` for this file, not merely asserted from a prior screen's finding.
- MPA-SCN-038 — Re-entry after signing is impossible in the normal flow: `locksAfter` freezes the rail, so there is no UI path back to this step once signed, short of a full page reload discarding wizard state (no resume-into-locked-step behaviour was found in `GuidedActivationWizard.tsx`).

## 8.14 Persona-specific behaviour
None found conditional on role within this screen's own component (`CafSignatureCapture.tsx`) — preliminary; Phase 9 will grep exhaustively across the granted-role set.

## 8.15 Accessibility
To be completed live in Phase 12.

## 8.16 Source references
- `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx:452-501` (step wiring, `isValid`/`customerFacing`/`locksAfter` — MPA-BR-029's exact citation)
- `src/components/patterns/CafSignatureCapture.tsx` (full file — `detectCafType`, `buildTncBullets`, `autoDetectDeviceType` branch, both CAF-preview branches)
- `src/components/patterns/GuidedActivationWizard.tsx:535-547` (customer-facing chrome-stripping), `:284` (`isLocked` computed over the whole prefix), `:667` (Abandon's `!abandonHidden` gate, contrasted with Save & Exit's unconditional render at line 649)
- `src/components/domain/AdditionalDocumentsUpload.tsx` (full file — validation messages, limits)
- `src/components/primitives/SignaturePad.tsx` (signature capture primitive — cross-reference MPA-SCR-14, not duplicated here)
- `public/mock-data/tnc-summary-bullets.json` (bullet templates, including the file's own `_note` disclaiming evidenced-legal-text status)
- `public/mock-data/customers.json`, `public/mock-data/identity-documents.json` (HRN-reachability check independently re-run for this file)
- `docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/screen-07-checkout.md` §7.5 (the 18-row `orderSummary`/`cafSummary` set this screen consumes, documented there rather than duplicated here)

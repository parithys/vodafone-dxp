# UI Component Catalogue (Phase 20)

Complements `reconstruction-package/docs/reusable-patterns.md` (the 18 *pattern* components) with the underlying **primitive** and **domain** component tiers from `frontend-architecture.md` §3, which were previously only named in passing. Primitives are derived from the evidenced field data-type distribution in `field-inventory.md` (970 fields) and screen-type distribution in `screens.md` (213 screens); this mapping (data type → component) is a reasonable **Assumed** engineering default, not itself extracted, though the *counts driving it* are fully evidence-cited.

**Update:** §1's primitives below now have real, styled counterparts for a subset — see `reconstruction-package/docs/design-system.md` §7 for actual `Button`, `Input`, and `TagPill` (badge) components with full TypeScript prop APIs and Vodafone brand styling, sourced from a real Vodafone design-system project the user supplied. §5 (new) reconciles the two catalogues.

---

## 1. Primitives (generic, no business meaning)

| Primitive | Backs (data type in `field-inventory.md`) | Evidenced volume |
|---|---|---|
| `<TextInput>` | text | 214 fields |
| `<Select>` / `<Dropdown>` | dropdown/enum, dropdown, enum, dropdown/display | ~187 fields |
| `<NumberInput>` | number, number/currency, currency/number | 77 fields |
| `<FileUpload>` | file upload | 45 fields |
| `<DatePicker>` | date | 32 fields |
| `<Checkbox>` | checkbox | 22 fields |
| `<SignaturePad>` | signature | 16 fields |
| `<EmailInput>` | email | 13 fields |
| `<Textarea>` | textarea, text (free text) | 18 fields |
| `<Badge>` / `<StatusPill>` | (status/enum display fields across Order, Lead, Ticket, Billing Profile — see `screen-state-model.md`) | Used on every list/detail screen with a lifecycle-state entity |
| `<Modal>` | — | Backs 32 `Modal`-type screens |
| `<Popup>` | — | Backs 6 `Popup`-type screens |
| `<Tabs>` | — | Backs Customer 360 / Account 360 (Reusable Pattern 3) |
| `<Stepper>` / `<WizardShell>` | — | Backs 58 `Wizard`-type screens (Reusable Pattern 1) |
| `<DataTable>` | — | Backs list/grid screens (Lead lists, Order queues, Asset grids) |
| `<Toast>` / `<Alert>` / `<ConfirmDialog>` | — | See `notification-catalogue.md` §4 for the full evidenced taxonomy |

**Evidence note:** the *counts* above (field data types, screen types) are directly from `field-inventory.md` and `screens.md`. The *primitive names/API shape* are a standard component-library naming convention (Assumed) — no source document names these primitives, since the corpus's UI evidence is legacy Siebel/Open UI screenshots, not a component library spec.

---

## 2. Domain Components (thin wrappers bound to a specific entity/field shape)

Named in `folder-structure.md`; the full evidenced set, one per frequently-repeated domain concept (§ references `domain-model.md`'s entity IDs):

| Domain component | Wraps | Entity |
|---|---|---|
| `<QidInput>` | TextInput + format validation (QID/Passport/GCC/Diplomatic ID) | ENT-023/037 Customer/Contact |
| `<MsisdnPicker>` | Select + live reservation-token feedback (Reusable Pattern 10) | ENT-015 MSISDN/Number |
| `<SimSerialScanner>` | TextInput + barcode-icon + real-time UIM validation (Reusable Pattern 11) | ENT-026 SIM |
| `<CreditLimitEditor>` | Select (constrained pre-approved dropdown) + Rule Engine threshold check (Reusable Pattern 8) | ENT-030 Credit Limit |
| `<BillingProfileSelector>` | Select | ENT-001 Billing Profile |
| `<AddressForm>` | Composite (Zone/Street/Building/Apt/Area TextInputs) + validation (see `exception-catalogue.md` EXC-001–004) | ENT-036 Address |
| `<AttachmentTile>` | FileUpload + mandatory-gating badge (Reusable Pattern 12) | ENT-025 CAF (and Supplementary Forms) |
| `<ApprovalActionBar>` | Button group (Approve/Reject-Correction/Reject-Drop) + ConfirmDialog (Reusable Pattern 5) | ENT-006 Order |

---

## 3. Pattern Components

See `reconstruction-package/docs/reusable-patterns.md` for the full 18-pattern catalogue (Guided Wizard, Customer 360, Order Approval Queue, CAF Signature Capture, Bulk Operation Portal, etc.) — not reproduced here to avoid duplication.

---

## 4. Component build priority

1. **Primitives** — build all in §1 first; every other tier depends on them.
2. **Domain components** most referenced across journeys (per `traceability-matrix.md`'s reverse index): `<CreditLimitEditor>`, `<MsisdnPicker>`, `<SimSerialScanner>` — these appear in nearly every activation wizard.
3. **Pattern components** per the build-priority order already given in `reusable-patterns.md`.

---

## 5. Reconciliation with the real Vodafone Design System (`design-system.md`)

| This catalogue's primitive | Real Vodafone component | Reconciliation |
|---|---|---|
| `<TextInput>` | `Input` (`design-system.md` §7) | Use the real component's props (`label`, `error`, `readOnly`); the source itself flags `Input`'s spec as *inferred*, not confirmed — and its styling guess ("1px charcoal border, 2px radius") is now **superseded by measurement**. The 2026-09-24 asset's bordered input is a `219x51` rect with `rx="11.5"`: a **1px `#e0e0e0` border and a 12px corner** (`--field-border`, `--field-radius`). Fields are the one element that does not share the 8px corner used by cards and buttons. The topbar search is the single filled exception — a flat `--search-bg` `#eeeeee` well with no border. |
| `<Badge>` / `<StatusPill>` | `TagPill` (`variant: "outlined-red" \| "filled-neutral"`) | **Resolved as predicted — extended, not replaced.** `Badge.tsx` keeps both source variants and adds five: `success`, `warning`, `danger`, `info`, `accent`, for the lifecycle states (`screen-state-model.md`) an editorial tag pill has no analog for. As of 2026-09-24 the status variants are **outlined** per the supplied Mobile Postpaid asset — `--bg` interior, 1px tinted border (`--success-border`/`--warn-border`/`--danger-border`/`--info-border`), coloured label, 4px corner (`--radius-tag`) — replacing the 12%-tint fill on a 32px pill they carried before. The `aria-hidden` leading status dot went with it: the asset's pills are label-only, and the dot was decorative (it took its colour from the text), so SC 1.4.1 still holds on the label alone. `info` (`#6926dc`) is new vocabulary from the asset's "Requires Approval" chip; no call site is rewired to it yet. |
| (no direct analog — buttons weren't previously specified in detail) | `Button` (5 variants: `primary-rect`, `primary-pill`, `ghost-rect`, `glass-pill`, `content-ghost-pill`) | Adopt directly for DXP actions — `primary-rect`/`ghost-rect` are the right fit for a form-heavy enterprise app; the pill variants (`primary-pill`, `glass-pill`) are editorial/marketing-oriented (per `design-system.md` §9) and likely don't belong in the agent-facing DXP screens. As implemented, corners are 8px (`--radius-button`), not the 2px this row originally assumed — the 2026-09-24 asset confirms 8px for every button, field and card. Two changes from that asset: primary variants are **flat** (the `--shadow-brand` glow is gone; the asset contains no shadows at all), and their disabled state is a solid `--accent-disabled` `#ffb3b3` fill rather than the shared `disabled:opacity-40`, which shifted with whatever sat behind it. |
| `<Modal>`, `<DataTable>`, `<Stepper>`/`<WizardShell>`, `<DatePicker>`, `<SignaturePad>`, `<FileUpload>`, `<Checkbox>`, `<NumberInput>`, `<EmailInput>`, `<Textarea>`, `<Select>`/`<Dropdown>`, `<Popup>`, `<Tabs>`, `<Toast>`/`<Alert>`/`<ConfirmDialog>` | **No analog in the design-system source** | These remain fully Assumed/engineering-default, styled using the design-system's *tokens* (`design-system.md` §2-5: colors, type, spacing, radius) but built from scratch — the source project is a marketing-site design system, not an enterprise CRM component library, so it simply doesn't cover these enterprise UI patterns. |
| — | `Card`, `FeaturedCard`, `CircularMedia`, `TopNav`, `Footer`, `RedBand`, `ShareTicker`, `ImpactMap` | Editorial/marketing components with no DXP screen analog (per `screens.md`'s 213 evidenced screens) — do not force these into the DXP; they exist for the source project's own corporate-website use case only. |

**Net effect:** apply the real Vodafone **tokens** (color/type/spacing/radius/motion) to every primitive and domain component in §1-2, and adopt `Button`/`Input`/`TagPill`'s real APIs directly where they overlap — but build the enterprise-specific primitives (DataTable, Stepper, Modal-driven wizards) from scratch, since no source material covers them.

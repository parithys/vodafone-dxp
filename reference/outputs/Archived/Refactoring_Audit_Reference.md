# VFQ DXP — Whole-app refactoring audit (Phase 1, no code changed)

Generated 2026-10-05 from the working tree at commit `33784c8` + the uncommitted field-token change.
Method: file/line counts, import-graph scan, export-reference scan, 8-line shingle duplicate scan, greps. Nothing executed against the UI.

## 1. Structure

| Area | Files | Lines | Role |
|---|---|---|---|
| `src/components` | 77 | 16.5k | `primitives` (28), `domain` (19), `patterns` (28) |
| `src/workspace` | 81 | 15.1k | Customer 360 (≈55 files), search, sales/support/tickets/tasks/orders/profile/admin workspaces |
| `src/modules` | 64 | 10.3k | 12 product/journey modules + `new-connection` + dashboard + not-built panels |
| `src/engines` | 25 | 3.2k | config, mockData, activity, eligibility, rule, persona, navigation, customer360, pricing … |
| `src/navigation` | 9 | 2.7k | Sidebar, GlobalSearch, PersonaSwitcher, Breadcrumbs, SessionReferenceNumbers (803 lines) |
| `src/stores` | 13 | 0.9k | zustand: auth, persona, config, workflow(drafts), activeCustomer, journeyCustomer, customerVerification, entity, notification, qnomy, region, sidebar, theme |
| `src/auth` | 5 | 0.5k | login, staff-ID → role map |
| `public/config` | 16 JSON | — | personas, routes (213 screens), feature catalogue, rules, field access, coverage… |
| `public/mock-data` | 100 JSON | — | all mock/synthetic records, read via `mockDataEngine` |

Total 49.6k lines TS/TSX, 853 lines CSS (`tokens.css` 412, `index.css` 273, tooltip 168). **No test files exist** — there is no automated safety net for "UI and behaviour must stay exactly the same".

Routing: `router.tsx` + `ScreenRouteResolver` + `screenRegistry`. Each module's `screens/index.tsx` calls `registerScreen(SCR-…)` (58 registrations of 213 route screens; the rest render `ScreenNotYetBuilt`). A single `/:moduleSlug/:screenSlug` route.

Journeys: 10 files mount `GuidedActivationWizard` (the shared shell): NewConnection (live New Postpaid / existing-customer flows), NewPrepaid, NewFixedLine, NewFwa, NewMnp, NewPreToPost, BaseManagement, NewSimSwap, PassportToQid, plus the dead standalone NewPostpaid.

Customer 360: `Customer360Layout.tsx` (593) picks one of three layouts by persona — **Retail** (11 `C360*` tab pages + header), **Telesales** (`telesales*.tsx`, 5 files ≈ 2.7k lines, own kit), or the **legacy topic-based** sections (`TopicFieldsSection` + resolvers + `customer360Layouts.ts`) for other departments.

## 2. Findings

### 2.1 Important corrections to earlier work (please read)
1. **`NewPostpaidWizard.tsx` is dead code.** `mobile-postpaid/screens/index.tsx` maps every New Postpaid screen id to `<NewConnectionWizard flow="new" />`. My earlier edits to the activity logging in `NewPostpaidWizard.tsx` (customerId, Workflow Approval activity) therefore never run. The live path (`NewConnectionWizard`) already passed `customerId` and logged a separate workflow event, so the *behaviour you wanted is live*, but my earlier gap list was wrong for that path. Hard Stop / Abandoned changes are in the shared shell (`GuidedActivationWizard`) and are live.
2. **The 10 `Retail*` Customer 360 files are dead** (never imported) — my "AM name → Account Manager Name" rename in `RetailAccountInformation.tsx` had no visible effect. The live Retail tab is `C360AccountInformation.tsx`, where that rename did apply.
3. **`MultiSelect`, `DateRangeSelect`, `Autocomplete` are never imported.** The field-token change touched them harmlessly, but no live screen uses them — so "date pickers" currently rely on `Input type=date` / other controls.
4. **There is no `isSynthetic` flag.** Purple demo values are driven by the `demo-only` CSS class + `SHOW_DEMO_CONTENT` (`src/demoContent.ts`) and `workspace/customer360/demoValues.tsx` (`Dv`). Making synthetic-ness a per-value flag would be new behaviour; see plan phase 4.

### 2.2 Unused code (listed, not deleted)
Files never imported (18, ≈3.9k lines): `mobile-postpaid/screens/NewPostpaidWizard.tsx` (684), `domain/DeviceInstallmentStep.tsx` (366), `primitives/MultiSelect.tsx` (176), `primitives/DateRangeSelect.tsx` (175), `primitives/Autocomplete.tsx` (145), `engines/validationEngine.ts` (25), `customer360/sections/ProfileSection.tsx` (132), and the ten `Retail*.tsx` sections (RetailAlertsRisks 164, RetailContactAssets 161, RetailAssets 154, RetailAccountInformation 121, RetailBlacklistView 119, RetailAuditTrail 110, RetailContactInformation 108, RetailAccountAddress 99, RetailBillingPayments 80, RetailAccountContactLead 80, RetailPenaltyView 55).
Also dead: `retailCards.tsx` consumers shrink to the Retail* set (verify), `DateRangeCalendar` consumers, and ~40 exports referenced nowhere (e.g. `allStaffIds`, `useSelected`, `ListRow`, `formatDobInput`, `resetMockData`, `getRoutesForModule`, `getFeatureCatalogue`, `getDomainEntity`, `getDesignToken`, `canReachNavKey`, `visibleRoutesFor`, `canAccessScreen`, `canPerformFeatureAction`, `isRequired`, `requiredMessageFor`, `validationDescriptionFor`, `hasImplementation`, `getRuleCatalogueEntry`, `accountHolderStatus`, `SEARCH_GROUP_LABELS`, `TicketStatus`, `JourneyStep`, `EligibilityOutcomeLinks`). Some may be config-driven API surface; each needs a human decision.

### 2.3 Duplication
- `NewPostpaidWizard` ↔ `NewConnectionWizard`: 72 duplicate 8-line blocks (the dead copy; goes away with deletion).
- `NewFixedLineWizard` ↔ `NewFwaWizard`: 22 shared blocks; `NewFwaWizard` ↔ `NewMnpWizard` 7. Strong candidate for a config-driven wizard.
- `GuidedContactStep` ↔ `IdLookupStep` (both ≈1.1k/0.7k lines): 8 shared blocks.
- Three Customer 360 generations render the same data with separate kits: `c360Kit` (Retail), `telesalesKit` + `telesalesSections{A,B,C}` (Telesales), `TopicFieldsSection` + resolvers (others). Persona differences are currently branched in `Customer360Layout`, not configured.
- Helper re-definitions: `const str = …` copied in **14** files; `formatDate` in 6; `qar` in 3; `MONTHS`/date formatting in 3 (`c360Kit` already exports `fmtDate`, `fmtDateTime`, `qar`).
- Ticket screens (`TicketDetail`, `TicketApprovalReview`, `TicketsDashboard`) share blocks.

### 2.4 Hardcoded data
- Mock data is mostly in `public/mock-data` via `mockDataEngine` (good). Leaks: `fetch('/mock-data/govt-retiree-registry.json')` directly in `new-connection/steps.tsx`; two config JSONs fetched directly in `fieldAccess.tsx` and `requirementCoverage.ts` (bypassing `configEngine`).
- Literal agent id `'AGENT-KARTHIKK'` hardcoded as `createdBy` in 3 wizards (`NewConnectionWizard`, `NewFwaWizard`, dead `NewPostpaidWizard`) instead of the signed-in agent.
- Inline reference arrays in code: `ticketReferenceData.ts` (11 constants), `C360ProductsServices`, `steps.tsx`, `BillingAccountStep`, `ContactSection`, `C360AddressService`, `DemographicEditDrawer`, `BulkOperationPortal`, `AppointmentBookingStep`, `MsisdnPicker`, `TicketCreationModal`.
- `demoValues.tsx` (151 lines) derives synthetic values in code with a frozen `TODAY = 2026-09-14`; `customer360Engine` has its own `SESSION_TODAY`.

### 2.5 Hardcoded style values
- 142 hex colours in TS/TSX. Concentrated: `ScannedIdPreview` 73 (the simulated ID card artwork), `new-connection/steps.tsx` 12, `Button` 9, `telesalesSectionsA/B/C` 10, `MsisdnPicker` 5, `PersonaSwitcher` 4, `ProductLinePage` 4, `Breadcrumbs` 3, `CountryMarker` 3, `Badge` 3. Plus 4 `rgb()`, 12 inline `style={{}}`, 33 arbitrary `w-[…px]`-style sizes, 1 `text-[…px]`.
- Tokens: `tokens.css` is the light theme; `index.css` re-declares dark values (a second place to keep in sync); `public/config/design-tokens.json` is a third token source (read via `getDesignToken`, which nothing calls).
- Field tokens `--color-field-border-focus` / `--color-field-text-filled` are in (uncommitted).

### 2.6 Customer context (ID, name, segment)
Three overlapping stores plus draft values:
- `activeCustomerStore` (persisted to localStorage; full summary incl. segment, benefits) — set from Customer 360 / search.
- `journeyCustomerStore` / `useJourneyCustomer` (sessionStorage; wizardId, journey, name, idNumber, optional customerId; **no segment**; `begin` is a no-op once set).
- `customerVerificationStore` (persisted; verification state).
- Wizards also keep `contact.moiResult`, `eligibility.customerId` in draft values; the shell reads `useJourneyCustomer.active` then falls back to parsing `wizardId` with a regex (`existing-(.+)$`).
Consumers: 17 files. Unifying to one store with `{customerId, name, segment, …}` touches every journey and persistence keys.

### 2.7 Oversized files (>500 lines)
`GuidedActivationWizard` 1129, `IdLookupStep` 1125, `new-connection/steps.tsx` 1071, `NewConnectionWizard` 1005, `PostpaidPlanAddonsStep` 895, `SessionReferenceNumbers` 803, `TicketDetail` 764, `CheckoutSummaryStep` 753, `MsisdnPicker` 751, `GuidedContactStep` 738, `telesalesSectionsA` 733, `NewPostpaidWizard` 684 (dead), `EligibilityGateStep` 659, `telesalesSectionsC` 639, `BillingAccountStep` 608, `Customer360Layout` 593, `telesalesSectionsB` 588, `CafSignatureCapture` 575, `QidImageUpload` 567, `ScannedIdPreview` 558, `C360ProductsServices` 524, `c360Kit` 520.

### 2.8 Inconsistent patterns / naming
- Folder styles mix: `modules/<kebab>/screens/index.tsx` registries vs `new-connection/` (wizard at module root, no `screens/`); `workspace/` holds both pages and a 55-file Customer 360 subtree; `components/{primitives,domain,patterns}` boundaries blur (e.g. `patterns/` contains full steps and screens).
- Customer 360 naming: `C360*` vs `Retail*` vs `telesales*` vs `*Section`; resolver files `*Resolvers.tsx` hold no JSX.
- Direct `fetch` vs `configEngine`/`mockDataEngine` (see 2.4).
- Two token naming schemes: `--field-*` (existing) and the new `--color-field-*` requested names.

## 3. Proposed phased plan (risk ascending; one commit per phase; I stop for your test after each)

**Phase 0 — Safety net (no app code change).** There are no tests. Add a small Playwright-free check using what exists: a scripted baseline of (a) `tsc` + `oxlint` + `vite build`, (b) DOM-snapshot / computed-style capture of key screens per persona through the preview tool, stored under `reference/`. *Needs your OK*, because "no new libraries" — I would script it with the existing preview tooling, no dependency.

**Phase 1 — Delete provably dead code (lowest risk).** Delete the files in 2.2 *after you tick the list*; remove unreferenced exports you approve. Benefit: −4k lines, removes my misleading dead edits. Risk: negligible (nothing imports them); `tsc` + build confirm.

**Phase 2 — Shared helpers & config access.** One `lib/format.ts` (`str`, `fmtDate`, `fmtDateTime`, `qar`) replacing 25 local copies; route the 4 direct `fetch`es through `configEngine`/`mockDataEngine`; replace `'AGENT-KARTHIKK'` with the signed-in agent. Risk: low, but the hardcoded agent id changes stored `createdBy` values — I'd keep the same value unless you say otherwise.

**Phase 3 — Design tokens.** Move the live hex/px values (excluding the simulated ID artwork unless you want it tokenised) into `tokens.css` (+ dark overrides in one place); decide the fate of `design-tokens.json`. Verify with computed-style diffs per screen. Risk: low-medium (colour must remain pixel-identical).

**Phase 4 — Data layer.** One `src/data/` home: `synthetic` vs `real` marking. Introduce an explicit `isSynthetic` marker (wrapper/flag around values) that drives the existing `demo-only` class; move `demoValues` and inline reference arrays (`ticketReferenceData`, etc.) behind it. Risk: medium — must keep violet rendering identical and `SHOW_DEMO_CONTENT` switch working.

**Phase 5 — Single customer-context store.** Merge `activeCustomerStore` + `journeyCustomerStore` (+ verification) into one store exposing `{customerId, name, segment, …}`; every journey reads it; keep the "context can't switch mid-journey" rule and activity logging inputs unchanged. Risk: **high** (persistence keys, 17 consumers, journey resume). Needs careful manual test of all 9 journeys.

**Phase 6 — Split oversized components** (shell, IdLookup, steps.tsx, NewConnectionWizard, PostpaidPlanAddons, SessionReferenceNumbers, TicketDetail …) into focused files with no logic change. Risk: medium; mechanical.

**Phase 7 — Consolidate duplicated screens.** (a) Fixed-Line/FWA/MNP wizards → one config-driven wizard; (b) Customer 360: merge Retail/Telesales/topic layouts onto the `c360Kit` primitives with persona differences in `personas.json`/layout config. Risk: **highest** — largest surface; do last, per persona, with before/after snapshots.

**Phase 8 — Folder structure & naming.** Apply one convention (`modules/<x>/{screens,components,hooks}`, `workspace/customer360/{layout,tabs,kits,telesales…}`), rename `Retail*/C360*` consistently, update imports. Risk: low logic risk, large diff; done after the others so moves don't mask changes.

## 4. Decisions needed before Phase 1
1. Approve deleting the 18 dead files (list in 2.2)? Any you want kept?
2. Which of the ~40 unreferenced exports may go?
3. Phase 0: OK to build the baseline-capture script with existing tools only?
4. `createdBy: 'AGENT-KARTHIKK'` — keep literal, or use the signed-in agent?
5. Tokenise `ScannedIdPreview`'s 73 artwork colours, or treat the simulated ID card as an illustration and leave it?

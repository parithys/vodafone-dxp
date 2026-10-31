# UI Design-System Gap Analysis — VFQ DXP (`vfq-dxp-app`)

Audit date: 2026-10-10 · Scope: the whole application (`src/`, `index.html`, `public/config/design-tokens.json`) · Mode: **report only — no source was changed by this audit**
Companion workbook: `UI_Design_System_Gap_Analysis_Reference.xlsx` (finding register, 308-file component inventory, per-file hard-coding counts, dead tokens, duplicate token values, a11y evidence).
Builds on `UI_Review_Remediation_Reference.md` (2026-10-07); open residuals from that audit are reconciled in Appendix C.

---

## 1. Executive summary

**Verdict.** The application is token-compliant at *render* time (after the derived-colour fix recorded in section 14), but the design system is **not enforced**, so it will drift. Colour, type size and radius are almost fully tokenised; spacing, font weight, z-index and motion are not tokenised at all; and there is no automated check (no CI, no token test, a broken guard) to stop new violations. The largest consistency debt is not stray styles but **parallel component kits**: Customer 360 runs three UI trees beside the primitives, the card shell is re-typed about 220 times, and 13 status-colour maps disagree. Accessibility has **4 blocking (P0) gaps**, mostly fixable in one shared place.

| Dimension | Rating | Headline evidence |
|---|---|---|
| Colour tokenisation (rendered) | **Complete** | 0 off-token colour, background, border, radius, shadow or font-size values across 3,954 visible elements on 12 routes (light; dark spot-checked on 4). Before the fix the only exceptions were white-alpha overlays and `color-mix` icon-tile tints (T-05, resolved) |
| Type-size tokenisation | **Good** | 1,159 `text-[length:var(--fs-*)]` vs 3 off-ramp sizes (99.7%) |
| Radius / shadow tokenisation | **Good / Fair** | radius 401 token uses vs 60 default `rounded-*` (87%); shadows 23 tokenised + 52 focus-ring vs 5 defaults |
| Spacing, font weight, z-index, motion | **Poor** | 0 token references for spacing (2,492 utilities), weight (531), z-index (25 literals), motion (~12 literals) |
| Dark-mode parity | **Fair** | 51 of 120 colour tokens have no dark override; 6 visibly broken in dark |
| Component standardisation | **Fair** | Button 64%, Input 93%, Select 90%, DataTable 56% adoption; hot spots in Customer 360 |
| Accessibility (WCAG 2.1 AA) | **Poor** | 4 P0, 13 P1 (11 a11y + 2 layout); focus ring ≈1.5:1; 3 lookups not keyboard-operable |
| Governance / enforcement | **Poor** | 0 CI workflows; token-sync test checks 5 of 246 tokens at audit time; the button-`type` guard misses all 31 offenders |
| Orphaned code | **Good** | 1 orphaned file, 2 unused exports, 5 dead helpers; 57 of 246 tokens dead |

**Counts.** {{COUNTS}}

**What is already good** (keep it): the type scale and radius are enforced in practice; 0 undefined `var(--*)` references; dialogs have real focus-trap/restore (`useDialogBehaviour`); the capability registry matches its consumers (22/22); only 1 file is truly orphaned; `ErrorBoundary`, route-level code splitting and the Button/Badge/Pager primitives are solid.

**Three decisions unlock most of the work** (Tier C — need a human): (1) the label case convention (Title Case vs sentence case); (2) the link colour (teal `--link` per `tokens.css:179`, vs the 9 red text links in Customer 360); (3) the control-border contrast fix (`--field-border` #e0e0e0 is ≈1.3:1), which changes the visual language.

**Recommended order.** Phase 0 guardrails (1 week) → Phase 1 P0/P1 quick wins (1–2 weeks) → Phase 2 new primitives (3–4 weeks) → Phase 3 token tiering and migration (2–3 weeks) → Phase 4 Customer 360 consolidation (3–4 weeks) → Phase 5 content and behaviour standards (2 weeks). Effort model in section 11.

---

## 2. Scope, method and evidence quality

| Method | What it covered | Limits |
|---|---|---|
| Static scan (script) | 469 files under `src/` (308 `.tsx`, 157 `.ts`, 4 `.css`): hard-coded values, token references, raw elements vs primitives, repeated class strings, JSX-aware a11y checks | Counts come from regex/JSX parsing; wrapped class strings and multi-line props can be missed — treat as "at least" |
| Rendered-DOM audit | Computed `color`, `background`, `border`, `font-size`, `font-weight`, `border-radius`, `box-shadow` of every visible element compared with the resolved token set, on 11 routes (`/customer-search`, `/customer/CUST-1001`, `/tasks`, `/orders`, `/leads`, `/sales`, `/operations`, `/mobile`, `/support`, `/ticket-history`, `/mobile/new-connection`) plus the dashboard | 12 routes at audit time (213 screens are catalogued, 69 built), light theme only. The post-remediation re-run covered 14 routes (4,788 elements) in light theme and 4 routes in dark; most catalogued screens and all journey end-states were not rendered |
| Four read-only deep dives | Token architecture, accessibility, component duplication, typography/spacing/layout/behaviour — every finding carries `path:line` | Dark-mode contrast figures are estimates from hex values; light-mode token contrast was computed. Dark-mode contrast has still not been measured in a browser |
| Visual evidence | 1024px-wide captures taken during the journey screenshot run (top-bar overlap, clipped number cards, wrapped dates) | Browser-pane captures only (about 800px-wide JPEGs); Playwright cannot start in this sandbox, so there are no full-resolution or automated visual-regression captures |

Reproducibility: the scripts are in `reference/scripts/ui_audit/` (see its README); counts are regex/JSX-parsed "at least" figures. Not assessed: the print stylesheet beyond `index.css:286-300`, mock-data content, AI/Explainability layers.

---

## 3. Component inventory and coverage

### 3.1 Inventory by layer

| Layer | `.tsx` files | Lines | Role |
|---|---|---|---|
| `components/primitives` | 27 | 2,407 | Design-system primitives (Button, Input, Select, Badge, DataTable, Tabs, Modal, Pager, Spinner, Tooltip…) |
| `components/patterns` | 55 | 6,731 | Composite patterns (wizard shell, plan/add-on steps, validation, summary panels) |
| `components/domain` | 20 | 3,608 | Domain widgets (MsisdnPicker, QidInput, scanners, uploads) |
| `capabilities` | 43 | 4,081 | Reusable journey capabilities (22 registered; barrel import rule) |
| `modules` | 67 | 6,559 | Journey/module screens (16 modules) |
| `workspace` | 80 | 14,511 | Customer 360, tasks, tickets, administration, sales, orders |
| `navigation`, `auth`, shell (App, main, router, ErrorBoundary, data) | 16 | 3,016 | Sidebar, top bar, search, login |
| **Total** | **308** | **≈40,900** | 345 exported components/constants |

Route coverage: 213 screens catalogued in `routes.json`, 69 registered via `registerScreen()`; every registered id exists in the catalogue; no registered screen is unreachable.

### 3.2 Primitive adoption (elements outside `components/primitives`)

| Primitive | Uses | Bypassed by | Adoption | Note |
|---|---|---|---|---|
| `Button` | 236 | 131 raw `<button>` | **64%** | ~75 of the raw buttons are link- or icon-styled (C-05) |
| `Input` | 91 | 12 raw `<input>` (5 are file inputs) | 93% | Login, sidebar search, QID, phone |
| `Select` | 62 | 7 native `<select>` + `FilterSelect` (25 uses) | 90% | `FilterSelect` re-implements the listbox |
| `Textarea` | 22 | 0 | 100% | |
| `DataTable` | 37 | `GridTable` 21 (+20 via Telesales wrapper) + 8 raw `<table>` | **56%** | Different column API |
| `Badge` | 101 | ~17 hand-rolled pills + 2 `Pill` kits | ~84% | |
| `Modal` / `Drawer` | 5 / 33 | 0 custom dialogs | 100% | Only 2 files use `role="dialog"` |
| `Tabs` / `SegmentedTabs` | 14 / — | 1 hand-rolled `role="tablist"`; 3 pass-through aliases | ~95% | |
| `Checkbox` / `Radio` | 11 / 3 | `Radio` has 1 consumer; 2 hand-rolled radio cards | — | |
| `Spinner` | 4 | hand-rolled `animate-spin`, text-only loading | low | |
| `Icon` | 186 | 11 inline `<svg>`; 109 path constants | 94% | Path data duplicated |
| **No primitive exists for** | | Card/Panel (~220 re-typed shells), Banner (22), EmptyState (~72), FormField, Popover/Menu/Combobox (7 hand-built), IconButton, Avatar (5), Skeleton | — | C-01, C-04, C-09–C-11, C-13 |

The three Customer 360 trees (header-only persona, Telesales, legacy `*Section` tabs — `Customer360Layout.tsx:249,469,483,498`) account for most of the bypass.

---

## 4. Design-token compliance assessment

### 4.1 Architecture (current state vs target)

| | Current | Target |
|---|---|---|
| Tier 1 — reference palette | **Absent**; hex repeated inside semantic tokens (105 tokens = 78 unique values; `#e60000` under 7 names) | `--ref-*` ramps, never referenced by components |
| Tier 2 — semantic | **Strong** (~77 tokens: `--fg`, `--bg`, `--surface`, `--border`, `--accent`, status) | Keep; rename to the `--color-*` grammar so Tailwind maps 1:1 |
| Tier 3 — component | **Uneven**: `--field-*` 26 (+2 `--color-field-*`), `--nav-*` 10, `--tooltip-*` 21; mostly raw hex, only 7 of 218 are `var()` aliases | Aliases of tier 2 only, so dark mode is inherited |
| Files | 4 sources: `tokens.css` (light only), `index.css` (37 `@theme` mappings, 3 dark blocks, 2 extra light blocks, 47 colour literals), `tooltip-tokens.css`, `design-tokens.json` (unused) | One light+dark source; JSON generated or deleted |
| Rating | **≈1.5 of 3 tiers** | 3 |

### 4.2 Compliance by category

| Category | Tokenised | Not tokenised | Compliance | Findings |
|---|---|---|---|---|
| Colour (render) | all computed colours (alpha and mixed colours now named tokens) | none on the 12 audited routes | **100%** | T-05 (resolved), T-06 |
| Colour (source) | 2,163 theme-utility uses + 2,512 `var()` + the new on-dark/tone utilities | 47 `index.css` literals; ≈120 specimen-art values; 0 raw white/black | ≈96% | T-06, T-07 |
| Type size | 1,159 | 1 `text-base`, 1 `text-[0.5rem]`, 1 `clamp()` | **99.7%** | L-04 |
| Radius | 401 | 60 `rounded-full` etc. | 87% | T-09 |
| Shadow / elevation | 23 + 52 focus ring + 18 `shadow-raised` | `shadow-xl` 1, `shadow-none` 4 | ≈95% | T-09, T-19 |
| Spacing | 0 by token reference (scale-aligned: 2,492 numeric utilities) | 60 arbitrary lengths | **0% by reference** | T-01, T-08 |
| Font weight | 0 | 531 utilities | **0%** | T-02 |
| z-index | 0 | 25 literals, 16 collisions at z-50 | **0%** | T-03 |
| Motion | `--motion-base` 1, `--motion-spin` 1 | ≈12 literal durations/easings; only tooltip honours reduced motion | ≈15% | T-04 |
| Breakpoints / containers | — | 136 viewport prefixes; container queries only in Customer 360 | n/a | T-19, L-09 |
| Icon sizes / control heights | `--size-choice-box` | `w-4/h-4` 124×, `h-[18px]`, `min-h-[39px]`… | low | T-08 |

Hard-coded values by kind (static scan, excludes `tokens.css`): hex 111 (+5 brand art), `rgba/hsl` 14, SVG paint literals 45, arbitrary lengths 60, raw white/black 56, default radius 60, z-index 25, duration 10, `css` length literals 7, default shadow 5, inline-style literal 1. Per-file counts are in the workbook (sheet "Hardcoded by file"). Top offenders: `ScannedIdPreview.tsx` (122, specimen art), `index.css` (53), then spacing/weight-heavy screens (`OrderApprovalDetail.tsx` 103, `OfferDetailsDrawer.tsx` 62, `LoginPage.tsx` 61, Telesales billing/connections ≈57 each).

### 4.3 Token hygiene

- **Dead tokens: 57 of 246 at audit time (23%; 280 tokens after the 34 derived-colour tokens were added, all in use)** — `--space-*` (9), `--fw-*` (5), `--text-xs…4xl` (8), `--container-*`, `--section-y-*`, `--leading-*`, `--fs-h1/hero-*/impact/eyebrow`, `--font-display/mono`, `--radius-hairline/asymmetric/portrait`, `--help-band-*`, `--deep-red`, `--white-80`… (full list: workbook). The tooltip timing tokens look unused but are read through `getPropertyValue` and are live.
- **Duplicate values under different names:** `#e60000` ×7, `#ffffff` ×6, `#e0e0e0` ×5, `#f5f7f9` ×5, `#eeeeee` ×3, `#313131` ×3, `#007c92` ×3 (+ near-duplicate focus teal `#007e91`). Six `--fs-*` tokens all equal 14px.
- **Dark mode:** 51 colour tokens have no override. Brand-constant ones are legitimate; the defects are `Badge tag-amber` (≈1.4:1), `--tint-blue/indigo`, `--tag-blue`, `--info-banner-*`, `--telesales-*` (stay pale on dark), `--accent-text` (≈3:1 on dark), tooltip ≈ nav colour. No `color-scheme` is declared, so native scrollbars/pickers stay light.
- **`design-tokens.json`:** fetched at boot (`configEngine.ts:115`), stored, never read; 73 tokens missing; 4 values drifted (focus border/ring still the old `--fg`). The sync test checks 5 keys.
- **Canvas:** `SignaturePad.tsx:37` sets `strokeStyle = 'var(--fg)'`, which canvas ignores.
- **Light-mode token contrast (computed):** `--fg` 13.0:1, `--fg-2` 6.6:1, `--muted` 5.3:1 on white — fine; on the tinted `--page-bg` (#f1f4fa) `--accent` is 4.37:1, `--link` 4.43:1 and on `--surface` `--accent` is 4.48:1 — each just under 4.5:1 for normal text (prior audit residual 1, still open); the disabled primary (white on `#ffb3b3`) is 1.7:1. `--field-border` 1.3:1 and `--field-card-border` 1.6:1 fail the 3:1 non-text requirement (A-05).

### 4.4 Governance gaps

No CI (`.github/` absent), no pre-commit hook, `npm run build` = `tsc -b && vite build`, oxlint has 2 rules, and the 6 source guards in `tests/ui.test.mjs` scan `.tsx` only. The button-`type` guard uses a regex that stops at the first `>` (so at `=>` inside props) and **passes while 31 untyped `<button>`s exist**, including one in the `Tabs` primitive. The `rounded-*` guard exempts primitives; nothing blocks hex, `rgba`, `text-white`, `z-N`, `duration-N` or raw palette classes. The README rule "no hex in components" is prose only. (T-17)

---

## 5. Inconsistencies and deviations identified

### 5.1 Typography (L-01 … L-07)
The **role → style mapping is not consistent**: page titles are `--fs-h4` (27 screens via `PageHeader`) but `--fs-h3` in 7 other `<h1>`s and a fluid `clamp()` on the dashboard; section titles use five size/weight combinations; card titles are redefined in three private `CARD_TITLE` constants; Customer 360 shows the same role as a 14px uppercase eyebrow in one section and an 18px sentence heading in another (22 each). Weight is bold/semibold/medium by habit (146/190/176), not role. 131 heading elements coexist with ≈80 styled `div/span` headings; two pages have no `<h1>` and several jump h1→h3. Label case is mixed (headings 31 Title / 29 sentence; buttons 24 / 12). The Button base `font-medium` is dead (overridden by `!font-bold`).

### 5.2 Spacing and layout (L-08 … L-10)
Page left inset is 16/24/32px depending on the band; `PageHeader` bleeds `-mx-8` then pads `px-5`, so titles sit 12px left of their content. Card padding is p-3/4/5/6 and card gaps mb-4/mb-6 with no rule. Viewport breakpoints are used in 39 files for content whose real width is viewport − 280px sidebar − 320px summary − margins, so at **1024px the step content is only ≈280–360px** (number-card values clip, dates wrap). Container queries exist only under Customer 360 and are declared once (vertical rail `Tabs`).

### 5.3 Elevation, borders, motion
Border colour roles overlap (`--field-card-border` 220, `--border-soft` 125, `--border` 12, `--table-border` 4; two table headers use different border tokens). `rounded-full` and `--radius-pill` both mean "pill". Durations are literals; transitions ignore reduced motion except in the tooltip.

### 5.3a Rendered defects seen on screen (1024px)
Top bar: the red customers-served badge covers "Next Customer" (L-10). Number cards clip price and lock-in. Identity card wraps `30/04/203 / 0`. Breadcrumb shows the raw catalogue string "Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs)" (L-11).

### 5.4 Behaviour (L-13)
Dirty-form guard exists only in the wizard; drawers close on Escape and lose edits. Enter-to-submit is wired in 5 places. Destructive confirmations use variant `destructive` in some drawers and `primary` in others. Required fields are marked by asterisk, "(required)" (×8) or not at all. Save/Save Changes/Save & Exit/Done and Cancel/Back/Close are used interchangeably; toast copy punctuation varies. Currency prints "QAR 1500" in checkout and "QAR 1,500" in Customer 360; dates use three locale conventions (C-14).

---

## 6. Orphaned or unused components (C-15, T-10)

| Item | Evidence | Action |
|---|---|---|
| `IncludedInOfferCard` (file) | imported nowhere | delete |
| `OfferArtwork`, `CARD_SELECTED_SURFACE` | `offerCardParts.tsx:75,17`; the latter already `@deprecated` | delete |
| `customerTypeLabel`, `getBusinessRule`, `resetMockData`, `listShared` `SELECT`/`FIELD_LABEL` | never referenced | delete |
| `RAIL_KEY`, `FIBRE_ACTIVATION_ROUTE`, `isCafValid`, `ageOn`, `approachFor`, … | exported, used only in their own file | un-export |
| `SectionHeader` props `icon/title/description` | ignored (`TelesalesKit.tsx:56`), ≈10 callers still pass them | remove props |
| `<select>` in `TelesalesConnectionsSection.tsx:64` | one option, no handler | wire or remove |
| 57 dead tokens, `design-tokens.json` | section 4.3 | delete or allow-list |
| Single-consumer layers: `Radio`, `SignaturePad`, `InstallationActivationWizard`, 5 capability pass-throughs | one importer each | keep deliberately or inline |

Side-effect `screens/index.tsx` files (12) look unreferenced but are imported for registration — not orphans.

---

## 7. Duplicated functionality and patterns (C-01 … C-14, C-16)

| Family | Implementations | Canonical | Deviating sites | Effort |
|---|---|---|---|---|
| Card / panel shell | ≈8 named constants/components, 278 class strings | new `Card` | ≈220 | L |
| Status → tone | 13 maps, 5 conflicting statuses | new `statusTone.ts` | 13 | M |
| Popover / menu / combobox | 7 hand-built, 11 click-outside listeners, `FilterSelect` (25 uses) | new `Popover` + `Combobox` | ≈25 | M |
| Buttons | 131 raw; kebab ×4, close-X ×8, link ×≈38 (9 red), mini pills ×4 | `Button` + new `IconButton` | ≈75 | M |
| Tables | `DataTable` 37, `GridTable` 21(+20), 8 raw, hand-rolled pager | `DataTable` | ≈50 | L |
| Key-value rows | 7 (`DetailRows`, `KV`, `Field` ×4, `Row`, `DetailRow`) | `DetailRows` | ≈10 | M |
| Stat tiles | 7 (`KpiTile`, `MetricCard`, `Stat` ×2, `StatStrip`, `StarStat`, `Tile`) | one | 7 | M |
| Pills / badges | `Badge` + 2 `Pill` kits + ≈17 spans | `Badge` | ≈19 | M |
| Banners | 22 inline boxes (two fills) + 5 local components | new `Banner` | 27 | M |
| Empty / loading | ≈72 text nodes; `Spinner` ×4; 0 skeletons | new `EmptyState`/`Skeleton` | ≈80 | M |
| Form-field shell | 4 primitives + 5 domain inputs + 8 label copies | new `FieldShell` | ≈17 | M |
| Selected-card state | 8 copies + 6 tick badges | `CARD_SELECTED/IDLE` | 14 | S |
| Clickable cards | 9–11 `role=button` divs with the same key handler | `ClickableCard` | 11 | S |
| Icons | 109 path constants, 12 maps, retail vs telesales art differ | one registry | ≈120 | M |
| Avatar | 5 | new `Avatar` | 5 | S |
| Formatters | 6 QAR, 11 date (+24 locale-less), 4 size | `lib/format.ts` | ≈60 | M |
| Logic helpers | closed-status ×6, sort ×25, filter ×8, ID snippet ×34, submit builders ×4 | `lib/*` | ≈80 | M |

---

## 8. Target-state expectations

### 8.1 Token taxonomy (exact names)
Tier 1 `--ref-{red,neutral,teal,green,amber,violet,blue,navy}-{50…900}`. Tier 2: `--color-{bg,surface,surface-subtle,surface-warm,fg,fg-muted,fg-subtle,border,border-soft,accent,accent-hover,accent-active,accent-fg-on,accent-text,link,focus,selected,highlight}`; `--tone-{info,success,warn,danger,neutral}-{bg,fg,border,solid}` and `--tone-{blue,green,teal,amber,pink,indigo}-{bg,fg}`; `--text-{2xs…3xl}` (one scale), `--font-weight-{normal,medium,semibold,bold}`, `--leading-*`, `--tracking-*`; `--radius-{sm,md,lg,pill,circle}`; `--spacing` (4px base), `--breakpoint-*`, `--container-{narrow,default,wide}`, `--layout-sidebar-w`, `--z-{sticky,dropdown,header,nav,overlay,popover,toast,tooltip}`, `--duration-{fast,base,slow,spin}`, `--ease-{standard,out}`, `--elev-{0,1,2,3}`, `--ring-{focus,field,selected}`, `--size-icon-{xs,sm,md,lg}`, `--control-h-{sm,md,lg}`, `--on-dark-{1,2,3}`, `--scrim-{1,2}`, `--opacity-disabled`. Tier 3: `--btn-*`, `--field-*` (≈14, down from 28), `--choice-{checkbox,radio,card}-selected`, `--nav-*`, `--badge-*`, `--tooltip-*`, `--table-*` — all `var()` aliases with light and dark defined together. Rules: every colour token has a dark value or is listed in `CONSTANT_ACROSS_THEMES`; no component token holds a raw hex; Tailwind defaults are disabled with `--color-*: initial` so off-system utilities fail to compile.

### 8.2 Type roles (matched to dominant current usage)

| Role | Element | Size token | Weight | Colour |
|---|---|---|---|---|
| Page title | h1 | `--fs-h4` (24px) | 700 | fg |
| Dialog / drawer / panel title | h2 | `--fs-h5` (20px) | 700 | fg |
| Section title | h2 | `--fs-body-lg` (18px) | 700 | fg |
| Card title | h3 | `--fs-body-lg` | 600 | fg |
| Sub-section | h4 | `--fs-body` | 600 | fg |
| Eyebrow | — | `--fs-caption` + uppercase + tracking-wide | 600 | muted |
| Field label | label | `--fs-label` | 400 | fg-2 |
| Read-only label / value | dt / dd | caption / body | 400 / 500 | muted / fg |
| Body / description | p | `--fs-body` | 400 | fg / fg-2 |
| Caption / meta | — | `--fs-caption` | 400 | muted |
| Button | — | `--fs-btn` | 700 | per variant |

### 8.3 Layout and behaviour standards
Page: one inset (`p-8`), `PageHeader` padded `px-8`. Card: `rounded-[--radius-card] border border-[--field-card-border] bg-bg`, `p-5` page cards / `p-6` wizard step panel / `p-4` inset tiles, `mb-6` between cards, `border-border-soft` for inner dividers. Forms: `grid gap-4`, `@container` on the step panel instead of viewport breakpoints. z-index and motion from the scales above, all transitions behind `motion-reduce`. Interaction standard (to be written): confirm destructive actions in a `ConfirmDrawer` with variant `destructive`; dirty-form guard on every edit drawer; required = asterisk + `aria-required`; sentence-case labels; verbs: **Save**, **Cancel** (drawers), **Back** (wizard), **Close** (dismiss only).

---

## 9. Accessibility and usability gaps

**P0 — blocks users**
- **A-01** Focus ring `rgba(230,0,0,.22)` ≈1.5:1 and a `box-shadow` that vanishes in forced-colours mode (`index.css:235-238`).
- **A-02** Company, address and saved-contact lookups cannot be used with a keyboard (`CompanySearchInput.tsx:127-160`, `LocationInput.tsx:90-122`, `ContactPhoneInput.tsx:~139`).
- **A-03** No skip link, no per-route `document.title`, no focus move on navigation (`App.tsx:84`).
- **A-04** Summary panel and Edit actions disappear below 1024px (`StepSummaryPanel.tsx:141`; accordion variant never rendered).

**P1 — serious** (13): control borders ≈1.3:1 (A-05); incomplete combobox/menu ARIA (A-06); label-derived ids and six unnamed selects (A-07); partial required/invalid/error announcements and only 5 `autoComplete` attributes (A-08); login is not a form (A-09); carousel without pause (A-10); Qnomy Abandon without confirmation and a faked disabled primary (A-11); disabled Continue without a reason (A-12); tooltips not hoverable and holding essential text (A-13); toast live region and Escape behaviour (A-14); dialogs without inert background/scroll lock (A-15); top-bar overlap at 1024px (L-10); cramped wizard at 1024px (L-09).

**P2/P3** (A-16 … A-24): landmarks and breadcrumb semantics, tab/table/pager semantics, selectable-card roles, signature pad alternative, global reduced motion, contrast in usage, small targets, 31 untyped buttons, read-only values that cannot be copied.

**One-change fixes** (highest leverage): global `:focus-visible` outline (A-01, 73+ sites) · `FieldShell` with `useId` (A-07, A-08) · one `Combobox/Menu` primitive on `useSearchListNav` (A-02, A-06) · `Shell` skip link + route announcer (A-03, A-16) · `Button` default `type="button"` and `aria-disabled` (A-23, A-11, A-12) · `useDialogBehaviour` inert/scroll-lock (A-15) · one global reduced-motion rule (A-20) · `StepSummaryPanel` accordion below `lg` (A-04, L-09).

---

## 10. Refactoring and standardisation recommendations

1. **Enforce before you refactor** (Phase 0): a token test (defined / dead / dark-parity / duplicate), a literal-ban test over `.ts` and `.tsx` with an allow-list for the four artwork files, a JSX-aware `button` type check, unused-export detection, and CI. Without this every later fix regresses.
2. **Add the missing primitives in this order:** `FieldShell` → `Popover`/`Combobox`/`Menu` → `Card` → `Banner` → `EmptyState`/`Skeleton` → `IconButton` → `Avatar` → `lib/format.ts` → `statusTone.ts`. Each is migrated with a codemod and removes a measured duplicate (section 7).
3. **Tier the tokens:** add `--ref-*`, convert component tokens to aliases, define dark values with light, delete dead tokens, adopt the Tailwind-native names (`--spacing`, `--font-weight-*`, `--z-*`, `--duration-*`) so the utilities already in use become token-driven without touching call sites.
4. **Consolidate Customer 360** one family at a time (tables → pills → key-value rows → stat tiles → icons), then retire the legacy tab tree if personas allow.
5. **Write the interaction and content standard** (case, verbs, required marking, confirm/dirty-guard, toast copy) and encode it in `ConfirmDrawer`/`FormDrawer` presets.
6. **Operational:** self-host Figtree; generate or delete `design-tokens.json`; move token history out of `tokens.css` comments into a changelog; regenerate the Design Principles numbers from the token test.

---

## 11. Risk and impact assessment

Effort model: **S** ≈ 1 day, **M** ≈ 4 days, **L** ≈ 12 days (one developer, including tests).

| Initiative | User impact | Regression risk | Blast radius | Mitigation / rollback |
|---|---|---|---|---|
| Global focus outline, skip link, route announcer, reduced-motion rule | High (keyboard, AT users) | Low | Whole app, CSS + Shell | Visual diff of 12 routes; one-line revert |
| Control border contrast (A-05) | High | **Medium** (changes look of every field) | All forms | Design sign-off; ship behind a token so it reverts by one value |
| `Button` default `type="button"` | Low | Low–Medium (forms relying on implicit submit: only 1 `<form>` exists) | 31 sites | Grep for `<form>`; test login/customer search |
| `FieldShell` / `Combobox` / `Popover` | High | **Medium–High** (touches every input and 11 popovers) | ≈40 components | Migrate one family per PR; keep old API shims; journey tests (27 tests) + manual keyboard pass |
| Card primitive + codemod | Medium (consistency) | **Medium** (~220 sites; padding/border differences become visible) | Whole app | Codemod only exact-match strings first; screenshot diff per module |
| Token tiering / dark parity | Medium (dark mode) | Medium | `tokens.css`, `index.css` | Token test gates every change; ship light first, dark second |
| Spacing/weight/z-index re-expression | Low | Low (values unchanged) | 224 files | Declare scale in `@theme` — no call-site edits needed |
| Customer 360 consolidation | Medium | **High** (3 trees, 20+ sections) | `workspace/customer360` | Per-family PRs behind the existing personas; keep legacy tree until parity is verified |
| Formatter unification | Medium (visible text changes) | Medium (tests assert strings) | ≈60 sites | Update tests in the same PR; agree the display format first |
| Case convention pass | Low | Low–Medium (tests/screenshots reference labels) | ≈100 labels | Single mechanical PR after the decision |
| Doing nothing | — | Drift continues; 4 P0 a11y gaps persist; the broken guard keeps passing | — | — |

Main project risks: (a) the three Tier-C design decisions are unmade; (b) test coverage is node-level only (no browser E2E), so visual regressions need manual or screenshot review; (c) the working tree holds ≈310 uncommitted changes, so audit fixes should land on a clean branch to stay reviewable.

---

## 12. Prioritised remediation plan

{{PLAN}}

### Decisions required from a human (Tier C)
1. Label case convention — Title Case vs sentence case (L-06).
2. Link colour — teal `--link` (as `tokens.css:179` states) vs the 9 red text links (C-05).
3. Control and card border contrast — new value for `--field-border` / `--field-card-border` (A-05).
4. Whether focus teal (`#007e91`) and link teal (`#007c92`) merge, and the primitive palette (T-14).
5. Approved status → tone mapping (C-03).
6. Accent text on the tinted page background (A-21; prior residual 1).
7. Radius scale values (8/12/16/20/24 today) (T-15).
8. Signature alternative and CAF legal copy (A-19).

### Acceptance criteria for "design-system compliant"
- Token test green in CI: 0 undefined, 0 dead (or allow-listed), every colour token has dark parity or an explicit constant entry, JSON generated.
- Literal-ban test green: 0 hex/rgba/`text-white`/`z-N`/`duration-N`/raw palette outside the allow-list.
- ≥ 95% primitive adoption for Button, Input, Select, DataTable; 0 duplicate kits in Customer 360.
- 0 P0 and 0 P1 accessibility findings; axe-style check on the 12 audited routes at 1024px and 400% zoom.
- Rendered-DOM audit (the script used here) reports 0 off-token computed values.

---

## 13. Finding register

{{REGISTER}}

---

## Appendix A — How the numbers were produced
Scripts (read-only, in `reference/scripts/ui_audit/`, see its README): `audit.py` (hard-coding, token usage, raw elements, repeated class strings), `a11y2.py` (brace/string-aware JSX scan), `inventory.py` (308-row component inventory), and `dom_style_audit.js`, the in-page computed-style audit run on 12 routes. Four deep-dive passes read the code and cited `path:line`.

## Appendix B — Corrections to earlier interim statements and measurements
- Button adoption was **64%** at audit time (236 vs 131), not the ≈84% implied by an identifier-count in an interim note. After the 2026-10-10 remediation it is **71%** (258 vs 103 raw `<button>`).
- Dead tokens were **57**, not 62, at audit time: the tooltip timing tokens are read in JS. After remediation there are **0** (`node tests/tokenModel.mjs`). The six "undefined" tokens flagged by the first scan were defined (`tokens.css:443-463`); the defect was that they lacked dark values.
- The original regex-based a11y counts over-reported clickable `div`s (9 → 7 real) and under-reported nothing material; the JSX-aware scan is used throughout.
- `C360Kit.UnderlineTabs`/`SearchBox` and the Telesales pager are now thin wrappers over `SegmentedTabs`/`SearchField`/`Pager`; the remaining duplication is in tables, pills, key-value rows, stat tiles and icons.

## Appendix C — Prior audit (2026-10-07) residuals, current status
1 Accent text on tinted page — **open** (A-21) · 2 CAF terms placeholder — **open** (Tier C) · 3 Status colour maps — **open, now 13 maps** (C-03) · 4 Duplicate chrome — **partly fixed** (tabs/search/pager wrapped; pills, tables, KV rows remain: C-02) · 5 Seven QAR formatters — **open** (C-14) · 6 Mixed label case — **open** (L-06) · 7 Viewport breakpoints → container queries — **open** (L-09) · 8 Self-host font — **open** (L-12) · 9 Demo scanners on by default — **open, config** · 10 `/:moduleSlug` catalogue reachable by all — **open, not UI** · 11 oxlint warnings — **open**: 71 (41 only-export-components, 21 set-state-in-effect, 4 refs, 2 purity, …) · 12 `src/capabilities/` untracked — **open** (`git status` still shows it untracked).

---

## 14. Remediation applied after the audit (2026-10-10)

The register above carries a Status for every finding. Summary of what changed in the code the same day (no commit was made; the changes are in the working tree):

**Resolved ({{RESOLVED_N}}), partial ({{PARTIAL_N}}), open ({{OPEN_N}}).**

### Tokens and governance
- **Colours are fully on-token (T-05, T-06, T-07, T-11).** 34 derived-colour tokens (`--on-dark-*`, `--scrim`, `--paper`, `--tone-*-bg`/`-soft`, `--toast-*`, …); 52 files migrated off `white/NN`, `black/NN`, raw `text-white`/`bg-white` and ~60 inline `color-mix()`. The dark theme and the stray `:root` blocks moved from `index.css` into `tokens.css`; the select chevron became a per-theme token; specimen ID artwork colours moved to `src/data/synthetic/idSpecimenPalette.ts`; brand marks use `--brand-vodafone` / `--brand-qatar`. Dark values were added for the tokens that were stuck on light values.
- **Spacing, weight, stacking and motion are tokens (T-01–T-04).** `--space-unit` drives Tailwind's `--spacing`; `--fw-*` (medium corrected to 500) drive `--font-weight-*`; `--z-*` replaced all 25 z-index literals; `--motion-*` replaced all `duration-*` literals; one global `prefers-reduced-motion` rule.
- **Token hygiene (T-10, T-12, T-13, T-16).** 41 dead tokens deleted (0 remain); `color-scheme` declared per theme; `design-tokens.json` and its boot fetch removed; `SignaturePad` reads `--fg` instead of passing `var()` to canvas.
- **Enforcement (T-17).** New `tests/tokens.test.mjs` (undefined / dead / dark-parity / scale tokens), a widened literal guard in `tests/ui.test.mjs` (hex, rgba, white/NN, color-mix, z-N, duration-N in `.ts` and `.tsx`), a brace-aware button-`type` guard, and `.github/workflows/ci.yml`. **The workflow sits in `vfq-dxp-app/.github/` and must be moved to the repository root to run.** Suite: 32 of 32 pass; build, `tsc` and lint (0 errors) unchanged.

### Components and content
- **Dead code (C-15):** `IncludedInOfferCard`, `OfferArtwork`, `CARD_SELECTED_SURFACE`, `customerTypeLabel`, `getBusinessRule`, `resetMockData`, two `listShared` constants deleted; two file-local exports un-exported; `SectionHeader` dead props and a no-op `<select>` removed.
- **One status map (C-03):** `src/lib/statusTone.ts` replaces 13 local maps (12 call sites). Where maps disagreed the Customer 360 mapping won: Open and Assigned = blue, In Progress / Pending / Escalate / Not Solved / Abandoned = amber, Closed / Completed / Accepted = green, Rejected / Cancelled / Error = red.
- **One formatter library (C-14):** `src/lib/format.ts` (`QAR 1,500`, `12 Mar 2025`, `14:32`, `1.2 MB`). Checkout now reads `QAR 17,125` like Customer 360; times are 24-hour everywhere.
- **Card shell (C-01, partial):** `.card` / `.card-surface` defined once in `index.css`; 141 class strings in 86 files migrated.
- **Buttons (C-05, partial):** new `IconButton`; kebab, invoice actions and remove buttons migrated; 22 link-style and mini buttons now use `Button` (red text links became the teal tertiary style). Button adoption 64% → 71% (raw `<button>` 131 → 103); the rest are mostly list rows, cards and navigation items.
- **Typed buttons (A-23):** `Button` defaults to `type="button"`; 34 raw buttons typed.

### Accessibility (all four P0s)
- **A-01** global focus outline 2px at 4.8:1 (teal; `--fg` in dark), two-ring `--focus-ring` token, forced-colours rule.
- **A-02** company, address and saved-contact lookups use `useSearchListNav` (verified in the browser: ArrowDown/Up move, Enter selects, Escape closes).
- **A-03** skip link, `<main id tabIndex=-1>`, per-route `document.title`, focus move and polite announcement (verified: "Customer Search - Vodafone Qatar DXP").
- **A-04** the summary is offered as an accordion below `lg` (verified at 900px).

### Verification
`dom_style_audit.js` on 14 routes (4,788 elements): 0 off-token colour, background, border, shadow or font-size values; one apparent radius exception was an audit artefact (a `rounded-full` on a 22px element computes to 11px) and the script now treats half-size radii as pills. Dark theme spot-checked on 4 routes. Not verified in a browser here: login page, dashboard hero and toasts by eye, and the `ContactPhoneInput` / `LocationInput` keyboard behaviour (type-checked and built, not exercised); the browser pane stopped rendering before final screenshots.

### Behaviour and visual changes to review
Tone tints are standardised to two strengths; `white/50`/`/65` text is now 60% and `/35` is 40%; `ease` curve on the login carousel changed to `--ease-standard`; `font-medium` now resolves to weight 500 consistently; focus indicators are now visible rings/outlines rather than a faint red glow; currency in checkout gains thousands separators; Customer 360 times switch from 12-hour to 24-hour.

### Still open (grouped)
- **Needs a decision first (Tier C):** label case (L-06), border contrast (A-05), primitive palette and token naming (T-14, T-15), text-colour roles (L-05), signature alternative (A-19).
- **Needs new primitives:** `Card` component (rest of C-01), `Popover`/`Combobox`/`Menu` (C-04, A-06), `FieldShell` (C-11, rest of A-07/A-08), `Banner` (C-09), `EmptyState`/`Skeleton` (C-10), `Avatar` (C-13).
- **Large consolidations:** Customer 360's three kits, `GridTable` → `DataTable`, icon registry (C-02, C-08, C-12).
- **Smaller accessibility and layout items:** login form and carousel (A-09, A-10), Qnomy confirm (A-11), tooltips/toasts/dialogs (A-13–A-15), top-bar overlap and container-query layouts (L-09 rest, L-10), font self-hosting (L-12), `rounded-full` / arbitrary-length cleanup (T-08, T-09).

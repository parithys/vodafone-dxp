# VFQ DXP — Design Principles Reference

**Scope:** `vfq-dxp-app/src` — 141 `.tsx` + 32 `.ts` files, ~18,300 LOC.
**Date:** 2026-09-16
**Method:** Full static read of the source, token, and config layers across six
parallel audit passes, plus live runtime verification of the running dev server
(login → persona resolution → dashboard, 11 config + 83 mock-data fetches).
Every claim below is anchored to `file:line`. Quantitative figures were
re-verified independently of the audit passes; the verification commands are
listed in [Appendix A](#appendix-a--verification-commands).

**What this document is:** a catalogue of the design principles actually
expressed in the code, with the evidence for each — and, where a principle is
stated but not fully delivered, an honest note of the gap. It is an assessment
of the implementation, not a restatement of design intent.

---

## Contents

1. [Executive summary](#executive-summary)
2. [Visual design](#1-visual-design)
3. [Consistency](#2-consistency)
4. [Information hierarchy](#3-information-hierarchy)
5. [Progressive disclosure](#4-progressive-disclosure)
6. [Interaction design](#5-interaction-design)
7. [Feedback mechanisms](#6-feedback-mechanisms)
8. [Error prevention](#7-error-prevention)
9. [Usability](#8-usability)
10. [Customer-centric design patterns](#9-customer-centric-design-patterns)
11. [Accessibility](#10-accessibility)
12. [Responsiveness](#11-responsiveness)
13. [Evidence traceability & conflict surfacing](#12-evidence-traceability--conflict-surfacing-the-distinctive-principle)
14. [Maturity scorecard](#maturity-scorecard)
15. [Appendix A — verification commands](#appendix-a--verification-commands)

---

## Executive summary

The application is a **desktop-first, expert-user agent CRM** whose design
principles cluster into three tiers of maturity.

**Genuinely strong — systemic and enforced.** Token discipline is near-absolute
(893 `var(--token)` references against **2** hardcoded hex values in the entire
component/module/workspace tree, both of which are justified token definitions).
Structural primitives hold the line completely: **zero** raw `<select>` or
`<table>` elements exist outside `primitives/`. Progressive disclosure is the
app's best-developed principle, with seven distinct mechanisms in real use.
Error *messaging* quality is high and frequently names the next action.

**Strong in intent, partial in delivery.** Consistency is enforced for colour
and structure but not for composition — field chrome logic is copy-pasted across
7 files, and there is no `Heading`/`Field` primitive, so page-title and
form-field conventions are re-typed at every call site. Progressive disclosure
has no "show more" escape hatch anywhere in the app.

**Stated but not delivered.** Three declarative layers are loaded at boot and
never read: `design-tokens.json` (which has silently diverged from the real
tokens on 10 values, including the typeface), `validation-rules.json`'s 281
field-level rules, and `rbac.json`'s route authorisation. Route-level RBAC
functions (`canAccessScreen`, `canPerformAction`, `visibleRoutesFor`) have
**zero call sites**. Accessibility has a solid foundation with several
first-rate components, undermined by a small number of high-impact structural
gaps (no focus trap, no field error association, no skip link).

**The most distinctive principle in the codebase is not on the standard list:**
the app treats *unresolved contradictions in its own source requirements* as a
first-class runtime output rather than a build-time guess. See
[§12](#12-evidence-traceability--conflict-surfacing-the-distinctive-principle).

---

## 1. Visual design

**Principle — a single semantic token layer, brand applied with restraint.**

### Token architecture

150 custom properties in one flat `:root` block (`src/tokens.css`), with a
genuine semantic vocabulary (`--fg`, `--bg`, `--surface`, `--border`, `--accent`,
`--danger`/`--success`/`--warn`) rather than raw palette names at call sites.

```css
/* src/tokens.css */
--accent: #e60000;
--accent-hover: color-mix(in oklab, var(--accent), black 8%);
--accent-active: color-mix(in oklab, var(--accent), black 14%);
```

36 of those tokens are bridged into Tailwind's utility namespace via
`@theme inline` (`src/index.css:6-46`), which is what makes `bg-accent`,
`text-fg`, `border-border-soft` resolve. The remaining tokens are consumed as
arbitrary values (`text-[length:var(--fs-body)]`).

**Dark mode** overrides 51 tokens under `:root.dark` (`src/index.css:51-139`),
toggled by a class on `<html>`. The policy is structural-only, and the code
documents its own exceptions — status colours are deliberately brightened for
legibility on dark surfaces, elevation shadows reduced in opacity, and field
tokens re-aliased to structural ones.

**The token layer is what made the 2026-09-24 re-skin possible at all.** That
change repointed the entire light palette at a new visual standard (below) and
reached all 149 components without a single layout, logic or content edit,
because the app holds **zero raw Tailwind palette colours** — every colour is a
token or a semantic utility. This is the clearest payoff the token discipline
has produced, and the strongest argument for keeping it.

**Elevation is a named 3-step scale**, not a shadow ramp: `--elev-flat`,
`--elev-ring`, `--elev-raised` (`tokens.css`). Applied with discipline — and as
of 2026-09-24, more strictly. The reference asset contains **zero
`<filter>`/`feDropShadow` elements**: every surface in it is separated by a 1px
border. Elevation is now reserved for genuinely floating surfaces — the 12
overlays (`Modal`, `Drawer`, `Toast`, `NavFlyout`, and the dropdown panels in
`Select`/`MultiSelect`/`GlobalSearch`/`LocationInput`/`DateRangeSelect`/
`ContactPhoneInput`/`PersonaSwitcher`) — plus hover lift on cards. Primary
buttons lost their `--shadow-brand` glow and in-flow panels their static
shadows. Hover lift was deliberately kept: the reference shows no hover state,
so flattening it would have been invention rather than application.

### The 2026-09-24 visual standard

The light palette is no longer this app's own invention — it is read from a
supplied reference (three SVG states of *New Postpaid Activation / Step 1
Contact Verification*). Values were extracted from the asset rather than
eyeballed: surface fills by area histogram, text greys and status colours from
the export's declared fills, corner radii from rect geometry.

| Role | Token | Value |
| --- | --- | --- |
| Page background | `--page-bg`, `--surface` | `#f5f7f9` |
| Card / rail / topbar | `--bg` | `#ffffff` |
| Inset panel | `--surface-subtle` | `#fafafa` |
| Container border | `--border` | `#e0e0e0` |
| Soft divider | `--border-soft` | `#eeeeee` |
| Text ramp | `--fg` / `--fg-2` / `--muted` / `--muted-2` | `#313131` / `#5d5d5d` / `#757575` / `#9e9e9e` |
| Brand | `--accent` | `#e60000` (unchanged) |
| Disabled CTA | `--accent-disabled` | `#ffb3b3` |
| Selected choice card | `--field-card-selected-bg` | `#fef9f9` |
| Active step / nav tint | `--surface-warm` | `#fff0f0` |
| Status | `--success` / `--info` / `--warn-text` | `#388e3c` / `#6926dc` / `#9a5b00` |
| Advisory banner | `--warn-bg` | `#fff8e1` |
| Search well | `--search-bg` | `#eeeeee` |

Two deliberate non-adoptions, both recorded in `tokens.css`:

- **The type scale was not changed.** The reference runs about one step denser
  (body 14 vs 16, section heading 20 vs 24, page title 28 vs 32). Adopting it
  was considered and declined on 2026-09-24 to keep every screen's density and
  wrapping unchanged, so the `--fs-*` ramp remains the app's own.
- **Radii mostly needed no change.** The reference's recurring `rx="7.5"` is an
  8px corner once Figma's 0.5px stroke inset is accounted for — already what
  `--radius-card`/`--radius-button` hold, and it covers cards, buttons and
  choice cards alike. Two exceptions the asset is deliberate about, and which
  a "tidy everything to 8" instinct would have destroyed:

  | Element | Asset rect | Radius | Token |
  | --- | --- | --- | --- |
  | Card / button / choice card | `rx="7.5"` stroked | 8px | `--radius-card`, `--radius-button` |
  | Text input | `219x51`, `rx="11.5"` stroked | **12px** | `--field-radius` (was 16px) |
  | Status pill | `157x17`, `rx="3.5"` stroked | **4px** | `--radius-tag` (new) |

  Fields are the one element that does *not* share the 8px corner, and pills
  are explicitly **not** fully rounded — they were on `--radius-badge-pill`
  (32px), which rounded their ends off completely.

**Corroboration worth noting:** the flat, border-separated, near-shadowless
model this asset implies is the same one `design-system.md` §1 derived
independently from the upstream brand analysis — *"near-zero shadow… there is
no drop-shadow-based elevation."* Two unrelated sources agreeing raises
confidence that flatness is a real brand property, not an artifact of one
export.

**A theme-blindness bug the re-skin surfaced.** 17 tinted status panels across
9 files mixed toward the literal keyword `white`
(`color-mix(in oklab, var(--success), white 92%)`), which ignores the theme. In
dark mode they rendered as near-white panels carrying near-white `--fg` text —
the MOI-validated customer details were effectively invisible. All 17 now mix
toward `var(--bg)`, which leaves light mode byte-identical and fixes dark mode.
Worth recording as a failure mode: a hardcoded colour *keyword* inside an
otherwise tokenised expression type-checks, lints clean, and breaks only in the
theme nobody screenshots.

### Brand expression

`#e60000` — correct Vodafone primary — single-sourced at `tokens.css:2`. The
speechmark logo is a shared primitive (`VodafoneMark.tsx:3-16`) with the outer
path filled `var(--accent)` so it themes with the token. Typography is Figtree,
loaded via Google Fonts, with a candid comment distinguishing it from prior
aspirational choices:

> *"Figtree is loaded via Google Fonts (index.html) — unlike the previous Space
> Grotesk/DM Sans targets, this one is real, not aspirational."*
> — `src/tokens.css:72-75`

**Restraint is real and deliberate, but the line moved on 2026-09-24.** Brand
red covers primary CTAs (`Button.tsx`), active tab indicators (`Tabs.tsx`),
table links (`DataTable.tsx`), outlined badges (`Badge.tsx`) — and now two
surfaces it previously did not: **selected choice cards** and the **active
navigation row**. The chrome is otherwise still neutral.

This area has been governed by two directives that partly contradict each
other, and the order matters:

1. **2026-09-15** — focused/selected form controls must never read as the brand
   red; use the warm pink-brown `#c09696` instead. Scoped to light mode, and
   covering both the focus outline on text/search/dropdown/date fields *and*
   the checked/selected state on checkboxes and choice-card selectors.
2. **2026-09-24** — choice *cards* return to brand red (`#e60000` border, check
   badge and label on a `#fef9f9` fill), and the supplied reference borders
   every neutral field in `#e0e0e0`, a colour the pink-brown ramp does not
   contain.

What each still governs today:

| Surface | Token | Value | Directive |
| --- | --- | --- | --- |
| Choice-card selected | `--field-card-selected` | `#e60000` | 2026-09-24 |
| Field focus outline | `--field-focus-border` | `#c09696` | 2026-09-15, still standing |
| Checkbox / radio checked | `--field-selected` | `#c09696` | 2026-09-15, still standing |
| Neutral field border | `--field-border` | `#e0e0e0` | 2026-09-24 (was `#cdbebe`) |
| Field "filled" border | `--field-border-filled` | `#e0e0e0` | 2026-09-24 (was `#c09696`) |

Two consequences worth knowing before touching this again:

- **The "filled field" state is effectively retired in light mode.**
  `--field-border-filled` now equals `--field-border`, so a field holding a
  value looks identical to an empty one. The token and its call-site branches
  are kept because dark mode still distinguishes the state (it maps filled to
  `--accent`), which also means **the two themes now disagree**: a filled input
  is neutral-bordered in light and red-bordered in dark. Open item, not a
  settled decision.
- **`#c09696` now survives in exactly two places** and appears nowhere in the
  2026-09-24 palette. It was kept rather than reversed because the 2026-09-15
  directive was explicit and was re-affirmed on 2026-09-24 when the red change
  was deliberately scoped to cards only. It is the one colour in the app with
  no backing in the current reference — flag it, don't quietly extend it.

### Gaps

- **`public/config/design-tokens.json` is fetched at boot
  (`configEngine.ts:67`), exposed via `getDesignToken()` — and has zero call
  sites (verified).** It has also drifted from the real tokens on **10 values**,
  including advertising `"DM Sans"`/`"Space Grotesk"` as the fonts and `12px`
  for three sizes that are really `14px`. Anyone treating it as the token
  contract would be misled on the typeface and four greys.
- **42% of tokens are dead** — 54 of 128 are referenced nowhere, after
  correctly excluding the 27 consumed through the Tailwind bridge. Whole
  subsystems: 8 of 9 `--space-*`, all 8 `--text-*` (a redundant parallel type
  scale with *different* values), all 5 `--fw-*` weights, all 4 `--leading-*`,
  all 8 layout tokens, and the entire marketing tier (`--fs-hero-*`,
  `--fs-impact`, `--signal-blue`, `--deep-red`). This is a marketing design
  system imported wholesale into an enterprise CRM; the unused ~40% is the part
  that never applied. Inert at runtime, but it makes the token file an
  unreliable guide to what the app uses.
- **One genuine correctness defect.** `SignaturePad.tsx:33` sets
  `ctx.strokeStyle = 'var(--fg)'` — Canvas2D does not resolve CSS custom
  properties, so the assignment is silently ignored and the stroke stays
  `#000000`. In light mode this is coincidentally near-correct; **in dark mode
  it draws a black signature on a `#16171c` surface**, and that black stroke is
  what `toDataURL()` persists (`:50`). Needs
  `getComputedStyle(el).getPropertyValue('--fg')`.

---

## 2. Consistency

**Principle — enforce through shared primitives and token-only values.**

This is the system's strongest measurable dimension.

| Metric | Result |
|---|---|
| `var(--token)` references in `.tsx` | **893** |
| Hardcoded hex in `components`/`modules`/`workspace` | **2** (both justified token definitions in `tooltip-tokens.css:10-11`) |
| Tailwind named-palette utilities (`bg-red-500` etc.) | **0** across all 22 colour families |
| Raw `<select>` outside `primitives/` | **0** |
| Raw `<table>` outside `primitives/` | **0** |
| Files importing from `primitives/` | **85** of 141 `.tsx` |

Adoption breadth per primitive: Badge 49 files, Button 43, Input 27, Select 26,
Icon 22, Drawer 16, DataTable 14, Tooltip 10.

**Variant systems follow one consistent shape** — exported union type →
`Record<Variant, string>` class map → defaulted prop. Applied identically in
`Button.tsx:7-26` (5 variants), `Badge.tsx:4-18` (6 variants), and `Toast.tsx:4-9`.

**Two notable enforcement mechanisms with documented reasoning.** A global
cursor-affordance baseline restores `cursor: pointer` for every actionable
element in one place, recovering a Tailwind v4 preflight regression
(`index.css:106-129`). And the `:focus-visible` default is placed *inside*
`@layer base` specifically so component-level utilities can override it:

> *"Left unlayered, this default previously beat those utilities outright
> regardless of specificity, which happened to go unnoticed only because every
> override used to resolve to the same red."*
> — `src/index.css:148-154`

Typography is near-fully tokenised: only **3** raw Tailwind text-size utilities
exist app-wide, against 551 `--fs-*` references.

### Gaps

- **Field chrome is copy-pasted 7 times.** The identical border-state ternary
  appears verbatim in `Input.tsx:21-25`, `Textarea.tsx:14-18`,
  `Select.tsx:108-115`, `MultiSelect.tsx:93-97`, `DateRangeSelect.tsx:100-104`,
  `LocationInput.tsx:73-77`, and `ContactPhoneInput.tsx`. The label/helper/error
  wrapper markup is likewise duplicated. There is no `<Field>` wrapper or
  `useFieldChrome()` hook, so any change to field state styling is a 7-file edit.
- **No `Heading`/`PageTitle` primitive.** The page-title convention
  (`<h1>` + `--fs-h3` + `font-medium`) is genuinely consistent across 8+ screens
  — but re-typed by hand at every call site (`CustomerSearchPage.tsx:62`,
  `OrdersWorkspace.tsx:17`, …).
- **Two domain components bypass the field primitive.** `QidInput.tsx:74-82` and
  `ContactPhoneInput.tsx:105` hand-roll a raw `<input>` reproducing `Input.tsx`'s
  token classes, dropping its `enabled:hover:` and disabled handling.
- **Mixed naming taxonomy in `Badge`** (`Badge.tsx:4`): `'outlined-red'` and
  `'filled-neutral'` are named by appearance; `success | warning | danger |
  accent` by semantics. Two conventions in one union.
- **Inconsistent disabled strategy** — `Button` uses opacity
  (`Button.tsx:15`), fields use explicit tokens (`Input.tsx:40`).
- **Three primitives are dead** (477 lines): `MultiSelect.tsx`,
  `DateRangeSelect.tsx`, `DateRangeCalendar.tsx` have zero consumers, and carry
  the only uses of `--field-calendar-*`.

---

## 3. Information hierarchy

**Principle — summary before detail; chromatic separation of chrome from work.**

### Shell

Three-region shell (`App.tsx:57-73`): sidebar, header, scrolling content.
Spatial hierarchy is established by three devices, strongest first:

1. **Value contrast — retired in light mode on 2026-09-24.** The sidebar used
   to be the only dark surface in the light theme (`bg-[var(--charcoal-panel)]`),
   separating navigation from work *chromatically* rather than merely
   spatially. The supplied reference puts the rail on **white** with dark
   labels and a solid-red active row, so light mode now separates the rail with
   a `--nav-border` hairline and the red active row alone. Dark mode keeps the
   charcoal rail and therefore keeps the original device — the reference is a
   light-mode asset, and inverting it would have meant inventing a dark design
   rather than applying a supplied one. The rail's colours are now routed
   through `--nav-*` tokens (`tokens.css`, dark values in `index.css`) instead
   of the `white/NN` literals it used to carry, which is what let the two
   themes diverge deliberately rather than by accident.

   Retiring it also removed a real constraint: the rail previously *could not*
   use `--accent` for its active row, because red on charcoal was too
   low-contrast to read, which is why it marked the active child with a left
   border. On white, the solid red row is the reference's own treatment.
2. **A single scroll container** — `h-screen` + `overflow-hidden` +
   `overflow-y-auto` on `<main>` (`App.tsx:59-64`) pins sidebar, header and
   breadcrumbs permanently; only content scrolls.
3. **Uniform `p-8` page gutter** on 22 route-level components.

The header is a **4-track named CSS grid** rather than a flex row
(`PersonaSwitcher.tsx:76`), so the search field does not shift position as the
session-ticket chip appears and disappears — a real hierarchy win.

**The single biggest IA decision: 6 sidebar items fronting 213 screens.**
`PRIMARY_NAV` (`Sidebar.tsx:19-46`) is capped at Dashboard, Customer Search,
Sales, Support, Orders, Administration. The comment at `:12-18` is explicit that
the 16 legacy module routes still resolve but are deliberately unlinked.

### Dashboard — summary-first and drillable

`Dashboard.tsx` orders the page search → tasks → KPIs → actions, and says why at
`:29-36`. Every number is a link, not a dead stat: each task tile routes to a
pre-filtered list (`to={`/tasks?filter=${tile.key}`}`, `:182`). Per-tile loading
and error states mean partial failure degrades one card rather than the page
(`:186-194`).

### Customer 360 — a four-tier funnel

`Customer360Layout.tsx` organises a large record as: identity line with inline
risk badges (`:156-159`) → sub-identity line (`:183-185`) → 4 computed
`MetricCard` rollups (`:187-204`) → 18 vertical tabs (`:207`). The
`orientation="vertical"` choice is deliberate and correct — `Tabs.tsx:10-15`
documents it as being for "consumers with many tabs where a side list reads
better than a wide underline bar." 18 tabs in a horizontal bar would wrap.

### Gaps

- **Six `--fs-*` tokens all resolve to 14px** (`caption`, `caption-upper`,
  `micro`, `tag`, `btn-compact`, `eyebrow`). So adjacent uses like
  `PersonaSwitcher.tsx:164-165` (`--fs-caption` over `--fs-micro`) render at
  *identical* size — the intended two-level subordination is delivered by colour
  alone. The effective scale is 6 steps (14/16/18/20/24/32), and there is no
  tier below 14px for genuinely tertiary metadata, which is the root cause.
- `--fs-h2` and the entire 40–144px display tier are unused (0 references).
- `Dashboard.tsx:185` applies `--fs-h3` — the same size as the page `<h1>` — to
  a KPI value, flattening that screen's hierarchy.
- Dark theme has acknowledged holes: `--page-bg`, `--table-header-bg` and
  `--table-border` have no dark design of their own and fall back to
  `--surface`/`--border`, collapsing the table-header-vs-body distinction
  (`index.css:46-48,58-60`).

---

## 4. Progressive disclosure

**Principle — reveal on demand; never show a step the agent can't yet act on.**
This is the app's best-developed principle: **seven distinct mechanisms**, all in
genuine use.

### 4a. Multi-step wizards — the dominant shape

`GuidedActivationWizard.tsx` backs **9 wizard screens**. Its comment at `:33-37`
calls this pattern *"the single most-repeated shape in the entire corpus."*

**Forward gating** — `:63` → `:201`:
```ts
const canProceed = currentStep?.isValid ? currentStep.isValid(draft.values) : true;
// ...
disabled={!canProceed || submitting}
```
`isValid` is supplied 40+ times across 7 wizards, e.g.
`NewFwaWizard.tsx:58` (`Boolean(values.addressId)`), and
`NewPostpaidWizard.tsx:216-221` requiring a device declaration be both *read*
and *accepted* (`Boolean(doi.doiRead) && Boolean(doi.doiAccepted)`).

**Backward freedom with a ceiling** — the `maxStepReached` high-water mark
(`workflowStore.ts:37`) never decreases, so any visited step stays clickable
while unvisited steps remain locked:
```ts
const goToStep = (index: number) => {
  if (index !== currentIndex && index <= maxReached) setStep(wizardId, index);
};
// GuidedActivationWizard.tsx:106-108
```
Unreachable steps aren't even focusable (`tabIndex={isReachable ? 0 : undefined}`,
`:137`). The rationale is recorded at `:100-105` — *"jumping back to edit an
earlier step must not strand the user."*

### 4b–4e. Tabs, drawers, modals, accordions

- **Tabs** mount only the active panel (`Tabs.tsx:35,52`) — all 18 Customer 360
  sections stay out of the tree until selected. 5 consumers.
- **Drawers** (16 consumers) are explicitly the default for anything
  substantial, with `Modal` reserved for confirmations (`Drawer.tsx:13-19`).
  Backdrop click **deliberately does not dismiss** (`:55-58`) to protect
  in-progress form input — Escape and the close button only.
- **Modal** has exactly **1** consumer: the wizard's abandon confirmation. The
  comment at `:13-18` records the deliberate migration of 32 former Modal
  screens to Drawer.
- **Two accordion semantics, matched to purpose.** `ProductActionGroups.tsx:43`
  is multi-open and **default-open** (reasoning at `:32-39`: an agent should see
  every action group at once). `AccountHierarchySection.tsx:26,29` is
  *exclusive*-open across two independent nesting levels — correct, since two
  sibling trees expanded at once would destroy the depth reading, which is
  reinforced structurally by `pl-6 border-l-2` → `pl-10` → `pl-8`.

### 4f. Conditional rendering gated on prior answers

The most convincing evidence of intentional disclosure:

- **Branch on radio choice** — `SimTypeStep.tsx:52,59`: Physical vs eSIM reveal
  two entirely different sub-flows.
- **Cascading dependent selects** — `TicketCreationModal.tsx:202,223`: Area
  appears only after Issue Type, Template only after Area, with the parent's
  `onChange` resetting all children (`:193-197`).
- **Two-condition gate** — `AppointmentBookingStep.tsx:82`: slots appear only
  once *both* cluster and date are chosen.
- **Appears only on failure** — `CreditCheckPanel.tsx:25-44`: the override
  checkbox surfaces only when the credit rule does not pass.
- **Route-level branch before a wizard exists** — `NewMnpWizard.tsx:64-73`
  redirects to a process-choice screen when `?type=` is absent, forcing the
  prepaid/postpaid decision *before* any step renders.

### 4g. Pagination and truncation

`DataTable.tsx:60` pages at 50 rows, and the pager renders only when needed
(`:89`). `GlobalSearch` caps each result category (≤5 modules, ≤6 screens, ≤3
per record type).

### Gaps

- **No "show more" / "show all" control exists anywhere in the app.** The only
  match for `showAll|show more|see all|view all` in `src/` is a code comment
  (`ContactSection.tsx:44`). `GlobalSearch`'s per-category caps therefore have
  **no escape hatch** to a full result list.
- **`WizardStep.skip?:` is a dead API** — declared (`:20`) and consumed (`:58`)
  but supplied by **zero** consumers. Its documented use case (appointment step
  skipped for instant activation) is unimplemented; branching is done by
  conditional array spread instead (`NewMnpWizard.tsx:109-124`).
- No generic `Accordion` primitive — the two accordions are hand-rolled with
  different markup, and neither animates its reveal while `Drawer` goes to real
  effort for its transition.
- **Customer 360's active tab is not in the URL** (`Customer360Layout.tsx:53`
  holds it in local state), so tab 14 of 18 is not bookmarkable, shareable, or
  restored on back-navigation — despite `Tabs` having a controlled API whose own
  doc-comment cites breadcrumb reflection as the motivation (`Tabs.tsx:26-30`).

---

## 5. Interaction design

**Principle — motion is functional, never decorative; overlays protect input.**

**Motion is restrained.** 33 `transition` occurrences, mostly
`transition-colors`. **No `@keyframes` and no `animate-*` classes anywhere** —
nothing spins, pulses, or bounces. Tokens: `--ease-standard:
cubic-bezier(.2,0,0,1)`, `--motion-base: 220ms`, `--motion-fast: 150ms`.

Purposeful examples:
- `Button.tsx:15` transitions only `[color,background-color,border-color,transform]`
  — never `transition-all`.
- `Button.tsx:21` `enabled:active:scale-[0.99]` — a press affordance correctly
  gated on `enabled:`, with the reasoning at `:17-19`: *"disabled buttons never
  shift color on hover — the visual affordance must match the cursor."*
- `Drawer.tsx:30-42` achieves enter/exit animation without a library via
  mount-then-transform, with `EXIT_DURATION_MS = 220` matched to `--motion-base`.

**The tooltip system is the most polished subsystem in the app.**
`Tooltip.tsx` is portal-rendered to `document.body` (`:178-191`), with the
rationale documented at `:21-23` — never nested inline (would be clipped by
ancestor `overflow:hidden`), never native `title=""` (inconsistent OS delay).
It measures the trigger rect, flips to the opposite side on collision
(`:73-76`), then clamps into the viewport with an 8px margin (`:83-84`).

**Delay is group-aware**, which is a genuinely thoughtful detail:
`TooltipContext.tsx:15-28` opens a 500ms window on first hover, during which
sibling tooltips use `0ms` instead of `400ms`. So the first icon in a toolbar
costs 400ms and scanning the rest is instant — matching how icon rows actually
get read.

**Reversibility.** The wizard's `Abandon Order` is deliberately understated —
plain text, top-right, away from the primary action (rationale at `:180-182`) —
routed through a confirmation with honest copy: *"This will discard everything
entered in this order so far. This cannot be undone."* (`:224`).

### Gaps

- **`prefers-reduced-motion` covers tooltips only.**
  `tooltip-tokens.css:37-43` correctly zeroes duration, distance *and* delay —
  but it is the **only** such block in `src/` (verified). `tokens.css` and
  `index.css` contain no reduced-motion query, so the Drawer's 220ms slide and
  every `active:scale` press animate at full amplitude regardless of the OS
  setting. Small fix: zero `--motion-base`/`--motion-fast` in a reduced-motion
  block.
- **No undo affordance for any completed action** — no toast-level "Undo"
  anywhere. Once a ticket is closed or an order approved, the only path back is
  a separate reopen/return action.
- **No unsaved-changes guard** on the Customer 360 edit drawers — edits live in
  local `useState`, so closing or navigating away discards them silently.

---

## 6. Feedback mechanisms

**Principle — every state transition is announced; work-in-progress is visible.**

**Toast system.** Zustand store + a single container mounted once at
`App.tsx:71`. Four kinds; a live `toasts` array plus a capped 30-entry `history`
(`notificationStore.ts:24,30-43`) that backs a notification bell with an unread
count (`PersonaSwitcher.tsx:41-45,113`).

Accessibility here is genuinely well done (`Toast.tsx:23-24`):
```tsx
role={t.kind === 'error' ? 'alert' : 'status'}
aria-live={t.kind === 'error' ? 'assertive' : 'polite'}
```

**52 `pushToast` call sites** (verified), and the messages are specific and
reference-bearing rather than generic:
- *"Order {orderId}: rejected — SMS sent to agent for correction."* —
  `OrderApprovalDetail.tsx:188`
- *"{kind} details saved — reference ticket {ticketId} created for follow-up."* —
  `profileChangeTicket.ts:41`
- `AgentProfileWorkspace.tsx:165` even localises: *"Language set to English."* /
  *"تم تعيين اللغة إلى العربية."*

**Double-submit prevention is real and well-reasoned.** Four sites back
`submitting` state with a synchronous `useRef` guard, because a second click in
the same tick still reads stale state. The comment documents the actual bug this
fixed:

> *"Confirmed live: a rapid double click on 'Save & Finish' produced two orders
> with the same ID and fields."*
> — `GuidedActivationWizard.tsx:43-53`

**Live computed summaries** recompute on every render with no "recalculate"
button — `CheckoutSummaryStep.tsx:53-59`, `PostpaidPlanAddonsStep.tsx:91-96`
(a "Live Cart Total" footer), `DeviceInstallmentStep.tsx:257-273` (a five-row
breakdown).

**`DataTable` distinguishes loading from empty** (`:136-149`) — and
`ErrorBanner` exists specifically to separate "fetch failed" from "list is
genuinely empty" (`ErrorBanner.tsx:1-4`), a distinction most apps conflate.

### Gaps

- **Toasts never auto-dismiss.** Verified: **zero** `setTimeout`/TTL anywhere in
  the toast path. The only removal is the manual `×` (`Toast.tsx:28`), and the
  `toasts` array is append-only and uncapped (`notificationStore.ts:37`). Loops
  such as `BulkAdjustmentPortal.tsx:47` push one toast *per row*, stacking
  unbounded overlays that must each be dismissed by hand. There is no
  "dismiss all". **This is the highest-impact interaction defect in the app.**
- **Silent mutation failures.** Only `OrderApprovalDetail.tsx:167-169` catches
  and surfaces an error. Four sites use `try/finally` with **no `catch`**
  (`GuidedActivationWizard.tsx:87-93`, `BellNotificationsSection.tsx:80-96`,
  `BulkNotesConfigSection.tsx:63-79`, `TicketCreationModal.tsx:163-171`) — the
  spinner clears but the user is never told it failed. Five+ more are bare
  `await` with no handler (`DemographicEditDrawer.tsx:43-67`,
  `AddressSection.tsx:146-158`, `ContactSection.tsx:132-144`). Worst case: a
  wizard submit throws, the button re-enables with no explanation, and the agent
  may reasonably assume success.
- **`ErrorBanner` does not announce** — `ErrorBanner.tsx:5-12` is a plain `<div>`
  with no `role="alert"`. It is the shared fetch-failure banner for **9** list
  screens, so a failed load is silent to a screen-reader user and the table
  simply reads as empty. One-line fix; cheapest high-impact win in this document.
- **No shared loading primitives** — `Button` has no `loading` prop, and there is
  no Skeleton or Spinner anywhere. All ~14 pending states are hand-rolled, and
  two only *disable* the button without changing its label, so a slow save looks
  like a dead click.
- **`GlobalSearch` is undebounced** (`:149`) and has no loading indicator —
  compare the correct 220ms-debounced implementation with a `Searching…` state at
  `CustomerSearchPage.tsx:32-45,95`.

---

## 7. Error prevention

**Principle — fail fast, explain why, and name the next action.**

### Rule engine

`public/config/business-rules.json` catalogues **349** rules as metadata + prose.
`src/engines/ruleEngine.ts` implements **15** of them as executable predicates:

```ts
export type RuleImplementation = (ctx: RuleContext) => { pass: boolean; message?: string };
```

Real hard blocks: `BR-113` blacklist gate (`:127`), `BR-288` expat QID 2-line cap
(`:138`), `BR-347` prepaid/combined caps (`:166`),
`BR-ENTERPRISE-CREDIT-LIMIT-APPROVAL` (`:87`).

### Fail-fast sequencing — the strongest instance

`EligibilityGateStep.tsx` is **step 2 of 9** in the prepaid wizard, running
after identity resolution and *before* any plan, number, SIM, or payment work.
It fires four rules and reduces to one boolean (`:100`), consumed as the step
gate (`NewPostpaidWizard.tsx:136`):
```ts
isValid: (values) => (values.eligibility as EligibilityResult | undefined)?.pass === true,
```
Note `=== true` — `undefined` blocks, which is the safe default. A blacklisted
customer is stopped before any effort is spent, and **all** checks render as
independent pass/fail cards (`:146-176`), not just the failing one.

### Gating and privilege

`customerVerificationStore.ts:10-14` is a one-way monotonic set, designed so
that *"'no transition out of Verified' is structurally impossible to violate —
there is no remove/unset action anywhere in this store's API."*

`VerificationGate.tsx:39-45` requires both a two-sided ID scan **and** a
document number matching *that specific customer's* records:
```ts
const match = docs.find((d) => d.customerId === customerId && d.documentNumber === idNumber.trim());
```
The `d.customerId === customerId` clause is the load-bearing part — a valid QID
belonging to someone else fails. `useVerificationGate` (`:95-125`) implements
deferred action, so verification adds one step rather than losing the intent.

### Message quality — genuinely high

Messages state cause, entity, and frequently the next action:

| Message | Source |
|---|---|
| *"This ID number does not match any document on file for this customer. Try again."* | `VerificationGate.tsx:43` |
| *"ID Type cannot be changed here — BR-03. Use the KYC identity-correction wizard."* | `ContactSection.tsx:170` |
| *"This SIM is already assigned."* | `SimSerialScanner.tsx:39` |
| *"This serial is a {deviceType}, not a {expected}."* | `CpeSerialScanner.tsx:42` |
| *"Complete the Contact step first — eligibility depends on the validated identity."* | `EligibilityGateStep.tsx:121` |
| *"Escalate to Risk/Collections; no agent override."* | `ruleEngine.ts:130` |
| *"Billing Profile not found in BRM — expected format BILL-xxxx."* | `BulkAdjustmentPortal.tsx:23` |

### Destructive-action protection

`OrderApprovalDetail.tsx:325-332` requires an explicit attestation checkbox —
*"By clicking submit, I agree that I have verified all the documents and details
to proceed with submission."* — with `disabled={!ackApprove || submitting}`.
Ticket cancellation requires a mandatory reason (`TicketDetail.tsx:618`).

### Gaps — this is the weakest principle area

- **Input format enforcement is absent app-wide.** Verified: **zero**
  occurrences of `maxLength`, `inputMode`, or `pattern=` in `src/`. The app is
  overwhelmingly *report-after* rather than *prevent-before*.
- **`QidInput.tsx:74-82` applies no constraint of any kind** — no 11-digit
  check, no numeric-only filter, no embedded-DOB cross-check — directly
  contradicting its own spec (`validation-rules.json` VAL-234: *"Qatari ID must
  be an 11-digit numeric value; must match embedded DOB"*). In a regulated
  ID-driven telecom flow this is the most consequential gap: a typo'd QID is
  caught only by lookup failure, and nothing distinguishes "typo" from
  "genuinely not in MOI."
- **`SimSerialScanner.tsx` has no 19-digit check** (spec VAL-289), so a short
  serial reports *"SIM Serial not found in inventory."* — a misleading message
  for what is actually a format error.
- **The entire declarative validation layer is dead code.** `validationEngine.ts`
  has **zero call sites** (verified). The 281 field-level rules in
  `validation-rules.json` — including 79 carrying VFQ's own verbatim error
  strings — are loaded at boot and never read, so config and UI can drift
  silently.
- **Rule coverage is 15/349 (~4%), and the default is fail-open**
  (`ruleEngine.ts:309` returns `pass: true` for unimplemented rules). For 138
  Validation-type and 51 Eligibility-type rules, silent allow is the wrong
  default in this domain. The "visible dev-mode warning banner" promised at
  `:7,307` **does not exist** — only a `console.warn` fires.
- **Route-level authorisation is not enforced.** Verified: `canAccessScreen`,
  `canPerformAction` and `visibleRoutesFor` have **zero call sites**;
  `router.tsx` contains no guard of any kind. The 33 `Restricted-No-Access`
  entries in `rbac.json` are never enforced, and every one of 213 screen routes
  is reachable by URL for any persona. `personaEngine.ts:4-5` does self-label as
  "NOT a security boundary", so this is disclosed rather than hidden.
- **`AppointmentBookingStep` has no confirmation dialog** despite three spec
  entries requiring one (VAL-248/258/277: *"Appointment once booked cannot be
  cancelled."*). Slot selection commits on a single click (`:94`).
- **`entityStore.createRecord`/`updateRecord` have no `try/catch`** (`:42-60`),
  unlike `loadKind` which does — reads fail visibly, writes fail silently.

---

## 8. Usability

**Principle — optimise for the expert repeat user.**

**Task-oriented, not module-oriented.** `Dashboard.tsx:29-36` documents the
replacement of a module-launcher grid with search, task tiles, quick actions and
recents. A shared ownership predicate keeps tile counts and list contents from
ever diverging (`agentTaskEngine.ts:6-9`): unassigned work is anyone's to pick
up, assigned work is only its owner's.

**Customer context bridge.** `activeCustomerStore.ts` holds one active customer
plus an 8-deep MRU list, consumed by 8 files including the breadcrumb (so the
trail shows the customer's actual *name*) and the session-ticket chip.
`launchQuickAction` calls `clearActiveCustomer()` before navigating
(`Dashboard.tsx:158`) — a thoughtful guard against a stale customer leaking into
a new order.

**Handling-time accelerators that work:**
- **Finish → Next Customer loop** (`SessionReferenceNumbers.tsx:126-183`) — the
  single biggest retail-agent feature. `Finish` completes the queue ticket and
  enters an explicit awaiting state (*"the system does NOT auto-advance"*,
  `:65`), then `Next Customer` pulls the oldest waiting ticket, verifies identity
  if needed, and lands on their Customer 360.
- **7-field customer search** (`customer360Engine.ts:45-74`) — mobile, QID,
  customer number, account number, name, email, service ID — so whatever
  identifier the customer has to hand works. Results carry **matched-field
  badges** so the agent can see *why* a row surfaced.
- **Enter-to-submit** (`useEnterToSubmit.ts`), careful and correct: bails on
  `e.defaultPrevented` so a listbox committing Enter doesn't also fire the
  section's Continue, and skips `<textarea>`/`<button>`. 6 call sites.
- **CSV export** with proper quote/comma/newline escaping (`csvExport.ts:5-25`)
  from 5+ surfaces, RBAC-filtered in one (`AgentProfileWorkspace.tsx:68-71`).
- **Bulk operations** with per-row status, failure reason, and a
  *Re-upload Failed Rows* retry that skips already-successful rows
  (`BulkOperationPortal.tsx:99-130`).
- **Density suited to experts** — `DataTable` pages at 50 rows, every column
  sorts by *opt-out* default (`:65`), and per-column `linkTo` lets one row route
  to a ticket from one cell and a customer from another (`:20,173-181`).

**Honest unavailability instead of dead clicks** — unbuilt actions render as a
dashed "Coming soon" card with the description and a tooltip, rather than a
fabricated link (`ProductActionGroups.tsx:79-92`).

### Gaps

- **No keyboard shortcut of any kind.** Verified zero `metaKey`/`ctrlKey`/
  `accessKey` hits — no command palette, and no `/` or ⌘K to focus global
  search. A high-frequency control is mouse-only to reach.
- **No copy-to-clipboard** on the Qnomy/CTI reference numbers
  (`SessionReferenceNumbers.tsx:190-221`) — agents dictate these to customers
  and paste them into other systems.
- **No table multi-select or bulk action** on any `DataTable` — `onRowClick`
  only. Bulk work is confined to one billing-adjustment portal.
- **No saved or persisted filters** — `TicketsDashboard` filters are
  session-only.
- **No wizard skip-ahead** — an expert doing the 20th identical prepaid
  activation still walks all 9 steps one `Continue` at a time.
- **A 66-item ungrouped role dropdown** (`PersonaSwitcher.tsx:184-191`).
- **Developer artefacts are agent-reachable** — `/:moduleSlug` renders
  `ModuleScreenList` with `Built` / `Not built` / `Not RBAC-evidenced` badges.
  Unlinked from the sidebar but live in `router.tsx:58-59`.

---

## 9. Customer-centric design patterns

**Principle — the agent is the user; the customer is the beneficiary.**

The direct user is unambiguously the **agent**. The **customer** is served
indirectly through three mechanisms, each with real implementation.

### (a) Consolidation, so the customer isn't re-asked

`customer360Engine.ts:108-193` fans out **23 parallel** list calls and joins
them by `customerId`/`accountId`/`orderId`/`msisdn` into one view. Beyond the
convenience, three details specifically serve the customer:

- **One computation, no contradictions.** `computeBillingSummary` (`:233-258`)
  is shared by the header strip and the Billing tab — *"one source of truth for
  'what does this customer currently owe' rather than two divergent
  calculations"* (`:230-232`). A customer cannot be quoted two different
  balances by two parts of one screen.
- **Answer-at-a-glance for the three questions customers actually ask** —
  account status, current bill, outstanding (with subtext flipping between
  *'Overdue balance'* / *'No overdue balance'*), open tickets
  (`Customer360Layout.tsx:187-204`). No tab-hunting for "do I owe anything?"
- **"Last payment" isolated as its own atomic field** rather than requiring the
  agent to scan the Payments table (`:210-213`) — directly targeting
  "I paid last week" calls.
- **Plain-English action descriptions the agent can read aloud** —
  `MobileSection.tsx:19`: *"Temporarily pause the line's service — no usage, but
  the plan and number stay reserved."* Rationale at `ProductActionGroups.tsx:17-20`.

### (b) Protective gates

- **Identity verification before mutation** — deliberately scoped to *edits*,
  not lookups (commit `01cebb2`; `CustomerSearchPage.tsx:41-48`: *"a plain
  lookup is read-only and shouldn't require an ID scan up front"*). Four
  independent gates at the point of mutation.
- **Agents cannot type a customer into existence** — `IdLookupStep.tsx:76-92`
  renders MOI-returned Name/DOB/Nationality as read-only *text, never inputs*,
  and editing the ID number clears the fetched result immediately (`:67-70`) so
  demographics can never be stale relative to the ID on screen. Email is
  `disabled` with *"Fetched from MOI — not editable."*
- **Bell notifications the agent cannot dismiss** —
  `BellNotificationBanner.tsx` is scoped to one customer, `Published` only,
  auto-expiring, and **deliberately not dismissible** (BIN-06, `:30-34`). The
  agent cannot skip past an active notice, and it expires on its own so they
  never quote a stale promise. Publishing requires an expiry first
  (`BellNotificationsSection.tsx:75-76`).
- **Consent shown in the customer's own language before signing** —
  `CafSignatureCapture.tsx:46-59` renders a bilingual header
  (*"Vodafone Customer Application Form"* / `<span dir="rtl">نموذج طلب عميل
  فودافون</span>`) pre-populated from real order data, above the consent
  sentence. The wizard refuses to advance without the signature.

### (c) Guidance that reduces error on the customer's order

The 9-step prepaid wizard (`NewPrepaidWizard.tsx:141-289`) sequences
customer-protectively: **eligibility at step 2**, **payment last**, gated behind
a signed CAF. Step 8 shows a plain-language Key Information panel before
signature (`:256-261`). The confirmation screen (`:96-131`) is the most
customer-centric copy in the app, telling the agent exactly what to say next:

> *"The customer can install the eSIM using the QR code sent to their email."*
> *"A copy of the CAF has been stored against this account."*
> *"The customer is notified once a decision is made."*

### Gaps — ranked by customer impact

1. **Customer-record edits are unaudited.** The only
   `createRecord('audit-trail', …)` in `src/` is `TicketDetail.tsx:153-163`, and
   `Customer360Layout.tsx` has no Audit tab. So an agent can pass identity
   verification, change a customer's billing address, and leave **no immutable
   trace at the customer record** — precisely the BR-02 action the gate
   protects. This is the largest customer-protection gap in the app.
2. **RBAC is decorative at the boundary** (see [§7](#7-error-prevention)). The
   one real check, `canEditCustomerRecords`, is allow-by-default over **60 of 66
   personas** — a Field Technician or IT Operations persona can edit customer
   demographics. Combined with a free-for-all role switcher that includes
   `PERSONA-050 System user SADMIN` and external personas, there is effectively
   no privilege separation.
3. **The "don't re-ask the customer" promise is unfulfilled at the contact
   step.** `activeCustomerStore.ts:27-28` claims `GuidedContactStep` pre-fills
   from the bridge — it does not import the store, and `GuidedContactStep.tsx:61-66`
   mandates the opposite (*"the ID Type/Number fields must never auto-populate
   … even when Customer 360's product actions launch this step for a customer
   already on screen"*). Defensible as an anti-fraud control, but **the store's
   own comment is wrong**, and the customer re-presents their QID with their
   record already on screen.
4. **Consent is display-only.** `ConsentSection` (`MiscSections.tsx:283-308`)
   shows three read-only fields. No consent capture or withdrawal, no
   marketing-preference toggle, no data-export/erasure affordance — in a
   jurisdiction (Qatar PDPPL) where that matters. Signatures store a data-URL
   with no timestamp or capturing-agent ID.
5. **Session verification never expires** and is keyed only on `customerId`
   (`VerificationGate.tsx:24-25`). A shared retail terminal stays verified
   indefinitely.
6. **No Arabic UI.** Arabic appears in exactly one place (the CAF preview). No
   RTL layout, no locale switch, no i18n layer. `preferredLanguage` is captured
   and displayed but never acted on — so an Arabic-preferring customer's stated
   preference changes nothing the agent can show them.
7. **`CAF Manual` / `Touch Screen` branches render nothing**
   (`CafSignatureCapture.tsx:43` guards on `=== 'Digital'`), yet `isValid` passes
   on `cafType` alone — an order can complete with **no consent artefact at all**.
8. **Spec IDs leak into production copy — 17 JSX sites.** Worst instance is the
   verification gate's primary explanation at the app's most sensitive moment:
   *"BR-01: {customerName}'s identity must be verified before any demographic,
   contact, address, or billing maintenance action can proceed."*
   (`VerificationGate.tsx:72-73`). Also `<Badge>BR-03: ID Type / ID Number are
   protected fields</Badge>` and `label="Comments (required — BR-06)"`. Valuable
   traceability in a reconstruction build; spec-speak in production UI.
9. **Jargon is largely unexplained.** Occurrence counts: `QID` 50, `MNP` 49,
   `CAF` 48, `FWA` 36, `MSISDN` 33, `HRN` 22, `ZSB` 10, `DOI` 10. There is **no
   glossary anywhere** (zero hits for `glossary|stands for|full form`), and of
   only 26 `<Tooltip>` instances app-wide, **none defines a term**. `QidInput.tsx:24-27`
   is the honourable exception, expanding each ID type with a format example.
   `CAF`'s full form appears *inside* the preview but is never connected to the
   label; `HRN` leaks into a money line (*"HRN advance payment"*).
10. **Dashboard greeting shows the role, not the person** — *"Welcome back,
    Retail/Sales Agent!"* (`Dashboard.tsx:164-166`) despite `profile.name` being
    rendered in the same viewport.

---

## 10. Accessibility

**Principle — partially realised. A solid foundation and several first-rate
components, undermined by a few high-impact structural gaps.**

### What is implemented

**ARIA inventory** (whole of `src/`): `aria-label` 51, `aria-describedby` 10,
`aria-expanded` 8, `aria-haspopup` 6, `aria-hidden` 6, `aria-selected` 3,
`aria-modal` 2, `aria-live` 2, `aria-sort` 1, `aria-current` 1.

**Genuine strengths:**
- **`Toast` is the best a11y code in the repo** — correct `role`/`aria-live`
  split by severity, with the reasoning documented (`Toast.tsx:12-14,23-24`).
- **Focus management in the wizard** — a `tabIndex={-1}` step heading is
  `.focus()`ed on step change but explicitly *not* on first mount
  (`GuidedActivationWizard.tsx:67-75`), plus an `sr-only aria-live` region
  announcing *"Step N of M: {label}"* (`:122-124`) and `aria-current="step"`.
- **Keyboard-reachable tooltips** with Escape-to-dismiss, citing WCAG 1.4.13
  (`Tooltip.tsx:119-126,163-170`).
- **`Select` has a real keyboard implementation** — ArrowDown/Enter/Space open,
  arrows move, Enter commits, Escape/Tab close (`:76-104`).
- **Clickable table rows are keyboard-operable** — `tabIndex={0}`, Enter *and*
  Space, with Space `preventDefault`ed (`DataTable.tsx:91-98`).
- **`outline-none` is never used without a replacement** in 18 of 20 cases, and
  the global `:focus-visible` default is correctly `@layer base`d so utilities
  can override it (`index.css:155-160`).
- **Non-colour status cues** — `Badge.tsx` always renders status as *text*, so no
  status anywhere is colour-alone; **SC 1.4.1 looks satisfied.** The pill also
  carried an `aria-hidden` leading dot on lifecycle variants until 2026-09-24,
  when the reference's label-only outlined pill replaced it. That did not weaken
  this finding: the dot took its colour from the text and was hidden from
  assistive tech, so the label was always what conveyed the status. The pill is
  now a `--bg` interior with a tinted 1px border (`--success-border`,
  `--warn-border`, `--danger-border`, `--info-border`) and a 4px corner.
- `lang`/`dir` are set from the agent's language preference (`App.tsx:35-39`).

### Gaps — blocking, roughly by impact

1. **No focus trap, no initial focus, no focus restoration in `Drawer` or
   `Modal`.** Verified: zero `FocusTrap`/`trapFocus`/`inert` matches. Both
   declare `aria-modal="true"`, which *claims* modality to assistive tech, but
   Tab escapes into the obscured page and focus is never moved into the panel or
   returned to the trigger. Since `Drawer` backs nearly all data entry
   (`Drawer.tsx:13-19`), this affects most forms in the app. **SC 2.4.3.**
2. **Field errors are invisible to assistive tech.** Verified: **zero**
   `aria-invalid` and zero `aria-required` in `src/`. Worse, `Input.tsx:49`
   renders the error `<span>` with **no `id`**, and `:19` deliberately *excludes*
   the error from `aria-describedby` (`helperText && !error`) — so an invalid
   field carries *less* programmatic information than a valid one. Replicated in
   `Select`, `Textarea`, `QidInput` across 9 `error={...}` call sites.
   **SC 3.3.1 / 4.1.2.** Four lines in `Input.tsx` would fix all of them.
3. **`ErrorBanner` has no `role="alert"`** — silent failures on 9 list screens
   (see [§6](#6-feedback-mechanisms)).
4. **`Tabs.tsx` has zero tab semantics** — 74 lines, no `role="tablist"`/`tab`/
   `tabpanel`, no `aria-selected`, no arrow-key navigation. This backs
   Customer 360, the most-used screen. **SC 4.1.2.**
5. **Custom comboboxes have no `aria-activedescendant`/`aria-controls`** —
   `Select.tsx:170-174` tracks the arrow-key highlight purely visually, so **a
   screen-reader user arrowing through a dropdown hears nothing change.** Same in
   4 other components.
6. **No skip link** (verified zero matches). With a persistent `<nav>` rendered
   before `<main>`, every keyboard user Tabs the entire sidebar on every page
   load — the largest everyday friction for all-day contact-centre use.
   **SC 2.4.1.**
7. **The focus indicator itself fails SC 1.4.11 (3:1) in both themes.** Because
   `outline: none` is global, the only indicator is a translucent box-shadow:
   `--field-focus-ring` composites to **1.35:1** on white, `--focus-ring` to
   **1.49:1**, dark-mode `--focus-ring` to **1.58:1**, and
   `--field-focus-border` `#c09696` to **2.61:1**. Note this stems from the
   explicit product directive at `tokens.css:49-56`, so it needs a *design*
   decision, not just a code change.
8. **`ContactPhoneInput.tsx:114`** uses `focus:outline-none` with **no
   replacement at all** and no `focus-within:` on the parent — this input has no
   visible focus indicator. **SC 2.4.7.**
9. **`role="button"` on `<tr>`** (`DataTable.tsx:156`) overrides the implicit
   `row` role, removing the row from the table model and orphaning its cells —
   screen-reader table navigation breaks on every clickable queue.
10. **Collapsed sidebar nav links have no accessible name** — the label text
    unmounts when collapsed (`Sidebar.tsx:144`) and the `Tooltip` contributes only
    `aria-describedby` (a *description*, not a name), and only while visible. The
    primary navigation becomes a list of unnamed links.

**Measured contrast failures** (WCAG 2.x relative luminance against real token
values, recomputed after the 2026-09-24 re-skin):

*Text contrast improved.* Outlining the status pills moved their labels onto a
white `--bg` interior instead of a 12% tint, and the new text ramp is darker
than the old one. Every pill label now passes AA at small text: success
`#388e3c` **4.12:1** (was 3.44:1), danger `#d0342b` **4.99:1** (was 4.18:1),
`--warn-text` **5.43:1**, `--info` **7.21:1**, accent **4.81:1**. Body text
`--fg #313131` is **13.01:1** and `--muted #757575` **4.61:1**, which is
precisely why `--muted-2 #9e9e9e` (**2.68:1**) is restricted to placeholders
and decorative glyphs and kept off body copy.

*Non-text contrast got worse, and this is a regression to own.* SC 1.4.11
requires **3:1** for the visual boundary of a UI component. The re-skin lowered
every boundary in the app:

| Boundary | Before | After | 1.4.11 |
| --- | --- | --- | --- |
| `--field-border` (every text input) | `#cdbebe` 1.79:1 | `#e0e0e0` **1.32:1** | fails, worse |
| `--border` (cards, panels, tables) | `#e5e5e5` 1.27:1 | `#e0e0e0` **1.32:1** | fails, marginally better |
| `--border-soft` (dividers) | `#e5e5e5` 1.27:1 | `#eeeeee` **1.16:1** | fails, worse |
| Pill borders (`--success-border` etc.) | n/a (filled) | **1.39–1.73:1** | fails, new surface |

This is a direct consequence of applying the supplied asset faithfully — those
are its literal values, and it is a visual reference, not an accessibility
audit. It is recorded here rather than silently "corrected" because quietly
darkening the borders would mean shipping something the reference does not
specify. **The fix is a product decision, not a code one**: either the asset
gets an accessible-boundary revision, or the app deviates from it on purpose
for field/pill borders. Until then, field and pill boundaries rely on the
adjacent label and the focus ring to convey structure.

*Unchanged:* dark-mode `text-accent` on `--bg` **3.72:1**; `--field-focus-border
#c09696` **2.61:1** (still the 2026-09-15 directive's value — see §1).

**Other serious gaps:** no `<header>`/`<aside>`/`<footer>` landmarks anywhere
(only `main` and `nav`); breadcrumbs are a bare `<div>` with no
`<nav aria-label="Breadcrumb">`, no `<ol>`, and no `aria-current="page"` on the
trailing crumb; no `fieldset`/`legend` on any radio group; `Icon.tsx` never sets
`aria-hidden`, exposing 64 decorative SVGs (one-line fix inside the primitive);
duplicate `id="select-undefined"` rendered three times on
`TicketsDashboard.tsx:155,162,168`; heading level skips h1 → h3 throughout
Customer 360.

---

## 11. Responsiveness

**Principle — desktop-optimised with a partial mobile retrofit. Not a
responsive application, and defensibly so — but with one unjustifiable omission.**

### Verified measurements

| Prefix | Occurrences |
|---|---|
| `sm:` | 26 |
| `md:` | 18 |
| `lg:` | 17 |
| `xl:` | **0** |
| `2xl:` | **0** |
| **Total** | **61** |

**Files containing any breakpoint: 20 of 141 `.tsx` (14%).** Unprefixed
`grid-cols-*` declarations: **59**. Dimensional CSS media queries in `src/`:
**zero** (the only `@media` is `prefers-reduced-motion`).

### Reading those numbers honestly

Two of the three heaviest breakpoint users aren't application screens:
`Sidebar.tsx` (12) is the shell's off-canvas mechanism and `LoginPage.tsx` (8) is
pre-auth marketing chrome; `ModuleScreenList.tsx` (8) is the legacy QA catalogue.
So roughly **half of all breakpoints sit outside the authenticated application
surface**, and most of the rest simply reflow a grid.

### What genuinely works

- **The sidebar is fully responsive and well built.** `sidebarStore.ts` keeps
  *two independent* states — a persisted desktop `collapsed` preference and an
  ephemeral `mobileOpen` — and `Sidebar.tsx:67` deliberately has the mobile
  drawer ignore the desktop preference (`mobileOpen ? false : collapsedPref`).
  Route change auto-closes it (`:60-63`); the backdrop is only in the DOM when
  open. When collapsed, labels unmount and tooltips activate to compensate
  (`:133`).
- **`Drawer` floors correctly** — `w-[40vw] min-w-[320px] max-w-full` (`:61`).
- **`DataTable` handles overflow** — `overflow-x-auto` (`:102`), which is the
  **only** `overflow-x` in all of `src/`. Table screens consequently hold up at
  narrow widths far better than Customer 360 or the wizards.
- 22 of 23 `min-w-` uses are `min-w-0`, correctly *enabling* flex/grid shrink.

### Gaps

- **Two fixed-width side rails with no breakpoint at all**, in the two
  highest-traffic surfaces: `Tabs.tsx:40` (`w-56 shrink-0`) and
  `GuidedActivationWizard.tsx:127` (`w-72 shrink-0`). At 375px the Customer 360
  rail leaves ~110px for the panel inside a `p-8` gutter — Customer 360 and all
  9 wizards are effectively unusable below ~700px. **The fix pattern already
  exists in the codebase** at `ProfileSection.tsx:26,55`
  (`flex-col lg:flex-row`, `w-full lg:w-72`); it simply wasn't applied to the
  two shared primitives.
- **The header grid has 4 tracks at every width**
  (`PersonaSwitcher.tsx:76`) with no responsive variant, and
  `SessionReferenceNumbers.tsx:189` is `shrink-0` with no `md:hidden` — so the
  session chip refuses to yield space and the header overflows on narrow
  viewports.
- **`xl:` = 0 and `2xl:` = 0 — nothing adapts upward.** On the 2560px monitors
  these agents actually use, layouts stop improving at the 1024px tier and the
  remainder is whitespace. All 29 `max-w-*` usages are upper bounds. For a
  desktop-targeted product this is arguably a more costly omission than the
  mobile gaps, and it is the one hard-to-defend responsiveness finding.
- Density is a per-component habit, not a system parameter — no compact/
  comfortable toggle, and `pageSize` is a per-call-site prop rather than a user
  preference.

---

## 12. Evidence traceability & conflict surfacing (the distinctive principle)

This is not on the standard list, but it is the most unusual and arguably the
most valuable design principle in the codebase, so it is documented here
explicitly.

**Principle — when the source requirements contradict each other, the
contradiction itself becomes the runtime output. The app never silently picks a
side.**

Two rules are deliberately built never to resolve.

**`BR-FIBRE-OUTSTANDING-THRESHOLD`** (`ruleEngine.ts:45-57`) returns
`pass: false` whenever there is a balance to evaluate, with the conflict as the
message:

```ts
return { pass: false, message:
  `Unresolved: the fibre outstanding-dues threshold is contradictorily specified ` +
  `(BRSD Open Item OI-04 / BR-033) — one position requires a fibre-specific QAR limit, ` +
  `another says it must equal the mobile/postpaid threshold. No value is agreed. ` +
  `Escalate to VFQ Collections/Credit Control before this account can proceed on a definitive rule.` };
```

The comment above it names the source workbook, both contradictory positions, and
the instruction it honours — *"this rule NEVER silently picks a threshold."*

**`BR-ZSB-MANDATORY-FOR-MOBILE`** (`ruleEngine.ts:74-80`) takes the opposite
posture — `pass: true`, non-blocking — but says why and what to do, and
`ZsbConflictNotice.tsx` is a 22-line component whose only job is to render it as
an *"Unresolved policy conflict"* banner. The asymmetry is reasoned at `:59-73`:
it leans non-blocking because the field-level evidence *itself* supports the
workshop position — *"That's a real, cited signal, not a coin flip — but the
conflict itself remains genuinely unresolved."*

**Crucially, the two conflicts get UX treatments matched to their risk.** ZSB
(address capture) is a passive advisory banner. The fibre credit check (money)
demands an explicit per-order override (`CreditCheckPanel.tsx:39-43`):

> *"I acknowledge this policy is unresolved (see conflict-report.md Conflict 1)
> and am proceeding without a definitive credit-check gate."*

That checkbox is load-bearing on the wizard gate (`NewFixedLineWizard.tsx:70`),
and the component is precise that this is *"a UX/business decision layered on
top of the rule engine, not the engine silently unblocking itself."*

**Why this matters.** The conventional failure mode when specs contradict is for
a developer to pick one silently, ship it, and bury the assumption. Here the
ambiguity is preserved as a first-class runtime value, escalated to the person
who can resolve it, named with its source document and open-item ID, and — for
the money-touching case — recorded as a per-order acknowledgement. It converts an
invisible build-time guess into a visible, attributable, auditable runtime
decision.

The same traceability discipline runs through the code as prose: `LoginPage.tsx:50-69`
records a concrete, testable acceptance criterion for a requirement whose source
document is a reuse-stub, precisely so a future audit has something real to check
against. The trade-off is [§9 gap 8](#gaps--ranked-by-customer-impact) — these
IDs also leak into user-facing copy in 17 places.

---

## Maturity scorecard

| Principle | Assessment | Basis |
|---|---|---|
| **Consistency** (colour/structure) | **Strong** | 893 token refs vs 2 hex; 0 raw `<select>`/`<table>` outside primitives; 85/141 files use primitives |
| **Progressive disclosure** | **Strong** | 7 mechanisms in real use; step high-water mark; conditional reveal throughout |
| **Evidence traceability** | **Strong / distinctive** | Conflicts surfaced as runtime output with risk-matched UX |
| **Visual design** | **Good** | Semantic tokens, documented dark mode, genuine brand restraint — but 42% dead tokens, 1 canvas defect |
| **Interaction design** | **Good** | Purposeful motion, best-in-class tooltip, input-protective overlays — but reduced-motion is tooltip-only |
| **Information hierarchy** | **Good** | Chromatic chrome separation, summary-first, 4-tier Customer 360 — but 6 tokens collapse to 14px |
| **Error messaging** | **Good** | Specific, actionable, frequently names the next step |
| **Usability** | **Moderate** | Strong task orientation and Next-Customer loop — but zero keyboard shortcuts, no bulk select, no saved filters |
| **Feedback mechanisms** | **Moderate** | Excellent toast semantics and double-submit guards — undermined by no auto-dismiss and ~9 silent-failure sites |
| **Customer-centric** | **Moderate** | Real consolidation and protective gates — but edits unaudited, consent display-only, no Arabic UI |
| **Error prevention** | **Weak** | 0 `maxLength`/`inputMode`/`pattern`; QID/SIM format unvalidated; validation layer dead; RBAC unenforced; fail-open default |
| **Accessibility** | **Weak–Moderate** | Several first-rate components and satisfied SC 1.4.1 — but no focus trap, no error association, no skip link, sub-3:1 focus ring |
| **Responsiveness** | **Desktop-only by design** | 61 breakpoints in 20/141 files; `xl:`/`2xl:` = 0; two fixed rails break the top-2 surfaces below ~700px |

### The five highest-leverage fixes

Ordered by impact-to-effort, all small and well-contained:

1. **`role="alert"` on `ErrorBanner.tsx:5`** — one line; un-silences failed loads
   on 9 screens.
2. **Four lines in `Input.tsx`** — give the error `<span>` an `id`, include it in
   `describedBy` unconditionally, add `aria-invalid`, add `role="alert"`. Fixes
   error accessibility across every form in the app.
3. **Auto-dismiss + cap in `notificationStore.ts`** — removes the unbounded
   toast-stacking defect.
4. **`aria-hidden="true"` inside `Icon.tsx:5`** — one line, zero call-site
   changes, hides 64 decorative SVGs.
5. **`w-full lg:w-56` / `lg:w-72` on `Tabs.tsx:40` and
   `GuidedActivationWizard.tsx:127`** — makes Customer 360 and all 9 wizards
   usable on narrow viewports, using a pattern already in the codebase.

---

## Appendix A — verification commands

All quantitative claims in this document were re-verified independently of the
audit passes. Run from `vfq-dxp-app/`:

```bash
# Token discipline
grep -rhoE "var\(--[a-z-]+\)" --include='*.tsx' src/ | wc -l          # 893
grep -rnE "#[0-9a-fA-F]{6}" src/components src/modules src/workspace   # 2 (both token defs)
grep -rlE "from '.*primitives/" --include='*.tsx' src/ | wc -l         # 85

# Structural primitive enforcement
grep -rn "<select" --include='*.tsx' src/components/domain src/modules src/workspace  # 0

# Responsiveness
for p in sm md lg xl 2xl; do
  echo -n "$p: "; grep -rhoE "(^|[^a-zA-Z0-9-])${p}:[a-z]" --include='*.tsx' src/ | wc -l
done                                                                    # 26/18/17/0/0
grep -rlE "(sm|md|lg|xl|2xl):[a-z]" --include='*.tsx' src/ | wc -l     # 20 of 141

# Error prevention
grep -rn "maxLength\|inputMode\|pattern=" src/ | wc -l                 # 0

# Accessibility
grep -rn "aria-invalid\|aria-required" src/ | wc -l                    # 0
grep -rn "FocusTrap\|trapFocus\|inert" src/ | wc -l                    # 0
grep -rniE "skip[- ]?(to|link|content)" src/ | wc -l                   # 0

# Feedback
grep -n "setTimeout\|duration\|ttl" src/stores/notificationStore.ts \
  src/components/primitives/Toast.tsx | wc -l                          # 0 (no auto-dismiss)

# Dead code / dead dependencies
grep -rn "from 'idb'\|openDB\|indexedDB\|react-hook-form\|useForm" src/ | wc -l  # 0
for f in canAccessScreen canPerformAction visibleRoutesFor getDesignToken requiredMessageFor; do
  echo -n "$f: "; grep -rn "$f" src/ | grep -v "export function $f\|export const $f" | wc -l
done                                                                    # all 0

# Motion
grep -rn "prefers-reduced-motion" src/        # 1 hit: tooltip-tokens.css:37

# Canvas defect
grep -n "strokeStyle" src/components/primitives/SignaturePad.tsx        # 'var(--fg)'
```

### Scope and limitations

- **Runtime-verified:** the app builds clean (`tsc -b && vite build`, 0 type
  errors), lints clean (exit 0, 30 pre-existing warnings), boots, authenticates,
  resolves a persona, and loads 11 config + 83 mock-data files with zero failed
  requests. Live DOM checks confirmed token resolution in both themes.
- **Static analysis only:** contrast ratios are computed from token values, not
  measured on rendered pixels, and the Badge tints were computed in sRGB while
  the tokens use `color-mix(in oklab, …)` — direction and rough magnitude hold,
  exact ratios may shift slightly. No axe/Lighthouse run. No screen-reader
  testing, so the practical severity of a11y gaps varies by AT.
- **Narrow-viewport breakage** (Customer 360 at 375px, header overflow) is
  derived from the CSS as written, not observed in a resized browser.
- **Not cross-checked against `reference/`:** the BRSD/journey corpus that the
  `BR-xx`/`SCR-xxx`/`VAL-xxx` IDs cite was not consulted. Where this document
  reports a spec-vs-implementation divergence, the spec side comes from
  `public/config/*.json`; whether each entry was scoped into this rebuild cannot
  be determined from the code alone, and several divergences are explicitly
  documented in-code as product decisions.
- This app uses mock data (`mockDataEngine`, `public/mock-data/*.json`) with no
  real IDAM or server-side authorisation. All findings concern the client-side
  experience.

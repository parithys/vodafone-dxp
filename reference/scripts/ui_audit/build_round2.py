#!/usr/bin/env python3
"""Builds the round-2 consistency audit report (.md) and workbook (.xlsx) from findings_round2.json."""
import json, os, collections
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = ROOT + '/reference/outputs'
F = json.load(open(HERE + '/findings_round2.json'))
SEV = {'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3}
F.sort(key=lambda f: (SEV[f['sev']], f['id']))
DAYS = {'S': 1, 'M': 4, 'L': 12}
bysev = collections.Counter(f['sev'] for f in F)
_tracked = [f for f in F if f.get('status')]
n_tracked = len(_tracked)
n_fixed = sum(1 for f in _tracked if f['status'] == 'Fixed')
n_partly = sum(1 for f in _tracked if f['status'] == 'Partly')
n_open = sum(1 for f in _tracked if f['status'] == 'Open')
byarea = collections.Counter(f['area'] for f in F)
days = sum(DAYS[f['effort']] for f in F)
areas = ['Behaviour', 'Structure', 'Content', 'Visual', 'Data/config', 'Accessibility']

def table(rows):
    out = ['| ID | Sev | Effort | Status | Finding | Evidence (path:line) | Recommendation |', '|---|---|---|---|---|---|---|']
    for f in rows:
        status = f.get('status', 'Open')
        if f.get('resolution'):
            status += ': ' + f['resolution']
        out.append(f"| {f['id']} | {f['sev']} | {f['effort']} | {status} | {f['title']} | {f['evidence']} | {f['recommendation']} |")
    return '\n'.join(out)

sections = []
for a in areas:
    rows = [f for f in F if f['area'] == a]
    sections.append(f"### {a} ({len(rows)} findings)\n\n" + table(rows))
REGISTER = '\n\n'.join(sections)

md = f'''# UI Consistency Audit, Round 2 - VFQ DXP

Audit date: 2026-10-10 (after the round-1 remediation) · Scope: `src/`, `public/config`, `public/mock-data`, tests and tooling · Mode: report only; **the P0 and P1 items were then worked the same day - see "Status after the P0/P1 pass" below and the Status column of every table**

**Status after the P0/P1 pass ({n_fixed} fixed, {n_partly} partly, {n_open} open of the {n_tracked} tracked items: the 32 P0/P1 findings plus B-03).** Fixed means changed and checked with the type-checker and the automated suite; **seen working in the browser: A-30 (Select keyboard model), A-31 (actions menu), D-04 (not-found routes), V-03 (top bar at 1024), V-04 (aligned control row)** - the others (carousel, tooltip, leave-journey prompt, dark-mode tokens, error states) are not yet exercised in a browser. Partly means the shared piece exists and covers the cited cases, but not every call site. Open items need something this environment could not do: D-01 (the sandbox cannot create the repository-root `.github`), or a product decision: D-02 and D-03 (enforce role grants on routes and navigation, which would hide about 50 destinations from roles that see them today) and D-06 (which ID is canonical for the QA customers). Automated suite: 39 tests; lint and build pass; the capability inventory reports 0 bypass imports.
Companions: `UI_Consistency_Audit_Round2_Reference.xlsx` (register), `UI_Design_System_Gap_Analysis_Reference.md` (round 1; its findings are referenced as "round-1 X-nn" and not repeated unless still open).

---

## 1. Executive summary

Round 1 made the app **token-clean and structurally safer** (hex/rgba/white-alpha/z-index/duration literals: 0; dead tokens: 0; one status map; one formatter library; one table; the four accessibility P0s; guards in CI-ready tests). This round looked for what is **still inconsistent**, using six independent read-only audits: component APIs and code structure, behaviour and state, copy and terminology, layout and visual, config/routes/data/tests, and an accessibility re-audit.

**Result: {len(F)} findings - P0 {bysev['P0']}, P1 {bysev['P1']}, P2 {bysev['P2']}, P3 {bysev['P3']}** ({', '.join(f"{a} {byarea[a]}" for a in areas)}). Estimated effort {days} developer-days (S=1, M=4, L=12), before overlap.

**The pattern behind most findings.** The primitives are good; what is missing is the **second layer** that makes them hard to misuse:

| Missing layer | What it causes today |
|---|---|
| A shared async/mutation contract (`useAsyncData`, `useSubmit`, `FormDrawer`, `ConfirmDrawer`) | Screens differ on loading/empty/error, double-submit, failed saves that stick, discard-on-Escape, one-click destructive actions (B-03, B-05, B-06, B-09, B-10, B-11) |
| A single listbox/menu/popover primitive | Three listbox implementations, a P0 screen-reader defect in `Select`, a keyboard-inoperable actions menu, 11 click-outside listeners (S-08, A-30, A-31) |
| A typed data layer (`EntityMap`, typed wizard values) | 49 `as unknown as`, 164 `values.x as T`, 34 inline `list<{{...}}>`, five `Order` interfaces, a `createRecord` double-append (B-01, S-11) |
| A route/permission layer | No route guard, nav that ignores grants, unknown URLs not reaching `NotFound`, 33 of 50 feature keys unenforced (D-02, D-03, D-04) |
| A content standard and a display-name layer | Case, verbs, terms and raw catalogue names leaking into breadcrumbs and titles (X-01..X-08) |
| Container-aware layout and a control-height scale | The wizard sits in a frame 746px narrower than the viewport, so grids mis-fire; controls beside each other differ by 2-8px (V-02, V-03, V-04) |

**Highest-risk items (P0/P1)** - fix first, all small: the `Select` listbox for screen readers (A-30), `createRecord` aliasing (B-01), `leads[0]` fallback (B-02), sign-out dropping a journey (B-04), hard-coded `createdBy` (S-03), the import cycle (S-01), CI not running (D-01), no route guard (D-02), contradictory QA customer identities (D-06), prototype and requirement text on screen (X-06, X-07), raw exception text (X-09) and the 'Cancel' that cancels a ticket (X-02).

**Three of these were spot-checked by me against the code and data** (`leads[0]` fallback, hard-coded `createdBy`, customer id mismatches) and confirmed; `createRecord` aliasing was confirmed by reading `entityStore.ts` and `mockDataEngine.ts` but **not reproduced in a browser**. The other findings are as reported by the audits, each with `path:line`; counts are approximate.

---

## 2. Scorecard (current state)

| Dimension | Rating | Evidence |
|---|---|---|
| Design tokens | **Good** | 0 literal colours/z-index/durations/rounded-full; 0 dead tokens; guards in `tests/` |
| Component APIs | **Fair** | Handler contracts, prop vocabulary and 6 dead Button variants differ (S-05..S-07) |
| Code structure | **Fair** | 1 cycle, layering violations in both directions, 41 export warnings, untyped data layer (S-01, S-02, S-11, S-14) |
| Behaviour | **Fair/Poor** | No shared async/submit/overlay contracts; 7 of 9 journeys lack exit controls (B-05, B-06, B-15) |
| Content | **Fair/Poor** | 56/40 case split, overlapping verbs, prototype and requirement text visible (X-01..X-08) |
| Layout/visual | **Fair** | Title roles, control heights, wizard container widths, dark-mode contrast (V-01..V-09) |
| Routing/RBAC | **Poor** | Presentational RBAC, ungated nav, weak NotFound (D-02..D-05) |
| Data/test integrity | **Fair** | Contradictory QA identities, mock-data drift, thin tests (D-06, D-07, D-12) |
| Accessibility | **Fair** | 1 P0, 8 P1 open; round-1 P0s hold (A-30..A-43) |

---

## 3. What changed since round 1 (verified this round)

| Item | Round 1 | Now |
|---|---|---|
| Literal colours / z-index / durations / `rounded-full` | 111 / 25 / 10 / 60 | 0 / 0 / 0 / 0 |
| Dead tokens | 57 | 0 |
| Raw `<button>` / Button adoption | 131 / 64% | ~100 / ~72% |
| Raw `<table>` | 8 | 3 (documented key-value/legal tables, guard-listed) |
| Status maps / QAR formatters | 13 / 6 | 1 / `lib/format.ts` (but see X-12: bypassed in ~70 places) |
| Tests | 27 | 33 (token governance, literal ban, JSX-aware button type, raw-table guard) |
| Focus ring | ~1.5:1 box-shadow | 2px outline at ~4.8:1, forced-colours rule |
| Skip link / route titles / lookups by keyboard / summary below lg | absent | in place (this round's re-audit confirms the combobox semantics; gaps are P2) |
| `GridTable` | separate table | adapter over `DataTable` |

Metrics from `reference/scripts/ui_audit` re-run this round: 308 `.tsx` files / 41,148 lines; spacing utilities 2,416 and weight utilities 508 (now token-driven through `--spacing` and `--font-weight-*`); arbitrary lengths 58; `as unknown as` 44-49; build: 3 JS chunks over 300 kB.

---

## 4. Findings by dimension

{REGISTER}

---

## 5. Cross-cutting root causes and the single changes that fix many findings

| Change | Fixes | Effort |
|---|---|---|
| `useSubmit` + `FormDrawer` + `ConfirmDrawer` (sticky footer, dirty guard, scroll lock, Enter, destructive/reason policy) | B-06, B-07, B-09, B-10, B-11, B-14, A-43 (partly) | L |
| `useAsyncData` + `AsyncBoundary` + `useEntityById` + typed `EntityMap` | B-01, B-02, B-03, B-05, S-11, S-12, S-13 | L |
| `Listbox`/`Combobox` + `useOutsideClick` + `Menu` | A-30, A-31, A-41, S-08, S-12 (partly) | L |
| `FieldShell`/`FormField` (`useId`, required, error with role=alert, hint) | A-33, B-13, B-14, S-07 | M |
| `SelectableCard` + `SelectedTick` | A-32, V-07, S-08 | M |
| `displayName` in routes.json + content style guide + lint for case | X-01..X-05, X-08, X-10, X-11 | M |
| Container queries on the step card and page wrappers; control-height tokens | V-02, V-03, V-04, A-40 | M |
| Route guard (`RequireFeature`), nav gated on grants, `NotFound` fallbacks | D-02, D-03, D-04, D-05 | M |
| Move `ci.yml` to the repository root; add guards G1-G12 | D-01, D-12, S-01 (cycle test) | S-M |
| Strip prototype text, raw requirement text and raw exceptions from visible strings | X-06, X-07, X-09, B-20 | S |
| `lib/ids.ts`, `submitJourneyOrder`, order actor from the persona, `isClosedTicket` | S-03, S-04, S-09, S-10 | M |

---

## 6. Proposed standards (decisions embedded as defaults; the open ones are in section 9)

**Type roles** (matched to the dominant current usage; matches round 1 section 8): page h1 `--fs-h4` 24/bold/fg via `PageHeader` (hero and 404 may use `--fs-h3`; no `clamp`); card/panel/dialog h2 `--fs-h5` 20/bold; section h3 `--fs-body-lg` 18/semibold; h4 `--fs-body` 16/semibold; field label `--fs-label` fg-2; `dt` caption/muted, `dd` body/medium/fg; caption/helper `--fs-caption` fg-2 (muted for timestamps/placeholders); KPI `--fs-stat` 28/extrabold; button `--fs-btn`. Collapse `--fs-micro`, `--fs-tag`, `--fs-caption-upper`, `--fs-btn-compact` into caption.

**Control heights:** sm 32 · md 42 (field, button, select) · lg 48 (hero search, login) · IconButton 36/28 · top-bar round buttons 40 · checkbox/radio 18. `--field-height` becomes 42px; add `--field-height-lg`. `Button` gets a real `min-h` per size; `SearchField` gets `size`.

**Spacing:** page `p-8` with `PageHeader` as the only first child; cards `p-5` page-level, `p-4` dense, `p-6` wizard/modal; between cards `gap-6`, in-card stacks `space-y-4`; form grids `gap-4`; one left inset (32px) for bands and content.

**Containers:** wizard step card and page wrappers are `@container`; grids use `@md/@lg/@xl`, reserving `sm/md/lg/xl` for shell chrome. Card grids use `repeat(auto-fill, minmax(min(100%, 15rem), 1fr))`.

**Borders/radius/elevation:** cards and bands `--field-card-border`; tables and nav chrome `--border`; row dividers `--border-soft`. Radii card 16 / button+field 12 / sm 8 / pill / card-lg 20. Two elevation levels (popover/menu; modal/drawer/toast); smaller tooltip shadow; one `--scrim`.

**API contracts:** `onChange(value)` for non-native components (events only for `Input`/`Textarea`); `onSelect(item)`; `onRowClick` for rows; `value`/`onChange` for tabs; `helperText` for fields, `description` for cards/rows, `title` for overlays; `size: sm|md|lg` everywhere; `className` on every primitive root; `hide*` for default-on toggles.

**Behaviour:** every data-backed view renders loading, empty, error-with-retry; every mutation goes through `useSubmit`; forms use asterisk for required, validate on blur then on change, show Continue-blockers; overlays: Modal for short confirmations, Drawer (`FormDrawer`) for forms, Cancel left / primary right, dirty guard on Escape/X/backdrop, scroll lock; destructive actions confirm with a reason; one toast policy (success/info auto-dismiss, errors sticky, Escape owned by the top overlay).

**Content style guide:** sentence case; Save / Save changes / Save draft / Submit order; Cancel = dismiss only (name the object: "Cancel ticket"); Reject / Return for correction / Discard; View all / View details; Try again; customer (account holder), contact (person), user (staff login only), agent (staff member), add-on; "mobile number" in prose and "MSISDN" only in technical fields; British spelling; validation = one sentence ending in a period, no "Please"; errors = plain language plus next step, never exception text; empties = "No x yet." / "No x match your filters."; currency `QAR 1,500` via `formatQar`; dates and phones via the shared formatters; one mask scheme; screen names via `displayName`; no "demo/test/mock/prototype/BRSD/requirement id" in visible text; logical (RTL-safe) utilities.

---

## 7. Automated guards to add (ranked)

G1 router/nav/registry parity (incl. unknown URL -> NotFound) · G2 journey-catalogue validator · G3 mock-data referential integrity and one-identity-per-customer · G4 RBAC/nav/capability consistency · G5 route access guard + test · G6 config-vs-code parameter test (after `rule-parameters.json`) · G7 capability registry parity · G8 store persistence and sign-out test · G9 accessible-name guard for icon-only controls, plus `oxlint` jsx-a11y rules · G10 generated-artefact freshness · G11 bundle budget and demo-string check for `VITE_SHOW_DEMO=false` · G12 `oxlint --deny-warnings` with `eqeqeq`, `no-console`, `no-non-null-assertion`. Also: an import-cycle/layering test (S-01, S-02), a case-only-duplicate label check (X-01) and a physical-direction-utility ban for new code (X-15).

---

## 8. Prioritised plan

| Phase | Scope | Findings | Effort |
|---|---|---|---|
| **R0 - Quick wins (1-2 days each)** | Move `ci.yml` to the repo root; `NotFound` fallbacks; `leads[0]` fallback; `createRecord` double-append; order actor from persona; strip prototype/requirement/raw-exception text; 'Cancel ticket'; fix QA identities; remove dead Button variants; fix stale comments | D-01, D-04, B-02, B-01, S-03, X-06, X-07, X-09, X-02, D-06, S-06, S-15 | ~12 d |
| **R1 - Safety nets** | Guards G1-G5, G7, G9, G12; import-cycle fix and layering move (Drawer, offerCardParts to primitives) | D-02, D-03, D-05, D-12, S-01, S-02 | ~25 d |
| **R2 - Shared behaviour layer** | `useSubmit`, `useAsyncData`/`AsyncBoundary`, `FormDrawer`, `ConfirmDrawer`, `useUnsavedChangesGuard`, Continue-blockers | B-03..B-15 | ~45 d |
| **R3 - Shared UI layer** | `Listbox`/`Combobox`/`Menu`, `FieldShell`, `SelectableCard`, Tooltip/Icon/Spinner/DataTable/Tabs a11y fixes, Toast live regions | A-30..A-43, S-08 | ~40 d |
| **R4 - Layout and visual** | Container queries, control-height scale, top-bar fix, title roles, dark-mode solids, print/mirror | V-01..V-14, A-40 | ~20 d |
| **R5 - Content** | Style guide applied (case, verbs, terms), `displayName`, formatters, RTL utilities | X-01..X-15 | ~25 d |
| **R6 - Data and types** | `EntityMap`/typed wizard values, `submitJourneyOrder`, ids, rule parameters, mock-data normalisation, session timeout, store versions | S-09..S-13, D-07..D-11, D-13, D-14 | ~35 d |

Effort overlaps across phases (shared primitives remove work elsewhere), so the {days}-day total is an upper bound.

---

## 9. Decisions only you can make

1. Case convention: sentence case (recommended) vs Title Case - X-01 (round-1 L-06).
2. Route guard policy: enforce grants in the router, or label the persona matrix informational - D-02, D-03.
3. Order attribution: derive `createdBy` from the signed-in persona - S-03 (affects test fixtures that assume AGENT-* ids).
4. Whether uncatalogued routes (124 of 213) should resolve at all - D-14.
5. Session timeout length, or remove the comments that claim one - D-09.
6. Control and card border contrast value (round-1 A-05), link colour (round-1 C-05), primitive palette and naming (round-1 T-14/T-15) - still open.
7. Arabic: translate, or keep English-only and stop setting `lang=ar`/mirroring - X-15, A-43.

---

## 10. Method, limits and corrections

- Six read-only audits ran in parallel against the working tree on 2026-10-10 (component APIs/structure; behaviour; content; layout/visual; config/data/tests; accessibility). I re-ran my own metric scripts and spot-checked four claims directly (below). Everything else is as reported by the audits, with `path:line`, and counts are regex/grep estimates ("at least" or ±10%).
- **Verified by me:** `leads[0]` fallback; hard-coded `createdBy` values; the CUST-1001/1002/2001/9001 identity mismatches; the `createRecord` double-append logic (by reading, not running).
- **Not verified in a browser:** Enter bubbling from overlays (B-07), the top-bar overlap measurements and 1024px clipping figures (computed from classes; round 1 observed the visible symptoms), dark-mode contrast values (computed from hex), most accessibility findings (code reading, no screen-reader run).
- **Corrections to audit inputs:** one auditor's list of "known open" items was taken from round 1 and re-confirmed in code; items it found fixed are not repeated. `design-tokens.json` references in documentation are stale (D-13).
- Dated 2026-10-10; the working tree still holds ~370 uncommitted changes (including the round-1 work), and `git` could not be used from this sandbox to commit.
'''
open(OUT + '/UI_Consistency_Audit_Round2_Reference.md', 'w').write(md)

wb = Workbook()
ws = wb.active
ws.title = 'Summary'
for r in [['UI Consistency Audit - Round 2', ''], ['Date', '2026-10-10'], ['Findings', len(F)], ['P0', bysev['P0']], ['P1', bysev['P1']], ['P2', bysev['P2']], ['P3', bysev['P3']], ['Estimated effort (dev-days, upper bound)', days]] + [[a, byarea[a]] for a in areas]:
    ws.append(r)
ws['A1'].font = Font(bold=True, size=14)
ws.column_dimensions['A'].width = 44
hdr = PatternFill('solid', fgColor='1F2937')
fill = {'P0': 'F8B4B4', 'P1': 'FCD9A8', 'P2': 'FFF3B0', 'P3': 'D6E9F8'}
ws2 = wb.create_sheet('Finding register')
heads = ['ID', 'Area', 'Severity', 'Effort', 'Finding', 'Evidence (path:line)', 'Recommendation', 'Status', 'Resolution']
ws2.append(heads)
for c in ws2[1]:
    c.fill = hdr; c.font = Font(bold=True, color='FFFFFF')
for f in F:
    ws2.append([f['id'], f['area'], f['sev'], f['effort'], f['title'], f['evidence'], f['recommendation'], f.get('status', 'Open'), f.get('resolution', '')])
for row in ws2.iter_rows(min_row=2):
    row[2].fill = PatternFill('solid', fgColor=fill[row[2].value])
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical='top')
for i, w in enumerate([8, 14, 9, 8, 52, 90, 60, 9, 70], 1):
    ws2.column_dimensions[get_column_letter(i)].width = w
ws2.freeze_panes = 'A2'
ws2.auto_filter.ref = ws2.dimensions
wb.save(OUT + '/UI_Consistency_Audit_Round2_Reference.xlsx')
print('written', len(F), dict(bysev), days)

## Role master workbook — MUST be updated with every new feature or role

`reference/outputs/Persona_Feature_Applicability_Matrix_Reference.xlsx` is the
**single source of truth** for the 26 operational roles: Staff IDs, the demo
password, persona groups, business units, approach classification, capability
(action) gates, which implemented feature each role may reach, and which
sidebar destinations each role sees. It is **generated**, never hand-edited —
opening it in Excel and saving will silently rewrite it.

Seven sheets: **Roles & Credentials** (start here), **Applicability Matrix**
(feature × role), **Capabilities** (action gates), **Feature Inventory**,
**Navigation** (sidebar destinations per role, incl. product-line journey
categories), **Legacy Crosswalk** (66 → 26), **Legend & Method**.

**Whenever you add/remove a feature, screen, role or nav destination,
regenerate it in the same change** — it is not a follow-up task:

1. Edit the source, not the workbook: roles, grants, capabilities and Staff IDs
   live in `public/config/personas.json`; feature keys and their screen ids in
   `public/config/feature-catalogue.json`; nav destinations in
   `src/navigation/navManifest.ts` + `src/engines/navigationEngine.ts`, and
   product-line journeys in `src/navigation/journeyCatalogue.ts`.
2. Regenerate: `python3 reference/scripts/build_persona_feature_matrix.py`

Nothing in the workbook is restated by hand — the demo password is parsed out
of `staffIdRoleMap.ts`, the capability vocabulary out of `types/config.ts`, the
built-screen set out of `registerScreen()` calls, and the Navigation sheet out
of the nav manifest + approach map + journey catalogue. If you find yourself
typing a value into the script that already exists in source, parse it instead.

Rules the script enforces — do not work around them:

- Only *implemented* features appear as built. The built set is discovered from
  `registerScreen()` calls, the same registry the router uses to choose between
  a real screen and `<ScreenNotYetBuilt>`. A granted feature whose screens
  aren't registered shows as `Planned`, deliberately — it stays visible to
  indicate planned functionality rather than disappearing.
- A `✓` means `personas.json` actually grants that feature to that role.
  Nothing is inferred and nothing is hand-ticked. **Blank means deliberately
  not granted** — grants are exhaustive for the 26 roles. (This inverts the
  pre-2026-09-24 model, where a tick required an `rbac.json` evidence row and
  blank meant "the corpus never said".)
- The script **aborts** rather than emit a misleading workbook if: a capability
  is gated in code or granted in `personas.json` but missing from the
  `PersonaCapability` union in `types/config.ts`; a grant references an unknown
  feature key or permission level; a catalogue entry references a screen absent
  from `routes.json`; a Staff ID or role id is duplicated; a role binds an
  identity absent from `users-agents.json`; or the navigation source no longer
  parses to the expected shape (4 approaches, 20 manifest entries, 4 categories
  per product line).
- It **also aborts on app wiring that is broken rather than merely
  undocumented**, because a generated workbook would otherwise report broken
  wiring as working: a journey gated on a feature key that doesn't exist; a
  journey marked `available` whose screen isn't registered; a dashboard quick
  action targeting an unregistered screen; a nav destination with no matching
  `<Route path>` (it would fall through to `/:moduleSlug` and render "Module
  not found."); a declared search group with no searcher; a catalogued feature
  key granted to no role; or a role with zero grants.

  If it aborts, fix the source — that abort is the feature working. Every one
  of these guards has been negative-tested by deliberately breaking the source.

Superseded persona records (historical, **not** authoritative):
`reference/docs/VFQ_DXP_Personas_Reference.xlsx` → "Personas" (the 66-persona
model), and `reference/outputs/Test_Data_Reference.xlsx` → "Login
Credentials" / "Persona (Original)" / "Persona by Approach". The 66-persona
model, its RBAC evidence and the two columns unique to that workbook are
archived under `reference/blueprint/legacy/`.

⚠️ Those three sheets in `Test_Data_Reference.xlsx` — "Persona
(Original)", "Persona by Approach" and "ID Lookup (MOI Fetch)" — are **not
produced by `scripts/build_test_data_reference.py`**. The workbook on disk has
19 sheets; a regeneration writes 16 and silently drops those three. So despite
the "generated, never hand-edited" rule that applies to the role matrix above,
this particular workbook currently carries content the script cannot rebuild.
Re-create those sheets in the script before regenerating it, or the history
goes.

## Project structure

This directory (`vfq-dxp-app/`) is the single source of truth for the
application — it is fully self-contained (verified 2026-08-25: no import,
fetch, or config reaches outside this directory). `reference/` alongside
`src/`/`public/` holds distilled reconstruction documentation (requirements,
business rules, journeys, personas, screen catalogue, process diagrams,
source-confidence policy) that fed the app's construction but is not consumed
by it at runtime — treat it as background material, not part of the active
implementation, unless a task explicitly asks you to consult it.

The raw source corpus this documentation was built from — `data/`,
`Guided Journeys/`, `Workshop Recordings/` — lives one level up, at the
project root (sibling to this directory), not inside it. Citations inside
`reference/` documents of the form `data/<file>` refer to that root-level
`data/` folder, i.e. `../data/<file>` relative to this directory.

## Knowledge base

Before answering questions about the VFQ (Vodafone Qatar) stack modernization
project — workshops, business process reviews, business requirements specs
(BRSDs), business rules, customer forms, or Guided Journey UI walkthroughs —
read `reference/.knowledge/INDEX.md` first, then open only the specific
`reference/.knowledge/docs/<slug>.md` files the question requires. Do not
answer from the index one-liner alone when the question needs detail — open
the summary. Cite the slug in your answer so claims trace back to a source
document.

If `reference/.knowledge/INDEX.md` reports a document as low-confidence or
failed, say so rather than answering from it.

`../Guided Journeys/` files (one level up, at the project root) are
screenshot-driven UI walkthroughs. Plain text extraction (pandoc/markitdown)
recovers almost nothing from them — the content lives in embedded PNG
screenshots. As of 2026-08-21, all 39 of these documents have been
re-processed by extracting each `.docx`'s embedded images (it's a ZIP
container; images live under `word/media/`, true reading order comes from
`word/_rels/document.xml.rels` + the `r:embed` sequence in
`word/document.xml`) and viewing them directly, recovering full field-level
procedural detail — 38 are `high` confidence, 1 `medium`. If new files are
added to this folder later, or a fresh corpus has the same screenshot-only
problem, use this same image-extraction + direct visual reading approach
rather than relying on text extraction alone.

## Customer inventory - kept in sync with the app's data

`reference/outputs/Customer-Inventory.xlsx` is the test-customer contract: every customer on
its **Customers** sheet must be findable in the running app (Customer Search, ID lookup) with the
same name, nationality, segment, date of birth, mobile, ID type/number/expiry, and every customer
the app can find must be on the sheet. It is **generated**, never hand-edited.

Whenever you add or change customers (`public/mock-data/customers.json`,
`identity-documents.json`, `customer-contacts.json`, `nas-records.json`):

1. Seed from the script, not by hand: `python3 reference/scripts/build_customer_inventory.py --seed`
2. Regenerate the workbook: `python3 reference/scripts/build_customer_inventory.py`
3. Check they agree: `python3 reference/scripts/verify_customer_inventory_sync.py`
   (exits 1 and lists each difference; must print "In sync.")

## Capability Library - change a shared capability once

Every reusable capability (Customer Identification, Number Selection, Plan Selection, Payment, ...) has ONE implementation
under `src/capabilities/<Name>/`, listed in `src/capabilities/registry.json`. Journeys import from the barrel
(`src/capabilities/index.ts`), never a capability's parts. To change one, edit it there (or run the `update-capability`
skill) so every journey picks it up; then run `python3 reference/scripts/build_reusable_capabilities_inventory.py`,
which regenerates `consumers.generated.json` and the inventory workbook and must report 0 bypass imports. See
`src/capabilities/README.md`.

## Data & business-rule guardrails - read before classifying, filtering or deriving anything

The recurring defect here is code that invents its own reading of a record (a field that merely correlates in the sample data) and silently
drops or mislabels the rest. Example: a journey took the promotion code on an installed asset to say what the line is, then matched names
against the plan catalogue, and offered 1 of a customer's 20 postpaid lines. Rules:

1. Search for an existing definition before writing one. What kind of service/line something is: `classifyProductName` /
   `mobileLineTypeOfName` / `LIVE_SERVICE_STATUSES` in `src/engines/customerServicesEngine.ts` (the one Customer 360 uses). Reuse the
   engine, capability or model that already answers the question; do not add a second regex, `===` on a name/code, or `.find` by name.
2. Never infer a domain meaning from a field that correlates with it. Promotion/product codes, plan names and labels are not service
   types. Check the data model and an existing definition first; if there is no evidence, the value is unknown.
3. Unknown stays unknown: no `unknown -> postpaid / eligible / approved / active` defaults. Use an explicit state (`Other`,
   `undefined`) and keep the record visible.
4. Never validate a rule against records that rule selected. Validate it over the whole dataset (`public/mock-data`) against an
   expectation written independently of the code (a table of what each distinct value IS), and check BOTH false positives and false
   negatives.
5. Cover many-record and mixed cases, not one convenient customer (CUST-1001 is clean): zero lines, one, 20+, postpaid + prepaid,
   mobile + fibre/FWA, contradictory fields, null/unknown values. Add conservation checks (`offered + excluded = original`).
6. Do not fit a fix to a record (`CUST-xxxx`, one plan, one code). Fix the mechanism.
7. A shared definition changed means every consumer is re-verified (search the imports) before the change counts as done.
8. Do not call a rule correct until `npx tsc -b`, `npm run lint`, `npm test` and `npm run build` have actually run and passed.

`tests/classification.test.mjs` is the pattern (independent expected table, whole-population invariants), and `tests/assumptions.test.mjs`
guards against new ad-hoc classification of service names outside the engine.

## Build-time settings

`.env.example` documents the build flags. `VITE_SHOW_DEMO=false` hides demo-only UI (scanner simulators, specimen cards)
for a production build; it is shown by default.

## Tests

`npm test` runs the automated suite (`tests/*.test.mjs`, 151 tests, about 15 seconds, no extra dependencies - the npm registry
is not reachable from the build sandbox, so it uses `node:test`, Vite's own SSR loader and `react-dom/server`).
`tests/harness.mjs` loads the app's TypeScript through Vite with `fetch` and storage stubbed to read `public/`.

- `journeys.test.mjs`: sign-in, role navigation, customer search and Customer 360, identity validation, eligibility (age,
  blacklist, ID expiry), postpaid pricing and first bill, business rules, queue logic, RBAC grants, and the route catalogue.
- `ui.test.mjs`: Button / tabs / pager / field accessibility markup, and source guards (every `<img>` has alt, every raw
  `<button>` declares a `type` - checked with a brace-aware JSX walk, no red text links, no Tailwind radius utilities in
  components, no `console.log`, and no literal colours, `white/NN`, `color-mix()`, `z-N` or `duration-N` in `.ts`/`.tsx`
  outside `src/data/synthetic/`).
- `tokens.test.mjs`: design-token governance read from the CSS itself (`tests/tokenModel.mjs`) - every `var(--x)` is defined,
  no dead tokens, every raw-colour token has a dark value or an entry (with a reason) in `CONSTANT_ACROSS_THEMES`.
  `node tests/tokenModel.mjs` prints the dead / no-dark / undefined lists.

CI (`.github/workflows/ci.yml`, which must sit at the repository root to run) runs lint, `npm test` and `npm run build`.

- `architecture.test.mjs`: computed from the source's own import graph - no import cycles, and layers only import downward
  (primitives and domain never import capabilities, patterns, modules or workspace; components and capabilities never import modules
  or workspace; `lib/` imports nothing else in the app). Put shared pieces in the lower layer rather than reaching up.
- `journeyCatalogue.test.mjs`: `validateJourneyCatalogue()` - every journey's feature key, screen and path exists, and an
  `available` journey leads to a built screen or a served path. `screenName.test.mjs`: `screenDisplayName()` strips project-phase
  and vendor remarks from catalogue names; every surface that names a screen uses it.

Async actions use `src/hooks/useSubmit.ts` (`useSubmit` / `useSubmitGuard`: one at a time, failure becomes a toast, never stuck on
"Saving..."). Detail screens use `EntityMissing` + `useKindPending` so "loading", "failed" and "not found" are never confused. Filled
status colours that carry a white label use `--success-solid` / `--danger-solid`, not `--success` / `--danger`. Control heights come
from `--control-h-sm/md/lg`. The New Connection wizard lives at `/mobile/start-connection` (`/new-connections` is the New Connections hub).

Add a test here when you change a rule the journeys depend on. Browser end-to-end tests are not set up (they need Playwright,
which the sandbox cannot install).

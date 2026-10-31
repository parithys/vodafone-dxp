# Application Reconstruction Package (Phase 38)

Machine-readable configuration/data files generated directly from the Stage A/B/C catalogues, plus the architecture documents that explain how to consume them. This is the bridge between "evidence-backed documentation" (`blueprint/*.md`) and an actual buildable app.

## Layout

```
reconstruction-package/
├── config/            # generated JSON — RBAC, business rules, validation rules, personas, routes, module hierarchy, domain schema
├── mock-data/         # illustrative seed data for all 77 mockable entities (see mock-data/README.md)
└── docs/              # architecture: frontend-architecture.md, folder-structure.md, reusable-patterns.md
```

## config/*.json — generation source

| File | Records | Generated from |
|---|---|---|
| `routes.json` | 213 | `../screens.md`, assigned to modules by keyword-matching against `../module-hierarchy.md` capability lists (deterministic, coarse — see `docs/frontend-architecture.md` §9 caveat) |
| `module-hierarchy.json` | 16 modules | `../module-hierarchy.md`, re-exported with slugs + computed screen counts |
| `rbac.json` | 145 | `../rbac-matrix.md`, flattened to one row per persona×screen entry |
| `personas.json` | 66 | `../personas.md`, flattened |
| `business-rules.json` | 346 | `../business-rules.md`, each tagged with a heuristic `engineHint` (threshold/restriction/mandatory-field/procedural) for the Rule Engine |
| `validation-rules.json` | 418 | `../validation-catalogue.md`, flattened |
| `domain-schema.json` | 83 | `../domain-model.md`, flattened — feeds the Mock Data Engine's entity shapes |
| `design-tokens.json` | 106 | `docs/design-system.md`, extracted directly from a user-supplied Vodafone design system file (colors, typography, spacing, radius, elevation, motion) — **Explicit**, not a re-export of the requirements corpus like the rows above |

All of these (except `design-tokens.json`, sourced separately — see below) are **mechanical re-exports** of already evidence-cited blueprint content into a shape an app can `import`/`fetch` directly — no new claims are introduced here. For the evidence trail (source document + quote) behind any given entry, look up its ID in the corresponding `blueprint/*.md` file.

## mock-data/*.json

Synthetic seed data (Classification: Assumed) — see `mock-data/README.md` for the full explanation and coverage table (74 files, 226 records, 100% of the 77 mockable domain entities). Not evidence, by design: there is no real customer data in the source corpus.

## docs/

- **`frontend-architecture.md`** (Phase 39) — tech stack, the 5 engines (Persona/Rule/Validation/Mock-Data/Configuration), state management, design system summary, build sequencing.
- **`folder-structure.md`** (Phase 38) — concrete repo layout implementing the architecture.
- **`reusable-patterns.md`** (Phase 19/20) — 18 evidence-backed reusable UI patterns derived from all 213 screens, with build priority.
- **`design-system.md`** (Phase 21) — real, evidence-backed design tokens (colors, typography, spacing, radius, elevation, motion) extracted from a user-supplied Vodafone design system file — no longer a placeholder.

## Where to start

Read `../../ai-coding-agent-implementation-guide.md` first — it sequences all of `blueprint/` (Stages A–D) into an actual build order and tells you which file to open for which decision.

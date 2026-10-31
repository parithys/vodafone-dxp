# AI Coding Agent Implementation Guide (Final Deliverable 41)

**Purpose:** enable an AI coding agent (or a human team) to build the Vodafone Qatar DXP platform — a production-ready, front-end-only React application simulating all workflows, business rules, validations, permissions, and state transitions with no backend — using only this `blueprint/` folder, without access to the original 83-document corpus or the `.knowledge/` index.

**If you are an AI coding agent reading this to start implementation, read in this order:** this guide → `reconstruction-package/docs/frontend-architecture.md` → `reconstruction-package/docs/folder-structure.md` → `reconstruction-package/docs/reusable-patterns.md` → then dip into the specific catalogue files below as you build each module, per the build sequence in §5.

---

## 1. What this platform is (evidence summary)

Vodafone Qatar's CRM/CVM "Stack Modernization" program is replacing a legacy Siebel/ECR/VSA stack with a new DXP ("Digital Experience Platform") / Open UI-based agent platform. This blueprint reconstructs its requirements from 83 source documents (workshop transcripts, BRSDs, business-rule extracts, customer forms, and screenshot-driven guided-journey walkthroughs) into:

| Catalogue | Count | File |
|---|---|---|
| Personas | 66 | `personas.md` |
| Domain entities | 83 | `domain-model.md` |
| Requirements | 308 | `requirements.md` |
| User journeys | 111 | `journeys.md` |
| Screens | 213 | `screens.md` |
| Business rules | 346 | `business-rules.md` |
| Module hierarchy | 16 modules | `module-hierarchy.md` |
| Fields | 970 | `field-inventory.md` |
| Workflow steps | 945 (156 scenario groupings) | `workflow-execution-matrix.md` |
| RBAC entries | 145 (61/66 personas) | `rbac-matrix.md` |
| Validation rules | 418 | `validation-catalogue.md` |
| Traceability links | 287/308 requirements linked | `traceability-matrix.md` |
| Verified conflicts | 2 (of 15 candidates) | `conflict-report.md` |
| Gap findings | see below | `gap-analysis.md` |
| Module readiness | 2 Fully / 11 Partially / 2 High Risk / 2 Missing | `build-readiness.md` |
| Visual diagrams (App Architecture, IA, ERD) | 3 diagrams + stakeholder docx | `diagrams/` |
| Notification Framework | 24 SMS templates + 79 in-app error messages | `notification-catalogue.md` |
| Exception Catalogue | 11 verbatim negative scenarios + 130 workflow exceptions + 40 permission restrictions | `exception-catalogue.md` |
| Screen State Model | 41/83 entities with evidenced lifecycle states | `screen-state-model.md` |
| Channel Architecture, Platform Sitemap, Persona Matrix | 8 channels; 213 screens; 66 personas | `channel-architecture.md`, `platform-sitemap.md`, `persona-matrix.md` |
| Component/Screen-Behaviour/Search/Dashboard/Responsive/Feature-Toggle catalogues | see `coverage-report.md` §3 for the full list | `component-catalogue.md` + 5 more |
| Test Scenario Catalogue | 775 scenarios, 308/308 requirements (100%) covered | `test-scenario-catalogue.md` |
| **Coverage Report** | **Final completeness check — read this to see what's covered vs. still gapped** | `coverage-report.md` |

**Every item in every catalogue cites its source document slug and an evidence quote.** Where this guide or the reconstruction package makes an architectural decision *not* evidenced by the corpus (tech stack, mock data values), it is explicitly marked **Assumed** — do not treat Assumed content with the same authority as Explicit/evidence-cited content. The design system is an exception to the "not evidenced" pattern: it's Explicit, sourced from a separate, full Vodafone design-system project the user supplied (tokens + 12 real React components with TypeScript prop APIs) rather than the requirements corpus — see `reconstruction-package/docs/design-system.md`, but read its §0 first: that source is itself explicit it's a third-party brand *approximation*, not Vodafone's own production files.

## 2. The four-stage evidence pipeline (how this blueprint was built)

Understanding this helps you judge how much to trust any given catalogue entry:

- **Stage A** (`personas.md`, `domain-model.md`, `requirements.md`, `journeys.md`, `screens.md`, `business-rules.md`, `module-hierarchy.md`): 11 agents each read a batch of the 83 `.knowledge/docs/*.md` summaries and extracted these 6 categories; results were deduplicated and synthesized into canonical catalogues.
- **Stage B** (`field-inventory.md`, `workflow-execution-matrix.md`, `rbac-matrix.md`, `validation-catalogue.md`): the same 83 docs were re-read for deeper field-level and step-level detail Stage A's screen/journey-summary granularity missed.
- **Stage C** (`traceability-matrix.md`, `conflict-report.md`, `gap-analysis.md`, `build-readiness.md`): cross-cutting analysis — deterministic joins across Stage A/B data, plus targeted LLM reasoning (journey-coverage matching against the master 165-row CRM catalog, conflict detection with adversarial verification against original source files, per-module readiness assessment).
- **Stage D** (this guide + `reconstruction-package/`): architectural synthesis translating the above into a buildable app — config JSON, mock data, component/pattern architecture. This stage is design work, not extraction; treat it as a strong starting recommendation, not a fact reconstructed from evidence.

## 3. Non-negotiable constraint

**No APIs, backend services, databases, middleware, authentication servers, microservices, or third-party integrations.** Every workflow, rule, validation, permission, calculation, search, approval, escalation, notification, and state transition must be simulated in front-end logic. See `reconstruction-package/docs/frontend-architecture.md` for the architecture that achieves this (Mock Data Engine standing in for a backend, Rule/Validation Engines standing in for server-side business logic, Persona Engine standing in for authentication/authorization).

## 4. Architecture at a glance

```
Persona Engine → RBAC filtering → Navigation/Routes → Screen Components
                                                              │
                            ┌─────────────────────────────────┼─────────────────────────┐
                            ▼                                 ▼                         ▼
                    Validation Engine                  Rule Engine              Mock Data Engine
              (validation-rules.json)             (business-rules.json)      (mock-data/*.json)
                            └─────────────────────────────────┴─────────────────────────┘
                                                    Zustand stores (+ localStorage/IndexedDB)
```

Full detail: `reconstruction-package/docs/frontend-architecture.md` (tech stack, 5 engines, state management, design system caveat) and `reconstruction-package/docs/folder-structure.md` (concrete repo layout). Visual renderings of this architecture, the module/screen navigation hierarchy, and a core-entity ERD are in `diagrams/` (`diagrams/VFQ-DXP-Architecture.docx` is the single stakeholder-ready document containing all three).

**Screens are built from 18 reusable patterns, not 213 bespoke components** — see `reconstruction-package/docs/reusable-patterns.md`. Read this before writing any screen component; most of what looks like "213 screens to build" is actually "~18 patterns composed 213 ways."

## 5. Recommended build sequence

Sequenced by `build-readiness.md`'s evidence-density assessment — build where the ground truth is solid first, defer where it isn't rather than guessing:

### Phase 1 — Foundation (do this regardless of which module you build first)
1. Scaffold per `reconstruction-package/docs/folder-structure.md`.
2. Implement the Configuration Engine (`configEngine.ts`) loading all of `reconstruction-package/config/*.json`.
3. Implement the Mock Data Engine seeded from `reconstruction-package/mock-data/*.json`.
4. Implement the Persona Engine + a dev persona switcher (no real auth — see `frontend-architecture.md` §8).
5. Generate the router from `config/routes.json`.
6. Build Pattern 1 (Guided Multi-Step Wizard) and Pattern 2 (ID Lookup) from `reusable-patterns.md` — these unlock the most screens.

### Phase 2 — Fully Defined modules (`build-readiness.md`)
**Lead Management, Mobile Prepaid.** Zero orphan requirements, zero step-detail gaps, zero underspecified entities in these modules — build directly from `journeys.md` + `workflow-execution-matrix.md` + `field-inventory.md` for these modules' screens without needing new assumptions.

### Phase 3 — Partially Defined modules (11), richest-evidenced first
Fixed Line/Fibre (49 screens) → FWA/5G Home (44 screens) → Mobile Postpaid (22 screens) → Enterprise/IoT/B2B → Order Management → MNP/FNP Porting → Identity & Customer Management → SIM & Number Management → Trouble Ticketing & Complaints → Pre-to-Post Migration. Each has real journey/requirement/entity coverage but some gaps (`gap-analysis.md` enumerates exactly which journeys lack step detail, which entities are underspecified, per module) — build the evidenced parts fully, and mark the gaps with visible `// TODO: not evidenced, see gap-analysis.md` comments rather than inventing behavior. **Stage K re-mined the original source documents for every one of these gaps** — most now have real recovered detail merged directly into `journeys.md`/`screens.md`/`domain-model.md`/`workflow-execution-matrix.md`/`field-inventory.md`; a small remainder is still genuinely gapped with a labeled Recommended Assumption in `gap-resolution-stage-k.md` — treat those, and only those, as needing business-owner confirmation before building on top of them.

**Before building Fixed Line/Fibre specifically:** resolve or explicitly stub the fibre outstanding-dues threshold conflict (`conflict-report.md` Conflict 1) — it blocks deterministic credit-check logic.

**Before building any mobile-postpaid ZSB/address capture logic:** resolve or explicitly stub the ZSB-mandatory-for-mobile conflict (`conflict-report.md` Conflict 2).

### Phase 4 — Missing modules
**Billing & Adjustments, CAF/Attachments & Forms** — these have real requirements (19 and 14 respectively) but **zero linked journeys** (`gap-analysis.md` §7) — the underlying capability is discussed at the requirements level but never walked through step-by-step anywhere in the corpus. Build the screen shells and RBAC per `screens.md`/`rbac-matrix.md`, but flag every business rule/calculation for business-owner confirmation rather than inventing the missing workflow.

### Phase 5 — High Risk modules
**Access/Roles & Approval Governance, Platform Governance & Architecture** — cross-cutting concerns where `build-readiness.md` found requirements are heavily orphaned (20/22 and 8/8 respectively) and where an AI coding agent would otherwise have to invent significant behavior. Build last, and treat every decision here as needing explicit business sign-off.

## 6. What to do when you hit a gap

Per `CLAUDE.md`'s evidence model — **never silently assume**. When a screen/journey/rule you need isn't in the catalogues:

1. Check `gap-analysis.md` first — it may already be an enumerated, known gap (journeys without step detail, personas without RBAC, underspecified entities, orphan requirements, screens without fields, modules without journeys). Most of these were re-mined against original sources in Stage K — check `gap-resolution-stage-k.md` for the item's specific resolution (recovered detail, reclassified as not-applicable, or a labeled Recommended Assumption) before assuming nothing exists.
2. If it's a known gap with a Recommended Assumption: implement that assumption exactly as labeled, comment `// Assumed (Stage K): see gap-resolution-stage-k.md §<item-id>`, and do not present it as evidence-backed. If it's a known gap with no Recommended Assumption (needs a business-owner decision): implement the closest evidenced analog, comment `// Gap: see gap-analysis.md §N`, and do not present the implementation as evidence-backed.
3. If it's a new gap not yet enumerated: add it to `gap-analysis.md` following the existing format (source location, impact, recommended approach) rather than silently inventing and moving on.
4. Never invent a screen, journey, validation, permission, or business rule not evidenced anywhere in `blueprint/` — the one exception is mock data values (`reconstruction-package/mock-data/`), which are intentionally synthetic by design.

## 7. Known conflicts requiring resolution before certain modules are built

See `conflict-report.md` for full detail and verification notes:
1. **Fibre outstanding-dues threshold** (High severity) — Fibre BRSD's own Open Items log admits contradictory guidance (fibre-specific vs. same-as-mobile threshold). Blocks: Fixed Line/Fibre credit-check logic.
2. **ZSB mandatory for mobile?** (Medium severity) — legacy Activation Process manual says yes; a modernization workshop transcript says no (FWA/fixed only). Blocks: mobile activation address-capture logic.

## 8. Known limitations of this blueprint (read before treating any file as ground truth)

- Business-rule and field deduplication used name/keyword matching, not full semantic understanding — some paraphrased duplicates may remain across `business-rules.md`, `validation-catalogue.md`, and `field-inventory.md`.
- `traceability-matrix.md` has two documented coarseness caveats (module-hierarchy all-pairs bundling can over-link; keyword-overlap rule linking can under-link) — read its intro note before treating a missing link as a confirmed absence.
- Journey-catalog "coverage" initially looks alarming (132/165 unmatched against the master CRM catalog) but `gap-analysis.md` §1 shows only 1 of 165 is an actual missed *User Journey* — the rest are Workflow/Task/View/Action/Access-Permission rows out of this blueprint's journey-extraction scope by design.
- The pre-existing `data/Vodafone_Requirement_Hierarchy_Traceability_Template.xlsx` (815 rows, independent ID scheme) was deliberately **not** merged into this blueprint's REQ-xxx/UJ-xxx/BR-xxx ID scheme — see `gap-analysis.md` §8. Treat `blueprint/` as authoritative going forward unless the team decides otherwise.
- Stage D's architecture (`reconstruction-package/`) is a design recommendation, not evidence, with one exception: the design system (`design-system.md`) is now real and Explicit, sourced from a full user-supplied Vodafone design-system project — 106 tokens (colors/type/spacing/radius/motion) plus 12 real components with full prop APIs (Button, Input, TagPill, Card, etc.). Two caveats carry forward: (1) that source is itself a third-party brand approximation, not Vodafone's real production files — logo/font/icons are explicit placeholders; (2) it's built for a marketing website, not an enterprise CRM, so only its tokens (not most of its components) apply directly to the DXP's actual screens — see `component-catalogue.md` §5 for the reconciliation.
- Route-to-module assignment (`config/routes.json`) is a deterministic keyword match, not a confirmed information architecture — expect some screens to need manual re-bucketing.
- `build-readiness.md`'s per-module orphan-requirement/gap counts (Phase 4/5 above) predate Stage K's gap re-mining and have not been recalculated — treat them as an upper bound on remaining risk per module, not the current exact count; `gap-analysis.md` and `gap-resolution-stage-k.md` are the current source of truth for what's actually still gapped.
- **Resolved:** all 77 of 83 domain entities that are mockable business records now have seed mock data (`reconstruction-package/mock-data/README.md`) — 100% of the mockable set (the remaining 6 are meta/reference constructs covered elsewhere, not gaps).
- **Resolved (Stage K):** of the 237 items flagged across `gap-analysis.md` §2/§4/§5/§6 (16 journeys, 27 entities, 109 requirements, 85 screens), 185 (78%) were re-mined from original source documents and recovered real new evidence, 31 were reclassified as categorically not-applicable, and 21 remain genuinely gapped with a labeled Recommended Assumption — see `gap-resolution-stage-k.md` for the full per-item record. Nothing was fabricated as if it were evidenced.

## 9. Coverage validation (Phase 40)

Every requirement, persona, journey, workflow, screen, rule, and validation discovered in this corpus has at least one of: a module assignment (`module-hierarchy.md`), a traceability link (`traceability-matrix.md`), or an explicit gap entry (`gap-analysis.md`) explaining why it doesn't. Nothing discovered during Stages A–C is silently dropped in Stage D — every catalogue file listed in §1 is referenced by at least one part of `reconstruction-package/`.

| Coverage question | Answer | Evidence |
|---|---|---|
| Does every module have build-readiness guidance? | Yes | `build-readiness.md`, 16/16 modules |
| Does every screen have a route? | Yes | `config/routes.json`, 213/213 |
| Does every persona have menu-visibility rules (RBAC or explicit "no entries")? | Yes | `rbac-matrix.md` (61 personas) + `gap-analysis.md` §3 (5 personas explicitly flagged as having none) |
| Does every business rule have a place in the Rule Engine's catalogue? | Yes (catalogue); No (implementation — by design, phased) | `config/business-rules.json` (346/346 catalogued), `frontend-architecture.md` §5 (implementation is incremental, prioritized) |
| Is every known gap tracked? | Yes | `gap-analysis.md`, 8 sections covering journeys/personas/entities/requirements/screens/modules/traceability — most re-mined to real evidence or a labeled assumption in `gap-resolution-stage-k.md` |

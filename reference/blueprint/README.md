# Blueprint Index — Stages A through K

Evidence-backed reconstruction of the Vodafone Qatar DXP (Digital Experience Platform), built from the 83-document `.knowledge/docs/` corpus plus, from Stage J onward, targeted direct reads of original source files under `data/`. Every catalogue below cites its source document slug(s) and an evidence quote per item, with an Explicit/Inferred/Assumed classification and a confidence score — see `CLAUDE.md`'s evidence model. `data/` is treated as read-only throughout this engagement; all derived work lives here in `blueprint/`.

If you are an AI coding agent starting implementation, do not start here — start at [ai-coding-agent-implementation-guide.md](ai-coding-agent-implementation-guide.md), which sequences everything below into a build order.

## Stage A — Foundational Catalogues

| Deliverable | Canonical items | File |
|---|---|---|
| Persona Catalogue | 66 | [personas.md](personas.md) |
| Domain Model & Entity Catalogue | 83 | [domain-model.md](domain-model.md) |
| Requirement Consolidation | 308 | [requirements.md](requirements.md) |
| User Journey Catalogue | 111 | [journeys.md](journeys.md) |
| Screen Inventory | 213 | [screens.md](screens.md) |
| Business Rule Catalogue | 346 | [business-rules.md](business-rules.md) |
| Module Hierarchy | 16 | [module-hierarchy.md](module-hierarchy.md) |

**Method:** all 83 `.knowledge/docs/*.md` summaries were split into 11 batches; one agent per batch extracted personas, entities, requirements, journeys, screens, and business rules with mandatory source_slug + evidence quote + classification + confidence per item. Raw items were then synthesized per category (duplicates merged, all contributing sources preserved, canonical IDs assigned) — the business-rules category (378 raw items) exceeded a single synthesis call's output budget and was chunked into 8 batches of ~50, synthesized independently, then deduplicated by normalized name in deterministic code. A module hierarchy (Platform > Module > Sub-Module > Feature > Capability) was derived last, with every journey and requirement ID required to be referenced by at least one feature.

## Stage B — Field / Workflow / RBAC / Validation Normalization

| Deliverable | Canonical items | File |
|---|---|---|
| Field Inventory | 970 (from 1,047 raw) | [field-inventory.md](field-inventory.md) |
| Workflow Execution Matrix | 945 | [workflow-execution-matrix.md](workflow-execution-matrix.md) |
| RBAC Matrix | 145 | [rbac-matrix.md](rbac-matrix.md) |
| Validation Catalogue | 418 | [validation-catalogue.md](validation-catalogue.md) |

**Method:** fields and workflow steps were re-extracted at finer grain from the same corpus and grouped under free-text screen/journey names (not force-mapped to Stage A's SCR-xxx/UJ-xxx IDs, to avoid mis-linking similarly-named but distinct screens/journeys). RBAC entries were normalized strictly from each persona's `accessible_screens`/`accessible_actions`/`restricted_features` free text in `personas.md`. The Validation Catalogue is a union of Stage A's Validation-type Business Rules and newly-extracted field-level validation rules/error messages, cross-linked back to their originating BR-xxx or FLD-xxx entry.

## Stage C — Cross-Cutting Analysis (Conflicts, Gaps, Traceability, Coverage, Build Readiness)

| Deliverable | Summary | File |
|---|---|---|
| Requirement Traceability & Reverse Traceability Matrix | Req ↔ Journey/Screen/Rule/Persona joins | [traceability-matrix.md](traceability-matrix.md) |
| Gap Analysis | 109 orphan requirements, 16 journeys w/o step detail, 85 screens w/o fields, 27 underspecified entities (original count — see Stage K below for resolution) | [gap-analysis.md](gap-analysis.md) |
| Conflict Report | 15 new candidates found, 2 survived adversarial verification, 4 corpus-level carried forward | [conflict-report.md](conflict-report.md) |
| Coverage Report | Aggregate coverage across Module/Route/Component/Mock Data/Rule/Workflow/Test Scenario | [coverage-report.md](coverage-report.md) |
| Build Readiness Assessment | Fully Defined: 2 · Partially Defined: 10 · High Risk: 2 · Missing: 2 (by module) | [build-readiness.md](build-readiness.md) |

**Method:** the traceability matrix is a mechanical, deterministic join over already-evidenced Stage A/B data — module-hierarchy feature co-occurrence for req↔journey, keyword-overlap on requirement name/description text for req↔rule (a first version used "shares a source document" as the signal and produced a false-positive explosion; replaced with keyword-overlap, threshold ≥2 shared content tokens). Conflict candidates were found by scanning requirements/business rules module-by-module, then adversarially verified by a second, independent agent instructed to try to *refute* each one against the original source files before acceptance. Coverage Report and Build Readiness are pure aggregations/classifications over counts already computed and cited elsewhere in the blueprint — no new extraction.

## Stage D — Front-End Application Blueprint (Reconstruction Package + AI Coding Agent Guide)

| Artifact | Records | File |
|---|---|---|
| Routes | 213 | `reconstruction-package/config/routes.json` |
| Module Hierarchy | 16 | `reconstruction-package/config/module-hierarchy.json` |
| RBAC | 145 | `reconstruction-package/config/rbac.json` |
| Personas | 66 | `reconstruction-package/config/personas.json` |
| Business Rules | 346 | `reconstruction-package/config/business-rules.json` |
| Validation Rules | 418 | `reconstruction-package/config/validation-rules.json` |
| Domain Schema | 83 | `reconstruction-package/config/domain-schema.json` |
| Design Tokens | 106 | `reconstruction-package/config/design-tokens.json` (upgraded to real values in Stage I — see below) |

Plus architecture docs: [frontend-architecture.md](reconstruction-package/docs/frontend-architecture.md) (tech stack, 5 engines, state management, build sequencing), [folder-structure.md](reconstruction-package/docs/folder-structure.md), [reusable-patterns.md](reconstruction-package/docs/reusable-patterns.md) (18 evidence-backed reusable UI patterns across all 213 screens, with build priority), and [ai-coding-agent-implementation-guide.md](ai-coding-agent-implementation-guide.md) — Final Deliverable 41, the build-order entry point tying every stage below together.

**Method:** all `config/*.json` files (except `design-tokens.json`) are mechanical re-exports of already-evidence-cited Stage A/B/C content into an app-consumable shape — no new claims introduced. For the evidence trail behind any entry, look up its ID in the corresponding `blueprint/*.md` file. See [reconstruction-package/README.md](reconstruction-package/README.md) for the full layout.

## Stage E — Diagrams

| Diagram | File |
|---|---|
| Technical Architecture | `diagrams/technical-architecture.png` |
| Information Architecture | `diagrams/information-architecture.png` |
| Entity-Relationship Diagram (core domain entities) | `diagrams/entity-relationship-diagram-core-domain-entities.png` |
| Combined architecture document | `diagrams/VFQ-DXP-Architecture.docx` |

**Method:** rendered via mermaid-cli/Puppeteer from `diagrams/architecture-spec.json`. Two issues hit and fixed during this stage: (1) Puppeteer's Chrome auto-detection failed on this machine's actual cache layout, fixed by setting `PUPPETEER_EXECUTABLE_PATH` manually; (2) the first Information Architecture render (`graph TD`, all 16 modules + sub-module leaves) came out at 15,828×957px — illegible. Fixed by dropping sub-module leaf nodes from the diagram (kept in the sitemap table instead) and switching to `graph LR`, yielding a legible 1,548×5,898px tree.

## Stage F — Notification, Exception & Screen State Catalogues

| Deliverable | Summary | File |
|---|---|---|
| Notification Framework | 39 SMS templates + 79 in-app error messages + confirmation-dialogue patterns | [notification-catalogue.md](notification-catalogue.md) |
| Exception Catalogue | Validation/permission/workflow/technical-interruption failures | [exception-catalogue.md](exception-catalogue.md) |
| Screen State Model & Entity State Transitions | 41/83 entities have explicit lifecycle states; generic UI states are Assumed | [screen-state-model.md](screen-state-model.md) |

**Method:** each deliverable reuses already-evidenced Stage A/B data plus targeted direct reads of specific original files (e.g. `data/SMS Templates.xlsx`, read directly for its Automatic/Lead-Automated/Other-Automated sheets). Screen State Model keeps two distinct things separate on purpose: genuinely-evidenced entity lifecycle states (§1, from `domain-model.md`) vs. an Assumed generic UI-state generalization (§2, since the corpus never documents a named screen-state model as such).

## Stage G — Channel Architecture, Platform Sitemap & Persona Matrix

| Deliverable | Summary | File |
|---|---|---|
| Channel Architecture | Desktop / Tablet / Desktop-Vanilla / CBU / EBU taxonomy | [channel-architecture.md](channel-architecture.md) |
| Platform Sitemap | Full 16-module × 213-screen × 213-route listing | [platform-sitemap.md](platform-sitemap.md) |
| Persona × Module cross-tab | Complements `rbac-matrix.md` with a simplified grid | [persona-matrix.md](persona-matrix.md) |

**Method:** Channel Architecture draws primarily from the Consumer Activation Process & Procedure manual's explicit channel enumeration plus the master CRM Journey catalog's channel columns. The Persona Matrix caught and fixed a numeric-consistency bug: "36 personas absent from the module cross-tab" initially looked inconsistent with "5 personas with zero RBAC evidence" elsewhere — resolved by computing three distinct, genuinely different tiers: 30 module-mapped, 31 evidenced-but-unmapped (real RBAC evidence, just not module-attributable), 5 zero-evidence. A blank cell means *no evidence*, never *no access*.

## Stage H — Remaining UX/QA Deliverables

| Deliverable | Summary | File |
|---|---|---|
| Screen Behaviour Catalogue | User Actions/Success/Failure/Validation/Navigation flows for all 213 screens | [screen-behaviour-catalogue.md](screen-behaviour-catalogue.md) |
| Search, Filter & Sort Framework | 13 screens w/ search, 5 w/ filter, 1 w/ sort — thinly evidenced beyond that | [search-filter-framework.md](search-filter-framework.md) |
| Dashboard Analytics Framework | 5 of 11 "Dashboard"-type screens are true analytics dashboards; rest are module launchers | [dashboard-analytics-framework.md](dashboard-analytics-framework.md) |
| Responsive Behaviour Catalogue | Desktop vs. Tablet divergence; mobile phone form-factor not evidenced | [responsive-behaviour-catalogue.md](responsive-behaviour-catalogue.md) |
| Feature Toggle Catalogue | Thinnest-evidenced deliverable — Current/Target-state pairs used as the nearest analog | [feature-toggle-catalogue.md](feature-toggle-catalogue.md) |
| Test Scenario Catalogue | 775 scenarios total (493 module-level + 213 Navigation + 40 Security + 29 Boundary); 308/308 requirements referenced | [test-scenario-catalogue.md](test-scenario-catalogue.md) |
| UI Component Catalogue | Primitive + domain component tiers derived from field/screen-type distributions | [component-catalogue.md](component-catalogue.md) |

**Method:** these deliverables were run one-by-one, each reusing already-evidenced Stage A/B/C/F/G data. Where a deliverable's underlying phase is thinly evidenced in the corpus by nature (search/filter, feature toggles), the document says so explicitly rather than inventing coverage. The 16-module Test Scenario batch ran as one agent per module, each required to reference every requirement ID in its module at least once — one module (Order Management) initially returned degenerate placeholder scenarios ("Test"/"test" filler), caught by an automated post-hoc scan and fixed via a targeted retry that produced 24 real, well-evidenced scenarios. Navigation/Security/Boundary scenario sets are mechanical derivations of `routes.json`/`rbac-matrix.md`/`business-rules.md` needing no LLM judgment.

## Stage I — Design System (real, evidence-backed tokens)

| Deliverable | File |
|---|---|
| Design tokens (colors, typography, spacing, radius, elevation, motion) | `reconstruction-package/docs/design-system.md`, `reconstruction-package/config/design-tokens.json` (106 tokens) |
| Component catalogue reconciliation | [component-catalogue.md](component-catalogue.md) §5–7 |

**Method:** an earlier attempt to reach the design system via the DesignSync MCP tool (`/design-login`) was blocked twice by the lack of an interactive terminal in this session — communicated plainly rather than worked around. A first fallback attempt (local HTML file, browser-based `file://` navigation) was blocked by this session's sandboxing, which was correctly treated as an intentional security control, not circumvented; text-grep extraction from that file was sufficient for tokens but not component markup. The user then supplied the actual Vodafone Design System project directly, which is genuinely real and evidence-backed — but note its own stated provenance: it is itself a third-party approximation of the Vodafone design language, not official Vodafone source files. That limitation is preserved in `design-system.md` rather than let the richer data imply more authority than it has.

## Stage J — Traceability Workbook Completion & Mock Data Repository

| Deliverable | Summary | File |
|---|---|---|
| Traceability Workbook Reconciliation | All 815 rows of the pre-existing `data/Vodafone_Requirement_Hierarchy_Traceability_Template.xlsx` cross-referenced to blueprint IDs (TP-xxxx/WF-xxx/TSK-xxx/VW-xxx/ACT-xxx/PERM-xxx ↔ REQ-xxx/UJ-xxx/BR-xxx/SCR-xxx/PERSONA-xxx) | [traceability-workbook-reconciliation.md](traceability-workbook-reconciliation.md), [Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx](Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx) |
| Mock Data Repository | 74 files, 226 records, covering 100% of the 77 (of 83) mockable domain entities | `reconstruction-package/mock-data/` (see its own [README.md](reconstruction-package/mock-data/README.md)) |

**Method:** the original workbook uses an entirely different, independently-derived ID scheme from this blueprint's own IDs — not a simple append, so it was reconciled via appended cross-reference columns rather than merged in place. `data/`'s original file was not touched; the reconciled copy lives here in `blueprint/`. Mock data is explicitly **Classification: Assumed/Synthetic** — no real customer data exists anywhere in the source corpus, nor should it; only the *field/attribute structure* of each record type is evidence-grounded (traceable to a `domain-model.md` ENT-xxx entry). A precision bug was caught here: an initial "74 of 83 entities" coverage claim was corrected to "100% of the 77 mockable entities" after recomputing `mockable_ids - covered` directly (6 of the 83 are meta/reference constructs, not stateful records needing mock data).

## Stage K — Gap Re-Mining

| Deliverable | Summary | File |
|---|---|---|
| Gap Resolution Record | 237 flagged items re-mined against original `data/` documents: 185 recovered (78%), 31 reclassified not-applicable, 21 genuinely gapped with a labeled Recommended Assumption | [gap-resolution-stage-k.md](gap-resolution-stage-k.md) |

Following the Stage C gap-analysis counts (109 orphan requirements, 16 journeys w/o step detail, 85 screens w/o fields, 27 underspecified entities), the user asked to resolve them. Rather than fabricate, the agreed approach was: re-mine the *original* source documents under `data/` for genuinely recoverable evidence first, and only for what truly cannot be recovered, add a clearly-labeled **Recommended Assumption** (never presented as evidenced).

**Method:** one agent per source-document group (18 groups) re-read the full `.knowledge/docs/` summary for every flagged item and, for workshop/transcript-style documents, additionally ran `markitdown` on the original `.docx`/`.pptx` to check for detail the summary had compressed out. Each item resolved to Recovered / Not-Applicable / Genuinely-Gapped — see `gap-resolution-stage-k.md` for the full per-item evidence trail. Requirement→journey/screen/module links used literal ID citation where stated, falling back to tuned keyword-overlap matching (≥3 shared content words, single best match) against the `journeys.md`/`screens.md`/`module-hierarchy.md` name catalogues; an initial looser pass (≥2 words, top-2 matches) produced some false positives and was retuned before being applied.

Recovered evidence was merged directly into `personas.md`, `domain-model.md`, `requirements.md`, `journeys.md`, `screens.md`, `module-hierarchy.md`, `business-rules.md`, `field-inventory.md`, `workflow-execution-matrix.md`, `rbac-matrix.md`, `validation-catalogue.md`, and `traceability-matrix.md`, by updating the underlying pickled synthesis data and re-running the original Stage A/B/C generator scripts rather than hand-editing markdown. `gap-analysis.md`, `coverage-report.md`, and `ai-coding-agent-implementation-guide.md` were then updated to reflect the new, much-reduced remaining-gap counts.

**Incident (disclosed for transparency):** re-running the Stage A generator script to merge Stage K's updates had an unanticipated side effect — a leftover code path from the script's original Stage A-only version overwrote this README with its single-stage, 25-line original content, destroying the accumulated Stage A–J index. The file was untracked (no git history to restore from); it was reconstructed manually from the full authored content of this conversation and cross-checked against the actual stage groupings recorded in this session's task list and every current `blueprint/*.md` file header. No underlying catalogue data was lost — only this navigational index file was affected, and only briefly.

## Known limitations

- Business rules dedup (Stage A) is name-based, not semantic — some paraphrased duplicates may remain uncollapsed.
- The traceability matrix's module-hierarchy-feature join links ALL requirements in a shared feature to ALL journeys in it, all-pairs — not every requirement necessarily applies to every journey in a bundled feature area, just to the shared feature.
- Search/Filter/Sort, Feature Toggles, and Dashboard-vs-launcher distinctions (Stage F) are thinly evidenced in the source corpus by nature of the corpus, not by extraction shortfall — each document says so explicitly rather than papering over it.
- The Vodafone Design System (Stage I) is a third-party approximation supplied by the user, not official Vodafone source files — treat its tokens as directionally correct, not pixel-certified.
- Mock data (Stage J) is entirely synthetic by design — only record *shape*, not content, is evidence-grounded.
- **Resolved in Stage K:** the 109 orphan requirements / 16 journeys w/o steps / 85 screens w/o fields / 27 underspecified entities from Stage C are now 13 / 1 / 5 / 2 respectively — the rest recovered real evidence or were reclassified as categorically not-applicable. See `gap-resolution-stage-k.md` for the full item-by-item breakdown and the Recommended Assumptions for what remains.
- `build-readiness.md`'s per-module orphan/gap counts predate Stage K and have not been recalculated — treat as an upper bound on remaining per-module risk, not the current exact count.

## Phase 2 review (2026-08-23) — cross-check against a separate Phase 1.5 pass

This blueprint predates and was built independently of a separate Phase 1.5 gap-remediation pass over the same `.knowledge/` corpus (see `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md` in the repo root, which independently re-verified the confidence of 6 specific source documents against evidence, not just the blueprint's own adversarial conflict-check). Cross-checking the two turned up 5 corrections, now applied:

1. **`gap-analysis.md` §1 undercounted the User-Journey gap by one** — catalogue row #12 "New IOT Tablet" is unmapped alongside #3 "Create Upgrade TT" (was reported as 10/11 matched, 1 gap; corrected to 9/11, 2 gaps).
2. **A genuine self-contradiction in `personas.json`/`personas.md`** — PERSONA-015 claimed suspension/resume is requested via retail channels (Email/Phone/Retail Counter, sourced to a Medium-Low-confidence deck) while PERSONA-021 states the same process is explicitly "not a retail journey" (sourced to a High-confidence workshop). This blueprint's own adversarial conflict-check did not catch it — added as Conflict 3 in `conflict-report.md`, with a source mis-citation fixed (`personas.md:214` had attributed the claim to the wrong deck) and the unreliable clause removed from `personas.json`'s mechanical export.
3. **Confidence caveats added** at every citation of two under-corroborated sources cited as firm `Explicit`/`medium` fact with no caveat: the BR_28Jun deck's J017/Customer 360 content (self-labeled "topics needs to be provided," UI mockups marked "Mock CTA" — see `journeys.md` UJ-106, `requirements.md` REQ-292/293/294) and the Day5-Session1 security-question model (only 29 of 186 minutes decoded, and — more importantly — its own namesake topic has zero corroboration anywhere else in the 83-document corpus — see `business-rules.md` BR-079/BR-336/BR-337, `field-inventory.md` FLD-131..135, `validation-catalogue.md` VAL-020/VAL-201..205, `workflow-execution-matrix.md` WF-175).
4. **`.knowledge/INDEX.md`'s stale assumption about the two CAF JPGs corrected** (they were assumed to be image-renders of the application form; a separate audit found they're actually renders of the T&C page — this caused no downstream contamination in the blueprint, which correctly sourced CAF field detail from the PDFs throughout).

No other issues found: CAF form sourcing, the 26 external process-flow diagrams (no overlap with this blueprint's 4 architecture diagrams), and 3 of the 6 re-verified source documents (Day11-Session2, the Prepaid MSISDN discrepancy, the Postpaid HRN Bill Limit doc) were already handled appropriately.

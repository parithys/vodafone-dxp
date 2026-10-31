# Build Readiness Assessment (Phase 37)

Per-module readiness classification based on evidence density across the synthesized catalogues (requirement/journey/entity counts, orphan-requirement rate, journeys lacking step detail, underspecified entities) plus each module's own capability list from `module-hierarchy.md`. Every classification below cites the actual counts behind it — nothing is a subjective guess.

**Summary:** Fully Defined: 2 · Partially Defined: 10 · High Risk: 2 · Missing: 2

---

## Lead Management — `Fully Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 14 | 7 | 4 | 0 | 0 | 0 |

- **Rationale:** Lead Management shows solid, well-linked coverage: 14 requirements, 7 journeys, and 4 entities with zero orphan requirements, zero journeys lacking step-level detail, and zero underspecified entities — every requirement traces to a journey/entity and every journey has actionable step detail.
- **Assumptions required to proceed:** None — the requirement, journey, and entity catalogues are internally consistent and complete enough (0 orphans, 0 step-gaps, 0 underspecified entities) for a builder to proceed without inventing behavior.

## Mobile Prepaid — `Fully Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 3 | 2 | 2 | 0 | 0 | 0 |

- **Rationale:** Mobile Prepaid shows complete coverage with zero gaps across all dimensions: 3 requirements, 2 journeys, and 2 entities with 0 orphan requirements, 0 journeys lacking step-level detail, and 0 underspecified entities, indicating every requirement traces to a journey/entity and every journey has actionable step detail despite the small absolute footprint.
- **Assumptions required to proceed:** None — the evidence set is small but internally complete (no orphans, no step-detail gaps, no underspecified entities), so a builder can proceed directly from the synthesized catalogues without inventing behavior. The only caveat is scale: with only 3 requirements and 2 journeys, a builder should confirm with stakeholders that this represents the full intended scope of the Mobile Prepaid module and not a partial extraction, since "fully defined" here describes internal consistency, not necessarily exhaustive functional breadth.

## Mobile Postpaid — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 23 | 17 | 8 | 0 | 0 | 3 |

- **Rationale:** Mobile Postpaid shows strong linkage (23 requirements, 17 journeys, 8 entities, zero orphan requirements, zero journeys lacking step detail), but 3 of the 8 entities (37.5%) are underspecified, which is a meaningful gap in the data model a builder needs before implementing forms, validation, and persistence.
- **Assumptions required to proceed:** A builder must identify which 3 of the 8 entities are underspecified and either source their missing field-level detail (attributes, types, constraints, relationships) from other BRSD/entity documentation, or make explicit assumptions about their schema (field names, data types, required/optional status, validation rules) before wiring journeys and requirements to them. These assumptions should be documented and flagged for stakeholder confirmation rather than silently baked into the build.

## Pre-to-Post Migration — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 8 | 6 | 3 | 2 | 0 | 0 |

- **Rationale:** The module has reasonable breadth (8 requirements, 6 journeys, 3 entities) and all journeys carry step-level detail (0 journeys_without_steps) with no underspecified entities, but 2 of 8 requirements (25%) are orphaned/unlinked to any journey or entity, leaving a meaningful gap between stated requirements and buildable flows.
- **Assumptions required to proceed:** A builder would need to: (1) manually trace the 2 orphan requirements to determine whether they map to an existing journey/entity, are covered implicitly elsewhere, or require a new journey to be authored; (2) decide whether to build only the 6 fully-traced journeys now and flag the orphaned requirements as a follow-up, or pause to get clarification/source material before including them; (3) confirm the 3 entities' field-level definitions are sufficient for the 8 requirements even though entity count is low relative to requirement count.

## MNP / FNP Porting — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 19 | 13 | 8 | 0 | 5 | 1 |

- **Rationale:** MNP/FNP Porting has solid breadth (19 requirements, 13 journeys, 8 entities) and zero orphan requirements, but 5 of 13 journeys (~38%) lack step-level detail and 1 of 8 entities is underspecified, leaving meaningful implementation gaps despite good overall linkage.
- **Assumptions required to proceed:** A builder would need to: (1) reconstruct step-level UI/interaction flow for the 5 journeys lacking steps by analogy to the 8 documented journeys and general porting-flow conventions (e.g. donor validation, port-in/port-out confirmation screens); (2) define the missing fields/validation rules/state transitions for the 1 underspecified entity, likely by inferring from related entities or standard MNP data models (e.g. porting request status enum, rejection reason codes); (3) confirm these inferred behaviors with business stakeholders before build sign-off, since porting has regulatory/carrier-interface implications where wrong guesses are costly.

## Fixed Line / Fibre — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 55 | 28 | 14 | 4 | 5 | 6 |

- **Rationale:** The module has meaningful coverage (55 requirements, 28 journeys, 14 entities) but notable gaps: 4 orphan requirements (~7%) are unlinked to journeys, 5 of 28 journeys (~18%) lack step-level detail needed to build screens/flows, and 6 of 14 entities (~43%) are underspecified, which will hamper data-model and validation work.
- **Assumptions required to proceed:** A builder would need to: (1) either backfill or explicitly deprioritize the 4 orphan requirements since they have no journey to anchor UI/flow behavior; (2) invent or approximate step-level UI/interaction detail for the 5 journeys missing steps, based on analogous journeys in this or similar modules; (3) assume field-level definitions (data types, validation rules, required/optional status, relationships) for the 6 underspecified entities, likely by pattern-matching against the better-specified entities in the same module; and (4) confirm none of these gaps sit on cross-cutting/governance-critical paths before treating them as safe-to-assume rather than blocking.

## FWA / 5G Home — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 26 | 14 | 12 | 15 | 2 | 3 |

- **Rationale:** FWA / 5G Home has a reasonable base of catalogued artifacts (26 requirements, 14 journeys, 12 entities), but coverage is thin under the surface: 15 of 26 requirements (~58%) are orphaned/unlinked to any journey, 2 of 14 journeys lack step-level detail, and 3 of 12 entities are underspecified — enough structure exists to start building, but well over half the requirements can't currently be traced to a concrete flow.
- **Assumptions required to proceed:** A builder would need to: (1) triage the 15 orphan requirements and decide which map to an existing journey vs. represent untracked/undocumented flows that need a new journey definition; (2) reconstruct or assume step-level UI/field behavior for the 2 journeys missing step detail, likely by pattern-matching to analogous defined journeys in the same module; (3) fill in field-level definitions (validation rules, states, relationships) for the 3 underspecified entities before wiring forms/data models to them; and (4) confirm with stakeholders whether orphaned requirements are still in-scope or superseded, since silently building against unlinked requirements risks inventing behavior not sanctioned by any journey.

## Enterprise / IoT / B2B — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 26 | 10 | 13 | 6 | 2 | 2 |

- **Rationale:** The module has reasonable breadth (26 requirements, 10 journeys, 13 entities) but with notable gaps: 6 of 26 requirements (~23%) are orphaned/unlinked to journeys or entities, 2 of 10 journeys have no step-level detail to build screens from, and 2 of 13 entities are underspecified — enough coverage to start build but not enough to proceed without clarification on the gapped areas.
- **Assumptions required to proceed:** A builder would need to: (1) decide how to treat the 6 orphan requirements — either infer which journey/entity they belong to or defer them to a backlog/clarification list rather than silently dropping them; (2) for the 2 journeys lacking step-level detail, reconstruct plausible UI flow/step sequencing by analogy to the other 8 defined journeys or flag them for design input before building screens; (3) for the 2 underspecified entities, assume field-level schema (data types, required/optional, validation rules) based on comparable entities elsewhere in the catalogue pending confirmation; (4) confirm none of the orphan requirements represent cross-cutting B2B/IoT governance rules (e.g. account hierarchy, device provisioning permissions) that would otherwise elevate risk if left unresolved.

## Order Management — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 24 | 2 | 6 | 6 | 1 | 2 |

- **Rationale:** Order Management has meaningful coverage (24 requirements, 2 journeys, 6 entities) but notable gaps: 6 of 24 requirements (25%) are orphaned/unlinked to journeys or entities, 1 of only 2 journeys has no step-level detail, and 2 of 6 entities are underspecified.
- **Assumptions required to proceed:** A builder would need to: (1) decide how the 6 orphan requirements map to UI flows or entities absent an explicit journey/entity link, (2) reconstruct step-level UI/interaction detail for the journey lacking steps (likely by analogy to the one fully-stepped journey or external convention), and (3) fill in field-level definitions, validation rules, and relationships for the 2 underspecified entities before they can back real forms/data models. If these gaps are not resolved with source material, the agent will be inventing behavior for roughly a quarter of the requirement set and half the journeys.

## Identity & Customer Management — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 18 | 2 | 6 | 10 | 0 | 1 |

- **Rationale:** The module has 18 requirements, 6 entities, and 2 journeys with full step-level detail (0 journeys without steps), so there is a real build foundation, but 10 of 18 requirements (over half) are orphaned/unlinked to any journey or entity, and 1 of 6 entities is underspecified.
- **Assumptions required to proceed:** A builder must: (1) decide how the 10 orphan requirements map onto the only 2 documented journeys or treat them as backlog/out-of-scope for this build pass; (2) infer missing attributes/relationships/validation rules for the 1 underspecified entity, likely by pattern-matching against the 5 well-specified entities; (3) confirm whether the 2 journeys are the only front-end flows needed for Identity & Customer Management or whether orphaned requirements imply additional undocumented journeys/screens; (4) flag these assumptions for stakeholder sign-off before treating the reconstructed UI as authoritative, since over 55% of requirements currently lack traceable journey/entity linkage.

## SIM & Number Management — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 14 | 8 | 6 | 6 | 0 | 2 |

- **Rationale:** The module has full journey step-level detail (8/8 journeys with steps) and a reasonable entity base (6 entities, only 2 underspecified), but 6 of 14 requirements (43%) are orphaned/unlinked to journeys or entities, which is a substantial gap that prevents treating it as fully build-ready.
- **Assumptions required to proceed:** A builder would need to: (1) manually map each of the 6 orphan requirements to the nearest matching journey/entity or flag them for stakeholder clarification before implementation; (2) decide reasonable default field-level definitions/validation rules for the 2 underspecified entities (likely SIM/Number state or eligibility attributes) rather than inventing them ad hoc; (3) confirm whether the orphan requirements represent cross-cutting rules (e.g., eligibility, fraud/porting checks) that apply across multiple journeys rather than being missing journeys outright.

## Trouble Ticketing & Complaints — `Partially Defined`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 17 | 5 | 5 | 2 | 1 | 1 |

- **Rationale:** The module has reasonable base coverage (17 requirements, 5 journeys, 5 entities), but 2 of 17 requirements (~12%) are orphaned/unlinked, 1 of 5 journeys lacks step-level detail, and 1 of 5 entities is underspecified — enough gaps that a builder cannot rely on the catalogue alone but there is a solid core to build from.
- **Assumptions required to proceed:** A builder would need to: (1) decide how to treat the 2 orphan requirements — either infer which journey/entity they attach to or defer them as backlog items outside this build pass; (2) reconstruct the missing step-level flow for the 1 journey without steps, likely by pattern-matching it against the other 4 documented journeys or flagging it for stakeholder walkthrough before coding; (3) fill in the missing fields/validation rules/relationships for the 1 underspecified entity, assuming reasonable defaults (e.g., standard status/audit fields) subject to later correction.

## Access, Roles & Approval Governance — `High Risk`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 8 | 0 | 2 | 8 | 0 | 1 |

- **Rationale:** All 8 requirements are orphaned (n_orphan_requirements = 8 of 8, 100%) and there are zero journeys (n_journeys = 0) to supply step-level UI/flow detail, while access/roles/approval is inherently a cross-cutting governance concern touching every module; combined with 1 of only 2 entities being underspecified, an AI coding agent would have no linked, screen-level source of truth and would have to invent role models, approval workflows, and permission logic wholesale.
- **Assumptions required to proceed:** A builder would have to assume/decide: (1) the full role/persona taxonomy and permission matrix (who can approve what, at which thresholds) since no journey walks through an approval UI; (2) the approval workflow state machine (submit, approve, reject-correction, reject-drop, escalation) by analogy to fragments seen elsewhere in the corpus (e.g. manager approval queues in FWA/Fixed Line guided journeys) rather than from module-specific evidence; (3) the schema/attributes of the underspecified entity, including its relationship to the other entity and to order/account objects; (4) how the 8 orphan requirements map to actual screens, fields, and validation rules, since none are linked to a journey or step; and (5) audit/traceability logging behavior for access and approval actions, which is undocumented here.

## Platform Governance & Architecture — `High Risk`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 22 | 0 | 4 | 20 | 0 | 3 |

- **Rationale:** The module has 22 requirements but 20 (91%) are orphaned/unlinked and there are 0 journeys and only 4 entities (3 of 4 underspecified) — meaning almost no requirement traces to an executable UI flow or a well-formed data model. Combined with the fact that "Platform Governance & Architecture" is inherently a cross-cutting/platform-level concern rather than a screen-level flow, an AI coding agent would have to invent nearly all of the governing behavior, access rules, and architectural boundaries rather than derive them from the source material.
- **Assumptions required to proceed:** A builder would have to assume/decide: (1) what "requirement" means operationally for governance/architecture items with no linked journey or step detail to ground them in a concrete screen or flow; (2) the shape and constraints of the 3 underspecified entities (fields, relationships, validation rules) since they lack enough detail to model; (3) how the 20 orphan requirements map to any UI, API, or workflow — since none link to a journey, their acceptance criteria and trigger conditions must be invented; (4) cross-cutting access-control/governance policy specifics (roles, permission boundaries, escalation paths) that are typically assumption-heavy even in well-documented systems and here have zero journey-level evidence to anchor them; (5) whether this module is meant to produce user-facing screens at all, versus backend/config-only rules, since zero journeys could indicate either a documentation gap or a non-UI scope.

## Billing & Adjustments — `Missing`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 19 | 0 | 9 | 16 | 0 | 2 |

- **Rationale:** Zero journeys exist (n_journeys=0) to provide step-level UI/flow detail, and 16 of the 19 requirements (84%) are orphaned/unlinked to any entity or journey, leaving only 3 connected requirements and 9 entities (2 underspecified) with no walkthrough evidence to construct screens or flows from.
- **Assumptions required to proceed:** A builder would have to invent the entire user journey and screen sequence for Billing & Adjustments from scratch: which screens/steps exist, field-level layout, validation rules, navigation flow, and how the 16 orphaned requirements map to any UI element or entity, since no journey or step-level source material exists to derive this from. They would also need to resolve the 2 underspecified entities' missing attributes/relationships and decide how (or whether) to link each orphaned requirement to the 9 entities before any screen can be built with confidence.

## CAF, Attachments & Forms — `Missing`

| Requirements | Journeys | Entities | Orphan reqs | Journeys w/o steps | Underspecified entities |
|---|---|---|---|---|---|
| 14 | 0 | 2 | 14 | 0 | 0 |

- **Rationale:** Zero journeys (n_journeys=0) and zero journey-step detail means the 14 requirements exist only as discussion-level statements with no UI/flow evidence to build from; all 14 requirements are orphaned (unlinked to journeys or traced flows), and only 2 entities are defined for the module, so there is no procedural or field-level basis for an AI coding agent to reconstruct the CAF, Attachments & Forms UI.
- **Assumptions required to proceed:** A builder would have to assume: (1) the end-to-end screen flow and step sequence for CAF (Customer Application Form) submission, attachment upload, and dynamic form rendering, since no Guided Journey/journey-step evidence exists; (2) field-level layout, validation rules, and error states for the forms and attachment upload widget; (3) how the 2 known entities map to all 14 requirements and what additional entities/fields are implied but undocumented; (4) attachment constraints (file types, size limits, mandatory vs optional docs) and any backend/API contract for submission, none of which are evidenced here. These would need to be sourced from other BRSD/workshop documents in .knowledge or confirmed with stakeholders before build.

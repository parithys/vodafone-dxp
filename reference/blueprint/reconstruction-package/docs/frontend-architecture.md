# Front-End Application Blueprint (Phase 39)

Architecture for a **production-ready, front-end-only** rebuild of the Vodafone Qatar DXP platform per `CLAUDE.md`'s constraint: no APIs, backend services, databases, middleware, or third-party integrations. Every workflow, business rule, validation, permission, calculation, search, approval, escalation, notification, and state transition is simulated in front-end logic.

**Evidence status of this document:** Stages A–C extracted *what the system must do* (66 personas, 83 entities, 308 requirements, 111 journeys, 213 screens, 346 business rules, 418 validations, 145 RBAC entries, 945 workflow steps) directly from the source corpus — that material is evidence-cited throughout `blueprint/`. This document is different in kind: it is an **architectural design synthesis**, not an extraction. No source document specifies a target front-end tech stack, state-management approach, or design system (the corpus's own UI evidence is entirely *legacy* Siebel/Open UI screenshots — see `screens.md` — which the modernization program is replacing, not a target-state design spec). Every decision below is therefore marked **Assumed**, with rationale, and is a starting recommendation for the team to confirm or override — not a fact reconstructed from evidence.

---

## 1. Technology Stack (Assumed)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Industry-standard for complex, stateful SPAs; TypeScript gives compile-time safety across ~1,000+ generated data-shape objects (fields, rules, entities) transcribed in this blueprint. |
| Build tool | Vite | Fast dev server/HMR; no backend build coupling needed. |
| Routing | React Router v6 | Client-side routing matching `config/routes.json` (213 routes, one per `screens.md` entry) — no server-side routing exists or is needed. |
| State management | Zustand + a persistence middleware | Simpler and less boilerplate than Redux for a single-repo app of this scope; persistence middleware backs stores with `localStorage`/`IndexedDB` so state survives reloads within a session, standing in for a real backend's durability. |
| Styling | Tailwind CSS + a small hand-authored design token set | No design system was evidenced in the corpus (see §6) — Tailwind lets the team apply/replace tokens without committing to a specific component library prematurely. |
| Forms | React Hook Form | Matches the field-heavy nature of `field-inventory.md` (970 fields) — schema-driven validation via the Validation Engine (§5) rather than hand-wired per-field logic. |
| Mock backend | Custom in-memory store (see §7), NOT MSW/json-server | Keeps the "backend" fully inside the front-end bundle per the no-backend constraint — a network-mocking library still implies a conceptual client/server boundary that isn't needed here. |

None of the above is evidenced by the corpus; all of it is a reasonable, revisable default. If the team has an existing design system or component library mandate (e.g. Vodafone Qatar's public brand guidelines), it should supersede §6 below.

---

## 2. Front-End Architecture

```
Persona Engine ──selects──> Active Persona ──filters──> Navigation / Routes (via RBAC Engine)
                                                              │
                                                              ▼
                                                     React Router (routes.json)
                                                              │
                                                              ▼
                                                   Screen Components (213, by module)
                                                              │
                       ┌──────────────────────────────────────┼──────────────────────────────┐
                       ▼                                       ▼                              ▼
              Validation Engine                        Rule Engine                    Mock Data Engine
          (validation-rules.json,               (business-rules.json,             (mock-data/*.json,
           field-inventory.md)                   workflow-execution-matrix.md)     domain-schema.json)
                       │                                       │                              │
                       └──────────────────────────────────────┴──────────────────────────────┘
                                                              │
                                                              ▼
                                                  Zustand stores (+ localStorage persistence)
```

Every one of the five engines is config-driven (Phase 28 Configuration Model): they read the JSON files in `../config/` and `../mock-data/` rather than having behavior hardcoded per-screen, so that updating a business rule or RBAC entry means editing a data file, not application code.

---

## 3. Component Architecture

Given 213 screens is too many to hand-design individually, screens are built by composing a much smaller set of shared components, organized in three tiers:

1. **Primitives** — Button, Input, Select, DatePicker, SignaturePad, FileUpload, Badge, Toast, Modal, Drawer, Tabs, DataTable — generic, no business meaning.
2. **Domain components** — thin wrappers around primitives bound to a specific entity/field shape from `field-inventory.md` / `domain-schema.json` (e.g. `<QidInput>`, `<MsisdnPicker>`, `<CreditLimitEditor>`, `<BillingProfileSelector>`) — these encode the *shape* of a domain concept but not a full screen's workflow.
3. **Pattern components** — the reusable, multi-field/multi-step compositions cataloged in `reusable-patterns.md` (e.g. `<GuidedActivationWizard>`, `<Customer360Panel>`, `<OrderApprovalQueue>`, `<CafSignatureCapture>`) — these are what most of the 213 screens are actually built from.

A screen component itself should mostly be *composition* (which pattern/domain components, in what layout) plus wiring to the Rule/Validation/Mock-Data engines — not bespoke logic. See `folder-structure.md` for where each tier lives.

---

## 4. State Management Architecture

One Zustand store per bounded context, not one global store:

| Store | Backs | Persistence |
|---|---|---|
| `personaStore` | Active persona/role (dev "login-as" switcher — see §8) | `localStorage` (survives reload) |
| `entityStore` | All mock domain records (customers, accounts, orders, ...) — the "database" | `IndexedDB` (larger volume, structured) |
| `workflowStore` | In-progress wizard/journey state (current step, draft field values) | `sessionStorage` (cleared on tab close, matching real draft-order semantics from `journeys.md`'s "milestone/draft-order persistence for resume" evidence) |
| `notificationStore` | Toasts/alerts/confirmation dialogs queue (Phase 24) | In-memory only |
| `configStore` | Loaded config JSON (RBAC, rules, validations, routes, module hierarchy) — read-only after boot | In-memory (re-read from `/config/*.json` on load) |

Cross-store reads (e.g. the Rule Engine reading `entityStore` to evaluate a threshold) go through engine functions (§5, §7), not direct store-to-store coupling, so each engine's logic stays testable in isolation.

---

## 5. Rule & Validation Engine

**346 business rules** (`business-rules.md`) and **418 validation rules** (`validation-catalogue.md`) cannot each be hand-translated into bespoke UI logic in a blueprint of this scope — most are free-text descriptions (e.g. "Bill Limit entries above Agent Minimum value allow the journey to proceed"), not formal condition/action pairs. The architecture therefore separates **catalogue** from **implementation**:

1. **Catalogue layer** (already generated): `config/business-rules.json` and `config/validation-rules.json` are the full evidence-backed lists, each rule/validation tagged with an `engineHint` (`threshold` / `restriction` / `mandatory-field` / `procedural` — a best-effort classification of the rule's shape, computed from its description text).
2. **Implementation layer** (to be built incrementally): a `ruleImplementations` registry keyed by rule ID (`BR-xxx`) mapping to an actual TypeScript predicate/calculator function. Only rules actually exercised by a screen/journey being built need an implementation — the registry should **fail loudly** (a visible "Rule BR-xxx has no implementation" warning banner in dev mode, not a silent no-op) when a screen references an unimplemented rule, so gaps are visible during development rather than causing silent incorrect behavior.
3. **Priority order for implementation**: start with rules referenced by `Fully Defined` and `Partially Defined` modules in `build-readiness.md` (Lead Management, Mobile Prepaid, and most journeys with step-level detail) before `High Risk`/`Missing` modules (Access/Roles/Approval Governance, Platform Governance, CAF/Attachments/Forms, Billing & Adjustments) where the underlying rules themselves are still under-specified per `gap-analysis.md`.

Illustrative high-value rules worth implementing first (all `Explicit`, `high` confidence, directly evidenced): Bill Limit Agent Minimum threshold validation (guided-journey evidence across multiple New Postpaid walkthroughs), Fibre 12-month lock-in disconnection fee calculation (BR-001), HRN advance payment requirement (BR referenced in `guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`), KID-in-use exception handling.

The Validation Engine is a special case of the same pattern, scoped to field-level checks: `field-inventory.md` entries with a `validation_rule` or `error_message` populate `config/validation-rules.json`'s `Field-Level` entries (281 of 418), and React Hook Form resolvers should look these up by field + screen rather than hardcoding per-field validation.

---

## 6. Design System Architecture (Explicit tokens + components — see `design-system.md`)

**Update:** this was originally the least evidence-backed part of the blueprint, since the 83-document requirements corpus contains zero target-state design evidence (only legacy Siebel/Open UI screenshots). That gap is now closed — the user supplied a full Vodafone design-system project (`vodafone-design-system/`, a Claude-Design project synced locally) with real design tokens, 12 real React components (full `.jsx` + `.d.ts` prop APIs), and written brand guidelines. **See `design-system.md` for everything** — this section is now a summary pointer, not the source of truth. Read `design-system.md` §0 first: the source is explicit that it's a well-researched *third-party approximation* of Vodafone's brand (from a GitHub brand-analysis repo), not Vodafone's own production design files — logo, font, and icons are all explicit placeholders (§6 of that document).

- **Color:** real Vodafone brand palette — `--accent` `#e60000` (brand red), plus a full neutral/semantic/overlay set.
- **Typography:** Inter (a documented *substitute* for Vodafone's real proprietary typeface, which wasn't available), with a genuine two-track type scale (13 display sizes 12px-144px, 8 utility sizes 12px-68px, 5 weights 300-800).
- **Layout:** three evidenced responsive tiers (phone 16px/tablet 24px/desktop 36px gutters, container max 1200px) — corroborates (and extends with a phone tier) the Desktop+Tablet split already evidenced in `responsive-behaviour-catalogue.md`.
- **Spacing/radius/elevation/motion:** full token sets in `design-system.md` §4-5 — an 8-step spacing scale (4px-48px), 12 radius tokens (2px sharp buttons through full pill/circle), a deliberately near-shadowless elevation model, 150/220ms motion timings (motion explicitly flagged as inferred, not confirmed, by the source itself).
- **Components:** now fully specified — 12 real components (`Button`, `IconButton`, `Input`, `Card`, `FeaturedCard`, `CircularMedia`, `TagPill`, `TopNav`, `Footer`, `RedBand`, `ShareTicker`, `ImpactMap`) with complete TypeScript prop interfaces in `design-system.md` §7. **Important caveat** (`design-system.md` §9): this component set is built for a public marketing/editorial site, not an enterprise CRM — only the *tokens* (color/type/spacing) transfer directly to the DXP; the enterprise UI primitives in `component-catalogue.md` (DataTable, Stepper, wizard shells) remain the primary component set for actual DXP screens.

Generate `reconstruction-package/config/design-tokens.json` (done — 106 tokens) and expose via the Configuration Engine's `getDesignToken(name)`, consistent with §10's "no hardcoded values" principle.

---

## 7. Mock Data Engine (Phase 27 architecture)

Simulates a backend entirely in the browser:

- **Seed data**: `mock-data/*.json` (11 entity types, see `mock-data/README.md`) loaded into `entityStore` (IndexedDB-backed) on first run.
- **CRUD operations**: wrapped in an artificial-latency promise (e.g. 200–600ms) to preserve realistic loading-state UX (`screens.md`'s Dashboard/List screens all imply a loading state) without a real network call.
- **Relationships**: enforced in-memory using `domain-schema.json`'s `relationships` field (e.g. an Order references a `customerId`/`accountId`/`billingProfileId` that must exist in `entityStore`) — referential integrity checks run as part of "create/update" mock operations, not a real foreign-key constraint.
- **Lifecycle states**: entities with `lifecycleStates` evidenced in `domain-model.md` (e.g. Billing Profile: good standing → overdue → in collection → blacklisted) get a `transition(entityId, toState)` function in the Mock Data Engine that validates the transition is legal per the evidenced state machine, rejecting illegal transitions the same way a real backend would.
- **Reset/reseed**: a dev-only "reset mock data" action re-loads `mock-data/*.json`, useful for demoing the same golden-path repeatedly.

---

## 8. Persona Simulation Engine (Phase 26)

Since there is no real authentication system (front-end-only constraint), personas are simulated via a **persona switcher** (a dev/demo affordance, not a security boundary):

1. `personaStore` holds the currently "logged in as" persona (one of the 66 in `config/personas.json`).
2. On persona change, the Navigation component re-filters visible modules/routes by querying `config/rbac.json` for entries matching the new `personaId`.
3. Screen-level and action-level guards (e.g. an "Approve" button) check `rbac.json`'s `permissionLevel` for the (persona, screen) pair before rendering/enabling — defaulting to **hidden**, not just disabled, when no RBAC entry exists (matching `gap-analysis.md`'s finding that RBAC coverage is necessarily sparse — absence of an entry means "not evidenced," which the UI should treat conservatively as "don't show" rather than "allow").
4. The 5 personas with zero RBAC entries (`gap-analysis.md` §3) and the ~empty-access personas should render with a visibly minimal navigation menu rather than the engine silently granting them full access by default.

---

## 9. Navigation & Routing Architecture (Phases 9 & 10)

- `config/routes.json` (213 entries) is generated from `screens.md`, with each screen assigned to one of the 16 `module-hierarchy.md` modules by keyword-matching the screen's name/purpose/dependencies against that module's capability list (see `module-hierarchy.json`'s per-module `screenCount`). This is a **coarse, deterministic assignment** — some screens may be mis-bucketed; treat `routes.json` as a strong starting point requiring a manual pass, not a final IA.
- Route path convention: `/<module-slug>/<screen-slug>` (e.g. `/fixed-line-fibre/new-fixed-line-triple-play-wizard`).
- Primary navigation = the 16 modules (sidebar). Secondary navigation = a module's screens, grouped by sub-module (from `module-hierarchy.json`). Context navigation = pattern components like `<Customer360Panel>` exposing tabs/actions scoped to the currently-open customer/order, independent of the URL route.
- Breadcrumbs are derived automatically from the route's module → sub-module → screen path, not hand-authored per screen.

---

## 10. Configuration Engine (Phase 28)

A single boot-time loader (`loadConfig()`) reads all of `config/*.json` into `configStore`, providing typed accessors:

```ts
getRoutesForModule(moduleId): Route[]
getRbacFor(personaId, screenId): RbacEntry | undefined
getBusinessRule(ruleId): BusinessRule | undefined
getValidationRulesForField(screenName, fieldLabel): ValidationRule[]
getPersona(personaId): Persona | undefined
```

No screen or component should import a config JSON file directly — always through these accessors, so the *source* of RBAC/rules/routes can later change (e.g. to a real backend) without touching screen code. This directly implements Phase 28's "externalize menus/routes/permissions/rules/workflows/features, avoid hardcoded values" requirement.

---

## Build sequencing recommendation

Per `build-readiness.md`, build in this order to front-load the best-evidenced, lowest-risk material and defer modules that need business stakeholder input:

1. **Fully Defined:** Lead Management, Mobile Prepaid
2. **Partially Defined** (11 modules, richest first by requirement/journey count): Fixed Line/Fibre, FWA/5G Home, Mobile Postpaid, Enterprise/IoT/B2B, Order Management, MNP/FNP Porting, Identity & Customer Management, SIM & Number Management, Trouble Ticketing & Complaints, Pre-to-Post Migration, (remaining)
3. **Missing:** Billing & Adjustments, CAF/Attachments & Forms — build the *shell* (screens, routes, RBAC) but flag every business rule/calculation as `TODO: confirm with business owner` per `gap-analysis.md`'s open items rather than guessing.
4. **High Risk:** Access/Roles/Approval Governance, Platform Governance & Architecture — architecture-cross-cutting; resolve the two verified conflicts in `conflict-report.md` before building dependent behavior.

See `../../ai-coding-agent-implementation-guide.md` for the full step-by-step build sequence.

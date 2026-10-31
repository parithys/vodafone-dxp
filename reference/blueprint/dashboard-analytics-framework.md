# Dashboard Analytics Framework (Phase 23)

`screens.md` catalogues 11 screens as type `Dashboard`. Splitting these by actual function reveals most are **module launchers** (already covered by `reusable-patterns.md` Pattern 15), not analytics dashboards with KPIs/widgets/drilldowns. This split is itself the main finding of this document — do not treat "11 dashboards" at face value without this breakdown.

---

## 1. True analytics/monitoring dashboards (5 of 11)

| Screen | Widgets/KPIs evidenced | Filters | Drilldowns |
|---|---|---|---|
| **SCR-021 Customer 360** | Summary tiles (Orders, Trouble Tickets, Installed Assets, Billing Profiles counters); activity timeline | Tab selection (Contacts, Addresses, Account Hierarchy, Installed Assets, Orders, Activities, Profiles, Payment Profile, Billing Items, Trouble Tickets) | Each tile/tab drills into its respective grid (Reusable Pattern 3) |
| **SCR-185 Account 360 View / Account Summary tile view** | Tile counters; activity timeline | Same tab set as Customer 360 | Same as above |
| **SCR-060 TM SR Queue View — Order Activities Queue** | Order #, Contact, Approval Status, Status columns (implicitly a KPI: count of pending approvals) | "My Pending Approval Orders" scope filter | Row selection → Order Approval detail (Reusable Pattern 5) |
| **SCR-183 Bulk Jobs / Bulk Processing screen** | Per-row job status (success/failure counts implied by Reusable Pattern 17's "per-row success/failure reporting") | (not itemized) | Row → job detail / failure report |
| **SCR-211 Tickets Dashboard** | (title only — "no field-level content extracted beyond the slide title" per `screens.md`'s own source note) | Unknown | Unknown |

**SCR-211 is a named gap**, not a confirmed empty dashboard — the source slide title exists but no field-level detail was recoverable. Flag for follow-up with the original `Vodafone Process Overview` deck owner if this dashboard needs to be built.

## 2. Module launchers miscategorized as "Dashboard" by screen type (6 of 11)

These are tile-grid navigation screens (Reusable Pattern 15), not analytics — reclassify when implementing:

- SCR-012 RFS/Feasibility Portal (Grafana) — actually an embedded external Grafana view, not a native dashboard; treat as an iframe/external-link integration point, not a component to build
- SCR-013 Enterprise Process Knowledge Base Dashboard — a documentation hub with links, not KPIs
- SCR-056 New Fixed Line Tablet Home Dashboard — tile-grid launcher
- SCR-091 OFS My Route (Technician) — a route/task list, not a KPI dashboard (and out of this corpus's UI-evidence scope per `channel-architecture.md` §4's Field/WFM note)
- SCR-119 Agent Home / App Launcher — tile-grid launcher
- SCR-176 Home menu (app-icon grid) — tile-grid launcher

---

## 3. KPI/metric terminology — evidence status

No source document uses formal "KPI," "widget," or "metric" terminology (a direct keyword search across all 213 screens' evidenced text returns zero hits) — the 5 true dashboards above evidence **counters and status tiles**, not a configurable widget/KPI framework. Building a generic, reusable `<DashboardWidget>` primitive (count tile, status-grid tile, timeline tile) covers all 5 evidenced cases without needing to invent a broader analytics framework the corpus doesn't call for.

## 4. Recommendation for implementation

- Build exactly 3 widget primitive types (all evidenced): **Count Tile** (Orders/Tickets/Assets/Profiles counters), **Status Grid** (Order #/Contact/Status columns), **Activity Timeline** (chronological event list) — see `component-catalogue.md` §1 for the primitive tier these compose from.
- Do not build a generic drag-and-drop dashboard-configuration framework — nothing in the corpus evidences end-user dashboard customization; the 5 dashboards are fixed-layout by design (Explicit — Customer 360's requirement explicitly calls for "single page with tab-based partial refresh," not a configurable layout).
- SCR-012's Grafana embed should remain an external iframe/link in the new DXP unless the business decides to rebuild feasibility-check visualization natively — out of scope for a front-end-only, no-backend rebuild in any case (Grafana requires a backend data source).

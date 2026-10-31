# Search, Filter & Sort Framework (Phase 22)

Evidenced across 13 screens with search capability, 5 with explicit filtering, and 1 with explicit sorting (`screens.md`), plus the Number Selection reusable pattern's Free/Reserved toggle (a filter, functionally). Advanced search, saved filters, and formal sort-order controls are **thinly evidenced** — flagged explicitly below rather than invented.

---

## 1. Search capabilities (Explicit, 13 screens)

| Screen | Search scope | Notes |
|---|---|---|
| SCR-195 Global Search | Cross-entity (name/scope not further itemized in source) | The only screen explicitly named as a general-purpose search entry point |
| SCR-034 Address / Service Point Search (KID lookup) | KID or ZSB search term | Feeds Fixed Line/FWA address validation |
| SCR-201 RFS Portal | ZSB address, Karama ID, area search | Feasibility/RFS determination |
| SCR-104 Numbers Tab (Order) | Number search/selection | Order-scoped number lookup |
| SCR-024 Number Management Portal | (unspecified search scope) | EBU number portal |
| SCR-105 UIM Custom Object Summary | Serial number search | Inventory lookup |
| SCR-090 Inventory Management — Non-Serialized Transfer | Part search | Adds to a transfer list |
| SCR-089 Move Dialog (Technician Reassignment) | Technician search | Reusable Pattern 18 |
| SCR-146 Lead Owner reassignment picker | Search + filter, row selection | Reusable Pattern 14 |
| SCR-125 MNP wizard — Plan step | Plan search term | Plan-selection grid |
| SCR-007 Account Creation Screen | Name, CR type/ID type, CR number lookup | Manual account creation search |
| SCR-172 Promotion Upgrades picker | (unspecified) | Modal picker |
| SCR-004 Bill Landing View | (search referenced but not detailed — "search inside bill for enterprise" per `business-process-day10-session-1...`) | Requested feature, not confirmed built |

**Pattern:** every evidenced search is **scoped and entity-specific** (search customers by KID, search numbers, search technicians, search plans) — there is no evidenced single unified/global search index behind SCR-195 "Global Search" beyond its name; treat its actual scope as a gap to confirm with the business owner.

## 2. Number Selection as a filter mechanism (Explicit, Reusable Pattern 10)

The Number Selection step (`reusable-patterns.md` Pattern 10) is architecturally a filtered search: an 8-digit search box combined with a **Free vs. Reserved** toggle, returning matching MSISDNs as priced, selectable tiles. This is the single richest evidenced filter interaction in the corpus.

## 3. Filter capabilities (Explicit, 5 screens)

| Screen | Filter | Notes |
|---|---|---|
| SCR-147 All Leads across Org | View filter selection | Scoped views: My Leads / My Created Leads / Team / All (Reusable Pattern 14) |
| SCR-198 All Sales Order screen | All SIM Swap Orders / All Pending SIM Swap Orders | Order-status filter |
| SCR-001 Bulk Adjustment Portal | Billing profile filter | Also has default sort/filter per its BRSD description |
| SCR-146 Lead Owner reassignment picker | Search filter | Combined with search, not a separate mechanism |
| SCR-015 Enterprise Invoice (Excel) | (CDR data/discount line filtering implied by Excel format, not a UI filter control) | Legacy Excel-based, not evidenced as an in-app filter |

## 4. Sort capabilities (thin evidence — 1 screen)

Only **SCR-001 Bulk Adjustment Portal** explicitly evidences a sort control ("default sort/filter" per its BRSD description, `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`). No other screen's source material describes column sorting, sort-direction toggles, or multi-column sort — this is a corpus gap, not evidence that sorting is unnecessary elsewhere (list/grid screens like Pattern 14's Lead Lists or Pattern 5's Order Approval Queue almost certainly need it in practice).

## 5. Saved filters & advanced search (Assumed — not evidenced)

No source document describes a "save this filter" or "advanced search" (multi-field boolean query builder) capability anywhere in the corpus. **Recommendation** (Assumed, not evidenced): a modern DXP rebuild should still offer basic saved-filter presets on the highest-traffic list screens (Lead lists, Order Approval Queue, Trouble Ticket queues) as a standard UX improvement over the legacy system — but do not present this as a discovered requirement.

---

## 6. Reusable search/filter architecture recommendation

Given the evidenced pattern is "scoped, entity-specific search + simple toggle/dropdown filters" rather than a unified search engine, the front-end architecture (`frontend-architecture.md`) should implement:
- A generic `<EntitySearch>` domain component (client-side filter over the Mock Data Engine's in-memory entity store, per-entity-type — customers, numbers, technicians, plans) rather than a single cross-entity search index.
- Filter state as local component/URL state per list screen, not a global filter store — matches the evidenced pattern of independently-scoped list views (Reusable Pattern 14).
- Sort as a standard `<DataTable>` primitive capability (client-side, since all data is in-memory per the Mock Data Engine) even though only 1 screen evidences it explicitly — a reasonable default for any list-type primitive, flagged here as Assumed.

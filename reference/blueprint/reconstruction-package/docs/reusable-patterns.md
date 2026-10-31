# Reusable Pattern Catalogue (Phase 19) & UI Component Inventory (Phase 20)

Derived by scanning all 213 screens in `../../screens.md` for genuinely recurring shapes — i.e. patterns an AI coding agent should implement **once** as a shared `patterns/` component (see `folder-structure.md` §Component hierarchy) and reuse across the many screens that exhibit them, rather than rebuilding per-screen. Every pattern below cites the specific `SCR-xxx` screens it was derived from; open `screens.md` for each screen's full detail and source citations.

**Method:** one agent read all 213 screens end-to-end and reported 18 patterns with a minimum evidence bar of 2–3 screens per pattern; graded `Explicit` (repetition directly evidenced across many screens) or `Inferred` (generalized from a smaller/more varied evidence base — flagged accordingly). No pattern here was invented without at least 2 supporting screen entries.

---

## Pattern 1: Guided Multi-Step Wizard
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-043–SCR-050 (New Fixed Line), SCR-067, SCR-078–SCR-082/SCR-099/SCR-100 (FWA), SCR-121–SCR-134 (MNP), SCR-152–SCR-162 (Postpaid), SCR-177/SCR-180 (Pre-to-Post), SCR-190–SCR-192 (New Prepaid), SCR-208 (DXP 13-step onboarding)
- **Description:** An accordion-style, numbered wizard where only the active step is expanded, with a persistent "You are here: `<Step>`" breadcrumb. The step sequence is near-identical across every connection/activation journey regardless of product: Contact → Address → Billing/Plan → Number → SIM → Addon/Discount → CAF/Attachments → Activity → Submit. Steps can auto-skip based on branch logic (e.g. appointment step skipped for instant activation). Navigation buttons are consistently Continue / Save & Finish / Cancel / Go Back / Abandon Order. **The single most-repeated shape in the entire corpus** — implement this first.
- **Typical personas:** Retail Sales Agent, Retail/CRM Agent, Tablet field agent, Fulfilment Agent

## Pattern 2: Customer/Contact Lookup Step (QID/Kahramaa ID Scan + MOI Validation)
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-041, SCR-043, SCR-078, SCR-121, SCR-152, SCR-154, SCR-177, SCR-190
- **Description:** Prompts to scan/insert the customer's Qatari ID (or Kahramaa ID for fixed line), calls out to MOI validation, returns a confirmation banner, and pre-fills name/DOB/nationality for agent review. Buttons: Go / Search Again / Cancel. Recurs as literally the first step of nearly every new-connection and cross-sell journey.
- **Typical personas:** Retail Sales Agent, Retail/CRM Agent, Tablet field agent

## Pattern 3: Account/Customer 360 Summary View
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-021, SCR-051, SCR-073, SCR-101, SCR-137, SCR-185, SCR-202
- **Description:** A single-page, tab-based-partial-refresh account overview: identity fields (Class/Type/Segment/Status/Credit Limit), summary tiles (Orders, Trouble Tickets, Installed Assets, Billing Profiles), and sub-tabs (Contacts, Addresses, Account Hierarchy, Installed Assets, Orders, Activities, Profiles, Payment Profile, Billing Items, Trouble Tickets) plus an activity timeline. Requirements explicitly call for single-page/tab-based-partial-refresh, not full navigation.
- **Typical personas:** Retail Sales Agent, Retail/CRM Agent, Back office/agent, Assisted Care Agent

## Pattern 4: Asset 360 / Asset Detail Drill-Down
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-022, SCR-096, SCR-203, SCR-204
- **Description:** Selecting a row in an Installed Assets grid drills into usage/balance/plan detail with a Next Best Offer banner, then a further drill-down into a 4-card layout (Account/Asset/Contact/Bill Details) with action buttons (Get Due Amount, Get Usages, Get RTB, Get Next Best Offer). Toolbar consistently exposes Modify/Disconnect/GetPINPUK/End Data Session/Initiate TON/Send OTP.
- **Typical personas:** Agent, Retail/CRM Agent, Back office/agent

## Pattern 5: Order Approval Queue + Detail
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-059–SCR-064, SCR-107, SCR-197
- **Description:** A manager-facing queue (filterable "My Pending Approval Orders") drilling into a 4-tab detail (Attachments, Order Details, Activities, Agents Details) with three consistent actions: Approve, Reject-Correction, Reject-Drop Order. Approve requires a verification-acknowledgment + Comments. Reject requires a multi-select Reason dropdown + Comments, can trigger an SMS, and routes into a dedicated Order Correction re-entry wizard (SCR-064) pre-filled with prior data.
- **Typical personas:** Manager/Approver, Retail Sales Agent (submitter)

## Pattern 6: CAF/Contract Signature Capture
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-019, SCR-058, SCR-069, SCR-070, SCR-076, SCR-084, SCR-127/SCR-129, SCR-128, SCR-130, SCR-139, SCR-169
- **Description:** A CAF-type dropdown (Digital / Manual / Touch Screen) determines rendering. Digital mode: bilingual (AR/EN) document preview pre-populated from applicant/billing/plan data, then a "Please Sign" pad modal (drawn signature, Clear/Done). View shifts between laptop and tablet display for the signature step. Identical shape reused for CAF, MNP application forms, and Passport-to-QID forms.
- **Typical personas:** Retail Sales Agent, Tablet field agent, Customer (signer)

## Pattern 7: Cross-Sales / Migration Offer Acceptance Card
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-042, SCR-112, SCR-153, SCR-179
- **Description:** A grid of campaign offers (CampaignCode, OfferName, PromotionId, Type, Price, Status) with Accept / Interested / Reject / Close actions; Accept redirects directly into the relevant product wizard pre-seeded with the offer's plan.
- **Typical personas:** Retail Sales Agent, Retail/CRM Agent

## Pattern 8: Plan/Promotion Detail Modal with Limit Editing
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-114, SCR-165, SCR-166, SCR-172, SCR-174, SCR-188
- **Description:** Selecting/adding a plan opens a detail modal with editable Bill Limit / Credit Limit / Smart Limit fields, each with an "Edit X Limit" button revealing a constrained dropdown of pre-approved values. A Customize gear icon on configurable line items opens nested configuration. Validate fires dialogs when a limit conflicts with the account credit limit or falls below the Agent Minimum guardrail (SCR-167) — **this is the Bill Limit Agent Minimum rule** flagged as a priority rule implementation in `frontend-architecture.md` §5.
- **Typical personas:** Retail Sales Agent, Retail/CRM Agent

## Pattern 9: Appointment Booking Modal
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-028, SCR-049, SCR-083, SCR-109, SCR-115
- **Description:** Cluster selection (radio group) → calendar grid (next available date pre-selected) → time-slot pills showing live capacity (e.g. "14/15"). Optional booking-comments field; some variants offer "Book Unscheduled Appointment." Calendar bounded by the location's SLA cluster.
- **Typical personas:** Retail/CRM Agent, Field/desktop agent, Dispatcher/WFM user

## Pattern 10: Number Selection / Reservation Step
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-024, SCR-048, SCR-082, SCR-104, SCR-157, SCR-191
- **Description:** 8-digit search box + Free/Reserved toggle, matching MSISDNs shown as selectable priced tiles. Selecting triggers immediate reservation with a native-alert confirmation ("SUCCESS: Reservation Token:...(SBL-EXL-...)").
- **Typical personas:** Retail/CRM Agent, Tablet field agent

## Pattern 11: SIM/Device Serial Capture with Real-Time Inventory Validation
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-093, SCR-099, SCR-124, SCR-158, SCR-192
- **Description:** Barcode-scan-icon input(s) for SIM Serial/ICCID (and CPE Indoor/Outdoor serials for FWA/Dual-Play) validated in real time against UIM/inventory; blocks Continue with an inline error if blank/not-found/already-assigned. Same shape underlies SIM Swap's OCR→barcode→MOI→CBS chain.
- **Typical personas:** Retail Sales Agent, Field Technician, Tablet field agent

## Pattern 12: Document/Attachment Upload Panel with Mandatory-File Gating
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-050, SCR-074, SCR-100, SCR-161, SCR-170
- **Description:** Upload control + attachment library grid; per-document tiles show a checkmark once uploaded or a required-asterisk if mandatory-but-missing. Continue is blocked with an inline error until mandatory tiles are filled. Clicking a document opens a full-screen Attachment Viewer.
- **Typical personas:** Retail/CRM Agent, Tablet field agent

## Pattern 13: Activity/Comments Finalization Step
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-085, SCR-134, SCR-162, SCR-181, SCR-184
- **Description:** Terminal wizard step: free-text Comments (sometimes structured call-disposition fields: Channel, MSISDN, Type, Topic, Sub Topic, Area, Resolution Code, Status, Language), submitted via "Save and Finish," logging an Account Activities record.
- **Typical personas:** Retail/CRM Agent, Retail Sales Agent

## Pattern 14: Lead List + Owner/Status Management
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-141–SCR-150
- **Description:** A family of scoped list views (My Leads / My Created Leads / Team Leads / All Leads / Contact-scoped) over the same Lead entity, sharing a grid shape and a common Lead Details drill-down. Reject opens a Reason Code + Comment modal; reassignment opens a searchable Owner picker. Inline edit popups for Description and CallBack Date/Time (auto-transitions Lead Status). One of the most cleanly repeated CRUD patterns in the corpus.
- **Typical personas:** Retail Sales Agent, Manager/Approver, Admin, Back Office/Admin

## Pattern 15: App/Module Launcher Home Screen (Tile Grid)
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-040, SCR-053, SCR-056, SCR-077, SCR-107, SCR-119, SCR-168, SCR-176, SCR-187
- **Description:** "Welcome back `<Name>`!" tile-grid landing page, each tile a CRM module/journey launcher, role-scoped (e.g. a Manager's home reduces to Home + Order Approval). A "Choose process" variant narrows this to a small button set selecting which guided journey to start.
- **Typical personas:** All personas

## Pattern 16: In-Progress Journey Resume List
**Confidence:** `medium` · **Classification:** `Inferred`
- **Screens:** SCR-020 (clearest evidence), SCR-059, SCR-199/SCR-200 (related but not confirmed resume-into-wizard behavior)
- **Description:** A list of mid-flight journeys/orders (in-progress guided journeys, future-dated order requests) resumable from the last completed milestone. Only SCR-020 explicitly evidences true resume behavior — the others are "pending work" list variants, so this pattern is graded medium/inferred rather than fully explicit.
- **Typical personas:** Retail Sales Agent, Tablet field agent

## Pattern 17: Bulk Operation Portal
**Confidence:** `high` · **Classification:** `Explicit`
- **Screens:** SCR-001, SCR-002, SCR-009, SCR-010, SCR-090, SCR-183
- **Description:** Template upload with role-based access/filters, async processing, per-row success/failure reporting with re-upload of failed rows only, plus a companion Bulk Jobs orchestration-status screen. Explicit target-state replacement for today's Excel-macro processes.
- **Typical personas:** Agent, Fulfilment Agent, Dispatcher/Back-Office WFM user

## Pattern 18: Manager/Field-Technician Reassignment Dialog
**Confidence:** `medium` · **Classification:** `Inferred`
- **Screens:** SCR-089, SCR-146, SCR-055
- **Description:** Searchable list (technicians / lead owners / user responsibilities) → select row → complete reassignment, sometimes with a conflict warning (e.g. "Work zones mismatch"). The search-list-and-assign shape is consistent, but the three domains (WFM scheduling, CRM lead ownership, Siebel security) differ enough — and the evidence base is only 3 screens — to grade this inferred/medium rather than fully explicit.
- **Typical personas:** Manager/Approver, Dispatcher/Back-Office WFM user, Admin

---

## Build priority

Implement in roughly this order — earlier patterns unlock the most downstream screens:

1. Pattern 1 (Guided Wizard) + Pattern 2 (ID Lookup) — the backbone of nearly every activation journey
2. Pattern 10 (Number Selection), Pattern 11 (SIM Capture), Pattern 8 (Plan/Limit Modal) — the wizard's most complex steps
3. Pattern 6 (CAF Signature), Pattern 12 (Attachment Upload), Pattern 9 (Appointment Booking), Pattern 13 (Activity/Comments) — remaining wizard steps
4. Pattern 3 (Customer 360), Pattern 4 (Asset 360), Pattern 15 (Home Tile Grid) — navigation shells
5. Pattern 5 (Order Approval), Pattern 14 (Lead Management), Pattern 7 (Cross-Sales Offer) — workflow/queue screens
6. Pattern 17 (Bulk Operations), Pattern 16 (Resume List), Pattern 18 (Reassignment Dialog) — lower-frequency, more specialized

## Gaps

Two patterns (16, 18) are graded `Inferred`/`medium` on a thinner evidence base (2–3 screens spanning different domains) — treat their "reusable component" framing as a reasonable starting hypothesis to validate once more screens in that area are analyzed, not a certainty.

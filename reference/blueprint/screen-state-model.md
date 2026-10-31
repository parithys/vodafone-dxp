# Screen State Model & Entity State Transitions (Phase 25)

Two distinct things are catalogued here, kept separate because the corpus evidences them very differently:

1. **Entity lifecycle states** (§1) — genuinely evidenced, entity-by-entity, in `domain-model.md`. 41 of 83 entities have an explicit state machine in the source corpus (order statuses, billing collection status, number lifecycle, etc.).
2. **Generic screen UI states** (§2) — Initial/Empty/Loading/Success/Failure, the states every screen component needs regardless of which entity it displays. The corpus's legacy screenshots show these states incidentally (e.g. the FWA negative scenarios' "Validating Order, please wait..." spinner) but never as a documented, named state model — so §2 is an **Assumed** generalization, not an extraction.

---

## 1. Entity Lifecycle States (Explicit, from `domain-model.md`)

**41 of 83 entities** have an evidenced lifecycle. All are reproduced below (already listed individually in `domain-model.md`; consolidated here for the state-model view specifically — draft/submitted/approved/rejected states the phase asks for are covered wherever an entity's evidenced lifecycle includes them, e.g. Order and MNP Port-In Order below).

### 1.1 Order & approval-relevant lifecycles (most directly answer "draft/submitted/approved/rejected")

**ENT-001: Billing Profile / Billing Account** `Explicit` · confidence: `high`
- **States:** good standing, overdue, in collection, blacklisted; Active/Inactive
- **Sources:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`, `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`, `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` ...

**ENT-006: Order** `Explicit` · confidence: `high`
- **States:** open/pending/transient -> created (GSP layer) -> submitted -> PM-confirmed complete / Approved / Complete -> auto-completed/purged (~12 months); also Abandoned, Cancelled, Rejected (Correction/Drop Order) -> resubmitted
- **Sources:** `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`, `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`, `business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320` ...

**ENT-013: MNP Port-In Order** `Explicit` · confidence: `high`
- **States:** created -> consent pending -> submitted to NPAS -> donor accept/reject/conditional-accept -> porting window -> ported; rejection restarts the whole journey
- **Sources:** `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`, `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`

**ENT-014: FNP Port-In Order / Trouble Ticket** `Explicit` · confidence: `high`
- **States:** RFS check -> trouble ticket -> form/ID submission -> donor validation -> conditional/accept -> installation visit -> porting-date visit -> ported
- **Sources:** `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`, `vfq-fibre-brsd-v1-2-068eebe3`

**ENT-015: MSISDN / Number** `Explicit` · confidence: `high`
- **States:** reserved -> activated -> (post-port-in) barred outgoing (day 31) -> barred incoming (day 45) -> disconnected -> quarantine (30 days); Free -> Reserved/Blocked -> assigned to order -> Active
- **Sources:** `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`, `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`, `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976` ...

### 1.2 All other evidenced entity lifecycles

**ENT-002: Adjustment (Bill Adjustment)** `Explicit` · confidence: `high`
- **States:** request status (target state), failure/re-upload (target state)

**ENT-004: Bill / Hot Bill / Bill Simulation** `Explicit` · confidence: `high`
- **States:** unbilled -> hot bill -> billed

**ENT-017: Bulk SMS Account/Order** `Explicit` · confidence: `high`
- **States:** onboarding -> account/order creation -> active (billed via aggregated CDRs monthly) -> disconnection

**ENT-018: GigaHome/OSNtv Subscription** `Explicit` · confidence: `high`
- **States:** Try & Buy trial (first 2 months) -> active subscription -> (optional) Home Move / TON -> disconnection

**ENT-020: Trouble Ticket (TT)** `Explicit` · confidence: `high`
- **States:** created (not submitted = no queue routing) -> submitted/routed to queue -> assigned -> action window (2hr auto, extendable to 24hr) -> closed/resolved with resolution code; can be auto-rejected; Created (manual or auto) -> activities validated -> status change -> closed

**ENT-022: Transfer of Ownership / Transfer of Number (TON) case** `Explicit` · confidence: `high`
- **States:** created, routed through four queues (Managing, CDM, BOQ, QATQ), completed with SIM swap on success; raised, migrated to prepaid, transferred, on hold

**ENT-025: Customer Application Form (CAF)** `Explicit` · confidence: `high`
- **States:** blank template, filled/signed; generated (unsigned) -> signed (e-signature captured) -> attached/verified in Order Approval Attachments tab

**ENT-026: SIM** `Explicit` · confidence: `high`
- **States:** in-stock, issued

**ENT-028: Promotion / Plan / Product (bundled plan/discount/add-on)** `Explicit` · confidence: `high`
- **States:** active, changed

**ENT-032: KID (Karama ID / Kahramaa ID) / Service Point** `Explicit` · confidence: `high`
- **States:** Prepatched vs Non Prepatched drives whether Instant or Normal Activation / Combo Box detection prompt appears

**ENT-034: WFM Activity / Siebel Order Task** `Explicit` · confidence: `high`
- **States:** raised in WFM by technician -> creates Siebel order task -> Siebel task closed -> WFM activity closed -> agent notified; scheduled -> started -> Assess Activity -> Checklist -> Device Activation -> End

**ENT-035: CPE (Customer Premises Equipment) / ONT / Combo Box** `Explicit` · confidence: `high`
- **States:** in-stock, sold/assigned, freed on disconnection; installed -> modifiable (serial number update) -> active

**ENT-036: Address** `Explicit` · confidence: `high`
- **States:** primary, discontinued/replaced; Active

**ENT-037: Customer / Contact** `Explicit` · confidence: `high`
- **States:** Looked up -> confirmed -> edited fields marked with green checkmark; created -> validated (green check) -> linked to Account

**ENT-038: Account** `Explicit` · confidence: `high`
- **States:** Active

**ENT-039: Line Item / Line Item Attribute** `Explicit` · confidence: `high`
- **States:** Pending -> Complete; reached milestones progress to Complete

**ENT-040: Appointment** `Explicit` · confidence: `high`
- **States:** Booked (irreversible once confirmed) -> pending -> assigned -> started -> completed by technician (implied)

**ENT-041: Sales Order (see Order ENT-006)** `Explicit` · confidence: `high`
- **States:** see ENT-006

**ENT-045: Installed Asset** `Explicit` · confidence: `high`
- **States:** provisioned -> Active

**ENT-046: Order Approval / Activity (Approval Queue)** `Explicit` · confidence: `high`
- **States:** Ready To Assign -> Assigned -> Approved/Rejected; Closed

**ENT-048: Inventory Transfer Record** `Explicit` · confidence: `high`
- **States:** Transferred From ABATS -> Transfer To technician

**ENT-050: Billing Bucket / Data Bucket (Surepay Bucket)** `Explicit` · confidence: `high`
- **States:** Active

**ENT-052: Technician Resource / Inventory** `Explicit` · confidence: `high`
- **States:** Transferred From ABATS -> Transfer To technician

**ENT-054: Cross Sales Offer / Migration Offer** `Explicit` · confidence: `high`
- **States:** Offered -> Accepted/Interested/Rejected/Closed

**ENT-056: MNP Application Form (contract document)** `Explicit` · confidence: `high`
- **States:** generated -> signed -> attached

**ENT-057: Lead** `Explicit` · confidence: `high`
- **States:** New -> In Progress (Call Back/No Answer sub-status) -> Rejected / Lead Converted / Retired / Submitted / Assigned / Accepted

**ENT-060: Home Move Case** `Explicit` · confidence: `high`
- **States:** old service live until new location provisioned

**ENT-064: GigaHome Subscription Acceptance Form** `Explicit` · confidence: `high`
- **States:** Blank template -> customer-signed

**ENT-065: Kahramaa ID (KID) / Address Record** `Explicit` · confidence: `high`
- **States:** Prepatched vs Non Prepatched drives whether Instant or Normal Activation / Combo Box detection prompt appears

**ENT-067: Passport-to-QID Update record** `Explicit` · confidence: `high`
- **States:** initiated -> ID fetched via MOI Validation -> documents uploaded -> form generated/signed -> attached/finished

**ENT-068: Future Dated Order (FDO) request** `Explicit` · confidence: `high`
- **States:** Initial, In-Progress, Order Submitted, Success, Failed, Cancelled; In Processing, Processed, Error

**ENT-069: Activity (Customer Interaction)** `Explicit` · confidence: `high`
- **States:** Solved

**ENT-070: SIM Swap Order / Task** `Explicit` · confidence: `high`
- **States:** Created, Pending Approval, Assigned, Approved/Completed, Rejected/Dropped

**ENT-079: QTicket** `Explicit` · confidence: `medium`
- **States:** Generated at start of onboarding journey.

**ENT-080: Payment** `Explicit` · confidence: `medium`
- **States:** Captured -> receipted

**ENT-081: Identity Document (QID / Other ID / Passport)** `Explicit` · confidence: `medium`
- **States:** Captured -> validated -> scanned

---

## 2. Generic Screen UI State Model (Assumed — architectural generalization)

No source document names a formal screen-state taxonomy. The states below are inferred from *incidental* evidence (loading spinners, empty grids, error banners appearing across many guided-journey screenshots) generalized into a consistent model every screen component should implement, per `frontend-architecture.md`'s component architecture.

| State | When it applies | Evidence basis |
|---|---|---|
| **Initial** | First render, before any data fetch | Architectural default (Assumed) |
| **Loading** | Mock Data Engine call in flight (simulated latency) | `Inferred` from FWA Negative Scenarios EXC-008: "Validating Order, please wait..." spinner shown during a real backend call in the legacy system |
| **Empty** | Query succeeded, zero records (e.g. no leads assigned, no trouble tickets) | `Inferred` from list-pattern screens (Pattern 14 Lead Lists, Pattern 5 Approval Queue) implying a populated-vs-empty distinction, though no screenshot explicitly shows an empty state |
| **Success (populated)** | Query/action succeeded with data | Default rendered state shown in nearly all guided-journey screenshots |
| **Failure (error)** | Mock Data Engine / Rule Engine / Validation Engine returned an error | `Explicit` — see `exception-catalogue.md` for the full evidenced error catalogue |
| **Draft** | In-progress wizard, not yet submitted | `Explicit` — evidenced by Order (ENT-006: "open/pending/transient") and the resumable-journey milestone persistence capability (`journeys.md`, Reusable Pattern 16) |
| **Submitted (pending)** | Submitted, awaiting approval/processing | `Explicit` — Order ("submitted"), MNP Port-In Order ("submitted to NPAS") |
| **Approved** | Manager/Approver has approved | `Explicit` — Order ("Approved"), Reusable Pattern 5 (Order Approval Queue) |
| **Rejected** | Manager/Approver has rejected, or a backend validation hard-failed | `Explicit` — Order rejection flows (Reject-Correction / Reject-Drop Order, Pattern 5), MNP Port-In ("donor accept/reject/conditional-accept"; "rejection restarts the whole journey") |

**Implementation note:** map this generic model to Zustand per-screen local state (not a global store) — a screen's Initial/Loading/Empty/Success/Failure states are transient UI concerns, while Draft/Submitted/Approved/Rejected are properties of the underlying **entity** (§1) and should be read from `entityStore`, not duplicated as separate screen state. This keeps the two halves of this document properly separated in the actual implementation, matching why they're presented separately here.

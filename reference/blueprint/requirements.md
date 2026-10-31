# Requirement Consolidation (Phase 2)

Business/functional/non-functional/security/accessibility/reporting/workflow/UI/integration/validation requirements consolidated from workshops, BRSDs, and guided-journey walkthroughs. Where a source names a formal requirement/capability ID (e.g. MPAR_001_JSM_07, CAP-04), it is preserved in `source_requirement_ids`.

**Canonical items:** 308 (deduplicated from 354 raw extracted mentions across the 83-document corpus)

**Confidence:** high 280 · medium 27 · low 1
**Classification:** Explicit 307 · Inferred 1 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## Requirements by type

| Type | Count |
|---|---|
| Functional | 78 |
| Business | 53 |
| Validation | 44 |
| Workflow | 38 |
| UI | 31 |
| Integration | 29 |
| NonFunctional | 16 |
| Security | 14 |
| Reporting | 5 |

---

## Functional Requirements

### REQ-001: Billing Profile Unchangeable Identifier
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Full transcript (not just the summary) contains explicit functional requirement rows, a named decision, an FAQ Q&A, and a risk entry all describing the same requirement: the billing profile must carry the BRM row ID as an unchangeable correlation identifier synced to a unique CRM identifier, while the profile 'name' field remains optional, renameable, and customer-facing (appears in app/other channels). This directly links the requirement to the billing profile screen/entity and gives concrete field-level shape (name=optional/editable label; identifier=BRM row ID + CRM unique ID, immutable, synced).]
- **Related personas:** IT Operations, Agent
- **Related workflows:** Billing Profile management
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: keep the name renameable but add an unchangeable identifier (BRM row ID + unique CRM identifier) to correlate the two systems”

### REQ-002: Billing-in-Advance/Arrears/Hybrid Flag
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Full transcript gives the exact functional requirement statement, the requesting persona (Collections team), and a related enterprise-scope decision reconciling advance vs. arrears discount behaviour uniformly, which operationalizes the flag beyond just billing/barring.]
- **Related personas:** Credit Control
- **Related workflows:** Billing Profile management
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Collections requested a billing profile flag for billing-in-advance (PIA) / arrears / hybrid”

### REQ-003: DXP Bulk Adjustment Portal
`Explicit` · confidence: `high`

- **Related personas:** Agent, Manager/Approver
- **Related screens:** Bulk Adjustment Portal
- **Related workflows:** Bulk Adjustment Submission
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter”

### REQ-008: On-Demand Penalty/Commitment Calculation
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript gives an explicit functional-requirement list naming the exact guided journeys the calculation is bound to, plus a dedicated screen requirement for inquiry-only cases (no order raised) and a performance-driven rationale for choosing on-demand over automatic calculation.]
- **Related personas:** Agent
- **Related workflows:** Commitment/Penalty calculation
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: trigger the calculation from specific guided journeys (disconnection, MNP port-out, plan upgrade/downgrade, park number, put off) or an on-demand button, not on every view, due to performance impact”

### REQ-009: Bill Simulation Feature Distinct from Hot Bill
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript spells out the distinct purpose, naming, and regulatory constraint (not a tax invoice, cannot generate two invoices for same charges) as explicit functional/business requirement rows, plus the hot-bill journey definition for contrast.]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Hot bill (current unbilled + outstanding, does not change item status) is distinct from the newly-named "bill simulation" (shows disconnection implications/penalties without disrupting the upcoming bill; explicitly not a tax invoice; must state so on its face)”

### REQ-012: Volumetric Discount Proration on Mid-Cycle Change
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript contains explicit validation-rule-level detail: current discount cancellation config is 'full cycle' vs. the alternative 'prorate'; required behaviour differs by scenario (plan change = refund + charge back discount; cancellation due to dismay = keep charge, no refund); enterprise wants the advance-model behaviour applied uniformly to arrears too.]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Volumetric commitments/discounts: full-cycle discount cancellation setting causes overlapping discounts on mid-cycle changes, needs proration; behaviour must differ for plan change vs. cancellation, and for enterprise vs. consumer”

### REQ-016: Separate Email Fields for Personal vs Corporate Contact
`Explicit` · confidence: `high`

- **Related personas:** Chooser
- **Related screens:** Contact record
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “single email field on a shared contact record (personal vs. corporate email conflict; billing to multiple addresses)”

### REQ-019: CNAP Support (25-Character Limit)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile”

### REQ-020: Standardised Bulk Activation Templates on DSP with New Oracle Bulk Utility API
`Explicit` · confidence: `high`

- **Related personas:** Fulfilment Agent
- **Related screens:** Bulk Activation Template UI
- **Related workflows:** Bulk Activation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Target requirement: standardised bulk templates on the DSP front end using a new Oracle bulk utility API, supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles within a service; supporting activation, modification and deletion; reporting per-row success/failure status”

### REQ-022: Static IP Pool Search Capability
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “static IPs must be found manually in the pool (search does not work)”

### REQ-023: Bulk Number Reservation Template for DAPN
`Explicit` · confidence: `medium`

- **Related workflows:** DAPN Activation
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “numbers reserved one by one for DAPN with no bulk template”

### REQ-025: Quantity Propagation to Billing (Auto-Explode) for Licence Line Items
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “one line item per Microsoft licence with manual price changes because quantity does not carry to billing without "auto-explode"”

### REQ-027: ID-Based Installation Contact Capture
`Explicit` · confidence: `medium`

- **Related personas:** Technical Contact
- **Related screens:** Enterprise Order screen
- **Related workflows:** Enterprise Order Journey
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “the installation site engineer/point of contact is only captured as a free-text comment because a contact cannot be created without an ID — this causes appointment notifications to go to the wrong person”

### REQ-030: Enterprise Lead Management and Account Manager Task Tracking
`Explicit` · confidence: `high`

- **Related personas:** Account Manager
- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “Main functional gap identified: enterprise and SOHO/SME coverage — enterprise lead management, account manager tasks (the end-to-end process an account manager follows from a customer request for a new fixed line through to fulfilment, both in-system and out-of-system)”

### REQ-031: Enterprise Number Reservation and Number Locking
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “enterprise number reservation and number locking, short number reservation, and account-level/enterprise products”

### REQ-037: PDF/Excel Ordering Consistency and CDR Sorting
`Explicit` · confidence: `high`

- **Related screens:** Enterprise Invoice
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “match ordering between PDF and Excel; sort CDRs by date/time with a number filter”

### REQ-040: Reminder SMS Automation for MNP
`Explicit` · confidence: `high`

- **Related personas:** Customer
- **Related workflows:** MNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Key requirements raised include: reminder SMS automation, a single common journey across submitting channels, order/porting status visibility for all submitting roles, automated holiday-calendar handling for FNP target-date calculation, and automated preponement/postponement support for FNP”

### REQ-043: Automated/Removed Temporary MSISDN for MNP
`Explicit` · confidence: `high`

- **Related workflows:** MNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “the temporary number concept was agreed to be removed or fully automated on regulatory, security and inventory-wastage grounds”

### REQ-044: Automated Holiday/Ramadan Date Calculation
`Explicit` · confidence: `high`

- **Related workflows:** MNP Port-In, FNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “holiday/Ramadan date calculation is manual”

### REQ-046: Automated FNP Preponement/Postponement Support
`Explicit` · confidence: `high`

- **Related workflows:** FNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “automated preponement/postponement support for FNP”

### REQ-048: CAF unique serial/ID and naming convention
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction ties this to the same CAF view/sign journey and adds concrete business-rule detail on the current (as-is) naming scheme and the proposed unique key, which was compressed out of the summary: CAF is currently named by a QID+MSISDN convention with no true unique document ID, and the group agreed QID+MSISDN plus an additional internal variable would form the unique identifier, alongside an action item to 'finalise the unique CAF naming convention' and a dependency on moving documents into separate central storage.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF must have unique serial/ID and naming convention”

### REQ-052: Configurable business-admin-controlled CAF highlighted T&Cs
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction ties this directly to the CAF signature step and gives the concrete UI sequencing: when the agent clicks 'sign CAF' the screen goes to the signature pad, and an 'important points' screen showing 3-5 key T&Cs appears first (business-admin configured), the customer clicks through, then the full CAF appears for signature.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “a configurable, business-admin-controlled 'highlighted key T&Cs' section will be added to the CAF flow rather than agent-selected highlights”

### REQ-057: Multiple bill email recipients (CC) and multiple email types per contact
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “support multiple bill email recipients (CC) and multiple email types per contact (work/personal)”

### REQ-065: Auto-population of ticket fields from account/MSISDN context
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “auto-population of ticket fields from account/MSISDN context”

### REQ-072: Automate plan penalty, device dues and locking charges calculation
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Markitdown re-extraction of the source .docx surfaced a dedicated business-process-area section ("5. Contract Commitment & Penalty Automation") that decomposes this requirement into four concrete sub-capabilities the business expects, plus a note that commitment/penalty rules vary by product and require documentation/modelling. This links the orphan requirement directly to the MNP/FNP port-out and disconnection journey (Day 9 Session 2) rather than being a free-floating ask.]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Business requirement raised: system should calculate plan penalty, device dues and locking charges automatically”

### REQ-075: Restore Siebel email notification to group mailbox for ticket receipt/timer expiry
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “request to restore the Siebel email notification to the group mailbox for ticket receipt and timer expiry”

### REQ-076: Add real upgrade/downgrade differentiation logic
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value; Requirement raised to add real upgrade/downgrade differentiation in the new system”

### REQ-078: Automate postpaid-to-prepaid migration fee application
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers) — 'today it is not automated,' flagged as a revenue-leakage risk if forgotten”

### REQ-085: Auto-select numbers for fixed/prepaid to reduce agent clicks (mobile postpaid excluded)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks... NOT applied to mobile postpaid since those numbers carry a price”

### REQ-088: Digitalize the supplementary form
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “digitalize the supplementary form, currently a non-digital attachment”

### REQ-089: Add installation photo capture to instant activation journey
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “no photo-of-installation capture in the journey today — flagged as needed [00:10:01]”

### REQ-090: STB replay/scan functionality dropped due to required OSM changes
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “STB replay/scan functionality was dropped due to required OSM changes [00:11:20/00:11:29]”

### REQ-097: Split address line 1 into discrete searchable fields (KID/ZSB) without disrupting existing processes
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Requirement: split address line 1 into discrete fields searchable by KID or ZSB, WITHOUT disrupting current loading, search, invoicing, and email processes [00:07:45, 00:08:02, 00:11:24]”

### REQ-098: Maintain address with history (consistent between CRM and self-service)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “identical behavior required whether the update originates from CRM or self-service [00:13:46, 00:14:34, 00:16:12, 00:16:34]”

### REQ-100: Support split payment steps for party A and party B in TON flow
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “allow the journey to split into two separate payment steps for party A and party B (rather than forcing a single-flow structure) [01:14:19, 01:14:36]”

### REQ-105: Store all MOI-returned name fields (up to 5-6) and print on bill without truncation
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction ties this requirement to a specific journey step location: it is discussed as part of the postpaid new-connection journey's 'MOI validation' step (immediately following ID scan / IDWise), i.e. it belongs to the ID-capture/Contact screen of the retail postpaid journey, not a free-floating rule. The requirements table also logs it as a distinct functional item separate from the Q&A summary.]
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “ALL name fields MOI returns (up to ~5-6) must be stored and printed on the bill — not truncated to first/last name [00:32:41, 00:33:00]”

### REQ-107: Create virtual/dummy SKUs for digital eSIM to avoid inventory depletion
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “requirement to create virtual/dummy SKUs with no inventory for digital eSIM since WinCash otherwise expects inventory depletion for any SIM issuance [01:33:20, 01:36:44, 01:41:07]”

### REQ-119: Guided Journey vs Vanilla Action classification for CRM journeys
`Explicit` · confidence: `high`

- **Sources:**
  - [`crm-journeys-final-updated-a23640a5`](../.knowledge/docs/crm-journeys-final-updated-a23640a5.md): “Action Type: Guided Journey 17 (10.3%); Action through Vanilla 115 (69.7%); View Only 35 (21.2%)”

### REQ-123: Bill calculator SMS is a capability, not a full journey
`Explicit` · confidence: `medium`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The 'Bill calculator SMS is not a journey but a capability' annotation is attached to Page Type row #43: Journey Category=Support, Journey Type='Prorata Calculator', Type=Workflow/Task, Description='Calculating the Pro Rata Amount for MSISDN based on BC, Activation Date, Plan Change, Applied Discount and Send SMS with Auto Calculated amount', Comment='Action through Vanilla (Open UI desktop)', Guided journey Desktop=Yes, Tablet=Yes, Desktop vanilla=Yes, CBU=Yes, EBU=No. This links the orphan requirement to the specific 'Prorata Calculator' task and confirms its scope: a pro-rata billing calculation tied to Billing Cycle/Activation Date/Plan Change/Discount that concludes by sending an SMS with the auto-calculated amount - available as a guided journey on Desktop and Tablet plus Open UI desktop vanilla, CBU only.]
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “"Bill calculator SMS is not a journey but a capability,"”

### REQ-144: Do Not Disturb flag when customer refuses service
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “a DO NOT DISTURB button ("Set Do Not Disturb if the customer refused the service.")”

### REQ-154: System Must Support B2B2C Employer Association at Contact Creation
`Explicit` · confidence: `high`

- **Description:** Contact creation must support selecting a B2B2C employer/company from a dropdown list, associating the contact/account with that employer. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Full step detail recovered: the Company Name dropdown appears during the Contact step (after contact confirmation, before Address), lists specific selectable options, and the selection is proven to persist end-to-end — surfacing later on the CAF preview (linked company name appended to customer name), and post-approval on the Account record ('Special Management' = B2B2C Consumer) and Contact record ('Employer' field populated with the selected company) — giving both the UI field-level detail and the resulting entity/lifecycle effect. | In this Fixed Line document, the same Company Name B2B2C dropdown appears at the Contact step with a distinct, larger option list, and its downstream lifecycle effect is documented in even more depth than the Postpaid document — a dedicated 'Update B2B2C Employer' contact toolbar button, and post-approval Account/Contact Audit Trail entries proving the exact system fields modified (Sales Number, Parent Account Id) when the B2B2C linkage is applied.]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Company Name B2B2C dropdown: agent selects 'SIPT' from a company list"”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Company Name dropdown selector during Contact step; agent selects "01 newfreedcn01_Test"”

### REQ-160: System Must Provide a Dedicated Order Correction Journey/Tile
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6.md): “tablet's top menu now includes an extra tile "Order Correction" — this is the dedicated re-entry point for a rejected order”

### REQ-161: Appointment Booking Must Enforce Slot Capacity Limits and Show 'Full' State
`Explicit` · confidence: `medium`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6.md): “time-slot pills 8AM–11AM (selected), 11AM-2PM, 2PM-5PM, 5PM-8PM (F1 cluster booking flow)”

### REQ-162: Vanilla (Manual, Non-Wizard) Desktop Path Must Support Full FWA Activation via Contact->Account->Sales Order->Catalog->Line Items->Numbers->CPE Config
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"the agent drives Contact → Account → Sales Order → Catalog → Line Items → Numbers → CPE config manually screen-by-screen, rather than through a guided step wizard"”

### REQ-163: FMS CPE Bundle Configuration Must Support Indoor IDU, ODU, and Outdoor IDU Equipment Sub-Types
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Directly evidenced in the FWA Desktop Vanilla guided journey (item 12 of Key content), naming all three equipment sub-type options presented in the same dropdown/selector during FMS CPE Bundle configuration, confirming the requirement's exact scope (three named sub-types, not just 'indoor').]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent selects equipment sub-type FMS CPE Indoor IDU (vs. FMS CPE ODU / FMS CPE Outdoor IDU options)”

### REQ-166: Technician Must Complete Serial Number Check (Device Activation) Before Service Activation Succeeds
`Explicit` · confidence: `high`

- **Description:** Technician must scan/verify CPE Indoor, CPE Outdoor, and SIM Card serial numbers as a Serial Number Check before service activation is submitted, and must sequence Install Inventory (SNC) only after a Success status is returned from Service Activation. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Exact screen, fields, and sequencing constraint documented in steps 31-33: 'Serial Number Check - Dual Play' screen with three specific scan fields (CPE Indoor, CPE Outdoor, SIM Card) populated with real serial numbers, a submit confirmation naming the required next screen ('Install Inventory-SNC'), and a follow-on 'Service Activation Status: Success' gate before that step can proceed. | The requirement is directly and fully evidenced by a specific, ordered sequence within this same guided journey document: the technician opens the overflow menu and selects 'Serial Number Check - Dual Play' (image42), fills the Serial Number Check form with CPE Indoor, CPE Outdoor, and SIM Card fields each with a barcode-scan icon and submits (image43), receives the confirmation dialog instructing that Install Inventory (SNC) must only be performed after Success status (image44), sees 'Service Activation Status: Success' with instruction to perform Install Inventory (SNC) (image45), and only then does 'Install Inventory (SNC)' appear as an actionable overflow-menu item marked with a green square (image46). This traces the requirement to concrete journey steps 41-45 in this document.]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Serial Number Check - Dual Play" screen with barcode-scan fields: CPE Indoor, CPE Outdoor, SIM Card. Submit -> "Service activation request submitted successfully."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status."”

### REQ-167: Field Technician Must Capture Customer Signature at Installation Checklist and End of Activity
`Explicit` · confidence: `high`

- **Description:** Field technician installation workflow must capture a customer signature at the Installation Checklist and end-of-activity steps, alongside confirming customer-briefing checkboxes, speed test results, Wi-Fi credentials, timestamps, optical power readings, and photo attachments. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Document details the exact Installation Checklist fields, briefing checkboxes, and two distinct signature-capture points (during checklist submission and again at End activity), matching the requirement description precisely. | Two distinct signature-capture points are documented with their exact screen context: the Installation Checklist form (step 34-35, alongside customer-briefing checkboxes and speed-test/optical readings) and the separate 'End activity' popup (step 37, alongside Activity Remarks and Customer Available dropdown) which re-captures signature at close-out.]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Customer Signature box (blank at this point)... A hand-drawn Customer Signature is captured. Submit."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “All customer-briefing checkboxes checked ("Brief customer on package details", Wi-Fi 5G-first guidance, CPE/STB restart instructions...)”

### REQ-168: CSR Must Be Able to Modify Installed CPE Serial Number via Account 360 Modify Action
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): This document is itself the direct evidence for this requirement, showing the full journey: agent selects the FMS CPE Bundle row in the Installed Assets grid on Account 360 and clicks Modify (tooltip confirms 'Installed Assets:Modify'), drills into FMS CPE Indoor IDU details, and edits the Indoor Unit Serial Number field from S180P18055021 to S180P18055020. This is a complete, concrete step sequence linking the requirement to a specific screen and specific field edit.]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"agent selects the 'FMS CPE Bundle' row... and clicks the Modify button; a tooltip confirms the action as 'Installed Assets:Modify'"”

### REQ-169: CPE Attribute Modification Must Generate a Modification-Type Sales Order with Attribute-Level Audit
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fully evidenced in the same document: editing the serial number generates Order # 1-29737237878 with Order Type 'Modification', which proceeds Pending to Open to Complete, and the Line Items > Attributes tab records the change as a discrete row with Name 'Indoor Unit Serial Number', Value (new) 'S180P18055020', Action 'Update', Description (old value) 'S180P18055021', Data Type 'Text' — a complete attribute-level audit trail.]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Order # 1-29737237878... Order Type 'Modification'"; Line Item Attributes grid recorded Action 'Update' with old/new value”

### REQ-173: Guided-Wizard Desktop FWA Journey Must Support Existing Mobile Customer Adding New FWA Line
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"customer, YAM POKHAREL... already has an active Account... with one existing service: Postpaid U Start / Mobile Service Bundle..." then adds new FWA line”

### REQ-174: CAF Generation Must Offer Multiple Form Types (Digital, Manual, Touch Screen)
`Explicit` · confidence: `high`

- **Description:** CAF generation must offer a choice of channel-appropriate form types via a dropdown/split-button: CAF-Digital, CAF-Manual, and CAF-Touch Screen, consistent across FWA, Postpaid, and MNP Postpaid journeys. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Confirmed concrete journey linkage: in the MNP Postpaid journey's '8. CAF' step, clicking the 'CAF' action button opens a dropdown with exactly three options (CAF-Digital, CAF-Manual, CAF-Touch Screen), directly paralleling the MNP Form dropdown's two options (MNP-Digital, MNP-Touch Screen) one step earlier in the same journey — establishing both the specific screen (Step 8 - CAF accordion) and the UI control (split-button/dropdown on the 'CAF' action button) this requirement maps to. | The requirement's journey/screen link is directly evidenced and cross-confirmed in two separate guided journeys already in the corpus at high confidence: the Postpaid Open UI Desktop HRN journey's Step 9 (CAF) and the FWA Open UI Desktop Indoor journey's Step 8 (CAF), both showing an identical CAF split-button/dropdown offering CAF-Digital, CAF-Manual, CAF-Touch Screen. This consistent cross-journey pattern (same control, same three options, same step position) resolves the orphan status by tying the requirement to two concrete, named screens. | Same evidence as the postpaid-doc instance of REQ-174 above: the FWA Open UI Desktop Indoor guided journey (Step 8, item 10 of Key content) directly documents the CAF dropdown with the three named form types, giving this requirement a concrete screen link within this specific document.]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen."”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “A "CAF" split-button offers CAF-Digital, CAF-Manual, CAF-Touch Screen”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking 'CAF' opens a dropdown with three options: CAF-Digital, CAF-Manual, CAF-Touch Screen”

### REQ-178: Digital CAF generation with bilingual EN/AR content and e-signature
`Explicit` · confidence: `high`

- **Related screens:** CAF modal
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form"... digitally signed "KARTHIKK 18:09:2025 12:21:01"”

### REQ-180: Technician appointment reassignment (Move) with resource-match indicators
`Explicit` · confidence: `high`

- **Related screens:** Move dialog
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Resource candidates shown with schedule Gantt and match flags: Manoj Padinjarakandi (Work zones mismatch), Syed Irfan (ABATS, Work zones mismatch)...”

### REQ-185: Book Unscheduled Appointment option with irreversibility warning
`Explicit` · confidence: `high`

- **Related screens:** Book Appointment step
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue."”

### REQ-191: Editable Bill Limit and Credit Limit at plan/promotion selection
`Explicit` · confidence: `high`

- **Description:** The Plan step allows the agent to edit Bill Limit and Credit Limit values via dedicated Edit buttons/dropdowns from a bounded preset value list, consistent across MNP, Postpaid, and Pre-to-Post journeys.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Bill Limit: 150 (button: "Edit Bill Limit"), Credit Limit: 1000 (button: "Edit Credit Limit")”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Clicking Edit Credit Limit reveals a dropdown of selectable values: 0, 1000, 1500, 200, 2000, 50, 500, 800”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Credit Limit dropdown expanded showing options 1000, 200, 50 (highlighted/being selected), 500, 800”

### REQ-195: Order line items must reflect selected Smart Limit as a Bill Limit Mobile line-item attribute
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Line Item Attributes grid for the Bill Limit Mobile line shows: SL Default Value = 20, SL Limit Amount = 67 ... matches the Smart Limit accepted earlier”

### REQ-211: Identification number change form must be generated and require customer e-signature to complete
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “An Identification number change form is generated and the customer signs the contract ... Signature is captured in the generated form, then click Done”

### REQ-212: Cross Sales offer engine surfaces campaign-driven offers for existing customers
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Cross Sales Offers grid with Accept / Interested / Reject / Close action buttons and two system-generated offers... under CampaignCode C000009053”

### REQ-213: Cross Sales transaction can bundle a secondary Modification order onto an existing line
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “a second, later order 1-225218123343 (Modification, Complete...) — a linked follow-on transaction... adding a small add-on (2GB Data 12 months) onto one of the customer's other existing lines”

### REQ-215: CAF attachment upload supports file management (add/delete)
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Linked to screen SCR-161 (CAF/Attachments step, step 9 of the Postpaid wizard). Evidence shows the attachment list is a paginated grid ('1 - 10 of 19+') implying more than a single-file upload widget, plus explicit Continue/CAF/Cancel/Go Back actions surrounding it, giving more procedural context than the bare description.]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “an "Attachments" section: "New File" upload control, one file already attached — "PPVT TESTING SAMPLE.pdf" (with delete icon)”

### REQ-220: Credit Limit change must propagate to CAF, Sales Order, and Account record
`Explicit` · confidence: `high`

- **Description:** Changing the Credit Limit in the wizard must propagate consistently to the generated CAF, the Sales Order, and the Account record's pre-approved credit limit field.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “the new value flows into the generated CAF ("Account credit limit: 1000"), the Sales Order ("Credit Limit: 1,000"), and back onto the Account record's pre-approved credit limit field”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Pre-approved (Expatriate/Qatari): field now shows 50 (highlighted, matching the value chosen in the wizard)”

### REQ-223: B2B2C tagging must persist onto Account (Special Management) and Contact (Employer)
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Directly evidenced with before/after account and contact record screenshots in the same guided journey (items 2 and 27 for Account; items 1 and 25 for Contact), showing the B2B2C tagging did not exist pre-journey and appeared post-journey on both records, which is the concrete persistence proof requested.]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Account now shows Special Management: "B2B2C Consum..."; Contact Employer field now populated "VFQA_Test_Ma..."”

### REQ-226: Guided Pre2Post journey must support manual, free-text promotion search and selection
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “the agent to manually type a search term ("red") into a free-text promotion search box and pick a specific plan ... from a filtered grid”

### REQ-227: System must capture customer e-signature as part of CAF completion
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Same evidence chain as REQ-146 in this document: the e-signature capture (image10) is immediately followed in-flow by the signed CAF Section 3 (image11) showing the signature graphic embedded with a system-generated timestamp and consent/opt-out text, and then the Sales Order (image12) is created — establishing the concrete journey/screen link and ordering (Plan step -> CAF -> e-signature -> signed CAF record -> Sales Order) for this requirement.]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “"Please Sign" modal with a hand-drawn signature already captured on the signature pad”

### REQ-232: FDO must be raiseable via Open UI (Phase 1) with future support for additional channels (Phase 2)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO can be raised via Open UI (Phase 1) and, in future, other channels (Phase 2)”

### REQ-234: FDO notifications must be sent via SMS and billing email in English and Arabic for submission, reminder, execution outcome, modification, and cancellation, and logged as an activity
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Notifications: sent to MSISDN and notification MSISDN via SMS and billing email for submission, 3-day-before reminder, execution success/failure, modification, and cancellation ... every notification is logged as an activity visible to the agent”

### REQ-247: Installation Address and Service Feasibility Capability
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `CAP-14`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “CAP-14 Installation Address and Service Feasibility (New, RFS Portal)”

### REQ-253: Instant Activation eligibility detection and device serial verification
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FAR_002_INS_01..07`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Instant Activation: eligibility detection, device serial verification, instant/normal explicit selection, appointment auto-skip, immediate activation trigger, failure handling, tablet-only channel constraint”

### REQ-266: Draft order/milestone persistence for resume
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Same BRSD sheet: MPAR_001_JSM_08/09/10 explicitly describe milestone save and draft-order resume, which is the source evidence already cited in journeys.md/Reusable Pattern 16 (In-Progress Journey Resume List) — this requirement should link directly to that pattern and to UJ-005.]
- **Original requirement ID(s):** `MPAR_001_JSM_01..08`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “milestone/draft-order persistence for resume”

### REQ-286: Notification and Feedback Capability
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Mobile Postpaid BRSD's Capability Summary confirms CAP-13 'Notification and Feedback' (Notification Platform, Medilia) as one of the 13 formal capabilities. Links to notification-catalogue.md and Mobile Postpaid module.]
- **Original requirement ID(s):** `CAP-13`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “CAP-13 Notification and Feedback (Notification Platform, Medilia)”

### REQ-292: J017 Customer 360 Search by Customer No / Contact No / MSISDN
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review, applies to REQ-292/293/294):** the source deck self-labels this content "(only topics needs to be provided)" — a discussion topic list, not a finished spec — with accompanying UI mockups explicitly marked "Mock CTA" (wireframe placeholders). Independently re-scored 65/100 (Medium) with disposition "directional/illustrative only" for this specific content in a separate Phase 1.5 pass. Treat REQ-292/293/294 as an aggregation-scope sketch, not settled requirements, until a formal Customer 360 spec exists. See `journeys.md` UJ-106 and `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

- **Description:** The Customer 360 capability (J017) must allow an Assisted Care Agent to search for a customer using Customer Number, Contact Number, or MSISDN.
- **Original requirement ID(s):** `J017`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “search for customer by Customer No / Contact No / MSISDN”

### REQ-293: J017 Customer 360 Data Aggregation Across Sources
`Explicit` · confidence: `medium`

- **Description:** Customer 360 must aggregate data across nine sources: CDR/Usage, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Ticket History, and Order History.
- **Original requirement ID(s):** `J017`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “aggregate customer data across: CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Fetch Ticket History, Fetch Order History”

### REQ-294: J017 Customer 360 Retrieval Actions
`Explicit` · confidence: `medium`

- **Description:** Customer 360 must support retrieval actions for bill information, CDR information, network status, customer and order details, payment and billing details, and capture of all search criteria used.
- **Original requirement ID(s):** `J017`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Retrieval actions listed: retrieve bill information, retrieve CDR information, retrieve network status, retrieve customer and order details, retrieve payment and billing details, capture all search criteria.”

### REQ-296: J011 Cart Browsing Across Product Types
`Explicit` · confidence: `medium`

- **Description:** The onboarding cart must support browsing/selection across base plan, add-on, number, and device product types.
- **Original requirement ID(s):** `J011`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “cart browsing (base plan, add-on, number, device)”

### REQ-297: J011 SIM Handover Options
`Explicit` · confidence: `medium`

- **Description:** The onboarding journey must support both eSIM provisioning and Physical SIM handover/delivery as fulfilment options.
- **Original requirement ID(s):** `J011`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM handover options (eSIM, Physical SIM handover/deliver)”

### REQ-299: J023 Mobile Service Suspension Multi-Channel Request Intake
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** this requirement's sole source was independently re-scored 50/100 (Medium-Low, "Validation-only") in a separate Phase 1.5 pass, and its retail-channel framing **conflicts** with `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` (High confidence), which states manual suspension is explicitly "not a retail journey" — back-office/role-restricted only. Do NOT treat this as an agreed requirement without stakeholder confirmation. See `conflict-report.md` Conflict 3.

- **Description:** Mobile Service Suspension requests must be accepted through Email, Phone, or Retail Counter channels. [UNVERIFIED — see caveat above]
- **Original requirement ID(s):** `J023`
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “request service suspension (via Email, Phone, or Retail Counter)”

### REQ-302: J024 Mobile Service Resume Multi-Channel Request Intake
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** same issue as REQ-299 above. See `conflict-report.md` Conflict 3.

- **Description:** Mobile Service Resume requests must be accepted through Email, Phone, or Retail Counter channels. [UNVERIFIED — see caveat above]
- **Original requirement ID(s):** `J024`
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “request service resume (via Email, Phone, or Retail Counter)”

### REQ-305: Digitalized Consumer Application Forms
`Explicit` · confidence: `high`

- **Description:** Consumer application forms are digitalized end to end, with the exception of supplementary forms which are not.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “consumer application forms are digitalized except supplementary forms”

## Business Requirements

### REQ-011: Correct Activation Date for Fixed-Line Orders
`Explicit` · confidence: `high`

- **Related personas:** Fulfilment Agent
- **Related workflows:** Fixed Line Two-Phase Order Completion
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: create account/service at the correct activation date and escalate to the fulfilment session/PMs; revenue projection and 24-hour tax reporting requirements make back-dating non-compliant”

### REQ-021: Volumetric Discount Auto-Downgrade on Connection Drop
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller pandoc-plain extraction of the original transcript recovers the requirement explicitly logged in the workshop's own structured 'Requirements Identified' and 'Pain Points' tables, confirming this is a formally captured functional requirement (not just a passing remark), plus the exact business trigger/mechanism: eligibility is checked at the point connections are added, and slabs are re-evaluated only on addition, never automatically on removal.]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “volumetric discount ... has no automatic downgrade when connections drop — flagged as the key revenue-leakage pain point”

### REQ-026: Migrate Account-Level Products to Generic Services with Service IDs
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Major architectural ask: move away from account-level products to generic services with Service IDs, under which products (PTT, Microsoft licences, etc.) can sit”

### REQ-029: System-Enforced Fibre-Precedence Rule
`Explicit` · confidence: `high`

- **Related workflows:** 5G Indoor/Outdoor (FWA) Activation
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “key business rules such as fibre precedence over 5G are enforced manually, not by the system”

### REQ-032: Quarterly/Half-Yearly/Yearly Billing Cycles for Enterprise Products
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “enterprise asked that products be chargeable quarterly, half-yearly and yearly rather than the current monthly-only billing”

### REQ-060: Bill cycle change eligibility must be configurable, not hard-coded
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “business rule for change eligibility must be configurable, not hard-coded”

### REQ-063: Automate approvals for TON via rules rather than human approvers
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “automate approvals via rules (SAR number, contract minimum stay) rather than human approvers, limiting human involvement to exceptions”

### REQ-064: Regulatory requirement: commitment period continues across plan upgrade
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “regulation requires the original commitment to continue on upgrade (downgrade is a breach triggering a penalty)”

### REQ-087: Hide FNP capability pending execution-date reliability fix
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “FNP (Fixed Number Portability) will be hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission”

### REQ-094: Resolve whether home move is new order or modification order
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Open question/action item: should a home move be a new order or a modification order (unresolved) [01:23:49]”

### REQ-101: Document exact per-scenario TON validation checks for automation review
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “business to document exact checks per scenario for automation review [01:14:36]”

### REQ-102: Resolve who pays 50 Riyal TON fee (blocking automation)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Open/unresolved: who pays the 50 Riyal TON fee (currently left to the customer at store discretion — flagged as blocking automation of the receipt) [01:10:53, 01:11:25]”

### REQ-104: Remove reliance on prepaid-migration workaround for TON back-office approval delay
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “the line is migrated to prepaid BEFORE the TON is raised, purely because back-office approval takes ~20 days and validation is manual..."if validations can be automated in real time the migration step may not be needed" [00:55:16, 00:59:00]”

### REQ-116: Direct-marketing consent with USSD opt-out code
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Confirmed as a concrete clause located specifically in CAF Section 3 (For Postpaid Customers), immediately following the Postpaid Terms & Conditions/Privacy Policy acknowledgment — giving it a specific form-section anchor (not just a stray mention) and the exact USSD opt-out shortcode.]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “a direct-marketing consent clause with USSD opt-out code *200*321#”

### REQ-120: 165-row CRM journey/feature inventory classified into 5 Type categories
`Explicit` · confidence: `high`

- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “classifies each of the 165 CRM (Siebel/Open UI) journey/feature rows into one of five formal types (User Journey, Workflow/Task, View, Action, Access/Permission)”

### REQ-121: Traceability model requirement: User Journey to Access/Permission hierarchy
`Explicit` · confidence: `high`

- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “a generated end-to-end traceability model built from the 165 "Page Type" rows: User Journey → Workflow/Process → Task → View/Screen → Action → Access/Permission”

### REQ-124: Fair Usage Policy (FUP) throttling on 5G Home plans
`Explicit` · confidence: `high`

- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Fair Usage Policy (FUP): 1 TB / 2 TB / 10 TB per month; after full usage, speed throttles to up to 1 Mbps until next billing cycle”

### REQ-125: Plan and device lock-in with early termination penalty calculation
`Explicit` · confidence: `high`

- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “unfinished 12-month device lock-in → 500 QAR early termination fee; alternatively return the 5G CPE or pay 800 QAR CPE charge if not returned”

### REQ-127: Disconnection on declined Fibre migration
`Explicit` · confidence: `high`

- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “If the customer declines migration to Fibre, Vodafone may disconnect the current Home service after a 4-week grace period.”

### REQ-135: Cross Sales campaign offer auto-applies plan (no agent discretion)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “No plan-selection control is exposed — the journey auto-applies the plan tied to the accepted offer.”

### REQ-137: No editable add-on/discount control on cross-sell orders
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “no editable add-on control — confirming the agent cannot add extra discounts/add-ons on a cross-sell order”

### REQ-138: Appointment booking cannot be cancelled once confirmed
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): This requirement is directly and concretely linked in the same document to the 'Book Appointment' step (Step 6) of the New Fixed Line Fulfilment guided journey: the warning fires as a browser confirm dialog on Submit of the appointment modal, blocking or allowing continuation, immediately followed by a processing spinner and a success alert with a generated Appointment ID and a results table (Appointment Number, Technician ID, Status, Date, Channel, Activity ID, Time Slot). This supplies the exact screen/step link and surrounding validation flow requested.]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment.”

### REQ-158: Order Approval Screen Must Show Order Expiry Timestamp
`Explicit` · confidence: `high`

- **Description:** Order Approval screens must display an Order Expiry timestamp, implying an SLA/expiry policy on the approval action (shown in red on some screens).
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Order # 1-29795149137, Order Expiry 11/02/2026 10:01:17 AM"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Order Expiry: 07/09/2025 01:30:57 PM (red text — approval SLA)”

### REQ-175: System Must Notify Customer That Signed CAF Copy Will Be Emailed
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Directly evidenced in the FWA Open UI Desktop Indoor guided journey (item 10, CAF step) with the verbatim system alert text confirming this notification requirement and its exact trigger point (immediately after Sign Contract/Done on the signature pad, before order submission).]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"Notify customer that a copy of the CAF will be sent to his registered email address."”

### REQ-176: MNP/Switch Activation Prompt Advising Customer to Send Switch SMS to Short Code 151
`Explicit` · confidence: `high`

- **Description:** After MNP/switch-related CAF signature, the system must prompt the agent to advise the customer to send a switch SMS to short code 151 (at a stated SMS cost).
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"Advise customer to send switch to 151"”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “a browser alert dialog: '10.162.53.100:4443 says - Advise customer to send switch to 151. SMS costs 1Dhs'”

### REQ-184: Connection Details advisory for existing multiple postpaid connections
`Explicit` · confidence: `high`

- **Description:** System must surface a Connection Details modal (prepaid/postpaid connection counts) at the Contact step across FWA, MNP Postpaid, and Pre-to-Post journeys, with an advisory note when the customer already has 2+ postpaid connections. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): This Pre-to-Post document (high confidence, full 22-screenshot visual read) provides a second concrete instantiation of the Connection Details modal, at the same Contact step, confirming the pattern is identical in shape (Total Prepaid Connections / Total Postpaid Connections / Continue-Cancel) across journeys, differing only in the customer's specific connection counts (1 prepaid / 0 postpaid here vs 1/1 in the MNP Postpaid doc) — this cross-document consistency itself is the recovered evidence that the requirement is a single reusable UI component invoked identically at the Contact step regardless of journey. | The source document (guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv) already documents this requirement in full: the Connection Details modal appears automatically at the Contact step immediately after ID lookup, shows Prepaid/Postpaid connection counts, and for a customer with 2+ postpaid connections displays the exact advisory text plus a 'Show Postpaid Plan Details' expansion listing the customer's existing plans; critically, the walkthrough proves the advisory is informational-only -- the agent proceeds straight through to order completion (Status Complete/Fulfillment Complete) with the Approved checkbox left unchecked throughout, confirming no hard approval gate is enforced by the UI in the 'Without Approval' variant.]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “"Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 1, Button: "Show Postpaid Plan Details"”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Connection Details modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”

### REQ-188: Free Home Move eligibility for first-time movers
`Explicit` · confidence: `high`

- **Related workflows:** Home Move Happy Path
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “if first-time Home Move, customer is flagged "eligible for Free Home move"”

### REQ-193: Bill Limit Mapping configuration per Product Promotion (Spend Limit Mapping grid)
`Explicit` · confidence: `high`

- **Description:** Bill Limit values must be administratively configurable per product promotion via a Spend Limit Mapping grid (SL List Price, Agent Min Value, SL Min Value, SL Default Value, Default/Active Flags).
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill Limit Mapping tab -> 'Spend Limit Mapping' grid: two rows ... SL List Price, Agent Min Value, SL Min Value, SL Default Value, Default Flag”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Product Promotions admin — Bill Limit Mapping tab / Spend Limit Mapping applet: two mapped bill-limit products shown with SL List Price, Agent Min Value, SL Min Value, SL Default Value, Default Flag, Active Flag”

### REQ-197: Add-on selection must reference available Bill Limit headroom
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Info banner: 'Go back to Plan step and edit limit to cover for the add-on amount.'”

### REQ-205: My Leads view must exclude leads after ownership reassignment (owner-scoped visibility)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “the SAHID ANSARI/97431243124 lead is no longer present - the list now starts with the GRANADA/ALLAN lead ... after Owner Change, the lead is removed from the previous owner's My Leads view”

### REQ-206: My Created Leads view must remain creator-scoped regardless of ownership changes
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'My Created Leads' = filtered by Created By (HEMANTH), not by current Owner. This demonstrates ... the lead persists regardless of ownership changes”

### REQ-219: System must surface HRN advance payment requirement at Connection Details step
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “"(HRN) Customer needs to pay advance payment of QR 100."”

### REQ-233: FDO requests capped at 30 days lead time and cross-stamped with order ID in a custom table
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “maximum 30 days ahead for an FDO; order ID and FDO request ID are cross-stamped in a custom table”

### REQ-244: Design of new stack must be business-driven rather than technology-driven
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript confirms this as an explicit stated decision/direction, contrasting the current business-driven approach against the prior technology-driven Open UI build, appearing twice in the transcript (narrative summary and decisions table).]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “design will be business-driven this time, unlike the previous technology-driven Open UI build (01:09:29)”

### REQ-245: ECR to be decommissioned and not integrated with new stack; MCCR capabilities absorbed into new stack; VSA/BSA out of scope
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript confirms all three sub-decisions individually and with more nuance than the summary: ECR decommission (capabilities to be reconsidered, customer app stays), MCCR capabilities covered by the new stack (custom CRM portal/app to be used post-modernisation), and VSA/BSA explicitly out of scope (their own team makes any CAF changes on their side).]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “ECR will be decommissioned and not integrated with the new stack (00:04:42); MCCR capabilities will be absorbed into the new stack (00:05:03); VSA/BSA is explicitly out of scope”

### REQ-246: Consumer segment to be completed before enterprise segment in delivery sequencing
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript contains a distinct, more specific decision at 01:16:19 sequencing the actual workshop/design walkthrough itself (consumer postpaid/prepaid mobile discussed first, enterprise later), in addition to the narrative-summary mention at 01:53:53 that consumer would be completed before enterprise.]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “consumer will be completed before enterprise (01:53:53)”

### REQ-251: Address lock after RFS check
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FAR_001_RFS_07`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “address lock after check”

### REQ-252: IPTV bundled by default with base plan (removable)
`Explicit` · confidence: `medium`

- **Original requirement ID(s):** `FAR_001_QPC_02/03`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “IPTV bundled by default with base plan, removable — flagged in Open Items as contested with VFQ business preference”

### REQ-254: Instant Activation restricted to tablet channel
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FAR_002_INS_07`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “tablet-only channel constraint”

### REQ-257: Requirement status/owner/traceability missing (governance gap)
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-01`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “critical governance risk OI-01: 'no populated requirement status, owner or traceability identifier in any of the fourteen sheets' (noted as resolved in v2.0)”

### REQ-258: Fibre outstanding-dues threshold contradiction
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-04`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “fibre outstanding-dues threshold contradiction (should differ from mobility vs should be same)”

### REQ-260: VFID/KID mapping rule clarification needed
`Explicit` · confidence: `high`

- **Description:** Clarify and support the VFID/KID mapping rule, including many-to-many mapping cases explored for retail and enterprise scenarios.
- **Original requirement ID(s):** `OI-12`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-11/OI-12 open GTM data-flow frequency and VFID/KID mapping rule questions”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “support many-to-many KID/VFID mapping after exploring retail/enterprise cases”

### REQ-261: Enterprise/SMB fibre scope gap
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-21`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-21 enterprise/SMB fibre scope gap flagged as material risk”

### REQ-262: Mobile Postpaid BRSD baseline dependency
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-23`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-23 dependency on Mobile Activation BRSD being baselined for stable cross-references”

### REQ-263: FNP process diagram needed
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-29`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-29 FNP process diagram needed”

### REQ-267: Acceptance criteria updates for 18 named requirements (v2.0)
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `MPAR_001_JSM_07; KYC_20; CAM_04; CAM_11; ECC_11; ECC_18; ECC_19; BAM_02; BAM_10; BAM_13; QPC_10; NUM_11; SIM_07; CVC_06; CAF_02; ORD_11; NOT_06; NOT_07`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “v2.0 (2026-08-10) — acceptance criteria updated for 18 named requirements”

### REQ-271: Field-level spec gaps to be supplied by VFQ
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-01`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “VFQ to supply field-level spec gaps (D-01)”

### REQ-272: Plan-price-to-Star-Number-price eligibility matrix required
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-02`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Product team to supply plan-price-to-Star-Number-price eligibility matrix (D-02)”

### REQ-273: CAF template matrix by role/channel/service type required
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-03`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “CAF template matrix by role/channel/service type (D-03)”

### REQ-275: Notification templates/triggers/recipients required
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Sourced from BRSD Dependency D-05 (notification templates/triggers/recipients not yet supplied at BRSD-drafting time) — this dependency is now resolved by this blueprint's own Stage F work: notification-catalogue.md was built directly from data/SMS Templates.xlsx with 24 templates and explicit trigger conditions. The BRSD's dependency is satisfied by cross-referencing that file.]
- **Original requirement ID(s):** `D-05`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “notification templates/triggers/recipients (D-05)”

### REQ-276: Outstanding-dues threshold confirmation by Collections
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-07`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Collections to confirm outstanding-dues thresholds (D-07)”

### REQ-277: HRN advance payment matrix required
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-08`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “HRN advance payment matrix (D-08)”

### REQ-290: Cluster naming change 1-4 to F1-F4
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “cluster naming changed 1-4 → F1-F4”

## Validation Requirements

### REQ-010: Unbilled Usage Screen Mandatory Filters
`Explicit` · confidence: `high`

- **Related screens:** Unbilled Usage Screen
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced”

### REQ-014: Mandatory CR-Number Search Before Account Creation
`Explicit` · confidence: `high`

- **Related personas:** Fulfilment Agent
- **Related screens:** Account Creation screen
- **Related workflows:** Enterprise Account Creation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation”

### REQ-015: Sub-Account Linking Validation
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “no validation when linking sub-accounts to parents”

### REQ-017: Structured Privilege Identifier (Replace Free-Text Job Title)
`Explicit` · confidence: `high`

- **Related personas:** Chooser
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “free-text job title used as the privilege identifier (no validation)”

### REQ-058: Asynchronous email verification before next bill generation
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “emails captured as unverified at entry, verified asynchronously via callback before next bill generation”

### REQ-077: Automate prepaid-to-postpaid migration eligibility checks
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

### REQ-081: QID scan-and-attach required only for transactions with account/service change
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “split retail scenarios so that complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step”

### REQ-091: ZSP email/address fields validated for presence only, not format (data-quality gap)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “ZSP entry mandatory but email/address fields are validated for presence only, not format — flagged as a data-quality gap/requirement [00:22:22, 00:23:58]”

### REQ-111: Passport without customer signature exception (Prepaid activation, ref 2.1.13)
`Explicit` · confidence: `high`

- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Added exception for prepaid activation business rules — passport without customer signature (ref 2.1.13)”

### REQ-112: Mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Markitdown re-extraction of the source PDF located both instances of the ZSB business rule (Prepaid business rule #15, ref 2.1.15; Postpaid ECR business rule #12, ref 3.1.12) and both give the same concrete definition: ZSB = Zone, Street, Building detail of the customer's location, mandatory to capture 'in activation journey' -- i.e. this attaches directly to the Address step of both Prepaid and Postpaid consumer activation journeys, which matches the Zone/Street No./Building No./Apt-Flat-Unit fields already independently evidenced in every Guided Journey Address step in this corpus (e.g. FWA Outdoor B2B2C step 6, Fixed Line Tablet step 6).]
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “added mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)”

### REQ-115: Vodafone Fibre Supplementary Form required for Home Fibre
`Explicit` · confidence: `medium`

- **Description:** Home Fibre and B2B2C FWA orders require a Vodafone Fibre/Home Supplementary Form/T&Cs acceptance as a mandatory attachment; currently non-digital and flagged for digitalization. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript confirms the requirement is specifically to digitalise the home/FWA/OSN supplementary T&C form as either a second CAF page or a dedicated form, and separately confirms the interim decision: it will be added as a static additional TNC-only page (no dynamic parameters) to the same CAF, tied to what the customer is buying. | The already-extracted summary itself (this document is already the fullest available text per its own extraction notes - all 68 screenshots visually read) contains a direct journey link for this requirement: the Supplementary Form is shown as one of exactly four attachment tiles in Step 8 (CAF & Additional Attachments) of the 'New FWA Tablet' guided journey, is marked required (asterisk), and its absence produces a specific, quoted validation error blocking Continue. This is concrete evidence of exactly which journey/screen/step the requirement attaches to, plus the validation behavior. | The Consumer Postpaid CAF V4 document (Section 4 — Superfast Broadband & Home Phone) explicitly names the requirement as a signed acknowledgment clause tied to the Home Fibre section of the CAF form itself, and the General T&Cs page separately states the supplementary form is mandatory specifically for Home Fibre service activation — giving a concrete document/section link (Section 4 of form PCA001) rather than just a passing mention.]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Home Fibre requires Vodafone Fibre Supplementary Form”
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “digitalise remaining manual forms (star number, transfer of number, FNP, disconnection, temporary MBB, home/FWA supplementary T&Cs)”
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “the FWA_Indoor & Outdoor_Negative Scenarios doc lists a "Mandatory Supplementary form" validation step likely referring to this document”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “attachment tiles then appear: Proof of Employment* (required), CAF* (green check once signed), Supplementary Form* (required), Add File (optional)”

### REQ-117: Enforce mandatory-field validation catalog on contact records
`Explicit` · confidence: `high`

- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: First Name, Last Name, Nationality, Email, ID Type, ID Number, ID Expiration Date, Preferred language, Birth Date, Alternate/Cellular Phone #, Gender”

### REQ-128: One-time-per-QID free-months offer restriction
`Explicit` · confidence: `high`

- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Free-months offer is usable once per QID; moving to a new location forfeits reuse; disconnecting/reconnecting under the same or a different QID forfeits the offer and risks account suspension/blacklisting.”

### REQ-131: Duplicate fiber service at same location check (home move lead trigger)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Checking if QID already having fiber, if yes lead for home move”

### REQ-133: eSign requirement in digital fiber activation flow
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Contact number and email; appointment if applicable, eSign”

### REQ-136: QID field locked/read-only after Cross Sales redirect
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “the QID (28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter it.”

### REQ-140: Alt. phone # must be a local mobile number used for notifications
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Same Step 1 Contact confirmation form in the New Fixed Line Fulfilment journey; the field sits alongside Email and Language and is validated (green checkmark) after entry, giving the exact screen/field position and validation behavior.]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “info note: "This is a notification contact. Please enter a local mobile number."”

### REQ-145: Required ID front/back photo uploads before Contact step continues
`Explicit` · confidence: `medium`

- **Description:** Both Qatari ID front and back photos must be captured/uploaded (shown as required with green-check validation) before the journey can continue past the Contact step, across Fixed Line and Prepaid journeys.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front and Qatari ID-Back photos both uploaded (green check icons)”
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “two empty upload placeholders "Qatari ID-Front" / "Qatari ID-Back" ... green checkmarks (uploaded)”

### REQ-146: E-signature required to complete CAF before order submission
`Explicit` · confidence: `high`

- **Description:** A digital signature pad ("Please Sign"/Clear Signature/Done) is required to capture the customer's e-signature to finalize the CAF/MNP form across Fixed Line, MNP, Postpaid, and Pre-to-Post journeys; the signed CAF must be locked from edits post-signature. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The e-signature requirement is now traceable to specific journey steps and screens: it fires in the MNP Postpaid journey's '7. Donor Attachment' step (on the MNP-Digital Mobile Number Portability Application Form) and again in the '8. CAF' step (on the Vodafone Customer Application Form). Both forms show a 'Sign Contract' button leading to a signature capture pad, and the signed result is timestamped/attributed to the agent. | Transcript confirms the CAF e-signature capability as a functional/non-functional requirement (signature is the sole mechanism, no tick boxes, must lock the CAF from edits post-signature) across the guided journeys named. However, the specific UI widget labels ('Please Sign'/'Clear Signature'/'Done') cited in the orphan requirement's description do NOT appear anywhere in this transcript -- that literal control-label detail must originate from a different source (a Guided Journey screenshot document), not this meeting recording, so only the underlying requirement (not the exact widget copy) is recoverable from this document. | The document shows the exact screen sequence and journey link for e-signature: the signature pad step (image10, 'Please Sign' modal with Done/Clear Signature) sits between CAF completion (image9, 'Sign Contract' button) and the signed CAF record (image11), where the captured signature becomes a permanent part of the CAF with a system timestamp and consent text, confirming this is a mandatory gate before the Sales Order is created (image12, order created in Pending status right after signing). | The e-signature pad requirement is directly evidenced twice within the single MNP Postpaid journey (once for the MNP/Donor Attachment form, once for the CAF), each producing a stored signature image plus an agent-ID + timestamp audit record -- confirming this is a reusable, repeated capability applied at multiple points/journeys, not isolated to Fixed Line. | Confirmed as a specific, ordered step (step 15, between SIM Serial/CAF preview and the CAF & Additional Attachments upload step) in the B2B2C New Postpaid With Approval journey, with the exact resulting signature stamp format captured downstream in the signed CAF attachment reviewed by the manager, proving the signature is bound to the CAF and persisted with agent-name + timestamp.]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Signature capture. "Please Sign" pad opens; agent captures the customer's signature; Clear Signature / Done buttons.”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Please Sign" modal with a hand-drawn cursive signature already captured on the line, and "Clear Signature" / "Done" buttons”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “signature capture pad ('Please Sign') shown ... Done / Clear Signature buttons”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Signature capture — "Please Sign" pad; customer signs; Clear Signature / Done buttons”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “"Please Sign" modal with a hand-drawn signature already captured on the signature pad”
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “signed CAF must not be editable after signing (01:47:31)”

### REQ-148: Order rejection requires reason selection and drives re-collection of specific fields
`Explicit` · confidence: `high`

- **Description:** Rejecting an order requires selecting/entering a reason (e.g. "ID image not clear"), which drives the correction flow to re-require the flagged evidence, and the reason is logged in Activities History for audit.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “the correction flow re-requires the flagged evidence (ID photos) per the "ID image not clear" rejection reason”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Activities History tab shows a list of closed activities with Order Approval column values of Approved or Rejected (with rejection comment 'ID image not clear' seen for two Mitra Kharel entries)”

### REQ-170: Address Step Must Validate Required Fields Before Save
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Full step-level detail recovered: this is the Address step's client-side required-field validation in the 'New FWA Tablet' guided journey (Sales Order menu variant), specifically triggered by clicking Save Address with Zone/Street No./Building No./Apt-Flat-Unit/Area all blank, producing a blocking modal dialog with an OK button. A related but distinct variant exists in the Business/Static Data journey which offers a 'Skip Address' escape hatch instead of a hard block.]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”

### REQ-182: Required attachment set for B2B2C FWA orders (Proof of Employment, CAF, Supplementary Form)
`Explicit` · confidence: `high`

- **Description:** B2B2C orders (FWA and Postpaid) require Proof of Employment, CAF, and Supplementary Form attachments, each individually validated, before the wizard allows Continue.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “attachment tiles then appear: Proof of Employment* (required), CAF* (green check once signed), Supplementary Form* (required), Add File (optional)”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “"Error: Please select Proof of Employment before continuing."”

### REQ-186: Kahramaa duplicate-installation check during Assess Activity
`Explicit` · confidence: `high`

- **Description:** During technician Assess Activity, system checks the customer's Kahramaa (KID) against installation records from the last 30 days (FWA) and validates KID eligibility for Home Move.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"No previous records are found based on Kahrama ID in last 30 days."”
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

### REQ-187: Fiber-readiness check for Home Move destination (KID lookup)
`Explicit` · confidence: `high`

- **Related workflows:** Home Move Happy Path
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"”

### REQ-189: Comments field minimum length validation on Activity Portal
`Explicit` · confidence: `high`

- **Description:** The Activity/wrap-up step requires an agent comment (minimum 5 characters on Home Move's Activity Portal) before Save and Finish, to document actions performed for other advisors.
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “note states "Comments field should have more than 5 characters"”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “info note: 'Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.' Button: Save and Finish”

### REQ-192: Agent Min Value guardrail on Bill/Smart Limit editing
`Explicit` · confidence: `high`

- **Description:** Bill/Smart Limit values entered by an agent must be validated against a configured Agent Minimum Value per product/promotion, blocking journey progression if set below it (error code SBL-EXL-00151), consistent across MNP, Postpaid, and Pre-to-Post journeys.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “'Bill Limit can not be set lower than Agent Minimum 50' fires when the entered Smart Limit (28) is below the Bill Limit Mobile promotion's configured Agent Min Value (50)”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)"”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “"When agent enters below Agent minimum value" (implies a rejection/blocking behavior)... "When agent enters above Agent minimum value, user can proceed the journey"”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit can not be set lower than Agent Minimum 80 ... (SBL-EXL-00151)”

### REQ-203: Reject Lead action must require Reject Reason Code selection from a controlled taxonomy
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Reject Reason Code dropdown expanded: options include Competitor selected, Do Not contact, Duplicate lead, Failed to reach contact, Identity unknown, Incorrect data, Ineligible, Insufficient Funds, Is a partner, Left company (scrollable, more below)”

### REQ-210: Passport-to-QID journey requires scan/upload of QID Front & Back images before continuing
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Scroll down, then Scan or Upload the QID - Front & Back, then click Continue”

### REQ-218: Bill Limit editable per-order with warning about max = credit limit
`Explicit` · confidence: `high`

- **Description:** Bill Limit is editable per-order, with the system warning the agent that the maximum permissible Bill Limit equals the account Credit Limit and instructing communication of this to the customer; validated in both Postpaid and Pre-to-Post journeys.
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.”

### REQ-224: System must prompt override confirmation when Special Management account attempts non-B2B2C journey
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The summary (screenshot 7, direct visual read) already contains the exact verbatim dialog text, its trigger condition (Account carries a pre-existing Special Management field value), the two available actions (OK/Cancel), and the confirmed downstream effect of clicking OK (journey proceeds as standard consumer/non-B2B2C sale) plus the backend field it references (Special Management = 'CBU Test' on the Account record, shown later in the same walkthrough) -- this is a complete override-confirmation flow specification, not just a label.]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “"The Account has already Special Management field value. Do you still want to continue the journey without B2B2C"”

### REQ-231: System must display existing prepaid/postpaid connection counts before allowing a new/converted connection to proceed
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Connection Details modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”

### REQ-236: System must prevent dropping an order that has not gone through Order Approval
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “If without Order Approval Any user try to Drop the Order the below error will appear”

### REQ-242: CAF/attachment file size must not exceed ~4MB
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript confirms the exact figure via a direct Q&A exchange and a risk entry noting the size limit is a constraint on adding supplementary T&C pages.]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “CAF/attachment size limit ~4MB (01:47:35)”

### REQ-250: Proof-of-address upload size limit
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FAR_001_RFS_08`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

### REQ-278: Order Billing Profile must match Line Items' Billing Profile
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Direct re-extraction of Order Validation Business Rules.xlsx confirms ORD_VALD_RULE_001 ('Order Billing Profile must match Line Items' Billing Profile'), Step/Process Path 'VFQA Validate Order Process Workflow'. Links to Order Management module and UJ-051/UJ-054 (Order Correction / B2B2C Fixed Line order approval) which already reference order validation in workflow-execution-matrix.md and test-scenario-catalogue.md's Order Management scenarios.]
- **Original requirement ID(s):** `ORD_VALD_RULE_001`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Order Billing Profile must be same with Line Items' Billing Profile”

### REQ-279: Business account cannot submit pending order if open order exists
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): ORD_VALD_RULE_005 ('For business account, pending order cannot be submitted if open order exists under it') — already cited directly in test-scenario-catalogue.md's Order Management negative scenarios (TC-ORD series). Links to Order Management module.]
- **Original requirement ID(s):** `ORD_VALD_RULE_005`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “For business account, pending order cannot be submitted if open order exists under it”

### REQ-280: Serial Number required for SIM CARD product
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): ORD_VALD_RULE_019 ('Serial Number is required for SIM CARD product') — already cited in test-scenario-catalogue.md's Order Management scenarios. Links to Order Management module and SIM & Number Management module.]
- **Original requirement ID(s):** `ORD_VALD_RULE_019`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Serial Number is required for SIM CARD product”

### REQ-281: All Payments must be Authorized before order proceeds
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): ORD_VALD_RULE_030 ('All Payments should be Authorized') — already cited in test-scenario-catalogue.md's Order Management scenarios. Links to Order Management module and Billing & Adjustments module.]
- **Original requirement ID(s):** `ORD_VALD_RULE_030`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “All Payments should be Authorized”

### REQ-282: DNO Verification Attachment required for MNP Port-In order
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `ORD_VALD_RULE_110`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “DNO Verification Attachment is required for MNP Port-In order”

### REQ-283: FL Address must include KID
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `ORD_VALD_RULE_161`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “FL Address must have KID in it”

### REQ-284: Bill Limit Value cannot exceed Credit Limit
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `BL RULE 07`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bill Limit Value cannot be more than Credit Limit!”

### REQ-285: IoT vs Non-IoT MSISDN length validation
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Direct re-extraction of Order Validation Business Rules.xlsx found ORD_VALD_RULE_058 ('For Non IoT service, MSISDN length should be 8') and ORD_VALD_RULE_060 ('For IoT service, MSISDN length should be 10'), both under Step 'IOT Validation', Process Path 'VFQA Validate Order Process Workflow --> VFQA Validate IOT Order process Workflow'. Links to Enterprise/IoT/B2B module and ENT-011 IoT SIM/Device entity.]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT)”

### REQ-295: J011 Onboarding ID-Type-Dependent Validation
`Explicit` · confidence: `medium`

- **Description:** The onboarding journey must validate identity differently based on ID type: QID triggers MOI Validation, while Other ID/Passport triggers manual capture and validation of details.
- **Original requirement ID(s):** `J011`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID type branching (QID → MOI Validation; Other ID/Passport → capture/validate details)”

### REQ-300: J023 Suspension Requires Cleared Unbilled Balance
`Explicit` · confidence: `medium`

- **Description:** Before submitting a Mobile Service Suspension order, any pending/current unbilled amount must be cleared.
- **Original requirement ID(s):** `J023`
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “"Pending Bill, Current unbilled must be cleared"”

## Workflow Requirements

### REQ-018: Chooser Off-Boarding Process
`Explicit` · confidence: `high`

- **Related personas:** Chooser
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “no off-boarding process for choosers who leave a company”

### REQ-028: Order Form Template Standardisation and Sharing
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Action items: share the order form template; finalise and share the 5G process document; share the RFS portal views on Teams”

### REQ-041: Single Common Journey Across Submitting Channels
`Explicit` · confidence: `high`

- **Related workflows:** MNP Port-In, FNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “a single common journey across submitting channels”

### REQ-045: Handover Process Between Order-Raising and Document-Collection Teams
`Explicit` · confidence: `high`

- **Related personas:** Fulfilment Agent
- **Related workflows:** MNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “no defined handover between the order-raising team and the outsourced document-collection team on the same order”

### REQ-061: Auto-resolved ticket even on disallowed bill cycle change
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “a ticket is always created even when a change isn't allowed, but auto-resolved in real time”

### REQ-066: Segregation of requests vs complaints with different SLAs
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “segregation of requests vs. complaints with different SLAs (current in-system SLA is 24 hours, flat)”

### REQ-067: Enhanced auto-assignment to agent level based on availability
`Explicit` · confidence: `high`

- **Description:** Enhance ticket auto-assignment logic to route to agent level based on availability, adding parameters and enabling real-time rule updates without requiring system changes.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “enhanced auto-assignment to agent level based on availability”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Enhanced Auto-Assignment — improve logic with additional parameters and real-time rule updates without system changes”

### REQ-069: Automatic escalation on ticket delay
`Explicit` · confidence: `high`

- **Description:** Automatically escalate delayed tickets, rule-based, to Supervisors/Owners/Teams via email based on predefined criteria.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “automatic escalation”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Automatic Escalation — rule-based escalation to Supervisors/Owners/Teams via email based on predefined criteria”

### REQ-074: Direct queue assignment instead of manual ticket export/distribution
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “manual export and distribution of 200–300 tickets a day instead of direct queue assignment (bulk owner change is possible as a workaround)”

### REQ-083: Club eligibility (customer/QID + location) checks at one early journey point
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “eligibility checks (customer/QID eligibility and location eligibility) will be clubbed together at one point early in the journey, before plan/service discussion”

### REQ-084: Move KID-in-use proof requirement to start of journey
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “move the KID-in-use document/proof requirement to the START of the journey rather than the end, since the system already knows about the conflict at the location-check step”

### REQ-092: Replace order cancellation with in-place update on outdoor-to-indoor fallback
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Decision/requirement: replace order cancellation with an in-place order update when falling back outdoor→indoor before provisioning [00:50:09, 00:51:57]”

### REQ-093: Automate FWA-to-fiber migration (future automation target)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Flagged as a target for future automation (follow-up task)”

### REQ-099: Automate TON to target 70-80% of cases with business rule engine
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Decision: automate wherever feasible — target ~70-80% of TON cases — with remaining exceptions routed to manual tickets; make TON business rules configurable (business rule engine) [01:02:04, 01:08:56]”

### REQ-103: Resolve WinCash payment sequencing and disconnection trigger timing in TON
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “whether WinCash payment should occur early or late in the flow, and whether disconnection triggers before or after payment [01:06:53, 01:08:06]”

### REQ-113: Postpaid registration rejection handled directly by Fulfilment (no email round-trip)
`Explicit` · confidence: `high`

- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “v3.0 (Sep 29, 2019): removed post-paid registration rejection handling (Fulfilment now rejects directly, no email round-trip)”

### REQ-126: Mandatory Fibre migration within 4 weeks of availability notice
`Explicit` · confidence: `high`

- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Vodafone will notify the customer when Fibre becomes available; customer agrees to migrate to Fibre within 4 weeks of notification.”

### REQ-130: Digital self-service fiber activation journey (Phase 1 key flow)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Location entry by KID; Display and selection of plans based on RFS; If previously having Combo Box, confirming combo box: QID, selfie scan; Contact number and email; eSign; Provide with network”

### REQ-142: Attachments step may be skipped (per named variant)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “per the file's stated scope, this step is completed by clicking Continue without uploading any attachment”

### REQ-143: Prepatched device detection prompts Instant vs Normal Activation choice
`Explicit` · confidence: `high`

- **Description:** System must detect a pre-patched Combo Box CPE/ONT at the customer premises via Kahramaa ID lookup and prompt the agent to choose between Instant Activation and Normal Activation, requiring serial number verification.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681... Proceed with Instant Activation?"”

### REQ-147: Manager order approval requires attachment verification (QID front/back + CAF)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Attachments tab (active — shows QatarIdFront, QatarIdBack, CAF, all green/verified)”

### REQ-150: Only one correction round permitted before approval-only re-review
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Reopening the order approval detail this time shows only Approve and Reject - Drop Order (the "Reject - Correction" option is no longer offered, since one correction round has already occurred)”

### REQ-152: Prepatched/Non Combo Box detection skips shared-infrastructure selection step
`Inferred` · confidence: `medium`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Because the KID is Prepatched ... no separate "Combo Box" selection or shared-infrastructure step ... appears anywhere in this flow — the journey goes straight from Address confirmation to Plan selection.”

### REQ-155: Orders Requiring Approval Must Route to a Manager Queue With Assign-To-Me
`Explicit` · confidence: `high`

- **Description:** Orders requiring approval (B2B2C and others) must route to a shared manager Order Activities/TM SR Queue spanning multiple guided journeys, where a manager can Assign To Me; approval carries an Order Expiry/SLA timestamp.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"TM SR Queue View — Order Activities Queue"... "Manager clicks 'Assign To Me'"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Activities grid shows multiple pending orders including the target: Journey "New FWA Tablet"... Owner VFQA_DSA_ORDER_APPROVAL_QUEUE_TESTING. Button: Assign To Me.”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"Your activation request order number: 1-29710853118 is submitted for approval..." Order Expiry: 20/08/2025 08:39:01 AM”

### REQ-157: Approval Actions Must Support Approve, Reject-Correction, and Reject-Drop Order
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back."”

### REQ-165: CPE/SIM Inventory Must Be Transferable from Warehouse Team to Assigned Technician Before Installation
`Explicit` · confidence: `high`

- **Description:** CPE/SIM non-serialized inventory must be transferable between technician resources (e.g. warehouse to field technician) via OFSC-integrated inventory transfer, one item at a time, with completion confirmation. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Document gives the full step sequence and screen link for this requirement: Excel 'VFQ Inventory Loading' -> Field Service Import add-in ('Resource Inventory Import') syncs quantities into OFSC (Resource Id ABATS) -> Move dialog reassigns technician -> Inventory Management Non-Serialized Inventory Transfer screen transfers 3 parts one at a time from ABATS (warehouse resource) to Syed Irfan (field technician) -> OFSC plugin confirmation dialog. | Full screen-level realization already documented in steps 20-25: the 'Inventory Management > Non-Serialized Inventory Transfer' screen (SCR-090), showing source technician/team (ABATS), items added one-at-a-time via 'Add To Transfer List' (outdoor CPE, indoor CPE, SIM/test item), a 'Transfer List' tab with Total Items and Current Owner/Transfer To fields, 'Start Transfer' action, and a completion confirmation dialog plus downloadable Inventory Transfer Report (xlsx).]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Inventory Management" > "Non-Serialized Inventory Transfer" tab, "Transfering From: ABATS"... Transfer To 'Syed Irfan'”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Inventory transfer has been completed. Closing the plugin screen..."”

### REQ-177: Guided wizard multi-step FWA order creation (Contact through Activity)
`Explicit` · confidence: `high`

- **Related workflows:** New FWA Postpaid Outdoor Order
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Steps 3-6 all 'Saved!' (image 12)... Order completion (image 24)”

### REQ-181: Manager approval workflow for flagged orders (multi-journey shared queue)
`Explicit` · confidence: `high`

- **Related workflows:** New FWA Tablet Indoor B2B2C, New FWA Tablet Indoor With Approval
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Activities grid shows multiple pending orders including the target: Journey "New FWA Tablet"... Owner VFQA_DSA_ORDER_APPROVAL_QUEUE_TESTING. Button: Assign To Me.”

### REQ-190: Cross-sales offer acceptance launches the corresponding guided journey
`Explicit` · confidence: `high`

- **Description:** Accepting a Cross Sales offer (e.g. New MNP, New Postpaid) must launch the corresponding full guided journey/provisioning wizard rather than a separate custom flow.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “MNP Postpaid guided journey launches — Step 1. Contact, with Connection Details popup... establishing the complete 9-step structure of the MNP Postpaid journey”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “After accepting the "New Postpaid" offer, breadcrumb changes to "You are here: Postpaid - Contact:" — the journey has now handed off into the standard New Postpaid provisioning flow”

### REQ-196: Post-signature operational instruction popup (send switch SMS to 151)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “a browser alert dialog: '10.162.53.100:4443 says - Advise customer to send switch to 151. SMS costs 1Dhs'”

### REQ-200: Order must be cancellable at Donor Attachment / CAF stages before submission
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Footer buttons: Sign Contract, Close, Cancel Order”

### REQ-216: Activity/wrap-up step requires call-disposition metadata and comment
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Linked to screen SCR-162 (Activity/call-disposition step, step 10, final step of the Postpaid wizard). The document additionally shows the finalize action name and the follow-on system confirmation message that fires once the comment is filled and submitted, tying this requirement directly to order completion.]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “call-disposition form: Channel, MSISDN, Type, Topic, Sub Topic, Area, Resolution Code, Status, Language, empty Comments box with helper text”

### REQ-229: Autobase wizard must collapse manual cart/catalog/quote steps into a single Accept + 3-step confirmation flow
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “The agent journey collapses to a 3-step accordion wizard (Contact → Offer Summary → Activity) instead of a manual cart/catalog/quote flow”

### REQ-255: Fixed Line Migration eligibility/verification/WFM appointment
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FIB_MIG_RTL_003_01..07`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “migration eligibility, verification, service availability, existing-service retrieval, order capture, WFM appointment, telesales collection flags”

### REQ-301: J023/J024 Customer Communication on Suspension/Resume
`Explicit` · confidence: `medium`

- **Description:** The suspension and resume workflows must each send a communication to the customer as part of the process.
- **Original requirement ID(s):** `J023; J024`
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “send communication to customer (J023 suspension)”
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “send communication to customer (J024 resume)”

### REQ-303: Ticket Creation Journey Standardization Across Channels
`Explicit` · confidence: `high`

- **Description:** Proposed enhancement to define and streamline the end-to-end ticket creation journey uniformly across all channels.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Creation Journey — define/streamline end-to-end ticket creation across all channels”

### REQ-307: Prepaid Offshore Manual Activation by Third Party
`Explicit` · confidence: `high`

- **Description:** Offshore (airport) prepaid activations are manually processed by a third-party partner, producing an Accept or Reject outcome. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Slide 3 ('VFQA | Prepaid Activation Offshore') is a full ordered swimlane process-flow diagram with actor lanes and sequential steps, which the original summary compressed into a single sentence. The fuller shape-level extraction (ordered left-to-right by x-position) recovers the complete step sequence with actors: Customer -> Request for Prepaid; Offshore Sales -> Raise Prepaid Order; Offshore Fulfillment -> Retrieve Order; Offshore Fulfillment -> Order Validation; Offshore Fulfillment -> Accept/Reject (branching); branch outcomes Reject / Accept feed into System -> Automatic Provisioning and Offshore Fulfillment -> Send Report, with a 'Process Enhancement' callout tag on the Send Report/Provisioning stage. Also recovered: presenter's note 'Tech Recommendation: Can be pushed same as before,' clarifying this flow is being carried forward unchanged into the target state.]
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “offshore airport prepaid sales are manually activated by a 3rd party partner, with Accept/Reject outcomes”

### REQ-308: MVA Customer-Initiated Requests Routed as Reports
`Explicit` · confidence: `high`

- **Description:** Customer requests created via MVA (Vodafone App) are currently sent as a report to a team, who then contact the customer and manually raise a ticket in the system — an indirect, non-automated intake path flagged as current-state.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “"Currently the customer can create requests from MVA which is being sent as report to a Team to contact customer and raise tickets in System."”

## UI Requirements

### REQ-007: Summarised Bill Landing View
`Explicit` · confidence: `high`

- **Related screens:** Bill landing view
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Bill display: requested summarised bill landing view (MRC, VAS, VAT), search inside bill for enterprise, unified usage view — constrained by whether BRM exposes needed APIs”

### REQ-035: Invoice Redesign - Banner/Table Layout Fix
`Explicit` · confidence: `high`

- **Related screens:** Enterprise Invoice
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Specific asks: resolve banner/table overlap by reducing banner size and adding page-level subtotals”

### REQ-036: Invoice Line-Item Grouping by Service ID/Circuit ID
`Explicit` · confidence: `high`

- **Related screens:** Enterprise Invoice
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “group line items under service ID/circuit ID with one-off charges linked to their circuit; add tax code and tax number placeholders; display service ID for account-level and other services”

### REQ-038: Discount Line-Item Presentation Correction
`Explicit` · confidence: `high`

- **Related screens:** Enterprise Invoice
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “correct discount presentation so discounts appear as two line items (prorated and month-in-advance) shown against the charge they apply to”

### REQ-042: Port Status Visibility for Agents/Field Teams
`Explicit` · confidence: `high`

- **Related personas:** Fulfilment Agent
- **Related screens:** Siebel order screen
- **Related workflows:** MNP Port-In
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Siebel only shows in-progress/failed with no port status visibility for agents/field teams”

### REQ-050: Customer 360 single-page tab-based partial refresh
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “customer 360 must be single page with tab-based partial refresh”

### REQ-053: In-progress journeys list on agent login page
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction ties this to the tablet journey / journey-resumption discussion, with a concrete design mechanism (internal milestones, e.g. cart creation, gate persistence) rather than just the login-page placement already known.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “an 'in-progress journeys' list will appear on the agent login page”

### REQ-056: Confirmation message updated to reflect order submission (not activation)
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction ties this directly to the post-submission/order-status screen flow and the specific owner and rationale (provisioning still routes through OSM/Siebel post-submission), plus the concrete Q&A confirming the account is not activated at submission time.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “confirmation message text to be changed from 'account activated' to 'order submitted successfully' since provisioning still goes through OSM/Siebel after submission”

### REQ-071: Make public ticket notes as prominent as bell icon notifications
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “make public notes as prominent as the bell icon (agents currently miss them)”

### REQ-080: Number management portal search experience definition
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Full markitdown re-extraction of the source .docx recovered a direct Q&A exchange (compressed out of the .md summary) that defines the number-search experience scope concretely: customers may search/request numbers by connection type (mobile, IoT, fixed line), by tier (golden or platinum numbers), or by specific digit combinations (e.g., a number ending in the customer's date of birth), and the agent fulfils this today by logging into the number management portal and showing the customer matching combinations. This directly answers what 'search experience needs to be defined' means substantively, and also gives an explicit scope statement ('functional' requirement row) confirming the portal is in scope with the search experience as an open item to define.]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “confirmed the number management portal IS in scope for the new solution and its search experience needs to be defined”

### REQ-082: Surface indicator of recent My Account app access on agent usage/balance view
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “requirement raised to surface this on the agent's usage/balance view”

### REQ-086: Pre-select next available appointment date/slot bounded by SLA cluster
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “appointment step to be enhanced to pre-select the next available date/slot..., calendar selection bounded by the location's SLA cluster”

### REQ-108: Design retail journey as single scrolling flow, not multi-page navigation
`Explicit` · confidence: `high`

- **Description:** Design guided journeys as a single scrolling flow rather than multi-page click-through navigation, with fewer clicks, default/skip of irrelevant steps, and landing the agent on a summary.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “design the journey as a single scrolling flow rather than multi-page "next click" navigation [01:58:06]”
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “make journeys scrollable with fewer clicks, default/skip irrelevant steps, land agent on summary”

### REQ-129: Bilingual (English/Arabic) customer-facing forms
`Explicit` · confidence: `high`

- **Description:** All customer-facing forms (5G Home acceptance form, CAF across journeys) must be presented bilingually in English and Arabic. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The document links this bilingual form requirement to a specific journey/screen: the FWA Postpaid Outdoor guided-wizard journey, Step 8 (CAF), CAF-Digital modal, applied to the New FWA Outdoor Postpaid order. The bilingual EN/AR 'Vodafone Customer Application Form' contains the full form structure (Sections 1-4: Applicant details, Billing information, For Postpaid Customers, Superfast Broadband & Home Phone) plus full Vodafone Qatar General Terms and Conditions text in EN/AR. | This same journey document contains the direct screen link: the CAF screenshot (image9) is a bilingual English/Arabic Customer Application Form used specifically in the Pre-to-Postpaid conversion journey, with Section 1/2/3 headers rendered in both languages and 'Sign Contract'/'Close and Retry' actions. This ties REQ-129 concretely to journey 'Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer)' and screen 'CAF (Customer Application Form) - image9', closing the orphan link. | The bilingual CAF pattern is corroborated across two independently-mined Guided Journey documents (Fixed Line Instant Activation AND MNP Postpaid HRN), not just one, and appears at two distinct points in the MNP journey (Donor Attachment / MNP Application Form, and CAF at step 8) -- establishing this is a cross-journey, repeated UI pattern, not a one-off. | The guided-journey summary itself (already high-confidence, direct visual extraction) shows the concrete evidenced screen this requirement links to: the bilingual CAF is generated and rendered as part of Step 9 (CAF) in the 'Open UI Desktop - New Postpaid Activation for an HRN Customer' guided journey, and the same bilingual CAF rendering is independently cross-confirmed in the FWA Indoor guided journey (Section headers rendered in both English and 'استمارة عميل فودافون' Arabic). This gives the requirement a concrete journey/screen link (Step 9 CAF screen in both the Postpaid HRN and FWA Indoor guided journeys) that resolves the orphan status.]
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “A bilingual (English page 1, Arabic page 2) customer-signed acknowledgment form”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “bilingual (Arabic/English) 'Vodafone Customer Application Form' ('استمارة عميل فودافون')”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Bilingual English/Arabic form "استمارة عميل فودافون / Vodafone Customer Application Form."”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “A bilingual (Arabic/English) "استمارة عميل فودافون / Vodafone Customer Application Form" is rendered”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Bilingual English/Arabic form "استمارة عميل فودافون / Vodafone Customer Application Form."”

### REQ-141: Separate billing-email opt-in requires confirmation modal
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The document gives the full modal flow for this requirement: it is triggered as part of Step 1 Contact in the New Fixed Line Fulfilment journey immediately after IDM creation succeeds, presented as a popup titled 'Fixed Line IPTV' with an info banner, a checkbox to opt into a different billing email, a Billing Email field, and an Ok confirmation button — concrete field-level detail for the confirmation modal.]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a popup titled "Fixed Line IPTV" appears with info banner "IDM Created Successfully", a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field”

### REQ-151: Approve action requires explicit verification acknowledgment
`Explicit` · confidence: `high`

- **Description:** The order Approve action requires the approving manager to explicitly acknowledge document/detail verification (checkbox/statement) and enter a comment before submission.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"By clicking submit, I agree that I have verified all the documents and details to proceed with submission."”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Manager clicks Approve, opening an "Approve Order" dialog: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission." Comments field — manager types "Approved"”

### REQ-153: Order Completion Notification Must Include Order Number
`Explicit` · confidence: `high`

- **Description:** Order completion confirmation messages across journey types (Fixed Line, Postpaid) must include the generated order number. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The exact same completion-message pattern ("<Journey> completed successfully. Order Number:- '<order#>'") recurs verbatim in the MNP Postpaid journey with a different order number, confirming this is a standard, reusable system dialog pattern across journey types (Fixed Line AND MNP/Postpaid), not a single-journey quirk. | Directly evidenced in the tablet B2B2C guided journey (item 24 of Key content), showing the exact completion modal text including the literal order number placeholder pattern, and independently cross-confirmed by the desktop FWA Indoor journey's final Sales Order screen also surfacing an order number (1-29729896060) at completion. This gives a concrete screen link (Order completion confirmation modal, step following 'Save and Finish').]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Fixed Line completed successfully. Setup and test at customer location.. Order Number:- '1-29792357564'"”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “"Postpaid completed successfully. Order Number:- '1-29726606734'"”

### REQ-156: Manager Approval Screen Must Expose Attachments, Order Details, Activities, and Agent Details Tabs
`Explicit` · confidence: `high`

- **Description:** The manager approval screen must present four tabs — Attachments, Order Details, Activities, Agents Details — consistently across guided journeys.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Tabs: Attachments, Order Details, Activities, Agents Details"”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Four tabs: Attachments, Order Details, Activities, Agents Details”

### REQ-194: MNP Form selectable by channel type (MNP-Digital / MNP-Touch Screen)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking 'MNP Form' opens a dropdown with two options: MNP-Digital and MNP-Touch Screen”

### REQ-198: MNP guided process must present a Postpaid/Prepaid process choice before any data entry
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'MNP Guided Process: Choose process' with two buttons: Switch as Postpaid and Switch as Prepaid”

### REQ-202: Service Needed dropdown must offer a conditional 'Fixed Pre-sales' field for Home service
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “After selecting Home, a conditional field 'Fixed Pre-sales' appears (Yes/No) - this field only shows for the Home service type”

### REQ-207: Lead detail layout must expand to a richer 3-column view with additional fields at Admin/back-office level
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “a richer layout with tabs Lead Details / Activities / Address / Product Recommendations and action buttons Validate, Submit (greyed out), Assign To Me, Send SMS, Product Recommendations”

### REQ-217: Complex product (bundle) customization/runtime instantiation UI
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The summary (screenshots 7-9, direct visual read) already contains full field-level and structural detail for the complex-product runtime instantiation/bundle customization UI: named configurable sections, radio-button selection patterns, a nested Customize sub-panel with Spend Limit Amounts/Discount Options tabs and specific action buttons, and the resulting bundle sub-line breakdown with per-line Action/Data Type/pricing detail.]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Complex Product Runtime Instantiation — customization screen: multiple configurable sections (VAS Flex-purchase Prepaid Opt-in, Extra Cabling Charges, Bill Limit, Smart Tracker Device, Lego Addons, Negative Priced Addons)”

### REQ-221: Add-on/Discount step must clearly indicate empty state when nothing applicable
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Confirmed as a specific inline UI info note appearing on the Addon & Discount step (step 4 of the guided wizard), immediately below the Select Add-on/Select Discount buttons, in a context where a discount actually WAS applied (QR 25 Discount for 6 Months) alongside the empty-state note — showing the note is a persistent UI element regardless of whether the selector is populated or not.]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Info note: "if there are no applicable add-on or discount, the selector will be empty."”

### REQ-222: Star/Free/Reserved number tab selection during Number Selection step
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Directly evidenced in the tablet B2B2C guided journey's Step 5 (Number Selection), item 14 of Key content, showing the exact tab set and which tab is active by default plus the selection/reservation behavior tied to that tab.]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “tabs Star Number / Free Number (active) / Reserved Number”

### REQ-237: Desktop must provide dedicated navigation to view all SIM Swap orders and all pending SIM Swap orders
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Sales Order Icon -> All Sales Order -> top-menu dropdown with options "All SIM Swap Orders" and "All Pending SIM Swap Orders."”

### REQ-239: Present a key-terms summary (lock-ins, penalties, fencing) before CAF signature
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript gives the explicit functional requirement and its concrete content scope (lock-in periods, star number information, home device penalties, 5G fencing), directly tied to the pre-signature step of the CAF journey.]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “present a key-terms summary before CAF signature (lock-ins, penalties, fencing)”

### REQ-249: Installation address cascading zone/street/building selection
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `FAR_001_RFS_01..08`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “installation address capture, cascading zone/street/building selection, RFS search by address/KID/area, address auto-fill, service-type display, CPE/ONT detection, address lock after check, proof-of-address upload ≤2MB”

### REQ-291: Drop displaying all KIDs on ZSB page in RFS Portal
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “drop displaying all KIDs on the ZSB page in RFS Portal”

### REQ-304: Ticket Segregation by Type
`Explicit` · confidence: `high`

- **Description:** Proposed enhancement to provide distinct views/handling for four ticket categories: Requests, Complaints, Channel Complaints, and System-Generated Tickets.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Segregation — distinct views/handling for Requests, Complaints, Channel Complaints, System-Generated Tickets”

### REQ-306: Signature Capture Method Differs by Channel
`Explicit` · confidence: `high`

- **Description:** Signature capture for application forms differs by sales channel: retail stores use a digital signature pad; Direct Sales uses a tablet. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The fuller python-pptx extraction (which recovers table footnotes that the earlier summary paraphrased) shows this rule is a footnote directly attached to slide 8's 'Types of Application Forms' table, which itself enumerates exactly which channels/form-types the digital-CAF vs manual-signature split applies to (Prepaid, Postpaid/Fixed, Star Number, Giga Home Supplementary, Transfer of Number, MNP, FNP — each cross-tabbed by OPEN UI/ECR/VSA/WEB/MVA channel). This directly links REQ-306 to a specific screen/table structure (the Types of Application Forms matrix) rather than being a free-floating claim.]
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “retail stores use a digital signature pad while Direct Sales use a tablet”

## Integration Requirements

### REQ-005: DXP as Single Consumption Layer for CRM-BRM Content
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript ties this decision directly to a specific screen/journey: the unified Adjustments view. Purely operational (CRM-only) screens stay in CRM; the mixed CRM+BRM adjustments view moves to DXP with source-system tabs removed, and only IT operations keeps vanilla Siebel/BRM access.]
- **Related personas:** IT Operations
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: mixed CRM-BRM content will be served from DXP with no source-system tabs; only IT operations retains vanilla Siebel/BRM access”

### REQ-047: Digital signature pad migration off OpenUI
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The fuller transcript extraction gives a precise journey link: this requirement is a sub-step of the 'CAF view and sign journey' [00:06:31] — 'Agent clicks view CAF form, the CAF appears on the customer tablet where the customer can review the CAF and sign at the bottom; on submit the view returns to the agent laptop.' The signature-pad migration is one of six explicit functional requirements tied to that same journey step (view-shift laptop→tablet→laptop, isolated CAF popup only, no full platform redirect), and the Referenced Systems table explicitly names both endpoints: OpenUI (today) and 'the custom Siebel/Sierra frontend' / DXP (target).]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “digital signature pad must move from OpenUI integration to the new custom Siebel/DXP frontend”

### REQ-049: WinCash integration for zero-payment transactions
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction links this to the 'Postpaid checkout journey' [00:30:59] (checkout → generate CAF → sign CAF → capture payment/WinCash handover → submit order) and adds the underlying business rule/trigger: any retail transaction, including a zero-payment modify order, requires a WinCash receipt, and WinCash's role extends beyond payment to device stock checks.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “WinCash must be integrated even for zero-payment transactions to print receipts”

### REQ-051: Screens align to PIP pre-built APIs rather than new custom APIs
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “screens should align to PIP pre-built APIs rather than new custom APIs”

### REQ-073: Bring NPass MNP/FNP form documents into Siebel via ticket attachment
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Key request raised: bring those documents into Siebel via the ticket attachment, subject to NPass API design/availability”

### REQ-096: Integrate TR069/TORUS for mesh configuration
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “TR069/TORUS (mesh config, not yet integrated)”

### REQ-106: Use MOI API as primary ID-data source with Tarasol/manual fallback
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction confirms this requirement is scoped to the same 'MOI validation' journey step and adds the precise fallback/precedence logic and validation trigger: MOI is queried by ID number + expiry date; OCR-captured data is cross-checked against MOI on at least two parameters (e.g., DOB, nationality, expiry) before MOI is allowed to override; a mismatch raises an explicit error rather than silently defaulting to a source.]
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “MOI API is the primary ID-data source (Tarasol/manual is fallback only if MOI API doesn't respond) [00:30:22]”

### REQ-134: Fulfilment routing rule: CPE/ONT vs 5G lead type
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “If CPE/ONT, then order to Vodafone FF to fulfill; If 5G lead to Vodafone”

### REQ-149: System notifies customer via SMS on order rejection and approval
`Explicit` · confidence: `high`

- **Description:** System must send SMS notifications to the originating agent/customer on both order rejection (with correction instructions) and order approval outcomes.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"New Fixed Line Tablet for MSISDN 97441224278 with Order number 1-29795232313 is now approved. You can check the order status in My Sales Order."”
  - [`guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6.md): “OSB CreateCommunication payload: "...was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

### REQ-159: Rejected Orders Must Notify Originating Agent via SMS with Correction Instructions
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-with-ap-430ea4f6.md): “OSB CreateCommunication payload: "...was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

### REQ-164: WFM Appointment Booking Must Integrate with Oracle Field Service Cloud for Technician Scheduling and Dispatch
`Explicit` · confidence: `high`

- **Description:** WFM appointment booking for FWA outdoor installs must integrate with Oracle Field Service Cloud (OFSC) for technician scheduling/dispatch, generating an Appointment ID tied to a technician resource. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Document explicitly confirms OFSC as the WFM backend and links the Appointment ID/Technician ID to a specific screen sequence: Step 7 Book Appointment (CRM) creates Appointment Number, Appointment ID, Technician ID; and the OFSC plugin domain confirms the integration explicitly in a system dialog. | The requirement is directly operationalized by a specific, ordered sequence of screens in this same document: Sales Order Line Items 'Book Appointment' button (step 11) -> 'Book Appointments for KID QID RG0007' calendar/slot-selection dialog (steps 12-13) -> booking confirmation with Appointment Id (step 14) -> back-office 'Activity details' screen showing Resource ID, Correlation Id, Technician Tracking URL (steps 17-18) -> technician 'Move' dialog for reassignment (step 19) -> OFS technician 'My Route' view (step 26). The OFSC platform identity and environment are confirmed explicitly.]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"confirms the WFM platform is Oracle Field Service Cloud (OFSC), environment ofsc-55e5b6.test.fs.ocs.oraclecloud.com"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Appointment has been successfully booked... Appointment ID is 120955... Technician ID ABATS_Consumer_Installation”

### REQ-171: SIM/CPE Serial Validation Must Call Backend UIM Inventory Service in Real Time
`Explicit` · confidence: `high`

- **Description:** SIM and CPE serial numbers entered during order entry must be validated in real time against Oracle UIM inventory, blocking progression on invalid/duplicate/unfree serials with specific error codes. [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The already-extracted summary documents this in full: three distinct real-time UIM validation outcomes were captured with exact error codes/messages during SIM/CPE serial entry (Step 6), proving the validation is a live backend service call (not client-side/mock) blocking order progression on failure, and confirming the backend UIM lookup screen (Custom Object Summary) used by agents to source valid serials. | Full real-time backend validation flow recovered with specific field names, spinner state, and multiple distinct backend response codes/messages proving the SIM/CPE Serial fields call out to Oracle UIM in real time: 'SIM Card does not exist in UIM(SBL-EXL-00151)', 'SIM Card already assigned in UIM(SBL-EXL-00151)', 'CPE Serial Number ... is not free in UIM(SBL-EXL-00151)', plus client-side length validation ('SIM Serial # must be 19 digits') distinct from the backend calls, and the intermediate 'Validating Order, please wait...' spinner state confirming an async backend round-trip blocks Continue.]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “orange spinner labeled "Validating Order, please wait..." appears next to the SIM Serial field while the system calls out to backend services”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162) / CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)"”

### REQ-179: Technician inventory import via Excel + Oracle Field Service integration
`Explicit` · confidence: `high`

- **Related screens:** VFQ Inventory Loading Excel, Resource Inventory Import
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Get Quantity: Success, Import Status: Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0”

### REQ-199: Contact confirmation must reflect MOI Validation result before proceeding
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “blue banner 'MOI Validation completed, please confirm the contact details'”

### REQ-201: CAF form must dynamically bind Qatari ID/Passport number field for prepaid subscribers
`Explicit` · confidence: `medium`

- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Valid Qatari ID/RP Number / Passport Number' shows literal value 'undefined' (a data-binding gap in this build - flagged, not glossed over)”

### REQ-208: Lead created from a known mobile number must attach to the existing matching Contact
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “the newly created lead attaches to this contact ... the system matches/attaches the lead to the existing contact record for that mobile number rather than creating a new contact”

### REQ-209: Passport-to-QID update must auto-fetch customer details via MOI Validation after QID entry
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Once 'Update ID' is clicked, all customer details are fetched based on MOI Validation”

### REQ-214: Number reservation returns a confirmable success token (SBL-EXL-00151 code family)
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The document links this requirement to a specific screen/step: Number Selection (step 5) in the Postpaid provisioning wizard, reached via the Cross Sales -> New Postpaid handoff. The reservation success token appears as a native browser alert at that exact step, followed immediately by the Reserved Numbers grid updating from empty to populated with the reserved MSISDN.]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “"SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)"”

### REQ-228: Autobase migration offers must be sourced from and traceable to the Unica campaign engine end-to-end (order, bulk job, activity all stamped with source)
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “traceable end-to-end back to the campaign/offer engine ... order is stamped Source = "UNICA"”

### REQ-230: Order must progress asynchronously through backend bulk job queue after Autobase submission
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “the backend bulk job carries Attrib04 = "UNICA" ... progresses asynchronously through the backend Bulk Processing job queue (job type "PreToPost") to Complete”

### REQ-248: RFS Data Management Capability
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `CAP-23`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “CAP-23 RFS Data Management (New, ties to GIS/IMS/RFS Portal/Big Data)”

### REQ-259: GTM data-flow frequency confirmation needed
`Explicit` · confidence: `high`

- **Description:** Open item: confirm and document the actual production frequency of GTM data extraction/loading into UIM, RFS Portal, and other downstream systems.
- **Original requirement ID(s):** `OI-11`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-11/OI-12 open GTM data-flow frequency and VFID/KID mapping rule questions”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Action items (owner Mahmood): verify and share current production frequency of GTM extraction/loading into UIM, RFS Portal and other downstream systems”

### REQ-269: Siebel CRM remains system of record
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `A-01`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “A-01 Siebel CRM remains system of record”

### REQ-270: Existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `A-02`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “A-02 existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change unless stated”

### REQ-274: Qnomy MPI API spec required
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `D-04`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Qnomy MPI API spec (D-04)”

### REQ-287: Provide file structure/sample details for IMS→RPA and RPA→UIM/Siebel
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “provide file structure/sample details for IMS→RPA and RPA→UIM/Siebel”

### REQ-288: Clarify current operational frequency for UIM/RFS data refresh
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “clarify current operational frequency for UIM/RFS data refresh”

### REQ-289: Change Siebel feed from full file to delta file
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “change Siebel from full file to delta file to cut load”

### REQ-298: J011 Unica Campaign Reference in Onboarding
`Explicit` · confidence: `low`

- **Description:** The onboarding flow references/integrates with the Unica Campaign system at some point in the process (exact usage not detailed in extracted text).
- **Original requirement ID(s):** `J011`
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Unica Campaign reference”

## NonFunctional Requirements

### REQ-004: Adjustment Reason Retention Beyond BRM Purge
`Explicit` · confidence: `high`

- **Related workflows:** Adjustment
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Adjustment reason is lost after 6 months due to BRM's "6 plus 1" event purge policy — item data remains but the reason is purged. Source of truth for adjustments left open”

### REQ-034: Performance Improvement for Large Enterprise Account/Billing Profile/CDR Pages
`Explicit` · confidence: `high`

- **Related screens:** Billing Profile page, CDR page
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “performance pain when loading large enterprise accounts, the billing profile page and the CDR page”

### REQ-039: Large Excel/CSV Export Handling
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The fuller markitdown extraction contains the exact numeric thresholds and decision logic that the compressed summary only paraphrased loosely: Excel caps at 1,000,000 line items; when exceeded, data is first aggregated location-wise and date-wise; if aggregation still yields 500,000-600,000+ lines the resulting XLS file becomes too large to email; the concrete rule is under 400k aggregated lines -> generate XLS, over 400k -> generate CSV instead. This is a precise, actionable business rule/validation threshold rather than a vague mention.]
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Excel has a one-million line item limit requiring aggregation with CSV fallback; a 400k-line threshold is driven by email delivery size limits”

### REQ-055: Device/tablet rendering only, not journey governance
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction gives the concrete prior assumption being overturned and the specific business rationale (mass market is a persona whose journey differs, not merely a rendering variant), which is more specific than the summary's one-liner.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “device (tablet vs desktop) should not govern journey — it should only affect rendering”

### REQ-068: Dynamic ticket LOB management without release dependency
`Explicit` · confidence: `high`

- **Description:** Support dynamic online creation/maintenance of ticket LOB/list-of-values with automatic mapping, rather than requiring a release/offline configuration for new LOBs.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “dynamic ticket LOB management (currently new LOBs require a release)”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Dynamic Ticket LOV Management — online creation/maintenance of ticket list-of-values with automatic mapping”

### REQ-110: Build reusable capability building blocks exposed via DXP layer
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “break monolithic journeys into reusable "capability" building blocks...exposed through a new DXP (Digital Experience Platform) layer that hides workflow/data complexity from agents [00:01:58, 00:08:27]”

### REQ-114: Real-time Prepaid ECR/Siebel activation
`Explicit` · confidence: `high`

- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “v2.0 (Dec 28, 2015): Introduced real-time Prepaid ECR/Siebel activation”

### REQ-118: Screen-count estimation model for stack modernization delivery (1,991 total screens)
`Explicit` · confidence: `high`

- **Sources:**
  - [`crm-journeys-final-updated-a23640a5`](../.knowledge/docs/crm-journeys-final-updated-a23640a5.md): “Expected Screens Desktop 1,815; Expected Screens Tablet 176; Total Screens 1,991”

### REQ-172: Backend Exceptions Must Surface Error/Service Codes and a Support Reference Number to the User
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Verbatim full exception surface text recovered including two distinct error/service codes and the support reference number format, tied to a specific step (SIM Serial, CPE-not-free scenario) and specific journey variant (New FWA / FWA Postpaid Business).]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error invoking service 'VFQA Error Handling Service', method 'HandleException'...(SBL-BPR-00162)... Please Contact the System Administrator with Reference # 1-DNODWJU.(SBL-EXL-00151)"”

### REQ-225: Order status must reflect fulfillment progression (Pending -> Open/In Progress -> Complete) with per-line status context
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The source document (guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus) documents the full order-status progression end-to-end with concrete state transitions and per-line detail: order created as Status Pending -> after manager Approve, Status Open/Fulfillment Status In Progress -> Status Complete/Fulfillment Status Complete with Status Context 'All order lines are completed', and all 11 line items individually reaching Status Complete with per-line Status Context values distinguishing fulfillment sub-stages.]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed"... each with Status Context values reading "FULFILL BILLING COMPLETE: reached" or "SMS NOTIFICATION COMPLETE: reached"”

### REQ-235: Failed FDOs must retry automatically up to 3 times for open-order failures and be consolidated into a daily operations report if unresolved
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “automatic 3x retry for requests failed due to open orders; unresolved failures are consolidated into a daily operations report”

### REQ-238: ID scan should be enhanced with OCR/capture-in-one-shot
`Explicit` · confidence: `high`

- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Requirements raised: enhance ID scan with OCR/capture-in-one-shot”

### REQ-240: Attachments must be categorized (CAF, QID) with online-only warm-archive retention and no deletion
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript gives the explicit functional requirement with the two named categories (CAF, QID/ID) and the explicit retention policy (online-only warm archive, no cold archive, no removal), plus an extension of categorization to contacts.]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “document categories for attachments (CAF, QID) with online-only warm-archive retention (no cold archive, nothing removed)”

### REQ-256: No non-functional requirements documented (gap)
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `OI-16`
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “OI-16 no non-functional requirements stated at all (Critical, VFQ IT)”

### REQ-265: Qnomy Q Ticket fallback handling
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `MPAR_001_JSM_01..08`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable”

### REQ-268: Catalogue/eligibility/discount/number-pricing rules as configuration not hard-coded
`Explicit` · confidence: `high`

- **Original requirement ID(s):** `A-03`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “A-03 catalogue/eligibility/discount/number-pricing rules are configuration, not hard-coded”

## Security Requirements

### REQ-013: Billing Profile / Recipient Email Audit Trail
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Transcript gives an explicit functional requirement for a dedicated traceability/audit-trail screen and precisely what it must capture (who changed billing profile name, who changed recipient email, which email the document was sent to), plus a related requirement to support multiple recipients associated to a contact.]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Audit trail requirement raised: capture who changed the billing profile name and the billing document recipient email (a fraud scenario was flagged where a user changes the invoice email, redirects it, then reverts with no record)”

### REQ-033: Controlled/Governed Excel Export Feature
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The fuller markitdown extraction of the source .docx (which recovers substantially more of the transcript than the compressed summary) contains a specific, timestamped, actor-level walkthrough of the export interaction: the user clicks a settings icon to trigger export, the XLS downloads automatically, and the feature is confirmed to have no access control and to be available across account summary, installed assets, orders, tickets, activities, and payments tabs, plus multi-account search results and sales-order search filtered by date range or specific order number. This is concrete UI interaction/control detail (trigger control, output behavior, and scope) directly relevant to specifying a 'governed/controlled' version of this feature as REQ-033 requires.]
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “an Excel export feature is available, uncontrolled, on all tabs and heavily used for plan/promotion analysis”

### REQ-054: Role/team-based access model replacing Siebel profile-based access
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Fuller extraction gives the concrete as-is state and named example teams for the 5 Siebel profiles, plus how they are currently (mis)used, which fills out the requirement significantly beyond the summary line.]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “move from Siebel profile-based access (5 profiles: mid value, high value, broadband/fixed, Key Accounts, Mass Market) to a new role/team-based access model”

### REQ-059: Agents view-only for AutoPay status/failure reason (regulatory restriction)
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “agents cannot enroll/cancel AutoPay or see card details (regulatory restriction) — agents get view-only visibility of AutoPay status and failure reason”

### REQ-062: Manager-level bypass to edit QID number field only
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The fuller extraction surfaces the precise business logic and role context beyond the flagged description: the bypass is specifically for QID number edits only, is restricted to 'a manager or similar authority', and the remaining OCR-extracted fields (date of birth, nationality, name) are validated against MOI, not left unchecked. This is a SIM Swap journey capability (the journey and persona are named: 'Manager / team leader' — 01:01:09), unlike the billing items above.]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “a manager-level bypass allows editing QID number only, with remaining fields validated against MOI”

### REQ-079: System control preventing agents from selecting any credit limit value
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “no system restriction today preventing any agent from selecting any credit limit value [flagged as an 'uncontrolled credit exposure' risk]”

### REQ-095: Store combo box/CPE password for field engineer access
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “decision to store it in the system so engineers can configure without calling the network team [01:42:15, 01:44:53, 01:47:30]”

### REQ-109: Mitigate OCR misread risk on QID number defeating two-factor validation
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “OCR misreads of the QID number (e.g., 0 read as 8) could pull the wrong MOI customer record...a misread ID number could coincidentally still match an expiry date, defeating two-factor validation [00:27:28, 00:37:01, 00:29:52]”

### REQ-122: Retail cannot change primary contact
`Explicit` · confidence: `medium`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The 'Retail cannot change primary contact' annotation is attached to Page Type row #31: Journey Category=Support, Journey Type='Updating Contacts', Type=Workflow/Task, Description='To Update the Contact Details Insight Account, Changing Notification MSISDN, Linking New Contact, MOI Validation, QID Update, Etc', Comment='Action through Vanilla (Open UI desktop)', Guided journey Desktop=No, Tablet=No, Desktop vanilla=Yes, CBU=Yes, EBU=Yes. This directly links the orphan requirement to a specific Workflow/Task row and clarifies it is a business-rule constraint on the 'Updating Contacts' task performed via Open UI desktop vanilla (not a guided journey), applicable to both CBU and EBU.]
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “Free-text AI Comments column echoes prior annotations (e.g., "Retail cannot change primary contact,"”

### REQ-132: eKYC validation (ID scan + selfie scan) for digital fiber activation
`Explicit` · confidence: `high`

- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"Combo Box & CPE | eKYC Validation" (ID Scan, Selfie Scan)”

### REQ-139: ECR Details field restricted to Fulfilment team entry
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The requirement links directly to Step 1 (Contact) of the New Fixed Line Fulfilment journey, appearing alongside the other auto-populated identity fields with a tooltip explaining the access restriction, and is immediately followed in the same step by the 'Get IPTV?' flag and Fixed Line IPTV popup — giving the precise screen location and surrounding field context (it sits between the Digital Lead/Sale flag and the Get IPTV flag in the Contact confirmation form).]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Enter ECR Details (No, green check, tooltip "To be filled by Fulfillment team only")”

### REQ-204: Manager-only menu must scope to Home, Order Approval, Manage Leads, Leads Queue
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): The document explicitly names and screenshots the exact reduced tile set for the manager/approver persona, directly matching the requirement text, and further ties it to a specific manager workflow (Manage Leads > My Team's Leads, filtered by Created By) demonstrated later in the same document.]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “module tiles reduced to Home, Order Approval, Manage Leads, Leads Queue, marking the manager/approver role's much narrower menu”

### REQ-243: MNP flow must determine if a single signature can legally cover both CAF and MNP form (open item)
`Explicit` · confidence: `medium`

- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “check if one signature can legally cover both CAF and MNP form”

### REQ-264: Journey initiation from Agent Desktop with role-based authorisation
`Explicit` · confidence: `high`

- **Description:**  [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md): Direct re-extraction of the Mobile Postpaid BRSD's 05_Requirements sheet (158 rows, only ~8 were summarized previously) confirms MPAR_001_JSM_01-08 all sit under Capability 'Journey and Session Management', explicitly describing agent-desktop journey initiation with role-based authorization for the New Postpaid Mobility activation journey.]
- **Original requirement ID(s):** `MPAR_001_JSM_01..08`
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix, Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable, automatic Tracking Record creation, milestone/draft-order persistence for resume”

## Reporting Requirements

### REQ-006: Automated SOA From Inception
`Explicit` · confidence: `high`

- **Related screens:** Statement of Account
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations); currently sent manually via SR in Excel. Automation and a standard consumer + enterprise format required”

### REQ-024: Connection Count Visibility in Siebel and on Invoice
`Explicit` · confidence: `medium`

- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “number of connections not shown in Siebel or on the invoice”

### REQ-070: Supervisor visibility across all agents' tickets
`Explicit` · confidence: `high`

- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “supervisor visibility across all agents' tickets (currently no such view exists)”

### REQ-183: Rejection reason capture on order rejection
`Explicit` · confidence: `high`

- **Related screens:** Activities History tab
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Activities History tab shows a list of closed activities with Order Approval column values of Approved or Rejected (with rejection comment 'ID image not clear' seen for two Mitra Kharel entries)”

### REQ-241: Add a notification/template inventory section to the roles/journeys Excel
`Explicit` · confidence: `high`

- **Description:** Add a notification/template inventory section to the roles/journeys Excel and to the SMS templates documentation, covering when notifications are sent and what static/dynamic content is sent.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “add a notification/template inventory section (missing from the Excel)”
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “requirement: 'Add a notification section covering when notifications are sent and what is sent, static and dynamic' (action item 02:13:24)”

# Domain Model & Entity Catalogue (Phase 6)

Business/data entities evidenced across BRSDs, business-rule extracts, and guided journeys. Attributes/relationships/lifecycle states are transcribed only where the source evidences them — this is not a normalized data model invented from telecom-domain convention.

**Canonical items:** 83 (deduplicated from 208 raw extracted mentions across the 83-document corpus)

**Confidence:** high 76 · medium 7 · low 0
**Classification:** Explicit 83 · Inferred 0 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## ENT-001: Billing Profile / Billing Account
`Explicit` · confidence: `high`

- **Description:** Driver of billing, barring and payment posting for an account/service. New target-state entity distinct from customer/service account; holds one bill profile; multiple services can link to one billing account. Attributes include freely renameable name (agent-set), billing cycle, PIA/arrears/hybrid flag (requested by Collections), billing address (can differ from customer address), bill medium (detailed for consumer, summary PDF for enterprise), AutoPay status/failure reason (view-only for agents), multiple bill email recipients (CC), email verification status. Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more. Currently no unchangeable ID links CRM and BRM (decision made to add BRM row ID + unique CRM identifier). A billing profile enters collection once overdue exceeds 100, with lifecycle states good standing, overdue, in collection, blacklisted.
- **Attributes:** name (freely renameable), billing cycle, PIA/arrears/hybrid flag, billing address, bill medium, bill cycle, AutoPay status/failure reason, multiple bill email recipients (CC), email verification status, credit limit, payment method, collection status, blacklist status, Bill Profile #, Bill Profile Status, Payment Type, Bill Cycle, Email Bill To, Over Due/Total Due Amount
- **Relationships:** linked to Account/Service; drives Statement of Account and payment posting; billing profile linked to a contact for traceability; each billing account holds one bill profile; multiple services can link to one billing account; belongs to Account; referenced by Orders/Line Items
- **Cardinality:** Consumer: max two billing profiles (one postpaid, one prepaid); enterprises can have more
- **Lifecycle states:** good standing, overdue, in collection, blacklisted; Active/Inactive
- **Validation rules:** Collections requested a billing-in-advance/arrears/hybrid flag; no system restriction preventing agents selecting excessive credit limits (flagged risk)
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Billing profile is the driver for billing, barring and payment posting but has no unchangeable common correlation ID between CRM and BRM”
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “introduce a new billing account entity — multiple services can link to one billing account; billing account holds one bill profile; billing address can differ from customer address”
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “a billing profile enters collection once overdue exceeds 100”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Fulfillment Status "In Progress", Billing Profile "1-CCUD2H3" (Postpaid)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “'Billing Profile' grid shows two profiles: 1-AZ7IDUF (Prepaid, email hemanthk4@gmail.com) and 1-AZ85SF5 (Postpaid, email nobill@vodafone.com)”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “billing-account grid row - Status (green bar), Language ENG, Payment Type Postpaid, Billing Profile St. Active, Payment Method, Bill Media Email, Name 1-D87EQYB”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Billing Profile grid: 4 profiles (mix of Prepaid/Invoice, Monthly)... Step 4. Billing: Postpaid expanded, one billing profile row: Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Billing Profile: 1-CHS9MWP, Billing Profile Type: Postpaid, Bill Cycle: 1”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Bill Profile #: 1-1G1ZCXFW, Bill Profile Status: Active, Payment Type: Postpaid, Bill Cycle: 1, Email Bill To, Over Due Amount / Total Due Amount”

## ENT-002: Adjustment (Bill Adjustment)
`Explicit` · confidence: `high`

- **Description:** A credit/debit correction applied to a customer bill, individually or in bulk. Individual adjustments go through ticketing + DOA (delegation of authority) hierarchy; bulk adjustments go through a PowerApps portal with offline approval and manual Excel handling. Target state moves bulk adjustments into a DXP portal integrated with BRM.
- **Attributes:** reason (purged after 6 months by BRM policy), unit of measurement, multi-bucket submission, free-text comment
- **Relationships:** tied to ticketing + DOA hierarchy (individual) or PowerApps portal (bulk); target state moves bulk adjustments into a DXP portal integrated with BRM
- **Lifecycle states:** request status (target state), failure/re-upload (target state)
- **Validation rules:** role-based access, billing profile filtration
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “individual adjustments go through ticketing + DOA (delegation of authority) hierarchy; bulk adjustments go through a PowerApps portal with offline approval and manual Excel handling”

## ENT-003: Statement of Account (SOA)
`Explicit` · confidence: `high`

- **Description:** Customer account statement showing bill history, payments, adjustments and allocations. Must show data from inception (one line per bill, plus payments/adjustments/allocations); currently sent manually via SR in Excel. The from-inception requirement conflicts with BRM purge policy.
- **Attributes:** one line per bill, payments/adjustments/allocations, must show data from inception
- **Relationships:** derived from Billing Profile and bill history; currently sent manually via SR in Excel
- **Validation rules:** from-inception requirement conflicts with BRM purge policy
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations); currently sent manually via SR in Excel”

## ENT-004: Bill / Hot Bill / Bill Simulation
`Explicit` · confidence: `high`

- **Description:** Three related billing artifacts: the actual bill, the hot bill (current unbilled + outstanding without changing item status), and bill simulation (shows disconnection penalty implications without disrupting the upcoming bill).
- **Attributes:** MRC, VAS, VAT (summarised landing view fields); explicitly-not-a-tax-invoice flag for bill simulation
- **Relationships:** hot bill vs bill simulation are distinct; bill simulation triggered from guided journeys or on-demand button
- **Lifecycle states:** unbilled -> hot bill -> billed
- **Validation rules:** two invoices cannot be generated for the same charges
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Hot bill (current unbilled + outstanding, does not change item status) is distinct from the newly-named "bill simulation"”

## ENT-005: Commitment/Penalty
`Explicit` · confidence: `high`

- **Description:** A contractual commitment or penalty amount tied to disconnection, MNP port-out, upgrade/downgrade, park or put-off actions. Value not currently stored anywhere; calculated on-demand from guided journeys; cannot be quoted without creating an order today.
- **Attributes:** value not currently stored anywhere
- **Relationships:** calculated on-demand from guided journeys
- **Validation rules:** cannot be quoted without creating an order today
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “value is not stored anywhere; agents cannot quote a disconnection penalty without creating an order”

## ENT-006: Order
`Explicit` · confidence: `high`

- **Description:** Represents a sale/service transaction across channels and products: fixed-line (two-phase, completion confirmed by PM), postpaid activation, DOI, disconnection, TON, MNP port-in, enterprise, bulk activation, etc. Held in a transient/pending state (not created at GSP layer until finalized) with hold period tied to channel number reservation expiry (~48 hours). OSM auto-completes/purges fixed-line orders older than ~12 months. Includes CRM-tracked fields (Order #, Type, Sub Type, Status, Fulfillment Status, Priority, Billing Profile, Price List, Currency, Total, MRC/NRC Total, Credit Limit, Created By, Source, Service Type) and hierarchical Line Items. Disconnection order cannot be submitted until retention ticket closed with resolution code; DOI order auto-created and auto-closed since no delivery step in retail. Enterprise order: one order equals one location, starts from CR number.
- **Attributes:** activation date, completion date, auto-purge after ~12 months, transient/pending state, hold period ~48 hours, Order #, Revision, Order Type, Order Sub Type, Status, Fulfillment Status, Priority, Credit Limit, Service Type, Billing Profile, Price List, Currency, Total, MRC Total, NRC Total, Created By/date, Source, SubChannel, Approval Status, Hold flag/Reason
- **Relationships:** CDRs flow to BRM; bill formatter only shows active services; belongs to Account/Contact; contains Line Items; linked to Billing Profile, Appointment, CAF; prerequisites for enterprise are care form/CIO copy/oversight copy plus site survey; installation contact captured only as free-text comment
- **Cardinality:** one order equals one location (enterprise)
- **Lifecycle states:** open/pending/transient -> created (GSP layer) -> submitted -> PM-confirmed complete / Approved / Complete -> auto-completed/purged (~12 months); also Abandoned, Cancelled, Rejected (Correction/Drop Order) -> resubmitted
- **Validation rules:** back-dated completion causes billing disputes; must use correct activation date; disconnection order cannot be submitted until retention ticket closed with resolution code; MOI Validation; toolbar actions Revise/Validate/Submit/Drop Order/Cancel Order/ReSubmit gate state transitions; Order Billing Profile must match Line Items' Billing Profile (ORD_VALD_RULE_001); pending order cannot be submitted if open order exists for business account (ORD_VALD_RULE_005); all payments must be Authorized (ORD_VALD_RULE_030)
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “OSM auto-completes/purges orders older than ~12 months; order completion depends on PM confirmation”
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Enterprise order journey: described as "vanilla direct" rather than a guided journey; starts from CR number; one order equals one location”
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “incomplete/pending orders held in a transient state (not created as an order at the GSP layer) with hold period tied to the channel's number reservation expiry, generally up to ~48 hours”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Decision/requirement: replace order cancellation with an in-place order update when falling back outdoor→indoor before provisioning”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Order Billing Profile must match Line Items' Billing Profile (ORD_VALD_RULE_001); pending order cannot be submitted if open order exists for business account (ORD_VALD_RULE_005); all payments must be Authorized (ORD_VALD_RULE_030)”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Order Type "Activation", Order Sub Type "Triple Play", Status "Open", Created "6/5/2024 11:22:48 AM" by "HEMANTH"... Fulfillment Status "In Progress", Billing Profile "1-CCUD2H3" (Postpaid)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Order # 1-29792357564, Order Type Activation, Status Open->Complete, Created By VINODHINIR, Fulfillment Status In Progress->Complete”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Siebel Sales Order (Order # 1-28920871362), Order Type Activation, Order Sub Type Port-In, Status Pending”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Sales Order 1-225217281463: Type Sales Order, Order Type Activation, Status Complete, Total QR25.00... Line Items grid (12 lines)”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Order Number:- '1-29728035948'... Status Open... later Status Complete, Fulfillment Status Complete”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Orders (87, Open Orders 0, Suspended Orders 0); All Orders grid columns Status, Order Date, Type, Order #, MSISDN #, Journey”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “columns: ... Account Type | Service Type | Order Type | Order Sub Type ...”
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “the order is submitted by the Agent in DXP to apply the change; submit the order”

## ENT-007: Enterprise Account (Parent/Sub-Account)
`Explicit` · confidence: `high`

- **Description:** Two-level enterprise account hierarchy: parent (documentation-only, holds CR number and contacts) and sub-accounts (hold active numbers, billing, activation, modification). All activation, billing and modification happens at sub-account level; only two levels exist; one unique parent per customer.
- **Attributes:** name, CR type/ID type, CR number, agent ID, business type (incl. B2B2C), credit limit (no default for enterprise, needs finance approval)
- **Relationships:** one unique parent per customer; parent has contacts only; sub-accounts under a parent (e.g. Lulu Group subsidiaries/branches)
- **Cardinality:** one parent : many sub-accounts (only two levels)
- **Validation rules:** mandatory CR-number search before account creation; no validation exists today when linking sub-accounts to parents
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Parent/sub-account model: parent is a documentation-only placeholder carrying the CR number; all activation, billing and modification happens at sub-account level; only two levels exist; one unique parent per customer”

## ENT-008: Authorised Person / Chooser (Contact)
`Explicit` · confidence: `high`

- **Description:** Individuals nominated by a company on the CR who can act on the account; one or more flagged 'chooser'. Account affiliation (attached form + AM approval) grants privileges/Web Self-Care access. Requests only accepted from chooser's registered email; no off-boarding process for departed choosers.
- **Attributes:** single shared email field (personal vs corporate conflict); free-text job title used as privilege identifier (no validation); roles: chooser, payment support, technical contact
- **Relationships:** account affiliation (attached form + AM approval) grants privileges/Web Self-Care access
- **Validation rules:** requests only accepted from chooser's registered email; no off-boarding process for departed choosers; attachment must be named QID_subaccount
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Authorised persons/choosers: company nominates authorised persons on the CR; one or more flagged as "chooser"; requests only accepted from the chooser's registered email”

## ENT-009: Volumetric Discount
`Explicit` · confidence: `high`

- **Description:** Commercial discount evaluated at runtime based on connection/revenue volume. Minimum 50 numbers, slab-based, revenue or service-count flavours. Account-level vs service-item-level discounts; distinct from management-approved on-top discounts and price overrides. No automatic downgrade when connections drop below threshold (revenue leakage).
- **Attributes:** minimum 50 numbers, slab-based, revenue or service-count flavours
- **Relationships:** account-level vs service-item-level discounts; distinct from management-approved on-top discounts and price overrides
- **Validation rules:** no automatic downgrade when connections drop below threshold (revenue leakage)
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “volumetric discount has a minimum of 50 numbers, is slab-based, comes in revenue and service-count flavours, is evaluated at runtime, and has no automatic downgrade when connections drop”

## ENT-010: Bulk Activation Order
`Explicit` · confidence: `high`

- **Description:** A batch of numbers/plans activated together for enterprise, currently via Excel macro. Current state requires identical plan/account/spend limit/price; target state supports varying plans/spend limits/discounts/price overrides per row via new Oracle bulk utility API on DSP front end, with per-row success/failure reporting.
- **Attributes:** identical plan/account/spend limit/price required today (current state); target: varying plans/spend limits/discounts/price overrides per row
- **Relationships:** pending replica order used for reference; target uses new Oracle bulk utility API on DSP front end
- **Validation rules:** per-row success/failure reporting (target requirement)
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Target requirement: standardised bulk templates on the DSP front end using a new Oracle bulk utility API, supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles”

## ENT-011: IoT SIM / Device
`Explicit` · confidence: `high`

- **Description:** SIM and device used for Fleet Management, Asset Tracking, DAPN and other IoT services. Tied to Global M2M managed service account product (billing only, activation on GDSP platform); DAPN tied to Enterprise Large segment.
- **Attributes:** device identifier held when Vodafone-supplied; static IP (DAPN); numbers reserved one at a time from mobility-only category
- **Relationships:** tied to Global M2M managed service account product (billing only, activation on GDSP platform); DAPN tied to Enterprise Large segment
- **Validation rules:** no bulk template for DAPN numbers
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “DAPN/dedicated APN (Enterprise Large segment; POC devices/tablets; data SIM with static IP; numbers reserved one by one from the mobility-only category; no bulk template)”

## ENT-012: Account-Level Product
`Explicit` · confidence: `high`

- **Description:** A product modelled at account level (e.g. Microsoft licences, Starlink) with no Service ID, provisioned manually by business teams. One line item per licence; manual price changes because quantity doesn't propagate without 'auto-explode'. Architectural ask is to replace with generic services with Service IDs under which such products sit.
- **Attributes:** one line item per licence; manual price changes because quantity doesn't propagate without 'auto-explode'
- **Relationships:** architectural ask is to replace with generic services with Service IDs
- **Validation rules:** heavy reliance flagged as a pain point
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “heavy reliance on account-level products with no Service ID and manual provisioning by business teams. Major architectural ask: move away from account-level products to generic services with Service IDs”

## ENT-013: MNP Port-In Order
`Explicit` · confidence: `high`

- **Description:** An order in Siebel representing an incoming mobile number port from another operator. Fulfilment validates and creates the order, selecting plan, MNP category, porting details, a reserved zero-value temporary MSISDN, and attachments. Auto-created ticket via NPass triggers a 2-hour action window (extendable to 24 hours once documents validated), bound by NPass working hours. Auto-validates customer name, QID/ID type and number, service type, consumer type; auto-rejects on failure. Conditional acceptance auto-triggered on billed due over 100 QAR (MNP) or any unbilled amount at service level (FNP).
- **Attributes:** plan, MNP category, porting details (customer ID number/type, customer type, donor operator, subscription type, scheduled porting date), reserved zero-value temporary MSISDN, attachments (MNP form 2-A-D, donor-registered ID), 2-hour action window extended to 24 hours, 14-15 rejection reason codes tightly coupled to NPass, consumer uses only reason codes 1,4,9
- **Relationships:** linked to donor operator (QTEL/Ooredoo) via NPAS
- **Lifecycle states:** created -> consent pending -> submitted to NPAS -> donor accept/reject/conditional-accept -> porting window -> ported; rejection restarts the whole journey
- **Validation rules:** consent SMS required within 24 hours; only 13 valid rejection reasons; attachments under 2MB, PDF or JPG; auto-validates customer name, QID/ID type and number, service type, consumer type; auto-rejects on failure; conditional acceptance auto-triggered on billed due over 100 QAR (MNP) or any unbilled amount at service level (FNP)
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details ... a reserved zero-value temporary MSISDN, and attachments”
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours”

## ENT-014: FNP Port-In Order / Trouble Ticket
`Explicit` · confidence: `high`

- **Description:** A fiber-to-fiber number port order at service level, requiring RFS check, trouble ticket, and two technician visits. FNP form (mandatory Karma ID), ID document, target date (manually calculated). Submitted via NPAS to Ooredoo for document validation and acceptance. Conditional acceptance shows visible due amount, with 3 working days for consumer to clear.
- **Attributes:** FNP form (mandatory Karma ID), ID document, target date (manually calculated)
- **Relationships:** submitted via NPAS to Ooredoo for document validation and acceptance
- **Lifecycle states:** RFS check -> trouble ticket -> form/ID submission -> donor validation -> conditional/accept -> installation visit -> porting-date visit -> ported
- **Validation rules:** conditional acceptance shows visible due amount, 3 working days for consumer to clear
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP (fiber-to-fiber only, consumer, 5 working days): installation/RFS check happen first; a trouble ticket is raised with a manually calculated target date”
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Fixed Line Port In (FIB-FPI-RTL-005), Fixed Line Port Out (FIB-FPO-RTL-006)”

## ENT-015: MSISDN / Number
`Explicit` · confidence: `high`

- **Description:** Mobile or fixed number subject to reservation, porting, locking and disconnection. Reserved via number management team or EBU number portal; temporary reserved zero-value MSISDN used for MNP; unpaired SIM serials are an issue. Categorized free/paid (paid can become free depending on plan); star/reserved numbers have special lock-in rules; numbers auto-selected for fixed/prepaid (zero-rated), not for mobile postpaid (priced). Number of connections not shown in Siebel or on invoice for enterprise. Star number port-out control blocks porting during commitment period (configurable). Also modeled at UI level with 8-digit number, price, Free/Reserved/BLOCKED status, Reservation Token, and full MSISDN with country/operator prefix.
- **Attributes:** reserved (via number management team or EBU number portal), temporary reserved zero-value MSISDN for MNP, unpaired SIM serials (issue), category (free or paid), star number status, value tier, lock-in period, ownership/registration status, 8-digit number, price (QR0.00 for free numbers), status (Free/Reserved/BLOCKED/AVAILABLE), Reserved By, Reservation Token, full MSISDN with country/operator prefix (e.g. 97441224317)
- **Relationships:** tied to Account/Service; subject to porting window and dunning ladder after port-in; linked to customer via Transfer of Number (TON); reserved to Contact/Order; becomes Service Id on Line Item
- **Lifecycle states:** reserved -> activated -> (post-port-in) barred outgoing (day 31) -> barred incoming (day 45) -> disconnected -> quarantine (30 days); Free -> Reserved/Blocked -> assigned to order -> Active
- **Validation rules:** number of connections not shown in Siebel or on invoice for enterprise; star number lock-in tiers, entitlement by plan value; star number port-out control blocks porting during commitment period (configurable); numbers auto-selected for fixed/prepaid (zero-rated), not for mobile postpaid (priced)
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “disconnection + number return, then 30-day quarantine”
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Number management: two categories only — free and paid (paid can become free depending on plan)”
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “for star numbers valued 1,500 Riyal and above...; Star number transfer requires EITHER a one-year postpaid commitment...”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Free-number tiles shown at QR0.00: 40204351 (selected)... Clicking "Reserve" moves to the "Reserved Number" tab”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “FIXED LINE/FREE/CONSUMER 97441202301 (Blocked Reason: BLOCKED_NUMBER_TESTING_TEAM) and MOBILE/FREE/CONSUMER 97479027298 (Blocked Reason: NONE)”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “SIM Serial = 8942702400000026363; Port-in Number 97466000666; Primary mobile number 97479025448”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Unreserved Numbers grid: Mobile / FREE / CONSUMER / (Start) Number 97470345802 / Price From QR0.00 / Status BLOCKED / Reserved By SUYASHKULKARNI_VFQ”
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Select a Number to Reserve: ... One number card shown and selected: 40204489, priced QR0.00”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Star Number pricing/approval rules”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “CAP-07 Number Management (UIM, ODS); number types Reserved/Star/Free”

## ENT-016: Enterprise Invoice (PDF/Excel)
`Explicit` · confidence: `high`

- **Description:** Enterprise customer invoice document generated in PDF and Excel formats, with banner/table layout, page-level subtotals, service ID/circuit ID grouping, tax code/number placeholders, CDR sort by date/time with number filter, and discount shown as two line items (prorated and month-in-advance). Aggregated rated CDRs from Bulk SMS platform feed into invoice; one-off charges linked to circuit.
- **Attributes:** banner/table layout, page-level subtotals, service ID/circuit ID grouping, tax code and tax number placeholders, CDR sort by date/time with number filter, discount as two line items (prorated and month-in-advance)
- **Relationships:** aggregated rated CDRs from Bulk SMS platform feed into invoice; one-off charges linked to circuit
- **Validation rules:** Excel one-million line item limit with CSV fallback; 400k-line threshold from email size limits; PDF and Excel ordering must match
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Invoice redesign ... Specific asks: resolve banner/table overlap ... group line items under service ID/circuit ID ... Excel has a one-million line item limit requiring aggregation with CSV fallback”

## ENT-017: Bulk SMS Account/Order
`Explicit` · confidence: `high`

- **Description:** An account/order for the Bulk SMS enterprise service, provisioned in Siebel with billing owned by a separate Bulk SMS platform. Assisted onboarding via account manager with short code and SMTP checks and external international short code registration; billed via aggregated rated CDRs received on the first of the month. Support split between Remedy tickets (OnMobile) and Siebel adjustments. Disconnection requires outstanding-balance checks and OnMobile confirmation. Validation rules include billing profile type/status, one active Bulk SMS per account, mandatory attachment, blacklist check.
- **Attributes:** short code, SMTP checks, external international short code registration, billing profile type/status, attachment requirement
- **Relationships:** integration through OSM to Bulk SMS platform; support split between Remedy tickets (OnMobile) and Siebel adjustments
- **Lifecycle states:** onboarding -> account/order creation -> active (billed via aggregated CDRs monthly) -> disconnection
- **Validation rules:** disconnection requires outstanding-balance checks and OnMobile confirmation; one active Bulk SMS per account; mandatory attachment; blacklist check
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Bulk SMS journey walked through end to end: assisted onboarding via account manager with short code and SMTP checks ... billing owned by the Bulk SMS platform with aggregated rated CDRs received on the first of the month”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bulk SMS order validation (billing profile type/status, one active Bulk SMS per account, mandatory attachment, blacklist check)”

## ENT-018: GigaHome/OSNtv Subscription
`Explicit` · confidence: `high`

- **Description:** A customer subscription combining GigaHome fibre broadband and OSNtv, signed via an acceptance form. Postpaid billing in arrears, first bill prorated. Tied to a Premises via Kahramaa ID; Transfer of Number (TON) facility on move. 12-month fibre lock-in; personal use only; one free-offer per Kahramaa ID.
- **Attributes:** Customer Name, Customer QID, Plan Name, Date, Signature; postpaid billing in arrears, first bill prorated
- **Relationships:** tied to a Premises via Kahramaa ID; Transfer of Number (TON) facility on move
- **Lifecycle states:** Try & Buy trial (first 2 months) -> active subscription -> (optional) Home Move / TON -> disconnection
- **Validation rules:** 12-month fibre lock-in; personal use only; one free-offer per Kahramaa ID
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “A customer-signed acceptance form for GigaHome Fiber (broadband) and OSNtv subscriptions, setting out the postpaid billing model, lock-in periods, disconnection fees, Home Move policy, Transfer of Number (TON) facility”

## ENT-019: Smart Device (Smart Viper)
`Explicit` · confidence: `high`

- **Description:** Vodafone's own IoT/smart device product with its own device ID and non-mobile number range. WFM not required for small/indoor devices.
- **Attributes:** device ID, non-mobile number range
- **Relationships:** WFM not required for small/indoor devices
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The fuller markitdown extraction adds concrete distinguishing attributes and process context beyond the one-line summary: the Smart Device (Smart Viper) is distinguished from standard mobile flows only by (1) an extra Device ID attribute and (2) use of a non-mobile IoT number range; the device is physically seen/handed over at activation itself; WFM is not required for it (same as other small/indoor devices, whose SIM comes from IOP as a normal SIM); it supports both prepaid and postpaid plans; and its current retail viability is itself an open question (very few/no active customers, unclear if retail still sells it) — this is lifecycle/process-relevant detail (an activation-time handover state) not present in the summary.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The fuller markitdown extraction adds concrete distinguishing attributes and process context beyond the one-line summary: the Smart Device (Smart Viper) is distinguished from standard mobile flows only by (1) an extra Device ID attribute and (2) use of a non-mobile IoT number range; the device is physically seen/handed over at activation itself; WFM is not required for it (same as other small/indoor devices, whose SIM comes from IOP as a normal SIM); it supports both prepaid and postpaid plans; and its current retail viability is itself an open question (very few/no active customers, unclear if retail still sells it) — this is lifecycle/process-relevant detail (an activation-time handover state) not present in the summary.
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “the Vodafone Smart Device ("Smart Viper") has its own device ID and non-mobile number range”

## ENT-020: Trouble Ticket (TT)
`Explicit` · confidence: `high`

- **Description:** Ticket record in Siebel/Open UI representing service requests, complaints, or system-generated events (e.g., MNP port-out, TON, disconnection). Includes team/queue assignment, status, rejection reason code, priority (unused today), public notes, audit trail. Also used to tag/categorise via LOV taxonomies (hashtags, actual issue). Also generated by Retail (Complaints/SOC/Human Error) and system triggers; closure by Retention Team auto-creates a Disconnection Order.
- **Attributes:** team/queue assignment, status, rejection reason code, priority (unused today), public notes, audit trail, Hashtag(s) (VFQA_TT_HASHTAGS taxonomy), Actual Issue (VFQA_TT_ACTUAL_ISSUE taxonomy), Source, Category, Area, Sub Area, Type/category (Mobile Complaints, Fixed/5G Complaints, SOC, Human Error Complaints, MNP/FNP port out/in, Plan Change Request, Add-on Request, Bill Limit, Disconnection, Migration, Plan Downgrade, Language Change, End Data Session)
- **Relationships:** linked to Account, Customer, MSISDN, Order; closure by Retention Team auto-creates a Disconnection Order; tied to suspension/resume orders requiring approval
- **Lifecycle states:** created (not submitted = no queue routing) -> submitted/routed to queue -> assigned -> action window (2hr auto, extendable to 24hr) -> closed/resolved with resolution code; can be auto-rejected; Created (manual or auto) -> activities validated -> status change -> closed
- **Validation rules:** assigned at team/queue level not agent level; no automatic reassignment on delay; 'assign to me' only works if agent is in queue's user list; customer cannot reopen, only agent can; activities inside ticket validated automatically or by MNP Team with Success/Failed outcome
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “tickets assigned at team/queue level, not agent level, with no automatic reassignment on delay”
  - [`tt-hashtags-and-actual-issue-8d8ccaa5`](../.knowledge/docs/tt-hashtags-and-actual-issue-8d8ccaa5.md): “List of Values (LOV) types used to tag and categorise Trouble Tickets (TTs)... VFQA_TT_HASHTAGS, VFQA_TT_ACTUAL_ISSUE”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Activity # 1-2WO63MPA, Channel 'Administration', Description, Status 'Solved', Comments, Transaction Date, Area, Journey”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Account tiles show Orders: 8, Trouble Tickets: 2, Installed Assets: 2, Billing Profiles: 2”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Trouble Tickets grid: 17 records”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Type of Tickets: lists ticket/issue categories — Disconnection, Migration (Pre to Post), Plan Downgrade, Language Change, End Data Session, etc.”

## ENT-021: MNP/FNP Port-Out Ticket
`Explicit` · confidence: `high`

- **Description:** Auto-created ticket triggered by NPass (MNP) or similar (FNP) SMS notification for port-out requests. 2-hour action window extended to 24 hours once documents validated, bound by NPass working hours (~7:30-3:30/4); 14-15 rejection reason codes tightly coupled to NPass and cannot be renamed; consumer uses only reason codes 1,4,9. Auto-validates customer name, QID/ID type and number, service type, consumer type; auto-rejects on failure. Conditional acceptance auto-triggered on billed due over 100 QAR (MNP) or any unbilled amount at service level (FNP).
- **Attributes:** 2-hour action window extended to 24 hours once documents validated, bound by NPass working hours (~7:30-3:30/4); 14-15 rejection reason codes tightly coupled to NPass and cannot be renamed; consumer uses only reason codes 1,4,9
- **Validation rules:** auto-validates customer name, QID/ID type and number, service type, consumer type; auto-rejects on failure; conditional acceptance auto-triggered on billed due over 100 QAR (MNP) or any unbilled amount at service level (FNP)
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours”

## ENT-022: Transfer of Ownership / Transfer of Number (TON) case
`Explicit` · confidence: `high`

- **Description:** Order/process entity for transferring ownership or number between customers. Includes TON and prepaid-migration fees, OCR bypass by role, POA-based exceptions. System and document validations for existing and new customers; four sequential approvals routed to CDM team (prepaid only). Three TON types: BAU TON, COO/claim of ownership, third-party TON on cancelled ID. Order visibility only on new account (known gap); address not updated after TON in some cases.
- **Attributes:** TON and prepaid-migration fees, OCR bypass by role, POA-based exceptions, type (BAU, COO, third-party/cancelled ID), party A/party B, associated documents (TON form, QID, restoration form)
- **Relationships:** linked to new Account (order visibility only on new account, a known gap)
- **Lifecycle states:** created, routed through four queues (Managing, CDM, BOQ, QATQ), completed with SIM swap on success; raised, migrated to prepaid, transferred, on hold
- **Validation rules:** system and document validations for existing and new customers; four sequential approvals routed to CDM team (prepaid only)
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “TON order visibility only available on the new account; address not being updated after TON”
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Three TON types: (1) BAU TON...(2) COO/claim of ownership...(3) third-party TON on cancelled ID”

## ENT-023: Customer
`Explicit` · confidence: `medium`

- **Description:** Core party entity; distinguished as consumer vs enterprise, prepaid vs postpaid. QID scanned and attached to account for every transaction resulting in account/service change (not required for complaints/inquiries/bill payments with no change); customer must be physically present with valid QID for retail transactions. Also the end customer/subscriber, an actor across all journeys and the subject of Customer 360 aggregation, searchable by Customer No/Contact No/MSISDN.
- **Attributes:** QID/ID type and number, name, segment/consumer type, nationality (used for credit limit config), Customer No, Contact No, MSISDN (search keys)
- **Validation rules:** customer must be physically present with valid QID for retail transactions; QID scanned and attached to account for every transaction resulting in account/service change (not required for complaints/inquiries/bill payments with no change)
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “in retail, the customer must be physically present with a valid QID; for every transaction the QID must be scanned and attached to the customer account”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Actors: Customer, Agent in DXP (J017); search for customer by Customer No / Contact No / MSISDN”

## ENT-024: Service Account
`Explicit` · confidence: `high`

- **Description:** Account level tied to one MSISDN, part of the account hierarchy: customer legal entity → billing account entities (each with one bill profile) → service accounts (each with one MSISDN).
- **Attributes:** one MSISDN per service account
- **Relationships:** customer legal entity → billing account entities (each with one bill profile) → service accounts (each with one MSISDN)
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Fuller extraction adds concrete cardinality/relationship rules for the Service Account entity beyond the bare hierarchy already known: a customer can have multiple service points (e.g. one mobile service account with MSISDN + mobile plans, one fixed-net service account with fixed-net plan), and these service accounts can either share a single billing account/bill profile or be split across two different billing accounts each with its own bill profile. This is a genuine validation/relationship rule for the entity, not just a restated hierarchy.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Fuller extraction adds concrete cardinality/relationship rules for the Service Account entity beyond the bare hierarchy already known: a customer can have multiple service points (e.g. one mobile service account with MSISDN + mobile plans, one fixed-net service account with fixed-net plan), and these service accounts can either share a single billing account/bill profile or be split across two different billing accounts each with its own bill profile. This is a genuine validation/relationship rule for the entity, not just a restated hierarchy.
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “Account model discussed: customer legal entity → billing account entities (each with one bill profile) → service accounts (each with one MSISDN)”

## ENT-025: Customer Application Form (CAF)
`Explicit` · confidence: `high`

- **Description:** Digital signature form generated during activation/onboarding checkout across channels (Consumer and Enterprise/SME-SOHO). Requires unique serial/ID and naming convention, configurable admin-controlled highlighted key T&Cs section. Bilingual (Arabic/English) PDF with Section 1 Applicant details, Section 2 Billing information, Section 3 Postpaid customers, Section 4 Superfast Broadband & Home Phone. Signed via signature pad (retail) or tablet (Direct Sales); generated -> checkout/submission -> sign-off; attached to Sales Order/Account and required alongside ID images for Order Approval. Consumer application forms are digitalized except supplementary forms.
- **Attributes:** Form ID (e.g. PCA001), unique serial/ID and naming convention, configurable admin-controlled highlighted key T&Cs section, Date, Retailer ID, applicant details, billing info, plan selection, signatures, Digital signature (signature pad vs tablet)
- **Relationships:** produced per customer/order; companion Fibre/GigaHome supplementary forms; attached to Sales Order/Account; Consumer CAFs vs Enterprise/SME-SOHO CAFs are distinct sub-types
- **Lifecycle states:** blank template, filled/signed; generated (unsigned) -> signed (e-signature captured) -> attached/verified in Order Approval Attachments tab
- **Validation rules:** Required signature and QID before activation; Consumer application forms are digitalized except supplementary forms
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF must have unique serial/ID and naming convention”
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Form ID: PCA001...Section 1 – Applicant details...Section 2 – Billing information...Section 3 – For Postpaid Customers...Section 4 – Superfast Broadband & Home Phone”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “A bilingual (Arabic/English) generated PDF "Vodafone Customer Application Form" opens in a modal... Section 1 – Applicant details... Section 2 – Billing information... Section 4 – Superfast Broadband & Home Phone”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Vodafone Customer Application Form: Section 1 Applicant details, Section 2 Billing information, Section 3 For Postpaid Customers, Section 4 Superfast Broadband & Home Phone”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “CAF (Customer Application Form) — top (image9.png). Bilingual English/Arabic form”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “bilingual (Arabic/English) "استمارة عميل فودافون / Vodafone Customer Application Form" is rendered: Date, Retailer ID, Section 1 Applicant details, Section 2 Billing information, Section 3 Postpaid Customers, Section 4 Superfast Broadband & Home Phone”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “CAF generation/checkout/submission ... CAF sign-off”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “CAP-10 Contract and Documentation/CAF; contract via digital CAF or offline-signed paper CAF for back office”

## ENT-026: SIM
`Explicit` · confidence: `high`

- **Description:** SIM card entity involved in SIM Swap journeys, retail activation, WinCash/UIM inventory. Type (eSIM/physical); swap charging status (eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged). Separately scanned/depleted stock item (from WinCash) with its own SPO; becomes free in UIM for reassignment on disconnection.
- **Attributes:** type (eSIM/physical), swap charging status, serial, stock status, SIM Serial (ICCID)
- **Relationships:** linked to CPE and order; linked to Order Line Item, MSISDN, Asset
- **Lifecycle states:** in-stock, issued
- **Validation rules:** eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged; Serial Number is required for SIM CARD product (ORD_VALD_RULE_019)
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “charging rules — eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs”
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"; "SIM Card already assigned in UIM(SBL-EXL-00151)"”
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “SIM Serial = 8942702400000025359, green-checked, with a barcode-scan icon”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “SIM Serial: 8942702111338839146, verified (green check)... SIM Card (Service Id 8942702111338839146, Start Price QR25.00)”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “CAP-08 SIM Management; SIM types Physical/Printed eSIM/Virtual eSIM”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Serial Number is required for SIM CARD product (ORD_VALD_RULE_019)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM/MSISDN addition, number type branch (Normal vs Star Number)”

## ENT-027: Multi-SIM / iWatch secondary line
`Explicit` · confidence: `high`

- **Description:** Secondary MSISDN linked to a primary line, invisible to the customer. Up to 4 multi-SIMs depending on plan; pricing auto-set by system based on plan (e.g., Platino: first free, second 25 Riyal). iWatch/RIO bundle validation limits max one iWatch per order, requires EID, checks credit limit, blocks on suspended primary bundle.
- **Attributes:** up to 4 multi-SIMs depending on plan; pricing auto-set by system based on plan; EID, max-one-per-order constraint
- **Relationships:** linked to primary MSISDN
- **Validation rules:** max one iWatch per order; EID requirement; credit limit check; suspended-primary-bundle block
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “secondary MSISDN linked to primary but invisible to the customer; up to 4 multi-SIMs depending on plan”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block)”

## ENT-028: Promotion / Plan / Product (bundled plan/discount/add-on)
`Explicit` · confidence: `high`

- **Description:** Named bundle combining plan, discounts, and add-ons, used across mobile, fixed, and FWA products to control agent discount authority and structure order line items. Selected during order creation; expands into hierarchical line items (e.g., CPE Bundle, Broadband Internet Service, Mobile Service Bundle). Includes Bill Limit Mapping (SL List Price, Agent Min Value, SL Min Value, SL Default Value) and entitlements (VoIP, Voicemail, Call Waiting, Call Forwarding, Three Way Conference, CLI, IPTV, SIM Card). Legacy plan customers require brand-new fiber order vs. plan-change for post-Oct/Sep-2025 FWA plan customers.
- **Attributes:** Promotion ID, Type, Payment Type, Effective Dates, Instances, Show in Catalog, Track as Asset, Bill Limit Mapping (SL List Price, Agent Min Value, SL Min Value, SL Default Value, Default Flag, Active Flag), plan type (fiber, FWA indoor/outdoor, postpaid mobile), pricing/benefit tier
- **Relationships:** plans, discounts and add-ons are bundled into named 'promotions' specifically to prevent agent misuse of discounts; determines available Addon & Discount options; drives Sales Order line items; mapped to Bill Limit products; linked to Order and star number entitlement
- **Lifecycle states:** active, changed
- **Validation rules:** BL RULE 07: Bill Limit Value cannot exceed Credit Limit
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “plans, discounts and add-ons are bundled into named 'promotions' specifically to prevent agent misuse of discounts”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Customers already on a post-October/September-2025 FWA plan get a plan change; legacy-plan customers require a brand-new fiber order”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “searchable catalog grid of promotions: GigaHome Classic 300 TB -F Promotion (selected), GigaHome Premium 450 TB -F Promotion...”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “promotion 'Postpaid U Start Promotion' (Promotion ID 1-92T1KE1), Type 'Bundled Promotions', Payment Type 'Postpaid', Effective Dates 08/27/2020-08/31/...”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “"New Plus Extra Pakistan BIA Promotion"... Bill Limit: 150... Credit Limit: 1000”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Postpaid U Plus Promotion" record (row 1 of 8, Bundled Promotions type, Effective Dates 08/27/2020 -). Promotion ID "1-92VNJ0L", Type "Bundled Promot[ions]", Payment Type "Postpaid", Instances "One Per Ord[er]"”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Installed Assets shows a Prepaid Red Promotion (MSISDN 97479026351)”
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “BL RULE 01–09 series for Bill Limit validations; BL RULE 07 'Bill Limit Value cannot be more than Credit Limit!'”
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X")”

## ENT-029: Device Installment (DOI)
`Explicit` · confidence: `high`

- **Description:** Device financing entity/process tied to eligibility, stock, and payment. Explicitly kept OUT of the main postpaid journey for a phase; requires existing postpaid account in good standing, presence on internal big-data eligibility list, and a QCB credit check.
- **Attributes:** eligibility (via EDW/big data logic on QID), installment breakdown, stock reservation status, eligibility list membership, credit check status
- **Relationships:** linked to postpaid Account
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Fuller extraction recovers concrete conditional-display/validation logic (functioning as lifecycle/validation rules for the DOI entity within the journey): the DOI applet/section is shown only when the customer/QID passes eligibility (existing postpaid account in good standing + presence on the internal big-data eligibility list + QCB credit check pass); the agent has an explicit skip button if not pursuing DOI; in the current architecture there is no point-of-sale completion for DOI inside Open UI -- the order is created but billing/fulfillment completion happens in Siebel; DOI stock/eligibility is synced with WinCash/eShop stock via the separate DOI portal (a distinct system/flow, confirmed kept out of the main postpaid journey for this phase); and a differentiated telesales sub-flow exists where the device-installment order cannot be marked complete until physical device delivery (unlike retail, where the customer receives the device immediately). | Full re-extraction surfaced additional process-sequence detail beyond the compressed summary, clarifying DOI's eligibility/validation chain and confirming the add-on-vs-bundle lifecycle change: DOI eligibility is now determined by the portal via big-data logic on the customer's QID plus checks on outstanding amount and whether the customer already holds another device; the order is closed only after delivery is confirmed successful; and the DOI add-on has been fully retired in favor of an account-level bundle purchase (no add-on exists anymore). This adds concrete validation-rule and state-transition detail (eligibility check -> stock reservation -> signature -> order creation gated on portal-transaction closure / delivery confirmation -> billing start) not fully spelled out in the summary, though it still stops short of a formal named lifecycle-state enumeration (e.g. no explicit 'Eligible/Reserved/Signed/Active' state labels are used in the source - the source describes a process, not a state machine).
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Fuller extraction recovers concrete conditional-display/validation logic (functioning as lifecycle/validation rules for the DOI entity within the journey): the DOI applet/section is shown only when the customer/QID passes eligibility (existing postpaid account in good standing + presence on the internal big-data eligibility list + QCB credit check pass); the agent has an explicit skip button if not pursuing DOI; in the current architecture there is no point-of-sale completion for DOI inside Open UI -- the order is created but billing/fulfillment completion happens in Siebel; DOI stock/eligibility is synced with WinCash/eShop stock via the separate DOI portal (a distinct system/flow, confirmed kept out of the main postpaid journey for this phase); and a differentiated telesales sub-flow exists where the device-installment order cannot be marked complete until physical device delivery (unlike retail, where the customer receives the device immediately). | Full re-extraction surfaced additional process-sequence detail beyond the compressed summary, clarifying DOI's eligibility/validation chain and confirming the add-on-vs-bundle lifecycle change: DOI eligibility is now determined by the portal via big-data logic on the customer's QID plus checks on outstanding amount and whether the customer already holds another device; the order is closed only after delivery is confirmed successful; and the DOI add-on has been fully retired in favor of an account-level bundle purchase (no add-on exists anymore). This adds concrete validation-rule and state-transition detail (eligibility check -> stock reservation -> signature -> order creation gated on portal-transaction closure / delivery confirmation -> billing start) not fully spelled out in the summary, though it still stops short of a formal named lifecycle-state enumeration (e.g. no explicit 'Eligible/Reserved/Signed/Active' state labels are used in the source - the source describes a process, not a state machine).
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Device Installment (DOI): detailed old retail process (happy-offer eligibility, OTP, back-end validation) vs. current retail process”
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “DOI (Device on Installment) is explicitly kept OUT of the main postpaid journey for this phase...requires an existing postpaid account in good standing, presence on an internal big-data eligibility list, and a QCB credit check”

## ENT-030: Credit Limit
`Explicit` · confidence: `high`

- **Description:** Numeric limit attribute on customer/account governing credit exposure. Default 1,000 for expat new account; dropped to 50 for HRN customers. No system restriction today preventing any agent from selecting any credit limit value (flagged as uncontrolled credit exposure risk).
- **Attributes:** default 1,000 for expat new account; dropped to 50 for HRN customers
- **Validation rules:** no system restriction today preventing any agent from selecting any credit limit value (flagged as uncontrolled credit exposure risk)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Credit limit: default 1,000 for expat on new account, dropped to 50 for HRN customers”

## ENT-031: Manual Suspension ('Park My Number') Plan
`Explicit` · confidence: `high`

- **Description:** A plan-change-based product replacing voluntary suspension. Delivered via a 35 Rial, four-month upfront-paid plan with credit limit set to zero.
- **Attributes:** 35 Rial, four-month upfront-paid plan, credit limit set to zero
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The fuller extraction reveals an explicit precondition/sequence and an operational exception not captured in the original flagged description: (1) the customer's existing bill must be cleared BEFORE the plan-change to the park plan occurs; (2) credit limit is set to zero as a rule, but with a named override case (customers travelling may need it changed) implying an exception path exists at agent/back-office discretion.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The fuller extraction reveals an explicit precondition/sequence and an operational exception not captured in the original flagged description: (1) the customer's existing bill must be cleared BEFORE the plan-change to the park plan occurs; (2) credit limit is set to zero as a rule, but with a named override case (customers travelling may need it changed) implying an exception path exists at agent/back-office discretion.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “delivered via a 35 Rial, four-month upfront-paid 'park my number' plan with credit limit set to zero”

## ENT-032: KID (Karama ID / Kahramaa ID) / Service Point
`Explicit` · confidence: `high`

- **Description:** Backend identifier tied to a physical location used for fixed-line eligibility and provisioning; distinct from Karama ID (a government utility ID) issued by the electricity/water authority, though used interchangeably in some sources as "Kahramaa ID". Mapped via weekly IMS file to zone/street/building. One government KID may map to multiple Vodafone service points/VFIDs. KID-in-use exception: order created/submitted but held via mandatory order task pending contract attachment proof. Agents can only search, not manually enter KID. Lookup returns PatchingType, KIDStatus, ONT device, Area, ServiceAvailabilityDate, SLA, FieldPartner.
- **Attributes:** mapped via weekly IMS file to zone/street/building, KID, VFID (Vodafone ID), underscore index for partitioned units, RFS status, PatchingType (Prepatched/Non Prepatched), KIDStatus, ONT device ID, Area, ServiceAvailabilityDate, SLA, FieldPartner, address line/city/state/POBox/zip/country, Service Point ID, Install Date, Location, Status, Product, Service Type, Device Type
- **Relationships:** one government KID may map to multiple Vodafone service points/VFIDs; linked to Address and installed ONT/CPE device; linked to Contact and Sales Order; belongs to a Kahramaa ID address
- **Cardinality:** one Kahramaa ID can have multiple saved addresses / one active service point
- **Lifecycle states:** Prepatched vs Non Prepatched drives whether Instant or Normal Activation / Combo Box detection prompt appears
- **Validation rules:** KID-in-use exception: order created/submitted but held via mandatory order task pending contract attachment proof; agents can only search, not manually enter KID
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “KID (not Karama ID, which is a government utility ID) is the core backend identifier”
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Karama ID (KID), issued by the government/electricity authority...is the primary identifier used to determine RFS”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “KID lookup response for Kahramaa ID `16P6003`: `<PatchingType>Prepatched</PatchingType>`, `<KIDStatus>Available</KIDStatus>`, `<ONT>ALCLF11C1516</ONT>`, `<Area>LAB_GPON_2_AREA1</Area>`, `<ServiceAvailabilityDate>12/15/2019</ServiceAvailabilityDate>`, `<SLA>2</SLA>`, `<FieldPartner>VF_Fieldpartner_1</FieldPartner>`”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Service Point `16P6061_004`, Install Date 10/1/2023, Location "Not In Use", Status "Available", Product "Fixed Line Port", Service Type "Fixed Line", Device Type "ONT"”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Service Point 16P6109_ON..., Install Date 10/1/2023, Device Type ONT, DeviceID ALCLF11E0681”
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Enter the KID the user is moving to and click Go; system pop-up confirms "Location entered is Fiber-ready..."”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Qatar electricity/water department's identifier per unit; became Vodafone's de facto unique key for fixed provisioning”

## ENT-033: Vodafone ID (VFID)
`Explicit` · confidence: `high`

- **Description:** Vodafone's own alternative customer/location identifier with QR code enabling self-activation without a field engineer if ONT boxes are already installed. Format 'zone + four-digit BID + unit'; CEO-approved branded identifier. Normally one-to-one with KID; many-KIDs-to-one-VFID and one-VFID-to-many-KIDs supported corner cases; mapping lives in UIM not IMS.
- **Attributes:** format zone + 4-digit BID + unit, QR code
- **Relationships:** normally one-to-one with KID; many-KIDs-to-one-VFID and one-VFID-to-many-KIDs supported corner cases; mapping lives in UIM not IMS
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full transcript clarifies Vodafone ID's lifecycle and scope precisely: it is NOT assigned per-customer or per-order; it is assigned to the physical unit/location at the time Vodafone performs last-mile installation (a Vodafone ID project executed ~2 years prior to the workshop per a management mandate), exists for effectively all Karama-ID-mapped units (though fewer installs have used it in practice), and always resolves to a backend KID (KID remains the single source-of-truth identifier; Vodafone ID and Karama ID are both just alternate lookup paths to the same KID). Self-activation via its QR code is gated on ONT boxes already being physically present at the unit. | Full markitdown re-extraction surfaces explicit lifecycle/validation detail beyond the summary: VFID generation timing (in advance, by RPA), storage system (UIM, not IMS), the mapping mechanism (field survey team physically tags buildings, returns mapping file loaded via RPA), cardinality rules (normally 1:1, but many-KIDs-to-1-VFID supported, 1-VFID-to-many-KIDs is a manual corner case handled by sales+fulfillment), and the activation-time business rule that Karama ID (not VFID) is what actually drives activation even under one-to-many mapping.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full transcript clarifies Vodafone ID's lifecycle and scope precisely: it is NOT assigned per-customer or per-order; it is assigned to the physical unit/location at the time Vodafone performs last-mile installation (a Vodafone ID project executed ~2 years prior to the workshop per a management mandate), exists for effectively all Karama-ID-mapped units (though fewer installs have used it in practice), and always resolves to a backend KID (KID remains the single source-of-truth identifier; Vodafone ID and Karama ID are both just alternate lookup paths to the same KID). Self-activation via its QR code is gated on ONT boxes already being physically present at the unit. | Full markitdown re-extraction surfaces explicit lifecycle/validation detail beyond the summary: VFID generation timing (in advance, by RPA), storage system (UIM, not IMS), the mapping mechanism (field survey team physically tags buildings, returns mapping file loaded via RPA), cardinality rules (normally 1:1, but many-KIDs-to-1-VFID supported, 1-VFID-to-many-KIDs is a manual corner case handled by sales+fulfillment), and the activation-time business rule that Karama ID (not VFID) is what actually drives activation even under one-to-many mapping.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “Vodafone ID (with QR code) is Vodafone's own alternative identifier enabling customer self-activation without a field engineer if ONT boxes are already installed”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “format 'zone + four-digit BID + unit' (decision timestamp 00:47:58); Generated in advance by RPA, loaded into UIM, then mapped to KIDs by a field survey team”

## ENT-034: WFM Activity / Siebel Order Task
`Explicit` · confidence: `high`

- **Description:** Field workforce management activity that maps to a Siebel order task via integration. Raised in WFM by technician; creates Siebel order tasks for rollout team via integration; when Siebel task closed, WFM activity closed and agent notified. Oracle Field Service Cloud activity with Activity ID, Type, Start/End time, Duration, Service Window, Resource ID, Correlation Id, Booking Channel, Activity Status; includes Assess Activity, Checklist, Device Activation steps and requires an Installation Checklist before End.
- **Attributes:** Activity ID, Type (Installation), Start/End time, Duration, Service Window, Resource ID, Correlation Id, Booking Channel, Activity Status (started/pending), Customer Details, Service Details
- **Relationships:** raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team; linked to Sales Order (Siebel Order Number), technician resource, inventory transfer
- **Lifecycle states:** raised in WFM by technician -> creates Siebel order task -> Siebel task closed -> WFM activity closed -> agent notified; scheduled -> started -> Assess Activity -> Checklist -> Device Activation -> End
- **Validation rules:** requires Assess Activity, Checklist, Device Activation, Mandatory Fields completed before End
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team; when the Siebel task is closed, the WFM activity is closed”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Activity ID 120812, Type Installation, Start 14:59, End 16:59, Booking Channel 'Siebel', Activity Status 'started'”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Activity ID 120885, Activity Type Installation, Start 12:19, End 14:19... Activity Status started”

## ENT-035: CPE (Customer Premises Equipment) / ONT / Combo Box
`Explicit` · confidence: `high`

- **Description:** Customer premises equipment device (ONT, indoor/outdoor unit, combo box) separately scanned/depleted stock item from UIM with its own SPO; serial simply becomes free in UIM for reassignment on disconnection. Attribute updates (e.g., serial swaps) tracked with Action=Update and prior value retained in description.
- **Attributes:** serial number, KID mapping, stock/depleted status, CPE Model, MAC Address, Serial Number, IPTV Service Id, VoIP Number, Device Type (Indoor IDU/ODU/Outdoor IDU/Combo Box)
- **Relationships:** linked to SIM, service point/KID, order; attached to FMS CPE Bundle line item on Sales Order/Installed Asset
- **Lifecycle states:** in-stock, sold/assigned, freed on disconnection; installed -> modifiable (serial number update) -> active
- **Validation rules:** attribute update tracked with Action=Update and prior value in Description; must be free/unassigned in UIM before use
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; CPE serial simply becomes free in UIM for reassignment”
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Indoor Unit CPE Model: Huawei_B2368-66, Indoor Unit MAC Address: 84AA9C9FC121, Indoor Unit Serial Number: S180P18055021 -> S180P18055020”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Outdoor Unit CPE Model Huawei_B2368-66, Outdoor Unit MAC Address 84AA9C9FE127, Outdoor Unit Serial Number S180P18075127”
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “verify ONT device details in UIM (assigned/unassigned)... enter ONT device details and click Add To Transfer List”

## ENT-036: Address
`Explicit` · confidence: `high`

- **Description:** Maintained as a separate entity with history — old address marked discontinued/replaced with effective from/to dates, new address created as primary. Zone/street/building (ZSB) attributes with auto-formatted lookup.
- **Attributes:** zone/street/building (ZSB), effective from/to dates, discontinued/primary status, Zone, Street No., Building No., Apt/Flat/Unit, City, Country, Postal Code, Start Date, Active flag
- **Relationships:** linked to service point/KID and customer; belongs to Contact/Account; belongs to Lead/Contact
- **Lifecycle states:** primary, discontinued/replaced; Active
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “maintain address as a separate entity with history — old address marked discontinued/replaced with effective from/to dates, new address created as primary”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Address tab: auto-formatted address record - Zone 11A, Street No. 22, Building No. 33, Apt/Flat/Unit 44D, Address Line 1 ..., Country Qatar, Postal Code 1111”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “"2. Address" section: Zone, Street No., Building No., Apt/Flat/Unit fields — shown blank in the screenshot (later populated to Zone test89, Street test89, Building No. test89, Apt/Flat/Unit test89)”

## ENT-037: Customer / Contact
`Explicit` · confidence: `high`

- **Description:** Individual customer/contact record identified by ID, with personal, address and company attributes. Fields include First Name, Last Name, Nationality, Email, ID Type, ID Number, ID Expiration Date, Preferred language, Birth Date, Alternate/Cellular Phone #, Gender. Validation includes mandatory-field checks, format/length checks (email, phone, passport, GCC ID, Business ID), cross-field checks (DOB vs QID), age under 18 flag. Auto-populates read-only from ID scan; linked to Account, Order, Kahramaa ID address record, Employer (B2B2C). MOI Validation Status tracked; Alt phone # must be local mobile number; ID images required uploads with green-check verification.
- **Attributes:** Name, DOB, ID Type/Number/Expiry, Nationality, Email, Phone, Gender, Preferred language, Qatari ID, ID Expiry, Digital Lead/Sale flag, Lead/Opportunity ID, Enter ECR Details flag, Get IPTV? flag, Alt. phone #, MOI Validation Status, Company Name (B2B2C), Blacklisted flag
- **Relationships:** linked to Order/Account via applicant details; Linked to Kahramaa ID (KID) address record; linked to Account; linked to Sales Order; linked to Employer (B2B2C); has Address record; owned by a User (Lead Owner)
- **Lifecycle states:** Looked up -> confirmed -> edited fields marked with green checkmark; created -> validated (green check) -> linked to Account
- **Validation rules:** mandatory-field checks, format/length checks (email, phone, passport, GCC ID, Business ID), cross-field checks (DOB vs QID), age under 18 flag; Alt. phone # must be a local mobile number (notification contact); ID images (Qatari ID-Front/Back) required uploads with green-check verification; ID must be validated (green checkmark); Employer/Special Management populate only after order approval
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “First Name, Last Name, Nationality, Email, ID Type, ID Number, ID Expiration Date, Preferred language, Birth Date, Alternate/Cellular Phone #, Gender”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “contact details auto-populate (read-only/greyed): Qatari ID 29035654458, ID Expiry 6/5/2025, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “ID Type = 'Qatari ID', ID Number = 27579200746 ... Nationality Turkish, Gender M, First name MUSTAFA, Last name GULEC”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Company Name "01 vfqatest01"... Employer field now populated "01 vfqatest01" (previously blank while Pending)”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Qatari ID 29035654458, Id expiry 4/21/2026, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “ID Type: Qatari ID, ID#: 28260821189, ID expiry: 3/16/2026, Nationality: Filipino, Gender: M, First name: ALLAN, Last name: GRANADA, Birth date: 3/13/1982”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Contact Details: First Name, Last Name, Blacklisted: No, ID Type: Qatari ID, ID Number, DOB, Email Address”

## ENT-038: Account
`Explicit` · confidence: `high`

- **Description:** Customer account record holding installed assets, billing, credit status, contacts, orders. Attributes include Account Name/#, Account Class, Account Type (Residential/Business), Customer Since, Customer Segment (Expatriate), Address, Primary Contact, Notification Contact/Language/Number, Pre-approved credit (Expatriate/Qatari), Credit Risk score, Primary MSISDN, Kahramaa ID, Account Team, Status, Special Management, Parent Account Id (B2B2C linkage). Has multiple Orders, Contacts, Billing Profiles, Installed Assets, Trouble Tickets tabs. Audit trail tracks field changes with employee/user, field, new value, timestamp.
- **Attributes:** Account Name, Account #, Account Class, Account Type, Customer Since, Customer Segment, Address, City, Country, Primary Contact, Notification Contact/Language/Number, Pre-approved credit, Credit Risk score, Primary MSISDN, Kahramaa ID, Account Team, Status, Special Management, Parent Account Id, LastMonthRevenue
- **Relationships:** Has multiple Orders (Sales Order history including Abandoned/Complete/Open); linked to Contact; has Contacts, Orders, Billing Profiles, Installed Assets; linked to Employer via Parent Account Id for B2B2C
- **Lifecycle states:** Active
- **Validation rules:** none stated beyond audit trail tracking of field changes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Account Name "Vishakan Soundara[rajan]", Account # `126897979237`, Account Class Customer, Account Type Residential, Customer Since 2/19/2024, Customer Segment Expatriate”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Account 'YAM POKHAREL' (Account# 129795148979, Residential/Expatriate); MANAGETEST modified 'Parent Account Id' to '1-59PPBV'”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Account Summary view for account BIJAY MAHATO, Account # 129822004273, Account Class Customer, Account Type Residential, Customer Segment Expatriate, Customer Since 4/8/2026, Notification Contact, Kahramaa ID”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Account Summary for customer HEMANTH GOVARDHANAN (Account # 80772215054, Account Class Customer, Account Type Residential, Customer Segment Expatriate, Status Active, Primary MSISDN...)”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Account for Sivakumar Kanniah (Residential, Expatriate, Credit Limit 1,000, Active)”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Account #: 113312346011, Account Name, Account Type: Business, Customer Segment: Reimbursement, Credit Limit: 500, Notification Contact Number, LastMonthRevenue”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Account header: Notification Contact NAZIR... Account Status Active, Credit Risk "No score", Account Team AKKIRAJJUB, Primary MSISDN 97441202325”

## ENT-039: Line Item / Line Item Attribute
`Explicit` · confidence: `high`

- **Description:** Hierarchical parent/child product/service components of a Sales Order (e.g. Promotion -> Broadband Internet Service -> component services; CPE Bundle; SIM Card; Bill Manager). Attribute changes recorded with Action=Update and old value retained in description. One order has multiple hierarchical line items.
- **Attributes:** Line #, Action (Add/Update/Delete), Billing Profile, Address, Status Context (e.g. FULFILL BILLING START: reached, INITIATE WFM START: reached), Service Id, Start Price, Device Model, Device Number/Serial No, Device Type, MAC Address, OUI, Product Class, VoIP Number, Port ID, Name/Value/Action/Description/Data Type
- **Relationships:** Hierarchical parent/child structure under a Sales Order; child of Sales Order
- **Cardinality:** one order has multiple hierarchical line items
- **Lifecycle states:** Pending -> Complete; reached milestones progress to Complete
- **Validation rules:** Attribute changes recorded with Action=Update and old value retained in Description
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “13 total, hierarchical... GigaHome Classic 300 TB -F Promotion — Status Context "FULFILL BILLING START: reached"”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “CPE Bundle Line Item Attributes: CPE Device T[ype] = 'Combo Box', CPE Serial No 'ALCLF11E0681CPE', MAC Address E48E1084D681”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Line Item Attributes grid for the Bill Limit Mobile line shows: SL Default Value = 20, SL Limit Amount = 67, SL Min Value = 0.01”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Line Items grid (12 lines) for the new line: New Plus Max India BIA Promotion (top-level), Mobile Service Bundle, and components — New Postpaid+ Max - BIA, Mobile Voicemail, SIM Card...”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “10 line items (1-10 of 10) each showing status-context milestones... GigaHome Premium OD New 5G FWA Pro... FMS CPE Bundle -> FMS CPE ODU, FMS CPE Outdoor IDU”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Line Items (1-3 of 3): Update Mobile Service Bundle (97479026346, billing profile 1-D8SB5BJ), Delete Prepaid Red Promotion (billing profile 1-D7SNQ4I), Add Postpaid U Start Promotion”

## ENT-040: Appointment
`Explicit` · confidence: `high`

- **Description:** Field installation appointment booked during order creation, tracked through WFM/OFSC. Cannot be cancelled once booked.
- **Attributes:** Appointment Number, Technician ID, Status (pending), Appointment Date, Channel, Appointment ID, Time Slot, Cluster
- **Relationships:** linked to Sales Order line item (Book Appointment action); assigned to Technician resource
- **Lifecycle states:** Booked (irreversible once confirmed) -> pending -> assigned -> started -> completed by technician (implied)
- **Validation rules:** Warning: appointment once booked cannot be cancelled; slot capacity limited
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “success alert: "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242." ... Appointment Number `1-26921281993`, Technician ID `ABATS_Consumer_Installation`, Status `pending`, Appointment Date `06/05/2024`, Channel `SIEBEL`, Activity ID `113242`, Time Slot `11AM - 2PM`”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Activity ID 120812, Type Installation, Start 14:59, End 16:59, Booking Channel 'Siebel', Activity Status 'started'”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Activity ID 120885, Activity Type Installation, Start 12:19, End 14:19... Activity Status started”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Appointment Number 1-29728036686, Technician ID ABATS_Consumer_Installation, Status pending, Appointment Date 09/20/2025, Channel SIEBEL, Appointment ID 120955, Time Slot 8AM - 11AM”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “not applicable - included via journey”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Appointment Number 1-29795178277, Technician ID ABATS_Consumer_Installation, Status pending, Appointment Date 02/09/2026, Time Slot 8AM-11AM”

## ENT-041: Sales Order (see Order ENT-006)
`Explicit` · confidence: `high`

- **Description:** NOTE: This item is fully merged into ENT-006 (Order). All sources listed here contribute to ENT-006's consolidated Sales Order attributes/lifecycle. Retained separately only for traceability of raw items describing 'Sales Order' as a term distinct in labeling from generic 'Order' rows, but describes the same real-world entity as ENT-006.
- **Attributes:** see ENT-006
- **Relationships:** see ENT-006
- **Lifecycle states:** see ENT-006
- **Validation rules:** see ENT-006
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Order # 1-29792357564, Order Type Activation, Status Open->Complete, Created By VINODHINIR, Fulfillment Status In Progress->Complete”

## ENT-042: Reject Reason (Order Rejection)
`Explicit` · confidence: `high`

- **Description:** Multi-select reject reason field attached to a rejected Sales Order, driving which fields must be re-collected in Order Correction.
- **Attributes:** Reason code/label, associated free-text Comments
- **Relationships:** Attached to a rejected Sales Order; drives which fields must be re-collected in Order Correction
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “a multi-select Reject Reason field. "ID image not clear" is tagged/selected. Other selectable reasons visible in the dropdown: ID type or ID number mismatch, Customer Signature doesn't match with ID, Incorrect add on or discount, Device receipt missing, Missing Speed test result/ Building information, Bill explainer missing/ Incorrect”

## ENT-043: Notification / SMS Message (OSB)
`Explicit` · confidence: `high`

- **Description:** Message triggered by Order status change (rejection or approval) via Oracle Service Bus.
- **Attributes:** Message ID, Database/Logging Timestamp, Server, State, Node, Pipeline, Stage, Inbound Service (PS_VFQA_Communication), Operation (CreateCommunication), SMSTXT payload
- **Relationships:** Triggered by Order status change (rejection or approval) via Oracle Service Bus
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “characteristic `SMSTXT` with value: "New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

## ENT-044: User / Agent / Responsibility (Siebel access role)
`Explicit` · confidence: `high`

- **Description:** Employee/user record with job title, alias, email, team, and one or more assigned Responsibilities (roles, e.g. Back Office Fulfilment, VFQ Base 2, VFQA Sales) that govern accessible tiles/journeys.
- **Attributes:** User ID, Last Name, First Name, Job Title, Alias, Email, Contact Team, Responsibility (Available/Selected list), Organization, Designation, Position, Location, Team, Company, Outlet Id, Manager Email, Mobile Number
- **Relationships:** Assigned one or more Responsibilities that govern accessible tiles/journeys; executes Orders; linked to Order Approval Activity
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field list recovered for the User/Agent entity (Administration - User > All Person Administration screen) plus the many-to-many Responsibility assignment mechanism via a picker dialog with a 'Selected' panel, showing an agent can carry multiple responsibilities with one apparently primary/checked (VFQA Sales), and that responsibilities gate which app tiles/journeys (e.g. MNP) are visible on Agent Home. | The existing summary already contains a complete field list for the User/Agent record on the Agents Details tab, including designation, email, outlet, manager, company, location, team, mobile - this is the field inventory the gap requested. No explicit 'Responsibility' role-list beyond 'Retail Agent' (agent) and 'Test Manager' (approver) is separately enumerated in this document, but those two role instances with their queue/permission implications (Retail Agent submits; Test Manager sees Order Approval menu and approve/reject actions) are concretely evidenced. | The Employees screen record shown in image1 gives a full field-level shape for this entity: User ID, Designation, Responsibility (role), Position, Organization, Location, Team, Company — directly usable as the entity's attribute list, and the Responsibility field is explicitly tied to menu/tile access ('VFQA Mass Market Agent' role vs. later 'Test Manager' role showing a narrower tile set in the Lead Creation document), demonstrating the RBAC-governing behavior described. | The summary (screenshot 1, direct visual read of the All Person Administration admin screen) already provides the concrete field set for the User/Agent/Responsibility entity: Last Name, First Name, User ID, Job Title, Contact Team, Responsibility, New Responsibility, Alias — this is the field-level shape requested. No explicit lifecycle-state machine is shown (this is a reference/config screen, not a stateful workflow entity), but the field inventory itself is fully evidenced. | The source document (via direct visual reading of the Administration – User > All Person Administration screenshot, image 1) gives a full field-level record shape for this entity, beyond the responsibility-picker fragment originally cited: User ID, Last Name, First Name, Job Title, Contact Team, Alias, Email, and a 'Responsibility' field plus a 'New Responsibility' field (i.e. the record supports an active/primary responsibility distinct from one being added). The Responsibilities picker (image 2) further shows the underlying catalogue is a large flat list of role names (AT Partner Analytics Administrator/User, AT Sales Analytics Administrator/User, AT Service Analytics Administrator/User, Analyst Routing Model, Anonymous User - SMC, Asset Management, etc.) from which multiple can be multi-selected into a 'Selected' panel, with one flagged as primary/checked (VFQA Sales in this case) — confirming a many-to-many User-to-Responsibility model with a single 'primary' designation, not just a static list.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field list recovered for the User/Agent entity (Administration - User > All Person Administration screen) plus the many-to-many Responsibility assignment mechanism via a picker dialog with a 'Selected' panel, showing an agent can carry multiple responsibilities with one apparently primary/checked (VFQA Sales), and that responsibilities gate which app tiles/journeys (e.g. MNP) are visible on Agent Home. | The existing summary already contains a complete field list for the User/Agent record on the Agents Details tab, including designation, email, outlet, manager, company, location, team, mobile - this is the field inventory the gap requested. No explicit 'Responsibility' role-list beyond 'Retail Agent' (agent) and 'Test Manager' (approver) is separately enumerated in this document, but those two role instances with their queue/permission implications (Retail Agent submits; Test Manager sees Order Approval menu and approve/reject actions) are concretely evidenced. | The Employees screen record shown in image1 gives a full field-level shape for this entity: User ID, Designation, Responsibility (role), Position, Organization, Location, Team, Company — directly usable as the entity's attribute list, and the Responsibility field is explicitly tied to menu/tile access ('VFQA Mass Market Agent' role vs. later 'Test Manager' role showing a narrower tile set in the Lead Creation document), demonstrating the RBAC-governing behavior described. | The summary (screenshot 1, direct visual read of the All Person Administration admin screen) already provides the concrete field set for the User/Agent/Responsibility entity: Last Name, First Name, User ID, Job Title, Contact Team, Responsibility, New Responsibility, Alias — this is the field-level shape requested. No explicit lifecycle-state machine is shown (this is a reference/config screen, not a stateful workflow entity), but the field inventory itself is fully evidenced. | The source document (via direct visual reading of the Administration – User > All Person Administration screenshot, image 1) gives a full field-level record shape for this entity, beyond the responsibility-picker fragment originally cited: User ID, Last Name, First Name, Job Title, Contact Team, Alias, Email, and a 'Responsibility' field plus a 'New Responsibility' field (i.e. the record supports an active/primary responsibility distinct from one being added). The Responsibilities picker (image 2) further shows the underlying catalogue is a large flat list of role names (AT Partner Analytics Administrator/User, AT Sales Analytics Administrator/User, AT Service Analytics Administrator/User, Analyst Routing Model, Anonymous User - SMC, Asset Management, etc.) from which multiple can be multi-selected into a 'Selected' panel, with one flagged as primary/checked (VFQA Sales in this case) — confirming a many-to-many User-to-Responsibility model with a single 'primary' designation, not just a static list.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Detail form shows Job Title "Team Leader", Alias "1234999", Email..., Contact Team "SADMIN", Responsibility "Back Office Fulfilm[ent]", New Responsibility "AT Service Analytic[s]"”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “User ID HEMANTH, Last Name Kumar, First Name Hemanth, Job Title 'Team Leader', Contact Team SADMIN, Alias 1234999, Email, Responsibility field set to 'VFQA Sales'”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33 (responsibility)`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33 (responsibility).md): “Responsibilities picker dialog lists available responsibilities (AT Partner Analytics Administrator/User ... ) with a Selected panel already containing: Back Office Onshore, VFQ Base 2, and VFQA Sales (checked/primary)”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Agent First/Last Name VINODHINIR, Login VINODHINIR, Designation "Retail Agent", Email tirupati.nanda@vodafone.co…, Outlet Id 1122334455”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “agent Hemanth Kumar, User ID HEMANTH, Designation "Team Leader," Responsibility "VFQA Mass Market Agent," Position "F/O CC Champion"”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Last Name "Kumar", First Name "Hemanth", User ID "HEMANTH", Job Title "Team Leader", Contact Team "SADMIN", Responsibility "VFQA Sales"”

## ENT-045: Installed Asset
`Explicit` · confidence: `high`

- **Description:** Provisioned products/services on the customer account, visible under Account > Installed Assets once fulfilled. Created from completed Sales Order; account has multiple installed assets.
- **Attributes:** Product/Service name, Service Id, Status (Active), Effective From/To, Service Account, Price, Billing Profile, Promotion, Order Date, Order #, Order Type, Postpaid Activation Date
- **Relationships:** belongs to Account and Billing Profile; created from completed Sales Order; represents provisioned product/service
- **Cardinality:** account has multiple installed assets (e.g. 8 active assets)
- **Lifecycle states:** provisioned -> Active
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “'Installed Assets' grid lists 8 active assets (CPE Bundle, Broadband CPE, Broadband Internet Service, ONT MDU Port Equipment, VoIP Service, Gigahome 5Gbps, Fibre Spend Limit, GigaHome 5Gbps Promotion)”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Products and Services" grid, 8→9 rows, all Active: FMS CPE Bundle... GigaHome Premium OD New 5G FWA Promot...”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Installed Assets list (14 items) shows existing services: Mobile Service Bundle, New Plus Extra India BIA Promotion...”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Installed Assets shows a Prepaid Red Promotion (MSISDN 97479026351)”

## ENT-046: Order Approval / Activity (Approval Queue)
`Explicit` · confidence: `high`

- **Description:** Queue/activity record used by manager approvers to track and action pending orders, requiring Approve or Reject action with comment. Includes Approval Queue holding activities/orders awaiting a manager's action, and Agent Details tab showing agent record.
- **Attributes:** Approval Status (Submitted for Approval/Pending), Activity Status (Ready To Assign/Assigned), Activity #, Owner, Channel, Type, Topic, Sub Topic, Area, Journey Name, Mobile #, Order#, Service Account, Order Approval Status, Order Created Date
- **Relationships:** linked to Sales Order; assigned to Manager persona via queue; linked to Contact, Agent
- **Lifecycle states:** Ready To Assign -> Assigned -> Approved/Rejected; Closed
- **Validation rules:** requires Approve or Reject action with comment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Activity #1-DOR9IIP, Status Assigned, Owner MANAGETEST, Channel 'Approval Action'”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Activity # 1-DND7ZJO, Status Assigned, Owner MANAGETEST, Channel "Approval Action," Type Other, Topic "Automated Gui[ded Journey]", Area "Approval - New…"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Journey Name "New FWA Tablet", Mobile # 97441202301, Activity# 1-DNN25R4, Order# 1-29727615763... Owner VFQA_DSA_ORDER_APPROVAL_QUEUE_TESTING”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd (queue)`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd (queue).md): “TM SR Queue View lists approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ, _JAGUAR, _TESTING, _VISTAS)”

## ENT-047: Employer / Company (B2B2C)
`Explicit` · confidence: `high`

- **Description:** Company/corporate sponsor entity linked to Contact/Account via B2B2C sponsorship, driving account Special Management tagging.
- **Attributes:** Company Name
- **Relationships:** linked to Contact/Account via B2B2C sponsorship; linked to Contact as Employer
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full entity behavior recovered: the Employer/Company entity is selected via dropdown at Contact creation, is dedicated a distinct contact-level action button ('Update B2B2C Employer'), and its linkage is written to a specific back-end field ('Parent Account Id') on approval, tracked in the Contact Audit Trail with actor and timestamp — giving concrete field names and a lifecycle trigger (approval event) for when the linkage is persisted.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full entity behavior recovered: the Employer/Company entity is selected via dropdown at Contact creation, is dedicated a distinct contact-level action button ('Update B2B2C Employer'), and its linkage is written to a specific back-end field ('Parent Account Id') on approval, tracked in the Contact Audit Trail with actor and timestamp — giving concrete field names and a lifecycle trigger (approval event) for when the linkage is persisted.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Company Name B2B2C dropdown: agent selects 'SIPT'; MANAGETEST modified 'Parent Account Id' to '1-59PPBV'”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Company Name field with a searchable dropdown — agent types/selects "TestVQW" from a list that also shows "01 newfreedcn01_Test" and "01 querybar01"”

## ENT-048: Inventory Transfer Record
`Explicit` · confidence: `high`

- **Description:** Transfers CPE/SIM items from warehouse/team (ABATS) to technician, tracked in Oracle Field Service Cloud.
- **Attributes:** Part Number, Serial No, Quantity, Current Owner, Transfer To, Total Items
- **Relationships:** transfers CPE/SIM items from warehouse/team (ABATS) to technician; linked to Activity/Appointment
- **Lifecycle states:** Transferred From ABATS -> Transfer To technician
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “'Transfer List' tab shows Total Items: 2 (I-010G-P + 00E0FC, Current Owner ABATS, Transfer To 'Syed Irfan')”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Transfering From: ABATS to resource Syed Irfan, three parts transferred one at a time (qty 1 each)”

## ENT-049: Installation Checklist
`Explicit` · confidence: `high`

- **Description:** Checklist completed as part of a WFM Activity before ending, covering speed tests, Wi-Fi setup, optical power readings, splitter ports, customer briefing and signature.
- **Attributes:** Speed test results, Wi-Fi username, Timestamp of calls, WiFi Coverage Tested checkbox, Optical Power Meter Reading, Splitter Free Port Details, attachments, customer briefing checklist items, Customer Signature
- **Relationships:** completed as part of WFM Activity before ending
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field inventory and validation gating already present: the Installation Checklist entity has a defined field set (speed test result, Wi-Fi usernames, call timestamp, WiFi Coverage Tested checkbox, optical power reading, splitter port count, 7 named photo attachments, 4 customer-briefing acknowledgement checkboxes, signature), and is gated by a banner requiring completion before the Activity can be Ended, plus a downstream 'Forms Submitted' indicator confirming its completion state is tracked.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field inventory and validation gating already present: the Installation Checklist entity has a defined field set (speed test result, Wi-Fi usernames, call timestamp, WiFi Coverage Tested checkbox, optical power reading, splitter port count, 7 named photo attachments, 4 customer-briefing acknowledgement checkboxes, signature), and is gated by a banner requiring completion before the Activity can be Ended, plus a downstream 'Forms Submitted' indicator confirming its completion state is tracked.
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Speed test results on Wi-Fi and LAN" = Test, "Optical Power Meter Reading" = 1, "Splitter Free Port Details" = 1”

## ENT-050: Billing Bucket / Data Bucket (Surepay Bucket)
`Explicit` · confidence: `high`

- **Description:** Data allowance bucket tracked in the billing/usage system per MSISDN/Billing Profile.
- **Attributes:** Bucket Id, Bucket Name, Remaining data (KB), Status, expiration date
- **Relationships:** linked to MSISDN/Billing Profile after activation; belongs to Billing Profile / MSISDN
- **Lifecycle states:** Active
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"GigaHome Premium OD New 5G" (Bucket Id B3B, Remaining 415,642,048 KB, Status Active)”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Surepay Bucket Details (2 buckets, both Active): "Endless Data@1M:..." (Bucket Id H1J) and "Gigahome Classic OD 5G New:..." (Bucket Id H1P...)”

## ENT-051: Audit Trail
`Explicit` · confidence: `high`

- **Description:** Tracks changes on Account and Contact records — employee/user, field modified, new value, timestamp.
- **Attributes:** employee/user, field modified, new value, timestamp
- **Relationships:** tracks changes on Account and Contact records
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Two full, specific Audit Trail entries recovered at both Account and Contact level, each showing actor (user login), field name changed, new value, and precise timestamp — plus the original record-creation entries by a third user (KARTHIKK) at account creation, giving a fuller lifecycle picture (creation -> field updates -> approval-triggered updates) than the originally flagged single evidence line.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Two full, specific Audit Trail entries recovered at both Account and Contact level, each showing actor (user login), field name changed, new value, and precise timestamp — plus the original record-creation entries by a third user (KARTHIKK) at account creation, giving a fuller lifecycle picture (creation -> field updates -> approval-triggered updates) than the originally flagged single evidence line.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"MANAGETEST modified 'Sales Number' to 'Consumer B2B2C' at 10:11:54 AM; HALEEMI modified 'VFQA Preapproved Qatari Expat' to 1000 at 10:05:07 AM"”

## ENT-052: Technician Resource / Inventory
`Explicit` · confidence: `high`

- **Description:** Field technician resource with assigned inventory items tracked/transferred in Oracle Field Service Cloud, linked to Activity/Appointment.
- **Attributes:** Resource Id, Resource name, assigned parts (CPE/SIM), quantities, Current Owner
- **Relationships:** linked to Activity/Appointment
- **Lifecycle states:** Transferred From ABATS -> Transfer To technician
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Transfering From: ABATS to resource Syed Irfan, three parts transferred one at a time (qty 1 each)”

## ENT-053: UIM Custom Object (SIM/CPE inventory record)
`Explicit` · confidence: `high`

- **Description:** Oracle UIM inventory record used to validate SIM/CPE serials against Inventory Status, Assignment Status, Device Status.
- **Attributes:** Specification, Inventory Status, Assignment Status, Device Status, ICCID, IMSI1, MSISDN
- **Relationships:** referenced during Order Line Item SIM/CPE serial validation
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The existing summary already contains the full attribute set and validation semantics for this entity (used to gate order progression), satisfying the lifecycle/validation detail requested: Inventory Status, Assignment Status, Device Status act as the validation gates (e.g. 'not free in UIM' when Assignment Status is not Available/Unassigned; 'already assigned' when Assignment Status is Assigned to another order).
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The existing summary already contains the full attribute set and validation semantics for this entity (used to gate order progression), satisfying the lifecycle/validation detail requested: Inventory Status, Assignment Status, Device Status act as the validation gates (e.g. 'not free in UIM' when Assignment Status is not Available/Unassigned; 'already assigned' when Assignment Status is Assigned to another order).
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Custom Object Summary for SIM 8942702800801190296F: Specification SIM Card, Inventory Status Installed, Assignment Status Assigned, Device Status Available”

## ENT-054: Cross Sales Offer / Migration Offer
`Explicit` · confidence: `high`

- **Description:** Targeted marketing/offer record shown on a Contact's Cross Sales tab or sourced from Unica campaign engine, that can be accepted to launch a guided journey (e.g., MNP, Plan Upgrade). Attached to Installed Asset or Contact.
- **Attributes:** OfferType, OfferName, MonthlyRental, OfferDescription, CampaignCode, PriorityCode, ServiceIdentifier, Status, TreatmentCode, Channel, PromotionId, Price, AddOn_Monthly, linked Product IDs
- **Relationships:** linked to Contact; drives launch of a guided journey; attached to Installed Asset; sourced from Unica campaign engine; drives resulting Order
- **Lifecycle states:** Offered -> Accepted/Interested/Rejected/Closed
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “OfferType "New MNP", OfferName "MNP New Pos...", MonthlyRental 145, OfferDescription "Switch to Postpai...", CampaignCode C000009053... Status "Offered"”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “OfferType "New MNP", OfferName "MNP New Pos...", MonthlyRental 145, OfferDescription..., CampaignCode C000009053, PriorityCode 100.0, ServiceIdentifier..., Status "Offered", TreatmentCode..., Channel "Inbound", PromotionId..., Price 0”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Migration Offers grid ... OfferName Postpaid U Start Promotion ... PromotionId 1-92T1KE1, PriorityCode 100.0, CampaignCode C000006358, Status Offered ... Channel Inbound, AddOn_Monthly 15, MonthlyRental 135, OfferType Plan Upgrade”

## ENT-055: Donor Details / Donor Attachment (MNP)
`Explicit` · confidence: `medium`

- **Description:** MNP-specific data captured about the donor (losing) network operator as part of the port-in process.
- **Attributes:** Port-in Number, Donor ID, Donor ID Type, Donor Type, Donor Operator, Subscription Type
- **Relationships:** part of MNP Order/journey
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field list recovered for Donor Details entity from the '6. Donor Details' step, including field types (dropdown vs read-only/greyed) and the linkage to the MNP Application Form's applicant/current-service-provider fields, plus the derived Donor Attachment artifacts (Letter for Extension of Contract, Digital MNP Form) that get generated and stored against this entity. | The summary (screenshot 6, direct visual read) already documents concrete Donor Details fields captured in this exact MNP Postpaid journey step 6, giving field-level shape to the Donor Details entity beyond just naming the step: the fields visible are Port-in equivalent context plus billing profile linkage. Additionally the sibling MNP Prepaid document (also in this batch) gives an even fuller field list for the analogous Donor Details step: Port-in Number, Donor ID Type, Donor ID, Donor Type, Donor Operator, Subscription Type, plus Donor Attachment as an uploaded/generated MNP T&C document tile. This cross-document evidence (same corpus, same entity, MNP Prepaid variant) concretizes the Donor Details/Donor Attachment entity's field-level shape.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full field list recovered for Donor Details entity from the '6. Donor Details' step, including field types (dropdown vs read-only/greyed) and the linkage to the MNP Application Form's applicant/current-service-provider fields, plus the derived Donor Attachment artifacts (Letter for Extension of Contract, Digital MNP Form) that get generated and stored against this entity. | The summary (screenshot 6, direct visual read) already documents concrete Donor Details fields captured in this exact MNP Postpaid journey step 6, giving field-level shape to the Donor Details entity beyond just naming the step: the fields visible are Port-in equivalent context plus billing profile linkage. Additionally the sibling MNP Prepaid document (also in this batch) gives an even fuller field list for the analogous Donor Details step: Port-in Number, Donor ID Type, Donor ID, Donor Type, Donor Operator, Subscription Type, plus Donor Attachment as an uploaded/generated MNP T&C document tile. This cross-document evidence (same corpus, same entity, MNP Prepaid variant) concretizes the Donor Details/Donor Attachment entity's field-level shape.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “the complete 9-step structure of the MNP Postpaid journey... 6. Donor Details, 7. Donor Attachment”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Port-in Number 97466000666, Donor ID 893093, Donor ID Type = Passport, Donor Type = Consumer, Donor Operator = Qtel, Subscription Type = Postpaid”

## ENT-056: MNP Application Form (contract document)
`Explicit` · confidence: `high`

- **Description:** Bilingual (Arabic/English) Vodafone-branded Mobile Number Portability Application Form generated -> signed -> attached to Order under Donor Attachment step.
- **Attributes:** Date, Retailer ID, Segment, Switching type, Current service type, Applicant details (name, current provider, number to switch, ID type/number), declaration clauses, e-signature, Multi number switching table
- **Relationships:** attached to Order under Donor Attachment step
- **Lifecycle states:** generated -> signed -> attached
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Mobile Number Portability Application Form (bilingual Arabic/English, Vodafone-branded): Date, Retailer ID, Segment, Switching type, Current service type, Applicant details table”

## ENT-057: Lead
`Explicit` · confidence: `high`

- **Description:** Created for non-standard customers instead of a direct order. Tracked with mobile number, service needed, status/sub-status, ownership, and conversion tracking to order.
- **Attributes:** Lead Num, Mobile Number, Service Needed, First/Last Name, Preferred Time/CallBack Date-Time, Zone/Street/Building/Unit, Fixed Pre Sales, Description, Lead Status, Lead Sub Status, Lead Owner, Created By, Created date, OrderId, Date Converted, Convert Agent Id, Reject Reason Code, Reject Comment, Alternate Mobile#, Outlet Id, Assigned Team, Manager, Lead Channel, Lead Contact
- **Relationships:** created for non-standard customers instead of direct order; has Address record; owned by a User (Lead Owner); created by a User (Created By, immutable); may convert to Order; belongs to Contact; Portal captures MSISDN and creates a Siebel lead via API
- **Lifecycle states:** New -> In Progress (Call Back/No Answer sub-status) -> Rejected / Lead Converted / Retired / Submitted / Assigned / Accepted
- **Validation rules:** no lead created without MSISDN
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “non-standard customers get a lead created instead”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Lead Details View: Mobile # 97410001000, Lead Status In Progress, Lead Sub Status Call Back, Created 11/18/2025 12:37:58, Created By/Lead Owner HEMANTH, Fixed Pre Sales Yes, Description 'Home'”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

## ENT-058: Star Number Value Tier
`Explicit` · confidence: `high`

- **Description:** Value tier and lock-in duration for star numbers.
- **Attributes:** value range, lock-in duration
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The T&Cs page gives the full lifecycle/business-rule detail for the Star Number entity: a 90-day reservation hold pending QID submission, plus two value tiers with distinct lock-in durations, tied explicitly to price bands.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] The T&Cs page gives the full lifecycle/business-rule detail for the Star Number entity: a 90-day reservation hold pending QID submission, plus two value tiers with distinct lock-in durations, tied explicitly to price bands.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Star Number lock-in of 1 year for QR1,500–19,999 numbers, 2 years for QR20,000+”

## ENT-059: Deposit / Credit Limit (Consumer)
`Explicit` · confidence: `high`

- **Description:** Deposit rules for consumer accounts, including minimum deposit or valid credit card, with unclaimed-to-charity timeline.
- **Attributes:** amount, refund status, unclaimed-to-charity timeline (12 months)
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Deposit/credit-limit rule confirmed with amount and payment-method alternative (QR 2,000 minimum deposit OR valid credit card), plus a related lifecycle rule for unclaimed deposits going to charity after 12 months, both located in the General T&Cs section of the CAF.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Deposit/credit-limit rule confirmed with amount and payment-method alternative (QR 2,000 minimum deposit OR valid credit card), plus a related lifecycle rule for unclaimed deposits going to charity after 12 months, both located in the General T&Cs section of the CAF.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “credit limit/deposit rules (minimum deposit QR 2,000 or valid credit card)”

## ENT-060: Home Move Case
`Explicit` · confidence: `high`

- **Description:** Matrix of fiber/5G × indoor/outdoor combinations, each with WFM-installation-required and dismantle-required flags. Old service remains live until new location provisioned.
- **Attributes:** service type combination (fiber/5G x indoor/outdoor), WFM install flag, dismantle flag
- **Lifecycle states:** old service live until new location provisioned
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “matrix of fiber/5G × indoor/outdoor combinations, each with WFM-installation-required and dismantle-required flags”

## ENT-061: CRM Journey/Feature Catalog (Page Type Row)
`Explicit` · confidence: `high`

- **Description:** 165 distinct journey/feature rows describing CRM journeys and features, with columns for journey category, type, description, platform availability, and CBU/EBU applicability. Extended with a Type Taxonomy (User Journey/Workflow-Task/View/Action/Access-Permission) and traceability model (User Journey -> Workflow/Process -> Task -> View/Screen -> Action -> Access/Permission), grouped into 15 analytical Functional Clusters.
- **Attributes:** #, Journey Category (Lead/Sales/Support/Manage/Disconnect), Journey Type, Type (User Journey/Workflow-Task/View/Action/Access-Permission), Description, Comment, Guided journey Desktop, Guided journey Tablet, Desktop vanilla, CBU, EBU, AI Comments
- **Relationships:** Traceability model: User Journey -> Workflow/Process -> Task -> View/Screen -> Action -> Access/Permission, grouped into 15 analytical Functional Clusters
- **Cardinality:** 165 total journeys
- **Sources:**
  - [`crm-journeys-final-updated-a23640a5`](../.knowledge/docs/crm-journeys-final-updated-a23640a5.md): “165 distinct journey/feature rows...Journey Category, Journey Type, Description, Comment, Desktop, Tablet”
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “165 journey rows, columns: #, Journey Category, Journey Type, Type, Description, Comment, Guided journey Desktop, Guided journey Tablet, Desktop vanilla, CBU, EBU, AI Comments”

## ENT-062: Functional Cluster
`Explicit` · confidence: `high`

- **Description:** 15 analytical clusters introduced to reconstruct the Workflow/Process/Task layer, grouping multiple Page Type rows; 9 of 15 clusters are BAU/account-servicing with no anchor User Journey.
- **Attributes:** cluster ID (e.g. CL02), name, completeness status
- **Relationships:** Groups multiple Page Type rows; 9 of 15 clusters are BAU/account-servicing with no anchor User Journey
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “the sheet introduces 15 analytical "Functional Clusters" to reconstruct the Workflow/Process/Task layer”

## ENT-063: Type Taxonomy Category
`Explicit` · confidence: `high`

- **Description:** 5-row lookup table defining each Type category (User Journey, Workflow/Task, View, Action, Access/Permission) with its definition and use case.
- **Attributes:** Type name (User Journey, Workflow/Task, View, Action, Access/Permission), definition, use case
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “a 5-row lookup table defining each Type category with its definition and use case”

## ENT-064: GigaHome Subscription Acceptance Form
`Explicit` · confidence: `high`

- **Description:** Customer acceptance form for GigaHome 5G Plans, with T&Cs, plan/billing details and signature.
- **Attributes:** 18 numbered T&C clauses, Upfront Fee, Bill Cycle, Discount %/months, Internet speed tier, FUP threshold, plan lock-in period, install address (Zone/Street/Building/Unit), Customer Name, Customer QID, Customer Signature, Date, agent-attribution (DSA/Store/Field Engineer)
- **Lifecycle states:** Blank template -> customer-signed
- **Validation rules:** Required signature and QID before activation; specific FUP/speed/lock-in selections captured via checkbox fields
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Title: "GigaHome Subscription Acceptance Form — GigaHome 5G Plans." Classification marking "C2 General."”

## ENT-065: Kahramaa ID (KID) / Address Record
`Explicit` · confidence: `high`

- **Description:** Kahramaa ID address record returned via lookup, distinct sub-entry describing the same KID concept as ENT-032, used in guided journey fixed-line fulfillment context.
- **Attributes:** Kahramaa ID, PatchingType (Prepatched/Non Prepatched), KIDStatus (Available), ONT device ID, Area, ServiceAvailabilityDate, SLA, FieldPartner, address line/city/state/POBox/zip/country
- **Relationships:** Linked to one or more Service Points/ONT devices; linked to Contact and Sales Order
- **Lifecycle states:** Prepatched vs Non Prepatched drives whether Instant or Normal Activation / Combo Box detection prompt appears
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “KID lookup response for Kahramaa ID `16P6003`: `<PatchingType>Prepatched</PatchingType>`, `<KIDStatus>Available</KIDStatus>`, `<ONT>ALCLF11C1516</ONT>`, `<Area>LAB_GPON_2_AREA1</Area>`, `<ServiceAvailabilityDate>12/15/2019</ServiceAvailabilityDate>`, `<SLA>2</SLA>`, `<FieldPartner>VF_Fieldpartner_1</FieldPartner>`”

## ENT-066: Addon/Discount
`Explicit` · confidence: `high`

- **Description:** Add-on or discount tied to a selected Plan; auto-populated or agent-selectable depending on channel/journey (locked/read-only on cross-sell orders). Includes IPTV add-ons, mass-market add-ons, and paid add-ons/discounts with duration.
- **Attributes:** Addon type (e.g. IPTV Add-on), Discount name/description, price, category (paid add-on vs discount), duration (e.g. '6 Months')
- **Relationships:** Tied to selected Plan; auto-populated or agent-selectable depending on channel/journey (locked/read-only on cross-sell orders); consumes Bill Limit headroom
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “IPTV Add-ons shown: OSN TV Main, OSNTV Premium Pack Free, IPTV Email Id and Mobile No... if there are no applicable add-on or discount,the selector will be empty”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Mass Market Addons list with items and prices: Pakistan QR35 Add On, ... International 50 - checked (QR50.00) ... Paid Add-ons ... Discount”

## ENT-067: Passport-to-QID Update record
`Explicit` · confidence: `high`

- **Description:** Process/record for updating a customer's identification from passport to QID, driven by MSISDN lookup and MOI Validation.
- **Attributes:** MSISDN, Passport Number, QID Number, QID Front/Back images, Identification number change form, e-signature
- **Relationships:** linked to Contact/Account via MSISDN
- **Lifecycle states:** initiated -> ID fetched via MOI Validation -> documents uploaded -> form generated/signed -> attached/finished
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Enter MSISDN & Passport Number then click on Go; Enter the QID Number then click on Update ID”

## ENT-068: Future Dated Order (FDO) request
`Explicit` · confidence: `high`

- **Description:** A request cross-stamped 1:1 with an underlying Order, applying to Pre-to-Post/Post-to-Pre/Plan Change/Disconnection/Add-on-Discount order types, tracked via a custom table and orchestrated by a Bulk Job/Backend Batch process.
- **Attributes:** FDO request ID, cross-stamped order ID, execution date/time slot, status, Job Name, Status (In Processing/Processed/Error), Attrib01-09 fields (MSISDN, promotion, billing profile, source, channel, bill limit, treatment code, job type)
- **Relationships:** linked 1:1 (cross-stamped) to underlying Order; applies to Pre-to-Post/Post-to-Pre/Plan Change/Disconnection/Add-on-Discount order types; orchestrates ChangeMSISDNChannelOrder, ActivationChannelOrder, BILLPROFILE_CREATE_UPDATE, MigrationChannelOrder, FixedPairedActivation/ECRProcessing, ChannelUnpostedPayments, EDR_Dunn_Unbar sub-jobs
- **Lifecycle states:** Initial, In-Progress, Order Submitted, Success, Failed, Cancelled; In Processing, Processed, Error
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “order ID and FDO request ID are cross-stamped in a custom table”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “the submitted job appears as row 1-D8SCUKH, Updated 4/13/2025 02:27:21 PM, Name "97479026346-...", Status In Processing, Attrib01-09 ...”

## ENT-069: Activity (Customer Interaction)
`Explicit` · confidence: `high`

- **Description:** CRM activity record capturing a customer interaction event (e.g. plan migration, ticket resolution), distinct from Trouble Ticket and Order Approval Activity though structurally similar.
- **Attributes:** Activity #, Language, Channel, Comments, Status, Transaction Date, Customer Segment, Customer Type, Area, Journey, MSISDN, Topic, Resolution Code, Type, Sub-Topic, Interaction Type, Agent ID
- **Relationships:** linked to Account, Order, Agent
- **Lifecycle states:** Solved
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Activity # 1-D8SCUKS, Language English, Channel Appointment, Comments UNICA PRE TO POST TEST, Status Solved ... Area Migration to Po... Journey Start-up, MSISDN# 97479026346, Topic Automated Gui...”

## ENT-070: SIM Swap Order / Task
`Explicit` · confidence: `high`

- **Description:** Order/task for swapping a customer's SIM, requiring SIM serial number, reason, attached form, and routed through Order Approval Queue.
- **Attributes:** SIM Serial Number, SIM Swap Reason, attached SIM Swap Form, comments
- **Relationships:** linked to MSISDN/Installed Asset; routed through Order Approval Queue
- **Lifecycle states:** Created, Pending Approval, Assigned, Approved/Completed, Rejected/Dropped
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter SIM Serial Number, select SIM Swap Reason, click Submit -> Attach SIM Swap Form, click Continue -> Order goes to Approval”

## ENT-071: IMS Site/ZSB (Zone-Street-Building)
`Explicit` · confidence: `high`

- **Description:** Holds site/zone-street-building (ZSB) data, BIDs, CTPs (cable termination points, sub-sites), splitters/ports. Physical chain: OLT → splitter → telecom room → each KID/unit; one GTM building entry can map to many BIDs/CTPs/KIDs.
- **Attributes:** BID, CTP, splitter/port, business-added consumer/enterprise potential/forecast
- **Relationships:** Physical chain: OLT → splitter → telecom room → each KID/unit; one GTM building entry can map to many BIDs/CTPs/KIDs
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full re-extraction surfaces additional structural/lifecycle detail: IMS is explicitly the master/inventory system for physical connectivity (not directly system-integrated to UIM -- data moves via files through fulfillment), the network team owns and manages IMS exclusively (does not touch UIM), sales/business team adds potential and forecast data into IMS, and the specific compound-mapping edge case (one GTM building entry to many BIDs/CTPs/KIDs) is named as 'Adhan 27'.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full re-extraction surfaces additional structural/lifecycle detail: IMS is explicitly the master/inventory system for physical connectivity (not directly system-integrated to UIM -- data moves via files through fulfillment), the network team owns and manages IMS exclusively (does not touch UIM), sales/business team adds potential and forecast data into IMS, and the specific compound-mapping edge case (one GTM building entry to many BIDs/CTPs/KIDs) is named as 'Adhan 27'.
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “holds site/zone-street-building (ZSB) data, BIDs, CTPs (cable termination points, sub-sites), splitters/ports”

## ENT-072: RFS (Ready For Sale) Record / Status
`Explicit` · confidence: `high`

- **Description:** Shows RFS status, potentials, SLA/cluster (renamed from 1-4 to F1-F4). Top-level data from IMS via GTM file; live active-service/KID status from UIM with reverse sync back to IMS.
- **Attributes:** RFS status, potentials, SLA/cluster (F1-F4)
- **Relationships:** top-level data from IMS via GTM file; live active-service/KID status from UIM with reverse sync back to IMS
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full re-extraction surfaces the specific data-sourcing/lifecycle split for RFS status that was compressed in the summary: top-level RFS/potential/SLA fields come from IMS via the GTM file (batch, uncertain current frequency -- designed fortnightly, believed now daily/bi-weekly), while live active-service/KID status comes from UIM in real time with a reverse sync back to IMS -- i.e., this is a composite/derived record, not a single-system stateful entity with its own lifecycle states.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Full re-extraction surfaces the specific data-sourcing/lifecycle split for RFS status that was compressed in the summary: top-level RFS/potential/SLA fields come from IMS via the GTM file (batch, uncertain current frequency -- designed fortnightly, believed now daily/bi-weekly), while live active-service/KID status comes from UIM in real time with a reverse sync back to IMS -- i.e., this is a composite/derived record, not a single-system stateful entity with its own lifecycle states.
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “shows RFS status, potentials, SLA/cluster (renamed from 1-4 to F1-F4)”

## ENT-073: SMS Template
`Explicit` · confidence: `high`

- **Description:** Template used for automatic or lead-driven SMS communication, keyed by TT source/category/area/sub area/status or Service Needed, with multi-language script support.
- **Attributes:** Keyword, Language, Language Code, Locale, Script (English/Arabic/Hindi/Malayalam), Template Type, System Template Flag, Created/Updated Date/By, Description, merge fields
- **Relationships:** Automatic templates linked to TT Source/Category/Area/Sub Area/Status; Lead templates linked to Service Needed
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Direct inspection of the underlying SMS Templates.xlsx workbook (beyond what the summary compressed) shows a genuine two-value lifecycle for this entity: Status = 'Active' (all rows in Automatic/Lead/Other sheets) or 'Draft' (67 of 1,236 rows in the Manual SMS Templates sheet, e.g. ' White Friday QND' / Prepaid / multiple languages, created 2023-11-22, still Draft as of last-updated 2025-12-15). Combined with the 'Do not send SMS' Y/N flag (a per-row suppression control independent of Status) and the 'System Template Flag' = Y marking protected/system-owned templates, this gives a concrete lifecycle/validation shape: Draft (authored, not yet live) -> Active (live, sendable) with a separate suppression flag, and a protected-template flag preventing edits by non-system owners.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Direct inspection of the underlying SMS Templates.xlsx workbook (beyond what the summary compressed) shows a genuine two-value lifecycle for this entity: Status = 'Active' (all rows in Automatic/Lead/Other sheets) or 'Draft' (67 of 1,236 rows in the Manual SMS Templates sheet, e.g. ' White Friday QND' / Prepaid / multiple languages, created 2023-11-22, still Draft as of last-updated 2025-12-15). Combined with the 'Do not send SMS' Y/N flag (a per-row suppression control independent of Status) and the 'System Template Flag' = Y marking protected/system-owned templates, this gives a concrete lifecycle/validation shape: Draft (authored, not yet live) -> Active (live, sendable) with a separate suppression flag, and a protected-template flag preventing edits by non-system owners.
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “columns: Keyword | TT Source | TT Category | TT Area | TT Sub Area | TT Status | Do not send SMS | Language | Status | ... Script”

## ENT-074: APN (Access Point Name)
`Explicit` · confidence: `high`

- **Description:** Access Point Name entity validated for Static IP, Domain Hosting, and Broadband Service Link association, with account-level uniqueness.
- **Attributes:** Static IP, Domain Hosting, Broadband Service Link association; account-level uniqueness
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Direct inspection of the underlying Order Validation Business Rules.xlsx workbook (beyond the single-line 'APN validation' mention in the summary) surfaces 6 explicit APN business rules with rule IDs, exact error messages, and a lifecycle-adjacent ordering constraint: ORD_VALD_RULE_064 (APN ID & APN Name mandatory for APN service line items), ORD_VALD_RULE_065 (Static IP cannot be blank for APN Static IP Address product), ORD_VALD_RULE_066 (APN Id mandatory for Account Level APN), ORD_VALD_RULE_067 (APN Name mandatory for Account Level APN), ORD_VALD_RULE_068 (APN ID value must be unique - the account-level uniqueness rule cited originally, now with its exact rule ID and error message), and ORD_VALD_RULE_069 (all services provisioned on an APN must be disconnected before the APN itself can be disconnected - an explicit lifecycle/sequencing rule: Active-with-dependent-services -> [block] -> must disconnect dependents first -> Disconnected). All 6 share Step='APN Validation', Type='BS', Business Service='VFQA Generic Validation BS for All', Method='Process'.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Direct inspection of the underlying Order Validation Business Rules.xlsx workbook (beyond the single-line 'APN validation' mention in the summary) surfaces 6 explicit APN business rules with rule IDs, exact error messages, and a lifecycle-adjacent ordering constraint: ORD_VALD_RULE_064 (APN ID & APN Name mandatory for APN service line items), ORD_VALD_RULE_065 (Static IP cannot be blank for APN Static IP Address product), ORD_VALD_RULE_066 (APN Id mandatory for Account Level APN), ORD_VALD_RULE_067 (APN Name mandatory for Account Level APN), ORD_VALD_RULE_068 (APN ID value must be unique - the account-level uniqueness rule cited originally, now with its exact rule ID and error message), and ORD_VALD_RULE_069 (all services provisioned on an APN must be disconnected before the APN itself can be disconnected - an explicit lifecycle/sequencing rule: Active-with-dependent-services -> [block] -> must disconnect dependents first -> Disconnected). All 6 share Step='APN Validation', Type='BS', Business Service='VFQA Generic Validation BS for All', Method='Process'.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “APN validation (Static IP, Domain Hosting, Broadband Service Link, Account-level APN uniqueness)”

## ENT-075: Deposit Service Bundle
`Explicit` · confidence: `high`

- **Description:** Deposit service bundle with a one-per-account constraint; cannot be the first service on an account nor combined with TON.
- **Attributes:** one per account constraint
- **Validation rules:** cannot be first service on account; cannot be combined with TON
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Deposit Service Bundle rules (one per account, cannot be first service, cannot TON)”

## ENT-076: Data Field (Annex data catalogue)
`Explicit` · confidence: `high`

- **Description:** Fibre BRSD annex data catalogue of 135 rows with DF-xx identifiers and field-level metadata.
- **Attributes:** DF-xx identifiers, field-level metadata
- **Cardinality:** 135 rows
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Annex_01_Data_Fields (135 rows, DF-xx)”

## ENT-077: Status Model (Order/Asset lifecycle states)
`Explicit` · confidence: `medium`

- **Description:** Fibre BRSD annex describing 33 rows of lifecycle status definitions for orders/assets.
- **Attributes:** lifecycle status definitions
- **Cardinality:** 33 rows
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Annex_02_Status_Model (33 rows) actually models FOUR distinct object lifecycles, not just a generic 'order/asset' status list as the summary implies: (1) Order: Draft -> Pending Payment -> Submitted -> In Fulfilment -> Awaiting Workforce -> Activated -> Completed, with Failed/Cancelled branches, each row carrying a Trigger and Permitted Next Status; (2) Tracking Record: New -> In Progress -> Resolved -> Closed, with Cancelled branch; (3) Portability Ticket: Created -> Validating -> Conditionally Accepted/Accepted/Rejected/Suspended -> Termination Order Generated; (4) Termination Request: Created -> Under Retention -> Retained/Validated for Termination/Validation Failed -> Termination Order Submitted -> In Deactivation -> Completed/Failed/Cancelled. Each of the 33 rows has Object | Status | Description | Trigger | Permitted Next Status columns, giving genuine validated state-machine detail (not just a flat list of status labels) directly relevant to UJ-099/100/101 above.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Annex_02_Status_Model (33 rows) actually models FOUR distinct object lifecycles, not just a generic 'order/asset' status list as the summary implies: (1) Order: Draft -> Pending Payment -> Submitted -> In Fulfilment -> Awaiting Workforce -> Activated -> Completed, with Failed/Cancelled branches, each row carrying a Trigger and Permitted Next Status; (2) Tracking Record: New -> In Progress -> Resolved -> Closed, with Cancelled branch; (3) Portability Ticket: Created -> Validating -> Conditionally Accepted/Accepted/Rejected/Suspended -> Termination Order Generated; (4) Termination Request: Created -> Under Retention -> Retained/Validated for Termination/Validation Failed -> Termination Order Submitted -> In Deactivation -> Completed/Failed/Cancelled. Each of the 33 rows has Object | Status | Description | Trigger | Permitted Next Status columns, giving genuine validated state-machine detail (not just a flat list of status labels) directly relevant to UJ-099/100/101 above.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Annex_02_Status_Model (33 rows)”

## ENT-078: IPTV / STB (Set-Top Box) bundle
`Explicit` · confidence: `high`

- **Description:** IPTV bundled by default with base plan in fibre BRSD, removable — flagged in Open Items as contested.
- **Attributes:** bundled-by-default flag, removability
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Confirmed the exact Open Item and requirement pairing behind the IPTV/STB contested-default flag: Open Item OI-03 (Decision Required, Product Catalogue and Cart owner=VFQ Business, Priority=High, Status=Open): 'Confirm whether the agent may remove the internet protocol television bundle during activation, since the requirement permits it while the VFQ response records that this is not preferred by business' (Note: 'Requirement text and VFQ response are in tension'). The underlying requirement pair is FAR_001_QPC_02 'IPTV default bundling' - 'The system shall bundle the internet protocol television offering by default with the base plan and shall display all child plans associated with the internet protocol television bundle in the cart' - and FAR_001_QPC_03 'IPTV removal option' - 'The system shall allow the Retail Agent to remove the internet protocol television offering from the cart at the customer request.' This gives the precise requirement IDs, full requirement text, and governance status behind the previously vague 'contested' note.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Confirmed the exact Open Item and requirement pairing behind the IPTV/STB contested-default flag: Open Item OI-03 (Decision Required, Product Catalogue and Cart owner=VFQ Business, Priority=High, Status=Open): 'Confirm whether the agent may remove the internet protocol television bundle during activation, since the requirement permits it while the VFQ response records that this is not preferred by business' (Note: 'Requirement text and VFQ response are in tension'). The underlying requirement pair is FAR_001_QPC_02 'IPTV default bundling' - 'The system shall bundle the internet protocol television offering by default with the base plan and shall display all child plans associated with the internet protocol television bundle in the cart' - and FAR_001_QPC_03 'IPTV removal option' - 'The system shall allow the Retail Agent to remove the internet protocol television offering from the cart at the customer request.' This gives the precise requirement IDs, full requirement text, and governance status behind the previously vague 'contested' note.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “FAR_001_QPC_02/03 (IPTV bundled by default with base plan, removable — flagged in Open Items as contested)”

## ENT-079: QTicket
`Explicit` · confidence: `medium`

- **Description:** A ticket generated at the start of the J011 Mobile Post-Paid Customer onboarding journey when the customer is engaged in QNomy, feeding into the Agent-in-DXP onboarding flow.
- **Relationships:** Generated in QNomy; feeds into the Agent-in-DXP onboarding flow.
- **Lifecycle states:** Generated at start of onboarding journey.
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “QTicket generation”

## ENT-080: Payment
`Explicit` · confidence: `medium`

- **Description:** Payment captured during onboarding (Full Payment vs DOI, via WinCash with receipt), during suspension/resume (via WinCash), and covering deposit/HRN advance/premium number charge. All payments must be Authorized before order proceeds.
- **Attributes:** Method/branch: Full Payment vs DOI; captured via WinCash; produces a receipt; deposit, HRN advance, premium number charge
- **Relationships:** Tied to CAF checkout/submission (J011); tied to suspension order (J023) and resume order (J024)
- **Lifecycle states:** Captured -> receipted
- **Validation rules:** Suspension order requires cleared unbilled balance before submission; All Payments should be Authorized (ORD_VALD_RULE_030)
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment capture via WinCash with receipt”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “payment upfront via WinCash covering deposit, HRN advance, premium number charge”

## ENT-081: Identity Document (QID / Other ID / Passport)
`Explicit` · confidence: `medium`

- **Description:** Identity document type captured and validated during onboarding, driving downstream validation and plan-display logic (QID -> MOI Validation path; Other ID/Passport -> capture/validate details path).
- **Attributes:** Type: QID vs Other ID/Passport
- **Relationships:** QID → MOI Validation path; Other ID/Passport → capture/validate details path; ID scan step later in flow
- **Lifecycle states:** Captured -> validated -> scanned
- **Validation rules:** ID type branching determines validation method used
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID type branching (QID → MOI Validation; Other ID/Passport → capture/validate details) ... ID scan”

## ENT-082: Customer 360 (aggregated data view)
`Explicit` · confidence: `medium`

- **Description:** An aggregated view/entity combining multiple data sources for a customer, retrieved on search in J017 by Customer No / Contact No / MSISDN, sectioned as Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk.
- **Attributes:** CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Ticket History, Order History
- **Relationships:** Aggregates Customer, Order, Ticket, Billing, Payment, Network status data; sectioned in UI as Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk
- **Validation rules:** Search performed by Customer No / Contact No / MSISDN
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “aggregate customer data across: CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Fetch Ticket History, Fetch Order History”

## ENT-083: Application Form Types (Enterprise/SME-SOHO)
`Explicit` · confidence: `high`

- **Description:** Distinct enterprise sales application form entities: Postpaid Mobile, Plan Builder Mobile, Credit Limit, MNP, Postpaid Fixed, FNP, Fixed Supplementary; Large Sales forms include Master Service Agreement or custom contract with product-specific schedules (T&C). Used within Enterprise Forms section, distinct from Consumer Forms.
- **Attributes:** Types: Postpaid Mobile, Plan Builder Mobile, Credit Limit, MNP, Postpaid Fixed, FNP, Fixed Supplementary; Large Sales forms include Master Service Agreement or custom contract with product-specific schedules (T&C)
- **Relationships:** Used within Enterprise Forms section, distinct from Consumer Forms
- **Lifecycle states:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Slide 11's seven form-type icons are not decorative icons but embedded images of the actual scanned/fillable enterprise form templates, each with a distinct, concrete field list -- confirming ENT-083 is not just a catalog of names but a set of entities each with recoverable field-level structure. Spot-checked three of the seven: 'Postpaid Mobile' form (image40.png) has fields Company Name, CR No., Industry Sector, No. of employees, Zone/Street/Building/Unit/Floor/Address Landmark/Heritage ID/Geo-Coordinates, Trade Name (EN/AR), Commercial Name (AR)/CR-Registration License, Primary Contact Person Details (Full Name, Position, Contact Number, E-mail, Passport/Qatari ID Number, Company Self-Service Portal Access), a repeatable 'Choosers' block, Payment Contact Person Details, Bill and Payment Details (Bill Type: Paper/E-Bill, Additional paper bill copies, E-mail for E-Bill, Bill Language: English/Arabic), and Credit Limit (Amount of Credit Limit QAR). A different icon (image44.png) is actually the 'Number or Account Transfer form' with Current Customer and New Customer sections (Name, Passport/QID number, Address/PO Box, CR number, Commercial Registry number, Alternative number, Date of Birth) plus Terms & Conditions and Signature/Date fields -- demonstrating the seven 'form type' tiles on this slide are each a genuine distinct entity with its own field schema, not a flat undifferentiated list.
- **Validation rules:** [Recovered by Stage K re-mining of original source documents (see gap-resolution-stage-k.md)] Slide 11's seven form-type icons are not decorative icons but embedded images of the actual scanned/fillable enterprise form templates, each with a distinct, concrete field list -- confirming ENT-083 is not just a catalog of names but a set of entities each with recoverable field-level structure. Spot-checked three of the seven: 'Postpaid Mobile' form (image40.png) has fields Company Name, CR No., Industry Sector, No. of employees, Zone/Street/Building/Unit/Floor/Address Landmark/Heritage ID/Geo-Coordinates, Trade Name (EN/AR), Commercial Name (AR)/CR-Registration License, Primary Contact Person Details (Full Name, Position, Contact Number, E-mail, Passport/Qatari ID Number, Company Self-Service Portal Access), a repeatable 'Choosers' block, Payment Contact Person Details, Bill and Payment Details (Bill Type: Paper/E-Bill, Additional paper bill copies, E-mail for E-Bill, Bill Language: English/Arabic), and Credit Limit (Amount of Credit Limit QAR). A different icon (image44.png) is actually the 'Number or Account Transfer form' with Current Customer and New Customer sections (Name, Passport/QID number, Address/PO Box, CR number, Commercial Registry number, Alternative number, Date of Birth) plus Terms & Conditions and Signature/Date fields -- demonstrating the seven 'form type' tiles on this slide are each a genuine distinct entity with its own field schema, not a flat undifferentiated list.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “SME/SOHO Sales Application Forms" — lists form types: Postpaid Mobile, Plan Builder Mobile, Credit Limit, MNP, Postpaid Fixed, FNP, Fixed Supplementary”

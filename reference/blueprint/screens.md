# Screen Inventory (Phase 11)

Screens/pages/modals/drawers/wizards/dashboards/popups evidenced in guided-journey screenshots, workshop walkthroughs, and process-overview decks.

**Canonical items:** 213 (deduplicated from 290 raw extracted mentions across the 83-document corpus)

**Confidence:** high 200 · medium 10 · low 3
**Classification:** Explicit 213 · Inferred 0 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## Screens by type

| Type | Count |
|---|---|
| Screen | 93 |
| Wizard | 58 |
| Modal | 32 |
| Page | 13 |
| Dashboard | 11 |
| Popup | 6 |

---

## Screens

### SCR-006: Unbilled Usage Screen
`Explicit` · confidence: `high`

- **Purpose:** View current unbilled usage; cannot serve large enterprise accounts (suppressed via exception list because it hangs the system)
- **Inputs:** MSISDN (mandatory), date range within current cycle (mandatory)
- **Outputs:** unbilled usage listing
- **Dependencies:** Suppressed for large enterprise accounts via exception list
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range”

### SCR-007: Account Creation Screen
`Explicit` · confidence: `high`

- **Purpose:** Create an enterprise account with name, CR details, agent ID, business type, credit limit
- **Persona access:** Fulfilment Agent
- **Inputs:** name, CR type/ID type, CR number, agent ID, business type, credit limit
- **Outputs:** created account record
- **Dependencies:** Mandatory CR-number search precondition; business finance approval for credit limit
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit”

### SCR-011: MS Dynamics Discount Approval Hierarchy Screen
`Explicit` · confidence: `high`

- **Purpose:** Approve enterprise discount requests through the EBU hierarchy
- **Persona access:** Account Manager, EBU hierarchy approvers
- **Inputs:** discount request
- **Outputs:** approved/rejected discount
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “discount approval in MS Dynamics via the EBU hierarchy”

### SCR-016: Siebel Excel Export (Uncontrolled)
`Explicit` · confidence: `high`

- **Purpose:** Export data from any Siebel tab to Excel for plan/promotion analysis
- **Persona access:** All Siebel users (uncontrolled today)
- **Inputs:** current tab data
- **Outputs:** Excel export file
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “an Excel export feature is available, uncontrolled, on all tabs and heavily used for plan/promotion analysis”

### SCR-017: Siebel Order Creation Screen (MNP)
`Explicit` · confidence: `high`

- **Purpose:** Create and validate an MNP port-in order
- **Persona access:** Fulfilment Agent
- **Inputs:** plan, MNP category, porting details, reserved temp MSISDN, attachments
- **Outputs:** created Siebel order
- **Dependencies:** NPAS integration to donor operator
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details”

### SCR-019: CAF (Customer Application Form) tablet signature view
`Explicit` · confidence: `high`

- **Purpose:** Customer signature capture, shifting between laptop and tablet views
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF will display on tablet for customer signature only, with view shifting laptop→tablet→laptop”

### SCR-020: In-progress journeys list (agent login page)
`Explicit` · confidence: `high`

- **Purpose:** Allow agent to resume incomplete journeys via internal milestones
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “an 'in-progress journeys' list will appear on the agent login page”

### SCR-022: Agent 360 / Asset summary
`Explicit` · confidence: `high`

- **Purpose:** Agent view of asset summary and notifications, part of improvement wish list for to-be design
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Agent 360/asset summary, notifications, and an improvement wish list for the to-be design”

### SCR-024: Number Management Portal
`Explicit` · confidence: `high`

- **Purpose:** Number search/reservation for fixed/mobile numbers; confirmed in scope for the new solution, search experience needs to be defined
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “confirmed the number management portal IS in scope for the new solution and its search experience needs to be defined”

### SCR-025: Device Installment Portal
`Explicit` · confidence: `high`

- **Purpose:** Eligibility check, stock reservation, signature, and payment for Device on Installment (DOI); current retail process uses 'big data' logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “current retail process (portal eligibility via 'big data' logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order)”

### SCR-026: DXP Product Catalog (target state)
`Explicit` · confidence: `high`

- **Purpose:** Product/installment selection within DXP for DOI, with identity validation and DOI validation (via EDW), installment breakdown
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Target DXP flow agreed: identity validation and DOI validation (via EDW) in DXP, product catalog in DXP, installment breakdown”

### SCR-028: Appointment booking / calendar selection screen
`Explicit` · confidence: `high`

- **Purpose:** Book installation appointment with pre-selected next available date/slot, bounded by location's SLA cluster
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “appointment step to be enhanced to pre-select the next available date/slot..., calendar selection bounded by the location's SLA cluster”

### SCR-029: Ticket detail screen (public notes / bell icon notifications)
`Explicit` · confidence: `high`

- **Purpose:** Displays ticket public notes and notification bell icon; requirement to make public notes as prominent as the bell icon since agents currently miss them
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “make public notes as prominent as the bell icon (agents currently miss them)”

### SCR-030: Usage/balance view (agent)
`Explicit` · confidence: `medium`

- **Purpose:** Agent view of customer usage/balance, proposed to add My Account app access indicator
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “requirement raised to surface this on the agent's usage/balance view”

### SCR-032: CAP Signature Screen
`Explicit` · confidence: `high`

- **Purpose:** Capture customer signature acceptance step in activation flow; appointment-booking step auto-skipped when going here
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “appointment-booking step is auto-skipped and flow goes straight to CAP signature”

### SCR-033: ZSP Entry Screen
`Explicit` · confidence: `high`

- **Purpose:** Capture ZSP (zone/street/property) plus email/address for FWA activation; ZSP entry mandatory but email/address fields validated for presence only, not format
- **Inputs:** email, address fields (validated for presence only)
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “ZSP entry mandatory but email/address fields are validated for presence only, not format”

### SCR-034: Address / Service Point Search Screen (KID lookup)
`Explicit` · confidence: `high`

- **Purpose:** Search for Karama ID (KID) to determine RFS status; diverts to FWA journey if not found; agents can only search, never manually enter a KID
- **Inputs:** KID or ZSB search term
- **Outputs:** RFS determination or diversion to FWA journey
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey”

### SCR-036: Checkout Screen (Retail New Postpaid)
`Explicit` · confidence: `high`

- **Purpose:** Checkout step of new postpaid connection journey, flagged for rework
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “Gagan and Sanjeev (change eligibility wording, rework checkout screen)”

### SCR-038: Consumer Postpaid CAF (PCA001) Form
`Explicit` · confidence: `high`

- **Purpose:** Capture applicant details, billing info, postpaid plan selection, and Superfast Broadband/Home Phone plan selection with signature
- **Inputs:** Name, DOB, QID, nationality, email, address, billing method, plan selection, signature
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Form ID: PCA001...Structure (2 pages): Page 1 = the fillable form (Sections 1–4)”

### SCR-039: Consumer Prepaid CAF (PCA001) Form
`Explicit` · confidence: `high`

- **Purpose:** Capture mobile number, SIM serial, registration type, applicant identity, and T&Cs acceptance for prepaid registration
- **Inputs:** Application date, Store/Retailer ID, mobile number, SIM serial, registration type, full name, ID number/expiry, signature
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Form ID: PCA001...Top fields: Application date*, Store/Retailer ID...”

### SCR-040: CRM Open UI Desktop Home Page
`Explicit` · confidence: `high`

- **Purpose:** Landing/navigation hub with module tiles
- **Inputs:** Tile click
- **Outputs:** Navigation to selected module
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Open UI Desktop home screen; a Cross Sales module tile (new icon) is highlighted among the standard tile set (Assets, Contacts, Accounts, New Fixed Line, New FWA, etc.)”

### SCR-041: Cross Sales — Contact/QID entry
`Explicit` · confidence: `high`

- **Purpose:** Look up customer by QID for cross-sell
- **Inputs:** Qatari ID
- **Outputs:** Contact confirmation + Connection Details popup
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"Please insert or scan the customer's Qatari Id:" field accepts Qatari ID 28335628851; Go / Search again / Cancel”

### SCR-042: QID Offers grid
`Explicit` · confidence: `high`

- **Purpose:** Display targeted campaign offers for the looked-up customer
- **Outputs:** Accept redirects into New Fixed Line journey
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a single targeted campaign offer: CampaignCode 000001247, OfferName "New Gigahome Testahil plan", PromotionId 1-5XBWM5D, OfferType: New Fiber, Price 0, MonthlyRental 299, Status Offered. Agent clicks Accept.”

### SCR-051: Account Orders view (Account 360)
`Explicit` · confidence: `high`

- **Purpose:** Show account profile and order history
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Navigates to "Account Orders: Vishakan Soun[dararajan]" (Account 360 View). Account fields: Account Name..., Account #...”

### SCR-052: Sales Order detail — header and Line Items tab
`Explicit` · confidence: `high`

- **Purpose:** View/manage order header fields and hierarchical line items
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “toolbar actions Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order, ReSubmit... Sub-tabs: Catalog, Numbers, Line Items (active), Payments, Trouble Tickets, Attachments”

### SCR-053: Siebel Web Call Center Home page (tile grid)
`Explicit` · confidence: `high`

- **Purpose:** Main navigation hub listing all accessible modules for the logged-in responsibility
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Full navigation tile grid includes Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Action Required, Activities, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval”

### SCR-054: All Person Administration screen
`Explicit` · confidence: `high`

- **Purpose:** Administer user records and responsibilities; confirms operating user identity and Responsibility assignment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Persons list search by User ID "Hemanth"; record for Last Name "Kumar"... Detail form shows Job Title "Team Leader"”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “All Person Administration screen (image1.png). Confirms the operating user: Last Name "Kumar", First Name "Hemanth"...”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Administration–User "All Person Administration" view confirms operator Hemanth Kumar (User ID HEMANTH, Job Title Team Leader) is provisioned under Responsibility VFQA Sales”

### SCR-059: My Sales Orders / My Pending Approval Orders queue
`Explicit` · confidence: `high`

- **Purpose:** Agent view of own submitted orders and their approval status
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Filter "My Pending Approval Orders" lists Order # 1-29795175561, YAM POKHAREL, Approval Status "Submitted for Approval"”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Navigated to "My Sales Orders" (Sales Order module). Single row: Order # 1-29792357564...”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Under 'My Pending Approval Orders' view, order 1-29795149137 shows Approval Status 'Submitted for Approval', Status 'Pending'"”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “grid filtered to 'My Pending Approval Orders' shows Order # 1-29710853118... Approval Status 'Submitted for Approval'”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'My Sales Orders' grid shows the new order 1-29726606734 for YAM POKHAREL... Status: Open in the grid”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Navigated to 'My Sales Orders' list (breadcrumb 'You are here: Order:')”

### SCR-061: Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs)
`Explicit` · confidence: `high`

- **Purpose:** Manager reviews order attachments and details before approving/rejecting
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Header shows Contact YAM POKHAREL, Contact Id..., Order # 1-29795175561... Tabs: Attachments (active), Order Details, Activities, Agents Details”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Header shows Contact YAM POKHAREL, Contact Id 27652419981, Order # 1-29795149137... Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back. Tabs: Attachments, Order Details, Activities, Agents Details."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Tabs: Attachments, Order Details, Activities, Agents Details.”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “header shows Contact..., Order #..., Order Expiry... Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back. Four tabs: Attachments, Order Details, Activities, Agents Details”

### SCR-065: Oracle Enterprise Manager / Service Bus Message Detail screen
`Explicit` · confidence: `high`

- **Purpose:** Backend admin view of integration/notification message traces (system-of-record verification, not an end-user CRM screen)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Oracle Enterprise Manager (Fusion Middleware Control 12c) > service-bus > Message Reports for inbound service PS_VFQA_Communication”

### SCR-066: GigaHome Subscription Acceptance Form (bilingual paper/PDF form)
`Explicit` · confidence: `high`

- **Purpose:** Customer-signed disclosure/acceptance document for GigaHome 5G Home plans
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “2 pages — page 1 English, page 2 the Arabic mirror of the same 18 numbered clauses; each page ends with a "Confirmed by" signature block”

### SCR-071: Backend Sales Order Record (Siebel Order Entry)
`Explicit` · confidence: `high`

- **Purpose:** Deeper admin/back-office view of the order with tabs for Line Items and status
- **Persona access:** Back office/admin
- **Inputs:** none (view/edit by back office)
- **Outputs:** Order Type, Status, Fulfillment Status, RFS Status, Credit Limit fields
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “multiple browser tabs visible: Line Items, Oracle Service Bus, Sprint tracker, API Gateway, Inventory Management, Password Vault — an internal admin/support tooling context”

### SCR-072: Line Items Tab (Order)
`Explicit` · confidence: `high`

- **Purpose:** Shows hierarchical order line items and their attributes (device serials, types)
- **Persona access:** Back office/admin
- **Inputs:** none (attribute values populate from order/device)
- **Outputs:** CPE/ONT device attribute confirmation; completion/fulfillment status
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Line Items" tab of the order: hierarchy showing 1. GigaHome 5Gbps Promotion, 2. Broadband Internet Service...3. CPE Bundle”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Three line items all with Status Complete / Fulfillment Status Complete, Status Context "FULFILL BILLING COMPLETE: reached" (from Sales Order — Line Items Tab, Without Approval variant)”

### SCR-073: Account Summary (Installed Assets and Orders)
`Explicit` · confidence: `high`

- **Purpose:** Shows account-level installed assets, order history, and billing profiles
- **Persona access:** Back office/agent
- **Inputs:** none
- **Outputs:** list of active assets, orders (including abandoned), billing profiles
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Accounts" module, Account Summary tab for MUSTAFA GULEC... "Installed Assets" grid lists 8 active assets”

### SCR-077: New FWA Tile / Home Screen
`Explicit` · confidence: `high`

- **Purpose:** Landing screen with app tile grid, entry point for launching the New FWA guided journey
- **Inputs:** tile click
- **Outputs:** navigates to Contact step
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Logged in as KARTHIKK KARTHIKK... Agent clicks the New FWA tile.”

### SCR-086: Line Items > Appointments Sub-tab
`Explicit` · confidence: `high`

- **Purpose:** View order line items and their status/fulfillment milestones
- **Inputs:** none (view)
- **Outputs:** line item statuses
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Line Items > Appointments sub-tab (images 27–28): 10 line items (1-10 of 10)...”

### SCR-087: VFQ Inventory Loading Excel Tool
`Explicit` · confidence: `high`

- **Purpose:** Load CPE/SIM inventory into a technician resource pool
- **Inputs:** Inventory Type, serial, model
- **Outputs:** Import result to OFSC
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Excel "VFQ Inventory Loading" (image 29): Inventory Type column... "Import" button.”

### SCR-090: Inventory Management — Non-Serialized Inventory Transfer
`Explicit` · confidence: `high`

- **Purpose:** Transfer CPE/SIM inventory items from warehouse team to technician
- **Persona access:** Dispatcher/Back-Office WFM user
- **Inputs:** Part search, Add To Transfer List
- **Outputs:** Transfer List, transfer completion report
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Inventory Management' > 'Non-Serialized Inventory Transfer' tab, 'Transfering From: ABATS'... Start Transfer"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Transfering From: ABATS" to resource Syed Irfan, three parts transferred one at a time”

### SCR-092: OFS Activity Details / Start-End Activity
`Explicit` · confidence: `high`

- **Purpose:** Technician's per-activity work screen: Assess Activity, Serial Number Check, Installation Checklist, End Activity, with timer and device details
- **Persona access:** Field Technician
- **Inputs:** geolocation, serial numbers, checklist fields, signature, start/end actions
- **Outputs:** activity status transitions, service activation result
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Activity details for 'Consumer Installation, 09/07/25'. Banner: 'You Need to Complete Assess Activity, Checklist & Mandatory Fields...'"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Activity details — on-site (image 44): Timer running (2:00). Activity ID 120955...”

### SCR-093: Serial Number Check Screen (Dual Play)
`Explicit` · confidence: `high`

- **Purpose:** Technician scans/enters CPE and SIM serials to trigger service activation
- **Persona access:** Field Technician
- **Inputs:** CPE Indoor, CPE Outdoor, SIM Card serials
- **Outputs:** Service activation request submitted
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Serial Number Check - Dual Play' screen with barcode-scan fields: CPE Indoor... CPE Outdoor... SIM Card... Submit button."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Fields (with barcode-scan icons): CPE Indoor 2EQTE24314000127, CPE Outdoor S180P18075127, SIM Card 8942702800801190325.”

### SCR-094: Installation Checklist Screen
`Explicit` · confidence: `high`

- **Purpose:** Capture installation QA fields, attachments, customer briefing checklist, and signature
- **Persona access:** Field Technician
- **Inputs:** speed test results, Wi-Fi username, timestamps, checkboxes, attachments, signature
- **Outputs:** submitted checklist, Forms Submitted indicator
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Installation Checklist' form (top-right 'Forms Submitted' indicator). Fields captured: 'Speed test results on Wi-Fi and LAN' = Test..."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Fields captured: "Speed test results on Wi-Fi and LAN" = Test; "Wi-Fi User name's for 2.5G and 5G network (NO password)" = Vishak...”

### SCR-095: Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View
`Explicit` · confidence: `high`

- **Purpose:** Confirms live billing/data bucket state, usage and balances post-activation or for account review
- **Persona access:** Back office/agent
- **Inputs:** none / MSISDN selection
- **Outputs:** SIM State, balance, data bucket remaining/expiry
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Customer Portal > Billing Profile for VFQMAV FWA_OD_TEST2, Bucket View / Surepay View. MSISDN 97441202322, SIM State ACTIVE."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “MSISDN 97441202325. Primary Balance: TotalBalance 0, SIMState ACTIVE, Language EN, Currency QAR.”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Unbilled Usage — Surepay Bucket Details (image45)... Primary Balance: TotalBalance 0, SIMState ACTIVE”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Agent checks Unbilled Usage > Surepay View > Bucket View for the account, MSISDN list...Surepay Bucket Details grid (8 buckets)”

### SCR-096: Installed Assets Grid (Account 360, FWA)
`Explicit` · confidence: `high`

- **Purpose:** Lists active installed assets on an account with Modify/Disconnect/etc actions
- **Inputs:** asset row selection
- **Outputs:** navigation to asset modify screen
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Installed Assets" grid (1-3 of 3) lists: FMS CPE Bundle... Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP.”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Products and Services" grid, 8→9 rows, all Active: FMS CPE Bundle (1-29727986024)...”

### SCR-097: FMS CPE Bundle Configuration / Modify Screen (Equipment tab)
`Explicit` · confidence: `high`

- **Purpose:** Select CPE equipment sub-type and fill/edit device details (serial number, model, MAC address, IPTV Service Id, VoIP Number)
- **Inputs:** Indoor Unit Serial Number, IPTV Service Id, CPE Model, MAC Address, VoIP Number
- **Outputs:** configured/modified CPE line item; Modification-type Sales Order generated
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"agent selects equipment sub-type FMS CPE Indoor IDU... fills Indoor Unit Serial Number"”
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"'FMS CPE Bundle modify screen — Equipment tab'... Drilling into 'FMS CPE Indoor IDU'... opens its own Details form"”

### SCR-098: Order Line Items > Attributes Tab (Change Audit)
`Explicit` · confidence: `high`

- **Purpose:** Shows attribute-level change records (Action=Update, old/new value)
- **Inputs:** none
- **Outputs:** attribute change history
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Line Items > Attributes tab, the line item tree shows Outline 1 'FMS CPE Bundle'...'Line Item Attributes' grid (1-5 of 5)"”

### SCR-101: Account 360 View (FWA, created)
`Explicit` · confidence: `high`

- **Purpose:** Auto-generated account view after contact creation, showing account attributes, Special Management, credit, and billing profile
- **Inputs:** none
- **Outputs:** Account Class/Type/Segment/Status, Billing Profile
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"Account 360 View created — Account auto-generated from the contact (Account Class: Customer, Account Type: Residential, Customer Segment: Expatriate, Status: Active), with Billing Profile tab showing a new Postpaid, Monthly, Invoice billing profile."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Account 360 view. Account MAHENDRAN GANESAN... Special Management: "B2B2C Consum..."”

### SCR-102: Sales Order Detail (More Info tab)
`Explicit` · confidence: `high`

- **Purpose:** Shows order type, fulfillment mode, price list, currency
- **Inputs:** none
- **Outputs:** Order Type, Fulfillment Mode, Price List, Currency
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"Order Type: Activation, Fulfillment Mode: Deliver, Price List: VFQA PriceList, Currency: QAR."”

### SCR-103: Catalog Tab
`Explicit` · confidence: `high`

- **Purpose:** Browse product catalog to select a plan for the order
- **Inputs:** catalog category selection
- **Outputs:** selected plan added to order
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"agent browses VFQA Catalog → Fixed Line Plans → FWA Promotions and selects 'GigaHome 5G Classic New Indoor FWA Promotion.'"”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Catalog set to "VFQA Catalog"; left-hand tree shows Postpaid Plans (204) > Postpaid Consumer Plans (84) selected. Search box "U Plus" returns one tile”

### SCR-104: Numbers Tab (Order)
`Explicit` · confidence: `high`

- **Purpose:** Reserve a phone number for the order
- **Inputs:** number search/selection
- **Outputs:** reservation token, number assigned
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"Numbers tab — agent reserves a number; system dialog confirms 'SUCCESS: Reservation Token:13758017(SBL-EXL-00151)'"”

### SCR-105: UIM Custom Object Summary
`Explicit` · confidence: `high`

- **Purpose:** Look up SIM/CPE inventory record status in Oracle UIM
- **Inputs:** serial number search
- **Outputs:** inventory/assignment/device status
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Backend UIM lookup (Oracle Communications Unified Inventory Management, "Custom Object Summary" for SIM 8942702800801190296F)”

### SCR-106: Order Entry (Backend Order Record)
`Explicit` · confidence: `high`

- **Purpose:** Full backend order form showing status, fulfillment, line items
- **Inputs:** none (view)/order actions
- **Outputs:** order status/fulfillment
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Order Entry screen for 1-29727615763: Order Type Activation, Status "Complete", Fulfillment Status "Complete"”

### SCR-107: Manager Home Screen (Test Manager)
`Explicit` · confidence: `high`

- **Purpose:** Restricted landing screen for approver role
- **Persona access:** Manager/Approver
- **Inputs:** tile navigation
- **Outputs:** navigates to Order Approval
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Welcome back Test Manager!" Thursday, September 04, 2025. Tile menu reduced to just Home and Order Approval”

### SCR-108: Sales Order Record (Backend, Approved)
`Explicit` · confidence: `high`

- **Purpose:** Backend order record showing status after approval and fulfillment
- **Inputs:** Revise/Validate/Submit/Cancel Order actions
- **Outputs:** order status
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Sales Order record (image38) — Full backend order form for Order # 1-29724732583... Status Complete, Fulfillment Status Complete”

### SCR-110: WFM Activity Details — Admin/Technician View
`Explicit` · confidence: `high`

- **Purpose:** Technician view of assigned installation activity with tabs Map, Assess Activity, Upload Document, Re-Address/Re-Schedule, Inventory
- **Persona access:** Field Technician
- **Inputs:** tab actions
- **Outputs:** activity progression
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “WFM technician Activity details - Admin view (image29)... tabs Map, Assess Activity, Upload Document, Re-Address/Re-Schedule, Inventory.”

### SCR-111: End Activity Form
`Explicit` · confidence: `high`

- **Purpose:** Final technician step to close out an installation activity
- **Persona access:** Field Technician
- **Inputs:** Activity Remarks, Customer Available dropdown, Customer Signature, Next Activity
- **Outputs:** activity ended
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"End activity" screen: Activity Type Installation, Name NARAYAN MANJHI, "Activity Remarks"...”

### SCR-112: Contact / Cross Sales Offers Screen (MNP)
`Explicit` · confidence: `high`

- **Purpose:** View and act on cross-sales offers for a contact
- **Inputs:** Accept/Interested/Reject/Close actions
- **Outputs:** offer accepted, journey launched
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Cross Sales Offers grid (1-2 of 2) lists two offers... Action buttons above the offers grid: Accept, Interested, Reject, Close.”

### SCR-117: Product Promotions admin — More Info tab
`Explicit` · confidence: `high`

- **Purpose:** View/configure product promotion metadata
- **Persona access:** Admin
- **Inputs:** Promotion ID, Type, Payment Type, Effective Dates, Instances
- **Outputs:** promotion configuration
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Administration - Product > Product Promotions > More Info tab: promotion 'Postpaid U Start Promotion'”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Navigated via Administration - Product > Product Promotions. The "Postpaid U Plus Promotion" record... More Info tab shows Promotion ID...”

### SCR-118: Product Promotions admin — Bill Limit Mapping / Spend Limit Mapping tab
`Explicit` · confidence: `high`

- **Purpose:** Configure Agent Min Value / SL List Price / SL Min Value / SL Default Value per promotion, used later in guardrail validation
- **Persona access:** Admin
- **Inputs:** SL grid values
- **Outputs:** Bill Limit Mapping rows
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Same promotion's Bill Limit Mapping tab -> 'Spend Limit Mapping' grid”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Two mapped bill-limit products are shown: "Bill Limit Mobile"... "Bill Limit Mobile Plus"...”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit Mapping tab shows two Spend Limit products: Bill Limit Mobile (Agent Min Value 50) and Bill Limit Mobile Plus (Agent Min Value 80, Default Flag checked)”

### SCR-131: Siebel Sales Order screen (MNP)
`Explicit` · confidence: `high`

- **Purpose:** View/manage the submitted Sales Order and its line items
- **Persona access:** Retail Sales Agent
- **Inputs:** toolbar actions
- **Outputs:** order state transitions
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “the resulting Siebel Sales Order (Order # 1-28920871362) ... Toolbar shows Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order”

### SCR-132: Order Line Items / Line Item Attributes grid (MNP)
`Explicit` · confidence: `high`

- **Purpose:** Inspect bundled products and Bill Limit attributes on the order
- **Persona access:** Retail Sales Agent
- **Inputs:** none
- **Outputs:** line item detail view
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “a second view of the same order's Line Items grid shows the full bundle breakdown ... Line Item Attributes grid for the Bill Limit Mobile line”

### SCR-136: Order Entry - header/detail view (MNP)
`Explicit` · confidence: `high`

- **Purpose:** View order header and totals
- **Persona access:** Retail Sales Agent
- **Inputs:** none
- **Outputs:** order header detail
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “'Line Items: 1-29822004764' page, Order header fields”

### SCR-137: Account Summary
`Explicit` · confidence: `high`

- **Purpose:** View/edit account-level details for a customer, including installed assets, order history, billing profiles, trouble tickets, credit limit
- **Persona access:** Retail Sales Agent / Retail-CRM Agent
- **Inputs:** Pre-approved limit edit; Account/Customer lookup
- **Outputs:** account record update; Account details, Installed Assets grid, Orders grid, Billing Profile grid, Trouble Tickets grid
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Siebel 'Account Summary' view for account BIJAY MAHATO ... Tabs visible: Account Summary, Contacts, Addresses, Account Hierarchy, Installed Assets, Orders, Activities, Profiles, Payment Profile, Billing Items, Trouble Tickets”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Agent starts on Account Summary for customer "HEMANTH GOVARDHANAN" (Account # 80772215054...)”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Customer Account Summary — Account for Sivakumar Kanniah (Residential, Expatriate, Credit Limit 1,000, Active); Installed Assets shows a Prepaid Red Promotion”

### SCR-141: Lead Details View
`Explicit` · confidence: `high`

- **Purpose:** View/edit an individual lead's fields and take actions (Reject, Validate)
- **Persona access:** Retail Sales Agent, Manager, Admin
- **Inputs:** field edits
- **Outputs:** updated lead status/fields
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Lead Details View: Mobile # 97410001000, Lead Status In Progress, Lead Sub Status Call Back”

### SCR-142: My Leads list
`Explicit` · confidence: `high`

- **Purpose:** List leads owned by the logged-in agent
- **Persona access:** Retail Sales Agent
- **Inputs:** none
- **Outputs:** lead list filtered by owner
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'My Leads' full list (9 leads visible)”

### SCR-143: My Created Leads view
`Explicit` · confidence: `high`

- **Purpose:** List leads created by the logged-in agent regardless of current owner
- **Persona access:** Retail Sales Agent
- **Inputs:** none
- **Outputs:** lead list filtered by creator
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'My Created Leads' filtered view - narrows to 1 record (the just-created lead)”

### SCR-144: Manage Leads - My Team's Leads
`Explicit` · confidence: `high`

- **Purpose:** Manager view of team leads for review/action
- **Persona access:** Manager/Approver
- **Inputs:** filters
- **Outputs:** team lead list
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Manage Leads > 'My Team's Leads' view, filtered Created By = HEMANTH”

### SCR-147: All Leads across Org
`Explicit` · confidence: `high`

- **Purpose:** Org-wide visibility into all leads across all owners
- **Persona access:** Back Office / Admin
- **Inputs:** view filter selection
- **Outputs:** org-wide lead list
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Admin 'All Leads across Org' view. Tab titled 'All Leads acro[ss Org]...' A view-filter dropdown ... offers options including 'Converted Leads.'”

### SCR-150: Contact record - Leads sub-tab
`Explicit` · confidence: `high`

- **Purpose:** View leads associated with a specific Contact
- **Persona access:** Retail Sales Agent, Manager, Admin
- **Inputs:** none
- **Outputs:** contact-scoped lead list
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Contact record for SAHID ANSARI ... is open on the Leads sub-tab under Contacts. The Lead List shows 'No Records.'”

### SCR-163: Sales Order detail (back-office, Postpaid)
`Explicit` · confidence: `high`

- **Purpose:** View full order and line item details
- **Persona access:** Retail/CRM Agent, Back office
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Sales Order 1-225217281463: Type Sales Order, Order Type Activation, Status Complete... Line Items grid (12 lines)”

### SCR-164: Assets / Complex Assets view
`Explicit` · confidence: `high`

- **Purpose:** Review asset campaign/response/provision history
- **Persona access:** Retail/CRM Agent, Back office
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Assets module, Complex Assets view for Service ID 97430355458 (Mobile Service Bundle...) Campaign History tab active”

### SCR-165: Complex Product Runtime Instantiation (customization screen)
`Explicit` · confidence: `high`

- **Purpose:** Configure complex bundle product options including Bill Limit, VAS Flex-purchase, Extra Cabling, Smart Tracker, Lego Addons, Negative Priced Addons
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Multiple configurable sections are shown: VAS Flex-purchase Prepaid Opt-in, Extra Cabling Charges, Bill Limit, Smart Tracker Device, Lego Addons, Negative Priced Addons”

### SCR-168: Home / Guided Process 'Choose process' screen
`Explicit` · confidence: `high`

- **Purpose:** Entry point to select which guided journey to run (Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid)
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Guided Process — '1. Choose process.' Four options: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Guided Process — "1. Choose process" ... Four process buttons offered: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid”

### SCR-169: CAF (Customer Application Form) document view (Postpaid HRN)
`Explicit` · confidence: `high`

- **Purpose:** Generate and present the signable customer application form (bilingual)
- **Persona access:** Retail/CRM Agent, Customer (signs)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “A bilingual (Arabic/English) 'استمارة عميل فودافون / Vodafone Customer Application Form' is rendered: Date, Retailer ID, Section 1 – Applicant details...”

### SCR-173: Sales Order Line Items screen (Pre-to-Post)
`Explicit` · confidence: `high`

- **Purpose:** View/edit order line items resulting from a promotion change
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Resulting order line items — Sales Order Line Items: Update Mobile Service Bundle, Delete Prepaid Red Promotion, Add Postpaid U Plus Promotion”

### SCR-174: Product configurator (Bill Limit selection, Pre-to-Post)
`Explicit` · confidence: `high`

- **Purpose:** Configure VAS/Bill Limit/Smart Tracker/Lego Addons for the order
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Product configurator — Bill Limit selection — VAS Plan: None; Bill Limit radio group offers None / Bill Limit Mobile Plus (selected) / Bill Limit Mobile”

### SCR-175: Order header / Order detail screen (Pre-to-Post)
`Explicit` · confidence: `high`

- **Purpose:** View and validate/submit an order
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Order header — Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00”

### SCR-178: Sales Order record screen (Line Items, Pre-to-Post)
`Explicit` · confidence: `high`

- **Purpose:** View the created order and its line items, submit/validate/cancel
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Resulting Sales Order record — New browser tab "Line Items: 1-28574024137"”

### SCR-179: Migration Offer tab (Complex Asset List Applet)
`Explicit` · confidence: `high`

- **Purpose:** Display and action (Accept/Interested/Reject) a system-generated migration offer
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Assets: 97479026346 (Migration Offer view, CUT Complex Asset List Applet) ... A Migration Offers grid (system pre-populated, 1 of 1)”

### SCR-184: Account Activities tab
`Explicit` · confidence: `high`

- **Purpose:** View logged customer activity records tied to the account
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Account Activities tab (left columns) — New activity row ... Area "Migration to Po..." (Migration to Postpay), Journey "Start-up", ... Topic "Automated Gui..."”

### SCR-186: Billing Profile grid (account level)
`Explicit` · confidence: `high`

- **Purpose:** List billing profiles associated with the account
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Scrolled Account Summary — Billing Profile sub-view shows two profiles: 1-D7SNQ4I (Prepaid, green/active) and 1-D8DNSVY (Postpaid, red/inactive)”

### SCR-194: Sales Order — Line Items tab (New Prepaid)
`Explicit` · confidence: `medium`

- **Purpose:** View order line items and totals for the new prepaid order
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Sales Order — Line Items tab — Same order, scrolled to the "Line Items" tab under "Totals" sub-tab”

### SCR-195: Global Search
`Explicit` · confidence: `high`

- **Purpose:** Search for a customer/MSISDN and launch SIM Swap directly
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Global Search icon -> Enter MSISDN and click Go -> Click SIM Swap option”

### SCR-196: SIM Swap Queue / Order tasks tab
`Explicit` · confidence: `high`

- **Purpose:** List and manage pending SIM Swap orders for approval
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Queue -> Select SIM Swap Queue, click Order tasks tab -> Sort by Created Date or search Order Number”

### SCR-197: Order Approval Queue / Order Activities Queue (Tablet)
`Explicit` · confidence: `high`

- **Purpose:** List and process order approval tasks on tablet
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Select Order Approval Queue, go to Order Activities Queue (sort/search) -> Select order, click Assign to Me -> Go to My Activities”

### SCR-198: All Sales Order screen (with All SIM Swap Orders / All Pending SIM Swap Orders filter)
`Explicit` · confidence: `high`

- **Purpose:** Browse all sales orders, filterable to SIM Swap-specific views
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Login to Open UI -> Sales Order Icon -> All Sales Order -> top-menu dropdown with options "All SIM Swap Orders" and "All Pending SIM Swap Orders."”

### SCR-199: FDO requests tab (in account summary)
`Explicit` · confidence: `high`

- **Purpose:** View/manage future-dated order requests for the account
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “New Open UI fields: FDO request view icon on homepage, FDO time/date slot within the order, and an FDO requests tab in account summary”

### SCR-200: FDO request view icon (homepage)
`Explicit` · confidence: `high`

- **Purpose:** Homepage entry point to view FDO requests
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “New Open UI fields: FDO request view icon on homepage”

### SCR-202: Account Summary (Account 360, CTI View)
`Explicit` · confidence: `high`

- **Purpose:** Central account overview for agent — summary tiles (Orders, Trouble Tickets, Installed Assets, Billing Profiles), whitelisted KYC box, activity timeline
- **Persona access:** Agent (Open UI Desktop)
- **Inputs:** Account lookup
- **Outputs:** Account/contact summary, order/ticket/asset/billing counts, activity timeline
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Image 1 — Account Summary tab... Account Type: Business, Customer Segment: Reimbursement, Credit Limit Amount: 500... Installed Assets... Activity Timeline... All Orders grid”

### SCR-203: Asset Summary (CTI View)
`Explicit` · confidence: `high`

- **Purpose:** View/manage an individual asset's usage, balances, and add-ons
- **Persona access:** Agent
- **Inputs:** Asset selection
- **Outputs:** Recent usage (SMS/Data/Voice/Recharge), balances (Bill Manager, International Minutes), plan/addon list, Next Best Offer banner
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Image 2 — Asset Summary tab... Recent Usage panel... usage-ring panel... Postpaid Business Employee Plan Pro… phone 97472501217”

### SCR-204: Asset Detail Expanded View
`Explicit` · confidence: `high`

- **Purpose:** Detailed cross-entity view combining account, asset, contact, and bill details for an agent, with action buttons
- **Persona access:** Agent
- **Inputs:** Asset drill-down from Asset Summary
- **Outputs:** Account/Asset/Contact/Bill Detail cards; Get Due Amount, Get Usages, Get RTB, Get Next Best Offer actions
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Image 3 — Asset detail expanded view... Four detail cards: Account Details, Asset Details, Contact Details, Bill Details”

### SCR-206: Contact History Tab
`Explicit` · confidence: `high`

- **Purpose:** Lists historical customer contact/activity records within the Communications modal
- **Persona access:** Agent
- **Outputs:** Activity list with Channel, Description, Status, Comments, Transaction Date, Area, Journey
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Image 5 — Contact History tab populated... grid below is populated (1-10 of 10+) with real rows”

### SCR-209: Agent Desktop (Journey initiation)
`Explicit` · confidence: `high`

- **Purpose:** Entry point for agent to start the mobile postpaid activation journey, with role-based authorisation via TBD Agent Role Privilege Matrix
- **Persona access:** Retail Sales Agent
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix”

### SCR-212: Ticket Status on VF App
`Explicit` · confidence: `low`

- **Purpose:** Customer-facing screen in the Vodafone (VF) App showing ticket status
- **Persona access:** Customer
- **Outputs:** Ticket status
- **Dependencies:** Trouble Ticket process
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Slide 34: Ticket Status on VF App.”

## Wizards

### SCR-001: Bulk Adjustment Portal (DXP, Target State)
`Explicit` · confidence: `high`

- **Purpose:** Submit bulk billing adjustments in DXP integrated with BRM, with fixed template, unit of measurement, free-text comment, billing profile filtration, multi-bucket submission, role-based access, default sort/filter, request status tracking, and failure reports for re-upload
- **Persona access:** Agent (role-based access)
- **Inputs:** fixed template rows, unit of measurement, free-text comment, billing profile filter
- **Outputs:** request status, failure reports for re-upload
- **Dependencies:** BRM integration
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter”

### SCR-010: DSP Bulk Activation Templates (Target State)
`Explicit` · confidence: `high`

- **Purpose:** Standardised, varying-parameter bulk activation/modification/deletion for enterprise services
- **Persona access:** Fulfilment Agent
- **Inputs:** plans, spend limits, discounts, price overrides per row, across accounts and billing profiles
- **Outputs:** per-row success/failure status
- **Dependencies:** New Oracle bulk utility API
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Target requirement: standardised bulk templates on the DSP front end using a new Oracle bulk utility API”

### SCR-031: OpenGate Tablet Instant Activation Flow
`Explicit` · confidence: `high`

- **Purpose:** Guided instant activation flow for fixed-line/FWA on tablet devices, skipping appointment step, going to CAP signature; available only on OpenGate tablet, not desktop
- **Dependencies:** UIM (KID-to-CPE validation), CAP (signature)
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Instant activation: available only on the OpenGate tablet (not desktop)”

### SCR-035: TON (Transfer of Number) Wizard
`Explicit` · confidence: `high`

- **Purpose:** Guided flow to process Transfer of Number, including document collection and (proposed) split payment steps for party A/B
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “allow the journey to split into two separate payment steps for party A and party B”

### SCR-037: New Postpaid Connection Journey (single-scroll flow)
`Explicit` · confidence: `high`

- **Purpose:** End-to-end retail postpaid activation: Qnomy token, ID scan/MOI validation, eligibility/credit checks, plan/device/number/SIM selection, checkout, CAF, WinCash payment; designed as a single scrolling flow rather than multi-page next-click navigation
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “design the journey as a single scrolling flow rather than multi-page "next click" navigation”

### SCR-043: New Fixed Line wizard — Contact step
`Explicit` · confidence: `high`

- **Purpose:** Capture Kahramaa ID and QID, confirm/edit contact details, upload ID images
- **Inputs:** Kahramaa ID, Qatari ID, Email, Language, Alt phone #, ID photo uploads
- **Outputs:** Confirmed Contact record
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"1. Contact" — "Please enter Kahramaa & Qatari Id:" — Kahramaa ID = `16P6061`... Qatari ID = `29035654458`”

### SCR-045: New Fixed Line wizard — Address step
`Explicit` · confidence: `high`

- **Purpose:** Select primary Kahramaa address and confirm available Service Point/ONT
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “A grid of address records tied to various Kahramaa IDs... Below it, a "Service Points" sub-grid lists Service Point `16P6061_004`”

### SCR-046: New Fixed Line wizard — Plan step
`Explicit` · confidence: `high`

- **Purpose:** Select a GigaHome plan/promotion; shows bundled component detail card
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Please Select a Plan." — searchable catalog grid of promotions: GigaHome Classic 300 TB -F Promotion (selected)...”

### SCR-047: New Fixed Line wizard — Addon & Discount step
`Explicit` · confidence: `high`

- **Purpose:** Select or view auto-populated add-ons/discounts tied to the chosen plan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Select applicable add-on and discount based on customer's plan." Buttons "Select Add-on" / "Select IPTV Add-on"”

### SCR-048: New Fixed Line wizard — Number Selection step
`Explicit` · confidence: `high`

- **Purpose:** Reserve an MSISDN for the new service
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Select a Number to Reserve:" with an 8-digit number search box and tabs "Free Number" / "Reserved Number"”

### SCR-050: New Fixed Line wizard — CAF/Attachments step
`Explicit` · confidence: `high`

- **Purpose:** Attach CAF and supplementary documents
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Attachments" section shown with a "New File" upload link and drop area (existing library shows "1 - 10 of 18+" reusable attachments)”

### SCR-064: Order Correction wizard
`Explicit` · confidence: `high`

- **Purpose:** Allow agent to correct and resubmit a rejected order; dedicated re-entry point/journey reopening the same confirmed contact details
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “opens a dedicated "Order Correction" guided journey ... Step "1. Contact" re-opens with the same confirmed details”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"the tablet's top menu now includes an extra tile 'Order Correction'... this is the dedicated re-entry point for a rejected order"”

### SCR-067: New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion)
`Explicit` · confidence: `high`

- **Purpose:** Step-by-step tablet wizard to sell/activate a new Fixed Line connection
- **Persona access:** Tablet field agent
- **Inputs:** Kahramaa ID, ID Type/Number, contact fields, address, plan, addon/discount, number selection, appointment, CAF attachments, activity comment
- **Outputs:** Sales Order created and completed
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"New Fixed Line Tablet" journey, step "1. Contact" expanded... Steps 2-8 shown collapsed: Address, Plan, Addon & Discount, Number Selection, Book Appointment, CAF & Additional Attachments”

### SCR-078: FWA Contact Step
`Explicit` · confidence: `high`

- **Purpose:** Capture/confirm customer ID and personal details, upload ID documents
- **Inputs:** Qatari ID, email, language, alt phone, attachments
- **Outputs:** Connection Details popup, confirmed contact record
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Breadcrumb "FWA Postpaid - Contact:". Agent enters Qatari ID 29158603076”

### SCR-079: Address Step (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Capture installation address (Zone, Street No., Building No., Apt/Flat/Unit, Area); validated/saved or produces validation error if all fields empty
- **Persona access:** Field/desktop agent
- **Inputs:** Zone, Street No., Building No., Apt/Flat/Unit, Area
- **Outputs:** validated/saved address or validation error
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent fills Zone: 11, Street No.: 44, Building No.: 77, Apt/Flat/Unit 99V, Area: Al Rayyan, clicks Save Address.”
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"On step '2. Address' with Zone, Street No., Building No., Apt/Flat/Unit, and Area all empty, clicking Save Address produces a modal dialog"”

### SCR-080: Plan Step (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Select FWA plan from tile picker with bundle confirmation popup
- **Inputs:** plan selection
- **Outputs:** bundled component confirmation popup
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Plan tiles offered: GigaHome 5G Classic New Indoor FWA Promotion... GigaHome Premium OD New 5G FWA Promotion (selected...)”

### SCR-081: Addon & Discount Step (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Select applicable add-ons and discounts
- **Inputs:** Select Add-on / Select Discount buttons
- **Outputs:** applied discount shown
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Select applicable add-on and discount based on customer's plan." Buttons Select Add-on / Select Discount.”

### SCR-082: Number Selection Step (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Reserve a Free or Reserved phone number
- **Inputs:** toggle Free/Reserved, number tile selection
- **Outputs:** reserved MSISDN
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Toggle Free Number / Reserved Number (Reserved selected). Number 41202325 (QR0.00) chosen.”

### SCR-083: Book Appointment Step / Modal (FWA & WFM)
`Explicit` · confidence: `high`

- **Purpose:** Select cluster/date/time slot for installation appointment, with live capacity view and booking comments
- **Inputs:** Cluster, date, time slot, booking comments
- **Outputs:** Appointment ID/booking confirmation
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Calendar shows September 2025, date 20 selected. Time slots: 8AM-11AM selected”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Book Appointments for KID QID RG0007' popup. Calendar grid of dates... with live capacity counts (e.g. '14/15')"”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Book Appointment modal: Cluster F1, February 2026 calendar with 9 (today) pre-selected... time-slot pills 8AM–11AM (selected)..."”

### SCR-099: SIM Serial Step (FWA, with validation)
`Explicit` · confidence: `high`

- **Purpose:** Capture and validate SIM Serial and CPE Serial Number against UIM inventory in real time
- **Persona access:** Field/desktop agent
- **Inputs:** SIM Serial, CPE Serial Number
- **Outputs:** validated serials or error (not found/already assigned/not free)
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"On step '6. SIM Serial' (breadcrumb 'FWA Postpaid - SIM Serial:'), after Number Selection is saved... leaving SIM Serial and CPE Serial Number blank and clicking Continue produces an inline red banner"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Fields (with barcode-scan icons): CPE Indoor 2EQTE24314000127, CPE Outdoor S180P18075127, SIM Card 8942702800801190325.”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “SIM validation errors, sequential attempts (images 14, 15, 16, 17, 18)”

### SCR-100: CAF & Additional Attachments Step (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Upload CAF and Supplementary Form documents before continuing; blocks continuation with error if Supplementary Form missing
- **Inputs:** CAF file, Supplementary Form file
- **Outputs:** validated/uploaded attachments (green-checked) or error if Supplementary Form missing
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"On step '8. CAF & Additional Attachments'... the 'Supplementary Form' tile... is still empty/greyed out. Clicking Continue produces an inline banner: 'Error: Please select Supplementary Form before continuing.'"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Step 8 "CAF & Additional Attachments" expanded showing two green-checked uploaded documents: CAF (required...) and Supplementary Form”

### SCR-109: Book Appointment / Book Unscheduled Appointment Step
`Explicit` · confidence: `high`

- **Purpose:** Choose between scheduled calendar appointment or unscheduled appointment booking
- **Inputs:** date/time slot or unscheduled confirmation
- **Outputs:** Appointment ID and details
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Two options: Book Appointment or Book Unscheduled Appointment.”

### SCR-113: MNP Postpaid Billing Step
`Explicit` · confidence: `high`

- **Purpose:** Display existing billing profile for the contact within the MNP journey
- **Inputs:** none (view)/Continue
- **Outputs:** billing profile confirmed
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Section "3. Billing: Postpaid" expanded with a billing profile grid... Name 1-2KSRROSK”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “3. Billing: Postpaid expanded: a billing-account grid row”

### SCR-115: Book Appointment (Home Move)
`Explicit` · confidence: `high`

- **Purpose:** Select Cluster and appointment slot for Home Move installation
- **Inputs:** Cluster, slot selection
- **Outputs:** appointment booked with warning confirmation
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Book Appointment — select Cluster, book slot, click Submit; warning popup on submit, click Ok”

### SCR-116: Home Move Checklist
`Explicit` · confidence: `high`

- **Purpose:** Technician completes Home Move-specific checklist before ending activity
- **Inputs:** checklist fields
- **Outputs:** submitted checklist
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “select Home Move Checklist, complete and submit; "End" option appears”

### SCR-120: MNP Guided Process - Choose process
`Explicit` · confidence: `high`

- **Purpose:** Select Postpaid vs Prepaid MNP flow
- **Persona access:** Retail Sales Agent
- **Inputs:** button click
- **Outputs:** launches MNP wizard
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking MNP opens the 'Guided Process' screen with a 'Choose process' panel containing a single button: Switch as Postpaid”

### SCR-121: MNP wizard step: Contact
`Explicit` · confidence: `high`

- **Purpose:** Capture/confirm customer ID and contact details for MNP flow
- **Inputs:** Qatari ID, email, language, alt phone, attachments; ID Type/ID Number (prepaid variant)
- **Outputs:** confirmed Contact record; MOI Validation banner (prepaid variant)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “1. Contact accordion: 'Please insert or scan the customer's Qatari Id:'”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Result: 'Please confirm the contact details below' with a blue banner 'MOI Validation completed, please confirm the contact details'”

### SCR-122: MNP wizard step: Address
`Explicit` · confidence: `high`

- **Purpose:** Capture customer address
- **Persona access:** Retail Sales Agent
- **Inputs:** Zone, Street No., Building No., Apt/Flat/Unit
- **Outputs:** saved Address record
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “2. Address expanded: empty fields Zone, Street No., Building No., Apt/Flat/Unit”

### SCR-123: MNP wizard step: Billing
`Explicit` · confidence: `high`

- **Purpose:** Confirm/select billing account/profile
- **Persona access:** Retail Sales Agent
- **Inputs:** none (selection from existing profile)
- **Outputs:** selected Billing Profile
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “3. Billing: Postpaid expanded: a billing-account grid row”

### SCR-124: MNP wizard step: SIM Serial
`Explicit` · confidence: `high`

- **Purpose:** Capture/validate SIM serial number
- **Persona access:** Retail Sales Agent
- **Inputs:** SIM Serial
- **Outputs:** validated SIM assignment
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “4. SIM Serial: 'Please enter or scan the SIM Serial number below.'”

### SCR-125: MNP wizard step: Plan (plan selection grid)
`Explicit` · confidence: `high`

- **Purpose:** Select a promotion/plan for the order
- **Persona access:** Retail Sales Agent
- **Inputs:** search term, plan Add click
- **Outputs:** selected Plan/Promotion
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “5. Plan expanded: 'Please Select a Plan.' with a search box ... plan cards”

### SCR-126: MNP wizard step: Donor Details
`Explicit` · confidence: `high`

- **Purpose:** Capture porting/donor operator details
- **Persona access:** Retail Sales Agent
- **Inputs:** Port-in Number, Donor ID, Donor ID Type, Subscription Type
- **Outputs:** Donor Details record
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “6. Donor Details expanded: 'Please enter donor details below.'”

### SCR-127: MNP wizard step: Donor Attachment
`Explicit` · confidence: `high`

- **Purpose:** Generate/attach MNP application form and manage attachments
- **Persona access:** Retail Sales Agent
- **Inputs:** MNP Form selection (Digital/Touch Screen)
- **Outputs:** signed MNP form attachment
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “7. Donor Attachment expanded: empty Attachments grid ('No Records'), New File button, and action buttons Continue / MNP Form / Abandon Order / Go Back”

### SCR-129: MNP wizard step: CAF
`Explicit` · confidence: `high`

- **Purpose:** Generate/attach Customer Application Form
- **Persona access:** Retail Sales Agent
- **Inputs:** CAF form type selection (Digital/Manual/Touch Screen)
- **Outputs:** signed CAF attachment
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “8. CAF expanded ... action buttons Continue / CAF / Abandon Order / Go Back”

### SCR-133: MNP wizard step: Addon & Discount
`Explicit` · confidence: `high`

- **Purpose:** Select paid add-ons and applicable discounts for the plan
- **Persona access:** Retail Sales Agent
- **Inputs:** add-on/discount checkbox selections
- **Outputs:** selected add-ons/discounts applied to order
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Step 5 - Addon & Discount: Mass Market Addons list ... Paid Add-ons ... Discount”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Select applicable add-on and discount based on customer's plan.' Info note: 'Go back to Plan step and edit limit to cover for the add-on amount.'”

### SCR-134: MNP wizard step: Activity (Comments)
`Explicit` · confidence: `high`

- **Purpose:** Capture free-text comment and finalize/submit the journey
- **Persona access:** Retail Sales Agent
- **Inputs:** Comments text
- **Outputs:** submitted order confirmation
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “9. Activity section with an empty Comments textbox ... Button: Save and Finish”

### SCR-140: New Lead Tablet - Create a Lead form
`Explicit` · confidence: `high`

- **Purpose:** Capture new lead details
- **Persona access:** Retail Sales Agent
- **Inputs:** Mobile Number, Service Needed, name, preferred time, address
- **Outputs:** created Lead record
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'Create a Lead' form (empty): Mobile Number*, Service Needed*, First Name, Last Name, Preferred Time, Zone, Street, Building, Unit”

### SCR-151: Passport to QID Update wizard
`Explicit` · confidence: `high`

- **Purpose:** Update customer identification from Passport to QID
- **Persona access:** Retail Sales Agent + Customer
- **Inputs:** MSISDN, Passport Number, QID Number, QID Front/Back images, signature
- **Outputs:** Identification number change form signed and attached
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 1: Login to Tablet & Select the Passport to QID Journey ... Step 9: Form is attached, then click Finish”

### SCR-152: Cross Sales Contact step (Postpaid)
`Explicit` · confidence: `high`

- **Purpose:** Identify existing customer via Qatari ID for cross-sell
- **Inputs:** Qatari ID
- **Outputs:** Verified contact, proceeds to Offers step
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “New tab, breadcrumb "You are here: Cross Sales Contact:". Step "1. Contact" (expanded): "Please insert or scan the customer's Qatari Id:"”

### SCR-153: Cross Sales Offers step (Postpaid)
`Explicit` · confidence: `high`

- **Purpose:** Present campaign-driven cross-sell offers and let agent action them
- **Inputs:** Offer selection action
- **Outputs:** Order/handoff into New Postpaid wizard on accept
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "2. Offers" expands to a "Cross Sales Offers" grid with Accept / Interested / Reject / Close action buttons and two system-generated offers”

### SCR-154: Postpaid Contact step (wizard)
`Explicit` · confidence: `high`

- **Purpose:** Confirm/complete contact details for new postpaid provisioning, with additional fields vs cross-sales contact form
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “breadcrumb changes to "You are here: Postpaid - Contact:"... additional fields not present on the Cross Sales contact form: ID type, Job title, Digital Lead/Sale, No Email checkbox, Language, Alt. phone #”

### SCR-155: Address step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Capture customer address
- **Persona access:** Retail/CRM Agent
- **Inputs:** Zone, Street No., Building No., Apt/Flat/Unit
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "2. Address" expanded with empty fields: Zone, Street No., Building No., Apt/Flat/Unit; buttons Save Address / Skip Address / Cancel / Go Back”

### SCR-156: Billing step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Select/confirm billing profile
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "4. Billing: Postpaid" expanded, one billing profile row: Language ENG, Payment Type Postpaid...”

### SCR-157: Number Selection step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Reserve MSISDN for new line
- **Persona access:** Retail/CRM Agent
- **Inputs:** Number selection
- **Outputs:** Reservation token, Reserved Numbers grid update
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "5. Number Selection" expanded. A native browser alert reads: "SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)"”

### SCR-158: SIM Serial step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Capture/verify SIM serial (ICCID)
- **Persona access:** Retail/CRM Agent
- **Inputs:** SIM Serial number
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "6. SIM Serial" expanded: "Please enter or scan the SIM Serial number below."”

### SCR-159: Product Catalog / Plan step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Select postpaid plan/promotion
- **Persona access:** Retail/CRM Agent
- **Outputs:** Selected plan/promotion detail with bundled components
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "7. Plan" triggers a "Loading - Please wait" overlay; breadcrumb becomes "Product Catalog:"”

### SCR-160: Payment step (wizard)
`Explicit` · confidence: `high`

- **Purpose:** Handle upfront/deposit payment and trigger CAF generation, via WinCash
- **Persona access:** Retail/CRM Agent
- **Inputs:** Payment reason, deposit amounts
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "8. Payment" expanded: alert banner "Take Payment in Wincash." ... Buttons: Generate CAF”

### SCR-161: CAF/Attachments step (Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Attach supporting documents, generate CAF
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step "9. CAF" expanded showing an "Attachments" section: "New File" upload control, one file already attached”

### SCR-162: Activity step (call disposition, Postpaid wizard)
`Explicit` · confidence: `high`

- **Purpose:** Record call disposition/comment and finalize order
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Final step "10. Activity" expanded — call-disposition form: Channel, MSISDN, Type, Topic, Sub Topic, Area, Resolution Code, Status, Language, Comments”

### SCR-170: CAF & Additional Attachments step (B2B2C)
`Explicit` · confidence: `high`

- **Purpose:** Attach CAF and mandatory Proof of Employment for B2B2C
- **Persona access:** Retail/CRM Agent
- **Inputs:** File uploads
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Step 7 'CAF & Additional Attachments': CAF tile shows green checkmark...; 'Proof of Employment' tile has a red required-asterisk”

### SCR-177: Postpaid - Contact wizard step (Pre-to-Post)
`Explicit` · confidence: `high`

- **Purpose:** Capture/confirm prepaid number and customer identity for conversion
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Postpaid - Contact, step "1. Contact" — number entry ... A red accordion wizard with 4 steps: 1. Contact (expanded), 2. Plan, 3. CAF, 4. Activity”

### SCR-180: Base Management wizard (Contact / Offer Summary / Activity)
`Explicit` · confidence: `high`

- **Purpose:** Confirm contact, review offer, log activity for Autobase migration
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Base Management wizard — "1. Contact" (step 1 of 3) ... 3-panel accordion wizard ("1. Contact", "2. Offer Summary", "3. Activity")”

### SCR-187: Mobile Postpaid > Guided Process Choose process (tablet)
`Explicit` · confidence: `high`

- **Purpose:** Select New Postpaid or Prepaid to Postpaid guided process on tablet
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Guided Process — Choose process — Under "Mobile Postpaid," a "Choose process" panel offers two buttons: New Postpaid and Prepaid to Postpaid”

### SCR-189: Step 3 Addon & Discount (Pre-to-Post tablet)
`Explicit` · confidence: `high`

- **Purpose:** Select plan benefits, paid add-ons, and discounts
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Step 3. Addon & Discount — "Select applicable benefits, add-ons and discounts based on customer's plan."”

### SCR-190: New Prepaid Tablet — Step 1 Contact (ID capture)
`Explicit` · confidence: `medium`

- **Purpose:** Capture/scan new customer ID document to begin new prepaid activation
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Step 1 – Contact (ID capture) — Breadcrumb "You are here: Contact:". Accordion panel "1. Contact" open with instruction "Please insert or scan the customer's Qatari ID or Passport Number"”

### SCR-191: New Prepaid Tablet — Step 3 Number Selection
`Explicit` · confidence: `medium`

- **Purpose:** Reserve an MSISDN for the new prepaid connection
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Step 3 – Number Selection — Breadcrumb "Number Selection:". Prompt "Select a Number to Reserve:" with toggle tabs "Free Number" / "Reserved Number"”

### SCR-192: New Prepaid Tablet — Step 4 SIM Serial
`Explicit` · confidence: `medium`

- **Purpose:** Capture/scan the SIM serial number for the new connection
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Step 4 – SIM Serial ... "Please enter or scan the SIM Serial number below." SIM Serial = 8942702400000025359”

### SCR-208: DXP Agent Portal Wireframes (13-step onboarding wizard)
`Explicit` · confidence: `medium`

- **Purpose:** Agent-facing sales wizard for mobile postpaid onboarding: Home → Customer Details → ID Verification (IDWise) → Eligibility Check → Product Selection → Device on Installment → Number & SIM → Cart/Checkout → Billing → Payment → Confirm & e-Sign → CAF → Activation
- **Persona access:** Retail Sales Agent
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “a 13-page DXP Agent Portal wireframe sequence... Home → Step 1 Customer Details → Step 2 ID Verification (IDWise) → Step 3 Eligibility Check → Step 4 Product Selection → Step 5 Device on Installment → Step 6 Number & SIM → Step 7 Cart/Checkout → Step 8 Billing → Step 9 Payment → Step 10 Confirm & e-Sign → CAF → Step 11 Activation”

## Modals

### SCR-005: Bill Simulation Screen
`Explicit` · confidence: `high`

- **Purpose:** Show disconnection/penalty implications without disrupting the upcoming bill; explicitly not a tax invoice and must state so on its face
- **Persona access:** Agent
- **Inputs:** trigger from guided journey (disconnection, MNP port-out, upgrade/downgrade, park, put-off) or on-demand button
- **Outputs:** simulated penalty amounts, explicit non-tax-invoice disclosure
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “"bill simulation" (shows disconnection implications/penalties without disrupting the upcoming bill; explicitly not a tax invoice; must state so on its face”

### SCR-044: Fixed Line IPTV popup (billing email opt-in)
`Explicit` · confidence: `high`

- **Purpose:** Capture separate billing email if different from contact email
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a popup titled "Fixed Line IPTV" appears with info banner "IDM Created Successfully", a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field”

### SCR-049: Book Appointment modal (Fixed Line)
`Explicit` · confidence: `high`

- **Purpose:** Book an installation appointment (cluster, date, time slot, comments, QID/CAF collection flags)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Modal "Book Appointment": "Select Cluster" radio — Cluster 1 (selected) / Cluster 2... a June 2024 calendar... time-slot buttons”

### SCR-055: Responsibilities dialog
`Explicit` · confidence: `high`

- **Purpose:** Assign/select user responsibilities
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Opened from the person record; Available list (search by Responsibility) on the left, Selected list on the right”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “A Responsibilities picker dialog lists available responsibilities ... with a Selected panel”

### SCR-058: CAF preview modal (with e-signature pad)
`Explicit` · confidence: `high`

- **Purpose:** Preview generated CAF and capture customer/agent signature
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “A bilingual Vodafone Customer Application Form (CAF) rendered as a document preview... "Please Sign" pad opens”

### SCR-062: Reject Order modal
`Explicit` · confidence: `high`

- **Purpose:** Capture rejection reason(s) and comments for order rejection; may trigger SMS notification
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Manager chooses "Reject - Correction"; a "Reject Order" modal opens with a multi-select Reject Reason field”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Reason selected: 'ID image not clear'... A free-text Comments box is filled with 'Phoenix Sprint 66 test'... Buttons: Reject Order / Cancel."”

### SCR-063: Approve Order modal
`Explicit` · confidence: `high`

- **Purpose:** Confirm order approval with acknowledgment statement and comments
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Approve Order": "By clicking submit, I agree that I have verified all the documents and details to proceed with submission." Comments field filled with `Approved`.”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"'Approve Order' modal: 'By clicking submit,I agree that I have verified all the documents and details to proceed with submission'. Comments entered: 'B2B2C - Zero Touch - Approved'."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Clicking Approve opens an "Approve Order" modal: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission"”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “a confirmation dialog reads: 'By clicking submit, I agree that I have verified all the documents and details to proceed with submission.' A Comments box”

### SCR-068: Combo Box CPE Detection Dialog (Instant vs Normal Activation)
`Explicit` · confidence: `high`

- **Purpose:** Confirms detected pre-patched device and lets agent choose activation path
- **Persona access:** Tablet field agent
- **Inputs:** none (confirmation only)
- **Outputs:** Instant Activation or Normal Activation branch selection
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"A modal dialog appears with a warning icon and this verbatim system message... Two buttons: Instant Activation... and Normal Activation."”

### SCR-069: Customer Application Form (CAF) Preview/Sign
`Explicit` · confidence: `high`

- **Purpose:** Renders bilingual CAF document for review and e-signature
- **Persona access:** Tablet field agent, Customer (signature)
- **Inputs:** applicant/billing/service sections auto-populated; signature
- **Outputs:** Signed CAF attachment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “A bilingual (Arabic/English) "Vodafone Customer Application Form"... Signature capture pad”

### SCR-070: Signature Capture Pad
`Explicit` · confidence: `high`

- **Purpose:** Capture handwritten signature for CAF/contract-type documents
- **Persona access:** Tablet field agent/Customer
- **Inputs:** drawn signature
- **Outputs:** signature image embedded in document
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “A "Please Sign" modal with a hand-drawn cursive signature already captured on the line, and "Clear Signature" / "Done" buttons”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “A signature capture pad ('Please Sign') shown separately with a drawn cursive signature and Done / Clear Signature buttons”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “E-signature capture — "Please Sign" modal with a hand-drawn signature already captured on the signature pad; buttons "Done" and "Clear Signature"”

### SCR-074: Attachment Viewer (Qatari ID/CAF/Supplementary Form)
`Explicit` · confidence: `high`

- **Purpose:** Full-screen document viewer for reviewing attached ID/CAF/forms
- **Inputs:** click attachment icon
- **Outputs:** document rendered
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Attachment viewer – Qatari ID front (image32) — Full-screen document viewer showing "Qatari ID-Front 492025 133044"”

### SCR-084: CAF Modal (FWA)
`Explicit` · confidence: `high`

- **Purpose:** Display and sign the bilingual Customer Application Form
- **Inputs:** CAF type selection, signature
- **Outputs:** signed CAF attachment
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “CAF type dropdown: CAF-Digital, CAF-Manual, CAF-Touch Screen. Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form"”

### SCR-085: Activity Step (Comments)
`Explicit` · confidence: `high`

- **Purpose:** Capture free-text comment before finishing order
- **Inputs:** comments text
- **Outputs:** order finalized
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Comments popup, agent types "Test123 FWA Outdoor"... Clicks "Save and Finish".”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “9. Activity section with an empty Comments textbox ... Button: Save and Finish”

### SCR-088: Resource Inventory Import / Field Service Import Add-in
`Explicit` · confidence: `high`

- **Purpose:** Sync inventory quantities into Oracle Field Service
- **Inputs:** Instance Name, User Name, Resource Id, Password
- **Outputs:** Import status (Success/Created/Updated/Deleted counts)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Instance Name vfq2.test, User Name vfq_application_profile, Resource Id ABATS. ... Created: 3, Updated: 0, Deleted: 0, Item failed: 0.”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Field Service Import" pop-up "Resource Inventory Import" panel shows Instance Name vfq2.test, User Name vfq_application_profile, Resource Id ABATS...”

### SCR-089: Move Dialog (Technician Reassignment)
`Explicit` · confidence: `high`

- **Purpose:** Reassign/move a scheduled activity to a different technician resource
- **Persona access:** Dispatcher/Back-Office WFM user
- **Inputs:** technician search
- **Outputs:** activity moved (with conflict warnings if applicable)
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Move' dialog... Resources tab, search 'Syed' returns technician 'Syed Irfan'... flagged 'Work zones mismatch'"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Move dialog (image 34): "Move 8AM - 11AM - Installation - 120955 - 1-29728035948"...”

### SCR-114: MNP Postpaid Plan Step / Promotion Detail Modal
`Explicit` · confidence: `high`

- **Purpose:** Confirm selected plan/promotion with Bill Limit / Smart Limit and Credit Limit editing and included features
- **Inputs:** Edit Bill Limit, Edit Credit Limit, Edit Smart Limit, Customise button
- **Outputs:** confirmed plan selection with Bill/Credit/Smart Limit values
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “A modal titled "New Plus Extra Pakistan BIA Promotion" displays... Bill Limit: 150... Credit Limit: 1000”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking 'Add' on Postpaid U Start Promotion opens a detail modal: 'Smart Limit: 20', an 'Edit Smart Limit' button ... 'Credit Limit: 1000'”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “promotion detail modal appears: "New Plus Max India BIA Promotion" with Bill Limit: 150 (Edit Bill Limit button) and Credit Limit: 1000 (Edit Credit Limit button)”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Clicking Edit Credit Limit reveals a dropdown of selectable values: 0, 1000, 1500, 200, 2000, 50, 500, 800, plus a 'Go' button”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Plan detail confirmation popup — "Postpaid Red 350 Promotion" detail modal ... Smart Limit: 350 ... Credit Limit: 1000”

### SCR-128: Mobile Number Portability Application Form (MNP contract)
`Explicit` · confidence: `high`

- **Purpose:** Present legal MNP contract for customer review and signature (bilingual Arabic/English, Vodafone-branded)
- **Persona access:** Retail Sales Agent + Customer
- **Inputs:** customer signature
- **Outputs:** signed MNP form
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “the Mobile Number Portability Application Form (bilingual Arabic/English, Vodafone-branded)”

### SCR-130: Vodafone Customer Application Form (CAF, MNP variant)
`Explicit` · confidence: `high`

- **Purpose:** Present CAF contract for applicant details, billing info, plan sections and signature (bilingual)
- **Persona access:** Retail Sales Agent + Customer
- **Inputs:** customer signature
- **Outputs:** signed CAF
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “The Vodafone Customer Application Form (bilingual, 'استمارة عميل فودافون') opens”

### SCR-138: Mass Market Addons checklist modal
`Explicit` · confidence: `high`

- **Purpose:** Select from full catalog of available add-ons
- **Persona access:** Retail Sales Agent
- **Inputs:** checkbox selections
- **Outputs:** selected add-ons list
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “A scrollable checklist 'Mass Market Addons' with items and prices”

### SCR-139: Prepaid Customer Application Form (CAF)
`Explicit` · confidence: `high`

- **Purpose:** Present Prepaid-specific CAF contract for signature (bilingual)
- **Persona access:** Retail Sales Agent + Customer
- **Inputs:** customer signature
- **Outputs:** signed prepaid CAF
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Prepaid Customer Application Form' ('نموذج طلب فودافون مسبق الدفع')”

### SCR-145: Reject Lead modal
`Explicit` · confidence: `high`

- **Purpose:** Capture reason and comment for lead rejection
- **Persona access:** Manager/Approver
- **Inputs:** Reject Reason Code, Reject Comment
- **Outputs:** lead status set to Rejected
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'Reject Lead' modal opens: required Reject Reason Code dropdown ... and Reject Comment text field; buttons OK/Cancel”

### SCR-146: Lead Owner reassignment picker
`Explicit` · confidence: `high`

- **Purpose:** Select a new Lead Owner from a candidate list
- **Persona access:** Manager/Approver
- **Inputs:** search filter, row selection
- **Outputs:** reassigned Lead Owner
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “A modal titled 'Lead Owner' opens with a searchable picker (Last Name filter) listing 5 candidate owners with Job Title”

### SCR-148: Description edit popup
`Explicit` · confidence: `high`

- **Purpose:** Edit the free-text Description field on a Lead
- **Persona access:** Retail Sales Agent
- **Inputs:** description text
- **Outputs:** updated Description field
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “A 'Description' text-edit popup opens ... the new owner types 'Test1234' replacing the prior text, with an OK button”

### SCR-149: CallBack Date/Time picker
`Explicit` · confidence: `high`

- **Purpose:** Set the callback date/time on a lead
- **Persona access:** Retail Sales Agent
- **Inputs:** date, time
- **Outputs:** CallBack Date/Time value set, auto-transitions Lead Status
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “A date/time picker opens on the CallBack Date/Time field: December 2025 calendar ... Hour/Minute sliders, plus Now and Done buttons”

### SCR-166: Bill Limit Mobile Plus — Customize detail panel
`Explicit` · confidence: `high`

- **Purpose:** Set customer-level SL Limit Amount for the Bill Limit product
- **Persona access:** Retail/CRM Agent
- **Inputs:** SL Limit Amount
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Opened via the gear/Customize icon on the Bill Limit Mobile Plus row. Shows: Your Price QR25.00... Spend Limit Amounts tab”

### SCR-172: Promotion Upgrades picker (modal)
`Explicit` · confidence: `high`

- **Purpose:** Search and select target postpaid promotion for upgrade
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Promotion Upgrades picker — modal search "*U*Plus*" returns postpaid target promotions”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Step "2. Plan" — manual promotion search ... A search box (typed: "red") filters a "Promotion Upgrades List Applet" grid of postpaid plan tiles”

### SCR-181: Comments modal (Base Management)
`Explicit` · confidence: `high`

- **Purpose:** Capture free-text comment for Activity step
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Comments modal — A "Comments" popup textbox is filled with the literal text "UNICA PRE TO POST TEST"”

### SCR-182: Submission confirmation modal
`Explicit` · confidence: `high`

- **Purpose:** Confirm order submission to the agent
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Submission confirmation modal — After Save and Finish, a modal reads verbatim: "Order request is submitted successfully..."”

### SCR-188: Step 2 Plan — Edit Credit Limit dropdown
`Explicit` · confidence: `high`

- **Purpose:** Edit the credit limit associated with the selected plan
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Step 2. Plan — Edit Credit Limit dropdown open — Same modal, Credit Limit dropdown expanded showing options 1000, 200, 50, 500, 800”

### SCR-193: Prepaid Customer Application Form (unsigned)
`Explicit` · confidence: `medium`

- **Purpose:** Generate the prepaid CAF for signature
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “the system auto-generates a bilingual (Arabic/English) "Prepaid Customer Application Form" (نموذج طلب فودافون مسبق الدفع)”

### SCR-205: Communications Modal / Real Time Balance
`Explicit` · confidence: `high`

- **Purpose:** Displays communications toolbar status and, underneath, the Real Time Balance panel triggered by 'Get RTB'
- **Persona access:** Agent
- **Outputs:** Balance tiles (Primary Balance, Bill Manager, International Minutes, Lite Key, Local Minutes/SMS, Data); sub-nav (Contact history, Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead)
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Image 4 — Communications dialog / Real Time Balance expanded. A modal titled 'Communications' opens over the page, with a system message... 'User has maximum Communication toolbar sessions.'”

### SCR-213: Open UI Tickets Fields (per-issue-type template)
`Explicit` · confidence: `medium`

- **Purpose:** Form/fields interface where agents paste in the specific template content for a given ticket/issue type
- **Persona access:** Agents
- **Inputs:** Template content per issue type (e.g. Slow Data Performance, Incorrect Charges templates)
- **Dependencies:** Type of Tickets list; Mobile Complaints Templates
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “each ticket/issue type has a specific template that agents fill in and paste into "Open UI Tickets Fields."”

## Pages

### SCR-002: PowerApps Bulk Adjustment Portal (Current State)
`Explicit` · confidence: `high`

- **Purpose:** Current-state bulk adjustment submission with offline approval and manual Excel handling
- **Persona access:** Agent
- **Inputs:** Excel upload
- **Outputs:** offline-approved adjustments
- **Dependencies:** Manual Excel process
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “bulk adjustments go through a PowerApps portal with offline approval and manual Excel handling”

### SCR-003: Statement of Account (SOA) View
`Explicit` · confidence: `high`

- **Purpose:** Display customer bill/payment/adjustment/allocation history from inception
- **Inputs:** account/service identifier
- **Outputs:** one line per bill, payments, adjustments, allocations
- **Dependencies:** BRM data (constrained by purge policy)
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations)”

### SCR-004: Bill Landing View
`Explicit` · confidence: `high`

- **Purpose:** Summarised bill display for customer/agent showing MRC, VAS, VAT; search inside bill for enterprise; unified usage view
- **Outputs:** MRC, VAS, VAT summary; search inside bill (enterprise); unified usage view
- **Dependencies:** BRM API exposure
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Bill display: requested summarised bill landing view (MRC, VAS, VAT), search inside bill for enterprise, unified usage view”

### SCR-008: EBU Number Portal
`Explicit` · confidence: `high`

- **Purpose:** Reserve numbers for enterprise accounts
- **Outputs:** reserved number
- **Dependencies:** Number management team alternative channel
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Number reservation via the number management team or the EBU number portal; unpaired SIM serials noted as an issue”

### SCR-009: Bulk Activation Control Sheet (Excel Macro, Current State)
`Explicit` · confidence: `high`

- **Purpose:** Current-state bulk number activation using an Excel macro with embedded Siebel credentials
- **Persona access:** Fulfilment/activation team
- **Inputs:** identical plan, account, spend limit, price across batch
- **Outputs:** activated batch
- **Dependencies:** Pre-created pending replica order for reference
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch; ... Siebel credentials embedded in the control sheet”

### SCR-014: Enterprise Invoice (PDF)
`Explicit` · confidence: `high`

- **Purpose:** Enterprise customer invoice document in PDF format, with banner, subtotals, service ID/circuit grouping, tax code/number placeholders; must match ordering with Excel version
- **Persona access:** Enterprise customer, Account Manager
- **Inputs:** billed usage/charges/discounts
- **Outputs:** formatted invoice with banner, subtotals, service ID/circuit grouping, tax code/number placeholders
- **Dependencies:** Must match ordering with Excel version
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “detailed walkthrough of the enterprise invoice (PDF/Excel) redesign requirements”

### SCR-015: Enterprise Invoice (Excel)
`Explicit` · confidence: `high`

- **Purpose:** Enterprise customer invoice document in Excel format, including CDR detail, sorted by date/time with number filter, aggregated line items over 1M limit with CSV fallback
- **Persona access:** Enterprise customer, Account Manager
- **Inputs:** CDR data, discount lines
- **Outputs:** sorted CDRs by date/time with number filter, aggregated line items (over 1M limit) with CSV fallback
- **Dependencies:** Excel one-million line item limit; 400k email size threshold
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “sort CDRs by date/time with a number filter; Excel has a one-million line item limit requiring aggregation with CSV fallback”

### SCR-018: GigaHome & OSNtv Subscription Acceptance Form
`Explicit` · confidence: `high`

- **Purpose:** Customer-signed acceptance capturing terms and conditions for GigaHome/OSNtv subscription
- **Persona access:** Customer
- **Inputs:** Customer Name, Customer QID, Plan Name, Date, Signature
- **Outputs:** signed acceptance record
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature”

### SCR-023: Orders page
`Explicit` · confidence: `high`

- **Purpose:** Submit disconnection and other orders; ticket must be closed with specific resolution code before disconnection order can be submitted
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “ticket closed with a specific resolution code... before the disconnection order can be submitted on the Orders page”

### SCR-027: Eligibility Web Portal (external)
`Explicit` · confidence: `high`

- **Purpose:** Determine fixed-line location/product eligibility (fiber, indoor 5G, outdoor 5G sellability); external web portal outside CRM, fed by big data/'D theta' plan recommendations and a weekly IMS file mapping zone/street/building to KID
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “eligibility check on an external web portal (outside CRM, fed by big data/'D theta' plan recommendations and a weekly IMS file mapping zone/street/building to KID) determines whether fiber, indoor 5G, or outdoor 5G is sellable at a location”

### SCR-201: RFS Portal
`Explicit` · confidence: `high`

- **Purpose:** Sales-facing lookup of address feasibility/RFS status and lead creation
- **Inputs:** ZSB address, Karama ID, area search
- **Outputs:** RFS status, potentials, SLA/cluster (F1-F4), plan/offer recommendations, MSISDN capture, Siebel lead creation
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “RFS Portal: sales-facing app; search by ZSB address, Karama ID, or area; shows RFS status, potentials, SLA/cluster”

### SCR-207: Contact Portal
`Explicit` · confidence: `medium`

- **Purpose:** Linked portal for contact/customer, accessible from Account Summary
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “with a 'Go to Contact Portal' link”

### SCR-210: Ticket Homepage
`Explicit` · confidence: `medium`

- **Purpose:** Central page for viewing/managing a ticket, with fields segmented by which role is responsible for filling them
- **Persona access:** FL Agents, Complaints Team
- **Inputs:** Fields filled by FL Agents, Complaints Team, or FL Agents (for specific TT types)
- **Dependencies:** Trouble Ticket process
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

## Dashboards

### SCR-012: RFS/Feasibility Portal (Grafana)
`Explicit` · confidence: `high`

- **Purpose:** Check RFS/feasibility for new fixed line/business broadband orders
- **Persona access:** Sales
- **Inputs:** address/location
- **Outputs:** feasibility result
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “RFS/feasibility checking now via Grafana on the portal”

### SCR-013: Enterprise Process Knowledge Base Dashboard
`Explicit` · confidence: `high`

- **Purpose:** Central hub for viewing as-is enterprise processes (consumer/enterprise/internal categories) with links to drawings and step-by-step docs
- **Persona access:** Presenter/internal SME
- **Outputs:** process list, drawing links, procedure documents
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Presenter demonstrated the knowledge base structure: dashboard, process list, consumer/enterprise/internal categories, hyperlinks to drawings and step-by-step procedure documents”

### SCR-021: Customer 360
`Explicit` · confidence: `low`

- **Purpose:** Single-page customer overview with tab-based partial refresh, including timeline/order chronology UI and whole-page customer 360 view; sectioned into Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, and Credit Risk (per J017 Customer 360 journey)
- **Persona access:** Agent / Assisted Care Agent (via J017 Customer 360 journey)
- **Inputs:** Not stated
- **Outputs:** Not stated; Order section outputs order history/details (Fetch Order History); Trouble Tickets section outputs ticket history (Fetch Ticket History); Billing Profile section outputs billing profile details
- **Dependencies:** Part of the Customer 360 (J017) capability
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “customer 360 must be single page with tab-based partial refresh”
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “Gagan (confirmation wording, timeline/order chronology UI, whole-page customer 360 view)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Slides 6-11 — a sequence of Customer 360 section title slides: "1. Overview", "2. Order", "3. Trouble Tickets", "4. Installed Assets", "5. Billing Profile", "6. Credit Risk".”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"2. Order" (Customer 360 section title slide)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"3. Trouble Tickets" (Customer 360 section title slide)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"4. Installed Assets" (Customer 360 section title slide)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"5. Billing Profile" (Customer 360 section title slide)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"6. Credit Risk" (Customer 360 section title slide)”

### SCR-056: New Fixed Line Tablet Home Dashboard
`Explicit` · confidence: `high`

- **Purpose:** Tablet channel home/navigation with tile grid
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent lands on the CRM home screen ("Welcome back HALEEMI HALEEMI!"...) and hovers/clicks the "New Fixed Line Tablet" tile among other tiles”

### SCR-060: TM SR Queue View — Order Activities Queue
`Explicit` · confidence: `high`

- **Purpose:** Manager queue of order-approval activities awaiting assignment across multiple queues
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Lists multiple queue IDs (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS). Activities grid (tab "Order Activities Queue")”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Lists multiple approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS)... Manager clicks 'Assign To Me'"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “TM SR Queue View — Queue Employee list (queues: ADJ_APPR_QUEUE_BUSI_1000...) and Order Activities Queue / Activities grid”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “lists approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ, _JAGUAR, _TESTING, _VISTAS)... Activities grid with tabs Order Activities Queue / My Activities / Activities History”

### SCR-091: OFS My Route (Technician)
`Explicit` · confidence: `high`

- **Purpose:** Technician's daily route/activity list in Oracle Field Service app
- **Persona access:** Field Technician
- **Inputs:** none / Activate route action
- **Outputs:** navigation to Start activity; route status change
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"OFS mobile/web app, technician Syed Irfan, 'My Route' for Sunday 07 September 2025. Route progress ring 17% (1 Pending, 1 Completed)."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “My Route (images 40–42): Logged in as Syed Irfan... Route progress 17%, 1 Pending.”

### SCR-119: Agent Home / App Launcher
`Explicit` · confidence: `high`

- **Purpose:** Entry point/module launcher for agent-facing journeys, e.g. via MNP tile highlighted on the app-icon grid
- **Persona access:** Retail Sales Agent
- **Inputs:** tile click
- **Outputs:** navigates to selected module
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent home page ('Welcome back Hemanth Kumar!...') - the MNP tile is highlighted/hovered in the app-icon grid”

### SCR-176: Home menu (app-icon grid, Pre-to-Post desktop)
`Explicit` · confidence: `high`

- **Purpose:** Entry point/launcher for all CRM modules and guided journeys
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Home landing page ... showing the full CRM app-icon grid (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Passport to QID, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests, Agreements)”

### SCR-183: Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet)
`Explicit` · confidence: `high`

- **Purpose:** Monitor backend bulk migration job status
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Backend Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet). Confirms server-side orchestration.”

### SCR-185: Account 360 View / Account Summary tile view
`Explicit` · confidence: `high`

- **Purpose:** High-level account snapshot with tile counters and activity timeline
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Account 360 View / Account Summary tile view — A different, higher-level "Account Summary" screen (VFQA 360 View) shows the account snapshot”

### SCR-211: Tickets Dashboard
`Explicit` · confidence: `low`

- **Purpose:** Dashboard view of tickets (no field-level content extracted beyond the slide title)
- **Dependencies:** Trouble Ticket process
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Slide 35: Tickets Dashboard.”

## Popups

### SCR-057: Prepatched device detection dialog
`Explicit` · confidence: `high`

- **Purpose:** Let agent choose Instant vs Normal Activation path when a prepatched device is detected
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “System pops up: "We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. ... Proceed with Instant Activation?" Buttons: Instant Activation / Normal Activation.”

### SCR-075: Connection Details Popup
`Explicit` · confidence: `high`

- **Purpose:** Show existing prepaid/postpaid connection counts for the customer (and, in some journeys, credit warnings) before proceeding with a new order/journey
- **Inputs:** none
- **Outputs:** Prepaid/Postpaid connection counts; link to Show Postpaid Plan Details; Continue/Cancel decision
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"A 'Connection Details' popup appears automatically: 'Total Number of Prepaid Connections: 0', 'Total Number of Postpaid Connections: 1', with a 'Show Postpaid Plan Details' link"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “backend cross-check first (Enhanced Number Selection / Numbers tab on the Contact record) shows two numbers already reserved...”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “A "Connection Details" modal pops up automatically: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 2"”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “A Connection Details modal pops up showing 'Total Number of Prepaid Connections: 0', 'Total Number of Postpaid Connections: 0'”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A "Connection Details" popup fires: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 2", with note...”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “A "Connection Details" modal overlays showing "Total Number of Prepaid Connections: 1", "Total Number of Postpaid Connections: 1", a "Show Postpaid Plan Details" button”

### SCR-076: CAF Dropdown (Digital/Manual/Touch Screen)
`Explicit` · confidence: `high`

- **Purpose:** Select CAF form generation mode
- **Inputs:** CAF type selection
- **Outputs:** generated CAF PDF
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “CAF type dropdown: CAF-Digital, CAF-Manual, CAF-Touch Screen. Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form"”

### SCR-135: Completion popup (MNP order confirmation)
`Explicit` · confidence: `high`

- **Purpose:** Confirm successful order submission and provide order number
- **Persona access:** Retail Sales Agent
- **Inputs:** Finish Process click
- **Outputs:** navigates away from wizard
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “'MNP completed successfully. Order Number:- 1-29822004764' with a Finish Process button”

### SCR-167: Order Validation dialogs
`Explicit` · confidence: `high`

- **Purpose:** Surface validation notices/errors on order Validate action (e.g. Bill Limit vs Credit Limit or Agent Minimum)
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “A browser dialog... 'Note: Maximum Bill Limit is equivalent to account Credit Limit...' A second validation dialog... 'Bill Limit can not be set lower than Agent Minimum 80'”

### SCR-171: B2B2C override confirm dialog
`Explicit` · confidence: `high`

- **Purpose:** Confirm whether to bypass B2B2C routing for an account with existing Special Management flag
- **Persona access:** Retail/CRM Agent
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “native browser confirm dialog... 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C' with OK and Cancel buttons”

# Module Hierarchy (Phase 7)

Platform > Module > Sub-Module > Feature > Capability, derived from the synthesized Entity, Journey, and Requirement catalogues (`domain-model.md`, `journeys.md`, `requirements.md`). Every journey/requirement ID below traces back to its full entry in those files.

**Modules:** 16

---

## Module: Lead Management
### Sub-Module: Lead Creation & Qualification
- **Feature: Create and Manage Leads**
  - Capability: Create lead for fixed/home service with manager reject path
  - Capability: Create lead for mobile number with owner reassignment
  - Capability: Full lead lifecycle across 4 personas (create/edit/owner change)
  - Capability: Tablet lead creation with fixed pre-sales and edit
  - Capability: Attach lead to existing matching Contact when created from known mobile number
  - Capability: Conditional 'Fixed Pre-sales' field on Service Needed dropdown for Home service
  - Capability: Reject Lead requires Reject Reason Code from controlled taxonomy
  - Capability: Owner-scoped 'My Leads' visibility after reassignment
  - Capability: Creator-scoped 'My Created Leads' view regardless of ownership changes
  - Capability: Richer 3-column lead detail layout at Admin/back-office level
  - Capability: Enterprise lead management and account manager task tracking
  - _Entities: ENT-057, ENT-037; Journeys: UJ-072, UJ-073, UJ-074, UJ-075; Requirements: REQ-030, REQ-202, REQ-203, REQ-205, REQ-206, REQ-207, REQ-208_

### Sub-Module: Cross Sales Conversion
- **Feature: Cross Sales Offer Acceptance**
  - Capability: Cross sales offer engine surfaces campaign-driven offers for existing customers
  - Capability: Cross-sales campaign offer auto-applies plan without agent discretion
  - Capability: QID field locked/read-only after Cross Sales redirect
  - Capability: No editable add-on/discount control on cross-sell orders
  - Capability: Cross Sales transaction bundles secondary Modification order onto existing line
  - Capability: Cross-sales offer acceptance launches corresponding guided journey
  - Capability: One-time-per-QID free-months offer restriction
  - Capability: Cross Sales campaign offer surfaced for existing customers via offer engine
  - _Entities: ENT-054, ENT-028; Journeys: UJ-045, UJ-068, UJ-077; Requirements: REQ-135, REQ-136, REQ-137, REQ-213, REQ-190, REQ-128, REQ-212_


## Module: Mobile Postpaid
### Sub-Module: New Postpaid Activation
- **Feature: Retail/Consumer New Postpaid Order Creation**
  - Capability: Vanilla new postpaid sales order with bill limit configuration (desktop)
  - Capability: Retail new postpaid edit bill limit (Open UI desktop)
  - Capability: New postpaid activation for HRN customer with credit limit edit (desktop)
  - Capability: New postpaid, B2B2C, with approval (tablet)
  - Capability: New postpaid, B2B2C, without approval (tablet)
  - Capability: New postpaid activation for HRN customer with pre-approved credit limit (tablet, with approval)
  - Capability: New postpaid (non-B2B2C) consumer activation with existing-account credit override (tablet)
  - Capability: Retail channel activation of new postpaid connection
  - Capability: Consumer postpaid registration across ECR/Open UI/VSA multi-channel
  - Capability: Postpaid registration rejection handled directly by Fulfilment without email round-trip
  - Capability: Customer purchasing postpaid mobile plan through retail agent (target state)
  - Capability: Mobile post-paid customer onboarding journey
  - Capability: Editable bill limit and credit limit at plan/promotion selection
  - Capability: Agent Min Value guardrail on Bill/Smart Limit editing
  - Capability: Bill limit mapping configuration per product promotion
  - Capability: Order line items reflect selected Smart Limit as Bill Limit attribute
  - Capability: Add-on selection references available Bill Limit headroom
  - Capability: System surfaces HRN advance payment requirement at Connection Details step
  - Capability: Credit limit change propagates to CAF, Sales Order, and Account record
  - Capability: Bill limit editable per-order with max = credit limit warning
  - Capability: System control preventing agents from selecting any credit limit value
  - Capability: Bill limit value cannot exceed credit limit
  - Capability: New mobile postpaid guided journey demo (IT stack modernization walkthrough)
  - Capability: J011 onboarding ID-type-dependent validation
  - Capability: J011 cart browsing across product types
  - Capability: J011 SIM handover options
  - Capability: J011 Unica campaign reference in onboarding
  - _Entities: ENT-030, ENT-028, ENT-006, ENT-025, ENT-059; Journeys: UJ-042, UJ-044, UJ-077, UJ-078, UJ-079, UJ-080, UJ-081, UJ-082, UJ-083, UJ-084, UJ-093, UJ-103, UJ-104; Requirements: REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-284, REQ-262, REQ-295, REQ-296, REQ-297, REQ-298_

### Sub-Module: Postpaid Service Management
- **Feature: Plan Change & Service State Management**
  - Capability: Plan change postpaid-to-postpaid
  - Capability: Real upgrade/downgrade differentiation logic
  - Capability: Regulatory requirement: commitment period continues across plan upgrade
  - Capability: Mobile service suspension across multi-channel request intake
  - Capability: Mobile service resume across multi-channel request intake
  - Capability: Suspension requires cleared unbilled balance
  - Capability: Customer communication on suspension/resume
  - _Entities: ENT-028, ENT-005, ENT-024; Journeys: UJ-029, UJ-107, UJ-108; Requirements: REQ-076, REQ-064, REQ-299, REQ-300, REQ-301, REQ-302_

### Sub-Module: Device Installment
- **Feature: Device Installment (DOI) Orders**
  - Capability: Device installment order creation via retail and telesales channels
  - Capability: Plan and device lock-in with early termination penalty calculation
  - _Entities: ENT-029; Journeys: UJ-030; Requirements: REQ-125_


## Module: Mobile Prepaid
### Sub-Module: Prepaid Activation
- **Feature: New Prepaid Connection Creation**
  - Capability: Consumer prepaid activation via ECR/Open UI/VSA multi-channel
  - Capability: New prepaid connection via Open UI Tablet
  - Capability: Real-time prepaid ECR/Siebel activation
  - Capability: Passport without customer signature exception (ref 2.1.13)
  - Capability: Create virtual/dummy SKUs for digital eSIM to avoid inventory depletion
  - _Entities: ENT-026, ENT-081; Journeys: UJ-043, UJ-089; Requirements: REQ-114, REQ-111, REQ-107_


## Module: Pre-to-Post Migration
### Sub-Module: Prepaid to Postpaid Conversion
- **Feature: Prepaid-to-Postpaid Conversion Journeys**
  - Capability: Desktop vanilla manual conversion with bill limit validation failure
  - Capability: Open UI desktop manual plan selection for QID customer
  - Capability: Autobase migration with system-recommended offer
  - Capability: Open UI tablet conversion for expat with credit limit scenario
  - Capability: Business process/manual eligibility review for prepaid-to-postpaid
  - Capability: Automate prepaid-to-postpaid migration eligibility checks
  - Capability: Autobase offers sourced and traceable to Unica campaign engine end-to-end
  - Capability: Autobase wizard collapses manual cart/catalog/quote into single Accept + 3-step confirmation
  - Capability: Order progresses asynchronously through backend bulk job queue after Autobase submission
  - Capability: Guided Pre2Post journey supports manual free-text promotion search and selection
  - _Entities: ENT-028, ENT-030; Journeys: UJ-027, UJ-085, UJ-086, UJ-087, UJ-088; Requirements: REQ-077, REQ-228, REQ-229, REQ-230, REQ-226_

### Sub-Module: Postpaid to Prepaid Conversion
- **Feature: Postpaid-to-Prepaid Migration**
  - Capability: Postpaid-to-prepaid migration journey
  - Capability: Automate postpaid-to-prepaid migration fee application
  - _Entities: ENT-028; Journeys: UJ-028; Requirements: REQ-078_

### Sub-Module: Connection Count Validation
- **Feature: Existing Connection Visibility**
  - Capability: Display existing prepaid/postpaid connection counts before allowing new/converted connection
  - Capability: Connection Details advisory for existing multiple postpaid connections
  - _Entities: ENT-012; Requirements: REQ-231, REQ-184_


## Module: MNP / FNP Porting
### Sub-Module: MNP Port-In
- **Feature: MNP Port-In Order Processing**
  - Capability: MNP port-in postpaid sales front-end journey
  - Capability: MNP postpaid conversion via cross sales (desktop)
  - Capability: MNP postpaid port-in desktop (Ooredoo to Vodafone)
  - Capability: MNP postpaid port-in with add-on (tablet, HRN/expatriate)
  - Capability: MNP prepaid port-in (tablet)
  - Capability: MNP switch journey (IT stack modernization walkthrough)
  - Capability: MNP guided process presents Postpaid/Prepaid choice before data entry
  - Capability: Contact confirmation reflects MOI Validation result before proceeding
  - Capability: Order cancellable at Donor Attachment/CAF stages before submission
  - Capability: CAF form dynamically binds Qatari ID/Passport number field for prepaid subscribers
  - Capability: DNO verification attachment required for MNP port-in order
  - Capability: MNP flow: determine if single signature can legally cover both CAF and MNP form
  - Capability: MNP activation prompt advising customer to send switch SMS to short code 151
  - Capability: Post-signature operational instruction popup (send switch SMS to 151)
  - Capability: MNP form selectable by channel type (MNP-Digital/MNP-Touch Screen)
  - Capability: Reminder SMS automation for MNP
  - Capability: Automated/removed temporary MSISDN for MNP
  - _Entities: ENT-013, ENT-055, ENT-056, ENT-015; Journeys: UJ-014, UJ-068, UJ-069, UJ-070, UJ-071, UJ-094; Requirements: REQ-198, REQ-199, REQ-200, REQ-201, REQ-282, REQ-243, REQ-176, REQ-196, REQ-194, REQ-040, REQ-043_

### Sub-Module: FNP Port-In
- **Feature: FNP Port-In Order/Trouble Ticket Processing**
  - Capability: Fixed number portability port-in journey
  - Capability: Single common journey across submitting channels
  - Capability: Port status visibility for agents/field teams
  - Capability: Automated holiday/Ramadan date calculation
  - Capability: Handover process between order-raising and document-collection teams
  - Capability: Automated FNP preponement/postponement support
  - Capability: Hide FNP capability pending execution-date reliability fix
  - Capability: FNP process diagram needed (gap)
  - Capability: Fixed line port in (BRSD)
  - _Entities: ENT-014; Journeys: UJ-015, UJ-099; Requirements: REQ-041, REQ-042, REQ-044, REQ-045, REQ-046, REQ-087, REQ-263_

### Sub-Module: Post-Port Billing
- **Feature: Post-Port-In Billing and Dunning**
  - Capability: Billing and dunning treatment following successful port-in
  - _Entities: ENT-001, ENT-004; Journeys: UJ-016_

### Sub-Module: Port-Out Handling
- **Feature: MNP/FNP Port-Out Ticket Processing**
  - Capability: Port-out ticket handling for consumer/B2B2C, NPass-driven
  - Capability: MNP port-out trouble ticket variant with NPAS auto-created
  - Capability: Port out ticket processing overview variant
  - Capability: Fixed line port out (BRSD)
  - Capability: Bring NPass MNP/FNP form documents into Siebel via ticket attachment
  - _Entities: ENT-021; Journeys: UJ-018, UJ-026, UJ-100, UJ-110; Requirements: REQ-073_


## Module: Fixed Line / Fibre
### Sub-Module: Fixed Line Activation
- **Feature: New Fixed Line / Broadband Order Creation**
  - Capability: New fixed line/business broadband order journey
  - Capability: Fixed line activation business process walkthrough
  - Capability: Two-phase order completion process for fixed line
  - Capability: Instant activation (fixed line, tablet-only), eligibility detection and device serial verification
  - Capability: Instant activation restricted to tablet channel
  - Capability: Self-serve instant activation
  - Capability: Cross sales to new fixed line activation
  - Capability: New fixed line activation back office fulfilment (skip attachments)
  - Capability: New fixed line desktop triple play (IPTV yes), Project Lusail
  - Capability: New fixed line tablet - prepatched KID, combo box, normal activation with manager approval and correction cycle
  - Capability: New fixed line tablet - prepatched KID, non combo box, normal activation full lifecycle incl. approval
  - Capability: New fixed line tablet - prepatched KID, combo box, instant activation
  - Capability: New fixed line tablet - prepatched KID, combo box, B2B2C, with approval, instant activation
  - Capability: New fixed line tablet - normal activation, order approval rejection and correction
  - Capability: Fiber activation through retail agent (BRSD)
  - Capability: Fiber instant activation (BRSD)
  - Capability: Prepatched device detection prompts Instant vs Normal Activation choice
  - Capability: Prepatched/Non Combo Box detection skips shared-infrastructure selection step
  - Capability: Attachments step may be skipped per named variant
  - Capability: Correct activation date for fixed-line orders
  - Capability: IPTV bundled by default with base plan (removable)
  - Capability: System-enforced fibre-precedence rule
  - Capability: CNAP support (25-character limit)
  - Capability: Store combo box/CPE password for field engineer access
  - Capability: Integrate TR069/TORUS for mesh configuration
  - Capability: Fixed/Fibre activation journey (IT stack modernization walkthrough)
  - Capability: Add installation photo capture to instant activation journey
  - Capability: Do Not Disturb flag when customer refuses service
  - _Entities: ENT-006, ENT-035, ENT-019, ENT-078; Journeys: UJ-002, UJ-010, UJ-031, UJ-034, UJ-035, UJ-045, UJ-046, UJ-047, UJ-049, UJ-050, UJ-053, UJ-054, UJ-055, UJ-096, UJ-097, UJ-095; Requirements: REQ-253, REQ-254, REQ-011, REQ-252, REQ-029, REQ-019, REQ-095, REQ-096, REQ-089, REQ-144, REQ-142, REQ-143, REQ-152_

### Sub-Module: Digital Self-Service Fiber
- **Feature: Digital Fiber Self-Service Activation**
  - Capability: Digital fiber activation Phase 1 self-service (Combo Box/CPE or 5G)
  - Capability: Digital self-service fiber activation journey (Phase 1 key flow)
  - Capability: Duplicate fiber service at same location check (home move lead trigger)
  - Capability: eKYC validation (ID scan + selfie scan) for digital fiber activation
  - Capability: eSign requirement in digital fiber activation flow
  - Capability: Fulfilment routing rule: CPE/ONT vs 5G lead type
  - Capability: Design retail journey as single scrolling flow, not multi-page navigation
  - Capability: Mitigate OCR misread risk on QID number defeating two-factor validation
  - Capability: ID scan enhanced with OCR/capture-in-one-shot
  - _Entities: ENT-006, ENT-035; Journeys: UJ-048; Requirements: REQ-130, REQ-131, REQ-132, REQ-133, REQ-134, REQ-108, REQ-109, REQ-238_

### Sub-Module: Fixed Line Migration & Termination
- **Feature: Fixed Line Migration / FWA-to-Fiber / Termination**
  - Capability: Fixed line migration eligibility/verification/WFM appointment
  - Capability: FWA-to-fiber migration journey
  - Capability: Automate FWA-to-fiber migration (future automation target)
  - Capability: Fixed line migration (BRSD)
  - Capability: Fiber termination (BRSD)
  - Capability: Mandatory fibre migration within 4 weeks of availability notice
  - Capability: Disconnection on declined fibre migration
  - Capability: Fibre outstanding-dues threshold contradiction (gap)
  - _Entities: ENT-006; Journeys: UJ-038, UJ-098, UJ-101; Requirements: REQ-255, REQ-093, REQ-126, REQ-127, REQ-258, REQ-276_

### Sub-Module: Fixed-Line Exception Handling
- **Feature: Order/Installation Exception Handling**
  - Capability: KID-in-use exception handling
  - Capability: Fixed-line installation exception handling (splitter full / BID not mapped)
  - Capability: Move KID-in-use proof requirement to start of journey
  - Capability: ZSP email/address fields validated for presence only, not format (data-quality gap)
  - Capability: Club eligibility (customer/QID + location) checks at one early journey point
  - _Entities: ENT-032, ENT-071; Journeys: UJ-032, UJ-033; Requirements: REQ-084, REQ-091, REQ-083_

### Sub-Module: Address & Service Feasibility
- **Feature: Installation Address and RFS Management**
  - Capability: Installation Address and Service Feasibility Capability
  - Capability: RFS Data Management Capability
  - Capability: Installation address cascading zone/street/building selection
  - Capability: Proof-of-address upload size limit
  - Capability: Address lock after RFS check
  - Capability: Split address line 1 into discrete searchable fields (KID/ZSB)
  - Capability: Maintain address with history across CRM and self-service
  - Capability: RFS data flow from IMS to downstream systems
  - Capability: Fixed line RFS (BRSD)
  - Capability: VFID/KID mapping rule clarification needed
  - Capability: Enterprise/SMB fibre scope gap
  - Capability: GTM data-flow frequency confirmation needed
  - Capability: Provide file structure/sample details for IMS to RPA and RPA to UIM/Siebel
  - Capability: Clarify current operational frequency for UIM/RFS data refresh
  - Capability: Change Siebel feed from full file to delta file
  - Capability: Cluster naming change 1-4 to F1-F4
  - Capability: Drop displaying all KIDs on ZSB page in RFS Portal
  - Capability: FL Address must include KID
  - _Entities: ENT-036, ENT-032, ENT-071, ENT-072, ENT-062; Journeys: UJ-105, UJ-102; Requirements: REQ-247, REQ-248, REQ-249, REQ-250, REQ-251, REQ-097, REQ-098, REQ-260, REQ-261, REQ-259, REQ-287, REQ-288, REQ-289, REQ-290, REQ-291, REQ-283_

### Sub-Module: GigaHome / OSNtv Subscription
- **Feature: GigaHome/OSNtv Lifecycle Management**
  - Capability: GigaHome/OSNtv subscription acceptance and lifecycle
  - Capability: GigaHome Subscription Acceptance Form customer sign-off before activation (v3)
  - Capability: STB replay/scan functionality dropped due to required OSM changes
  - _Entities: ENT-018, ENT-064; Journeys: UJ-017, UJ-052; Requirements: REQ-090_

### Sub-Module: Home Move
- **Feature: Home Move Case Handling**
  - Capability: Home move business process (fiber/5G matrix)
  - Capability: Home move fixed-to-fixed happy path (guided journey, Open UI desktop)
  - Capability: Kahramaa duplicate-installation check during Assess Activity
  - Capability: Fiber-readiness check for home move destination (KID lookup)
  - Capability: Free home move eligibility for first-time movers
  - Capability: Resolve whether home move is new order or modification order
  - _Entities: ENT-060; Journeys: UJ-039, UJ-067; Requirements: REQ-186, REQ-187, REQ-188, REQ-094_

### Sub-Module: Supplementary & Consumer Forms
- **Feature: Digitalized Supplementary/Consumer Forms**
  - Capability: Vodafone Fibre Supplementary Form required for Home Fibre
  - Capability: Digitalize the supplementary form
  - Capability: Digitalized consumer application forms
  - Capability: Signature capture method differs by channel
  - _Entities: ENT-025, ENT-083; Requirements: REQ-115, REQ-088, REQ-305, REQ-306_


## Module: FWA / 5G Home
### Sub-Module: FWA Indoor/Outdoor Activation
- **Feature: New FWA Activation (Desktop, Vanilla/Guided)**
  - Capability: 5G indoor/outdoor (FWA) activation - Enterprise/Business Care variant
  - Capability: New FWA indoor activation - desktop vanilla (manual)
  - Capability: New FWA outdoor dual play activation with WFM installation (desktop vanilla)
  - Capability: New FWA indoor postpaid activation - desktop guided wizard (existing mobile customer)
  - Capability: New FWA postpaid outdoor order (desktop, WFM installation)
  - Capability: New FWA 5G indoor activation (business process, ZSP/stock control)
  - Capability: New FWA 5G outdoor activation (business process, WFM appointment)
  - Capability: Modify FWA indoor CPE serial number
  - Capability: FWA address/SIM/CPE/CAF negative validation scenarios
  - Capability: Vanilla (manual, non-wizard) desktop path supports full FWA activation via Contact->Account->Sales Order->Catalog->Line Items->Numbers->CPE Config
  - Capability: Guided-wizard desktop FWA journey supports existing mobile customer adding new FWA line
  - Capability: Guided wizard multi-step FWA order creation (Contact through Activity)
  - Capability: Fair Usage Policy (FUP) throttling on 5G Home plans
  - Capability: Replace order cancellation with in-place update on outdoor-to-indoor fallback
  - _Entities: ENT-035, ENT-011; Journeys: UJ-011, UJ-036, UJ-037, UJ-056, UJ-057, UJ-058, UJ-059, UJ-060, UJ-061; Requirements: REQ-162, REQ-173, REQ-177, REQ-124, REQ-092_

### Sub-Module: FWA Tablet Channel
- **Feature: New FWA Tablet Order Creation**
  - Capability: New FWA tablet indoor B2B2C order with manager approval
  - Capability: New FWA tablet indoor with manager approval (2+ postpaid connections trigger)
  - Capability: New FWA tablet indoor without approval (2+ postpaid connections, advisory only)
  - Capability: New FWA tablet outdoor B2B2C order creation
  - Capability: New FWA tablet outdoor order through WFM field installation
  - Capability: Required attachment set for B2B2C FWA orders (Proof of Employment, CAF, Supplementary Form)
  - _Entities: ENT-035, ENT-047; Journeys: UJ-062, UJ-063, UJ-064, UJ-065, UJ-066; Requirements: REQ-182_

### Sub-Module: CPE Configuration & Field Fulfilment
- **Feature: CPE Bundle Configuration and Technician Fulfilment**
  - Capability: FMS CPE bundle configuration supports Indoor IDU, ODU, and Outdoor IDU equipment sub-types
  - Capability: WFM appointment booking integrates with Oracle Field Service Cloud for technician scheduling and dispatch
  - Capability: CPE/SIM inventory transferable from warehouse team to assigned technician before installation
  - Capability: Technician completes serial number check (device activation) before service activation succeeds
  - Capability: Field technician captures customer signature at installation checklist and end of activity
  - Capability: CSR can modify installed CPE serial number via Account 360 modify action
  - Capability: CPE attribute modification generates modification-type sales order with attribute-level audit
  - Capability: SIM/CPE serial validation calls backend UIM inventory service in real time
  - Capability: Backend exceptions surface error/service codes and support reference number
  - Capability: Technician inventory import via Excel + Oracle Field Service integration
  - Capability: Technician appointment reassignment (Move) with resource-match indicators
  - Capability: Book unscheduled appointment option with irreversibility warning
  - Capability: Pre-select next available appointment date/slot bounded by SLA cluster
  - Capability: Appointment booking enforces slot capacity limits and shows 'Full' state
  - Capability: Appointment booking cannot be cancelled once confirmed
  - _Entities: ENT-035, ENT-052, ENT-048, ENT-049, ENT-040, ENT-045, ENT-053; Requirements: REQ-163, REQ-164, REQ-165, REQ-166, REQ-167, REQ-168, REQ-169, REQ-171, REQ-172, REQ-179, REQ-180, REQ-185, REQ-161, REQ-086, REQ-138_

### Sub-Module: CAF & Address Validation (FWA)
- **Feature: CAF Generation and Address Validation for FWA**
  - Capability: Address step validates required fields before save
  - Capability: CAF generation offers multiple form types (Digital, Manual, Touch Screen)
  - Capability: System notifies customer that signed CAF copy will be emailed
  - Capability: Digital CAF generation with bilingual EN/AR content and e-signature
  - Capability: ID-based installation contact capture
  - _Entities: ENT-025, ENT-036, ENT-008; Requirements: REQ-170, REQ-174, REQ-175, REQ-178, REQ-027_


## Module: Enterprise / IoT / B2B
### Sub-Module: Enterprise Account Management
- **Feature: Enterprise Account Creation and Structure**
  - Capability: Enterprise account creation journey
  - Capability: Mandatory CR-number search before account creation
  - Capability: Sub-account linking validation
  - Capability: Separate email fields for personal vs corporate contact
  - Capability: Structured privilege identifier replacing free-text job title
  - Capability: Chooser off-boarding process
  - Capability: Performance improvement for large enterprise account/billing profile/CDR pages
  - _Entities: ENT-007, ENT-008; Journeys: UJ-004; Requirements: REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-034_

### Sub-Module: Enterprise Sales & Order Fulfilment
- **Feature: Enterprise Order-to-Billing Flow**
  - Capability: Enterprise sales-to-fulfilment handover
  - Capability: Enterprise order-to-billing flow
  - Capability: Enterprise order journey (vanilla direct)
  - Capability: Enterprise mobility lead-to-order
  - Capability: Quantity propagation to billing (auto-explode) for licence line items
  - Capability: Order form template standardisation and sharing
  - Capability: Migrate account-level products to generic services with service IDs
  - Capability: Quarterly/half-yearly/yearly billing cycles for enterprise products
  - Capability: Enterprise number reservation and number locking
  - _Entities: ENT-006, ENT-012, ENT-039; Journeys: UJ-003, UJ-006, UJ-007, UJ-008; Requirements: REQ-025, REQ-028, REQ-026, REQ-032, REQ-031_

### Sub-Module: Bulk Operations
- **Feature: Bulk Adjustment / Activation / SMS / Numbering**
  - Capability: Bulk adjustment submission (target state)
  - Capability: Bulk activation current-state journey
  - Capability: DXP bulk adjustment portal
  - Capability: Adjustment reason retention beyond BRM purge
  - Capability: Standardised bulk activation templates on DSP with new Oracle bulk utility API
  - Capability: Static IP pool search capability
  - Capability: Bulk number reservation template for DAPN
  - Capability: DAPN activation journey
  - Capability: Bulk SMS onboarding to disconnection
  - Capability: Push to talk (PTT) provisioning
  - _Entities: ENT-002, ENT-010, ENT-017, ENT-074; Journeys: UJ-001, UJ-005, UJ-009, UJ-012, UJ-013; Requirements: REQ-003, REQ-004, REQ-020, REQ-022, REQ-023_

### Sub-Module: Enterprise Invoicing & Export
- **Feature: Enterprise Invoice Presentation and Export Controls**
  - Capability: Enterprise invoice (PDF/Excel) generation
  - Capability: Invoice redesign - banner/table layout fix
  - Capability: Invoice line-item grouping by service ID/circuit ID
  - Capability: PDF/Excel ordering consistency and CDR sorting
  - Capability: Discount line-item presentation correction
  - Capability: Large Excel/CSV export handling
  - Capability: Controlled/governed Excel export feature
  - Capability: Connection count visibility in Siebel and on invoice
  - _Entities: ENT-016; Requirements: REQ-035, REQ-036, REQ-037, REQ-038, REQ-039, REQ-033, REQ-024_

### Sub-Module: B2B2C Employer Association
- **Feature: B2B2C Employer Tagging**
  - Capability: System supports B2B2C employer association at contact creation
  - Capability: B2B2C tagging persists onto Account (Special Management) and Contact (Employer)
  - Capability: System prompts override confirmation when Special Management account attempts non-B2B2C journey
  - _Entities: ENT-047, ENT-038, ENT-037; Requirements: REQ-154, REQ-223, REQ-224_


## Module: Billing & Adjustments
### Sub-Module: Billing Profile Management
- **Feature: Billing Profile Configuration**
  - Capability: Billing profile unchangeable identifier
  - Capability: Billing-in-advance/arrears/hybrid flag
  - Capability: Billing profile/recipient email audit trail
  - Capability: DXP as single consumption layer for CRM-BRM content
  - Capability: Multiple bill email recipients (CC) and multiple email types per contact
  - Capability: Asynchronous email verification before next bill generation
  - Capability: Separate billing-email opt-in requires confirmation modal
  - Capability: Order billing profile must match line items' billing profile
  - Capability: Bill cycle change eligibility must be configurable, not hard-coded
  - Capability: Auto-resolved ticket even on disallowed bill cycle change
  - _Entities: ENT-001; Requirements: REQ-001, REQ-002, REQ-013, REQ-005, REQ-057, REQ-058, REQ-141, REQ-278, REQ-060, REQ-061_

### Sub-Module: Bill Viewing & Simulation
- **Feature: Bill/SOA/Statement Presentation**
  - Capability: Automated SOA from inception
  - Capability: Summarised bill landing view
  - Capability: Bill simulation feature distinct from hot bill
  - Capability: Unbilled usage screen mandatory filters
  - Capability: Bill calculator SMS is a capability, not a full journey
  - _Entities: ENT-003, ENT-004; Requirements: REQ-006, REQ-007, REQ-009, REQ-010, REQ-123_

### Sub-Module: Commitments, Penalties & Discounts
- **Feature: Penalty/Commitment/Discount Calculation**
  - Capability: On-demand penalty/commitment calculation
  - Capability: Volumetric discount proration on mid-cycle change
  - Capability: Volumetric discount auto-downgrade on connection drop
  - Capability: Automate plan penalty, device dues and locking charges calculation
  - _Entities: ENT-005, ENT-009, ENT-066; Requirements: REQ-008, REQ-012, REQ-021, REQ-072_

### Sub-Module: Deposit & Credit Management
- **Feature: Deposit Service Bundle and Credit Limit Handling**
  - Capability: Deposit/credit limit (consumer) handling
  - Capability: Deposit service bundle management
  - _Entities: ENT-059, ENT-075, ENT-030_


## Module: Order Management
### Sub-Module: Order Approval Workflow
- **Feature: Order Approval and Correction**
  - Capability: Manager order approval requires attachment verification (QID front/back + CAF)
  - Capability: Order rejection requires reason selection and drives re-collection of specific fields
  - Capability: System notifies customer via SMS on order rejection and approval
  - Capability: Only one correction round permitted before approval-only re-review
  - Capability: Approve action requires explicit verification acknowledgment
  - Capability: Orders requiring approval must route to a manager queue with assign-to-me
  - Capability: Manager approval screen must expose attachments, order details, activities, and agent details tabs
  - Capability: Approval actions must support approve, reject-correction, and reject-drop order
  - Capability: Order approval screen must show order expiry timestamp
  - Capability: Rejected orders must notify originating agent via SMS with correction instructions
  - Capability: System must provide a dedicated order correction journey/tile
  - Capability: System must prevent dropping an order that has not gone through order approval
  - Capability: Order correction (reject-and-resubmit) journey
  - Capability: Manager approval workflow for flagged orders (multi-journey shared queue)
  - Capability: Rejection reason capture on order rejection
  - _Entities: ENT-046, ENT-042, ENT-006; Journeys: UJ-051; Requirements: REQ-147, REQ-148, REQ-149, REQ-150, REQ-151, REQ-155, REQ-156, REQ-157, REQ-158, REQ-159, REQ-160, REQ-236, REQ-181, REQ-183_

### Sub-Module: Order Lifecycle & Status
- **Feature: Order Status and Completion Notification**
  - Capability: Confirmation message updated to reflect order submission (not activation)
  - Capability: Order completion notification must include order number
  - Capability: Order status must reflect fulfillment progression with per-line status context
  - Capability: Business account cannot submit pending order if open order exists
  - Capability: All payments must be authorized before order proceeds
  - Capability: Serial number required for SIM CARD product
  - _Entities: ENT-006, ENT-077, ENT-039; Requirements: REQ-056, REQ-153, REQ-225, REQ-279, REQ-281, REQ-280_

### Sub-Module: Future Dated Orders
- **Feature: FDO Creation and Lifecycle**
  - Capability: Future dated order (FDO) request creation and lifecycle
  - Capability: FDO raiseable via Open UI (Phase 1) with future channel support (Phase 2)
  - Capability: FDO requests capped at 30 days lead time, cross-stamped with order ID
  - Capability: FDO notifications via SMS/email in English and Arabic, logged as activity
  - Capability: Failed FDOs retry automatically up to 3 times, consolidated into daily ops report
  - _Entities: ENT-068; Journeys: UJ-092; Requirements: REQ-232, REQ-233, REQ-234, REQ-235_


## Module: Identity & Customer Management
### Sub-Module: Identity Validation
- **Feature: ID Document Validation and MOI Integration**
  - Capability: Use MOI API as primary ID-data source with Tarasol/manual fallback
  - Capability: Store all MOI-returned name fields (up to 5-6) and print on bill without truncation
  - Capability: QID scan-and-attach required only for transactions with account/service change
  - Capability: Required ID front/back photo uploads before Contact step continues
  - Capability: Manager-level bypass to edit QID number field only
  - Capability: Enforce mandatory-field validation catalog on contact records
  - _Entities: ENT-081, ENT-033, ENT-037; Requirements: REQ-106, REQ-105, REQ-081, REQ-145, REQ-062, REQ-117_

### Sub-Module: Passport to QID Update
- **Feature: Passport-to-QID Conversion**
  - Capability: Passport to QID update journey
  - Capability: Auto-fetch customer details via MOI Validation after QID entry
  - Capability: Requires scan/upload of QID front & back images before continuing
  - Capability: Identification number change form generated and requires customer e-signature
  - _Entities: ENT-067; Journeys: UJ-076; Requirements: REQ-209, REQ-210, REQ-211_

### Sub-Module: Customer 360
- **Feature: Customer 360 Aggregated View**
  - Capability: Customer 360 journey
  - Capability: Customer 360 single-page tab-based partial refresh
  - Capability: Customer 360 search by customer no / contact no / MSISDN
  - Capability: Customer 360 data aggregation across sources
  - Capability: Customer 360 retrieval actions
  - Capability: Surface indicator of recent My Account app access on agent usage/balance view
  - _Entities: ENT-082, ENT-023; Journeys: UJ-106; Requirements: REQ-050, REQ-292, REQ-293, REQ-294, REQ-082_

### Sub-Module: Consent & Communication Preferences
- **Feature: Contact Consent and Alt-Phone Management**
  - Capability: Direct-marketing consent with USSD opt-out code
  - Capability: Alt. phone # must be a local mobile number used for notifications
  - Capability: Retail cannot change primary contact
  - Capability: ECR Details field restricted to Fulfilment team entry
  - _Entities: ENT-037; Requirements: REQ-116, REQ-140, REQ-122, REQ-139_


## Module: SIM & Number Management
### Sub-Module: SIM Swap
- **Feature: SIM Swap Order Processing**
  - Capability: SIM swap from global search (guided journey, multi-channel)
  - Capability: SIM swap approval (desktop and tablet queues, with rejection)
  - Capability: SIM swap retail/back office/MVA, CBS-validated
  - Capability: Desktop dedicated navigation to view all SIM swap orders and pending SIM swap orders
  - _Entities: ENT-070, ENT-026; Journeys: UJ-020, UJ-090, UJ-091; Requirements: REQ-237_

### Sub-Module: Number Management
- **Feature: MSISDN/Number Selection and Reservation**
  - Capability: Number management portal search experience definition
  - Capability: Auto-select numbers for fixed/prepaid to reduce agent clicks (mobile postpaid excluded)
  - Capability: Star/Free/Reserved number tab selection during number selection step
  - Capability: Plan-price-to-Star-Number-price eligibility matrix required
  - Capability: Number reservation returns confirmable success token (SBL-EXL-00151 code family)
  - Capability: IoT vs Non-IoT MSISDN length validation
  - _Entities: ENT-015, ENT-058; Requirements: REQ-080, REQ-085, REQ-222, REQ-272, REQ-214, REQ-285_

### Sub-Module: Manual Suspension
- **Feature: Voluntary/Manual Suspension ('Park My Number')**
  - Capability: Voluntary/manual suspension plan lifecycle
  - _Entities: ENT-031; Journeys: UJ-021_

### Sub-Module: Transfer of Ownership / Number
- **Feature: TON Case Processing**
  - Capability: TON retail BAU (four-queue routing)
  - Capability: TON trouble ticket variant (prepaid-only, fraud control)
  - Capability: TON claim of ownership (COO)
  - Capability: TON third-party on cancelled ID
  - Capability: Automate approvals for TON via rules rather than human approvers
  - Capability: Automate TON to target 70-80% of cases with business rule engine
  - Capability: Support split payment steps for party A and party B in TON flow
  - Capability: Document exact per-scenario TON validation checks for automation review
  - Capability: Resolve who pays 50 Riyal TON fee (blocking automation)
  - Capability: Resolve WinCash payment sequencing and disconnection trigger timing in TON
  - Capability: Remove reliance on prepaid-migration workaround for TON back-office approval delay
  - _Entities: ENT-022; Journeys: UJ-019, UJ-024, UJ-040, UJ-041; Requirements: REQ-063, REQ-099, REQ-100, REQ-101, REQ-102, REQ-103, REQ-104_


## Module: Trouble Ticketing & Complaints
### Sub-Module: Ticket Creation & Handling
- **Feature: General Trouble Ticket Lifecycle**
  - Capability: Trouble ticket creation and handling (general)
  - Capability: Complaints management process / agent ticket creation
  - Capability: Auto-population of ticket fields from account/MSISDN context
  - Capability: Segregation of requests vs complaints with different SLAs
  - Capability: Enhanced auto-assignment to agent level based on availability
  - Capability: Dynamic ticket LOB management without release dependency
  - Capability: Automatic escalation on ticket delay
  - Capability: Supervisor visibility across all agents' tickets
  - Capability: Make public ticket notes as prominent as bell icon notifications
  - Capability: Direct queue assignment instead of manual ticket export/distribution
  - Capability: Restore Siebel email notification to group mailbox for ticket receipt/timer expiry
  - Capability: Ticket creation journey standardization across channels
  - Capability: Ticket segregation by type
  - Capability: Add notification/template inventory section to roles/journeys Excel
  - Capability: Qnomy Q Ticket fallback handling
  - Capability: Qnomy MPI API spec required
  - Capability: Comments field minimum length validation on Activity Portal
  - _Entities: ENT-020, ENT-079, ENT-069; Journeys: UJ-022, UJ-109; Requirements: REQ-065, REQ-066, REQ-067, REQ-068, REQ-069, REQ-070, REQ-071, REQ-074, REQ-075, REQ-303, REQ-304, REQ-241, REQ-265, REQ-274, REQ-189_

### Sub-Module: Disconnection
- **Feature: Disconnection Ticket Processing**
  - Capability: Disconnection (trouble ticket, retention-first control)
  - Capability: Disconnection ticket processing (retention team closure triggers auto-order)
  - _Entities: ENT-020; Journeys: UJ-025, UJ-111_

### Sub-Module: Data Session Management
- **Feature: End Data Session**
  - Capability: End data session journey
  - _Entities: ENT-024; Journeys: UJ-023_

### Sub-Module: MVA Channel Handling
- **Feature: MVA Request Routing**
  - Capability: Prepaid offshore manual activation by third party
  - Capability: MVA customer-initiated requests routed as reports
  - _Entities: ENT-023; Requirements: REQ-307, REQ-308_


## Module: Access, Roles & Approval Governance
### Sub-Module: Role-Based Access Control
- **Feature: Journey Initiation and Access Governance**
  - Capability: Role/team-based access model replacing Siebel profile-based access
  - Capability: Device/tablet rendering only, not journey governance
  - Capability: Manager-only menu scoped to Home, Order Approval, Manage Leads, Leads Queue
  - Capability: Journey initiation from Agent Desktop with role-based authorisation
  - Capability: In-progress journeys list on agent login page
  - Capability: Draft order/milestone persistence for resume
  - _Entities: ENT-044; Requirements: REQ-054, REQ-055, REQ-204, REQ-264, REQ-053, REQ-266_

### Sub-Module: Payment & Billing Access Controls
- **Feature: Payment Authorization and Regulatory View Restrictions**
  - Capability: Agents view-only for AutoPay status/failure reason (regulatory restriction)
  - Capability: WinCash integration for zero-payment transactions
  - _Entities: ENT-080; Requirements: REQ-059, REQ-049_


## Module: CAF, Attachments & Forms
### Sub-Module: CAF Lifecycle
- **Feature: CAF Generation, Signature and Attachment Management**
  - Capability: E-signature required to complete CAF before order submission
  - Capability: CAF unique serial/ID and naming convention
  - Capability: Configurable business-admin-controlled CAF highlighted T&Cs
  - Capability: System captures customer e-signature as part of CAF completion
  - Capability: CAF attachment upload supports file management (add/delete)
  - Capability: CAF/attachment file size must not exceed ~4MB
  - Capability: Attachments categorized (CAF, QID) with online-only warm-archive retention, no deletion
  - Capability: CAF template matrix by role/channel/service type required
  - Capability: Present key-terms summary (lock-ins, penalties, fencing) before CAF signature
  - Capability: Bilingual (English/Arabic) customer-facing forms
  - Capability: Digital signature pad migration off OpenUI
  - _Entities: ENT-025; Requirements: REQ-146, REQ-048, REQ-052, REQ-227, REQ-215, REQ-242, REQ-240, REQ-273, REQ-239, REQ-129, REQ-047_

### Sub-Module: Activity & Wrap-up
- **Feature: Activity/Wrap-up Recording**
  - Capability: Activity/wrap-up step requires call-disposition metadata and comment
  - Capability: Complex product (bundle) customization/runtime instantiation UI
  - Capability: Add-on/Discount step must clearly indicate empty state when nothing applicable
  - _Entities: ENT-069; Requirements: REQ-216, REQ-217, REQ-221_


## Module: Platform Governance & Architecture
### Sub-Module: Delivery & Traceability Governance
- **Feature: CRM Journey Catalog and Traceability Model**
  - Capability: 165-row CRM journey/feature inventory classified into 5 Type categories
  - Capability: Guided Journey vs Vanilla Action classification for CRM journeys
  - Capability: Traceability model requirement: User journey to Access/Permission hierarchy
  - Capability: Screen-count estimation model for stack modernization delivery (1,991 total screens)
  - Capability: Requirement status/owner/traceability missing (governance gap)
  - Capability: No non-functional requirements documented (gap)
  - Capability: Acceptance criteria updates for 18 named requirements (v2.0)
  - Capability: Field-level spec gaps to be supplied by VFQ
  - Capability: Notification templates/triggers/recipients required
  - Capability: HRN advance payment matrix required
  - Capability: Outstanding-dues threshold confirmation by Collections
  - Capability: Mobile Postpaid BRSD baseline dependency
  - _Entities: ENT-061, ENT-062, ENT-063; Requirements: REQ-120, REQ-119, REQ-121, REQ-118, REQ-257, REQ-256, REQ-267, REQ-271, REQ-275, REQ-277, REQ-276, REQ-262_

### Sub-Module: Platform Design Principles
- **Feature: DXP Architecture and Integration Principles**
  - Capability: Design of new stack must be business-driven rather than technology-driven
  - Capability: ECR to be decommissioned and not integrated with new stack; MCCR absorbed; VSA/BSA out of scope
  - Capability: Consumer segment completed before enterprise segment in delivery sequencing
  - Capability: Screens align to PIP pre-built APIs rather than new custom APIs
  - Capability: Build reusable capability building blocks exposed via DXP layer
  - Capability: Catalogue/eligibility/discount/number-pricing rules as configuration not hard-coded
  - Capability: Siebel CRM remains system of record
  - Capability: Existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change
  - Capability: Notification and Feedback Capability
  - Capability: Mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)
  - _Entities: ENT-082; Requirements: REQ-244, REQ-245, REQ-246, REQ-051, REQ-110, REQ-268, REQ-269, REQ-270, REQ-286, REQ-112_


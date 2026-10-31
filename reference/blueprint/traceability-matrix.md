# Requirement Traceability & Reverse Traceability Matrix (Phases 34 & 35)

Requirement → Journey / Screen / Business Rule / Persona, and the reverse, derived deterministically from the Stage A/B synthesized catalogues: module-hierarchy feature co-occurrence (requirements and journeys grouped under the same Feature in `module-hierarchy.md`), keyword-overlap matching against requirement name/description text for business rules, and fuzzy name matching against each requirement's own `related_screens`/`related_personas`/`related_workflows` free text for screens/personas. No new document reads or LLM judgment calls were used for this file — it's a mechanical join over already-evidenced data.

**Two known coarseness caveats:** (1) Module-hierarchy features that bundle several requirements with several journeys (e.g. a shared "Bulk Operations" feature) link ALL requirements in that feature to ALL journeys in it, all-pairs — not every requirement necessarily applies to every one of those journeys individually, just to the shared feature area. (2) An earlier version of this join used "shares a source document" as the requirement↔rule link signal and produced a false-positive explosion (heavily-sourced requirements picked up nearly every rule from the same broad topic area); it was replaced with keyword-overlap on name/description text, which is more precise but will still miss rules that are genuinely related but wordy differently.

**Note on the pre-existing `data/Vodafone_Requirement_Hierarchy_Traceability_Template.xlsx`:** that workbook was built independently in an earlier session directly from `CRM_Journeys_Final_Updated_with_Type.xlsx`'s own Relationship-sheet analysis, using its own ID scheme (TP-xxxx/WF-xxx/TSK-xxx/ACT-xxx/PERM-xxx) across 815 traceability rows, 500 requirement-inventory rows, and 300 gap-log rows. It is **not** extended in-place here — merging it with this blueprint's REQ-xxx/UJ-xxx/BR-xxx IDs would require a dedicated cross-mapping exercise between the two independently-derived ID schemes, not a simple append. This file uses the blueprint's own consistent IDs instead; reconciling the two is flagged as a Stage C gap (see `gap-analysis.md`).

---
**Coverage:** 295 of 308 requirements (96%) have at least one deterministic link to a journey, screen, rule, or persona. The remaining 13 are the 'orphan requirements' enumerated in `gap-analysis.md`.


## Forward Traceability: Requirement → Journey / Screen / Rule / Persona

### REQ-001: Billing Profile Unchangeable Identifier
- **Screens:** SCR-186 (Billing Profile grid (account level))
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-008 (Billing Profile Unchangeable Correlation ID Requirement), BR-321 (ALP account existence / default billing profile cross-check), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-002: Billing-in-Advance/Arrears/Hybrid Flag
- **Personas:** PERSONA-006 (Credit Control / Collection & Credit Control)

### REQ-003: DXP Bulk Adjustment Portal
- **Journeys:** UJ-001 (Bulk Adjustment Submission (Target State)), UJ-013 (Bulk SMS Onboarding to Disconnection), UJ-009 (Push to Talk (PTT) Provisioning), UJ-005 (Bulk Activation (Current State)), UJ-012 (DAPN Activation)
- **Screens:** SCR-001 (Bulk Adjustment Portal (DXP, Target State))
- **Personas:** PERSONA-017 (Manager/Approver (Delegation of Authority / DOA hierarchy))

### REQ-004: Adjustment Reason Retention Beyond BRM Purge
- **Journeys:** UJ-001 (Bulk Adjustment Submission (Target State)), UJ-013 (Bulk SMS Onboarding to Disconnection), UJ-009 (Push to Talk (PTT) Provisioning), UJ-005 (Bulk Activation (Current State)), UJ-012 (DAPN Activation)
- **Business rules:** BR-009 (BRM 6-Plus-1 Event Purge Policy)

### REQ-006: Automated SOA From Inception
- **Screens:** SCR-003 (Statement of Account (SOA) View)
- **Business rules:** BR-010 (SOA From-Inception Display Rule)

### REQ-007: Summarised Bill Landing View
- **Screens:** SCR-004 (Bill Landing View)

### REQ-008: On-Demand Penalty/Commitment Calculation
- **Business rules:** BR-011 (Penalty Calculation Trigger Restriction), BR-002 (OSNtv Termination Penalty Calculation)

### REQ-009: Bill Simulation Feature Distinct from Hot Bill
- **Business rules:** BR-012 (Bill Simulation Not a Tax Invoice Disclosure Rule)

### REQ-010: Unbilled Usage Screen Mandatory Filters
- **Screens:** SCR-006 (Unbilled Usage Screen)
- **Business rules:** BR-013 (Unbilled Usage Screen Mandatory Filter Rule)

### REQ-011: Correct Activation Date for Fixed-Line Orders
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-305 (Fixed Line address KID requirement), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed))
- **Personas:** PERSONA-004 (Fulfilment Agent / Fulfilment Team)

### REQ-012: Volumetric Discount Proration on Mid-Cycle Change
- **Business rules:** BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-025 (Volumetric Discount Minimum Threshold Rule), BR-015 (Volumetric Discount Proration Rule)

### REQ-013: Billing Profile / Recipient Email Audit Trail
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-008 (Billing Profile Unchangeable Correlation ID Requirement), BR-067 (Audit Trail Role-Restricted from Agents), BR-321 (ALP account existence / default billing profile cross-check), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-014: Mandatory CR-Number Search Before Account Creation
- **Journeys:** UJ-004 (Enterprise Account Creation)
- **Screens:** SCR-007 (Account Creation Screen)
- **Business rules:** BR-017 (Mandatory CR-Number Search Before Account Creation), BR-098 (KID mandatory search-only lookup), BR-302 (SIM Card serial number mandatory), BR-079 (Security Question Mandatory Set (QID + Account/Holder Name)), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-198 (Serial Number Check Required Before Service Activation)
- **Personas:** PERSONA-004 (Fulfilment Agent / Fulfilment Team)

### REQ-015: Sub-Account Linking Validation
- **Journeys:** UJ-004 (Enterprise Account Creation)

### REQ-016: Separate Email Fields for Personal vs Corporate Contact
- **Journeys:** UJ-004 (Enterprise Account Creation)
- **Screens:** SCR-150 (Contact record - Leads sub-tab)

### REQ-017: Structured Privilege Identifier (Replace Free-Text Job Title)
- **Journeys:** UJ-004 (Enterprise Account Creation)

### REQ-018: Chooser Off-Boarding Process
- **Journeys:** UJ-004 (Enterprise Account Creation)

### REQ-019: CNAP Support (25-Character Limit)
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)

### REQ-020: Standardised Bulk Activation Templates on DSP with New Oracle Bulk Utility API
- **Journeys:** UJ-001 (Bulk Adjustment Submission (Target State)), UJ-013 (Bulk SMS Onboarding to Disconnection), UJ-009 (Push to Talk (PTT) Provisioning), UJ-005 (Bulk Activation (Current State)), UJ-012 (DAPN Activation)
- **Screens:** SCR-009 (Bulk Activation Control Sheet (Excel Macro, Current State))
- **Business rules:** BR-027 (Bulk Activation Identical-Parameters Constraint)
- **Personas:** PERSONA-004 (Fulfilment Agent / Fulfilment Team)

### REQ-021: Volumetric Discount Auto-Downgrade on Connection Drop
- **Business rules:** BR-199 (100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection), BR-025 (Volumetric Discount Minimum Threshold Rule), BR-015 (Volumetric Discount Proration Rule)

### REQ-022: Static IP Pool Search Capability
- **Journeys:** UJ-001 (Bulk Adjustment Submission (Target State)), UJ-013 (Bulk SMS Onboarding to Disconnection), UJ-009 (Push to Talk (PTT) Provisioning), UJ-005 (Bulk Activation (Current State)), UJ-012 (DAPN Activation)

### REQ-023: Bulk Number Reservation Template for DAPN
- **Journeys:** UJ-001 (Bulk Adjustment Submission (Target State)), UJ-013 (Bulk SMS Onboarding to Disconnection), UJ-009 (Push to Talk (PTT) Provisioning), UJ-005 (Bulk Activation (Current State)), UJ-012 (DAPN Activation)
- **Business rules:** BR-248 (Number reservation blocks number for reserving agent), BR-267 (Number reservation generates a unique reservation token), BR-075 (Direct Number Reservation from Siebel Generally Disallowed), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-183 (Free Number Reservation Priced at QR0.00), BR-235 (SIM Serial entry triggers number reservation check)

### REQ-024: Connection Count Visibility in Siebel and on Invoice
- **Business rules:** BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown))

### REQ-025: Quantity Propagation to Billing (Auto-Explode) for Licence Line Items
- **Journeys:** UJ-006 (Enterprise/IoT Order-to-Billing Flow), UJ-007 (Enterprise Order Journey (Vanilla Direct)), UJ-003 (Enterprise Sales-to-Fulfilment Handover), UJ-008 (Enterprise Mobility Lead-to-Order)
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-033 (Discount Presentation as Two Line Items Rule)

### REQ-026: Migrate Account-Level Products to Generic Services with Service IDs
- **Journeys:** UJ-006 (Enterprise/IoT Order-to-Billing Flow), UJ-007 (Enterprise Order Journey (Vanilla Direct)), UJ-003 (Enterprise Sales-to-Fulfilment Handover), UJ-008 (Enterprise Mobility Lead-to-Order)
- **Business rules:** BR-048 (FNP Conditional Acceptance at Service Level (unbilled amounts trigger)), BR-315 (Account-level APN uniqueness), BR-316 (Deposit Service Bundle one-per-account rule)

### REQ-027: ID-Based Installation Contact Capture
- **Journeys:** UJ-007 (Enterprise Order Journey (Vanilla Direct))
- **Screens:** SCR-017 (Siebel Order Creation Screen (MNP))
- **Personas:** PERSONA-011 (Technical Contact)

### REQ-028: Order Form Template Standardisation and Sharing
- **Journeys:** UJ-006 (Enterprise/IoT Order-to-Billing Flow), UJ-007 (Enterprise Order Journey (Vanilla Direct)), UJ-003 (Enterprise Sales-to-Fulfilment Handover), UJ-008 (Enterprise Mobility Lead-to-Order)

### REQ-029: System-Enforced Fibre-Precedence Rule
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-028 (Fibre Precedence Over 5G Rule)

### REQ-030: Enterprise Lead Management and Account Manager Task Tracking
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-265 (Special Management account flag triggers B2B2C override prompt)
- **Personas:** PERSONA-002 (Account Manager)

### REQ-031: Enterprise Number Reservation and Number Locking
- **Journeys:** UJ-006 (Enterprise/IoT Order-to-Billing Flow), UJ-007 (Enterprise Order Journey (Vanilla Direct)), UJ-003 (Enterprise Sales-to-Fulfilment Handover), UJ-008 (Enterprise Mobility Lead-to-Order)
- **Business rules:** BR-248 (Number reservation blocks number for reserving agent), BR-267 (Number reservation generates a unique reservation token), BR-075 (Direct Number Reservation from Siebel Generally Disallowed), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-183 (Free Number Reservation Priced at QR0.00), BR-235 (SIM Serial entry triggers number reservation check)

### REQ-032: Quarterly/Half-Yearly/Yearly Billing Cycles for Enterprise Products
- **Journeys:** UJ-006 (Enterprise/IoT Order-to-Billing Flow), UJ-007 (Enterprise Order Journey (Vanilla Direct)), UJ-003 (Enterprise Sales-to-Fulfilment Handover), UJ-008 (Enterprise Mobility Lead-to-Order)
- **Business rules:** BR-035 (Enterprise Quarterly/Half-Yearly/Yearly Billing Ask)

### REQ-033: Controlled/Governed Excel Export Feature
- **Screens:** SCR-073 (Account Summary (Installed Assets and Orders))

### REQ-034: Performance Improvement for Large Enterprise Account/Billing Profile/CDR Pages
- **Journeys:** UJ-004 (Enterprise Account Creation)
- **Screens:** SCR-095 (Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View)
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-008 (Billing Profile Unchangeable Correlation ID Requirement), BR-321 (ALP account existence / default billing profile cross-check), BR-035 (Enterprise Quarterly/Half-Yearly/Yearly Billing Ask), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-035: Invoice Redesign - Banner/Table Layout Fix
- **Screens:** SCR-014 (Enterprise Invoice (PDF))

### REQ-036: Invoice Line-Item Grouping by Service ID/Circuit ID
- **Screens:** SCR-014 (Enterprise Invoice (PDF))
- **Business rules:** BR-032 (Excel One-Million-Line-Item Limit / 400k Email Threshold)

### REQ-037: PDF/Excel Ordering Consistency and CDR Sorting
- **Screens:** SCR-014 (Enterprise Invoice (PDF))

### REQ-038: Discount Line-Item Presentation Correction
- **Screens:** SCR-014 (Enterprise Invoice (PDF))
- **Business rules:** BR-033 (Discount Presentation as Two Line Items Rule), BR-032 (Excel One-Million-Line-Item Limit / 400k Email Threshold)

### REQ-040: Reminder SMS Automation for MNP
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-296 (MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)), BR-037 (MNP Consent SMS 24-Hour Rule)

### REQ-041: Single Common Journey Across Submitting Channels
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End)

### REQ-042: Port Status Visibility for Agents/Field Teams
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End)
- **Screens:** SCR-017 (Siebel Order Creation Screen (MNP))
- **Business rules:** BR-343 (MNP Port Out Activity Validation and Auto Status Change)
- **Personas:** PERSONA-004 (Fulfilment Agent / Fulfilment Team)

### REQ-043: Automated/Removed Temporary MSISDN for MNP
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-046 (MNP Reserved Temporary MSISDN Rule)

### REQ-044: Automated Holiday/Ramadan Date Calculation
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End)

### REQ-045: Handover Process Between Order-Raising and Document-Collection Teams
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End)
- **Personas:** PERSONA-004 (Fulfilment Agent / Fulfilment Team)

### REQ-046: Automated FNP Preponement/Postponement Support
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD))

### REQ-047: Digital signature pad migration off OpenUI
- **Journeys:** UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state))
- **Screens:** SCR-019 (CAF (Customer Application Form) tablet signature view)
- **Business rules:** BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity)

### REQ-048: CAF unique serial/ID and naming convention
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))

### REQ-049: WinCash integration for zero-payment transactions
- **Screens:** SCR-036 (Checkout Screen (Retail New Postpaid))
- **Business rules:** BR-339 (Payment Capture via WinCash for Suspension/Resume Orders)

### REQ-050: Customer 360 single-page tab-based partial refresh
- **Journeys:** UJ-106 (J017: Customer 360)

### REQ-051: Screens align to PIP pre-built APIs rather than new custom APIs
- **Business rules:** BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate)

### REQ-052: Configurable business-admin-controlled CAF highlighted T&Cs
- **Journeys:** UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state))
- **Screens:** SCR-069 (Customer Application Form (CAF) Preview/Sign)
- **Business rules:** BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product)

### REQ-054: Role/team-based access model replacing Siebel profile-based access
- **Business rules:** BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team)), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team)

### REQ-055: Device/tablet rendering only, not journey governance
- **Business rules:** BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-057: Multiple bill email recipients (CC) and multiple email types per contact
- **Business rules:** BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product)

### REQ-059: Agents view-only for AutoPay status/failure reason (regulatory restriction)
- **Business rules:** BR-278 (FDO modification/cancellation only allowed while status is Initial), BR-007 (Personal-Use-Only Restriction), BR-050 (Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only))

### REQ-060: Bill cycle change eligibility must be configurable, not hard-coded
- **Business rules:** BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product)

### REQ-061: Auto-resolved ticket even on disallowed bill cycle change
- **Business rules:** BR-343 (MNP Port Out Activity Validation and Auto Status Change), BR-341 (Disconnection Ticket Closure Auto-Creates Disconnection Order), BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-346 (Ticket Auto-Assignment to Queue), BR-049 (MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-055 (Bill Cycle Change Restricted to Billing Team Role)

### REQ-062: Manager-level bypass to edit QID number field only
- **Journeys:** UJ-020 (SIM Swap (Retail/Back Office/MVA, CBS-validated))
- **Business rules:** BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-230 (Donor Operator Field Is Read-Only/Derived, Not Agent-Editable), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-058 (Manager QID Bypass Field Restriction), BR-156 (ECR Details field is Fulfilment-team-only), BR-124 (Reserved number 90-day hold pending QID submission), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-063: Automate approvals for TON via rules rather than human approvers
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-053 (SIM Swap on TON Success + Mandatory Approvals)

### REQ-064: Regulatory requirement: commitment period continues across plan upgrade
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)
- **Business rules:** BR-061 (Star Number Port-Out Control (commitment-period block)), BR-289 (Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan), BR-063 (Commitment Period Continuity on Plan Upgrade (regulatory)), BR-188 (FWA/GigaHome Plan Minimum Subscription Period of 3 Months)

### REQ-065: Auto-population of ticket fields from account/MSISDN context
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-346 (Ticket Auto-Assignment to Queue), BR-049 (MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-341 (Disconnection Ticket Closure Auto-Creates Disconnection Order)

### REQ-066: Segregation of requests vs complaints with different SLAs
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-067: Enhanced auto-assignment to agent level based on availability
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-068 (Unsubmitted Ticket Does Not Route to Queue), BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back), BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-346 (Ticket Auto-Assignment to Queue), BR-049 (MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-341 (Disconnection Ticket Closure Auto-Creates Disconnection Order)

### REQ-068: Dynamic ticket LOB management without release dependency
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-264 (B2B2C without pre-existing Special Management completes without approval)

### REQ-069: Automatic escalation on ticket delay
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-070: Supervisor visibility across all agents' tickets
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-071: Make public ticket notes as prominent as bell icon notifications
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-072: Automate plan penalty, device dues and locking charges calculation
- **Journeys:** UJ-110 (MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant))
- **Business rules:** BR-011 (Penalty Calculation Trigger Restriction), BR-002 (OSNtv Termination Penalty Calculation)

### REQ-073: Bring NPass MNP/FNP form documents into Siebel via ticket attachment
- **Journeys:** UJ-100 (Fixed Line Port Out (BRSD)), UJ-110 (MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant)), UJ-026 (MNP Port-Out (Trouble Ticket variant, NPAS auto-created)), UJ-018 (MNP/FNP Port-Out Ticket Handling (Consumer/B2B2C, NPass-driven))
- **Business rules:** BR-049 (MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)), BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-304 (MNP Port-In DNO verification attachment requirement), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team)

### REQ-074: Direct queue assignment instead of manual ticket export/distribution
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-068 (Unsubmitted Ticket Does Not Route to Queue), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-346 (Ticket Auto-Assignment to Queue)

### REQ-075: Restore Siebel email notification to group mailbox for ticket receipt/timer expiry
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-197 (CAF Email Notification to Customer), BR-214 (Order Expiry SLA Timer on Pending Approval)

### REQ-076: Add real upgrade/downgrade differentiation logic
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)

### REQ-077: Automate prepaid-to-postpaid migration eligibility checks
- **Journeys:** UJ-027 (Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)), UJ-085 (Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)), UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection), UJ-088 (Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)), UJ-087 (Prepaid to Postpaid Migration — Autobase (system-recommended offer))
- **Business rules:** BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-340 (Prepaid Channel Migration: ECR to VSA), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-113 (Postpaid eligibility based on collection/blacklist status, not outstanding amount)

### REQ-078: Automate postpaid-to-prepaid migration fee application
- **Journeys:** UJ-028 (Postpaid-to-Prepaid Migration)
- **Business rules:** BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-340 (Prepaid Channel Migration: ECR to VSA), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid))

### REQ-079: System control preventing agents from selecting any credit limit value
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-018 (Enterprise Credit Limit Approval Rule), BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-255 (Credit Limit override persists back to account record), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-254 (Agent-editable Credit Limit from a preset value list), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-080: Number management portal search experience definition
- **Journeys:** UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state))
- **Screens:** SCR-067 (New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion))
- **Business rules:** BR-017 (Mandatory CR-Number Search Before Account Creation), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit))

### REQ-081: QID scan-and-attach required only for transactions with account/service change
- **Business rules:** BR-077 (QID Physical Presence and Scan Requirement for Retail Transactions), BR-316 (Deposit Service Bundle one-per-account rule), BR-078 (ID Attachment Exemption for No-Change Transactions), BR-079 (Security Question Mandatory Set (QID + Account/Holder Name)), BR-198 (Serial Number Check Required Before Service Activation)

### REQ-082: Surface indicator of recent My Account app access on agent usage/balance view
- **Journeys:** UJ-106 (J017: Customer 360)
- **Business rules:** BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission))

### REQ-083: Club eligibility (customer/QID + location) checks at one early journey point
- **Journeys:** UJ-032 (KID-in-Use Exception Handling), UJ-033 (Fixed-Line Installation Exception Handling (Splitter Full / BID Not Mapped))
- **Business rules:** BR-148 (Free-months offer once-per-QID eligibility rule), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed))

### REQ-084: Move KID-in-use proof requirement to start of journey
- **Journeys:** UJ-032 (KID-in-Use Exception Handling), UJ-033 (Fixed-Line Installation Exception Handling (Splitter Full / BID Not Mapped))
- **Business rules:** BR-082 (KID-in-Use Mandatory Order Task and Contract Attachment), BR-222 (KID Eligibility Check for Home Move During Assess Activity)

### REQ-085: Auto-select numbers for fixed/prepaid to reduce agent clicks (mobile postpaid excluded)
- **Business rules:** BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal)), BR-108 (Expat passport holders limited to prepaid, max 5 numbers), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-099 (ZSB mandatory for FWA/fixed only, not mobile)

### REQ-086: Pre-select next available appointment date/slot bounded by SLA cluster
- **Business rules:** BR-193 (Appointment Booking Capacity/Slot Full Rule)

### REQ-087: Hide FNP capability pending execution-date reliability fix
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD))
- **Business rules:** BR-085 (FNP Hidden Pending Fix (execution date unreliable))

### REQ-088: Digitalize the supplementary form
- **Business rules:** BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-089: Add installation photo capture to instant activation journey
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-324 (Instant Activation restricted to tablet channel), BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-089 (Self-Serve Instant Activation Restricted to Standard Customers), BR-166 (Instant Activation Bypasses Appointment Booking)

### REQ-090: STB replay/scan functionality dropped due to required OSM changes
- **Journeys:** UJ-017 (GigaHome/OSNtv Subscription Acceptance and Lifecycle), UJ-052 (GigaHome Subscription Acceptance Form (customer sign-off before activation, v3))

### REQ-091: ZSP email/address fields validated for presence only, not format (data-quality gap)
- **Journeys:** UJ-032 (KID-in-Use Exception Handling), UJ-033 (Fixed-Line Installation Exception Handling (Splitter Full / BID Not Mapped))
- **Business rules:** BR-136 (Email format validation), BR-174 (Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)), BR-195 (Address Required Fields Before Saving), BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion)

### REQ-092: Replace order cancellation with in-place update on outdoor-to-indoor fallback
- **Journeys:** UJ-037 (New FWA 5G Outdoor Activation (Business Process, WFM appointment)), UJ-060 (New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)), UJ-058 (Modify FWA Indoor CPE Serial Number), UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-036 (New FWA 5G Indoor Activation (Business Process, ZSP/stock control)), UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual)), UJ-057 (New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)), UJ-061 (New FWA Postpaid Outdoor Order (Desktop, WFM installation))
- **Business rules:** BR-092 (FWA Outdoor Install Fallback to Indoor), BR-100 (Address change creates new record with history, no in-place update)

### REQ-093: Automate FWA-to-fiber migration (future automation target)
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-094 (FWA-to-Fiber Automatic Migration Rule (stated but not implemented)), BR-088 (Fiber-First Selling Policy for FWA)

### REQ-094: Resolve whether home move is new order or modification order
- **Journeys:** UJ-039 (Home Move (Business Process, fiber/5G matrix)), UJ-067 (Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop))
- **Business rules:** BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-147 (LAN cabling / Home Move fee calculation)

### REQ-095: Store combo box/CPE password for field engineer access
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-163 (Prepatched Non Combo Box topology skips shared-infrastructure step), BR-097 (Combo Box Password Confidentiality)

### REQ-096: Integrate TR069/TORUS for mesh configuration
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)

### REQ-097: Split address line 1 into discrete searchable fields (KID/ZSB) without disrupting existing processes
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-195 (Address Required Fields Before Saving), BR-264 (B2B2C without pre-existing Special Management completes without approval), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-174 (Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)), BR-305 (Fixed Line address KID requirement)

### REQ-098: Maintain address with history (consistent between CRM and self-service)
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-100 (Address change creates new record with history, no in-place update)

### REQ-099: Automate TON to target 70-80% of cases with business rule engine
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))

### REQ-100: Support split payment steps for party A and party B in TON flow
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-105 (TON pre-validate collection status before flow entry)

### REQ-101: Document exact per-scenario TON validation checks for automation review
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-104 (TON age validation (must not be a minor))

### REQ-102: Resolve who pays 50 Riyal TON fee (blocking automation)
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal))

### REQ-103: Resolve WinCash payment sequencing and disconnection trigger timing in TON
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-052 (TON Null/Blank Number Price CDM Queue Trigger (legacy gap)), BR-339 (Payment Capture via WinCash for Suspension/Resume Orders)

### REQ-104: Remove reliance on prepaid-migration workaround for TON back-office approval delay
- **Journeys:** UJ-019 (Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)), UJ-024 (Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)), UJ-041 (Transfer of Number (TON) — Third-party on Cancelled ID), UJ-040 (Transfer of Number (TON) — Claim of Ownership (COO))
- **Business rules:** BR-062 (TON Four Sequential Approval Fraud Control (prepaid-only)), BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-340 (Prepaid Channel Migration: ECR to VSA), BR-243 (Admin/back-office role has additional Reject and Retire actions on leads), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal))

### REQ-105: Store all MOI-returned name fields (up to 5-6) and print on bill without truncation
- **Journeys:** UJ-042 (New Postpaid Connection (Retail Channel Activation))
- **Screens:** SCR-190 (New Prepaid Tablet — Step 1 Contact (ID capture))

### REQ-106: Use MOI API as primary ID-data source with Tarasol/manual fallback
- **Business rules:** BR-109 (MOI data precedence with secondary-parameter cross-check)

### REQ-107: Create virtual/dummy SKUs for digital eSIM to avoid inventory depletion
- **Journeys:** UJ-043 (Consumer Prepaid Activation (ECR/Open UI/VSA, multi-channel)), UJ-089 (New Prepaid Connection — Open UI Tablet)
- **Business rules:** BR-116 (Digital eSIM requires dummy/virtual SKU with no inventory depletion)

### REQ-108: Design retail journey as single scrolling flow, not multi-page navigation
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-054 (Bill Medium Default (Detailed for Consumer, Summary PDF for Enterprise)), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey)

### REQ-109: Mitigate OCR misread risk on QID number defeating two-factor validation
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-288 (Max two postpaid mobiles per expat QID (business rule, though technically five allowed)), BR-124 (Reserved number 90-day hold pending QID submission), BR-131 (Cellular phone number format validation (974 prefix, 11 digits))

### REQ-111: Passport without customer signature exception (Prepaid activation, ref 2.1.13)
- **Journeys:** UJ-043 (Consumer Prepaid Activation (ECR/Open UI/VSA, multi-channel)), UJ-089 (New Prepaid Connection — Open UI Tablet)
- **Business rules:** BR-118 (Age limit 18+ for Prepaid with minor exception process), BR-108 (Expat passport holders limited to prepaid, max 5 numbers), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-119 (Passport without customer signature exception (v8.0))

### REQ-112: Mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)
- **Journeys:** UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet))
- **Screens:** SCR-190 (New Prepaid Tablet — Step 1 Contact (ID capture))
- **Business rules:** BR-099 (ZSB mandatory for FWA/fixed only, not mobile)

### REQ-113: Postpaid registration rejection handled directly by Fulfilment (no email round-trip)
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-162 (Single correction round-trip rule (no second Reject-Correction))

### REQ-114: Real-time Prepaid ECR/Siebel activation
- **Journeys:** UJ-043 (Consumer Prepaid Activation (ECR/Open UI/VSA, multi-channel)), UJ-089 (New Prepaid Connection — Open UI Tablet)
- **Business rules:** BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-340 (Prepaid Channel Migration: ECR to VSA)

### REQ-115: Vodafone Fibre Supplementary Form required for Home Fibre
- **Journeys:** UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet))
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-099 (ZSB mandatory for FWA/fixed only, not mobile), BR-169 (B2B2C Order Requires Proof of Employment Attachment), BR-082 (KID-in-Use Mandatory Order Task and Contract Attachment), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-313 (Bulk SMS mandatory attachment rule), BR-263 (Proof of Employment mandatory for B2B2C attachments), BR-128 (Home Fibre and GigaHome/5G Home require supplementary signed forms), BR-150 (Mandatory Fibre migration within 4 weeks / disconnection rule), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-116: Direct-marketing consent with USSD opt-out code
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))

### REQ-117: Enforce mandatory-field validation catalog on contact records
- **Business rules:** BR-234 (MOI Validation required/auto-triggered for Contact confirmation), BR-167 (Get IPTV Mandatory Field on Contact Step)

### REQ-119: Guided Journey vs Vanilla Action classification for CRM journeys
- **Business rules:** BR-144 (86.7% of CRM feature rows lack a confident User Journey parent), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission))

### REQ-120: 165-row CRM journey/feature inventory classified into 5 Type categories
- **Business rules:** BR-144 (86.7% of CRM feature rows lack a confident User Journey parent), BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission))

### REQ-121: Traceability model requirement: User Journey to Access/Permission hierarchy
- **Business rules:** BR-144 (86.7% of CRM feature rows lack a confident User Journey parent), BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission))

### REQ-122: Retail cannot change primary contact
- **Journeys:** UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection)
- **Screens:** SCR-190 (New Prepaid Tablet — Step 1 Contact (ID capture))
- **Business rules:** BR-141 (Retail cannot change primary contact)

### REQ-123: Bill calculator SMS is a capability, not a full journey
- **Journeys:** UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection)
- **Screens:** SCR-040 (CRM Open UI Desktop Home Page)
- **Business rules:** BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-142 (Bill calculator SMS is a capability, not a journey)

### REQ-124: Fair Usage Policy (FUP) throttling on 5G Home plans
- **Journeys:** UJ-037 (New FWA 5G Outdoor Activation (Business Process, WFM appointment)), UJ-060 (New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)), UJ-058 (Modify FWA Indoor CPE Serial Number), UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-036 (New FWA 5G Indoor Activation (Business Process, ZSP/stock control)), UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual)), UJ-057 (New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)), UJ-061 (New FWA Postpaid Outdoor Order (Desktop, WFM installation))
- **Business rules:** BR-145 (GigaHome Fair Usage Policy throttle rule)

### REQ-125: Plan and device lock-in with early termination penalty calculation
- **Journeys:** UJ-030 (Device Installment (DOI) - Retail and Telesales)
- **Business rules:** BR-011 (Penalty Calculation Trigger Restriction), BR-289 (Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan), BR-002 (OSNtv Termination Penalty Calculation), BR-146 (GigaHome lock-in and early-termination fee calculation), BR-095 (Device Lock-In Period (12 months))

### REQ-126: Mandatory Fibre migration within 4 weeks of availability notice
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-150 (Mandatory Fibre migration within 4 weeks / disconnection rule)

### REQ-127: Disconnection on declined Fibre migration
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-150 (Mandatory Fibre migration within 4 weeks / disconnection rule), BR-001 (Fibre 12-Month Lock-in Disconnection Fee)

### REQ-128: One-time-per-QID free-months offer restriction
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-312 (Bulk SMS one-active-per-account rule), BR-148 (Free-months offer once-per-QID eligibility rule), BR-058 (Manager QID Bypass Field Restriction), BR-316 (Deposit Service Bundle one-per-account rule), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-005 (Kahramaa ID One-Offer-Per-Household Rule), BR-288 (Max two postpaid mobiles per expat QID (business rule, though technically five allowed)), BR-309 (iWatch/RIO max one per order)

### REQ-129: Bilingual (English/Arabic) customer-facing forms
- **Journeys:** UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection)
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))
- **Business rules:** BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-128 (Home Fibre and GigaHome/5G Home require supplementary signed forms), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-130: Digital self-service fiber activation journey (Phase 1 key flow)
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-089 (Self-Serve Instant Activation Restricted to Standard Customers), BR-219 (Install Inventory (SNC) Must Follow Service Activation Success), BR-198 (Serial Number Check Required Before Service Activation), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice)

### REQ-131: Duplicate fiber service at same location check (home move lead trigger)
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-192 (No Duplicate Kahramaa ID Installation Check (30-Day Lookback)), BR-149 (5G Home reasonable-use / location restriction rule), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-147 (LAN cabling / Home Move fee calculation), BR-048 (FNP Conditional Acceptance at Service Level (unbilled amounts trigger)), BR-198 (Serial Number Check Required Before Service Activation)

### REQ-132: eKYC validation (ID scan + selfie scan) for digital fiber activation
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice)

### REQ-133: eSign requirement in digital fiber activation flow
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice)

### REQ-134: Fulfilment routing rule: CPE/ONT vs 5G lead type
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))
- **Business rules:** BR-152 (Device-type fulfilment routing rule (CPE/ONT vs 5G)), BR-151 (Duplicate-fiber-at-address routing rule (home move lead))

### REQ-135: Cross Sales campaign offer auto-applies plan (no agent discretion)
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-155 (QID immutable after Cross Sales redirect), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-199 (100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close)), BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only)

### REQ-136: QID field locked/read-only after Cross Sales redirect
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-155 (QID immutable after Cross Sales redirect), BR-230 (Donor Operator Field Is Read-Only/Derived, Not Agent-Editable), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-058 (Manager QID Bypass Field Restriction), BR-156 (ECR Details field is Fulfilment-team-only), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close))

### REQ-137: No editable add-on/discount control on cross-sell orders
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-159 (Empty add-on/discount selector rule)

### REQ-138: Appointment booking cannot be cancelled once confirmed
- **Journeys:** UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments))
- **Screens:** SCR-067 (New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion))
- **Business rules:** BR-193 (Appointment Booking Capacity/Slot Full Rule), BR-158 (Appointment booking irreversibility rule), BR-166 (Instant Activation Bypasses Appointment Booking), BR-196 (Appointment Once Booked Cannot Be Cancelled)

### REQ-139: ECR Details field restricted to Fulfilment team entry
- **Journeys:** UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail)
- **Screens:** SCR-043 (New Fixed Line wizard — Contact step)
- **Business rules:** BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-156 (ECR Details field is Fulfilment-team-only), BR-261 (ECR Details entry restricted to Fulfillment team), BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team))

### REQ-140: Alt. phone # must be a local mobile number used for notifications
- **Journeys:** UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments))
- **Screens:** SCR-043 (New Fixed Line wizard — Contact step)
- **Business rules:** BR-157 (Alt. phone # must be a local mobile number (notification contact)), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-131 (Cellular phone number format validation (974 prefix, 11 digits)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-141: Separate billing-email opt-in requires confirmation modal
- **Journeys:** UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval))
- **Screens:** SCR-044 (Fixed Line IPTV popup (billing email opt-in))
- **Business rules:** BR-296 (MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)), BR-210 (Approve Order Requires Verification Confirmation and Comments), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-142: Attachments step may be skipped (per named variant)
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)

### REQ-143: Prepatched device detection prompts Instant vs Normal Activation choice
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-327 (Number type branching: Normal vs Star Number), BR-163 (Prepatched Non Combo Box topology skips shared-infrastructure step), BR-235 (SIM Serial entry triggers number reservation check), BR-324 (Instant Activation restricted to tablet channel), BR-080 (Lighter Contact-Center Verification for Registered Number Callers), BR-206 (CPE Serial Number Must Be Free in UIM), BR-203 (CPE Serial Required Before Continue), BR-153 (Non Prepatched KID skips device-locate step), BR-166 (Instant Activation Bypasses Appointment Booking), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-302 (SIM Card serial number mandatory), BR-181 (CPE Serial Must Be Free (Unassigned) in UIM), BR-097 (Combo Box Password Confidentiality), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-152 (Device-type fulfilment routing rule (CPE/ONT vs 5G)), BR-198 (Serial Number Check Required Before Service Activation), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-089 (Self-Serve Instant Activation Restricted to Standard Customers), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-202 (SIM Serial Number Must Be 19 Digits)

### REQ-144: Do Not Disturb flag when customer refuses service
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)

### REQ-145: Required ID front/back photo uploads before Contact step continues
- **Business rules:** BR-177 (SIM Serial Required Before Continue), BR-305 (Fixed Line address KID requirement), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-140 (Safwa/Qatari contact creation requires authorization), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C)), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-203 (CPE Serial Required Before Continue), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed)), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-256 (B2B2C Company Name linkage during Contact step), BR-275 (Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times), BR-195 (Address Required Fields Before Saving), BR-168 (Qatari ID Front/Back Photo Upload Mandatory), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-198 (Serial Number Check Required Before Service Activation), BR-167 (Get IPTV Mandatory Field on Contact Step), BR-234 (MOI Validation required/auto-triggered for Contact confirmation), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team))

### REQ-146: E-signature required to complete CAF before order submission
- **Journeys:** UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End)
- **Screens:** SCR-128 (Mobile Number Portability Application Form (MNP contract))
- **Business rules:** BR-177 (SIM Serial Required Before Continue), BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-036 (MNP Donor Operator Fixed Rule (QTEL/Ooredoo)), BR-203 (CPE Serial Required Before Continue), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed)), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity), BR-195 (Address Required Fields Before Saving), BR-291 (Signed CAF must not be editable after signing), BR-105 (TON pre-validate collection status before flow entry), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-198 (Serial Number Check Required Before Service Activation), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-236 (Fixed Pre-sales = Yes requires Preferred Time and address capture), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-305 (Fixed Line address KID requirement)

### REQ-147: Manager order approval requires attachment verification (QID front/back + CAF)
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-210 (Approve Order Requires Verification Confirmation and Comments), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-259 (Manager approval requires document verification acknowledgement), BR-290 (CAF/attachment size limit ~4MB), BR-257 (B2B2C order requires manager approval before fulfillment), BR-058 (Manager QID Bypass Field Restriction), BR-168 (Qatari ID Front/Back Photo Upload Mandatory), BR-171 (Manager Approve Action Requires Document Verification Acknowledgement), BR-304 (MNP Port-In DNO verification attachment requirement), BR-208 (Order Routed to Manager Approval on Submission), BR-169 (B2B2C Order Requires Proof of Employment Attachment), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-148: Order rejection requires reason selection and drives re-collection of specific fields
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-161 (Rejection reason drives which evidence must be re-collected on correction), BR-050 (Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only)), BR-216 (Rejection Reason Recorded), BR-105 (TON pre-validate collection status before flow entry), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-238 (Reject Lead requires Reject Reason Code and Reject Comment)

### REQ-149: System notifies customer via SMS on order rejection and approval
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-172 (Order Rejection Reasons Trigger SMS Notification to Agent), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order), BR-161 (Rejection reason drives which evidence must be re-collected on correction)

### REQ-150: Only one correction round permitted before approval-only re-review
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-062 (TON Four Sequential Approval Fraud Control (prepaid-only)), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-257 (B2B2C order requires manager approval before fulfillment), BR-162 (Single correction round-trip rule (no second Reject-Correction)), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-151: Approve action requires explicit verification acknowledgment
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-106 (TON requires clearance of DOI and penalties before transfer), BR-210 (Approve Order Requires Verification Confirmation and Comments), BR-051 (Manual Suspension Requires SLA Action Before Escalation), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-259 (Manager approval requires document verification acknowledgement), BR-257 (B2B2C order requires manager approval before fulfillment), BR-171 (Manager Approve Action Requires Document Verification Acknowledgement), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-208 (Order Routed to Manager Approval on Submission), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order), BR-238 (Reject Lead requires Reject Reason Code and Reject Comment)

### REQ-152: Prepatched/Non Combo Box detection skips shared-infrastructure selection step
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-153 (Non Prepatched KID skips device-locate step), BR-163 (Prepatched Non Combo Box topology skips shared-infrastructure step), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-097 (Combo Box Password Confidentiality)

### REQ-153: Order Completion Notification Must Include Order Number
- **Journeys:** UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop))
- **Screens:** SCR-153 (Cross Sales Offers step (Postpaid))
- **Business rules:** BR-165 (90-Day Temporary Number Rule for Non-Resident ID Types), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-157 (Alt. phone # must be a local mobile number (notification contact)), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed)), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-305 (Fixed Line address KID requirement)

### REQ-154: System Must Support B2B2C Employer Association at Contact Creation
- **Journeys:** UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval))
- **Screens:** SCR-067 (New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion))
- **Business rules:** BR-017 (Mandatory CR-Number Search Before Account Creation), BR-140 (Safwa/Qatari contact creation requires authorization), BR-265 (Special Management account flag triggers B2B2C override prompt), BR-256 (B2B2C Company Name linkage during Contact step)

### REQ-155: Orders Requiring Approval Must Route to a Manager Queue With Assign-To-Me
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-275 (Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-068 (Unsubmitted Ticket Does Not Route to Queue), BR-264 (B2B2C without pre-existing Special Management completes without approval), BR-259 (Manager approval requires document verification acknowledgement), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-065 (Assign-to-Me Requires Queue Membership), BR-257 (B2B2C order requires manager approval before fulfillment), BR-208 (Order Routed to Manager Approval on Submission), BR-258 (Order Expiry / approval SLA window), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order), BR-214 (Order Expiry SLA Timer on Pending Approval)

### REQ-156: Manager Approval Screen Must Expose Attachments, Order Details, Activities, and Agent Details Tabs
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-062 (TON Four Sequential Approval Fraud Control (prepaid-only)), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-259 (Manager approval requires document verification acknowledgement), BR-257 (B2B2C order requires manager approval before fulfillment), BR-208 (Order Routed to Manager Approval on Submission), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-157: Approval Actions Must Support Approve, Reject-Correction, and Reject-Drop Order
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-243 (Admin/back-office role has additional Reject and Retire actions on leads), BR-173 (Order Approval Reject Reason Taxonomy), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close)), BR-162 (Single correction round-trip rule (no second Reject-Correction)), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-158: Order Approval Screen Must Show Order Expiry Timestamp
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-258 (Order Expiry / approval SLA window), BR-051 (Manual Suspension Requires SLA Action Before Escalation), BR-214 (Order Expiry SLA Timer on Pending Approval)

### REQ-159: Rejected Orders Must Notify Originating Agent via SMS with Correction Instructions
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-339 (Payment Capture via WinCash for Suspension/Resume Orders)

### REQ-160: System Must Provide a Dedicated Order Correction Journey/Tile
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))

### REQ-161: Appointment Booking Must Enforce Slot Capacity Limits and Show 'Full' State
- **Business rules:** BR-193 (Appointment Booking Capacity/Slot Full Rule), BR-158 (Appointment booking irreversibility rule), BR-166 (Instant Activation Bypasses Appointment Booking)

### REQ-162: Vanilla (Manual, Non-Wizard) Desktop Path Must Support Full FWA Activation via Contact->Account->Sales Order->Catalog->Line Items->Numbers->CPE Config
- **Journeys:** UJ-037 (New FWA 5G Outdoor Activation (Business Process, WFM appointment)), UJ-060 (New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)), UJ-058 (Modify FWA Indoor CPE Serial Number), UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-036 (New FWA 5G Indoor Activation (Business Process, ZSP/stock control)), UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual)), UJ-057 (New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)), UJ-061 (New FWA Postpaid Outdoor Order (Desktop, WFM installation))
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-033 (Discount Presentation as Two Line Items Rule), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-030 (Shared Pool Activation-Only Support Rule), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-163: FMS CPE Bundle Configuration Must Support Indoor IDU, ODU, and Outdoor IDU Equipment Sub-Types
- **Journeys:** UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual))
- **Screens:** SCR-097 (FMS CPE Bundle Configuration / Modify Screen (Equipment tab))
- **Business rules:** BR-092 (FWA Outdoor Install Fallback to Indoor)

### REQ-164: WFM Appointment Booking Must Integrate with Oracle Field Service Cloud for Technician Scheduling and Dispatch
- **Journeys:** UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments))
- **Screens:** SCR-110 (WFM Activity Details — Admin/Technician View)
- **Business rules:** BR-092 (FWA Outdoor Install Fallback to Indoor), BR-158 (Appointment booking irreversibility rule), BR-166 (Instant Activation Bypasses Appointment Booking), BR-193 (Appointment Booking Capacity/Slot Full Rule)

### REQ-165: CPE/SIM Inventory Must Be Transferable from Warehouse Team to Assigned Technician Before Installation
- **Screens:** SCR-090 (Inventory Management — Non-Serialized Inventory Transfer)
- **Business rules:** BR-180 (SIM Must Not Already Be Assigned in UIM), BR-106 (TON requires clearance of DOI and penalties before transfer), BR-177 (SIM Serial Required Before Continue), BR-179 (SIM Must Exist in UIM Inventory), BR-218 (Comments Field Must Be Non-Trivial / Meet Minimum Length), BR-014 (Back-Dated Order Completion Non-Compliance Rule), BR-203 (CPE Serial Required Before Continue), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team), BR-156 (ECR Details field is Fulfilment-team-only), BR-072 (Migration Balance Transfer Rule (monetary transfers, non-monetary lost)), BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team)), BR-032 (Excel One-Million-Line-Item Limit / 400k Email Threshold), BR-204 (SIM Card Must Not Already Be Assigned in UIM)

### REQ-166: Technician Must Complete Serial Number Check (Device Activation) Before Service Activation Succeeds
- **Journeys:** UJ-058 (Modify FWA Indoor CPE Serial Number)
- **Screens:** SCR-093 (Serial Number Check Screen (Dual Play))
- **Business rules:** BR-177 (SIM Serial Required Before Continue), BR-122 (Credit card recovery after 90 days unpaid), BR-278 (FDO modification/cancellation only allowed while status is Initial), BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-103 (Star number restoration/declaration form for numbers >= 1500 Riyal), BR-205 (SIM Card Must Exist in UIM), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-235 (SIM Serial entry triggers number reservation check), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-179 (SIM Must Exist in UIM Inventory), BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-206 (CPE Serial Number Must Be Free in UIM), BR-203 (CPE Serial Required Before Continue), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-181 (CPE Serial Must Be Free (Unassigned) in UIM), BR-302 (SIM Card serial number mandatory), BR-017 (Mandatory CR-Number Search Before Account Creation), BR-185 (CPE/Attribute-Only Modification Order Is Zero-Charge), BR-178 (SIM Serial Must Be 19 Digits), BR-152 (Device-type fulfilment routing rule (CPE/ONT vs 5G)), BR-105 (TON pre-validate collection status before flow entry), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-184 (Order Status Progression: Pending -> Open -> Complete), BR-198 (Serial Number Check Required Before Service Activation), BR-092 (FWA Outdoor Install Fallback to Indoor), BR-219 (Install Inventory (SNC) Must Follow Service Activation Success), BR-053 (SIM Swap on TON Success + Mandatory Approvals), BR-325 (Address lock after RFS feasibility check), BR-202 (SIM Serial Number Must Be 19 Digits), BR-030 (Shared Pool Activation-Only Support Rule), BR-204 (SIM Card Must Not Already Be Assigned in UIM)

### REQ-167: Field Technician Must Capture Customer Signature at Installation Checklist and End of Activity
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))
- **Business rules:** BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending)

### REQ-168: CSR Must Be Able to Modify Installed CPE Serial Number via Account 360 Modify Action
- **Journeys:** UJ-058 (Modify FWA Indoor CPE Serial Number)
- **Screens:** SCR-096 (Installed Assets Grid (Account 360, FWA))
- **Business rules:** BR-017 (Mandatory CR-Number Search Before Account Creation), BR-206 (CPE Serial Number Must Be Free in UIM), BR-235 (SIM Serial entry triggers number reservation check), BR-203 (CPE Serial Required Before Continue), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-302 (SIM Card serial number mandatory), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-202 (SIM Serial Number Must Be 19 Digits), BR-181 (CPE Serial Must Be Free (Unassigned) in UIM), BR-198 (Serial Number Check Required Before Service Activation)

### REQ-169: CPE Attribute Modification Must Generate a Modification-Type Sales Order with Attribute-Level Audit
- **Journeys:** UJ-062 (New FWA Tablet Indoor B2B2C Order with Manager Approval)
- **Screens:** SCR-098 (Order Line Items > Attributes Tab (Change Audit))
- **Business rules:** BR-152 (Device-type fulfilment routing rule (CPE/ONT vs 5G)), BR-185 (CPE/Attribute-Only Modification Order Is Zero-Charge)

### REQ-170: Address Step Must Validate Required Fields Before Save
- **Journeys:** UJ-066 (New FWA Tablet Outdoor Order through WFM Field Installation)
- **Screens:** SCR-198 (All Sales Order screen (with All SIM Swap Orders / All Pending SIM Swap Orders filter))
- **Business rules:** BR-195 (Address Required Fields Before Saving), BR-177 (SIM Serial Required Before Continue), BR-203 (CPE Serial Required Before Continue), BR-105 (TON pre-validate collection status before flow entry), BR-174 (Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-198 (Serial Number Check Required Before Service Activation), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-171: SIM/CPE Serial Validation Must Call Backend UIM Inventory Service in Real Time
- **Journeys:** UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios)
- **Screens:** SCR-105 (UIM Custom Object Summary)
- **Business rules:** BR-180 (SIM Must Not Already Be Assigned in UIM), BR-179 (SIM Must Exist in UIM Inventory), BR-177 (SIM Serial Required Before Continue), BR-219 (Install Inventory (SNC) Must Follow Service Activation Success), BR-206 (CPE Serial Number Must Be Free in UIM), BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back), BR-235 (SIM Serial entry triggers number reservation check), BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-203 (CPE Serial Required Before Continue), BR-205 (SIM Card Must Exist in UIM), BR-302 (SIM Card serial number mandatory), BR-178 (SIM Serial Must Be 19 Digits), BR-202 (SIM Serial Number Must Be 19 Digits), BR-181 (CPE Serial Must Be Free (Unassigned) in UIM), BR-198 (Serial Number Check Required Before Service Activation), BR-204 (SIM Card Must Not Already Be Assigned in UIM)

### REQ-172: Backend Exceptions Must Surface Error/Service Codes and a Support Reference Number to the User
- **Journeys:** UJ-058 (Modify FWA Indoor CPE Serial Number)
- **Screens:** SCR-192 (New Prepaid Tablet — Step 4 SIM Serial)
- **Business rules:** BR-198 (Serial Number Check Required Before Service Activation)

### REQ-173: Guided-Wizard Desktop FWA Journey Must Support Existing Mobile Customer Adding New FWA Line
- **Journeys:** UJ-037 (New FWA 5G Outdoor Activation (Business Process, WFM appointment)), UJ-060 (New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)), UJ-058 (Modify FWA Indoor CPE Serial Number), UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-036 (New FWA 5G Indoor Activation (Business Process, ZSP/stock control)), UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual)), UJ-057 (New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)), UJ-061 (New FWA Postpaid Outdoor Order (Desktop, WFM installation))
- **Business rules:** BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-099 (ZSB mandatory for FWA/fixed only, not mobile)

### REQ-174: CAF Generation Must Offer Multiple Form Types (Digital, Manual, Touch Screen)
- **Journeys:** UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection)
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))
- **Business rules:** BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-175: System Must Notify Customer That Signed CAF Copy Will Be Emailed
- **Journeys:** UJ-063 (New FWA Tablet Indoor with Manager Approval (2+ postpaid connections trigger))
- **Screens:** SCR-100 (CAF & Additional Attachments Step (FWA))
- **Business rules:** BR-291 (Signed CAF must not be editable after signing)

### REQ-176: MNP/Switch Activation Prompt Advising Customer to Send Switch SMS to Short Code 151
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-296 (MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)), BR-231 (Post-Port SMS Instruction: Customer Must Text 'Switch' to 151 (Cost 1 QR)), BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-291 (Signed CAF must not be editable after signing), BR-037 (MNP Consent SMS 24-Hour Rule), BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity)

### REQ-177: Guided wizard multi-step FWA order creation (Contact through Activity)
- **Journeys:** UJ-037 (New FWA 5G Outdoor Activation (Business Process, WFM appointment)), UJ-060 (New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)), UJ-058 (Modify FWA Indoor CPE Serial Number), UJ-059 (FWA Address/SIM/CPE/CAF Negative Validation Scenarios), UJ-011 (5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant), UJ-036 (New FWA 5G Indoor Activation (Business Process, ZSP/stock control)), UJ-056 (New FWA Indoor Activation — Desktop Vanilla (Manual)), UJ-057 (New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)), UJ-061 (New FWA Postpaid Outdoor Order (Desktop, WFM installation))
- **Business rules:** BR-256 (B2B2C Company Name linkage during Contact step), BR-140 (Safwa/Qatari contact creation requires authorization), BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-167 (Get IPTV Mandatory Field on Contact Step)

### REQ-178: Digital CAF generation with bilingual EN/AR content and e-signature
- **Screens:** SCR-058 (CAF preview modal (with e-signature pad))
- **Business rules:** BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity)

### REQ-179: Technician inventory import via Excel + Oracle Field Service integration
- **Screens:** SCR-087 (VFQ Inventory Loading Excel Tool), SCR-088 (Resource Inventory Import / Field Service Import Add-in)
- **Business rules:** BR-219 (Install Inventory (SNC) Must Follow Service Activation Success)

### REQ-180: Technician appointment reassignment (Move) with resource-match indicators
- **Screens:** SCR-089 (Move Dialog (Technician Reassignment))

### REQ-181: Manager approval workflow for flagged orders (multi-journey shared queue)
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit)), UJ-062 (New FWA Tablet Indoor B2B2C Order with Manager Approval)
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-259 (Manager approval requires document verification acknowledgement), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-257 (B2B2C order requires manager approval before fulfillment), BR-208 (Order Routed to Manager Approval on Submission), BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission)), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-182: Required attachment set for B2B2C FWA orders (Proof of Employment, CAF, Supplementary Form)
- **Journeys:** UJ-064 (New FWA Tablet Indoor Without Approval (2+ postpaid connections, advisory only)), UJ-066 (New FWA Tablet Outdoor Order through WFM Field Installation), UJ-062 (New FWA Tablet Indoor B2B2C Order with Manager Approval), UJ-063 (New FWA Tablet Indoor with Manager Approval (2+ postpaid connections trigger)), UJ-065 (New FWA Tablet Outdoor B2B2C Order Creation)
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-195 (Address Required Fields Before Saving), BR-177 (SIM Serial Required Before Continue), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-263 (Proof of Employment mandatory for B2B2C attachments), BR-290 (CAF/attachment size limit ~4MB), BR-203 (CPE Serial Required Before Continue), BR-257 (B2B2C order requires manager approval before fulfillment), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-169 (B2B2C Order Requires Proof of Employment Attachment), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-198 (Serial Number Check Required Before Service Activation), BR-128 (Home Fibre and GigaHome/5G Home require supplementary signed forms), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-183: Rejection reason capture on order rejection
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Screens:** SCR-184 (Account Activities tab)
- **Business rules:** BR-216 (Rejection Reason Recorded), BR-161 (Rejection reason drives which evidence must be re-collected on correction), BR-050 (Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only))

### REQ-184: Connection Details advisory for existing multiple postpaid connections
- **Journeys:** UJ-064 (New FWA Tablet Indoor Without Approval (2+ postpaid connections, advisory only))
- **Screens:** SCR-177 (Postpaid - Contact wizard step (Pre-to-Post))
- **Business rules:** BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-264 (B2B2C without pre-existing Special Management completes without approval), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-246 (Two-or-more postpaid connections credit warning), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers), BR-233 (Prepaid MNP declaration: unused prepaid balance is lost upon switching), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-256 (B2B2C Company Name linkage during Contact step), BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-211 (2+ Postpaid Connections Triggers Credit-Policy Advisory), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-167 (Get IPTV Mandatory Field on Contact Step), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal))

### REQ-185: Book Unscheduled Appointment option with irreversibility warning
- **Screens:** SCR-083 (Book Appointment Step / Modal (FWA & WFM))
- **Business rules:** BR-158 (Appointment booking irreversibility rule)

### REQ-186: Kahramaa duplicate-installation check during Assess Activity
- **Journeys:** UJ-039 (Home Move (Business Process, fiber/5G matrix)), UJ-067 (Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop))
- **Business rules:** BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-192 (No Duplicate Kahramaa ID Installation Check (30-Day Lookback)), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-147 (LAN cabling / Home Move fee calculation), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending)

### REQ-187: Fiber-readiness check for Home Move destination (KID lookup)
- **Journeys:** UJ-039 (Home Move (Business Process, fiber/5G matrix)), UJ-067 (Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop))
- **Business rules:** BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-098 (KID mandatory search-only lookup), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-147 (LAN cabling / Home Move fee calculation)

### REQ-188: Free Home Move eligibility for first-time movers
- **Journeys:** UJ-039 (Home Move (Business Process, fiber/5G matrix)), UJ-067 (Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop))
- **Business rules:** BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-148 (Free-months offer once-per-QID eligibility rule), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed)), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-073 (Multi-SIM Pricing Rule (plan-based, e.g., Platino: first free, second 25 Riyal)), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-147 (LAN cabling / Home Move fee calculation)

### REQ-189: Comments field minimum length validation on Activity Portal
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-343 (MNP Port Out Activity Validation and Auto Status Change), BR-004 (Home Move Free-Once-Per-Cycle Rule), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-257 (B2B2C order requires manager approval before fulfillment), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-106 (TON requires clearance of DOI and penalties before transfer), BR-210 (Approve Order Requires Verification Confirmation and Comments), BR-051 (Manual Suspension Requires SLA Action Before Escalation), BR-218 (Comments Field Must Be Non-Trivial / Meet Minimum Length), BR-171 (Manager Approve Action Requires Document Verification Acknowledgement), BR-222 (KID Eligibility Check for Home Move During Assess Activity), BR-147 (LAN cabling / Home Move fee calculation), BR-238 (Reject Lead requires Reject Reason Code and Reject Comment), BR-220 (Location Must Be Fiber-Ready to Proceed with Home Move), BR-259 (Manager approval requires document verification acknowledgement), BR-151 (Duplicate-fiber-at-address routing rule (home move lead)), BR-167 (Get IPTV Mandatory Field on Contact Step), BR-221 (First-Time Home Move Customers Eligible for Free Home Move), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning)

### REQ-190: Cross-sales offer acceptance launches the corresponding guided journey
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-155 (QID immutable after Cross Sales redirect), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close)), BR-047 (MNP Conditional Acceptance Billed-Due Threshold (100 QAR)), BR-154 (Cross-sell offer locks plan and add-on/discount selection)

### REQ-191: Editable Bill Limit and Credit Limit at plan/promotion selection
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-254 (Agent-editable Credit Limit from a preset value list), BR-246 (Two-or-more postpaid connections credit warning), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers), BR-115 (Star number entitlement by plan value), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-255 (Credit Limit override persists back to account record), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-260 (Default Bill Limit must be communicated to customer), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)), BR-018 (Enterprise Credit Limit Approval Rule), BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-211 (2+ Postpaid Connections Triggers Credit-Policy Advisory), BR-199 (100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-332 (Bill period non-editable in bill profile capture), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-192: Agent Min Value guardrail on Bill/Smart Limit editing
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-254 (Agent-editable Credit Limit from a preset value list), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-288 (Max two postpaid mobiles per expat QID (business rule, though technically five allowed)), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers), BR-142 (Bill calculator SMS is a capability, not a journey), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-260 (Default Bill Limit must be communicated to customer), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75), BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-269 (Minimum Subscription Period of 3 months applies to certain postpaid plans), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-120 (Postpaid minimum subscription period (Lock-in) of 3 months), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-193: Bill Limit Mapping configuration per Product Promotion (Spend Limit Mapping grid)
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-054 (Bill Medium Default (Detailed for Consumer, Summary PDF for Enterprise)), BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-307 (Bill Limit cannot exceed Credit Limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-312 (Bulk SMS one-active-per-account rule), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-254 (Agent-editable Credit Limit from a preset value list), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-260 (Default Bill Limit must be communicated to customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75)

### REQ-194: MNP Form selectable by channel type (MNP-Digital / MNP-Touch Screen)
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))

### REQ-195: Order line items must reflect selected Smart Limit as a Bill Limit Mobile line-item attribute
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-033 (Discount Presentation as Two Line Items Rule), BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-307 (Bill Limit cannot exceed Credit Limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-032 (Excel One-Million-Line-Item Limit / 400k Email Threshold), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-260 (Default Bill Limit must be communicated to customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75)

### REQ-196: Post-signature operational instruction popup (send switch SMS to 151)
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-231 (Post-Port SMS Instruction: Customer Must Text 'Switch' to 151 (Cost 1 QR))

### REQ-197: Add-on selection must reference available Bill Limit headroom
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-260 (Default Bill Limit must be communicated to customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75)

### REQ-198: MNP guided process must present a Postpaid/Prepaid process choice before any data entry
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-233 (Prepaid MNP declaration: unused prepaid balance is lost upon switching), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-118 (Age limit 18+ for Prepaid with minor exception process), BR-232 (MNP declaration: unpaid postpaid bills must be settled within 30 days of switching), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-105 (TON pre-validate collection status before flow entry), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid))

### REQ-199: Contact confirmation must reflect MOI Validation result before proceeding
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-234 (MOI Validation required/auto-triggered for Contact confirmation)

### REQ-200: Order must be cancellable at Donor Attachment / CAF stages before submission
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-290 (CAF/attachment size limit ~4MB), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-201: CAF form must dynamically bind Qatari ID/Passport number field for prepaid subscribers
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-103 (Star number restoration/declaration form for numbers >= 1500 Riyal), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-108 (Expat passport holders limited to prepaid, max 5 numbers), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-202: Service Needed dropdown must offer a conditional 'Fixed Pre-sales' field for Home service
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-236 (Fixed Pre-sales = Yes requires Preferred Time and address capture), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-048 (FNP Conditional Acceptance at Service Level (unbilled amounts trigger)), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close))

### REQ-203: Reject Lead action must require Reject Reason Code selection from a controlled taxonomy
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-173 (Order Approval Reject Reason Taxonomy), BR-238 (Reject Lead requires Reject Reason Code and Reject Comment), BR-050 (Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only)), BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission))

### REQ-204: Manager-only menu must scope to Home, Order Approval, Manage Leads, Leads Queue
- **Screens:** SCR-144 (Manage Leads - My Team's Leads)
- **Business rules:** BR-062 (TON Four Sequential Approval Fraud Control (prepaid-only)), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-259 (Manager approval requires document verification acknowledgement), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-257 (B2B2C order requires manager approval before fulfillment), BR-208 (Order Routed to Manager Approval on Submission), BR-041 (FNP Consumer-Only, Fiber-to-Fiber Scope Rule), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-205: My Leads view must exclude leads after ownership reassignment (owner-scoped visibility)
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-299 (Partner visibility restricted to own orders/leads), BR-242 (Lead Owner reassignment restricted to a candidate-agent picker list), BR-240 (My Leads view filters by Lead Owner; My Created Leads filters by Created By)

### REQ-206: My Created Leads view must remain creator-scoped regardless of ownership changes
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-240 (My Leads view filters by Lead Owner; My Created Leads filters by Created By)

### REQ-207: Lead detail layout must expand to a richer 3-column view with additional fields at Admin/back-office level
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back), BR-243 (Admin/back-office role has additional Reject and Retire actions on leads), BR-240 (My Leads view filters by Lead Owner; My Created Leads filters by Created By)

### REQ-208: Lead created from a known mobile number must attach to the existing matching Contact
- **Journeys:** UJ-075 (Tablet Lead Creation with Fixed Pre-Sales and Edit), UJ-073 (Create Lead (Mobile Number) with Owner Reassignment), UJ-074 (Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)), UJ-072 (Create Lead - Fixed/Home Service with Manager Reject)
- **Business rules:** BR-080 (Lighter Contact-Center Verification for Registered Number Callers), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-157 (Alt. phone # must be a local mobile number (notification contact)), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-240 (My Leads view filters by Lead Owner; My Created Leads filters by Created By), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-209: Passport-to-QID update must auto-fetch customer details via MOI Validation after QID entry
- **Journeys:** UJ-076 (Passport to QID Update)
- **Business rules:** BR-343 (MNP Port Out Activity Validation and Auto Status Change), BR-133 (Passport format validation (4-20 alphanumeric)), BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-155 (QID immutable after Cross Sales redirect), BR-330 (ID type branching: QID vs Other ID/Passport), BR-261 (ECR Details entry restricted to Fulfillment team), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-234 (MOI Validation required/auto-triggered for Contact confirmation), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers)

### REQ-210: Passport-to-QID journey requires scan/upload of QID Front & Back images before continuing
- **Journeys:** UJ-076 (Passport to QID Update)
- **Business rules:** BR-106 (TON requires clearance of DOI and penalties before transfer), BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-051 (Manual Suspension Requires SLA Action Before Escalation), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-330 (ID type branching: QID vs Other ID/Passport), BR-257 (B2B2C order requires manager approval before fulfillment), BR-077 (QID Physical Presence and Scan Requirement for Retail Transactions), BR-168 (Qatari ID Front/Back Photo Upload Mandatory), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-211: Identification number change form must be generated and require customer e-signature to complete
- **Journeys:** UJ-076 (Passport to QID Update)
- **Business rules:** BR-103 (Star number restoration/declaration form for numbers >= 1500 Riyal)

### REQ-212: Cross Sales offer engine surfaces campaign-driven offers for existing customers
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-155 (QID immutable after Cross Sales redirect), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close)), BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only)

### REQ-213: Cross Sales transaction can bundle a secondary Modification order onto an existing line
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Business rules:** BR-275 (Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times), BR-155 (QID immutable after Cross Sales redirect), BR-109 (MOI data precedence with secondary-parameter cross-check), BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown))

### REQ-214: Number reservation returns a confirmable success token (SBL-EXL-00151 code family)
- **Journeys:** UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer))
- **Screens:** SCR-191 (New Prepaid Tablet — Step 3 Number Selection)
- **Business rules:** BR-248 (Number reservation blocks number for reserving agent), BR-267 (Number reservation generates a unique reservation token), BR-075 (Direct Number Reservation from Siebel Generally Disallowed), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-183 (Free Number Reservation Priced at QR0.00), BR-235 (SIM Serial entry triggers number reservation check)

### REQ-215: CAF attachment upload supports file management (add/delete)
- **Screens:** SCR-161 (CAF/Attachments step (Postpaid wizard))
- **Business rules:** BR-290 (CAF/attachment size limit ~4MB), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject)

### REQ-216: Activity/wrap-up step requires call-disposition metadata and comment
- **Screens:** SCR-162 (Activity step (call disposition, Postpaid wizard))
- **Business rules:** BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-238 (Reject Lead requires Reject Reason Code and Reject Comment)

### REQ-217: Complex product (bundle) customization/runtime instantiation UI
- **Screens:** SCR-165 (Complex Product Runtime Instantiation (customization screen))

### REQ-218: Bill Limit editable per-order with warning about max = credit limit
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-312 (Bulk SMS one-active-per-account rule), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-254 (Agent-editable Credit Limit from a preset value list), BR-246 (Two-or-more postpaid connections credit warning), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-288 (Max two postpaid mobiles per expat QID (business rule, though technically five allowed)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-309 (iWatch/RIO max one per order), BR-110 (Maximum mobility lines cap (nationals unlimited, non-nationals 5 per operator)), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-255 (Credit Limit override persists back to account record), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-260 (Default Bill Limit must be communicated to customer), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)), BR-018 (Enterprise Credit Limit Approval Rule), BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-211 (2+ Postpaid Connections Triggers Credit-Policy Advisory), BR-316 (Deposit Service Bundle one-per-account rule), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-332 (Bill period non-editable in bill profile capture), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-219: System must surface HRN advance payment requirement at Connection Details step
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-252 (HRN (High-Risk Nationality) advance payment requirement), BR-187 (HRN Customer Advance Payment Requirement), BR-194 (Advance Payment Required for HRN Customer), BR-112 (HRN upfront advance calculation)

### REQ-220: Credit Limit change must propagate to CAF, Sales Order, and Account record
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-018 (Enterprise Credit Limit Approval Rule), BR-307 (Bill Limit cannot exceed Credit Limit), BR-100 (Address change creates new record with history, no in-place update), BR-236 (Fixed Pre-sales = Yes requires Preferred Time and address capture), BR-290 (CAF/attachment size limit ~4MB), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-255 (Credit Limit override persists back to account record), BR-254 (Agent-editable Credit Limit from a preset value list), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-221: Add-on/Discount step must clearly indicate empty state when nothing applicable
- **Screens:** SCR-189 (Step 3 Addon & Discount (Pre-to-Post tablet))
- **Business rules:** BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-159 (Empty add-on/discount selector rule)

### REQ-222: Star/Free/Reserved number tab selection during Number Selection step
- **Screens:** SCR-191 (New Prepaid Tablet — Step 3 Number Selection)
- **Business rules:** BR-115 (Star number entitlement by plan value), BR-256 (B2B2C Company Name linkage during Contact step), BR-319 (Star Number pricing/approval rule), BR-061 (Star Number Port-Out Control (commitment-period block)), BR-289 (Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan), BR-206 (CPE Serial Number Must Be Free in UIM), BR-125 (Star Number lock-in tiers by value), BR-074 (Number Category Rule (Free/Paid, paid can become free by plan)), BR-103 (Star number restoration/declaration form for numbers >= 1500 Riyal), BR-200 (Number Reservation via Free or Reserved Number Toggle), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-327 (Number type branching: Normal vs Star Number), BR-124 (Reserved number 90-day hold pending QID submission), BR-183 (Free Number Reservation Priced at QR0.00), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile)

### REQ-223: B2B2C tagging must persist onto Account (Special Management) and Contact (Employer)
- **Screens:** SCR-178 (Sales Order record screen (Line Items, Pre-to-Post))
- **Business rules:** BR-256 (B2B2C Company Name linkage during Contact step), BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-264 (B2B2C without pre-existing Special Management completes without approval), BR-265 (Special Management account flag triggers B2B2C override prompt), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval)

### REQ-224: System must prompt override confirmation when Special Management account attempts non-B2B2C journey
- **Journeys:** UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet))
- **Screens:** SCR-171 (B2B2C override confirm dialog)
- **Business rules:** BR-209 (Employer/Special Management Fields Populate Only After Order Approval/Completion), BR-264 (B2B2C without pre-existing Special Management completes without approval), BR-265 (Special Management account flag triggers B2B2C override prompt), BR-255 (Credit Limit override persists back to account record), BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval)

### REQ-225: Order status must reflect fulfillment progression (Pending -> Open/In Progress -> Complete) with per-line status context
- **Journeys:** UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval))
- **Screens:** SCR-194 (Sales Order — Line Items tab (New Prepaid))
- **Business rules:** BR-184 (Order Status Progression: Pending -> Open -> Complete), BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back)

### REQ-226: Guided Pre2Post journey must support manual, free-text promotion search and selection
- **Journeys:** UJ-027 (Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)), UJ-085 (Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)), UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection), UJ-088 (Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)), UJ-087 (Prepaid to Postpaid Migration — Autobase (system-recommended offer))
- **Business rules:** BR-223 (Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey)

### REQ-227: System must capture customer e-signature as part of CAF completion
- **Screens:** SCR-178 (Sales Order record screen (Line Items, Pre-to-Post))
- **Business rules:** BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity)

### REQ-228: Autobase migration offers must be sourced from and traceable to the Unica campaign engine end-to-end (order, bulk job, activity all stamped with source)
- **Journeys:** UJ-027 (Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)), UJ-085 (Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)), UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection), UJ-088 (Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)), UJ-087 (Prepaid to Postpaid Migration — Autobase (system-recommended offer))
- **Business rules:** BR-273 (Migration order fulfilled asynchronously via backend bulk job queue), BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only)

### REQ-229: Autobase wizard must collapse manual cart/catalog/quote steps into a single Accept + 3-step confirmation flow
- **Journeys:** UJ-027 (Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)), UJ-085 (Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)), UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection), UJ-088 (Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)), UJ-087 (Prepaid to Postpaid Migration — Autobase (system-recommended offer))
- **Business rules:** BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only)

### REQ-230: Order must progress asynchronously through backend bulk job queue after Autobase submission
- **Journeys:** UJ-027 (Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)), UJ-085 (Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)), UJ-086 (Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection), UJ-088 (Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)), UJ-087 (Prepaid to Postpaid Migration — Autobase (system-recommended offer))
- **Business rules:** BR-273 (Migration order fulfilled asynchronously via backend bulk job queue)

### REQ-231: System must display existing prepaid/postpaid connection counts before allowing a new/converted connection to proceed
- **Business rules:** BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-274 (Connection count check before conversion (existing prepaid/postpaid line counts shown)), BR-070 (Postpaid-to-Prepaid Migration Fee (100 Riyal)), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid))

### REQ-232: FDO must be raiseable via Open UI (Phase 1) with future support for additional channels (Phase 2)
- **Journeys:** UJ-092 (Future Dated Order (FDO) creation and lifecycle)
- **Business rules:** BR-284 (Automatic 3x retry for FDO failures caused by open orders), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team)

### REQ-233: FDO requests capped at 30 days lead time and cross-stamped with order ID in a custom table
- **Journeys:** UJ-092 (Future Dated Order (FDO) creation and lifecycle)
- **Business rules:** BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back), BR-277 (FDO maximum 30 days ahead)

### REQ-234: FDO notifications must be sent via SMS and billing email in English and Arabic for submission, reminder, execution outcome, modification, and cancellation, and logged as an activity
- **Journeys:** UJ-092 (Future Dated Order (FDO) creation and lifecycle)
- **Business rules:** BR-278 (FDO modification/cancellation only allowed while status is Initial), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team)

### REQ-235: Failed FDOs must retry automatically up to 3 times for open-order failures and be consolidated into a daily operations report if unresolved
- **Journeys:** UJ-092 (Future Dated Order (FDO) creation and lifecycle)
- **Business rules:** BR-284 (Automatic 3x retry for FDO failures caused by open orders)

### REQ-236: System must prevent dropping an order that has not gone through Order Approval
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit))
- **Business rules:** BR-285 (Order cannot be dropped without going through Approval), BR-213 (Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order)

### REQ-237: Desktop must provide dedicated navigation to view all SIM Swap orders and all pending SIM Swap orders
- **Journeys:** UJ-090 (SIM Swap from Global Search (Guided Journey, multi-channel)), UJ-020 (SIM Swap (Retail/Back Office/MVA, CBS-validated)), UJ-091 (SIM Swap Approval (Desktop and Tablet queues, with Rejection))
- **Business rules:** BR-266 (Orders on accounts with Special Management/multiple postpaid lines route to Pending approval), BR-286 (SIM Swap rejection drops (cancels) the order), BR-053 (SIM Swap on TON Success + Mandatory Approvals), BR-057 (SIM Swap Approval Matrix by Channel), BR-056 (SIM Swap Charging Rule (eSIM/physical/lost/damaged))

### REQ-238: ID scan should be enhanced with OCR/capture-in-one-shot
- **Journeys:** UJ-048 (Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G))

### REQ-239: Present a key-terms summary (lock-ins, penalties, fencing) before CAF signature
- **Business rules:** BR-106 (TON requires clearance of DOI and penalties before transfer), BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-240: Attachments must be categorized (CAF, QID) with online-only warm-archive retention and no deletion
- **Business rules:** BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team)

### REQ-241: Add a notification/template inventory section to the roles/journeys Excel
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-344 (SMS Content Controlled Within Teams), BR-172 (Order Rejection Reasons Trigger SMS Notification to Agent)

### REQ-242: CAF/attachment file size must not exceed ~4MB
- **Business rules:** BR-290 (CAF/attachment size limit ~4MB), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-326 (Proof-of-address file size cap (2MB))

### REQ-243: MNP flow must determine if a single signature can legally cover both CAF and MNP form (open item)
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity), BR-182 (Supplementary Form Mandatory for FWA CAF Step), BR-212 (Supplementary Form Mandatory Alongside CAF), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-244: Design of new stack must be business-driven rather than technology-driven
- **Business rules:** BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate)

### REQ-245: ECR to be decommissioned and not integrated with new stack; MCCR capabilities absorbed into new stack; VSA/BSA out of scope
- **Business rules:** BR-340 (Prepaid Channel Migration: ECR to VSA)

### REQ-246: Consumer segment to be completed before enterprise segment in delivery sequencing
- **Journeys:** UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough))
- **Business rules:** BR-054 (Bill Medium Default (Detailed for Consumer, Summary PDF for Enterprise))

### REQ-247: Installation Address and Service Feasibility Capability
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-325 (Address lock after RFS feasibility check)

### REQ-248: RFS Data Management Capability
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-249: Installation address cascading zone/street/building selection
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-174 (Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area))

### REQ-250: Proof-of-address upload size limit
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-290 (CAF/attachment size limit ~4MB), BR-326 (Proof-of-address file size cap (2MB))

### REQ-251: Address lock after RFS check
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-325 (Address lock after RFS feasibility check)

### REQ-252: IPTV bundled by default with base plan (removable)
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-335 (Resume Reverts to Base Plan Billing), BR-337 (Base Plan Sourced from Launch X on Resume), BR-084 (Fixed Plan Default Triple-Play with Optional IPTV)

### REQ-253: Instant Activation eligibility detection and device serial verification
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-324 (Instant Activation restricted to tablet channel), BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-089 (Self-Serve Instant Activation Restricted to Standard Customers), BR-166 (Instant Activation Bypasses Appointment Booking), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-198 (Serial Number Check Required Before Service Activation)

### REQ-254: Instant Activation restricted to tablet channel
- **Journeys:** UJ-045 (Cross Sales to New Fixed Line Activation), UJ-050 (New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)), UJ-046 (New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation), UJ-053 (New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation), UJ-034 (Instant Activation (Fixed Line, Tablet-only)), UJ-097 (Fiber Instant Activation (BRSD)), UJ-095 (Fixed/Fibre activation journey (IT stack modernization walkthrough)), UJ-049 (New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)), UJ-035 (Self-serve Instant Activation), UJ-055 (New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction), UJ-096 (Fiber Activation through Retail Agent (BRSD)), UJ-010 (New Fixed Line / Business Broadband Order), UJ-031 (Fixed Line Activation (Business Process Walkthrough)), UJ-047 (New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail), UJ-002 (Fixed Line Two-Phase Order Completion)
- **Business rules:** BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-324 (Instant Activation restricted to tablet channel), BR-160 (Device-detection prompt determines Instant vs Normal Activation eligibility), BR-295 (Fiber instant vs non-instant activation determined by back-end box type, not customer choice), BR-089 (Self-Serve Instant Activation Restricted to Standard Customers), BR-166 (Instant Activation Bypasses Appointment Booking)

### REQ-255: Fixed Line Migration eligibility/verification/WFM appointment
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-081 (Eligibility-First Gating for Fixed-Line (customer + location clubbed)), BR-087 (Fixed-Line Cancellation Window (up to network activation, with win-back)), BR-201 (FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile), BR-305 (Fixed Line address KID requirement)

### REQ-258: Fibre outstanding-dues threshold contradiction
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-038 (MNP Outstanding-Dues Payment Window Rule)

### REQ-259: GTM data-flow frequency confirmation needed
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-323 (MSISDN required to create a Siebel lead from RFS Portal)

### REQ-260: VFID/KID mapping rule clarification needed
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-261: Enterprise/SMB fibre scope gap
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-262: Mobile Postpaid BRSD baseline dependency
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid))

### REQ-263: FNP process diagram needed
- **Journeys:** UJ-015 (FNP Port-In (Fixed Number Portability)), UJ-099 (Fixed Line Port In (BRSD))

### REQ-264: Journey initiation from Agent Desktop with role-based authorisation
- **Journeys:** UJ-005 (Bulk Activation (Current State))
- **Screens:** SCR-209 (Agent Desktop (Journey initiation))

### REQ-265: Qnomy Q Ticket fallback handling
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-266: Draft order/milestone persistence for resume
- **Journeys:** UJ-005 (Bulk Activation (Current State))
- **Screens:** SCR-020 (In-progress journeys list (agent login page))

### REQ-268: Catalogue/eligibility/discount/number-pricing rules as configuration not hard-coded
- **Business rules:** BR-319 (Star Number pricing/approval rule)

### REQ-270: Existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change
- **Business rules:** BR-264 (B2B2C without pre-existing Special Management completes without approval)

### REQ-272: Plan-price-to-Star-Number-price eligibility matrix required
- **Business rules:** BR-115 (Star number entitlement by plan value), BR-319 (Star Number pricing/approval rule), BR-061 (Star Number Port-Out Control (commitment-period block)), BR-289 (Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan), BR-125 (Star Number lock-in tiers by value), BR-074 (Number Category Rule (Free/Paid, paid can become free by plan)), BR-103 (Star number restoration/declaration form for numbers >= 1500 Riyal), BR-102 (Star number transfer requires postpaid commitment or prepaid payment), BR-052 (TON Null/Blank Number Price CDM Queue Trigger (legacy gap)), BR-327 (Number type branching: Normal vs Star Number), BR-198 (Serial Number Check Required Before Service Activation), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit))

### REQ-273: CAF template matrix by role/channel/service type required
- **Business rules:** BR-057 (SIM Swap Approval Matrix by Channel), BR-198 (Serial Number Check Required Before Service Activation), BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-274: Qnomy MPI API spec required
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-276: Outstanding-dues threshold confirmation by Collections
- **Journeys:** UJ-038 (FWA-to-Fiber Migration), UJ-098 (Fixed Line Migration (BRSD)), UJ-101 (Fiber Termination (BRSD))
- **Business rules:** BR-038 (MNP Outstanding-Dues Payment Window Rule)

### REQ-277: HRN advance payment matrix required
- **Business rules:** BR-252 (HRN (High-Risk Nationality) advance payment requirement), BR-187 (HRN Customer Advance Payment Requirement), BR-194 (Advance Payment Required for HRN Customer), BR-112 (HRN upfront advance calculation)

### REQ-278: Order Billing Profile must match Line Items' Billing Profile
- **Journeys:** UJ-051 (Order Correction (reject-and-resubmit)), UJ-054 (New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation)
- **Screens:** SCR-194 (Sales Order — Line Items tab (New Prepaid))
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-008 (Billing Profile Unchangeable Correlation ID Requirement), BR-033 (Discount Presentation as Two Line Items Rule), BR-321 (ALP account existence / default billing profile cross-check), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-279: Business account cannot submit pending order if open order exists
- **Business rules:** BR-184 (Order Status Progression: Pending -> Open -> Complete), BR-301 (Business account open-order block)

### REQ-280: Serial Number required for SIM CARD product
- **Business rules:** BR-177 (SIM Serial Required Before Continue), BR-206 (CPE Serial Number Must Be Free in UIM), BR-235 (SIM Serial entry triggers number reservation check), BR-203 (CPE Serial Required Before Continue), BR-205 (SIM Card Must Exist in UIM), BR-178 (SIM Serial Must Be 19 Digits), BR-202 (SIM Serial Number Must Be 19 Digits), BR-302 (SIM Card serial number mandatory), BR-198 (Serial Number Check Required Before Service Activation), BR-204 (SIM Card Must Not Already Be Assigned in UIM)

### REQ-281: All Payments must be Authorized before order proceeds
- **Business rules:** BR-207 (Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C))

### REQ-282: DNO Verification Attachment required for MNP Port-In order
- **Journeys:** UJ-070 (MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)), UJ-068 (Cross Sales MNP Postpaid Conversion (Desktop)), UJ-069 (MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)), UJ-014 (MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End), UJ-094 (MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)), UJ-071 (MNP Prepaid Port-In (Tablet))
- **Business rules:** BR-343 (MNP Port Out Activity Validation and Auto Status Change), BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-304 (MNP Port-In DNO verification attachment requirement)

### REQ-283: FL Address must include KID
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-305 (Fixed Line address KID requirement)

### REQ-284: Bill Limit Value cannot exceed Credit Limit
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-249 (Bill Limit cannot be set below Agent Minimum Value), BR-306 (Bill Limit Minimum threshold (Agent) / BL rule series 01-09), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-076 (Credit Limit Default by Nationality (1000 expat / 50 HRN)), BR-254 (Agent-editable Credit Limit from a preset value list), BR-228 (Default Smart/Bill Limit Must Be Communicated to Customer), BR-226 (Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)), BR-255 (Credit Limit override persists back to account record), BR-260 (Default Bill Limit must be communicated to customer), BR-227 (Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)), BR-018 (Enterprise Credit Limit Approval Rule), BR-225 (Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value), BR-307 (Bill Limit cannot exceed Credit Limit), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-123 (Minimum deposit or valid credit card for credit limit), BR-229 (Add-On Requires Sufficient Bill Limit Coverage), BR-251 (Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product), BR-268 (HRN/Credit-Limit variant routes order to manager approval rather than auto-completion), BR-250 (Maximum Bill Limit equals account Credit Limit), BR-253 (Account pre-approved credit limit defaults from Expatriate/Qatari classification)

### REQ-285: IoT vs Non-IoT MSISDN length validation
- **Journeys:** UJ-007 (Enterprise Order Journey (Vanilla Direct))
- **Screens:** SCR-099 (SIM Serial Step (FWA, with validation))
- **Business rules:** BR-218 (Comments Field Must Be Non-Trivial / Meet Minimum Length), BR-308 (IoT vs Non-IoT MSISDN length rule)

### REQ-286: Notification and Feedback Capability
- **Journeys:** UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state))

### REQ-287: Provide file structure/sample details for IMS→RPA and RPA→UIM/Siebel
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-288: Clarify current operational frequency for UIM/RFS data refresh
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-289: Change Siebel feed from full file to delta file
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-290: Cluster naming change 1-4 to F1-F4
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))

### REQ-291: Drop displaying all KIDs on ZSB page in RFS Portal
- **Journeys:** UJ-102 (Fixed Line RFS (BRSD)), UJ-105 (RFS Data Flow (IMS to Downstream Systems))
- **Business rules:** BR-323 (MSISDN required to create a Siebel lead from RFS Portal)

### REQ-292: J017 Customer 360 Search by Customer No / Contact No / MSISDN
- **Journeys:** UJ-106 (J017: Customer 360)
- **Business rules:** BR-017 (Mandatory CR-Number Search Before Account Creation), BR-080 (Lighter Contact-Center Verification for Registered Number Callers), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-157 (Alt. phone # must be a local mobile number (notification contact))

### REQ-293: J017 Customer 360 Data Aggregation Across Sources
- **Journeys:** UJ-106 (J017: Customer 360)
- **Business rules:** BR-300 (Order Billing Profile must match Line Items' Billing Profile), BR-008 (Billing Profile Unchangeable Correlation ID Requirement), BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-013 (Unbilled Usage Screen Mandatory Filter Rule), BR-239 (Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back), BR-109 (MOI data precedence with secondary-parameter cross-check), BR-332 (Bill period non-editable in bill profile capture), BR-034 (Bulk SMS Disconnection Outstanding-Balance Check), BR-321 (ALP account existence / default billing profile cross-check), BR-071 (Consumer Billing Profile Cap (max two: one postpaid, one prepaid)), BR-334 (Suspension Eligibility Requires Cleared Unbilled Balance), BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-016 (Billing Profile / Recipient Email Audit Trail Requirement)

### REQ-294: J017 Customer 360 Retrieval Actions
- **Journeys:** UJ-106 (J017: Customer 360)
- **Business rules:** BR-339 (Payment Capture via WinCash for Suspension/Resume Orders), BR-055 (Bill Cycle Change Restricted to Billing Team Role), BR-069 (Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)), BR-332 (Bill period non-editable in bill profile capture)

### REQ-295: J011 Onboarding ID-Type-Dependent Validation
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-143 (Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission)), BR-133 (Passport format validation (4-20 alphanumeric)), BR-245 (QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)), BR-330 (ID type branching: QID vs Other ID/Passport), BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-234 (MOI Validation required/auto-triggered for Contact confirmation), BR-280 (Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers)

### REQ-296: J011 Cart Browsing Across Product Types
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-115 (Star number entitlement by plan value), BR-165 (90-Day Temporary Number Rule for Non-Resident ID Types), BR-289 (Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan), BR-337 (Base Plan Sourced from Launch X on Resume), BR-335 (Resume Reverts to Base Plan Billing), BR-074 (Number Category Rule (Free/Paid, paid can become free by plan)), BR-262 (Add-on selection constrained by Bill Limit headroom), BR-199 (100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection), BR-083 (Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)), BR-224 (Bill Limit and Credit Limit Editable at Plan Selection), BR-154 (Cross-sell offer locks plan and add-on/discount selection), BR-059 (Park My Number Plan Definition (35 Rial / 4 months / zero credit limit))

### REQ-297: J011 SIM Handover Options
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-056 (SIM Swap Charging Rule (eSIM/physical/lost/damaged))

### REQ-298: J011 Unica Campaign Reference in Onboarding
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)), UJ-093 (New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)), UJ-083 (New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)), UJ-079 (Retail New Postpaid Edit Bill Limit (Open UI Desktop)), UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)), UJ-077 (Cross Sales to New Postpaid Activation (Existing Customer)), UJ-080 (New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)), UJ-042 (New Postpaid Connection (Retail Channel Activation)), UJ-104 (J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)), UJ-081 (New Postpaid, B2B2C, With Approval (Tablet)), UJ-082 (New Postpaid, B2B2C, Without Approval (Tablet)), UJ-084 (New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)), UJ-078 (Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop))
- **Business rules:** BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only)

### REQ-299: J023 Mobile Service Suspension Multi-Channel Request Intake
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)
- **Business rules:** BR-333 (J023 Modify Order Initiation and Submission (Suspension)), BR-157 (Alt. phone # must be a local mobile number (notification contact)), BR-021 (Chooser Email Request Restriction)

### REQ-300: J023 Suspension Requires Cleared Unbilled Balance
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)
- **Business rules:** BR-106 (TON requires clearance of DOI and penalties before transfer), BR-333 (J023 Modify Order Initiation and Submission (Suspension)), BR-051 (Manual Suspension Requires SLA Action Before Escalation), BR-164 (Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject), BR-257 (B2B2C order requires manager approval before fulfillment), BR-281 (Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront), BR-191 (WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending), BR-048 (FNP Conditional Acceptance at Service Level (unbilled amounts trigger)), BR-334 (Suspension Eligibility Requires Cleared Unbilled Balance), BR-170 (B2B2C With Approval Requires Manager Sign-off Before Provisioning), BR-198 (Serial Number Check Required Before Service Activation), BR-292 (Port-out requires zero overdue/outstanding and cleared device instalments)

### REQ-301: J023/J024 Customer Communication on Suspension/Resume
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)
- **Business rules:** BR-339 (Payment Capture via WinCash for Suspension/Resume Orders), BR-333 (J023 Modify Order Initiation and Submission (Suspension)), BR-338 (Ticket/Order Approval Required for Suspension and Resume)

### REQ-302: J024 Mobile Service Resume Multi-Channel Request Intake
- **Journeys:** UJ-029 (Plan Change (Postpaid-to-Postpaid)), UJ-107 (J023: Mobile Service Suspension), UJ-108 (J024: Mobile Service Resume)
- **Business rules:** BR-157 (Alt. phone # must be a local mobile number (notification contact)), BR-021 (Chooser Email Request Restriction)

### REQ-303: Ticket Creation Journey Standardization Across Channels
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)

### REQ-304: Ticket Segregation by Type
- **Journeys:** UJ-022 (Trouble Ticket Creation and Handling (general)), UJ-109 (Complaints Management Process / Agent Ticket Creation)
- **Business rules:** BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team))

### REQ-305: Digitalized Consumer Application Forms
- **Business rules:** BR-128 (Home Fibre and GigaHome/5G Home require supplementary signed forms)

### REQ-306: Signature Capture Method Differs by Channel
- **Journeys:** UJ-044 (Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel))
- **Screens:** SCR-169 (CAF (Customer Application Form) document view (Postpaid HRN))
- **Business rules:** BR-236 (Fixed Pre-sales = Yes requires Preferred Time and address capture), BR-298 (Tablet/partner orders require channel-manager approval before submission), BR-324 (Instant Activation restricted to tablet channel), BR-189 (CAF Digital Signature Timestamped With Signing Agent Identity)

### REQ-307: Prepaid Offshore Manual Activation by Third Party
- **Journeys:** UJ-103 (Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state))
- **Screens:** SCR-194 (Sales Order — Line Items tab (New Prepaid))
- **Business rules:** BR-287 (Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)), BR-272 (Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only), BR-247 (Cross Sales offer disposition actions (Accept/Interested/Reject/Close))

### REQ-308: MVA Customer-Initiated Requests Routed as Reports
- **Business rules:** BR-342 (MNP Port Out Ticket Auto-Created from NPAS), BR-139 (Contact under 18 flagged), BR-064 (Ticket Assignment at Team/Queue Level Only (no auto-reassignment)), BR-283 (Disconnection FDO can only be raised via Siebel, cancellable only by retention team), BR-244 (Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate), BR-345 (Ticket Field Ownership by Role (Front Line vs Complaints Team))

---

## Reverse Traceability: Journey / Screen / Rule / Persona → Requirement

### Journey → Requirements

- **UJ-001: Bulk Adjustment Submission (Target State)** ← REQ-003, REQ-004, REQ-020, REQ-022, REQ-023
- **UJ-002: Fixed Line Two-Phase Order Completion** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-003: Enterprise Sales-to-Fulfilment Handover** ← REQ-025, REQ-026, REQ-028, REQ-031, REQ-032
- **UJ-004: Enterprise Account Creation** ← REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-034
- **UJ-005: Bulk Activation (Current State)** ← REQ-003, REQ-004, REQ-020, REQ-022, REQ-023, REQ-264, REQ-266
- **UJ-006: Enterprise/IoT Order-to-Billing Flow** ← REQ-025, REQ-026, REQ-028, REQ-031, REQ-032
- **UJ-007: Enterprise Order Journey (Vanilla Direct)** ← REQ-025, REQ-026, REQ-027, REQ-028, REQ-031, REQ-032, REQ-285
- **UJ-008: Enterprise Mobility Lead-to-Order** ← REQ-025, REQ-026, REQ-028, REQ-031, REQ-032
- **UJ-009: Push to Talk (PTT) Provisioning** ← REQ-003, REQ-004, REQ-020, REQ-022, REQ-023
- **UJ-010: New Fixed Line / Business Broadband Order** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-011: 5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant** ← REQ-029, REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-012: DAPN Activation** ← REQ-003, REQ-004, REQ-020, REQ-022, REQ-023
- **UJ-013: Bulk SMS Onboarding to Disconnection** ← REQ-003, REQ-004, REQ-020, REQ-022, REQ-023
- **UJ-014: MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End** ← REQ-040, REQ-041, REQ-042, REQ-043, REQ-044, REQ-045, REQ-146, REQ-176, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-243, REQ-282
- **UJ-015: FNP Port-In (Fixed Number Portability)** ← REQ-041, REQ-042, REQ-044, REQ-045, REQ-046, REQ-087, REQ-263
- **UJ-017: GigaHome/OSNtv Subscription Acceptance and Lifecycle** ← REQ-090
- **UJ-018: MNP/FNP Port-Out Ticket Handling (Consumer/B2B2C, NPass-driven)** ← REQ-073
- **UJ-019: Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)** ← REQ-063, REQ-099, REQ-100, REQ-101, REQ-102, REQ-103, REQ-104
- **UJ-020: SIM Swap (Retail/Back Office/MVA, CBS-validated)** ← REQ-062, REQ-237
- **UJ-022: Trouble Ticket Creation and Handling (general)** ← REQ-065, REQ-066, REQ-067, REQ-068, REQ-069, REQ-070, REQ-071, REQ-074, REQ-075, REQ-189, REQ-241, REQ-265, REQ-274, REQ-303, REQ-304
- **UJ-024: Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)** ← REQ-063, REQ-099, REQ-100, REQ-101, REQ-102, REQ-103, REQ-104
- **UJ-026: MNP Port-Out (Trouble Ticket variant, NPAS auto-created)** ← REQ-073
- **UJ-027: Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)** ← REQ-077, REQ-226, REQ-228, REQ-229, REQ-230
- **UJ-028: Postpaid-to-Prepaid Migration** ← REQ-078
- **UJ-029: Plan Change (Postpaid-to-Postpaid)** ← REQ-064, REQ-076, REQ-299, REQ-300, REQ-301, REQ-302
- **UJ-030: Device Installment (DOI) - Retail and Telesales** ← REQ-125
- **UJ-031: Fixed Line Activation (Business Process Walkthrough)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-032: KID-in-Use Exception Handling** ← REQ-083, REQ-084, REQ-091
- **UJ-033: Fixed-Line Installation Exception Handling (Splitter Full / BID Not Mapped)** ← REQ-083, REQ-084, REQ-091
- **UJ-034: Instant Activation (Fixed Line, Tablet-only)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-035: Self-serve Instant Activation** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-036: New FWA 5G Indoor Activation (Business Process, ZSP/stock control)** ← REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-037: New FWA 5G Outdoor Activation (Business Process, WFM appointment)** ← REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-038: FWA-to-Fiber Migration** ← REQ-093, REQ-126, REQ-127, REQ-255, REQ-258, REQ-276
- **UJ-039: Home Move (Business Process, fiber/5G matrix)** ← REQ-094, REQ-186, REQ-187, REQ-188
- **UJ-040: Transfer of Number (TON) — Claim of Ownership (COO)** ← REQ-063, REQ-099, REQ-100, REQ-101, REQ-102, REQ-103, REQ-104
- **UJ-041: Transfer of Number (TON) — Third-party on Cancelled ID** ← REQ-063, REQ-099, REQ-100, REQ-101, REQ-102, REQ-103, REQ-104
- **UJ-042: New Postpaid Connection (Retail Channel Activation)** ← REQ-079, REQ-105, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-043: Consumer Prepaid Activation (ECR/Open UI/VSA, multi-channel)** ← REQ-107, REQ-111, REQ-114
- **UJ-044: Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298, REQ-306
- **UJ-045: Cross Sales to New Fixed Line Activation** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-128, REQ-135, REQ-136, REQ-137, REQ-142, REQ-143, REQ-144, REQ-152, REQ-190, REQ-212, REQ-213, REQ-252, REQ-253, REQ-254
- **UJ-046: New Fixed Line Activation — Back Office Fulfilment (Skip Attachments)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-138, REQ-140, REQ-142, REQ-143, REQ-144, REQ-152, REQ-164, REQ-252, REQ-253, REQ-254
- **UJ-047: New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-139, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-048: Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G)** ← REQ-108, REQ-109, REQ-130, REQ-131, REQ-132, REQ-133, REQ-134, REQ-238
- **UJ-049: New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-050: New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-141, REQ-142, REQ-143, REQ-144, REQ-152, REQ-154, REQ-252, REQ-253, REQ-254
- **UJ-051: Order Correction (reject-and-resubmit)** ← REQ-147, REQ-148, REQ-149, REQ-150, REQ-151, REQ-155, REQ-156, REQ-157, REQ-158, REQ-159, REQ-160, REQ-181, REQ-183, REQ-236, REQ-278
- **UJ-052: GigaHome Subscription Acceptance Form (customer sign-off before activation, v3)** ← REQ-090
- **UJ-053: New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-054: New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254, REQ-278
- **UJ-055: New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-056: New FWA Indoor Activation — Desktop Vanilla (Manual)** ← REQ-092, REQ-124, REQ-162, REQ-163, REQ-173, REQ-177
- **UJ-057: New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla)** ← REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-058: Modify FWA Indoor CPE Serial Number** ← REQ-092, REQ-124, REQ-162, REQ-166, REQ-168, REQ-172, REQ-173, REQ-177
- **UJ-059: FWA Address/SIM/CPE/CAF Negative Validation Scenarios** ← REQ-092, REQ-124, REQ-162, REQ-171, REQ-173, REQ-177
- **UJ-060: New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer)** ← REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-061: New FWA Postpaid Outdoor Order (Desktop, WFM installation)** ← REQ-092, REQ-124, REQ-162, REQ-173, REQ-177
- **UJ-062: New FWA Tablet Indoor B2B2C Order with Manager Approval** ← REQ-169, REQ-181, REQ-182
- **UJ-063: New FWA Tablet Indoor with Manager Approval (2+ postpaid connections trigger)** ← REQ-175, REQ-182
- **UJ-064: New FWA Tablet Indoor Without Approval (2+ postpaid connections, advisory only)** ← REQ-182, REQ-184
- **UJ-065: New FWA Tablet Outdoor B2B2C Order Creation** ← REQ-182
- **UJ-066: New FWA Tablet Outdoor Order through WFM Field Installation** ← REQ-170, REQ-182
- **UJ-067: Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop)** ← REQ-094, REQ-186, REQ-187, REQ-188
- **UJ-068: Cross Sales MNP Postpaid Conversion (Desktop)** ← REQ-040, REQ-043, REQ-128, REQ-135, REQ-136, REQ-137, REQ-153, REQ-176, REQ-190, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-212, REQ-213, REQ-243, REQ-282
- **UJ-069: MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone)** ← REQ-040, REQ-043, REQ-176, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-243, REQ-282
- **UJ-070: MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer)** ← REQ-040, REQ-043, REQ-176, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-243, REQ-282
- **UJ-071: MNP Prepaid Port-In (Tablet)** ← REQ-040, REQ-043, REQ-176, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-243, REQ-282
- **UJ-072: Create Lead - Fixed/Home Service with Manager Reject** ← REQ-030, REQ-202, REQ-203, REQ-205, REQ-206, REQ-207, REQ-208
- **UJ-073: Create Lead (Mobile Number) with Owner Reassignment** ← REQ-030, REQ-202, REQ-203, REQ-205, REQ-206, REQ-207, REQ-208
- **UJ-074: Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas)** ← REQ-030, REQ-202, REQ-203, REQ-205, REQ-206, REQ-207, REQ-208
- **UJ-075: Tablet Lead Creation with Fixed Pre-Sales and Edit** ← REQ-030, REQ-202, REQ-203, REQ-205, REQ-206, REQ-207, REQ-208
- **UJ-076: Passport to QID Update** ← REQ-209, REQ-210, REQ-211
- **UJ-077: Cross Sales to New Postpaid Activation (Existing Customer)** ← REQ-079, REQ-113, REQ-128, REQ-135, REQ-136, REQ-137, REQ-190, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-212, REQ-213, REQ-214, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-078: Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-079: Retail New Postpaid Edit Bill Limit (Open UI Desktop)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-080: New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-081: New Postpaid, B2B2C, With Approval (Tablet)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-082: New Postpaid, B2B2C, Without Approval (Tablet)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-083: New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-225, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-084: New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)** ← REQ-079, REQ-112, REQ-113, REQ-115, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-224, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-085: Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure)** ← REQ-077, REQ-226, REQ-228, REQ-229, REQ-230
- **UJ-086: Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection** ← REQ-077, REQ-122, REQ-123, REQ-129, REQ-174, REQ-226, REQ-228, REQ-229, REQ-230
- **UJ-087: Prepaid to Postpaid Migration — Autobase (system-recommended offer)** ← REQ-077, REQ-226, REQ-228, REQ-229, REQ-230
- **UJ-088: Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario)** ← REQ-077, REQ-226, REQ-228, REQ-229, REQ-230
- **UJ-089: New Prepaid Connection — Open UI Tablet** ← REQ-107, REQ-111, REQ-114
- **UJ-090: SIM Swap from Global Search (Guided Journey, multi-channel)** ← REQ-237
- **UJ-091: SIM Swap Approval (Desktop and Tablet queues, with Rejection)** ← REQ-237
- **UJ-092: Future Dated Order (FDO) creation and lifecycle** ← REQ-232, REQ-233, REQ-234, REQ-235
- **UJ-093: New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-246, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-094: MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough)** ← REQ-040, REQ-043, REQ-176, REQ-194, REQ-196, REQ-198, REQ-199, REQ-200, REQ-201, REQ-243, REQ-282
- **UJ-095: Fixed/Fibre activation journey (IT stack modernization walkthrough)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-096: Fiber Activation through Retail Agent (BRSD)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-097: Fiber Instant Activation (BRSD)** ← REQ-011, REQ-019, REQ-029, REQ-089, REQ-095, REQ-096, REQ-142, REQ-143, REQ-144, REQ-152, REQ-252, REQ-253, REQ-254
- **UJ-098: Fixed Line Migration (BRSD)** ← REQ-093, REQ-126, REQ-127, REQ-255, REQ-258, REQ-276
- **UJ-099: Fixed Line Port In (BRSD)** ← REQ-041, REQ-042, REQ-044, REQ-045, REQ-046, REQ-087, REQ-263
- **UJ-100: Fixed Line Port Out (BRSD)** ← REQ-073
- **UJ-101: Fiber Termination (BRSD)** ← REQ-093, REQ-126, REQ-127, REQ-255, REQ-258, REQ-276
- **UJ-102: Fixed Line RFS (BRSD)** ← REQ-097, REQ-098, REQ-247, REQ-248, REQ-249, REQ-250, REQ-251, REQ-259, REQ-260, REQ-261, REQ-283, REQ-287, REQ-288, REQ-289, REQ-290, REQ-291
- **UJ-103: Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state)** ← REQ-047, REQ-052, REQ-079, REQ-080, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-286, REQ-295, REQ-296, REQ-297, REQ-298, REQ-307
- **UJ-104: J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs)** ← REQ-079, REQ-113, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-219, REQ-220, REQ-262, REQ-284, REQ-295, REQ-296, REQ-297, REQ-298
- **UJ-105: RFS Data Flow (IMS to Downstream Systems)** ← REQ-097, REQ-098, REQ-247, REQ-248, REQ-249, REQ-250, REQ-251, REQ-259, REQ-260, REQ-261, REQ-283, REQ-287, REQ-288, REQ-289, REQ-290, REQ-291
- **UJ-106: J017: Customer 360** ← REQ-050, REQ-082, REQ-292, REQ-293, REQ-294
- **UJ-107: J023: Mobile Service Suspension** ← REQ-064, REQ-076, REQ-299, REQ-300, REQ-301, REQ-302
- **UJ-108: J024: Mobile Service Resume** ← REQ-064, REQ-076, REQ-299, REQ-300, REQ-301, REQ-302
- **UJ-109: Complaints Management Process / Agent Ticket Creation** ← REQ-065, REQ-066, REQ-067, REQ-068, REQ-069, REQ-070, REQ-071, REQ-074, REQ-075, REQ-189, REQ-241, REQ-265, REQ-274, REQ-303, REQ-304
- **UJ-110: MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant)** ← REQ-072, REQ-073

### Screen → Requirements

- **SCR-001: Bulk Adjustment Portal (DXP, Target State)** ← REQ-003
- **SCR-003: Statement of Account (SOA) View** ← REQ-006
- **SCR-004: Bill Landing View** ← REQ-007
- **SCR-006: Unbilled Usage Screen** ← REQ-010
- **SCR-007: Account Creation Screen** ← REQ-014
- **SCR-009: Bulk Activation Control Sheet (Excel Macro, Current State)** ← REQ-020
- **SCR-014: Enterprise Invoice (PDF)** ← REQ-035, REQ-036, REQ-037, REQ-038
- **SCR-017: Siebel Order Creation Screen (MNP)** ← REQ-027, REQ-042
- **SCR-019: CAF (Customer Application Form) tablet signature view** ← REQ-047
- **SCR-020: In-progress journeys list (agent login page)** ← REQ-266
- **SCR-036: Checkout Screen (Retail New Postpaid)** ← REQ-049
- **SCR-040: CRM Open UI Desktop Home Page** ← REQ-123
- **SCR-043: New Fixed Line wizard — Contact step** ← REQ-139, REQ-140
- **SCR-044: Fixed Line IPTV popup (billing email opt-in)** ← REQ-141
- **SCR-058: CAF preview modal (with e-signature pad)** ← REQ-178
- **SCR-067: New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion)** ← REQ-080, REQ-138, REQ-154
- **SCR-069: Customer Application Form (CAF) Preview/Sign** ← REQ-052
- **SCR-073: Account Summary (Installed Assets and Orders)** ← REQ-033
- **SCR-083: Book Appointment Step / Modal (FWA & WFM)** ← REQ-185
- **SCR-087: VFQ Inventory Loading Excel Tool** ← REQ-179
- **SCR-088: Resource Inventory Import / Field Service Import Add-in** ← REQ-179
- **SCR-089: Move Dialog (Technician Reassignment)** ← REQ-180
- **SCR-090: Inventory Management — Non-Serialized Inventory Transfer** ← REQ-165
- **SCR-093: Serial Number Check Screen (Dual Play)** ← REQ-166
- **SCR-095: Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View** ← REQ-034
- **SCR-096: Installed Assets Grid (Account 360, FWA)** ← REQ-168
- **SCR-097: FMS CPE Bundle Configuration / Modify Screen (Equipment tab)** ← REQ-163
- **SCR-098: Order Line Items > Attributes Tab (Change Audit)** ← REQ-169
- **SCR-099: SIM Serial Step (FWA, with validation)** ← REQ-285
- **SCR-100: CAF & Additional Attachments Step (FWA)** ← REQ-175
- **SCR-105: UIM Custom Object Summary** ← REQ-171
- **SCR-110: WFM Activity Details — Admin/Technician View** ← REQ-164
- **SCR-128: Mobile Number Portability Application Form (MNP contract)** ← REQ-146
- **SCR-144: Manage Leads - My Team's Leads** ← REQ-204
- **SCR-150: Contact record - Leads sub-tab** ← REQ-016
- **SCR-153: Cross Sales Offers step (Postpaid)** ← REQ-153
- **SCR-161: CAF/Attachments step (Postpaid wizard)** ← REQ-215
- **SCR-162: Activity step (call disposition, Postpaid wizard)** ← REQ-216
- **SCR-165: Complex Product Runtime Instantiation (customization screen)** ← REQ-217
- **SCR-169: CAF (Customer Application Form) document view (Postpaid HRN)** ← REQ-048, REQ-115, REQ-116, REQ-129, REQ-167, REQ-174, REQ-306
- **SCR-171: B2B2C override confirm dialog** ← REQ-224
- **SCR-177: Postpaid - Contact wizard step (Pre-to-Post)** ← REQ-184
- **SCR-178: Sales Order record screen (Line Items, Pre-to-Post)** ← REQ-223, REQ-227
- **SCR-184: Account Activities tab** ← REQ-183
- **SCR-186: Billing Profile grid (account level)** ← REQ-001
- **SCR-189: Step 3 Addon & Discount (Pre-to-Post tablet)** ← REQ-221
- **SCR-190: New Prepaid Tablet — Step 1 Contact (ID capture)** ← REQ-105, REQ-112, REQ-122
- **SCR-191: New Prepaid Tablet — Step 3 Number Selection** ← REQ-214, REQ-222
- **SCR-192: New Prepaid Tablet — Step 4 SIM Serial** ← REQ-172
- **SCR-194: Sales Order — Line Items tab (New Prepaid)** ← REQ-225, REQ-278, REQ-307
- **SCR-198: All Sales Order screen (with All SIM Swap Orders / All Pending SIM Swap Orders filter)** ← REQ-170
- **SCR-209: Agent Desktop (Journey initiation)** ← REQ-264

### Business Rule → Requirements

- **BR-001: Fibre 12-Month Lock-in Disconnection Fee** ← REQ-127
- **BR-002: OSNtv Termination Penalty Calculation** ← REQ-008, REQ-072, REQ-125
- **BR-004: Home Move Free-Once-Per-Cycle Rule** ← REQ-094, REQ-128, REQ-131, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-005: Kahramaa ID One-Offer-Per-Household Rule** ← REQ-128
- **BR-007: Personal-Use-Only Restriction** ← REQ-059
- **BR-008: Billing Profile Unchangeable Correlation ID Requirement** ← REQ-001, REQ-013, REQ-034, REQ-278, REQ-293
- **BR-009: BRM 6-Plus-1 Event Purge Policy** ← REQ-004
- **BR-010: SOA From-Inception Display Rule** ← REQ-006
- **BR-011: Penalty Calculation Trigger Restriction** ← REQ-008, REQ-072, REQ-125
- **BR-012: Bill Simulation Not a Tax Invoice Disclosure Rule** ← REQ-009
- **BR-013: Unbilled Usage Screen Mandatory Filter Rule** ← REQ-010, REQ-293
- **BR-014: Back-Dated Order Completion Non-Compliance Rule** ← REQ-165
- **BR-015: Volumetric Discount Proration Rule** ← REQ-012, REQ-021
- **BR-016: Billing Profile / Recipient Email Audit Trail Requirement** ← REQ-001, REQ-013, REQ-034, REQ-141, REQ-234, REQ-278, REQ-293
- **BR-017: Mandatory CR-Number Search Before Account Creation** ← REQ-014, REQ-080, REQ-154, REQ-166, REQ-168, REQ-292
- **BR-018: Enterprise Credit Limit Approval Rule** ← REQ-079, REQ-191, REQ-218, REQ-220, REQ-284
- **BR-021: Chooser Email Request Restriction** ← REQ-299, REQ-302
- **BR-025: Volumetric Discount Minimum Threshold Rule** ← REQ-012, REQ-021
- **BR-027: Bulk Activation Identical-Parameters Constraint** ← REQ-020
- **BR-028: Fibre Precedence Over 5G Rule** ← REQ-029
- **BR-030: Shared Pool Activation-Only Support Rule** ← REQ-162, REQ-166
- **BR-032: Excel One-Million-Line-Item Limit / 400k Email Threshold** ← REQ-036, REQ-038, REQ-165, REQ-195
- **BR-033: Discount Presentation as Two Line Items Rule** ← REQ-025, REQ-038, REQ-162, REQ-195, REQ-278
- **BR-034: Bulk SMS Disconnection Outstanding-Balance Check** ← REQ-293
- **BR-035: Enterprise Quarterly/Half-Yearly/Yearly Billing Ask** ← REQ-032, REQ-034
- **BR-036: MNP Donor Operator Fixed Rule (QTEL/Ooredoo)** ← REQ-146
- **BR-037: MNP Consent SMS 24-Hour Rule** ← REQ-040, REQ-176
- **BR-038: MNP Outstanding-Dues Payment Window Rule** ← REQ-258, REQ-276
- **BR-041: FNP Consumer-Only, Fiber-to-Fiber Scope Rule** ← REQ-204
- **BR-046: MNP Reserved Temporary MSISDN Rule** ← REQ-043
- **BR-047: MNP Conditional Acceptance Billed-Due Threshold (100 QAR)** ← REQ-190
- **BR-048: FNP Conditional Acceptance at Service Level (unbilled amounts trigger)** ← REQ-026, REQ-131, REQ-202, REQ-300
- **BR-049: MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)** ← REQ-061, REQ-065, REQ-067, REQ-073
- **BR-050: Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only)** ← REQ-059, REQ-148, REQ-183, REQ-203
- **BR-051: Manual Suspension Requires SLA Action Before Escalation** ← REQ-151, REQ-158, REQ-189, REQ-210, REQ-300
- **BR-052: TON Null/Blank Number Price CDM Queue Trigger (legacy gap)** ← REQ-103, REQ-272
- **BR-053: SIM Swap on TON Success + Mandatory Approvals** ← REQ-063, REQ-166, REQ-237
- **BR-054: Bill Medium Default (Detailed for Consumer, Summary PDF for Enterprise)** ← REQ-108, REQ-193, REQ-246
- **BR-055: Bill Cycle Change Restricted to Billing Team Role** ← REQ-012, REQ-054, REQ-060, REQ-061, REQ-139, REQ-293, REQ-294
- **BR-056: SIM Swap Charging Rule (eSIM/physical/lost/damaged)** ← REQ-237, REQ-297
- **BR-057: SIM Swap Approval Matrix by Channel** ← REQ-237, REQ-273
- **BR-058: Manager QID Bypass Field Restriction** ← REQ-062, REQ-128, REQ-136, REQ-147
- **BR-059: Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)** ← REQ-079, REQ-080, REQ-191, REQ-218, REQ-220, REQ-272, REQ-284, REQ-296
- **BR-061: Star Number Port-Out Control (commitment-period block)** ← REQ-064, REQ-222, REQ-272
- **BR-062: TON Four Sequential Approval Fraud Control (prepaid-only)** ← REQ-104, REQ-150, REQ-156, REQ-204
- **BR-063: Commitment Period Continuity on Plan Upgrade (regulatory)** ← REQ-064
- **BR-064: Ticket Assignment at Team/Queue Level Only (no auto-reassignment)** ← REQ-061, REQ-062, REQ-065, REQ-067, REQ-074, REQ-204, REQ-308
- **BR-065: Assign-to-Me Requires Queue Membership** ← REQ-155
- **BR-067: Audit Trail Role-Restricted from Agents** ← REQ-013
- **BR-068: Unsubmitted Ticket Does Not Route to Queue** ← REQ-067, REQ-074, REQ-155
- **BR-069: Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)** ← REQ-077, REQ-078, REQ-085, REQ-104, REQ-184, REQ-198, REQ-231, REQ-255, REQ-293, REQ-294
- **BR-070: Postpaid-to-Prepaid Migration Fee (100 Riyal)** ← REQ-077, REQ-078, REQ-085, REQ-102, REQ-104, REQ-184, REQ-198, REQ-231
- **BR-071: Consumer Billing Profile Cap (max two: one postpaid, one prepaid)** ← REQ-001, REQ-013, REQ-034, REQ-077, REQ-078, REQ-085, REQ-184, REQ-198, REQ-218, REQ-231, REQ-278, REQ-293
- **BR-072: Migration Balance Transfer Rule (monetary transfers, non-monetary lost)** ← REQ-165
- **BR-073: Multi-SIM Pricing Rule (plan-based, e.g., Platino: first free, second 25 Riyal)** ← REQ-188
- **BR-074: Number Category Rule (Free/Paid, paid can become free by plan)** ← REQ-222, REQ-272, REQ-296
- **BR-075: Direct Number Reservation from Siebel Generally Disallowed** ← REQ-023, REQ-031, REQ-214
- **BR-076: Credit Limit Default by Nationality (1000 expat / 50 HRN)** ← REQ-079, REQ-191, REQ-193, REQ-218, REQ-220, REQ-284
- **BR-077: QID Physical Presence and Scan Requirement for Retail Transactions** ← REQ-081, REQ-210
- **BR-078: ID Attachment Exemption for No-Change Transactions** ← REQ-081
- **BR-079: Security Question Mandatory Set (QID + Account/Holder Name)** ← REQ-014, REQ-081
- **BR-080: Lighter Contact-Center Verification for Registered Number Callers** ← REQ-143, REQ-208, REQ-292
- **BR-081: Eligibility-First Gating for Fixed-Line (customer + location clubbed)** ← REQ-011, REQ-083, REQ-145, REQ-146, REQ-153, REQ-188, REQ-255
- **BR-082: KID-in-Use Mandatory Order Task and Contract Attachment** ← REQ-084, REQ-115
- **BR-083: Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)** ← REQ-062, REQ-077, REQ-078, REQ-085, REQ-140, REQ-145, REQ-146, REQ-153, REQ-166, REQ-184, REQ-191, REQ-198, REQ-201, REQ-208, REQ-222, REQ-231, REQ-262, REQ-296
- **BR-084: Fixed Plan Default Triple-Play with Optional IPTV** ← REQ-252
- **BR-085: FNP Hidden Pending Fix (execution date unreliable)** ← REQ-087
- **BR-087: Fixed-Line Cancellation Window (up to network activation, with win-back)** ← REQ-011, REQ-145, REQ-146, REQ-153, REQ-162, REQ-255
- **BR-088: Fiber-First Selling Policy for FWA** ← REQ-093
- **BR-089: Self-Serve Instant Activation Restricted to Standard Customers** ← REQ-089, REQ-130, REQ-143, REQ-253, REQ-254
- **BR-092: FWA Outdoor Install Fallback to Indoor** ← REQ-092, REQ-163, REQ-164, REQ-166
- **BR-094: FWA-to-Fiber Automatic Migration Rule (stated but not implemented)** ← REQ-093
- **BR-095: Device Lock-In Period (12 months)** ← REQ-125
- **BR-097: Combo Box Password Confidentiality** ← REQ-095, REQ-143, REQ-152
- **BR-098: KID mandatory search-only lookup** ← REQ-014, REQ-187
- **BR-099: ZSB mandatory for FWA/fixed only, not mobile** ← REQ-085, REQ-112, REQ-115, REQ-173
- **BR-100: Address change creates new record with history, no in-place update** ← REQ-092, REQ-098, REQ-220
- **BR-102: Star number transfer requires postpaid commitment or prepaid payment** ← REQ-077, REQ-078, REQ-085, REQ-153, REQ-184, REQ-198, REQ-201, REQ-222, REQ-231, REQ-272
- **BR-103: Star number restoration/declaration form for numbers >= 1500 Riyal** ← REQ-166, REQ-201, REQ-211, REQ-222, REQ-272
- **BR-104: TON age validation (must not be a minor)** ← REQ-101
- **BR-105: TON pre-validate collection status before flow entry** ← REQ-100, REQ-146, REQ-148, REQ-166, REQ-170, REQ-198
- **BR-106: TON requires clearance of DOI and penalties before transfer** ← REQ-151, REQ-165, REQ-189, REQ-210, REQ-239, REQ-300
- **BR-108: Expat passport holders limited to prepaid, max 5 numbers** ← REQ-085, REQ-111, REQ-201
- **BR-109: MOI data precedence with secondary-parameter cross-check** ← REQ-106, REQ-213, REQ-293
- **BR-110: Maximum mobility lines cap (nationals unlimited, non-nationals 5 per operator)** ← REQ-218
- **BR-112: HRN upfront advance calculation** ← REQ-219, REQ-277
- **BR-113: Postpaid eligibility based on collection/blacklist status, not outstanding amount** ← REQ-077
- **BR-115: Star number entitlement by plan value** ← REQ-191, REQ-222, REQ-272, REQ-296
- **BR-116: Digital eSIM requires dummy/virtual SKU with no inventory depletion** ← REQ-107
- **BR-118: Age limit 18+ for Prepaid with minor exception process** ← REQ-111, REQ-198
- **BR-119: Passport without customer signature exception (v8.0)** ← REQ-111
- **BR-120: Postpaid minimum subscription period (Lock-in) of 3 months** ← REQ-192
- **BR-122: Credit card recovery after 90 days unpaid** ← REQ-166
- **BR-123: Minimum deposit or valid credit card for credit limit** ← REQ-079, REQ-191, REQ-192, REQ-218, REQ-220, REQ-284
- **BR-124: Reserved number 90-day hold pending QID submission** ← REQ-062, REQ-109, REQ-222
- **BR-125: Star Number lock-in tiers by value** ← REQ-222, REQ-272
- **BR-128: Home Fibre and GigaHome/5G Home require supplementary signed forms** ← REQ-115, REQ-129, REQ-182, REQ-305
- **BR-131: Cellular phone number format validation (974 prefix, 11 digits)** ← REQ-109, REQ-140
- **BR-133: Passport format validation (4-20 alphanumeric)** ← REQ-209, REQ-295
- **BR-136: Email format validation** ← REQ-091
- **BR-139: Contact under 18 flagged** ← REQ-308
- **BR-140: Safwa/Qatari contact creation requires authorization** ← REQ-145, REQ-154, REQ-177
- **BR-141: Retail cannot change primary contact** ← REQ-122
- **BR-142: Bill calculator SMS is a capability, not a journey** ← REQ-123, REQ-192
- **BR-143: Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission)** ← REQ-082, REQ-119, REQ-120, REQ-121, REQ-181, REQ-203, REQ-295
- **BR-144: 86.7% of CRM feature rows lack a confident User Journey parent** ← REQ-119, REQ-120, REQ-121
- **BR-145: GigaHome Fair Usage Policy throttle rule** ← REQ-124
- **BR-146: GigaHome lock-in and early-termination fee calculation** ← REQ-125
- **BR-147: LAN cabling / Home Move fee calculation** ← REQ-094, REQ-131, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-148: Free-months offer once-per-QID eligibility rule** ← REQ-083, REQ-128, REQ-188
- **BR-149: 5G Home reasonable-use / location restriction rule** ← REQ-131
- **BR-150: Mandatory Fibre migration within 4 weeks / disconnection rule** ← REQ-115, REQ-126, REQ-127
- **BR-151: Duplicate-fiber-at-address routing rule (home move lead)** ← REQ-094, REQ-131, REQ-134, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-152: Device-type fulfilment routing rule (CPE/ONT vs 5G)** ← REQ-134, REQ-143, REQ-166, REQ-169
- **BR-153: Non Prepatched KID skips device-locate step** ← REQ-143, REQ-152
- **BR-154: Cross-sell offer locks plan and add-on/discount selection** ← REQ-135, REQ-137, REQ-190, REQ-191, REQ-197, REQ-212, REQ-221, REQ-296
- **BR-155: QID immutable after Cross Sales redirect** ← REQ-135, REQ-136, REQ-190, REQ-209, REQ-212, REQ-213
- **BR-156: ECR Details field is Fulfilment-team-only** ← REQ-062, REQ-136, REQ-139, REQ-165
- **BR-157: Alt. phone # must be a local mobile number (notification contact)** ← REQ-140, REQ-153, REQ-208, REQ-292, REQ-299, REQ-302
- **BR-158: Appointment booking irreversibility rule** ← REQ-138, REQ-161, REQ-164, REQ-185
- **BR-159: Empty add-on/discount selector rule** ← REQ-137, REQ-221
- **BR-160: Device-detection prompt determines Instant vs Normal Activation eligibility** ← REQ-089, REQ-143, REQ-166, REQ-176, REQ-253, REQ-254
- **BR-161: Rejection reason drives which evidence must be re-collected on correction** ← REQ-148, REQ-149, REQ-183
- **BR-162: Single correction round-trip rule (no second Reject-Correction)** ← REQ-113, REQ-150, REQ-157
- **BR-163: Prepatched Non Combo Box topology skips shared-infrastructure step** ← REQ-095, REQ-143, REQ-152
- **BR-164: Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject** ← REQ-104, REQ-145, REQ-146, REQ-147, REQ-150, REQ-151, REQ-157, REQ-182, REQ-189, REQ-200, REQ-210, REQ-215, REQ-239, REQ-240, REQ-242, REQ-300
- **BR-165: 90-Day Temporary Number Rule for Non-Resident ID Types** ← REQ-153, REQ-296
- **BR-166: Instant Activation Bypasses Appointment Booking** ← REQ-089, REQ-138, REQ-143, REQ-161, REQ-164, REQ-253, REQ-254
- **BR-167: Get IPTV Mandatory Field on Contact Step** ← REQ-117, REQ-145, REQ-177, REQ-184, REQ-189
- **BR-168: Qatari ID Front/Back Photo Upload Mandatory** ← REQ-145, REQ-147, REQ-210
- **BR-169: B2B2C Order Requires Proof of Employment Attachment** ← REQ-115, REQ-147, REQ-182
- **BR-170: B2B2C With Approval Requires Manager Sign-off Before Provisioning** ← REQ-146, REQ-147, REQ-150, REQ-151, REQ-155, REQ-156, REQ-181, REQ-182, REQ-189, REQ-204, REQ-210, REQ-300
- **BR-171: Manager Approve Action Requires Document Verification Acknowledgement** ← REQ-147, REQ-151, REQ-189
- **BR-172: Order Rejection Reasons Trigger SMS Notification to Agent** ← REQ-149, REQ-241
- **BR-173: Order Approval Reject Reason Taxonomy** ← REQ-157, REQ-203
- **BR-174: Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)** ← REQ-091, REQ-097, REQ-170, REQ-249
- **BR-177: SIM Serial Required Before Continue** ← REQ-145, REQ-146, REQ-165, REQ-166, REQ-170, REQ-171, REQ-182, REQ-280
- **BR-178: SIM Serial Must Be 19 Digits** ← REQ-166, REQ-171, REQ-280
- **BR-179: SIM Must Exist in UIM Inventory** ← REQ-165, REQ-166, REQ-171
- **BR-180: SIM Must Not Already Be Assigned in UIM** ← REQ-165, REQ-171
- **BR-181: CPE Serial Must Be Free (Unassigned) in UIM** ← REQ-143, REQ-166, REQ-168, REQ-171
- **BR-182: Supplementary Form Mandatory for FWA CAF Step** ← REQ-088, REQ-115, REQ-129, REQ-146, REQ-174, REQ-177, REQ-182, REQ-184, REQ-201, REQ-243
- **BR-183: Free Number Reservation Priced at QR0.00** ← REQ-023, REQ-031, REQ-214, REQ-222
- **BR-184: Order Status Progression: Pending -> Open -> Complete** ← REQ-166, REQ-225, REQ-279
- **BR-185: CPE/Attribute-Only Modification Order Is Zero-Charge** ← REQ-166, REQ-169
- **BR-187: HRN Customer Advance Payment Requirement** ← REQ-219, REQ-277
- **BR-188: FWA/GigaHome Plan Minimum Subscription Period of 3 Months** ← REQ-064
- **BR-189: CAF Digital Signature Timestamped With Signing Agent Identity** ← REQ-047, REQ-146, REQ-174, REQ-176, REQ-178, REQ-227, REQ-239, REQ-243, REQ-306
- **BR-191: WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending** ← REQ-014, REQ-143, REQ-148, REQ-151, REQ-166, REQ-167, REQ-170, REQ-186, REQ-189, REQ-210, REQ-216, REQ-253, REQ-300
- **BR-192: No Duplicate Kahramaa ID Installation Check (30-Day Lookback)** ← REQ-131, REQ-186
- **BR-193: Appointment Booking Capacity/Slot Full Rule** ← REQ-086, REQ-138, REQ-161, REQ-164
- **BR-194: Advance Payment Required for HRN Customer** ← REQ-219, REQ-277
- **BR-195: Address Required Fields Before Saving** ← REQ-091, REQ-097, REQ-145, REQ-146, REQ-170, REQ-182
- **BR-196: Appointment Once Booked Cannot Be Cancelled** ← REQ-138
- **BR-197: CAF Email Notification to Customer** ← REQ-075
- **BR-198: Serial Number Check Required Before Service Activation** ← REQ-014, REQ-081, REQ-130, REQ-131, REQ-143, REQ-145, REQ-146, REQ-166, REQ-168, REQ-170, REQ-171, REQ-172, REQ-182, REQ-253, REQ-272, REQ-273, REQ-280, REQ-300
- **BR-199: 100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection** ← REQ-021, REQ-135, REQ-191, REQ-296
- **BR-200: Number Reservation via Free or Reserved Number Toggle** ← REQ-023, REQ-031, REQ-143, REQ-168, REQ-214, REQ-222
- **BR-201: FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile** ← REQ-011, REQ-055, REQ-062, REQ-085, REQ-140, REQ-145, REQ-146, REQ-153, REQ-162, REQ-166, REQ-173, REQ-195, REQ-208, REQ-222, REQ-255
- **BR-202: SIM Serial Number Must Be 19 Digits** ← REQ-143, REQ-166, REQ-168, REQ-171, REQ-280
- **BR-203: CPE Serial Required Before Continue** ← REQ-143, REQ-145, REQ-146, REQ-165, REQ-166, REQ-168, REQ-170, REQ-171, REQ-182, REQ-280
- **BR-204: SIM Card Must Not Already Be Assigned in UIM** ← REQ-165, REQ-166, REQ-171, REQ-280
- **BR-205: SIM Card Must Exist in UIM** ← REQ-166, REQ-171, REQ-280
- **BR-206: CPE Serial Number Must Be Free in UIM** ← REQ-143, REQ-166, REQ-168, REQ-171, REQ-222, REQ-280
- **BR-207: Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C)** ← REQ-088, REQ-115, REQ-129, REQ-145, REQ-146, REQ-170, REQ-174, REQ-182, REQ-200, REQ-201, REQ-210, REQ-239, REQ-243, REQ-273, REQ-281
- **BR-208: Order Routed to Manager Approval on Submission** ← REQ-147, REQ-151, REQ-155, REQ-156, REQ-181, REQ-204
- **BR-209: Employer/Special Management Fields Populate Only After Order Approval/Completion** ← REQ-091, REQ-136, REQ-150, REQ-166, REQ-204, REQ-223, REQ-224
- **BR-210: Approve Order Requires Verification Confirmation and Comments** ← REQ-141, REQ-147, REQ-151, REQ-189
- **BR-211: 2+ Postpaid Connections Triggers Credit-Policy Advisory** ← REQ-184, REQ-191, REQ-218
- **BR-212: Supplementary Form Mandatory Alongside CAF** ← REQ-088, REQ-115, REQ-129, REQ-146, REQ-174, REQ-182, REQ-201, REQ-243
- **BR-213: Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order** ← REQ-147, REQ-149, REQ-150, REQ-151, REQ-155, REQ-156, REQ-157, REQ-181, REQ-204, REQ-236
- **BR-214: Order Expiry SLA Timer on Pending Approval** ← REQ-075, REQ-155, REQ-158
- **BR-216: Rejection Reason Recorded** ← REQ-148, REQ-183
- **BR-218: Comments Field Must Be Non-Trivial / Meet Minimum Length** ← REQ-165, REQ-189, REQ-285
- **BR-219: Install Inventory (SNC) Must Follow Service Activation Success** ← REQ-130, REQ-166, REQ-171, REQ-179
- **BR-220: Location Must Be Fiber-Ready to Proceed with Home Move** ← REQ-094, REQ-131, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-221: First-Time Home Move Customers Eligible for Free Home Move** ← REQ-094, REQ-128, REQ-131, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-222: KID Eligibility Check for Home Move During Assess Activity** ← REQ-084, REQ-094, REQ-131, REQ-186, REQ-187, REQ-188, REQ-189
- **BR-223: Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey** ← REQ-108, REQ-119, REQ-123, REQ-135, REQ-136, REQ-146, REQ-153, REQ-162, REQ-173, REQ-174, REQ-184, REQ-190, REQ-191, REQ-192, REQ-198, REQ-202, REQ-212, REQ-213, REQ-226
- **BR-224: Bill Limit and Credit Limit Editable at Plan Selection** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-220, REQ-284, REQ-296
- **BR-225: Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-226: Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)** ← REQ-079, REQ-085, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-262, REQ-284
- **BR-227: Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-228: Default Smart/Bill Limit Must Be Communicated to Customer** ← REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-229: Add-On Requires Sufficient Bill Limit Coverage** ← REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-230: Donor Operator Field Is Read-Only/Derived, Not Agent-Editable** ← REQ-062, REQ-136
- **BR-231: Post-Port SMS Instruction: Customer Must Text 'Switch' to 151 (Cost 1 QR)** ← REQ-176, REQ-196
- **BR-232: MNP declaration: unpaid postpaid bills must be settled within 30 days of switching** ← REQ-146, REQ-174, REQ-184, REQ-190, REQ-191, REQ-192, REQ-198
- **BR-233: Prepaid MNP declaration: unused prepaid balance is lost upon switching** ← REQ-184, REQ-198
- **BR-234: MOI Validation required/auto-triggered for Contact confirmation** ← REQ-117, REQ-145, REQ-199, REQ-209, REQ-295
- **BR-235: SIM Serial entry triggers number reservation check** ← REQ-023, REQ-031, REQ-143, REQ-166, REQ-168, REQ-171, REQ-214, REQ-280
- **BR-236: Fixed Pre-sales = Yes requires Preferred Time and address capture** ← REQ-146, REQ-202, REQ-220, REQ-306
- **BR-238: Reject Lead requires Reject Reason Code and Reject Comment** ← REQ-148, REQ-151, REQ-189, REQ-203, REQ-216
- **BR-239: Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back** ← REQ-067, REQ-171, REQ-207, REQ-225, REQ-233, REQ-293
- **BR-240: My Leads view filters by Lead Owner; My Created Leads filters by Created By** ← REQ-205, REQ-206, REQ-207, REQ-208
- **BR-242: Lead Owner reassignment restricted to a candidate-agent picker list** ← REQ-205
- **BR-243: Admin/back-office role has additional Reject and Retire actions on leads** ← REQ-104, REQ-157, REQ-207
- **BR-244: Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate** ← REQ-051, REQ-063, REQ-068, REQ-108, REQ-131, REQ-140, REQ-143, REQ-162, REQ-168, REQ-173, REQ-184, REQ-190, REQ-208, REQ-244, REQ-292, REQ-308
- **BR-245: QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)** ← REQ-062, REQ-109, REQ-139, REQ-171, REQ-199, REQ-201, REQ-209, REQ-210, REQ-295
- **BR-246: Two-or-more postpaid connections credit warning** ← REQ-184, REQ-191, REQ-218
- **BR-247: Cross Sales offer disposition actions (Accept/Interested/Reject/Close)** ← REQ-135, REQ-136, REQ-157, REQ-190, REQ-202, REQ-212, REQ-213, REQ-307
- **BR-248: Number reservation blocks number for reserving agent** ← REQ-023, REQ-031, REQ-214
- **BR-249: Bill Limit cannot be set below Agent Minimum Value** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-250: Maximum Bill Limit equals account Credit Limit** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-220, REQ-284
- **BR-251: Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product** ← REQ-052, REQ-057, REQ-060, REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-252: HRN (High-Risk Nationality) advance payment requirement** ← REQ-219, REQ-277
- **BR-253: Account pre-approved credit limit defaults from Expatriate/Qatari classification** ← REQ-079, REQ-191, REQ-192, REQ-218, REQ-220, REQ-284
- **BR-254: Agent-editable Credit Limit from a preset value list** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-218, REQ-220, REQ-284
- **BR-255: Credit Limit override persists back to account record** ← REQ-079, REQ-191, REQ-218, REQ-220, REQ-224, REQ-284
- **BR-256: B2B2C Company Name linkage during Contact step** ← REQ-145, REQ-154, REQ-177, REQ-184, REQ-222, REQ-223
- **BR-257: B2B2C order requires manager approval before fulfillment** ← REQ-147, REQ-150, REQ-151, REQ-155, REQ-156, REQ-181, REQ-182, REQ-189, REQ-204, REQ-210, REQ-300
- **BR-258: Order Expiry / approval SLA window** ← REQ-155, REQ-158
- **BR-259: Manager approval requires document verification acknowledgement** ← REQ-147, REQ-151, REQ-155, REQ-156, REQ-181, REQ-189, REQ-204
- **BR-260: Default Bill Limit must be communicated to customer** ← REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-261: ECR Details entry restricted to Fulfillment team** ← REQ-139, REQ-209
- **BR-262: Add-on selection constrained by Bill Limit headroom** ← REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284, REQ-296
- **BR-263: Proof of Employment mandatory for B2B2C attachments** ← REQ-115, REQ-182
- **BR-264: B2B2C without pre-existing Special Management completes without approval** ← REQ-068, REQ-097, REQ-155, REQ-184, REQ-223, REQ-224, REQ-270
- **BR-265: Special Management account flag triggers B2B2C override prompt** ← REQ-030, REQ-154, REQ-223, REQ-224
- **BR-266: Orders on accounts with Special Management/multiple postpaid lines route to Pending approval** ← REQ-155, REQ-174, REQ-181, REQ-182, REQ-184, REQ-223, REQ-224, REQ-237
- **BR-267: Number reservation generates a unique reservation token** ← REQ-023, REQ-031, REQ-214
- **BR-268: HRN/Credit-Limit variant routes order to manager approval rather than auto-completion** ← REQ-051, REQ-063, REQ-068, REQ-079, REQ-108, REQ-147, REQ-155, REQ-156, REQ-181, REQ-190, REQ-191, REQ-204, REQ-218, REQ-220, REQ-244, REQ-284
- **BR-269: Minimum Subscription Period of 3 months applies to certain postpaid plans** ← REQ-192
- **BR-272: Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only** ← REQ-135, REQ-212, REQ-228, REQ-229, REQ-298, REQ-307
- **BR-273: Migration order fulfilled asynchronously via backend bulk job queue** ← REQ-228, REQ-230
- **BR-274: Connection count check before conversion (existing prepaid/postpaid line counts shown)** ← REQ-024, REQ-077, REQ-078, REQ-085, REQ-097, REQ-145, REQ-146, REQ-153, REQ-166, REQ-173, REQ-182, REQ-184, REQ-198, REQ-213, REQ-231
- **BR-275: Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times** ← REQ-145, REQ-155, REQ-213
- **BR-277: FDO maximum 30 days ahead** ← REQ-233
- **BR-278: FDO modification/cancellation only allowed while status is Initial** ← REQ-059, REQ-166, REQ-234
- **BR-280: Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers** ← REQ-146, REQ-184, REQ-191, REQ-192, REQ-209, REQ-218, REQ-295
- **BR-281: Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront** ← REQ-078, REQ-146, REQ-184, REQ-191, REQ-192, REQ-218, REQ-300
- **BR-283: Disconnection FDO can only be raised via Siebel, cancellable only by retention team** ← REQ-054, REQ-073, REQ-165, REQ-232, REQ-234, REQ-240, REQ-308
- **BR-284: Automatic 3x retry for FDO failures caused by open orders** ← REQ-232, REQ-235
- **BR-285: Order cannot be dropped without going through Approval** ← REQ-236
- **BR-286: SIM Swap rejection drops (cancels) the order** ← REQ-237
- **BR-287: Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)** ← REQ-077, REQ-078, REQ-085, REQ-111, REQ-114, REQ-147, REQ-184, REQ-198, REQ-201, REQ-209, REQ-210, REQ-231, REQ-295, REQ-307
- **BR-288: Max two postpaid mobiles per expat QID (business rule, though technically five allowed)** ← REQ-109, REQ-128, REQ-192, REQ-218
- **BR-289: Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan** ← REQ-064, REQ-125, REQ-222, REQ-272, REQ-296
- **BR-290: CAF/attachment size limit ~4MB** ← REQ-147, REQ-182, REQ-200, REQ-215, REQ-220, REQ-242, REQ-250
- **BR-291: Signed CAF must not be editable after signing** ← REQ-146, REQ-175, REQ-176
- **BR-292: Port-out requires zero overdue/outstanding and cleared device instalments** ← REQ-300
- **BR-295: Fiber instant vs non-instant activation determined by back-end box type, not customer choice** ← REQ-089, REQ-130, REQ-132, REQ-133, REQ-143, REQ-152, REQ-162, REQ-253, REQ-254
- **BR-296: MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)** ← REQ-040, REQ-141, REQ-176
- **BR-298: Tablet/partner orders require channel-manager approval before submission** ← REQ-115, REQ-146, REQ-147, REQ-150, REQ-151, REQ-155, REQ-156, REQ-181, REQ-182, REQ-200, REQ-204, REQ-254, REQ-306
- **BR-299: Partner visibility restricted to own orders/leads** ← REQ-205
- **BR-300: Order Billing Profile must match Line Items' Billing Profile** ← REQ-001, REQ-013, REQ-025, REQ-034, REQ-162, REQ-195, REQ-278, REQ-293
- **BR-301: Business account open-order block** ← REQ-279
- **BR-302: SIM Card serial number mandatory** ← REQ-014, REQ-143, REQ-166, REQ-168, REQ-171, REQ-280
- **BR-304: MNP Port-In DNO verification attachment requirement** ← REQ-073, REQ-147, REQ-282
- **BR-305: Fixed Line address KID requirement** ← REQ-011, REQ-097, REQ-145, REQ-146, REQ-153, REQ-255, REQ-283
- **BR-306: Bill Limit Minimum threshold (Agent) / BL rule series 01-09** ← REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-284
- **BR-307: Bill Limit cannot exceed Credit Limit** ← REQ-079, REQ-191, REQ-192, REQ-193, REQ-195, REQ-197, REQ-218, REQ-220, REQ-284
- **BR-308: IoT vs Non-IoT MSISDN length rule** ← REQ-285
- **BR-309: iWatch/RIO max one per order** ← REQ-128, REQ-218
- **BR-312: Bulk SMS one-active-per-account rule** ← REQ-128, REQ-193, REQ-218
- **BR-313: Bulk SMS mandatory attachment rule** ← REQ-115
- **BR-315: Account-level APN uniqueness** ← REQ-026
- **BR-316: Deposit Service Bundle one-per-account rule** ← REQ-026, REQ-081, REQ-128, REQ-218
- **BR-319: Star Number pricing/approval rule** ← REQ-222, REQ-268, REQ-272
- **BR-321: ALP account existence / default billing profile cross-check** ← REQ-001, REQ-013, REQ-034, REQ-278, REQ-293
- **BR-323: MSISDN required to create a Siebel lead from RFS Portal** ← REQ-259, REQ-291
- **BR-324: Instant Activation restricted to tablet channel** ← REQ-089, REQ-143, REQ-253, REQ-254, REQ-306
- **BR-325: Address lock after RFS feasibility check** ← REQ-166, REQ-247, REQ-251
- **BR-326: Proof-of-address file size cap (2MB)** ← REQ-242, REQ-250
- **BR-327: Number type branching: Normal vs Star Number** ← REQ-143, REQ-222, REQ-272
- **BR-330: ID type branching: QID vs Other ID/Passport** ← REQ-209, REQ-210, REQ-295
- **BR-332: Bill period non-editable in bill profile capture** ← REQ-191, REQ-218, REQ-293, REQ-294
- **BR-333: J023 Modify Order Initiation and Submission (Suspension)** ← REQ-299, REQ-300, REQ-301
- **BR-334: Suspension Eligibility Requires Cleared Unbilled Balance** ← REQ-293, REQ-300
- **BR-335: Resume Reverts to Base Plan Billing** ← REQ-252, REQ-296
- **BR-337: Base Plan Sourced from Launch X on Resume** ← REQ-252, REQ-296
- **BR-338: Ticket/Order Approval Required for Suspension and Resume** ← REQ-301
- **BR-339: Payment Capture via WinCash for Suspension/Resume Orders** ← REQ-049, REQ-103, REQ-159, REQ-294, REQ-301
- **BR-340: Prepaid Channel Migration: ECR to VSA** ← REQ-077, REQ-078, REQ-104, REQ-114, REQ-245
- **BR-341: Disconnection Ticket Closure Auto-Creates Disconnection Order** ← REQ-061, REQ-065, REQ-067
- **BR-342: MNP Port Out Ticket Auto-Created from NPAS** ← REQ-061, REQ-065, REQ-067, REQ-073, REQ-282, REQ-308
- **BR-343: MNP Port Out Activity Validation and Auto Status Change** ← REQ-042, REQ-061, REQ-189, REQ-209, REQ-282
- **BR-344: SMS Content Controlled Within Teams** ← REQ-241
- **BR-345: Ticket Field Ownership by Role (Front Line vs Complaints Team)** ← REQ-054, REQ-139, REQ-145, REQ-165, REQ-304, REQ-308
- **BR-346: Ticket Auto-Assignment to Queue** ← REQ-061, REQ-065, REQ-067, REQ-074

### Persona → Requirements

- **PERSONA-002: Account Manager** ← REQ-030
- **PERSONA-004: Fulfilment Agent / Fulfilment Team** ← REQ-011, REQ-014, REQ-020, REQ-042, REQ-045
- **PERSONA-006: Credit Control / Collection & Credit Control** ← REQ-002
- **PERSONA-011: Technical Contact** ← REQ-027
- **PERSONA-017: Manager/Approver (Delegation of Authority / DOA hierarchy)** ← REQ-003

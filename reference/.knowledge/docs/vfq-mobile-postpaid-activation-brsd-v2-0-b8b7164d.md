---
slug: vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d
source: /Users/parithimalsaravanan/claude-projects/vfq/data/VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx
sha256: 0719311d42aa5b04613d01f94c692ad0dd34117156b8b8f3f76a9db043d62f84
indexed: 2026-08-20
confidence: high
---

# VFQ Mobile Postpaid Activation BRSD (Business Requirements Specification Document) v2.0

**Type:** requirements / design spec (formal Business Requirements Specification Document workbook)
**Owner / author:** Prepared by Wipro Limited; Prepared for Vodafone Qatar. Stakeholder roles (Business Owner, IT Owner, Solution Architect, Delivery Manager, Test Manager) all listed as "To be confirmed."
**Date:** Version 1.0 dated 2026-08-09; Version 2.0 dated 2026-08-10 (this file); Status "Draft for Review"

## Purpose
Formal, atomised, testable business requirements specification for the Mobile Postpaid Activation journey through the retail assisted channel (up to order submission), serving as the "reusable core" that the Fibre BRSD and other journey BRSDs point back to for shared capabilities.

## Key content
- **Document reference**: VFQ-BRSD-MOB-POST-ACT-RET. **Use case**: MOB_POST_ACT_RETL_001 — "Customer Purchasing Postpaid Mobile plan through Retail Agent." Channel: Retail Store, Assisted. Source systems: Siebel CRM, Order Management, UIM.
- **Version history**: v1.0 (2026-08-09) — full restructure, requirements atomised/testable, governance/business-rule/data/integration/NFR/status-model/open-item/traceability sheets introduced, conflicts between requirement text and VFQ responses resolved or raised as open items. v2.0 (2026-08-10) — acceptance criteria updated for 18 named requirements (MPAR_001_JSM_07, KYC_20, CAM_04/11, ECC_11/18/19, BAM_02/10/13, QPC_10, NUM_11, SIM_07, CVC_06, CAF_02, ORD_11, NOT_06/07).
- **10 sheets**: 00_Cover, 01_Document_Control, 02_Glossary (29 terms incl. HRN, ICCID, IDWise, MADA, Medilia, MPI, Qnomy, WinCash), 03_Scope (28 rows), 04_Capability_Summary (13 capabilities CAP-01..CAP-13, 30 rows), 05_Requirements (197 rows), 06_Business_Rules (100 rows, BR-xxx), 07_Integrations (14 rows, INT-xx), Annex_01_Data_Fields (86 rows, DF-xx), Annex_02_Status_Model (17 rows).
- **Scope**: retail-store assisted channel only; new mobile postpaid products; new customer and existing-customer-adding-a-connection; identity types QID/Passport/GCC/Diplomatic ID; number types Reserved/Star/Free; SIM types Physical/Printed eSIM/Virtual eSIM; contract via digital CAF or offline-signed paper CAF for back office; payment upfront via WinCash covering deposit, HRN advance, premium number charge. Out of scope: everything after order submission (separate Order Fulfilment journey).
- **13 capabilities**, all marked "New": CAP-01 Journey and Session Management (Qnomy, DXP, Siebel CRM), CAP-02 Customer Identification and Verification/KYC (IDWise, MOI), CAP-03 Customer and Account Management, CAP-04 Eligibility and Credit Control (BRM), CAP-05 Billing Account Management, CAP-06 Product Catalogue and Cart (EPC), CAP-07 Number Management (UIM, ODS), CAP-08 SIM Management, CAP-09 Cart Validation & Check Out, CAP-10 Contract and Documentation/CAF, CAP-11 Payment and Inventory (WinCash, BRM, UIM), CAP-12 Order Submission, CAP-13 Notification and Feedback (Notification Platform, Medilia).
- **Representative requirements**: `MPAR_001_JSM_01`..`08` (journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix, Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable, automatic Tracking Record creation, milestone/draft-order persistence for resume). Requirement priorities use Must/Should/Could; Change Category uses AS-IS/Minor Enhancement/Major Enhancement/New/GAP (defined explicitly on sheet 04, "from Technology & Scope perspective" — distinct wording from the Fibre BRSD's category definitions).
- **Assumptions/Dependencies**: A-01 Siebel CRM remains system of record; A-02 existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change unless stated; A-03 catalogue/eligibility/discount/number-pricing rules are configuration, not hard-coded; A-05 UI/UX supplied by VFQ but aligned to proposed capabilities/journeys. Dependencies D-01..D-08 include: VFQ to supply field-level spec gaps (D-01), Product team to supply plan-price-to-Star-Number-price eligibility matrix (D-02), CAF template matrix by role/channel/service type (D-03), Qnomy MPI API spec (D-04), notification templates/triggers/recipients (D-05), test environment access (D-06), Collections to confirm outstanding-dues thresholds (D-07), HRN advance payment matrix (D-08).

## Cross-references
- This is the "reuse target" that VFQ_Fibre_BRSD_v1.2.xlsx (this batch) explicitly points back to for CAP-01 through CAP-13 — Open Item OI-23 in the Fibre BRSD flags that this document must be baselined for those cross-references to resolve to stable identifiers.
- Directly builds on the mobile postpaid guided-journey walkthrough (ID scan, connection limits, address, SIM serial, plan, add-ons, star/free/reserved number, CAF signature, submission) demonstrated in this batch's "IT stack modernization Existing processes Giga-26" meeting transcript.
- The J011 "Mobile Post-Paid Customer onboarding Journey" flow diagram and capability/journey mapping in VFQ_Stack Modernization_BR_25Jun.pptx (this batch) is an earlier-stage visual precursor to this formalised BRSD.
- Overlaps with Order Validation Business Rules.xlsx (this batch) for as-is Siebel-side validation logic this BRSD's business-rule sheet (BR-xxx) would need to reconcile with or supersede.

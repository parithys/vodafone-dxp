---
slug: vfq-fibre-brsd-v1-2-068eebe3
source: /Users/parithimalsaravanan/claude-projects/vfq/data/VFQ_Fibre_BRSD_v1.2.xlsx
sha256: 91c209f18d3b9afda57fc5d55dc3e9e7024c81b74457efb4a6575690b13c45db
indexed: 2026-08-20
confidence: high
---

# VFQ Fibre Activation BRSD (Business Requirements Specification Document) v1.2

**Type:** requirements / design spec (formal Business Requirements Specification Document workbook)
**Owner / author:** Prepared by Wipro Limited; Prepared for Vodafone Qatar. Stakeholder roles (Business Owner, IT Owner, Solution Architect, Track Lead, Test Manager) are all listed as "To be confirmed" — no individuals named yet.
**Date:** Document date 06 August 2026; Version 1 (label "v1.2" in filename); Status "Draft for Review"

## Purpose
Formal, atomised, testable business requirements specification for Fibre and Fixed Wireless Access (FWA) activation under the VFQ IT Stack Modernisation programme, covering the retail/field-agent assisted channel end to end from address capture through order submission and fulfilment.

## Key content
- **Document reference**: VFQ-BRSD-FIB-ACT-RTL. **Use cases in scope**: (1) Fiber Activation through Retail Agent (FIB-ACT-RTL-001), (2) Fiber Instant Activation (FIB-ACT-RTL-002), (3) Fixed Line Migration (FIB-MIG-RTL-003), (4) Home Move (FIB-HMV-RTL-004), (5) Fixed Line Port In (FIB-FPI-RTL-005), (6) Fixed Line Port Out (FIB-FPO-RTL-006), (7) Fiber Termination (FIB-TER-RTL-007), (8) Fixed Line RFS (FIB-RFS-008). Channel: Retail Store and Field Agent, Assisted. Source systems: Siebel CRM, Order Management, RFS Portal, UIM, IMS, WFM, Billing, NPAS.
- **11 sheets**: 00_Cover, 01_Document_Control (35/16 rows), 02_Glossary (30 terms), 03_Scope (38 rows: in/out of scope + 9 assumptions A-01..A-06 + 9 dependencies D-01..D-09), 04_Capability_Summary (25 capabilities CAP-01..CAP-25, 65 rows), 05_Requirements (178 rows of atomic Req IDs), 06_Business_Rules (175 rows, BR-xxx), 07_Integrations (20 rows, INT-xx), 08_Open_Items (37 rows, OI-01..OI-29+), Annex_01_Data_Fields (135 rows, DF-xx), Annex_02_Status_Model (33 rows).
- **Scope**: in-scope journeys are fibre/FWA-indoor/FWA-outdoor activation, instant activation, migration (FWA→fibre), home move, fixed number portability (port in/out), fibre/FWA termination, RFS data ingestion/portal, WFM appointment/execution, retention pre-termination handling, digital/offline CAF. Out of scope: enterprise/SMB fibre, digital self-serve fibre, plan change/in-life mods other than migration/home-move, everything after order submission (separate Order Fulfilment journey).
- **25 capabilities** (CAP-01..CAP-25), each tagged Reuse/Enhance/New, e.g. CAP-14 Installation Address and Service Feasibility (New, RFS Portal), CAP-15 Appointment/WFM (New), CAP-18 Instant Activation (New), CAP-19 Fiber Connection Migration (New), CAP-20 Home Move (New), CAP-21/22 FNP Port In/Port Out (New), CAP-23 RFS Data Management (New, ties to GIS/IMS/RFS Portal/Big Data), CAP-25 Fibre Termination (New). Many core capabilities (CAP-01 to CAP-13: Journey/Session, KYC, Customer/Account, Eligibility/Credit, Billing Account, Catalogue/Cart, Number, SIM, Cart Validation, CAF, Payment, Order Submission, Notification) are marked "Reuse" pointing to the Mobile Postpaid BRSD (MOB_POST_ACT_RETL_001).
- **Representative requirements** (Req ID | statement | priority | Business Rule/Data/Integration refs): `FAR_001_RFS_01`..`08` (installation address capture, cascading zone/street/building selection, RFS search by address/KID/area, address auto-fill, service-type display, CPE/ONT detection, address lock after check, proof-of-address upload ≤2MB); `FAR_001_QPC_02/03` (IPTV bundled by default with base plan, removable — flagged in Open Items as contested with VFQ business preference); `FAR_002_INS_01`..`07` (Instant Activation: eligibility detection, device serial verification, instant/normal explicit selection, appointment auto-skip, immediate activation trigger, failure handling, tablet-only channel constraint); `FIB_MIG_RTL_003_01`..`07` (migration eligibility, verification, service availability, existing-service retrieval, order capture, WFM appointment, telesales collection flags).
- **Open Items (OI-01..OI-29+)** — critical governance risk OI-01: "no populated requirement status, owner or traceability identifier in any of the fourteen sheets" (noted as resolved in v2.0); OI-03/OI-18 unresolved tensions between requirement text and VFQ business preference on IPTV/STB removal flexibility; OI-04 fibre outstanding-dues threshold contradiction (should differ from mobility vs should be same); OI-11/OI-12 open GTM data-flow frequency and VFID/KID mapping rule questions (mirrors the "IT Stack modernization Overview of RFSVodafone IDIMS Systems" meeting transcript in this batch); OI-16 no non-functional requirements stated at all (Critical, VFQ IT); OI-21 enterprise/SMB fibre scope gap flagged as material risk; OI-23 dependency on Mobile Activation BRSD being baselined for stable cross-references; OI-29 FNP process diagram needed.

## Cross-references
- Explicitly reuses/depends on VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx (also in this batch) for CAP-01 through CAP-13 (Journey/Session, KYC, Customer/Account, Eligibility/Credit, Billing Account, Catalogue/Cart, Number, SIM, Cart Validation, CAF, Payment, Order Submission, Notification) — Open Item OI-23 flags this as a formal dependency requiring the mobile spec to be baselined first.
- Directly builds on the RFS/IMS/Vodafone ID architecture explained in this batch's "IT Stack modernization Overview of RFSVodafone IDIMS Systems" meeting transcript (CAP-14, CAP-23).
- Builds on the fixed/fibre and appointment/instant-activation journey walkthrough in this batch's "IT stack modernization Existing processes Giga-26" meeting transcript.
- Overlaps with Order Validation Business Rules.xlsx (this batch) for as-is KID/address validation logic (e.g. `ORD_VALD_RULE_161` "FL Address must have KID in it").

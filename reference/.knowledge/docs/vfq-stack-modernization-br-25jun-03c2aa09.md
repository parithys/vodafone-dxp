---
slug: vfq-stack-modernization-br-25jun-03c2aa09
source: /Users/parithimalsaravanan/claude-projects/vfq/data/VFQ_Stack Modernization_ BR_25Jun.pptx
sha256: 4e19ef72f5a1dcd651757bde7c28b9ea94f4a043cd426e4fa9810ef665aa4e31
indexed: 2026-08-20
confidence: high
---

# VFQ Stack Modernization — Business Requirements Workshop, Day 1 (25 June 2026)

**Type:** deck (business requirements workshop deck, partly a wireframe walkthrough)
**Owner / author:** not individually named; branded "Vodafone Qatar" / labelled "Internal wireframes - DXP Sales Agent - Confidential"
**Date:** 25 June 2026 (stated on slide 1, "Day 1" of the workshop session)

## Purpose
Kickoff deck for Day 1 of the "BSS/OSS IT Stack Modernization Partnership" business requirement discussion workshop, introducing the reusable-capability concept across journeys, walking through the Post-Paid Customer Onboarding journey and its process flow, and presenting DXP Agent Portal wireframes for the mobile postpaid onboarding flow.

## Key content
- **21 slides total**. Slide 1: title slide — "BSS/OSS IT Stack Modernization Partnership, Workshop Session: Business Requirement Discussions (Day 1)", dated 25th June 2026.
- **Slide 2** — "Journeys & Capabilities - Reusability Concept": presents a reusable-capabilities model shared across Prepaid Mobile Journey and Fixed Line Journey, listing capability blocks: Authentication, e-KYC, Cart Mgmt, Payment, Approval, Inventory Mgmt., Porting Service, Document Mgmt., Order Mgmt., Checkout and Contract — repeated with slightly different subsets per journey (this is the earliest visual articulation of the "Reuse" capability tagging later formalised in the Fibre and Mobile Postpaid BRSD workbooks in this batch).
- **Slide 3** — "Post-Paid Customer Onboarding (Agent Assisted)" (section "02"): lists journey stages — CAF, KYC, Billing & Payment Profile, Carts (Plans & Top Ups), Number Reservations, SIM reservations, Device purchase (On Installment), Payment, Order Submission, Customer Communications.
- **Slide 4** — "J011: Mobile Post-Paid Customer onboarding Journey": a detailed process-flow diagram (textually flattened by extraction — original shapes/connectors not preserved) covering: Customer in QNomy → Agent in DXP; QTicket generation/receipt; ID type branching (QID → MOI Validation; Other ID / Passport → capture customer details, validate address); contact/address capture; cart browsing (base plan, add-on, number, device); plan display logic ("if QID Postpaid and Prepaid otherwise Prepaid Type"); bill profile capture (bill address, bill cycle, bill period non-editable, bill mode); SIM/MSISDN addition; number type branch (Normal vs Star Number); add-on branch (Non-Telco vs Telco); payment branch (Full Payment vs DOI — Device on Installment); CAF generation, cart checkout, order submission; CAF sign-off; payment capture via WinCash with receipt generation; ID scan; Unica Campaign reference; SIM handover options (eSIM, Physical SIM - Handover now, Physical SIM - Deliver).
- **Slides 5-17** — a 13-page DXP Agent Portal wireframe sequence (labelled "Page 1 of 13" through "Page 13 of 13", "Internal wireframes - DXP Sales Agent - Confidential"): Home → Step 1 Customer Details → Step 2 ID Verification (IDWise) → Step 3 Eligibility Check → Step 4 Product Selection → Step 5 Device on Installment → Step 6 Number & SIM → Step 7 Cart/Checkout → Step 8 Billing → Step 9 Payment → Step 10 Confirm & e-Sign → CAF (Customer Application Form) → Step 11 Activation. (Actual wireframe imagery not extracted — only slide titles/labels captured as text.)
- **Slide 18** — "Key Take aways" (section "03"): lists discussion categories for the workshop — Journeys, Capabilities, UX, Business Rules, Communication Templates, Integration points, Volumetric, Assumptions, Constraints.
- **Slide 19** — "BRSD Template" (section "03") — a placeholder/reference slide, presumably introducing the BRSD document template later used for VFQ_Fibre_BRSD and VFQ_Mobile_Postpaid_Activation_BRSD.
- **Slide 20** — "Back Up Slides" (section "04").
- **Slide 21** — "Capability and Journey mapping" — title only; underlying table/diagram content not extracted as text.

## Cross-references
- This deck is the visual/conceptual precursor to VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx (this batch): the J011 journey on slide 4 and the DXP wireframe steps (slides 5-17) map closely onto that BRSD's CAP-01..CAP-13 capabilities and MPAR_001_* requirement IDs (KYC via IDWise, eligibility/credit control, catalogue/cart, number/SIM management, CAF, payment via WinCash, order submission).
- The "Journeys & Capabilities - Reusability Concept" on slide 2 is the origin of the "Reuse" tagging later used formally in VFQ_Fibre_BRSD_v1.2.xlsx's capability summary (CAP-01..CAP-13 marked "Reuse (MOB_POST_ACT_RETL_001)").
- Slide 19 "BRSD Template" likely precedes and structurally anchors both BRSD workbooks in this batch.

## Extraction notes
Confidence is marked high per the extraction log (3,708 characters via python-pptx, no OCR flagged), but note that slides 5-17 and 21 are wireframe/diagram-heavy — only slide titles and page labels were extracted as text; the actual UI mockup content, field layouts, and the capability/journey mapping table on slide 21 are not captured in this text extraction and would require visual review of the original file for full detail.

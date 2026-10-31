---
slug: consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Consumer Activation ProcessProcedure_Ver _8.0_WM_22022024 2024.pdf
sha256: 91a36d235679c299e31c651ebfd5289f8116b7459877716b86b02fd608ca2ffd
indexed: 2026-08-20
confidence: high
---

# Consumer Mobile Activation Process & Procedure Manual (Version 8.0)

**Type:** design spec (formally: a process/procedure manual — operational SOP document with embedded process-flow diagrams and business-rule tables)
**Owner / author:** Created by Ellen Ciudad (original, 2014); current version authored/maintained by Wainey Mathews. Owned by COPS & Digital (Customer Operations).
**Date:** Version 8.0, effective July 2, 2024 (last revised); originally created April 24, 2014. Filename also carries "22022024" (22 Feb 2024).

## Purpose
The controlled procedure manual governing how Vodafone Qatar activates Consumer (Prepaid and Postpaid) mobile connections across all sales/registration channels — Direct Sales, Mass Market, Retail, Qatar Visa Center (QVC), and Offshore Airport — via ECR, Open UI, and VSA systems, with and without approval workflows.

## Key content
- **Scope (Section 1.1):** Covers Prepaid and Postpaid mobile activation, Onshore and Offshore.
  - Prepaid Onshore channels: Direct Sales (ECR & Open UI), Mass Market (ECR & VSA), Retail (ECR/Open UI desktop).
  - Prepaid Offshore channels: Qatar Visa Center (Integrated System), Offshore Airport (SFTP, VSA).
  - Postpaid Onshore channels: Direct Sales (ECR & Open UI), Retail (ECR).
  - Postpaid Offshore channels: Offshore Airport (VSA).
- **Glossary (1.2):** ECR = Electronic Customer Registration; Open UI = Siebel Open User Interface; VSA = Vodafone SIM Activation; QVC = Qatar Visa Center; CAF = Customer Application Form; POA = Power of Attorney; QSRN = Qatar Society for the Rehabilitation of Special Needs card; HRN = High Risk Nationality.
- **Document structure:** 31 pages, organized as Section 2 "Consumer Customer Activation – Prepaid" (business rules, then per-channel process flows/procedures for ECR with/without approval, Open UI with/without approval, VSA, Retail Open UI Desktop, Offshore QVC, Offshore Airport SFTP/VSA) and Section 3 "Consumer Mobile Postpaid Registration" (business rules, ECR registration/provisioning process flows, Open UI activation with/without approval, VSA onshore/offshore).
- **Revision History (1.4)** — full version log from v1.0 (April 26, 2014, Ellen Ciudad) through v8.0:
  - v1.0 (Apr 26, 2014): First version.
  - v1.1 (Sep 23, 2014): Added Device/Software Support Process, RACI, glossary, New Retailer Creation, Ordering New Device from Warehouse.
  - v2.0 (Dec 28, 2015): Introduced real-time Prepaid ECR/Siebel activation; removed offshore back-office update procedure; added quality-check business rule; added max-connections-per-ID business rule for Expatriate Prepaid; updated Device/Software support rules and POA authorization rules.
  - v3.0 (Sep 29, 2019): Added paired/unpaired SIM registration process; revised Postpaid offshore provisioning (removed all ECR statuses except "Completed"/"In-Progress"); removed post-paid registration rejection handling (Fulfilment now rejects directly, no email round-trip); revised Dealer Helpline (added English); removed Upfront Payment requirement for expats in Postpaid.
  - v4.0 (Dec 20, 2020): Updated Fixed Registration process map, business rules, procedure.
  - v5.0 (Sep 19, 2022): Added channel-specific Prepaid activation processes — Offshore QVC, Offshore Airport SFTP & VSA, ECR for Direct Sales, ECR for Mass Market, Open UI tablet for Direct Sales, VSA for Mass Market, Retail via Open UI Desktop.
  - v6.0 (Dec 26, 2023): Renamed document from "ECR Process & Procedure" to "Consumer Mobile Activation Process & Procedure"; updated all business rules/procedures/processes; removed Fiber activation section.
  - v7.0 (May 2, 2024): Added VSA Postpaid Activation with Approval offshore.
  - v8.0 (Jul 2, 2024): Added exception for prepaid activation business rules — passport without customer signature (ref 2.1.13); added mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12).
- **Approvers (1.5)** — sign-off table with 5 named approvers and functions/dates: Giritharan Anandan (Consumer Sales Channel OPS Specialist — Direct Sales, Retail & Mass Market), approved May 2, 2024; Hanif Khan on behalf of Sandeep Patil (Fixed & Mobile Fulfilment and Technical Support Manager — Fulfilment), May 2, 2024; Con Festin on behalf of Haya Al Mannai (Customer Data Management Manager), July 2, 2024; Vijay Sundaram (Collection & Credit Control Manager), April 22, 2024; Ellen Ciudad (GTM & Channel Operations Manager), December 26, 2023.
- **Prepaid Business Rules (2.1)** — includes: Customer Identification (must provide valid QID, GCC ID, Passport, or Diplomatic ID for Prepaid; GCC IDs issued in UAE/Bahrain/Oman/Saudi Arabia/Kuwait); Age Limit (customer must be 18+, with an exception process for minors requiring Supreme Judicial Council approval plus Customer Data Management team approval); rules on representatives purchasing Prepaid on behalf of a customer.
- **Process content per channel** — each activation channel (Prepaid ECR with/without approval, Open UI onshore with/without approval, VSA, Retail Open UI Desktop, Offshore QVC via Integrated Systems, Offshore Airport via SFTP, Offshore Airport via VSA) has its own numbered process-flow diagram and step-by-step procedure section; the Postpaid section (3.x) mirrors this with ECR registration, ECR provisioning business rules, Open UI activation flows, and VSA flows onshore/offshore, plus an "ECR Consumer Mobile Registration Issue Handling" process flow (3.3.4).
- Section 1.3 references an embedded attachment "ECR_activation_control_validations_&_checklist.pdf" (not independently extracted — embedded object reference only).

## Cross-references
- Referenced within its own glossary as governing CAF (Customer Application Form) usage — directly relevant to the Consumer Postpaid CAF V4 and Consumer Prepaid CAF V2 PDF templates in this batch.
- Its "GTM & Channel Operations" and "Fulfilment" functions correspond to teams/roles discussed in the Business Process and Business Workshop session transcripts in this document set.
- Likely a precursor/reference document for the stack-modernization requirements work (CRM Journeys inventory, Business Process workshops) — describes the "as-is" activation procedures the modernization project is scoping against.

## Extraction notes
None — pdftotext extraction succeeded at high confidence (148,863 chars across 31 pages, ~4,802 chars/page). One embedded PDF attachment (ECR validation checklist) is referenced by filename only and was not separately extracted; process-flow diagram images/swimlanes are described by their section headers but their visual flow content (arrows/boxes) was not captured as text.

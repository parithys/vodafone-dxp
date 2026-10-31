---
slug: crm-journeys-final-updated-with-type-634b83d3
source: /Users/parithimalsaravanan/claude-projects/vfq/data/CRM_Journeys_Final_Updated_with_Type.xlsx
sha256: a76c3ceae9107e0e1c8cb1bc78378fe1974836ad5015f7bd3639dab1a12dabe8
indexed: 2026-08-20
confidence: high
---

# CRM_Journeys_Final_Updated_with_Type (Vodafone Qatar CRM Journey Inventory with Type Taxonomy)

**Type:** data extract (Excel workbook — journey/feature catalog with an added type-classification scheme)
**Owner / author:** not stated
**Date:** not stated in content; file indexed 2026-08-20

## Purpose
A variant of the CRM Journeys master inventory that classifies each of the 165 CRM (Siebel/Open UI) journey/feature rows into one of five formal types (User Journey, Workflow/Task, View, Action, Access/Permission), to support scoping and categorization for the stack-modernization project.

## Key content
Workbook has 3 sheets:

3. **Relationship** (added 2026-08-20) — a generated end-to-end traceability model built from the 165 "Page Type" rows: User Journey → Workflow/Process → Task → View/Screen → Action → Access/Permission. Since the source data only tags each row with one flat Type and has no parent-ID column, the sheet introduces 15 analytical "Functional Clusters" to reconstruct the Workflow/Process/Task layer, documents confidence levels (High/Medium/Low/None) for every inferred User Journey link, and includes: a methodology/assumptions section, an 11-User-Journey summary, the 15 functional clusters, a full indented hierarchy tree, a 165-row Complete Traceability Matrix (Excel Table `TraceabilityMatrix`), a curated Relationship Catalogue (22 entries), Validation Checks (missing-parent / duplicate / reusability analysis), and a Gap Analysis Report (cluster completeness, orphaned records, classification inconsistencies, potentially-missing requirements, recommendations). Headline finding: 143 of 165 records (86.7%) have no confident User Journey parent — 9 of 15 functional clusters are BAU/account-servicing capability with no anchor journey. All content is static (no live formulas linking back to Page Type) since it represents a one-time analytical pass, not a recalculating model.

Original 2 sheets:

1. **Page Type** (rows 1–165, columns: #, Journey Category, Journey Type, Type, Description, Comment, Guided journey Desktop, Guided journey Tablet, Desktop vanilla, CBU, EBU, AI Comments) — same 165 journey rows as the companion "CRM Journeys_Final_Updated.xlsx" workbook, but with an added **Type** column classifying each row as one of: User Journey, Workflow/Task, View, Action, or Access/Permission. Categories present: Lead, Sales, Support, Manage, Disconnect. Examples: "Create Lead" = User Journey; "Device Installment" = Workflow/Task; "View and Manage orders" = View; "Send SMS" = Action; "TON Access" = Access/Permission. Free-text AI Comments column echoes prior annotations (e.g., "Retail cannot change primary contact," "Bill calculator SMS is not a journey but a capability," "Not a guided journey but a view").

2. **Type Taxonomy** — a 5-row lookup table defining each Type category with its definition and use case:
   - **User Journey**: Guided, multi-step workflows for customer-facing service activations (e.g., Postpaid/Prepaid signup, MNP, migration).
   - **Workflow/Task**: Operational multi-step administrative operations — order modifications, account updates, approvals.
   - **View**: Read-only data displays with no transactional capability (dashboards, historical data, audit trails).
   - **Action**: Quick single/minimal-step transactional operations (Send SMS, Post Payment, Export Data).
   - **Access/Permission**: Role/responsibility-based access controls, not a standalone functional capability.

Journey rows cover the same functional breadth as the base inventory: activations (New Postpaid, New FWA, New Fixed Line, MNP Prepaid/Postpaid, Prepaid to Postpaid), support actions (SIM Swap, TON, PTP, Passport to QID, End Data Session, PMN Suspension), and management/billing operations (Credit Limit, Bill Cycle changes, Device Change orders, OSN/IPTV modifications, Disconnects).

## Cross-references
- Near-duplicate of "CRM Journeys_Final_Updated.xlsx" (slug: crm-journeys-final-updated-a23640a5, indexed in an earlier batch) — same 165-row journey list, but this version replaces that file's "Raw"/"Open UI Features"/"Summary Combination List"/"Sheet1"/"Summary"/"Summary_Sheet1" sheets with a single "Page Type" sheet plus a new "Type Taxonomy" reference sheet. This file does not carry the project-planning/screen-count estimation sheets found in the other workbook.
- Journey types listed here map to the same items discussed in the Business Workshop Postpaid Service session transcripts and Business Process Day7–Day12 session transcripts in this document set (e.g., TON, SIM Swap, PMN Suspension, MOI Validation).
- The FWA-related rows ("New FWA") connect to the Guided Journeys/FWA docx walkthroughs in this batch (Desktop Vanilla_FWA_Indoor, Desktop Vanilla_FWA_Outdoor_WFM, Desktop Vanilla_Indoor_Modify CPE, FWA_Indoor & Outdoor_Negative Scenarios).

## Extraction notes
None — openpyxl extraction succeeded cleanly (35,453 chars) and both sheets are fully structured/tabular.

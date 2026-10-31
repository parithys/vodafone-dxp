---
slug: tt-hashtags-and-actual-issue-8d8ccaa5
source: /Users/parithimalsaravanan/claude-projects/vfq/data/TT Hashtags and Actual Issue.xlsx
sha256: a0fe27ee13de151edd5da792af49824f03f3a0b7cede578b2ae52b4324eab203
indexed: 2026-08-20
confidence: high
---

# TT Hashtags and Actual Issue

**Type:** data extract (Siebel list-of-values export for Trouble Ticket categorisation)
**Owner / author:** not stated (system export of List of Values / LOV configuration)
**Date:** not stated

## Purpose
Exports the two Siebel-configured List of Values (LOV) types used to tag and categorise Trouble Tickets (TTs) at Vodafone Qatar: `VFQA_TT_HASHTAGS` (searchable/reporting hashtags) and `VFQA_TT_ACTUAL_ISSUE` (the root-cause/actual-issue classification). Serves as the reference taxonomy for ticket categorisation logic that must be carried into, or redesigned for, the modernised CRM.

## Key content
- **Two sheets**, both sharing the same column structure: Type | Display Value | Language-Independent Code | Language Name | Parent LIC | Order | Active | Translate | Multilingual | Replication Level | Sub Type. All sampled rows are English-American, Active ("Y"), non-translated, non-multilingual, replication level "All".
- **Sheet "VFQA_TT_HASHTAGS"** — 454 rows (including header) of hashtag values used to tag trouble tickets. Wide-ranging categories observed include: network/technical (`5G Complaint _RFS location`, `5G Outdoor login issue`, `5G Site Lock`, `5G to Fiber/Fibre Migration`, `5G_Technical_Issue`, `BRM Sync Issue`), billing/adjustment (`Adjustment Posted Manually`, `Advance-Credit Logs Shared`, `Bill limit discrepancy`, `Bill Limit Issue_Reimbursement`, `Bill Limit Cannot be Blank`), customer-facing ops (`Auto-Pay Bulk Failure`, `AutoPay`/`AutoPayIssue`, `Blacklisted account`, `Balance Reserved`), device/launch campaigns (`AirpodsPro3`, `AppleWatchSE3`/`Series11`/`Ultra3`, `AppleiPhone17`/`17Air`/`17Pro`/`17ProMax`, `Apple_Store_Purchase`, `Apple_eSIMTransfer`, `Apple Launch_2025`), and a large "CCT-" prefixed family (Contact Centre Ticket sub-codes) covering agent/process quality issues: `CCT-Agent Accessibility`, `CCT-Customer Misunderstanding`, `CCT-Customer Perception`, `CCT-In-BAU Ticket Required`, `CCT-In-Duplicate`, `CCT-In-Incomplete Info`, `CCT-In-No Validation Done`, `CCT-In-Wrong Channel Selected`, `CCT-System Error (Adj)`, `CCT-VA-*` variants (Adjustment Missed, Benefits Added, Disconnected, Discount Added, Human Error, Mig Corrected & Adj). Also includes eShop-related tags (`eShop Order Delivered - SIM`, `eShop Order ID Shared`, `eShop Order Refund - Device/SIM`) and iWatch/iPhone17-specific operational tags.
- **Sheet "VFQA_TT_ACTUAL_ISSUE"** — 355 rows of root-cause/actual-issue values, largely billing and account-servicing focused: `Activate Internet Settings`, `Adjust Wrong Credit Recharged`, `Adjustment Fail/Not Reflecting`, `Advance Credit Issues`, `Auto-Pay Unposted Payment`, `Bill Delivery Issues`, `Billing Profile Issues`, `Billing and Renewal Mismatch`, and a large "CCT-" family covering request/dispute types: `CCT-Adjustment Request`, `CCT-Billing Dispute`, `CCT-Contact Details Issue`, `CCT-Disconnection Request`, `CCT-Discount Not Given`, `CCT-Fraud Activation`, `CCT-Incomplete Info shared`, `CCT-Lock-in Period Not Inform`, `CCT-MNP Request`, `CCT-No Issue Mentioned`, `CCT-Number Not Activated`, `CCT-PYN Request`, `CCT-Plan Change with Consent`, `CCT-Post/Pre migration with Consent` variants, `CCT-Promised benefit not added`, `CCT-Rude Behavior`, `CCT-TON Request`.
- The presence of very recent, campaign-specific entries (iPhone 17 series, Apple Watch Series 11/Ultra 3/SE 3 — 2025/2026-era devices) confirms this is a live, actively-maintained operational taxonomy rather than a static historical export.

## Cross-references
- Complements SMS Templates.xlsx in this batch, whose "Automatic SMS Templates" sheet carries TT Category/Area/Sub Area fields that draw on a related (if not identical) trouble-ticket taxonomy.
- Relevant background for any complaints/ticketing capability discussed in the IT stack modernization meeting transcripts in this batch (e.g., the Day 17 "Existing processes" transcript names "complaints team (mobile and fixed)" as a persona and flags tomorrow's session as dedicated to "tickets").

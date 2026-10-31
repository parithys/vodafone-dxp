---
slug: order-validation-business-rules-45d0e9f0
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Order Validation Business Rules.xlsx
sha256: b59d2b8c6a00378b3951d496c479fe1454e4e67bde9b77b9b08f68c8a538c0d5
indexed: 2026-08-20
confidence: high
---

# Order Validation Business Rules

**Type:** requirements / data extract (Siebel order-validation business-rule catalogue)
**Owner / author:** not stated (appears to be an export from the existing Siebel/VFQA order-management configuration)
**Date:** not stated

## Purpose
An as-is catalogue of order-validation business rules configured in the current Siebel-based CRM (VFQA = "Vodafone Qatar Application" workflow prefix), documenting each rule's trigger condition, resulting error message, applicable order/service/account type, and the workflow/business-service path that enforces it. This is a core reference for what validations must be preserved, mapped, or re-implemented in the modernised stack.

## Key content
- **Structure**: two sheets. Sheet1 is the primary, richer catalogue (~242 data rows including some multi-line entries) with columns: Migrated (Y/N/NA) | NEW BUSINESS RULE # | BUSINESS RULE # | BUSINESS RULE (description) | Old RULE Description | Error Message | Account Type | Service Type | Order Type | Order Sub Type | Additional Information | Status | Step | Type | Subprocess | Business Service | Method | Process Path | Domain Discussion Required. Sheet2 is a shorter, near-duplicate subset (~2 sample rows shown, keyed the same way) without the "Migrated"/new-rule-ID columns — likely an earlier or working extract of the same source.
- **Identifier schemes**: legacy "BUSINESS RULE #" (e.g. `BUSINESS RULE 1`–`BUSINESS RULE 143`, plus decimal variants like `49.1`–`49.7`, `50.1`–`50.16`, `56.1`, `72.1`, `77.1`, `79.0`/`79.1`) and a newer sequential "NEW BUSINESS RULE #" scheme `ORD_VALD_RULE_001` through `ORD_VALD_RULE_169`, plus a separate `BL RULE 01`–`BL RULE 09` series for Bill Limit validations. Most rows carry `Migrated = Y`, some `NA`, a few `N` (not migrated), and one `Not Required`.
- **Rule categories observed** (by Service/Order Type and Business Service groupings): generic order validation via "VFQA Validate Order Process Workflow" (the majority of rules — billing profile/account/service account consistency checks, blacklist checks, appointment-per-order rules); Data Validation Manager (DVM) rules split by order type — Suspension, Resumption, Disconnection, Plan Change, Activation, Modification (each with its own "All Order Validation DVM" subprocess); APN validation (Static IP, Domain Hosting, Broadband Service Link, Account-level APN uniqueness); Star Number pricing/approval rules; iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block); Bulk SMS order validation (billing profile type/status, one active Bulk SMS per account, mandatory attachment, blacklist check); Cloud Sharing/Dummy Plan validation; IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT); ALP (Account Level Product/Bundle) BRM cross-checks (account existence, default billing profile type/status); Deposit Service Bundle rules (one per account, cannot be first service, cannot TON); TON/CMO/TOS/Change-MSISDN order-specific constraints; MNP Port-In attribute/attachment requirements; IPTV/IDM email-uniqueness rules; FL/FMS address and Kahramaa ID (KID) requirements; Bill Limit (BL) rules 01–09 governing bill-limit modification, minimum/maximum thresholds and conflicts with in-flight orders.
- **Representative rule IDs and content** (verbatim identifiers, illustrative not exhaustive): `ORD_VALD_RULE_001` "Order Billing Profile must be same with Line Items' Billing Profile"; `ORD_VALD_RULE_005` "For business account, pending order cannot be submitted if open order exists under it"; `ORD_VALD_RULE_019` "Serial Number is required for SIM CARD product"; `ORD_VALD_RULE_030` "All Payments should be Authorized"; `ORD_VALD_RULE_110` "DNO Verification Attachment is required for MNP Port-In order"; `ORD_VALD_RULE_161` "FL Address must have KID in it"; `BL RULE 07` "Bill Limit Value cannot be more than Credit Limit!".
- Many rules embed literal system expression logic (IIf/BCHasRows/GetNumBCRows formulas referencing fields like `[Product Type]`, `[Action Code]`, `[Service Id]`) alongside the corresponding user-facing error message — useful for reverse-engineering exact validation semantics.

## Cross-references
- Directly relevant to VFQ_Fibre_BRSD_v1.2.xlsx and VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx in this batch: both BRSDs' "06_Business_Rules" sheets (BR-xxx identifiers) are a forward-looking analogue to this as-is rule catalogue and should be cross-checked for overlap/supersession (e.g., KID requirement, appointment rules, blacklist checks, star number pricing).
- Overlaps conceptually with SMS Templates.xlsx and TT Hashtags and Actual Issue.xlsx in this batch (order/ticket-adjacent reference data) as part of the same as-is Siebel configuration landscape being modernised.

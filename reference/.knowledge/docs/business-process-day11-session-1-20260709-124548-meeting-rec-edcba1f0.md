---
slug: business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day11 - Session 1-20260709_124548-Meeting Recording.docx
sha256: 61fec26d6a39629cb9e65dc99add36d65d2ca0fa3794b385154601609de8509d
indexed: 2026-08-20
confidence: high
---

# Business Process Review — Day 11, Session 1 (Enterprise / EBU Account Setup & Activation)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document created 17 August 2026)
**Date:** Recording date 09-07-2026 12:45; duration 114 minutes

## Purpose
Transcript and structured summary covering the end-to-end enterprise (EBU) account creation and activation process in the current Siebel CRM, including segmentation, the parent/sub-account model, authorised persons/choosers, and commercial topics (volumetric discounts, price overrides, bulk activation).

## Key content
- Enterprise sales-to-fulfilment handover: deal closed by account manager, forwarded by email/portal with documents and order form.
- Mandatory CR-number search required before account creation.
- Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit — enterprise has no default credit limit and requires business finance approval.
- Segmentation (SOHO, SME, Large Enterprise, Government) is a manual business decision with no system rule: SOHO under 10 (connections, implied), SME 10–200, Large above 100 (as stated — note the SME/Large ranges as given appear to overlap; recorded verbatim as discussed).
- Parent/sub-account model: parent is a documentation-only placeholder carrying the CR number; all activation, billing and modification happens at sub-account level; only two levels exist; one unique parent per customer. Sub-accounts exist both for business reasons (subsidiaries/branches, example given: Lulu Group) and for system performance.
- Authorised persons/choosers: company nominates authorised persons on the CR; one or more flagged as "chooser"; requests only accepted from the chooser's registered email. Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount".
- Pain points flagged: single email field on a shared contact record (personal vs. corporate email conflict; billing to multiple addresses); free-text job title used as the privilege identifier (no validation); no validation when linking sub-accounts to parents; no off-boarding process for choosers who leave a company.
- CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile.
- Billing profiles default to postpaid with automatic 1st/15th bill cycles; prepaid handled via a separate billing profile line item.
- Number reservation via the number management team or the EBU number portal; unpaired SIM serials noted as an issue.
- End-user registration required for Metrash and the CRA (regulatory) requirement.
- Commercial: volumetric discount has a minimum of 50 numbers, is slab-based, comes in revenue and service-count flavours, is evaluated at runtime, and has no automatic downgrade when connections drop — flagged as the key revenue-leakage pain point. Also covered: management-approved on-top discounts, account-level vs. service-item-level discounts, and access-restricted price override (used when required discount exceeds the plan maximum; hides base vs. offered price for reporting).
- Bulk activation (current state): a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch; a pre-created pending replica order used for reference; Siebel credentials embedded in the control sheet.
- Target requirement: standardised bulk templates on the DSP front end using a new Oracle bulk utility API, supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles within a service; supporting activation, modification and deletion; reporting per-row success/failure status.
- Session ended noting the next session would cover fixed and corporate internet.

## Cross-references
- Directly continues into "Business Process - Day11 - Session 2" (fixed/corporate internet and IoT/enterprise services), also in this batch.
- Part of the same workshop series as Day 9, Day 10, Day 12 files in this batch.

## Extraction notes
None — extraction via pandoc yielded 87,036 characters, confidence high. No speaker diarization available.

---
slug: guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Vanilla views_modifications/Future Dated Orders_training pack.pdf
sha256: 6ddb034e81c1fc9c5d7e2576ab24eb1d2bccab75e8cbcb3a4a0a11aeec5cb4f6
indexed: 2026-08-20
confidence: high
---

# Future Dated Orders (FDO) — Training Pack

**Type:** training pack (slide-deck-style PDF)
**Owner / author:** "Created by Cops & Digital Training" (Vodafone Qatar internal training team)
**Date:** not stated in the document; filename and content ("Coming Soon" features) suggest this is a pre-go-live or recent training material for the Open UI FDO feature

## Purpose
Trains agents (Cops/Digital, sales/frontliners) on the new Future Dated Orders (FDO) capability in Open UI — what it is, which order types support it, the guided journey, business rules, notifications, and per-order-type validations and manual checks.

## Key content
- FDO can be raised via Open UI (Phase 1) and, in future, other channels (Phase 2). New Open UI fields: FDO request view icon on homepage, FDO time/date slot within the order, and an FDO requests tab in account summary.
- Applicable to Consumer and Enterprise segments; available for Prepaid (Pre-to-Post), Postpaid and Fixed customers. Customer can view, edit and cancel a future-dated request before the "point of no return."
- **Supported FDO order types:** Pre-to-Post Migration (Mobile Prepaid; channels Siebel, MVA, Web), Post-to-Pre Migration (Mobile Postpaid/IOT/Corporate Internet, Retail & Retention only; Siebel), Plan Upgrade/Downgrade/PYN (Postpaid; Siebel/MVA/Web, and Fixed/IOT/Corporate Internet via Siebel), Disconnection (Retail & Retention only; Siebel), Add-on/Discount Activation/Deactivation/Modification (Siebel, MVA, Web, Unica).
- **Not supported:** New Activation, Transfer of Service, Add-on Activation/Deactivation (Prepaid), Transfer of Ownership, Port In/Out, Change MSISDN, SIM Swap, Collection Suspend/Resume, OG Bar/Unbar, Home Move Orders/CPE/STB Swap/IPTV Add/ONT Replacement, Voluntary Suspend/Resume (Legacy).
- **Business rules:** maximum 30 days ahead for an FDO; order ID and FDO request ID are cross-stamped in a custom table; if FDO execution fails validation the request is cancelled with error captured; failed FDO orders must not be cancelled manually; all modification/cancellation allowed only while status is Initial.
- **FDO statuses:** Initial, In-Progress, Order Submitted, Success, Failed, Cancelled — each defined in the document.
- **Notifications:** sent to MSISDN and notification MSISDN via SMS and billing email for submission, 3-day-before reminder, execution success/failure, modification, and cancellation (including failure after 3 auto-retries due to open order); languages English and Arabic; sender email noreply@vodafone.qa; every notification is logged as an activity visible to the agent.
- **Pre-to-Post Migration:** system validation blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order. Manual agent checks: collect/post HRN fee before raising FDO; billing profile must be created via BAU journey, not FDO.
- **Post-to-Pre Migration:** agent must manually calculate penalties, ensure outstanding is cleared (system-validated ≤0), limit execution date to next bill cycle, collect 100 QR migration fee upfront; Siebel checks billed/unbilled usage on reminder date and again at execution — cancels and notifies customer if outstanding exists.
- **Plan Change (Upgrade/Downgrade):** validates plan eligibility, non-collections billing profile, non-barred MSISDN; add-on/discount eligible for new plan can ride in same FDO; pro-rata charges still apply; all scheduled FDOs are cancelled after a plan change executes.
- **Disconnection:** raised only from Siebel (not MVA); cannot be cancelled by the app — only the retention team can cancel.
- **Add-On / Discount rules:** multiple add-ons can be bundled in one FDO; recurring add-ons can't be purchased twice (fails at validation); one-off add-ons can be added multiple times; discounts cannot be multi-selected in one order (BAU rule); ineligibility at execution time cancels the request.
- **Failure handling:** automatic 3x retry for requests failed due to open orders; unresolved failures are consolidated into a daily operations report; if FDO lapses the bill cycle and customer is charged, customer must raise a TT for adjustment.

## Cross-references
- Ties to the broader Vodafone Qatar Guided Journeys / Vanilla views modification set (this file sits under "Guided Journeys/Vanilla views_modifications/" in the source tree) and to the Open UI guided-journey work discussed in the IT stack modernization meeting transcripts in this batch (e.g., the "Existing processes Giga-26" transcript references future-dated/appointment concepts and Open UI journeys).

## Extraction notes
None — pdftotext extraction yielded 17,458 characters across 37 pages (471.8 chars/page), confidence high, no OCR needed.

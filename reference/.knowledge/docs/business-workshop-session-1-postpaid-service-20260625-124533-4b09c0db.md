---
slug: business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Session 1 - Postpaid Service-20260625_124533-Meeting Recording.docx
sha256: 2545ec56df7e599f392aade6483961d518a968334e4e3a2774ee816659359601
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop, Session 1 (Postpaid Service — New Connection Journey, Foundational)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026"); led by Chandan (high-level intro) and Sanjeev (detailed journey walkthrough); delivery team introduced includes Rana (BA, revenue mgmt), Marishi (solution/financial architect), Deraf (migration lead), Urmila (delivery manager); business stakeholders include Anwar Mishra (billing/payments/credit), Giri (retail operations), Aditya (testing), Ali (security), Somya (UI/UX)
**Date:** Recording date 25-06-2026 12:45 ("Day 15" per file path); 123-minute session — this is the earliest/foundational session among the Postpaid Service workshops in this batch

## Purpose
Introduces the modular/"Lego block" capability architecture and DXP experience layer concept, then walks the postpaid new-connection (activation) journey for the retail channel end to end — Qnomy token, ID scan/MOI validation, eligibility/credit/blacklist checks, plan/device/number/SIM selection, checkout, CAF, and WinCash payment — establishing baseline business rules that later sessions in the batch build on or refine.

## Key content
- Architecture concept: break monolithic journeys into reusable "capability" building blocks (e.g., a payment-management capability reusable across prepaid, postpaid, enterprise) exposed through a new DXP (Digital Experience Platform) layer that hides workflow/data complexity from agents [00:01:58, 00:08:27].
- Business rule (confirmed, foundational): QID is mandatory for postpaid — postpaid cannot be sold against any other ID type, with one unspecified exception to be discussed later; expats on passport are generally limited to prepaid with a maximum of 5 numbers [00:25:18, 00:14:55].
- Decision: MOI API is the primary ID-data source (Tarasol/manual is fallback only if MOI API doesn't respond); ALL name fields MOI returns (up to ~5-6) must be stored and printed on the bill — not truncated to first/last name; MOI data takes precedence over OCR-captured data but ONLY after a secondary-parameter cross-check (e.g., DOB, nationality, expiry) passes [00:30:22, 00:32:41, 00:33:00, 00:36:23, 00:38:04].
- Business rule: maximum mobility lines (prepaid + postpaid combined) — UNLIMITED for Qatari nationals, maximum 5 for non-nationals, and the 5-line cap is per operator (not across operators) [00:53:54, 00:54:33, 00:55:01]. Override requires an authorized-officer role flag on the account, not an in-journey bypass, because the limit is a CRA (regulator) rule — overriding it breaks CRA compliance [00:56:00, 00:56:37, 00:58:37].
- Business rule: HRN (High Risk Nationality) customers pay an upfront advance (not a deposit) adjusted against the first bill; amount is driven by nationality and channel — explicitly confirmed NOT plan-value-driven, despite an initial assumption otherwise [00:46:44, 00:52:06, 00:53:01].
- Business rule: eligibility for new postpaid is based on "in collection" status and blacklist, NOT outstanding amount, per session confirmation — though wording was changed from "outstanding due" to "overdue" (bill generated + due date passed); a billing profile enters collection once overdue exceeds 100 [00:47:47, 00:48:34, 00:49:00, 00:50:03].
- Decision: DOI (Device on Installment) is explicitly kept OUT of the main postpaid journey for this phase and deferred to a later, separate discussion; requires an existing postpaid account in good standing, presence on an internal big-data eligibility list, and a QCB credit check [01:16:57, 01:17:07, 01:19:13].
- Star number rule: plan value determines star-number value entitlement (e.g., a 200 Riyal plan entitles ~5,000 Riyal worth of star number); if the customer selects a number exceeding entitlement, they pay the delta at point of sale [01:20:26, 01:23:19].
- SIM/eSIM: three types supported (physical SIM with serial scan, physical eSIM card with QR code, digital eSIM auto-allocated and emailed with ICCID); requirement to create virtual/dummy SKUs with no inventory for digital eSIM since WinCash otherwise expects inventory depletion for any SIM issuance [01:33:20, 01:36:44, 01:41:07].
- Decision: address handling, customer 360, DOI, roles/privileges, enterprise structure, and channel "flavours" were all explicitly parked for dedicated future sessions; the team agreed to build a retail-agent baseline journey first and layer channel-specific flavours on top later [00:34:45, 01:06:58, 01:07:33, 01:19:13, 01:56:36].
- Decision: design the journey as a single scrolling flow rather than multi-page "next click" navigation, and collaborate directly with Somya's UI/UX team rather than designing in parallel [01:58:06, 01:58:32].
- Risk flagged: OCR misreads of the QID number (e.g., 0 read as 8) could pull the wrong MOI customer record; QID cards can be damaged/scratched causing OCR failures; a misread ID number could coincidentally still match an expiry date, defeating two-factor validation [00:27:28, 00:37:01, 00:29:52].
- Named action owners: Fahim and team (review existing digital-channel ID validation), Vishal (enable MOI national address service), Gagan and Sanjeev (change eligibility wording, rework checkout screen), Deepak (confirm retail access to DOI portal for out-of-stock devices), Chandan (explain number-selection logic offline).
- Systems referenced: DXP, Qnomy (in-store token/queue system, currently outside the CRM system), IDWise (ID scan/OCR), MOI (ID source of truth), Madar (intermediary passing IDWise output to DXP), WinCash (POS/payment/inventory), Tarasol (MOI fallback), QCB (credit bureau), Siebel, Open UI, Vanilla (explicitly stated there will be NO Vanilla in the future state), eShop portal (to be eliminated/folded into unified journey), DOI portal, Big Data (DOI eligibility list), TELUS portal.

## Cross-references
- This is the earliest session in the Postpaid Service series within this batch (Day 15, predates Day 2 Session 1/2 and all later days); establishes baseline rules (QID mandatory, max lines, HRN advance, MOI precedence) that Day 2 Session 1/2 and later sessions build directly on.
- Address handling explicitly deferred to a dedicated session — later addressed in Day 7 Session 1 (Karama ID/KID, address history) in this batch.
- DOI (Device on Installment) deferred here — later covered in depth in Day 5 Session 2 (old/current/target DOI processes) in this batch.
- Customer 360 view deferred here — partially covered in Day 2 Session 1 in this batch.
- References a "requirements takeaway document" to be populated from these sessions with business rules and acceptance criteria, shared for validation/sign-off before development — not included in this batch.

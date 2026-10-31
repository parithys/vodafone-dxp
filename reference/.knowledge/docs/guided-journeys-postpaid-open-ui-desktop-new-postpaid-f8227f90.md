---
slug: guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Open UI Desktop_New Postpaid.docx
sha256: cb8f630db8f3cf9c53a9822002b4d675f6b1499399efbafaafddeec4b679b84b
indexed: 2026-08-20
confidence: high
reverified: 2026-08-23 (Phase 1.5 Action 1.5.6 — upgraded from medium after re-processing via direct image extraction, see Extraction notes)
---

# Retail New Postpaid – Edit Bill Limit Screenshot

**Type:** requirements (step/behavior notes embedded in a UI walkthrough)
**Owner / author:** not stated
**Date:** not stated

## Purpose
Documents the "Edit Bill Limit" behavior within the Retail New Postpaid journey on the Open UI Desktop interface, for a user with the VFQA Sales responsibility, including validation against an "Agent minimum value."

## Key content
- Document title (verbatim): "Retail New Postpaid – Edit Bill limit Screenshot". Scoped to: "User with VFQA Sales Responsibility".
- Full screenshot sequence (23 images, `word/media/image1.png`–`image23.png`, reading order confirmed via the `r:embed` sequence in `word/document.xml`) tells one coherent, unbroken New Postpaid story:
  - Images 1–2: Admin setup — agent "Hemanth Kumar" (User ID HEMANTH), VFQA Sales responsibility.
  - Images 3–4: Admin-side "Bill Limit Mapping" tab on "Postpaid U Start Promotion" — Spend Limit Mapping table: Bill Limit Mobile → Agent Min Value = **50**; Bill Limit Mobile Plus → Agent Min Value = **75**.
  - Images 5–16: Full New Postpaid wizard — Home → Choose process → Contact (ID lookup, passport upload, connection details) → Address → Billing → Number Selection (reservation success token) → SIM Serial → Plan catalog search.
  - Images 17–21: The Bill-Limit-Edit mechanic itself — "Postpaid U Start Promotion" detail panel shows Smart Limit: 20, "Edit Smart Limit" button; entering **48** (below 50) triggers inline error **"Bill Limit can not be set lower than Agent Minimum 50"**; entering **53** (above 50) is accepted, no error, Smart Limit updates to 53.
  - Images 22–23: Sales Order (Order #1-28920182744) and Line Items view showing the "Bill Limit Mobile" line item with **SL Limit Amount = 53**, confirming the accepted value carried through to order completion.
- Business rule confirmed with concrete values (not just the two narrative sentences originally recovered): bill limit edits by a Sales-role agent are validated against a per-product Agent Minimum threshold (50 for Mobile, 75 for Mobile Plus) before the journey can proceed.
- No requirement IDs, dates, or named business owner recovered from the document itself (agent name Hemanth Kumar is the only named individual).

## Cross-references
- Related to "Desktop Vanilla_New Postpaid.docx" in the same folder — same validation pattern (Bill Limit Mobile Plus, Agent Min raised to 80, entering 75 blocked with error "Bill Limit can not be set lower than Agent Minimum 80... SBL-EXL-00151"), same Spend Limit Mapping applet layout, same Hemanth Kumar/VFQA Sales actor — corroborates this document rather than duplicating it (two different bill-limit products/thresholds).
- Corroborated by `order-validation-business-rules-45d0e9f0` (data/Order Validation Business Rules.xlsx): BL RULE 05 — "Bill Limit cannot be set lower than configured minimum amount" — matches the below/above-minimum validation split shown on-screen (UI error text is a close but not verbatim match to the catalogue's generic rule text).
- Distinct from (not contradicted by) `guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`, which documents Credit Limit editing (account-level) rather than Bill Limit/Agent Minimum editing (product-level) — same wizard skeleton and platform, different rule type.

## Extraction notes
Original 2026-08-20 pass used flat text extraction only (pandoc/markitdown), which yielded 1677 characters of mostly screenshot placeholders and missed all 23 embedded screenshots — the same systematic gap CLAUDE.md flags for all `Guided Journeys/` docs. Confidence was set to medium pending re-processing.

**Re-verified 2026-08-23 (Phase 1.5, Action 1.5.6):** re-processed via direct image extraction per the method in CLAUDE.md (docx as zip, `word/media/` images viewed in `r:embed` document order — not OCR, direct multimodal reading), the same treatment already applied to this file's 39 sibling Guided Journeys docs on 2026-08-20. All 23 screenshots are legible, sequential, and internally consistent with no gaps or jumps. Every claim checked against `order-validation-business-rules-45d0e9f0` and two sibling guided-journey docs was CONSISTENT with zero contradictions. Confidence upgraded from medium to **high** — this was a stale-extraction artifact, not a genuine data-quality issue. Full re-verification detail (spot-checks, scoring) in `VFQ_Phase1.5_Action6_Source_Confidence_Verification_Report.xlsx`.

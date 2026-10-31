---
slug: guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/SIM Swap/SIM Swap - Tablet, Desktop & Vanilla Order Approval Journey.docx
sha256: f8a3f1ce85d2d4d648e18d5b5b7cd5056fd63d8a1594fef6a9cccbc6e90dd9c9
indexed: 2026-08-20
confidence: high

---

# SIM Swap - Tablet, Desktop & Vanilla Order Approval Journey

**Type:** unclear (guided journey / step-by-step UI walkthrough — but with full recoverable outline, not just images)
**Owner / author:** not stated
**Date:** not stated

## Purpose
A step-by-step guided journey documenting the SIM Swap process end-to-end across multiple channels/platforms (Global Search initiation, Vanilla journey, Open UI Desktop, and Open UI Tablet), including the order approval workflow and rejection handling, as stated by the section headers in the document.

## Key content
Document is organized into six named sections, each with a numbered step sequence (steps are click-path instructions, not just captions):

- **"SIM Swap from Global Search"** (8 steps): Click Global Search icon -> Enter MSISDN and click Go -> Click SIM Swap option -> Verify contact details, upload QID front & Bank, click Continue -> Enter SIM Serial Number, select SIM Swap Reason, click Submit -> Attach SIM Swap Form, click Continue -> Order goes to Approval -> Add comments, click Save and Finish.
- **"SIM Swap Approval (Vanilla Journey)"** (5 steps): Inside account, under Installed Assets, select MSISDN (Promotional Line item or Mobile Service Bundle), click Modify Tab -> Order created, go to Order Line Items -> Expand Mobile Service Bundle, update new SIM Serial number on SIM Card bundle line item (Service ID Option) -> Scroll up, click Validate, then Submit Order -> Order goes to SIM Swap Approval Queue.
- **"SIM Swap Approval Open UI Desktop"** (8 steps): Click Queue -> Select SIM Swap Queue, click Order tasks tab -> Sort by Created Date or search Order Number -> Select order, click Assign to Me -> Click Order ID hyperlink -> Scroll down, Approve or Reject the Task -> On Approve, pop-up opens to add comments and Submit -> On Submit, task closes and Order is Completed.
- **"SIM Swap Order Approval Rejection"** (2 steps): On Reject Task, pop-up opens for Rejection Reason -> Add comments, click Drop Order; order is dropped as cancelled.
- **"SIM Swap Approval (Open UI Tablet Journey)"** (9 steps): Login to Open UI Tablet, go to SIM Swap Journey -> Enter MSISDN, ID Type & ID Number, click Go -> Verify contact details, add QID front & Bank, click Continue -> Enter SIM Serial Number, select Reason, click Submit -> Click Sign Contract -> Take customer signature, click Done tab -> Click Done -> SIM Swap Request Form attached, click Finish -> Order submitted for Approval.
- **"SIM Swap Approval Flow (Open UI Tablet)"** (6 steps): Go to Approval Journey -> Select Order Approval Queue, go to Order Activities Queue (sort/search) -> Select order, click Assign to Me -> Go to My Activities, click Order ID hyperlink -> Validate Attachments -> Approve or Reject/Drop Order — moves back to My Activities Page.
- Stated system behavior: "If without Order Approval Any user try to Drop the Order the below error will appear" — indicates an enforced validation that orders cannot be dropped without going through approval.
- Final section: "Accessing all SIM Swap Order and Pending SIM Swap Order from Open UI Desktop" — states navigation path: Login to Open UI -> Sales Order Icon -> All Sales Order -> top-menu dropdown with options "All SIM Swap Orders" and "All Pending SIM Swap Orders."

## Cross-references
- No other documents explicitly named/cross-referenced in the extracted text. Likely related to other Guided Journeys documents covering order approval workflows (e.g., Postpaid B2B2C "With Approval" variants) given the shared approval-queue pattern, but this is inferred, not stated.

## Extraction notes
Confidence is high relative to other files in this batch because the numbered step text and section headers extracted cleanly (3,425 characters), giving a full procedural outline. However, the screenshots illustrating each step (marked as empty "[]" in extraction) did not extract, so exact field names, button labels, and screen layouts referenced by each step are not independently verified beyond the text instructions.

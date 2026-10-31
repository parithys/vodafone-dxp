---
slug: guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Pre to Post/Desktop Vanilla_Pre to Post.docx
sha256: 6ebf37b41bf7bc7a7046462c2dfd3e38e29265dd603c4fa448a9b706a86623ba
indexed: 2026-08-20
confidence: high
---

# Desktop Vanilla – Prepaid to Postpaid (Pre2Post) Conversion Walkthrough, Including a Bill-Limit Validation Failure

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, Vanilla/manual path — includes a negative-path (validation-error) scenario, not just a happy path
**Owner / author:** not stated
**Date:** screenshots are dated 2025-04-15/16 in on-screen data (order timestamps); document indexed 2026-08-20

## Purpose
A desktop, Vanilla-Open-UI (Siebel-based) walkthrough of converting an existing Prepaid line to Postpaid ("Pre2Post") via the Upgrade Promotion action on an installed asset — and, unusually, the walkthrough captures a real system validation error (Bill Limit below Agent Minimum) rather than ending in a clean success, making it a useful troubleshooting reference as well as a process guide.

## Key content
Recovered by direct visual inspection of all 13 embedded screenshots, in document order:

1. **Confirm agent responsibility** — Administration–User "All Person Administration" view confirms operator Hemanth Kumar (User ID HEMANTH, Job Title Team Leader) is provisioned under Responsibility **VFQA Sales**.
2. **Product Admin — target promotion** — Administration–Product > Product Promotions: **Postpaid U Plus Promotion** (Payment Type Postpaid, Bundled Promotions, Instances One Per Order) selected from a list of 8 postpaid promotions.
3. **Product Admin — Bill Limit Mapping** — Bill Limit Mapping tab shows two Spend Limit products: **Bill Limit Mobile** (Agent Min Value 50) and **Bill Limit Mobile Plus** (Agent Min Value **80**, Default Flag checked) — this configured minimum becomes the cause of the later validation failure.
4. **Customer Account Summary** — Account for **Sivakumar Kanniah** (Residential, Expatriate, Credit Limit 1,000, Active); Installed Assets shows a **Prepaid Red Promotion** (MSISDN 97479026351).
5. **Customer Portal / full account view** — Installed Assets grid (1-6) shows the Prepaid Red Promotion alongside two existing postpaid lines (Postpaid Red 350, Postpaid U Start). Orders grid shows **two prior Pre2Post orders already Abandoned** for this account (4/15/2025), meaning this conversion had failed before.
6. **Initiate upgrade** — right-click the Prepaid Red Promotion asset opens a context menu (Suspend, Modify, Disconnect, Split/Merge Promotion, **Upgrade Promotion**, Add To Promotion, Re-bundle, Recommendations); agent selects **Upgrade Promotion**.
7. **Promotion Upgrades picker** — modal search "*U*Plus*" returns postpaid target promotions (Postpaid U Plus Promotion, Unlimited Plus variants, etc.).
8. **Resulting order line items** — Sales Order Line Items: **Update** Mobile Service Bundle, **Delete** Prepaid Red Promotion, **Add** Postpaid U Plus Promotion (Item/Net Total MRC QR150.00).
9. **Product configurator — Bill Limit selection** — VAS Plan: None; **Bill Limit** radio group offers None / **Bill Limit Mobile Plus** (selected) / Bill Limit Mobile; Smart Tracker Device: None; Lego Addons: Free 4GB Data Lifetime (unchecked).
10. **Spend Limit entry + a passing Check Errors run** — Details > Spend Limit Amounts: **SL Limit Amount 55**, SL Min Value .01, SL Default Value 20. A "Check Errors" alert reports **"Check Errors generated (0) errors"** at this point.
11. **Line Item Attributes confirm the submitted values** — expanded line 1 (Mobile Service Bundle, Update) shows sub-lines including U Plus (Add, QR150), Bill Manager, Carry_forward_charges, **Bill Limit Mobile Plus** (Add, QR0.00), and **Red** (Delete, the old Prepaid line); the Line Item Attributes grid confirms SL Default Value=20, **SL Limit Amount=55**, SL Min Value=.01.
12. **Order header — informational note on Validate** — Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00. On Validate, an alert reads: **"Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."**
13. **Validation failure (terminal state)** — same order, now shown with **Order Sub Type: Pre2Post** and Credit Limit 1,000. A blocking alert reads: **"Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)"** — the entered SL Limit Amount of 55 is rejected because it is below the Agent Minimum of 80 configured in Product Administration (step 3).

**Business rule demonstrated:** a postpaid Bill Limit ("Spend Limit") value cannot be set below the Agent Minimum configured against that Bill Limit product in Product Administration; the system enforces this at order Validate time with Siebel error code SBL-EXL-00151.

## Cross-references
- Companion to other Guided Journeys/Pre to Post docx files: Open UI Desktop_Pre to Post, Open UI Desktop_Pre to Post (Autobase), Open UI Tablet_Pre to Post — this is the Desktop **Vanilla** (manual, back-office Siebel) variant, contrasted with the guided-wizard tablet/desktop variants.
- Matches the "Prepaid to Postpaid" Workflow/Task row (#8, Sales category) in `CRM_Journeys_Final_Updated_with_Type.xlsx` "Page Type"/"Relationship" sheet (functional cluster CL02, New Connection Activation & Migration).
- Order Validation Business Rules.xlsx in this document set likely documents the same Bill Limit / Agent Minimum rule (ORD_VALD_RULE catalogue) surfaced here as SBL-EXL-00151.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 13 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only a title/caption fragment ("Edit Bill limit – Vanilla Pre to Post") and generic screenshot placeholders. All 13 images were legible and distinct; none were blank or duplicated, though several form tight sequences on the same underlying screen at consecutive interaction states.

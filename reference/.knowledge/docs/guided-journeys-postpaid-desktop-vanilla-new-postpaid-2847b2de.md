---
slug: guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Desktop Vanilla_New Postpaid.docx
sha256: f56c7e5903aaf056625681109ae0833c641d02f5a1deac179f2d33251397a020
indexed: 2026-08-20
confidence: high
---

# Vanilla New Postpaid (Desktop) — Configuring the Bill Limit (Spend Limit) During a New Postpaid Sales Order

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, Vanilla/manual path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots are timestamped 21/04/2025 and 22/04/2025 in the Windows taskbar clock, but this is incidental capture metadata, not an authored document date)

## Purpose
Walks a VFQA Sales-responsibility agent through two linked activities in Vodafone Open UI Desktop: (1) an admin-side change to the "Bill Limit Mobile Plus" spend-limit product mapping (raising its Agent Minimum Value to 80), and (2) a full new Postpaid sales order build for a customer (catalog selection of the "Postpaid U Plus Promotion," bundle line-item breakdown, and Bill Limit customization), which is used to demonstrate the validation error that fires when an agent tries to set a bill limit below the newly configured Agent Minimum.

## Key content

1. **All Person Administration screen** (image1.png). Confirms the operating user: Last Name "Kumar", First Name "Hemanth", User ID "HEMANTH", Job Title "Team Leader", Contact Team "SADMIN", Responsibility "VFQA Sales", New Responsibility field shows "AT Service Analyti..." (truncated), Alias "1234999". This establishes the agent/role context for the walkthrough (matches the previously recovered title fragment "User with VFQA Sales Responsibility").

2. **Product Promotions admin — More Info tab** (image2.png). Navigated via Administration - Product > Product Promotions. The "Postpaid U Plus Promotion" record (row 1 of 8, Bundled Promotions type, Effective Dates 08/27/2020 -) is selected. More Info tab shows: Promotion ID "1-92VNJ0L", Type "Bundled Promot[ions]", Payment Type "Postpaid", Instances "One Per Ord[er]", Show in Catalog checked, Track as Asset checked, Track as Agreement unchecked, Manual Ambiguity Resolution Flag unchecked.

3. **Product Promotions admin — Bill Limit Mapping tab / Spend Limit Mapping applet** (image3.png). Two mapped bill-limit products are shown:
   - "1-1PQ439D" / **Bill Limit Mobile**: SL List Price 3, Agent Min Value 50, SL Min Value 0.01, SL Default Value 20, Default Flag unchecked, Active Flag checked.
   - "1-1PQ439N" / **Bill Limit Mobile Plus**: SL List Price 0, Agent Min Value field is being edited — highlighted/selected showing **"80"** (raised from a prior value), SL Min Value 0.01, SL Default Value 20, Default Flag checked, Active Flag checked.
   This is the admin action that later causes the validation failure in step 12.

4. **New Sales Order header** (image4.png). A brand-new order is created: Order # **1-28929093512**, Type "Sales Order", Order Type "Activation", Status "Pending", Account "Vishakan Soundararajan" (Last Name Soundararajan, First Name Vishakan), Primary MSISDN "97479025448" (the account's existing/service number), Site "Postpaid_290356544", Billing Profile "1-D87EQYB", Billing Profile Type "Postpaid", Price List "VFQA PriceList", Currency "QAR", Source "CRM", Created By "HEMANTH", Fulfillment Mode "Deliver", Success Dependency "Default", Total/MRC/NRC all QR0.00 at this point.

5. **Catalog > Browse tab, product search** (image5.png). Catalog set to "VFQA Catalog"; left-hand tree shows Postpaid Plans (204) > Postpaid Consumer Plans (84) selected. Search box "U Plus" returns one tile: **"Postpaid U Plus Promotion"**, Qty 1, being added to the cart (loading spinner shown next to the tile).

6. **Line Items tab after add** (image6.png). Order now shows two top-level line items: "Postpaid U Plus Promotion" (Action: Add) and "Mobile Service Bundle" (Action: Add), both Status "Pending". Header totals update to MRC Total QR150.00, NRC Total QR25.00. A "Customize" context option is shown against the Mobile Service Bundle row, launching the complex-product configuration screen.

7. **Complex Product Runtime Instantiation — customization screen** (image7.png). Multiple configurable sections are shown:
   - "VAS Flex-purchase Prepaid Opt-in" — radio options None (selected) / "VAS Flex-purchase Prepaid Opt-in".
   - "Extra Cabling Charges" — Item dropdown, Qty field, "Add Item" button.
   - **"Bill Limit"** section (radio list with List Price / Your Price / Promotion / Explanation / Customize columns): None; **"Bill Limit Mobile Plus" — selected**, List Price QR0.00, Your Price QR0.00, with a gear "Customize" icon; "Bill Limit Mobile" — List Price QR3.00 (not selected).
   - "Smart Tracker Device" — None (selected) / "Smart Tracker Device".
   - "Lego Addons" — "Free 4GB Data Lifetime" (unchecked).
   - "Negative Priced Addons" section beginning below the fold (not further detailed).

8. **Bill Limit Mobile Plus — Customize detail panel** (image8.png). Opened via the gear/Customize icon on the Bill Limit Mobile Plus row. Shows: Your Price QR25.00, Total NRC QR25.00, Total MRC QR150.00. Under the "Spend Limit Amounts" tab (alongside a "Spend Limit Discount Options" tab): **SL Limit Amount = 75**, SL Min Value = .01, SL Default Value = 20. Action buttons: Save, Cancel, Done, Finish It, Verify — i.e., the agent is entering a customer bill limit of QR75, which is below the newly raised Agent Minimum of 80 from step 3.

9. **Line Items Attributes — expanded Mobile Service Bundle** (image9.png). The bundle (outline #2) is expanded to show its full sub-line structure: 2.1 U Plus (Start/Net Price QR150.00), 2.2 Mobile Voicemail (QR0.00), 2.3 SIM Card (QR25.00), 2.4 GCC Passport Pack Postpaid, 2.5 Bill Manager (QR0.00), 2.6 DOB Eligible (QR0.00), 2.7 Carry_forward_charges (QR0.00), 2.8 **Bill Limit Mobile Plus** (QR0.00) — all Action "Add". The "Line Item Attributes" grid for the Bill Limit Mobile Plus row lists: **SL Default Value = 20**, **SL Limit Amount = 75** (selected/highlighted), **SL Min Value = .01**, each with Action "Add", Data Type "Text".

10. **Line Items grid, fully populated** (image10.png). Grid now shows "1 - 10 of 10" line items, all Status "Pending". Service identifiers are now auto-assigned: Mobile Service Bundle (outline 2) Service Id **"97479025465"** (the new MSISDN being activated); SIM Card (outline 2.3) Service Id **"8942702400000026363"** (ICCID). Sub-lines 2.1–2.8 match the structure from step 9.

11. **Validate — informational dialog** (image11.png). Clicking "Validate" on the order header (Order # 1-28929093512, Status Pending, Total QR25.00, MRC Total QR150.00, NRC Total QR25.00) produces a browser dialog from `10.162.53.100:4443`:
    > "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."
    Dismissed with **OK**.

12. **Validate — blocking error dialog** (image12.png). A second validation dialog from `10.162.53.100:4443` appears:
    > "Bill Limit can not be set lower than Agent Minimum 80
    > Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)"
    Dismissed with **OK**. This is the payoff of the walkthrough: because the admin (steps 2-3) raised the Bill Limit Mobile Plus Agent Minimum Value to 80, and the agent (steps 8-9) entered a customer Bill Limit / SL Limit Amount of only 75, order validation fails with error code **SBL-EXL-00151** and reference **1-DAFQWTQ**, directing the agent to contact the System Administrator. The order remains in "Pending" status; no further screenshots show a corrected/resubmitted value.

## Cross-references
- Sibling documents in the same folder (`data/Guided Journeys/Postpaid/`): `Cross Sales_Open UI Desktop_New Postpaid.docx`, `Open UI Desktop_New Postpaid.docx`, `Open UI Desktop_New Postpaid_HRN Customer_Credit Limit.docx`, `Open UI Tablet_New Postpaid_B2B2C_With Approval.docx`, `Open UI Tablet_New Postpaid_B2B2C_Without Approval.docx`, `Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx`, `Open UI Tablet_New Postpaid_NON_B2B2C_With Approval.docx`. Per a prior extraction pass, `Open UI Desktop_New Postpaid.docx` covers a similar Edit Bill Limit flow including an "Agent min value" validation, and is likely the non-Vanilla (assisted) counterpart to this Desktop Vanilla version.
- Matches **User Journey "New Postpaid (#7)"** in `data/CRM_Journeys_Final_Updated_with_Type.xlsx` (listed among New Fixed line (#5), New FWA (#6), New Postpaid (#7), New Prepaid (#9), MNP Prepaid (#10), MNP Postpaid (#11), New IOT Tablet (#12); Guided-Journey complexity flagged "[Medium]"). The workbook also separately tracks "Manage Bill Limit (#110)" and "Bill Limit History (#81)" as related Tasks/Views under Billing.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 12 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only a title ("Vanilla New Postpaid – Edit Bill Limit Screenshot") and role label ("User with VFQA Sales Responsibility"). All 12 images were legible and information-dense (no blank/ambiguous frames). The document's own title emphasizes "Edit Bill Limit," but the actual screenshot sequence documents a full new-Postpaid sales-order build (catalog, bundle, SIM, MSISDN) used specifically as the vehicle to exercise and demonstrate the Bill Limit / Agent Minimum Value validation rule — both framings are reflected above.

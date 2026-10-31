---
slug: guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/Open UI Tablet_FWA_Indoor_Without Approval.docx
sha256: 6e62ec78a0ef45ff2055a88e24e6b1d1281bcf888664218e98dd021499cd8290
indexed: 2026-08-20
confidence: high
---

# Open UI Tablet – FWA Indoor New Connection, Without Approval (Guided Journey Walkthrough)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path (Vodafone "Open UI" CRM)
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots show system dates of Thursday, September 04, 2025 / order created 9/7/2025)

## Purpose
Screen-by-screen walkthrough of creating a new FWA (Fixed Wireless Access) Indoor postpaid connection for an existing customer on the Vodafone Open UI Tablet interface, from home menu through plan selection, address/SIM/CPE capture, e-signature on the Customer Application Form, and final order completion — for a customer who already has 2 existing postpaid connections but proceeds WITHOUT a credit-control/manager approval step.

## Key content
1. **Home screen** — Tablet home for agent "Hemanth Kumar" (welcome banner, "Today is Thursday, September 04, 2025"). Icon grid includes: Home, Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap, **New FWA Tablet** (the entry point used here).

2. **FWA Contact step (1. Contact)** — Accordion wizard with steps: 1. Contact, 2. Address, 3. Plan, 4. Addon & Discount, 5. Number Selection, 6. SIM Serial (further steps 7. Book Appointment, 8. CAF & Additional Attachments appear later). Agent is prompted "Please insert or scan the customer's Qatari ID:" — Qatari ID entered/scanned: **28035650506**, validated (green check), then **Go** is clicked.

3. **Contact confirmation + Connection Details dialog** — After ID lookup, contact fields auto-populate: ID Expiry 9/22/2026, Nationality Indian, Gender F, First name **SELBATH**, Last name **JAMALUDEEN**, Birth date 5/31/1980, Company Name B2B2C (blank), Lead/Opportunity ID (blank), Digital Lead/Sale: No. A modal **"Connection Details"** pops up automatically showing: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 2", and a blue info note: *"Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"*. A button **"Show Postpaid Plan Details"** is available.

4. **Connection Details expanded** — Clicking "Show Postpaid Plan Details" reveals the customer's existing plans: **GigaHome 5G Classic New Indoor -FWA**, **GigaHome Premium OD New 5G -FWA**, **U Start**, **U Start** (two mobile lines). Despite the advisory note about seeking credit control approval, the agent proceeds directly by clicking **Continue** — no approval workflow, approval button, or manager-sign-off screen is triggered. This is the key "Without Approval" behavior actually observed: the system only *displays an advisory note*, and the journey continues uninterrupted with no gating step, no approval request submission, and no wait/pending-approval state.

5. **Contact details continued** — Digital Lead/Sale: No; Enter ECR Details: No (with note "To be filled by Fulfillment team only"); Email: **noemailid@vodafone.com** with "No Email" checkbox ticked; Language: English; Alt. phone #: **97412341234**. Qatari ID-Front and Qatari ID-Back images shown as already attached (green checkmarks). Agent clicks **Continue**.

6. **2. Address step** — Zone: **11**, Street No.: **23**, Building No.: **45**, Apt/Flat/Unit: **89G**, Area: **Al Rayyan** (dropdown). Agent clicks **Save Address**.

7. **3. Plan step** — "Please Select a Plan." Search box plus plan tiles: GigaHome 5G Classic New Indoor FWA Promotion (selected, highlighted red), GigaHome 5G Premium New Indoor FWA Promotion, GigaHome Classic OD 5G New FWA Promotion, GigaHome New PYN 5G Indoor FWA Promotion, GigaHome New PYN 5G Outdoor FWA Promotion, GigaHome Premium OD New 5G FWA Promotion. Selected: **GigaHome 5G Classic New Indoor FWA Promotion**.

8. **Plan detail confirmation popup** — Shows bundle contents for "GigaHome 5G Classic New Indoor FWA Promotion": FMS CPE Indoor IDU, GigaHome 5G Classic New Indoor -FWA, 100% Discount for 2 Months -FWA, FMS SIM, FMS VoIP Service, Activation Bar- Mobile Roaming -FWA, System Bar Admin -FWA, plus additional truncated items ("..."). Agent clicks **Continue**.

9. **4. Addon & Discount step** — "Select applicable add-on and discount based on customer's plan" with **Select Add-on** / **Select Discount** buttons. Discount auto-applied: **100% Discount for 2 Months -FWA**. Info note: "Note: if there are no applicable add-on or discount, the selector will be empty." Agent clicks **Continue**.

10. **5. Number Selection step** — "Select a Number to Reserve:" with tabs "Free Number" / "Reserved Number". Three free numbers offered: **41202297** (selected, highlighted), 40010150, 41202298 — each priced QR0.00. Agent clicks **Continue**.

11. **6. SIM Serial step** — Prior steps now show "Saved!": "4. Addon & Discount – Saved!", "5. Number Selection: 97441202297 – Saved!" (number normalized to full MSISDN with country code). SIM Serial field: **8942702800801190297** (scanned, validated). CPE Serial Number: **S180P18055022**. Agent clicks **Continue**. Steps 7. Book Appointment and 8. CAF & Additional Attachments appear collapsed below.

12. **Vodafone Customer Application Form (CAF) — page 1** — Bilingual (Arabic/English) PDF-style form. Header: Date **7-Sep-2025**, Retailer ID: NA. Section 1 – Applicant details: Customer type Consumer, Name **SELBATH JAMALUDEEN**, Date of birth 31-May-1980, Qatar ID Number 28035650506, Expiry date 7-Sep-2026, Nationality Indian, Email noemailid@vodafone.com, PO Box 1111, Alternative contact number LL:97412341234, MO:97412341234, Preferred language English, Address "Zone 11, Street 23, Building No. 45, Apt/Flat/Unit 89G, Qatar". Section 2 – Billing information: Account credit limit 1000, Bill date cycle 15, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice.

13. **E-signature capture dialog** — "Please Sign" modal with a signature pad; a handwritten signature is drawn, with **Clear Signature** and **Done** buttons.

14. **CAF page 2 (Section 3 & 4)** — Section 3 – For Postpaid Customers: Mobile number 97441202297. Section 4 – Superfast Broadband & Home Phone: Landline Number 97441202297, Plan Name (Minimum Subscription Period of 3 months applies): **GigaHome 5G Classic New Indoor -FWA**, Appointment Details row present. **Signature block filled**: handwritten signature with printed name/timestamp "**HEMANTH 09/07/2025 10:12:08**" (i.e., the agent signs/confirms on the customer's behalf or countersigns at that timestamp) — followed by the Vodafone Qatar General Terms and Conditions (bilingual legal text) filling the rest of the page.

15. **CAF & Additional Attachments step** — Steps 5, 6, 7 (Number Selection: 97441202297, SIM Serial, Book Appointment) all show **"Saved!"**. Step 8 "CAF & Additional Attachments" expanded showing two green-checked uploaded documents: **CAF** (required, marked with red asterisk) and **Supplementary Form**, plus an "Add File" tile. Agent clicks **Continue**.

16. **Sales Order record — header (Order Management screen)** — Full CRM order form for Order # **1-29722815428**, Revision 1, Type: Sales Order, Account: SELBATH JAMALUDEEN, Site: Qatari ID_28035650..., Order Type: Activation, Status: **Complete**, Created: 9/7/2025 09:51:02 AM, Due/Order Date same, Status As Of: 9/7/2025 10:15:20 AM, Created By: HEMANTH, Fulfillment Status: **Complete**, Status Context: "All order lines are completed", Priority: Medium-Complete, Billing Profile Type: Postpaid, Bill Cycle 15, Credit Limit 1,000, Approved checkbox: **unchecked/blank**, Approved By: blank. Toolbar buttons: Revise, Validate, Select Favorites, Drop Order (greyed out), Submit, MOI Validation, Generate Activity Plans, Cancel Order.

17. **Sales Order — Line Items tab** — Same order, "Line Items" tab selected, sub-tab "Totals". Three line items all with Status **Complete** / Fulfillment Status **Complete**, Status Context "FULFILL BILLING COMPLETE: reached": (1) **GigaHome 5G Classic New Indoor FWA Promotion**, Service Id blank; (2) **FMS CPE Bundle**, Service Id 129722815647; (3) **FMS Service Bundle**, Service Id 97441202297. All tied to Billing Profile 1-DNJGOGV. Toolbar includes Auto-Asset, MultiAdd, CAF, Profile, Book Appointment, Book Unscheduled Appointment buttons.

**Order status progression observed:** Contact/Address/Plan/Addon/Number/SIM entry → Book Appointment → CAF & signature → order created (1-29722815428) → order and all 3 line items reach **Status: Complete / Fulfillment Status: Complete** ("FULFILL BILLING COMPLETE: reached") with the order-level **Approved** checkbox left unchecked/blank throughout — confirming no approval gate was exercised end-to-end.

**"Without Approval" variant — actual observed difference:** Despite the system-generated advisory ("Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding") shown in the Connection Details modal at the Contact step, no approval request, approval queue, or manager sign-off screen appears anywhere in the 18 captured screens. The agent clicks Continue straight through, and the final order record shows the **Approved** checkbox unchecked and **Approved By** blank, yet the order still reaches Status: Complete / Fulfillment Status: Complete. This is consistent with the filename: the advisory is informational only in this flow, not a hard gate.

## Cross-references
- Direct counterpart in the same folder: **Open UI Tablet_FWA_Indoor_With Approval.docx** (slug `guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`) — expected to show the same Connection Details advisory but followed by an actual approval step/screen (not verified in this pass).
- Other siblings in `/Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/`: Desktop Vanilla_FWA_Indoor.docx, Desktop Vanilla_FWA_Outdoor_WFM.docx, Desktop Vanilla_Indoor_Modify CPE.docx, FWA_Indoor & Outdoor_Negative Scenarios.docx, Open UI Desktop_FWA_Indoor.docx, Open UI Desktop_FWA_Outdoor_WFM.docx, Open UI Tabelt_FWA_Indoor_B2B2C.docx, Open UI Tablet_FWA_Outdoor_B2B2C.docx, Open UI Tablet_FWA_Outdoor_WFM.docx.
- Matching User Journey row in `/Users/parithimalsaravanan/claude-projects/vfq/data/CRM_Journeys_Final_Updated_with_Type.xlsx`: not confirmed in this pass — a lookup was attempted but no definitively matching row could be tied to this specific document; treat any FWA/Indoor/Tablet row in that workbook as a candidate cross-reference only.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 18 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which only recovered the title heading and generic auto-generated alt-text placeholders with no field-level detail. All 18 images were legible and informative — none were blank, duplicate, or UI-chrome-only. The flow as captured has one visible gap: the "7. Book Appointment" step's own input screen (date/slot picker) was not directly captured — it is only seen already marked "Saved!" in later screenshots (images 12 and 16) — so the appointment-booking UI itself is not documented here, though its outcome is confirmed.

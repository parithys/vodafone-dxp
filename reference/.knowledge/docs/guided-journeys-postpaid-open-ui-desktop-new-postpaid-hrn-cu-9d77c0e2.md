---
slug: guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Open UI Desktop_New Postpaid_HRN Customer_Credit Limit.docx
sha256: 4e87ad3130ed53e3865d6c4487f322ed2e44c95b6156bb49fa2589ab67755fe7
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop — New Postpaid Activation for an HRN (High-Risk-Nationality) Customer, Including Credit Limit Edit

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots system-timestamped 2-Apr-2026, agent session dated 4/2/2026)

## Purpose
A click-through training/reference guide showing a Vodafone Qatar Open UI Desktop (Siebel-based CRM) agent processing a **New Postpaid** activation for an existing customer whose account is flagged **"(HRN) Customer"** (a Nepalese-national Qatari-ID holder), demonstrating where the system auto-populates a default pre-approved credit limit and how the agent can override/edit that credit limit mid-journey before generating the contract and submitting the order.

## Key content
1. **Starting context (Account Detail view).** Existing account "YAM POKHAREL," Account # 129818367221, Site "Qatari ID_27652419981," Account Class Customer, Account Type Residential, Customer Segment **Expatriate**, Primary MSISDN 97479025482, Notification Contact Number 97481486708. The `CR Type` field is set to **"Pre-approved (Expatriate/Qatari)"** with a value of **800** next to it — this is the account's default/pre-approved credit limit before the journey begins. Credit Risk shows "No score." An ID popup for 27652419981 shows YAM POKHAREL, DOB 03/25/1976.
2. **Home page.** Agent "KARTHIKK KARTHIKK" logged into the Open UI Desktop landing page (Thursday, April 02, 2026), hovers the "Consumer Postpaid" tile among the module icons (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Passport to QID, Activities, Training, New Fixed Line, etc.).
3. **Guided Process — "1. Choose process."** Four options: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid.
4. **Step 1 — Contact.** Agent enters "Please enter the customer's Qatari ID or Passport number": ID number `27652419981`, ID type `Qatari ID`, clicks Go.
5. **Step 1 — Contact confirmation / HRN flag.** "Please confirm the contact details below" shows ID number 27652419981, ID type Qatari ID, ID expiry 4/2/2027, **Nationality: Nepalese**, Gender M, First name YAM, Last name POKHAREL, Birth date 3/25/1976. A **"Connection Details"** popup appears: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 1", a "Show Postpaid Plan Details" link, and the info banner:
   > **"(HRN) Customer needs to pay advance payment of QR 100."**

   This is the literal HRN (High-Risk-Nationality) advance-payment rule surfaced by the system for this nationality/customer profile. Continuing scrolls the same Contact step to show Digital Lead/Sale = No, Email noemailid@vodafone.com, Language English (verified), Alt. phone # 97412345123 (verified). Buttons: Continue, Search again, Cancel.
6. **Step 2 — Address.** Blank fields Zone, Street No., Building No., Apt/Flat/Unit. Buttons: Save Address, Skip Address, Cancel, Go Back. (In the next screenshot this step shows "Saved!" along with "3. Account: 129818367221 — Saved!".)
7. **Step 4 — Billing: Postpaid.** An existing billing profile row is shown: Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email, Name "1-DP533F2." Continue / Cancel / Go Back.
8. **Step 5 — Number Selection.** "Reserved Numbers" (initially No Records) and "Unreserved Numbers" grids. Agent clicks Reserve on an available mobile number; a JS confirm alert reads:
   > **"SUCCESS:Reservation Token:15632489(SBL-EXL-00151)"**

   Unreserved list shows FREE/CONSUMER mobile numbers (e.g., 97479025456, 97479025473, 97479027970, 97479025474, 97479029806, 97479027988), all priced QR0.00, Status AVAILABLE. After reserving, "Reserved Numbers" shows 97479025456, Reserved By KARTHIKK, Price QR0.00. The step later shows "5. Number Selection: 97479025456 — Saved!".
9. **Step 6 — SIM Serial.** "Please enter or scan the SIM Serial number below." SIM Serial entered: `8942702400000026205` (verified). Step later shows "6. SIM Serial: 8942702400000026205 — Saved!".
10. **Step 7 — Plan (Product Catalog).** "Please Select a Plan," searchable tile grid of postpaid plans: Postpaid Retired Data Plan 300 Promotion, Postpaid Platinum Promotion, Postpaid Special Public Offer A/B Promotion, Postpaid Shareholder Silver Promotion, Postpaid Silver Promotion, **Postpaid Red 350 Promotion** (selected), Postpaid Red VIP Promotion, Postpaid Red 750 Promotion, Postpaid Legacy Red 250 Promotion, Postpaid Legacy Super Saver 150 Promotion, Postpaid Super Saver Local Promotion.
11. **Step 7 — Plan detail / Credit Limit edit (the "Credit Limit" half of the filename).** Clicking "Add" on Postpaid Red 350 Promotion opens a detail panel:
    - Included components: Red 350, Red 350 Data, Mobile Voicemail, SIM Card, Activation Bar-Mobile Roaming, 20GB Data Bonus for 6 Months, GCC Passport Pack Postpaid, Bill Manager, "…" (more, via Customise)
    - "No Bill Limit selected"
    - **"Credit Limit:800"** — matches the account's pre-approved default seen in step 1 — with an **"Edit Credit Limit"** button
    - Clicking Edit Credit Limit reveals a dropdown of selectable values: 0, 1000, 1500, 200, 2000, 50, 500, 800, plus a "Go" button
    - Agent selects **1000** and clicks Go; the panel updates to **"Credit Limit:1000"**
    - Buttons: Add Deposit, Customise, Continue to Payment, Cancel, Go Back
    - Step later shows "7. Plan: Postpaid Red 350 Promotion — Saved!"
12. **Step 8 — Payment.** Banner "Take Payment in Wincash." "Number" panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown = "For Testing Only." "Upfront & Deposit" grid (Payment / Amount / Wincash Reference) is empty in this walkthrough — no advance payment line was actually entered on screen despite the earlier HRN QR 100 advance-payment notice (see Extraction notes). Button: Generate CAF. Step later shows "8. Payment — Saved!".
13. **Step 9 — CAF (Customer Application Form).** "Attachments" panel with "New File" upload (empty). A "CAF" split-button offers **CAF-Digital**, **CAF-Manual**, **CAF-Touch Screen**.
14. **Generated CAF document.** A bilingual (Arabic/English) "استمارة عميل فودافون / Vodafone Customer Application Form" is rendered:
    - Date 2-Apr-2026, Retailer ID 1234
    - Section 1 – Applicant details: Customer type Consumer, Name YAM POKHAREL, Date of birth 25-Mar-1976, Qatar ID Number 27652419981, Expiry date 2-Apr-2027, Passport number blank, **Nationality Nepalese**, Email noemailid@vodafone.com, PO Box 1111, Kahramaa ID/Vodafone ID 1543, Alternative contact number LL:97412345123, MO:97481486708, Preferred language English, Address "TestZSB1, TestZSB1, TestZSB, AR"
    - Section 2 – Billing information: **Account credit limit 1000**, Smart Limit 350, IPTV Credit Limit blank, Bill date cycle 15, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice, credit card fields blank
    - Buttons: Sign Contract, Close and Retry
15. **Post-sign — Sales Order Line Items.** New tab (incognito), Order # **1-29819206680**, Revision 1, Type Sales Order, Primary MSISDN 97479025482, Account YAM POKHAREL, Order Type Activation, Order Sub Type blank, Status **Pending**, Created 4/2/2026 11:35:21 AM by KARTHIKK, Due/Order Date/Status As Of 4/2/2026 11:35:2x, Billing Profile 1-DP533F2 (Postpaid), Bill Cycle 15, Email Bill To noemailid@vodafone.com, Total QR25.00, MRC Total QR353.00, NRC Total QR25.00, Currency QAR, Network 1-DP5L34O, Organization Default Organization, Success Dependency Default, Priority Medium-Pending, Postpaid Count present, Service Type Mobile, Source CRM. On the right rail: Credit Control Credit Limit blank, **Credit Limit: 1,000** (highlighted field), Enterprise/VIP credit limit blank.
16. **Final state — Account Detail (Orders tab).** Account YAM POKHAREL now shows the "Pre-approved (Expatriate/Qatari)" field value updated from 800 to **1,000**, confirming the credit-limit override made during the journey persisted back to the account record. "Orders" grid lists 2 records for this account:
    - 1-29819206680 — Sales Order — **Pending** — Medium — 4/2/2026 11:35:21 AM — YAM POKHAREL / POKHAREL — (the order just created in this walkthrough)
    - 1-29819138195 — Sales Order — Complete — Medium — 4/2/2026 09:20:00 AM — YAM POKHAREL / POKHAREL — Postpaid Activation Date 4/2/2026 09:20:00 AM (a prior, already-completed order on the same account, shown for context/comparison, not part of this walkthrough's step sequence)

**What "HRN Customer" and "Credit Limit" mean in this document, based on what was actually observed:**
- **HRN Customer** = a customer flagged by the system as belonging to a "High-Risk Nationality" category (here, Nepalese) at the Contact-confirmation step, which triggers the system message "(HRN) Customer needs to pay advance payment of QR 100" during the Connection Details check. It is not explained further in-product (no glossary screen was captured).
- **Credit Limit** = the postpaid account credit limit, which defaults to a "Pre-approved (Expatriate/Qatari)" value (800 in this account) and can be changed by the agent inside the Plan step via "Edit Credit Limit" (dropdown of preset values: 0, 50, 200, 500, 800, 1000, 1500, 2000). The walkthrough demonstrates raising it from 800 to 1000; the new value flows into the generated CAF ("Account credit limit: 1000"), the Sales Order ("Credit Limit: 1,000"), and back onto the Account record's pre-approved credit limit field.

## Cross-references
- Sibling guided journeys in the same folder (`data/Guided Journeys/Postpaid/`): `Open UI Desktop_New Postpaid.docx` (presumably the non-HRN baseline flow), `Cross Sales_Open UI Desktop_New Postpaid.docx`, `Desktop Vanilla_New Postpaid.docx`, `Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx` (tablet equivalent of this same HRN/credit-limit flow), `Open UI Tablet_New Postpaid_B2B2C_With/Without Approval.docx`, `Open UI Tablet_New Postpaid_NON_B2B2C_With Approval.docx`.
- Possible matching row in `data/CRM_Journeys_Final_Updated_with_Type.xlsx` under a "New Postpaid" / HRN or Credit Limit journey type — not verified in this pass (workbook not opened during this extraction).

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 21 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 21 images were clear, legible, and in a coherent sequential order (image1.png … image21.png matched actual document reading order via r:embed relationship parsing). One minor gap: the HRN-triggered "advance payment of QR 100" mentioned in the Connection Details popup (step 5 of this list) was never shown being explicitly collected in the Payment step's "Upfront & Deposit" grid, which appeared empty in the captured screenshot — the guide does not visually confirm how/where that QR 100 advance payment is actually entered, so that specific sub-step is inferred to occur off-screen or via a different control not captured. No other steps were ambiguous or blank.

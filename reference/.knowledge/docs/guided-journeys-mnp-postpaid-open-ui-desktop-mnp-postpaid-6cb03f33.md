---
slug: guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/MNP Postpaid/Open UI Desktop_MNP Postpaid.docx
sha256: 2933c5a6120c8b0b4746c2cbfc9d5ea48988aa4b43b898a650e1551a7d860189
indexed: 2026-08-21
confidence: high
---

# Open UI Desktop – MNP Postpaid Guided Journey (Ooredoo-to-Vodafone port-in, Postpaid U Start)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots timestamped 21-04-2025 in the agent's Windows taskbar clock, i.e. captured 21 April 2025)

## Purpose
Walks a Siebel/Open UI CRM agent through the full Mobile Number Portability (MNP) Postpaid journey: setting up an agent's sales responsibility, checking the Bill-Limit "Agent Min Value" guardrail on a promotion, then running the "MNP" guided process end-to-end for a customer porting a number in from Ooredoo to Vodafone Qatar on a Postpaid plan, including e-signature capture on the MNP application form and the Customer Application Form (CAF), ending in a submitted Siebel Sales Order.

## Key content

**Setup / admin context (Images 1–4)**
1. **Administration – User > All Person Administration**: agent "Hemanth Kumar" (User ID `HEMANTH`, Last Name Kumar, First Name Hemanth, Job Title "Team Leader", Contact Team `SADMIN`, Alias `1234999`, Email `hemanthk@maveric-s...`) is shown with Responsibility field set to "VFQA Sales" and a "New Responsibility" field showing "AT Service Analyti...".
2. A **Responsibilities** picker dialog lists available responsibilities (AT Partner Analytics Administrator/User, AT Sales Analytics Administrator/User, AT Service Analytics Administrator/User, Analyst Routing Model, Anonymous User - SMC, Asset Management, etc.) with a "Selected" panel already containing: Back Office Onshore, VFQ Base 2, and VFQA Sales (checked/primary).
3. **Administration – Product > Product Promotions > More Info** tab: promotion "Postpaid U Start Promotion" (Promotion ID `1-92T1KE1`), Type "Bundled Promotions", Payment Type "Postpaid", Effective Dates 08/27/2020–08/31/…, Instances "One Per Order", Show in Catalog / Track as Asset both checked.
4. Same promotion's **Bill Limit Mapping** tab → "Spend Limit Mapping" grid: two rows —
   - `1-1PQ439D` "Bill Limit Mobile": SL List Price 3, **Agent Min Value 50** (being edited, highlighted), SL Min Value 0.01, SL Default Value 20.
   - `1-1PQ439N` "Bill Limit Mobile Plus": SL List Price 0, Agent Min Value 75, SL Min Value 0.01, SL Default Value 20, Default Flag checked.
   This is the admin-side configuration of the "Agent Min Value" guardrail later enforced in the guided journey.

**Guided Journey entry (Images 5–6)**
5. Agent home page ("Welcome back Hemanth Kumar! Today is Monday, April 21, 2025.") — the MNP tile is highlighted/hovered in the app-icon grid alongside Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests.
6. Clicking **MNP** opens the "Guided Process" screen with a "Choose process" panel containing a single button: **Switch as Postpaid**.

**Step 1 – Contact (Images 7–10)**
7. **1. Contact** accordion: "Please insert or scan the customer's Qatari Id:" with field **Qatari ID** = `29035654458`, a green check confirming validity, and buttons Go / Search again / Cancel.
8. After Go, the section expands to "Please confirm the contact details below:" showing read-only fields: Qatari ID 29035654458, Id expiry 4/21/2026, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990, Digital Lead/Sale = No (radio). A **Connection Details** modal pops up showing "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 0", and a disabled "Show Postpaid Plan Details" button, with Continue/Cancel.
9. Scrolling down: Email `nobill@vfq.com` (required, green check), Preferred Language `English` (required, green check), Alt. phone # `97412341234` (required, green check), Continue / Search again / Cancel buttons, and an **Attachments** panel with an Upload button and 4 existing files: Test.jpg, "Qatari ID-Back 1542025 1242...", "Qatari ID-Back 942025 11840...", Vishakan_Photo_Blue.jpg (each deletable via trash icon).
10. Below that, section **2. Address** collapsed/closed at bottom of view.

**Step 2 – Address (Images 11–12)**
11. **2. Address** expanded: empty fields Zone, Street No., Building No., Apt/Flat/Unit, with buttons Save Address / Skip Address / Cancel / Go Back.
12. Same screen after entry: Zone `13`, Street No. `45`, Building No. `345`, Apt/Flat/Unit `H7882`. Save Address clicked (form filled, ready to save).

**Step 3 – Billing (Image 13)**
13. **3. Billing: Postpaid** expanded: a billing-account grid row — Status (green bar), Language ENG, Payment Type Postpaid, Billing Profile St. Active, Payment Method (cut off), Bill Media Email, Name `1-D87EQYB`. Continue / Cancel / Go Back buttons.

**Step 4 – SIM Serial (Image 14)**
14. **4. SIM Serial**: "Please enter or scan the SIM Serial number below." Field SIM Serial = `8942702400000026363`, green check. Continue / Cancel / Go Back. Below it, collapsed steps 5 Plan, 6 Donor Details, 7 Donor Attachment, 8 CAF, 9 Activity are visible as the remaining accordion stack.

**Step 5 – Plan (Images 15–24) — the core Bill-Limit validation sequence**
15. Steps 1–4 now show "Saved!" (Address, Billing: 1-D87EQYB, SIM Serial: 8942702400000026363). **5. Plan** expanded: "Please Select a Plan." with a search box filtered to "U", showing plan cards: Postpaid QA UK Black Plan Promotion, Postpaid Data Plan Unlimited 350 CS Callback Promotion, Postpaid Unlimited 300 Promotion, Postpaid U Plus Promotion, **Postpaid U Start Promotion** (outlined/selected in red), Postpaid Unlimited 450 Promotion, Postpaid Unlimited VIP Legacy Promotion, Postpaid Unlimited Plus VIP Promotion — each with an "Add +" action.
16. Clicking "Add" on **Postpaid U Start Promotion** opens a detail modal: "Smart Limit: 20", an "Edit Smart Limit" button, a note "Default Smart Limit should be communicated to the customer", "Credit Limit: 1000", and an included-features list with a play/arrow icon: U Start, U Start 8G_150LMin, Mobile Voicemail, SIM Card, Bill Manager, DOB Eligible, Carry_forward_charges, Bill Limit Mobile — plus a "Customise" button and Cancel/Go Back.
17. Clicking "Edit Smart Limit" reveals an inline "Enter New Smart Limit" input + Go button (Smart Limit still shows 20).
18. Agent types **`28`** into the Smart Limit input and clicks Go → validation message appears: **"Bill Limit can not be set lower than Agent Minimum 50"** (red banner). This is the min-value validation rule referenced by the prior partial extraction, now confirmed verbatim and in full context — it fires when the entered Smart Limit (28) is below the Bill Limit Mobile promotion's configured Agent Min Value (50, per image 4's Bill Limit Mapping grid).
19. Agent retries with **`67`** in the Smart Limit field (now valid, ≥ 50).
20. Modal now shows "Smart Limit: 67" (accepted) with an "Edit Smart Limit" button again available, Credit Limit: 1000, same feature list, Customise button.
21. **6. Donor Details** expanded: "Please enter donor details below." Fields: Port-in Number `97466000666` (green check), Donor ID `893093` (green check), Donor ID Type = `Passport` (dropdown), Donor Type = `Consumer` (read-only/greyed), Donor Operator = `Qtel` (read-only/greyed, i.e. Ooredoo/Qtel is the losing/donor operator), Subscription Type = `Postpaid`. Continue / Cancel / Go Back.
22. **7. Donor Attachment** expanded: empty Attachments grid ("No Records"), New File button, and action buttons Continue / **MNP Form** / Abandon Order / Go Back.
23. Clicking "MNP Form" opens a dropdown with two options: **MNP-Digital** and **MNP-Touch Screen**.
24. Selecting MNP-Digital opens the **Mobile Number Portability Application Form** (bilingual Arabic/English, Vodafone-branded): Date 21/4/2025, Retailer ID 1234999, Segment = Consumer (checked), Switching type = Single switching (checked), Current service type = Postpaid (checked). Applicant details table: Current service provider **Ooredoo**, Customer name Vishakan Soundararajan, Number to be switched to Vodafone/Primary number `97466000666`, Type of ID used = Passport, ID number 893093. Applicant declaration section lists standard MNP terms (a–d for all customers; postpaid-specific clauses on settling unpaid/final bills within 30 days; prepaid-specific clause). Buttons: **Sign Contract** / Close and Retry.

**e-Signature and form completion (Images 25–30)**
25. Scrolled further down the same MNP form: the Applicant's signature field now shows a captured signature image plus text "**HEMANTH 2025-21-4 12:9:45**" (agent-captured timestamp/name), followed by a "Multi number switching" table (rows 1–10, empty except row numbers) and the start of "Vodafone Qatar General Terms and Conditions for Mobile Number Portability" (bilingual), with a Done button.
26. A **signature capture pad** ("Please Sign") shown separately with a drawn cursive signature and Done / Clear Signature buttons — this is the on-screen signing interaction used to populate image 25's signature field.
27. After signing, clicking Done triggers a browser alert dialog: **"10.162.53.100:4443 says — Advise customer to send switch to 151. 'SMS costs 1Dhs'"** with an OK button. This is a system-generated instruction to the agent to tell the customer to text "switch" to short code 151 (SMS costs QR 1) as part of the porting process.
28. Back in **7. Donor Attachment**, the Attachments grid now shows "1 - 2 of 2" with two uploaded files: "Letter for Extension of Contra..." and "Digital_MNP_Form_4212025...". Continue / MNP Form / Abandon Order / Go Back buttons remain.
29. **8. CAF** expanded (Donor Details and Donor Attachment both show "Saved!"): empty Attachments grid ("No Records"), New File button, and action buttons Continue / **CAF** / Abandon Order / Go Back.
30. Clicking "CAF" opens a dropdown with three options: **CAF-Digital**, **CAF-Manual**, **CAF-Touch Screen**.

**CAF form and order creation (Images 31–33)**
31. The **Vodafone Customer Application Form** (bilingual, "استمارة عميل فودافون") opens: Date 21-Apr-2025, Retailer ID 1234999. Section 1 – Applicant details: Customer type Consumer, Name Vishakan Soundararajan, DOB 7-Mar-1990, Qatari ID 29035654458, Expiry 21-Apr-2026, Nationality Indian, Email nobill@vfq.com, PO Box 1111, Alternative contact LL/MO 97412341234, Preferred language English, Address "Zone 13, Street 45, Building No. 345, Apt/Flat/Unit H7882, Qatar". Section 2 – Billing information: Account credit limit 1000, **Smart Limit 67** (confirming the earlier-approved value), Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice. Sign Contract / Close and Retry buttons.
32. Scrolled further: Section 3 – For Postpaid Customers: Mobile number `97466000666` (highlighted/selected), Primary mobile number `97479025448`, Voice = Y, Data SIM `97466000668`, Postpaid Plan = **U Start**, Extras row = **Bill Limit Mobile**, a proration note, and a Postpaid terms/conditions acknowledgment block (with USSD code *200*321# reference). Section 4 – Superfast Broadband & Home Phone is present but entirely blank (not applicable to this mobile-only order). Sign Contract / Close and Retry.
33. Final screen: the resulting **Siebel Sales Order** (Order # `1-28920871362`), Account "Vishakan Sounda[rarajan]", Order Type **Activation**, Order Sub Type **Port-In**, Status **Pending**, Site "Postpaid_290356544", Primary MSISDN `97479025448`, Billing Profile `1-D87EQYB` (Postpaid), Price List "VFQA PriceList", Currency QAR, Total QR25.00, MRC Total QR108.00, NRC Total QR25.00, Credit Limit 1,000, Created By HEMANTH, Created 4/21/2025 12:15:42 PM, Network `1-DAAQN5U`, Digital Lead/Sales unchecked. Toolbar shows Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order.
   A second view of the same order's **Line Items** grid shows the full bundle breakdown: 1 Postpaid U Start Promotion; 2 Mobile Service Bundle (expanded) containing 2.1 U Start (QR105.00), 2.2 Mobile Voicemail (QR0.00), 2.3 SIM Card (SIM `894270240000...`, QR25.00), 2.4 Bill Manager (QR0.00), 2.5 DOB Eligible (QR0.00), 2.6 Carry_forward_charges (QR0.00), 2.7 **Bill Limit Mobile** (QR3.00), 2.8 Mobile Port-In (linked to donor number 97466000666). Below, the **Line Item Attributes** grid for the Bill Limit Mobile line shows: `SL Default Value` = 20, `SL Limit Amount` = **67** (being edited, matches the Smart Limit accepted earlier), `SL Min Value` = **0.01**, each with Action "Add" and Data Type "Text" — confirming the "SL Min Value: 0.01" figure recovered in the original partial extraction, now shown in its true UI context as a line-item attribute on the submitted order rather than a standalone fact.

## Cross-references
- Folder `Guided Journeys/MNP Postpaid/` likely contains a companion "Open UI Desktop_MNP Prepaid" or similar variant document (not opened in this pass).
- The prior text-only extraction recovered only the fragment "Retail MNP Postpaid – Edit Bill limit Screenshot" plus the isolated "SL Min Value: 0.01" data point (visible in image 33's Line Item Attributes grid) and referenced an "Agent min value" concept (fully explained here via images 4, 18, 20 as the Bill Limit Mobile promotion's configured floor of 50).
- Should be cross-checked against `CRM_Journeys_Final_Updated_with_Type.xlsx` for a matching "MNP Postpaid" / "Switch as Postpaid" row describing this journey at a process level.

## Extraction notes
Confidence upgraded from low on 2026-08-21. Recovered by direct visual inspection of all 33 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 33 images were viewed in true document order (image1.png → image33.png, confirmed via r:embed relationship order in word/document.xml). The flow is coherent and complete end-to-end: agent setup/admin config → guided-process launch → Contact → Address → Billing → SIM Serial → Plan (with the Bill-Limit Agent-Minimum validation demonstrated live: rejecting 28, accepting 67) → Donor Details → Donor Attachment (MNP-Digital form, e-signature, "send switch to 151" SMS instruction) → CAF (CAF-Digital form) → submitted Sales Order with full line-item breakdown. No images were blank or unreadable; no gaps in the narrative. One minor inconsistency in the source screenshots themselves: image 32's Data SIM number is displayed as 97466000668, one digit off from the Mobile/Port-in number 97466000666 shown elsewhere — likely a display quirk or adjacent-line SIM assignment in the test data, not an extraction error.

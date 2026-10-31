---
slug: guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Fixed Line/Open UI Desktop_Fixed Line_Fulfilment Team (Skip Attachments).docx
sha256: a73d352ff4e47f41c425ab0613eb08653c0709fadb4ee9c4a4726a6f9635cbce
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop – Fixed Line, Fulfilment Team: New Fixed Line Guided Journey Walkthrough (Skip Attachments)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path (Fulfilment Team back-office variant)
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots are timestamped 05-06-2024, i.e. system clock showed Wednesday, June 05, 2024)

## Purpose
A screenshot-by-screenshot walkthrough showing a Vodafone Qatar Back Office Fulfilment agent ("Hemanth Kumar") logging into Siebel Open UI Desktop, launching the "New Fixed Line" guided journey for a residential customer, and driving it end-to-end — contact confirmation, address/service-point selection, plan and add-on selection, number reservation, appointment booking, and CAF submission (attachments skipped at both the Contact and CAF steps, per the file's naming) — through to a completed Sales Order with generated line items.

## Key content
1. **All Person Administration — user setup.** Persons list search by User ID "Hemanth"; record for Last Name "Kumar", First Name "Hemanth", User ID "HEMANTH", Responsibility "Back Office Fulfilment". Detail form shows Job Title "Team Leader", Alias "1234999", Email "hemanthk@maveric-sy…", Contact Team "SADMIN", Responsibility "Back Office Fulfilm[ent]", New Responsibility "AT Service Analytic[s]".

2. **Responsibilities dialog.** Opened from the person record; Available list (search by Responsibility) on the left, Selected list on the right shows "Back Office Fu…" (checked/primary) and "VFQ Base 2", both under "Default Organization". Confirmed with OK.

3. **Siebel Web Call Center Home page.** Banner: "Welcome back Hemanth Kumar! Today is Wednesday, June 05, 2024." Full navigation tile grid includes Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Action Required, Activities, **New Fixed Line** (cursor hovering here, tooltip "New Fixed Line"), New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval.

4. **Step 1 – Contact (KID/QID entry).** New Fixed Line wizard opens on "1. Contact" — "Please enter Kahramaa & Qatari Id:" — Kahramaa ID = `16P6061`, link "Search Zone/Street", Qatari ID = `29035654458`. Buttons: Go, Search again, Cancel. Steps 2–5 (Address, Plan, Addon & Discount, Number Selection) shown collapsed below.

5. **Step 1 – Contact confirmation.** After Go, contact details auto-populate (read-only/greyed): Qatari ID 29035654458, ID Expiry 6/5/2025, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990, Digital Lead/Sale = No, Lead/Opportunity ID blank, Enter ECR Details = No (green check, tooltip "To be filled by Fulfillment team only"), Get IPTV? = Yes, Email = nobill2@vfq.com, Language = English, Alt. phone # = 97412341234 (info note: "This is a notification contact. Please enter a local mobile number."). A popup titled **"Fixed Line IPTV"** appears with info banner **"IDM Created Successfully"**, a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field = `Nobill123@vfq.com`, confirmed with "Ok". After dismissing, all edited fields (Email, Language, Alt. phone #) show green checkmarks. Attachments section appears below with an "Upload" control — **per the file title, this step was skipped without uploading any attachment**; the wizard proceeds via "Continue".

6. **Step 2 – Address.** A grid of address records tied to various Kahramaa IDs (BCW-LAB_G… entries in Doha, Qatar). The row with Kahramaa Id `16P6061` (Zip 11274) is checked as Primary. Below it, a "Service Points" sub-grid lists Service Point `16P6061_004`, Install Date 10/1/2023, Location "Not In Use", Status "Available", Product "Fixed Line Port", Service Type "Fixed Line", Device Type "ONT".

7. **Step 3 – Plan.** "Please Select a Plan." — searchable catalog grid of promotions: GigaHome Classic 300 TB -F Promotion (selected), GigaHome Premium 450 TB -F Promotion, GigaHome Partners 300 -F Promotion, GigaHome Essential 250 QA -F Promotion, GigaHome Classic QA 330 -F Promotion, GigaHome VIP 1500 -F Promotion, Home Internet 250 - W Promotion, GigaHome Classic 350 O -4G Promotion, GigaHome Essential 250 -F Promotion, GigaHome Classic 350 -F Promotion, GigaHome Premium 500 -F Promotion. Selecting "GigaHome Classic 300 TB -F Promotion" opens a detail confirmation panel (green check) listing bundled components: GigaHome Classic 300 TB -F, Special Discount - 3 Months Free, VoIP Service, Voicemail, Call Waiting, Call Forwarding, Three Way Conference Calling, Calling Line Identity (CLI), plus additional items ("…"). Confirmed via "Continue".

8. **Step 4 – Addon & Discount.** "Select applicable add-on and discount based on customer's plan." Buttons "Select Add-on" / "Select IPTV Add-on". Auto-populated **IPTV Add-ons:** OSN Get Started, Standard package, Vodafone Club, IDM ID. **Discount:** Special Discount - 3 Months Free. Info note: "Note: if there are no applicable add-on or discount, the selector will be empty." Confirmed via "Continue" → step badge changes to "Saved!".

9. **Step 5 – Number Selection.** "Select a Number to Reserve:" with an 8-digit number search box and tabs "Free Number" / "Reserved Number". Free-number tiles shown at QR0.00: 40204351 (selected), 41201373, 40204255, 40204407, 40204275, 40204225, 40010150, 40204066, 40204169, 40204116. Clicking "Reserve" moves to the "Reserved Number" tab, and the step header updates to "5. Number Selection: 97441202039" showing reserved candidates 41224317 (selected), 41224291, 41202039 (all QR0.00). "Continue" finalizes the number as **97441224317** (per the later-confirmed accordion header "5. Number Selection: 97441224317").

10. **Step 6 – Book Appointment.** Modal "Book Appointment": "Select Cluster" radio — Cluster 1 (selected) / Cluster 2; info banner reminding the agent to confirm scheduling with the customer; a June 2024 calendar with the 5th selected/highlighted; time-slot buttons "11AM - 2PM" (selected), "2PM - 5PM", "5PM - 8PM"; Refresh and Submit buttons. On Submit, a browser confirm dialog appears: **"WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."** Clicking OK triggers a "Processing, please wait…" spinner, then a success alert: **"Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242."** The step then shows a result table: Appointment Number `1-26921281993`, Technician ID `ABATS_Consumer_Installation`, Status `pending`, Appointment Date `06/05/2024`, Channel `SIEBEL`, Activity ID `113242`, Time Slot `11AM - 2PM`. Continue advances the step to "Saved!".

11. **Step 7 – CAF.** "Attachments" section shown with a "New File" upload link and drop area (existing library shows "1 - 10 of 18+" reusable attachments). **Per the file's stated scope, this step is completed by clicking Continue without uploading any attachment.** Buttons: Continue, CAF, Abandon Order, Go Back. On Continue, the accordion shows "Submitting the Order… Please Wait…", followed by a success dialog: **"Fixed Line completed successfully. Order Number:- '1-26921279847'"** with a "Finish Process" button.

12. **Post-completion — Account Orders view.** Navigates to "Account Orders: Vishakan Soun[dararajan]" (Account 360 View). Account fields: Account Name "Vishakan Soundara[rajan]", Account # `126897979237`, Account Class Customer, Account Type Residential, Customer Since 2/19/2024, Customer Segment Expatriate, Address BCW-LAB_GP…, City Doha, Country Qatar, Primary Contact / Notification Contact "Vishakan Soundara[rajan]" / "Soundararajan", Notification Language English, Notification Contact Number 97412341234, Pre-approved (Expatriate/Qatari) 1,000, Credit Risk "No score", Primary MSISDN `97479025619`, Kahramaa ID `16P6061`, Account Team `AKKIRAJJUB`, Status Active. The Orders tab lists the new order **1-26921279847** (Type Sales Order, Status Open, Priority Medium, Order Date 6/5/2024 11:22:48 AM) alongside prior historical orders for the same account (several "Abandoned", one "Complete").

13. **Order detail — header.** Opening order 1-26921279847: toolbar actions Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order, ReSubmit. Key fields: Order Type "Activation", Order Sub Type "Triple Play", Status "Open", Created "6/5/2024 11:22:48 AM" by "HEMANTH", Due/Order Date same, Status As Of "6/5/2024 12:19:3[0]", Fulfillment Status "In Progress", Billing Profile "1-CCUD2H3" (Postpaid), Service Account/Billing Account "Vishakan Sounda[rarajan]", Price List "VFQA PriceList", Currency QAR, MRC Total `QR300.00`, NRC Total `QR0.00`, Total `QR0.00`, Credit Limit 1,000, Source "CRM", Service Type "Fixed Line", Kahramaa Id `16P6061`, Priority "Medium-Open", Success Dependency 6/5/2024, Requested Date "Default", Last Modifying User HEMANTH. Sub-tabs: Catalog, Numbers, Line Items (active), Payments, Trouble Tickets, Attachments.

14. **Order detail — Line Items (13 total, hierarchical).** Toolbar: Customize, Get Secondary ICCID, Auto-Asset, MultiAdd, CAF, Profile, Book Appointment, Book Unscheduled Appointment. Full line-item tree (all Action = "Add", Billing Profile `1-CCUD2H3`, Address "test"):
   - 1. GigaHome Classic 300 TB -F Promotion — Status Context "FULFILL BILLING START: reached", Fulfillment Status In Progress, Start Price QR0.00
   - 2. Broadband Internet Service (parent) — Service Id `97441224317`, "INITIATE BILLING START: reached"
     - 2.1 GigaHome Classic 300 TB -F — Start Price QR300.00
     - 2.2 VoIP Service
     - 2.3 ONT MDU Port Equipment — "INITIATE WFM START: reached"
   - 3. IPTV Service Bundle (parent) — Service Id `126921280303`, "INITIATE BILLING START: reached"
     - 3.1 OSN Get Started — QR0.00
     - 3.2 Standard package — QR0.00
     - 3.3 Vodafone Club — QR0.00
     - 3.4 Android STB — QR0.00, "INITIATE WFM START: reached"
     - 3.5 IDM ID
   - 4. CPE Bundle (parent) — Service Id `126921280360`, "INITIATE BILLING START: reached"
     - 4.1 Broadband CPE — QR0.00, "INITIATE WFM START: reached"

   Totals panel: Monthly Charges — Item Total MRC `QR300.00`, Total Item Discount MRC `QR0.00`, Net Total MRC `QR300.00`; Equipment & Installation Charges — Item Total NRC `QR0.00`, Net Total NRC `QR0.00`; Total Due Now — Total NRC `QR0.00`, Order Total `QR0.00`.

## Cross-references
- Sibling document in the same folder: "Open UI Desktop_Fixed Line_Cross Sales" (or similarly named agent-facing variant) — describes the same underlying "New Fixed Line" guided journey but for a Cross Sales agent role rather than Back Office Fulfilment; both appear to converge on the identical wizard (Contact → Address → Plan → Addon & Discount → Number Selection → Book Appointment → CAF).
- Likely maps to a "New Fixed Line" or "Fixed Line Activation – Fulfilment" row in `CRM_Journeys_Final_Updated_with_Type.xlsx` (not independently verified in this pass).

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 25 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass, which had only recovered step captions without field-level detail. All 25 images were legible and informative; none were blank or ambiguous. One minor inconsistency in the source screenshots themselves: the reserved-number step briefly shows a transitional header "5. Number Selection: 97441202039" before the final confirmed number becomes "97441224317" (visible in later steps/order line items) — this is a genuine mid-flow number swap in the recording, not an extraction error, and is preserved above. Two attachment steps (Contact step and CAF step) show upload UI present but per the file's own scope ("Skip Attachments") were not exercised in this walkthrough.

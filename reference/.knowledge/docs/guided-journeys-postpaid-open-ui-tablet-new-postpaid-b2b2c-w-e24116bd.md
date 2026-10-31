---
slug: guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Open UI Tablet_New Postpaid_B2B2C_With Approval.docx
sha256: 74d13d8b60d1b5fbe4eaacd550e3c4e03089fb945d8723a43a95d95b5e8cb6c0
indexed: 2026-08-21
confidence: high
---

# Open UI Tablet – New Postpaid, B2B2C, With Approval: end-to-end click-through (application → manager approval → order completion)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots are dated 17-Aug-2025, a test/demo run)

## Purpose
Shows a Vodafone Qatar retail agent, using the Open UI Tablet guided journey, how to sell a New Postpaid line under the B2B2C (business-linked consumer) model where the order requires manager/approver sign-off before the line is provisioned — i.e. it documents the "With Approval" variant of the B2B2C New Postpaid flow, from Contact capture through to a Manager approving the order in a separate "Order Approval" queue and the order reaching Complete/Fulfilled status.

## Key content

1. **Home screen** – Agent "VINODHINIR VINODHINIR" logs in; date shown "Sunday, August 17, 2025." Top menu includes Home, Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap. Agent hovers/clicks "Mobile Postpaid."

2. **Choose process** screen (Guided Process) – two options: "New Postpaid" and "Prepaid to Postpaid." Agent selects **New Postpaid**.

3. **Step 1 – Contact**: Agent scans/enters Qatari ID `29035654458`, clicks **Go** (Search again / Cancel also present). Wizard accordion shows steps 1–6 (Contact, Address, Plan, Addon & Discount, Number Selection, SIM Serial).

4. **Contact confirmation**: Fields returned/prefilled — Qatari ID `28035650506`, ID Expiry 8/17/2026, Nationality Indian, Gender F, First name SELBATH, Last name JAMALUDEEN, Birth date 5/31/1980, Lead/Opportunity ID (blank), Company Name (dropdown, blank at first), Digital Lead/Sale = No. A **"Connection Details"** popup appears: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 0", with a disabled "Show Postpaid Plan Details" button; agent clicks **Continue**.

5. **Company Name dropdown** (the B2B2C linkage step) – agent opens the Company Name selector; options shown: "01 newfreedcn01_Test", "01 querybar01", "TestVQW". Agent selects **"01 newfreedcn01_Test"**. Enter ECR Details = No, with note "To be filled by Fulfillment team only." Email, No Email, Language, Alt. phone # fields appear below, each marked mandatory (red asterisk).

6. **Contact details completed**: Email = `noemailid@vodafone.com`, "No Email" checkbox ticked, Language = English, Alt. phone # = `97412341234`. "Qatari ID-Front" and "Qatari ID-Back" images captured (green checkmarks). Agent clicks **Continue** (Search again / Cancel also shown).

7. **Step 2 – Address**: Zone, Street No., Building No., Apt/Flat/Unit fields (later filled with "test90" for all four, per the CAF preview). Buttons: **Save Address**, Skip Address, Go back, Cancel. Step 3 "Plan" shows a "Pending" flag until Address is saved.

8. **Step 3 – Plan**: "Please Select a Plan." A searchable tile grid of plans is shown (Postpaid Plus Essential India/Pakistan/Philippines Promotion, Postpaid Plus Essential Promotion, BIA Postpaid Plus Extra Promotion, Postpaid Plus Extra Bangladesh Promotion, **Postpaid Plus Extra India Promotion** (highlighted/selected), Postpaid Plus Extra Pakistan/Philippines Promotion, Postpaid Plus Extra Promotion, BIA/Postpaid Plus Max Bangladesh Promotion, etc.). Agent clicks **Add** on "Postpaid Plus Extra India Promotion."

9. **Plan detail popup** – "Postpaid Plus Extra India Promotion": Bill Limit: 100 ("Edit Bill Limit" button, note: "Default Bill Limit should be communicated to the customer"), Credit Limit: 1000 ("Edit Credit Limit"). Included items list: Postpaid+ Extra, QR 25 Discount for 6 Months, Mobile Voicemail, SIM Card, Activation Bar-Mobile Roaming, Bill Manager, DOB Eligible, India Minutes AddOn, "…" (more, truncated). Agent clicks **Continue**.

10. **Step 4 – Addon & Discount**: "Select applicable add-on and discount based on customer's plan." Paid Add-Ons: "Select Add-on" button with note "Go back to Plan step and edit limit to cover for the add-on amount." Discount: "Select Discount" button; "QR 25 Discount for 6 Months" already shown as applied. Info note: "if there are no applicable add-on or discount, the selector will be empty." Agent clicks **Continue**.

11. **Step 5 – Number Selection**: "Select a Number to Reserve" with "Free Number"/"Reserved Number" tabs. Agent first views single number `40010150` (QR0.00), then a wider grid of free numbers appears (79025212, 79025215, 79027211, 79025202, 79027217, 79027238, 79027201, 79025205, 79027209, 79025219 — all QR0.00). Agent selects `79025212` and clicks **Reserve**.

12. **Reservation confirmation** – native browser alert: `"10.162.53.100:4443 says — SUCCESS:Reservation Token:13757449(SBL-EXL-00151)"`, OK button. Number becomes full MSISDN **97479025212**.

13. **Step 6 – SIM Serial**: "Please enter or scan the SIM Serial number below." SIM Serial = `894270240000026362`. Steps 3–5 show "Saved!" status. Agent clicks **Continue**. Accordion now also lists "7. CAF & Additional Attachments" and "8. Activity."

14. **CAF preview (Vodafone Customer Application Form)** – bilingual Arabic/English PDF-style preview: Date 17-Aug-2025, Retailer ID `100001940`, Customer type: Consumer, Name: "SELBATH JAMALUDEEN, 01 newfreedcn01_Test" (showing the linked company), DOB 31-May-1980, Qatari ID `28035650506`, Expiry 17-Aug-2026, Nationality Indian, Email `noemailid@vodafone.com`, PO Box 1111, Alternative contact LL/MO `97412341234`, Preferred language English, Address "Zone test90, Street test90, Building No. test90, Apt/Flat/Unit test90." Billing info: Account credit limit 1000, Smart Limit 100, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice.

15. **Signature capture** – "Please Sign" pad; customer signs; **Clear Signature** / **Done** buttons.

16. **Step 7 – CAF & Additional Attachments**: "Proof of Employment" (required, red asterisk) and "CAF" both shown captured with green checkmarks; "Add File" tile available for extra uploads. Agent clicks **Continue**.

17. **Step 8 – Activity**: Comments field with guidance "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history." Agent enters `Testing12345`. Button: **Save And Finish**.

18. **Submission confirmation — the "With Approval" branch point**: A dialog reads verbatim: **"Your activation request order number: 1-29710853118 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."** Button: **Finish Process**. (This is the defining difference from the "Without Approval" B2B2C variant, where this same submission step would instead activate/provision the line immediately without a pending-approval detour.)

19. **My Pending Approval Orders** (Sales Order module, agent's own view): grid filtered to "My Pending Approval Orders" shows Order # `1-29710853118`, SELBATH JAMALUDEEN, Mobile # 97479025212, Plan "Postpaid Plus …", Approval Status "Submitted for Approval", Status "Pending", Guided Journey "New Postpaid", ID Type Qatari ID, ID Number 28035650506. Detail panel below confirms Order #, Mobile #, SIM #, Created timestamp 8/17/2025 08:39:01 AM, Status = Pending (dropdown), Approval Status = "Submitted for Approv[al]".

20. **Back-office Order record** (full CRM order form) – Order Type: Activation, Status: Pending, Total QR25.00, Credit Limit 1,000, Billing Profile Type Postpaid, "Approved" checkbox unticked, "Approved By" blank, Priority "Medium-Pending," action buttons Revise / Validate / Select Favorites / Drop Order / Submit / MOI Validation / Generate Activity Plans / Cancel Order. Line Items tab (with an "Approvals" tab visible alongside Catalog/Notes/Payments/etc.) lists: "Postpaid Plus Extra India Promotion" (Add) and "Mobile Service Bundle" (Add, Service Id 97479025212).

21. **Account record** for SELBATH JAMALUDEEN: Account # `129630431127`, Account Class Customer, Account Type Residential, Customer Segment Expatriate, Pre-approved (Expatriate/Qatari) 1,000, Credit Risk "No score," Primary MSISDN 97479025212. Orders sub-tab shows the same order, Status Pending, Type Activation.

22. **Contact record**: buttons Create A/c, Mobile Eligibility, MOI Validation; "VFQ MOI Validation Status: Y"; MOI Update Time 8/17/2025 08:37:41.

23. **Role switch to Manager** – Home screen now for **"Test Manager"** ("Welcome back Test Manager!", same date). This account's top nav is reduced to just **Home** and **Order Approval**, confirming a distinct approver role/persona is used for this step.

24. **TM SR Queue View** (Order Approval landing page): lists approval queues (`ADJ_APPR_QUEUE_BUSI_1000`, `VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ`, `_JAGUAR`, `_TESTING`, `_VISTAS`). Below, an Activities grid with tabs **Order Activities Queue / My Activities / Activities History** and an **"Assign To Me"** button. The row for the submitted order (New Postpaid, 97479025212, Order 1-DND7ZJO / linked order 1-29710853118, SELBATH JAMALUDEEN) shows Activity Status "Ready To Assign," Order Approval Status "Submitted for Approval."

25. Manager clicks **Assign To Me**; the activity moves to the **My Activities** tab with Owner = MANAGETEST, Activity Status = "Assigned," and a **"ReAssign To Queue"** button becomes available (an escape hatch if the manager doesn't want to action it).

26. **Order Approval detail screen** (manager opens the assigned order): header shows Contact: SELBATH JAMALUDEEN, Contact Id 28035650506, Order # 1-29710853118, **Order Expiry: 20/08/2025 08:39:01 AM** (a 3-day SLA window from submission). Action buttons: **Approve**, **Reject - Correction**, **Reject - Drop Order**, **Go Back**. Four tabs: Attachments, Order Details, Activities, Agents Details.
    - **Attachments tab**: QatarIdFront, QatarIdBack, CAF, EmployerId — all reviewable via a zoom/reset image viewer. QatarIdFront shows a Qatar Residency Permit image (ID.No 29035654458, DOB 03/07/1990, Expiry 04/01/2025 — a stock/sample ID image, differs from the applicant's own ID number captured earlier, consistent with reused test data in a demo/training environment). QatarIdBack shows Passport Number W3128683, Passport Expiry 04/08/2032, Serial No. 30129035654458. CAF attachment ("1-DND2P3R_signed") reproduces the full signed Vodafone Customer Application Form, including Section 3 (Postpaid Customers): Mobile/Primary mobile 97479025212, Postpaid Plan "Postpaid+ Extra," Extras "Bill Limit Mobile Plus," customer signature timestamped "VINODHINIR 08/17/2025 08:46:11."
    - **Order Details tab**: Order # 1-29710853118, Status Pending, Journey Name New Postpaid, Approval Status "Submitted for Approval," Mobile # 97479025212, SIM # 8942702400000026362, Plan Name "Postpaid Plus Extra India P[romotion]," Created Date 8/17/2025 08:39:01 AM, Created By VINODHINIR.
    - **Activities tab**: Activity # 1-DND7ZJO, Status Assigned, Owner MANAGETEST, Channel "Approval Action," Type Other, Topic "Automated Gui[ded Journey]," Area "Approval - New…"
    - **Agents Details tab**: shows the submitting agent's profile — VINODHINIR, Login VINODHINIR, Designation "Assstant Manager" [sic, typo in source system], Email/Manager Email hemanthk@maveric-system…, Outlet Id 100001940, Company "Data Select," Location Chennai/QSTP, Team ChannelOps, Mobile (974) 708-9909 x1.

27. *(Anomalous screenshot, image32.png)* — an unrelated Oracle/Workday-style **timesheet** screen for a "Vishakan" (Quality Engineering) is embedded mid-sequence between Agents Details and the Approve confirmation. This does not belong to the CRM guided journey and is most likely an accidental capture (e.g., a stray screenshot/tab-switch during documentation); it is not part of the intended step sequence and is excluded from the numbered flow above.

28. **Approve Order modal**: Manager clicks **Approve**; a confirmation dialog reads: *"By clicking submit, I agree that I have verified all the documents and details to proceed with submission."* A Comments box is filled with **"Order Approved"**, with the same guidance note as the agent's Activity step ("Please note down a comment regarding the actions performed…"). Buttons: **Submit**, Cancel.

29. **Post-approval order state**: Back-office Order record now shows **Status: "Open"** (was Pending), **Fulfillment Status: "In Progress,"** Priority "Medium-Open," Last Modifying User MANAGETEST, Status As Of 8/17/2025 08:56. Line Items: "Postpaid Plus Extra India Promotion" — Status Context "FULFILL BILLING START: reached," Status Open; "Mobile Service Bundle" — Status Context "PROVISION START: reached," Status Open, Service Id 97479025212 — both Fulfillment Status "In Progress."

30. **Account record, post-approval**: the "Special Management" field is now populated/highlighted as **"B2B2C Consum[er]…"**, explicitly tagging the account under the B2B2C special-management category. Orders sub-tab shows the order Status "Open."

31. **Contact record, post-approval**: "Employer" field is now populated/highlighted showing **"01 newfreedcn0[1_Test]"** — the linked company selected in step 5, now surfaced as the contact's Employer. Address sub-grid confirms Zone/Street/Building/Apt = test90, Doha, Qatar, Postal Code 1111, Active, Start Date 7/15/2025.

32. **Final Order state (Complete)**: Order Status = **"Complete,"** Fulfillment Status = **"Complete,"** Priority "Medium-Complete," Status Context: **"All order lines are completed,"** Status As Of 8/17/2025 09:00:23 AM. This is the terminal, successful end state of the journey.

## Cross-references
- Sibling document in the same folder (`/Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/`): **"Open UI Tablet_New Postpaid_B2B2C_Without Approval.docx"** — the counterpart flow without the manager-approval detour; based on this document's dialog text at step 18, the "Without Approval" variant is expected to activate/provision the line directly from the Activity step's "Save And Finish," skipping the "submitted for approval" message, the Test Manager persona, the Order Approval queue, and the Approve Order modal entirely.
- Other related files in the same folder: "Open UI Tablet_New Postpaid_NON_B2B2C_With Approval.docx" (non-B2B2C counterpart with approval), "Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx", "Open UI Desktop_New Postpaid*.docx" (Desktop equivalents), "Desktop Vanilla_New Postpaid.docx", "Cross Sales_Open UI Desktop_New Postpaid.docx".
- Matching row in CRM_Journeys_Final_Updated_with_Type.xlsx: not verified in this pass (would correspond to a "New Postpaid" / B2B2C / Tablet / With Approval journey entry if present).

## Extraction notes
Confidence upgraded from low on 2026-08-21. Recovered by direct visual inspection of all 41 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 41 images were legible and informative except: image32.png, which is an out-of-place timesheet/HR application screenshot unrelated to the CRM flow (likely a stray capture) — noted in step 27 and excluded from the main narrative. One minor data inconsistency was observed and is expected/benign: the Qatari ID number shown in the "QatarIdFront" attachment during manager review (29035654458, DOB 1990) does not exactly match the applicant's own ID (28035650506, DOB 1980) captured earlier in the same walkthrough — consistent with reused/stock sample ID images in a test/training tenant rather than a genuine data error in the product flow.

---
slug: guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx
sha256: 277c0a200df7c88362bc8ffc81e6de5f0e2c2e21e938279307ed507930b1e721
indexed: 2026-08-21
confidence: high
---

# Open UI Tablet: New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (End-to-End Walkthrough with Manager Approval)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots are timestamped in-app 3/16/2026, a test/demo date)

## Purpose
Shows the complete Open UI Tablet flow for creating a brand-new postpaid mobile connection for a "HRN" (High-Risk/High-Revenue-Notification, i.e. pre-approved credit-limit) customer, from scanning the Qatari ID through plan selection, add-ons, number/SIM assignment, Customer Application Form (CAF) generation and e-signature, order submission for approval, a Test Manager approving the order, and the order reaching final "Complete" fulfillment status.

## Key content

1. **Starting point / contact lookup (image1):** Agent is on Accounts > Contacts view for account "BIBIRUKKSANA GULAJAN", Account Class Customer, Account Type Residential, Customer Segment Expatriate, Notification Contact Number 97412341234. Existing single contact BIBIRUKKSANA GULAJAN, email noemailid@vodafone.com, Qatari ID 28658600923.

2. **Home screen navigation (image2-3):** Agent "HALEEMI HALEEMI" on the Siebel Web Call Center Home page (date shown: Monday, March 16, 2026). Hovers "Mobile Postpaid" menu icon, which also lists MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap, Order Tasks, New Lead Tablet, New FWA Tablet. Clicking it opens a Guided Process "Choose process" screen with two options: **New Postpaid** and **Prepaid to Postpaid**. Agent selects **New Postpaid**.

3. **Step 1 – Contact (image4-6):** Wizard "New Postpaid - Contact" with accordion steps 1 Contact, 2 Address, 3 Plan, 4 Addon & Discount, 5 Number Selection, 6 SIM Serial (later 7 CAF & Additional Attachments, 8 Activity appear).
   - Prompt: "Please insert or scan the customer's Qatari ID:" — Qatari ID field = **28658600923**. Buttons: Go, Search again, Cancel.
   - After Go, contact record auto-populates: ID Expiry 3/16/2027, Nationality Pakistani, Gender F, First name BIBIRUKKSANA, Last name GULAJAN, Birth date 7/22/1986, Company Name B2B2C blank, Lead/Opportunity ID blank, Digital Lead/Sale = No.
   - A **"Connection Details"** popup appears: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 0", with a "Show Postpaid Plan Details" link, and a Continue button.
   - Further down: "Enter ECR Details" = No (info tooltip: "To be filled by Fulfillment team only."). Email = noemailid@vodafone.com (required, No Email checkbox unticked). Language = English. Alt. phone # = 97412341234. Qatari ID-Front and Qatari ID-Back images captured (green checkmarks). Continue / Search again / Cancel buttons.

4. **Step 2 – Address (image7):** "2. Address" section: Zone, Street No., Building No., Apt/Flat/Unit fields — shown blank in the screenshot (later populated to "Zone test89, Street test89, Building No. test89, Apt/Flat/Unit test89" per the CAF, see step 6). Buttons: Save Address, Skip Address, Go back, Cancel. Section 3 Plan shows a "Pending" badge until address/contact saved.

5. **Step 3 – Plan (image8-9):** Contact and Address sections both show "Saved!". Plan step: "Please Select a Plan." with a searchable grid of plan cards (e.g., New Plus Essential India/Pakistan/Philippines BIA Promotion, New Plus Extra Bangladesh/India/Pakistan/Philippines BIA Promotion, etc.). Agent selects **"New Plus Essential Pakistan BIA Promotion"**. A detail popup shows:
   - Bill Limit: 65 (with "Edit Bill Limit" button; info note "Default Bill Limit should be communicated to the customer")
   - Credit Limit: 50
   - Included components: New Postpaid+ Essential - BIA, QR 5 Discount for 6 Months - BIA, Mobile Voicemail, SIM Card, Activation Bar-Mobile Roaming, Bill Manager, DOB Eligible, Pakistan Minutes AddOn, "…" (more items truncated).
   - Continue / Cancel / Go Back buttons.

6. **Step 4 – Addon & Discount (image10):** "Select applicable add-on and discount based on customer's plan." Paid Add-ons: "Select Add-on" button (tooltip: "Go back to Plan step and edit limit to cover for the add-on amount."). Discount: "Select Discount" button, with "QR 5 Discount for 6 Months - BIA" pre-listed. Note: "if there are no applicable add-on or discount, the selector will be empty." Continue / Go back / Cancel. New accordion section "7. CAF & Additional Attachments" appears once earlier steps are saved.

7. **[Cross-check] Sales Order record mid-flow (image11):** A separate tab shows the underlying Siebel Sales Order 1-29811647643 for Account BIBIRUKKSANA GULAJAN: Order Type Activation, Status Pending, Created 3/16/2026 01:37:02 PM, Created By HALEEMI, Total QR25.00, MRC Total QR130.00, NRC Total QR25.00, Credit Limit 50, Price List VFQA PriceList, Currency QAR. (This confirms the order record is created as soon as the wizard reaches this stage.)

8. **Step 5 – Number Selection (image12):** "Select a Number to Reserve:" grid of Free Numbers with QR0.00 each: 79029813, 79029827, 79025482, 79029819, 79027988, 79027970, 79029815, 79029830, 79029826, 79029835. Agent selects 79029813 and clicks Reserve. Browser alert: **"SUCCESS:Reservation Token:15557466(SBL-EXL-00151)"** with OK button. (Reserved number later shown formatted as 97479029813.)

9. **Step 6 – SIM Serial (image13):** Sections 3 Plan ("New Plus Essential Pakistan BIA Promotion"), 4 Addon & Discount, 5 Number Selection (97479029813) all show "Saved!". Prompt: "Please enter or scan the SIM Serial number below." SIM Serial = **8942702800801190302**. Continue / Cancel / Go Back. Sections "7. CAF & Additional Attachments" and "8. Activity" now listed.

10. **Step 7 – CAF generation and review (image14, image16):** Clicking into "7. CAF & Additional Attachments" generates a bilingual (Arabic/English) **"Vodafone Customer Application Form" (استمارة عميل فودافون)** preview:
    - Date: 16-Mar-2026, Retailer ID: 1122334455.
    - **Section 1 – Applicant details:** Customer type Consumer; Name BIBIRUKKSANA GULAJAN; Date of birth 22-Jul-1986; Qatar ID Number 28658600923; Expiry date 16-Mar-2027; Nationality Pakistani; Email noemailid@vodafone.com; PO Box 1111; Alternative contact number LL:97412341234, MO:97412341234; Preferred language English; Address: "Zone test89, Street test89, Building No. test89, Apt/Flat/Unit test89".
    - **Section 2 – Billing information:** Account credit limit 50; Smart Limit 65; Bill date cycle 1; Bill format Detail; Bill language English; Bill delivery mode Email; Payment method Invoice. Credit card / bank fields blank (not applicable, invoice billing).
    - **Section 3 – For Postpaid Customers:** Mobile number / Primary mobile number 97479029813; Voice = Y; Postpaid Plan: New Postpaid+ Essential - BIA; Extras: Bill Limit Mobile Plus.
    - **Section 4 – Superfast Broadband & Home Phone:** blank/not applicable (mobile-only order).
    - Continue button present alongside the accordion.

11. **e-Signature capture (image15):** A "Please Sign" modal pad appears; a signature is drawn. Buttons: Clear Signature, Done. The signature and a system-generated timestamp "HALEEMI 03/16/2026 13:09:27" are then embedded into the CAF's Section 3 signature box.

12. **CAF attachment saved (image18):** Back in the wizard, "7. CAF & Additional Attachments" now shows a completed **CAF** document tile (green checkmark) and an "Add File" tile for optional extra attachments. Continue button.

13. **Step 8 – Activity / comments and submission (image19-21):**
    - "8. Activity" section: Comments field with info note: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history." Button: **Save And Finish**.
    - A "Comments" popup opens for free-text entry; agent types **"Test1234"**, clicks OK.
    - Final confirmation dialog: **"Your activation request order number: 1-29811647643 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."** Button: **Finish Process**. This is the defining characteristic of the HRN Customer/Credit Limit variant — the order is routed to manager approval rather than auto-completing.

14. **Agent-side order queue check (image22):** "My Sales Order" > "My Pending Approval Orders" view lists Order 1-29811647643, BIBIRUKKSANA GULAJAN, Approval Status "Submitted for Appro[val]", Mobile # 97479029813, Plan "New Plus Ess…", Created By HALEEMI, Status Pending, Guided Journey "New Postpaid", ID Type Qatari ID, ID Number 28658600923. Detail form confirms the same (Order #, First/Last Name, Mobile #, SIM #, Approval Status: Submitted for Approval, Status: Pending, Pending Reason blank, Rejection Reason blank).

15. **Manager login and Order Approval queue (image23-25):** A different user, "Test Manager" (login MANAGETEST), logs into a role-specific home page with menu Home, Order Approval, Manage Leads, Leads Queue.
    - **"TM SR Queue View"** lists approval queues (e.g., ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS). Under "Order Activities Queue" tab, order 1-DP13603 / order # 1-29811647643 for BIBIRUKKSANA GULAJAN shows Activity Status "Ready To Assign", Order Approval Status "Submitted for Approval". A tooltip shows the "Assign To Me" action.
    - After assignment, "My Activities" tab shows the same order with Activity Status "Assigned", Owner MANAGETEST, with a "ReAssign To Queue" option.

16. **Manager order review and approval (image26-28):**
    - Order Approval detail screen: Contact BIBIRUKKSANA GULAJAN, Contact Id 28658600923, Order # 1-29811647643, Order Expiry 19/03/2026 01:37:02 PM. Action buttons: **Approve, Reject - Correction, Reject - Drop Order, Go Back**.
    - Tabs: Attachments, Order Details, Activities, Agents Details.
    - **Attachments tab:** shows QatarIdFront, QatarIdBack, and CAF documents (all present, green icons).
    - **Order Details tab:** Order # 1-29811647643, Status Pending, Approval Status "Submitted for Approval", First Name BIBIRUKKSANA, Last Name GULAJAN, Account BIBIRUKKSANA GULAJAN, Journey Name New Postpaid, Mobile # 97479029813, SIM # 8942702800801190302, Plan Name "New Plus Essential Pakista[n]", Created Date 3/16/2026 01:37:02 PM, Created By HALEEMI.
    - Manager clicks **Approve**, opening an **"Approve Order"** dialog: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission." Comments field — manager types **"Approved"**. Same info note about comments being visible to other advisors. Submit / Cancel buttons.

17. **Post-approval order state (image29-30):**
    - Back on the agent's Account 360 > Orders tab, the order still displays Status "Pending" in this particular screenshot (likely captured before the status refreshed).
    - Opening the Sales Order record directly afterward shows **Status: Open** (updated from Pending), **Fulfillment Status: In Progress**, Last Modifying User: MANAGETEST, Status As Of: 3/16/2026 01:48 PM — confirming the manager's approval advanced the order out of the approval queue into fulfillment.

18. **Final completed state (image31-32):**
    - The Sales Order record now shows **Status: Complete**, **Fulfillment Status: Complete**, Status Context: "All order lines are completed", Status As Of: 3/16/2026 01:51:32 PM, Priority: Medium-Complete.
    - The **Line Items** tab (Totals sub-view) lists all 11 order lines, each with Status "Complete" and Fulfillment Status "Complete": New Plus Essential Pakistan BIA Promotion; Mobile Service Bundle, with sub-items New Postpaid+ Essential - BIA, Mobile Voicemail, SIM Card, Activation Bar-Mobile Roaming, Bill Manager, DOB Eligible, Pakistan Minutes AddOn, Bill Limit Mobile Plus. Status Context values read "FULFILL BILLING COMPLETE: reached" or "SMS NOTIFICATION COMPLETE: reached" for each line, confirming successful end-to-end fulfillment.

## Cross-references
- Other Guided Journey docs in the same "Postpaid" folder (e.g., other "Open UI Tablet_New Postpaid_…" variants without the HRN Customer/Credit Limit condition, and Prepaid-to-Postpaid conversion walkthroughs) likely share the same Contact → Address → Plan → Addon & Discount → Number Selection → SIM Serial → CAF → Activity wizard structure, differing primarily in whether an approval step is triggered.
- Matching row in CRM_Journeys_Final_Updated_with_Type.xlsx: look for the "New Postpaid" / "HRN Customer" / "Credit Limit" journey entry (not independently verified in this pass — no spreadsheet cross-check was performed as part of this extraction).

## Extraction notes
Confidence upgraded from low on 2026-08-21. Recovered by direct visual inspection of all 32 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 32 images were legible and informative; none were blank or ambiguous. One minor ordering note: image11 (mid-flow Sales Order record check) and image29 (post-approval Account Orders tab still showing "Pending") appear to be side-verification screenshots interleaved into the main wizard sequence rather than sequential wizard steps themselves — this is reflected in the narrative above. No content contradicts the "HRN Customer/Credit Limit" variant framing: the flow's distinguishing feature (order submitted for manager approval rather than auto-completing) is directly evidenced by the "submitted for approval" dialog and the separate Test Manager approval session.

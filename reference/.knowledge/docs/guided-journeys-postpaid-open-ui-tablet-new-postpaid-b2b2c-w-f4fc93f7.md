---
slug: guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Postpaid/Open UI Tablet_New Postpaid_B2B2C_Without Approval.docx
sha256: ad0c3ab69220ca960e82aa6027cf240641c178baa662afb9538d513920526e51
indexed: 2026-08-21
confidence: high
---

# Open UI Tablet — New Postpaid, B2B2C Segment, Without Approval: End-to-End Guided Journey Walkthrough

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots show system dates of 9/15/2025)

## Purpose
Documents, screen by screen, the tablet-based "Open UI" guided-journey flow a Vodafone Qatar front-line agent follows to activate a brand-new postpaid mobile line for a B2B2C (corporate-sponsored consumer) customer, ending with immediate order completion and no manager/approval gate.

## Key content

1. **Existing Contact lookup (image1).** CRM Contact screen for customer "YAM POKHAREL" (Nepalese, Qatari ID 27652419981, DOB 3/25/1976, Cellular Phone # 97412341234) is already on file, with an address (Zone 00, Street 000, Building No. 00, Apt/Flat/Unit 00, Qatar, test123, Doha, PO Box 1111). VFQ MOI Validation Status: Y.

2. **Existing Account (image2).** Account "YAM POKHAREL", Account # 129726571826, Account Class: Customer, Account Type: Residential, Customer Segment: Expatriate, Status: Active, Credit Risk: No score — this is the pre-journey baseline state (no B2B2C flag yet, no primary MSISDN yet).

3. **Logged-in agent (image3).** Employee record: Hemanth Kumar, Designation: Team Leader, User ID: HEMANTH, Company: Maveric, Team: Testing, Location: DOHA, Region: North, Territory: Al Jumailiya.

4. **Home dashboard (image4).** "Welcome back Hemanth Kumar! Today is Monday, September 15, 2025." Tile grid includes Mobile Postpaid (tooltip confirms this is the tile clicked), MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap, New FWA Tablet.

5. **Choose process (image5).** "Guided Process" screen: "Choose process" with two options — **New Postpaid** and **Prepaid to Postpaid**. Agent selects "New Postpaid".

6. **Step 1 — Contact: ID entry (image6).** Wizard breadcrumb shows the full step list: 1. Contact, 2. Address, 3. Plan, 4. Addon & Discount, 5. Number Selection, 6. SIM Serial (more revealed later). Prompt: "Please insert or scan the customer's Qatari ID:" Qatari ID field populated with 27652419981, confirmed by a green checkmark. Buttons: Go / Search again / Cancel.

7. **Step 1 — Connection Details modal (image7).** After Go, a "Connection Details" popup shows "Total Number of Prepaid Connections: 0" and "Total Number of Postpaid Connections: 0" with a "Show Postpaid Plan Details" link, confirming the customer has no existing lines. Background contact-confirmation form (Qatari ID, ID Expiry, Nationality, Gender, First/Last name, Birth date, Company Name, Lead/Opportunity ID, Digital Lead/Sale radio = No) with a "Continue" button.

8. **Step 1 — Company selection (image8).** "Company Name" dropdown opened, listing corporate accounts (01 vfqatest01, 01 newfreedcn01_Test, VFQA_Test_Mav NCM_CORE28, VFQA_Test_Mav_NCM_CORE29, etc.) — this is the B2B2C linkage step where the consumer is associated with a sponsoring corporate account. Additional required fields shown below: Email*, No Email checkbox, Language*, Alt. phone #*.

9. **Step 1 — Contact fields completed (image9).** Company "VFQA_Test_Mav_NCM_CORE29" selected. Digital Lead/Sale = No. "Enter ECR Details" = No, with an info banner: "To be filled by Fulfillment team only." Email = "noemailid@vodafone.com" with "No Email" checked; Language = English; Alt. phone # = 97412341234 — all validated with green checkmarks. Qatari ID-Front and Qatari ID-Back document thumbnails both show green checkmarks (already captured/verified). Continue / Search again buttons.

10. **Step 2 — Address (image10).** "2. Address" panel: Zone, Street No., Building No., Apt/Flat/Unit fields (blank in this shot) with Save Address / **Skip Address** / Go back / Cancel buttons. Step "3. Plan" shows a "Pending" flag in the collapsed accordion.

11. **Step 3 — Plan selection (image11).** Steps 1 (Contact: YAM POKHAREL 27652419981) and 2 (Address) both marked "Saved!". Step 3 "Plan" opens: "Please Select a Plan." with a search box and plan tiles — Postpaid Plus Max Promotion, Postpaid QA Black Plan Promotion, Postpaid Legacy Red 250 Promotion, Postpaid Red 350 Promotion, Postpaid U Plus Promotion, **Postpaid U Start Promotion** (selected, highlighted red), Postpaid Unlimited 300 Promotion, BIA Postpaid Unlimited Plus Promotion.

12. **Step 3 — Plan detail modal (image12).** "Postpaid U Start Promotion" detail: Bill Limit: 20 (Edit Bill Limit button; info banner "Default Bill Limit should be communicated to the customer"), Credit Limit: 1000 (Edit Credit Limit button). Included components: U Start, U Start 8G_150LMin, Mobile Voicemail, SIM Card, Bill Manager, DOB Eligible, Carry_forward_charges, Bill Limit Mobile. "Continue" confirms selection.

13. **Step 4 — Addon & Discount (image13).** "Select applicable benefits, add-ons and discounts based on customer's plan." U Plan Options: U Start 8G_150LMin (Change U Plan Benefits button). Paid Add-ons: Select Add-on (info banner: "Go back to Plan step and edit limit to cover for the add-on amount."). Discount: Select Discount. Buttons: Continue / Skip add-on & discount / Go back / Cancel. Note: "If there are no applicable Flex options, add-ons or discount, the selector will be empty." Agent skips/continues with no add-ons or discounts applied. Reveals step 7 "CAF & Additional Attachments" in the collapsed list.

14. **Step 5 — Number Selection (image14).** "Select a Number to Reserve:" with tabs Star Number / **Free Number** (active) / Reserved Number. Number 79027268 selected from a grid of QR0.00 free numbers. On reservation, a system alert fires verbatim: **"10.162.53.100:4443 says — SUCCESS:Reservation Token:13832431(SBL-EXL-00151)"** (OK button).

15. **Step 6 — SIM Serial (image15).** Steps 3, 4, 5 all show "Saved!" (Plan: Postpaid U Start Promotion; Number Selection: 97479027268). Step 6 prompt: "Please enter or scan the SIM Serial number below." SIM Serial = 8942702400000026741, validated. Continue / Cancel / Go Back. Reveals step 8 "Activity" below step 7.

16. **CAF preview, page 1 (image16).** Generated bilingual "Vodafone Customer Application Form" / "استمارة عميل فودافون": Date 15-Sep-2025, Retailer ID NA. Section 1 – Applicant details: Customer type Consumer; Name "YAM POKHAREL, VFQA_Test_Mav_NCM_CORE29" (customer name plus linked B2B2C company shown together); DOB 25-Mar-1976; Qatar ID 27652419981, expiry 15-Sep-2026; Nationality Nepalese; Email noemailid@vodafone.com; PO Box 1111; Alternative contact number LL:97412341234, MO:97412341234; Preferred language English; Address "Zone 00, Street 000, Building No. 00, Apt/Flat/Unit 00, Qatar, test123, Qatar". Section 2 – Billing information: Account credit limit 1000; Smart Limit 20; Bill date cycle 1; Bill format Detail; Bill language English; Bill delivery mode Email; Payment method Invoice; credit-card/bank fields left blank.

17. **Signature capture (image17).** "Please Sign" digital pad with a captured handwritten signature, "Clear Signature" / "Done" buttons.

18. **CAF preview, page 2 (image18).** Section 2 continues; declaration paragraph about card authorization. Section 3 – For Postpaid Customers: Mobile number 97479027268, Primary mobile number 97479027268, Voice=Y, Data=97479027268; Postpaid Plan "U Start" ("Minimum Subscription Period of 3 months applies"); Extras: Bill Limit Mobile. Signature block shows a signature with the caption **"HEMANTH 09/15/2025 11:50:06"** (the executing agent's sign-off/timestamp on the form) beneath the T&Cs acknowledgement paragraph ("I have read and understood Vodafone's [Post-paid] Terms and conditions..."). Section 4 – Superfast Broadband & Home Phone is entirely blank (not applicable — mobile-only order).

19. **CAF & Additional Attachments, error state (image19).** Steps 4, 5, 6 "Saved!". Step 7 "CAF & Additional Attachments": CAF tile shows green checkmark (generated/attached); "Proof of Employment" tile has a red required-asterisk and is not yet attached. Error banner: **"Error: Please select Proof of Employment before continuing."** — Proof of Employment is a hard-required attachment for this B2B2C flow.

20. **CAF & Additional Attachments, transitional (image20).** Same screen, error banner cleared; Proof of Employment still outstanding (grey/unchecked); Continue button present; step 8 "Activity" visible below.

21. **CAF & Additional Attachments, complete (image21).** Both "Proof of Employment" and "CAF" tiles now show green checkmarks — the required employment-proof file has been attached successfully.

22. **Activity step — comment entry (image22).** Steps 3–7 all "Saved!". Step 8 "Activity" opens a "Comments" modal; agent types **"B2B2C TEST123"**. Info text: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history." Final action button: "Save and Finish".

23. **Comment saved (image23).** Comments field now shows "B2B2C TEST123" persisted; "Save and Finish" ready to click.

24. **Order completion confirmation (image24).** System modal reads verbatim: **"Postpaid completed successfully. Order Number:- '1-29726606734'"** with a "Finish Process" button. The order completes in a single step immediately after "Save and Finish" — no intermediate approval/hold screen appears.

25. **Post-journey Contact record (image25).** Back on Contact "YAM POKHAREL": Employer field now populated "VFQA_Test_Ma..." (the B2B2C company link persisted onto the contact), Email noemailid@voda..., Preferred Language English, MOI Update Time refreshed to 9/15/2025 11:43:57.

26. **Sales Orders list (image26).** "My Sales Orders" grid shows the new order **1-29726606734** for YAM POKHAREL, Mobile 97479027268, SIM 89427024000…, Plan "Postpaid U St…", Guided Journey "New Postpaid", Created By HEMANTH, **Status: Open** in the grid. The order-detail panel below the grid shows **Approval Status: (blank)** and **Pending Reason: (blank)** — i.e., no approval workflow was triggered for this order.

27. **Post-journey Account record (image27).** Account "YAM POKHAREL" now shows **Special Management: "B2B2C Consum..."** (B2B2C Consumer), Pre-approved (Expatriate/Qatari): 1,000, Status Active, **Primary MSISDN: 97479027268** (now populated with the newly activated number), Credit Risk: No score. This is the concrete system evidence of the "B2B2C" segment tagging applied by the journey.

28. **Full Sales Order detail — "Without Approval" proof point (image28).** Order 1-29726606734 detail form: **Status: Complete**, **Fulfillment Status: Complete**, **Status Context: "All order lines are completed"**, **Approved checkbox: unchecked**, Approved By: blank, Hold: unchecked, Hold Reason: blank, Priority: Medium-Complete, Order Type: Activation, Billing Profile Type: Postpaid, Bill Cycle 1, Total QR25.00, MRC Total QR108.00, NRC Total QR25.00, Credit Limit 1,000, Created By HEMANTH, Fulfillment Mode: Deliver. Action buttons available: Revise, Validate, Select Favorites, Submit, MOI Validation, Generate Activity Plans, Cancel Order (Drop Order greyed out). **This screen is the direct evidence of "Without Approval": the order reaches Status=Complete / Fulfillment Status=Complete with the Approved flag left unchecked and no Hold — it was never routed to anyone for sign-off.**

29. **Account Attachments tab (image29).** Two files now attached to the account: "1-DNMGCO7_signed" (2,673,574 bytes, pdf, modified 9/15/2025 11:50:45 AM — the signed CAF) and "EmployerId_15092025_115308" (30,400 bytes, jpg, modified 11:53:28 AM — the Proof of Employment upload).

30. **Signed CAF, opened (image30).** Clean render of the finalized "Vodafone Customer Application Form" PDF (1-DNMGCO7_signed), matching the data captured in images 16/18 (Name "YAM POKHAREL, VFQA_Test_Mav_NCM_CORE29", Qatar ID 27652419981, etc.) — confirms the CAF was generated and stored correctly.

31. **Proof of Employment attachment, opened (image31).** "EmployerId_15092025_115308.jpg" opened in the Windows Photos viewer. The image is actually a full-desktop screenshot of an unrelated CRM screen (an Account/Orders view with a "Messages" Accept/Reject dialog) — i.e., in this walkthrough/test run the agent used an arbitrary screenshot as a placeholder file to satisfy the mandatory "Proof of Employment" upload requirement, rather than a real employment document. This, together with dummy values like "test123" in the address and "B2B2C TEST123" in the activity comment, indicates the walkthrough was captured as an internal QA/demo run rather than a live customer transaction.

**What "Without Approval" means, as observed:** For this B2B2C new-postpaid plan (Postpaid U Start Promotion, Credit Limit 1,000, Bill Limit 20 — within the pre-approved threshold shown on the account), the completed Sales Order (image28) shows Status = Complete and Fulfillment Status = Complete immediately after "Save and Finish," with the Approved / Approved By / Hold / Hold Reason / Pending Reason fields all left blank/unchecked throughout (images 26, 28). No supervisor-approval screen, queue, or pending state appears anywhere in the 31 screenshots — the order is created and completed in one continuous agent-driven session.

## Cross-references
- Same folder/family: other Postpaid Guided Journey docx files under "Guided Journeys/Postpaid/", including presumably "...With Approval" and non-B2B2C variants, and the "Prepaid to Postpaid" branch offered on the same Choose-process screen (image5).
- Likely corresponds to a "New Postpaid" / "B2B2C" row in CRM_Journeys_Final_Updated_with_Type.xlsx (not directly cross-checked in this pass).
- Related guided journeys visible on the same Home screen (image4): MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap, New FWA Tablet.

## Extraction notes
Confidence upgraded from low on 2026-08-21. Recovered by direct visual inspection of all 31 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 31 images were legible and informative; none were blank or ambiguous. The only interpretive note is that image31 (the "Proof of Employment" attachment) is evidently a placeholder/test screenshot rather than a real employment document, consistent with this being an internal QA/demo capture (test data such as "test123" and "B2B2C TEST123" appears throughout). This does not affect the reliability of the process-flow narrative, which is otherwise fully evidenced by system-generated screens (order numbers, statuses, timestamps).

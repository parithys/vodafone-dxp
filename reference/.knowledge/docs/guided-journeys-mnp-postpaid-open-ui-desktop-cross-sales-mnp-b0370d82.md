---
slug: guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/MNP Postpaid/Open UI Desktop_Cross Sales_MNP Postpaid.docx
sha256: 9a94b326dfe6f39980b170eda63016bb29b87dd7423982bcd78b5038d338795e
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop - Cross Sales - MNP Postpaid: Accepting a "New MNP" Cross-Sales Offer and Launching the MNP Postpaid Guided Journey

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename

## Purpose
Shows a Vodafone Open UI Desktop agent starting from an existing contact's Cross Sales Offers tab, accepting a "New MNP" cross-sales offer, and being carried into the MNP Postpaid guided-journey wizard (Contact -> Address -> Billing -> SIM Serial -> Plan -> Donor Details -> Donor Attachment -> CAF -> Activity) to process a Mobile Number Portability postpaid conversion for that contact.

## Key content
1. **Contact / Cross Sales Offers screen** (image1). Agent is viewing contact "VISHAKAN SOUNDARARAJAN" (Account: VISHAKAN SO...) under You are here: Cross Sales Offers. Contact detail panel shows: Last Name SOUNDARARAJAN, First Name VISHAKAN, ID Type Qatari ID, ID Number 29035654458, ID Expiration Date 5/11/2027, Nationality Indian, Date of Birth 7/3/1990, Gender M, Email c.vishakan@mav..., Preferred Language English, Contact Method Phone, Address Zone 10, Stre..., City Doha, County AR, Country Qatar, Cellular Phone # 97431345716, Work # 97431345716, PO Box 1111, Site 89427021116211, VFQ MOI Validation Status Y, MOI Update Time 5/11/2026 04:31:12. Top action buttons: Create A/c, Mobile Eligibility, MOI Validation, Update B2B2C Employer. Tabs shown: Accounts, Attachments, More Info, Audit Trail, Account Affiliations, Activities, Numbers, Loyalty Details, Delegate User Tracking, Campaign History, Cross Sales (active), Leads.
   - **Cross Sales Offers** grid (1-2 of 2) lists two offers:
     - OfferType "New MNP", OfferName "MNP New Pos...", MonthlyRental 145, OfferDescription "Switch to Postpai...", CampaignCode C000009053, PriorityCode 100.0, ServiceIdentifier 000004443, Status "Offered", TreatmentCode 262e3.115c.7..., Channel Inbound, PromotionId 1-79GOGG0, Price 0.
     - OfferType "New Postpaid", OfferName "New Postpaid ...", MonthlyRental 175, OfferDescription "Switch to the Pos...", CampaignCode C000009053, PriorityCode 100.0, ServiceIdentifier 000004450, Status "Offered", TreatmentCode 262e1.1163.ffff..., Channel Inbound, PromotionId 1-DN7HL4Z, Price 0.
   - **Cross Sales Offers Specification** grid (1-2 of 2): Parent Product 1-5X4V3JL / Product Type PlanDiscountId / Product Id 1-BIJLKKR; Parent Product 1-JZPR / Product Type addon1id / Product Id 1-3LTGW2D.
   - Action buttons above the offers grid: Accept, Interested, Reject, Close.
2. **Accept clicked on "New MNP" offer** (image2). Same screen; the "Accept" button is now shown selected/highlighted, indicating the agent has clicked Accept against the "New MNP" offer row to begin conversion.
3. **MNP Postpaid guided journey launches — Step 1. Contact, with Connection Details popup** (image3). Breadcrumb: "You are here: MNP Postpaid - Contact:". Section header "1. Contact" (red banner, expanded) instructs "Please confirm the contact details below:" with read-only fields Qatari ID 29035654458, Id expiry 5/11/2027, Nationality Indian, Gender M, First name VISHAKAN, Last name SOUNDARARAJAN, Birth date 7/3/1990, and a Digital Lead/Sale radio defaulted to "No". A modal dialog titled **"Connection Details"** appears on top, showing:
   - Total Number of Prepaid Connections: **1**
   - Total Number of Postpaid Connections: **1**
   - Button: "Show Postpaid Plan Details"
   - Modal actions: "Continue" (red) and "Cancel".
4. **Step 1. Contact — modal dismissed, fields validated** (image4). Same Contact step, Connection Details modal closed. Editable fields now shown filled and validated (green checkmarks): Email c.vishakan@maveric-system..., No Email unchecked, Preferred Language English, Alt. phone # 97431345716. Page-level buttons: Continue, Search again, and Cancel (top right). An Attachments panel with an Upload control appears below the Contact section.
5. **Step 2. Address expanded — empty address form** (image5). Breadcrumb: "You are here: MNP Postpaid - Address:". Section "2. Address" expanded with blank fields: Zone, Street No., Building No., Apt/Flat/Unit — none pre-filled. Buttons: "Save Address" (red, primary), "Skip Address", "Cancel", "Go Back". Below, the full remaining accordion of steps is visible in collapsed form: 3. Billing, 4. SIM Serial, 5. Plan, 6. Donor Details, 7. Donor Attachment, 8. CAF, 9. Activity — establishing the complete 9-step structure of the MNP Postpaid journey.
6. **Step 3. Billing: Postpaid expanded — existing billing profile shown** (image6). Breadcrumb: "You are here: MNP Postpaid - Billing:". Section "3. Billing: Postpaid" expanded with a billing profile grid (horizontally scrollable) showing one row: Status (green/active indicator bar), Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email, Comments (blank), Name 1-2KSRROSK, Email Bill To c.vishakan@m..., plus additional off-screen columns (Credit Card Exp, Expiration Month/Year, Credit Card Holder, Card Type, Credit Card Verification, Bank N...) left blank/not applicable for this invoice-based profile. Buttons: Continue (red), Cancel, Go Back.
7. **Steps 1-3 saved; Step 4. SIM Serial entered** (image7). Steps 1-3 now collapsed and each marked with a green "Saved!" badge: "1. Contact: VISHAKAN SOUNDARARAJAN, 29035654458  Saved!", "2. Address  Saved!", "3. Billing: 1-2KSRROSK  Saved!". Section "4. SIM Serial" expanded, instructing "Please enter or scan the SIM Serial number below." Field SIM Serial filled with value **8942702111346231021**, validated with a green checkmark. Buttons: Continue, Cancel, Go Back. Steps 5-9 remain collapsed below (Plan, Donor Details, Donor Attachment, CAF, Activity).
8. **Step 4 saved; Step 5. Plan loading** (image8). Step 4 now collapsed showing "4. SIM Serial: 8942702111346231021  Saved!". Step "5. Plan" expanded and a modal overlay reads **"Loading - Please wait"** (with spinner icon), indicating the system is fetching plan/promotion details. Continue/Cancel/Go Back buttons visible beneath the loading overlay.
9. **Step 5. Plan — promotion details modal** (image9, final screenshot). Steps 1-3 still shown collapsed/Saved in the background. A modal titled **"New Plus Extra Pakistan BIA Promotion"** displays (green checkmark icon top-right confirming selection):
   - Bill Limit: **150** (button: "Edit Bill Limit")
   - Credit Limit: **1000** (button: "Edit Credit Limit")
   - A bulleted component/entitlement list on the right: New Postpaid+ Extra - BIA, Mobile Voicemail, SIM Card, Activation Bar-Mobile Roaming, Bill Manager, DOB Eligible, Pakistan Minutes AddOn, Bill Limit Mobile Plus, and "…" (list truncated, more items not shown).
   - Buttons: Continue (red, primary), Cancel, Go Back.
   - The document's screenshots end here — steps 6 (Donor Details), 7 (Donor Attachment), 8 (CAF), and 9 (Activity) are visible only as unexpanded accordion headers in earlier screenshots and are never shown filled in or completed in this document. No final order/journey completion or submission confirmation screen is included.

## Cross-references
- Sibling documents in the same folder (`data/Guided Journeys/MNP Postpaid/`): "Open UI Desktop_MNP Postpaid.docx" (likely the non-cross-sales/direct MNP Postpaid entry path) and "Open UI Tablet_MNP Postpaid_HRN_Add-on.docx" (tablet variant with HRN Add-on). This document is specifically the Cross-Sales entry point into the same MNP Postpaid wizard (steps 1-9 structure appears consistent with a shared underlying journey).
- Matching row in CRM_Journeys_Final_Updated_with_Type.xlsx: not verified in this pass — a row for "MNP Postpaid" / "Cross Sales" under Open UI Desktop should be cross-checked there if present.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 9 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only 34 characters. All 9 images were clear, legible, and unambiguous (standard Siebel/Open UI desktop browser chrome, red Vodafone theme). No blank or corrupted images encountered. One gap: the journey's later steps (6. Donor Details, 7. Donor Attachment, 8. CAF, 9. Activity) and any final submission/order-confirmation screen are not captured by the 9 screenshots in this document — the walkthrough stops mid-flow at the Step 5 Plan/promotion confirmation modal.

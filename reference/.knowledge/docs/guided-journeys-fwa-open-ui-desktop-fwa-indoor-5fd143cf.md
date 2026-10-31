---
slug: guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/Open UI Desktop_FWA_Indoor.docx
sha256: eff983589d642970797ef67cbd05b1e69d55da429ca063b422f0b6f344fc7c7c
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop – New FWA (Indoor) Postpaid Activation, Guided-Wizard Walkthrough

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots show system dates of 9/18/2025 and 9/22/2025)

## Purpose
Shows a CRM agent ("KARTHIKK KARTHIKK") how to sell and activate a new **Fixed Wireless Access (FWA) Indoor** postpaid broadband/home-phone line for an existing Vodafone Qatar mobile customer, end-to-end, using the "New FWA" guided-wizard entry point in Vodafone Open UI Desktop — from customer lookup through CAF signature, order submission, and post-activation verification. This is the guided-wizard (accordion, numbered-step) variant, distinct from the "Desktop Vanilla" manual-form variant documented elsewhere in this folder.

## Key content
1. **Starting point / existing account.** The customer, YAM POKHAREL (Qatari ID 27652419981, Nepalese, DOB 3/25/1976), already has an active Account # 129726571826 with one existing service: Postpaid U Start / Mobile Service Bundle on primary MSISDN 97479027268, Billing Profile 1-DNMFLMV. Account Class: Customer, Type: Residential, Segment: Expatriate, Credit Risk: No score, Pre-approved (Expatriate/Qatari): 1,000.

2. **Home screen / entry point.** From the Open UI Desktop home page (agent "KARTHIKK KARTHIKK", "Today is Thursday, September 18, 2025"), the agent clicks the **New FWA** tile in the main menu grid (bottom-right of the icon grid, alongside New Fixed Line, RFS/Fiber Home Move, Order Approval, SIM Swap, FDO Requests, Agreements).

3. **Step 1 – Contact.** Wizard breadcrumb reads "FWA Postpaid - Contact:". Agent is prompted: "Please insert or scan the customer's Qatari Id:" and enters **Qatari ID 27652419981**, validated (green check), then clicks **Go**.
   - The form auto-populates from the ID: ID expiry 9/18/2026, Nationality Nepalese, Gender M, First name YAM, Last name POKHAREL, Birth date 3/25/1976.
   - A **"Connection Details"** popup appears automatically: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 1", with a **"Show Postpaid Plan Details"** link; clicking it reveals the existing plan name **"U Start"**.
   - Agent sets Digital Lead/Sale = **No**, Email = **noemailid@vodafone.com** (validated), Preferred Language = **English** (validated), Alt. phone # = **97412341234** (validated).
   - An informational banner appears: **"(HRN) Customer needs to pay advance payment of QR 100."**
   - An **Attachments** section requires an uploaded document (a file "Vishakan_QID_Front.JPG" is shown attached) via the **Upload** button.
   - Agent clicks **Continue**.

4. **Step 2 – Address.** Fields: Zone = **123**, Street No. = **123**, Building No. = **123**, Apt/Flat/Unit = **123P**, Area = **Al Rayyan** (dropdown). Agent clicks **Save Address**.

5. **Step 3 – Plan.** "Please Select a Plan." Plan tile grid offered: GigaHome 5G Classic New Indoor FWA Promotion, GigaHome 5G Premium New Indoor FWA Promotion, GigaHome Classic OD 5G New FWA Promotion, GigaHome New PYN 5G Indoor FWA Promotion, GigaHome New PYN 5G Outdoor FWA Promotion, GigaHome Premium OD New 5G FWA Promotion. Agent clicks **Add** on **"GigaHome 5G Classic New Indoor FWA Promotion"**.
   - Confirmation popup lists the bundled bill-of-materials: FMS CPE Indoor IDU, GigaHome 5G Classic New Indoor -FWA, 100% Discount for 2 Months -FWA, FMS SIM, FMS VoIP Service, Activation Bar- Mobile Roaming -FWA, System Bar Admin -FWA, and additional items ("…"). Agent clicks **Continue**.

6. **Step 4 – Addon & Discount.** Steps 2 and 3 now show "Saved!". Text: "Select applicable add-on and discount based on customer's plan" with **Select Add-on** / **Select Discount** buttons. The plan's included discount is pre-listed: **"100% Discount for 2 Months -FWA"**. Note shown: "if there are no applicable add-on or discount, the selector will be empty." Agent clicks **Continue** (no add-on selected in this run).

7. **Step 5 – Number Selection.** On the Contact record's Numbers tab / "Number Blocking for User Group" sub-tab, a FixedLine number **97441202302** (Category FREE, Segment CONSUMER, Status BLOCKED, Reserved By SYSTEM) is reserved via **Block+Reserve**. A browser alert confirms: **"SUCCESS:Reservation Token:13907377(SBL-EXL-00151)"**. Back in the wizard's "5. Number Selection" step, the reserved number appears as tile **41202302 (QR0.00)** under the "Reserved Number" toggle; agent selects it and clicks **Continue**.

8. **Step 6 – SIM Serial.** Step 5 shows "Saved!" with the number "97441202302" in its header. "Please enter or scan the SIM Serial number below." SIM Serial = **8942702800801190302** (validated), CPE Serial Number = **S180P18055027** (validated). Agent clicks **Continue**.

9. **Step 7 – Book Appointment.** Steps 6 and 7 both show "Saved!" (no separate detail screen for booking captured in this walkthrough — in the final signed CAF, the appointment section reads "Appointment ID: Appointment Date: -", indicating no installation appointment was actually scheduled in this run).

10. **Step 8 – CAF.** An Attachments sub-section (initially "No Records") plus a **CAF** dropdown button offering three form types: **CAF-Digital, CAF-Manual, CAF-Touch Screen**.
    - Selecting a CAF option generates a bilingual (English/Arabic) **"Vodafone Customer Application Form"** PDF, Retailer ID 112233. Key fields confirmed on the form:
      - Section 1 – Applicant details: Customer type Consumer, Name YAM POKHAREL, DOB 25-Mar-1976, Qatar ID 27652419981, Nationality Nepalese, Email noemailid@vodafone.com, PO Box 1111, Alternative contact number LL:97412341234 / MO:97412341234, Preferred language English, Address populated from the wizard entry.
      - Section 2 – Billing information: Account credit limit 1000, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice.
      - Section 3 – For Postpaid Customers (existing mobile line): Primary mobile number 97479027268.
      - Section 4 – Superfast Broadband & Home Phone (new FWA line): Landline Number **97441202302**, Plan Name (Minimum Subscription Period of 3 months applies): **GigaHome 5G Classic New Indoor -FWA**, Appointment Details left blank ("Appointment ID: Appointment Date: -").
      - Followed by full bilingual Vodafone Qatar General Terms and Conditions text.
      - Form action buttons: **Sign Contract** / **Close and Retry**.
    - Clicking Sign Contract opens a **"Please Sign"** canvas; agent draws a signature and clicks **Done**.
    - Form redisplays with signature captured; a browser alert states: **"Notify customer that a copy of the CAF will be sent to his registered email address."** (OK button).
    - The signed CAF is saved as an attachment on the order line, e.g. **"1-DNMGCO7_signed.pdf"** (existing attachment list already had 18+ items). Agent clicks **Continue**.
    - Wizard buttons available at this stage: Continue, CAF, **Abandon Order**, Go Back.

11. **Order submission.** A popup instructs: **"Advise customer to send switch to 151"** (OK button). Page then shows **"Submitting Order. Please wait..."**.

12. **Resulting Sales Order.** Order # **1-29729896060**, Account YAM POKHAREL, Order Type **Activation**, Status: **Complete**, Fulfillment Status: **Complete**, Status Context: "All order lines are completed", Priority: Medium-Complete, Created 9/22/2025 02:15:50 PM by user **KARTHIKK**, Billing Profile Type Postpaid, Service Type Fixed Line, Source CRM, Credit Limit 1,000.
    - Line Items tab (9 of 9, all Status/Fulfillment Status = Complete):
      1. GigaHome 5G Classic New Indoor FWA Promotion
      2. FMS CPE Bundle → 2.1 FMS CPE Indoor IDU (Service Id 129729896313)
      3. FMS Service Bundle → 3.1 GigaHome 5G Classic New Indoor -FWA, 3.2 FMS SIM (Service Id 8942702800801190302), 3.3 FMS VoIP Service, 3.4 Activation Bar- Mobile Roaming -FWA, 3.5 System Bar Admin -FWA (Service Id 97441202302 on the FMS Service Bundle branch, Billing Profile 1-DNMFLMV throughout).

13. **Post-activation verification.**
    - Account → Attachments tab shows the signed CAF stored against the account: **"Digital_MNP_Post-paid_CAF_922202514161...pdf"** (2,673,666 bytes, PDF, modified 9/22/2025 02:17:08 PM). Opening it shows the finalized bilingual CAF with Date 22-Sep-2025, address **"Zone 11, Street 12, Building No. 13, Apt/Flat/Unit 14H, Qatar"** (the actual installation address used, differing from earlier "Zone 123" test values seen mid-flow — likely a re-run with corrected address), and the Section 3 signature block stamped with the agent's electronic signature: **"KARTHIKK 22:09:2025 14:16:39"**. Section 4 landline number 97441202302, Plan Name GigaHome 5G Classic New Indoor -FWA, Appointment Details still blank.
    - Account → Installed Assets ("Products and Services") confirms all new FWA components are **Active** as of 9/22/2025: FMS Service Bundle, Activation Bar- Mobile Roaming -FWA, GigaHome 5G Classic New Indoor -FWA (Per Month), 100% Discount for 2 Months -FWA, FMS VoIP Service, System Bar Admin -FWA — all under Service ID 97441202302.
    - Customer Portal / Billing Profile / Unbilled Usage screen: MSISDN list shows three numbers on the account (97441202300, **97441202302** — the new FWA line, and 97479027268 — existing mobile). For the new line: TotalBalance 0, SIMState **ACTIVE**, Currency QAR. Surepay Bucket Details confirm data provisioning: "GigaHome Classic 375 -5G: Your account has 322122752 Kbytes Local Data, expiring on 2025-09-30" (Bucket Id XP2, Active) and a matching "GigaHome Classic 375 -5G Throttling Bucket" with 322122548 Kbytes (Bucket Id DC2, Active).

## Cross-references
- Companion document in the same folder family: the "Desktop Vanilla" manual-form variant of the FWA Indoor journey (non-guided-wizard UI), referenced by the task background as a distinct document.
- Should correspond to an FWA/GigaHome Indoor activation row in `CRM_Journeys_Final_Updated_with_Type.xlsx` (User Journey master list) — not independently verified in this pass since only the .docx was inspected.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 27 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 27 images were legible and informative; no blank or unreadable images encountered. One minor inconsistency worth flagging: the address values shown mid-flow in the wizard/CAF (Zone 123/Street 123/Building 123, image 15–18) differ from the address on the final signed CAF attachment retrieved from the account (Zone 11/Street 12/Building 13/Unit 14H, image 24–25) — this suggests either a re-run/retry during the walkthrough capture or that the screenshots interleave two similar demo passes; the order and account outcomes (order # 1-29729896060, number 97441202302, plan GigaHome 5G Classic New Indoor -FWA) are consistent throughout and the account/asset/billing-portal screens at the end (images 21–27) all reflect the same final, successfully activated state. No installation appointment date/ID was ever populated (Step 7 shows "Saved!" but the CAF's Appointment Details field stayed blank throughout).

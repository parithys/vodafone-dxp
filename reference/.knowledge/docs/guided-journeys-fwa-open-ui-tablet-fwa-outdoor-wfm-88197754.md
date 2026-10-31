---
slug: guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/Open UI Tablet_FWA_Outdoor_WFM.docx
sha256: fe94a8f94f3373204d942ad534053b1ffb0e4ec57694047ef33c9fa4e32d0b86
indexed: 2026-08-21
confidence: high
---

# FWA Tablet - 5G Outdoor - WFM - E2E Order Complete (New FWA Tablet, Outdoor plan, through Field Service installation)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots show system dates of September 9-10, 2025)

## Purpose
An end-to-end click-through of a Fixed Wireless Access (FWA) 5G **Outdoor** order on the Vodafone Qatar CRM Tablet UI, from agent login through order creation, CAF (Customer Application Form) signing, the Workforce Management (WFM/OFSC-based field service app) installation activity performed by a technician, service activation, and back to the CRM order/account showing "Complete" status with billing/attachments visible. The single caption text embedded in the document is: "FWA Tablet – 5G Outdoor – WFM – E2E Order Complete."

## Key content

1. **Agent login / Employee record (image1):** CRM "Employees" screen shows agent Hemanth Kumar, User ID `HEMANTH`, Designation "Team Leader," Responsibility "VFQA Mass Market Agent," Position "F/O CC Champion," Organization "Default Organi...," Location "DOHA," Team "Testing," Company "Maveric."

2. **Home screen (image2):** "Welcome back Hemanth Kumar! Today is Tuesday, September 09, 2025." Menu icons include Home, Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, SIM Swap, and **New FWA Tablet** (the entry point for this journey).

3. **FWA Contact - Step 1 (image3):** Selecting "New FWA Tablet" opens a wizard with accordion steps: 1. Contact, 2. Address, 3. Plan, 4. Addon & Discount, 5. Number Selection, 6. SIM Serial. Step 1 prompts "Please insert or scan the customer's Qatari ID," with field "Qatari ID." Buttons: Go, Search again (disabled), Cancel.

4. **Qatari ID entry (image3-4):** Qatari ID `28035644882` entered and validated (green check). Clicking Go/Continue surfaces a "Connection Details" popup showing "Total Number of Prepaid Connections: 0" and "Total Number of Postpaid Connections: 0" with a disabled "Show Postpaid Plan Details" button, plus Continue/Cancel.

5. **Contact confirmation (image4-5):** Contact details auto-populated from ID: ID Expiry `9/9/2026`, Nationality `Indian`, Gender `M`, First name `NARAYAN`, Last name `MANJHI`, Birth date `12/1/1980`, Company Name (blank), Lead/Opportunity ID (blank), Digital Lead/Sale: **No**. "Enter ECR Details": **No**, with info banner "To be filled by Fulfillment team only." Email defaulted to `noemailid@vodafone.com` with "No Email" checkbox checked. Language: `English`. Alt. phone #: `97412341234`. Qatari ID-Front and Qatari ID-Back image upload placeholders both show green checkmarks (already attached). Continue / Search again / Cancel buttons.

6. **Address step - validation error (image6):** Step "2. Address" fields: Zone, Street No., Building No., Apt/Flat/Unit, Area — all initially blank. Clicking Save Address without data triggers a validation dialog: **"Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit.,Area"** with an OK button.

7. **Address step - completed (image7):** Address filled: Zone `45`, Street No. `56`, Building No. `67`, Apt/Flat/Unit `78B`, Area `Al Rayyan`. "Save Address" clicked.

8. **Plan selection (image8):** Step "3. Plan" shows "Please Select a Plan." with a search box and plan cards: GigaHome 5G Classic New Indoor FWA Promotion, GigaHome 5G Premium New Indoor FWA Promotion, GigaHome Classic OD 5G New FWA Promotion, GigaHome New PYN 5G Indoor FWA Promotion, GigaHome New PYN 5G Outdoor FWA Promotion, and **GigaHome Premium OD New 5G FWA Promotion** (highlighted/selected — "OD" = Outdoor, confirming this is the Outdoor variant of the journey).

9. **Plan detail confirmation (image9):** "GigaHome Premium OD New 5G FWA Promotion" selected, showing included components: FMS CPE ODU, FMS CPE Outdoor IDU, GigaHome Premium OD New 5G -FWA, **100% Discount for 2 Months -FWA**, FMS SIM, FMS VoIP Service, Activation Bar- Mobile Roaming -FWA, and more (truncated list, "..."). Continue button confirms plan.

10. **Addon & Discount step (image10):** Step "4. Addon & Discount" — "Select applicable add-on and discount based on customer's plan." Buttons "Select Add-on" and "Select Discount." Discount auto-applied: "100% Discount for 2 Months -FWA." Info note: "Note: if there are no applicable add-on or discount, the selector will be empty." Continue clicked.

11. **Number Selection (image11):** Step "5. Number Selection" — "Select a Number to Reserve:" toggle between Free Number / Reserved Number tabs. One number card shown: **41202323**, price QR0.00, selected (highlighted border). Continue.

12. **SIM Serial step (image12):** Progress recap shows steps 3-5 all "Saved!" (Plan: GigaHome Premium OD New 5G FWA Promotion; Addon & Discount; Number Selection: 97441202323). Step "6. SIM Serial" is empty of visible input fields in this screenshot (just Continue/Cancel/Go Back) — likely a scanner/barcode field that wasn't populated to fill the screen, or is captured via a barcode icon not visible in this crop.

13. **Book Appointment step (image13):** All prior steps (3-6) show "Saved!". Step "7. Book Appointment" expands with two options: **"Book Appointment"** and **"Book Unscheduled Appointment."**

14. **Scheduled appointment calendar (image14):** "Book Appointment" modal shows a September 2025 calendar with the 11th selected (blue highlight), a "Booking Comments" textbox, and time-slot pills: **8AM - 11AM** (selected/highlighted red), 11AM - 2PM, 2PM - 5PM, 5PM - 8PM. Buttons: Close, Refresh, Submit.

15. **Unscheduled appointment warning (image15):** Choosing "Book Unscheduled Appointment" triggers a browser-style confirm dialog from `10.162.53.100:4443`: **"WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue."** with OK / Cancel.

16. **Unscheduled appointment comments (image16):** "Book Unscheduled Appointment" modal with a "Booking Comments" textbox and Submit button (this appears to be an alternate path shown for reference; the main journey proceeds with the scheduled appointment).

17. **Appointment booked confirmation (image17):** Success dialog from `10.162.53.100:4443`: **"Appointment has been successfully booked.Appointment details will be sent to the customer via SMS. Appointment ID is 120885"** with OK button.

18. **Appointment details saved (image18):** Step 7 "Book Appointment" expands showing a details table: Appointment Number `1-29724276359`, Technician ID `ABATS_Consumer_Installation`, Status `pending`, Appointment Date `09/12/2025`, Channel `SIEBEL`, Type (blank), Appointment ID `120885`, Time Slot `8AM - 11AM`.

19. **CAF preview - page 1 (image19):** A "Vodafone Customer Application Form" (استمارة عميل فودافون) preview modal opens showing: Date `10-Sep-2025`, Retailer ID `NA`. Section 1 – Applicant details: Customer type `Consumer`, Name `NARAYAN MANJHI`, DOB `1-Dec-1980`, Qatari ID `28035644882`, Expiry `10-Sep-2026`, Nationality `Indian`, Email `noemailid@vodafone.com`, PO Box `1111`, Alternative contact number `LL:97412341234, MO:97412341234`, Preferred language `English`, Address `Zone 45, Street 56, Building No. 67, Apt/Flat/Unit 78B, Qatar`. Section 2 – Billing information: Account credit limit `1000`, Bill date cycle `15`, Bill format `Detail`, Bill language `English`, Bill delivery mode `Email`, Payment method `Invoice`.

20. **CAF preview - page 2 (image20):** Section 3 – For Postpaid Customers: Mobile number `97441202323`. Section 4 – Superfast Broadband & Home Phone: Landline Number `97441202323`, Plan Name `GigaHome Premium OD New 5G -FWA`, Appointment Details `Appointment ID:120885 Appointment Date: 12-Sep-202508:00`. Followed by full Vodafone Qatar General Terms and Conditions text (bilingual English/Arabic).

21. **Signature capture (image21):** "Please Sign" modal — a handwritten signature is captured on a blank signature pad with "Clear Signature" and "Done" buttons.

22. **CAF with signature applied (image22):** Same CAF page 2 now shows the signature image inserted under Section 4's Signature field, timestamped **"HEMANTH 09/10/2025 11:58:52."** Page footer buttons: Abandon Order, Go Back, and (Pending status indicator visible bottom-right).

23. **CAF & Additional Attachments step (image23):** Steps 5-7 show "Saved!". Step "8. CAF & Additional Attachments" expands with three tiles: **CAF** (green check, required *), **Supplementary Form** (green check, required *), and "Add File" (empty, plus icon). Continue / Abandon Order / Go Back.

24. **Full journey progress view (image24):** A scroll-through of the accordion shows steps 2 (Address), 3 (Plan: GigaHome Premium OD New 5G FWA Promotion), 4 (Addon & Discount), 5 (Number Selection: 97441202323), 6 (SIM Serial), 7 (Book Appointment) all "Saved!", and step 8 (CAF & Additional Attachments) expanded, with step 9 (Activity) showing a "Pending" indicator beneath — confirming the order has moved into fulfillment/activity tracking.

25. **CRM Sales Order record (image25):** After order submission, the CRM "Sales Order" screen for Order # `1-29724275746` (Revision 1, Type Sales Order) is shown: Account `NARAYAN MANJ...`, Primary MSISDN `97441202323`, Order Type `Activation`, Order Sub Type `Dual Play`, Status `Open`, Created `9/10/2025 11:56:00 AM`, Created By `HEMANTH`, Fulfillment Status `In Progress`, Priority `Medium-Open`, Credit Limit `1,000`. Buttons: Revise, Validate, Select Favorites, Drop Order (disabled), Submit, MOI Validation, Generate Activity Plans, Cancel Order. A contact lookup card confirms Qatari ID `28035644882`, NARAYAN MANJHI, DOB 12/01/1980.

26. **Line Items with appointment (image26):** Order's Line Items tab (sub-tabs: More Info, Catalog, Numbers, Notes, Line Items, Payments, Shipping, Trouble Tickets, Summary, Approvals, Attachments, Shipments, Activities, Documents, Fulfillment, Line Item Detail, Work Orders, Proposals, Transactions) shows 3 line items: (1) GigaHome Premium OD New 5G FWA Promotion — Status Context "FULFILL BILLING COMPLETE: reached," (2) FMS CPE Bundle — Service Id `129724275871`, Status Context "INITIATE BILLING COMPLETE: reached," (3) FMS Service Bundle — Service Id `97441202323`, Appointment ID `120885` (linked), Status Context "INITIATE BILLING COMPLETE: reached." Toolbar buttons: Auto-Asset, MultiAdd, CAF, Profile, Book Appointment, Book Unscheduled Appointment.

27. **WFM back-office inventory spreadsheet (image27-28):** A separate Excel workbook "VFQ Inventory Loading - Master 06-11-2023_V2_Latest" is shown with an "Import" button and a table of Inventory Type / Part Number / Part Name / Model Number / Part Description / Serial No / Cost / Quantity / Current Available Quantity rows: `5G_INDOOR_CPE_SERIAL_NUMBER` (Model Huawei_B2368-71, Serial `2EQTE24314000125`), `5G_OUTDOOR_CPE_SERIAL_NUMBER` (Model Huawei_B2368-79, Serial `S180P18075125`), `SIM` (Serial `894270280080119032` / `894270280080801190323`). A "Field Service Import" pop-up "Resource Inventory Import" panel shows Instance Name `vfq2.test`, User Name `vfq_application_profile`, Password (masked), Resource Id `ABATS`. Import Status: Get Quantity **Success**, Import Status **Success**, Created: 3, Updated: 0, Deleted: 0, Item failed: 0. Buttons: Get Quantity, Import.

28. **WFM technician Activity details - Admin view (image29):** The Oracle Field Service (OFSC)-based WFM app "Activity details" screen for "Consumer Installation, 09/12/25" shows tabs Map, Assess Activity, Upload Document, Re-Address/Re-Schedule, Inventory. Banner: "You Need to Complete 'Assess Activity', 'Checklist' & 'Mandatory Fields' marked with * to 'End' the Activity." Fields include Resource ID `4`, Start `12:00 AM`, End `02:00 AM`, Duration 2h, EDR Status Code/Message, Service Window `08:00 AM - 11:00 AM`, Language `EN`, Environment `tcqa-6axapig01`, MSISDN `97441202323`, Order Rescheduling Reason, Building Type (required), Telephone Number `97441202323`, Correlation Id `TCCID:105932:2512:1757494796548:443`, Service ID `97441202323`.

29. **Move/reschedule activity (image30):** A "Move 8AM - 11AM - Installation - 120885 - 1-29724275746" scheduling modal shows technician "Syed Irfan" (ABATS, +2:00) with a "Work zones mismatch" warning, timeline view for Wednesday, September 10th, 2025, with Move/Dismiss buttons — indicating the appointment activity was reassigned/moved to technician Syed Irfan.

30. **Inventory transfer - CPE Indoor (image31):** "Inventory Management" > "Non-Serialized Inventory Transfer" tab: "Transfer Non-Serialized Inventory," Transferring From: ABATS, Search Resource `Syed Irfan`, Search Part `Test(2EQTE24314000125) - Test (1)`, Quantity `1`. "Add To Transfer List" button.

31. **Inventory transfer - CPE Outdoor (image32):** Same screen, Search Part `Test(S180P18075125) - Test (1)`, Quantity `1`.

32. **Inventory transfer - SIM (image33):** Same screen, Search Part `Test(894270280080119032/894270280080801190323) - Test (1)`, Quantity `1`.

33. **Transfer List (image34):** "Transfer List" tab, Total Items: 3, table listing all three parts (Test/2EQTE24314000125/Huawei_B2368-71, Test/S180P18075125/Huawei_B2368-79, Test/894270280080801190323/Tesr) — Current Owner `ABATS`, Transfer To `Syed Irfan`, each row deletable. Buttons: Export - Inventory Transfer Report, Start Transfer.

34. **Transfer completion (image35):** Dialog from `plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com`: **"Inventory transfer has been completed. Closing the plugin screen..."** with OK — confirming inventory (CPEs + SIM) has been formally transferred from the ABATS warehouse/bucket to technician Syed Irfan ahead of installation.

35. **Technician "My Route" home (image36):** WFM mobile app home for Syed Irfan, Wednesday 10 September 2025. Shows "Activate by 08:00 AM" / "Activate Route" button, one activity card "8AM - 11AM Installation 120885 1-29724275746" (phone `97412341234`), route progress ring "17%, 1 Pending," and tiles: Activities (93), Inventory, Add Activity.

36. **Route activated, Start button (image37):** Same layout after route activation — activity card now shows a "Start" button instead of the activate prompt.

37. **Start activity - geolocation (image38):** "Start activity" screen: Activity Type `Installation`, Name `NARAYAN MANJHI`, "Technician GPS Location" with "Get geolocation" button and an embedded Google Map pinned near "Lusail Marina Park" / "315 Street." Dismiss / Submit buttons.

38. **Activity details after start (image39):** "Activity details" for Syed Irfan, 09/10/25, timer showing 2:00 remaining. Activity ID `120885`, Activity Type `Installation`, Start `12:19`, End `14:19`, Booking Channel `Siebel`, Activity Status `started`, Time Slot `8AM - 11AM`, Order Type `Dual Play`, Company Name `NARAYAN MANJHI`, Order Creation Date `09/10/2025 11:56:00`, Account Number `126954099840`. Right column: Telephone Number `97441202323`, Correlation Id `TCCID:105932:2512:1757494796548:443`, Service ID `97441202323`, Device Details "Add STB Count: 0," STB Details, OSN STB Details "OSN_STB_COUNT: 0" with an "Additional_Android_OSN_STB_Details" button, Replacement Details "Replacement Needed?" checkbox (unchecked).

39. **Kahramaa (utility) check dialog (image40):** A plugin dialog from `plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com` displays during "Assess Activity": **"No previous records are found based on Kahrama ID in last 30 days."** with OK — confirms the technician app cross-checks the customer's Kahramaa (utility) ID for duplicate/recent installation records before proceeding.

40. **Activity list (My Route) (image41):** "Activity list" for 10 Sep, showing "Started" section with the installation (120885, order 1-29724275746) and a "Non-scheduled (93)" section listing other unrelated activities (108981, 109542, 110094 audit, 110659, etc.) — confirming this technician's broader workload/queue.

41. **"..." menu options on Activity details (image42):** The overflow menu ("...") on Activity details reveals: **Serial Number Check - Dual Play**, Serial Number Check - Triple Play, Installation Checklist, Cost & Additional Purchase, Suspend, Not Done, History. "Serial Number Check - Dual Play" is selected (this order is Dual Play type despite being an Outdoor FWA plan, per earlier Order Sub Type field).

42. **Serial Number Check - Dual Play form (image43):** Fields: **CPE Indoor** `2EQTE24314000125` (green check), **CPE Outdoor** `S180P18075125` (green check), **SIM Card** `894270280080801190323` (green check), each with a barcode-scan icon. "Submit" clicked; status text "Sending activation request."

43. **Service activation submitted (image44):** Confirmation dialog from `plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com`: **"Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status."** with OK.

44. **Activity details - activation success (image45):** Right-hand panel now shows "Service Activation Details" with a thumbs-up emoji, **Service Activation Status: Success**, and instruction "Please perform '🟩 Install Inventory (SNC)'." Also visible: 5G Indoor CPE Serial Number `2EQTE24314000125`, Customer Location Details Work Area `Al_Rayyan`, Customer Contact phone `97412341234`, email `noemailid@vodafone.com`, Service Details Plan Name `GigaHome Premium OD New 5G -FWA`, Siebel Order Number reference `1-29724275746`, Repeat Activity `No`, and a "Customer Signature" capture box with Dismiss/Submit.

45. **"Install Inventory (SNC)" step in overflow menu (image46):** The "..." menu now shows a green square marker next to **"Install Inventory (SNC)"** (below "Serial Number Check - Dual Play"), plus Installation Checklist, Cost & Additional Purchase, Suspend, Not Done, History — confirming the sequential requirement flagged in the prior dialog. Correlation Id now shows `WFMInstallSITask-105932`. 5G Details section begins with SIM Serial Number field visible.

46. **Installation Checklist - top (image47):** "Installation Checklist" form ("Forms Submitted" status shown top-right): "Speed test results on Wi-Fi and LAN": `Test`; "Wi-Fi User name's for 2.5G and 5G network (NO password)": `Vishak`; "Timestamp of calls made to installation desk from Landline": `10-09-2025 12:26:25`; checkbox "WiFi Coverage Tested" (checked); "Confirm WiFi Coverage status with customer and recommend...": `Yes`. Attachments list (each with a JPG file, ~80-132KB): Screenshot of Wi-Fi interference (`vpn.JPG`), Speed observed on customer phone (`W3 Timesheet.JPG`), Screenshot of CPE firmware installed, Screen Shot of IP Received for VLAN 50, Screen Shot of IP Received for VLAN 60, Screenshot for VOIP configuration from CPE (all attached as placeholder `W3 Timesheet.JPG` files, indicating this is a demo/test walkthrough rather than production data).

47. **Installation Checklist - bottom + signature (image48):** Continues attachments: Pictures of installation set-up. Fields: Optical Power Meter Reading `1`, Splitter Free Port Details `1`. Checkboxes (all checked): "Brief customer on package details," "Wi-Fi frequency to be connected should always be 5G unless its not supported...," "How to restart CPE (and STB) in case of technical issue," "Download my Vodafone app on customer phone. Explain how to pay bills," "Explain how to configure mesh." A handwritten "Customer Signature" is captured. Dismiss/Submit.

48. **Activity details - ready to End (image49):** Activity 120885 shows timer 1:55 remaining and an **"End"** button now available in the top toolbar (alongside Inventory, Map, Adjust Time, Assess Activity, "..."), confirming the mandatory sub-tasks (Assess Activity, Checklist, Device Activation) are complete.

49. **End Activity form (image50):** "End activity" screen: Activity Type `Installation`, Name `NARAYAN MANJHI`, "Activity Remarks" (free text, blank), "Customer Available" dropdown, "Customer Signature" capture box (blank placeholder), "Next Activity" set to `I will be idle for a while`. Dismiss/Submit buttons — this is the final technician-side step closing out the field visit.

50. **CRM order after completion (image51):** Back in CRM, Order `1-29724275746` now shows **Status: Complete**, **Fulfillment Status: Complete**, Status Context: **"All order lines are completed,"** Priority `Medium-Complete`. Created By `HEMANTH`, Order Date `9/10/2025 11:56:00 AM`, Status As Of `9/10/2025 12:26:46 PM`.

51. **Line Items reflecting completion (image52):** Line Items / Attributes tabs show the same 3 line items (GigaHome Premium OD New 5G FWA Promotion, FMS CPE Bundle, FMS Service Bundle with Appointment ID `120885` linked). Line Item Attributes table shows fields like Collection Sys.../FNP System.../Number Actual.../Number Purch.../Number Rese... `13832378`/Number Type `FREE`.

52. **Account Summary - Installed Assets & Orders (image53):** Customer Portal for account NARAYAN MANJHI shows "Installed Assets" (all Active): FMS CPE Bundle, FMS CPE Outdoor IDU, FMS CPE ODU, GigaHome Premium OD New 5G FWA Promotion, FMS Service Bundle, FMS SIM, Activation Bar- Mobile Roaming -FWA, GigaHome Premium OD New 5G -FWA, FMS VoIP Service, System Bar Admin -FWA — all under Billing Profile `1-CDRRZDR`. "Orders" panel shows this order `1-29724275746` as **Complete** (Dual Play, Activation) alongside several prior **Abandoned** orders for the same account (`1-29724256936`, `1-29724251361`, `1-29724236928`, `1-29723823496`), indicating multiple prior attempts before this successful completion. Billing Profile row: Postpaid, ENG, status bar (green/active), Payment Method `Invoice`, Email Bill To `noemailid@vodafone.com`.

53. **Billing Profile / Balance Summary (image54):** Billing Profile `1-CDRRZDR` for account NARAYAN MA[NJHI]: Bill Type `Detail`, Bill Media `Email`, Payment Method `Invoice`, Billing Profile Status `Active`. Balance Summary: Balance `QR2,331.61`, Due Now `QR2,331.61`, Total `QR2,331.61` (likely includes unrelated prior charges/other lines on the account, since the FWA plan itself carries a 100% 2-month discount).

54. **Surepay Bucket Details (image55):** Under Bucket View for MSISDN `97441202323`: SIMState `ACTIVE`, Language `EN`. Two active data buckets: "Endless Data@1M: Your account has 1073741824 Kbytes, expiring on :2025-09-14" (Bucket Id `H1J`) and "Gigahome Classic OD 5G New: Your account has 173184192 Kbytes, expiring on :2025-09-14" (Bucket Id `H1P`) — both activated 2025-08-15, confirming the FWA data bucket is live and consuming/tracking usage.

55. **Account Attachments (image56):** The account's "Attachments" tab lists 16+ files, including **`SupplementaryForm_10092025_115914`** (jpg, 30,400 bytes) and **`Digital_New_FWA_10092025_110936_signed`** (pdf, 2,672,267 bytes) — the signed CAF PDF and supplementary form image are formally attached to the customer account record.

56. **Signed CAF - printable page 1 (image57):** Full-resolution printable rendering of the completed "Vodafone Customer Application Form" matching all data captured earlier (Date 10-Sep-2025, Narayan Manjhi, Qatari ID 28035644882, Zone 45/Street 56/Building 67/Apt 78B Al Rayyan, Section 4 Plan `GigaHome Premium OD New 5G -FWA`, Appointment ID 120885 / Appointment Date 12-Sep-2025 08:00, Signature "HEMANTH 09/10/2025 11:58:52").

57. **Terms and Conditions - page 2 (image58):** Full bilingual (English/Arabic) "Vodafone Qatar General Terms and Conditions" legal text page, the reverse side of the printed CAF — definitions (Agreement, Billing cycle, Business day, Customer Care, Extras/Add-ons, Final Bill, etc.) and numbered clauses.

**Overall flow summary:** CRM agent login → New FWA Tablet wizard (Contact via Qatari ID scan → Address → Plan "GigaHome Premium OD New 5G FWA Promotion" [Outdoor] → Addon/Discount [100% off 2 months] → Number Selection [41202323] → SIM Serial → Book Appointment [scheduled, 8AM-11AM, Appointment ID 120885] → CAF + Supplementary Form signed and attached) → order submitted (1-29724275746, Dual Play/Activation) → back-office WFM inventory loaded via Excel/Field Service Import (Resource ABATS: 5G Indoor CPE, 5G Outdoor CPE, SIM serials) → inventory transferred from ABATS to technician Syed Irfan → technician's WFM/OFSC mobile app: Start Activity with GPS → Kahramaa duplicate check (none found) → Serial Number Check - Dual Play (confirms CPE Indoor/Outdoor/SIM serials) → Service Activation submitted and returns Success → Install Inventory (SNC) → Installation Checklist (speed test, Wi-Fi SSID, VLAN screenshots, customer briefing checkboxes, customer signature) → End Activity (remarks, customer availability, signature) → CRM order flips to Status "Complete" / Fulfillment "Complete" → account shows all assets Active, signed CAF and Supplementary Form attached to the account, and the FWA data buckets (Endless Data@1M, Gigahome Classic OD 5G New) shown active on the billing profile.

## Cross-references
- Sibling document in the same `Guided Journeys/FWA/` folder is presumably an Indoor variant (not reviewed in this pass); this document is explicitly the **Outdoor** ("OD") FWA journey per the selected plan "GigaHome Premium OD New 5G FWA Promotion" and CPE Outdoor IDU/ODU components.
- Matching row in `CRM_Journeys_Final_Updated_with_Type.xlsx` would be the FWA Outdoor Tablet / New FWA Tablet journey type, if present.
- Related back-office tool referenced: "VFQ Inventory Loading - Master 06-11-2023_V2_Latest" Excel workbook (Resource Inventory Import macro) — a separate operational artifact, not part of the CRM/WFM UI itself.
- Test/staging environment domains observed: `10.162.53.100:4443` (Siebel/CRM confirm dialogs) and `plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com` (Oracle Field Service Cloud plugin dialogs) — both indicate this walkthrough was captured in a QA/test environment, not production.

## Extraction notes
Confidence upgraded from low on 2026-08-21. Recovered by direct visual inspection of all 58 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 58 images were legible and informative; no blank or corrupted images were encountered. One minor ambiguity: image12 (SIM Serial accordion step) shows no visible input field, likely because the SIM serial/barcode field was scrolled out of the captured crop or captured via a scan icon not rendered in that screenshot — the actual SIM serial value is confirmed later (`894270280080801190323`) via the Serial Number Check and inventory transfer screens, so no information is lost. The two attachment screenshots in the Installation Checklist (image47-48) reuse a generic placeholder filename "W3 Timesheet.JPG" for multiple distinct attachment types, indicating this was captured in a test/demo environment rather than a real installation.

# Workflow Execution Matrix (Phase 15)

Step-by-step Actor/Input/Output/Validation/Business-Rule/Next-Step/Exception-Flow detail for journey scenarios, grouped under the closest-matching canonical journey from `journeys.md` (UJ-xxx) where a confident match was found, else left ungrouped. Distinct channel/approval variants of a 'similar' journey (e.g. Tablet B2B2C With Approval vs. Desktop Vanilla) are kept as separate scenario walkthroughs rather than merged into one generic flow, since they genuinely differ step-by-step.

**Canonical items:** 960 (from 945 raw extracted mentions)

**Confidence:** high 880 · medium 80 · low 0
**Classification:** Explicit 942 · Inferred 18 · Assumed 0

Every item cites its source document slug(s) and evidence quote(s); open `.knowledge/docs/<slug>.md` for full context per `CLAUDE.md`.

---

## UJ-057: FWA Outdoor Vanilla Desktop + WFM Installation (Dual Play) (21 steps)

**WF-283** (step 1) `Explicit` · confidence: `high`
- **Actor:** CRM agent (KARTHIKK)
- **Input:** Home screen
- **Output:** Contact creation started
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Home screen (img 1): Vodafone CRM landing page, "Welcome back KARTHIKK KARTHIKK!"”

**WF-284** (step 2) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** contact fields (Passport ID, name, address)
- **Output:** Contact "VFQMAV FWA_OD_TEST2" created
- **Validation:** 90-day temporary number warning for non-resident ID
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “system dialog fires: "...This number will only be active for 90 days..."”

**WF-285** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** contact
- **Output:** Account 129722927059 created, Area Al Rayyan set
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Account created (img 3): Account screen for "VFQMAV FWA_OD_TEST2"...selecting Area "Al Rayyan"”

**WF-286** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** account
- **Output:** Order 1-29722927101 created, Status Pending
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Order created (img 4): Account > Orders tab shows new Order# 1-29722927101...Status "Pending"”

**WF-287** (step 5) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Line items
- **Output:** 3 lines added: GigaHome Classic OD 5G promo, FMS CPE Bundle, FMS Service Bundle
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Line items added (img 6)...Three lines added, all Action "Add"”

**WF-288** (step 6) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Numbers tab
- **Output:** Number 97441202322 reserved
- **Validation:** SUCCESS:Reservation Token:13832357(SBL-EXL-00151)
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Number reservation (img 7): Numbers tab. Success dialog: "SUCCESS:Reservation Token:13832357(SBL-EXL-00151)"”

**WF-289** (step 7) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Ship to Addresses popup
- **Output:** CPE shipment address confirmed
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Ship to Addresses popup (img 9): For the CPE shipment...Selected: Ship To "test1"”

**WF-290** (step 8) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Line 3 FMS Service Bundle
- **Output:** Book Appointment clicked
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Book Appointment clicked (img 11): Line 3...selected; user clicks the "Book Appointment" button”

**WF-291** (step 9) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Book Appointments calendar
- **Output:** Slot 09/07/2025 2PM-5PM selected
- **Validation:** capacity check (some slots show Full)
- **Next step:** 10
- **Exception flow:** other slots unavailable if Full
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “On 09/07/2025, the 8AM-11AM and 11AM-2PM slots show "Full" (red)...09/07/2025 "2PM - 5PM" slot (13/15) is selected”

**WF-292** (step 10) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** appointment submit
- **Output:** Appointment Id 120812 booked
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Appointment has been successfully booked.Appointment Id is 120812"”

**WF-293** (step 11) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** CPE serial import grid
- **Output:** Outdoor and Indoor CPE serials entered
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “row 1 Inventory Type "5G_OUTDOOR_CPE_SERIAL_NUMBER"...row 2 "5G_INDOOR_CPE_SERIAL_NUMBER"”

**WF-294** (step 12) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Submit
- **Output:** Order Status Open, Order Sub Type Dual Play
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Order submitted (img 16): Order header now shows Status "Open" (from Pending), Order Sub Type "Dual Play"”

**WF-295** (step 13) `Explicit` · confidence: `high`
- **Actor:** Dispatcher/back-office
- **Input:** WFM Activity details
- **Output:** Technician assignment attempted, work zones mismatch flagged
- **Validation:** Move dialog flags Work zones mismatch
- **Next step:** 14
- **Exception flow:** technician moved/reassigned; date shifted from 09/07 to 09/09
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Move dialog (img 19)...flagged "Work zones mismatch" (in red)”

**WF-296** (step 14) `Explicit` · confidence: `high`
- **Actor:** Dispatcher
- **Input:** Inventory Management transfer
- **Output:** CPE/SIM items transferred to technician Syed Irfan
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Inventory transfer (img 20-24)...Transfer List tab shows Total Items: 2...Current Owner ABATS, Transfer To "Syed Irfan"”

**WF-297** (step 15) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** OFS My Route, Start activity
- **Output:** Activity started, geolocation captured
- **Next step:** 16
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Start activity (img 27): "Start activity" popup..."Get geolocation" button”

**WF-298** (step 16) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Assess Activity check
- **Output:** No prior records found (Kahramaa ID, 30-day lookback)
- **Validation:** "No previous records are found based on Kahrama ID in last 30 days."
- **Next step:** 17
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Assess Activity check (img 30)..."No previous records are found based on Kahrama ID in last 30 days."”

**WF-299** (step 17) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Serial Number Check screen (CPE Indoor, CPE Outdoor, SIM Card)
- **Output:** Service activation request submitted
- **Next step:** 18
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success'..."”

**WF-300** (step 18) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** activation request
- **Output:** Service Activation Status: Success
- **Next step:** 19
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Service Activation Status: Success"..."Please perform 'Install Inventory (SNC)'"”

**WF-301** (step 19) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Installation Checklist form + Customer Signature
- **Output:** Checklist submitted
- **Next step:** 20
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Installation Checklist (img 34-35)...Submit”

**WF-302** (step 20) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** End activity popup
- **Output:** Activity ended, next activity suggested
- **Next step:** 21
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “End activity (img 37): "End activity" popup...A "Next Activity" auto-suggested”

**WF-303** (step 21) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** activity end
- **Output:** Sales Order Status Complete, live billing buckets confirmed active
- **Validation:** Status Context: All order lines are completed
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Order status = Complete (img 38)...Billing profile / active service confirmation (img 39)...SIM State ACTIVE”

## UJ-077: Cross Sales to New Postpaid (Existing Customer, Open UI Desktop) (21 steps)

**WF-635** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Existing account context / Account Summary lookup
- **Output:** Account Summary shown with Installed Assets, Orders, Billing Profile, Trouble Tickets grids
- **Next step:** Check Unbilled Usage / Surepay bucket
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Agent starts on Account Summary for customer 'HEMANTH GOVARDHANAN'...”

**WF-636** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account/MSISDN
- **Output:** Surepay Bucket View showing active data/voice/SMS buckets
- **Next step:** Navigate to Cross Sales module
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Agent checks Unbilled Usage > Surepay View > Bucket View for the account... top nav bar here shows 'Cross Sales' as a top-level app icon”

**WF-637** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID (29735617987)
- **Output:** ID verified with green checkmark
- **Validation:** green checkmark verification
- **Next step:** Click Go
- **Exception flow:** Search again / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '1. Contact' (expanded): 'Please insert or scan the customer's Qatari Id:' field populated with 29735617987, verified with a green checkmark.”

**WF-638** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Qatari ID lookup
- **Output:** Loading spinner 'Getting information, please wait...'
- **Next step:** Connection Details modal populates
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “After Go, '1. Contact' shows 'Getting information, please wait...' spinner”

**WF-639** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Qatari ID 29735617987
- **Output:** Contact fields auto-populated; Connection Details modal shows 2 existing postpaid connections warning
- **Validation:** Customer already has 2 or more Post-paid connections warning
- **Business rule:** credit policy / credit control approval rule for 2+ postpaid connections
- **Next step:** Agent reviews and Continues past modal
- **Exception flow:** Cancel
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Connection Details' popup fires: 'Total Number of Prepaid Connections: 0', 'Total Number of Postpaid Connections: 2', with note: 'Note - Customer already has 2 or more Post-paid connections...'”

**WF-640** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Contact confirmed
- **Output:** Contact form clean/ready, step 1 shows 'Saved!'
- **Next step:** Offers step expands
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Modal dismissed; the same Contact form is shown clean and ready, Continue button available.”

**WF-641** (step 7) `Explicit` · confidence: `high`
- **Actor:** System / Agent
- **Input:** Saved contact
- **Output:** Cross Sales Offers grid with 2 system-generated offers (New MNP, New Postpaid)
- **Business rule:** CampaignCode C000009053 driven offers
- **Next step:** Agent Accepts the 'New Postpaid' offer
- **Exception flow:** Interested / Reject / Close
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '2. Offers' expands to a 'Cross Sales Offers' grid with Accept / Interested / Reject / Close action buttons and two system-generated offers”

**WF-642** (step 8) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Accepted 'New Postpaid' offer
- **Output:** Handoff to standard New Postpaid wizard, breadcrumb 'Postpaid - Contact:'; Connection Details modal reappears with same 2+ connections warning
- **Next step:** Contact form additional fields (ID type, Job title, Digital Lead/Sale, No Email, Language, Alt phone)
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “After accepting the 'New Postpaid' offer, breadcrumb changes to 'You are here: Postpaid - Contact:' — the journey has now handed off into the standard New Postpaid provisioning flow”

**WF-643** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Contact form
- **Output:** Contact form ready for Continue
- **Next step:** Address step
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Modal dismissed; full Postpaid Contact form visible and ready for Continue.”

**WF-644** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Zone, Street No., Building No., Apt/Flat/Unit (empty allowed)
- **Output:** Address saved or skipped
- **Next step:** Account step
- **Exception flow:** Skip Address / Cancel / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '2. Address' expanded with empty fields... buttons Save Address / Skip Address / Cancel / Go Back”

**WF-645** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Account/billing context
- **Output:** Steps 2 (Address) and 3 (Account) completed; Billing profile row shown
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Steps 2 (Address) and 3 (Account) now completed/collapsed. Step '4. Billing: Postpaid' expanded, one billing profile row”

**WF-646** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select an available number, click Reserve
- **Output:** SUCCESS:Reservation Token:1001357812(SBL-EXL-00151) alert; number moves to Reserved Numbers grid
- **Validation:** Number reservation confirmation code SBL-EXL-00151
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A native browser alert reads: 'SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)'”

**WF-647** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702111338839146
- **Output:** SIM Serial verified (green check)
- **Validation:** green check verification
- **Next step:** Plan (Product Catalog)
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '6. SIM Serial' expanded... SIM Serial: 8942702111338839146, verified (green check).”

**WF-648** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Plan step triggered
- **Output:** Loading into Product Catalog; 'New Plus Max India BIA Promotion' plan detail modal with Bill Limit 150 and Credit Limit 1000
- **Next step:** Payment
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '7. Plan' triggers a 'Loading - Please wait' overlay... 'New Plus Max India BIA Promotion' with Bill Limit: 150... and Credit Limit: 1000”

**WF-649** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Payment reason 'For Testing Only', click Generate CAF
- **Output:** 'Validating Order, please wait...' then order validated
- **Next step:** CAF/Attachments
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Take Payment in Wincash.'... 'Generate CAF' button... 'Validating Order, please wait...' status line”

**WF-650** (step 16) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Attach file (PPVT TESTING SAMPLE.pdf)
- **Output:** Step 9 CAF saved
- **Next step:** Activity
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '9. CAF' expanded showing an 'Attachments' section... one file already attached — 'PPVT TESTING SAMPLE.pdf'”

**WF-651** (step 17) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Call-disposition fields (Channel, Type, Topic, Sub Topic, Area, Resolution Code, Status, Language, Comments)
- **Output:** Comments filled with 'PPVT TESTING CROSS SALES'; Save and Finish clicked
- **Next step:** Order completion confirmation
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Final step '10. Activity' expanded — call-disposition form... Button: 'Save and Finish'.”

**WF-652** (step 18) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Save and Finish
- **Output:** 'Postpaid completed successfully. Order Number:- '1-225217281463''; Finish Process
- **Next step:** Sales Order detail view / Account Summary update
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A confirmation popup reads: 'Postpaid completed successfully. Order Number:- '1-225217281463'' with a 'Finish Process' button”

**WF-653** (step 19) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Completed order 1-225217281463
- **Output:** Sales Order Line Items (12 lines) for new MSISDN 97470345802 shown, statuses FULFILL BILLING COMPLETE / SMS NOTIFICATION COMPLETE reached
- **Next step:** Account Summary reflects updated Installed Assets and Orders
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Sales Order 1-225217281463: Type Sales Order, Order Type Activation, Status Complete... Line Items grid (12 lines)”

**WF-654** (step 20) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Cross Sales transaction completion
- **Output:** Secondary linked Modification order 1-225218123343 auto-created adding '2GB Data 12 months' add-on to customer's other existing line (97430355458)
- **Next step:** Provision History / Campaign History close-out
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “except line 1.11 '2GB Data 12 months' which has Action 'Add'... a linked follow-on transaction”

**WF-655** (step 21) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Provisioning completion
- **Output:** Provision History shows Status 'Success'; Contact History shows SMS campaign delivered
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Provision History': one row, Status 'Success', Created 05/12/2026 03:17:10 PM — the final system trace confirming successful provisioning.”

## UJ-081: New Postpaid B2B2C With Approval (Open UI Tablet) (20 steps)

**WF-681** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (VINODHINIR VINODHINIR)
- **Input:** Home screen, click Mobile Postpaid
- **Output:** Choose process screen with New Postpaid / Prepaid to Postpaid
- **Next step:** Select New Postpaid
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent hovers/clicks 'Mobile Postpaid.' ... two options: 'New Postpaid' and 'Prepaid to Postpaid.' Agent selects New Postpaid.”

**WF-682** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 29035654458, click Go
- **Output:** Wizard accordion shows 6 steps (Contact, Address, Plan, Addon & Discount, Number Selection, SIM Serial)
- **Next step:** Contact confirmation
- **Exception flow:** Search again / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent scans/enters Qatari ID 29035654458, clicks Go (Search again / Cancel also present).”

**WF-683** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Contact ID lookup
- **Output:** Fields populated (Nationality Indian, Gender F, SELBATH JAMALUDEEN); Connection Details popup: 0 prepaid, 0 postpaid connections
- **Next step:** Continue
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Connection Details' popup appears: 'Total Number of Prepaid Connections: 0', 'Total Number of Postpaid Connections: 0'”

**WF-684** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Company Name dropdown, select '01 newfreedcn01_Test'
- **Output:** B2B2C linkage established; ECR/Email/Language/Alt phone fields shown mandatory
- **Business rule:** B2B2C linkage requires Company Name selection
- **Next step:** Complete remaining Contact fields
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent selects '01 newfreedcn01_Test'. Enter ECR Details = No... Email, No Email, Language, Alt. phone # fields appear below, each marked mandatory”

**WF-685** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, No Email, Language, Alt phone#, ID photos
- **Output:** Contact step complete, Continue clicked
- **Next step:** Address step
- **Exception flow:** Search again / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Email = noemailid@vodafone.com, 'No Email' checkbox ticked, Language = English, Alt. phone # = 97412341234. 'Qatari ID-Front' and 'Qatari ID-Back' images captured”

**WF-686** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Zone/Street/Building/Apt = test90
- **Output:** Address saved
- **Next step:** Plan step
- **Exception flow:** Skip Address / Go back / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Zone, Street No., Building No., Apt/Flat/Unit fields (later filled with 'test90' for all four, per the CAF preview).”

**WF-687** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'Postpaid Plus Extra India Promotion', click Add
- **Output:** Plan detail popup: Bill Limit 100, Credit Limit 1000
- **Next step:** Continue to Addon & Discount
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent clicks 'Add' on 'Postpaid Plus Extra India Promotion.'... Bill Limit: 100 ... Credit Limit: 1000”

**WF-688** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Addon & Discount step reviewed (no extra add-ons selected)
- **Output:** 'QR 25 Discount for 6 Months' shown applied; Continue clicked
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Discount: 'Select Discount' button; 'QR 25 Discount for 6 Months' already shown as applied.”

**WF-689** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select number 79025212, click Reserve
- **Output:** SUCCESS:Reservation Token:13757449(SBL-EXL-00151); MSISDN 97479025212
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “native browser alert — 'SUCCESS:Reservation Token:13757449(SBL-EXL-00151)'”

**WF-690** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 894270240000026362
- **Output:** Steps 3-5 Saved!; Continue clicked
- **Next step:** CAF preview and signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “SIM Serial = 894270240000026362. Steps 3–5 show 'Saved!' status.”

**WF-691** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF generation
- **Output:** Bilingual CAF preview with account/company data, credit limit 1000, smart limit 100
- **Next step:** Signature capture
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “CAF preview... Billing info: Account credit limit 1000, Smart Limit 100”

**WF-692** (step 12) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Signature pad
- **Output:** Signature captured; Done clicked
- **Next step:** CAF & Additional Attachments
- **Exception flow:** Clear Signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Please Sign' pad; customer signs; Clear Signature / Done buttons.”

**WF-693** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Attach Proof of Employment and CAF
- **Output:** Both attachments show green checkmarks; Continue clicked
- **Validation:** Proof of Employment required (red asterisk)
- **Next step:** Activity step
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Proof of Employment' (required, red asterisk) and 'CAF' both shown captured with green checkmarks”

**WF-694** (step 14) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments 'Testing12345'
- **Output:** Save And Finish clicked
- **Next step:** Submission confirmation
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent enters Testing12345. Button: Save And Finish.”

**WF-695** (step 15) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Save And Finish
- **Output:** 'Your activation request order number: 1-29710853118 is submitted for approval...'; order Status Pending, Approved unticked
- **Business rule:** B2B2C With Approval requires manager sign-off before provisioning
- **Next step:** Order enters Manager's Order Approval queue
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Your activation request order number: 1-29710853118 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval.'”

**WF-696** (step 16) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** TM SR Queue View, click Assign To Me
- **Output:** Order moves to My Activities tab, Owner MANAGETEST, Activity Status Assigned
- **Next step:** Open Order Approval detail
- **Exception flow:** ReAssign To Queue
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Manager clicks Assign To Me; the activity moves to the My Activities tab with Owner = MANAGETEST, Activity Status = 'Assigned'”

**WF-697** (step 17) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Review Attachments, Order Details, Activities, Agents Details tabs
- **Output:** Order Expiry 20/08/2025 08:39:01 AM (3-day SLA); documents reviewed
- **Validation:** 3-day order expiry window
- **Next step:** Click Approve
- **Exception flow:** Reject - Correction / Reject - Drop Order / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Order Expiry: 20/08/2025 08:39:01 AM (a 3-day SLA window from submission). Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back.”

**WF-698** (step 18) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Click Approve, enter Comments 'Order Approved', Submit
- **Output:** Order Status changes to Open, Fulfillment Status In Progress
- **Validation:** Approve confirmation text: 'By clicking submit, I agree that I have verified all the documents and details to proceed with submission.'
- **Next step:** Order fulfillment
- **Exception flow:** Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Manager clicks Approve; a confirmation dialog reads... Comments box is filled with 'Order Approved'”

**WF-699** (step 19) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Approved order fulfillment
- **Output:** Account Special Management field populated 'B2B2C Consumer'; Contact Employer field populated
- **Next step:** Order reaches Complete
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “the 'Special Management' field is now populated/highlighted as 'B2B2C Consum[er]…'”

**WF-700** (step 20) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Fulfillment completes
- **Output:** Order Status Complete, Fulfillment Status Complete, 'All order lines are completed'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Order Status = 'Complete,' Fulfillment Status = 'Complete,'... Status Context: 'All order lines are completed'”

## UJ-066: FWA Outdoor WFM New Sale End-to-End (Tablet, Open UI) (19 steps)

**WF-510** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent Hemanth Kumar (tablet)
- **Input:** Qatari ID 28035644882
- **Output:** Contact NARAYAN MANJHI confirmed + Connection Details popup (0/0 connections)
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Qatari ID 28035644882 entered and validated...Connection Details popup showing Total Number of Prepaid Connections: 0...”

**WF-511** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Zone 45, Street No. 56, Building No. 67, Apt/Flat/Unit 78B, Area Al Rayyan
- **Output:** Address saved
- **Validation:** Required fields enforced
- **Next step:** Plan selection
- **Exception flow:** Blank submit → "Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit.,Area"
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Clicking Save Address without data triggers a validation dialog...Address filled: Zone 45, Street No. 56, Building No. 67...”

**WF-512** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Selection of GigaHome Premium OD New 5G FWA Promotion
- **Output:** Bundle components confirmed
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “GigaHome Premium OD New 5G FWA Promotion (highlighted/selected — "OD" = Outdoor...”

**WF-513** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Addon/Discount
- **Output:** 100% Discount for 2 Months -FWA applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Discount auto-applied: "100% Discount for 2 Months -FWA."”

**WF-514** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Number 41202323 selected
- **Output:** 97441202323 saved
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “One number card shown: 41202323, price QR0.00, selected”

**WF-515** (step 6) `Inferred` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** SIM Serial entry
- **Output:** Saved (steps 3-5 Saved!)
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Step "6. SIM Serial" is empty of visible input fields in this screenshot...likely a scanner/barcode field”

**WF-516** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Date 11 Sep 2025 selected, time slot 8AM-11AM
- **Output:** Appointment ID 120885 booked, Appointment Number 1-29724276359
- **Validation:** Confirm dialog acknowledged
- **Next step:** CAF & Additional Attachments
- **Exception flow:** Alternate path: Book Unscheduled Appointment with warning it cannot be cancelled within journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Appointment has been successfully booked...Appointment ID is 120885”

**WF-517** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent + customer
- **Input:** CAF data, e-signature, CAF + Supplementary Form
- **Output:** Both documents green-checked
- **Next step:** Order submission
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “three tiles: CAF (green check, required *), Supplementary Form (green check, required *)”

**WF-518** (step 9) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Order submission
- **Output:** Order 1-29724275746 created, Status Open, Fulfillment Status In Progress
- **Next step:** WFM inventory loading
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “CRM Sales Order screen for Order # 1-29724275746...Status Open...Fulfillment Status In Progress”

**WF-519** (step 10) `Explicit` · confidence: `high`
- **Actor:** Back-office/inventory admin
- **Input:** Excel VFQ Inventory Loading sheet (indoor CPE, outdoor CPE, SIM)
- **Output:** Resource Inventory Import: Created 3, Updated 0, Deleted 0, Item failed 0
- **Validation:** Get Quantity Success; Import Status Success
- **Next step:** Technician reassignment (Move)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Import Status: Get Quantity Success, Import Status Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0.”

**WF-520** (step 11) `Explicit` · confidence: `high`
- **Actor:** Dispatcher/supervisor (OFSC)
- **Input:** Move dialog
- **Output:** Technician Syed Irfan assigned (Work zones mismatch warning shown)
- **Next step:** Inventory transfer
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “technician "Syed Irfan" (ABATS, +2:00) with a "Work zones mismatch" warning”

**WF-521** (step 12) `Explicit` · confidence: `high`
- **Actor:** Dispatcher/supervisor (OFSC)
- **Input:** Non-Serialized Inventory Transfer (indoor CPE, outdoor CPE, SIM)
- **Output:** Inventory transfer has been completed
- **Validation:** Total Items: 3
- **Next step:** Technician route activation
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Inventory transfer has been completed. Closing the plugin screen..."”

**WF-522** (step 13) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Activate Route
- **Output:** Route activated, Start button available
- **Next step:** Start activity
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “activity card now shows a "Start" button instead of the activate prompt.”

**WF-523** (step 14) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Get geolocation
- **Output:** Activity started (timer 2:00)
- **Next step:** Assess Activity / Kahramaa check
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Get geolocation" button and an embedded Google Map...Activity Status started”

**WF-524** (step 15) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Kahramaa ID check
- **Output:** No previous records found in last 30 days
- **Next step:** Serial Number Check - Dual Play
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"No previous records are found based on Kahrama ID in last 30 days."”

**WF-525** (step 16) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** CPE Indoor 2EQTE24314000125, CPE Outdoor S180P18075125, SIM Card 894270280080801190323
- **Output:** Service activation request submitted successfully; Service Activation Status Success
- **Validation:** All serials green-checked
- **Next step:** Install Inventory (SNC) / Installation Checklist
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success'...”

**WF-526** (step 17) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan) + customer
- **Input:** Speed test, Wi-Fi SSID, VLAN screenshots, checklist checkboxes, customer signature
- **Output:** Installation Checklist submitted (Forms Submitted)
- **Next step:** End Activity
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Installation Checklist" form ("Forms Submitted" status shown top-right)”

**WF-527** (step 18) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan) + customer
- **Input:** Activity Remarks, Customer Available, Customer Signature, Next Activity
- **Output:** Activity ended
- **Next step:** Order completion (backend)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"End activity" screen: Activity Type Installation, Name NARAYAN MANJHI...Dismiss/Submit buttons”

**WF-528** (step 19) `Explicit` · confidence: `high`
- **Actor:** System/back office
- **Input:** Completed WFM activity
- **Output:** Order 1-29724275746 Status Complete, Fulfillment Status Complete, all assets Active, data buckets live
- **Validation:** Status Context: All order lines are completed
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Order 1-29724275746 now shows Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed"”

## UJ-087: Prepaid to Postpaid Migration - Autobase (system-recommended offer, single-click wizard, Desktop) (19 steps)

**WF-755** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account Summary for VFQMAV PHSP6211
- **Output:** Confirmed active Prepaid Mobile Service Bundle and prior abandoned Post2Pre order history
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Agent opens account 'VFQMAV PHSP6211' ... Orders history already lists a prior abandoned 'Post2Pre' plan-change order”

**WF-756** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Scrolled Account Summary, Billing Profile sub-view
- **Output:** Confirmed two billing profiles (Prepaid active, Postpaid inactive)
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Billing Profile sub-view shows two profiles: 1-D7SNQ4I (Prepaid, green/active) and 1-D8DNSVY (Postpaid, red/inactive)”

**WF-757** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account 360 View / Account Summary tile view flyout on Prepaid Red Promotion asset
- **Output:** Clicked 'Go to offer migration' link, entering Autobase
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “A flyout on the 'Prepaid Red Promotion' asset ... shows a 'Go to offer migration' link plus Back / SIM Swap buttons — this link is the entry point into Autobase.”

**WF-758** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Migration Offer tab on Complex Asset
- **Output:** System-pregenerated 'Postpaid U Start Promotion' offer (Status Offered, CampaignCode C000006358, Source Unica) presented; agent Accepts
- **Business rule:** Offer sourced from Unica campaign engine (CampaignCode C000006358)
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “A 'Migration Offers' grid (system pre-populated, 1 of 1) already lists: OfferName 'Postpaid U Start Promotion' ... Status 'Offered' ... Buttons: Accept / Interested / Reject.”

**WF-759** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Base Management wizard '1. Contact' step, number 97479026346
- **Output:** Clicked Go to confirm contact
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Step 1 initially just asks to confirm the number (97479026346) with a 'Go' button.”

**WF-760** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Contact confirmation form (prefilled from Qatari ID)
- **Output:** HRN advance payment info banner shown, Continue clicked
- **Validation:** (HRN) Customer needs to pay advance payment of QR 100.
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Info banner (verbatim): '(HRN) Customer needs to pay advance payment of QR 100.' Continue/Cancel buttons.”

**WF-761** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Continue click
- **Output:** Native browser alert repeats HRN advance payment message with OK button
- **Validation:** (HRN) Customer needs to pay advance payment of QR 100.
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Clicking Continue triggers a native browser alert dialog reproducing the same message verbatim”

**WF-762** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Step 2 Offer Summary (Bill Limit 20, Credit Limit 1000)
- **Output:** Offer terms reviewed, Continue clicked
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Step 2 auto-expands showing the offer terms ... Bill Limit: 20 ... Credit Limit: 1000. Continue/Cancel buttons.”

**WF-763** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Step 3 Activity (Channel dropdown, Language, Comments)
- **Output:** Channel defaulted to Appointment; agent clicks Save and Finish
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Step 3 expands with: Channel dropdown defaulted to 'Appointment' ... Button: 'Save and Finish'.”

**WF-764** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments modal
- **Output:** Comment 'UNICA PRE TO POST TEST' saved, Language set to English
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “A 'Comments' popup textbox is filled with the literal text 'UNICA PRE TO POST TEST'”

**WF-765** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Save and Finish click
- **Output:** Order request submitted successfully confirmation; Finish Process clicked
- **Validation:** Order request is submitted successfully. Please check installed asset of the account to confirm. (HRN) Customer needs to pay advance payment of QR 100.
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “After Save and Finish, a modal reads verbatim: 'Order request is submitted successfully...' Button: 'Finish Process'.”

**WF-766** (step 12) `Explicit` · confidence: `high`
- **Actor:** System (backend)
- **Input:** Order submission
- **Output:** Bulk job 1-D8SCUKH created, Status 'In Processing', Attrib09 'PreToPost'
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “the submitted job appears as row 1-D8SCUKH ... Status 'In Processing' ... Attrib09 'PreToPost'.”

**WF-767** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Backend job processing
- **Output:** New order 1-28829245642 appears on account, Status Pending, new Postpaid billing profile 1-D8SB5BJ created
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Orders grid now shows a new row: Status 'Pending' ... Order # 1-28829245642 ... Billing Profile grid now has 3 rows”

**WF-768** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order detail initial state
- **Output:** Order 1-28829245642 shows Status Open with 3 line items (Update/Delete/Add)
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Order Type 'Plan Change', Order Sub Type 'Pre2Post' ... Line Items (1-3 of 3): Update 'Mobile Service Bundle' ... Delete 'Prepaid Red Promotion' ... Add 'Postpaid U Start Promotion…'”

**WF-769** (step 15) `Explicit` · confidence: `high`
- **Actor:** System (backend fulfillment)
- **Input:** Order 1-28829245642 processing
- **Output:** Order Status becomes Complete, all line items Complete
- **Next step:** 16
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Same order refreshed: Status 'Complete', Fulfillment Status 'Complete', Status Context 'All order lines are completed'”

**WF-770** (step 16) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Expanded Line Items outline
- **Output:** Full fulfillment tree (1.1-1.9) each reaching Complete
- **Next step:** 17
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Expanding the 'Mobile Service Bundle' root line reveals the full fulfillment tree, each reaching 'Complete'”

**WF-771** (step 17) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account Summary refresh
- **Output:** Primary MSISDN populated, 10 active line items under new Postpaid billing profile
- **Next step:** 18
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Primary MSISDN field on the account header is now populated (97479026346), where it was blank at the start”

**WF-772** (step 18) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account Activities tab
- **Output:** New activity record auto-created: Channel Appointment, Comments 'UNICA PRE TO POST TEST', Status Solved, Area 'Migration to Postpay', Journey 'Start-up'
- **Next step:** 19
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “New activity row (highlighted): Activity # 1-D8SCUKS ... Status 'Solved' ... Area 'Migration to Po...' (Migration to Postpay), Journey 'Start-up'”

**WF-773** (step 19) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account Activities tab scrolled right
- **Output:** Resolution Code Completed, Sub-Topic Retail - Open UI, Topic Automated Guided Journey confirmed
- **Next step:** None (terminal/complete)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Resolution Code 'Completed', Type 'Sales', Sub-Topic 'Retail - Open UI' ... Agent ID 'KARTHIKK' (and 'SADMIN' for one system-origin row).”

## UJ-088: Prepaid to Postpaid Conversion - Open UI Tablet (Expat Customer, Credit Limit downgrade scenario) (19 steps)

**WF-774** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account Summary (tablet home) for ALLAN GRANADA
- **Output:** Confirmed Credit Limit 1000 and existing Prepaid Red Promotion
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Customer 'ALLAN GRANADA,' Account Type: Residential, Customer Segment: Expatriate, Credit Limit Amount: 1000 ... Installed Assets panel shows 'Prepaid Red Promotion.'”

**WF-775** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Contacts tab popup 'Go to offer migration' link
- **Output:** Entry point into migration/conversion flow surfaced
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “A popup ... shows 'Prepaid Red Promotion,' MSISDN 97479026351, status Active, with a link 'Go to offer migration' and buttons Back / SIM Swap”

**WF-776** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Home menu, 'Mobile Postpaid' icon
- **Output:** Agent navigates into Guided Process
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Welcome back VINODHINIR VINODHINIR!... This is the tablet home screen the agent uses to start the journey via 'Mobile Postpaid.'”

**WF-777** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Choose process panel
- **Output:** Selected 'Prepaid to Postpaid' (vs 'New Postpaid')
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “a 'Choose process' panel offers two buttons: New Postpaid and Prepaid to Postpaid.”

**WF-778** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Step 1 Contact search: Prepaid Number, Qatari ID
- **Output:** Go clicked to search
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Fields: Prepaid Number '+974 79026351', Qatari ID '28260821189' (validated, green check). Buttons: Go, Search again, Cancel.”

**WF-779** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Contact lookup result
- **Output:** Contact confirmed; Connection Details modal shows 1 prepaid/0 postpaid connections
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “A 'Connection Details' modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”

**WF-780** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, Language, Alt. phone fields (initially empty)
- **Output:** Agent enters and validates fields; uploads Qatari ID front/back
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Email (required, empty) ... two empty upload placeholders 'Qatari ID-Front' / 'Qatari ID-Back'”

**WF-781** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Completed contact fields
- **Output:** Email, Language, Alt phone validated (green checks); ID docs uploaded
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Email 'noemailid@vodafone.com' (green check), No Email checked, Language 'English' (green check) ... both Qatari ID-Front / Qatari ID-Back thumbnails shown with green checkmarks”

**WF-782** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Step 2 Plan search box 'U'
- **Output:** Selected 'Postpaid U Start Promotion' from grid
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “search box containing 'U'. Grid of postpaid promotion tiles ... Postpaid U Start Promotion (highlighted/selected in red)”

**WF-783** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan detail modal (Bill Limit 20, Credit Limit 1000)
- **Output:** Reviewed plan inclusions
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Modal shows Bill Limit: 20 ... Credit Limit: 1000 ... Included items list: U Start, U Start 8G_150LMin, Bill Manager, Carry_forward_charges, Bill Limit Mobile.”

**WF-784** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Edit Credit Limit dropdown
- **Output:** Credit Limit changed from 1000 to 50
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Credit Limit dropdown expanded showing options 1000, 200, 50 (highlighted/being selected), 500, 800 ... Modal now shows Credit Limit: 50 confirmed”

**WF-785** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Step 3 Addon & Discount screen
- **Output:** U Start 8G_150LMin benefit confirmed, no discount selected, Continue clicked
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Select applicable benefits, add-ons and discounts based on customer's plan.' ... Discount: 'Select Discount' button (none chosen)”

**WF-786** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Steps 1-3 completed
- **Output:** Step 4 CAF generated bilingual, auto-populated with Section 1 & 2 (Credit Limit 50, Smart Limit 20)
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Vodafone Customer Application Form' ... Section 2 - Billing information: Account credit limit 50, Smart Limit 20”

**WF-787** (step 14) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Signature pad overlay
- **Output:** Signature captured, Done clicked
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Please Sign' modal overlay ... with a captured handwritten signature, and 'Clear Signature' / 'Done' buttons.”

**WF-788** (step 15) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF page 2, Section 3
- **Output:** Postpaid plan details confirmed on signed CAF; Section 4 (broadband) blank
- **Next step:** 16
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Section 3 - For Postpaid Customers: Mobile number 97479026351 ... Section 4 - Superfast Broadband and Home Phone is present but entirely blank”

**WF-789** (step 16) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account form refresh
- **Output:** Pre-approved credit limit field updated to 50
- **Next step:** 17
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Pre-approved (Expatriate/Qatari):' field now shows 50 (highlighted, matching the value chosen in the wizard)”

**WF-790** (step 17) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Billing Profile grid refresh
- **Output:** New Postpaid billing profile 1-CHS9MWP carries captured email
- **Next step:** 18
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “email 'noemailid@vodafone.com' now highlighted in the Postpaid row — confirms the new Postpaid billing profile carries the email captured during the wizard”

**WF-791** (step 18) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account detail final view
- **Output:** MOI Update Time stamped 6/19/2025 03:38:28 PM
- **Next step:** 19
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “updated 'MOI Update Time' 6/19/2025 03:38:28 PM”

**WF-792** (step 19) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Sales Order record created
- **Output:** Order 1-29417165348, Order Type Plan Change, Sub Type Pre2Post, Status Pending, Credit Limit 50, MRC QR108.00
- **Next step:** None (ends at Pending, pre-Submit)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Order 1-29417165348 ... Order Type 'Plan Change', Order Sub Type 'Pre2Post', Status: Pending ... Credit Limit 50, MRC Total QR108.00 ... staged as Pending, awaiting Submit”

## UJ-049: New Fixed Line Tablet – Prepatched KID, Combo Box, Normal Activation (Agent sales flow) (18 steps)

**WF-197** (step 1) `Explicit` · confidence: `high`
- **Actor:** Front-line agent (tablet, HALEEMI)
- **Input:** Home dashboard navigation
- **Output:** New Fixed Line Tablet tile selected
- **Next step:** Step 1 Contact lookup
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent lands on the CRM home screen and hovers/clicks the "New Fixed Line Tablet" tile”

**WF-198** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Kahramaa ID 16P6109
- **Output:** Prepatched device detection dialog shown
- **Next step:** Choose Normal vs Instant Activation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent enters Kahramaa ID: 16P6109 ... submits”

**WF-199** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Detected device serial numbers
- **Output:** Normal Activation path chosen
- **Business rule:** Agent chooses between Instant and Normal Activation when a prepatched device is detected
- **Next step:** ID capture
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent selects Normal Activation”

**WF-200** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ID Type, ID Number (27652419981)
- **Output:** ID validated (green check)
- **Next step:** Confirm contact details
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “ID Type = Qatari ID, ID Number = 27652419981 (verified, green check)”

**WF-201** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** ID lookup
- **Output:** Contact details auto-populated (name, DOB, nationality, gender)
- **Next step:** Contact details continued
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Auto-populated from ID lookup: Nationality Nepalese, Gender M, First name YAM, Last name POKHAREL”

**WF-202** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Get IPTV, email, language, alt phone, ID photos
- **Output:** Contact details completed with ID photos uploaded
- **Next step:** Step 2 Address
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front and Qatari ID-Back photos both uploaded (green check icons)”

**WF-203** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Address table
- **Output:** Primary address confirmed; Service Points grid shown
- **Next step:** Step 3 Plan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Service Points grid shows Service Point "16P6109_ON..."”

**WF-204** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan catalog
- **Output:** GigaHome 5Gbps Promotion selected
- **Next step:** Plan detail confirmation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “GigaHome tiles offered: GigaHome 5Gbps Promotion (selected)”

**WF-205** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan detail popup
- **Output:** Plan confirmed with bundled features
- **Next step:** Step 4 Addon & Discount
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “GigaHome 5Gbps Promotion detail card lists included features ... Continue”

**WF-206** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Add-on/discount selection
- **Output:** IPTV Add-ons shown/confirmed
- **Next step:** Step 5 Number Selection
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “IPTV Add-ons shown: OSN TV Main, OSNTV Premium Pack Free, IPTV Email Id and Mobile No.”

**WF-207** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Free number list
- **Output:** Number 41224335 reserved, Reservation Token 15332434
- **Next step:** Step 6 Book Appointment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"SUCCESS:Reservation Token:15332434(SBL-EXL-00151)"”

**WF-208** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Cluster F1, date, comments, Collect QID/CAF, time slot
- **Output:** Appointment booking submitted
- **Next step:** Booking warning confirmation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Dialog "Book Appointment", Cluster F1, February 2026 calendar with the 9th highlighted”

**WF-209** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Booking confirm dialog
- **Output:** Appointment booked, Appointment ID 14241, Appointment Number 1-29795178277
- **Validation:** WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment
- **Next step:** Step 7 CAF preview
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Appointment has been successfully booked...Appointment ID is 14241”

**WF-210** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Contact, plan, appointment data
- **Output:** Bilingual CAF PDF generated (Sections 1, 2, 4)
- **Next step:** Signature capture
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Bilingual Vodafone Customer Application Form (CAF) rendered as a document preview”

**WF-211** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent (capturing customer signature)
- **Input:** Signature pad
- **Output:** CAF signed and stamped (HALEEMI 02/08/2026 10:43:18)
- **Next step:** Step 7 CAF & Additional Attachments summary
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “the captured signature stamped with "HALEEMI 02/08/2026 10:43:18"”

**WF-212** (step 16) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF attachment slot
- **Output:** CAF completed (green check); Supplementary Form left empty
- **Next step:** Step 8 Activity (comments)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “three attachment slots: CAF (completed, green check, required), Supplementary Form (empty, optional)”

**WF-213** (step 17) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments "Combo box data - Normal Activation"
- **Output:** Order ready to submit
- **Next step:** Save and Finish
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “agent types "Combo box data - Normal Activation"”

**WF-214** (step 18) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Save And Finish
- **Output:** Order completed, Order Number 1-29795175561
- **Next step:** Order enters approval queue
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"Fixed Line completed successfully. Order Number:- '1-29795175561'"”

## UJ-057: FWA Outdoor Postpaid New Sale with WFM Installation (Desktop, Open UI) (18 steps)

**WF-304** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Qatari ID 29158603076
- **Output:** Contact confirmed (ABUBAKAR NAZIR) + Connection Details popup
- **Validation:** ID lookup resolves connection counts
- **Next step:** Address entry
- **Exception flow:** HRN banner: customer needs to pay advance payment of QR 100
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent enters Qatari ID 29158603076, clicks Go. System returns a Connection Details popup”

**WF-305** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Zone 11, Street No. 44, Building No. 77, Apt/Flat/Unit 99V, Area Al Rayyan
- **Output:** Address saved
- **Validation:** Required fields enforced
- **Next step:** Plan selection
- **Exception flow:** Empty submit triggers dialog requiring Zone/Street/Building/Apt/Area or Skip Address
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Submitting with empty fields triggers dialog...Agent fills Zone: 11, Street No.: 44...”

**WF-306** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Selection of GigaHome Premium OD New 5G FWA Promotion
- **Output:** Bundle components confirmed (FMS CPE ODU, FMS CPE Outdoor IDU, etc.)
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “GigaHome Premium OD New 5G FWA Promotion (selected — the Outdoor plan for this journey)”

**WF-307** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Addon/discount selection
- **Output:** 100% Discount for 2 Months -FWA auto-applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Discount auto-applied: 100% Discount for 2 Months -FWA.”

**WF-308** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Reserved Number toggle, number 41202325
- **Output:** MSISDN 97441202325 saved
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Number 41202325 (QR0.00) chosen. Confirmed later as full MSISDN 97441202325.”

**WF-309** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Appointment date 20 Sep 2025, time slot 8AM-11AM
- **Output:** Appointment ID 120955 booked; Appointment Number 1-29728036686
- **Validation:** Confirm dialog acknowledged
- **Business rule:** Appointment once booked cannot be cancelled
- **Next step:** CAF
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Appointment has been successfully booked...Appointment ID is 120955”

**WF-310** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop) + customer
- **Input:** CAF-Digital form data, e-signature
- **Output:** Signed CAF attached (Digital_New_Postpaid_CAF_...)
- **Validation:** Digitally signed with timestamp
- **Business rule:** Notify customer that a copy of CAF will be sent to email
- **Next step:** Activity comments
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “digitally signed "KARTHIKK 18:09:2025 12:21:01"”

**WF-311** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Comment "Test123 FWA Outdoor"
- **Output:** Order created, Order Number 1-29728035948
- **Next step:** Technician inventory loading
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Postpaid completed successfully. Order Number:- '1-29728035948'”

**WF-312** (step 9) `Explicit` · confidence: `high`
- **Actor:** Back-office/inventory admin
- **Input:** Excel VFQ Inventory Loading rows (5G Indoor/Outdoor CPE, SIM serials)
- **Output:** Resource Inventory Import: Created 3, Updated 0, Deleted 0, Failed 0
- **Validation:** Get Quantity: Success; Import Status: Success
- **Next step:** Technician assignment (Move)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Import Status: Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0.”

**WF-313** (step 10) `Explicit` · confidence: `high`
- **Actor:** Dispatcher/supervisor (OFSC)
- **Input:** Move dialog resource candidates
- **Output:** Technician Syed Irfan assigned
- **Validation:** Work zones/skills mismatch flags shown for other candidates
- **Next step:** Inventory transfer
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent selects Syed Irfan and clicks Move.”

**WF-314** (step 11) `Explicit` · confidence: `high`
- **Actor:** Dispatcher/supervisor (OFSC)
- **Input:** Non-Serialized Inventory Transfer of 3 parts (indoor CPE, outdoor CPE, SIM)
- **Output:** Inventory transfer has been completed
- **Validation:** Total Items: 3, Current Owner ABATS -> Transfer To Syed Irfan
- **Next step:** Technician route activation
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Inventory transfer has been completed. Closing the plugin screen...”

**WF-315** (step 12) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Activate route prompt
- **Output:** Route activated, Start button available
- **Next step:** Start activity
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Activate route" prompt: "Activate route now?" → Submit. Route status button changes to "Start".”

**WF-316** (step 13) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Get geolocation
- **Output:** Activity started, timer running
- **Next step:** Assess Activity (Kahramaa check)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Get geolocation" button, map preview shown...Submit.”

**WF-317** (step 14) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** Kahrama ID check
- **Output:** No previous records found in last 30 days
- **Validation:** Duplicate/recent installation check
- **Next step:** Serial Number Check - Dual Play
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “No previous records are found based on Kahrama ID in last 30 days.”

**WF-318** (step 15) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan)
- **Input:** CPE Indoor, CPE Outdoor, SIM Card serials
- **Output:** Sending activation request; Service Activation Status: Success
- **Validation:** All serials validated (green checks)
- **Next step:** Installation Checklist
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Service Activation Status: Success, note "Please perform 'Install Inventory (SNC)'".”

**WF-319** (step 16) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan) + customer
- **Input:** Speed test, Wi-Fi SSID, VLAN screenshots, customer briefing checkboxes, customer signature
- **Output:** Installation Checklist submitted (Forms Submitted)
- **Next step:** End Activity
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Installation Checklist — Forms Submitted...Customer Signature captured”

**WF-320** (step 17) `Explicit` · confidence: `high`
- **Actor:** Field technician (Syed Irfan) + customer
- **Input:** Activity Remarks, Customer Available, Customer Signature, Next Activity
- **Output:** Activity ended
- **Next step:** Order verification (backend)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Activity Type Installation, Name ABUBAKAR NAZIR...Submit.”

**WF-321** (step 18) `Explicit` · confidence: `high`
- **Actor:** System/back office
- **Input:** Completed WFM activity
- **Output:** Sales Order Status Complete, all line items Complete, installed assets Active, data buckets live
- **Validation:** Status Context: All order lines are completed
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Order 1-29728035948 now Status Complete, Fulfillment Status Complete...All order lines are completed”

## UJ-069: MNP Postpaid – Open UI Desktop (Ooredoo to Vodafone port-in, Postpaid U Start) (18 steps)

**WF-537** (step 1) `Explicit` · confidence: `high`
- **Actor:** Admin/Team Leader (Hemanth Kumar)
- **Input:** User ID, Responsibility selection
- **Output:** Agent assigned VFQA Sales responsibility (plus Back Office Onshore, VFQ Base 2)
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Administration – User > All Person Administration: agent shown with Responsibility field set to 'VFQA Sales'”

**WF-538** (step 2) `Explicit` · confidence: `high`
- **Actor:** Admin
- **Input:** Product Promotion 'Postpaid U Start Promotion', Bill Limit Mapping grid
- **Output:** Agent Min Value 50 configured on Bill Limit Mobile SL
- **Business rule:** Agent Min Value guardrail on Bill Limit Mobile promotion
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill Limit Mobile: Agent Min Value 50 (being edited, highlighted)”

**WF-539** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Click MNP tile on Home page
- **Output:** 'Guided Process' screen with 'Choose process' panel
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking MNP opens the 'Guided Process' screen with a 'Choose process' panel containing a single button: Switch as Postpaid”

**WF-540** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 29035654458
- **Output:** Contact details confirmed (Nationality, Gender, DOB, etc.)
- **Validation:** Green check confirms ID validity
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “1. Contact accordion: Please insert or scan the customer's Qatari Id ... After Go, the section expands to 'Please confirm the contact details below'”

**WF-541** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, Preferred Language, Alt phone #, attachments
- **Output:** Contact step saved
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Email nobill@vfq.com (required, green check), Preferred Language English (required, green check), Alt. phone # 97412341234”

**WF-542** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Zone 13, Street No. 45, Building No. 345, Apt/Flat/Unit H7882
- **Output:** Address saved
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “2. Address expanded ... Save Address clicked (form filled, ready to save)”

**WF-543** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Billing account grid
- **Output:** Billing profile confirmed (1-D87EQYB, Postpaid)
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “3. Billing: Postpaid expanded: a billing-account grid row ... Name 1-D87EQYB”

**WF-544** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702400000026363
- **Output:** SIM Serial validated (green check)
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “4. SIM Serial: Please enter or scan the SIM Serial number below. Field SIM Serial = 8942702400000026363, green check”

**WF-545** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan search 'U', select Postpaid U Start Promotion
- **Output:** Plan detail modal opened (Smart Limit 20, Credit Limit 1000)
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking Add on Postpaid U Start Promotion opens a detail modal: Smart Limit: 20”

**WF-546** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Smart Limit = 28
- **Output:** Rejected
- **Validation:** Bill Limit can not be set lower than Agent Minimum 50
- **Business rule:** Agent Min Value guardrail (=50 for Bill Limit Mobile)
- **Next step:** 11
- **Exception flow:** Red banner error shown, value rejected
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent types 28 into the Smart Limit input and clicks Go → validation message appears: 'Bill Limit can not be set lower than Agent Minimum 50'”

**WF-547** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Smart Limit = 67
- **Output:** Accepted, Smart Limit set to 67
- **Validation:** ≥ Agent Min Value 50
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent retries with 67 in the Smart Limit field (now valid, ≥ 50). Modal now shows 'Smart Limit: 67' (accepted)”

**WF-548** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Port-in Number 97466000666, Donor ID 893093, Donor ID Type Passport
- **Output:** Donor Details saved; Donor Operator=Qtel, Subscription Type=Postpaid
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “6. Donor Details expanded: Please enter donor details below. Fields: Port-in Number 97466000666 ... Donor Operator = Qtel”

**WF-549** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click 'MNP Form' > select MNP-Digital
- **Output:** Mobile Number Portability Application Form generated (bilingual)
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking 'MNP Form' opens a dropdown with two options: MNP-Digital and MNP-Touch Screen. Selecting MNP-Digital opens the Mobile Number Portability Application Form”

**WF-550** (step 14) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Signature capture pad
- **Output:** Signature captured, timestamped 'HEMANTH 2025-21-4 12:9:45'
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “A signature capture pad ('Please Sign') shown ... Done / Clear Signature buttons”

**WF-551** (step 15) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Signature Done clicked
- **Output:** Browser alert with porting instruction
- **Next step:** 16
- **Exception flow:** Advise customer to send switch to 151. 'SMS costs 1Dhs'
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “clicking Done triggers a browser alert dialog: '10.162.53.100:4443 says — Advise customer to send switch to 151. SMS costs 1Dhs'”

**WF-552** (step 16) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click CAF > select CAF-Digital
- **Output:** Vodafone Customer Application Form generated
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Clicking 'CAF' opens a dropdown with three options: CAF-Digital, CAF-Manual, CAF-Touch Screen”

**WF-553** (step 17) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** CAF form fields, Smart Limit 67 confirmed
- **Output:** CAF signed via Sign Contract
- **Next step:** 18
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Section 2 – Billing information: Account credit limit 1000, Smart Limit 67 ... Sign Contract / Close and Retry buttons”

**WF-554** (step 18) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Submission of completed journey
- **Output:** Siebel Sales Order 1-28920871362 created, Status Pending, Order Type Activation, Sub Type Port-In
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “the resulting Siebel Sales Order (Order # 1-28920871362), ... Order Type Activation, Order Sub Type Port-In, Status Pending”

## UJ-046: New Fixed Line Activation – Desktop, Back Office Fulfilment Agent (Triple Play, attachments skipped) (17 steps)

**WF-253** (step 1) `Explicit` · confidence: `high`
- **Actor:** Back Office Fulfilment agent (Hemanth Kumar)
- **Input:** User ID search
- **Output:** Agent record confirmed (Responsibility Back Office Fulfilment)
- **Next step:** Confirm Responsibilities dialog
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Persons list search by User ID "Hemanth"; record for Last Name "Kumar"...Responsibility "Back Office Fulfilment"”

**WF-254** (step 2) `Explicit` · confidence: `high`
- **Actor:** Back Office Fulfilment agent
- **Input:** Responsibilities dialog selection
- **Output:** Responsibility confirmed via OK
- **Next step:** Land on Siebel Web Call Center Home page
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Selected list on the right shows "Back Office Fu…" (checked/primary) and "VFQ Base 2"...Confirmed with OK”

**WF-255** (step 3) `Explicit` · confidence: `high`
- **Actor:** Back Office Fulfilment agent
- **Input:** Home page navigation
- **Output:** Agent selects New Fixed Line tile
- **Next step:** Step 1 Contact - enter Kahramaa/Qatari ID
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “New Fixed Line (cursor hovering here, tooltip "New Fixed Line")”

**WF-256** (step 4) `Explicit` · confidence: `high`
- **Actor:** Back Office Fulfilment agent
- **Input:** Kahramaa ID 16P6061, Qatari ID 29035654458
- **Output:** Contact lookup submitted
- **Next step:** Contact confirmation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Please enter Kahramaa & Qatari Id:" — Kahramaa ID = 16P6061 ... Qatari ID = 29035654458”

**WF-257** (step 5) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** Contact lookup result
- **Output:** Contact fields auto-populated (read-only) and editable fields filled
- **Next step:** Fixed Line IPTV popup (billing email)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “contact details auto-populate (read-only/greyed) ... Get IPTV? = Yes, Email = nobill2@vfq.com”

**WF-258** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Billing email preference
- **Output:** IDM created, billing email confirmed
- **Next step:** Attachments (skipped) → Continue
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a popup titled "Fixed Line IPTV" appears with info banner "IDM Created Successfully"”

**WF-259** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Attachments section (skipped)
- **Output:** Contact step completed without upload
- **Next step:** Step 2 Address
- **Exception flow:** Attachment upload optional/skippable per this walkthrough's scope
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “this step was skipped without uploading any attachment; the wizard proceeds via "Continue"”

**WF-260** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address grid, Kahramaa ID 16P6061
- **Output:** Primary address selected; Service Point 16P6061_004 shown Available
- **Next step:** Step 3 Plan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “row with Kahramaa Id 16P6061 (Zip 11274) is checked as Primary”

**WF-261** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan catalog
- **Output:** GigaHome Classic 300 TB -F Promotion selected and confirmed
- **Next step:** Step 4 Addon & Discount
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Selecting "GigaHome Classic 300 TB -F Promotion" opens a detail confirmation panel...Confirmed via "Continue"”

**WF-262** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Plan-based add-ons
- **Output:** IPTV Add-ons and Discount auto-populated and confirmed
- **Next step:** Step 5 Number Selection
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Auto-populated IPTV Add-ons ... Confirmed via "Continue" → step badge changes to "Saved!"”

**WF-263** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Free number list
- **Output:** Number reserved, final 97441224317
- **Next step:** Step 6 Book Appointment
- **Exception flow:** Mid-flow number swap observed: transitional header showed 97441202039 before final 97441224317
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Continue" finalizes the number as 97441224317”

**WF-264** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Cluster, date, time slot
- **Output:** Appointment booking submitted
- **Next step:** Appointment confirmed
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “On Submit, a browser confirm dialog appears”

**WF-265** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Appointment booking
- **Output:** Appointment Number 1-26921281993, Appointment ID 113242
- **Next step:** Step 7 CAF
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a success alert: "Appointment has been successfully booked...Appointment ID is 113242."”

**WF-266** (step 14) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF Attachments section (skipped)
- **Output:** Order submitted, Order Number 1-26921279847
- **Next step:** Post-completion Account Orders view
- **Exception flow:** CAF attachment upload skipped per this walkthrough's stated scope
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “success dialog: "Fixed Line completed successfully. Order Number:- '1-26921279847'"”

**WF-267** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Completed order
- **Output:** Account Orders view shows new order alongside historical orders
- **Next step:** Order detail header review
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Orders tab lists the new order 1-26921279847 (Type Sales Order, Status Open)”

**WF-268** (step 16) `Explicit` · confidence: `high`
- **Actor:** System (backend)
- **Input:** Order detail
- **Output:** Order header: Order Type Activation, Sub Type Triple Play, Fulfillment Status In Progress
- **Next step:** Line Items review
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Order Type "Activation", Order Sub Type "Triple Play", Status "Open"”

**WF-269** (step 17) `Explicit` · confidence: `high`
- **Actor:** System (backend / WFM)
- **Input:** Order line items
- **Output:** 13 hierarchical line items with fulfillment/billing/WFM status context
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Status Context: FULFILL BILLING START: reached / INITIATE BILLING START: reached / INITIATE WFM START: reached”

## UJ-045: Cross Sales to New Fixed Line Activation – Desktop (Dual Play, targeted campaign offer) (17 steps)

**WF-368** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Desktop, Cross Sales module)
- **Input:** Customer's Qatari ID (scan or manual entry)
- **Output:** Customer identified
- **Next step:** Contact confirmation + Connection Details popup
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"Please insert or scan the customer's Qatari Id:" field accepts Qatari ID 28335628851”

**WF-369** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** QID
- **Output:** Read-only identity fields populated; Connection Details popup shown
- **Next step:** Dismiss popup, confirm contact
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “A popup shows Total Number of Prepaid Connections: 0, Total Number of Postpaid Connections: 1”

**WF-370** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Contact confirmation
- **Output:** Contact section confirmed
- **Next step:** View QID Offers grid
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Contact section confirmed after dismissing the popup”

**WF-371** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Targeted campaign offer (CampaignCode 000001247)
- **Output:** Offer accepted
- **Next step:** Redirect into New Fixed Line journey
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a single targeted campaign offer: CampaignCode 000001247, OfferName "New Gigahome Testahil plan"... Status Offered. Agent clicks Accept”

**WF-372** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent / System
- **Input:** Accepted offer; carried-over QID; new Kahramaa ID
- **Output:** Contact re-confirmed with Fixed-Line-specific fields
- **Next step:** Address step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “the QID carries over automatically and is greyed out/read-only; Agent enters Kahramaa ID 16A3005 and clicks Go”

**WF-373** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Kahramaa-linked address
- **Output:** Address selected; existing ONT service point shown
- **Next step:** Plan step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Address step: Kahramaa-linked address table (Primary checkbox) plus a Service Points grid”

**WF-374** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Accepted campaign offer
- **Output:** Locked/read-only 'GigaHome Testaahel Promotion' plan applied
- **Business rule:** Cross-sell orders auto-apply the plan tied to the accepted campaign offer; agent has no plan-selection control
- **Next step:** Addon & Discount step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a locked/read-only "GigaHome Testaahel Promotion" card ... the journey auto-applies the plan tied to the accepted offer”

**WF-375** (step 8) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Accepted offer discount terms
- **Output:** Read-only discount shown; no editable add-on control
- **Business rule:** Agent cannot add extra discounts/add-ons on a cross-sell order
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “only a read-only Discount field ... no editable add-on control, confirming the agent cannot add extra discounts/add-ons on a cross-sell order”

**WF-376** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Free 8-digit fixed-line number list
- **Output:** Number reserved (41224901 / MSISDN 97441224901)
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “after Reserve, the confirmed reserved number is 41224901 (final MSISDN 97441224901)”

**WF-377** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Cluster, calendar date, time slot, booking comments, Collect QID/CAF/FNP options
- **Output:** Appointment booking request submitted
- **Next step:** Confirm booking warning dialog
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Book Appointment modal: Cluster field, calendar (April 13, 2026 selected), time-slot toggle”

**WF-378** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Booking confirmation
- **Output:** Appointment booked, Appointment ID 121379
- **Next step:** Appointment fetched
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"WARNING: Appointment once booked cannot be cancelled..." → OK → "Appointment has been successfully booked...Appointment ID is 121379"”

**WF-379** (step 12) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Booked appointment
- **Output:** Appointment table shows Appointment Number 1-29793918853, Status pending
- **Next step:** Order validation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Appointment fetched: results table shows Appointment Number 1-29793918853”

**WF-380** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order data
- **Output:** Order validated
- **Next step:** CAF step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Order validation: inline "Validating the order... Please Wait..."”

**WF-381** (step 14) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF PDF attachment
- **Output:** CAF attached; order submission started
- **Next step:** Activity step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “an attached document "Vodafone caf sample.pdf" ... clicking Continue triggers "Submitting the Order... Please Wait..."”

**WF-382** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments ("CROSS SALES TESTING")
- **Output:** Order completed, Order Number 1-29793912388
- **Next step:** Sales Order created (Order Type Activation, Sub Type Dual Play)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"Fixed Line completed successfully. Order Number:- '1-29793912388'"”

**WF-383** (step 16) `Explicit` · confidence: `high`
- **Actor:** System (backend)
- **Input:** Submitted order
- **Output:** Sales Order header created: Order Type Activation, Sub Type Dual Play, Fulfillment Status In Progress, RFS Status RFS
- **Next step:** Line items generated, awaiting WFM installation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Resulting Sales Order header: Order # 1-29793912388, Order Type Activation, Order Sub Type Dual Play, Status Open, Fulfillment Status In Progress”

**WF-384** (step 17) `Explicit` · confidence: `high`
- **Actor:** System (backend / WFM)
- **Input:** Order line items
- **Output:** 9 line items generated; INITIATE WFM START: reached
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Status Context values like "FULFILL BILLING COMPLETE: reached" and "INITIATE WFM START: reached"”

## UJ-070: MNP Tablet Postpaid – HRN (Nepalese, Passport ID) with Add-on (16 steps)

**WF-568** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (HALEEMI HALEEMI)
- **Input:** Account BIJAY MAHATO context, Pre-approved value edit
- **Output:** Account Summary reviewed
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Account Summary view for account BIJAY MAHATO ... field 'Pre-approved (Expatriate/Qatari)' being edited to value 1,500”

**WF-569** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click MNP Tablet tile
- **Output:** 'Choose process' panel: Switch as Postpaid / Switch as Prepaid
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Panel titled 'Choose process' with two buttons: Switch as Postpaid and Switch as Prepaid”

**WF-570** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 28952431523
- **Output:** Contact confirmed (Nationality Nepalese, DOB, etc.), Connection Details modal shown
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field Qatari ID = 28952431523 with a green check mark ... 'Connection Details' modal overlays the form”

**WF-571** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email auto-filled, No Email checkbox, Language, Alt. phone #, ID photos
- **Output:** Contact step continued
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Email field auto-filled with noemailid@vodafone.com ... checkbox 'No Email' ticked ... Alt. phone # = 97412341234”

**WF-572** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address fields left blank
- **Output:** Address skipped
- **Next step:** 6
- **Exception flow:** Address step skipped (Skip Address button used)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Fields: Zone, Street No., Building No., Apt/Flat/Unit — all left blank ... address was skipped in this run”

**WF-573** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702400000026214
- **Output:** SIM Serial validated
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field SIM Serial = 8942702400000026214 with green check”

**WF-574** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select Postpaid Extra Promotion
- **Output:** Plan detail popup: Bill Limit 20, Credit Limit 50, confirmed with checkmark
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Modal shows plan name Postpaid Extra Promotion, Bill Limit: 20 ... Credit Limit: 50 ... Confirmed with a green checkmark icon”

**WF-575** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'International 50' from Mass Market Addons checklist
- **Output:** Add-on selected (QR50.00)
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “International 50 — checked (QR50.00)”

**WF-576** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Addon & Discount summary review
- **Output:** Paid Add-ons: 200 Local Minutes for 6 Months, International 50; Discount: QR20 Discount for 6 Months, 31GB for 6 Months
- **Business rule:** Go back to Plan step and edit limit to cover for the add-on amount
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Info banner: 'Go back to Plan step and edit limit to cover for the add-on amount.'”

**WF-577** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Port-in Number 97466667890, Donor ID BV7383 (Passport)
- **Output:** Donor Details saved, Donor Operator=Qtel, Subscription Type=Postpaid
- **Validation:** Note: Make sure correct information is provided to avoid rejection of request.
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Warning banner: 'Note: Make sure correct information is provided to avoid rejection of request.' Fields: Port-in Number = 97466667890”

**WF-578** (step 11) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** MNP Application Form displayed, e-signature
- **Output:** MNP T&C document signed, timestamped 'HALEEMI 04/08/2026 11:22:48'
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “a captured signature image in the 'Applicant's signature' box, and timestamp 'HALEEMI 04/08/2026 11:22:48'”

**WF-579** (step 12) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** CAF form fields, e-signature
- **Output:** CAF signed, timestamped 'HALEEMI 04/08/2026 11:23:55'
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Signature box shows the captured signature and timestamp 'HALEEMI 04/08/2026 11:23:55'”

**WF-580** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF continue clicked
- **Output:** Instruction popup shown
- **Next step:** 14
- **Exception flow:** Advise customer to send switch to 151 'SMS costs 1Dhs'
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “A small dialog appears: 'Advise customer to send switch to 151 SMS costs 1Dhs' with an Ok button”

**WF-581** (step 14) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments = 'Phoenix Sprint 67 testing'
- **Output:** Activity comment saved
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “typed text 'Phoenix Sprint 67 testing' and an OK button”

**WF-582** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click 'Save and Finish'
- **Output:** Order Number 1-29822004764 created, MNP completed successfully
- **Next step:** 16
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “'MNP completed successfully. Order Number:- 1-29822004764' with a Finish Process button”

**WF-583** (step 16) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order created
- **Output:** Sales Order 1-29822004764: Order Type Activation, Sub Type Port-In, Status Open, 14 line items including International 50 add-on and Mobile Port-In
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “showing 14 line items ... 2.11 International 50 (row highlighted/selected, Status Open, In Progress), 2.12 Mobile Port-In”

## UJ-067: Home Move Fixed-to-Fixed Happy Path (Desktop) (15 steps)

**WF-009** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** KID (destination location identifier)
- **Output:** Fiber-readiness confirmation popup
- **Validation:** Location entered is Fiber-ready
- **Next step:** Enter Fixed Number
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Enter the KID the user is moving to and click Go; system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"”

**WF-010** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Fixed Number
- **Output:** Number confirmed
- **Next step:** Contact Portal
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “enter the Fixed Number and click Go”

**WF-011** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Contact Portal details
- **Output:** Contact details entered
- **Next step:** Address verification
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “enter details in Contact Portal and click Continue”

**WF-012** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Address verification
- **Output:** Address confirmed; if first-time Home Move, customer flagged eligible for Free Home Move
- **Business rule:** eligible for Free Home move
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “verify Address information and click Continue; if first-time Home Move, customer is flagged "eligible for Free Home move"”

**WF-013** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Cluster selection, appointment slot
- **Output:** Appointment booked successfully
- **Validation:** Warning popup on submit acknowledged
- **Next step:** Activity Portal
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Book Appointment — select Cluster, book slot, click Submit; warning popup on submit, click Ok; appointment booking successful”

**WF-014** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Comments (>5 characters)
- **Output:** Order created (Order ID), status Open in Siebel
- **Validation:** Comments field should have more than 5 characters
- **Business rule:** comments >5 characters
- **Next step:** WFM login/search
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “note states "Comments field should have more than 5 characters"; click Save and Finish; success popup with Order ID”

**WF-015** (step 7) `Explicit` · confidence: `high`
- **Actor:** Supervisor/dispatcher (WFM)
- **Input:** Appointment ID search
- **Output:** Activity detail retrieved; ONT device details verified in UIM
- **Next step:** Technician assignment (Move)
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Login to WFM; search by Appointment ID to retrieve activity detail; verify ONT device details in UIM (assigned/unassigned)”

**WF-016** (step 8) `Explicit` · confidence: `high`
- **Actor:** Supervisor/dispatcher (WFM)
- **Input:** Technician selection
- **Output:** Technician assigned (Move)
- **Next step:** Inventory transfer
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Move to assign technician; select technician and click Move”

**WF-017** (step 9) `Explicit` · confidence: `high`
- **Actor:** Supervisor/dispatcher (WFM)
- **Input:** ONT device transfer to technician
- **Output:** Inventory transfer completed
- **Validation:** popup confirms inventory transfer completed
- **Next step:** Technician route activation
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Inventory Transfer from Supervisor to assigned technician...enter ONT device details and click Add To Transfer List; go to Transfer List and click Start Transfer; popup confirms inventory transfer completed”

**WF-018** (step 10) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Activate Route, Start
- **Output:** Route activated, activity started
- **Next step:** Get geolocation
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “login as Technician user in WFM, activity assigned, click Activate Route; click Submit; click Start”

**WF-019** (step 11) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Get geolocation
- **Output:** Location captured
- **Next step:** Assess Activity
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Get geolocation and Submit”

**WF-020** (step 12) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Assess Activity check
- **Output:** KID eligibility for Home Move confirmed
- **Validation:** validation popup checks whether KID is eligible for Home Move
- **Next step:** Serial Number Check
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

**WF-021** (step 13) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** ONT device details entry
- **Output:** Service Activation Details: Success
- **Next step:** Home Move Checklist
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Serial Number Check; enter ONT details and Submit; "Service Activation Details: Success"”

**WF-022** (step 14) `Explicit` · confidence: `high`
- **Actor:** Field technician + customer
- **Input:** Home Move Checklist completion
- **Output:** Checklist submitted
- **Next step:** End Activity
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “select Home Move Checklist, complete and submit”

**WF-023** (step 15) `Explicit` · confidence: `high`
- **Actor:** Field technician + customer
- **Input:** Signature capture, End + Submit
- **Output:** Order Complete
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “"End" option appears; click End and Submit (with signature capture); Order Complete.”

## UJ-050: New Fixed Line Tablet – Prepatched KID, Non Combo Box, Normal Activation (Agent sales flow) (15 steps)

**WF-397** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Kahramaa ID 16P6003
- **Output:** KID lookup response confirms Prepatched status, ONT ALCLF11C1516 available
- **Next step:** ID capture
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “<PatchingType>Prepatched</PatchingType>, <KIDStatus>Available</KIDStatus>, <ONT>ALCLF11C1516</ONT>”

**WF-398** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ID Type Qatari ID, ID Number 28060820901
- **Output:** Pre-existing 'refused service' warning shown; agent proceeds; ID validated
- **Next step:** Confirm contact details
- **Exception flow:** Warning is informational, not blocking — agent proceeds anyway
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “the UI displays a warning: "Customer already refused the service."”

**WF-399** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** ID lookup
- **Output:** Contact details auto-populated
- **Next step:** Communication preferences & ID uploads
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Nationality = Filipino, Gender = F, First name = SALLY, Last name = ENCUNADO”

**WF-400** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Get IPTV, email, language, alt phone, ID uploads
- **Output:** Contact step completed
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Two required uploads both shown green/verified: Qatari ID-Front* and Qatari ID-Back*”

**WF-401** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Address grid
- **Output:** Address selected; Service Points shows single dwelling ONT ALCLF11C1516
- **Next step:** Plan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “a Service Points grid lists two service points at that Kahramaa ID”

**WF-402** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan catalog
- **Output:** GigaHome 5Gbps Promotion selected/confirmed
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “GigaHome 5Gbps Promotion (selected — highlighted red, "Add" clicked)”

**WF-403** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Add-on/discount step
- **Output:** No add-ons applicable; Continue clicked
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Agent clicks Continue without adding any (none applicable for this order) / Skip also available”

**WF-404** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Free number 41224278
- **Output:** Number reserved, Reservation Token 15332436
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"SUCCESS:Reservation Token:15332436(SBL-EXL-00151)"”

**WF-405** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Calendar date, Collect QID/CAF, FNP, time slot
- **Output:** Appointment booking submitted
- **Next step:** Booking warning confirmation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Collect QID = Yes, Collect CAF = Yes, FNP Identifier = No”

**WF-406** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Booking confirm dialog
- **Output:** Appointment booked, Appointment ID 14243, Appointment Number 1-29795234605
- **Validation:** WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment
- **Next step:** CAF generation
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Appointment has been successfully booked... Appointment ID is 14243”

**WF-407** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Contact, billing, plan data
- **Output:** Bilingual CAF PDF generated (Sections 1, 2, 3 blank, 4)
- **Next step:** E-signature capture
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Section 3 – For Postpaid Customers ... left blank — not applicable to this fixed-line-only order”

**WF-408** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent (capturing signature)
- **Input:** Signature pad
- **Output:** CAF signed, stamped HALEEMI 02/08/2026 12:18:32
- **Next step:** CAF & Additional Attachments step
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “the captured Signature with signer name/timestamp "HALEEMI 02/08/2026 12:18:32"”

**WF-409** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF tile
- **Output:** CAF completed/signed
- **Next step:** Activity/Comments
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “step "7. CAF & Additional Attachments" shows the generated CAF tile with a green check”

**WF-410** (step 14) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments "Test1234456"
- **Output:** Order ready to finish
- **Next step:** Order completion
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “step "8. Activity": a "Comments" popup with free text Test1234456 entered”

**WF-411** (step 15) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Save And Finish
- **Output:** Order completed, Order Number 1-29795232313
- **Next step:** Order visible in Pending Approval queue
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Fixed Line completed successfully. Order Number:- '1-29795232313'"”

## UJ-053: Fixed Line Tablet New Connection - Prepatched KID/Combo Box/Instant Activation (Consumer) (15 steps)

**WF-413** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (tablet, Open UI)
- **Input:** Kahramaa ID 16P6109
- **Output:** Contact/Kahramaa lookup result
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Field "Please enter Kahramaa & Contact ID:" with "Kahramaa ID" = 16P6109”

**WF-414** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Kahramaa ID lookup result
- **Output:** Combo Box CPE/ONT detection dialog
- **Validation:** system detects prepatched device serials at premises
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681...Proceed with Instant Activation?"”

**WF-415** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** detection dialog
- **Output:** Instant Activation selected
- **Next step:** 4
- **Exception flow:** agent could instead choose Normal Activation (see sibling scenario)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two buttons: Instant Activation (highlighted/red, selected in this walkthrough) and Normal Activation”

**WF-416** (step 4) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Qatari ID scan 27579200746
- **Output:** Contact profile auto-populated (ID expiry, nationality, gender, name, DOB)
- **Validation:** green checkmark validation
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “ID Type dropdown set to Qatari ID, ID Number 27579200746 with barcode-scan icon and green checkmark”

**WF-417** (step 5) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Get IPTV, Email, Alt. phone #, Qatari ID Front/Back photos
- **Output:** Contact step completed
- **Validation:** required Get IPTV field, email/phone validation, photo uploads validated
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two required uploaded-photo placeholders both show green checkmarks: "Qatari ID-Front" and "Qatari ID-Back". Buttons: Continue, Search again, Cancel”

**WF-418** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Kahramaa ID / contact
- **Output:** Address step: saved addresses + Service Points table showing pre-registered ONT device
- **Validation:** confirms ONT device DeviceID ALCLF11E0681 already registered at service point
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Service Points grid ... Device Type ONT, DeviceID ALCLF11E0681”

**WF-419** (step 7) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Plan catalog
- **Output:** GigaHome 5Gbps Promotion selected
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Plan tile grid: GigaHome 5Gbps Promotion (selected, highlighted red)...”

**WF-420** (step 8) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Addon & Discount step
- **Output:** No add-on/discount selected, skipped
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “note "if there are no applicable add-on or discount, the selector will be empty," and Continue/Skip/Cancel/Go back buttons”

**WF-421** (step 9) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Number Selection grid
- **Output:** Number 41224273 reserved
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “the same step shows a single reserved number tile: 41224273, QR0.00”

**WF-422** (step 10) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order in progress
- **Output:** CAF generated with applicant/billing/service sections
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “A bilingual (Arabic/English) "Vodafone Customer Application Form" opens, Date 3-Feb-2026, Retailer ID 1234”

**WF-423** (step 11) `Explicit` · confidence: `high`
- **Actor:** Field agent/customer
- **Input:** Signature pad
- **Output:** CAF signed
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “printed line "VINODHINIR 02/03/2026 14:33:27"”

**WF-424** (step 12) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** CAF & Additional Attachments step
- **Output:** CAF tile completed (green check)
- **Validation:** CAF required
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Step "7. CAF & Additional Attachments" expanded shows a "CAF" tile with a green checkmark/required asterisk (completed)”

**WF-425** (step 13) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Activity comment
- **Output:** Order finalized via Save and Finish
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Comments popup/modal open with free text TESTING PURPOSE typed in...Save and Finish button”

**WF-426** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Save and Finish action
- **Output:** Order 1-29792357564 created, Status Open
- **Next step:** 15
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Fixed Line completed successfully. Setup and test at customer location.. Order Number:- '1-29792357564'"”

**WF-427** (step 15) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order fulfillment (no technician visit)
- **Output:** Order Status Complete within ~4 minutes
- **Validation:** Status Context: All order lines are completed
- **Business rule:** Instant Activation bypasses technician dispatch
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Status now Complete, and the detail pane shows Completion Date 2/3/2026 02:37:38 PM”

## UJ-083: New Postpaid HRN Customer Credit Limit with Manager Approval (Open UI Tablet) (15 steps)

**WF-715** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (HALEEMI HALEEMI)
- **Input:** Home screen, click Mobile Postpaid, select New Postpaid
- **Output:** Wizard 'New Postpaid - Contact' opens with 6+ accordion steps
- **Next step:** Contact ID entry
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Clicking it opens a Guided Process 'Choose process' screen with two options: New Postpaid and Prepaid to Postpaid. Agent selects New Postpaid.”

**WF-716** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 28658600923, click Go
- **Output:** Contact record auto-populates (Nationality Pakistani); Connection Details popup: 0 prepaid, 0 postpaid
- **Next step:** Complete Contact fields
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Qatari ID field = 28658600923... contact record auto-populates: ID Expiry 3/16/2027, Nationality Pakistani”

**WF-717** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, Language, Alt phone, ID photos
- **Output:** Contact step complete
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Email = noemailid@vodafone.com (required...). Language = English. Alt. phone # = 97412341234. Qatari ID-Front and Qatari ID-Back images captured”

**WF-718** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address fields (later populated test89)
- **Output:** Address saved, Plan step 'Pending' badge cleared
- **Next step:** Plan selection
- **Exception flow:** Skip Address / Go back / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Zone, Street No., Building No., Apt/Flat/Unit fields — shown blank... (later populated to 'Zone test89...')”

**WF-719** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'New Plus Essential Pakistan BIA Promotion'
- **Output:** Plan detail popup: Bill Limit 65, Credit Limit 50
- **Business rule:** Credit Limit default derived from account/customer profile
- **Next step:** Addon & Discount
- **Exception flow:** Cancel / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Agent selects 'New Plus Essential Pakistan BIA Promotion'. A detail popup shows: Bill Limit: 65... Credit Limit: 50”

**WF-720** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Plan/Addon steps completed
- **Output:** Underlying Sales Order 1-29811647643 created, Status Pending, Credit Limit 50
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “A separate tab shows the underlying Siebel Sales Order 1-29811647643... Status Pending... Credit Limit 50”

**WF-721** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select number 79029813, click Reserve
- **Output:** SUCCESS:Reservation Token:15557466(SBL-EXL-00151); MSISDN 97479029813
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Browser alert: 'SUCCESS:Reservation Token:15557466(SBL-EXL-00151)' with OK button.”

**WF-722** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702800801190302
- **Output:** Steps 3-5 Saved!
- **Next step:** CAF generation
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “SIM Serial = 8942702800801190302. Continue / Cancel / Go Back.”

**WF-723** (step 9) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF generation
- **Output:** Bilingual CAF preview with Account credit limit 50, Smart Limit 65
- **Next step:** Signature capture
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Section 2 – Billing information: Account credit limit 50; Smart Limit 65”

**WF-724** (step 10) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Signature pad
- **Output:** Signature captured, embedded with timestamp 'HALEEMI 03/16/2026 13:09:27'
- **Next step:** CAF & Additional Attachments saved
- **Exception flow:** Clear Signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “'Please Sign' modal pad appears; a signature is drawn... embedded into the CAF's Section 3 signature box.”

**WF-725** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments 'Test1234', Save And Finish
- **Output:** 'Your activation request order number: 1-29811647643 is submitted for approval...'
- **Business rule:** HRN Customer/Credit Limit variant routes to manager approval
- **Next step:** Manager assigns and reviews order
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Final confirmation dialog: 'Your activation request order number: 1-29811647643 is submitted for approval...' This is the defining characteristic of the HRN Customer/Credit Limit variant”

**WF-726** (step 12) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager / MANAGETEST)
- **Input:** TM SR Queue View, Assign To Me
- **Output:** Order moves to My Activities, Owner MANAGETEST, Activity Status Assigned
- **Next step:** Review Order Approval detail
- **Exception flow:** ReAssign To Queue
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “After assignment, 'My Activities' tab shows the same order with Activity Status 'Assigned', Owner MANAGETEST”

**WF-727** (step 13) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Review Attachments (QatarIdFront, QatarIdBack, CAF) and Order Details tab
- **Output:** Order Expiry 19/03/2026 01:37:02 PM confirmed
- **Business rule:** 3-day approval SLA window
- **Next step:** Click Approve
- **Exception flow:** Reject - Correction / Reject - Drop Order / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Order # 1-29811647643, Order Expiry 19/03/2026 01:37:02 PM. Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back.”

**WF-728** (step 14) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Click Approve, Comments 'Approved', Submit
- **Output:** Order Status: Open, Fulfillment Status: In Progress
- **Validation:** Approve confirmation text: 'By clicking submit,I agree that I have verified all the documents and details to proceed with submission.'
- **Next step:** Fulfillment completes
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Manager clicks Approve, opening an 'Approve Order' dialog... manager types 'Approved'.”

**WF-729** (step 15) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Fulfillment processing
- **Output:** Sales Order Status: Complete, Fulfillment Status: Complete, all 11 line items Complete
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “The Sales Order record now shows Status: Complete, Fulfillment Status: Complete, Status Context: 'All order lines are completed'”

## UJ-104: J011 Mobile Post-Paid Customer Onboarding (Day 2 re-presentation, DXP) (15 steps)

**WF-905** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Customer / Agent (DXP)
- **Input:** Customer request in QNomy
- **Output:** QTicket generated
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “QTicket generation”

**WF-906** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** ID type
- **Output:** Branch: QID -> MOI Validation; Other ID/Passport -> capture/validate details
- **Business rule:** ID type branching
- **Next step:** 3
- **Exception flow:** Other ID/Passport path requires manual capture/validate of details instead of automated MOI Validation
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID type branching (QID -> MOI Validation; Other ID/Passport -> capture/validate details)”

**WF-907** (step 3) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Customer contact/address details
- **Output:** Contact/address captured
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “contact/address capture”

**WF-908** (step 4) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Base plan, add-on, number, device selections
- **Output:** Cart populated
- **Business rule:** plan display logic tied to ID type
- **Next step:** 5
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “cart browsing (base plan, add-on, number, device), plan display logic tied to ID type”

**WF-909** (step 5) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Bill profile data
- **Output:** Bill profile captured
- **Next step:** 6
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “bill profile capture”

**WF-910** (step 6) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** SIM/MSISDN selection
- **Output:** SIM/MSISDN added
- **Next step:** 7
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM/MSISDN addition”

**WF-911** (step 7) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Number type choice
- **Output:** Branch: Normal Number vs Star Number
- **Next step:** 8
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “number type branch (Normal vs Star Number)”

**WF-912** (step 8) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Add-on choice
- **Output:** Branch: Non-Telco Add-On vs Telco Add-On
- **Next step:** 9
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “add-on branch (Non-Telco vs Telco Add-On)”

**WF-913** (step 9) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Payment type choice
- **Output:** Branch: Full Payment vs DOI
- **Next step:** 10
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment branch (Full Payment vs DOI)”

**WF-914** (step 10) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Cart, customer, plan data
- **Output:** CAF generated, checked out, submitted
- **Next step:** 11
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “CAF generation/checkout/submission”

**WF-915** (step 11) `Explicit` · confidence: `medium`
- **Actor:** Customer
- **Input:** CAF document
- **Output:** CAF signed off
- **Next step:** 12
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “CAF sign-off”

**WF-916** (step 12) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Payment via WinCash
- **Output:** Receipt generated
- **Next step:** 13
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment capture via WinCash with receipt”

**WF-917** (step 13) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Customer ID document
- **Output:** ID scan captured
- **Next step:** 14
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID scan”

**WF-918** (step 14) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Order/customer data
- **Output:** Unica Campaign reference recorded
- **Next step:** 15
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Unica Campaign reference”

**WF-919** (step 15) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP) / Customer
- **Input:** SIM handover choice
- **Output:** eSIM provisioned or Physical SIM handed over/delivered
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM handover options (eSIM, Physical SIM handover/deliver)”

## UJ-060: FWA Indoor Open UI Desktop Guided-Wizard Postpaid Activation (Existing Mobile Customer) (14 steps)

**WF-114** (step 1) `Explicit` · confidence: `high`
- **Actor:** CRM agent (KARTHIKK)
- **Input:** Home screen
- **Output:** New FWA tile clicked
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “the agent clicks the New FWA tile in the main menu grid”

**WF-115** (step 2) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Qatari ID 27652419981
- **Output:** Contact auto-populated, Connection Details popup shown
- **Validation:** ID validated (green check)
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “enters Qatari ID 27652419981, validated (green check)...A "Connection Details" popup appears automatically”

**WF-116** (step 3) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Digital Lead/Sale, Email, Language, Alt phone#, attachment upload
- **Output:** Contact step completed
- **Validation:** advance payment banner shown (HRN)
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “An informational banner appears: "(HRN) Customer needs to pay advance payment of QR 100."”

**WF-117** (step 4) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Zone/Street/Building/Apt/Area
- **Output:** Address saved
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Fields: Zone = 123, Street No. = 123, Building No. = 123, Apt/Flat/Unit = 123P, Area = Al Rayyan”

**WF-118** (step 5) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Plan tile grid
- **Output:** GigaHome 5G Classic New Indoor FWA Promotion added
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Agent clicks Add on "GigaHome 5G Classic New Indoor FWA Promotion."”

**WF-119** (step 6) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Addon & Discount
- **Output:** pre-listed discount '100% Discount for 2 Months -FWA' carried, no add-on selected
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “The plan's included discount is pre-listed: "100% Discount for 2 Months -FWA."”

**WF-120** (step 7) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Numbers tab, Block+Reserve
- **Output:** Number 97441202302 reserved
- **Validation:** SUCCESS:Reservation Token:13907377(SBL-EXL-00151)
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A browser alert confirms: "SUCCESS:Reservation Token:13907377(SBL-EXL-00151)"”

**WF-121** (step 8) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** SIM Serial, CPE Serial Number
- **Output:** SIM/CPE entered and validated
- **Validation:** both fields green-checked
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “SIM Serial = 8942702800801190302 (validated), CPE Serial Number = S180P18055027 (validated)”

**WF-122** (step 9) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Book Appointment step
- **Output:** step marked Saved without an actual appointment scheduled
- **Validation:** final CAF shows Appointment Details blank
- **Next step:** 10
- **Exception flow:** no installation appointment actually booked in this run
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “no separate detail screen for booking captured in this walkthrough — in the final signed CAF, the appointment section reads "Appointment ID: Appointment Date: -"”

**WF-123** (step 10) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** CAF dropdown (CAF-Digital/Manual/Touch Screen)
- **Output:** CAF generated with applicant/billing/postpaid/FWA sections
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Selecting a CAF option generates a bilingual..."Vodafone Customer Application Form" PDF”

**WF-124** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent/customer
- **Input:** Sign Contract, signature pad
- **Output:** CAF signed, customer notification alert shown
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “a browser alert states: "Notify customer that a copy of the CAF will be sent to his registered email address."”

**WF-125** (step 12) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** order submission
- **Output:** Popup: Advise customer to send switch to 151; order submitting
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A popup instructs: "Advise customer to send switch to 151" (OK button). Page then shows "Submitting Order. Please wait..."”

**WF-126** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** order processing
- **Output:** Order 1-29729896060 Status Complete, all 9 line items Complete
- **Validation:** Status Context: All order lines are completed
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Order # 1-29729896060...Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed"”

**WF-127** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** post-activation
- **Output:** Installed Assets Active, SIM State ACTIVE, data buckets provisioned
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Account → Installed Assets...confirms all new FWA components are Active...SIMState ACTIVE...Surepay Bucket Details confirm data provisioning”

## UJ-049: Fixed Line Tablet Normal Activation (Combo Box) - Order Rejection & Correction (14 steps)

**WF-236** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (HALEEMI)
- **Input:** Kahramaa ID 16P6109
- **Output:** ComboBox device detection dialog
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Dialog text...Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?”

**WF-237** (step 2) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** detection dialog
- **Output:** Normal Activation selected
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “The agent chooses Normal Activation (consistent with the journey/file name and confirmed later by the free-text comment "Combo box data - Normal Activation")”

**WF-238** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Contact fields, ID upload
- **Output:** Contact step completed
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Get IPTV?* = Yes, Email*...both required upload tiles Qatari ID-Front* / Qatari ID-Back*”

**WF-239** (step 4) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Plan catalog
- **Output:** GigaHome 5Gbps Promotion selected
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “GigaHome 5Gbps Promotion (selected/highlighted)”

**WF-240** (step 5) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Addon & Discount / IPTV Add-on
- **Output:** skipped
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “IPTV Add-ons list shown: OSN TV Main, OSNTV Premium Pack Free, IPTV Email Id and Mobile No.”

**WF-241** (step 6) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Number Selection
- **Output:** Number 41224335 reserved
- **Validation:** reservation token confirmation SBL-EXL-00151
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"SUCCESS:Reservation Token:15332434(SBL-EXL-00151)"”

**WF-242** (step 7) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Book Appointment modal
- **Output:** Appointment 1-29795178277 booked, Feb 9 2026, 8AM-11AM
- **Validation:** warning: appointment cannot be cancelled once booked
- **Business rule:** Normal Activation requires technician appointment (unlike Instant Activation)
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Appointment has been successfully booked...Appointment ID is 14241"”

**WF-243** (step 8) `Explicit` · confidence: `high`
- **Actor:** Field agent/customer
- **Input:** CAF preview + signature
- **Output:** CAF signed, stamped HALEEMI 02/08/2026 10:43:18
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “the signed CAF preview then shows the signature image plus caption "HALEEMI 02/08/2026 10:43:18"”

**WF-244** (step 9) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Activity comment 'Combo box data - Normal Activation'
- **Output:** Order 1-29795175561 created, status Pending/Submitted for Approval
- **Business rule:** With Approval variant requires manager review
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Fixed Line completed successfully. Order Number:- '1-29795175561'"”

**WF-245** (step 10) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Order Activities Queue
- **Output:** Order assigned to manager
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “same order 1-29795175561 now shows Activity Status: Assigned”

**WF-246** (step 11) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Reject - Correction action, reason 'ID image not clear', comment
- **Output:** Order rejected
- **Next step:** 12
- **Exception flow:** alternative actions: Approve, Reject - Drop Order
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “the manager clicks Reject - Correction and picks a reject reason..."ID image not clear"...Comments box is filled with "Phoenix Sprint 66 test"”

**WF-247** (step 12) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** rejection event
- **Output:** SMS sent to agent instructing correction
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

**WF-248** (step 13) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Order Correction tile, cleared ID images
- **Output:** ID Front/Back re-uploaded
- **Business rule:** rejection reason 'ID image not clear' clears the previously-uploaded images
- **Next step:** 14
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “now-empty Qatari ID-Front / Qatari ID-Back upload placeholders...the agent must re-upload valid ID images”

**WF-249** (step 14) `Explicit` · confidence: `high`
- **Actor:** System/back-office
- **Input:** corrected order
- **Output:** Order shows Status Open, Approved unticked (still in progress)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “full order record for 1-29795175561...Status Open...Approved checkbox unticked”

## UJ-080: New Postpaid for HRN Customer with Credit Limit Edit (Open UI Desktop) (14 steps)

**WF-667** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (KARTHIKK KARTHIKK)
- **Input:** Home page, hover 'Consumer Postpaid' tile
- **Output:** Guided Process 'Choose process' screen with 4 options
- **Next step:** Select Consumer Postpaid
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Four options: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid.”

**WF-668** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 27652419981, ID type Qatari ID
- **Output:** Go clicked; loading
- **Next step:** Contact confirmation with HRN flag
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Agent enters 'Please enter the customer's Qatari ID or Passport number': ID number 27652419981, ID type Qatari ID, clicks Go.”

**WF-669** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Qatari ID lookup returns Nationality Nepalese
- **Output:** Connection Details popup: 1 existing postpaid connection; HRN advance payment banner shown
- **Validation:** HRN nationality flag triggers advance payment requirement
- **Business rule:** HRN Customer needs to pay advance payment of QR 100
- **Next step:** Continue past modal
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'(HRN) Customer needs to pay advance payment of QR 100.'”

**WF-670** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Digital Lead/Sale=No, Email, Language, Alt phone#
- **Output:** Contact step complete
- **Next step:** Address step
- **Exception flow:** Search again / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Continuing scrolls the same Contact step to show Digital Lead/Sale = No, Email noemailid@vodafone.com, Language English (verified), Alt. phone # 97412345123 (verified).”

**WF-671** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Zone, Street No., Building No., Apt/Flat/Unit (blank allowed)
- **Output:** Address saved; Account step 3 shows 129818367221 — Saved!
- **Next step:** Billing step
- **Exception flow:** Skip Address / Cancel / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Blank fields Zone, Street No., Building No., Apt/Flat/Unit. Buttons: Save Address, Skip Address, Cancel, Go Back.”

**WF-672** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Existing billing profile 1-DP533F2
- **Output:** Billing step shows existing profile (Payment Type Postpaid, Payment Method Invoice, Bill Media Email)
- **Next step:** Number Selection
- **Exception flow:** Continue / Cancel / Go Back
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “An existing billing profile row is shown: Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email, Name '1-DP533F2.'”

**WF-673** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select number, click Reserve
- **Output:** SUCCESS:Reservation Token:15632489(SBL-EXL-00151); number 97479025456 reserved
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “a JS confirm alert reads: 'SUCCESS:Reservation Token:15632489(SBL-EXL-00151)'”

**WF-674** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702400000026205
- **Output:** SIM Serial verified, step 6 Saved!
- **Next step:** Plan (Product Catalog)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “SIM Serial entered: 8942702400000026205 (verified).”

**WF-675** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'Postpaid Red 350 Promotion' plan, click Add
- **Output:** Plan detail panel opens showing Credit Limit:800 and Edit Credit Limit button
- **Business rule:** Credit Limit defaults from account's Pre-approved value
- **Next step:** Edit Credit Limit
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Clicking 'Add' on Postpaid Red 350 Promotion opens a detail panel... 'Credit Limit:800' — matches the account's pre-approved default”

**WF-676** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 1000 from Edit Credit Limit dropdown, click Go
- **Output:** Panel updates to 'Credit Limit:1000'
- **Next step:** Payment step
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Agent selects 1000 and clicks Go; the panel updates to 'Credit Limit:1000'”

**WF-677** (step 11) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Payment Reason='For Testing Only'
- **Output:** Payment step saved; no advance-payment line captured in Upfront & Deposit grid
- **Business rule:** HRN advance payment of QR 100 (not visually confirmed as captured)
- **Next step:** CAF generation
- **Exception flow:** HRN QR100 advance payment sub-step occurs off-screen or via uncaptured control (inferred gap)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'Upfront & Deposit' grid... is empty in this walkthrough — no advance payment line was actually entered on screen despite the earlier HRN QR 100 advance-payment notice”

**WF-678** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF split-button (CAF-Digital/CAF-Manual/CAF-Touch Screen)
- **Output:** Bilingual CAF generated with Account credit limit 1000
- **Next step:** Sign Contract
- **Exception flow:** Close and Retry
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “A 'CAF' split-button offers CAF-Digital, CAF-Manual, CAF-Touch Screen... Section 2 – Billing information: Account credit limit 1000”

**WF-679** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Sign Contract
- **Output:** Sales Order 1-29819206680 created, Status Pending, Credit Limit 1,000
- **Next step:** Account record update
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “New tab (incognito), Order # 1-29819206680, Revision 1, Type Sales Order... Status Pending... Credit Limit: 1,000 (highlighted field)”

**WF-680** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order submission
- **Output:** Account 'Pre-approved (Expatriate/Qatari)' field updated from 800 to 1,000, persisting the credit-limit override
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Account YAM POKHAREL now shows the 'Pre-approved (Expatriate/Qatari)' field value updated from 800 to 1,000, confirming the credit-limit override made during the journey persisted back to the account record.”

## UJ-082: New Postpaid B2B2C Without Approval (Open UI Tablet) (14 steps)

**WF-701** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Home dashboard, select Mobile Postpaid tile
- **Output:** Choose process screen: New Postpaid / Prepaid to Postpaid
- **Next step:** Select New Postpaid
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Guided Process' screen: 'Choose process' with two options — New Postpaid and Prepaid to Postpaid. Agent selects New Postpaid.”

**WF-702** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 27652419981
- **Output:** Connection Details modal: 0 prepaid, 0 postpaid connections
- **Next step:** Company selection
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Connection Details' popup shows 'Total Number of Prepaid Connections: 0' and 'Total Number of Postpaid Connections: 0'”

**WF-703** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Company Name dropdown, select 'VFQA_Test_Mav_NCM_CORE29'
- **Output:** B2B2C linkage established
- **Next step:** Complete remaining Contact fields
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Company 'VFQA_Test_Mav_NCM_CORE29' selected. Digital Lead/Sale = No.”

**WF-704** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, Language, Alt phone, ID photos
- **Output:** Contact step complete
- **Next step:** Address (Skip Address used)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Email = 'noemailid@vodafone.com' with 'No Email' checked; Language = English; Alt. phone # = 97412341234”

**WF-705** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Skip Address button
- **Output:** Address step skipped
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Fields Zone, Street No., Building No., Apt/Flat/Unit are shown empty/optional in this walkthrough. Buttons: 'Save Address' / 'Skip Address'”

**WF-706** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'Postpaid U Start Promotion', click Add
- **Output:** Plan detail: Bill Limit 20, Credit Limit 1000
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Postpaid U Start Promotion' detail: Bill Limit: 20 (Edit Bill Limit button...), Credit Limit: 1000”

**WF-707** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Addon & Discount step, no add-ons/discounts selected
- **Output:** Continue clicked
- **Next step:** Number Selection
- **Exception flow:** Skip add-on & discount
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Select applicable benefits, add-ons and discounts based on customer's plan.' ... Agent skips/continues with no add-ons or discounts applied.”

**WF-708** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select number 79027268 from Free Number tab, Reserve
- **Output:** SUCCESS:Reservation Token:13832431(SBL-EXL-00151)
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “On reservation, a system alert fires verbatim: 'SUCCESS:Reservation Token:13832431(SBL-EXL-00151)'”

**WF-709** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702400000026741
- **Output:** Steps 3,4,5 Saved!
- **Next step:** CAF generation and signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “SIM Serial = 8942702400000026741, validated.”

**WF-710** (step 10) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** CAF generated, signature captured
- **Output:** CAF signed and stamped 'HEMANTH 09/15/2025 11:50:06'
- **Next step:** CAF & Additional Attachments
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Signature block shows a signature with the caption 'HEMANTH 09/15/2025 11:50:06'”

**WF-711** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Attempt Continue without Proof of Employment
- **Output:** Error banner: 'Error: Please select Proof of Employment before continuing.'
- **Validation:** Proof of Employment hard-required for B2B2C
- **Next step:** Attach Proof of Employment file
- **Exception flow:** blocked until Proof of Employment attached
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Error banner: 'Error: Please select Proof of Employment before continuing.'”

**WF-712** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Attach Proof of Employment file
- **Output:** Both Proof of Employment and CAF tiles show green checkmarks
- **Next step:** Activity step
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Both 'Proof of Employment' and 'CAF' tiles now show green checkmarks”

**WF-713** (step 13) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments 'B2B2C TEST123', Save and Finish
- **Output:** 'Postpaid completed successfully. Order Number:- '1-29726606734''
- **Business rule:** No approval routing for this B2B2C variant
- **Next step:** Order reaches Complete immediately
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “System modal reads verbatim: 'Postpaid completed successfully. Order Number:- '1-29726606734'' ... The order completes in a single step immediately after 'Save and Finish' — no intermediate approval/hold screen appears.”

**WF-714** (step 14) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order completion
- **Output:** Order Status Complete, Fulfillment Status Complete, Approved checkbox unchecked, no Hold
- **Business rule:** 'Without Approval' means order completes without any approver sign-off
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Status: Complete, Fulfillment Status: Complete, Status Context: 'All order lines are completed', Approved checkbox: unchecked, Approved By: blank, Hold: unchecked”

## UJ-054: Fixed Line Tablet New Connection - Prepatched KID/ComboBox/B2B2C/With Approval/Instant Activation (13 steps)

**WF-428** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (tablet, HALEEMI)
- **Input:** Existing Account YAM POKHAREL, Contact record
- **Output:** Agent navigates to New Fixed Line Tablet tile
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Agent selects the "New Fixed Line Tablet" tile from a grid”

**WF-429** (step 2) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Kahramaa ID 16P6109
- **Output:** ComboBox CPE/ONT detection dialog
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “System shows a device-detection dialog...Agent selects Instant Activation”

**WF-430** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Company Name (B2B2C) dropdown
- **Output:** Company 'SIPT' selected as B2B2C sponsor
- **Business rule:** B2B2C requires employer/company link
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Company Name B2B2C dropdown: agent selects "SIPT"”

**WF-431** (step 4) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Address/Service Points
- **Output:** Address confirmed, ONT service point matched
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Service Points table shows Service Point 16P6109_ON..., Device Type ONT, DeviceID ALCLF11E0681”

**WF-432** (step 5) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Plan catalog
- **Output:** GigaHome 5Gbps Promotion added
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Agent adds GigaHome 5Gbps Promotion”

**WF-433** (step 6) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Number Selection
- **Output:** Number 41224334 reserved
- **Validation:** reservation token confirmation
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “System confirms: "SUCCESS:Reservation Token:15332433(SBL-EXL-00151)"”

**WF-434** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Steps 4-6 saved
- **Output:** CAF auto-generated (bilingual, applicant/billing/postpaid sections)
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 CAF & Additional Attachments opens automatically, presenting a live preview of the Vodafone Customer Application Form”

**WF-435** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent/customer
- **Input:** Signature pad
- **Output:** CAF signed, stamped HALEEMI 02/08/2026 09:50:31
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “the captured signature stamped "HALEEMI 02/08/2026 09:50:31"”

**WF-436** (step 9) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Proof of Employment + CAF uploads
- **Output:** Attachments step completed
- **Validation:** both required, green-checked before Continue enabled
- **Business rule:** B2B2C requires Proof of Employment
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 requires Proof of Employment* (required, B2B2C-specific), CAF*...”

**WF-437** (step 10) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Activity comment
- **Output:** Order 1-29795149137 created, routed to approval
- **Business rule:** B2B2C With Approval requires manager sign-off
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Fixed Line completed successfully...Order Number:- '1-29795149137'"”

**WF-438** (step 11) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Order Activities Queue
- **Output:** Order assigned to manager
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Manager clicks "Assign To Me"”

**WF-439** (step 12) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Attachments/Order Details/Agent Details review
- **Output:** Order approved with comment
- **Validation:** manager verifies documents
- **Next step:** 13
- **Exception flow:** manager could Reject - Correction or Reject - Drop Order instead
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Manager clicks Approve → "Approve Order" modal...Comments entered: "B2B2C - Zero Touch - Approved"”

**WF-440** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Approval action
- **Output:** Order Status Pending → Open → Complete
- **Validation:** Status Context: All order lines are completed
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Order Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed"”

## UJ-062: FWA Indoor B2B2C New Sale with Manager Approval (Tablet, Open UI) (13 steps)

**WF-468** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Qatari ID 27752403206
- **Output:** Contact confirmed (MAN KAMI)
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “confirms/edits contact details for an existing customer: Qatari ID 27752403206...”

**WF-469** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Zone 26, Street No. 978, Building No. 128, Apt/Flat/Unit 8, Area Al Rayyan
- **Output:** Address saved and written to contact's address list
- **Validation:** Required fields enforced
- **Next step:** Plan selection
- **Exception flow:** Empty submit → "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Re-entered as Zone 26, Street No. 978, Building No. 128, Apt/Flat/Unit 8, Area "Al Rayyan" → Save Address.”

**WF-470** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Selection of GigaHome 5G Classic New Indoor FWA Promotion
- **Output:** Bundle components confirmed
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Agent clicks Add on "GigaHome 5G Classic New Indoor FWA Promotion"”

**WF-471** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Add-on/Discount selection
- **Output:** 100% Discount for 2 Months -FWA applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Default Discount shown: "100% Discount for 2 Months -FWA".”

**WF-472** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Reserved Number selection (fixed-line only)
- **Output:** 97441202301 saved
- **Validation:** Only fixed-line number surfaced, not mobile
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “only the fixed-line number (41202301 / full 97441202301) is offered”

**WF-473** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** SIM serial and CPE serial number
- **Output:** SIM 8942702800801190301 + CPE S180P18055026 validated and saved
- **Validation:** UIM checks (assigned/not free/must be 19 digits)
- **Business rule:** SBL-EXL-00151, SBL-BPR-00162
- **Next step:** Book Appointment
- **Exception flow:** "Please enter a valid SIM Serial"; "SIM Card already assigned in UIM(SBL-EXL-00151)"; "CPE Serial Number...is not free in UIM(SBL-EXL-00151)"
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Successful combination: SIM 8942702800801190301 + CPE S180P18055026 → both green-checked, Continue → validates successfully”

**WF-474** (step 7) `Inferred` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Appointment booking (not shown in detail, not required for Indoor)
- **Output:** Step collapses to Saved!
- **Next step:** CAF & Additional Attachments
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Step 7 – Book Appointment: collapses to "Saved!" (screen itself not captured in detail...)”

**WF-475** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent + customer
- **Input:** CAF data, e-signature, Proof of Employment / Supplementary Form / Additional File
- **Output:** CAF signed and all required attachments (Proof of Employment, CAF, Supplementary Form) uploaded
- **Validation:** Required attachments enforced sequentially
- **Next step:** Activity comments
- **Exception flow:** "Error: Please select Supplementary Form before continuing."; "Error: Please select Proof of Employment before continuing."
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Once all three required docs are attached, a 4th tile...also appears, all four with green checkmarks — no error, Continue enabled.”

**WF-476** (step 9) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Comment "TESTING FWA JOURNEY"
- **Output:** Order submitted for approval, Order Number 1-29727615763
- **Next step:** Manager approval queue
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Your activation request order number: 1-29727615763 is submitted for approval.”

**WF-477** (step 10) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Assign To Me on Order Activities Queue
- **Output:** Activity 1-DNN25R4 assigned to manager
- **Next step:** Review attachments/order details
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Order Activities Queue / Activities grid...Button: Assign To Me.”

**WF-478** (step 11) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Review Attachments, Order Details, Activities, Agents Details tabs
- **Output:** Documents reviewed (QatarIdFront/Back, CAF, SupplementaryForm, EmployerId, AdditionalFile1)
- **Next step:** Approval decision
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Attachments: QatarIdFront, QatarIdBack, CAF, SupplementaryForm, EmployerId, Additional File1”

**WF-479** (step 12) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Approve action + comment "APPROVED and Order submitted"
- **Output:** Activity Status Closed, Order Approval Approved
- **Validation:** Confirmation checkbox statement required
- **Business rule:** "By clicking submit,I agree that I have verified all the documents and details to proceed with submission"
- **Next step:** Order fulfillment/completion
- **Exception flow:** Alternative actions: Reject - Correction / Reject - Drop Order / Go Back
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Status "Closed", Order Approval "Approved", Owner MANA…”

**WF-480** (step 13) `Explicit` · confidence: `high`
- **Actor:** System/back office
- **Input:** Approved order
- **Output:** Order Entry Status Complete, Fulfillment Status Complete, all 9 installed assets Active, data buckets live
- **Validation:** Status Context: All order lines are completed
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Status "Complete", Fulfillment Status "Complete", Status Context "All order lines are completed"”

## UJ-069: MNP Prepaid – Open UI Tablet (Ooredoo to Vodafone Prepaid port-in) (13 steps)

**WF-555** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Bhargavi Sathiya Moorthy)
- **Input:** Click MNP Tablet, select 'Switch as Prepaid'
- **Output:** MNP Prepaid Contact step opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Clicking MNP Tablet opens 'MNP Guided Process: Choose process' with two buttons: Switch as Postpaid and Switch as Prepaid. Prepaid is selected for this walkthrough”

**WF-556** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ID Type Qatari ID, ID Number 27381804401
- **Output:** MOI Validation completed, contact details confirmed
- **Validation:** MOI Validation completed, please confirm the contact details
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Agent enters ID Number 27381804401, clicks Go — spinner 'Getting information, please wait...'. Result: blue banner 'MOI Validation completed, please confirm the contact details'”

**WF-557** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial 8942702400000027026
- **Output:** SIM Serial check and number reservation in progress
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Agent enters 8942702400000027026, green check appears, then status message 'SIM Serial check and number reservation in progress. Please wait...'”

**WF-558** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'Prepaid Red Promotion'
- **Output:** Plan confirmed with green check
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “a plan-details popup titled 'Prepaid Red Promotion' listing bundled components ... confirmed with a green check”

**WF-559** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Port-in Number 97466000534, Donor ID KJSH0934989 (Passport)
- **Output:** Donor Details saved; Donor Operator Qtel, Subscription Type Prepaid
- **Validation:** Note: Make sure correct information is provided to avoid rejection of request.
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Warning banner: 'Note: Make sure correct information is provided to avoid rejection of request.' Fields: Port-in Number 97466000534”

**WF-560** (step 6) `Explicit` · confidence: `high`
- **Actor:** System/Customer
- **Input:** MNP T&C generation
- **Output:** Mobile Number Portability Application Form generated (bilingual)
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Status message at bottom: 'MNP T&C is generating. Please wait...' ... A bilingual 'Mobile Number Portability Application Form' is generated and displayed inline”

**WF-561** (step 7) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Signature pad
- **Output:** MNP form signed
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Please Sign' modal with a signature capture pad; agent draws a signature; buttons Clear Signature and Done”

**WF-562** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Donor Attachment step, MNP T&C attached
- **Output:** Donor Attachment saved
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “the generated/signed document appears as an attachment tile labeled 'MNP T&C' with a green check ... Agent clicks Continue”

**WF-563** (step 9) `Explicit` · confidence: `high`
- **Actor:** System/Customer
- **Input:** Prepaid CAF generation, fields pre-filled
- **Output:** Prepaid Customer Application Form displayed (with 'undefined' data-binding gap in ID field)
- **Next step:** 10
- **Exception flow:** 'Valid Qatari ID/RP Number / Passport Number' shows literal value 'undefined'
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “A second bilingual form opens: 'Prepaid Customer Application Form' ... 'Valid Qatari ID/RP Number / Passport Number' shows literal value 'undefined'”

**WF-564** (step 10) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** CAF signature pad
- **Output:** CAF signed
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Second 'Please Sign' signature pad; agent signs; Done clicked”

**WF-565** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF completion
- **Output:** Instruction popup shown, CAF document tile created
- **Next step:** 12
- **Exception flow:** Advise customer to send switch to 151 'SMS costs 1Dhs'
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Step 6 CAF now shows a popup 'Advise customer to send switch to 151 SMS costs 1Dhs' with an Ok button”

**WF-566** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments = 'Testing'
- **Output:** Activity comment saved, ready for Save and Finish
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Comments' popup textbox where the agent typed 'Testing' ... Save and Finish button”

**WF-567** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Save and Finish clicked
- **Output:** Order 1-23864057846 created, Status Open
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Confirmation modal: 'MNP completed successfully. Order Number:- 1-23864057846' with a Finish Process button”

## UJ-085: Prepaid to Postpaid (Pre2Post) - Desktop Vanilla (manual, back-office Siebel, Bill Limit validation failure) (13 steps)

**WF-742** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Team Leader, Responsibility VFQA Sales)
- **Input:** Administration-User All Person Administration view
- **Output:** Confirmed operator Hemanth Kumar provisioned under VFQA Sales responsibility
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Confirm agent responsibility — Administration–User 'All Person Administration' view confirms operator Hemanth Kumar (User ID HEMANTH, Job Title Team Leader) is provisioned under Responsibility VFQA Sales.”

**WF-743** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Administration-Product > Product Promotions list
- **Output:** Selected Postpaid U Plus Promotion (target promotion)
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Product Admin — target promotion — Administration–Product > Product Promotions: Postpaid U Plus Promotion ... selected from a list of 8 postpaid promotions.”

**WF-744** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Bill Limit Mapping tab on selected promotion
- **Output:** Bill Limit Mobile (Agent Min 50) and Bill Limit Mobile Plus (Agent Min 80, default) confirmed as configured
- **Business rule:** Bill Limit Agent Minimum rule
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit Mapping tab shows two Spend Limit products: Bill Limit Mobile (Agent Min Value 50) and Bill Limit Mobile Plus (Agent Min Value 80, Default Flag checked)”

**WF-745** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer Account Summary for Sivakumar Kanniah
- **Output:** Existing Prepaid Red Promotion asset (MSISDN 97479026351) identified
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Customer Account Summary — Account for Sivakumar Kanniah ... Installed Assets shows a Prepaid Red Promotion (MSISDN 97479026351).”

**WF-746** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer Portal full account view
- **Output:** Confirmed 2 prior Pre2Post orders already Abandoned for this account
- **Next step:** 6
- **Exception flow:** Two prior Pre2Post attempts had already failed/abandoned before this walkthrough
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Orders grid shows two prior Pre2Post orders already Abandoned for this account (4/15/2025), meaning this conversion had failed before.”

**WF-747** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Right-click on Prepaid Red Promotion asset
- **Output:** Context menu with Upgrade Promotion selected
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “right-click the Prepaid Red Promotion asset opens a context menu (... Upgrade Promotion ...); agent selects 'Upgrade Promotion'.”

**WF-748** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Search '*U*Plus*' in Promotion Upgrades picker
- **Output:** Postpaid U Plus Promotion and related target promotions listed
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Promotion Upgrades picker — modal search '*U*Plus*' returns postpaid target promotions”

**WF-749** (step 8) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Selected Postpaid U Plus Promotion
- **Output:** Sales Order line items generated: Update Mobile Service Bundle, Delete Prepaid Red Promotion, Add Postpaid U Plus Promotion (MRC QR150.00)
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Sales Order Line Items: Update Mobile Service Bundle, Delete Prepaid Red Promotion, Add Postpaid U Plus Promotion (Item/Net Total MRC QR150.00).”

**WF-750** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Product configurator screen
- **Output:** Bill Limit Mobile Plus selected in radio group; VAS Plan None, Smart Tracker None, Lego Addons unchecked
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit radio group offers None / Bill Limit Mobile Plus (selected) / Bill Limit Mobile”

**WF-751** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Spend Limit Amounts fields (SL Limit Amount entered as 55)
- **Output:** Check Errors run reports 0 errors at this point
- **Validation:** Check Errors generated (0) errors
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “SL Limit Amount 55, SL Min Value .01, SL Default Value 20. A 'Check Errors' alert reports 'Check Errors generated (0) errors' at this point.”

**WF-752** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order line 1 (Mobile Service Bundle, Update) expanded
- **Output:** Line Item Attributes confirm SL Default Value=20, SL Limit Amount=55, SL Min Value=.01
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “the Line Item Attributes grid confirms SL Default Value=20, SL Limit Amount=55, SL Min Value=.01.”

**WF-753** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order #1-28855889958 header, click Validate
- **Output:** Informational alert shown: Maximum Bill Limit note
- **Validation:** Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.
- **Next step:** 13
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “On Validate, an alert reads: 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

**WF-754** (step 13) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order validation continues (Order Sub Type Pre2Post, Credit Limit 1,000)
- **Output:** Blocking validation error terminates the flow
- **Validation:** Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)
- **Business rule:** Bill Limit cannot be set lower than Agent Minimum (SBL-EXL-00151)
- **Next step:** None (terminal/blocked)
- **Exception flow:** Terminal validation failure — entered SL Limit Amount of 55 is below Agent Minimum of 80 for Bill Limit Mobile Plus
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “A blocking alert reads: 'Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)'”

## UJ-104: J011 Mobile Post-Paid Customer Onboarding Journey (Agent Assisted, DXP wireframe walkthrough) (13 steps)

**WF-892** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Arrival at store
- **Output:** QTicket generated in QNomy, received by Agent in DXP
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Customer in QNomy → Agent in DXP; QTicket generation/receipt”

**WF-893** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ID document
- **Output:** ID type branch resolved
- **Validation:** QID → MOI Validation; Other ID/Passport → capture customer details, validate address
- **Next step:** 3
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “ID type branching (QID → MOI Validation; Other ID / Passport → capture customer details, validate address)”

**WF-894** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer details
- **Output:** Contact/address captured
- **Validation:** N/A
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “contact/address capture”

**WF-895** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Product selection
- **Output:** Cart populated with base plan, add-on, number, device
- **Validation:** plan display logic: if QID Postpaid and Prepaid otherwise Prepaid Type
- **Next step:** 5
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “cart browsing (base plan, add-on, number, device); plan display logic ("if QID Postpaid and Prepaid otherwise Prepaid Type")”

**WF-896** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Billing details
- **Output:** Bill profile captured (bill address, bill cycle, bill period non-editable, bill mode)
- **Validation:** bill period is non-editable
- **Next step:** 6
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

**WF-897** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Number/SIM selection
- **Output:** SIM/MSISDN added to cart; number type branch (Normal vs Star Number) resolved
- **Validation:** N/A
- **Next step:** 7
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “SIM/MSISDN addition; number type branch (Normal vs Star Number)”

**WF-898** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Add-on selection
- **Output:** Add-on branch resolved (Non-Telco vs Telco)
- **Validation:** N/A
- **Next step:** 8
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “add-on branch (Non-Telco vs Telco)”

**WF-899** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Payment method decision
- **Output:** Payment branch resolved (Full Payment vs DOI — Device on Installment)
- **Validation:** N/A
- **Next step:** 9
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “payment branch (Full Payment vs DOI — Device on Installment)”

**WF-900** (step 9) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Cart contents
- **Output:** CAF generated, cart checked out, order submitted
- **Validation:** N/A
- **Next step:** 10
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “CAF generation, cart checkout, order submission”

**WF-901** (step 10) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** CAF document
- **Output:** CAF signed off
- **Validation:** N/A
- **Next step:** 11
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “CAF sign-off”

**WF-902** (step 11) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Payment instrument
- **Output:** Payment captured via WinCash with receipt generated
- **Validation:** N/A
- **Next step:** 12
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “payment capture via WinCash with receipt generation”

**WF-903** (step 12) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer ID document
- **Output:** ID scanned; Unica Campaign reference applied
- **Validation:** N/A
- **Next step:** 13
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “ID scan; Unica Campaign reference”

**WF-904** (step 13) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** SIM preference
- **Output:** SIM handover option selected (eSIM, Physical SIM - Handover now, Physical SIM - Deliver)
- **Validation:** N/A
- **Next step:** N/A (journey/order submission complete)
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “SIM handover options (eSIM, Physical SIM - Handover now, Physical SIM - Deliver)”

## UJ-086: Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) - Open UI Desktop, manual plan search (12 steps)

**WF-156** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account Summary page for ALLAN GRANADA
- **Output:** Confirmed existing Prepaid Red Promotion asset (MSISDN 97479025243)
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Agent is already on the customer's Account Summary page for 'ALLAN GRANADA' ... Installed Assets panel shows an existing 'Prepaid Red Promotion' asset”

**WF-157** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Home landing page app-icon grid
- **Output:** Agent launches Guided Process from Home menu
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Welcome back KARTHIKK KARTHIKK!' home menu ... This is the entry menu from which the agent launches the guided process”

**WF-158** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Guided Process '1. Choose process' screen
- **Output:** Selected 'Prepaid to Postpaid' process
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Four process buttons offered: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid. Agent selects 'Prepaid to Postpaid.'”

**WF-159** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Prepaid Number field pre-filled +974 79025243
- **Output:** Clicked Go to look up contact
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Step 1 prompts 'Please enter number:' with field 'Prepaid Number' pre-filled '+974 79025243'. Buttons: 'Go'”

**WF-160** (step 5) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** Contact confirmation form auto-populated
- **Output:** Connection Details modal shown: 1 prepaid, 1 postpaid connection
- **Next step:** 6
- **Exception flow:** info banner literally reads 'undefined' (broken/placeholder system message)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “a 'Connection Details' modal overlays showing 'Total Number of Prepaid Connections: 1', 'Total Number of Postpaid Connections: 1' ... an info banner reading literally 'undefined'”

**WF-161** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Remaining contact fields (Email, Language, Alt phone)
- **Output:** All fields validated (green checkmarks), Continue clicked
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Email: nobill@vfq.com (green checkmark = validated), Language: English, Alt. phone #: 97412341234 (green checkmark = validated)”

**WF-162** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** typed 'red' into promotion search box
- **Output:** Filtered grid of postpaid plan tiles; agent applied Postpaid Red 350 Promotion
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “A search box (typed: 'red') filters a 'Promotion Upgrades List Applet' grid of postpaid plan tiles ... Postpaid Red 350 Promotion (highlighted in red — selected)”

**WF-163** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan detail confirmation popup
- **Output:** Plan confirmed (Smart Limit 350, Credit Limit 1000), Continue clicked
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Postpaid Red 350 Promotion' detail modal (green checkmark top-right = confirmed selection)”

**WF-164** (step 9) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Selections from Contact and Plan steps
- **Output:** Bilingual CAF auto-generated with Section 1 Applicant details and Section 2 Billing information populated
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “CAF (Customer Application Form) — top ... Bilingual English/Arabic form ... Section 1 – Applicant details ... Section 2 – Billing information”

**WF-165** (step 10) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Signature pad
- **Output:** Signature captured, Done clicked
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Please Sign' modal with a hand-drawn signature already captured on the signature pad; buttons 'Done' and 'Clear Signature'”

**WF-166** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Signed CAF Section 3 - For Postpaid Customers
- **Output:** Mobile number, plan and extras confirmed on signed CAF; Section 4 (broadband) left blank
- **Next step:** 12
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Section 3 – For Postpaid Customers ... Section 4 – Superfast Broadband & Home Phone is present but entirely blank ... confirming this journey is mobile-line-only”

**WF-167** (step 12) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** CAF completion
- **Output:** Sales Order 1-28574024137 created, Order Type Plan Change, Order Sub Type Pre2Post, Status Pending, awaiting Submit
- **Next step:** None (ends at Pending, pre-Submit)
- **Exception flow:** Old Prepaid Red Promotion asset still present/active at this point; conversion completes via order fulfillment, not instant swap
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “New browser tab 'Line Items: 1-28574024137'. Order screen: ... Order Type: Plan Change, Order Sub Type: Pre2Post, Status: Pending ... sits in Pending status awaiting Submit.”

## UJ-047: New Fixed Line Triple Play – Desktop Project Lusail (IPTV Yes) (12 steps)

**WF-385** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Login credentials
- **Output:** Login to Open UI Desktop, initiate New Fixed Line guided journey
- **Next step:** Enter KID/QID
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Login and initiate New Fixed Line desktop guided journey”

**WF-386** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** KID, QID
- **Output:** Contact step opened
- **Next step:** Select Get IPTV Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Enter KID, QID and click Go; Contact Step”

**WF-387** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Get IPTV selection, contact details, attachment
- **Output:** Contact confirmed, IPTV Yes selected, attachment uploaded
- **Next step:** Select Address
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “select "Get IPTV Yes", update details, upload attachment, click Continue”

**WF-388** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address selection
- **Output:** Address confirmed
- **Next step:** Add Plan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “select Address and click Continue”

**WF-389** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Plan selection
- **Output:** Plan added
- **Next step:** Reserve number
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Add Plan and click Continue”

**WF-390** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Number selection
- **Output:** Number reserved
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Reserve number”

**WF-391** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Cluster, date, comments, slot
- **Output:** Appointment booked successfully
- **Next step:** Select CAF
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Book Appointment (select Cluster, pick date, add comments, pick slot, submit); appointment booking successful”

**WF-392** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CAF, signature
- **Output:** Contract signed
- **Next step:** Add Activity Comments
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “select CAF; Sign Contract with signature capture”

**WF-393** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Activity comments
- **Output:** Order finished
- **Next step:** Order screen review
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “add Activity Comments; Save and Finish; Finish Process”

**WF-394** (step 10) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Completed order
- **Output:** Order screen shows Contact Number & Email ID in Line Items Attributes, Order in Open Status
- **Next step:** WFM Process
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Order screen shows Contact Number & Email ID in Line Items Attributes, Activity Comments, Order in Open Status”

**WF-395** (step 11) `Inferred` · confidence: `medium`
- **Actor:** System (WFM)
- **Input:** Order
- **Output:** WFM Process (detail not recovered — captions did not survive extraction)
- **Next step:** Serial Number Check
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “WFM Process section follows with several unlabeled screenshots (captions did not survive extraction)”

**WF-396** (step 12) `Explicit` · confidence: `medium`
- **Actor:** Agent/Technician
- **Input:** Installed device serial number
- **Output:** Serial number check performed (Triple Play)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “Final captioned step: "Serial Number Check Triple Play"”

## UJ-062: FWA Indoor New Sale With Approval (Tablet, Open UI) (12 steps)

**WF-481** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent Hemanth Kumar (tablet)
- **Input:** Qatari ID 28035650506
- **Output:** Contact SELBATH JAMALUDEEN confirmed + Connection Details popup showing 2 existing postpaid connections
- **Validation:** Advisory triggers on 2+ postpaid connections
- **Business rule:** Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Total Number of Postpaid Connections: 2...Note - Customer already has 2 or more Post-paid connections...”

**WF-482** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Zone 12, Street No. 13, Building No. 14, Apt/Flat/Unit 15DD, Area Al Khor
- **Output:** Address saved
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Zone: 12, Street No.: 13, Building No.: 14, Apt/Flat/Unit: 15DD, Area: Al Khor”

**WF-483** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Selection of GigaHome 5G Classic New Indoor FWA Promotion
- **Output:** Bundle components confirmed
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Selected: GigaHome 5G Classic New Indoor FWA Promotion”

**WF-484** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Addon/Discount
- **Output:** 100% Discount for 2 Months -FWA applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Discount shown: "100% Discount for 2 Months -FWA"”

**WF-485** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Number selection 97441202297
- **Output:** Number reserved and saved
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Number Selection: 97441202297 – Saved!”

**WF-486** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** SIM serial 8942702800801190297 / CPE serial S180P18055022
- **Output:** SIM/CPE validated and saved
- **Validation:** Multiple UIM validation checks
- **Business rule:** SBL-EXL-00151, SBL-BPR-00162
- **Next step:** CAF signing
- **Exception flow:** "SIM Card does not exist in UIM"; "Error: SIM Serial # must be 19 digits."; "SIM Card already assigned in UIM"; "CPE Serial Number...is not free in UIM...Reference # 1-DNODWJU"
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “SIM Serial 8942702800801190297 (green check) / CPE Serial Number S180P18055022 entered, Continue button now active.”

**WF-487** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent + customer
- **Input:** CAF data, e-signature, CAF + Supplementary Form attachments
- **Output:** CAF signed, both documents uploaded
- **Validation:** Required attachment enforcement
- **Next step:** Activity comments
- **Exception flow:** "Error: Please select Supplementary Form before continuing."
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Both CAF and Supplementary Form tiles now show green checkmarks; Add File still available.”

**WF-488** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Comment "Test12345"
- **Output:** Order submitted for approval, Order Number 1-29721641460
- **Next step:** Manager review
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Your activation request order number: 1-29721641460 is submitted for approval.”

**WF-489** (step 9) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** TM SR Queue View, Assign To Me
- **Output:** Order 1-29721641460 assigned to manager for review
- **Next step:** Attachment/order review
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Activity # 1-DNJHYSZ, Order # 1-29721641460...Order Approval Status "Submitted for Approval"”

**WF-490** (step 10) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Review attachments (Qatari ID front/back, CAF, Supplementary Form)
- **Output:** Documents verified via viewer
- **Next step:** Approval decision
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Attachment viewer – Qatari ID front...CAF document...confirming the manager can open and review the actual signed CAF PDF”

**WF-491** (step 11) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Approve + comment "Approved"
- **Output:** Order Approval Approved, Activity Closed
- **Validation:** Confirmation dialog required
- **Business rule:** By clicking submit, I agree that I have verified all the documents and details to proceed with submission
- **Next step:** Order fulfillment
- **Exception flow:** Reject - Correction / Reject - Drop Order alternative paths; rejection example: "ID image not clear"
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Status Closed, Order Approval Approved, Owner MANA[GER]”

**WF-492** (step 12) `Explicit` · confidence: `high`
- **Actor:** System/back office
- **Input:** Approved order
- **Output:** Order Complete, Fulfillment Status Complete, FWA line items Active, data buckets live
- **Validation:** Status Context: All order lines are completed
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Status Complete, Fulfillment Status Complete...FMS Service Bundle...all Status Active”

## UJ-084: New Postpaid NON_B2B2C With Approval (Open UI Tablet, existing Special Management account) (12 steps)

**WF-730** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (VINODHINIR VINODHINIR)
- **Input:** Home screen, Mobile Postpaid tile, Choose process → New Postpaid
- **Output:** Wizard opens
- **Next step:** Contact ID capture
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “a 'Choose process' panel offers two buttons: 'New Postpaid' and 'Prepaid to Postpaid.' Agent selects New Postpaid.”

**WF-731** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Qatari ID 27652419981, click Go
- **Output:** Connection Details modal shows 3 existing postpaid connections with credit-policy warning
- **Validation:** Customer already has 2 or more Post-paid connections warning
- **Business rule:** credit policy / credit control approval rule for 2+ postpaid connections
- **Next step:** Company Name field / B2B2C decision
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Total Number of Postpaid Connections: 3'... 'Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding'”

**WF-732** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Company Name field, select 'TestVQW'
- **Output:** Company field populated
- **Next step:** Remaining contact fields, photo capture
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “agent types/selects 'TestVQW' from a list that also shows '01 newfreedcn01_Test' and '01 querybar01'.”

**WF-733** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Email, Language, Alt phone, ID photos captured
- **Output:** Contact fields ready; native confirm dialog fires
- **Next step:** B2B2C override confirm
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Email field defaulted to 'noemailid@vodafone.com'... Two green-checked photo-upload placeholder icons appear”

**WF-734** (step 5) `Explicit` · confidence: `high`
- **Actor:** System / Agent
- **Input:** Account already has Special Management value ('CBU Test')
- **Output:** Confirm dialog: 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C'
- **Business rule:** Special Management flag on account forces this branch decision
- **Next step:** Agent clicks OK to continue as non-B2B2C consumer sale
- **Exception flow:** Cancel (would presumably route to B2B2C path instead, not shown)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “A native browser confirm dialog... 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C' with OK and Cancel buttons.”

**WF-735** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address fields (empty/optional)
- **Output:** Address step passed
- **Next step:** Plan selection
- **Exception flow:** Save Address / Skip Address / Go back / Cancel
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Fields Zone, Street No., Building No., Apt/Flat/Unit are shown empty/optional in this walkthrough.”

**WF-736** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Select 'Postpaid Legacy Red 250 Promotion'
- **Output:** Plan detail: Bill Limit 250, Credit Limit 1000
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Postpaid Legacy Red 250 Promotion' — Bill Limit: 250... Credit Limit: 1000”

**WF-737** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Addon & Discount step, no extra add-ons/discounts added
- **Output:** Continue clicked
- **Next step:** Number Selection and SIM Serial
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Agent clicks 'Continue' without adding extra paid add-ons/discounts beyond what's bundled in the plan.”

**WF-738** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Reserve number, enter SIM Serial 8942702400000026861
- **Output:** Number Selection: 97479027895 Saved!, SIM Serial confirmed
- **Next step:** CAF generation and signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Step 5 now reads 'Number Selection: 97479027895 — Saved!'. Step 6 SIM Serial filled with 8942702400000026861”

**WF-739** (step 10) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** CAF generated, signature captured
- **Output:** CAF signed, stamped 'VINODHINIR 08/18/2025 16:04:07'
- **Next step:** CAF & Additional Attachments saved
- **Exception flow:** Clear Signature
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “The Section 3 signature block is now filled with the captured signature and stamped 'VINODHINIR 08/18/2025 16:04:07.'”

**WF-740** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Comments 'Test12345', Save And Finish
- **Output:** Sales Order 1-29712772155 created, Status Pending, Approved unchecked, Approved By blank
- **Business rule:** Order awaits approval given existing Special Management flag and 3+ postpaid connections
- **Next step:** Awaiting approval (no approver action shown in this document)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Order # 1-29712772155... Status: Pending... Approved checkbox unchecked, Approved By blank”

**WF-741** (step 12) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Order created
- **Output:** Account record shows Special Management 'CBU Test'; Orders grid lists 7 total orders for account
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “The customer's Account page... shows Special Management: 'CBU Test'... Orders grid at the bottom lists 7 orders total for this account/site”

## UJ-089: New Prepaid Connection - Open UI Tablet (Contact to Order, Passport ID customer) (12 steps)

**WF-793** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Home screen, 'New Prepaid Tablet' icon
- **Output:** Agent launches New Prepaid Tablet journey
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “A tooltip 'New Prepaid Tablet' is shown hovering over the journey's folder icon, indicating the entry point being clicked.”

**WF-794** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** ID Type = Passport, ID Number = SG1972
- **Output:** ID validated (green-checked), Go clicked
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Fields: ID Type = Passport, ID Number = SG1972, both green-checked (validated). Buttons: Go, Search again (disabled/greyed), Cancel.”

**WF-795** (step 3) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** ID lookup
- **Output:** Contact fields auto-populated; Connection Details modal shows 0 prepaid/0 postpaid connections
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “A modal dialog 'Connection Details' pops up showing 'Total Number of Prepaid Connections: 0' and 'Total Number of Postpaid Connections: 0'”

**WF-796** (step 4) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Email, Language, Alt phone fields; ID-Front/Back capture
- **Output:** All fields validated (green-checked); passport images captured
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Email = nobill@vfq.com, Language = English, Alt. phone # = 97412341234. Two document capture tiles 'ID-Front' and 'ID-Back' both show green checkmarks”

**WF-797** (step 5) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Step 2 Plan search
- **Output:** Selected 'Prepaid Red Promotion' via Add button
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Step '2. Plan' expands with prompt 'Please Select a Plan.' ... Prepaid Red Promotion (selected — highlighted with red border)”

**WF-798** (step 6) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Step 3 Number Selection, Free Number tab
- **Output:** Number 40204489 selected (candidate); final saved MSISDN differs (97479025359)
- **Next step:** 7
- **Exception flow:** Discrepancy: number shown as reserved (40204489) doesn't match number saved/used later (97479025359); no intermediate reconciliation step captured
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “One number card shown and selected: 40204489, priced QR0.00 ... the finally-assigned/reserved MSISDN is 97479025359, differing from the 40204489 shown as a candidate”

**WF-799** (step 7) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Step 4 SIM Serial field
- **Output:** SIM Serial 8942702400000025359 entered/scanned, validated
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'4. SIM Serial' expands: 'Please enter or scan the SIM Serial number below.' SIM Serial = 8942702400000025359, green-checked”

**WF-800** (step 8) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Steps 1-4 completed
- **Output:** Bilingual Prepaid CAF auto-generated with header, applicant details, T&C consent, mandatory document list
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “The system auto-generates a bilingual (Arabic/English) 'Prepaid Customer Application Form' ... 'Documents to be attached (Mandatory): A clear copy of Qatar ID or Passport & Visa copy / GCC ID'”

**WF-801** (step 9) `Explicit` · confidence: `medium`
- **Actor:** Customer/Agent
- **Input:** Signature pad modal
- **Output:** Signature drawn, Done clicked
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “A 'Please Sign' dialog with a blank signature pad on which a signature has already been drawn; buttons 'Clear Signature' and 'Done'.”

**WF-802** (step 10) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Signature captured
- **Output:** CAF signed field shows captured signature with agent name/timestamp 'HEMANTH 09/01/2025 15:57:17'
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Same application form, now showing the captured signature in the 'Signature of applicant*' field with system-stamped attribution: 'HEMANTH 09/01/2025 15:57:17'”

**WF-803** (step 11) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** CAF completion
- **Output:** Sales Order 1-29720335990 created, Order Type Activation, Status Abandoned (not a clean success)
- **Next step:** 12
- **Exception flow:** Final captured order status is Abandoned rather than Active/Completed; no Submit confirmation screenshot present
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Order # 1-29720335990 ... Order Type: Activation ... Status: Abandoned ... Priority: Medium-Abandoned ... this captured example order shows Status = 'Abandoned' rather than a completed/activated status”

**WF-804** (step 12) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Sales Order Line Items tab
- **Output:** Two line items (Prepaid Red Promotion, Mobile Service Bundle), both Status Pending
- **Next step:** None (ends at Abandoned/Pending; no successful completion captured)
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Line Items grid shows two rows, both Status: Pending: Outline #1: Product = Prepaid Red Promotion ... Outline #2: Product = Mobile Service Bundle”

## UJ-049: New Fixed Line Tablet – Order Approval & Reject/Correction Cycle (Team Manager role, Non Combo Box variant, two-round approval) (11 steps)

**WF-225** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Sales Order queue navigation
- **Output:** Order 1-29795232313 shown Submitted for Approval
- **Next step:** Manager reviews TM SR Queue
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"My Pending Approval Orders" shows the new order: Order # 1-29795232313 ... Approval Status "Submitted for Approval"”

**WF-226** (step 2) `Explicit` · confidence: `high`
- **Actor:** Team Manager (MANAGETEST)
- **Input:** Order Activities Queue
- **Output:** Order assigned to manager
- **Next step:** Review Attachments/Order Details
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Manager clicks Assign To Me ... Activity Status "Assigned"”

**WF-227** (step 3) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Attachments tab (QatarIdFront, QatarIdBack, CAF)
- **Output:** Attachments verified all present
- **Next step:** Review Order Details tab (Fixed Order Sub Type: Dual Play)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “shows QatarIdFront, QatarIdBack, CAF, all green/verified”

**WF-228** (step 4) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Reject Order modal
- **Output:** Order rejected, Reason 'Original QID was not captured'
- **Next step:** Order shows Rejected (agent side)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Reject Reason = Original QID was not captured (multi-select tag field), Comments = Sprint test”

**WF-229** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** My Rejected Orders view
- **Output:** Order shows Approval Status Rejected, Rejection Reason displayed; Update Details button available
- **Next step:** Order Correction journey
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Approval Status "Rejected", Rejection Reason "Original QID w…"”

**WF-230** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order Correction journey — Contact, CAF re-attach steps
- **Output:** Contact confirmed; CAF/Proof of Employment/Supplementary Form re-required
- **Next step:** Resubmit
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Step "2. CAF" now presents Proof of Employment, CAF, Supplementary Form, Add File tiles — needing re-completion”

**WF-231** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Activity comments 'Test123345', Save And Finish
- **Output:** Resubmission confirmed
- **Next step:** Back in Pending Approval queue
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Your activation request is submitted for approval..."”

**WF-232** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent/Manager
- **Input:** Corrected order
- **Output:** Order re-queued as Ready To Assign / Submitted for Approval
- **Next step:** Second review
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “shows the corrected order again as "Ready To Assign" / "Submitted for Approval"”

**WF-233** (step 9) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Second review of order
- **Output:** Only Approve and Reject-Drop Order options offered (no further correction round)
- **Business rule:** Only one 'Reject - Correction' round is permitted; subsequent review only offers Approve or Reject - Drop Order
- **Next step:** Approve Order
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “shows only Approve and Reject - Drop Order (the "Reject - Correction" option is no longer offered)”

**WF-234** (step 10) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Approve Order modal, attestation, comments 'Approved'
- **Output:** Order approved
- **Next step:** System sends approval SMS
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"By clicking submit, I agree that I have verified all the documents and details to proceed with submission." Comments field filled with Approved”

**WF-235** (step 11) `Explicit` · confidence: `high`
- **Actor:** System (OSB/Service Bus)
- **Input:** Approval event
- **Output:** Approval SMS sent to customer
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"New Fixed Line Tablet for MSISDN 97441224278 with Order number 1-29795232313 is now approved. You can check the order status in My Sales Order."”

## UJ-056: FWA Indoor Vanilla Desktop New Connection (Manual/Non-Wizard) (11 steps)

**WF-441** (step 1) `Explicit` · confidence: `high`
- **Actor:** CRM agent (desktop, Vanilla/manual)
- **Input:** Open UI Desktop home screen
- **Output:** Contacts module opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Home screen — Open UI Desktop landing page (module tiles...)”

**WF-442** (step 2) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Last Name, First Name, ID Type (Passport), ID Number, ID Expiration Date, Nationality, Cellular Phone #, Email
- **Output:** New contact / Mobile Eligibility check created
- **Validation:** temporary-number 90-day rule triggered for Passport ID
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “System warning dialog: "This number will only be active for 90 days...must be provided."”

**WF-443** (step 3) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Zone/Street search
- **Output:** Primary address added to contact
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Contact Addresses picker — searches/selects a Zone and adds it as the Primary address for the contact”

**WF-444** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** contact
- **Output:** Account 360 auto-created (Residential, Expatriate, Active) with Postpaid Billing Profile
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Account 360 View created — Account auto-generated from the contact...Billing Profile tab showing a new Postpaid, Monthly, Invoice billing profile”

**WF-445** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account
- **Output:** Sales Order auto-created, Status Pending
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Account → Orders tab — a Sales Order (Type: Activation, Status: Pending) is auto-created against the account”

**WF-446** (step 6) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** VFQA Catalog browse
- **Output:** GigaHome 5G Classic New Indoor FWA Promotion selected
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent browses VFQA Catalog → Fixed Line Plans → FWA Promotions and selects "GigaHome 5G Classic New Indoor FWA Promotion."”

**WF-447** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** plan selection
- **Output:** Line Items expand into GigaHome plan, FMS CPE Bundle, FMS Service Bundle sub-lines
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Line Items tab — order line auto-expands into: (1) GigaHome 5G Classic New Indoor FWA Promotion, (2) FMS CPE Bundle, (3) FMS Service Bundle...”

**WF-448** (step 8) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Numbers tab
- **Output:** Number reserved, token confirmed
- **Validation:** SUCCESS: Reservation Token:13758017(SBL-EXL-00151)
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “system dialog confirms "SUCCESS: Reservation Token:13758017(SBL-EXL-00151)"”

**WF-449** (step 9) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** Pick Contact dialog
- **Output:** account contact linked as Notification Contact
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Pick Contact dialog — agent links the account's existing contact as the Notification Contact for the order”

**WF-450** (step 10) `Explicit` · confidence: `high`
- **Actor:** CRM agent
- **Input:** FMS CPE Bundle configuration, Indoor Unit Serial Number
- **Output:** CPE equipment sub-type FMS CPE Indoor IDU configured
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent selects equipment sub-type FMS CPE Indoor IDU...fills Indoor Unit Serial Number”

**WF-451** (step 11) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Submit
- **Output:** Order Status Open → In Progress → Complete
- **Validation:** Status Context "All order lines are completed"
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Order status progression — after Submit, the order transitions Status: Open → In Progress...→ Complete”

## UJ-072: Lead Creation – Fixed (Home/Fixed-line lead, Tablet) with Manager Reject (11 steps)

**WF-584** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Click New Lead Tablet tile
- **Output:** 'Create a Lead' empty form opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'Create a Lead' form (empty): Mobile Number*, Service Needed*, First Name, Last Name, Preferred Time, Zone, Street, Building, Unit”

**WF-585** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Service Needed = Home
- **Output:** Conditional 'Fixed Pre-sales' field appears
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Service Needed dropdown opened ... 'Home' ... is selected. After selecting Home, a conditional field 'Fixed Pre-sales' appears”

**WF-586** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** First Name LEAD, Last Name Test1, Fixed Pre-sales Yes, Preferred Time 11/20/2025 12:29:00, Zone 11A, Street 22, Building 33, Unit 44D
- **Output:** Form fully completed
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Fully completed form: Service Needed Home, First Name LEAD, Last Name Test1, Fixed Pre-sales Yes”

**WF-587** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Create Lead
- **Output:** Success dialog 'Lead created successfully!'
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Success dialog: 'Lead created successfully!'”

**WF-588** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Lead created
- **Output:** Lead Details View: Lead Status In Progress, Sub Status Call Back, Lead Num 1-DO3J040
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Lead Details View: Mobile # 97410001000, Lead Status In Progress, Lead Sub Status Call Back ... Lead Num 1-DO3J040”

**WF-589** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** View My Leads / My Created Leads
- **Output:** Lead visible in agent's queue and creator-filtered view
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'My Created Leads' filtered view — narrows to 1 record (the just-created lead), confirming the filter scopes to leads created by the logged-in agent”

**WF-590** (step 7) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Manage Leads > My Team's Leads, filter Created By = HEMANTH
- **Output:** Target lead listed
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Manage Leads > 'My Team's Leads' view, filtered Created By = HEMANTH, listing the same 9 leads including the target Home/97410001000/1-DO3J040 record”

**WF-591** (step 8) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Click Reject button
- **Output:** 'Reject Lead' modal opened
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Manager hovers/clicks the Reject button ... 'Reject Lead' modal opens: required Reject Reason Code dropdown”

**WF-592** (step 9) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Reject Reason Code = Ineligible, Reject Comment = Test
- **Output:** Rejection submitted
- **Validation:** Reject Reason Code required (shown invalid/empty, outlined red if not selected)
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Reject Lead dialog fully completed: Reject Reason Code = Ineligible, Reject Comment = Test; OK/Cancel available”

**WF-593** (step 10) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Reject confirmed
- **Output:** Lead Status = Rejected, Reject button disabled, Order Id/Date Converted remain blank
- **Next step:** 11
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Lead Status updates to Rejected; the Reject button becomes disabled (already actioned). Order Id and Date Converted remain blank”

**WF-594** (step 11) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** View My Created Leads
- **Output:** Lead shows Status Rejected, visible to original agent
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “the same lead now shows Lead Status: Rejected (highlighted), confirming the status change is visible end-to-end across both personas”

## UJ-093: DXP Agent Portal wireframe sequence - Mobile Postpaid Onboarding (13-page UI walkthrough, slides 5-17) (11 steps)

**WF-850** (step 1) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Navigate from Home
- **Output:** Step 1 Customer Details screen
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Home → Step 1 Customer Details → Step 2 ID Verification (IDWise) → Step 3 Eligibility Check → Step 4 Product Selection → Step 5 Device on Installment → Step 6 Number & SIM → Step 7 Cart/Checkout → Step 8 Billing → Step 9 Payment → Step 10 Confirm & e-Sign → CAF (Customer Application Form) → Step 11 Activation”

**WF-851** (step 2) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer Details entered
- **Output:** Step 2 ID Verification (IDWise) screen
- **Validation:** N/A
- **Next step:** 3
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 1 Customer Details → Step 2 ID Verification (IDWise)”

**WF-852** (step 3) `Inferred` · confidence: `high`
- **Actor:** System
- **Input:** ID verification result
- **Output:** Step 3 Eligibility Check screen
- **Validation:** N/A
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 2 ID Verification (IDWise) → Step 3 Eligibility Check”

**WF-853** (step 4) `Inferred` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Eligibility passed
- **Output:** Step 4 Product Selection screen
- **Validation:** N/A
- **Next step:** 5
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 3 Eligibility Check → Step 4 Product Selection”

**WF-854** (step 5) `Inferred` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Device chosen
- **Output:** Step 5 Device on Installment screen
- **Validation:** N/A
- **Next step:** 6
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 4 Product Selection → Step 5 Device on Installment”

**WF-855** (step 6) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Device/plan selected
- **Output:** Step 6 Number & SIM screen
- **Validation:** N/A
- **Next step:** 7
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 5 Device on Installment → Step 6 Number & SIM”

**WF-856** (step 7) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Number & SIM selected
- **Output:** Step 7 Cart/Checkout screen
- **Validation:** N/A
- **Next step:** 8
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 6 Number & SIM → Step 7 Cart/Checkout”

**WF-857** (step 8) `Inferred` · confidence: `high`
- **Actor:** Agent
- **Input:** Cart confirmed
- **Output:** Step 8 Billing screen
- **Validation:** N/A
- **Next step:** 9
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 7 Cart/Checkout → Step 8 Billing”

**WF-858** (step 9) `Inferred` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Billing details entered
- **Output:** Step 9 Payment screen
- **Validation:** N/A
- **Next step:** 10
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 8 Billing → Step 9 Payment”

**WF-859** (step 10) `Inferred` · confidence: `high`
- **Actor:** Customer
- **Input:** Payment made
- **Output:** Step 10 Confirm & e-Sign screen, CAF generated
- **Validation:** N/A
- **Next step:** 11
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Step 9 Payment → Step 10 Confirm & e-Sign → CAF (Customer Application Form)”

**WF-860** (step 11) `Inferred` · confidence: `high`
- **Actor:** System
- **Input:** CAF signed
- **Output:** Step 11 Activation screen
- **Validation:** N/A
- **Next step:** N/A (journey complete)
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “CAF (Customer Application Form) → Step 11 Activation”

## UJ-049: New Fixed Line Tablet – Order Approval & Reject/Correction Cycle (Team Manager role, Combo Box variant) (10 steps)

**WF-215** (step 1) `Explicit` · confidence: `high`
- **Actor:** Team Manager (Test Manager / MANAGETEST)
- **Input:** Order Approval tile
- **Output:** Manager navigates to Order Approval
- **Next step:** TM SR Queue View
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"Test Manager", hovers the Order Approval tile”

**WF-216** (step 2) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Order Activities Queue
- **Output:** Order 1-29795175561 shown Ready To Assign / Submitted for Approval
- **Next step:** Assign To Me
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Activity Status "Ready To Assign"”

**WF-217** (step 3) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Assign To Me action
- **Output:** Activity Status Assigned, Owner MANAGETEST
- **Next step:** Review Attachments tab
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Activity Status Assigned, Owner MANAGETEST”

**WF-218** (step 4) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Order attachments (QatarIdFront, QatarIdBack, CAF)
- **Output:** Attachments reviewed
- **Next step:** Review Order Details tab
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Attachments: QatarIdFront, QatarIdBack, CAF (all present)”

**WF-219** (step 5) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Order Details tab data
- **Output:** Order details reviewed (Journey Name, Plan, Fixed Order Sub Type Triple Play)
- **Next step:** Choose Approve/Reject action
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Fixed Order Sub Type: Triple Play, Kahramaa Id 16P6109”

**WF-220** (step 6) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Reject - Correction action
- **Output:** Reject Order dialog opened
- **Next step:** Select reject reason
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back”

**WF-221** (step 7) `Explicit` · confidence: `high`
- **Actor:** Team Manager
- **Input:** Reject reason 'ID image not clear', comments
- **Output:** Order rejected
- **Next step:** System sends rejection SMS
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"ID image not clear" is tagged/selected ... Comments box filled with test text "Phoenix Sprint 66 test"”

**WF-222** (step 8) `Explicit` · confidence: `high`
- **Actor:** System (OSB/Service Bus)
- **Input:** Rejection event
- **Output:** Rejection SMS sent to customer
- **Next step:** Agent reopens via Order Correction
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

**WF-223** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order Correction tile
- **Output:** Rejected order reopened; ID photos reset to empty (must re-upload)
- **Next step:** Correction resubmitted
- **Exception flow:** Correction flow re-requires the flagged evidence (ID photos) per the 'ID image not clear' rejection reason
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front/Qatari ID-Back reset to empty upload placeholders”

**WF-224** (step 10) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Re-entered phone, re-uploaded ID photos
- **Output:** Correction resubmitted
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Alt. phone # re-entered as 97412341234; Qatari ID-Front and Qatari ID-Back re-uploaded (green checks)”

## UJ-048: Digital Fixed Line Instant Activation (Dual Play) – Self-Service Digital Fiber Activation (10 steps)

**WF-354** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service)
- **Input:** Location (KID)
- **Output:** List of eligible plans
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Location entry by KID; Display and selection of plans based on RFS”

**WF-355** (step 2) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service)
- **Input:** Selected plan
- **Output:** Plan confirmed
- **Next step:** Device confirmation
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Display and selection of plans based on RFS”

**WF-356** (step 3) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service)
- **Input:** Existing Combo Box/CPE serial number
- **Output:** Device serial confirmed
- **Next step:** eKYC Validation
- **Exception flow:** Step skipped for Non Prepatched KID
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"Combo Box & CPE | Locate Your Device" (confirm serial number for previously installed Combo Box or CPE; step "skipped for Non Prepatched KID")”

**WF-357** (step 4) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service)
- **Input:** ID document scan, selfie
- **Output:** eKYC verification result
- **Next step:** Knowing You (contact details capture)
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"Combo Box & CPE | eKYC Validation" (ID Scan, Selfie Scan)”

**WF-358** (step 5) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service)
- **Input:** Email, contact number, home number, appointment slot, eSign
- **Output:** Contact/appointment details captured; eSign completed
- **Next step:** Lead submission
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"Combo Box & CPE | Knowing You" (email, contact, home number, appointment if applicable, eSign)”

**WF-359** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Completed application
- **Output:** Lead submitted
- **Next step:** Confirmation page
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"5G Journey | Plan & Leads" (submit the lead)”

**WF-360** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Location/QID check
- **Output:** Duplicate-fiber-at-location check result
- **Business rule:** If QID already has fiber at another location, generate a home-move lead instead of a new activation
- **Exception flow:** If QID already has fiber, generate lead for home move
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Checking location in Use; Checking if QID already having fiber, if yes lead for home move”

**WF-361** (step 8a) `Explicit` · confidence: `high`
- **Actor:** System / Vodafone Fulfilment (FF)
- **Input:** CPE/ONT order
- **Output:** Order routed to Vodafone FF for fulfilment
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “If CPE/ONT, then order to Vodafone FF to fulfill”

**WF-362** (step 8b) `Explicit` · confidence: `high`
- **Actor:** System / Vodafone Sales
- **Input:** 5G lead
- **Output:** Lead routed to Vodafone for 5G handling
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “If 5G lead to Vodafone”

**WF-363** (step 9) `Explicit` · confidence: `high`
- **Actor:** Customer / System
- **Input:** Confirmation trigger
- **Output:** Confirmation page shown (separate paths)
- **Exception flow:** Separate confirmation paths for CPE & Non Prepatched vs. Prepatched Combo Box
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “"Combo Box & CPE | Confirmation Page" (separate confirmation paths for CPE & Non Prepatched vs. Prepatched Combo Box)”

## UJ-074: Lead Creation, Edit, and Owner Change (Open UI Tablet) (10 steps)

**WF-595** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Contact SAHID ANSARI, mobile 97431243124, Service Needed Plan upgrades
- **Output:** 'Create a Lead' form opened, pre-filled Mobile Number
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Opens a form titled 'Create a Lead' with fields: Mobile Number* (pre-filled 97431243124), Service Needed* (dropdown, set to 'Plan upgrades')”

**WF-596** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Create Lead
- **Output:** 'Lead created successfully!' confirmation; Lead Num 1-DO7II8B, Status New, Owner HEMANTH
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Clicking Create Lead triggers a browser-native JS dialog: 'Lead created successfully!'”

**WF-597** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CallBack Date/Time = 12/4/2025 12:00
- **Output:** Lead Status auto-transitions New → In Progress, Sub Status → Call Back
- **Business rule:** Setting CallBack Date/Time auto-updates Lead Status and Sub Status
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “After entering 12/4/2025 12:00 into CallBack Date/Time, the record auto-updates: Lead Status changes from 'New' to 'In Progress', and Lead Sub Status becomes 'Call Back.'”

**WF-598** (step 4) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Manage Leads > My Team's Leads
- **Output:** Lead located; Lead Owner field shows lookup icon (reassignable)
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Manager's 'All Leads View' opens with view selector 'My Team's Leads' ... Lead Details panel below shows the Lead Owner field now carries a lookup/select icon”

**WF-599** (step 5) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Service Needed changed to Pre to Post; Lead Owner picker opened, VINODHINIR selected
- **Output:** Lead Owner reassigned from HEMANTH to VINODHINIR
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “the Lead Owner field now shows 'VINODHINIR' (highlighted red border indicating the just-changed field), replacing HEMANTH”

**WF-600** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar, original owner)
- **Input:** View My Leads
- **Output:** Lead no longer appears in original owner's My Leads
- **Business rule:** My Leads is filtered by current Owner; lead disappears after reassignment
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “the SAHID ANSARI/97431243124 lead is no longer present — the list now starts with the GRANADA/ALLAN lead”

**WF-601** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** View My Created Leads
- **Output:** Lead still visible (filtered by Created By, not Owner)
- **Business rule:** My Created Leads filters by Created By, independent of ownership
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'My Created Leads' = filtered by Created By (HEMANTH), not by current Owner”

**WF-602** (step 8) `Explicit` · confidence: `high`
- **Actor:** New Owner (VINODHINIR)
- **Input:** View My Leads
- **Output:** Lead now appears at top of new owner's queue
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “SAHID ANSARI's lead ... is now at the top of the list with Lead Owner: VINODHINIR — confirming the reassignment completed the round trip”

**WF-603** (step 9) `Explicit` · confidence: `high`
- **Actor:** New Owner (VINODHINIR)
- **Input:** Edit Description field to 'Test1234'
- **Output:** Description updated on lead record
- **Next step:** 10
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “the new owner types 'Test1234' replacing the prior text, with an OK button ... Description field ... now reads 'Test1234'”

**WF-604** (step 10) `Explicit` · confidence: `high`
- **Actor:** Back-office/Admin (KARTHIKK)
- **Input:** All Leads across Org view
- **Output:** Full 3-column admin Lead Details View with Reject/Retire actions available
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Lead Details panel below adds admin-only buttons Reject and Retire (in addition to the fields seen at agent level)”

## UJ-065: FWA Outdoor B2B2C New Sale (Tablet, Open UI) (9 steps)

**WF-501** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent Hemanth Kumar (tablet)
- **Input:** Qatari ID 27035630865, Company Name TestVQW
- **Output:** Contact MAHENDRAN GANESAN confirmed under sponsoring company TestVQW
- **Validation:** Connection Details popup shows 0 existing connections
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Agent types Company Name "TestVQW" into an autocomplete dropdown...selects TestVQW — this is the B2B2C sponsoring/employer company.”

**WF-502** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Zone 15, Street No. 16, Building No. 17, Apt/Flat/Unit 18Q, Area Al Rayyan
- **Output:** Address saved
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Zone 15, Street No. 16, Building No. 17, Apt/Flat/Unit 18Q, Area Al Rayyan. Agent clicks Save Address.”

**WF-503** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Selection of GigaHome Premium OD New 5G FWA Promotion
- **Output:** Bundle components confirmed (FMS CPE ODU, FMS CPE Outdoor IDU, etc.)
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “GigaHome Premium OD New 5G FWA Promotion (selected — matches the Outdoor B2B2C journey name)”

**WF-504** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Addon/Discount
- **Output:** 100% Discount for 2 Months -FWA pre-applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Discount already pre-applied and shown: "100% Discount for 2 Months -FWA".”

**WF-505** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Number tile 41224267 selected
- **Output:** 97441224267 saved
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Agent selects number tile 41224267 (QR0.00)..."5. Number Selection: 97441224267"”

**WF-506** (step 6) `Inferred` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** SIM Serial entry
- **Output:** Saved
- **Next step:** Book Appointment
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Step 6 – SIM Serial. Empty form on this screenshot pass...then confirms "Saved!"”

**WF-507** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Date 13 Sep 2025, time slot 8AM-11AM
- **Output:** Appointment ID 120903 booked, Appointment Number 1-29724803615
- **Validation:** Confirm dialog acknowledged
- **Business rule:** Appointment once booked cannot be cancelled
- **Next step:** CAF & Additional Attachments
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Appointment has been successfully booked...Appointment ID is 120903”

**WF-508** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent + customer
- **Input:** CAF data, e-signature, Proof of Employment/CAF/Supplementary Form
- **Output:** All three required documents green-checked
- **Validation:** Required attachment enforcement
- **Next step:** Activity/Final submission
- **Exception flow:** "Error: Please select Supplementary Form before continuing."
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “All three required documents are subsequently completed — Proof of Employment, CAF, and Supplementary Form all show green checkmarks”

**WF-509** (step 9) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Comments + Save and Finish
- **Output:** Order Number 1-29724796848 created, Status Open/In Progress
- **Next step:** End of captured journey (fulfillment pending)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Postpaid completed successfully. Order Number:- '1-29724796848'”

## UJ-073: Lead Creation Mobile (Postpaid lead via mobile number, Tablet) with Manager Reassignment (9 steps)

**WF-605** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Hemanth Kumar)
- **Input:** Click New Lead Tablet tile
- **Output:** 'Create a Lead' form opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Clicking the tile opens the 'New Lead Tablet' view ... showing a 'Create a Lead' panel”

**WF-606** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Mobile Number 97410101010, Service Needed Postpaid, First Name LEAD, Last Name 123
- **Output:** Form populated
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Agent types '97410101010' into Mobile Number ... Postpaid (selected, highlighted blue) ... First Name is set to 'LEAD'; Last Name is being typed as '123'”

**WF-607** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Create Lead
- **Output:** 'Lead created successfully!' confirmation
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “After clicking Create Lead, a native browser confirm dialog appears: 'Lead created successfully!'”

**WF-608** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Edit Description to 'Postpaid lead test'
- **Output:** Description saved
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “agent types 'Postpaid lead test', then clicks OK”

**WF-609** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** CallBack Date/Time = 11/20/2025 03:16:00 PM
- **Output:** CallBack Date/Time saved
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Result: CallBack Date/Time field set to '11/20/2025 03:16:00 PM.'”

**WF-610** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Lead Status changed New → In Progress
- **Output:** Status updated
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Status is changed from 'New' to 'In Progress.'”

**WF-611** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Lead Sub Status set to Call Back
- **Output:** Sub status updated
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Sub status is set to 'Call Back.'”

**WF-612** (step 8) `Explicit` · confidence: `high`
- **Actor:** Manager (Test Manager)
- **Input:** Manage Leads > My Team's Leads
- **Output:** Target lead (1-DO45220) located
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Manager opens Manage Leads > 'My Team's Leads' list (12+ records across agents) ... Row 1 is the lead from this walkthrough”

**WF-613** (step 9) `Explicit` · confidence: `high`
- **Actor:** Manager
- **Input:** Open Lead Owner picker, select VINODHINIR
- **Output:** Lead Owner reassigned from HEMANTH to VINODHINIR
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “the Lead Owner field (both top and bottom detail panels) is updated and highlighted to 'VINODHINIR', replacing 'HEMANTH.'”

## UJ-076: Passport to QID Update (Passport) – Open UI Tablet (9 steps)

**WF-626** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Login to Tablet
- **Output:** Passport to QID Journey selected
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 1: Login to Tablet & Select the Passport to QID Journey”

**WF-627** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** MSISDN & Passport Number
- **Output:** Click Go
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 2: Enter MSISDN & Passport Number then click on Go”

**WF-628** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** QID Number
- **Output:** Click Update ID
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 3: Enter the QID Number then click on Update ID”

**WF-629** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Update ID clicked
- **Output:** Customer details fetched
- **Business rule:** MOI Validation
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 4: Once 'Update ID' is clicked, all customer details are fetched based on MOI Validation”

**WF-630** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Scan or Upload QID Front & Back
- **Output:** Continue clicked
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 5: Scroll down, then Scan or Upload the QID – Front & Back, then click Continue”

**WF-631** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Attachments confirmed
- **Output:** Identification number change form generated
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 6: An Identification number change form is generated and the customer signs the contract”

**WF-632** (step 7) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Sign the Contract
- **Output:** Click Done
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 7: Sign the Contract & click Done”

**WF-633** (step 8) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Signature captured
- **Output:** Click Done
- **Next step:** 9
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 8: Signature is captured in the generated form, then click Done”

**WF-634** (step 9) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Form attached
- **Output:** Click Finish
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 9: Form is attached, then click Finish”

## UJ-078: Vanilla New Postpaid (Desktop) - Bill Limit Agent Minimum Validation (9 steps)

**WF-656** (step 1) `Explicit` · confidence: `high`
- **Actor:** Admin (VFQA Sales responsibility user)
- **Input:** Navigate Administration - Product > Product Promotions
- **Output:** 'Postpaid U Plus Promotion' record selected, More Info tab shown
- **Next step:** Bill Limit Mapping tab review
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Navigated via Administration - Product > Product Promotions. The 'Postpaid U Plus Promotion' record... is selected.”

**WF-657** (step 2) `Explicit` · confidence: `high`
- **Actor:** Admin
- **Input:** Bill Limit Mobile Plus row, Agent Min Value field
- **Output:** Agent Min Value raised to 80
- **Business rule:** Bill Limit Agent Minimum Value governs later order validation
- **Next step:** Create new sales order
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Agent Min Value field is being edited — highlighted/selected showing '80' (raised from a prior value)”

**WF-658** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** New Sales Order created for account 'Vishakan Soundararajan'
- **Output:** Order # 1-28929093512, Status Pending
- **Next step:** Catalog search and add product
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “A brand-new order is created: Order # 1-28929093512, Type 'Sales Order', Order Type 'Activation', Status 'Pending'”

**WF-659** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Search 'U Plus' in VFQA Catalog
- **Output:** 'Postpaid U Plus Promotion' tile added to cart
- **Next step:** Line Items populated with promotion + Mobile Service Bundle
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Search box 'U Plus' returns one tile: 'Postpaid U Plus Promotion', Qty 1, being added to the cart”

**WF-660** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customize on Mobile Service Bundle row
- **Output:** Complex Product Runtime Instantiation customization screen opens (VAS Flex-purchase, Extra Cabling Charges, Bill Limit, Smart Tracker Device, Lego Addons sections)
- **Next step:** Select 'Bill Limit Mobile Plus' and Customize
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “A 'Customize' context option is shown against the Mobile Service Bundle row, launching the complex-product configuration screen.”

**WF-661** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SL Limit Amount = 75 entered under Spend Limit Amounts tab
- **Output:** Bill Limit Mobile Plus configured with customer Bill Limit of QR75
- **Next step:** Line Items grid populated with sub-lines (2.1-2.8)
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Under the 'Spend Limit Amounts' tab... SL Limit Amount = 75, SL Min Value = .01, SL Default Value = 20”

**WF-662** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Line items finalized with MSISDN and SIM assigned
- **Output:** Grid shows 10 line items, all Pending, Service Id 97479025465 and SIM Id 8942702400000026363 assigned
- **Next step:** Agent clicks Validate
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Grid now shows '1 - 10 of 10' line items, all Status 'Pending'. Service identifiers are now auto-assigned”

**WF-663** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Validate
- **Output:** Informational dialog: 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'
- **Validation:** informational only, dismissed with OK
- **Business rule:** Max Bill Limit = account Credit Limit rule
- **Next step:** Second validation dialog fires
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Clicking 'Validate' on the order header... produces a browser dialog... 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

**WF-664** (step 9) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Bill Limit SL Limit Amount 75 vs Agent Min Value 80
- **Output:** Blocking error dialog: 'Bill Limit can not be set lower than Agent Minimum 80. Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)'
- **Validation:** SBL-EXL-00151 blocking validation
- **Business rule:** Bill Limit must not be lower than product's configured Agent Minimum Value
- **Next step:** Order remains Pending; no resubmission shown
- **Exception flow:** Agent must contact System Administrator (per error message) or correct the SL Limit Amount to >= 80 (inferred, not shown)
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)' Dismissed with OK.”

## UJ-107: J023 Mobile Service Suspension (Email/Phone/Retail Counter channel, DXP) (9 steps)

**WF-924** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Customer
- **Input:** Suspension request via Email, Phone, or Retail Counter
- **Output:** Request logged
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “request service suspension (via Email, Phone, or Retail Counter)”

**WF-925** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** MSISDN/Account
- **Output:** Subscriber identified
- **Next step:** 3
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “identify subscriber -> search (MSISDN/Account)”

**WF-926** (step 3) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Subscriber identifier
- **Output:** Customer & billing details fetched
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “fetch customer & billing details”

**WF-927** (step 4) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Customer & billing details
- **Output:** Customer and suspend eligibility validated
- **Validation:** Pending Bill, Current unbilled must be cleared
- **Next step:** 5
- **Exception flow:** If unbilled/pending bill not cleared, suspension eligibility fails
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “validate customer and suspend eligibility ... Note: "Pending Bill, Current unbilled must be cleared" stated as a condition”

**WF-928** (step 5) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Park Plan data fetched from "Launch X"
- **Output:** Current plan changed to Park Plan with minimum services
- **Business rule:** The modify order is initiated by the Agent in DXP.; The agent either suspends the service or changes the SIM to a park plan.
- **Next step:** 6
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X")”

**WF-929** (step 6) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Suspension action
- **Output:** Communication sent to customer
- **Next step:** 7
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “send communication to customer”

**WF-930** (step 7) `Explicit` · confidence: `medium`
- **Actor:** Agent / Approver
- **Input:** Suspension order
- **Output:** Ticket created; approval needed
- **Next step:** 8
- **Exception flow:** Order blocked pending approval
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “ticket creation and approval needed”

**WF-931** (step 8) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Payment for suspension
- **Output:** Payment captured in WinCash
- **Next step:** 9
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment for suspension, collected in WinCash”

**WF-932** (step 9) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Completed order
- **Output:** Order submitted
- **Business rule:** The order is submitted by the Agent in DXP to apply the change.
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “submit the order -> end”

## UJ-108: J024 Mobile Service Resume (Email/Phone/Retail Counter channel, DXP) (9 steps)

**WF-933** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Customer
- **Input:** Resume request via Email, Phone, or Retail Counter
- **Output:** Request logged
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “request service resume (via Email, Phone, or Retail Counter)”

**WF-934** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** MSISDN/Account
- **Output:** Subscriber identified
- **Next step:** 3
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “identify subscriber -> search (MSISDN/Account)”

**WF-935** (step 3) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Subscriber identifier
- **Output:** Customer & billing details fetched
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “fetch customer & billing details”

**WF-936** (step 4) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Customer & billing details
- **Output:** Customer and resume eligibility validated
- **Next step:** 5
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “validate customer and resume eligibility”

**WF-937** (step 5) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Base Plan data fetched from "Launch X"
- **Output:** Park Plan changed back to Base Plan
- **Business rule:** The modify order is initiated by the Agent in DXP.
- **Next step:** 6
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current Park Plan back to Base Plan (fetched from "Launch X")”

**WF-938** (step 6) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** Resume action
- **Output:** Communication sent to customer
- **Next step:** 7
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “send communication to customer”

**WF-939** (step 7) `Explicit` · confidence: `medium`
- **Actor:** Agent / Approver
- **Input:** Resume order
- **Output:** Ticket created; approval needed
- **Next step:** 8
- **Exception flow:** Order blocked pending approval
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “ticket creation and approval needed”

**WF-940** (step 8) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Payment for resume service
- **Output:** Payment captured via WinCash
- **Next step:** 9
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment of resume service via WinCash”

**WF-941** (step 9) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Completed order
- **Output:** Order submitted; Base Plan billed
- **Business rule:** The order is submitted by the Agent in DXP to apply the change.
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “submit the order -> end. Note: "Base Plan would be Billed" stated as an outcome”

## UJ-019: Transfer of Number - BAU TON (both parties present, happy path) (8 steps)

**WF-095** (step 1) `Explicit` · confidence: `high`
- **Actor:** Party A and Party B (customers)
- **Input:** Both parties physically present in store
- **Output:** TON process initiated
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “BAU TON — both parties physically present in store, happy path”

**WF-096** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer application form, TON form, QID/diplomatic ID for party B, party A ID (passport/DCC/QID)
- **Output:** Documents collected
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Documents required: customer application form, TON form, QID (or diplomatic ID) for party B (party A may use passport/DCC/QID), a free SR for QID update”

**WF-097** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Party A/B ages
- **Output:** Age validation result (must not be a minor)
- **Validation:** age validation via MOI/date-of-birth, noting a known 5-8 day MOI database sync lag risk for someone turning 18
- **Next step:** 4
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Requirement: age validation (must not be a minor) via MOI/date-of-birth, noting a known 5-8 day MOI database sync lag risk for someone turning 18”

**WF-098** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Party A/B collections status
- **Output:** Collections pre-validation result
- **Validation:** pre-validate that neither party A nor party B is in collection BEFORE entering the TON flow, not inside it
- **Next step:** 5
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “pre-validate that neither party A nor party B is in collection BEFORE entering the TON flow, not inside it”

**WF-099** (step 5) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** Outstanding DOI, lock-in/park-my-number penalties
- **Output:** Clearance confirmation
- **Validation:** Entire DOI (not just first installment) and any remaining lock-in/park-my-number penalties must be cleared before transfer
- **Next step:** 6
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Entire DOI (not just first installment) and any remaining lock-in/park-my-number penalties must be cleared before transfer”

**WF-100** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent/WinCash
- **Input:** Star number transfer conditions (if applicable)
- **Output:** Commitment or payment collected
- **Business rule:** Star number transfer requires EITHER a one-year postpaid commitment scaled to the number's value OR payment of the star number's value if going prepaid; commitment restarts from month one; star number penalty collected manually in cash via WinCash under a separate SKU
- **Next step:** 7
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Star number transfer requires EITHER a one-year postpaid commitment scaled to the number's value OR payment of the star number's value if going prepaid; commitment restarts from month one regardless of the prior customer's progress”

**WF-101** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Line to transfer
- **Output:** Line migrated to prepaid before TON raised
- **Next step:** 8
- **Exception flow:** Key inefficiency: line migrated to prepaid BEFORE TON raised, purely because back-office approval takes ~20 days and validation is manual — a workaround for a validation gap
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “the line is migrated to prepaid BEFORE the TON is raised, purely because back-office approval takes ~20 days and validation is manual — explicitly identified as a workaround for a validation gap”

**WF-102** (step 8) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** 50 Riyal TON fee
- **Output:** Fee collected (payer party unresolved)
- **Exception flow:** Open/unresolved: who pays the 50 Riyal TON fee (currently left to customer at store discretion)
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Open/unresolved: who pays the 50 Riyal TON fee (currently left to the customer at store discretion — flagged as blocking automation of the receipt)”

## UJ-038: FWA-to-Fiber Migration (manual, not automated) (8 steps)

**WF-322** (step 1) `Explicit` · confidence: `high`
- **Actor:** BI (Business Intelligence)
- **Input:** ZSP fiber-coverage data
- **Output:** BI report of FWA locations now fiber-covered
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “actual process is a BI report (by ZSP) → business team candidate list → fulfillment tickets → agent calls customer → Open UI order → full feasibility/ONT/service-point checks redone from scratch → fiber activated FIRST, then 5G disconnected”

**WF-323** (step 2) `Explicit` · confidence: `high`
- **Actor:** Business team
- **Input:** BI report
- **Output:** Candidate list of customers to migrate
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “business team candidate list → fulfillment tickets”

**WF-324** (step 3) `Explicit` · confidence: `high`
- **Actor:** Fulfillment team
- **Input:** Candidate list
- **Output:** Fulfillment tickets raised
- **Next step:** 4
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “fulfillment tickets → agent calls customer”

**WF-325** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Fulfillment ticket
- **Output:** Customer contacted
- **Next step:** 5
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “agent calls customer → Open UI order”

**WF-326** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer confirmation
- **Output:** Open UI order created
- **Business rule:** customers already on a post-Oct/Sep-2025 FWA plan get a plan change; legacy-plan customers require a brand-new fiber order
- **Next step:** 6
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Open UI order → full feasibility/ONT/service-point checks redone from scratch...Customers already on a post-October/September-2025 FWA plan get a plan change; legacy-plan customers require a brand-new fiber order”

**WF-327** (step 6) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** Order
- **Output:** Feasibility/ONT/service-point checks redone from scratch
- **Next step:** 7
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “full feasibility/ONT/service-point checks redone from scratch”

**WF-328** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Feasibility pass
- **Output:** Fiber activated
- **Next step:** 8
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “fiber activated FIRST, then 5G disconnected and equipment recovered”

**WF-329** (step 8) `Explicit` · confidence: `high`
- **Actor:** System/Field
- **Input:** Fiber active
- **Output:** 5G disconnected and equipment recovered
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “fiber activated FIRST, then 5G disconnected and equipment recovered”

## UJ-064: FWA Indoor New Sale Without Approval (Tablet, Open UI) (8 steps)

**WF-493** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent Hemanth Kumar (tablet)
- **Input:** Qatari ID 28035650506
- **Output:** Contact SELBATH JAMALUDEEN confirmed + Connection Details popup showing 2 existing postpaid connections
- **Validation:** Advisory shown but non-blocking
- **Business rule:** Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding
- **Next step:** Address
- **Exception flow:** Agent proceeds directly by clicking Continue — no approval workflow triggered
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Despite the advisory note about seeking credit control approval, the agent proceeds directly by clicking Continue — no approval workflow”

**WF-494** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Zone 11, Street No. 23, Building No. 45, Apt/Flat/Unit 89G, Area Al Rayyan
- **Output:** Address saved
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Zone: 11, Street No.: 23, Building No.: 45, Apt/Flat/Unit: 89G, Area: Al Rayyan”

**WF-495** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Selection of GigaHome 5G Classic New Indoor FWA Promotion
- **Output:** Plan bundle confirmed
- **Next step:** Addon & Discount
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Selected: GigaHome 5G Classic New Indoor FWA Promotion.”

**WF-496** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Addon/Discount
- **Output:** 100% Discount for 2 Months -FWA applied
- **Next step:** Number Selection
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Discount auto-applied: 100% Discount for 2 Months -FWA.”

**WF-497** (step 5) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** Free number 41202297 selected
- **Output:** Number reserved (97441202297)
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “Three free numbers offered: 41202297 (selected, highlighted), 40010150, 41202298”

**WF-498** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (tablet)
- **Input:** SIM 8942702800801190297, CPE S180P18055022
- **Output:** SIM/CPE saved
- **Validation:** Scanned, validated
- **Next step:** CAF signing
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “SIM Serial field: 8942702800801190297 (scanned, validated). CPE Serial Number: S180P18055022.”

**WF-499** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent + customer
- **Input:** CAF data, e-signature, CAF + Supplementary Form documents
- **Output:** Both documents green-checked, order line ready
- **Next step:** Order submission
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “CAF (required, marked with red asterisk) and Supplementary Form, plus an "Add File" tile.”

**WF-500** (step 8) `Explicit` · confidence: `high`
- **Actor:** System/back office
- **Input:** Completed order data (no approval gate)
- **Output:** Order 1-29722815428 Status Complete, Fulfillment Status Complete, Approved checkbox unchecked/blank
- **Validation:** Status Context: All order lines are completed
- **Business rule:** Approved checkbox left unchecked/blank throughout — confirming no approval gate exercised
- **Next step:** End of journey
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “the order still reaches Status: Complete / Fulfillment Status: Complete...Approved checkbox unchecked and Approved By blank”

## UJ-068: MNP Postpaid Cross-Sales Conversion (Desktop, Open UI) (8 steps)

**WF-529** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Existing contact VISHAKAN SOUNDARARAJAN, Cross Sales Offers tab
- **Output:** Two offers displayed (New MNP, New Postpaid)
- **Next step:** Accept New MNP offer
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Cross Sales Offers grid (1-2 of 2) lists two offers: OfferType "New MNP"...OfferType "New Postpaid"”

**WF-530** (step 2) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Accept action on New MNP offer
- **Output:** MNP Postpaid guided journey launched
- **Next step:** Contact confirmation
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “the "Accept" button is now shown selected/highlighted, indicating the agent has clicked Accept against the "New MNP" offer row”

**WF-531** (step 3) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Contact confirmation
- **Output:** Connection Details popup shown (1 prepaid, 1 postpaid connection)
- **Next step:** Address entry
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 1”

**WF-532** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Email, Preferred Language, Alt. phone # validated
- **Output:** Contact step saved
- **Validation:** Green checkmarks
- **Next step:** Address
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Editable fields now shown filled and validated (green checkmarks): Email...Preferred Language English, Alt. phone # 97431345716”

**WF-533** (step 5) `Inferred` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Address fields (Zone, Street No., Building No., Apt/Flat/Unit)
- **Output:** Address step (not confirmed complete in captured screenshots)
- **Next step:** Billing
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Section "2. Address" expanded with blank fields: Zone, Street No., Building No., Apt/Flat/Unit — none pre-filled.”

**WF-534** (step 6) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Existing billing profile review
- **Output:** Billing step confirmed (1-2KSRROSK)
- **Next step:** SIM Serial
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “"3. Billing: 1-2KSRROSK  Saved!"”

**WF-535** (step 7) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** SIM Serial 8942702111346231021
- **Output:** SIM Serial validated and saved
- **Validation:** Green checkmark
- **Next step:** Plan selection
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Field SIM Serial filled with value 8942702111346231021, validated with a green checkmark.”

**WF-536** (step 8) `Explicit` · confidence: `high`
- **Actor:** Sales agent (desktop)
- **Input:** Plan step loading
- **Output:** New Plus Extra Pakistan BIA Promotion modal shown with Bill Limit 150, Credit Limit 1000
- **Next step:** Donor Details (not captured)
- **Exception flow:** Journey not captured beyond this point — Donor Details, Donor Attachment, CAF, Activity steps and final submission are not shown
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “the document's screenshots end here — steps 6 (Donor Details), 7 (Donor Attachment), 8 (CAF), and 9 (Activity)...are never shown filled in or completed in this document.”

## UJ-075: Tablet Lead Creation with Fixed Pre-Sales and Subsequent Edit (8 steps)

**WF-614** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (VINODHINIR)
- **Input:** Mobile Number 97498129812, Service Needed Home
- **Output:** Fixed Pre-sales dropdown appears
- **Validation:** Fixed Pre-sales appears because Service Needed = Home
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Agent enters Mobile Number: 97498129812. Opens the Service Needed * dropdown ... selects Home”

**WF-615** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** First Name Vishak, Last Name Sound, Fixed Pre-sales = Yes
- **Output:** Date/time picker opens for Preferred Time
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “a new dropdown Fixed Pre-sales appears (options: -- Select Option --, Yes, No); agent selects Yes ... a date/time picker control opens”

**WF-616** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Preferred Time 12/25/2025 16:00:00, Zone 1004, Street 1005, Building 1006, Unit 1007F
- **Output:** Form fully populated
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Full form is now populated: ... Zone: 1004, Street: 1005, Building: 1006, Unit: 1007F”

**WF-617** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Create Lead
- **Output:** 'Lead created successfully!' confirmation
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Agent clicks Create Lead, and a browser confirm dialog appears: 'Lead created successfully!'”

**WF-618** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Lead created against mobile 97498129812
- **Output:** Lead attaches to pre-existing contact TAMER ABDELHALIM; Lead Num 1-DO7AF7D, Status In Progress, Sub Status Call Back, Fixed Pre Sales Yes
- **Next step:** 6
- **Exception flow:** System matches lead to existing contact record for that mobile number rather than the typed First/Last Name
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “the pre-existing contact tied to that mobile number (i.e., the test mobile number 97498129812 belongs to contact Tamer Abdelhalim already in the system; the newly created lead attaches to this contact)”

**WF-619** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Reopen lead from Contact record
- **Output:** Lead Details View reopened for editing
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “the same Lead Details record is reopened ... setting up the edit”

**WF-620** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Service Needed changed from Home to MNP
- **Output:** Service Needed updated
- **Next step:** 8
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “the agent selects MNP (changing it from 'Home')”

**WF-621** (step 8) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Description = 'MNP from Home'
- **Output:** Description saved and persisted
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Agent types 'MNP from Home' into the box ... the Description field ... shows 'MNP from ...' (truncated display of 'MNP from Home')”

## UJ-095: Existing Processes Walkthrough - Fixed/Fibre Journey (demo) (8 steps)

**WF-867** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Karama ID (KID)
- **Output:** KID captured; if unknown, Zone/Street/Building lookup performed
- **Next step:** 2
- **Exception flow:** a wrong KID entered upfront is only caught by the field agent at the appointment stage
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Fixed/fibre journey: starts with Karama ID (KID) — Zone/Street/Building lookup if unknown”

**WF-868** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address confirmation
- **Output:** Address confirmed
- **Next step:** 3
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “then address confirmation, QID eligibility/blacklist check”

**WF-869** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** QID eligibility/blacklist check
- **Output:** Customer cleared or blocked
- **Next step:** 4
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “QID eligibility/blacklist check, plan + discount, IPTV/TV (defaulted to yes, triple play)”

**WF-870** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** plan + discount selection
- **Output:** Plan/discount chosen
- **Next step:** 5
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “plan + discount, IPTV/TV (defaulted to yes, triple play)”

**WF-871** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** IPTV/TV default
- **Output:** IPTV defaulted to yes (triple play)
- **Business rule:** IPTV only via OSN/fixed and always defaulted on
- **Next step:** 6
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “IPTV/TV (defaulted to yes, triple play) ... IPTV only via OSN/fixed and always defaulted on”

**WF-872** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** number selection
- **Output:** Number assigned
- **Next step:** 7
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “number, appointment slot (sent to installation partner), CAF, submission”

**WF-873** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** appointment slot selection
- **Output:** Slot sent to installation partner
- **Next step:** 8
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “appointment slot (sent to installation partner), CAF, submission”

**WF-874** (step 8) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** CAF
- **Output:** CAF signed, order submitted
- **Next step:** None (terminal: submitted; instant vs non-instant activation determined back-end by box type)
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “CAF, submission ... Fiber instant vs non-instant activation is a back-end box-type check, not customer choice (02:04:47)”

## UJ-018: MNP Port-Out Ticket Creation and Auto-Validation (Consumer, Siebel/NPass) (7 steps)

**WF-076** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Port-out SMS request
- **Output:** SMS received by NPass
- **Next step:** NPass notifies Siebel
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “customer's SMS goes to NPass, NPass notifies Siebel”

**WF-077** (step 2) `Explicit` · confidence: `high`
- **Actor:** Siebel (system)
- **Input:** NPass notification
- **Output:** Trouble ticket auto-created with two-hour action window
- **Validation:** Bound by NPass working hours (~7:30-3:30/4) as hard stop
- **Business rule:** Two-hour window extended to 24 hours once documents validated
- **Next step:** System auto-validation of core fields
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours”

**WF-078** (step 3) `Explicit` · confidence: `high`
- **Actor:** Siebel (system)
- **Input:** Customer name, QID/ID type and number, service type, consumer type
- **Output:** Ticket passes or is auto-rejected
- **Validation:** Auto-validates all four fields
- **Next step:** Manual signature/MNP form checks if auto-validation passes
- **Exception flow:** Auto-rejected on failure so only clean tickets reach fulfilment
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure so only clean tickets reach fulfilment”

**WF-079** (step 4) `Explicit` · confidence: `high`
- **Actor:** Fulfilment agent
- **Input:** MNP form (date, segment, product, name, ID, requested number), signature
- **Output:** Manual verification outcome
- **Validation:** Date within 30 days; signature match; remaining fields checked manually because Siebel cannot read digital form and documents live only in NPass
- **Business rule:** Key request: bring documents into Siebel via ticket attachment, subject to NPass API availability
- **Next step:** Conditional acceptance check (billed due)
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual because Siebel cannot read the digital form”

**WF-080** (step 5) `Explicit` · confidence: `high`
- **Actor:** Siebel (system)
- **Input:** Billed due amount (QAR)
- **Output:** Conditional acceptance applied if billed due over 100 QAR
- **Validation:** Only billed amounts trigger conditional acceptance for MNP consumer; unbilled amounts do not
- **Next step:** Manual calculation of plan penalty/device dues if applicable
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP”

**WF-081** (step 6) `Explicit` · confidence: `high`
- **Actor:** Retention/fulfilment agent
- **Input:** Commitment/plan penalty, device dues data
- **Output:** Pro-rated final invoice
- **Validation:** Cannot block port-out since unbilled; calculated manually today
- **Business rule:** Business requirement raised: system should calculate plan penalty, device dues, locking charges automatically
- **Next step:** Ticket closure/status update
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Commitment/plan penalty and device dues cannot block a port-out because they are unbilled; they are calculated manually today and issued as a pro-rated final invoice”

**WF-082** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Rejection scenario (reason code 1, 4, or 9 for consumer)
- **Output:** Ticket rejected with detailed explanation captured at ticket level
- **Validation:** Reason codes tightly coupled to NPass, cannot be renamed
- **Exception flow:** Ticket status/reason communicated back through NPass-coupled statuses
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9”

## UJ-086: Open UI Desktop - Agent viewing Account 360 (Business/Reimbursement customer, Vanilla/manual path) (7 steps)

**WF-168** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer lookup (business account)
- **Output:** Account Summary tab displayed
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Left panel shows customer "Anuj Singh Yadav, Vodafone Contractors" — Account Type: Business ... status "Active"”

**WF-169** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Account Summary tab loaded
- **Output:** Installed Assets, Activity Timeline, and summary tiles (Orders/Trouble Tickets/Installed Assets/Billing Profiles) rendered
- **Validation:** N/A
- **Next step:** 3
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Center summary tiles: Orders (87, Open Orders 0, Suspended Orders 0), Trouble Tickets (62 ...), Installed Assets, Billing Profiles (3 ...)”

**WF-170** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Asset Summary tab
- **Output:** Asset Summary tab active, Recent Usage and Real Time gauges shown
- **Validation:** N/A
- **Next step:** 4
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Tab switched to "Asset Summary" (now highlighted red) instead of Account Summary. "Recent Usage" panel ... lists call detail rows”

**WF-171** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click into Asset row
- **Output:** Expanded Asset detail view with four cards: Account Details, Asset Details, Contact Details, Bill Details
- **Validation:** N/A
- **Next step:** 5
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Breadcrumb "You are here: Asset: | Account Summary:". Four detail cards side by side: "Account Details" ... "Asset Details" ... "Contact Details" ... "Bill Details"”

**WF-172** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Get RTB button
- **Output:** Real Time Balance panel populated with Primary Balance, Monetary/Bill Manager, Voice, Units tiles
- **Validation:** N/A
- **Next step:** 6
- **Exception flow:** Communications modal opens simultaneously showing "Communication: User has maximum Communication toolbar sessions." system message
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “the underlying "Real Time Balance" panel (post Get RTB click) is visible with detail tiles: Primary Balance (0 QAR, Expires on Date not configured/set)...”

**WF-173** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Communications modal opened over page
- **Output:** Sub-navigation row shown: Contact history, Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead — grid initially empty
- **Validation:** N/A
- **Next step:** 7
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “A modal titled "Communications" opens over the page ... a row of sub-navigation buttons appears: Contact history (active/red), Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead — with an empty activity grid beneath”

**WF-174** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Click Contact history sub-tab
- **Output:** Grid populated with 10+ activity rows (Activity #, Channel, Description, Status, Comments, Transaction Date, Customer Segment, Customer Type, Area, Journey)
- **Validation:** N/A
- **Next step:** N/A (walkthrough ends)
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “the sub-navigation row ... is now fully visible with "Contact history" active. The grid below is populated (1-10 of 10+) with real rows, e.g.: Activity # 1-2WO63MPA, Channel "Administration"...”

## UJ-058: FWA Indoor CPE Modification (Desktop Vanilla, Serial Number Correction) (7 steps)

**WF-452** (step 1) `Explicit` · confidence: `high`
- **Actor:** CSR/agent
- **Input:** Customer Portal Account Summary
- **Output:** FMS CPE Bundle asset located under Installed Assets
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Installed Assets grid (1-3 of 3) lists: FMS CPE Bundle...”

**WF-453** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Installed Assets grid
- **Output:** FMS CPE Bundle row selected, Modify clicked
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “agent selects the "FMS CPE Bundle" row...clicks the Modify button”

**WF-454** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Equipment tab, FMS CPE Indoor IDU
- **Output:** Details form opened showing current CPE attributes
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Drilling into "FMS CPE Indoor IDU"...opens its own Details form showing the currently installed CPE's attributes”

**WF-455** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Indoor Unit Serial Number field
- **Output:** Value changed S180P18055021 → S180P18055020
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “agent clicks into the "Indoor Unit Serial Number" field...changes the value from S180P18055021 to S180P18055020”

**WF-456** (step 5) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** attribute edit
- **Output:** New Sales Order 1-29737237878 generated, Order Type Modification, Status Pending
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “New Sales Order generated — Proceeding creates a new order: Order # 1-29737237878...Order Type "Modification"”

**WF-457** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** order line item attributes
- **Output:** Attribute recorded as Update action with old/new value tracked
- **Validation:** Description column preserves prior value, Value column holds new value
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Indoor Unit Se[rial Number]: Value S180P18055020, Action "Update", Description S180P18055021”

**WF-458** (step 7) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** order processing
- **Output:** Order Status progresses Pending → Open → Complete
- **Validation:** Status Context: All order lines are completed
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Order completes — Final screen shows the same order with Status: "Complete"...Status Context: "All order lines are completed"”

## UJ-090: SIM Swap - Initiated from Global Search (7 steps)

**WF-805** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Global Search icon
- **Output:** Global Search opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Global Search icon -> Enter MSISDN and click Go”

**WF-806** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** MSISDN entered
- **Output:** Customer located, Go clicked
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN and click Go -> Click SIM Swap option”

**WF-807** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Swap option selected
- **Output:** SIM Swap flow launched
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click SIM Swap option -> Verify contact details, upload QID front & Bank, click Continue”

**WF-808** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** QID front and Bank documents uploaded
- **Output:** Contact details verified, Continue clicked
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Verify contact details, upload QID front & Bank, click Continue -> Enter SIM Serial Number, select SIM Swap Reason, click Submit”

**WF-809** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial Number, SIM Swap Reason
- **Output:** Submitted
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter SIM Serial Number, select SIM Swap Reason, click Submit -> Attach SIM Swap Form, click Continue”

**WF-810** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Swap Form attachment
- **Output:** Continue clicked; order goes to Approval
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Attach SIM Swap Form, click Continue -> Order goes to Approval”

**WF-811** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order in Approval
- **Output:** Comments added, Save and Finish clicked
- **Next step:** None (proceeds to SIM Swap Approval queue - see Approval journeys)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Order goes to Approval -> Add comments, click Save and Finish.”

## UJ-091: SIM Swap Approval - Open UI Tablet Journey (Field Capture) (7 steps)

**WF-817** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Login to Open UI Tablet, SIM Swap Journey
- **Output:** Journey launched
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Login to Open UI Tablet, go to SIM Swap Journey -> Enter MSISDN, ID Type & ID Number, click Go”

**WF-818** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** MSISDN, ID Type, ID Number
- **Output:** Go clicked, contact located
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN, ID Type & ID Number, click Go -> Verify contact details, add QID front & Bank, click Continue”

**WF-819** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** QID front and Bank docs
- **Output:** Contact verified, Continue clicked
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Verify contact details, add QID front & Bank, click Continue -> Enter SIM Serial Number, select Reason, click Submit”

**WF-820** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Serial Number, Reason
- **Output:** Submitted
- **Next step:** 5
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter SIM Serial Number, select Reason, click Submit -> Click Sign Contract”

**WF-821** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Sign Contract clicked
- **Output:** Signature capture screen opened
- **Next step:** None (proceeds to next step - screen capture ends here)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Sign Contract -> Take customer signature, click Done tab”

**WF-822** (step 6) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Customer signature
- **Output:** Done clicked twice (Done tab, then Done)
- **Next step:** 7
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Take customer signature, click Done tab -> Click Done -> SIM Swap Request Form attached, click Finish”

**WF-823** (step 7) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM Swap Request Form attached
- **Output:** Finish clicked; order submitted for Approval
- **Next step:** None (proceeds to SIM Swap Approval Flow, Open UI Tablet)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “SIM Swap Request Form attached, click Finish -> Order submitted for Approval.”

## UJ-093: Existing Processes Walkthrough - New Mobile Postpaid Guided Journey (demo) (7 steps)

**WF-843** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ID scan (barcode)
- **Output:** Customer info auto-populated from MOI (greyed out)
- **Next step:** 2
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “ID scan (barcode, no OCR today), connections/plans-offered check, customer info auto-populated from MOI (greyed out)”

**WF-844** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** connections/plans-offered check
- **Output:** Existing connections verified
- **Next step:** 3
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “connections/plans-offered check”

**WF-845** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address entry
- **Output:** Address captured
- **Next step:** 4
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “address, SIM serial, plan, add-ons, discount, star/free/reserved number, CAF signature, attachments, submit”

**WF-846** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM serial entry
- **Output:** SIM serial captured
- **Next step:** 5
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “SIM serial, plan, add-ons, discount”

**WF-847** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** plan, add-ons, discount selection
- **Output:** Plan and extras chosen
- **Next step:** 6
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “plan, add-ons, discount, star/free/reserved number”

**WF-848** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** star/free/reserved number selection
- **Output:** Number selected
- **Business rule:** star number carries 1-year plan commitment vs 3-month for free number, up to 2-year lock-in for a 20,000 QAR star number on VIP plan
- **Next step:** 7
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “star/free/reserved number, CAF signature, attachments, submit ... star number carries 1-year plan commitment vs 3-month for free number”

**WF-849** (step 7) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** CAF signature and attachments
- **Output:** CAF signed, attachments captured, order submitted
- **Business rule:** CAF/attachment size limit ~4MB; signed CAF must not be editable after signing
- **Next step:** None (terminal: submitted)
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “CAF signature, attachments, submit ... CAF/attachment size limit ~4MB (01:47:35); signed CAF must not be editable after signing (01:47:31)”

## UJ-008: Enterprise Mobility Lead-to-Order (multi-channel lead capture) (6 steps)

**WF-041** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Enquiry via website callback, chat, WhatsApp, business care, or business-in-retail
- **Output:** Lead captured
- **Next step:** Lead qualification by EBU operations
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Enterprise mobility lead-to-order: customer enquiry via website callback, chat, WhatsApp, business care, or business-in-retail; lead qualification by EBU operations; assignment to an account manager”

**WF-042** (step 2) `Explicit` · confidence: `high`
- **Actor:** EBU Operations
- **Input:** Captured lead
- **Output:** Qualified lead
- **Next step:** Assignment to account manager
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “lead qualification by EBU operations; assignment to an account manager”

**WF-043** (step 3) `Explicit` · confidence: `high`
- **Actor:** Account Manager
- **Input:** Qualified lead
- **Output:** Documents collected (CAF, MSA, service-specific forms)
- **Next step:** Credit control
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, MSA, and service-specific forms); credit control; discount approval in MS Dynamics via the EBU hierarchy”

**WF-044** (step 4) `Explicit` · confidence: `high`
- **Actor:** Credit control team
- **Input:** Collected documents
- **Output:** Credit control result
- **Next step:** Discount approval in MS Dynamics via EBU hierarchy
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “credit control; discount approval in MS Dynamics via the EBU hierarchy; handover to fulfilment for account/parent account creation and number activation.”

**WF-045** (step 5) `Explicit` · confidence: `high`
- **Actor:** EBU hierarchy approver (MS Dynamics)
- **Input:** Discount request
- **Output:** Approved discount
- **Next step:** Handover to fulfilment
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “discount approval in MS Dynamics via the EBU hierarchy; handover to fulfilment for account/parent account creation and number activation.”

**WF-046** (step 6) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** Approved discount and documents
- **Output:** Account/parent account created; number activated
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “handover to fulfilment for account/parent account creation and number activation.”

## UJ-014: MNP Port-In (Mobile Number Portability, consumer) (6 steps)

**WF-059** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales
- **Input:** Customer request to port in
- **Output:** CAF, MNP form, QID/passport sent to fulfilment
- **Next step:** Fulfilment validates and creates order in Siebel
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “MNP: sales sends CAF, MNP form and QID/passport to fulfilment; fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details”

**WF-060** (step 2) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** CAF, MNP form, QID/passport
- **Output:** Order created in Siebel with plan, MNP category, porting details, reserved temp MSISDN, attachments
- **Validation:** Attachments must be under 2MB, PDF or JPG; DNO verification type
- **Next step:** Customer sends consent SMS
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details...a reserved zero-value temporary MSISDN, and attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

**WF-061** (step 3) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Order created
- **Output:** Consent SMS sent
- **Validation:** Must be sent within 24 hours
- **Next step:** Request routed via NPAS to Ooredoo
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

**WF-062** (step 4) `Explicit` · confidence: `high`
- **Actor:** Ooredoo (donor operator, via NPAS)
- **Input:** Ported request
- **Output:** Accept / reject / conditional accept decision
- **Validation:** 24 hours to decide; payment window is 8 business hours (presented to customer as 24 hours) if outstanding dues
- **Business rule:** Only 13 documented rejection reasons are valid
- **Next step:** If accepted, porting window scheduled; if rejected, journey restarts
- **Exception flow:** Each rejection restarts the whole MNP journey
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues (stated payment window is 8 business hours, presented to the customer as 24 hours). ... Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey.”

**WF-063** (step 5) `Explicit` · confidence: `high`
- **Actor:** Donor operator (Ooredoo) / Vodafone
- **Input:** Accepted port with scheduled date
- **Output:** Number ported
- **Validation:** Porting window Sunday–Thursday 11am–12pm; shared one-hour window; requests before 10:45am make that day's window
- **Next step:** Post-port-in billing/dunning
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Porting window: Sunday–Thursday, 11am–12pm, a shared one-hour window in which the donor disconnects and Vodafone connects; requests accepted before 10:45am make that day's window.”

**WF-064** (step 6) `Explicit` · confidence: `high`
- **Actor:** System/Billing
- **Input:** Ported number
- **Output:** Final bill covering last cycle to porting date
- **Validation:** Payable within 30 days
- **Business rule:** Three-level degradation/dunning ladder
- **Next step:** Dunning ladder if unpaid: outgoing bar day 31, incoming bar day 45, disconnection + number return, 30-day quarantine
- **Exception flow:** Degradation initiated by Ooredoo (donor); de-automated to manual after complaints from customers with legitimate bill disputes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “After port-in, a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs (outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine). Degradation is initiated by Ooredoo (the donor) and was de-automated to manual after complaints from customers with legitimate bill disputes.”

## UJ-042: Postpaid New Connection - Retail Channel (Session 1, foundational) (6 steps)

**WF-107** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Arrival at store
- **Output:** Qnomy token issued
- **Next step:** 2
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “walks the postpaid new-connection (activation) journey for the retail channel end to end — Qnomy token, ID scan/MOI validation...”

**WF-108** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** QID/ID document
- **Output:** OCR-scanned ID data + MOI API lookup result
- **Validation:** MOI API is primary; Tarasol/manual is fallback only if MOI API doesn't respond; MOI data takes precedence over OCR only after secondary-parameter cross-check (DOB, nationality, expiry) passes
- **Business rule:** QID mandatory for postpaid (except one unspecified exception); expats on passport limited to prepaid, max 5 numbers
- **Next step:** 3
- **Exception flow:** OCR misread of QID number (e.g. 0 read as 8) could pull wrong MOI record; QID cards can be damaged/scratched causing OCR failure; a misread ID number could coincidentally still match an expiry date, defeating two-factor validation
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “ID scan/MOI validation; eligibility/credit/blacklist checks...Risk flagged: OCR misreads of the QID number...could pull the wrong MOI customer record”

**WF-109** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (Siebel/DXP)
- **Input:** Customer ID, nationality
- **Output:** Eligibility/credit/blacklist check result
- **Validation:** eligibility for new postpaid based on "in collection" status and blacklist, NOT outstanding amount; billing profile enters collection once overdue exceeds 100; max mobility lines unlimited for Qataris, max 5 for non-nationals (per operator)
- **Business rule:** CRA (regulator) line-cap rule; override requires authorized-officer role flag on account, not in-journey bypass
- **Next step:** 4
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “eligibility for new postpaid is based on "in collection" status and blacklist, NOT outstanding amount...maximum mobility lines (prepaid + postpaid combined) — UNLIMITED for Qatari nationals, maximum 5 for non-nationals”

**WF-110** (step 4) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** Plan choice, device, number, SIM/eSIM selection
- **Output:** Cart with plan/device/number/SIM
- **Business rule:** star number value entitlement driven by plan value; excess paid at point of sale; HRN customers pay upfront advance (nationality/channel-driven, not plan-value-driven)
- **Next step:** 5
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “plan/device/number/SIM selection, checkout, CAF, and WinCash payment...Star number rule: plan value determines star-number value entitlement”

**WF-111** (step 5) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Cart, CAF form
- **Output:** Signed CAF
- **Next step:** 6
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “checkout, CAF, and WinCash payment”

**WF-112** (step 6) `Explicit` · confidence: `high`
- **Actor:** Agent/WinCash
- **Input:** Payment amount (HRN advance / star number delta if applicable)
- **Output:** Completed payment, activation
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “checkout, CAF, and WinCash payment — establishing baseline business rules”

## UJ-020: SIM Swap - Retail Channel (6 steps)

**WF-128** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer ID document
- **Output:** OCR of ID performed
- **Next step:** Barcode match
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Validation chain: OCR of ID → match barcode → MOI API (name, DOB, nationality) → match against existing CBS/customer information”

**WF-129** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (IDWise)
- **Input:** Scanned ID (front+back captured in one event)
- **Output:** Barcode matched
- **Validation:** IDWise captures front+back and does OCR in one event
- **Next step:** MOI API validation
- **Exception flow:** Open question on Arabic translation support
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “is a separate barcode scan needed (answered: no, IDWise does both in one capture)”

**WF-130** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (MOI API)
- **Input:** Name, DOB, nationality from scanned ID
- **Output:** MOI validation result
- **Validation:** Matched against government MOI records
- **Next step:** Match against existing CBS/customer information
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “MOI API (name, DOB, nationality)”

**WF-131** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** MOI-validated identity data
- **Output:** Match confirmed against existing CBS/customer information
- **Validation:** Extra third validation step specific to SIM Swap
- **Next step:** Approval and form requirement per channel
- **Exception flow:** Named fraud risk: genuine ID belonging to someone else passes all three checks
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “match against existing CBS/customer information (SIM Swap has this extra third validation step)... the number one fraud reason for service operations and activations is someone bringing someone else's [genuine] ID”

**WF-132** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent/Manager
- **Input:** SIM swap form, ID attachment
- **Output:** Approval obtained (retail requires approval + form + ID attachment)
- **Validation:** Approval matrix per channel
- **Next step:** Charging applied based on SIM type
- **Exception flow:** Agents cannot manually enter ID details, only re-scan; manager bypass allows editing QID number only
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Retail requires approval + SIM swap form + ID attachment... agents cannot manually enter ID details, only re-scan; a manager-level bypass allows editing QID number only”

**WF-133** (step 6) `Explicit` · confidence: `high`
- **Actor:** WinCash/System
- **Input:** SIM swap type (eSIM-eSIM, eSIM-physical, lost, damaged)
- **Output:** Charge applied or waived
- **Validation:** eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “charging rules — eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged”

## UJ-092: Future Dated Order (FDO) - Pre-to-Post Migration (6 steps)

**WF-828** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order creation with FDO time/date slot selected
- **Output:** FDO request raised, status Initial
- **Business rule:** maximum 30 days ahead for an FDO
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Applicable to Consumer and Enterprise segments ... maximum 30 days ahead for an FDO; order ID and FDO request ID are cross-stamped in a custom table”

**WF-829** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** FDO in Initial status
- **Output:** Customer/agent can view, edit, cancel until point of no return
- **Validation:** all modification/cancellation allowed only while status is Initial
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Customer can view, edit and cancel a future-dated request before the 'point of no return.' ... all modification/cancellation allowed only while status is Initial”

**WF-830** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** 3-day-before reminder notification
- **Output:** SMS and billing email sent to MSISDN and notification MSISDN
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Notifications: sent to MSISDN and notification MSISDN via SMS and billing email for submission, 3-day-before reminder, execution success/failure”

**WF-831** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Execution date reached; validation run
- **Output:** Blocks execution if FMS/MOI/collection-barred/blacklisted MSISDN or passport-ID customer, or upfront payment requested in same order
- **Business rule:** Pre-to-Post FDO validation rules
- **Next step:** 5
- **Exception flow:** if FDO execution fails validation the request is cancelled with error captured; failed FDO orders must not be cancelled manually
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “system validation blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order”

**WF-832** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Manual checks before raising FDO
- **Output:** HRN fee collected/posted upfront; billing profile created via BAU journey (not FDO)
- **Business rule:** Manual agent checks: collect/post HRN fee before raising FDO; billing profile must be created via BAU journey, not FDO
- **Next step:** 6
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Manual agent checks: collect/post HRN fee before raising FDO; billing profile must be created via BAU journey, not FDO.”

**WF-833** (step 6) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Execution date processing
- **Output:** Status becomes Success or Failed
- **Next step:** None (terminal: Success or Failed)
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO statuses: Initial, In-Progress, Order Submitted, Success, Failed, Cancelled — each defined in the document.”

## UJ-094: Existing Processes Walkthrough - MNP Switch Journey (demo) (6 steps)

**WF-861** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** QID capture
- **Output:** QID captured first
- **Next step:** 2
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “MNP switch journey: QID first, payment before donor submission, plan selection”

**WF-862** (step 2) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Payment
- **Output:** Payment collected before donor submission
- **Next step:** 3
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “payment before donor submission, plan selection, donor details”

**WF-863** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** plan selection
- **Output:** Plan chosen
- **Next step:** 4
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “plan selection, donor details (number, ID type/number registered with donor)”

**WF-864** (step 4) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** donor details: number, ID type/number registered with donor; donor attachment
- **Output:** Donor details and attachment captured; pre-populated MNP form generated
- **Next step:** 5
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “donor details (number, ID type/number registered with donor), donor attachment, pre-populated MNP form”

**WF-865** (step 5) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Two signatures required
- **Output:** Both signatures captured
- **Business rule:** two signatures (legal requirement per review team)
- **Next step:** 6
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “two signatures (legal requirement per review team, 01:27:37)”

**WF-866** (step 6) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** SMS to clearinghouse shortcode
- **Output:** Porting confirmed by customer; charged QR 1
- **Business rule:** mandatory customer SMS to a clearinghouse shortcode to confirm porting (charged QR 1; no SMS sent on rejection)
- **Next step:** None (terminal: porting confirmed)
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “a mandatory customer SMS to a clearinghouse shortcode to confirm porting (charged QR 1; no SMS sent on rejection)”

## UJ-003: Enterprise IoT/Service Fulfilment (Fleet Management, Global M2M, DAPN, PTT, Microsoft, Starlink, Broadband bundles) (5 steps)

**WF-031** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Account Manager
- **Input:** Customer request
- **Output:** Request forwarded
- **Next step:** EBU PM review
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “End-to-end flow described: account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN → delivery (physical, by SBN) and provisioning → provisioning successful → client accepts → billing”

**WF-032** (step 2) `Explicit` · confidence: `medium`
- **Actor:** EBU PM
- **Input:** Customer request
- **Output:** Order raised
- **Next step:** Acceptance by Fulfilment, ETS, EBU, SBN
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN”

**WF-033** (step 3) `Explicit` · confidence: `medium`
- **Actor:** Fulfilment/ETS/EBU/SBN
- **Input:** Raised order
- **Output:** Order accepted
- **Next step:** Delivery (physical, by SBN) and provisioning
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “acceptance by Fulfilment, ETS, EBU and SBN → delivery (physical, by SBN) and provisioning”

**WF-034** (step 4) `Explicit` · confidence: `medium`
- **Actor:** SBN
- **Input:** Accepted order
- **Output:** Delivery and provisioning completed
- **Validation:** Provisioning successful
- **Next step:** Client accepts
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “delivery (physical, by SBN) and provisioning → provisioning successful → client accepts → billing”

**WF-035** (step 5) `Explicit` · confidence: `medium`
- **Actor:** Client/System
- **Input:** Provisioned service
- **Output:** Client acceptance
- **Next step:** Billing (service activation for charging)
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “provisioning successful → client accepts → billing (meaning service activation for charging, not immediate invoice).”

## UJ-019: Transfer of Ownership/Number - Retail Channel (5 steps)

**WF-087** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Existing and new customer identity data
- **Output:** System and document validation result
- **Validation:** Existing/new customer validation rules
- **Next step:** OCR check / POA exception handling
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Walked through the current retail TON flow: system and document validations for existing and new customers”

**WF-088** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** OCR scan or role-based bypass; POA (power of attorney) if applicable
- **Output:** Identity verification pass, or POA-based exception granted
- **Validation:** OCR bypass by role; POA exceptions
- **Next step:** TON/prepaid migration fee applied
- **Exception flow:** POA-based exceptions
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “OCR bypass by role, POA (power of attorney)-based exceptions”

**WF-089** (step 3) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** TON and prepaid-migration fee rules
- **Output:** Fee applied per business rule
- **Validation:** Fee governed by business rules
- **Next step:** Offline SMS-based communication to relevant parties
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “TON and prepaid-migration fees and their business rules, offline SMS-based communication”

**WF-090** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Completed TON request
- **Output:** Ticket routed to one of four queues
- **Validation:** Four-queue routing: Managing queue, CDM, BOQ, QATQ
- **Next step:** Queue-specific processing
- **Exception flow:** Null/blank number price causes unnecessary CDM queue tickets (legacy data/design gap)
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “four-queue ticket routing through the Managing queue, CDM, BOQ and QATQ... a null/blank number price causing unnecessary CDM queue tickets”

**WF-091** (step 5) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Completed and approved TON
- **Output:** SIM swap on success; TON order visible only on new account
- **Validation:** Mandatory approvals agreed as a control
- **Business rule:** Agreed controls: SIM swap on success, and mandatory approvals
- **Exception flow:** Address not updated after TON (known gap)
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Agreed controls: SIM swap on success, and mandatory approvals... TON order visibility only available on the new account; address not being updated after TON”

## UJ-041: Transfer of Number - Third-Party TON on Cancelled ID (5 steps)

**WF-338** (step 1) `Explicit` · confidence: `high`
- **Actor:** MOI (Ministry of Interior)
- **Input:** MOI data file
- **Output:** File shared with Vodafone BI
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “third-party TON on cancelled ID — original customer's ID is cancelled (left country or deceased), detected only reactively via MOI file/BI-built hold-down and invalid-ID tables...MOI shares a file”

**WF-339** (step 2) `Explicit` · confidence: `high`
- **Actor:** BI
- **Input:** MOI file
- **Output:** Hold-down table and invalid-ID table built
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “BI builds a hold-down table and invalid-ID table”

**WF-340** (step 3) `Explicit` · confidence: `high`
- **Actor:** Ops/System
- **Input:** Hold-down/invalid-ID tables
- **Output:** Bulk notes uploaded to Siebel Open UI monthly
- **Next step:** 4
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “bulk notes uploaded to Siebel Open UI monthly”

**WF-341** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Eligible user list
- **Output:** SMS sent to eligible users
- **Next step:** 5
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “an SMS is sent to eligible users who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store”

**WF-342** (step 5) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Physical SIM (or eSIM screenshot) plus SMS
- **Output:** Presented at store to initiate TON
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store”

## UJ-003: Enterprise (EBU) Account Setup & Activation — Direct Sales Handover (4 steps)

**WF-027** (step 1) `Explicit` · confidence: `high`
- **Actor:** Account Manager
- **Input:** Closed enterprise deal
- **Output:** Documents and order form forwarded by email/portal
- **Next step:** Mandatory CR-number search
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Enterprise sales-to-fulfilment handover: deal closed by account manager, forwarded by email/portal with documents and order form.”

**WF-028** (step 2) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** CR number
- **Output:** Confirmed CR search result
- **Validation:** Mandatory CR-number search required before account creation
- **Next step:** Account creation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation.”

**WF-029** (step 3) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** Name, CR type/ID type, CR number, agent ID, business type, credit limit
- **Output:** Parent account created (documentation-only placeholder)
- **Validation:** Enterprise has no default credit limit; requires business finance approval
- **Business rule:** Parent/sub-account model: only two levels; one unique parent per customer
- **Next step:** Sub-account creation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit — enterprise has no default credit limit and requires business finance approval.”

**WF-030** (step 4) `Explicit` · confidence: `high`
- **Actor:** Account Manager
- **Input:** Attached affiliation form named 'QID_subaccount'
- **Output:** Approved account affiliation granting privileges and Web Self-Care access
- **Validation:** Attachment must be named 'QID_subaccount'
- **Business rule:** Requests only accepted from chooser's registered email
- **Next step:** Authorised persons/choosers can transact on sub-account
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount".”

## UJ-012: DAPN Activation Order Journey (4 steps)

**WF-055** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales/EBU PM
- **Input:** Lead
- **Output:** Qualified lead
- **Next step:** Contract document collection
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “DAPN activation: lead, qualification, contract document collection by EBU PM and sales, order desk validation, back-end APN configuration and an SR raised in the back end.”

**WF-056** (step 2) `Explicit` · confidence: `high`
- **Actor:** EBU PM and Sales
- **Input:** Qualified lead
- **Output:** Contract documents collected
- **Next step:** Order desk validation
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “contract document collection by EBU PM and sales, order desk validation, back-end APN configuration and an SR raised in the back end.”

**WF-057** (step 3) `Explicit` · confidence: `high`
- **Actor:** Order Desk
- **Input:** Contract documents
- **Output:** Order desk validation result
- **Next step:** Back-end APN configuration
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “order desk validation, back-end APN configuration and an SR raised in the back end.”

**WF-058** (step 4) `Explicit` · confidence: `high`
- **Actor:** Back-end team
- **Input:** Validated order
- **Output:** Back-end APN configuration completed; SR raised
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “back-end APN configuration and an SR raised in the back end.”

## UJ-015: FNP Port-In (Fixed Number Portability, fiber-to-fiber, consumer) (4 steps)

**WF-065** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field/Installation team
- **Input:** Customer FNP request
- **Output:** Installation/RFS check completed
- **Business rule:** Consumer only; 5 working days total
- **Next step:** Trouble ticket raised
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP (fiber-to-fiber only, consumer, 5 working days): installation/RFS check happen first; a trouble ticket is raised with a manually calculated target date”

**WF-066** (step 2) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** FNP form (mandatory Karma ID) and ID
- **Output:** Sent via NPAS to Ooredoo
- **Validation:** Karma ID mandatory
- **Next step:** Ooredoo validates documents
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP form (mandatory Karma ID) and ID sent via NPAS to Ooredoo, who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date.”

**WF-067** (step 3) `Explicit` · confidence: `high`
- **Actor:** Ooredoo (donor, via NPAS)
- **Input:** FNP form and ID
- **Output:** Conditional acceptance with visible due amount, then acceptance with porting date
- **Validation:** 3 working days for consumer to clear due amount
- **Business rule:** FNP porting is at service level (vs. MNP's number level)
- **Next step:** Two technician visits scheduled
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date. FNP porting is at service level (vs. MNP's number level) and always needs two technician visits”

**WF-068** (step 4) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Accepted porting date, WFM schedule
- **Output:** Two technician visits completed (installation visit + porting-date MSISDN configuration/testing visit)
- **Next step:** Post-port-in billing/dunning (same as MNP)
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “always needs two technician visits — one for installation per WFM, one on the porting date for MSISDN configuration/testing.”

## UJ-013: Bulk SMS Onboarding and Lifecycle (Enterprise) (4 steps)

**WF-069** (step 1) `Explicit` · confidence: `high`
- **Actor:** Account Manager
- **Input:** Customer request for Bulk SMS
- **Output:** Assisted onboarding started with short code and SMTP checks
- **Business rule:** External international short code registration
- **Next step:** Fulfilment and control document approval
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Bulk SMS journey walked through end to end: assisted onboarding via account manager with short code and SMTP checks; external international short code registration; fulfilment and control document approval”

**WF-070** (step 2) `Explicit` · confidence: `high`
- **Actor:** Fulfilment
- **Input:** Approved control documents
- **Output:** Account and order created in Siebel
- **Next step:** Integration through OSM to Bulk SMS platform
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “fulfilment and control document approval; account and order creation in Siebel; integration through OSM to a separate Bulk SMS platform”

**WF-071** (step 3) `Explicit` · confidence: `high`
- **Actor:** OSM / Bulk SMS platform
- **Input:** Created order
- **Output:** Aggregated rated CDRs received on the first of the month
- **Business rule:** Billing owned by Bulk SMS platform
- **Next step:** Disconnection handling if applicable
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “billing owned by the Bulk SMS platform with aggregated rated CDRs received on the first of the month”

**WF-072** (step 4) `Explicit` · confidence: `high`
- **Actor:** OnMobile / Support
- **Input:** Disconnection request
- **Output:** Disconnection completed
- **Validation:** Outstanding-balance checks and OnMobile confirmation required
- **Business rule:** Support split between Remedy tickets (to OnMobile) and Siebel adjustments (for billing config issues)
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “disconnection with outstanding-balance checks and OnMobile confirmation; support split between Remedy tickets (to OnMobile) and Siebel adjustments (for billing config issues).”

## UJ-042: Postpaid New Customer Journey - CAF Signature and Payment (Retail) (4 steps)

**WF-103** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer data captured on laptop
- **Output:** CAF generated
- **Validation:** CAF must have unique serial/ID and naming convention
- **Next step:** View shifts to tablet for signature
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF will display on tablet for customer signature only, with view shifting laptop→tablet→laptop”

**WF-104** (step 2) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** CAF with configurable highlighted key T&Cs section
- **Output:** Digital signature captured on tablet
- **Validation:** Highlighted section is business-admin-controlled, not agent-selected
- **Business rule:** Digital signature pad must move from OpenUI integration to new custom Siebel/DXP frontend
- **Next step:** View shifts back to laptop
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “a configurable, business-admin-controlled "highlighted key T&Cs" section will be added to the CAF flow... digital signature pad must move from OpenUI integration to the new custom Siebel/DXP frontend”

**WF-105** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent/WinCash
- **Input:** Order total (including zero-payment cases)
- **Output:** Payment processed / receipt printed
- **Validation:** WinCash must be integrated even for zero-payment transactions to print receipts
- **Next step:** Order submission confirmation
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “WinCash must be integrated even for zero-payment transactions to print receipts”

**WF-106** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Submitted order
- **Output:** Confirmation message "order submitted successfully" shown
- **Validation:** Changed from "account activated" since provisioning still goes through OSM/Siebel after submission
- **Next step:** Order proceeds through OSM/Siebel provisioning
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “confirmation message text to be changed from "account activated" to "order submitted successfully" since provisioning still goes through OSM/Siebel after submission”

## UJ-022: Trouble Ticket - Agent Ticket Creation (Template-Driven) (4 steps)

**WF-140** (step 1) `Explicit` · confidence: `high`
- **Actor:** Front Line Agent
- **Input:** Customer complaint/request, issue type
- **Output:** Specific template selected for issue type
- **Next step:** 2
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “notes each ticket/issue type has a specific template that agents fill in and paste into "Open UI Tickets Fields"”

**WF-141** (step 2) `Explicit` · confidence: `high`
- **Actor:** Front Line Agent
- **Input:** Filled template
- **Output:** Template content pasted into Open UI Tickets Fields
- **Next step:** 3
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “agents fill in and paste into "Open UI Tickets Fields"”

**WF-142** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** New ticket / Re-Opened ticket
- **Output:** Automated SMS sent to customer
- **Business rule:** SMS Content is controlled within teams
- **Next step:** 4
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Automated SMS for Tickets (New Ticket, Re-Opened Ticket — "SMS Content is controlled within teams")”

**WF-143** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Ticket attributes
- **Output:** Ticket auto-assigned to queue
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Auto Assigning to Queue”

## UJ-030: Device Installment (DOI) - Current Retail Process (4 steps)

**WF-181** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent/Portal
- **Input:** Customer QID
- **Output:** DOI eligibility determined via "big data" logic
- **Next step:** WinCash stock check/reservation
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “current retail process (portal eligibility via "big data" logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order)”

**WF-182** (step 2) `Explicit` · confidence: `high`
- **Actor:** WinCash/System
- **Input:** Device selection
- **Output:** Stock checked and reserved
- **Next step:** Signature captured in portal
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order”

**WF-183** (step 3) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Signature
- **Output:** Signature captured via portal pad
- **Next step:** WinCash payment collected
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “signature pad in portal, WinCash payment, Siebel order”

**WF-184** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Payment confirmation
- **Output:** Siebel order created
- **Validation:** Disputed whether order submission is automated or manually submitted by fulfilment team within 24 hours
- **Exception flow:** Unresolved conflict flagged — action item to confirm, owner Hisham
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “WinCash payment, Siebel order... disagreement between participants on whether the DOI Siebel order submission is automated or still manually submitted by the fulfillment team within 24 hours”

## UJ-034: Instant Activation - Fixed Line (OpenGate tablet, dual-play no OSN) (4 steps)

**WF-270** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (UIM)
- **Input:** KID, CPE serial
- **Output:** KID-to-CPE mapping validated, device capability confirmed
- **Validation:** UIM validates KID-to-CPE mapping and device capability
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “UIM validates KID-to-CPE mapping and device capability”

**WF-271** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Device serial
- **Output:** Verified device serial
- **Validation:** agent (not customer) verifies device serial
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “agent (not customer) verifies device serial”

**WF-272** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Verified device/KID
- **Output:** Appointment-booking step skipped
- **Business rule:** appointment-booking step is auto-skipped for instant activation
- **Next step:** 4
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “appointment-booking step is auto-skipped and flow goes straight to CAP signature”

**WF-273** (step 4) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** CAP form
- **Output:** Signed CAP
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “flow goes straight to CAP signature; today limited to the dual-play (no OSN) case”

## UJ-036: New FWA 5G Indoor Connection (4 steps)

**WF-276** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address / fiber feasibility check
- **Output:** Fiber-first eligibility determination
- **Business rule:** fiber-first selling policy — FWA/5G only offered if fiber cannot be sold at that location; not a customer choice
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “fiber-first selling policy — FWA/5G is only offered if fiber cannot be sold at that location; not a customer choice”

**WF-277** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** ZSP, email, address
- **Output:** ZSP entered, presence-validated
- **Validation:** ZSP entry mandatory; email/address fields validated for presence only, not format (gap)
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “ZSP entry mandatory but email/address fields are validated for presence only, not format — flagged as a data-quality gap/requirement”

**WF-278** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** SIM (WinCash), CPE (UIM)
- **Output:** SIM and CPE separately scanned/depleted with separate SPOs
- **Business rule:** customer cannot bring their own CPE
- **Next step:** 4
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE”

**WF-279** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Device/SIM pairing
- **Output:** Site lock applied
- **Business rule:** site lock introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere — abuse-prevention control
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Site lock is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere — explicit abuse-prevention control”

## (unmatched to a Stage A journey) Postpaid CAF Signing - In-store (PCA001 form) (4 steps)

**WF-347** (step 1) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Identity documents (QID/passport/GCC ID)
- **Output:** Section 1 applicant details completed on CAF
- **Next step:** 2
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Section 1 – Applicant details: Date*, Retailer ID, Customer type, Name*, Date of birth*, Qatar ID number*...”

**WF-348** (step 2) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Billing preferences and payment method
- **Output:** Section 2 billing information completed
- **Validation:** credit-card authorization consent clause allowing Vodafone to charge the card periodically and to recover amounts unpaid 90+ days after bill issue
- **Next step:** 3
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Section 2 – Billing information: Account credit limit, Bill date cycle, Bill format...plus a credit-card authorization consent clause”

**WF-349** (step 3) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Mobile plan selection
- **Output:** Section 3 postpaid customer details signed
- **Validation:** minimum subscription period of 3 months applies; first month's charges prorated plus full charge for following month
- **Next step:** 4
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Section 3 – For Postpaid Customers: Mobile number* (Primary mobile number, Voice/Data SIM type), Postpaid Plan* (note: minimum subscription period of 3 months applies)...proration disclosure”

**WF-350** (step 4) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Broadband/Home Phone selection (optional)
- **Output:** Section 4 Superfast Broadband & Home Phone signed
- **Validation:** references Vodafone Home T&Cs and the "Vodafone Fibre Supplementary Form"
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Section 4 – Superfast Broadband & Home Phone: Landline Number, International Calling Enabled, Plan Name...plus an acknowledgment clause referencing Vodafone Home T&Cs and the "Vodafone Fibre Supplementary Form."”

## (unmatched to a Stage A journey) CRM Journey Taxonomy Reconstruction (Analytical Traceability Model) (4 steps)

**WF-364** (step 1) `Explicit` · confidence: `high`
- **Actor:** Analyst (project team)
- **Input:** 165 Page Type rows with flat Type tag, no parent-ID column
- **Output:** 15 analytical Functional Clusters
- **Next step:** Build hierarchy tree
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “the sheet introduces 15 analytical 'Functional Clusters' to reconstruct the Workflow/Process/Task layer”

**WF-365** (step 2) `Explicit` · confidence: `high`
- **Actor:** Analyst (project team)
- **Input:** 15 Functional Clusters
- **Output:** Full indented hierarchy tree: User Journey → Workflow/Process → Task → View/Screen → Action → Access/Permission
- **Next step:** Build Complete Traceability Matrix
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “User Journey → Workflow/Process → Task → View/Screen → Action → Access/Permission”

**WF-366** (step 3) `Explicit` · confidence: `high`
- **Actor:** Analyst (project team)
- **Input:** Hierarchy tree
- **Output:** 165-row Complete Traceability Matrix, Relationship Catalogue (22 entries)
- **Next step:** Validation checks and gap analysis
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “a 165-row Complete Traceability Matrix (Excel Table TraceabilityMatrix), a curated Relationship Catalogue (22 entries)”

**WF-367** (step 4) `Explicit` · confidence: `high`
- **Actor:** Analyst (project team)
- **Input:** Traceability Matrix
- **Output:** Validation Checks, Gap Analysis Report
- **Business rule:** 143 of 165 records (86.7%) have no confident User Journey parent — 9 of 15 functional clusters are BAU/account-servicing capability with no anchor journey
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “Validation Checks (missing-parent / duplicate / reusability analysis), and a Gap Analysis Report”

## UJ-075: RFS Portal - Sales agent fixed/fibre address feasibility lookup and lead creation (4 steps)

**WF-622** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales agent
- **Input:** Search by ZSB address, Karama ID, or area
- **Output:** RFS status, potentials, SLA/cluster (F1-F4) displayed
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “sales-facing app; search by ZSB address, Karama ID, or area; shows RFS status, potentials, SLA/cluster (renamed from 1-4 to F1-F4)”

**WF-623** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (RFS Portal)
- **Input:** ZSB match from IMS via GTM file + live active-service/KID status from UIM
- **Output:** Combined top-level and live status data rendered on ZSB page
- **Validation:** reverse sync back to IMS
- **Next step:** 3
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “top-level data from IMS via GTM file, live active-service/KID status from UIM with reverse sync back to IMS”

**WF-624** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (Big Data model)
- **Input:** ZSB filter
- **Output:** Plan/offer recommendations, steering toward FWA/5G where fibre not yet connected
- **Validation:** N/A
- **Next step:** 4
- **Exception flow:** fibre unavailability areas force fallback to FWA/5G sales
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Plan/offer recommendations come from a separate Big Data deep-learning file filtered by ZSB, steering sales toward FWA/5G where fibre isn't yet connected”

**WF-625** (step 4) `Explicit` · confidence: `high`
- **Actor:** Sales agent
- **Input:** MSISDN captured in Portal
- **Output:** Siebel lead created via API
- **Validation:** no lead is created without MSISDN; MSISDN is not a search key
- **Next step:** N/A (lead handed to lead management)
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

## UJ-091: SIM Swap Approval - Open UI Desktop (Approver Queue Flow) (4 steps)

**WF-812** (step 1) `Explicit` · confidence: `high`
- **Actor:** Approver/Agent
- **Input:** Click Queue
- **Output:** SIM Swap Queue selected, Order tasks tab opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Queue -> Select SIM Swap Queue, click Order tasks tab -> Sort by Created Date or search Order Number”

**WF-813** (step 2) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Sort/search order list
- **Output:** Order selected, Assign to Me clicked
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Sort by Created Date or search Order Number -> Select order, click Assign to Me -> Click Order ID hyperlink”

**WF-814** (step 3) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Order ID hyperlink clicked
- **Output:** Order detail scrolled, Approve or Reject the Task
- **Next step:** 4a or 4b
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Order ID hyperlink -> Scroll down, Approve or Reject the Task”

**WF-815** (step 4a) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Approve action
- **Output:** Comments popup opened, Submit clicked; task closes, Order Completed
- **Next step:** None (terminal: Order Completed)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “On Approve, pop-up opens to add comments and Submit -> On Submit, task closes and Order is Completed.”

## UJ-091: SIM Swap Approval Flow - Open UI Tablet (Approver Side) (4 steps)

**WF-824** (step 1) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Approval Journey navigation
- **Output:** Order Approval Queue selected, Order Activities Queue opened
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Go to Approval Journey -> Select Order Approval Queue, go to Order Activities Queue (sort/search)”

**WF-825** (step 2) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Order selected
- **Output:** Assign to Me clicked
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Select order, click Assign to Me -> Go to My Activities, click Order ID hyperlink”

**WF-826** (step 3) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** My Activities, Order ID hyperlink
- **Output:** Attachments validated
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Go to My Activities, click Order ID hyperlink -> Validate Attachments”

**WF-827** (step 4) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Validated attachments
- **Output:** Approve or Reject/Drop Order; returns to My Activities Page
- **Next step:** None (terminal: Approved or Rejected/Dropped)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Validate Attachments -> Approve or Reject/Drop Order — moves back to My Activities Page.”

## UJ-092: Future Dated Order (FDO) - Post-to-Pre Migration (4 steps)

**WF-834** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** FDO request raised for Post-to-Pre migration
- **Output:** Manual penalty calculation performed
- **Business rule:** agent must manually calculate penalties
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Post-to-Pre Migration: agent must manually calculate penalties, ensure outstanding is cleared (system-validated ≤0)”

**WF-835** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** 100 QR migration fee
- **Output:** Fee collected upfront; execution date limited to next bill cycle
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “limit execution date to next bill cycle, collect 100 QR migration fee upfront”

**WF-836** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Reminder date check
- **Output:** Siebel checks billed/unbilled usage
- **Validation:** outstanding must be ≤0
- **Next step:** 4
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Siebel checks billed/unbilled usage on reminder date and again at execution — cancels and notifies customer if outstanding exists.”

**WF-837** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Execution date check
- **Output:** Cancels and notifies customer if outstanding balance exists; otherwise proceeds
- **Next step:** None (terminal: executed or cancelled)
- **Exception flow:** cancels and notifies customer if outstanding exists
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Siebel checks billed/unbilled usage on reminder date and again at execution — cancels and notifies customer if outstanding exists.”

## UJ-096: Fibre Activation through Retail Agent (FIB-ACT-RTL-001) (4 steps)

**WF-878** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent / Retail Store agent
- **Input:** Customer address details
- **Output:** Installation address captured via cascading zone/street/building selection
- **Validation:** RFS search by address/KID/area
- **Next step:** 2
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_001_RFS_01`..`08` (installation address capture, cascading zone/street/building selection, RFS search by address/KID/area, address auto-fill, service-type display, CPE/ONT detection, address lock after check, proof-of-address upload ≤2MB)”

**WF-879** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (RFS Portal)
- **Input:** Address match
- **Output:** Address auto-fill, service-type display, CPE/ONT detection
- **Validation:** address lock after check
- **Next step:** 3
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “address auto-fill, service-type display, CPE/ONT detection, address lock after check”

**WF-880** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Proof-of-address document
- **Output:** Uploaded proof-of-address
- **Validation:** file size ≤2MB
- **Next step:** 4
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

**WF-881** (step 4) `Explicit` · confidence: `high`
- **Actor:** Customer/agent
- **Input:** Base plan selection
- **Output:** IPTV bundled by default with base plan (removable)
- **Validation:** contested requirement per Open Items OI-03/OI-18
- **Next step:** N/A (continues into shared CAP-01..CAP-13 reused from Mobile Postpaid BRSD)
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_001_QPC_02/03` (IPTV bundled by default with base plan, removable — flagged in Open Items as contested with VFQ business preference)”

## UJ-097: Fiber Instant Activation (FIB-ACT-RTL-002) (4 steps)

**WF-882** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (tablet channel only)
- **Input:** Customer/site details
- **Output:** Eligibility for instant activation detected
- **Validation:** tablet-only channel constraint
- **Next step:** 2
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_002_INS_01`..`07` (Instant Activation: eligibility detection, device serial verification, instant/normal explicit selection, appointment auto-skip, immediate activation trigger, failure handling, tablet-only channel constraint)”

**WF-883** (step 2) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Device serial number
- **Output:** Device serial verified
- **Validation:** device serial verification
- **Next step:** 3
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “device serial verification”

**WF-884** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Instant vs Normal explicit selection
- **Output:** Appointment auto-skipped if Instant chosen
- **Validation:** explicit selection required
- **Next step:** 4
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “instant/normal explicit selection, appointment auto-skip, immediate activation trigger”

**WF-885** (step 4) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Instant activation trigger
- **Output:** Immediate activation executed
- **Validation:** N/A
- **Next step:** N/A
- **Exception flow:** failure handling path defined for activation failure
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “immediate activation trigger, failure handling”

## UJ-106: J017 Customer 360 (DXP Agent-Assisted Aggregated View) (4 steps)

**WF-920** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Customer
- **Input:** Customer query
- **Output:** Query routed to Assisted Care Agent
- **Next step:** 2
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “query to Assisted Care Agent”

**WF-921** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Customer No / Contact No / MSISDN
- **Output:** Customer record located
- **Next step:** 3
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “search for customer by Customer No / Contact No / MSISDN”

**WF-922** (step 3) `Explicit` · confidence: `medium`
- **Actor:** System (DXP)
- **Input:** Customer identifier
- **Output:** Aggregated customer data view: CDR/Usage, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Ticket History, Order History
- **Next step:** 4
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “aggregate customer data across: CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Fetch Ticket History, Fetch Order History”

**WF-923** (step 4) `Explicit` · confidence: `medium`
- **Actor:** Agent (DXP)
- **Input:** Aggregated view
- **Output:** Retrieve bill information, retrieve CDR information, retrieve network status, retrieve customer and order details, retrieve payment and billing details
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Retrieval actions listed: retrieve bill information, retrieve CDR information, retrieve network status, retrieve customer and order details, retrieve payment and billing details, capture all search criteria”

## UJ-007: SIM Swap Approval - Vanilla Journey (in-account order creation) (3 steps)

**WF-038** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Installed Assets, select MSISDN line item
- **Output:** Modify tab clicked, order created
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Inside account, under Installed Assets, select MSISDN (Promotional Line item or Mobile Service Bundle), click Modify Tab -> Order created, go to Order Line Items”

**WF-039** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Order Line Items, expand Mobile Service Bundle
- **Output:** New SIM Serial number updated on SIM Card bundle line item (Service ID Option)
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Expand Mobile Service Bundle, update new SIM Serial number on SIM Card bundle line item (Service ID Option) -> Scroll up, click Validate, then Submit Order”

**WF-040** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Validate then Submit Order
- **Output:** Order goes to SIM Swap Approval Queue
- **Next step:** None (proceeds to SIM Swap Approval Open UI Desktop journey)
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Scroll up, click Validate, then Submit Order -> Order goes to SIM Swap Approval Queue.”

## UJ-009: Push to Talk (PTT) Order Journey (3 steps)

**WF-047** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales/Account Manager
- **Input:** Same lead-to-credit-control front end as mobility
- **Output:** Credit control cleared
- **Next step:** Pricing approval for device and SIM
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Push to Talk (PTT): same lead-to-credit-control front end, then pricing approval for device and SIM, IT and security approvals, tenant account and licence provisioning, and a service desk SR for back-end/network activation.”

**WF-048** (step 2) `Explicit` · confidence: `high`
- **Actor:** IT/Security approvers
- **Input:** Device and SIM pricing approval
- **Output:** IT and security approvals
- **Next step:** Tenant account and licence provisioning
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “pricing approval for device and SIM, IT and security approvals, tenant account and licence provisioning, and a service desk SR for back-end/network activation.”

**WF-049** (step 3) `Explicit` · confidence: `high`
- **Actor:** Service Desk
- **Input:** Provisioned tenant account/licence
- **Output:** SR raised for back-end/network activation
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “tenant account and licence provisioning, and a service desk SR for back-end/network activation.”

## UJ-011: 5G Indoor and 5G Outdoor / FWA Order Journey (3 steps)

**WF-052** (step 1) `Explicit` · confidence: `high`
- **Actor:** System/Order Desk
- **Input:** Customer address/service request
- **Output:** RFS validation result
- **Validation:** Business rule: fibre takes precedence over 5G
- **Business rule:** Fibre precedence over 5G enforced manually
- **Next step:** Document collection
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “5G Indoor and 5G Outdoor / FWA: RFS validation; the business rule that fibre takes precedence over 5G; document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

**WF-053** (step 2) `Explicit` · confidence: `high`
- **Actor:** Fulfilment/Field team
- **Input:** Collected documents
- **Output:** CPE handover and provisioning
- **Next step:** Customer acceptance signature
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “CPE handover and provisioning; customer acceptance signature; post-activation support chain through business care, the CMT team, the vendor and the field partner for device faults/changes.”

**WF-054** (step 3) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Provisioned service
- **Output:** Signed acceptance
- **Next step:** Post-activation support chain (business care → CMT → vendor → field partner)
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “customer acceptance signature; post-activation support chain through business care, the CMT team, the vendor and the field partner for device faults/changes.”

## (unmatched to a Stage A journey) Enterprise Invoice (PDF/Excel) Redesign Walkthrough (3 steps)

**WF-073** (step 1) `Explicit` · confidence: `high`
- **Actor:** Business stakeholder / Invoice design team
- **Input:** Old invoice template
- **Output:** Cosmetic-only redesign request
- **Next step:** Resolve banner/table overlap by reducing banner size and adding page-level subtotals
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “business asked for a cosmetic-only redesign of a very old template presenting the same information more clearly. Specific asks: resolve banner/table overlap by reducing banner size and adding page-level subtotals”

**WF-074** (step 2) `Explicit` · confidence: `high`
- **Actor:** Design/Dev team
- **Input:** Redesign requirements
- **Output:** Line items grouped under service ID/circuit ID; tax code/number placeholders added
- **Validation:** One-off charges linked to their circuit
- **Next step:** Match ordering between PDF and Excel; sort CDRs by date/time with number filter
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “group line items under service ID/circuit ID with one-off charges linked to their circuit; add tax code and tax number placeholders; display service ID for account-level and other services; match ordering between PDF and Excel; sort CDRs by date/time with a number filter”

**WF-075** (step 3) `Explicit` · confidence: `high`
- **Actor:** Design/Dev team
- **Input:** Discount records
- **Output:** Discounts shown as two line items (prorated and month-in-advance) against the charge they apply to
- **Next step:** Constraint: Excel one-million line item limit requires aggregation with CSV fallback; 400k-line threshold driven by email delivery size limits
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “correct discount presentation so discounts appear as two line items (prorated and month-in-advance) shown against the charge they apply to. Constraints noted: Excel has a one-million line item limit requiring aggregation with CSV fallback; a 400k-line threshold is driven by email delivery size limits.”

## UJ-018: MNP Port-Out Ticket Distribution and SLA Handling (Consumer) (3 steps)

**WF-084** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (Siebel export)
- **Input:** 200-300 tickets/day
- **Output:** Exported ticket file
- **Next step:** Manual distribution to agents
- **Exception flow:** Manual export/distribution is a pain point; bulk owner change possible as workaround
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “manual export and distribution of 200–300 tickets a day instead of direct queue assignment (bulk owner change is possible as a workaround)”

**WF-085** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Assigned ticket
- **Output:** Action taken at least an hour before SLA expiry
- **Next step:** Escalation if missed
- **Exception flow:** Suspension and CRM escalation triggered when action is missed
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “need to act at least an hour before SLA expiry; suspension and CRM escalation triggered when action is missed”

**WF-086** (step 3) `Explicit` · confidence: `high`
- **Actor:** B2B2C process
- **Input:** Payment confirmation
- **Output:** Manual status update
- **Exception flow:** Manual status update after payment for B2B2C is a pain point
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “manual status update after payment for B2B2C”

## UJ-019: Transfer of Ownership - Fixed/5G Channel (3 steps)

**WF-092** (step 1) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Fixed/5G TON request
- **Output:** OSN add-on removed
- **Next step:** OSN add-on re-added
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Fixed/5G TON covered separately: OSN add-on removal and re-add”

**WF-093** (step 2) `Explicit` · confidence: `high`
- **Actor:** Customer/System
- **Input:** New owner login/email
- **Output:** Login/email re-registered
- **Next step:** Spend limit control applied during transition
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “login/email re-registration, spend limit control during transition, and bill cycle adjustment”

**WF-094** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Billing cycle context
- **Output:** Bill cycle adjusted
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “and bill cycle adjustment”

## UJ-022: Trouble Ticket Creation - General (Open UI/Siebel) (3 steps)

**WF-137** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent, System, or Customer (via MVA)
- **Input:** Ticket source: agent-created, system-generated (eShop/NPAS/portal), Open UI Excel, or customer-originated
- **Output:** Ticket created or queued for validation
- **Validation:** MVA requests go to a validation queue before becoming an agent-created ticket
- **Next step:** Ticket assigned to team/queue
- **Exception flow:** Ticket created but not submitted does not route to any queue
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Ticket sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket)... a ticket created but not submitted does not route to any queue”

**WF-138** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Created ticket
- **Output:** Ticket assigned at team/queue level
- **Validation:** Not assigned at agent level; no automatic reassignment on delay
- **Next step:** Agent claims ticket via "assign to me"
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “tickets assigned at team/queue level, not agent level, with no automatic reassignment on delay”

**WF-139** (step 3) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Queue ticket list
- **Output:** Ticket assigned to agent
- **Validation:** "Assign to me" only works if agent is in that queue's user list
- **Exception flow:** Customer cannot reopen a ticket from the app, only an agent can
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “"assign to me" only works if the agent is in that queue's user list [02:09:00]; a customer cannot reopen a ticket from the app, only an agent can”

## UJ-026: MNP Port Out Ticket (NPAS Auto-Created) (3 steps)

**WF-152** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (NPAS)
- **Input:** Port-out event
- **Output:** Ticket auto-created from NPAS
- **Next step:** 2
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “the ticket is "Auto-Created from NPAS"”

**WF-153** (step 2) `Explicit` · confidence: `high`
- **Actor:** System / MNP Team
- **Input:** Ticket activities
- **Output:** Activities validated automatically or by MNP Team (Success/Failed status)
- **Next step:** 3
- **Exception flow:** Failed status on an activity
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status)”

**WF-154** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** All activities completed
- **Output:** Ticket status changes automatically
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “once all activities complete, ticket status changes automatically”

## UJ-030: Device Installment (DOI) - Telesales Process (3 steps)

**WF-185** (step 1) `Explicit` · confidence: `high`
- **Actor:** Telesales agent/Portal
- **Input:** Customer request
- **Output:** Portal-driven eligibility and order flow
- **Next step:** Delivery-partner confirmation
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “telesales process (portal-driven, delivery-partner confirmation, CAF generated only after delivery/order completion at Open UI)”

**WF-186** (step 2) `Explicit` · confidence: `high`
- **Actor:** Delivery partner
- **Input:** Order dispatched
- **Output:** Delivery confirmed
- **Next step:** CAF generated
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “delivery-partner confirmation, CAF generated only after delivery/order completion at Open UI”

**WF-187** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (Open UI)
- **Input:** Confirmed delivery/order completion
- **Output:** CAF generated at Open UI
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “CAF generated only after delivery/order completion at Open UI”

## UJ-030: Device Installment (DOI) - Target DXP Flow (Future State) (3 steps)

**WF-188** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (DXP)
- **Input:** Customer identity, DOI validation via EDW
- **Output:** Identity and DOI validation passed
- **Next step:** Product catalog selection in DXP
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “identity validation and DOI validation (via EDW) in DXP, product catalog in DXP, installment breakdown”

**WF-189** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (DXP)
- **Input:** Selected product
- **Output:** Installment breakdown displayed
- **Next step:** Stock validation/reservation and first-installment payment in WinCash
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “installment breakdown, stock validation/reservation and first-installment payment in WinCash”

**WF-190** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (WinCash/Siebel)
- **Input:** First-installment payment confirmed
- **Output:** Order auto-created and auto-closed (no delivery step in retail)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “order auto-created and auto-closed since there's no delivery step in retail”

## UJ-057: New FWA 5G Outdoor Connection (with indoor fallback) (3 steps)

**WF-280** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Address, fiber feasibility
- **Output:** FWA outdoor order (fiber not available)
- **Business rule:** commercially identical pricing/benefits to indoor — difference is purely technical (signal strength/equipment)
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “FWA outdoor: commercially identical pricing/benefits to indoor — the difference is purely technical (signal strength/equipment)”

**WF-281** (step 2) `Explicit` · confidence: `high`
- **Actor:** WFM (field engineer)
- **Input:** Outdoor install appointment
- **Output:** WFM appointment booked (serial scan step skipped since device needs installation)
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “requires a WFM appointment (serial scan step skipped since device needs installation)”

**WF-282** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field engineer
- **Input:** Site access/glass condition
- **Output:** Install success OR failure
- **Business rule:** Decision: replace order cancellation with an in-place order update when falling back outdoor→indoor before provisioning
- **Exception flow:** if outdoor install fails (access/glass issues), indoor is offered as fallback or the order is cancelled
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “if outdoor install fails (access/glass issues), indoor is offered as fallback or the order is cancelled...replace order cancellation with an in-place order update”

## UJ-039: Home Move - Fiber to Fiber (3 steps)

**WF-330** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Move request
- **Output:** System journey initiated
- **Business rule:** only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket, explicitly called out as "a pain point"”

**WF-331** (step 2) `Explicit` · confidence: `high`
- **Actor:** System/Field
- **Input:** New location provisioning
- **Output:** Old service stays live until new location provisioned
- **Validation:** customer always initiates (never the agent)
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Customer always initiates (never the agent); old service stays live until new location is provisioned; billing adjusted pro-rata”

**WF-332** (step 3) `Explicit` · confidence: `high`
- **Actor:** System (Billing)
- **Input:** Move completion date
- **Output:** Billing adjusted pro-rata
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “billing adjusted pro-rata”

## (unmatched to a Stage A journey) Address / Service Point Determination (Siebel, KID-based RFS lookup) (3 steps)

**WF-334** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Building's blue plate KID
- **Output:** KID search result
- **Validation:** agents can only SEARCH for a KID, never manually enter one
- **Next step:** 2
- **Exception flow:** if no KID is found, the agent is diverted to an FWA journey
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey”

**WF-335** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** KID + unit info (for partitioned villas)
- **Output:** Underscore-indexed service-point identifiers (_1,_2,_3) and Vodafone ID (VFID) assigned
- **Next step:** 3
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Vodafone appends underscore indexes (_1, _2, _3) to create unique service-point identifiers, and introduced its own Vodafone ID (VFID)...mapped 1:1 to points of presence identified by field engineers”

**WF-336** (step 3) `Explicit` · confidence: `high`
- **Actor:** System/Agent
- **Input:** Address update (from CRM or self-service)
- **Output:** Old address marked discontinued (effective-to date), new address created as primary
- **Business rule:** identical behavior required whether the update originates from CRM or self-service
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “old address marked discontinued/replaced with effective from/to dates, new address created as primary, rather than updating the address record in place”

## (unmatched to a Stage A journey) Prepaid CAF Signing - In-store (PCA001 form) (3 steps)

**WF-351** (step 1) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Vodafone mobile number, SIM serial, registration type
- **Output:** Top fields completed
- **Next step:** 2
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Top fields: Application date*, Store/Retailer ID, "Write your Vodafone mobile number here," "Write your SIM serial here," Registration type”

**WF-352** (step 2) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Identity documents (BLOCK LETTERS, originals shown)
- **Output:** Applicant details completed
- **Validation:** Please complete all sections using BLOCK LETTERS (in English) and show originals of ID documents where requested
- **Next step:** 3
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Instructions block: "Please complete all sections using BLOCK LETTERS (in English) and show originals of ID documents where requested."”

**WF-353** (step 3) `Explicit` · confidence: `high`
- **Actor:** Applicant/Customer
- **Input:** Acceptance of T&Cs
- **Output:** Signed CAF
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Acceptance: Accepting Terms and Conditions*, Signature of applicant*, and an acknowledgment statement”

## UJ-092: Future Dated Order (FDO) - Plan Change (Upgrade/Downgrade) (3 steps)

**WF-838** (step 1) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** FDO plan change request
- **Output:** Validates plan eligibility, non-collections billing profile, non-barred MSISDN
- **Business rule:** plan eligibility, non-collections billing profile, non-barred MSISDN validations
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Plan Change (Upgrade/Downgrade): validates plan eligibility, non-collections billing profile, non-barred MSISDN”

**WF-839** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Add-on/discount selection eligible for new plan
- **Output:** Add-on/discount bundled into same FDO order
- **Next step:** 3
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “add-on/discount eligible for new plan can ride in same FDO; pro-rata charges still apply”

**WF-840** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Plan change executes
- **Output:** All other scheduled FDOs for the account are cancelled
- **Next step:** None (terminal)
- **Exception flow:** all scheduled FDOs are cancelled after a plan change executes
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “all scheduled FDOs are cancelled after a plan change executes.”

## UJ-105: IMS/VFID/UIM data pipeline - GTM extract to downstream systems (3 steps)

**WF-875** (step 1) `Explicit` · confidence: `high`
- **Actor:** IMS (network-team-owned, sourced from Qatar GIS)
- **Input:** Site/zone-street-building (ZSB) data, BIDs, CTPs, splitters/ports
- **Output:** GTM (go-to-market) full-dump building file
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Data flow: IMS → GTM (go-to-market) full-dump building file”

**WF-876** (step 2) `Explicit` · confidence: `high`
- **Actor:** RPA (Microsoft automation)
- **Input:** GTM full-dump file via mediation
- **Output:** Translated/filtered file distributed to UIM (full dump + separate VFID file), Siebel (delta file), RFS Portal, EDW, OneDrive
- **Validation:** GTM frequency uncertain in production — designed fortnightly, believed now daily/bi-weekly (flagged as action item)
- **Next step:** 3
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “picked up by RPA (Microsoft automation) via mediation → translated/filtered → distributed to UIM (full dump + separate VFID file), Siebel (delta file, for lead management), RFS Portal, EDW, and OneDrive (for business)”

**WF-877** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field survey team
- **Input:** VFID generated in advance by RPA, loaded into UIM
- **Output:** VFID mapped to KID(s)
- **Validation:** normally one-to-one; many-KIDs-to-one-VFID and one-VFID-to-many-KIDs are corner cases handled manually by sales plus fulfillment
- **Next step:** N/A
- **Exception flow:** villa partitions use dummy KIDs (first connection on real KID, subsequent on dummies) since each activation needs a unique KID
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Generated in advance by RPA, loaded into UIM, then mapped to KIDs by a field survey team; normally one-to-one, but many-KIDs-to-one-VFID and one-VFID-to-many-KIDs are supported corner cases handled manually”

## UJ-098: Fixed Line Migration (FIB-MIG-RTL-003) (3 steps)

**WF-886** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Existing FWA service account
- **Output:** Migration eligibility determined
- **Validation:** N/A
- **Next step:** 2
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FIB_MIG_RTL_003_01`..`07` (migration eligibility, verification, service availability, existing-service retrieval, order capture, WFM appointment, telesales collection flags)”

**WF-887** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Eligibility result
- **Output:** Verification and service availability checked, existing service retrieved
- **Validation:** N/A
- **Next step:** 3
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “verification, service availability, existing-service retrieval”

**WF-888** (step 3) `Explicit` · confidence: `high`
- **Actor:** Field agent / Telesales
- **Input:** Order capture
- **Output:** Order captured with WFM appointment scheduled
- **Validation:** telesales collection flags
- **Next step:** N/A
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “order capture, WFM appointment, telesales collection flags”

## UJ-103: Mobile Postpaid Activation through Retail Agent (MOB_POST_ACT_RETL_001) - Journey and Session Management (3 steps)

**WF-889** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Agent Desktop)
- **Input:** Journey initiation trigger
- **Output:** Journey started with role-based authorisation check
- **Validation:** role-based authorisation via TBD Agent Role Privilege Matrix
- **Next step:** 2
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “`MPAR_001_JSM_01`..`08` (journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix, Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable, automatic Tracking Record creation, milestone/draft-order persistence for resume)”

**WF-890** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (Qnomy)
- **Input:** Customer arrival
- **Output:** Q Ticket created/consumed
- **Validation:** fallback if Qnomy unavailable
- **Next step:** 3
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable”

**WF-891** (step 3) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Journey start
- **Output:** Automatic Tracking Record created; milestone/draft-order state persisted
- **Validation:** supports resume of in-progress journey
- **Next step:** N/A (continues into CAP-02 KYC)
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “automatic Tracking Record creation, milestone/draft-order persistence for resume”

## UJ-002: Fixed Line Two-Phase Billing / Order Completion (current state defect) (2 steps)

**WF-024** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (OSM)
- **Input:** Fixed line order older than ~12 months
- **Output:** Auto-completed/purged order
- **Validation:** Order completion depends on PM confirmation
- **Next step:** CDRs flow to BRM
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “OSM auto-completes/purges orders older than ~12 months; order completion depends on PM confirmation; CDRs flow to BRM but bill formatter only shows active services”

**WF-025** (step 2) `Explicit` · confidence: `high`
- **Actor:** System (bill formatter)
- **Input:** CDRs from BRM
- **Output:** Bill showing active services only
- **Next step:** Back-dated completion causes disputes
- **Exception flow:** Documented dispute: bill issued 16 June covering April–July for a service activated 1 June due to back-dated order completion
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “back-dated order completion caused a documented dispute (bill issued 16 June covering April–July for a service activated 1 June).”

## UJ-007: Enterprise Order Journey (vanilla direct, non-guided) (2 steps)

**WF-036** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Sales/EBU PM
- **Input:** CR number
- **Output:** Order started
- **Validation:** One order equals one location
- **Business rule:** Prerequisites: care form/CIO copy/oversight copy plus site survey
- **Next step:** Prerequisite document collection
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Enterprise order journey: described as "vanilla direct" rather than a guided journey; starts from CR number; one order equals one location; prerequisites are care form/CIO copy/oversight copy plus site survey.”

**WF-037** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Field/Installation team
- **Input:** Free-text comment naming site engineer/point of contact
- **Output:** Appointment notification
- **Validation:** Contact cannot be created without an ID
- **Exception flow:** Appointment notifications go to the wrong person because the real contact is only free text
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “the installation site engineer/point of contact is only captured as a free-text comment because a contact cannot be created without an ID — this causes appointment notifications to go to the wrong person.”

## UJ-010: New Fixed Line / Business Broadband Order Journey (2 steps)

**WF-050** (step 1) `Explicit` · confidence: `high`
- **Actor:** Sales/Account Manager
- **Input:** Order form
- **Output:** Billing in advance and add-ons captured
- **Validation:** RFS/feasibility checking now via Grafana on the portal
- **Next step:** Credit control
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “New fixed line / business broadband: order form, billing in advance, add-ons, RFS/feasibility checking now via Grafana on the portal, credit control, discount attached to the order form”

**WF-051** (step 2) `Explicit` · confidence: `high`
- **Actor:** Credit control team
- **Input:** Order with discount attached
- **Output:** Credit control cleared
- **Validation:** Discount attached to order form
- **Next step:** Predefined processes for open orders, network work and installation
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “credit control, discount attached to the order form, and predefined processes covering open orders, network work and installation.”

## UJ-024: Special Ticket - Transfer of Number (Prepaid, CDM Approval Chain) (2 steps)

**WF-146** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer/Agent
- **Input:** TON request (prepaid-only)
- **Output:** Ticket routed for four sequential approvals to CDM team
- **Validation:** Requires four sequential approvals
- **Business rule:** Built as a fraud control after historical fraud (fraudster collected money from two people for same number at different stores within an hour)
- **Next step:** CDM approves each stage
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Transfer of Number (TON): prepaid-only; requires four sequential approvals routed to the CDM team; built as a fraud control after historical fraud”

**WF-147** (step 2) `Inferred` · confidence: `high`
- **Actor:** System (proposed)
- **Input:** SAR number, contract minimum stay data
- **Output:** Automated rule-based approval (requirement, not yet built)
- **Validation:** Requirement: automate approvals via rules, limiting human involvement to exceptions
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Requirement: automate approvals via rules (SAR number, contract minimum stay) rather than human approvers, limiting human involvement to exceptions”

## UJ-025: Special Ticket - Disconnection (Retention-First) (2 steps)

**WF-148** (step 1) `Explicit` · confidence: `high`
- **Actor:** Retention agent
- **Input:** Disconnection ticket
- **Output:** Ticket closed with specific resolution code (e.g., "retained" or not)
- **Validation:** Must close with resolution code before disconnection order can be submitted
- **Business rule:** Retention-first business rule
- **Next step:** Disconnection order submitted on Orders page
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “ticket closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page”

**WF-149** (step 2) `Explicit` · confidence: `high`
- **Actor:** System / Retention agent
- **Input:** Plan/commitment penalty (automated); star number and device penalties (manual)
- **Output:** Penalty calculated
- **Validation:** Only plan/commitment penalties automated today; star number and device penalties checked manually (being automated separately)
- **Business rule:** Regulatory issue: plan change today restarts commitment period, but regulation requires original commitment to continue on upgrade; downgrade is a breach triggering penalty
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Only plan/commitment penalties are automated today; star number and device penalties are checked manually by the retention agent... regulation requires the original commitment to continue on upgrade (downgrade is a breach triggering a penalty)”

## UJ-026: Special Ticket - MNP Port-Out (from NPAS) (2 steps)

**WF-150** (step 1) `Explicit` · confidence: `high`
- **Actor:** System (NPAS)
- **Input:** Government-managed inter-operator port-out event
- **Output:** Ticket auto-created into MNP queue
- **Next step:** Unbilled amount auto-fetched
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “MNP port-out: auto-created from NPAS (government-managed inter-operator system) into an MNP queue”

**WF-151** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Account billing data
- **Output:** Unbilled amount auto-fetched; DOI outstanding amount not auto-fetched
- **Validation:** Automated checks (low outstanding, not blacklisted) recorded as ticket activities
- **Business rule:** Star number port-out control blocks porting during commitment period (configurable)
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched; automated checks (low outstanding, not blacklisted) are recorded as ticket activities”

## UJ-027: Prepaid Activation Offshore (Airport, 3rd Party Partner Manual Activation) (2 steps)

**WF-178** (step 1) `Explicit` · confidence: `high`
- **Actor:** 3rd Party Partner
- **Input:** Prepaid activation submission
- **Output:** Manual activation performed offshore
- **Next step:** 2
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “offshore airport prepaid sales are manually activated by a 3rd party partner, with Accept/Reject outcomes”

**WF-179** (step 2) `Explicit` · confidence: `high`
- **Actor:** 3rd Party Partner
- **Input:** Manual activation review
- **Output:** Accept or Reject outcome
- **Exception flow:** Reject outcome halts activation
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “with Accept/Reject outcomes; speaker note: "Tech Recommendation: Can be pushed same as before."”

## UJ-031: Fixed Line Activation - Eligibility Check (2 steps)

**WF-191** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (external web portal, outside CRM)
- **Input:** Customer location (zone/street/building)
- **Output:** Fiber, indoor 5G, or outdoor 5G determined sellable at location; permitted plans identified
- **Validation:** Fed by big data/"D theta" plan recommendations and weekly IMS file mapping zone/street/building to KID
- **Next step:** Customer/QID eligibility check clubbed with location eligibility
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “eligibility check on an external web portal (outside CRM, fed by big data/"D theta" plan recommendations and a weekly IMS file mapping zone/street/building to KID) determines whether fiber, indoor 5G, or outdoor 5G is sellable at a location”

**WF-192** (step 2) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer QID / KID / Vodafone ID
- **Output:** Customer and location eligibility both confirmed before plan discussion
- **Validation:** Eligibility checks clubbed together at one point early in the journey
- **Next step:** Contact/account creation
- **Exception flow:** KID in use scenario triggers order task and contract attachment requirement
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “eligibility checks (customer/QID eligibility and location eligibility) will be clubbed together at one point early in the journey, before plan/service discussion”

## UJ-033: Fixed Line Activation - Installation Day Exception Handling (2 steps)

**WF-250** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field technician (no Siebel access)
- **Input:** On-site installation issue
- **Output:** Child activity raised in WFM
- **Next step:** WFM integration creates Siebel order task for rollout team
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “field technician has no Siebel access — raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team”

**WF-251** (step 2) `Explicit` · confidence: `high`
- **Actor:** Rollout team
- **Input:** Siebel order task
- **Output:** Task closed
- **Next step:** WFM activity closed; agent notified to re-contact customer
- **Exception flow:** Splitter-full and BID-not-mapped conditions extend SLA, auto-created from UIM data
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “when the Siebel task is closed, the WFM activity is closed and the agent is notified to re-contact the customer... Splitter-full and BID-not-mapped conditions extend SLA”

## UJ-035: Self-Serve Instant Activation (standard customers only) (2 steps)

**WF-274** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Parameters entered directly by customer
- **Output:** Order created (fully automated)
- **Business rule:** restricted to "standard" customers only
- **Next step:** 2
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Self-serve instant activation: fully automated, customer enters parameters directly; restricted to "standard" customers only”

**WF-275** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Customer classification (standard vs non-standard)
- **Output:** Order (standard) OR Lead created (non-standard)
- **Exception flow:** non-standard customers get a lead created instead
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “non-standard customers get a lead created instead”

## UJ-043: Consumer Mobile Prepaid Activation - Direct Sales (ECR & Open UI, Onshore) (2 steps)

**WF-343** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer ID (QID, GCC ID, Passport, or Diplomatic ID)
- **Output:** Customer identification captured
- **Validation:** customer must provide valid QID, GCC ID, Passport, or Diplomatic ID for Prepaid; GCC IDs issued in UAE/Bahrain/Oman/Saudi Arabia/Kuwait; age 18+ (exception process for minors requiring Supreme Judicial Council approval plus Customer Data Management team approval)
- **Next step:** 2
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Customer Identification (must provide valid QID, GCC ID, Passport, or Diplomatic ID for Prepaid...); Age Limit (customer must be 18+, with an exception process for minors requiring Supreme Judicial Council approval plus Customer Data Management team approval)”

**WF-344** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Channel (ECR or Open UI)
- **Output:** Activation processed per channel-specific process flow
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Prepaid Onshore channels: Direct Sales (ECR & Open UI), Mass Market (ECR & VSA), Retail (ECR/Open UI desktop)...each activation channel...has its own numbered process-flow diagram and step-by-step procedure section”

## UJ-044: Consumer Mobile Postpaid Registration - ECR (Registration/Provisioning) (2 steps)

**WF-345** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Postpaid registration business rules
- **Output:** ECR registration record created
- **Next step:** 2
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Section 3 "Consumer Mobile Postpaid Registration" (business rules, ECR registration/provisioning process flows, Open UI activation flows, and VSA flows onshore/offshore)”

**WF-346** (step 2) `Explicit` · confidence: `medium`
- **Actor:** System
- **Input:** ECR registration record
- **Output:** Provisioning triggered
- **Exception flow:** ECR Consumer Mobile Registration Issue Handling process flow (3.3.4) for registration issues
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “an "ECR Consumer Mobile Registration Issue Handling" process flow (3.3.4)”

## UJ-079: Retail New Postpaid - Edit Bill Limit (Open UI Desktop, VFQA Sales role) (2 steps)

**WF-665** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Agent (VFQA Sales responsibility)
- **Input:** Bill Limit value entry
- **Output:** If below Agent minimum value, journey blocked (exact system response not recovered as text)
- **Validation:** comparison against Agent minimum value
- **Business rule:** Agent minimum value threshold rule
- **Exception flow:** blocked/rejected when below threshold
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “'When agent enters below Agent minimum value' (implies a rejection/blocking behavior...)”

**WF-666** (step 2) `Explicit` · confidence: `medium`
- **Actor:** Agent (VFQA Sales responsibility)
- **Input:** Bill Limit value entry above Agent minimum value
- **Output:** Journey allowed to proceed
- **Validation:** comparison against Agent minimum value
- **Business rule:** Agent minimum value threshold rule
- **Next step:** Continue journey
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “'When agent enters above Agent minimum value, user can proceed the journey'”

## UJ-092: Future Dated Order (FDO) - Disconnection (2 steps)

**WF-841** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (Retention team, Siebel only)
- **Input:** Disconnection FDO raised
- **Output:** FDO created via Siebel (not MVA)
- **Business rule:** raised only from Siebel
- **Next step:** 2
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “Disconnection: raised only from Siebel (not MVA); cannot be cancelled by the app — only the retention team can cancel.”

**WF-842** (step 2) `Explicit` · confidence: `high`
- **Actor:** Retention team
- **Input:** Cancellation request
- **Output:** Only retention team can cancel; app-side cancellation not possible
- **Next step:** None (terminal)
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “cannot be cancelled by the app — only the retention team can cancel.”

## (unmatched to a Stage A journey) MVA Customer Request to Ticket Routing (2 steps)

**WF-942** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Customer request via MVA
- **Output:** Request sent as report to a Team
- **Next step:** 2
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Currently the customer can create requests from MVA which is being sent as report to a Team to contact customer and raise tickets in System.”

**WF-943** (step 2) `Explicit` · confidence: `high`
- **Actor:** Team
- **Input:** Report of customer request
- **Output:** Team contacts customer and raises ticket in System
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “to contact customer and raise tickets in System”

## UJ-111: Disconnection Ticket (Retention Team Closure -> Auto Order) (2 steps)

**WF-944** (step 1) `Explicit` · confidence: `high`
- **Actor:** Retention Team
- **Input:** Disconnection ticket
- **Output:** Ticket closed
- **Next step:** 2
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Once the Ticket is Closed by Retention Team, It automatically creates a disconnection order.”

**WF-945** (step 2) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Closed disconnection ticket
- **Output:** Disconnection order automatically created
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “It automatically creates a disconnection order”

## UJ-017: GigaHome/OSNtv Subscription Acceptance (consumer, paper/form based) (1 steps)

**WF-001** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer
- **Input:** Plan selection, GigaHome/OSNtv subscription intent
- **Output:** Signed subscription acceptance form
- **Validation:** Customer must confirm understanding of postpaid billing, lock-in, disconnection fee terms before signing
- **Business rule:** Fibre lock-in 12 months; Try & Buy 2-month free trial; disconnection fee schedule; one free-offer per Kahramaa ID
- **Next step:** Form retained by Vodafone Qatar; Kahramaa ID tied to offer eligibility
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “A customer-signed acceptance form ... which the customer signs to confirm understanding before subscribing.”

## UJ-001: Individual Billing Adjustment (current state) (1 steps)

**WF-002** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Adjustment request detail
- **Output:** Ticket raised
- **Validation:** Delegation of authority (DOA) hierarchy approval required
- **Business rule:** DOA hierarchy
- **Next step:** Approval routed through DOA hierarchy
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “individual adjustments go through ticketing + DOA (delegation of authority) hierarchy”

## UJ-001: Bulk Billing Adjustment (current state) (1 steps)

**WF-003** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Bulk adjustment data (Excel)
- **Output:** Submission via PowerApps portal
- **Validation:** Offline approval
- **Next step:** Manual Excel handling
- **Exception flow:** Manual handling introduces error risk (implied)
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “bulk adjustments go through a PowerApps portal with offline approval and manual Excel handling.”

## UJ-001: Bulk Billing Adjustment (target state, DXP) (1 steps)

**WF-004** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Fixed-template file upload
- **Output:** Adjustment request submitted with status tracking
- **Validation:** Role-based access; billing profile filtration
- **Next step:** Failure reports generated for re-upload on error
- **Exception flow:** Failure report allows re-upload
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter.”

## UJ-001: Enterprise Bulk Activation (target state, DSP/Oracle bulk utility) (1 steps)

**WF-005** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Standardised bulk template with varying plans/spend limits/discounts/price overrides
- **Output:** Activation, modification or deletion executed via new Oracle bulk utility API
- **Next step:** Reporting per-row success/failure status
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Target requirement: standardised bulk templates on the DSP front end using a new Oracle bulk utility API, supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles within a service; supporting activation, modification and deletion; reporting per-row success/failure status.”

## UJ-005: Statement of Account (SOA) generation (current state) (1 steps)

**WF-006** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Customer SOA request
- **Output:** Excel SOA sent manually
- **Validation:** Manual, via Service Request (SR)
- **Business rule:** BRM 'from inception' data requirement blocked by purge policy
- **Next step:** Target: automation with standard consumer + enterprise format
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “currently sent manually via SR in Excel. Automation and a standard consumer + enterprise format required.”

## UJ-005: Enterprise Bulk Activation (current state, Excel macro) (1 steps)

**WF-007** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (SSI tool user)
- **Input:** Identical plan, account, spend limit, price across batch
- **Output:** Pre-created pending replica order used for reference
- **Validation:** Batch must share identical plan/account/spend limit/price
- **Next step:** Activation executed via Siebel credentials embedded in control sheet
- **Exception flow:** Siebel credentials embedded in control sheet is a security concern (implied)
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Bulk activation (current state): a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch; a pre-created pending replica order used for reference; Siebel credentials embedded in the control sheet.”

## UJ-067: Disconnection Penalty Quote (guided journey trigger) (1 steps)

**WF-008** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent/System
- **Input:** Disconnection, MNP port-out, plan upgrade/downgrade, park number, or put-off request
- **Output:** Calculated penalty/commitment value
- **Validation:** Value not stored anywhere; must be calculated on demand
- **Business rule:** Trigger from specific guided journeys or an on-demand button, not on every view (performance)
- **Next step:** Agent quotes penalty to customer
- **Exception flow:** ~50% of disconnection contacts are inquiries only, previously required creating an order just to get a value
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “agents cannot quote a disconnection penalty without creating an order...Decision: trigger the calculation from specific guided journeys (disconnection, MNP port-out, plan upgrade/downgrade, park number, put off) or an on-demand button”

## UJ-002: Fixed Line Two-Phase Billing / Order Completion (target state) (1 steps)

**WF-026** (step 3) `Explicit` · confidence: `high`
- **Actor:** Fulfilment/PM
- **Input:** Order activation detail
- **Output:** Account/service created at correct activation date
- **Validation:** Revenue projection and 24-hour tax reporting requirements make back-dating non-compliant
- **Business rule:** Escalated to fulfilment session/PMs
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: create account/service at the correct activation date and escalate to the fulfilment session/PMs; revenue projection and 24-hour tax reporting requirements make back-dating non-compliant.”

## UJ-018: FNP Port-Out Conditional Acceptance (Consumer, Service-Level) (1 steps)

**WF-083** (step 1) `Explicit` · confidence: `high`
- **Actor:** Siebel (system)
- **Input:** Unbilled amount at service level
- **Output:** Conditional acceptance triggered if unbilled amount qualifies
- **Validation:** Operates at service level, not billing profile level (unlike MNP)
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “FNP, by contrast, allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level”

## UJ-060: Postpaid New Customer Journey - Incomplete Order Resume (1 steps)

**WF-113** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Partially completed order (e.g., cart created)
- **Output:** Order held in transient state, not created at GSP layer
- **Validation:** Hold period tied to channel's number reservation expiry, up to ~48 hours
- **Next step:** Order appears in "in-progress journeys" list on agent login page
- **Exception flow:** Cross-channel/cross-agent pickup not currently feasible; only same-channel/same-process cross-agent pickup confirmed
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “incomplete/pending orders held in a transient state... journey resume via internal milestones (e.g., cart creation) rather than restart from scratch; an "in-progress journeys" list will appear on the agent login page”

## UJ-020: SIM Swap - Back Office Channel (1 steps)

**WF-134** (step 1) `Explicit` · confidence: `high`
- **Actor:** Back office agent
- **Input:** SIM swap request, ID attachment (no form)
- **Output:** Some requests approved manually, some auto-approved
- **Validation:** Approval matrix differs from retail — attachment only, no form; some auto-approved
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Back office some require approval (attachment only, no form), some auto-approved”

## UJ-020: SIM Swap - MVA App Channel (1 steps)

**WF-135** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer (self-service via MVA app)
- **Input:** eKYC completed
- **Output:** SIM swap processed with no approval/form required
- **Validation:** eKYC substitutes for manual approval/form
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “MVA app requires no approval/form once eKYC done”

## UJ-021: Manual Suspension ("Park My Number") - Back Office Ticket (1 steps)

**WF-136** (step 1) `Explicit` · confidence: `high`
- **Actor:** Back office agent (restricted role)
- **Input:** Suspension request
- **Output:** Plan change to "park my number" plan
- **Validation:** Restricted to specific roles; run as back-office ticket-driven process, not a retail journey
- **Business rule:** Voluntary suspension discontinued, always implemented as plan change, renamed "manual suspension"
- **Next step:** 35 QAR / 4-month upfront payment collected, credit limit set to zero
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “voluntary suspension is being discontinued and will always be implemented as a plan change; renamed "manual suspension"; delivered via a 35 Rial, four-month upfront-paid "park my number" plan with credit limit set to zero”

## UJ-023: Special Ticket - End Data Session (1 steps)

**WF-144** (step 1) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Long-running IN session
- **Output:** Ticket auto-created and auto-closed to refresh session and force CDR generation
- **Validation:** Goes to no team
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “End Data Session: auto-created and auto-closed ticket to refresh a long-running IN session and force CDR generation; goes to no team”

## UJ-023: End Data Session Ticket (1 steps)

**WF-145** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** End Data Session ticket action
- **Output:** Action executed via keyboard shortcut
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “End Data Session Ticket (slide 24 notes agent action shortcut "Ctrl + S")”

## UJ-086: Retail Account/Service Modification - QID Verification (1 steps)

**WF-155** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Agent
- **Input:** Customer physically present with valid QID
- **Output:** QID scanned and attached to customer account
- **Validation:** Agent visually matches ID photo to customer
- **Next step:** Proceed with transaction only if account/service change is involved
- **Exception flow:** Complaints/inquiries/bill payments without account/service change skip the ID attachment step
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer... complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step”

## (unmatched to a Stage A journey) Contact-Center Identity Verification (Phone Channel) (1 steps)

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** WF-175 below derives from the same single, 85%-data-loss source as `business-rules.md` BR-079 / `field-inventory.md` FLD-131..135 / `validation-catalogue.md` VAL-201..205 — this security-question model has zero corroboration anywhere else in the corpus, re-scored 53/100 (Medium-Low). (Note: this caveat does NOT apply to WF-155 above — the QID-scan/physical-presence rule it describes IS independently corroborated elsewhere, e.g. the Mobile Postpaid BRSD's KYC capability and the SIM Swap validation chain.)

**WF-175** (step 1) `Explicit` · confidence: `medium`
- **Actor:** Contact-center agent
- **Input:** Caller's claimed identity
- **Output:** Security question set posed
- **Validation:** QID and account/holder name mandatory; additional questions (registered number, active add-on, email) asked flexibly [SINGLE-SOURCE, UNCORROBORATED — see caveat above]
- **Business rule:** Lighter verification if calling from registered number
- **Next step:** Agent interprets answer accuracy (not exact-match)
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions; additional questions... are asked flexibly depending on what the customer can answer, and are validated by agent interpretation rather than exact string match”

## UJ-029: Plan Change - Postpaid to Postpaid (Upgrade/Downgrade) (1 steps)

**WF-176** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Requested new plan/promotion
- **Output:** Plan changed
- **Validation:** System does not distinguish upgrade/downgrade; agent infers from plan/promotion name and rental value
- **Business rule:** Plans/discounts/add-ons bundled into named promotions to prevent agent misuse of discounts
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade)”

## UJ-027: Plan Change - Prepaid to Postpaid Migration (1 steps)

**WF-177** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Prepaid customer request to migrate
- **Output:** Eligibility checked: min 1 month on network, min 50 QAR recharge last month, CDR usage history
- **Validation:** All manual today, to be automated
- **Business rule:** Prevent abuse where customers migrate immediately post-activation to exploit postpaid credit
- **Next step:** Postpaid billing profile created (manual step)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

## UJ-028: Plan Change - Postpaid to Prepaid Migration (1 steps)

**WF-180** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent
- **Input:** Postpaid to prepaid migration request
- **Output:** 100 Riyal migration fee manually added to order by agent
- **Validation:** Requires manager approval; not automated, flagged as revenue-leakage risk if forgotten
- **Business rule:** Consumer can have at most two billing profiles (one postpaid, one prepaid)
- **Next step:** Remaining prepaid balance handled: monetary posts as overpayment/advance credit in BRM, non-monetary voice/data buckets lost
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “100 Riyal migration fee applied on the final bill; in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers)... Remaining prepaid balance posts as an overpayment in BRM”

## UJ-031: Fixed Line Activation - Plan/IPTV Selection (1 steps)

**WF-193** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent/Customer
- **Input:** Fixed plan selection
- **Output:** Triple-play bundle (including IPTV) applied by default
- **Validation:** IPTV optional/removable
- **Business rule:** IPTV basic free, only premium charged
- **Next step:** If IPTV removed, dual-play order created (no set-top box, no OSM IPTV provisioning)
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM”

## UJ-031: Fixed Line Activation - Number Selection (1 steps)

**WF-194** (step 1) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** Fixed/prepaid product context
- **Output:** Number auto-selected (zero-rated)
- **Validation:** Reserved-number retrieval and list-query options retained; not applied to mobile postpaid
- **Next step:** Appointment booking
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks, while retaining reserved-number retrieval and list-query options; NOT applied to mobile postpaid”

## UJ-031: Fixed Line Activation - Appointment Booking (1 steps)

**WF-195** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent/System (WFM)
- **Input:** Location SLA cluster
- **Output:** Next available date/slot pre-selected
- **Validation:** Bounded by SLA cluster (e.g., within 3 days or 1 week)
- **Next step:** Agent changes date only if customer requests different date
- **Exception flow:** Splitter-full forces minimum 5-day SLA
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “appointment step to be enhanced to pre-select the next available date/slot... calendar selection bounded by the location's SLA cluster (e.g., within 3 days or 1 week)”

## UJ-049: Fixed Line Activation - KID In Use Exception (1 steps)

**WF-196** (step 1) `Explicit` · confidence: `high`
- **Actor:** System
- **Input:** KID already in use at location
- **Output:** Order created and submitted but held via mandatory order task
- **Validation:** Mandatory contract attachment required as proof
- **Next step:** Downstream submission blocked until order task completed
- **Exception flow:** If disputed (old customer claims still active), order task marked unsuccessful and order cancelled with no downstream impact
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “KID in use scenario — order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof... If disputed (old customer claims still active), the order task is marked unsuccessful and the order is cancelled with no downstream impact”

## UJ-046: Fixed Line Activation - Win-Back on Refusal (1 steps)

**WF-252** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field technician
- **Input:** Customer refuses or hasn't paid on-site
- **Output:** "Win back" ticket raised
- **Next step:** Routed to sales team for retention offers before cancellation
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “"Win back" tickets are raised by the technician if a customer refuses/hasn't paid on-site, routed to the sales team for retention offers before cancellation”

## UJ-039: Home Move - Non-Fiber-to-Fiber combinations (manual ticket) (1 steps)

**WF-333** (step 1) `Explicit` · confidence: `high`
- **Actor:** Agent (manual)
- **Input:** Move request (fiber/5G x indoor/outdoor combination other than fiber-to-fiber)
- **Output:** Manual ticket raised
- **Business rule:** open question: should a home move be a new order or a modification order (unresolved)
- **Exception flow:** handled entirely outside the system as a manual ticket — explicit pain point
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “matrix of fiber/5G × indoor/outdoor combinations, each with WFM-installation-required and dismantle-required flags; only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket”

## UJ-040: Transfer of Number - COO / Claim of Ownership (on hold) (1 steps)

**WF-337** (step 1) `Explicit` · confidence: `high`
- **Actor:** Customer (number's user only, present)
- **Input:** Number registered to someone else (typically agent SIM-registration mistake)
- **Output:** COO TON case
- **Business rule:** on hold for ~2 years but retained in the system for possible resumption
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “COO/claim of ownership — only the number's user is present, number registered to someone else, typically caused by an agent SIM-registration mistake; on hold for ~2 years but retained in the system for possible resumption”

## UJ-050: FWA Negative Scenario - Address step non-numeric Building No. (New FWA Tablet) (1 steps)

**WF-412** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Building No.="67K" (non-numeric)
- **Output:** native browser alert error
- **Validation:** numeric, max 5 chars
- **Exception flow:** agent corrects Building No. and resubmits
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Building No. of 5 characters or less."”

## UJ-059: FWA Negative Scenario - Address step blank fields (New FWA Tablet) (1 steps)

**WF-459** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (tablet)
- **Input:** blank Zone/Street No./Building No./Apt/Area
- **Output:** validation error dialog
- **Validation:** all fields required
- **Exception flow:** agent must fill required fields to proceed
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “clicking Save Address produces a modal dialog: "Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”

## UJ-059: FWA Negative Scenario - Address step Street No. too long (New FWA Tablet) (1 steps)

**WF-460** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** Street No.="5666666" (7 digits)
- **Output:** native browser alert error
- **Validation:** numeric, max 5 chars
- **Exception flow:** agent corrects Street No.
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Street No. of 5 characters or less."”

## UJ-059: FWA Negative Scenario - SIM Serial step blank fields (FWA Postpaid) (1 steps)

**WF-461** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** blank SIM Serial and CPE Serial Number
- **Output:** inline red banner error
- **Validation:** SIM Serial required
- **Exception flow:** agent must enter SIM Serial
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter a valid SIM Serial before pressing 'Continue'."”

## UJ-059: FWA Negative Scenario - SIM not found in UIM (FWA Postpaid) (1 steps)

**WF-462** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** SIM Serial 8842702800801190300, CPE Serial S180P18055028
- **Output:** native alert: SIM Card does not exist in UIM
- **Validation:** backend UIM lookup
- **Exception flow:** agent must use a SIM Serial that exists in UIM
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"”

## UJ-059: FWA Negative Scenario - SIM Serial wrong length (FWA Postpaid) (1 steps)

**WF-463** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** SIM Serial "894270280080119030" (18 digits)
- **Output:** inline field-level error
- **Validation:** must be 19 digits
- **Exception flow:** agent corrects SIM Serial length
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: SIM Serial # must be 19 digits."”

## UJ-059: FWA Negative Scenario - SIM already assigned in UIM (FWA Postpaid) (1 steps)

**WF-464** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** SIM Serial 8942702800801190300, Number 97441202302
- **Output:** native alert: SIM Card already assigned in UIM
- **Validation:** backend UIM check
- **Exception flow:** agent must use unassigned SIM
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card already assigned in UIM(SBL-EXL-00151)"”

## UJ-059: FWA Negative Scenario - CPE not free in UIM, backend exception surfaced (FWA Postpaid) (1 steps)

**WF-465** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** CPE Serial Number S180P18055025
- **Output:** native alert exposing raw backend exception
- **Validation:** CPE must be free in UIM
- **Business rule:** error codes SBL-BPR-00162 (error handling service) and SBL-EXL-00151 (UIM/CPE not free)
- **Exception flow:** agent instructed to contact System Administrator with reference 1-DNODWJU
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162) CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151) Please Contact the System Administrator with Reference # 1-DNODWJU.(SBL-EXL-00151)"”

## UJ-059: FWA Negative Scenario - CAF Supplementary Form not selected (New FWA Tablet) (1 steps)

**WF-466** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent
- **Input:** CAF & Additional Attachments step, Supplementary Form left empty
- **Output:** inline banner error blocking Continue
- **Validation:** Supplementary Form mandatory
- **Exception flow:** agent must select Supplementary Form before continuing
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: Please select Supplementary Form before continuing."”

## UJ-063: FWA Negative Scenario - Address step blank fields with Skip (New FWA / FWA Postpaid Business) (1 steps)

**WF-467** (step 1) `Explicit` · confidence: `high`
- **Actor:** Field agent (Business/Static Data journey)
- **Input:** blank address fields
- **Output:** validation error dialog with Skip Address option
- **Business rule:** Business/Static Data variant allows skipping address save; Tablet variant does not
- **Exception flow:** agent can click Skip Address to proceed without saving address
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit, Area or click Skip Address to proceed without Saving Address."”

## UJ-091: SIM Swap Order Approval Rejection - Open UI Desktop (1 steps)

**WF-816** (step 4b) `Explicit` · confidence: `high`
- **Actor:** Approver
- **Input:** Reject Task action
- **Output:** Rejection Reason popup opened
- **Next step:** None (terminal: order dropped/cancelled)
- **Exception flow:** Order dropped as cancelled after rejection
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “On Reject Task, pop-up opens for Rejection Reason -> Add comments, click Drop Order; order is dropped as cancelled.”

## UJ-061: New FWA Postpaid Outdoor Order (Desktop, WFM installation) (1 steps)

**WF-946** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Part A — Sales order creation (guided wizard, "New FWA") ... Part B — Sales Order record and Line Items ... Part C — Technician inventory loading ... Part D — Technician activity, "Move", and inventory transfer ... Part E — Technician "My Route" and on-site installation activity ... Part F — Final verification ... End state: Full success — Sales Order Complete, all line items and installed assets Active, data buckets live, WFM installation activity ended with signed checklist and customer signature.”

## UJ-109: Complaints Management Process / Agent Ticket Creation (1 steps)

**WF-947** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Diagram (slide 16, image56.png): lanes 'Customer' and 'Front line (Care/Retail)'; boxes 'START' -> 'Customer contact VF for an issue' -> 'Receives Inbound Call/ email/Chat/ Visit' -> 'Troubleshooting' -> diamond 'Issue resolved' (YES/NO) -> YES path 'Communicate Resolution to the Customer' -> 'Receive Feedback' -> 'END'; NO path -> 'Create TT & Submit with correct type' (bullet list: Global Incident Complaints Process, Billing Complaints, Unposted Payment, Service Related, Account Management, Network Complaint) -> box 'Global Incident Complaints Process 2.5'. Ticket Homepage field labels read directly off image61.png/image62.png include 'TICKET INFORMATION', 'STATUS AND OWNERSHIP', and an 'Activities' grid header row: 'Created | Owner | Activity # | Account | Channel | Topic | Sub-Topic | Type | Area | Language | Interaction Type | Comments | Status'.”

## UJ-110: MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant) (1 steps)

**WF-948** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Activities grid rows (image87.png): 'NP01_1-2WT4... | ... | MNP | General | Request | MNP | English | None | ID Number is matching. | Success'; 'NP10_1-2WT4... | ... | The customer has not settled the Total Outstanding Du... | In Progress'. Second ticket (image89.png) header/status fields: 'Status: Solved', 'Sub-Status: Complete', 'Resolution Code: Donor Accept', with all 11 of its own Activities rows reading 'Success' (image88.png).”

## UJ-032: KID-in-Use Exception Handling (1 steps)

**WF-949** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “01:36:34 | KID in use explained... For KID in use the order is created but with an order task. Siebel will not submit the order downstream; only when the order task is completed does the downstream flow resume. | 01:37:26 | If there is a dispute and the old customer says they are still there, the order task is made unsuccessful and the order is broken/cancelled. This has no other impact because the order has not yet reached downstream. | 00:57:35 Metrash as alternative proof | Retail is opting for Metrash, a government app that holds IDs, address and so on. The address screen can be opened and a picture taken; this is accepted as proof. | 01:00:52 Risk: Under the current design the customer can reach the appointment step without having the required KID in use documents, and once the appointment is selected it cannot be changed before submission. Chicken and egg problem.”

## UJ-099: Fixed Line Port In (BRSD) (1 steps)

**WF-950** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “FIB_FPI_RTL_005_01 | Ported number capture | The system shall allow the Retail Agent to capture the fixed line number being ported in and shall not permit selection of a new fixed line number for a port in journey. ... FIB_FPI_RTL_005_08 | Portability activation after completion | The system shall activate the ported fixed line number after portability completion and shall configure it during the field workforce management task, providing no temporary number.”

## UJ-100: Fixed Line Port Out (BRSD) (1 steps)

**WF-951** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “FIB_FPO_RTL_006_05 | Port out outstanding bill handling | The system shall move the request to conditionally accepted where the customer holds a pending bill and shall allow the customer a defined window to clear the dues. ... Annex_02_Status_Model: ('Portability Ticket', 'Conditionally Accepted', 'Awaiting outstanding dues settlement within the window', 'Pending bill identified', 'Accepted, Rejected, Suspended')”

## UJ-101: Fiber Termination (BRSD) (1 steps)

**WF-952** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “FIB_TER_RTL_007_03 | Retention handling | The system shall route the termination request to the retention process where required and capture the retention outcome before termination order creation. ... Annex_02_Status_Model: ('Termination Request', 'Under Retention', 'Retention handling in progress', 'Request routed to Retention', 'Retained, Validated for Termination, Cancelled')”

## UJ-102: Fixed Line RFS (BRSD) (1 steps)

**WF-953** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “FIB_RFS_008_01 | Go to market file pickup and transformation | The system shall pick up the go to market file through the mediation layer and shall filter and transform the data into the system specific formats required by each downstream system. ... FIB_RFS_008_07 | Lead creation from portal | The system shall allow the sales agent to create a lead in the customer relationship management system from the ready for service portal using the customer mobile number.”

## UJ-004: Enterprise Account Creation (1 steps)

**WF-954** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “'00:06:45 Parent account creation: Fill the account screen with name, CR type, CR number, agent ID, business type and credit limit.' / '00:15:31 Sub-account creation and linking to parent: Go to account tab, all accounts, query the account, use the pick applet to select the parent account number so the sub-account is linked.' / '00:25:07 Add contact under account: Contact tab, plus button, query by QID; if the contact exists it is fetched, otherwise created; role drop-down set to chooser.' / '00:35:16 Billing profile creation: Billing profile tab, new, payment type Postpaid, bill cycle assigned automatically based on the creation date.' / '00:47:34 Web Self-Care activation: Attachment named QID_subaccount is checked, affiliation role set to chooser and approved, then Web Self-Care access is activated and a registration notification is triggered to the customer.'”

## UJ-055: New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction (1 steps)

**WF-955** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Tablet agent (HALEEMI) builds a Fixed Line "Normal Activation" Triple Play order on a Combo Box device → order (1-29795175561) is submitted and lands in "Submitted for Approval" / Pending status → a Test Manager persona picks it up from an Order Approval queue → the manager rejects it via "Reject - Correction" with reason "ID image not clear" → an OSB-driven SMS/notification is fired instructing the agent to go to Sales Order > My Rejected Orders to correct it → the agent re-enters the flow via a dedicated "Order Correction" tablet tile, where the ID front/back images (previously cleared) must be re-uploaded → the corrected order is visible back in the Siebel desktop Sales Order screen with Status Open and Approved still unticked”

## UJ-037: New FWA 5G Outdoor Activation (Business Process, WFM appointment) (1 steps)

**WF-956** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:45:47 Outdoor order flow: Select plan, same add-on option, select number; the serial number scan step is skipped for outdoor because the device needs installation, and the agent directly books an appointment which goes to WFM. ... 00:46:52 Outdoor FWA equipment: Outdoor consists of two devices - one outside connected to the other inside; the outside device is a special antenna providing more coverage. ... 00:48:47 Outdoor to indoor fallback at installation: If there is an access issue or glass and outdoor cannot be installed, indoor is offered; if the speed satisfies the customer they proceed, otherwise the order is cancelled.”

## UJ-071: MNP Prepaid Port-In (Tablet) (1 steps)

**WF-957** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “14. Order completion (image31): Confirmation modal: "MNP completed successfully. Order Number:- '1-23864057846'" with a Finish Process button — this is the terminal success state of the guided journey.”

## UJ-016: Post-Port-In Billing and Dunning (1 steps)

**WF-958** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “After port-in, a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs (outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine). Degradation is initiated by Ooredoo (the donor) and was de-automated to manual after complaints from customers with legitimate bill disputes.”

## UJ-051: Order Correction (reject-and-resubmit) (1 steps)

**WF-959** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Reopening the order approval detail this time shows only Approve and Reject - Drop Order (the "Reject - Correction" option is no longer offered, since one correction round has already occurred) ... SMS payload confirming approval ... "New Fixed Line Tablet for MSISDN 97441224278 with Order number 1-29795232313 is now approved."”

## UJ-052: GigaHome Subscription Acceptance Form (customer sign-off before activation, v3) (1 steps)

**WF-960** (step 1) `Explicit` · confidence: `medium`
- **Actor:** See recovered detail
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “18-clause acceptance form — FWA/5G Home pricing, speed tiers, FUP, lock-in penalties (500/800/200 QAR), Fibre-migration terms (per gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d)”

---
slug: guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Fixed Line/Open UI Desktop_Cross Sales_Fixed Line.docx
sha256: e255ce98428fd17fd90a9c8ac746e5c7d910ab0f5bc7f64e1fceec5914408e1c
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop – Cross Sales → New Fixed Line Guided Journey (Full Order Walkthrough)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, guided-wizard path (Cross Sales module leading into the New Fixed Line journey)
**Owner / author:** not stated
**Date:** screenshots dated 2026-04-13/15 (on-screen "Today is Wednesday, April 15, 2026"; order created 4/13/2026)

## Purpose
A full end-to-end Open UI Desktop walkthrough of the **Cross Sales** module: an agent looks up an existing customer by Qatari ID, accepts a pre-targeted campaign offer (a GigaHome Fiber promotion), and is redirected into the guided **New Fixed Line** activation journey — through appointment booking, CAF attachment, and order submission — ending in a fully provisioned Siebel Sales Order.

## Key content
Recovered by direct visual inspection of all 28 embedded screenshots, in document order:

1. **Home page** — Open UI Desktop home screen; a **Cross Sales** module tile (new icon) is highlighted among the standard tile set (Assets, Contacts, Accounts, New Fixed Line, New FWA, etc.).
2. **Cross Sales — Contact/QID entry**: "Please insert or scan the customer's Qatari Id:" field accepts **Qatari ID 28335628851**; Go / Search again / Cancel.
3. **Contact confirmation + Connection Details popup**: read-only identity fields (ID expiry, Nationality Indian, Gender M, First/Last name KHALID MAMMU, Birth date) plus editable required fields (Email, Preferred Language, Alt. phone #). A popup shows **Total Number of Prepaid Connections: 0**, **Total Number of Postpaid Connections: 1**, with a "Show Postpaid Plan Details" link.
4. **Contact section confirmed** after dismissing the popup.
5-6. **QID Offers grid** — a single targeted campaign offer: CampaignCode 000001247, OfferName "New Gigahome Testahil plan", PromotionId 1-5XBWM5D, **OfferType: New Fiber**, Price 0, MonthlyRental 299, Status Offered. Agent clicks **Accept**.
7-8. **Redirect into New Fixed Line journey — Contact/Kahramaa step**: the QID (28335628851) carries over automatically and is **greyed out/read-only** — the agent cannot re-enter it. Agent enters **Kahramaa ID 16A3005** and clicks Go.
9. **Contact re-confirmed** with additional Fixed-Line-specific fields: Digital Lead/Sale (No), Enter ECR Details (No, "To be filled by Fulfillment team only"), Get IPTV?.
10. **Address step**: Kahramaa-linked address table (Primary checkbox) plus a **Service Points** grid showing an existing ONT device (Service Point 16A3005_ONT_ALCLF11C2158, Status **Available**, Product Fixed Line Port).
11-12. **Plan step**: after a loading spinner, a locked/read-only **"GigaHome Testaahel Promotion"** card lists bundled components (Plan, First-Time-Offer 2-Months-Free, VoIP Service, Voicemail, Call Waiting, Call Forwarding, Three Way Conference, CLI, ...). **No plan-selection control is exposed** — the journey auto-applies the plan tied to the accepted offer.
13. **Addon & Discount step**: only a read-only Discount field ("First-Time Offer - 2 Months Free - BIA") with note *"if there are no applicable add-on or discount, the selector will be empty"* — **no editable add-on control**, confirming the agent cannot add extra discounts/add-ons on a cross-sell order.
14-15. **Number Selection**: a grid of free 8-digit fixed-line numbers to reserve (41202641, 41202727, ... QR0.00 each); after Reserve, the confirmed reserved number is **41224901** (final MSISDN **97441224901**).
16. Accordion overview: all 5 prior sections marked "Saved!"; **Book Appointment** section offers "Book Appointment" / "Book Unscheduled Appointment".
17. **Book Appointment modal**: Cluster field, calendar (April 13, 2026 selected), time-slot toggle (**2PM-5PM** selected / 5PM-8PM), Booking Comments = "TESTING FL CROSS SALES", and dropdowns Collect QID (No) / Collect CAF (No) / FNP Identifier (No) / FNP Execution Date.
18-19. **Confirmation dialogs**: *"WARNING: Appointment once booked cannot be cancelled..."* → OK → *"Appointment has been successfully booked. ... Appointment ID is 121379"*.
20-21. **Appointment fetched**: results table shows Appointment Number 1-29793918853, Technician ID ABATS_Consumer_Installation, Status pending, Appointment Date 04/13/2026, Time Slot 2PM-5PM.
22. **Order validation**: inline "Validating the order... Please Wait...".
23-24. **CAF (Customer Application Form) step**: an attached document "Vodafone caf sample.pdf" plus placeholder "Supplementary Form" / "+ Add File" tiles; clicking Continue triggers "Submitting the Order... Please Wait...".
25-26. **Activity step**: a Comments field ("Please note down a comment regarding the actions performed...") filled with "CROSS SALES TESTING"; **Save and Finish** → success dialog: **"Fixed Line completed successfully. Order Number:- '1-29793912388'"**.
27. **Resulting Sales Order header**: Order # 1-29793912388, Account KHALID MAMMU, Primary MSISDN 97479055347, Order Type **Activation**, Order Sub Type **Dual Play**, Status **Open**, Fulfillment Status **In Progress**, Billing Profile 1-DODNBP4 (Postpaid), Source **UNICA**, SubChannel **CRM**, Service Type **Fixed Line**, Kahramaa Id 16A3005, RFS Status **RFS**.
28. **Line Items detail (9 lines)**: GigaHome Testaahel Promotion → Broadband Internet Service (97441224901) → GigaHome Testaahel Plan, VoIP Service, ONT MDU Port Equipment, Fibre Spend Limit, 6 Months Fiber Speed Booster 2 Gbps → CPE Bundle → Broadband CPE, with Status Context values like "FULFILL BILLING COMPLETE: reached" and "**INITIATE WFM START: reached**" — the order is submitted and awaiting Work Force Management (WFM) installation completion.

## Cross-references
- Companion to other Guided Journeys/Fixed Line docx files (New Fixed Line activation, Prepatched KID variants, Fulfilment Team) — this document specifically demonstrates the **Cross Sales entry point** into New Fixed Line, not a direct New Fixed Line launch.
- Matches the "New Fixed line" User Journey (#5, Sales category) in `CRM_Journeys_Final_Updated_with_Type.xlsx` "Page Type"/"Relationship" sheet (functional cluster CL02, New Connection Activation & Migration); also touches the enterprise/offer-management space not otherwise well documented in that workbook (QID Offers / campaign-driven cross-sell).
- The Book Appointment / WFM handoff pattern matches the "Book WFM ID" and "View/Reschedule WFM appointment" Workflow/Task rows (#73, #76) in the same workbook.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 28 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only scattered captions (auto-populated QID, locked plan selection, no agent discretion on add-ons/discounts, order ends pending WFM) with no field-level detail. All 28 images were legible and distinct; none blank or corrupted.

---
slug: guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/Desktop Vanilla_FWA_Indoor.docx
sha256: 199aaa5b0b6d20eafd65743fd4fdf4c9b0109124a78201a9d05bb90e25474185
indexed: 2026-08-20
confidence: high
---

# FWA Indoor – Vanilla E2E Completed (Desktop Guided Journey Walkthrough)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Open UI Desktop, Vanilla/manual action path (no guided-journey wizard)
**Owner / author:** not stated
**Date:** not stated in content or filename

## Purpose
A desktop, Vanilla-Open-UI (manual, non-wizard) end-to-end walkthrough of activating a new FWA (Fixed Wireless Access) Indoor connection — from opening the Open UI Desktop home screen through submitting and completing the sales order.

## Key content
Recovered by direct visual inspection of all 26 embedded screenshots, in document order (previous text-only extraction had recovered almost nothing — see Extraction notes):

1. **Home screen** — Open UI Desktop landing page (module tiles: Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Passport to QID, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Lead, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests, Agreements, New FWA).
2. **Contacts → new contact / Mobile Eligibility check** — agent fills Last Name, First Name, ID Type (Passport), ID Number, ID Expiration Date, Nationality, Cellular Phone #, Email.
3. **System warning dialog**: *"This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."* — confirms a temporary-number rule tied to non-resident ID types (e.g. Passport).
4. **Contact Addresses picker** — searches/selects a Zone and adds it as the Primary address for the contact.
5. **Account 360 View created** — Account auto-generated from the contact (Account Class: Customer, Account Type: Residential, Customer Segment: Expatriate, Status: Active), with Billing Profile tab showing a new Postpaid, Monthly, Invoice billing profile.
6. **Account → Orders tab** — a Sales Order (Type: Activation, Status: Pending) is auto-created against the account.
7. **Sales Order detail (More Info tab)** — Order Type: Activation, Fulfillment Mode: Deliver, Price List: VFQA PriceList, Currency: QAR.
8. **Catalog tab** — agent browses VFQA Catalog → Fixed Line Plans → FWA Promotions and selects **"GigaHome 5G Classic New Indoor FWA Promotion."**
9. **Line Items tab** — order line auto-expands into: (1) GigaHome 5G Classic New Indoor FWA Promotion, (2) FMS CPE Bundle, (3) FMS Service Bundle, which itself further expands into sub-lines: 3.1 GigaHome 5G Classic New Indoor-FWA, 3.2 FMS SIM, 3.3 FMS VoIP Service, 3.4 Activation Bar-Mobile Roaming-FWA, 3.5 System Bar Admin-FWA.
10. **Numbers tab** — agent reserves a number; system dialog confirms **"SUCCESS: Reservation Token:13758017(SBL-EXL-00151)"**; a Number Selection dialog lists an available FREE-category number the agent picks via OK.
11. **Pick Contact dialog** — agent links the account's existing contact as the Notification Contact for the order.
12. **FMS CPE Bundle configuration** — agent selects equipment sub-type **FMS CPE Indoor IDU** (vs. FMS CPE ODU / FMS CPE Outdoor IDU options) and, in its Details form, fills Indoor Unit Serial Number (IPTV Service Id, CPE Model, MAC Address and VoIP Number left blank in this run).
13. **Order status progression** — after Submit, the order transitions Status: Open → In Progress (visible per-line Status Context values: "FULFILL BILLING COMPLETE: reached", "SMS NOTIFICATION START: reached") → **Complete**, with Status Context "All order lines are completed" and Fulfillment Status: Complete.

Distinguishing detail vs. sibling FWA walkthroughs in this folder: this is the **Desktop, Vanilla (manual, non-wizard)** path — the agent drives Contact → Account → Sales Order → Catalog → Line Items → Numbers → CPE config manually screen-by-screen, rather than through a guided step wizard (contrast with the "Open UI Tablet_FWA_Indoor..." guided-journey variants elsewhere in this folder).

## Cross-references
- Companion to the other Guided Journeys/FWA docx files: Desktop Vanilla_FWA_Outdoor_WFM (same Vanilla path, Outdoor + WFM appointment), Desktop Vanilla_Indoor_Modify CPE (post-activation CPE change), FWA_Indoor & Outdoor_Negative Scenarios (error/validation catalogue), and the tablet-guided-journey FWA variants (Open UI Tablet_FWA_Indoor*, with/without approval, B2B2C).
- Matches the "New FWA" User Journey row (#6) in `CRM_Journeys_Final_Updated_with_Type.xlsx` "Page Type" sheet / "Relationship" sheet (cluster CL02, New Connection Activation & Migration) — this document is direct evidence of that journey's actual Desktop-Vanilla click path.
- The GigaHome Subscription Acceptance Form (5G Home Plans) in this document set covers the customer-facing T&Cs for the product activated here.

## Extraction notes
Confidence upgraded from low to high on 2026-08-20. The original text-only extraction (pandoc) recovered only the title and 2 caption fragments; all 26 embedded screenshots were rendered as non-descriptive alt-text placeholders ("A screenshot of a computer AI-generated content may be incorrect."). Content above was recovered by extracting the embedded PNG images directly from the .docx (it is a ZIP container; images live under `word/media/`, ordered via `word/_rels/document.xml.rels` + the `r:embed` sequence in `word/document.xml`) and visually reading each screenshot in order. No OCR tool was used — each image was read directly. Every field label, dialog message, and data value quoted above is transcribed directly from what is visible on screen.

---
slug: guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Open UI Tablet_Lead/Lead Creation – Fixed.docx
sha256: 885274017797ddba1926d1761d336795fbe6d22d5b04dc5a21c232c563e14fa6
indexed: 2026-08-20
confidence: high
---

# Lead Creation – Fixed (Open UI Tablet): Create, List, and Manager Reject Walkthrough

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path — covers both the agent's lead-creation flow and a manager/approver's review-and-reject flow
**Owner / author:** not stated
**Date:** screenshots dated 2025-11-20 (on-screen "Today is Thursday, November 20, 2025")

## Purpose
An Open UI Tablet walkthrough covering the full lifecycle of a Fixed-line ("Home") service lead: an agent creates the lead via the "New Lead Tablet" tile, the lead auto-populates a formatted address and appears in My Leads/My Created Leads views, and a separate Manager/Approver persona reviews the lead under Manage Leads and rejects it with a reason code and comment.

## Key content
Recovered by direct visual inspection of all 22 embedded screenshots, in document order:

**Part 1 — Agent creates a Lead (images 1–8)**
1. Home dashboard, logged in as agent Hemanth Kumar; module tiles include Home, Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, **New Lead Tablet**, My Leads, New IOT Tablet, SIM Swap, New FWA Tablet.
2. "Create a Lead" form (empty): Mobile Number*, Service Needed*, First Name, Last Name, Preferred Time, Zone, Street, Building, Unit.
3. Service Needed dropdown opened: options FNP, **Home**, MNP, Plan upgrades, Postpaid, Pre to Post, Prepaid — "Home" (the Fixed-line service) is selected.
4. After selecting Home, a conditional field **"Fixed Pre-sales"** appears (Yes/No) — this field only shows for the Home service type. First Name = LEAD, Last Name = Test1.
5. Preferred Time date/time picker: November 2025 calendar, 20th highlighted, Hour/Minute sliders, Now/Done buttons.
6. Fully completed form: Service Needed Home, First Name LEAD, Last Name Test1, Fixed Pre-sales **Yes**, Preferred Time 11/20/2025 12:29:00, Zone 11A, Street 22, Building 33, Unit 44D. Buttons: Create Lead, Cancel.
7. Success dialog: **"Lead created successfully!"**
8. Lead Details View: Mobile # 97410001000, Lead Status **In Progress**, Lead Sub Status **Call Back**, Created 11/18/2025 12:37:58 (system timestamp, distinct from the requested callback time), Created By/Lead Owner HEMANTH, Fixed Pre Sales Yes, Description "Home". A **Reject** button and **Validate** button are present even at this stage.

**Part 2 — Address tab and My Leads list (images 9–12)**
9. Address tab: auto-formatted address record — Zone 11A, Street No. 22, Building No. 33, Apt/Flat/Unit 44D, Address Line 1 "Zone 11A, Street 22, Building No. 33, Apt/Flat/Unit 44D", Country Qatar, Postal Code 1111.
10. "My Leads" full list (9 leads visible) — includes the new Home/97410001000 lead (Lead Num **1-DO3J040**, In Progress) among other Postpaid/MNP leads.
11. "My Created Leads" filtered view — narrows to 1 record (the just-created lead), confirming the filter scopes to leads created by the logged-in agent.
12. A new persona logs in: **"Welcome back Test Manager!"** (Incognito session) — module tiles reduced to Home, Order Approval, **Manage Leads**, **Leads Queue**, marking the manager/approver role's much narrower menu.

**Part 3 — Approver reviews and rejects the lead (images 13–22)**
13. Manage Leads > "My Team's Leads" view, filtered Created By = HEMANTH, listing the same 9 leads including the target Home/97410001000/1-DO3J040 record (now showing Lead Sub Status column = Call Back).
14. Manager opens the Lead Details for that record: same fields as the agent saw (Mobile #, Service Needed Home, Status In Progress, Sub Status Call Back, Fixed Pre Sales Yes).
15. Address tab confirms the manager sees the identical address data the agent entered.
16. Manager hovers/clicks the **Reject** button (tooltip "Lead Details:Reject").
17. **"Reject Lead"** modal opens: required **Reject Reason Code** dropdown (shown invalid/empty, outlined red) and **Reject Comment** text field; buttons OK/Cancel.
18. Reject Reason Code dropdown expanded: options include Competitor selected, Do Not contact, Duplicate lead, Failed to reach contact, Identity unknown, Incorrect data, **Ineligible** (selected), Insufficient Funds, Is a partner, Left company (scrollable, more below).
19. Reject Comment entry: free-text box filled with "Test".
20. Reject Lead dialog fully completed: Reject Reason Code = Ineligible, Reject Comment = Test; OK/Cancel available.
21. After submitting: Lead Status updates to **Rejected**; the Reject button becomes disabled (already actioned). Order Id and Date Converted remain blank (rejected leads are never converted to an order).
22. Back in the agent's "My Created Leads" view: the same lead now shows **Lead Status: Rejected** (highlighted), confirming the status change is visible end-to-end across both personas — this is the terminal state of the walkthrough.

## Cross-references
- Companion to other Guided Journeys/Open UI Tablet_Lead docx files: Lead Creation Mobile, Lead Creation Lead Edit Owner Change, Tablet Lead Creation with Fixed Presales and Edit Lead details — this file specifically demonstrates the **Home/Fixed-line** service-type lead and its manager-reject path.
- Matches the "Create Lead" User Journey (#1, Lead category) and "Manage Lead" Workflow/Task (#2) rows in `CRM_Journeys_Final_Updated_with_Type.xlsx` "Page Type"/"Relationship" sheet (functional cluster CL01, Lead Capture & Sales Pipeline) — this document is direct evidence of both the Create Lead journey AND the Manage Lead workflow (the reject action), including the previously-undocumented Reject Reason Code taxonomy.
- The "Fixed Pre-sales" conditional field and Kahramaa/address capture pattern connects to the New Fixed Line guided journey documents in this folder.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 22 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only section captions (Address view, My Leads, My Created Leads, Approver view) with no field-level detail. All 22 images were legible and distinct; several are closely-related sequential states of the same screen (expected for a click-through guide) but each captures a distinct field/dialog state and was documented as a separate step.

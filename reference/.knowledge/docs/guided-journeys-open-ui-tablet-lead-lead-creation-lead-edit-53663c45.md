---
slug: guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Open UI Tablet_Lead/Lead Creation, Lead Edit, Owner Change.docx
sha256: 58a30a65f30c793e769dead0ffc7819063faee276e641e0dd7e677d046ab124c
indexed: 2026-08-20
confidence: high
---

# Lead Creation, Lead Edit, and Owner Change on Vodafone Open UI Tablet (Siebel Web Call Center)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Tablet, guided-wizard path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots show in-app dates of 12/2/2025 and app clock reading "02-12-2025"; screen timestamps range 09:45–10:27)

## Purpose
Demonstrates, screen by screen in the Vodafone Open UI (Siebel Web Call Center, Tablet layout), the end-to-end lifecycle of a lead: creating a new lead from a contact/mobile number, editing lead fields (callback date/time, service needed, description), reassigning ("Owner Change") the lead to a different agent, and verifying the reassignment from three different user roles (original agent, manager, and back-office/admin user, plus the new owner).

## Key content

1. **Starting point — empty lead list on a contact.** Contact record for **SAHID ANSARI** (Last Name: ANSARI, First Name: SAHID, ID Type: Qatari ID, ID Number: 27152418430, DOB: 8/31/1971, Nationality: Nepalese, City: Doha, Cellular Phone #: 97431243124, Work #: 97412341234) is open on the **Leads** sub-tab under Contacts. The **Lead List** shows **"No Records."**

2. **Home page — agent "Hemanth Kumar."** Logged in as agent Hemanth Kumar ("Welcome back Hemanth Kumar!", Tuesday, December 02, 2025). Home tile grid includes Home, Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, **Lead**, SIM Swap, **New Lead Tablet**, My Leads, New FWA Tablet. Cursor hovers over **"New Lead Tablet"** (tooltip visible) — this is the entry point for lead creation.

3. **"Create a Lead" form.** Opens a form titled **"Create a Lead"** with fields: Mobile Number* (pre-filled **97431243124**), Service Needed* (dropdown, set to **"Plan upgrades"**), First Name, Last Name, Preferred Time, Zone, Street, Building, Unit — all left as empty placeholders. Buttons at bottom: **Create Lead** / **Cancel**.

4. **Lead created confirmation.** Clicking Create Lead triggers a browser-native JS dialog: **"10.162.53.100:4443 says / Lead created successfully!"** with an **OK** button. Only Mobile Number and Service Needed were populated; all optional fields were left blank.

5. **Lead Details View (agent, first look).** New page "Lead Details View." Header fields: Mobile #: 97431243124, CallBack Date/Time: (blank), Service Needed: Plan upgrades, Description*: Plan upgrades. Tabs: **Lead Details** / **Address**. Detail grid shows: Mobile#: 97431243124, Call Back date/time: (blank), RFS Ready: unchecked, Service Needed: Plan upgrades, **Lead Status: New**, OrderId: (blank), Created By: HEMANTH, Lead Sub Status: (blank), Date Converted: (blank), First Name: SAHID, Fixed Pre Sales: (blank), Convert Agent Id: (blank), Last Name: ANSARI, **Lead Owner: HEMANTH**, Description*: Plan upgrades. A **Reject** button and a **Validate** button are present.

6. **Setting the CallBack Date/Time.** A date/time picker opens on the CallBack Date/Time field: December 2025 calendar, day **4** highlighted (green), time control shows **12:00:00 AM** with Hour/Minute sliders, plus **Now** and **Done** buttons.

7. **Status auto-updates after callback is set.** After entering **12/4/2025 12:00** into CallBack Date/Time, the record auto-updates: **Lead Status changes from "New" to "In Progress"**, and **Lead Sub Status becomes "Call Back."** All other fields unchanged (Owner: HEMANTH).

8. **"My Leads View" (agent).** Navigating to **My Leads** shows the agent's personal lead queue (view selector set to "My Leads," showing "1 - 10 of 12+"). The new SAHID ANSARI lead is now the top row: Plan upgrades / ANSARI / SAHID / "Plan upgrades" description / **In Progress** / Owner **HEMANTH** / Mobile 97431243124 / **Lead Num 1-DO7II8B** / CallBack 12/4/2025 12:00:00 AM / Created 12/2/2025 09:48:49 AM / Created By HEMANTH. Expanded Lead Details panel below repeats the same values (Lead Sub Status: Call Back).

9. **Selecting the Lead Owner field to reassign.** Same My Leads grid; the **Lead Owner** cell for the SAHID ANSARI row is now selected/highlighted (value "HEMANTH" boxed in red), i.e., the agent has clicked into the Lead Owner field — the start of the owner-change action.

10. **Contact record reflects the new lead.** Back on the SAHID ANSARI contact record, Leads sub-tab: Lead List now shows **"1 - 1 of 1"**: Plan upgrades / ANSARI / SAHID / Description "Plan upgrades" (link) / In Progress / Owner HEMANTH / Mobile# 97431243124 / Work Phone# 97412341234 / Lead Num 1-DO7II8B / Manager **MANAGETEST** / Lead Contact 97431243124 / Lead Channel **Siebel** / CallBack 12/4/2025 12:0... / Created 12/2/2025 09:48:49 AM / Created By HEMANTH.

11. **Switch to manager role.** New login: **"Welcome back Test Manager!"** Manager home menu: Home, Order Approval, **Leads Queue**, **Manage Leads** (cursor hovering, tooltip "Manage Leads" shown).

12. **"Manage Leads" — My Team's Leads.** Manager's "All Leads View" opens with view selector **"My Team's Leads"** listing every agent's leads (1-10 of 12+), including rows owned by HEMANTH, VINODHINIR, and MMQA6. SAHID ANSARI's lead is the top row (Owner: HEMANTH). Lead Details panel below shows the **Lead Owner** field now carries a lookup/select icon next to "HEMANTH" — indicating the manager can reassign it.

13. **Drilling into the lead — Service Needed dropdown.** Opens the individual "Lead Details View" for this lead (breadcrumb: "Description:Plan upgrades | Lead Details View"). The **Service Needed** dropdown is expanded, listing all options: **FNP, Home, MNP, Plan upgrades, Postpaid, Pre to Post, Prepaid**. "Pre to Post" is being highlighted/selected.

14. **"Lead Owner" reassignment popup.** A modal titled **"Lead Owner"** opens with a searchable picker (Last Name filter) listing 5 candidate owners with Job Title: **KARTHIKK** (Back Office Team...), **Kumar / Hemanth** (Team Leader — current owner), **Manager / Test** (Retail Store M...), **VINODHINIR** (Retail Agent), **rpa_user** (rpa_user). Row **VINODHINIR** is selected. Behind the modal, Service Needed now shows **"Pre to Post"** (changed from "Plan upgrades"). Modal has **OK** / **Cancel** buttons.

15. **Owner Change confirmed on the record.** Back on Lead Details View, the **Lead Owner** field now shows **"VINODHINIR"** (highlighted red border indicating the just-changed field), replacing HEMANTH. Service Needed: Pre to Post. Lead Status: In Progress; Lead Sub Status: Call Back.

16. **Lead disappears from prior owner's "My Leads."** Logged back in as agent Hemanth, "My Leads View," view selector "My Leads" (1-10 of 12+): the SAHID ANSARI/97431243124 lead is **no longer present** — the list now starts with the GRANADA/ALLAN lead. This confirms: **after Owner Change, the lead is removed from the previous owner's My Leads view.**

17. **Lead still visible under "My Created Leads."** Same agent, but view selector switched to **"My Created Leads"** (a distinct filter from "My Leads"): SAHID ANSARI's lead **still appears** (top row) with Service Needed "Pre to Post," Status In Progress, **Lead Owner: VINODHINIR** — because "My Created Leads" filters by Created By (HEMANTH), not by current Owner. This demonstrates the two views behave differently: "My Leads" = filtered by Owner (lead disappears after reassignment); "My Created Leads" = filtered by Created By (lead persists regardless of ownership changes).

18. **New owner logs in.** **"Welcome back VINODHINIR VINODHINIR!"** Home menu includes Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, Training, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, Lead, SIM Swap, New Lead Tablet, **My Leads** (hovered, tooltip shown), New FWA Tablet.

19. **Lead now appears in new owner's My Leads.** VINODHINIR's "My Leads View" (view selector "My Leads," 1-10 of 12+): SAHID ANSARI's lead (Mobile 97431243124, Lead Num 1-DO7II8B) is now at the **top of the list** with **Lead Owner: VINODHINIR** — confirming the reassignment completed the round trip to the new owner's queue.

20. **Lead Details View from new owner.** Drilling into the lead confirms all field values under the new owner: Mobile# 97431243124, Service Needed Pre to Post, Created By HEMANTH (unchanged — creator is preserved), First/Last Name SAHID ANSARI, Lead Status In Progress, Lead Sub Status Call Back, **Lead Owner VINODHINIR**, Description "Plan upgrades" (not yet edited at this point).

21. **Lead Edit — editing the Description field.** A **"Description"** text-edit popup opens (triggered by an expand/edit icon next to the Description field). The new owner types **"Test1234"** replacing the prior text, with an **OK** button.

22. **Description updated.** The Description field on the Lead Details View now reads **"Test1234"** in both the summary bar and the detail form — the lead-edit action is complete.

23. **Switch to back-office/admin role.** **"Welcome back KARTHIKK KARTHIKK!"** — a much larger admin/back-office menu: Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Passport to QID, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, **Lead** (hovered), Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests, Agreements, New FWA.

24. **Admin "All Leads across Org" view.** Tab titled "All Leads acro[ss Org]..." A view-filter dropdown at top-right offers options including **"Converted Leads."** The **"All Leads"** grid (1-10 of 10+) lists every lead in the org across all owners (VINODHINIR, SADMIN, MMQA6, etc.). Our lead is the top row: ANSARI/SAHID, Pre to Post, Description "Test1234" (tooltip shown), Status In Progress, Owner VINODHINIR, Mobile 97431243124, Lead Num 1-DO7II8B, Manager MANAGETEST, Lead Contact 97431243124, Channel Siebel, CallBack 12/4/2025 12:0..., Created 12/2/20... Lead Details panel below adds admin-only buttons **Reject** and **Retire** (in addition to the fields seen at agent level).

25. **Full admin Lead Details View.** Opening the record fully shows a richer layout with tabs **Lead Details / Activities / Address / Product Recommendations** and action buttons **Validate, Submit** (greyed out), **Assign To Me, Send SMS, Product Recommendations**. Three-column detail layout:
    - **Customer Information:** First Name SAHID, Last Name ANSARI, Mobile# 97431243124, **Alternate Mobile# 97412341234**, Service Needed Pre to Post, Language English, Id Type Qatari ID, Id Number 27152418430, Nationality Nepalese, Date of Initiation 12/2/2025 09:48, Call Back date/time 12/4/2025 12:00, Preferred Date/Time (blank), First Contact Date (blank).
    - **Lead Details:** Lead Name (blank), Initiator Channel Siebel, Sub Channel (blank), Status In Progress, Sub Status Call Back, Initiator Company (blank), Initiator Team (blank), Lead Initiator (blank), **Outlet Id 1234**, Lead Owner VINODHINIR, Ownership History (lookup, blank shown), **Assigned Team "Testing."**
    - **Order Details:** OrderId (blank), Date Converted (blank), Convert Agent Id (blank), Blacklist Status (blank), Existing Connections (blank), KID Loaded (blank), **Last Updated 12/2/2025 10:27:33**, UTM Campaign/Medium/Source (all blank).

26. **Final state — back on the contact record.** Returning to the SAHID ANSARI contact's Leads sub-tab confirms the final end-to-end state: Lead List "1 - 1 of 1": Pre to Post / ANSARI / SAHID / Description "Test1234" / **Lead Status "In Progress"** (tooltip highlighted) / **Owner VINODHINIR** / Mobile 97431243124 / Work Phone 97412341234 / Lead Num 1-DO7II8B / Manager MANAGETEST / Lead Contact 97431243124 / Channel Siebel / CallBack 12/4/2025 12:... / Created 12/2/2025 09:48:49 AM / **Created By HEMANTH** (unchanged throughout).

**End-to-end summary of the demonstrated flow:** Agent Hemanth creates a lead for contact SAHID ANSARI (mobile 97431243124, Service Needed "Plan upgrades") → lead gets Lead Num 1-DO7II8B, Status "New," Owner HEMANTH → agent sets a CallBack Date/Time (12/4/2025 12:00), which auto-transitions Status to "In Progress" / Sub Status "Call Back" → a Manager ("Test Manager") opens Manage Leads, changes Service Needed to "Pre to Post," and reassigns Lead Owner from HEMANTH to VINODHINIR via the Lead Owner lookup popup → the lead disappears from HEMANTH's "My Leads" (owner-filtered) view but remains visible in his "My Created Leads" (creator-filtered) view → new owner VINODHINIR sees the lead in his own My Leads, edits the Description to "Test1234" → a back-office/admin user (KARTHIKK) verifies the lead org-wide via "All Leads," where Reject/Retire actions and a fuller 3-column detail layout (with Alternate Mobile#, Outlet Id, Assigned Team, Last Updated timestamp, etc.) are available.

## Cross-references
- Folder family: `/Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Open UI Tablet_Lead/` — sibling Guided Journey documents likely cover related Lead flows on the Tablet UI (not enumerated in this pass).
- Likely corresponds to a "Lead Creation / Lead Management / Owner Change" row in `CRM_Journeys_Final_Updated_with_Type.xlsx` under the Open UI Tablet or Lead Management journey type — not cross-checked in this pass; recommend verifying by Lead Num pattern (`1-DOxxxxx`) or view names ("New Lead Tablet," "Manage Leads," "My Leads," "All Leads") against that workbook.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 26 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass, which had recovered only the single fact about leads disappearing from My Leads after an owner change (confirmed accurate and now placed in full context — step 16 above). All 26 images were legible and screen text (field labels, dialog text, dropdown values, button labels) was readable directly from the screenshots. No images were blank, corrupted, or ambiguous. The only minor gaps are values cut off at the right edge of the browser viewport in a few grid views (e.g., partial CallBack Date/Time and Created timestamps in the wide grids of steps 8, 10, 24, 26) — these are noted as truncated ("12/4/2025 12:0...") rather than invented.

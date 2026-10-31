---
slug: guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5
sha256: 49f59dc8633ebe31f29ef1b8e1c45e3aa1316d7f7051c61a92a305c40b785fdf
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Home Move/Open UI Desktop_Home Move_Fixed to Fixed_Happy Path.docx
indexed: 2026-08-20
confidence: high
---

# Home Move Happy Path (Desktop, Fixed to Fixed)

**Type:** Guided Journeys / step-by-step UI walkthrough (screenshot-heavy)
**Owner / author:** not stated
**Date:** not stated

## Purpose
A desktop click-through guide documenting the "Happy Path" (successful/no-exception scenario) for a customer's Home Move from one Fixed line location to another, covering the full flow from Siebel order entry through WFM technician activation to order completion.

## Key content
- Title recovered: "HOME MOVE HAPPY PATH".
- Step sequence recovered in detail (captions largely survived for this document): Enter the KID the user is moving to and click Go; system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"; enter the Fixed Number and click Go; enter details in Contact Portal and click Continue; verify Address information and click Continue; if first-time Home Move, customer is flagged "eligible for Free Home move", click Continue; Book Appointment — select Cluster, book slot, click Submit; warning popup on submit, click Ok; appointment booking successful; tabular appointment details shown.
- Activity Portal step: enter details; note states "Comments field should have more than 5 characters"; click Save and Finish; success popup with Order ID; click Finish; navigates to My Sales Order page in Siebel; Order should be in Open Status.
- WFM steps: Login to WFM; search by Appointment ID to retrieve activity detail; verify ONT device details in UIM (assigned/unassigned); click Move to assign technician; select technician and click Move; login as Technician user in WFM, activity assigned, click Activate Route; click Submit; click Start; click Get geolocation and Submit; click Assess Activity — validation popup checks whether KID is eligible for Home Move; Inventory Transfer from Supervisor to assigned technician; verify ONT device details again; select technician and Move; enter ONT device details and click Add To Transfer List; go to Transfer List and click Start Transfer; popup confirms inventory transfer completed, click Ok; click Serial Number Check; enter ONT details and Submit; "Service Activation Details: Success"; select Home Move Checklist, complete and submit; "End" option appears; click End and Submit (with signature capture); Order Complete.
- Business rule captured verbatim: comments field validation requires more than 5 characters.

## Cross-references
- Part of the broader Guided Journeys set alongside Fixed Line and MNP Postpaid journeys; this is the only Home Move document in the current batch. Uses UIM (inventory management) and WFM (workforce management) systems referenced elsewhere in the Fixed Line/FWA journeys.

## Extraction notes
None — confidence is high; the step captions survived well for this document, giving a near-complete textual reconstruction of the click-through flow, though the underlying screenshots themselves (UI field layouts, exact button positions) are not visible via text extraction.

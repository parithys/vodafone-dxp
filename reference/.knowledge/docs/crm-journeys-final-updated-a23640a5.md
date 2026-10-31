---
slug: crm-journeys-final-updated-a23640a5
source: /Users/parithimalsaravanan/claude-projects/vfq/data/CRM Journeys_Final_Updated.xlsx
sha256: 006edec73c293885ea113b64c8c4eb091a27871fbc2d527a155eeeb8eb92e23f
indexed: 2026-08-20
confidence: high
---

# CRM Journeys_Final_Updated (Vodafone Qatar CRM Journey Inventory and Project Planning Workbook)

**Type:** data extract (Excel workbook — journey/feature catalog plus project planning/estimation sheets)
**Owner / author:** not stated
**Date:** not stated in content; one row notes items "Newly Added on 09th Feb" (year not stated); file indexed 2026-08-20

## Purpose
A master inventory of all Vodafone Qatar CRM (Siebel/Open UI) journeys, features, and actions — 165 distinct journey/feature rows — used to scope the stack-modernization project, plus companion sheets summarizing platform coverage (desktop/tablet, CBU/EBU) and a screen-count/resourcing/timeline estimation model.

## Key content
Workbook has 6 sheets:

1. **Raw** (rows 1–165, columns: #, Journey Category, Journey Type, Description, Comment, Desktop, Tablet) — the base journey list. Columns "Desktop"/"Tablet" indicate platform availability (nearly all Yes for Desktop; only a handful Yes for Tablet — e.g., Create Lead, Manage Lead, Create Upgrade TT, New Fixed Line, New FWA, New Postpaid, Prepaid to Postpaid, MNP Prepaid/Postpaid, New IOT Tablet, Passport to QID, Updating Special Management, Updating Contacts, View and Manage orders, View QUEUE, Closing Order Activity in QUEUE).

2. **Open UI Features** (same 165 rows, richer column set: #, Journey Category, Journey Type, Description, Comment, Guided journey Desktop, Guided journey Tablet, Desktop vanilla, CBU, EBU, Comments) — adds explicit guided-journey-vs-vanilla-action distinction and CBU (Consumer Business Unit) / EBU (Enterprise Business Unit) applicability flags, plus free-text comments (e.g., "Retail cannot change primary contact," "We want this for Tablet," "Bill calculator SMS is not a journey but a capability," "Not a guided journey but a view").

3. **Summary Combination List** (17 rows) — enumerates activation-type combinations requiring distinct T&Cs treatment: Postpaid × {HRN/Non-HRN Customer} × {N/A, Star Number, Star Number+Device Instalment}; Prepaid × {QID, Passport}; Fixed Line × {New Customer, Existing Customer}; FWA (no combinations); Pre to Post × {HRN, Non-HRN}; MNP Prepaid; MNP Postpaid; Device Instalment × {HRN, Non-HRN}. The "T&Cs Summary" column is present but empty in all rows — combinations are enumerated but the actual terms-and-conditions text/summary was not filled in.

4. **Sheet1** — raw project-planning/estimation figures (screen counts, resourcing options, working-day calculations for a Mar 1–May 1 delivery window, with and without Ramadan/Eid adjustments). Poorly structured (headers mixed with data); superseded/cleaned up by the "Summary_Sheet1" sheet below.

5. **Summary** — Journey Types Summary: **Lead 3 (1.8%), Sales 18 (10.9%), Support 79 (47.9%), Manage 62 (37.6%), Disconnect 3 (1.8%) — Total 165 journeys.** Platform Support: Desktop supported 165/165 (100%); Tablet supported 16/165 (9.7%); Both Desktop & Tablet 16/165 (9.7%); Desktop only 149/165 (90.3%). Action Type: Guided Journey 17 (10.3%); Action through Vanilla 115 (69.7%); View Only 35 (21.2%).

6. **Summary_Sheet1** — Project Timeline & Resource Planning: Total journeys 165; approx screens per journey — 5 positive, 3 negative, 3 popups; **Expected Screens Desktop 1,815; Expected Screens Tablet 176; Total Screens 1,991.** Normal timeline: March 23 working days + April 22 days + 2 days DSM prep = 43 total days (Mar 1–May 1); target 46.3 screens/day (6.6 screens/hour) against an actual observed rate of 4 screens/hour, implying ~1.65 resources required. Ramadan & Eid-adjusted timeline: 18+22+2 = 40 working days; target 49.8 screens/day (7.1 screens/hour) against an actual rate of only 1.78 screens/hour (reduced Ramadan hours), implying 4 resources required. Resource options: Option 1 (Normal) = 2 + 1 buffer = 3 resources; Option 2 (Ramadan/Eid) = 3 + 1 buffer = 4 resources.

## Cross-references
- Directly relevant to the Business Workshop Postpaid Service sessions in this batch — journey types listed here (New Postpaid, Prepaid to Postpaid, SIM Swap, TON, MNP Postpaid, PMN Suspension, End Data Session, Passport to QID, Migration order 5G vs Fiber, Device Installment, etc.) are the same journeys discussed in narrative detail in the Day 2/4/5/6/7 workshop transcripts in this batch — e.g., TON matches Day 7 Session 1's Transfer of Number discussion; End Data Session and SIM Swap match Day 4 Session 2 and Day 2 Session 2 respectively; PMN/manual suspension matches Day 2 Session 2's "park my number" discussion; Migration order (5G vs Fiber) matches Day 6 Session 2's FWA-to-fiber migration discussion.
- Appears to be a scoping/estimation input for the same stack-modernization project the workshop transcripts describe requirements for — likely feeds or is fed by the "requirements takeaway document" referenced in the Session 1 (20260625) workshop transcript.

## Extraction notes
Confidence is high for text extraction (openpyxl succeeded cleanly, 64,259 chars), but note two content limitations: (1) the "Summary Combination List" sheet's "T&Cs Summary" column is present in the header but contains no data in any row — the combinations are enumerated without their associated terms; (2) "Sheet1" is a raw/unstructured planning scratch area with headers and data cells intermixed in a way that is hard to parse reliably — the cleaner "Summary_Sheet1" sheet was used as the authoritative source for the resourcing/timeline figures reported above.

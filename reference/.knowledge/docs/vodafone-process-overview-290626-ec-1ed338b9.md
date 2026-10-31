---
slug: vodafone-process-overview-290626-ec-1ed338b9
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Vodafone Process Overview_290626_EC.pptx
sha256: b5c07d10354129a01162f167799b8822818adfcb7f569f80c2893018208d32f5
indexed: 2026-08-20
confidence: high
---

# Vodafone Process Overview

**Type:** deck (process overview / current-state walkthrough deck)
**Owner / author:** not stated (contains speaker notes referencing internal terminology; author initials "EC" appear in filename only, not in slide body text)
**Date:** Dated "01 July 2026" on most interior slides (footer date stamp); filename carries "290626" which appears to be a DDMMYY draft/creation date (29 June 2026) distinct from the "01 July 2026" date printed on the slides themselves — both are noted since they differ

## Purpose
A current-state process overview deck for Vodafone Qatar (VFQA) covering three major functional areas: Activation Channels, CAFs (Customer Application Forms), and Trouble Tickets — documenting existing systems, forms, and ticketing workflows, and closing with a stated set of proposed ticketing enhancements.

## Key content
- **39 slides total**, organized into clear named sections:
  - **Activation Channels** (slides 2-4, revisited at slide 39): "VFQA | Activation Channels" — states that different activation channels use different systems to capture orders and that notification sources vary; flags "*Hardly used in the channel" for at least one channel. Explicit note: "ECR for selling prepaid is being phased out and VSA moving forward will be used by Stores and direct sales to sell prepaid (Paired SIMs)." Slide 3 "VFQA | Prepaid Activation Offshore": states offshore airport prepaid sales are manually activated by a 3rd party partner, with Accept/Reject outcomes; speaker note: "Tech Recommendation: Can be pushed same as before." Slide 4 "VFQA | Channels and Roles" with speaker notes defining acronyms: MNP = Mobile Number Portability, FNP = Fixed Number Portability, CDM = Customer Data Management team.
  - **CAFs** (slides 5-13): "VFQA | CAFs" section header, split into **Consumer Forms** (slides 6-9) and **Enterprise Forms** (slides 10-13). Consumer CAF: "Digital Customer Application Form" — states consumer application forms are digitalized except supplementary forms; "Types of Application Forms" — notes retail stores use a digital signature pad while Direct Sales use a tablet; "Types of Additional Forms" — additional account-management forms exist per customer request type, mostly handled through stores. Enterprise CAF: "SME/SOHO Sales Application Forms" — lists form types: Postpaid Mobile, Plan Builder Mobile, Credit Limit, MNP, Postpaid Fixed, FNP, Fixed Supplementary; "Large Sales Application Forms" — states large companies sign a Master Service Agreement or custom contract with product-specific schedules (T&C); "Other Order Forms" — split into Mobile/VAS and Fixed.
  - **Trouble Tickets** (slides 14-38): the largest section by far.
    - Slide 15 "Type of Tickets": lists ticket/issue categories — Disconnection, Migration (Pre to Post), Plan Downgrade, Language Change, End Data Session, etc.; Mobile Complaints (stated as "200+ Issue types"), Fixed/5G Complaints (stated as "200+ Issue types"), SOC (stated as "35 different service products"), Human Error Complaints; and request types — MNP, FNP port out and port in, Plan Change Request, Add-on Request, Bill Limit. States: "Currently the customer can create requests from MVA which is being sent as report to a Team to contact customer and raise tickets in System." Notes each ticket/issue type has a specific template that agents fill in and paste into "Open UI Tickets Fields."
    - Slides 16-19: Complaints Management Process, Agent Ticket Creation, Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)"), Activities inside Tickets.
    - Slides 20, 22: Automated SMS for Tickets (New Ticket, Re-Opened Ticket — "SMS Content is controlled within teams") and Manual SMS for Tickets (same control note; references "9. Activity Create for ticket SMS").
    - Slide 21: Ticket Auto Assigning to Queue.
    - Slides 23-25: End Data Session Ticket (slide 24 notes agent action shortcut "Ctrl + S").
    - Slides 26-28: TON TT Creation.
    - Slides 29-30: Disconnection Ticket — states "Once the Ticket is Closed by Retention Team, It automatically creates a disconnection order."
    - Slides 31-33: MNP Port Out Ticket — states the ticket is "Auto-Created from NPAS"; activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically.
    - Slide 34: Ticket Status on VF App.
    - Slide 35: Tickets Dashboard.
    - Slide 36: Mobile Complaints Templates — examples named: "Slow Data Performance", "Incorrect Charges".
    - **Slide 37 "Trouble Ticket | Summary"** — explicit current-state note: "The information presented reflects the current ticketing workflow and functionality available in the system." Lists **Proposed Ticketing Enhancements**: (1) Ticket Creation Journey — define/streamline end-to-end ticket creation across all channels; (2) Ticket Segregation — distinct views/handling for Requests, Complaints, Channel Complaints, System-Generated Tickets; (3) Enhanced Auto-Assignment — improve logic with additional parameters and real-time rule updates without system changes; (4) Dynamic Ticket LOV Management — online creation/maintenance of ticket list-of-values with automatic mapping; (5) Automatic Escalation — rule-based escalation to Supervisors/Owners/Teams via email based on predefined criteria.
  - Slide 39 revisits "Activation Channels" (title only, no further body text extracted) — appears to be a closing/appendix return to the first section.

## Cross-references
- This deck is a standalone current-state process overview, distinct in structure from the "BR_25Jun / BR_28Jun / BR_29Jun_UpdateV1.0" workshop decks in this batch (which are forward-looking business-requirement/journey-design discussions). No explicit reference to the BR workshop series was found in this deck's extracted text.
- The Trouble Ticket content (ticket types, MNP Port Out, disconnection auto-creation) may relate to trouble-ticket-focused documents indexed in prior batches (e.g. "TT Hashtags and Actual Issue.xlsx" seen in the extraction log) — not verified in this batch.
- The "VFQA" naming (Vodafone Qatar Activation, presumed) recurs throughout and may tie to activation-channel documents indexed elsewhere in the corpus — not verified in this batch.

## Extraction notes
Confidence is high per the extraction log (6,080 characters via python-pptx, no OCR flagged) and the text is substantially richer than the two BR workshop decks in this batch. However, many slides (e.g. 16-19, 21, 23-36) yielded only slide titles/headers with little or no body text — these appear to be screenshot/diagram-heavy UI-walkthrough slides where the actual screen content, field names, and process-flow diagrams were not captured by text extraction. Speaker notes were captured on at least two slides (slide 3 and slide 4) and are noted as such above.

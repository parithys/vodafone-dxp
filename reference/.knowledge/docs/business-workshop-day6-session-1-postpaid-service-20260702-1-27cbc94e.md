---
slug: business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day6 - Session 1 - Postpaid Service-20260702_101216-Meeting Recording.docx
sha256: 5f9463bd4d3158ce2fd676ad7ceae8c1cf60468c187c694512e752051f9af045
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 6, Session 1 (Postpaid Service — Fixed Line Activation)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026"); session led by "VCLS-Giga" per meeting-notes section, with Sanjeev, Susmita, DEEP, Sabika, Hicham, Anandan as active participants
**Date:** Recording date 02-07-2026 10:12; 99-minute session

## Purpose
Walks through the as-is Vodafone Qatar postpaid Fixed Line service activation journey end to end (location eligibility, KID/Karama ID/Vodafone ID identification, contact/account creation, IPTV/plan selection, number selection, appointment booking) and its exception handling (KID in use, splitter full, BID not mapped, on-site installation issues).

## Key content
- Journey structure: eligibility check on an external web portal (outside CRM, fed by big data/"D theta" plan recommendations and a weekly IMS file mapping zone/street/building to KID) determines whether fiber, indoor 5G, or outdoor 5G is sellable at a location and which plans marketing permits there [00:00:00–00:04:33]. KID (not Karama ID, which is a government utility ID) is the core backend identifier; Vodafone ID (with QR code) is Vodafone's own alternative identifier enabling customer self-activation without a field engineer if ONT boxes are already installed [00:06:43, 00:12:43, 00:17:10].
- Decision: eligibility checks (customer/QID eligibility and location eligibility) will be clubbed together at one point early in the journey, before plan/service discussion, since there's no point discussing plans if the location or customer isn't eligible [00:24:55, 00:24:53].
- Decision: KID in use scenario — order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed. If disputed (old customer claims still active), the order task is marked unsuccessful and the order is cancelled with no downstream impact [00:14:23, 00:55:53, 01:36:38, 01:37:26].
- Decision (action item / to-be improvement): move the KID-in-use document/proof requirement to the START of the journey rather than the end, since the system already knows about the conflict at the location-check step [01:01:38, 01:00:59].
- Decision: numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks, while retaining reserved-number retrieval and list-query options; NOT applied to mobile postpaid since those numbers carry a price [00:41:36, 00:43:35, 00:43:38].
- Decision: appointment step to be enhanced to pre-select the next available date/slot (agent only changes if customer wants different date), calendar selection bounded by the location's SLA cluster (e.g., within 3 days or 1 week) [00:47:52, 00:51:47].
- Business rule: fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM; IPTV basic is free, only premium is charged [00:35:00, 00:35:57, 00:36:25, 00:38:23].
- Decision: FNP (Fixed Number Portability) will be hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission [00:53:37, 00:53:58].
- Action item: digitalize the supplementary form, currently a non-digital attachment [00:55:45].
- Exception handling on installation day: field technician has no Siebel access — raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team; when the Siebel task is closed, the WFM activity is closed and the agent is notified to re-contact the customer [01:24:04, 01:19:51, 01:20:25]. "Win back" tickets are raised by the technician if a customer refuses/hasn't paid on-site, routed to the sales team for retention offers before cancellation [01:06:07]. Splitter-full and BID-not-mapped conditions extend SLA (splitter full forces a minimum 5-day SLA) and are auto-created from UIM data [01:18:06, 01:21:52, 01:22:07].
- Confirmed: appointments live ONLY in WFM — Siebel stores just the reference/activity ID and displays a real-time view; rescheduling possible from either system up until installation/reservation completes; cancellation is allowed up to network activation, with a win-back path via the sales team [01:30:38, 01:07:23, 01:25:05].
- Named stakeholders: VCLS-Giga (session lead, owns most follow-up action items per the meeting-notes section), Sanjeev, Susmita, DEEP, Sabika, Hicham, Anandan (active discussion participants).
- Deferred to later sessions: FWA journey details, plan modification, amendment handling (to be covered during product journey design) [01:31:56, 01:16:59].
- Systems referenced: Eligibility web portal (outside CRM), Big data/D theta, IMS (zone/street/building file source), Siebel (contact/account/order/task creation, stores only appointment reference), OSM (provisioning), UIM (service points, splitter data), WFM (field workforce — appointments, tickets, activities), Vodafone ID, Karama ID, Metrash (government app accepted as alternative address proof), Digital CAF/VCR, TNPS (installation feedback trigger).

## Cross-references
- Continuation of the Postpaid Service workshop series; follows Day 5 Sessions 1–2 (account modification, plan change/DOI) and precedes Day 6 Session 2, Day 7 Session 1 in this batch.
- Explicitly distinct in scope from prior sessions — this is the first session in the batch to focus on Fixed Line (vs. mobile) activation.
- FWA journey and plan modification explicitly deferred to future sessions not included in this batch.

---
slug: business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day6 - Session 2 - Postpaid Service-20260702_131308-Meeting Recording.docx
sha256: 3670df09262445190276bcbb1410729bd5cfae19786dcb4d56d359d906dc6afd
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 6, Session 2 (Postpaid Service — Instant Activation, FWA, Home Moves)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026"); session led by "VCLS-Giga" / "VCLS-Giga 25" per meeting-notes section, with DEEP, Sabika, Hicham, Indu, Sanjeev, Arun, Vinit, Basil as active participants
**Date:** Recording date 02-07-2026 13:13; 119-minute session

## Purpose
Covers the fixed-line instant activation journey (tablet-only), self-serve variant, New FWA journeys for 5G indoor and outdoor, FWA-to-fiber migration, home moves, and closes on installation photo integration, plan/rental changes, STB limits, and combo box password handling.

## Key content
- Instant activation: available only on the OpenGate tablet (not desktop); UIM validates KID-to-CPE mapping and device capability; agent (not customer) verifies device serial; appointment-booking step is auto-skipped and flow goes straight to CAP signature; today limited to the dual-play (no OSN) case [00:00:14, 00:01:20, 00:04:37, 00:08:12].
- Business rule: devices once sold are not returned/recovered on disconnection — the CPE serial simply becomes free in UIM for reassignment [00:03:00].
- Requirement (gap): no photo-of-installation capture in the journey today — flagged as needed [00:10:01]; also flagged: STB replay/scan functionality was dropped due to required OSM changes [00:11:20/00:11:29].
- Self-serve instant activation: fully automated, customer enters parameters directly; restricted to "standard" customers only — non-standard customers get a lead created instead [00:14:01, 00:14:53].
- FWA (Fixed Wireless Access) rules: **fiber-first selling policy** — FWA/5G is only offered if fiber cannot be sold at that location; not a customer choice [00:24:20]. ZSP entry mandatory but email/address fields are validated for presence only, not format — flagged as a data-quality gap/requirement [00:22:22, 00:23:58]. For 5G indoor: SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE [00:27:02, 00:28:26, 00:30:34]. **Site lock** is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere — explicit abuse-prevention control [00:31:41, 00:54:13].
- FWA outdoor: commercially identical pricing/benefits to indoor — the difference is purely technical (signal strength/equipment) [00:43:13, 00:44:27]; requires a WFM appointment (serial scan step skipped since device needs installation); if outdoor install fails (access/glass issues), indoor is offered as fallback or the order is cancelled [00:45:47, 00:48:47]. Decision/requirement: replace order cancellation with an in-place order update when falling back outdoor→indoor before provisioning [00:50:09, 00:51:57].
- Mesh/LAN: CPE is free; mesh selected during installation (not before) based on coverage, added as an add-on; premium plans get 2 free mesh, additional mesh charged as rental (not one-time); LAN cable extension charged 10 riyal/meter as one-off add-on; on 5G only premium gets mesh, others must pay for LAN if needed [00:56:12, 00:58:11, 01:31:46, 01:32:28].
- FWA-to-fiber migration: NOT automated today despite the stated business rule that once a location becomes fiber-covered the customer "will be moved" from 5G to fiber — actual process is a BI report (by ZSP) → business team candidate list → fulfillment tickets → agent calls customer → Open UI order → full feasibility/ONT/service-point checks redone from scratch → fiber activated FIRST, then 5G disconnected and equipment recovered [01:01:33, 01:03:11, 01:05:07, 01:10:02, 01:11:00]. Customers already on a post-October/September-2025 FWA plan get a plan change; legacy-plan customers require a brand-new fiber order [01:07:35]. Flagged as a target for future automation (follow-up task).
- Home moves: matrix of fiber/5G × indoor/outdoor combinations, each with WFM-installation-required and dismantle-required flags; only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket, explicitly called out as "a pain point" [01:13:21, 01:15:51, 01:18:25]. Volume: ~300 home moves/month across fiber and 5G [01:21:55]. Customer always initiates (never the agent); old service stays live until new location is provisioned; billing adjusted pro-rata [01:16:33, 01:19:16, 01:21:26]. Open question/action item: should a home move be a new order or a modification order (unresolved) [01:23:49].
- Device lock-in: 12 months; commitment/lock-in reset ONLY happens on disconnection during FWA relocations/moves, not on normal support device replacement; any plan change resets the "limit date" and loses locking [01:25:44, 01:26:00, 01:27:41].
- Closing topics: installation photos (~7-8 per job) flow from WFM into Siebel as install assets automatically [01:29:10]; up to 18 STB subscriptions certified per connection (highest seen in production: 11-13) [01:38:24, 01:38:59]; combo box/CPE password is fetched from UIM, never disclosed to customer or (today) even to the field engineer — decision to store it in the system so engineers can configure without calling the network team [01:42:15, 01:44:53, 01:47:30].
- Named stakeholders: VCLS-Giga/VCLS-Giga 25 (session lead, owns most follow-ups), Hicham (confirm CPE serial handling), Arun (check Wi-Fi service modification), Vinit (explain combo box password technical side), Basil (device locking/commitment reset review), DEEP, Sabika, Indu, Sanjeev (active participants).
- Systems referenced: UIM (KID/CPE mapping, combo box password source), RFS/RFS portal, OpenGate tablet, CAP, OSM, TR069/TORUS (mesh config, not yet integrated), WinCash/WinCache, WFM, BI report, Open UI, Vanilla (migration explicitly NOT a vanilla journey), Siebel, ONT reservation.

## Cross-references
- Continuation of the Postpaid Service workshop series; follows Day 6 Session 1 (fixed line activation, same day) and precedes Day 7 Session 1 in this batch.
- Explicitly builds on Day 6 Session 1's KID/eligibility framework, extending into instant activation, FWA, and home moves.
- Agreed next-session sequence: continue with "address" topics, then start disconnection.

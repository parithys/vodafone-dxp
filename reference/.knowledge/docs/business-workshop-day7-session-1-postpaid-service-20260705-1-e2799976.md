---
slug: business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day7 - Session 1 - Postpaid Service-20260705_124049-Meeting Recording.docx
sha256: abc1cd7c39ef52807a9e0b1362a143422194560e975fe06d979a8840dfb1514d
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 7, Session 1 (Postpaid Service — Address/Service Point and Transfer of Number)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026"); action items attributed to Chandan, Tisha/Krishna, Operations Team, Solution/Architecture Team, Business & CRM Team
**Date:** Recording date 05-07-2026 12:40; 78-minute session (paused partway with plan to reconvene at 1pm)

## Purpose
Covers two distinct topics: (1) Qatar address/service-point data modeling in Siebel (Karama ID/KID, Vodafone ID, zone/street/building, RFS determination, address history) and (2) the Transfer of Number (TON) process across its three variants (BAU, claim of ownership, third-party/cancelled-ID).

## Key content
### Address / Service Point
- Karama ID (KID), issued by the government/electricity authority (shown on the building's blue plate), is the primary identifier used to determine RFS (Ready for Service); agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey [00:03:53, 00:04:10].
- For partitioned villas (one government KID, multiple units), Vodafone appends underscore indexes (_1, _2, _3) to create unique service-point identifiers, and introduced its own Vodafone ID (VFID), physically pasted at each unit, mapped 1:1 to points of presence identified by field engineers [00:01:31, 00:02:24, 00:05:34].
- Legacy issue: historically all address uniqueness was captured as free text concatenated into "address line 1" (e.g., "ZSB 69-220-13") — no discrete searchable fields. Requirement: split address line 1 into discrete fields searchable by KID or ZSB, WITHOUT disrupting current loading, search, invoicing, and email processes [00:07:45, 00:08:02, 00:11:24 — decision explicitly NOT to disrupt current concatenation yet].
- Requirement: maintain address as a separate entity with history — old address marked discontinued/replaced with effective from/to dates, new address created as primary, rather than updating the address record in place; identical behavior required whether the update originates from CRM or self-service [00:13:46, 00:14:34, 00:16:12, 00:16:34].
- Business rule: ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record that "cannot be changed because changing it impacts everybody" [00:20:38, 00:21:02].
- FWA is geofenced to its registered location — service is disabled/suspended if the customer moves the device elsewhere; there's a repeated-communication process to transition FWA customers to fixed once their location becomes RFS [00:21:19, 00:21:41].

### Transfer of Number (TON)
- Three TON types: (1) **BAU TON** — both parties physically present in store, happy path; (2) **COO/claim of ownership** — only the number's user is present, number registered to someone else, typically caused by an agent SIM-registration mistake; **on hold for ~2 years** but retained in the system for possible resumption; (3) **third-party TON on cancelled ID** — original customer's ID is cancelled (left country or deceased), detected only reactively via MOI file/BI-built hold-down and invalid-ID tables [00:28:37, 00:33:38, 00:34:00, 00:39:55].
- Process for third-party TON: MOI shares a file; BI builds a hold-down table and invalid-ID table; bulk notes uploaded to Siebel Open UI monthly; an SMS is sent to eligible users who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store [00:43:33, 00:44:38].
- Documents required: customer application form, TON form, QID (or diplomatic ID) for party B (party A may use passport/DCC/QID), a free SR for QID update, and — for star numbers valued 1,500 Riyal and above — a customer data restoration/declaration form (listing recent usage) with a clause letting Vodafone reclaim the number if the transfer is found fraudulent [00:45:59, 00:47:23, 01:03:51].
- Star number transfer requires EITHER a one-year postpaid commitment scaled to the number's value OR payment of the star number's value if going prepaid; commitment restarts from month one regardless of the prior customer's progress; star number penalty is still collected manually in cash via WinCash under a separate SKU (postpaid penalty reflects automatically) [00:52:23, 00:52:28, 00:58:13].
- Key inefficiency flagged: the line is migrated to prepaid BEFORE the TON is raised, purely because back-office approval takes ~20 days and validation is manual — explicitly identified as a workaround for a validation gap, not a genuine requirement ("if validations can be automated in real time the migration step may not be needed") [00:55:16, 00:59:00].
- Decision: automate wherever feasible — target ~70-80% of TON cases — with remaining exceptions routed to manual tickets; make TON business rules configurable (business rule engine); allow the journey to split into two separate payment steps for party A and party B (rather than forcing a single-flow structure); business to document exact checks per scenario for automation review [01:02:04, 01:08:56, 01:14:19, 01:14:36].
- Requirement: age validation (must not be a minor) via MOI/date-of-birth, noting a known 5-8 day MOI database sync lag risk for someone turning 18 [01:00:35]. Requirement: pre-validate that neither party A nor party B is in collection BEFORE entering the TON flow, not inside it [01:12:57, 01:13:43]. Entire DOI (not just first installment) and any remaining lock-in/park-my-number penalties must be cleared before transfer [01:15:17, 01:15:53].
- Open/unresolved: who pays the 50 Riyal TON fee (currently left to the customer at store discretion — flagged as blocking automation of the receipt) [01:10:53, 01:11:25]; whether WinCash payment should occur early or late in the flow, and whether disconnection triggers before or after payment [01:06:53, 01:08:06].
- Named stakeholder/owner in action items: Chandan (verify RFS service-point loading process), Tisha/Krishna (walkthrough of current TON validations — Tisha specifically noted at 00:22:43 to present TON).

## Cross-references
- Continuation of the Postpaid Service workshop series; follows Day 6 Sessions 1–2 (fixed line/FWA activation, home moves) in this batch — directly builds on the KID/RFS/address concepts introduced there.
- Session was paused mid-way (01:16:26) with the group planning to reconvene at 1pm; a follow-up workshop on TON automation requirements/validation rules was recommended as an action item — likely captured in a later, not-in-this-batch session.

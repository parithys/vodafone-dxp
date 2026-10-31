---
slug: business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day2 - Session 1 - Postpaid Service-20260628_124041-Meeting Recording.docx
sha256: 47bc4073fe416c481933945059f61a082ad3b07ca7ae0ba64c45de5ac625f516
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 2, Session 1 (Postpaid Service)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026")
**Date:** Recording date 28-06-2026 12:40 (session date stated in doc as "2026-62-8", evidently a mis-rendered 2026-06-28); 111-minute session

## Purpose
Structured summary/transcript of Day 2 Session 1 of the Vodafone Qatar CRM & IT stack modernization business workshop, continuing the postpaid retail (new customer) journey from Day 1: CAF (Customer Application Form) generation and signature, payment/WinCash handover, and customer 360/account model design.

## Key content
- Decisions: CAF will display on tablet for customer signature only, with view shifting laptop→tablet→laptop; a configurable, business-admin-controlled "highlighted key T&Cs" section will be added to the CAF flow rather than agent-selected highlights (agent selection was rejected to reduce clicks/errors) [00:25:25].
- Decision: incomplete/pending orders held in a transient state (not created as an order at the GSP layer) with hold period tied to the channel's number reservation expiry, generally up to ~48 hours [00:36:27, 00:37:27, 00:56:29].
- Decision: journey resume via internal milestones (e.g., cart creation) rather than restart from scratch; an "in-progress journeys" list will appear on the agent login page [00:39:54, 00:41:41].
- Decision: cross-channel, cross-agent journey pickup is NOT currently feasible; only same-channel/same-process cross-agent pickup (e.g., store to store) is confirmed; feasibility of cross-channel to be checked [00:44:46].
- Decision: move from Siebel profile-based access (5 profiles: mid value, high value, broadband/fixed, Key Accounts, Mass Market) to a new role/team-based access model; device (tablet vs desktop) should not govern journey — it should only affect rendering; Mass Market is defined as a persona, not a device [00:38:29, 01:47:15, 01:48:56].
- Decision: confirmation message text to be changed from "account activated" to "order submitted successfully" since provisioning still goes through OSM/Siebel after submission [01:01:11], owner Gagan.
- Metrics: Vodafone sales force ~600 users total, ~300 retail / ~300 other channels (Mass Market, Key Accounts, Mini Stores, Direct Sales, tablet, back office) — roughly 50/50 split [00:53:07].
- Requirements captured with timestamps (functional/business/non-functional), e.g.: digital signature pad must move from OpenUI integration to the new custom Siebel/DXP frontend [00:06:12]; CAF must have unique serial/ID and naming convention [00:09:14]; WinCash must be integrated even for zero-payment transactions to print receipts [00:59:10]; customer 360 must be single page with tab-based partial refresh [01:15:07]; screens should align to PIP pre-built APIs rather than new custom APIs [01:22:29].
- Named stakeholders/owners in action items: Giri (provide CAF forms), Business (decide highlighted content), Ellen and Priyanshu (pending-journey visibility for other agents), Vodafone (channel/role structure session, journey list document, Enterprise view snapshots), Gagan (confirmation wording, timeline/order chronology UI, whole-page customer 360 view), Sanjeev (account model/hierarchy session).
- Open questions: how many days to hold incomplete orders (24 vs 48 hrs); can reservation period be extended; whether cross-channel pickup is technically feasible; what user model will be proposed (EXP, Siebel, or other microservice); whether tablet user roles will be split beyond all-or-nothing.
- Account model discussed: customer legal entity → billing account entities (each with one bill profile) → service accounts (each with one MSISDN); noted this hierarchy is not represented in current screens and needs redesign [01:21:58].

## Cross-references
- Continuation of Day 1 Session 1 postpaid workshop (referenced as "Day 1", not separately in this batch).
- Related to other Business Workshop Day 2–Day 7 Postpaid Service sessions in this same batch (Day2 Session 2, Day4 Session 2, Day5 Sessions 1–2, Day6 Sessions 1–2, Day7 Session 1, and the initial Session 1 dated 20260625).
- References a pending detailed Excel mapping of journeys/roles from Vodafone Qatar (not this batch's CRM Journeys_Final_Updated.xlsx by name, but likely related to it).

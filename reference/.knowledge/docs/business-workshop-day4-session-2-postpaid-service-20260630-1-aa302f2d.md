---
slug: business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day4 - Session 2 - Postpaid Service-20260630_153123-Meeting Recording.docx
sha256: 5d491741208996487aae130ee22c7dff3fa71c34b30391726d0eeacc677eb677
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 4, Session 2 (Postpaid Service — Trouble Tickets)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026")
**Date:** Recording date 30-06-2026 15:31 (session date field mis-rendered as "2026-63-0"); 135-minute session

## Purpose
Walks Wipro through Vodafone Qatar's as-is Trouble Ticket (TT) system in Open UI/Siebel for postpaid service: ticket layers/types, the creation flow, special ticket journeys (End Data Session, Transfer of Number, Disconnection, MNP port-out), Agent 360/asset summary/notifications, and an improvement wish list for the to-be design.

## Key content
- Ticket sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket) [00:01:12–00:01:38].
- Special journeys documented in detail:
  - **End Data Session**: auto-created and auto-closed ticket to refresh a long-running IN session and force CDR generation; goes to no team [00:44:33, 00:46:55].
  - **Transfer of Number (TON)**: prepaid-only; requires four sequential approvals routed to the CDM team; built as a fraud control after historical fraud where a fraudster collected money from two people for the same number at different stores within an hour [00:49:37, 00:51:44]. Requirement: automate approvals via rules (SAR number, contract minimum stay) rather than human approvers, limiting human involvement to exceptions [00:51:09].
  - **Disconnection**: retention-first business rule — ticket closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page [00:55:12, 00:57:53]. Only plan/commitment penalties are automated today; star number and device penalties are checked manually by the retention agent (being automated in a separate project) [00:57:56, 00:59:07]. Regulatory issue flagged: today plan change restarts the commitment period, but regulation requires the original commitment to continue on upgrade (downgrade is a breach triggering a penalty) [01:00:47, 01:00:52].
  - **MNP port-out**: auto-created from NPAS (government-managed inter-operator system) into an MNP queue; unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched; automated checks (low outstanding, not blacklisted) are recorded as ticket activities [01:02:14, 01:02:48, 01:11:21]. Star number port-out control blocks porting during the commitment period (configurable), built after customers took high-value star numbers and immediately ported out [01:05:12/01:05:16, 01:05:36].
- Decision: dedicated follow-up sessions will club Transfer of Number, Disconnection, and MNP port-out together as complex journeys [01:33:03].
- Improvement wish list (not yet decided, captured as requirements): auto-population of ticket fields from account/MSISDN context; segregation of requests vs. complaints with different SLAs (current in-system SLA is 24 hours, flat) [00:12:23]; enhanced auto-assignment to agent level based on availability; dynamic ticket LOB management (currently new LOBs require a release); automatic escalation; supervisor visibility across all agents' tickets (currently no such view exists) [01:15:34]; make public notes as prominent as the bell icon (agents currently miss them) [01:59:36].
- Business rules: tickets assigned at team/queue level, not agent level, with no automatic reassignment on delay [00:12:59, 00:13:23]; audit trail exists on tickets and account tabs but is role-restricted from agents [01:19:29]; a ticket created but not submitted does not route to any queue [01:19:48]; "assign to me" only works if the agent is in that queue's user list [02:09:00]; a customer cannot reopen a ticket from the app, only an agent can [01:13:14].
- Named stakeholder/owner in action items: Aniruddh (business, to share sample TT templates from the knowledge base).
- Systems referenced: Open UI (main CRM ticketing front end), NPAS/N-POS (MNP), MVA (My Vodafone App — does not create Siebel tickets directly), eShop, Portal, Knowledge base (standalone, managed by training team), IN (data session / CDR / asset dashboard source), WinCash (TON receipt integration requirement), Siebel, Remedy/MIT (separate L2 ops tool, not integrated), Vanilla.
- Open questions: SLA definitions for request vs. issue tickets; whether fixed-line numbers appear in SMS recipient dropdown; number of agents per team/queue; retention period for public notes (answered: none, stays indefinitely); whether priorities will be used in to-be design (not used today).

## Cross-references
- Continuation of the Postpaid Service workshop series (Day 2 Sessions 1–2 in this batch cover CAF/payment/SIM swap/billing; this Day 4 Session 2 covers trouble tickets — a different functional area).
- Related to other Business Workshop Day 5–Day 7 Postpaid Service sessions in this batch.
- References an upcoming dedicated session on Transfer of Number, Disconnection, and Port-Out/MNP together.

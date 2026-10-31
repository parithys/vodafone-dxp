---
slug: business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day9 - Session 1-20260707_123707-Meeting Recording.docx
sha256: bd623e1fc7ec124081ccc966428466a672d21a01ed452ee1f48becaacbe7f8e1
indexed: 2026-08-20
confidence: high
---

# Business Process Review — Day 9, Session 1 (MNP and FNP Port-In, Fulfilment)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document created 17 August 2026)
**Date:** Recording date 07-07-2026 12:37; duration 108 minutes

## Purpose
Transcript and structured summary covering the fulfilment team's Mobile Number Portability (MNP) and Fixed Number Portability (FNP) port-in processes end to end, including Siebel order creation, donor operator interaction, porting windows, and post-port-in billing/dunning.

## Key content
- MNP: sales sends CAF, MNP form and QID/passport to fulfilment; fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date), a reserved zero-value temporary MSISDN, and attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).
- Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues (stated payment window is 8 business hours, presented to the customer as 24 hours).
- Porting window: Sunday–Thursday, 11am–12pm, a shared one-hour window in which the donor disconnects and Vodafone connects; requests accepted before 10:45am make that day's window.
- Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey.
- Gaps raised: Siebel only shows in-progress/failed with no port status visibility for agents/field teams; the temporary number concept was agreed to be removed or fully automated on regulatory, security and inventory-wastage grounds; holiday/Ramadan date calculation is manual; no defined handover between the order-raising team and the outsourced document-collection team on the same order.
- FNP (fiber-to-fiber only, consumer, 5 working days): installation/RFS check happen first; a trouble ticket is raised with a manually calculated target date; FNP form (mandatory Karma ID) and ID sent via NPAS to Ooredoo, who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date. FNP porting is at service level (vs. MNP's number level) and always needs two technician visits — one for installation per WFM, one on the porting date for MSISDN configuration/testing.
- After port-in, a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs (outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine). Degradation is initiated by Ooredoo (the donor) and was de-automated to manual after complaints from customers with legitimate bill disputes.
- Agreed: cover consumer only for now; continue with MNP programme in the next session (Day 9 Session 2, same day).
- Key requirements raised include: reminder SMS automation, a single common journey across submitting channels, order/porting status visibility for all submitting roles, automated holiday-calendar handling for FNP target-date calculation, and automated preponement/postponement support for FNP.

## Cross-references
- Directly continues into "Business Process - Day9 - Session 2" (same day, MNP/FNP port-out and Siebel ticket automation detail), also in this batch.
- Part of the same workshop series as Day 10, Day 11, Day 12 files in this batch.

## Extraction notes
None — extraction via pandoc yielded 72,366 characters, confidence high. No speaker diarization; named individuals appear only where explicitly mentioned (e.g., Akhilesh assigned an action item on rejection reasons).

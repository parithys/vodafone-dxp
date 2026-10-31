---
slug: business-process-day9-session-2-20260707-131317-meeting-reco-e3243830
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day9 - Session 2-20260707_131317-Meeting Recording.docx
sha256: a0726e7b8a1f76db208183c5033a811f22476a93f03f7476580e30c4f2119ee0
indexed: 2026-08-20
confidence: high
---

# Business Process Review — Day 9, Session 2 (MNP/FNP Port-Out and Ticket Automation)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document created 17 August 2026)
**Date:** Recording date 07-07-2026 13:13; duration 52 minutes

## Purpose
Transcript and structured summary covering MNP and FNP port-out and port-in ticket handling in Siebel, walked through live, including auto-validation logic, conditional acceptance thresholds, and pain points in ticket distribution and status tracking.

## Key content
- Flow walked through live: customer's SMS goes to NPass, NPass notifies Siebel, and Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours (~7:30–3:30/4) as a hard stop rather than an SLA.
- System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure so only clean tickets reach fulfilment.
- Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual because Siebel cannot read the digital form and the documents live only in NPass. Key request raised: bring those documents into Siebel via the ticket attachment, subject to NPass API design/availability.
- Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP. FNP, by contrast, allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level.
- Commitment/plan penalty and device dues cannot block a port-out because they are unbilled; they are calculated manually today and issued as a pro-rated final invoice. Business requirement raised: system should calculate plan penalty, device dues and locking charges automatically.
- Statuses and the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9, with detailed explanations captured at ticket level.
- Other pain points: manual export and distribution of 200–300 tickets a day instead of direct queue assignment (bulk owner change is possible as a workaround); manual status update after payment for B2B2C; need to act at least an hour before SLA expiry; suspension and CRM escalation triggered when action is missed; request to restore the Siebel email notification to the group mailbox for ticket receipt and timer expiry.

## Cross-references
- Direct continuation of "Business Process - Day9 - Session 1" (same day, MNP/FNP port-in fulfilment process), also in this batch.
- Part of the same workshop series as Day 10, Day 11, Day 12 files in this batch.

## Extraction notes
None — extraction via pandoc yielded 67,147 characters, confidence high. No speaker diarization available.

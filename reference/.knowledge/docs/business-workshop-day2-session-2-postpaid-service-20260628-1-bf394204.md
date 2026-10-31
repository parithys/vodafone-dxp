---
slug: business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day2 - Session 2 - Postpaid Service-20260628_154317-Meeting Recording.docx
sha256: 9e5295c8444936f7467b49bbf539f989bea921aed0c6eec6d7c2eae97513432a
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 2, Session 2 (Postpaid Service)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026")
**Date:** Recording date 28-06-2026 15:43; 88-minute session

## Purpose
Structured summary/transcript of Day 2 Session 2 of the workshop, covering billing account/bill profile changes (billing hierarchy, email verification, AutoPay, bill medium), enterprise-vs-consumer account migration issues, the SIM Swap journey (OCR/MOI validation, approval matrix, charging), and voluntary suspension ("park my number").

## Key content
- Decision: introduce a new billing account entity — multiple services can link to one billing account; billing account holds one bill profile; billing address can differ from customer address [00:04:33, 00:04:59].
- Decision: support multiple bill email recipients (CC) and multiple email types per contact (work/personal); billing profile to be linked to a contact for traceability [00:06:50, 00:13:42, 00:13:57].
- Decision: emails captured as unverified at entry, verified asynchronously via callback before next bill generation; agents cannot enroll/cancel AutoPay or see card details (regulatory restriction) — agents get view-only visibility of AutoPay status and failure reason [00:14:38, 00:29:53, 00:30:59].
- Decision: bill medium defaults — detailed bill for consumer, summary PDF for enterprise, with customer option for summary only [00:33:06].
- Decision: bill cycle change restricted to specific roles (billing team); business rule for change eligibility must be configurable, not hard-coded; a ticket is always created even when a change isn't allowed, but auto-resolved in real time [00:24:31, 00:26:20].
- Open/unresolved: enterprise investment accounts vs. consumer postpaid segment migration is difficult due to differing bill cycles and data impact — rationale for keeping enterprise investment accounts is unclear and needs further analysis [00:34:28, 00:38:48].
- SIM Swap journey: charging rules — eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged [00:44:16, 00:52:02]. Validation chain: OCR of ID → match barcode → MOI API (name, DOB, nationality) → match against existing CBS/customer information (SIM Swap has this extra third validation step) [00:56:34, 01:00:07]. Approval matrix by channel: Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done [00:54:39].
- Decision: agents cannot manually enter ID details, only re-scan; a manager-level bypass allows editing QID number only, with remaining fields validated against MOI [01:00:56, 01:01:04].
- Named risk: "the number one fraud reason for service operations and activations is someone bringing someone else's [genuine] ID" — OCR/barcode/MOI checks all pass in this case since the ID itself is genuine [01:04:31/01:04:53].
- Decision: voluntary suspension is being discontinued and will always be implemented as a plan change; renamed "manual suspension"; delivered via a 35 Rial, four-month upfront-paid "park my number" plan with credit limit set to zero; restricted to specific roles and run as a back-office ticket-driven process, not a retail journey [01:15:57, 01:20:54, 01:23:25, 01:24:12, 01:18:52].
- Named stakeholders: Deep (owns updating the SIM Swap flow to add OCR/liveness/MOI steps and the missing scan step — actions timestamped 00:51:24 and 01:14:17), Fahim (to be consulted on ID scanner/camera questions), Sanjeev (referenced as absent from a sub-discussion), Lorenzo (mentioned re: existing email-related tool licenses), Sowmya (IT team, email validation roadmap clarity).
- Systems referenced: Zero Bounce (email validation), MOI API (ID verification), IDWise (OCR/ID capture — captures front+back and does OCR in one event; open question on Arabic translation support), WinCash (payment for SIM swap charge), CBS (existing customer information match), Taurus (currently only collection team uses it for suspension).
- Open questions: can bill cycle be changed with fewer restrictions if customer has no personal account; is signature verification on ID feasible (answered: no, images never match so kept manual); can auto debit be retriggered by an agent (answered: no); is a separate barcode scan needed (answered: no, IDWise does both in one capture).

## Cross-references
- Continuation of Day 2 Session 1 (same day) postpaid workshop.
- Related to other Business Workshop sessions in this batch (Day4 Session 2, Day5 Sessions 1–2, Day6 Sessions 1–2, Day7 Session 1, initial Session 1 dated 20260625).
- References an existing PDD (Process/Product Design Document, not otherwise identified) already covering park-my-number/suspension enhancements [01:17:27].

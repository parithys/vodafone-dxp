---
slug: business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Workshop - Day5 - Session 2 - Postpaid Service-20260701_131351-Meeting Recording.docx
sha256: 7a68c75f13e5010f03c110ea04ef2b8d857dba8f4eeaf4b82a2e028ac6dffa71
indexed: 2026-08-20
confidence: high
---

# Vodafone Qatar - CRM & IT Stack Modernisation: Business Workshop Day 5, Session 2 (Postpaid Service — Plan Change, Migration, Multi-SIM, DOI)

**Type:** meeting notes (structured transcript summary of a recorded workshop)
**Owner / author:** not stated (document auto-generated from meeting recording, "Document Created 17 August 2026")
**Date:** Recording date 01-07-2026 13:13; 172-minute session

## Purpose
Walks through management journeys in Siebel/Open UI: add-on add/delete and failed-order handling, plan change (postpaid-to-postpaid, prepaid-to-postpaid, postpaid-to-prepaid), the promotion-bundling model, Multi-SIM/iWatch, Siebel queues, number reservation/number management portal, credit limit defaults, and Device Installment (DOI) across retail and telesales including the target DXP-based flow.

## Key content
- Business rule: the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade) [00:10:24]. Requirement raised to add real upgrade/downgrade differentiation in the new system [00:10:35].
- Decision/rule: plans, discounts and add-ons are bundled into named "promotions" specifically to prevent agent misuse of discounts (e.g., an agent giving 30% when only 20% is authorized); a new bundling approach with business logic built in is needed rather than one promotion per plan/discount/add-on combination [00:11:28, 00:12:47, 00:14:56].
- Prepaid-to-Postpaid migration: requires postpaid billing profile creation (manual step today) [00:20:45]; eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check [00:32:14, 00:32:26, 00:33:16]. Stated rationale: prevent abuse where customers take prepaid, migrate immediately, and exploit postpaid credit, sometimes running up charges and abandoning the account [00:33:48, 00:35:16].
- Postpaid-to-Prepaid migration: 100 Riyal migration fee applied on the final bill; in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers) — "today it is not automated," flagged as a revenue-leakage risk if forgotten [00:25:00, 00:28:57/00:29:04, 00:29:34]. Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more [00:27:34]. Remaining prepaid balance posts as an overpayment in BRM; monetary balance transfers as advance/credit, but non-monetary voice/data buckets are lost [00:29:57, 00:31:32].
- Multi-SIM/iWatch: secondary MSISDN linked to primary but invisible to the customer; up to 4 multi-SIMs depending on plan; pricing set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal) [00:38:45, 00:41:12, 00:41:27].
- Number management: two categories only — free and paid (paid can become free depending on plan) [00:55:45]; confirmed the number management portal IS in scope for the new solution and its search experience needs to be defined [00:53:59]; direct number reservation from Siebel is generally not allowed except special cases [00:53:38].
- Credit limit: default 1,000 for expat on new account, dropped to 50 for HRN customers (agent-selected or system-enforced depending on nationality config) [00:59:40, 00:59:44]; no system restriction today preventing any agent from selecting any credit limit value [01:00:21] — flagged as an "uncontrolled credit exposure" risk; the old credit-limit-deposit-for-increase process was discontinued because there was no refund mechanism when customers disconnected [01:02:10].
- Device Installment (DOI): detailed old retail process (happy-offer eligibility, OTP, back-end validation) vs. current retail process (portal eligibility via "big data" logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order) vs. telesales process (portal-driven, delivery-partner confirmation, CAF generated only after delivery/order completion at Open UI) [01:06:24, 01:09:49, 01:08:11]. Target DXP flow agreed: identity validation and DOI validation (via EDW) in DXP, product catalog in DXP, installment breakdown, stock validation/reservation and first-installment payment in WinCash, order auto-created and auto-closed since there's no delivery step in retail [01:16:03, 01:17:00].
- Unresolved conflict flagged: disagreement between participants on whether the DOI Siebel order submission is automated or still manually submitted by the fulfillment team within 24 hours — action item to confirm, owner Hisham [01:14:40, 01:15:05].
- Named stakeholders/owners in action items: Sustin (list of validity-tab validations), Gary (raise credit limit deposit/increase requirement in Day 6 billing/credit-control session), Giri (explain retail DOI part), Hisham (confirm DOI order automation), Thaneep (referenced re: whether DOI orders flow automatically).
- Deferred topics: account hierarchy, limit history (to billing session), Multi-SIM/iWatch details (separate session), pre-approved credit limit/enterprise topics (enterprise session), Siebel number selection (next day).
- Systems referenced: Remedy (failed-order tickets), Vanilla, WinCash, Siebel, BRM, CDR, Number management portal, Device installment portal, DXP, Big data logic (DOI eligibility), OMS, Open UI, GWC (delivery layer), EDW (DOI validation), Happy offers.

## Cross-references
- Continuation of the Postpaid Service workshop series; follows Day 5 Session 1 (account/service modification verification, same day) and precedes Day 6 Sessions 1–2, Day 7 Session 1 in this batch.
- Credit limit deposit/increase requirement to be raised again in Day 6 with billing and credit control.
- Device installment set aside for a dedicated deeper review; WinCash integration also flagged as needing its own detailed session.

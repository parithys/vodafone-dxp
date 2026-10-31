---
slug: business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day11 - Session 2-20260709_155305-Meeting Recording.docx
sha256: 23b2698099f771d0f87a9f28bc8ba2c6b792fc590e2abc6a45aca8a8af1baaff
indexed: 2026-08-20
confidence: medium
---

# Business Process Review — Day 11, Session 2 (Enterprise / IoT Services & Order Journey)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document created 17 August 2026)
**Date:** Recording date 09-07-2026 15:53; container duration stated as 108 minutes, but the document itself notes the recording is damaged and only ~70 minutes actually decoded, with the transcript ending abruptly mid-discussion at 01:09:25

## Purpose
Transcript and structured summary covering enterprise/IoT services provisioned directly from CRM and the billing touchpoint for services fulfilled outside CRM, plus the enterprise order journey and its contact-capture gap.

## Key content
- Services discussed: Fleet Management and Asset Tracking (IoT SIMs; activation team does bulk activation; devices may be third-party or Vodafone-supplied with an identifier held); Global M2M (managed service account product built in Siebel for billing only; SIMs supplied by the DSP and activated on the GDSP group IoT SIM management platform; charged as a lump amount); DAPN/dedicated APN (Enterprise Large segment; POC devices/tablets; data SIM with static IP; numbers reserved one by one from the mobility-only category; no bulk template); Push-to-Talk (Vodafone's own service under a partnership, to be modelled under mobility); Microsoft licences and cloud (billed in Siebel, provisioned outside); Starlink/satellite (account-level product, device not added); enterprise broadband/fixnet bundles.
- End-to-end flow described: account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN → delivery (physical, by SBN) and provisioning → provisioning successful → client accepts → billing (meaning service activation for charging, not immediate invoice).
- Pain points: static IPs must be found manually in the pool (search does not work); numbers reserved one by one for DAPN with no bulk template; number of connections not shown in Siebel or on the invoice; one line item per Microsoft licence with manual price changes because quantity does not carry to billing without "auto-explode"; heavy reliance on account-level products with no Service ID and manual provisioning by business teams.
- Major architectural ask: move away from account-level products to generic services with Service IDs, under which products (PTT, Microsoft licences, etc.) can sit.
- Data share pool rules, member-level shared limits, and the MS Dynamics vs. Siebel split for the pre-provisioning workflow were also discussed.
- Enterprise order journey: described as "vanilla direct" rather than a guided journey; starts from CR number; one order equals one location; prerequisites are care form/CIO copy/oversight copy plus site survey.
- Gap identified: the installation site engineer/point of contact is only captured as a free-text comment because a contact cannot be created without an ID — this causes appointment notifications to go to the wrong person.
- Contact roles noted: chooser, payment support, technical contact.
- Session ended with enterprise SMEs to be brought in "next week" to continue.

## Cross-references
- Direct continuation of "Business Process - Day11 - Session 1" (enterprise account setup), also in this batch.
- Part of the same workshop series as Day 9, Day 10, Day 12 files in this batch.

## Extraction notes
Confidence set to medium: the document itself flags that the source recording was damaged (only ~70 of a claimed 108 minutes decoded) and the transcript cuts off abruptly mid-discussion at timestamp 01:09:25. The extraction tool reported high mechanical confidence (72,454 characters of plain text pulled cleanly via pandoc), but the underlying recording is known-incomplete, so content past ~01:09 in the session is not captured at all and should not be assumed absent from the actual meeting.

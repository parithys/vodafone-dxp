---
slug: business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day12 - Session 2-20260712_155508-Meeting Recording.docx
sha256: 8f04f4f9ecace3c6c44406e0c7b16d6fdd50f5c63a24412f2c03747ba712d668
indexed: 2026-08-20
confidence: high
---

# Business Process Review — Day 12, Session 2 (Device/IoT Ordering, Siebel Behaviours, Bulk SMS, Invoice Redesign)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document created 17 August 2026)
**Date:** Recording date 12-07-2026 15:55; duration 125 minutes

## Purpose
Transcript and structured summary covering three blocks: closing items on device/IoT ordering, current Siebel CRM behaviours, the Bulk SMS journey end to end, and a detailed walkthrough of the enterprise invoice (PDF/Excel) redesign requirements.

## Key content
- Device/IoT ordering: the Vodafone Smart Device ("Smart Viper") has its own device ID and non-mobile number range; IoT numbering discussed; WFM (workforce management) is not required for small/indoor devices; enterprise asked that products be chargeable quarterly, half-yearly and yearly rather than the current monthly-only billing.
- Current Siebel CRM behaviours: an Excel export feature is available, uncontrolled, on all tabs and heavily used for plan/promotion analysis; performance pain when loading large enterprise accounts, the billing profile page and the CDR page; parent/sub-account hierarchy confirmed again (parent holds only contacts, sub-accounts hold active numbers and bills); agent IDs map accounts to separate mobility and fixed account managers.
- Bulk SMS journey walked through end to end: assisted onboarding via account manager with short code and SMTP checks; external international short code registration; fulfilment and control document approval; account and order creation in Siebel; integration through OSM to a separate Bulk SMS platform; billing owned by the Bulk SMS platform with aggregated rated CDRs received on the first of the month; disconnection with outstanding-balance checks and OnMobile confirmation; support split between Remedy tickets (to OnMobile) and Siebel adjustments (for billing config issues). "Bulk Business Pro" introduced as a future self-registration model.
- Invoice redesign (largest block): business asked for a cosmetic-only redesign of a very old template presenting the same information more clearly. Specific asks: resolve banner/table overlap by reducing banner size and adding page-level subtotals; group line items under service ID/circuit ID with one-off charges linked to their circuit; add tax code and tax number placeholders; display service ID for account-level and other services; match ordering between PDF and Excel; sort CDRs by date/time with a number filter; correct discount presentation so discounts appear as two line items (prorated and month-in-advance) shown against the charge they apply to.
- Constraints noted: Excel has a one-million line item limit requiring aggregation with CSV fallback; a 400k-line threshold is driven by email delivery size limits.
- Actions closed: share revised templates and ordering logic; document billing rules in writing; treat Bulk SMS as a service under a unified template; hold a further session.

## Cross-references
- Follows "Business Process - Day12 - Session 1" recordings A and B (enterprise knowledge base walkthrough and backlog grooming), both in this batch.
- Part of the same workshop series as Day 9, Day 10, Day 11 files in this batch. Invoice redesign topic connects to billing/SOA discussion in the Day 10 Session 1 file.

## Extraction notes
None — extraction via pandoc yielded 89,651 characters, confidence high. No speaker diarization available.

---
slug: vfq-stack-modernization-br-28jun-75f28727
source: /Users/parithimalsaravanan/claude-projects/vfq/data/VFQ_Stack Modernization_ BR_28Jun.pptx
sha256: de5dadb3b5c7a44e46f9bc35f04910cc6885b62c4f21cf9eaaa09bf20b48d071
indexed: 2026-08-20
confidence: medium
---

# VFQ Stack Modernization — Business Requirements Workshop, Day 2 (28 June 2026)

**Type:** deck (business requirements workshop deck)
**Owner / author:** not stated (branded "BSS/OSS IT Stack Modernization Partnership")
**Date:** 28 June 2026 (stated on slide 1, "Day 2" of the workshop session)

## Purpose
Day 2 deck of the "BSS/OSS IT Stack Modernization Partnership" business requirement discussion workshop, covering the J011 Mobile Post-Paid Customer onboarding journey (a repeat/continuation of Day 1's flow), a new J017 Customer 360 capability discussion, and a set of Customer 360 UI section slides.

## Key content
- **11 slides total.** Slide 1: title slide — "BSS/OSS IT Stack Modernization Partnership, Workshop Session: Business Requirement Discussions (Day 2)", dated "28thth June 2026" (sic, extraction artifact of "28th").
- **Slide 2 — "J011: Mobile Post-Paid Customer onboarding Journey"**: a process-flow diagram with the same actors (Customer in QNomy, Agent in DXP) and largely the same flow content as the Day 1 (25Jun) deck's J011 slide — QTicket generation, ID type branching (QID → MOI Validation; Other ID/Passport → capture/validate details), contact/address capture, cart browsing (base plan, add-on, number, device), plan display logic tied to ID type, bill profile capture, SIM/MSISDN addition, number type branch (Normal vs Star Number), add-on branch (Non-Telco vs Telco Add-On), payment branch (Full Payment vs DOI), CAF generation/checkout/submission, CAF sign-off, payment capture via WinCash with receipt, ID scan, Unica Campaign reference, SIM handover options (eSIM, Physical SIM handover/deliver). This appears to be a near-duplicate re-presentation of the J011 flow from the 25Jun deck rather than a materially new version — no "changes since Day 1" markers or version labels are present in the extracted text to confirm what, if anything, changed.
- **Slide 3 — "J017 - Customer 360 (only topics needs to be provided)"**: new journey introduced (not present in the 25Jun deck's extracted content). Actors: Customer, Agent in DXP. Flow: query to Assisted Care Agent, search for customer by Customer No / Contact No / MSISDN, aggregate customer data across: CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Fetch Ticket History, Fetch Order History. Retrieval actions listed: retrieve bill information, retrieve CDR information, retrieve network status, retrieve customer and order details, retrieve payment and billing details, capture all search criteria.
- **Slides 4-5** — no extractable text (blank or image/diagram-only).
- **Slides 6-11** — a sequence of Customer 360 section title slides: "1. Overview", "2. Order", "3. Trouble Tickets", "4. Installed Assets", "5. Billing Profile", "6. Credit Risk". These appear to be section dividers/screens for the Customer 360 UI walkthrough tied to the J017 journey on slide 3; no body content or field-level detail was extracted for these sections.

## Cross-references
- Continues from the prior day's deck (vfq-stack-modernization-br-25jun-03c2aa09, "VFQ_Stack Modernization_ BR_25Jun.pptx"): the J011 journey on slide 2 substantially repeats the J011 content that appeared in Day 1's slide 4, suggesting this deck re-presents/reiterates rather than materially revises the flow (no explicit diff or "changes since" content found in extracted text to confirm).
- Introduces J017 Customer 360, which is picked up again (with an "UpdateV1.0" label) in the following day's deck, vfq-stack-modernization-br-29jun-updatev1-0-af309fe2 ("VFQ_Stack Modernization_ BR_29Jun_UpdateV1.0.pptx") — though that deck's extracted text does not itself contain Customer 360 content; the naming suggests it is a workshop-series update to this material.
- The Customer 360 section titles (Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk) likely relate to the "Customer 360" descriptions found in prior-batch documents (not verified in this batch).

## Extraction notes
Confidence set to medium: total extracted text is thin (2,085 characters across 11 slides), with slides 4 and 5 yielding no text at all and slides 6-11 yielding only section titles with no body content. The process-flow diagram on slide 2 was extracted as flattened text (shape/connector structure lost), and the Customer 360 slides (6-11) are diagram/UI-mockup-heavy — their substantive content (fields, layouts, data shown) is not captured. No internal version marker (e.g. "v1.0", "changes since Day 1") appears in the extracted text, so the relationship to the 25Jun deck is inferred from content similarity only, not stated explicitly in the document.

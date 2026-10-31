---
slug: it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d
source: /Users/parithimalsaravanan/claude-projects/vfq/data/IT stack modernization  Existing processes  Giga-26 (23rd floor)-20260629_093816-Meeting Recording.docx
sha256: 2db92c1c4529fd9d438a24d2a3ae88667bda855bd73e6c571112935442fb05f7
indexed: 2026-08-20
confidence: high
---

# IT Stack Modernization — Existing Processes (Day 17, 29 Jun 2026)

**Type:** meeting notes (AI-generated transcript-derived summary of a recorded workshop)
**Owner / author:** Vodafone Qatar / Wipro CRM & IT Stack Modernisation programme; owners named in action items include "Priyanshu" (SharePoint access); transcribed via OpenAI Whisper "medium" locally
**Date:** Recording date 2026-06-29 09:38 (Day 17 of the workshop series, at the "Giga-26, 23rd floor" venue); document created 17 August 2026

## Purpose
Walks the vendor team through the as-is activation landscape across channels and systems (Open UI desktop/tablet, Vanilla, ECR, VSA, MCCR) and roughly twenty business functions, then demonstrates the new mobile postpaid, MNP, and fixed/fibre guided journeys end to end, to baseline requirements for the modernised stack.

## Key content
- **Channels/systems**: Assisted (stores, direct sales, offshore retailers, telesales) vs unassisted (web/app self-service). Open UI = direct provisioning for PostPay, Fibre, FWA 5G. ECR = real-time prepaid (paired SIM) + offline digital signup capture. MCCR = tablet app for bulk pair prepaid when CRM is down, syncs later. VSA (also called BSA/PSA) = direct prepaid/postpaid provisioning, used by offshore retailers.
- **Decisions**: ECR will be decommissioned and not integrated with the new stack (00:04:42); MCCR capabilities will be absorbed into the new stack (00:05:03); VSA/BSA is explicitly out of scope for this programme — any CAF changes needed there are made by VSA's own team (01:49:59); consumer will be completed before enterprise (01:53:53); today's second half session was cancelled and tomorrow's second half dedicated to tickets (01:55:56, 01:57:35); design will be business-driven this time, unlike the previous technology-driven Open UI build (01:09:29).
- **Roles/functions walked through**: customer care, telesales & retention, complaints (mobile/fixed), direct sales, mass market, mini store, retail & franchise, fixed fulfilment, consumer/enterprise mobile fulfilment, MNP/FNP, white label fulfilment, billing, collections, customer data management (CDM). Tablet orders (mostly partners) require channel-manager approval before submission (00:12:37); a partner sees only its own orders/leads.
- **Guided journey demoed**: New mobile postpaid — ID scan (barcode, no OCR today), connections/plans-offered check, customer info auto-populated from MOI (greyed out), address, SIM serial, plan, add-ons, discount, star/free/reserved number, CAF signature, attachments, submit. Guided journeys were introduced because agents averaged ~15 minutes per order in Vanilla relying on memory, missing CAF/ID attachments (00:38:46).
- **MNP switch journey**: QID first, payment before donor submission, plan selection, donor details (number, ID type/number registered with donor), donor attachment, pre-populated MNP form, two signatures (legal requirement per review team, 01:27:37), and a mandatory customer SMS to a clearinghouse shortcode to confirm porting (charged QR 1; no SMS sent on rejection).
- **Fixed/fibre journey**: starts with Karama ID (KID) — Zone/Street/Building lookup if unknown — then address confirmation, QID eligibility/blacklist check, plan + discount, IPTV/TV (defaulted to yes, triple play), number, appointment slot (sent to installation partner), CAF, submission. Fiber instant vs non-instant activation is a back-end box-type check, not customer choice (02:04:47).
- **Key business rules**: postpaid requires QID; prepaid accepts passport/GCC ID/QID (no driving licence); max two postpaid mobiles per expat QID by business rule though technically five allowed (00:46:11); star number carries 1-year plan commitment vs 3-month for free number, up to 2-year lock-in for a 20,000 QAR star number on VIP plan; CAF/attachment size limit ~4MB (01:47:35); signed CAF must not be editable after signing (01:47:31); IPTV only via OSN/fixed and always defaulted on; port-in happens next working day in a defined window (typically 11am-12pm), port-out requires zero overdue/outstanding and cleared device instalments.
- **Requirements raised**: enhance ID scan with OCR/capture-in-one-shot; present a key-terms summary before CAF signature (lock-ins, penalties, fencing); document categories for attachments (CAF, QID) with online-only warm-archive retention (no cold archive, nothing removed); make journeys scrollable with fewer clicks, default/skip irrelevant steps, land agent on summary; digitalise remaining manual forms (star number, transfer of number, FNP, disconnection, temporary MBB, home/FWA supplementary T&Cs); add a notification/template inventory section (missing from the Excel).
- **Risks**: fraud in partner/channel-partner sales (drives tablet order approval); agents can attach anything as ID today with no detection; disputes over undisclosed star-number/port-out penalties; adding supplementary T&C pages risks exceeding CAF/PDF size limits; a wrong KID entered upfront is only caught by the field agent at the appointment stage.
- **Action items**: VFQ to share roles/journeys Excel and supporting documents; vendor to cluster topics for SME scheduling a day ahead; add roles-table column for high-level process per role and QBC channel; check if one signature can legally cover both CAF and MNP form; resolve SharePoint access (Priyanshu); add notification section to the Excel; provide enterprise services list and ticket types.
- **Open questions**: is offshore partner fulfilment always SFTP-manual or does VSA integrate directly; what does QBC channel do; is enterprise quotation really on MS Dynamics (conflicting information, 01:53:53); how will KID-based address be made user-friendly.

## Cross-references
- Companion Day 22 transcript in this batch ("IT Stack modernization Overview of RFSVodafone IDIMS Systems") covers the RFS Portal/IMS/Vodafone ID systems referenced here for the fixed/fibre journey (KID lookup, RFS portal).
- Directly informs VFQ_Fibre_BRSD_v1.2.xlsx and VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx in this batch, which formalise many of the same journeys (KYC, CAF, number selection, RFS/appointment) into atomic testable requirements.
- Relates to "Open UI Desktop (Agent 360 & CTI View).docx" in this batch (largely un-extractable screenshots of the same Open UI referenced here).

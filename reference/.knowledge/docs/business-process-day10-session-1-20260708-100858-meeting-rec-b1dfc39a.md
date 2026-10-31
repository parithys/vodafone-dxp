---
slug: business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Business Process - Day10 - Session 1-20260708_100858-Meeting Recording.docx
sha256: ee33bae972a31479f0a5999510ef6a594b9b42869b0b62898bb9d151a6410cd4
indexed: 2026-08-20
confidence: high
---

# Business Process Review — Day 10, Session 1 (Billing)

**Type:** meeting notes (transcribed workshop recording with structured analysis)
**Owner / author:** not stated (vendor-produced transcript/analysis of a Vodafone Qatar workshop; document itself created 17 August 2026)
**Date:** Recording date 08-07-2026 10:08 (per document metadata table); duration 142 minutes

## Purpose
Transcript and structured summary of a CRM & IT stack modernisation workshop session focused on billing: billing profiles, adjustments, Statement of Account (SOA), bill display/UI, commitments/penalties, hot bill vs. bill simulation, and fixed-line two-phase billing issues.

## Key content
- Billing profile is the driver for billing, barring and payment posting but has no unchangeable common correlation ID between CRM and BRM (unlike account number/service); agents can freely rename it, causing divergence. Decision: keep the name renameable but add an unchangeable identifier (BRM row ID + unique CRM identifier) to correlate the two systems.
- Collections requested a billing profile flag for billing-in-advance (PIA) / arrears / hybrid.
- Adjustments: individual adjustments go through ticketing + DOA (delegation of authority) hierarchy; bulk adjustments go through a PowerApps portal with offline approval and manual Excel handling. Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter.
- Adjustment reason is lost after 6 months due to BRM's "6 plus 1" event purge policy — item data remains but the reason is purged.
- Decision: mixed CRM-BRM content will be served from DXP with no source-system tabs; only IT operations retains vanilla Siebel/BRM access. Source of truth for adjustments left open.
- SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations); currently sent manually via SR in Excel. Automation and a standard consumer + enterprise format required. The from-inception requirement is blocking BRM's purge policy and degrading performance.
- Bill display: requested summarised bill landing view (MRC, VAS, VAT), search inside bill for enterprise, unified usage view — constrained by whether BRM exposes needed APIs.
- Commitments/penalties: value is not stored anywhere; agents cannot quote a disconnection penalty without creating an order. ~50% of disconnection contacts are inquiries only. Decision: trigger the calculation from specific guided journeys (disconnection, MNP port-out, plan upgrade/downgrade, park number, put off) or an on-demand button, not on every view, due to performance impact.
- Hot bill (current unbilled + outstanding, does not change item status) is distinct from the newly-named "bill simulation" (shows disconnection implications/penalties without disrupting the upcoming bill; explicitly not a tax invoice; must state so on its face, since two invoices cannot be generated for the same charges).
- Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced.
- Fixed line two-phase billing: OSM auto-completes/purges orders older than ~12 months; order completion depends on PM confirmation; CDRs flow to BRM but bill formatter only shows active services; back-dated order completion caused a documented dispute (bill issued 16 June covering April–July for a service activated 1 June). Decision: create account/service at the correct activation date and escalate to the fulfilment session/PMs; revenue projection and 24-hour tax reporting requirements make back-dating non-compliant.
- Volumetric commitments/discounts: full-cycle discount cancellation setting causes overlapping discounts on mid-cycle changes, needs proration; behaviour must differ for plan change vs. cancellation, and for enterprise vs. consumer.
- Audit trail requirement raised: capture who changed the billing profile name and the billing document recipient email (a fraud scenario was flagged where a user changes the invoice email, redirects it, then reverts with no record).
- Named stakeholders/personas referenced: Chandan (raised multiple-email requirement), Vijay Gaurav (SPOC for bill format), Rajesh, Vikas (fixed line open-order explanation), Khalid (revenue projection owner).

## Cross-references
- References the prior "onboarding" session's verified-email discussion (not in this batch).
- Notes that discount architecture/bill format will be taken up in a separate technical session, and discount itself explained in a separate "product session" (not in this batch).
- Continuation of the same workshop series as Day 9, Day 11, Day 12 files in this batch.

## Extraction notes
None — extraction via pandoc yielded 89,783 characters, confidence high. Note: transcript has no speaker diarization ("Speaker Separation NOT AVAILABLE"), so individual quotes are not attributed to named speakers except where a name is explicitly mentioned in the discussion text.

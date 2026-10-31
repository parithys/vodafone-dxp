---
slug: it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0
source: /Users/parithimalsaravanan/claude-projects/vfq/data/IT Stack modernization Overview of RFSVodafone IDIMS Systems-20260706_130401-Meeting Recording.docx
sha256: ada617c1478940cbcc50703c6a62238db7587c4d1a5a0c1bbcad5f2a3b1047ce
indexed: 2026-08-20
confidence: high
---

# IT Stack Modernization — Overview of RFS/Vodafone ID/IMS Systems (Day 22, 06 Jul 2026)

**Type:** meeting notes (AI-generated transcript-derived summary of a recorded workshop)
**Owner / author:** Vodafone Qatar / Wipro CRM & IT Stack Modernisation programme; presenter identified as "Samant" (also "Mahmood" as action owner in the closing summary block); transcribed via OpenAI Whisper "medium" locally
**Date:** Recording date 2026-07-06 13:04 (Day 22 of the workshop series); document created 17 August 2026

## Purpose
Records a technical/business workshop walking the vendor team through three systems supporting Vodafone Qatar's fixed/fibre sales and provisioning stack: IMS (Inventory Management System), Vodafone ID (VFID), and the RFS (Ready For Sale) Portal — their data models, ownership, and data flows — to scope the CRM/IT stack modernisation integration boundary.

## Key content
- **IMS**: network-team-owned inventory (outside technology control), sourced from Qatar GIS; holds site/zone-street-building (ZSB) data, BIDs, CTPs (cable termination points, sub-sites), splitters/ports, and business-added consumer/enterprise potential/forecast. Physical chain: OLT → splitter → telecom room → each KID/unit.
- **KID (Kahramaa ID)**: Qatar electricity/water department's identifier per unit; became Vodafone's de facto unique key for fixed provisioning because Vodafone had no identifier of its own when the system was built. Villa partitions use dummy KIDs (first connection on real KID, subsequent on dummies) since each activation needs a unique KID.
- **Vodafone ID (VFID)**: newer, CEO-approved branded identifier — format "zone + four-digit BID + unit" (decision timestamp 00:47:58). Generated in advance by RPA, loaded into UIM, then mapped to KIDs by a field survey team; normally one-to-one, but many-KIDs-to-one-VFID and one-VFID-to-many-KIDs are supported corner cases handled manually by sales plus fulfillment.
- **Data flow**: IMS → GTM (go-to-market) full-dump building file → picked up by RPA (Microsoft automation) via mediation → translated/filtered → distributed to UIM (full dump + separate VFID file), Siebel (delta file, for lead management), RFS Portal, EDW, and OneDrive (for business). GTM frequency is uncertain in production — designed fortnightly, believed now daily/bi-weekly — flagged as an action to confirm.
- **RFS Portal**: sales-facing app; search by ZSB address, Karama ID, or area; shows RFS status, potentials, SLA/cluster (renamed from 1-4 to F1-F4); top-level data from IMS via GTM file, live active-service/KID status from UIM with reverse sync back to IMS. Plan/offer recommendations come from a separate Big Data deep-learning file filtered by ZSB, steering sales toward FWA/5G where fibre isn't yet connected. Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it.
- **Scope decision** (00:24:46): GIS→IMS is business/strategy-owned and excluded; modernisation scope starts at the GTM file export from IMS.
- **Decisions**: automate GIS→IMS loading (already done); build fixed-service provisioning on KID as unique key (historical); support many-to-many KID/VFID mapping after exploring retail/enterprise cases; introduce dummy KIDs for villa partitions; drop displaying all KIDs on the ZSB page in RFS Portal; change Siebel from full file to delta file to cut load; cluster naming changed 1-4 → F1-F4; VFID naming pattern CEO-approved; VFID mapping lives in UIM, not IMS; IMS-to-UIM is not directly system-integrated (goes via fulfillment files).
- **Action items** (owner Mahmood per closing summary): (1) verify and share current production frequency of GTM extraction/loading into UIM, RFS Portal and other downstream systems; (2) provide file structure/sample details for IMS→RPA and RPA→UIM/Siebel; (3) clarify current operational frequency for UIM/RFS data refresh. Additional inline actions: check "distance to CO" field meaning (Samant).
- **Open questions**: does GIS have live sync into IMS; what's the actual Siebel upload frequency/path; does a new building take at least a fortnight to reach agents; does Siebel get full file as well as delta; is area-based RFS search widely used.
- **Risks**: IT has no exposure/visibility into IMS detail or update frequency; complex compound cases (e.g. "Adhan 27") with one GTM building entry mapping to many BIDs/CTPs/KIDs; manual extracts/hot loads from strategy team create unpredictable data timing; multiple-VFID-to-one-KID corner cases handled manually (error-prone); fibre unavailability areas force fallback to FWA/5G sales.

## Cross-references
- Companion Day 17 transcript in this batch ("IT stack modernization Existing processes Giga-26 (23rd floor)") covers the Open UI/guided-journey side of activation and references the RFS portal, Karama ID and fixed/fibre journey that this document explains in depth.
- Related to VFQ_Fibre_BRSD_v1.2.xlsx in this batch, which formalises RFS/IMS/UIM data flows into CAP-14 (Installation Address and Service Feasibility) and CAP-23 (RFS Data Management) requirements, and Open Item OI-11/OI-12 which mirror the open questions about GTM frequency and VFID/KID mapping raised in this meeting.

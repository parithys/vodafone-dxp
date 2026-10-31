---
slug: sms-templates-0603d3eb
source: /Users/parithimalsaravanan/claude-projects/vfq/data/SMS Templates.xlsx
sha256: 281abd87d29c0b5d74009cfb8485f384515aa6a26664df0ad0e56bb2a77c9734
indexed: 2026-08-20
confidence: high
---

# SMS Templates

**Type:** data extract (Siebel/CRM SMS template catalogue, multilingual)
**Owner / author:** not stated (system export; "Created By"/"Updated By" columns show generic "User ID" for all rows, not named individuals)
**Date:** not stated as a document date; individual template rows carry Created/Updated timestamps ranging from 2021-06-21 up to 2026-04-15, indicating this is a live, continuously maintained export

## Purpose
A near-complete export of every automatic, lead-related, ad hoc/other, and manual SMS template configured in the current CRM, in up to four languages (English, Arabic, Hindi, Malayalam) — the authoritative reference for existing customer-communication content and the trigger/category taxonomy behind it, relevant to preserving or redesigning notification behaviour in the modernised stack.

## Key content
- **Four sheets**: "Automatic SMS Templates" (12 rows) — system/customer-triggered templates keyed by Keyword, with TT (Trouble Ticket) Source/Category/Area/Sub Area/Status fields, e.g. `Automatic TON SMS`, `Disconnection`, `Migration to Prepay`, `Plan Downgrade`, `Refund Request`, `Retention`, `DEFAULT TT SMS TEMPLATE` (and its `_ReOpen` variant). Columns: Keyword | TT Source | TT Category | TT Area | TT Sub Area | TT Status | Do not send SMS | Language | Status | Created/Updated Date/By | Description | Language Code | Locale | System Template Flag | Script.
- **"Lead Automated SMS Templates"** (10 rows) — FrontLine callback confirmations per lead service type: FNP, Home, MNP, "Plan upgrades", Postpaid, "Pre to Post", Prepaid, plus a "Downgrade Unreachable" outreach template. All English-only in the sampled rows. Columns: Service Needed | Language | Keyword | Status | Template Type | Created/Updated Date/By | Description | Language Code | Locale | System Template Flag | Script.
- **"Other Automated SMS Templates"** (23 rows) — plan/add-on billing-calculation notifications (`PLAN CALC TEMPLATE_ADDON`, `_PLAN`, `_PLAN_ADDON`, `_PLAN_ADDON_DISCOUNT`, `_PLAN_DISCOUNT`), each present in English, Arabic, Hindi and Malayalam variants, using merge fields like `$BillCycle$`, `$proratedamount$`, `$advancerental$`, `$firstbill$`, `$sDiscountper$`/`$sDiscountQR$`.
- **"Manual SMS Templates"** (1,236 rows — by far the largest sheet) — agent-triggered FrontLine templates keyed by Keyword + Service Type (Prepaid/Postpaid/etc.) + Language, covering a very wide range of topics (e.g., `Chatbot`, `Combo 40`) in English, Hindi, Malayalam (and others). Same column structure as Automatic sheet minus the TT fields, plus Service Type.
- All templates carry both an English and Arabic script in a single row where bilingual (`<br>`-separated HTML with RTL Arabic text), reference merge fields like `[Service Request.SR Number]`, `[Service Request.Serial Number]`, and standard footer patterns (My Vodafone App deep links, call centre number 40051126, hours 9AM-10PM).
- System Template Flag ("Y") distinguishes protected/system-owned templates from editable ones; Locale/Language Code columns (ENU, ARA, HIN, MAL) drive language selection.

## Cross-references
- Directly relevant to the notification/communication-template gaps flagged in this batch's "IT stack modernization Existing processes Giga-26" meeting transcript (requirement: "Add a notification section covering when notifications are sent and what is sent, static and dynamic" — action item 02:13:24) and to CAP-13 "Notification and Feedback" in both VFQ_Fibre_BRSD_v1.2.xlsx and VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx, which govern order-submission/failure/completion notification requirements this template catalogue would fulfil.
- Complements TT Hashtags and Actual Issue.xlsx in this batch (both reference "TT" — trouble ticket — categorisation used for the Automatic SMS Templates sheet's TT Category/Area/Sub Area columns).

# Channel Architecture (Phase 5)

Evidenced primarily by three sources: (1) the Consumer Activation Process & Procedure manual v8.0, which explicitly enumerates channels and their backing systems; (2) the master CRM Journey catalog's Guided-journey-Desktop / Guided-journey-Tablet / Desktop-vanilla / CBU / EBU columns (165 rows); (3) the guided-journey document filenames themselves, which separate Desktop (Open UI), Tablet, and Desktop Vanilla/Manual variants of the same journey.

---

## 1. Channel taxonomy (Explicit — `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`)

The as-is Consumer Activation SOP names these channel/system combinations directly:

| Product | Onshore/Offshore | Channel | Backing system(s) |
|---|---|---|---|
| Prepaid | Onshore | Direct Sales | ECR & Open UI |
| Prepaid | Onshore | Mass Market | ECR & VSA |
| Prepaid | Onshore | Retail | ECR / Open UI Desktop |
| Prepaid | Offshore | Qatar Visa Center (QVC) | Integrated System |
| Prepaid | Offshore | Offshore Airport | SFTP, VSA (3rd-party manual activation) |
| Postpaid | Onshore | Direct Sales | ECR & Open UI |
| Postpaid | Onshore | Retail | ECR |
| Postpaid | Offshore | Offshore Airport | VSA |

**Explicit modernization note** (`vodafone-process-overview-290626-ec-1ed338b9`, slide 2-4): "ECR for selling prepaid is being phased out and VSA moving forward will be used by Stores and direct sales to sell prepaid (Paired SIMs)" — i.e. the ECR channel is a deliberately sunsetting system, not a target for the new DXP.

---

## 2. Device/Form-factor channels (Explicit — derived from guided-journey source filenames)

Every guided-journey source document is itself channel-labeled (e.g. "Open UI Desktop_Fixed Line_Triple Play" vs. "Open UI Tablet_Fixed Line_..." vs. "Desktop Vanilla_New Postpaid") — giving a reliable per-screen and per-journey channel tag:

| Channel | Screens evidencing it | Journeys evidencing it |
|---|---|---|
| Desktop (Open UI) | 95 | 13 |
| Tablet | 65 | 25 |
| Desktop (Vanilla/Manual) | 32 | 8 |
| Digital Self-Service | 0 | 1 |

- **Desktop (Open UI)** — the primary agent-assisted retail/back-office channel; richest screen coverage.
- **Tablet** — a parallel guided-journey channel for the same core journeys (New Postpaid/Prepaid/Fixed Line/FWA/MNP), evidenced as a near-complete mirror of the Desktop Open UI channel rather than a reduced/mobile-only subset.
- **Desktop (Vanilla/Manual)** — the underlying raw Siebel screens agents fall back to when the guided-journey wizard doesn't cover a scenario (e.g. `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de` demonstrates a Bill Limit validation error using the vanilla path).
- **Digital Self-Service** — evidenced by exactly one document (`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`, a 17-slide self-service digital fiber activation deck) — a customer-direct channel (no agent), architecturally distinct from the two agent-assisted channels above. Low coverage in this corpus relative to its likely real-world scope; flagged as a probable extraction/corpus gap, not evidence that this channel is minor.

---

## 3. Business segment channels: CBU vs. EBU (Explicit — CRM Journey catalog)

Of the master catalog's 165 journey/feature rows: **143 apply to CBU** (Consumer Business Unit) and **127 apply to EBU** (Enterprise Business Unit), with **105 applying to both** — most catalogued capabilities are shared across both segments rather than being CBU-only or EBU-only, though Enterprise-specific journeys (parent/sub-account hierarchy, choosers/authorised persons, IoT/M2M/DAPN/PTT, volumetric discounts) are a distinct evidenced sub-channel — see the `Enterprise / IoT / B2B` module in `module-hierarchy.md`.

---

## 4. Field / Back-office channel (Explicit — guided journeys + workshops)

- **Field Technician / WFM (Workforce Management)** — Oracle Field Service Cloud handles on-site installation for Fixed Line/FWA Outdoor journeys after order creation (e.g. `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`). This is architecturally a *different* channel from the retail sales channels above — a technician-facing mobile/field app, not evidenced in this corpus beyond its handoff point (appointment booking → WFM ticket).
- **Back-office Fulfilment** — evidenced distinctly from front-line Retail in `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479` (a dedicated back-office agent walkthrough, same Desktop Open UI system but a different persona/queue).
- **Customer-facing channels referenced but not evidenced in UI detail**: My Vodafone (MVA) app and a customer-facing chatbot are referenced in `notification-catalogue.md`'s SMS templates (deep-links to `mva.qa/...`) as destinations customers are directed to for self-service, but no screens from these channels appear in this corpus's guided-journey material — flagged as a gap: this corpus documents the *agent-facing* DXP almost exclusively, not the customer-facing MVA app.

---

## 5. Channel Architecture summary table

| Channel | Type | Persona(s) | Status for new DXP |
|---|---|---|---|
| Open UI Desktop | Agent-assisted, browser | Retail/Sales Agent, Back-office Fulfilment | Primary target — richest evidence |
| Open UI Tablet | Agent-assisted, tablet | Retail/Sales Agent (field/in-store) | Primary target — near-parity evidence with Desktop |
| Desktop Vanilla (manual Siebel) | Agent-assisted, browser, unguided | Retail/Sales Agent, Admin | Fallback/edge-case only — the guided channels above should cover the target-state golden path |
| Digital Self-Service | Customer-direct, web | Consumer | Thin evidence (1 document) — treat as a known gap, not "out of scope" |
| ECR | Agent-assisted, legacy | Direct Sales, Mass Market | **Being phased out** (explicit) — do not build for the new DXP |
| VSA | Agent-assisted, legacy→future prepaid | Retail, Mass Market, Offshore | Explicitly the *replacement* for ECR on prepaid — verify current status with business owner before excluding |
| Field/WFM (Oracle Field Service) | Technician-facing, mobile | Field Technician | Out of this corpus's UI-evidence scope — only the handoff point (appointment → WFM ticket) is evidenced |
| My Vodafone (MVA) app / chatbot | Customer-direct | Consumer | Referenced as an SMS deep-link destination only — no screens evidenced |

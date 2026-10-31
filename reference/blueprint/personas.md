# Persona Catalogue (Phase 4)

> ## ⚠ SUPERSEDED AT RUNTIME — 2026-09-24
>
> These 66 personas no longer drive the application. It runs on **26
> operational roles** (`public/config/personas.json`), each with its own Staff
> ID, approach classification and explicit feature grants.
>
> | Looking for | Go to |
> |---|---|
> | The current roles | `reference/Persona_Feature_Applicability_Matrix_Reference.xlsx` (the SSOT) |
> | 66 → 26 mapping | that workbook → **Legacy Crosswalk**. 17 personas below have no operational counterpart and are archive-only |
> | The archived records | `reference/blueprint/legacy/personas-66-evidence.json`, plus `personas-66-descriptions.json` for the two columns that existed only in `VFQ_DXP_Personas_Reference.xlsx` |
>
> Still the authoritative record of **what the source corpus evidenced**, and
> the reason each legacy id exists — the citations here are what
> `rbac-matrix.md` and the workbook's evidence panel join back to. It is no
> longer a description of the running system.
>
> Note that several entries below are named workshop participants
> (PERSONA-031 Rana, 032 Marishi, 033 Giri, 035 Anwar, 036 Ali) or bundles of
> many roles in one record (053, 062) rather than operational roles — an
> artefact of distilling the catalogue from transcripts, and part of why the
> 26-role model replaced it.

Roles/actors evidenced across workshops, guided journeys, and BRSDs. Screen/journey/action lists reflect only what each source document actually demonstrates for that persona — absence of a field means the corpus does not evidence it, not that the persona lacks it.

**Canonical items:** 66 (deduplicated from 115 raw extracted mentions across the 83-document corpus)

**Confidence:** high 56 · medium 10 · low 0
**Classification:** Explicit 64 · Inferred 2 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## PERSONA-001: Retail/Sales Agent (Frontline/Cross-Sell/Front-Office)
`Explicit` · confidence: `high`

- **Type:** Front-line sales/retail
- **Responsibilities:** Closes enterprise and consumer deals; forwards documents and order form to fulfilment; raises orders; executes retail SIM swap, TON, plan change, DOI transactions; scans QID; performs Kahramaa ID lookup; looks up existing customer by QID and presents/accepts pre-targeted campaign offers on Cross Sales, driving customer into New Fixed Line wizard (Contact, Address, Plan, Addon & Discount, Number Selection, Book Appointment, CAF, Activity); executes New Fixed Line/FWA/Postpaid/Prepaid guided wizards across desktop and tablet channels (contact/address/plan/number selection, book appointment, CAF signature capture, activity comments); builds Sales Orders, selects catalog products, customizes bundle line items (e.g. Bill Limit within Agent Minimum threshold); edits Credit Limit via preset dropdown; generates CAF (Digital/Manual/Touch Screen); performs SIM Serial entry; runs MNP guided process (contact/address/billing/SIM/plan details, edits Smart Limit within Agent Min Value guardrail); can trigger Instant or Normal Activation on device-detection prompt; performs order correction after manager rejection
- **Permissions:** Can rename billing profile name (causing CRM/BRM divergence today); can edit Smart Limit/Bill Limit down to but not below Agent Minimum Value without System Administrator override; no agent discretion on plan/add-ons/discounts on cross-sell-originated order; cannot manually enter ID details (only re-scan/search); cannot enroll/cancel AutoPay or see card details; Retail cannot change primary contact
- **Accessible journeys:** Enterprise Sales-to-Fulfilment Handover, MNP Port-In, Cross Sales module, New Fixed Line (desktop/tablet), New FWA (Indoor/Outdoor), New Postpaid, New Prepaid, Pre2Post, SIM Swap, MNP Postpaid/Prepaid, Lead Creation, Passport to QID
- **Accessible screens:** Home page tile grid, Cross Sales QID entry, QID Offers grid, New Fixed Line/FWA/Postpaid wizard steps, Order confirmation, CAF preview/signature pad, My Sales Orders, Order Correction journey, Product Promotions area (view), Guided Process wizard steps, Plan detail modal, Donor Details, MNP/CAF forms
- **Accessible actions:** Accept campaign offer, reserve number, book appointment, attach CAF, submit order/save-and-finish, set Do Not Disturb on contact who refused service, upload ID photos, capture signature, resubmit rejected orders, add products to catalog cart, customize complex product configuration, validate order, reserve numbers, sign contract, verify device serial, ZSP entry, scan SIM/CPE for FWA
- **Restricted / not permitted:** Cannot re-enter/change QID once carried over from Cross Sales (read-only); cannot select a plan on cross-sell order (auto-applied); no editable add-on/discount control on cross-sell order; cannot manually enter ID details (only re-scan); cannot enroll/cancel AutoPay or see card details; cannot manually enter KID, only search
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Enterprise sales-to-fulfilment handover: deal closed by account manager, forwarded by email/portal with documents and order form”
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Can rename billing profile name (causing CRM/BRM divergence today)”
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Retail requires approval + SIM swap form + ID attachment; agents cannot manually enter ID details, only re-scan”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “agent (not customer) verifies device serial; cannot manually enter KID, only search”
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “an agent looks up an existing customer by Qatari ID, accepts a pre-targeted campaign offer... and is redirected into the guided New Fixed Line activation journey”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent lands on the CRM home screen ("Welcome back HALEEMI HALEEMI!"...) and hovers/clicks the "New Fixed Line Tablet" tile”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “agent VINODHINIR performs the full guided-wizard flow through Save and Finish; per backend record, Created By VINODHINIR”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “combo box/CPE password is fetched from UIM (referenced context of retail/agent channel activity)”
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Logged in as KARTHIKK KARTHIKK, "Today is Tuesday, September 16, 2025." Agent clicks the New FWA tile.”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “agent 'Hemanth Kumar' ... Responsibility field set to 'VFQA Sales'”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Job Title 'Team Leader', Contact Team SADMIN (elevated agent, same duties)”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “VINODHINIR (Retail Agent) ... selected in Lead Owner picker”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Contact Team "SADMIN", Responsibility "VFQA Sales" ... Walks a VFQA Sales-responsibility agent through two linked activities”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Agent "KARTHIKK KARTHIKK" logged into the Open UI Desktop landing page... processing a New Postpaid activation for an existing customer”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Agent "VINODHINIR VINODHINIR" logs in ... Shows a Vodafone Qatar retail agent, using the Open UI Tablet guided journey, how to sell a New Postpaid line under the B2B2C model”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Administration–User "All Person Administration" view confirms operator Hemanth Kumar (User ID HEMANTH, Job Title Team Leader) is provisioned under Responsibility VFQA Sales”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Retailer ID: 112233 ... Created By: KARTHIKK”
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Channel: Retail Store and Field Agent, Assisted; use cases FIB-ACT-RTL-001 etc.”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Use case MOB_POST_ACT_RETL_001 'Customer Purchasing Postpaid Mobile plan through Retail Agent.' Channel: Retail Store, Assisted.”
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Roles/functions walked through: customer care, telesales & retention, complaints (mobile/fixed), direct sales, mass market, mini store, retail & franchise, fixed fulfilment, consumer/enterprise mobile fulfilment, MNP/FNP, white label fulfilment, billing, collections, customer data management (CDM)”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Prepaid Onshore channels: Direct Sales (ECR & Open UI)...Postpaid Onshore channels: Direct Sales (ECR & Open UI)”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Prepaid Onshore channels: ... Mass Market (ECR & VSA)”

## PERSONA-002: Account Manager
`Explicit` · confidence: `medium`

- **Type:** Enterprise sales/relationship
- **Responsibilities:** Closes enterprise deals; approves discounts via EBU hierarchy in MS Dynamics; is the sole recipient of chooser communications; handles fixed and mobility account management; approves account affiliation forms
- **Permissions:** Approval authority in EBU discount hierarchy; account affiliation approval grants sub-account privileges/Web Self-Care access; does not have CRM access (served via 117 support channel instead)
- **Accessible journeys:** Enterprise Sales-to-Fulfilment Handover, Enterprise Mobility Lead-to-Order, PTT Provisioning, Bulk SMS Onboarding, Enterprise Order Journey
- **Accessible actions:** Approve account affiliation forms
- **Restricted / not permitted:** Do not have CRM access, served via 117 support channel instead
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access”
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “a separate support channel (117) serving account managers and channel partners who do not have CRM access”

## PERSONA-003: Account Manager / Channel Partner (External enterprise)
`Explicit` · confidence: `medium`

- **Type:** Enterprise external
- **Responsibilities:** External account manager/channel partner served via 117 support channel
- **Restricted / not permitted:** Do not have CRM access, served via 117 support channel instead
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “a separate support channel (117) serving account managers and channel partners who do not have CRM access”

## PERSONA-004: Fulfilment Agent / Fulfilment Team
`Explicit` · confidence: `medium`

- **Type:** Back-office order processing
- **Responsibilities:** Validates and creates orders in Siebel (MNP/FNP/enterprise); selects plan, porting details, attachments; escalates back-dated order issues to PMs; fills ECR Details field (fulfilment-team-only); manually submits DOI Siebel order within 24 hours (disputed/unresolved whether still manual); handles WFM appointment scheduling/execution and manual KID/VFID mapping corner cases post order-submission
- **Permissions:** Order creation and validation
- **Accessible journeys:** MNP Port-In, FNP Port-In, Fixed Line Two-Phase Order Completion, Enterprise Account Creation, Bulk Activation, Bulk SMS Onboarding, New Fixed Line
- **Accessible screens:** Siebel order creation screen
- **Accessible actions:** Create order, select MNP category/porting details, attach documents, enter ECR Details
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details”
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “disagreement between participants on whether the DOI Siebel order submission is automated or still manually submitted by the fulfillment team within 24 hours”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Enter ECR Details = No (banner: "To be filled by Fulfillment team only.")”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Enter ECR Details = No, with note "To be filled by Fulfillment team only."”
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Sales plus fulfillment handle many-KIDs-to-one-VFID mapping corner cases manually; WFM appointment/execution capability CAP-15 in fibre BRSD scope for order fulfilment”
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “many-KIDs-to-one-VFID and one-VFID-to-many-KIDs are supported corner cases handled manually by sales plus fulfillment”

## PERSONA-005: Back Office Fulfilment Agent (Siebel Responsibility)
`Explicit` · confidence: `high`

- **Type:** Back-office agent responsibility/role in Siebel
- **Responsibilities:** Logs into Siebel Open UI Desktop under 'Back Office Fulfilment' responsibility, launches New Fixed Line guided journey, completes Contact, Address, Plan, Addon & Discount, Number Selection, Book Appointment, and CAF steps, generates Sales Order and line items
- **Permissions:** Assigned Responsibility 'Back Office Fulfilment' plus 'VFQ Base 2' under Default Organization
- **Accessible screens:** Siebel Web Call Center Home page tile grid (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Action Required, Activities, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval), New Fixed Line wizard, Account Orders (Account 360 View), Order detail (Line Items)
- **Accessible actions:** ECR Details field marked 'To be filled by Fulfillment team only'; can reserve numbers, book appointments, submit CAF, submit order
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “record for Last Name "Kumar", First Name "Hemanth", User ID "HEMANTH", Responsibility "Back Office Fulfilment"”

## PERSONA-006: Credit Control / Collection & Credit Control
`Explicit` · confidence: `high`

- **Type:** Finance/risk function
- **Responsibilities:** Requested billing-in-advance/arrears/hybrid flag on billing profile; approves credit terms during enterprise onboarding; confirms outstanding-dues thresholds; credit control and collections approval on activation procedures
- **Accessible journeys:** Enterprise Mobility Lead-to-Order, New Fixed Line/Business Broadband Order, Mobile Postpaid Activation
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Collections requested a billing profile flag for billing-in-advance (PIA) / arrears / hybrid”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Vijay Sundaram (Collection & Credit Control Manager)”
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Dependencies D-01..D-08 include: ... Collections to confirm outstanding-dues thresholds (D-07)”

## PERSONA-007: Business Finance
`Explicit` · confidence: `high`

- **Type:** Finance approval authority
- **Responsibilities:** Approves credit limit for enterprise accounts since there is no default credit limit
- **Permissions:** Credit limit approval authority for enterprise
- **Accessible journeys:** Enterprise Account Creation
- **Accessible actions:** Approve credit limit
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “enterprise has no default credit limit and requires business finance approval”

## PERSONA-008: IT Operations
`Explicit` · confidence: `high`

- **Type:** Internal technical/system administration
- **Responsibilities:** Retains vanilla Siebel/BRM system access after DXP rollout, when mixed CRM-BRM content moves to DXP for other users
- **Permissions:** Direct Siebel/BRM access (source-system tabs) retained exclusively for this persona
- **Accessible screens:** Vanilla Siebel/BRM tabs
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: mixed CRM-BRM content will be served from DXP with no source-system tabs; only IT operations retains vanilla Siebel/BRM access”

## PERSONA-009: Chooser
`Explicit` · confidence: `high`

- **Type:** Enterprise customer-side authorised contact
- **Responsibilities:** Sole authorised requester on behalf of a company; nominated on the CR
- **Permissions:** Requests only accepted from chooser's registered email
- **Accessible journeys:** Account affiliation / privilege grant
- **Accessible actions:** Submit requests on behalf of the company
- **Restricted / not permitted:** No off-boarding process exists when a chooser leaves the company
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “company nominates authorised persons on the CR; one or more flagged as "chooser"; requests only accepted from the chooser's registered email”
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Contact roles noted: chooser, payment support, technical contact”

## PERSONA-010: Payment Support Contact
`Explicit` · confidence: `high`

- **Type:** Enterprise customer-side authorised contact
- **Responsibilities:** Handles payment-related matters for the enterprise account
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Contact roles noted: chooser, payment support, technical contact”

## PERSONA-011: Technical Contact
`Explicit` · confidence: `high`

- **Type:** Enterprise customer-side authorised contact
- **Responsibilities:** Handles technical matters for the enterprise account, including installation site point of contact
- **Accessible journeys:** Enterprise Order Journey
- **Restricted / not permitted:** Cannot be captured as a formal contact with ID today, only free text, causing appointment notifications to go to the wrong person
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “the installation site engineer/point of contact is only captured as a free-text comment because a contact cannot be created without an ID”

## PERSONA-012: EBU Operations
`Explicit` · confidence: `high`

- **Type:** Enterprise lead management function
- **Responsibilities:** Qualifies enterprise leads before assigning to an account manager
- **Accessible journeys:** Enterprise Mobility Lead-to-Order
- **Accessible actions:** Qualify leads
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “lead qualification by EBU operations; assignment to an account manager”

## PERSONA-013: EBU PM (Project Manager)
`Explicit` · confidence: `high`

- **Type:** Enterprise fulfilment/project management
- **Responsibilities:** Collects contract documents for DAPN and other enterprise services; central point in enterprise order/IoT flow
- **Accessible journeys:** Enterprise/IoT Order-to-Billing Flow, DAPN Activation, Enterprise Order Journey
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN”

## PERSONA-014: Business Care
`Explicit` · confidence: `high`

- **Type:** Enterprise customer support
- **Responsibilities:** Handles enterprise inquiries and post-activation support for 5G/FWA device faults or changes; frontline of enterprise customer care
- **Accessible journeys:** Enterprise Mobility Lead-to-Order (lead channel), 5G Indoor/Outdoor Activation (post-activation support chain)
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “post-activation support chain through business care, the CMT team, the vendor and the field partner for device faults/changes”
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “"business care" (frontline of enterprise customer care) and a separate support channel (117) serving account managers and channel partners who do not have CRM access”

## PERSONA-015: Customer (Consumer/Enterprise/B2B2C End User)
`Explicit` · confidence: `high`

- **Type:** End customer / subscriber
- **Responsibilities:** Signs subscription acceptance form and CAF/contracts; sends consent SMS for MNP (switch to 151); clears outstanding dues; requests Home Move/TON; pays final bill within 30 days post-port-in; provides identity documents/QID; reviews and signs CAF via signature pad; initiates MNP port-out via SMS to NPass; enters own parameters for self-serve instant activation (standard customers only); may be linked to sponsoring employer for B2B2C; requests service suspension/resume via Email, Phone, or Retail Counter [⚠ UNVERIFIED, see caveat below — conflicts with PERSONA-021]
- **Permissions:** Can view/edit/cancel FDO request before point of no return; must confirm MNP port via SMS
- **Accessible journeys:** GigaHome/OSNtv Subscription Acceptance and Lifecycle, MNP Port-In (consent), FNP Port-In (dues clearance), Post-Port-In Billing and Dunning, Self-serve instant activation, all onboarding/activation/conversion/swap journeys as subject, Mobile Service Suspension/Resume
- **Accessible screens:** e-signature capture pad (agent-mediated), Contact Portal, My Vodafone App
- **Accessible actions:** Sign form, send consent SMS, request Home Move/TON, make payments, sign CAF via signature pad, enter own parameters for self-serve activation
- **Restricted / not permitted:** Subject to disconnection/dunning ladder if unpaid; risk of suspension/blacklisting for offer abuse; non-standard customers cannot use self-serve, get a Lead instead
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature”
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP - initiates MNP port-out via SMS to NPass”
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “manual status update after payment for B2B2C”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Self-serve instant activation: fully automated, customer enters parameters directly; non-standard customers cannot use self-serve; get a Lead instead”
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Customer Name, Customer QID, Customer Signature, Date”
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Section 1 – Applicant details...Signature*”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Customer type 'Consumer ,SIPT', Name YAM POKHAREL; "Notify customer that a copy of the CAF will be sent to his registered email address"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Customer Signature captured (drawn signature present)... Appointment details will be sent to the customer via SMS.”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Applicant details table: Current service provider Ooredoo, Customer name Vishakan Soundararajan ... Applicant's signature field now shows a captured signature”
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “customer "HEMANTH GOVARDHANAN" (Account # 80772215054...) identified via Qatari ID”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “E-signature capture (image10.png) — "Please Sign" modal with a hand-drawn signature already captured on the signature pad”
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “customer 'Anuj Singh Yadav, Vodafone Contractors' — Account Type: Business, Customer Segment: Reimbursement”
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “Actors: Customer in QNomy, Agent in DXP - requests service suspension/resume via Email, Phone, or Retail Counter; signs off on CAF; makes payment” *(slug corrected 2026-08-23 — was previously mis-attributed to `vfq-stack-modernization-br-28jun-75f28727`, which contains no suspension/resume content at all)*
  - **⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** the suspension/resume-via-retail-channel claim above is sourced only to `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`, independently re-scored 50/100 (Medium-Low) in a separate Phase 1.5 pass, and it **conflicts** with PERSONA-021 (below), which is sourced from a High-confidence workshop transcript stating manual suspension is explicitly "not a retail journey" — back-office/role-restricted only. Per the Source Confidence Handling Policy's conflict-resolution rule (High beats Medium-Low), treat PERSONA-021's back-office framing as authoritative and this clause as unresolved/pending stakeholder confirmation. See `conflict-report.md` Conflict 3 and `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

## PERSONA-016: Donor Operator (Ooredoo/QTEL)
`Explicit` · confidence: `high`

- **Type:** External telecom operator
- **Responsibilities:** Accepts, rejects, or conditionally accepts MNP/FNP port requests within defined SLAs; initiates degradation/dunning ladder post-port-in
- **Accessible journeys:** MNP Port-In, FNP Port-In, Post-Port-In Billing and Dunning
- **Accessible actions:** Accept/reject/conditionally-accept port requests; initiate dunning
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

## PERSONA-017: Manager/Approver (Delegation of Authority / DOA hierarchy)
`Explicit` · confidence: `high`

- **Type:** Management approver
- **Responsibilities:** Approves individual billing adjustments through the DOA hierarchy
- **Permissions:** Adjustment approval authority per DOA level
- **Accessible journeys:** Adjustment (individual)
- **Accessible actions:** Approve/reject adjustment requests
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “individual adjustments go through ticketing + DOA (delegation of authority) hierarchy”

## PERSONA-018: Presenter (Enterprise Knowledge Base SME)
`Explicit` · confidence: `high`

- **Type:** Internal SME/trainer
- **Responsibilities:** Demonstrates the enterprise process knowledge base and walks through as-is enterprise product processes
- **Accessible screens:** Knowledge base dashboard, process list
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “A guided walkthrough (by an unnamed presenter) of Vodafone Qatar's enterprise process knowledge base”

## PERSONA-019: Manager (Approver/Bypass/System Admin role, general)
`Explicit` · confidence: `high`

- **Type:** Supervisory / Approval
- **Responsibilities:** Approves postpaid-to-prepaid migration fee additions; manager-level bypass to edit QID number field only; approves manually-added fees; resolves Bill Limit/Agent Minimum validation failures escalated from agents; configures Bill Limit Mapping/Spend Limit product settings via Administration - Product > Product Promotions
- **Permissions:** Can override/bypass QID number entry; approves manually-added fees; can raise/lower Agent Minimum Value thresholds that constrain what Sales agents can enter; implied elevated configuration access to override Agent Minimum settings
- **Accessible screens:** Product Promotions admin screen (More Info tab, Bill Limit Mapping / Spend Limit Mapping applet)
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “a manager-level bypass allows editing QID number only, with remaining fields validated against MOI”
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “an admin-side change to the "Bill Limit Mobile Plus" spend-limit product mapping (raising its Agent Minimum Value to 80)... 'Please Contact the System Administrator with Reference # 1-DAFQWTQ'”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)”

## PERSONA-020: Billing Team / Billing Role
`Explicit` · confidence: `high`

- **Type:** Back office
- **Responsibilities:** Only role permitted to change bill cycle
- **Permissions:** Restricted permission to change bill cycle
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill cycle change restricted to specific roles (billing team); business rule for change eligibility must be configurable”

## PERSONA-021: Collection/Credit Control Team (Manual Suspension via Taurus)
`Explicit` · confidence: `high`

- **Type:** Back office
- **Responsibilities:** Runs manual suspension ('park my number') as a back-office ticket-driven process using Taurus
- **Restricted / not permitted:** Manual suspension restricted to specific roles, not exposed as retail journey
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Taurus (currently only collection team uses it for suspension); manual suspension restricted to specific roles and run as a back-office ticket-driven process”

## PERSONA-022: Retention Agent / Retention Team
`Explicit` · confidence: `high`

- **Type:** Back office / Retail
- **Responsibilities:** Manually checks star number and device penalties before disconnection is processed; handles retention offers and win-back retention before cancellation of fixed-line install; closes disconnection-related tickets, which triggers automatic creation of a disconnection order
- **Permissions:** Ticket closure authority for disconnection tickets
- **Accessible journeys:** Disconnection Ticket Processing
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “star number and device penalties are checked manually by the retention agent (being automated in a separate project)”
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “"Win back" tickets are raised by the technician if a customer refuses/hasn't paid on-site, routed to the sales team for retention offers before cancellation”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “"Once the Ticket is Closed by Retention Team, It automatically creates a disconnection order."”

## PERSONA-023: CDM Team / Customer Data Management
`Explicit` · confidence: `high`

- **Type:** Back office queue/team
- **Responsibilities:** Handles sequential approvals for Transfer of Number tickets; approves minor-customer exception processing; manages customer data governance
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Transfer of Number (TON): prepaid-only; requires four sequential approvals routed to the CDM team”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Con Festin on behalf of Haya Al Mannai (Customer Data Management Manager)...Customer Data Management team approval”

## PERSONA-024: Supervisor
`Explicit` · confidence: `high`

- **Type:** Supervisory
- **Responsibilities:** Would need visibility across all agents' tickets (gap identified, not yet implemented)
- **Restricted / not permitted:** Currently no supervisor cross-agent ticket view exists
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “supervisor visibility across all agents' tickets (currently no such view exists)”

## PERSONA-025: Field Technician / Field Engineer (WFM/OFS/OFSC)
`Explicit` · confidence: `high`

- **Type:** Field / Installation
- **Responsibilities:** Raises installation-day issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team; raises 'win back' tickets if customer refuses/hasn't paid on-site; performs installation (mesh setup, WFM appointments); currently lacks access to combo box password; receives assigned installation activity via Oracle Field Service app, travels to site, performs Assess Activity, Serial Number Check, Device/Service Activation, Installation Checklist, captures customer signature, ends activity; performs geolocation start, Kahramaa duplicate check, serial number verification
- **Permissions:** Can move/transfer inventory to self, submit activation requests, complete checklists
- **Accessible screens:** My Route, Activity details, Start activity, Assess Activity, Serial Number Check, Installation Checklist, End activity
- **Accessible actions:** Start, Submit Serial Number Check, Submit Installation Checklist, End Activity, view Next Activity
- **Restricted / not permitted:** No Siebel access; no access to combo box password today (decision made to change this)
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “field technician has no Siebel access — raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team”
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “combo box/CPE password is fetched from UIM, never disclosed to customer or (today) even to the field engineer”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “OFS mobile/web app, technician Syed Irfan, 'My Route' for Sunday 07 September 2025... Next job card: '2PM - 5PM Installation 120812 1-29722927101'... with a Start button”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Logged in as Syed Irfan, Thursday 18 September 2025. Job card: "8AM - 11AM Installation 120955 1-29728036..."”

## PERSONA-026: Rollout Team
`Explicit` · confidence: `high`

- **Type:** Back office
- **Responsibilities:** Receives Siebel order tasks created from WFM field technician activities
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “which via integration create Siebel order tasks for the rollout team”

## PERSONA-027: Sales Team (Win-back)
`Explicit` · confidence: `high`

- **Type:** Retail / Retention
- **Responsibilities:** Handles win-back retention offers before cancellation of fixed-line install
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “"Win back" tickets are raised by the technician if a customer refuses/hasn't paid on-site, routed to the sales team for retention offers before cancellation”

## PERSONA-028: Managing Queue / CDM / BOQ / QATQ (routing queues)
`Explicit` · confidence: `high`

- **Type:** Back office queues
- **Responsibilities:** Ticket routing/processing queues for TON
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “four-queue ticket routing through the Managing queue, CDM, BOQ and QATQ”

## PERSONA-029: MOI (Ministry of Interior, external system/authority)
`Explicit` · confidence: `high`

- **Type:** external system/authority
- **Responsibilities:** Supplies ID validity/cancelled-ID data files used to detect third-party TON cases
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “MOI shares a file; BI builds a hold-down table and invalid-ID table”

## PERSONA-030: Store Agent (TON)
`Explicit` · confidence: `high`

- **Type:** internal
- **Responsibilities:** Validates documents and processes Transfer of Number at store
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “an SMS is sent to eligible users who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store”

## PERSONA-031: Business Analyst (Rana)
`Explicit` · confidence: `high`

- **Type:** internal delivery team
- **Responsibilities:** Revenue management business analysis
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “delivery team introduced includes Rana (BA, revenue mgmt)”

## PERSONA-032: Solution/Financial Architect (Marishi)
`Explicit` · confidence: `high`

- **Type:** internal delivery team
- **Responsibilities:** Solution and financial architecture
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “Marishi (solution/financial architect)”

## PERSONA-033: Retail Agent (Retail Operations Stakeholder - Giri)
`Explicit` · confidence: `high`

- **Type:** internal business stakeholder
- **Responsibilities:** Retail operations oversight
- **Restricted / not permitted:** Retail cannot change primary contact (per CRM Journeys workbook comment)
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “business stakeholders include...Giri (retail operations)”

## PERSONA-034: Authorized Officer
`Explicit` · confidence: `high`

- **Type:** internal role
- **Responsibilities:** Can flag an account to override the max mobility line cap (CRA rule)
- **Permissions:** Can flag an account to override the max mobility line cap (CRA rule)
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “Override requires an authorized-officer role flag on the account, not an in-journey bypass, because the limit is a CRA (regulator) rule”

## PERSONA-035: Credit Control / Billing Stakeholder (Anwar Mishra)
`Explicit` · confidence: `high`

- **Type:** internal business stakeholder
- **Responsibilities:** Billing, payments, and credit oversight
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “business stakeholders include Anwar Mishra (billing/payments/credit)”

## PERSONA-036: Security Stakeholder (Ali)
`Explicit` · confidence: `high`

- **Type:** internal business stakeholder
- **Responsibilities:** Security review of the journey/architecture
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “Ali (security)”

## PERSONA-037: Qatar Visa Center (QVC) Staff
`Explicit` · confidence: `high`

- **Type:** internal/offshore
- **Responsibilities:** Offshore prepaid registration via Integrated System
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Prepaid Offshore channels: Qatar Visa Center (Integrated System)”

## PERSONA-038: Offshore Airport Staff / Third-Party Partner (Offshore Prepaid Activation)
`Explicit` · confidence: `high`

- **Type:** internal/offshore, external partner
- **Responsibilities:** Offshore prepaid/postpaid activation via SFTP/VSA; manually activates offshore (airport) prepaid sales, producing an Accept or Reject outcome
- **Permissions:** Manual activation authority for offshore prepaid sales only
- **Accessible journeys:** Prepaid Activation Offshore
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Offshore Airport (SFTP, VSA)...Postpaid Offshore channels: Offshore Airport (VSA)”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “offshore airport prepaid sales are manually activated by a 3rd party partner, with Accept/Reject outcomes”

## PERSONA-039: Fulfilment Manager Sign-off (Fixed & Mobile Fulfilment and Technical Support)
`Explicit` · confidence: `high`

- **Type:** internal
- **Responsibilities:** Fulfilment and technical support sign-off on activation procedure; per revision history, Fulfilment now rejects registrations directly (no email round-trip)
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Hanif Khan on behalf of Sandeep Patil (Fixed & Mobile Fulfilment and Technical Support Manager — Fulfilment)”

## PERSONA-040: GTM & Channel Operations
`Explicit` · confidence: `high`

- **Type:** internal
- **Responsibilities:** Go-to-market and channel operations sign-off
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Ellen Ciudad (GTM & Channel Operations Manager)”

## PERSONA-041: Team Manager / Approver / Manager (Order Approval, Test Manager)
`Explicit` · confidence: `high`

- **Type:** Manager / order-approval role
- **Responsibilities:** Reviews orders in TM SR Queue View / Order Activities Queue / Manage Leads / Leads Queue, self-assigns via 'Assign To Me', reviews Attachments/Order Details/Activities/Agents Details tabs, approves or rejects orders (Reject - Correction or Reject - Drop Order) with a reason and comments; rejects leads with Reject Reason Code + Comment, reassigns Lead Owner; sole authority to cancel FDO Disconnection requests approvals
- **Permissions:** After one correction round, the Reject - Correction option is no longer offered on re-review; menu restricted to Home, Order Approval, Manage Leads, Leads Queue (or just Home and Order Approval) vs full agent menu; Reject action, Lead Owner reassignment via picker
- **Accessible journeys:** Order Approval, Lead Approval/Reject, SIM Swap Approval
- **Accessible screens:** Manager home dashboard (Home, Order Approval, Manage Leads, Leads Queue), TM SR Queue View, My Activities, Order Approval detail (Attachments, Order Details, Activities, Agents Details tabs), Reject Order modal, Approve Order modal, Manage Leads, My Team's Leads, Lead Details (Approver applet)
- **Accessible actions:** Approve, Reject - Correction, Reject - Drop Order, Assign To Me, ReAssign To Queue
- **Restricted / not permitted:** Cannot access full sales/order-creation modules available to front-line agents; menu limited to Home/Order Approval (+/- Manage Leads, Leads Queue), distinct from field-agent tablet menu
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “A different logged-in user, "Test Manager", hovers the Order Approval tile (alongside Home, Manage Leads, Leads Queue).”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Home screen for a different logged-in user, 'Welcome back Test Manager!', with a distinct top menu limited to Home, Order Approval, Manage Leads, Leads Queue"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Separate login as "Test Manager" lands on Siebel Web Call Center Home... Menu: Home, Order Approval, User Preferences.”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “'Welcome back Test Manager!' ... module tiles reduced to Home, Order Approval, Manage Leads, Leads Queue”
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Role switch to Manager — Home screen now for "Test Manager"... This account's top nav is reduced to just Home and Order Approval, confirming a distinct approver role/persona is used for this step”
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “cannot be cancelled by the app — only the retention team can cancel”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Select order, click Assign to Me -> Click Order ID hyperlink -> Scroll down, Approve or Reject the Task -> On Approve, pop-up opens to add comments and Submit”
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Tablet orders (mostly partners) require channel-manager approval before submission (00:12:37)”

## PERSONA-042: Retention Team (FDO Disconnection Cancellation)
`Explicit` · confidence: `high`

- **Type:** Internal/Specialist team
- **Responsibilities:** Sole authority to cancel FDO Disconnection requests
- **Permissions:** Cancel Disconnection FDO (restricted to this team only)
- **Accessible journeys:** FDO Disconnection cancellation
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “cannot be cancelled by the app — only the retention team can cancel”

## PERSONA-043: Retail Agent (Lead Owner, reassignment target)
`Explicit` · confidence: `high`

- **Type:** Frontline/Retail
- **Responsibilities:** Receives reassigned leads into own My Leads queue, can edit lead fields (Description)
- **Permissions:** Standard agent menu: Contacts, Mobile Postpaid, Sales Order, Queue, Passport to QID, MNP Tablet, New Fixed Line Tablet, New Prepaid Tablet, New IOT Tablet, Lead, SIM Swap, New Lead Tablet, My Leads, New FWA Tablet
- **Accessible journeys:** Create Lead, Lead Edit, MNP, Passport to QID, SIM Swap
- **Accessible screens:** My Leads, Lead Details View
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “VINODHINIR (Retail Agent) ... selected in Lead Owner picker”

## PERSONA-044: Back Office / Admin (broad org-wide access)
`Explicit` · confidence: `high`

- **Type:** Back office/Administrative
- **Responsibilities:** Org-wide lead visibility via All Leads across Org, additional Reject/Retire actions, broader module access spanning almost all functional areas
- **Permissions:** Reject, Retire on leads; Assign To Me, Send SMS, Product Recommendations, Validate, Submit actions on Lead Details
- **Accessible journeys:** virtually all journeys in the corpus (widest menu observed)
- **Accessible screens:** All Leads across Org, full 3-column Lead Details layout, Order Approval, IDM Management, Static Data Business; 'Welcome back KARTHIKK KARTHIKK!' - a much larger admin/back-office menu: Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, Multi-Site Quotes, MNP, Blacklist Customers, Queue, Quotes, Customer Directory, Trouble Tickets, Numbers, Payments, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Passport to QID, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Lead, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests, Agreements, New FWA
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'Welcome back KARTHIKK KARTHIKK!' - a much larger admin/back-office menu”

## PERSONA-045: DSA / Store / Field Engineer (sales channel attribution)
`Explicit` · confidence: `high`

- **Type:** Sales channel / agent-attribution role
- **Responsibilities:** Recorded as the sales-channel attribution on the signed Acceptance Form (Direct Sales Agent, Store, or Field Engineer)
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “an agent-attribution section with checkboxes for DSA / Store / Field Engineer (English) — mirrored in Arabic as وكيل المبيعات المباشر / متجر / مهندس ميداني”

## PERSONA-046: Dispatcher/Back-Office WFM User
`Explicit` · confidence: `high`

- **Type:** Back Office
- **Responsibilities:** Views/manages WFM Activity details, reassigns technicians (Move), transfers CPE/SIM inventory between resources
- **Accessible screens:** WFM Activity details (dispatcher view), Move dialog, Inventory Management > Non-Serialized Inventory Transfer
- **Accessible actions:** Move (reassign technician), Add To Transfer List, Start Transfer
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"'Move' dialog (img 19): 'Move 2PM - 5PM - Installation - 120812 - 1-29722927101' — Resources tab, search 'Syed' returns technician 'Syed Irfan'"”

## PERSONA-047: CSR / Desktop Agent (Vanilla channel)
`Explicit` · confidence: `high`

- **Type:** Sales/Customer Service Agent
- **Responsibilities:** Manually creates and modifies orders through Contact/Account/Sales Order screens (non-wizard); modifies installed CPE asset attributes via Account 360
- **Accessible screens:** Customer Portal / Account Summary, Installed Assets grid, FMS CPE Bundle modify screen
- **Accessible actions:** Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP"”

## PERSONA-048: Fulfillment Team (ECR Details - inferred)
`Inferred` · confidence: `medium`

- **Type:** Back-office
- **Responsibilities:** Fills ECR Details field (referenced but not directly observed acting in these documents)
- **Restricted / not permitted:** Field marked as fulfillment-team-only, implying front-line agents should not fill it
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Enter ECR Details = No, with note "To be filled by Fulfillment team only."”

## PERSONA-049: System Administrator (Product Promotions admin)
`Explicit` · confidence: `high`

- **Type:** Back-office/admin
- **Responsibilities:** Configures Bill Limit Mapping / Spend Limit product settings (Agent Min Value, SL Default Value, Active Flag) via Administration - Product > Product Promotions
- **Permissions:** Can raise/lower Agent Minimum Value thresholds that constrain what Sales agents can enter
- **Accessible screens:** Product Promotions admin screen (More Info tab, Bill Limit Mapping / Spend Limit Mapping applet)
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “an admin-side change to the "Bill Limit Mobile Plus" spend-limit product mapping (raising its Agent Minimum Value to 80)... 'Please Contact the System Administrator with Reference # 1-DAFQWTQ'”

## PERSONA-050: System user SADMIN (backend/system account)
`Explicit` · confidence: `high`

- **Type:** System/Automated
- **Responsibilities:** Creates and processes orders generated automatically by the Unica campaign/Autobase migration engine
- **Permissions:** System-level order creation distinct from human agent-created orders
- **Accessible journeys:** Autobase Pre2Post migration
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Order detail 1-28829245642 (initial, Status = Open) ... Created By "SADMIN", Source "UNICA"”

## PERSONA-051: Channel Manager
`Explicit` · confidence: `high`

- **Type:** Internal/Approver
- **Responsibilities:** Approves partner/tablet channel orders before submission
- **Permissions:** Order approval gate for partner-submitted tablet orders
- **Accessible journeys:** Partner/tablet order submission flows
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Tablet orders (mostly partners) require channel-manager approval before submission (00:12:37)”

## PERSONA-052: Offshore Retailer / Channel Partner (VSA/BSA)
`Explicit` · confidence: `high`

- **Type:** External/Channel partner
- **Responsibilities:** Provisions prepaid/postpaid connections via VSA/BSA channel
- **Accessible journeys:** Prepaid/postpaid provisioning via VSA channel (out of scope system)
- **Restricted / not permitted:** Visibility restricted to own orders/leads only
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “VSA (also called BSA/PSA) = direct prepaid/postpaid provisioning, used by offshore retailers ... a partner sees only its own orders/leads”

## PERSONA-053: Customer Care / Telesales & Retention / Complaints / Direct Sales / Mass Market / Mini Store / Retail & Franchise agents (role families)
`Explicit` · confidence: `medium`

- **Type:** Internal/Frontline and back-office
- **Responsibilities:** Each performs its named functional area (sales, retention, complaint handling, fulfilment, billing, collections, customer data management) within the CRM
- **Accessible journeys:** Role-specific subsets of the broader guided journeys and BAU processes (not itemized per role in this transcript)
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Roles/functions walked through: customer care, telesales & retention, complaints (mobile/fixed), direct sales, mass market, mini store, retail & franchise, fixed fulfilment, consumer/enterprise mobile fulfilment, MNP/FNP, white label fulfilment, billing, collections, customer data management (CDM)”

## PERSONA-054: Sales / Fulfilment (VFID-KID mapping team)
`Explicit` · confidence: `high`

- **Type:** Operations
- **Responsibilities:** Manually resolves ambiguous KID-to-VFID mapping cases
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “many-KIDs-to-one-VFID and one-VFID-to-many-KIDs are supported corner cases handled manually by sales plus fulfillment”

## PERSONA-055: Field Survey Team
`Explicit` · confidence: `high`

- **Type:** Operations
- **Responsibilities:** Maps generated VFIDs to KIDs on-site
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Vodafone ID... Generated in advance by RPA, loaded into UIM, then mapped to KIDs by a field survey team”

## PERSONA-056: Network Team
`Explicit` · confidence: `high`

- **Type:** Internal/Technical
- **Responsibilities:** Owns IMS inventory data, outside Technology department control
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “IMS: network-team-owned inventory (outside technology control), sourced from Qatar GIS”

## PERSONA-057: Business/Strategy Team
`Explicit` · confidence: `high`

- **Type:** Internal/Business
- **Responsibilities:** Owns GIS-to-IMS process and manual data hot-loads
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “GIS→IMS is business/strategy-owned and excluded; manual extracts/hot loads from strategy team create unpredictable data timing”

## PERSONA-058: Agent viewing Open UI Desktop (Account 360, Care Agent)
`Explicit` · confidence: `high`

- **Type:** Frontline/Care Agent
- **Responsibilities:** Looks up account/asset summary, views usage/balance, manages add-ons/promotions, sends SMS, views contact/communication history, creates leads
- **Permissions:** Change Limit, Manage Add Ons, Upgrade Promotion, Send SMS, Get Due Amount, Get RTB (Real Time Balance), Get Usages, End Data Session
- **Accessible screens:** Account Summary, Asset Summary, Asset detail cards, Communications/Contact History modal (with sub-tabs Contact history, Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead)
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “screenshot walkthrough of the Open UI Desktop 'Account 360' view for an agent looking up a business customer account”

## PERSONA-059: Complaints Team (Mobile and Fixed)
`Inferred` · confidence: `medium`

- **Type:** Back-office/Care
- **Responsibilities:** Handles trouble tickets categorised by hashtags/actual-issue taxonomy; fills designated Ticket Homepage fields; receives MVA-originated customer request reports, contacts customers, and raises tickets in the system
- **Permissions:** Field-level write access to fields designated for the Complaints Team; authority to raise tickets on the customer's behalf
- **Accessible journeys:** Complaints Management Process
- **Accessible screens:** Ticket Homepage
- **Sources:**
  - [`tt-hashtags-and-actual-issue-8d8ccaa5`](../.knowledge/docs/tt-hashtags-and-actual-issue-8d8ccaa5.md): “cross-reference notes the Day 17 transcript 'names complaints team (mobile and fixed) as a persona'”
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "...Filled By Complaints Team..."); "Currently the customer can create requests from MVA which is being sent as report to a Team to contact customer and raise tickets in System."”

## PERSONA-060: Back Office (generic activity channel)
`Explicit` · confidence: `medium`

- **Type:** Back-office
- **Responsibilities:** Processes activities logged via a 'Back Office' channel (e.g., language change requests)
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Contact history row: Channel 'Back Office', Description 'Testing Purpose'”

## PERSONA-061: Product Team
`Explicit` · confidence: `high`

- **Type:** Internal/Business
- **Responsibilities:** Supplies plan-to-star-number pricing eligibility matrix
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Product team to supply plan-price-to-Star-Number-price eligibility matrix (D-02)”

## PERSONA-062: Solution Architect / Business Owner / IT Owner / Track Lead / Test Manager / Delivery Manager (Governance)
`Explicit` · confidence: `high`

- **Type:** Governance
- **Responsibilities:** Formal document governance/sign-off roles, not yet assigned to named individuals
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Stakeholder roles (Business Owner, IT Owner, Solution Architect, Track Lead, Test Manager) are all listed as 'To be confirmed'”

## PERSONA-063: Agent (in DXP)
`Explicit` · confidence: `medium`

- **Type:** Internal/Front-line staff
- **Responsibilities:** Performs onboarding steps in DXP (ID validation routing, cart building, plan/add-on selection, CAF generation, payment capture); acts as/queries Assisted Care Agent for Customer 360 retrieval; initiates and submits modify orders (suspend/resume), changes plans, captures payment
- **Permissions:** Initiates and submits modify orders; changes customer plan (Base<->Park); retrieves aggregated customer data
- **Accessible journeys:** J011 Mobile Post-Paid Customer Onboarding, J017 Customer 360, J023 Mobile Service Suspension, J024 Mobile Service Resume
- **Accessible screens:** Customer 360 (Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk sections, per slide titles)
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Actors: Customer, Agent in DXP (recurs across J011 and J017 flows)”

## PERSONA-064: Assisted Care Agent
`Explicit` · confidence: `medium`

- **Type:** Internal/support staff
- **Responsibilities:** Receives customer queries and searches/retrieves aggregated Customer 360 data (bill info, CDR, network status, order/customer details, payment/billing details)
- **Permissions:** Search and retrieve aggregated customer data across multiple sources
- **Accessible journeys:** J017 Customer 360
- **Accessible screens:** Customer 360 UI sections (Overview, Order, Trouble Tickets, Installed Assets, Billing Profile, Credit Risk)
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “query to Assisted Care Agent, search for customer by Customer No / Contact No / MSISDN”

## PERSONA-065: MNP Team
`Explicit` · confidence: `high`

- **Type:** Internal/back-office team
- **Responsibilities:** Validates activities inside MNP Port Out tickets, assigning Success/Failed status
- **Permissions:** Manual validation authority over MNP port-out ticket activities
- **Accessible journeys:** MNP Port Out Ticket Processing
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status)”

## PERSONA-066: FL Agents (Front Line Agents)
`Explicit` · confidence: `medium`

- **Type:** Internal/front-line staff
- **Responsibilities:** Fill designated fields on the Ticket Homepage; fill specific fields for particular trouble ticket (TT) types; create tickets from templates for complaints/issue types
- **Permissions:** Field-level write access to certain Ticket Homepage fields, differentiated from the Complaints Team's fields
- **Accessible journeys:** Complaints Management Process / Agent Ticket Creation
- **Accessible screens:** Ticket Homepage, Open UI Tickets Fields (templates)
- **Restricted / not permitted:** Cannot fill fields designated "Filled By Complaints Team"
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

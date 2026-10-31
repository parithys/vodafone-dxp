# User Journey Catalogue (Phase 14)

End-to-end journeys evidenced by guided-journey walkthroughs, workshops, and BRSDs — spanning Lead, Sales/Activation (Postpaid/Prepaid/FWA/Fixed Line), Pre-to-Post migration, MNP porting, SIM Swap, Home Move, and Trouble Ticketing.

**Canonical items:** 111 (deduplicated from 118 raw extracted mentions across the 83-document corpus)

**Confidence:** high 101 · medium 9 · low 1
**Classification:** Explicit 111 · Inferred 0 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## UJ-001: Bulk Adjustment Submission (Target State)
`Explicit` · confidence: `high`

- **Actors:** Agent, Collections, DXP portal, BRM
- **Preconditions:** Agent has role-based access; billing profile identified
- **Workflow steps (summary):** Agent uses bulk adjustment portal in DXP integrated with BRM: fills fixed template, submits multi-bucket adjustments with unit of measurement and free-text comment, filtered by billing profile; portal tracks request status and produces failure reports for re-upload.
- **Success conditions:** Adjustment applied in BRM with traceable request status
- **Exit conditions:** Failure report generated for rows that fail, allowing re-upload
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter”

## UJ-002: Fixed Line Two-Phase Order Completion
`Explicit` · confidence: `high`

- **Actors:** Fulfilment, PM (project manager), OSM, BRM, bill formatter
- **Preconditions:** Order raised in OSM for fixed-line service
- **Workflow steps (summary):** Order opened in OSM, awaits PM confirmation of completion; CDRs flow to BRM once active; bill formatter only shows active services; if completion is delayed beyond ~12 months OSM auto-completes/purges the order.
- **Success conditions:** Order completed at the correct activation date so billing/CDR/tax reporting align
- **Exit conditions:** Auto-completion/purge after ~12 months if not confirmed; back-dated completion causes billing disputes
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “OSM auto-completes/purges orders older than ~12 months; order completion depends on PM confirmation; CDRs flow to BRM but bill formatter only shows active services; back-dated order completion caused a documented dispute”

## UJ-003: Enterprise Sales-to-Fulfilment Handover
`Explicit` · confidence: `high`

- **Actors:** Account Manager, Fulfilment
- **Preconditions:** Deal closed by account manager
- **Workflow steps (summary):** Account manager closes deal, forwards documents and order form to fulfilment by email/portal.
- **Success conditions:** Fulfilment receives documents and order form to proceed with account creation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Enterprise sales-to-fulfilment handover: deal closed by account manager, forwarded by email/portal with documents and order form”

## UJ-004: Enterprise Account Creation
`Explicit` · confidence: `high`

- **Actors:** Fulfilment agent, Business Finance
- **Preconditions:** CR number available; mandatory CR-number search performed
- **Workflow steps (summary):** Capture name, CR type/ID type, CR number, agent ID, business type (incl. B2B2C); assign credit limit (requires business finance approval for enterprise since there is no default); assign parent/sub-account structure.
- **Success conditions:** Account created with valid CR and credit limit approved
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit — enterprise has no default credit limit and requires business finance approval”

## UJ-005: Bulk Activation (Current State)
`Explicit` · confidence: `high`

- **Actors:** Fulfilment/activation team
- **Preconditions:** Identical plan, account, spend limit and price across the batch
- **Workflow steps (summary):** Team uses an old custom Excel macro (from "SSI") with Siebel credentials embedded in the control sheet; a pre-created pending replica order is used as reference for the batch upload.
- **Success conditions:** Batch of numbers activated with identical parameters
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Bulk activation (current state): a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch; a pre-created pending replica order used for reference”

## UJ-006: Enterprise/IoT Order-to-Billing Flow
`Explicit` · confidence: `high`

- **Actors:** Account manager, EBU PM, Fulfilment, ETS, EBU, SBN, client
- **Preconditions:** Account manager request raised
- **Workflow steps (summary):** Account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN → delivery (physical, by SBN) and provisioning → provisioning successful → client accepts → billing (service activation for charging).
- **Success conditions:** Client accepts delivered/provisioned service and billing activates
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “End-to-end flow described: account manager request → EBU PM → order raised → acceptance by Fulfilment, ETS, EBU and SBN → delivery (physical, by SBN) and provisioning → provisioning successful → client accepts → billing”

## UJ-007: Enterprise Order Journey (Vanilla Direct)
`Explicit` · confidence: `high`

- **Actors:** EBU PM, Sales, installation site engineer
- **Preconditions:** CR number known; care form/CIO copy/oversight copy and site survey prerequisites gathered
- **Workflow steps (summary):** Order starts from CR number; one order equals one location; installation contact captured as free-text comment (no contact ID possible), causing appointment notifications to go to the wrong person.
- **Success conditions:** Order placed and installation appointment scheduled
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Enterprise order journey: described as "vanilla direct" rather than a guided journey; starts from CR number; one order equals one location; prerequisites are care form/CIO copy/oversight copy plus site survey”

## UJ-008: Enterprise Mobility Lead-to-Order
`Explicit` · confidence: `high`

- **Actors:** Customer, EBU operations, Account Manager, Credit Control, Fulfilment
- **Preconditions:** Customer enquiry received
- **Workflow steps (summary):** Customer enquiry via website callback, chat, WhatsApp, business care, or business-in-retail → lead qualification by EBU operations → assignment to account manager → document collection (CAF, MSA, service-specific forms) → credit control → discount approval in MS Dynamics via EBU hierarchy → handover to fulfilment for account/parent account creation and number activation.
- **Success conditions:** Account created and numbers activated
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Enterprise mobility lead-to-order: customer enquiry via website callback, chat, WhatsApp, business care, or business-in-retail; lead qualification by EBU operations; assignment to an account manager; document collection (CAF, MSA, and service-specific forms); credit control; discount approval in MS Dynamics via the EBU hierarchy; handover to fulfilment”

## UJ-009: Push to Talk (PTT) Provisioning
`Explicit` · confidence: `high`

- **Actors:** EBU operations, Account Manager, Credit Control, IT/Security, Service Desk
- **Preconditions:** Lead qualified through same front end as mobility
- **Workflow steps (summary):** Same lead-to-credit-control front end, then pricing approval for device and SIM, IT and security approvals, tenant account and licence provisioning, and a service desk SR for back-end/network activation.
- **Success conditions:** Tenant account provisioned and network activated via SR
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Push to Talk (PTT): same lead-to-credit-control front end, then pricing approval for device and SIM, IT and security approvals, tenant account and licence provisioning, and a service desk SR for back-end/network activation”

## UJ-010: New Fixed Line / Business Broadband Order
`Explicit` · confidence: `high`

- **Actors:** Sales, Credit Control, Network team
- **Preconditions:** Order form completed with add-ons
- **Workflow steps (summary):** Order form → billing in advance → add-ons → RFS/feasibility checking via Grafana on the portal → credit control → discount attached to the order form → predefined processes covering open orders, network work and installation.
- **Success conditions:** Installation completed per predefined process
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “New fixed line / business broadband: order form, billing in advance, add-ons, RFS/feasibility checking now via Grafana on the portal, credit control, discount attached to the order form, and predefined processes covering open orders, network work and installation”

## UJ-011: 5G Indoor/Outdoor (FWA) Activation — Enterprise/Business Care variant
`Explicit` · confidence: `high`

- **Actors:** Sales, Business Care, CMT team, vendor, field partner
- **Preconditions:** RFS validation passed; fibre unavailable (fibre takes precedence)
- **Workflow steps (summary):** RFS validation; document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card); CPE handover and provisioning; customer acceptance signature; post-activation support chain through business care, CMT team, vendor and field partner for device faults/changes.
- **Success conditions:** CPE provisioned and customer signs acceptance
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “(4) 5G Indoor and 5G Outdoor / FWA: RFS validation; the business rule that fibre takes precedence over 5G; document collection ... CPE handover and provisioning; customer acceptance signature; post-activation support chain”

## UJ-012: DAPN Activation
`Explicit` · confidence: `high`

- **Actors:** EBU PM, Sales, Order Desk, back-end team
- **Preconditions:** Contract documents collected
- **Workflow steps (summary):** Lead, qualification, contract document collection by EBU PM and sales, order desk validation, back-end APN configuration and an SR raised in the back end.
- **Success conditions:** APN configured and SR completed
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “(5) DAPN activation: lead, qualification, contract document collection by EBU PM and sales, order desk validation, back-end APN configuration and an SR raised in the back end”

## UJ-013: Bulk SMS Onboarding to Disconnection
`Explicit` · confidence: `high`

- **Actors:** Account manager, Fulfilment, OnMobile, Bulk SMS platform
- **Preconditions:** Short code and SMTP checks completed
- **Workflow steps (summary):** Assisted onboarding via account manager with short code and SMTP checks → external international short code registration → fulfilment and control document approval → account and order creation in Siebel → integration through OSM to Bulk SMS platform → billing owned by Bulk SMS platform (aggregated rated CDRs monthly) → disconnection with outstanding-balance checks and OnMobile confirmation.
- **Success conditions:** Account onboarded and billed via aggregated CDRs
- **Exit conditions:** Disconnection after outstanding-balance check and OnMobile confirmation
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Bulk SMS journey walked through end to end: assisted onboarding via account manager with short code and SMTP checks; external international short code registration; fulfilment and control document approval; account and order creation in Siebel; integration through OSM to a separate Bulk SMS platform”

## UJ-014: MNP Port-In (Mobile Number Portability) — Postpaid Sales Front-End
`Explicit` · confidence: `high`

- **Actors:** Sales, Fulfilment, Customer, Ooredoo (donor operator), NPAS
- **Preconditions:** Sales sends CAF, MNP form, QID/passport to fulfilment
- **Workflow steps (summary):** Fulfilment validates and creates Siebel order with plan/MNP category/porting details/reserved temp MSISDN; customer sends consent SMS within 24 hours; request goes via NPAS to Ooredoo who has 24 hours to accept/reject/conditionally accept; if conditional, 8-business-hour (presented as 24-hour) payment window; porting occurs in the shared Sun-Thu 11am-12pm window (before 10:45am cutoff for same-day).
- **Success conditions:** Number ported into Vodafone within the porting window
- **Exit conditions:** Rejection (one of 13 valid reasons) restarts the whole journey
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “MNP: sales sends CAF, MNP form and QID/passport to fulfilment; fulfilment validates and creates an order in Siebel ... Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo”

## UJ-015: FNP Port-In (Fixed Number Portability)
`Explicit` · confidence: `high`

- **Actors:** Fulfilment, Customer, Ooredoo (donor operator), NPAS, technician
- **Preconditions:** Consumer only, fiber-to-fiber
- **Workflow steps (summary):** Installation/RFS check first; trouble ticket raised with manually calculated target date; FNP form (mandatory Karma ID) and ID sent via NPAS to Ooredoo; Ooredoo validates documents, conditionally accepts with visible due amount (3 working days to clear), then accepts with porting date; two technician visits required — one for installation per WFM, one on the porting date for MSISDN configuration/testing.
- **Success conditions:** Service ported with both technician visits completed
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP (fiber-to-fiber only, consumer, 5 working days): installation/RFS check happen first; a trouble ticket is raised with a manually calculated target date; FNP form (mandatory Karma ID) and ID sent via NPAS to Ooredoo”

## UJ-016: Post-Port-In Billing and Dunning
`Explicit` · confidence: `high`

- **Actors:** Billing system, Ooredoo (donor)
- **Preconditions:** Number successfully ported in
- **Workflow steps (summary):** Final bill covers the last bill cycle to the porting date, payable within 30 days; three-level degradation/dunning ladder runs: outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine; degradation initiated by Ooredoo (donor) but de-automated to manual after customer bill-dispute complaints.
- **Success conditions:** Final bill paid within 30 days, avoiding dunning ladder
- **Exit conditions:** Disconnection and number return, followed by 30-day quarantine if unpaid
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “After port-in, a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs”

## UJ-017: GigaHome/OSNtv Subscription Acceptance and Lifecycle
`Explicit` · confidence: `high`

- **Actors:** Customer, Vodafone Qatar, DSA/Store/Field Engineer
- **Preconditions:** Customer signs acceptance form; customer has selected a GigaHome 5G Home Plan (speed tier, bill cycle, discount)
- **Workflow steps (summary):** Customer completes form (Name, QID, Plan, Date, Signature); postpaid billing begins in arrears with prorated first bill; optional Try & Buy 2-month trial with 30-day waiver window; customer may request Home Move (14 days notice, free once per 12-month cycle) or TON when moving; early disconnection before 12-month lock-in triggers calculated penalties. Later version (5G Home Plans v3): agent/channel presents 18 numbered T&C clauses (billing, fees, speed, FUP, lock-in, install address, router placement, Fibre migration policy, personal-use restriction, complaints); customer reviews bilingual EN/AR form; customer signs with Name, QID, Signature, Date, confirming terms, charges, speed tiers, fair-usage policy, and lock-in conditions before activation.
- **Success conditions:** Subscription active per terms; no penalty if lock-in completed or Home Move/TON used appropriately; form signed by customer with QID and date before service activation
- **Exit conditions:** Disconnection during lock-in triggers fees; misuse (commercial use, re-qualification abuse) risks suspension/blacklisting; signed form filed/attached (likely as Supplementary Form in the Fixed Line/FWA order's CAF attachment set)
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “A customer-signed acceptance form for GigaHome Fiber (broadband) and OSNtv subscriptions, setting out the postpaid billing model, lock-in periods, disconnection fees, Home Move policy, Transfer of Number (TON) facility”
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “confirming the customer has been informed of, and accepts, the specific terms, charges, speed tiers, fair-usage policy, and lock-in conditions of their chosen GigaHome 5G Home Plan before activation”

## UJ-018: MNP/FNP Port-Out Ticket Handling (Consumer/B2B2C, NPass-driven)
`Explicit` · confidence: `high`

- **Actors:** Consumer/B2B2C customer, NPass, Siebel system, Fulfilment team, CRM (escalation)
- **Preconditions:** Customer sends port-out SMS to NPass
- **Workflow steps (summary):** Customer SMS to NPass -> NPass notifies Siebel -> Siebel auto-creates ticket with 2-hour window (extends to 24h once docs validated) -> auto-validation of name/QID/service type/consumer type -> auto-reject on failure -> manual signature/MNP form checks -> conditional acceptance check on billed dues -> ticket resolved with rejection code if applicable.
- **Success conditions:** Ticket validated, conditional acceptance resolved, port-out proceeds within NPass working-hour window
- **Exit conditions:** Auto-rejection on validation failure; suspension and CRM escalation if action missed before SLA
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “customer's SMS goes to NPass, NPass notifies Siebel, and Siebel auto-creates a trouble ticket with a two-hour action window”

## UJ-019: Transfer of Ownership / Transfer of Number (TON) - Retail BAU (four-queue routing)
`Explicit` · confidence: `high`

- **Actors:** Retail agent, existing customer, new customer, Managing/CDM/BOQ/QATQ queues, Party A, Party B, store agent
- **Preconditions:** Existing and new customer identity/document validation; both parties physically present in store (happy path)
- **Workflow steps (summary):** System/document validation for both parties -> TON/prepaid migration fee application -> offline SMS-based communication -> OCR bypass by role where applicable -> POA-based exceptions -> ticket routed through four queues (Managing, CDM, BOQ, QATQ) -> SIM swap on success with mandatory approvals. BAU variant: documents collected (CAF, TON form, QIDs), payment/fee handling, transfer executed.
- **Success conditions:** SIM swap executed on successful ownership transfer; mandatory approvals passed; number transferred to Party B
- **Exit conditions:** Rejection due to signature/QID data-entry errors, missing attachments
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “current retail TON flow: system and document validations for existing and new customers, TON and prepaid-migration fees and their business rules... four-queue ticket routing through the Managing queue, CDM, BOQ and QATQ”
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “BAU TON — both parties physically present in store, happy path”

## UJ-020: SIM Swap (Retail/Back Office/MVA, CBS-validated)
`Explicit` · confidence: `high`

- **Actors:** Retail agent, Back office agent, MVA app user, Manager (bypass)
- **Preconditions:** Customer requests SIM swap (lost/damaged/eSIM-to-physical/eSIM-to-eSIM)
- **Workflow steps (summary):** OCR scan of ID -> barcode match -> MOI API validation (name/DOB/nationality) -> match against CBS customer info (extra third validation step vs. other journeys) -> approval per channel matrix (Retail: approval+form+ID attachment; Back office: some auto-approved; MVA: no approval once eKYC done) -> charge applied per SIM type -> swap executed.
- **Success conditions:** All validation steps pass and appropriate approval obtained per channel
- **Exit conditions:** Rejection if ID/MOI validation fails; fraud risk remains if genuine ID belongs to someone else
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Validation chain: OCR of ID → match barcode → MOI API (name, DOB, nationality) → match against existing CBS/customer information (SIM Swap has this extra third validation step)”

## UJ-021: Voluntary/Manual Suspension ('Park My Number')
`Explicit` · confidence: `high`

- **Actors:** Collection/Credit control back-office role
- **Preconditions:** Customer requests suspension via back-office ticket
- **Workflow steps (summary):** Back-office ticket-driven process -> plan change to 'park my number' plan (35 Rial/4 months upfront) -> credit limit set to zero. Voluntary suspension is being discontinued and will always be implemented as a plan change; renamed 'manual suspension'.
- **Success conditions:** Plan change applied, number suspended
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “voluntary suspension is being discontinued and will always be implemented as a plan change; renamed 'manual suspension'; delivered via a 35 Rial, four-month upfront-paid 'park my number' plan”

## UJ-022: Trouble Ticket Creation and Handling (general)
`Explicit` · confidence: `high`

- **Actors:** Agent, System (eShop/NPAS/portal), MVA customer
- **Workflow steps (summary):** Ticket created (agent, system, or customer via MVA validation queue) -> routed to team/queue -> assigned -> resolved with resolution code. Sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket).
- **Success conditions:** Ticket resolved within SLA
- **Exit conditions:** Ticket not submitted does not route to any queue
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Ticket sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket)”

## UJ-023: End Data Session
`Explicit` · confidence: `high`

- **Actors:** System (IN)
- **Workflow steps (summary):** Auto-created ticket refreshes long-running IN session, forces CDR generation, auto-closed; goes to no team.
- **Success conditions:** CDR generated, session refreshed
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “auto-created and auto-closed ticket to refresh a long-running IN session and force CDR generation; goes to no team”

## UJ-024: Transfer of Number (TON) - Trouble Ticket variant (prepaid-only, fraud control)
`Explicit` · confidence: `high`

- **Actors:** CDM team
- **Workflow steps (summary):** Prepaid-only; requires four sequential approvals routed to the CDM team; built as a fraud control after historical fraud where a fraudster collected money from two people for the same number at different stores.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “prepaid-only; requires four sequential approvals routed to the CDM team; built as a fraud control after historical fraud where a fraudster collected money from two people for the same number at different stores”

## UJ-025: Disconnection (Trouble Ticket, Retention-first control)
`Explicit` · confidence: `high`

- **Actors:** Retention agent
- **Preconditions:** Retention ticket must be closed with resolution code before order submission
- **Workflow steps (summary):** Retention ticket opened -> retention agent manually checks star number/device penalties -> ticket closed with resolution code -> disconnection order submitted.
- **Success conditions:** Ticket resolved with code, order submitted
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “retention-first business rule — ticket closed with a specific resolution code (e.g., 'retained' or not) before the disconnection order can be submitted on the Orders page”

## UJ-026: MNP Port-Out (Trouble Ticket variant, NPAS auto-created)
`Explicit` · confidence: `high`

- **Actors:** NPAS system
- **Workflow steps (summary):** Auto-created from NPAS (government-managed inter-operator system) into an MNP queue; unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched; automated checks (low outstanding, not blacklisted) recorded as ticket activities; star number port-out control applied if in commitment period.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “auto-created from NPAS (government-managed inter-operator system) into an MNP queue; unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched”

## UJ-027: Prepaid-to-Postpaid Migration (Business Process/Manual Eligibility)
`Explicit` · confidence: `high`

- **Preconditions:** Minimum one month age on network, minimum 50 Riyal recharge in last month, CDR-based usage history check
- **Workflow steps (summary):** Manual postpaid billing profile creation -> eligibility checks (network age, recharge amount, CDR usage history, manual today, to be automated) -> migration executed.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “requires postpaid billing profile creation (manual step today); eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

## UJ-028: Postpaid-to-Prepaid Migration
`Explicit` · confidence: `high`

- **Workflow steps (summary):** Agent manually adds 100 Riyal migration fee to final bill, approved by managers -> remaining prepaid balance posts as overpayment in BRM (monetary transfers as credit, non-monetary buckets lost).
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “100 Riyal migration fee applied on the final bill; in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers)”

## UJ-029: Plan Change (Postpaid-to-Postpaid)
`Explicit` · confidence: `high`

- **Workflow steps (summary):** Agent selects new plan/promotion, infers upgrade/downgrade manually from rental value; the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade).
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade)”

## UJ-030: Device Installment (DOI) - Retail and Telesales
`Explicit` · confidence: `high`

- **Actors:** Retail agent, Telesales agent, Fulfilment team, delivery partner
- **Workflow steps (summary):** Retail: portal eligibility check via big data on QID -> WinCash stock check/reservation -> signature pad -> WinCash payment -> Siebel order. Telesales: portal-driven -> delivery-partner confirmation -> CAF generated post-delivery at Open UI. Target DXP flow: identity + DOI validation (EDW) in DXP -> product catalog in DXP -> installment breakdown -> stock validation/reservation and first-installment payment in WinCash -> order auto-created/auto-closed.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “current retail process (portal eligibility via 'big data' logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order) vs. telesales process (portal-driven, delivery-partner confirmation, CAF generated only after delivery/order completion at Open UI)”

## UJ-031: Fixed Line Activation (Business Process Walkthrough)
`Explicit` · confidence: `high`

- **Actors:** Retail/telesales agent, customer, field technician
- **Preconditions:** Location eligibility via external web portal (fiber, indoor 5G, outdoor 5G availability)
- **Workflow steps (summary):** Eligibility check (location + customer/QID clubbed early) -> IPTV/plan selection (triple-play default, IPTV optional/removable) -> number selection (auto-selected for fixed/prepaid) -> appointment booking (pre-selected next slot within SLA cluster) -> installation with exception handling (KID in use, splitter full, BID not mapped).
- **Success conditions:** Installation completed, network activated
- **Exit conditions:** Order cancelled if KID-in-use order task marked unsuccessful; cancellation allowed up to network activation with win-back path
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “Walks through the as-is Vodafone Qatar postpaid Fixed Line service activation journey end to end (location eligibility, KID/Karama ID/Vodafone ID identification, contact/account creation, IPTV/plan selection, number selection, appointment booking)”

## UJ-032: KID-in-Use Exception Handling
`Explicit` · confidence: `high`

- **Workflow steps (summary):** Order created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed; if disputed, order task marked unsuccessful and order cancelled.
- **Exit conditions:** Order task unsuccessful -> order cancelled with no downstream impact
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed”

## UJ-033: Fixed-Line Installation Exception Handling (Splitter Full / BID Not Mapped)
`Explicit` · confidence: `high`

- **Actors:** Field technician, rollout team
- **Workflow steps (summary):** Technician raises WFM child activity -> creates Siebel order task for rollout team -> task closed -> WFM activity closed -> agent notified to re-contact customer; splitter-full extends SLA to minimum 5 days; BID-not-mapped auto-created from UIM data.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “field technician has no Siebel access — raises issues as child activities in WFM, which via integration create Siebel order tasks for the rollout team”

## UJ-034: Instant Activation (Fixed Line, Tablet-only)
`Explicit` · confidence: `high`

- **Actors:** Retail/field Agent (device serial verification)
- **Preconditions:** OpenGate tablet used, KID-CPE mapping valid, dual-play (no OSN) case
- **Workflow steps (summary):** UIM validates KID-to-CPE mapping and device capability, agent verifies device serial, appointment step auto-skipped, flow proceeds directly to CAP signature.
- **Success conditions:** Device activated with CAP signature captured
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Instant activation: available only on the OpenGate tablet (not desktop); UIM validates KID-to-CPE mapping and device capability; agent (not customer) verifies device serial; appointment-booking step is auto-skipped and flow goes straight to CAP signature”

## UJ-035: Self-serve Instant Activation
`Explicit` · confidence: `high`

- **Actors:** Customer (self-service)
- **Preconditions:** Customer classified as standard
- **Workflow steps (summary):** Customer enters parameters directly; system automates the rest for standard customers; restricted to "standard" customers only — non-standard customers get a lead created instead.
- **Success conditions:** Fully automated activation completed
- **Exit conditions:** Non-standard customer diverted to Lead creation
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Self-serve instant activation: fully automated, customer enters parameters directly; restricted to "standard" customers only — non-standard customers get a lead created instead”

## UJ-036: New FWA 5G Indoor Activation (Business Process, ZSP/stock control)
`Explicit` · confidence: `high`

- **Actors:** Agent
- **Preconditions:** Fiber not sellable at location (fiber-first policy), ZSP entry mandatory
- **Workflow steps (summary):** ZSP entry, SIM scanned from WinCash, CPE scanned from UIM as separate stock items, site lock applied to prevent relocation abuse; SIM and CPE are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “For 5G indoor: SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE”

## UJ-037: New FWA 5G Outdoor Activation (Business Process, WFM appointment)
`Explicit` · confidence: `high`

- **Actors:** Agent, WFM field engineer
- **Preconditions:** Fiber not sellable, outdoor equipment feasible
- **Workflow steps (summary):** WFM appointment booked, installation attempted, fallback to indoor or cancellation on failure; requires a WFM appointment (serial scan step skipped since device needs installation).
- **Exit conditions:** Successful outdoor install, or fallback to indoor order update, or cancellation
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “FWA outdoor...requires a WFM appointment (serial scan step skipped since device needs installation); if outdoor install fails (access/glass issues), indoor is offered as fallback or the order is cancelled”

## UJ-038: FWA-to-Fiber Migration
`Explicit` · confidence: `high`

- **Actors:** BI team, business team, fulfillment, agent
- **Preconditions:** Location becomes fiber-covered
- **Workflow steps (summary):** BI report identifies candidates, business team builds candidate list, fulfillment tickets raised, agent calls customer, Open UI order raised, feasibility/ONT/service-point checks redone from scratch, fiber activated first, then 5G disconnected and equipment recovered.
- **Exit conditions:** Fiber activated, 5G equipment recovered
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “actual process is a BI report (by ZSP) → business team candidate list → fulfillment tickets → agent calls customer → Open UI order → full feasibility/ONT/service-point checks redone from scratch → fiber activated FIRST, then 5G disconnected and equipment recovered”

## UJ-039: Home Move (Business Process, fiber/5G matrix)
`Explicit` · confidence: `high`

- **Actors:** Customer (always initiates), agent, WFM
- **Preconditions:** Customer relocating; volume ~300/month
- **Workflow steps (summary):** Customer initiates move; old service stays live until new location provisioned; billing adjusted pro-rata; matrix of fiber/5G × indoor/outdoor combinations; only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket.
- **Exit conditions:** New location provisioned, old service disconnected
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Home moves: matrix of fiber/5G × indoor/outdoor combinations...only fiber-to-fiber has an actual system journey today — everything else is handled as a manual ticket”
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(4) Home Move (FIB-HMV-RTL-004)”

## UJ-040: Transfer of Number (TON) — Claim of Ownership (COO)
`Explicit` · confidence: `high`

- **Actors:** Number's actual user, store agent
- **Preconditions:** Number user is present but registration mismatched to another person
- **Workflow steps (summary):** COO/claim of ownership — only the number's user is present, number registered to someone else, typically caused by an agent SIM-registration mistake.
- **Exit conditions:** Currently on hold, retained for possible resumption (~2 years)
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “COO/claim of ownership — only the number's user is present, number registered to someone else, typically caused by an agent SIM-registration mistake; on hold for ~2 years”

## UJ-041: Transfer of Number (TON) — Third-party on Cancelled ID
`Explicit` · confidence: `high`

- **Actors:** MOI, BI team, eligible user, store agent
- **Preconditions:** Original customer ID cancelled and detected via MOI file
- **Workflow steps (summary):** MOI shares file; BI builds hold-down and invalid-ID tables; bulk notes uploaded to Siebel Open UI monthly; SMS sent to eligible users; user presents physical SIM or eSIM screenshot plus SMS at store.
- **Success conditions:** Number transferred to eligible third party
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “original customer's ID is cancelled (left country or deceased), detected only reactively via MOI file/BI-built hold-down and invalid-ID tables”

## UJ-042: New Postpaid Connection (Retail Channel Activation)
`Explicit` · confidence: `high`

- **Actors:** Retail agent, Customer
- **Preconditions:** Customer holds QID (or eligible ID), passes eligibility/credit/blacklist checks
- **Workflow steps (summary):** Qnomy token issued, ID scan/OCR and MOI validation, eligibility/credit/blacklist checks, plan/device/number/SIM selection, checkout, CAF signature, WinCash payment.
- **Success conditions:** CAF signed, payment completed via WinCash, connection activated
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “walks the postpaid new-connection (activation) journey for the retail channel end to end — Qnomy token, ID scan/MOI validation, eligibility/credit/blacklist checks, plan/device/number/SIM selection, checkout, CAF, and WinCash payment”

## UJ-043: Consumer Prepaid Activation (ECR/Open UI/VSA, multi-channel)
`Explicit` · confidence: `high`

- **Actors:** Direct Sales agent, Mass Market agent, Retail agent, Qatar Visa Center staff, Offshore Airport staff
- **Preconditions:** Valid ID (QID, GCC ID, Passport, Diplomatic ID), age 18+
- **Workflow steps (summary):** Channel-specific ECR/Open UI/VSA activation flows with/without approval workflows, per business rules. Prepaid Onshore channels: Direct Sales (ECR & Open UI), Mass Market (ECR & VSA), Retail (ECR/Open UI desktop). Prepaid Offshore channels: Qatar Visa Center (Integrated System), Offshore Airport (SFTP, VSA).
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Prepaid Onshore channels: Direct Sales (ECR & Open UI), Mass Market (ECR & VSA), Retail (ECR/Open UI desktop). Prepaid Offshore channels: Qatar Visa Center (Integrated System), Offshore Airport (SFTP, VSA)”

## UJ-044: Consumer Postpaid Registration (ECR/Open UI/VSA, multi-channel)
`Explicit` · confidence: `high`

- **Actors:** Direct Sales agent, Retail agent, Offshore Airport staff, Fulfilment
- **Workflow steps (summary):** ECR registration/provisioning process flows, Open UI activation flows with/without approval, VSA flows onshore/offshore, plus issue-handling process (3.3.4). Postpaid Onshore channels: Direct Sales (ECR & Open UI), Retail (ECR). Postpaid Offshore channels: Offshore Airport (VSA).
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Postpaid Onshore channels: Direct Sales (ECR & Open UI), Retail (ECR). Postpaid Offshore channels: Offshore Airport (VSA)...Section 3 "Consumer Mobile Postpaid Registration"”

## UJ-045: Cross Sales to New Fixed Line Activation (not stated)
`Explicit` · confidence: `high`

- **Actors:** Retail/Cross Sales agent, Customer (existing, looked up by QID)
- **Preconditions:** Customer exists in CRM with a targeted campaign offer available (QID Offers grid)
- **Workflow steps (summary):** Home page -> Cross Sales QID entry -> Contact confirmation + Connection Details popup -> QID Offers grid -> Accept offer -> redirect into New Fixed Line journey with QID/KID carried over -> Contact re-confirm -> Address (Service Points) -> Plan (auto-applied, locked) -> Addon & Discount (read-only) -> Number Selection (reserve) -> Book Appointment -> Order validation -> CAF attachment -> Activity comments -> Save and Finish.
- **Success conditions:** "Fixed Line completed successfully. Order Number:- '1-29795175561'" style confirmation; Sales Order created with Status Open, Fulfillment Status In Progress
- **Exit conditions:** Order submitted and awaiting WFM installation completion (Status Context 'INITIATE WFM START: reached')
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “an agent looks up an existing customer by Qatari ID, accepts a pre-targeted campaign offer (a GigaHome Fiber promotion), and is redirected into the guided New Fixed Line activation journey”

## UJ-046: New Fixed Line Activation — Back Office Fulfilment (Skip Attachments) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Back Office Fulfilment agent (Hemanth Kumar), Customer (Vishakan Soundararajan)
- **Preconditions:** Agent has 'Back Office Fulfilment' Siebel responsibility; customer has a Kahramaa ID address record with an available Fixed Line Port/ONT service point
- **Workflow steps (summary):** Contact (KID/QID entry, confirmation, IPTV email popup, attachments skipped) -> Address (select primary Kahramaa address, service point) -> Plan (select promotion) -> Addon & Discount (auto-populated IPTV add-ons/discount) -> Number Selection (reserve free number) -> Book Appointment (cluster, calendar, time slot, warning, success) -> CAF (attachments skipped) -> order submission.
- **Success conditions:** "Fixed Line completed successfully. Order Number:- '1-26921279847'"
- **Exit conditions:** Sales Order created with Order Type Activation, Order Sub Type Triple Play, Status Open, Fulfillment Status In Progress, 13 hierarchical line items generated
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a Vodafone Qatar Back Office Fulfilment agent ("Hemanth Kumar") logging into Siebel Open UI Desktop, launching the "New Fixed Line" guided journey for a residential customer, and driving it end-to-end”

## UJ-047: New Fixed Line Desktop — Triple Play (IPTV Yes), Project Lusail (not stated)
`Explicit` · confidence: `high`

- **Actors:** Sales/fulfilment agent (Project Lusail context), Customer
- **Preconditions:** Agent logs into Siebel Open UI Desktop guided journey
- **Workflow steps (summary):** Login and initiate New Fixed Line desktop guided journey -> Enter KID, QID, Go -> Contact Step (Get IPTV Yes, update details, upload attachment) -> Address -> Plan -> Reserve number -> Book Appointment (cluster, date, comments, slot, submit) -> appointment success -> CAF, Sign Contract with signature -> Activity Comments -> Save and Finish -> Finish Process -> WFM Process -> Serial Number Check Triple Play.
- **Success conditions:** Order in Open Status per document text
- **Exit conditions:** WFM activation and serial number verification (detail not fully recovered from extraction)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41.md): “documenting the New Fixed Line sales journey in Siebel for the Triple Play variant where IPTV is selected as Yes, covering order creation through WFM activation and serial number check”

## UJ-048: Digital Fiber Activation Phase 1 (self-service, Combo Box/CPE or 5G) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Customer (self-service digital channel)
- **Preconditions:** Location entry by KID; plan display driven by RFS eligibility
- **Workflow steps (summary):** Location & Plans (KID entry, plan selection by RFS) -> Locate Your Device (confirm serial number, skipped for Non Prepatched KID) -> eKYC Validation (ID Scan, Selfie Scan) -> Knowing You (email, contact, home number, appointment, eSign) -> Plan & Leads (submit lead) -> Confirmation Page (branches by CPE & Non Prepatched vs Prepatched Combo Box).
- **Success conditions:** Confirmation page reached; for CPE/ONT routed to Vodafone FF to fulfil, for 5G routed as lead to Vodafone
- **Exit conditions:** Failure/incomplete cases captured as leads ("Will be collected as a lead")
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “a self-service digital flow for activating fixed-line fiber service (Combo Box/CPE or 5G), covering location/plan selection, device/eKYC validation, contact and appointment capture, lead submission, confirmation”

## UJ-049: New Fixed Line Tablet — Prepatched KID, Combo Box, Normal Activation (with Manager Approval and Correction cycle) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Front-line tablet agent (HALEEMI), Customer (YAM POKHAREL), Team Manager/Approver (Test Manager / MANAGETEST)
- **Preconditions:** Kahramaa ID with a prepatched Combo Box CPE/ONT already installed at customer's premises
- **Workflow steps (summary):** Home dashboard -> New Fixed Line Tablet tile -> Contact (KID entry) -> device-detection dialog choose Normal Activation -> Contact ID capture and confirm -> Address/Service Points -> Plan -> Addon & Discount -> Number Selection (reserve) -> Book Appointment (cluster, calendar, slot, warning, success) -> CAF preview and e-signature -> Activity comments -> Save and Finish -> order submitted -> Manager assigns self via TM SR Queue -> reviews Attachments/Order Details -> Reject - Correction with reason -> SMS notification -> agent re-opens Order Correction, re-uploads ID images -> resubmits -> back to Manager queue.
- **Success conditions:** "Fixed Line completed successfully. Order Number:- '1-29795175561'"; downstream Manager approval flow demonstrated to Reject step (approval outcome after correction not shown in this doc)
- **Exit conditions:** Order rejected for correction ('ID image not clear'), SMS sent to agent's queue via OSB, order corrected and resubmitted for approval
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Shows a Vodafone Qatar front-line agent (Open UI on tablet) how to sell and provision a Fixed Line "Triple Play" service... using the Normal Activation path... It also documents the downstream Team Manager order-approval step, a reject/correction cycle”

## UJ-050: New Fixed Line Tablet — Prepatched KID, Non Combo Box, Normal Activation (full lifecycle incl. approval) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Front-line tablet agent (HALEEMI), Customer (SALLY ENCUNADO), Team Manager/Approver (Test Manager / MANAGETEST)
- **Preconditions:** Kahramaa ID is Prepatched, Non Combo Box (single dwelling/dedicated ONT service point)
- **Workflow steps (summary):** Contact (KID entry, backend Prepatched confirmation) -> ID capture (Qatari ID) -> confirm details -> communication prefs & ID images -> Address/Service Points -> Plan -> Addon & Discount -> Number Selection (reserve) -> Book Appointment -> CAF generation, e-signature -> Activity/Comments -> Save and Finish -> order visible in My Pending Approval Orders -> Manager assigns self, reviews, Reject - Correction with reason (Original QID was not captured) -> order shown Rejected to agent -> Order Correction journey (Contact, CAF re-attach, Activity) -> resubmit -> back to Pending Approval -> Manager re-queues, second review shows only Approve/Reject-Drop Order -> Approve Order with acknowledgment -> backend SMS confirms approval.
- **Success conditions:** "Fixed Line completed successfully. Order Number:- '1-29795232313'" then, after correction cycle, "is now approved" SMS confirmation
- **Exit conditions:** Order fully approved (terminal state) after one reject-correction round-trip
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “walks through the full flow: contact/ID capture, address & service-point confirmation, plan selection, add-ons, number reservation, appointment booking, CAF (Customer Application Form) generation and e-signature, order submission, manager approval (including a reject-for-correction round-trip), and backend confirmation via SMS”

## UJ-051: Order Correction (reject-and-resubmit) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Front-line tablet agent
- **Preconditions:** Order has been Rejected - Correction by a Manager with a specific reason
- **Workflow steps (summary):** Agent navigates via Order Correction tile -> Contact step reopens (locked fields greyed, flagged fields re-required) -> CAF re-attach step (Proof of Employment, CAF, Supplementary Form, Add File) -> Activity comments -> Save and Finish.
- **Success conditions:** "Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval"
- **Exit conditions:** Order returns to Pending Approval queue for Manager re-review
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Clicking through opens a dedicated "Order Correction" guided journey... Step "1. Contact" re-opens with the same confirmed details... plus the two Qatari ID images already green/verified”

## UJ-052: GigaHome Subscription Acceptance Form (customer sign-off before activation, v3) (not stated)
`Explicit` · confidence: `high`

- **Actors:** Customer, DSA/Store/Field Engineer (sales channel attribution)
- **Preconditions:** Customer has selected a GigaHome 5G Home Plan (speed tier, bill cycle, discount)
- **Workflow steps (summary):** Agent/channel presents 18 numbered T&C clauses (billing, fees, speed, FUP, lock-in, install address, router placement, Fibre migration policy, personal-use restriction, complaints) -> customer reviews bilingual EN/AR form -> customer signs with Name, QID, Signature, Date.
- **Success conditions:** Form signed by customer with QID and date before service activation
- **Exit conditions:** Signed form filed/attached (likely as Supplementary Form in the Fixed Line/FWA order's CAF attachment set)
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “18-clause acceptance form recovered as the source of this journey during Stage K re-mining (was empty in original Stage A synthesis)”

## UJ-053: New Fixed Line Tablet — Prepatched KID, Combo Box, Instant Activation (New Fixed Line Tablet)
`Explicit` · confidence: `high`

- **Actors:** Tablet field agent (VINODHINIR)
- **Preconditions:** Kahramaa ID already has a pre-patched Combo Box CPE/ONT device registered at the service point
- **Workflow steps (summary):** Kahramaa ID lookup -> device detection dialog -> Instant Activation chosen -> ID capture/contact fields -> Address/Service Point confirmed -> Plan selection (GigaHome 5Gbps) -> Addon/Discount (skipped) -> Number reservation -> CAF generation, e-signature -> Activity comment -> Save and Finish -> Order created and completed without appointment.
- **Success conditions:** Order status Open->Complete within minutes; all backend line items and installed assets reflect Combo Box device tagging
- **Exit conditions:** Agent may cancel order at CAF step (Cancel Order button)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Fixed Line completed successfully. Setup and test at customer location.. Order Number:- '1-29792357564'"”

## UJ-054: New Fixed Line Tablet — Prepatched KID, Combo Box, B2B2C, With Approval, Instant Activation (New Fixed Line Tablet (B2B2C + Approval))
`Explicit` · confidence: `high`

- **Actors:** Tablet field agent (HALEEMI), Manager/Approver (Test Manager / MANAGETEST)
- **Preconditions:** Pre-patched Combo Box device detected at Kahramaa ID; customer is a B2B2C employee of a sponsoring company (SIPT)
- **Workflow steps (summary):** Contact/Kahramaa lookup -> device detection -> Instant Activation -> B2B2C employer selection -> address/service point confirmation -> plan selection -> number reservation -> CAF generation/e-signature/attachments (incl. Proof of Employment) -> activity comment and submission -> order routed to manager approval queue -> manager assigns to self, reviews attachments/details, approves with comment -> order Pending->Open->fulfillment In Progress->Complete.
- **Success conditions:** Manager approves order; order status progresses Pending->Open->Complete with Fulfillment Status Complete
- **Exit conditions:** Manager could alternatively reject (not exercised in this walkthrough)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Overall flow: Contact/Kahramaa lookup → pre-patched KID/ComboBox device detection → Instant Activation choice → B2B2C employer (SIPT) selection...→ order status Pending → Open → fulfillment In Progress → Complete"”

## UJ-055: New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction (New Fixed Line Tablet (Normal Activation + Reject/Correct))
`Explicit` · confidence: `high`

- **Actors:** Tablet field agent (HALEEMI), Manager/Approver (Test Manager/MANAGETEST)
- **Preconditions:** Combo Box device detected; agent chooses Normal Activation (requires scheduled appointment)
- **Workflow steps (summary):** Contact/Kahramaa lookup -> device detection -> Normal Activation chosen -> address/service point -> plan -> addon/IPTV addon -> number reservation -> Book Appointment (slot 8AM-11AM, appointment ID 14241) -> CAF/e-signature -> activity comment -> order submitted -> lands in manager approval queue -> manager rejects with reason 'ID image not clear' and comment -> SMS sent to agent -> agent re-enters via dedicated Order Correction tile -> re-uploads ID images -> order remains Open in back-office view.
- **Success conditions:** Order corrected and resubmitted after rejection; order reaches Open status with audit trail
- **Exit conditions:** Manager can Reject-Correction, Reject-Drop Order, or Approve
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Tablet agent (HALEEMI) builds a Fixed Line 'Normal Activation' Triple Play order on a Combo Box device → order... submitted and lands in 'Submitted for Approval'/Pending status → a Test Manager persona picks it up... rejects it via 'Reject - Correction'... agent re-enters the flow via a dedicated 'Order Correction' tablet tile"”

## UJ-056: New FWA Indoor Activation — Desktop Vanilla (Manual) (New FWA (Vanilla Desktop))
`Explicit` · confidence: `high`

- **Actors:** Desktop CRM agent
- **Preconditions:** New or existing contact; FWA Indoor plan and CPE inventory available
- **Workflow steps (summary):** Contact creation with Mobile Eligibility check -> Address/Zone assignment -> Account auto-generated -> Sales Order auto-created (Pending) -> Catalog plan selection (GigaHome 5G Classic New Indoor FWA Promotion) -> Line Items expand -> Number reservation -> Notification Contact linked -> FMS CPE Bundle configuration (Indoor IDU selected, serial entered) -> Submit -> Order Open->In Progress->Complete.
- **Success conditions:** Order status progresses to Complete with Fulfillment Status Complete ('All order lines are completed')
- **Exit conditions:** Not explicitly documented (no cancel/drop path shown)
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “a desktop, Vanilla-Open-UI (manual, non-wizard) end-to-end walkthrough of activating a new FWA (Fixed Wireless Access) Indoor connection — from opening the Open UI Desktop home screen through submitting and completing the sales order”

## UJ-057: New FWA Outdoor Dual Play Activation with WFM Installation (Desktop Vanilla) (New FWA Outdoor + WFM)
`Explicit` · confidence: `high`

- **Actors:** Desktop CRM agent (KARTHIKK), Field technician (Syed Irfan), Dispatcher/back-office WFM user
- **Preconditions:** New contact/account created; FWA Outdoor Dual Play plan and CPE/SIM inventory available for transfer
- **Workflow steps (summary):** Contact/Account/Order creation -> Line items added -> Number reservation -> Ship-to address set -> Book Appointment (WFM slot selection) -> CPE serial entry (Indoor/Outdoor) -> Order submitted (Open) -> WFM Activity created and possibly reassigned via Move -> Inventory transferred to technician -> Technician starts activity, performs Assess Activity/Serial Number Check/Service Activation -> Installation Checklist completed with customer signature -> Activity ended -> Order Complete -> billing buckets confirmed active.
- **Success conditions:** Order status Complete, SIM State Active, live data buckets provisioned
- **Exit conditions:** Appointment reschedule/technician reassignment possible mid-flow (Move dialog); not a hard failure path
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"A screenshot-driven, click-through training document showing a CRM agent how to manually create and submit a Fixed Wireless Access (FWA) Outdoor 'Dual Play' sales order end-to-end — from account/contact creation through number reservation, WFM... appointment booking, CPE/SIM inventory transfer to a field technician, and the technician's on-site installation activity"”

## UJ-058: Modify FWA Indoor CPE Serial Number (Modify CPE (FWA Indoor))
`Explicit` · confidence: `high`

- **Actors:** CSR/agent (KARTHIKK)
- **Preconditions:** Customer account has an active FWA Indoor CPE asset with an incorrect/needs-update serial number
- **Workflow steps (summary):** Locate account -> select Installed Asset (FMS CPE Bundle) -> click Modify -> drill into FMS CPE Indoor IDU details -> edit Indoor Unit Serial Number -> system generates Modification-type Sales Order -> order Pending->Open->Complete with attribute change tracked as Update action.
- **Success conditions:** Modification order completes (Status Complete, Fulfillment Status Complete) with attribute-level audit of the serial number change
- **Exit conditions:** Agent can Cancel from the modify screen (Save/Cancel/Done/Finish It/Verify buttons)
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Shows a CSR/agent how to manually modify an installed FWA (Fixed Wireless Access) Indoor CPE asset's attributes — specifically correcting the Indoor Unit Serial Number"”

## UJ-059: FWA Address/SIM/CPE/CAF Negative Validation Scenarios (FWA Negative Scenarios)
`Explicit` · confidence: `high`

- **Actors:** Field/tablet or desktop agent (implied, not named)
- **Preconditions:** Agent is progressing through New FWA Tablet or New FWA/FWA Postpaid Business journey
- **Workflow steps (summary):** Address step validation failures (blank fields, non-numeric/oversized Building No./Street No., Skip Address option) -> SIM Serial step validation failures (blank, wrong length, not found in UIM, already assigned, CPE not free in UIM with raw backend exception) -> CAF/Supplementary Form step validation failure (mandatory form not selected).
- **Success conditions:** N/A — this documents failure/error states, not a completed order
- **Exit conditions:** Go back / Cancel / Skip Address / Abandon Order options available depending on step
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Documents the validation and error-handling behavior encountered while activating an FWA... order in the CRM's Open UI — specifically what happens on the Address step, the SIM/CPE (UIM inventory) validation step, and the CAF/Supplementary Form step when required data is missing, malformed, or fails backend inventory checks"”

## UJ-060: New FWA Indoor Postpaid Activation — Desktop Guided Wizard (Existing Mobile Customer) (New FWA (Guided Wizard Desktop))
`Explicit` · confidence: `high`

- **Actors:** Desktop CRM agent (KARTHIKK)
- **Preconditions:** Existing Vodafone Qatar mobile customer (has active Postpaid mobile line) adding a new FWA Indoor line
- **Workflow steps (summary):** Customer lookup via Qatari ID -> Connection Details popup shown (existing postpaid plan) -> Contact fields completed, attachment uploaded -> Address entered -> Plan selection (GigaHome 5G Classic New Indoor FWA Promotion) -> Addon/Discount (pre-listed discount) -> Number reservation via Block+Reserve -> SIM Serial/CPE Serial entry -> Book Appointment step auto-saved without detail -> CAF generated (Digital/Manual/Touch Screen options), signed -> Order submitted -> Order Complete -> post-activation verification via Account/Installed Assets/Billing Profile.
- **Success conditions:** Order Status Complete, Fulfillment Status Complete; new FWA line and its data buckets show Active in Customer Portal
- **Exit conditions:** Abandon Order button available on CAF step
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"Shows a CRM agent... how to sell and activate a new Fixed Wireless Access (FWA) Indoor postpaid broadband/home-phone line for an existing Vodafone Qatar mobile customer, end-to-end, using the 'New FWA' guided-wizard entry point"”

## UJ-061: New FWA Postpaid Outdoor Order (Desktop, WFM installation) (New FWA (Outdoor, Desktop, WFM))
`Explicit` · confidence: `high`

- **Actors:** Retail/Sales Agent (KARTHIKK), Field Technician (initially ABATS pool, reassigned to Syed Irfan), Customer (ABUBAKAR NAZIR)
- **Preconditions:** Customer identified by Qatari ID; plan GigaHome Premium OD New 5G FWA Promotion available; technician inventory loaded via Excel/OFSC import
- **Workflow steps (summary):** Home > New FWA tile > Contact (Qatari ID lookup) > Address > Plan (GigaHome Premium OD New 5G FWA Promotion) > Addon & Discount > Number Selection > (steps saved) > Book Appointment > CAF digital signature > Activity/comments > order submitted > technician inventory loaded (Excel/OFSC) > appointment moved to technician Syed Irfan > inventory transferred > technician starts route/activity > geolocation > Kahramaa check > Serial Number Check (Dual Play) > Service Activation Success > Installation Checklist > End Activity > order verified Complete with Active assets and live data bucket.
- **Success conditions:** Sales Order reaches Status Complete, Fulfillment Status Complete; all line items Complete; Installed Assets Active; SIM/data bucket Active and provisioned
- **Exit conditions:** WFM technician ends activity with signed checklist and customer signature
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Order Number:- '1-29728035948'... Sales Order Complete, all line items and installed assets Active, data buckets live, WFM installation activity ended with signed checklist and customer signature.”

## UJ-062: New FWA Tablet Indoor B2B2C Order with Manager Approval (New FWA Tablet (Indoor, B2B2C))
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (VINODHINIR), Approver/Test Manager, Customer (MAN KAMI)
- **Preconditions:** Existing customer with Qatari ID; B2B2C company name attached; SIM/CPE serials validated in UIM
- **Workflow steps (summary):** Contact > Address > Plan (GigaHome 5G Classic New Indoor) > Addon & Discount > Number Selection (FL number only) > SIM Serial (with negative-path UIM validation errors) > Book Appointment (saved) > CAF & Additional Attachments (Proof of Employment, CAF, Supplementary Form, Add File) > Activity/comments > Save and Finish > order submitted for approval > Manager reviews Attachments/Order Details/Activities/Agents Details tabs > Approve > order completes, assets provisioned Active.
- **Success conditions:** Order Approved and reaches Status Complete/Fulfillment Complete; Installed Assets Active; Employer/Special Management fields populated
- **Exit conditions:** Approver clicks Approve with confirmation and comments; activity closed as Approved
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Your activation request order number: 1-29727615763 is submitted for approval... Approve... order Complete, Fulfillment Status Complete... Products and Services grid populates with 9 active asset rows”

## UJ-063: New FWA Tablet Indoor with Manager Approval (2+ postpaid connections trigger) (New FWA Tablet (Indoor, With Approval))
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Test Manager (approver), Customer (SELBATH JAMALUDEEN)
- **Preconditions:** Customer already has 2+ postpaid connections (Connection Details advisory shown)
- **Workflow steps (summary):** Contact (ID lookup, Connection Details advisory) > Address > Plan (GigaHome 5G Classic New Indoor) > Addon & Discount > Number Selection > SIM Serial (multiple UIM validation failures then success) > CAF generation and e-signature > Supplementary Form required and uploaded > Activity/comments > Save and Finish > order submitted for approval ("1-29721641460") > Manager logs in, TM SR Queue View, Assign To Me > reviews Attachments/Order Details > Approve with confirmation dialog and comments > order Complete, assets Active.
- **Success conditions:** Manager Approves order; order and line items reach Complete; FWA assets Active with live usage buckets
- **Exit conditions:** Approval decision logged in Activities History as Approved/Rejected
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Your activation request order number: 1-29721641460 is submitted for approval... Activities History tab confirms outcome... Status Closed, Order Approval Approved”

## UJ-064: New FWA Tablet Indoor Without Approval (2+ postpaid connections, advisory only) (New FWA Tablet (Indoor, Without Approval))
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Customer (SELBATH JAMALUDEEN)
- **Preconditions:** Customer already has 2 existing postpaid connections
- **Workflow steps (summary):** Contact (ID lookup, Connection Details advisory shown but not enforced) > Address > Plan > Addon & Discount > Number Selection > SIM/CPE Serial > CAF generation, e-signature (agent countersigns) > CAF & Supplementary Form attached > order submitted directly to Complete status with no approval queue interaction.
- **Success conditions:** Order and all line items reach Status Complete/Fulfillment Complete without approval gating
- **Exit conditions:** Order submission completes directly; Approved checkbox left unchecked
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “no approval request, approval queue, or manager sign-off screen appears anywhere in the 18 captured screens... order still reaches Status: Complete / Fulfillment Status: Complete”

## UJ-065: New FWA Tablet Outdoor B2B2C Order Creation (New FWA Tablet (Outdoor, B2B2C))
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Customer (MAHENDRAN GANESAN), sponsoring company (TestVQW)
- **Preconditions:** Customer ID scanned/verified; B2B2C sponsoring company selected
- **Workflow steps (summary):** Contact (Qatari ID scan, Connection Details) > Company Name (B2B2C) selection > Address > Plan (GigaHome Premium OD New 5G FWA Promotion) > Addon & Discount > Number Selection > SIM Serial > Book Appointment (calendar, warning, confirmation) > CAF & Additional Attachments (Proof of Employment, CAF, Supplementary Form all required) > e-signature > Activity/comments > order submitted.
- **Success conditions:** Sales order created in Open/In Progress status tied to a scheduled installation appointment; account tagged Special Management B2B2C
- **Exit conditions:** Order submitted with success message "Postpaid completed successfully"; installation not yet performed (order remains Open/In Progress pending WFM fulfillment)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “"Postpaid completed successfully. Order Number:- '1-29724796848'"... New FWA Outdoor B2B2C sales order 1-29724796848 created successfully in "Open" / "In Progress" status”

## UJ-066: New FWA Tablet Outdoor Order through WFM Field Installation (New FWA Tablet (Outdoor, WFM))
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Field Technician (Syed Irfan), Customer (NARAYAN MANJHI)
- **Preconditions:** Customer identified via Qatari ID; technician inventory pre-loaded via Excel/Field Service Import
- **Workflow steps (summary):** Contact > Address > Plan (GigaHome Premium OD New 5G FWA Promotion) > Addon & Discount > Number Selection > SIM Serial > Book Appointment (scheduled or unscheduled) > CAF & Additional Attachments (CAF + Supplementary Form) > e-signature > order submitted (Open/In Progress) > WFM inventory loaded (Excel import) > appointment moved to technician > inventory transferred > technician starts route/activity, GPS > Kahramaa check > Serial Number Check - Dual Play > Service Activation submitted/Success > Install Inventory (SNC) > Installation Checklist > End Activity > order flips to Complete, assets Active, buckets live.
- **Success conditions:** Order reaches Status Complete/Fulfillment Complete; Installed Assets all Active; data buckets live
- **Exit conditions:** Technician ends activity after Serial Number Check, Service Activation Success, Installation Checklist, and customer signature
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “CRM order after completion (image51): Order 1-29724275746 now shows Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed"”

## UJ-067: Home Move Fixed-to-Fixed Happy Path (Guided Journey, Open UI Desktop) (Home Move Happy Path)
`Explicit` · confidence: `high`

- **Actors:** Retail/Sales Agent, Supervisor (WFM), Field Technician, Customer
- **Preconditions:** New location (KID) must be Fiber-ready; existing Fixed Number identified
- **Workflow steps (summary):** Enter KID and check Fiber-ready > enter Fixed Number > Contact Portal details > verify Address > Free Home Move eligibility check (if first-time) > Book Appointment (Cluster, slot, warning) > Activity Portal comments (>5 chars) > Save and Finish > order created in Open status > WFM: search by Appointment ID > verify ONT in UIM > Move to assign technician > technician logs in, Activate Route > Start > geolocation > Assess Activity (KID eligibility check) > Inventory Transfer from Supervisor to technician > Serial Number Check (ONT) > Service Activation Success > Home Move Checklist > End with signature > Order Complete.
- **Success conditions:** Order reaches Complete status after WFM installation activity ends with signature
- **Exit conditions:** Technician clicks End and Submit with signature capture; Order Complete
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click End and Submit (with signature capture); Order Complete.”

## UJ-068: Cross Sales MNP Postpaid Conversion (Desktop) (Cross Sales - MNP Postpaid)
`Explicit` · confidence: `high`

- **Actors:** Retail/Sales Agent, Customer (VISHAKAN SOUNDARARAJAN)
- **Preconditions:** Contact has an existing 'New MNP' cross-sales offer in Offered status
- **Workflow steps (summary):** Contact's Cross Sales Offers tab > Accept "New MNP" offer > MNP Postpaid guided journey launches: Contact (confirm details, Connection Details modal) > Address > Billing (existing Postpaid billing profile shown) > SIM Serial (entered/validated) > Plan (promotion loading, Bill Limit/Credit Limit shown) — remaining steps (Donor Details, Donor Attachment, CAF, Activity) not captured.
- **Success conditions:** Not fully captured — document ends mid-flow at Plan/promotion confirmation modal (Step 5 of 9)
- **Exit conditions:** Not captured in this document (walkthrough stops before Donor Details/CAF/Activity steps)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Agent is viewing contact... Cross Sales Offers grid... Accept clicked on "New MNP" offer... MNP Postpaid guided journey launches”

## UJ-069: MNP Postpaid Port-In (Desktop, Ooredoo to Vodafone) (Switch as Postpaid)
`Explicit` · confidence: `high`

- **Actors:** Retail Sales Agent (Hemanth Kumar)
- **Preconditions:** Agent has VFQA Sales responsibility assigned; customer has valid Qatari ID
- **Workflow steps (summary):** Contact (Qatari ID lookup) -> Address -> Billing -> SIM Serial -> Plan (Bill Limit validation) -> Donor Details -> Donor Attachment (MNP form + e-signature) -> CAF (CAF form + e-signature) -> Sales Order submitted.
- **Success conditions:** Sales Order created (Order Type Activation, Sub Type Port-In, Status Pending) with full line-item breakdown
- **Exit conditions:** Order can also be dropped/cancelled via Drop Order/Cancel Order toolbar actions
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “running the 'MNP' guided process end-to-end for a customer porting a number in from Ooredoo to Vodafone Qatar on a Postpaid plan”

## UJ-070: MNP Postpaid Port-In with Add-on (Tablet, HRN/Expatriate customer) (MNP Tablet Postpaid)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (HALEEMI HALEEMI)
- **Preconditions:** Customer is expatriate with Passport ID; donor operator Qtel
- **Workflow steps (summary):** Contact -> Address (skipped) -> SIM Serial -> Plan (Postpaid Extra Promotion) -> Addon & Discount (International 50 add-on selection) -> Donor Details -> Donor Attachment (MNP form/signature) -> CAF (form/signature) -> Activity (comments) -> Save and Finish.
- **Success conditions:** Confirmation 'MNP completed successfully. Order Number: 1-29822004764'; order visible in My Sales Orders with Status Open, Fulfillment In Progress
- **Exit conditions:** Not explicitly stated (no reject/abandon shown in this run)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “an agent ... porting a Postpaid HRN (non-Qatari resident, Nepalese, Passport ID) customer's number from Ooredoo (Qtel) to Vodafone, adding an 'International 50' paid add-on, and completing the order end to end”

## UJ-071: MNP Prepaid Port-In (Tablet) (Switch as Prepaid)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Bhargavi Sathiya Moorthy)
- **Preconditions:** Customer ID (Qatari ID or Passport) available; MOI Validation succeeds
- **Workflow steps (summary):** Contact (ID lookup, MOI Validation) -> SIM Serial (with number reservation check) -> Plan (Prepaid Red Promotion) -> Donor Details -> MNP Application Form + e-signature -> Donor Attachment -> CAF (Prepaid Customer Application Form) + e-signature -> Activity (comments) -> Save and Finish.
- **Success conditions:** 'MNP completed successfully. Order Number: 1-23864057846'; Order visible in My Sales Orders, Status Open
- **Exit conditions:** Cancel Order button available at MNP form / CAF stage
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Demonstrates the end-to-end agent flow ... for porting a customer's mobile number ... into a new Vodafone Prepaid subscription (MNP Prepaid)”

## UJ-072: Create Lead - Fixed/Home Service with Manager Reject (Create Lead / Manage Lead)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Manager/Approver (Test Manager)
- **Preconditions:** Agent has access to New Lead Tablet tile
- **Workflow steps (summary):** Agent fills Create a Lead form (Mobile Number, Service Needed=Home, Fixed Pre-sales, Preferred Time, address) -> Lead created -> appears in My Leads/My Created Leads -> Manager opens Manage Leads > My Team's Leads -> opens lead -> clicks Reject -> selects Reject Reason Code + Comment -> submits.
- **Success conditions:** n/a (this run ends in rejection, not conversion)
- **Exit conditions:** Lead Status becomes Rejected; Reject button disabled; visible as Rejected in agent's My Created Leads view
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “an agent creates the lead via the 'New Lead Tablet' tile ... a separate Manager/Approver persona reviews the lead under Manage Leads and rejects it with a reason code and comment”

## UJ-073: Create Lead (Mobile Number) with Owner Reassignment (Create Lead / Manage Lead)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (Hemanth Kumar), Retail Store Manager (Test Manager), reassigned Retail Agent (VINODHINIR)
- **Preconditions:** Mobile number entered; Service Needed selected (Postpaid)
- **Workflow steps (summary):** Create a Lead (Mobile Number, Service Needed) -> Lead created -> agent edits Description, sets CallBack Date/Time, changes Lead Status/Sub Status -> visible in My Leads -> Manager opens Manage Leads > My Team's Leads -> opens Lead Owner picker -> reassigns to VINODHINIR.
- **Success conditions:** Lead Owner field updated to VINODHINIR across both agent and manager views; Created By preserved as HEMANTH
- **Exit conditions:** Not explicitly stated
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Shows a Retail Agent ... creating a new sales Lead from a customer's mobile number ... a Retail Store Manager ... reassigns (changes the Lead Owner) to another Retail Agent”

## UJ-074: Lead Creation, Edit, and Owner Change (full lifecycle across 4 personas) (Create Lead / Manage Lead / Owner Change)
`Explicit` · confidence: `high`

- **Actors:** Agent (Hemanth Kumar), Manager (Test Manager), new Owner Agent (VINODHINIR), Back-office/Admin (KARTHIKK)
- **Preconditions:** Contact SAHID ANSARI exists with no prior leads
- **Workflow steps (summary):** Agent creates lead (Mobile Number, Service Needed=Plan upgrades) -> Lead Status New -> agent sets CallBack Date/Time (auto -> In Progress/Call Back) -> Manager changes Service Needed to Pre to Post and reassigns Lead Owner via picker -> lead disappears from prior owner's My Leads but stays in My Created Leads -> new owner edits Description -> Admin views lead org-wide under All Leads with Reject/Retire options.
- **Success conditions:** Final state: Lead Num 1-DO7II8B, Service Needed Pre to Post, Description 'Test1234', Owner VINODHINIR, Created By HEMANTH (unchanged)
- **Exit conditions:** Not explicitly stated (lead remains In Progress at end of walkthrough)
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Demonstrates ... the end-to-end lifecycle of a lead: creating a new lead from a contact/mobile number, editing lead fields ..., reassigning (Owner Change) the lead to a different agent, and verifying the reassignment from three different user roles”

## UJ-075: Tablet Lead Creation with Fixed Pre-Sales and Edit (Create Lead / Lead Edit)
`Explicit` · confidence: `high`

- **Actors:** Agent (VINODHINIR VINODHINIR)
- **Preconditions:** Mobile number matches an existing Contact (Tamer Abdelhalim)
- **Workflow steps (summary):** Create a Lead (Mobile Number, Service Needed=Home) -> Fixed Pre-sales=Yes triggers Preferred Time picker + address fields -> form submitted -> Lead Details View shown attached to existing contact -> agent edits Service Needed to MNP and Description to 'MNP from Home'.
- **Success conditions:** Lead Num 1-DO7AF7D shows Service Needed MNP, Description 'MNP from Home' persisted on Contact's Leads sub-tab
- **Exit conditions:** Not explicitly stated
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “how a Vodafone Qatar agent creates a new Lead ... marks it as Fixed Pre-Sales = Yes ... confirms lead creation, then locates that same lead ... and edits it - changing Service Needed from 'Home' to 'MNP'”

## UJ-076: Passport to QID Update (Passport to QID Update (Passport))
`Explicit` · confidence: `high`

- **Actors:** Agent (unnamed)
- **Preconditions:** Customer has MSISDN and Passport Number on file; obtains new QID
- **Workflow steps (summary):** Login and select Passport to QID Journey -> enter MSISDN & Passport Number, Go -> enter QID Number, Update ID -> customer details fetched via MOI Validation -> scan/upload QID Front & Back -> Continue -> Identification number change form generated -> customer signs contract -> Done -> signature captured in form -> Done -> form attached -> Finish.
- **Success conditions:** Form attached and journey finished (step 9: Finish)
- **Exit conditions:** Not stated
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Documents the guided journey for updating a customer's identification from Passport to QID (Qatar ID) on the Open UI Tablet interface, from login through form generation and customer signature capture”

## UJ-077: Cross Sales to New Postpaid Activation (Existing Customer)
`Explicit` · confidence: `high`

- **Actors:** Retail/CRM agent (existing customer)
- **Preconditions:** Existing customer identified by Qatari ID; account already has installed assets/services
- **Workflow steps (summary):** Contact (Qatari ID) -> Connection Details/credit warning -> Cross Sales Offers (Accept/Interested/Reject/Close) -> handoff to Postpaid wizard: Contact confirm -> Address -> Account -> Billing -> Number Selection -> SIM Serial -> Plan -> Payment -> CAF -> Activity -> Order Complete.
- **Success conditions:** Order Complete, e.g. "Postpaid completed successfully. Order Number:- '1-225217281463'"
- **Exit conditions:** Agent can Reject/Close offer instead of accepting; also produces a linked Modification order adding add-on to existing line
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Cross Sales journey run against an existing customer... surfaces system-generated offers... accepting the offer hands off into the standard New Postpaid provisioning wizard”

## UJ-078: Vanilla New Postpaid Sales Order with Bill Limit Configuration (Desktop)
`Explicit` · confidence: `high`

- **Actors:** VFQA Sales-responsibility agent; System Administrator (admin config)
- **Preconditions:** Bill Limit Mobile Plus Agent Minimum Value configured via admin screen
- **Workflow steps (summary):** Admin raises Bill Limit Mobile Plus Agent Min Value to 80 -> New Sales Order created -> Catalog search/add Postpaid U Plus Promotion -> Customize Mobile Service Bundle -> set Bill Limit (SL Limit Amount 75) -> Validate -> blocking error.
- **Success conditions:** Not reached in this walkthrough — ends in a blocking validation error
- **Exit conditions:** Order Validate fails: "Bill Limit can not be set lower than Agent Minimum 80", order remains Pending
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “a full new Postpaid sales order build for a customer (catalog selection of the Postpaid U Plus Promotion, bundle line-item breakdown, and Bill Limit customization), which is used to demonstrate the validation error”

## UJ-079: Retail New Postpaid Edit Bill Limit (Open UI Desktop)
`Explicit` · confidence: `medium`

- **Actors:** VFQA Sales-responsibility agent
- **Preconditions:** Agent editing bill limit during New Postpaid journey
- **Workflow steps (summary):** Not fully recovered from screenshots; textual notes only describe the two validation branches.
- **Success conditions:** Entering bill limit above Agent minimum value allows journey to proceed
- **Exit conditions:** Entering below Agent minimum value implies rejection/blocking (exact message not recovered)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “Documents the Edit Bill Limit behavior within the Retail New Postpaid journey on the Open UI Desktop interface, for a user with the VFQA Sales responsibility”

## UJ-080: New Postpaid Activation for HRN Customer with Credit Limit Edit (Desktop)
`Explicit` · confidence: `high`

- **Actors:** Open UI Desktop CRM agent (KARTHIKK KARTHIKK)
- **Preconditions:** Existing customer flagged HRN (High-Risk Nationality, e.g., Nepalese)
- **Workflow steps (summary):** Contact (Qatari ID) -> Connection Details/HRN advance payment notice -> Address -> Billing -> Number Selection/Reserve -> SIM Serial -> Plan selection -> Edit Credit Limit (800->1000) -> Payment -> CAF (CAF-Digital/Manual/Touch Screen) -> Sign Contract -> Order created.
- **Success conditions:** Order created, Status Pending (Order # 1-29819206680), Credit Limit override to 1000 persisted to account
- **Exit conditions:** Not stated (walkthrough ends at Pending order)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “processing a New Postpaid activation for an existing customer whose account is flagged (HRN) Customer... demonstrating where the system auto-populates a default pre-approved credit limit and how the agent can override/edit that credit limit”

## UJ-081: New Postpaid, B2B2C, With Approval (Tablet)
`Explicit` · confidence: `high`

- **Actors:** Retail agent; Manager/Approver (Test Manager)
- **Preconditions:** Customer linked to a Company (B2B2C) during Contact step
- **Workflow steps (summary):** Contact (Qatari ID) + Company Name selection -> Address -> Plan -> Addon & Discount -> Number Selection/Reserve -> SIM Serial -> CAF generation/signature -> Attachments (Proof of Employment) -> Activity comment -> Save and Finish -> submitted for approval -> Manager assigns to self -> reviews Attachments/Order Details/Activities/Agents Details -> Approve -> Order Open (In Progress) -> Complete.
- **Success conditions:** Order status Complete, Fulfillment Status Complete, "All order lines are completed"
- **Exit conditions:** Manager can Reject - Correction or Reject - Drop Order instead of Approve; ReAssign To Queue also available
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “documents the 'With Approval' variant of the B2B2C New Postpaid flow, from Contact capture through to a Manager approving the order in a separate Order Approval queue and the order reaching Complete/Fulfilled status”

## UJ-082: New Postpaid, B2B2C, Without Approval (Tablet)
`Explicit` · confidence: `high`

- **Actors:** Retail agent
- **Preconditions:** B2B2C customer linked to sponsoring company; account not previously flagged with Special Management requiring approval
- **Workflow steps (summary):** Contact (Qatari ID) + Company selection -> Address -> Plan -> Addon & Discount -> Number Selection/Reserve -> SIM Serial -> CAF generation/signature -> Attachments (Proof of Employment mandatory) -> Activity comment -> Save and Finish -> Order Complete immediately.
- **Success conditions:** "Postpaid completed successfully. Order Number:- '1-29726606734'", Status Complete, Fulfillment Status Complete, Approved checkbox unchecked (no approval needed)
- **Exit conditions:** Blocked if Proof of Employment attachment missing ("Error: Please select Proof of Employment before continuing.")
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “documents the tablet-based 'Open UI' guided-journey flow ... ending with immediate order completion and no manager/approval gate”

## UJ-083: New Postpaid Activation for HRN Customer with Pre-Approved Credit Limit (Tablet, With Approval)
`Explicit` · confidence: `high`

- **Actors:** Retail agent (HALEEMI HALEEMI); Manager (Test Manager/MANAGETEST)
- **Preconditions:** HRN customer with pre-approved credit limit context
- **Workflow steps (summary):** Contact (Qatari ID) -> Address -> Plan (New Plus Essential Pakistan BIA Promotion) -> Addon & Discount -> Number Selection/Reserve -> SIM Serial -> CAF generation/signature -> Activity comment -> Save And Finish -> submitted for approval -> Manager assigns/reviews/Approves -> Order Open -> Complete.
- **Success conditions:** Order Status Complete, Fulfillment Status Complete, all 11 order lines reach Complete/FULFILL BILLING COMPLETE
- **Exit conditions:** Manager could Reject - Correction or Reject - Drop Order instead of Approve
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Shows the complete Open UI Tablet flow for creating a brand-new postpaid mobile connection for a HRN ... customer ... order submission for approval, a Test Manager approving the order, and the order reaching final Complete fulfillment status”

## UJ-084: New Postpaid (Non-B2B2C) Consumer Activation with Existing-Account Credit Override (Tablet)
`Explicit` · confidence: `high`

- **Actors:** Retail agent (VINODHINIR VINODHINIR)
- **Preconditions:** Account already flagged with a Special Management value; customer already has multiple (3) existing postpaid connections
- **Workflow steps (summary):** Contact (Qatari ID) -> Connection Details credit warning (>=2 postpaid connections) -> Company Name field/lookup -> B2B2C override confirm dialog (OK to continue without B2B2C) -> Address -> Plan (Postpaid Legacy Red 250 Promotion) -> Addon & Discount -> Number Selection/SIM Serial -> CAF generation/signature -> Activity comment -> Save And Finish -> Order created as Pending.
- **Success conditions:** Not reached in walkthrough — ends with order Pending, Approved unchecked, awaiting approval
- **Exit conditions:** Agent could Cancel the B2B2C override confirm dialog instead of continuing as non-B2B2C
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “showing how the agent overrides the B2B2C (business-to-business-to-consumer) prompt to continue as a standalone consumer sale, and how the resulting order lands as Pending for approval”

## UJ-085: Prepaid to Postpaid Conversion — Desktop Vanilla (manual, with Bill Limit validation failure) (Pre2Post-Vanilla-Desktop)
`Explicit` · confidence: `high`

- **Actors:** Sales/Retail Agent (Hemanth Kumar, Responsibility VFQA Sales)
- **Preconditions:** Customer has an active Prepaid Red Promotion asset; account has existing Credit Limit
- **Workflow steps (summary):** Confirm agent responsibility -> locate account and existing prepaid asset -> right-click asset, Upgrade Promotion -> search/select target postpaid promotion -> resulting line items (Update/Delete/Add) -> configure Bill Limit in product configurator -> enter Spend Limit amount -> Check Errors passes (0 errors) -> Validate order -> triggers blocking Bill Limit < Agent Minimum error.
- **Success conditions:** Order validated with Spend/Bill Limit accepted (not reached in this instance)
- **Exit conditions:** Terminal validation failure: Bill Limit set (55) below configured Agent Minimum (80), error SBL-EXL-00151, order blocked pending correction
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “a desktop, Vanilla-Open-UI (Siebel-based) walkthrough of converting an existing Prepaid line to Postpaid ("Pre2Post") via the Upgrade Promotion action on an installed asset”

## UJ-086: Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer) — Open UI Desktop, manual plan selection (Pre2Post-OpenUI-Desktop-Manual)
`Explicit` · confidence: `high`

- **Actors:** Retail/Sales Agent (KARTHIKK)
- **Preconditions:** Existing prepaid customer identified by Qatari ID with an active Prepaid Red Promotion asset
- **Workflow steps (summary):** Home menu -> Guided Process Choose process -> select Prepaid to Postpaid -> Contact step (enter prepaid number, confirm identity) -> Plan step (manually search/Apply postpaid promotion) -> CAF auto-generated bilingual form -> e-signature capture -> review signed CAF -> Sales Order created (Plan Change/Pre2Post).
- **Success conditions:** Signed CAF and created Sales Order in Pending status ready for Submit
- **Exit conditions:** Walkthrough ends at order Pending, prior to Submit
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Step-by-step agent walkthrough of converting an existing prepaid mobile customer (identified by Qatari ID) to a postpaid plan ... from locating the customer's account through plan selection, CAF generation/e-signature, and final sales order creation”

## UJ-087: Prepaid to Postpaid Migration — Autobase (system-recommended offer) (Pre2Post-Autobase-Desktop)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (KARTHIKK); backend system user SADMIN; Unica campaign engine
- **Preconditions:** Account has a system-generated Migration Offer (Status Offered) attached to the prepaid asset, sourced from a Unica campaign
- **Workflow steps (summary):** Open account -> asset flyout Go to offer migration -> Migration Offer tab shows pre-populated offer -> Accept -> 3-step wizard (Contact confirm -> Offer Summary review -> Activity/comments) -> Save and Finish -> submission confirmation -> backend Bulk Job processes migration (PreToPost job type) -> Order completes.
- **Success conditions:** Order status reaches Complete, all line items Fulfillment Status Complete, new active Postpaid Billing Profile created
- **Exit conditions:** Order Complete; Activity logged with Area=Migration to Postpay, Journey=Start-up, Topic=Automated Guided Journey
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Shows a Vodafone Qatar CRM agent how to convert an existing Prepaid customer to Postpaid using the "Autobase"/Migration Offer flow, where the system already has a pre-computed, targeted postpaid offer”

## UJ-088: Prepaid to Postpaid Conversion — Open UI Tablet (Expat, Credit Limit scenario) (Pre2Post-OpenUI-Tablet)
`Explicit` · confidence: `high`

- **Actors:** Retail Agent (VINODHINIR)
- **Preconditions:** Existing expatriate prepaid customer with active Prepaid Red Promotion asset, Credit Limit 1000
- **Workflow steps (summary):** Home menu -> Mobile Postpaid -> Guided Process Choose process -> Prepaid to Postpaid -> Contact (search number+QID, confirm identity, connection count check, email/language/alt phone, upload QID front/back) -> Plan (search/select promotion, review Bill Limit/Credit Limit, edit Credit Limit down to 50) -> Addon & Discount (confirm benefit, note add-on, no discount) -> CAF & Additional Attachments (bilingual form, e-signature) -> account updated (pre-approved credit limit, postpaid billing profile) -> Sales Order created.
- **Success conditions:** Sales Order created (Plan Change/Pre2Post), account pre-approved credit limit and postpaid billing profile updated
- **Exit conditions:** Order in Pending status awaiting Submit; walkthrough ends before completion confirmation
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Demonstrates the end-to-end tablet (Open UI) flow for converting an existing Prepaid customer to Postpaid ("Pre2Post" plan change) for an expatriate customer, including credit-limit selection, plan/add-on selection ... CAF ... e-signature ... Sales Order”

## UJ-089: New Prepaid Connection — Open UI Tablet (NewPrepaid-OpenUI-Tablet)
`Explicit` · confidence: `medium`

- **Actors:** Retail Agent (Hemanth Kumar)
- **Preconditions:** New customer with no existing prepaid/postpaid connections (0/0 per Connection Details check)
- **Workflow steps (summary):** Home -> Contact (scan Qatari ID or Passport, confirm identity, connection count check, email/language/alt phone, ID front/back capture) -> Plan selection (Prepaid Red Promotion) -> Number Selection (reserve MSISDN) -> SIM Serial entry/scan -> CAF generated bilingual, unsigned -> e-signature capture -> signed CAF -> Sales Order record created.
- **Success conditions:** Sales Order created with Prepaid Red Promotion and Mobile Service Bundle line items, Line Items status Pending
- **Exit conditions:** Captured example order left in Abandoned status; no successful Submit/Activation confirmation screenshot present in this document
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “a screenshot-driven, step-by-step walkthrough of the "New Prepaid Tablet" guided journey ... demonstrating how a store/retail agent ... originates a brand-new prepaid mobile connection”

## UJ-090: SIM Swap from Global Search (Guided Journey, multi-channel) (SIMSwap-GlobalSearch)
`Explicit` · confidence: `high`

- **Actors:** Agent (any channel), Approver, Back-office/Vanilla Agent, Retail/Field Agent (tablet), Customer (signature)
- **Preconditions:** Customer identifiable by MSISDN via Global Search, or via Installed Assets, or via MSISDN + ID Type/Number on tablet
- **Workflow steps (summary):** Global Search by MSISDN -> select SIM Swap -> verify contact/upload QID+Bank -> enter new SIM serial + reason -> submit -> attach SIM Swap Form -> order routed to Approval -> comments, Save and Finish. Vanilla variant: select MSISDN under Installed Assets -> Modify -> order created -> update SIM Serial on SIM Card line item -> Validate -> Submit Order -> order goes to SIM Swap Approval Queue. Tablet variant: enter MSISDN/ID -> verify contact, attach QID+Bank -> enter SIM serial + reason, Submit -> Sign Contract -> capture signature -> Done -> SIM Swap Request Form attached -> Finish -> Order submitted for Approval.
- **Success conditions:** Order goes to Approval queue / submitted for Approval
- **Exit conditions:** Order pending in SIM Swap Approval Queue
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Global Search icon -> Enter MSISDN and click Go -> Click SIM Swap option -> Verify contact details, upload QID front & Bank, click Continue -> Enter SIM Serial Number, select SIM Swap Reason, click Submit -> Attach SIM Swap Form, click Continue -> Order goes to Approval -> Add comments, click Save and Finish”

## UJ-091: SIM Swap Approval (Desktop and Tablet queues, with Rejection) (SIMSwap-Approval)
`Explicit` · confidence: `high`

- **Actors:** Approver/Manager (Order Queue user)
- **Preconditions:** Order present in SIM Swap Queue or Order Approval Queue
- **Workflow steps (summary):** Desktop: Open SIM Swap Queue -> sort/search order -> Assign to Me -> open order -> Approve or Reject -> on Approve add comments and Submit -> task closes, Order Completed. Tablet: Open Order Approval Queue -> sort/search -> Assign to Me -> open order -> Validate Attachments -> Approve or Reject/Drop Order -> returns to My Activities Page. Rejection: Reject Task -> enter Rejection Reason and comments -> Drop Order; order dropped as cancelled.
- **Success conditions:** Task closes, Order status becomes Completed / order approved
- **Exit conditions:** Approve path: Order Completed; Reject path: order dropped/cancelled
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Click Queue -> Select SIM Swap Queue, click Order tasks tab -> Sort by Created Date or search Order Number -> Select order, click Assign to Me -> Click Order ID hyperlink -> Scroll down, Approve or Reject the Task -> On Approve, pop-up opens to add comments and Submit -> On Submit, task closes and Order is Completed; On Reject Task, pop-up opens for Rejection Reason -> Add comments, click Drop Order; order is dropped as cancelled; Go to Approval Journey -> Select Order Approval Queue... Validate Attachments -> Approve or Reject/Drop Order — moves back to My Activities Page”

## UJ-092: Future Dated Order (FDO) creation and lifecycle (FDO-Lifecycle)
`Explicit` · confidence: `high`

- **Actors:** Agent (Cops/Digital), Customer, System (scheduled execution engine)
- **Preconditions:** Order type is FDO-supported (Pre-to-Post, Post-to-Pre, Plan Change, Disconnection, Add-on/Discount)
- **Workflow steps (summary):** Agent raises FDO request with future execution date/time slot -> notifications sent (submission, 3-day reminder) -> request remains editable/cancellable while Initial -> at execution, order-type-specific validations run -> success -> order fulfilled and notification sent; or failure -> auto-retry x3 -> cancel and notify if unresolved.
- **Success conditions:** FDO executes at scheduled time, order fulfilled, Success notification sent
- **Exit conditions:** Success, Failed, or Cancelled status
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO can be raised via Open UI (Phase 1) ... Customer can view, edit and cancel a future-dated request before the "point of no return."”

## UJ-093: New Mobile Postpaid guided journey (demoed, IT stack modernization walkthrough) (NewPostpaid-Demo)
`Explicit` · confidence: `high`

- **Actors:** Sales/frontline Agent, Customer
- **Preconditions:** Customer has QID (postpaid requires QID)
- **Workflow steps (summary):** ID scan -> connections/plans-offered check -> customer info auto-populated from MOI -> address -> SIM serial -> plan -> add-ons -> discount -> star/free/reserved number selection -> CAF signature -> attachments -> submit.
- **Success conditions:** Order submitted with signed CAF and attachments
- **Exit conditions:** Not detailed beyond submit
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Guided journey demoed: New mobile postpaid — ID scan (barcode, no OCR today), connections/plans-offered check, customer info auto-populated from MOI (greyed out), address, SIM serial, plan, add-ons, discount, star/free/reserved number, CAF signature, attachments, submit”

## UJ-094: MNP (Mobile Number Portability) switch journey (IT stack modernization walkthrough) (MNP-Switch)
`Explicit` · confidence: `high`

- **Actors:** Agent, Customer, Donor operator/clearinghouse
- **Preconditions:** Customer has QID and an active number with a donor operator
- **Workflow steps (summary):** QID capture -> payment before donor submission -> plan selection -> donor details entry -> donor attachment -> pre-populated MNP form -> two signatures -> mandatory customer SMS confirmation to clearinghouse shortcode (QR1 charge).
- **Success conditions:** Customer confirms porting via SMS; port executes next working day in defined window
- **Exit conditions:** No SMS sent on rejection; port-out requires zero overdue/cleared instalments
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “MNP switch journey: QID first, payment before donor submission, plan selection, donor details (number, ID type/number registered with donor), donor attachment, pre-populated MNP form, two signatures ... and a mandatory customer SMS to a clearinghouse shortcode to confirm porting”

## UJ-095: Fixed/Fibre activation journey (IT stack modernization walkthrough) (Fixed-Fibre-Activation)
`Explicit` · confidence: `high`

- **Actors:** Agent, Customer, Installation partner
- **Preconditions:** Karama ID (KID) known or resolvable via Zone/Street/Building lookup
- **Workflow steps (summary):** KID entry (or lookup) -> address confirmation -> QID eligibility/blacklist check -> plan+discount -> IPTV/TV (defaulted yes) -> number -> appointment slot sent to installation partner -> CAF -> submission.
- **Success conditions:** CAF submitted, appointment scheduled with installation partner
- **Exit conditions:** Wrong KID entered upfront only caught by field agent at appointment stage (risk)
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Fixed/fibre journey: starts with Karama ID (KID) — Zone/Street/Building lookup if unknown — then address confirmation, QID eligibility/blacklist check, plan + discount, IPTV/TV (defaulted to yes, triple play), number, appointment slot (sent to installation partner), CAF, submission”

## UJ-096: Fiber Activation through Retail Agent (BRSD) (FIB-ACT-RTL-001)
`Explicit` · confidence: `high`

- **Actors:** Retail Sales Agent / Field Agent, Customer
- **Preconditions:** Installation address validated, RFS check passed
- **Workflow steps (summary):** Address capture, cascading zone/street/building selection, RFS search, address lock, KYC/account setup, catalogue/cart, number/SIM assignment, CAF, order submission.
- **Success conditions:** Order submitted
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Use cases in scope: (1) Fiber Activation through Retail Agent (FIB-ACT-RTL-001)”

## UJ-097: Fiber Instant Activation (BRSD) (FIB-ACT-RTL-002)
`Explicit` · confidence: `high`

- **Actors:** Retail/Field Agent, Customer
- **Preconditions:** Eligibility for instant activation detected; device serial verified; tablet channel
- **Workflow steps (summary):** Eligibility detection, device serial verification, instant/normal explicit selection, appointment auto-skip, immediate activation trigger, failure handling.
- **Success conditions:** Immediate activation triggered, appointment auto-skipped
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(2) Fiber Instant Activation (FIB-ACT-RTL-002)”

## UJ-098: Fixed Line Migration (BRSD) (FIB-MIG-RTL-003)
`Explicit` · confidence: `high`

- **Actors:** Retail/Field Agent, Customer, Telesales
- **Preconditions:** Existing service present, migration eligibility confirmed
- **Workflow steps (summary):** Migration eligibility, verification, service availability check, existing-service retrieval, order capture, WFM appointment, telesales collection flags.
- **Success conditions:** Order captured, WFM appointment scheduled
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(3) Fixed Line Migration (FIB-MIG-RTL-003)”

## UJ-099: Fixed Line Port In (BRSD) (FIB-FPI-RTL-005)
`Explicit` · confidence: `medium`

- **Actors:** Retail/Field Agent, Customer
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(5) Fixed Line Port In (FIB-FPI-RTL-005)”

## UJ-100: Fixed Line Port Out (BRSD) (FIB-FPO-RTL-006)
`Explicit` · confidence: `medium`

- **Actors:** Retail/Field Agent, Customer
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(6) Fixed Line Port Out (FIB-FPO-RTL-006)”

## UJ-101: Fiber Termination (BRSD) (FIB-TER-RTL-007)
`Explicit` · confidence: `medium`

- **Actors:** Retail/Field Agent, Customer, Retention
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(7) Fiber Termination (FIB-TER-RTL-007)”

## UJ-102: Fixed Line RFS (BRSD) (FIB-RFS-008)
`Explicit` · confidence: `medium`

- **Actors:** Retail/Field Agent, Customer
- **Workflow steps (summary):** RFS data ingestion/portal search by ZSB address, Karama ID, or area.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “(8) Fixed Line RFS (FIB-RFS-008)”

## UJ-103: Customer Purchasing Postpaid Mobile Plan through Retail Agent (BRSD, target state) (MOB_POST_ACT_RETL_001)
`Explicit` · confidence: `high`

- **Actors:** Retail Sales Agent, Customer (new or existing adding a connection)
- **Preconditions:** Agent authenticated to Agent Desktop; Qnomy Q Ticket issued (or fallback)
- **Workflow steps (summary):** Journey/session init, KYC/ID verification, customer/account setup, eligibility/credit check, billing account setup, catalogue/cart selection, number/SIM management, cart validation/checkout, CAF signing, payment via WinCash, order submission, notification.
- **Success conditions:** Order submitted (out of scope: fulfilment beyond submission)
- **Exit conditions:** Draft order/milestone persisted if abandoned, resumable
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Use case: MOB_POST_ACT_RETL_001 — 'Customer Purchasing Postpaid Mobile plan through Retail Agent.'”

## UJ-104: J011: Mobile Post-Paid Customer Onboarding Journey (BR walkthroughs) (J011)
`Explicit` · confidence: `high`

- **Actors:** Customer, Agent (DXP)
- **Preconditions:** Customer engages via QNomy, generating a QTicket
- **Workflow steps (summary):** QTicket generation, ID type branching (QID→MOI validation; Other ID/Passport→capture+validate address), contact/address capture, cart browsing, plan display logic, bill profile capture, SIM/MSISDN addition, number type branch (Normal vs Star), add-on branch (Non-Telco vs Telco), payment branch (Full Payment vs DOI), CAF generation, cart checkout, order submission, CAF sign-off, payment via WinCash with receipt, ID scan, Unica Campaign reference, SIM handover (eSIM/Physical-now/Physical-deliver).
- **Success conditions:** Order submitted, CAF signed off, payment captured, SIM handed over (eSIM or physical)
- **Exit conditions:** Not stated beyond successful handover; no explicit failure/exit path captured in extracted text
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Slide 4 — 'J011: Mobile Post-Paid Customer onboarding Journey': a detailed process-flow diagram covering Customer in QNomy → Agent in DXP; QTicket generation...”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"J011: Mobile Post-Paid Customer onboarding Journey" ... QTicket generation, ID type branching ... contact/address capture, cart browsing ... CAF generation/checkout/submission, CAF sign-off, payment capture via WinCash with receipt, ID scan, Unica Campaign reference, SIM handover options”

## UJ-105: RFS Data Flow (IMS to Downstream Systems)
`Explicit` · confidence: `high`

- **Actors:** Network Team, Business/Strategy Team, RPA (automation), Field Survey Team, Sales/Fulfilment
- **Preconditions:** GIS data loaded into IMS
- **Workflow steps (summary):** IMS building file export via GTM, RPA mediation/translation/filtering, distribution to UIM (full+VFID file), Siebel (delta), RFS Portal, EDW, OneDrive; VFID generated by RPA, mapped to KID by field survey team.
- **Success conditions:** Data distributed to UIM, Siebel, RFS Portal, EDW, OneDrive
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “IMS → GTM (go-to-market) full-dump building file → picked up by RPA... translated/filtered → distributed to UIM (full dump + separate VFID file), Siebel (delta file...), RFS Portal, EDW, and OneDrive”

## UJ-106: J017: Customer 360 (J017)
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** the source deck itself self-labels this content "(only topics needs to be provided)" — i.e. a discussion topic list, not a finished spec — and its accompanying UI mockups are explicitly labeled "Mock CTA" (wireframe placeholders, not evidenced screen behavior). A separate Phase 1.5 pass independently re-scored this source at 65/100 (Medium band) with disposition "directional/illustrative only" for the J017 portion specifically (the J011 portion of the same deck, by contrast, is reliable — see UJ-104 above, corroborated by a formal BRSD). Treat the workflow steps below as an aggregation-scope sketch, not a settled requirement, until a formal Customer 360 spec exists in the corpus. See `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

- **Actors:** Customer, Agent (DXP), Assisted Care Agent
- **Preconditions:** A query is raised to the Assisted Care Agent
- **Workflow steps (summary):** Query to Assisted Care Agent -> search for customer by Customer No/Contact No/MSISDN -> aggregate customer data across CDR/Usage View, Billing Profile Management, Bill Viewing & Download, Payment Processing & View, Real-Time Balance & Usage Fetch, Network Status Check, Unbilled & Billing Balance View, Ticket History, Order History -> agent retrieves bill info, CDR info, network status, customer/order details, payment/billing details.
- **Success conditions:** Requested customer data successfully retrieved and presented to the agent
- **Exit conditions:** Not stated in extracted text
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “"J017 - Customer 360 (only topics needs to be provided)" ... query to Assisted Care Agent, search for customer by Customer No / Contact No / MSISDN, aggregate customer data across: ...”

## UJ-107: J023: Mobile Service Suspension (J023)
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** this journey's sole source (`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`) was independently re-verified in a separate Phase 1.5 pass and scored 50/100 (Medium-Low, "Validation-only") — see `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`. Two specific problems: (1) "Launch X" (the system this journey cites as the source of "minimum services"/plan data) appears nowhere else in the 83-document corpus and is unexplained; (2) the retail-channel framing below ("Customer requests suspension via Email, Phone, or Retail Counter") directly **conflicts** with `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` (High confidence), which states manual suspension was redesigned to be explicitly **"not a retail journey"** — restricted to specific back-office roles, run as a ticket-driven process via Taurus (see PERSONA-021). Treat the retail-channel intake claim below as unresolved pending stakeholder confirmation, not as an agreed requirement — see `conflict-report.md` Conflict 3.

- **Actors:** Customer, Agent (in DXP)
- **Preconditions:** Customer requests suspension via Email, Phone, or Retail Counter [UNVERIFIED — see caveat above, conflicts with PERSONA-021's back-office-only sourcing]; current unbilled balance must be cleared (Pending Bill condition)
- **Workflow steps (summary):** Request suspension -> identify subscriber -> search by MSISDN/Account -> fetch customer & billing details -> validate customer and suspend eligibility -> agent changes plan to Park Plan (minimum services fetched from "Launch X" [unexplained system, unverified]) -> send communication to customer -> ticket creation and approval -> capture suspension payment via WinCash -> submit order -> end.
- **Success conditions:** Order submitted and service suspended, plan changed to Park Plan
- **Exit conditions:** Process ends at "end" node after order submission; no explicit failure path captured
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “"J023: Mobile Service Suspension" ... request service suspension (via Email, Phone, or Retail Counter) -> identify subscriber -> search (MSISDN/Account) -> fetch customer & billing details -> validate customer and suspend eligibility -> agent changes current plan to "Park Plan" ... -> send communication to customer -> ticket creation and approval needed -> capture payment for suspension, collected in WinCash -> submit the order -> end.” *(slug corrected 2026-08-23 — was previously mis-cited as `business-process-day29jun-updatev1-0-af309fe2`, a non-existent slug)*

## UJ-108: J024: Mobile Service Resume (J024)
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** same source and same issue as UJ-107 above — score 50/100 (Medium-Low), "Launch X" unexplained, retail-channel framing conflicts with the High-confidence Day2-Session2 workshop. See `conflict-report.md` Conflict 3.

- **Actors:** Customer, Agent (in DXP)
- **Preconditions:** Customer requests resume via Email, Phone, or Retail Counter [UNVERIFIED — see UJ-107 caveat]; customer currently on a Park Plan (suspended)
- **Workflow steps (summary):** Request resume -> identify subscriber -> search by MSISDN/Account -> fetch customer & billing details -> validate customer and resume eligibility -> agent changes Park Plan back to Base Plan (fetched from "Launch X" [unexplained system, unverified]) -> send communication to customer -> ticket creation and approval -> capture resume payment via WinCash -> submit order -> end.
- **Success conditions:** Order submitted, plan reverted to Base Plan, which would be billed
- **Exit conditions:** Process ends at "end" node after order submission; no explicit failure path captured
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “"J024: Mobile Service Resume" ... request service resume (via Email, Phone, or Retail Counter) -> identify subscriber -> search (MSISDN/Account) -> fetch customer & billing details -> validate customer and resume eligibility -> agent changes current Park Plan back to Base Plan ... -> send communication to customer -> ticket creation and approval needed -> capture payment of resume service via WinCash -> submit the order -> end.”

## UJ-109: Complaints Management Process / Agent Ticket Creation
`Explicit` · confidence: `low`

- **Actors:** FL Agents, Complaints Team
- **Preconditions:** Not detailed in extracted text (slides are largely screenshot/diagram-heavy with only titles captured)
- **Workflow steps (summary):** Complaints management process leads into agent ticket creation; Ticket Homepage has fields filled by FL Agents, Complaints Team, or FL Agents for specific TTs; tickets have internal 'Activities'.
- **Success conditions:** Not stated in extracted text
- **Exit conditions:** Not stated in extracted text
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Slides 16-19: Complaints Management Process, Agent Ticket Creation, Ticket Homepage ..., Activities inside Tickets.”

## UJ-110: MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant)
`Explicit` · confidence: `high`

- **Actors:** MNP Team (system: NPAS)
- **Preconditions:** A port-out request has been initiated, triggering auto-creation of a ticket from NPAS
- **Workflow steps (summary):** Ticket auto-created from NPAS -> internal activities validated automatically or by MNP Team, each marked Success/Failed -> once all activities complete, ticket status changes automatically.
- **Success conditions:** All activities marked Success and ticket status auto-updates to completion
- **Exit conditions:** Activities marked Failed presumably block completion, though not explicitly detailed beyond Success/Failed status
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “MNP Port Out Ticket — states the ticket is "Auto-Created from NPAS"; activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically.”

## UJ-111: Disconnection Ticket Processing (Retention Team closure triggers auto-order)
`Explicit` · confidence: `high`

- **Actors:** Retention Team
- **Preconditions:** A disconnection-related ticket exists and is being handled by the Retention Team
- **Workflow steps (summary):** Retention Team closes the disconnection ticket -> system automatically creates a disconnection order.
- **Success conditions:** Disconnection order automatically created upon ticket closure
- **Exit conditions:** Not further detailed in extracted text
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Slides 29-30: Disconnection Ticket — states "Once the Ticket is Closed by Retention Team, It automatically creates a disconnection order."”

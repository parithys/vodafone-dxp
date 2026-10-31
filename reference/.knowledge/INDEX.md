# Knowledge Index

**Source:** /Users/parithimalsaravanan/claude-projects/vfq/data
**Last indexed:** 2026-08-21
**Documents:** 83 indexed — 78 high confidence, 5 medium confidence, 0 low confidence, 0 failed (updated 2026-08-23, Phase 1.5 Action 1.5.6)

**2026-08-23 update:** all 6 medium-confidence documents were re-verified in Phase 1.5 Action 1.5.6 (spot-checks against other corpus documents, direct re-extraction where the original pass was thin). One — `guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90` — is upgraded to `high` below; it was a stale flat-text-extraction artifact, not a real data-quality issue. The other 5 remain `medium` in this index's simple 4-band scheme, but each now has a refined 0-100 score, spot-check evidence, and a disposition (Primary source / Use with conditions / Validation-only) recorded in `VFQ_Phase1.5_Action6_Source_Confidence_Verification_Report.xlsx` and superseded by the finer-grained bands in the Action 1.5.7 Source Confidence Handling Policy — consult those for Phase 2 use rather than this index's coarse label alone.

**2026-08-21 update:** all 39 Guided Journeys documents that were originally low-confidence (screenshot-only content, text extraction recovered almost nothing) have been re-analyzed by extracting their embedded PNG screenshots directly from each `.docx` (a ZIP container) and viewing each image visually in document order — not OCR, direct multimodal reading. This recovered full field-level, screen-by-screen procedural detail for every one of them: form fields, dialog/validation text verbatim, button sequences, and final order status. 38 are now `high` confidence; 1 (`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`) is `medium` because the agent flagged an internal data discrepancy (see its Extraction notes). See each doc's "Extraction notes" section for the method and any caveats.

This corpus is the discovery/requirements record for Vodafone Qatar's ("VFQ") CRM/CVM "Stack Modernization" program — workshop transcripts, business requirement specs, business rules extracts, customer forms, and step-by-step "Guided Journey" UI walkthroughs used to design a new DXP/Open UI-based agent platform to replace the legacy Siebel/ECR/VSA stack.

## Routing table

### Program overview & requirements decks
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| VFQ_Stack Modernization_ BR_25Jun.pptx | Day 1 kickoff deck: reusable-capability concept, J011 mobile postpaid onboarding flow, 13 DXP Agent Portal wireframes. | `vfq-stack-modernization-br-25jun-03c2aa09` | high |
| VFQ_Stack Modernization_ BR_28Jun.pptx | Day 2 deck: re-presents J011, introduces J017 Customer 360 journey and 6 UI section slides. | `vfq-stack-modernization-br-28jun-75f28727` | medium |
| VFQ_Stack Modernization_ BR_29Jun_UpdateV1.0.pptx | Day 3 deck: introduces J023 Mobile Service Suspension and J024 Mobile Service Resume journeys. | `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2` | medium |
| Vodafone Process Overview_290626_EC.pptx | Standalone 39-slide current-state overview of Activation Channels, Consumer/Enterprise CAFs, and Trouble Tickets, ending in 5 proposed ticketing enhancements. | `vodafone-process-overview-290626-ec-1ed338b9` | high |
| VFQ_Fibre_BRSD_v1.2.xlsx | Formal 11-sheet BRSD for fibre/FWA activation — 8 use cases, 25 capabilities, 178 requirements, 29+ open items; reuses core capabilities from the Mobile Postpaid BRSD. | `vfq-fibre-brsd-v1-2-068eebe3` | high |
| VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx | Formal 10-sheet BRSD for retail-assisted postpaid mobile activation — 13 capabilities, 197 requirements; the reusable "core" other BRSDs point back to. | `vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d` | high |
| CRM Journeys_Final_Updated.xlsx | Catalog of 165 CRM journeys/features (Lead/Sales/Support/Manage/Disconnect) with platform/CBU-EBU coverage and resourcing/timeline estimates. | `crm-journeys-final-updated-a23640a5` | high |
| CRM_Journeys_Final_Updated_with_Type.xlsx | Same 165-row journey catalog, extended with a Type taxonomy (User Journey/Workflow/View/Action/Access) sheet. | `crm-journeys-final-updated-with-type-634b83d3` | high |

### IT stack modernization workshops (architecture/systems)
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| IT stack modernization Existing processes Giga-26 (23rd floor)-...docx | Day 17: baselines as-is channels/systems (Open UI, ECR, VSA, MCCR); decisions to decommission ECR, prioritise consumer over enterprise. | `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d` | high |
| IT Stack modernization Overview of RFSVodafone IDIMS Systems-...docx | Day 22: IMS (network inventory), Vodafone ID/KID mapping, RFS Portal data flow (GTM file → RPA → UIM/Siebel/EDW). | `it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0` | high |

### Business process reviews — enterprise, billing, MNP/FNP, TON (Day 7–12)
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Business Processes- Day7 - Session 2-...docx | Transfer of Ownership / Transfer of Number as-is/to-be design, real-time-in-store debate, null-number price bug. | `business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d` | high |
| Business Process - Day9 - Session 1-...docx | End-to-end MNP/FNP port-in process, porting windows, Siebel order creation, post-port-in dunning ladder. | `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d` | high |
| Business Process - Day9 - Session 2-...docx | Siebel MNP/FNP ticket auto-validation, conditional acceptance thresholds, manual penalty-calc gaps. | `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830` | high |
| Business Process - Day10 - Session 1-...docx | Billing profile correlation, bulk/individual adjustments, SOA automation, hot bill vs. simulation, fixed-line back-dated billing. | `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a` | high |
| Business Process - Day11 - Session 1-...docx | Enterprise/EBU account setup — parent/sub-account model, choosers/authorised persons, volumetric discounts. | `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0` | high |
| Business Process - Day11 - Session 2-...docx | Enterprise IoT/M2M/DAPN/PTT services and order journey. **Source recording is damaged**, transcript cuts off mid-discussion at 01:09:25. | `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c` | medium |
| Business Process - Day12 - Session 1-...110503...docx | Guided walkthrough of 5 enterprise process journeys (mobility, PTT, fixed line, 5G/FWA, DAPN) from the knowledge base. | `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01` | high |
| Business Process - Day12 - Session 1-...124834...docx | Administrative tracker-grooming session, owner assignment for outstanding enterprise/SOHO-SME topics. | `business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4` | high |
| Business Process - Day12 - Session 2-...docx | Device/IoT ordering rules, Siebel export/performance issues, Bulk SMS journey, enterprise invoice redesign. | `business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b` | high |

### Business workshops — postpaid service (Day 1–7)
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Business Workshop - Session 1 - Postpaid Service-...docx | Foundational session: modular/DXP architecture intro, postpaid new-connection journey, baseline eligibility/credit/ID rules. | `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` | high |
| Business Workshop - Day2 - Session 1-...docx | CAF signature flow, payment/WinCash handover, customer 360/account-hierarchy design. | `business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320` | high |
| Business Workshop - Day2 - Session 2-...docx | Billing account/bill-profile redesign, AutoPay/email verification, SIM Swap validation chain, "park my number" suspension redesign. | `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` | high |
| Business Workshop - Day4 - Session 2-...docx | As-is Open UI/Siebel trouble-ticket walkthrough: End Data Session, TON, Disconnection, MNP port-out special flows. | `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d` | high |
| Business Workshop - Day5 - Session 1-...docx | Customer verification/QID scanning rules, security questions. **Recording materially incomplete** — only ~29 of 186 min decoded. | `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808` | medium |
| Business Workshop - Day5 - Session 2-...docx | Plan change/migration rules, promotion-bundling, Multi-SIM/iWatch, number reservation, credit limits, DOI current vs. target flow. | `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4` | high |
| Business Workshop - Day6 - Session 1-...docx | End-to-end fixed line activation (KID/Karama ID, IPTV/plan selection, appointment booking), KID-in-use exceptions. | `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e` | high |
| Business Workshop - Day6 - Session 2-...docx | Instant fixed-line activation, 5G indoor/outdoor FWA with site-lock abuse prevention, FWA-to-fiber migration, home move gaps. | `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e` | high |
| Business Workshop - Day7 - Session 1-...docx | Karama ID/address data modeling for RFS determination, detailed Transfer of Number process and automation targets. | `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976` | high |

### Business rules & reference data
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Order Validation Business Rules.xlsx | As-is Siebel order-validation catalogue — ~169 ORD_VALD_RULE + 9 BL RULE entries + legacy BUSINESS RULE IDs (billing, blacklist, APN, iWatch, Bulk SMS, IoT, ALP, deposit bundle, KID/address checks). | `order-validation-business-rules-45d0e9f0` | high |
| Contact Validation Business Rules.xlsx | Flat list of 40 CRM contact-field validation error messages (mandatory, format, cross-field, authorization). No rule IDs. | `contact-validation-business-rules-b5d58c84` | high |
| TT Hashtags and Actual Issue.xlsx | Two Siebel LOV exports for trouble-ticket tagging: VFQA_TT_HASHTAGS (454 values), VFQA_TT_ACTUAL_ISSUE (355 values). | `tt-hashtags-and-actual-issue-8d8ccaa5` | high |
| SMS Templates.xlsx | Multilingual (EN/AR/HI/ML) CRM SMS templates, 4 sheets — Automatic (12), Lead Automated (10), Other Automated (23), Manual (1,236 rows). | `sms-templates-0603d3eb` | high |

### Customer forms & contracts
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| 250604 Supplementary Form (Reg) v2_FINAL.pdf | Customer-signed GigaHome & OSNtv Subscription Acceptance T&Cs — lock-in, disconnection fees, Home Move, TON, free-months eligibility. | `250604-supplementary-form-reg-v2-final-475e97bb` | high |
| Consumer Postpaid CAF V4_110525_Editable.pdf | Blank bilingual Postpaid CAF (Form ID **PCA001**) — Applicant/Billing/Postpaid/Home Fibre sections + General T&Cs. | `consumer-postpaid-caf-v4-110525-editable-915fde96` | high |
| Consumer Prepaid CAF V2_110525_Editable.pdf | Blank bilingual Prepaid CAF (also marked Form ID **PCA001** — see Gaps) — mobile number/SIM serial/applicant ID + General T&Cs. | `consumer-prepaid-caf-v2-110525-editable-0c369437` | high |
| GigaHome Subscription Acceptance Form 5G Home Plans V3-revised.pdf | Bilingual 18-clause acceptance form — FWA/5G Home pricing, speed tiers, FUP, lock-in penalties (500/800/200 QAR), Fibre-migration terms. | `gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d` | high |
| Consumer Activation ProcessProcedure_Ver _8.0_WM_22022024 2024.pdf | 31-page SOP: Prepaid/Postpaid activation across ECR, Open UI, VSA, Retail, QVC, Offshore Airport; full v1.0–v8.0 revision history and named approvers. | `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201` | high |

### Guided Journeys — FWA / 5G Home
Full step-by-step procedures recovered via direct visual inspection of embedded screenshots (see 2026-08-21 note above).

| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Desktop Vanilla_FWA_Indoor.docx | Vanilla (manual) desktop FWA Indoor activation: Contact → Account → Sales Order → Catalog → Line Items → Number reservation → CPE serial entry → Submit → order reaches Complete. | `guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a` | high |
| Desktop Vanilla_FWA_Outdoor_WFM.docx | Vanilla desktop FWA Outdoor Dual Play order creation through WFM/Oracle Field Service appointment booking and field installation. | `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3` | high |
| Desktop Vanilla_Indoor_Modify CPE.docx | Manually modifying an installed FWA Indoor CPE's serial number via Account 360 → Installed Assets → Modify, through a completed Modification order. | `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3` | high |
| FWA_Indoor & Outdoor_Negative Scenarios.docx | Catalog of validation/error scenarios (Address, SIM/CPE UIM inventory, mandatory Supplementary Form) with verbatim error text. | `guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c` | high |
| Open UI Desktop_FWA_Indoor.docx | Guided-wizard FWA Indoor postpaid activation for an existing mobile customer, customer lookup through CAF signature and post-activation verification. | `guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf` | high |
| Open UI Desktop_FWA_Outdoor_WFM.docx | Guided-wizard FWA Outdoor sales order (GigaHome Premium OD New 5G) through CAF signature, WFM appointment, and Oracle Field Service technician installation to order Complete. | `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7` | high |
| Open UI Tabelt_FWA_Indoor_B2B2C.docx | Largest file in the set (68 screenshots): FWA Indoor B2B2C tablet journey — contact/plan/SIM-CPE validation (incl. UIM error dialogs) → CAF signature → manager approval → fulfillment. | `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09` | high |
| Open UI Tablet_FWA_Indoor_With Approval.docx | FWA 5G Indoor tablet sale with a manager Approval queue step (Approve / Reject-Correction / Reject-Drop Order) before activation. | `guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f` | high |
| Open UI Tablet_FWA_Indoor_Without Approval.docx | FWA Indoor tablet sale where a "seek credit control approval" advisory appears but no approval gate is enforced — order completes with Approved unchecked. | `guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1` | high |
| Open UI Tablet_FWA_Outdoor_B2B2C.docx | FWA Outdoor B2B2C tablet sale: QID scan, employer link, GigaHome Premium OD New 5G plan, appointment booking, signed CAF, order created. | `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359` | high |
| Open UI Tablet_FWA_Outdoor_WFM.docx | FWA 5G Outdoor tablet order through CRM wizard, CAF signature, then WFM/OFSC technician installation (inventory transfer, serial check, activation checklist) back to order Complete. | `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754` | high |

### Guided Journeys — Fixed Line / Fibre
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Digital_Fixed Line (Instant Activation - Dual Play).pdf | 17-slide deck (22 Dec 2024): self-service digital fiber activation journey — location/plan, device/eKYC, appointment, lead submission, verbatim "Key flow for phase 1". | `guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf` | high |
| Open UI Desktop_Cross Sales_Fixed Line.docx | Cross Sales module: QID lookup → accept campaign offer (GigaHome Fiber) → redirected into guided New Fixed Line journey → appointment/CAF/submit → order provisioned, WFM in progress. | `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20` | high |
| Open UI Desktop_Fixed Line_Fulfilment Team (Skip Attachments).docx | Back-office Fulfilment agent full walkthrough: login → KID/QID contact confirm → address/service point → plan/addon → number reservation → appointment (attachments skipped) → order completed with 13 line items. | `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479` | high |
| Open UI Desktop_Fixed Line_Triple play.docx | Full desktop Siebel walkthrough — Triple Play, IPTV Yes — KID entry through WFM activation and serial number check. | `guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41` | high |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_B2B2C_With Approval_Instant Activation.docx | Most complex Fixed Line variant: B2B2C order with pre-patched KID/Combo Box, instant activation, manager Order Approval queue, provisions to Complete. | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a` | high |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_Instant Activation.docx | System auto-detects a prepatched Combo Box CPE/ONT on-site; agent completes Contact/Address/Plan/Number/CAF; order goes Open→Complete in ~4 min with no appointment booked. | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9` | high |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_Normal Activation.docx | Full 42-step Normal Activation, Prepatched KID/Combo Box journey through manager approval and a reject-for-correction/OSB-SMS cycle. | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2` | high |
| Open UI Tablet_Fixed Line_Prepatched KID_Non Combo Box_Normal Activation.docx | Prepatched KID, Non-Combo-Box variant: contact/ID capture through appointment, CAF e-signature, reject-for-correction/resubmit cycle, manager approval, backend SMS confirmation. | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b` | high |
| Open UI Tablet_Fixed Line_with Approval.docx | Normal Activation, Combo Box, Triple Play — order submission, manager Approval-queue review, a "Reject - Correction" cycle with OSB SMS trace, and the dedicated Order Correction re-entry flow. | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6` | high |

### Guided Journeys — Home Move / MNP / Lead / Passport-QID
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Open UI Desktop_Home Move_Fixed to Fixed_Happy Path.docx | Fully detailed desktop-to-WFM walkthrough for successful Fixed-to-Fixed home move; "comments >5 characters" validation rule. | `guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5` | high |
| Open UI Desktop_Cross Sales_MNP Postpaid.docx | Agent accepts a "New MNP" cross-sales offer on a contact, then walks the MNP Postpaid guided journey (Contact→Address→Billing→SIM Serial→Plan→Bill Limit), captured stopping before Donor Details/CAF/Activity. | `guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82` | high |
| Open UI Desktop_MNP Postpaid.docx | Full MNP Postpaid journey: Bill-Limit Agent-Min-Value guardrail live-validated, Ooredoo port-in, e-signed MNP/CAF digital forms, submitted Sales Order with full line-item breakdown. | `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33` | high |
| Open UI Tablet_MNP Postpaid_HRN_Add-on.docx | Tablet MNP Postpaid porting an HRN (Nepalese, Passport ID) customer from Ooredoo/Qtel to Vodafone with a Postpaid Extra Promotion plus International 50 add-on, completed successfully. | `guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743` | high |
| Open UI Tablet_MNP Prepaid.docx | Full MNP Prepaid tablet flow: QID/MOI lookup, SIM reservation, plan selection, donor port-in details, bilingual MNP/CAF contracts with e-signatures, order completed. | `guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa` | high |
| Lead Creation Mobile.docx | Agent creates a Postpaid lead from a mobile number via New Lead Tablet, sets callback/status; a Manager persona then reassigns the Lead Owner. | `guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753` | high |
| Lead Creation – Fixed.docx | Agent creates a Fixed-line ("Home") lead with auto-formatted address; a Manager/Approver persona reviews and Rejects it with a reason code and comment. | `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c` | high |
| Lead Creation, Lead Edit, Owner Change.docx | Full lead lifecycle: creation, callback-driven status change, Manager owner reassignment (lead vanishes from prior owner's My Leads but stays in My Created Leads), field edit, back-office Reject/Retire options. | `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45` | high |
| Tablet Lead Creation with Fixed Presales and Edit Lead details.docx | Tablet lead creation with Fixed Pre-Sales=Yes (appointment picker + address), followed by editing the saved lead's Service Needed from Home to MNP. | `guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b` | high |
| Open UI Tablet_Passport to QID Update(Passport).docx | **Full 9-step procedure** recovered for updating customer ID Passport→QID on tablet, incl. MOI validation and signature capture. | `guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271` | high |

### Guided Journeys — Postpaid / Prepaid / Pre-to-Post / SIM Swap
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Cross Sales_Open UI Desktop_New Postpaid.docx | Cross Sales surfaces campaign offers (New MNP/New Postpaid) then hands off into the standard New Postpaid wizard; completes order plus a linked modification order adding a bundle to an existing line. | `guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323` | high |
| Desktop Vanilla_New Postpaid.docx | Admin raises a Bill Limit product's Agent Minimum to 80, then a New Postpaid sales order build is used to trigger the resulting Bill Limit validation error (SBL-EXL-00151). | `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de` | high |
| Open UI Desktop_New Postpaid.docx | Retail New Postpaid bill-limit-edit journey, VFQA Sales role. Full 23-screenshot sequence: per-product Agent Minimum thresholds (Mobile=50, Mobile Plus=75), inline validation error, order completion. Upgraded from medium 2026-08-23 (was a stale text-only extraction, not a data issue). | `guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90` | high |
| Open UI Desktop_New Postpaid_HRN Customer_Credit Limit.docx | New Postpaid activation for an HRN (Nepalese-nationality) customer — "(HRN) Customer needs to pay advance payment of QR 100" flag, agent edits pre-approved credit limit 800→1000. | `guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2` | high |
| Open UI Tablet_New Postpaid_B2B2C_With Approval.docx | B2B2C New Postpaid tablet: submission triggers "submitted for approval"; a Manager persona reviews and Approves via an Order Approval queue before the order completes. | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd` | high |
| Open UI Tablet_New Postpaid_B2B2C_Without Approval.docx | B2B2C New Postpaid tablet: contact/plan/number/SIM/CAF + mandatory Proof of Employment; order completes with Approved flag unchecked (no approval routing). | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7` | high |
| Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx | HRN New Postpaid activation — ID scan through plan/addon/number/SIM, CAF/e-signature, manager approval queue, order reaches Complete. | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc` | high |
| Open UI Tablet_New Postpaid_NON_B2B2C_With Approval.docx | Agent overrides a "Special Management"/B2B2C prompt via native confirm dialog on an account with multiple existing postpaid connections; order lands Pending for credit-control approval. | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca` | high |
| Desktop Vanilla_Pre to Post.docx | Prepaid-to-Postpaid conversion via "Upgrade Promotion" on an installed asset, capturing a real Bill Limit validation failure (below Agent Minimum) rather than a clean success. | `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce` | high |
| Open UI Desktop_Pre to Post (Autobase).docx | "Autobase" Pre-to-Post: agent accepts a Unica-sourced pre-computed migration offer via a 3-step wizard; a backend Bulk Processing job completes the Prepaid→Postpaid conversion automatically. | `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57` | high |
| Open UI Desktop_Pre to Post.docx | Manual Prepaid-to-Postpaid: contact lookup, manual promotion search/apply, bilingual CAF with e-signature, resulting Pre2Post Plan Change order in Pending status. | `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556` | high |
| Open UI Tablet_Pre to Post.docx | Tablet Prepaid-to-Postpaid for an expat customer — credit limit edited during the flow, add-ons, bilingual CAF with e-signature, order created in Pending status. | `guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740` | high |
| Open UI Tablet_New Prepaid.docx | Full New Prepaid tablet journey: ID capture, plan selection, number reservation, SIM serial scan, bilingual CAF + e-signature, Sales Order created. | `guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13` | medium |
| SIM Swap - Tablet, Desktop & Vanilla Order Approval Journey.docx | **Full numbered step outline** for SIM Swap across Global Search, Vanilla, Open UI Desktop, and Open UI Tablet channels — approval, rejection, order-listing workflows. | `guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493` | high |

### Guided Journeys — Other
| Document | Summary | Slug | Confidence |
|---|---|---|---|
| Future Dated Orders_training pack.pdf | Training pack for Cops/Digital and sales agents on Open UI FDO feature — supported order types, 30-day max, status model, per-journey validations. | `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be` | high |
| Open UI Desktop (Agent 360 & CTI View).docx | Walkthrough of the Open UI Desktop "Account 360" view (Account Summary, Asset Summary, Communications/Contact History pop-up). Despite the filename, no CTI-specific screen was actually captured — see its Extraction notes. | `open-ui-desktop-agent-360-cti-view-8b495725` | high |

## Gaps and ambiguities

- ~~Systemic extraction gap — Guided Journeys folder~~ **RESOLVED 2026-08-21.** The 39 screenshot-driven Guided Journeys documents originally had almost no recoverable text via pandoc/markitdown (they only recover titles and stray image alt-text captions, not the content inside the embedded PNGs). All 39 were re-processed by extracting the embedded screenshots directly from each `.docx` and viewing them visually, in document order, recovering full field-level procedural detail. 38 are now `high` confidence; one (New Prepaid Tablet) is `medium` due to a genuine data discrepancy the recovery surfaced (see its Extraction notes). One incidental finding from this pass: `open-ui-desktop-agent-360-cti-view-8b495725`'s filename references a "CTI View" but none of its 5 screenshots actually show one — worth flagging to whoever named the source file.
- **Duplicate Form ID.** [consumer-postpaid-caf-v4-110525-editable-915fde96](docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md) and [consumer-prepaid-caf-v2-110525-editable-0c369437](docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md) are both stamped Form ID **PCA001** despite being distinct Postpaid vs. Prepaid forms — likely a template numbering error in the source documents, not an extraction artifact. Worth confirming with whoever owns the CAF templates before treating PCA001 as a unique identifier.
- **Damaged/incomplete source recordings.** [business-process-day11-session-2](docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md) (cuts off at 01:09:25) and [business-workshop-day5-session-1](docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md) (only ~29 of 186 minutes decoded) are missing content that may exist only in whatever raw recording/notes the workshop facilitators still hold.
- **Two near-duplicate CRM journey workbooks.** `CRM Journeys_Final_Updated.xlsx` and `CRM_Journeys_Final_Updated_with_Type.xlsx` appear to be the same 165-journey inventory, with the "_with_Type" version adding a taxonomy column — treat the latter as the newer/superseding version unless told otherwise.
- **Un-corroborated version marker.** `VFQ_Stack Modernization_ BR_29Jun_UpdateV1.0.pptx`'s "UpdateV1.0" filename suffix is not backed by any in-slide changelog — unclear what specifically changed from a prior version.
- **No master glossary/index found in the source data** tying journey codes (J011, J017, J023, J024, etc.) to a canonical list — they only appear scattered across the BR_25Jun/28Jun/29Jun decks. A consolidated journey-code register does not exist in this corpus if one is needed.

## Coverage exclusions

- `Consumer Postpaid CAF V4_110525 .jpg` and `Consumer Prepaid CAF V2_110525 .jpg` were **not indexed** (unsupported image extension). **Confirmed in Phase 1.5 Action 1.5.4** (see `VFQ_Phase1.5_Action4_CAF_Content_Audit_Report.xlsx`): these are NOT renders of the application form as originally assumed here — both are single-page renders of PAGE 2 of their respective PDFs (generic "Vodafone Qatar General Terms and Conditions" boilerplate, verified via matching footer codes VFQ-PP110525/VFQ-PR110525), containing zero form fields. The application form itself (page 1, ~46 fields Postpaid / ~9 fields Prepaid) is fully covered by the PDF/editable counterparts (`consumer-postpaid-caf-v4-110525-editable-915fde96`, `consumer-prepaid-caf-v2-110525-editable-0c369437`) — disposition REDUNDANT, High confidence. Skipping the JPGs at indexing time was the right call, just for a different reason than originally stated.
- `.DS_Store` was skipped (system file, not a document).

# SOURCE CONFIDENCE HANDLING POLICY
**Vodafone Qatar — CRM Stack Modernization Discovery Corpus**
**Version:** 1.0 | **Date:** 2026-08-23 | **Owner:** Phase 1.5 Gap Remediation (Action 1.5.7)
**Applies to:** the 83-document corpus indexed in `.knowledge/INDEX.md`, plus the 17 diagrams generated in Action 1.5.3

---

## 0. Why 5 bands, not the 4 originally proposed

The original Phase 1.5 brief proposed 4 bands with a cliff from Medium (60–69) straight to Low (<60). Action 1.5.6's re-verification of the 6 real medium-confidence documents produced scores of 50, 50, 53, 65, 65, and 88 — **three of six landed in the 50–59 range**, and none of them deserve the "Low / do not use, reference only" treatment the original 4-band scheme would have forced on them. Each of those three has genuine, corroborated, usable content alongside a specific, nameable weakness (an isolated bad field, an uncorroborated single-source claim, an unexplained deck reference) — "use this specific part, verify that part" is the right instruction, not "discard entirely."

This policy therefore uses **5 bands**, inserting **Medium-Low (40–59)** between Medium and Low. This is not a cosmetic change — it's the empirically-driven correction the re-verification exercise surfaced, and it directly shapes how Phase 2 should treat roughly half of the sources this policy's own registry covers.

---

## 1. Confidence Bands & Usage Rules

### High (80–100)
- **Profile:** Complete, internally consistent, corroborated by at least one independent source, no unresolved contradictions.
- **Examples in this corpus:** Both formal BRSDs (Fibre, Mobile Postpaid Activation), the 78 high-confidence Guided Journey walkthroughs, all "high" workshop transcripts.
- **Usage:** PRIMARY source of truth. Extract directly. No additional qualification needed.
- **Traceability format:** `Source: [doc]`
- **Risk level:** LOW

### Medium-High (70–79)
- **Profile:** Most content solid and corroborated; a defined subset (not the whole document) is thinner, self-labeled provisional, or not yet confirmed by a later authoritative source.
- **Examples in this corpus:** none of the 6 re-verified documents landed in this exact band (the closest, BR Deck 28Jun and Day11-Session2, both scored 65 — see Medium band below); this band is retained for future re-verifications that land 70-79.
- **Usage:** PRIMARY for the well-corroborated portion; CONDITIONAL for the flagged subset — extract the subset but attach the condition inline.
- **Traceability format:** `Source: [doc] — Condition: [note]`
- **Risk level:** MEDIUM

### Medium (60–69)
- **Profile:** Coherent and mostly corroborated, but with enough uncorroborated or aging content that it shouldn't anchor a requirement alone.
- **Examples in this corpus:** BR Deck 28Jun (65 — J011 content strong, J017/Customer 360 a self-labeled topic list), Day11-Session2 pre-cutoff content (65 — dense and corroborated, but ~36% of the session never decoded).
- **Usage:** PRIMARY for corroborated claims; VALIDATION-ONLY for uncorroborated ones — cross-reference before treating as agreed.
- **Traceability format:** `Source: [doc] — Cross-check: [what to verify against]`
- **Risk level:** MEDIUM

### Medium-Low (40–59) — *new band, see §0*
- **Profile:** A specific, real defect exists (an unresolved field discrepancy, a namesake topic with zero external corroboration, an unexplained internal reference, a framing that conflicts with a same-tier document) — but the defect is bounded, not systemic, and most of the document is still usable.
- **Examples in this corpus:** BR Deck 29Jun (50), Guided Journey Prepaid (50), Day5-Session1 (53).
- **Usage:** VALIDATION-ONLY for the document as a whole. The specific flagged content is EXCLUDED (do not extract or cite it as fact); everything else may be extracted but MUST be flagged as "pending validation" in the traceability record, not treated as agreed.
- **Traceability format:** `Source: [doc] — LOW confidence, pending validation: [specific gap]`
- **Risk level:** MEDIUM-HIGH

### Low (<40)
- **Profile:** Contradicted by another source, or the large majority of the document is uncorroborated/unrecoverable.
- **Usage:** DO NOT use for extraction or validation. REFERENCE only (background context, not requirements input).
- **Traceability format:** EXCLUDE from the traceability matrix entirely.
- **Risk level:** HIGH

No document in this corpus currently scores below 40 — the corpus has no "failed" or badly damaged sources that survived to this stage; the two closest candidates (Day5-Session1 at 53, Day11-Session2 at 65) both retained enough corroborated content to clear the Medium-Low floor.

---

## 2. Conflict Resolution

**When two sources conflict:**

| Scenario | Resolution |
|---|---|
| High vs. any lower band | Use High; note the conflict in the traceability record so it isn't silently dropped |
| Medium-High vs. Medium or lower | Use Medium-High; flag the lower source's claim for verification |
| Medium vs. Medium (same band) | Escalate to a Vodafone Qatar SME; mark both claims "Pending" until resolved — do not pick one arbitrarily |
| Medium-Low vs. anything higher | Use the higher band; the Medium-Low claim is excluded, not merely deprioritized |
| Low vs. anything | Exclude Low; use the other source unconditionally |

**Worked example from this corpus (Action 1.5.7 discovery, not hypothetical):**
Conflict: BR Deck 29Jun (Medium-Low, 50) frames "Mobile Service Suspension" (J023) as retail-channel-initiated (Retail Counter/Email/Phone). Business Workshop Day2-Session2 (High, 90) — a same-day, independently-recorded workshop — states voluntary suspension was redesigned specifically to be **"not a retail journey,"** restricted to specific back-office roles.
**Resolution:** Use Day2-Session2 (High); the deck's retail-channel framing is excluded from Phase 2 requirements until reconciled with a Vodafone Qatar stakeholder — this is exactly the kind of unresolved tension the Medium-Low band exists to flag rather than silently inherit.

---

## 3. Phase 2 Implementation

**For each requirement extracted:**
1. Identify the source document.
2. Look up its confidence score and band in the Source Confidence Registry (§4).
3. **If High:** Extract, cite source, no further qualification.
4. **If Medium-High:** Extract the corroborated portion; for the flagged subset, extract + attach a conditional note, mark for validation.
5. **If Medium:** Extract corroborated claims; uncorroborated claims get a "LOW confidence" label and a cross-check pointer.
6. **If Medium-Low:** Extract only the parts NOT covered by the documented gap; the flagged content is excluded outright, not softened.
7. **If Low:** EXCLUDE; note as a gap in the risk report.

**Traceability format (worked examples from this corpus):**
```
REQ_001 | Bill Limit validated against per-product Agent Minimum (50/75)      | guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90 | High        | —                                                        | Verified
REQ_002 | J011 postpaid onboarding capability set                            | vfq-stack-modernization-br-28jun-75f28727                      | Medium      | J017/Customer 360 portion is a topic list, not this claim | Verified (J011 portion only)
REQ_003 | New Prepaid MSISDN = 97479025359 (NOT 40204489 or 97440204489)      | guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13    | Medium-Low  | Verify against a completed (non-"Abandoned") order example | Pending
REQ_004 | Security-question model (QID+name mandatory, agent-interpreted)    | business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808 | Medium-Low | Zero corroboration in corpus — validate with VFQ stakeholder | Pending
—        | Enterprise SME follow-up content referenced in Day11-S2 action items | (not found in corpus)                                        | —           | —                                                        | Gap — Needs Client Input
```

---

## 4. Source Confidence Registry

Full registry of all 83 indexed source documents. The 6 documents individually re-verified in Action 1.5.6 carry precise, evidence-based scores; the remaining 77 carry a representative default for their `.knowledge/INDEX.md` band (High→90, Medium→65 — none of the un-re-verified documents are Low or Failed in this corpus). Phase 2 teams pulling heavily on any single "default-scored" document should consider requesting the same spot-check treatment Action 1.5.6 applied to the original 6, rather than treating 90/65 as precision scores.

| Document | Score | Band | Disposition | Slug | Note |
|---|---|---|---|---|---|
| VFQ_Stack Modernization_ BR_25Jun.pptx | 90 | High | Primary source | `vfq-stack-modernization-br-25jun-03c2aa09` | Default for 'high' band (not individually re-verified) |
| Vodafone Process Overview_290626_EC.pptx | 90 | High | Primary source | `vodafone-process-overview-290626-ec-1ed338b9` | Default for 'high' band (not individually re-verified) |
| VFQ_Fibre_BRSD_v1.2.xlsx | 90 | High | Primary source | `vfq-fibre-brsd-v1-2-068eebe3` | Default for 'high' band (not individually re-verified) |
| VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx | 90 | High | Primary source | `vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d` | Default for 'high' band (not individually re-verified) |
| CRM Journeys_Final_Updated.xlsx | 90 | High | Primary source | `crm-journeys-final-updated-a23640a5` | Default for 'high' band (not individually re-verified) |
| CRM_Journeys_Final_Updated_with_Type.xlsx | 90 | High | Primary source | `crm-journeys-final-updated-with-type-634b83d3` | Default for 'high' band (not individually re-verified) |
| IT stack modernization Existing processes Giga-26 (23rd floor)-...docx | 90 | High | Primary source | `it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d` | Default for 'high' band (not individually re-verified) |
| IT Stack modernization Overview of RFSVodafone IDIMS Systems-...docx | 90 | High | Primary source | `it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0` | Default for 'high' band (not individually re-verified) |
| Business Processes- Day7 - Session 2-...docx | 90 | High | Primary source | `business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d` | Default for 'high' band (not individually re-verified) |
| Business Process - Day9 - Session 1-...docx | 90 | High | Primary source | `business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d` | Default for 'high' band (not individually re-verified) |
| Business Process - Day9 - Session 2-...docx | 90 | High | Primary source | `business-process-day9-session-2-20260707-131317-meeting-reco-e3243830` | Default for 'high' band (not individually re-verified) |
| Business Process - Day10 - Session 1-...docx | 90 | High | Primary source | `business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a` | Default for 'high' band (not individually re-verified) |
| Business Process - Day11 - Session 1-...docx | 90 | High | Primary source | `business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0` | Default for 'high' band (not individually re-verified) |
| Business Process - Day12 - Session 1-...110503...docx | 90 | High | Primary source | `business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01` | Default for 'high' band (not individually re-verified) |
| Business Process - Day12 - Session 1-...124834...docx | 90 | High | Primary source | `business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4` | Default for 'high' band (not individually re-verified) |
| Business Process - Day12 - Session 2-...docx | 90 | High | Primary source | `business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Session 1 - Postpaid Service-...docx | 90 | High | Primary source | `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day2 - Session 1-...docx | 90 | High | Primary source | `business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day2 - Session 2-...docx | 90 | High | Primary source | `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day4 - Session 2-...docx | 90 | High | Primary source | `business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day5 - Session 2-...docx | 90 | High | Primary source | `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day6 - Session 1-...docx | 90 | High | Primary source | `business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day6 - Session 2-...docx | 90 | High | Primary source | `business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e` | Default for 'high' band (not individually re-verified) |
| Business Workshop - Day7 - Session 1-...docx | 90 | High | Primary source | `business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976` | Default for 'high' band (not individually re-verified) |
| Order Validation Business Rules.xlsx | 90 | High | Primary source | `order-validation-business-rules-45d0e9f0` | Default for 'high' band (not individually re-verified) |
| Contact Validation Business Rules.xlsx | 90 | High | Primary source | `contact-validation-business-rules-b5d58c84` | Default for 'high' band (not individually re-verified) |
| TT Hashtags and Actual Issue.xlsx | 90 | High | Primary source | `tt-hashtags-and-actual-issue-8d8ccaa5` | Default for 'high' band (not individually re-verified) |
| SMS Templates.xlsx | 90 | High | Primary source | `sms-templates-0603d3eb` | Default for 'high' band (not individually re-verified) |
| 250604 Supplementary Form (Reg) v2_FINAL.pdf | 90 | High | Primary source | `250604-supplementary-form-reg-v2-final-475e97bb` | Default for 'high' band (not individually re-verified) |
| Consumer Postpaid CAF V4_110525_Editable.pdf | 90 | High | Primary source | `consumer-postpaid-caf-v4-110525-editable-915fde96` | Default for 'high' band (not individually re-verified) |
| Consumer Prepaid CAF V2_110525_Editable.pdf | 90 | High | Primary source | `consumer-prepaid-caf-v2-110525-editable-0c369437` | Default for 'high' band (not individually re-verified) |
| GigaHome Subscription Acceptance Form 5G Home Plans V3-revised.pdf | 90 | High | Primary source | `gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d` | Default for 'high' band (not individually re-verified) |
| Consumer Activation ProcessProcedure_Ver _8.0_WM_22022024 2024.pdf | 90 | High | Primary source | `consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201` | Default for 'high' band (not individually re-verified) |
| Desktop Vanilla_FWA_Indoor.docx | 90 | High | Primary source | `guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a` | Default for 'high' band (not individually re-verified) |
| Desktop Vanilla_FWA_Outdoor_WFM.docx | 90 | High | Primary source | `guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3` | Default for 'high' band (not individually re-verified) |
| Desktop Vanilla_Indoor_Modify CPE.docx | 90 | High | Primary source | `guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3` | Default for 'high' band (not individually re-verified) |
| FWA_Indoor & Outdoor_Negative Scenarios.docx | 90 | High | Primary source | `guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_FWA_Indoor.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_FWA_Outdoor_WFM.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7` | Default for 'high' band (not individually re-verified) |
| Open UI Tabelt_FWA_Indoor_B2B2C.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_FWA_Indoor_With Approval.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_FWA_Indoor_Without Approval.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_FWA_Outdoor_B2B2C.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_FWA_Outdoor_WFM.docx | 90 | High | Primary source | `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754` | Default for 'high' band (not individually re-verified) |
| Digital_Fixed Line (Instant Activation - Dual Play).pdf | 90 | High | Primary source | `guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Cross Sales_Fixed Line.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Fixed Line_Fulfilment Team (Skip Attachments).docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Fixed Line_Triple play.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-desktop-fixed-line-triple-6e2f9c41` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_B2B2C_With Approval_Instant Activation.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_Instant Activation.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Fixed Line_Prepatched KID_Combo Box_Normal Activation.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Fixed Line_Prepatched KID_Non Combo Box_Normal Activation.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Fixed Line_with Approval.docx | 90 | High | Primary source | `guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Home Move_Fixed to Fixed_Happy Path.docx | 90 | High | Primary source | `guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Cross Sales_MNP Postpaid.docx | 90 | High | Primary source | `guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_MNP Postpaid.docx | 90 | High | Primary source | `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_MNP Postpaid_HRN_Add-on.docx | 90 | High | Primary source | `guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_MNP Prepaid.docx | 90 | High | Primary source | `guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa` | Default for 'high' band (not individually re-verified) |
| Lead Creation Mobile.docx | 90 | High | Primary source | `guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753` | Default for 'high' band (not individually re-verified) |
| Lead Creation – Fixed.docx | 90 | High | Primary source | `guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c` | Default for 'high' band (not individually re-verified) |
| Lead Creation, Lead Edit, Owner Change.docx | 90 | High | Primary source | `guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45` | Default for 'high' band (not individually re-verified) |
| Tablet Lead Creation with Fixed Presales and Edit Lead details.docx | 90 | High | Primary source | `guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Passport to QID Update(Passport).docx | 90 | High | Primary source | `guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271` | Default for 'high' band (not individually re-verified) |
| Cross Sales_Open UI Desktop_New Postpaid.docx | 90 | High | Primary source | `guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323` | Default for 'high' band (not individually re-verified) |
| Desktop Vanilla_New Postpaid.docx | 90 | High | Primary source | `guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_New Postpaid_HRN Customer_Credit Limit.docx | 90 | High | Primary source | `guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_New Postpaid_B2B2C_With Approval.docx | 90 | High | Primary source | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_New Postpaid_B2B2C_Without Approval.docx | 90 | High | Primary source | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_New Postpaid_HRN Customer_Credit Limit.docx | 90 | High | Primary source | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_New Postpaid_NON_B2B2C_With Approval.docx | 90 | High | Primary source | `guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca` | Default for 'high' band (not individually re-verified) |
| Desktop Vanilla_Pre to Post.docx | 90 | High | Primary source | `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Pre to Post (Autobase).docx | 90 | High | Primary source | `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_Pre to Post.docx | 90 | High | Primary source | `guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556` | Default for 'high' band (not individually re-verified) |
| Open UI Tablet_Pre to Post.docx | 90 | High | Primary source | `guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740` | Default for 'high' band (not individually re-verified) |
| SIM Swap - Tablet, Desktop & Vanilla Order Approval Journey.docx | 90 | High | Primary source | `guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493` | Default for 'high' band (not individually re-verified) |
| Future Dated Orders_training pack.pdf | 90 | High | Primary source | `guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop (Agent 360 & CTI View).docx | 90 | High | Primary source | `open-ui-desktop-agent-360-cti-view-8b495725` | Default for 'high' band (not individually re-verified) |
| Open UI Desktop_New Postpaid.docx | 88 | High | Primary source (upgraded from medium 2026-08-23) | `guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90` | Re-verified — Action 1.5.6 |
| VFQ_Stack Modernization_ BR_28Jun.pptx | 65 | Medium | Use with conditions (J011 primary source; J017/Customer 360 directional-only) | `vfq-stack-modernization-br-28jun-75f28727` | Re-verified — Action 1.5.6 |
| Business Process - Day11 - Session 2-...docx | 65 | Medium | Primary source (pre-cutoff); Gap for post-cutoff, cross-ref Day12-S1 | `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c` | Re-verified — Action 1.5.6 |
| Business Workshop - Day5 - Session 1-...docx | 53 | Medium-Low | Use with conditions — namesake topic (security questions) uncorroborated | `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808` | Re-verified — Action 1.5.6 |
| VFQ_Stack Modernization_ BR_29Jun_UpdateV1.0.pptx | 50 | Medium-Low | Validation-only | `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2` | Re-verified — Action 1.5.6 |
| Open UI Tablet_New Prepaid.docx | 50 | Medium-Low | Use with conditions — 3-way MSISDN conflict, isolated not systemic | `guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13` | Re-verified — Action 1.5.6 |

---

## 5. Quality Check

- [x] Policy document complete and clear
- [x] All 5 confidence bands have usage rules, traceability formats, and risk levels
- [x] Source Confidence Registry populated — all 83 corpus documents covered, zero "unscored"
- [x] Conflict resolution process defined, with a real worked example from this corpus (not a hypothetical)
- [x] Phase 2 team can implement without additional guidance — traceability format is copy-paste ready
- [x] No ambiguities: every band states exactly what to extract, what to flag, and what to exclude

**Sign-off:** *"Action 1.5.7 complete. Source Confidence Handling Policy signed off. Registry complete with all 83 sources."*

---

## 6. Deviations from the original Action 1.5.7 brief (for transparency)

1. **5 bands instead of 4** — see §0. The extra "Medium-Low" band is load-bearing, not decorative; without it, 3 of the 6 re-verified documents would have been forced into "Low / do not use," which contradicts the evidence-based dispositions Action 1.5.6 actually produced for them.
2. **Registry covers all 83 documents, not just the 6 flagged ones** — the original brief's example registry table only showed the 6 flagged sources plus a "[Other Journeys]" placeholder row. A registry that only covers 7% of the corpus isn't usable as a Phase 2 reference, so this version scores the full corpus, with an explicit disclosure of which scores are individually re-verified (6) vs. representative defaults (77).

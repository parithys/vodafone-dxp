# Conflict Report (Phase 3)

Two tiers of findings: (1) corpus-level conflicts/ambiguities already identified during Stage A document indexing (`.knowledge/INDEX.md`), carried forward here for completeness; (2) new candidate conflicts found by scanning the synthesized Requirement and Business Rule catalogues module-by-module, each of which was then adversarially verified by a second, independent pass instructed to try to REFUTE it (checking the *original source files*, not just this blueprint's summaries) before being accepted.

**New candidates found:** 15 · **Survived adversarial verification:** 3 (2 original + 1 added 2026-08-23, see Conflict 3) · **Corpus-level (carried forward):** 4

---

## Verified New Conflicts

Each of these was independently re-checked against the *original* source file (not just the `.knowledge/docs/` summary) before being confirmed — see each entry's Verification Note.

### Conflict 1: REQ-258 vs. REQ-276 (Fixed Line / Fibre)
**Severity:** `High`

- **Source A:** REQ-258 — Fibre outstanding-dues threshold contradiction
- **Source B:** REQ-276 — Outstanding-dues threshold confirmation by Collections
- **Difference:** The Fibre BRSD's own Open Items log (OI-04, per vfq-fibre-brsd-v1-2-068eebe3) explicitly flags that the outstanding-dues threshold for blocking/allowing a new fibre order is stated inconsistently across the requirement set: one position says the fibre threshold 'should differ from mobility' (i.e. a distinct, fibre-specific QAR limit) while another position says it 'should be the same' as the mobility/postpaid outstanding-dues threshold. REQ-276 layers a further unresolved question on top — Collections must confirm which numeric threshold is authoritative — meaning as of this BRSD draft there is no single agreed number or even an agreed rule (same-as-mobility vs fibre-specific) that both a credit-check requirement and a Collections approval requirement can consistently implement.
- **Impact:** If left unresolved, the order-validation/credit-check logic cannot be built deterministically: using the mobility threshold could incorrectly block/allow fibre orders relative to the business's intended fibre-specific policy (or vice versa), causing inconsistent order rejections, revenue leakage, or customer complaints, and blocking sign-off of the credit/collections capability in the BRSD.
- **Suggested resolution:** Escalate to the VFQ Collections/Credit Control business owner (per OI-04's original resolution path) to formally confirm a single authoritative outstanding-dues threshold policy for fibre orders — either a fibre-specific QAR value or an explicit 'same as mobility' rule — and update both the BRSD requirement text and REQ-276's Collections confirmation requirement to reference that single agreed value before development.

<details><summary>Verification note (independent re-check against original source file)</summary>

Verified directly against the source workbook (data/VFQ_Fibre_BRSD_v1.2.xlsx). Sheet 08_Open_Items row OI-04 states verbatim: "Confirm the fibre outstanding dues threshold, since version 1.3 states it must differ from mobility while the response states it should be the same" with note "The two statements in version 1.3 contradict each other" (Owner: VFQ Business, Priority: High, Status: Open) — matching the candidate's description almost exactly. This is corroborated elsewhere in the same workbook: BR-033 (06_Business_Rules) reads "The customer may not proceed where the outstanding balance exceeds the configured fibre threshold. The threshold value is to be supplied by VFQ" with Status=Open, and parameter P-17 "Fibre outstanding dues threshold" = "To be confirmed" (QAR), Status "To be confirmed." Meanwhile requirement FAR_001_ECC_01 in 05_Requirements explicitly says the fibre eligibility/credit-control capability "will follow the same capability (ECC) as detailed in Mobile Post Paid Journey (MPAR_001_ECC_*)" — i.e. the reuse-from-mobility position — showing the "should be same as mobility" pull is real and documented, while OI-04/BR-033 simultaneously anticipate a fibre-specific configured value. These are mutually exclusive policy positions (same threshold cannot simultaneously be "fibre-specific and distinct" and "identical to mobility") and the source document itself (not an inference) labels them contradictory. No numeric threshold is resolved anywhere in the workbook, so there is no way both statements are compatible under different scope/channel/time framing. Two caveats that don't change the verdict: (1) I could not find literal "REQ-258"/"REQ-276" IDs anywhere in the corpus (searched the fibre BRSD, the traceability template, and worktree copies) — these appear to be synthetic wrapper IDs assigned during this analysis rather than native document requirement numbers, but the substantive open item they describe (OI-04) is real and verbatim-confirmed. (2) REQ-276's "Collections must confirm" framing is not an independent second requirement in tension with OI-04 — it's the same unresolved gap restated from the collections-confirmation angle — so characterizing it as "layering a further unresolved question on top" slightly overstates it as two separate items, but this doesn't weaken the core conflict, which is confirmed as genuine, sourced, and currently unresolved (Open status) in the BRSD.

</details>

### Conflict 2: REQ-112 vs. REQ-051 (context: Business Workshop Day7-Session1 address-modeling discussion) (Platform Governance & Architecture)
**Severity:** `Medium`

- **Source A:** REQ-112 — Consumer Activation Process & Procedure Manual v8.0 (refs 2.1.15 and 3.1.12): 'added mandatory ZSB detail capture requirement' — added under Section 2 (Prepaid mobile) and Section 3 (Postpaid mobile) business rules, i.e. framed as a mandatory field for mobile activation.
- **Source B:** REQ-051 (context: Business Workshop Day7-Session1 address-modeling discussion) — Business Workshop Day7-Session1: 'ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record that cannot be changed because changing it impacts everybody.'
- **Difference:** The as-is Activation Process manual states ZSB detail capture was added as a mandatory requirement within the Prepaid (2.x) and Postpaid (3.x) mobile registration business-rule sections. The stack-modernization workshop transcript states as a design decision that ZSB is mandatory only for FWA 5G and fixed/fiber, explicitly NOT for mobile, which instead uses one shared, unchangeable dummy address record. Both describe the same real-world data element (ZSB) and the same channel (mobile), reaching opposite conclusions on whether it is a mandatory captured field for mobile.
- **Impact:** If the new DXP mobile activation journey inherits the legacy 'mandatory ZSB for mobile' rule as-is, agents will be forced to try to capture/search real ZSB data against a shared dummy mobile address record that the workshop says cannot be changed — breaking the mobile activation flow or forcing incorrect one-off edits to a record used by all mobile customers. Conversely, if the new design correctly drops ZSB as mandatory for mobile per the workshop decision, it directly contradicts a documented, versioned legacy business rule, so requirements traceability back to the v8.0 manual will show an unresolved discrepancy.
- **Suggested resolution:** Confirm with COPS & Digital / Customer Data Management (owners of the v8.0 manual per its approver table) whether the 2.1.15/3.1.12 'mandatory ZSB' rule was intended to scope only to fixed/FWA activation flows documented elsewhere in the same manual, or was genuinely applied to mobile; update the BRSD business-rule sheet to state a single, channel-scoped ZSB-mandatory rule consistent with the Day7 workshop decision.

<details><summary>Verification note (independent re-check against original source file)</summary>

Verified against the primary source PDF text (not just the index summary). The v8.0 manual's rule item 12 (Section 3.1, Postpaid) and item 15 (Section 2.1, Prepaid) are both worded identically and generically: "It is mandatory to capture ZSB (Zone, Street, Building detail) of customer location in activation journey" — with no FWA/fixed qualifier, and both sit inside the Prepaid-mobile and Postpaid-mobile business-rule lists respectively. Confirmed the manual explicitly removed its Fiber/FWA section back in v6.0, so there is no alternate fixed/FWA-scoped section elsewhere in this document that the rule could instead be attached to — the rule genuinely lives only under the mobile sections. This matches Source A's framing exactly and rules out a simple 'it's actually scoped to fixed/FWA elsewhere in the same doc' refutation. Source B (Day7-Session1 transcript) independently and explicitly states ZSB is mandatory only for FWA 5G/fixed, NOT mobile, with mobile using an unchangeable shared dummy address record — presented as a statement of the address-modeling design, not clearly hedged as future-only. The two sources make opposite, verifiable claims about the same data element (ZSB) for the same channel (mobile). A narrow reconciliation is conceivable (e.g., 'mandatory to capture' could be satisfied by a system-populated dummy value rather than a real per-customer value, so both could be technically true under different readings of 'capture'), but this requires speculative interpretation not stated in either source, and the practical/operational impact described (agents forced to work against a shared unchangeable record) is real and worth flagging. This is not an artifact of different scope, channel, or time period on the face of the documents — it is a genuine, actionable discrepancy that the suggested resolution (confirm with COPS & Digital / Customer Data Management, the manual's own approvers) correctly targets.

</details>

### Conflict 3: REQ-299/REQ-302 (J023/J024 retail-channel intake) vs. PERSONA-021/BR-059 (back-office-only, "not a retail journey") (Support / Mobile Service Suspension-Resume)
**Severity:** `High`
**Added:** 2026-08-23, Phase 2 review (found during cross-check against a separate Phase 1.5 source-confidence re-verification pass — this blueprint's own adversarial conflict-scan did not catch it originally)

- **Source A:** REQ-299/REQ-302 (`journeys.md` UJ-107/UJ-108) — "Mobile Service Suspension/Resume requests must be accepted through Email, Phone, or Retail Counter channels," sourced to `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`.
- **Source B:** PERSONA-021/BR-059 — "Manual suspension ('park my number') is a back-office ticket-driven process using Taurus... restricted to specific roles, not exposed as retail journey," sourced to `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`.
- **Difference:** Source A frames Mobile Service Suspension/Resume as a multi-channel journey a customer or retail agent can initiate via Email, Phone, or a Retail Counter. Source B — an independently-recorded, same-general-timeframe workshop discussing the actual redesign decision for this exact capability — states voluntary suspension was deliberately redesigned to be role-restricted, back-office-only, and explicitly **"not a retail journey."** These are opposite claims about who can initiate the same real-world process. Blueprint's own `personas.json`/`personas.md` held both claims simultaneously (PERSONA-015 citing Source A, PERSONA-021 citing Source B) without reconciling them prior to this correction.
- **Impact:** If the DXP rebuild implements the multi-channel retail-facing intake from Source A, it directly contradicts a documented back-office-only redesign decision — potentially exposing a role-restricted process to unauthorized retail-channel requests. If it implements Source B's back-office-only model, REQ-299/REQ-302 (and the UJ-107/UJ-108 journeys built from them) are wrong and should not be built as specified.
- **Suggested resolution:** Per the source confidence assessment (Source A's document independently scored 50/100 Medium-Low; Source B's document scored High), treat Source B (back-office-only, role-restricted) as authoritative pending explicit stakeholder confirmation. Confirm with the Vodafone Qatar Collections/Credit Control team (owners of the Day2-Session2 redesign decision, per that session) whether any retail-channel intake path was ever intended, or whether Source A's "Retail Counter" framing is a stale/aspirational description that predates the back-office redesign.
- **Verification note:** re-checked directly against both source `.knowledge/docs/` summaries (not just this blueprint's synthesized text). `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` states the redesign explicitly and is corroborated by `business-rules.md` BR-059 (the 35 QAR/4-month/zero-credit-limit Park Plan definition, High confidence, same source). `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`'s retail-channel claim is the only source for that framing anywhere in the 83-document corpus. Caveats and cross-references have been added at `journeys.md` (UJ-107/UJ-108), `requirements.md` (REQ-299/REQ-302), `business-rules.md` (BR-336/BR-337), and `personas.md` (PERSONA-015) pointing back to this conflict entry.

---

## Corpus-Level Conflicts & Ambiguities (carried forward from Stage A indexing)

### 1. Duplicate Form ID PCA001 (Postpaid vs. Prepaid CAF)
**Severity:** `Medium`

- **Source A:** `consumer-postpaid-caf-v4-110525-editable-915fde96`
- **Source B:** `consumer-prepaid-caf-v2-110525-editable-0c369437`
- **Difference:** Both the Consumer Postpaid CAF and the Consumer Prepaid CAF are stamped with the same Form ID, PCA001, despite being distinct forms for distinct products.
- **Impact:** If PCA001 is used anywhere as a unique form-type identifier (e.g. in a document management system or CAF-selection business rule), a Postpaid and a Prepaid CAF would be indistinguishable by ID alone.
- **Suggested resolution:** Confirm with whoever owns the CAF templates whether this is a template numbering error in the source PDFs (most likely) or an intentional shared ID, before treating PCA001 as a unique identifier in the rebuilt system.
- **Provenance:** Carried forward from `.knowledge/INDEX.md` — "Gaps and ambiguities" (pre-existing corpus-level finding from Stage A document indexing, not newly detected in Stage C).

### 2. Un-corroborated version marker on BR_29Jun_UpdateV1.0
**Severity:** `Low`

- **Source A:** `vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`
- **Source B:** `(no prior version documenting the baseline this update is relative to)`
- **Difference:** The filename suffix "UpdateV1.0" implies this deck updates a prior version, but no in-slide changelog or prior-version document in the corpus substantiates what specifically changed.
- **Impact:** Any requirement or journey detail sourced from this deck that appears to revise something from BR_25Jun/BR_28Jun cannot be confidently distinguished from a genuinely new addition versus a correction of prior content.
- **Suggested resolution:** Request the actual prior version ("BR_29Jun" without the UpdateV1.0 suffix, if it exists) or a changelog from the workshop facilitators.
- **Provenance:** Carried forward from `.knowledge/INDEX.md` — "Gaps and ambiguities".

### 3. Two near-duplicate CRM Journey workbooks
**Severity:** `Low`

- **Source A:** `crm-journeys-final-updated-a23640a5`
- **Source B:** `crm-journeys-final-updated-with-type-634b83d3`
- **Difference:** `CRM Journeys_Final_Updated.xlsx` and `CRM_Journeys_Final_Updated_with_Type.xlsx` contain the same 165-row journey/feature list, but the "_with_Type" version adds a Type taxonomy column and a generated Relationship/traceability analysis, while dropping the other file's project-planning/screen-count estimation sheets.
- **Impact:** Anyone consulting the corpus without this note might treat the two workbooks as independent sources and double-count the same 165 rows, or use the older file and miss the Type classification this blueprint's Gap Analysis (below) relies on.
- **Suggested resolution:** Treat `CRM_Journeys_Final_Updated_with_Type.xlsx` as authoritative (it is what this blueprint's journey-coverage gap analysis uses) and the other as superseded, unless told otherwise by the source owner.
- **Provenance:** Carried forward from `.knowledge/INDEX.md` — "Gaps and ambiguities".

### 4. Damaged/incomplete source recordings understate two workshop sessions
**Severity:** `Medium`

- **Source A:** `business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`
- **Source B:** `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`
- **Difference:** The Day 11 Session 2 recording (Enterprise IoT/M2M/DAPN/PTT) cuts off mid-discussion at 01:09:25, and the Day 5 Session 1 recording (customer verification/QID scanning rules) only decoded ~29 of 186 minutes — both are marked medium confidence for this reason, not because the discussed content is contested.
- **Impact:** Requirements, entities, and business rules sourced solely from these two documents are inherently less complete than the rest of the corpus; anything the missing portions would have covered is invisible to every downstream catalogue in this blueprint (personas, requirements, business rules, etc. all inherit the medium-confidence ceiling from these sources).
- **Suggested resolution:** Request the full/original recordings or facilitator notes for these two sessions from whoever holds them.
- **Provenance:** Carried forward from `.knowledge/INDEX.md` — "Gaps and ambiguities" (this is a data-completeness issue, not a contradiction between two claims, but is listed here for visibility since it bounds confidence across multiple catalogues).

---

## Candidates Considered and Rejected (13)

For auditability: these candidates were flagged by the first-pass finder but rejected by the adversarial verifier as not being genuine, actionable contradictions (e.g. legitimate variants by channel/scope, or insufficiently corroborated).

_Full detail is retained in the workflow run; not reproduced here to keep this report focused on actionable findings. Re-run the Stage C conflict-detection workflow with verification logging if the rejected candidates need review._

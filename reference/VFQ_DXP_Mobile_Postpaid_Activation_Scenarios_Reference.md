# Mobile Postpaid Activation - scenarios for the journey design prototype

Generated 2026-10-10 from four parallel passes: the BRSD, the guided-journey walkthroughs, the workshop / process-manual rules, and an audit of the running prototype. Evidence over inference: where sources conflict or are silent, the row says so and no rule is invented.

## How to read this

**Evidence** (what the sources say)
- **E** - evidenced in a source.
- **D** - appears only in the BRSD v0.1 *draft* (see caveat 1).
- **C** - sources conflict.
- **O** - open: marked TBD / owed / never stated.

**Prototype** (what `vfq-dxp-app` does today)
- **Built** - implemented.
- **Partial** - implemented in part, or demo-only.
- **Stub** - the UI exists but does nothing real.
- **No** - not in the prototype.
- **Conflict** - the prototype contradicts a source.

Source keys: `BRSD2` = vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d (KB summary only); `BRSD0.1` = vfq-diagram-engine/BRSD/01 ... v0.1.xlsx; `W1` `W2a` `W2b` `W5a` `W5b` `W7` = business-workshop sessions; `BP9a/b` = business-process Day 9; `G26` = IT stack existing-processes; `SOP` = Consumer Activation Process v8.0 PDF; `J011` = Day 1 kickoff deck; `GJ-<suffix>` = Guided Journey (8-hex slug suffix); `CR` = blueprint/conflict-report.md; `OQ` = Postpaid Open Questions workbook.

## Caveats that change how to use this list

1. **BRSD v2.0 requirement text is not on disk.** Only a thin KB summary exists. The only requirement-level BRSD text is v0.1, a Draft (84 requirements) with a different use-case ID, channel scope and numbering. Everything tagged **D** is a proposal, not an agreed rule. Supplying `VFQ_Mobile_Postpaid_Activation_BRSD_V2.0.xlsx` would let this be re-run against the real requirements.
2. **MNP, B2B2C and manager approval are not defined in the BRSD.** They come from guided journeys and workshops.
3. **Guided journeys are QA/demo runs on test data.** Screenshots span 2025-04 to 2026-05, so flows can differ between captures.
4. **The prototype audit was read from code and seed data, not executed.** Per-customer outcomes were evaluated by hand against the engine.

---

> **Section H (named scenario catalogue, SC-xx)** was added 2026-10-10 for the design prototype: it lists every customer-type, eligibility, hard-stop, soft-stop, approval and exception scenario by name, with its stop type, evidence and the seeded customer that exercises it. Sections A-G are the wider stage-by-stage view.

## A. Dimensions every scenario varies on

Design the prototype so each of these is a selectable variable, not a separate journey.

| Dimension | Values (evidence) |
|---|---|
| Customer relationship | New customer; existing customer adding a line (BRSD2); NAS-only person (prototype) |
| Segment | Qatari; Expat (QID); Safwa / Safwa Plus; HRN-nationality expat; B2B2C employee; Retired; MADA; VIP (bill-cycle only). Enterprise is out of scope until consumer is done (G26) |
| ID type | QID; Diplomatic ID; Passport; GCC ID (postpaid allowed on QID only, per W1 - **C** with SOP / BRSD0.1 which add Diplomatic; see C-3) |
| Number source | New number (Reserved / Star / Free); MNP port-in number |
| SIM | Physical; Printed eSIM; Virtual eSIM |
| Contract capture | Digital CAF; Touch-screen CAF; Manual (paper) CAF |
| Entry point | Walk-in; Cross-sales offer; Lead; Resumed draft; Saved search / Customer 360 |
| Channel / device | Retail desktop (Open UI); Tablet; Direct sales / mass market; Offshore airport (SOP legacy); Telesales (BRSD0.1 only) |
| Outcome | Complete; Submitted for approval -> approved / rejected-correction / rejected-drop; Pending government verification (D); Draft; Abandoned |

---

## B. Scenario catalogue by stage

### B1. Journey start, session and resume

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 1.1 | Agent authenticated and authorised for the journey; role-gated start | D (BRSD0.1 JSM_01/02); privilege matrix TBD (OQ-Q29) | Built (persona/role grants) |
| 1.2 | Start from a Qnomy ticket, or with Qnomy unavailable (fallback, timeout unspecified) | D JSM_03; O (D-04 owed) | No |
| 1.3 | Tracking record auto-created on start, resolved on completion, audit history | D JSM_04 | No |
| 1.4 | Draft saved at each validated stage; resume by same agent re-runs validations | D JSM_05/06; W2a [00:39-00:44] | Built (Save & Exit, resume re-runs eligibility) |
| 1.5 | Supervisor reassigns a draft to another agent | D JSM_07 | No |
| 1.6 | Draft expiry creates a lead and releases reservations | D JSM_08, 30 days "to confirm" | No |
| 1.7 | Cross-agent / cross-channel pickup of a draft | W2a: same channel and process only; cross-channel O | No |
| 1.8 | Another entry point blocked while a journey is held for the customer | prototype behaviour | Built (customer lock) |
| 1.9 | Leave mid-journey: Save & Exit / Abandon (comment required) / Stay | prototype; Abandon deletes the draft | Built |
| 1.10 | Entry from a Cross-Sales "New Postpaid" offer, handing into the wizard | GJ-7b5ae323 | Built (flow `existing` only) |
| 1.11 | Entry from a lead (created, edited, reassigned, rejected; conversion to order never shown) | GJ-08523753, 53663c45, 0e35d62b, 0cfca63c | Partial (lead creation only via "Interested") |

### B2. Customer identification and KYC

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 2.1 | ID scan happy path: capture front/back, extract fields, MOI cross-check, fetch | D KYC_01/05; W1 [00:30-00:38] | Built |
| 2.2 | Scan misread / blurred, agent re-scans; attempts limited (4 in draft) | D KYC_03; OQ | Built (4 attempts, first pass blurred by design) |
| 2.3 | Attempts exhausted -> manual entry allowed under fallback; creates an approval task | D KYC_03 | Built (forces Sales Manager approval) |
| 2.4 | Agent cannot type ID manually, only re-scan (stated for SIM Swap) | W2b [01:00] | Conflict - prototype allows manual entry after 4 failures |
| 2.5 | Typed/scanned expiry differs from registry | prototype; MOI is primary (W1) | Built |
| 2.6 | No MOI and no NAS record: "No MOI record found" | prototype | Built |
| 2.7 | MOI result older than 30 minutes: "validate again" | D KYC_08 (X=30) | Built |
| 2.8 | MOI unavailable: retry, then local MOI data, then save as pending government verification, block final submission | D KYC_08; legacy ECR offline mode (SOP) | Partial (typed failures + retry x3 + controlled stop; no pending-verification state) |
| 2.9 | Duplicate registry matches: agent picks the record | prototype | Partial (demo fault panel only) |
| 2.10 | Valid ID is someone else's (fraud: barcode, OCR and MOI all pass) | W2b [01:04:31] | No (needs liveness / manager QID-edit; O) |
| 2.11 | Physical presence: original ID, photo match, front+back attached | SOP 3.1; W5a (partial recording) | Partial |
| 2.12 | Signature on ID missing -> passport signature -> thumbprint + signature (Retail) | SOP 3.1 ref 6 | No |
| 2.13 | Customer physically challenged / read-write challenged | SOP 3.2.2 | No |
| 2.14 | Representative acting for the customer (POA / attested letter) | SOP allows; BRSD0.1 KYC_10 forbids | No - **C** (C-5) |
| 2.15 | Contact validation: QID 11 digits, DOB matches QID, mobile 974 + 11 digits, passport 4-20 alnum, GCC 8-20 digits | E (Contact Validation Rules) | Built (alt phone, email, DOB, mandatory fields) |
| 2.16 | Email: "No Email" default `noemailid@vodafone.com`; verified asynchronously before first bill | E GJ, W2b; SOP requires valid email (**C**, C-12) | Partial |
| 2.17 | HRN flag derived from MOI nationality (list TBC: Bangladesh, Pakistan, Nepal in draft) | D KYC_06; O (D-08) | Built (list in ruleEngine) |
| 2.18 | New 18-year-old not yet in MOI (7-working-day lag) | SOP 3.1 | No |
| 2.19 | Expired QID permits modification only; MOI expiry derivation (+1 year interim) | D KYC_05/09; O | Partial (expired = hard stop) |

### B3. Customer / account outcome

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 3.1 | New customer: create customer + default primary contact | D CAM_01/08 | Built (flow `new`) |
| 3.2 | Existing customer: match on ID, update from MOI | D CAM_01-03 | Built (flow `existing`) |
| 3.3 | MOI-verified attributes read-only; address editable; email / language / alt phone agent-editable | D CAM_04/05/10 | Partial |
| 3.4 | Segment and account type derived from nationality matrix | D CAM_06/07; matrix owed | Partial (segment on record) |
| 3.5 | Multiple contacts / roles (Family Plan only) | D CAM_12/13 | No |
| 3.6 | Existing customer's employer on file implies B2B2C (approval at submit) | prototype | Built |

### B4. Eligibility, credit and customer type

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 4.1 | ID not valid for postpaid -> prepaid plans only | W1, J011 slide 4, BP-BR-330/331 | Conflict - prototype routes Passport / GCC to Back Office Fulfilment approval instead of hiding postpaid (OQ-Q02) |
| 4.2 | Under 18: hard stop | E SOP 3.1; D KYC_04 | Built (age 16 fixture; age exactly 18 passes) |
| 4.3 | Expired ID: hard stop; no expiry on file: approval-routing | E; prototype | Built |
| 4.4 | Blacklist: security = hard stop; unclassified = hard stop; collections = soft stop | E W1 [00:47-00:50]; category outcomes O (OQ-Q14) | Built |
| 4.5 | In collection only when overdue > 100 (currency unstated); a collections flag with no unpaid bill passes | E W1; threshold config O (D-07) | Built (balance > 0; threshold differs - O) |
| 4.6 | Customer has a deal that blocks new connections | prototype | Built (CUST-2001) |
| 4.7 | Line cap, expat: 2 postpaid, 5 total; Qatari 5 (SOP) or unlimited (W1, draft) | **C** (C-2); "per operator" O | Built (Qatari 5 / expat 2; approval above, hard stop at 5 expat) |
| 4.8 | 3rd to 5th postpaid line routes to Credit approval; held order; cancel on rejection | D ECC_06-09; SOP 3.2.2 | Built (Credit Control Agent) |
| 4.9 | Advisory when customer already holds 2+ postpaid lines ("check credit policy or seek credit control approval") | E GJ-48d70eca, 7b5ae323 | No (BR-265/266 not enforced) |
| 4.10 | Collections soft stop alternatives: Continue Prepaid, Proceed to Payment | prototype | Stub (both do nothing real) |
| 4.11 | Hard stop: only Abandon; auto-logged activity | prototype | Built |
| 4.12 | Distinct message per failure condition | D ECC_02 | Built |
| 4.13 | HRN: advance QR 100 banner; advance driven by nationality + channel, adjusted against first bill; blocks or not unresolved | E W1 [00:46-00:53], GJ-9d77c0e2; "blocks completion" vs empty grid still submitting is **C** (C-7) | Built (advisory + forces approval) |
| 4.14 | Credit limit: default 1,000 expat / 50 HRN (W5b); Qatari 4,000 (draft only) | E W5b; O Qatari | Built (50 / 1,000) |
| 4.15 | Agent edits credit limit at activation (presets 0-2,000) | E GJ-9d77c0e2 (800 -> 1,000); **C** with D ECC_11 (not amendable) | Not edited in the prototype's steps (C-6); preset dropdown absent |
| 4.16 | Customer type: Standard / B2B2C / Retired / MADA with Reject back to Standard | E GJ, BP-BR-256 | Built |
| 4.17 | B2B2C: pick company; Proof of Employment mandatory ("Please select Proof of Employment before continuing") | E GJ-f4fc93f7, e24116bd | Conflict - upload optional in prototype (BR-263/169) |
| 4.18 | Account already has Special Management value: confirm "continue without B2B2C?" | E GJ-48d70eca | No (BR-265/266) |
| 4.19 | Retired: government registry check (retry, then Continue as standard) | prototype | Partial (simulated) |
| 4.20 | MADA: ID upload mandatory when a special discount is added | D KYC_02, QPC_10 | Partial (approval trigger, not a gate) |
| 4.21 | Minor customer: Supreme Judicial Council + data-management approval | SOP legacy | No |
| 4.22 | Deposit: minimum QR 2,000 or valid credit card (CAF); applicability to a new retail sale unclear | E CAF; O (OQ section 3) | Stub ("Add Deposit" only) |

### B5. Address

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 5.1 | Address captured (Zone / Street / Building / unit) | **C** - SOP: mandatory; W7: fixed/FWA only, mobile uses a dummy record (CR Conflict 2; OQ-Q42-44 open) | Built, optional and auto-passes |
| 5.2 | Qatari ID prefills registered address; editable | prototype | Built |
| 5.3 | Skip Address (GJ shows it; fields Mandatory: No) | E GJ, FLD-523-526 | Built |

### B6. Plan, add-ons, discounts, bill limit

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 6.1 | Plans shown by segment / connection type | D QPC_01 | Built (tabs: Offers, Plans, Standard BAU, Special) |
| 6.2 | Pre-bundled offer plan locks add-ons and discounts | prototype; BP-BR-154 (fixed source) | Built |
| 6.3 | Accepted cross-sell offer fixes the plan and skips plan/add-on steps | E GJ-7b5ae323 | Built |
| 6.4 | Add-on eligibility by plan / nationality / customer type / ID type; ineligible dropped | D QPC_02/04; prototype | Built |
| 6.5 | Add-on cardinality; recurring add-on not bought twice | D QPC_03; FDO pack (scope uncertain) | Partial |
| 6.6 | One discount per plan; changing plan resets add-ons and discounts | E; prototype | Built |
| 6.7 | Customer-benefit discounts auto-apply (Retired / MADA / B2B2C / loyalty) | prototype | Built (also applies on pre-bundled plans, a defect to review) |
| 6.8 | Bill limit below Agent Minimum: "Bill Limit can not be set lower than Agent Minimum N" (Mobile 50, Mobile Plus 75, 80 after admin change) | E GJ-f8227f90, 6cb03f33, 2847b2de | Built for 50 only; 75 / 80 not used |
| 6.9 | Order-level Validate error SBL-EXL-00151 (legacy overloaded code; do not reproduce raw) | E GJ-2847b2de | No |
| 6.10 | Bill limit capped at credit limit; communicate default limit | E OVR, BP-BR-250/228 | No (HRN 50 sits below the 115 plan MRC) |
| 6.11 | Add-on amount exceeding bill-limit headroom: "go back and edit limit" | E BP-BR-229/262; OQ-Q23 | No |
| 6.12 | Plan commitment / lock-in (3 months, certain plans) | E CAF; scope O | Partial |
| 6.13 | Special discount needs MADA doc | D QPC_10 | Partial |
| 6.14 | Offshore airport: only Extra and Essential plans | SOP legacy | No |
| 6.15 | Multi-SIM / iWatch up to 4 by plan | W5b; timing O | No |
| 6.16 | Cart amended / recalculated until submission | D QPC_05-08 | Built |

### B7. Number selection

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 7.1 | Reserved / Star / Free tabs; Star price-range filter (now single-select) | prototype; D NUM_01/02 | Built |
| 7.2 | Free band (price 0), plan entitlement: star free within entitlement, customer pays overage | E W1 [01:20-01:23]; formula O (D-02) | Built (entitlement = MRC x 25, assumed) |
| 7.3 | Agent holds capped at 2; only own holds shown on Reserved | prototype | Built |
| 7.4 | Number blocked / reserved by another agent: not offered | prototype | Built |
| 7.5 | Star lock-in: 1 year (QR 1,500-19,999), 2 years (20,000+); port-out blocked during lock-in | E CAF, G26, BP-BR-061 | Built (tiers) |
| 7.6 | Reservation holds: 90 d / 48 h / 30 d / 72 h | **C/O** (C-8) | No |
| 7.7 | Number inventory consumed or locked on submit | needed for any real flow | No (nothing writes to `numbers`) |
| 7.8 | Premium number charge collected at payment | E BRSD2 scope | Built (overage in "due today") |
| 7.9 | Auto-select not used for postpaid (priced) | E Day 6 S1 | Built |

### B8. SIM

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 8.1 | Physical SIM serial valid: 19 digits, exists, not assigned | E OVR; FWA negative-scenario doc | Built (not-in-stock, already-issued) |
| 8.2 | Serial not found / already assigned | E | Built |
| 8.3 | Printed eSIM (QR) | E W1 [01:33-01:41] | Partial |
| 8.4 | Virtual eSIM: code emailed only if email verified; dummy SKU, no depletion | E W1; O (OQ-Q39) | Partial (simulated) |
| 8.5 | Mobile roaming bar informed (offshore postpaid) | SOP | No |
| 8.6 | SIM inventory reserved then consumed after payment / fulfilment | D SIM_02/03, PAY_05/06 | No |

### B9. Billing account and billing profile

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 9.1 | Existing profile selected automatically; new profile otherwise | prototype | Built (auto-resolver) |
| 9.2 | Create new: contacts, address (same as communication), invoice recipient, media, cycle, payment profile, card tokenised (last 4 + token) | D BAM_01-04; W2b | Built (manual step reachable by going back) |
| 9.3 | Consumer cap: 2 billing profiles (one postpaid, one prepaid) hides Create New | E BP-BR-071 | Built, unreachable from seed data |
| 9.4 | Bill cycle: 1st or 15th by proximity; VIP 7th | D BAM_01; wording ambiguous | Built (no VIP seeded) |
| 9.5 | One plan per billing account; multi-plan carts | D BAM_03 | No |
| 9.6 | Billing profile setup incomplete blocks finalisation | E (card above) | Built |
| 9.7 | AutoPay / card details not visible to agents | E W2b | n/a |

### B10. Checkout, CAF, payment

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 10.1 | Pre-checkout validation: account status, compatibility, charges, deposits; failure blocks with corrective action | D CVC_01 | Partial |
| 10.2 | Key information shown before CAF, refreshes on cart change | D CAF_01 | Built |
| 10.3 | CAF digital / touch screen / manual (paper upload, PDF/JPG, 2 MB; G26 says 4 MB, **C**) | D CAF_02; E GJ | Built (manual not reachable under auto-detect) |
| 10.4 | Signature must match ID signature; agent ID + timestamp stamped; signed CAF not editable | E SOP, BP-BR-189, G26 | Partial (locks after signing) |
| 10.5 | Signature capture failure -> recapture | D CAF_02 | Partial |
| 10.6 | CAF consent clauses (first-month proration, card recovery after 90 days, direct-marketing opt-out) | E CAF | Partial |
| 10.7 | Supporting documents attached (QID front/back, Proof of Employment) | E GJ | Partial |
| 10.8 | Payment: WinCash success, declined, error with retry (4 retries in draft) | D PAY_02/03 | Built (simulated) |
| 10.9 | Payment session expiry with two recovery choices | prototype | Built |
| 10.10 | Pay with cash ("Proceed without WinCash") | prototype | Built (provenance unclear) |
| 10.11 | Zero-value payment still integrates WinCash for receipt | E W2a [00:59] | Partial |
| 10.12 | Payment before or after CAF | **C** (J011: after; GJ and prototype: before) | Built (before) |
| 10.13 | Device on Instalment branch (Full Payment vs DOI) | **C** (W1 defers; J011 has branch) | No |
| 10.14 | Handover SIM to customer | E SOP | n/a |

### B11. MNP port-in (a separate branch of the same journey)

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 11.1 | Entry via MNP tile or Cross-Sales "New MNP" offer | E GJ-6cb03f33, b0370d82 | No (separate older `NewMnpWizard`, no eligibility / checkout / payment) |
| 11.2 | Donor details: port-in number, donor ID type / number, donor type, subscription type; donor operator Ooredoo read-only | E GJ-6cb03f33, 10ba9743; BP9a | No |
| 11.3 | Donor attachment + MNP form e-signature; separate from CAF (two signatures; one-signature option open) | E G26 [01:27]; O | No |
| 11.4 | Consent SMS "switch" to 151 within 24 h; alert after signing | E BP9a, GJ | No |
| 11.5 | Donor decision: accept / reject / conditional (due over 100 QAR billed); 24 h SLA | E BP9a/b | No |
| 11.6 | Porting window Sun-Thu 11:00-12:00; cutoff 10:45; hard stop at NPass hours | E BP9a/b | No |
| 11.7 | Rejection: 13 documented reasons restart the journey; consumer uses reasons 1, 4, 9 | E BP9a/b; 13 vs 14-15 codes O | No |
| 11.8 | Declarations: postpaid unpaid bills settled within 30 days | E GJ, BP-BR-232 | No |
| 11.9 | Post-port-in dunning: final bill 30 days, outgoing bar day 31, incoming bar day 45 | E BP9a | No |
| 11.10 | Order result: Activation / Port-In, status Pending then Open, "NP_ACK: reached" | E GJ-10ba9743 | No |
| 11.11 | Temporary zero-value MSISDN during porting (to be removed) | E BP9a | No |
| 11.12 | No Number Selection step in MNP; new primary MSISDN assignment not shown | E GJ | No |
| 11.13 | Does HRN advance / age / collections / line cap apply to MNP | O | No |
| 11.14 | Approval for MNP port-in | O (app config routes to Sales Manager; no source) | No |

### B12. Submit, approval and post-activation

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 12.1 | Submit after successful payment -> Complete | E | Built |
| 12.2 | Approval-routed triggers (manual ID, B2B2C, HRN, line cap, ID type, missing expiry, MADA/B2B2C discount) | trigger set **O** in sources (OQ section 4) | Built (set is prototype-defined) |
| 12.3 | Manager approve (verification tick + comment), Reject - Correction, Reject - Drop, Go Back; one correction round-trip | E GJ-5c169dbc, e24116bd; BP-BR-162 (fixed source) | Built downstream; re-open after correction not built |
| 12.4 | Order expiry about 3 days; SMS to agent on rejection | E GJ (timestamps); BP-BR-172 | No |
| 12.5 | Order cannot be dropped without approval | E BP-BR-285 | n/a |
| 12.6 | Confirmation reads "order submitted", not "activated" | E W2a [01:01] | Partial (varies by persona) |
| 12.7 | Status Pending -> Open / In Progress -> Complete; line items fulfilled | E GJ-5c169dbc | Partial |
| 12.8 | Activity note, call-disposition form | E GJ-7b5ae323 | Partial |
| 12.9 | Linked modification order adding a bundle to another line | E GJ-7b5ae323 | No |
| 12.10 | Activation SMS to every active MSISDN on the QID; feedback survey | D NOT_02/03 | No |
| 12.11 | MOI pending blocks final submission | D KYC_08 | No |
| 12.12 | Submit failure recovery | needed | No (no catch; UI has no recovery) |
| 12.13 | Continue with Fibre / Create Lead from confirmation | prototype | Built |
| 12.14 | Provisioning SLA 4 business hours (legacy); target SLA | E SOP; O | No |

### B13. Cross-cutting and non-functional

| # | Scenario | Evidence | Prototype |
|---|---|---|---|
| 13.1 | Typed technical failures: timeout, unavailable, network, API, partial, expired, interrupted; retry x3 then controlled stop with reference | prototype (BRSD D-04 etc. owed) | Built (injection panel off) |
| 13.2 | Qatari vs expat vs offshore channel rules | SOP | Partial |
| 13.3 | Bilingual (Arabic / English) CAF and notifications | E CAF; D NOT_01 | Partial |
| 13.4 | Customer-facing mirror (CAF only interactive) | prototype; W2a | Built |
| 13.5 | Device must not govern journey; persona, not device | E W2a | n/a |

---

## C. Source conflicts to resolve before building (do not pick a side by inference)

| # | Topic | A | B |
|---|---|---|---|
| C-1 | BRSD version | v2.0 (retail-only, up to submission) | v0.1 draft (multi-channel, reaches past submission); numbering differs |
| C-2 | Qatari line cap | SOP: 5 | W1 / BRSD0.1: unlimited |
| C-3 | Postpaid ID types | W1: QID only (one unspecified exception) | SOP / BRSD0.1: QID or Diplomatic; BRSD2 lists Passport and GCC as scope |
| C-4 | Expat passport prepaid cap | W1: 5 | SOP: 2 |
| C-5 | Representative for postpaid | SOP: allowed with POA | BRSD0.1: not allowed |
| C-6 | Credit limit edit at activation | Journeys: editable | BRSD0.1 ECC_11 / BRSD2: not amendable |
| C-7 | HRN advance | BP-BR-252: blocks completion | GJ-9d77c0e2: empty grid, order still submits; QR 100 banner absent for a Nepalese in two other journeys |
| C-8 | Number / draft holds | 90 d, 48 h, 30 d, 72 h | - |
| C-9 | DOI in scope | W1: deferred | J011 and app wizard: branch |
| C-10 | Payment vs CAF order | J011: after CAF | Journeys: before |
| C-11 | Attachment size | G26: about 4 MB | BRSD0.1: 2 MB |
| C-12 | Email | SOP: valid email required | Journeys: default no-email address |
| C-13 | ZSB for mobile | SOP: mandatory | W7: fixed/FWA only (CR Conflict 2) |
| C-14 | HRN meaning | "High Risk Nationality" (SOP, W1, GJ-9d77c0e2) | GJ-5c169dbc: "High-Risk/High-Revenue-Notification" (looks wrong) |
| C-15 | Mobile Plus Agent Minimum | 75 | 80 (admin-configurable; state over time) |
| C-16 | Approval trigger | GJ shows approval vs no approval but never says why | Do not infer a threshold |

## D. Prototype defects found while auditing (candidates to fix, separate from scenarios)

- `idTypes.ts:16` and `eligibilityEngine.ts:78-93` comments say Diplomatic ID is approval-routed; the code does not route it.
- Bill limit never checked against credit limit; HRN limit 50 sits below minimum plan MRC (115).
- Accepted customer-type benefit auto-applies on pre-bundled plans whose discount panel says unavailable.
- Add-ons PROD-120-125 and discounts for unlisted plans are unreachable through the picker.
- `cafSigned` requires a signature only for Digital, while capture comments say Touch Screen needs one.
- Inventory scripts describe CUST-3071's number holds that the data no longer has.
- Number and SIM inventory are never updated on submit; a failing submit has no UI recovery.
- Flow `new` carries no `customerId`, so no offers, no benefit filtering and no billing-profile reuse.

## E. Prototype data that already exercises scenarios

| Scenario | Seed customers |
|---|---|
| Clean pass | CUST-1001, 1003, 3001, 3003, 3011, 3015, 3029, 3031, 3044 (age 18), 3051-3054, 3065, 3066, 3071; Diplomatic CUST-1007, 3045 |
| Hard stop | CUST-1006 (expired + security), 3041 (expired), 3043 (security), 9001 (age 16), 2001 (blocking deal), 3072 (expat 5 lines) |
| Soft stop (collections) | CUST-1004, 3046 |
| Approval: ID type | CUST-1002, 1005, 3016, 3032, 3061, 3063, 3067 |
| Approval: no expiry | CUST-3042 |
| Approval: line cap | CUST-3002, 3004 (Qatari); 3012, 3013, 3014, 3064 (expat) |
| HRN | CUST-3017, 3026, 3033, 3062, 3064, 3068-3070 (+3046, 3061, 3063) |
| B2B2C / MADA / Retired | CUST-1002, 3024, 3025, 3062, 3026, 3033 / 3021, 3024, 3027 / 3022, 3027, 1001 (3023 claims retired, fails registry) |
| NAS-only new customers | 29001234567, 29207063400101, 29108035600102, 28909063400103 |
| Drafts to resume | ORD-90020 (CUST-1001), ORD-90021 (CUST-1003) |

**Missing seed coverage** for scenarios above: duplicate registry matches, VIP bill cycle, consumer holding 2 billing profiles, a customer with an MNP donor, an eSIM-only email-unverified customer, an expat with passport-only ID for postpaid, a rejected-correction order.

## F. Owed inputs that block exact rules

Field-level BRSD spec (D-01), star-number price matrix (D-02), CAF template matrix (D-03), Qnomy interface (D-04), notification templates and triggers (D-05), collections thresholds (D-07), HRN advance matrix (D-08), agent role privilege matrix, nationality-to-category matrix, blacklist rules matrix, approval-agent role assignment matrix, the QID-mandatory exception (W1), W5a recording gap (about 157 of 186 minutes undecoded), MOI national-address service and DOI automation follow-ups.

## G. Suggested prioritisation for prototype representation

1. **Represent now (already evidenced, small gap):** B2B2C Proof of Employment gate and Special Management prompt (4.17-4.18), 2+ lines advisory (4.9), soft-stop alternatives (4.10), bill-limit vs credit-limit cap (6.10), submit-failure recovery (12.12), approval rejection / correction re-open (12.3).
2. **Represent as a distinct branch:** MNP port-in inside the postpaid wizard (section B11), the largest evidenced scenario family not in the main journey.
3. **Represent as a decision-pending placeholder (conflicted):** ID-type eligibility, line caps, credit-limit editing, HRN advance blocking, payment order, DOI (section C).
4. **Defer until sources arrive:** star-price matrix, notification catalogue, Qnomy fallback, role privileges (section F).

---

## H. Named scenario catalogue for the design prototype (SC-xx)

### H0. Stop types used below (as the prototype defines them)

| Type | Behaviour in the journey |
|---|---|
| **Hard stop** | Journey halts on Customer Identification. Only **Abandon Order** is offered. The stop is logged as an activity automatically. |
| **Soft stop** | Continue is blocked. Alternatives offered: **Continue Prepaid** and **Proceed to Payment** (both are stubs today). |
| **Approval-routing** | Journey continues. The order is submitted as **Submitted for Approval** and lands in the approval queue. |
| **Advisory** | Banner or note only. Nothing blocks. |
| **Conditional step / field** | Changes what the agent sees or must supply, with no stop. |

Evidence tags and prototype tags are as in "How to read this". "Seed" names a customer already in `customers.json` that exercises the scenario. A blank seed means the data does not exist yet.

### H1. Hard stops (halt the journey)

| ID | Scenario | Trigger and rule | Evidence | Prototype | Seed |
|---|---|---|---|---|---|
| SC-01 | **Age hard stop** | Age under 18, from MOI date of birth. Exactly 18 passes. | E (SOP 3.1 ref 2/7); D (KYC_04) | Built | CUST-9001 (16); CUST-3044 (exactly 18, passes) |
| SC-02 | **ID expired** | ID expiry date is in the past. | E (SOP: valid to activation + 1 day; Contact Validation); D (KYC_05 expired QID allows modification only) | Built | CUST-3041; CUST-1006 |
| SC-03 | **Security blacklist** | Customer on the security blacklist. | E (W1 [00:47-00:50]); category outcomes O (OQ-Q14) | Built | CUST-3043; CUST-1006 |
| SC-04 | **Unclassified blacklist** | Blacklisted with no category recorded. | Prototype's own rule; no source says unclassified = hard stop | Built | none identified |
| SC-05 | **Blocking deal** | Customer holds a deal flagged `blocksNewConnection`. | Prototype's own rule | Built | CUST-2001 |
| SC-06 | **Expat at the 5-line maximum** | Expat with 5 active lines. | E (W1: 5-line cap per operator); C-2 and "per operator" O | Built | CUST-3072 |
| SC-07 | **MOI record not found** | Neither MOI nor NAS knows the ID number: "No MOI record found". | E (MOI is the primary source, W1) | Built | any number outside the registry |
| SC-08 | **Expiry typed or scanned does not match MOI** | Entered expiry differs from the registry. | E (W1: MOI wins after a secondary cross-check) | Built | any QID with a wrong expiry |
| SC-09 | **Manual entry exhausted, still unverifiable** | 4 scan attempts used; manual entry then forces approval, but MOI can still reject the data. | D (KYC_03); E (W2b: agents re-scan, cannot type; C with prototype) | Built (manual entry allowed) | NAS-7001..7004 typed manually |
| SC-10 | **Representative or third party buying postpaid** | Someone other than the customer. | C-5 (SOP allows with POA; BRSD0.1 forbids) | No | not applicable |

### H2. Soft stops (Continue blocked, alternatives offered)

| ID | Scenario | Trigger and rule | Evidence | Prototype | Seed |
|---|---|---|---|---|---|
| SC-11 | **In collections, Qatari** | Collections-flagged **and** unpaid balance above 0 (450 outstanding in seed). | E (W1: collection status, overdue above 100, **C/O** on threshold) | Built; alternatives are stubs | CUST-1004 |
| SC-12 | **In collections, HRN expat** | Same rule on an HRN customer (310.50 outstanding). | E; combination, see H6 | Built; alternatives are stubs | CUST-3046 |
| SC-13 | **Collections flag with nothing unpaid** | Flag set but no unpaid bill: check passes. | Prototype's own rule | Built | CUST-3073 |

### H3. Approval-routing scenarios (order goes to approval)

| ID | Scenario | Trigger | Approver in prototype | Evidence | Prototype | Seed |
|---|---|---|---|---|---|---|
| SC-14 | **Non-QID identity (Passport, GCC ID, Other ID)** | ID type is not QID or Diplomatic | Back Office Fulfilment Agent | C-3, C-4 (W1: QID only; SOP/BRSD0.1: QID or Diplomatic; 4.1: hide postpaid vs route) | Conflict (routes, does not hide postpaid) | CUST-1002, 1005, 3016, 3032, 3061, 3063, 3067 |
| SC-15 | **No ID expiry on file** | MOI record has no expiry | none assigned | Prototype's own rule | Built | CUST-3042 |
| SC-16 | **Qatari at 5 or more lines** | Active lines 5 or above | Credit Control Agent | C-2 (SOP cap 5; W1/BRSD0.1 unlimited) | Built | CUST-3002 (5), 3004 (6) |
| SC-17 | **Expat at 2 to 4 lines (3rd to 5th line)** | Active lines at or above the expat cap of 2, below 5 | Credit Control Agent | E (SOP 3.2.2 step g); D (ECC_06-09) | Built | CUST-3012, 3013, 3014 |
| SC-18 | **Manually entered identity** | Scan attempts used up, agent typed the ID | Sales Manager | D (KYC_03: approval task) | Built | NAS-only customers |
| SC-19 | **HRN customer** | HRN nationality (derived from MOI nationality) | none assigned | E (W1; GJ-9d77c0e2); list O (D-08) | Built | CUST-3017, 3026, 3033, 3062, 3064, 3068-3070 |
| SC-20 | **B2B2C employee** | Customer type B2B2C, or employer on the customer record, unless the benefit is rejected | none assigned | E (GJ-e24116bd, f4fc93f7); approval trigger **O** (C-16) | Built | CUST-1002, 3024, 3025, 3026, 3033, 3062 |
| SC-21 | **MADA discount chosen** | MADA discount selected on the plan | none assigned | D (QPC_10: MADA ID mandatory with a special discount) | Built (approval trigger, not a gate) | CUST-3021, 3024, 3027 |
| SC-22 | **Approved, then complete** | Manager approves with the verification tick | Approver persona | E (GJ-5c169dbc, e24116bd) | Built downstream | any of the above |
| SC-23 | **Rejected - Correction / Dropped / Returned** | Approver rejects or returns | Approver persona | E (GJ; BP-BR-162, 285) | Built downstream; the correction loop back to the agent is not built | any approval-routed order |

Approver resolution today: line-limit cases go to Credit Control Agent, manual entry to Sales Manager, everything else to no named approver. **When several triggers apply, the prototype picks by that precedence; no source defines it (O).**

### H4. Customer-type scenarios (the "Special Discounts" choice on Customer Identification)

The prototype lets the agent choose one type per order: **Standard, B2B2C, Retired or MADA**, with **Reject benefit** returning to Standard.

| ID | Scenario | Rule | Evidence | Prototype | Seed |
|---|---|---|---|---|---|
| SC-24 | **Standard customer** | None of the three applies. Continue is allowed. | E | Built | most customers |
| SC-25 | **B2B2C happy path** | Pick a company found in the enterprise registry. Employee ID number and ID scan or upload are optional. Account is tagged B2B2C. | E (BP-BR-256) | Built | CUST-3024, 3025 |
| SC-26 | **B2B2C: company not in the registry** | "Add new company" is disabled, so an unlisted company cannot be selected. | Prototype gap | Partial | not applicable |
| SC-27 | **B2B2C: Proof of Employment mandatory** | Error "Please select Proof of Employment before continuing." | E (GJ-f4fc93f7, e24116bd) | **Conflict** (upload is optional here, BR-263/169) | not applicable |
| SC-28 | **B2B2C: employer already on the record** | Existing customer with an employer on file is treated as B2B2C unless rejected. | Prototype's own derivation | Built | CUST-1002, 3026, 3033, 3062 |
| SC-29 | **B2B2C: account already has Special Management value** | Confirm dialog: continue without B2B2C? OK continues as a standard sale. What Cancel does is not shown. | E (GJ-48d70eca) | No (BR-265/266) | not applicable |
| SC-30 | **B2B2C with approval vs without approval** | Both variants exist in the walkthroughs. The condition separating them is never stated. | E; trigger **O** (C-16) | Partial | not applicable |
| SC-31 | **Retired: validated** | Office ID scanned or uploaded, accepted by the agent, then the government check passes (3 second simulated delay). | E (prototype rule; no source gives the registry service) | Built (simulated) | CUST-3027, 3022, 1001 |
| SC-32 | **Retired: not found in the government registry** | Check returns "could not be validated". Agent may continue as a standard customer. | Prototype rule | Built | CUST-3023 |
| SC-33 | **Retired: government service technical failure** | Retry up to 3 attempts, then Continue as standard offered. Never treated as "not a retiree". | Prototype rule (serviceCall) | Built | demo fault panel (off) |
| SC-34 | **MADA** | Supporting document scanned or uploaded and accepted. No government check. MADA discount then forces approval. | D (KYC_02, QPC_10); E (BR on MADA ID) | Built | CUST-3021, 3024, 3027 |
| SC-35 | **Agent rejects the benefit** | Reject returns the customer to Standard. An employer on the record no longer makes the order B2B2C. | Prototype rule | Built | any B2B2C / Retired / MADA customer |
| SC-36 | **Customer already holds a benefit on record** | `benefitEligibility` lists the benefits; only matching discounts are offered. If the customer is not yet identified, nothing is filtered. | Prototype rule | Built (flow `new` shows every discount type) | CUST-3028 (loyalty) and others |
| SC-37 | **Benefit chosen but plan is pre-bundled** | Accepted benefit auto-applies even though the plan's discount panel says unavailable. | Defect (D in section D) | Defect | not applicable |
| SC-38 | **Retired discount does not force approval** | Only MADA and B2B2C discount types force approval. Whether Retired should is not specified. | O | Built as stated | CUST-3027 |

### H5. HRN scenarios

| ID | Scenario | Rule | Evidence | Prototype | Seed |
|---|---|---|---|---|---|
| SC-39 | **HRN identified** | Nationality-derived flag (Bangladesh, Pakistan, Nepal in the draft; full list owed). | D (KYC_06); O (D-08); C-14 on the meaning of HRN | Built | see SC-19 |
| SC-40 | **HRN advance** | Banner "(HRN) Customer needs to pay advance payment of QR 100." Amount driven by nationality and channel; adjusted against the first bill. Included in "due today". | E (W1 [00:46-00:53]; GJ-9d77c0e2) | Built | see SC-19 |
| SC-41 | **HRN advance blocks completion or not** | BP-BR-252 says it blocks; the desktop HRN walkthrough shows an empty payment grid and a submitted order. | C-7 | Built as advisory | not applicable |
| SC-42 | **HRN credit limit** | Default 50 (W5b); 1,000 for non-HRN. | E (W5b [00:59:40]) | Built | see SC-19 |
| SC-43 | **HRN credit limit edited** | Agent raised it 800 to 1,000 in a walkthrough. | E (GJ-9d77c0e2); C-6 (BRSD: not amendable) | Not built | not applicable |
| SC-44 | **HRN bill limit below plan minimum** | HRN limit of 50 sits under the smallest plan rental (115); bill limit is never checked against credit limit. | Defect | Defect | any HRN customer |
| SC-45 | **HRN approval** | Order routes to approval at submit. | Prototype rule; E (GJ-5c169dbc shows approval, with the banner absent there) | Built | see SC-19 |
| SC-46 | **HRN banner absent on the same nationality** | A Nepalese customer shows the banner in one walkthrough and none in two others. | E; C-7 | not applicable | not applicable |

### H6. Combination scenarios (several drivers on one customer)

| ID | Combination | What happens in the prototype | Seed |
|---|---|---|---|
| SC-47 | Expired ID **and** security blacklist | Two hard stops; both rows show. | CUST-1006 |
| SC-48 | HRN **and** collections | Soft stop, and the HRN advance still applies if the customer continues. | CUST-3046 |
| SC-49 | HRN **and** Passport or Other ID | Approval-routed twice over (ID type plus HRN). Single order, one approver precedence. | CUST-3061, 3063 |
| SC-50 | HRN **and** expat at 2 lines | Line-cap approval plus HRN advance. | CUST-3064 |
| SC-51 | GCC ID **and** expat at 2 of 2 lines | ID-type routing plus line-cap routing. | CUST-1005 |
| SC-52 | Passport **and** B2B2C employee | ID-type routing plus B2B2C. | CUST-1002 |
| SC-53 | MADA **and** B2B2C on the record | Only one customer type can be selected at a time; which benefit wins when both are held is **not specified (O)**. | CUST-3024 |
| SC-54 | Retired **and** MADA on the record | Same: one type per order; combined behaviour **O**. | CUST-3027 |
| SC-55 | B2B2C **and** HRN | Two approval reasons (B2B2C, HRN). | CUST-3026, 3033, 3062 |
| SC-56 | Retired claimed but not in the registry **and** a MADA discount | Retired fails, agent continues as Standard; MADA is a separate choice. | CUST-3023 |

### H7. Other eligibility, validation and exception scenarios

| ID | Scenario | Rule | Type | Evidence | Prototype |
|---|---|---|---|---|---|
| SC-57 | Diplomatic ID | Sold directly like a QID. Code comments say it is approval-routed but the code does not route it. | Conditional | C-3 | Built (comment defect) |
| SC-58 | Existing customer vs new customer vs NAS-only | New always takes demographics from NAS; existing locks to the Customer 360 customer. NAS-only people are always new. | Conditional | D (CAM_01-03) | Built |
| SC-59 | Duplicate registry match | Agent must choose the correct record. | Exception | prototype | Demo only |
| SC-60 | MOI result stale (older than 30 minutes) | "Validate again". | Exception | D (KYC_08 X=30) | Built |
| SC-61 | MOI or eligibility service failure | Typed failures (timeout, unavailable, network, API, partial, expired, interrupted); retry up to 3 times, then a controlled stop with a reference and a Save & Exit hint. | Exception | prototype; D-04 owed | Built (injection panel off) |
| SC-62 | Alternate phone not a Qatar mobile | Validation error. | Validation | E (info note in 5+ GJ) | Built |
| SC-63 | Another journey already holds the customer | Redirect with a toast. | Exception | prototype | Built |
| SC-64 | Resume a saved draft | Step and values restored; eligibility discarded and re-run. | Alternate flow | D (JSM_06) | Built (CUST-1001, 1003 drafts) |
| SC-65 | Abandon a journey (comment required) | Deletes the draft and releases the customer. | Alternate flow | prototype | Built |
| SC-66 | Bill limit below Agent Minimum | "Bill Limit can not be set lower than Agent Minimum 50". Mobile Plus 75 and the post-change 80 are not wired. | Validation | E (GJ-f8227f90, 6cb03f33, 2847b2de) | Partial |
| SC-67 | Add-on exceeds bill-limit headroom | "Go back to Plan and edit limit." | Validation | E (BP-BR-229/262) | No |
| SC-68 | Number reservation cap | At most 2 agent holds; others' holds hidden. | Validation | prototype | Built |
| SC-69 | SIM serial not in stock / already assigned | Validation message on the serial. | Validation | E (OVR) | Built |
| SC-70 | CAF signature missing | Digital CAF needs a signature to continue; Touch Screen is not enforced despite the capture comments. | Validation | E | Defect |
| SC-71 | Payment declined / error / session expiry | Retry; "Proceed without WinCash" records cash received. | Exception | D (PAY_03) | Built |
| SC-72 | Submit fails | No recovery in the UI. | Exception | needed | No |
| SC-73 | Cross-sales offer accepted | Plan fixed, plan and add-on steps skipped. Only in flow `existing`. | Alternate flow | E (GJ-7b5ae323) | Built |
| SC-74 | MNP port-in instead of a new number | Separate branch (section B11). | Alternate flow | E | No |

### H8. What the prototype should make visible per scenario (design checklist)

1. **Stop type on screen:** hard stop (Abandon only), soft stop (alternatives), approval-routing (Continue plus a visible reason), or advisory, so each of SC-01 to SC-23 is distinguishable at a glance.
2. **All eligibility rows shown every time**, passed or failed, so the agent sees all seven checks ran (the prototype already does this).
3. **Who approves, and why**, on the confirmation page and on the approval screen, including the precedence when several triggers apply (currently undefined).
4. **Customer type chosen and its evidence state** (accepted, rejected, government check pending / passed / failed / error) before Continue.
5. **Combination handling** for H6 rows: show every applicable reason, not only the first.
6. **Seed data to add** so the prototype can demonstrate everything above: a duplicate-document pair, a VIP customer, a consumer with 2 billing profiles, a customer with both MADA and Retired benefits chosen in one order, an HRN customer who also holds a B2B2C employer without a collections flag, and a Passport-only customer without HRN.

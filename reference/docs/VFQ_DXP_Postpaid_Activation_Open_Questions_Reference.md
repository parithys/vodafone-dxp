# New Postpaid Activation - Open Questions for VFQ Business Stakeholders

Generated 2026-09-26. Scope: the New Postpaid Activation journey as implemented
in `src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx` (10 steps),
checked against `reference/.knowledge/` (83 indexed source documents).

Every item below is a question the corpus does **not** answer. Two kinds are
distinguished:

- **[OWED]** - already logged as a formal dependency in the Mobile Postpaid
  Activation BRSD v2.0 (`D-01`..`D-08`). VFQ has committed to supply these.
- **[GAP]** - found while building the journey. Not on anyone's list yet. The
  app currently carries an assumption, named in the relevant source file.

Related existing artefacts: `reference/blueprint/conflict-report.md` (corpus
conflicts, broader scope), `reference/.knowledge/INDEX.md` (source confidence).

---

## 1. Identification and KYC

- **[GAP] What is the "one unspecified exception" to the QID-mandatory rule?**
  The foundational rule is confirmed: postpaid cannot be sold against any ID
  type other than QID, "with one unspecified exception to be discussed later".
  That discussion is not in the corpus. This is the single highest-value open
  question in the journey, because it defines who can be sold to at all.
  Source: `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` [00:25:18]
- **[GAP] Is Diplomatic ID inside or outside that rule?** The app currently
  sells directly against QID **or** Diplomatic ID, and routes Passport / GCC ID
  / other exception documents to CBM approval. The QID-mandatory rule as
  written would exclude Diplomatic ID too. Needs an explicit yes/no.
- **[GAP] What is the ID expiry policy?** No source document states one, and
  the source dataset carried no expiry field at all. Open: is an expired
  document a hard stop or a correctable warning? Is there a minimum remaining
  validity (e.g. must not expire within the contract term)? What about a
  document with no expiry recorded?
- **[GAP] How many scan attempts before the agent may key the number manually?**
  The app allows four, taken from a reference screenshot showing
  "Scan Attempts: 0 / 4". No business rule states it. Also open: after four
  failures, is manual entry actually permitted, or must the customer be turned
  away?
- **[GAP] What does MOI return, and what is authoritative?** The workshop
  mentions "up to 5-6 name fields". The app splits a single name on whitespace
  into First / Last, which is a guess. Open: the real field list, and which
  MOI-sourced fields the agent may override.
- **[GAP] Is the MOI national address service available?** Logged as an action
  item ("Vishal to enable") with no recorded outcome.
  Source: `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` [00:32:41]
- **[GAP] Does IDWise OCR support Arabic?** Raised as an open question in
  workshop and never answered. Also open: behaviour on a damaged or worn card,
  and timeout handling.
  Source: `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` [00:51:24]
- **[GAP] Security questions / customer verification model.** The workshop
  session that covered this is **materially incomplete - only ~29 of 186
  minutes decoded**. Whatever was agreed about the security-question model and
  KYC verification procedure exists only in the facilitators' own notes or the
  raw recording.
  Source: `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808` (medium confidence)

## 2. Eligibility and line caps

- **[GAP] What exactly does each eligibility check query?** The journey runs
  seven checks (ID validity, age, ID type, collections, security, deals, active
  lines). The corpus names them but never says which system answers each one
  (BRM? Collections? a blacklist DB?), whether they run in sequence or
  parallel, what the timeout is, or what the agent should do when a check
  system is unavailable.
  Source: `order-validation-business-rules-45d0e9f0`
- **[GAP] Is the minimum age 18?** The app assumes it. No source states an age.
- **[GAP] Is the 5-line cap for non-nationals per operator or across all Qatari
  operators?** "Per operator" is stated but not defined. If it is market-wide,
  the check cannot be answered from VFQ data alone.
  Source: `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` [00:53:54-00:58:37]
- **[GAP] At which step is the line-cap check performed - Contact, Plan or Submit,
  and what exact wording does the agent see?**
- **[GAP] What is the "authorized officer" override?** The cap is overridable by
  an authorized-officer flag on the account. Open: who holds that role, how the
  flag is set, and whether it is an in-journey action or a prerequisite.
- **[GAP] Does the blacklist category change the outcome?** The app distinguishes
  a collections listing (soft stop, prepaid still offerable) from a security
  listing (hard stop, nothing offerable). That distinction is an inference. Open:
  the real category list and the disposition for each.
- **[GAP] Which commitment-penalty states block a new connection?** The source
  data has no field for this. Open: does a *pending* penalty block, or only an
  applied one? Does it block all new connections or only same-product ones?
- **[GAP] Do barring states affect new-connection eligibility?** Barring
  status/type/reason are placeholders throughout - BRSD v3.1 Section 2.13
  leaves their Data Ref (DR-01..07) undefined in Annex_01. Open: the valid
  states, and whether an existing barred line blocks a new sale.

## 3. Credit control, HRN and deposits

- **[OWED D-08] The full HRN advance payment matrix.** Known: Nepalese / HRN
  customers pay QR 100 in advance, driven by nationality and sales channel and
  explicitly **not** by plan value, adjusted against the first bill. Missing:
  the complete nationality list, the amount per nationality, the channel-specific
  variations, and whether activation is blocked if it is not paid.
  Source: `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` [00:46:44-00:53:01]
- **[OWED D-07] Collections outstanding-dues thresholds.** Known: a billing
  profile enters collections once overdue exceeds 100. Missing: whether 100 QAR
  is fixed or configurable, whether it applies uniformly across segments, and
  the precise definition of "overdue" versus "outstanding".
- **[GAP] Is the collections threshold the same for mobile as for fibre?** The
  Fibre BRSD's own open-items log (OI-04) records an unresolved dispute on
  exactly this - one side says the threshold should differ by product, the
  other says it should be uniform. No value is agreed anywhere.
  Source: `vfq-fibre-brsd-v1-2-068eebe3` [OI-04]
- **[GAP] What is the default credit limit for a Qatari national?** Known: 1,000
  QAR for an expat on a new account, 50 QAR for HRN. The Qatari default is never
  stated, and it is unclear whether other nationality segments exist.
  Source: `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4` [00:59:40]
- **[GAP] What are the credit-limit boundaries an agent may select within?** The
  workshop records that there is **"no system restriction today preventing any
  agent from selecting any credit limit value"**, flagged as an "uncontrolled
  credit exposure" risk. Modernization has to define the control. Open: the
  permitted range per segment, and whether an out-of-range value routes to
  approval or is simply refused.
  Source: `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4` [01:00:21]
- **[GAP] Is a deposit required, and how does it interact with the credit limit?**
  BR-270 requires "a minimum deposit of QR 2,000 or a valid credit card on file"
  to establish a postpaid credit limit; the Consumer Postpaid CAF also mentions
  QR 2,000. Open: when this applies, whether it is collected in this journey,
  and how it relates to the HRN advance. Note the old deposit-for-increase
  process was **discontinued because there was no refund mechanism** when
  customers disconnected - so a refund policy is needed before reintroducing it.
- **[GAP] What is the bill limit ("spend limit") Agent Minimum, currently?** The
  corpus gives three data points for the same product: Bill Limit Mobile Plus at
  **75** in two journeys and **80** in a third, described as "Agent Min raised
  to 80". Bill Limit Mobile is 50 throughout. This looks like per-promotion
  configuration that changed over time rather than a contradiction - but the
  authoritative current mapping of promotion to Agent Minimum is not in the
  corpus. Enforced at Validate with Siebel error `SBL-EXL-00151`.
  Sources: `guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`,
  `guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`,
  `guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`

## 4. CBM approval workflow

This is the largest single hole. There is **no process specification** for CBM
approval anywhere in the corpus - it appears only as screenshots in guided
journeys.

- **[GAP] What conditions route an order to CBM approval rather than
  auto-completing?** The app routes on B2B2C and on the HRN/credit-limit variant
  (BR-268, UJ-081). Open: whether high credit limits, pre-existing connections,
  exception ID types, or device installments also trigger it.
- **[GAP] What does the CBM approver actually validate, and against which
  systems?**
- **[GAP] Can CBM modify order details before approving, or only approve and
  reject?**
- **[GAP] What is the SLA for an approval decision, and what does the agent or
  customer see while waiting?**
- **[GAP] What is the difference between "Reject - Correction" and
  "Reject - Drop Order"?** Both appear in the UI. Whether the first returns an
  editable order to the originating agent is assumed, not documented.
- **[OWED MPAR_001_JSM_02] The agent role privilege matrix** is listed as TBD in
  the BRSD and never populated. This determines who can approve, who can
  override a cap, and who can set a credit limit.

## 5. Number selection

- **[OWED D-02] The plan-price to star-number-price eligibility matrix.** Known
  only as an approximation: "a 200 Riyal plan entitles ~5,000 Riyal worth of
  star number", with the customer paying the delta at point of sale. Missing:
  the exact formula or lookup table, the exceptions by product, and how the
  delta is calculated and charged.
  Source: `business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db` [01:20:26]
- **[GAP] What determines which numbers an agent sees?** BR-756 says numbers are
  auto-selected for fixed and prepaid (zero-rated) but **not** for mobile
  postpaid "since those numbers carry a price" - yet nothing in the number
  inventory distinguishes zero-rated from priced. Open: the filter and
  visibility logic for the postpaid picker.
- **[GAP] How long is a reserved number held before auto-release?**
- **[GAP] What is the star-number tier and pricing structure?** The app seeds
  Gold / Silver / Platinum tiers priced by pattern strength. That model is
  invented; only a single Gold number at 500 QAR was evidenced.
- **[GAP] Who reserves a number, and on what authority?** The Number Management
  Portal is in scope per Day 5 Session 2, but the agent-facing workflow is not
  described.

## 6. Device on Installment (DOI)

- **[GAP] Can DOI be sold inside a new postpaid activation, or only afterwards?**
  Day 1 explicitly deferred DOI; Day 5 discussed it as a separate journey. The
  app includes it as step 6 of the activation. This needs confirming either way.
- **[GAP] Is DOI order submission manual or automated?** Recorded as an
  unresolved **disagreement between workshop participants**, with a confirm
  action assigned to Hisham and no recorded outcome.
  Source: `business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4` [01:14:40]
- **[GAP] What is the device affordability rule?** The app gates device price at
  five times the credit limit. That multiplier is invented. Open: the real
  affordability test, if any.
- **[GAP] What installment terms are offered?** The app offers 6, 12 and 24
  months. No source states the available terms, the interest or fee treatment,
  or eligibility by tenure.

## 7. SIM, eSIM and provisioning

- **[GAP] What is the real eSIM provisioning flow?** The app produces a
  GSMA SGP.22-shaped activation string against a mock SM-DP+; there is no
  integration contract in the corpus. Open: the provisioning call, the QR
  delivery mechanism, and the failure and retry path.
- **[GAP] Can multi-SIM or companion devices (iWatch) be ordered during a new
  activation?** Day 5 Session 2 says up to 4 per plan, but not when they can be
  ordered - at the point of sale or only by later modification.
- **[GAP] What is the order state machine after submission?** Fulfilment is
  explicitly out of scope for the Activation BRSD. Open: the provisioning SLA,
  the intermediate states, retry and failure handling, and whether an
  activation can be reversed once submitted.

## 8. Address capture

- **[GAP] Is ZSB address capture mandatory for a mobile postpaid sale?** Directly
  contradictory evidence: the Consumer Activation Process Manual v8.0 says ZSB
  capture is mandatory in both the Prepaid (S2.1.15) and Postpaid (S3.1.12)
  sections, while the Day 7 stack-modernization workshop says it applies to
  FWA / fixed only. The app treats it as advisory and does not block.
  Tracked as `BR-ZSB-MANDATORY-FOR-MOBILE` in `src/engines/ruleEngine.ts` and as
  Conflict 2 in `reference/blueprint/conflict-report.md`.
- **[GAP] Is a Kahramaa ID (KID) needed for a mobile line?** The app treats it as
  optional for postpaid on the reasoning that a mobile line needs no serviceable
  premises, unlike fibre. That reasoning is ours, not the corpus's.
- **[GAP] Are there address validation rules for mobile at all?** KID and address
  validation are specified in detail for Fibre and absent for mobile.

## 9. Forms, payment and notifications

- **[OWED D-03] The CAF template routing matrix** - which CAF variant applies to
  which channel, role and service type. Also needs resolving: the Consumer
  Postpaid CAF V4 and Consumer Prepaid CAF V2 are **both stamped Form ID
  PCA001**. Intentional shared ID, or a numbering error?
  (Also Conflict item 1 in `reference/blueprint/conflict-report.md`.)
- **[GAP] Is the CAF ID-number binding used for postpaid?** The evidenced
  behaviour - "CAF form dynamically binds Qatari ID/Passport number field" - is
  documented for **prepaid subscribers** only. The app omits it for postpaid
  rather than assume it.
- **[GAP] Which CAF capture modes are real?** The app offers Digital, Manual and
  Touch Screen. Not formally sourced.
- **[GAP] The WinCash integration specification.** WinCash is referenced 30+
  times across the corpus with no API contract, field list, or error taxonomy.
  Open: the decline and retry semantics, and the payment reference format.
- **[OWED D-04] The Qnomy MPI API specification** - schema, plus the fallback
  logic and timeout behaviour when Qnomy is unavailable.
- **[OWED D-05] Notification templates and trigger mapping.** 1,236 SMS
  templates exist in a separate catalogue. Missing: which template fires at
  which journey step, to which recipient, in which language.
- **[GAP] How is email verification completed?** Emails are captured unverified
  and verified asynchronously via callback before first bill generation. Open:
  the callback mechanism, retry policy, and whether an unverified email blocks
  anything.
  Source: `business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204` [00:14:38]

## 10. Field-level specification

- **[OWED D-01] Field-level specification gaps** - exact definitions for the 86
  data fields (DF-xx): data types, lengths, and validation rules. This is the
  root cause of several items above.
- **[GAP] Cross-field validation logic.** The contact validation rules list 40
  error messages with no rule IDs and no field-to-message mapping. Messages like
  "Date of Birth and Qatari ID do not match" imply a cross-check whose logic is
  not described.
  Source: `contact-validation-business-rules-b5d58c84`
- **[GAP] Order validation trigger conditions.** ~169 order validation rules are
  catalogued in terse form. `ORD_VALD_RULE_005` ("for a business account, a
  pending order cannot be submitted if an open order exists") does not define
  "open".
  Source: `order-validation-business-rules-45d0e9f0`
- **[GAP] What is captured when a customer has no Qatar mobile number?** The
  alternate contact number is now validated as +974 plus exactly 8 digits, per
  the documented rule (FLD-352, "must be a local mobile number", repeated
  across 5+ journeys) and per direction on 2026-09-26. An earlier override
  accepted any international number on the grounds that an expat, GCC or
  diplomatic customer may only have a foreign number on file; that override has
  been removed, so the open question is what the counter does in exactly that
  case. The field is mandatory and gates the Contact step of all four journeys
  that share it, so today the answer is that the journey stops.
- **[GAP] Is gender available from the MOI registry?** The app makes it mandatory
  and read-only, sourced from MOI. A mandatory read-only field with no registry
  source can never be satisfied, so this depends on MOI actually returning it.

## 11. Billing profile data references

- **[OWED Annex_01] BRSD v3.1 Section 2.13 leaves Data Ref DR-01..07 undefined in
  Annex_01.** Affects billing profiles, in-platform balances, service usage,
  bills, call detail records and customer communications - 11+ datasets carry
  placeholder shapes "pending VFQ Business confirmation". Any postpaid billing,
  charge calculation or usage-based credit tiering is unverifiable until this is
  filled in.
- **[GAP] What billing-cycle day does a brand-new postpaid connection get
  assigned?** Four independent CAF/guided-journey documents agree on the SHAPE
  of a first invoice - "your first month's charges will be prorated, plus the
  full charge of your plan for the following month" - but none gives the rule
  for which day of the month a new activation's cycle starts on.
  `billing-profiles.json` shows every value from 1 to 12 across four existing
  accounts, with no pattern tying a value to how or when that account was
  opened, and this journey creates no billing profile of its own to inherit one
  from. The app defaults new activations to a 1st-of-month cycle boundary so
  the first-bill figure it shows the agent is a real, computed number rather
  than an unlabelled placeholder - logged in
  `src/engines/postpaidPricing.ts` (`firstBillCharges`) as an assumption, not a
  business rule.

---

## Priority for the next stakeholder session

Ranked by how much of the journey is blocked behind the answer:

1. The QID-mandatory exception, and whether Diplomatic ID is in or out (S1).
   Defines addressable customers.
2. CBM approval - triggers, scope, SLA, reject semantics (S4). An entire
   downstream workflow with no specification.
3. Credit limit boundaries and the agent-selection control (S3). Carries a
   named financial risk.
4. HRN advance matrix `D-08` and collections thresholds `D-07` (S3). Already
   owed; both gate eligibility.
5. Role privilege matrix `MPAR_001_JSM_02` (S4). Blocks approval, override and
   credit-setting design.
6. Star-number entitlement formula `D-02` (S5). Blocks pricing at point of sale.
7. DOI - in-journey or separate, manual or automated (S6). Decides whether
   step 6 belongs in this wizard at all.
8. ZSB mandatory for mobile - manual versus workshop (S8). A documented
   contradiction with a blocking-versus-advisory outcome.

## What to ask for as well as answers

- The **raw recording or facilitator notes for Business Workshop Day 5
  Session 1** (only ~29 of 186 minutes decoded). Customer verification, QID
  scanning rules and the security-question model were on that agenda.
- The **outcome of the DOI automation action assigned to Hisham**.
- The **outcome of the MOI national address service action assigned to Vishal**.
- The **completed Annex_01** for BRSD v3.1 Section 2.13 (DR-01..07).

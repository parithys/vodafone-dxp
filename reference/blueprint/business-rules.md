# Business Rule Catalogue (Phase 17)

Eligibility/routing/validation/visibility/permission/calculation/derivation rules evidenced across BRSDs, business-rule extracts (Order Validation, Contact Validation), customer forms, and guided-journey walkthroughs. Where a source names a formal rule ID (e.g. BR-014, ORD_VALD_RULE_23), it is preserved in `source_rule_ids`. This catalogue was synthesized in chunks (raw extraction exceeded a single synthesis pass's output limit) then deduplicated by normalized name — near-duplicate rules with divergent wording may not all have been merged; treat this as thorough but not perfectly deduplicated.

**Canonical items:** 346 (deduplicated from 378 raw extracted mentions across the 83-document corpus)

**Confidence:** high 321 · medium 24 · low 1
**Classification:** Explicit 331 · Inferred 15 · Assumed 0

Every item below cites the exact source document slug(s) and evidence quote(s) it was derived from. Open the linked `.knowledge/docs/<slug>.md` for full document context per `CLAUDE.md`.

---

## Rules by type

| Type | Count |
|---|---|
| Validation | 137 |
| Eligibility | 50 |
| Routing | 46 |
| Derivation | 44 |
| Calculation | 30 |
| Permission | 28 |
| Visibility | 11 |

---

## Validation Rules

### BR-007: Personal-Use-Only Restriction
`Explicit` · confidence: `high`

- **Description:** The connection is restricted to personal, family, or roommate use at the Premises and may not be used commercially; Vodafone Qatar may suspend or terminate the service if used otherwise.
- **Original rule ID(s):** `raw:Personal-Use-Only Restriction`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Connection is restricted to personal/family/roommate use at the Premises, not commercial use; Vodafone Qatar may suspend or terminate if used otherwise”

### BR-008: Billing Profile Unchangeable Correlation ID Requirement
`Explicit` · confidence: `high`

- **Description:** The billing profile has no unchangeable common correlation ID between CRM and BRM today. Decision: keep the profile name renameable but add an unchangeable identifier (BRM row ID plus a unique CRM identifier) to correlate the two systems reliably.
- **Original rule ID(s):** `raw:Billing Profile Unchangeable Correlation ID Requirement`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Billing profile ... has no unchangeable common correlation ID between CRM and BRM ... Decision: keep the name renameable but add an unchangeable identifier (BRM row ID + unique CRM identifier) to correlate the two systems”

### BR-013: Unbilled Usage Screen Mandatory Filter Rule
`Explicit` · confidence: `high`

- **Description:** The unbilled usage screen cannot serve large enterprise accounts today (they are suppressed via an exception list because loading them hangs the system); a mandatory MSISDN plus date range filter (constrained to the current cycle) must be enforced.
- **Original rule ID(s):** `raw:Unbilled Usage Screen Mandatory Filter Rule`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced”

### BR-014: Back-Dated Order Completion Non-Compliance Rule
`Explicit` · confidence: `high`

- **Description:** Decision: accounts/services must be created at the correct (current) activation date rather than back-dated, with any back-dating need escalated to the fulfilment session/PMs, since revenue projection and 24-hour tax reporting requirements make back-dating non-compliant.
- **Original rule ID(s):** `raw:Back-Dated Order Completion Non-Compliance Rule`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: create account/service at the correct activation date and escalate to the fulfilment session/PMs; revenue projection and 24-hour tax reporting requirements make back-dating non-compliant”

### BR-016: Billing Profile / Recipient Email Audit Trail Requirement
`Explicit` · confidence: `high`

- **Description:** An audit trail must capture who changed the billing profile name and the billing document recipient email, to close a fraud scenario in which a user changes the invoice email, redirects the invoice, then reverts the change with no record.
- **Original rule ID(s):** `raw:Billing Profile / Recipient Email Audit Trail Requirement`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Audit trail requirement raised: capture who changed the billing profile name and the billing document recipient email (a fraud scenario was flagged where a user changes the invoice email, redirects it, then reverts with no record)”

### BR-017: Mandatory CR-Number Search Before Account Creation
`Explicit` · confidence: `high`

- **Description:** A Commercial Registration (CR) number search is mandatory before an account can be created.
- **Original rule ID(s):** `raw:Mandatory CR-Number Search Before Account Creation`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation”

### BR-023: CNAP Regulatory Mandate Rule
`Explicit` · confidence: `high`

- **Description:** CNAP (Calling Name Presentation) is regulator-mandated and mandatory for fixed lines today, limited to 25 characters, and is expected to become mandatory for mobile as well.
- **Original rule ID(s):** `raw:CNAP Regulatory Mandate Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile”

### BR-027: Bulk Activation Identical-Parameters Constraint
`Explicit` · confidence: `high`

- **Description:** Bulk activation relies on a very old custom Excel macro (from "SSI") that requires identical plan, account, spend limit, and price across the entire batch.
- **Original rule ID(s):** `raw:Bulk Activation Identical-Parameters Constraint`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch”

### BR-030: Shared Pool Activation-Only Support Rule
`Explicit` · confidence: `high`

- **Description:** The shared pool feature supports activation only today; other lifecycle operations are not yet supported.
- **Original rule ID(s):** `raw:Shared Pool Activation-Only Support Rule`
- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “shared pool supports activation only today”

### BR-032: Excel One-Million-Line-Item Limit / 400k Email Threshold
`Explicit` · confidence: `high`

- **Description:** Excel has a one-million line item limit, requiring aggregation with a CSV fallback for larger datasets; separately, a 400k-line threshold is driven by email delivery size limits.
- **Original rule ID(s):** `raw:Excel One-Million-Line-Item Limit / 400k Email Threshold`
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Constraints noted: Excel has a one-million line item limit requiring aggregation with CSV fallback; a 400k-line threshold is driven by email delivery size limits”

### BR-034: Bulk SMS Disconnection Outstanding-Balance Check
`Explicit` · confidence: `high`

- **Description:** Bulk SMS disconnection requires outstanding-balance checks and OnMobile confirmation before proceeding.
- **Original rule ID(s):** `raw:Bulk SMS Disconnection Outstanding-Balance Check`
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “disconnection with outstanding-balance checks and OnMobile confirmation”

### BR-037: MNP Consent SMS 24-Hour Rule
`Explicit` · confidence: `high`

- **Description:** The customer must send a consent SMS within 24 hours; the request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues.
- **Original rule ID(s):** `raw:MNP Consent SMS 24-Hour Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

### BR-038: MNP Outstanding-Dues Payment Window Rule
`Explicit` · confidence: `high`

- **Description:** When conditionally accepted due to outstanding dues, the stated payment window is 8 business hours, though it is presented to the customer as 24 hours.
- **Original rule ID(s):** `raw:MNP Outstanding-Dues Payment Window Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “conditionally accept if there are outstanding dues (stated payment window is 8 business hours, presented to the customer as 24 hours)”

### BR-040: MNP Valid Rejection Reasons Rule
`Explicit` · confidence: `high`

- **Description:** Only 13 documented rejection reasons are valid for MNP; each rejection restarts the entire MNP journey.
- **Original rule ID(s):** `raw:MNP Valid Rejection Reasons Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey”

### BR-050: Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only)
`Explicit` · confidence: `high`

- **Description:** Statuses and the 14-15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9.
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Statuses and the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9”

### BR-063: Commitment Period Continuity on Plan Upgrade (regulatory)
`Explicit` · confidence: `high`

- **Description:** Regulation requires the original commitment period to continue on plan upgrade; downgrade is treated as a breach that triggers a penalty.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “regulation requires the original commitment to continue on upgrade (downgrade is a breach triggering a penalty)”

### BR-071: Consumer Billing Profile Cap (max two: one postpaid, one prepaid)
`Explicit` · confidence: `high`

- **Description:** A consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more”

### BR-077: QID Physical Presence and Scan Requirement for Retail Transactions
`Explicit` · confidence: `medium`

- **Description:** In retail, the customer must be physically present with a valid QID; for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer.
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “in retail, the customer must be physically present with a valid QID; for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer”

### BR-078: ID Attachment Exemption for No-Change Transactions
`Explicit` · confidence: `medium`

- **Description:** Complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step; the attachment step is required only when there is an actual account/service change.
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step; the attachment step is required only when there is an actual account/service change”

### BR-079: Security Question Mandatory Set (QID + Account/Holder Name)
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review — this is the master note; FLD-131 through FLD-135, VAL-201 through VAL-205, and the corresponding workflow-execution-matrix entry all derive from this same rule and source):** the entire security-question verification model (this rule plus FLD-131..135 and VAL-201..205) is sourced to a single document, `business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`, which only decoded 29 of its 186 recorded minutes (tool-flagged "AUDIO DAMAGED" in the source itself — an 85% data-loss event, not a normal partial transcript). More importantly: a full-corpus search in a separate Phase 1.5 pass found this security-question model — the document's own namesake topic — has **zero corroboration anywhere else in the 83-document corpus**. Independently re-scored 53/100 (Medium-Low, "Use with conditions"). Do not treat this rule (or the fields/validations derived from it) as an agreed requirement without validating it against Vodafone Qatar stakeholders — it is real, specific, internally consistent content, but single-source and unverified. See `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

- **Description:** QID and account/holder name are the two mandatory security questions; additional questions are asked flexibly depending on what the customer can answer. [SINGLE-SOURCE, UNCORROBORATED — see caveat above]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions; additional questions... asked flexibly depending on what the customer can answer”

### BR-080: Lighter Contact-Center Verification for Registered Number Callers
`Explicit` · confidence: `medium`

- **Description:** Contact-center verification is lighter if the customer is calling from their registered number.
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “contact-center verification is lighter if the customer is calling from their registered number”

### BR-082: KID-in-Use Mandatory Order Task and Contract Attachment
`Explicit` · confidence: `high`

- **Description:** When KID is already in use, the order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed, and downstream submission is blocked until the order task is completed.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed”

### BR-091: 5G Indoor Site Lock
`Explicit` · confidence: `high`

- **Description:** Site lock is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Site lock is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere [00:31:41, 00:54:13]”

### BR-095: Device Lock-In Period (12 months)
`Explicit` · confidence: `high`

- **Description:** Device lock-in period is 12 months; commitment/lock-in reset ONLY happens on disconnection during FWA relocations/moves; any plan change resets the 'limit date' and loses the locking.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Device lock-in: 12 months; commitment/lock-in reset ONLY happens on disconnection during FWA relocations/moves...any plan change resets the "limit date" and loses locking [01:25:44, 01:26:00, 01:27:41]”

### BR-096: STB Certification Limit
`Explicit` · confidence: `high`

- **Description:** Up to 18 STB (set-top box) subscriptions are certified per connection (highest seen in production: 11-13).
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “up to 18 STB subscriptions certified per connection (highest seen in production: 11-13) [01:38:24, 01:38:59]”

### BR-098: KID mandatory search-only lookup
`Explicit` · confidence: `high`

- **Description:** Agents can only search for a KID (Known ID/address record); manual entry is not permitted. If no KID is found, the agent is diverted to an FWA journey.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey [00:03:53, 00:04:10]”

### BR-099: ZSB mandatory for FWA/fixed only, not mobile
`Explicit` · confidence: `high`

- **Description:** ZSB (zone/street/building) address detail capture is mandatory for FWA 5G and fixed/fiber services, but NOT for mobile, which uses a shared dummy address record. Consumer activation procedure v8.0 formalized mandatory ZSB detail capture (refs 2.1.15, 3.1.12).
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record [00:20:38, 00:21:02]”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “added mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)”

### BR-101: FWA geofencing / location lock
`Explicit` · confidence: `high`

- **Description:** FWA (Fixed Wireless Access) service is geofenced to its registered installation location; the service is disabled/suspended if the customer relocates the device elsewhere.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “FWA is geofenced to its registered location — service is disabled/suspended if the customer moves the device elsewhere [00:21:19, 00:21:41]”

### BR-103: Star number restoration/declaration form for numbers >= 1500 Riyal
`Explicit` · confidence: `high`

- **Description:** For star numbers valued 1,500 Riyal and above, a customer data restoration/declaration form (listing recent usage) is required, including a clause allowing Vodafone to reclaim the number if the transfer is later found fraudulent.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “for star numbers valued 1,500 Riyal and above — a customer data restoration/declaration form (listing recent usage) with a clause letting Vodafone reclaim the number if the transfer is found fraudulent [00:45:59, 00:47:23, 01:03:51]”

### BR-104: TON age validation (must not be a minor)
`Explicit` · confidence: `high`

- **Description:** Transfer of Ownership (TON) requires age validation confirming the recipient is not a minor, verified via MOI/date-of-birth data, with a known risk of 5-8 day MOI database sync lag.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Requirement: age validation (must not be a minor) via MOI/date-of-birth, noting a known 5-8 day MOI database sync lag risk [01:00:35]”

### BR-106: TON requires clearance of DOI and penalties before transfer
`Explicit` · confidence: `high`

- **Description:** Before a Transfer of Ownership can proceed, the entire Device on Installment (DOI) balance (not just the first installment) and any remaining lock-in/park-my-number penalties must be fully cleared.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Entire DOI (not just first installment) and any remaining lock-in/park-my-number penalties must be cleared before transfer [01:15:17, 01:15:53]”

### BR-109: MOI data precedence with secondary-parameter cross-check
`Explicit` · confidence: `high`

- **Description:** MOI (Ministry of Interior) data takes precedence over OCR-captured document data, but only after a secondary-parameter cross-check (e.g., date of birth, nationality, expiry) passes successfully.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “MOI data takes precedence over OCR-captured data but ONLY after a secondary-parameter cross-check (e.g., DOB, nationality, expiry) passes [00:36:23, 00:38:04]”

### BR-117: Customer identification requirements for Prepaid
`Explicit` · confidence: `high`

- **Description:** Prepaid customers must provide a valid QID, GCC ID (issued in UAE, Bahrain, Oman, Saudi Arabia, or Kuwait), Passport, or Diplomatic ID.
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “must provide valid QID, GCC ID, Passport, or Diplomatic ID for Prepaid; GCC IDs issued in UAE/Bahrain/Oman/Saudi Arabia/Kuwait”

### BR-119: Passport without customer signature exception (v8.0)
`Explicit` · confidence: `high`

- **Description:** Version 8.0 (Jul 2, 2024) of the consumer activation procedure added an exception allowing prepaid activation with a passport lacking customer signature (ref 2.1.13).
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “v8.0 (Jul 2, 2024): Added exception for prepaid activation business rules — passport without customer signature (ref 2.1.13)”

### BR-120: Postpaid minimum subscription period (Lock-in) of 3 months
`Explicit` · confidence: `high`

- **Description:** Postpaid plans carry a minimum subscription period (lock-in) of 3 months.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Postpaid Plan* (note: minimum subscription period of 3 months applies); Minimum Subscription Period/Lock-in of 3 months”

### BR-123: Minimum deposit or valid credit card for credit limit
`Explicit` · confidence: `high`

- **Description:** Establishing a postpaid credit limit requires a minimum deposit of QR 2,000 or a valid credit card on file.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “credit limit/deposit rules (minimum deposit QR 2,000 or valid credit card)”

### BR-124: Reserved number 90-day hold pending QID submission
`Explicit` · confidence: `high`

- **Description:** Reserved numbers (including star numbers) are held for 90 days pending the customer's QID submission.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Numbers/Star Number reservation rules (90-day hold for reserved numbers pending QID submission”

### BR-125: Star Number lock-in tiers by value
`Explicit` · confidence: `high`

- **Description:** Star numbers carry a lock-in commitment tiered by value: 1 year for numbers valued QR1,500-19,999, and 2 years for numbers valued QR20,000 and above.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Star Number lock-in of 1 year for QR1,500–19,999 numbers, 2 years for QR20,000+”

### BR-128: Home Fibre and GigaHome/5G Home require supplementary signed forms
`Explicit` · confidence: `high`

- **Description:** Home Fibre subscriptions require a Vodafone Fibre Supplementary Form; GigaHome/5G Home services require an additional physically signed form.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Home Fibre requires Vodafone Fibre Supplementary Form; GigaHome/5G Home services require an additional physically signed form”

### BR-131: Cellular phone number format validation (974 prefix, 11 digits)
`Explicit` · confidence: `high`

- **Description:** Cellular phone numbers must start with the '974' country code prefix and must be 11 digits in total length.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Enter a Cellular Phone# that starts with '974'; Cellular Phone# must be of 11 digits”

### BR-132: QID must be 11-digit numeric value
`Explicit` · confidence: `high`

- **Description:** Qatari ID (QID) must be an 11-digit numeric value.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Please enter a valid 11-digit ID number; Qatari ID must be an 11-digit numeric value”

### BR-133: Passport format validation (4-20 alphanumeric)
`Explicit` · confidence: `high`

- **Description:** Passport numbers must be 4-20 alphanumeric characters, with no non-alphanumeric characters permitted.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Passport must be 4–20 alphanumeric characters (no non-alphanumeric characters)”

### BR-134: GCC ID format validation (8-20 numeric)
`Explicit` · confidence: `high`

- **Description:** GCC ID must be 8-20 numeric characters.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “GCC ID must be 8–20 numeric characters”

### BR-135: Business ID format validation (3-20 chars, numeric and /)
`Explicit` · confidence: `high`

- **Description:** Business ID must be 3-20 characters, containing only numeric characters and the "/" symbol.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Business ID must be 3–20 characters, numeric and "/" only”

### BR-136: Email format validation
`Explicit` · confidence: `high`

- **Description:** Email addresses must conform to standard email format (e.g., "abc@xyz.com" pattern); an incorrect-format error is shown otherwise.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Email format entered is incorrect... ("abc@xyz.com" pattern)”

### BR-137: ID expiration date must be in the future
`Explicit` · confidence: `high`

- **Description:** The ID Expiration Date entered for a customer's identification document must be in the future (not expired).
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “ID Expiration Date must be in the future”

### BR-138: Date of birth must match embedded QID DOB
`Inferred` · confidence: `medium`

- **Description:** Date of Birth entered must match the date of birth embedded within the QID number; a mismatch triggers a "do not match" validation error.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Date of Birth and Qatari ID "do not match" (implies an embedded-DOB validation against QID number)”

### BR-139: Contact under 18 flagged
`Explicit` · confidence: `high`

- **Description:** A contact record is flagged if the calculated age is under 18.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “contact age under 18 flagged”

### BR-155: QID immutable after Cross Sales redirect
`Explicit` · confidence: `high`

- **Description:** When a Cross Sales order redirects into the journey, the QID (e.g. 28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter or edit it.
- **Original rule ID(s):** `10`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “the QID (28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter it”

### BR-157: Alt. phone # must be a local mobile number (notification contact)
`Explicit` · confidence: `high`

- **Description:** The alternate phone number field is used as a notification contact and must be a local mobile number, per an info note shown on the field.
- **Original rule ID(s):** `12`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “info note: "This is a notification contact. Please enter a local mobile number."”

### BR-158: Appointment booking irreversibility rule
`Explicit` · confidence: `high`

- **Description:** Once a technician appointment is booked, it cannot be cancelled. The system presents a warning requiring the agent to confirm ("Ok") to proceed or "Cancel" to select a different appointment before booking.
- **Original rule ID(s):** `13,35`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment"”

### BR-161: Rejection reason drives which evidence must be re-collected on correction
`Inferred` · confidence: `high`

- **Description:** On order correction after rejection, the specific rejection reason determines which evidence must be re-collected — e.g. for "ID image not clear", the Qatari ID-Front/Back fields reset to empty upload placeholders, requiring re-upload of the flagged ID images.
- **Original rule ID(s):** `16,29`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front/Qatari ID-Back reset to empty upload placeholders — i.e., the correction flow re-requires the flagged evidence (ID photos) per the "ID image not clear" rejection reason”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “After rejection reason "ID image not clear", "now-empty Qatari ID-Front / Qatari ID-Back upload placeholders (i.e., the rejected images were cleared, consistent with the 'ID image not clear' rejection reason) — the agent must re-upload valid ID images"”

### BR-164: Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject
`Explicit` · confidence: `high`

- **Description:** Before an order can be Approved or Rejected, the Attachments tab must show QatarIdFront, QatarIdBack, and CAF all verified (green checkmarks); action buttons available are Approve, Reject - Correction, Reject - Drop Order, and Go Back.
- **Original rule ID(s):** `19`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Attachments tab (active — shows QatarIdFront, QatarIdBack, CAF, all green/verified), and action buttons Approve, Reject - Correction, Reject - Drop Order, Go Back”

### BR-165: 90-Day Temporary Number Rule for Non-Resident ID Types
`Explicit` · confidence: `high`

- **Description:** A number issued against a non-resident ID type (e.g. Passport) is only active for 90 days. To make the number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided.
- **Original rule ID(s):** `20,22`
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “System dialog on new contact with ID Type Passport: "This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided"”

### BR-167: Get IPTV Mandatory Field on Contact Step
`Explicit` · confidence: `high`

- **Description:** The "Get IPTV?" field on the contact step is a required field, highlighted with a red box in the UI.
- **Original rule ID(s):** `24`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Get IPTV ?" (required field, highlighted with a red box in the screenshot)”

### BR-168: Qatari ID Front/Back Photo Upload Mandatory
`Explicit` · confidence: `high`

- **Description:** Qatari ID-Front and Qatari ID-Back photo uploads are mandatory fields, shown as required uploaded-photo placeholders that must display green checkmarks.
- **Original rule ID(s):** `25`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two required uploaded-photo placeholders both show green checkmarks: "Qatari ID-Front" and "Qatari ID-Back"”

### BR-169: B2B2C Order Requires Proof of Employment Attachment
`Explicit` · confidence: `high`

- **Description:** For B2B2C orders, the attachments step requires Proof of Employment (required, B2B2C-specific), CAF (auto-generated/required), and optionally a Supplementary Form, plus an Add File option.
- **Original rule ID(s):** `26`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 requires Proof of Employment* (required, B2B2C-specific), CAF* (auto-generated/required), Supplementary Form (optional), and Add File”

### BR-173: Order Approval Reject Reason Taxonomy
`Explicit` · confidence: `high`

- **Description:** Standard rejection reasons for order approval include: "ID image not clear", "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/Building information", "Bill explainer missing/Incorrect".
- **Original rule ID(s):** `31`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"ID image not clear", "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/ Building information", "Bill explainer missing/ Incorrect"”

### BR-174: Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)
`Explicit` · confidence: `high`

- **Description:** Zone, Street No., Building No., Apt/Flat/Unit, and Area are required address fields; the system prompts the user to enter them or, in the FWA Postpaid Business journey, gives the option to click Skip Address to proceed without saving the address.
- **Original rule ID(s):** `32,36`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit, Area or click Skip Address to proceed without Saving Address."”

### BR-175: Building No. Must Be Numeric, Max 5 Characters
`Explicit` · confidence: `high`

- **Description:** Building No. must be numeric and no more than 5 characters long.
- **Original rule ID(s):** `33`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Building No. of 5 characters or less."”

### BR-176: Street No. Must Be Numeric, Max 5 Characters
`Explicit` · confidence: `high`

- **Description:** Street No. must be numeric and no more than 5 characters long.
- **Original rule ID(s):** `34`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Street No. of 5 characters or less."”

### BR-177: SIM Serial Required Before Continue
`Explicit` · confidence: `high`

- **Description:** A valid SIM Serial number must be entered before the agent can press 'Continue'.
- **Original rule ID(s):** `37`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter a valid SIM Serial before pressing 'Continue'."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter a valid SIM Serial before pressing 'Continue'."”

### BR-178: SIM Serial Must Be 19 Digits
`Explicit` · confidence: `high`

- **Description:** The SIM Serial number must be exactly 19 digits; otherwise the system raises "Error: SIM Serial # must be 19 digits."
- **Original rule ID(s):** `38`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: SIM Serial # must be 19 digits."”

### BR-179: SIM Must Exist in UIM Inventory
`Explicit` · confidence: `high`

- **Description:** The entered SIM card must exist in the UIM inventory system; otherwise the system returns "SIM Card does not exist in UIM(SBL-EXL-00151)".
- **Original rule ID(s):** `39`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"”

### BR-180: SIM Must Not Already Be Assigned in UIM
`Explicit` · confidence: `high`

- **Description:** A SIM card must not already be assigned in UIM; otherwise the system returns "SIM Card already assigned in UIM(SBL-EXL-00151)".
- **Original rule ID(s):** `40`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card already assigned in UIM(SBL-EXL-00151)"”

### BR-181: CPE Serial Must Be Free (Unassigned) in UIM
`Explicit` · confidence: `high`

- **Description:** The CPE serial number must be free (unassigned) in UIM; otherwise the system returns an error such as "CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)", surfaced via the VFQA Error Handling Service (SBL-BPR-00162) with a support reference format like "1-DNODWJU".
- **Original rule ID(s):** `41`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)" surfaced via VFQA Error Handling Service (SBL-BPR-00162), with support reference format "1-DNODWJU"”

### BR-182: Supplementary Form Mandatory for FWA CAF Step
`Explicit` · confidence: `high`

- **Description:** The Supplementary Form must be selected before continuing on the FWA CAF step; the Supplementary Form tile is marked mandatory with a red asterisk, and omitting it raises "Error: Please select Supplementary Form before continuing."
- **Original rule ID(s):** `42`
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: Please select Supplementary Form before continuing." — Supplementary Form tile marked mandatory with red asterisk”

### BR-190: Work Zone Mismatch Flagged When Reassigning Technician
`Explicit` · confidence: `high`

- **Description:** When reassigning a technician via the 'Move' dialog in WFM, the system flags a 'Work zones mismatch' warning in red if the new technician's work zone does not match the activity's required zone.
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Move" dialog for technician "Syed Irfan" flagged 'Work zones mismatch' (in red)”

### BR-191: WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending
`Explicit` · confidence: `high`

- **Description:** A WFM field activity cannot be marked 'End' until Assess Activity, Checklist, and all Mandatory Fields (marked with *) are completed; one variant additionally requires Device Activation and verification via the Inventory tab that scanned device(s) are installed.
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"You Need to Complete 'Assess Activity', 'Checklist', 'Device Activation' & 'Mandatory Fields' marked with * to 'End' the Activity. Please check 'Inventory' tab to verify scanned device/s are installed."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"You Need to Complete 'Assess Activity', 'Checklist' & 'Mandatory Fields' marked with * to 'End' the Activity."”

### BR-192: No Duplicate Kahramaa ID Installation Check (30-Day Lookback)
`Explicit` · confidence: `high`

- **Description:** The system checks for previous installation records tied to the same Kahramaa ID within the last 30 days to prevent duplicate installations; confirmation message shown when no duplicate is found.
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"No previous records are found based on Kahrama ID in last 30 days."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"No previous records are found based on Kahrama ID in last 30 days."”

### BR-193: Appointment Booking Capacity/Slot Full Rule
`Explicit` · confidence: `high`

- **Description:** Appointment booking calendar displays live capacity counts per date/time slot (e.g. '14/15'); slots that reach capacity are marked 'Full' in red and presumably cannot be selected.
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “calendar grid of dates x time slots with live capacity counts (e.g. "14/15"); on 09/07/2025, the 8AM-11AM and 11AM-2PM slots show "Full" (red)”

### BR-194: Advance Payment Required for HRN Customer
`Explicit` · confidence: `high`

- **Description:** Customers flagged as High Risk (HRN) are required to pay an advance payment of QR 100 before proceeding, indicated via an info banner.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Info banner: "(HRN) Customer needs to pay advance payment of QR 100."”

### BR-195: Address Required Fields Before Saving
`Explicit` · confidence: `high`

- **Description:** Before saving an address, the required fields Zone, Street No., Building No., Apt/Flat/Unit, and Area must be entered; alternatively the agent can click 'Skip Address' to proceed without saving the address. Confirmed across both FWA outdoor WFM and FWA Indoor B2B2C journeys.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit, Area — or click Skip Address to proceed without Saving Address."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"”

### BR-196: Appointment Once Booked Cannot Be Cancelled
`Explicit` · confidence: `high`

- **Description:** Once an installation appointment (including unscheduled appointments) is booked, it cannot be cancelled — either at all, or specifically not within the current journey. The agent must confirm ('OK') to proceed with booking or cancel to pick another slot.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"WARNING: Appointment once booked cannot be cancelled. Click 'OK' to continue or 'Cancel' to select another appointment"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue."”

### BR-198: Serial Number Check Required Before Service Activation
`Explicit` · confidence: `high`

- **Description:** Before service activation, a Serial Number Check (Dual Play) is performed across CPE Indoor/Outdoor/SIM components; all must show validated green checks before the activation request is sent.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Serial Number Check - Dual Play performed (CPE Indoor/Outdoor/SIM) with all validated green checks then 'Sending activation request.'”

### BR-202: SIM Serial Number Must Be 19 Digits
`Explicit` · confidence: `high`

- **Description:** The SIM Serial number field is validated to require exactly 19 digits; an error is shown otherwise.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: SIM Serial # must be 19 digits."”

### BR-203: CPE Serial Required Before Continue
`Explicit` · confidence: `high`

- **Description:** A valid CPE Serial number must be entered (field-level 'This field is required' also shown) before the agent can press 'Continue'.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter a valid CPE Serial before pressing 'Continue'.", field-level "This field is required."”

### BR-204: SIM Card Must Not Already Be Assigned in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered SIM Card is not already assigned to another account/service; error code SBL-EXL-00151 raised if already assigned.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"SIM Card already assigned in UIM(SBL-EXL-00151)"”

### BR-205: SIM Card Must Exist in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered SIM Card exists in the inventory system; error code SBL-EXL-00151 raised if it does not exist.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"”

### BR-206: CPE Serial Number Must Be Free in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered CPE Serial Number is free/unassigned before it can be used; error code SBL-EXL-00151 raised if not free.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)"”

### BR-207: Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C)
`Explicit` · confidence: `high`

- **Description:** In the FWA Indoor B2B2C journey, Proof of Employment, CAF, and Supplementary Form document selections are all mandatory before the agent can continue; errors are raised individually for missing Supplementary Form and missing Proof of Employment. Confirmed as a mandatory Supplementary Form requirement in the 'with approval' variant as well.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Error: Please select Supplementary Form before continuing." then "Error: Please select Proof of Employment before continuing."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: Please select Supplementary Form before continuing." — confirms the "Mandatory Supplementary form" requirement”

### BR-210: Approve Order Requires Verification Confirmation and Comments
`Explicit` · confidence: `high`

- **Description:** To approve an order, the approver must confirm via checkbox/statement that they have verified all documents and details ('By clicking submit, I agree that I have verified all the documents and details to proceed with submission') and can enter comments in a Comments box.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"By clicking submit,I agree that I have verified all the documents and details to proceed with submission" with a Comments box”

### BR-212: Supplementary Form Mandatory Alongside CAF
`Explicit` · confidence: `high`

- **Description:** The Supplementary Form must be selected alongside the CAF before continuing; an error is raised if omitted. (See also BR-019 for the broader B2B2C document set.)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: Please select Supplementary Form before continuing." — confirms the "Mandatory Supplementary form" requirement”

### BR-214: Order Expiry SLA Timer on Pending Approval
`Inferred` · confidence: `medium`

- **Description:** An order pending approval displays an Order Expiry timestamp (shown in red text), indicating an SLA timer for approval before the order expires.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Order Expiry: 20/09/2025 02:14:24 PM" (red text — approval SLA)”

### BR-216: Rejection Reason Recorded
`Explicit` · confidence: `high`

- **Description:** When an order is rejected, a rejection reason/comment is recorded (e.g., 'ID image not clear').
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “rejection comment "ID image not clear" seen for two Mitra Kharel entries”

### BR-218: Comments Field Must Be Non-Trivial / Meet Minimum Length
`Inferred` · confidence: `medium`

- **Description:** Comments entered by an agent must be non-trivial before proceeding (e.g., Save and Finish): a note instructs agents to record a meaningful comment on actions performed for other advisors' benefit, and in the Home Move journey this is enforced with a validation rule requiring more than 5 characters.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “note: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history."”
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Business rule captured verbatim: comments field validation requires more than 5 characters.”

### BR-219: Install Inventory (SNC) Must Follow Service Activation Success
`Explicit` · confidence: `high`

- **Description:** Inventory installation (via Install Inventory-SNC) must only be performed after the Service Activation Status shows 'Success'.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status."”

### BR-222: KID Eligibility Check for Home Move During Assess Activity
`Explicit` · confidence: `high`

- **Description:** During the Assess Activity step of a Home Move, a validation popup checks whether the KID (Kahramaa ID or Kunden/Kahramaa Identifier) is eligible for Home Move.
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

### BR-225: Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value
`Explicit` · confidence: `high`

- **Description:** The Bill Limit / Smart Limit value entered by the agent cannot be set lower than the plan-specific Agent Minimum Value; a validation message blocks lower entries (e.g., entering 28 when Agent Minimum is 50).
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent types 28 into Smart Limit input and clicks Go -> validation message: 'Bill Limit can not be set lower than Agent Minimum 50'”

### BR-229: Add-On Requires Sufficient Bill Limit Coverage
`Explicit` · confidence: `high`

- **Description:** If a selected add-on exceeds the current Bill Limit, the system prompts the agent (via info banner) to go back to the Plan step and edit the limit to cover the add-on amount.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Info banner: 'Go back to Plan step and edit limit to cover for the add-on amount.'”

### BR-234: MOI Validation required/auto-triggered for Contact confirmation
`Explicit` · confidence: `high`

- **Description:** Method of Identification (MOI) validation is required and auto-triggered to confirm contact details before proceeding, surfaced via a blue banner prompting the agent to confirm the contact details once validation completes.
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “blue banner 'MOI Validation completed, please confirm the contact details'”

### BR-235: SIM Serial entry triggers number reservation check
`Explicit` · confidence: `high`

- **Description:** Entering the SIM serial number automatically triggers a background check that validates the SIM and reserves the associated number, with a progress indicator shown to the agent while the check runs.
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'SIM Serial check and number reservation in progress. Please wait...'”

### BR-236: Fixed Pre-sales = Yes requires Preferred Time and address capture
`Explicit` · confidence: `high`

- **Description:** When a lead's connection type is Home/Fixed and 'Fixed Pre-sales' is set to Yes, additional conditional fields become required: a Preferred Time date/time picker and full address capture (Zone, Street, Building, Unit).
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “After selecting Home, a conditional field 'Fixed Pre-sales' appears (Yes/No) ... Preferred Time date/time picker ... Zone, Street, Building, Unit”

### BR-238: Reject Lead requires Reject Reason Code and Reject Comment
`Explicit` · confidence: `high`

- **Description:** Rejecting a lead requires the agent to populate a mandatory Reject Reason Code dropdown and a Reject Comment free-text field; leaving these empty is flagged as invalid (shown outlined red).
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “required Reject Reason Code dropdown (shown invalid/empty, outlined red) and Reject Comment text field”

### BR-241: Created By is immutable across Owner Change
`Explicit` · confidence: `high`

- **Description:** The Created By field on a lead remains fixed to the original creator and does not change even when the Lead Owner is reassigned to a different agent.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Created By HEMANTH (unchanged throughout)”

### BR-248: Number reservation blocks number for reserving agent
`Explicit` · confidence: `high`

- **Description:** Once a number begins the reservation process, its status shows BLOCKED with the reserving agent recorded in Reserved By, preventing other agents from selecting it before formal reservation completes.
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Unreserved Numbers grid: Status BLOCKED / Reserved By SUYASHKULKARNI_VFQ before formal reservation completes”

### BR-249: Bill Limit cannot be set below Agent Minimum Value
`Explicit` · confidence: `medium`

- **Description:** The system enforces a hard floor on the Bill Limit (a form of Spend Limit) equal to the product's configured Agent Minimum Value; entering a value below that threshold blocks journey progression and surfaces a system error referencing the admin/System Administrator with error code SBL-EXL-00151. Conversely, entering a value at or above the Agent Minimum allows the journey to proceed.
- **Original rule ID(s):** `SBL-EXL-00151`
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Bill Limit can not be set lower than Agent Minimum 80. Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)"”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “"When agent enters below Agent minimum value" ... "When agent enters above Agent minimum value, user can proceed the journey"”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)”

### BR-250: Maximum Bill Limit equals account Credit Limit
`Explicit` · confidence: `high`

- **Description:** The maximum allowable Bill Limit is capped at (equivalent to) the account's Credit Limit; the agent is instructed by an on-screen note to communicate this cap to the customer.
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “On Validate, an alert reads: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."”

### BR-258: Order Expiry / approval SLA window
`Inferred` · confidence: `medium`

- **Description:** Orders pending manager approval carry an Order Expiry timestamp representing an approximately 3-day SLA window measured from the order's submission/creation time, after which the order presumably lapses.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Order Expiry: 20/08/2025 08:39:01 AM — a 3-day SLA window from submission (created 8/17/2025 08:39:01 AM)”

### BR-259: Manager approval requires document verification acknowledgement
`Explicit` · confidence: `high`

- **Description:** When a manager submits/approves an order, they must explicitly acknowledge via an on-screen statement that they have verified all documents and details before the submission can proceed.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"By clicking submit, I agree that I have verified all the documents and details to proceed with submission."”

### BR-262: Add-on selection constrained by Bill Limit headroom
`Explicit` · confidence: `high`

- **Description:** Selecting an add-on is constrained by the remaining headroom under the account's Bill Limit; if the add-on amount would exceed that headroom, the agent must return to the Plan step and raise the Bill Limit to cover the add-on before proceeding.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"Go back to Plan step and edit limit to cover for the add-on amount."”

### BR-263: Proof of Employment mandatory for B2B2C attachments
`Explicit` · confidence: `high`

- **Description:** In the B2B2C order flow, Proof of Employment is a hard-required attachment; the system blocks progression with an error if it is not selected/uploaded.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “"Error: Please select Proof of Employment before continuing." — Proof of Employment is a hard-required attachment for this B2B2C flow”

### BR-267: Number reservation generates a unique reservation token
`Explicit` · confidence: `high`

- **Description:** Successfully reserving a number generates a unique reservation token returned to the agent via a system success alert, referencing error/success code SBL-EXL-00151.
- **Original rule ID(s):** `SBL-EXL-00151`
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Browser alert: "SUCCESS:Reservation Token:15557466(SBL-EXL-00151)"”

### BR-274: Connection count check before conversion (existing prepaid/postpaid line counts shown)
`Explicit` · confidence: `high`

- **Description:** Before a Pre-to-Post conversion, the system displays a Connection Details modal showing the existing total number of prepaid and postpaid connections for the customer, allowing a count check as part of the conversion flow.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Connection Details modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”

### BR-275: Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times
`Explicit` · confidence: `high`

- **Description:** A recurring add-on already active on a line cannot be purchased a second time on that same line (validation failure), whereas one-off add-ons may be added multiple times on the same line.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “recurring add-ons can't be purchased twice (fails at validation); one-off add-ons can be added multiple times”

### BR-276: Discounts cannot be multi-selected on one order (BAU rule)
`Explicit` · confidence: `high`

- **Description:** Only a single discount may be selected per order; multi-selecting discounts within one order is disallowed as a business-as-usual rule.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “discounts cannot be multi-selected in one order (BAU rule)”

### BR-277: FDO maximum 30 days ahead
`Explicit` · confidence: `high`

- **Description:** A Future Dated Order (FDO) can be scheduled for execution no more than 30 days ahead of the order creation date.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “maximum 30 days ahead for an FDO”

### BR-279: Failed FDO orders must not be cancelled manually
`Explicit` · confidence: `high`

- **Description:** If FDO execution fails validation, the request is automatically cancelled with the error captured by the system; agents/users must not manually cancel failed FDO orders.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “if FDO execution fails validation the request is cancelled with error captured; failed FDO orders must not be cancelled manually”

### BR-285: Order cannot be dropped without going through Approval
`Explicit` · confidence: `high`

- **Description:** An order cannot be dropped by a user unless it has gone through the Order Approval step; attempting to drop without approval produces an error.
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “If without Order Approval Any user try to Drop the Order the below error will appear”

### BR-290: CAF/attachment size limit ~4MB
`Explicit` · confidence: `high`

- **Description:** Customer Application Form (CAF) and other order attachments are limited to approximately 4MB in file size.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “CAF/attachment size limit ~4MB (01:47:35)”

### BR-291: Signed CAF must not be editable after signing
`Explicit` · confidence: `high`

- **Description:** Once a Customer Application Form (CAF) has been signed, it must become locked/non-editable to preserve the integrity of the signed document.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “signed CAF must not be editable after signing (01:47:31)”

### BR-296: MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)
`Explicit` · confidence: `high`

- **Description:** MNP porting requires the customer to send a mandatory confirmation SMS to a clearinghouse shortcode, which is charged QR 1; no confirmation SMS is sent if the port request is rejected.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “a mandatory customer SMS to a clearinghouse shortcode to confirm porting (charged QR 1; no SMS sent on rejection)”

### BR-297: MNP requires two signatures (legal requirement)
`Explicit` · confidence: `high`

- **Description:** MNP (mobile number portability) requests require two signatures as a legal requirement confirmed by the review team.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “two signatures (legal requirement per review team, 01:27:37)”

### BR-300: Order Billing Profile must match Line Items' Billing Profile
`Explicit` · confidence: `high`

- **Description:** The Billing Profile set at the order level must match the Billing Profile of each of the order's Line Items.
- **Original rule ID(s):** `ORD_VALD_RULE_001`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Order Billing Profile must be same with Line Items' Billing Profile”

### BR-301: Business account open-order block
`Explicit` · confidence: `high`

- **Description:** For a business account, a new pending order cannot be submitted if there is already an open order existing under that account.
- **Original rule ID(s):** `ORD_VALD_RULE_005`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “For business account, pending order cannot be submitted if open order exists under it”

### BR-302: SIM Card serial number mandatory
`Explicit` · confidence: `high`

- **Description:** A Serial Number is a mandatory field for any SIM CARD product on an order.
- **Original rule ID(s):** `ORD_VALD_RULE_019`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Serial Number is required for SIM CARD product”

### BR-303: Payment authorization requirement
`Explicit` · confidence: `high`

- **Description:** All payments associated with an order must be authorized before the order can proceed.
- **Original rule ID(s):** `ORD_VALD_RULE_030`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “All Payments should be Authorized”

### BR-304: MNP Port-In DNO verification attachment requirement
`Explicit` · confidence: `high`

- **Description:** An MNP Port-In order requires a DNO (Donor Network Operator) Verification Attachment to be provided.
- **Original rule ID(s):** `ORD_VALD_RULE_110`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “DNO Verification Attachment is required for MNP Port-In order”

### BR-305: Fixed Line address KID requirement
`Explicit` · confidence: `high`

- **Description:** A Fixed Line (FL) address on an order must include a KID (unique address/location identifier).
- **Original rule ID(s):** `ORD_VALD_RULE_161`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “FL Address must have KID in it”

### BR-306: Bill Limit Minimum threshold (Agent) / BL rule series 01-09
`Explicit` · confidence: `high`

- **Description:** Bill Limit (BL) rules 01 through 09 govern bill-limit modification for agents, including minimum/maximum threshold checks and conflicts with in-flight orders.
- **Original rule ID(s):** `BL RULE 01-09 series`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bill Limit (BL) rules 01–09 governing bill-limit modification, minimum/maximum thresholds and conflicts with in-flight orders”

### BR-308: IoT vs Non-IoT MSISDN length rule
`Explicit` · confidence: `high`

- **Description:** MSISDN length must conform to product type: non-IoT MSISDNs are 8 digits, IoT MSISDNs are 10 digits.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT)”

### BR-309: iWatch/RIO max one per order
`Explicit` · confidence: `high`

- **Description:** An order may include a maximum of one iWatch/RIO product; this is part of the broader iWatch/RIO bundle validation which also includes a credit limit check.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block)”

### BR-310: iWatch/RIO EID requirement
`Explicit` · confidence: `high`

- **Description:** An EID (eSIM identifier) is required as part of the iWatch/RIO bundle validation.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “EID requirement”

### BR-312: Bulk SMS one-active-per-account rule
`Explicit` · confidence: `high`

- **Description:** An account may have only one active Bulk SMS service at a time.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “one active Bulk SMS per account, mandatory attachment, blacklist check”

### BR-313: Bulk SMS mandatory attachment rule
`Explicit` · confidence: `high`

- **Description:** A Bulk SMS order requires a mandatory supporting attachment.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “mandatory attachment”

### BR-315: Account-level APN uniqueness
`Explicit` · confidence: `high`

- **Description:** APN validation enforces account-level APN uniqueness, alongside related checks for Static IP, Domain Hosting, and Broadband Service Link.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “APN validation (Static IP, Domain Hosting, Broadband Service Link, Account-level APN uniqueness)”

### BR-316: Deposit Service Bundle one-per-account rule
`Explicit` · confidence: `high`

- **Description:** An account may have only one Deposit Service Bundle at a time.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Deposit Service Bundle rules (one per account, cannot be first service, cannot TON)”

### BR-318: Deposit Service Bundle cannot combine with TON
`Explicit` · confidence: `high`

- **Description:** A Deposit Service Bundle cannot be combined with a TON (Transfer of Name/Ownership) on the same order.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “cannot TON”

### BR-320: IPTV/IDM email uniqueness rule
`Explicit` · confidence: `high`

- **Description:** IPTV/IDM registrations enforce email-address uniqueness across accounts/subscriptions.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IPTV/IDM email-uniqueness rules”

### BR-321: ALP account existence / default billing profile cross-check
`Explicit` · confidence: `high`

- **Description:** Account Level Product/Bundle (ALP) orders undergo BRM cross-checks validating account existence and the type/status of the default billing profile.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “ALP (Account Level Product/Bundle) BRM cross-checks (account existence, default billing profile type/status)”

### BR-322: Each activation requires unique KID
`Explicit` · confidence: `high`

- **Description:** Each activation requires a unique KID; for villa partitions with a shared real address, the first connection uses the real KID and subsequent connections use dummy KIDs to satisfy the uniqueness requirement.
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Villa partitions use dummy KIDs (first connection on real KID, subsequent on dummies) since each activation needs a unique KID”

### BR-323: MSISDN required to create a Siebel lead from RFS Portal
`Explicit` · confidence: `high`

- **Description:** The RFS Portal captures MSISDN and creates a Siebel lead via API; MSISDN is not used as a search key, but no lead can be created without it being present.
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

### BR-325: Address lock after RFS feasibility check
`Explicit` · confidence: `high`

- **Description:** The service address is locked after the Ready-for-Service (RFS) feasibility check is completed.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “address lock after check”

### BR-326: Proof-of-address file size cap (2MB)
`Explicit` · confidence: `high`

- **Description:** Proof-of-address document uploads are capped at 2MB.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

### BR-332: Bill period non-editable in bill profile capture
`Explicit` · confidence: `high`

- **Description:** During bill profile capture (bill address, bill cycle, bill period, bill mode), the bill period field is non-editable.
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

### BR-339: Payment Capture via WinCash for Suspension/Resume Orders
`Explicit` · confidence: `medium`

- **Description:** Payment associated with service suspension or resume must be captured/collected through the WinCash payment system before order submission (payment for suspension collected in WinCash per J023; payment for resume service via WinCash per J024).
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment for suspension, collected in WinCash (J023); capture payment of resume service via WinCash (J024)”

### BR-343: MNP Port Out Activity Validation and Auto Status Change
`Explicit` · confidence: `high`

- **Description:** Activities within an MNP Port Out ticket are validated either automatically or by the MNP Team and marked Success/Failed; when all activities are complete, the ticket's overall status changes automatically.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically.”

## Eligibility Rules

### BR-003: Try & Buy 30-Day Waiver Condition
`Explicit` · confidence: `high`

- **Description:** For Try & Buy subscriptions only, disconnecting within the first 30 days waives disconnection charges, but the OSN Box must be returned to a Vodafone store in good working condition. If the box is not returned, or not returned in good working condition, a penalty of QAR 165 applies.
- **Original rule ID(s):** `raw:Try & Buy 30-Day Waiver Condition`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Disconnecting within the first 30 days (Try & Buy only) waives disconnection charges, but the OSN Box must be returned to a Vodafone store; if not returned or not in good working condition, penalty is QAR 165”

### BR-004: Home Move Free-Once-Per-Cycle Rule
`Explicit` · confidence: `high`

- **Description:** Home Move service is free once every 12-month cycle and must be requested at least 14 days before shifting. If fibre is unavailable at the new address, the customer is offered alternate Broadband Plans or must pay Disconnection Fees. Home Move is also confirmed as a common product offered to both consumer and enterprise segments (along with 5G Indoor).
- **Original rule ID(s):** `raw:Home Move Free-Once-Per-Cycle Rule; raw:Consumer/Enterprise Common Products Rule`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Home Move is free once every 12-month cycle; must be requested 14 days before shifting. If fibre is unavailable at the new address, customer gets alternate Broadband Plans or pays Disconnection Fees”
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “Confirmed business rules: 5G Indoor and Home Move are common between consumer and enterprise”

### BR-005: Kahramaa ID One-Offer-Per-Household Rule
`Explicit` · confidence: `high`

- **Description:** The offer permits only one connection per household, identified by Kahramaa ID; multiple QID activations within the same household attempting to re-qualify for the offer are not permitted and result in removal of the offer.
- **Original rule ID(s):** `raw:Kahramaa ID One-Offer-Per-Household Rule`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Offer is one connection per household (per Kahramaa ID); multiple QID activations in the same household to re-qualify are not permitted and will result in removal of the offer”

### BR-006: Kahramaa ID Reuse by New Tenant
`Explicit` · confidence: `high`

- **Description:** Vodafone may disconnect service without notice if the customer relocates or leaves the Premises. A new tenant at the same Premises is permitted to reuse the same Kahramaa ID for their own subscription.
- **Original rule ID(s):** `raw:Kahramaa ID Reuse by New Tenant`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Vodafone may disconnect service without notice if the customer relocates/leaves the Premises; a new tenant at the same Premises may reuse the same Kahramaa ID for their own subscription”

### BR-018: Enterprise Credit Limit Approval Rule
`Explicit` · confidence: `high`

- **Description:** Enterprise accounts have no default credit limit and require business finance approval to establish one.
- **Original rule ID(s):** `raw:Enterprise Credit Limit Approval Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “enterprise has no default credit limit and requires business finance approval”

### BR-025: Volumetric Discount Minimum Threshold Rule
`Explicit` · confidence: `high`

- **Description:** The volumetric discount has a minimum threshold of 50 numbers, is slab-based, and comes in revenue and service-count variants; it is evaluated at runtime and has no automatic downgrade when connection counts drop — flagged as a key revenue-leakage pain point.
- **Original rule ID(s):** `raw:Volumetric Discount Minimum Threshold Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “volumetric discount has a minimum of 50 numbers, is slab-based, comes in revenue and service-count flavours, is evaluated at runtime, and has no automatic downgrade when connections drop — flagged as the key revenue-leakage pain point”

### BR-041: FNP Consumer-Only, Fiber-to-Fiber Scope Rule
`Explicit` · confidence: `high`

- **Description:** Fixed Number Portability (FNP) is scoped to fiber-to-fiber only, for consumer customers only, with a 5 working day process.
- **Original rule ID(s):** `raw:FNP Consumer-Only, Fiber-to-Fiber Scope Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP (fiber-to-fiber only, consumer, 5 working days)”

### BR-042: FNP Outstanding Balance Clearance Rule
`Explicit` · confidence: `high`

- **Description:** For FNP, conditional acceptance is given with a visible due amount, giving the consumer 3 working days to clear it, after which the request is accepted with a porting date.
- **Original rule ID(s):** `raw:FNP Outstanding Balance Clearance Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date”

### BR-047: MNP Conditional Acceptance Billed-Due Threshold (100 QAR)
`Explicit` · confidence: `high`

- **Description:** Conditional acceptance for consumer MNP requests is automated when the billed due amount exceeds 100 QAR; unbilled amounts do not trigger conditional acceptance in MNP.
- **Original rule ID(s):** `raw:MNP Conditional Acceptance Billed-Due Threshold (100 QAR)`
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP”

### BR-048: FNP Conditional Acceptance at Service Level (unbilled amounts trigger)
`Explicit` · confidence: `high`

- **Description:** FNP (Fixed Number Portability) allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level.
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “FNP, by contrast, allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level”

### BR-069: Prepaid-to-Postpaid Migration Eligibility (network age, recharge, CDR usage)
`Explicit` · confidence: `high`

- **Description:** Eligibility checks for prepaid-to-postpaid migration (currently manual, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, and a CDR-based usage history check.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

### BR-081: Eligibility-First Gating for Fixed-Line (customer + location clubbed)
`Explicit` · confidence: `high`

- **Description:** Eligibility checks (customer/QID eligibility and location eligibility) are clubbed together at one point early in the fixed-line journey, before plan/service discussion, since there's no point discussing plans if the location or customer isn't eligible.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “eligibility checks (customer/QID eligibility and location eligibility) will be clubbed together at one point early in the journey, before plan/service discussion, since there's no point discussing plans if the location or customer isn't eligible”

### BR-087: Fixed-Line Cancellation Window (up to network activation, with win-back)
`Explicit` · confidence: `high`

- **Description:** Cancellation of a fixed-line order is allowed up to network activation, with a win-back path available via the sales team.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “cancellation is allowed up to network activation, with a win-back path via the sales team”

### BR-088: Fiber-First Selling Policy for FWA
`Explicit` · confidence: `high`

- **Description:** FWA/5G is only offered if fiber cannot be sold at that location; this is not a customer choice.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “FWA/5G is only offered if fiber cannot be sold at that location; not a customer choice [00:24:20]”

### BR-089: Self-Serve Instant Activation Restricted to Standard Customers
`Explicit` · confidence: `high`

- **Description:** Self-serve instant activation is restricted to 'standard' customers only — non-standard customers get a lead created instead.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “restricted to "standard" customers only — non-standard customers get a lead created instead [00:14:01, 00:14:53]”

### BR-102: Star number transfer requires postpaid commitment or prepaid payment
`Explicit` · confidence: `high`

- **Description:** Transferring a star number requires either a one-year postpaid commitment scaled to the number's value, or full payment of the star number's value if moving to prepaid; any commitment restarts from month one upon transfer.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Star number transfer requires EITHER a one-year postpaid commitment scaled to the number's value OR payment of the star number's value if going prepaid; commitment restarts from month one [00:52:23, 00:52:28, 00:58:13]”

### BR-105: TON pre-validate collection status before flow entry
`Explicit` · confidence: `high`

- **Description:** For Transfer of Ownership (TON), both party A (transferor) and party B (transferee) must be pre-validated as not being in collection status BEFORE entering the TON flow, rather than checked within the flow itself.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “pre-validate that neither party A nor party B is in collection BEFORE entering the TON flow, not inside it [01:12:57, 01:13:43]”

### BR-107: QID mandatory for postpaid
`Explicit` · confidence: `high`

- **Description:** QID (Qatari ID) is mandatory for postpaid subscriptions; postpaid cannot be sold against any other identification type, with one unspecified exception noted for later discussion.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “QID is mandatory for postpaid — postpaid cannot be sold against any other ID type, with one unspecified exception to be discussed later [00:25:18, 00:14:55]”

### BR-108: Expat passport holders limited to prepaid, max 5 numbers
`Explicit` · confidence: `high`

- **Description:** Expatriates holding only a passport (no QID/GCC ID) are generally limited to prepaid service, with a maximum of 5 numbers.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “expats on passport are generally limited to prepaid with a maximum of 5 numbers [00:25:18, 00:14:55]”

### BR-110: Maximum mobility lines cap (nationals unlimited, non-nationals 5 per operator)
`Explicit` · confidence: `high`

- **Description:** Maximum mobility lines (prepaid + postpaid combined) are unlimited for Qatari nationals but capped at 5 for non-nationals; the 5-line cap applies per operator, not cumulatively across operators.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “maximum mobility lines (prepaid + postpaid combined) — UNLIMITED for Qatari nationals, maximum 5 for non-nationals, and the 5-line cap is per operator (not across operators) [00:53:54, 00:54:33, 00:55:01]”

### BR-113: Postpaid eligibility based on collection/blacklist status, not outstanding amount
`Explicit` · confidence: `high`

- **Description:** Eligibility for new postpaid subscriptions is based on 'in collection' status and blacklist status, NOT the outstanding amount owed; a billing profile enters collection status once the overdue amount exceeds 100.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “eligibility for new postpaid is based on "in collection" status and blacklist, NOT outstanding amount...a billing profile enters collection once overdue exceeds 100 [00:47:47, 00:48:34, 00:49:00, 00:50:03]”

### BR-114: DOI eligibility requirements
`Explicit` · confidence: `high`

- **Description:** Device on Installment (DOI) eligibility requires an existing postpaid account in good standing, presence on an internal big-data eligibility list, and a QCB (Qatar Central Bank) credit check.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “requires an existing postpaid account in good standing, presence on an internal big-data eligibility list, and a QCB credit check [01:16:57, 01:17:07, 01:19:13]”

### BR-118: Age limit 18+ for Prepaid with minor exception process
`Explicit` · confidence: `high`

- **Description:** Prepaid customers must be 18 or older; an exception process exists for minors requiring Supreme Judicial Council approval plus Customer Data Management team approval.
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “Age Limit (customer must be 18+, with an exception process for minors requiring Supreme Judicial Council approval plus Customer Data Management team approval)”

### BR-130: Prepaid minimum registration age 18
`Explicit` · confidence: `high`

- **Description:** Prepaid registration requires a minimum age of 18 along with a valid QID, GCC ID, or Passport.
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “minimum age 18 with valid QID/GCC ID/Passport for registration”

### BR-148: Free-months offer once-per-QID eligibility rule
`Explicit` · confidence: `high`

- **Description:** The free-months promotional offer is usable only once per QID. Moving to a new location forfeits reuse of the offer. Disconnecting and reconnecting under the same or a different QID also forfeits the offer and risks account suspension/blacklisting.
- **Original rule ID(s):** `3`
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Free-months offer is usable once per QID; moving to a new location forfeits reuse; disconnecting/reconnecting under the same or a different QID forfeits the offer and risks account suspension/blacklisting.”

### BR-149: 5G Home reasonable-use / location restriction rule
`Explicit` · confidence: `high`

- **Description:** The 5G Home connection is intended for reasonable personal use only at the registered Home location. Use outside that location risks temporary suspension; continued out-of-location use over successive months risks permanent disconnection.
- **Original rule ID(s):** `4`
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “5G connection is for reasonable personal use at the registered Home location only; use outside that location risks temporary suspension, and continued outside use over successive months risks permanent disconnection.”

### BR-150: Mandatory Fibre migration within 4 weeks / disconnection rule
`Explicit` · confidence: `high`

- **Description:** When Fibre becomes available at a customer's location, Vodafone notifies the customer, who agrees to migrate to Fibre within 4 weeks. If the customer declines migration, Vodafone may disconnect the current Home service after a 4-week grace period.
- **Original rule ID(s):** `5`
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Vodafone will notify the customer when Fibre becomes available; customer agrees to migrate to Fibre within 4 weeks... If the customer declines migration to Fibre, Vodafone may disconnect the current Home service after a 4-week grace period.”

### BR-160: Device-detection prompt determines Instant vs Normal Activation eligibility
`Explicit` · confidence: `high`

- **Description:** When the system detects the device (Combo Box CPE and/or ONT) already present at the customer's premises, it prompts the agent to verify the device's serial number matches the one provided, then choose between Instant Activation and Normal Activation.
- **Original rule ID(s):** `15,21`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"We've detected the device at customer's premises... Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?" Buttons: Instant Activation / Normal Activation.”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?" with buttons Instant Activation / Normal Activation”

### BR-187: HRN Customer Advance Payment Requirement
`Explicit` · confidence: `high`

- **Description:** HRN (High Risk Number / High Risk Nationality) customers are required to pay an advance payment of QR 100.
- **Original rule ID(s):** `47`
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"(HRN) Customer needs to pay advance payment of QR 100."”

### BR-188: FWA/GigaHome Plan Minimum Subscription Period of 3 Months
`Explicit` · confidence: `high`

- **Description:** FWA and GigaHome fixed-line plans carry a minimum subscription period of 3 months — e.g. "GigaHome 5G Classic New Indoor - FWA" plan and "Gigahome 5Gbps" fixed-line plan both specify a minimum 3-month subscription.
- **Original rule ID(s):** `48,49`
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “"Plan Name (Minimum Subscription Period of 3 months applies): GigaHome 5G Classic New Indoor -FWA"”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Plan Name "Gigahome 5Gbps" (minimum subscription 3 months)”

### BR-200: Number Reservation via Free or Reserved Number Toggle
`Explicit` · confidence: `high`

- **Description:** Agents select a phone number via a Free Number / Reserved Number toggle; reserved numbers can be chosen (e.g., at QR0.00) as part of the order.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Toggle Free Number / Reserved Number (Reserved selected). Number 41202325 (QR0.00) chosen.”

### BR-211: 2+ Postpaid Connections Triggers Credit-Policy Advisory
`Explicit` · confidence: `high`

- **Description:** When a customer already has 2 or more postpaid connections, an advisory note appears instructing the agent to check the credit policy or seek credit control approval before proceeding. In the 'without approval' journey variant, this advisory is confirmed to be informational-only (not a hard gate) — no approval request, queue, or manager sign-off screen appears. A related Connection Details modal surfaces the customer's total prepaid/postpaid connection counts (e.g. 1 prepaid, 1 postpaid) with a 'Show Postpaid Plan Details' option before MNP proceeds.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 1, Button: "Show Postpaid Plan Details"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “the advisory is informational only in this flow, not a hard gate. ...no approval request, approval queue, or manager sign-off screen appears anywhere”

### BR-220: Location Must Be Fiber-Ready to Proceed with Home Move
`Explicit` · confidence: `high`

- **Description:** Before proceeding with a Home Move, the system confirms the new location is Fiber-ready via a pop-up prompt asking the agent to confirm continuation.
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"”

### BR-221: First-Time Home Move Customers Eligible for Free Home Move
`Explicit` · confidence: `high`

- **Description:** Customers performing their first Home Move are flagged by the system as eligible for a Free Home Move.
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “if first-time Home Move, customer is flagged "eligible for Free Home move"”

### BR-232: MNP declaration: unpaid postpaid bills must be settled within 30 days of switching
`Explicit` · confidence: `high`

- **Description:** Postpaid-specific MNP (Mobile Number Portability) declaration clause requiring that any unpaid or final postpaid bills be settled within 30 days of switching the number to another operator.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “postpaid-specific clauses on settling unpaid/final bills within 30 days”

### BR-233: Prepaid MNP declaration: unused prepaid balance is lost upon switching
`Explicit` · confidence: `high`

- **Description:** Prepaid MNP declaration clause informing the customer that any unused prepaid balance must be used before the number is switched, as any remaining balance will be forfeited/lost upon switching to another operator.
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'I should use my current Prepaid balance before the number is switched and that any unused balance will be lost.'”

### BR-246: Two-or-more postpaid connections credit warning
`Explicit` · confidence: `high`

- **Description:** When a customer already has two or more existing postpaid connections, the system displays a warning instructing the agent to check the credit policy or obtain credit control approval before proceeding with a new postpaid sale.
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “"Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"”

### BR-252: HRN (High-Risk Nationality) advance payment requirement
`Explicit` · confidence: `high`

- **Description:** Customers classified as High-Risk Nationality (HRN) are required to pay an advance payment of QR 100 as a condition of the sale/migration; this requirement blocks completion until satisfied.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “"(HRN) Customer needs to pay advance payment of QR 100."”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “(HRN) Customer needs to pay advance payment of QR 100.”

### BR-269: Minimum Subscription Period of 3 months applies to certain postpaid plans
`Explicit` · confidence: `high`

- **Description:** Certain postpaid plans (e.g. 'U Start', 'Red 350') carry a disclosed Minimum Subscription Period of 3 months, shown as a footnote on the CAF/plan selection screen.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Postpaid Plan "U Start" ("Minimum Subscription Period of 3 months applies")”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Postpaid Plan: Red 350 (note: "*Minimum Subscription Period of 3 months applies")”

### BR-280: Pre-to-Post FDO blocks FMS/MOI/collection-barred/blacklisted MSISDN and passport-ID customers
`Explicit` · confidence: `high`

- **Description:** For Pre-to-Post future dated orders, system validation blocks MSISDNs that are FMS/MOI/collection-barred or blacklisted, rejects customers identified by passport ID, and disallows any upfront payment (e.g., HRN fee) being combined within the same FDO order.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “system validation blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order”

### BR-281: Post-to-Pre Migration requires outstanding balance <=0 and 100 QR migration fee upfront
`Explicit` · confidence: `high`

- **Description:** A Post-to-Pre migration requires the outstanding balance to be system-validated as cleared (≤0), the execution date is limited to the next bill cycle, and a 100 QR migration fee must be collected upfront.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “ensure outstanding is cleared (system-validated ≤0), limit execution date to next bill cycle, collect 100 QR migration fee upfront”

### BR-287: Postpaid activation requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)
`Explicit` · confidence: `high`

- **Description:** Postpaid activation requires a Qatar ID (QID); prepaid activation accepts a passport, GCC ID, or QID, but a driving licence is not an accepted identification document for either.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “postpaid requires QID; prepaid accepts passport/GCC ID/QID (no driving licence)”

### BR-288: Max two postpaid mobiles per expat QID (business rule, though technically five allowed)
`Explicit` · confidence: `high`

- **Description:** Business rule caps an expat QID holder at a maximum of two postpaid mobile lines, even though the underlying system technically permits up to five.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “max two postpaid mobiles per expat QID by business rule though technically five allowed (00:46:11)”

### BR-289: Star number carries 1-year plan commitment vs 3-month for free number; up to 2-year lock-in for 20,000 QAR star number on VIP plan
`Explicit` · confidence: `high`

- **Description:** Selecting a star number carries a 1-year plan commitment, compared to a 3-month commitment for a free number; a premium 20,000 QAR star number on a VIP plan carries up to a 2-year lock-in.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “star number carries 1-year plan commitment vs 3-month for free number, up to 2-year lock-in for a 20,000 QAR star number on VIP plan”

### BR-292: Port-out requires zero overdue/outstanding and cleared device instalments
`Explicit` · confidence: `high`

- **Description:** A customer requesting to port their number out (MNP port-out) must have zero overdue balance/outstanding amount and any device instalment plan must be fully cleared.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “port-out requires zero overdue/outstanding and cleared device instalments”

### BR-311: iWatch/RIO suspended-primary-bundle block
`Explicit` · confidence: `high`

- **Description:** An iWatch/RIO order is blocked if the associated primary bundle/line is suspended.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “suspended-primary-bundle block”

### BR-314: Bulk SMS blacklist check
`Explicit` · confidence: `high`

- **Description:** A Bulk SMS order is subject to a blacklist eligibility check.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “blacklist check”

### BR-317: Deposit Service Bundle cannot be first service
`Explicit` · confidence: `high`

- **Description:** A Deposit Service Bundle cannot be established as the first/only service on an account.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “cannot be first service”

### BR-324: Instant Activation restricted to tablet channel
`Explicit` · confidence: `high`

- **Description:** Instant Activation is constrained to the tablet-only channel.
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “tablet-only channel constraint”

### BR-334: Suspension Eligibility Requires Cleared Unbilled Balance
`Explicit` · confidence: `medium`

- **Description:** Before a Mobile Service Suspension (J023) order can be submitted, any pending/current unbilled balance must be cleared.
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “"Pending Bill, Current unbilled must be cleared" stated as a condition on the J023 Mobile Service Suspension flow.”

## Routing Rules

### BR-011: Penalty Calculation Trigger Restriction
`Explicit` · confidence: `high`

- **Description:** Decision: the penalty calculation is triggered only from specific guided journeys (disconnection, MNP port-out, plan upgrade/downgrade, park number, put off) or via an on-demand button, rather than on every view, due to performance impact.
- **Original rule ID(s):** `raw:Penalty Calculation Trigger Restriction`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: trigger the calculation from specific guided journeys (disconnection, MNP port-out, plan upgrade/downgrade, park number, put off) or an on-demand button, not on every view, due to performance impact”

### BR-028: Fibre Precedence Over 5G Rule
`Explicit` · confidence: `high`

- **Description:** Fibre takes precedence over 5G as a business rule. This rule, along with other key rules for lead creation, approvals, and validation, is currently enforced manually via offline email processes rather than by the system — the first system entry occurs only when the request reaches fulfilment.
- **Original rule ID(s):** `raw:Fibre Precedence Over 5G Rule; raw:Manual Enforcement of Offline Approvals Rule`
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “the business rule that fibre takes precedence over 5G”
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “Recurring theme: lead creation, approvals and validation are all offline via email, with first system entry occurring only when the request reaches fulfilment; key business rules such as fibre precedence over 5G are enforced manually, not by the system”

### BR-029: 5G-to-Fiber Requires Disconnect/Reconnect Rule
`Explicit` · confidence: `high`

- **Description:** Migrating from 5G to fiber requires disconnection and reconnection because the assigned numbers differ, whereas migrating from FWA to fiber is seamless.
- **Original rule ID(s):** `raw:5G-to-Fiber Requires Disconnect/Reconnect Rule`
- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “5G-to-fiber requires disconnection and reconnection because the numbers differ, while FWA-to-fiber is seamless”

### BR-039: MNP Porting Window Rule
`Explicit` · confidence: `high`

- **Description:** The MNP porting window runs Sunday-Thursday, 11am-12pm — a shared one-hour window in which the donor disconnects and Vodafone connects; requests accepted before 10:45am make that day's window.
- **Original rule ID(s):** `raw:MNP Porting Window Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Porting window: Sunday–Thursday, 11am–12pm, a shared one-hour window in which the donor disconnects and Vodafone connects; requests accepted before 10:45am make that day's window”

### BR-043: FNP Dual Technician Visit Rule
`Explicit` · confidence: `high`

- **Description:** FNP porting operates at the service level (versus MNP's number level) and always requires two technician visits — one for installation per WFM, and one on the porting date for MSISDN configuration/testing.
- **Original rule ID(s):** `raw:FNP Dual Technician Visit Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP porting is at service level (vs. MNP's number level) and always needs two technician visits — one for installation per WFM, one on the porting date for MSISDN configuration/testing”

### BR-044: Post-Port-In Dunning Ladder Rule
`Explicit` · confidence: `high`

- **Description:** A final bill covers the last bill cycle up to the porting date and is payable within 30 days; a three-level degradation/dunning ladder then runs (outgoing bar on day 31, incoming bar on day 45, disconnection plus number return, followed by a 30-day quarantine).
- **Original rule ID(s):** `raw:Post-Port-In Dunning Ladder Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs (outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine)”

### BR-045: Dunning Initiator and De-automation Rule
`Explicit` · confidence: `high`

- **Description:** Degradation (dunning) is initiated by Ooredoo (the donor operator), and the process was de-automated to manual handling after complaints from customers with legitimate bill disputes.
- **Original rule ID(s):** `raw:Dunning Initiator and De-automation Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Degradation is initiated by Ooredoo (the donor) and was de-automated to manual after complaints from customers with legitimate bill disputes”

### BR-049: MNP/FNP Ticket Action Window (2hr auto-extend to 24hr)
`Explicit` · confidence: `high`

- **Description:** Siebel auto-creates a trouble ticket with a two-hour action window, extended to 24 hours once documents are validated, bound by NPass working hours.
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours”

### BR-051: Manual Suspension Requires SLA Action Before Escalation
`Explicit` · confidence: `high`

- **Description:** Agents need to act at least an hour before SLA expiry; suspension and CRM escalation are triggered when action is missed.
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “need to act at least an hour before SLA expiry; suspension and CRM escalation triggered when action is missed”

### BR-052: TON Null/Blank Number Price CDM Queue Trigger (legacy gap)
`Explicit` · confidence: `high`

- **Description:** A null/blank number price causes unnecessary CDM queue tickets; identified as a legacy data and design gap in the TON process.
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “a null/blank number price causing unnecessary CDM queue tickets (identified as a legacy data and design gap)”

### BR-060: Disconnection Retention-First Rule
`Explicit` · confidence: `high`

- **Description:** A ticket must be closed with a specific resolution code (e.g., 'retained' or not) before the disconnection order can be submitted on the Orders page.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “ticket closed with a specific resolution code (e.g., 'retained' or not) before the disconnection order can be submitted on the Orders page”

### BR-061: Star Number Port-Out Control (commitment-period block)
`Explicit` · confidence: `high`

- **Description:** Star number port-out control blocks porting during the (configurable) commitment period; built after customers took high-value star numbers and immediately ported out.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Star number port-out control blocks porting during the commitment period (configurable), built after customers took high-value star numbers and immediately ported out”

### BR-064: Ticket Assignment at Team/Queue Level Only (no auto-reassignment)
`Explicit` · confidence: `high`

- **Description:** Tickets are assigned at team/queue level, not agent level, and there is no automatic reassignment on delay.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “tickets assigned at team/queue level, not agent level, with no automatic reassignment on delay”

### BR-068: Unsubmitted Ticket Does Not Route to Queue
`Explicit` · confidence: `high`

- **Description:** A ticket that is created but not submitted does not route to any queue.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “a ticket created but not submitted does not route to any queue”

### BR-086: Splitter-Full Minimum SLA Extension (5 days)
`Explicit` · confidence: `high`

- **Description:** Splitter-full and BID-not-mapped conditions extend SLA (splitter full forces a minimum 5-day SLA) and are auto-created from UIM data.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “Splitter-full and BID-not-mapped conditions extend SLA (splitter full forces a minimum 5-day SLA) and are auto-created from UIM data”

### BR-092: FWA Outdoor Install Fallback to Indoor
`Explicit` · confidence: `high`

- **Description:** If outdoor install fails due to access/glass issues, indoor is offered as a fallback, or the order is cancelled.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “if outdoor install fails (access/glass issues), indoor is offered as fallback or the order is cancelled [00:45:47, 00:48:47]”

### BR-094: FWA-to-Fiber Automatic Migration Rule (stated but not implemented)
`Explicit` · confidence: `high`

- **Description:** Once a location becomes fiber-covered, the customer is stated to be 'moved' from 5G to fiber, but the actual process today is only a BI report — it is NOT automated.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “once a location becomes fiber-covered the customer "will be moved" from 5G to fiber — actual process is a BI report...NOT automated today [01:01:33, 01:03:11]”

### BR-151: Duplicate-fiber-at-address routing rule (home move lead)
`Explicit` · confidence: `high`

- **Description:** During fixed-line instant activation, the system checks whether the QID already has fiber service; if so, the order is routed/led as a home move rather than a new activation.
- **Original rule ID(s):** `6`
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “Checking if QID already having fiber, if yes lead for home move”

### BR-152: Device-type fulfilment routing rule (CPE/ONT vs 5G)
`Explicit` · confidence: `high`

- **Description:** Fulfilment routing depends on device type: if the device is CPE/ONT, the order is routed to Vodafone Field Force (FF) to fulfill; if the device is 5G, the lead is routed to Vodafone.
- **Original rule ID(s):** `7`
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “If CPE/ONT, then order to Vodafone FF to fulfill; If 5G lead to Vodafone”

### BR-153: Non Prepatched KID skips device-locate step
`Explicit` · confidence: `high`

- **Description:** In the fixed-line instant activation journey, the step to confirm the serial number for a previously installed Combo Box or CPE is skipped when the KID is Non Prepatched.
- **Original rule ID(s):** `8`
- **Sources:**
  - [`guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf`](../.knowledge/docs/guided-journeys-fixed-line-digital-fixed-line-instant-activa-1a336edf.md): “confirm serial number for previously installed Combo Box or CPE; step "skipped for Non Prepatched KID"”

### BR-170: B2B2C With Approval Requires Manager Sign-off Before Provisioning
`Explicit` · confidence: `high`

- **Description:** For the B2B2C "With Approval" order variant, the order status (Pending/Submitted for Approval) is routed to a manager queue and requires manager sign-off before it can provision.
- **Original rule ID(s):** `27`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Order status "Pending"/"Submitted for Approval" routed to manager queue; "because this variant is 'With Approval', routed for manager sign-off before it can provision"”

### BR-172: Order Rejection Reasons Trigger SMS Notification to Agent
`Explicit` · confidence: `high`

- **Description:** When an order is rejected, an SMS notification is sent to the agent via OSB CreateCommunication, informing them of the rejected order (with MSISDN and order number) and directing them to Sales Order > My Rejected Orders to correct it.
- **Original rule ID(s):** `30`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “OSB CreateCommunication SMS payload: "New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

### BR-208: Order Routed to Manager Approval on Submission
`Explicit` · confidence: `high`

- **Description:** On submission, the activation request order is routed for manager approval; the agent can check status via My Sales Order or My Orders for approval.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Your activation request order number: 1-29727615763 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."”

### BR-213: Manager Approval Has Three Decision Paths: Approve, Reject-Correction, Reject-Drop Order
`Explicit` · confidence: `high`

- **Description:** During manager approval review, the approver has three decision paths available via top-right action buttons: Approve, Reject - Correction, Reject - Drop Order (plus a Go Back option).
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Top-right action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back”

### BR-215: Approval Gates Provisioning/Activation
`Inferred` · confidence: `high`

- **Description:** Manager approval gates backend provisioning/activation: only after approval does the order reach Status Complete / Fulfillment Status Complete, with FWA service line items appearing as Active installed assets on the account.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “After approval, the backend order reaches Status Complete / Fulfillment Status Complete, and the FWA service line items appear as Active installed assets on the account — i.e., approval gates provisioning/activation”

### BR-223: Cross-Sales Offer Acceptance Launches Full MNP Postpaid Guided Journey
`Explicit` · confidence: `high`

- **Description:** Accepting a cross-sales 'New MNP' offer row launches the full MNP Postpaid guided journey starting at Step 1 (Contact).
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “the agent has clicked Accept against the "New MNP" offer row to begin conversion... MNP Postpaid guided journey launches — Step 1. Contact”

### BR-231: Post-Port SMS Instruction: Customer Must Text 'Switch' to 151 (Cost 1 QR)
`Explicit` · confidence: `high`

- **Description:** As part of the MNP port process, the agent must advise the customer to send an SMS with the text 'switch' to short code 151, which costs 1 QR (Dhs).
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “'Advise customer to send switch to 151. SMS costs 1Dhs'”

### BR-247: Cross Sales offer disposition actions (Accept/Interested/Reject/Close)
`Explicit` · confidence: `high`

- **Description:** System-generated Cross Sales Offers are presented in a grid where the agent must disposition each offer using one of four actions: Accept, Interested, Reject, or Close.
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “"Cross Sales Offers" grid with Accept / Interested / Reject / Close action buttons and two system-generated offers”

### BR-257: B2B2C order requires manager approval before fulfillment
`Explicit` · confidence: `high`

- **Description:** B2B2C activation orders are submitted for manager approval rather than fulfilling automatically; the order's status can be tracked via My Sales Order / My Orders pending approval sign-off.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"Your activation request order number: 1-29710853118 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."”

### BR-264: B2B2C without pre-existing Special Management completes without approval
`Explicit` · confidence: `high`

- **Description:** When a B2B2C order is placed on an account that has no pre-existing Special Management flag, the order reaches Complete status (both order and fulfillment) automatically, with the Approved checkbox left unchecked and no hold applied — it is never routed to anyone for sign-off.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “order reaches Status=Complete / Fulfillment Status=Complete with the Approved flag left unchecked and no Hold — it was never routed to anyone for sign-off”

### BR-265: Special Management account flag triggers B2B2C override prompt
`Explicit` · confidence: `high`

- **Description:** When an account already carries a Special Management field value, the system prompts the agent with an explicit confirmation asking whether to continue the journey without applying B2B2C.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “"The Account has already Special Management field value. Do you still want to continue the journey without B2B2C"”

### BR-266: Orders on accounts with Special Management/multiple postpaid lines route to Pending approval
`Inferred` · confidence: `medium`

- **Description:** Orders placed on accounts already carrying a Special Management flag or multiple existing postpaid lines are routed to a Pending status with the Approved checkbox unchecked and Approved By left blank, consistent with the credit-control warning raised for such accounts.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “order 1-29712772155 with Status = Pending and an unchecked Approved checkbox / blank Approved By field, consistent with the credit-control warning raised earlier”

### BR-268: HRN/Credit-Limit variant routes order to manager approval rather than auto-completion
`Explicit` · confidence: `high`

- **Description:** For the HRN Customer / Credit Limit variant of the postpaid journey, the resulting activation order is submitted for manager approval rather than completing automatically — the defining characteristic distinguishing this variant from the standard flow.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “"Your activation request order number: 1-29811647643 is submitted for approval..." — the defining characteristic of the HRN Customer/Credit Limit variant”

### BR-272: Autobase migration offer sourced from Unica campaign engine, agent Accept/Interested/Reject only
`Explicit` · confidence: `high`

- **Description:** Pre2Post migration offers are system pre-populated from the Unica campaign engine (identified by a Campaign Code) into a Migration Offers grid; the agent may only disposition each offer via Accept, Interested, or Reject.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Migration Offers grid (system pre-populated, 1 of 1) already lists: OfferName Postpaid U Start Promotion ... Status Offered, CampaignCode C000006358 ... Buttons: Accept / Interested / Reject”

### BR-273: Migration order fulfilled asynchronously via backend bulk job queue
`Explicit` · confidence: `high`

- **Description:** Once a Pre2Post migration order is auto-created, it progresses asynchronously to Complete status via a backend Bulk Processing job queue (job type 'PreToPost'), rather than completing synchronously in the UI.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “the order ... is auto-created and then progresses asynchronously through the backend Bulk Processing job queue (job type "PreToPost") to Complete”

### BR-284: Automatic 3x retry for FDO failures caused by open orders
`Explicit` · confidence: `high`

- **Description:** FDO requests that fail due to open orders are automatically retried up to 3 times; failures that remain unresolved after retries are consolidated into a daily operations report.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “automatic 3x retry for requests failed due to open orders; unresolved failures are consolidated into a daily operations report”

### BR-286: SIM Swap rejection drops (cancels) the order
`Explicit` · confidence: `high`

- **Description:** When a SIM Swap task is rejected, a pop-up requires a Rejection Reason and comments, then upon clicking Drop Order the order is dropped and marked as cancelled.
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “On Reject Task, pop-up opens for Rejection Reason -> Add comments, click Drop Order; order is dropped as cancelled”

### BR-293: Port-in executes next working day in a defined window
`Explicit` · confidence: `high`

- **Description:** MNP port-in requests execute on the next working day within a defined execution window, typically between 11am and 12pm.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “port-in happens next working day in a defined window (typically 11am-12pm)”

### BR-327: Number type branching: Normal vs Star Number
`Explicit` · confidence: `medium`

- **Description:** When adding a SIM/MSISDN in the onboarding flow (J011 and related order-capture processes), the process branches based on whether the selected number is a Normal number or a Star Number.
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “number type branch (Normal vs Star Number)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “number type branch (Normal vs Star Number)”

### BR-328: Add-on branching: Non-Telco vs Telco
`Explicit` · confidence: `medium`

- **Description:** Add-ons selected during checkout/cart (J011 and related order-capture processes) branch by category into Non-Telco Add-On and Telco Add-On paths.
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “add-on branch (Non-Telco vs Telco)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “add-on branch (Non-Telco vs Telco Add-On)”

### BR-329: Payment branching: Full Payment vs Device on Installment (DOI)
`Explicit` · confidence: `medium`

- **Description:** At checkout (J011 and related order-capture processes), payment is branched between Full Payment and Device on Installment (DOI).
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “payment branch (Full Payment vs DOI — Device on Installment)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment branch (Full Payment vs DOI)”

### BR-330: ID type branching: QID vs Other ID/Passport
`Explicit` · confidence: `high`

- **Description:** In the J011 Mobile Post-Paid Customer onboarding journey (and related order-capture processes), the customer's ID type determines the validation path: QID routes to MOI Validation, while Other ID/Passport routes to manual capture of customer details and address validation.
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “ID type branching (QID → MOI Validation; Other ID / Passport → capture customer details, validate address)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID type branching (QID → MOI Validation; Other ID/Passport → capture/validate details) ... plan display logic tied to ID type”

### BR-333: J023 Modify Order Initiation and Submission (Suspension)
`Explicit` · confidence: `low`

- **Description:** For J023 Mobile Service Suspension, the modify order is initiated by the Agent in DXP, who either suspends the service or changes the plan to a park plan, and the Agent submits the order in DXP to apply the change. The J024 Mobile Service Resume slide states identical rule text (flagged in the source as a likely copy-paste/drafting artifact rather than a rule specific to resume).
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “1) The modify order is initiated by the Agent in DXP. 2) The agent either suspends the service or changes the SIM to a park plan. 3) The order is submitted by the Agent in DXP to apply the change.”
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “1) The modify order is initiated by the Agent in DXP. 2) The agent either suspends the service or changes the SIM to a park plan. 3) The order is submitted by the Agent in DXP to apply the change. (identical wording to J023 slide)”

### BR-338: Ticket/Order Approval Required for Suspension and Resume
`Explicit` · confidence: `medium`

- **Description:** Both Mobile Service Suspension (J023) and Mobile Service Resume (J024) require ticket creation and an approval step before/alongside order submission (stated identically on both flows).
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “ticket creation and approval needed (stated identically on both J023 and J024 flows)”

### BR-340: Prepaid Channel Migration: ECR to VSA
`Explicit` · confidence: `high`

- **Description:** Stores and Direct Sales channels are migrating prepaid (Paired SIM) sales from the ECR system to VSA, as ECR is being phased out for prepaid selling.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “"ECR for selling prepaid is being phased out and VSA moving forward will be used by Stores and direct sales to sell prepaid (Paired SIMs)."”

### BR-346: Ticket Auto-Assignment to Queue
`Explicit` · confidence: `medium`

- **Description:** Tickets are automatically assigned to a queue based on criteria not further specified in the extracted text, as part of the current-state process.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Slide 21: Ticket Auto Assigning to Queue.”

## Derivation Rules

### BR-009: BRM 6-Plus-1 Event Purge Policy
`Explicit` · confidence: `high`

- **Description:** BRM's "6 plus 1" event purge policy causes the adjustment reason to be lost after 6 months — the underlying item data remains but the reason text is purged.
- **Original rule ID(s):** `raw:BRM 6-Plus-1 Event Purge Policy`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Adjustment reason is lost after 6 months due to BRM's "6 plus 1" event purge policy — item data remains but the reason is purged”

### BR-019: Segmentation Manual Decision Rule
`Explicit` · confidence: `high`

- **Description:** Customer segmentation (SOHO, SME, Large Enterprise, Government) is a manual business decision with no automated system rule: SOHO is under 10 connections (implied), SME is 10-200, Large Enterprise is above 100.
- **Original rule ID(s):** `raw:Segmentation Manual Decision Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Segmentation (SOHO, SME, Large Enterprise, Government) is a manual business decision with no system rule: SOHO under 10 (connections, implied), SME 10–200, Large above 100”

### BR-020: Parent Account Single Documentation Role Rule
`Explicit` · confidence: `high`

- **Description:** In the parent/sub-account model, the parent is a documentation-only placeholder carrying the CR number; all activation, billing, and modification happens at the sub-account level. Only two levels exist (parent and sub-account), and there is only one unique parent per customer.
- **Original rule ID(s):** `raw:Parent Account Single Documentation Role Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Parent/sub-account model: parent is a documentation-only placeholder carrying the CR number; all activation, billing and modification happens at sub-account level; only two levels exist; one unique parent per customer”

### BR-024: Default Postpaid Billing Cycle Rule
`Explicit` · confidence: `high`

- **Description:** Billing profiles default to postpaid with automatic 1st/15th bill cycles; prepaid is handled via a separate billing profile line item.
- **Original rule ID(s):** `raw:Default Postpaid Billing Cycle Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Billing profiles default to postpaid with automatic 1st/15th bill cycles; prepaid handled via a separate billing profile line item”

### BR-031: Fixed Agent ID Is a View, Not a True Agent ID
`Explicit` · confidence: `high`

- **Description:** The fixed agent ID should be treated as a view mapping what the account manager handles, rather than functioning as a true agent identifier.
- **Original rule ID(s):** `raw:Fixed Agent ID Is a View, Not a True Agent ID`
- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “the fixed agent ID should be a view mapping what the account manager handles rather than a true agent ID”

### BR-036: MNP Donor Operator Fixed Rule (QTEL/Ooredoo)
`Explicit` · confidence: `high`

- **Description:** In mobile number portability (MNP), the donor operator is always QTEL/Ooredoo; porting details captured include customer ID number/type, customer type, donor operator, subscription type, and scheduled porting date.
- **Original rule ID(s):** `raw:MNP Donor Operator Fixed Rule (QTEL/Ooredoo)`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date)”

### BR-046: MNP Reserved Temporary MSISDN Rule
`Explicit` · confidence: `high`

- **Description:** MNP uses a reserved zero-value temporary MSISDN during the porting process, along with required attachments: MNP form 2-A-D and donor-registered ID, DNO verification type, file size under 2 MB, in PDF or JPG format.
- **Original rule ID(s):** `raw:MNP Reserved Temporary MSISDN Rule`
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “a reserved zero-value temporary MSISDN, and attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG)”

### BR-054: Bill Medium Default (Detailed for Consumer, Summary PDF for Enterprise)
`Explicit` · confidence: `high`

- **Description:** Bill medium defaults to a detailed bill for consumer customers and a summary PDF for enterprise customers, with the customer having the option to select summary only.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill medium defaults — detailed bill for consumer, summary PDF for enterprise, with customer option for summary only”

### BR-072: Migration Balance Transfer Rule (monetary transfers, non-monetary lost)
`Explicit` · confidence: `high`

- **Description:** On migration, remaining prepaid balance posts as an overpayment in BRM; monetary balance transfers as advance/credit, but non-monetary voice/data buckets are lost.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Remaining prepaid balance posts as an overpayment in BRM; monetary balance transfers as advance/credit, but non-monetary voice/data buckets are lost”

### BR-074: Number Category Rule (Free/Paid, paid can become free by plan)
`Explicit` · confidence: `high`

- **Description:** Number management recognizes two categories only: free and paid; a paid number can become free depending on the plan.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Number management: two categories only — free and paid (paid can become free depending on plan)”

### BR-083: Number Auto-Selection Rule (fixed/prepaid zero-rated only, not mobile postpaid)
`Explicit` · confidence: `high`

- **Description:** Numbers are auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks; this is NOT applied to mobile postpaid since those numbers carry a price.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks... NOT applied to mobile postpaid since those numbers carry a price”

### BR-084: Fixed Plan Default Triple-Play with Optional IPTV
`Explicit` · confidence: `high`

- **Description:** Fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM; IPTV basic is free, only premium is charged.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM; IPTV basic is free, only premium is charged”

### BR-090: Devices Sold Are Not Recovered on Disconnection
`Explicit` · confidence: `high`

- **Description:** Devices once sold are not returned or recovered on disconnection — the CPE serial simply becomes free in UIM for reassignment.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “devices once sold are not returned/recovered on disconnection — the CPE serial simply becomes free in UIM for reassignment [00:03:00]”

### BR-100: Address change creates new record with history, no in-place update
`Explicit` · confidence: `high`

- **Description:** When a customer's address changes, the old address record is marked discontinued/replaced with effective from/to dates and a new address record is created as primary, rather than updating the existing address record in place — preserving address history.
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “old address marked discontinued/replaced with effective from/to dates, new address created as primary, rather than updating the address record in place [00:13:46, 00:14:34, 00:16:12]”

### BR-116: Digital eSIM requires dummy/virtual SKU with no inventory depletion
`Explicit` · confidence: `high`

- **Description:** Digital eSIM issuance requires virtual/dummy SKUs with no inventory tracking, since the WinCash system otherwise expects physical inventory depletion for any SIM issuance.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “requirement to create virtual/dummy SKUs with no inventory for digital eSIM since WinCash otherwise expects inventory depletion for any SIM issuance [01:33:20, 01:36:44, 01:41:07]”

### BR-127: Unclaimed deposit transferred to charity after 12 months
`Explicit` · confidence: `high`

- **Description:** Customer deposits are refundable upon account closure, but if unclaimed for 12 months, the deposit is transferred to charity.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “deposit refund and unclaimed-deposit-to-charity (after 12 months) provisions”

### BR-129: No refund of remaining prepaid balance on cancellation
`Explicit` · confidence: `high`

- **Description:** Remaining prepaid balance is not refunded upon plan cancellation.
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “no refund of remaining Prepaid balance on plan cancellation”

### BR-142: Bill calculator SMS is a capability, not a journey
`Explicit` · confidence: `high`

- **Description:** The Bill calculator SMS feature is classified as a capability rather than a full user journey.
- **Sources:**
  - [`crm-journeys-final-updated-a23640a5`](../.knowledge/docs/crm-journeys-final-updated-a23640a5.md): “"Bill calculator SMS is not a journey but a capability"”

### BR-143: Type Taxonomy classification rule (User Journey/Workflow-Task/View/Action/Access-Permission)
`Explicit` · confidence: `high`

- **Description:** CRM feature rows are classified into a five-category type taxonomy: User Journey (guided, multi-step workflows for customer-facing service activations), Workflow/Task (operational multi-step administrative operations), View (read-only data displays), Action (quick single/minimal-step transactional operations), and Access/Permission (role/responsibility-based access controls).
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “User Journey: Guided, multi-step workflows for customer-facing service activations... Workflow/Task: Operational multi-step administrative operations... View: Read-only data displays... Action: Quick single/minimal-step transactional operations... Access/Permission: Role/responsibility-based access controls”

### BR-144: 86.7% of CRM feature rows lack a confident User Journey parent
`Explicit` · confidence: `high`

- **Description:** Analysis finding: 143 of 165 CRM feature records (86.7%) have no confident User Journey parent; 9 of 15 functional clusters are BAU/account-servicing capabilities with no anchor journey.
- **Sources:**
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “Headline finding: 143 of 165 records (86.7%) have no confident User Journey parent — 9 of 15 functional clusters are BAU/account-servicing capability with no anchor journey”

### BR-159: Empty add-on/discount selector rule
`Explicit` · confidence: `high`

- **Description:** If there is no applicable add-on or discount available for the order, the add-on/discount selector control simply displays empty rather than showing an error.
- **Original rule ID(s):** `14`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Info note: "Note: if there are no applicable add-on or discount, the selector will be empty."”

### BR-163: Prepatched Non Combo Box topology skips shared-infrastructure step
`Inferred` · confidence: `medium`

- **Description:** When the KID is Prepatched (per backend SOAP trace: PatchingType=Prepatched, KIDStatus=Available), no separate Combo Box selection or shared-infrastructure step appears in the journey — it goes directly from Address confirmation to Plan selection.
- **Original rule ID(s):** `18`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Because the KID is Prepatched (per the backend SOAP trace: PatchingType=Prepatched, KIDStatus=Available), no separate "Combo Box" selection or shared-infrastructure step... appears anywhere in this flow — the journey goes straight from Address confirmation to Plan selection”

### BR-166: Instant Activation Bypasses Appointment Booking
`Inferred` · confidence: `high`

- **Description:** When Instant Activation is selected, Book Appointment is auto-saved with no manual appointment booking step shown anywhere in the walkthrough, consistent with Instant Activation bypassing a technician visit; the order went from Open to Complete in approximately 4 minutes.
- **Original rule ID(s):** `23`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Book Appointment is auto-saved with no manual appointment booking shown anywhere in this walkthrough... consistent with Instant Activation bypassing a technician visit"; order went Open to Complete in ~4 minutes”

### BR-184: Order Status Progression: Pending -> Open -> Complete
`Explicit` · confidence: `high`

- **Description:** Orders progress through status transitions Open → In Progress → Complete, with Status Context "All order lines are completed" and Fulfillment Status: Complete at the end of the flow.
- **Original rule ID(s):** `44`
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"order transitions Status: Open → In Progress ... → Complete, with Status Context 'All order lines are completed' and Fulfillment Status: Complete"”

### BR-186: Attribute Change Tracked as Discrete Update Action with Old/New Value Retained
`Explicit` · confidence: `high`

- **Description:** When an attribute such as Indoor Unit Serial Number is changed, the system tracks it as a discrete Update action, where the Value column holds the new value and the Description column preserves the prior/original value.
- **Original rule ID(s):** `46`
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Indoor Unit Se[rial Number]: Value S180P18055020, Action 'Update', Description S180P18055021 (i.e., Description column preserves the prior/original value while Value holds the new one)"”

### BR-189: CAF Digital Signature Timestamped With Signing Agent Identity
`Explicit` · confidence: `high`

- **Description:** The Customer Application Form (CAF) digital signature is recorded with the signing agent's login/user ID and a timestamp, e.g. printed line "VINODHINIR 02/03/2026 14:33:27".
- **Original rule ID(s):** `50`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “printed line "VINODHINIR 02/03/2026 14:33:27" — the signing agent's login/user ID and a timestamp”

### BR-209: Employer/Special Management Fields Populate Only After Order Approval/Completion
`Inferred` · confidence: `high`

- **Description:** The Employer field (and related special management fields) on the Contact record remain blank while the order is Pending and only populate after the order is approved/completed — indicating no provisioning occurs until approval.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Employer field on the Contact record also blank — i.e., nothing provisions until the order is approved... Employer field now populated "01 vfqatest01" (previously blank while Pending)”

### BR-217: Order Can Reach Complete Without Approved Checkbox Being Set
`Explicit` · confidence: `high`

- **Description:** In the 'without approval' journey variant, the final order record can reach Status: Complete / Fulfillment Status: Complete even though the Approved checkbox remains unchecked and Approved By is blank — confirming that approval is not universally required to complete an order.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “the final order record shows the Approved checkbox unchecked and Approved By blank, yet the order still reaches Status: Complete / Fulfillment Status: Complete”

### BR-230: Donor Operator Field Is Read-Only/Derived, Not Agent-Editable
`Inferred` · confidence: `high`

- **Description:** The Donor Operator field (identifying the losing operator in an MNP port, e.g. Qtel/Ooredoo) is system-derived and read-only, not directly editable by the agent.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Donor Operator = Qtel (read-only, i.e., Ooredoo/Qtel is the losing operator)”

### BR-237: Rejected leads are never converted to an order
`Inferred` · confidence: `high`

- **Description:** Once a lead is rejected, its Order Id and Date Converted fields remain permanently blank, reflecting that rejected leads are never converted into an order.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Order Id and Date Converted remain blank (rejected leads are never converted to an order)”

### BR-239: Setting CallBack Date/Time auto-transitions Lead Status New -> In Progress, Sub Status -> Call Back
`Explicit` · confidence: `high`

- **Description:** Entering a value into the CallBack Date/Time field on a lead automatically transitions the Lead Status from 'New' to 'In Progress' and sets the Lead Sub Status to 'Call Back', without any separate manual status update.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “After entering 12/4/2025 12:00 into CallBack Date/Time, the record auto-updates: Lead Status changes from 'New' to 'In Progress', and Lead Sub Status becomes 'Call Back.'”

### BR-244: Lead created via mobile number attaches to existing matching Contact rather than creating a duplicate
`Inferred` · confidence: `high`

- **Description:** When a new lead is created using a mobile number that matches an existing Contact record, the system attaches the new lead to that existing contact instead of creating a duplicate contact — expected Siebel/CRM matching behavior.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “the newly created lead attaches to this contact ... expected Siebel/CRM behavior (the system matches/attaches the lead to the existing contact record for that mobile number rather than creating a new contact)”

### BR-245: QID Number entry triggers MOI Validation to auto-fetch customer details (Passport-to-QID)
`Explicit` · confidence: `high`

- **Description:** In the Passport-to-QID journey, clicking 'Update ID' after entering the QID number triggers MOI Validation, which automatically fetches and populates all customer details based on the validated QID.
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Once 'Update ID' is clicked, all customer details are fetched based on MOI Validation”

### BR-253: Account pre-approved credit limit defaults from Expatriate/Qatari classification
`Explicit` · confidence: `high`

- **Description:** An account's default/pre-approved credit limit is derived from a CR Type classification of 'Pre-approved (Expatriate/Qatari)', which carries a pre-set numeric value (e.g. 800) established before the sales journey begins.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “CR Type field set to "Pre-approved (Expatriate/Qatari)" with a value of 800 next to it — the account's default/pre-approved credit limit before the journey begins”

### BR-255: Credit Limit override persists back to account record
`Explicit` · confidence: `high`

- **Description:** When an agent overrides the Credit Limit during a sales/migration journey, the change persists back to the account's pre-approved credit limit field, which reflects the new value after the journey completes.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Account now shows the "Pre-approved (Expatriate/Qatari)" field value updated from 800 to 1,000, confirming the credit-limit override made during the journey persisted back to the account record”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Pre-approved (Expatriate/Qatari): field now shows 50 (highlighted, matching the value chosen in the wizard), confirming the account-level pre-approved limit was updated”

### BR-256: B2B2C Company Name linkage during Contact step
`Explicit` · confidence: `high`

- **Description:** Selecting a Company Name from a dropdown during the Contact step of a B2B2C order links the consumer contact to a sponsoring corporate account; this linkage is later surfaced as the contact's Employer field and sets the account's Special Management field to 'B2B2C Consum...'.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Company Name dropdown selector during Contact step links the consumer contact to a sponsoring corporate account, later surfaced as the contact's Employer field and account Special Management = "B2B2C Consum..."”

### BR-270: Pre2Post conversion order created before asset removal
`Inferred` · confidence: `high`

- **Description:** When converting a prepaid line to postpaid, the new order is created while the old prepaid asset (e.g. Prepaid Red Promotion) is still present on the account, indicating the conversion completes via asynchronous order fulfillment rather than an instant swap.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “A residual popup still shows the old Prepaid Red Promotion asset ... confirming the prepaid asset is still present at the point the new order is created (conversion completes via order fulfillment, not an instant swap)”

### BR-282: All scheduled FDOs cancelled after a plan change executes
`Explicit` · confidence: `high`

- **Description:** Once a plan change executes, all other scheduled Future Dated Orders for that line/account are automatically cancelled.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “all scheduled FDOs are cancelled after a plan change executes”

### BR-294: IPTV only via OSN/fixed and always defaulted on (triple play)
`Explicit` · confidence: `high`

- **Description:** IPTV/TV service is only offered via OSN on fixed lines and is always defaulted to 'on' as part of the triple-play bundle.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “IPTV/TV (defaulted to yes, triple play) ... IPTV only via OSN/fixed and always defaulted on”

### BR-295: Fiber instant vs non-instant activation determined by back-end box type, not customer choice
`Explicit` · confidence: `high`

- **Description:** Whether a Fiber activation is instant or non-instant is determined by a back-end check of the box type at the premises, not by customer selection.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Fiber instant vs non-instant activation is a back-end box-type check, not customer choice (02:04:47)”

### BR-336: Park Plan Minimum Services Sourced from Launch X
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** "Launch X" appears nowhere else in the 83-document corpus and is otherwise unexplained; the source document itself was independently re-scored 50/100 (Medium-Low) in a separate Phase 1.5 pass. Treat "Launch X" as an unverified system name pending stakeholder confirmation — do not assume it names a real, specific integration point without checking with Vodafone Qatar. See `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

- **Description:** When suspending service, the Park Plan's minimum services set is fetched from a system/module referred to as "Launch X" [unverified — see caveat above].
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X")”

### BR-337: Base Plan Sourced from Launch X on Resume
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** same issue as BR-336 above — "Launch X" is unverified, source document re-scored 50/100 (Medium-Low).

- **Description:** When resuming service, the Base Plan to revert to is fetched from the "Launch X" system/module [unverified — see caveat above].
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current Park Plan back to Base Plan (fetched from "Launch X")”

### BR-341: Disconnection Ticket Closure Auto-Creates Disconnection Order
`Explicit` · confidence: `high`

- **Description:** When a disconnection-related ticket is closed by the Retention Team, the system automatically generates a disconnection order.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “"Once the Ticket is Closed by Retention Team, It automatically creates a disconnection order."”

### BR-342: MNP Port Out Ticket Auto-Created from NPAS
`Explicit` · confidence: `high`

- **Description:** MNP Port Out tickets are automatically created from the NPAS system rather than manually raised by an agent.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “MNP Port Out Ticket — states the ticket is "Auto-Created from NPAS"”

## Calculation Rules

### BR-001: Fibre 12-Month Lock-in Disconnection Fee
`Explicit` · confidence: `high`

- **Description:** If the customer disconnects before completing the 12-month Fibre Lock-in, they must pay the remainder of the 3-month minimum service period plus a Fibre Lock-in charge of QR 80 x remaining months (of the 12). If the customer leaves after the 12-month lock-in has completed, no disconnection fee applies.
- **Original rule ID(s):** `raw:Fibre 12-Month Lock-in Disconnection Fee; raw:No Disconnection Fee After Lock-in Completion`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Disconnection Fees if leaving before the 12-month Fibre Lock-in ends: remainder of the 3-month minimum service period, Fibre Lock-in charge of QR 80 x remaining months (of 12)...”
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “No disconnection fee if leaving after the 12-month lock-in completes”

### BR-002: OSNtv Termination Penalty Calculation
`Explicit` · confidence: `high`

- **Description:** OSNtv termination penalty is calculated as the remainder of 12 months x QR 30 (OSN Lite) or QR 60 (OSN Premium). Both the Plan disconnection penalty and the OSNtv penalty apply together (are additive) when both are in effect.
- **Original rule ID(s):** `raw:OSNtv Termination Penalty Calculation`
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “OSNtv termination penalty = remainder of 12 months x QR 30 (OSN Lite) or QR 60 (OSN Premium); both Plan and OSNtv penalties apply together”

### BR-015: Volumetric Discount Proration Rule
`Explicit` · confidence: `high`

- **Description:** Volumetric commitments/discounts: the current full-cycle discount cancellation setting causes overlapping discounts on mid-cycle changes, requiring proration. Proration behaviour must differ for plan change vs. cancellation, and for enterprise vs. consumer segments.
- **Original rule ID(s):** `raw:Volumetric Discount Proration Rule`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Volumetric commitments/discounts: full-cycle discount cancellation setting causes overlapping discounts on mid-cycle changes, needs proration; behaviour must differ for plan change vs. cancellation, and for enterprise vs. consumer”

### BR-033: Discount Presentation as Two Line Items Rule
`Explicit` · confidence: `high`

- **Description:** Correct discount presentation requires discounts to appear as two line items (prorated and month-in-advance), shown against the charge to which they apply.
- **Original rule ID(s):** `raw:Discount Presentation as Two Line Items Rule`
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “correct discount presentation so discounts appear as two line items (prorated and month-in-advance) shown against the charge they apply to”

### BR-035: Enterprise Quarterly/Half-Yearly/Yearly Billing Ask
`Explicit` · confidence: `high`

- **Description:** Enterprise customers have asked that products be made chargeable on quarterly, half-yearly, and yearly cycles, rather than the current monthly-only billing.
- **Original rule ID(s):** `raw:Enterprise Quarterly/Half-Yearly/Yearly Billing Ask`
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “enterprise asked that products be chargeable quarterly, half-yearly and yearly rather than the current monthly-only billing”

### BR-056: SIM Swap Charging Rule (eSIM/physical/lost/damaged)
`Explicit` · confidence: `high`

- **Description:** eSIM to eSIM swap is free; eSIM to physical is charged; lost SIM replacement is chargeable; damaged SIM replacement is not charged.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged”

### BR-059: Park My Number Plan Definition (35 Rial / 4 months / zero credit limit)
`Explicit` · confidence: `high`

- **Description:** The 'park my number' service is delivered via a 35 Rial, four-month upfront-paid plan with the credit limit set to zero.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “delivered via a 35 Rial, four-month upfront-paid 'park my number' plan with credit limit set to zero”

### BR-070: Postpaid-to-Prepaid Migration Fee (100 Riyal)
`Explicit` · confidence: `high`

- **Description:** A 100 Riyal migration fee is applied on the final bill when migrating from postpaid to prepaid.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “100 Riyal migration fee applied on the final bill”

### BR-073: Multi-SIM Pricing Rule (plan-based, e.g., Platino: first free, second 25 Riyal)
`Explicit` · confidence: `high`

- **Description:** Pricing for additional SIMs is set automatically by the system based on plan (e.g., Platino plan: first additional SIM free, second 25 Riyal).
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “pricing set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal)”

### BR-076: Credit Limit Default by Nationality (1000 expat / 50 HRN)
`Explicit` · confidence: `high`

- **Description:** Default credit limit is 1,000 for an expat on a new account, dropped to 50 for HRN (high-risk nationality) customers, agent-selected or system-enforced depending on nationality configuration.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “default 1,000 for expat on new account, dropped to 50 for HRN customers (agent-selected or system-enforced depending on nationality config)”

### BR-093: Mesh/LAN Pricing Rule
`Explicit` · confidence: `high`

- **Description:** Premium plans get 2 free mesh units, with additional mesh charged as ongoing rental (not one-time); LAN cable extension charged 10 riyal/meter as a one-off add-on; on 5G only premium gets mesh, others must pay for LAN if needed.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “premium plans get 2 free mesh, additional mesh charged as rental (not one-time); LAN cable extension charged 10 riyal/meter as one-off add-on; on 5G only premium gets mesh, others must pay for LAN if needed [00:56:12, 00:58:11, 01:31:46, 01:32:28]”

### BR-112: HRN upfront advance calculation
`Explicit` · confidence: `high`

- **Description:** HRN (High Risk Nationality) customers pay an upfront advance whose amount is driven by nationality and sales channel; explicitly confirmed to NOT be driven by plan value.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “HRN customers pay an upfront advance...amount is driven by nationality and channel — explicitly confirmed NOT plan-value-driven [00:46:44, 00:52:06, 00:53:01]”

### BR-115: Star number entitlement by plan value
`Explicit` · confidence: `high`

- **Description:** Plan value determines the star-number value entitlement (e.g., a 200 Riyal plan entitles ~5,000 Riyal worth of star number). If the customer selects a number exceeding their entitlement, they pay the delta at point of sale.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “plan value determines star-number value entitlement (e.g., a 200 Riyal plan entitles ~5,000 Riyal worth of star number); if the customer selects a number exceeding entitlement, they pay the delta at point of sale [01:20:26, 01:23:19]”

### BR-121: First month proration plus full following month charge
`Explicit` · confidence: `high`

- **Description:** For postpaid subscriptions, the first month's charges are prorated, plus a full charge is applied for the following month.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “a proration disclosure ("first month's charges will be prorated, plus full charge for the following month")”

### BR-122: Credit card recovery after 90 days unpaid
`Explicit` · confidence: `high`

- **Description:** A credit-card authorization consent clause allows Vodafone to charge the customer's card periodically and to recover amounts that remain unpaid 90 or more days after bill issue.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “a credit-card authorization consent clause allowing Vodafone to charge the card periodically and to recover amounts unpaid 90+ days after bill issue”

### BR-126: Roaming charging delay up to 31 days
`Explicit` · confidence: `high`

- **Description:** Roaming charges may be applied either in real-time or with a delay of up to 31 days, depending on the roaming partner network.
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Roaming charging behavior (real-time vs. delayed, up to 31-day delay)”

### BR-145: GigaHome Fair Usage Policy throttle rule
`Explicit` · confidence: `high`

- **Description:** GigaHome 5G Home plans carry a Fair Usage Policy with monthly data allowances of 1 TB / 2 TB / 10 TB depending on plan tier; once fully consumed, speed is throttled to up to 1 Mbps until the next billing cycle.
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Fair Usage Policy (FUP): 1 TB / 2 TB / 10 TB per month; after full usage, speed throttles to up to 1 Mbps until next billing cycle.”

### BR-146: GigaHome lock-in and early-termination fee calculation
`Explicit` · confidence: `high`

- **Description:** GigaHome 5G Home plan lock-in periods: 3 months for the Plan itself, 12 months for installation cost/devices. If the customer terminates before completing the 12-month device lock-in, a 500 QAR early termination fee applies; alternatively, the customer may return the 5G CPE or pay an 800 QAR CPE charge if the device is not returned.
- **Original rule ID(s):** `1`
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Lock-in periods: 3 months for the Plan, 12 months for installation cost/devices... unfinished 12-month device lock-in → 500 QAR early termination fee; alternatively return the 5G CPE or pay 800 QAR CPE charge if not returned.”

### BR-147: LAN cabling / Home Move fee calculation
`Explicit` · confidence: `high`

- **Description:** LAN cabling charges: 10 QAR per meter for Mesh-to-Mesh cabling; 20 QAR per meter if installed with PVC trunking. Home Move Fee is free once per 12-month cycle, otherwise 200 QAR applies for additional moves within the cycle.
- **Original rule ID(s):** `2`
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “LAN cabling for Mesh-to-Mesh: 10 QAR per meter; with PVC trunking: 20 QAR per meter. Home Move Fee: free once per 12-month cycle, otherwise 200 QAR.”

### BR-183: Free Number Reservation Priced at QR0.00
`Explicit` · confidence: `high`

- **Description:** In the Number Selection dialog, an available FREE-category number is priced at QR0.00.
- **Original rule ID(s):** `43`
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Number Selection dialog lists an available FREE-category number priced at QR0.00”

### BR-185: CPE/Attribute-Only Modification Order Is Zero-Charge
`Inferred` · confidence: `high`

- **Description:** An order that only modifies CPE attributes (e.g. serial number update) is zero-charge, with Totals remaining QR0.00 (Total, MRC Total, NRC Total), consistent with a no-charge attribute-only modification.
- **Original rule ID(s):** `45`
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “"Totals remain QR0.00 (Total, MRC Total, NRC Total) consistent with a no-charge attribute-only modification"”

### BR-199: 100% Discount for 2 Months -FWA Auto-Applied on FWA Plan Selection
`Explicit` · confidence: `high`

- **Description:** Selecting an FWA plan automatically applies a '100% Discount for 2 Months -FWA' promotional discount.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Discount auto-applied: 100% Discount for 2 Months -FWA”

### BR-224: Bill Limit and Credit Limit Editable at Plan Selection
`Explicit` · confidence: `high`

- **Description:** At plan selection, agents can edit the Bill Limit and Credit Limit values via dedicated 'Edit Bill Limit' and 'Edit Credit Limit' controls.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Bill Limit: 150 (button: "Edit Bill Limit"), Credit Limit: 1000 (button: "Edit Credit Limit")”

### BR-226: Bill Limit Mobile Promotion Agent Min Value Threshold = 50 (Postpaid U Start)
`Explicit` · confidence: `high`

- **Description:** For the Bill Limit Mobile promotion (Postpaid U Start plan), pricing parameters are: SL List Price 3, Agent Min Value 50, SL Min Value 0.01, SL Default Value 20.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill Limit Mobile: SL List Price 3, Agent Min Value 50, SL Min Value 0.01, SL Default Value 20”

### BR-227: Bill Limit Mobile Plus Promotion Agent Min Value Threshold = 75
`Explicit` · confidence: `high`

- **Description:** For the Bill Limit Mobile Plus promotion, pricing parameters are: SL List Price 0, Agent Min Value 75, SL Min Value 0.01, SL Default Value 20, with the Default Flag checked.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill Limit Mobile Plus: SL List Price 0, Agent Min Value 75, SL Min Value 0.01, SL Default Value 20, Default Flag checked”

### BR-251: Agent Minimum Value is admin-configurable per Bill Limit/Spend Limit product
`Explicit` · confidence: `high`

- **Description:** Each Bill Limit / Spend Limit product (e.g. 'Bill Limit Mobile' with Agent Min 50, 'Bill Limit Mobile Plus' with Agent Min 80 and Default Flag checked) has an Agent Minimum Value that is configured and editable by an administrator in the Product Promotions admin Bill Limit Mapping tab.
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Bill Limit Mobile Plus": Agent Min Value field is being edited to "80" (raised from a prior value) in Product Promotions admin Bill Limit Mapping tab”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit Mapping tab shows two Spend Limit products: Bill Limit Mobile (Agent Min Value 50) and Bill Limit Mobile Plus (Agent Min Value 80, Default Flag checked)”

### BR-271: First month prorated billing on plan conversion
`Explicit` · confidence: `high`

- **Description:** On plan conversion (e.g. Pre2Post), the first month's charges are prorated, with the full plan charge applying starting from the following billing month.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Kindly note that your first month's charges will be prorated, plus the full charge of your plan for the following month.”

### BR-307: Bill Limit cannot exceed Credit Limit
`Explicit` · confidence: `high`

- **Description:** The Bill Limit value set on an account cannot exceed the account's Credit Limit (BL Rule 07).
- **Original rule ID(s):** `BL RULE 07`
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bill Limit Value cannot be more than Credit Limit!”

### BR-319: Star Number pricing/approval rule
`Explicit` · confidence: `high`

- **Description:** Star Number selections are subject to pricing and approval rules governing their cost tier and required sign-off.
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Star Number pricing/approval rules”

### BR-335: Resume Reverts to Base Plan Billing
`Explicit` · confidence: `medium`

- **Description:** Upon Mobile Service Resume (J024), the customer's Base Plan (reverted from Park Plan) becomes the billed plan.
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “"Base Plan would be Billed" stated as an outcome on the J024 Mobile Service Resume flow.”

## Permission Rules

### BR-021: Chooser Email Request Restriction
`Explicit` · confidence: `high`

- **Description:** A company nominates authorised persons on its CR, one or more of whom are flagged as "chooser"; requests are only accepted from the chooser's registered email address.
- **Original rule ID(s):** `raw:Chooser Email Request Restriction`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “company nominates authorised persons on the CR; one or more flagged as "chooser"; requests only accepted from the chooser's registered email”

### BR-022: Account Affiliation Grants Privileges Rule
`Explicit` · confidence: `high`

- **Description:** Account affiliation — an attached form plus account manager approval — is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount".
- **Original rule ID(s):** `raw:Account Affiliation Grants Privileges Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount"”

### BR-026: Access-Restricted Price Override Rule
`Explicit` · confidence: `high`

- **Description:** An access-restricted price override is used when the required discount exceeds the plan maximum; it hides the base vs. offered price distinction for reporting purposes.
- **Original rule ID(s):** `raw:Access-Restricted Price Override Rule`
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “access-restricted price override (used when required discount exceeds the plan maximum; hides base vs. offered price for reporting)”

### BR-053: SIM Swap on TON Success + Mandatory Approvals
`Explicit` · confidence: `high`

- **Description:** Agreed controls for TON: SIM swap occurs on success, and mandatory approvals are required.
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Agreed controls: SIM swap on success, and mandatory approvals”

### BR-055: Bill Cycle Change Restricted to Billing Team Role
`Explicit` · confidence: `high`

- **Description:** Bill cycle change is restricted to specific roles, namely the billing team.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill cycle change restricted to specific roles (billing team)”

### BR-057: SIM Swap Approval Matrix by Channel
`Explicit` · confidence: `high`

- **Description:** Approval matrix by channel for SIM swap: Retail requires approval plus SIM swap form plus ID attachment; Back office requires approval with attachment only (no form) for some cases and is auto-approved for others; MVA app requires no approval or form once eKYC is done.
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Approval matrix by channel: Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done”

### BR-058: Manager QID Bypass Field Restriction
`Explicit` · confidence: `high`

- **Description:** A manager-level bypass allows editing the QID number only, with all remaining fields validated against MOI (Ministry of Interior).
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “a manager-level bypass allows editing QID number only, with remaining fields validated against MOI”

### BR-062: TON Four Sequential Approval Fraud Control (prepaid-only)
`Explicit` · confidence: `high`

- **Description:** TON requires four sequential approvals routed to the CDM team, applicable to prepaid only; built as a fraud control after historical fraud where a fraudster collected money from two people for the same number at different stores.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “requires four sequential approvals routed to the CDM team; built as a fraud control after historical fraud where a fraudster collected money from two people for the same number at different stores”

### BR-065: Assign-to-Me Requires Queue Membership
`Explicit` · confidence: `high`

- **Description:** 'Assign to me' only works if the agent is in that queue's user list.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “'assign to me' only works if the agent is in that queue's user list”

### BR-066: Only Agent Can Reopen a Ticket (Customer Cannot)
`Explicit` · confidence: `high`

- **Description:** A customer cannot reopen a ticket from the app; only an agent can reopen a ticket.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “a customer cannot reopen a ticket from the app, only an agent can”

### BR-075: Direct Number Reservation from Siebel Generally Disallowed
`Explicit` · confidence: `high`

- **Description:** Direct number reservation from Siebel is generally not allowed except in special cases.
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “direct number reservation from Siebel is generally not allowed except special cases”

### BR-097: Combo Box Password Confidentiality
`Explicit` · confidence: `high`

- **Description:** Combo box/CPE password is fetched from UIM and is never disclosed to the customer or, currently, even to the field engineer.
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “combo box/CPE password is fetched from UIM, never disclosed to customer or (today) even to the field engineer [01:42:15, 01:44:53]”

### BR-111: Line-cap override requires authorized-officer role flag (CRA compliance)
`Explicit` · confidence: `high`

- **Description:** Overriding the maximum mobility lines cap requires an authorized-officer role flag set on the account (not an in-journey bypass), because the cap is a CRA (regulator) compliance rule.
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “Override requires an authorized-officer role flag on the account, not an in-journey bypass, because the limit is a CRA (regulator) rule [00:56:00, 00:56:37, 00:58:37]”

### BR-140: Safwa/Qatari contact creation requires authorization
`Explicit` · confidence: `high`

- **Description:** Creating a Safwa or Qatari contact record requires specific authorization; unauthorized users are blocked with an explicit error message.
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “"You are not authorized to create Safwa Contact"; "You are not authorized to create Qatari Contact"”

### BR-141: Retail cannot change primary contact
`Explicit` · confidence: `medium`

- **Description:** The Retail channel is restricted from changing a customer's primary contact; this permission restriction is noted in both the CRM journeys documentation and its type-classified revision.
- **Sources:**
  - [`crm-journeys-final-updated-a23640a5`](../.knowledge/docs/crm-journeys-final-updated-a23640a5.md): “free-text comments (e.g., "Retail cannot change primary contact")”
  - [`crm-journeys-final-updated-with-type-634b83d3`](../.knowledge/docs/crm-journeys-final-updated-with-type-634b83d3.md): “"Retail cannot change primary contact,"”

### BR-154: Cross-sell offer locks plan and add-on/discount selection
`Explicit` · confidence: `high`

- **Description:** On a cross-sell order journey, no plan-selection control is exposed to the agent — the journey auto-applies the plan tied to the accepted offer. There is also no editable add-on control, confirming the agent cannot add extra discounts/add-ons on a cross-sell order.
- **Original rule ID(s):** `9`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “No plan-selection control is exposed — the journey auto-applies the plan tied to the accepted offer... no editable add-on control, confirming the agent cannot add extra discounts/add-ons on a cross-sell order”

### BR-156: ECR Details field is Fulfilment-team-only
`Explicit` · confidence: `high`

- **Description:** The Enter ECR Details field is restricted for completion by the Fulfillment team only, as indicated by a tooltip on the field.
- **Original rule ID(s):** `11`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Enter ECR Details (No, green check, tooltip "To be filled by Fulfillment team only")”

### BR-162: Single correction round-trip rule (no second Reject-Correction)
`Explicit` · confidence: `high`

- **Description:** Only one correction round-trip is permitted per order. When reopening the order approval detail after a correction round has already occurred, only Approve and Reject - Drop Order options are shown; "Reject - Correction" is no longer offered.
- **Original rule ID(s):** `17`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Reopening the order approval detail this time shows only Approve and Reject - Drop Order (the "Reject - Correction" option is no longer offered, since one correction round has already occurred)”

### BR-171: Manager Approve Action Requires Document Verification Acknowledgement
`Explicit` · confidence: `high`

- **Description:** The manager's "Approve Order" modal requires an explicit acknowledgement: "By clicking submit, I agree that I have verified all the documents and details to proceed with submission."
- **Original rule ID(s):** `28`
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Approve Order" modal: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission"”

### BR-242: Lead Owner reassignment restricted to a candidate-agent picker list
`Explicit` · confidence: `high`

- **Description:** Reassigning a lead's Owner is done via a searchable popup picker that only lists a constrained set of candidate owners (shown with Job Title), rather than allowing free-text entry of any user.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'Lead Owner' popup with a searchable picker ... listing 5 candidate owners with Job Title”

### BR-243: Admin/back-office role has additional Reject and Retire actions on leads
`Explicit` · confidence: `high`

- **Description:** Users with an admin/back-office role see additional Reject and Retire action buttons on the Lead Details panel that are not available to regular agent-level users.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Lead Details panel below adds admin-only buttons Reject and Retire (in addition to the fields seen at agent level)”

### BR-254: Agent-editable Credit Limit from a preset value list
`Explicit` · confidence: `high`

- **Description:** Agents can override an account's Credit Limit, but only by selecting from a fixed, preset dropdown list of allowed values (e.g. 0, 1000, 1500, 200, 2000, 50, 500, 800), not by entering an arbitrary number.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Clicking Edit Credit Limit reveals a dropdown of selectable values: 0, 1000, 1500, 200, 2000, 50, 500, 800”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Credit Limit dropdown expanded showing options 1000, 200, 50 (highlighted/being selected), 500, 800”

### BR-261: ECR Details entry restricted to Fulfillment team
`Explicit` · confidence: `high`

- **Description:** The 'Enter ECR Details' field/step is restricted to the Fulfillment team; front-line agents leave it set to No, with the system noting it is 'to be filled by Fulfillment team only.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Enter ECR Details = No, with note "To be filled by Fulfillment team only."”

### BR-278: FDO modification/cancellation only allowed while status is Initial
`Explicit` · confidence: `high`

- **Description:** A Future Dated Order can only be modified or cancelled while its status remains 'Initial'; once it progresses beyond that status, modification/cancellation is no longer permitted through normal means.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “all modification/cancellation allowed only while status is Initial”

### BR-283: Disconnection FDO can only be raised via Siebel, cancellable only by retention team
`Explicit` · confidence: `high`

- **Description:** A Disconnection FDO can only be raised via Siebel (not via MVA); it cannot be cancelled through the app — only the retention team has authority to cancel it.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “raised only from Siebel (not MVA); cannot be cancelled by the app — only the retention team can cancel”

### BR-298: Tablet/partner orders require channel-manager approval before submission
`Explicit` · confidence: `high`

- **Description:** Orders placed via Tablet channel, which are mostly partner orders, require channel-manager approval before they can be submitted.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “Tablet orders (mostly partners) require channel-manager approval before submission (00:12:37)”

### BR-344: SMS Content Controlled Within Teams
`Explicit` · confidence: `medium`

- **Description:** The content of both automated SMS (e.g. New Ticket, Re-Opened Ticket) and manual SMS notifications sent for tickets is controlled/owned within individual teams rather than centrally.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Automated SMS for Tickets (New Ticket, Re-Opened Ticket — "SMS Content is controlled within teams"); Manual SMS for Tickets (same control note)”

### BR-345: Ticket Field Ownership by Role (Front Line vs Complaints Team)
`Explicit` · confidence: `medium`

- **Description:** Specific fields on the Ticket Homepage are designated to be filled by different roles: Front Line (FL) Agents, the Complaints Team, or FL Agents only for specific trouble ticket types.
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

## Visibility Rules

### BR-010: SOA From-Inception Display Rule
`Explicit` · confidence: `high`

- **Description:** The Statement of Account (SOA) must show data from inception, with one line per bill plus payments, adjustments, and allocations.
- **Original rule ID(s):** `raw:SOA From-Inception Display Rule`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations)”

### BR-012: Bill Simulation Not a Tax Invoice Disclosure Rule
`Explicit` · confidence: `high`

- **Description:** A "bill simulation" must explicitly disclose on its face that it is not a tax invoice, since two invoices cannot be generated for the same charges.
- **Original rule ID(s):** `raw:Bill Simulation Not a Tax Invoice Disclosure Rule`
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “"bill simulation" ... explicitly not a tax invoice; must state so on its face, since two invoices cannot be generated for the same charges”

### BR-067: Audit Trail Role-Restricted from Agents
`Explicit` · confidence: `high`

- **Description:** An audit trail exists on tickets and account tabs but is role-restricted from agents.
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “audit trail exists on tickets and account tabs but is role-restricted from agents”

### BR-085: FNP Hidden Pending Fix (execution date unreliable)
`Explicit` · confidence: `high`

- **Description:** FNP (Fixed Number Portability) is hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission.
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “FNP (Fixed Number Portability) will be hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission”

### BR-197: CAF Email Notification to Customer
`Explicit` · confidence: `high`

- **Description:** The system notifies the customer that a copy of the Customer Application Form (CAF) will be sent to their registered email address.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Notify customer that a copy of the CAF will be sent to his registered email address."”

### BR-201: FWA Journey Surfaces Only Fixed-Line Reserved Number, Not Mobile
`Explicit` · confidence: `high`

- **Description:** In the FWA Indoor B2B2C journey, only the fixed-line (FL) reserved number is offered/surfaced to the agent; any mobile number reservation on the account is not shown.
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “only the fixed-line number (41202301 / full 97441202301) is offered, confirming the FWA journey surfaces only the FL reservation, not the mobile one”

### BR-228: Default Smart/Bill Limit Must Be Communicated to Customer
`Explicit` · confidence: `high`

- **Description:** The agent is instructed that the Default Smart Limit (Bill Limit) value must be communicated to the customer.
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “note: 'Default Smart Limit should be communicated to the customer'”

### BR-240: My Leads view filters by Lead Owner; My Created Leads filters by Created By
`Explicit` · confidence: `high`

- **Description:** The 'My Leads' view is filtered by the Lead Owner field, so a lead disappears from that view after ownership is reassigned; the separate 'My Created Leads' view is filtered by Created By, so a lead persists in that view regardless of subsequent ownership changes.
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'My Leads' = filtered by Owner (lead disappears after reassignment); 'My Created Leads' = filtered by Created By (lead persists regardless of ownership changes)”

### BR-260: Default Bill Limit must be communicated to customer
`Explicit` · confidence: `high`

- **Description:** An informational banner requires the agent to communicate the Default Bill Limit to the customer as part of the sales journey.
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “info banner: "Default Bill Limit should be communicated to the customer"”

### BR-299: Partner visibility restricted to own orders/leads
`Explicit` · confidence: `high`

- **Description:** A partner user's visibility is restricted to only its own orders and leads, not those of other partners.
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “a partner sees only its own orders/leads”

### BR-331: Plan display logic conditional on ID type
`Explicit` · confidence: `high`

- **Description:** Which plans are displayed to the agent depends on the customer's ID type — e.g. Postpaid and Prepaid plans are shown if the ID type is QID, otherwise only Prepaid Type is shown (J011 onboarding flow).
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “plan display logic ('if QID Postpaid and Prepaid otherwise Prepaid Type')”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “plan display logic tied to ID type”

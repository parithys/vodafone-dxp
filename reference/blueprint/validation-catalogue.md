# Validation Catalogue (Phases 13 & 17)

Union of (a) Stage A's Validation-type Business Rules (`business-rules.md`) and (b) newly-extracted field-level validation rules/error messages from `field-inventory.md`. `source_ref` links back to the originating BR-xxx or FLD-xxx entry for full context.

**Canonical items:** 418

**Confidence:** high 389 · medium 28 · low 1
**Classification:** Explicit 410 · Inferred 8 · Assumed 0

Every item cites its source document slug(s) and evidence quote(s); open `.knowledge/docs/<slug>.md` for full context per `CLAUDE.md`.

---

## Validation entries by type

| Type | Count |
|---|---|
| Field-Level | 281 |
| Business Rule | 137 |

---

## Field-Level

### VAL-138: Unbilled Usage Screen - MSISDN
`Explicit` · confidence: `high`

- **Description:** Mandatory MSISDN + date range (within current cycle) to be enforced
- **Source reference:** [FLD-020]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced.”

### VAL-139: Unbilled Usage Screen - Date range
`Explicit` · confidence: `high`

- **Description:** Must be within current billing cycle
- **Source reference:** [FLD-021]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “mandatory MSISDN + date range (within current cycle) to be enforced”

### VAL-140: Enterprise Account Creation - CR number
`Explicit` · confidence: `high`

- **Description:** Mandatory CR-number search required before account creation
- **Source reference:** [FLD-025]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation. Account creation captures: name, CR type/ID type, CR number...”

### VAL-141: Enterprise Account Creation - Credit limit
`Explicit` · confidence: `high`

- **Description:** Enterprise has no default credit limit and requires business finance approval
- **Source reference:** [FLD-028]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “enterprise has no default credit limit and requires business finance approval.”

### VAL-142: Sub-account affiliation form - Attachment file name (QID_subaccount)
`Explicit` · confidence: `high`

- **Description:** Attachment must be named "QID_subaccount"
- **Source reference:** [FLD-029]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount".”

### VAL-143: Authorised Person / Chooser record - Registered email (chooser)
`Explicit` · confidence: `high`

- **Description:** Requests only accepted from the chooser's registered email
- **Source reference:** [FLD-031]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “requests only accepted from the chooser's registered email.”

### VAL-144: Contact record (privilege identifier pain point) - Job title (free text)
`Explicit` · confidence: `high`

- **Description:** No validation performed today (free-text used as privilege identifier)
- **Source reference:** [FLD-033]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “free-text job title used as the privilege identifier (no validation); no validation when linking sub-accounts to parents”

### VAL-145: CNAP configuration - Calling Name Presentation (CNAP) text
`Explicit` · confidence: `high`

- **Description:** 25-character limit; regulator-mandated, mandatory for fixed lines
- **Source reference:** [FLD-034]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile.”

### VAL-146: Volumetric Discount Configuration - Minimum number of connections (50)
`Explicit` · confidence: `high`

- **Description:** Minimum of 50 numbers, slab-based, evaluated at runtime
- **Source reference:** [FLD-036]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “volumetric discount has a minimum of 50 numbers, is slab-based, comes in revenue and service-count flavours, is evaluated at runtime, and has no automatic downgrade when connections drop”

### VAL-147: DAPN (dedicated APN) order - Static IP
`Explicit` · confidence: `medium`

- **Description:** Static IPs must be found manually in the pool (search does not work) — noted pain point
- **Source reference:** [FLD-042]
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “DAPN/dedicated APN...data SIM with static IP; numbers reserved one by one from the mobility-only category; no bulk template...Static IPs must be found manually in the pool (search does not work)”

### VAL-148: Microsoft Licence Billing Line Item - Licence quantity
`Explicit` · confidence: `medium`

- **Description:** Quantity does not carry to billing without "auto-explode"; one line item per licence with manual price changes
- **Source reference:** [FLD-043]
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “one line item per Microsoft licence with manual price changes because quantity does not carry to billing without "auto-explode"”

### VAL-149: MNP Order (Siebel) - Scheduled porting date
`Explicit` · confidence: `high`

- **Description:** Porting window Sunday–Thursday 11am–12pm; requests before 10:45am make that day's window
- **Source reference:** [FLD-062]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (...subscription type, scheduled porting date), a reserved zero-value temporary MSISDN, and attachments”

### VAL-150: MNP Order (Siebel) - Attachment: MNP form 2-A-D
`Explicit` · confidence: `high`

- **Description:** Under 2 MB; PDF or JPG only
- **Source reference:** [FLD-064]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

### VAL-151: MNP Order (Siebel) - Attachment: donor-registered ID
`Explicit` · confidence: `high`

- **Description:** Under 2 MB; PDF or JPG only; DNO verification type
- **Source reference:** [FLD-065]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

### VAL-152: MNP Consent - Consent SMS
`Explicit` · confidence: `high`

- **Description:** Customer must send consent SMS within 24 hours of order creation
- **Source reference:** [FLD-066]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

### VAL-153: MNP Rejection - Rejection reason (donor)
`Explicit` · confidence: `high`

- **Description:** Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey
- **Source reference:** [FLD-067]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey.”

### VAL-154: FNP Order / Trouble Ticket - Outstanding due amount (visible)
`Explicit` · confidence: `high`

- **Description:** Displayed when conditionally accepted; 3 working days for consumer to clear
- **Source reference:** [FLD-070]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date.”

### VAL-155: MNP Port-Out Trouble Ticket (Siebel) - Rejection Reason Code
`Explicit` · confidence: `high`

- **Description:** 14-15 rejection reason codes tightly coupled to NPass and cannot be renamed; consumer channel uses only reasons 1, 4 and 9
- **Source reference:** [FLD-078]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9”

### VAL-156: MNP Port-Out Trouble Ticket (Siebel) - Detailed Rejection Explanation (ticket level)
`Explicit` · confidence: `high`

- **Description:** Captured at ticket level alongside reason code 1/4/9
- **Source reference:** [FLD-079]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “detailed explanations captured at ticket level”

### VAL-157: MNP Port-Out Trouble Ticket (Siebel) - Auto-Validation - Customer Name
`Explicit` · confidence: `high`

- **Description:** Auto-validated by system; auto-reject on failure
- **Source reference:** [FLD-080]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### VAL-158: MNP Port-Out Trouble Ticket (Siebel) - Auto-Validation - QID / ID Type and Number
`Explicit` · confidence: `high`

- **Description:** Auto-validated by system; auto-reject on failure
- **Source reference:** [FLD-081]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### VAL-159: MNP Port-Out Trouble Ticket (Siebel) - Auto-Validation - Service Type
`Explicit` · confidence: `high`

- **Description:** Auto-validated by system; auto-reject on failure
- **Source reference:** [FLD-082]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### VAL-160: MNP Port-Out Trouble Ticket (Siebel) - Auto-Validation - Consumer Type
`Explicit` · confidence: `high`

- **Description:** Auto-validated by system; auto-reject on failure
- **Source reference:** [FLD-083]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### VAL-161: MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks - Signature Match
`Explicit` · confidence: `high`

- **Description:** Manual check because Siebel cannot read the digital form and documents live only in NPass
- **Source reference:** [FLD-084]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual because Siebel cannot read the digital form and the documents live only in NPass”

### VAL-162: MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks - MNP Form Date
`Explicit` · confidence: `high`

- **Description:** Must be within 30 days
- **Source reference:** [FLD-085]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### VAL-163: MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks - Segment
`Explicit` · confidence: `high`

- **Description:** Manually checked against form
- **Source reference:** [FLD-086]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### VAL-164: MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks - Product (Prepaid/Postpaid)
`Explicit` · confidence: `high`

- **Description:** Manually checked against form
- **Source reference:** [FLD-087]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### VAL-165: MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks - Requested Number
`Explicit` · confidence: `high`

- **Description:** Manually checked against form
- **Source reference:** [FLD-088]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### VAL-166: MNP Port-Out - Conditional Acceptance (Consumer) - Billed Due Amount (QAR)
`Explicit` · confidence: `high`

- **Description:** Conditional acceptance triggers automatically when billed due exceeds 100 QAR; unbilled amounts do not trigger it for MNP
- **Source reference:** [FLD-089]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP”

### VAL-167: FNP Port-Out - Conditional Acceptance (Consumer) - Unbilled Amount (service level)
`Explicit` · confidence: `high`

- **Description:** Unlike MNP, FNP allows unbilled amounts to trigger conditional acceptance and operates at service level rather than billing profile level
- **Source reference:** [FLD-090]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “FNP, by contrast, allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level”

### VAL-168: MNP Port-Out - Ticket SLA/Timer - Action Window Timer
`Explicit` · confidence: `high`

- **Description:** Two-hour action window, extended to 24 hours once documents are validated, bound by NPass working hours (~7:30-3:30/4) as hard stop
- **Source reference:** [FLD-091]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours (~7:30–3:30/4) as a hard stop rather than an SLA”

### VAL-169: TON - Retail Flow (existing/new customer validation) - Number Price
`Explicit` · confidence: `high`

- **Description:** A null/blank value causes unnecessary CDM queue tickets — identified as a legacy data/design gap
- **Source reference:** [FLD-092]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “a null/blank number price causing unnecessary CDM queue tickets (identified as a legacy data and design gap)”

### VAL-170: TON - Retail Flow (existing/new customer validation) - Signature
`Explicit` · confidence: `high`

- **Description:** Subject to data-entry rejections
- **Source reference:** [FLD-093]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “signature and QID data-entry rejections; missing attachments”

### VAL-171: TON - Retail Flow (existing/new customer validation) - QID
`Explicit` · confidence: `high`

- **Description:** Subject to data-entry rejections
- **Source reference:** [FLD-094]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “signature and QID data-entry rejections; missing attachments... OCR bypass by role”

### VAL-172: TON - Retail Flow (existing/new customer validation) - Attachments
`Explicit` · confidence: `high`

- **Description:** Frequently missing, a known pain point
- **Source reference:** [FLD-095]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “missing attachments; TON order visibility only available on the new account”

### VAL-173: TON - Retail Flow (existing/new customer validation) - TON / Prepaid Migration Fee
`Explicit` · confidence: `high`

- **Description:** Governed by business rules discussed in session
- **Source reference:** [FLD-097]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “TON and prepaid-migration fees and their business rules”

### VAL-174: Fixed/5G TON - OSN Add-on
`Explicit` · confidence: `high`

- **Description:** Removed at TON, re-added afterward
- **Source reference:** [FLD-099]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Fixed/5G TON covered separately: OSN add-on removal and re-add, login/email re-registration, spend limit control during transition, and bill cycle adjustment”

### VAL-175: Fixed/5G TON - Login/Email
`Explicit` · confidence: `high`

- **Description:** Requires re-registration during TON
- **Source reference:** [FLD-100]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “login/email re-registration, spend limit control during transition, and bill cycle adjustment”

### VAL-176: Fixed/5G TON - Spend Limit
`Explicit` · confidence: `high`

- **Description:** Controlled during transition period
- **Source reference:** [FLD-101]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “spend limit control during transition, and bill cycle adjustment”

### VAL-177: Fixed/5G TON - Bill Cycle
`Explicit` · confidence: `high`

- **Description:** Adjusted as part of TON
- **Source reference:** [FLD-102]
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “and bill cycle adjustment”

### VAL-178: CAF (Customer Application Form) - Tablet Signature - Highlighted Key T&Cs Section
`Explicit` · confidence: `high`

- **Description:** Content configured by business admin, not agent-selectable
- **Source reference:** [FLD-103]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “a configurable, business-admin-controlled "highlighted key T&Cs" section will be added to the CAF flow rather than agent-selected highlights (agent selection was rejected to reduce clicks/errors)”

### VAL-179: CAF (Customer Application Form) - CAF Serial / ID
`Explicit` · confidence: `high`

- **Description:** Must be unique, follow a defined naming convention
- **Source reference:** [FLD-104]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF must have unique serial/ID and naming convention [00:09:14]”

### VAL-180: Incomplete/Pending Order (transient state) - Hold Period / Number Reservation Expiry
`Explicit` · confidence: `high`

- **Description:** Tied to channel's number reservation expiry, generally up to ~48 hours; not created as an order at GSP layer until complete
- **Source reference:** [FLD-107]
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “incomplete/pending orders held in a transient state (not created as an order at the GSP layer) with hold period tied to the channel's number reservation expiry, generally up to ~48 hours”

### VAL-181: Billing Account / Bill Profile - Bill Profile
`Explicit` · confidence: `high`

- **Description:** One billing account holds exactly one bill profile; multiple services can link to one billing account
- **Source reference:** [FLD-110]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “introduce a new billing account entity — multiple services can link to one billing account; billing account holds one bill profile”

### VAL-182: Billing Account / Bill Profile - Billing Address
`Explicit` · confidence: `high`

- **Description:** Can differ from customer address
- **Source reference:** [FLD-111]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “billing address can differ from customer address”

### VAL-183: Billing Account / Bill Profile - Bill Email Recipients (CC)
`Explicit` · confidence: `high`

- **Description:** Supports multiple recipients and multiple email types per contact (work/personal); billing profile linked to a contact for traceability
- **Source reference:** [FLD-112]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “support multiple bill email recipients (CC) and multiple email types per contact (work/personal); billing profile to be linked to a contact for traceability”

### VAL-184: Billing Account / Bill Profile - Email Verification Status
`Explicit` · confidence: `high`

- **Description:** Captured as unverified at entry, verified asynchronously via callback before next bill generation
- **Source reference:** [FLD-113]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “emails captured as unverified at entry, verified asynchronously via callback before next bill generation”

### VAL-185: AutoPay - AutoPay Status / Failure Reason
`Explicit` · confidence: `high`

- **Description:** Agents cannot enroll/cancel AutoPay or see card details (regulatory restriction)
- **Source reference:** [FLD-114]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “agents cannot enroll/cancel AutoPay or see card details (regulatory restriction) — agents get view-only visibility of AutoPay status and failure reason”

### VAL-186: Bill Medium - Bill Medium (Detailed/Summary)
`Explicit` · confidence: `high`

- **Description:** Defaults: detailed bill for consumer, summary PDF for enterprise, with customer option for summary only
- **Source reference:** [FLD-115]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill medium defaults — detailed bill for consumer, summary PDF for enterprise, with customer option for summary only”

### VAL-187: Bill Cycle Change - Bill Cycle Change Eligibility
`Explicit` · confidence: `high`

- **Description:** Restricted to specific roles (billing team); eligibility rule must be configurable, not hard-coded
- **Source reference:** [FLD-116]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill cycle change restricted to specific roles (billing team); business rule for change eligibility must be configurable, not hard-coded; a ticket is always created even when a change isn't allowed, but auto-resolved in real time”

### VAL-188: SIM Swap - ID Verification - QID Number (SIM Swap manager bypass)
`Explicit` · confidence: `high`

- **Description:** Agents cannot manually enter ID details, only re-scan; manager-level bypass allows editing QID number only, remaining fields validated against MOI
- **Source reference:** [FLD-117]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “agents cannot manually enter ID details, only re-scan; a manager-level bypass allows editing QID number only, with remaining fields validated against MOI”

### VAL-189: SIM Swap - ID Verification - Name, DOB, Nationality (MOI match)
`Explicit` · confidence: `high`

- **Description:** Validated via MOI API against OCR-scanned ID, then matched against existing CBS/customer information (extra third validation step for SIM Swap)
- **Source reference:** [FLD-118]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “OCR of ID → match barcode → MOI API (name, DOB, nationality) → match against existing CBS/customer information (SIM Swap has this extra third validation step)”

### VAL-190: SIM Swap - Charging - SIM Swap Charge
`Explicit` · confidence: `high`

- **Description:** eSIM to eSIM free; eSIM to physical charged; lost SIM chargeable; damaged SIM not charged
- **Source reference:** [FLD-119]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “charging rules — eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged”

### VAL-191: SIM Swap - Approval - Approval / SIM Swap Form / ID Attachment
`Explicit` · confidence: `high`

- **Description:** Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done
- **Source reference:** [FLD-120]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Approval matrix by channel: Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done”

### VAL-192: Manual Suspension ("Park My Number") - Park My Number Plan
`Explicit` · confidence: `high`

- **Description:** 35 Rial, four-month upfront-paid plan; credit limit set to zero; restricted to specific roles; run as back-office ticket-driven process, not a retail journey
- **Source reference:** [FLD-121]
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “delivered via a 35 Rial, four-month upfront-paid "park my number" plan with credit limit set to zero; restricted to specific roles and run as a back-office ticket-driven process, not a retail journey”

### VAL-193: Trouble Ticket (Open UI/Siebel) - Ticket Source
`Explicit` · confidence: `high`

- **Description:** Agent-created, system-generated (eShop/NPAS/portal), Open UI Excel, or customer-originated (MVA requests go to validation queue before becoming agent-created ticket)
- **Source reference:** [FLD-122]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Ticket sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket)”

### VAL-194: Trouble Ticket - Disconnection - Resolution Code (retention)
`Explicit` · confidence: `high`

- **Description:** Ticket must be closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page
- **Source reference:** [FLD-123]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “ticket closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page”

### VAL-195: Trouble Ticket - MNP Port-Out - Unbilled Amount (auto-fetched)
`Explicit` · confidence: `high`

- **Description:** Auto-fetched by system
- **Source reference:** [FLD-124]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched”

### VAL-196: Trouble Ticket - MNP Port-Out - DOI Outstanding Amount
`Explicit` · confidence: `high`

- **Description:** NOT auto-fetched, must be entered/checked manually
- **Source reference:** [FLD-125]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched”

### VAL-197: Trouble Ticket - MNP Port-Out - Star Number Port-Out Block (commitment period)
`Explicit` · confidence: `high`

- **Description:** Configurable; blocks porting during commitment period; built after customers took high-value star numbers and immediately ported out
- **Source reference:** [FLD-126]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Star number port-out control blocks porting during the commitment period (configurable), built after customers took high-value star numbers and immediately ported out”

### VAL-198: Trouble Ticket (general) - Public Notes
`Explicit` · confidence: `high`

- **Description:** Retained indefinitely, no retention limit
- **Source reference:** [FLD-127]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “make public notes as prominent as the bell icon (agents currently miss them)”

### VAL-199: Trouble Ticket (general) - Assign to Me
`Explicit` · confidence: `high`

- **Description:** Only works if the agent is in that queue's user list
- **Source reference:** [FLD-129]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “"assign to me" only works if the agent is in that queue's user list”

### VAL-200: Retail Verification - QID - QID Scan (per transaction)
`Explicit` · confidence: `medium`

- **Description:** Required only when there is an actual account/service change; not required for complaints/inquiries/bill payments without a change; agent must visually match ID photo to customer
- **Source reference:** [FLD-130]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer... required only when there is an actual account/service change”

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review — applies to VAL-201 through VAL-205 below):** derived from the same single, 85%-data-loss source as `field-inventory.md` FLD-131..135 and `business-rules.md` BR-079 — see BR-079's caveat for full detail. This security-question model has zero corroboration anywhere else in the corpus; re-scored 53/100 (Medium-Low). Validate before treating as agreed.

### VAL-201: Contact Center Security Verification - Security Question - QID
`Explicit` · confidence: `medium`

- **Description:** Mandatory question
- **Source reference:** [FLD-131]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions”

### VAL-202: Contact Center Security Verification - Security Question - Account/Holder Name
`Explicit` · confidence: `medium`

- **Description:** Mandatory question
- **Source reference:** [FLD-132]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions”

### VAL-203: Contact Center Security Verification - Security Question - Registered Notification Number
`Explicit` · confidence: `medium`

- **Description:** Asked flexibly depending on what customer can answer; validated by agent interpretation, not exact string match
- **Source reference:** [FLD-133]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer, and are validated by agent interpretation rather than exact string match”

### VAL-204: Contact Center Security Verification - Security Question - Active Add-on
`Explicit` · confidence: `medium`

- **Description:** Asked flexibly, agent-interpreted
- **Source reference:** [FLD-134]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer”

### VAL-205: Contact Center Security Verification - Security Question - Email Address
`Explicit` · confidence: `medium`

- **Description:** Asked flexibly, agent-interpreted
- **Source reference:** [FLD-135]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer”

### VAL-206: Agent Usage/Balance View - My Account App Recent Access Indicator
`Inferred` · confidence: `medium`

- **Description:** Gap: no such indicator exists today; requirement raised to add it
- **Source reference:** [FLD-136]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “no indicator today showing whether a customer recently accessed the My Account app; requirement raised to surface this on the agent's usage/balance view”

### VAL-207: Plan Change (Upgrade/Downgrade) - Rental Value (used to infer upgrade vs downgrade)
`Explicit` · confidence: `high`

- **Description:** System does NOT distinguish upgrade from downgrade; agents infer it from plan/promotion name and rental value (higher rental = upgrade)
- **Source reference:** [FLD-137]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade)”

### VAL-208: Prepaid-to-Postpaid Migration - Eligibility - Minimum Age on Network
`Explicit` · confidence: `high`

- **Description:** Minimum one month age on network (manual today, to be automated)
- **Source reference:** [FLD-138]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

### VAL-209: Prepaid-to-Postpaid Migration - Eligibility - Minimum Recharge Amount (last month)
`Explicit` · confidence: `high`

- **Description:** Minimum 50 Riyal recharge in last month
- **Source reference:** [FLD-139]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “minimum 50 Riyal recharge in the last month”

### VAL-210: Prepaid-to-Postpaid Migration - Eligibility - CDR-Based Usage History Check
`Explicit` · confidence: `high`

- **Description:** Manual today, to be automated; prevents abuse of prepaid-to-postpaid migration
- **Source reference:** [FLD-140]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “CDR-based usage history check [00:32:14, 00:32:26, 00:33:16]”

### VAL-211: Postpaid-to-Prepaid Migration - Migration Fee
`Explicit` · confidence: `high`

- **Description:** 100 Riyal migration fee applied on final bill; in retail must be MANUALLY added by agent customizing the order (approved by managers) — not automated, flagged as revenue-leakage risk if forgotten
- **Source reference:** [FLD-141]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “100 Riyal migration fee applied on the final bill; in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers)”

### VAL-212: Customer Billing Profiles - Number of Billing Profiles (Consumer)
`Explicit` · confidence: `high`

- **Description:** Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more
- **Source reference:** [FLD-142]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more”

### VAL-213: Multi-SIM/iWatch - Secondary MSISDN
`Explicit` · confidence: `high`

- **Description:** Linked to primary; invisible to customer; up to 4 multi-SIMs depending on plan
- **Source reference:** [FLD-143]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “secondary MSISDN linked to primary but invisible to the customer; up to 4 multi-SIMs depending on plan”

### VAL-214: Multi-SIM/iWatch - Multi-SIM Pricing
`Explicit` · confidence: `high`

- **Description:** Set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal)
- **Source reference:** [FLD-144]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “pricing set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal)”

### VAL-215: Number Management - Number Category (Free/Paid)
`Explicit` · confidence: `high`

- **Description:** Two categories only — free and paid (paid can become free depending on plan)
- **Source reference:** [FLD-145]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “two categories only — free and paid (paid can become free depending on plan)”

### VAL-216: Credit Limit - Credit Limit (default)
`Explicit` · confidence: `high`

- **Description:** Default 1,000 for expat on new account, dropped to 50 for HRN customers (agent-selected or system-enforced depending on nationality config); no system restriction today preventing any agent selecting any value — flagged as uncontrolled credit exposure risk
- **Source reference:** [FLD-146]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “default 1,000 for expat on new account, dropped to 50 for HRN customers... no system restriction today preventing any agent from selecting any credit limit value”

### VAL-217: Device Installment (DOI) - Portal - DOI Eligibility (big data/QID-based)
`Explicit` · confidence: `high`

- **Description:** Portal eligibility via "big data" logic on QID
- **Source reference:** [FLD-147]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “current retail process (portal eligibility via "big data" logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order)”

### VAL-218: Device Installment (DOI) - Portal - Stock Check/Reservation (WinCash)
`Explicit` · confidence: `high`

- **Description:** Stock validated and reserved via WinCash
- **Source reference:** [FLD-148]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order”

### VAL-219: Device Installment (DOI) - Portal - Installment Breakdown
`Explicit` · confidence: `high`

- **Description:** Target DXP flow: displayed after identity/DOI validation via EDW and product catalog selection
- **Source reference:** [FLD-150]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “identity validation and DOI validation (via EDW) in DXP, product catalog in DXP, installment breakdown, stock validation/reservation and first-installment payment in WinCash”

### VAL-220: KID-In-Use Order Task (Fixed Line) - Contract Attachment (proof)
`Explicit` · confidence: `high`

- **Description:** Mandatory as proof before flow can proceed; downstream submission blocked until order task completed; if disputed, order task marked unsuccessful and order cancelled with no downstream impact
- **Source reference:** [FLD-151]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed”

### VAL-221: Fixed Line - IPTV Selection - IPTV Add-on (Basic/Premium)
`Explicit` · confidence: `high`

- **Description:** Default triple-play bundle includes IPTV; optional/removable — if removed, dual-play order created with no set-top box and no OSM IPTV provisioning; IPTV basic free, only premium charged
- **Source reference:** [FLD-152]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM; IPTV basic is free, only premium is charged”

### VAL-222: Fixed Line - Number Selection - Auto-Selected Number (fixed/prepaid)
`Explicit` · confidence: `high`

- **Description:** Auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks; reserved-number retrieval and list-query options retained; NOT applied to mobile postpaid since those numbers carry a price
- **Source reference:** [FLD-153]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks, while retaining reserved-number retrieval and list-query options; NOT applied to mobile postpaid since those numbers carry a price”

### VAL-223: Fixed Line - Appointment Booking - Appointment Date/Slot
`Explicit` · confidence: `high`

- **Description:** To-be: pre-selects next available date/slot, agent only changes if customer wants different date; bounded by location's SLA cluster (e.g., within 3 days or 1 week)
- **Source reference:** [FLD-154]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “appointment step to be enhanced to pre-select the next available date/slot... appointments live ONLY in WFM — Siebel stores just the reference/activity ID”

### VAL-224: Fixed Line Order - FNP (Fixed Number Portability) Option
`Explicit` · confidence: `high`

- **Description:** Hidden for now (capability retained but not exposed) because execution date field is unreliable and pending bills with other operators block order submission
- **Source reference:** [FLD-155]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “FNP (Fixed Number Portability) will be hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission”

### VAL-225: Fixed Line Order - Supplementary Form
`Explicit` · confidence: `high`

- **Description:** Currently a non-digital attachment; action item to digitalize
- **Source reference:** [FLD-156]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “digitalize the supplementary form, currently a non-digital attachment”

### VAL-226: Postpaid CAF - Section 2 Billing Information - Credit card number
`Inferred` · confidence: `medium`

- **Description:** Required when Payment method = credit card
- **Source reference:** [FLD-182]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Payment method, Credit card number, Credit card expiry date”

### VAL-227: Postpaid CAF - Section 2 Billing Information - Credit card expiry date
`Inferred` · confidence: `medium`

- **Description:** Required when Payment method = credit card
- **Source reference:** [FLD-183]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Credit card number, Credit card expiry date, Name on card”

### VAL-228: Postpaid CAF - Section 2 Billing Information - Card holder signature
`Explicit` · confidence: `high`

- **Description:** Credit-card authorization consent clause applies
- **Source reference:** [FLD-187]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Account number, Card holder signature — plus a credit-card authorization consent clause”

### VAL-229: Postpaid CAF - Section 3 For Postpaid Customers - Postpaid Plan
`Explicit` · confidence: `high`

- **Description:** minimum subscription period of 3 months applies
- **Source reference:** [FLD-190]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Postpaid Plan* (note: minimum subscription period of 3 months applies)”

### VAL-230: Postpaid CAF - Section 3 For Postpaid Customers - Signature
`Explicit` · confidence: `high`

- **Description:** Acknowledgment clause referencing Postpaid Terms & Conditions
- **Source reference:** [FLD-192]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Signature*, and an acknowledgment clause referencing Postpaid Terms & Conditions”

### VAL-231: Postpaid CAF - Section 4 Superfast Broadband & Home Phone - Plan Name
`Explicit` · confidence: `high`

- **Description:** minimum 3-month subscription applies
- **Source reference:** [FLD-195]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Plan Name (minimum 3-month subscription applies), Extras (x2)”

### VAL-232: Postpaid CAF - Section 4 Superfast Broadband & Home Phone - Signature
`Explicit` · confidence: `high`

- **Description:** Acknowledgment clause referencing Vodafone Home T&Cs
- **Source reference:** [FLD-198]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Appointment Details, Signature, plus an acknowledgment clause referencing Vodafone Home T&Cs”

### VAL-233: Contact record (create/update) - CRM - Email
`Explicit` · confidence: `high`

- **Description:** Must match "abc@xyz.com" pattern Error message: "Email format entered is incorrect..."
- **Source reference:** [FLD-212]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: Email format ("abc@xyz.com" pattern)...e.g. ..."Email format entered is incorrect..."”

### VAL-234: Contact record (create/update) - CRM - ID Number
`Explicit` · confidence: `high`

- **Description:** Qatari ID must be an 11-digit numeric value; must match embedded DOB Error message: "Please enter a valid 11-digit ID number"
- **Source reference:** [FLD-214]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “listing 40 rows of validation messages...e.g. "Please enter a valid 11-digit ID number,"...Qatari ID must be an 11-digit numeric value; Date of Birth and Qatari ID "do not match"”

### VAL-235: Contact record (create/update) - CRM - ID Expiration Date
`Explicit` · confidence: `high`

- **Description:** ID Expiration Date must be in the future
- **Source reference:** [FLD-215]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Cross-field/logic checks: ID Expiration Date must be in the future...”

### VAL-236: Contact record (create/update) - CRM - Birth Date
`Explicit` · confidence: `high`

- **Description:** Date of Birth and Qatari ID must match; contact age under 18 flagged
- **Source reference:** [FLD-217]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Cross-field/logic checks: ...Date of Birth and Qatari ID "do not match" (implies an embedded-DOB validation against QID number)...contact age under 18 flagged”

### VAL-237: Contact record (create/update) - CRM - Alternate/Cellular Phone #
`Explicit` · confidence: `high`

- **Description:** Must start with '974' and be 11 digits Error message: "Enter a Cellular Phone# that starts with '974'"
- **Source reference:** [FLD-218]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Cellular/Work Phone # must start with "974" and be 11 digits; e.g. "Enter a Cellular Phone# that starts with '974'," "Cellular Phone# must be of 11 digits," "Enter a valid Cellular Phone #,"”

### VAL-238: Contact record (create/update) - CRM - Passport Number
`Explicit` · confidence: `high`

- **Description:** 4-20 alphanumeric characters, no non-alphanumeric characters
- **Source reference:** [FLD-220]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Passport must be 4–20 alphanumeric characters (no non-alphanumeric characters);”

### VAL-239: Contact record (create/update) - CRM - GCC ID
`Explicit` · confidence: `high`

- **Description:** 8-20 numeric characters
- **Source reference:** [FLD-221]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...GCC ID must be 8–20 numeric characters;”

### VAL-240: Contact record (create/update) - CRM - Business ID
`Explicit` · confidence: `high`

- **Description:** 3-20 characters, numeric and '/' only
- **Source reference:** [FLD-222]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Business ID must be 3–20 characters, numeric and "/" only.”

### VAL-241: Contact record (create) - CRM authorization - Safwa Contact creation authorization flag
`Explicit` · confidence: `high`

- **Description:** Error message: "You are not authorized to create Safwa Contact"
- **Source reference:** [FLD-223]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Authorization checks: "You are not authorized to create Safwa Contact"; "You are not authorized to create Qatari Contact" (listed twice).”

### VAL-242: Contact record (create) - CRM authorization - Qatari Contact creation authorization flag
`Explicit` · confidence: `high`

- **Description:** Error message: "You are not authorized to create Qatari Contact"
- **Source reference:** [FLD-224]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Authorization checks: ..."You are not authorized to create Qatari Contact" (listed twice).”

### VAL-243: Postpaid New Connection - Retail Journey (ID scan/MOI check) - QID / ID document scan result
`Explicit` · confidence: `high`

- **Description:** QID mandatory for postpaid; MOI API primary source, Tarasol/manual fallback only if MOI API doesn't respond
- **Source reference:** [FLD-225]
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “QID is mandatory for postpaid — postpaid cannot be sold against any other ID type...MOI API is the primary ID-data source (Tarasol/manual is fallback only if MOI API doesn't respond)”

### VAL-244: FWA New Connection - Address/ZSP entry - ZSP entry
`Explicit` · confidence: `high`

- **Description:** presence-only validation (not format) on email/address fields — flagged as data-quality gap
- **Source reference:** [FLD-230]
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “ZSP entry mandatory but email/address fields are validated for presence only, not format — flagged as a data-quality gap/requirement”

### VAL-245: Address/Service Point entry (Siebel) - ZSB - ZSB (zone/street/building)
`Explicit` · confidence: `high`

- **Description:** mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record
- **Source reference:** [FLD-238]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record that "cannot be changed because changing it impacts everybody"”

### VAL-246: GigaHome Subscription Acceptance Form (page 1, English) - Fair Usage Policy (FUP)
`Explicit` · confidence: `high`

- **Description:** After full FUP usage, speed throttles to up to 1 Mbps until next billing cycle
- **Source reference:** [FLD-253]
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Fair Usage Policy (FUP): 1 TB / 2 TB / 10 TB per month; after full usage, speed throttles to up to 1 Mbps until next billing cycle”

### VAL-247: New Fixed Line – Addon & Discount step - Add-on / Discount
`Explicit` · confidence: `high`

- **Description:** if there are no applicable add-on or discount, the selector will be empty (Fulfilment)
- **Source reference:** [FLD-283]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “only a read-only Discount field ("First-Time Offer - 2 Months Free - BIA") ... no editable add-on control”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Buttons "Select Add-on" / "Select IPTV Add-on". Auto-populated IPTV Add-ons: OSN Get Started, Standard package, Vodafone Club, IDM ID. Discount: Special Discount - 3 Months Free”

### VAL-248: New Fixed Line – Book Appointment confirm dialog - Appointment booking confirm (cannot-cancel warning)
`Explicit` · confidence: `high`

- **Description:** Error message: "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."
- **Source reference:** [FLD-289]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"WARNING: Appointment once booked cannot be cancelled..." → OK → "Appointment has been successfully booked. ... Appointment ID is 121379"”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a browser confirm dialog appears: "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."”

### VAL-249: New Fixed Line – Appointment fetched / booking success - Appointment Number / Technician ID / Appointment ID (success result)
`Explicit` · confidence: `high`

- **Description:** Error message: "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242. (Fulfilment); Appointment ID is 121379 (Cross Sales)"
- **Source reference:** [FLD-290]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “results table shows Appointment Number 1-29793918853, Technician ID ABATS_Consumer_Installation, Status pending”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a success alert: "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242."; result table: Appointment Number 1-26921281993”

### VAL-250: New Fixed Line – Activity/completion step - Comments / Order completion dialog
`Explicit` · confidence: `high`

- **Description:** Error message: "Fixed Line completed successfully. Order Number:- '1-29793912388' (Cross Sales); Order Number:- '1-26921279847' (Fulfilment)"
- **Source reference:** [FLD-292]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a Comments field filled with "CROSS SALES TESTING"; Save and Finish → "Fixed Line completed successfully. Order Number:- '1-29793912388'"”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a success dialog: "Fixed Line completed successfully. Order Number:- '1-26921279847'" with a "Finish Process" button”

### VAL-251: Fulfilment/Tablet Activation – Step 1 Contact details (IPTV/contact block) - Get IPTV? / Email / Language / Alt. phone #
`Explicit` · confidence: `high`

- **Description:** This is a notification contact. Please enter a local mobile number.
- **Source reference:** [FLD-300]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Get IPTV? = Yes, Email = nobill2@vfq.com, Language = English, Alt. phone # = 97412341234 ("This is a notification contact. Please enter a local mobile number.")”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Get IPTV? = Yes; Email = noemailid@vodafone.com; No Email unchecked; Language = English; Alt. phone # = 97412341234”

### VAL-252: Fulfilment – Fixed Line IPTV popup - Tick box for different billing email / Billing Email
`Explicit` · confidence: `high`

- **Description:** Error message: "IDM Created Successfully"
- **Source reference:** [FLD-301]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field = Nobill123@vfq.com”

### VAL-253: Tablet Combo Box Normal Activation – Prepatched device detection dialog - Activation type choice (Instant/Normal)
`Explicit` · confidence: `high`

- **Description:** Error message: "We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?"
- **Source reference:** [FLD-306]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"We've detected the device at customer's premises ... Proceed with Instant Activation?" Buttons: Instant Activation / Normal Activation”

### VAL-254: Tablet Combo Box Normal Activation – Step 1 Contact (ID capture) - Do Not Disturb button
`Explicit` · confidence: `high`

- **Description:** Set Do Not Disturb if the customer refused the service.
- **Source reference:** [FLD-307]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “a DO NOT DISTURB button ("Set Do Not Disturb if the customer refused the service.")”

### VAL-255: Tablet Combo Box Normal Activation – Step 1 Contact (ID capture) - ID Type / ID Number
`Explicit` · confidence: `high`

- **Description:** verified via green check
- **Source reference:** [FLD-308]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “ID Type = Qatari ID, ID Number = 27652419981 (verified, green check)”

### VAL-256: New Fixed Line Tablet – Addon & Discount Step - Select Add-on / Select IPTV Add-on / Select Discount
`Explicit` · confidence: `high`

- **Description:** If there are no applicable add-on or discount, the selector will be empty.
- **Source reference:** [FLD-311]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Buttons: Select Add-on, Select IPTV Add-on, Select Discount. IPTV Add-ons shown: OSN TV Main, OSNTV Premium Pack Free, IPTV Email Id and Mobile No. (Combo Box Step 4 Addon & Discount)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Buttons Select Add-on and Select Discount; agent clicks Continue without adding any / Skip also available (Non Combo Box Addon & Discount)”

### VAL-257: New Fixed Line Tablet – Number Selection Step - Free/Available number selection
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS:Reservation Token:15332434(SBL-EXL-00151) / SUCCESS:Reservation Token:15332436(SBL-EXL-00151)"
- **Source reference:** [FLD-312]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “two free numbers offered — 41224335 (QR0.00, selected) and 41224278 (QR0.00) — tabs Free Number / Reserved Number. Reserve button; dialog SUCCESS:Reservation Token:15332434(SBL-EXL-00151) (Combo Box Step 5 Number Selection + Reservation success alert)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Number 41224278 shown at QR0.00, selected (red border) and Reserve clicked. SUCCESS:Reservation Token:15332436(SBL-EXL-00151) (Non Combo Box Number Selection)”

### VAL-258: New Fixed Line Tablet – Booking Confirmation Dialogs - Booking cancel warning / booking success message
`Explicit` · confidence: `high`

- **Description:** Error message: "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment; "Appointment has been successfully booked...Appointment ID is 14241" / "...Appointment ID is 14243""
- **Source reference:** [FLD-314]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"WARNING: Appointment once booked cannot be cancelled..." OK/Cancel; "Appointment has been successfully booked...Appointment ID is 14241" OK (Combo Box Booking warning/success dialogs)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"WARNING: Appointment once booked cannot be cancelled..." agent clicks OK; "Appointment has been successfully booked...Appointment ID is 14243" (Non Combo Box Booking warning/success)”

### VAL-259: New Fixed Line Tablet – Order Completion Dialog - Order completion message
`Explicit` · confidence: `high`

- **Description:** Error message: ""Fixed Line completed successfully. Order Number:- '1-29795175561'" / "...'1-29795232313'""
- **Source reference:** [FLD-319]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"Fixed Line completed successfully. Order Number:- '1-29795175561'" — Finish Process button (Combo Box Final completion dialog)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Final confirmation popup: "Fixed Line completed successfully. Order Number:- '1-29795232313'" with Finish Process button (Non Combo Box Order completion)”

### VAL-260: Tablet Non Combo Box Normal Activation – Contact warning - Customer already refused service warning
`Explicit` · confidence: `high`

- **Description:** Error message: "Customer already refused the service."
- **Source reference:** [FLD-325]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “the UI displays a warning: "Customer already refused the service." (a pre-existing flag ... not a blocking error)”

### VAL-261: Tablet Non Combo Box Normal Activation – Contact ID capture - ID Type / ID Number
`Explicit` · confidence: `high`

- **Description:** Confirmed valid via green check
- **Source reference:** [FLD-326]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Agent selects ID Type = "Qatari ID" and enters ID Number = 28060820901, with barcode/scan icon and a green check confirming the ID is valid”

### VAL-262: Tablet Non Combo Box Normal Activation – Order Correction resubmit confirmation - Resubmission confirmation message
`Explicit` · confidence: `high`

- **Description:** Error message: "Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval"
- **Source reference:** [FLD-331]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Popup: "Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval"”

### VAL-263: Tablet Non Combo Box Normal Activation – Approve Order modal - Approve Order confirmation checkbox/comment
`Explicit` · confidence: `high`

- **Description:** Error message: "By clicking submit, I agree that I have verified all the documents and details to proceed with submission."
- **Source reference:** [FLD-332]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Approve Order": "By clicking submit, I agree that I have verified all the documents and details to proceed with submission." Comments field filled with Approved”

### VAL-264: New Fixed Line Tablet - Step 1 Contact (Kahramaa lookup) - Kahramaa ID
`Explicit` · confidence: `high`

- **Description:** appears to trigger backend lookup on Go/search icon
- **Source reference:** [FLD-335]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Field "Please enter Kahramaa & Contact ID:" with "Kahramaa ID" = `16P6109` and a search/go icon”

### VAL-265: New Fixed Line Tablet - Step 1 Contact (ID capture) - ID Number
`Explicit` · confidence: `high`

- **Description:** validated via barcode scan, shows green checkmark when valid
- **Source reference:** [FLD-339]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"ID Number" = `27579200746` with a barcode-scan icon and a green checkmark (validated)”

### VAL-266: New Fixed Line Tablet - Step 1 Contact profile fields - Get IPTV ?
`Explicit` · confidence: `high`

- **Description:** required field, highlighted with a red box in the screenshot
- **Source reference:** [FLD-348]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Get IPTV ?" (required field, highlighted with a red box in the screenshot) = No selected”

### VAL-267: New Fixed Line Tablet - Step 1 Contact profile fields - Email
`Explicit` · confidence: `high`

- **Description:** validated (green check)
- **Source reference:** [FLD-349]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Email now shows `nobill@vodafone.com` (validated, green check)”

### VAL-268: New Fixed Line Tablet - Step 1 Contact profile fields - Language
`Explicit` · confidence: `high`

- **Description:** validated
- **Source reference:** [FLD-351]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Language English (validated)”

### VAL-269: New Fixed Line Tablet - Step 1 Contact profile fields - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** must be local mobile number Error message: "This is a notification contact. Please enter a local mobile number."
- **Source reference:** [FLD-352]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Alt. phone # `97455667766` with note "This is a notification contact. Please enter a local mobile number."”

### VAL-270: New Fixed Line Tablet - Step 1 Contact attachments - Qatari ID-Front
`Explicit` · confidence: `high`

- **Description:** required, must be uploaded
- **Source reference:** [FLD-353]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two required uploaded-photo placeholders both show green checkmarks: "Qatari ID-Front" and "Qatari ID-Back"”

### VAL-271: New Fixed Line Tablet - Step 1 Contact attachments - Qatari ID-Back
`Explicit` · confidence: `high`

- **Description:** required, must be uploaded
- **Source reference:** [FLD-354]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Qatari ID-Back"”

### VAL-272: New Fixed Line Tablet - Step 5 Number Selection - Number Reserve confirmation
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS:Reservation Token:15332433(SBL-EXL-00151)"
- **Source reference:** [FLD-367]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “System confirms: "SUCCESS:Reservation Token:15332433(SBL-EXL-00151)"”

### VAL-273: New Fixed Line Tablet - Step 7 CAF & Additional Attachments (B2B2C) - Proof of Employment
`Explicit` · confidence: `high`

- **Description:** required for B2B2C, must be completed before Continue enabled
- **Source reference:** [FLD-368]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 requires Proof of Employment* (required, B2B2C-specific), CAF* (auto-generated/required)... Both Proof of Employment and CAF are uploaded/completed (green checkmarks) before Continue is enabled”

### VAL-274: Order Approval - Approve Order modal - Approve Order Comments
`Explicit` · confidence: `high`

- **Description:** Error message: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission"
- **Source reference:** [FLD-370]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Manager clicks Approve → "Approve Order" modal: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission". Comments entered: "B2B2C - Zero Touch - Approved"”

### VAL-275: New Fixed Line Tablet - Step 4 Addon & Discount - Select Add-on / Select IPTV Add-on / Select Discount
`Explicit` · confidence: `high`

- **Description:** if there are no applicable add-on or discount, the selector will be empty
- **Source reference:** [FLD-371]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Select applicable add-on and discount based on customer's plan" with buttons Select Add-on / Select IPTV Add-on / Select Discount... Note: "if there are no applicable add-on or discount, the selector will be empty."”

### VAL-276: New Fixed Line Tablet - Step 6 Book Appointment - Time slot
`Explicit` · confidence: `high`

- **Description:** capacity-limited (slots can be full)
- **Source reference:** [FLD-376]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “time-slot pills 8AM–11AM (selected), 11AM-2PM, 2PM-5PM, 5PM-8PM”

### VAL-277: New Fixed Line Tablet - Step 6 Book Appointment submit - Appointment cancel warning
`Explicit` · confidence: `high`

- **Description:** Error message: "WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment"
- **Source reference:** [FLD-378]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “a warning dialog appears: "WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment" (OK / Cancel)”

### VAL-278: Rejection SMS (system-generated) - SMS notification text
`Explicit` · confidence: `high`

- **Description:** Error message: "New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."
- **Source reference:** [FLD-382]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “CharacteristicsValue characteristicName="SMSTXT" with Value: "New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

### VAL-279: FWA Desktop Vanilla - Contact/Mobile Eligibility - Cellular Phone #
`Explicit` · confidence: `high`

- **Description:** temporary-number rule for non-resident ID Error message: "This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."
- **Source reference:** [FLD-389]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “System warning dialog: "This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."”

### VAL-280: FWA Desktop Vanilla - Numbers tab - Number Reservation confirmation
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS: Reservation Token:13758017(SBL-EXL-00151)"
- **Source reference:** [FLD-397]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “system dialog confirms "SUCCESS: Reservation Token:13758017(SBL-EXL-00151)"”

### VAL-281: FWA Outdoor WFM - Book Appointments dialog - Date/time slot grid
`Explicit` · confidence: `high`

- **Description:** capacity-limited Error message: "Full"
- **Source reference:** [FLD-402]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “On 09/07/2025, the 8AM-11AM and 11AM-2PM slots show "Full" (red)”

### VAL-282: FWA Outdoor WFM - OFS Installation Checklist - Wi-Fi User name's for 2.5G and 5G network (NO password)
`Explicit` · confidence: `high`

- **Description:** NO password should be entered
- **Source reference:** [FLD-404]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Wi-Fi User name's for 2.5G and 5G network (NO password)" = Vishak”

### VAL-283: FWA negative scenarios - Address step / FWA Address (Step 2) - Zone
`Explicit` · confidence: `high`

- **Description:** required field; required to save address Error message: "Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area / Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit, Area — or click Skip Address to proceed without Saving Address."
- **Source reference:** [FLD-421]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “On step "2. Address" with Zone, Street No., Building No., Apt/Flat/Unit, and Area all empty, clicking Save Address produces a modal dialog: "Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Submitting with empty fields triggers dialog: Please enter required fields...”

### VAL-284: FWA negative scenarios - Address step - Street No.
`Explicit` · confidence: `high`

- **Description:** numeric, max 5 characters Error message: "Please enter an numeric Street No. of 5 characters or less."
- **Source reference:** [FLD-422]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Street No. changed to "5666666" (7 numeric characters, over the 5-character limit)... Please enter an numeric Street No. of 5 characters or less.”

### VAL-285: FWA negative scenarios - Address step - Building No.
`Explicit` · confidence: `high`

- **Description:** numeric only, max 5 characters Error message: "Please enter an numeric Building No. of 5 characters or less."
- **Source reference:** [FLD-423]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Building No.="67K" (contains a letter)... Please enter an numeric Building No. of 5 characters or less.”

### VAL-286: FWA negative scenarios - Address step - Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Description:** required
- **Source reference:** [FLD-424]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Apt/Flat/Unit=78B”

### VAL-287: FWA negative scenarios - Address step - Area
`Explicit` · confidence: `high`

- **Description:** required
- **Source reference:** [FLD-425]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Area=Al Rayyan”

### VAL-288: FWA Postpaid Business - Address step (Skip variant) - Skip Address option
`Explicit` · confidence: `high`

- **Description:** Error message: "Please enter required fields
Zone, Street No., Building No., Apt/Flat/Unit, Area
or click Skip Address to proceed without Saving Address."
- **Source reference:** [FLD-426]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “the modal here offers an escape hatch not present in the Tablet flow: "...or click Skip Address to proceed without Saving Address."”

### VAL-289: FWA negative scenarios - SIM Serial step - SIM Serial
`Explicit` · confidence: `high`

- **Description:** must be 19 digits; must exist and not already be assigned in UIM Error message: "Please enter a valid SIM Serial before pressing 'Continue'. / Error: SIM Serial # must be 19 digits. / SIM Card does not exist in UIM(SBL-EXL-00151) / SIM Card already assigned in UIM(SBL-EXL-00151)"
- **Source reference:** [FLD-427]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “SIM Serial entered as "894270280080119030" (18 digits). An inline field-level error appears next to the SIM Serial box: "Error: SIM Serial # must be 19 digits."”

### VAL-290: FWA negative scenarios - SIM Serial step - CPE Serial Number
`Explicit` · confidence: `high`

- **Description:** must be free/not-assigned in UIM Error message: "Please enter a valid CPE Serial before pressing 'Continue'. / CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)"
- **Source reference:** [FLD-428]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “CPE Serial Number "S180P18055025" (green-checked, "Validating Order, please wait..." spinner active), Continue returns a native alert exposing an unhandled backend exception trace”

### VAL-291: FWA negative scenarios - CAF & Additional Attachments step - Supplementary Form
`Explicit` · confidence: `high`

- **Description:** must be selected before Continue Error message: "Error: Please select Supplementary Form before continuing."
- **Source reference:** [FLD-429]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “the "Supplementary Form" tile (marked mandatory with a red asterisk, alongside "Add File") is still empty/greyed out. Clicking Continue produces an inline banner: "Error: Please select Supplementary Form before continuing."”

### VAL-292: FWA Contact (Step 1) - Qatari ID / Qatari Id (insert or scan)
`Explicit` · confidence: `high`

- **Description:** Must resolve a valid ID via lookup (Go button); validated (green check)
- **Source reference:** [FLD-430]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Agent is prompted: "Please insert or scan the customer's Qatari Id:" and enters Qatari ID 27652419981, validated (green check)”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent enters Qatari ID 29158603076, clicks Go.”

### VAL-293: Open UI Desktop FWA Indoor - Step 1 Contact / FWA Contact — Connection Details popup - Connection Details popup (Total Prepaid/Postpaid Connections)
`Explicit` · confidence: `high`

- **Description:** Triggers advisory note when Postpaid connections count >=2 Error message: "Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"
- **Source reference:** [FLD-431]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A "Connection Details" popup appears automatically: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 1", with a "Show Postpaid Plan Details" link”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Total Number of Prepaid Connections: 0, Total Number of Postpaid Connections: 0”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Total Number of Postpaid Connections: 2 ... Note - Customer already has 2 or more Post-paid connections...”

### VAL-294: Open UI Desktop FWA Indoor - Step 1 Contact - Advance payment banner
`Explicit` · confidence: `high`

- **Description:** Error message: "(HRN) Customer needs to pay advance payment of QR 100."
- **Source reference:** [FLD-433]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “An informational banner appears: "(HRN) Customer needs to pay advance payment of QR 100."”

### VAL-295: FWA Contact (Step 1) / Open UI Desktop FWA Indoor - Step 1 Contact Attachments - Attachment upload — Qatari ID-Front / Qatari ID-Back
`Explicit` · confidence: `high`

- **Description:** Green check on successful upload
- **Source reference:** [FLD-434]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “An Attachments section requires an uploaded document (a file "Vishakan_QID_Front.JPG" is shown attached) via the Upload button”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Attachments section: uploaded "Vishakan_QID_Front.JPG".”

### VAL-296: Open UI Desktop FWA Indoor - Order submission popup - Switch-to-151 instruction
`Explicit` · confidence: `high`

- **Description:** Error message: "Advise customer to send switch to 151"
- **Source reference:** [FLD-436]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A popup instructs: "Advise customer to send switch to 151" (OK button)”

### VAL-297: Open UI Desktop FWA Indoor - CAF signature confirmation - Customer notification confirmation
`Explicit` · confidence: `high`

- **Description:** Error message: "Notify customer that a copy of the CAF will be sent to his registered email address."
- **Source reference:** [FLD-437]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “a browser alert states: "Notify customer that a copy of the CAF will be sent to his registered email address." (OK button)”

### VAL-298: FWA Contact (Step 1) - Email
`Explicit` · confidence: `high`

- **Description:** Format validated (green check)
- **Source reference:** [FLD-443]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Email "noemailid@vodafone.com" (validated)”

### VAL-299: FWA Contact (Step 1) - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** Format validated (green check)
- **Source reference:** [FLD-446]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Alt. phone # 97412341234”

### VAL-300: FWA Contact (Step 1) - Company Name
`Explicit` · confidence: `high`

- **Description:** Autocomplete against existing companies
- **Source reference:** [FLD-447]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Agent types Company Name "TestVQW" into an autocomplete dropdown (other matches shown...) and selects TestVQW”

### VAL-301: FWA Address (Step 2) - Street No.
`Explicit` · confidence: `high`

- **Description:** Required to save address Error message: "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit., Area"
- **Source reference:** [FLD-449]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Submitting empty triggers dialog: "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent fills Zone: 11, Street No.: 44, Building No.: 77”

### VAL-302: FWA Address (Step 2) - Building No.
`Explicit` · confidence: `high`

- **Description:** Required to save address Error message: "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area (via shared Address step validation)"
- **Source reference:** [FLD-450]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent fills Zone: 11, Street No.: 44, Building No.: 77”

### VAL-303: FWA Address (Step 2) - Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Description:** Required to save address
- **Source reference:** [FLD-451]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Apt/Flat/Unit: 99V”

### VAL-304: FWA Address (Step 2) - Area
`Explicit` · confidence: `high`

- **Description:** Required to save address
- **Source reference:** [FLD-452]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Area "Al Rayyan" (dropdown)”

### VAL-305: FWA SIM Serial (Step 6) - SIM Serial
`Explicit` · confidence: `high`

- **Description:** Must be exactly 19 digits; must not be blank; must not already exist / must be valid & unassigned in UIM; must not already be assigned in UIM Error message: "Please enter a valid SIM Serial before pressing 'Continue'. / Error: SIM Serial # must be 19 digits. / SIM Card does not exist in UIM(SBL-EXL-00151) / SIM Card already assigned in UIM(SBL-EXL-00151)"
- **Source reference:** [FLD-458]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Empty submit → "Please enter a valid SIM Serial before pressing 'Continue'."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “image15: Inline error — "Error: SIM Serial # must be 19 digits." for entry 894270280080119030 (18 digits).”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “image14: JS alert dialog — "SIM Card does not exist in UIM(SBL-EXL-00151)"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “a browser alert fires: "SIM Card already assigned in UIM(SBL-EXL-00151)".”

### VAL-306: FWA SIM Serial (Step 6) - CPE Serial Number
`Explicit` · confidence: `high`

- **Description:** Must not be blank; must be free/unassigned in UIM Error message: "Please enter a valid CPE Serial before pressing 'Continue'. / This field is required. / Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162) / CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151) / Please Contact the System Administrator with Reference # 1-DNN25H2.(SBL-EXL-00151)"
- **Source reference:** [FLD-459]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “CPE-only filled (S180P18055021) → SIM Serial cleared → "Please enter a valid CPE Serial before pressing 'Continue'.", field-level "This field is required."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “detailed error dialog: "Error invoking service 'VFQA Error Handling Service'...CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)...Reference # 1-DNN25H2."”

### VAL-307: FWA Book Appointment (Step 7) - Time slot
`Explicit` · confidence: `high`

- **Description:** Some slots disabled based on availability
- **Source reference:** [FLD-461]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Time slots: 8AM-11AM selected (11AM-2PM, 2PM-5PM, 5PM-8PM disabled).”

### VAL-308: FWA Book Appointment (Step 7) - Submit confirmation
`Explicit` · confidence: `high`

- **Description:** Cannot be cancelled once booked Error message: "WARNING: Appointment once booked cannot be cancelled. Click "OK" to continue or "Cancel" to select another appointment"
- **Source reference:** [FLD-463]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “On Submit, browser confirm dialog: WARNING: Appointment once booked cannot be cancelled...”

### VAL-309: FWA Book Appointment (Step 7) - Book Unscheduled Appointment confirmation
`Explicit` · confidence: `high`

- **Description:** Cannot be cancelled within the journey once booked Error message: "WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue."
- **Source reference:** [FLD-464]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Choosing "Book Unscheduled Appointment" triggers a browser-style confirm dialog...WARNING: Once unscheduled appointment is booked...”

### VAL-310: FWA CAF (Step 8) — Section 4 Superfast Broadband & Home Phone - Landline Number / Plan Name / Appointment Details / Signature
`Explicit` · confidence: `high`

- **Description:** Must be signed before continuing (Sign Contract flow)
- **Source reference:** [FLD-469]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Section 4 – Superfast Broadband & Home Phone: Landline Number 97441202301; Plan Name...; Appointment Details "Appointment ID: Appointment Date: -" (blank at this point); Signature blank.”

### VAL-311: FWA CAF (Step 8) attachments - Proof of Employment
`Explicit` · confidence: `high`

- **Description:** Required in B2B2C scenario before continuing Error message: "Error: Please select Proof of Employment before continuing."
- **Source reference:** [FLD-470]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Attachment tiles then appear: Proof of Employment* (required)... "Error: Please select Proof of Employment before continuing."”

### VAL-312: FWA CAF (Step 8) attachments - Supplementary Form
`Explicit` · confidence: `high`

- **Description:** Required before continuing Error message: "Error: Please select Supplementary Form before continuing."
- **Source reference:** [FLD-471]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Red banner: "Error: Please select Supplementary Form before continuing."”

### VAL-313: WFM Serial Number Check - Dual Play - CPE Indoor serial
`Explicit` · confidence: `high`

- **Description:** Validated against inventory
- **Source reference:** [FLD-478]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Fields (with barcode-scan icons): CPE Indoor 2EQTE24314000127, CPE Outdoor S180P18075127, SIM Card 8942702800801190325. All validated (green checks).”

### VAL-314: WFM Serial Number Check - Dual Play - CPE Outdoor serial
`Explicit` · confidence: `high`

- **Description:** Validated against inventory
- **Source reference:** [FLD-479]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “CPE Outdoor S180P18075127”

### VAL-315: WFM Serial Number Check - Dual Play - SIM Card serial
`Explicit` · confidence: `high`

- **Description:** Validated against inventory
- **Source reference:** [FLD-480]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “SIM Card 8942702800801190325”

### VAL-316: WFM Assess Activity — Kahramaa check - Kahrama ID duplicate check result
`Explicit` · confidence: `high`

- **Description:** Checks last 30 days Error message: "No previous records are found based on Kahrama ID in last 30 days."
- **Source reference:** [FLD-484]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Dialog on OFSC plugin domain: "No previous records are found based on Kahrama ID in last 30 days."”

### VAL-317: WFM Installation Checklist - Wi-Fi User name's for 2.5G and 5G network (NO password)
`Explicit` · confidence: `high`

- **Description:** Must not include password
- **Source reference:** [FLD-486]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Wi-Fi User name's for 2.5G and 5G network (NO password)" = Vishak”

### VAL-318: VFQ Inventory Loading Excel - Inventory Type
`Explicit` · confidence: `high`

- **Description:** Values from a fixed list Error message: "Please Choose Values from the List"
- **Source reference:** [FLD-498]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Inventory Type column (dropdown "Please Choose Values from the List")”

### VAL-319: MNP Postpaid Contact (Step 1) - Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date
`Explicit` · confidence: `high`

- **Description:** Green check confirms validity on lookup
- **Source reference:** [FLD-499]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “fields Qatari ID 29035654458, Id expiry 5/11/2027, Nationality Indian, Gender M, First name VISHAKAN, Last name SOUNDARARAJAN, Birth date 7/3/1990”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Please insert or scan the customer's Qatari Id: field Qatari ID = 29035654458, a green check confirming validity”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “read-only fields: Qatari ID 29035654458, Id expiry 4/21/2026”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Gender M”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “First name Vishakan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Last name Soundararajan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Birth date 3/7/1990”

### VAL-320: MNP Postpaid Contact (Step 1) - Email
`Explicit` · confidence: `high`

- **Description:** Green checkmark validation
- **Source reference:** [FLD-501]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Email c.vishakan@maveric-system..., No Email unchecked, Preferred Language English, Alt. phone # 97431345716”

### VAL-321: Home Move — KID entry screen - KID (location identifier the user is moving to)
`Explicit` · confidence: `high`

- **Description:** Triggers Fiber-readiness check
- **Source reference:** [FLD-508]
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Enter the KID the user is moving to and click Go; system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"”

### VAL-322: Home Move — Activity Portal - Comments
`Explicit` · confidence: `high`

- **Description:** Comments field should have more than 5 characters Error message: "comments >5 characters"
- **Source reference:** [FLD-510]
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “note states "Comments field should have more than 5 characters"”

### VAL-323: Home Move — WFM Assess Activity - KID eligibility for Home Move (validation popup)
`Explicit` · confidence: `high`

- **Description:** Checks whether KID is eligible for Home Move
- **Source reference:** [FLD-513]
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

### VAL-324: MNP Postpaid – Contact - Email
`Explicit` · confidence: `high`

- **Description:** Green check confirms validity; on tablet variant email may be auto-filled with a placeholder address (e.g. noemailid@vodafone.com) when a 'No Email' checkbox is ticked
- **Source reference:** [FLD-519]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Email nobill@vfq.com (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Email field auto-filled with noemailid@vodafone.com (green check), checkbox 'No Email' ticked”

### VAL-325: MNP Postpaid – Contact - Preferred Language / Language
`Explicit` · confidence: `high`

- **Description:** Green check on selection (tablet variant)
- **Source reference:** [FLD-520]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Preferred Language English (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Language = English (green check)”

### VAL-326: MNP Postpaid – Contact - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** green check confirms validity
- **Source reference:** [FLD-521]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Alt. phone # 97412341234 (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Alt. phone # = 97412341234 (green check)”

### VAL-327: MNP Postpaid – SIM Serial - SIM Serial
`Explicit` · confidence: `high`

- **Description:** Green check on scan/entry
- **Source reference:** [FLD-528]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Please enter or scan the SIM Serial number below. Field SIM Serial = 8942702400000026363, green check”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field SIM Serial = 8942702400000026214 with green check”

### VAL-328: MNP Postpaid – Plan detail modal - Smart Limit
`Explicit` · confidence: `high`

- **Description:** Bill Limit can not be set lower than Agent Minimum 50 Error message: "Bill Limit can not be set lower than Agent Minimum 50"
- **Source reference:** [FLD-529]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent types 28 into the Smart Limit input and clicks Go → validation message appears: 'Bill Limit can not be set lower than Agent Minimum 50'”

### VAL-329: MNP Postpaid – Donor Details - Port-in Number
`Explicit` · confidence: `high`

- **Description:** green check
- **Source reference:** [FLD-531]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Port-in Number 97466000666 (green check)”

### VAL-330: MNP Postpaid – Donor Details - Donor ID
`Explicit` · confidence: `high`

- **Description:** green check
- **Source reference:** [FLD-532]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Donor ID 893093 (green check)”

### VAL-331: MNP Tablet Postpaid – Contact - Qatari ID
`Explicit` · confidence: `high`

- **Description:** green check mark
- **Source reference:** [FLD-548]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field Qatari ID = 28952431523 with a green check mark”

### VAL-332: MNP Donor Details (Postpaid/Prepaid MNP journeys) - Port-in Number
`Explicit` · confidence: `high`

- **Description:** green check appears on valid entry
- **Source reference:** [FLD-556]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Port-in Number = 97466667890 (green check)”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Fields: Port-in Number 97466000534, Donor ID Type = Passport”

### VAL-333: MNP Donor Details (Postpaid/Prepaid MNP journeys) - Donor ID
`Explicit` · confidence: `high`

- **Description:** green check appears on valid entry
- **Source reference:** [FLD-557]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Donor ID = BV7383 (green check)”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Donor ID KJSH0934989, Donor Type = Consumer”

### VAL-334: MNP Donor Details (Postpaid/Prepaid MNP journeys) - Donor ID Type / Donor Operator
`Explicit` · confidence: `low`

- **Description:** Error message: "Note: Make sure correct information is provided to avoid rejection of request."
- **Source reference:** [FLD-558]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Donor ID Type = Passport”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Donor Operator = Qtel (greyed/read-only); Note: Make sure correct information is provided to avoid rejection of request.”

### VAL-335: MNP Donor Details (Postpaid/Prepaid MNP journeys) - Subscription Type
`Explicit` · confidence: `high`

- **Description:** Error message: "Note: Make sure correct information is provided to avoid rejection of request."
- **Source reference:** [FLD-559]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Subscription Type = Postpaid with info note 'Enter your service type from other operator.'; Note: Make sure correct information is provided to avoid rejection of request.”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Subscription Type = Prepaid, with helper text 'Enter your service type from other operator.'”

### VAL-336: MNP Prepaid – Contact - ID Number
`Explicit` · confidence: `high`

- **Description:** case sensitive; barcode-scan icon supported
- **Source reference:** [FLD-566]
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “ID Number field (case sensitive) with a barcode-scan icon. Agent enters ID Number 27381804401, clicks Go”

### VAL-337: MNP Prepaid – SIM Serial - SIM Serial
`Explicit` · confidence: `high`

- **Description:** green check appears, then status message 'SIM Serial check and number reservation in progress. Please wait...'
- **Source reference:** [FLD-570]
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Agent enters 8942702400000027026, green check appears, then status message 'SIM Serial check and number reservation in progress. Please wait...'”

### VAL-338: Prepaid Customer Application Form (CAF) - Valid Qatari ID/RP Number / Passport Number
`Explicit` · confidence: `high`

- **Description:** data-binding gap observed in this build (field displayed literal value 'undefined')
- **Source reference:** [FLD-571]
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Valid Qatari ID/RP Number / Passport Number' shows literal value 'undefined' (a data-binding gap in this build — flagged, not glossed over)”

### VAL-339: Lead Details View (Fixed) - Reject Reason Code
`Explicit` · confidence: `high`

- **Description:** shown invalid/empty, outlined red when required and not filled
- **Source reference:** [FLD-581]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “required Reject Reason Code dropdown (shown invalid/empty, outlined red) and Reject Comment text field”

### VAL-340: Lead Details View (Lead Edit, Owner Change / Mobile lead) - CallBack Date/Time
`Explicit` · confidence: `high`

- **Description:** After entering value, Lead Status changes from New to In Progress and Lead Sub Status becomes Call Back (auto-transition)
- **Source reference:** [FLD-586]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “date/time picker opens on the CallBack Date/Time field: December 2025 calendar, day 4 highlighted (green)”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “a date/time picker: month/year selectors (Nov 2025), a day grid with 20 selected, a 'Time' readout '03:16:00 PM'”

### VAL-341: Lead Details View (Lead Edit, Owner Change / Mobile lead) - Lead Status
`Explicit` · confidence: `high`

- **Description:** Changes from 'New' to 'In Progress' upon CallBack Date/Time entry; dropdown options: Accepted, Assigned, In Progress, Lead Converted, New, Rejected, Retired, Submitted
- **Source reference:** [FLD-587]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Lead Status: New ... changes from 'New' to 'In Progress'”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Lead Status dropdown opened; options: Accepted, Assigned, In Progress (selected), Lead Converted, New, Rejected, Retired, Submitted”

### VAL-342: Cross Sales Contact - Please insert or scan the customer's Qatari Id:
`Explicit` · confidence: `high`

- **Description:** Verified with green checkmark on valid ID
- **Source reference:** [FLD-607]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Please insert or scan the customer's Qatari Id:' field populated with 29735617987, verified with a green checkmark.”

### VAL-343: Cross Sales - Connection Details modal - Total Number of Postpaid Connections
`Explicit` · confidence: `high`

- **Description:** Triggers warning banner when >=2 Error message: "Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"
- **Source reference:** [FLD-610]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Total Number of Postpaid Connections: 2', with note: 'Note - Customer already has 2 or more Post-paid connections...'”

### VAL-344: Postpaid Contact (post cross-sell handoff) - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** Has own verification checkbox
- **Source reference:** [FLD-619]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Alt. phone # with its own checkbox”

### VAL-345: Address (New Postpaid wizard) - Zone
`Explicit` · confidence: `high`

- **Description:** Skip Address allowed
- **Source reference:** [FLD-620]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '2. Address' expanded with empty fields: Zone, Street No., Building No., Apt/Flat/Unit; buttons Save Address / Skip Address / Cancel / Go Back”

### VAL-346: Address (New Postpaid wizard) - Street No.
`Explicit` · confidence: `high`

- **Description:** Skip Address allowed
- **Source reference:** [FLD-621]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

### VAL-347: Address (New Postpaid wizard) - Building No.
`Explicit` · confidence: `high`

- **Description:** Skip Address allowed
- **Source reference:** [FLD-622]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

### VAL-348: Address (New Postpaid wizard) - Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Description:** Skip Address allowed
- **Source reference:** [FLD-623]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

### VAL-349: Number Selection (New Postpaid wizard) - Reservation success alert
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)"
- **Source reference:** [FLD-630]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “native browser alert reads: 'SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)'”

### VAL-350: SIM Serial (New Postpaid wizard) - SIM Serial number
`Explicit` · confidence: `high`

- **Description:** Verified with green checkmark
- **Source reference:** [FLD-631]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Please enter or scan the SIM Serial number below.' SIM Serial: 8942702111338839146, verified (green check).”

### VAL-351: Payment (New Postpaid wizard) - Reason
`Explicit` · confidence: `high`

- **Description:** Used for FREE type sales
- **Source reference:** [FLD-634]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Number' panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown set to 'For Testing Only'”

### VAL-352: Payment (New Postpaid wizard) - Generate CAF
`Explicit` · confidence: `high`

- **Description:** Triggers 'Validating Order, please wait...'
- **Source reference:** [FLD-635]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Generate CAF' button... 'Validating Order, please wait...' status line”

### VAL-353: CAF step (New Postpaid wizard) - New File (attachment upload)
`Explicit` · confidence: `high`

- **Description:** At least one attached in example
- **Source reference:** [FLD-636]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'New File' upload control, one file already attached — 'PPVT TESTING SAMPLE.pdf' (with delete icon)”

### VAL-354: Activity (final wrap-up step) - Comments
`Explicit` · confidence: `high`

- **Description:** Needed before Save and Finish
- **Source reference:** [FLD-644]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “empty Comments box with helper text: 'Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.'”

### VAL-355: Order completion confirmation - Postpaid completed successfully message
`Explicit` · confidence: `high`

- **Description:** Error message: "Postpaid completed successfully. Order Number:- '1-225217281463'"
- **Source reference:** [FLD-646]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A confirmation popup reads: 'Postpaid completed successfully. Order Number:- '1-225217281463''”

### VAL-356: Product Promotions admin - Bill Limit Mapping / Spend Limit Mapping applet - Agent Min Value
`Explicit` · confidence: `high`

- **Description:** Used as floor for agent-entered Bill Limit / SL Limit Amount at order time
- **Source reference:** [FLD-652]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Agent Min Value field is being edited — highlighted/selected showing '80' (raised from a prior value)”

### VAL-357: Bill Limit Mobile Plus - Customize detail panel - SL Limit Amount
`Explicit` · confidence: `high`

- **Description:** Must not be lower than product's Agent Min Value or order validation fails (SBL-EXL-00151) Error message: "Bill Limit can not be set lower than Agent Minimum 80
Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)"
- **Source reference:** [FLD-666]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Limit Amount = 75, SL Min Value = .01, SL Default Value = 20... 'Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)'”

### VAL-358: Order header (Validate action) - Validate button
`Explicit` · confidence: `high`

- **Description:** Fires informational + blocking dialogs based on bill-limit rules Error message: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."
- **Source reference:** [FLD-669]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Clicking 'Validate' on the order header... produces a browser dialog... 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

### VAL-359: Retail New Postpaid - Bill Limit edit - Bill Limit value
`Explicit` · confidence: `medium`

- **Description:** Below Agent minimum value blocks the journey; above Agent minimum value allows journey to proceed
- **Source reference:** [FLD-670]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “'When agent enters below Agent minimum value' ... 'When agent enters above Agent minimum value, user can proceed the journey'”

### VAL-360: HRN New Postpaid - Connection Details modal - HRN advance payment notice
`Explicit` · confidence: `high`

- **Description:** Triggered for HRN (high-risk-nationality) customers Error message: "(HRN) Customer needs to pay advance payment of QR 100."
- **Source reference:** [FLD-673]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “info banner: '(HRN) Customer needs to pay advance payment of QR 100.'”

### VAL-361: HRN New Postpaid - Number Selection - Reservation success alert
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS:Reservation Token:15632489(SBL-EXL-00151)"
- **Source reference:** [FLD-674]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “a JS confirm alert reads: 'SUCCESS:Reservation Token:15632489(SBL-EXL-00151)'”

### VAL-362: B2B2C With Approval - Step1 Contact confirmation - Lead/Opportunity ID
`Explicit` · confidence: `high`

- **Description:** blank in example
- **Source reference:** [FLD-683]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Lead/Opportunity ID (blank), Company Name (dropdown, blank at first), Digital Lead/Sale = No”

### VAL-363: B2B2C With Approval - Step1 Contact confirmation - Company Name
`Explicit` · confidence: `high`

- **Description:** required for B2B2C linkage
- **Source reference:** [FLD-684]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “agent opens the Company Name selector; options shown: '01 newfreedcn01_Test', '01 querybar01', 'TestVQW'. Agent selects '01 newfreedcn01_Test'”

### VAL-364: B2B2C With Approval - Step1 Contact confirmation - Email
`Explicit` · confidence: `high`

- **Description:** red asterisk mandatory marker
- **Source reference:** [FLD-686]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Email, No Email, Language, Alt. phone # fields appear below, each marked mandatory (red asterisk)... Email = noemailid@vodafone.com”

### VAL-365: B2B2C With Approval - Step1 Contact confirmation - Language
`Explicit` · confidence: `high`

- **Description:** red asterisk mandatory marker
- **Source reference:** [FLD-688]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Language = English, Alt. phone # = 97412341234”

### VAL-366: B2B2C With Approval - Step1 Contact confirmation - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** red asterisk mandatory marker
- **Source reference:** [FLD-689]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Alt. phone # = 97412341234”

### VAL-367: B2B2C With Approval - Step5 Number Selection - Reserve button / confirmation alert
`Explicit` · confidence: `high`

- **Description:** Error message: "10.162.53.100:4443 says — SUCCESS:Reservation Token:13757449(SBL-EXL-00151)"
- **Source reference:** [FLD-696]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “native browser alert — '10.162.53.100:4443 says — SUCCESS:Reservation Token:13757449(SBL-EXL-00151)'”

### VAL-368: B2B2C With Approval - Step7 CAF & Additional Attachments - Proof of Employment
`Explicit` · confidence: `high`

- **Description:** required for B2B2C flow
- **Source reference:** [FLD-700]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Proof of Employment' (required, red asterisk) and 'CAF' both shown captured with green checkmarks”

### VAL-369: B2B2C With Approval - Submission confirmation - Submitted for approval message
`Explicit` · confidence: `high`

- **Description:** Error message: "Your activation request order number: 1-29710853118 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."
- **Source reference:** [FLD-702]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “A dialog reads verbatim: 'Your activation request order number: 1-29710853118 is submitted for approval...'”

### VAL-370: B2B2C With Approval - Approve Order modal - Approve confirmation text
`Explicit` · confidence: `high`

- **Description:** Error message: "By clicking submit, I agree that I have verified all the documents and details to proceed with submission."
- **Source reference:** [FLD-706]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “a confirmation dialog reads: 'By clicking submit, I agree that I have verified all the documents and details to proceed with submission.'”

### VAL-371: B2B2C Without Approval - Step7 CAF & Additional Attachments - Proof of Employment
`Explicit` · confidence: `high`

- **Description:** Blocks Continue until provided Error message: "Error: Please select Proof of Employment before continuing."
- **Source reference:** [FLD-713]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Error banner: 'Error: Please select Proof of Employment before continuing.' — Proof of Employment is a hard-required attachment for this B2B2C flow.”

### VAL-372: B2B2C Without Approval - Order completion confirmation - Postpaid completed successfully message
`Explicit` · confidence: `high`

- **Description:** Error message: "Postpaid completed successfully. Order Number:- '1-29726606734'"
- **Source reference:** [FLD-715]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “System modal reads verbatim: 'Postpaid completed successfully. Order Number:- '1-29726606734''”

### VAL-373: HRN Credit Limit (Tablet) - Number Selection - Reservation success alert
`Explicit` · confidence: `high`

- **Description:** Error message: "SUCCESS:Reservation Token:15557466(SBL-EXL-00151)"
- **Source reference:** [FLD-721]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Browser alert: 'SUCCESS:Reservation Token:15557466(SBL-EXL-00151)' with OK button”

### VAL-374: HRN Credit Limit (Tablet) - Submission confirmation - Submitted for approval message
`Explicit` · confidence: `high`

- **Description:** Error message: "Your activation request order number: 1-29811647643 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval."
- **Source reference:** [FLD-724]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Final confirmation dialog: 'Your activation request order number: 1-29811647643 is submitted for approval...'”

### VAL-375: NON_B2B2C With Approval - Step1 Contact confirmation - Connection Details - credit warning
`Explicit` · confidence: `high`

- **Description:** Triggered when customer has 2+ existing postpaid connections Error message: "Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding"
- **Source reference:** [FLD-726]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Info note (blue box): 'Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding'”

### VAL-376: NON_B2B2C With Approval - Step1 Contact confirmation - Company Name
`Explicit` · confidence: `high`

- **Description:** Selecting/skipping triggers Special-Management override confirm
- **Source reference:** [FLD-727]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Company Name' field with a searchable dropdown — agent types/selects 'TestVQW'”

### VAL-377: NON_B2B2C With Approval - B2B2C override confirm dialog - Special Management override confirm
`Explicit` · confidence: `high`

- **Description:** Appears when Account already carries a Special Management value Error message: "The Account has already Special Management field value. Do you still want to continue the journey without B2B2C"
- **Source reference:** [FLD-728]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “A native browser confirm dialog... 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C' with OK and Cancel buttons”

### VAL-378: Product configurator - Bill Limit selection (Vanilla Pre2Post) - Bill Limit radio group
`Explicit` · confidence: `high`

- **Description:** Selected value cannot be set lower than the Agent Minimum configured for that Bill Limit product in Product Administration
- **Source reference:** [FLD-734]
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit radio group offers None / Bill Limit Mobile Plus (selected) / Bill Limit Mobile”

### VAL-379: Order Line Item Detail - Spend Limit Amounts (Vanilla Pre2Post) - SL Limit Amount
`Explicit` · confidence: `high`

- **Description:** Cannot be set lower than the Agent Minimum for the selected Bill Limit product (e.g. 80 for Bill Limit Mobile Plus) Error message: "Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)"
- **Source reference:** [FLD-735]
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “SL Limit Amount 55, SL Min Value .01, SL Default Value 20 ... Bill Limit can not be set lower than Agent Minimum 80 ... (SBL-EXL-00151)”

### VAL-380: Order header (Vanilla Pre2Post, on Validate) - Validate action informational alert
`Explicit` · confidence: `high`

- **Description:** Error message: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."
- **Source reference:** [FLD-738]
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “On Validate, an alert reads: 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

### VAL-381: Connection Details modal (Open UI Desktop Pre2Post) - info banner
`Explicit` · confidence: `high`

- **Description:** Error message: "undefined"
- **Source reference:** [FLD-753]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “an info banner reading literally 'undefined' (appears to be a broken/placeholder system message)”

### VAL-382: Postpaid - Contact (Open UI Desktop Pre2Post, Step 1 continued) - Email
`Explicit` · confidence: `high`

- **Description:** validated (green checkmark)
- **Source reference:** [FLD-754]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Email: nobill@vfq.com (green checkmark = validated)”

### VAL-383: Postpaid - Contact (Open UI Desktop Pre2Post, Step 1 continued) - Alt. phone #
`Explicit` · confidence: `high`

- **Description:** validated (green checkmark)
- **Source reference:** [FLD-756]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Alt. phone #: 97412341234 (green checkmark = validated)”

### VAL-384: Base Management wizard - Contact confirmation (Autobase Pre2Post) - advance payment info banner
`Explicit` · confidence: `high`

- **Description:** Error message: "(HRN) Customer needs to pay advance payment of QR 100."
- **Source reference:** [FLD-779]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Info banner (verbatim): '(HRN) Customer needs to pay advance payment of QR 100.'”

### VAL-385: Base Management wizard / Plan step - Offer Summary / Promotion detail (Autobase Pre2Post, desktop & tablet) - Bill Limit
`Explicit` · confidence: `high`

- **Description:** Default (Smart) Bill Limit should be communicated to the customer
- **Source reference:** [FLD-780]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Bill Limit: 20 (info note: 'Default Smart Limit should be communicated to the customer')”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Bill Limit: 20 (Edit Bill Limit button, note 'Default Bill Limit should be communicated to the customer')”

### VAL-386: Base Management wizard - Activity step (Autobase Pre2Post) - Comments
`Explicit` · confidence: `high`

- **Description:** Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.
- **Source reference:** [FLD-784]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Comments textarea, info note: 'Please note down a comment regarding the actions performed...'”

### VAL-387: Submission confirmation modal (Autobase Pre2Post) - confirmation message
`Explicit` · confidence: `high`

- **Description:** Error message: "Order request is submitted successfully. Please check installed asset of the account to confirm. (HRN) Customer needs to pay advance payment of QR 100."
- **Source reference:** [FLD-785]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “a modal reads verbatim: 'Order request is submitted successfully...'”

### VAL-388: Prepaid to Postpaid - Contact (Tablet Pre2Post, Step 1) - Qatari ID
`Explicit` · confidence: `high`

- **Description:** validated (green check)
- **Source reference:** [FLD-791]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Qatari ID '28260821189' (validated, green check)”

### VAL-389: Prepaid to Postpaid - Contact (Tablet Pre2Post, Step 1 remaining fields) - Email
`Explicit` · confidence: `high`

- **Description:** required, empty at this state
- **Source reference:** [FLD-793]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Email (required, empty), No Email checkbox (unchecked)”

### VAL-390: Addon & Discount step (Tablet Pre2Post, Step 3) - Paid Add-ons (Select Add-on)
`Explicit` · confidence: `high`

- **Description:** Go back to Plan step and edit limit to cover for the add-on amount
- **Source reference:** [FLD-800]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Paid Add-ons: 'Select Add-on' button with note 'Go back to Plan step and edit limit to cover for the add-on amount'”

### VAL-391: New Prepaid Tablet - Contact (Step 1) - ID Number
`Explicit` · confidence: `medium`

- **Description:** validated (green check)
- **Source reference:** [FLD-806]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “ID Number = SG1972, both green-checked (validated)”

### VAL-392: New Prepaid Tablet - Contact form continued - Email
`Explicit` · confidence: `medium`

- **Description:** Shown green-checked (validated) in the guided journey
- **Source reference:** [FLD-814]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Email = nobill@vfq.com”

### VAL-393: New Prepaid Tablet - Contact form continued - ID-Front upload
`Explicit` · confidence: `medium`

- **Description:** Shown green-checked (validated) once uploaded
- **Source reference:** [FLD-817]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Two document capture tiles 'ID-Front' and 'ID-Back' both show green checkmarks”

### VAL-394: New Prepaid Tablet - Contact form continued - ID-Back upload
`Explicit` · confidence: `medium`

- **Description:** Shown green-checked (validated) once uploaded
- **Source reference:** [FLD-818]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'ID-Front' and 'ID-Back' both show green checkmarks”

### VAL-395: New Prepaid Tablet - SIM Serial (Step 4) - SIM Serial
`Explicit` · confidence: `medium`

- **Description:** Shown green-checked (validated); supports barcode-scan input via a scan icon
- **Source reference:** [FLD-820]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “SIM Serial = 8942702400000025359, green-checked, with a barcode-scan icon”

### VAL-396: Prepaid CAF - Documents section (New Prepaid Tablet) - Documents to be attached
`Explicit` · confidence: `medium`

- **Description:** All documents should be valid and not expired at the time of purchase
- **Source reference:** [FLD-825]
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'Documents to be attached (Mandatory): A clear copy of Qatar ID or Passport & Visa copy / GCC ID', note '*All documents should be valid and not expired at the time of purchase'”

### VAL-397: Drop Order validation (any channel) - Drop Order action
`Explicit` · confidence: `high`

- **Description:** Error message: "If without Order Approval Any user try to Drop the Order the below error will appear"
- **Source reference:** [FLD-842]
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Stated system behavior: 'If without Order Approval Any user try to Drop the Order the below error will appear'”

### VAL-398: Open UI - FDO request (order) - FDO time/date slot
`Explicit` · confidence: `high`

- **Description:** maximum 30 days ahead for an FDO
- **Source reference:** [FLD-847]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO time/date slot within the order ... business rules: maximum 30 days ahead for an FDO”

### VAL-399: FDO request status - FDO Status
`Explicit` · confidence: `high`

- **Description:** All modification/cancellation allowed only while status is Initial.
- **Source reference:** [FLD-849]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO statuses: Initial, In-Progress, Order Submitted, Success, Failed, Cancelled”

### VAL-400: FDO Pre-to-Post Migration validation - MSISDN eligibility check
`Explicit` · confidence: `high`

- **Description:** Blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order.
- **Source reference:** [FLD-850]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “system validation blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order”

### VAL-401: Open UI Desktop - Communications modal - Communication toolbar session limit message
`Explicit` · confidence: `high`

- **Description:** Error message: "Communication: User has maximum Communication toolbar sessions."
- **Source reference:** [FLD-886]
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “a system message in red: "Communication: User has maximum Communication toolbar sessions."”

### VAL-402: RFS Portal - lead capture - MSISDN
`Explicit` · confidence: `high`

- **Description:** no lead is created without it
- **Source reference:** [FLD-899]
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

### VAL-403: Vodafone ID (VFID) identifier - VFID
`Explicit` · confidence: `high`

- **Description:** format zone + four-digit BID + unit
- **Source reference:** [FLD-901]
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “newer, CEO-approved branded identifier — format "zone + four-digit BID + unit"”

### VAL-404: Order Validation Business Rules catalogue - Order Billing Profile vs Line Item Billing Profile consistency
`Explicit` · confidence: `high`

- **Description:** Error message: "Order Billing Profile must be same with Line Items' Billing Profile"
- **Source reference:** [FLD-902]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_001` "Order Billing Profile must be same with Line Items' Billing Profile"”

### VAL-405: Order Validation Business Rules catalogue - Business account pending order block on open order
`Explicit` · confidence: `high`

- **Description:** Error message: "For business account, pending order cannot be submitted if open order exists under it"
- **Source reference:** [FLD-903]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_005` "For business account, pending order cannot be submitted if open order exists under it"”

### VAL-406: Order Validation Business Rules catalogue - Serial Number
`Explicit` · confidence: `high`

- **Description:** required for SIM CARD product Error message: "Serial Number is required for SIM CARD product"
- **Source reference:** [FLD-904]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_019` "Serial Number is required for SIM CARD product"”

### VAL-407: Order Validation Business Rules catalogue - Payment authorization status
`Explicit` · confidence: `high`

- **Description:** Error message: "All Payments should be Authorized"
- **Source reference:** [FLD-905]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_030` "All Payments should be Authorized"”

### VAL-408: Order Validation Business Rules catalogue - DNO Verification Attachment
`Explicit` · confidence: `high`

- **Description:** required for MNP Port-In order Error message: "DNO Verification Attachment is required for MNP Port-In order"
- **Source reference:** [FLD-906]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_110` "DNO Verification Attachment is required for MNP Port-In order"”

### VAL-409: Order Validation Business Rules catalogue - FL Address KID requirement
`Explicit` · confidence: `high`

- **Description:** FL Address must have KID in it Error message: "FL Address must have KID in it"
- **Source reference:** [FLD-907]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_161` "FL Address must have KID in it"”

### VAL-410: Order Validation Business Rules catalogue - Bill Limit Value vs Credit Limit
`Explicit` · confidence: `high`

- **Description:** Error message: "Bill Limit Value cannot be more than Credit Limit!"
- **Source reference:** [FLD-908]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`BL RULE 07` "Bill Limit Value cannot be more than Credit Limit!"”

### VAL-411: Order Validation Business Rules catalogue - IoT vs Non-IoT MSISDN length
`Explicit` · confidence: `high`

- **Description:** 8 digits non-IoT, 10 digits IoT
- **Source reference:** [FLD-909]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT)”

### VAL-412: Order Validation Business Rules catalogue - IPTV/IDM email uniqueness
`Explicit` · confidence: `high`

- **Description:** must be unique
- **Source reference:** [FLD-915]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IPTV/IDM email-uniqueness rules”

### VAL-413: Fibre Activation BRSD - FAR_001_RFS requirements - Installation address (cascading zone/street/building)
`Explicit` · confidence: `high`

- **Description:** address lock after check
- **Source reference:** [FLD-926]
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_001_RFS_01`..`08` (installation address capture, cascading zone/street/building selection, RFS search by address/KID/area, address auto-fill, service-type display, CPE/ONT detection, address lock after check, proof-of-address upload ≤2MB)”

### VAL-414: Fibre Activation BRSD - FAR_001_RFS requirements - Proof of address upload
`Explicit` · confidence: `high`

- **Description:** ≤2MB
- **Source reference:** [FLD-927]
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

### VAL-415: Fibre Activation BRSD - FAR_002_INS (Instant Activation) requirements - Device serial number
`Explicit` · confidence: `high`

- **Description:** device serial verification
- **Source reference:** [FLD-930]
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “device serial verification”

### VAL-416: Mobile Postpaid Activation BRSD - MPAR_001_JSM requirements - Agent Role Privilege authorization
`Explicit` · confidence: `high`

- **Description:** role-based authorisation via TBD Agent Role Privilege Matrix
- **Source reference:** [FLD-932]
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “`MPAR_001_JSM_01`..`08` (journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix, Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable, automatic Tracking Record creation, milestone/draft-order persistence for resume)”

### VAL-417: Mobile Postpaid Activation BRSD - MPAR_001_JSM requirements - Qnomy Q Ticket
`Explicit` · confidence: `high`

- **Description:** fallback if Qnomy unavailable
- **Source reference:** [FLD-933]
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable”

### VAL-418: MNP Port Out Ticket - Activity Status
`Explicit` · confidence: `high`

- **Description:** activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status)
- **Source reference:** [FLD-970]
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically”

## Business Rule

### VAL-001: Personal-Use-Only Restriction
`Explicit` · confidence: `high`

- **Description:** The connection is restricted to personal, family, or roommate use at the Premises and may not be used commercially; Vodafone Qatar may suspend or terminate the service if used otherwise.
- **Source reference:** [BR-007]
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Connection is restricted to personal/family/roommate use at the Premises, not commercial use; Vodafone Qatar may suspend or terminate if used otherwise”

### VAL-002: Billing Profile Unchangeable Correlation ID Requirement
`Explicit` · confidence: `high`

- **Description:** The billing profile has no unchangeable common correlation ID between CRM and BRM today. Decision: keep the profile name renameable but add an unchangeable identifier (BRM row ID plus a unique CRM identifier) to correlate the two systems reliably.
- **Source reference:** [BR-008]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Billing profile ... has no unchangeable common correlation ID between CRM and BRM ... Decision: keep the name renameable but add an unchangeable identifier (BRM row ID + unique CRM identifier) to correlate the two systems”

### VAL-003: Unbilled Usage Screen Mandatory Filter Rule
`Explicit` · confidence: `high`

- **Description:** The unbilled usage screen cannot serve large enterprise accounts today (they are suppressed via an exception list because loading them hangs the system); a mandatory MSISDN plus date range filter (constrained to the current cycle) must be enforced.
- **Source reference:** [BR-013]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced”

### VAL-004: Back-Dated Order Completion Non-Compliance Rule
`Explicit` · confidence: `high`

- **Description:** Decision: accounts/services must be created at the correct (current) activation date rather than back-dated, with any back-dating need escalated to the fulfilment session/PMs, since revenue projection and 24-hour tax reporting requirements make back-dating non-compliant.
- **Source reference:** [BR-014]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: create account/service at the correct activation date and escalate to the fulfilment session/PMs; revenue projection and 24-hour tax reporting requirements make back-dating non-compliant”

### VAL-005: Billing Profile / Recipient Email Audit Trail Requirement
`Explicit` · confidence: `high`

- **Description:** An audit trail must capture who changed the billing profile name and the billing document recipient email, to close a fraud scenario in which a user changes the invoice email, redirects the invoice, then reverts the change with no record.
- **Source reference:** [BR-016]
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Audit trail requirement raised: capture who changed the billing profile name and the billing document recipient email (a fraud scenario was flagged where a user changes the invoice email, redirects it, then reverts with no record)”

### VAL-006: Mandatory CR-Number Search Before Account Creation
`Explicit` · confidence: `high`

- **Description:** A Commercial Registration (CR) number search is mandatory before an account can be created.
- **Source reference:** [BR-017]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation”

### VAL-007: CNAP Regulatory Mandate Rule
`Explicit` · confidence: `high`

- **Description:** CNAP (Calling Name Presentation) is regulator-mandated and mandatory for fixed lines today, limited to 25 characters, and is expected to become mandatory for mobile as well.
- **Source reference:** [BR-023]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile”

### VAL-008: Bulk Activation Identical-Parameters Constraint
`Explicit` · confidence: `high`

- **Description:** Bulk activation relies on a very old custom Excel macro (from "SSI") that requires identical plan, account, spend limit, and price across the entire batch.
- **Source reference:** [BR-027]
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “a very old custom Excel macro (from "SSI") requiring identical plan, account, spend limit and price across the batch”

### VAL-009: Shared Pool Activation-Only Support Rule
`Explicit` · confidence: `high`

- **Description:** The shared pool feature supports activation only today; other lifecycle operations are not yet supported.
- **Source reference:** [BR-030]
- **Sources:**
  - [`business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4`](../.knowledge/docs/business-process-day12-session-1-20260712-124834-meeting-rec-d6e051a4.md): “shared pool supports activation only today”

### VAL-010: Excel One-Million-Line-Item Limit / 400k Email Threshold
`Explicit` · confidence: `high`

- **Description:** Excel has a one-million line item limit, requiring aggregation with a CSV fallback for larger datasets; separately, a 400k-line threshold is driven by email delivery size limits.
- **Source reference:** [BR-032]
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Constraints noted: Excel has a one-million line item limit requiring aggregation with CSV fallback; a 400k-line threshold is driven by email delivery size limits”

### VAL-011: Bulk SMS Disconnection Outstanding-Balance Check
`Explicit` · confidence: `high`

- **Description:** Bulk SMS disconnection requires outstanding-balance checks and OnMobile confirmation before proceeding.
- **Source reference:** [BR-034]
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “disconnection with outstanding-balance checks and OnMobile confirmation”

### VAL-012: MNP Consent SMS 24-Hour Rule
`Explicit` · confidence: `high`

- **Description:** The customer must send a consent SMS within 24 hours; the request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues.
- **Source reference:** [BR-037]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

### VAL-013: MNP Outstanding-Dues Payment Window Rule
`Explicit` · confidence: `high`

- **Description:** When conditionally accepted due to outstanding dues, the stated payment window is 8 business hours, though it is presented to the customer as 24 hours.
- **Source reference:** [BR-038]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “conditionally accept if there are outstanding dues (stated payment window is 8 business hours, presented to the customer as 24 hours)”

### VAL-014: MNP Valid Rejection Reasons Rule
`Explicit` · confidence: `high`

- **Description:** Only 13 documented rejection reasons are valid for MNP; each rejection restarts the entire MNP journey.
- **Source reference:** [BR-040]
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey”

### VAL-015: Rejection Reason Code Restriction (Consumer: codes 1, 4, 9 only)
`Explicit` · confidence: `high`

- **Description:** Statuses and the 14-15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9.
- **Source reference:** [BR-050]
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Statuses and the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9”

### VAL-016: Commitment Period Continuity on Plan Upgrade (regulatory)
`Explicit` · confidence: `high`

- **Description:** Regulation requires the original commitment period to continue on plan upgrade; downgrade is treated as a breach that triggers a penalty.
- **Source reference:** [BR-063]
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “regulation requires the original commitment to continue on upgrade (downgrade is a breach triggering a penalty)”

### VAL-017: Consumer Billing Profile Cap (max two: one postpaid, one prepaid)
`Explicit` · confidence: `high`

- **Description:** A consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more.
- **Source reference:** [BR-071]
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more”

### VAL-018: QID Physical Presence and Scan Requirement for Retail Transactions
`Explicit` · confidence: `medium`

- **Description:** In retail, the customer must be physically present with a valid QID; for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer.
- **Source reference:** [BR-077]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “in retail, the customer must be physically present with a valid QID; for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer”

### VAL-019: ID Attachment Exemption for No-Change Transactions
`Explicit` · confidence: `medium`

- **Description:** Complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step; the attachment step is required only when there is an actual account/service change.
- **Source reference:** [BR-078]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “complaints, inquiries, and bill payments that do NOT result in an account or service change do not require the ID attachment step; the attachment step is required only when there is an actual account/service change”

### VAL-020: Security Question Mandatory Set (QID + Account/Holder Name)
`Explicit` · confidence: `medium`

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review):** duplicate of VAL-201 above (and BR-079) — same single, 85%-data-loss source, zero corroboration elsewhere in the corpus, re-scored 53/100 (Medium-Low). See BR-079's caveat.

- **Description:** QID and account/holder name are the two mandatory security questions; additional questions are asked flexibly depending on what the customer can answer. [SINGLE-SOURCE, UNCORROBORATED]
- **Source reference:** [BR-079]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions; additional questions... asked flexibly depending on what the customer can answer”

### VAL-021: Lighter Contact-Center Verification for Registered Number Callers
`Explicit` · confidence: `medium`

- **Description:** Contact-center verification is lighter if the customer is calling from their registered number.
- **Source reference:** [BR-080]
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “contact-center verification is lighter if the customer is calling from their registered number”

### VAL-022: KID-in-Use Mandatory Order Task and Contract Attachment
`Explicit` · confidence: `high`

- **Description:** When KID is already in use, the order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed, and downstream submission is blocked until the order task is completed.
- **Source reference:** [BR-082]
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “order is created and submitted but held via a mandatory order task; a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed”

### VAL-023: 5G Indoor Site Lock
`Explicit` · confidence: `high`

- **Description:** Site lock is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere.
- **Source reference:** [BR-091]
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Site lock is being introduced because 5G indoor devices/SIMs can currently be removed and used elsewhere [00:31:41, 00:54:13]”

### VAL-024: Device Lock-In Period (12 months)
`Explicit` · confidence: `high`

- **Description:** Device lock-in period is 12 months; commitment/lock-in reset ONLY happens on disconnection during FWA relocations/moves; any plan change resets the 'limit date' and loses the locking.
- **Source reference:** [BR-095]
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “Device lock-in: 12 months; commitment/lock-in reset ONLY happens on disconnection during FWA relocations/moves...any plan change resets the "limit date" and loses locking [01:25:44, 01:26:00, 01:27:41]”

### VAL-025: STB Certification Limit
`Explicit` · confidence: `high`

- **Description:** Up to 18 STB (set-top box) subscriptions are certified per connection (highest seen in production: 11-13).
- **Source reference:** [BR-096]
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “up to 18 STB subscriptions certified per connection (highest seen in production: 11-13) [01:38:24, 01:38:59]”

### VAL-026: KID mandatory search-only lookup
`Explicit` · confidence: `high`

- **Description:** Agents can only search for a KID (Known ID/address record); manual entry is not permitted. If no KID is found, the agent is diverted to an FWA journey.
- **Source reference:** [BR-098]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey [00:03:53, 00:04:10]”

### VAL-027: ZSB mandatory for FWA/fixed only, not mobile
`Explicit` · confidence: `high`

- **Description:** ZSB (zone/street/building) address detail capture is mandatory for FWA 5G and fixed/fiber services, but NOT for mobile, which uses a shared dummy address record. Consumer activation procedure v8.0 formalized mandatory ZSB detail capture (refs 2.1.15, 3.1.12).
- **Source reference:** [BR-099]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record [00:20:38, 00:21:02]”
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “added mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)”

### VAL-028: FWA geofencing / location lock
`Explicit` · confidence: `high`

- **Description:** FWA (Fixed Wireless Access) service is geofenced to its registered installation location; the service is disabled/suspended if the customer relocates the device elsewhere.
- **Source reference:** [BR-101]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “FWA is geofenced to its registered location — service is disabled/suspended if the customer moves the device elsewhere [00:21:19, 00:21:41]”

### VAL-029: Star number restoration/declaration form for numbers >= 1500 Riyal
`Explicit` · confidence: `high`

- **Description:** For star numbers valued 1,500 Riyal and above, a customer data restoration/declaration form (listing recent usage) is required, including a clause allowing Vodafone to reclaim the number if the transfer is later found fraudulent.
- **Source reference:** [BR-103]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “for star numbers valued 1,500 Riyal and above — a customer data restoration/declaration form (listing recent usage) with a clause letting Vodafone reclaim the number if the transfer is found fraudulent [00:45:59, 00:47:23, 01:03:51]”

### VAL-030: TON age validation (must not be a minor)
`Explicit` · confidence: `high`

- **Description:** Transfer of Ownership (TON) requires age validation confirming the recipient is not a minor, verified via MOI/date-of-birth data, with a known risk of 5-8 day MOI database sync lag.
- **Source reference:** [BR-104]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Requirement: age validation (must not be a minor) via MOI/date-of-birth, noting a known 5-8 day MOI database sync lag risk [01:00:35]”

### VAL-031: TON requires clearance of DOI and penalties before transfer
`Explicit` · confidence: `high`

- **Description:** Before a Transfer of Ownership can proceed, the entire Device on Installment (DOI) balance (not just the first installment) and any remaining lock-in/park-my-number penalties must be fully cleared.
- **Source reference:** [BR-106]
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Entire DOI (not just first installment) and any remaining lock-in/park-my-number penalties must be cleared before transfer [01:15:17, 01:15:53]”

### VAL-032: MOI data precedence with secondary-parameter cross-check
`Explicit` · confidence: `high`

- **Description:** MOI (Ministry of Interior) data takes precedence over OCR-captured document data, but only after a secondary-parameter cross-check (e.g., date of birth, nationality, expiry) passes successfully.
- **Source reference:** [BR-109]
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “MOI data takes precedence over OCR-captured data but ONLY after a secondary-parameter cross-check (e.g., DOB, nationality, expiry) passes [00:36:23, 00:38:04]”

### VAL-033: Customer identification requirements for Prepaid
`Explicit` · confidence: `high`

- **Description:** Prepaid customers must provide a valid QID, GCC ID (issued in UAE, Bahrain, Oman, Saudi Arabia, or Kuwait), Passport, or Diplomatic ID.
- **Source reference:** [BR-117]
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “must provide valid QID, GCC ID, Passport, or Diplomatic ID for Prepaid; GCC IDs issued in UAE/Bahrain/Oman/Saudi Arabia/Kuwait”

### VAL-034: Passport without customer signature exception (v8.0)
`Explicit` · confidence: `high`

- **Description:** Version 8.0 (Jul 2, 2024) of the consumer activation procedure added an exception allowing prepaid activation with a passport lacking customer signature (ref 2.1.13).
- **Source reference:** [BR-119]
- **Sources:**
  - [`consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201`](../.knowledge/docs/consumer-activation-processprocedure-ver-8-0-wm-22022024-202-a05af201.md): “v8.0 (Jul 2, 2024): Added exception for prepaid activation business rules — passport without customer signature (ref 2.1.13)”

### VAL-035: Postpaid minimum subscription period (Lock-in) of 3 months
`Explicit` · confidence: `high`

- **Description:** Postpaid plans carry a minimum subscription period (lock-in) of 3 months.
- **Source reference:** [BR-120]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Postpaid Plan* (note: minimum subscription period of 3 months applies); Minimum Subscription Period/Lock-in of 3 months”

### VAL-036: Minimum deposit or valid credit card for credit limit
`Explicit` · confidence: `high`

- **Description:** Establishing a postpaid credit limit requires a minimum deposit of QR 2,000 or a valid credit card on file.
- **Source reference:** [BR-123]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “credit limit/deposit rules (minimum deposit QR 2,000 or valid credit card)”

### VAL-037: Reserved number 90-day hold pending QID submission
`Explicit` · confidence: `high`

- **Description:** Reserved numbers (including star numbers) are held for 90 days pending the customer's QID submission.
- **Source reference:** [BR-124]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Numbers/Star Number reservation rules (90-day hold for reserved numbers pending QID submission”

### VAL-038: Star Number lock-in tiers by value
`Explicit` · confidence: `high`

- **Description:** Star numbers carry a lock-in commitment tiered by value: 1 year for numbers valued QR1,500-19,999, and 2 years for numbers valued QR20,000 and above.
- **Source reference:** [BR-125]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Star Number lock-in of 1 year for QR1,500–19,999 numbers, 2 years for QR20,000+”

### VAL-039: Home Fibre and GigaHome/5G Home require supplementary signed forms
`Explicit` · confidence: `high`

- **Description:** Home Fibre subscriptions require a Vodafone Fibre Supplementary Form; GigaHome/5G Home services require an additional physically signed form.
- **Source reference:** [BR-128]
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Home Fibre requires Vodafone Fibre Supplementary Form; GigaHome/5G Home services require an additional physically signed form”

### VAL-040: Cellular phone number format validation (974 prefix, 11 digits)
`Explicit` · confidence: `high`

- **Description:** Cellular phone numbers must start with the '974' country code prefix and must be 11 digits in total length.
- **Source reference:** [BR-131]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Enter a Cellular Phone# that starts with '974'; Cellular Phone# must be of 11 digits”

### VAL-041: QID must be 11-digit numeric value
`Explicit` · confidence: `high`

- **Description:** Qatari ID (QID) must be an 11-digit numeric value.
- **Source reference:** [BR-132]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Please enter a valid 11-digit ID number; Qatari ID must be an 11-digit numeric value”

### VAL-042: Passport format validation (4-20 alphanumeric)
`Explicit` · confidence: `high`

- **Description:** Passport numbers must be 4-20 alphanumeric characters, with no non-alphanumeric characters permitted.
- **Source reference:** [BR-133]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Passport must be 4–20 alphanumeric characters (no non-alphanumeric characters)”

### VAL-043: GCC ID format validation (8-20 numeric)
`Explicit` · confidence: `high`

- **Description:** GCC ID must be 8-20 numeric characters.
- **Source reference:** [BR-134]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “GCC ID must be 8–20 numeric characters”

### VAL-044: Business ID format validation (3-20 chars, numeric and /)
`Explicit` · confidence: `high`

- **Description:** Business ID must be 3-20 characters, containing only numeric characters and the "/" symbol.
- **Source reference:** [BR-135]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Business ID must be 3–20 characters, numeric and "/" only”

### VAL-045: Email format validation
`Explicit` · confidence: `high`

- **Description:** Email addresses must conform to standard email format (e.g., "abc@xyz.com" pattern); an incorrect-format error is shown otherwise.
- **Source reference:** [BR-136]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Email format entered is incorrect... ("abc@xyz.com" pattern)”

### VAL-046: ID expiration date must be in the future
`Explicit` · confidence: `high`

- **Description:** The ID Expiration Date entered for a customer's identification document must be in the future (not expired).
- **Source reference:** [BR-137]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “ID Expiration Date must be in the future”

### VAL-047: Date of birth must match embedded QID DOB
`Inferred` · confidence: `medium`

- **Description:** Date of Birth entered must match the date of birth embedded within the QID number; a mismatch triggers a "do not match" validation error.
- **Source reference:** [BR-138]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Date of Birth and Qatari ID "do not match" (implies an embedded-DOB validation against QID number)”

### VAL-048: Contact under 18 flagged
`Explicit` · confidence: `high`

- **Description:** A contact record is flagged if the calculated age is under 18.
- **Source reference:** [BR-139]
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “contact age under 18 flagged”

### VAL-049: QID immutable after Cross Sales redirect
`Explicit` · confidence: `high`

- **Description:** When a Cross Sales order redirects into the journey, the QID (e.g. 28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter or edit it.
- **Source reference:** [BR-155]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “the QID (28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter it”

### VAL-050: Alt. phone # must be a local mobile number (notification contact)
`Explicit` · confidence: `high`

- **Description:** The alternate phone number field is used as a notification contact and must be a local mobile number, per an info note shown on the field.
- **Source reference:** [BR-157]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “info note: "This is a notification contact. Please enter a local mobile number."”

### VAL-051: Appointment booking irreversibility rule
`Explicit` · confidence: `high`

- **Description:** Once a technician appointment is booked, it cannot be cancelled. The system presents a warning requiring the agent to confirm ("Ok") to proceed or "Cancel" to select a different appointment before booking.
- **Source reference:** [BR-158]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment"”

### VAL-052: Rejection reason drives which evidence must be re-collected on correction
`Inferred` · confidence: `high`

- **Description:** On order correction after rejection, the specific rejection reason determines which evidence must be re-collected — e.g. for "ID image not clear", the Qatari ID-Front/Back fields reset to empty upload placeholders, requiring re-upload of the flagged ID images.
- **Source reference:** [BR-161]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front/Qatari ID-Back reset to empty upload placeholders — i.e., the correction flow re-requires the flagged evidence (ID photos) per the "ID image not clear" rejection reason”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “After rejection reason "ID image not clear", "now-empty Qatari ID-Front / Qatari ID-Back upload placeholders (i.e., the rejected images were cleared, consistent with the 'ID image not clear' rejection reason) — the agent must re-upload valid ID images"”

### VAL-053: Order approval requires attachment set (QID Front, QID Back, CAF) verified before Approve/Reject
`Explicit` · confidence: `high`

- **Description:** Before an order can be Approved or Rejected, the Attachments tab must show QatarIdFront, QatarIdBack, and CAF all verified (green checkmarks); action buttons available are Approve, Reject - Correction, Reject - Drop Order, and Go Back.
- **Source reference:** [BR-164]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Attachments tab (active — shows QatarIdFront, QatarIdBack, CAF, all green/verified), and action buttons Approve, Reject - Correction, Reject - Drop Order, Go Back”

### VAL-054: 90-Day Temporary Number Rule for Non-Resident ID Types
`Explicit` · confidence: `high`

- **Description:** A number issued against a non-resident ID type (e.g. Passport) is only active for 90 days. To make the number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided.
- **Source reference:** [BR-165]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “"This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."”
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “System dialog on new contact with ID Type Passport: "This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided"”

### VAL-055: Get IPTV Mandatory Field on Contact Step
`Explicit` · confidence: `high`

- **Description:** The "Get IPTV?" field on the contact step is a required field, highlighted with a red box in the UI.
- **Source reference:** [BR-167]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Get IPTV ?" (required field, highlighted with a red box in the screenshot)”

### VAL-056: Qatari ID Front/Back Photo Upload Mandatory
`Explicit` · confidence: `high`

- **Description:** Qatari ID-Front and Qatari ID-Back photo uploads are mandatory fields, shown as required uploaded-photo placeholders that must display green checkmarks.
- **Source reference:** [BR-168]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two required uploaded-photo placeholders both show green checkmarks: "Qatari ID-Front" and "Qatari ID-Back"”

### VAL-057: B2B2C Order Requires Proof of Employment Attachment
`Explicit` · confidence: `high`

- **Description:** For B2B2C orders, the attachments step requires Proof of Employment (required, B2B2C-specific), CAF (auto-generated/required), and optionally a Supplementary Form, plus an Add File option.
- **Source reference:** [BR-169]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 requires Proof of Employment* (required, B2B2C-specific), CAF* (auto-generated/required), Supplementary Form (optional), and Add File”

### VAL-058: Order Approval Reject Reason Taxonomy
`Explicit` · confidence: `high`

- **Description:** Standard rejection reasons for order approval include: "ID image not clear", "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/Building information", "Bill explainer missing/Incorrect".
- **Source reference:** [BR-173]
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"ID image not clear", "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/ Building information", "Bill explainer missing/ Incorrect"”

### VAL-059: Address Fields Mandatory (Zone, Street No., Building No., Apt/Flat/Unit, Area)
`Explicit` · confidence: `high`

- **Description:** Zone, Street No., Building No., Apt/Flat/Unit, and Area are required address fields; the system prompts the user to enter them or, in the FWA Postpaid Business journey, gives the option to click Skip Address to proceed without saving the address.
- **Source reference:** [BR-174]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit, Area or click Skip Address to proceed without Saving Address."”

### VAL-060: Building No. Must Be Numeric, Max 5 Characters
`Explicit` · confidence: `high`

- **Description:** Building No. must be numeric and no more than 5 characters long.
- **Source reference:** [BR-175]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Building No. of 5 characters or less."”

### VAL-061: Street No. Must Be Numeric, Max 5 Characters
`Explicit` · confidence: `high`

- **Description:** Street No. must be numeric and no more than 5 characters long.
- **Source reference:** [BR-176]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter an numeric Street No. of 5 characters or less."”

### VAL-062: SIM Serial Required Before Continue
`Explicit` · confidence: `high`

- **Description:** A valid SIM Serial number must be entered before the agent can press 'Continue'.
- **Source reference:** [BR-177]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Please enter a valid SIM Serial before pressing 'Continue'."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter a valid SIM Serial before pressing 'Continue'."”

### VAL-063: SIM Serial Must Be 19 Digits
`Explicit` · confidence: `high`

- **Description:** The SIM Serial number must be exactly 19 digits; otherwise the system raises "Error: SIM Serial # must be 19 digits."
- **Source reference:** [BR-178]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: SIM Serial # must be 19 digits."”

### VAL-064: SIM Must Exist in UIM Inventory
`Explicit` · confidence: `high`

- **Description:** The entered SIM card must exist in the UIM inventory system; otherwise the system returns "SIM Card does not exist in UIM(SBL-EXL-00151)".
- **Source reference:** [BR-179]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"”

### VAL-065: SIM Must Not Already Be Assigned in UIM
`Explicit` · confidence: `high`

- **Description:** A SIM card must not already be assigned in UIM; otherwise the system returns "SIM Card already assigned in UIM(SBL-EXL-00151)".
- **Source reference:** [BR-180]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"SIM Card already assigned in UIM(SBL-EXL-00151)"”

### VAL-066: CPE Serial Must Be Free (Unassigned) in UIM
`Explicit` · confidence: `high`

- **Description:** The CPE serial number must be free (unassigned) in UIM; otherwise the system returns an error such as "CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)", surfaced via the VFQA Error Handling Service (SBL-BPR-00162) with a support reference format like "1-DNODWJU".
- **Source reference:** [BR-181]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)" surfaced via VFQA Error Handling Service (SBL-BPR-00162), with support reference format "1-DNODWJU"”

### VAL-067: Supplementary Form Mandatory for FWA CAF Step
`Explicit` · confidence: `high`

- **Description:** The Supplementary Form must be selected before continuing on the FWA CAF step; the Supplementary Form tile is marked mandatory with a red asterisk, and omitting it raises "Error: Please select Supplementary Form before continuing."
- **Source reference:** [BR-182]
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “"Error: Please select Supplementary Form before continuing." — Supplementary Form tile marked mandatory with red asterisk”

### VAL-068: Work Zone Mismatch Flagged When Reassigning Technician
`Explicit` · confidence: `high`

- **Description:** When reassigning a technician via the 'Move' dialog in WFM, the system flags a 'Work zones mismatch' warning in red if the new technician's work zone does not match the activity's required zone.
- **Source reference:** [BR-190]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Move" dialog for technician "Syed Irfan" flagged 'Work zones mismatch' (in red)”

### VAL-069: WFM Activity Requires Assess Activity, Checklist, Device Activation, and Mandatory Fields Before Ending
`Explicit` · confidence: `high`

- **Description:** A WFM field activity cannot be marked 'End' until Assess Activity, Checklist, and all Mandatory Fields (marked with *) are completed; one variant additionally requires Device Activation and verification via the Inventory tab that scanned device(s) are installed.
- **Source reference:** [BR-191]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"You Need to Complete 'Assess Activity', 'Checklist', 'Device Activation' & 'Mandatory Fields' marked with * to 'End' the Activity. Please check 'Inventory' tab to verify scanned device/s are installed."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"You Need to Complete 'Assess Activity', 'Checklist' & 'Mandatory Fields' marked with * to 'End' the Activity."”

### VAL-070: No Duplicate Kahramaa ID Installation Check (30-Day Lookback)
`Explicit` · confidence: `high`

- **Description:** The system checks for previous installation records tied to the same Kahramaa ID within the last 30 days to prevent duplicate installations; confirmation message shown when no duplicate is found.
- **Source reference:** [BR-192]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"No previous records are found based on Kahrama ID in last 30 days."”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"No previous records are found based on Kahrama ID in last 30 days."”

### VAL-071: Appointment Booking Capacity/Slot Full Rule
`Explicit` · confidence: `high`

- **Description:** Appointment booking calendar displays live capacity counts per date/time slot (e.g. '14/15'); slots that reach capacity are marked 'Full' in red and presumably cannot be selected.
- **Source reference:** [BR-193]
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “calendar grid of dates x time slots with live capacity counts (e.g. "14/15"); on 09/07/2025, the 8AM-11AM and 11AM-2PM slots show "Full" (red)”

### VAL-072: Advance Payment Required for HRN Customer
`Explicit` · confidence: `high`

- **Description:** Customers flagged as High Risk (HRN) are required to pay an advance payment of QR 100 before proceeding, indicated via an info banner.
- **Source reference:** [BR-194]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Info banner: "(HRN) Customer needs to pay advance payment of QR 100."”

### VAL-073: Address Required Fields Before Saving
`Explicit` · confidence: `high`

- **Description:** Before saving an address, the required fields Zone, Street No., Building No., Apt/Flat/Unit, and Area must be entered; alternatively the agent can click 'Skip Address' to proceed without saving the address. Confirmed across both FWA outdoor WFM and FWA Indoor B2B2C journeys.
- **Source reference:** [BR-195]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit, Area — or click Skip Address to proceed without Saving Address."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"”

### VAL-074: Appointment Once Booked Cannot Be Cancelled
`Explicit` · confidence: `high`

- **Description:** Once an installation appointment (including unscheduled appointments) is booked, it cannot be cancelled — either at all, or specifically not within the current journey. The agent must confirm ('OK') to proceed with booking or cancel to pick another slot.
- **Source reference:** [BR-196]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"WARNING: Appointment once booked cannot be cancelled. Click 'OK' to continue or 'Cancel' to select another appointment"”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue."”

### VAL-075: Serial Number Check Required Before Service Activation
`Explicit` · confidence: `high`

- **Description:** Before service activation, a Serial Number Check (Dual Play) is performed across CPE Indoor/Outdoor/SIM components; all must show validated green checks before the activation request is sent.
- **Source reference:** [BR-198]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Serial Number Check - Dual Play performed (CPE Indoor/Outdoor/SIM) with all validated green checks then 'Sending activation request.'”

### VAL-076: SIM Serial Number Must Be 19 Digits
`Explicit` · confidence: `high`

- **Description:** The SIM Serial number field is validated to require exactly 19 digits; an error is shown otherwise.
- **Source reference:** [BR-202]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: SIM Serial # must be 19 digits."”

### VAL-077: CPE Serial Required Before Continue
`Explicit` · confidence: `high`

- **Description:** A valid CPE Serial number must be entered (field-level 'This field is required' also shown) before the agent can press 'Continue'.
- **Source reference:** [BR-203]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Please enter a valid CPE Serial before pressing 'Continue'.", field-level "This field is required."”

### VAL-078: SIM Card Must Not Already Be Assigned in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered SIM Card is not already assigned to another account/service; error code SBL-EXL-00151 raised if already assigned.
- **Source reference:** [BR-204]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"SIM Card already assigned in UIM(SBL-EXL-00151)"”

### VAL-079: SIM Card Must Exist in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered SIM Card exists in the inventory system; error code SBL-EXL-00151 raised if it does not exist.
- **Source reference:** [BR-205]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"SIM Card does not exist in UIM(SBL-EXL-00151)"”

### VAL-080: CPE Serial Number Must Be Free in UIM
`Explicit` · confidence: `high`

- **Description:** The system validates against UIM that the entered CPE Serial Number is free/unassigned before it can be used; error code SBL-EXL-00151 raised if not free.
- **Source reference:** [BR-206]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)"”

### VAL-081: Proof of Employment, CAF, Supplementary Form All Required Before Continuing (B2B2C)
`Explicit` · confidence: `high`

- **Description:** In the FWA Indoor B2B2C journey, Proof of Employment, CAF, and Supplementary Form document selections are all mandatory before the agent can continue; errors are raised individually for missing Supplementary Form and missing Proof of Employment. Confirmed as a mandatory Supplementary Form requirement in the 'with approval' variant as well.
- **Source reference:** [BR-207]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"Error: Please select Supplementary Form before continuing." then "Error: Please select Proof of Employment before continuing."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: Please select Supplementary Form before continuing." — confirms the "Mandatory Supplementary form" requirement”

### VAL-082: Approve Order Requires Verification Confirmation and Comments
`Explicit` · confidence: `high`

- **Description:** To approve an order, the approver must confirm via checkbox/statement that they have verified all documents and details ('By clicking submit, I agree that I have verified all the documents and details to proceed with submission') and can enter comments in a Comments box.
- **Source reference:** [BR-210]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “"By clicking submit,I agree that I have verified all the documents and details to proceed with submission" with a Comments box”

### VAL-083: Supplementary Form Mandatory Alongside CAF
`Explicit` · confidence: `high`

- **Description:** The Supplementary Form must be selected alongside the CAF before continuing; an error is raised if omitted. (See also BR-019 for the broader B2B2C document set.)
- **Source reference:** [BR-212]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Error: Please select Supplementary Form before continuing." — confirms the "Mandatory Supplementary form" requirement”

### VAL-084: Order Expiry SLA Timer on Pending Approval
`Inferred` · confidence: `medium`

- **Description:** An order pending approval displays an Order Expiry timestamp (shown in red text), indicating an SLA timer for approval before the order expires.
- **Source reference:** [BR-214]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “"Order Expiry: 20/09/2025 02:14:24 PM" (red text — approval SLA)”

### VAL-085: Rejection Reason Recorded
`Explicit` · confidence: `high`

- **Description:** When an order is rejected, a rejection reason/comment is recorded (e.g., 'ID image not clear').
- **Source reference:** [BR-216]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “rejection comment "ID image not clear" seen for two Mitra Kharel entries”

### VAL-086: Comments Field Must Be Non-Trivial / Meet Minimum Length
`Inferred` · confidence: `medium`

- **Description:** Comments entered by an agent must be non-trivial before proceeding (e.g., Save and Finish): a note instructs agents to record a meaningful comment on actions performed for other advisors' benefit, and in the Home Move journey this is enforced with a validation rule requiring more than 5 characters.
- **Source reference:** [BR-218]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md): “note: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history."”
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Business rule captured verbatim: comments field validation requires more than 5 characters.”

### VAL-087: Install Inventory (SNC) Must Follow Service Activation Success
`Explicit` · confidence: `high`

- **Description:** Inventory installation (via Install Inventory-SNC) must only be performed after the Service Activation Status shows 'Success'.
- **Source reference:** [BR-219]
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “"Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status."”

### VAL-088: KID Eligibility Check for Home Move During Assess Activity
`Explicit` · confidence: `high`

- **Description:** During the Assess Activity step of a Home Move, a validation popup checks whether the KID (Kahramaa ID or Kunden/Kahramaa Identifier) is eligible for Home Move.
- **Source reference:** [BR-222]
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

### VAL-089: Bill Limit / Smart Limit Cannot Be Set Below Agent Min Value
`Explicit` · confidence: `high`

- **Description:** The Bill Limit / Smart Limit value entered by the agent cannot be set lower than the plan-specific Agent Minimum Value; a validation message blocks lower entries (e.g., entering 28 when Agent Minimum is 50).
- **Source reference:** [BR-225]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent types 28 into Smart Limit input and clicks Go -> validation message: 'Bill Limit can not be set lower than Agent Minimum 50'”

### VAL-090: Add-On Requires Sufficient Bill Limit Coverage
`Explicit` · confidence: `high`

- **Description:** If a selected add-on exceeds the current Bill Limit, the system prompts the agent (via info banner) to go back to the Plan step and edit the limit to cover the add-on amount.
- **Source reference:** [BR-229]
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Info banner: 'Go back to Plan step and edit limit to cover for the add-on amount.'”

### VAL-091: MOI Validation required/auto-triggered for Contact confirmation
`Explicit` · confidence: `high`

- **Description:** Method of Identification (MOI) validation is required and auto-triggered to confirm contact details before proceeding, surfaced via a blue banner prompting the agent to confirm the contact details once validation completes.
- **Source reference:** [BR-234]
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “blue banner 'MOI Validation completed, please confirm the contact details'”

### VAL-092: SIM Serial entry triggers number reservation check
`Explicit` · confidence: `high`

- **Description:** Entering the SIM serial number automatically triggers a background check that validates the SIM and reserves the associated number, with a progress indicator shown to the agent while the check runs.
- **Source reference:** [BR-235]
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'SIM Serial check and number reservation in progress. Please wait...'”

### VAL-093: Fixed Pre-sales = Yes requires Preferred Time and address capture
`Explicit` · confidence: `high`

- **Description:** When a lead's connection type is Home/Fixed and 'Fixed Pre-sales' is set to Yes, additional conditional fields become required: a Preferred Time date/time picker and full address capture (Zone, Street, Building, Unit).
- **Source reference:** [BR-236]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “After selecting Home, a conditional field 'Fixed Pre-sales' appears (Yes/No) ... Preferred Time date/time picker ... Zone, Street, Building, Unit”

### VAL-094: Reject Lead requires Reject Reason Code and Reject Comment
`Explicit` · confidence: `high`

- **Description:** Rejecting a lead requires the agent to populate a mandatory Reject Reason Code dropdown and a Reject Comment free-text field; leaving these empty is flagged as invalid (shown outlined red).
- **Source reference:** [BR-238]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “required Reject Reason Code dropdown (shown invalid/empty, outlined red) and Reject Comment text field”

### VAL-095: Created By is immutable across Owner Change
`Explicit` · confidence: `high`

- **Description:** The Created By field on a lead remains fixed to the original creator and does not change even when the Lead Owner is reassigned to a different agent.
- **Source reference:** [BR-241]
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Created By HEMANTH (unchanged throughout)”

### VAL-096: Number reservation blocks number for reserving agent
`Explicit` · confidence: `high`

- **Description:** Once a number begins the reservation process, its status shows BLOCKED with the reserving agent recorded in Reserved By, preventing other agents from selecting it before formal reservation completes.
- **Source reference:** [BR-248]
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Unreserved Numbers grid: Status BLOCKED / Reserved By SUYASHKULKARNI_VFQ before formal reservation completes”

### VAL-097: Bill Limit cannot be set below Agent Minimum Value
`Explicit` · confidence: `medium`

- **Description:** The system enforces a hard floor on the Bill Limit (a form of Spend Limit) equal to the product's configured Agent Minimum Value; entering a value below that threshold blocks journey progression and surfaces a system error referencing the admin/System Administrator with error code SBL-EXL-00151. Conversely, entering a value at or above the Agent Minimum allows the journey to proceed.
- **Source reference:** [BR-249]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Bill Limit can not be set lower than Agent Minimum 80. Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)"”
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “"When agent enters below Agent minimum value" ... "When agent enters above Agent minimum value, user can proceed the journey"”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)”

### VAL-098: Maximum Bill Limit equals account Credit Limit
`Explicit` · confidence: `high`

- **Description:** The maximum allowable Bill Limit is capped at (equivalent to) the account's Credit Limit; the agent is instructed by an on-screen note to communicate this cap to the customer.
- **Source reference:** [BR-250]
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “"Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."”
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “On Validate, an alert reads: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."”

### VAL-099: Order Expiry / approval SLA window
`Inferred` · confidence: `medium`

- **Description:** Orders pending manager approval carry an Order Expiry timestamp representing an approximately 3-day SLA window measured from the order's submission/creation time, after which the order presumably lapses.
- **Source reference:** [BR-258]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Order Expiry: 20/08/2025 08:39:01 AM — a 3-day SLA window from submission (created 8/17/2025 08:39:01 AM)”

### VAL-100: Manager approval requires document verification acknowledgement
`Explicit` · confidence: `high`

- **Description:** When a manager submits/approves an order, they must explicitly acknowledge via an on-screen statement that they have verified all documents and details before the submission can proceed.
- **Source reference:** [BR-259]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"By clicking submit, I agree that I have verified all the documents and details to proceed with submission."”

### VAL-101: Add-on selection constrained by Bill Limit headroom
`Explicit` · confidence: `high`

- **Description:** Selecting an add-on is constrained by the remaining headroom under the account's Bill Limit; if the add-on amount would exceed that headroom, the agent must return to the Plan step and raise the Bill Limit to cover the add-on before proceeding.
- **Source reference:** [BR-262]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “"Go back to Plan step and edit limit to cover for the add-on amount."”

### VAL-102: Proof of Employment mandatory for B2B2C attachments
`Explicit` · confidence: `high`

- **Description:** In the B2B2C order flow, Proof of Employment is a hard-required attachment; the system blocks progression with an error if it is not selected/uploaded.
- **Source reference:** [BR-263]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “"Error: Please select Proof of Employment before continuing." — Proof of Employment is a hard-required attachment for this B2B2C flow”

### VAL-103: Number reservation generates a unique reservation token
`Explicit` · confidence: `high`

- **Description:** Successfully reserving a number generates a unique reservation token returned to the agent via a system success alert, referencing error/success code SBL-EXL-00151.
- **Source reference:** [BR-267]
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Browser alert: "SUCCESS:Reservation Token:15557466(SBL-EXL-00151)"”

### VAL-104: Connection count check before conversion (existing prepaid/postpaid line counts shown)
`Explicit` · confidence: `high`

- **Description:** Before a Pre-to-Post conversion, the system displays a Connection Details modal showing the existing total number of prepaid and postpaid connections for the customer, allowing a count check as part of the conversion flow.
- **Source reference:** [BR-274]
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Connection Details modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”

### VAL-105: Recurring add-ons cannot be purchased twice on the same line; one-off add-ons can be added multiple times
`Explicit` · confidence: `high`

- **Description:** A recurring add-on already active on a line cannot be purchased a second time on that same line (validation failure), whereas one-off add-ons may be added multiple times on the same line.
- **Source reference:** [BR-275]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “recurring add-ons can't be purchased twice (fails at validation); one-off add-ons can be added multiple times”

### VAL-106: Discounts cannot be multi-selected on one order (BAU rule)
`Explicit` · confidence: `high`

- **Description:** Only a single discount may be selected per order; multi-selecting discounts within one order is disallowed as a business-as-usual rule.
- **Source reference:** [BR-276]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “discounts cannot be multi-selected in one order (BAU rule)”

### VAL-107: FDO maximum 30 days ahead
`Explicit` · confidence: `high`

- **Description:** A Future Dated Order (FDO) can be scheduled for execution no more than 30 days ahead of the order creation date.
- **Source reference:** [BR-277]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “maximum 30 days ahead for an FDO”

### VAL-108: Failed FDO orders must not be cancelled manually
`Explicit` · confidence: `high`

- **Description:** If FDO execution fails validation, the request is automatically cancelled with the error captured by the system; agents/users must not manually cancel failed FDO orders.
- **Source reference:** [BR-279]
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “if FDO execution fails validation the request is cancelled with error captured; failed FDO orders must not be cancelled manually”

### VAL-109: Order cannot be dropped without going through Approval
`Explicit` · confidence: `high`

- **Description:** An order cannot be dropped by a user unless it has gone through the Order Approval step; attempting to drop without approval produces an error.
- **Source reference:** [BR-285]
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “If without Order Approval Any user try to Drop the Order the below error will appear”

### VAL-110: CAF/attachment size limit ~4MB
`Explicit` · confidence: `high`

- **Description:** Customer Application Form (CAF) and other order attachments are limited to approximately 4MB in file size.
- **Source reference:** [BR-290]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “CAF/attachment size limit ~4MB (01:47:35)”

### VAL-111: Signed CAF must not be editable after signing
`Explicit` · confidence: `high`

- **Description:** Once a Customer Application Form (CAF) has been signed, it must become locked/non-editable to preserve the integrity of the signed document.
- **Source reference:** [BR-291]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “signed CAF must not be editable after signing (01:47:31)”

### VAL-112: MNP porting requires mandatory customer SMS confirmation to clearinghouse shortcode (charged QR 1)
`Explicit` · confidence: `high`

- **Description:** MNP porting requires the customer to send a mandatory confirmation SMS to a clearinghouse shortcode, which is charged QR 1; no confirmation SMS is sent if the port request is rejected.
- **Source reference:** [BR-296]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “a mandatory customer SMS to a clearinghouse shortcode to confirm porting (charged QR 1; no SMS sent on rejection)”

### VAL-113: MNP requires two signatures (legal requirement)
`Explicit` · confidence: `high`

- **Description:** MNP (mobile number portability) requests require two signatures as a legal requirement confirmed by the review team.
- **Source reference:** [BR-297]
- **Sources:**
  - [`it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d`](../.knowledge/docs/it-stack-modernization-existing-processes-giga-26-23rd-floor-5c4b9d9d.md): “two signatures (legal requirement per review team, 01:27:37)”

### VAL-114: Order Billing Profile must match Line Items' Billing Profile
`Explicit` · confidence: `high`

- **Description:** The Billing Profile set at the order level must match the Billing Profile of each of the order's Line Items.
- **Source reference:** [BR-300]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Order Billing Profile must be same with Line Items' Billing Profile”

### VAL-115: Business account open-order block
`Explicit` · confidence: `high`

- **Description:** For a business account, a new pending order cannot be submitted if there is already an open order existing under that account.
- **Source reference:** [BR-301]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “For business account, pending order cannot be submitted if open order exists under it”

### VAL-116: SIM Card serial number mandatory
`Explicit` · confidence: `high`

- **Description:** A Serial Number is a mandatory field for any SIM CARD product on an order.
- **Source reference:** [BR-302]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Serial Number is required for SIM CARD product”

### VAL-117: Payment authorization requirement
`Explicit` · confidence: `high`

- **Description:** All payments associated with an order must be authorized before the order can proceed.
- **Source reference:** [BR-303]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “All Payments should be Authorized”

### VAL-118: MNP Port-In DNO verification attachment requirement
`Explicit` · confidence: `high`

- **Description:** An MNP Port-In order requires a DNO (Donor Network Operator) Verification Attachment to be provided.
- **Source reference:** [BR-304]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “DNO Verification Attachment is required for MNP Port-In order”

### VAL-119: Fixed Line address KID requirement
`Explicit` · confidence: `high`

- **Description:** A Fixed Line (FL) address on an order must include a KID (unique address/location identifier).
- **Source reference:** [BR-305]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “FL Address must have KID in it”

### VAL-120: Bill Limit Minimum threshold (Agent) / BL rule series 01-09
`Explicit` · confidence: `high`

- **Description:** Bill Limit (BL) rules 01 through 09 govern bill-limit modification for agents, including minimum/maximum threshold checks and conflicts with in-flight orders.
- **Source reference:** [BR-306]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bill Limit (BL) rules 01–09 governing bill-limit modification, minimum/maximum thresholds and conflicts with in-flight orders”

### VAL-121: IoT vs Non-IoT MSISDN length rule
`Explicit` · confidence: `high`

- **Description:** MSISDN length must conform to product type: non-IoT MSISDNs are 8 digits, IoT MSISDNs are 10 digits.
- **Source reference:** [BR-308]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT)”

### VAL-122: iWatch/RIO max one per order
`Explicit` · confidence: `high`

- **Description:** An order may include a maximum of one iWatch/RIO product; this is part of the broader iWatch/RIO bundle validation which also includes a credit limit check.
- **Source reference:** [BR-309]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block)”

### VAL-123: iWatch/RIO EID requirement
`Explicit` · confidence: `high`

- **Description:** An EID (eSIM identifier) is required as part of the iWatch/RIO bundle validation.
- **Source reference:** [BR-310]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “EID requirement”

### VAL-124: Bulk SMS one-active-per-account rule
`Explicit` · confidence: `high`

- **Description:** An account may have only one active Bulk SMS service at a time.
- **Source reference:** [BR-312]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “one active Bulk SMS per account, mandatory attachment, blacklist check”

### VAL-125: Bulk SMS mandatory attachment rule
`Explicit` · confidence: `high`

- **Description:** A Bulk SMS order requires a mandatory supporting attachment.
- **Source reference:** [BR-313]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “mandatory attachment”

### VAL-126: Account-level APN uniqueness
`Explicit` · confidence: `high`

- **Description:** APN validation enforces account-level APN uniqueness, alongside related checks for Static IP, Domain Hosting, and Broadband Service Link.
- **Source reference:** [BR-315]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “APN validation (Static IP, Domain Hosting, Broadband Service Link, Account-level APN uniqueness)”

### VAL-127: Deposit Service Bundle one-per-account rule
`Explicit` · confidence: `high`

- **Description:** An account may have only one Deposit Service Bundle at a time.
- **Source reference:** [BR-316]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Deposit Service Bundle rules (one per account, cannot be first service, cannot TON)”

### VAL-128: Deposit Service Bundle cannot combine with TON
`Explicit` · confidence: `high`

- **Description:** A Deposit Service Bundle cannot be combined with a TON (Transfer of Name/Ownership) on the same order.
- **Source reference:** [BR-318]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “cannot TON”

### VAL-129: IPTV/IDM email uniqueness rule
`Explicit` · confidence: `high`

- **Description:** IPTV/IDM registrations enforce email-address uniqueness across accounts/subscriptions.
- **Source reference:** [BR-320]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IPTV/IDM email-uniqueness rules”

### VAL-130: ALP account existence / default billing profile cross-check
`Explicit` · confidence: `high`

- **Description:** Account Level Product/Bundle (ALP) orders undergo BRM cross-checks validating account existence and the type/status of the default billing profile.
- **Source reference:** [BR-321]
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “ALP (Account Level Product/Bundle) BRM cross-checks (account existence, default billing profile type/status)”

### VAL-131: Each activation requires unique KID
`Explicit` · confidence: `high`

- **Description:** Each activation requires a unique KID; for villa partitions with a shared real address, the first connection uses the real KID and subsequent connections use dummy KIDs to satisfy the uniqueness requirement.
- **Source reference:** [BR-322]
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Villa partitions use dummy KIDs (first connection on real KID, subsequent on dummies) since each activation needs a unique KID”

### VAL-132: MSISDN required to create a Siebel lead from RFS Portal
`Explicit` · confidence: `high`

- **Description:** The RFS Portal captures MSISDN and creates a Siebel lead via API; MSISDN is not used as a search key, but no lead can be created without it being present.
- **Source reference:** [BR-323]
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

### VAL-133: Address lock after RFS feasibility check
`Explicit` · confidence: `high`

- **Description:** The service address is locked after the Ready-for-Service (RFS) feasibility check is completed.
- **Source reference:** [BR-325]
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “address lock after check”

### VAL-134: Proof-of-address file size cap (2MB)
`Explicit` · confidence: `high`

- **Description:** Proof-of-address document uploads are capped at 2MB.
- **Source reference:** [BR-326]
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

### VAL-135: Bill period non-editable in bill profile capture
`Explicit` · confidence: `high`

- **Description:** During bill profile capture (bill address, bill cycle, bill period, bill mode), the bill period field is non-editable.
- **Source reference:** [BR-332]
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

### VAL-136: Payment Capture via WinCash for Suspension/Resume Orders
`Explicit` · confidence: `medium`

- **Description:** Payment associated with service suspension or resume must be captured/collected through the WinCash payment system before order submission (payment for suspension collected in WinCash per J023; payment for resume service via WinCash per J024).
- **Source reference:** [BR-339]
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment for suspension, collected in WinCash (J023); capture payment of resume service via WinCash (J024)”

### VAL-137: MNP Port Out Activity Validation and Auto Status Change
`Explicit` · confidence: `high`

- **Description:** Activities within an MNP Port Out ticket are validated either automatically or by the MNP Team and marked Success/Failed; when all activities are complete, the ticket's overall status changes automatically.
- **Source reference:** [BR-343]
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically.”

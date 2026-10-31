# Exception Catalogue (Phase 32)

Validation failures, permission failures, workflow failures, and technical-interruption scenarios (unsaved changes, duplicate requests, browser refresh, interrupted workflows). Sourced from the FWA Negative Scenarios guided-journey document (verbatim error text + codes), `validation-catalogue.md` (418 entries), `workflow-execution-matrix.md`'s evidenced exception flows (130 of 945 steps), and `rbac-matrix.md`'s restricted actions (40 entries). The four technical-interruption categories the phase asks for are evidenced unevenly — see §5, which is explicit about what is and is not evidenced.

---

## 1. Validation Failures

**418 entries** are fully catalogued in `validation-catalogue.md` (281 field-level, 137 business-rule) — not reproduced here. Below are the most concrete, verbatim examples: 11 real validation-failure scenarios captured screenshot-by-screenshot in a single guided-journey negative-scenario document, showing exactly what the legacy Open UI displays (dialog text, inline banners, field-level errors) when required data is missing, malformed, or fails a backend inventory check.

### Source: FWA Indoor/Outdoor Negative Scenarios (`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`)

**EXC-001: Address step — all required fields blank** `Explicit` · confidence: `high`
- **Trigger:** Zone, Street No., Building No., Apt/Flat/Unit, Area all empty; agent clicks Save Address
- **System behavior:** Modal dialog: "Please enter required fields\nZone, Street No., Building No., Apt/Flat/Unit.,Area" (OK button; Go back/Cancel also available on the page)
- **Recovery path:** Agent fills required fields and resubmits, or clicks Go back/Cancel

**EXC-002: Address step — non-numeric Building No.** `Explicit` · confidence: `high`
- **Trigger:** Building No. = "67K" (contains a letter)
- **System behavior:** Native browser alert: "Please enter an numeric Building No. of 5 characters or less."
- **Recovery path:** Agent corrects the field to a numeric value ≤5 characters

**EXC-003: Address step — Street No. too long** `Explicit` · confidence: `high`
- **Trigger:** Street No. = "5666666" (7 numeric characters, over the 5-character limit)
- **System behavior:** Native browser alert: "Please enter an numeric Street No. of 5 characters or less."
- **Recovery path:** Agent shortens the field to ≤5 characters

**EXC-004: Address step — blank fields, with Skip escape hatch (Business/Static Data variant)** `Explicit` · confidence: `high`
- **Trigger:** Same blank-field scenario as EXC-001, but in the "FWA Postpaid Business" journey variant
- **System behavior:** Modal offers an escape hatch not present in the Tablet flow: "...or click Skip Address to proceed without Saving Address."
- **Recovery path:** Agent can bypass address capture entirely via Skip Address — a materially different recovery path from the Tablet flow (EXC-001) for the identical error condition

**EXC-005: SIM Serial step — both SIM/CPE serial fields blank** `Explicit` · confidence: `high`
- **Trigger:** Number Selection already saved; SIM Serial and CPE Serial Number left blank; Continue clicked
- **System behavior:** Inline red banner: "Please enter a valid SIM Serial before pressing 'Continue'."
- **Recovery path:** Agent enters SIM Serial

**EXC-006: SIM Serial step — SIM not found in backend inventory (UIM)** `Explicit` · confidence: `high`
- **Trigger:** Valid-format SIM Serial + CPE Serial entered (client-side green-checked); Continue clicked
- **System behavior:** Native alert exposing a raw backend error code: "SIM Card does not exist in UIM(SBL-EXL-00151)"
- **Recovery path:** Agent must obtain a different, valid SIM from physical/UIM stock — no in-UI correction possible

**EXC-007: SIM Serial step — wrong length** `Explicit` · confidence: `high`
- **Trigger:** SIM Serial = 18 digits (should be 19)
- **System behavior:** Inline field-level error: "Error: SIM Serial # must be 19 digits." — note a STALE bottom banner from a prior state ("Please enter a valid SIM Serial...") remains visible underneath, i.e. the legacy UI does not clear superseded messages
- **Recovery path:** Agent corrects to 19 digits

**EXC-008: SIM Serial step — validation in progress (async loading state)** `Explicit` · confidence: `high`
- **Trigger:** Corrected 19-digit SIM Serial submitted; backend validation call in flight
- **System behavior:** Orange spinner "Validating Order, please wait..." next to the field; a STALE banner from a different field ("Please enter a valid CPE Serial...") is still showing underneath during this intermediate state
- **Recovery path:** N/A — this is the Loading state, resolves to success or one of EXC-006/009/010

**EXC-009: SIM Serial step — SIM already assigned in UIM** `Explicit` · confidence: `high`
- **Trigger:** Valid-format, previously-issued SIM Serial submitted
- **System behavior:** Native alert: "SIM Card already assigned in UIM(SBL-EXL-00151)" — same error code as EXC-006 ("does not exist") but a materially different underlying condition, evidencing that this legacy error code is overloaded across at least 2 distinct failure causes
- **Recovery path:** Agent must obtain a different, unassigned SIM

**EXC-010: SIM Serial step — CPE not free in UIM, raw backend exception surfaced to user** `Explicit` · confidence: `high`
- **Trigger:** CPE Serial submitted that UIM reports as not free/available
- **System behavior:** Native alert exposing an unhandled backend exception trace verbatim: "Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162)\nCPE Serial Number ... is not free in UIM(SBL-EXL-00151)\nPlease Contact the System Administrator with Reference # 1-DNODWJU.(SBL-EXL-00151)" — a genuine UX defect in the legacy system (raw stack-trace-style text surfaced to an end user) that the new DXP should NOT reproduce
- **Recovery path:** Per the message: contact System Administrator with the reference number — no self-service recovery

**EXC-011: CAF & Attachments step — mandatory Supplementary Form not selected** `Explicit` · confidence: `high`
- **Trigger:** CAF uploaded but the mandatory Supplementary Form tile (red asterisk) left empty; Continue clicked
- **System behavior:** Inline banner: "Error: Please select Supplementary Form before continuing."
- **Recovery path:** Agent uploads the Supplementary Form, or uses Abandon Order/Go Back

**Design implication for the new DXP** (Assumed recommendation, not evidenced): none of the legacy native `alert()` popups, raw backend exception traces (EXC-010), or stale/overlapping banners (EXC-007, EXC-008) should be carried forward — replace with the styled toast/banner/modal taxonomy in `notification-catalogue.md` §4, with every backend-style error code (SBL-EXL-00151, SBL-BPR-00162) translated to a plain-language message before display.

---

## 2. Permission Failures

40 of 145 RBAC entries evidence a specific restriction (from `rbac-matrix.md`). Representative sample:

- **RBAC-002** (Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) @ Cross Sales — Contact/QID entry): Cannot re-enter/change QID once carried over from Cross Sales (read-only)
- **RBAC-003** (Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) @ QID Offers grid): Cannot select a plan on cross-sell order (auto-applied); no editable add-on/discount control on cross-sell order
- **RBAC-012** (Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) @ MNP Postpaid Plan Step / Promotion Detail Modal): Can edit Smart Limit/Bill Limit down to but not below Agent Minimum Value without System Administrator override
- **RBAC-017** (Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) @ New Fixed Line wizard — Contact step): Cannot manually enter ID details (only re-scan); cannot manually enter KID, only search
- **RBAC-020** (Retail/Sales Agent (Frontline/Cross-Sell/Front-Office) @ Account Summary): Retail cannot change primary contact; cannot enroll/cancel AutoPay or see card details
- **RBAC-021** (Account Manager @ MS Dynamics Discount Approval Hierarchy Screen): Does not have CRM access, served via 117 support channel instead
- **RBAC-022** (Account Manager @ Account affiliation approval (no dedicated screen in catalogue)): Do not have CRM access, served via 117 support channel instead
- **RBAC-023** (Account Manager / Channel Partner (External enterprise) @ CRM (no screen access)): Do not have CRM access, served via 117 support channel instead
- **RBAC-034** (Chooser @ Enterprise request submission (no dedicated CRM screen)): Requests only accepted from chooser's registered email; no off-boarding process exists when a chooser leaves the company
- **RBAC-036** (Technical Contact @ Contact record (free-text only, no formal screen)): Cannot be captured as a formal contact with ID today, only free text, causing appointment notifications to go to the wrong person
- **RBAC-048** (Billing Team / Billing Role @ ): Restricted permission to change bill cycle
- **RBAC-049** (Collection/Credit Control Team (Manual Suspension via Taurus) @ ): Manual suspension restricted to specific roles, not exposed as retail journey
- **RBAC-053** (Customer (Consumer/Enterprise/B2B2C End User) @ Contact Portal): Subject to disconnection/dunning ladder if unpaid; risk of suspension/blacklisting for offer abuse
- **RBAC-054** (Customer (Consumer/Enterprise/B2B2C End User) @ ): non-standard customers cannot use self-serve, get a Lead instead
- **RBAC-059** (CDM Team / Customer Data Management @ ): No accessible_screens, accessible_actions, restricted_features, or permissions text captured for this persona in Stage A data

_25 more in `rbac-matrix.md` (filter for populated `actions_restricted`)._

**UI treatment (Assumed):** per `frontend-architecture.md` §8, a screen/action with no RBAC entry for the active persona should be **hidden**, not shown-then-blocked — so most permission failures should never surface as a runtime error at all. The entries above are the minority of cases where the corpus evidences an *explicit* restriction message/behavior (e.g. "cannot manually enter ID details, only re-scan") rather than simple absence of access.

---

## 3. Workflow Failures

130 of 945 workflow steps in `workflow-execution-matrix.md` evidence an exception/failure flow. Grouped by journey (showing top 10 by count):

### New Postpaid B2B2C With Approval (Open UI Tablet) (7 exception-flow steps)
- **WF-682** (step 2): Search again / Cancel
- **WF-685** (step 5): Search again / Cancel
- **WF-686** (step 6): Skip Address / Go back / Cancel
- _4 more — see `workflow-execution-matrix.md`_

### New Postpaid for HRN Customer with Credit Limit Edit (Open UI Desktop) (5 exception-flow steps)
- **WF-670** (step 4): Search again / Cancel
- **WF-671** (step 5): Skip Address / Cancel / Go Back
- **WF-672** (step 6): Continue / Cancel / Go Back
- _2 more — see `workflow-execution-matrix.md`_

### New Postpaid HRN Customer Credit Limit with Manager Approval (Open UI Tablet) (5 exception-flow steps)
- **WF-718** (step 4): Skip Address / Go back / Cancel
- **WF-719** (step 5): Cancel / Go Back
- **WF-724** (step 10): Clear Signature
- _2 more — see `workflow-execution-matrix.md`_

### FWA Indoor B2B2C New Sale with Manager Approval (Tablet, Open UI) (4 exception-flow steps)
- **WF-469** (step 2): Empty submit → "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"
- **WF-473** (step 6): "Please enter a valid SIM Serial"; "SIM Card already assigned in UIM(SBL-EXL-00151)"; "CPE Serial Number...is not free in UIM(SBL-EXL-00151)"
- **WF-475** (step 8): "Error: Please select Supplementary Form before continuing."; "Error: Please select Proof of Employment before continuing."
- _1 more — see `workflow-execution-matrix.md`_

### Cross Sales to New Postpaid (Existing Customer, Open UI Desktop) (4 exception-flow steps)
- **WF-637** (step 3): Search again / Cancel
- **WF-639** (step 5): Cancel
- **WF-641** (step 7): Interested / Reject / Close
- _1 more — see `workflow-execution-matrix.md`_

### MNP Port-Out Ticket Distribution and SLA Handling (Consumer) (3 exception-flow steps)
- **WF-084** (step 1): Manual export/distribution is a pain point; bulk owner change possible as workaround
- **WF-085** (step 2): Suspension and CRM escalation triggered when action is missed
- **WF-086** (step 3): Manual status update after payment for B2B2C is a pain point

### Transfer of Ownership/Number - Retail Channel (3 exception-flow steps)
- **WF-088** (step 2): POA-based exceptions
- **WF-090** (step 4): Null/blank number price causes unnecessary CDM queue tickets (legacy data/design gap)
- **WF-091** (step 5): Address not updated after TON (known gap)

### SIM Swap - Retail Channel (3 exception-flow steps)
- **WF-129** (step 2): Open question on Arabic translation support
- **WF-131** (step 4): Named fraud risk: genuine ID belonging to someone else passes all three checks
- **WF-132** (step 5): Agents cannot manually enter ID details, only re-scan; manager bypass allows editing QID number only

### New Fixed Line Activation – Desktop, Back Office Fulfilment Agent (Triple Play, attachments skipped) (3 exception-flow steps)
- **WF-259** (step 7): Attachment upload optional/skippable per this walkthrough's scope
- **WF-263** (step 11): Mid-flow number swap observed: transitional header showed 97441202039 before final 97441224317
- **WF-266** (step 14): CAF attachment upload skipped per this walkthrough's stated scope

### Digital Fixed Line Instant Activation (Dual Play) – Self-Service Digital Fiber Activation (3 exception-flow steps)
- **WF-356** (step 3): Step skipped for Non Prepatched KID
- **WF-360** (step 7): If QID already has fiber, generate lead for home move
- **WF-363** (step 9): Separate confirmation paths for CPE & Non Prepatched vs. Prepatched Combo Box

_Remaining 71 journeys with exception-flow steps are in `workflow-execution-matrix.md`._

---

## 4. Rejection & Escalation Flows (Order/Lead-level, from `reusable-patterns.md`)

- **Order rejection** (Pattern 5): Reject-Correction routes the order into a dedicated Order Correction re-entry wizard, pre-filled with prior confirmed data, and can trigger an SMS. Reject-Drop Order terminates the order.
- **Lead rejection** (Pattern 14): Reject requires a Reject Reason Code (controlled taxonomy) + free-text Comment.
- **Bulk operation failure** (Pattern 17): per-row failure reporting with re-upload of only the failed rows (not a full resubmission).

---

## 5. Technical Interruption Scenarios — evidence status

The phase definition also asks for Unsaved Changes, Duplicate Requests, Browser Refresh, and Interrupted Workflows. These are **unevenly evidenced**:

| Scenario | Evidence status | Detail |
|---|---|---|
| **Interrupted workflows** | `Explicit` — evidenced | `journeys.md` explicitly evidences "milestone/draft-order persistence for resume" (MPAR_001_JSM_07 capability), and Reusable Pattern 16 ("In-Progress Journey Resume List", medium confidence) shows a UI for resuming mid-flight journeys/orders from the last completed milestone. `frontend-architecture.md` §4 maps this to `workflowStore` (sessionStorage-backed draft state). |
| **Duplicate requests (business-level)** | `Explicit` — evidenced | BR-151 (duplicate-fiber-at-address routing), BR-192 (No Duplicate Kahramaa ID Installation Check, 30-day lookback), BR-244 (mobile-number lead attaches to existing Contact rather than duplicating) — see `business-rules.md`. These are business-process duplicate-prevention rules, not UI double-submit protection. |
| **Duplicate requests (UI double-submit)** | `Assumed` — not evidenced | No source document discusses disabling a Submit button during an in-flight request or de-duplicating rapid double-clicks. **Recommendation:** disable the action trigger for the duration of the Mock Data Engine's simulated-latency window (`frontend-architecture.md` §7), a standard SPA pattern, not something to reconstruct from this corpus. |
| **Unsaved changes warning** | `Assumed` — not evidenced | No source document describes a "you have unsaved changes" browser-navigation guard. **Recommendation:** standard `beforeunload`/router-blocker pattern keyed off `workflowStore`'s dirty-draft state — an engineering default, not a business requirement. |
| **Browser refresh recovery** | `Assumed` — not evidenced, but partially covered by the Interrupted Workflows evidence above | Since `workflowStore` is recommended to persist to `sessionStorage` (`frontend-architecture.md` §4) specifically because of the evidenced draft/resume capability, a refresh within the same tab session would naturally recover in-progress state — this is an *architectural consequence* of an evidenced requirement, not itself evidenced. |

Do not treat the `Assumed` rows as discovered requirements — they are standard SPA engineering defaults recommended to fill a gap the source corpus is genuinely silent on, consistent with this blueprint's evidence model.

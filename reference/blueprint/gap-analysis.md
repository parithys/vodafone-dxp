# Gap Analysis (Phase 36)

Missing Requirements / Screens / Journeys / Rules / Personas, identified by (1) comparing the 165-row master CRM Journey catalog (`data/CRM_Journeys_Final_Updated_with_Type.xlsx`) against the 111 journeys synthesized in `journeys.md`, and (2) deterministic completeness checks across the Stage A/B catalogues.

**Stage K update:** the four gap counts below (§2, §4, §5, §6 — 16 journeys, 27 entities, 109 requirements, 85 screens) have all been re-mined against the *original* source documents under `data/` rather than the `.knowledge/docs/` summaries. See `gap-resolution-stage-k.md` for the full per-item evidence trail; each section below now shows Recovered / Reclassified-Not-Applicable / Still-Gapped counts instead of a single flat list.

---

## 1. Journey Catalog Coverage (165-row master list vs. 111 synthesized journeys)

165 catalog rows checked — **133 did not match** a synthesized journey, 32 did.

**This number needs the Type breakdown to be meaningful** — the master catalog itself classifies each row as User Journey / Workflow-Task / View / Action / Access-Permission, and this blueprint's `journeys.md` only targeted the User-Journey-shaped, step-by-step material:

| Type | Matched | Gap | Total |
|---|---|---|---|
| Access/Permission | 0 | 2 | 2 |
| Action | 1 | 27 | 28 |
| User Journey | 9 | 2 | 11 |
| View | 0 | 29 | 29 |
| Workflow/Task | 22 | 73 | 95 |

**Corrected 2026-08-23** (Phase 2 review against a separate Phase 1.5 pass on this same catalogue): the original claim here was "10/11 matched, 1 gap" — independently re-verified against the 11 catalogue rows tagged `Type = User Journey` and found to undercount by one. Catalogue row **#12 "New IOT Tablet"** (Sales category) also has no plausible corresponding entry in `journeys.md` — the only IoT-related journey is UJ-006 "Enterprise/IoT Order-to-Billing Flow," which is a generic B2B enterprise order flow (actors: Account Manager, EBU PM, Fulfilment, ETS, EBU, SBN), not the retail/tablet-channel IoT device activation the catalogue row describes. Corrected finding: **9 of the catalog's 11 "User Journey"-type rows** have a corresponding synthesized journey (2 gaps, not 1). The bulk of the 133 unmatched rows (131) remain lower-granularity **Workflow/Task, View, Action, and Access/Permission** rows — administrative operations, read-only views, single-step actions, and role-based access controls that Stage A's journey extraction was never targeting (Views belong in `screens.md`, Access/Permission belongs in `rbac-matrix.md`, and Actions/Workflow-Tasks are largely the kind of back-office operations this corpus's workshops discuss in less step-by-step detail than the guided-journey screenshots).

### The two true User-Journey-type gaps

- **Create Upgrade TT** (catalog row #3): Creating a ticket specifically to track plan upgrades is not directly represented; UJ-029 covers Plan Change itself and UJ-022 covers general trouble ticket creation, but no journey specifically addresses an 'Upgrade TT' for tracking - GAP.
- **New IOT Tablet** (catalog row #12, added 2026-08-23): Retail/tablet-channel activation of an IoT device connection is not directly represented; UJ-006 (Enterprise/IoT Order-to-Billing Flow) is the closest match but covers a different-shaped B2B enterprise order journey (account manager/EBU PM/fulfilment actors), not a tablet-channel retail activation flow - GAP.

### Workflow/Task, View, Action & Access/Permission rows with no corresponding blueprint entry (scope candidates for a future extraction pass, not journey-catalog defects)

<details><summary>Workflow/Task (73)</summary>

- **#21 Account Level Products** (Sales): Covers billing/modification/disconnection orders for a broad set of account-level products (Microsoft, Starlink, Toll Free, Trendmicro, GDSP, Big Data, etc.); the blueprint's enterprise journeys (UJ-006/007/008) address enterprise mobility/IoT/connectivity order flows but none specifically cover this heterogeneous account-level product bundle, so treated as a gap.
- **#24 PTP** (Support): PTP (Promise to Pay) collection-bar removal is a dunning/collections workflow-task not covered by any of the 111 journeys, which focus on activation/order/lifecycle flows rather than granular collections actions; GAP.
- **#30 Adjustment Approval** (Support): Approving billing adjustments via approval matrix/queue is a distinct back-office workflow-task; UJ-001 covers bulk adjustment submission but not the approval step itself, so this is a GAP.
- **#31 Updating Contacts** (Support): Generic account-level contact-detail update/maintenance workflow-task has no dedicated journey among the 111 (closest, UJ-076 Passport-to-QID Update, is a narrower single-field case); GAP.
- **#32 Documeting Activity** (Support): Making free-text activity notes against an account/MSISDN/ticket/lead is a generic CRM utility action, not represented as its own journey; GAP.
- **#33 Updating Account** (Support): Generic account-detail update task has no corresponding dedicated journey in the blueprint; GAP.
- **#34 Linking Accounts** (Support): Linking/correcting parent-account relationships is a distinct account-hierarchy maintenance task not covered by any of the 111 synthesized journeys; GAP.
- **#35 Adding Add-on** (Support): Adding add-ons via Modify Order is a generic modify-order capability touched on tangentially in several activation journeys (e.g. UJ-058 Modify FWA CPE) but no journey specifically covers general add-on addition across MSISDNs; treated as a GAP.
- **#36 Adding Multi-SIM/I-Watch** (Support): Multi-SIM/I-Watch addition via modify/customization order is referenced only as a workshop topic (Day 5 Session 2) but has no dedicated synthesized journey entry; GAP.
- **#37 Updating Special Management** (Support): Selecting/auto-stamping 'Special Management' classification on an account is a narrow configuration task with no corresponding journey; GAP.
- **#38 Deleting Add-on** (Support): Deleting add-ons via Modify Order is the inverse of row 35 and likewise has no dedicated journey entry; GAP.
- **#39 Deleting Multi-SIM/I-Watch** (Support): Deleting Multi-SIM/I-Watch has no corresponding synthesized journey; GAP.
- **#43 Prorata Calculator** (Support): The pro-rata billing calculator/SMS tool is a standalone billing utility not represented among the 111 journeys; GAP.
- **#54 Primary number** (Support): Adding/changing the Primary Number field via Modify Order is a granular field-update task with no dedicated synthesized journey; GAP.
- **#56 IOT Shared pool update** (Support): IoT/M2M shared data pool modification is only discussed narratively in Day 11 Session 2/Day 12 workshops on enterprise IoT services but has no discrete synthesized journey entry (UJ-006 Enterprise/IoT Order-to-Billing Flow is the closest but is a broader flow, not this specific modify-pool task); GAP.
- **#57 EBU portal Access** (Support): Granting EBU customer portal access via account affiliation/chooser access is an enterprise account-administration task with no corresponding journey in the 111; GAP (and it borders on an Access/Permission-type item).
- **#59 Adjustment Queue Change** (Support): Re-routing an adjustment's queue is a narrow back-office workflow-task not covered by UJ-001 (Bulk Adjustment Submission) or any other journey; GAP.
- **#62 IOT shared data pool addon** (Support): Adding a 1GB data addon to an IoT shared pool is a granular enterprise configuration step with no dedicated synthesized journey; GAP.
- **#63 Price override EBU** (Support): Manual price override on an EBU order line item is a distinct pricing-override capability not represented among the 111 journeys; GAP.
- **#66 Closing Order Activity in QUEUE** (Support): Closing an order-related task in a work queue is a generic queue-management workflow-task with no dedicated journey; GAP.
- **#70 Create new orders** (Support): Generic creation of a modification/customization order is implicit across many activation/modify journeys (e.g. UJ-058) but as a standalone generic capability it isn't independently represented; treated as a GAP since it's broader than any single matched journey.
- **#71 MOI Validation** (Support): MOI (Mode of Identification) validation is referenced as a sub-step embedded within several activation journeys (e.g., new postpaid/prepaid activations) rather than existing as its own synthesized journey entry; GAP as a standalone capability.
- **#72 Adding Mesh Addon** (Support): Adding/deleting Mesh add-ons to a broadband bundle is a granular modify-order capability with no dedicated synthesized journey; GAP.
- **#73 Book WFM ID** (Support): Booking a WFM appointment from a trouble ticket is a sub-step embedded within several install/activation journeys (e.g., UJ-037, UJ-057, UJ-066) but as a standalone TT-triggered WFM booking action it has no distinct journey; GAP.
- **#76 View/Reschedule WFM appointment** (Support): Viewing/rescheduling a WFM appointment from a TT is a granular scheduling action not represented as its own synthesized journey; GAP.
- **#77 Installation WFM AID Creation** (Support): Booking WFM appointments for modification orders needing engineer action overlaps with installation steps inside journeys like UJ-037/UJ-057/UJ-066 but is not itself a separately catalogued journey; GAP.
- **#79 Hot Bills** (Support): Viewing/downloading Hot Bills is a billing utility/view referenced narratively in Day 10 Session 1 workshop but has no dedicated synthesized journey; GAP.
- **#84 Pre-approved (Safwa/Enterprise) Credit Limit** (Support): Safwa/Enterprise-segment pre-approved credit limit updates have no corresponding synthesized journey (the matched consumer/HRN credit-limit journeys, e.g. UJ-083/UJ-084, do not cover this enterprise/Safwa segment); GAP.
- **#85 Credit Limit Reason** (Support): Recording a credit-limit-change reason code is a granular field-update task with no dedicated journey; GAP.
- **#90 Upload Bulk Notes** (Support): Bulk note upload at account level (noted as not available in Open UI, done via SR) has no corresponding synthesized journey; GAP.
- **#94 Delinking of Account** (Support): Removing duplicate/wrong contacts from an account is a distinct data-cleanup workflow-task with no dedicated journey; GAP.
- **#95 Change of Segment** (Support): Correcting a wrongly tagged customer segment at account level is a granular field-correction task with no corresponding journey; GAP.
- **#98 Account Level Bundle - IOT Shared Pool** (Support): Activation/billing/disconnection of an account-level IoT shared pool bundle is discussed narratively in enterprise IoT workshops (Day 11-12) but has no discrete synthesized journey entry distinct from the broader UJ-006 Enterprise/IoT Order-to-Billing Flow; GAP.
- **#102 Bulk Close Tickets** (Manage): No synthesized journey covers a bulk multi-account/MSISDN ticket closure operation; UJ-022 covers single ticket handling only, so this is a gap.
- **#103 View/Add/Delete Bell Notification** (Manage): No journey in the list addresses account-level notification bell management; this is a standalone UI feature not represented as a detailed journey.
- **#104 Add Attachments** (Manage): Generic attachment-upload capability across Account/Contact/Activity/TT has no dedicated journey entry; it's a cross-cutting UI feature not modeled as its own journey.
- **#106 Update Contact details** (Manage): Generic contact field-value update is not covered by any specific synthesized journey (no CRM/contact-maintenance journey exists in the list).
- **#107 Update Address** (Manage): Generic address field update has no corresponding detailed journey; only Home Move (UJ-039/UJ-067) covers service-address change with fiber/5G implications, but a simple address field edit is distinct and not covered.
- **#110 Manage Bill Limit** (Manage): Bill Limit configuration appears as a step within new-postpaid-activation journeys (e.g., UJ-078, UJ-079, UJ-080) but there is no standalone post-activation 'Manage/Update Bill Limit via Modification Order' journey, so this specific modify-order capability is a gap.
- **#111 Edit Billing Email Address** (Manage): Generic billing email field update has no corresponding synthesized journey.
- **#112 Change Bill Language** (Manage): No journey addresses changing the bill language preference; this is a gap.
- **#113 Change Bill Type** (Manage): No journey addresses changing bill type (e.g., paper/e-bill or similar); this is a gap.
- **#115 Email Update in Contacts** (Manage): Generic contact email field update has no corresponding synthesized journey (duplicate-style task to #106/#111, still unmatched).
- **#119 Account Affliation for chooser** (Manage): No journey covers making a contact an 'affiliated chooser' at account level; this is a gap.
- **#120 Add chooser** (Manage): No journey covers adding a chooser-role contact to an account; this is a gap.
- **#121 Remove Chooser** (Manage): No journey covers removing/demoting a chooser contact; this is a gap.
- **#122 MSISDIN Swap** (Manage): This describes swapping the MSISDN on a promotion line via reserved-number/CR process, which is distinct from SIM Swap (UJ-020/UJ-090/UJ-091, which swaps the physical SIM for the same number) and TON/number-transfer journeys; no journey covers changing the number itself on an existing line, so this is a gap.
- **#123 Billing address update** (Manage): Generic billing address field update has no corresponding synthesized journey (same class of gap as address/contact updates).
- **#131 Add/Delete Devices from installed assets** (Manage): No journey covers post-activation modify-order device add/delete against installed IPTV/ONT/CPE bundles; this is a gap.
- **#132 Create Device Change orders** (Manage): Device change via modify order with WFM appointment is related to UJ-058 Modify FWA Indoor CPE Serial Number but that is scoped specifically to FWA Indoor CPE serial changes, not general OSN/CPE/Broadband device-change orders across bundle types, so this broader capability is a gap.
- **#133 Public IP addition/Deletion** (Manage): No journey covers adding/removing a public IP on the broadband bundle via modify order; this is a gap.
- **#134 Device Lock in Updation** (Manage): No journey covers updating the device upgrade/lock-in identifier on the broadband bundle; this is a gap.
- **#136 Update Credit Limit** (Manage): Credit limit appears as a configuration step within new-postpaid activation journeys (UJ-080, UJ-083, UJ-084) but there is no standalone post-activation 'Update Credit Limit' modify journey, so this specific capability is a gap.
- **#137 Device /Cable Charges - Addition/Deletion** (Manage): No journey covers adding/removing device/cable charges on the broadband bundle; this is a gap.
- **#138 VOIP Service Modification** (Manage): No journey covers customizing/modifying the VOIP service component of the broadband bundle; this is a gap.
- **#139 Bundle Addition/Deletion from Installed Assets** (Manage): No journey covers adding/removing entire CPE/Broadband/IPTV/VOIP bundles on an existing installed base via modify order; this is a gap.
- **#140 OSN Packages Modification** (Manage): No journey covers modifying OSN STB packages within the IPTV bundle; this is a gap.
- **#141 OSN Device Details Modification** (Manage): No journey covers modifying OSN STB device details; this is a gap (also near-duplicate of #140 in the catalog itself).
- **#142 OSN IPTV Contact & Mail ID Updation** (Manage): No journey covers updating OSN email/phone contact details tied to the IPTV bundle; this is a gap.
- **#143 Additional OSN Addition /Deletion** (Manage): No journey covers adding/removing an additional OSN subscription within the IPTV bundle; this is a gap.
- **#144 Fetch Password for Combo Box** (Manage): No journey covers the CPE 'fetch password' utility action for Combo Box devices; this is a gap.
- **#146 Credit Limit (Credit Control)** (Manage): Duplicate-style entry to #136/#147; credit control limit updates appear only as embedded steps in new-activation journeys, not as a standalone modify journey, so this remains a gap.
- **#147 Credit Limit** (Manage): Same as #136/#146 — credit limit update is only embedded within activation journeys (UJ-080/083/084), no standalone post-activation modify journey exists, so this is a gap.
- **#148 Collection exemption** (Manage): No journey covers exempting an account from collections activity; this is a gap.
- **#152 Pause Collections** (Manage): No journey covers pausing collections/dunning actions on an account; this is a gap.
- **#154 Changing Bill Cycles** (Manage): No journey covers changing the bill cycle date (1st to 15th or vice versa); this is a gap.
- **#155 Due date modification for Credit Alerts (OG Bar, Suspension, etc..)** (Manage): No journey covers modifying due dates tied to credit alert thresholds (OG Bar/Suspension triggers); this is a gap.
- **#156 Change Payment Method** (Manage): No journey covers updating the customer's payment method; this is a gap.
- **#157 Change Payment terms** (Manage): No synthesized journey covers a generic 'update payment terms field value' workflow-task; billing-related journeys in the corpus (bulk adjustments, billing profile) are about adjustments/SOA, not payment-terms field changes, so this is a GAP.
- **#158 Bill Reprint** (Manage): No synthesized journey addresses the Billing Profile 'Bill View > Select Bill > Reprint' tab/action; this is a narrow UI action not covered by UJ-016 (post-port-in dunning) or any other billing journey, so it is a GAP.
- **#159 Disconnect MSISDN (Prepaid, Postpaid, Fiber, FWA) (Normal & Star Number) (normal & with suspension status)** (Disconnect): The blueprint's disconnection journeys (UJ-025 Disconnection Trouble Ticket variant, UJ-111 Disconnection Ticket Processing) are specifically trouble-ticket/retention-driven flows from the Day4 workshop, not the direct 'raise a Disconnect Order on MSISDN' workflow-task described here across all line types (prepaid/postpaid/fiber/FWA) and star-number/suspension variants; this broader direct-disconnect workflow is not separately represented, so it is a GAP relative to the detailed journey set.
- **#160 IOT mobility Disconnect** (Disconnect): No synthesized journey covers IoT/M2M service disconnection; the only IoT-related source (Business Process Day11 Session2, medium confidence, damaged recording) covers order/activation not disconnection, so this is a GAP.
- **#161 PTX disconnect** (Disconnect): No synthesized journey addresses PTX/EBU fulfilment backend disconnect verification; this enterprise-specific disconnect variant has no corresponding detailed journey entry, so it is a GAP.

</details>

<details><summary>View (29)</summary>

- **#45 View and Manage orders** (Support): A generic View capability on the Account/Order tabs, not a distinct end-to-end journey in the blueprint; no dedicated 'view orders' journey exists.
- **#46 View public notes** (Support): Simple UI view of notes field, not represented as a synthesized journey.
- **#47 View Attachments** (Support): Simple UI view capability with no corresponding journey entry in the blueprint.
- **#48 View Surepay balance** (Support): Balance view widget, not modeled as a journey; no Surepay-related journey exists in the 111.
- **#49 View Detailed Usage** (Support): Usage detail view, not a journey; no usage-viewing journey in the synthesized list.
- **#55 Check user ID/AM Code** (Support): Simple lookup/view, not a journey; no corresponding entry.
- **#61 CTI View** (Support): Computer-Telephony-Integration popup view, not a synthesized journey.
- **#64 View Adjustment** (Support): View-only screen for adjustments; the blueprint's UJ-001 covers bulk adjustment submission (a workflow), not a passive adjustment view, so this is a gap.
- **#65 View QUEUE** (Support): Queue view capability, not modeled as a journey.
- **#67 View Assets** (Support): Asset view screen, not a distinct journey in the blueprint.
- **#69 Audit Trail** (Support): Cross-entity audit/history view, not represented as a synthesized journey.
- **#74 View Installed assets/Order History/Orders/Billing Profile/Address/Contacts/ Trouble Tickets** (Support): Bundle of view-only tabs (arguably Customer 360-like) but no dedicated journey; closest is UJ-106 J017 Customer 360 which is a distinct named journey concept, yet this row is explicitly typed as a plain View so treated as a gap rather than a confident match.
- **#75 View Order failure Information in TT** (Support): View of failure info inside a Trouble Ticket, not itself a journey; general TT creation journey (UJ-022) doesn't cover this specific failure-info view.
- **#78 Credit Score** (Support): Credit score display view, not a synthesized journey.
- **#80 Account Hierarchy** (Support): Hierarchy view widget, not a journey.
- **#81 Bill Limit History** (Support): History view, not a journey; bill limit configuration journeys (UJ-078/079/080) cover setting/editing limits, not viewing history.
- **#82 Numbers Tab** (Support): Tab view of numbers, not a journey.
- **#86 Blacklist View** (Support): Blacklist status view, not a journey.
- **#87 View Catalog** (Support): Product catalog view, not a journey.
- **#88 View Line Item Attributes order Level** (Support): Order line-item attribute view, not a journey.
- **#92 View Archived Account Attachment** (Support): Archived attachment view, not a journey.
- **#93 View Archived Contact Attachment** (Support): Archived attachment view, not a journey.
- **#97 Access to all Queue** (Support): Explicitly responsibility/role-based access to queues, which belongs to the RBAC matrix rather than a user journey, even though typed as View here.
- **#100 Modification -Loyalty Number** (Support): View of Loyalty Membership ID field inside Contacts, not a synthesized journey.
- **#108 Manage Happy Offers** (Manage): Offer accept/interested/reject view-workflow hybrid with no corresponding 'Happy Offers' journey among the 111.
- **#135 View Installation Files** (Manage): File view screen, not a journey.
- **#145 View Agent ID & Fixed Agent ID in Account** (Manage): Field-level view, not a journey.
- **#150 Credit Management Tab** (Manage): Tab view for credit alerts, not a distinct journey.
- **#153 All type of Credit Alerts (view, create & export)** (Manage): Credit alert view/create/export capability with no corresponding synthesized journey covering credit alert management.

</details>

<details><summary>Action (27)</summary>

- **#14 Creating Account** (Sales): This is a low-level manual back-office Action (creating an account for non-Guided-Journey activations) with no dedicated journey entry among the 111; it's an underlying step referenced inside sales journeys but not itself synthesized as a journey - GAP.
- **#16 Create Billing Profile** (Sales): Manual Action for creating a billing profile outside Guided Journeys; no standalone journey entry exists for this discrete back-office action - GAP.
- **#17 Number Reservation** (Sales): Standalone Action for reserving mobile/fixed numbers from Block/Transitional status; not represented as its own journey in the list (only appears embedded within activation journeys) - GAP.
- **#18 Short Code Reservation** (Sales): EBU short code reservation Action has no corresponding journey entry among the 111 - GAP.
- **#28 Payment Posting** (Support): Manual payment posting action on a billing profile is not covered by any of the 111 journeys, which focus on sales/activation/support processes, not billing operations - GAP.
- **#29 Adjustment Posting** (Support): While UJ-001 covers 'Bulk Adjustment Submission (Target State)', this row describes manual single adjustment posting at MSISDN/Account/Billing level which is a distinct discrete action; only a partial/loose overlap, treated as GAP.
- **#40 Send SMS** (Support): Manual SMS sending action from Account/TT page has no corresponding synthesized journey - GAP.
- **#42 Send Bill (PDF & XLSX)** (Support): Emailing bills from billing profile is a discrete action with no matching journey entry - GAP.
- **#44 View & Export Bill (PDF & XLSX)** (Support): Bill viewing/export action has no corresponding journey in the list - GAP.
- **#51 Get PIN/PUK** (Support): One-click PIN/PUK retrieval action has no dedicated journey entry - GAP.
- **#53 Add Discount** (Support): Adding a discount via Modify Order is a discrete action not represented as its own journey among the 111 - GAP.
- **#58 Export data from Seibel EBU** (Support): Exporting installed-assets data from Siebel EBU is a UI export action with no corresponding journey entry - GAP.
- **#60 Export Detailed Usage** (Support): Usage export action has no matching journey in the synthesized list - GAP.
- **#105 Delete Discount** (Manage): Deleting a discount via Modify Order is a discrete action with no corresponding journey entry - GAP.
- **#109 Barring** (Manage): Applying barring via Modification Order is not represented as a standalone synthesized journey (distinct from suspension/resume journeys UJ-021/UJ-107) - GAP.
- **#114 Unbarring** (Manage): Removing barring via Modification Order has no corresponding synthesized journey entry - GAP.
- **#125 Export Trouble Ticket data** (Manage): TT data export action has no matching journey entry - GAP.
- **#126 Export Activities data** (Manage): Activities export action has no matching journey entry - GAP.
- **#127 Export Orders Data** (Manage): Orders data export action has no matching journey entry - GAP.
- **#128 Order Cancellation** (Manage): Generic order cancellation tab action (pre-submission) is not synthesized as its own journey, though it's a step within various order journeys - GAP.
- **#129 Abandon Order** (Manage): Abandon order tab action has no corresponding standalone journey entry - GAP.
- **#149 View, Add & Remove blacklist flag (with export option)** (Manage): Blacklist flag management action has no corresponding synthesized journey - GAP.
- **#151 Export data from Siebel (barring & suspension credit alerts, promise to pay etc.)** (Manage): Credit alerts export action has no matching journey entry - GAP.
- **#162 Automatic SMS Templates** (Manage): SMS template configuration/upload for ticket triggers is an admin/config action, not a customer/agent journey, and has no corresponding entry - GAP.
- **#163 Manual SMS Templates** (Manage): Manual SMS template upload/configuration has no corresponding synthesized journey - GAP.
- **#164 Hashtags** (Manage): Hashtag configuration for ticket/call tracking is an admin/config action with no corresponding journey - GAP.
- **#165 Actual Issue** (Manage): Actual Issue configuration upload for RCA tracking is an admin/config action with no corresponding journey - GAP.

</details>

<details><summary>Access/Permission (2)</summary>

- **#68 TON Access** (Support): Access/Permission type row for TON queue access based on responsibility; this belongs in the RBAC Matrix, not the journey catalog, even though TON itself is covered by UJ-019/UJ-024/UJ-040/UJ-041.
- **#91 Access to CDM Trouble Ticket Queue** (Support): Access/Permission row for trouble ticket queue visibility based on role; corresponds to RBAC Matrix, not a journey.

</details>

---

## 2. Journeys with No Step-Level Detail

Originally 16 of 111 synthesized journeys had zero rows in `workflow-execution-matrix.md`. **Stage K re-mining recovered step-level detail for 15 of these 16** by re-reading the original source documents (in several cases the full document simply had not been read past its summary); their new workflow-execution-matrix entries are tagged `(Stage K recovered detail)`. **1 remains genuinely gapped** — see [gap-resolution-stage-k.md](gap-resolution-stage-k.md) for the full evidence/rationale behind every item below.

### Recovered (15)

- **UJ-004: Enterprise Account Creation** — recovered, see `gap-resolution-stage-k.md`
- **UJ-016: Post-Port-In Billing and Dunning** — recovered, see `gap-resolution-stage-k.md`
- **UJ-032: KID-in-Use Exception Handling** — recovered, see `gap-resolution-stage-k.md`
- **UJ-037: New FWA 5G Outdoor Activation (Business Process, WFM appointment)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-051: Order Correction (reject-and-resubmit)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-052: GigaHome Subscription Acceptance Form (customer sign-off before activation, v3)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-055: New Fixed Line Tablet — Normal Activation, Order Approval Rejection and Correction** — recovered, see `gap-resolution-stage-k.md`
- **UJ-061: New FWA Postpaid Outdoor Order (Desktop, WFM installation)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-071: MNP Prepaid Port-In (Tablet)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-099: Fixed Line Port In (BRSD)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-100: Fixed Line Port Out (BRSD)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-101: Fiber Termination (BRSD)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-102: Fixed Line RFS (BRSD)** — recovered, see `gap-resolution-stage-k.md`
- **UJ-109: Complaints Management Process / Agent Ticket Creation** — recovered, see `gap-resolution-stage-k.md`
- **UJ-110: MNP Port Out Ticket Processing (NPAS auto-created, Process Overview variant)** — recovered, see `gap-resolution-stage-k.md`

### Still gapped (1)

- **UJ-006: Enterprise/IoT Order-to-Billing Flow** — no step-level detail exists in the source; see `gap-resolution-stage-k.md` for the Recommended Assumption

## 3. Personas with No RBAC Entries

5 of 66 personas have zero normalized RBAC entries — their responsibilities are documented in `personas.md` but no source document was specific enough about which screens/actions they can access to normalize into `rbac-matrix.md`.

- PERSONA-013: EBU PM (Project Manager)
- PERSONA-045: DSA / Store / Field Engineer (sales channel attribution)
- PERSONA-053: Customer Care / Telesales & Retention / Complaints / Direct Sales / Mass Market / Mini Store / Retail & Franchise agents (role families)
- PERSONA-054: Sales / Fulfilment (VFID-KID mapping team)
- PERSONA-055: Field Survey Team

## 4. Underspecified Entities

Originally 27 of 83 entities had neither `validation_rules` nor `lifecycle_states` evidenced. **Stage K re-mining recovered lifecycle/validation detail for 20** (merged into `domain-model.md`), **reclassified 5 as not applicable** (catalog/reference constructs that are not stateful business objects), and **2 remain genuinely gapped**. See [gap-resolution-stage-k.md](gap-resolution-stage-k.md) for the full evidence/rationale behind every item below.

### Recovered (20)

- **ENT-019: Smart Device (Smart Viper)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-024: Service Account** — recovered, see `gap-resolution-stage-k.md`
- **ENT-029: Device Installment (DOI)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-031: Manual Suspension ('Park My Number') Plan** — recovered, see `gap-resolution-stage-k.md`
- **ENT-033: Vodafone ID (VFID)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-044: User / Agent / Responsibility (Siebel access role)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-047: Employer / Company (B2B2C)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-049: Installation Checklist** — recovered, see `gap-resolution-stage-k.md`
- **ENT-051: Audit Trail** — recovered, see `gap-resolution-stage-k.md`
- **ENT-053: UIM Custom Object (SIM/CPE inventory record)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-055: Donor Details / Donor Attachment (MNP)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-058: Star Number Value Tier** — recovered, see `gap-resolution-stage-k.md`
- **ENT-059: Deposit / Credit Limit (Consumer)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-071: IMS Site/ZSB (Zone-Street-Building)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-072: RFS (Ready For Sale) Record / Status** — recovered, see `gap-resolution-stage-k.md`
- **ENT-073: SMS Template** — recovered, see `gap-resolution-stage-k.md`
- **ENT-074: APN (Access Point Name)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-077: Status Model (Order/Asset lifecycle states)** — recovered, see `gap-resolution-stage-k.md`
- **ENT-078: IPTV / STB (Set-Top Box) bundle** — recovered, see `gap-resolution-stage-k.md`
- **ENT-083: Application Form Types (Enterprise/SME-SOHO)** — recovered, see `gap-resolution-stage-k.md`

### Reclassified — not applicable (5)

- **ENT-061: CRM Journey/Feature Catalog (Page Type Row)** — not a stateful record needing a lifecycle/validation model; see `gap-resolution-stage-k.md`
- **ENT-062: Functional Cluster** — not a stateful record needing a lifecycle/validation model; see `gap-resolution-stage-k.md`
- **ENT-063: Type Taxonomy Category** — not a stateful record needing a lifecycle/validation model; see `gap-resolution-stage-k.md`
- **ENT-066: Addon/Discount** — not a stateful record needing a lifecycle/validation model; see `gap-resolution-stage-k.md`
- **ENT-076: Data Field (Annex data catalogue)** — not a stateful record needing a lifecycle/validation model; see `gap-resolution-stage-k.md`

### Still gapped (2)

- **ENT-042: Reject Reason (Order Rejection)** — no lifecycle/validation detail exists in the source; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **ENT-043: Notification / SMS Message (OSB)** — no lifecycle/validation detail exists in the source; see `gap-resolution-stage-k.md` for the Recommended Assumption

## 5. Orphan Requirements (no linked journey or screen)

Originally 109 of 308 requirements (~35%) had no deterministic link to any journey or screen in `traceability-matrix.md`. **Stage K re-mining recovered new evidence for 77** — of these, new journey and/or screen links were confidently established (via literal ID citation or keyword-overlap matching) for a subset, and the rest gained real new descriptive detail without a clean structural link (see `gap-resolution-stage-k.md` for which is which, and `traceability-matrix.md` for the current, Stage-K-updated link counts). **19 were reclassified as not applicable** (cross-cutting architectural/program constraints — Assumptions, Dependencies, Open Items — that are not discrete journey/screen capabilities by nature). **13 remain genuinely gapped**. See [gap-resolution-stage-k.md](gap-resolution-stage-k.md) for the full evidence/rationale behind every item below.

<details><summary>Recovered (77)</summary>

- **REQ-001: Billing Profile Unchangeable Identifier** — recovered, see `gap-resolution-stage-k.md`
- **REQ-002: Billing-in-Advance/Arrears/Hybrid Flag** — recovered, see `gap-resolution-stage-k.md`
- **REQ-005: DXP as Single Consumption Layer for CRM-BRM Content** — recovered, see `gap-resolution-stage-k.md`
- **REQ-008: On-Demand Penalty/Commitment Calculation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-009: Bill Simulation Feature Distinct from Hot Bill** — recovered, see `gap-resolution-stage-k.md`
- **REQ-012: Volumetric Discount Proration on Mid-Cycle Change** — recovered, see `gap-resolution-stage-k.md`
- **REQ-013: Billing Profile / Recipient Email Audit Trail** — recovered, see `gap-resolution-stage-k.md`
- **REQ-021: Volumetric Discount Auto-Downgrade on Connection Drop** — recovered, see `gap-resolution-stage-k.md`
- **REQ-033: Controlled/Governed Excel Export Feature** — recovered, see `gap-resolution-stage-k.md`
- **REQ-039: Large Excel/CSV Export Handling** — recovered, see `gap-resolution-stage-k.md`
- **REQ-047: Digital signature pad migration off OpenUI** — recovered, see `gap-resolution-stage-k.md`
- **REQ-048: CAF unique serial/ID and naming convention** — recovered, see `gap-resolution-stage-k.md`
- **REQ-049: WinCash integration for zero-payment transactions** — recovered, see `gap-resolution-stage-k.md`
- **REQ-052: Configurable business-admin-controlled CAF highlighted T&Cs** — recovered, see `gap-resolution-stage-k.md`
- **REQ-053: In-progress journeys list on agent login page** — recovered, see `gap-resolution-stage-k.md`
- **REQ-054: Role/team-based access model replacing Siebel profile-based access** — recovered, see `gap-resolution-stage-k.md`
- **REQ-055: Device/tablet rendering only, not journey governance** — recovered, see `gap-resolution-stage-k.md`
- **REQ-056: Confirmation message updated to reflect order submission (not activation)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-062: Manager-level bypass to edit QID number field only** — recovered, see `gap-resolution-stage-k.md`
- **REQ-072: Automate plan penalty, device dues and locking charges calculation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-080: Number management portal search experience definition** — recovered, see `gap-resolution-stage-k.md`
- **REQ-105: Store all MOI-returned name fields (up to 5-6) and print on bill without truncation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-106: Use MOI API as primary ID-data source with Tarasol/manual fallback** — recovered, see `gap-resolution-stage-k.md`
- **REQ-112: Mandatory ZSB detail capture requirement (refs 2.1.15 and 3.1.12)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-115: Vodafone Fibre Supplementary Form required for Home Fibre** — recovered, see `gap-resolution-stage-k.md`
- **REQ-116: Direct-marketing consent with USSD opt-out code** — recovered, see `gap-resolution-stage-k.md`
- **REQ-122: Retail cannot change primary contact** — recovered, see `gap-resolution-stage-k.md`
- **REQ-123: Bill calculator SMS is a capability, not a full journey** — recovered, see `gap-resolution-stage-k.md`
- **REQ-129: Bilingual (English/Arabic) customer-facing forms** — recovered, see `gap-resolution-stage-k.md`
- **REQ-138: Appointment booking cannot be cancelled once confirmed** — recovered, see `gap-resolution-stage-k.md`
- **REQ-139: ECR Details field restricted to Fulfilment team entry** — recovered, see `gap-resolution-stage-k.md`
- **REQ-140: Alt. phone # must be a local mobile number used for notifications** — recovered, see `gap-resolution-stage-k.md`
- **REQ-141: Separate billing-email opt-in requires confirmation modal** — recovered, see `gap-resolution-stage-k.md`
- **REQ-146: E-signature required to complete CAF before order submission** — recovered, see `gap-resolution-stage-k.md`
- **REQ-153: Order Completion Notification Must Include Order Number** — recovered, see `gap-resolution-stage-k.md`
- **REQ-154: System Must Support B2B2C Employer Association at Contact Creation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-163: FMS CPE Bundle Configuration Must Support Indoor IDU, ODU, and Outdoor IDU Equipment Sub-Types** — recovered, see `gap-resolution-stage-k.md`
- **REQ-164: WFM Appointment Booking Must Integrate with Oracle Field Service Cloud for Technician Scheduling and Dispatch** — recovered, see `gap-resolution-stage-k.md`
- **REQ-165: CPE/SIM Inventory Must Be Transferable from Warehouse Team to Assigned Technician Before Installation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-166: Technician Must Complete Serial Number Check (Device Activation) Before Service Activation Succeeds** — recovered, see `gap-resolution-stage-k.md`
- **REQ-167: Field Technician Must Capture Customer Signature at Installation Checklist and End of Activity** — recovered, see `gap-resolution-stage-k.md`
- **REQ-168: CSR Must Be Able to Modify Installed CPE Serial Number via Account 360 Modify Action** — recovered, see `gap-resolution-stage-k.md`
- **REQ-169: CPE Attribute Modification Must Generate a Modification-Type Sales Order with Attribute-Level Audit** — recovered, see `gap-resolution-stage-k.md`
- **REQ-170: Address Step Must Validate Required Fields Before Save** — recovered, see `gap-resolution-stage-k.md`
- **REQ-171: SIM/CPE Serial Validation Must Call Backend UIM Inventory Service in Real Time** — recovered, see `gap-resolution-stage-k.md`
- **REQ-172: Backend Exceptions Must Surface Error/Service Codes and a Support Reference Number to the User** — recovered, see `gap-resolution-stage-k.md`
- **REQ-174: CAF Generation Must Offer Multiple Form Types (Digital, Manual, Touch Screen)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-175: System Must Notify Customer That Signed CAF Copy Will Be Emailed** — recovered, see `gap-resolution-stage-k.md`
- **REQ-184: Connection Details advisory for existing multiple postpaid connections** — recovered, see `gap-resolution-stage-k.md`
- **REQ-204: Manager-only menu must scope to Home, Order Approval, Manage Leads, Leads Queue** — recovered, see `gap-resolution-stage-k.md`
- **REQ-214: Number reservation returns a confirmable success token (SBL-EXL-00151 code family)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-215: CAF attachment upload supports file management (add/delete)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-216: Activity/wrap-up step requires call-disposition metadata and comment** — recovered, see `gap-resolution-stage-k.md`
- **REQ-217: Complex product (bundle) customization/runtime instantiation UI** — recovered, see `gap-resolution-stage-k.md`
- **REQ-221: Add-on/Discount step must clearly indicate empty state when nothing applicable** — recovered, see `gap-resolution-stage-k.md`
- **REQ-222: Star/Free/Reserved number tab selection during Number Selection step** — recovered, see `gap-resolution-stage-k.md`
- **REQ-223: B2B2C tagging must persist onto Account (Special Management) and Contact (Employer)** — recovered, see `gap-resolution-stage-k.md`
- **REQ-224: System must prompt override confirmation when Special Management account attempts non-B2B2C journey** — recovered, see `gap-resolution-stage-k.md`
- **REQ-225: Order status must reflect fulfillment progression (Pending -> Open/In Progress -> Complete) with per-line status context** — recovered, see `gap-resolution-stage-k.md`
- **REQ-227: System must capture customer e-signature as part of CAF completion** — recovered, see `gap-resolution-stage-k.md`
- **REQ-239: Present a key-terms summary (lock-ins, penalties, fencing) before CAF signature** — recovered, see `gap-resolution-stage-k.md`
- **REQ-240: Attachments must be categorized (CAF, QID) with online-only warm-archive retention and no deletion** — recovered, see `gap-resolution-stage-k.md`
- **REQ-242: CAF/attachment file size must not exceed ~4MB** — recovered, see `gap-resolution-stage-k.md`
- **REQ-244: Design of new stack must be business-driven rather than technology-driven** — recovered, see `gap-resolution-stage-k.md`
- **REQ-245: ECR to be decommissioned and not integrated with new stack; MCCR capabilities absorbed into new stack; VSA/BSA out of scope** — recovered, see `gap-resolution-stage-k.md`
- **REQ-246: Consumer segment to be completed before enterprise segment in delivery sequencing** — recovered, see `gap-resolution-stage-k.md`
- **REQ-264: Journey initiation from Agent Desktop with role-based authorisation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-266: Draft order/milestone persistence for resume** — recovered, see `gap-resolution-stage-k.md`
- **REQ-275: Notification templates/triggers/recipients required** — recovered, see `gap-resolution-stage-k.md`
- **REQ-278: Order Billing Profile must match Line Items' Billing Profile** — recovered, see `gap-resolution-stage-k.md`
- **REQ-279: Business account cannot submit pending order if open order exists** — recovered, see `gap-resolution-stage-k.md`
- **REQ-280: Serial Number required for SIM CARD product** — recovered, see `gap-resolution-stage-k.md`
- **REQ-281: All Payments must be Authorized before order proceeds** — recovered, see `gap-resolution-stage-k.md`
- **REQ-285: IoT vs Non-IoT MSISDN length validation** — recovered, see `gap-resolution-stage-k.md`
- **REQ-286: Notification and Feedback Capability** — recovered, see `gap-resolution-stage-k.md`
- **REQ-306: Signature Capture Method Differs by Channel** — recovered, see `gap-resolution-stage-k.md`
- **REQ-307: Prepaid Offshore Manual Activation by Third Party** — recovered, see `gap-resolution-stage-k.md`

</details>

<details><summary>Reclassified — not applicable (19)</summary>

- **REQ-051: Screens align to PIP pre-built APIs rather than new custom APIs** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-060: Bill cycle change eligibility must be configurable, not hard-coded** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-088: Digitalize the supplementary form** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-110: Build reusable capability building blocks exposed via DXP layer** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-117: Enforce mandatory-field validation catalog on contact records** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-118: Screen-count estimation model for stack modernization delivery (1,991 total screens)** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-119: Guided Journey vs Vanilla Action classification for CRM journeys** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-120: 165-row CRM journey/feature inventory classified into 5 Type categories** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-121: Traceability model requirement: User Journey to Access/Permission hierarchy** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-145: Required ID front/back photo uploads before Contact step continues** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-231: System must display existing prepaid/postpaid connection counts before allowing a new/converted connection to proceed** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-256: No non-functional requirements documented (gap)** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-257: Requirement status/owner/traceability missing (governance gap)** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-267: Acceptance criteria updates for 18 named requirements (v2.0)** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-268: Catalogue/eligibility/discount/number-pricing rules as configuration not hard-coded** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-269: Siebel CRM remains system of record** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-270: Existing MOI/IDWise/Qnomy/WinCash/UIM/Medilia interfaces reused without contract change** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-271: Field-level spec gaps to be supplied by VFQ** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`
- **REQ-305: Digitalized Consumer Application Forms** — categorically not journey/screen-attributable; see `gap-resolution-stage-k.md`

</details>

<details><summary>Still gapped (13)</summary>

- **REQ-024: Connection Count Visibility in Siebel and on Invoice** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-057: Multiple bill email recipients (CC) and multiple email types per contact** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-058: Asynchronous email verification before next bill generation** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-059: Agents view-only for AutoPay status/failure reason (regulatory restriction)** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-061: Auto-resolved ticket even on disallowed bill cycle change** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-081: QID scan-and-attach required only for transactions with account/service change** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-085: Auto-select numbers for fixed/prepaid to reduce agent clicks (mobile postpaid excluded)** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-086: Pre-select next available appointment date/slot bounded by SLA cluster** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-161: Appointment Booking Must Enforce Slot Capacity Limits and Show 'Full' State** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-272: Plan-price-to-Star-Number-price eligibility matrix required** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-273: CAF template matrix by role/channel/service type required** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-277: HRN advance payment matrix required** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **REQ-308: MVA Customer-Initiated Requests Routed as Reports** — no journey/screen link recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption

</details>

## 6. Screens with No Field-Level Detail

Originally 85 of 213 screens had zero entries in `field-inventory.md`. **Stage K re-mining recovered field/section detail for 73** (merged into `field-inventory.md`, tagged `(Stage K recovered field/section detail)`). **7 were reclassified as not applicable** (the screen is a confirmation dialog, viewer, or other non-form surface already at its evidence ceiling — there is no field list to recover because there was never a form). **5 remain genuinely gapped**. See [gap-resolution-stage-k.md](gap-resolution-stage-k.md) for the full evidence/rationale behind every item below.

<details><summary>Recovered (73)</summary>

- **SCR-002: PowerApps Bulk Adjustment Portal (Current State)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-009: Bulk Activation Control Sheet (Excel Macro, Current State)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-013: Enterprise Process Knowledge Base Dashboard** — recovered, see `gap-resolution-stage-k.md`
- **SCR-015: Enterprise Invoice (Excel)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-016: Siebel Excel Export (Uncontrolled)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-023: Orders page** — recovered, see `gap-resolution-stage-k.md`
- **SCR-027: Eligibility Web Portal (external)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-028: Appointment booking / calendar selection screen** — recovered, see `gap-resolution-stage-k.md`
- **SCR-029: Ticket detail screen (public notes / bell icon notifications)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-032: CAP Signature Screen** — recovered, see `gap-resolution-stage-k.md`
- **SCR-042: QID Offers grid** — recovered, see `gap-resolution-stage-k.md`
- **SCR-053: Siebel Web Call Center Home page (tile grid)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-060: TM SR Queue View — Order Activities Queue** — recovered, see `gap-resolution-stage-k.md`
- **SCR-062: Reject Order modal** — recovered, see `gap-resolution-stage-k.md`
- **SCR-066: GigaHome Subscription Acceptance Form (bilingual paper/PDF form)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-074: Attachment Viewer (Qatari ID/CAF/Supplementary Form)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-076: CAF Dropdown (Digital/Manual/Touch Screen)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-077: New FWA Tile / Home Screen** — recovered, see `gap-resolution-stage-k.md`
- **SCR-084: CAF Modal (FWA)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-086: Line Items > Appointments Sub-tab** — recovered, see `gap-resolution-stage-k.md`
- **SCR-088: Resource Inventory Import / Field Service Import Add-in** — recovered, see `gap-resolution-stage-k.md`
- **SCR-089: Move Dialog (Technician Reassignment)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-090: Inventory Management — Non-Serialized Inventory Transfer** — recovered, see `gap-resolution-stage-k.md`
- **SCR-091: OFS My Route (Technician)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-096: Installed Assets Grid (Account 360, FWA)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-098: Order Line Items > Attributes Tab (Change Audit)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-101: Account 360 View (FWA, created)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-102: Sales Order Detail (More Info tab)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-105: UIM Custom Object Summary** — recovered, see `gap-resolution-stage-k.md`
- **SCR-106: Order Entry (Backend Order Record)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-107: Manager Home Screen (Test Manager)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-108: Sales Order Record (Backend, Approved)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-109: Book Appointment / Book Unscheduled Appointment Step** — recovered, see `gap-resolution-stage-k.md`
- **SCR-111: End Activity Form** — recovered, see `gap-resolution-stage-k.md`
- **SCR-116: Home Move Checklist** — recovered, see `gap-resolution-stage-k.md`
- **SCR-119: Agent Home / App Launcher** — recovered, see `gap-resolution-stage-k.md`
- **SCR-120: MNP Guided Process - Choose process** — recovered, see `gap-resolution-stage-k.md`
- **SCR-121: MNP wizard step: Contact** — recovered, see `gap-resolution-stage-k.md`
- **SCR-122: MNP wizard step: Address** — recovered, see `gap-resolution-stage-k.md`
- **SCR-123: MNP wizard step: Billing** — recovered, see `gap-resolution-stage-k.md`
- **SCR-125: MNP wizard step: Plan (plan selection grid)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-127: MNP wizard step: Donor Attachment** — recovered, see `gap-resolution-stage-k.md`
- **SCR-129: MNP wizard step: CAF** — recovered, see `gap-resolution-stage-k.md`
- **SCR-130: Vodafone Customer Application Form (CAF, MNP variant)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-131: Siebel Sales Order screen (MNP)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-137: Account Summary** — recovered, see `gap-resolution-stage-k.md`
- **SCR-143: My Created Leads view** — recovered, see `gap-resolution-stage-k.md`
- **SCR-144: Manage Leads - My Team's Leads** — recovered, see `gap-resolution-stage-k.md`
- **SCR-147: All Leads across Org** — recovered, see `gap-resolution-stage-k.md`
- **SCR-148: Description edit popup** — recovered, see `gap-resolution-stage-k.md`
- **SCR-149: CallBack Date/Time picker** — recovered, see `gap-resolution-stage-k.md`
- **SCR-153: Cross Sales Offers step (Postpaid)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-154: Postpaid Contact step (wizard)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-155: Address step (Postpaid wizard)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-160: Payment step (wizard)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-161: CAF/Attachments step (Postpaid wizard)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-162: Activity step (call disposition, Postpaid wizard)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-163: Sales Order detail (back-office, Postpaid)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-164: Assets / Complex Assets view** — recovered, see `gap-resolution-stage-k.md`
- **SCR-168: Home / Guided Process 'Choose process' screen** — recovered, see `gap-resolution-stage-k.md`
- **SCR-172: Promotion Upgrades picker (modal)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-175: Order header / Order detail screen (Pre-to-Post)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-177: Postpaid - Contact wizard step (Pre-to-Post)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-181: Comments modal (Base Management)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-185: Account 360 View / Account Summary tile view** — recovered, see `gap-resolution-stage-k.md`
- **SCR-193: Prepaid Customer Application Form (unsigned)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-197: Order Approval Queue / Order Activities Queue (Tablet)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-201: RFS Portal** — recovered, see `gap-resolution-stage-k.md`
- **SCR-202: Account Summary (Account 360, CTI View)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-203: Asset Summary (CTI View)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-209: Agent Desktop (Journey initiation)** — recovered, see `gap-resolution-stage-k.md`
- **SCR-211: Tickets Dashboard** — recovered, see `gap-resolution-stage-k.md`
- **SCR-212: Ticket Status on VF App** — recovered, see `gap-resolution-stage-k.md`

</details>

<details><summary>Reclassified — not applicable (7)</summary>

- **SCR-057: Prepatched device detection dialog** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-065: Oracle Enterprise Manager / Service Bus Message Detail screen** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-069: Customer Application Form (CAF) Preview/Sign** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-072: Line Items Tab (Order)** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-134: MNP wizard step: Activity (Comments)** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-136: Order Entry - header/detail view (MNP)** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`
- **SCR-138: Mass Market Addons checklist modal** — not a data-entry form; no field list exists to recover; see `gap-resolution-stage-k.md`

</details>

<details><summary>Still gapped (5)</summary>

- **SCR-008: EBU Number Portal** — no field-level detail recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **SCR-026: DXP Product Catalog (target state)** — no field-level detail recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **SCR-142: My Leads list** — no field-level detail recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **SCR-159: Product Catalog / Plan step (Postpaid wizard)** — no field-level detail recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption
- **SCR-207: Contact Portal** — no field-level detail recoverable; see `gap-resolution-stage-k.md` for the Recommended Assumption

</details>

## 7. Modules with Zero Linked Journeys

These modules exist in `module-hierarchy.md` (i.e. have named features/capabilities) but have zero journeys linked to any of their features — they are built entirely from requirement-level and business-rule-level discussion, with no step-by-step walkthrough anywhere in the corpus:

- Billing & Adjustments
- Access, Roles & Approval Governance
- CAF, Attachments & Forms
- Platform Governance & Architecture

## 8. Traceability Workbook Reconciliation Gap — RESOLVED (Stage J)

`data/Vodafone_Requirement_Hierarchy_Traceability_Template.xlsx` (815 traceability rows, 180 actual requirement-inventory rows, 300-row gap-log sheet) was built independently in an earlier session directly from `CRM_Journeys_Final_Updated_with_Type.xlsx`'s Relationship-sheet analysis, using its own ID scheme (TP-xxxx/WF-xxx/TSK-xxx/VW-xxx/ACT-xxx/PERM-xxx). This blueprint's `traceability-matrix.md` uses a different, independently-derived ID scheme (REQ-xxx/UJ-xxx/BR-xxx/SCR-xxx/PERSONA-xxx).

**Resolved:** [Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx](Vodafone_Requirement_Hierarchy_Traceability_Template_RECONCILED.xlsx) cross-references all 815 rows (via their 180 underlying canonical Journey/Workflow/Task/View/Action/Permission items) to blueprint IDs — new appended columns on the `Traceability Matrix` and `Requirements Inventory` sheets (`Blueprint Ref ID/Type/Name/Confidence/Note`), plus a new `Reconciliation Method` sheet documenting the approach. No existing column, formula, or value in the original workbook was touched — `data/`'s original file is untouched; the reconciled copy lives in `blueprint/`.

- **Match rate:** 178 of 180 canonical items matched a blueprint entity (98.9%) — 42 High / 121 Medium / 15 Low confidence. Propagated across all 815 rows (each row uses its best-matching populated hierarchy level, not just the most specific): 674 High / 141 Medium, 0 unmatched.
- **Two genuine gaps surfaced** (the only 2 of 180 canonical items with no blueprint match):
  1. **UJ-002 "Create Upgrade TT"** — independently corroborates the User-Journey gap already found in §1 of this document from the 165-row master CRM catalog. Two independent sources agreeing is a meaningful confidence signal that this is a real, if minor, gap.
  2. **WF-015 "Retention / Happy Offers"** — **newly identified by this reconciliation**, not previously flagged anywhere in this blueprint. No module in `module-hierarchy.md` evidences a dedicated customer-retention/offer-management capability, despite the old workbook's workshop-derived Workflow taxonomy naming one. Recommend confirming with the business whether this is in scope for the DXP rebuild; if so, it needs its own Stage A-style extraction pass (no evidence currently exists in `blueprint/` to build from).
- **Residual caveat:** the reconciliation itself is keyword/name-based (not exhaustively hand-verified per row, given 815 rows) — treat Medium/Low confidence entries as a strong starting hypothesis, not a guaranteed-correct mapping. See the workbook's `Reconciliation Method` sheet for full methodology.

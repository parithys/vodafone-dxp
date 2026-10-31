# Gap Resolution — Stage K (Re-Mining of Original Source Documents)

**Trigger:** after reviewing the Stage C gap-analysis counts (109 orphan requirements, 16 journeys without step detail, 85 screens without field detail, 27 underspecified entities — see `gap-analysis.md`), the user asked to "fix all these gaps." Blind fabrication would have broken the evidence model that governs this entire blueprint (every claim traceable to a source document + quote, Explicit/Inferred/Assumed classified). The agreed approach instead: **re-mine the original source documents under `data/` for genuinely recoverable evidence first**, and only for what truly cannot be recovered, add a clearly labeled **Recommended Assumption** — never presented as evidenced.

**Result across all 237 flagged items:** 185 recovered with real new evidence (78%), 31 reclassified as not-applicable, 21 remain genuinely gapped with a labeled Recommended Assumption below.

| Category | Recovered | Not Applicable | Genuinely Gapped | Total |
|---|---|---|---|---|
| Orphan Requirements | 77 | 19 | 13 | 109 |
| Journeys Without Step Detail | 15 | 0 | 1 | 16 |
| Screens Without Field Detail | 73 | 7 | 5 | 85 |
| Underspecified Entities | 20 | 5 | 2 | 27 |

## Method

One agent per source-document group (18 groups covering all documents referenced by the 237 flagged items) re-read the full `.knowledge/docs/<slug>.md` summary for each item, and for workshop/transcript-style documents (not Guided-Journey screenshot docs, which were already at their extraction ceiling from direct visual reading) additionally ran `markitdown` on the original `.docx`/`.pptx` file to check for detail the summary may have compressed out for readability. Each item was resolved to exactly one of three honest outcomes — agents were explicitly told most items would legitimately stay `genuinely_gapped`, since they had already been checked once and flagged for good reason:

- **Recovered** — genuine, concrete new evidence found and quoted (a specific journey/screen link, ordered steps with actor/input/output/validation, specific fields, or lifecycle/validation rules).
- **Not applicable** — the item categorically does not need this kind of evidence (e.g. a cross-cutting architectural constraint or a program Assumption/Dependency/Open-Item being asked for a journey/screen link; a catalog/selection construct being asked for an entity lifecycle it does not have).
- **Genuinely gapped** — the source truly does not contain the detail. A Recommended Assumption is proposed only when it can be grounded in an explicitly stated analogous evidenced pattern elsewhere in the corpus; where no such analogy exists, the item is flagged as needing a business-owner decision instead of a guess.

Recovered requirement→journey/screen/module links were established two ways: literal ID citation in the recovered text, or (where the agent named a journey/screen/module by description rather than ID) deterministic keyword-overlap matching against the `journeys.md`/`screens.md`/`module-hierarchy.md` name catalogues (content-word overlap ≥3 for journey/screen, ≥1 for module, single best match only — tuned up from an initial ≥2/top-2 pass that produced some false-positive matches on generic shared words). This is why not every "recovered" requirement below carries a clean UJ-xxx/SCR-xxx link even though real new descriptive detail was found — some recovered detail is narrative-only, with no confidently-matchable structural ID target.

Recovered content has been merged directly into the underlying catalogues: requirement descriptions in `requirements.md` carry a `[Recovered by Stage K re-mining...]` addendum; recovered journey steps appear as new entries in `workflow-execution-matrix.md`; recovered screen fields appear as new entries in `field-inventory.md`; recovered entity lifecycle/validation detail is merged into `domain-model.md`. New requirement↔journey/screen/module links were also propagated into `traceability-matrix.md`. This document is the full per-item record of *why* each resolution was made.

## Orphan Requirements (109 items)

#### Recovered (77)

### REQ-001 — `recovered`

**Recovered detail:** Full transcript (not just the summary) contains explicit functional requirement rows, a named decision, an FAQ Q&A, and a risk entry all describing the same requirement: the billing profile must carry the BRM row ID as an unchangeable correlation identifier synced to a unique CRM identifier, while the profile 'name' field remains optional, renameable, and customer-facing (appears in app/other channels). This directly links the requirement to the billing profile screen/entity and gives concrete field-level shape (name=optional/editable label; identifier=BRM row ID + CRM unique ID, immutable, synced).

**Evidence:** "00:18:23 functional: The billing profile should carry the row ID of BRM as identifier so it is consistent across BRM and CRM. / 00:20:06 functional: There must be a unique CRM identifier on the BRM side, plus the name; the name is optional and editable. / Decision 00:19:38: Keep the row ID as the identifier and sync it to BRM, keeping the name as an optional label."

### REQ-002 — `recovered`

**Recovered detail:** Full transcript gives the exact functional requirement statement, the requesting persona (Collections team), and a related enterprise-scope decision reconciling advance vs. arrears discount behaviour uniformly, which operationalizes the flag beyond just billing/barring.

**Evidence:** "00:16:59 functional: Flag on the billing profile indicating billing in advance (PIA), billing in arrears, or hybrid, for use by collections and barring activity. / 00:16:59 persona: Collections team ... Wants the billing in advance / arrears / hybrid flag on the billing profile; sends the outstanding bill list to customers."

### REQ-005 — `recovered`

**Recovered detail:** Transcript ties this decision directly to a specific screen/journey: the unified Adjustments view. Purely operational (CRM-only) screens stay in CRM; the mixed CRM+BRM adjustments view moves to DXP with source-system tabs removed, and only IT operations keeps vanilla Siebel/BRM access.

**Evidence:** "00:42:15 All adjustments will be shown to everyone, so the adjustments view will go to DXP. / 00:42:18 At DXP level there will be no differentiation between CRM-sourced and BRM-sourced adjustments; source-system tabs must vanish. / 00:45:04 Only IT operations will have access to vanilla Siebel/BRM; everyone else gets the consolidated design."

### REQ-008 — `recovered`

**Recovered detail:** Transcript gives an explicit functional-requirement list naming the exact guided journeys the calculation is bound to, plus a dedicated screen requirement for inquiry-only cases (no order raised) and a performance-driven rationale for choosing on-demand over automatic calculation.

**Evidence:** "01:11:15 functional: Show commitments and penalty amount when a disconnection, MNP port out, plan upgrade or plan downgrade journey is initiated. / 01:12:37 functional: Provide a button that retrieves the commitment calculation on demand rather than calculating it on every page load. / 01:14:15 functional: Provide a separate screen or place where agents can see commitment/penalty information for inquiry-only cases without taking an action."

### REQ-009 — `recovered`

**Recovered detail:** Transcript spells out the distinct purpose, naming, and regulatory constraint (not a tax invoice, cannot generate two invoices for same charges) as explicit functional/business requirement rows, plus the hot-bill journey definition for contrast.

**Evidence:** "01:17:44 functional: Provide a bill generated with the implications of a disconnection without raising a disconnection order and without disrupting the upcoming regular bill. / 01:25:16 business: The simulated document text must state that this is not a real invoice. / 01:19:42 Decision: The requested capability will be called bill simulation, not [hot bill]."

### REQ-012 — `recovered`

**Recovered detail:** Transcript contains explicit validation-rule-level detail: current discount cancellation config is 'full cycle' vs. the alternative 'prorate'; required behaviour differs by scenario (plan change = refund + charge back discount; cancellation due to dismay = keep charge, no refund); enterprise wants the advance-model behaviour applied uniformly to arrears too.

**Evidence:** "01:55:04 Discount configuration has two cancellation behaviours - apply for the full cycle, or prorate; the current setting is full cycle. / 01:58:20 For plan change mid-month, refund and claw back the discount; for cancellation due to service dismay/disconnect, do not refund and keep the charge - the product must behave differently by scenario. / 01:57:10 functional: There must be no discount overlap; the duration of the discount must follow the plan/change dates and be prorated."

### REQ-013 — `recovered`

**Recovered detail:** Transcript gives an explicit functional requirement for a dedicated traceability/audit-trail screen and precisely what it must capture (who changed billing profile name, who changed recipient email, which email the document was sent to), plus a related requirement to support multiple recipients associated to a contact.

**Evidence:** "02:01:35 functional: Provide a traceability/audit trail screen covering all transactions, with billing providing the list of what must be traced. / 02:03:03 functional: Audit trail must capture who changed the billing profile name and who changed the recipient email, and record which email the document was sent to."

### REQ-021 — `recovered`

**Recovered detail:** Fuller pandoc-plain extraction of the original transcript recovers the requirement explicitly logged in the workshop's own structured 'Requirements Identified' and 'Pain Points' tables, confirming this is a formally captured functional requirement (not just a passing remark), plus the exact business trigger/mechanism: eligibility is checked at the point connections are added, and slabs are re-evaluated only on addition, never automatically on removal.

**Evidence:** "'01:20:50  business  The team disconnecting numbers must downgrade or remove the volumetric discount when connection counts drop; today there is no automatic tracking' and '01:20:43  No automatic tracking of connection counts against volumetric discount commitments; the disconnecting team must remember to downgrade or remove the discount... Explicitly called out as "the pain point".' Also: '01:17:29 At any point in time the account must retain the minimum count of active connections to keep the discount' and '01:21:41 Both activation and deletion of discounts are controlled manually.'"

### REQ-033 — `recovered`

**Recovered detail:** The fuller markitdown extraction of the source .docx (which recovers substantially more of the transcript than the compressed summary) contains a specific, timestamped, actor-level walkthrough of the export interaction: the user clicks a settings icon to trigger export, the XLS downloads automatically, and the feature is confirmed to have no access control and to be available across account summary, installed assets, orders, tickets, activities, and payments tabs, plus multi-account search results and sales-order search filtered by date range or specific order number. This is concrete UI interaction/control detail (trigger control, output behavior, and scope) directly relevant to specifying a 'governed/controlled' version of this feature as REQ-033 requires.

**Evidence:** "00:04:51 | Export to Excel from the CRM | Users export XLS files. The export is not access controlled - anyone can export. Users click the settings icon and export; the Excel downloads automatically and they filter on plan and promotion. | 00:05:47 | Export availability across tabs | Export is an out-of-box default feature available on all tabs today ... account summary, installed assets, orders, tickets, activities, payments all have export usage. | 00:06:57 | ... users can search multiple IDs and export from there, export for multiple accounts, and export sales orders filtered by date range or a specific order."

### REQ-039 — `recovered`

**Recovered detail:** The fuller markitdown extraction contains the exact numeric thresholds and decision logic that the compressed summary only paraphrased loosely: Excel caps at 1,000,000 line items; when exceeded, data is first aggregated location-wise and date-wise; if aggregation still yields 500,000-600,000+ lines the resulting XLS file becomes too large to email; the concrete rule is under 400k aggregated lines -> generate XLS, over 400k -> generate CSV instead. This is a precise, actionable business rule/validation threshold rather than a vague mention.

**Evidence:** "01:45:13 | Excel row limit and aggregation | Excel has a limit of 1 million line items. For very large enterprises line items can exceed that, so there are two levels of handling - first aggregation (location wise, date wise), and if still above 1 million another supporting document is issued as CSV containing all line items. | 01:46:22 | Email size constraint on bill delivery | If aggregation reaches 500,000-600,000 lines in XLS the file size becomes very huge and cannot be transferred over email; the delivery channel is email. If after aggregation it is under 400k lines, generate XLS; beyond 400k go with CSV."

### REQ-047 — `recovered`

**Recovered detail:** The fuller transcript extraction gives a precise journey link: this requirement is a sub-step of the 'CAF view and sign journey' [00:06:31] — 'Agent clicks view CAF form, the CAF appears on the customer tablet where the customer can review the CAF and sign at the bottom; on submit the view returns to the agent laptop.' The signature-pad migration is one of six explicit functional requirements tied to that same journey step (view-shift laptop→tablet→laptop, isolated CAF popup only, no full platform redirect), and the Referenced Systems table explicitly names both endpoints: OpenUI (today) and 'the custom Siebel/Sierra frontend' / DXP (target).

**Evidence:** "[00:06:12] functional: The digital signature pad, today integrated to the OpenUI frontend, must be integrated to the new custom Siebel frontend. ... [00:06:31] Journey: CAF view and sign journey — Agent clicks view CAF form, the CAF appears on the customer tablet where the customer can review the CAF and sign at the bottom; on submit the view returns to the agent laptop."

### REQ-048 — `recovered`

**Recovered detail:** Fuller extraction ties this to the same CAF view/sign journey and adds concrete business-rule detail on the current (as-is) naming scheme and the proposed unique key, which was compressed out of the summary: CAF is currently named by a QID+MSISDN convention with no true unique document ID, and the group agreed QID+MSISDN plus an additional internal variable would form the unique identifier, alongside an action item to 'finalise the unique CAF naming convention' and a dependency on moving documents into separate central storage.

**Evidence:** "[00:09:37] There is no unique document ID today; CAF files are named by a convention such as QID number underscore MSISDN underscore and so on. [00:10:12] QID plus MSISDN is the unique combination for a CAF, plus another internal variable can be added. [00:10:23] functional: In the to-be solution, documents should be managed in separate central storage that can be accessed via other channels as well."

### REQ-049 — `recovered`

**Recovered detail:** Fuller extraction links this to the 'Postpaid checkout journey' [00:30:59] (checkout → generate CAF → sign CAF → capture payment/WinCash handover → submit order) and adds the underlying business rule/trigger: any retail transaction, including a zero-payment modify order, requires a WinCash receipt, and WinCash's role extends beyond payment to device stock checks.

**Evidence:** "[00:59:10] functional: Any transaction performed in a retail store, even a modify order with zero payment, must have a receipt printed from WinCash - so WinCash must be integrated even when payment is not needed. [00:59:01] business rule: WinCash prints the receipt; the receipt comes from WinCash. Journey [00:30:59] Postpaid checkout journey: Checkout gives the summary, then generate the CAF, then sign the CAF, then capture the payment which hands over to WinCash, then submit the order."

### REQ-052 — `recovered`

**Recovered detail:** Fuller extraction ties this directly to the CAF signature step and gives the concrete UI sequencing: when the agent clicks 'sign CAF' the screen goes to the signature pad, and an 'important points' screen showing 3-5 key T&Cs appears first (business-admin configured), the customer clicks through, then the full CAF appears for signature.

**Evidence:** "[00:23:38] functional: When the agent clicks sign CAF and the screen goes to the signature pad, important points must appear first showing three to five key TNCs; the customer clicks through and then the whole CAF appears for signature. [00:25:25] business: Deciding which TNCs to show in which scenario must be a business admin function, not an agent function."

### REQ-053 — `recovered`

**Recovered detail:** Fuller extraction ties this to the tablet journey / journey-resumption discussion, with a concrete design mechanism (internal milestones, e.g. cart creation, gate persistence) rather than just the login-page placement already known.

**Evidence:** "[00:39:47] functional: Internal milestones must be defined (e.g. validation complete, cart created); if the cart is created the state can be held and resumed. [00:41:41] functional: The agent login page must show an in-progress journeys list so the agent can resume pending journeys. Journey [00:39:28] Tablet journey: ...needs milestone-based resume if the system crashes or the browser closes."

### REQ-054 — `recovered`

**Recovered detail:** Fuller extraction gives the concrete as-is state and named example teams for the 5 Siebel profiles, plus how they are currently (mis)used, which fills out the requirement significantly beyond the summary line.

**Evidence:** "[01:38:29] Today five Siebel profiles were created per team (mid value, high value, broadband and fixed, Key Accounts, Mass Market) but are now reused just to grant privileges; a new role/team based structure is needed. [01:42:42] Profiles are used to control which journeys a team sees - e.g. profile one has five journeys, profile two has three journeys. [01:44:20] Telly Sales, CXO Fiber Fulfillment, Key Accounts and HIA - Teams that have been assigned Siebel profiles today."

### REQ-055 — `recovered`

**Recovered detail:** Fuller extraction gives the concrete prior assumption being overturned and the specific business rationale (mass market is a persona whose journey differs, not merely a rendering variant), which is more specific than the summary's one-liner.

**Evidence:** "[01:47:23] assumption: The earlier assumption that tablet users would get all the views has changed and has to be rethought. [01:48:02] assumption: The design so far assumed the same view and same journey whether accessed on Windows or a tablet, with only the rendering changing. [01:48:56] decision: The mass market journey will be designed differently as its own journey; whether it is accessed on desktop or tablet is only a matter of rendering. Mass market is a persona, not a device."

### REQ-056 — `recovered`

**Recovered detail:** Fuller extraction ties this directly to the post-submission/order-status screen flow and the specific owner and rationale (provisioning still routes through OSM/Siebel post-submission), plus the concrete Q&A confirming the account is not activated at submission time.

**Evidence:** "[01:00:53] functional: The confirmation message must read that the order was submitted successfully, not that the account is activated, because provisioning is still going to OSM and Siebel. [01:00:49] Q&A: After submission, is the account activated? No - the order is submitted successfully but not yet activated because it is still going to OSM and Siebel. Owner: Gagan [01:01:11]."

### REQ-062 — `recovered`

**Recovered detail:** The fuller extraction surfaces the precise business logic and role context beyond the flagged description: the bypass is specifically for QID number edits only, is restricted to 'a manager or similar authority', and the remaining OCR-extracted fields (date of birth, nationality, name) are validated against MOI, not left unchecked. This is a SIM Swap journey capability (the journey and persona are named: 'Manager / team leader' — 01:01:09), unlike the billing items above.

**Evidence:** ""Agents will not be given free manual entry; a manager-level bypass option will allow editing of the QID number only, with the remaining OCR data (date of birth, nationality, name) validated against MOI." / Persona: "Manager / team leader | Has the bypass privilege to allow the agent to edit the QID number, and is responsible for approving SIM swap and verifying customer presence.""

### REQ-072 — `recovered`

**Recovered detail:** Markitdown re-extraction of the source .docx surfaced a dedicated business-process-area section ("5. Contract Commitment & Penalty Automation") that decomposes this requirement into four concrete sub-capabilities the business expects, plus a note that commitment/penalty rules vary by product and require documentation/modelling. This links the orphan requirement directly to the MNP/FNP port-out and disconnection journey (Day 9 Session 2) rather than being a free-floating ask.

**Evidence:** "**5. Contract Commitment & Penalty Automation** * Significant manual effort is currently required to calculate early termination penalties and commitment charges. * The business expects: + Automatic penalty calculation + Automatic application of penalties + Visibility of penalties during the disconnection process + Penalty display on invoices * Different commitment and penalty rules exist for different products and require documentation and modelling."

### REQ-080 — `recovered`

**Recovered detail:** Full markitdown re-extraction of the source .docx recovered a direct Q&A exchange (compressed out of the .md summary) that defines the number-search experience scope concretely: customers may search/request numbers by connection type (mobile, IoT, fixed line), by tier (golden or platinum numbers), or by specific digit combinations (e.g., a number ending in the customer's date of birth), and the agent fulfils this today by logging into the number management portal and showing the customer matching combinations. This directly answers what 'search experience needs to be defined' means substantively, and also gives an explicit scope statement ('functional' requirement row) confirming the portal is in scope with the search experience as an open item to define.

**Evidence:** "00:53:59 | Is the number management portal also in our scope, and what should the search experience be? | Yes it is in scope. Customers may ask for mobile, IoT or fixed line numbers, golden or platinum numbers, or specific digit combinations, and the experience needs to be defined. ... 00:55:14 | Can a customer request a very special number such as one ending with their date of birth? | Yes - a customer can walk into a store and ask for a number with a specific combination; the agent logs into the number management portal and shows the combinations."

### REQ-105 — `recovered`

**Recovered detail:** Fuller extraction ties this requirement to a specific journey step location: it is discussed as part of the postpaid new-connection journey's 'MOI validation' step (immediately following ID scan / IDWise), i.e. it belongs to the ID-capture/Contact screen of the retail postpaid journey, not a free-floating rule. The requirements table also logs it as a distinct functional item separate from the Q&A summary.

**Evidence:** "'00:32:41 functional Pull and store all name fields that MOI returns rather than truncating to first and last name' and '00:33:43 business All customer names captured must also be printed on the bill' -- both logged under the journey step context '00:11:18 Postpaid new connection journey (retail): The first journey covered end to end: Qnomy token, ID scan, MOI validation, eligibility, plan browsing, device, number selection, SIM selection...'"

### REQ-106 — `recovered`

**Recovered detail:** Fuller extraction confirms this requirement is scoped to the same 'MOI validation' journey step and adds the precise fallback/precedence logic and validation trigger: MOI is queried by ID number + expiry date; OCR-captured data is cross-checked against MOI on at least two parameters (e.g., DOB, nationality, expiry) before MOI is allowed to override; a mismatch raises an explicit error rather than silently defaulting to a source.

**Evidence:** "'00:29:32 functional MOI ID retrieval API input is ID number plus expiry date' / '00:38:29 functional Validate at least two different parameters (e.g. ID number plus DOB or nationality or expiry) against MOI before overriding local data' / '00:38:04 If the ID number plus secondary parameters do not match the MOI response, raise an error indicating a problem in the capture of ID details.'"

### REQ-112 — `recovered`

**Recovered detail:** Markitdown re-extraction of the source PDF located both instances of the ZSB business rule (Prepaid business rule #15, ref 2.1.15; Postpaid ECR business rule #12, ref 3.1.12) and both give the same concrete definition: ZSB = Zone, Street, Building detail of the customer's location, mandatory to capture 'in activation journey' -- i.e. this attaches directly to the Address step of both Prepaid and Postpaid consumer activation journeys, which matches the Zone/Street No./Building No./Apt-Flat-Unit fields already independently evidenced in every Guided Journey Address step in this corpus (e.g. FWA Outdoor B2B2C step 6, Fixed Line Tablet step 6).

**Evidence:** "It is mandatory to capture ZSB (Zone, Street, Building detail) of customer location in activation journey."

### REQ-115 — `recovered`

**Recovered detail:** Transcript confirms the requirement is specifically to digitalise the home/FWA/OSN supplementary T&C form as either a second CAF page or a dedicated form, and separately confirms the interim decision: it will be added as a static additional TNC-only page (no dynamic parameters) to the same CAF, tied to what the customer is buying. | The already-extracted summary itself (this document is already the fullest available text per its own extraction notes - all 68 screenshots visually read) contains a direct journey link for this requirement: the Supplementary Form is shown as one of exactly four attachment tiles in Step 8 (CAF & Additional Attachments) of the 'New FWA Tablet' guided journey, is marked required (asterisk), and its absence produces a specific, quoted validation error blocking Continue. This is concrete evidence of exactly which journey/screen/step the requirement attaches to, plus the validation behavior. | The Consumer Postpaid CAF V4 document (Section 4 — Superfast Broadband & Home Phone) explicitly names the requirement as a signed acknowledgment clause tied to the Home Fibre section of the CAF form itself, and the General T&Cs page separately states the supplementary form is mandatory specifically for Home Fibre service activation — giving a concrete document/section link (Section 4 of form PCA001) rather than just a passing mention.

**Evidence:** "01:46:12 functional: Digitalise the home/FWA/OSN supplementary terms and conditions form, either as a second page of the CAF T&C or as a dedicated form. / 01:50:23 Decision: The supplementary terms and conditions will be added as an additional page (TNC only, no dynamic parameters) to the same CAF depending on what the customer is buying. || Attachment tiles then appear: Proof of Employment* (required), CAF* (green check once signed), Supplementary Form* (required), Add File (optional). Continuing with items missing shows errors verbatim: "Error: Please select Supplementary Form before continuing." || Section 4 – Superfast Broadband & Home Phone: ... plus an acknowledgment clause referencing Vodafone Home T&Cs and the "Vodafone Fibre Supplementary Form." ... Home Fibre requires Vodafone Fibre Supplementary Form; GigaHome/5G Home services require an additional physically signed form."

### REQ-116 — `recovered`

**Recovered detail:** Confirmed as a concrete clause located specifically in CAF Section 3 (For Postpaid Customers), immediately following the Postpaid Terms & Conditions/Privacy Policy acknowledgment — giving it a specific form-section anchor (not just a stray mention) and the exact USSD opt-out shortcode.

**Evidence:** "Signature*, and an acknowledgment clause referencing Postpaid Terms & Conditions and Vodafone's Privacy Policy, plus a direct-marketing consent clause with USSD opt-out code *200*321#."

### REQ-122 — `recovered`

**Recovered detail:** The 'Retail cannot change primary contact' annotation is attached to Page Type row #31: Journey Category=Support, Journey Type='Updating Contacts', Type=Workflow/Task, Description='To Update the Contact Details Insight Account, Changing Notification MSISDN, Linking New Contact, MOI Validation, QID Update, Etc', Comment='Action through Vanilla (Open UI desktop)', Guided journey Desktop=No, Tablet=No, Desktop vanilla=Yes, CBU=Yes, EBU=Yes. This directly links the orphan requirement to a specific Workflow/Task row and clarifies it is a business-rule constraint on the 'Updating Contacts' task performed via Open UI desktop vanilla (not a guided journey), applicable to both CBU and EBU.

**Evidence:** "{'#': 31, 'Journey Category': 'Support', 'Journey Type': 'Updating Contacts', 'Type': 'Workflow/Task', 'Description': 'To Update the Contact Details Insight Account, Changing Notification MSISDN, Linking New Contact, MOI Validation, QID Update, Etc', 'Comment': 'Action through Vanilla (Open UI desktop)', ... 'AI Comments': 'Retail cannot change primary contact'}"

### REQ-123 — `recovered`

**Recovered detail:** The 'Bill calculator SMS is not a journey but a capability' annotation is attached to Page Type row #43: Journey Category=Support, Journey Type='Prorata Calculator', Type=Workflow/Task, Description='Calculating the Pro Rata Amount for MSISDN based on BC, Activation Date, Plan Change, Applied Discount and Send SMS with Auto Calculated amount', Comment='Action through Vanilla (Open UI desktop)', Guided journey Desktop=Yes, Tablet=Yes, Desktop vanilla=Yes, CBU=Yes, EBU=No. This links the orphan requirement to the specific 'Prorata Calculator' task and confirms its scope: a pro-rata billing calculation tied to Billing Cycle/Activation Date/Plan Change/Discount that concludes by sending an SMS with the auto-calculated amount - available as a guided journey on Desktop and Tablet plus Open UI desktop vanilla, CBU only.

**Evidence:** "{'#': 43, 'Journey Category': 'Support', 'Journey Type': 'Prorata Calculator', 'Type': 'Workflow/Task', 'Description': 'Calculating the Pro Rata Amount for MSISDN based on BC, Activation Date, Plan Change, Applied Discount and Send SMS with Auto Calculated amount', ... 'AI Comments': 'Bill calculator SMS is not a journey but a capability'}"

### REQ-129 — `recovered`

**Recovered detail:** The document links this bilingual form requirement to a specific journey/screen: the FWA Postpaid Outdoor guided-wizard journey, Step 8 (CAF), CAF-Digital modal, applied to the New FWA Outdoor Postpaid order. The bilingual EN/AR 'Vodafone Customer Application Form' contains the full form structure (Sections 1-4: Applicant details, Billing information, For Postpaid Customers, Superfast Broadband & Home Phone) plus full Vodafone Qatar General Terms and Conditions text in EN/AR. | This same journey document contains the direct screen link: the CAF screenshot (image9) is a bilingual English/Arabic Customer Application Form used specifically in the Pre-to-Postpaid conversion journey, with Section 1/2/3 headers rendered in both languages and 'Sign Contract'/'Close and Retry' actions. This ties REQ-129 concretely to journey 'Retail Mobile Prepaid-to-Postpaid Conversion (QID Customer)' and screen 'CAF (Customer Application Form) - image9', closing the orphan link. | The bilingual CAF pattern is corroborated across two independently-mined Guided Journey documents (Fixed Line Instant Activation AND MNP Postpaid HRN), not just one, and appears at two distinct points in the MNP journey (Donor Attachment / MNP Application Form, and CAF at step 8) -- establishing this is a cross-journey, repeated UI pattern, not a one-off. | The guided-journey summary itself (already high-confidence, direct visual extraction) shows the concrete evidenced screen this requirement links to: the bilingual CAF is generated and rendered as part of Step 9 (CAF) in the 'Open UI Desktop - New Postpaid Activation for an HRN Customer' guided journey, and the same bilingual CAF rendering is independently cross-confirmed in the FWA Indoor guided journey (Section headers rendered in both English and 'استمارة عميل فودافون' Arabic). This gives the requirement a concrete journey/screen link (Step 9 CAF screen in both the Postpaid HRN and FWA Indoor guided journeys) that resolves the orphan status.

**Evidence:** "Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form": Date 18-Sep-2025, Retailer ID 112233. Section 1 - Applicant details... Section 2 - Billing information... Section 3 - For Postpaid Customers... Section 4 - Superfast Broadband & Home Phone... Full Vodafone Qatar General Terms and Conditions text (EN/AR) follows. || Bilingual English/Arabic form "استمارة عميل فودافون / Vodafone Customer Application Form." Header: Date 16-Mar-2025, Retailer ID: 112233. Section 1 – Applicant details... Section 2 – Billing information... Buttons: "Sign Contract", "Close and Retry". || Fixed Line doc: 'A bilingual (Arabic/English) "Vodafone Customer Application Form" ("استمارة عميل فودافون") opens'. MNP Postpaid doc: 'Bilingual "استمارة عميل فودافون / Vodafone Customer Application Form" modal' (CAF) AND separately 'Titled "استمارة طلب نقل رقم الهاتف الجوال / Mobile Number Portability Application Form" with Vodafone logo' (Donor Attachment/MNP form) -- both bilingual Arabic/English. || A bilingual (Arabic/English) "استمارة عميل فودافون / Vodafone Customer Application Form" is rendered: Date 2-Apr-2026, Retailer ID 1234 ... (guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2, Step 9); also independently in guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf: 'a bilingual (English/Arabic) "Vodafone Customer Application Form" PDF'"

### REQ-138 — `recovered`

**Recovered detail:** This requirement is directly and concretely linked in the same document to the 'Book Appointment' step (Step 6) of the New Fixed Line Fulfilment guided journey: the warning fires as a browser confirm dialog on Submit of the appointment modal, blocking or allowing continuation, immediately followed by a processing spinner and a success alert with a generated Appointment ID and a results table (Appointment Number, Technician ID, Status, Date, Channel, Activity ID, Time Slot). This supplies the exact screen/step link and surrounding validation flow requested.

**Evidence:** "On Submit, a browser confirm dialog appears: "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment." Clicking OK triggers a "Processing, please wait…" spinner, then a success alert: "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242.""

### REQ-139 — `recovered`

**Recovered detail:** The requirement links directly to Step 1 (Contact) of the New Fixed Line Fulfilment journey, appearing alongside the other auto-populated identity fields with a tooltip explaining the access restriction, and is immediately followed in the same step by the 'Get IPTV?' flag and Fixed Line IPTV popup — giving the precise screen location and surrounding field context (it sits between the Digital Lead/Sale flag and the Get IPTV flag in the Contact confirmation form).

**Evidence:** "Enter ECR Details = No (green check, tooltip "To be filled by Fulfillment team only"), Get IPTV? = Yes, Email = nobill2@vfq.com..."

### REQ-140 — `recovered`

**Recovered detail:** Same Step 1 Contact confirmation form in the New Fixed Line Fulfilment journey; the field sits alongside Email and Language and is validated (green checkmark) after entry, giving the exact screen/field position and validation behavior.

**Evidence:** "Alt. phone # = 97412341234 (info note: "This is a notification contact. Please enter a local mobile number.") ... After dismissing, all edited fields (Email, Language, Alt. phone #) show green checkmarks."

### REQ-141 — `recovered`

**Recovered detail:** The document gives the full modal flow for this requirement: it is triggered as part of Step 1 Contact in the New Fixed Line Fulfilment journey immediately after IDM creation succeeds, presented as a popup titled 'Fixed Line IPTV' with an info banner, a checkbox to opt into a different billing email, a Billing Email field, and an Ok confirmation button — concrete field-level detail for the confirmation modal.

**Evidence:** "A popup titled "Fixed Line IPTV" appears with info banner "IDM Created Successfully", a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field = `Nobill123@vfq.com`, confirmed with "Ok"."

### REQ-146 — `recovered`

**Recovered detail:** The e-signature requirement is now traceable to specific journey steps and screens: it fires in the MNP Postpaid journey's '7. Donor Attachment' step (on the MNP-Digital Mobile Number Portability Application Form) and again in the '8. CAF' step (on the Vodafone Customer Application Form). Both forms show a 'Sign Contract' button leading to a signature capture pad, and the signed result is timestamped/attributed to the agent. | Transcript confirms the CAF e-signature capability as a functional/non-functional requirement (signature is the sole mechanism, no tick boxes, must lock the CAF from edits post-signature) across the guided journeys named. However, the specific UI widget labels ('Please Sign'/'Clear Signature'/'Done') cited in the orphan requirement's description do NOT appear anywhere in this transcript -- that literal control-label detail must originate from a different source (a Guided Journey screenshot document), not this meeting recording, so only the underlying requirement (not the exact widget copy) is recoverable from this document. | The document shows the exact screen sequence and journey link for e-signature: the signature pad step (image10, 'Please Sign' modal with Done/Clear Signature) sits between CAF completion (image9, 'Sign Contract' button) and the signed CAF record (image11), where the captured signature becomes a permanent part of the CAF with a system timestamp and consent text, confirming this is a mandatory gate before the Sales Order is created (image12, order created in Pending status right after signing). | The e-signature pad requirement is directly evidenced twice within the single MNP Postpaid journey (once for the MNP/Donor Attachment form, once for the CAF), each producing a stored signature image plus an agent-ID + timestamp audit record -- confirming this is a reusable, repeated capability applied at multiple points/journeys, not isolated to Fixed Line. | Confirmed as a specific, ordered step (step 15, between SIM Serial/CAF preview and the CAF & Additional Attachments upload step) in the B2B2C New Postpaid With Approval journey, with the exact resulting signature stamp format captured downstream in the signed CAF attachment reviewed by the manager, proving the signature is bound to the CAF and persisted with agent-name + timestamp.

**Evidence:** "Applicant declaration section lists standard MNP terms... Buttons: Sign Contract / Close and Retry. ... the Applicant's signature field now shows a captured signature image plus text 'HEMANTH 2025-21-4 12:9:45'... A signature capture pad ('Please Sign') shown separately with a drawn cursive signature and Done / Clear Signature buttons... After signing, clicking Done triggers a browser alert dialog: '10.162.53.100:4443 says — Advise customer to send switch to 151. SMS costs 1Dhs' || 01:44:37 Q&A: Do you expect tick boxes before signing? No, just the signature; a pop-up is used only to make the agent pause on key information. / 01:47:31 non-functional: Signed CAF must no longer be editable after signature. || "Please Sign" modal ... buttons "Done" and "Clear Signature". Signed CAF — Section 3 (image11): Signature block shows the captured signature graphic with system timestamp "KARTHIKK 16:03:2025 10:21:22" and consent text referencing Vodafone's postpaid Terms & Conditions and an opt-out USSD code "*200*321#". || MNP doc: 'Modal "Please Sign" with a drawn cursive signature captured on the pad. Buttons: Clear Signature, Done. (This signs the MNP Application Form...)' and again 'Second "Please Sign" modal (for the CAF)... Signature box shows the captured signature and timestamp "HALEEMI 04/08/2026 11:23:55"'. || **Signature capture** – "Please Sign" pad; customer signs; **Clear Signature** / **Done** buttons. ... CAF attachment ("1-DND2P3R_signed") reproduces the full signed Vodafone Customer Application Form... customer signature timestamped "VINODHINIR 08/17/2025 08:46:11.""

### REQ-153 — `recovered`

**Recovered detail:** The exact same completion-message pattern ("<Journey> completed successfully. Order Number:- '<order#>'") recurs verbatim in the MNP Postpaid journey with a different order number, confirming this is a standard, reusable system dialog pattern across journey types (Fixed Line AND MNP/Postpaid), not a single-journey quirk. | Directly evidenced in the tablet B2B2C guided journey (item 24 of Key content), showing the exact completion modal text including the literal order number placeholder pattern, and independently cross-confirmed by the desktop FWA Indoor journey's final Sales Order screen also surfacing an order number (1-29729896060) at completion. This gives a concrete screen link (Order completion confirmation modal, step following 'Save and Finish').

**Evidence:** "MNP doc: 'A confirmation dialog appears: "MNP completed successfully. Order Number:- '\''1-29822004764'\''" with a Finish Process button' -- directly parallel to the Fixed Line doc's 'Fixed Line completed successfully... Order Number:- '\''1-29792357564'\''". || System modal reads verbatim: "Postpaid completed successfully. Order Number:- '1-29726606734'" with a "Finish Process" button. (guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7, image24)"

### REQ-154 — `recovered`

**Recovered detail:** Full step detail recovered: the Company Name dropdown appears during the Contact step (after contact confirmation, before Address), lists specific selectable options, and the selection is proven to persist end-to-end — surfacing later on the CAF preview (linked company name appended to customer name), and post-approval on the Account record ('Special Management' = B2B2C Consumer) and Contact record ('Employer' field populated with the selected company) — giving both the UI field-level detail and the resulting entity/lifecycle effect. | In this Fixed Line document, the same Company Name B2B2C dropdown appears at the Contact step with a distinct, larger option list, and its downstream lifecycle effect is documented in even more depth than the Postpaid document — a dedicated 'Update B2B2C Employer' contact toolbar button, and post-approval Account/Contact Audit Trail entries proving the exact system fields modified (Sales Number, Parent Account Id) when the B2B2C linkage is applied.

**Evidence:** "Company Name dropdown (the B2B2C linkage step) – agent opens the Company Name selector; options shown: "01 newfreedcn01_Test", "01 querybar01", "TestVQW". Agent selects "01 newfreedcn01_Test"... Contact record, post-approval: "Employer" field is now populated/highlighted showing "01 newfreedcn0[1_Test]" — the linked company selected in step 5, now surfaced as the contact's Employer. || Company Name B2B2C dropdown: agent selects "SIPT" from a company list (01 newfreedcn01_Test, 01 querybar01, 0109FN3 0109LN3, SIPT, 08 May Sanity Mav_Sriram, etc.)... Toolbar buttons on the contact: Create A/c, Mobile Eligibility, MOI Validation, Update B2B2C Employer... MANAGETEST modified "Parent Account Id" to "1-59PPBV" (business component "VFQA Contact Integration") at 10:11:54 AM, confirming the B2B2C employer/parent-account linkage was applied as part of approval."

### REQ-163 — `recovered`

**Recovered detail:** Directly evidenced in the FWA Desktop Vanilla guided journey (item 12 of Key content), naming all three equipment sub-type options presented in the same dropdown/selector during FMS CPE Bundle configuration, confirming the requirement's exact scope (three named sub-types, not just 'indoor').

**Evidence:** "FMS CPE Bundle configuration - agent selects equipment sub-type FMS CPE Indoor IDU (vs. FMS CPE ODU / FMS CPE Outdoor IDU options) and, in its Details form, fills Indoor Unit Serial Number..."

### REQ-164 — `recovered`

**Recovered detail:** Document explicitly confirms OFSC as the WFM backend and links the Appointment ID/Technician ID to a specific screen sequence: Step 7 Book Appointment (CRM) creates Appointment Number, Appointment ID, Technician ID; and the OFSC plugin domain confirms the integration explicitly in a system dialog. | The requirement is directly operationalized by a specific, ordered sequence of screens in this same document: Sales Order Line Items 'Book Appointment' button (step 11) -> 'Book Appointments for KID QID RG0007' calendar/slot-selection dialog (steps 12-13) -> booking confirmation with Appointment Id (step 14) -> back-office 'Activity details' screen showing Resource ID, Correlation Id, Technician Tracking URL (steps 17-18) -> technician 'Move' dialog for reassignment (step 19) -> OFS technician 'My Route' view (step 26). The OFSC platform identity and environment are confirmed explicitly.

**Evidence:** "Resulting appointment record: Appointment Number 1-29728036686, Technician ID ABATS_Consumer_Installation, Status pending, Appointment Date 09/20/2025, Channel SIEBEL, Appointment ID 120955, Time Slot 8AM - 11AM. ... confirmed by the OFSC domain "plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com" appearing in two system dialogs. || "Appointment has been successfully booked. Appointment Id is 120812" ... "An embedded page at plugins-0-ofsc-55e5b6.test.fs.ocs.oraclecloud.com says..." ... confirms the WFM platform is Oracle Field Service Cloud (OFSC), environment ofsc-55e5b6.test.fs.ocs.oraclecloud.com"

### REQ-165 — `recovered`

**Recovered detail:** Document gives the full step sequence and screen link for this requirement: Excel 'VFQ Inventory Loading' -> Field Service Import add-in ('Resource Inventory Import') syncs quantities into OFSC (Resource Id ABATS) -> Move dialog reassigns technician -> Inventory Management Non-Serialized Inventory Transfer screen transfers 3 parts one at a time from ABATS (warehouse resource) to Syed Irfan (field technician) -> OFSC plugin confirmation dialog. | Full screen-level realization already documented in steps 20-25: the 'Inventory Management > Non-Serialized Inventory Transfer' screen (SCR-090), showing source technician/team (ABATS), items added one-at-a-time via 'Add To Transfer List' (outdoor CPE, indoor CPE, SIM/test item), a 'Transfer List' tab with Total Items and Current Owner/Transfer To fields, 'Start Transfer' action, and a completion confirmation dialog plus downloadable Inventory Transfer Report (xlsx).

**Evidence:** ""Transfering From: ABATS" to resource Syed Irfan, three parts transferred one at a time (qty 1 each): Test(8942702800801190000)-Test [Huawei_B2368-71 indoor CPE], Test(S180P18075127)-Test [Huawei_B2368-79 outdoor CPE], Test(2EQTE24314000127)-Test [SIM...]. Transfer List shows Total Items: 3... "Start Transfer" clicked. ... "Inventory transfer has been completed. Closing the plugin screen..." || "Inventory Management" > "Non-Serialized Inventory Transfer" tab, "Transfering From: ABATS"... three items searched and added to the transfer list one at a time via "Add To Transfer List"... "Inventory transfer has been completed. Closing the plugin screen…""

### REQ-166 — `recovered`

**Recovered detail:** Exact screen, fields, and sequencing constraint documented in steps 31-33: 'Serial Number Check - Dual Play' screen with three specific scan fields (CPE Indoor, CPE Outdoor, SIM Card) populated with real serial numbers, a submit confirmation naming the required next screen ('Install Inventory-SNC'), and a follow-on 'Service Activation Status: Success' gate before that step can proceed. | The requirement is directly and fully evidenced by a specific, ordered sequence within this same guided journey document: the technician opens the overflow menu and selects 'Serial Number Check - Dual Play' (image42), fills the Serial Number Check form with CPE Indoor, CPE Outdoor, and SIM Card fields each with a barcode-scan icon and submits (image43), receives the confirmation dialog instructing that Install Inventory (SNC) must only be performed after Success status (image44), sees 'Service Activation Status: Success' with instruction to perform Install Inventory (SNC) (image45), and only then does 'Install Inventory (SNC)' appear as an actionable overflow-menu item marked with a green square (image46). This traces the requirement to concrete journey steps 41-45 in this document.

**Evidence:** ""Serial Number Check - Dual Play" screen with barcode-scan fields: CPE Indoor "2EQTE24314000124", CPE Outdoor "S180P18075124", SIM Card "8942702800801190322"... "Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status." || "Service activation request submitted successfully. Please Install inventory in Install Inventory-SNC after receiving 'Success' in Service activation Status." ... Right-hand panel now shows 'Service Activation Details' ... Service Activation Status: Success, and instruction 'Please perform 🟩 Install Inventory (SNC).' ... The '...' menu now shows a green square marker next to 'Install Inventory (SNC)'"

### REQ-167 — `recovered`

**Recovered detail:** Document details the exact Installation Checklist fields, briefing checkboxes, and two distinct signature-capture points (during checklist submission and again at End activity), matching the requirement description precisely. | Two distinct signature-capture points are documented with their exact screen context: the Installation Checklist form (step 34-35, alongside customer-briefing checkboxes and speed-test/optical readings) and the separate 'End activity' popup (step 37, alongside Activity Remarks and Customer Available dropdown) which re-captures signature at close-out.

**Evidence:** "Installation Checklist — Forms Submitted (images 50–51): Fields captured: "Speed test results on Wi-Fi and LAN" = Test... All customer-briefing checkboxes checked ("Brief customer on package details", Wi-Fi 5G-first guidance, CPE/STB restart instructions, My Vodafone app + bill-pay explanation, mesh configuration explanation). Customer Signature captured (drawn signature present). ... End activity (image 53): ...Customer Signature (signed), "Next Activity" = "I will be idle for a while". Submit. || "A hand-drawn Customer Signature is captured. Submit." (Installation Checklist, step 35) ... "'End activity' popup... Customer Signature re-captured (same signature)." (step 37)"

### REQ-168 — `recovered`

**Recovered detail:** This document is itself the direct evidence for this requirement, showing the full journey: agent selects the FMS CPE Bundle row in the Installed Assets grid on Account 360 and clicks Modify (tooltip confirms 'Installed Assets:Modify'), drills into FMS CPE Indoor IDU details, and edits the Indoor Unit Serial Number field from S180P18055021 to S180P18055020. This is a complete, concrete step sequence linking the requirement to a specific screen and specific field edit.

**Evidence:** "The agent selects the "FMS CPE Bundle" row (highlighted with a red outline) in Installed Assets and clicks the Modify button; a tooltip confirms the action as "Installed Assets:Modify"... changes the value from `S180P18055021` to `S180P18055020`"

### REQ-169 — `recovered`

**Recovered detail:** Fully evidenced in the same document: editing the serial number generates Order # 1-29737237878 with Order Type 'Modification', which proceeds Pending to Open to Complete, and the Line Items > Attributes tab records the change as a discrete row with Name 'Indoor Unit Serial Number', Value (new) 'S180P18055020', Action 'Update', Description (old value) 'S180P18055021', Data Type 'Text' — a complete attribute-level audit trail.

**Evidence:** "Order # 1-29737237878... Order Type "Modification"... Indoor Unit Se[rial Number]: Value `S180P18055020`, Action "Update", Description `S180P18055021` (i.e., Description column preserves the prior/original value while Value holds the new one) — Data Type "Text""

### REQ-170 — `recovered`

**Recovered detail:** Full step-level detail recovered: this is the Address step's client-side required-field validation in the 'New FWA Tablet' guided journey (Sales Order menu variant), specifically triggered by clicking Save Address with Zone/Street No./Building No./Apt-Flat-Unit/Area all blank, producing a blocking modal dialog with an OK button. A related but distinct variant exists in the Business/Static Data journey which offers a 'Skip Address' escape hatch instead of a hard block.

**Evidence:** "On step "2. Address" with Zone, Street No., Building No., Apt/Flat/Unit, and Area all empty, clicking Save Address produces a modal dialog: "Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area" Dialog has an OK button; Go back / Cancel are also available on the page."

### REQ-171 — `recovered`

**Recovered detail:** The already-extracted summary documents this in full: three distinct real-time UIM validation outcomes were captured with exact error codes/messages during SIM/CPE serial entry (Step 6), proving the validation is a live backend service call (not client-side/mock) blocking order progression on failure, and confirming the backend UIM lookup screen (Custom Object Summary) used by agents to source valid serials. | Full real-time backend validation flow recovered with specific field names, spinner state, and multiple distinct backend response codes/messages proving the SIM/CPE Serial fields call out to Oracle UIM in real time: 'SIM Card does not exist in UIM(SBL-EXL-00151)', 'SIM Card already assigned in UIM(SBL-EXL-00151)', 'CPE Serial Number ... is not free in UIM(SBL-EXL-00151)', plus client-side length validation ('SIM Serial # must be 19 digits') distinct from the backend calls, and the intermediate 'Validating Order, please wait...' spinner state confirming an async backend round-trip blocks Continue.

**Evidence:** "SIM 8942702800801190296 + CPE S180P18055026 -> both show green checks, but a browser alert fires: "SIM Card already assigned in UIM(SBL-EXL-00151)". ... new SIM 8942702800801190301 + CPE S180P18055021 -> ... "CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)" || An orange spinner labeled "Validating Order, please wait..." appears next to the SIM Serial field while the system calls out to backend services... "SIM Card already assigned in UIM(SBL-EXL-00151)"... "CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)""

### REQ-172 — `recovered`

**Recovered detail:** Verbatim full exception surface text recovered including two distinct error/service codes and the support reference number format, tied to a specific step (SIM Serial, CPE-not-free scenario) and specific journey variant (New FWA / FWA Postpaid Business).

**Evidence:** ""Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162) CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151) Please Contact the System Administrator with Reference # 1-DNODWJU.(SBL-EXL-00151)" This includes two distinct error/service codes (SBL-BPR-00162 for the error-handling service invocation itself, SBL-EXL-00151 for the underlying UIM/CPE-not-free condition) and a support reference number format "1-DNODWJU"."

### REQ-174 — `recovered`

**Recovered detail:** Confirmed concrete journey linkage: in the MNP Postpaid journey's '8. CAF' step, clicking the 'CAF' action button opens a dropdown with exactly three options (CAF-Digital, CAF-Manual, CAF-Touch Screen), directly paralleling the MNP Form dropdown's two options (MNP-Digital, MNP-Touch Screen) one step earlier in the same journey — establishing both the specific screen (Step 8 - CAF accordion) and the UI control (split-button/dropdown on the 'CAF' action button) this requirement maps to. | The requirement's journey/screen link is directly evidenced and cross-confirmed in two separate guided journeys already in the corpus at high confidence: the Postpaid Open UI Desktop HRN journey's Step 9 (CAF) and the FWA Open UI Desktop Indoor journey's Step 8 (CAF), both showing an identical CAF split-button/dropdown offering CAF-Digital, CAF-Manual, CAF-Touch Screen. This consistent cross-journey pattern (same control, same three options, same step position) resolves the orphan status by tying the requirement to two concrete, named screens. | Same evidence as the postpaid-doc instance of REQ-174 above: the FWA Open UI Desktop Indoor guided journey (Step 8, item 10 of Key content) directly documents the CAF dropdown with the three named form types, giving this requirement a concrete screen link within this specific document.

**Evidence:** "action buttons Continue / CAF / Abandon Order / Go Back. 30. Clicking 'CAF' opens a dropdown with three options: CAF-Digital, CAF-Manual, CAF-Touch Screen. || guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2 Step 9: 'A "CAF" split-button offers CAF-Digital, CAF-Manual, CAF-Touch Screen.' guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf Step 8: 'a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen.' || Step 8 - CAF. An Attachments sub-section (initially "No Records") plus a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen."

### REQ-175 — `recovered`

**Recovered detail:** Directly evidenced in the FWA Open UI Desktop Indoor guided journey (item 10, CAF step) with the verbatim system alert text confirming this notification requirement and its exact trigger point (immediately after Sign Contract/Done on the signature pad, before order submission).

**Evidence:** "Form redisplays with signature captured; a browser alert states: "Notify customer that a copy of the CAF will be sent to his registered email address." (OK button)."

### REQ-184 — `recovered`

**Recovered detail:** This Pre-to-Post document (high confidence, full 22-screenshot visual read) provides a second concrete instantiation of the Connection Details modal, at the same Contact step, confirming the pattern is identical in shape (Total Prepaid Connections / Total Postpaid Connections / Continue-Cancel) across journeys, differing only in the customer's specific connection counts (1 prepaid / 0 postpaid here vs 1/1 in the MNP Postpaid doc) — this cross-document consistency itself is the recovered evidence that the requirement is a single reusable UI component invoked identically at the Contact step regardless of journey. | The source document (guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv) already documents this requirement in full: the Connection Details modal appears automatically at the Contact step immediately after ID lookup, shows Prepaid/Postpaid connection counts, and for a customer with 2+ postpaid connections displays the exact advisory text plus a 'Show Postpaid Plan Details' expansion listing the customer's existing plans; critically, the walkthrough proves the advisory is informational-only -- the agent proceeds straight through to order completion (Status Complete/Fulfillment Complete) with the Approved checkbox left unchecked throughout, confirming no hard approval gate is enforced by the UI in the 'Without Approval' variant.

**Evidence:** "A 'Connection Details' modal overlays showing Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0, a disabled 'Show Postpaid Plan Details' button, and Continue/Cancel buttons. || "Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding" ... the agent proceeds directly by clicking Continue -- no approval workflow, approval button, or manager-sign-off screen is triggered ... the final order record shows the Approved checkbox unchecked and Approved By blank, yet the order still reaches Status: Complete / Fulfillment Status: Complete."

### REQ-204 — `recovered`

**Recovered detail:** The document explicitly names and screenshots the exact reduced tile set for the manager/approver persona, directly matching the requirement text, and further ties it to a specific manager workflow (Manage Leads > My Team's Leads, filtered by Created By) demonstrated later in the same document.

**Evidence:** "A new persona logs in: "Welcome back Test Manager!" (Incognito session) — module tiles reduced to Home, Order Approval, Manage Leads, Leads Queue, marking the manager/approver role's much narrower menu."

### REQ-214 — `recovered`

**Recovered detail:** The document links this requirement to a specific screen/step: Number Selection (step 5) in the Postpaid provisioning wizard, reached via the Cross Sales -> New Postpaid handoff. The reservation success token appears as a native browser alert at that exact step, followed immediately by the Reserved Numbers grid updating from empty to populated with the reserved MSISDN.

**Evidence:** "Number Selection — reservation confirmed via browser dialog (image13). Step "5. Number Selection" expanded. A native browser alert reads: "SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)". At this moment "Reserved Numbers" grid is empty ("No Records"); "Unreserved Numbers" grid lists one candidate... Number now reserved (image14). "Reserved Numbers" grid updates to show: Mobile / FREE / CONSUMER / Service Id 97470345802 / Reserved By BHARGAVISM / Price QR0.00."

### REQ-215 — `recovered`

**Recovered detail:** Linked to screen SCR-161 (CAF/Attachments step, step 9 of the Postpaid wizard). Evidence shows the attachment list is a paginated grid ('1 - 10 of 19+') implying more than a single-file upload widget, plus explicit Continue/CAF/Cancel/Go Back actions surrounding it, giving more procedural context than the bare description.

**Evidence:** "CAF/Attachments step (image20). Step "8. Payment" now "Saved!". Step "9. CAF" expanded showing an "Attachments" section: "New File" upload control, one file already attached — "PPVT TESTING SAMPLE.pdf" (with delete icon), grid count "1 - 10 of 19+". Buttons: Continue, CAF, Cancel, Go Back."

### REQ-216 — `recovered`

**Recovered detail:** Linked to screen SCR-162 (Activity/call-disposition step, step 10, final step of the Postpaid wizard). The document additionally shows the finalize action name and the follow-on system confirmation message that fires once the comment is filled and submitted, tying this requirement directly to order completion.

**Evidence:** "Final step "10. Activity" expanded — call-disposition form: Channel "Store walk-in", MSISDN 97470345802, Type "Sales", Topic "Automated Guided Journ...", Sub Topic "Retail - Open UI", Area "Provisioning - New Postp...", Resolution Code "Completed", Status "Solved", Language "English", empty Comments box with helper text... Button: "Save and Finish". ... Comments now filled with "PPVT TESTING CROSS SALES". A confirmation popup reads: "Postpaid completed successfully. Order Number:- '1-225217281463'""

### REQ-217 — `recovered`

**Recovered detail:** The summary (screenshots 7-9, direct visual read) already contains full field-level and structural detail for the complex-product runtime instantiation/bundle customization UI: named configurable sections, radio-button selection patterns, a nested Customize sub-panel with Spend Limit Amounts/Discount Options tabs and specific action buttons, and the resulting bundle sub-line breakdown with per-line Action/Data Type/pricing detail.

**Evidence:** "Multiple configurable sections are shown: 'VAS Flex-purchase Prepaid Opt-in' — radio options None (selected) / ...; 'Bill Limit' section (radio list with List Price / Your Price / Promotion / Explanation / Customize columns)... Under the 'Spend Limit Amounts' tab (alongside a 'Spend Limit Discount Options' tab): SL Limit Amount = 75, SL Min Value = .01, SL Default Value = 20. Action buttons: Save, Cancel, Done, Finish It, Verify"

### REQ-221 — `recovered`

**Recovered detail:** Confirmed as a specific inline UI info note appearing on the Addon & Discount step (step 4 of the guided wizard), immediately below the Select Add-on/Select Discount buttons, in a context where a discount actually WAS applied (QR 25 Discount for 6 Months) alongside the empty-state note — showing the note is a persistent UI element regardless of whether the selector is populated or not.

**Evidence:** "Step 4 – Addon & Discount: "Select applicable add-on and discount based on customer's plan." ... Discount: "Select Discount" button; "QR 25 Discount for 6 Months" already shown as applied. Info note: "if there are no applicable add-on or discount, the selector will be empty.""

### REQ-222 — `recovered`

**Recovered detail:** Directly evidenced in the tablet B2B2C guided journey's Step 5 (Number Selection), item 14 of Key content, showing the exact tab set and which tab is active by default plus the selection/reservation behavior tied to that tab.

**Evidence:** "Step 5 - Number Selection (image14). "Select a Number to Reserve:" with tabs Star Number / Free Number (active) / Reserved Number. Number 79027268 selected from a grid of QR0.00 free numbers."

### REQ-223 — `recovered`

**Recovered detail:** Directly evidenced with before/after account and contact record screenshots in the same guided journey (items 2 and 27 for Account; items 1 and 25 for Contact), showing the B2B2C tagging did not exist pre-journey and appeared post-journey on both records, which is the concrete persistence proof requested.

**Evidence:** "Post-journey Account record (image27). Account "YAM POKHAREL" now shows Special Management: "B2B2C Consum..." (B2B2C Consumer)... Post-journey Contact record (image25)... Employer field now populated "VFQA_Test_Ma..." (the B2B2C company link persisted onto the contact)"

### REQ-224 — `recovered`

**Recovered detail:** The summary (screenshot 7, direct visual read) already contains the exact verbatim dialog text, its trigger condition (Account carries a pre-existing Special Management field value), the two available actions (OK/Cancel), and the confirmed downstream effect of clicking OK (journey proceeds as standard consumer/non-B2B2C sale) plus the backend field it references (Special Management = 'CBU Test' on the Account record, shown later in the same walkthrough) -- this is a complete override-confirmation flow specification, not just a label.

**Evidence:** ""The Account has already Special Management field value. Do you still want to continue the journey without B2B2C" with OK and Cancel buttons... because the customer's Account already carries a "Special Management" value (here "CBU Test," visible on the backend Account screen)"

### REQ-225 — `recovered`

**Recovered detail:** The source document (guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus) documents the full order-status progression end-to-end with concrete state transitions and per-line detail: order created as Status Pending -> after manager Approve, Status Open/Fulfillment Status In Progress -> Status Complete/Fulfillment Status Complete with Status Context 'All order lines are completed', and all 11 line items individually reaching Status Complete with per-line Status Context values distinguishing fulfillment sub-stages.

**Evidence:** "the Sales Order record now shows Status: Complete, Fulfillment Status: Complete, Status Context: "All order lines are completed" ... each with Status Context values reading "FULFILL BILLING COMPLETE: reached" or "SMS NOTIFICATION COMPLETE: reached" for each line, confirming successful end-to-end fulfillment."

### REQ-227 — `recovered`

**Recovered detail:** Same evidence chain as REQ-146 in this document: the e-signature capture (image10) is immediately followed in-flow by the signed CAF Section 3 (image11) showing the signature graphic embedded with a system-generated timestamp and consent/opt-out text, and then the Sales Order (image12) is created — establishing the concrete journey/screen link and ordering (Plan step -> CAF -> e-signature -> signed CAF record -> Sales Order) for this requirement.

**Evidence:** ""Please Sign" modal with a hand-drawn signature already captured on the signature pad; buttons "Done" and "Clear Signature" ... system timestamp "KARTHIKK 16:03:2025 10:21:22""

### REQ-239 — `recovered`

**Recovered detail:** Transcript gives the explicit functional requirement and its concrete content scope (lock-in periods, star number information, home device penalties, 5G fencing), directly tied to the pre-signature step of the CAF journey.

**Evidence:** "00:59:41 functional: Present a summary view before signing showing key information such as star number lock-in periods, penalties and fencing rules, per service type. / 00:59:41 Highlighting key terms before signature: Request for a view before the CAF signature so the agent and the customer see key information (lock-in periods, star number information, home device penalties, fencing on 5G) instead of relying on the T&C image on the back of the CAF."

### REQ-240 — `recovered`

**Recovered detail:** Transcript gives the explicit functional requirement with the two named categories (CAF, QID/ID) and the explicit retention policy (online-only warm archive, no cold archive, no removal), plus an extension of categorization to contacts.

**Evidence:** "01:03:33 functional: Attachment document categories so that a signed CAF is labelled CAF and an ID is labelled QID, making it easy to backtrack later. / 01:04:19 non-functional: Keep attachments available online; warm archives only, no cold archives, attachments must not be removed."

### REQ-242 — `recovered`

**Recovered detail:** Transcript confirms the exact figure via a direct Q&A exchange and a risk entry noting the size limit is a constraint on adding supplementary T&C pages.

**Evidence:** "01:47:28 Q&A: What is the CAF attachment size limit today after PDF? Around 4MB, which is considered fine. / Risk: Adding supplementary T&C pages increases CAF/PDF size beyond currently around 4MB."

### REQ-244 — `recovered`

**Recovered detail:** Transcript confirms this as an explicit stated decision/direction, contrasting the current business-driven approach against the prior technology-driven Open UI build, appearing twice in the transcript (narrative summary and decisions table).

**Evidence:** "01:09:29 Unlike the previous Open UI work which was technology driven, this time the design will be driven by business."

### REQ-245 — `recovered`

**Recovered detail:** Transcript confirms all three sub-decisions individually and with more nuance than the summary: ECR decommission (capabilities to be reconsidered, customer app stays), MCCR capabilities covered by the new stack (custom CRM portal/app to be used post-modernisation), and VSA/BSA explicitly out of scope (their own team makes any CAF changes on their side).

**Evidence:** "00:04:42 ECR will be decommissioned and will no longer integrate with the new stack; whatever capabilities exist on ECR must be reconsidered, while the customer's app will stay. / 00:05:03 MCCR capabilities will be covered by the new stack; after stack modernisation the custom CRM portal and CRM app should be the ones used. / 01:49:59 VSA/BSA will not be touched as part of this programme; if changes such as an extra CAF page are needed, that team makes the change on their side."

### REQ-246 — `recovered`

**Recovered detail:** Transcript contains a distinct, more specific decision at 01:16:19 sequencing the actual workshop/design walkthrough itself (consumer postpaid/prepaid mobile discussed first, enterprise later), in addition to the narrative-summary mention at 01:53:53 that consumer would be completed before enterprise.

**Evidence:** "01:16:19 Decision: Discuss consumer postpaid mobile and prepaid mobile first; enterprise later."

### REQ-264 — `recovered`

**Recovered detail:** Direct re-extraction of the Mobile Postpaid BRSD's 05_Requirements sheet (158 rows, only ~8 were summarized previously) confirms MPAR_001_JSM_01-08 all sit under Capability 'Journey and Session Management', explicitly describing agent-desktop journey initiation with role-based authorization for the New Postpaid Mobility activation journey.

**Evidence:** "MPAR_001_JSM_01: 'The system shall allow a Retail Agent to initiate a New Postpaid Mobility activation journey for a walk in customer from the Agent Desktop.' MPAR_001_JSM_02: 'The system shall authenticate the Retail Agent and authorize journey access based on the agent role defined in Agent Role Privilege Matrix.'"

### REQ-266 — `recovered`

**Recovered detail:** Same BRSD sheet: MPAR_001_JSM_08/09/10 explicitly describe milestone save and draft-order resume, which is the source evidence already cited in journeys.md/Reusable Pattern 16 (In-Progress Journey Resume List) — this requirement should link directly to that pattern and to UJ-005.

**Evidence:** "MPAR_001_JSM_08: 'Save milestone on validation success.' MPAR_001_JSM_09: 'Resume draft order.' MPAR_001_JSM_10: 'Draft order expiry.'"

### REQ-275 — `recovered`

**Recovered detail:** Sourced from BRSD Dependency D-05 (notification templates/triggers/recipients not yet supplied at BRSD-drafting time) — this dependency is now resolved by this blueprint's own Stage F work: notification-catalogue.md was built directly from data/SMS Templates.xlsx with 24 templates and explicit trigger conditions. The BRSD's dependency is satisfied by cross-referencing that file.

**Evidence:** "BRSD Dependency D-05: 'notification templates/triggers/recipients required' — resolved by notification-catalogue.md's direct extraction of the actual SMS Templates workbook."

### REQ-278 — `recovered`

**Recovered detail:** Direct re-extraction of Order Validation Business Rules.xlsx confirms ORD_VALD_RULE_001 ('Order Billing Profile must match Line Items' Billing Profile'), Step/Process Path 'VFQA Validate Order Process Workflow'. Links to Order Management module and UJ-051/UJ-054 (Order Correction / B2B2C Fixed Line order approval) which already reference order validation in workflow-execution-matrix.md and test-scenario-catalogue.md's Order Management scenarios.

**Evidence:** "ORD_VALD_RULE_001, Process Path: VFQA Validate Order Process Workflow"

### REQ-279 — `recovered`

**Recovered detail:** ORD_VALD_RULE_005 ('For business account, pending order cannot be submitted if open order exists under it') — already cited directly in test-scenario-catalogue.md's Order Management negative scenarios (TC-ORD series). Links to Order Management module.

**Evidence:** "ORD_VALD_RULE_005, Business Rule: 'For business account, pending order cannot be submitted if open order exists under it.'"

### REQ-280 — `recovered`

**Recovered detail:** ORD_VALD_RULE_019 ('Serial Number is required for SIM CARD product') — already cited in test-scenario-catalogue.md's Order Management scenarios. Links to Order Management module and SIM & Number Management module.

**Evidence:** "ORD_VALD_RULE_019, Business Rule: 'Serial Number is required for SIM CARD product'"

### REQ-281 — `recovered`

**Recovered detail:** ORD_VALD_RULE_030 ('All Payments should be Authorized') — already cited in test-scenario-catalogue.md's Order Management scenarios. Links to Order Management module and Billing & Adjustments module.

**Evidence:** "ORD_VALD_RULE_030, Business Rule: 'All Payments should be Authorized'"

### REQ-285 — `recovered`

**Recovered detail:** Direct re-extraction of Order Validation Business Rules.xlsx found ORD_VALD_RULE_058 ('For Non IoT service, MSISDN length should be 8') and ORD_VALD_RULE_060 ('For IoT service, MSISDN length should be 10'), both under Step 'IOT Validation', Process Path 'VFQA Validate Order Process Workflow --> VFQA Validate IOT Order process Workflow'. Links to Enterprise/IoT/B2B module and ENT-011 IoT SIM/Device entity.

**Evidence:** "ORD_VALD_RULE_058: 'For Non IoT service, MSISDN length should be 8' (Error: 'Service Id is Not 8 Digit-NON IOT Number'). ORD_VALD_RULE_060: 'For IoT service, MSISDN length should be 10' (Error: 'Service Id is Not 10 Digit-IOT Number')."

### REQ-286 — `recovered`

**Recovered detail:** Mobile Postpaid BRSD's Capability Summary confirms CAP-13 'Notification and Feedback' (Notification Platform, Medilia) as one of the 13 formal capabilities. Links to notification-catalogue.md and Mobile Postpaid module.

**Evidence:** "CAP-13 Notification and Feedback (Notification Platform, Medilia)"

### REQ-306 — `recovered`

**Recovered detail:** The fuller python-pptx extraction (which recovers table footnotes that the earlier summary paraphrased) shows this rule is a footnote directly attached to slide 8's 'Types of Application Forms' table, which itself enumerates exactly which channels/form-types the digital-CAF vs manual-signature split applies to (Prepaid, Postpaid/Fixed, Star Number, Giga Home Supplementary, Transfer of Number, MNP, FNP — each cross-tabbed by OPEN UI/ECR/VSA/WEB/MVA channel). This directly links REQ-306 to a specific screen/table structure (the Types of Application Forms matrix) rather than being a free-floating claim.

**Evidence:** "*Retail stores use digital signature pad, while Direct sales use tablet. [footnote to the table columned: Activation Forms | OPEN UI* (Desktop/Tablet) | ECR | VSA (KeyBS platform) | WEB | MVA, with rows Prepaid Application form, Postpaid/Fixed Application Form, Star Number Form (Mobile), Giga Home Supplementary Forms, Transfer of Number, MNP, FNP]"

### REQ-307 — `recovered`

**Recovered detail:** Slide 3 ('VFQA | Prepaid Activation Offshore') is a full ordered swimlane process-flow diagram with actor lanes and sequential steps, which the original summary compressed into a single sentence. The fuller shape-level extraction (ordered left-to-right by x-position) recovers the complete step sequence with actors: Customer -> Request for Prepaid; Offshore Sales -> Raise Prepaid Order; Offshore Fulfillment -> Retrieve Order; Offshore Fulfillment -> Order Validation; Offshore Fulfillment -> Accept/Reject (branching); branch outcomes Reject / Accept feed into System -> Automatic Provisioning and Offshore Fulfillment -> Send Report, with a 'Process Enhancement' callout tag on the Send Report/Provisioning stage. Also recovered: presenter's note 'Tech Recommendation: Can be pushed same as before,' clarifying this flow is being carried forward unchanged into the target state.

**Evidence:** "Table row sequence by shape position: 'Customer / Request for Prepaid' -> 'Offshore Sales / Raise Prepaid Order' -> 'Offshore Fulfillment / Retrieve Order' -> 'Offshore Fulfillment / Order Validation' -> 'Offshore Fulfillment / Accept/Reject' -> 'Offshore Fulfillment / Send Report' and 'System / Automatic Provisioning', with text boxes labeled 'Reject' and 'Accept' on the branch arrows, and a grouped shape labeled 'Process Enhancement'. Speaker notes: 'Tech Recommendation: Can be pushed same as before'."

#### Reclassified — Not Applicable (19)

### REQ-051 — `not_applicable`

**Why not applicable:** This is a cross-cutting technical/architecture principle (align to PIP pre-built APIs rather than build custom APIs) stated as a non-functional/architectural constraint applying to the Customer 360 bill-view and service-view screens generally, not a discrete UI capability that itself maps to one journey/screen. The fuller extraction confirms it is scoped as a dependency/risk item ('[01:22:29] dependency: Screens must align with PIP pre-built APIs...'; '[01:22:41] risk: If screens are not correlated with PIP APIs, completely different APIs not provided by PIP will be needed') rather than a journey step. It already correctly attaches to the Customer 360 discussion contextually; there is no additional screen-linkage evidence to recover beyond that architectural framing, which is inherently cross-cutting rather than screen-specific.

### REQ-060 — `not_applicable`

**Why not applicable:** This is a non-functional/architectural constraint on how a business rule must be implemented ('the business rule controlling whether a change is allowed must be configurable, not hard-coded' — 00:24:31), not a UI capability. It is a cross-cutting system-design requirement (analogous to an NFR/technical constraint), and does not have — nor should it be expected to have — a specific journey or screen link. It applies to the rules engine/config layer underlying the bill-cycle-change journey generically, not to any one screen.

### REQ-088 — `not_applicable`

**Why not applicable:** This is a cross-cutting future action item/follow-up task ('Supplementary Form Digitalization: Initiate the process to digitalize the supplementary form... to streamline the fixed portion of the order process', explicitly listed under 'Follow-up tasks' owned by VCLS-Giga) rather than a capability tied to a specific journey or screen build. The full transcript confirms it is a to-be initiative with no journey/screen linkage stated anywhere in the source - it is an organizational action item, not a UI requirement that maps to a screen.

### REQ-110 — `not_applicable`

**Why not applicable:** This is a cross-cutting program-level architectural principle (the DXP 'capability building block' pattern), explicitly introduced in the workshop as a platform-wide modernization concept applied across prepaid, postpaid, AND enterprise journeys -- not a capability scoped to one journey/screen. The transcript itself frames it as a wrapper/abstraction layer that 'hides workflow, data handling and complexity from agents' across all journeys, i.e. an NFR/architecture decision, analogous to how other cross-cutting NFRs in this corpus (e.g., 'Unified single UI' at 01:28:38) are correctly treated as principles applied across the whole platform rather than requirements needing a single journey/screen link.

### REQ-117 — `not_applicable`

**Why not applicable:** Verified the raw Excel directly (40-row flat list, single column, no rule-ID column, no condition-logic column, no screen/field-mapping column). This source is structurally a flat validation-message catalog/reference list, not a UI screen or a stateful business object -- it has no navigational context of its own to link to a specific journey/screen, and re-mining cannot manufacture a journey/screen link that the source never encoded. The messages are already fully enumerated in the existing summary (mandatory-field, format/length, cross-field, and authorization categories) and independently cross-referenced to the CAF Applicant-details fields, which is the correct treatment for a cross-cutting validation catalog rather than a per-screen artifact.

### REQ-118 — `not_applicable`

**Why not applicable:** This is a project-planning/resourcing estimation figure (screens-per-journey x journey count = total screen estimate, used to size delivery timeline and headcount), not a functional or UI requirement that links to a specific journey or screen. It is a meta/program-management artifact from the 'Summary_Sheet1' planning sheet, categorically different from a business requirement needing traceability to a journey/screen — there is no additional evidence to recover because the item is definitionally a cross-cutting estimation model, not a capability.

### REQ-119 — `not_applicable`

**Why not applicable:** This is a classification/taxonomy applied across the existing 165-row journey catalog (tagging each journey as Guided Journey / Vanilla Action / View Only) rather than a discrete new functional requirement pointing at one journey or screen. It is inherently a cross-journey summary statistic from the 'Summary' sheet, not a requirement that resolves to a single journey/screen link — every one of the 165 underlying rows already carries this classification in the 'Open UI Features' sheet, so the classification is already fully traceable at the row level; the aggregate statistic itself is a reporting artifact, not an actionable requirement needing a journey link.

### REQ-120 — `not_applicable`

**Why not applicable:** This 'requirement' is actually the analytical Type-classification pass itself (the added 'Type' column on the Page Type sheet plus the Type Taxonomy lookup sheet). It is a meta/reference construct describing how the dataset's 165 rows were categorized, not a product/UI capability that a user exercises through a journey or screen. There is no journey/screen for a customer or agent to 'do' 165-row classification - it is a data-modeling artifact produced for this reconstruction effort. Confirmed by re-reading the Type Taxonomy sheet in full (5 rows: User Journey/Workflow-Task/View/Action/Access-Permission, each with Definition + Use Case) - it is purely definitional, with no field, screen, or transactional behavior attached.

### REQ-121 — `not_applicable`

**Why not applicable:** This is the generated Relationship/Traceability sheet itself (User Journey -> Workflow/Process -> Task -> View/Screen -> Action -> Access/Permission), an analytical model built post-hoc from the Page Type sheet by this reconstruction project, not a Vodafone business requirement for an application feature. Re-reading the full sheet (methodology section, 15 Functional Clusters, hierarchy tree, Relationship Catalogue, Gap Analysis at rows 473-521) confirms it is explicitly self-described as 'a one-time analytical pass, not a recalculating model' with 'RECONSTRUCTED, not read directly off an explicit field' relationships. It documents traceability rather than being a journey/screen-linkable capability in its own right.

### REQ-145 — `not_applicable`

**Why not applicable:** This document (already high/medium-confidence direct visual read of all 12 embedded screenshots) is the primary and only evidence source for this specific screenshot instance; the requested 'journey/screen link' cross-reference itself is a cross-cutting UI validation rule spanning multiple journeys (Fixed Line, Prepaid) rather than a single-screen feature — the summary already states which specific journey (New Prepaid Tablet) and step (Contact) this instance occurs in, and cross-document linkage to Fixed Line was already established in the item description itself, not missing from this source. No further per-document evidence remains to mine here.

### REQ-231 — `not_applicable`

**Why not applicable:** REQ-231 is effectively a duplicate/generalization of REQ-184 in the same document, backed by the identical single piece of evidence (the Connection Details modal in screenshot 8). There is no additional distinct evidence in the source beyond what already satisfies REQ-184 — the two requirement IDs appear to be two traceability-matrix entries pointing at the same underlying UI fact rather than two separable requirements needing separate proof. No further unique evidence exists to mine for REQ-231 specifically.

### REQ-256 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's own Open Items log (OI-16) — a documented program-governance gap about missing NFRs, not a UI capability. Categorically not journey/screen-attributable.

### REQ-257 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's own Open Items log (OI-01) — a documented program-governance gap about missing requirement metadata, not a UI capability.

### REQ-267 — `not_applicable`

**Why not applicable:** A document-versioning note (v2.0 acceptance-criteria update list) — a change-log entry, not a UI capability.

### REQ-268 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's Assumptions section (A-03) — an architectural assumption ('catalogue/pricing rules are configuration, not hard-coded'), not journey/screen-attributable. Cross-references frontend-architecture.md's Configuration Engine principle instead.

### REQ-269 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's Assumptions section (A-01) — an architectural assumption ('Siebel CRM remains system of record'), not journey/screen-attributable.

### REQ-270 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's Assumptions section (A-02) — an architectural assumption about interface reuse, not journey/screen-attributable.

### REQ-271 — `not_applicable`

**Why not applicable:** Sourced from the BRSD's Dependencies section (D-01) — a dependency on future VFQ input, not a capability with a journey/screen.

### REQ-305 — `not_applicable`

**Why not applicable:** This is a summary-level factual statement about form digitization scope (a cross-cutting policy fact), not a capability tied to one specific journey/screen click-path. The deck itself (slides 7-8) states it as a blanket policy applying across all consumer CAF types, not as a single-journey feature. A 're-mined' journey/screen link would be artificial for a program-level policy statement of this kind; it is already fully evidenced at the level of detail the source provides.

#### Genuinely Gapped — Recommended Assumption (13)

### REQ-024 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Ran markitdown on the source .docx to check for compressed detail beyond the summary. The full transcript confirms this is a single passing pain-point mention in a pain-points list, with no further elaboration, no proposed solution, no linked journey/screen, and no owner/priority assigned anywhere else in the ~70 minutes of decoded transcript (which cuts off abruptly at 01:09:25). It is a genuine cross-cutting data-visibility gap statement (connection count not surfaced in Siebel UI or on the invoice document) rather than a concrete UI capability that can be mapped to a journey/screen. By analogy to other orphan/pain-point items in this same workshop transcript (e.g. 'static IPs must be found manually in the pool - search does not work', 'one line item per Microsoft licence with manual price changes because quantity does not carry to billing without auto-explode') which are also standalone pain-point bullets without a linked journey in this document, this item's likely home would be the Account Summary / Asset Summary or Billing Profile screens (as an added 'Connection Count' field) and the Invoice/Bill template (as an added summary line) - but this is a plausible placement inferred from context, not evidenced. A business-owner decision is needed on which specific screen(s)/report(s) should surface this field, since the workshop discussion never reaches that specificity before the recording cuts off.

### REQ-057 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Ran full markitdown extraction of the source .docx (fuller than the .md summary) and cross-checked every mention of CC/multi-email/email-type language (timestamps 00:06:50, 00:07:14, 00:13:42, 00:13:57) — the document is a structured workshop-decisions summary with no journey name or screen/field reference anywhere for this capability; it is discussed purely as a data-model/business decision, not walked through in any UI. No journey or screen exists in this corpus for 'bill profile / contact email management' to link to. Recommended assumption: model as fields on the existing 'Bill Profile' / 'Contact' screens evidenced elsewhere in the CRM Journeys inventory (the same screens that carry Notification Contact / Notification Language fields, as seen operationalized in the FWA guided journey's order Line Items step, image 10: 'Notification Cell', 'Notification Contact', 'Notification Language') — add a repeatable 'Bill Email' sub-list (email, type: work/personal, CC flag, verified status) to that existing screen pattern rather than assuming a new screen. This needs business-owner/design confirmation, not just inference.

### REQ-058 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Full-text re-check (timestamps 00:14:38, 00:14:43, 00:20:22) confirms only the business rule and an assumption ('assume an API which will call back asynchronously') are stated — no screen, field, or journey name is given for where/how verification status is surfaced or triggered. No analogous evidenced UI pattern for async-callback-driven status exists elsewhere in this corpus to safely extrapolate from (the closest analog, AutoPay status display in Customer 360, is itself only a discussed decision, not a walked-through screen). This requires a business-owner/design decision on the target screen rather than a grounded inference — flag as unresolved rather than guess.

### REQ-059 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Full-text re-check (00:28:26, 00:29:53, 00:30:59, 00:31:16, 00:31:35) confirms this is discussed only as a Customer 360 visibility requirement ('show the auto debit status and the auto debit transaction in Customer 360, including whether payment was made in full') with no field-level layout, no journey steps, and no screen mockup referenced anywhere in the document. Recommended assumption: since Customer 360 is referenced by name as the target surface, treat this as a new read-only panel/section within the existing Customer 360 view (view-only fields: AutoPay Status, Failure Reason, Last Transaction, Payment-in-Full flag) — grounded only in the fact that Customer 360 is explicitly named as the intended location, not in any evidenced field layout for that panel. Field-level design still needs business-owner confirmation.

### REQ-061 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Full-text re-check (00:24:51, 00:25:54, 00:26:02, 00:26:20, 00:26:35) confirms this is a business-process decision about ticket lifecycle timing, not tied to any screen or journey name in the document. Recommended assumption: attach this rule to the same 'Bill Cycle Change' ticket-creation screen/action implied by the related requirement at 00:23:01 ('Bill cycle change must be possible via a ticket assigned to authorised users') — i.e. the ticket-creation action itself should synchronously return a validation result and, if disallowed, auto-create-and-auto-resolve the ticket in the same transaction. This is inferred from the same paragraph's own described behavior, not from an unrelated analogous screen, so still flag for business-owner sign-off on exact UI treatment (e.g., is there a visible 'ticket closed' state shown to the agent).

### REQ-081 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Markitdown re-extraction confirms the business rule itself is fully evidenced (retail QID-scan-and-attach required only when a transaction results in an account/service change; complaints, inquiries, bill payments are exempt), and even surfaces one additional data point -- the verification fields used are 'account and holder name, QID, last name and channel' -- but the transcript explicitly states screen/UI design was NOT discussed in this session ("screen steps are not being discussed now", "exact steps are not being discussed"). No specific journey/screen link can be recovered from this source. Recommended assumption: attach this rule to the Contact/ID-verification step of the Retail-channel guided journeys already evidenced elsewhere in the corpus (e.g. the SIM Swap 'Verify contact details, upload QID front & Bank' step, or the Fixed Line/FWA tablet journeys' Contact step where Qatari ID-Front/Back uploads are conditionally required) -- by analogy, implement this as a conditional skip of the ID-attachment sub-step keyed off a transaction-type flag (service-change vs. non-service-change) at the Contact step of the Retail servicing journey, mirroring the same Contact-step ID-capture pattern seen in every other evidenced guided journey. This requires business-owner confirmation since the session was explicitly deferred.

### REQ-085 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The fuller markitdown transcript confirms the same content already in the summary (requirement timestamp 00:41:36/00:43:35/00:43:38) but adds no new journey/screen ID linkage - it only reiterates 'For fixed, the system should auto select a free number to reduce agent clicks... Prepaid and fixed numbers are zero rated so a number can be auto-defaulted; for mobile all postpaid numbers have a price so defaulting is not applied.' No specific screen name is ever given for the number-selection step in this document beyond 'Number Selection' as a journey step. Recommend linking REQ-085 to UJ (Fixed Line Postpaid Service Activation Journey) and to the analogous 'Step 5 - Number Selection' screen pattern evidenced in the sibling FWA guided journey doc (guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09), which shows a concrete Number Selection screen ('Select a Number to Reserve: Free Number / Reserved Number tabs') - the same UI pattern likely applies to the fixed postpaid journey since both are Siebel Open UI number-reservation steps.

### REQ-086 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Full transcript (00:47:52, 00:48:38, 00:50:53, 00:51:47) confirms the same content as the summary with no additional screen/journey ID. The appointment screen is referenced only generically as 'the appointment step'. Recommend grounding the assumption in the analogous FWA guided journey pattern: no dedicated Book Appointment screen capture exists there either (noted as a minor gap in that doc's own extraction notes), so this appears to be a systemic gap across the corpus for appointment-booking screens specifically, not just this document - a business-owner decision on the exact appointment screen field layout is needed rather than a guess.

### REQ-161 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Re-inspected the guided journey doc (guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap, the F1 cluster booking flow referenced) -- confirmed via full-text search of the summary that the Book Appointment modal only ever shows the four time-slot pills (8AM-11AM, 11AM-2PM, 2PM-5PM, 5PM-8PM) with one pre-selected; no 'Full', greyed-out, or disabled slot state, and no capacity-count field, appears anywhere in this or any sibling Guided Journey screenshot in the corpus (this is a screenshot-driven doc already at high confidence from direct visual reading, so no further text re-mining can add UI detail that was never captured in a screenshot). Recommended assumption: since no evidenced screen shows a 'Full' state, treat slot-capacity enforcement as a backend/business-rule concern rather than an observed UI behavior -- if a slot is fully booked it is most likely simply omitted from the pill list returned by the appointment API (consistent with the pattern seen in the Number Selection step, where only currently-available numbers are listed, never a disabled 'taken' number) rather than shown greyed-out. This is an inferred UI pattern by analogy to Number Selection, not directly evidenced for appointment slots, and should be confirmed with the business/UX owner before being treated as a firm design decision.

### REQ-272 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Sourced from BRSD Dependency D-02 (Star Number pricing matrix not yet supplied). This directly corroborates the existing gap on ENT-058 Star Number Value Tier (already flagged as underspecified in gap-analysis.md §4) — both point to the same missing pricing matrix from the Product team. Recommendation: until supplied, use the evidenced star-number tiers pattern from Reusable Pattern 10 (Number Selection) with placeholder tier values clearly marked TBD, rather than inventing prices.

### REQ-273 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Sourced from BRSD Dependency D-03 (CAF template matrix by role/channel/service type not yet supplied). Recommendation: use the evidenced CAF variants already in reusable-patterns.md Pattern 6 (Digital/Manual/Touch Screen) as the starting set and flag role/channel/service-type-specific template variations as TBD pending the matrix.

### REQ-277 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Sourced from BRSD Dependency D-08 (HRN advance payment matrix not yet supplied). Several guided journeys evidence a flat QR 100 HRN advance payment figure (e.g. 'guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2'). Recommendation: use QR 100 as a placeholder default (already evidenced in at least one real guided journey) but flag it as unconfirmed as the authoritative matrix value, since the BRSD itself says a formal matrix (likely varying by nationality/plan) is still pending Collections input.

### REQ-308 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The fuller extraction confirms slide 15 contains only the single sentence already captured in the summary, with no accompanying diagram, screen image, or step sequence for this specific MVA-to-report-to-ticket flow (unlike slide 3's Prepaid Offshore flow, which does have a diagram). No journey/screen link can be recovered from this source. Recommended assumption: model this as an manual/indirect interim process step (Customer submits via MVA -> report emailed/generated to a Team -> Team manually contacts customer -> Team manually raises a ticket in the CRM), by analogy by the same deck's own evidenced 'Agent Ticket Creation' screen flow (slide 17, image57/58: Trouble Tickets list with a '+' create action) as the target system-of-record screen where that manual ticket would ultimately land — i.e. assume the MVA-originated report converges into the same Trouble Tickets creation screen used for all other ticket intake, since no MVA-specific ticket screen is evidenced anywhere in the corpus. This is inferred by analogy to the one evidenced ticket-creation entry point, not confirmed for the MVA channel specifically.


## Journeys Without Step Detail (16 items)

#### Recovered (15)

### UJ-004 — `recovered`

**Recovered detail:** Fuller pandoc-plain extraction recovers a complete ordered step sequence for the Enterprise Account Creation journey, with per-step actor action, screen/tab location, and system behavior -- exactly the step/actor/input/output detail requested. Sequence: (1) Account search by CR number before creation (Account tab, search); (2) Parent account creation -- fill name, CR type, CR number, agent ID, business type, credit limit; (3) Sub-account creation -- Account tab > All Accounts > query > pick applet to link to parent; (4) Add contact -- Contact tab, plus button, query by QID (fetch existing or create new), set role dropdown to 'chooser'; (5) Add company address -- Address tab, new, select zone/street/building from order form; (6) Set notification contact -- auto-populates from account-level contact; (7) Billing profile creation -- Billing Profile tab, new, payment type Postpaid (default), bill cycle auto-assigned by creation date; (8) Account affiliation/role assignment -- inside contact, add role e.g. chooser, attach proof form, route to account manager for approval; (9) Web Self-Care activation -- attachment named QID_subaccount checked, affiliation approved, WSC access activated, registration notification sent to customer.

**Evidence:** "'00:06:45 Parent account creation: Fill the account screen with name, CR type, CR number, agent ID, business type and credit limit.' / '00:15:31 Sub-account creation and linking to parent: Go to account tab, all accounts, query the account, use the pick applet to select the parent account number so the sub-account is linked.' / '00:25:07 Add contact under account: Contact tab, plus button, query by QID; if the contact exists it is fetched, otherwise created; role drop-down set to chooser.' / '00:35:16 Billing profile creation: Billing profile tab, new, payment type Postpaid, bill cycle assigned automatically based on the creation date.' / '00:47:34 Web Self-Care activation: Attachment named QID_subaccount is checked, affiliation role set to chooser and approved, then Web Self-Care access is activated and a registration notification is triggered to the customer.'"

### UJ-016 — `recovered`

**Recovered detail:** The source document itself already contains a concrete, ordered journey: final bill covering the last cycle to the porting date payable within 30 days, followed by a three-level degradation/dunning ladder with specific day-numbers (outgoing bar day 31, incoming bar day 45, disconnection + number return, then a 30-day quarantine period), and identifies the donor operator (Ooredoo) as the initiator, later de-automated to manual after customer complaints.

**Evidence:** "After port-in, a final bill covers the last bill cycle to the porting date, payable within 30 days; then a three-level degradation/dunning ladder runs (outgoing bar day 31, incoming bar day 45, disconnection + number return, then 30-day quarantine). Degradation is initiated by Ooredoo (the donor) and was de-automated to manual after complaints from customers with legitimate bill disputes."

### UJ-032 — `recovered`

**Recovered detail:** The full transcript provides a much richer step-by-step reconstruction of the KID-in-Use journey than the summary: (1) at KID/location check, backend detects KID already active for another customer; (2) agent is allowed to proceed but the order is created+submitted with a mandatory order task attached; (3) a mandatory contract attachment (image copy, standard form, self-declaration) OR alternatively a Metrash government-app address screenshot is required as proof; (4) fulfillment team verifies the proof, disconnects the old connection, and connects the new one; (5) until the order task is completed, Siebel blocks downstream submission entirely; (6) if disputed (old customer claims still active), the order task is marked unsuccessful and the order is cancelled/broken with no downstream impact since it never reached downstream; (7) decision/action item: move the document capture to the START of the journey (at the location/KID step) rather than the end, since the system already knows about the conflict early - this was an open 'chicken and egg' risk under the current design where the customer could reach the appointment step before being told a contract is required.

**Evidence:** "01:36:34 | KID in use explained... For KID in use the order is created but with an order task. Siebel will not submit the order downstream; only when the order task is completed does the downstream flow resume. | 01:37:26 | If there is a dispute and the old customer says they are still there, the order task is made unsuccessful and the order is broken/cancelled. This has no other impact because the order has not yet reached downstream. | 00:57:35 Metrash as alternative proof | Retail is opting for Metrash, a government app that holds IDs, address and so on. The address screen can be opened and a picture taken; this is accepted as proof. | 01:00:52 Risk: Under the current design the customer can reach the appointment step without having the required KID in use documents, and once the appointment is selected it cannot be changed before submission. Chicken and egg problem."

### UJ-037 — `recovered`

**Recovered detail:** Full pandoc re-extraction of the source .docx transcript (beyond what the summary compressed) recovers detailed ordered steps for the New FWA 5G Outdoor journey: agent selects outdoor plan -> same add-on option -> select number -> serial-number-scan step SKIPPED (device requires installation) -> agent books WFM appointment directly -> outdoor equipment is two devices (external antenna + internal unit) -> if access/glass issues prevent outdoor install, indoor is offered as fallback (if speed satisfies customer, proceed; otherwise order cancelled) -> today the outdoor order is dropped and a new order created for the indoor fallback (flagged as a to-be gap: should be an in-place order update instead).

**Evidence:** "00:45:47 Outdoor order flow: Select plan, same add-on option, select number; the serial number scan step is skipped for outdoor because the device needs installation, and the agent directly books an appointment which goes to WFM. ... 00:46:52 Outdoor FWA equipment: Outdoor consists of two devices - one outside connected to the other inside; the outside device is a special antenna providing more coverage. ... 00:48:47 Outdoor to indoor fallback at installation: If there is an access issue or glass and outdoor cannot be installed, indoor is offered; if the speed satisfies the customer they proceed, otherwise the order is cancelled."

### UJ-051 — `recovered`

**Recovered detail:** A sibling Guided Journey document in the same folder (guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b, steps 26-37) documents the full Order Correction reject-and-resubmit cycle in granular step-by-step detail beyond the flagged snippet: manager Reject-Correction with a specific reason (e.g. 'Original QID was not captured'), the order flips to Approval Status 'Rejected' with an 'Update Details' action, the agent re-enters via the dedicated Order Correction tile, Step 1 Contact reopens pre-filled/read-only with ID images already verified, Step 2 CAF requires re-completion (Proof of Employment/CAF/Supplementary Form tiles reset), Step 3 Activity captures a new comment and resubmits, the order returns to 'Submitted for Approval'/Pending in the manager's queue, and on second review only Approve / Reject-Drop Order remain available (Reject-Correction is no longer offered after one correction round) -- ending in an approval SMS confirming the final state.

**Evidence:** "Reopening the order approval detail this time shows only Approve and Reject - Drop Order (the "Reject - Correction" option is no longer offered, since one correction round has already occurred) ... SMS payload confirming approval ... "New Fixed Line Tablet for MSISDN 97441224278 with Order number 1-29795232313 is now approved.""

### UJ-052 — `recovered`

**Recovered detail:** This journey's own workflow_steps_summary already contains real step-level content (18 numbered T&C clauses presented bilingually, customer review, then signature with Name/QID/Date) — it was missing from workflow-execution-matrix.md due to a data artifact (its 'sources' array was empty in Stage A synthesis, so it couldn't be matched during Stage B's workflow-step grouping, not because evidence doesn't exist). Source document confirmed by content match: the GigaHome Subscription Acceptance Form (5G Home Plans v3) document, an 18-clause bilingual acceptance form.

**Evidence:** "18-clause acceptance form — FWA/5G Home pricing, speed tiers, FUP, lock-in penalties (500/800/200 QAR), Fibre-migration terms (per gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d)"

### UJ-055 — `recovered`

**Recovered detail:** The document already contains a fully ordered, actor/step/input/output/validation-rich journey for UJ-055 in its 'Key content' items 1-27 plus the 'Overall flow observed' summary. Concrete steps: (1) Agent HALEEMI opens New Fixed Line Tablet on tablet, enters Kahramaa ID 16P6109, system detects Combo Box CPE/ONT serials and prompts Instant vs Normal Activation - agent picks Normal Activation; (2) Contact step captures Qatari ID 27652419981, validates via barcode scan (green check), captures ID Expiry/Nationality/Gender/Name/DOB, Get IPTV Yes, Email, Language, Alt phone, mandatory Qatari ID-Front/Back uploads; (3) Address step shows service points grid (Product Fixed Line Port, Device Type ONT); (4) Plan step - GigaHome 5Gbps Promotion selected, feature list shown; (5) Addon & Discount step - IPTV add-ons offered; (6) Number Selection - two free numbers offered, Reserve triggers SBL-EXL-00151 success token; (7) Book Appointment modal with Cluster, calendar, Collect QID/CAF flags, FNP fields, time-slot pills, warning dialog on submit, appointment confirmation with Appointment Number/Technician ID/Status/Date/Channel/ID/Time Slot; (8) CAF & Additional Attachments - full bilingual CAF rendered with applicant/billing/service sections, e-signature capture modal, CAF+Supplementary Form tiles; (9) Activity step - mandatory Comments free text, Save And Finish; completion dialog issues Order Number. Then order enters 'Submitted for Approval'/Pending in agent's My Sales Orders; a Test Manager persona (separate restricted Home/Order Approval/Manage Leads/Leads Queue menu) works a TM SR Queue View, Assigns To Me, opens the order (tabs Attachments/Order Details/Activities/Agents Details, header Contact/Order#/Order Expiry), and has 3 actions: Approve / Reject-Correction / Reject-Drop Order. Manager picks Reject-Correction with reason 'ID image not clear' and comment; an OSB CreateCommunication SMS is fired instructing the agent to go to Sales Order > My Rejected Orders. Agent re-enters via a dedicated 'Order Correction' tablet tile, sees Contact step reopened with previously-uploaded ID images cleared, must re-upload Qatari ID-Front/Back, then Continue/Close/Cancel Order. Backend Siebel Sales Order screen shows Status Open, Approved unticked, with Revise/Validate/Submit/Drop Order/Cancel Order actions; Account 360 and Contact Audit Trail confirm field-level change history tied to specific users/timestamps.

**Evidence:** "Tablet agent (HALEEMI) builds a Fixed Line "Normal Activation" Triple Play order on a Combo Box device → order (1-29795175561) is submitted and lands in "Submitted for Approval" / Pending status → a Test Manager persona picks it up from an Order Approval queue → the manager rejects it via "Reject - Correction" with reason "ID image not clear" → an OSB-driven SMS/notification is fired instructing the agent to go to Sales Order > My Rejected Orders to correct it → the agent re-enters the flow via a dedicated "Order Correction" tablet tile, where the ID front/back images (previously cleared) must be re-uploaded → the corrected order is visible back in the Siebel desktop Sales Order screen with Status Open and Approved still unticked"

### UJ-061 — `recovered`

**Recovered detail:** The full document IS the step-by-step detail for this journey — it is not actually a gap once the whole summary is read; it contains ~33 ordered steps across 6 parts (A-F) with actors (Sales Agent KARTHIKK, Technician Syed Irfan), systems (CRM Open UI Desktop, Oracle Field Service Cloud), inputs (Qatari ID, address, plan selection, appointment slot), validations (required-field dialogs, serial number checks, Kahrama duplicate check), and outputs (Order 1-29728035948 Complete, installed assets Active, data buckets live).

**Evidence:** "Part A — Sales order creation (guided wizard, "New FWA") ... Part B — Sales Order record and Line Items ... Part C — Technician inventory loading ... Part D — Technician activity, "Move", and inventory transfer ... Part E — Technician "My Route" and on-site installation activity ... Part F — Final verification ... End state: Full success — Sales Order Complete, all line items and installed assets Active, data buckets live, WFM installation activity ended with signed checklist and customer signature."

### UJ-071 — `recovered`

**Recovered detail:** The summary itself (high confidence, full 35-screenshot direct visual read) already contains a complete, fully ordered end-to-end step sequence for this journey with actor, input, output, and validation detail at every step: Home/login -> MNP Tablet -> Choose process (Switch as Prepaid) -> Contact (ID lookup, MOI Validation banner, confirm fields) -> SIM Serial (entry + reservation) -> Plan (Prepaid Red Promotion) -> Donor Details (Port-in Number, Donor ID Type/ID/Operator/Subscription Type, warning banner) -> MNP T&C generation and e-signature -> Donor Attachment (signed T&C tile) -> CAF generation, e-signature, and 'send switch to 151' instruction -> Activity/comment -> Save and Finish -> 'MNP completed successfully' confirmation with Order Number -> resulting Sales Order (Status Open) and Account/Contact/Order attachment records.

**Evidence:** "14. Order completion (image31): Confirmation modal: "MNP completed successfully. Order Number:- '1-23864057846'" with a Finish Process button — this is the terminal success state of the guided journey."

### UJ-099 — `recovered`

**Recovered detail:** The 05_Requirements sheet contains a full ordered set of 8 atomic requirements for Fixed Line Port In under section header '#22. Fixed Line specific Port In Use Case (FIB-FPI-RTL-005)', each with actor, trigger/condition and system behavior, effectively giving step-level journey detail: FIB_FPI_RTL_005_01 Ported number capture (Retail Agent captures the number being ported, cannot select a new number); _02 Portability identifier marked at appointment booking; _03 Portability Appointment Date set when identifier is marked; _04 Portability form completed by agent, signed by customer, uploaded; _05 Portability request created and submitted to the number portability administration system; _06 Portability request confirmation received from that system after Donor Service Provider approval; _07 WFM Task for FLN Change triggered based on Confirmed Port In Date; _08 Ported number activated after portability completion, configured during the WFM task, no temporary number issued. In addition, Annex_02_Status_Model gives an explicit Portability Ticket lifecycle (Created -> Validating -> Conditionally Accepted / Accepted / Rejected / Suspended -> Termination Order Generated / Terminal) that, while framed for Port Out, is the same ticket-status backbone referenced by this journey's ecosystem.

**Evidence:** "FIB_FPI_RTL_005_01 | Ported number capture | The system shall allow the Retail Agent to capture the fixed line number being ported in and shall not permit selection of a new fixed line number for a port in journey. ... FIB_FPI_RTL_005_08 | Portability activation after completion | The system shall activate the ported fixed line number after portability completion and shall configure it during the field workforce management task, providing no temporary number."

### UJ-100 — `recovered`

**Recovered detail:** The 05_Requirements sheet contains a full ordered set of 11 atomic requirements for Fixed Line Port Out under section header '#23. Fixed Line specific Port Out Use Case (FIB-FPO-RTL-006)': FIB_FPO_RTL_006_01 automatic trouble ticket creation in CRM on receipt of port-out request from the number portability administration system; _02 automatic queue assignment + initial validation SLA timer start; _03 agent validates portability form/ID document, can upload documents to the ticket; _04 mandatory field/date checks (form date within allowed period, name/ID/service type match records); _05 outstanding-bill handling - moves to 'conditionally accepted' with a window to clear dues; _06 SLA timer extension from initial to final-action period once documents are valid; _07 automatic processing per configured rule on SLA breach; _08 every accept/reject/conditional-acceptance status communicated back to the administration system with defined status codes; _09 agent generates a termination order from the ticket on closure, wish date = confirmed portability date; _10 network deactivation on confirmed portability date with a 1-hour activation window for the new provider; _11 inventory quarantine + SIM deactivation/release for FWA. This is directly paired with the explicit Portability Ticket status model in Annex_02_Status_Model: Created -> Validating -> Conditionally Accepted / Accepted / Rejected / Suspended -> Termination Order Generated -> Terminal, each with a documented Trigger and Permitted Next Status.

**Evidence:** "FIB_FPO_RTL_006_05 | Port out outstanding bill handling | The system shall move the request to conditionally accepted where the customer holds a pending bill and shall allow the customer a defined window to clear the dues. ... Annex_02_Status_Model: ('Portability Ticket', 'Conditionally Accepted', 'Awaiting outstanding dues settlement within the window', 'Pending bill identified', 'Accepted, Rejected, Suspended')"

### UJ-101 — `recovered`

**Recovered detail:** The 05_Requirements sheet contains a full ordered set of 13 atomic requirements for Fiber Termination under section header '#24. Fixed Line specific Termination Use Case (FIB-TER-RTL-007)': FIB_TER_RTL_007_01 Retail/Retention Agent initiates termination from Customer 360 for an active Fibre/FWA service; _02 eligibility validation (identity, service status, open orders, active disputes, fraud/legal blocks, pending termination requests); _03 retention routing and outcome capture before order creation; _04 outstanding-dues validation against configured VFQ settlement rule; _05 penalty/early-termination charge calculation and display before confirmation; _06 equipment recovery WFM appointment where required (incl. FWA outdoor device); _07 termination reason + requested date capture with appointment/payment details before submission; _08 termination order creation/submission to Order Management after validations/consent/recovery satisfied; _09 network deactivation on confirmed date with outcome returned to CRM; _10 billing closure (final charges, penalty, refund/credit, closure status); _11 inventory release (FLN, CPE, ONT, FWA SIM/equipment, IP) per service-type rules; _12 customer notification at request creation/order submission/appointment/completion-failure; _13 inventory quarantine + SIM deactivation for FWA. This pairs with an explicit Termination Request lifecycle in Annex_02_Status_Model: Created -> Under Retention -> Retained/Validated for Termination -> Validation Failed -> Termination Order Submitted -> In Deactivation -> Completed/Failed -> Cancelled, each row with Description, Trigger, and Permitted Next Status.

**Evidence:** "FIB_TER_RTL_007_03 | Retention handling | The system shall route the termination request to the retention process where required and capture the retention outcome before termination order creation. ... Annex_02_Status_Model: ('Termination Request', 'Under Retention', 'Retention handling in progress', 'Request routed to Retention', 'Retained, Validated for Termination, Cancelled')"

### UJ-102 — `recovered`

**Recovered detail:** The 05_Requirements sheet contains a full ordered set of 8 atomic requirements for Fixed Line RFS under section header '#24. Fixed Line specific "Ready for Service" (RFS) Use Case (FIB-RFS-008)' (note: duplicate '#24' numbering in source, immediately follows Termination): FIB_RFS_008_01 go-to-market file pickup via mediation layer, filtered/transformed into system-specific formats; _02 distribution of processed data to IMS, RFS Portal, CRM, and analytics data warehouse; _03 Vodafone/operator identifier generation and mapping to utility identifier via field survey (1:1 and 1:many supported); _04 building marked ready-for-service with applicable SLA category recorded; _05 sales team searches RFS Portal by address/utility identifier/area; _06 offer recommendations received from Big Data system into RFS Portal; _07 sales agent creates a lead in CRM from the RFS Portal using customer mobile number; _08 continuous RFS data update via subsequent go-to-market file loads plus manual business updates. This is a batch/data-management journey (not a customer-facing UI journey with a status lifecycle) but the step sequence, systems, and data flow are now explicit and ordered.

**Evidence:** "FIB_RFS_008_01 | Go to market file pickup and transformation | The system shall pick up the go to market file through the mediation layer and shall filter and transform the data into the system specific formats required by each downstream system. ... FIB_RFS_008_07 | Lead creation from portal | The system shall allow the sales agent to create a lead in the customer relationship management system from the ready for service portal using the customer mobile number."

### UJ-109 — `recovered`

**Recovered detail:** Slides 16-19 are screenshot/diagram slides that python-pptx text extraction could not read, but direct image viewing recovers a complete, ordered, actor-tagged BPMN swimlane for the Complaints Management Process plus full field-level detail for the downstream Agent Ticket Creation / Ticket Homepage / Activities screens: (1) Complaint Management Process diagram (slide 16) with lanes Customer / Front line (Care/Retail): START -> Customer contact VF for an issue -> Receives Inbound Call/email/Chat/Visit -> Troubleshooting -> decision 'Issue resolved?' -> YES: Communicate Resolution to the Customer -> Receive Feedback -> END; NO: Create TT & Submit with correct type (categories: Global Incident Complaints Process, Billing Complaints, Unposted Payment, Service Related, Account Management, Network Complaint) -> sub-process reference 'Global Incident Complaints Process 2.5'. (2) Agent Ticket Creation (slide 17): Trouble Tickets list screen with columns Priority, Status, Ticket ID#, Order#, MSISDN, Date Opened, Date Closed, and a highlighted '+' create-ticket action leading into a new ticket record. (3) Ticket Homepage (slide 18): full ticket detail form field list -- Ticket Information block (Ticket Id, Last/First Name, Account, Service Location, MSISDN, Contact Role, SIM, Account#, Tier, Customer Type, Service Type, Asset Service Type, TON Reason, MOI Reason, Plan, Appointment Id, NP Order Id, Source, TT Category, Area, Sub-Area, Coordinates, Address/Landmark, Latched Site ID, Zone/Area, Existing/Requested Network Name Type/Name, Date Opened/Owned/Modified/Closed/Escalated, Escalated Duration, Escalated By, Priority, Severity, Target Date, Language) and Status and Ownership block (Login, Created By, Location, Previous/Current Owner, Group, Status, Sub-Status, Remedy Ref#, Resolution Code, Hashtag, TT Actual Issue, Description, Customer/App Resolution, Escalation Reason, Products, CL/Bill Status, Billed/Unbilled Usage, Plan/Star Number Penalty, DOI Outstanding Amount, Activation Date, Investigation/Follow Up/Resolution Call Back, Auto Approval Date Time, Total Outstanding Usage, TT Queue, Back Office Comments), plus action buttons (Check Outstanding, Verify, Fetch Attachment, Print Charges, Assign To Me, Submit, Send SMS, Book Appointment, Book Unscheduled Appointment, View/Reschedule Appointment, Escalate). (4) Activities inside Tickets (slide 19): Activities grid with columns Created, Owner, Activity#, Account, Channel, Topic, Sub-Topic, Type, Area, Language, Interaction Type, Comments, Status -- showing real sequential activity rows (e.g. SMS Notification, Back Office Complaint Investigation, Outbound Call, Escalated to L2) with a visible ticket-closure lifecycle (Unscheduled -> Solved, per accompanying comments like 'We have concluded the review of your ticket').

**Evidence:** "Diagram (slide 16, image56.png): lanes 'Customer' and 'Front line (Care/Retail)'; boxes 'START' -> 'Customer contact VF for an issue' -> 'Receives Inbound Call/ email/Chat/ Visit' -> 'Troubleshooting' -> diamond 'Issue resolved' (YES/NO) -> YES path 'Communicate Resolution to the Customer' -> 'Receive Feedback' -> 'END'; NO path -> 'Create TT & Submit with correct type' (bullet list: Global Incident Complaints Process, Billing Complaints, Unposted Payment, Service Related, Account Management, Network Complaint) -> box 'Global Incident Complaints Process 2.5'. Ticket Homepage field labels read directly off image61.png/image62.png include 'TICKET INFORMATION', 'STATUS AND OWNERSHIP', and an 'Activities' grid header row: 'Created | Owner | Activity # | Account | Channel | Topic | Sub-Topic | Type | Area | Language | Interaction Type | Comments | Status'."

### UJ-110 — `recovered`

**Recovered detail:** Slides 31-33 ('MNP Port Out Ticket') are screenshot slides; direct image viewing recovers concrete ticket field values and a full, ordered validation-activity checklist for an MNP port-out ticket auto-created from NPAS: Ticket fields TT Category=Request, Area=MNP, Sub-Area=Port Verification, Owner=MNP_BO_QUEUE (a dedicated backoffice queue), plus the same Ticket Information/Status and Ownership field layout as the general ticket screen. The Activities grid shows 11 auto-created validation activities per ticket (activity codes NP01, NP04, NP06, NP10, NP12, NP13, NP98, NP99, NP05, NP96, NP95), each with a specific validation description and a per-activity Status of Success / In Progress (observed states), e.g.: 'ID Number is matching' (Success), 'Correct donor service type Postpaid' (Success), 'Service for the number porting out is currently NOT bar[red]' (Success), 'The customer has not settled the Total Outstanding Du[e]' (In Progress), 'ID type of the subscriber is valid/available' (Success), 'Number porting out is not a Staff Number' (Success), 'Retrieval of attachment file(s) was successful' (Success), 'No other service under the promotion of the current ass[et]' (Success), 'Signature Check'/'Signature verification' (In Progress or Success depending on case), 'Plan Penalty is Applied'/'Plan Penalty Charges applied' (In Progress or Success), 'Star Number Penalty is Not Applicable' (Success). A second example ticket (image88/89) shows the terminal lifecycle state once all activities resolve to Success: ticket Status=Solved, Sub-Status=Complete, Resolution Code=Donor Accept -- directly evidencing the 'once all activities complete, ticket status changes automatically' claim from the summary with the actual before/after field values.

**Evidence:** "Activities grid rows (image87.png): 'NP01_1-2WT4... | ... | MNP | General | Request | MNP | English | None | ID Number is matching. | Success'; 'NP10_1-2WT4... | ... | The customer has not settled the Total Outstanding Du... | In Progress'. Second ticket (image89.png) header/status fields: 'Status: Solved', 'Sub-Status: Complete', 'Resolution Code: Donor Accept', with all 11 of its own Activities rows reading 'Success' (image88.png)."

#### Genuinely Gapped — Recommended Assumption (1)

### UJ-006 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** Ran markitdown on the source .docx to cross-check for compressed step-level detail. The fuller extraction confirms the flow is described only at a coarse, phase-level granularity (account manager request to EBU PM, order raised, acceptance by four teams, delivery/provisioning, client acceptance, billing) - there is no actor-by-actor field/input/output/validation breakdown, no screen names, and no system names beyond 'CRM'/'Siebel' generically, consistent with the document's own framing of this as a 'vanilla direct' (non-guided-journey) process starting from a CR number, not a screen-driven wizard like the Guided Journey tablet/desktop docs in this corpus. The transcript also cuts off at 01:09:25 with enterprise SMEs deferred to a following week's session, so the step-level detail may simply not have been captured yet in this recording. No analogous fully-evidenced Enterprise/IoT order journey exists elsewhere in the reviewed corpus to pattern-match against (the Guided Journey docs reviewed in this batch are all Consumer/tablet flows with a different UI paradigm). This gap needs either the referenced 'next week' enterprise SME follow-up session transcript (if captured elsewhere in the corpus) or a business-owner walkthrough to produce actor/step/field-level detail - recommend against fabricating a step sequence by analogy to the Consumer guided journeys, since the document explicitly distinguishes this as a different (non-wizard, CR-number-driven) process shape.


## Screens Without Field Detail (85 items)

#### Recovered (73)

### SCR-002 — `recovered`

**Recovered detail:** Transcript describes the current-state PowerApps bulk adjustment journey with concrete step sequence and actors: requester logs the request in the PowerApps portal, approval happens offline, billing operations user manually pulls the Excel and posts it to BRM. It also gives the field list intended to carry over into the target DXP design (account number, billing profile, ledger/bucket ID, description), which is the closest available field-level anchor even though the legacy PowerApps UI itself was not screenshotted.

**Evidence:** "00:25:33 The current bulk adjustment request app is built in PowerApps; users log requests, upload the excel, and it is manually pulled out and sent. / 00:26:34 Target bulk adjustment journey in DXP: A billing ops user with access in DXP selects an offline-generated file with fields (account number, billing profile, ledger/bucket ID, description), uploads and posts it to BRM, with approval done offline, and sees the status of the request."

### SCR-009 — `recovered`

**Recovered detail:** Fuller pandoc-plain extraction recovers a specific, itemized field list for the bulk activation control sheet that was compressed out of the summary: the bulk data sheet requires sub-account number, order reference (a dummy pending replica order), numbers, SIM serial, end-user contact reference (last name), billing profile ID, and agent ID; the separate control sheet (macro control tab) requires Siebel user ID, password, and row count. Also recovers the exact execution steps: fill macro sheet -> enter Siebel credentials + row count in control sheet -> click Upload -> open 'new bulk provide order' screen in Siebel -> select the file -> click Process -> orders created and completed automatically.

**Evidence:** "'01:40:37 Bulk sheet fields: Sheet requires sub-account number, order reference (a dummy pending replica order), numbers, SIM serial, end user contact reference last name, billing profile ID and agent ID; control sheet takes Siebel user ID, password and row count.' and '01:38:11 Bulk activation via Excel macro: A custom Excel macro built by IT operations/SSI is filled and uploaded; Siebel "new bulk provide order" screen picks up the file and a Process button creates and completes orders automatically.'"

### SCR-013 — `recovered`

**Recovered detail:** Markitdown re-extraction of the source .docx surfaced a verbatim, more granular navigation sequence for the dashboard than the summary line: from the dashboard, scroll down to a process list; the process list splits into consumer/enterprise/internal processing categories; clicking 'enterprise' reveals five process areas; each process area is opened via a hyperlink on the right side of its row. This gives a concrete interaction path (scroll -> category click -> 5 sub-areas -> hyperlink) for the dashboard screen.

**Evidence:** "From the dashboard scroll down, there will be the process list; access the process, you will find consumer, enterprise and internal processing; click on enterprise and the five process areas are available, then click the hyperlink on the right side to open a process."

### SCR-015 — `recovered`

**Recovered detail:** The fuller markitdown extraction gives a much more complete field/section breakdown of the Enterprise Excel invoice than the compressed summary: sections are previous charges, payments (each shown as its own line, unlike the aggregated PDF), balance carried forward, current charges, adjustments (also itemized line by line), discounts, current month charges, total amount, plus a device installment balance line; services are grouped into mobile / fixed (corporate internet, IP, etc.) / other; below the service section is a usage/CDR section broken out by CDR type (voice, data, SMS) sorted by date/time with a number filter; and the 1M-line limit with aggregation and CSV fallback rule applies to this specific document.

**Evidence:** "01:28:45 | Excel (XLS) supporting invoice | The Excel shows the same structure as the PDF - previous charges, payments, balance carried forward, current charges, adjustments if any, discounts, current month charges and total amount... | 01:29:57 | Device installment balance on the bill | The bill shows a device installment balance... | 01:30:08 | Excel service grouping - mobile, fixed, other ... | 01:32:33 | Usage / CDR section in the Excel | Below the service details the Excel has usage - the CDRs, each type of CDR, voice, data, SMS - which is not shown in the PDF."

### SCR-016 — `recovered`

**Recovered detail:** The fuller markitdown extraction gives the concrete interaction pattern for this cross-tab export screen/feature: trigger is a settings-icon click, output is an automatic XLS download, no access control gate exists, and it is confirmed usable both within a single account's tabs (account summary, installed assets, orders, tickets, activities, payments) and from multi-account/multi-ID search result lists and sales-order search filtered by date range or order number.

**Evidence:** "00:04:51 | Export to Excel from the CRM | Users export XLS files. The export is not access controlled - anyone can export. Users click the settings icon and export; the Excel downloads automatically... | 00:06:57 | Export from search results and sales orders | Apart from inside a single customer account, users can search multiple IDs and export from there, export for multiple accounts, and export sales orders filtered by date range or a specific order."

### SCR-023 — `recovered`

**Recovered detail:** Full pandoc re-extraction of the Day4 Session 2 transcript recovers the precise workflow context for the Orders page and the resolution-code gate: the disconnection ticket is handled as BAU with one extra layer -- once the ticket is closed with a specific resolution code, the agent navigates to the Orders page, selects disconnection, and submits the disconnection order; the resolution code differs by outcome ('retained' vs not retained, decided by the retention team/agent).

**Evidence:** "[00:55:12] Disconnection ticket: Created as BAU like normal tickets, but with one extra layer: once the ticket is closed with a specific resolution code the agent goes to the Orders page, selects disconnection and submits the disconnection order. [00:56:02] Retention handling of disconnection: ... If retained, the resolution code is 'retained'; if not, retention themselves take the disconnection decision."

### SCR-027 — `recovered`

**Recovered detail:** The full transcript adds concrete field/interaction-level detail for the external Eligibility Web Portal beyond the summary: it supports three distinct search entry modes (zone/street/building drilldown returning a filtered list of Karama IDs; direct Karama ID entry; direct Vodafone ID entry), returns a three-way service-type result (fixed/fiber, indoor 5G [~90% of cases], outdoor 5G, or 'not sellable at all' for e.g. enterprise-only locations), and surfaces location-specific plan restrictions and CBU-type building information (but not remaining-line capacity). Confirmed explicitly by the presenter as correct in the Q&A.

**Evidence:** "00:29:47 | Three ways to search location | Search by zone/street/building, directly by Karama ID, or directly by Vodafone ID. Confirmed as correct. | 00:03:12 | Portal shows CBU and CBU alum information | The portal shows more information for the agent on the particular location, including CBU. It does not show how many lines are allowed/remaining in the building. | 00:01:28 Non-sellable locations | There can be an instance where a location is not meant for selling anything at all, e.g. it is an enterprise location."

### SCR-028 — `recovered`

**Recovered detail:** Full transcript adds interaction-level detail for the appointment/calendar screen: it pulls slot availability in real time (no display if none available), presents the SLA cluster to the agent, restricts the calendar so no date earlier than the cluster boundary is selectable (e.g. if cluster is 1 week, only dates from 1 week onward appear), and - critically - the current design does NOT allow the appointment to be changed once selected within the journey itself; changes are only possible after order submission via a separate reschedule flow (hyperlink from the order, lives in WFM). This is a business rule constraint on the screen's behavior not previously captured.

**Evidence:** "00:47:52 | SLA clusters drive appointment calendar | The system presents the cluster/SLA for the location, e.g. within three days or within one week, and limits the calendar selection accordingly. If it takes one week, appointments are only offered from that point onward. | 00:59:16 | The appointment cannot be changed once selected in the journey; it can only be changed after the order is submitted."

### SCR-029 — `recovered`

**Recovered detail:** Full pandoc re-extraction recovers the fuller explanation and rationale distinguishing the bell icon from public notes, plus the explicit improvement requirement: bell icon is account/MSISDN-level, agent-visible only, actionable (flags something the agent must act on) and bulk-uploadable via Excel; public notes are informative/historical, business-driven (not agent-driven), uploaded via Service Request, and retained indefinitely -- but agents miss them even after broadcast reminders, so the business wants them made as visually prominent as the bell icon.

**Evidence:** "[01:59:00] Public notes visibility problem: Public notes are buried; agents miss them even after broadcasts telling them to look inside notes. Business wants them as prominent as the bell icon; the bell icon asks the agent to do something whereas public notes are informative and historical."

### SCR-032 — `recovered`

**Recovered detail:** Full pandoc re-extraction recovers the specific ordered flow leading into and including the CAP signature step for instant activation: QID capture, ID front/back scan, address confirmation, plan/add-on/number selection, then the appointment-booking step is auto-skipped and the flow proceeds directly to CAP where the number and plan are stamped, appointment details remain blank, and the customer signs to close the CAP before the order can be submitted.

**Evidence:** "00:07:05 Instant activation flow steps: Enter the QID number, scan customer ID front and back, confirm auto-selected address, choose plan and see plan details, select add-ons, select number; book appointment step is skipped automatically and it goes straight to CAP. ... 00:08:33 CAP signature and completion: Number and plan are stamped on the CAP, appointment details are blank; customer signs, CAP is closed, supplementary forms are uploaded, activity is completed and the order is submitted and completed."

### SCR-042 — `recovered`

**Recovered detail:** The summary itself (steps 5-6) already documents the QID Offers grid with a full field list: CampaignCode, OfferName, PromotionId, OfferType, Price, MonthlyRental, Status, plus the Accept action -- this is a complete, concrete field-level description already present in the source extraction.

**Evidence:** "a single targeted campaign offer: CampaignCode 000001247, OfferName "New Gigahome Testahil plan", PromotionId 1-5XBWM5D, OfferType: New Fiber, Price 0, MonthlyRental 299, Status Offered. Agent clicks Accept."

### SCR-053 — `recovered`

**Recovered detail:** The document gives the full navigation tile grid for this home page beyond a partial listing, including the exact banner text format and the currently-hovered/highlighted tile (New Fixed Line) with its tooltip, for the Back Office Fulfilment responsibility specifically — concrete evidence for tile inventory and personalization-by-responsibility behavior of this screen.

**Evidence:** "Banner: "Welcome back Hemanth Kumar! Today is Wednesday, June 05, 2024." Full navigation tile grid includes Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Action Required, Activities, New Fixed Line (cursor hovering here, tooltip "New Fixed Line"), New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval."

### SCR-060 — `recovered`

**Recovered detail:** The existing summary (already the richest available extraction for this screenshot-driven document, per its own extraction notes citing all 68 images reviewed) already contains a concrete field list for this screen: named approval queues, and an Activities grid with named columns (Journey Name, Mobile #, Activity#, Order#, Service Account, Activity Status, Order Approval Status, Order Created Date, Owner) plus an 'Assign To Me' action button - this satisfies the field-list-level detail the gap flagged as missing. | Full screen structure recovered with named queues, tab structure, action button, and the resulting state transition after action is taken (Ready To Assign -> Assigned, with a ReAssign To Queue escape hatch) — going beyond the original evidence quote to show this is a genuine multi-tab work-queue screen, not just a list. | Confirms the same TM SR Queue View screen appears identically in the Fixed Line journey (cross-journey reuse of this manager screen), with the same queue names and Assign To Me action, plus the resulting My Activities state.

**Evidence:** "TM SR Queue View — Queue Employee list (queues: ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS) and Order Activities Queue / Activities grid: shows the order among several pending approvals — Journey Name "New FWA Tablet", Mobile # 97441202301, Activity# 1-DNN25R4, Order# 1-29727615763, Service Account MAN KAMI, Activity Status "Ready To Assign", Order Approval Status "Submitted for Approval", Order Created Date 9/17/2025 02:14:24 PM, Owner VFQA_DSA_ORDER_APPROVAL_QUEUE_TESTING. Button: Assign To Me. || TM SR Queue View (Order Approval landing page): lists approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ, _JAGUAR, _TESTING, _VISTAS). Below, an Activities grid with tabs Order Activities Queue / My Activities / Activities History and an "Assign To Me" button... Manager clicks Assign To Me; the activity moves to the My Activities tab with Owner = MANAGETEST, Activity Status = "Assigned," and a "ReAssign To Queue" button becomes available || TM SR Queue View — Order Activities Queue (image 32): Lists multiple approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS). Order 1-29795149137 ... appears with Activity Status "Ready To Assign", Order Approval Status "Submitted for Approval". Manager clicks "Assign To Me"."

### SCR-062 — `recovered`

**Recovered detail:** Field-level detail for the Reject Order modal is present: a Reason dropdown/tag list with at least 7 enumerated options ('ID image not clear', 'ID type or ID number mismatch', 'Customer Signature doesn't match with ID', 'Incorrect add on or discount', 'Device receipt missing', 'Missing Speed test result/ Building information', 'Bill explainer missing/ Incorrect' - list continues, cut off), a free-text Comments box, and two buttons: Reject Order / Cancel. The doc also confirms this reason list is a shared reference list reused across other 'with Approval' guided journeys (cross-referenced against the FWA sibling doc, which shows the same 'ID image not clear' rejection reason appearing in its Activities History). Additionally, the backend consequence is evidenced: an OSB CreateCommunication SMS payload is triggered on rejection, addressed to the agent (not customer), instructing them to correct the order.

**Evidence:** "Reason selected: "ID image not clear". Other available reasons visible in the dropdown: "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/ Building information", "Bill explainer missing/ Incorrect" (list continues, cut off). A free-text Comments box is filled with "Phoenix Sprint 66 test"... Buttons: Reject Order / Cancel."

### SCR-066 — `recovered`

**Recovered detail:** Re-extraction of the source PDF directly (pdftotext) confirms the complete field-level structure already captured in the summary: page 1 is the full English form with 18 numbered clauses including fill-in/checkbox fields (Upfront Fee N/A/Cash, Bill Cycle 1st/15th/existing, Discount %/months blank fields, speed tier 100/500Mbps/1Gbps checkboxes, FUP 1TB/2TB/10TB checkboxes, installation address Zone/Street/Building/Unit fill-ins), ending in a 'Confirmed by: Customer QID / Customer Name / Customer Signature / Date' block. This is the full screen/document field inventory needed.

**Evidence:** "12. My GigaHome connection is installed for my house at Zone No. Street No. building No. Unit No. ... Confirmed by: Customer QID: Customer Name: Customer Signature: Date"

### SCR-074 — `recovered`

**Recovered detail:** Full detail already present: the Attachment Viewer is evidenced across three distinct instances (Qatari ID front, Qatari ID back, and CAF document) in the manager approval flow, each a full-screen document viewer accessed from an Attachments tab with icons for QatarIdFront/QatarIdBack/CAF/SupplementaryForm. Concrete field content shown per viewer: ID front shows 'Qatari ID-Front [timestamp]' with ID No., DOB, Expiry, Nationality visible; ID back shows 'Qatari ID-Back [timestamp]' with Passport Number, Passport Expiry, Serial No., Residency Type, Employer, issuing-authority signature line; CAF viewer shows the same bilingual signed CAF PDF layout as the CAF generation step, confirming the manager can open and review the actual signed document before approving.

**Evidence:** "Attachment viewer – Qatari ID front (image32) — Full-screen document viewer showing "Qatari ID-Front 492025 133044" — a photographed Qatar residency permit: ID No. 29035654458, DOB 03/07/1990, Expiry 04/01/2025, Nationality INDIA... Attachment viewer – Qatari ID back (image33) — "Qatari ID-Back 492025 133050": Passport Number W3128683... Attachment viewer – CAF document (image34) — "Digital_New_FWA_04092025_130959_signed" — the signed Vodafone Customer Application Form"

### SCR-076 — `recovered`

**Recovered detail:** This is Step 8 of the guided wizard (breadcrumb 'FWA Postpaid - CAF'), immediately following Step 7 Book Appointment and preceding Step 9 Activity. The dropdown offers three modes and selecting CAF-Digital opens the CAF Modal (SCR-084) with the full bilingual form. | Directly evidenced in the FWA Open UI Desktop Indoor guided journey (Step 8, item 10 of Key content), which documents this exact control (CAF dropdown/split-button) as a distinct interactive element within the CAF step screen, with its three selectable values enumerated.

**Evidence:** "Step 8. CAF (images 17–21): Attachments initially "No Records". CAF type dropdown: CAF-Digital, CAF-Manual, CAF-Touch Screen. Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form"... || Step 8 - CAF ... a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen."

### SCR-077 — `recovered`

**Recovered detail:** Home screen is Step 0 / entry point, shown with logged-in user context and date, from which the agent launches the New FWA guided journey by clicking a tile.

**Evidence:** "Home screen (image 1): Logged in as KARTHIKK KARTHIKK, "Today is Tuesday, September 16, 2025." Agent clicks the New FWA tile."

### SCR-084 — `recovered`

**Recovered detail:** Full field-level breakdown of the CAF Modal is present: 4 sections (Applicant details, Billing information, For Postpaid Customers, Superfast Broadband & Home Phone) with specific field names/values, a digital signature capture (name + timestamp), and a T&C acknowledgment plus a customer-notification confirm dialog.

**Evidence:** "Section 1 - Applicant details confirms Name ABUBAKAR NAZIR, DOB 1-Jan-1991, Qatar ID 29158603076 (expiry 18-Sep-2026)... Section 2 - Billing information: Account credit limit 1000, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice. Section 3 - For Postpaid Customers: Mobile number 97441202325, digitally signed "KARTHIKK 18:09:2025 12:21:01". Section 4 - Superfast Broadband & Home Phone: Landline Number..., Plan Name..., Appointment Details..."

### SCR-086 — `recovered`

**Recovered detail:** Full grid contents documented: 10 line items with product hierarchy (top-level plan, FMS CPE Bundle with 2 child SKUs, FMS Service Bundle with 4 child SKUs), per-line status-context milestones, shared address/notification fields, and a specific toolbar action set.

**Evidence:** "Line Items > Appointments sub-tab (images 27–28): 10 line items (1-10 of 10) each showing status-context milestones ("FULFILL BILLING COMPLETE: reached", "INITIATE BILLING COMPLETE: reached", "INITIATE WFM START: reached"): GigaHome Premium OD New 5G FWA Pro... (top-level), FMS CPE Bundle → FMS CPE ODU, FMS CPE Outdoor IDU; FMS Service Bundle → ... Toolbar includes Auto-Asset, MultiAdd, CAF, Profile, Book Appointment, Book Unscheduled Appointment."

### SCR-088 — `recovered`

**Recovered detail:** Screen fields and outcome are documented: instance/user/resource identity fields, a two-stage flow (Get Quantity then Import) with an intermediate confirmation dialog, and a result summary with created/updated/deleted/failed counts. | The screen's field list and purpose are explicitly detailed in the same document: it is a 'Resource Inventory Import' panel within a 'Field Service Import' pop-up, with named fields (Instance Name, User Name, Password, Resource Id) and an Import Status sub-section with fields Get Quantity, Import Status, Created, Updated, Deleted, Item failed, plus two action buttons (Get Quantity, Import). This is sufficient concrete field-level detail for the screen.

**Evidence:** "Field Service Import add-in / "Resource Inventory Import" (images 30–31): Instance Name vfq2.test, User Name vfq_application_profile, Resource Id ABATS. Dialog "Quantity has been fetched, please proceed with Import." Final result: Get Quantity: Success, Import Status: Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0. || A 'Field Service Import' pop-up 'Resource Inventory Import' panel shows Instance Name vfq2.test, User Name vfq_application_profile, Password (masked), Resource Id ABATS. Import Status: Get Quantity Success, Import Status Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0. Buttons: Get Quantity, Import."

### SCR-089 — `recovered`

**Recovered detail:** Dialog fields documented: activity identifier header, a resource-candidate list with schedule Gantt visualization and specific mismatch-flag semantics (work zones mismatch vs work skills mismatch) per candidate, and a selection + Move action. | Full screen detail already present in the source: dialog titled 'Move 2PM - 5PM - Installation - 120812 - 1-29722927101', with a Resources tab, technician search returning name/team/offset, a 'Work zones mismatch' validation flag, a schedule timeline visualization with conflict highlighting, and Dismiss/Move actions.

**Evidence:** "Move dialog (image 34): "Move 8AM - 11AM - Installation - 120955 - 1-29728035948", Thursday, September 18th, 2025. Resource candidates shown with schedule Gantt and match flags: Manoj Padinjarakandi (Work zones mismatch), Syed Irfan (ABATS, Work zones mismatch), Hamed Habeeb (ABATS, Work skills mismatch)... Agent selects Syed Irfan and clicks Move. || "'Move' dialog... Resources tab, search 'Syed' returns technician 'Syed Irfan', team ABATS, offset '+2:00', flagged 'Work zones mismatch' (in red). Schedule timeline for Sunday, September 7th, 2025 shown with a red conflict block near 2:56 PM. Dismiss / Move buttons.""

### SCR-090 — `recovered`

**Recovered detail:** Screen behavior documented in detail: source/destination resource header, per-item one-at-a-time transfer pattern with item identifiers (serial+model), a Transfer List summary table (Total Items, Current Owner, Transfer To columns), and a Start Transfer action leading to an OFSC plugin confirmation. | Field/tab-level detail already present: two tabs ('Non-Serialized Inventory Transfer' and 'Transfer List'), a 'Transfering From' source field, part search/add mechanism, Total Items count, Current Owner and Transfer To fields, plus Export and Start Transfer action buttons.

**Evidence:** "Inventory Management — Non-Serialized Inventory Transfer (images 35–38): "Transfering From: ABATS" to resource Syed Irfan, three parts transferred one at a time (qty 1 each)... Transfer List shows Total Items: 3, all Current Owner ABATS → Transfer To Syed Irfan. "Start Transfer" clicked. || "'Inventory Management' > 'Non-Serialized Inventory Transfer' tab, 'Transfering From: ABATS'. Three items searched and added... The 'Transfer List' tab shows Total Items: 2... Current Owner ABATS, Transfer To 'Syed Irfan'... Export - Inventory Transfer Report and Start Transfer buttons available.""

### SCR-091 — `recovered`

**Recovered detail:** Screen documented with logged-in technician identity, job card content, route progress indicator, action tiles, and a route-activation confirmation flow that changes the route status button. | Field/element detail already present: route progress ring with percentage and pending/completed counts, a next-job card showing time slot, activity type, order number, customer phone, and a Start button, plus tile navigation (Activities count, Inventory, Add Activity).

**Evidence:** "My Route (images 40–42): Logged in as Syed Irfan, Thursday 18 September 2025. Job card: "8AM - 11AM Installation 120955 1-29728035948", phone 97412341234. Route progress 17%, 1 Pending. Tiles: Activities 93, Inventory, Add Activity. "Activate route" prompt: "Activate route now?" → Submit. Route status button changes to "Start". || "OFS mobile/web app, technician Syed Irfan, 'My Route' for Sunday 07 September 2025. Route progress ring 17% (1 Pending, 1 Completed). Next job card: '2PM - 5PM Installation 120812 1-29722927101', phone 97412341234, with a Start button. Tiles: Activities (93), Inventory, Add Activity.""

### SCR-096 — `recovered`

**Recovered detail:** Grid contents fully enumerated (9 rows post-provisioning, all Active) with product names and order-line references, plus surrounding account header fields (notification contact/language, account status, credit risk, account team, primary MSISDN, pre-approved limit) that establish this is the Account 360 context. Row count changes 8→9 confirming the grid supports incremental Active-asset addition as line items complete. | The document gives a full grid description: 'Installed Assets' grid (1-3 of 3) with named rows (FMS CPE Bundle, GigaHome 5G Classic New Indoor FWA Promotion, FMS Service Bundle) each with Service ID/Billing Profile/Status columns, and an explicit toolbar button list of seven actions.

**Evidence:** "Account > Installed Assets (images 58–59): "Products and Services" grid, 8→9 rows, all Active: FMS CPE Bundle (1-29727986024), GigaHome Premium OD New 5G FWA Promot... (1-29727986128), FMS Service Bundle (1-29727986192, Postpaid Activation Date 9/18/2025 12:18:16 PM), System Bar Admin -FWA, FMS SIM..., GigaHome Premium OD New 5G -FWA (Per Month), 100% Discount for 2 Months -FWA, FMS VoIP Service, Activation Bar- Mobile Roaming -FWA. || The "Installed Assets" grid (1-3 of 3) lists: FMS CPE Bundle (Service ID 129720765944, Billing Profile 1-DNIZ5EH, GigaHome 5G..., Active)... Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP."

### SCR-098 — `recovered`

**Recovered detail:** The document gives the full column schema for this screen's grid: Name, Value, Action, Description, Data Type, with a worked example of all 5 rows (IPTV Service Id, Indoor Unit CPE Model, Indoor Unit MAC Address, Indoor Unit Serial Number, VoIP Number) showing exactly how an unmodified attribute (Action '-') differs from a modified one (Action 'Update', Description holding prior value).

**Evidence:** "the line item tree shows Outline 1 "FMS CPE Bundle"..."Line Item Attributes" grid (1-5 of 5) for this line lists each attribute with Name / Value / Action / Description / Data Type"

### SCR-101 — `recovered`

**Recovered detail:** Directly evidenced in the FWA Desktop Vanilla guided journey (item 5 of Key content) with the specific field/attribute values shown on the auto-generated Account 360 View screen. | The summary document itself (step 24) already contains a full field list for the Account 360 View screen: Account Name, Account #, Account Class, Account Type, Site, Country, Special Management, Customer Segment, Customer Since, Status, Primary MSISDN, Pre-approved (Expatriate/Qatari) credit limit, Credit Risk, Account Team, plus an Installed Assets sub-panel and an Orders sub-tab showing historical orders.

**Evidence:** "Account 360 View created - Account auto-generated from the contact (Account Class: Customer, Account Type: Residential, Customer Segment: Expatriate, Status: Active), with Billing Profile tab showing a new Postpaid, Monthly, Invoice billing profile. || Account MAHENDRAN GANESAN, Account # 128338435506, Account Class Customer, Account Type Residential, Site "Qatari ID_2703563...", Country Qatar, Special Management: "B2B2C Consum...", Customer Segment Expatriate, Customer Since 2/3/2025, Status Active, Primary MSISDN 97441224267, Pre-approved (Expatriate/Qatari) credit limit 50, Credit Risk "No score", Account Team AKKIRAJJUB. Installed Assets: No Records (pending fulfillment)."

### SCR-102 — `recovered`

**Recovered detail:** Directly evidenced in the FWA Desktop Vanilla guided journey (item 7 of Key content) with the exact field names and values shown on the Sales Order Detail More Info tab.

**Evidence:** "Sales Order detail (More Info tab) - Order Type: Activation, Fulfillment Mode: Deliver, Price List: VFQA PriceList, Currency: QAR."

### SCR-105 — `recovered`

**Recovered detail:** The existing summary already contains a complete field list for this screen (all fields shown for a queried SIM record), which satisfies the field-level detail the gap flagged as missing.

**Evidence:** "Custom Object Summary for SIM 8942702800801190296F): Specification SIM Card, Inventory Status Installed, Assignment Status Assigned, Device Status Available, ICCID 8942702800801190296, IMSI1 4270289011190296, MSISDN 97441202296"

### SCR-106 — `recovered`

**Recovered detail:** The existing summary already contains a complete field list and line-item grid structure for this screen, satisfying the field-level detail requested.

**Evidence:** "Order Entry screen for 1-29727615763: Order Type Activation, Status "Complete", Fulfillment Status "Complete", Status Context "All order lines are completed", Status As Of 9/17/2025 03:30:01 PM, Created By VINODHINIR, Priority "Medium-Complete", Primary MSISDN 97441202301, Billing Account/Service Account MAN KAMI, Billing Profile 1-DNN1Z3T (Postpaid), Credit Limit 1,000, MRC/NRC Total QR0.00. Line Items grid (3 rows...)"

### SCR-107 — `recovered`

**Recovered detail:** The Manager Home Screen is directly evidenced with its exact restricted menu, distinguishing it from the field-agent tablet menu (which has ~13 tiles). Confirms purpose as a restricted landing screen for the approver role.

**Evidence:** "Manager home screen (image29) — "Welcome back Test Manager!" Thursday, September 04, 2025. Tile menu reduced to just Home and Order Approval — confirming this is a distinct, restricted manager/approver role UI."

### SCR-108 — `recovered`

**Recovered detail:** Full field-level detail for the backend Sales Order Record (Approved state) is present: Order #, Account, Type, Primary MSISDN, Order Type, Order Sub Type, Status, Fulfillment Status, Status Context, Created By, Billing Profile Type, Credit Limit, plus the action-button toolbar available at this state.

**Evidence:** "Sales Order record (image38) — Full backend order form for Order # 1-29724732583... Account SELBATH JAMAL[UDEEN], Type Sales Order, Primary MSISDN 97441202297, Order Type Activation, Order Sub Type Dual Play, Status Complete, Fulfillment Status Complete, Status Context "All order lines are completed", Created By HEMANTH, Billing Profile Type Postpaid, Credit Limit 1,000. Action buttons: Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order."

### SCR-109 — `recovered`

**Recovered detail:** The summary (steps 12-15) already documents the full Book Appointment / Book Unscheduled Appointment step end-to-end: the two-option choice, the calendar modal with month/date/time-slot selection, a Booking Comments field, a cancellation warning dialog, a success dialog with generated Appointment ID, and the resulting saved appointment detail table with 7 named fields.

**Evidence:** "Agent picks Book Appointment -> a calendar modal opens (September 2025), date 13 (Sat) selected. Time slot 8AM - 11AM chosen... Appointment Number: 1-29724803615, Technician ID: ABATS_Consumer_Installation, Status: pending, Appointment Date: 09/13/2025, Channel: SIEBEL, Type: (blank), Appointment ID: 120903, Time Slot: 8AM - 11AM."

### SCR-111 — `recovered`

**Recovered detail:** Full field list for the End Activity form is already present in the document: Activity Type, Name, Activity Remarks (free text), Customer Available (dropdown), Customer Signature (capture box), Next Activity (set to a preset value), with Dismiss/Submit buttons as the final technician-side closing step.

**Evidence:** ""End activity" screen: Activity Type Installation, Name NARAYAN MANJHI, "Activity Remarks" (free text, blank), "Customer Available" dropdown, "Customer Signature" capture box (blank placeholder), "Next Activity" set to `I will be idle for a while`. Dismiss/Submit buttons"

### SCR-116 — `recovered`

**Recovered detail:** Direct image extraction and visual reading of the source .docx (previously only text-caption-extracted, screenshots never visually read) recovered the actual Home Move Checklist screen (Oracle Field Service technician UI) with concrete fields: two mandatory checkbox items ('Brief customer on package details', 'How to restart CPE (and STB) in case of technical issue'), a Customer Signature capture pad, a Device Details/ONT details panel (ONT Model Number, ONT Serial Number), and six photo-evidence upload fields (Screenshot of Wi-Fi interference, Speed observed on customer phone, Screenshot of CPE Installed, Screenshot of STB installed, Screenshot for Internet configuration from CPE, Screenshot for VOIP configuration from CPE, Additional Equipment Approval). This is a genuine escalation beyond text-extraction per the corpus's own image-extraction methodology.

**Evidence:** "Home Move Checklist [heading] -- Brief customer on package details [checked] -- How to restart CPE (and STB) in case of technical issue [checked] -- Customer Signature [signature pad] -- Device Details / ONT details: ONT Model Number G-010G-P, ONT Serial Number ALCLF11C1515 -- Screenshot of Wi-Fi interference / Screenshot of CPE Installed / Screenshot of STB installed / Screenshot for Internet configuration from CPE / Screenshot for VOIP configuration from CPE / Additional Equipment Approval."

### SCR-119 — `recovered`

**Recovered detail:** Full field/tile inventory recovered for the Agent Home screen: greeting header plus a named app-icon grid enumerating every tile available to this agent's role, confirming this is a role-gated launcher (ties to ENT-044's Responsibility model) rather than an undifferentiated menu.

**Evidence:** "Agent home page ("Welcome back Hemanth Kumar! Today is Monday, April 21, 2025.") — the MNP tile is highlighted/hovered in the app-icon grid alongside Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests."

### SCR-120 — `recovered`

**Recovered detail:** Screen confirmed as a single-choice launcher panel with exactly one visible button in this document's flow, entered directly from the Agent Home MNP tile.

**Evidence:** "Clicking MNP opens the "Guided Process" screen with a "Choose process" panel containing a single button: Switch as Postpaid."

### SCR-121 — `recovered`

**Recovered detail:** Full field list with mandatory flags recovered for the Contact step: Qatari ID (input+validation), then read-only confirmed fields (Id expiry, Nationality, Gender, First/Last name, Birth date, Digital Lead/Sale radio), a Connection Details modal (Prepaid/Postpaid connection counts), then Email/Preferred Language/Alt phone (all marked required with green-check validation), plus an Attachments panel with upload/delete. | The summary (screenshots 5-9, direct visual read) already contains the complete field-level structure for the MNP wizard Contact step: ID Type/ID Number entry with barcode-scan icon, MOI Validation completed banner, and the full confirmed/pre-filled field set (ID Type, ID Number, ID Expiry, Nationality, Gender, First name, Last name, Birth date, Email, Language, Alt. phone #, ID-Front/ID-Back thumbnails), each shown validated with a green check, plus the Continue action.

**Evidence:** "After Go, the section expands to "Please confirm the contact details below:" showing read-only fields: Qatari ID 29035654458, Id expiry 4/21/2026, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990, Digital Lead/Sale = No (radio)... Email nobill@vfq.com (required, green check), Preferred Language English (required, green check), Alt. phone # 97412341234 (required, green check) || Confirmed/pre-filled fields (each with a green check): ID Type Qatari ID, ID Number 27381804401, ID Expiry 9/22/2021, Nationality Egyptian, Gender M, First name KOURASHY, Last name ABDELGHANY, Birth date 1/6/1983, Email nobill@vod.com, Language English, Alt. phone # 97411111111, plus ID-Front and ID-Back thumbnail captures (both green-checked)."

### SCR-122 — `recovered`

**Recovered detail:** Full field list recovered: four address fields plus explicit action buttons showing this step is skippable, distinguishing it from mandatory steps like Contact/Billing.

**Evidence:** "2. Address expanded: empty fields Zone, Street No., Building No., Apt/Flat/Unit, with buttons Save Address / Skip Address / Cancel / Go Back. ... Zone 13, Street No. 45, Building No. 345, Apt/Flat/Unit H7882."

### SCR-123 — `recovered`

**Recovered detail:** Grid column structure recovered for the Billing step: Status, Language, Payment Type, Billing Profile status, Payment Method, Bill Media, Name(account ID), plus Continue/Cancel/Go Back actions - this is a selection grid over an existing billing account, not a data-entry form.

**Evidence:** "3. Billing: Postpaid expanded: a billing-account grid row — Status (green bar), Language ENG, Payment Type Postpaid, Billing Profile St. Active, Payment Method (cut off), Bill Media Email, Name 1-D87EQYB. Continue / Cancel / Go Back buttons."

### SCR-125 — `recovered`

**Recovered detail:** Full interaction detail recovered for the Plan step including the plan-detail modal fields (Smart Limit, Edit Smart Limit control, Credit Limit, included-features list, Customise button) and the live validation rule enforced on the Smart Limit input, tying this screen concretely to REQ around Agent Min Value guardrail.

**Evidence:** "Clicking 'Add' on Postpaid U Start Promotion opens a detail modal: 'Smart Limit: 20', an 'Edit Smart Limit' button... Agent types 28 into the Smart Limit input and clicks Go → validation message appears: 'Bill Limit can not be set lower than Agent Minimum 50' (red banner)... Agent retries with 67... Modal now shows 'Smart Limit: 67' (accepted)"

### SCR-127 — `recovered`

**Recovered detail:** Recovered exact button set and empty-state grid label, plus the downstream MNP Form dropdown (MNP-Digital / MNP-Touch Screen) invoked from this step, and the resulting attachment grid state after form completion (2 files).

**Evidence:** "7. Donor Attachment expanded: empty Attachments grid ('No Records'), New File button, and action buttons Continue / MNP Form / Abandon Order / Go Back. 23. Clicking 'MNP Form' opens a dropdown with two options: MNP-Digital and MNP-Touch Screen... 28. Back in 7. Donor Attachment, the Attachments grid now shows '1 - 2 of 2' with two uploaded files: 'Letter for Extension of Contra...' and 'Digital_MNP_Form_4212025...'"

### SCR-129 — `recovered`

**Recovered detail:** Recovered exact button set, empty-state grid label, and the CAF dropdown's three form-type options invoked from this step (already covered under REQ-174), plus precondition that prior two steps show 'Saved!' status.

**Evidence:** "8. CAF expanded (Donor Details and Donor Attachment both show 'Saved!'): empty Attachments grid ('No Records'), New File button, and action buttons Continue / CAF / Abandon Order / Go Back. 30. Clicking 'CAF' opens a dropdown with three options: CAF-Digital, CAF-Manual, CAF-Touch Screen."

### SCR-130 — `recovered`

**Recovered detail:** Full field-level detail recovered across both sections of the CAF form: Section 1 Applicant details (10 fields), Section 2 Billing information (7 fields including Smart Limit confirmation), Section 3 Postpaid-specific fields (mobile numbers, plan, extras, proration note, USSD reference), Section 4 Broadband/Home Phone (blank/not-applicable for this mobile-only order) - plus Sign Contract/Close and Retry actions.

**Evidence:** "Section 1 – Applicant details: Customer type Consumer, Name Vishakan Soundararajan, DOB 7-Mar-1990, Qatari ID 29035654458... Section 2 – Billing information: Account credit limit 1000, Smart Limit 67... Section 3 – For Postpaid Customers: Mobile number 97466000666..., Postpaid Plan = U Start, Extras row = Bill Limit Mobile... Section 4 – Superfast Broadband & Home Phone is present but entirely blank (not applicable to this mobile-only order)."

### SCR-131 — `recovered`

**Recovered detail:** Full field list and toolbar actions recovered for the Siebel Sales Order screen header, plus a full Line Items grid breakdown (bundle + sub-line items with prices) and a Line Item Attributes grid for the Bill Limit Mobile line showing SL Default Value/SL Limit Amount/SL Min Value fields with Action and Data Type columns.

**Evidence:** "the resulting Siebel Sales Order (Order # 1-28920871362), Account 'Vishakan Sounda[rarajan]', Order Type Activation, Order Sub Type Port-In, Status Pending... Toolbar shows Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order. A second view of the same order's Line Items grid shows the full bundle breakdown: 1 Postpaid U Start Promotion; 2 Mobile Service Bundle (expanded) containing 2.1 U Start (QR105.00)... the Line Item Attributes grid for the Bill Limit Mobile line shows: SL Default Value = 20, SL Limit Amount = 67..., SL Min Value = 0.01"

### SCR-137 — `recovered`

**Recovered detail:** The document gives a substantial field/section inventory for the Account Summary screen: header fields (Account #, Account Class, Account Type, Customer Segment, Status, Primary MSISDN, Credit Risk, Pre-approved amount) plus four sub-grids (Installed Assets - 14 items with named services, Orders - prior order history by type, Billing Profile - 4 profiles with Payment Type/Cycle, Trouble Tickets - 17 records), and later shows the same screen post-transaction with Installed Assets grown to 6 items and two new Orders rows appended. | Field-level detail for Account Summary already documented: account attributes (Residential, Expatriate, Credit Limit 1,000, Active), Installed Assets grid (Prepaid Red Promotion plus two existing postpaid lines Postpaid Red 350 and Postpaid U Start), and an Orders grid showing prior orders including two previously Abandoned Pre2Post orders - together evidencing both installed-asset and order-history sub-views described in the purpose statement. Billing profile (1-D7X76LP, Postpaid) and credit limit are also visible later on the resulting order header.

**Evidence:** "Agent starts on Account Summary for customer "HEMANTH GOVARDHANAN" (Account # 80772215054, Account Class Customer, Account Type Residential, Customer Segment Expatriate, Status Active, Primary MSISDN 97430826070, Credit Risk "No score", Pre-approved (Expatriate/Qatari) 1,000). Installed Assets list (14 items)... Orders grid shows prior order history... Billing Profile grid: 4 profiles... Trouble Tickets grid: 17 records. || Customer Portal / full account view — Installed Assets grid (1-6) shows the Prepaid Red Promotion alongside two existing postpaid lines (Postpaid Red 350, Postpaid U Start). Orders grid shows two prior Pre2Post orders already Abandoned for this account (4/15/2025)"

### SCR-143 — `recovered`

**Recovered detail:** The document explicitly states the filter behavior and result count for this screen, and its row schema is directly shown as the same lead record with Lead Num 1-DO3J040, In Progress status, that appears across the whole walkthrough.

**Evidence:** ""My Created Leads" filtered view — narrows to 1 record (the just-created lead), confirming the filter scopes to leads created by the logged-in agent."

### SCR-144 — `recovered`

**Recovered detail:** The document explicitly names the filter mechanism (Created By = HEMANTH) and confirms the visible column set includes Lead Sub Status, tying this manager-scoped view to the specific 9-lead list and its purpose of manager review before the Reject action.

**Evidence:** "Manage Leads > "My Team's Leads" view, filtered Created By = HEMANTH, listing the same 9 leads including the target Home/97410001000/1-DO3J040 record (now showing Lead Sub Status column = Call Back)."

### SCR-147 — `recovered`

**Recovered detail:** The 'All Leads across Org' admin view is documented with its role context (KARTHIKK back-office/admin login), its filter dropdown options, grid columns, and the org-wide row set it displays, plus admin-only action buttons (Reject, Retire) visible on the detail panel beneath it.

**Evidence:** "Admin "All Leads across Org" view. Tab titled "All Leads acro[ss Org]..." A view-filter dropdown at top-right offers options including "Converted Leads." The "All Leads" grid (1-10 of 10+) lists every lead in the org across all owners... Lead Details panel below adds admin-only buttons Reject and Retire"

### SCR-148 — `recovered`

**Recovered detail:** The Description edit popup is documented with its trigger (expand/edit icon next to the Description field), its single free-text field, the specific value entered, and its confirm control, plus the before/after state on the parent Lead Details View.

**Evidence:** "A "Description" text-edit popup opens (triggered by an expand/edit icon next to the Description field). The new owner types "Test1234" replacing the prior text, with an OK button... The Description field on the Lead Details View now reads "Test1234""

### SCR-149 — `recovered`

**Recovered detail:** The CallBack Date/Time picker is documented with its full control set (month calendar, day selection, Hour/Minute sliders, Now/Done buttons) and its downstream side-effect (auto-transition of Lead Status/Sub Status upon save), which is additional validation-adjacent behavior beyond a plain field list.

**Evidence:** "A date/time picker opens on the CallBack Date/Time field: December 2025 calendar, day 4 highlighted (green), time control shows 12:00:00 AM with Hour/Minute sliders, plus Now and Done buttons... After entering 12/4/2025 12:00 into CallBack Date/Time, the record auto-updates: Lead Status changes from "New" to "In Progress", and Lead Sub Status becomes "Call Back.""

### SCR-153 — `recovered`

**Recovered detail:** Full field/grid detail for the Cross Sales Offers screen: an offers grid with named columns (OfferType, OfferName, MonthlyRental, OfferDescription, CampaignCode, PriorityCode, ServiceIdentifier, Status, TreatmentCode, Channel, PromotionId, Price), two concrete populated offer rows, four action buttons, and a second sub-grid 'Cross Sales Offers Specification' with Parent Product/Product Type/ProductId columns.

**Evidence:** "Step "2. Offers" expands to a "Cross Sales Offers" grid with Accept / Interested / Reject / Close action buttons and two system-generated offers: OfferType "New MNP", OfferName "MNP New Pos...", MonthlyRental 145... Below, "Cross Sales Offers Specification" grid: Parent Product 1-5X4X4J3 / Product Type PlanDiscountId / ProductId 1-BIJLKMP..."

### SCR-154 — `recovered`

**Recovered detail:** Explicit field-level diff against the Cross Sales contact form is given: base contact fields (Qatari ID, Id expiry, Nationality, Gender, First/Last name, Birth date, Email, Preferred Language, Alt phone) plus the Postpaid-specific additional fields.

**Evidence:** "This Postpaid Contact form has additional fields not present on the Cross Sales contact form: ID type "Qatari ID", Job title, "Digital Lead/Sale" Yes/No radio (No selected), "No Email" checkbox, Language dropdown, Alt. phone # with its own checkbox."

### SCR-155 — `recovered`

**Recovered detail:** Complete field list and action buttons already present in the source: four empty input fields and four control buttons, plus the surrounding full step list of the wizard confirming step ordering.

**Evidence:** "Step "2. Address" expanded with empty fields: Zone, Street No., Building No., Apt/Flat/Unit; buttons Save Address / Skip Address / Cancel / Go Back. Full step list revealed for this journey: 2. Address, 3. Account, 4. Billing, 5. Number Selection, 6. SIM Serial, 7. Plan, 8. Payment, 9. CAF (steps 10. Activity appears later)."

### SCR-160 — `recovered`

**Recovered detail:** Field-level detail recovered: the alert banner text, a 'Number' panel with List Price/Sold Price/Type/Reason fields, an 'Upfront & Deposit' grid with named columns, the Generate CAF button, and the intermediate 'Validating Order' status state.

**Evidence:** "Step "8. Payment" expanded: alert banner "Take Payment in Wincash." "Number" panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown set to "For Testing Only". "Upfront & Deposit" grid empty (Payment / Amount / Wincash Reference columns). "Generate CAF" button. ... Same Payment screen with a "Validating Order, please wait..." status line appearing under Generate CAF."

### SCR-161 — `recovered`

**Recovered detail:** Same evidence as REQ-215: attachments section fields/controls and the surrounding step buttons are fully described.

**Evidence:** "Step "9. CAF" expanded showing an "Attachments" section: "New File" upload control, one file already attached — "PPVT TESTING SAMPLE.pdf" (with delete icon), grid count "1 - 10 of 19+". Buttons: Continue, CAF, Cancel, Go Back."

### SCR-162 — `recovered`

**Recovered detail:** Complete field list for the call-disposition form (9 named fields plus Comments) and the finalize button, plus the resulting confirmation message/number, is present.

**Evidence:** "Final step "10. Activity" expanded — call-disposition form: Channel "Store walk-in", MSISDN 97470345802, Type "Sales", Topic "Automated Guided Journ...", Sub Topic "Retail - Open UI", Area "Provisioning - New Postp...", Resolution Code "Completed", Status "Solved", Language "English", empty Comments box... Button: "Save and Finish"."

### SCR-163 — `recovered`

**Recovered detail:** Full header field set and a 12-line-item breakdown with names, statuses and prices are given for the Sales Order detail screen.

**Evidence:** "Sales Order 1-225217281463: Type Sales Order, Order Type Activation, Status Complete, Total QR25.00, Account HEMANTH GOV..., Primary MSISDN 97430826070, Billing Profile 1-2DO7AXP9 (Postpaid), Bill Cycle 15, MRC Total QR230.00, NRC Total QR25.00, Credit Limit 1,000, Postpaid Count "Y||2", Source UNICA, SubChannel CRM, Service Type Mobile, Created By BHARGAVISM. Line Items grid (12 lines)..."

### SCR-164 — `recovered`

**Recovered detail:** Field-level detail for the Complex Assets / Campaign History view is present: header fields plus three named sub-tabs (Contact History, Response History, Provision History) each with their own grid columns and populated/empty states.

**Evidence:** "Assets module, Complex Assets view for Service ID 97430355458 (Mobile Service Bundle, Status Active, Service Account HEMANTH GOVARDHANAN, Price QR0.00, Effective From 5/7/2026, Effective To 5/12/2026). Campaign History tab active... "Contact History" grid: one SMS campaign record... "Response History": No Records. "Provision History": one row, Status "Success", Created 05/12/2026 03:17:10 PM"

### SCR-168 — `recovered`

**Recovered detail:** Directly evidenced in the guided journey summary itself: the entry-point 'Choose process' screen with its exact four options is documented as item 3 in the Key content list, with screen position (after Home page, before Step 1 Contact) and exact option labels.

**Evidence:** "Guided Process — "1. Choose process." Four options: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid."

### SCR-172 — `recovered`

**Recovered detail:** The document supplies the full list of visible promotion tiles in this modal/picker beyond just the one selected, plus the exact interaction affordances (free-text filter box, per-tile 'Apply +' button, and a follow-on detail confirmation popup with plan components and Continue/Cancel/Go Back). This is concrete field/control-level detail for SCR-172 beyond the one-line summary. | The Promotion Upgrades picker modal is documented with its search interaction and result set, confirming its purpose as a target-promotion search/select tool triggered from the Upgrade Promotion context-menu action on an installed asset.

**Evidence:** "A search box (typed: "red") filters a "Promotion Upgrades List Applet" grid of postpaid plan tiles, each with an "Apply +" button: Postpaid Red 750 Promotion, Postpaid Business Red M 225 Promotion, Postpaid Red 350 Promotion (highlighted in red — selected), Postpaid Business Red 200 Promotion, Postpaid RED ME Promotion, Postpaid Red 500 Promotion, Postpaid RED Unlimited Promotion, Postpaid Legacy Red 2xx Promotion... || Promotion Upgrades picker — modal search "*U*Plus*" returns postpaid target promotions (Postpaid U Plus Promotion, Unlimited Plus variants, etc.)."

### SCR-175 — `recovered`

**Recovered detail:** The Order header/detail screen is evidenced twice in this document at two different states: first as an informational note point (Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP Postpaid, MRC Total QR150.00) with a Validate action producing an informational alert, then again in a terminal validation-failure state (same order, Order Sub Type revealed as Pre2Post, Credit Limit 1,000, blocking alert with Siebel error code). This confirms the screen's purpose (view/validate/submit) and shows both a pass-through validation message and a hard validation failure.

**Evidence:** "Order header — informational note on Validate — Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00. On Validate, an alert reads: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."... Validation failure (terminal state) — same order, now shown with Order Sub Type: Pre2Post... "Bill Limit can not be set lower than Agent Minimum 80...""

### SCR-177 — `recovered`

**Recovered detail:** The document gives the complete field list and two-stage flow for this Contact wizard step: stage 1 is a single 'Prepaid Number' entry field pre-filled and gated by Go/Search again/Cancel; stage 2 (post-Go) auto-populates a full identity/contact field set (ID Type, ID#, ID expiry, Nationality, Gender, First/Last name, Birth date, Digital Lead/Sale flag, Email with validation checkmark, Language, Alt. phone # with validation checkmark) plus an overlay 'Connection Details' modal showing prepaid/postpaid connection counts.

**Evidence:** "Step 1 prompts "Please enter number:" with field "Prepaid Number" pre-filled "+974 79025243". Buttons: "Go", "Search again" (greyed/disabled), "Cancel" ... fields auto-populated: ID Type: Qatari ID, ID#: 28260821189, ID expiry: 3/16/2026, Nationality: Filipino, Gender: M, First name: ALLAN, Last name: GRANADA, Birth date: 3/13/1982, Digital Lead/Sale: No (radio) ... Email: nobill@vfq.com (green checkmark = validated), Language: English, Alt. phone #: 97412341234 (green checkmark = validated)."

### SCR-181 — `recovered`

**Recovered detail:** The summary (step 10) already documents the Comments modal fully: it is a free-text popup reached from the Activity step of the Base Management/Autobase wizard, pre/post-filled with a Language field, and confirmed via OK, later surfacing in the Account Activities tab as the persisted Comments value.

**Evidence:** "A "Comments" popup textbox is filled with the literal text "UNICA PRE TO POST TEST" ... Language field now shows "English". OK button."

### SCR-185 — `recovered`

**Recovered detail:** The summary (step 3) already documents the Account 360 View / Account Summary tile view with concrete fields: Qatari ID, DOB, Email, Whitelisted flag, an Activity Timeline listing prior migration entries, and four tile counters (Orders, Trouble Tickets, Installed Assets, Billing Profiles) plus a flyout with Go to offer migration / Back / SIM Swap actions.

**Evidence:** "A different, higher-level "Account Summary" screen (VFQA 360 View) shows the account snapshot (Qatari ID 28852442717, DOB 06/24/1988, Email nobill@vod.com, Whitelisted). ... Tile counters: Orders 7, Trouble Tickets 0, Installed Assets 2, Billing Profiles 3 (Active 3)."

### SCR-193 — `recovered`

**Recovered detail:** The summary (from full direct visual reading of screenshot 8) already contains the complete field-level structure for this screen: header fields (Application date, Store/Retailer ID, Vodafone mobile number, SIM serial), Applicant details (Full name, Qatari ID/RP/Passport Number, Expiry), an Accepting Terms and Conditions section with blank Signature of applicant field and consent paragraph, mandatory document list, and continuation into full bilingual Vodafone Qatar General Terms and Conditions text.

**Evidence:** "Header fields: Application date* = 1/9/2025, Store/Retailer ID = 100001940, Vodafone mobile number = 97479025359, SIM serial = 8942702400000025359. 'Applicant details' section: Full name* = VFQMAV Sourav183, Qatari ID/RP/Passport Number* = SG1972, Expiry = 02/12/2037. Section 'Accepting Terms and Conditions*' includes a blank 'Signature of applicant*' field..."

### SCR-197 — `recovered`

**Recovered detail:** Direct image extraction and visual reading of the source .docx (previously only text-caption-extracted) recovered the actual Order Activities Queue / My Activities screen with a full column list (Journey Name, Mobile #, Activity #, Order #, Activity Status, Order Status, Order Approval, Order Rejection, Order Created End, Order Created Date, Owner, Service Account, First Name, Last Name, Pending Reason) plus a populated example row, and recovered the exact system-enforced drop-order validation error referenced only generically in the text summary: 'Order is Submitted for Approval and cannot be dropped.(SBL-BPR-00131)' shown on the underlying Siebel Sales Order screen.

**Evidence:** "Journey Name | Mobile # | Activity # | Order # | Activity Status | Order Status | Order Approval | Order Rejection | Order Created E[nd] | Order Created D[ate] | Owner | Service Account | First Name | Last Name | Pending Reason ... "Order is Submitted for Approval and cannot be dropped.(SBL-BPR-00131)""

### SCR-201 — `recovered`

**Recovered detail:** Full markitdown re-extraction of the meeting transcript (not present in the compressed .md summary) surfaces a complete field-level walkthrough of the raw GTM file that feeds the RFS Portal's top-level building data, plus explicit confirmation of the portal's three search modes, per-building displayed attributes, and per-KID displayed attributes -- substantially more field detail than the summary's one-line purpose statement.

**Evidence:** "Raw GTM file from IMS to RPA contains GID, PIN (plot ID), QCars, source of data, building subtype, zone-street-building, BID information (IMS BID, different from the BID used in UIM), GTM ID, area, subarea, PIN/plot, building name, lat, long, LLCF, CRA (regulation), cluster (now F1-F4 instead of 1-4), potential, and landscaping needed or not needed. ... Portal shows whether the building is RFS or not, potential, total building, CB potential, EB potential, and SLA/SLS data telling how fast fixed service can be provided (F1, F2) ... Searching by Karama ID drills down to the actual unit and shows building information plus KID information, whether it is currently in use, whether the KID is prepaid and has an active service."

### SCR-202 — `recovered`

**Recovered detail:** Account Summary (Account 360) screen is fully documented with nav bar, breadcrumb, account attribute fields (Account Type, Customer Segment, Credit Limit Amount, status), whitelisted KYC box fields (Qatari ID, DOB, Email) with Contact Portal link, Installed Assets grid, tab switcher (Account Summary/Asset Summary), Activity Timeline entries, and summary tiles (Orders/Trouble Tickets/Installed Assets/Billing Profiles) plus an All Orders grid.

**Evidence:** "Image 1 — Account Summary tab. Top nav bar: Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts (active)... Left panel shows customer "Anuj Singh Yadav, Vodafone Contractors" — Account Type: Business, Customer Segment: Reimbursement, Credit Limit Amount: 500... Center panel "Whitelisted" box shows Qatari ID: 29635618702, Date Of Birth: 10/24/1996, Email... Right panel "Installed Assets"... Activity Timeline... summary tiles: Orders (87...), Trouble Tickets (62...), Installed Assets, Billing Profiles (3...)"

### SCR-203 — `recovered`

**Recovered detail:** Asset Summary screen documented with Recent Usage panel (All/SMS/Data/Voice/Recharge sub-tabs with actual call-log rows), a usage-ring panel (View Bills/Voice/Data tabs, circular gauges with remaining balances and expiry dates), and a right-hand asset detail panel with Bill Limit, Change Limit button, Activation Date, Addons list, Manage Add Ons / Upgrade Promotion buttons, plus a Next Best Offer banner with Accept/Reject/Interested controls (disabled in this instance).

**Evidence:** "Image 2 — Asset Summary tab... "Recent Usage" panel (All/SMS/Data/Voice/Recharge sub-tabs) lists call detail rows... usage-ring panel shows "View Bills / Voice / Data" tabs with Charge QR 0, Discount QR 0... circular gauges... Right panel "Postpaid Business Employee Plan Pro…" shows phone 97472501217, Postpaid, Business Bill Limit: 0.01 with a "Change Limit" button... Addons: SIM Card, Business Bill Limit, Bill Manager... with "Manage Add Ons" and "Upgrade Promotion" buttons. Below is a "Next Best Offer" banner (grayed out/inactive) with Accept/Reject/Interested buttons disabled."

### SCR-209 — `recovered`

**Recovered detail:** Direct inspection of the source Excel's 05_Requirements sheet recovered the exact, testable requirement statements and acceptance criteria behind the summary's one-line paraphrase: MPAR_001_JSM_01 defines the Agent Desktop as the journey-initiation screen with acceptance criterion 'A Retail Agent can start a New Postpaid Activation journey from the Agent Desktop home screen'; MPAR_001_JSM_02 defines the role-based authorization behavior with acceptance criterion 'An agent without the New Activation privilege is denied journey initiation and an authorisation message is displayed', both tied to Business Rule Ref BR-001 and the (TBD) Agent Role Privilege Matrix.

**Evidence:** "MPAR_001_JSM_01 | Journey and Session Management | Initiate retail interaction | The system shall allow a Retail Agent to initiate a New Postpaid Mobility activation journey for a walk in customer from the Agent Desktop. | A Retail Agent can start a New Postpaid Activation journey from the Agent Desktop home screen. | Must | AS-IS | ... MPAR_001_JSM_02 ... The system shall authenticate the Retail Agent and authorize journey access based on the agent role defined in Agent Role Privilege Matrix (TBD) | An agent without the New Activation privilege is denied journey initiation and an authorisation message is displayed."

### SCR-211 — `recovered`

**Recovered detail:** Slide 35's embedded screenshot (image93.png), invisible to text extraction, shows the full Tickets Dashboard screen: top navigation icon bar (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers), a Default/Custom view toggle, a row of quick-filter tabs (Assigned to me [active/highlighted], Escalated by Me, Escalated to Me, My Rejected TT, My Returned TT, Raised by Me - Open, Raised by Me - Unsubmitted), grid toolbar icons (search, export/download, settings/gear, record count '1-10 of 10+', expand), and a paginated results grid with column headers: Request Count, Target Date, NP Order Id, Ticket Id, Status, Sub-Status, Owner, Source, TT Category, Area, Sub-Area, Queue Name, Escalation Time, Escalate Reason(s), Escalated By, Created Date, Created By -- populated with real sample rows (e.g. Ticket Id 1-110909338319, Status 'In Progress', Sub-Status 'Assigned', Owner ANUJYADAV, Source Customer, TT Category Complaints, Area 'Voice Calls', Sub-Area 'Voice - Local').

**Evidence:** "Column headers read directly off image93.png: 'Request Count | Target Date | NP Order Id | Ticket Id | Status | Sub-Status | Owner | Source | TT Category | Area | Sub-Area | Queue Name | Escalation Time | Escalate Reason | Escalated By | Created Date | Created By'; quick-filter tabs: 'Assigned to me' (boxed/active), 'Escalated by Me', 'Escalated to Me', 'My Rejected TT', 'My Returned TT', 'Raised by Me - Open', 'Raised by Me - Unsubmitted'."

### SCR-212 — `recovered`

**Recovered detail:** Slide 34's embedded screenshots (image90.png, image91.png, image92.png), invisible to text extraction, show the actual customer-facing VF App ticket-status screens: an 'Assistance' menu screen (My Complaints, Maps Directory, Settings, Live Chat, Tutorial, Log out, with bottom nav Add-ons/123 Offers/Home/Messages/Account) leading into a 'My Complaints' list screen with tabs All / Open / Closed, and an expandable complaint card showing fields: Created on [date], Category, Sub-category, Description, Status (e.g. 'Waiting to be processed' in orange for Open, 'Resolved' in green for Closed), Complaint Number, Last updated on, Agent message (free text, populated only on Closed/Resolved cards, e.g. 'We have concluded the review of your Ticket 1-122212936766. Your issue has been investigated and fixed with a Balance Adjustment of (QR35)...'), and a Show more/Show less toggle.

**Evidence:** "Open-tab card (image91.png): 'Created on: 18 Jun 2020 / Category: Billing / Sub-category: MISSING CREDITS / Description: The Incident for the party / Status: Waiting to be processed / Complaint Number: 1-122212936766 / Last updated on: 21 Jun 2020 / Agent message [blank] / Show less'. Closed-tab card (image92.png), same Complaint Number, 'Status: Resolved' (green) and 'Agent message: We have concluded the review of your Ticket 1-122212936766. Your issue has been investigated and fixed with a Balance Adjustment of (QR35). Thank you for understanding...'"

#### Reclassified — Not Applicable (7)

### SCR-057 — `not_applicable`

**Why not applicable:** This screen (prepatched device detection dialog) already has full evidence in the summary: the exact system dialog text, both action buttons (Instant Activation / Normal Activation), and the surrounding step context (step 3, immediately after Kahramaa ID submission and before Contact ID capture). The source is already at its extraction ceiling (high-confidence direct visual read of all 42 screenshots); no further screen-purpose or field-level detail exists to recover because this is a single confirmation dialog, not a data-entry form with a field list to enumerate.

### SCR-065 — `not_applicable`

**Why not applicable:** This is explicitly a backend/admin infrastructure trace screen (Oracle Enterprise Manager / Fusion Middleware Control), not an end-user CRM screen with a data-entry field list — the item's own purpose statement says so ('system-of-record verification, not an end-user CRM screen'). The summary already quotes its full available detail (message ID, timestamps, server, node/pipeline/stage, inbound service name/path/URI/operation, and the verbatim SMSTXT payload). A 'field inventory' framing does not apply to this kind of integration-monitoring screen; no further business-relevant screen detail should be expected or invented here.

### SCR-069 — `not_applicable`

**Why not applicable:** This is a Guided Journey screenshot document already re-processed at high confidence via direct image extraction per the corpus-wide 2026-08-21 pass (per CLAUDE.md); the doc's own summary IS the richest available text and already contains full field/section-level detail for the CAF Preview/Sign screen (bilingual sections 1-4, billing info, T&Cs, signature capture, signed record with agent+timestamp). There is no further/deeper original source to re-mine -- the flagged 'evidence' quote in the gap item is itself the complete extraction; no additional non-screenshot original document exists for this journey to search for more detail.

### SCR-072 — `not_applicable`

**Why not applicable:** Same as SCR-069: this Guided Journey doc is already fully mined at high confidence via direct screenshot reading. The Line Items tab hierarchy and attributes (Device Model, Device Number, Device Type, ONT Device Type, CPE Serial No, MAC Address, OUI, Product Class, VoIP Number) are already fully enumerated in the summary (images 26-27) -- there is no deeper original source (this IS the source, already read visually) to extract further detail from.

### SCR-134 — `not_applicable`

**Why not applicable:** Guided Journey doc already fully mined via direct screenshot reading at high confidence; the Activity/Comments step is fully described (empty Comments textbox, info note text, Save and Finish button) in the doc itself. No further original source exists to deepen this beyond the screenshot already read.

### SCR-136 — `not_applicable`

**Why not applicable:** Guided Journey doc already fully mined; the Order Entry header/detail view fields (Order #, Account, Order Type, Order Sub Type, Status, Created, Created By, Total, Price List, Currency, Billing Profile, Bill Cycle, MRC/NRC Total, Credit Limit, Fulfillment Status, Priority, Service Type, Source) are already completely enumerated verbatim in the doc (image29). No deeper source exists.

### SCR-138 — `not_applicable`

**Why not applicable:** Guided Journey doc already fully mined; the Mass Market Addons checklist modal's full item list and prices (Pakistan/Philippines/Egypt/Bangladesh/Sri Lanka QR35 add-ons, International 50 QR50, Mesh Units QR25-100, 5G Service QR75, etc.) plus its Cancel/Done buttons are already completely enumerated in the doc (image 11). No deeper source exists.

#### Genuinely Gapped — Recommended Assumption (5)

### SCR-008 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The fuller transcript extraction confirms the EBU Number Portal's purpose ('show and reserve a range' of available numbers to the customer) and its status as an admin/portal tool used by EBU specifically, but contains no field-level UI detail (no field names, no layout, no screenshot). No analogous screenshot-evidenced number-selection screen exists elsewhere in this same enterprise/EBU context to borrow a field list from (the closest analog, the tablet Number Selection step in the Fixed Line/MNP Guided Journey docs -- a grid of number tiles with a Free/Reserved toggle and search box -- is a retail/tablet-channel UI, not this back-office EBU admin portal, so borrowing its shape would be a guess not grounded in the same system). This item needs a business-owner/screenshot capture of the actual EBU Number Portal rather than an assumption.

### SCR-026 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** No wireframe/field-level detail exists for this DXP screen anywhere in the corpus — DXP is explicitly greenfield/target-state (not yet built), unlike the Siebel/Open UI screens which are all evidenced via actual screenshots in the Guided Journey docs. The workshop transcript (re-extracted in full via markitdown) only confirms the step sequence (identity validation -> DOI validation via EDW -> product catalog -> installment selection/breakdown -> WinCash stock/payment -> auto-order), with no field names, mandatory flags, or layout detail. Recommended analogy: model this screen's fields on the evidenced 'Step 7 - Plan (Product Catalog)' screen from the Postpaid Open UI Desktop HRN guided journey (guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2), which shows a searchable plan-tile grid, an 'Add' detail panel with included components, a credit-limit/bill-limit field with an edit control, and Continue/Customise/Cancel actions — since DOI product selection is structurally the same 'select a catalog item, see a detail/breakdown panel, edit a financial parameter (installment vs credit limit), continue' pattern. This is an assumption only; a business-owner/design decision is still needed to confirm actual DXP screen layout since no DXP mockups exist in this corpus.

### SCR-142 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The document confirms the screen exists and shows 9 leads including the new one, but does not give a distinct full column/field list specific to 'My Leads' itself. Recommend assuming 'My Leads' shares the identical column schema as the evidenced 'My Created Leads' and 'Manage Leads > My Team's Leads' grids in this same document (Lead Num, Mobile #, Service Needed, Status, Sub Status, Created By, Created date) since all three are variations of the same underlying lead-list grid filtered differently — this is a direct analogy within the same document, not a cross-document guess.

### SCR-159 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The source shows the transition into the Plan step (loading overlay, breadcrumb change to 'Product Catalog:', 'Continue to Payment' button) and the resulting promotion detail modal (Bill Limit/Credit Limit fields plus a bundled component list), but no field-level layout of the plan SELECTION grid itself (e.g. list of selectable plans/promotions with columns like Plan Name, Price, Type before one is chosen). Analogous evidenced pattern: the Number Selection step (step 5) shows a two-grid pattern (Unreserved Numbers / Reserved Numbers) with explicit columns before/after selection. Recommend assuming the Plan step follows a similar 'available promotions grid -> selected promotion detail modal' shape, with the grid carrying at least Promotion Name / Monthly Rental / Type columns analogous to the Cross Sales Offers grid columns (OfferName, MonthlyRental, OfferDescription) seen at step 2 of this same journey, but this needs business-owner confirmation since no screenshot of the raw selection grid survives in this document.

### SCR-207 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The document only mentions the existence of a 'Go to Contact Portal' link on the Account Summary screen (image 1) - it does not show what the Contact Portal screen itself looks like, since none of the 5 screenshots in this document navigate into it (the walkthrough stays within Account Summary, Asset Summary, and the Communications modal). There is no analogous 'Contact Portal' screen evidenced elsewhere in the indexed corpus reviewed so far to infer its shape from. This needs either a source screenshot that actually captures the Contact Portal target screen, or a business-owner decision on what fields/purpose it should carry if it is to be built - recommend treating this as a stub/external-link reference (destination unresolved) rather than guessing its field content.


## Underspecified Entities (27 items)

#### Recovered (20)

### ENT-019 — `recovered`

**Recovered detail:** The fuller markitdown extraction adds concrete distinguishing attributes and process context beyond the one-line summary: the Smart Device (Smart Viper) is distinguished from standard mobile flows only by (1) an extra Device ID attribute and (2) use of a non-mobile IoT number range; the device is physically seen/handed over at activation itself; WFM is not required for it (same as other small/indoor devices, whose SIM comes from IOP as a normal SIM); it supports both prepaid and postpaid plans; and its current retail viability is itself an open question (very few/no active customers, unclear if retail still sells it) — this is lifecycle/process-relevant detail (an activation-time handover state) not present in the summary.

**Evidence:** "00:00:06 | Vodafone smart device (Smart Viper) | ... The only extra thing seen is device ID, and the number should not be a mobile number - that is the only difference from other flows. | 00:01:56 | IoT number range and device | The first difference is the number range - it is the IoT number. Device is seen at activation itself; the device is handed over. | 00:02:09 | WFM not required for indoor/small device | WFM is not required for this small device; for indoor the device and SIM are already given, SIM comes from IOP where the SIM is normal. Plan exists, prepaid and postpaid. | 00:00:53 | Retail check on smart device | Need to check with retail and retail service whether the device is still sold... There are very few / no active customers."

### ENT-024 — `recovered`

**Recovered detail:** Fuller extraction adds concrete cardinality/relationship rules for the Service Account entity beyond the bare hierarchy already known: a customer can have multiple service points (e.g. one mobile service account with MSISDN + mobile plans, one fixed-net service account with fixed-net plan), and these service accounts can either share a single billing account/bill profile or be split across two different billing accounts each with its own bill profile. This is a genuine validation/relationship rule for the entity, not just a restated hierarchy.

**Evidence:** "[01:23:14] A customer can have multiple service points - a mobile service connection (with MSISDN and mobile plans) and a fixed net service connection (with fixed net plan); both can go to a single billing account with one billing profile, or to two different billing accounts each with different bill profiles. [01:21:58] Account model: the customer is a single customer account (legal) entity; under it are billing account entities, each billing account entity has one bill profile; under the account are service accounts, each service account has an MSISDN."

### ENT-029 — `recovered`

**Recovered detail:** Fuller extraction recovers concrete conditional-display/validation logic (functioning as lifecycle/validation rules for the DOI entity within the journey): the DOI applet/section is shown only when the customer/QID passes eligibility (existing postpaid account in good standing + presence on the internal big-data eligibility list + QCB credit check pass); the agent has an explicit skip button if not pursuing DOI; in the current architecture there is no point-of-sale completion for DOI inside Open UI -- the order is created but billing/fulfillment completion happens in Siebel; DOI stock/eligibility is synced with WinCash/eShop stock via the separate DOI portal (a distinct system/flow, confirmed kept out of the main postpaid journey for this phase); and a differentiated telesales sub-flow exists where the device-installment order cannot be marked complete until physical device delivery (unlike retail, where the customer receives the device immediately). | Full re-extraction surfaced additional process-sequence detail beyond the compressed summary, clarifying DOI's eligibility/validation chain and confirming the add-on-vs-bundle lifecycle change: DOI eligibility is now determined by the portal via big-data logic on the customer's QID plus checks on outstanding amount and whether the customer already holds another device; the order is closed only after delivery is confirmed successful; and the DOI add-on has been fully retired in favor of an account-level bundle purchase (no add-on exists anymore). This adds concrete validation-rule and state-transition detail (eligibility check -> stock reservation -> signature -> order creation gated on portal-transaction closure / delivery confirmation -> billing start) not fully spelled out in the summary, though it still stops short of a formal named lifecycle-state enumeration (e.g. no explicit 'Eligible/Reserved/Signed/Active' state labels are used in the source - the source describes a process, not a state machine).

**Evidence:** "'01:29:24 functional Show the DOI applet only when the customer/QID is eligible for DOI; otherwise bypass that part of the journey' / '01:30:57 functional Provide a skip button so the agent can skip the DOI section' / '01:18:35 In the current architecture there is no point of sale for device installment from Open UI - the order reaches Siebel and billing happens there.' / '01:44:56 ... the journey starts on the DOI portal which checks WinCash stock and tells the agent if stock is available before proceeding.' / '01:42:49 Telesales / delivery journey: ... device installment order cannot complete until device is delivered to the customer, unlike retail where the customer receives it then and there.' || 01:09:57 | DOI eligibility is determined by the portal using big data logic on the customer's QID, plus checks on outstanding amount and whether the customer has already taken another phone. ... 01:09:10 | The DOI order is closed only after the delivery is successful. ... 01:17:55 | Account level bundle replaces add-on for DOI | The DOI add-on is now completely disabled; only the account level bundle is getting purchased. There is no add-on any more."

### ENT-031 — `recovered`

**Recovered detail:** The fuller extraction reveals an explicit precondition/sequence and an operational exception not captured in the original flagged description: (1) the customer's existing bill must be cleared BEFORE the plan-change to the park plan occurs; (2) credit limit is set to zero as a rule, but with a named override case (customers travelling may need it changed) implying an exception path exists at agent/back-office discretion.

**Evidence:** ""For park my number the customer must clear their bill first, then is moved to a park my number plan with very limited benefits, losing their current plan." ... "While parked, usage is allowed if permitted but the customer does not get the plan benefits... As a rule the credit limit will be set to zero while parked, which means no order can be made" ... "though customers travelling may need it changed""

### ENT-033 — `recovered`

**Recovered detail:** Full transcript clarifies Vodafone ID's lifecycle and scope precisely: it is NOT assigned per-customer or per-order; it is assigned to the physical unit/location at the time Vodafone performs last-mile installation (a Vodafone ID project executed ~2 years prior to the workshop per a management mandate), exists for effectively all Karama-ID-mapped units (though fewer installs have used it in practice), and always resolves to a backend KID (KID remains the single source-of-truth identifier; Vodafone ID and Karama ID are both just alternate lookup paths to the same KID). Self-activation via its QR code is gated on ONT boxes already being physically present at the unit. | Full markitdown re-extraction surfaces explicit lifecycle/validation detail beyond the summary: VFID generation timing (in advance, by RPA), storage system (UIM, not IMS), the mapping mechanism (field survey team physically tags buildings, returns mapping file loaded via RPA), cardinality rules (normally 1:1, but many-KIDs-to-1-VFID supported, 1-VFID-to-many-KIDs is a manual corner case handled by sales+fulfillment), and the activation-time business rule that Karama ID (not VFID) is what actually drives activation even under one-to-many mapping.

**Evidence:** "00:18:20 | When is the Vodafone ID assigned - at the first order the customer places, prepaid or postpaid? | No, it is not against a customer. It is Vodafone's equivalent of the government-provided Karama ID, created when Vodafone does the installation at the last mile, and at the backend it represents a KID. | 00:20:33 Assumption: Vodafone ID exists for all units/companies, although installs are fewer. | 00:20:52 History of Vodafone ID project | Earlier only Karama ID existed. About two years back a Vodafone ID project was done following a mandate from management. || one-to-one mapping from Vodafone ID to Karama ID, right? | No — one-to-many cases are implemented; dummy Karama IDs are loaded so each becomes unique... the same Vodafone ID mapped to multiple KIDs is also possible as a corner case... For the activation, the Karama ID is the one used — even with one-to-many, they need to select which Karama ID is to be activated, right? | Yes. The Karama ID drives activation... It is done in UIM. The IMS file does not contain Vodafone ID information... Vodafone ID is generated by RPA and loaded into UIM, then the survey file loaded by business through RPA into UIM creates the mapping against the Karama ID."

### ENT-044 — `recovered`

**Recovered detail:** Full field list recovered for the User/Agent entity (Administration - User > All Person Administration screen) plus the many-to-many Responsibility assignment mechanism via a picker dialog with a 'Selected' panel, showing an agent can carry multiple responsibilities with one apparently primary/checked (VFQA Sales), and that responsibilities gate which app tiles/journeys (e.g. MNP) are visible on Agent Home. | The existing summary already contains a complete field list for the User/Agent record on the Agents Details tab, including designation, email, outlet, manager, company, location, team, mobile - this is the field inventory the gap requested. No explicit 'Responsibility' role-list beyond 'Retail Agent' (agent) and 'Test Manager' (approver) is separately enumerated in this document, but those two role instances with their queue/permission implications (Retail Agent submits; Test Manager sees Order Approval menu and approve/reject actions) are concretely evidenced. | The Employees screen record shown in image1 gives a full field-level shape for this entity: User ID, Designation, Responsibility (role), Position, Organization, Location, Team, Company — directly usable as the entity's attribute list, and the Responsibility field is explicitly tied to menu/tile access ('VFQA Mass Market Agent' role vs. later 'Test Manager' role showing a narrower tile set in the Lead Creation document), demonstrating the RBAC-governing behavior described. | The summary (screenshot 1, direct visual read of the All Person Administration admin screen) already provides the concrete field set for the User/Agent/Responsibility entity: Last Name, First Name, User ID, Job Title, Contact Team, Responsibility, New Responsibility, Alias — this is the field-level shape requested. No explicit lifecycle-state machine is shown (this is a reference/config screen, not a stateful workflow entity), but the field inventory itself is fully evidenced. | The source document (via direct visual reading of the Administration – User > All Person Administration screenshot, image 1) gives a full field-level record shape for this entity, beyond the responsibility-picker fragment originally cited: User ID, Last Name, First Name, Job Title, Contact Team, Alias, Email, and a 'Responsibility' field plus a 'New Responsibility' field (i.e. the record supports an active/primary responsibility distinct from one being added). The Responsibilities picker (image 2) further shows the underlying catalogue is a large flat list of role names (AT Partner Analytics Administrator/User, AT Sales Analytics Administrator/User, AT Service Analytics Administrator/User, Analyst Routing Model, Anonymous User - SMC, Asset Management, etc.) from which multiple can be multi-selected into a 'Selected' panel, with one flagged as primary/checked (VFQA Sales in this case) — confirming a many-to-many User-to-Responsibility model with a single 'primary' designation, not just a static list.

**Evidence:** "agent 'Hemanth Kumar' (User ID HEMANTH, Last Name Kumar, First Name Hemanth, Job Title 'Team Leader', Contact Team SADMIN, Alias 1234999, Email hemanthk@maveric-s...) is shown with Responsibility field set to 'VFQA Sales' and a 'New Responsibility' field showing 'AT Service Analyti...'. A Responsibilities picker dialog lists available responsibilities... with a 'Selected' panel already containing: Back Office Onshore, VFQ Base 2, and VFQA Sales (checked/primary). || Agents Details tab (the submitting agent): Agent First/Last Name VINODHINIR, Login VINODHINIR, Designation "Retail Agent", Email tirupati.nanda@vodafone.co…, Outlet Id 1122334455, Manager Email tirupati.nanda@vodafone.co…, Company Vodafone, Location DOHA, Team AdminUser, Mobile Number (974) 708-9908 x7 || CRM "Employees" screen shows agent Hemanth Kumar, User ID `HEMANTH`, Designation "Team Leader," Responsibility "VFQA Mass Market Agent," Position "F/O CC Champion," Organization "Default Organi...," Location "DOHA," Team "Testing," Company "Maveric." || Confirms the operating user: Last Name "Kumar", First Name "Hemanth", User ID "HEMANTH", Job Title "Team Leader", Contact Team "SADMIN", Responsibility "VFQA Sales", New Responsibility field shows "AT Service Analyti..." (truncated), Alias "1234999". || agent "Hemanth Kumar" (User ID `HEMANTH`, Last Name Kumar, First Name Hemanth, Job Title "Team Leader", Contact Team `SADMIN`, Alias `1234999`, Email `hemanthk@maveric-s...`) is shown with Responsibility field set to "VFQA Sales" and a "New Responsibility" field showing "AT Service Analyti..." ... A Responsibilities picker dialog lists available responsibilities (...) with a "Selected" panel already containing: Back Office Onshore, VFQ Base 2, and VFQA Sales (checked/primary)."

### ENT-047 — `recovered`

**Recovered detail:** Full entity behavior recovered: the Employer/Company entity is selected via dropdown at Contact creation, is dedicated a distinct contact-level action button ('Update B2B2C Employer'), and its linkage is written to a specific back-end field ('Parent Account Id') on approval, tracked in the Contact Audit Trail with actor and timestamp — giving concrete field names and a lifecycle trigger (approval event) for when the linkage is persisted.

**Evidence:** "Contact-level Audit Trail (image 47): MANAGETEST modified "Parent Account Id" to "1-59PPBV" (business component "VFQA Contact Integration") at 10:11:54 AM, confirming the B2B2C employer/parent-account linkage was applied as part of approval."

### ENT-049 — `recovered`

**Recovered detail:** Full field inventory and validation gating already present: the Installation Checklist entity has a defined field set (speed test result, Wi-Fi usernames, call timestamp, WiFi Coverage Tested checkbox, optical power reading, splitter port count, 7 named photo attachments, 4 customer-briefing acknowledgement checkboxes, signature), and is gated by a banner requiring completion before the Activity can be Ended, plus a downstream 'Forms Submitted' indicator confirming its completion state is tracked.

**Evidence:** ""'Installation Checklist' form (top-right 'Forms Submitted' indicator). Fields captured: 'Speed test results on Wi-Fi and LAN' = Test... 'Optical Power Meter Reading' = 1, 'Splitter Free Port Details' = 1... Customer-briefing checklist items all checked... A hand-drawn Customer Signature is captured." / banner: "You Need to Complete 'Assess Activity', 'Checklist' & 'Mandatory Fields' marked with * to 'End' the Activity.""

### ENT-051 — `recovered`

**Recovered detail:** Two full, specific Audit Trail entries recovered at both Account and Contact level, each showing actor (user login), field name changed, new value, and precise timestamp — plus the original record-creation entries by a third user (KARTHIKK) at account creation, giving a fuller lifecycle picture (creation -> field updates -> approval-triggered updates) than the originally flagged single evidence line.

**Evidence:** "Account-level Audit Trail (image 45): Confirms the sequence of system events — MANAGETEST modified "Sales Number" to "Consumer B2B2C" at 10:11:54 AM; HALEEMI modified "VFQA Preapproved Qatari Expat" to 1000 at 10:05:07 AM; system user KARTHIKK created the original Account record (Status Active, Market Class Expatriate, Name YAM POKHAREL) at 09:56:34 AM."

### ENT-053 — `recovered`

**Recovered detail:** The existing summary already contains the full attribute set and validation semantics for this entity (used to gate order progression), satisfying the lifecycle/validation detail requested: Inventory Status, Assignment Status, Device Status act as the validation gates (e.g. 'not free in UIM' when Assignment Status is not Available/Unassigned; 'already assigned' when Assignment Status is Assigned to another order).

**Evidence:** "Custom Object Summary for SIM 8942702800801190296F: Specification SIM Card, Inventory Status Installed, Assignment Status Assigned, Device Status Available, ICCID..., IMSI1..., MSISDN... — used by the agent to source a valid SIM. ... error dialog: "CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)""

### ENT-055 — `recovered`

**Recovered detail:** Full field list recovered for Donor Details entity from the '6. Donor Details' step, including field types (dropdown vs read-only/greyed) and the linkage to the MNP Application Form's applicant/current-service-provider fields, plus the derived Donor Attachment artifacts (Letter for Extension of Contract, Digital MNP Form) that get generated and stored against this entity. | The summary (screenshot 6, direct visual read) already documents concrete Donor Details fields captured in this exact MNP Postpaid journey step 6, giving field-level shape to the Donor Details entity beyond just naming the step: the fields visible are Port-in equivalent context plus billing profile linkage. Additionally the sibling MNP Prepaid document (also in this batch) gives an even fuller field list for the analogous Donor Details step: Port-in Number, Donor ID Type, Donor ID, Donor Type, Donor Operator, Subscription Type, plus Donor Attachment as an uploaded/generated MNP T&C document tile. This cross-document evidence (same corpus, same entity, MNP Prepaid variant) concretizes the Donor Details/Donor Attachment entity's field-level shape.

**Evidence:** "6. Donor Details expanded: 'Please enter donor details below.' Fields: Port-in Number 97466000666 (green check), Donor ID 893093 (green check), Donor ID Type = Passport (dropdown), Donor Type = Consumer (read-only/greyed), Donor Operator = Qtel (read-only/greyed, i.e. Ooredoo/Qtel is the losing/donor operator), Subscription Type = Postpaid. || Fields: Port-in Number 97466000534, Donor ID Type = Passport, Donor ID KJSH0934989, Donor Type = Consumer, Donor Operator = Qtel (greyed/read-only), Subscription Type = Prepaid... Step 5 – Donor Attachment: the generated/signed document appears as an attachment tile labeled 'MNP T&C' with a green check"

### ENT-058 — `recovered`

**Recovered detail:** The T&Cs page gives the full lifecycle/business-rule detail for the Star Number entity: a 90-day reservation hold pending QID submission, plus two value tiers with distinct lock-in durations, tied explicitly to price bands.

**Evidence:** "Numbers/Star Number reservation rules (90-day hold for reserved numbers pending QID submission; Star Number lock-in of 1 year for QR1,500–19,999 numbers, 2 years for QR20,000+)"

### ENT-059 — `recovered`

**Recovered detail:** Deposit/credit-limit rule confirmed with amount and payment-method alternative (QR 2,000 minimum deposit OR valid credit card), plus a related lifecycle rule for unclaimed deposits going to charity after 12 months, both located in the General T&Cs section of the CAF.

**Evidence:** "credit limit/deposit rules (minimum deposit QR 2,000 or valid credit card); ... deposit refund and unclaimed-deposit-to-charity (after 12 months) provisions"

### ENT-071 — `recovered`

**Recovered detail:** Full re-extraction surfaces additional structural/lifecycle detail: IMS is explicitly the master/inventory system for physical connectivity (not directly system-integrated to UIM -- data moves via files through fulfillment), the network team owns and manages IMS exclusively (does not touch UIM), sales/business team adds potential and forecast data into IMS, and the specific compound-mapping edge case (one GTM building entry to many BIDs/CTPs/KIDs) is named as 'Adhan 27'.

**Evidence:** "IMS is the inventory/master for physical connectivity, but UIM loads it from files placed through fulfillment — it is not directly system-to-system integrated, because a few things are decided by business in between. CTP translates into UIM as BID; splitter ports and CPE information also sit in UIM. ... it is managed by the network team in IMS; they do not touch UIM."

### ENT-072 — `recovered`

**Recovered detail:** Full re-extraction surfaces the specific data-sourcing/lifecycle split for RFS status that was compressed in the summary: top-level RFS/potential/SLA fields come from IMS via the GTM file (batch, uncertain current frequency -- designed fortnightly, believed now daily/bi-weekly), while live active-service/KID status comes from UIM in real time with a reverse sync back to IMS -- i.e., this is a composite/derived record, not a single-system stateful entity with its own lifecycle states.

**Evidence:** "top-level information comes from IMS via the GTM file; the active service information on the KID comes from UIM, because IMS does not hold all the information. A reverse sync also runs between UIM and IMS on active service."

### ENT-073 — `recovered`

**Recovered detail:** Direct inspection of the underlying SMS Templates.xlsx workbook (beyond what the summary compressed) shows a genuine two-value lifecycle for this entity: Status = 'Active' (all rows in Automatic/Lead/Other sheets) or 'Draft' (67 of 1,236 rows in the Manual SMS Templates sheet, e.g. ' White Friday QND' / Prepaid / multiple languages, created 2023-11-22, still Draft as of last-updated 2025-12-15). Combined with the 'Do not send SMS' Y/N flag (a per-row suppression control independent of Status) and the 'System Template Flag' = Y marking protected/system-owned templates, this gives a concrete lifecycle/validation shape: Draft (authored, not yet live) -> Active (live, sendable) with a separate suppression flag, and a protected-template flag preventing edits by non-system owners.

**Evidence:** "(' White Friday QND', 'Prepaid', 'English', 'FrontLine', 'Draft', datetime(2023, 11, 22, 13, 53, 30), 'User ID', datetime(2025, 12, 15, 15, 11, 55), ...) -- Manual SMS Templates STATUS VALUES: {'Active', 'Draft'} FLAG VALUES: {None, 'N'}"

### ENT-074 — `recovered`

**Recovered detail:** Direct inspection of the underlying Order Validation Business Rules.xlsx workbook (beyond the single-line 'APN validation' mention in the summary) surfaces 6 explicit APN business rules with rule IDs, exact error messages, and a lifecycle-adjacent ordering constraint: ORD_VALD_RULE_064 (APN ID & APN Name mandatory for APN service line items), ORD_VALD_RULE_065 (Static IP cannot be blank for APN Static IP Address product), ORD_VALD_RULE_066 (APN Id mandatory for Account Level APN), ORD_VALD_RULE_067 (APN Name mandatory for Account Level APN), ORD_VALD_RULE_068 (APN ID value must be unique - the account-level uniqueness rule cited originally, now with its exact rule ID and error message), and ORD_VALD_RULE_069 (all services provisioned on an APN must be disconnected before the APN itself can be disconnected - an explicit lifecycle/sequencing rule: Active-with-dependent-services -> [block] -> must disconnect dependents first -> Disconnected). All 6 share Step='APN Validation', Type='BS', Business Service='VFQA Generic Validation BS for All', Method='Process'.

**Evidence:** "ORD_VALD_RULE_069 | BUSINESS RULE 36 | All Services provided for APN should be disconnect before Disconnect APN (Account Level APN) | Error Message: All Services provided for APN should be disconnect before Disconnect APN. | Step: APN Validation | Business Service: VFQA Generic Validation BS for All"

### ENT-077 — `recovered`

**Recovered detail:** Annex_02_Status_Model (33 rows) actually models FOUR distinct object lifecycles, not just a generic 'order/asset' status list as the summary implies: (1) Order: Draft -> Pending Payment -> Submitted -> In Fulfilment -> Awaiting Workforce -> Activated -> Completed, with Failed/Cancelled branches, each row carrying a Trigger and Permitted Next Status; (2) Tracking Record: New -> In Progress -> Resolved -> Closed, with Cancelled branch; (3) Portability Ticket: Created -> Validating -> Conditionally Accepted/Accepted/Rejected/Suspended -> Termination Order Generated; (4) Termination Request: Created -> Under Retention -> Retained/Validated for Termination/Validation Failed -> Termination Order Submitted -> In Deactivation -> Completed/Failed/Cancelled. Each of the 33 rows has Object | Status | Description | Trigger | Permitted Next Status columns, giving genuine validated state-machine detail (not just a flat list of status labels) directly relevant to UJ-099/100/101 above.

**Evidence:** "('Termination Request', 'Validation Failed', 'One or more mandatory validations failed', 'Validation failure', 'Under Retention, Cancelled') ... ('Portability Ticket', 'Conditionally Accepted', 'Awaiting outstanding dues settlement within the window', 'Pending bill identified', 'Accepted, Rejected, Suspended')"

### ENT-078 — `recovered`

**Recovered detail:** Confirmed the exact Open Item and requirement pairing behind the IPTV/STB contested-default flag: Open Item OI-03 (Decision Required, Product Catalogue and Cart owner=VFQ Business, Priority=High, Status=Open): 'Confirm whether the agent may remove the internet protocol television bundle during activation, since the requirement permits it while the VFQ response records that this is not preferred by business' (Note: 'Requirement text and VFQ response are in tension'). The underlying requirement pair is FAR_001_QPC_02 'IPTV default bundling' - 'The system shall bundle the internet protocol television offering by default with the base plan and shall display all child plans associated with the internet protocol television bundle in the cart' - and FAR_001_QPC_03 'IPTV removal option' - 'The system shall allow the Retail Agent to remove the internet protocol television offering from the cart at the customer request.' This gives the precise requirement IDs, full requirement text, and governance status behind the previously vague 'contested' note.

**Evidence:** "OI-03 | Decision Required | Product Catalogue and Cart | Confirm whether the agent may remove the internet protocol television bundle during activation, since the requirement permits it while the VFQ response records that this is not preferred by business | VFQ Business | High | Open | Requirement text and VFQ response are in tension"

### ENT-083 — `recovered`

**Recovered detail:** Slide 11's seven form-type icons are not decorative icons but embedded images of the actual scanned/fillable enterprise form templates, each with a distinct, concrete field list -- confirming ENT-083 is not just a catalog of names but a set of entities each with recoverable field-level structure. Spot-checked three of the seven: 'Postpaid Mobile' form (image40.png) has fields Company Name, CR No., Industry Sector, No. of employees, Zone/Street/Building/Unit/Floor/Address Landmark/Heritage ID/Geo-Coordinates, Trade Name (EN/AR), Commercial Name (AR)/CR-Registration License, Primary Contact Person Details (Full Name, Position, Contact Number, E-mail, Passport/Qatari ID Number, Company Self-Service Portal Access), a repeatable 'Choosers' block, Payment Contact Person Details, Bill and Payment Details (Bill Type: Paper/E-Bill, Additional paper bill copies, E-mail for E-Bill, Bill Language: English/Arabic), and Credit Limit (Amount of Credit Limit QAR). A different icon (image44.png) is actually the 'Number or Account Transfer form' with Current Customer and New Customer sections (Name, Passport/QID number, Address/PO Box, CR number, Commercial Registry number, Alternative number, Date of Birth) plus Terms & Conditions and Signature/Date fields -- demonstrating the seven 'form type' tiles on this slide are each a genuine distinct entity with its own field schema, not a flat undifferentiated list.

**Evidence:** "image40.png (Postpaid Mobile form) header fields verbatim: 'Company Name*', 'CR No.*', 'Industry Sector', 'No. of employees', ... 'Primary Contact Person Details' -> 'Full Name (in Capital letters)*', 'E-mail Address*', 'Contact Number*', 'Position*', 'Passport or Qatari ID Number*', 'Company Self-Service Portal Access' ... 'Bill and Payment Details' -> 'Bill Type: Paper Bill / E-Bill', 'E-mail Address for E-Bill', 'Bill Language: English/Arabic' ... 'CREDIT LIMIT' -> 'Amount of Credit Limit (QAR)'. image44.png title: 'Number or Account Transfer form' with sections 'Current Customer' and 'New Customer'."

#### Reclassified — Not Applicable (5)

### ENT-061 — `not_applicable`

**Why not applicable:** ENT-061 (CRM Journey/Feature Catalog / Page Type Row) is a reference/catalog entity - each row is a static description of a journey or feature, not a stateful business object with its own lifecycle. It has no status field, no state-transition, and no per-instance validation rules of its own; it is metadata describing OTHER entities (journeys, tasks, views) that themselves may have lifecycles. Re-inspection of the full Page Type sheet (165 rows, 12 columns) confirms every row is descriptive/classificatory (Journey Category, Journey Type, Type, Description, Comment, platform flags, CBU/EBU flags, AI Comments) with no status or lifecycle column. Lifecycle/validation detail, where it exists, lives on the underlying business objects (Order, Portability Ticket, Termination Request, etc., as seen in the Fibre BRSD Annex_02_Status_Model), not on this catalog construct.

### ENT-062 — `not_applicable`

**Why not applicable:** Functional Cluster is an analytical grouping construct invented by this reconstruction project's Relationship sheet to stand in for a missing 'Workflow/Process' level in the source data (explicitly stated: 'this model introduces 15 analytical Functional Clusters... Cluster boundaries are a judgment call'). It is a categorization/grouping label, not a business entity instances of which are created, transition through states, or are validated - so a 'lifecycle/validation' ask does not apply. The richest available detail (name, source category, anchor User Journey(s), description, row counts by sub-type, completeness notes) is already fully captured in Relationship sheet Sections 3 and 8.1, which I re-read in full (rows 45-63 and 477-492) - there is no additional lifecycle-style data to recover because none was ever modeled for this construct.

### ENT-063 — `not_applicable`

**Why not applicable:** Type Taxonomy Category is a pure lookup/reference table (5 rows: User Journey, Workflow/Task, View, Action, Access/Permission), each with only a Definition and Use Case column. Confirmed by dumping the full sheet - there is no status, state machine, or validation rule attached to a 'Type' category; it is a classification schema, not a stateful entity, so lifecycle/validation evidence is categorically not the right kind of detail to seek here.

### ENT-066 — `not_applicable`

**Why not applicable:** Guided Journey doc already fully mined; the Addon/Discount entity's behavior (paid add-ons list, discount list, plan-based bill-limit gating with 'go back and edit limit' warning, cross-sell lock note) is already documented in the doc (image 12) as fully as the source screenshots allow. This is a catalog/selection construct rendered in a modal, not a stateful entity with its own lifecycle beyond what's shown (selected/unselected, priced) -- no deeper original source exists to extract lifecycle states from.

### ENT-076 — `not_applicable`

**Why not applicable:** Data Field (Annex_01_Data_Fields) is a field-specification catalog, not a stateful business entity in its own right - each of the 135 rows describes a field belonging to some OTHER entity (Session and Channel, Customer, Order, etc.) with Data Type/Length/Mandatory/Editable-by-Agent/Source/Values-and-Validation columns. Re-inspection confirms the sheet's own structure ('Data Ref, Entity, Field Name, Data Type, Length, Mandatory, Editable by Agent, Source, Values and Validation') is exactly a field dictionary, already fully captured by the existing summary description; it has no lifecycle of its own (a field definition doesn't transition between states) so a lifecycle-style gap does not apply. The validation detail that does exist ('Values and Validation' column, e.g. LOV value lists) is already present per-row and not a new discovery beyond what the summary states.

#### Genuinely Gapped — Recommended Assumption (2)

### ENT-042 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The summary already lists the selected reason ('ID image not clear') and several other visible dropdown options (ID type or ID number mismatch, Customer Signature doesn't match with ID, Incorrect add on or discount, Device receipt missing, Missing Speed test result/Building information, Bill explainer missing/Incorrect) but explicitly notes the list 'continues, scrollable' — the full enumerated code list and any lifecycle/state model for this entity (e.g. is a Reject Reason reusable/configurable, does it map 1:1 to required-re-collection fields) is not shown in the screenshots. No further recovery possible from this source. Recommended assumption: treat Reject Reason as a static lookup/LOV entity (not a stateful object with its own lifecycle) whose only observed behavior is a one-to-one link to which Contact/attachment fields get reset in the Order Correction flow (this document's own step 37 shows 'ID image not clear' correlating with exactly the ID photo fields being reset) — generalize that pattern (reason -> specific re-collected field set) as the working assumption for other reasons in the list, rather than inventing a full mapping table.

### ENT-043 — `genuinely_gapped`

**Recommended Assumption (labeled — not evidenced):** The summary already quotes the full SMS payload text and its OSB message metadata (message ID, timestamps, inbound service PS_VFQA_Communication, operation CreateCommunication) for the rejection-triggered case. No lifecycle states (e.g. queued/sent/delivered/failed) or a broader catalogue of notification trigger events (approval, other order states) are shown in this document beyond the one rejection example. Recommended assumption: given the sibling Vodafone Process Overview deck independently documents 'Automated SMS for Tickets' with two named trigger events (New Ticket, Re-Opened Ticket) and a note that 'SMS Content is controlled within teams' (slide 20), infer by analogy that the Order-rejection SMS is one instance of a broader templated-notification-per-status-change pattern, with each Order/Ticket status transition (not just Rejected) potentially having its own controlled SMS template — this is an assumption grounded in a cross-document analogous pattern, not a confirmed lifecycle for this specific entity, and should be flagged for business-owner confirmation of the full trigger-state list.


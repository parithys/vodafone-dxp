---
slug: guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/Pre to Post/Open UI Desktop_Pre to Post (Autobase).docx
sha256: a2ead353ed13b75106982011cf4f5b76bd2eee9ed5ed277b2aedbb89cef57d6e
indexed: 2026-08-20
confidence: high
---

# Open UI Desktop Pre-to-Post Migration — "Autobase" Guided Journey (system-recommended offer, single-click wizard)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, Autobase (system-recommended offer) path
**Owner / author:** not stated
**Date:** not stated in content or filename (screenshots are timestamped 13-04-2025 in the Windows taskbar clock, i.e. an April 13, 2025 test/demo session; this is UI chrome, not a document date)

## Purpose
Shows a Vodafone Qatar CRM agent how to convert an existing Prepaid customer to Postpaid using the "Autobase"/Migration Offer flow, where the system already has a pre-computed, targeted postpaid offer attached to the customer's account (sourced from the Unica campaign engine) rather than the agent manually building a new plan from scratch.

## Key content
Step-by-step narrative reconstructed from all 19 embedded screenshots, viewed in true document order:

1. **Account Summary (Customer Portal, SIS OM Account Entry Applet)** — Agent opens account "VFQMAV PHSP6211" (Account # 128769569769, Site "Passport_PHSP6211", Customer Segment "Expatriate", Primary Contact "PRADIP MAGAR", Status "Active", Pre-approved (Expatriate/Qatari) credit "1,000"). Installed Assets grid shows an active Prepaid "Mobile Service Bundle" (Service ID 97479026346) on Billing Profile 1-D7SNQ4I, plus a "Prepaid Red Promotion". Orders history already lists a prior abandoned "Post2Pre" plan-change order (1-28828906999, Complete) — i.e. this account had been round-tripped before.

2. **Scrolled Account Summary** — Billing Profile sub-view shows two profiles: 1-D7SNQ4I (Prepaid, green/active) and 1-D8DNSVY (Postpaid, red/inactive). FDO Requests grid: "No Records".

3. **Account 360 View / Account Summary tile view** — A different, higher-level "Account Summary" screen (VFQA 360 View) shows the account snapshot (Qatari ID 28852442717, DOB 06/24/1988, Email nobill@vod.com, Whitelisted). Activity Timeline lists two prior entries: "Migration to Postpay - Retail - ...eadfadfdasfasdf" (4/10/2025 03:51:40 PM) and "Migration to Postpay - Retail - ...OFFERS TESTING" (4/10/2025 02:12:54 PM) — confirming this journey/Area is literally named "Migration to Postpay" in the system. Tile counters: Orders 7, Trouble Tickets 0, Installed Assets 2, Billing Profiles 3 (Active 3). A flyout on the "Prepaid Red Promotion" asset (97479026346, Active) shows a **"Go to offer migration"** link plus **Back** / **SIM Swap** buttons — this link is the entry point into Autobase.

4. **Assets: 97479026346 (Migration Offer view, CUT Complex Asset List Applet)** — Agent lands on the "Migration Offer" tab of the Complex Asset (Mobile Service Bundle, Service Account VFQMAV PHSP6211, Site Passport_PHSP6211_Indian, price QR0.00). A **"Migration Offers"** grid (system pre-populated, 1 of 1) already lists: OfferName **"Postpaid U Start Promotion"**, OfferDescription "U Plus with 20% Discount for 6 Months + International 15", PromotionId 1-92T1KE1, PriorityCode 100.0, CampaignCode C000006358, Status **"Offered"**, TreatmentCode 1166.35d.483…, Channel "Inbound", AddOn_Monthly 15, MonthlyRental 135, OfferType "Plan Upgrade". Buttons: **Accept / Interested / Reject**. A second grid "Migration Offers Specification" lists linked Product IDs (1-3Y13UDH → 1-92TFVL9, 1-93CIJZZ → 1-JZPR). This is the core "Autobase" mechanism: the target postpaid plan is not chosen manually by the agent — it is already computed/attached by the marketing/campaign engine (Unica) and simply Accepted.

5. **Base Management wizard — "1. Contact" (step 1 of 3)** — After accepting the offer, the agent is dropped into a 3-panel accordion wizard ("1. Contact", "2. Offer Summary", "3. Activity") reached via the "Migration Offer" module tab. Step 1 initially just asks to confirm the number (97479026346) with a "Go" button.

6. **Contact confirmation** — Expands to a full contact-detail confirmation form, all fields prefilled/read-only from the customer's Qatari ID: ID "28852442717", ID Type "Qatari ID", ID Expiry "4/10/2026", Nationality "Nepalese", Gender "M", First name "PRADIP", Last name "MAGAR", Birth date "6/24/1988", Email "nobill@vod.com" (editable), Language "English". Info banner (verbatim): **"(HRN) Customer needs to pay advance payment of QR 100."** Continue/Cancel buttons.

7. **Confirmation alert** — Clicking Continue triggers a native browser alert dialog reproducing the same message verbatim: **"(HRN) Customer needs to pay advance payment of QR 100."** with an OK button.

8. **Step 2 — Offer Summary** — Step 1 collapses to "1. Contact: PRADIP MAGAR 28852442717 — Saved!". Step 2 auto-expands showing the offer terms: "Postpaid U Start Promotion", benefits listed as bullet points "20% Discount for 6 Months" and "International 15", **Bill Limit: 20** (info note: "Default Smart Limit should be communicated to the customer"), **Credit Limit: 1000**. Continue/Cancel buttons.

9. **Step 3 — Activity** — Step 2 collapses to "Saved!". Step 3 expands with: Channel dropdown defaulted to **"Appointment"**, Language dropdown (blank), Comments textarea, info note: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history." Button: **"Save and Finish"**.

10. **Comments modal** — A "Comments" popup textbox is filled with the literal text **"UNICA PRE TO POST TEST"** (the source/campaign name "UNICA" is baked into the agent's own test comment, reinforcing that this scenario is driven by a Unica-sourced campaign offer). Language field now shows "English". OK button.

11. **Submission confirmation modal** — After Save and Finish, a modal reads verbatim: **"Order request is submitted successfully. Please check installed asset of the account to confirm. (HRN) Customer needs to pay advance payment of QR 100."** Button: **"Finish Process"**. Unlike the manual/vanilla Pre-to-Post path (cart → catalog selection → quote → submit order), the Autobase wizard collects only contact confirmation + activity notes and submits the pre-built offer as a single order in one step.

12. **Backend Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet)** — Confirms server-side orchestration. The submitted job appears as row **1-D8SCUKH**, Updated 4/13/2025 02:27:21 PM, Name "97479026346-...", Status **"In Processing"**, Attrib01 97479026346, Attrib02 (promotion) 1-92T1KE1, Attrib03 (billing profile) 1-D8SB5BJ, Attrib04 **"UNICA"**, Attrib05 **"CRM"**, Attrib06 "20" (bill limit), Attrib08 treatment code "1166.35d.4…", Attrib09 **"PreToPost"**. The top job-type list shows the backend channel/bulk stages this migration chains through: ChangeMSISDNChannelOrder, ActivationChannelOrder, BILLPROFILE_CREATE_UPDATE, MigrationChannelOrder, FixedPairedActivation/ECRProcessing, ChannelUnpostedPayments, EDR_Dunn_Unbar. Sibling rows in the same grid show other real jobs of type "PostToPost" and "PreToPost" with outcomes like "Processed", or "Error" with reasons "Service already barred" / "OpenOrderExists" — i.e. this is a shared bulk-migration engine, not unique to this scenario.

13. **Account Summary — new order appears** — Back on the account, Orders grid now shows a new row: Status **"Pending"**, Order Date 4/13/2025 02:27:23 PM, **Order Sub Type "Pre2Post"**, Order # **1-28829245642**, Type "Sales Order", Order Type "Plan Change". Billing Profile grid now has 3 rows: Prepaid 1-D7SNQ4I, Postpaid 1-D8DNSVY (red/old), and new Postpaid **1-D8SB5BJ** (green/active).

14. **Order detail 1-28829245642 (initial, Status = Open)** — Order Type "Plan Change", Order Sub Type "Pre2Post", Comments **"ChannelOrderMigration"**, Billing Profile 1-D8SB5BJ / Postpaid / Bill Cycle 1, Created By "SADMIN", **Source "UNICA"**, SubChannel "CRM", Service Type "Mobile", MRC Total QR123.00, NRC Total QR0.00, Credit Limit 1,000, Priority "Medium-Open". Line Items (1-3 of 3): Update "Mobile Service Bundle" (97479026346, billing profile 1-D8SB5BJ), Delete "Prepaid Red Promotion" (billing profile 1-D7SNQ4I), Add "Postpaid U Start Promotion…" (billing profile 1-D8SB5BJ).

15. **Order detail, after backend fulfillment (Status = Complete)** — Same order refreshed: Status **"Complete"**, Fulfillment Status **"Complete"**, Status Context **"All order lines are completed"**, Priority "Medium-Complete", Status As Of 02:32:32 PM. All 3 line items show Fulfillment Status "Complete".

16. **Full Line Items outline (1-10 of 15)** — Expanding the "Mobile Service Bundle" root line reveals the full fulfillment tree, each reaching "Complete": 1.1 DOB Eligible ("SMS NOTIFICATION COMPLETE: reached"), 1.2 Mobile Voicemail, 1.3 SIM Card (ICCID 8942702400000026346, "UPDATE OSB COMPLETE: reached"), 1.4 U Start (Add), 1.5 Bill Manager (Add), 1.6 Carry_forward_charges (Add), 1.7 Bill Limit Mobile (Add), 1.8 Red (Delete, "UPDATE OSB COMPLETE: reached"), 1.9 Prepaid Welcome Add-on (Delete). Totals panel: Item Total MRC QR123.00, Net Total MRC QR123.00, Order Total (due now) QR0.00.

17. **Account Summary, final state** — Primary MSISDN field on the account header is now populated (97479026346), where it was blank at the start (step 1). Installed Assets grid lists 10 active line items all under Billing Profile 1-D8SB5BJ (Mobile Service Bundle with Promotion "Postpaid U Sta...", DOB Eligible, Mobile Voicemail, SIM Card, Bill Limit Mobile, U Start, International 15, Carry_forward_charges, Bill Manager, Postpaid U Start Promotion). Orders grid top row confirms Status "Complete" / Order Sub Type "Pre2Post" / Order # 1-28829245642 / Order Type "Plan Change". Billing Profile grid: Prepaid 1-D7SNQ4I, Postpaid 1-D8DNSVY (inactive/red), Postpaid 1-D8SB5BJ (active/green).

18. **Account Activities tab (left columns)** — New activity row (highlighted): Activity # **1-D8SCUKS**, Language English, Channel **"Appointment"**, Comments **"UNICA PRE TO POST TEST"**, Status **"Solved"**, Transaction Date 4/13/2025, Customer Segm "Expatriate", Customer Type "Residential", Area **"Migration to Po..."** (Migration to Postpay), Journey **"Start-up"**, MSISDN# 97479026346, Topic **"Automated Gui..."** (Automated Guided Journey).

19. **Account Activities tab (right columns, same row set)** — Same 3 activity rows scrolled right: Resolution Code **"Completed"**, Type **"Sales"**, Sub-Topic **"Retail - Open UI"**, Interaction Type "None", Agent ID **"KARTHIKK"** (and "SADMIN" for one system-origin row).

### What "Autobase" does differently from a manual Pre-to-Post conversion
- The target postpaid plan is **not chosen by the agent**. It arrives pre-attached to the asset as a system-generated "Migration Offer" (Status "Offered", CampaignCode C000006358, Source "UNICA") that the agent simply **Accepts** from the asset's "Migration Offer" tab.
- The agent journey collapses to a **3-step accordion wizard** (Contact → Offer Summary → Activity) instead of a manual cart/catalog/quote flow — there is no product search, no plan comparison, no manual pricing entry.
- The order that results is stamped **Source = "UNICA"**, Comments = "ChannelOrderMigration", and the backend bulk job carries **Attrib04 = "UNICA"** — traceable end-to-end back to the campaign/offer engine.
- A single **"Order request is submitted successfully"** confirmation replaces a manual submit/validate/approve sequence; the order (Order Sub Type "Pre2Post", Order Type "Plan Change") is auto-created and then progresses asynchronously through the backend Bulk Processing job queue (job type "PreToPost") to Complete.
- The resulting account Activity record is auto-tagged **Area = "Migration to Postpay"**, **Journey = "Start-up"**, **Topic = "Automated Guided Journey"**, distinguishing it from manually logged activities.

## Cross-references
- Sibling documents in the same folder (`data/Guided Journeys/Pre to Post/`): `Open UI Desktop_Pre to Post.docx` (the vanilla/manual Desktop path this Autobase variant is contrasted with), `Desktop Vanilla_Pre to Post.docx`, `Open UI Tablet_Pre to Post.docx`.
- `CRM_Journeys_Final_Updated_with_Type.xlsx`, sheet "Page Type", row #8: Journey Category "Sales", Journey Type "Prepaid to Postpaid", Type "Workflow/Task", Description "To Migrate Existing Prepaid Connection to Postpaid", Comment "Guided Journey", Guided journey Desktop = Yes, Guided journey Tablet = Yes, Desktop vanilla = Yes, CBU = Yes, EBU = No. (The inverse journey, row #22 "Postpaid to Prepaid", is Vanilla-only, no guided journey.)

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 19 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. All 19 images were legible and in a coherent, unambiguous sequence corroborated by breadcrumbs, order/activity IDs, and timestamps that progress consistently (02:27 PM through 02:36 PM on 13-04-2025 taskbar clock). No blank or ambiguous images encountered. Two screenshots (images 1–2) are earlier baseline views of the account before the migration begins, included for context/comparison with the final state (images 17–19).

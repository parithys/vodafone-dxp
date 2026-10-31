---
slug: guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/Desktop Vanilla_Indoor_Modify CPE.docx
sha256: 1eaf6ea5edaecaf1816b09f8d0c1f7ed9becc93be9b082de6ce1e1e5b08b46c0
indexed: 2026-08-20
confidence: high
---

# Modifying an FWA Indoor CPE's Serial Number via Account 360 (Desktop, Vanilla/manual path)

**Type:** Guided Journey walkthrough (step-by-step UI screenshots for field agents), Desktop, Vanilla/manual path
**Owner / author:** not stated
**Date:** not stated in content or filename

## Purpose
Shows a CSR/agent how to manually modify an installed FWA (Fixed Wireless Access) Indoor CPE asset's attributes — specifically correcting the Indoor Unit Serial Number — on a customer account in the Vodafone Open UI Customer Portal, from locating the installed asset through order submission and completion.

## Key content
1. **Customer Portal / Account Summary** — Account "VFQMAV FWA_ID_Test1" (Account # 129720765430, Site "Passport_MJN0202_", Account Class "Customer", Account Type "Residential", Customer Segment "Expatriate", Status "Active", Primary MSISDN 97441202296). A promo lookup flyout in the top-right shows "GigaHome 5G Classic New Indoor FWA Promo" (97441202296, Active) with "Back" / "SIM Swap" buttons. The "Installed Assets" grid (1-3 of 3) lists: FMS CPE Bundle (Service ID 129720765944, Billing Profile 1-DNIZ5EH, GigaHome 5G..., Active), GigaHome 5G Classic New Indoor FWA Promotion (Active), and FMS Service Bundle (97441202296, Active). Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP. The Orders panel shows an existing completed order 1-29720765477 (Sales Order, Activation, Complete, 9/2/2025).

2. **Selecting the asset to modify** — The agent selects the "FMS CPE Bundle" row (highlighted with a red outline) in Installed Assets and clicks the **Modify** button; a tooltip confirms the action as "Installed Assets:Modify".

3. **FMS CPE Bundle modify screen — Equipment tab** — Opens the bundle detail page (Save/Cancel/Done/Finish It/Verify buttons across the top, Save and Finish It greyed out initially). Pricing summary: Your Price QR0.00, Total NRC QR0.00, Total MRC QR0.00. Under "Details" > **Equipment** section, subsection "FMS CPE IDU ODU" lists three selectable items: **FMS CPE Indoor IDU** (checked, with an info icon and a blue gear "Customize" icon), FMS CPE ODU (unchecked), FMS CPE Outdoor IDU (unchecked).

4. **FMS CPE Indoor IDU — Details (before edit)** — Drilling into "FMS CPE Indoor IDU" (via the gear/customize icon) opens its own Details form showing the currently installed CPE's attributes:
   - IPTV Service Id: (blank)
   - Indoor Unit CPE Model: `Huawei_B2368-66`
   - Indoor Unit MAC Address: `84AA9C9FC121`
   - Indoor Unit Serial Number: `S180P18055021`
   - VoIP Number: `97441202296`
   Also shows collapsed "Linked Item" and "Resource" sections below.

5. **Editing the Indoor Unit Serial Number** — The agent clicks into the "Indoor Unit Serial Number" field (shown selected/highlighted with a red outline) and changes the value from `S180P18055021` to **`S180P18055020`** (last digit 1 → 0). All other fields (IPTV Service Id, CPE Model, MAC Address, VoIP Number) remain unchanged.

6. **New Sales Order generated** — Proceeding creates a new order: Order # **1-29737237878**, Revision 1, Type "Sales Order", Order Type **"Modification"**, Account "VFQMAV FWA_I...", Site "Passport_MJN0202_", Billing Profile "1-DNIZ5EH" (Postpaid, Bill Cycle 15), Primary MSISDN 97441202296, Created By "KARTHIKK", Organization "Default Organiza...", Source "CRM", Requested Date 10/8/2025. Initial **Status: "Pending"**, Priority "Medium-Pending". Order toolbar: Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation (greyed), Generate Activity Plans, Cancel Order.

7. **Order Line Items / Attributes — change audit** — On the order's **Line Items > Attributes** tab, the line item tree shows Outline 1 "FMS CPE Bundle" (Service Id 129720765944) with child line 1.1 "FMS CPE Indoor IDU" (Service Id 129720765944). The "Line Item Attributes" grid (1-5 of 5) for this line lists each attribute with Name / Value / Action / Description / Data Type:
   - IPTV Service Id: (blank) — Action "-"
   - Indoor Unit C[PE Model]: `Huawei_B2368-66` — Action "-"
   - Indoor Unit M[AC Address]: `84AA9C9FC121` — Action "-"
   - **Indoor Unit Se[rial Number]: Value `S180P18055020`, Action "Update", Description `S180P18055021`** (i.e., Description column preserves the prior/original value while Value holds the new one) — Data Type "Text"
   - VoIP Number: `97441202296` — Action "-"
   This confirms the system recorded the serial-number change as a discrete "Update" action against the FMS CPE Indoor IDU line item, old value `S180P18055021` → new value `S180P18055020`.

8. **Order progresses to Open** — After further processing, the order (still 1-29737237878) shows **Status: "Open"**, Priority "Medium-Open", Status As Of updated to 03:55, Credit Limit populated as "1,000", Service Type "Fixed Line". The **Submit** button is now active/highlighted (red), while Drop Order and MOI Validation remain disabled.

9. **Order completes** — Final screen shows the same order with **Status: "Complete"**, Fulfillment Status "Complete", Priority "Medium-Complete", and **Status Context: "All order lines are completed"**. Totals remain QR0.00 (Total, MRC Total, NRC Total) consistent with a no-charge attribute-only modification.

**End state:** The FWA Indoor CPE's serial number is corrected from `S180P18055021` to `S180P18055020` via a Modification-type Sales Order (1-29737237878) that runs through Pending → Open → Complete, with the attribute-level change tracked as an "Update" action on the FMS CPE Indoor IDU line item.

## Cross-references
- Sibling Guided Journey docs likely exist in the same `data/Guided Journeys/FWA/` folder (e.g., other Desktop/Tablet, Vanilla/guided-wizard variants for FWA Indoor/Outdoor CPE install, disconnect, or swap flows) — not opened as part of this pass.
- May correspond to a "Modify CPE" or "Update FWA Equipment" row in `CRM_Journeys_Final_Updated_with_Type.xlsx` under the FWA/Desktop/Vanilla journey family; not cross-checked in this pass.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 9 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass. Image reading order matched the numeric filename order (image1.png … image9.png) as confirmed by parsing `r:embed` reference order in `word/document.xml` against `word/_rels/document.xml.rels`. All 9 images were clear, legible, and unambiguous — no blank, corrupted, or indecipherable screenshots encountered. The flow is coherent end-to-end (asset selection → field edit → order creation → attribute-level audit trail → order completion), so no gaps in the narrative.

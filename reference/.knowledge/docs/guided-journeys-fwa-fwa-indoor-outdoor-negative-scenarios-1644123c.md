---
slug: guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Guided Journeys/FWA/FWA_Indoor & Outdoor_Negative Scenarios.docx
sha256: d161dde6e8b1ecbf30c6fbc306442fb12da032999afc4ed6bad04bcccccf68eb
indexed: 2026-08-20
confidence: high
---

# FWA Indoor & Outdoor Negative Scenarios — Address, SIM/CPE (UIM) and Supplementary Form Validation Errors

**Type:** Guided Journey walkthrough (negative/error scenario catalogue with UI screenshots), Desktop/Tablet
**Owner / author:** not stated
**Date:** not stated in content or filename

## Purpose
Documents the validation and error-handling behavior encountered while activating an FWA (Fixed Wireless Access) Indoor/Outdoor order in the CRM's Open UI — specifically what happens on the Address step, the SIM/CPE (UIM inventory) validation step, and the CAF/Supplementary Form step when required data is missing, malformed, or fails backend inventory checks. Screens are drawn from two related order flows: "New FWA Tablet" (a Sales Order menu journey) and "New FWA" / "FWA Postpaid" (a Business/Static Data journey with a slightly different menu bar), both hitting the same backend host `10.162.53.100:4443`.

## Key content

1. **Address step — all required fields blank ("New FWA Tablet" journey).** On step "2. Address" with Zone, Street No., Building No., Apt/Flat/Unit, and Area all empty, clicking **Save Address** produces a modal dialog:
   > "Please enter required fields
   > Zone, Street No., Building No., Apt/Flat/Unit.,Area"
   Dialog has an OK button; Go back / Cancel are also available on the page.

2. **Address step — non-numeric Building No.** Zone=45, Street No.=56, Building No.="67K" (contains a letter), Apt/Flat/Unit=78B, Area=Al Rayyan. Submitting triggers a native browser alert from `10.162.53.100:4443`:
   > "Please enter an numeric Building No. of 5 characters or less."

3. **Address step — Street No. too long.** Street No. changed to "5666666" (7 numeric characters, over the 5-character limit); Building No. corrected to "67". Triggers the same style of native alert:
   > "Please enter an numeric Street No. of 5 characters or less."

4. **Address step — blank fields with Skip option ("New FWA" / "FWA Postpaid Business" journey).** Same empty-field scenario as #1 but in the Business/Static Data menu variant (breadcrumb "FWA Postpaid - Address:"), while a "Processing, please wait..." spinner is shown next to Save Address. The modal here offers an escape hatch not present in the Tablet flow:
   > "Please enter required fields
   > Zone, Street No., Building No., Apt/Flat/Unit, Area
   > or click Skip Address to proceed without Saving Address."

5. **SIM Serial step — both fields left blank.** On step "6. SIM Serial" (breadcrumb "FWA Postpaid - SIM Serial:"), after Number Selection is saved (number 97441202300), leaving SIM Serial and CPE Serial Number blank and clicking Continue produces an inline red banner under the form:
   > "Please enter a valid SIM Serial before pressing 'Continue'."

6. **SIM Serial step — SIM not found in inventory (UIM).** SIM Serial "8842702800801190300" and CPE Serial Number "S180P18055028" both entered and green-checked (client-side format valid), Number Selection = 97441224346. On Continue, a native alert reports a backend UIM lookup failure:
   > "SIM Card does not exist in UIM(SBL-EXL-00151)"

7. **SIM Serial step — SIM Serial wrong length.** SIM Serial entered as "894270280080119030" (18 digits). An inline field-level error appears next to the SIM Serial box:
   > "Error: SIM Serial # must be 19 digits."
   The stale bottom banner "Please enter a valid SIM Serial before pressing 'Continue'." remains visible underneath.

8. **SIM Serial step — validation in progress.** SIM Serial corrected to the 19-digit value "8942702800801190300"; CPE Serial Number "S180P1805502" is green-checked. An orange spinner labeled "Validating Order, please wait..." appears next to the SIM Serial field while the system calls out to backend services; a stale banner "Please enter a valid CPE Serial before pressing 'Continue'." is still showing underneath at this intermediate moment.

9. **SIM Serial step — SIM already assigned in UIM.** With Number Selection = 97441202302, SIM Serial "8942702800801190300" and CPE Serial Number "S180P18055027" both green-checked, clicking Continue returns a native alert:
   > "SIM Card already assigned in UIM(SBL-EXL-00151)"
   (Same UIM error code SBL-EXL-00151 as scenario 6, but a different condition/message — "already assigned" vs. "does not exist".)

10. **SIM Serial step — CPE not free in UIM, raw backend exception surfaced to user.** With Number Selection = 97441202302, SIM Serial "8942702800801190302", CPE Serial Number "S180P18055025" (green-checked, "Validating Order, please wait..." spinner active), Continue returns a native alert exposing an unhandled backend exception trace:
    > "Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162)
    > CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)
    > Please Contact the System Administrator with Reference # 1-DNODWJU.(SBL-EXL-00151)"
    This includes two distinct error/service codes (SBL-BPR-00162 for the error-handling service invocation itself, SBL-EXL-00151 for the underlying UIM/CPE-not-free condition) and a support reference number format "1-DNODWJU".

11. **CAF & Additional Attachments step — mandatory Supplementary Form not selected.** On step "8. CAF & Additional Attachments" (breadcrumb "CAF:", "New FWA Tablet" journey), after SIM Serial and Book Appointment steps show "Saved!", the CAF document tile is green-checked/uploaded but the "Supplementary Form" tile (marked mandatory with a red asterisk, alongside "Add File") is still empty/greyed out. Clicking Continue produces an inline banner:
    > "Error: Please select Supplementary Form before continuing."
    Page actions available at this point: Continue, Abandon Order, Go Back.

## Cross-references
- Companion happy-path walkthroughs in the same Guided Journeys/FWA folder: `Desktop Vanilla_FWA_Indoor`, `Desktop Vanilla_FWA_Outdoor_WFM`, `Desktop Vanilla_Indoor_Modify CPE`, and the Open UI Desktop/Tablet FWA Indoor/Outdoor docs (`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md`, `guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md`, `guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md`, `guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md`, `guided-journeys-fwa-open-ui-tablet-fwa-indoor-without-approv-1a874ad1.md`, `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md`, `guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md`). This document is the negative/exception-path counterpart, showing what happens when the same Address, SIM/CPE, and CAF/Supplementary Form steps in those flows are given invalid or missing data.
- The "Mandatory Supplementary form" scenario (#11) corresponds to a GigaHome Subscription Acceptance Form / Vodafone Fibre Supplementary Form requirement referenced elsewhere in this FWA document batch — required customer-signed documentation for 5G Home/FWA activation.
- The UIM inventory errors (scenarios 6, 9, 10 — error code SBL-EXL-00151) reflect backend Unified Inventory Management validation of SIM and CPE serials; likely correspond to the "New FWA," "New FWA Tablet," and CPE-modification rows in `CRM_Journeys_Final_Updated_with_Type.xlsx` in this batch.

## Extraction notes
Confidence upgraded from low on 2026-08-20. Recovered by direct visual inspection of all 11 embedded screenshots (docx media extraction + multimodal image reading), superseding the original text-only extraction pass which recovered only field labels with no error text. All 11 images were legible and showed clear, complete error dialogs/banners with readable field values; no images were ambiguous or blank. Two distinct order-entry journeys are interleaved in the screenshots (a "New FWA Tablet" Sales Order flow and a "New FWA"/"FWA Postpaid Business" flow with a different top navigation bar) — both are documented above with their respective breadcrumbs noted, since the document does not explicitly separate them into labeled sections beyond the original field-label headings (Address Step, UIM Inventory errors, Invalid CPE, Assigned SIM/CPE, Mandatory Supplementary form) recovered in the prior pass.

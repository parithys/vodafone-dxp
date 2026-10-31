"""Generate Validation_Integration.xlsx.

Regenerate with: python3 reference/scripts/build_mobile_postpaid_reference.py
(run from anywhere - paths resolve relative to this script's location.)

WHAT THIS WORKBOOK IS, AND HOW IT DIFFERS FROM THE PERSONA MATRIX
-----------------------------------------------------------------
reference/scripts/build_persona_feature_matrix.py parses the app's own source
on every run, so that workbook cannot drift: change the code and the next run
tells the truth automatically.

This one is NOT that. It is a curated, point-in-time review of the Mobile
Postpaid Activation journey, transcribed from reading the implementation on
2026-09-24. Every row carries a file:line citation so any claim can be
re-checked, but the rows themselves are prose that a parser cannot regenerate:
"what the agent sees when this fails" is not a value sitting in a variable.

Practical consequence: after changing the journey, this workbook is STALE until
someone re-reviews and edits the tables below. It records where it was accurate
as of, in the Start Here sheet. Do not treat a green cell here the way you would
treat one in the persona matrix.

House rules followed:
  - No em dash characters anywhere in the output (project directive,
    2026-09-24). Only the plain hyphen is used.
  - "not implemented" is written where the code does not do the thing, rather
    than leaving a blank that reads as unknown.
"""

from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

OUT = Path(__file__).resolve().parents[1] / "outputs" / "Validation_Integration.xlsx"

VF_RED = "E60000"
HDR_BG = "313131"
ZEBRA = "F5F7F9"
WARN_BG = "FFF8E1"
GAP_BG = "FFF0F0"

HDR_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
BODY_FONT = Font(name="Calibri", size=10)
BOLD = Font(name="Calibri", size=10, bold=True)
TITLE = Font(name="Calibri", size=16, bold=True, color=VF_RED)
THIN = Side(style="thin", color="E0E0E0")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(vertical="top", wrap_text=True)


def sheet(wb, title, headers, rows, widths, highlight=None):
    """One table per sheet: styled header, zebra body, frozen header row."""
    ws = wb.create_sheet(title)
    for i, h in enumerate(headers, start=1):
        c = ws.cell(row=1, column=i, value=h)
        c.font = HDR_FONT
        c.fill = PatternFill("solid", fgColor=HDR_BG)
        c.alignment = WRAP
        c.border = BORDER
    for r, row in enumerate(rows, start=2):
        for i, val in enumerate(row, start=1):
            c = ws.cell(row=r, column=i, value=val)
            c.font = BODY_FONT
            c.alignment = WRAP
            c.border = BORDER
            fill = highlight(row) if highlight else None
            if fill:
                c.fill = PatternFill("solid", fgColor=fill)
            elif r % 2 == 0:
                c.fill = PatternFill("solid", fgColor=ZEBRA)
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(rows) + 1}"
    return ws


# ---------------------------------------------------------------- Start Here
def start_here(wb):
    ws = wb.create_sheet("Start Here")
    ws.column_dimensions["A"].width = 30
    ws.column_dimensions["B"].width = 118
    ws["A1"] = "VFQ DXP - Mobile Postpaid Activation"
    ws["A1"].font = TITLE
    ws.merge_cells("A1:B1")

    lines = [
        ("What this covers",
         "Every implemented behaviour of the New Postpaid Activation journey: the guided wizard "
         "(originally src/modules/mobile-postpaid/screens/NewPostpaidWizard.tsx, since deleted: New Postpaid Activation now runs in "
         "src/modules/new-connection/NewConnectionWizard.tsx, flow 'new'), the 20-plus step and leaf components it "
         "renders, the rules it evaluates, the data it reads and writes, who can reach it, and what happens when "
         "things fail."),
        ("Accurate as of",
         "2026-09-24. Reviewed against the working tree on branch audit-remediation/2026-08-24-1305. Code citations were "
         "re-pointed on 2026-10-05 after the refactor (files split, moved and renamed) - but the prose was NOT re-reviewed, "
         "so rows marked below may describe behaviour that has since changed."),
        ("Generated or curated",
         "CURATED, not parsed. Unlike Persona_Feature_Applicability_Matrix_Reference.xlsx, this workbook "
         "does not re-derive itself from source. It is a transcription of a code review, so it goes stale the "
         "moment the journey changes. Re-review before trusting it after any edit to the journey."),
        ("Regenerate",
         "python3 reference/scripts/build_mobile_postpaid_reference.py - edits belong in that script, never in the "
         "xlsx, or the next run discards them."),
        ("Citations",
         "Every non-obvious row cites file:line. Citations were refreshed 2026-10-05 by matching each cited line to the same "
         "text in the current source; a citation that now points at a different file was re-pointed. Suffixes: "
         "[not re-verified] = the cited code was rewritten or moved so the line could not be matched with confidence (the "
         "2026-09-24 line number is kept, treat as stale); [step removed ...] / [file deleted ...] = what the row describes is no "
         "longer in the app. The file path and the quoted text remain the reliable anchors."),
        ("Evidence policy",
         "Where the code does not implement something the UI implies, the cell says 'not implemented' rather than "
         "being left blank. Blank means not applicable. This follows the project's evidence-over-inference rule: an "
         "empty cell is never a guess."),
        ("Important caveat",
         "There is no backend. Every 'integration' is a read over seeded JSON in public/mock-data/, held in memory "
         "for the session. The single write in the entire journey is one 'orders' record. See the Data Access and "
         "Status Transitions sheets before drawing conclusions about system behaviour."),
        ("Sheet guide",
         "Journey Steps (the 12 steps and their gates) | Fields (every control) | Business Rules (BR-xxx actually "
         "evaluated) | Validations (non-BR helpers) | Actions and Responses | Status Transitions | Integrations | "
         "Data Access | Roles and Personas | Error Handling | Recent Changes | Open Items"),
    ]
    r = 3
    for k, v in lines:
        ws.cell(row=r, column=1, value=k).font = BOLD
        ws.cell(row=r, column=1).alignment = WRAP
        c = ws.cell(row=r, column=2, value=v)
        c.font = BODY_FONT
        c.alignment = WRAP
        ws.row_dimensions[r].height = max(30, 13 * (len(v) // 110 + 1))
        r += 1
    return ws


# --------------------------------------------------------------- Journey Steps
STEPS = [
    ("1", "contact", "Contact", "GuidedContactStep -> IdLookupStep -> QidInput + QidImageUpload",
     "Boolean(c?.moiResult && hasIdentityDetails(c ?? {}) && isValidEmail(c?.email) && isValidAltPhone(c?.altPhone))",
     "An MOI lookup must have resolved, First/Last/Gender/Nationality must be non-blank, DOB must be a real "
     "calendar date, email must be shape-valid and the mobile number valid.", "NewPostpaidWizard.tsx:138-141 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("2", "eligibility", "Eligibility (Blacklist, line cap & HRN)", "EligibilityGateStep",
     "(values.eligibility as EligibilityResult)?.pass === true",
     "Hard gate. pass = blacklist.pass && lineCap.pass. No inputs; read-only result rows.",
     "NewPostpaidWizard.tsx:151 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("3", "address", "Address", "ZsbAddressStep + ZsbConflictNotice", "() => true",
     "Never blocks. Mandatory: No per FLD-523-526, matching the evidenced Skip Address affordance.",
     "NewPostpaidWizard.tsx:167-168 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("4", "billing", "Billing", "BillingProfileStep", "() => true",
     "Never blocks; every field has a default. Only paymentMethod is read downstream.",
     "NewPostpaidWizard.tsx:179 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("5", "plan", "Plan & Add-ons", "PostpaidPlanAddonsStep + AddonsPicker + BillLimitEditor",
     "Boolean(values.productId) && values.billLimitPass !== false",
     "A plan is required. Note '!== false': an untouched bill limit passes, only an explicitly applied "
     "below-minimum value blocks.", "NewPostpaidWizard.tsx:200 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("6", "number", "Number Selection", "MsisdnPicker", "Boolean(values.msisdn)",
     "Any MSISDN selected from the tiles or reserved manually.", "NewPostpaidWizard.tsx:214 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("7", "device", "Device & DOI", "DeviceInstallmentStep",
     "if (!doi) return true; return Boolean(doi.doiRead) && Boolean(doi.doiAccepted)",
     "SIM-only passes freely. Once a device is picked, both DOI consent checkboxes must be ticked (BR-114).",
     "NewPostpaidWizard.tsx:230-235 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("8", "simType", "SIM Type", "SimTypeStep + SimSerialScanner",
     "Physical -> simValid === true; eSIM -> esimIssued === true; neither -> false",
     "The only branch-dependent gate in the journey.", "NewPostpaidWizard.tsx:250-255 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("9", "checkout", "Checkout", "CheckoutSummaryStep", "() => true",
     "Read-only review screen, never blocks.", "NewPostpaidWizard.tsx:279 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("10", "caf", "CAF & Signature", "CafSignatureCapture + Drawer + SignaturePad",
     "if (!c?.cafType) return false; return c.cafType !== 'Digital' || Boolean(c.signatureDataUrl)",
     "A CAF type is mandatory. A signature is required ONLY for Digital - Manual and Touch Screen pass on "
     "selection alone with nothing captured.", "NewPostpaidWizard.tsx:291-295 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("11", "payment", "Payment", "WinCashPaymentStep",
     "Boolean((values.payment as WinCashPaymentValue)?.paid)",
     "Payment must have succeeded. A declined payment keeps Continue blocked.", "NewPostpaidWizard.tsx:313 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("12", "activity", "Activity", "ActivityCommentsStep -> Textarea",
     "Boolean((values.comments as string)?.trim())",
     "A non-whitespace comment is mandatory and gates Save & Finish.", "NewPostpaidWizard.tsx:321 [file deleted; journey now in NewConnectionWizard.tsx]"),
]

# ----------------------------------------------------------------------- Fields
FIELDS = [
    ("1 Contact", "ID Type", "4 icon choice cards: Qatar ID (QID) / Passport / GCC ID / Diplomatic ID",
     "Pre-selected QID", "", "", "QidInput.tsx:93-96"),
    ("1 Contact", "<type> Number (label switches per type)", "Text + inline Fetch button", "Yes (gates Fetch)",
     "Placeholder per type: e.g. 28456701234 / e.g. P0998812 / e.g. 784202312345678 / e.g. DIP-QA-004521",
     "No MOI record found for this ID - try again.", "IdLookupStep.tsx:156 [not re-verified]"),
    ("1 Contact", "QID Front / QID Back", "Two Scan buttons -> Scanned badge",
     "Rendered only when idType is QID; NOT in isValid", "", "", "IdLookupStep.tsx:167-172 [not re-verified]"),
    ("1 Contact", "First Name", "Text", "Yes", "Prefilled from MOI (name split on first whitespace)", "",
     "GuidedContactStep.tsx:115"),
    ("1 Contact", "Last Name", "Text", "Yes", "Prefilled from MOI (remainder of name)", "",
     "GuidedContactStep.tsx:222 [not re-verified]"),
    ("1 Contact", "Alternate phone #", "PhoneNumberInput: country-code combobox + national digits", "Yes",
     "Stores E.164; displays 4+rest grouping; national cap 15 - (dial length - 1)",
     "Please enter a valid mobile number.", "GuidedContactStep.tsx:313-331"),
    ("1 Contact", "Email Address", "Text, type=email", "Yes", "Prefilled from MOI, editable",
     "Please enter a valid email address.", "GuidedContactStep.tsx:253 [not re-verified]"),
    ("1 Contact", "Date of Birth", "Text, inputMode=numeric, maxLength=10", "Yes",
     "Progressive DD/MM/YYYY mask, digits only. Helper: 'Digits only - the slashes are added for you.'",
     "Enter a real date, e.g. 10/10/2000. (fires only at length 10)", "GuidedContactStep.tsx:229-233"),
    ("1 Contact", "Gender", "Radio group in a real fieldset/legend: Male / Female", "Yes",
     "No MOI source, nothing preselected", "", "GuidedContactStep.tsx:277-299 [not re-verified]"),
    ("1 Contact", "Nationality", "Text, placeholder e.g. Qatari", "Yes", "Prefilled from MOI", "",
     "GuidedContactStep.tsx:374"),
    ("1 Contact", "Digital Lead / Sale", "Checkbox (boolean)", "No", "Was a Yes/No Select before 2026-09-24", "",
     "GuidedContactStep.tsx:332 [not re-verified]"),
    ("1 Contact", "B2B2C Order", "Checkbox", "No", "Drives approval routing at submit", "",
     "GuidedContactStep.tsx:341 [not re-verified]"),
    ("1 Contact", "Company Name (B2B2C)", "Text", "No", "Rendered only when B2B2C is checked; cleared on untick",
     "", "GuidedContactStep.tsx:344 [not re-verified]"),
    ("3 Address", "Zone / Street No. / Building No. / Apt-Flat-Unit", "Four text inputs", "No (never gates)",
     "All four disabled and locked when fetchedFromMoi. Helper: 'Fetched from MOI - not editable.'", "",
     "ZsbAddressStep.tsx:105 [not re-verified]"),
    ("4 Billing", "Language", "Select: English / Arabic", "No (defaults ENG)", "Read by nothing downstream", "",
     "BillingProfileStep.tsx:23"),
    ("4 Billing", "Payment Type", "Display-only div, disabled styling", "Not a control",
     "Fixed value 'Postpaid'", "", "BillingProfileStep.tsx:30-33 [not re-verified]"),
    ("4 Billing", "Payment Method", "Select: Invoice / AutoPay", "No (defaults Invoice)",
     "The only Billing field read downstream (Checkout 'Billing' row)", "", "BillingProfileStep.tsx:36"),
    ("4 Billing", "Bill Media", "Select: Email / Paper", "No (defaults Email)", "Read by nothing downstream", "",
     "BillingProfileStep.tsx:14-17"),
    ("5 Plan", "RED Plan tier", "Radio cards from products.json (type = Postpaid Plan), sorted by mrcQAR",
     "Yes", "Shows name, POPULAR badge, QAR n/mo, Data/Voice/Speed. Null dataAllowanceGB renders 'Unlimited'.",
     "", "PostpaidPlanAddonsStep.tsx:143"),
    ("5 Plan", "Credit Limit", "Read-only disabled box", "Not a control",
     "Caption: 'Derived from the eligibility check (BR-076) - not amendable.'", "",
     "PostpaidPlanAddonsStep.tsx:159 [not re-verified]"),
    ("5 Plan", "Eligible Discounts", "Radio group incl. an explicit 'No discount' option", "No",
     "Filtered to discounts whose planId matches the selected plan. Percentage shown as round(price*100)%.",
     "", "PostpaidPlanAddonsStep.tsx:87 [not re-verified]"),
    ("5 Plan", "Add-ons", "Checkbox list from products.json (type = Add-on)", "No",
     "Whole block returns null when no add-on products exist", "", "AddonsPicker.tsx:24-27 [not re-verified]"),
    ("5 Plan", "Bill Limit (Mobile)", "Edit -> minus 50 / numeric / plus 50 / Apply", "No",
     "product='Mobile' is hard-coded, so the Agent Minimum is always 50; the Mobile Plus value of 75 is never "
     "used in this journey. NaN input returns early with no feedback. Minus below zero clamps at 0.",
     "Entries above the Agent Minimum value (QR 50) allow the journey to proceed - QR n is below it.",
     "BillLimitEditor.tsx:37-49"),
    ("6 Number", "Free Number / Star Number (Premium)", "Two tabs filtering on category", "Defaults to Free",
     "", "", "MsisdnPicker.tsx:41 [not re-verified]"),
    ("6 Number", "Search 8-digit number", "Text, substring match", "No", "No mask", "", "MsisdnPicker.tsx:41 [not re-verified]"),
    ("6 Number", "Number tiles", "Buttons per numbers.json row", "One selection required",
     "BLOCKED tiles are disabled at 40% opacity. Only AVAILABLE and Reserved are selectable.", "",
     "MsisdnPicker.tsx:88-94 [not re-verified]"),
    ("6 Number", "Custom MSISDN", "Text, placeholder +974 XXXX XXXX", "No",
     "Validated against /^\\+974[3567]\\d{7}$/ after stripping spaces and hyphens. An unknown number is priced "
     "at 0.",
     "Enter a full international format MSISDN (e.g. +974 3300 1234). / <msisdn> is already <status> - choose a "
     "different number.", "MsisdnPicker.tsx:26-57 [not re-verified]"),
    ("7 Device", "SIM only card", "Button, selected when value is undefined", "Default state",
     "Choosing it discards the entire DOI selection including both consents", "",
     "DeviceInstallmentStep.tsx:108-119 [step removed 2026-09-27]"),
    ("7 Device", "Device cards", "Buttons per distinct deviceName in device-installments.json", "Optional",
     "De-duplicated by name. Picking one resets the DoiSelection and forces both consents back to false.", "",
     "DeviceInstallmentStep.tsx:79-82 [step removed 2026-09-27]"),
    ("7 Device", "Colour / Storage", "Selects", "Default to option [0]", "", "", "DeviceInstallmentStep.tsx:108 [step removed 2026-09-27]"),
    ("7 Device", "IMEI", "Text, placeholder '15-digit IMEI'", "No",
     "NOT VALIDATED AT ALL - no length check, no numeric mask, no error, not in isValid", "",
     "DeviceInstallmentStep.tsx:232-237 [step removed 2026-09-27]"),
    ("7 Device", "Instalment term", "Three chips: 6 / 12 / 24 months", "Defaults to the catalogue row",
     "Recomputes monthly = round((devicePrice - downPayment) / months); downPayment unchanged", "",
     "DeviceInstallmentStep.tsx:122-125 [step removed 2026-09-27]"),
    ("7 Device", "Handover method", "Two cards: Store pickup / Courier delivery", "Defaults to Store pickup",
     "", "", "DeviceInstallmentStep.tsx:290 [step removed 2026-09-27]"),
    ("7 Device", "DOI terms read to customer", "Checkbox", "Yes when a device is selected",
     "Sub-label: 'Agent confirms the terms were read aloud in the customer's preferred language.'", "",
     "DeviceInstallmentStep.tsx:330 [step removed 2026-09-27]"),
    ("7 Device", "Customer accepts the declaration", "Checkbox", "Yes when a device is selected",
     "Sub-label: 'Recorded against the tracking record and CAF.'", "", "DeviceInstallmentStep.tsx:342 [step removed 2026-09-27]"),
    ("8 SIM Type", "Physical / eSIM tabs", "Two buttons", "Yes, nothing preselected",
     "Switching tab WIPES the whole value object, so a validated serial or issued eSIM code is lost on a tab "
     "bounce", "Choose Physical or eSIM to continue.", "SimTypeStep.tsx:55, :94 [not re-verified]"),
    ("8 SIM Type", "SIM Serial Number (Physical)", "Text, validated on blur", "Yes",
     "Typing re-invalidates on every keystroke, so Continue re-blocks while editing",
     "SIM Serial is required. / SIM Serial not found in inventory. / This SIM is already assigned.",
     "SimSerialScanner.tsx:79-147"),
    ("8 SIM Type", "Generate eSIM (eSIM)", "Button", "Yes",
     "500ms artificial delay, then writes esimIssued and a mock LPA activation code", "",
     "SimTypeStep.tsx:56-59"),
    ("10 CAF", "CAF Type", "Three icon cards: CAF-Digital / CAF-Manual / CAF-Touch Screen", "Yes",
     "Nothing preselected", "", "CafSignatureCapture.tsx:54 [not re-verified]"),
    ("10 CAF", "Signature", "Please Sign button -> Drawer with SignaturePad", "Yes for Digital only",
     "Stores a data-URL. Manual and Touch Screen capture nothing.", "", "CafSignatureCapture.tsx:58 [not re-verified]"),
    ("11 Payment", "Process Payment via WinCash", "Primary button", "Yes",
     "Reads 'Processing via WinCash...' during a 500ms delay", "", "WinCashPaymentStep.tsx:40 [not re-verified]"),
    ("11 Payment", "Simulate decline (test)", "Plain text button, hides after a decline", "No",
     "Stands in for a real POS decline", "", "WinCashPaymentStep.tsx:25-27 [not re-verified]"),
    ("12 Activity", "Comments", "Textarea, placeholder 'Enter comments...'", "Yes (gates Save & Finish)",
     "No required marker rendered - Textarea has no required prop, so the asterisk Contact's fields carry is "
     "absent here", "", "ActivityCommentsStep.tsx:8-12"),
]

# ---------------------------------------------------------------- Business rules
RULES = [
    ("BR-113", "Blacklist / collection status", "ruleEngine.ts:149", "EligibilityGateStep.tsx:82, :130 [not re-verified]",
     "Passes unless the customer row's blacklisted flag is true",
     "Blacklisted (<reason or 'reason not recorded'>) - postpaid activation is blocked. Escalate to "
     "Risk/Collections; no agent override.", "HARD GATE"),
    ("BR-288", "Postpaid mobile line cap", "ruleEngine.ts:165", "EligibilityGateStep.tsx:91, :139 [not re-verified]",
     "Qatari nationality passes unconditionally. Otherwise cap 2: passes if activePostpaidLines < 2",
     "Qatari: 'Qatari nationals have no line cap (BR-110).' Under cap: 'n/2 postpaid mobile lines used (expat "
     "cap, BR-288).' At cap: 'Expat QID cap of 2 postpaid mobile lines reached (BR-288 ...). Overriding requires "
     "an authorized-officer role flag on the account (BR-111), not an in-journey bypass.'", "HARD GATE"),
    ("BR-187", "HRN advance payment", "ruleEngine.ts:300", "EligibilityGateStep.tsx:172, eligibilityRowsModel.ts:66",
     "Returns pass=true in BOTH branches; only the message varies on the HRN flag. Never reads plan context, "
     "per BR-112",
     "HRN customer - QR 100 advance payment required at checkout (BR-187/194/252); routes to manager approval "
     "(BR-268) rather than auto-completing.", "Informational"),
    ("BR-076", "Default credit limit by HRN flag", "ruleEngine.ts:315", "EligibilityGateStep.tsx:97, :142 [not re-verified]",
     "QR 50 if HRN, QR 1000 otherwise. Always pass=true. The amount is ALSO re-derived independently at the "
     "call site (EligibilityGateStep.tsx:179) rather than read from the rule",
     "Default credit limit: QR <50 or 1000> on a new account (BR-076).", "Informational"),
    ("BR-AGENT-MIN-THRESHOLD", "Bill / Smart Limit floor (cited in code as BR-226 Mobile 50 / BR-227 Mobile "
     "Plus 75)", "ruleEngine.ts:43", "BillLimitEditor.tsx:37, :42",
     "Passes if limitAmount >= the product's Agent Minimum",
     "Entries above the Agent Minimum value (QR 50) allow the journey to proceed - QR n is below it.",
     "HARD GATE"),
    ("BR-ZSB-MANDATORY-FOR-MOBILE", "ZSB address requirement", "ruleEngine.ts:96",
     "ZsbConflictNotice.tsx:11 [file removed] via ZsbAddressStep.tsx:79 [not re-verified]",
     "Computes nothing. Constant pass=true carrying a fixed conflict advisory",
     "Unresolved: Consumer Activation Process Manual v8.0 requires ZSB for mobile; a Day 7 workshop says it is "
     "FWA/fixed-only. Not blocking here - the evidenced screen marks these fields Mandatory: No with a Skip "
     "Address option - but confirm with COPS & Digital / Customer Data Management before treating this as final.",
     "Informational by design"),
    ("BR-114", "DOI declaration read and accepted", "not implemented in ruleEngine.ts",
     "NewPostpaidWizard.tsx:229-235 [file deleted; journey now in NewConnectionWizard.tsx] (inline predicate)",
     "Enforced as a two-checkbox inline gate. evaluateRule is never called, so this hard gate carries no rule "
     "message and is invisible to any coverage audit of ruleEngine.ts",
     "Referenced as label text only: 'Confirms the customer understands the instalment term, monthly payments, "
     "and early-settlement terms (BR-114).'", "HARD GATE (not rule-engine backed)"),
    ("BR-268", "HRN / credit-limit variant routes to manager approval",
     "not implemented in ruleEngine.ts", "NewPostpaidWizard.tsx:341-351 [file deleted; journey now in NewConnectionWizard.tsx] (comment + inline boolean)",
     "pendingApproval = Boolean(contact.isB2B2C) || Boolean(eligibility?.requiresHrnAdvance)",
     "No message. Cited only in a code comment.", "Behavioural (drives order status)"),
]

VALIDATIONS = [
    ("isValidAltPhone", "GuidedContactStep.tsx:67 [not re-verified]",
     "Strips non-digits. Passes if EITHER an 8-digit Qatar mobile with a 3/5/6/7 leading digit (optionally "
     "+974-prefixed) OR a generic international number of 8 to 15 digits. Empty is false.",
     "Please enter a valid mobile number.", "HARD GATE",
     "Deliberately broader than the evidence: field-inventory says 'must be a local mobile number', but a "
     "postpaid customer may only have a foreign number on file, so Qatar-only was judged too restrictive."),
    ("isValidEmail", "guidedContactModel.ts:170",
     "One @, no whitespace, dot-led TLD of 2+ letters, on the trimmed value. Empty is false.",
     "Please enter a valid email address.", "HARD GATE",
     "A shape check, not RFC 5322. Over-strict email regexes reject valid addresses and nothing here can "
     "confirm deliverability."),
    ("isValidDob", "guidedContactModel.ts:201",
     "Requires exact DD/MM/YYYY; month 1-12; day within the real day count for that month and year "
     "(leap-aware); rejects future dates; rejects an implied age over 120.",
     "Enter a real date, e.g. 10/10/2000.", "HARD GATE via hasIdentityDetails",
     "31/02/2000 matches the mask but is not a day. Error fires only at length 10 so it does not nag "
     "mid-typing."),
    ("hasIdentityDetails", "guidedContactModel.ts:219",
     "True only if firstName, lastName, gender and nationality are non-blank after trim AND isValidDob(dob) "
     "passes.", "None of its own - surfaced as per-field asterisks plus a disabled Continue", "HARD GATE",
     "Trimmed, because a space is not a name."),
    ("formatDobInput", "guidedContactModel.ts:183",
     "Transform, not a validator. Strips non-digits, truncates to 8, re-inserts slashes after positions 2 and 4. "
     "Rebuilds from digits rather than appending.", "Helper text: 'Digits only - the slashes are added for you.'",
     "Transform only",
     "Rebuilding from digits is what lets backspace delete through a slash instead of stalling."),
    ("isoToMaskedDob", "guidedContactModel.ts:193",
     "Converts MOI's YYYY-MM-DD to DD/MM/YYYY. Anything not in that exact ISO shape passes through untouched.",
     "", "Load-bearing helper",
     "Without it the MOI-prefilled DOB would fail isValidDob and block Continue for exactly the customers the "
     "registry DID find."),
    ("MSISDN format check", "MsisdnPicker.tsx:26 [not re-verified]",
     "/^\\+974[3567]\\d{7}$/ after stripping spaces and hyphens, for the Custom MSISDN field only.",
     "Enter a full international format MSISDN (e.g. +974 3300 1234).", "Gates the Reserve button", ""),
    ("SIM serial inventory check", "SimSerialScanner.tsx:80-113",
     "On blur, matches the serial against sims.json. stockStatus 'Issued' is rejected as already assigned.",
     "SIM Serial is required. / SIM Serial not found in inventory. / This SIM is already assigned.",
     "HARD GATE (Physical branch)", "Typing re-invalidates on every keystroke."),
]

ACTIONS = [
    ("1 Contact", "Click Fetch, or press Enter in the number field",
     "runMoiValidation(): list('identity-documents') matched on documentNumber, then list('customers') on "
     "customerId. Writes moiResult {name, dob, nationality, email}. Button reads 'Fetching...' in flight.",
     "IdLookupStep.tsx:89-111 [not re-verified]"),
    ("1 Contact", "MOI resolves",
     "Green panel with an 'MOI Validated' badge and 'Registry details prefilled into the fields below - review "
     "and correct before continuing.' identityFromMoi splits name on first whitespace, converts ISO dob to "
     "DD/MM/YYYY and seeds nationality and email. Gender is never seeded.",
     "GuidedContactStep.tsx:165-179 [not re-verified]"),
    ("1 Contact", "Scan both QID sides",
     "Auto-fires runMoiValidation() with no Fetch click, guarded by a ref keyed on the number so a corrected "
     "digit can retry but a complete-scan state cannot re-fire on every render.",
     "IdLookupStep.tsx:124-139 [not re-verified]"),
    ("1 Contact", "Edit the ID number",
     "moiResult and notFound cleared immediately; the identity fields are re-derived, i.e. wiped.",
     "IdLookupStep.tsx:150-153 [not re-verified]"),
    ("1 Contact", "Switch ID Type",
     "Clears idNumber, moiResult and qidScans; KEEPS altPhone; focuses the number input. Re-clicking the current "
     "type is a deliberate no-op.", "IdLookupStep.tsx:90-165"),
    ("3 Address", "Arrive as a Qatari customer with an idNumber",
     "Auto-lookup: 'Checking for an address on file...' then the Primary + active address row overwrites all "
     "four fields and locks them. The Save and Skip buttons disappear entirely.", "ZsbAddressStep.tsx:115-171"),
    ("3 Address", "Click Save Address",
     "onChange(value) - a no-op re-emit of the current value. No confirmation, no toast, no state change.",
     "ZsbAddressStep.tsx:118-120 [not re-verified]"),
    ("3 Address", "Click Skip Address",
     "Sets skipped=true and DISCARDS any typed address fields. Swaps to a single 'Enter Address' button which "
     "restores an empty grid.", "ZsbAddressStep.tsx:121-123 [not re-verified]"),
    ("5 Plan", "Select a plan",
     "Writes productId, refetches plan-scoped discounts, reveals the Live Cart Total bar.",
     "PostpaidPlanAddonsStep.tsx:75-96 [not re-verified]"),
    ("5 Plan", "Select a discount",
     "Live Cart Total recomputes as round(mrcQAR * (1 + discount.price) + addonsMonthly). price is a negative "
     "fraction.", "PostpaidPlanAddonsStep.tsx:94-96 [not re-verified]"),
    ("5 Plan", "Apply a bill limit",
     "Evaluates BR-AGENT-MIN-THRESHOLD, writes billLimit and billLimitPass, closes the editor.",
     "BillLimitEditor.tsx:39-44"),
    ("6 Number", "Click an enabled tile",
     "Writes msisdn and numberPriceQAR. Shows 'SUCCESS: Reservation Token: SBL-EXL-<last 5 digits>' - a string "
     "template only; NO record is reserved.", "MsisdnPicker.tsx:108-112 [not re-verified]"),
    ("7 Device", "Pick a device",
     "The whole DoiSelection is reset from the catalogue row and both consents are forced back to false.",
     "DeviceInstallmentStep.tsx:108-119 [step removed 2026-09-27]"),
    ("8 SIM Type", "Generate eSIM",
     "500ms delay, then writes esimIssued=true and esimActivationCode = LPA:1$smdp.vodafone.qa$<16 random "
     "chars>. Shows an 'eSIM issued' badge and 'An eSIM activation QR code will be generated and sent to "
     "<email>.' The QR is deliberately NOT shown here.", "SimTypeStep.tsx:56-59, :122-136"),
    ("11 Payment", "Payment succeeds",
     "Writes {paid:true, declined:false, reference:'WC-<last 8 digits of Date.now()>'}. Shows a Paid badge and "
     "the reference.", "WinCashPaymentStep.tsx:99-110"),
    ("11 Payment", "Payment declines",
     "Writes {paid:false, declined:true}. Danger card: 'WinCash declined the authorization. Retry the same "
     "amount, or use Abandon Order above to cancel - abandoning releases the SIM reservation.' Note: no "
     "reservation is actually released because none was ever taken.", "WinCashPaymentStep.tsx:131-159"),
    ("12 Activity", "Click Save & Finish",
     "Runs onSubmit: reads products and discounts, computes totals, creates ONE orders record, sets "
     "confirmedOrder which replaces the wizard with the confirmation screen.", "NewPostpaidWizard.tsx:330-370 [file deleted; journey now in NewConnectionWizard.tsx]"),
    ("Any step", "Click Abandon Order",
     "Modal 'Abandon this order?' / 'This will discard everything entered in this order so far. This cannot be "
     "undone.' with Cancel and Discard order. Discard clears the draft and navigates to /mobile-postpaid.",
     "GuidedActivationWizard.tsx:306-348 [not re-verified]"),
    ("Confirmation", "Send to email (eSIM orders only)",
     "500ms delay, then the ONLY toast in the entire journey: 'eSIM activation details sent to <email>.' plus "
     "inline confirmation. State is local and deliberately not persisted.", "EsimActivationPanel.tsx:33-37 [not re-verified]"),
]

TRANSITIONS = [
    ("orders", "createRecord", "status", "(new record) -> 'Submitted for Approval' OR 'Complete'",
     "pendingApproval = Boolean(contact.isB2B2C) || Boolean(eligibility?.requiresHrnAdvance). Cited as BR-268.",
     "NewPostpaidWizard.tsx:341-370 [file deleted; journey now in NewConnectionWizard.tsx]", "Implemented"),
    ("orders", "createRecord", "orderSubType", "(new record) -> 'B2B2C' | 'HRN' | 'Consumer'", "",
     "NewPostpaidWizard.tsx:350 [file deleted; journey now in NewConnectionWizard.tsx]", "Implemented"),
    ("numbers", "none", "status", "no transition",
     "The selected MSISDN's status stays as seeded, despite the on-screen 'SUCCESS: Reservation Token'.",
     "MsisdnPicker.tsx:108-112 [not re-verified]", "NOT IMPLEMENTED"),
    ("sims", "none", "stockStatus", "no transition",
     "The validated serial is never flipped to 'Issued'.", "SimSerialScanner.tsx:30 [not re-verified]", "NOT IMPLEMENTED"),
    ("order-approvals", "none", "-", "no record created",
     "No approval task is created for the 'Submitted for Approval' branch.", "NewPostpaidWizard.tsx:347 [file deleted; journey now in NewConnectionWizard.tsx]",
     "NOT IMPLEMENTED"),
    ("caf-forms", "none", "-", "no record created",
     "The signature data-URL is discarded with the draft.", "CafSignatureCapture.tsx", "NOT IMPLEMENTED"),
    ("customer-activities", "none", "-", "no record created",
     "No activity record, despite ActivityCommentsStep citing Pattern 13 'logging an Account Activities "
     "record'. The comment text is absent from the orders payload too.", "ActivityCommentsStep.tsx:8-12",
     "NOT IMPLEMENTED"),
    ("payments", "none", "-", "no record created",
     "The WinCash reference is discarded and never reaches the order.", "WinCashPaymentStep.tsx:40 [not re-verified]",
     "NOT IMPLEMENTED"),
    ("addresses / billing-profiles", "none", "-", "no record written",
     "The Address and Billing steps' values are never persisted.", "ZsbAddressStep.tsx, BillingProfileStep.tsx",
     "NOT IMPLEMENTED"),
    ("customers", "none", "-", "no create or update",
     "The journey is read-only against the customer record.", "-", "NOT IMPLEMENTED"),
]

INTEGRATIONS = [
    ("Backend as a whole", "Simulated", "mockDataEngine.ts:1",
     "'Simulates a backend entirely in the browser (frontend-architecture.md section 7).'"),
    ("Database", "Simulated", "entityStore.ts:14-16",
     "'The database - IndexedDB-backed in a full build; this in-memory-per-session version keeps the demo "
     "dependency-light while preserving the same engine boundary.'"),
    ("MOI national registry", "Simulated by JSON lookup", "IdLookupStep.tsx:35, :89-111 [not re-verified]",
     "Pattern 2 QID/Kahramaa ID Scan + MOI Validation, implemented as list('identity-documents') then "
     "list('customers'). No comment labels it simulated; it simply resolves against seed JSON."),
    ("Kahramaa / ZSB address registry", "Simulated by JSON lookup", "ZsbAddressStep.tsx:19-23, :52-58 [not re-verified]",
     "'a Qatari ID is already tied to a Kahramaa-linked address record on file' - implemented as a "
     "list('addresses') lookup filtered to Primary + active."),
    ("SM-DP+ / eSIM provisioning", "Simulated, explicitly", "SimTypeStep.tsx:22-24, :38 [not re-verified]",
     "'Mock GSMA SGP.22-style activation string (LPA:1$smdp-address$matching-id) - not a real SM-DP+ call' and "
     "'kept deliberately lightweight (no fabricated eSIM provisioning API)'."),
    ("WinCash / POS", "Simulated, explicitly", "WinCashPaymentStep.tsx:25-27 [not re-verified]",
     "'A real POS's decline path is not reproducible client-side, so Simulate Decline stands in for a genuinely "
     "failed authorization - Retry re-attempts the same amount.'"),
    ("ID document scanner", "Simulated, explicitly", "QidImageUpload.tsx:16-17 [not re-verified]",
     "'no real file I/O in a front-end-only app, so scanning is simulated with a button per side, matching the "
     "mandatory-gating shape evidenced elsewhere (Pattern 12)'."),
    ("UIM / SIM inventory", "Simulated by JSON lookup", "SimSerialScanner.tsx:15-18, :30 [not re-verified]",
     "Pattern 11 'barcode-scan input validated against UIM/inventory in real time' - implemented as a "
     "list('sims') lookup."),
    ("Email delivery (eSIM handover)", "Simulated", "EsimActivationPanel.tsx:33-37 [not re-verified]",
     "setTimeout(500) then a success toast. No comment labels it simulated."),
    ("Qnomy queue", "Out of scope for this journey", "NewPostpaidWizard.tsx:54-55 [file deleted; journey now in NewConnectionWizard.tsx]",
     "'(Queue Token/ID Scan are pre-wizard; this covers ID Scan's MOI result onward)'. Qnomy is handled in the "
     "app shell (SessionReferenceNumbers), not here."),
    ("WFM", "not implemented", "-",
     "No reference anywhere in this journey path. wfm-activities is a seeded entity but is not read here."),
    ("CRM / billing / provisioning systems", "not implemented", "-",
     "No integration exists. The single orders record is the whole downstream footprint."),
]

DATA_ACCESS = [
    ("Boot-time seeding", "mockDataEngine.ts:4-67",
     "seedMockData() issues one fetch('/mock-data/<name>.json') per entry in a fixed 84-name SEED_FILES array "
     "and holds the parsed arrays in a module-level store. A failed fetch silently yields an empty array. These "
     "are static-asset fetches, not API calls."),
    ("Reads", "mockDataEngine.ts:37-42, :71",
     "list(kind) / get(kind, id) return slices of the in-memory store behind an artificial 200-600ms delay. "
     "Calling list before seeding throws 'Mock data not seeded yet - call seedMockData() during app boot.'"),
    ("Writes", "mockDataEngine.ts:45-48",
     "create pushes onto the in-memory array; update does an index-find-and-merge on a derived id field (first "
     "key matching /Id$/). Nothing is written to disk; a reload discards everything."),
    ("Store layer", "entityStore.ts:27-53",
     "entityStore (zustand) mirrors created and updated records into React state so screens re-render."),
    ("Wizard draft", "workflowStore.ts:74",
     "Draft values persist in sessionStorage under key 'vfq-workflow-store' - cleared on tab close. "
     "maxStepReached never decreases."),
    ("Config", "configEngine.ts, personaEngine.ts",
     "public/config/*.json (routes, personas, feature catalogue, business rules, design tokens) read at boot."),
    ("Layering violation", "entityStore.ts:16",
     "The stated rule is 'components never call mockDataEngine directly'. Every step component in this journey "
     "violates it - they all import mockDataEngine directly. Only the final orders write goes through "
     "entityStore."),
    ("JSON files this journey reads", "public/mock-data/",
     "identity-documents.json, customers.json, addresses.json, products.json, addons-discounts.json, "
     "numbers.json, device-installments.json, sims.json"),
    ("JSON entities this journey writes", "in-memory only", "orders"),
]

ROLES = [
    ("ROLE-01", "Retail Sales", "VFQ12341", "Create",
     "Restriction recorded in personas.json:29: 'Smart Limit / Bill Limit editable only down to the Agent "
     "Minimum Value'. NOT enforced per-role in code - BillLimitEditor applies the same floor to everyone."),
    ("ROLE-02", "Telesales", "VFQ12342", "Create", ""),
    ("ROLE-04", "Field Sales", "VFQ12344", "Create", ""),
    ("ROLE-05", "Mass Market", "VFQ12345", "Create", ""),
    ("ROLE-12", "Premium", "VFQ12352", "Create", ""),
    ("Other 21 roles", "Not granted", "-", "-",
     "Blank means deliberately not granted, per the project's exhaustive grant model. Manager/Approver, "
     "Fulfilment, MNP, Billing and View Only roles cannot see this journey."),
]

ERRORS = [
    ("1 Contact", "ID number not in identity-documents.json",
     "Inline field error: 'No MOI record found for this ID - try again.' Continue stays blocked.",
     "Retype the number, or switch ID type.", "IdLookupStep.tsx:156 [not re-verified]"),
    ("1 Contact", "Document row found but the customer row is missing",
     "NOTHING IS SHOWN. setLoading(false) runs and no result appears - the agent sees the spinner stop with no "
     "explanation.", "None. Continue stays blocked with no message.", "IdLookupStep.tsx:103-110 [not re-verified]"),
    ("2 Eligibility", "Contact step not completed",
     "'Complete the Contact step first - eligibility depends on the validated identity.'", "Go back to step 1.",
     "EligibilityGateStep.tsx:121 [not re-verified]"),
    ("2 Eligibility", "No customer record resolvable for the identity",
     "Red text: 'No customer record found for this identity - cannot evaluate eligibility.' onResult(undefined) "
     "leaves Continue permanently blocked.", "None on this step - the agent must go back.",
     "EligibilityGateStep.tsx:301"),
    ("2 Eligibility", "Customer is blacklisted",
     "Danger row with BR-113's message, plus footer 'This customer is not eligible for a new postpaid "
     "activation - Continue is blocked.'", "None by design - 'no agent override'.",
     "EligibilityGateStep.tsx:200-204 [not re-verified]"),
    ("2 Eligibility", "Expat line cap reached",
     "Danger row with BR-288's message naming BR-111 as the override path.",
     "None in-journey by design - requires an authorized-officer role flag on the account.",
     "ruleEngine.ts:138-148 [not re-verified]"),
    ("3 Address", "Identity doc or address not found",
     "Silent: setFetching(false) and manual entry stays open.", "Type the address manually, or Skip Address.",
     "ZsbAddressStep.tsx:115-171"),
    ("5 Plan", "Empty product catalogue",
     "'No Postpaid Plan products in the mock catalogue.'", "None - the step cannot be completed.",
     "PostpaidPlanAddonsStep.tsx:143"),
    ("5 Plan", "Bill limit below the Agent Minimum",
     "Danger text under the editor with BR-AGENT-MIN-THRESHOLD's message. Continue blocks.",
     "Raise the limit to 50 or above, or leave it untouched (untouched passes).", "BillLimitEditor.tsx:37-44"),
    ("5 Plan", "Non-numeric bill limit entered",
     "Nothing at all - Apply returns early with no feedback.", "Re-enter a number.",
     "BillLimitEditor.tsx:39-44"),
    ("6 Number", "Custom MSISDN malformed",
     "'Enter a full international format MSISDN (e.g. +974 3300 1234).' Reserve button stays disabled.",
     "Correct the format.", "MsisdnPicker.tsx:135"),
    ("6 Number", "Custom MSISDN already taken",
     "'<msisdn> is already <status> - choose a different number.'", "Choose another number.",
     "MsisdnPicker.tsx:141"),
    ("8 SIM Type", "Serial not in inventory / already assigned",
     "'SIM Serial not found in inventory.' / 'This SIM is already assigned.' Continue blocks.",
     "Scan a different SIM.", "SimSerialScanner.tsx:80-97"),
    ("8 SIM Type", "Tab bounced after validating",
     "The whole SIM value object is wiped, so a validated serial or issued eSIM code is silently lost and "
     "Continue re-blocks.", "Re-scan or re-generate.", "SimTypeStep.tsx:55 [not re-verified]"),
    ("11 Payment", "WinCash declines",
     "Danger card with a 'Payment declined' badge and 'WinCash declined the authorization. Retry the same "
     "amount, or use Abandon Order above to cancel...'", "Retry Payment, or Abandon Order.",
     "WinCashPaymentStep.tsx:131-159"),
    ("Shell", "Rapid double click on Save & Finish",
     "Guarded. A submittingRef plus submitting state blocks the second call.",
     "n/a - fixed. Comment records it was 'Confirmed live: a rapid double click produced two orders with the "
     "same ID and fields.'", "GuidedActivationWizard.tsx:71-72, :456-464"),
    ("Shell", "Unimplemented rule id referenced",
     "Fails OPEN with a console.warn and a visible message '(dev mode: allowing by default)'.",
     "By design, so gaps stay visible during development.", "ruleEngine.ts:342-346"),
]

CHANGES = [
    ("Mobile Postpaid visual re-skin", "COMMITTED 319e1fa",
     "tokens.css, index.css, Badge, Button, Sidebar, NavFlyout, PersonaSwitcher, Breadcrumbs, GlobalSearch, "
     "+9 more",
     "Light palette repointed at the supplied 2026-09-24 asset. White nav rail with a solid-red active row, "
     "outlined status pills (4px corner, no dot), flat buttons, 12px field radius, new --nav-*/--info/"
     "--accent-disabled tokens. Also fixed 17 tinted panels that mixed toward the literal keyword 'white' and "
     "were invisible in dark mode."),
    ("Choice-card selected state to brand red", "COMMITTED 7ebbf08",
     "tokens.css + 11 card components incl. QidInput, PostpaidPlanAddonsStep, MsisdnPicker, "
     "DeviceInstallmentStep, SimTypeStep",
     "New --field-card-selected #e60000 / --field-card-selected-bg #fef9f9. Deliberately NOT --field-selected, "
     "so the checkbox/radio accent stays #c09696 where both sit inside one card. Ships with a stated "
     "verification gap: 10 of the 11 components were never rendered during checking."),
    ("Guided wizard full content width", "COMMITTED bf51f74", "GuidedActivationWizard.tsx",
     "Removed the max-w-5xl cap. Affects all seven journeys built on this wizard, not just postpaid."),
    ("Contact step overhaul", "UNCOMMITTED",
     "GuidedContactStep.tsx, Input.tsx, Select.tsx, PhoneNumberInput.tsx, NewPostpaidWizard.tsx + 3 other "
     "wizards",
     "First/Last Name, DOB, Gender, Nationality added as agent-editable MANDATORY fields prefilled from MOI. "
     "This reverses the supplied asset's 'MOI Registry Records (Read Only)' rule on explicit direction. Email "
     "made editable and mandatory (the old disabled field made the gate unsatisfiable when MOI carried no "
     "email). Alternate phone marked mandatory. DOB auto-masks 10102000 to 10/10/2000. Gender is a radio group "
     "in a real fieldset/legend. Preferred Language removed. Digital Lead/Sale is now a boolean checkbox."),
    ("Required-field marker", "UNCOMMITTED", "Input.tsx, Select.tsx, PhoneNumberInput.tsx",
     "First asterisk marker in the app, with aria-required. Mandatory had until now been expressed only by a "
     "disabled Continue. Also fixed: the error message had no id and was referenced by nothing, so an invalid "
     "field announced no reason."),
    ("QID front/back scan with auto-fetch", "UNCOMMITTED", "IdLookupStep.tsx",
     "Reuses the existing QidImageUpload. QID only - the other three types have no evidenced reverse capture. "
     "Completing both scans auto-fires the MOI lookup; the Fetch button stays as a retry. Scans clear on ID-type "
     "switch so a QID scan cannot satisfy a Passport journey."),
    ("Phone country-code dropdown", "UNCOMMITTED", "PhoneNumberInput.tsx, countryDialCodes.ts (new)",
     "65-country combobox inside the field's left edge, GCC first. Stored value stays E.164. Restores "
     "international entry, which a fixed +974 prefix had briefly removed."),
    ("eSIM QR moved to the confirmation screen", "UNCOMMITTED",
     "SimTypeStep.tsx, EsimActivationPanel.tsx (new), OrderConfirmationScreen.tsx, NewPostpaidWizard.tsx",
     "The QR sat on SIM Type, four steps before submission, so a customer could install an eSIM for an order "
     "later abandoned at Payment. Now on the confirmation screen via a generic handoverPanel slot."),
    ("Eligibility: Non-HRN as its own row", "UNCOMMITTED", "EligibilityGateStep.tsx, ruleEngine.ts",
     "The HRN classification now renders either way. It previously showed only for HRN customers, with the "
     "non-HRN case buried in BR-076's parenthetical. The new wording drops the old 'expat' claim, which "
     "contradicted the Qatari nationality shown one row above."),
    ("Checkout summary rows", "UNCOMMITTED", "CheckoutSummaryStep.tsx, NewPostpaidWizard.tsx",
     "Added ID, Mobile, Billing and an always-present Add-ons row (showing 'None' when empty, because an absent "
     "row reads as an unanswered question). Add-ons collapsed from N rows to one."),
    ("App-wide em dash to hyphen", "UNCOMMITTED", "190 files across src/ and public/",
     "832 replacements. Reaches user-visible strings and rule messages, not just comments. Only U+2014 was "
     "replaced; U+2013 en dashes survive in ID ranges such as FLD-523-526."),
]

OPEN_ITEMS = [
    ("Working tree is uncommitted", "High",
     "Six of the ten recent enhancements, including the entire Contact step overhaul and the eSIM handover, "
     "exist only as uncommitted edits plus two untracked files. A bad checkout loses all of it."),
    ("Non-text contrast regression", "High",
     "--field-border dropped to 1.32:1 against SC 1.4.11's 3:1 requirement (from 1.79:1). --border-soft is "
     "1.16:1 and the new pill borders 1.39-1.73:1. These are the supplied asset's literal values; the fix is a "
     "product decision, documented rather than silently corrected. The new required asterisks and error borders "
     "lean on those same tokens."),
    ("Persona gating is visibility only", "High",
     "ScreenRouteResolver performs no persona check. Any signed-in role that types or bookmarks the URL reaches "
     "the full 12-step wizard and can submit an order. ROLE-01's Bill Limit restriction is recorded in "
     "personas.json but enforced nowhere in the wizard."),
    ("Most status transitions are not implemented", "High",
     "The journey writes exactly one orders record. No MSISDN reservation, SIM issuance, approval task, CAF "
     "record, activity log or payment record is created, despite the UI implying all of them."),
    ("Checkout total omits the discount", "Medium",
     "CheckoutSummaryStep's monthlyRecurringQar excludes the selected discount while onSubmit applies it, so "
     "the Checkout figure and the order/confirmation figure differ whenever a discount is chosen. The "
     "checkoutTotals value written to the draft is read by nothing."),
    ("BR-114 and BR-268 have no rule-engine entry", "Medium",
     "Both are enforced or asserted inline and cited only in comments, so they carry no rule message and are "
     "invisible to any coverage audit of ruleEngine.ts."),
    ("IMEI is completely unvalidated", "Medium",
     "No length check, no numeric mask, no error, not in isValid - any string is accepted onto the order."),
    ("Activity comment is mandatory but discarded", "Medium",
     "The step gates Save & Finish on a non-blank comment, then never writes it anywhere."),
    ("Two stale code comments", "Low",
     "IdLookupStep.tsx:76-83 still asserts the read-only identity restriction that the Contact overhaul "
     "reversed. GuidedActivationWizard's focus comment still cites the MOI email as 'not editable'."),
    ("Checkout 'Mobile' row is the alternate number", "Low",
     "It shows contact.altPhone, not the MSISDN being provisioned, on a screen the agent reads back to the "
     "customer, next to a separate 'Number' row."),
    ("Eligibility rules evaluate twice", "Low",
     "Once in the effect for the result and once inline for the render."),
    ("Address and Billing values are inert", "Low",
     "language and billMedia are stored in the draft and read by nothing. The captured address is never "
     "persisted or attached to the order."),
]


def main():
    wb = Workbook()
    wb.remove(wb.active)

    start_here(wb)

    sheet(wb, "Journey Steps",
          ["#", "Step key", "Label", "Component(s)", "isValid gate (verbatim)", "In plain terms", "Citation"],
          STEPS, [5, 14, 30, 44, 60, 60, 30])

    sheet(wb, "Fields",
          ["Step", "Field", "Control", "Mandatory", "Mask / format / notes", "Inline validation text",
           "Citation"],
          FIELDS, [14, 30, 38, 24, 58, 50, 30])

    sheet(wb, "Business Rules",
          ["Rule id", "What it governs", "Implementation", "Call site", "What it computes", "Message text",
           "Gate?"],
          RULES, [26, 32, 26, 34, 50, 70, 22],
          highlight=lambda r: WARN_BG if "not implemented" in r[2] else None)

    sheet(wb, "Validations",
          ["Helper", "Location", "Rule in plain words", "User-facing error text", "Gate?", "Why it is this way"],
          VALIDATIONS, [24, 30, 60, 46, 26, 60])

    sheet(wb, "Actions and Responses", ["Step", "User action", "System response", "Citation"],
          ACTIONS, [14, 38, 82, 30])

    sheet(wb, "Status Transitions",
          ["Entity", "Operation", "Field", "From -> To", "Notes", "Citation", "State"],
          TRANSITIONS, [22, 14, 16, 40, 56, 32, 18],
          highlight=lambda r: GAP_BG if r[6] == "NOT IMPLEMENTED" else None)

    sheet(wb, "Integrations", ["External system", "Status", "Evidence location", "Quoted evidence"],
          INTEGRATIONS, [30, 26, 34, 80])

    sheet(wb, "Data Access", ["Layer", "Location", "How it works"], DATA_ACCESS, [26, 30, 96])

    sheet(wb, "Roles and Personas", ["Role id", "Role name", "Staff ID", "Level", "Notes"],
          ROLES, [14, 28, 14, 12, 74])

    sheet(wb, "Error Handling", ["Step", "Scenario", "What the user sees", "Recovery", "Citation"],
          ERRORS, [14, 38, 66, 40, 30])

    sheet(wb, "Recent Changes", ["Enhancement", "State", "Files", "What and why"],
          CHANGES, [34, 20, 44, 92],
          highlight=lambda r: WARN_BG if r[1] == "UNCOMMITTED" else None)

    sheet(wb, "Open Items", ["Item", "Severity", "Detail"], OPEN_ITEMS, [38, 12, 96],
          highlight=lambda r: GAP_BG if r[1] == "High" else None)

    wb.save(OUT)

    from format_xlsx import format_file  # house format: header row, borders, Tenorite 14, no gridlines

    format_file(OUT)

    # Guard: the project forbids the em dash, including in generated artefacts.
    bad = [
        (ws.title, c.coordinate)
        for ws in wb.worksheets
        for row in ws.iter_rows()
        for c in row
        if isinstance(c.value, str) and "—" in c.value
    ]
    if bad:
        raise SystemExit(f"em dash found in generated workbook: {bad[:5]}")

    print(f"wrote {OUT}")
    print(f"sheets: {', '.join(ws.title for ws in wb.worksheets)}")


if __name__ == "__main__":
    main()

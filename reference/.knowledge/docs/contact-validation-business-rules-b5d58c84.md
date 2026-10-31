---
slug: contact-validation-business-rules-b5d58c84
source: /Users/parithimalsaravanan/claude-projects/vfq/data/Contact Validation Business Rules.xlsx
sha256: 682bd79c3674ea9f06ad4f23c651d3c88b2eaf4c9568e626bee563dfe3006d92
indexed: 2026-08-20
confidence: high
---

# Contact Validation Business Rules

**Type:** data extract (Excel workbook — flat list of field-validation error messages)
**Owner / author:** not stated
**Date:** not stated in content; file indexed 2026-08-20

## Purpose
Enumerates the validation error/prompt messages shown to users when contact-record fields (name, ID, phone, email, nationality, etc.) fail validation in the CRM system — effectively a catalog of contact-data-entry business rules expressed as their resulting error text, rather than as formally coded rule IDs.

## Key content
Workbook has 1 sheet ("Sheet1"), single column header "Validaiton Message" [sic, contains the source spreadsheet's typo], listing 40 rows of validation messages (some appear twice, e.g. "Please enter a valid 11-digit ID number," "Enter a Cellular Phone# that starts with '974'," "Cellular Phone# must be of 11 digits," "Enter a valid Cellular Phone #," "Email format entered is incorrect...") with no rule IDs, condition logic, or field-mapping columns — only the message text itself. Categories of rules implied by the messages (interpretation, not stated as headers):
- **Mandatory-field checks:** First Name, Last Name, Nationality, Email, ID Type, ID Number, ID Expiration Date, Preferred language, Birth Date, Alternate/Cellular Phone #, Gender.
- **Format/length checks:** Email format ("abc@xyz.com" pattern); Cellular/Work Phone # must start with "974" and be 11 digits; Passport must be 4–20 alphanumeric characters (no non-alphanumeric characters); GCC ID must be 8–20 numeric characters; Business ID must be 3–20 characters, numeric and "/" only.
- **Cross-field/logic checks:** ID Expiration Date must be in the future; Date of Birth and Qatari ID "do not match" (implies an embedded-DOB validation against QID number); Qatari ID must be an 11-digit numeric value; contact age under 18 flagged.
- **Authorization checks:** "You are not authorized to create Safwa Contact"; "You are not authorized to create Qatari Contact" (listed twice).

## Cross-references
- Directly relevant to the Applicant details sections of the Consumer Postpaid CAF (V4) and Consumer Prepaid CAF (V2) PDF templates in this batch — the mandatory/format fields these messages validate (Name, QID, Passport, GCC ID, Email, Nationality, Cellular Phone, Birth Date) map directly to fields on those CAF forms.
- Likely a companion to the "Order Validation Business Rules.xlsx" file referenced elsewhere in the source data set (not part of this batch) — together they would form the validation-rule catalog for the CRM contact/order creation journeys listed in the CRM Journeys inventory (e.g., "Updating Contacts," "MOI Validation" journey rows).

## Extraction notes
None — openpyxl extraction succeeded cleanly (1,697 chars, single flat column, no complex structure to lose). Note for searchability: the sheet contains no rule ID column, so these messages cannot be cross-referenced by ID — only by message text.

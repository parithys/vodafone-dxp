# Field Inventory (Phase 13)

Every field identified across screens/forms in the guided-journey screenshots, customer forms, and process docs, grouped by the screen/form it appears on. Fields are grouped under free-text screen names as extracted (cross-reference against `screens.md`'s SCR-xxx catalogue by name; exact ID mapping was not forced to avoid mis-linking similarly-named but distinct screens).

**Canonical items:** 1043 (from 1047 raw extracted mentions)

**Confidence:** high 904 · medium 138 · low 1
**Classification:** Explicit 1028 · Inferred 14 · Assumed 1

Every item cites its source document slug(s) and evidence quote(s); open `.knowledge/docs/<slug>.md` for full context per `CLAUDE.md`.

---

## Postpaid CAF - Section 1 Applicant Details (19 fields)

### FLD-157: Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Date*, Retailer ID, Customer type, Name*, Date of birth*, Qatar ID number*...”

### FLD-158: Retailer ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Date*, Retailer ID, Customer type...”

### FLD-159: Customer type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Retailer ID, Customer type, Name*”

### FLD-160: Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Name*, Date of birth*, Qatar ID number*”

### FLD-161: Date of birth
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Date of birth*, Qatar ID number*, VAT Registration Number”

### FLD-162: Qatar ID number
`Explicit` · confidence: `high`

- **Technical name:** QID
- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Qatar ID number*, VAT Registration Number, Expiry date*”

### FLD-163: VAT Registration Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Qatar ID number*, VAT Registration Number, Expiry date*”

### FLD-164: Expiry date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Expiry date*, Passport number, Nationality*”

### FLD-165: Passport number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Expiry date*, Passport number, Nationality*”

### FLD-166: Nationality
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Passport number, Nationality*, Issuing country”

### FLD-167: Issuing country
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Nationality*, Issuing country, Visa number”

### FLD-168: Visa number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Issuing country, Visa number, Email*”

### FLD-169: Email
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Visa number, Email*, PO Box*”

### FLD-170: PO Box
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Email*, PO Box*, Kahramaa ID*”

### FLD-171: Kahramaa ID
`Explicit` · confidence: `high`

- **Technical name:** KID
- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “PO Box*, Kahramaa ID*, Alternative contact number*”

### FLD-172: Alternative contact number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Kahramaa ID*, Alternative contact number*, Preferred language”

### FLD-173: Preferred language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Alternative contact number*, Preferred language, Address*”

### FLD-174: Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Preferred language, Address*, Installation Address*”

### FLD-175: Installation Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Address*, Installation Address*”

## Order Validation Business Rules catalogue (15 fields)

### FLD-902: Order Billing Profile vs Line Item Billing Profile consistency
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_001
- **Data type:** validation rule
- **Mandatory:** Unknown
- **Error message:** “Order Billing Profile must be same with Line Items' Billing Profile”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_001` "Order Billing Profile must be same with Line Items' Billing Profile"”

### FLD-903: Business account pending order block on open order
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_005
- **Data type:** validation rule
- **Mandatory:** Unknown
- **Error message:** “For business account, pending order cannot be submitted if open order exists under it”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_005` "For business account, pending order cannot be submitted if open order exists under it"”

### FLD-904: Serial Number
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_019
- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** required for SIM CARD product
- **Error message:** “Serial Number is required for SIM CARD product”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_019` "Serial Number is required for SIM CARD product"”

### FLD-905: Payment authorization status
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_030
- **Data type:** validation rule
- **Mandatory:** Unknown
- **Error message:** “All Payments should be Authorized”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_030` "All Payments should be Authorized"”

### FLD-906: DNO Verification Attachment
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_110
- **Data type:** file upload
- **Mandatory:** Conditional
- **Validation rule:** required for MNP Port-In order
- **Error message:** “DNO Verification Attachment is required for MNP Port-In order”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_110` "DNO Verification Attachment is required for MNP Port-In order"”

### FLD-907: FL Address KID requirement
`Explicit` · confidence: `high`

- **Technical name:** ORD_VALD_RULE_161
- **Data type:** text/ID
- **Mandatory:** Yes
- **Validation rule:** FL Address must have KID in it
- **Error message:** “FL Address must have KID in it”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`ORD_VALD_RULE_161` "FL Address must have KID in it"”

### FLD-908: Bill Limit Value vs Credit Limit
`Explicit` · confidence: `high`

- **Technical name:** BL RULE 07
- **Data type:** validation rule
- **Mandatory:** Unknown
- **Error message:** “Bill Limit Value cannot be more than Credit Limit!”
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “`BL RULE 07` "Bill Limit Value cannot be more than Credit Limit!"”

### FLD-909: IoT vs Non-IoT MSISDN length
`Explicit` · confidence: `high`

- **Data type:** validation rule
- **Mandatory:** Unknown
- **Validation rule:** 8 digits non-IoT, 10 digits IoT
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IoT vs Non-IoT MSISDN length rules (8 digits non-IoT, 10 digits IoT)”

### FLD-910: Max one iWatch per order
`Explicit` · confidence: `high`

- **Data type:** validation rule
- **Mandatory:** Unknown
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block)”

### FLD-911: EID requirement (iWatch/RIO)
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Conditional
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “iWatch/RIO bundle validation (max one iWatch per order, EID requirement, credit limit check, suspended-primary-bundle block)”

### FLD-912: Bulk SMS order - one active per account
`Explicit` · confidence: `high`

- **Data type:** validation rule
- **Mandatory:** Unknown
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bulk SMS order validation (billing profile type/status, one active Bulk SMS per account, mandatory attachment, blacklist check)”

### FLD-913: Bulk SMS mandatory attachment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Bulk SMS order validation (billing profile type/status, one active Bulk SMS per account, mandatory attachment, blacklist check)”

### FLD-914: Deposit Service Bundle - one per account, cannot be first service
`Explicit` · confidence: `high`

- **Data type:** validation rule
- **Mandatory:** Unknown
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “Deposit Service Bundle rules (one per account, cannot be first service, cannot TON)”

### FLD-915: IPTV/IDM email uniqueness
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Validation rule:** must be unique
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “IPTV/IDM email-uniqueness rules”

### FLD-916: Account-level APN uniqueness
`Explicit` · confidence: `high`

- **Data type:** validation rule
- **Mandatory:** Unknown
- **Sources:**
  - [`order-validation-business-rules-45d0e9f0`](../.knowledge/docs/order-validation-business-rules-45d0e9f0.md): “APN validation (Static IP, Domain Hosting, Broadband Service Link, Account-level APN uniqueness)”

## Contact record (create/update) - CRM (14 fields)

### FLD-209: First Name
`Inferred` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: First Name, Last Name, Nationality, Email, ID Type, ID Number, ID Expiration Date, Preferred language, Birth Date, Alternate/Cellular Phone #, Gender.”

### FLD-210: Last Name
`Inferred` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: First Name, Last Name, Nationality...”

### FLD-211: Nationality
`Inferred` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: First Name, Last Name, Nationality...”

### FLD-212: Email
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Must match "abc@xyz.com" pattern
- **Error message:** “Email format entered is incorrect...”
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: Email format ("abc@xyz.com" pattern)...e.g. ..."Email format entered is incorrect..."”

### FLD-213: ID Type
`Inferred` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: ...ID Type, ID Number, ID Expiration Date...”

### FLD-214: ID Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Qatari ID must be an 11-digit numeric value; must match embedded DOB
- **Error message:** “Please enter a valid 11-digit ID number”
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “listing 40 rows of validation messages...e.g. "Please enter a valid 11-digit ID number,"...Qatari ID must be an 11-digit numeric value; Date of Birth and Qatari ID "do not match"”

### FLD-215: ID Expiration Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Validation rule:** ID Expiration Date must be in the future
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Cross-field/logic checks: ID Expiration Date must be in the future...”

### FLD-216: Preferred language
`Inferred` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: ...Preferred language, Birth Date...”

### FLD-217: Birth Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Validation rule:** Date of Birth and Qatari ID must match; contact age under 18 flagged
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Cross-field/logic checks: ...Date of Birth and Qatari ID "do not match" (implies an embedded-DOB validation against QID number)...contact age under 18 flagged”

### FLD-218: Alternate/Cellular Phone #
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Must start with '974' and be 11 digits
- **Error message:** “Enter a Cellular Phone# that starts with '974'”
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Cellular/Work Phone # must start with "974" and be 11 digits; e.g. "Enter a Cellular Phone# that starts with '974'," "Cellular Phone# must be of 11 digits," "Enter a valid Cellular Phone #,"”

### FLD-219: Gender
`Inferred` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Mandatory-field checks: ...Alternate/Cellular Phone #, Gender.”

### FLD-220: Passport Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** 4-20 alphanumeric characters, no non-alphanumeric characters
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Passport must be 4–20 alphanumeric characters (no non-alphanumeric characters);”

### FLD-221: GCC ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** 8-20 numeric characters
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...GCC ID must be 8–20 numeric characters;”

### FLD-222: Business ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** 3-20 characters, numeric and '/' only
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Format/length checks: ...Business ID must be 3–20 characters, numeric and "/" only.”

## New Fixed Line Tablet - Step 1 Contact profile fields (13 fields)

### FLD-340: ID Expiry
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Editable rule:** auto-populated from ID scan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “ID Expiry `2/3/2027`”

### FLD-341: Nationality
`Explicit` · confidence: `high`

- **Data type:** text/dropdown
- **Mandatory:** Yes
- **Editable rule:** auto-populated from ID scan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Nationality `Turkish`”

### FLD-342: Gender
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Yes
- **Editable rule:** auto-populated
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Gender `M`”

### FLD-343: First name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** auto-populated from ID scan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “First name `MUSTAFA`”

### FLD-344: Last name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** auto-populated from ID scan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Last name `GULEC`”

### FLD-345: Birth date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Editable rule:** auto-populated from ID scan
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Birth date `8/30/1975`”

### FLD-346: Company Name (B2B2C)
`Explicit` · confidence: `high`

- **Data type:** dropdown/text
- **Mandatory:** Conditional
- **Default value:** blank
- **Visibility rule:** blank in non-B2B2C order; populated with company selection in B2B2C order
- **Editable rule:** required only for B2B2C flows
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Company Name (B2B2C) blank”

### FLD-347: Digital Lead/Sale
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum (Yes/No)
- **Mandatory:** Yes
- **Default value:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Digital Lead/Sale = No”

### FLD-348: Get IPTV ?
`Explicit` · confidence: `high`

- **Data type:** radio/enum (Yes/No)
- **Mandatory:** Yes
- **Default value:** No
- **Validation rule:** required field, highlighted with a red box in the screenshot
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Get IPTV ?" (required field, highlighted with a red box in the screenshot) = No selected”

### FLD-349: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Validation rule:** validated (green check)
- **Visibility rule:** disabled/replaced if No Email checked
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Email now shows `nobill@vodafone.com` (validated, green check)”

### FLD-350: No Email
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “No Email checkbox unchecked”

### FLD-351: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** English
- **Validation rule:** validated
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Language English (validated)”

### FLD-352: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** phone number
- **Mandatory:** Yes
- **Validation rule:** must be local mobile number
- **Error message:** “This is a notification contact. Please enter a local mobile number.”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Alt. phone # `97455667766` with note "This is a notification contact. Please enter a local mobile number."”

## FWA Contact (Step 1) (13 fields)

### FLD-430: Qatari ID / Qatari Id (insert or scan)
`Explicit` · confidence: `high`

- **Data type:** text/barcode-scan
- **Mandatory:** Yes
- **Validation rule:** Must resolve a valid ID via lookup (Go button); validated (green check)
- **Editable rule:** Editable until Go clicked
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Agent is prompted: "Please insert or scan the customer's Qatari Id:" and enters Qatari ID 27652419981, validated (green check)”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent enters Qatari ID 29158603076, clicks Go.”

### FLD-432: Digital Lead/Sale
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum (Yes/No)
- **Mandatory:** Yes/No (varies by source)
- **Default value:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “Agent sets Digital Lead/Sale = No”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Digital Lead/Sale = No”

### FLD-438: ID Expiry
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** No
- **Visibility rule:** Auto-populated after ID lookup
- **Editable rule:** Read-only, system-derived
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Contact confirmed: ID expiry 9/16/2026”

### FLD-439: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Visibility rule:** Auto-populated after ID lookup
- **Editable rule:** Read-only, system-derived
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Nationality Pakistani, Gender M”

### FLD-440: Gender
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Visibility rule:** Auto-populated after ID lookup
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Gender M, First name ABUBAKAR, Last name NAZIR”

### FLD-441: First name / Last name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Visibility rule:** Auto-populated after ID lookup
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “First name ABUBAKAR, Last name NAZIR”

### FLD-442: Birth date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** No
- **Visibility rule:** Auto-populated after ID lookup
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Birth date 1/1/1991”

### FLD-443: Email
`Explicit` · confidence: `high`

- **Data type:** text/email
- **Mandatory:** No
- **Default value:** noemailid@vodafone.com
- **Validation rule:** Format validated (green check)
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Email "noemailid@vodafone.com" (validated)”

### FLD-444: No Email
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Email: noemailid@vodafone.com; No Email checkbox”

### FLD-445: Preferred Language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Default value:** English
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Preferred Language English”

### FLD-446: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text/phone
- **Mandatory:** No
- **Validation rule:** Format validated (green check)
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Alt. phone # 97412341234”

### FLD-447: Company Name
`Explicit` · confidence: `high`

- **Data type:** text (autocomplete)
- **Mandatory:** No
- **Validation rule:** Autocomplete against existing companies
- **Visibility rule:** Shown in B2B2C scenario
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-b2b2c-b37e4359.md): “Agent types Company Name "TestVQW" into an autocomplete dropdown (other matches shown...) and selects TestVQW”

### FLD-448: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Visibility rule:** Banner note: to be filled by Fulfillment team only
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Enter ECR Details = No (banner: "To be filled by Fulfillment team only.")”

## Postpaid CAF - Section 2 Billing Information (12 fields)

### FLD-176: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Account credit limit, Bill date cycle, Bill format”

### FLD-177: Bill date cycle
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Account credit limit, Bill date cycle, Bill format”

### FLD-178: Bill format
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bill date cycle, Bill format, Bill language”

### FLD-179: Bill language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bill format, Bill language, Bill delivery mode”

### FLD-180: Bill delivery mode
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bill language, Bill delivery mode, Payment method”

### FLD-181: Payment method
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bill delivery mode, Payment method, Credit card number”

### FLD-182: Credit card number
`Inferred` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Required when Payment method = credit card
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Payment method, Credit card number, Credit card expiry date”

### FLD-183: Credit card expiry date
`Inferred` · confidence: `medium`

- **Data type:** date
- **Mandatory:** Conditional
- **Validation rule:** Required when Payment method = credit card
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Credit card number, Credit card expiry date, Name on card”

### FLD-184: Name on card (if different from customer name)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Name on card (if different from customer name)”

### FLD-185: Bank
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Conditional
- **Editable rule:** Fill in Direct Debit form if applicable
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bank (with note to fill in Direct Debit form if applicable)”

### FLD-186: Account number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Bank, Account number, Card holder signature”

### FLD-187: Card holder signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Conditional
- **Validation rule:** Credit-card authorization consent clause applies
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Account number, Card holder signature — plus a credit-card authorization consent clause”

## GigaHome Subscription Acceptance Form (page 1, English) (11 fields)

### FLD-249: Upfront Fee charged
`Explicit` · confidence: `high`

- **Data type:** checkbox/select
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Upfront Fee charged: N/A or Cash, on 1st bill (checkbox-style field)”

### FLD-250: Bill Cycle
`Explicit` · confidence: `high`

- **Data type:** checkbox/select
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Bill Cycle: 1st of month / 15th of month / same as existing plan (checkbox-style field)”

### FLD-251: Discount
`Explicit` · confidence: `high`

- **Data type:** text/number (fill-in)
- **Mandatory:** Conditional
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Discount: [blank]% for [blank] months (fill-in field)”

### FLD-252: Internet speed tier
`Explicit` · confidence: `high`

- **Data type:** checkbox/select
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Internet speed tiers: 100 Mbps / 500 Mbps / 1 Gbps (checkbox-style field)”

### FLD-253: Fair Usage Policy (FUP)
`Explicit` · confidence: `high`

- **Data type:** checkbox/select
- **Mandatory:** Yes
- **Validation rule:** After full FUP usage, speed throttles to up to 1 Mbps until next billing cycle
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Fair Usage Policy (FUP): 1 TB / 2 TB / 10 TB per month; after full usage, speed throttles to up to 1 Mbps until next billing cycle”

### FLD-254: Installation address (Zone No., Street No., Building No., Unit No.)
`Explicit` · confidence: `high`

- **Data type:** text (fill-in)
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Installation address capture: Zone No., Street No., Building No., Unit No. (fill-in fields)”

### FLD-255: Customer Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Signature block: Customer Name, Customer QID, Customer Signature, Date”

### FLD-256: Customer QID
`Explicit` · confidence: `high`

- **Data type:** text/ID number
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Signature block: Customer Name, Customer QID, Customer Signature, Date”

### FLD-257: Customer Signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Signature block: Customer Name, Customer QID, Customer Signature, Date”

### FLD-258: Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “Signature block: Customer Name, Customer QID, Customer Signature, Date”

### FLD-259: Agent attribution (DSA / Store / Field Engineer)
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Yes
- **Sources:**
  - [`gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d`](../.knowledge/docs/gigahome-subscription-acceptance-form-5g-home-plans-v3-revis-ec26a52d.md): “agent-attribution section with checkboxes for DSA / Store / Field Engineer”

## MNP Order (Siebel) (10 fields)

### FLD-056: Plan
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “fulfilment validates and creates an order in Siebel, selecting the plan, MNP category, porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date)”

### FLD-057: MNP category
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “selecting the plan, MNP category, porting details...”

### FLD-058: Customer ID number/type
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date)”

### FLD-059: Customer type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date)”

### FLD-060: Donor operator
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Always QTEL/Ooredoo
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “donor operator — always QTEL/Ooredoo”

### FLD-061: Subscription type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (customer ID number/type, customer type, donor operator — always QTEL/Ooredoo, subscription type, scheduled porting date)”

### FLD-062: Scheduled porting date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Validation rule:** Porting window Sunday–Thursday 11am–12pm; requests before 10:45am make that day's window
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “porting details (...subscription type, scheduled porting date), a reserved zero-value temporary MSISDN, and attachments”

### FLD-063: Reserved zero-value temporary MSISDN
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “a reserved zero-value temporary MSISDN, and attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

### FLD-064: Attachment: MNP form 2-A-D
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Under 2 MB; PDF or JPG only
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

### FLD-065: Attachment: donor-registered ID
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Under 2 MB; PDF or JPG only; DNO verification type
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “attachments (MNP form 2-A-D and donor-registered ID; DNO verification type; under 2 MB; PDF or JPG).”

## WFM Installation Checklist (9 fields)

### FLD-485: Speed test results on Wi-Fi and LAN
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Speed test results on Wi-Fi and LAN" = Test”

### FLD-486: Wi-Fi User name's for 2.5G and 5G network (NO password)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Must not include password
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Wi-Fi User name's for 2.5G and 5G network (NO password)" = Vishak”

### FLD-487: Timestamp of calls made to installation desk from Landline
`Explicit` · confidence: `high`

- **Data type:** date/time
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Timestamp of calls made to installation desk from Landline" = 18-09-2025 11:06:25”

### FLD-488: WiFi Coverage Tested
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “checkbox WiFi Coverage Tested = checked”

### FLD-489: Confirm Wi-Fi Coverage status with customer and recommend...
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum (Yes/No)
- **Mandatory:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Confirm Wi-Fi Coverage status with customer and recommend..." = Yes”

### FLD-490: Optical Power Meter Reading
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Optical Power Meter Reading = 1, Splitter Free Port Details = 1.”

### FLD-491: Splitter Free Port Details
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Splitter Free Port Details = 1”

### FLD-492: Customer briefing checkboxes (package details, Wi-Fi 5G-first guidance, CPE/STB restart, My Vodafone app, mesh configuration)
`Explicit` · confidence: `high`

- **Data type:** checkbox (multiple)
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “All customer-briefing checkboxes checked ("Brief customer on package details", Wi-Fi 5G-first guidance, CPE/STB restart instructions, My Vodafone app + bill-pay explanation, mesh configuration explanation).”

### FLD-493: Customer Signature
`Explicit` · confidence: `high`

- **Data type:** signature capture
- **Mandatory:** Yes
- **Editable rule:** Drawn on pad
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Customer Signature captured (drawn signature present).”

## Activity (final wrap-up step) (9 fields)

### FLD-637: Channel
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Store walk-in
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Channel 'Store walk-in', MSISDN 97470345802, Type 'Sales'”

### FLD-638: Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Sales
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Type 'Sales', Topic 'Automated Guided Journ...'”

### FLD-639: Topic
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Automated Guided Journey
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Topic 'Automated Guided Journ...'”

### FLD-640: Sub Topic
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Retail - Open UI
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Sub Topic 'Retail - Open UI'”

### FLD-641: Area
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Provisioning - New Postpaid
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Area 'Provisioning - New Postp...'”

### FLD-642: Resolution Code
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Completed
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Resolution Code 'Completed', Status 'Solved'”

### FLD-643: Status
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Solved
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Status 'Solved', Language 'English'”

### FLD-644: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Conditional
- **Validation rule:** Needed before Save and Finish
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “empty Comments box with helper text: 'Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.'”

### FLD-645: Save and Finish
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Button: 'Save and Finish'.”

## Postpaid - Contact (Open UI Desktop Pre2Post, Step 1 confirm) (9 fields)

### FLD-742: ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Qatari ID
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “fields auto-populated: ID Type: Qatari ID, ID#: 28260821189, ID expiry: 3/16/2026”

### FLD-743: ID#
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “ID#: 28260821189”

### FLD-744: ID expiry
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “ID expiry: 3/16/2026”

### FLD-745: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Nationality: Filipino”

### FLD-746: Gender
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Gender: M”

### FLD-747: First name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “First name: ALLAN, Last name: GRANADA”

### FLD-748: Last name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Last name: GRANADA”

### FLD-749: Birth date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Birth date: 3/13/1982”

### FLD-750: Digital Lead/Sale
`Explicit` · confidence: `high`

- **Data type:** radio (Yes/No)
- **Mandatory:** Unknown
- **Default value:** No
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Digital Lead/Sale: No (radio)”

## Cross Sales – Contact confirmation + Connection Details popup (8 fields)

### FLD-261: ID expiry
`Explicit` · confidence: `high`

- **Data type:** date
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “read-only identity fields (ID expiry, Nationality Indian, Gender M, First/Last name KHALID MAMMU, Birth date)”

### FLD-262: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Nationality Indian, Gender M”

### FLD-263: Gender
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Gender M”

### FLD-264: First/Last name
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “First/Last name KHALID MAMMU”

### FLD-265: Birth date
`Explicit` · confidence: `high`

- **Data type:** date
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Birth date”

### FLD-266: Email
`Explicit` · confidence: `high`

- **Data type:** text/email
- **Mandatory:** Yes
- **Editable rule:** editable
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “editable required fields (Email, Preferred Language, Alt. phone #)”

### FLD-267: Preferred Language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Editable rule:** editable
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “editable required fields (Email, Preferred Language, Alt. phone #)”

### FLD-268: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text/phone
- **Mandatory:** Yes
- **Editable rule:** editable
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “editable required fields (Email, Preferred Language, Alt. phone #)”

## FWA Desktop Vanilla - Contact/Mobile Eligibility (8 fields)

### FLD-383: Last Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent fills Last Name, First Name, ID Type (Passport), ID Number, ID Expiration Date, Nationality, Cellular Phone #, Email”

### FLD-384: First Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent fills Last Name, First Name, ID Type...”

### FLD-385: ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Editable rule:** e.g. Passport triggers temporary-number rule
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “ID Type (Passport)”

### FLD-386: ID Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “ID Number”

### FLD-387: ID Expiration Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “ID Expiration Date”

### FLD-388: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Nationality”

### FLD-389: Cellular Phone #
`Explicit` · confidence: `high`

- **Data type:** phone number
- **Mandatory:** Yes
- **Validation rule:** temporary-number rule for non-resident ID
- **Error message:** “This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided.”
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “System warning dialog: "This number will only be active for 90 days. To make this number permanent, a valid resident's ID such as QID or Diplomatic ID must be provided."”

### FLD-390: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “Email”

## B2B2C With Approval - Step1 Contact confirmation (8 fields)

### FLD-683: Lead/Opportunity ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Validation rule:** blank in example
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Lead/Opportunity ID (blank), Company Name (dropdown, blank at first), Digital Lead/Sale = No”

### FLD-684: Company Name
`Explicit` · confidence: `high`

- **Data type:** dropdown (searchable)
- **Mandatory:** Yes
- **Validation rule:** required for B2B2C linkage
- **Visibility rule:** appears at contact step for B2B2C flow
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “agent opens the Company Name selector; options shown: '01 newfreedcn01_Test', '01 querybar01', 'TestVQW'. Agent selects '01 newfreedcn01_Test'”

### FLD-685: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** radio (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Visibility rule:** note: 'To be filled by Fulfillment team only.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Enter ECR Details = No, with note 'To be filled by Fulfillment team only.'”

### FLD-686: Email
`Explicit` · confidence: `high`

- **Data type:** text (email)
- **Mandatory:** Yes
- **Default value:** noemailid@vodafone.com
- **Validation rule:** red asterisk mandatory marker
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Email, No Email, Language, Alt. phone # fields appear below, each marked mandatory (red asterisk)... Email = noemailid@vodafone.com”

### FLD-687: No Email
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** ticked
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'No Email' checkbox ticked”

### FLD-688: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** English
- **Validation rule:** red asterisk mandatory marker
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Language = English, Alt. phone # = 97412341234”

### FLD-689: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text (phone)
- **Mandatory:** Yes
- **Default value:** 97412341234
- **Validation rule:** red asterisk mandatory marker
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Alt. phone # = 97412341234”

### FLD-690: Qatari ID-Front / Qatari ID-Back
`Explicit` · confidence: `high`

- **Data type:** file upload / image capture
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Qatari ID-Front' and 'Qatari ID-Back' images captured (green checkmarks)”

## 5G Indoor/Outdoor FWA Document Collection (7 fields)

### FLD-046: CAF (Customer Application Form)
`Explicit` · confidence: `high`

- **Technical name:** CAF
- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-047: Authorised QID
`Explicit` · confidence: `high`

- **Data type:** file upload/ID
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-048: Ookla speed test screenshot
`Explicit` · confidence: `high`

- **Data type:** file upload/image
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-049: Customer confirmation form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-050: Terms presentation (acknowledgement)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-051: Supplementary form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

### FLD-052: Employment card
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, authorised QID, Ookla speed test screenshot, customer confirmation form, terms presentation, supplementary form, employment card)”

## FWA Outdoor WFM - OFS Installation Checklist (7 fields)

### FLD-403: Speed test results on Wi-Fi and LAN
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Fields captured: "Speed test results on Wi-Fi and LAN" = Test”

### FLD-404: Wi-Fi User name's for 2.5G and 5G network (NO password)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** NO password should be entered
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Wi-Fi User name's for 2.5G and 5G network (NO password)" = Vishak”

### FLD-405: Timestamp of calls made to installation desk from Landline
`Explicit` · confidence: `high`

- **Data type:** datetime
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Timestamp of calls made to installation desk from Landline" = 09-09-2025 11:06:25”

### FLD-406: WiFi Coverage Tested
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Yes
- **Default value:** unchecked
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “checkbox "WiFi Coverage Tested" checked”

### FLD-407: Optical Power Meter Reading
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Optical Power Meter Reading" = 1”

### FLD-408: Splitter Free Port Details
`Explicit` · confidence: `high`

- **Data type:** number/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Splitter Free Port Details" = 1”

### FLD-409: Customer Signature
`Explicit` · confidence: `high`

- **Data type:** signature (canvas draw)
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “A hand-drawn Customer Signature is captured. Submit.”

## Create a Lead (Fixed) (7 fields)

### FLD-572: Mobile Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Mobile Number*, Service Needed*, First Name, Last Name, Preferred Time, Zone, Street, Building, Unit”

### FLD-573: Service Needed
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Home
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Service Needed dropdown opened: options FNP, Home, MNP, Plan upgrades, Postpaid, Pre to Post, Prepaid — 'Home' ... is selected”

### FLD-574: Fixed Pre-sales
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum (Yes/No)
- **Default value:** Yes
- **Visibility rule:** only shows for the Home service type
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “a conditional field 'Fixed Pre-sales' appears (Yes/No) — this field only shows for the Home service type”

### FLD-575: First Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** LEAD
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “First Name = LEAD, Last Name = Test1”

### FLD-576: Last Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Test1
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Last Name = Test1”

### FLD-577: Preferred Time
`Explicit` · confidence: `high`

- **Data type:** date/time picker
- **Default value:** 11/20/2025 12:29:00
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Preferred Time date/time picker: November 2025 calendar, 20th highlighted, Hour/Minute sliders, Now/Done buttons”

### FLD-578: Zone/Street/Building/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 11A / 22 / 33 / 44D
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Zone 11A, Street 22, Building 33, Unit 44D”

## CAF - Section 2 Billing information (Open UI Desktop Pre2Post) (7 fields)

### FLD-765: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 1000
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Account credit limit: 1000”

### FLD-766: Smart Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 350
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Smart Limit: 350”

### FLD-767: Bill date cycle
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 1
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Bill date cycle: 1”

### FLD-768: Bill format
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Default value:** Detail
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Bill format: Detail”

### FLD-769: Bill language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Default value:** English
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Bill language: English”

### FLD-770: Bill delivery mode
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Default value:** Email
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Bill delivery mode: Email”

### FLD-771: Payment method
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Default value:** Invoice
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Payment method: Invoice (Credit card fields left blank)”

## New Prepaid Tablet - Contact confirmation (7 fields)

### FLD-807: ID Expiry
`Explicit` · confidence: `medium`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “ID Expiry 2/12/2037”

### FLD-808: Nationality
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Nationality Indian, Gender M”

### FLD-809: Gender
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Gender M”

### FLD-810: First name
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “First name VFQMAV, Last name Sourav183”

### FLD-811: Last name
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Last name Sourav183”

### FLD-812: Birth date
`Explicit` · confidence: `medium`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Birth date 7/16/1987”

### FLD-813: Digital Lead/Sale
`Explicit` · confidence: `medium`

- **Data type:** radio
- **Mandatory:** Unknown
- **Default value:** No
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Digital Lead/Sale = No (radio)”

## Enterprise Account Creation (6 fields)

### FLD-023: Account/Company name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit”

### FLD-024: CR type / ID type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit”

### FLD-025: CR number
`Explicit` · confidence: `high`

- **Technical name:** CR number
- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** Mandatory CR-number search required before account creation
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Mandatory CR-number search required before account creation. Account creation captures: name, CR type/ID type, CR number...”

### FLD-026: Agent ID (for commission)
`Explicit` · confidence: `high`

- **Technical name:** Agent ID
- **Data type:** text/ID
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit”

### FLD-027: Business type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account creation captures: name, CR type/ID type, CR number, agent ID (for commission), business type (including B2B2C), and credit limit”

### FLD-028: Credit limit
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Conditional
- **Validation rule:** Enterprise has no default credit limit and requires business finance approval
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “enterprise has no default credit limit and requires business finance approval.”

## TON - Retail Flow (existing/new customer validation) (6 fields)

### FLD-092: Number Price
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Validation rule:** A null/blank value causes unnecessary CDM queue tickets — identified as a legacy data/design gap
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “a null/blank number price causing unnecessary CDM queue tickets (identified as a legacy data and design gap)”

### FLD-093: Signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Validation rule:** Subject to data-entry rejections
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “signature and QID data-entry rejections; missing attachments”

### FLD-094: QID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Subject to data-entry rejections
- **Editable rule:** OCR bypass by role
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “signature and QID data-entry rejections; missing attachments... OCR bypass by role”

### FLD-095: Attachments
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Frequently missing, a known pain point
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “missing attachments; TON order visibility only available on the new account”

### FLD-096: Order Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Editable rule:** Not auto-updated post-TON, a known pain point
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “address not being updated after TON”

### FLD-097: TON / Prepaid Migration Fee
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Validation rule:** Governed by business rules discussed in session
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “TON and prepaid-migration fees and their business rules”

## Postpaid CAF - Section 4 Superfast Broadband & Home Phone (6 fields)

### FLD-193: Landline Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Landline Number, International Calling Enabled, Plan Name”

### FLD-194: International Calling Enabled
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Landline Number, International Calling Enabled, Plan Name”

### FLD-195: Plan Name
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Validation rule:** minimum 3-month subscription applies
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Plan Name (minimum 3-month subscription applies), Extras (x2)”

### FLD-196: Extras
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Extras (x2)”

### FLD-197: Appointment Details
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Appointment Details, Signature, plus an acknowledgment clause”

### FLD-198: Signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** No
- **Validation rule:** Acknowledgment clause referencing Vodafone Home T&Cs
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Appointment Details, Signature, plus an acknowledgment clause referencing Vodafone Home T&Cs”

## TON (Transfer of Number) form (6 fields)

### FLD-240: Customer application form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Documents required: customer application form, TON form, QID (or diplomatic ID) for party B (party A may use passport/DCC/QID)”

### FLD-241: TON form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Documents required: customer application form, TON form, QID (or diplomatic ID) for party B...”

### FLD-242: QID/Diplomatic ID for Party B
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “QID (or diplomatic ID) for party B (party A may use passport/DCC/QID)”

### FLD-243: Party A ID (passport/DCC/QID)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “party A may use passport/DCC/QID”

### FLD-244: Free SR for QID update
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “a free SR for QID update, and — for star numbers valued 1,500 Riyal and above — a customer data restoration/declaration form”

### FLD-245: Customer data restoration/declaration form (star numbers ≥1,500 Riyal)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Conditional
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “for star numbers valued 1,500 Riyal and above — a customer data restoration/declaration form (listing recent usage) with a clause letting Vodafone reclaim the number if the transfer is found fraudulent”

## New Fixed Line Tablet - Step 6 Book Appointment (6 fields)

### FLD-372: Collect QID
`Explicit` · confidence: `high`

- **Data type:** boolean (Yes/No)
- **Mandatory:** Unknown
- **Default value:** Yes
- **Visibility rule:** appears within Book Appointment modal
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “scroll down reveals Collect QID = Yes, Collect CAF = Yes, FNP Identifier = No, FNP Execution Date field”

### FLD-373: Collect CAF
`Explicit` · confidence: `high`

- **Data type:** boolean (Yes/No)
- **Mandatory:** Unknown
- **Default value:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Collect CAF = Yes”

### FLD-374: FNP Identifier
`Explicit` · confidence: `high`

- **Data type:** boolean (Yes/No)
- **Mandatory:** Unknown
- **Default value:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “FNP Identifier = No”

### FLD-375: FNP Execution Date
`Inferred` · confidence: `medium`

- **Data type:** date
- **Mandatory:** Conditional
- **Visibility rule:** likely only relevant when FNP Identifier=Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “FNP Execution Date field”

### FLD-376: Time slot
`Explicit` · confidence: `high`

- **Data type:** selectable pill/enum
- **Mandatory:** Yes
- **Validation rule:** capacity-limited (slots can be full)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “time-slot pills 8AM–11AM (selected), 11AM-2PM, 2PM-5PM, 5PM-8PM”

### FLD-377: Booking Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Booking Comments" free-text box”

## MNP Postpaid – Donor Details (6 fields)

### FLD-531: Port-in Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 97466000666
- **Validation rule:** green check
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Port-in Number 97466000666 (green check)”

### FLD-532: Donor ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 893093
- **Validation rule:** green check
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Donor ID 893093 (green check)”

### FLD-533: Donor ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** Passport
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Donor ID Type = Passport (dropdown)”

### FLD-534: Donor Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Consumer
- **Editable rule:** read-only/greyed
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Donor Type = Consumer (read-only/greyed)”

### FLD-535: Donor Operator
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Qtel
- **Editable rule:** read-only/greyed
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Donor Operator = Qtel (read-only/greyed, i.e. Ooredoo/Qtel is the losing/donor operator)”

### FLD-536: Subscription Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Postpaid
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Subscription Type = Postpaid”

## Postpaid Contact (post cross-sell handoff) (6 fields)

### FLD-614: ID type
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** Qatari ID
- **Visibility rule:** Additional field vs Cross Sales contact form
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “This Postpaid Contact form has additional fields not present on the Cross Sales contact form: ID type 'Qatari ID'”

### FLD-615: Job title
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Job title, 'Digital Lead/Sale' Yes/No radio (No selected)”

### FLD-616: Digital Lead/Sale
`Explicit` · confidence: `high`

- **Data type:** radio (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Digital Lead/Sale' Yes/No radio (No selected)”

### FLD-617: No Email
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'No Email' checkbox”

### FLD-618: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Language dropdown, Alt. phone # with its own checkbox”

### FLD-619: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text (phone)
- **Mandatory:** No
- **Validation rule:** Has own verification checkbox
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Alt. phone # with its own checkbox”

## Complex Product Runtime Instantiation - customization screen (6 fields)

### FLD-660: VAS Flex-purchase Prepaid Opt-in
`Explicit` · confidence: `high`

- **Data type:** radio
- **Mandatory:** No
- **Default value:** None
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'VAS Flex-purchase Prepaid Opt-in' — radio options None (selected) / 'VAS Flex-purchase Prepaid Opt-in'”

### FLD-661: Extra Cabling Charges - Item
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Extra Cabling Charges' — Item dropdown, Qty field, 'Add Item' button”

### FLD-662: Extra Cabling Charges - Qty
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Extra Cabling Charges' — Item dropdown, Qty field, 'Add Item' button”

### FLD-663: Bill Limit selection
`Explicit` · confidence: `high`

- **Data type:** radio list
- **Mandatory:** No
- **Visibility rule:** columns: List Price / Your Price / Promotion / Explanation / Customize
- **Editable rule:** gear 'Customize' icon
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Bill Limit' section (radio list with List Price / Your Price / Promotion / Explanation / Customize columns): None; 'Bill Limit Mobile Plus' — selected”

### FLD-664: Smart Tracker Device
`Explicit` · confidence: `high`

- **Data type:** radio
- **Mandatory:** No
- **Default value:** None
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Smart Tracker Device' — None (selected) / 'Smart Tracker Device'”

### FLD-665: Free 4GB Data Lifetime (Lego Addon)
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Visibility rule:** under 'Lego Addons' group
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'Lego Addons' — 'Free 4GB Data Lifetime' (unchecked)”

## Prepaid to Postpaid - Contact (Tablet Pre2Post, Step 1 remaining fields) (6 fields)

### FLD-793: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Validation rule:** required, empty at this state
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Email (required, empty), No Email checkbox (unchecked)”

### FLD-794: No Email checkbox
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Unknown
- **Default value:** unchecked
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “No Email checkbox (unchecked)”

### FLD-795: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Language (required, empty dropdown)”

### FLD-796: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** phone
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Alt. phone # (required, empty)”

### FLD-797: Qatari ID-Front upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “two empty upload placeholders 'Qatari ID-Front' / 'Qatari ID-Back'”

### FLD-798: Qatari ID-Back upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Qatari ID-Front' / 'Qatari ID-Back'”

## GigaHome & OSNtv Subscription Acceptance Form (5 fields)

### FLD-001: Customer Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature.”

### FLD-002: Customer QID
`Explicit` · confidence: `high`

- **Data type:** text/ID number
- **Mandatory:** Yes
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature.”

### FLD-003: Plan Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature.”

### FLD-004: Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature.”

### FLD-005: Signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`250604-supplementary-form-reg-v2-final-475e97bb`](../.knowledge/docs/250604-supplementary-form-reg-v2-final-475e97bb.md): “Form fields to be completed: Customer Name, Customer QID, Plan Name, Date, Signature.”

## Bulk Adjustment Portal (DXP, target state) (5 fields)

### FLD-009: Fixed template (upload)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Target: a bulk adjustment portal in DXP integrated with BRM, with fixed template, request status, failure reports for re-upload, free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter.”

### FLD-010: Request status
`Explicit` · confidence: `high`

- **Data type:** text/status
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “...with fixed template, request status, failure reports for re-upload...”

### FLD-011: Free-text comment
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “...free-text comment, unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter.”

### FLD-012: Unit of measurement
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “...unit of measurement, multi-bucket submission, role-based access, billing profile filtration, default sort/filter.”

### FLD-013: Billing profile filter
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “...role-based access, billing profile filtration, default sort/filter.”

## MNP Port-Out Trouble Ticket (Siebel) - Manual/Signature & MNP Form Checks (5 fields)

### FLD-084: Signature Match
`Explicit` · confidence: `high`

- **Data type:** checkbox/manual verification
- **Mandatory:** Yes
- **Validation rule:** Manual check because Siebel cannot read the digital form and documents live only in NPass
- **Visibility rule:** Documents only visible in NPass, not Siebel (gap)
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual because Siebel cannot read the digital form and the documents live only in NPass”

### FLD-085: MNP Form Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Validation rule:** Must be within 30 days
- **Editable rule:** Manual verification only
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### FLD-086: Segment
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Manually checked against form
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### FLD-087: Product (Prepaid/Postpaid)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Manually checked against form
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

### FLD-088: Requested Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Manually checked against form
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Signature and MNP form checks (date within 30 days, segment, prepaid/postpaid product, name, ID, requested number) remain manual”

## CAF (Customer Application Form) (5 fields)

### FLD-104: CAF Serial / ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Must be unique, follow a defined naming convention
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “CAF must have unique serial/ID and naming convention [00:09:14]”

### FLD-539: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 1000
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Account credit limit 1000, Smart Limit 67”

### FLD-540: Smart Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 67
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Smart Limit 67 (confirming the earlier-approved value)”

### FLD-541: Bill date cycle
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 1
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill date cycle 1, Bill format Detail, Bill language English”

### FLD-542: Bill delivery mode
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** Email
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill delivery mode Email, Payment method Invoice”

## Contact Center Security Verification (5 fields)

**⚠ Confidence caveat (added 2026-08-23, Phase 2 review — applies to FLD-131 through FLD-135 below):** these 5 fields, plus BR-079 and VAL-201..205, all derive from a single source (`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`) that only decoded 29 of 186 recorded minutes (85% data loss, tool-flagged "AUDIO DAMAGED"). A separate Phase 1.5 pass found this security-question model has zero corroboration anywhere else in the 83-document corpus. Re-scored 53/100 (Medium-Low). Validate with Vodafone Qatar stakeholders before treating as agreed. See `business-rules.md` BR-079 and `VFQ_Phase1.5_Action7_Source_Confidence_Handling_Policy.md`.

### FLD-131: Security Question - QID
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Mandatory question
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions”

### FLD-132: Security Question - Account/Holder Name
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Mandatory question
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “QID and account/holder name are the two mandatory questions”

### FLD-133: Security Question - Registered Notification Number
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Asked flexibly depending on what customer can answer; validated by agent interpretation, not exact string match
- **Visibility rule:** Varies by service type, segment, channel; lighter if calling from registered number
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer, and are validated by agent interpretation rather than exact string match”

### FLD-134: Security Question - Active Add-on
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Asked flexibly, agent-interpreted
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer”

### FLD-135: Security Question - Email Address
`Explicit` · confidence: `medium`

- **Data type:** text/email
- **Mandatory:** Conditional
- **Validation rule:** Asked flexibly, agent-interpreted
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “additional questions (registered notification number, active add-on, email address) are asked flexibly depending on what the customer can answer”

## Postpaid CAF - Section 3 For Postpaid Customers (5 fields)

### FLD-188: Mobile number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Mobile number* (Primary mobile number, Voice/Data SIM type)”

### FLD-189: Voice/Data SIM type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Mobile number* (Primary mobile number, Voice/Data SIM type)”

### FLD-190: Postpaid Plan
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** minimum subscription period of 3 months applies
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Postpaid Plan* (note: minimum subscription period of 3 months applies)”

### FLD-191: Extras
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Extras (x2 fields)”

### FLD-192: Signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Validation rule:** Acknowledgment clause referencing Postpaid Terms & Conditions
- **Sources:**
  - [`consumer-postpaid-caf-v4-110525-editable-915fde96`](../.knowledge/docs/consumer-postpaid-caf-v4-110525-editable-915fde96.md): “Signature*, and an acknowledgment clause referencing Postpaid Terms & Conditions”

## Prepaid CAF - Top Fields (5 fields)

### FLD-199: Application date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Application date*, Store/Retailer ID, "Write your Vodafone mobile number here,"”

### FLD-200: Store/Retailer ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Application date*, Store/Retailer ID, "Write your Vodafone mobile number here,"”

### FLD-201: Vodafone mobile number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “"Write your Vodafone mobile number here," "Write your SIM serial here," Registration type”

### FLD-202: SIM serial
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “"Write your SIM serial here," Registration type”

### FLD-203: Registration type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “"Write your SIM serial here," Registration type”

## FWA Desktop Vanilla - FMS CPE Bundle Details form (5 fields)

### FLD-392: Indoor Unit Serial Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “fills Indoor Unit Serial Number (IPTV Service Id, CPE Model, MAC Address and VoIP Number left blank in this run)”

### FLD-393: IPTV Service Id
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “IPTV Service Id ... left blank in this run”

### FLD-394: CPE Model
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “CPE Model...left blank in this run”

### FLD-395: MAC Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “MAC Address...left blank in this run”

### FLD-396: VoIP Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “VoIP Number left blank in this run”

## FWA Indoor Modify CPE - FMS CPE Indoor IDU Details (5 fields)

### FLD-415: IPTV Service Id
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “IPTV Service Id: (blank)”

### FLD-416: Indoor Unit CPE Model
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Editable rule:** read-only in this modify flow (unchanged)
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Indoor Unit CPE Model: Huawei_B2368-66”

### FLD-417: Indoor Unit MAC Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Editable rule:** unchanged
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Indoor Unit MAC Address: 84AA9C9FC121”

### FLD-418: Indoor Unit Serial Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** S180P18055021
- **Visibility rule:** highlighted with red outline when selected for edit
- **Editable rule:** editable; agent changed from S180P18055021 to S180P18055020
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “changes the value from S180P18055021 to S180P18055020 (last digit 1 → 0)”

### FLD-419: VoIP Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Default value:** 97441202296
- **Editable rule:** unchanged
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “VoIP Number: 97441202296”

## FWA Book Appointment (Step 7) (5 fields)

### FLD-460: Appointment date (calendar)
`Explicit` · confidence: `high`

- **Data type:** date picker
- **Mandatory:** Yes
- **Visibility rule:** Not shown/required for Indoor journeys
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Calendar shows September 2025, date 20 selected.”

### FLD-461: Time slot
`Explicit` · confidence: `high`

- **Data type:** selection (list of slots)
- **Mandatory:** Yes
- **Validation rule:** Some slots disabled based on availability
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Time slots: 8AM-11AM selected (11AM-2PM, 2PM-5PM, 5PM-8PM disabled).”

### FLD-462: Booking Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Booking Comments left blank.”

### FLD-463: Submit confirmation
`Explicit` · confidence: `high`

- **Data type:** confirm dialog
- **Mandatory:** Yes
- **Validation rule:** Cannot be cancelled once booked
- **Visibility rule:** Scheduled appointment path
- **Error message:** “WARNING: Appointment once booked cannot be cancelled. Click "OK" to continue or "Cancel" to select another appointment”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “On Submit, browser confirm dialog: WARNING: Appointment once booked cannot be cancelled...”

### FLD-464: Book Unscheduled Appointment confirmation
`Explicit` · confidence: `high`

- **Data type:** confirm dialog
- **Mandatory:** No
- **Validation rule:** Cannot be cancelled within the journey once booked
- **Visibility rule:** Alternate to scheduled Book Appointment
- **Error message:** “WARNING: Once unscheduled appointment is booked, it cannot be cancelled within the journey. Click 'Ok' to continue.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-outdoor-wfm-88197754.md): “Choosing "Book Unscheduled Appointment" triggers a browser-style confirm dialog...WARNING: Once unscheduled appointment is booked...”

## Product Promotions admin - Bill Limit Mapping / Spend Limit Mapping applet (5 fields)

### FLD-651: SL List Price
`Explicit` · confidence: `high`

- **Data type:** currency/number
- **Mandatory:** No
- **Default value:** 3 (Bill Limit Mobile) / 0 (Bill Limit Mobile Plus)
- **Editable rule:** Editable by admin
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “'1-1PQ439D' / Bill Limit Mobile: SL List Price 3, Agent Min Value 50...”

### FLD-652: Agent Min Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 50 (Bill Limit Mobile); raised to 80 (Bill Limit Mobile Plus)
- **Validation rule:** Used as floor for agent-entered Bill Limit / SL Limit Amount at order time
- **Editable rule:** Editable by admin
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Agent Min Value field is being edited — highlighted/selected showing '80' (raised from a prior value)”

### FLD-653: SL Min Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 0.01
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Min Value 0.01, SL Default Value 20, Default Flag unchecked, Active Flag checked”

### FLD-654: SL Default Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 20
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Default Value 20, Default Flag checked, Active Flag checked”

### FLD-655: Active Flag
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** checked
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Default Flag checked, Active Flag checked”

## CAF - Section 1 Applicant details (Open UI Desktop Pre2Post) (5 fields)

### FLD-760: Customer type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Consumer
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Customer type: Consumer”

### FLD-761: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Email: nobill@vfq.com”

### FLD-762: PO Box
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “PO Box: 11227”

### FLD-763: Kahramaa ID/Vodafone ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Kahramaa ID/Vodafone ID: 16P6014”

### FLD-764: Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Address: 'BCW-LAB_GPON_2-LT1_P6_16P6014, test, Doha, AL'”

## New Prepaid Tablet - Contact form continued (5 fields)

### FLD-814: Email
`Explicit` · confidence: `medium`

- **Data type:** email
- **Mandatory:** Yes
- **Default value:** nobill@vfq.com
- **Validation rule:** Shown green-checked (validated) in the guided journey
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Email = nobill@vfq.com”

### FLD-815: Language
`Explicit` · confidence: `medium`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** English
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Language = English”

### FLD-816: Alt. phone #
`Explicit` · confidence: `medium`

- **Data type:** phone
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Alt. phone # = 97412341234”

### FLD-817: ID-Front upload
`Explicit` · confidence: `medium`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Shown green-checked (validated) once uploaded
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Two document capture tiles 'ID-Front' and 'ID-Back' both show green checkmarks”

### FLD-818: ID-Back upload
`Explicit` · confidence: `medium`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Shown green-checked (validated) once uploaded
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'ID-Front' and 'ID-Back' both show green checkmarks”

## Open UI Desktop - Contact History tab grid (5 fields)

### FLD-889: Activity #
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Activity # 1-2WO63MPA, Channel "Administration"”

### FLD-890: Channel
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Channel "Administration", "Calling 30 day", "Call - Inbound", "Back Office"”

### FLD-891: Status
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Status "Solved", "Ready To Assign", "Closed"”

### FLD-892: Transaction Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Transaction Date 6/25/2026”

### FLD-893: Journey
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Journey "Get Support", "Use"”

## Enterprise Invoice (PDF/Excel redesign) (4 fields)

### FLD-073: Tax code
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “add tax code and tax number placeholders; display service ID for account-level and other services; match ordering between PDF and Excel”

### FLD-074: Tax number
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “add tax code and tax number placeholders”

### FLD-075: Service ID / Circuit ID (line-item grouping)
`Explicit` · confidence: `high`

- **Technical name:** Service ID / Circuit ID
- **Data type:** text/ID
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “group line items under service ID/circuit ID with one-off charges linked to their circuit; ... display service ID for account-level and other services”

### FLD-076: Discount line items (prorated / month-in-advance)
`Explicit` · confidence: `high`

- **Data type:** currency/number (two line items)
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “correct discount presentation so discounts appear as two line items (prorated and month-in-advance) shown against the charge they apply to.”

## MNP Port-Out Trouble Ticket (Siebel) - Auto-Validation (4 fields)

### FLD-080: Customer Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Auto-validated by system; auto-reject on failure
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### FLD-081: QID / ID Type and Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Auto-validated by system; auto-reject on failure
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### FLD-082: Service Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Auto-validated by system; auto-reject on failure
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

### FLD-083: Consumer Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Auto-validated by system; auto-reject on failure
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “System auto-validates customer name, QID/ID type and number, service type and consumer type, and auto-rejects on failure”

## Fixed/5G TON (4 fields)

### FLD-099: OSN Add-on
`Explicit` · confidence: `high`

- **Data type:** checkbox/toggle
- **Mandatory:** No
- **Validation rule:** Removed at TON, re-added afterward
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “Fixed/5G TON covered separately: OSN add-on removal and re-add, login/email re-registration, spend limit control during transition, and bill cycle adjustment”

### FLD-100: Login/Email
`Explicit` · confidence: `high`

- **Data type:** text/email
- **Mandatory:** Yes
- **Validation rule:** Requires re-registration during TON
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “login/email re-registration, spend limit control during transition, and bill cycle adjustment”

### FLD-101: Spend Limit
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** No
- **Validation rule:** Controlled during transition period
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “spend limit control during transition, and bill cycle adjustment”

### FLD-102: Bill Cycle
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Validation rule:** Adjusted as part of TON
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “and bill cycle adjustment”

## Billing Account / Bill Profile (4 fields)

### FLD-110: Bill Profile
`Explicit` · confidence: `high`

- **Data type:** record/entity
- **Mandatory:** Yes
- **Validation rule:** One billing account holds exactly one bill profile; multiple services can link to one billing account
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “introduce a new billing account entity — multiple services can link to one billing account; billing account holds one bill profile”

### FLD-111: Billing Address
`Explicit` · confidence: `high`

- **Data type:** text/address
- **Mandatory:** Yes
- **Validation rule:** Can differ from customer address
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “billing address can differ from customer address”

### FLD-112: Bill Email Recipients (CC)
`Explicit` · confidence: `high`

- **Data type:** text/email (multi-value)
- **Mandatory:** No
- **Validation rule:** Supports multiple recipients and multiple email types per contact (work/personal); billing profile linked to a contact for traceability
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “support multiple bill email recipients (CC) and multiple email types per contact (work/personal); billing profile to be linked to a contact for traceability”

### FLD-113: Email Verification Status
`Explicit` · confidence: `high`

- **Data type:** status/enum
- **Mandatory:** No
- **Default value:** unverified
- **Validation rule:** Captured as unverified at entry, verified asynchronously via callback before next bill generation
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “emails captured as unverified at entry, verified asynchronously via callback before next bill generation”

## Device Installment (DOI) - Portal (4 fields)

### FLD-147: DOI Eligibility (big data/QID-based)
`Explicit` · confidence: `high`

- **Data type:** derived/calculated (system check)
- **Mandatory:** Yes
- **Validation rule:** Portal eligibility via "big data" logic on QID
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “current retail process (portal eligibility via "big data" logic on QID, WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order)”

### FLD-148: Stock Check/Reservation (WinCash)
`Explicit` · confidence: `high`

- **Data type:** derived/calculated (system check)
- **Mandatory:** Yes
- **Validation rule:** Stock validated and reserved via WinCash
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “WinCash stock check/reservation, signature pad in portal, WinCash payment, Siebel order”

### FLD-149: Signature Pad (in portal)
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “signature pad in portal, WinCash payment, Siebel order”

### FLD-150: Installment Breakdown
`Explicit` · confidence: `high`

- **Data type:** calculated table
- **Mandatory:** Yes
- **Validation rule:** Target DXP flow: displayed after identity/DOI validation via EDW and product catalog selection
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “identity validation and DOI validation (via EDW) in DXP, product catalog in DXP, installment breakdown, stock validation/reservation and first-installment payment in WinCash”

## Cross Sales – QID Offers grid (4 fields)

### FLD-271: CampaignCode / OfferName / PromotionId
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “CampaignCode 000001247, OfferName "New Gigahome Testahil plan", PromotionId 1-5XBWM5D, OfferType New Fiber, Price 0, MonthlyRental 299, Status Offered”

### FLD-272: OfferType
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “OfferType: New Fiber”

### FLD-273: MonthlyRental
`Explicit` · confidence: `high`

- **Data type:** currency/number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “MonthlyRental 299”

### FLD-274: Status
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Status Offered”

## New Fixed Line – Book Appointment modal (4 fields)

### FLD-285: Cluster
`Explicit` · confidence: `high`

- **Data type:** dropdown / radio
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Book Appointment modal: Cluster field, calendar (April 13, 2026 selected), time-slot toggle”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Select Cluster" radio — Cluster 1 (selected) / Cluster 2; June 2024 calendar with the 5th selected; time-slot buttons "11AM - 2PM" (selected)”

### FLD-286: Time slot
`Explicit` · confidence: `high`

- **Data type:** radio/toggle
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “time-slot toggle (2PM-5PM selected / 5PM-8PM)”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “time-slot buttons "11AM - 2PM" (selected) as part of Step 6 Book Appointment”

### FLD-287: Booking Comments
`Explicit` · confidence: `high`

- **Data type:** text
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Booking Comments = "TESTING FL CROSS SALES"”

### FLD-288: Collect QID / Collect CAF / FNP Identifier / FNP Execution Date
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum(Yes/No)
- **Default value:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “dropdowns Collect QID (No) / Collect CAF (No) / FNP Identifier (No) / FNP Execution Date”

## CAF - Section 2 Billing information (4 fields)

### FLD-357: Bill format
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Detail
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Bill format Detail”

### FLD-358: Bill language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** English
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Bill language English”

### FLD-359: Bill delivery mode
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Email
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Bill delivery mode Email”

### FLD-360: Payment method
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Invoice
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Payment method Invoice (other billing/card fields blank)”

## FWA negative scenarios - Address step (4 fields)

### FLD-422: Street No.
`Explicit` · confidence: `high`

- **Data type:** numeric text
- **Mandatory:** Yes
- **Validation rule:** numeric, max 5 characters
- **Error message:** “Please enter an numeric Street No. of 5 characters or less.”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Street No. changed to "5666666" (7 numeric characters, over the 5-character limit)... Please enter an numeric Street No. of 5 characters or less.”

### FLD-423: Building No.
`Explicit` · confidence: `high`

- **Data type:** numeric text
- **Mandatory:** Yes
- **Validation rule:** numeric only, max 5 characters
- **Error message:** “Please enter an numeric Building No. of 5 characters or less.”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Building No.="67K" (contains a letter)... Please enter an numeric Building No. of 5 characters or less.”

### FLD-424: Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** required
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Apt/Flat/Unit=78B”

### FLD-425: Area
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Validation rule:** required
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “Area=Al Rayyan”

## FWA Address (Step 2) (4 fields)

### FLD-449: Street No.
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** Required to save address
- **Editable rule:** Editable
- **Error message:** “Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit., Area”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Submitting empty triggers dialog: "Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent fills Zone: 11, Street No.: 44, Building No.: 77”

### FLD-450: Building No.
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** Required to save address
- **Editable rule:** Editable
- **Error message:** “Please enter required fields / Zone, Street No., Building No., Apt/Flat/Unit.,Area (via shared Address step validation)”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Agent fills Zone: 11, Street No.: 44, Building No.: 77”

### FLD-451: Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Required to save address
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Apt/Flat/Unit: 99V”

### FLD-452: Area
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Required to save address
- **Editable rule:** Editable (dropdown)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Area "Al Rayyan" (dropdown)”

## WFM End Activity (4 fields)

### FLD-494: Activity Remarks
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Empty Activity Remarks box, dropdown "Customer Available"”

### FLD-495: Customer Available
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “dropdown "Customer Available"”

### FLD-496: Next Activity
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** No
- **Default value:** I will be idle for a while
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “"Next Activity" = "I will be idle for a while"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Customer Signature (signed), "Next Activity" = "I will be idle for a while". Submit.”

### FLD-497: Customer Signature (end)
`Explicit` · confidence: `high`

- **Data type:** signature capture
- **Mandatory:** Yes
- **Editable rule:** Drawn on pad
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Customer Signature (signed), "Next Activity" = "I will be idle for a while". Submit.”

## MNP Postpaid – Address (4 fields)

### FLD-523: Zone
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** 13 (desktop example); left blank on tablet variant
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Zone 13, Street No. 45, Building No. 345, Apt/Flat/Unit H7882”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Fields: Zone, Street No., Building No., Apt/Flat/Unit — all left blank. Buttons: Save Address, Skip Address, Go back, Cancel”

### FLD-524: Street No.
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** 45 (desktop example); left blank on tablet variant
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Street No. 45”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Fields: Zone, Street No., Building No., Apt/Flat/Unit — all left blank. Buttons: Save Address, Skip Address, Go back, Cancel”

### FLD-525: Building No.
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** 345 (desktop example); left blank on tablet variant
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Building No. 345”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Fields: Zone, Street No., Building No., Apt/Flat/Unit — all left blank. Buttons: Save Address, Skip Address, Go back, Cancel”

### FLD-526: Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Default value:** H7882 (desktop example); left blank on tablet variant
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Apt/Flat/Unit H7882”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Fields: Zone, Street No., Building No., Apt/Flat/Unit — all left blank. Buttons: Save Address, Skip Address, Go back, Cancel”

## MNP Donor Details (Postpaid/Prepaid MNP journeys) (4 fields)

### FLD-556: Port-in Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 97466667890 (Postpaid example) / 97466000534 (Prepaid example)
- **Validation rule:** green check appears on valid entry
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Port-in Number = 97466667890 (green check)”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Fields: Port-in Number 97466000534, Donor ID Type = Passport”

### FLD-557: Donor ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** BV7383 (Postpaid example) / KJSH0934989 (Prepaid example)
- **Validation rule:** green check appears on valid entry
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Donor ID = BV7383 (green check)”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Donor ID KJSH0934989, Donor Type = Consumer”

### FLD-558: Donor ID Type / Donor Operator
`Explicit` · confidence: `low`

- **Data type:** dropdown/enum
- **Default value:** Passport (Donor ID Type, Postpaid) / Qtel (Donor Operator, Prepaid)
- **Editable rule:** greyed/read-only (Donor Operator, per Prepaid journey)
- **Error message:** “Note: Make sure correct information is provided to avoid rejection of request.”
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Donor ID Type = Passport”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Donor Operator = Qtel (greyed/read-only); Note: Make sure correct information is provided to avoid rejection of request.”

### FLD-559: Subscription Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Postpaid or Prepaid depending on journey
- **Error message:** “Note: Make sure correct information is provided to avoid rejection of request.”
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Subscription Type = Postpaid with info note 'Enter your service type from other operator.'; Note: Make sure correct information is provided to avoid rejection of request.”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Subscription Type = Prepaid, with helper text 'Enter your service type from other operator.'”

## Address (New Postpaid wizard) (4 fields)

### FLD-620: Zone
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Skip Address allowed
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Step '2. Address' expanded with empty fields: Zone, Street No., Building No., Apt/Flat/Unit; buttons Save Address / Skip Address / Cancel / Go Back”

### FLD-621: Street No.
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Skip Address allowed
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

### FLD-622: Building No.
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Skip Address allowed
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

### FLD-623: Apt/Flat/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** Skip Address allowed
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Zone, Street No., Building No., Apt/Flat/Unit”

## Billing (New Postpaid wizard) (4 fields)

### FLD-624: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** No
- **Default value:** ENG
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email”

### FLD-625: Payment Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Postpaid
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Payment Type Postpaid”

### FLD-626: Payment Method
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** No
- **Default value:** Invoice
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Payment Method Invoice, Bill Media Email”

### FLD-627: Bill Media
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** No
- **Default value:** Email
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Bill Media Email, Name 1-2DO7AXP9, Email Bill To ghkumar10@g...”

## HRN New Postpaid - CAF (Customer Application Form) (4 fields)

### FLD-678: Customer type
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Default value:** Consumer
- **Visibility rule:** Section 1 - Applicant details
- **Editable rule:** read-only (generated)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Section 1 – Applicant details: Customer type Consumer, Name YAM POKHAREL, Date of birth 25-Mar-1976”

### FLD-679: Nationality
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Default value:** Nepalese
- **Visibility rule:** Section 1 - Applicant details
- **Editable rule:** read-only (generated)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Nationality Nepalese, Email noemailid@vodafone.com, PO Box 1111”

### FLD-680: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** display (number)
- **Mandatory:** No
- **Default value:** 1000
- **Visibility rule:** Section 2 - Billing information
- **Editable rule:** read-only (generated, reflects Edit Credit Limit choice)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “Section 2 – Billing information: Account credit limit 1000, Smart Limit 350”

### FLD-681: CAF split-button options
`Explicit` · confidence: `high`

- **Data type:** button group
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “A 'CAF' split-button offers CAF-Digital, CAF-Manual, CAF-Touch Screen”

## Open UI Desktop - Account Summary tab (4 fields)

### FLD-851: Account Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Account Type: Business, Customer Segment: Reimbursement, Credit Limit Amount: 500”

### FLD-852: Customer Segment
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Customer Segment: Reimbursement”

### FLD-853: Credit Limit Amount
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Credit Limit Amount: 500”

### FLD-854: Account Status
`Explicit` · confidence: `high`

- **Data type:** status/enum
- **Mandatory:** Unknown
- **Default value:** Active
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “status "Active" (green check)”

## Open UI Desktop - Account Summary tab (Installed Assets panel) (4 fields)

### FLD-858: Plan Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Postpaid Business Employee Plan Promotion”

### FLD-859: Phone Number
`Explicit` · confidence: `high`

- **Technical name:** MSISDN
- **Data type:** text/number
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Phone Number 97472501217”

### FLD-860: Status
`Explicit` · confidence: `high`

- **Data type:** status/enum
- **Mandatory:** Unknown
- **Default value:** Active
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Status Active”

### FLD-861: Billing Profile
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Billing Profile 1-1G1ZCXFW”

## Open UI Desktop - Asset detail expanded (Bill Details card) (4 fields)

### FLD-882: Bill Profile Status
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Default value:** Active
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Bill Profile Status: Active”

### FLD-883: Payment Type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Default value:** Postpaid
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Payment Type: Postpaid, Bill Cycle: 1”

### FLD-884: Email Bill To
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Email Bill To: anuj.yadav@vodafone.qa”

### FLD-885: Over Due Amount / Total Due Amount
`Explicit` · confidence: `high`

- **Data type:** currency
- **Mandatory:** Unknown
- **Default value:** blank
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Over Due Amount / Total Due Amount both blank”

## SMS Templates - Automatic SMS Templates sheet (4 fields)

### FLD-917: Keyword
`Explicit` · confidence: `high`

- **Technical name:** Keyword
- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “keyed by Keyword, with TT (Trouble Ticket) Source/Category/Area/Sub Area/Status fields, e.g. `Automatic TON SMS`”

### FLD-918: Do not send SMS
`Explicit` · confidence: `high`

- **Technical name:** Do not send SMS
- **Data type:** boolean/checkbox
- **Mandatory:** Unknown
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “Columns: Keyword | TT Source | TT Category | TT Area | TT Sub Area | TT Status | Do not send SMS | Language | Status”

### FLD-919: Language
`Explicit` · confidence: `high`

- **Technical name:** Language Code
- **Data type:** enum
- **Mandatory:** Unknown
- **Default value:** ENU/ARA/HIN/MAL
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “Locale/Language Code columns (ENU, ARA, HIN, MAL) drive language selection”

### FLD-920: System Template Flag
`Explicit` · confidence: `high`

- **Technical name:** System Template Flag
- **Data type:** boolean
- **Mandatory:** Unknown
- **Default value:** Y
- **Editable rule:** protects system-owned templates from editing when Y
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “System Template Flag ("Y") distinguishes protected/system-owned templates from editable ones”

## DXP Agent Portal wireframe - J011 process flow (bill profile capture) (4 fields)

### FLD-940: Bill address
`Explicit` · confidence: `high`

- **Data type:** address
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

### FLD-941: Bill cycle
`Explicit` · confidence: `high`

- **Data type:** enum/number
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

### FLD-942: Bill period
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Editable rule:** non-editable
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill period non-editable”

### FLD-943: Bill mode
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “bill profile capture (bill address, bill cycle, bill period non-editable, bill mode)”

## J011 Mobile Post-Paid Customer Onboarding (4 fields)

### FLD-953: Bill Profile
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “bill profile capture”

### FLD-954: SIM/MSISDN
`Explicit` · confidence: `medium`

- **Technical name:** MSISDN
- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM/MSISDN addition”

### FLD-956: ID Scan
`Explicit` · confidence: `medium`

- **Data type:** file upload
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID scan”

### FLD-957: Unica Campaign Reference
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “Unica Campaign reference”

## Billing Profile (3 fields)

### FLD-006: Billing profile name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** Freely renameable by agents today, causing divergence with BRM; decision made to add an unchangeable identifier alongside it
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Billing profile is the driver for billing, barring and payment posting but has no unchangeable common correlation ID between CRM and BRM...agents can freely rename it, causing divergence.”

### FLD-007: Billing profile unique identifier (BRM row ID + CRM identifier)
`Explicit` · confidence: `high`

- **Technical name:** BRM row ID
- **Data type:** text/ID
- **Mandatory:** Yes
- **Editable rule:** Not editable (unchangeable identifier by design decision)
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Decision: keep the name renameable but add an unchangeable identifier (BRM row ID + unique CRM identifier) to correlate the two systems.”

### FLD-008: Billing type flag (PIA / arrears / hybrid)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Collections requested a billing profile flag for billing-in-advance (PIA) / arrears / hybrid.”

## Bill Landing / Bill Simulation Display (3 fields)

### FLD-016: Monthly Recurring Charge (MRC) summary
`Explicit` · confidence: `high`

- **Technical name:** MRC
- **Data type:** currency/number
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Bill display: requested summarised bill landing view (MRC, VAS, VAT), search inside bill for enterprise, unified usage view — constrained by whether BRM exposes needed APIs.”

### FLD-017: VAS summary
`Explicit` · confidence: `high`

- **Technical name:** VAS
- **Data type:** currency/number
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “requested summarised bill landing view (MRC, VAS, VAT)”

### FLD-018: VAT summary
`Explicit` · confidence: `high`

- **Technical name:** VAT
- **Data type:** currency/number
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “requested summarised bill landing view (MRC, VAS, VAT)”

## Bulk Activation Template (target DSP) (3 fields)

### FLD-038: Plan (per row, varying)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Target requirement: standardised bulk templates on the DSP front end...supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles within a service”

### FLD-039: Spend limit (per row, varying)
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “supporting varying plans/spend limits/discounts/price overrides across accounts and billing profiles within a service”

### FLD-040: Per-row success/failure status
`Explicit` · confidence: `high`

- **Data type:** text/status
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “reporting per-row success/failure status.”

## FNP Order / Trouble Ticket (3 fields)

### FLD-068: Karma ID (Kahramaa ID)
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “FNP form (mandatory Karma ID) and ID sent via NPAS to Ooredoo, who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date.”

### FLD-069: Manually calculated target date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “a trouble ticket is raised with a manually calculated target date”

### FLD-070: Outstanding due amount (visible)
`Explicit` · confidence: `high`

- **Data type:** currency/number
- **Mandatory:** Conditional
- **Validation rule:** Displayed when conditionally accepted; 3 working days for consumer to clear
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “who validate documents, conditionally accept with a visible due amount (3 working days for consumer to clear), then accept with a porting date.”

## Trouble Ticket - MNP Port-Out (3 fields)

### FLD-124: Unbilled Amount (auto-fetched)
`Explicit` · confidence: `high`

- **Data type:** number/currency (read-only)
- **Mandatory:** No
- **Validation rule:** Auto-fetched by system
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched”

### FLD-125: DOI Outstanding Amount
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** No
- **Validation rule:** NOT auto-fetched, must be entered/checked manually
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “unbilled amount is auto-fetched, DOI outstanding amount is NOT auto-fetched”

### FLD-126: Star Number Port-Out Block (commitment period)
`Explicit` · confidence: `high`

- **Data type:** business rule/config (boolean block)
- **Mandatory:** No
- **Validation rule:** Configurable; blocks porting during commitment period; built after customers took high-value star numbers and immediately ported out
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Star number port-out control blocks porting during the commitment period (configurable), built after customers took high-value star numbers and immediately ported out”

## Trouble Ticket (general) (3 fields)

### FLD-127: Public Notes
`Explicit` · confidence: `high`

- **Data type:** text (notes)
- **Mandatory:** No
- **Validation rule:** Retained indefinitely, no retention limit
- **Visibility rule:** Currently less prominent than bell icon notification, agents miss them (improvement wish: make as prominent as bell icon)
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “make public notes as prominent as the bell icon (agents currently miss them)”

### FLD-128: Audit Trail
`Explicit` · confidence: `high`

- **Data type:** log/read-only
- **Mandatory:** No
- **Visibility rule:** Exists on tickets and account tabs but is role-restricted from agents
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “audit trail exists on tickets and account tabs but is role-restricted from agents”

### FLD-129: Assign to Me
`Explicit` · confidence: `high`

- **Data type:** button/action
- **Mandatory:** No
- **Validation rule:** Only works if the agent is in that queue's user list
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “"assign to me" only works if the agent is in that queue's user list”

## Prepaid-to-Postpaid Migration - Eligibility (3 fields)

### FLD-138: Minimum Age on Network
`Explicit` · confidence: `high`

- **Data type:** number (months, manual check today)
- **Mandatory:** Yes
- **Default value:** 1 month
- **Validation rule:** Minimum one month age on network (manual today, to be automated)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “eligibility checks (manual today, to be automated): minimum one month age on network, minimum 50 Riyal recharge in the last month, CDR-based usage history check”

### FLD-139: Minimum Recharge Amount (last month)
`Explicit` · confidence: `high`

- **Data type:** number/currency (manual check today)
- **Mandatory:** Yes
- **Default value:** 50 QAR
- **Validation rule:** Minimum 50 Riyal recharge in last month
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “minimum 50 Riyal recharge in the last month”

### FLD-140: CDR-Based Usage History Check
`Explicit` · confidence: `high`

- **Data type:** derived/calculated (manual today)
- **Mandatory:** Yes
- **Validation rule:** Manual today, to be automated; prevents abuse of prepaid-to-postpaid migration
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “CDR-based usage history check [00:32:14, 00:32:26, 00:33:16]”

## Prepaid CAF - Applicant details (3 fields)

### FLD-204: Full name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Full name*, Valid Qatari ID/RP Number/Passport Number*/GCC ID”

### FLD-205: Valid Qatari ID/RP Number/Passport Number/GCC ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Full name*, Valid Qatari ID/RP Number/Passport Number*/GCC ID, Expiry of Qatari ID/RP Number/Passport Number*/GCC ID*”

### FLD-206: Expiry of Qatari ID/RP Number/Passport Number/GCC ID
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Expiry of Qatari ID/RP Number/Passport Number*/GCC ID*”

## Cross Sales → New Fixed Line – Contact re-confirmed (3 fields)

### FLD-277: Digital Lead/Sale
`Explicit` · confidence: `high`

- **Data type:** text/enum(Yes/No)
- **Default value:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “additional Fixed-Line-specific fields: Digital Lead/Sale (No), Enter ECR Details (No), Get IPTV?”

### FLD-278: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** text/enum(Yes/No)
- **Default value:** No
- **Visibility rule:** To be filled by Fulfillment team only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Enter ECR Details (No, "To be filled by Fulfillment team only")”

### FLD-279: Get IPTV?
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum(Yes/No)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Get IPTV?”

## Fulfilment – Step 1 Contact confirmation (3 fields)

### FLD-297: ID Expiry / Nationality / Gender / Name / Birth date
`Explicit` · confidence: `high`

- **Data type:** date/text
- **Editable rule:** read-only/greyed
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “contact details auto-populate (read-only/greyed): ID Expiry 6/5/2025, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990”

### FLD-298: Digital Lead/Sale / Lead-Opportunity ID
`Explicit` · confidence: `high`

- **Data type:** enum(Yes/No)
- **Default value:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Digital Lead/Sale = No, Lead/Opportunity ID blank”

### FLD-299: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** enum(Yes/No)
- **Default value:** No
- **Visibility rule:** To be filled by Fulfillment team only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Enter ECR Details = No (green check, tooltip "To be filled by Fulfillment team only")”

## CAF - Section 4 Superfast Broadband & Home Phone (3 fields)

### FLD-361: Service Number
`Explicit` · confidence: `high`

- **Data type:** phone number
- **Mandatory:** Yes
- **Editable rule:** auto-populated from reserved number
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Service Number `97441224273`”

### FLD-362: International Calling Enabled
`Explicit` · confidence: `high`

- **Data type:** boolean (Y/N)
- **Mandatory:** Yes
- **Default value:** Y
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “International Calling Enabled `Y`”

### FLD-363: Appointment Details (Appointment ID / Date)
`Explicit` · confidence: `high`

- **Data type:** text/date
- **Mandatory:** Conditional
- **Default value:** blank
- **Visibility rule:** remains blank under Instant Activation (no appointment)
- **Editable rule:** populated only when a technician appointment is booked
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Appointment Details: "Appointmnet ID: Appointment Date: -" (blank — consistent with no technician visit needed under Instant Activation)”

## FWA Outdoor WFM - Serial Number Check screen (3 fields)

### FLD-410: CPE Indoor
`Explicit` · confidence: `high`

- **Data type:** barcode-scan/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “"Serial Number Check - Dual Play" screen with barcode-scan fields: CPE Indoor "2EQTE24314000124"”

### FLD-411: CPE Outdoor
`Explicit` · confidence: `high`

- **Data type:** barcode-scan/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “CPE Outdoor "S180P18075124"”

### FLD-412: SIM Card
`Explicit` · confidence: `high`

- **Data type:** barcode-scan/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “SIM Card "8942702800801190322"”

## FWA CAF (Step 8) attachments (3 fields)

### FLD-470: Proof of Employment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Conditional
- **Validation rule:** Required in B2B2C scenario before continuing
- **Visibility rule:** Shown for B2B2C/Employer-sponsored plans
- **Editable rule:** Uploadable
- **Error message:** “Error: Please select Proof of Employment before continuing.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Attachment tiles then appear: Proof of Employment* (required)... "Error: Please select Proof of Employment before continuing."”

### FLD-471: Supplementary Form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Required before continuing
- **Editable rule:** Uploadable
- **Error message:** “Error: Please select Supplementary Form before continuing.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Red banner: "Error: Please select Supplementary Form before continuing."”

### FLD-472: Add File (additional attachment)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** No
- **Editable rule:** Optional uploadable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Add File (optional).”

## WFM Serial Number Check - Dual Play (3 fields)

### FLD-478: CPE Indoor serial
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Validation rule:** Validated against inventory
- **Editable rule:** Editable, scannable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Fields (with barcode-scan icons): CPE Indoor 2EQTE24314000127, CPE Outdoor S180P18075127, SIM Card 8942702800801190325. All validated (green checks).”

### FLD-479: CPE Outdoor serial
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Validation rule:** Validated against inventory
- **Editable rule:** Editable, scannable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “CPE Outdoor S180P18075127”

### FLD-480: SIM Card serial
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Validation rule:** Validated against inventory
- **Editable rule:** Editable, scannable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “SIM Card 8942702800801190325”

## WFM Activity details (on-site) (3 fields)

### FLD-481: Port Miss-match ?
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Checkbox "Port Miss-match ?" unchecked.”

### FLD-482: Add STB Count
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 0
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Device Details: Add STB Count 0; OSN_STB_COUNT 0”

### FLD-483: Replacement Needed ?
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Replacement Details checkbox "Replacement Needed ?" unchecked.”

## MNP Postpaid Contact (Step 1) (3 fields)

### FLD-499: Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date
`Explicit` · confidence: `high`

- **Data type:** text (read-only, auto-populated)
- **Mandatory:** Unknown
- **Validation rule:** Green check confirms validity on lookup
- **Editable rule:** Read-only, system-populated after ID lookup
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “fields Qatari ID 29035654458, Id expiry 5/11/2027, Nationality Indian, Gender M, First name VISHAKAN, Last name SOUNDARARAJAN, Birth date 7/3/1990”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Please insert or scan the customer's Qatari Id: field Qatari ID = 29035654458, a green check confirming validity”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “read-only fields: Qatari ID 29035654458, Id expiry 4/21/2026”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Gender M”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “First name Vishakan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Last name Soundararajan”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Birth date 3/7/1990”

### FLD-500: Digital Lead/Sale
`Explicit` · confidence: `high`

- **Data type:** dropdown/radio (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “a Digital Lead/Sale radio defaulted to "No"”
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Digital Lead/Sale = No (radio)”

### FLD-501: Email
`Explicit` · confidence: `high`

- **Data type:** text/email
- **Mandatory:** No
- **Validation rule:** Green checkmark validation
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Email c.vishakan@maveric-system..., No Email unchecked, Preferred Language English, Alt. phone # 97431345716”

## MNP Postpaid – Contact (3 fields)

### FLD-519: Email
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** nobill@vfq.com (desktop example); noemailid@vodafone.com (tablet example, auto-filled)
- **Validation rule:** Green check confirms validity; on tablet variant email may be auto-filled with a placeholder address (e.g. noemailid@vodafone.com) when a 'No Email' checkbox is ticked
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Email nobill@vfq.com (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Email field auto-filled with noemailid@vodafone.com (green check), checkbox 'No Email' ticked”

### FLD-520: Preferred Language / Language
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** English
- **Validation rule:** Green check on selection (tablet variant)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Preferred Language English (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Language = English (green check)”

### FLD-521: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 97412341234
- **Validation rule:** green check confirms validity
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Alt. phone # 97412341234 (required, green check)”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Alt. phone # = 97412341234 (green check)”

## Sales Order (submitted) (3 fields)

### FLD-543: Order #
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1-28920871362
- **Editable rule:** system-generated
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Siebel Sales Order (Order # 1-28920871362)”

### FLD-544: Order Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Activation
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Order Type Activation, Order Sub Type Port-In”

### FLD-545: Order Sub Type
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Port-In
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Order Sub Type Port-In”

## MNP Prepaid – Contact confirmation (3 fields)

### FLD-567: MOI Validation status
`Explicit` · confidence: `high`

- **Data type:** text
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “blue banner 'MOI Validation completed, please confirm the contact details'”

### FLD-568: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Egyptian
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Nationality Egyptian, Gender M, First name KOURASHY, Last name ABDELGHANY”

### FLD-569: Email
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** nobill@vod.com
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Email nobill@vod.com, Language English, Alt. phone # 97411111111”

## Lead Details View (Fixed) (3 fields)

### FLD-579: Lead Status
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** In Progress
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Mobile # 97410001000, Lead Status In Progress, Lead Sub Status Call Back”

### FLD-580: Lead Sub Status
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Call Back
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Lead Sub Status Call Back”

### FLD-581: Reject Reason Code
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** shown invalid/empty, outlined red when required and not filled
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “required Reject Reason Code dropdown (shown invalid/empty, outlined red) and Reject Comment text field”

## Admin Lead Details View (full) (3 fields)

### FLD-591: Alternate Mobile#
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 97412341234
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Alternate Mobile# 97412341234”

### FLD-592: Outlet Id
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1234
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Outlet Id 1234, Lead Owner VINODHINIR, Ownership History (lookup, blank shown), Assigned Team 'Testing.'”

### FLD-593: Assigned Team
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Testing
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Assigned Team 'Testing.'”

## Cross Sales - Connection Details modal (3 fields)

### FLD-609: Total Number of Prepaid Connections
`Explicit` · confidence: `high`

- **Data type:** number (display)
- **Mandatory:** No
- **Visibility rule:** Shown after Contact ID lookup
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Total Number of Prepaid Connections: 0'”

### FLD-610: Total Number of Postpaid Connections
`Explicit` · confidence: `high`

- **Data type:** number (display)
- **Mandatory:** No
- **Validation rule:** Triggers warning banner when >=2
- **Visibility rule:** Shown after Contact ID lookup
- **Editable rule:** read-only
- **Error message:** “Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding”
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Total Number of Postpaid Connections: 2', with note: 'Note - Customer already has 2 or more Post-paid connections...'”

### FLD-611: Show Postpaid Plan Details
`Explicit` · confidence: `high`

- **Data type:** button (expander)
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A 'Show Postpaid Plan Details' button expands a list of the customer's existing postpaid plans”

## Number Selection (New Postpaid wizard) (3 fields)

### FLD-628: Reserved Numbers grid
`Explicit` · confidence: `high`

- **Data type:** grid
- **Mandatory:** No
- **Default value:** No Records
- **Visibility rule:** Empty until reservation confirmed
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Reserved Numbers' grid is empty ('No Records')”

### FLD-629: Unreserved Numbers grid
`Explicit` · confidence: `high`

- **Data type:** grid
- **Mandatory:** No
- **Editable rule:** Select/reserve action
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Unreserved Numbers' grid lists one candidate: Mobile / FREE / CONSUMER / (Start) Number 97470345802 / Price From QR0.00 / Status BLOCKED / Reserved By SUYASHKULKARNI_VFQ”

### FLD-630: Reservation success alert
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Visibility rule:** Fires on successful reserve
- **Error message:** “SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “native browser alert reads: 'SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)'”

## New Sales Order header (3 fields)

### FLD-656: Order Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Activation
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Order # 1-28929093512, Type 'Sales Order', Order Type 'Activation', Status 'Pending'”

### FLD-657: Billing Profile
`Explicit` · confidence: `high`

- **Data type:** text/display
- **Mandatory:** No
- **Default value:** 1-D87EQYB
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Billing Profile '1-D87EQYB', Billing Profile Type 'Postpaid'”

### FLD-658: Price List
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** VFQA PriceList
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Price List 'VFQA PriceList', Currency 'QAR'”

## Bill Limit Mobile Plus - Customize detail panel (3 fields)

### FLD-666: SL Limit Amount
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Yes
- **Default value:** 75 (in example, entered by agent)
- **Validation rule:** Must not be lower than product's Agent Min Value or order validation fails (SBL-EXL-00151)
- **Visibility rule:** under 'Spend Limit Amounts' tab
- **Editable rule:** editable
- **Error message:** “Bill Limit can not be set lower than Agent Minimum 80
Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Limit Amount = 75, SL Min Value = .01, SL Default Value = 20... 'Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-DAFQWTQ.(SBL-EXL-00151)'”

### FLD-667: SL Min Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** .01
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Min Value = .01, SL Default Value = 20”

### FLD-668: SL Default Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 20
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “SL Default Value = 20”

## Order Line Item Detail - Spend Limit Amounts (Vanilla Pre2Post) (3 fields)

### FLD-735: SL Limit Amount
`Explicit` · confidence: `high`

- **Technical name:** SL Limit Amount
- **Data type:** number
- **Mandatory:** Yes
- **Default value:** 20 (SL Default Value)
- **Validation rule:** Cannot be set lower than the Agent Minimum for the selected Bill Limit product (e.g. 80 for Bill Limit Mobile Plus)
- **Error message:** “Bill Limit can not be set lower than Agent Minimum 80 Please Contact the System Administrator with Reference # 1-D982OQU.(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “SL Limit Amount 55, SL Min Value .01, SL Default Value 20 ... Bill Limit can not be set lower than Agent Minimum 80 ... (SBL-EXL-00151)”

### FLD-736: SL Min Value
`Explicit` · confidence: `high`

- **Technical name:** SL Min Value
- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** .01
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “SL Limit Amount 55, SL Min Value .01, SL Default Value 20”

### FLD-737: SL Default Value
`Explicit` · confidence: `high`

- **Technical name:** SL Default Value
- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 20
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Line Item Attributes grid confirms SL Default Value=20, SL Limit Amount=55, SL Min Value=.01”

## Connection Details modal (Open UI Desktop Pre2Post) (3 fields)

### FLD-751: Total Number of Prepaid Connections
`Explicit` · confidence: `high`

- **Data type:** number (read-only)
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Total Number of Prepaid Connections: 1', 'Total Number of Postpaid Connections: 1'”

### FLD-752: Total Number of Postpaid Connections
`Explicit` · confidence: `high`

- **Data type:** number (read-only)
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Total Number of Postpaid Connections: 1'”

### FLD-753: info banner
`Explicit` · confidence: `high`

- **Data type:** text (system message)
- **Mandatory:** Unknown
- **Error message:** “undefined”
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “an info banner reading literally 'undefined' (appears to be a broken/placeholder system message)”

## Postpaid - Contact (Open UI Desktop Pre2Post, Step 1 continued) (3 fields)

### FLD-754: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Default value:** nobill@vfq.com
- **Validation rule:** validated (green checkmark)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Email: nobill@vfq.com (green checkmark = validated)”

### FLD-755: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Default value:** English
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Language: English”

### FLD-756: Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** phone
- **Mandatory:** Yes
- **Validation rule:** validated (green checkmark)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Alt. phone #: 97412341234 (green checkmark = validated)”

## Migration Offer tab (Autobase Pre2Post asset view) (3 fields)

### FLD-775: Migration Offers grid - OfferName
`Explicit` · confidence: `high`

- **Technical name:** OfferName
- **Data type:** text (system-generated)
- **Mandatory:** Unknown
- **Default value:** Postpaid U Start Promotion
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “OfferName 'Postpaid U Start Promotion', OfferDescription 'U Plus with 20% Discount for 6 Months + International 15'”

### FLD-776: Migration Offers grid - Status
`Explicit` · confidence: `high`

- **Technical name:** Status
- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Offered
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Status 'Offered', TreatmentCode 1166.35d.483…, Channel 'Inbound'”

### FLD-777: Accept / Interested / Reject buttons
`Explicit` · confidence: `high`

- **Data type:** button group
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Buttons: Accept / Interested / Reject”

## Base Management wizard - Activity step (Autobase Pre2Post) (3 fields)

### FLD-782: Channel
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Unknown
- **Default value:** Appointment
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Channel dropdown defaulted to 'Appointment'”

### FLD-783: Language
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Language dropdown (blank)”

### FLD-784: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Unknown
- **Validation rule:** Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Comments textarea, info note: 'Please note down a comment regarding the actions performed...'”

## Addon & Discount step (Tablet Pre2Post, Step 3) (3 fields)

### FLD-799: U Plan Options (Change U Plan Benefits)
`Explicit` · confidence: `high`

- **Data type:** button/selector
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “U Plan Options: 'Change U Plan Benefits' button, showing 'U Start 8G_150LMin' selected”

### FLD-800: Paid Add-ons (Select Add-on)
`Explicit` · confidence: `high`

- **Data type:** button/selector
- **Mandatory:** No
- **Validation rule:** Go back to Plan step and edit limit to cover for the add-on amount
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Paid Add-ons: 'Select Add-on' button with note 'Go back to Plan step and edit limit to cover for the add-on amount'”

### FLD-801: Discount (Select Discount)
`Explicit` · confidence: `high`

- **Data type:** button/selector
- **Mandatory:** No
- **Default value:** none chosen
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Discount: 'Select Discount' button (none chosen)”

## Prepaid CAF - header (New Prepaid Tablet) (3 fields)

### FLD-821: Application date
`Explicit` · confidence: `medium`

- **Data type:** date
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Application date* = 1/9/2025”

### FLD-822: Full name
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Full name* = VFQMAV Sourav183”

### FLD-823: Qatari ID/RP/Passport Number
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Qatari ID/RP/Passport Number* = SG1972, Expiry = 02/12/2037”

## Open UI Desktop - Account Summary tab (Whitelisted box) (3 fields)

### FLD-855: Qatari ID
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Qatari ID: 29635618702”

### FLD-856: Date Of Birth
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Date Of Birth: 10/24/1996”

### FLD-857: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Email: anuj.yadav@vodafone.qa”

## Open UI Desktop - Account Summary tab (summary tiles) (3 fields)

### FLD-862: Orders
`Explicit` · confidence: `high`

- **Data type:** number/count
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Orders (87, Open Orders 0, Suspended Orders 0)”

### FLD-863: Trouble Tickets
`Explicit` · confidence: `high`

- **Data type:** number/count
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Trouble Tickets (62, Open Tickets 2, High Priority Tickets 2)”

### FLD-864: Billing Profiles
`Explicit` · confidence: `high`

- **Data type:** number/count
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Billing Profiles (3, Active Billing Profiles 3, Suspended Billing Profiles 0)”

## Open UI Desktop - All Orders grid (3 fields)

### FLD-865: Status
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “columns: Status, Order Date, Type, Order #, MSISDN #, Journey”

### FLD-866: Order Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “columns: Status, Order Date, Type, Order #, MSISDN #, Journey”

### FLD-867: Order #
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “columns: Status, Order Date, Type, Order #, MSISDN #, Journey”

## Open UI Desktop - Asset Summary tab (Postpaid asset card) (3 fields)

### FLD-870: Business Bill Limit
`Explicit` · confidence: `high`

- **Data type:** currency
- **Mandatory:** Unknown
- **Default value:** 0.01
- **Editable rule:** Editable via Change Limit button.
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Business Bill Limit: 0.01 with a "Change Limit" button”

### FLD-871: Activation Date
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Activation Date: 4/28/2025, Postpaid Activation date: 04/28/2025”

### FLD-872: Addons
`Explicit` · confidence: `high`

- **Data type:** multi-select/list
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Addons: SIM Card, Business Bill Limit, Bill Manager, Business Employee Plan, Mobile Voicemail, 4 Pass Access, CNAP Optout MSB”

## Open UI Desktop - Asset detail expanded (Account Details card) (3 fields)

### FLD-874: Account #
`Explicit` · confidence: `high`

- **Data type:** text/ID
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Account #: 113312346011”

### FLD-875: Notification Contact Number
`Explicit` · confidence: `high`

- **Data type:** phone number
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Notification Contact Number: 97472501217”

### FLD-876: LastMonthRevenue
`Explicit` · confidence: `high`

- **Technical name:** LastMonthRevenue
- **Data type:** currency/number
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “LastMonthRevenue: 35.12928”

## Open UI Desktop - Asset detail expanded (Asset Details card) (3 fields)

### FLD-877: MSISDN Status
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Default value:** Active
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “MSISDN Status: Active”

### FLD-878: OG Barred
`Explicit` · confidence: `high`

- **Technical name:** OG Barred
- **Data type:** boolean/enum
- **Mandatory:** Unknown
- **Default value:** No
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “OG Barred: No”

### FLD-879: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** currency
- **Mandatory:** Unknown
- **Default value:** 0.01
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Bill Limit: 0.01”

## J017 Customer 360 - Agent Search (3 fields)

### FLD-950: Customer No
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “search for customer by Customer No / Contact No / MSISDN”

### FLD-951: Contact No
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “search for customer by Customer No / Contact No / MSISDN”

### FLD-952: MSISDN
`Explicit` · confidence: `medium`

- **Technical name:** MSISDN
- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “search for customer by Customer No / Contact No / MSISDN”

## Ticket Homepage (3 fields)

### FLD-964: Filled by FL Agents (field group)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

### FLD-965: Filled By Complaints Team (field group)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

### FLD-966: Filled by FL Agents (Specific TTs) (field group)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Ticket Homepage (noting fields "Filled by FL Agents", "Filled By Complaints Team", "Filled by FL Agents (Specific TTs)")”

## Unbilled Usage Screen (2 fields)

### FLD-020: MSISDN
`Explicit` · confidence: `high`

- **Technical name:** MSISDN
- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** Mandatory MSISDN + date range (within current cycle) to be enforced
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Unbilled usage screen cannot serve large enterprise accounts (suppressed via exception list because it hangs the system); mandatory MSISDN + date range (within current cycle) to be enforced.”

### FLD-021: Date range
`Explicit` · confidence: `high`

- **Data type:** date range
- **Mandatory:** Yes
- **Validation rule:** Must be within current billing cycle
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “mandatory MSISDN + date range (within current cycle) to be enforced”

## Authorised Person / Chooser record (2 fields)

### FLD-030: Chooser flag
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “company nominates authorised persons on the CR; one or more flagged as "chooser"; requests only accepted from the chooser's registered email.”

### FLD-031: Registered email (chooser)
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Yes
- **Validation rule:** Requests only accepted from the chooser's registered email
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “requests only accepted from the chooser's registered email.”

## Enterprise Mobility Lead-to-Order Documents (2 fields)

### FLD-054: CAF
`Explicit` · confidence: `high`

- **Technical name:** CAF
- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, MSA, and service-specific forms); credit control; discount approval in MS Dynamics via the EBU hierarchy”

### FLD-055: MSA (Master Service Agreement)
`Explicit` · confidence: `high`

- **Technical name:** MSA
- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “document collection (CAF, MSA, and service-specific forms); credit control; discount approval in MS Dynamics via the EBU hierarchy”

## Bulk SMS Onboarding (2 fields)

### FLD-071: Short code
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “Bulk SMS journey walked through end to end: assisted onboarding via account manager with short code and SMTP checks; external international short code registration”

### FLD-072: SMTP check result
`Explicit` · confidence: `high`

- **Data type:** text/status
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “assisted onboarding via account manager with short code and SMTP checks”

## MNP Port-Out Trouble Ticket (Siebel) (2 fields)

### FLD-078: Rejection Reason Code
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** 14-15 rejection reason codes tightly coupled to NPass and cannot be renamed; consumer channel uses only reasons 1, 4 and 9
- **Editable rule:** Codes/names locked to NPass mapping, not customizable in Siebel
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “the 14–15 rejection reason codes are tightly coupled to NPass and cannot be renamed; consumer uses only reasons 1, 4 and 9”

### FLD-079: Detailed Rejection Explanation (ticket level)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Captured at ticket level alongside reason code 1/4/9
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “detailed explanations captured at ticket level”

## SIM Swap - ID Verification (2 fields)

### FLD-117: QID Number (SIM Swap manager bypass)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Agents cannot manually enter ID details, only re-scan; manager-level bypass allows editing QID number only, remaining fields validated against MOI
- **Editable rule:** Manager bypass only, QID field alone
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “agents cannot manually enter ID details, only re-scan; a manager-level bypass allows editing QID number only, with remaining fields validated against MOI”

### FLD-118: Name, DOB, Nationality (MOI match)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Validated via MOI API against OCR-scanned ID, then matched against existing CBS/customer information (extra third validation step for SIM Swap)
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “OCR of ID → match barcode → MOI API (name, DOB, nationality) → match against existing CBS/customer information (SIM Swap has this extra third validation step)”

## Multi-SIM/iWatch (2 fields)

### FLD-143: Secondary MSISDN
`Explicit` · confidence: `high`

- **Data type:** text (phone number, system-linked, invisible to customer)
- **Mandatory:** No
- **Validation rule:** Linked to primary; invisible to customer; up to 4 multi-SIMs depending on plan
- **Visibility rule:** Invisible to customer
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “secondary MSISDN linked to primary but invisible to the customer; up to 4 multi-SIMs depending on plan”

### FLD-144: Multi-SIM Pricing
`Explicit` · confidence: `high`

- **Data type:** number/currency (auto-calculated)
- **Mandatory:** No
- **Validation rule:** Set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “pricing set automatically by system based on plan (e.g., Platino: first free, second 25 Riyal)”

## Fixed Line Order (2 fields)

### FLD-155: FNP (Fixed Number Portability) Option
`Explicit` · confidence: `high`

- **Data type:** checkbox/toggle
- **Mandatory:** No
- **Validation rule:** Hidden for now (capability retained but not exposed) because execution date field is unreliable and pending bills with other operators block order submission
- **Visibility rule:** Hidden
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “FNP (Fixed Number Portability) will be hidden for now (capability retained but not exposed) because the execution date field is unreliable and pending bills with other operators block order submission”

### FLD-156: Supplementary Form
`Explicit` · confidence: `high`

- **Data type:** file upload (non-digital, to be digitized)
- **Mandatory:** Yes
- **Validation rule:** Currently a non-digital attachment; action item to digitalize
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “digitalize the supplementary form, currently a non-digital attachment”

## Prepaid CAF - Acceptance (2 fields)

### FLD-207: Accepting Terms and Conditions
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Accepting Terms and Conditions*, Signature of applicant*”

### FLD-208: Signature of applicant
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`consumer-prepaid-caf-v2-110525-editable-0c369437`](../.knowledge/docs/consumer-prepaid-caf-v2-110525-editable-0c369437.md): “Signature of applicant*, and an acknowledgment statement: "I have received a copy of Vodafone's General Terms and Conditions."”

## Contact record (create) - CRM authorization (2 fields)

### FLD-223: Safwa Contact creation authorization flag
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Conditional
- **Error message:** “You are not authorized to create Safwa Contact”
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Authorization checks: "You are not authorized to create Safwa Contact"; "You are not authorized to create Qatari Contact" (listed twice).”

### FLD-224: Qatari Contact creation authorization flag
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** Conditional
- **Error message:** “You are not authorized to create Qatari Contact”
- **Sources:**
  - [`contact-validation-business-rules-b5d58c84`](../.knowledge/docs/contact-validation-business-rules-b5d58c84.md): “Authorization checks: ..."You are not authorized to create Qatari Contact" (listed twice).”

## Postpaid New Connection - Retail Journey (ID scan/MOI check) (2 fields)

### FLD-225: QID / ID document scan result
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** QID mandatory for postpaid; MOI API primary source, Tarasol/manual fallback only if MOI API doesn't respond
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “QID is mandatory for postpaid — postpaid cannot be sold against any other ID type...MOI API is the primary ID-data source (Tarasol/manual is fallback only if MOI API doesn't respond)”

### FLD-226: Name fields (all MOI-returned, up to ~5-6)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** MOI data takes precedence over OCR-captured data, but only after a secondary-parameter cross-check (DOB, nationality, expiry) passes
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “ALL name fields MOI returns (up to ~5-6) must be stored and printed on the bill — not truncated to first/last name; MOI data takes precedence over OCR-captured data but ONLY after a secondary-parameter cross-check...passes”

## FWA 5G Indoor - Device Scan (2 fields)

### FLD-231: SIM serial scan (from WinCash)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE”

### FLD-232: CPE serial scan (from UIM)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “SIM (from WinCash) and CPE (from UIM) are separately scanned/depleted stock items with separate SPOs; customer cannot bring their own CPE”

## Instant Activation (OpenGate tablet) (2 fields)

### FLD-233: Device serial (agent-verified)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “UIM validates KID-to-CPE mapping and device capability; agent (not customer) verifies device serial; appointment-booking step is auto-skipped and flow goes straight to CAP signature”

### FLD-234: CAP signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “appointment-booking step is auto-skipped and flow goes straight to CAP signature”

## Third-party TON (cancelled ID) - notification (2 fields)

### FLD-247: SMS eligibility notification
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “an SMS is sent to eligible users who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store”

### FLD-248: Physical SIM / eSIM screenshot presentation
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “who must present the physical SIM (or an eSIM screenshot) plus the SMS at a store”

## Cross Sales – Connection Details popup (2 fields)

### FLD-269: Total Number of Prepaid Connections
`Explicit` · confidence: `high`

- **Data type:** number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “A popup shows Total Number of Prepaid Connections: 0, Total Number of Postpaid Connections: 1”

### FLD-270: Total Number of Postpaid Connections
`Explicit` · confidence: `high`

- **Data type:** number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Total Number of Postpaid Connections: 1, with a "Show Postpaid Plan Details" link”

## Cross Sales → New Fixed Line – Contact/Kahramaa step (2 fields)

### FLD-275: Qatari ID (carried over)
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** read-only (locked once carried over from Cross Sales)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “the QID (28335628851) carries over automatically and is greyed out/read-only — the agent cannot re-enter it”

### FLD-276: Kahramaa ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** editable
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Agent enters Kahramaa ID 16A3005 and clicks Go”

## Tablet Combo Box Normal Activation – Step 1 Contact (ID capture) (2 fields)

### FLD-307: Do Not Disturb button
`Explicit` · confidence: `high`

- **Data type:** button/toggle
- **Validation rule:** Set Do Not Disturb if the customer refused the service.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “a DO NOT DISTURB button ("Set Do Not Disturb if the customer refused the service.")”

### FLD-308: ID Type / ID Number
`Explicit` · confidence: `high`

- **Data type:** dropdown/text
- **Mandatory:** Yes
- **Validation rule:** verified via green check
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “ID Type = Qatari ID, ID Number = 27652419981 (verified, green check)”

## New Fixed Line Tablet - Step 1 Contact (ID capture) (2 fields)

### FLD-338: ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Visibility rule:** shown after Instant Activation chosen
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"ID Type" = dropdown set to "Qatari ID"”

### FLD-339: ID Number
`Explicit` · confidence: `high`

- **Data type:** text/barcode-scan
- **Mandatory:** Yes
- **Validation rule:** validated via barcode scan, shows green checkmark when valid
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"ID Number" = `27579200746` with a barcode-scan icon and a green checkmark (validated)”

## New Fixed Line Tablet - Step 1 Contact attachments (2 fields)

### FLD-353: Qatari ID-Front
`Explicit` · confidence: `high`

- **Data type:** file upload (photo)
- **Mandatory:** Yes
- **Validation rule:** required, must be uploaded
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Two required uploaded-photo placeholders both show green checkmarks: "Qatari ID-Front" and "Qatari ID-Back"”

### FLD-354: Qatari ID-Back
`Explicit` · confidence: `high`

- **Data type:** file upload (photo)
- **Mandatory:** Yes
- **Validation rule:** required, must be uploaded
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Qatari ID-Back"”

## New Fixed Line Tablet - Step 5 Number Selection (2 fields)

### FLD-366: Free Number / Reserved Number toggle
`Explicit` · confidence: `high`

- **Data type:** toggle/tab
- **Mandatory:** Yes
- **Default value:** Free Number
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “"Select a Number to Reserve:" (Free Number / Reserved Number tabs)”

### FLD-367: Number Reserve confirmation
`Explicit` · confidence: `high`

- **Data type:** system message
- **Mandatory:** No
- **Error message:** “SUCCESS:Reservation Token:15332433(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “System confirms: "SUCCESS:Reservation Token:15332433(SBL-EXL-00151)"”

## Order Approval - Reject Order dialog (2 fields)

### FLD-379: Reject reason
`Explicit` · confidence: `high`

- **Data type:** dropdown/tag list
- **Mandatory:** Yes
- **Visibility rule:** shown when Reject - Correction clicked
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “Reason selected: "ID image not clear". Other available reasons visible in the dropdown: "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/ Building information", "Bill explainer missing/ Incorrect"”

### FLD-380: Reject Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “A free-text Comments box is filled with "Phoenix Sprint 66 test"”

## FWA Outdoor WFM - CPE Import grid (2 fields)

### FLD-400: Inventory Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “row 1 Inventory Type "5G_OUTDOOR_CPE_SERIAL_NUMBER", Part Number/Name/Model "I-010G-P", Serial No "S180P18075124", Quantity 1”

### FLD-401: Serial No
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Serial No "S180P18075124"”

## FWA Outdoor WFM - End activity popup (2 fields)

### FLD-413: Activity Remarks
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** No
- **Default value:** blank
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Field "Activity Remarks" (blank)”

### FLD-414: Customer Available
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “dropdown "Customer Available" (selected)”

## FWA negative scenarios - SIM Serial step (2 fields)

### FLD-427: SIM Serial
`Explicit` · confidence: `high`

- **Data type:** text (numeric, barcode-scan)
- **Mandatory:** Yes
- **Validation rule:** must be 19 digits; must exist and not already be assigned in UIM
- **Error message:** “Please enter a valid SIM Serial before pressing 'Continue'. / Error: SIM Serial # must be 19 digits. / SIM Card does not exist in UIM(SBL-EXL-00151) / SIM Card already assigned in UIM(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “SIM Serial entered as "894270280080119030" (18 digits). An inline field-level error appears next to the SIM Serial box: "Error: SIM Serial # must be 19 digits."”

### FLD-428: CPE Serial Number
`Explicit` · confidence: `high`

- **Data type:** text (barcode-scan)
- **Mandatory:** Yes
- **Validation rule:** must be free/not-assigned in UIM
- **Error message:** “Please enter a valid CPE Serial before pressing 'Continue'. / CPE Serial Number S180P18055025 is not free in UIM(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “CPE Serial Number "S180P18055025" (green-checked, "Validating Order, please wait..." spinner active), Continue returns a native alert exposing an unhandled backend exception trace”

## FWA Addon & Discount (Step 4) (2 fields)

### FLD-454: Select Add-on
`Explicit` · confidence: `high`

- **Data type:** button opening configurator
- **Mandatory:** No
- **Visibility rule:** Empty if none applicable
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Buttons Select Add-on / Select Discount... if there are no applicable add-on or discount, the selector will be empty.”

### FLD-455: Select Discount
`Explicit` · confidence: `high`

- **Data type:** selection/radio group popup
- **Mandatory:** No
- **Default value:** 100% Discount for 2 Months -FWA
- **Visibility rule:** Empty if none applicable
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Select Discount popup lists two radio groups... 100% Discount for 2 Months -FWA (selected)”

## FWA Number Selection (Step 5) (2 fields)

### FLD-456: Free Number / Reserved Number toggle
`Explicit` · confidence: `high`

- **Data type:** tab toggle
- **Mandatory:** Yes
- **Visibility rule:** FWA journey surfaces only fixed-line reservation, not mobile
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “only the fixed-line number (41202301 / full 97441202301) is offered, confirming the FWA journey surfaces only the FL reservation, not the mobile one”

### FLD-457: Number tile selection
`Explicit` · confidence: `high`

- **Data type:** selection (list of number tiles)
- **Mandatory:** Yes
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Number 41202325 (QR0.00) chosen.”

## FWA SIM Serial (Step 6) (2 fields)

### FLD-458: SIM Serial
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Validation rule:** Must be exactly 19 digits; must not be blank; must not already exist / must be valid & unassigned in UIM; must not already be assigned in UIM
- **Editable rule:** Editable, scannable
- **Error message:** “Please enter a valid SIM Serial before pressing 'Continue'. / Error: SIM Serial # must be 19 digits. / SIM Card does not exist in UIM(SBL-EXL-00151) / SIM Card already assigned in UIM(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Empty submit → "Please enter a valid SIM Serial before pressing 'Continue'."”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “image15: Inline error — "Error: SIM Serial # must be 19 digits." for entry 894270280080119030 (18 digits).”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “image14: JS alert dialog — "SIM Card does not exist in UIM(SBL-EXL-00151)"”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “a browser alert fires: "SIM Card already assigned in UIM(SBL-EXL-00151)".”

### FLD-459: CPE Serial Number
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Validation rule:** Must not be blank; must be free/unassigned in UIM
- **Editable rule:** Editable, scannable
- **Error message:** “Please enter a valid CPE Serial before pressing 'Continue'. / This field is required. / Error invoking service 'VFQA Error Handling Service', method 'HandleException' at step 'Error Handling'.(SBL-BPR-00162) / CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151) / Please Contact the System Administrator with Reference # 1-DNN25H2.(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “CPE-only filled (S180P18055021) → SIM Serial cleared → "Please enter a valid CPE Serial before pressing 'Continue'.", field-level "This field is required."”
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “detailed error dialog: "Error invoking service 'VFQA Error Handling Service'...CPE Serial Number S180P18055021 is not free in UIM(SBL-EXL-00151)...Reference # 1-DNN25H2."”

## MNP Postpaid Plan (Step 5) (2 fields)

### FLD-505: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 150
- **Editable rule:** Editable via "Edit Bill Limit" button
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Bill Limit: 150 (button: "Edit Bill Limit")”

### FLD-506: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 1000
- **Editable rule:** Editable via "Edit Credit Limit" button
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Credit Limit: 1000 (button: "Edit Credit Limit")”

## MNP Postpaid – Contact – Connection Details modal (2 fields)

### FLD-517: Total Number of Prepaid Connections
`Explicit` · confidence: `high`

- **Data type:** number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Total Number of Prepaid Connections: 0”

### FLD-518: Total Number of Postpaid Connections
`Explicit` · confidence: `high`

- **Data type:** number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Total Number of Postpaid Connections: 0”

## MNP Postpaid – Plan detail modal (2 fields)

### FLD-529: Smart Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 20
- **Validation rule:** Bill Limit can not be set lower than Agent Minimum 50
- **Error message:** “Bill Limit can not be set lower than Agent Minimum 50”
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Agent types 28 into the Smart Limit input and clicks Go → validation message appears: 'Bill Limit can not be set lower than Agent Minimum 50'”

### FLD-530: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 1000
- **Editable rule:** read-only display
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Credit Limit: 1000”

## MNP Application Form (MNP-Digital) (2 fields)

### FLD-537: Retailer ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1234999
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Date 21/4/2025, Retailer ID 1234999”

### FLD-538: Applicant's signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Applicant's signature field now shows a captured signature image plus text 'HEMANTH 2025-21-4 12:9:45'”

## Sales Order Line Item Attributes (Bill Limit Mobile) (2 fields)

### FLD-546: SL Limit Amount
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 67
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “SL Limit Amount = 67 (being edited, matches the Smart Limit accepted earlier)”

### FLD-547: SL Min Value
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 0.01
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “SL Min Value = 0.01, each with Action Add and Data Type Text”

## MNP Tablet Postpaid – Contact (2 fields)

### FLD-548: Qatari ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 28952431523
- **Validation rule:** green check mark
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field Qatari ID = 28952431523 with a green check mark”

### FLD-550: No Email (checkbox)
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Default value:** checked
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “checkbox 'No Email' ticked”

## MNP Tablet Postpaid – Plan detail popup (2 fields)

### FLD-551: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 20
- **Editable rule:** has 'Edit Bill Limit' button
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Bill Limit: 20 with an 'Edit Bill Limit' button and note 'Default Bill Limit should be communicated to the customer'”

### FLD-552: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 50
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Credit Limit: 50”

## MNP Tablet Postpaid – Addon & Discount summary (2 fields)

### FLD-554: Paid Add-ons
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Visibility rule:** Info banner: 'Go back to Plan step and edit limit to cover for the add-on amount.'
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Paid Add-ons: (Select Add-on button) — listed: '200 Local Minutes for 6 Months' and 'International 50'”

### FLD-555: Discount
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Visibility rule:** if there are no applicable add-on or discount, the selector will be empty
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Discount: (Select Discount button) — listed: 'QR20 Discount for 6 Months' and '31GB for 6 Months'. Note: if there are no applicable add-on or discount, the selector will be empty”

## MNP Tablet Postpaid – CAF Section 2 (2 fields)

### FLD-560: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 50
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Section 2 – Billing information: Account credit limit 50, Smart Limit 20”

### FLD-561: Bill date cycle
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 15
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Bill date cycle 15, Bill format Detail, Bill language English”

## Account Summary (2 fields)

### FLD-564: Pre-approved (Expatriate/Qatari)
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 1,500
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “field 'Pre-approved (Expatriate/Qatari)' being edited to value 1,500”

### FLD-990: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document gives a substantial field/section inventory for the Account Summary screen: header fields (Account #, Account Class, Account Type, Customer Segment, Status, Primary MSISDN, Credit Risk, Pre-approved amount) plus four sub-grids (Installed Assets - 14 items with named services, Orders - prior order history by type, Billing Profile - 4 profiles with Payment Type/Cycle, Trouble Tickets - 17 records), and later shows the same screen post-transaction with Installed Assets grown to 6 items and two new Orders rows appended. | Field-level detail for Account Summary already documented: account attributes (Residential, Expatriate, Credit Limit 1,000, Active), Installed Assets grid (Prepaid Red Promotion plus two existing postpaid lines Postpaid Red 350 and Postpaid U Start), and an Orders grid showing prior orders including two previously Abandoned Pre2Post orders - together evidencing both installed-asset and order-history sub-views described in the purpose statement. Billing profile (1-D7X76LP, Postpaid) and credit limit are also visible later on the resulting order header.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Agent starts on Account Summary for customer "HEMANTH GOVARDHANAN" (Account # 80772215054, Account Class Customer, Account Type Residential, Customer Segment Expatriate, Status Active, Primary MSISDN 97430826070, Credit Risk "No score", Pre-approved (Expatriate/Qatari) 1,000). Installed Assets list (14 items)... Orders grid shows prior order history... Billing Profile grid: 4 profiles... Trouble Tickets grid: 17 records. || Customer Portal / full account view — Installed Assets grid (1-6) shows the Prepaid Red Promotion alongside two existing postpaid lines (Postpaid Red 350, Postpaid U Start). Orders grid shows two prior Pre2Post orders already Abandoned for this account (4/15/2025)”

## MNP Prepaid – Contact (2 fields)

### FLD-565: ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** Qatari ID
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Please insert or scan the customer's Qatari ID or Passport Number: ID Type = Qatari ID, ID Number field”

### FLD-566: ID Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 27381804401
- **Validation rule:** case sensitive; barcode-scan icon supported
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “ID Number field (case sensitive) with a barcode-scan icon. Agent enters ID Number 27381804401, clicks Go”

## Reject Lead modal (2 fields)

### FLD-582: Reject Reason Code options
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “options include Competitor selected, Do Not contact, Duplicate lead, Failed to reach contact, Identity unknown, Incorrect data, Ineligible (selected), Insufficient Funds, Is a partner, Left company (scrollable, more below)”

### FLD-583: Reject Comment
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Test
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-fixed-0cfca63c.md): “Reject Comment text field ... Reject Comment entry: free-text box filled with 'Test'”

## Create a Lead (Lead Edit, Owner Change) (2 fields)

### FLD-584: Mobile Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 97431243124
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Mobile Number* (pre-filled 97431243124), Service Needed* (dropdown, set to 'Plan upgrades')”

### FLD-585: Service Needed
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Plan upgrades
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Service Needed* (dropdown, set to 'Plan upgrades')”

## Lead Details View (Lead Edit, Owner Change / Mobile lead) (2 fields)

### FLD-586: CallBack Date/Time
`Explicit` · confidence: `high`

- **Data type:** date/time picker
- **Default value:** 11/20/2025 03:16:00 PM (varies by instance; also seen Dec 2025 with day 4 highlighted)
- **Validation rule:** After entering value, Lead Status changes from New to In Progress and Lead Sub Status becomes Call Back (auto-transition)
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “date/time picker opens on the CallBack Date/Time field: December 2025 calendar, day 4 highlighted (green)”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “a date/time picker: month/year selectors (Nov 2025), a day grid with 20 selected, a 'Time' readout '03:16:00 PM'”

### FLD-587: Lead Status
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** New
- **Validation rule:** Changes from 'New' to 'In Progress' upon CallBack Date/Time entry; dropdown options: Accepted, Assigned, In Progress, Lead Converted, New, Rejected, Retired, Submitted
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Lead Status: New ... changes from 'New' to 'In Progress'”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Lead Status dropdown opened; options: Accepted, Assigned, In Progress (selected), Lead Converted, New, Rejected, Retired, Submitted”

## Create a Lead (Mobile / Fixed Pre-sales, Tablet) (2 fields)

### FLD-594: Mobile Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 97410101010 (Mobile lead) / 97498129812 (Fixed Pre-sales lead)
- **Editable rule:** placeholder '974XXXXXXXX'
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Mobile Number* (placeholder '974XXXXXXXX') ... Agent types '97410101010' into Mobile Number”
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Agent enters Mobile Number: 97498129812”

### FLD-595: Service Needed
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Postpaid (Mobile lead) / Home (Fixed Pre-sales lead)
- **Visibility rule:** Selecting Home reveals the Fixed Pre-sales dropdown
- **Editable rule:** options: -- Select Service --, FNP, Home, MNP, Plan upgrades, Postpaid, Pre to Post, Prepaid
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Dropdown opened, options listed: FNP, Home, MNP, Plan upgrades, Postpaid (selected, highlighted blue), Pre to Post, Prepaid”
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Opens the Service Needed * dropdown (options: -- Select Service --, FNP, Home, MNP, Plan upgrades, Postpaid, Pre to Post, Prepaid) and selects Home”

## Create a Lead (Fixed Pre-sales, Tablet) (2 fields)

### FLD-598: Fixed Pre-sales
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum (Yes/No)
- **Default value:** Yes
- **Visibility rule:** appears when Service Needed = Home
- **Editable rule:** options: -- Select Option --, Yes, No
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “A new dropdown Fixed Pre-sales appears (options: -- Select Option --, Yes, No); agent selects Yes”

### FLD-599: Preferred Time
`Explicit` · confidence: `high`

- **Data type:** date/time picker
- **Default value:** 12/25/2025 16:00:00
- **Visibility rule:** opens because Fixed Pre-sales = Yes
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Because Fixed Pre-sales = Yes, a date/time picker control opens ... Agent sets/confirms 12/25/2025 16:00:00”

## Passport to QID Update (Step 2) (2 fields)

### FLD-602: MSISDN
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 2: Enter MSISDN & Passport Number then click on Go”

### FLD-603: Passport Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 2: Enter MSISDN & Passport Number then click on Go”

## Cross Sales Contact (2 fields)

### FLD-607: Please insert or scan the customer's Qatari Id:
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Verified with green checkmark on valid ID
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Please insert or scan the customer's Qatari Id:' field populated with 29735617987, verified with a green checkmark.”

### FLD-608: Go
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Go / Search again / Cancel buttons.”

## Cross Sales Offers (2 fields)

### FLD-612: Offer grid: OfferType/OfferName/MonthlyRental/OfferDescription/CampaignCode/PriorityCode/ServiceIdentifier/Status/TreatmentCode/Channel/PromotionId/Price
`Explicit` · confidence: `high`

- **Data type:** grid
- **Mandatory:** No
- **Visibility rule:** Shown at step 2 Offers after Contact saved
- **Editable rule:** read-only rows, action buttons per row
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “OfferType 'New MNP', OfferName 'MNP New Pos...', MonthlyRental 145... CampaignCode C000009053”

### FLD-613: Accept / Interested / Reject / Close
`Explicit` · confidence: `high`

- **Data type:** button (per-row action)
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “a 'Cross Sales Offers' grid with Accept / Interested / Reject / Close action buttons”

## Plan / Promotion detail modal (2 fields)

### FLD-632: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 150 (example)
- **Editable rule:** Editable via 'Edit Bill Limit' button
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Bill Limit: 150 (Edit Bill Limit button) and Credit Limit: 1000 (Edit Credit Limit button)”

### FLD-633: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 1000 (example)
- **Editable rule:** Editable via 'Edit Credit Limit' button
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “Credit Limit: 1000 (Edit Credit Limit button)”

## Payment (New Postpaid wizard) (2 fields)

### FLD-634: Reason
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Conditional
- **Default value:** For Testing Only
- **Validation rule:** Used for FREE type sales
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Number' panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown set to 'For Testing Only'”

### FLD-635: Generate CAF
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Validation rule:** Triggers 'Validating Order, please wait...'
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Generate CAF' button... 'Validating Order, please wait...' status line”

## All Person Administration (2 fields)

### FLD-647: Last Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Default value:** Kumar
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Last Name 'Kumar', First Name 'Hemanth', User ID 'HEMANTH', Job Title 'Team Leader'”

### FLD-648: Responsibility
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** VFQA Sales
- **Editable rule:** Editable (New Responsibility field shown separately)
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Responsibility 'VFQA Sales', New Responsibility field shows 'AT Service Analyti...' (truncated)”

## Product Promotions admin - More Info tab (2 fields)

### FLD-649: Promotion ID
`Explicit` · confidence: `high`

- **Data type:** text/display
- **Mandatory:** No
- **Default value:** 1-92VNJ0L
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Promotion ID '1-92VNJ0L', Type 'Bundled Promot[ions]', Payment Type 'Postpaid'”

### FLD-650: Show in Catalog
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** checked
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Show in Catalog checked, Track as Asset checked, Track as Agreement unchecked, Manual Ambiguity Resolution Flag unchecked”

## B2B2C With Approval - Step3 Plan detail popup (2 fields)

### FLD-691: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 100
- **Visibility rule:** note: 'Default Bill Limit should be communicated to the customer'
- **Editable rule:** editable via 'Edit Bill Limit'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Bill Limit: 100 ('Edit Bill Limit' button, note: 'Default Bill Limit should be communicated to the customer')”

### FLD-692: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 1000
- **Editable rule:** editable via 'Edit Credit Limit'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Credit Limit: 1000 ('Edit Credit Limit')”

## B2B2C With Approval - Step4 Addon & Discount (2 fields)

### FLD-693: Select Add-on
`Explicit` · confidence: `high`

- **Data type:** button (selector)
- **Mandatory:** No
- **Visibility rule:** note: 'Go back to Plan step and edit limit to cover for the add-on amount.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Paid Add-Ons: 'Select Add-on' button with note 'Go back to Plan step and edit limit to cover for the add-on amount.'”

### FLD-694: Select Discount
`Explicit` · confidence: `high`

- **Data type:** button (selector)
- **Mandatory:** No
- **Default value:** QR 25 Discount for 6 Months (pre-applied in example)
- **Visibility rule:** info note: 'if there are no applicable add-on or discount, the selector will be empty.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Discount: 'Select Discount' button; 'QR 25 Discount for 6 Months' already shown as applied”

## B2B2C With Approval - Step5 Number Selection (2 fields)

### FLD-695: Free Number / Reserved Number tabs
`Explicit` · confidence: `high`

- **Data type:** tab selector
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Select a Number to Reserve' with 'Free Number'/'Reserved Number' tabs”

### FLD-696: Reserve button / confirmation alert
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “10.162.53.100:4443 says — SUCCESS:Reservation Token:13757449(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “native browser alert — '10.162.53.100:4443 says — SUCCESS:Reservation Token:13757449(SBL-EXL-00151)'”

## B2B2C With Approval - Approve Order modal (2 fields)

### FLD-705: Comments (approval)
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Conditional
- **Default value:** Order Approved
- **Visibility rule:** same guidance note as agent Activity step
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Comments box is filled with 'Order Approved', with the same guidance note as the agent's Activity step”

### FLD-706: Approve confirmation text
`Explicit` · confidence: `high`

- **Data type:** static text
- **Mandatory:** No
- **Error message:** “By clicking submit, I agree that I have verified all the documents and details to proceed with submission.”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “a confirmation dialog reads: 'By clicking submit, I agree that I have verified all the documents and details to proceed with submission.'”

## HRN Credit Limit (Tablet) - Contact (2 fields)

### FLD-717: Qatari ID
`Explicit` · confidence: `high`

- **Data type:** text (scan or manual)
- **Mandatory:** Yes
- **Default value:** 28658600923
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Prompt: 'Please insert or scan the customer's Qatari ID:' — Qatari ID field = 28658600923”

### FLD-718: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** radio (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Visibility rule:** info tooltip: 'To be filled by Fulfillment team only.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “'Enter ECR Details' = No (info tooltip: 'To be filled by Fulfillment team only.')”

## HRN Credit Limit (Tablet) - Plan detail popup (2 fields)

### FLD-719: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 65
- **Visibility rule:** info note 'Default Bill Limit should be communicated to the customer'
- **Editable rule:** editable via 'Edit Bill Limit'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Bill Limit: 65 (with 'Edit Bill Limit' button; info note 'Default Bill Limit should be communicated to the customer')”

### FLD-720: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 50
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Credit Limit: 50”

## NON_B2B2C With Approval - Step1 Contact confirmation (2 fields)

### FLD-726: Connection Details - credit warning
`Explicit` · confidence: `high`

- **Data type:** info banner
- **Mandatory:** No
- **Validation rule:** Triggered when customer has 2+ existing postpaid connections
- **Error message:** “Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Info note (blue box): 'Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding'”

### FLD-727: Company Name
`Explicit` · confidence: `high`

- **Data type:** dropdown (searchable)
- **Mandatory:** Conditional
- **Default value:** TestVQW (example)
- **Validation rule:** Selecting/skipping triggers Special-Management override confirm
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Company Name' field with a searchable dropdown — agent types/selects 'TestVQW'”

## Product Admin - Bill Limit Mapping (Postpaid U Plus Promotion) (2 fields)

### FLD-732: Agent Min Value (Bill Limit Mobile)
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 50
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “two Spend Limit products: Bill Limit Mobile (Agent Min Value 50) and Bill Limit Mobile Plus (Agent Min Value 80, Default Flag checked)”

### FLD-733: Agent Min Value (Bill Limit Mobile Plus)
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 80
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit Mobile Plus (Agent Min Value 80, Default Flag checked)”

## Plan detail confirmation popup (Open UI Desktop Pre2Post) (2 fields)

### FLD-758: Smart Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 350
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Smart Limit: 350 with info note 'Default Smart Limit should be communicated to the customer'”

### FLD-759: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 1000
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Credit Limit: 1000”

## Sales Order record (Open UI Desktop Pre2Post) (2 fields)

### FLD-773: Order Type
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Plan Change
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Order Type: Plan Change, Order Sub Type: Pre2Post, Status: Pending”

### FLD-774: Status
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Pending
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Status: Pending”

## Base Management wizard - Contact confirmation (Autobase Pre2Post) (2 fields)

### FLD-778: Email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Editable rule:** editable (unlike other read-only prefilled fields)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Email 'nobill@vod.com' (editable), Language 'English'”

### FLD-779: advance payment info banner
`Explicit` · confidence: `high`

- **Data type:** text (system message)
- **Mandatory:** Unknown
- **Error message:** “(HRN) Customer needs to pay advance payment of QR 100.”
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Info banner (verbatim): '(HRN) Customer needs to pay advance payment of QR 100.'”

## Base Management wizard / Plan step - Offer Summary / Promotion detail (Autobase Pre2Post, desktop & tablet) (2 fields)

### FLD-780: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 20
- **Validation rule:** Default (Smart) Bill Limit should be communicated to the customer
- **Editable rule:** editable via 'Edit Bill Limit' button (tablet variant)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Bill Limit: 20 (info note: 'Default Smart Limit should be communicated to the customer')”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Bill Limit: 20 (Edit Bill Limit button, note 'Default Bill Limit should be communicated to the customer')”

### FLD-781: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** number/dropdown enum
- **Mandatory:** Unknown
- **Default value:** 1000
- **Editable rule:** editable via 'Edit Credit Limit' dropdown (tablet variant); options 1000, 200, 50, 500, 800
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Credit Limit: 1000”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Credit Limit dropdown expanded showing options 1000, 200, 50 (highlighted/being selected), 500, 800”

## Account Activities tab (Autobase Pre2Post, final) (2 fields)

### FLD-788: Area
`Explicit` · confidence: `high`

- **Data type:** text (auto-tagged)
- **Mandatory:** Unknown
- **Default value:** Migration to Postpay
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Area 'Migration to Po...' (Migration to Postpay), Journey 'Start-up'”

### FLD-789: Topic
`Explicit` · confidence: `high`

- **Data type:** text (auto-tagged)
- **Mandatory:** Unknown
- **Default value:** Automated Guided Journey
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Topic 'Automated Gui...' (Automated Guided Journey)”

## Prepaid to Postpaid - Contact (Tablet Pre2Post, Step 1) (2 fields)

### FLD-790: Prepaid Number
`Explicit` · confidence: `high`

- **Data type:** phone
- **Mandatory:** Yes
- **Default value:** +974 79026351
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Fields: Prepaid Number '+974 79026351', Qatari ID '28260821189' (validated, green check)”

### FLD-791: Qatari ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** validated (green check)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Qatari ID '28260821189' (validated, green check)”

## New Prepaid Tablet - Contact (Step 1) (2 fields)

### FLD-805: ID Type
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Passport
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “ID Type = Passport, ID Number = SG1972, both green-checked (validated)”

### FLD-806: ID Number
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** validated (green check)
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “ID Number = SG1972, both green-checked (validated)”

## Sales Order record (New Prepaid Tablet) (2 fields)

### FLD-826: Status
`Explicit` · confidence: `medium`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Abandoned
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Status: Abandoned ... Priority: Medium-Abandoned”

### FLD-827: Order Type
`Explicit` · confidence: `medium`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Activation
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Order Type: Activation, Order Sub Type blank”

## SIM Swap Open UI Tablet Journey (2 fields)

### FLD-830: ID Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN, ID Type & ID Number, click Go”

### FLD-831: ID Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN, ID Type & ID Number, click Go”

## SIM Swap from Global Search (2 fields)

### FLD-833: Bank document upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “upload QID front & Bank, click Continue”

### FLD-836: SIM Swap Form attachment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Attach SIM Swap Form, click Continue”

## SIM Swap - Submit new SIM (Global Search & Open UI Tablet) (2 fields)

### FLD-834: SIM Serial Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter SIM Serial Number, select SIM Swap Reason, click Submit (SIM Swap from Global Search)”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter SIM Serial Number, select Reason, click Submit (SIM Swap Open UI Tablet Journey)”

### FLD-835: SIM Swap Reason
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “select SIM Swap Reason, click Submit (SIM Swap from Global Search)”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “select Reason, click Submit (SIM Swap Open UI Tablet Journey)”

## SIM Swap Order Approval Rejection popup (2 fields)

### FLD-840: Rejection Reason
`Explicit` · confidence: `high`

- **Data type:** dropdown/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “On Reject Task, pop-up opens for Rejection Reason -> Add comments, click Drop Order”

### FLD-841: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Add comments, click Drop Order; order is dropped as cancelled”

## All Sales Order screen (Open UI Desktop) (2 fields)

### FLD-844: All SIM Swap Orders filter
`Explicit` · confidence: `high`

- **Data type:** dropdown filter
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “top-menu dropdown with options 'All SIM Swap Orders' and 'All Pending SIM Swap Orders'”

### FLD-845: All Pending SIM Swap Orders filter
`Explicit` · confidence: `high`

- **Data type:** dropdown filter
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “'All Pending SIM Swap Orders'”

## Open UI Desktop - Asset detail expanded (Contact Details card) (2 fields)

### FLD-880: Blacklisted
`Explicit` · confidence: `high`

- **Data type:** boolean
- **Mandatory:** Unknown
- **Default value:** No
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Blacklisted: No”

### FLD-881: ID Type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “ID Type: Qatari ID, ID Number: 29635618702”

## Open UI Desktop - Real Time Balance panel (2 fields)

### FLD-887: Primary Balance
`Explicit` · confidence: `high`

- **Data type:** currency
- **Mandatory:** Unknown
- **Default value:** 0 QAR
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Primary Balance (0 QAR, Expires on Date not configured/set)”

### FLD-888: Expires on
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Unknown
- **Default value:** Date not configured/set
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Expires on Date not configured/set”

## RFS Portal - address search (2 fields)

### FLD-895: ZSB address search
`Explicit` · confidence: `high`

- **Data type:** cascading dropdown/search
- **Mandatory:** Yes
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “sales-facing app; search by ZSB address, Karama ID, or area”

### FLD-896: Karama ID (KID) search
`Explicit` · confidence: `high`

- **Technical name:** KID
- **Data type:** text/ID
- **Mandatory:** No
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “search by ZSB address, Karama ID, or area”

## RFS Portal - result display (2 fields)

### FLD-897: RFS status
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “shows RFS status, potentials, SLA/cluster (renamed from 1-4 to F1-F4)”

### FLD-898: SLA/cluster
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Unknown
- **Default value:** F1-F4
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “SLA/cluster (renamed from 1-4 to F1-F4)”

## Fibre Activation BRSD - FAR_001_RFS requirements (2 fields)

### FLD-926: Installation address (cascading zone/street/building)
`Explicit` · confidence: `high`

- **Data type:** cascading dropdown
- **Mandatory:** Yes
- **Validation rule:** address lock after check
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_001_RFS_01`..`08` (installation address capture, cascading zone/street/building selection, RFS search by address/KID/area, address auto-fill, service-type display, CPE/ONT detection, address lock after check, proof-of-address upload ≤2MB)”

### FLD-927: Proof of address upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** ≤2MB
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “proof-of-address upload ≤2MB”

## Fibre Activation BRSD - FAR_002_INS (Instant Activation) requirements (2 fields)

### FLD-929: Instant/Normal activation selection
`Explicit` · confidence: `high`

- **Technical name:** FAR_002_INS_03
- **Data type:** radio/toggle
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FAR_002_INS_01`..`07` (Instant Activation: eligibility detection, device serial verification, instant/normal explicit selection, appointment auto-skip, immediate activation trigger, failure handling, tablet-only channel constraint)”

### FLD-930: Device serial number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** device serial verification
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “device serial verification”

## Mobile Postpaid Activation BRSD - MPAR_001_JSM requirements (2 fields)

### FLD-932: Agent Role Privilege authorization
`Explicit` · confidence: `high`

- **Technical name:** MPAR_001_JSM_01..08
- **Data type:** role-based authorization
- **Mandatory:** Yes
- **Validation rule:** role-based authorisation via TBD Agent Role Privilege Matrix
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “`MPAR_001_JSM_01`..`08` (journey initiation from Agent Desktop, role-based authorisation via TBD Agent Role Privilege Matrix, Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable, automatic Tracking Record creation, milestone/draft-order persistence for resume)”

### FLD-933: Qnomy Q Ticket
`Explicit` · confidence: `high`

- **Technical name:** Q Ticket
- **Data type:** text/ID
- **Mandatory:** Conditional
- **Validation rule:** fallback if Qnomy unavailable
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “Qnomy Q Ticket creation/consumption with fallback if Qnomy unavailable”

## Trouble Ticket - Type of Tickets (2 fields)

### FLD-967: Ticket/Issue Category
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “lists ticket/issue categories — Disconnection, Migration (Pre to Post), Plan Downgrade, Language Change, End Data Session, etc.”

### FLD-968: Request Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “request types — MNP, FNP port out and port in, Plan Change Request, Add-on Request, Bill Limit”

## Adjustment record (1 fields)

### FLD-014: Adjustment reason
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Visibility rule:** Reason is purged after 6 months under BRM's "6 plus 1" event purge policy though item data remains
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Adjustment reason is lost after 6 months due to BRM's "6 plus 1" event purge policy — item data remains but the reason is purged.”

## Statement of Account (SOA) (1 fields)

### FLD-015: SOA line (bill/payment/adjustment/allocation entry)
`Explicit` · confidence: `high`

- **Data type:** text/table row
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “SOA (Statement of Account): must show data from inception (one line per bill, plus payments/adjustments/allocations); currently sent manually via SR in Excel.”

## Bill Simulation (disconnection penalty preview) (1 fields)

### FLD-019: Bill simulation disclaimer / non-tax-invoice notice
`Explicit` · confidence: `high`

- **Data type:** text (static label)
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “the newly-named "bill simulation" (shows disconnection implications/penalties without disrupting the upcoming bill; explicitly not a tax invoice; must state so on its face, since two invoices cannot be generated for the same charges).”

## Billing document / invoice recipient config (1 fields)

### FLD-022: Billing document recipient email
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a`](../.knowledge/docs/business-process-day10-session-1-20260708-100858-meeting-rec-b1dfc39a.md): “Audit trail requirement raised: capture who changed the billing profile name and the billing document recipient email (a fraud scenario was flagged where a user changes the invoice email, redirects it, then reverts with no record).”

## Sub-account affiliation form (1 fields)

### FLD-029: Attachment file name (QID_subaccount)
`Explicit` · confidence: `high`

- **Technical name:** QID_subaccount
- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Attachment must be named "QID_subaccount"
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Account affiliation (an attached form + account manager approval) is what actually grants privileges and Web Self-Care access; the attachment must be named "QID_subaccount".”

## Contact record (shared field pain point) (1 fields)

### FLD-032: Email (single shared field)
`Explicit` · confidence: `high`

- **Data type:** email
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Pain points flagged: single email field on a shared contact record (personal vs. corporate email conflict; billing to multiple addresses)”

## Contact record (privilege identifier pain point) (1 fields)

### FLD-033: Job title (free text)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Validation rule:** No validation performed today (free-text used as privilege identifier)
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “free-text job title used as the privilege identifier (no validation); no validation when linking sub-accounts to parents”

## CNAP configuration (1 fields)

### FLD-034: Calling Name Presentation (CNAP) text
`Explicit` · confidence: `high`

- **Technical name:** CNAP
- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** 25-character limit; regulator-mandated, mandatory for fixed lines
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “CNAP (Calling Name Presentation): regulator-mandated, mandatory for fixed lines, 25-character limit, expected to become mandatory for mobile.”

## Billing Profile (enterprise default) (1 fields)

### FLD-035: Bill cycle (1st/15th)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Postpaid with automatic 1st/15th bill cycles
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “Billing profiles default to postpaid with automatic 1st/15th bill cycles; prepaid handled via a separate billing profile line item.”

## Volumetric Discount Configuration (1 fields)

### FLD-036: Minimum number of connections (50)
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Yes
- **Validation rule:** Minimum of 50 numbers, slab-based, evaluated at runtime
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “volumetric discount has a minimum of 50 numbers, is slab-based, comes in revenue and service-count flavours, is evaluated at runtime, and has no automatic downgrade when connections drop”

## Price Override (1 fields)

### FLD-037: Price override (access-restricted)
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Conditional
- **Visibility rule:** Access-restricted; used when required discount exceeds the plan maximum; hides base vs. offered price for reporting
- **Sources:**
  - [`business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0`](../.knowledge/docs/business-process-day11-session-1-20260709-124548-meeting-rec-edcba1f0.md): “access-restricted price override (used when required discount exceeds the plan maximum; hides base vs. offered price for reporting).”

## IoT Device Record (Fleet Management/Asset Tracking) (1 fields)

### FLD-041: Device identifier
`Explicit` · confidence: `medium`

- **Data type:** text/ID
- **Mandatory:** Conditional
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “devices may be third-party or Vodafone-supplied with an identifier held”

## DAPN (dedicated APN) order (1 fields)

### FLD-042: Static IP
`Explicit` · confidence: `medium`

- **Data type:** text/IP address
- **Mandatory:** Yes
- **Validation rule:** Static IPs must be found manually in the pool (search does not work) — noted pain point
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “DAPN/dedicated APN...data SIM with static IP; numbers reserved one by one from the mobility-only category; no bulk template...Static IPs must be found manually in the pool (search does not work)”

## Microsoft Licence Billing Line Item (1 fields)

### FLD-043: Licence quantity
`Explicit` · confidence: `medium`

- **Data type:** number
- **Mandatory:** Yes
- **Validation rule:** Quantity does not carry to billing without "auto-explode"; one line item per licence with manual price changes
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “one line item per Microsoft licence with manual price changes because quantity does not carry to billing without "auto-explode"”

## Enterprise Order / Installation Site Contact (1 fields)

### FLD-044: Installation site point of contact
`Explicit` · confidence: `medium`

- **Data type:** text (free-text comment only)
- **Mandatory:** Conditional
- **Visibility rule:** Only captured as free-text comment because a contact cannot be created without an ID
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Gap identified: the installation site engineer/point of contact is only captured as a free-text comment because a contact cannot be created without an ID — this causes appointment notifications to go to the wrong person.”

## Contact Role (1 fields)

### FLD-045: Contact role (chooser / payment support / technical contact)
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c`](../.knowledge/docs/business-process-day11-session-2-20260709-155305-meeting-rec-a4630d1c.md): “Contact roles noted: chooser, payment support, technical contact.”

## 5G Indoor/Outdoor FWA - Customer Acceptance (1 fields)

### FLD-053: Customer acceptance signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01`](../.knowledge/docs/business-process-day12-session-1-20260712-110503-meeting-rec-d4eafd01.md): “CPE handover and provisioning; customer acceptance signature; post-activation support chain through business care, the CMT team, the vendor and the field partner for device faults/changes.”

## MNP Consent (1 fields)

### FLD-066: Consent SMS
`Explicit` · confidence: `high`

- **Data type:** SMS/text
- **Mandatory:** Yes
- **Validation rule:** Customer must send consent SMS within 24 hours of order creation
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Customer must send a consent SMS within 24 hours; request then goes via NPAS to Ooredoo, who has 24 hours to accept, reject, or conditionally accept if there are outstanding dues”

## MNP Rejection (1 fields)

### FLD-067: Rejection reason (donor)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey
- **Sources:**
  - [`business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d`](../.knowledge/docs/business-process-day9-session-1-20260707-123707-meeting-reco-4158a38d.md): “Only 13 documented rejection reasons are valid; each rejection restarts the whole MNP journey.”

## Enterprise Invoice CDR listing (1 fields)

### FLD-077: CDR number filter
`Explicit` · confidence: `high`

- **Data type:** text/filter
- **Mandatory:** Unknown
- **Sources:**
  - [`business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b`](../.knowledge/docs/business-process-day12-session-2-20260712-155508-meeting-rec-4e628b9b.md): “sort CDRs by date/time with a number filter”

## MNP Port-Out - Conditional Acceptance (Consumer) (1 fields)

### FLD-089: Billed Due Amount (QAR)
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Validation rule:** Conditional acceptance triggers automatically when billed due exceeds 100 QAR; unbilled amounts do not trigger it for MNP
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Conditional acceptance for consumer is automated on a billed due of over 100 Riyal (QAR); unbilled amounts do not trigger it in MNP”

## FNP Port-Out - Conditional Acceptance (Consumer) (1 fields)

### FLD-090: Unbilled Amount (service level)
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Validation rule:** Unlike MNP, FNP allows unbilled amounts to trigger conditional acceptance and operates at service level rather than billing profile level
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “FNP, by contrast, allows unbilled amounts to trigger conditional acceptance and operates at service level rather than MNP's billing profile level”

## MNP Port-Out - Ticket SLA/Timer (1 fields)

### FLD-091: Action Window Timer
`Explicit` · confidence: `high`

- **Data type:** date/time
- **Mandatory:** Yes
- **Validation rule:** Two-hour action window, extended to 24 hours once documents are validated, bound by NPass working hours (~7:30-3:30/4) as hard stop
- **Sources:**
  - [`business-process-day9-session-2-20260707-131317-meeting-reco-e3243830`](../.knowledge/docs/business-process-day9-session-2-20260707-131317-meeting-reco-e3243830.md): “Siebel auto-creates a trouble ticket with a two-hour action window (extended to 24 hours once documents are validated), bound by NPass working hours (~7:30–3:30/4) as a hard stop rather than an SLA”

## TON Order (visibility) (1 fields)

### FLD-098: TON Order Status/Visibility
`Explicit` · confidence: `high`

- **Data type:** text (read-only display)
- **Mandatory:** No
- **Visibility rule:** Only visible on the new account, not the old/original account
- **Sources:**
  - [`business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d`](../.knowledge/docs/business-processes-day7-session-2-20260705-154408-meeting-re-8709f98d.md): “TON order visibility only available on the new account”

## CAF (Customer Application Form) - Tablet Signature (1 fields)

### FLD-103: Highlighted Key T&Cs Section
`Explicit` · confidence: `high`

- **Data type:** text block (configurable)
- **Mandatory:** Yes
- **Validation rule:** Content configured by business admin, not agent-selectable
- **Visibility rule:** Displayed on tablet only, view shifts laptop -> tablet -> laptop
- **Editable rule:** Business-admin-controlled; agent cannot select which T&Cs are highlighted (rejected to reduce clicks/errors)
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “a configurable, business-admin-controlled "highlighted key T&Cs" section will be added to the CAF flow rather than agent-selected highlights (agent selection was rejected to reduce clicks/errors)”

## Order Confirmation (Postpaid new customer journey) (1 fields)

### FLD-105: Confirmation Message Text
`Explicit` · confidence: `high`

- **Data type:** text (system message)
- **Mandatory:** No
- **Default value:** order submitted successfully
- **Editable rule:** Changed from "account activated" to "order submitted successfully" since provisioning still goes through OSM/Siebel after submission
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “confirmation message text to be changed from "account activated" to "order submitted successfully" since provisioning still goes through OSM/Siebel after submission”

## Agent Login Page (1 fields)

### FLD-106: In-Progress Journeys List
`Explicit` · confidence: `high`

- **Data type:** list/table
- **Mandatory:** No
- **Visibility rule:** Shows journeys resumable via internal milestones (e.g., cart creation)
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “journey resume via internal milestones (e.g., cart creation) rather than restart from scratch; an "in-progress journeys" list will appear on the agent login page”

## Incomplete/Pending Order (transient state) (1 fields)

### FLD-107: Hold Period / Number Reservation Expiry
`Explicit` · confidence: `high`

- **Data type:** date/time
- **Mandatory:** Yes
- **Validation rule:** Tied to channel's number reservation expiry, generally up to ~48 hours; not created as an order at GSP layer until complete
- **Editable rule:** Open question whether hold is 24 vs 48 hrs, whether extendable
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “incomplete/pending orders held in a transient state (not created as an order at the GSP layer) with hold period tied to the channel's number reservation expiry, generally up to ~48 hours”

## Customer 360 (1 fields)

### FLD-108: Customer 360 Page (tab-based)
`Explicit` · confidence: `high`

- **Data type:** page/tabs
- **Mandatory:** No
- **Visibility rule:** Single page with tab-based partial refresh
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “customer 360 must be single page with tab-based partial refresh [01:15:07]”

## Digital Signature Pad (1 fields)

### FLD-109: Signature Capture
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Editable rule:** Must move from OpenUI integration to the new custom Siebel/DXP frontend
- **Sources:**
  - [`business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320`](../.knowledge/docs/business-workshop-day2-session-1-postpaid-service-20260628-1-663e2320.md): “digital signature pad must move from OpenUI integration to the new custom Siebel/DXP frontend [00:06:12]”

## AutoPay (1 fields)

### FLD-114: AutoPay Status / Failure Reason
`Explicit` · confidence: `high`

- **Data type:** text (read-only display)
- **Mandatory:** No
- **Validation rule:** Agents cannot enroll/cancel AutoPay or see card details (regulatory restriction)
- **Visibility rule:** Agents get view-only visibility
- **Editable rule:** View-only for agents; cannot enroll/cancel
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “agents cannot enroll/cancel AutoPay or see card details (regulatory restriction) — agents get view-only visibility of AutoPay status and failure reason”

## Bill Medium (1 fields)

### FLD-115: Bill Medium (Detailed/Summary)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Default value:** Detailed (consumer) / Summary PDF (enterprise)
- **Validation rule:** Defaults: detailed bill for consumer, summary PDF for enterprise, with customer option for summary only
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill medium defaults — detailed bill for consumer, summary PDF for enterprise, with customer option for summary only”

## Bill Cycle Change (1 fields)

### FLD-116: Bill Cycle Change Eligibility
`Explicit` · confidence: `high`

- **Data type:** business rule/config
- **Mandatory:** No
- **Validation rule:** Restricted to specific roles (billing team); eligibility rule must be configurable, not hard-coded
- **Editable rule:** A ticket is always created even when change isn't allowed, but auto-resolved in real time
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “bill cycle change restricted to specific roles (billing team); business rule for change eligibility must be configurable, not hard-coded; a ticket is always created even when a change isn't allowed, but auto-resolved in real time”

## SIM Swap - Charging (1 fields)

### FLD-119: SIM Swap Charge
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Conditional
- **Validation rule:** eSIM to eSIM free; eSIM to physical charged; lost SIM chargeable; damaged SIM not charged
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “charging rules — eSIM to eSIM free, eSIM to physical charged, lost SIM chargeable, damaged SIM not charged”

## SIM Swap - Approval (1 fields)

### FLD-120: Approval / SIM Swap Form / ID Attachment
`Explicit` · confidence: `high`

- **Data type:** file upload + workflow approval
- **Mandatory:** Conditional
- **Validation rule:** Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done
- **Visibility rule:** Varies by channel
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “Approval matrix by channel: Retail requires approval + SIM swap form + ID attachment; Back office some require approval (attachment only, no form), some auto-approved; MVA app requires no approval/form once eKYC done”

## Manual Suspension ("Park My Number") (1 fields)

### FLD-121: Park My Number Plan
`Explicit` · confidence: `high`

- **Data type:** plan/product record
- **Mandatory:** Yes
- **Default value:** 35 QAR / 4 months upfront
- **Validation rule:** 35 Rial, four-month upfront-paid plan; credit limit set to zero; restricted to specific roles; run as back-office ticket-driven process, not a retail journey
- **Editable rule:** Voluntary suspension discontinued, always implemented as a plan change, renamed "manual suspension"
- **Sources:**
  - [`business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204`](../.knowledge/docs/business-workshop-day2-session-2-postpaid-service-20260628-1-bf394204.md): “delivered via a 35 Rial, four-month upfront-paid "park my number" plan with credit limit set to zero; restricted to specific roles and run as a back-office ticket-driven process, not a retail journey”

## Trouble Ticket (Open UI/Siebel) (1 fields)

### FLD-122: Ticket Source
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Agent-created, system-generated (eShop/NPAS/portal), Open UI Excel, or customer-originated (MVA requests go to validation queue before becoming agent-created ticket)
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “Ticket sources: agent-created, system-generated (from eShop/NPAS/portal), Open UI Excel, and customer-originated (MVA requests go to a validation queue before becoming an agent-created ticket)”

## Trouble Ticket - Disconnection (1 fields)

### FLD-123: Resolution Code (retention)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Ticket must be closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page
- **Sources:**
  - [`business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d`](../.knowledge/docs/business-workshop-day4-session-2-postpaid-service-20260630-1-aa302f2d.md): “ticket closed with a specific resolution code (e.g., "retained" or not) before the disconnection order can be submitted on the Orders page”

## Retail Verification - QID (1 fields)

### FLD-130: QID Scan (per transaction)
`Explicit` · confidence: `medium`

- **Data type:** file upload / scan
- **Mandatory:** Conditional
- **Validation rule:** Required only when there is an actual account/service change; not required for complaints/inquiries/bill payments without a change; agent must visually match ID photo to customer
- **Visibility rule:** Customer must be physically present with valid QID
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “for every transaction the QID must be scanned and attached to the customer account, with the agent visually matching the ID photo to the customer... required only when there is an actual account/service change”

## Agent Usage/Balance View (1 fields)

### FLD-136: My Account App Recent Access Indicator
`Inferred` · confidence: `medium`

- **Data type:** checkbox/indicator (proposed, not yet built)
- **Mandatory:** No
- **Validation rule:** Gap: no such indicator exists today; requirement raised to add it
- **Sources:**
  - [`business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808`](../.knowledge/docs/business-workshop-day5-session-1-postpaid-service-20260701-0-a55f2808.md): “no indicator today showing whether a customer recently accessed the My Account app; requirement raised to surface this on the agent's usage/balance view”

## Plan Change (Upgrade/Downgrade) (1 fields)

### FLD-137: Rental Value (used to infer upgrade vs downgrade)
`Explicit` · confidence: `high`

- **Data type:** number/currency (read-only, inferred by agent)
- **Mandatory:** No
- **Validation rule:** System does NOT distinguish upgrade from downgrade; agents infer it from plan/promotion name and rental value (higher rental = upgrade)
- **Editable rule:** Requirement raised to add real upgrade/downgrade differentiation
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “the system does NOT distinguish upgrade from downgrade — agents infer it from plan/promotion name and rental value (higher rental = upgrade)”

## Postpaid-to-Prepaid Migration (1 fields)

### FLD-141: Migration Fee
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Default value:** 100 QAR
- **Validation rule:** 100 Riyal migration fee applied on final bill; in retail must be MANUALLY added by agent customizing the order (approved by managers) — not automated, flagged as revenue-leakage risk if forgotten
- **Editable rule:** Manual add by agent
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “100 Riyal migration fee applied on the final bill; in retail this fee must be MANUALLY added by the agent customizing the order (approved by managers)”

## Customer Billing Profiles (1 fields)

### FLD-142: Number of Billing Profiles (Consumer)
`Explicit` · confidence: `high`

- **Data type:** number (constraint)
- **Mandatory:** Unknown
- **Validation rule:** Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “Consumer can have at most two billing profiles (one postpaid, one prepaid); enterprises can have more”

## Number Management (1 fields)

### FLD-145: Number Category (Free/Paid)
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Two categories only — free and paid (paid can become free depending on plan)
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “two categories only — free and paid (paid can become free depending on plan)”

## Credit Limit (1 fields)

### FLD-146: Credit Limit (default)
`Explicit` · confidence: `high`

- **Data type:** number/currency
- **Mandatory:** Yes
- **Default value:** 1000 (expat) / 50 (HRN)
- **Validation rule:** Default 1,000 for expat on new account, dropped to 50 for HRN customers (agent-selected or system-enforced depending on nationality config); no system restriction today preventing any agent selecting any value — flagged as uncontrolled credit exposure risk
- **Sources:**
  - [`business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4`](../.knowledge/docs/business-workshop-day5-session-2-postpaid-service-20260701-1-d62f0cd4.md): “default 1,000 for expat on new account, dropped to 50 for HRN customers... no system restriction today preventing any agent from selecting any credit limit value”

## KID-In-Use Order Task (Fixed Line) (1 fields)

### FLD-151: Contract Attachment (proof)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Mandatory as proof before flow can proceed; downstream submission blocked until order task completed; if disputed, order task marked unsuccessful and order cancelled with no downstream impact
- **Editable rule:** To-be: move requirement to start of journey instead of end
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “a mandatory contract attachment is required as proof before the flow can proceed; downstream submission is blocked until the order task is completed”

## Fixed Line - IPTV Selection (1 fields)

### FLD-152: IPTV Add-on (Basic/Premium)
`Explicit` · confidence: `high`

- **Data type:** checkbox/toggle
- **Mandatory:** No
- **Default value:** Included (triple-play)
- **Validation rule:** Default triple-play bundle includes IPTV; optional/removable — if removed, dual-play order created with no set-top box and no OSM IPTV provisioning; IPTV basic free, only premium charged
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “fixed plans default to a triple-play bundle including IPTV; IPTV is optional and removable — if removed, a dual-play order is created at the backend with no set-top box and no IPTV provisioning in OSM; IPTV basic is free, only premium is charged”

## Fixed Line - Number Selection (1 fields)

### FLD-153: Auto-Selected Number (fixed/prepaid)
`Explicit` · confidence: `high`

- **Data type:** text (auto-populated)
- **Mandatory:** No
- **Validation rule:** Auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks; reserved-number retrieval and list-query options retained; NOT applied to mobile postpaid since those numbers carry a price
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “numbers auto-selected for fixed/prepaid (zero-rated) to reduce agent clicks, while retaining reserved-number retrieval and list-query options; NOT applied to mobile postpaid since those numbers carry a price”

## Fixed Line - Appointment Booking (1 fields)

### FLD-154: Appointment Date/Slot
`Explicit` · confidence: `high`

- **Data type:** date/time
- **Mandatory:** Yes
- **Default value:** Next available slot
- **Validation rule:** To-be: pre-selects next available date/slot, agent only changes if customer wants different date; bounded by location's SLA cluster (e.g., within 3 days or 1 week)
- **Visibility rule:** Lives only in WFM; Siebel stores only reference/activity ID and displays real-time view
- **Editable rule:** Reschedulable from either system up until installation/reservation completes; cancellable up to network activation
- **Sources:**
  - [`business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e`](../.knowledge/docs/business-workshop-day6-session-1-postpaid-service-20260702-1-27cbc94e.md): “appointment step to be enhanced to pre-select the next available date/slot... appointments live ONLY in WFM — Siebel stores just the reference/activity ID”

## Postpaid New Connection - Retail Journey (checkout) (1 fields)

### FLD-227: HRN advance payment amount
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Conditional
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “HRN (High Risk Nationality) customers pay an upfront advance (not a deposit) adjusted against the first bill; amount is driven by nationality and channel — explicitly confirmed NOT plan-value-driven”

## Postpaid New Connection - Retail Journey (number selection) (1 fields)

### FLD-228: Star number selection / entitlement delta payment
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Conditional
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “plan value determines star-number value entitlement (e.g., a 200 Riyal plan entitles ~5,000 Riyal worth of star number); if the customer selects a number exceeding entitlement, they pay the delta at point of sale”

## Postpaid New Connection - Retail Journey (SIM selection) (1 fields)

### FLD-229: SIM/eSIM type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Sources:**
  - [`business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db`](../.knowledge/docs/business-workshop-session-1-postpaid-service-20260625-124533-4b09c0db.md): “three types supported (physical SIM with serial scan, physical eSIM card with QR code, digital eSIM auto-allocated and emailed with ICCID)”

## FWA New Connection - Address/ZSP entry (1 fields)

### FLD-230: ZSP entry
`Explicit` · confidence: `high`

- **Technical name:** ZSP
- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** presence-only validation (not format) on email/address fields — flagged as data-quality gap
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “ZSP entry mandatory but email/address fields are validated for presence only, not format — flagged as a data-quality gap/requirement”

## Combo Box / CPE password field (Field Engineer / Agent view) (1 fields)

### FLD-235: Combo box / CPE password
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** No
- **Visibility rule:** fetched from UIM, never disclosed to customer or (today) even to the field engineer — decision to store it in the system so engineers can configure without calling the network team
- **Sources:**
  - [`business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e`](../.knowledge/docs/business-workshop-day6-session-2-postpaid-service-20260702-1-2441891e.md): “combo box/CPE password is fetched from UIM, never disclosed to customer or (today) even to the field engineer — decision to store it in the system so engineers can configure without calling the network team”

## Address/Service Point entry (Siebel) - KID search (1 fields)

### FLD-236: KID (Karama ID) search field
`Explicit` · confidence: `high`

- **Technical name:** KID
- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** agents can only SEARCH for a KID, never manually enter one — if no KID is found, agent is diverted to an FWA journey
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “agents can only SEARCH for a KID, never manually enter one — if no KID is found, the agent is diverted to an FWA journey”

## Address/Service Point entry (Siebel) - Vodafone ID (1 fields)

### FLD-237: Vodafone ID (VFID)
`Explicit` · confidence: `high`

- **Technical name:** VFID
- **Data type:** text
- **Mandatory:** Conditional
- **Visibility rule:** used for partitioned villas (one government KID, multiple units) - underscore-indexed unique service-point identifiers
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “Vodafone appends underscore indexes (_1, _2, _3) to create unique service-point identifiers, and introduced its own Vodafone ID (VFID), physically pasted at each unit”

## Address/Service Point entry (Siebel) - ZSB (1 fields)

### FLD-238: ZSB (zone/street/building)
`Explicit` · confidence: `high`

- **Technical name:** ZSB
- **Data type:** text
- **Mandatory:** Conditional
- **Validation rule:** mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “ZSB (zone/street/building) is mandatory only for FWA 5G and fixed/fiber — NOT for mobile, which uses a shared dummy address record that "cannot be changed because changing it impacts everybody"”

## Address entity (Siebel) - history tracking (1 fields)

### FLD-239: Address effective from/to dates
`Explicit` · confidence: `high`

- **Data type:** date
- **Mandatory:** Yes
- **Editable rule:** old address marked discontinued/replaced with effective from/to dates, new address created as primary rather than updated in place
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “old address marked discontinued/replaced with effective from/to dates, new address created as primary, rather than updating the address record in place”

## TON (Transfer of Number) - fee handling (1 fields)

### FLD-246: TON fee (50 Riyal) payer
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976`](../.knowledge/docs/business-workshop-day7-session-1-postpaid-service-20260705-1-e2799976.md): “who pays the 50 Riyal TON fee (currently left to the customer at store discretion — flagged as blocking automation of the receipt)”

## Cross Sales – Contact/QID entry (1 fields)

### FLD-260: Qatari Id
`Explicit` · confidence: `high`

- **Data type:** text/scan
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"Please insert or scan the customer's Qatari Id:" field accepts Qatari ID 28335628851; Go / Search again / Cancel”

## Cross Sales → New Fixed Line – Address step (1 fields)

### FLD-280: Address (Primary checkbox)
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Address step: Kahramaa-linked address table (Primary checkbox)”

## New Fixed Line – Address step (Service Points grid) (1 fields)

### FLD-281: Service Point / Status / Product (Device)
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “Service Points grid showing an existing ONT device (Service Point 16A3005_ONT_ALCLF11C2158, Status Available, Product Fixed Line Port)”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Service Points sub-grid lists Service Point 16P6061_004, Status "Available", Device Type ONT”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Service Points grid shows Service Point "16P6109_ON...", Status "Not In Use"/"Available", Device Type ONT, DeviceID ALCLF11E0681”

## New Fixed Line – Plan step (1 fields)

### FLD-282: Plan / Plan selection
`Explicit` · confidence: `high`

- **Data type:** text (bundle display) / selection grid
- **Mandatory:** Yes (Fulfilment: "Please Select a Plan.")
- **Editable rule:** Cross-sell: read-only, locked bundle card, no plan-selection control exposed. Fulfilment: editable searchable catalog grid of promotions.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a locked/read-only "GigaHome Testaahel Promotion" card lists bundled components ... No plan-selection control is exposed”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Please Select a Plan." — searchable catalog grid of promotions: GigaHome Classic 300 TB -F Promotion (selected), ...”

## New Fixed Line – Addon & Discount step (1 fields)

### FLD-283: Add-on / Discount
`Explicit` · confidence: `high`

- **Data type:** text / multi-select
- **Validation rule:** if there are no applicable add-on or discount, the selector will be empty (Fulfilment)
- **Editable rule:** Cross-sell: read-only Discount field, no editable add-on control on cross-sell order. Fulfilment: editable via "Select Add-on"/"Select IPTV Add-on" buttons, with auto-populated IPTV add-ons and discount.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “only a read-only Discount field ("First-Time Offer - 2 Months Free - BIA") ... no editable add-on control”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Buttons "Select Add-on" / "Select IPTV Add-on". Auto-populated IPTV Add-ons: OSN Get Started, Standard package, Vodafone Club, IDM ID. Discount: Special Discount - 3 Months Free”

## New Fixed Line – Number Selection step (1 fields)

### FLD-284: Number to Reserve / Number search & free number tile selection
`Explicit` · confidence: `high`

- **Data type:** selection grid / text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a grid of free 8-digit fixed-line numbers to reserve (41202641, 41202727, ... ); after Reserve, confirmed number is 41224901”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Select a Number to Reserve:" with an 8-digit number search box and tabs "Free Number" / "Reserved Number"; Free-number tiles shown at QR0.00: 40204351 (selected), ...”

## New Fixed Line – Book Appointment confirm dialog (1 fields)

### FLD-289: Appointment booking confirm (cannot-cancel warning)
`Explicit` · confidence: `high`

- **Data type:** modal/dialog
- **Error message:** “WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment.”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “"WARNING: Appointment once booked cannot be cancelled..." → OK → "Appointment has been successfully booked. ... Appointment ID is 121379"”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a browser confirm dialog appears: "WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment."”

## New Fixed Line – Appointment fetched / booking success (1 fields)

### FLD-290: Appointment Number / Technician ID / Appointment ID (success result)
`Explicit` · confidence: `high`

- **Data type:** text / modal/dialog
- **Editable rule:** read-only
- **Error message:** “Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242. (Fulfilment); Appointment ID is 121379 (Cross Sales)”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “results table shows Appointment Number 1-29793918853, Technician ID ABATS_Consumer_Installation, Status pending”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a success alert: "Appointment has been successfully booked. Appointment details will be sent to the customer via SMS. Appointment ID is 113242."; result table: Appointment Number 1-26921281993”

## New Fixed Line – CAF step (1 fields)

### FLD-291: CAF/Supplementary attachment upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** No (Fulfilment Step 7)
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “an attached document "Vodafone caf sample.pdf" plus placeholder "Supplementary Form" / "+ Add File" tiles”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Attachments" section shown with a "New File" upload link and drop area (existing library shows "1 - 10 of 18+" reusable attachments)”

## New Fixed Line – Activity/completion step (1 fields)

### FLD-292: Comments / Order completion dialog
`Explicit` · confidence: `high`

- **Data type:** text / modal/dialog
- **Mandatory:** Yes (Comments field, Cross Sales)
- **Error message:** “Fixed Line completed successfully. Order Number:- '1-29793912388' (Cross Sales); Order Number:- '1-26921279847' (Fulfilment)”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-cross-sales-fixed-9a023e20.md): “a Comments field filled with "CROSS SALES TESTING"; Save and Finish → "Fixed Line completed successfully. Order Number:- '1-29793912388'"”
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a success dialog: "Fixed Line completed successfully. Order Number:- '1-26921279847'" with a "Finish Process" button”

## Fulfilment – All Person Administration (user setup) (1 fields)

### FLD-293: User ID / Responsibility
`Explicit` · confidence: `high`

- **Data type:** text
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Persons list search by User ID "Hemanth"; record for Last Name "Kumar", User ID "HEMANTH", Responsibility "Back Office Fulfilment"”

## Fulfilment – Person detail form (1 fields)

### FLD-294: Job Title / Alias / Email / Contact Team
`Explicit` · confidence: `high`

- **Data type:** text
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Job Title "Team Leader", Alias "1234999", Email "hemanthk@maveric-sy…", Contact Team "SADMIN"”

## Fulfilment – Responsibilities dialog (1 fields)

### FLD-295: Responsibility (Available/Selected list)
`Explicit` · confidence: `high`

- **Data type:** multi-select list
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Available list on the left, Selected list on the right shows "Back Office Fu…" (checked/primary) and "VFQ Base 2"”

## New Fixed Line/Tablet Activation – Step 1 Contact lookup (1 fields)

### FLD-296: Kahramaa ID / Qatari Id
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “"Please enter Kahramaa & Qatari Id:" — Kahramaa ID = 16P6061, Qatari Id = 29035654458. Buttons: Go, Search again, Cancel”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Agent enters Kahramaa ID: 16P6109 (with links "Search Zone/Street" and "Vodafone ID") and submits”

## Fulfilment/Tablet Activation – Step 1 Contact details (IPTV/contact block) (1 fields)

### FLD-300: Get IPTV? / Email / Language / Alt. phone #
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Yes
- **Validation rule:** This is a notification contact. Please enter a local mobile number.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Get IPTV? = Yes, Email = nobill2@vfq.com, Language = English, Alt. phone # = 97412341234 ("This is a notification contact. Please enter a local mobile number.")”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Get IPTV? = Yes; Email = noemailid@vodafone.com; No Email unchecked; Language = English; Alt. phone # = 97412341234”

## Fulfilment – Fixed Line IPTV popup (1 fields)

### FLD-301: Tick box for different billing email / Billing Email
`Explicit` · confidence: `high`

- **Data type:** checkbox/text
- **Visibility rule:** Billing Email shown only when box ticked
- **Error message:** “IDM Created Successfully”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “a checked box "Tick the box if customer wants a different email to receive bills", Billing Email field = Nobill123@vfq.com”

## Fulfilment – Step 1 Contact – Attachments (1 fields)

### FLD-302: Attachment upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Attachments section appears below with an "Upload" control — per the file title, this step was skipped without uploading any attachment”

## Fulfilment – Step 2 Address (1 fields)

### FLD-303: Primary address checkbox / Service Point
`Explicit` · confidence: `high`

- **Data type:** checkbox/text
- **Editable rule:** Service Point read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “row with Kahramaa Id 16P6061 checked as Primary; Service Points sub-grid lists Service Point 16P6061_004, Status "Available", Device Type ONT”

## Fulfilment – Account Orders view (Account 360) (1 fields)

### FLD-304: Account Name / Account # / Pre-approved / Credit Risk
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Account Name "Vishakan Soundara[rajan]", Account # 126897979237, Pre-approved (Expatriate/Qatari) 1,000, Credit Risk "No score"”

## Fulfilment – Order detail header (1 fields)

### FLD-305: Order Type / Order Sub Type / Fulfillment Status / Credit Limit
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-desktop-fixed-line-fulfil-f6dfc479.md): “Order Type "Activation", Order Sub Type "Triple Play", Status "Open", Fulfillment Status "In Progress", Credit Limit 1,000”

## Tablet Combo Box Normal Activation – Prepatched device detection dialog (1 fields)

### FLD-306: Activation type choice (Instant/Normal)
`Explicit` · confidence: `high`

- **Data type:** button choice
- **Error message:** “We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"We've detected the device at customer's premises ... Proceed with Instant Activation?" Buttons: Instant Activation / Normal Activation”

## Tablet Combo Box Normal Activation – Step 1 Contact details (continued) (1 fields)

### FLD-309: Qatari ID-Front / Qatari ID-Back photo upload
`Explicit` · confidence: `high`

- **Data type:** file upload/photo
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front and Qatari ID-Back photos both uploaded (green check icons)”

## New Fixed Line Tablet – Plan Selection Step (1 fields)

### FLD-310: Plan tile selection
`Explicit` · confidence: `high`

- **Data type:** selection grid
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “GigaHome tiles offered: GigaHome 5Gbps Promotion (selected), GigaHome Essential 250-F Promotion, ... (Combo Box Normal Activation Step 3 Plan)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Please Select a Plan." Search box + plan tiles: GigaHome 5Gbps Promotion (selected — highlighted red, "Add" clicked) (Non Combo Box Normal Activation Plan step)”

## New Fixed Line Tablet – Addon & Discount Step (1 fields)

### FLD-311: Select Add-on / Select IPTV Add-on / Select Discount
`Explicit` · confidence: `high`

- **Data type:** multi-select
- **Validation rule:** If there are no applicable add-on or discount, the selector will be empty.
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Buttons: Select Add-on, Select IPTV Add-on, Select Discount. IPTV Add-ons shown: OSN TV Main, OSNTV Premium Pack Free, IPTV Email Id and Mobile No. (Combo Box Step 4 Addon & Discount)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Buttons Select Add-on and Select Discount; agent clicks Continue without adding any / Skip also available (Non Combo Box Addon & Discount)”

## New Fixed Line Tablet – Number Selection Step (1 fields)

### FLD-312: Free/Available number selection
`Explicit` · confidence: `high`

- **Data type:** selection grid
- **Mandatory:** Yes
- **Error message:** “SUCCESS:Reservation Token:15332434(SBL-EXL-00151) / SUCCESS:Reservation Token:15332436(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “two free numbers offered — 41224335 (QR0.00, selected) and 41224278 (QR0.00) — tabs Free Number / Reserved Number. Reserve button; dialog SUCCESS:Reservation Token:15332434(SBL-EXL-00151) (Combo Box Step 5 Number Selection + Reservation success alert)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Number 41224278 shown at QR0.00, selected (red border) and Reserve clicked. SUCCESS:Reservation Token:15332436(SBL-EXL-00151) (Non Combo Box Number Selection)”

## New Fixed Line Tablet – Book Appointment Step (1 fields)

### FLD-313: Cluster calendar / Booking Comments / Collect QID / Collect CAF / FNP Identifier / Time slot
`Explicit` · confidence: `high`

- **Data type:** date/dropdown/text/radio
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Dialog "Book Appointment", Cluster F1, February 2026 calendar with the 9th highlighted; Booking Comments text box; Collect QID dropdown. Collect QID = Yes, Collect CAF = Yes, FNP Identifier = No, FNP Execution Date (blank). Time slot 8AM-11AM selected (Combo Box Step 6 Book Appointment, calendar + options)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Cluster calendar (February 2026, date 8); Booking Comments free-text; Collect QID = Yes, Collect CAF = Yes, FNP Identifier = No; time-slot 11AM-2PM selected (Non Combo Box Book Appointment modal)”

## New Fixed Line Tablet – Booking Confirmation Dialogs (1 fields)

### FLD-314: Booking cancel warning / booking success message
`Explicit` · confidence: `high`

- **Data type:** modal/dialog
- **Error message:** “WARNING: Appointment once booked cannot be cancelled. Click "Ok" to continue or "Cancel" to select another appointment; "Appointment has been successfully booked...Appointment ID is 14241" / "...Appointment ID is 14243"”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"WARNING: Appointment once booked cannot be cancelled..." OK/Cancel; "Appointment has been successfully booked...Appointment ID is 14241" OK (Combo Box Booking warning/success dialogs)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"WARNING: Appointment once booked cannot be cancelled..." agent clicks OK; "Appointment has been successfully booked...Appointment ID is 14243" (Non Combo Box Booking warning/success)”

## New Fixed Line Tablet – CAF Preview (1 fields)

### FLD-315: Retailer ID / Applicant details / Kahramaa ID/Vodafone ID / Billing information (credit limit, bill cycle, payment method)
`Explicit` · confidence: `high`

- **Data type:** text/dropdown
- **Visibility rule:** Credit-card fields hidden/left blank when payment method is Invoice, not card
- **Editable rule:** Read-only, system-generated CAF preview
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Date 8-Feb-2026, Retailer ID 1122334455. Section 1 – Applicant details ... Section 2 – Billing information: Account credit limit 1000, IPTV Credit Limit 500, Bill date cycle 15, Payment method Invoice (Combo Box Step 7 CAF preview page 1)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Kahramaa ID/Vodafone ID 16P6003; Section 2 – Billing information: Payment method Invoice (credit-card fields left blank since payment method is Invoice) (Non Combo Box CAF preview)”

## New Fixed Line Tablet – Signature Capture (1 fields)

### FLD-316: Customer/Agent signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"Please Sign" pad opens; agent captures the customer's signature; Clear Signature / Done buttons (Combo Box Signature capture)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Please Sign" modal — a signature pad where the agent (or customer) draws a signature; buttons Clear Signature / Done (Non Combo Box E-signature capture)”

## New Fixed Line Tablet – CAF & Additional Attachments Step (1 fields)

### FLD-317: CAF attachment slot / Supplementary Form / Add File
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “three attachment slots: CAF (completed, green check, required), Supplementary Form (empty, optional), Add File (Combo Box Step 7 CAF & Additional Attachments summary)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “step "7. CAF & Additional Attachments" shows the generated CAF tile with a green check (completed/signed) (Non Combo Box CAF & Additional Attachments step)”

## New Fixed Line Tablet – Activity Step (1 fields)

### FLD-318: Comments
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “agent types "Combo box data - Normal Activation" ... "Please note down a comment regarding the actions performed..." (Combo Box Step 8 Activity)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “step "8. Activity": a "Comments" popup with free text Test1234456 entered (Non Combo Box Activity / Comments)”

## New Fixed Line Tablet – Order Completion Dialog (1 fields)

### FLD-319: Order completion message
`Explicit` · confidence: `high`

- **Data type:** modal/dialog
- **Error message:** “"Fixed Line completed successfully. Order Number:- '1-29795175561'" / "...'1-29795232313'"”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “"Fixed Line completed successfully. Order Number:- '1-29795175561'" — Finish Process button (Combo Box Final completion dialog)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Final confirmation popup: "Fixed Line completed successfully. Order Number:- '1-29795232313'" with Finish Process button (Non Combo Box Order completion)”

## New Fixed Line Tablet – My Sales/Pending Approval Orders List (1 fields)

### FLD-320: Approval Status
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Order # 1-29795175561, Approval Status "Submitted for Approval", Status Pending (Combo Box My Sales Orders)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Approval Status "Submitted for Approval", Mobile # 97441224278, Status Pending, Guided Journey New Fixed Line Tablet (Non Combo Box My Pending Approval Orders)”

## New Fixed Line Tablet – Order Approval Detail (Order Details tab) (1 fields)

### FLD-321: Fixed Order Sub Type
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Fixed Order Sub Type: Triple Play, Kahramaa Id 16P6109 (Combo Box Order Approval detail, Order Details tab)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Fixed Order Sub Type: Dual Play (confirms this order bundles broadband + fixed voice) (Non Combo Box Order Approval detail, Order Details tab)”

## New Fixed Line Tablet – Reject Order Dialog (1 fields)

### FLD-322: Reject Reason (multi-select) / Comments
`Explicit` · confidence: `high`

- **Data type:** multi-select dropdown/text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “multi-select Reject Reason field. "ID image not clear" selected. Other reasons: ID type or ID number mismatch, Customer Signature doesn't match with ID, Incorrect add on or discount, Device receipt missing, Missing Speed test result/Building information, Bill explainer missing/Incorrect. Comments box filled with "Phoenix Sprint 66 test" (Combo Box Reject Order dialog)”
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Manager opens "Reject Order" modal: Reject Reason = Original QID was not captured (multi-select tag field), Comments = Sprint test (Non Combo Box Reject flow)”

## Tablet Combo Box Normal Activation – Order correction (Step 1 Contact reopened) (1 fields)

### FLD-323: Qatari ID-Front / Back re-upload
`Inferred` · confidence: `high`

- **Data type:** file upload/photo
- **Mandatory:** Yes
- **Visibility rule:** Re-required specifically when rejection reason cites the ID image
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “Qatari ID-Front/Qatari ID-Back reset to empty upload placeholders — i.e., the correction flow re-requires the flagged evidence (ID photos)”

## Tablet Non Combo Box Normal Activation – Step 1 Contact (Kahramaa ID entry) (1 fields)

### FLD-324: Kahramaa ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Field "Please enter Kahramaa & Contact ID:" — Kahramaa ID entered as 16P6003”

## Tablet Non Combo Box Normal Activation – Contact warning (1 fields)

### FLD-325: Customer already refused service warning
`Explicit` · confidence: `high`

- **Data type:** warning banner
- **Error message:** “Customer already refused the service.”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “the UI displays a warning: "Customer already refused the service." (a pre-existing flag ... not a blocking error)”

## Tablet Non Combo Box Normal Activation – Contact ID capture (1 fields)

### FLD-326: ID Type / ID Number
`Explicit` · confidence: `high`

- **Data type:** dropdown/text
- **Mandatory:** Yes
- **Validation rule:** Confirmed valid via green check
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Agent selects ID Type = "Qatari ID" and enters ID Number = 28060820901, with barcode/scan icon and a green check confirming the ID is valid”

## Tablet Non Combo Box Normal Activation – communication preferences (1 fields)

### FLD-327: Get IPTV? / No Email checkbox / Qatari ID uploads
`Explicit` · confidence: `high`

- **Data type:** enum/checkbox/file upload
- **Mandatory:** Yes
- **Default value:** Get IPTV? = No; Email = noemailid@vodafone.com
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Get IPTV? = No. Email = noemailid@vodafone.com. No Email checkbox unticked. Two required uploads both shown green/verified: Qatari ID-Front* and Qatari ID-Back*”

## Tablet Non Combo Box Normal Activation – Address (1 fields)

### FLD-328: Address selection row / Service Point
`Explicit` · confidence: `high`

- **Data type:** selection grid/text
- **Editable rule:** Service Point read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “a grid of addresses tied to the contact ... Service Points grid lists two service points: 16P6003_ON… and 1-DOO0GLC”

## Tablet Non Combo Box Normal Activation – Order Rejected (agent side) (1 fields)

### FLD-329: Rejection Reason (display)
`Explicit` · confidence: `high`

- **Data type:** text
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “filter "My Rejected Orders" shows order 1-29795232313, Approval Status "Rejected", Rejection Reason "Original QID w…" (truncated)”

## Tablet Non Combo Box Normal Activation – Order Correction step 2 CAF (1 fields)

### FLD-330: Proof of Employment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Step "2. CAF" now presents Proof of Employment, CAF, Supplementary Form, Add File tiles — needing re-completion as part of the correction”

## Tablet Non Combo Box Normal Activation – Order Correction resubmit confirmation (1 fields)

### FLD-331: Resubmission confirmation message
`Explicit` · confidence: `high`

- **Data type:** modal/dialog
- **Error message:** “Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “Popup: "Your activation request is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval"”

## Tablet Non Combo Box Normal Activation – Approve Order modal (1 fields)

### FLD-332: Approve Order confirmation checkbox/comment
`Explicit` · confidence: `high`

- **Data type:** text/attestation
- **Mandatory:** Yes
- **Error message:** “By clicking submit, I agree that I have verified all the documents and details to proceed with submission.”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “"Approve Order": "By clicking submit, I agree that I have verified all the documents and details to proceed with submission." Comments field filled with Approved”

## Tablet Non Combo Box Normal Activation – Backend SMS (approval) (1 fields)

### FLD-333: Approval SMS payload (SMSTXT)
`Explicit` · confidence: `high`

- **Technical name:** SMSTXT
- **Data type:** text
- **Editable rule:** system-generated
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5627824b.md): “characteristic SMSTXT with value: "New Fixed Line Tablet for MSISDN 97441224278 with Order number 1-29795232313 is now approved. You can check the order status in My Sales Order."”

## Tablet Combo Box Normal Activation – Order Approval action buttons (1 fields)

### FLD-334: Approve / Reject buttons
`Explicit` · confidence: `high`

- **Data type:** button
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-0518ffc2.md): “action buttons in the header: Approve, Reject - Correction, Reject - Drop Order, Go Back”

## New Fixed Line Tablet - Step 1 Contact (Kahramaa lookup) (1 fields)

### FLD-335: Kahramaa ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** appears to trigger backend lookup on Go/search icon
- **Visibility rule:** visible at step 1 entry
- **Editable rule:** editable before search
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Field "Please enter Kahramaa & Contact ID:" with "Kahramaa ID" = `16P6109` and a search/go icon”

## New Fixed Line Tablet - Step 1 Contact (1 fields)

### FLD-336: DO NOT DISTURB
`Explicit` · confidence: `high`

- **Data type:** button/toggle
- **Mandatory:** No
- **Visibility rule:** appears next to Kahramaa ID field after lookup
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “tooltip: "Set Do Not Disturb if the customer refused the service."”

## Combo Box CPE Detection Dialog (1 fields)

### FLD-337: Instant Activation / Normal Activation choice
`Explicit` · confidence: `high`

- **Data type:** button (binary choice)
- **Mandatory:** Yes
- **Visibility rule:** shown only when system detects a prepatched ComboBox CPE + ONT serial at the Kahramaa/service point
- **Editable rule:** one-time choice per dialog
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?"”

## New Fixed Line Tablet - Step 8 Activity (1 fields)

### FLD-355: Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “note: "Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history."”

## CAF - Section 1 Applicant details (1 fields)

### FLD-356: Kahramaa ID/Vodafone ID
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** auto-populated
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “Kahramaa ID/Vodafone ID `16P6109/VF16-TS01-103`”

## Signature capture pad (1 fields)

### FLD-364: Signature
`Explicit` · confidence: `high`

- **Data type:** signature (canvas draw)
- **Mandatory:** Yes
- **Editable rule:** can Clear Signature and redo
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-5d0677b9.md): “"Please Sign" modal with a hand-drawn cursive signature already captured on the line, and "Clear Signature" / "Done" buttons”

## New Fixed Line Tablet - Step 1 Contact (B2B2C variant) (1 fields)

### FLD-365: Company Name (B2B2C)
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Visibility rule:** B2B2C-specific field
- **Editable rule:** agent selects from company list
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Company Name B2B2C dropdown: agent selects "SIPT" from a company list (01 newfreedcn01_Test, 01 querybar01, 0109FN3 0109LN3, SIPT, 08 May Sanity Mav_Sriram, etc.)”

## New Fixed Line Tablet - Step 7 CAF & Additional Attachments (B2B2C) (1 fields)

### FLD-368: Proof of Employment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** required for B2B2C, must be completed before Continue enabled
- **Visibility rule:** B2B2C-specific
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Step 7 requires Proof of Employment* (required, B2B2C-specific), CAF* (auto-generated/required)... Both Proof of Employment and CAF are uploaded/completed (green checkmarks) before Continue is enabled”

## Order Approval screen (1 fields)

### FLD-369: Approve / Reject - Correction / Reject - Drop Order
`Explicit` · confidence: `high`

- **Data type:** button (action set)
- **Mandatory:** No
- **Visibility rule:** visible on Order Approval screen for pending orders
- **Editable rule:** manager-only action
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back”

## Order Approval - Approve Order modal (1 fields)

### FLD-370: Approve Order Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Error message:** “By clicking submit,I agree that I have verified all the documents and details to proceed with submission”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a.md): “Manager clicks Approve → "Approve Order" modal: "By clicking submit,I agree that I have verified all the documents and details to proceed with submission". Comments entered: "B2B2C - Zero Touch - Approved"”

## New Fixed Line Tablet - Step 4 Addon & Discount (1 fields)

### FLD-371: Select Add-on / Select IPTV Add-on / Select Discount
`Explicit` · confidence: `high`

- **Data type:** button/selector
- **Mandatory:** No
- **Default value:** empty
- **Validation rule:** if there are no applicable add-on or discount, the selector will be empty
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “"Select applicable add-on and discount based on customer's plan" with buttons Select Add-on / Select IPTV Add-on / Select Discount... Note: "if there are no applicable add-on or discount, the selector will be empty."”

## New Fixed Line Tablet - Step 6 Book Appointment submit (1 fields)

### FLD-378: Appointment cancel warning
`Explicit` · confidence: `high`

- **Data type:** confirm dialog
- **Mandatory:** No
- **Visibility rule:** shown on Submit
- **Error message:** “WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “a warning dialog appears: "WARNING: Appointment once booked cannot be cancelled. Click 'Ok' to continue or 'Cancel' to select another appointment" (OK / Cancel)”

## Order Correction (Tablet re-entry) (1 fields)

### FLD-381: Qatari ID-Front / Qatari ID-Back (re-upload)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Default value:** cleared/empty
- **Editable rule:** cleared upon rejection reason 'ID image not clear', must be re-uploaded
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “now-empty Qatari ID-Front / Qatari ID-Back upload placeholders (i.e., the rejected images were cleared, consistent with the "ID image not clear" rejection reason) — the agent must re-upload valid ID images”

## Rejection SMS (system-generated) (1 fields)

### FLD-382: SMS notification text
`Explicit` · confidence: `high`

- **Technical name:** SMSTXT
- **Data type:** system-generated text
- **Mandatory:** No
- **Visibility rule:** triggered on Reject - Correction
- **Error message:** “New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order.”
- **Sources:**
  - [`guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6`](../.knowledge/docs/guided-journeys-fixed-line-open-ui-tablet-fixed-line-with-ap-430ea4f6.md): “CharacteristicsValue characteristicName="SMSTXT" with Value: "New Fixed Line Tablet for MSISDN 97441224335 with Order number 1-29795175561 was rejected. Please Go to Sales Order My Rejected Orders to correct your order."”

## FWA Desktop Vanilla - FMS CPE Bundle configuration (1 fields)

### FLD-391: Equipment sub-type (FMS CPE Indoor IDU / FMS CPE ODU / FMS CPE Outdoor IDU)
`Explicit` · confidence: `high`

- **Data type:** radio/checkbox selector
- **Mandatory:** Yes
- **Editable rule:** one selectable per bundle
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “agent selects equipment sub-type FMS CPE Indoor IDU (vs. FMS CPE ODU / FMS CPE Outdoor IDU options)”

## FWA Desktop Vanilla - Numbers tab (1 fields)

### FLD-397: Number Reservation confirmation
`Explicit` · confidence: `high`

- **Data type:** system message
- **Mandatory:** No
- **Error message:** “SUCCESS: Reservation Token:13758017(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-indoor-f964a90a.md): “system dialog confirms "SUCCESS: Reservation Token:13758017(SBL-EXL-00151)"”

## FWA Outdoor WFM - Contact form (1 fields)

### FLD-398: Address
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “Address "test1", City "Doha", County "AK", Country "Qatar", PO Box "1111"”

## FWA Outdoor WFM - Account Addresses (1 fields)

### FLD-399: Area
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “selecting Area "Al Rayyan" from a dropdown for the address row”

## FWA Outdoor WFM - Book Appointments dialog (1 fields)

### FLD-402: Date/time slot grid
`Explicit` · confidence: `high`

- **Data type:** calendar/slot selector
- **Mandatory:** Yes
- **Validation rule:** capacity-limited
- **Editable rule:** slots show live capacity and can be Full
- **Error message:** “Full”
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-fwa-outdoor-wfm-4edebda3.md): “On 09/07/2025, the 8AM-11AM and 11AM-2PM slots show "Full" (red)”

## FWA Indoor Modify CPE - Line Item Attributes grid (1 fields)

### FLD-420: Attribute Action (per attribute row)
`Explicit` · confidence: `high`

- **Data type:** system flag (e.g. Update / -)
- **Mandatory:** No
- **Default value:** -
- **Editable rule:** system-set based on whether field changed
- **Sources:**
  - [`guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3`](../.knowledge/docs/guided-journeys-fwa-desktop-vanilla-indoor-modify-cpe-25b6dab3.md): “Indoor Unit Se[rial Number]: Value S180P18055020, Action "Update", Description S180P18055021”

## FWA negative scenarios - Address step / FWA Address (Step 2) (1 fields)

### FLD-421: Zone
`Explicit` · confidence: `high`

- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** required field; required to save address
- **Editable rule:** Editable
- **Error message:** “Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area / Please enter required fields — Zone, Street No., Building No., Apt/Flat/Unit, Area — or click Skip Address to proceed without Saving Address.”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “On step "2. Address" with Zone, Street No., Building No., Apt/Flat/Unit, and Area all empty, clicking Save Address produces a modal dialog: "Please enter required fields Zone, Street No., Building No., Apt/Flat/Unit.,Area"”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Submitting with empty fields triggers dialog: Please enter required fields...”

## FWA Postpaid Business - Address step (Skip variant) (1 fields)

### FLD-426: Skip Address option
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Editable rule:** available only in the Business/Static Data journey variant
- **Error message:** “Please enter required fields
Zone, Street No., Building No., Apt/Flat/Unit, Area
or click Skip Address to proceed without Saving Address.”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “the modal here offers an escape hatch not present in the Tablet flow: "...or click Skip Address to proceed without Saving Address."”

## FWA negative scenarios - CAF & Additional Attachments step (1 fields)

### FLD-429: Supplementary Form
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Default value:** empty/greyed out
- **Validation rule:** must be selected before Continue
- **Editable rule:** marked mandatory with red asterisk
- **Error message:** “Error: Please select Supplementary Form before continuing.”
- **Sources:**
  - [`guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c`](../.knowledge/docs/guided-journeys-fwa-fwa-indoor-outdoor-negative-scenarios-1644123c.md): “the "Supplementary Form" tile (marked mandatory with a red asterisk, alongside "Add File") is still empty/greyed out. Clicking Continue produces an inline banner: "Error: Please select Supplementary Form before continuing."”

## Open UI Desktop FWA Indoor - Step 1 Contact / FWA Contact — Connection Details popup (1 fields)

### FLD-431: Connection Details popup (Total Prepaid/Postpaid Connections)
`Explicit` · confidence: `high`

- **Data type:** info popup
- **Mandatory:** No
- **Validation rule:** Triggers advisory note when Postpaid connections count >=2
- **Visibility rule:** appears automatically after ID validated / shown automatically on ID lookup
- **Editable rule:** auto-shown, not user-editable; Read-only
- **Error message:** “Note - Customer already has 2 or more Post-paid connections. Please check the credit policy or seek credit control approval before proceeding”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A "Connection Details" popup appears automatically: "Total Number of Prepaid Connections: 0", "Total Number of Postpaid Connections: 1", with a "Show Postpaid Plan Details" link”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Total Number of Prepaid Connections: 0, Total Number of Postpaid Connections: 0”
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Total Number of Postpaid Connections: 2 ... Note - Customer already has 2 or more Post-paid connections...”

## Open UI Desktop FWA Indoor - Step 1 Contact (1 fields)

### FLD-433: Advance payment banner
`Explicit` · confidence: `high`

- **Data type:** info banner
- **Mandatory:** No
- **Visibility rule:** conditional (HRN-triggered)
- **Editable rule:** system-generated, not editable
- **Error message:** “(HRN) Customer needs to pay advance payment of QR 100.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “An informational banner appears: "(HRN) Customer needs to pay advance payment of QR 100."”

## FWA Contact (Step 1) / Open UI Desktop FWA Indoor - Step 1 Contact Attachments (1 fields)

### FLD-434: Attachment upload — Qatari ID-Front / Qatari ID-Back
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Green check on successful upload
- **Editable rule:** Editable/uploadable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “An Attachments section requires an uploaded document (a file "Vishakan_QID_Front.JPG" is shown attached) via the Upload button”
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Attachments section: uploaded "Vishakan_QID_Front.JPG".”

## Open UI Desktop FWA Indoor - Step 8 CAF (1 fields)

### FLD-435: CAF type selector (CAF-Digital / CAF-Manual / CAF-Touch Screen)
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen”

## Open UI Desktop FWA Indoor - Order submission popup (1 fields)

### FLD-436: Switch-to-151 instruction
`Explicit` · confidence: `high`

- **Data type:** info popup
- **Mandatory:** No
- **Visibility rule:** shown at order submission
- **Editable rule:** system-generated
- **Error message:** “Advise customer to send switch to 151”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “A popup instructs: "Advise customer to send switch to 151" (OK button)”

## Open UI Desktop FWA Indoor - CAF signature confirmation (1 fields)

### FLD-437: Customer notification confirmation
`Explicit` · confidence: `high`

- **Data type:** system alert
- **Mandatory:** No
- **Visibility rule:** shown after signature captured
- **Error message:** “Notify customer that a copy of the CAF will be sent to his registered email address.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-indoor-5fd143cf.md): “a browser alert states: "Notify customer that a copy of the CAF will be sent to his registered email address." (OK button)”

## FWA Plan (Step 3) (1 fields)

### FLD-453: Plan selection tile
`Explicit` · confidence: `high`

- **Data type:** selection/radio (tile picker)
- **Mandatory:** Yes
- **Visibility rule:** Tile list varies by Indoor/Outdoor
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Plan tiles offered: GigaHome 5G Classic New Indoor FWA Promotion... GigaHome Premium OD New 5G FWA Promotion (selected)”

## FWA CAF (Step 8) (1 fields)

### FLD-465: CAF type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “CAF type dropdown: CAF-Digital, CAF-Manual, CAF-Touch Screen.”

## FWA CAF (Step 8) — Section 1 Applicant details (1 fields)

### FLD-466: Customer type / Name / DOB / Qatar ID / Nationality / Email / PO Box / Alt. contact / Address
`Explicit` · confidence: `high`

- **Data type:** text (auto-filled from order)
- **Mandatory:** Yes
- **Editable rule:** Mostly read-only (pre-filled from order)
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Section 1 – Applicant details: Customer type Consumer; Name "MAN KAMI, 01 vfqatest01"; DOB 1-Jan-1977; Qatar ID 27752403206...”

## FWA CAF (Step 8) — Section 2 Billing information (1 fields)

### FLD-467: Account credit limit / Bill date cycle / Bill format / Bill language / Bill delivery mode / Payment method
`Explicit` · confidence: `high`

- **Data type:** text/dropdown (auto-filled)
- **Mandatory:** Yes
- **Editable rule:** Mostly read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Section 2 – Billing information: Account credit limit 1000; Bill date cycle 1; Bill format Detail; Bill language English; Bill delivery mode Email; Payment method Invoice”

## FWA CAF (Step 8) — Section 3 Postpaid Customers (1 fields)

### FLD-468: Mobile number
`Explicit` · confidence: `high`

- **Data type:** text (auto-filled)
- **Mandatory:** Yes
- **Visibility rule:** Shown only for postpaid
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Section 3 – For Postpaid Customers: Mobile number / Primary mobile number 97441202301”

## FWA CAF (Step 8) — Section 4 Superfast Broadband & Home Phone (1 fields)

### FLD-469: Landline Number / Plan Name / Appointment Details / Signature
`Explicit` · confidence: `high`

- **Data type:** text + signature capture
- **Mandatory:** Yes
- **Validation rule:** Must be signed before continuing (Sign Contract flow)
- **Visibility rule:** Appointment Details blank until Book Appointment completed
- **Editable rule:** Signature captured via pad
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Section 4 – Superfast Broadband & Home Phone: Landline Number 97441202301; Plan Name...; Appointment Details "Appointment ID: Appointment Date: -" (blank at this point); Signature blank.”

## FWA Activity (Step 9) (1 fields)

### FLD-473: Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Comments popup, agent types "Test123 FWA Outdoor". Info note: Please note down a comment regarding the actions performed...”

## Order submission confirmation (1 fields)

### FLD-474: Order Number (system-generated)
`Explicit` · confidence: `high`

- **Data type:** text (read-only, system generated)
- **Mandatory:** Unknown
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Success message: "Postpaid completed successfully. Order Number:- '1-29728035948'"”

## My Sales Order / My Pending Approval Orders (1 fields)

### FLD-475: Approval Status
`Explicit` · confidence: `high`

- **Data type:** text (read-only status)
- **Mandatory:** Unknown
- **Visibility rule:** Only populated when order routed to approval
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09`](../.knowledge/docs/guided-journeys-fwa-open-ui-tabelt-fwa-indoor-b2b2c-808aeb09.md): “Approval Status "Submitted for Approval"”

## Order Approval — Approve Order dialog (1 fields)

### FLD-476: Comments (approval)
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Visibility rule:** Shown when approver clicks Approve
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Approve Order dialog (image36) ... Comments text box (populated with "Approved")”

## Order Approval — Reject options (1 fields)

### FLD-477: Reject - Correction / Reject - Drop Order
`Explicit` · confidence: `high`

- **Data type:** button (action)
- **Mandatory:** Unknown
- **Visibility rule:** Shown alongside Approve / Go Back
- **Sources:**
  - [`guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f`](../.knowledge/docs/guided-journeys-fwa-open-ui-tablet-fwa-indoor-with-approval-20d1253f.md): “Top-right action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back.”

## WFM Assess Activity — Kahramaa check (1 fields)

### FLD-484: Kahrama ID duplicate check result
`Explicit` · confidence: `high`

- **Data type:** text (system dialog, read-only)
- **Mandatory:** Unknown
- **Validation rule:** Checks last 30 days
- **Visibility rule:** Shown during Assess Activity
- **Editable rule:** Read-only
- **Error message:** “No previous records are found based on Kahrama ID in last 30 days.”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Dialog on OFSC plugin domain: "No previous records are found based on Kahrama ID in last 30 days."”

## VFQ Inventory Loading Excel (1 fields)

### FLD-498: Inventory Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Validation rule:** Values from a fixed list
- **Editable rule:** Editable
- **Error message:** “Please Choose Values from the List”
- **Sources:**
  - [`guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7`](../.knowledge/docs/guided-journeys-fwa-open-ui-desktop-fwa-outdoor-wfm-b581b4d7.md): “Inventory Type column (dropdown "Please Choose Values from the List")”

## MNP Postpaid Address (Step 2) (1 fields)

### FLD-502: Zone / Street No. / Building No. / Apt/Flat/Unit
`Inferred` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Section "2. Address" expanded with blank fields: Zone, Street No., Building No., Apt/Flat/Unit — none pre-filled.”

## MNP Postpaid Billing (Step 3) (1 fields)

### FLD-503: Billing profile row (Language, Payment Type, Billing Profile Status, Payment Method, Bill Media, Comments)
`Explicit` · confidence: `high`

- **Data type:** text/grid (read-only)
- **Mandatory:** Unknown
- **Editable rule:** Read-only for existing profile
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “a billing profile grid...showing one row: Status (green/active indicator bar), Language ENG, Payment Type Postpaid, Billing Profile Status Active, Payment Method Invoice, Bill Media Email, Comments (blank)”

## MNP Postpaid SIM Serial (Step 4) (1 fields)

### FLD-504: SIM Serial
`Explicit` · confidence: `high`

- **Data type:** text (barcode scan)
- **Mandatory:** Yes
- **Editable rule:** Editable, scannable
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Field SIM Serial filled with value 8942702111346231021, validated with a green checkmark.”

## Cross Sales Offers grid (1 fields)

### FLD-507: Offer action (Accept / Interested / Reject / Close)
`Explicit` · confidence: `high`

- **Data type:** button (action)
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-cross-sales-mnp-b0370d82.md): “Action buttons above the offers grid: Accept, Interested, Reject, Close.”

## Home Move — KID entry screen (1 fields)

### FLD-508: KID (location identifier the user is moving to)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Validation rule:** Triggers Fiber-readiness check
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Enter the KID the user is moving to and click Go; system pop-up confirms "Location entered is Fiber-ready. Do you want to continue with Home Move?"”

## Home Move — Fixed Number entry (1 fields)

### FLD-509: Fixed Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Editable rule:** Editable
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “enter the Fixed Number and click Go”

## Home Move — Activity Portal (1 fields)

### FLD-510: Comments
`Explicit` · confidence: `high`

- **Data type:** text (free text)
- **Mandatory:** Yes
- **Validation rule:** Comments field should have more than 5 characters
- **Editable rule:** Editable
- **Error message:** “comments >5 characters”
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “note states "Comments field should have more than 5 characters"”

## Home Move — Address verification (1 fields)

### FLD-511: Address information
`Explicit` · confidence: `high`

- **Data type:** text (verify/confirm)
- **Mandatory:** Yes
- **Editable rule:** Editable/verifiable
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “verify Address information and click Continue”

## Home Move — Book Appointment (1 fields)

### FLD-512: Cluster selection
`Explicit` · confidence: `high`

- **Data type:** dropdown/selection
- **Mandatory:** Yes
- **Editable rule:** Selectable
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “Book Appointment — select Cluster, book slot, click Submit”

## Home Move — WFM Assess Activity (1 fields)

### FLD-513: KID eligibility for Home Move (validation popup)
`Explicit` · confidence: `high`

- **Data type:** validation dialog (read-only)
- **Mandatory:** Unknown
- **Validation rule:** Checks whether KID is eligible for Home Move
- **Editable rule:** Read-only
- **Sources:**
  - [`guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5`](../.knowledge/docs/guided-journeys-home-move-open-ui-desktop-home-move-fixed-to-3889c8d5.md): “click Assess Activity — validation popup checks whether KID is eligible for Home Move”

## Administration – Person Administration (Responsibility) (1 fields)

### FLD-514: Responsibility
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Responsibility field set to 'VFQA Sales' and a 'New Responsibility' field showing 'AT Service Analyti...'”

## Administration – Product Promotions – More Info (1 fields)

### FLD-515: Payment Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** Postpaid
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Payment Type 'Postpaid', Effective Dates 08/27/2020–08/31/…”

## Administration – Bill Limit Mapping (1 fields)

### FLD-516: Agent Min Value
`Explicit` · confidence: `high`

- **Data type:** number
- **Default value:** 50
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Bill Limit Mobile: SL List Price 3, Agent Min Value 50 (being edited)”

## MNP Postpaid – Contact – Attachments (1 fields)

### FLD-522: Attachments (upload)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Attachments panel with an Upload button and 4 existing files: Test.jpg, Qatari ID-Back...”

## MNP Postpaid – Billing (1 fields)

### FLD-527: Billing Profile Name
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1-D87EQYB
- **Editable rule:** read-only, system-generated
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Name 1-D87EQYB”

## MNP Postpaid – SIM Serial (1 fields)

### FLD-528: SIM Serial
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 8942702400000026363 (desktop example); 8942702400000026214 (tablet example)
- **Validation rule:** Green check on scan/entry
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-desktop-mnp-postpaid-6cb03f33.md): “Please enter or scan the SIM Serial number below. Field SIM Serial = 8942702400000026363, green check”
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Field SIM Serial = 8942702400000026214 with green check”

## MNP Tablet Postpaid – Contact confirmation (1 fields)

### FLD-549: Nationality
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** Nepalese
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “Nationality Nepalese, Gender M, First name BIJAY, Last name MAHATO”

## MNP Tablet Postpaid – Addon & Discount (Mass Market Addons) (1 fields)

### FLD-553: Mass Market Addons (checklist)
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “scrollable checklist 'Mass Market Addons' with items and prices: Pakistan QR35 Add On..., International 50 — checked (QR50.00)”

## MNP Activity (Postpaid/Prepaid MNP journeys) (1 fields)

### FLD-562: Comments
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes (Postpaid journey)
- **Default value:** Testing (Prepaid example)
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “empty Comments textbox and info note: 'Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.'”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Comments' popup textbox where the agent typed 'Testing', with guidance text: 'Please note down a comment regarding the actions performed...'”

## MNP completion popup (Postpaid/Prepaid MNP journeys) (1 fields)

### FLD-563: Order Number confirmation
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1-29822004764 (Postpaid example) / 1-23864057846 (Prepaid example)
- **Editable rule:** system-generated
- **Sources:**
  - [`guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743`](../.knowledge/docs/guided-journeys-mnp-postpaid-open-ui-tablet-mnp-postpaid-hrn-10ba9743.md): “'MNP completed successfully. Order Number:- 1-29822004764' with a Finish Process button”
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'MNP completed successfully. Order Number:- 1-23864057846' with a Finish Process button”

## MNP Prepaid – SIM Serial (1 fields)

### FLD-570: SIM Serial
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** 8942702400000027026
- **Validation rule:** green check appears, then status message 'SIM Serial check and number reservation in progress. Please wait...'
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “Agent enters 8942702400000027026, green check appears, then status message 'SIM Serial check and number reservation in progress. Please wait...'”

## Prepaid Customer Application Form (CAF) (1 fields)

### FLD-571: Valid Qatari ID/RP Number / Passport Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** undefined
- **Validation rule:** data-binding gap observed in this build (field displayed literal value 'undefined')
- **Sources:**
  - [`guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa`](../.knowledge/docs/guided-journeys-mnp-prepaid-open-ui-tablet-mnp-prepaid-515ab9aa.md): “'Valid Qatari ID/RP Number / Passport Number' shows literal value 'undefined' (a data-binding gap in this build — flagged, not glossed over)”

## Lead Details View (Lead Edit, Owner Change) (1 fields)

### FLD-588: Lead Owner
`Explicit` · confidence: `high`

- **Data type:** lookup/picker
- **Default value:** HEMANTH (example instance) / VINODHINIR (Admin full view instance)
- **Editable rule:** manager can reassign via Lead Owner lookup popup listing candidate owners
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Lead Owner: HEMANTH ... A modal titled 'Lead Owner' opens with a searchable picker (Last Name filter) listing 5 candidate owners”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “Outlet Id 1234, Lead Owner VINODHINIR, Ownership History (lookup, blank shown), Assigned Team 'Testing.'”

## Lead Owner reassignment popup (1 fields)

### FLD-589: Owner picker (Last Name / User ID filter)
`Explicit` · confidence: `high`

- **Data type:** lookup/picker (search)
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “listing 5 candidate owners with Job Title: KARTHIKK (Back Office Team...), Kumar / Hemanth (Team Leader), Manager / Test, VINODHINIR (Retail Agent), rpa_user”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “search box labelled 'User ID', results grid (Last Name / First Name / Job Title / Availability / Until)”

## Lead Details View (Description edit) (1 fields)

### FLD-590: Description
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Default value:** Test1234 / Postpaid lead test / MNP from Home (varies by instance)
- **Editable rule:** opens as a text-edit popup with OK button; replaces prior text
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-lead-edit-53663c45.md): “'Description' text-edit popup opens ... types 'Test1234' replacing the prior text, with an OK button”
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “agent types 'Postpaid lead test', then clicks OK”
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “modal dialog titled 'Description' with a multi-line text box. Agent types 'MNP from Home' into the box”

## Lead Details View (Fixed Pre-sales edit) (1 fields)

### FLD-596: Service Needed
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Default value:** MNP (changed from Home)
- **Editable rule:** header field opened as editable dropdown for post-creation edit
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “header Service Needed field is opened as an editable dropdown ... agent selects MNP (changing it from 'Home')”

## Lead Details View (Mobile) (1 fields)

### FLD-597: Lead Sub Status
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Editable rule:** options: Call Back (selected), No Answer
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-lead-creation-mobile-08523753.md): “Lead Sub Status dropdown opened; options: Call Back (selected) and No Answer”

## Create a Lead (Fixed Pre-sales, Tablet) / Address tab (Lead) (1 fields)

### FLD-600: Zone/Street/Building/Unit
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1004 / 1005 / 1006 / 1007F
- **Editable rule:** system-populated on Address tab as combined Address Line 1 'Zone 1004, Street 1005, Building No. 1006, Apt/Flat/Unit 1007F' with Country Qatar, Postal Code 1111
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Zone: 1004, Street: 1005, Building: 1006, Unit: 1007F”
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Address Line 1 'Zone 1004, Street 1005, Building No. 1006, Apt/Flat/Unit 1007F', Country Qatar, Postal Code 1111”

## Address tab (Lead) (1 fields)

### FLD-601: Postal Code
`Explicit` · confidence: `high`

- **Data type:** text
- **Default value:** 1111
- **Editable rule:** system-populated
- **Sources:**
  - [`guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b`](../.knowledge/docs/guided-journeys-open-ui-tablet-lead-tablet-lead-creation-wit-0e35d62b.md): “Address Line 1 'Zone 1004, Street 1005, Building No. 1006, Apt/Flat/Unit 1007F', Country Qatar, Postal Code 1111”

## Passport to QID Update (Step 3) (1 fields)

### FLD-604: QID Number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 3: Enter the QID Number then click on Update ID”

## Passport to QID Update (Step 5) (1 fields)

### FLD-605: QID – Front & Back (upload/scan)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 5: Scroll down, then Scan or Upload the QID – Front & Back, then click Continue”

## Identification number change form (Step 6-8) (1 fields)

### FLD-606: Applicant/customer signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271`](../.knowledge/docs/guided-journeys-passport-to-qid-journey-open-ui-tablet-passp-fc5d9271.md): “Step 7: Sign the Contract & click Done; Step 8: Signature is captured in the generated form, then click Done”

## SIM Serial (New Postpaid wizard) (1 fields)

### FLD-631: SIM Serial number
`Explicit` · confidence: `high`

- **Data type:** text (scan or manual)
- **Mandatory:** Yes
- **Validation rule:** Verified with green checkmark
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'Please enter or scan the SIM Serial number below.' SIM Serial: 8942702111338839146, verified (green check).”

## CAF step (New Postpaid wizard) (1 fields)

### FLD-636: New File (attachment upload)
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Conditional
- **Validation rule:** At least one attached in example
- **Editable rule:** Delete icon available
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “'New File' upload control, one file already attached — 'PPVT TESTING SAMPLE.pdf' (with delete icon)”

## Order completion confirmation (1 fields)

### FLD-646: Postpaid completed successfully message
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Visibility rule:** Fires after Save and Finish
- **Error message:** “Postpaid completed successfully. Order Number:- '1-225217281463'”
- **Sources:**
  - [`guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323`](../.knowledge/docs/guided-journeys-postpaid-cross-sales-open-ui-desktop-new-pos-7b5ae323.md): “A confirmation popup reads: 'Postpaid completed successfully. Order Number:- '1-225217281463''”

## Catalog > Browse tab (1 fields)

### FLD-659: Product search box
`Explicit` · confidence: `high`

- **Data type:** text (search)
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Search box 'U Plus' returns one tile: 'Postpaid U Plus Promotion', Qty 1, being added to the cart”

## Order header (Validate action) (1 fields)

### FLD-669: Validate button
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Validation rule:** Fires informational + blocking dialogs based on bill-limit rules
- **Error message:** “Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.”
- **Sources:**
  - [`guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de`](../.knowledge/docs/guided-journeys-postpaid-desktop-vanilla-new-postpaid-2847b2de.md): “Clicking 'Validate' on the order header... produces a browser dialog... 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

## Retail New Postpaid - Bill Limit edit (1 fields)

### FLD-670: Bill Limit value
`Explicit` · confidence: `medium`

- **Data type:** number
- **Mandatory:** Yes
- **Validation rule:** Below Agent minimum value blocks the journey; above Agent minimum value allows journey to proceed
- **Editable rule:** editable by VFQA Sales-responsibility agent
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-f8227f90.md): “'When agent enters below Agent minimum value' ... 'When agent enters above Agent minimum value, user can proceed the journey'”

## HRN New Postpaid - Account Detail (starting context) (1 fields)

### FLD-671: CR Type
`Explicit` · confidence: `high`

- **Data type:** dropdown/display
- **Mandatory:** No
- **Default value:** Pre-approved (Expatriate/Qatari) 800
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “The `CR Type` field is set to 'Pre-approved (Expatriate/Qatari)' with a value of 800 next to it”

## HRN New Postpaid - Contact ID entry (1 fields)

### FLD-672: Customer's Qatari ID or Passport number
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'Please enter the customer's Qatari ID or Passport number': ID number 27652419981, ID type Qatari ID, clicks Go”

## HRN New Postpaid - Connection Details modal (1 fields)

### FLD-673: HRN advance payment notice
`Explicit` · confidence: `high`

- **Data type:** info banner
- **Mandatory:** No
- **Validation rule:** Triggered for HRN (high-risk-nationality) customers
- **Visibility rule:** shown on Connection Details popup
- **Error message:** “(HRN) Customer needs to pay advance payment of QR 100.”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “info banner: '(HRN) Customer needs to pay advance payment of QR 100.'”

## HRN New Postpaid - Number Selection (1 fields)

### FLD-674: Reservation success alert
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “SUCCESS:Reservation Token:15632489(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “a JS confirm alert reads: 'SUCCESS:Reservation Token:15632489(SBL-EXL-00151)'”

## HRN New Postpaid - Plan detail / Edit Credit Limit (1 fields)

### FLD-675: Credit Limit
`Explicit` · confidence: `high`

- **Data type:** dropdown (preset values)
- **Mandatory:** No
- **Default value:** 800
- **Visibility rule:** shown pre-populated from account's pre-approved value
- **Editable rule:** editable via 'Edit Credit Limit' button, preset dropdown values
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'Credit Limit:800'... Clicking Edit Credit Limit reveals a dropdown of selectable values: 0, 1000, 1500, 200, 2000, 50, 500, 800... Agent selects 1000”

## HRN New Postpaid - Plan detail (1 fields)

### FLD-676: No Bill Limit selected
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'No Bill Limit selected'”

## HRN New Postpaid - Payment (1 fields)

### FLD-677: Reason
`Explicit` · confidence: `high`

- **Data type:** dropdown
- **Mandatory:** Conditional
- **Default value:** For Testing Only
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “'Number' panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown = 'For Testing Only.'”

## HRN New Postpaid - Sales Order Line Items (post-sign) (1 fields)

### FLD-682: Credit Limit (order rail)
`Explicit` · confidence: `high`

- **Data type:** display (number)
- **Mandatory:** No
- **Default value:** 1,000
- **Visibility rule:** right rail
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2`](../.knowledge/docs/guided-journeys-postpaid-open-ui-desktop-new-postpaid-hrn-cu-9d77c0e2.md): “On the right rail: Credit Control Credit Limit blank, Credit Limit: 1,000 (highlighted field)”

## B2B2C With Approval - Step6 SIM Serial (1 fields)

### FLD-697: SIM Serial number
`Explicit` · confidence: `high`

- **Data type:** text (scan or manual)
- **Mandatory:** Yes
- **Default value:** 894270240000026362
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Please enter or scan the SIM Serial number below.' SIM Serial = 894270240000026362”

## B2B2C With Approval - CAF preview (1 fields)

### FLD-698: Account credit limit / Smart Limit / Bill date cycle / Bill format / Bill language / Bill delivery mode / Payment method
`Explicit` · confidence: `high`

- **Data type:** display (generated)
- **Mandatory:** No
- **Default value:** Account credit limit 1000, Smart Limit 100, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice
- **Visibility rule:** Billing info section of CAF
- **Editable rule:** read-only (generated)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Account credit limit 1000, Smart Limit 100, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice.”

## B2B2C With Approval - Signature capture (1 fields)

### FLD-699: Signature pad
`Explicit` · confidence: `high`

- **Data type:** signature capture
- **Mandatory:** Yes
- **Editable rule:** Clear Signature / Done
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Please Sign' pad; customer signs; Clear Signature / Done buttons”

## B2B2C With Approval - Step7 CAF & Additional Attachments (1 fields)

### FLD-700: Proof of Employment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** required for B2B2C flow
- **Visibility rule:** red asterisk
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “'Proof of Employment' (required, red asterisk) and 'CAF' both shown captured with green checkmarks”

## B2B2C With Approval - Step8 Activity (1 fields)

### FLD-701: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Conditional
- **Visibility rule:** guidance: 'Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Comments field with guidance... Agent enters Testing12345. Button: Save And Finish”

## B2B2C With Approval - Submission confirmation (1 fields)

### FLD-702: Submitted for approval message
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “Your activation request order number: 1-29710853118 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval.”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “A dialog reads verbatim: 'Your activation request order number: 1-29710853118 is submitted for approval...'”

## B2B2C With Approval - My Pending Approval Orders (1 fields)

### FLD-703: Approval Status
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Default value:** Submitted for Approval
- **Editable rule:** read-only (agent view)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Approval Status 'Submitted for Approval', Status 'Pending', Guided Journey 'New Postpaid'”

## B2B2C With Approval - Order Approval detail (manager) (1 fields)

### FLD-704: Approve / Reject - Correction / Reject - Drop Order / Go Back
`Explicit` · confidence: `high`

- **Data type:** button group
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “Action buttons: Approve, Reject - Correction, Reject - Drop Order, Go Back”

## B2B2C With Approval - Account record post-approval (1 fields)

### FLD-707: Special Management
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Default value:** B2B2C Consumer
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-e24116bd.md): “the 'Special Management' field is now populated/highlighted as 'B2B2C Consum[er]…'”

## B2B2C Without Approval - Step1 Company selection (1 fields)

### FLD-708: Company Name
`Explicit` · confidence: `high`

- **Data type:** dropdown (searchable)
- **Mandatory:** Yes
- **Visibility rule:** B2B2C linkage step
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Company Name' dropdown opened, listing corporate accounts (01 vfqatest01, 01 newfreedcn01_Test, VFQA_Test_Mav NCM_CORE28...)”

## B2B2C Without Approval - Step1 Contact fields (1 fields)

### FLD-709: Enter ECR Details
`Explicit` · confidence: `high`

- **Data type:** radio (Yes/No)
- **Mandatory:** No
- **Default value:** No
- **Visibility rule:** info banner: 'To be filled by Fulfillment team only.'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Enter ECR Details' = No, with an info banner: 'To be filled by Fulfillment team only.'”

## B2B2C Without Approval - Step3 Plan detail modal (1 fields)

### FLD-710: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 20
- **Visibility rule:** info banner 'Default Bill Limit should be communicated to the customer'
- **Editable rule:** editable via 'Edit Bill Limit'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Postpaid U Start Promotion' detail: Bill Limit: 20 (Edit Bill Limit button...)”

## B2B2C Without Approval - Step4 Addon & Discount (1 fields)

### FLD-711: Change U Plan Benefits
`Explicit` · confidence: `high`

- **Data type:** button
- **Mandatory:** No
- **Visibility rule:** under 'U Plan Options'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “U Plan Options: U Start 8G_150LMin (Change U Plan Benefits button)”

## B2B2C Without Approval - Step5 Number Selection (1 fields)

### FLD-712: Star Number / Free Number / Reserved Number tabs
`Explicit` · confidence: `high`

- **Data type:** tab selector
- **Mandatory:** No
- **Default value:** Free Number (active)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “'Select a Number to Reserve:' with tabs Star Number / Free Number (active) / Reserved Number”

## B2B2C Without Approval - Step7 CAF & Additional Attachments (1 fields)

### FLD-713: Proof of Employment
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** Blocks Continue until provided
- **Visibility rule:** red required-asterisk
- **Error message:** “Error: Please select Proof of Employment before continuing.”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Error banner: 'Error: Please select Proof of Employment before continuing.' — Proof of Employment is a hard-required attachment for this B2B2C flow.”

## B2B2C Without Approval - Step8 Activity (1 fields)

### FLD-714: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Conditional
- **Default value:** B2B2C TEST123
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “agent types 'B2B2C TEST123'... Final action button: 'Save and Finish'”

## B2B2C Without Approval - Order completion confirmation (1 fields)

### FLD-715: Postpaid completed successfully message
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “Postpaid completed successfully. Order Number:- '1-29726606734'”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “System modal reads verbatim: 'Postpaid completed successfully. Order Number:- '1-29726606734''”

## B2B2C Without Approval - Sales Order detail (1 fields)

### FLD-716: Approved checkbox
`Explicit` · confidence: `high`

- **Data type:** checkbox
- **Mandatory:** No
- **Default value:** unchecked
- **Editable rule:** read-only in this view
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-b2b2c-w-f4fc93f7.md): “Approved checkbox: unchecked, Approved By: blank, Hold: unchecked, Hold Reason: blank”

## HRN Credit Limit (Tablet) - Number Selection (1 fields)

### FLD-721: Reservation success alert
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “SUCCESS:Reservation Token:15557466(SBL-EXL-00151)”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Browser alert: 'SUCCESS:Reservation Token:15557466(SBL-EXL-00151)' with OK button”

## HRN Credit Limit (Tablet) - CAF preview (1 fields)

### FLD-722: Account credit limit / Smart Limit
`Explicit` · confidence: `high`

- **Data type:** display (generated)
- **Mandatory:** No
- **Default value:** Account credit limit 50, Smart Limit 65
- **Visibility rule:** Section 2 - Billing information
- **Editable rule:** read-only (generated)
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Section 2 – Billing information: Account credit limit 50; Smart Limit 65”

## HRN Credit Limit (Tablet) - Activity/comments (1 fields)

### FLD-723: Comments popup
`Explicit` · confidence: `high`

- **Data type:** textarea (modal)
- **Mandatory:** Conditional
- **Default value:** Test1234
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “A 'Comments' popup opens for free-text entry; agent types 'Test1234', clicks OK.”

## HRN Credit Limit (Tablet) - Submission confirmation (1 fields)

### FLD-724: Submitted for approval message
`Explicit` · confidence: `high`

- **Data type:** system dialog
- **Mandatory:** No
- **Error message:** “Your activation request order number: 1-29811647643 is submitted for approval. You can check the status of the order in My Sales Order or My Orders for approval.”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Final confirmation dialog: 'Your activation request order number: 1-29811647643 is submitted for approval...'”

## HRN Credit Limit (Tablet) - Approve Order modal (1 fields)

### FLD-725: Comments (manager approval)
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Conditional
- **Default value:** Approved
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-hrn-cus-5c169dbc.md): “Comments field — manager types 'Approved'”

## NON_B2B2C With Approval - B2B2C override confirm dialog (1 fields)

### FLD-728: Special Management override confirm
`Explicit` · confidence: `high`

- **Data type:** system confirm dialog
- **Mandatory:** No
- **Validation rule:** Appears when Account already carries a Special Management value
- **Editable rule:** OK / Cancel
- **Error message:** “The Account has already Special Management field value. Do you still want to continue the journey without B2B2C”
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “A native browser confirm dialog... 'The Account has already Special Management field value. Do you still want to continue the journey without B2B2C' with OK and Cancel buttons”

## NON_B2B2C With Approval - Step3 Plan detail popup (1 fields)

### FLD-729: Bill Limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** No
- **Default value:** 250
- **Visibility rule:** note: 'Default Bill Limit should be communicated to the customer'
- **Editable rule:** editable via 'Edit Bill Limit'
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “'Postpaid Legacy Red 250 Promotion' — Bill Limit: 250 ('Edit Bill Limit' button, note: 'Default Bill Limit should be communicated to the customer')”

## NON_B2B2C With Approval - Sales Order record (1 fields)

### FLD-730: Approved / Approved By
`Explicit` · confidence: `high`

- **Data type:** checkbox / text
- **Mandatory:** No
- **Default value:** unchecked / blank
- **Editable rule:** read-only in this view; set by manager approval
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “Approved checkbox unchecked, Approved By blank — i.e., the order is created but sits awaiting approval”

## NON_B2B2C With Approval - Account record (1 fields)

### FLD-731: Special Management
`Explicit` · confidence: `high`

- **Data type:** display
- **Mandatory:** No
- **Default value:** CBU Test
- **Editable rule:** read-only
- **Sources:**
  - [`guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca`](../.knowledge/docs/guided-journeys-postpaid-open-ui-tablet-new-postpaid-non-b2b-48d70eca.md): “the customer's Account page... shows Special Management: 'CBU Test'”

## Product configurator - Bill Limit selection (Vanilla Pre2Post) (1 fields)

### FLD-734: Bill Limit radio group
`Explicit` · confidence: `high`

- **Data type:** radio/enum
- **Mandatory:** Yes
- **Validation rule:** Selected value cannot be set lower than the Agent Minimum configured for that Bill Limit product in Product Administration
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “Bill Limit radio group offers None / Bill Limit Mobile Plus (selected) / Bill Limit Mobile”

## Order header (Vanilla Pre2Post, on Validate) (1 fields)

### FLD-738: Validate action informational alert
`Explicit` · confidence: `high`

- **Data type:** system alert
- **Mandatory:** Unknown
- **Error message:** “Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.”
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “On Validate, an alert reads: 'Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer.'”

## Order header / Sales Order record (Vanilla Pre2Post) (1 fields)

### FLD-739: Order Sub Type
`Explicit` · confidence: `high`

- **Technical name:** Order Sub Type
- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Pre2Post
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “same order, now shown with Order Sub Type: Pre2Post and Credit Limit 1,000”
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Order Type: Plan Change, Order Sub Type: Pre2Post, Status: Pending”

## Administration-User All Person Administration (1 fields)

### FLD-740: Responsibility
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce`](../.knowledge/docs/guided-journeys-pre-to-post-desktop-vanilla-pre-to-post-6d6b61ce.md): “operator Hemanth Kumar (User ID HEMANTH, Job Title Team Leader) is provisioned under Responsibility VFQA Sales”

## Postpaid - Contact (Open UI Desktop Pre2Post, Step 1) (1 fields)

### FLD-741: Prepaid Number
`Explicit` · confidence: `high`

- **Data type:** text/phone
- **Mandatory:** Yes
- **Default value:** +974 79025243 (pre-filled)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “Step 1 prompts 'Please enter number:' with field 'Prepaid Number' pre-filled '+974 79025243'”

## Postpaid - Plan (Open UI Desktop Pre2Post, Step 2) (1 fields)

### FLD-757: promotion search box
`Explicit` · confidence: `high`

- **Data type:** text search
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “A search box (typed: 'red') filters a 'Promotion Upgrades List Applet' grid of postpaid plan tiles”

## Signature capture modal (Open UI Desktop Pre2Post) (1 fields)

### FLD-772: signature pad
`Explicit` · confidence: `high`

- **Data type:** signature/drawing
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-2e309556.md): “'Please Sign' modal with a hand-drawn signature already captured on the signature pad; buttons 'Done' and 'Clear Signature'”

## Submission confirmation modal (Autobase Pre2Post) (1 fields)

### FLD-785: confirmation message
`Explicit` · confidence: `high`

- **Data type:** text (system message)
- **Mandatory:** Unknown
- **Error message:** “Order request is submitted successfully. Please check installed asset of the account to confirm. (HRN) Customer needs to pay advance payment of QR 100.”
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “a modal reads verbatim: 'Order request is submitted successfully...'”

## Bulk Processing / TM Bulk Batch List Applet (Autobase Pre2Post) (1 fields)

### FLD-786: Status
`Explicit` · confidence: `high`

- **Technical name:** Status
- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** In Processing
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Status 'In Processing', Attrib04 'UNICA', Attrib05 'CRM', Attrib09 'PreToPost'”

## Order detail (Autobase Pre2Post, final) (1 fields)

### FLD-787: Status Context
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Default value:** All order lines are completed
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-desktop-pre-to-post-auto-7cb45c57.md): “Status Context 'All order lines are completed'”

## Connection Details modal (Contact step, shared component — Prepaid to Postpaid & New Prepaid Tablet journeys) (1 fields)

### FLD-792: Total Number of Prepaid Connections
`Explicit` · confidence: `high`

- **Data type:** number (read-only)
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Total Number of Prepaid Connections: 1, Total Number of Postpaid Connections: 0”
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'Total Number of Prepaid Connections: 0' and 'Total Number of Postpaid Connections: 0'”

## CAF Section 1 / 2 - Applicant & Billing details (Tablet Pre2Post) (1 fields)

### FLD-802: Account credit limit
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 50 (edited from 1000)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Section 2 - Billing information: Account credit limit 50, Smart Limit 20”

## Sales Order / Account detail (Tablet Pre2Post, final & post-conversion) (1 fields)

### FLD-803: Credit Limit / Pre-approved (Expatriate/Qatari)
`Explicit` · confidence: `high`

- **Data type:** number
- **Mandatory:** Unknown
- **Default value:** 50 (updated from 1000)
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Credit Limit 50, MRC Total QR108.00”
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “'Pre-approved (Expatriate/Qatari):' field now shows 50 (highlighted, matching the value chosen in the wizard)”

## Sales Order (Tablet Pre2Post, final) (1 fields)

### FLD-804: Status
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Pending
- **Sources:**
  - [`guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740`](../.knowledge/docs/guided-journeys-pre-to-post-open-ui-tablet-pre-to-post-176db740.md): “Status: Pending ... order has been created by the wizard and is staged as Pending, awaiting Submit”

## New Prepaid Tablet - Number Selection (Step 3) (1 fields)

### FLD-819: Free Number/Reserved Number toggle
`Explicit` · confidence: `medium`

- **Data type:** toggle tabs
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “toggle tabs 'Free Number' / 'Reserved Number'”

## New Prepaid Tablet - SIM Serial (Step 4) (1 fields)

### FLD-820: SIM Serial
`Explicit` · confidence: `medium`

- **Data type:** text/barcode scan
- **Mandatory:** Yes
- **Validation rule:** Shown green-checked (validated); supports barcode-scan input via a scan icon
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “SIM Serial = 8942702400000025359, green-checked, with a barcode-scan icon”

## Prepaid CAF - Accepting Terms and Conditions (New Prepaid Tablet) (1 fields)

### FLD-824: Signature of applicant
`Explicit` · confidence: `medium`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “a blank 'Signature of applicant*' field”

## Prepaid CAF - Documents section (New Prepaid Tablet) (1 fields)

### FLD-825: Documents to be attached
`Explicit` · confidence: `medium`

- **Data type:** file upload
- **Mandatory:** Yes
- **Validation rule:** All documents should be valid and not expired at the time of purchase
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “'Documents to be attached (Mandatory): A clear copy of Qatar ID or Passport & Visa copy / GCC ID', note '*All documents should be valid and not expired at the time of purchase'”

## Sales Order Line Items tab (New Prepaid Tablet) (1 fields)

### FLD-828: Line Item Status
`Explicit` · confidence: `medium`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Pending
- **Sources:**
  - [`guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13`](../.knowledge/docs/guided-journeys-prepaid-open-ui-tablet-new-prepaid-0202dd13.md): “Line Items grid shows two rows, both Status: Pending”

## SIM Swap - Customer lookup (Global Search / Open UI Tablet entry) (1 fields)

### FLD-829: MSISDN
`Explicit` · confidence: `high`

- **Data type:** text/phone
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN and click Go (SIM Swap from Global Search)”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Enter MSISDN, ID Type & ID Number, click Go (SIM Swap Open UI Tablet Journey)”

## SIM Swap - Verify contact / document capture (Global Search & Open UI Tablet) (1 fields)

### FLD-832: QID front upload
`Explicit` · confidence: `high`

- **Data type:** file upload
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Verify contact details, upload QID front & Bank, click Continue (SIM Swap from Global Search)”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Verify contact details, add QID front & Bank, click Continue (SIM Swap Open UI Tablet Journey)”

## SIM Swap - Approval / Approve popup (Global Search & Open UI Desktop) (1 fields)

### FLD-837: Comments
`Explicit` · confidence: `high`

- **Data type:** textarea
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Add comments, click Save and Finish (SIM Swap from Global Search - Approval)”
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “On Approve, pop-up opens to add comments and Submit (SIM Swap Approval Open UI Desktop - Approve popup)”

## SIM Swap Approval Vanilla Journey - Modify Tab (1 fields)

### FLD-838: new SIM Serial number (Service ID Option)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “update new SIM Serial number on SIM Card bundle line item (Service ID Option)”

## SIM Swap Approval Open UI Desktop (1 fields)

### FLD-839: Order Number search
`Explicit` · confidence: `high`

- **Data type:** text search
- **Mandatory:** No
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Sort by Created Date or search Order Number”

## Drop Order validation (any channel) (1 fields)

### FLD-842: Drop Order action
`Explicit` · confidence: `high`

- **Data type:** button/action
- **Mandatory:** Unknown
- **Error message:** “If without Order Approval Any user try to Drop the Order the below error will appear”
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Stated system behavior: 'If without Order Approval Any user try to Drop the Order the below error will appear'”

## SIM Swap Open UI Tablet Journey - signature (1 fields)

### FLD-843: customer signature
`Explicit` · confidence: `high`

- **Data type:** signature
- **Mandatory:** Yes
- **Sources:**
  - [`guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493`](../.knowledge/docs/guided-journeys-sim-swap-sim-swap-tablet-desktop-vanilla-ord-8923a493.md): “Take customer signature, click Done tab”

## Open UI - FDO request (homepage) (1 fields)

### FLD-846: FDO request view icon
`Explicit` · confidence: `high`

- **Data type:** icon/link
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “New Open UI fields: FDO request view icon on homepage, FDO time/date slot within the order, and an FDO requests tab in account summary”

## Open UI - FDO request (order) (1 fields)

### FLD-847: FDO time/date slot
`Explicit` · confidence: `high`

- **Data type:** date/time picker
- **Mandatory:** Yes
- **Validation rule:** maximum 30 days ahead for an FDO
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO time/date slot within the order ... business rules: maximum 30 days ahead for an FDO”

## Account Summary - FDO requests tab (1 fields)

### FLD-848: FDO requests tab
`Explicit` · confidence: `high`

- **Data type:** tab/grid
- **Mandatory:** Unknown
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “an FDO requests tab in account summary”

## FDO request status (1 fields)

### FLD-849: FDO Status
`Explicit` · confidence: `high`

- **Data type:** text/enum
- **Mandatory:** Unknown
- **Default value:** Initial
- **Validation rule:** All modification/cancellation allowed only while status is Initial.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “FDO statuses: Initial, In-Progress, Order Submitted, Success, Failed, Cancelled”

## FDO Pre-to-Post Migration validation (1 fields)

### FLD-850: MSISDN eligibility check
`Explicit` · confidence: `high`

- **Data type:** system validation
- **Mandatory:** Unknown
- **Validation rule:** Blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order.
- **Sources:**
  - [`guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be`](../.knowledge/docs/guided-journeys-vanilla-views-modifications-future-dated-ord-640e50be.md): “system validation blocks FMS/MOI/collection-barred/blacklisted MSISDN, rejects passport-ID customers, disallows upfront payment (e.g., HRN fee) within the same FDO order”

## Open UI Desktop - Asset Summary tab (Recent Usage) (1 fields)

### FLD-868: Recent Usage sub-tab filter
`Explicit` · confidence: `high`

- **Data type:** tab/enum
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “All/SMS/Data/Voice/Recharge sub-tabs”

## Open UI Desktop - Asset Summary tab (usage ring panel) (1 fields)

### FLD-869: Charge QR
`Explicit` · confidence: `high`

- **Data type:** currency
- **Mandatory:** Unknown
- **Default value:** 0
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Charge QR 0, Discount QR 0, Net Amount QR 0”

## Open UI Desktop - Asset Summary tab (Next Best Offer banner) (1 fields)

### FLD-873: Next Best Offer actions
`Explicit` · confidence: `high`

- **Data type:** button group
- **Mandatory:** Unknown
- **Visibility rule:** Grayed out/inactive in observed state.
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “Next Best Offer" banner (grayed out/inactive) with Accept/Reject/Interested buttons disabled”

## Open UI Desktop - Communications modal (1 fields)

### FLD-886: Communication toolbar session limit message
`Explicit` · confidence: `high`

- **Data type:** system message
- **Mandatory:** Unknown
- **Error message:** “Communication: User has maximum Communication toolbar sessions.”
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “a system message in red: "Communication: User has maximum Communication toolbar sessions."”

## Open UI Desktop - empty activity grid (pre-fetch state) (1 fields)

### FLD-894: Opportunity
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`open-ui-desktop-agent-360-cti-view-8b495725`](../.knowledge/docs/open-ui-desktop-agent-360-cti-view-8b495725.md): “columns Activity #, Channel, Description, Due, Status, Priority, Opportunity, Comments, Transaction Date, Assign To All, Agent First Nam, Agent Last Nam, Customer Segm, Customer Type, Area, Journey”

## RFS Portal - lead capture (1 fields)

### FLD-899: MSISDN
`Explicit` · confidence: `high`

- **Technical name:** MSISDN
- **Data type:** text/number
- **Mandatory:** Yes
- **Validation rule:** no lead is created without it
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “Portal captures MSISDN and creates a Siebel lead via API — MSISDN is not a search key, and no lead is created without it”

## IMS/RFS distance field (flagged open question) (1 fields)

### FLD-900: distance to CO
`Assumed` · confidence: `high`

- **Data type:** unknown
- **Mandatory:** Unknown
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “check "distance to CO" field meaning (Samant) — flagged as open action item”

## Vodafone ID (VFID) identifier (1 fields)

### FLD-901: VFID
`Explicit` · confidence: `high`

- **Technical name:** VFID
- **Data type:** text/composite ID
- **Mandatory:** Unknown
- **Validation rule:** format zone + four-digit BID + unit
- **Sources:**
  - [`it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0`](../.knowledge/docs/it-stack-modernization-overview-of-rfsvodafone-idims-systems-026836b0.md): “newer, CEO-approved branded identifier — format "zone + four-digit BID + unit"”

## SMS Templates - Manual SMS Templates sheet (1 fields)

### FLD-921: Service Type
`Explicit` · confidence: `high`

- **Technical name:** Service Type
- **Data type:** enum
- **Mandatory:** Unknown
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “agent-triggered FrontLine templates keyed by Keyword + Service Type (Prepaid/Postpaid/etc.) + Language”

## SMS Templates - Other Automated SMS Templates sheet (1 fields)

### FLD-922: Merge field: BillCycle
`Explicit` · confidence: `high`

- **Technical name:** $BillCycle$
- **Data type:** merge field/text
- **Mandatory:** Unknown
- **Sources:**
  - [`sms-templates-0603d3eb`](../.knowledge/docs/sms-templates-0603d3eb.md): “using merge fields like `$BillCycle$`, `$proratedamount$`, `$advancerental$`, `$firstbill$`, `$sDiscountper$`/`$sDiscountQR$`”

## TT categorization LOV - VFQA_TT_HASHTAGS (1 fields)

### FLD-923: Hashtag value
`Explicit` · confidence: `high`

- **Technical name:** Language-Independent Code
- **Data type:** enum/LOV
- **Mandatory:** Unknown
- **Sources:**
  - [`tt-hashtags-and-actual-issue-8d8ccaa5`](../.knowledge/docs/tt-hashtags-and-actual-issue-8d8ccaa5.md): “454 rows (including header) of hashtag values used to tag trouble tickets”

## TT categorization LOV - VFQA_TT_ACTUAL_ISSUE (1 fields)

### FLD-924: Actual Issue value
`Explicit` · confidence: `high`

- **Technical name:** Language-Independent Code
- **Data type:** enum/LOV
- **Mandatory:** Unknown
- **Sources:**
  - [`tt-hashtags-and-actual-issue-8d8ccaa5`](../.knowledge/docs/tt-hashtags-and-actual-issue-8d8ccaa5.md): “355 rows of root-cause/actual-issue values”

## Fibre Activation BRSD - Annex_01_Data_Fields (1 fields)

### FLD-925: Installation Address fields (DF-xx)
`Inferred` · confidence: `high`

- **Technical name:** DF-xx
- **Data type:** various
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “Annex_01_Data_Fields (135 rows, DF-xx)”

## Fibre Activation BRSD - FAR_001_QPC requirements (1 fields)

### FLD-928: IPTV bundled with base plan
`Explicit` · confidence: `high`

- **Technical name:** FAR_001_QPC_02/03
- **Data type:** boolean/toggle
- **Mandatory:** No
- **Default value:** bundled by default
- **Editable rule:** removable — contested in Open Items (OI-03/OI-18)
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “iWatch/RIO bundle validation (IPTV bundled by default with base plan, removable — flagged in Open Items as contested with VFQ business preference)”

## Fibre Activation BRSD - FIB_MIG_RTL_003 requirements (1 fields)

### FLD-931: Migration eligibility flag
`Explicit` · confidence: `high`

- **Technical name:** FIB_MIG_RTL_003_01
- **Data type:** boolean
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-fibre-brsd-v1-2-068eebe3`](../.knowledge/docs/vfq-fibre-brsd-v1-2-068eebe3.md): “`FIB_MIG_RTL_003_01`..`07` (migration eligibility, verification, service availability, existing-service retrieval, order capture, WFM appointment, telesales collection flags)”

## Mobile Postpaid Activation BRSD - identity capture (1 fields)

### FLD-934: Identity type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Yes
- **Default value:** QID/Passport/GCC/Diplomatic ID
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “identity types QID/Passport/GCC/Diplomatic ID”

## Mobile Postpaid Activation BRSD - number selection (1 fields)

### FLD-935: Number type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Yes
- **Default value:** Reserved/Star/Free
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “number types Reserved/Star/Free”

## Mobile Postpaid Activation BRSD - SIM selection (1 fields)

### FLD-936: SIM type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Yes
- **Default value:** Physical/Printed eSIM/Virtual eSIM
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “SIM types Physical/Printed eSIM/Virtual eSIM”

## Mobile Postpaid Activation BRSD - contract capture (1 fields)

### FLD-937: CAF type
`Explicit` · confidence: `high`

- **Data type:** enum
- **Mandatory:** Yes
- **Default value:** digital CAF / offline-signed paper CAF
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “contract via digital CAF or offline-signed paper CAF for back office”

## Mobile Postpaid Activation BRSD - payment capture (1 fields)

### FLD-938: Payment via WinCash (deposit, HRN advance, premium number charge)
`Explicit` · confidence: `high`

- **Data type:** currency/composite
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d`](../.knowledge/docs/vfq-mobile-postpaid-activation-brsd-v2-0-b8b7164d.md): “payment upfront via WinCash covering deposit, HRN advance, premium number charge”

## DXP Agent Portal wireframe - Step 1 Customer Details (1 fields)

### FLD-939: Customer Details fields
`Inferred` · confidence: `high`

- **Data type:** form section
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “Home → Step 1 Customer Details → Step 2 ID Verification (IDWise) → Step 3 Eligibility Check ... (Actual wireframe imagery not extracted — only slide titles/labels captured as text)”

## J011 Mobile Post-Paid Customer Onboarding - process flow (number type branch) (1 fields)

### FLD-944: Number type branch
`Explicit` · confidence: `medium`

- **Data type:** radio/enum/dropdown
- **Mandatory:** Yes
- **Default value:** Normal vs Star Number
- **Visibility rule:** Branches to Normal Number vs Star Number
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “number type branch (Normal vs Star Number)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “number type branch (Normal vs Star Number); field label "Number Type", data_type dropdown/enum, visibility_rule branches to Normal Number vs Star Number”

## J011 Mobile Post-Paid Customer Onboarding - process flow (add-on branch) (1 fields)

### FLD-945: Add-on type branch
`Explicit` · confidence: `medium`

- **Data type:** radio/enum/dropdown
- **Mandatory:** Unknown
- **Default value:** Non-Telco vs Telco
- **Visibility rule:** Branches to Non-Telco Add-On vs Telco Add-On
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “add-on branch (Non-Telco vs Telco)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “add-on branch (Non-Telco vs Telco Add-On); field label "Add-on Type", data_type dropdown/enum, visibility_rule branches to Non-Telco Add-On vs Telco Add-On”

## J011 Mobile Post-Paid Customer Onboarding - process flow (payment branch) (1 fields)

### FLD-946: Payment type branch
`Explicit` · confidence: `medium`

- **Data type:** radio/enum/dropdown
- **Mandatory:** Yes
- **Default value:** Full Payment vs DOI
- **Visibility rule:** Branches to Full Payment vs DOI
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “payment branch (Full Payment vs DOI — Device on Installment)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment branch (Full Payment vs DOI); field label "Payment Type", data_type dropdown/enum, visibility_rule branches to Full Payment vs DOI”

## J011 Mobile Post-Paid Customer Onboarding - process flow (ID branch) (1 fields)

### FLD-947: ID type branch
`Explicit` · confidence: `medium`

- **Data type:** radio/enum/dropdown
- **Mandatory:** Yes
- **Default value:** QID vs Other ID/Passport
- **Visibility rule:** Determines branch to QID -> MOI Validation vs Other ID/Passport -> capture/validate details
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “ID type branching (QID → MOI Validation; Other ID / Passport → capture customer details, validate address)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “ID type branching (QID -> MOI Validation; Other ID/Passport -> capture/validate details); field label "ID Type", data_type dropdown/enum”

## DXP Agent Portal wireframe - J011 process flow (plan display) (1 fields)

### FLD-948: Plan display logic
`Explicit` · confidence: `high`

- **Data type:** conditional logic
- **Mandatory:** Unknown
- **Visibility rule:** if QID Postpaid and Prepaid otherwise Prepaid Type
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “plan display logic ("if QID Postpaid and Prepaid otherwise Prepaid Type")”

## J011 Mobile Post-Paid Customer Onboarding - process flow (SIM handover) (1 fields)

### FLD-949: SIM handover option
`Explicit` · confidence: `medium`

- **Data type:** enum/dropdown
- **Mandatory:** Yes
- **Default value:** eSIM / Physical SIM - Handover now / Physical SIM - Deliver
- **Visibility rule:** eSIM vs Physical SIM handover/deliver
- **Sources:**
  - [`vfq-stack-modernization-br-25jun-03c2aa09`](../.knowledge/docs/vfq-stack-modernization-br-25jun-03c2aa09.md): “SIM handover options (eSIM, Physical SIM - Handover now, Physical SIM - Deliver)”
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “SIM handover options (eSIM, Physical SIM handover/deliver); field label "SIM Handover Option", data_type dropdown/enum”

## J011 Mobile Post-Paid Customer Onboarding - Payment (1 fields)

### FLD-955: Receipt
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vfq-stack-modernization-br-28jun-75f28727`](../.knowledge/docs/vfq-stack-modernization-br-28jun-75f28727.md): “payment capture via WinCash with receipt”

## J023 Mobile Service Suspension / J024 Mobile Service Resume - Agent Search (1 fields)

### FLD-958: MSISDN/Account
`Explicit` · confidence: `medium`

- **Data type:** text
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “identify subscriber -> search (MSISDN/Account)”

## J023 Mobile Service Suspension (1 fields)

### FLD-959: Plan (Park Plan)
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Editable rule:** Agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X")
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current plan to "Park Plan" with minimum services (fetched from "Launch X")”

## J024 Mobile Service Resume (1 fields)

### FLD-960: Plan (Base Plan)
`Explicit` · confidence: `medium`

- **Data type:** dropdown/enum
- **Mandatory:** Yes
- **Editable rule:** agent changes current Park Plan back to Base Plan (fetched from "Launch X")
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “agent changes current Park Plan back to Base Plan (fetched from "Launch X")”

## J023 Mobile Service Suspension - Payment (1 fields)

### FLD-961: Suspension Payment
`Explicit` · confidence: `medium`

- **Data type:** number
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment for suspension, collected in WinCash”

## J024 Mobile Service Resume - Payment (1 fields)

### FLD-962: Resume Payment
`Explicit` · confidence: `medium`

- **Data type:** number
- **Mandatory:** Yes
- **Sources:**
  - [`vfq-stack-modernization-br-29jun-updatev1-0-af309fe2`](../.knowledge/docs/vfq-stack-modernization-br-29jun-updatev1-0-af309fe2.md): “capture payment of resume service via WinCash”

## Trouble Ticket - Open UI Tickets Fields (1 fields)

### FLD-963: Ticket Template Fields (per issue type)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “each ticket/issue type has a specific template that agents fill in and paste into "Open UI Tickets Fields"”

## MVA Customer Request (1 fields)

### FLD-969: Customer Request (from MVA)
`Explicit` · confidence: `high`

- **Data type:** text
- **Mandatory:** Unknown
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “Currently the customer can create requests from MVA which is being sent as report to a Team to contact customer and raise tickets in System.”

## MNP Port Out Ticket (1 fields)

### FLD-970: Activity Status
`Explicit` · confidence: `high`

- **Data type:** dropdown/enum
- **Mandatory:** Unknown
- **Validation rule:** activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status)
- **Sources:**
  - [`vodafone-process-overview-290626-ec-1ed338b9`](../.knowledge/docs/vodafone-process-overview-290626-ec-1ed338b9.md): “activities inside the ticket are validated automatically or by the MNP Team (Success/Failed status); once all activities complete, ticket status changes automatically”

## CAF Dropdown (Digital/Manual/Touch Screen) (1 fields)

### FLD-971: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** This is Step 8 of the guided wizard (breadcrumb 'FWA Postpaid - CAF'), immediately following Step 7 Book Appointment and preceding Step 9 Activity. The dropdown offers three modes and selecting CAF-Digital opens the CAF Modal (SCR-084) with the full bilingual form. | Directly evidenced in the FWA Open UI Desktop Indoor guided journey (Step 8, item 10 of Key content), which documents this exact control (CAF dropdown/split-button) as a distinct interactive element within the CAF step screen, with its three selectable values enumerated.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step 8. CAF (images 17–21): Attachments initially "No Records". CAF type dropdown: CAF-Digital, CAF-Manual, CAF-Touch Screen. Digital CAF opens bilingual (EN/AR) "Vodafone Customer Application Form"... || Step 8 - CAF ... a CAF dropdown button offering three form types: CAF-Digital, CAF-Manual, CAF-Touch Screen.”

## New FWA Tile / Home Screen (1 fields)

### FLD-972: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Home screen is Step 0 / entry point, shown with logged-in user context and date, from which the agent launches the New FWA guided journey by clicking a tile.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Home screen (image 1): Logged in as KARTHIKK KARTHIKK, "Today is Tuesday, September 16, 2025." Agent clicks the New FWA tile.”

## CAF Modal (FWA) (1 fields)

### FLD-973: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field-level breakdown of the CAF Modal is present: 4 sections (Applicant details, Billing information, For Postpaid Customers, Superfast Broadband & Home Phone) with specific field names/values, a digital signature capture (name + timestamp), and a T&C acknowledgment plus a customer-notification confirm dialog.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Section 1 - Applicant details confirms Name ABUBAKAR NAZIR, DOB 1-Jan-1991, Qatar ID 29158603076 (expiry 18-Sep-2026)... Section 2 - Billing information: Account credit limit 1000, Bill date cycle 1, Bill format Detail, Bill language English, Bill delivery mode Email, Payment method Invoice. Section 3 - For Postpaid Customers: Mobile number 97441202325, digitally signed "KARTHIKK 18:09:2025 12:21:01". Section 4 - Superfast Broadband & Home Phone: Landline Number..., Plan Name..., Appointment Details...”

## Line Items > Appointments Sub-tab (1 fields)

### FLD-974: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full grid contents documented: 10 line items with product hierarchy (top-level plan, FMS CPE Bundle with 2 child SKUs, FMS Service Bundle with 4 child SKUs), per-line status-context milestones, shared address/notification fields, and a specific toolbar action set.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Line Items > Appointments sub-tab (images 27–28): 10 line items (1-10 of 10) each showing status-context milestones ("FULFILL BILLING COMPLETE: reached", "INITIATE BILLING COMPLETE: reached", "INITIATE WFM START: reached"): GigaHome Premium OD New 5G FWA Pro... (top-level), FMS CPE Bundle → FMS CPE ODU, FMS CPE Outdoor IDU; FMS Service Bundle → ... Toolbar includes Auto-Asset, MultiAdd, CAF, Profile, Book Appointment, Book Unscheduled Appointment.”

## Resource Inventory Import / Field Service Import Add-in (1 fields)

### FLD-975: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Screen fields and outcome are documented: instance/user/resource identity fields, a two-stage flow (Get Quantity then Import) with an intermediate confirmation dialog, and a result summary with created/updated/deleted/failed counts. | The screen's field list and purpose are explicitly detailed in the same document: it is a 'Resource Inventory Import' panel within a 'Field Service Import' pop-up, with named fields (Instance Name, User Name, Password, Resource Id) and an Import Status sub-section with fields Get Quantity, Import Status, Created, Updated, Deleted, Item failed, plus two action buttons (Get Quantity, Import). This is sufficient concrete field-level detail for the screen.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Field Service Import add-in / "Resource Inventory Import" (images 30–31): Instance Name vfq2.test, User Name vfq_application_profile, Resource Id ABATS. Dialog "Quantity has been fetched, please proceed with Import." Final result: Get Quantity: Success, Import Status: Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0. || A 'Field Service Import' pop-up 'Resource Inventory Import' panel shows Instance Name vfq2.test, User Name vfq_application_profile, Password (masked), Resource Id ABATS. Import Status: Get Quantity Success, Import Status Success, Created: 3, Updated: 0, Deleted: 0, Item failed: 0. Buttons: Get Quantity, Import.”

## Move Dialog (Technician Reassignment) (1 fields)

### FLD-976: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Dialog fields documented: activity identifier header, a resource-candidate list with schedule Gantt visualization and specific mismatch-flag semantics (work zones mismatch vs work skills mismatch) per candidate, and a selection + Move action. | Full screen detail already present in the source: dialog titled 'Move 2PM - 5PM - Installation - 120812 - 1-29722927101', with a Resources tab, technician search returning name/team/offset, a 'Work zones mismatch' validation flag, a schedule timeline visualization with conflict highlighting, and Dismiss/Move actions.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Move dialog (image 34): "Move 8AM - 11AM - Installation - 120955 - 1-29728035948", Thursday, September 18th, 2025. Resource candidates shown with schedule Gantt and match flags: Manoj Padinjarakandi (Work zones mismatch), Syed Irfan (ABATS, Work zones mismatch), Hamed Habeeb (ABATS, Work skills mismatch)... Agent selects Syed Irfan and clicks Move. || "'Move' dialog... Resources tab, search 'Syed' returns technician 'Syed Irfan', team ABATS, offset '+2:00', flagged 'Work zones mismatch' (in red). Schedule timeline for Sunday, September 7th, 2025 shown with a red conflict block near 2:56 PM. Dismiss / Move buttons."”

## Inventory Management — Non-Serialized Inventory Transfer (1 fields)

### FLD-977: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Screen behavior documented in detail: source/destination resource header, per-item one-at-a-time transfer pattern with item identifiers (serial+model), a Transfer List summary table (Total Items, Current Owner, Transfer To columns), and a Start Transfer action leading to an OFSC plugin confirmation. | Field/tab-level detail already present: two tabs ('Non-Serialized Inventory Transfer' and 'Transfer List'), a 'Transfering From' source field, part search/add mechanism, Total Items count, Current Owner and Transfer To fields, plus Export and Start Transfer action buttons.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Inventory Management — Non-Serialized Inventory Transfer (images 35–38): "Transfering From: ABATS" to resource Syed Irfan, three parts transferred one at a time (qty 1 each)... Transfer List shows Total Items: 3, all Current Owner ABATS → Transfer To Syed Irfan. "Start Transfer" clicked. || "'Inventory Management' > 'Non-Serialized Inventory Transfer' tab, 'Transfering From: ABATS'. Three items searched and added... The 'Transfer List' tab shows Total Items: 2... Current Owner ABATS, Transfer To 'Syed Irfan'... Export - Inventory Transfer Report and Start Transfer buttons available."”

## OFS My Route (Technician) (1 fields)

### FLD-978: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Screen documented with logged-in technician identity, job card content, route progress indicator, action tiles, and a route-activation confirmation flow that changes the route status button. | Field/element detail already present: route progress ring with percentage and pending/completed counts, a next-job card showing time slot, activity type, order number, customer phone, and a Start button, plus tile navigation (Activities count, Inventory, Add Activity).
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “My Route (images 40–42): Logged in as Syed Irfan, Thursday 18 September 2025. Job card: "8AM - 11AM Installation 120955 1-29728035948", phone 97412341234. Route progress 17%, 1 Pending. Tiles: Activities 93, Inventory, Add Activity. "Activate route" prompt: "Activate route now?" → Submit. Route status button changes to "Start". || "OFS mobile/web app, technician Syed Irfan, 'My Route' for Sunday 07 September 2025. Route progress ring 17% (1 Pending, 1 Completed). Next job card: '2PM - 5PM Installation 120812 1-29722927101', phone 97412341234, with a Start button. Tiles: Activities (93), Inventory, Add Activity."”

## Installed Assets Grid (Account 360, FWA) (1 fields)

### FLD-979: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Grid contents fully enumerated (9 rows post-provisioning, all Active) with product names and order-line references, plus surrounding account header fields (notification contact/language, account status, credit risk, account team, primary MSISDN, pre-approved limit) that establish this is the Account 360 context. Row count changes 8→9 confirming the grid supports incremental Active-asset addition as line items complete. | The document gives a full grid description: 'Installed Assets' grid (1-3 of 3) with named rows (FMS CPE Bundle, GigaHome 5G Classic New Indoor FWA Promotion, FMS Service Bundle) each with Service ID/Billing Profile/Status columns, and an explicit toolbar button list of seven actions.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Account > Installed Assets (images 58–59): "Products and Services" grid, 8→9 rows, all Active: FMS CPE Bundle (1-29727986024), GigaHome Premium OD New 5G FWA Promot... (1-29727986128), FMS Service Bundle (1-29727986192, Postpaid Activation Date 9/18/2025 12:18:16 PM), System Bar Admin -FWA, FMS SIM..., GigaHome Premium OD New 5G -FWA (Per Month), 100% Discount for 2 Months -FWA, FMS VoIP Service, Activation Bar- Mobile Roaming -FWA. || The "Installed Assets" grid (1-3 of 3) lists: FMS CPE Bundle (Service ID 129720765944, Billing Profile 1-DNIZ5EH, GigaHome 5G..., Active)... Toolbar buttons above the grid: Modify, Disconnect, GetPINPUK, End Data Session, Initiate TON, Go to CTI Portal, Send OTP.”

## Agent Home / App Launcher (1 fields)

### FLD-980: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field/tile inventory recovered for the Agent Home screen: greeting header plus a named app-icon grid enumerating every tile available to this agent's role, confirming this is a role-gated launcher (ties to ENT-044's Responsibility model) rather than an undifferentiated menu.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Agent home page ("Welcome back Hemanth Kumar! Today is Monday, April 21, 2025.") — the MNP tile is highlighted/hovered in the app-icon grid alongside Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Activities, Action Required, Training, New Fixed Line, New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval, SIM Swap, FDO Requests.”

## MNP Guided Process - Choose process (1 fields)

### FLD-981: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Screen confirmed as a single-choice launcher panel with exactly one visible button in this document's flow, entered directly from the Agent Home MNP tile.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Clicking MNP opens the "Guided Process" screen with a "Choose process" panel containing a single button: Switch as Postpaid.”

## MNP wizard step: Contact (1 fields)

### FLD-982: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field list with mandatory flags recovered for the Contact step: Qatari ID (input+validation), then read-only confirmed fields (Id expiry, Nationality, Gender, First/Last name, Birth date, Digital Lead/Sale radio), a Connection Details modal (Prepaid/Postpaid connection counts), then Email/Preferred Language/Alt phone (all marked required with green-check validation), plus an Attachments panel with upload/delete. | The summary (screenshots 5-9, direct visual read) already contains the complete field-level structure for the MNP wizard Contact step: ID Type/ID Number entry with barcode-scan icon, MOI Validation completed banner, and the full confirmed/pre-filled field set (ID Type, ID Number, ID Expiry, Nationality, Gender, First name, Last name, Birth date, Email, Language, Alt. phone #, ID-Front/ID-Back thumbnails), each shown validated with a green check, plus the Continue action.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “After Go, the section expands to "Please confirm the contact details below:" showing read-only fields: Qatari ID 29035654458, Id expiry 4/21/2026, Nationality Indian, Gender M, First name Vishakan, Last name Soundararajan, Birth date 3/7/1990, Digital Lead/Sale = No (radio)... Email nobill@vfq.com (required, green check), Preferred Language English (required, green check), Alt. phone # 97412341234 (required, green check) || Confirmed/pre-filled fields (each with a green check): ID Type Qatari ID, ID Number 27381804401, ID Expiry 9/22/2021, Nationality Egyptian, Gender M, First name KOURASHY, Last name ABDELGHANY, Birth date 1/6/1983, Email nobill@vod.com, Language English, Alt. phone # 97411111111, plus ID-Front and ID-Back thumbnail captures (both green-checked).”

## MNP wizard step: Address (1 fields)

### FLD-983: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field list recovered: four address fields plus explicit action buttons showing this step is skippable, distinguishing it from mandatory steps like Contact/Billing.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “2. Address expanded: empty fields Zone, Street No., Building No., Apt/Flat/Unit, with buttons Save Address / Skip Address / Cancel / Go Back. ... Zone 13, Street No. 45, Building No. 345, Apt/Flat/Unit H7882.”

## MNP wizard step: Billing (1 fields)

### FLD-984: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Grid column structure recovered for the Billing step: Status, Language, Payment Type, Billing Profile status, Payment Method, Bill Media, Name(account ID), plus Continue/Cancel/Go Back actions - this is a selection grid over an existing billing account, not a data-entry form.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “3. Billing: Postpaid expanded: a billing-account grid row — Status (green bar), Language ENG, Payment Type Postpaid, Billing Profile St. Active, Payment Method (cut off), Bill Media Email, Name 1-D87EQYB. Continue / Cancel / Go Back buttons.”

## MNP wizard step: Plan (plan selection grid) (1 fields)

### FLD-985: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full interaction detail recovered for the Plan step including the plan-detail modal fields (Smart Limit, Edit Smart Limit control, Credit Limit, included-features list, Customise button) and the live validation rule enforced on the Smart Limit input, tying this screen concretely to REQ around Agent Min Value guardrail.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Clicking 'Add' on Postpaid U Start Promotion opens a detail modal: 'Smart Limit: 20', an 'Edit Smart Limit' button... Agent types 28 into the Smart Limit input and clicks Go → validation message appears: 'Bill Limit can not be set lower than Agent Minimum 50' (red banner)... Agent retries with 67... Modal now shows 'Smart Limit: 67' (accepted)”

## MNP wizard step: Donor Attachment (1 fields)

### FLD-986: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Recovered exact button set and empty-state grid label, plus the downstream MNP Form dropdown (MNP-Digital / MNP-Touch Screen) invoked from this step, and the resulting attachment grid state after form completion (2 files).
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “7. Donor Attachment expanded: empty Attachments grid ('No Records'), New File button, and action buttons Continue / MNP Form / Abandon Order / Go Back. 23. Clicking 'MNP Form' opens a dropdown with two options: MNP-Digital and MNP-Touch Screen... 28. Back in 7. Donor Attachment, the Attachments grid now shows '1 - 2 of 2' with two uploaded files: 'Letter for Extension of Contra...' and 'Digital_MNP_Form_4212025...'”

## MNP wizard step: CAF (1 fields)

### FLD-987: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Recovered exact button set, empty-state grid label, and the CAF dropdown's three form-type options invoked from this step (already covered under REQ-174), plus precondition that prior two steps show 'Saved!' status.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “8. CAF expanded (Donor Details and Donor Attachment both show 'Saved!'): empty Attachments grid ('No Records'), New File button, and action buttons Continue / CAF / Abandon Order / Go Back. 30. Clicking 'CAF' opens a dropdown with three options: CAF-Digital, CAF-Manual, CAF-Touch Screen.”

## Vodafone Customer Application Form (CAF, MNP variant) (1 fields)

### FLD-988: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field-level detail recovered across both sections of the CAF form: Section 1 Applicant details (10 fields), Section 2 Billing information (7 fields including Smart Limit confirmation), Section 3 Postpaid-specific fields (mobile numbers, plan, extras, proration note, USSD reference), Section 4 Broadband/Home Phone (blank/not-applicable for this mobile-only order) - plus Sign Contract/Close and Retry actions.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Section 1 – Applicant details: Customer type Consumer, Name Vishakan Soundararajan, DOB 7-Mar-1990, Qatari ID 29035654458... Section 2 – Billing information: Account credit limit 1000, Smart Limit 67... Section 3 – For Postpaid Customers: Mobile number 97466000666..., Postpaid Plan = U Start, Extras row = Bill Limit Mobile... Section 4 – Superfast Broadband & Home Phone is present but entirely blank (not applicable to this mobile-only order).”

## Siebel Sales Order screen (MNP) (1 fields)

### FLD-989: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field list and toolbar actions recovered for the Siebel Sales Order screen header, plus a full Line Items grid breakdown (bundle + sub-line items with prices) and a Line Item Attributes grid for the Bill Limit Mobile line showing SL Default Value/SL Limit Amount/SL Min Value fields with Action and Data Type columns.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “the resulting Siebel Sales Order (Order # 1-28920871362), Account 'Vishakan Sounda[rarajan]', Order Type Activation, Order Sub Type Port-In, Status Pending... Toolbar shows Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order. A second view of the same order's Line Items grid shows the full bundle breakdown: 1 Postpaid U Start Promotion; 2 Mobile Service Bundle (expanded) containing 2.1 U Start (QR105.00)... the Line Item Attributes grid for the Bill Limit Mobile line shows: SL Default Value = 20, SL Limit Amount = 67..., SL Min Value = 0.01”

## Cross Sales Offers step (Postpaid) (1 fields)

### FLD-991: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field/grid detail for the Cross Sales Offers screen: an offers grid with named columns (OfferType, OfferName, MonthlyRental, OfferDescription, CampaignCode, PriorityCode, ServiceIdentifier, Status, TreatmentCode, Channel, PromotionId, Price), two concrete populated offer rows, four action buttons, and a second sub-grid 'Cross Sales Offers Specification' with Parent Product/Product Type/ProductId columns.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step "2. Offers" expands to a "Cross Sales Offers" grid with Accept / Interested / Reject / Close action buttons and two system-generated offers: OfferType "New MNP", OfferName "MNP New Pos...", MonthlyRental 145... Below, "Cross Sales Offers Specification" grid: Parent Product 1-5X4X4J3 / Product Type PlanDiscountId / ProductId 1-BIJLKMP...”

## Postpaid Contact step (wizard) (1 fields)

### FLD-992: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Explicit field-level diff against the Cross Sales contact form is given: base contact fields (Qatari ID, Id expiry, Nationality, Gender, First/Last name, Birth date, Email, Preferred Language, Alt phone) plus the Postpaid-specific additional fields.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “This Postpaid Contact form has additional fields not present on the Cross Sales contact form: ID type "Qatari ID", Job title, "Digital Lead/Sale" Yes/No radio (No selected), "No Email" checkbox, Language dropdown, Alt. phone # with its own checkbox.”

## Address step (Postpaid wizard) (1 fields)

### FLD-993: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Complete field list and action buttons already present in the source: four empty input fields and four control buttons, plus the surrounding full step list of the wizard confirming step ordering.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step "2. Address" expanded with empty fields: Zone, Street No., Building No., Apt/Flat/Unit; buttons Save Address / Skip Address / Cancel / Go Back. Full step list revealed for this journey: 2. Address, 3. Account, 4. Billing, 5. Number Selection, 6. SIM Serial, 7. Plan, 8. Payment, 9. CAF (steps 10. Activity appears later).”

## Payment step (wizard) (1 fields)

### FLD-994: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Field-level detail recovered: the alert banner text, a 'Number' panel with List Price/Sold Price/Type/Reason fields, an 'Upfront & Deposit' grid with named columns, the Generate CAF button, and the intermediate 'Validating Order' status state.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step "8. Payment" expanded: alert banner "Take Payment in Wincash." "Number" panel: List Price 0, Sold Price 0, Type FREE, Reason dropdown set to "For Testing Only". "Upfront & Deposit" grid empty (Payment / Amount / Wincash Reference columns). "Generate CAF" button. ... Same Payment screen with a "Validating Order, please wait..." status line appearing under Generate CAF.”

## CAF/Attachments step (Postpaid wizard) (1 fields)

### FLD-995: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Same evidence as REQ-215: attachments section fields/controls and the surrounding step buttons are fully described.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step "9. CAF" expanded showing an "Attachments" section: "New File" upload control, one file already attached — "PPVT TESTING SAMPLE.pdf" (with delete icon), grid count "1 - 10 of 19+". Buttons: Continue, CAF, Cancel, Go Back.”

## Activity step (call disposition, Postpaid wizard) (1 fields)

### FLD-996: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Complete field list for the call-disposition form (9 named fields plus Comments) and the finalize button, plus the resulting confirmation message/number, is present.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Final step "10. Activity" expanded — call-disposition form: Channel "Store walk-in", MSISDN 97470345802, Type "Sales", Topic "Automated Guided Journ...", Sub Topic "Retail - Open UI", Area "Provisioning - New Postp...", Resolution Code "Completed", Status "Solved", Language "English", empty Comments box... Button: "Save and Finish".”

## Sales Order detail (back-office, Postpaid) (1 fields)

### FLD-997: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full header field set and a 12-line-item breakdown with names, statuses and prices are given for the Sales Order detail screen.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Sales Order 1-225217281463: Type Sales Order, Order Type Activation, Status Complete, Total QR25.00, Account HEMANTH GOV..., Primary MSISDN 97430826070, Billing Profile 1-2DO7AXP9 (Postpaid), Bill Cycle 15, MRC Total QR230.00, NRC Total QR25.00, Credit Limit 1,000, Postpaid Count "Y||2", Source UNICA, SubChannel CRM, Service Type Mobile, Created By BHARGAVISM. Line Items grid (12 lines)...”

## Assets / Complex Assets view (1 fields)

### FLD-998: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Field-level detail for the Complex Assets / Campaign History view is present: header fields plus three named sub-tabs (Contact History, Response History, Provision History) each with their own grid columns and populated/empty states.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Assets module, Complex Assets view for Service ID 97430355458 (Mobile Service Bundle, Status Active, Service Account HEMANTH GOVARDHANAN, Price QR0.00, Effective From 5/7/2026, Effective To 5/12/2026). Campaign History tab active... "Contact History" grid: one SMS campaign record... "Response History": No Records. "Provision History": one row, Status "Success", Created 05/12/2026 03:17:10 PM”

## TM SR Queue View — Order Activities Queue (1 fields)

### FLD-999: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The existing summary (already the richest available extraction for this screenshot-driven document, per its own extraction notes citing all 68 images reviewed) already contains a concrete field list for this screen: named approval queues, and an Activities grid with named columns (Journey Name, Mobile #, Activity#, Order#, Service Account, Activity Status, Order Approval Status, Order Created Date, Owner) plus an 'Assign To Me' action button - this satisfies the field-list-level detail the gap flagged as missing. | Full screen structure recovered with named queues, tab structure, action button, and the resulting state transition after action is taken (Ready To Assign -> Assigned, with a ReAssign To Queue escape hatch) — going beyond the original evidence quote to show this is a genuine multi-tab work-queue screen, not just a list. | Confirms the same TM SR Queue View screen appears identically in the Fixed Line journey (cross-journey reuse of this manager screen), with the same queue names and Assign To Me action, plus the resulting My Activities state.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “TM SR Queue View — Queue Employee list (queues: ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS) and Order Activities Queue / Activities grid: shows the order among several pending approvals — Journey Name "New FWA Tablet", Mobile # 97441202301, Activity# 1-DNN25R4, Order# 1-29727615763, Service Account MAN KAMI, Activity Status "Ready To Assign", Order Approval Status "Submitted for Approval", Order Created Date 9/17/2025 02:14:24 PM, Owner VFQA_DSA_ORDER_APPROVAL_QUEUE_TESTING. Button: Assign To Me. || TM SR Queue View (Order Approval landing page): lists approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ, _JAGUAR, _TESTING, _VISTAS). Below, an Activities grid with tabs Order Activities Queue / My Activities / Activities History and an "Assign To Me" button... Manager clicks Assign To Me; the activity moves to the My Activities tab with Owner = MANAGETEST, Activity Status = "Assigned," and a "ReAssign To Queue" button becomes available || TM SR Queue View — Order Activities Queue (image 32): Lists multiple approval queues (ADJ_APPR_QUEUE_BUSI_1000, VFQA_DSA_ORDER_APPROVAL_QUEUE_DSQ/JAGUAR/TESTING/VISTAS). Order 1-29795149137 ... appears with Activity Status "Ready To Assign", Order Approval Status "Submitted for Approval". Manager clicks "Assign To Me".”

## Reject Order modal (1 fields)

### FLD-1000: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Field-level detail for the Reject Order modal is present: a Reason dropdown/tag list with at least 7 enumerated options ('ID image not clear', 'ID type or ID number mismatch', 'Customer Signature doesn't match with ID', 'Incorrect add on or discount', 'Device receipt missing', 'Missing Speed test result/ Building information', 'Bill explainer missing/ Incorrect' - list continues, cut off), a free-text Comments box, and two buttons: Reject Order / Cancel. The doc also confirms this reason list is a shared reference list reused across other 'with Approval' guided journeys (cross-referenced against the FWA sibling doc, which shows the same 'ID image not clear' rejection reason appearing in its Activities History). Additionally, the backend consequence is evidenced: an OSB CreateCommunication SMS payload is triggered on rejection, addressed to the agent (not customer), instructing them to correct the order.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Reason selected: "ID image not clear". Other available reasons visible in the dropdown: "ID type or ID number mismatch", "Customer Signature doesn't match with ID", "Incorrect add on or discount", "Device receipt missing", "Missing Speed test result/ Building information", "Bill explainer missing/ Incorrect" (list continues, cut off). A free-text Comments box is filled with "Phoenix Sprint 66 test"... Buttons: Reject Order / Cancel.”

## Tickets Dashboard (1 fields)

### FLD-1001: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Slide 35's embedded screenshot (image93.png), invisible to text extraction, shows the full Tickets Dashboard screen: top navigation icon bar (Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers), a Default/Custom view toggle, a row of quick-filter tabs (Assigned to me [active/highlighted], Escalated by Me, Escalated to Me, My Rejected TT, My Returned TT, Raised by Me - Open, Raised by Me - Unsubmitted), grid toolbar icons (search, export/download, settings/gear, record count '1-10 of 10+', expand), and a paginated results grid with column headers: Request Count, Target Date, NP Order Id, Ticket Id, Status, Sub-Status, Owner, Source, TT Category, Area, Sub-Area, Queue Name, Escalation Time, Escalate Reason(s), Escalated By, Created Date, Created By -- populated with real sample rows (e.g. Ticket Id 1-110909338319, Status 'In Progress', Sub-Status 'Assigned', Owner ANUJYADAV, Source Customer, TT Category Complaints, Area 'Voice Calls', Sub-Area 'Voice - Local').
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Column headers read directly off image93.png: 'Request Count | Target Date | NP Order Id | Ticket Id | Status | Sub-Status | Owner | Source | TT Category | Area | Sub-Area | Queue Name | Escalation Time | Escalate Reason | Escalated By | Created Date | Created By'; quick-filter tabs: 'Assigned to me' (boxed/active), 'Escalated by Me', 'Escalated to Me', 'My Rejected TT', 'My Returned TT', 'Raised by Me - Open', 'Raised by Me - Unsubmitted'.”

## Ticket Status on VF App (1 fields)

### FLD-1002: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Slide 34's embedded screenshots (image90.png, image91.png, image92.png), invisible to text extraction, show the actual customer-facing VF App ticket-status screens: an 'Assistance' menu screen (My Complaints, Maps Directory, Settings, Live Chat, Tutorial, Log out, with bottom nav Add-ons/123 Offers/Home/Messages/Account) leading into a 'My Complaints' list screen with tabs All / Open / Closed, and an expandable complaint card showing fields: Created on [date], Category, Sub-category, Description, Status (e.g. 'Waiting to be processed' in orange for Open, 'Resolved' in green for Closed), Complaint Number, Last updated on, Agent message (free text, populated only on Closed/Resolved cards, e.g. 'We have concluded the review of your Ticket 1-122212936766. Your issue has been investigated and fixed with a Balance Adjustment of (QR35)...'), and a Show more/Show less toggle.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Open-tab card (image91.png): 'Created on: 18 Jun 2020 / Category: Billing / Sub-category: MISSING CREDITS / Description: The Incident for the party / Status: Waiting to be processed / Complaint Number: 1-122212936766 / Last updated on: 21 Jun 2020 / Agent message [blank] / Show less'. Closed-tab card (image92.png), same Complaint Number, 'Status: Resolved' (green) and 'Agent message: We have concluded the review of your Ticket 1-122212936766. Your issue has been investigated and fixed with a Balance Adjustment of (QR35). Thank you for understanding...'”

## PowerApps Bulk Adjustment Portal (Current State) (1 fields)

### FLD-1003: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Transcript describes the current-state PowerApps bulk adjustment journey with concrete step sequence and actors: requester logs the request in the PowerApps portal, approval happens offline, billing operations user manually pulls the Excel and posts it to BRM. It also gives the field list intended to carry over into the target DXP design (account number, billing profile, ledger/bucket ID, description), which is the closest available field-level anchor even though the legacy PowerApps UI itself was not screenshotted.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:25:33 The current bulk adjustment request app is built in PowerApps; users log requests, upload the excel, and it is manually pulled out and sent. / 00:26:34 Target bulk adjustment journey in DXP: A billing ops user with access in DXP selects an offline-generated file with fields (account number, billing profile, ledger/bucket ID, description), uploads and posts it to BRM, with approval done offline, and sees the status of the request.”

## Eligibility Web Portal (external) (1 fields)

### FLD-1004: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The full transcript adds concrete field/interaction-level detail for the external Eligibility Web Portal beyond the summary: it supports three distinct search entry modes (zone/street/building drilldown returning a filtered list of Karama IDs; direct Karama ID entry; direct Vodafone ID entry), returns a three-way service-type result (fixed/fiber, indoor 5G [~90% of cases], outdoor 5G, or 'not sellable at all' for e.g. enterprise-only locations), and surfaces location-specific plan restrictions and CBU-type building information (but not remaining-line capacity). Confirmed explicitly by the presenter as correct in the Q&A.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:29:47 | Three ways to search location | Search by zone/street/building, directly by Karama ID, or directly by Vodafone ID. Confirmed as correct. | 00:03:12 | Portal shows CBU and CBU alum information | The portal shows more information for the agent on the particular location, including CBU. It does not show how many lines are allowed/remaining in the building. | 00:01:28 Non-sellable locations | There can be an instance where a location is not meant for selling anything at all, e.g. it is an enterprise location.”

## Appointment booking / calendar selection screen (1 fields)

### FLD-1005: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full transcript adds interaction-level detail for the appointment/calendar screen: it pulls slot availability in real time (no display if none available), presents the SLA cluster to the agent, restricts the calendar so no date earlier than the cluster boundary is selectable (e.g. if cluster is 1 week, only dates from 1 week onward appear), and - critically - the current design does NOT allow the appointment to be changed once selected within the journey itself; changes are only possible after order submission via a separate reschedule flow (hyperlink from the order, lives in WFM). This is a business rule constraint on the screen's behavior not previously captured.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:47:52 | SLA clusters drive appointment calendar | The system presents the cluster/SLA for the location, e.g. within three days or within one week, and limits the calendar selection accordingly. If it takes one week, appointments are only offered from that point onward. | 00:59:16 | The appointment cannot be changed once selected in the journey; it can only be changed after the order is submitted.”

## UIM Custom Object Summary (1 fields)

### FLD-1006: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The existing summary already contains a complete field list for this screen (all fields shown for a queried SIM record), which satisfies the field-level detail the gap flagged as missing.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Custom Object Summary for SIM 8942702800801190296F): Specification SIM Card, Inventory Status Installed, Assignment Status Assigned, Device Status Available, ICCID 8942702800801190296, IMSI1 4270289011190296, MSISDN 97441202296”

## Order Entry (Backend Order Record) (1 fields)

### FLD-1007: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The existing summary already contains a complete field list and line-item grid structure for this screen, satisfying the field-level detail requested.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Order Entry screen for 1-29727615763: Order Type Activation, Status "Complete", Fulfillment Status "Complete", Status Context "All order lines are completed", Status As Of 9/17/2025 03:30:01 PM, Created By VINODHINIR, Priority "Medium-Complete", Primary MSISDN 97441202301, Billing Account/Service Account MAN KAMI, Billing Profile 1-DNN1Z3T (Postpaid), Credit Limit 1,000, MRC/NRC Total QR0.00. Line Items grid (3 rows...)”

## Home / Guided Process 'Choose process' screen (1 fields)

### FLD-1008: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Directly evidenced in the guided journey summary itself: the entry-point 'Choose process' screen with its exact four options is documented as item 3 in the Key content list, with screen position (after Home page, before Step 1 Contact) and exact option labels.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Guided Process — "1. Choose process." Four options: Consumer Postpaid, Prepaid to Postpaid, New Fixed Line, New Prepaid.”

## Promotion Upgrades picker (modal) (1 fields)

### FLD-1009: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document supplies the full list of visible promotion tiles in this modal/picker beyond just the one selected, plus the exact interaction affordances (free-text filter box, per-tile 'Apply +' button, and a follow-on detail confirmation popup with plan components and Continue/Cancel/Go Back). This is concrete field/control-level detail for SCR-172 beyond the one-line summary. | The Promotion Upgrades picker modal is documented with its search interaction and result set, confirming its purpose as a target-promotion search/select tool triggered from the Upgrade Promotion context-menu action on an installed asset.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “A search box (typed: "red") filters a "Promotion Upgrades List Applet" grid of postpaid plan tiles, each with an "Apply +" button: Postpaid Red 750 Promotion, Postpaid Business Red M 225 Promotion, Postpaid Red 350 Promotion (highlighted in red — selected), Postpaid Business Red 200 Promotion, Postpaid RED ME Promotion, Postpaid Red 500 Promotion, Postpaid RED Unlimited Promotion, Postpaid Legacy Red 2xx Promotion... || Promotion Upgrades picker — modal search "*U*Plus*" returns postpaid target promotions (Postpaid U Plus Promotion, Unlimited Plus variants, etc.).”

## Postpaid - Contact wizard step (Pre-to-Post) (1 fields)

### FLD-1010: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document gives the complete field list and two-stage flow for this Contact wizard step: stage 1 is a single 'Prepaid Number' entry field pre-filled and gated by Go/Search again/Cancel; stage 2 (post-Go) auto-populates a full identity/contact field set (ID Type, ID#, ID expiry, Nationality, Gender, First/Last name, Birth date, Digital Lead/Sale flag, Email with validation checkmark, Language, Alt. phone # with validation checkmark) plus an overlay 'Connection Details' modal showing prepaid/postpaid connection counts.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Step 1 prompts "Please enter number:" with field "Prepaid Number" pre-filled "+974 79025243". Buttons: "Go", "Search again" (greyed/disabled), "Cancel" ... fields auto-populated: ID Type: Qatari ID, ID#: 28260821189, ID expiry: 3/16/2026, Nationality: Filipino, Gender: M, First name: ALLAN, Last name: GRANADA, Birth date: 3/13/1982, Digital Lead/Sale: No (radio) ... Email: nobill@vfq.com (green checkmark = validated), Language: English, Alt. phone #: 97412341234 (green checkmark = validated).”

## Siebel Web Call Center Home page (tile grid) (1 fields)

### FLD-1011: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document gives the full navigation tile grid for this home page beyond a partial listing, including the exact banner text format and the currently-hovered/highlighted tile (New Fixed Line) with its tooltip, for the Back Office Fulfilment responsibility specifically — concrete evidence for tile inventory and personalization-by-responsibility behavior of this screen.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Banner: "Welcome back Hemanth Kumar! Today is Wednesday, June 05, 2024." Full navigation tile grid includes Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts, Prospect, Sales Order, MNP, Blacklist Customers, Queue, Trouble Tickets, Numbers, SLA Notification, Service Availability, Troubleshooting HDM, Consumer Postpaid, Action Required, Activities, New Fixed Line (cursor hovering here, tooltip "New Fixed Line"), New Fixed Line Tablet, RFS/Fiber Home Move, Static Data Business, IDM Management, Order Approval.”

## Enterprise Invoice (Excel) (1 fields)

### FLD-1012: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The fuller markitdown extraction gives a much more complete field/section breakdown of the Enterprise Excel invoice than the compressed summary: sections are previous charges, payments (each shown as its own line, unlike the aggregated PDF), balance carried forward, current charges, adjustments (also itemized line by line), discounts, current month charges, total amount, plus a device installment balance line; services are grouped into mobile / fixed (corporate internet, IP, etc.) / other; below the service section is a usage/CDR section broken out by CDR type (voice, data, SMS) sorted by date/time with a number filter; and the 1M-line limit with aggregation and CSV fallback rule applies to this specific document.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “01:28:45 | Excel (XLS) supporting invoice | The Excel shows the same structure as the PDF - previous charges, payments, balance carried forward, current charges, adjustments if any, discounts, current month charges and total amount... | 01:29:57 | Device installment balance on the bill | The bill shows a device installment balance... | 01:30:08 | Excel service grouping - mobile, fixed, other ... | 01:32:33 | Usage / CDR section in the Excel | Below the service details the Excel has usage - the CDRs, each type of CDR, voice, data, SMS - which is not shown in the PDF.”

## Siebel Excel Export (Uncontrolled) (1 fields)

### FLD-1013: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The fuller markitdown extraction gives the concrete interaction pattern for this cross-tab export screen/feature: trigger is a settings-icon click, output is an automatic XLS download, no access control gate exists, and it is confirmed usable both within a single account's tabs (account summary, installed assets, orders, tickets, activities, payments) and from multi-account/multi-ID search result lists and sales-order search filtered by date range or order number.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:04:51 | Export to Excel from the CRM | Users export XLS files. The export is not access controlled - anyone can export. Users click the settings icon and export; the Excel downloads automatically... | 00:06:57 | Export from search results and sales orders | Apart from inside a single customer account, users can search multiple IDs and export from there, export for multiple accounts, and export sales orders filtered by date range or a specific order.”

## Bulk Activation Control Sheet (Excel Macro, Current State) (1 fields)

### FLD-1014: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Fuller pandoc-plain extraction recovers a specific, itemized field list for the bulk activation control sheet that was compressed out of the summary: the bulk data sheet requires sub-account number, order reference (a dummy pending replica order), numbers, SIM serial, end-user contact reference (last name), billing profile ID, and agent ID; the separate control sheet (macro control tab) requires Siebel user ID, password, and row count. Also recovers the exact execution steps: fill macro sheet -> enter Siebel credentials + row count in control sheet -> click Upload -> open 'new bulk provide order' screen in Siebel -> select the file -> click Process -> orders created and completed automatically.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “'01:40:37 Bulk sheet fields: Sheet requires sub-account number, order reference (a dummy pending replica order), numbers, SIM serial, end user contact reference last name, billing profile ID and agent ID; control sheet takes Siebel user ID, password and row count.' and '01:38:11 Bulk activation via Excel macro: A custom Excel macro built by IT operations/SSI is filled and uploaded; Siebel "new bulk provide order" screen picks up the file and a Process button creates and completes orders automatically.'”

## End Activity Form (1 fields)

### FLD-1015: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field list for the End Activity form is already present in the document: Activity Type, Name, Activity Remarks (free text), Customer Available (dropdown), Customer Signature (capture box), Next Activity (set to a preset value), with Dismiss/Submit buttons as the final technician-side closing step.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “"End activity" screen: Activity Type Installation, Name NARAYAN MANJHI, "Activity Remarks" (free text, blank), "Customer Available" dropdown, "Customer Signature" capture box (blank placeholder), "Next Activity" set to `I will be idle for a while`. Dismiss/Submit buttons”

## Order Line Items > Attributes Tab (Change Audit) (1 fields)

### FLD-1016: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document gives the full column schema for this screen's grid: Name, Value, Action, Description, Data Type, with a worked example of all 5 rows (IPTV Service Id, Indoor Unit CPE Model, Indoor Unit MAC Address, Indoor Unit Serial Number, VoIP Number) showing exactly how an unmodified attribute (Action '-') differs from a modified one (Action 'Update', Description holding prior value).
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “the line item tree shows Outline 1 "FMS CPE Bundle"..."Line Item Attributes" grid (1-5 of 5) for this line lists each attribute with Name / Value / Action / Description / Data Type”

## My Created Leads view (1 fields)

### FLD-1017: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document explicitly states the filter behavior and result count for this screen, and its row schema is directly shown as the same lead record with Lead Num 1-DO3J040, In Progress status, that appears across the whole walkthrough.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “"My Created Leads" filtered view — narrows to 1 record (the just-created lead), confirming the filter scopes to leads created by the logged-in agent.”

## Manage Leads - My Team's Leads (1 fields)

### FLD-1018: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The document explicitly names the filter mechanism (Created By = HEMANTH) and confirms the visible column set includes Lead Sub Status, tying this manager-scoped view to the specific 9-lead list and its purpose of manager review before the Reject action.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Manage Leads > "My Team's Leads" view, filtered Created By = HEMANTH, listing the same 9 leads including the target Home/97410001000/1-DO3J040 record (now showing Lead Sub Status column = Call Back).”

## RFS Portal (1 fields)

### FLD-1019: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full markitdown re-extraction of the meeting transcript (not present in the compressed .md summary) surfaces a complete field-level walkthrough of the raw GTM file that feeds the RFS Portal's top-level building data, plus explicit confirmation of the portal's three search modes, per-building displayed attributes, and per-KID displayed attributes -- substantially more field detail than the summary's one-line purpose statement.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Raw GTM file from IMS to RPA contains GID, PIN (plot ID), QCars, source of data, building subtype, zone-street-building, BID information (IMS BID, different from the BID used in UIM), GTM ID, area, subarea, PIN/plot, building name, lat, long, LLCF, CRA (regulation), cluster (now F1-F4 instead of 1-4), potential, and landscaping needed or not needed. ... Portal shows whether the building is RFS or not, potential, total building, CB potential, EB potential, and SLA/SLS data telling how fast fixed service can be provided (F1, F2) ... Searching by Karama ID drills down to the actual unit and shows building information plus KID information, whether it is currently in use, whether the KID is prepaid and has an active service.”

## Account 360 View (FWA, created) (1 fields)

### FLD-1020: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Directly evidenced in the FWA Desktop Vanilla guided journey (item 5 of Key content) with the specific field/attribute values shown on the auto-generated Account 360 View screen. | The summary document itself (step 24) already contains a full field list for the Account 360 View screen: Account Name, Account #, Account Class, Account Type, Site, Country, Special Management, Customer Segment, Customer Since, Status, Primary MSISDN, Pre-approved (Expatriate/Qatari) credit limit, Credit Risk, Account Team, plus an Installed Assets sub-panel and an Orders sub-tab showing historical orders.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Account 360 View created - Account auto-generated from the contact (Account Class: Customer, Account Type: Residential, Customer Segment: Expatriate, Status: Active), with Billing Profile tab showing a new Postpaid, Monthly, Invoice billing profile. || Account MAHENDRAN GANESAN, Account # 128338435506, Account Class Customer, Account Type Residential, Site "Qatari ID_2703563...", Country Qatar, Special Management: "B2B2C Consum...", Customer Segment Expatriate, Customer Since 2/3/2025, Status Active, Primary MSISDN 97441224267, Pre-approved (Expatriate/Qatari) credit limit 50, Credit Risk "No score", Account Team AKKIRAJJUB. Installed Assets: No Records (pending fulfillment).”

## Sales Order Detail (More Info tab) (1 fields)

### FLD-1021: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Directly evidenced in the FWA Desktop Vanilla guided journey (item 7 of Key content) with the exact field names and values shown on the Sales Order Detail More Info tab.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Sales Order detail (More Info tab) - Order Type: Activation, Fulfillment Mode: Deliver, Price List: VFQA PriceList, Currency: QAR.”

## Attachment Viewer (Qatari ID/CAF/Supplementary Form) (1 fields)

### FLD-1022: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full detail already present: the Attachment Viewer is evidenced across three distinct instances (Qatari ID front, Qatari ID back, and CAF document) in the manager approval flow, each a full-screen document viewer accessed from an Attachments tab with icons for QatarIdFront/QatarIdBack/CAF/SupplementaryForm. Concrete field content shown per viewer: ID front shows 'Qatari ID-Front [timestamp]' with ID No., DOB, Expiry, Nationality visible; ID back shows 'Qatari ID-Back [timestamp]' with Passport Number, Passport Expiry, Serial No., Residency Type, Employer, issuing-authority signature line; CAF viewer shows the same bilingual signed CAF PDF layout as the CAF generation step, confirming the manager can open and review the actual signed document before approving.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Attachment viewer – Qatari ID front (image32) — Full-screen document viewer showing "Qatari ID-Front 492025 133044" — a photographed Qatar residency permit: ID No. 29035654458, DOB 03/07/1990, Expiry 04/01/2025, Nationality INDIA... Attachment viewer – Qatari ID back (image33) — "Qatari ID-Back 492025 133050": Passport Number W3128683... Attachment viewer – CAF document (image34) — "Digital_New_FWA_04092025_130959_signed" — the signed Vodafone Customer Application Form”

## Manager Home Screen (Test Manager) (1 fields)

### FLD-1023: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The Manager Home Screen is directly evidenced with its exact restricted menu, distinguishing it from the field-agent tablet menu (which has ~13 tiles). Confirms purpose as a restricted landing screen for the approver role.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Manager home screen (image29) — "Welcome back Test Manager!" Thursday, September 04, 2025. Tile menu reduced to just Home and Order Approval — confirming this is a distinct, restricted manager/approver role UI.”

## Sales Order Record (Backend, Approved) (1 fields)

### FLD-1024: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full field-level detail for the backend Sales Order Record (Approved state) is present: Order #, Account, Type, Primary MSISDN, Order Type, Order Sub Type, Status, Fulfillment Status, Status Context, Created By, Billing Profile Type, Credit Limit, plus the action-button toolbar available at this state.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Sales Order record (image38) — Full backend order form for Order # 1-29724732583... Account SELBATH JAMAL[UDEEN], Type Sales Order, Primary MSISDN 97441202297, Order Type Activation, Order Sub Type Dual Play, Status Complete, Fulfillment Status Complete, Status Context "All order lines are completed", Created By HEMANTH, Billing Profile Type Postpaid, Credit Limit 1,000. Action buttons: Revise, Validate, Select Favorites, Drop Order, Submit, MOI Validation, Generate Activity Plans, Cancel Order.”

## Order header / Order detail screen (Pre-to-Post) (1 fields)

### FLD-1025: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The Order header/detail screen is evidenced twice in this document at two different states: first as an informational note point (Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP Postpaid, MRC Total QR150.00) with a Validate action producing an informational alert, then again in a terminal validation-failure state (same order, Order Sub Type revealed as Pre2Post, Credit Limit 1,000, blocking alert with Siebel error code). This confirms the screen's purpose (view/validate/submit) and shows both a pass-through validation message and a hard validation failure.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Order header — informational note on Validate — Order #1-28855889958, Type Plan Change, Status Pending, Billing Profile 1-D7X76LP (Postpaid), MRC Total QR150.00. On Validate, an alert reads: "Note: Maximum Bill Limit is equivalent to account Credit Limit. Please communicate this to customer."... Validation failure (terminal state) — same order, now shown with Order Sub Type: Pre2Post... "Bill Limit can not be set lower than Agent Minimum 80..."”

## All Leads across Org (1 fields)

### FLD-1026: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The 'All Leads across Org' admin view is documented with its role context (KARTHIKK back-office/admin login), its filter dropdown options, grid columns, and the org-wide row set it displays, plus admin-only action buttons (Reject, Retire) visible on the detail panel beneath it.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Admin "All Leads across Org" view. Tab titled "All Leads acro[ss Org]..." A view-filter dropdown at top-right offers options including "Converted Leads." The "All Leads" grid (1-10 of 10+) lists every lead in the org across all owners... Lead Details panel below adds admin-only buttons Reject and Retire”

## Description edit popup (1 fields)

### FLD-1027: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The Description edit popup is documented with its trigger (expand/edit icon next to the Description field), its single free-text field, the specific value entered, and its confirm control, plus the before/after state on the parent Lead Details View.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “A "Description" text-edit popup opens (triggered by an expand/edit icon next to the Description field). The new owner types "Test1234" replacing the prior text, with an OK button... The Description field on the Lead Details View now reads "Test1234"”

## CallBack Date/Time picker (1 fields)

### FLD-1028: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The CallBack Date/Time picker is documented with its full control set (month calendar, day selection, Hour/Minute sliders, Now/Done buttons) and its downstream side-effect (auto-transition of Lead Status/Sub Status upon save), which is additional validation-adjacent behavior beyond a plain field list.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “A date/time picker opens on the CallBack Date/Time field: December 2025 calendar, day 4 highlighted (green), time control shows 12:00:00 AM with Hour/Minute sliders, plus Now and Done buttons... After entering 12/4/2025 12:00 into CallBack Date/Time, the record auto-updates: Lead Status changes from "New" to "In Progress", and Lead Sub Status becomes "Call Back."”

## Account Summary (Account 360, CTI View) (1 fields)

### FLD-1029: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Account Summary (Account 360) screen is fully documented with nav bar, breadcrumb, account attribute fields (Account Type, Customer Segment, Credit Limit Amount, status), whitelisted KYC box fields (Qatari ID, DOB, Email) with Contact Portal link, Installed Assets grid, tab switcher (Account Summary/Asset Summary), Activity Timeline entries, and summary tiles (Orders/Trouble Tickets/Installed Assets/Billing Profiles) plus an All Orders grid.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Image 1 — Account Summary tab. Top nav bar: Home, Assets, Trouble Tickets Dashboard, Contacts, Accounts (active)... Left panel shows customer "Anuj Singh Yadav, Vodafone Contractors" — Account Type: Business, Customer Segment: Reimbursement, Credit Limit Amount: 500... Center panel "Whitelisted" box shows Qatari ID: 29635618702, Date Of Birth: 10/24/1996, Email... Right panel "Installed Assets"... Activity Timeline... summary tiles: Orders (87...), Trouble Tickets (62...), Installed Assets, Billing Profiles (3...)”

## Asset Summary (CTI View) (1 fields)

### FLD-1030: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Asset Summary screen documented with Recent Usage panel (All/SMS/Data/Voice/Recharge sub-tabs with actual call-log rows), a usage-ring panel (View Bills/Voice/Data tabs, circular gauges with remaining balances and expiry dates), and a right-hand asset detail panel with Bill Limit, Change Limit button, Activation Date, Addons list, Manage Add Ons / Upgrade Promotion buttons, plus a Next Best Offer banner with Accept/Reject/Interested controls (disabled in this instance).
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Image 2 — Asset Summary tab... "Recent Usage" panel (All/SMS/Data/Voice/Recharge sub-tabs) lists call detail rows... usage-ring panel shows "View Bills / Voice / Data" tabs with Charge QR 0, Discount QR 0... circular gauges... Right panel "Postpaid Business Employee Plan Pro…" shows phone 97472501217, Postpaid, Business Bill Limit: 0.01 with a "Change Limit" button... Addons: SIM Card, Business Bill Limit, Bill Manager... with "Manage Add Ons" and "Upgrade Promotion" buttons. Below is a "Next Best Offer" banner (grayed out/inactive) with Accept/Reject/Interested buttons disabled.”

## GigaHome Subscription Acceptance Form (bilingual paper/PDF form) (1 fields)

### FLD-1031: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Re-extraction of the source PDF directly (pdftotext) confirms the complete field-level structure already captured in the summary: page 1 is the full English form with 18 numbered clauses including fill-in/checkbox fields (Upfront Fee N/A/Cash, Bill Cycle 1st/15th/existing, Discount %/months blank fields, speed tier 100/500Mbps/1Gbps checkboxes, FUP 1TB/2TB/10TB checkboxes, installation address Zone/Street/Building/Unit fill-ins), ending in a 'Confirmed by: Customer QID / Customer Name / Customer Signature / Date' block. This is the full screen/document field inventory needed.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “12. My GigaHome connection is installed for my house at Zone No. Street No. building No. Unit No. ... Confirmed by: Customer QID: Customer Name: Customer Signature: Date”

## Prepaid Customer Application Form (unsigned) (1 fields)

### FLD-1032: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The summary (from full direct visual reading of screenshot 8) already contains the complete field-level structure for this screen: header fields (Application date, Store/Retailer ID, Vodafone mobile number, SIM serial), Applicant details (Full name, Qatari ID/RP/Passport Number, Expiry), an Accepting Terms and Conditions section with blank Signature of applicant field and consent paragraph, mandatory document list, and continuation into full bilingual Vodafone Qatar General Terms and Conditions text.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Header fields: Application date* = 1/9/2025, Store/Retailer ID = 100001940, Vodafone mobile number = 97479025359, SIM serial = 8942702400000025359. 'Applicant details' section: Full name* = VFQMAV Sourav183, Qatari ID/RP/Passport Number* = SG1972, Expiry = 02/12/2037. Section 'Accepting Terms and Conditions*' includes a blank 'Signature of applicant*' field...”

## CAP Signature Screen (1 fields)

### FLD-1033: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full pandoc re-extraction recovers the specific ordered flow leading into and including the CAP signature step for instant activation: QID capture, ID front/back scan, address confirmation, plan/add-on/number selection, then the appointment-booking step is auto-skipped and the flow proceeds directly to CAP where the number and plan are stamped, appointment details remain blank, and the customer signs to close the CAP before the order can be submitted.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “00:07:05 Instant activation flow steps: Enter the QID number, scan customer ID front and back, confirm auto-selected address, choose plan and see plan details, select add-ons, select number; book appointment step is skipped automatically and it goes straight to CAP. ... 00:08:33 CAP signature and completion: Number and plan are stamped on the CAP, appointment details are blank; customer signs, CAP is closed, supplementary forms are uploaded, activity is completed and the order is submitted and completed.”

## Orders page (1 fields)

### FLD-1034: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full pandoc re-extraction of the Day4 Session 2 transcript recovers the precise workflow context for the Orders page and the resolution-code gate: the disconnection ticket is handled as BAU with one extra layer -- once the ticket is closed with a specific resolution code, the agent navigates to the Orders page, selects disconnection, and submits the disconnection order; the resolution code differs by outcome ('retained' vs not retained, decided by the retention team/agent).
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “[00:55:12] Disconnection ticket: Created as BAU like normal tickets, but with one extra layer: once the ticket is closed with a specific resolution code the agent goes to the Orders page, selects disconnection and submits the disconnection order. [00:56:02] Retention handling of disconnection: ... If retained, the resolution code is 'retained'; if not, retention themselves take the disconnection decision.”

## Ticket detail screen (public notes / bell icon notifications) (1 fields)

### FLD-1035: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Full pandoc re-extraction recovers the fuller explanation and rationale distinguishing the bell icon from public notes, plus the explicit improvement requirement: bell icon is account/MSISDN-level, agent-visible only, actionable (flags something the agent must act on) and bulk-uploadable via Excel; public notes are informative/historical, business-driven (not agent-driven), uploaded via Service Request, and retained indefinitely -- but agents miss them even after broadcast reminders, so the business wants them made as visually prominent as the bell icon.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “[01:59:00] Public notes visibility problem: Public notes are buried; agents miss them even after broadcasts telling them to look inside notes. Business wants them as prominent as the bell icon; the bell icon asks the agent to do something whereas public notes are informative and historical.”

## Book Appointment / Book Unscheduled Appointment Step (1 fields)

### FLD-1036: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The summary (steps 12-15) already documents the full Book Appointment / Book Unscheduled Appointment step end-to-end: the two-option choice, the calendar modal with month/date/time-slot selection, a Booking Comments field, a cancellation warning dialog, a success dialog with generated Appointment ID, and the resulting saved appointment detail table with 7 named fields.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Agent picks Book Appointment -> a calendar modal opens (September 2025), date 13 (Sat) selected. Time slot 8AM - 11AM chosen... Appointment Number: 1-29724803615, Technician ID: ABATS_Consumer_Installation, Status: pending, Appointment Date: 09/13/2025, Channel: SIEBEL, Type: (blank), Appointment ID: 120903, Time Slot: 8AM - 11AM.”

## Comments modal (Base Management) (1 fields)

### FLD-1037: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The summary (step 10) already documents the Comments modal fully: it is a free-text popup reached from the Activity step of the Base Management/Autobase wizard, pre/post-filled with a Language field, and confirmed via OK, later surfacing in the Account Activities tab as the persisted Comments value.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “A "Comments" popup textbox is filled with the literal text "UNICA PRE TO POST TEST" ... Language field now shows "English". OK button.”

## Account 360 View / Account Summary tile view (1 fields)

### FLD-1038: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The summary (step 3) already documents the Account 360 View / Account Summary tile view with concrete fields: Qatari ID, DOB, Email, Whitelisted flag, an Activity Timeline listing prior migration entries, and four tile counters (Orders, Trouble Tickets, Installed Assets, Billing Profiles) plus a flyout with Go to offer migration / Back / SIM Swap actions.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “A different, higher-level "Account Summary" screen (VFQA 360 View) shows the account snapshot (Qatari ID 28852442717, DOB 06/24/1988, Email nobill@vod.com, Whitelisted). ... Tile counters: Orders 7, Trouble Tickets 0, Installed Assets 2, Billing Profiles 3 (Active 3).”

## Enterprise Process Knowledge Base Dashboard (1 fields)

### FLD-1039: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Markitdown re-extraction of the source .docx surfaced a verbatim, more granular navigation sequence for the dashboard than the summary line: from the dashboard, scroll down to a process list; the process list splits into consumer/enterprise/internal processing categories; clicking 'enterprise' reveals five process areas; each process area is opened via a hyperlink on the right side of its row. This gives a concrete interaction path (scroll -> category click -> 5 sub-areas -> hyperlink) for the dashboard screen.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “From the dashboard scroll down, there will be the process list; access the process, you will find consumer, enterprise and internal processing; click on enterprise and the five process areas are available, then click the hyperlink on the right side to open a process.”

## QID Offers grid (1 fields)

### FLD-1040: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** The summary itself (steps 5-6) already documents the QID Offers grid with a full field list: CampaignCode, OfferName, PromotionId, OfferType, Price, MonthlyRental, Status, plus the Accept action -- this is a complete, concrete field-level description already present in the source extraction.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “a single targeted campaign offer: CampaignCode 000001247, OfferName "New Gigahome Testahil plan", PromotionId 1-5XBWM5D, OfferType: New Fiber, Price 0, MonthlyRental 299, Status Offered. Agent clicks Accept.”

## Home Move Checklist (1 fields)

### FLD-1041: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Direct image extraction and visual reading of the source .docx (previously only text-caption-extracted, screenshots never visually read) recovered the actual Home Move Checklist screen (Oracle Field Service technician UI) with concrete fields: two mandatory checkbox items ('Brief customer on package details', 'How to restart CPE (and STB) in case of technical issue'), a Customer Signature capture pad, a Device Details/ONT details panel (ONT Model Number, ONT Serial Number), and six photo-evidence upload fields (Screenshot of Wi-Fi interference, Speed observed on customer phone, Screenshot of CPE Installed, Screenshot of STB installed, Screenshot for Internet configuration from CPE, Screenshot for VOIP configuration from CPE, Additional Equipment Approval). This is a genuine escalation beyond text-extraction per the corpus's own image-extraction methodology.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Home Move Checklist [heading] -- Brief customer on package details [checked] -- How to restart CPE (and STB) in case of technical issue [checked] -- Customer Signature [signature pad] -- Device Details / ONT details: ONT Model Number G-010G-P, ONT Serial Number ALCLF11C1515 -- Screenshot of Wi-Fi interference / Screenshot of CPE Installed / Screenshot of STB installed / Screenshot for Internet configuration from CPE / Screenshot for VOIP configuration from CPE / Additional Equipment Approval.”

## Order Approval Queue / Order Activities Queue (Tablet) (1 fields)

### FLD-1042: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Direct image extraction and visual reading of the source .docx (previously only text-caption-extracted) recovered the actual Order Activities Queue / My Activities screen with a full column list (Journey Name, Mobile #, Activity #, Order #, Activity Status, Order Status, Order Approval, Order Rejection, Order Created End, Order Created Date, Owner, Service Account, First Name, Last Name, Pending Reason) plus a populated example row, and recovered the exact system-enforced drop-order validation error referenced only generically in the text summary: 'Order is Submitted for Approval and cannot be dropped.(SBL-BPR-00131)' shown on the underlying Siebel Sales Order screen.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “Journey Name | Mobile # | Activity # | Order # | Activity Status | Order Status | Order Approval | Order Rejection | Order Created E[nd] | Order Created D[ate] | Owner | Service Account | First Name | Last Name | Pending Reason ... "Order is Submitted for Approval and cannot be dropped.(SBL-BPR-00131)"”

## Agent Desktop (Journey initiation) (1 fields)

### FLD-1043: (Stage K recovered field/section detail - see description)
`Explicit` · confidence: `medium`

- **Mandatory:** Unknown
- **Validation rule:** Direct inspection of the source Excel's 05_Requirements sheet recovered the exact, testable requirement statements and acceptance criteria behind the summary's one-line paraphrase: MPAR_001_JSM_01 defines the Agent Desktop as the journey-initiation screen with acceptance criterion 'A Retail Agent can start a New Postpaid Activation journey from the Agent Desktop home screen'; MPAR_001_JSM_02 defines the role-based authorization behavior with acceptance criterion 'An agent without the New Activation privilege is denied journey initiation and an authorisation message is displayed', both tied to Business Rule Ref BR-001 and the (TBD) Agent Role Privilege Matrix.
- **Sources:**
  - [`stage-k-remining`](../.knowledge/docs/stage-k-remining.md): “MPAR_001_JSM_01 | Journey and Session Management | Initiate retail interaction | The system shall allow a Retail Agent to initiate a New Postpaid Mobility activation journey for a walk in customer from the Agent Desktop. | A Retail Agent can start a New Postpaid Activation journey from the Agent Desktop home screen. | Must | AS-IS | ... MPAR_001_JSM_02 ... The system shall authenticate the Retail Agent and authorize journey access based on the agent role defined in Agent Role Privilege Matrix (TBD) | An agent without the New Activation privilege is denied journey initiation and an authorisation message is displayed.”

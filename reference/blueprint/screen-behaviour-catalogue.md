# Screen Behaviour Catalogue (Phase 12)

User Actions, Success Flows, Failure Flows, Validation Flows, Navigation Flows, and Error Behaviour for all 213 screens. Coverage is **layered, not uniform** — every screen gets a generic, screen-type-driven behavior baseline (from evidenced UI patterns in `reusable-patterns.md`), and screens matching specific evidenced negative scenarios (`exception-catalogue.md`) or having grouped field-level validation (`field-inventory.md`) get that specific detail layered on top. Treat the generic baseline as `Inferred` (a reasonable generalization from the pattern catalogue) and the specific matches as `Explicit`.

---

## Wizards (58)

### SCR-001: Bulk Adjustment Portal (DXP, Target State)
- **User actions:** fixed template rows, unit of measurement, free-text comment, billing profile filter
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: request status, failure reports for re-upload
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-010: DSP Bulk Activation Templates (Target State)
- **User actions:** plans, spend limits, discounts, price overrides per row, across accounts and billing profiles
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: per-row success/failure status
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-031: OpenGate Tablet Instant Activation Flow
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-035: TON (Transfer of Number) Wizard
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-037: New Postpaid Connection Journey (single-scroll flow)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** QID / ID document scan result: QID mandatory for postpaid; MOI API primary source, Tarasol/manual fallback only if MOI API doesn't respond
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation), EXC-011 (Mandatory Supplementary Form)

### SCR-043: New Fixed Line wizard — Contact step
- **User actions:** Kahramaa ID, Qatari ID, Email, Language, Alt phone #, ID photo uploads
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Confirmed Contact record
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-045: New Fixed Line wizard — Address step
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-046: New Fixed Line wizard — Plan step
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-047: New Fixed Line wizard — Addon & Discount step
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Add-on / Discount: if there are no applicable add-on or discount, the selector will be empty (Fulfilment)

### SCR-048: New Fixed Line wizard — Number Selection step
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-050: New Fixed Line wizard — CAF/Attachments step
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-064: Order Correction wizard
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-067: New Fixed Line Tablet Guided Journey (Contact/Address/Plan/Addon/Number/Appointment/CAF/Activity accordion)
- **User actions:** Kahramaa ID, ID Type/Number, contact fields, address, plan, addon/discount, number selection, appointment, CAF attachments, activity comment
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Sales Order created and completed
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation), EXC-011 (Mandatory Supplementary Form)

### SCR-078: FWA Contact Step
- **User actions:** Qatari ID, email, language, alt phone, attachments
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Connection Details popup, confirmed contact record
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID / Qatari Id (insert or scan): Must resolve a valid ID via lookup (Go button); validated (green check); Email: Format validated (green check); Alt. phone #: Format validated (green check); Company Name: Autocomplete against existing companies
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-079: Address Step (FWA)
- **User actions:** Zone, Street No., Building No., Apt/Flat/Unit, Area
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: validated/saved address or validation error
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Zone: required field; required to save address
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-080: Plan Step (FWA)
- **User actions:** plan selection
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: bundled component confirmation popup
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-081: Addon & Discount Step (FWA)
- **User actions:** Select Add-on / Select Discount buttons
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: applied discount shown
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-082: Number Selection Step (FWA)
- **User actions:** toggle Free/Reserved, number tile selection
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: reserved MSISDN
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-083: Book Appointment Step / Modal (FWA & WFM)
- **User actions:** Cluster, date, time slot, booking comments
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Appointment ID/booking confirmation
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Time slot: Some slots disabled based on availability; Submit confirmation: Cannot be cancelled once booked; Book Unscheduled Appointment confirmation: Cannot be cancelled within the journey once booked

### SCR-099: SIM Serial Step (FWA, with validation)
- **User actions:** SIM Serial, CPE Serial Number
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: validated serials or error (not found/already assigned/not free)
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** SIM Serial: must be 19 digits; must exist and not already be assigned in UIM; CPE Serial Number: must be free/not-assigned in UIM
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-100: CAF & Additional Attachments Step (FWA)
- **User actions:** CAF file, Supplementary Form file
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: validated/uploaded attachments (green-checked) or error if Supplementary Form missing
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Supplementary Form: must be selected before Continue
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-109: Book Appointment / Book Unscheduled Appointment Step
- **User actions:** date/time slot or unscheduled confirmation
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Appointment ID and details
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-113: MNP Postpaid Billing Step
- **User actions:** none (view)/Continue
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: billing profile confirmed
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-115: Book Appointment (Home Move)
- **User actions:** Cluster, slot selection
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: appointment booked with warning confirmation
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-116: Home Move Checklist
- **User actions:** checklist fields
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: submitted checklist
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** KID (location identifier the user is moving to): Triggers Fiber-readiness check

### SCR-120: MNP Guided Process - Choose process
- **User actions:** button click
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: launches MNP wizard
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-121: MNP wizard step: Contact
- **User actions:** Qatari ID, email, language, alt phone, attachments; ID Type/ID Number (prepaid variant)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: confirmed Contact record; MOI Validation banner (prepaid variant)
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date: Green check confirms validity on lookup; Email: Green checkmark validation

### SCR-122: MNP wizard step: Address
- **User actions:** Zone, Street No., Building No., Apt/Flat/Unit
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: saved Address record
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-123: MNP wizard step: Billing
- **User actions:** none (selection from existing profile)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: selected Billing Profile
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-124: MNP wizard step: SIM Serial
- **User actions:** SIM Serial
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: validated SIM assignment
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-125: MNP wizard step: Plan (plan selection grid)
- **User actions:** search term, plan Add click
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: selected Plan/Promotion
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-126: MNP wizard step: Donor Details
- **User actions:** Port-in Number, Donor ID, Donor ID Type, Subscription Type
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Donor Details record
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Port-in Number: green check; Donor ID: green check

### SCR-127: MNP wizard step: Donor Attachment
- **User actions:** MNP Form selection (Digital/Touch Screen)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: signed MNP form attachment
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date: Green check confirms validity on lookup; Email: Green checkmark validation
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-129: MNP wizard step: CAF
- **User actions:** CAF form type selection (Digital/Manual/Touch Screen)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: signed CAF attachment
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** New File (attachment upload): At least one attached in example
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-133: MNP wizard step: Addon & Discount
- **User actions:** add-on/discount checkbox selections
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: selected add-ons/discounts applied to order
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Add-on / Discount: if there are no applicable add-on or discount, the selector will be empty (Fulfilment)

### SCR-134: MNP wizard step: Activity (Comments)
- **User actions:** Comments text
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: submitted order confirmation
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Comments: Please note down a comment regarding the actions performed. This will be used by other advisors to better understand the customer's history.

### SCR-140: New Lead Tablet - Create a Lead form
- **User actions:** Mobile Number, Service Needed, name, preferred time, address
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: created Lead record
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-151: Passport to QID Update wizard
- **User actions:** MSISDN, Passport Number, QID Number, QID Front/Back images, signature
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Identification number change form signed and attached
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-152: Cross Sales Contact step (Postpaid)
- **User actions:** Qatari ID
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Verified contact, proceeds to Offers step
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-153: Cross Sales Offers step (Postpaid)
- **User actions:** Offer selection action
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Order/handoff into New Postpaid wizard on accept
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-154: Postpaid Contact step (wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date: Green check confirms validity on lookup; Email: Green checkmark validation

### SCR-155: Address step (Postpaid wizard)
- **User actions:** Zone, Street No., Building No., Apt/Flat/Unit
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Skip Address option: Please enter required fields
Zone, Street No., Building No., Apt/Flat/Unit, Area
or click Skip Address to proceed without Saving Address.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-156: Billing step (Postpaid wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-157: Number Selection step (Postpaid wizard)
- **User actions:** Number selection
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Reservation token, Reserved Numbers grid update
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Reservation success alert: SUCCESS:Reservation Token:1001357812(SBL-EXL-00151)

### SCR-158: SIM Serial step (Postpaid wizard)
- **User actions:** SIM Serial number
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-159: Product Catalog / Plan step (Postpaid wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. Evidenced output: Selected plan/promotion detail with bundled components
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-160: Payment step (wizard)
- **User actions:** Payment reason, deposit amounts
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Reason: Used for FREE type sales; Generate CAF: Triggers 'Validating Order, please wait...'
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-161: CAF/Attachments step (Postpaid wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** New File (attachment upload): At least one attached in example
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-162: Activity step (call disposition, Postpaid wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** New File (attachment upload): At least one attached in example

### SCR-170: CAF & Additional Attachments step (B2B2C)
- **User actions:** File uploads
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Proof of Employment: required for B2B2C, must be completed before Continue enabled
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-177: Postpaid - Contact wizard step (Pre-to-Post)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID / Id expiry / Nationality / Gender / First name / Last name / Birth date: Green check confirms validity on lookup; Email: Green checkmark validation

### SCR-180: Base Management wizard (Contact / Offer Summary / Activity)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Bill Limit: Default (Smart) Bill Limit should be communicated to the customer

### SCR-187: Mobile Postpaid > Guided Process Choose process (tablet)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Qatari ID: green check mark

### SCR-189: Step 3 Addon & Discount (Pre-to-Post tablet)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Select Add-on / Select IPTV Add-on / Select Discount: If there are no applicable add-on or discount, the selector will be empty.

### SCR-190: New Prepaid Tablet — Step 1 Contact (ID capture)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** ID Number: validated via barcode scan, shows green checkmark when valid
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-191: New Prepaid Tablet — Step 3 Number Selection
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).

### SCR-192: New Prepaid Tablet — Step 4 SIM Serial
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** SIM Serial: Shown green-checked (validated); supports barcode-scan input via a scan icon
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-208: DXP Agent Portal Wireframes (13-step onboarding wizard)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** All mandatory fields for the step pass validation; step is marked complete (evidenced UI pattern: green checkmark / "Saved!" — Reusable Patterns 1, 11, 12) and Continue becomes enabled. 
- **Navigation flow:** Continue advances to the next step in sequence (Reusable Pattern 1); Go Back returns to the prior step; Abandon Order/Cancel exits the flow (drafts persisted per `screen-state-model.md`'s Draft state where evidenced).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation), EXC-011 (Mandatory Supplementary Form)

## Modals (32)

### SCR-005: Bill Simulation Screen
- **User actions:** trigger from guided journey (disconnection, MNP port-out, upgrade/downgrade, park, put-off) or on-demand button
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: simulated penalty amounts, explicit non-tax-invoice disclosure
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-044: Fixed Line IPTV popup (billing email opt-in)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Tick box for different billing email / Billing Email: IDM Created Successfully

### SCR-049: Book Appointment modal (Fixed Line)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-055: Responsibilities dialog
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-058: CAF preview modal (with e-signature pad)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-062: Reject Order modal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-063: Approve Order modal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Approve Order confirmation checkbox/comment: By clicking submit, I agree that I have verified all the documents and details to proceed with submission.

### SCR-068: Combo Box CPE Detection Dialog (Instant vs Normal Activation)
- **User actions:** none (confirmation only)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: Instant Activation or Normal Activation branch selection
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Activation type choice (Instant/Normal): We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-069: Customer Application Form (CAF) Preview/Sign
- **User actions:** applicant/billing/service sections auto-populated; signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: Signed CAF attachment
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Highlighted Key T&Cs Section: Content configured by business admin, not agent-selectable
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-070: Signature Capture Pad
- **User actions:** drawn signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: signature image embedded in document
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-074: Attachment Viewer (Qatari ID/CAF/Supplementary Form)
- **User actions:** click attachment icon
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: document rendered
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Highlighted Key T&Cs Section: Content configured by business admin, not agent-selectable
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-084: CAF Modal (FWA)
- **User actions:** CAF type selection, signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: signed CAF attachment
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Supplementary Form: must be selected before Continue
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-085: Activity Step (Comments)
- **User actions:** comments text
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: order finalized
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Comments / Order completion dialog: Fixed Line completed successfully. Order Number:- '1-29793912388' (Cross Sales); Order Number:- '1-26921279847' (Fulfilment)

### SCR-088: Resource Inventory Import / Field Service Import Add-in
- **User actions:** Instance Name, User Name, Resource Id, Password
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: Import status (Success/Created/Updated/Deleted counts)
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-089: Move Dialog (Technician Reassignment)
- **User actions:** technician search
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: activity moved (with conflict warnings if applicable)
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-114: MNP Postpaid Plan Step / Promotion Detail Modal
- **User actions:** Edit Bill Limit, Edit Credit Limit, Edit Smart Limit, Customise button
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: confirmed plan selection with Bill/Credit/Smart Limit values
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Smart Limit: Bill Limit can not be set lower than Agent Minimum 50

### SCR-128: Mobile Number Portability Application Form (MNP contract)
- **User actions:** customer signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: signed MNP form
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-130: Vodafone Customer Application Form (CAF, MNP variant)
- **User actions:** customer signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: signed CAF
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Highlighted Key T&Cs Section: Content configured by business admin, not agent-selectable
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-138: Mass Market Addons checklist modal
- **User actions:** checkbox selections
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: selected add-ons list
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-139: Prepaid Customer Application Form (CAF)
- **User actions:** customer signature
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: signed prepaid CAF
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Valid Qatari ID/RP Number / Passport Number: data-binding gap observed in this build (field displayed literal value 'undefined')
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-145: Reject Lead modal
- **User actions:** Reject Reason Code, Reject Comment
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: lead status set to Rejected
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-146: Lead Owner reassignment picker
- **User actions:** search filter, row selection
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: reassigned Lead Owner
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-148: Description edit popup
- **User actions:** description text
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: updated Description field
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-149: CallBack Date/Time picker
- **User actions:** date, time
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: CallBack Date/Time value set, auto-transitions Lead Status
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-166: Bill Limit Mobile Plus — Customize detail panel
- **User actions:** SL Limit Amount
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** SL Limit Amount: Must not be lower than product's Agent Min Value or order validation fails (SBL-EXL-00151)

### SCR-172: Promotion Upgrades picker (modal)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-181: Comments modal (Base Management)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** advance payment info banner: (HRN) Customer needs to pay advance payment of QR 100.

### SCR-182: Submission confirmation modal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** confirmation message: Order request is submitted successfully. Please check installed asset of the account to confirm. (HRN) Customer needs to pay advance payment of QR 100.

### SCR-188: Step 2 Plan — Edit Credit Limit dropdown
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-193: Prepaid Customer Application Form (unsigned)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Valid Qatari ID/RP Number / Passport Number: data-binding gap observed in this build (field displayed literal value 'undefined')
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-205: Communications Modal / Real Time Balance
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. Evidenced output: Balance tiles (Primary Balance, Bill Manager, International Minutes, Lite Key, Local Minutes/SMS, Data); sub-nav (Contact history, Orders, Asset Details, Tickets, Bill Payments, Bulk Note, Advance Credit, Lead)
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

### SCR-213: Open UI Tickets Fields (per-issue-type template)
- **User actions:** Template content per issue type (e.g. Slow Data Performance, Incorrect Charges templates)
- **Success flow:** Action completes (e.g. Approve, Sign, Reserve) and a confirmation is shown (see `notification-catalogue.md` §3) before the modal closes. 
- **Navigation flow:** Opened from a parent screen action; Confirm/Save commits and closes; Cancel/Close discards and returns to the parent screen without side effects.

## Dashboards (11)

### SCR-012: RFS/Feasibility Portal (Grafana)
- **User actions:** address/location
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. Evidenced output: feasibility result
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-013: Enterprise Process Knowledge Base Dashboard
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. Evidenced output: process list, drawing links, procedure documents
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-021: Customer 360
- **User actions:** Not stated
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. Evidenced output: Not stated; Order section outputs order history/details (Fetch Order History); Trouble Tickets section outputs ticket history (Fetch Ticket History); Billing Profile section outputs billing profile details
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-056: New Fixed Line Tablet Home Dashboard
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-060: TM SR Queue View — Order Activities Queue
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-091: OFS My Route (Technician)
- **User actions:** none / Activate route action
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. Evidenced output: navigation to Start activity; route status change
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-119: Agent Home / App Launcher
- **User actions:** tile click
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. Evidenced output: navigates to selected module
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-176: Home menu (app-icon grid, Pre-to-Post desktop)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-183: Bulk Jobs / Bulk Processing screen (TM Bulk Batch List Applet)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-185: Account 360 View / Account Summary tile view
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.

### SCR-211: Tickets Dashboard
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders (tiles/counters/grid); see `screen-state-model.md` §2 for the generic Loading→Success transition. 
- **Navigation flow:** Tile/row selection drills into the corresponding detail screen or module; no linear next/back sequence.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

## Popups (6)

### SCR-057: Prepatched device detection dialog
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Acknowledged action completes; no further state change. 
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Activation type choice (Instant/Normal): We've detected the device at customer's premises with the ComboBox CPE serial no. ALCLF11E0681CPE and ONT serial no. ALCLF11E0681. Verify that the device's serial number matches the one provided above. Proceed with Instant Activation?

### SCR-075: Connection Details Popup
- **User actions:** none
- **Success flow:** Acknowledged action completes; no further state change. Evidenced output: Prepaid/Postpaid connection counts; link to Show Postpaid Plan Details; Continue/Cancel decision
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.

### SCR-076: CAF Dropdown (Digital/Manual/Touch Screen)
- **User actions:** CAF type selection
- **Success flow:** Acknowledged action completes; no further state change. Evidenced output: generated CAF PDF
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-135: Completion popup (MNP order confirmation)
- **User actions:** Finish Process click
- **Success flow:** Acknowledged action completes; no further state change. Evidenced output: navigates away from wizard
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.

### SCR-167: Order Validation dialogs
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Acknowledged action completes; no further state change. 
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Drop Order action: If without Order Approval Any user try to Drop the Order the below error will appear

### SCR-171: B2B2C override confirm dialog
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Acknowledged action completes; no further state change. 
- **Navigation flow:** Transient overlay triggered by a parent-screen action; dismissed via OK/Close, returning focus to the parent screen.
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Special Management override confirm: Appears when Account already carries a Special Management value

## Pages (13)

### SCR-002: PowerApps Bulk Adjustment Portal (Current State)
- **User actions:** Excel upload
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: offline-approved adjustments
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

### SCR-003: Statement of Account (SOA) View
- **User actions:** account/service identifier
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: one line per bill, payments, adjustments, allocations
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

### SCR-004: Bill Landing View
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: MRC, VAS, VAT summary; search inside bill (enterprise); unified usage view
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

### SCR-008: EBU Number Portal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: reserved number
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-009: Bulk Activation Control Sheet (Excel Macro, Current State)
- **User actions:** identical plan, account, spend limit, price across batch
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: activated batch
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

### SCR-014: Enterprise Invoice (PDF)
- **User actions:** billed usage/charges/discounts
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: formatted invoice with banner, subtotals, service ID/circuit grouping, tax code/number placeholders
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-015: Enterprise Invoice (Excel)
- **User actions:** CDR data, discount lines
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: sorted CDRs by date/time with number filter, aggregated line items (over 1M limit) with CSV fallback
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-018: GigaHome & OSNtv Subscription Acceptance Form
- **User actions:** Customer Name, Customer QID, Plan Name, Date, Signature
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: signed acceptance record
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

### SCR-023: Orders page
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. 
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-027: Eligibility Web Portal (external)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. 
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-201: RFS Portal
- **User actions:** ZSB address, Karama ID, area search
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. Evidenced output: RFS status, potentials, SLA/cluster (F1-F4), plan/offer recommendations, MSISDN capture, Siebel lead creation
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-207: Contact Portal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. 
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-210: Ticket Homepage
- **User actions:** Fields filled by FL Agents, Complaints Team, or FL Agents (for specific TT types)
- **Success flow:** Renders the module's tile grid / landing content, filtered by the active persona's RBAC entries. 
- **Navigation flow:** Reached via primary/secondary navigation; typically a landing/home page for its module.

## Screens (93)

### SCR-006: Unbilled Usage Screen
- **User actions:** MSISDN (mandatory), date range within current cycle (mandatory)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: unbilled usage listing
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** MSISDN: Mandatory MSISDN + date range (within current cycle) to be enforced; Date range: Must be within current billing cycle

### SCR-007: Account Creation Screen
- **User actions:** name, CR type/ID type, CR number, agent ID, business type, credit limit
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: created account record
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** CR number: Mandatory CR-number search required before account creation; Credit limit: Enterprise has no default credit limit and requires business finance approval

### SCR-011: MS Dynamics Discount Approval Hierarchy Screen
- **User actions:** discount request
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: approved/rejected discount
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-016: Siebel Excel Export (Uncontrolled)
- **User actions:** current tab data
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Excel export file
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-017: Siebel Order Creation Screen (MNP)
- **User actions:** plan, MNP category, porting details, reserved temp MSISDN, attachments
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: created Siebel order
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Scheduled porting date: Porting window Sunday–Thursday 11am–12pm; requests before 10:45am make that day's window; Attachment: MNP form 2-A-D: Under 2 MB; PDF or JPG only; Attachment: donor-registered ID: Under 2 MB; PDF or JPG only; DNO verification type

### SCR-019: CAF (Customer Application Form) tablet signature view
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Highlighted Key T&Cs Section: Content configured by business admin, not agent-selectable
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-020: In-progress journeys list (agent login page)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-022: Agent 360 / Asset summary
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-024: Number Management Portal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Number Category (Free/Paid): Two categories only — free and paid (paid can become free depending on plan)

### SCR-025: Device Installment Portal
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** DOI Eligibility (big data/QID-based): Portal eligibility via "big data" logic on QID; Stock Check/Reservation (WinCash): Stock validated and reserved via WinCash; Installment Breakdown: Target DXP flow: displayed after identity/DOI validation via EDW and product catalog selection

### SCR-026: DXP Product Catalog (target state)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-028: Appointment booking / calendar selection screen
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Appointment Date/Slot: To-be: pre-selects next available date/slot, agent only changes if customer wants different date; bounded by location's SLA cluster (e.g., within 3 days or 1 week)

### SCR-029: Ticket detail screen (public notes / bell icon notifications)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-030: Usage/balance view (agent)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** My Account App Recent Access Indicator: Gap: no such indicator exists today; requirement raised to add it

### SCR-032: CAP Signature Screen
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-033: ZSP Entry Screen
- **User actions:** email, address fields (validated for presence only)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** ZSP entry: presence-only validation (not format) on email/address fields — flagged as data-quality gap
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-034: Address / Service Point Search Screen (KID lookup)
- **User actions:** KID or ZSB search term
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: RFS determination or diversion to FWA journey
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation)

### SCR-036: Checkout Screen (Retail New Postpaid)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-038: Consumer Postpaid CAF (PCA001) Form
- **User actions:** Name, DOB, QID, nationality, email, address, billing method, plan selection, signature
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-039: Consumer Prepaid CAF (PCA001) Form
- **User actions:** Application date, Store/Retailer ID, mobile number, SIM serial, registration type, full name, ID number/expiry, signature
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Valid Qatari ID/RP Number / Passport Number: data-binding gap observed in this build (field displayed literal value 'undefined')
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation), EXC-011 (Mandatory Supplementary Form)

### SCR-040: CRM Open UI Desktop Home Page
- **User actions:** Tile click
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Navigation to selected module
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Connection Details popup (Total Prepaid/Postpaid Connections): Triggers advisory note when Postpaid connections count >=2

### SCR-041: Cross Sales — Contact/QID entry
- **User actions:** Qatari ID
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Contact confirmation + Connection Details popup
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-042: QID Offers grid
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Accept redirects into New Fixed Line journey
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-051: Account Orders view (Account 360)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-052: Sales Order detail — header and Line Items tab
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-053: Siebel Web Call Center Home page (tile grid)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-054: All Person Administration screen
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-059: My Sales Orders / My Pending Approval Orders queue
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-061: Order Approval detail (Attachments / Order Details / Activities / Agents Details tabs)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-065: Oracle Enterprise Manager / Service Bus Message Detail screen
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-066: GigaHome Subscription Acceptance Form (bilingual paper/PDF form)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-071: Backend Sales Order Record (Siebel Order Entry)
- **User actions:** none (view/edit by back office)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Order Type, Status, Fulfillment Status, RFS Status, Credit Limit fields
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-072: Line Items Tab (Order)
- **User actions:** none (attribute values populate from order/device)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: CPE/ONT device attribute confirmation; completion/fulfillment status
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-073: Account Summary (Installed Assets and Orders)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: list of active assets, orders (including abandoned), billing profiles
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-077: New FWA Tile / Home Screen
- **User actions:** tile click
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: navigates to Contact step
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** ZSP entry: presence-only validation (not format) on email/address fields — flagged as data-quality gap

### SCR-086: Line Items > Appointments Sub-tab
- **User actions:** none (view)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: line item statuses
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-087: VFQ Inventory Loading Excel Tool
- **User actions:** Inventory Type, serial, model
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Import result to OFSC
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Inventory Type: Values from a fixed list
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-090: Inventory Management — Non-Serialized Inventory Transfer
- **User actions:** Part search, Add To Transfer List
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Transfer List, transfer completion report
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-092: OFS Activity Details / Start-End Activity
- **User actions:** geolocation, serial numbers, checklist fields, signature, start/end actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: activity status transitions, service activation result
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-093: Serial Number Check Screen (Dual Play)
- **User actions:** CPE Indoor, CPE Outdoor, SIM Card serials
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Service activation request submitted
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** CPE Indoor serial: Validated against inventory; CPE Outdoor serial: Validated against inventory; SIM Card serial: Validated against inventory
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-094: Installation Checklist Screen
- **User actions:** speed test results, Wi-Fi username, timestamps, checkboxes, attachments, signature
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: submitted checklist, Forms Submitted indicator
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Wi-Fi User name's for 2.5G and 5G network (NO password): NO password should be entered
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-095: Customer Portal — Billing Profile / Unbilled Usage / Surepay Bucket View
- **User actions:** none / MSISDN selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: SIM State, balance, data bucket remaining/expiry
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-096: Installed Assets Grid (Account 360, FWA)
- **User actions:** asset row selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: navigation to asset modify screen
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-097: FMS CPE Bundle Configuration / Modify Screen (Equipment tab)
- **User actions:** Indoor Unit Serial Number, IPTV Service Id, CPE Model, MAC Address, VoIP Number
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: configured/modified CPE line item; Modification-type Sales Order generated
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation), EXC-005..010 (SIM/CPE Serial validation)

### SCR-098: Order Line Items > Attributes Tab (Change Audit)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: attribute change history
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-101: Account 360 View (FWA, created)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Account Class/Type/Segment/Status, Billing Profile
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-102: Sales Order Detail (More Info tab)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Order Type, Fulfillment Mode, Price List, Currency
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-103: Catalog Tab
- **User actions:** catalog category selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: selected plan added to order
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-104: Numbers Tab (Order)
- **User actions:** number search/selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: reservation token, number assigned
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-105: UIM Custom Object Summary
- **User actions:** serial number search
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: inventory/assignment/device status
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-106: Order Entry (Backend Order Record)
- **User actions:** none (view)/order actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: order status/fulfillment
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-107: Manager Home Screen (Test Manager)
- **User actions:** tile navigation
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: navigates to Order Approval
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** KID (location identifier the user is moving to): Triggers Fiber-readiness check

### SCR-108: Sales Order Record (Backend, Approved)
- **User actions:** Revise/Validate/Submit/Cancel Order actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: order status
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-110: WFM Activity Details — Admin/Technician View
- **User actions:** tab actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: activity progression
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-001..004 (Address step validation), EXC-011 (Mandatory Supplementary Form)

### SCR-111: End Activity Form
- **User actions:** Activity Remarks, Customer Available dropdown, Customer Signature, Next Activity
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: activity ended
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-112: Contact / Cross Sales Offers Screen (MNP)
- **User actions:** Accept/Interested/Reject/Close actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: offer accepted, journey launched
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-117: Product Promotions admin — More Info tab
- **User actions:** Promotion ID, Type, Payment Type, Effective Dates, Instances
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: promotion configuration
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-118: Product Promotions admin — Bill Limit Mapping / Spend Limit Mapping tab
- **User actions:** SL grid values
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Bill Limit Mapping rows
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Agent Min Value: Used as floor for agent-entered Bill Limit / SL Limit Amount at order time

### SCR-131: Siebel Sales Order screen (MNP)
- **User actions:** toolbar actions
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: order state transitions
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Scheduled porting date: Porting window Sunday–Thursday 11am–12pm; requests before 10:45am make that day's window; Attachment: MNP form 2-A-D: Under 2 MB; PDF or JPG only; Attachment: donor-registered ID: Under 2 MB; PDF or JPG only; DNO verification type

### SCR-132: Order Line Items / Line Item Attributes grid (MNP)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: line item detail view
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-136: Order Entry - header/detail view (MNP)
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: order header detail
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-137: Account Summary
- **User actions:** Pre-approved limit edit; Account/Customer lookup
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: account record update; Account details, Installed Assets grid, Orders grid, Billing Profile grid, Trouble Tickets grid
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-141: Lead Details View
- **User actions:** field edits
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: updated lead status/fields
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Reject Reason Code: shown invalid/empty, outlined red when required and not filled

### SCR-142: My Leads list
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: lead list filtered by owner
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-143: My Created Leads view
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: lead list filtered by creator
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-144: Manage Leads - My Team's Leads
- **User actions:** filters
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: team lead list
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-147: All Leads across Org
- **User actions:** view filter selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: org-wide lead list
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-150: Contact record - Leads sub-tab
- **User actions:** none
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: contact-scoped lead list
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-163: Sales Order detail (back-office, Postpaid)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-164: Assets / Complex Assets view
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-165: Complex Product Runtime Instantiation (customization screen)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-168: Home / Guided Process 'Choose process' screen
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** KID (location identifier the user is moving to): Triggers Fiber-readiness check

### SCR-169: CAF (Customer Application Form) document view (Postpaid HRN)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-011 (Mandatory Supplementary Form)

### SCR-173: Sales Order Line Items screen (Pre-to-Post)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-174: Product configurator (Bill Limit selection, Pre-to-Post)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Bill Limit radio group: Selected value cannot be set lower than the Agent Minimum configured for that Bill Limit product in Product Administration

### SCR-175: Order header / Order detail screen (Pre-to-Post)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-178: Sales Order record screen (Line Items, Pre-to-Post)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-179: Migration Offer tab (Complex Asset List Applet)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-184: Account Activities tab
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-186: Billing Profile grid (account level)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation flow (`Inferred` linkage to `Explicit` field data, name-matched to field-inventory.md — not manually verified per screen):** Bill Profile: One billing account holds exactly one bill profile; multiple services can link to one billing account; Billing Address: Can differ from customer address; Bill Email Recipients (CC): Supports multiple recipients and multiple email types per contact (work/personal); billing profile linked to a contact for traceability; Email Verification Status: Captured as unverified at entry, verified asynchronously via callback before next bill generation

### SCR-194: Sales Order — Line Items tab (New Prepaid)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-195: Global Search
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-196: SIM Swap Queue / Order tasks tab
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-197: Order Approval Queue / Order Activities Queue (Tablet)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-198: All Sales Order screen (with All SIM Swap Orders / All Pending SIM Swap Orders filter)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Error behaviour (`Inferred` linkage to `Explicit` scenario, keyword-matched to exception-catalogue.md — not manually verified per screen):** EXC-005..010 (SIM/CPE Serial validation)

### SCR-199: FDO requests tab (in account summary)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-200: FDO request view icon (homepage)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-202: Account Summary (Account 360, CTI View)
- **User actions:** Account lookup
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Account/contact summary, order/ticket/asset/billing counts, activity timeline
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-203: Asset Summary (CTI View)
- **User actions:** Asset selection
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Recent usage (SMS/Data/Voice/Recharge), balances (Bill Manager, International Minutes), plan/addon list, Next Best Offer banner
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-204: Asset Detail Expanded View
- **User actions:** Asset drill-down from Asset Summary
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Account/Asset/Contact/Bill Detail cards; Get Due Amount, Get Usages, Get RTB, Get Next Best Offer actions
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-206: Contact History Tab
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Activity list with Channel, Description, Status, Comments, Transaction Date, Area, Journey
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).

### SCR-209: Agent Desktop (Journey initiation)
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. 
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

### SCR-212: Ticket Status on VF App
- **User actions:** (not itemized beyond screen purpose — see screens.md)
- **Success flow:** Data loads and renders; any inline edits save via the field-level rules in `field-inventory.md`. Evidenced output: Ticket status
- **Navigation flow:** Reached via primary/secondary navigation (`platform-sitemap.md`) or as a drill-down target from another screen; tab/sub-navigation within the screen where evidenced (e.g. Customer 360's tab set).
- **Validation/Error behaviour:** No screen-specific scenario evidenced beyond the general baseline above — consult `validation-catalogue.md` and `exception-catalogue.md` for the closest analogous rule if implementing this screen.

---

## Coverage summary

- 186 of 213 screens (87%) have specific field-level validation detail layered on (from `field-inventory.md`).
- 57 of 213 screens (27%) match a specific evidenced negative-scenario exception (from `exception-catalogue.md`'s 11 FWA scenarios).
- All 213 screens have a generic, screen-type-driven behavior baseline (`Inferred` from `reusable-patterns.md`).

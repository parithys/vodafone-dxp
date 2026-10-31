# MNP Port-In - requirement coverage

Source: `VFQ_Mobile_MNP_PORTIN_PORTOUT_V1.1.xlsx` (`vfq-diagram-engine/BRSD/`). It is the only version in the repository; there is no V0.1.
Scope here is **Port-In**. Port-Out (DOI outstanding, Port-Out ticket stamping) is not built.

## Built in this change

| BRSD | What the app does | Where |
|---|---|---|
| BR-MNP-013, SEQ_024, Annex_02 | A submitted request is **Pending NPAS Approval**; the order, the NPAS request (Pending Approval) and the tracking record (In Progress) each carry their own status. Nothing is activated until NPAS answers. | `engines/portInEngine.ts`, `submitMnpOrder.ts` |
| BR-MNP-027, SEQ_031, DF-MNP-053, OI-MNP-012..014 | NPAS approval records the **Confirmed Port-In Date and window**: that working day's 11:00-12:00 when approval comes before the cut-off, else the next working day's. Working days are Sunday-Thursday, in Qatar time (UTC+3). | `data/portInRules.ts` |
| BR-MNP-019, SEQ_025/026, OI-MNP-006 | NPAS rejection: order Rejected -> Completed Rejected -> Closed, tracking record **Cancelled**, reserved SIM **Released** (BR-MNP-025), customer notified with the donor's reason. All 13 donor reason codes. | `portInEngine.rejectPortIn` |
| Annex_02 | Agent/customer cancel while Pending NPAS Approval -> Cancelled; transitions limited to those the model permits. | `portInEngine.cancelPortIn`, `ORDER_NEXT` |
| BR-MNP-026, SEQ_027/028, DF-MNP-051 | **Quick Draft** from a cancelled order (cancelled outright, or closed after a rejection): a new draft with a new order reference, source order kept as lineage and left Cancelled. Copies customer, billing, product and MNP details only; SIM, signed form, CAF and eligibility are not copied, and the journey runs again from Customer Identification so everything is reviewed and re-validated. | `portInEngine.quickDraftValues`, `PortInStatusScreen.tsx` |
| CAP-44, INT-MNP-020 | **Port-In Status** screen (SCR-136): list, and a request's status, NPAS reference, SLA deadline, confirmed date, rejection reason, history and notifications. Reached from Mobile Services > Plans & Numbers > Port-In Status and from the confirmation page. | `PortInStatusScreen.tsx`, feature `mnp.port-in-status` |
| SEQ_012, DF-MNP-010..015 | Donor details are **captured**: customer ID, ID type (QID, Passport, GCC ID, Diplomatic ID), customer type, operator, subscription type, optional scheduled Port-In date (working day only). They were fixed read-only text before. | `DonorDetailsStep.tsx` |
| SEQ_014, BR-MNP-007, DF-MNP-009 | The Port-In number is validated and normalised to `974` + 8 digits (Qatar mobile: starts 3, 5, 6 or 7). Refused when already on Vodafone's inventory or when another request for it is awaiting NPAS. The order carries the normalised number. | `portInRules.normalizePortInNumber` |
| SEQ_018/019, DF-MNP-025/026 | The **MNP Form** is generated from the journey data with a unique form number, shown for review, then signed. Generation is blocked while mandatory data is missing; changing that data later regenerates the form and clears the signature. The signed flag and form number are stored on the request. | `DonorAttachmentStep.tsx` |
| SEQ_022 | The submission carries the Port-In indicator, number, donor details, scheduled date and signed form reference. | `submitMnpOrder.ts` |
| SEQ_026 / NOT_01 | Submission and cancellation notifications are recorded (simulated as Sent). | `portInEngine` |
| BR-MNP-009, CVC | **Checkout** step and **validation gate**: customer, eligibility, billing profile (postpaid only), plan, SIM and port-in/donor details, each shown Done or with a Fix button back to its step. Continue stays off until all pass. At submission the gate is re-checked with the signed MNP Form, signed CAF and the payment; an incomplete journey is refused. | `MnpCheckout.tsx`, `mnpValidationGate.ts` |
| BR-MNP-011, PAY | **Payment** step after the CAF. Amount due is the sum of port-in charge, deposit and (postpaid HRN) advance payment. With nothing due, a **zero-value receipt** is issued instead of a WinCash handoff. Amount, method and receipt number are stored on the request and shown on the confirmation. | `paymentStep({ zeroValueReceipt })`, `WinCashPaymentStep.tsx` |
| BR-MNP-008, BR-MNP-025 | The Vodafone **SIM is reserved** against the order at submission (stock status Reserved, linked to the order) and stays inactive until NPAS approves. The SIM scanner refuses a Reserved SIM for any other order. NPAS rejection or cancellation **releases** it back to its previous stock status. A SIM taken since it was scanned stops the submission. | `submitMnpOrder.ts`, `portInEngine.simRelease`, `SimSerialScanner.tsx` |
| BR-MNP-024 | **Outstanding-dues check** for a port-in (Eligibility, product scope): dues above a configured threshold stop the port-in. **No threshold is defined** in the BRSD (the rule is Open), so none is assumed and the check does not restrict yet; it states the amount it did not act on. | `eligibilityEngine.ts`, `PORT_IN_DUES_THRESHOLD_QAR` |

Tests: `tests/mnpPortIn.test.mjs` (28), plus the updated MNP tests in `tests/newConnection.test.mjs`.

## Decisions to confirm

- **Dues threshold (BR-MNP-024)**: undefined, so the check is in place but inert. Set `PORT_IN_DUES_THRESHOLD_QAR` in `data/portInRules.ts` once VFQ Collections Policy gives the figure.
- **Port-in charges**: DF-MNP-027 lists a Port-In fee, deposit and advance payment but gives no fee or deposit amount, so `PORT_IN_FEE_QAR` and `PORT_IN_DEPOSIT_QAR` are 0 and the HRN advance is the only amount that can be due. A prepaid pack price is not collected at port-in (the BRSD does not say it is).
- **Step order**: Checkout, MNP Form, CAF, Payment, Activity (BRSD #8-#10). The Pending Payment order status of Annex_02 is not persisted: the journey is a draft until submitted.
- **Cut-off time (BR-MNP-027)** is "configured" in the BRSD and no time is given. `PORT_IN_CUTOFF` is a placeholder of 10:00 (before the 11:00 window opens).
- **Public holidays (OI-MNP-014)** are set up by the team a day ahead; none are known, so `PUBLIC_HOLIDAYS` is empty.
- **Donor operator** offers Ooredoo and Other Licensed Operator. DF-MNP-013 also lists Vodafone, but BR-MNP-001 is a port-in from *another* operator.
- **Donor ID types** now include Diplomatic ID (DF-MNP-011); the earlier list excluded it on workshop evidence.
- **Rejection message**: the BRSD lists reasons but no separate customer-facing wording (OI-MNP-006), so the reason text is the message.
- **NPAS is simulated.** "Simulate NPAS response" on the status screen stands in for approval/rejection (demo control, hidden when `VITE_SHOW_DEMO=false`). NPAS reference numbers are stand-ins.
- **B2B2C** postpaid orders (not in the BRSD) stay Submitted for manager approval and are sent to NPAS after it.
- The seeded requests were moved to the TO-BE model: no temporary MSISDN (BR-MNP-021), the AS-IS "conditional accept" status removed. Their port-in numbers are seed values.

## Still not built

| BRSD | Gap |
|---|---|
| BR-MNP-024 | The dues **threshold value** (see above). |
| BR-MNP-008 | The SIM reservation is a status on the app's SIM stock record; the UIM reservation call (INT-MNP-007) is not wired. |
| BR-MNP-011 | WinCash is the existing hand-off (simulated return); no real WinCash call. |
| OI-MNP-003 | Whether a number is an active, portable subscription at the donor is NPAS's to say (open); it comes back as a rejection (codes 6, 10, 12). |
| SEQ_029..035, BR-MNP-014..018 | After approval: UIM inventory creation, SIM association, activation, provisioning, activation status back to NPAS, billing, completion notification. The request stops at NPAS Approved with its confirmed window. |
| OI-MNP-005 | NPAS status list for system mapping (open). |
| Port-Out | DOI outstanding calculation and Port-Out ticket stamping. |

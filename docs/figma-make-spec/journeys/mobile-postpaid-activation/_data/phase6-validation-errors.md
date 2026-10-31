# Phase6 Validation Errors

Consolidated from Phase 2 per-screen extraction files (screen-01 through screen-15). Each block below is sourced verbatim from that screen's own numbered subsection; IDs are globally unique and cross-referenced.


## MPA-SCR-01 Contact — §1.10

See Phase 6 catalogue: MPA-VAL-001 (email format), MPA-VAL-002 (alt phone format). Both are inline, on-change/on-blur, block the wizard-level Continue gate via `isValid` rather than a separate submit-time check.


## MPA-SCR-02 Communication Address — §2.10

**None.** No `MPA-VAL-` ID is assigned by this screen — every field is unvalidated free text (see §2.5's closing note), matching the evidenced Mandatory: No status. This is a deliberate, evidenced state (FLD-523–526), not a gap to be filled by inference.


## MPA-SCR-03 Billing Profile — §3.10

- **MPA-VAL-003 — Card Number.** `tokenizeCard(cardNumber)` strips all non-digit characters and requires at least 12 remaining digits (`BillingAccountStep.tsx:120-122`); on failure, `validateCard()` (called `onBlur`, line 453) sets `cardError` to the exact text **"Enter a valid card number."** (line 266) and clears any `cardLast4`/`cardToken` already on the value. The `Input`'s `error` prop renders this message and switches the field to error-border styling. **Recovery:** re-enter a card number with ≥12 digits and blur again — success clears the error and shows the tokenized-confirmation line (MPA-DP-020).
- **No other field on this screen carries an inline error message.** Every other required-in-context field (Primary Contact, Secondary Contact Name, Street/Area/Building, Preferred Invoice Recipient, Billing Profile Name) is marked only via the shared `Input`/`Select` "required" red `*` suffix (`src/components/primitives/Input.tsx:96-107`, `Select.tsx:129-131`) plus `aria-required`; leaving them blank produces **no per-field inline error text** — the only feedback is that the wizard-level Continue button stays disabled (§3.2), matching the pattern already noted for this journey's other steps.


## MPA-SCR-04 Plan & Add-ons — §4.10

- MPA-VAL-004 — Proof document oversize. Exact message (template-interpolated): `` `${file.name} is ${formatDocSize(file.size)}. The limit is 5 MB.` `` (`PostpaidPlanAddonsStep.tsx:299`). Size formatted as `"{n.n} MB"` above 1 MB, else `"{n} KB"` rounded (`formatDocSize`, `:108-111`). Recovery: choose a different file via "Browse…" again; the rejected file is never stored.
- MPA-VAL-005 — Bill Limit below agent minimum. Exact message (template-interpolated, from `ruleEngine.ts:30`): `` `Entries above the Agent Minimum value (QR ${agentMinimum}) allow the journey to proceed - QR ${limitAmount} is below it.` `` Shown below the editor once Apply is clicked with a failing amount; `onBillLimitChange(amount, false)` also sets `values.billLimitPass = false`, which blocks Continue per §4.2. Recovery: re-open "Edit Bill Limit", raise the value to ≥ the minimum, Apply again.
- No inline format validator was found in source for the Supporting ID text field itself (checked `PostpaidPlanAddonsStep.tsx` in full) — its "Required" state is enforced only insofar as the component's own comment states the order cannot be *finalised* without it; it does **not** appear in this step's `isValid` (`NewPostpaidWizard.tsx:350` gates only on `productId` and `billLimitPass`), so leaving it blank does not block Continue at this step. Documented as an open point, not inferred as blocking.


## MPA-SCR-05 Number Selection — §5.10

No screen-level validation exists on this step beyond the Continue gate itself (`Boolean(values.msisdn)`) — every listed card is selectable with no disabled/error state, since only `AVAILABLE` or self-owned `Reserved` rows are ever shown (`:222-246`, component's own comment). The Manual MSISDN Entry validators (`isValidMsisdn`, reservation-cap error, already-taken error) exist in source (`:198-220`, `:604-617` approx.) but are **never reachable in this journey** since `allowManualEntry={false}` prevents that form from ever rendering here — not documented as MPA-VAL items for this screen because the code path is unreachable, not because it is undocumented.


## MPA-SCR-06 SIM Type — §6.10

- MPA-VAL-006 — SIM Serial required. Exact message: `"SIM Serial is required."` (`SimSerialScanner.tsx:71`). Triggered on blur with an empty field (and only when `suppressValidation` is false). Recovery: enter or scan a serial.
- MPA-VAL-007 — Serial not found. Exact message: `"SIM not found in this store's stock."` (`:83`, and reused at `:108` for the "no available SIM to scan" branch). Recovery: try a different serial, or use the barcode scan which self-selects an available one.
- MPA-VAL-008 — Serial already assigned. Exact message: `"This SIM is already assigned."` (`:88`). Recovery: enter a different, unissued serial.
- No dedicated error path exists for the eSIM button beyond its own disabled-while-issuing state — no failure branch (e.g. "issuance failed") was found in `generateEsim()`; it always succeeds after the simulated delay.


## MPA-SCR-07 Checkout — §7.10

None. This screen has no editable fields and no `isValid` gate beyond the constant `true` (§7.2) — it is a pure read-back of upstream state.


## MPA-SCR-08 CAF & Signature — §8.10

- MPA-VAL-009 — *"Enter a label for this document before uploading."* (`AdditionalDocumentsUpload.tsx:54`) — shown if a file is somehow submitted with an empty/whitespace label; in practice the Browse button is already disabled in that state (`disabled={!label.trim()}`, line 122), so this message is a defence-in-depth path rather than the primary block. Recovery: type a label, then Browse.
- MPA-VAL-010 — *"{fileName} is {size}. The limit is 5 MB per file."* (`AdditionalDocumentsUpload.tsx:58`) — shown when the selected file exceeds `MAX_FILE_BYTES` (5 MB). Recovery: pick a smaller file.
- MPA-VAL-011 — *"Maximum of 10 documents reached. Remove one to upload another."* (`AdditionalDocumentsUpload.tsx:103`) — replaces the upload row entirely once `documents.length >= MAX_DOCUMENTS` (10). Recovery: remove an existing document first.
- No validation message exists for the signature/CAF-type gate itself — its behaviour is entirely the `isValid` predicate of §8.2/MPA-BR-029, which is silent (Continue is simply enabled or disabled, with no inline error text either way).


## MPA-SCR-09 Payment — §9.10

This step has no field-level validation (§9.5) — its "errors" are step-level outcome states with fixed, non-editable recovery actions:
- MPA-VAL-012 — Decline message, verbatim: *"WinCash declined the authorization. Retry the same amount, or take payment by another method."* Recovery: click "Retry in WinCash" (MPA-BTN-09-002). "Take payment by another method" is stated in the message but **there is no in-app alternate-payment-method control on this step** — it is guidance for the agent to act on outside this screen, not a button.
- MPA-VAL-013 — Session-expiry message, verbatim: *"Your DXP session timed out while you were completing this payment in WinCash. If the payment actually went through there, confirm it below to record it and continue - otherwise, try again."* Recovery: two explicit choices (MPA-BTN-09-006/007), both genuine forward paths rather than a dead end — the code's own comment states this was a deliberate 2026-09-28 request ("show a clear recovery/error state").


## MPA-SCR-10 Order Confirmation — §10.10

No field-level validation exists on this screen — every value is a read-only display, and the eSIM email address is not editable here (§10.5, MPA-FLD-10-009).
- MPA-VAL-014 — Closest thing to a validation message: the unverified-email warning, verbatim: *"This email could not be verified against the customer's ID record, so eSIM details cannot be sent to it."* **No recovery action exists on this screen** — the only way to fix an unverified email is to correct it at the Contact step (MPA-SCR-01), which is no longer reachable once the order has been submitted and this terminal screen is showing. The agent's only options are to relay the eSIM details another way (verbally, via the visible QR/code) or resolve the email/ID mismatch through a separate process outside this journey.


## MPA-SCR-11 Abandon Confirmation Modal — §11.10

None — no inputs to validate.


## MPA-SCR-12 Eligibility Checks Drawer — §12.10

None.


## MPA-SCR-13 Billing Profile Setup Drawer — §13.10

Save-button disablement is the only validation surfaced (no separate inline error message for an empty Profile Name — the button simply stays disabled).


## MPA-SCR-14 Signature Pad Drawer — §14.10

No explicit inline validation message found; the gate is structural (Continue disabled at the wizard level until `signatureDataUrl` is present).


## MPA-SCR-15 Plan Details Drawer — §15.10

None — no inputs.

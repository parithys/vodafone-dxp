
// Building blocks for the New Connection journey. Everything here is a
// journey-level decision (who the customer is, which offer, which service);
// the fulfilment steps themselves reuse the shared patterns directly.

/** An identity that resolves to a customer record is ALWAYS an existing customer - including one with no
 * active lines or services. Nothing is announced for it any more (the "Existing customer" toast was
 * removed 2026-10-04): the status shows through the rest of the journey. Kept as a component so its call
 * sites need no change. */
export function CustomerStatusBanner(_props: { customerId: string | undefined }) {
  return null;
}

// ---------------------------------------------------------------- Customer type

// ---------------------------------------------------------------- Eligibility outcomes

// Reference view of what each eligibility outcome covers: the blockers that
// produce it and the message the agent sees. The rows are the REAL checks - each
// one comes from evaluateEligibilityChecks run over a sample customer that
// trips just that check - so this cannot drift from what the engine says.
// The QR amount in the collections message is sample data.

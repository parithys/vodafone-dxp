// A submitted order must carry the eligibility result of the customer it is for. The result is never carried over from a saved draft (the customer's status
// may have changed since), so an order submitted from a resumed draft that skipped Customer Verification has none - and without it the approval routing
// (line cap, ID type, collections) and the customer id are silently missing from the order. Submit refuses instead, and says how to fix it.

export const ELIGIBILITY_NOT_CHECKED = 'The customer\'s eligibility has not been checked. Return to Customer Verification to check it, then continue.';

/** Throws unless the draft values hold an eligibility result for an identified customer. */
export function assertEligibilityChecked(values: Record<string, unknown>): void {
  const e = values.eligibility as { customerId?: unknown; checks?: unknown } | undefined;
  if (!e || !Array.isArray(e.checks)) throw new Error(ELIGIBILITY_NOT_CHECKED);
}

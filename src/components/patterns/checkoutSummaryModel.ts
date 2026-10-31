export interface Product {
  productId: string;
  name: string;
  mrcQAR: number;
  /** The plan's own Star Number entitlement limit, where it defines one - see starEntitlementQar. */
  starNumberEntitlementQar?: number;
  /** Plan lock-in, straight off the catalogue row. */
  commitmentMonths?: number;
  /** Add-on data allowance, where the catalogue carries one (2026-09-28) -
   * optional because none of the seeded Add-on products currently do
   * (International 50 is minutes-only), but an add-on that does gets its
   * allowance read back here rather than only its price. */
  dataAllowanceGB?: number | null;
}

/**
 * Star-number lock-in, banded by the number's one-time price. Real catalogue
 * data (public/mock-data/star-number-tiers.json) - a premium number carries its
 * own commitment independent of the plan's, and the 2026-09-27 walkthrough asks
 * for both on the read-back.
 */
export interface StarNumberTier {
  tierId: string;
  valueRangeMin: number;
  valueRangeMax: number;
  lockInDurationMonths: number;
}

export interface CheckoutTotals {
  dueTodayQar: number;
  monthlyRecurringQar: number;
  hrnAdvanceQar: number;
  /** The Star number's upfront charge before any Waive Off, the waiver chosen and the amount it waived. */
  numberChargeQar?: number;
  numberWaiver?: number;
  numberWaivedQar?: number;
}

/**
 * Raw order facts for the CAF step's dynamic T&C bullets (2026-09-28) -
 * separate from `onSummaryComputed`'s label/value rows, which are already
 * formatted for display ("Plan 12 months - Star number 24 months") and so
 * cannot be substituted back into a wording template without re-parsing a
 * sentence. These are the same underlying numbers, published as numbers.
 */
export interface TncLegalFacts {
  planCommitmentMonths?: number;
  starLockInMonths?: number;
  discountName?: string;
  discountDurationMonths?: number | null;
  hrnAdvanceQar: number;
}

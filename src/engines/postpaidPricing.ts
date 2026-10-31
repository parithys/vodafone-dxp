/**
 * Monthly pricing for a postpaid order: one itemisation, consumed by every
 * surface that shows or stores it.
 *
 * WHY THIS EXISTS. The same arithmetic was written three times - in the Plan &
 * Add-ons summary, in the Checkout read-back, and in NewPostpaidWizard's
 * onSubmit - and the three had already drifted. Checkout omitted the discount
 * entirely, so a 15% loyalty discount on a QAR 750 plan showed the agent QAR
 * 800/mo for an order the wizard then created at 687.50: the customer was
 * quoted a price their order did not carry. One of the three also rounded and
 * the others did not, so the itemised rows failed to sum to their own total.
 *
 * Adding VAT was what made a shared module unavoidable rather than merely
 * tidy: a tax visible on one surface and absent from the other two is the same
 * bug again, with a bigger number attached.
 */

/**
 * Qatar VAT, as a rate.
 *
 * ASSUMED, NOT EVIDENCED. Requested at 5% on 2026-09-26. No document in the
 * corpus states a VAT rate, or whether postpaid charges are quoted inclusive
 * or exclusive of it, or how it applies to a device instalment - which is a
 * financing arrangement rather than a service charge and may well be treated
 * differently. Logged in
 * reference/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md rather
 * than left implied here.
 */
export const VAT_RATE = 0.05;

// The HRN advance payment (BR-112: driven by nationality and sales channel) is configured in hrnConfiguration.ts - hrnAdvanceQar().

/**
 * Free/Star price boundary, exclusive on the Free side (raised 2026-09-30 from
 * QAR 1,000 to QAR 1,500 - numbers below this are free to the customer).
 * Centralised here rather than living only in MsisdnPicker.tsx, because
 * CheckoutSummaryStep needs the SAME threshold to decide whether a number is
 * a Star number at all (isStarNumber) - a number under this price gets plain
 * "no lock-in" treatment, never a star-tier lock-in or an entitlement
 * calculation, in both places.
 */
export const FREE_NUMBER_PRICE_CEILING_QAR = 1500;

/**
 * Star-number entitlement multiplier - BR-115 ("Star number entitlement by
 * plan value": a plan's MRC entitles the customer to a star number worth up
 * to MRC x this multiplier at no extra one-time charge; a pricier number is
 * billed only the DELTA above that entitlement, not its full sticker price).
 * BR-115's own worked example (a 200 QAR plan entitles ~5,000 QAR of star
 * number) is the source of the 25x figure - confirmed 2026-09-28 as the
 * ratio to implement over a competing 50x figure that surfaced in the same
 * request, so this is the one place that choice lives.
 */
export const STAR_NUMBER_ENTITLEMENT_MULTIPLIER = 25;

/** The free-number entitlement is quoted as a round figure: to the nearest QAR 500 (QAR 2,875 reads QAR 3,000). One rule for the stated limit and for the charge above it. */
export const roundedEntitlementQar = (qar: number): number => Math.round(qar / 500) * 500;

/** The one-time charge for a star number after BR-115's entitlement is
 * applied - zero if the number is within what the plan already entitles,
 * otherwise only the amount above it. Never negative. */
export function starNumberOverageQar(
  planMrcQar: number,
  numberPriceQar: number,
  entitlementQar: number = roundedEntitlementQar(planMrcQar * STAR_NUMBER_ENTITLEMENT_MULTIPLIER)
): number {
  // Demo: the upfront charge is always a whole QAR amount (no fils).
  return Math.max(0, Math.round(numberPriceQar - entitlementQar));
}

/**
 * A plan's Star Number entitlement limit. A plan defines it with an optional
 * `starNumberEntitlementQar` on its catalogue row (products.json); a plan that does
 * not falls back to the MRC x STAR_NUMBER_ENTITLEMENT_MULTIPLIER rule above, so no
 * existing plan changes. A Star Number priced at or below the limit costs nothing
 * extra; above it the customer pays the difference (starNumberOverageQar).
 */
export function starEntitlementQar(plan: { mrcQAR: number; starNumberEntitlementQar?: number }): number {
  return roundedEntitlementQar(plan.starNumberEntitlementQar ?? plan.mrcQAR * STAR_NUMBER_ENTITLEMENT_MULTIPLIER);
}

export interface MonthlyChargeInput {
  /** Plan monthly recurring charge. */
  planQar: number;
  /**
   * The discount's stored rate, e.g. -0.15. Sign is ignored - see the note on
   * `discountQar` below.
   */
  discountRate?: number;
  addonsQar?: number;
  /** Device-on-instalment monthly amount, when one was taken. */
  installmentQar?: number;
}

export interface MonthlyCharges {
  planQar: number;
  /**
   * What the discount is worth in riyals, as a POSITIVE magnitude to be
   * subtracted.
   *
   * Derived with Math.abs rather than the `plan * (1 + rate)` form this
   * replaced. Every seeded Discount row stores a negative rate, and that form
   * silently depended on it: a row entered as +0.15 would have ADDED 15% in
   * the wizard while the two display surfaces subtracted it. Subtracting a
   * magnitude cannot invert whichever sign the catalogue happens to use.
   */
  discountQar: number;
  addonsQar: number;
  installmentQar: number;
  /** Charges before tax. */
  netQar: number;
  vatQar: number;
  /** netQar + vatQar. What the customer pays monthly. */
  totalQar: number;
}

/** The bill limit a plan starts with: its monthly charge, but never above the credit limit (the bill limit cannot exceed it). */
export const defaultBillLimitQar = (planMrcQar: number, creditLimitQar: number | undefined): number =>
  creditLimitQar === undefined ? planMrcQar : Math.min(planMrcQar, creditLimitQar);

/** Two decimal places, the smallest unit these figures are quoted in. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * VAT is rounded BEFORE the total is derived from it, so the itemised rows add
 * up to the total exactly as displayed. Rounding only at the end let 5% of
 * 687.50 print as 34.38 beside a total computed from 34.375, leaving a column
 * of figures that does not sum to its own last line - which is worse than
 * showing no breakdown at all, because it invites the agent to check it.
 */
export function monthlyCharges(input: MonthlyChargeInput): MonthlyCharges {
  const planQar = input.planQar;
  const discountQar = round2(planQar * Math.abs(input.discountRate ?? 0));
  const addonsQar = input.addonsQar ?? 0;
  const installmentQar = input.installmentQar ?? 0;
  const netQar = round2(planQar - discountQar + addonsQar + installmentQar);
  const vatQar = round2(netQar * VAT_RATE);
  return {
    planQar,
    discountQar,
    addonsQar,
    installmentQar,
    netQar,
    vatQar,
    totalQar: round2(netQar + vatQar),
  };
}

/**
 * Riyals, with decimals only where the figure has any.
 *
 * A percentage discount produces halves (15% of 750 is 112.50) while the rest
 * of the catalogue is whole, so a blanket 2dp would print "QAR 750.00" on
 * every plan to accommodate one row.
 */
export { formatQar } from '../lib/format';

/**
 * The FIRST invoice, distinct from the recurring monthly charge that starts
 * from the second one.
 *
 * EVIDENCED WORDING, ASSUMED CYCLE DAY. Four independent CAF/guided-journey
 * documents (consumer-postpaid-caf-v4, both MNP-postpaid walkthroughs, the
 * Pre-to-Post desktop walkthrough) all carry the same disclaimer: "your first
 * month's charges will be prorated, plus the full charge of your plan for the
 * following month." That sentence is the evidence for the SHAPE of a first
 * bill - a prorated part-month plus one full month charged in advance. As of
 * 2026-10-07 the quoted first bill is the prorated part-month ONLY (an explicit
 * request: the first bill must be lower than the second, full-month one), so
 * the advance month is no longer added to `totalQar`.
 *
 * What it does not supply is a billing-cycle day for a BRAND NEW connection.
 * billing-profiles.json shows every value from 1 to 12 across four existing
 * accounts, with no rule for what a new activation is assigned - and this
 * journey creates no billing profile of its own (orders.json's billingProfileId
 * is null on every seeded order). Defaulting the cycle to the 1st of each
 * calendar month is this function's own assumption, not a business rule -
 * chosen because it is the one value already present in two of those four
 * seeded profiles, and it is the only cycle boundary that needs no per-customer
 * data this journey has never collected. Logged in
 * reference/VFQ_DXP_Postpaid_Activation_Open_Questions_Reference.md rather
 * than left implied here.
 *
 * `asOf` is injected, matching eligibilityEngine's evaluateEligibilityChecks -
 * the proration is a pure function of the activation date, not of the clock
 * inside this file, so it stays testable against a fixed date.
 */
export interface FirstBillCharges {
  /** Charge for the partial first cycle, from activation to month end. */
  proratedQar: number;
  /** Days of service counted in that partial cycle, inclusive of today. */
  proratedDays: number;
  /** Days in the calendar month activation falls in - what proratedDays is a fraction of. */
  cycleDays: number;
  /** The first bill: the prorated part-month only, so it is always below the second (full-month) bill. */
  totalQar: number;
}

export function firstBillCharges(recurring: MonthlyCharges, asOf: Date): FirstBillCharges {
  const cycleDays = new Date(asOf.getFullYear(), asOf.getMonth() + 1, 0).getDate();
  const proratedDays = cycleDays - asOf.getDate() + 1;
  const proratedQar = round2((recurring.totalQar * proratedDays) / cycleDays);
  return {
    proratedQar,
    proratedDays,
    cycleDays,
    totalQar: proratedQar,
  };
}

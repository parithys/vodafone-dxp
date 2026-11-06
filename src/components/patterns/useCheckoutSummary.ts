import { appliedDiscountFor, discountedAddon, type AddonDiscount, type AppliedAddonDiscounts } from '../../engines/addonDiscounts';
import { addonChargeNowQar, addonOneTimeQar, addonWithBillingChoice, type AddonBillingFrequency } from '../../engines/addonCategories';
import { chargeAfterWaiverQar, waivedQar, type NumberWaiver } from '../../engines/numberWaiver';
import { hrnAdvanceQar } from '../../engines/hrnConfiguration';
import { usePersonaStore } from '../../stores/personaStore';
import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { monthlyCharges, firstBillCharges, FREE_NUMBER_PRICE_CEILING_QAR, starNumberOverageQar, starEntitlementQar as planStarEntitlementQar } from '../../engines/postpaidPricing';
import type { EligibilityResult } from '../domain/eligibilityTypes';
import type { SimTypeValue } from '../domain/SimTypeStep';
import type { Product, StarNumberTier, CheckoutTotals, TncLegalFacts } from './checkoutSummaryModel';
import { buildCafSummaryRows, insertRowsAfter } from './checkoutSummaryRows';

interface UseCheckoutSummaryArgs {
  customerName: string | undefined;
  productId: string | undefined;
  discountId: string | undefined;
  addonIds: string[];
  addonBilling?: Record<string, AddonBillingFrequency>;
  /** The add-on discounts the agent applied (see engines/addonDiscounts.ts): each add-on is charged after its discount. */
  addonDiscounts?: AppliedAddonDiscounts;
  msisdn: string | undefined;
  numberPriceQar: number | undefined;
  eligibility: EligibilityResult | undefined;
  /** The credit limit in force for the order's new account (the agent's choice, else the default); when absent the default applies. */
  creditLimitQar?: number;
  simType: SimTypeValue | undefined;
  /** The Waive Off chosen on Number Selection, when one was. */
  numberWaiver?: NumberWaiver;
  onTotalsComputed: (totals: CheckoutTotals) => void;
  onSummaryComputed?: (rows: { label: string; value: string }[]) => void;
  onLegalFactsComputed?: (facts: TncLegalFacts) => void;
  /** Rows the order adds to the CAF's key information, after the plan (see insertRowsAfter). */
  extraRows?: { label: string; value: string }[];
  /** The plan's rental is included in a Family Package the customer already pays for (Primary Line 2): nothing is added to the monthly total for it. */
  planRentalIncluded?: boolean;
}

export type CheckoutSummaryDerived = ReturnType<typeof useCheckoutSummary>;

// Catalogue reads, the shared pricing derivation and the three publish-
// upward effects (totals, legal facts, customer-facing summary rows) for the
// Checkout step. Hook order is exactly the original component's.
export function useCheckoutSummary({
  customerName,
  productId,
  discountId,
  addonIds,
  addonBilling = {},
  addonDiscounts,
  msisdn,
  numberPriceQar,
  eligibility,
  creditLimitQar: creditLimitOverride,
  simType,
  numberWaiver,
  onTotalsComputed,
  onSummaryComputed,
  extraRows,
  onLegalFactsComputed,
  planRentalIncluded = false,
}: UseCheckoutSummaryArgs) {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<
    { addonDiscountId: string; name: string; price: number; durationMonths: number | null }[]
  >([]);
  const [starTiers, setStarTiers] = useState<StarNumberTier[]>([]);
  const [addonDiscountRecords, setAddonDiscountRecords] = useState<AddonDiscount[]>([]);

  useEffect(() => {
    mockDataEngine.list<Product>('products').then(setProducts);
    mockDataEngine
      .list<{ addonDiscountId: string; name: string; price: number; durationMonths: number | null }>(
        'addons-discounts'
      )
      .then(setDiscounts);
    mockDataEngine.list<StarNumberTier>('star-number-tiers').then(setStarTiers);
    mockDataEngine.list<AddonDiscount>('addon-discounts').then(setAddonDiscountRecords);
  }, []);

  const listedPlan = products.find((p) => p.productId === productId);
  const plan = listedPlan && planRentalIncluded ? { ...listedPlan, rentalIncludedInPackage: true } : listedPlan;
  const addons = products
    .filter((p) => addonIds.includes(p.productId))
    // The chosen billing frequency's price, then the add-on's applied discount off it.
    .map((addon) => discountedAddon(addonWithBillingChoice(addon, addonBilling[addon.productId]), appliedDiscountFor(addonDiscountRecords, addonDiscounts, addon)));
  const discount = discounts.find((d) => d.addonDiscountId === discountId);
  // The number's own sticker price - kept separate from what is actually
  // CHARGED (numberChargeQar below), so "Star value QAR 5000 one-time" can
  // still be read back in full even when BR-115's entitlement covers most or
  // all of it.
  const numberDelta = numberPriceQar ?? 0;
  // By the customer's HRN category and the agent's persona (hrnConfiguration.ts).
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const hrnAdvance = eligibility?.requiresHrnAdvance ? hrnAdvanceQar({ nationality: eligibility.nationality, personaId }) : 0;
  // A number priced at or above FREE_NUMBER_PRICE_CEILING_QAR is a Star
  // number; anything below it is "free to the customer" (2026-09-28
  // direction), regardless of its exact catalogue price - the picker already
  // encodes this same boundary, so Checkout reads the identical threshold
  // rather than drifting from it with its own `> 0` cutoff.
  const isStarNumber = numberDelta >= FREE_NUMBER_PRICE_CEILING_QAR;
  const starTier = isStarNumber
    ? starTiers.find((t) => numberDelta >= t.valueRangeMin && numberDelta <= t.valueRangeMax)
    : undefined;
  // BR-115: the plan's MRC entitles the customer to a star number worth up to
  // MRC x 25 with no extra one-time charge - only the amount ABOVE that
  // entitlement is actually billed. Falls back to the full sticker price when
  // there is no plan yet to derive an entitlement from (shouldn't happen in
  // practice - Plan & Add-ons runs before Number Selection - but this avoids
  // a NaN entitlement rather than assuming the order of steps holds forever).
  const starEntitlementQar = plan ? planStarEntitlementQar(plan) : undefined;
  const numberChargeQar = isStarNumber && plan ? starNumberOverageQar(plan.mrcQAR, numberDelta, planStarEntitlementQar(plan)) : numberDelta;
  // Waive Off (Number Selection) takes all or half of the number's upfront charge off what is paid today.
  const numberWaivedQar = waivedQar(numberChargeQar, numberWaiver);
  const numberPayableQar = chargeAfterWaiverQar(numberChargeQar, numberWaiver);
  // A one-time add-on is paid at activation, with the number charge and the HRN advance.
  const dueTodayQar = numberPayableQar + hrnAdvance + addons.reduce((sum, a) => sum + addonOneTimeQar(a, addonBilling[a.productId]), 0);
  // "Maximum Bill Limit equals account Credit Limit" (business-rules.json).
  // This journey dropped its Bill Limit editor on 2026-09-25, so there is no
  // agent-set value to show - what the customer must be told is the cap, which
  // that rule defines as the credit limit. Stated as a cap, not invented as a
  // figure, because no default bill limit exists in the data for this plan.
  const creditLimitQar = creditLimitOverride ?? eligibility?.defaultCreditLimitQar;
  // One shared itemisation with the Plan step and the order payload - see
  // engines/postpaidPricing.ts. Derived here rather than restated, because
  // this figure is what the agent reads to the customer and the order's is
  // what they are billed, and the two diverging is exactly the bug this
  // module was extracted to end.
  const charges = monthlyCharges({
    planQar: plan?.rentalIncludedInPackage ? 0 : plan?.mrcQAR ?? 0,
    discountRate: discount?.price,
    addonsQar: addons.reduce((sum, a) => sum + addonChargeNowQar(a, addonBilling[a.productId]), 0),
  });
  const monthlyRecurringQar = charges.totalQar;
  // The first INVOICE, distinct from dueTodayQar (paid at the counter today)
  // and from monthlyRecurringQar (the exact figure from month two onward).
  // See firstBillCharges' own note for the evidenced shape and the assumed
  // cycle day it depends on. new Date() here, not injected: this is app
  // runtime rendering for an agent at the counter right now, not a workflow
  // script - "today" IS the activation date being priced.
  const firstBill = firstBillCharges(charges, new Date());

  useEffect(() => {
    onTotalsComputed({ dueTodayQar, monthlyRecurringQar, hrnAdvanceQar: hrnAdvance, numberChargeQar, numberWaiver: numberWaivedQar > 0 ? numberWaiver : undefined, numberWaivedQar });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueTodayQar, monthlyRecurringQar, hrnAdvance, numberChargeQar, numberWaiver, numberWaivedQar]);

  useEffect(() => {
    if (!onLegalFactsComputed || !plan) return;
    onLegalFactsComputed({
      planCommitmentMonths: plan.commitmentMonths,
      starLockInMonths: isStarNumber ? starTier?.lockInDurationMonths : undefined,
      discountName: discount?.name,
      discountDurationMonths: discount?.durationMonths,
      hrnAdvanceQar: hrnAdvance,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.commitmentMonths, isStarNumber, starTier?.lockInDurationMonths, discount?.name, discount?.durationMonths, hrnAdvance]);

  // Customer-facing rows for the CAF step's "Key Information" panel - the
  // screen the CUSTOMER actually reviews before signing, distinct from the
  // agent-only <dl> below. Only published once the catalogue reads have
  // landed, so that panel never shows a summary with "-" where a plan name
  // belongs. (Row content: see buildCafSummaryRows.)
  const extraRowsKey = extraRows?.map((r) => `${r.label}=${r.value}`).join('|');
  useEffect(() => {
    if (!onSummaryComputed || !plan) return;
    onSummaryComputed(
      insertRowsAfter(buildCafSummaryRows({
        plan,
        customerName,
        msisdn,
        simType,
        discount,
        addons,
        isStarNumber,
        numberDelta,
        starTier,
        starEntitlementQar,
        numberChargeQar,
        numberWaiver,
        numberWaivedQar,
        dueTodayQar,
        hrnAdvance,
        firstBill,
        monthlyRecurringQar,
        charges,
      }), 'Plan Price', extraRows)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customerName,
    plan?.productId,
    discount?.addonDiscountId,
    discount?.durationMonths,
    addons.length,
    msisdn,
    numberDelta,
    dueTodayQar,
    numberWaiver,
    monthlyRecurringQar,
    starTier?.tierId,
    simType?.simType,
    simType?.simSerial,
    simType?.simIccid,
    extraRowsKey,
  ]);

  return {
    plan,
    addons,
    discount,
    numberDelta,
    hrnAdvance,
    isStarNumber,
    starTier,
    starEntitlementQar,
    numberChargeQar,
    numberWaiver,
    numberWaivedQar,
    numberPayableQar,
    dueTodayQar,
    creditLimitQar,
    charges,
    monthlyRecurringQar,
    firstBill,
  };
}

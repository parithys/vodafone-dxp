import { isFreeAddon, type CategorisedAddon } from './addonCategories';

// A discount on an ADD-ON (not on a plan): the Apply Discount action of the postpaid Add-ons page. A discount record (addon-discounts.json) states the add-ons it is eligible on
// (`appliesToAddons`, by product id) and a percentage off the add-on's charge - eligibility is what the record says, never read from an add-on's name or category. An add-on that
// is free is never discounted. No supporting document is needed. The agent's choice is kept per add-on (`addonDiscounts`: add-on product id -> discount id).

export interface AddonDiscount {
  addonDiscountId: string;
  name: string;
  description: string;
  /** The percentage taken off the add-on's charge (10 = 10%). */
  percent: number;
  /** How many months it runs; null / absent when the record gives none. */
  durationMonths?: number | null;
  appliesToAddons: string[];
}

/** The agent's choices: add-on product id -> the add-on discount applied to it. */
export type AppliedAddonDiscounts = Record<string, string>;

/** The discounts an add-on is eligible for: those that name it, and none at all for a free add-on. */
export function discountsForAddon(discounts: readonly AddonDiscount[], addon: CategorisedAddon & { productId: string }): AddonDiscount[] {
  if (isFreeAddon(addon)) return [];
  return discounts.filter((d) => d.appliesToAddons.includes(addon.productId));
}

/** The discount applied to this add-on, if the choice is still valid (the add-on is eligible for it). */
export function appliedDiscountFor(discounts: readonly AddonDiscount[], applied: AppliedAddonDiscounts | undefined, addon: CategorisedAddon & { productId: string }): AddonDiscount | undefined {
  const id = applied?.[addon.productId];
  return id ? discountsForAddon(discounts, addon).find((d) => d.addonDiscountId === id) : undefined;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** The add-on as charged after the discount: its charge (and each billing option's, and the introductory price) reduced by the percentage. Unchanged without one. */
export function discountedAddon<T extends CategorisedAddon>(addon: T, discount: Pick<AddonDiscount, 'percent'> | undefined): T {
  if (!discount) return addon;
  const keep = 1 - discount.percent / 100;
  return {
    ...addon,
    mrcQAR: round2(addon.mrcQAR * keep),
    introPriceQAR: addon.introPriceQAR === undefined ? undefined : round2(addon.introPriceQAR * keep),
    billingOptions: addon.billingOptions?.map((o) => ({ ...o, priceQAR: round2(o.priceQAR * keep) })),
  };
}

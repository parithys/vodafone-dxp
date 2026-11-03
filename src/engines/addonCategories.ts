import { formatQar } from '../lib/format';
// The Add-ons page's two levels of navigation: the add-on CATEGORY (Local Data, Local Minutes, International, Roaming, Combo, Others) and the
// Free / Paid FILTER, which applies to the category selected. Both are read from the add-on's own record: `addonCategory` (stated on every add-on in
// products.json) and its `pricing`: Free is an add-on stated as included with a plan, Paid every other (a QAR price, or a price the catalogue
// words as TBC / plan-based). An add-on without `pricing` is Free only when priced QAR 0. Nothing is guessed from a name or a description.

export const ADDON_CATEGORIES = ['Local Data', 'Local Minutes', 'International', 'Roaming', 'Combo', 'Others'] as const;
export type AddonCategory = (typeof ADDON_CATEGORIES)[number];

/**
 * The extra tab on the Add-ons page: not a category but a view across them - the add-ons that are frequently taken by customers like this one.
 * An add-on says so in an optional `frequentlyUsedFor` block on its record in products.json (nothing is inferred from its name or description):
 *   "frequentlyUsedFor": { "nationalities": ["Indian"], "plans": ["PROD-104"] }
 * Like `eligibility`, every condition present must hold and one left out places no restriction. A record with no block, or an empty one, is never
 * listed here, so an add-on only appears under Frequently Used when the business has stated it. It stays in its own category tab too.
 */
export const FREQUENTLY_USED_TAB = 'Frequently Used';
export type AddonTab = AddonCategory | typeof FREQUENTLY_USED_TAB;
export interface FrequentlyUsedRule {
  /** The customer's nationality exactly as the customer record states it (e.g. "Indian"). */
  nationalities?: string[];
  /** The selected plan's productId. */
  plans?: string[];
}
export interface FrequentlyUsedContext {
  planId?: string;
  nationality?: string;
}
export function isFrequentlyUsed(addon: { frequentlyUsedFor?: FrequentlyUsedRule }, ctx: FrequentlyUsedContext): boolean {
  const rule = addon.frequentlyUsedFor;
  const nationalities = rule?.nationalities ?? [];
  const plans = rule?.plans ?? [];
  if (nationalities.length === 0 && plans.length === 0) return false;
  // An unknown nationality or plan cannot be shown to satisfy a condition that names one.
  if (nationalities.length > 0 && !(ctx.nationality && nationalities.some((n) => n.toLowerCase() === ctx.nationality!.trim().toLowerCase()))) return false;
  if (plans.length > 0 && !(ctx.planId && plans.includes(ctx.planId))) return false;
  return true;
}

export type AddonPricing = 'free' | 'paid';
export const ADDON_PRICING_FILTERS: { key: AddonPricing; label: string }[] = [
  { key: 'paid', label: 'Paid' },
  { key: 'free', label: 'Free' },
];
/** The filter the page opens on: Paid, where nearly every add-on is (Free holds only the add-ons included with a plan). */
export const DEFAULT_ADDON_PRICING: AddonPricing = 'paid';

/**
 * How an add-on is charged. Free: for every customer ('free-all'), only with the plans it names ('free-with-plan'), or for the first
 * INTRO_MONTHS months and then at its standard monthly price ('free-first-3'). Paid: the standard price from activation ('standard'), or a
 * discounted introductory price for the first INTRO_MONTHS months and then the standard price ('intro-discount'). The standard price is the
 * record's `mrcQAR`; the introductory price is its `introPriceQAR`.
 */
export type AddonPricingModel = 'free-all' | 'free-with-plan' | 'free-first-3' | 'standard' | 'intro-discount';
export const INTRO_MONTHS = 3;

/** How often an add-on is charged. Absent on a record means monthly recurring - what a postpaid add-on is by default. */
export type AddonBillingFrequency = 'monthly' | 'weekly' | 'one-time';
export interface AddonBillingOption {
  frequency: AddonBillingFrequency;
  priceQAR: number;
}
const WEEKS_PER_MONTH = 52 / 12;

export interface CategorisedAddon {
  /** Stated on the record when it is not monthly. */
  billingFrequency?: AddonBillingFrequency;
  /** Explicit alternatives when the agent may choose how often this add-on is billed. */
  billingOptions?: AddonBillingOption[];
  pricingModel?: AddonPricingModel;
  /** The discounted monthly price of the first INTRO_MONTHS months ('intro-discount'). */
  introPriceQAR?: number;
  mrcQAR: number;
  addonCategory?: string;
  /** The customers this add-on is frequently taken by; see FREQUENTLY_USED_TAB. */
  frequentlyUsedFor?: FrequentlyUsedRule;
  /** 'free': included with a plan. 'paid': anything else. Omitted: Free only when priced QAR 0. */
  pricing?: 'free' | 'paid';
}

/** The effective catalogue row after applying an allowed billing-frequency choice. Invalid/stale choices fall back to the catalogue default. */
export function addonWithBillingChoice<T extends CategorisedAddon>(addon: T, choice?: AddonBillingFrequency): T {
  const option = addon.billingOptions?.find((candidate) => candidate.frequency === choice);
  return option ? { ...addon, billingFrequency: option.frequency, mrcQAR: option.priceQAR } : addon;
}

/** One availability definition for every addon surface: an offer needs a usable price and must not be discontinued. */
export function isAddonAvailable(addon: CategorisedAddon & { priceLabel?: string; addonStatus?: string }): boolean {
  const priced =
    isFreeAddon(addon) ||
    Boolean(addon.billingOptions?.some((option) => Number.isFinite(option.priceQAR) && option.priceQAR > 0)) ||
    (Number.isFinite(addon.mrcQAR) && addon.mrcQAR > 0) ||
    Boolean(addon.priceLabel && /QR\s*\d/i.test(addon.priceLabel));
  return priced && !/discontinued/i.test(addon.addonStatus ?? '');
}

/**
 * The category an add-on is listed under: the one its record states. "Others" is the named bucket for an add-on whose record states none of the
 * five categories, so no add-on drops out of the page.
 */
export function addonCategoryOf(a: CategorisedAddon): AddonCategory {
  return (ADDON_CATEGORIES as readonly string[]).includes(a.addonCategory ?? '') ? (a.addonCategory as AddonCategory) : 'Others';
}

/** Free: stated as included with a plan (or, with no statement, priced QAR 0). */
export const isFreeAddon = (a: CategorisedAddon): boolean =>
  a.pricingModel ? a.pricingModel.startsWith('free') : a.pricing ? a.pricing === 'free' : a.mrcQAR === 0;

/**
 * What an add-on costs per month in Months 1-INTRO_MONTHS - what the first bills carry: nothing for a free model and for 'free-first-3', the
 * introductory price for 'intro-discount', the standard price otherwise. (From Month INTRO_MONTHS + 1 it is `mrcQAR`.)
 */
export function addonChargeNowQar(addon: CategorisedAddon, choice?: AddonBillingFrequency): number {
  const a = addonWithBillingChoice(addon, choice);
  switch (a.pricingModel) {
    case 'free-all':
    case 'free-with-plan':
    case 'free-first-3':
      return 0;
    case 'intro-discount':
      return a.introPriceQAR ?? a.mrcQAR;
    default:
      // One-time: paid at activation (addonOneTimeQar), nothing monthly. Weekly: the price of a week, 52/12 weeks to a month.
      return a.billingFrequency === 'one-time' ? 0 : a.billingFrequency === 'weekly' ? Math.round(a.mrcQAR * WEEKS_PER_MONTH * 100) / 100 : a.mrcQAR;
  }
}

/**
 * How an add-on is charged, as the label under its name: what its record states (`billingFrequency`), else 'Recurring Monthly' for a postpaid add-on
 * (its price is the record's monthly recurring charge, `mrcQAR`) and 'One-time' for a prepaid pack (priced once). An add-on stated as included with
 * a plan for everyone carries no charge, so it has no charging type: undefined, never guessed.
 */
export type AddonChargeType = 'One-time' | 'Recurring Weekly' | 'Recurring Monthly';
export function addonChargeType(addon: CategorisedAddon, source: 'catalogue' | 'prepaid' = 'catalogue', choice?: AddonBillingFrequency): AddonChargeType | undefined {
  const a = addonWithBillingChoice(addon, choice);
  if (a.pricingModel === 'free-all' || a.pricingModel === 'free-with-plan') return undefined;
  if (a.billingFrequency === 'weekly') return 'Recurring Weekly';
  if (a.billingFrequency === 'one-time') return 'One-time';
  return source === 'prepaid' ? 'One-time' : 'Recurring Monthly';
}

/** An add-on charged once is paid at activation, not added to the monthly bill. */
export const addonOneTimeQar = (addon: CategorisedAddon, choice?: AddonBillingFrequency): number => {
  const a = addonWithBillingChoice(addon, choice);
  return a.billingFrequency === 'one-time' ? a.mrcQAR : 0;
};

/** What the card says about the price: the figure, and the line that qualifies it (when it is not simply the monthly price). */
export interface AddonPriceDisplay {
  primary: string;
  secondary?: string;
}

/** The price wording of an add-on with a pricing model; undefined for a record that states none (the card then keeps its own wording). */
export function addonPriceDisplay(addon: CategorisedAddon, choice?: AddonBillingFrequency): AddonPriceDisplay | undefined {
  const a = addonWithBillingChoice(addon, choice);
  const then = `then ${formatQar(a.mrcQAR)}/month from Month ${INTRO_MONTHS + 1}`;
  switch (a.pricingModel) {
    case 'free-all':
      return { primary: 'Free' };
    case 'free-with-plan':
      return { primary: 'Free', secondary: 'Included with the selected plan' };
    case 'free-first-3':
      return { primary: 'Free', secondary: `for Months 1\u2013${INTRO_MONTHS}, ${then}` };
    case 'intro-discount':
      return { primary: formatQar(a.introPriceQAR ?? a.mrcQAR), secondary: `for Months 1\u2013${INTRO_MONTHS}, ${then}` };
    case 'standard':
      // A plain monthly price has nothing to qualify; a weekly or one-time charge says so.
      return { primary: formatQar(a.mrcQAR), ...(a.billingFrequency === 'weekly' ? { secondary: 'per week' } : a.billingFrequency === 'one-time' ? { secondary: 'one-off charge' } : {}) };
    default:
      return undefined;
  }
}

/** The add-ons of one category, narrowed by the Free / Paid filter. */
export function addonsFor<T extends CategorisedAddon>(addons: readonly T[], category: AddonCategory, pricing: AddonPricing): T[] {
  return addons.filter((a) => addonCategoryOf(a) === category && (pricing === 'free' ? isFreeAddon(a) : !isFreeAddon(a)));
}

/** How many of the chosen add-ons sit in each category (both Free and Paid), for the category tabs. */
export function selectedPerCategory<T extends CategorisedAddon & { productId: string }>(addons: readonly T[], selectedIds: readonly string[]): Record<AddonCategory, number> {
  const out = Object.fromEntries(ADDON_CATEGORIES.map((c) => [c, 0])) as Record<AddonCategory, number>;
  for (const a of addons) if (selectedIds.includes(a.productId)) out[addonCategoryOf(a)] += 1;
  return out;
}

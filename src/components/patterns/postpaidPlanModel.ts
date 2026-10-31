export const CHECK = 'M20 6L9 17l-5-5';

// Small Levenshtein distance for typo-tolerant ranking - the app has no fuzzy-
// search dependency, and plan names are short enough that a plain O(n*m) DP
// table is cheap.
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Closest-match suggestions for the type-ahead dropdown (2026-09-28): a
// prefix or substring hit ranks first (score 0/1) exactly like the list
// filter below it; anything else ranks by edit distance so a mistyped plan
// name ("Postpaid Re 550") still surfaces its nearest neighbour instead of an
// empty dropdown.
export function closestPlans<T extends { name: string }>(query: string, plans: T[], limit = 5): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return plans
    .map((p) => {
      const name = p.name.toLowerCase();
      const score = name.startsWith(q) ? 0 : name.includes(q) ? 1 : 2 + levenshtein(q, name) / Math.max(q.length, name.length);
      return { plan: p, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((r) => r.plan);
}

export interface PostpaidPlan {
  productId: string;
  name: string;
  type: string;
  mrcQAR: number;
  dataAllowanceGB: number | null;
  minutesAllowance: string;
  speedTier: string;
  /** Contract term. On every seeded plan; surfaced only in the details
   * drawer, since it is the one figure the cards have no room for. */
  commitmentMonths?: number;
  popular?: boolean;
  /** Listed on the Offers tab (without necessarily carrying the Popular badge). */
  offer?: boolean;
  /** False keeps a plan in the catalogue (existing orders, discounts, assets) but out of the plan picker. */
  listed?: boolean;
  /** A nationality promotion: offered only to customers of these nationalities (see isPlanOfferedTo). Omitted: offered to everyone. */
  eligibleNationalities?: string[];
  /** Promotional price: `mrcQAR` is charged for `promoMonths` months, then `originalMrcQAR`. */
  originalMrcQAR?: number;
  promoMonths?: number;
  /** Plan facts to list on the card, in order, instead of the ones derived from the allowance fields. */
  features?: string[];
  /** Speed and Fair Usage Policy lines for the plan's details drawer. */
  fup?: string[];
  /** Free bundles/benefits included with the plan (2026-09-28 request) -
   * app-level demo data, no evidenced per-plan benefits field existed before
   * (see products.json's own note on these entries). */
  benefits?: string[];
  /**
   * True for a plan that already comes with its add-ons/discount decided
   * (2026-09-28 "pre-bundled eligible offers"). Selecting one auto-advances
   * past the rest of THIS step straight to Number Selection - see
   * NewPostpaidWizard's autoAdvanceWhen on the 'plan' step, which is where
   * that skip actually happens; this component only renders a note saying so.
   */
  preBundledOffer?: boolean;
  /** Postpaid Voice Plans or Postpaid Broadband Plans, by the plan's primary focus (see PLAN_CLASS_TAG). Absent: the plan has no class on record. */
  planClass?: string;
}

export interface Discount {
  addonDiscountId: string;
  addonType: string;
  name: string;
  description: string;
  price: number;
  category: string;
  /** How many months the discount runs; absent or null when the catalogue gives none. */
  durationMonths?: number | null;
  planId: string;
}

export interface AddonProduct {
  productId: string;
  name: string;
  type: string;
  mrcQAR: number;
}

/**
 * Discount types that require a supporting ID here, before finalisation (no proof document is collected at this step; CAF has a
 * signed-paperwork upload of its own, which is a different artefact). Exported so NewPostpaidWizard's
 * pendingApproval computation reads the SAME set rather than duplicating the
 * two literal strings.
 */
export const SUPPORTING_ID_DISCOUNT_TYPES = new Set(['MADA Discount', 'B2B2C Discount']);


/**
 * The three offer groups, renamed 2026-09-28 to "Today's Special Promotions",
 * "Offers for this QID" and "Standard BAU Catalogue" per that day's request -
 * this only relabels the three groups introduced 2026-09-27; membership is
 * still DERIVED from catalogue data, not a new hand-maintained field:
 * `popular` already exists on products.json and already drove the POPULAR
 * badge, and commitmentMonths is the only other commercial axis the catalogue
 * carries. So:
 *
 *   Today's Special Promotions - flagged `popular` in the catalogue
 *   Offers for this QID        - carries a commitment (the plans a discount attaches to)
 *   Standard BAU Catalogue     - everything else
 *
 * Deliberately derived rather than invented: no per-QID offer-eligibility
 * field exists in the corpus (eligibilityEngine.ts computes customer
 * eligibility outcomes - age, ID type, and the like - not plan-level offer
 * matching), and adding one would have meant assigning every plan to a group
 * by guesswork. If the business later supplies a real per-QID offer feed,
 * this is the one function to change.
 */
/** 'special' is the contextual Special Discount tab (MADA / Retired / B2B2C): not a catalogue group, it lists the plans that carry the customer's accepted discount. */
export type PlanGroupKey = 'specials' | 'for-you' | 'standard' | 'special';

export const PLAN_GROUPS: { key: PlanGroupKey; label: string }[] = [
  { key: 'specials', label: 'Offers' },
  { key: 'for-you', label: 'Standard Plans' },
  { key: 'standard', label: 'Standard BAU Catalogue' },
];

/** The one name of the special-discount tab, whichever of the three types the customer holds (the type itself is not shown). */
/** The classes of postpaid plan (the plan's `planClass`): decided by what the plan is primarily for, never by whether it has minutes or data. */
export const PLAN_CLASS_TAG = {
  'Postpaid Voice Plans': 'postpaid-voice',
  'Postpaid Broadband Plans': 'postpaid-broadband',
  'Postpaid Family Plans': 'postpaid-family',
} as const;
export type PlanClass = keyof typeof PLAN_CLASS_TAG;
export const isPlanClass = (v: unknown): v is PlanClass => typeof v === 'string' && v in PLAN_CLASS_TAG;

/** The plan-type filter under the Offers / Plans tabs: All Plans, or one class (the plan's `planClass`). A plan with no class shows under All Plans only. */
export type PlanTypeFilter = 'all' | PlanClass;
export const PLAN_TYPE_FILTERS: { key: PlanTypeFilter; label: string }[] = [
  { key: 'all', label: 'All Plans' },
  { key: 'Postpaid Voice Plans', label: 'Voice Plan' },
  { key: 'Postpaid Broadband Plans', label: 'Broadband Plan' },
  { key: 'Postpaid Family Plans', label: 'Family Plan' },
];
export const matchesPlanType = (p: { planClass?: string }, filter: PlanTypeFilter): boolean => filter === 'all' || p.planClass === filter;

export const SPECIAL_OFFERS_TAB_LABEL = 'Special Offers';

/** The Offers tab lists at most this many offers (the demo catalogue holds exactly this many, so it always shows six). */
export const OFFERS_TAB_LIMIT = 6;

export const SPECIAL_DISCOUNT_TYPE: Record<'mada' | 'b2b2c' | 'retired', { addonType: string; /** How the discount is named to the agent (the Customer Verification card label). */ label: string }> = {
  mada: { addonType: 'MADA Discount', label: 'MADA' },
  b2b2c: { addonType: 'B2B2C Discount', label: 'Consumer B2B2C' },
  retired: { addonType: 'Retired Discount', label: 'Retiree' },
};

/** A plan's name on the Special Offers tab: led by the Special Discount it is offered under ("Retiree Postpaid Plus Essential Promotion"), unless the name already starts with it. */
export function specialOfferPlanName(name: string, discount: 'mada' | 'b2b2c' | 'retired' | 'none' | undefined): string {
  if (!discount || discount === 'none') return name;
  const label = SPECIAL_DISCOUNT_TYPE[discount].label;
  return name.toLowerCase().startsWith(label.toLowerCase()) ? name : `${label} ${name}`;
}

/** The addon types that are a Special Discount (MADA / B2B2C / Retired): one is held by the customer, chosen at Customer Verification. */
export const SPECIAL_DISCOUNT_ADDON_TYPES: ReadonlySet<string> = new Set(Object.values(SPECIAL_DISCOUNT_TYPE).map((t) => t.addonType));

/** Every Special Discount (Consumer B2B2C, Retiree, MADA) takes this fraction off the plan fee, whichever the type: the catalogue rows all carry it. */
export const SPECIAL_DISCOUNT_RATE = 0.25;

/** The label every Special Discount card carries on the plan step: the rate, not the customer's own type (only that they hold one). */
export const SPECIAL_DISCOUNT_CARD_TITLE = `Special Discount ${Math.round(SPECIAL_DISCOUNT_RATE * 100)}%`;

/**
 * The Special Discount to select by itself on the Add-ons and Discounts page: the plan's discount of the type the customer holds, once that type is
 * validated (accepted evidence for Retiree / MADA, a supported company for B2B2C). Undefined when no Special Discount applies to this customer or
 * this plan has none - Eligible Discounts then stays on "No Discount", its default.
 */
export function specialDiscountToPreselect<T extends { addonType: string }>(discounts: readonly T[], benefit: 'mada' | 'b2b2c' | 'retired' | 'none' | undefined): T | undefined {
  if (!benefit || benefit === 'none') return undefined;
  return discounts.find((d) => d.addonType === SPECIAL_DISCOUNT_TYPE[benefit].addonType);
}

/**
 * The discounts to offer once the Special Discount chosen at Customer Verification is known: of the three special types only that one
 * stays (a customer holds one); for a Standard customer ('none': no Special Discount chosen, or the benefit rejected) none of the three is offered,
 * so a Special Discount card is never shown without a validated Consumer B2B2C, Retiree or MADA behind it. Every other discount (Loyalty, ...) is
 * untouched. `chosen` undefined = this journey has no such choice: the list is returned as it is.
 */
export function discountsForSpecialType<T extends { addonType: string }>(discounts: T[], chosen: keyof typeof SPECIAL_DISCOUNT_TYPE | 'none' | undefined): T[] {
  if (!chosen) return discounts;
  if (chosen === 'none') return discounts.filter((d) => !SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType));
  const keep = SPECIAL_DISCOUNT_TYPE[chosen].addonType;
  return discounts.filter((d) => !SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType) || d.addonType === keep);
}

/** What a discount card says under its title: the catalogue's own wording, then how long it runs when the catalogue says so. A Special Discount is a fixed rate with no duration shown. */
export function discountDescription(d: { addonType: string; description: string; durationMonths?: number | null }): string {
  if (SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType) || !d.durationMonths) return d.description;
  return `${d.description} for ${d.durationMonths} ${d.durationMonths === 1 ? 'month' : 'months'}`;
}

/**
 * The mid-priced plan of a list: the median by monthly price (ties and an even count take the lower middle; equal prices keep catalogue order via
 * the product id). It is the plan Standard Plans and Special Offers mark Popular and show first. Undefined for an empty list.
 */
export function midPricedPlan<T extends { productId: string; mrcQAR: number }>(plans: T[]): T | undefined {
  if (plans.length === 0) return undefined;
  const sorted = [...plans].sort((a, b) => a.mrcQAR - b.mrcQAR || a.productId.localeCompare(b.productId));
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

/** Discounts listed from the smallest to the largest (by the share they take off); equal ones keep their catalogue order. */
export const discountsAscending = <T extends { price: number }>(discounts: T[]): T[] => [...discounts].sort((x, y) => Math.abs(x.price) - Math.abs(y.price));

/**
 * Whether a plan is offered to a customer of this nationality: a plan that names its eligible nationalities (a nationality promotion) is offered to those
 * only - and, with no nationality known, to nobody, since a restriction cannot be shown to be met; a plan that names none is offered to everyone.
 */
export function isPlanOfferedTo(plan: { eligibleNationalities?: string[] }, nationality: string | undefined): boolean {
  const only = plan.eligibleNationalities;
  if (!only || only.length === 0) return true;
  return Boolean(nationality) && only.some((n) => n.toLowerCase() === nationality!.toLowerCase());
}

/**
 * Whether a plan is chosen on the Offers tab of Offers & Plans: it is in the Offers (specials) group, or flagged a pre-bundled offer. A plan like
 * that comes with its extras, so the journey skips Addons & Discounts and goes on to Number Selection. Decided from the plan itself - not from a
 * value the Plan step writes after the choice - so it holds on a resumed draft and whatever the order of events.
 */
export const isOffersTabPlan = (p: { popular?: boolean; offer?: boolean; commitmentMonths?: number; preBundledOffer?: boolean }): boolean =>
  Boolean(p.preBundledOffer) || planGroupOf(p) === 'specials';

export function planGroupOf(p: { popular?: boolean; offer?: boolean; commitmentMonths?: number }): PlanGroupKey {
  if (p.popular || p.offer) return 'specials';
  if (p.commitmentMonths) return 'for-you';
  return 'standard';
}

/**
 * A plan-group key, or one of this step's other two tabs (2026-09-28 tabbed
 * redesign - replaces the previous single stacked column of plan groups,
 * Add-ons and Eligible Discounts with one tab strip covering all of them).
 * "describe" subtitles the stacked layout used per section are gone: the
 * active tab's own label already names the section, so repeating it as a
 * second line under the tab strip would say the same thing twice.
 */
export type TabKey = PlanGroupKey | 'addons' | 'discounts';

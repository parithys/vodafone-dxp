import { isQatarMobileLocalNumber } from '../primitives/countryDialCodes';

export interface MsisdnRecord {
  msisdn: string;
  category: string;
  status: string;
  priceQAR: number;
  valueTier?: string;
  /** Who holds the reservation, on a Reserved record. */
  reservedBy?: string;
  /** The ID number of the customer the number is reserved for: a reservation belongs to the customer, not to the agent who made it. */
  reservedForQid?: string;
  /** When the reservation was made (ISO), on a Reserved record. */
  reservedAt?: string;
}

/**
 * The three tabs, which do NOT all filter on the same axis - and that is the
 * point rather than an inconsistency.
 *
 * 'Free' and 'Star' are now PRICE BANDS (2026-09-28 direction: "show only
 * numbers priced from QAR 0 up to, but not including, QAR 1,000" under Free -
 * the ceiling itself moved to QAR 1,500 on 2026-09-30), not the stored
 * `category` field - see FREE_NUMBER_PRICE_CEILING_QAR (postpaidPricing.ts)
 * for why this is also a correctness fix, not just a rename: star-number-
 * tiers.json's own lowest tier starts at 1000
 * (STAR-TIER-01, valueRangeMin 1000), so a handful of seeded numbers
 * category='Star' priced 300-900 already matched no tier at all - "Not
 * banded" on a number that was never going to be. Pricing the tabs
 * themselves means those numbers now land where they actually behave: no
 * lock-in, no tier, same as every other number under 1000. 'Reserved' is a
 * STATUS and cuts across both bands, so a reserved Star number appears there
 * rather than falling out of the UI entirely - which is what happened when
 * Reserved numbers were simply hidden.
 */
export type NumberTab = 'Free' | 'Star' | 'Reserved';

export const TAB_LABELS: Record<NumberTab, string> = {
  Free: 'Free Numbers',
  Star: 'Star Numbers',
  Reserved: 'Reserved Numbers',
};

/**
 * Tab ORDER is fixed for every channel as of 2026-09-28: Free, Star,
 * Reserved. This replaces the channel-based order used until then (Retail -
 * Reserved, Star, Free; Tablet/field - Free, Star, Reserved), which existed
 * so a retail agent working a number the customer already held would see it
 * first. That job now belongs to the auto-select-on-load effect below
 * instead of the tab ORDER itself - an agent whose customer holds a reserved
 * number lands on the Reserved tab regardless of channel, while the tabs
 * themselves stay in one predictable order for everyone.
 */
// Reserved, Star, Free (VFQ business, 2026-10-02) - reversing the 2026-09-28 Free, Star, Reserved order.
export const TAB_ORDER: NumberTab[] = ['Reserved', 'Star', 'Free'];

/**
 * The Number Management Portal's own tab order: Star, Free, Reserved. Only the portal uses it; every journey keeps TAB_ORDER above.
 */
export const PORTAL_TAB_ORDER: NumberTab[] = ['Star', 'Free', 'Reserved'];

/** The Retail Sales persona (personas.json ROLE-01): Reserved opens first when numbers are held, and is hidden - Star opens instead - when none are. */
export const RETAIL_SALES_PERSONA_ID = 'ROLE-01';

/**
 * Qatar MSISDNs are stored E.164 (+9743300...) but shown as the bare 8-digit
 * local number: every number in this picker is Qatari, so the country code is
 * the same eleven characters on every row and carries no information the agent
 * is choosing between. Shown as one run of eight digits, never split by a space.
 */
export function toLocalMsisdn(msisdn: string): string {
  const local = msisdn.replace(/[\s-]/g, '').replace(/^\+?974/, '');
  return /^\d{8}$/.test(local) ? local : msisdn;
}

/** How the search box matches a number: All (shown as "All"; value 'any' - no pattern: the number or a value tier), XXYY (repeating pairs), Contains, Starts With, Ends With. */
export type SearchMode = 'any' | 'price' | 'starts' | 'ends' | 'contains' | 'xxyy';

export const SEARCH_MODE_OPTIONS: { value: SearchMode; label: string }[] = [
  { value: 'any', label: 'All' },
  { value: 'price', label: 'Price' },
  { value: 'starts', label: 'Starts With' },
  { value: 'ends', label: 'Ends With' },
  { value: 'contains', label: 'Contains' },
  { value: 'xxyy', label: 'Pattern' },
];

/** The mode the box opens in: no pattern filter. */
export const DEFAULT_SEARCH_MODE: SearchMode = 'any';

/** The bare 8 local digits of a Qatar number (no country code, no spaces). */
export const localDigits = (msisdn: string): string => toLocalMsisdn(msisdn).replace(/\s/g, '');

/** A repeating-pair pattern: 2, 4, 6 or 8 digits, each pair being one digit twice (3344, 1133, 2299, 77224455). */
export function isRepeatingPairs(digits: string): boolean {
  if (!/^\d+$/.test(digits) || digits.length % 2 !== 0 || digits.length > 8) return false;
  for (let i = 0; i < digits.length; i += 2) if (digits[i] !== digits[i + 1]) return false;
  return true;
}

/** Whether the number has an XXYY pattern anywhere: four consecutive digits that are two repeating pairs (3300, 3311, 4488). The same family XXYY search accepts. */
export function hasRepeatingPairPattern(msisdn: string): boolean {
  const d = localDigits(msisdn);
  for (let i = 0; i + 3 < d.length; i++) if (d[i] === d[i + 1] && d[i + 2] === d[i + 3]) return true;
  return false;
}

/**
 * What is wrong with the typed text for the chosen mode, or undefined when it is fine (or empty). Any takes a number or a value-tier name; XXYY,
 * Contains, Starts With and Ends With take digits only, and XXYY must also be repeating pairs. Never more than 8 characters.
 */
export function searchError(text: string, mode: SearchMode): string | undefined {
  const t = text.replace(/[\s,]/g, '');
  if (!t) return undefined;
  // Any takes letters and digits; Price takes no search text at all (its Min Price / Max Price boxes are their own).
  if (mode === 'any' || mode === 'price') return undefined;
  if (!/^\d+$/.test(t)) return 'Enter digits only.';
  if (mode === 'xxyy' && !isRepeatingPairs(t)) return 'Enter repeating pairs of digits, such as 3344 or 77224455.';
  return undefined;
}

/**
 * Whether a number matches the search text in the chosen mode, over the 8-digit local number: Starts With and Ends With match exactly at that end,
 * Contains and XXYY match the typed digits exactly and consecutively anywhere (XXYY's text being a repeating-pair pattern, a full 8 digits finds
 * only that number). Any applies no pattern: typed digits anywhere in the number, or a value-tier name when the text is not digits. Text the mode
 * does not accept matches nothing.
 */
/** The whole figure in a Min Price / Max Price box (digits, a thousands comma allowed), or undefined when the box is empty or not a figure. */
export function priceBound(text: string | undefined): number | undefined {
  const t = (text ?? '').replace(/[\s,]/g, '');
  return /^\d+$/.test(t) ? Number(t) : undefined;
}

/** Whether a price (QAR) lies within the Min Price / Max Price boxes, both ends included; an empty box leaves that end open. */
export function matchesPriceRange(priceQar: number | undefined, minText: string | undefined, maxText: string | undefined): boolean {
  const min = priceBound(minText);
  const max = priceBound(maxText);
  if (min === undefined && max === undefined) return true;
  if (priceQar === undefined) return false;
  return (min === undefined || priceQar >= min) && (max === undefined || priceQar <= max);
}

export function matchesNumberSearch(n: { msisdn: string; valueTier?: string; priceQAR?: number }, text: string, mode: SearchMode): boolean {
  const q = text.trim();
  if (!q) return true;
  const digits = q.replace(/\s/g, '');
  if (searchError(text, mode)) return false;
  // Price has no text: it is filtered by its Min Price / Max Price boxes (matchesPriceRange).
  if (mode === 'price') return true;
  const local = localDigits(n.msisdn);
  if (mode === 'starts') return local.startsWith(digits);
  if (mode === 'ends') return local.endsWith(digits);
  if (/^\d+$/.test(digits)) return local.includes(digits);
  return (n.valueTier ?? '').toLowerCase().includes(q.toLowerCase());
}

/**
 * How many numbers one agent may hold at a time (2026-09-28 direction).
 * Applied to the action that creates a hold, not to selecting one already
 * held - re-picking your own reservation is not a new one.
 */
export const MAX_RESERVATIONS_PER_AGENT = 2;

/** How many numbers are shown at once before Next/Previous: 20, four rows of five (was 10, 2026-10-04). */
export const PAGE_SIZE = 20;
/** Free numbers are compact one-line cards: 20 per page, so the 60 Free Numbers fill 3 pages. */
export const FREE_PAGE_SIZE = 20;

/**
 * Sort orders, offered on Free and Star, NOT Reserved.
 *
 * Both bands now have real price spread to sort by: Star is 1000 and up,
 * and Free (2026-09-28's price-band split moved the 300-900 rows that used
 * to read category='Star' in here) runs 0-999 - no longer the flat QAR 0 list
 * it used to be, so a price sort is no longer a no-op there either. Reserved
 * stays excluded: it is a short held-numbers list an agent scans rather than
 * ranks, capped at MAX_RESERVATIONS_PER_AGENT, where a sort control would
 * answer a question nobody asks of it.
 *
 * Reserved therefore sorts by NUMBER_ASC implicitly, with no control on
 * screen. An earlier revision showed the dropdown everywhere on the
 * reasoning that a control changing its options per tab is hard to trust; the
 * better answer is not to show a control that cannot act.
 */
export type SortKey = 'price-desc' | 'price-asc' | 'number-asc' | 'number-desc';

// Both directions for BOTH keys. Offering "Number: ascending" without its
// descending counterpart made the one key asymmetric against the other - price
// had two directions and number one - so the menu implied number order was
// somehow one-way.
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'number-asc', label: 'Number: Ascending' },
  { value: 'number-desc', label: 'Number: Descending' },
];

/**
 * Free's own sort menu (2026-09-30), number-only - deliberately NOT the same
 * four options Star offers. Every Free number is free to the customer
 * regardless of its catalogue price (see showSort's own note below), so a
 * price sort here would rank rows by a figure the customer never pays -
 * exactly the reasoning that kept Free without a sort control at all until
 * now. Restricted to a subset of SORT_OPTIONS rather than a second literal
 * list, so the wording can never drift from Star's.
 */
/** Star's sort menu: price only (the Free tab keeps the number sorts). */
export const STAR_SORT_OPTIONS = SORT_OPTIONS.filter((o) => o.value === 'price-desc' || o.value === 'price-asc');

export const FREE_SORT_OPTIONS = SORT_OPTIONS.filter((o) => o.value === 'number-asc' || o.value === 'number-desc');

export const SORTERS: Record<SortKey, (a: MsisdnRecord, b: MsisdnRecord) => number> = {
  // Ties broken by number, so a page of equally-priced numbers holds a stable
  // order instead of reshuffling on every render.
  'price-desc': (a, b) => b.priceQAR - a.priceQAR || a.msisdn.localeCompare(b.msisdn),
  'price-asc': (a, b) => a.priceQAR - b.priceQAR || a.msisdn.localeCompare(b.msisdn),
  'number-asc': (a, b) => a.msisdn.localeCompare(b.msisdn),
  'number-desc': (a, b) => b.msisdn.localeCompare(a.msisdn),
};


// ranking, not the alphabet. Values not listed here sort after everything
// that is.

// A full Qatar MSISDN: +974 followed by an 8-digit mobile local number
// (isQatarMobileLocalNumber - same leading-digit rule GuidedContactStep's
// isValidAltPhone uses) - stricter than that general validator since a
// number being reserved here must be a complete, dialable MSISDN with the
// +974 prefix present, not any alternate-contact phone shape.
export function isValidMsisdn(raw: string): boolean {
  const digits = raw.replace(/[\s-]/g, '');
  return digits.startsWith('+974') && isQatarMobileLocalNumber(digits.slice(4));
}

export const STAT_ICONS = {
  wallet: 'M3 6h15a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z M3 6a2 2 0 0 1 2-2h11 M16 13h5',
  tag: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z M7.5 7.5h.01',
  lock: 'M6 11h12v10H6z M8 11V8a4 4 0 0 1 8 0v3 M12 15v2',
};

/** Price ranges for the Star tab's filter (QAR). `max` is inclusive; Infinity is open-ended. */
export interface PriceRange {
  key: string;
  label: string;
  min: number;
  max: number;
}
export const PRICE_RANGES: PriceRange[] = [
  { key: 'under-5000', label: 'Under QAR 5K', min: 0, max: 4999 },
  { key: '5000-9999', label: 'QAR 5K \u2013 9.9K', min: 5000, max: 9999 },
  { key: '10000-24999', label: 'QAR 10K \u2013 24.9K', min: 10000, max: 24999 },
  { key: '25000-50000', label: 'QAR 25K \u2013 50K', min: 25000, max: 50000 },
  { key: 'above-50000', label: 'Above QAR 50K', min: 50001, max: Infinity },
];
export const inPriceRange = (priceQar: number, r: PriceRange) => priceQar >= r.min && priceQar <= r.max;

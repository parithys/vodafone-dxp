import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { ServiceJourney } from '../../capabilities';
import type { ConnectionType } from '../../domain/eligibility';

// New Connection is ONE journey: Customer Verification once, then the product the agent chooses by the customer's intent,
// and that product's steps continue in the same wizard (same draft, same customer lock). This is the product model.

export type ConnectionProduct = 'postpaid' | 'prepaid' | 'fixed-line' | 'mnp';

export const PRODUCTS: { key: ConnectionProduct; label: string; description: string }[] = [
  { key: 'postpaid', label: 'New Postpaid', description: 'A postpaid mobile line with a plan, add-ons, number and SIM.' },
  { key: 'prepaid', label: 'New Prepaid', description: 'One or more prepaid SIMs with a starter pack, paid for today.' },
  { key: 'fixed-line', label: 'New Fixed Line', description: 'Home broadband (fibre) or 5G Home, with an installation appointment.' },
  { key: 'mnp', label: 'New MNP', description: 'Port a number in from another operator onto a postpaid or prepaid plan.' },
];

export const productLabel = (p: ConnectionProduct | undefined) => PRODUCTS.find((x) => x.key === p)?.label;

export type MnpType = 'postpaid' | 'prepaid';

/**
 * The four home products. They are the choices of New Home Connection's Product Selection (and, under New Fixed Line, of
 * New Connection's). All four run the Fixed Line steps; which Installation Address service type (Fibre, FWA Indoor, FWA
 * Outdoor) applies to which product is NOT defined in the BRSD or business rules, so no mapping is assumed - the agent
 * still chooses the service type on the Installation Address step.
 */
export type HomeProduct = 'fibre' | 'fixed-line' | 'fwa' | '5g-home';

export const HOME_PRODUCTS: { key: HomeProduct; label: string; description: string }[] = [
  { key: 'fibre', label: 'New Fibre Connection', description: 'A fibre broadband service at the customer\'s address.' },
  { key: 'fixed-line', label: 'New Fixed-Line Connection', description: 'A fixed telephone line.' },
  { key: 'fwa', label: 'New FWA Connection', description: 'A Fixed Wireless Access service.' },
  { key: '5g-home', label: 'New 5G Home Connection', description: 'A 5G home broadband service.' },
];

export const homeProductLabel = (p: HomeProduct | undefined) => HOME_PRODUCTS.find((x) => x.key === p)?.label;

/** The home product an offer names, where the offer says (an offer for "a fixed line" does not say which). */
export const homeProductOfOffer = (j: ServiceJourney | undefined): HomeProduct | undefined => (j === 'new-fwa' ? 'fwa' : undefined);

/** The product each cross-sales offer's journey continues in, inside this wizard. Upgrades have none (they hand off). */
export const PRODUCT_OF_OFFER_JOURNEY: Partial<Record<ServiceJourney, ConnectionProduct>> = {
  'new-postpaid': 'postpaid',
  'new-prepaid': 'prepaid',
  'new-fixed-line': 'fixed-line',
  'new-fwa': 'fixed-line',
  'mnp-postpaid': 'mnp',
  'mnp-prepaid': 'mnp',
};

/** The offer journeys that continue in this wizard (every one that maps to a product). */
export const IN_JOURNEY_OFFERS = Object.keys(PRODUCT_OF_OFFER_JOURNEY) as ServiceJourney[];

/** An offer for MNP names the plan type it ports onto; the wizard keeps that as `mnpType`. */
export const mnpTypeOfOffer = (j: ServiceJourney | undefined): MnpType | undefined => (j === 'mnp-prepaid' ? 'prepaid' : j === 'mnp-postpaid' ? 'postpaid' : undefined);

/**
 * Which eligibility rules judge the chosen product: prepaid has its own (permitted ID types, collections does not stop it,
 * the prepaid line cap); every other product - Postpaid, Fixed Line and an MNP onto a postpaid plan - uses the postpaid ones.
 */
export function eligibilityJourney(values: Record<string, unknown>): 'postpaid' | 'prepaid' {
  const product = values.product as ConnectionProduct | undefined;
  return product === 'prepaid' || (product === 'mnp' && values.mnpType === 'prepaid') ? 'prepaid' : 'postpaid';
}

/** The line the product adds, for the line-count rules: Fixed Line is Fixed/FWA; MNP is the mobile line of the plan type it ports onto. */
export const connectionOf = (values: Record<string, unknown>): ConnectionType =>
  values.product === 'fixed-line' ? 'FIXED_FWA' : eligibilityJourney(values) === 'prepaid' ? 'MOBILE_PREPAID' : 'MOBILE_POSTPAID';

/** Whether the product keeps a billing account (a prepaid line has none; MNP onto a prepaid plan has none either). */
/** Whether New Connection's shared Billing Profile step (before Recommended Offers) applies: until a product is chosen, and for a product that has one. */
export const billingStepActive = (values: Record<string, unknown>): boolean => values.product === undefined || hasBillingAccount(values);

export const hasBillingAccount = (values: Record<string, unknown>): boolean =>
  values.product === 'postpaid' || values.product === 'fixed-line' || (values.product === 'mnp' && values.mnpType !== 'prepaid');

/**
 * What a product's steps leave in the draft. Switching product drops all of it, so nothing chosen for the product the agent
 * has left (a plan, number, SIM, a signed CAF, a payment) reaches the next one. Identity, eligibility, customer type, the address, the
 * billing profile and the offers decision are collected before or at the product step, so they stay.
 */
export const PRODUCT_OWNED_KEYS = [
  'productId', 'planTab', 'discountId', 'addonIds', 'addonBilling', 'selectionSource', 'bundledItems',
  'msisdn', 'numberWaiver', 'numberPriceQAR', 'priceQAR', 'numberRefresh', 'prePaired',
  'simType', 'simSerial', 'simValid', 'cart',
  'billLimit', 'billLimitPass',
  'creditCheckPass', 'creditCheckAcknowledged',
  'installation', 'devices', 'appointment',
  'donorDetails', 'donorAttachment', 'comments',
  'checkoutTotals', 'cafSummary', 'legalFacts', 'caf', 'payment',
  'homeProduct', 'actualUser',
] as const;

/** Wraps a product's steps so they are active only while that product is chosen (and, for each, its own `skip` as well). */
export function forProduct(product: ConnectionProduct, steps: WizardStep[]): WizardStep[] {
  return steps.map((s) => ({ ...s, skip: (values: Record<string, unknown>) => values.product !== product || (s.skip?.(values) ?? false) }));
}

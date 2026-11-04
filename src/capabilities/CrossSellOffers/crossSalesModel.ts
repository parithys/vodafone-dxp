import type { OfferProduct } from '../../components/primitives/offerCardParts';
import { planFeatureRows } from '../../components/primitives/offerCardParts';
import { continuesHere } from './serviceJourneys';
import type { OfferJourneys, ServiceJourney } from './serviceJourneys';

export interface CrossSalesValue {
  decision?: 'accepted' | 'declined' | 'none';
  offerId?: string;
  offerName?: string;
  journey?: ServiceJourney;
  linkedProductIds?: string[];
}

export interface Offer {
  offerId: string;
  offerName: string;
  offerDescription: string;
  monthlyRental: number;
  campaignCode: string;
  status: string;
  contactId: string;
  serviceJourney?: ServiceJourney;
  linkedProductIds: string[];
  /** Campaign facts shown only in the details drawer. */
  offerType?: string;
  priorityCode?: string;
  treatmentCode?: string;
  channel?: string;
  promotionId?: string;
  price?: number;
  addOnMonthly?: number;
}

/** Up to four facts about the plan an offer opens, read from the linked product - never typed in here. */
export function offerFeatures(o: Offer, products: Record<string, OfferProduct>) {
  const plan = o.linkedProductIds.map((id) => products[id]).find((p) => p && (p.dataAllowanceGB || p.minutesAllowance || p.speedTierMbps));
  return planFeatureRows(plan);
}

/** The one line the drawer's banner leads with: the linked plan's first free benefit, else its headline allowance. */
export function offerHighlight(o: Offer, products: Record<string, OfferProduct>): { title: string; subtitle: string } | null {
  const plan = o.linkedProductIds.map((id) => products[id]).find((p) => p && (p.benefits?.length || p.dataAllowanceGB || p.speedTierMbps));
  if (!plan) return null;
  const title =
    plan.benefits?.[0] ??
    (plan.speedTierMbps ? `${plan.speedTierMbps} Mbps fibre${plan.iptvIncluded ? ' with IPTV' : ''}` : `${plan.dataAllowanceGB} GB data`);
  return { title, subtitle: `Included with ${plan.name}` };
}

/** Continue is open once the agent has decided (or nothing was offered), except
 * an accepted offer for a journey that continues elsewhere - that has its own button. */
export const isCrossSalesValid = (v: CrossSalesValue | undefined, here: OfferJourneys = 'new-postpaid') =>
  Boolean(v?.decision) && (v?.decision !== 'accepted' || continuesHere(v.journey, here));

// ---------------------------------------------------------------- Standard catalogue

/**
 * Records the decision on the offers in the draft values. Accepting an offer makes its journey and plan the basis
 * for what follows (the first linked plan that exists in `products`); anything else (declining, skipping) clears a
 * previous acceptance, and the discount and add-ons chosen under it.
 */
export function applyCrossSalesDecision(
  setValue: (field: string, value: unknown) => void,
  v: CrossSalesValue,
  products: { productId: string }[]
) {
  setValue('crossSales', v);
  setValue('serviceJourney', v.decision === 'accepted' ? v.journey : undefined);
  const basis = v.decision === 'accepted' ? v.linkedProductIds?.find((id) => products.some((p) => p.productId === id)) : undefined;
  setValue('productId', basis);
  setValue('discountId', undefined);
  setValue('addonIds', []);
}

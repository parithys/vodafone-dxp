import type { Offer } from '../capabilities/CrossSellOffers/crossSalesModel';
import type { OfferTypeKey, ServiceJourney } from '../capabilities/CrossSellOffers/serviceJourneys';

/**
 * The standard offers of Recommended Offers: three for every offer type (two for New Home, which has two home products), shown to an existing customer so
 * no type is ever hidden, whether or not the customer has campaign offers of that type. They are ordinary, selectable offers: each is for a plan in the
 * catalogue (products.json), named and priced as that plan is, and continues in its journey exactly as a campaign offer does. A customer's own campaign
 * offers come first; these fill the rest of the section.
 */
const offer = (type: OfferTypeKey, n: number, serviceJourney: ServiceJourney, productId: string, offerName: string, offerDescription: string, monthlyRental: number): Offer => ({
  offerId: `STD-${type}-${n}`,
  offerName,
  offerDescription,
  monthlyRental,
  campaignCode: 'STANDARD',
  status: 'Offered',
  contactId: '',
  serviceJourney,
  linkedProductIds: [productId],
});

export const STANDARD_OFFERS: Record<OfferTypeKey, Offer[]> = {
  'new-prepaid': [
    offer('new-prepaid', 1, 'new-prepaid', 'PROD-301', 'Prepaid Red 25', '5GB data and 100 local minutes, valid for 30 days', 25),
    offer('new-prepaid', 2, 'new-prepaid', 'PROD-302', 'Prepaid Red 50', '15GB data and 300 local minutes, valid for 30 days', 50),
    offer('new-prepaid', 3, 'new-prepaid', 'PROD-303', 'Prepaid Red 100', '40GB data and unlimited local minutes, valid for 30 days', 100),
  ],
  'new-postpaid': [
    offer('new-postpaid', 1, 'new-postpaid', 'PROD-107', 'Postpaid Essential', 'Open a new Postpaid Essential line', 115),
    offer('new-postpaid', 2, 'new-postpaid', 'PROD-109', 'Postpaid Max', 'Open a new Postpaid Max line', 180),
    offer('new-postpaid', 3, 'new-postpaid', 'PROD-111', 'Postpaid Unlimited', 'Open a new Postpaid Unlimited line with unlimited local data', 225),
  ],
  'new-mnp': [
    offer('new-mnp', 1, 'mnp-postpaid', 'PROD-107', 'Port-in Postpaid Essential', 'Bring your number onto Postpaid Essential', 115),
    offer('new-mnp', 2, 'mnp-postpaid', 'PROD-112', 'Port-in Postpaid Unlimited Premium', 'Bring your number onto Postpaid Unlimited Premium', 350),
    offer('new-mnp', 3, 'mnp-prepaid', 'PROD-302', 'Port-in Prepaid Red 50', 'Bring your number onto a Prepaid Red 50 pack', 50),
  ],
  'new-home': [
    offer('new-home', 1, 'new-fixed-line', 'PROD-201', 'GigaHome Fiber Triple Play', 'Fibre broadband for the home with IPTV, up to 500 Mbps', 450),
    offer('new-home', 2, 'new-fwa', 'PROD-200', 'GigaHome Premium 5G Outdoor', 'Fixed wireless broadband with an outdoor 5G router, up to 300 Mbps', 350),
  ],
  'pre-to-post-upgrade': [
    offer('pre-to-post-upgrade', 1, 'pre-to-post', 'PROD-107', 'Move to Postpaid Essential', 'Migrate this prepaid line to Postpaid Essential', 115),
    offer('pre-to-post-upgrade', 2, 'pre-to-post', 'PROD-109', 'Move to Postpaid Max', 'Migrate this prepaid line to Postpaid Max', 180),
    offer('pre-to-post-upgrade', 3, 'pre-to-post', 'PROD-112', 'Move to Postpaid Unlimited Premium', 'Migrate this prepaid line to Postpaid Unlimited Premium', 350),
  ],
  'post-to-post-upgrade': [
    offer('post-to-post-upgrade', 1, 'post-to-post', 'PROD-146', 'Upgrade to Postpaid Max Plus', 'Move to a plan with a higher monthly fee', 220),
    offer('post-to-post-upgrade', 2, 'post-to-post', 'PROD-147', 'Upgrade to Postpaid Max Pro', 'More data and international minutes', 290),
    offer('post-to-post-upgrade', 3, 'post-to-post', 'PROD-148', 'Upgrade to Postpaid Max Elite', 'The top Max plan with 200GB of data', 380),
  ],
};

/** How many offers each type shows when all types are shown. */
export const OFFERS_PER_TYPE = 3;

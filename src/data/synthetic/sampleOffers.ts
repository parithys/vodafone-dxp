import type { Offer } from '../../capabilities/CrossSellOffers/crossSalesModel';
import type { OfferTypeKey, ServiceJourney } from '../../capabilities/CrossSellOffers/serviceJourneys';

/**
 * Illustrative offers for Recommended Offers: three for every offer type, shown to an existing customer so no type is ever hidden, whether or
 * not the customer has real offers of that type. Demo content, not campaign data: they link to no plan and cannot be selected.
 */
const sample = (type: OfferTypeKey, n: number, serviceJourney: ServiceJourney, offerName: string, offerDescription: string, monthlyRental: number): Offer => ({
  offerId: `SAMPLE-${type}-${n}`,
  offerName,
  offerDescription,
  monthlyRental,
  campaignCode: 'SAMPLE',
  status: 'Offered',
  contactId: '',
  serviceJourney,
  linkedProductIds: [],
  sample: true,
});

export const SAMPLE_OFFERS: Record<OfferTypeKey, Offer[]> = {
  'new-prepaid': [
    sample('new-prepaid', 1, 'new-prepaid', 'Prepaid Starter 30', 'Starter bundle with data and local minutes', 30),
    sample('new-prepaid', 2, 'new-prepaid', 'Prepaid Plus 60', 'More data and minutes, valid for 30 days', 60),
    sample('new-prepaid', 3, 'new-prepaid', 'Prepaid Max 100', 'Large data bundle with international minutes', 100),
  ],
  'new-postpaid': [
    sample('new-postpaid', 1, 'new-postpaid', 'Postpaid Essential 150', 'Postpaid plan with a generous data allowance', 150),
    sample('new-postpaid', 2, 'new-postpaid', 'Postpaid Plus 250', 'More data, unlimited local minutes', 250),
    sample('new-postpaid', 3, 'new-postpaid', 'Postpaid Unlimited 400', 'Unlimited data and minutes with roaming', 400),
  ],
  'new-mnp': [
    sample('new-mnp', 1, 'mnp-postpaid', 'Port-in Postpaid 200', 'Bring your number onto a postpaid plan', 200),
    sample('new-mnp', 2, 'mnp-postpaid', 'Port-in Postpaid 300', 'Port in with extra data and a SIM offer', 300),
    sample('new-mnp', 3, 'mnp-prepaid', 'Port-in Prepaid 50', 'Bring your number onto a prepaid pack', 50),
  ],
  'new-home': [
    sample('new-home', 1, 'new-fixed-line', 'Home Fibre 200', 'Fibre broadband for the home', 200),
    sample('new-home', 2, 'new-fwa', 'Home 5G 250', 'Fixed wireless broadband with a 5G router', 250),
    sample('new-home', 3, 'new-fixed-line', 'Home Fibre Plus 350', 'Faster fibre with IPTV', 350),
  ],
  'pre-to-post-upgrade': [
    sample('pre-to-post-upgrade', 1, 'pre-to-post', 'Move to Postpaid 150', 'Migrate this prepaid line to postpaid', 150),
    sample('pre-to-post-upgrade', 2, 'pre-to-post', 'Move to Postpaid 250', 'Migrate with more data and minutes', 250),
    sample('pre-to-post-upgrade', 3, 'pre-to-post', 'Move to Postpaid 400', 'Migrate to unlimited data and minutes', 400),
  ],
  'post-to-post-upgrade': [
    sample('post-to-post-upgrade', 1, 'post-to-post', 'Upgrade to Postpaid 250', 'Move to a plan with a higher monthly fee', 250),
    sample('post-to-post-upgrade', 2, 'post-to-post', 'Upgrade to Postpaid 350', 'More data and international minutes', 350),
    sample('post-to-post-upgrade', 3, 'post-to-post', 'Upgrade to Postpaid 500', 'The top plan with unlimited data and roaming', 500),
  ],
};

/** How many offers each type shows when all types are shown. */
export const OFFERS_PER_TYPE = 3;

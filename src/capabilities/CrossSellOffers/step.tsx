import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { crossSalesSummary } from './summary';
import type { NavigateFunction } from 'react-router-dom';
import type { EntityKind } from '../../engines/mockDataEngine';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';
import { CrossSalesStep } from './CrossSalesStep';
import { isCrossSalesValid } from './crossSalesModel';
import type { CrossSalesValue } from './crossSalesModel';
import { NewJourneyButtons } from './JourneyActions';
import { journeyLabel } from './serviceJourneys';
import type { OfferJourneys } from './serviceJourneys';

/** What the Offers step needs from its journey. */
export interface OffersStepContext {
  /** Records the agent's decision on the offers (and what an accepted offer fixes: journey, plan) in the draft values. */
  applyCrossSales: (setValue: (field: string, value: unknown) => void, v: CrossSalesValue) => void;
  /** Starts another journey (the footer's New Fixed Line / New MNP / New Prepaid buttons). */
  navigate: NavigateFunction;
  createRecord: (kind: EntityKind, record: Record<string, unknown>) => Promise<void>;
  /** The journey this Offers step belongs to; New Postpaid unless the journey says otherwise. */
  journey?: OfferJourneys;
}

export function offersStep({ applyCrossSales, navigate, createRecord, journey = 'new-postpaid' }: OffersStepContext): WizardStep {
  return {
    key: 'crossSales',
    summary: crossSalesSummary,
    label: 'Recommended Offers',
    heading: 'Recommended Offers',
    subheading: 'Personalised using the customer\u2019s profile and eligibility.',
    render: ({ values, setValue, goNext }) => (
      <CrossSalesStep
        customerId={(values.eligibility as EligibilityResult | undefined)?.customerId}
        value={(values.crossSales as CrossSalesValue) ?? {}}
        onChange={(v) => applyCrossSales(setValue, v)}
        onHandOff={(route) => navigate(route)}
        journey={journey}
        onContinue={goNext}
        onInterestedOffer={async (offer) => {
          const contact = values.contact as GuidedContactValue | undefined;
          const leadId = `LEAD-${Date.now().toString().slice(-6)}`;
          await createRecord('leads', {
            leadId,
            serviceNeeded: journeyLabel(offer.serviceJourney) ?? 'Mobile',
            status: 'New',
            ownerId: useAuthStore.getState().profile?.userId ?? null,
            createdVia: journey === 'new-prepaid' ? 'New Prepaid - Cross Sales Offer' : 'New Connection - Cross Sales Offer',
            offerId: offer.offerId,
            offerName: offer.offerName,
            customerId: (values.eligibility as EligibilityResult | undefined)?.customerId,
            mobileNumber: contact?.moiResult?.phone,
          });
          useNotificationStore.getState().pushToast('success', `Lead ${leadId} has been created`, { key: `lead-${leadId}` });
        }}
      />
    ),
    isValid: (values) => isCrossSalesValid(values.crossSales as CrossSalesValue | undefined, journey),
    // The footer starts a journey: New Postpaid takes no offer and goes on here; the others leave for their own wizard.
    // Each offer card carries its own Interested (lead) and Select Offer buttons.
    primaryAction: ({ setValue, goNext }) => (
      <NewJourneyButtons journey={typeof journey === 'string' ? journey : journey[0]} onDecline={() => applyCrossSales(setValue, { decision: 'declined' })} goNext={goNext} onHandOff={(route) => navigate(route)} />
    ),
  };
}

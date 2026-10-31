import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomerContext } from '../../stores/customerContextStore';
import { useEntityStore } from '../../stores/entityStore';
import { useWorkflowStore } from '../../stores/workflowStore';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { useJourneyCustomerLock } from './useJourneyCustomerLock';
import type { JourneyFlow } from './journeyModel';

/**
 * The state every guided activation journey keeps for its own run: the navigator, the record writer, the confirmed
 * order (which comes back if the page is reloaded after submit but before Close Activity), whether this is the
 * customer-view pop-up, the draft's current step, and the customer lock - the journey is bound to the customer once
 * they are identified until it ends (Close Activity, Save as Draft, Abandon Order, session end).
 *
 * A journey passes its own `wizardId` so its draft and customer hold never mix with another journey's.
 */
export function useJourneySession<TOrder = unknown>({
  wizardId,
  flow,
  existingCustomerId,
}: {
  wizardId: string;
  flow: JourneyFlow;
  /** Existing flow: the customer the journey was opened for. */
  existingCustomerId?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const createRecord = useEntityStore((s) => s.createRecord);
  const [confirmedOrder, setConfirmedOrder] = useState<TOrder | null>(() => {
    const a = useCustomerContext.getState().journey;
    return a?.wizardId === wizardId && a.finalOrder ? (a.finalOrder as unknown as TOrder) : null;
  });
  const isMirrorWindow = new URLSearchParams(location.search).get('mirror') === '1';
  const draftValues = useWorkflowStore((s) => s.drafts[wizardId]?.values);
  const draftStep = useWorkflowStore((s) => s.drafts[wizardId]?.currentStep);
  const draftContact = draftValues?.contact as GuidedContactValue | undefined;
  const draftCustomerId = (draftValues?.eligibility as EligibilityResult | undefined)?.customerId;
  const { active, heldByAnotherJourney, guardedContactChange } = useJourneyCustomerLock({
    flow,
    wizardId,
    existingCustomerId,
    isMirrorWindow,
    draftContact,
    draftCustomerId,
    draftStep,
  });
  // The person identified is a NEW customer (no customer record is carried): they hold no benefit yet, so no existing-customer discount is theirs.
  const draftNationality = draftContact?.moiResult?.nationality;
  const draftIsNewCustomer = Boolean(draftContact?.moiResult?.isNewCustomer) && !draftCustomerId;
  return { navigate, createRecord, confirmedOrder, setConfirmedOrder, isMirrorWindow, draftStep, draftCustomerId, draftIsNewCustomer, draftNationality, active, heldByAnotherJourney, guardedContactChange };
}

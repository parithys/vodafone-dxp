import { newTaskId } from '../../lib/taskId';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { useNotificationStore } from '../../stores/notificationStore';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { JourneyFlow } from './journeyModel';

/**
 * Binds this journey to the customer once they are identified, and enforces that nothing else can replace
 * them until the journey ends (Close Activity, Save as Draft, Abandon Order, session end). Another
 * customer's journey in progress redirects an entry point back to it; a stale hold left by an earlier
 * journey for the same entry is released. Also records the held customer's segment once it is known.
 */
export function useJourneyCustomerLock({
  flow,
  wizardId: WIZARD_ID,
  existingCustomerId,
  isMirrorWindow,
  draftContact,
  draftCustomerId,
  draftStep,
}: {
  flow: JourneyFlow;
  wizardId: string;
  existingCustomerId: string | undefined;
  isMirrorWindow: boolean;
  draftContact: GuidedContactValue | undefined;
  draftCustomerId: string | undefined;
  draftStep: number | undefined;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = useCustomerContext((s) => s.journey);
  // The entry point decides the customer type: opened from Customer 360 for customer X, this IS the
  // Existing Customer journey, even if X is still held by a New Customer journey left from earlier
  // (e.g. started at the Dashboard and abandoned). That stale hold is released, not obeyed.
  const staleSameCustomer = Boolean(
    flow === 'existing' && existingCustomerId && active && active.wizardId !== WIZARD_ID && active.customerId === existingCustomerId
  );
  // Likewise a New Customer entry (Dashboard, Mobile > New Connections) with nobody identified yet starts
  // a New Customer journey; a hold left by another journey does not redirect it.
  const freshNewEntry = Boolean(flow === 'new' && active && active.wizardId !== WIZARD_ID && !draftContact?.moiResult);
  // Launched from Customer 360 for customer X (startFresh) while someone else's journey is held: the launch is
  // blocked and the agent stays on X's Customer 360 page, rather than being sent into the other customer's journey.
  const launchedFromCustomer360 = Boolean(
    flow === 'existing' && existingCustomerId && (location.state as { startFresh?: boolean } | null)?.startFresh
  );
  const releaseStale = staleSameCustomer || freshNewEntry;
  const heldByAnotherJourney = Boolean(active && active.wizardId !== WIZARD_ID) && !releaseStale;
  useEffect(() => {
    if (isMirrorWindow) return; // the customer's pop-up only displays
    const store = useCustomerContext.getState();
    if (releaseStale) store.endJourney();
    if (heldByAnotherJourney) {
      // A different customer's journey is in progress: this entry point cannot take over.
      useNotificationStore.getState().pushToast('warning', `A journey for ${active?.customerName} is in progress`, {
        key: 'customer-context-locked',
        detail: `${active?.taskId ? `Task ID: ${active.taskId}. ` : ''}Close Activity, Save as Draft or Abandon Order to start another customer.`,
      });
      navigate(launchedFromCustomer360 ? `/customer/${existingCustomerId}` : active!.path, { replace: true });
      return;
    }
    if (draftContact?.moiResult && draftContact.idNumber) {
      store.beginJourney({
        wizardId: WIZARD_ID,
        path: location.pathname,
        journey: flow === 'existing' ? 'New Connection - Existing Customer' : 'New Connection - New Customer',
        customerName: draftContact.moiResult.name,
        idNumber: draftContact.idNumber,
        idType: draftContact.idType,
        customerId: draftCustomerId,
        startedAt: new Date().toISOString(),
        taskId: newTaskId(),
      });
      if (draftCustomerId) store.patchJourney(WIZARD_ID, { customerId: draftCustomerId });
    } else if (store.journey?.wizardId === WIZARD_ID && !store.journey.finalOrder) {
      store.endJourney(WIZARD_ID); // nothing identified in this draft (e.g. started fresh): no stale hold
    }
  }, [isMirrorWindow, heldByAnotherJourney, releaseStale, active, draftContact?.moiResult, draftContact?.idNumber, draftContact?.idType, draftContact?.moiResult?.name, draftCustomerId, WIZARD_ID, flow, location.pathname, navigate]);
  // The held customer's segment, once their record is known: from the customer being viewed when it is the
  // same person, else from their record.
  const heldCustomerId = active?.wizardId === WIZARD_ID ? active.customerId : undefined;
  const heldSegment = active?.wizardId === WIZARD_ID ? active.segment : undefined;
  useEffect(() => {
    if (isMirrorWindow || !heldCustomerId || heldSegment) return;
    const viewed = useCustomerContext.getState().customer;
    if (viewed?.customerId === heldCustomerId) {
      useCustomerContext.getState().patchJourney(WIZARD_ID, { segment: viewed.segment });
      return;
    }
    let cancelled = false;
    void mockDataEngine.list<{ customerId: string; segment: string }>('customers').then((all) => {
      const segment = all.find((c) => c.customerId === heldCustomerId)?.segment;
      if (!cancelled && segment) useCustomerContext.getState().patchJourney(WIZARD_ID, { segment });
    });
    return () => {
      cancelled = true;
    };
  }, [isMirrorWindow, heldCustomerId, heldSegment, WIZARD_ID]);
  // Identity is fixed once fetched: nothing may change which customer this journey is for.
  const guardedContactChange = (v: GuidedContactValue, setValue: (f: string, val: unknown) => void) => {
    const held = useCustomerContext.getState().journey;
    if (held?.wizardId === WIZARD_ID && !isMirrorWindow) {
      const changesIdentity = v.idNumber !== held.idNumber || Boolean(v.moiResult && v.moiResult.name !== held.customerName);
      // On the Customer Verification page itself the agent may change the document type (and so the
      // identity) at any time: the hold is released and re-taken when the new document resolves. From the
      // next step on, the customer is fixed.
      if (changesIdentity && (draftStep ?? 0) === 0) {
        useCustomerContext.getState().endJourney(WIZARD_ID);
      } else if (changesIdentity) {
        useNotificationStore.getState().pushToast('warning', `This journey is for ${held.customerName}`, {
          key: 'customer-context-locked',
          detail: 'The customer cannot be changed mid-journey. Save as Draft or Abandon Order to start again.',
        });
        return;
      }
    }
    setValue('contact', v);
  };

  return { active, heldByAnotherJourney, guardedContactChange };
}

import { idTypesFor } from '../../data/idTypes';
import type { CustomerIdentificationProps } from '../CustomerIdentification/CustomerIdentification';
import type { JourneyFlow } from '../JourneyCustomerLock/journeyModel';

/**
 * What typing the ID by hand means in the journeys that mount this step (New Connection and its products, Fixed Line, Prepaid to Postpaid, the service changes): their submit holds
 * the order for approval when the identity was entered by hand (routesToApproval / the submit's own manualIdEntry). It is THEIR rule, so it is said by them: the shared scanner
 * states no journey rule, and a journey without it (SIM swap, Reserve Number, Verification Gate ...) says nothing.
 */
export const MANUAL_ENTRY_APPROVAL_NOTICE = "Manual entry requires Store Manager's approval for activation.";

/** What the Contact step needs to know about its journey to say how Customer Verification identifies the customer. */
export interface ContactIdentityContext {
  flow: JourneyFlow;
  /** Existing flow: the customer the journey was opened for. */
  existingCustomerId?: string;
  /** The customer the journey was launched for (kept in the draft by the wizard), when it was launched for one. */
  launchedFor?: string;
  /** The journey acts on a customer the business already has: it never creates one and does not treat the scan as a new customer. */
  knownCustomer?: boolean;
  knownCustomerId?: string;
  journeyType?: 'postpaid' | 'prepaid';
  manualEntry?: boolean;
}

/**
 * THE props the New Connection Contact step (/mobile/start-connection) gives Customer Verification: contact details collected with the identity, the ID types of its
 * journey, and who the scanned ID is allowed to be. The journey's step and the Capability Library preview both spread this, so the library shows exactly what the
 * journey renders and the two cannot drift apart. (The journey adds only what is its own: the value, the guarded change handler that locks the customer.)
 */
export function contactIdentificationProps({ flow, existingCustomerId, launchedFor, knownCustomer = false, knownCustomerId, journeyType = 'postpaid', manualEntry }: ContactIdentityContext) {
  const actedForId = knownCustomer ? (knownCustomerId ?? launchedFor) : launchedFor;
  // A journey opened FOR a customer (from their Customer 360, e.g. MNP Port-In) is bound to them whatever its flow: it is never a New Customer journey, and a scanned ID is read
  // and checked against them. Only a journey nobody opened it for is a walk-in.
  const asNewCustomer = flow === 'new' && !knownCustomer && !launchedFor;
  return {
    collectContact: true,
    // New Customer journey: whoever the scanned ID belongs to is handled as a genuine new customer.
    asNewCustomer,
    // Customer 360 entry: the customer is the one the journey was opened for.
    asCustomerId: flow === 'existing' ? existingCustomerId : actedForId,
    // A journey that acts on a known customer never creates one; the others offer it when no registry knows the ID.
    allowNewCustomer: !knownCustomer,
    // All the journey's ID types are offered. Passport, GCC ID and Diplomatic ID are exception identification: the eligibility engine routes them to approval rather than blocking them.
    allowedIdTypes: idTypesFor(journeyType === 'prepaid' ? 'prepaid' : 'new-connection'),
    manualEntry,
    unavailableIdTypes: [],
    manualEntryNotice: MANUAL_ENTRY_APPROVAL_NOTICE,
    // ID type chosen first, then scan -> agent verifies number + expiry against the card -> Fetch (MOI).
    verifyThenFetch: true,
    showIptvToggle: false,
  } satisfies Partial<Extract<CustomerIdentificationProps, { collectContact: true }>>;
}

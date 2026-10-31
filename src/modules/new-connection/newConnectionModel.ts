import { POST_EXIT_DESTINATION, DRAFT_ORDERS_PATH } from '../../capabilities';
import type { JourneyFlow } from '../../capabilities';

export { POST_EXIT_DESTINATION, DRAFT_ORDERS_PATH };
// Two flows, chosen by where the journey was started (2026-10-02):
//  - 'new'      Agent 360 (Dashboard) or Mobile Connections: the customer is
//               ALWAYS treated as NEW. Full scan -> NAS lookup; even an ID that
//               has a Siebel record proceeds as a new customer.
//  - 'existing' Customer Details: the customer is already identified, so the
//               Customer Verification step opens pre-resolved with the ID
//               locked (read-only); eligibility still runs.
// Separate wizard ids keep their drafts from overwriting each other.
export type NewConnectionFlow = JourneyFlow;

export const WIZARD_ID_BY_FLOW: Record<NewConnectionFlow, string> = { new: 'new-connection', existing: 'new-connection-existing' };

/**
 * Which journey the wizard is: 'connection' (New Connection: Postpaid, Prepaid, Fixed Line, MNP) or 'home' (New Home
 * Connection: Fibre, Fixed-Line, FWA, 5G Home). Both are one continuous journey - Customer Verification, Product Selection,
 * then the product's steps - and each keeps its own draft and customer lock.
 */
export type ConnectionJourney = 'connection' | 'home';

/** The home journey's draft ids sit beside the connection journey's, so one never overwrites the other. */
export const HOME_WIZARD_ID_BY_FLOW: Record<NewConnectionFlow, string> = { new: 'new-home-connection', existing: 'new-home-connection-existing' };

export interface Product {
  productId: string;
  name: string;
  mrcQAR: number;
  /** The catalogue's product type ('Postpaid Plan', 'Add-on', ...). */
  type?: string;
  /** A nationality promotion: offered only to these nationalities (see isPlanOfferedTo). */
  eligibleNationalities?: string[];
  starNumberEntitlementQar?: number;
  /** See PostpaidPlanAddonsStep's PostpaidPlan.preBundledOffer for what this
   * drives - the 'plan' step's autoAdvanceWhen below is the other half. */
  preBundledOffer?: boolean;
  /** What puts a plan on the Offers tab of Offers & Plans (see isOffersTabPlan). */
  popular?: boolean;
  offer?: boolean;
  commitmentMonths?: number;
}

export type { ConfirmedOrder } from '../../capabilities';

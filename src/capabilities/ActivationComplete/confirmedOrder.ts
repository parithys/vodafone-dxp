import type { ActivityInput } from '../../engines/activityEngine';
import type { OrderTerms } from '../../components/patterns/cafTermsModel';
import { actualUserIdentity, supplementaryRows, type ActualUserValue } from '../ActualUser/actualUserModel';

// The order a guided activation journey confirms and hands to the Activation Complete page.
export interface ConfirmedOrder {
  orderId: string;
  /** The number reserved for the automatic activity (created when the agent hits Done & Exit). */
  activityId?: string;
  /** The automatic activity itself, without comments: the page records it on Done & Exit. */
  completionActivity?: ActivityInput;
  pendingApproval: boolean;
  customerName: string;
  customerId?: string;
  address?: { zone?: string; streetNo?: string; buildingNo?: string; aptFlatUnit?: string };
  msisdn: string;
  planName: string;
  /** Absent for an order that takes no payment (a port-in request). */
  dueTodayQar?: number;
  /** Overrides the confirmation page's heading. */
  heading?: string;
  /** Overrides its Status row (a port request is Pending until the donor operator answers). */
  statusLabel?: string;
  /** Further rows after Status (a port-in request's NPAS reference, form number and response deadline). */
  extraLines?: { label: string; value: string }[];
  /** An extra button after View Order (a port-in request's status screen). */
  trackAction?: { label: string; to: string };
  /** Absent for an order with no recurring charge (prepaid). */
  monthlyRecurringQar?: number;
  /** The add-ons the line starts with, by name (empty: none). Absent when the journey does not take add-ons. */
  activeAddons?: string[];
  /** The billing cycle of the account the line is billed on. Absent when the journey has no billing account. */
  billingCycle?: string;
  /** The kind of service: a SIM number ('mobile', the default) or a fixed-line number ('fixed'). Picks the confirmation page's wording. */
  service?: 'mobile' | 'fixed';
  simType?: string;
  /** The Terms & Conditions the customer signed (and the actual user's Supplementary Form, when there is one): drives Print T&C and Print Supplement T&C. Absent when the journey signs no CAF. */
  terms?: OrderTerms;
  /** Set only for eSIM orders - drives the QR handover panel below. */
  esimActivationCode?: string;
  /**
   * The account's own contact email, whatever it is - no longer gated on
   * verification (2026-09-28: "populate it only from existing account
   * contact emails," shown even when unverified so the agent can see why
   * sending is blocked). See customerEmailVerified for the gate itself.
   */
  customerEmail?: string;
  /** The address as Customer Verification shows it (masked for a new customer). */
  customerEmailDisplay?: string;
  /** Same definition as GuidedContactStep's own emailVerification tick. */
  customerEmailVerified: boolean;
}

/** The signed terms of an order, from the values of a journey that signs a CAF. The Supplementary Form is carried only for a line whose actual user is someone else, fully identified. */
export function orderTerms(values: Record<string, unknown>, journey: OrderTerms['journey']): OrderTerms {
  const actualUser = values.actualUser as ActualUserValue | undefined;
  const identity = actualUserIdentity(actualUser);
  return { journey, ...(identity ? { supplementary: { rows: supplementaryRows(actualUser), actualUserName: identity.moiResult?.name } } : {}) };
}

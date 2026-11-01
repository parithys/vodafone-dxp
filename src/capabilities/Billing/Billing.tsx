import { BillingAccountStep } from '../../components/patterns/BillingAccountStep';
import type { ComponentProps } from 'react';

/**
 * BILLING - the one application-wide capability for setting up what an order bills to, with ONE layout everywhere:
 * the customer's existing billing accounts, then "Create New Billing Account" (contact, billing address, payment -
 * invoice recipient, bill cycle, billing mode, card on file, primary payment profile - and the profile's name / media /
 * schedule). New Connection, Fixed Line / Fibre / FWA, postpaid port-in and Pre-to-Post.
 *
 * Journeys mount THIS component (usually through billingStep); none of them mounts BillingAccountStep itself.
 */
export type BillingProps = ComponentProps<typeof BillingAccountStep>;

export function Billing(props: BillingProps) {
  return <BillingAccountStep {...props} />;
}

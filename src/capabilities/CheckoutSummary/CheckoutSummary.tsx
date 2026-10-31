import type { ComponentProps } from 'react';
import { CheckoutSummaryStep } from '../../components/patterns/CheckoutSummaryStep';
import { PrepaidCheckoutStep } from '../../components/patterns/PrepaidCheckoutStep';
import { PrepaidCartStep } from '../../components/patterns/PrepaidCartStep';

/**
 * CHECKOUT SUMMARY - the one application-wide capability for the order read-back before the customer signs and
 * pays: customer, plan, add-ons, discount, number, SIM, billing method and the monthly and one-off totals.
 *
 * Journeys mount THIS component (usually through checkoutSummaryStep in wizard/wizardSteps) and pass the order's
 * facts; none of them mounts CheckoutSummaryStep itself. It also reports what it computed (totals, the CAF
 * read-back rows and tables, the legal facts) so the CAF & Signature step signs against the same figures the
 * customer has just seen - never a second calculation.
 *
 *   layout 'detailed'  the full tables (New Connection, Fixed Line); 'default' the compact summary.
 *   PrepaidCheckout    the prepaid read-back of the whole cart (every subscription, SIM card charge, total payable today);
 *                      PrepaidCart the "Add another subscription?" step before it (Mobile Prepaid).
 */
export type CheckoutSummaryProps = ComponentProps<typeof CheckoutSummaryStep>;

export function CheckoutSummary(props: CheckoutSummaryProps) {
  return <CheckoutSummaryStep {...props} />;
}

export const PrepaidCheckout = PrepaidCheckoutStep;
export const PrepaidCart = PrepaidCartStep;

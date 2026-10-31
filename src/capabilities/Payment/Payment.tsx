import type { ComponentProps } from 'react';
import { WinCashPaymentStep } from '../../components/patterns/WinCashPaymentStep';

/**
 * PAYMENT - the one application-wide capability for taking the amount due at the counter: hand off to WinCash,
 * confirm on return (or decline / session expiry), and record the outcome on the order.
 *
 * Journeys mount THIS component (usually through paymentStep in wizard/wizardSteps) and pass the amount due; none
 * of them mounts WinCashPaymentStep itself. The amount is always the figure Checkout already computed and read
 * back to the customer, never a second derivation.
 */
export type PaymentProps = ComponentProps<typeof WinCashPaymentStep>;

export function Payment(props: PaymentProps) {
  return <WinCashPaymentStep {...props} />;
}

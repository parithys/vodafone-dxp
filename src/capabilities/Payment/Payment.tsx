import type { ComponentProps } from 'react';
import { WinCashPaymentStep } from '../../components/patterns/WinCashPaymentStep';
import { eWalletEligible } from '../../data/prepaidActivation';
import { usePersonaStore } from '../../stores/personaStore';
import { useEWalletStore } from '../../stores/eWalletStore';

/**
 * PAYMENT - the one application-wide capability for taking the amount due at the counter: hand off to WinCash,
 * confirm on return (or decline / session expiry), and record the outcome on the order.
 *
 * Journeys mount THIS component (usually through paymentStep in wizard/wizardSteps) and pass the amount due; none
 * of them mounts WinCashPaymentStep itself. The amount is always the figure Checkout already computed and read
 * back to the customer, never a second derivation.
 */
export type PaymentProps = Omit<ComponentProps<typeof WinCashPaymentStep>, 'eWallet'> & {
  /**
   * Offer "Pay from eWallet" to the roles mapped to an eWallet (Mass Market): the capability reads the role, the (mock) balance and does the deduction, so a journey only says
   * that it offers it. Off (every other journey): WinCash only.
   */
  offerEWallet?: boolean;
};

export function Payment({ offerEWallet = false, ...props }: PaymentProps) {
  const roleId = usePersonaStore((s) => s.activePersonaId);
  const balance = useEWalletStore((s) => s.balances[roleId] ?? 0);
  const eWallet = offerEWallet && eWalletEligible(roleId) ? { balanceQar: balance, onPay: (amountQar: number) => useEWalletStore.getState().deduct(roleId, amountQar) } : undefined;
  return <WinCashPaymentStep {...props} eWallet={eWallet} />;
}

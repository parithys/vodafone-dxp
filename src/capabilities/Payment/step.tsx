import { PAYMENT_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { Payment } from './Payment';
import type { CheckoutTotals } from '../../components/patterns/checkoutSummaryModel';
import type { WinCashPaymentValue } from '../../components/patterns/WinCashPaymentStep';

/**
 * The figure Checkout already computed and read back to the customer (values.checkoutTotals, published by its
 * onTotalsComputed), not a re-derivation from the number's sticker price - that second derivation used to skip
 * BR-115's entitlement/overage logic entirely.
 */
const dueFromCheckout = (values: Record<string, unknown>) => (values.checkoutTotals as CheckoutTotals | undefined)?.dueTodayQar ?? 0;

/**
 * Payment, stored under `payment`; the step continues once the payment is confirmed (`paid`). `amountDue` reads
 * the figure Checkout computed from the values. `submitOnPaid` moves on the moment the payment returns, without
 * a separate Continue - for journeys where Payment is the last step and Continue could only ever mean "submit".
 * `zeroValueReceipt` issues a zero-value receipt, rather than a WinCash handoff, when the amount due is QAR 0.
 */
export function paymentStep(opts: { amountDue?: (values: Record<string, unknown>) => number; submitOnPaid?: boolean; zeroValueReceipt?: boolean } = {}): WizardStep {
  const paid = (values: Record<string, unknown>) => Boolean((values.payment as WinCashPaymentValue | undefined)?.paid);
  const cashReceived = (values: Record<string, unknown>) => {
    const p = values.payment as WinCashPaymentValue | undefined;
    return Boolean(p?.paid && p.method === 'Cash');
  };
  return {
    key: 'payment',
    label: PAYMENT_LABEL,
    render: ({ values, setValue }) => (
      <Payment
        amountDueQAR={(opts.amountDue ?? dueFromCheckout)(values)}
        zeroValueReceipt={opts.zeroValueReceipt}
        value={(values.payment as WinCashPaymentValue) ?? {}}
        onChange={(v) => setValue('payment', v)}
        // "Proceed without WinCash": the agent took physical cash directly, so WinCash is not waited for. The payment is
        // recorded as cash received, which completes the step and moves the journey on to the order summary.
        onProceedWithout={() => setValue('payment', { paid: true, method: 'Cash', handoffStarted: false, declined: false })}
      />
    ),
    isValid: paid,
    // WinCash confirmation (`submitOnPaid` journeys) or cash taken directly moves the journey on without a further click.
    autoAdvanceWhen: (values) => (opts.submitOnPaid ? paid(values) : cashReceived(values)),
 };
}

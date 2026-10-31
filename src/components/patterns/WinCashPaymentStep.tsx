import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { SYNTHETIC_CLASS } from '../../data/synthetic/syntheticMarker';
import { formatQarAny } from '../../lib/format';

export interface WinCashPaymentValue {
  paid?: boolean;
  /** How the amount was taken: through WinCash, or as physical cash the agent received directly from the customer. */
  method?: 'WinCash' | 'Cash' | 'Zero value';
  /** The receipt: the WinCash reference, or the zero-value receipt number when nothing was due. */
  reference?: string;
  /** Nothing was due, so no payment was taken and a zero-value receipt was issued (MNP BR-MNP-011). */
  zeroValue?: boolean;
  declined?: boolean;
  /** WinCash reported a technical error (not a decline): nothing was taken, and the agent can retry. */
  errored?: boolean;
  /** Agent has left DXP for the external WinCash terminal - the cash drawer
   * cannot be reached from inside DXP (2026-09-28 request). */
  handoffStarted?: boolean;
  /** DXP's own session lapsed while the agent was away at the WinCash
   * terminal (2026-09-28 request). Demo-triggered the same way "Simulate
   * decline" below stands in for a real POS decline: there is no session-
   * timeout mechanism anywhere in this app (authStore is persistence-only,
   * per its own note) to hook a real detector into. */
  sessionExpired?: boolean;
}

interface WinCashPaymentStepProps {
  amountDueQAR: number;
  value: WinCashPaymentValue;
  onChange: (value: WinCashPaymentValue) => void;
  /**
   * Offers "Proceed without WinCash" beside "Continue in WinCash": the agent took physical cash from the customer
   * directly, so no WinCash confirmation is waited for. The step records the payment as received in cash (and the
   * caller moves on); omit it where taking cash this way is not offered.
   */
  onProceedWithout?: () => void;
  /**
   * When nothing is due, issue a zero-value receipt instead of handing off to WinCash for QAR 0 (MNP BR-MNP-011: "If no amount is due,
   * the system shall generate a zero-value receipt"). Off by default: the other journeys keep their existing behaviour.
   */
  zeroValueReceipt?: boolean;
}

// Gate 3 of the reference activation flow - WinCash/POS + inventory sync,
// evidenced as WinCash stock check/reservation + signature pad + WinCash
// payment (business-workshop-day5-session-2-postpaid-service, UJ-042).
// FLD-634/635 (Reason dropdown for FREE-type sales, Generate CAF button
// triggering "Validating Order, please wait...") - CAF generation is a prior
// wizard step now (Checkout -> CAF -> Payment, matching the reference order).
//
// Handoff / Return / Session Expired added 2026-09-28: WinCash is an
// EXTERNAL system running the cash drawer, which this app was never able to
// reach - the step used to simulate the whole transaction in-app as if DXP
// itself were the POS. It now says so instead: "Continue in WinCash" hands
// the agent off, and the two Return buttons stand in for the agent coming
// back having actually run the transaction on that other terminal (there is
// no real integration to poll, so the agent reports the outcome the same way
// "Simulate decline" already stood in for one). "Simulate session expiry"
// is the same convention applied to the one new failure mode a real handoff
// introduces: DXP timing the agent out while they were away.
//
// The reference's exception table also has a Cancel path, which used to be
// served by the wizard's Abandon Order control. That control was removed
// from THIS component's reach on 2026-09-26 and reinstated app-wide on
// 2026-09-27 (see GuidedActivationWizard's own history) - it is deliberately
// absent again as of 2026-09-28, not by omission this time but by
// NewPostpaidWizard's `hideAbandonFrom="payment"`, matching the explicit
// "keep Cancel available after CAF signing and until payment starts" - i.e.
// no further than here, once WinCash may already hold the transaction.
export function WinCashPaymentStep({ amountDueQAR, value, onChange, onProceedWithout, zeroValueReceipt }: WinCashPaymentStepProps) {
  const [processing, setProcessing] = useState(false);

  if (zeroValueReceipt && amountDueQAR === 0) {
    return (
      <div className="space-y-4">
        <div className="card p-4 card-surface">
          <div className="flex justify-between text-fg">
            <span>Amount Due</span>
            <span className="font-medium">QAR 0</span>
          </div>
          <p className="text-fg-2 text-[length:var(--fs-caption)] mt-1">Nothing is due today, so no payment is taken. A zero-value receipt is issued.</p>
        </div>
        {value.paid && value.zeroValue ? (
          <div className="flex items-center gap-2">
            <Badge variant="success">Zero-Value Receipt Issued</Badge>
            <span className="text-[length:var(--fs-caption)] text-muted">Receipt: {value.reference}</span>
          </div>
        ) : (
          <Button variant="primary" onClick={() => onChange({ paid: true, method: 'Zero value', zeroValue: true, reference: `RCPT-0-${Date.now().toString().slice(-8)}` })}>
            Generate zero-value receipt
          </Button>
        )}
      </div>
    );
  }

  const beginHandoff = () => {
    onChange({ ...value, handoffStarted: true, declined: false, errored: false, sessionExpired: false });
  };

  const returnFromWinCash = async (outcome: 'success' | 'decline' | 'error') => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setProcessing(false);
    if (outcome === 'decline') {
      onChange({ paid: false, declined: true, errored: false, handoffStarted: false, sessionExpired: false });
      return;
    }
    if (outcome === 'error') {
      onChange({ paid: false, declined: false, errored: true, handoffStarted: false, sessionExpired: false });
      return;
    }
    onChange({
      paid: true,
      declined: false,
      handoffStarted: false,
      sessionExpired: false,
      reference: `WC-${Date.now().toString().slice(-8)}`,
      method: 'WinCash',
    });
  };

  const simulateSessionExpiry = () => {
    onChange({ ...value, sessionExpired: true, handoffStarted: false });
  };

  // Both recovery paths are genuine choices, not a dead end (2026-09-28
  // "show a clear recovery/error state") - the agent knows whether the
  // WinCash screen showed a completed transaction before DXP timed out, even
  // though DXP itself cannot know that.
  const resumeAfterSessionExpiry = (completedInWinCash: boolean) => {
    if (completedInWinCash) {
      onChange({
        paid: true,
        declined: false,
        sessionExpired: false,
        handoffStarted: false,
        reference: `WC-${Date.now().toString().slice(-8)}`,
      });
      return;
    }
    onChange({ paid: false, declined: false, sessionExpired: false, handoffStarted: false });
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 card-surface">
        <div className="flex justify-between text-fg">
          <span>Amount Due (WinCash)</span>
          <span className="font-medium">{formatQarAny(amountDueQAR)}</span>
        </div>
      </div>

      {value.paid ? (
        <div className="flex items-center gap-2">
          <Badge variant="success">Paid</Badge>
          <span className="text-[length:var(--fs-caption)] text-muted">{value.reference ? `Reference: ${value.reference}` : value.method ? `Paid by ${value.method}` : null}</span>
        </div>
      ) : value.sessionExpired ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--danger-border)] bg-tone-danger-soft p-4 space-y-3">
          <Badge variant="danger">Session Expired</Badge>
          <p className="text-[length:var(--fs-caption)] text-fg">
            Your DXP session timed out while you were completing this payment in WinCash. If the payment
            actually went through there, confirm it below to record it and continue - otherwise, try again.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => resumeAfterSessionExpiry(true)}>
              Payment completed in WinCash - resume
            </Button>
            <Button variant="secondary" onClick={() => resumeAfterSessionExpiry(false)}>
              It didn't complete - try again
            </Button>
          </div>
        </div>
      ) : value.handoffStarted ? (
        <div className="rounded-[var(--radius-card)] border border-accent-border bg-surface-warm p-4 space-y-3">
          <Badge variant="filled-neutral">Continue in WinCash</Badge>
          <p className="text-[length:var(--fs-caption)] text-fg">
            DXP cannot access the cash drawer directly - complete this payment on the WinCash terminal, then
            come back here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => void returnFromWinCash('success')} disabled={processing}>
              {processing ? 'Returning to DXP…' : 'Payment completed in WinCash'}
            </Button>
            <Button variant="secondary" onClick={() => void returnFromWinCash('decline')} disabled={processing}>
              Payment declined in WinCash
            </Button>
            <Button variant="secondary" onClick={() => void returnFromWinCash('error')} disabled={processing}>
              Error occurred, Retry in WinCash
            </Button>
          </div>
          <button
            type="button"
            onClick={simulateSessionExpiry}
            disabled={processing}
            className={`text-[length:var(--fs-caption)] text-muted hover:text-danger transition-colors ${SYNTHETIC_CLASS}`}
          >
            Simulate Session Expiry (Demo)
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.declined && (
            <div className="rounded-[var(--radius-card)] border border-[var(--danger-border)] bg-tone-danger-soft p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="danger">Payment Declined</Badge>
              </div>
              <p className="text-[length:var(--fs-caption)] text-fg">
                WinCash declined the authorization. Retry the same amount, or take payment by another method.
              </p>
            </div>
          )}
          {value.errored && (
            <div className="rounded-[var(--radius-card)] border border-[var(--danger-border)] bg-tone-danger-soft p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="danger">WinCash Error</Badge>
              </div>
              <p className="text-[length:var(--fs-caption)] text-fg">
                WinCash reported an error and no payment was taken. Retry the same amount in WinCash.
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {/* First attempt: Continue in WinCash takes the payment as completed and the journey goes straight on (the order is submitted). Only a retry after a decline or error opens the WinCash hand-off panel. */}
            <Button variant="primary" onClick={value.declined || value.errored ? beginHandoff : () => void returnFromWinCash('success')} disabled={processing}>
              {processing ? 'Returning to DXP…' : value.declined || value.errored ? 'Retry in WinCash' : 'Continue in WinCash'}
            </Button>
            {onProceedWithout && (
              <Button variant="secondary" onClick={onProceedWithout}>
                Proceed Without WinCash
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

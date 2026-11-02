import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import { EligibilityChecksList } from '../../components/domain/EligibilityRows';
import { useNotificationStore } from '../../stores/notificationStore';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { outcomeRows, useOutcomePreview } from './eligibilityOutcomesModel';
import type { OutcomeKey } from './eligibilityOutcomesModel';
import { ExceptionRequestModal } from './ExceptionRequestModal';
import type { AdditionalDocument } from '../DocumentUpload';


/** Inline, in the step body: the blockers behind the outcome picked in the footer. */
export function EligibilityOutcomePanel() {
  const { open, close } = useOutcomePreview();
  // Leaving the step drops the preview.
  useEffect(() => close, [close]);
  if (!open) return null;
  return (
    <div className="space-y-2" role="region" aria-label={`${open} blockers`}>
      <div className="flex justify-end">
        <button type="button" onClick={close} className="text-[length:var(--fs-caption)] link underline px-1">
          Hide
        </button>
      </div>
      <EligibilityChecksList rows={outcomeRows(open)} />
    </div>
  );
}

/**
 * The step footer's primary action, by eligibility outcome. The outcome picked
 * with the footer links (a preview) wins; otherwise it is the customer's real
 * result. Advisory Only and a clean result keep the ordinary Continue.
 */
export function OutcomeActions({
  eligibility,
  defaultButton,
  exception,
}: {
  eligibility: EligibilityResult | undefined;
  defaultButton: ReactNode;
  /** An applicant under 18: Apply for Exception is the footer's only action there, opening the Exception Request. */
  exception?: {
    requirement: { id: string; label: string } | undefined;
    approverRole: string;
    onSubmit: (document: AdditionalDocument) => void;
  };
}) {
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const preview = useOutcomePreview((s) => s.open);
  const [confirm, setConfirm] = useState<'payment' | 'approval' | 'prepaid' | null>(null);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const real: OutcomeKey | undefined = eligibility?.hardStop
    ? 'Hard Stop'
    : eligibility?.softStop
      ? 'Soft Stop'
      : eligibility?.checks.some((c) => c.outcome === 'approval-routing')
        ? 'Approval Routing'
        : undefined;
  const outcome = preview ?? real;

  const modal = (
    <Modal
      open={confirm !== null}
      onClose={() => setConfirm(null)}
      title={confirm === 'payment' ? 'Proceed to Payment?' : confirm === 'prepaid' ? 'Continue Prepaid?' : 'Request approval?'}
      footer={
        <>
          <Button variant="secondary" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const which = confirm;
              setConfirm(null);
              // Approval and prepaid confirmations only close the modal.
              if (which === 'payment')
                pushToast('info', 'Payment is not available from here yet', {
                  key: 'soft-stop-payment',
                  detail: 'Settling the outstanding balance is not part of this journey yet.',
                });
            }}
          >
            {confirm === 'payment' ? 'Proceed to Payment' : confirm === 'prepaid' ? 'Continue Prepaid' : 'Request Approval'}
          </Button>
        </>
      }
    >
      <p className="text-secondary">
        {confirm === 'payment'
          ? 'Continue to payment for this customer?'
          : confirm === 'prepaid'
            ? 'This will trigger the prepaid flow.'
            : 'The journey will continue and the order will be held for manager approval before it can be completed.'}
      </p>
    </Modal>
  );

  if (outcome === 'Hard Stop') {
    // An under-18 applicant: Apply for Exception is the only footer action (Abandon Order is in the page header) - no way past the age check.
    const underage = Boolean(exception) && Boolean(eligibility?.checks.some((c) => c.exceptionOffer === 'under-18'));
    if (underage && exception) {
      return (
        <div className="row">
          <Button variant="primary" onClick={() => setExceptionOpen(true)}>
            Apply for Exception
          </Button>
          <ExceptionRequestModal
            open={exceptionOpen}
            onClose={() => setExceptionOpen(false)}
            requirement={exception.requirement}
            approverRole={exception.approverRole}
            onSubmit={(d) => {
              setExceptionOpen(false);
              exception.onSubmit(d);
            }}
          />
        </div>
      );
    }
    // Nothing to continue to, and Abandon Order is in the page header: no footer action. An empty fragment, not null - the footer falls back to Continue on null.
    return <></>;
  }
  if (outcome === 'Soft Stop')
    return (
      <div className="row">
        <Button variant="secondary" onClick={() => setConfirm('prepaid')}>
          Continue Prepaid
        </Button>
        <Button variant="primary" onClick={() => setConfirm('payment')}>
          Proceed to Payment
        </Button>
        {modal}
      </div>
    );
  // Approval Routing: no separate button - the ordinary Continue applies, and
  // approval is requested when the order is submitted.
  return <>{defaultButton}</>;
}

import { useState } from 'react';
import { NumberSelection, RefreshNumbersButton } from '../../../capabilities';
import { StandaloneStepPage } from '../../../components/patterns/wizard/StandaloneStepPage';
import { WizardTitleBand } from '../../../components/patterns/wizard/WizardTitleBand';
import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { NUMBER_SELECTION_LABEL } from '../../../data/stepLabels';
import { Button } from '../../../components/primitives/Button';
import { toLocalMsisdn } from '../../../components/domain/msisdnPickerModel';
import { Modal } from '../../../components/primitives/Modal';
import { useSubmitGuard } from '../../../hooks/useSubmit';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useWorkflowStore } from '../../../stores/workflowStore';
import { ReserveNumberWizard, type ReservedNumber } from './ReserveNumberWizard';

// SCR-024: Number Management Portal - "search experience needs to be
// defined" per screens.md; the only evidenced field-level behaviour is the
// Free/Paid number category toggle, matching Pattern 10 (Number Selection/
// Reservation Step) already built for the activation wizards. Presented here
// as its own standalone portal rather than a wizard step.
//
// Choosing a number only selects it. "Reserve Number" then takes the agent to Customer Verification, and the number is reserved
// against the identified customer at the end of that journey.
export function NumberManagementPortal() {
  const [selected, setSelected] = useState<string | undefined>();
  const [price, setPrice] = useState(0);
  const [stage, setStage] = useState<'select' | 'identify' | 'done'>('select');
  const [reservedHere, setReservedHere] = useState<string[]>([]);
  const [last, setLast] = useState<ReservedNumber | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [releasing, setReleasing] = useState<string | undefined>();
  const [abandoning, setAbandoning] = useState(false);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const { guard, pending } = useSubmitGuard();

  // Unreserve: the number goes back to the inventory, available to anyone.
  const release = (msisdn: string) =>
    guard(async () => {
      await updateRecord('numbers', 'msisdn', msisdn, { status: 'AVAILABLE', reservedBy: undefined, reservedForQid: undefined, reservedAt: undefined });
      setReservedHere((prev) => prev.filter((m) => m !== msisdn));
      setSelected((cur) => (cur === msisdn ? undefined : cur));
      setReleasing(undefined);
      setRefreshKey((k) => k + 1);
      pushToast('success', `${toLocalMsisdn(msisdn)} is no longer reserved.`);
    });

  const backToSelect = () => {
    useWorkflowStore.getState().clearDraft('reserve-number');
    setStage('select');
  };

  if (stage === 'identify' && selected) {
    return (
      <div className="flex-1 min-h-full flex flex-col">
        <WizardTitleBand
          title="Reserve Number"
          titleAside={<span className="text-on-dark-2 text-[length:var(--fs-body)]">Identify the customer the number is reserved for.</span>}
          onAbandon={() => setAbandoning(true)}
          onRequestAbandon={() => setAbandoning(true)}
        />
        <ReserveNumberWizard
          msisdn={selected}
          priceQAR={price}
          onReserved={(r) => {
            setLast(r);
            setReservedHere((prev) => (prev.includes(r.msisdn) ? prev : [...prev, r.msisdn]));
            setSelected(undefined);
            setRefreshKey((k) => k + 1);
            setStage('done');
          }}
        />
        <Modal
          open={abandoning}
          onClose={() => setAbandoning(false)}
          title="Abandon this reservation?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setAbandoning(false)}>
                Keep working
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setAbandoning(false);
                  backToSelect();
                }}
              >
                Abandon
              </Button>
            </>
          }
        >
          <p className="text-fg-2 text-[length:var(--fs-body)]">The number stays available and nothing is reserved. You go back to the numbers.</p>
        </Modal>
      </div>
    );
  }

  if (stage === 'done' && last) {
    return (
      <StandaloneStepPage
        title="Number Management Portal"
        description="Search and reserve fixed/mobile numbers."
        step={{ key: 'reserved', label: 'Number Reserved', heading: `${toLocalMsisdn(last.msisdn)} is reserved`, render: () => null }}
      >
        <div className="space-y-4" role="status" aria-label="Number reserved">
          <p className="text-fg-2 text-[length:var(--fs-body)]">
            Held for <span className="text-fg font-medium">{last.customerName}</span> (ID {last.idNumber}). It appears under Reserved Numbers.
          </p>
          <Button variant="primary" onClick={() => setStage('select')}>
            Reserve another number
          </Button>
        </div>
      </StandaloneStepPage>
    );
  }

  const numberStep: WizardStep = {
    key: 'number',
    label: NUMBER_SELECTION_LABEL,
    headerAction: () => <RefreshNumbersButton onClick={() => setRefreshKey((k) => k + 1)} />,
    render: () => null,
  };

  return (
    <StandaloneStepPage
      title="Number Management Portal"
      description="Search and reserve fixed/mobile numbers."
      step={numberStep}
      canProceed={Boolean(selected)}
      onNext={() => {
        useWorkflowStore.getState().clearDraft('reserve-number');
        setStage('identify');
      }}
    >
      <NumberSelection
        variant="portal"
        value={selected}
        onChange={(msisdn, priceQAR) => {
          setSelected(msisdn);
          setPrice(priceQAR ?? 0);
        }}
        reservedHere={reservedHere}
        onUnreserve={setReleasing}
        refreshKey={refreshKey}
      />
      <span className="sr-only" aria-live="polite">
        {selected ? `Selected: ${toLocalMsisdn(selected)}` : ''}
      </span>
      <Modal
        open={Boolean(releasing)}
        onClose={() => setReleasing(undefined)}
        title="Unreserve this number?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReleasing(undefined)}>
              Keep reserved
            </Button>
            <Button variant="primary" disabled={pending} onClick={() => releasing && void release(releasing)}>
              Unreserve
            </Button>
          </>
        }
      >
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          {releasing ? toLocalMsisdn(releasing) : ''} goes back to the available numbers and is no longer held for the customer.
        </p>
      </Modal>
    </StandaloneStepPage>
  );
}

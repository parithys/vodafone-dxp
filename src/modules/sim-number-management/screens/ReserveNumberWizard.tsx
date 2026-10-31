import { useEffect } from 'react';
import { GuidedActivationWizard, idLookupStep } from '../../../capabilities';
import type { IdLookupValue } from '../../../components/patterns/idLookupModel';
import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { attachSummaries } from '../../../components/patterns/wizard/stepSummary';
import * as sums from '../../../components/patterns/wizard/commonSummaries';
import { Button } from '../../../components/primitives/Button';
import { MAX_RESERVATIONS_PER_AGENT, toLocalMsisdn } from '../../../components/domain/msisdnPickerModel';
import { FREE_NUMBER_PRICE_CEILING_QAR } from '../../../engines/postpaidPricing';
import { formatQar } from '../../../lib/format';
import { useAuthStore } from '../../../stores/authStore';
import { useEntityStore } from '../../../stores/entityStore';
import { useNotificationStore } from '../../../stores/notificationStore';

export interface ReservedNumber {
  msisdn: string;
  customerName: string;
  idNumber: string;
}

const WIZARD_ID = 'reserve-number';

/** Why the number cannot be reserved right now, or undefined when it can. Read from the live inventory, never assumed. */
function blockedReason(
  numbers: Record<string, unknown>[] | undefined,
  msisdn: string,
  agentName: string
): string | undefined {
  if (!numbers) return undefined;
  const held = numbers.filter((n) => n.status === 'Reserved' && n.reservedBy === agentName).length;
  if (held >= MAX_RESERVATIONS_PER_AGENT) return `You already hold ${MAX_RESERVATIONS_PER_AGENT} reserved numbers. Release one before reserving another.`;
  const record = numbers.find((n) => n.msisdn === msisdn);
  if (record && record.status !== 'AVAILABLE') return `${toLocalMsisdn(msisdn)} is ${String(record.status).toLowerCase()} and cannot be reserved.`;
  return undefined;
}

function ReserveSummary({ msisdn, priceQAR, values, setValue }: { msisdn: string; priceQAR: number; values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) {
  const loadKind = useEntityStore((s) => s.loadKind);
  const numbers = useEntityStore((s) => s.records['numbers']);
  const agentName = useAuthStore((s) => s.profile?.name) ?? '';
  const identity = values.identity as IdLookupValue | undefined;
  const reason = blockedReason(numbers, msisdn, agentName);
  useEffect(() => {
    void loadKind('numbers');
  }, [loadKind]);
  // Kept on the values so the step's Continue gate (a pure function of them) can read it.
  useEffect(() => {
    if (values.reserveBlocked !== reason) setValue('reserveBlocked', reason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason]);

  const star = priceQAR >= FREE_NUMBER_PRICE_CEILING_QAR;
  return (
    <div className="space-y-4">
      <div className="card p-4 card-surface space-y-2">
        <div className="flex justify-between gap-4">
          <span className="text-fg-2 text-[length:var(--fs-body)]">Number</span>
          <span className="text-fg font-bold text-[length:var(--fs-body)]">{toLocalMsisdn(msisdn)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-fg-2 text-[length:var(--fs-body)]">{star ? 'Star Number price' : 'Category'}</span>
          <span className="text-fg text-[length:var(--fs-body)]">{star ? formatQar(priceQAR) : 'Free'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-fg-2 text-[length:var(--fs-body)]">Reserved For</span>
          <span className="text-fg text-[length:var(--fs-body)] text-right">{identity?.moiResult?.name ?? '-'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-fg-2 text-[length:var(--fs-body)]">{identity?.idType ?? 'ID'} number</span>
          <span className="text-fg text-[length:var(--fs-body)]">{identity?.idNumber ?? '-'}</span>
        </div>
      </div>
      {reason ? (
        <p role="alert" className="text-danger text-[length:var(--fs-body)]">{reason}</p>
      ) : (
        <p className="text-fg-2 text-[length:var(--fs-caption)]">Reserving holds this number against the customer above until it is used on an order or released.</p>
      )}
    </div>
  );
}

/**
 * Reserve Number: the number chosen in the Number Management Portal is reserved against a customer. The agent identifies the customer
 * first (the shared Customer Verification: ID type, scan, MOI), then reviews and reserves. The reservation is written to the number
 * inventory (status Reserved, held by the agent, for the identified customer's ID) only at the last step; abandoning leaves the
 * number available.
 */
export function ReserveNumberWizard({
  msisdn,
  priceQAR,
  onReserved,
}: {
  msisdn: string;
  priceQAR: number;
  onReserved: (reserved: ReservedNumber) => void;
}) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const agentName = useAuthStore((s) => s.profile?.name) ?? '';

  const steps: WizardStep[] = attachSummaries(
    [
      idLookupStep({ key: 'contact', field: 'identity' }),
      {
        key: 'reserve',
        label: 'Reserve Number',
        heading: 'Reserve This Number',
        subheading: 'Check the details, then reserve the number for the customer.',
        render: ({ values, setValue }) => <ReserveSummary msisdn={msisdn} priceQAR={priceQAR} values={values} setValue={setValue} />,
        isValid: (values) => !values.reserveBlocked,
        primaryAction: ({ goNext, defaultButton, values }) => (values.reserveBlocked ? defaultButton : <Button variant="primary" onClick={goNext}>Reserve Number</Button>),
      },
    ],
    { contact: sums.identitySummary('identity') }
  );

  return (
    <GuidedActivationWizard
      wizardId={WIZARD_ID}
      title="Reserve Number"
      steps={steps}
      // The portal's page header carries the title and Abandon Order, so the wizard leaves its own band out.
      hideTitleBand
      onSubmit={async (values) => {
        const identity = values.identity as IdLookupValue;
        const patch = { status: 'Reserved', reservedBy: agentName, reservedForQid: identity.idNumber, reservedAt: new Date().toISOString() };
        await useEntityStore.getState().loadKind('numbers');
        const existing = (useEntityStore.getState().records['numbers'] ?? []).find((n) => n.msisdn === msisdn);
        if (!existing) throw new Error(`${msisdn} is not in the number inventory.`);
        await updateRecord('numbers', 'msisdn', msisdn, patch);
        pushToast('success', `${toLocalMsisdn(msisdn)} reserved for ${identity.moiResult?.name ?? 'the customer'}.`);
        onReserved({ msisdn, customerName: identity.moiResult?.name ?? '-', idNumber: identity.idNumber ?? '' });
      }}
    />
  );
}

import { useEffect, useMemo } from 'react';
import { Input } from '../primitives/Input';
import { Select } from '../primitives/Select';
import { PhoneNumberInput } from '../primitives/PhoneNumberInput';
import { idTypesFor, idTypeLabel } from '../../data/idTypes';
import {
  DONOR_CUSTOMER_TYPES,
  DONOR_OPERATOR,
  DONOR_SUBSCRIPTION_TYPES,
  normalizePortInNumber,
  portInNumberError,
  scheduledDateError,
  type PortInNumberContext,
} from '../../data/portInRules';
import { useEntityStore } from '../../stores/entityStore';

export interface DonorDetailsValue {
  /** DF-MNP-009: as typed; the order carries it normalised (974 + 8 digits). */
  portInNumber?: string;
  /** DF-MNP-010..014: the customer's identity at the donor operator, all chosen by the agent from what the customer states. */
  donorId?: string;
  donorIdType?: string;
  donorCustomerType?: string;
  donorOperator?: string;
  donorSubscriptionType?: string;
  /** DF-MNP-015: optional, must be a working day. */
  scheduledPortInDate?: string;
  /** Set by this step when the number cannot be ported in (already on Vodafone, or a request is already awaiting NPAS). */
  portInNumberBlocked?: string;
}

interface DonorDetailsStepProps {
  value: DonorDetailsValue;
  onChange: (value: DonorDetailsValue) => void;
}

/** Whether the donor details are complete and usable: every mandatory field, a valid number, a working-day date when one is given. */
export function donorDetailsValid(d: DonorDetailsValue | undefined): boolean {
  if (!d) return false;
  return Boolean(
    d.portInNumber && normalizePortInNumber(d.portInNumber) && !d.portInNumberBlocked && d.donorId?.trim()
      && d.donorIdType && d.donorCustomerType && d.donorOperator && d.donorSubscriptionType
      && !scheduledDateError(d.scheduledPortInDate)
  );
}

const optionsOf = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }));
const IN_FLIGHT = new Set(['Pending NPAS Approval', 'Submitted', 'Pending Payment', 'NPAS Approved']);

// SCR-126 / MNP BRSD V1.1 (MNP_PI_001_QPC_03, DF-MNP-009..015): the Port-In number and the donor customer ID, ID type, customer
// type and subscription type are captured by the agent from the customer; the operator (Other Operator, the only one) is set. The number is checked before submission:
// Qatar mobile format, not already on Vodafone's own inventory, no other request for it awaiting NPAS. Whether it is an active,
// portable subscription at the donor is NPAS's to say (OI-MNP-003, open); a "no" arrives as a rejection reason, not as a check here.
export function DonorDetailsStep({ value, onChange }: DonorDetailsStepProps) {
  const loadKind = useEntityStore((s) => s.loadKind);
  const requests = useEntityStore((s) => s.records['mnp-portin-orders']);
  const numbers = useEntityStore((s) => s.records['numbers']);
  useEffect(() => {
    void loadKind('mnp-portin-orders');
    void loadKind('numbers');
  }, [loadKind]);

  const ctx = useMemo<PortInNumberContext>(() => {
    const norm = (raw: unknown) => normalizePortInNumber(String(raw ?? ''));
    return {
      inFlight: new Set((requests ?? []).filter((r) => IN_FLIGHT.has(String(r.orderStatus))).map((r) => norm(r.portInNumber)).filter((n): n is string => Boolean(n))),
      vodafone: new Set((numbers ?? []).map((n) => norm(n.msisdn)).filter((n): n is string => Boolean(n))),
    };
  }, [requests, numbers]);

  const number = value.portInNumber ?? '';
  const numberError = portInNumberError(number, ctx);
  const formatOnly = number ? portInNumberError(number) : undefined;
  const blocked = !formatOnly && numberError ? numberError : undefined;

  // The check that needs the stores is kept on the value, so the step's Continue gate (a pure function of the values) can read it.
  // The donor operator (Other Operator is the only one) is set here, not asked for.
  useEffect(() => {
    const patch: DonorDetailsValue = {};
    if ((value.portInNumberBlocked ?? undefined) !== blocked) patch.portInNumberBlocked = blocked;
    if (value.donorOperator !== DONOR_OPERATOR) patch.donorOperator = DONOR_OPERATOR;
    if (Object.keys(patch).length > 0) onChange({ ...value, ...patch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked]);

  const normalised = normalizePortInNumber(number);
  const dateError = scheduledDateError(value.scheduledPortInDate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* The standard mobile number field: Qatar (+974) fixed, 8 national digits. It stores +974XXXXXXXX, which normalizePortInNumber reads. */}
        <PhoneNumberInput
          label="Port-In Number"
          required
          fixedIso="QA"
          maxNationalDigits={8}
          value={number}
          placeholder="66000666"
          error={number ? numberError : undefined}
          helperText={normalised && !numberError ? `Ported as ${normalised}. This is the number on the order; it cannot be changed in the journey.` : 'The number the customer is bringing to Vodafone.'}
          onChange={(e) => onChange({ ...value, portInNumber: e.target.value })}
        />
        <Input label="Donor Customer ID" required value={value.donorId ?? ''} helperText="The customer's ID number at the donor operator." onChange={(e) => onChange({ ...value, donorId: e.target.value })} />
        <Select
          label="Donor ID Type"
          required
          placeholder="Select ID type"
          value={value.donorIdType ?? ''}
          onChange={(e) => onChange({ ...value, donorIdType: e.target.value })}
          options={idTypesFor('donor').map((t) => ({ value: t, label: idTypeLabel(t) }))}
        />
        <Select
          label="Donor Customer Type"
          required
          placeholder="Select customer type"
          value={value.donorCustomerType ?? ''}
          onChange={(e) => onChange({ ...value, donorCustomerType: e.target.value })}
          options={optionsOf(DONOR_CUSTOMER_TYPES)}
        />
        <Select
          label="Donor Subscription Type"
          required
          placeholder="Select subscription type"
          value={value.donorSubscriptionType ?? ''}
          onChange={(e) => onChange({ ...value, donorSubscriptionType: e.target.value })}
          options={optionsOf(DONOR_SUBSCRIPTION_TYPES)}
        />
        <Input
          label="Scheduled Port-In Date (Optional)"
          type="date"
          value={value.scheduledPortInDate ?? ''}
          error={dateError}
          helperText="Leave empty to port in the first window after NPAS approves."
          onChange={(e) => onChange({ ...value, scheduledPortInDate: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}

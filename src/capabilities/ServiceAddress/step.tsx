import { SERVICE_ADDRESS_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { ServiceAddress } from './ServiceAddress';
import { addressSummary } from './summary';
import type { ZsbAddressValue } from '../../components/patterns/ZsbAddressStep';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';
import type { PrefilledAddress } from '../../components/patterns/addressFromBilling';
import { AddressPrefill } from './AddressPrefill';
import { DemoAddressSeed } from './DemoAddressSeed';

/**
 * Service address: stores a ZSB address under `address`. `identity` reads the customer's ID number / nationality from the
 * values (from Customer Verification) so a Qatari's registered address is prefilled. Mandatory: No per FLD-523-526 - the
 * address never gates progression (the Skip Address affordance).
 */
export function serviceAddressStep(
  opts: {
    /** Kept for existing callers; the only mode. */
    mode?: 'structured';
    identity?: (values: Record<string, unknown>) => { idNumber?: string; nationality?: string } | undefined;
    /** Continue passes over the step (it stays in the rail so the agent can come back and edit it). The address is then filled for the agent from the
     *  billing profile, or with placeholders when there is none (AddressPrefill). */
    autoPass?: boolean;
    /** Show the Kahramaa Meter ID / Vodafone Premise ID card (default yes). A mobile line needs no serviceable premises, so its journey passes false. */
    serviceIds?: boolean;
    /** Whether the journey has a billing profile (default yes; a prepaid line has none, so its address is the placeholder). */
    billing?: (values: Record<string, unknown>) => boolean;
 }
): WizardStep {
  return {
    key: 'address',
    label: SERVICE_ADDRESS_LABEL,
    summary: addressSummary,
    ...(opts.autoPass
      ? {
          autoPass: () => true,
          headless: ({ values, setValue }: { values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) => (
            <AddressPrefill
              address={values.address as PrefilledAddress | undefined}
              billing={values.billingAccount as BillingAccountValue | undefined}
              billingApplies={opts.billing ? opts.billing(values) : true}
              onChange={(v) => setValue('address', v)}
            />
          ),
        }
      : {}),
    render: ({ values, setValue }) => {
      const who = opts.identity?.(values);
      return (
        <>
        <DemoAddressSeed address={values.address as PrefilledAddress | undefined} onChange={(v) => setValue('address', v)} />
        <ServiceAddress
          value={(values.address as ZsbAddressValue) ?? {}}
          // An agent's edit makes the address theirs: the prefill marker goes, so it is never overwritten.
          onChange={(v) => setValue('address', { ...v, prefilledKey: undefined })}
          idNumber={who?.idNumber}
          nationality={who?.nationality}
          showServiceIds={opts.serviceIds}
        />
        </>
      );
    },
    isValid: () => true,
 };
}

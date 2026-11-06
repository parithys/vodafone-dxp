import { SIM_SERIAL_LABEL, SIM_TYPE_LABEL } from '../../data/stepLabels';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { displayedEmail } from '../../components/patterns/guidedContactModel';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import type { DeviceType } from '../../lib/deviceType';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { SimType } from './SimType';
import { SimSerial } from './SimSerial';
import { simTypeSummary, multiSimSummary } from './summary';
import { TrimMultiSims } from './TrimMultiSims';
import { MultiSimPanel } from '../../components/domain/MultiSimPanel';
import { allMultiSimsComplete, hasDuplicateSerial, iccidsOfEsims, multiSimsFor } from './multiSimModel';
import { Checkbox } from '../../components/primitives/Checkbox';
import { ActualUser } from '../ActualUser/ActualUser';
import { isActualUserValid } from '../ActualUser/actualUserModel';
import type { ActualUserValue } from '../ActualUser/actualUserModel';
import { actualUserSummary } from '../ActualUser/summary';
import { PrepaidMobileNumber, PrepaidSimCharge } from './PrepaidSimPanels';
import { simPairingOf } from '../../components/patterns/simPairing';
import type { MsisdnSource } from './prepaidNumberAllocation';

/**
 * SIM type, stored under `simType`. Physical is complete once the serial validates; eSIM once it is issued. A
 * validated Physical SIM moves the journey on by itself ("on a successful complete scan ... automatically
 * continue", 2026-09-28); eSIM stays a manual Continue - it is a choice to review (QR-after-payment messaging,
 * customer email), not a validation result to act on at once.
 *
 * `customerEmail` is where an eSIM's QR code is sent; by default the email captured at Customer Verification,
 * masked for a new customer. `device` makes the serial field scan-led on a tablet and type-led on the web.
 */
export function simTypeStep(
  opts: {
    customerEmail?: (values: Record<string, unknown>) => string | undefined;
    device?: DeviceType;
    /** Says the agent chose a Pre-Paired SIM: the step scans one from the Pre-Paired inventory and takes the MSISDN from it. */
    prePaired?: (values: Record<string, unknown>) => boolean;
    /** Says the order will be held for approval, so the eSIM message names approval rather than submission. */
    approvalRequired?: (values: Record<string, unknown>) => boolean;
    /**
     * Offer an "Add Secondary Contact" checkbox above the Continue row: ticking it opens the Secondary Contact section on this same page (stored under `actualUser`), and once it is
     * open its identification gates Continue. For a journey that names who will use the line without a step of its own for it.
     */
    withActualUser?: boolean;
    /**
     * How many Multi-SIMs this order provisions (0 to 4, decided by the plan and add-ons - see engines/multiSim.ts). Above 0 the page titles the primary SIM
     * "Primary SIM Selection" and adds a "Multi-SIM Selection" section with one SIM selection per Multi-SIM, kept under `multiSims`. Each takes a Physical SIM
     * (scanned or typed) or an eSIM exactly as the primary does; the number each is given is assigned by the system at submission and is never shown.
     */
    multiSimCount?: (values: Record<string, unknown>) => number;
    /**
     * New Prepaid activation: the page shows the order's mobile number read-only (allocated from the Free pool when none was chosen, which the agent may keep or replace) above
     * the SIM and, once the SIM is selected, its container (type, serial number, Paired / Unpaired) with the SIM charge under it. `idType`, `rechargeId` and `productId` feed the charge rules.
     */
    prepaidActivation?: { idType: (values: Record<string, unknown>) => string | undefined };
  } = {}
): WizardStep {
  const fromContact = (values: Record<string, unknown>) => {
    const contact = values.contact as GuidedContactValue | undefined;
    return displayedEmail(contact);
  };
  const primaryId = (values: Record<string, unknown>) => (values.contact as GuidedContactValue | undefined)?.idNumber;
  const primaryCustomerId = (values: Record<string, unknown>) => (values.eligibility as { customerId?: string } | undefined)?.customerId;
  const primaryNationality = (values: Record<string, unknown>) => (values.eligibility as { nationality?: string } | undefined)?.nationality ?? (values.contact as GuidedContactValue | undefined)?.moiResult?.nationality;
  // The SIM is selected once its type is chosen and it is valid (a Physical SIM's serial, an eSIM issued, or a Pre-Paired SIM).
  const simSelected = (values: Record<string, unknown>) => {
    const s = values.simType as SimTypeValue | undefined;
    if (opts.prePaired?.(values)) return s?.prePaired === true && s.simValid === true;
    return (s?.simType === 'Physical' && s.simValid === true) || (s?.simType === 'eSIM' && s.esimIssued === true);
  };
  const multiCount = (values: Record<string, unknown>) => Math.max(0, opts.multiSimCount?.(values) ?? 0);
  const actualUserOpen = (values: Record<string, unknown>) => Boolean(opts.withActualUser) && (values.actualUser as ActualUserValue | undefined)?.choice === 'other';
  return {
    key: 'simType',
    summary: [...simTypeSummary, ...(opts.multiSimCount ? multiSimSummary : []), ...(opts.withActualUser ? actualUserSummary : [])],
    label: SIM_TYPE_LABEL,
    // Once Multi-SIMs apply the existing section is the primary's; with none the title stays "SIM Selection".
    headingFor: (values) => (multiCount(values) > 0 ? 'Primary SIM Selection' : undefined),
    headless: opts.multiSimCount ? ({ values, setValue }) => <TrimMultiSims count={multiCount(values)} values={values} setValue={setValue} /> : undefined,
    render: ({ values, setValue }) => (
      <>
      {opts.prepaidActivation && (
        <PrepaidMobileNumber
          msisdn={values.msisdn as string | undefined}
          source={values.msisdnSource as MsisdnSource | undefined}
          prePaired={Boolean(opts.prePaired?.(values))}
          onChange={(msisdn, price, source) => {
            // The Free pool carries no price; a different number carries no waiver of the old one's charge.
            if (msisdn !== values.msisdn) setValue('numberWaiver', undefined);
            setValue('msisdn', msisdn);
            setValue('priceQAR', price);
            setValue('msisdnSource', source);
          }}
        />
      )}
      <SimType
        excludeSerials={multiCount(values) > 0 ? multiSimsFor(values, multiCount(values)).map((x) => x.simSerial).filter((x): x is string => Boolean(x)) : undefined}
        excludeIccids={multiCount(values) > 0 ? iccidsOfEsims({ multiSims: values.multiSims }, multiCount(values)) : undefined}
        value={(values.simType as SimTypeValue) ?? {}}
        customerEmail={(opts.customerEmail ?? fromContact)(values)}
        device={opts.device}
        prePaired={opts.prePaired?.(values)}
        approvalRequired={opts.approvalRequired?.(values)}
        // New Prepaid: Paired / Unpaired is part of the selected SIM's green container.
        extraRows={opts.prepaidActivation ? [['Paired / Unpaired', simPairingOf(values.simType as SimTypeValue | undefined)]] : undefined}
        onChange={(v) => {
          setValue('simType', v);
          // A Pre-Paired SIM brings its own number, which is what the rest of the journey reads as the MSISDN.
          if (opts.prePaired?.(values)) setValue('msisdn', v.prePairedMsisdn);
        }}
      />
      {opts.prepaidActivation && (
        <PrepaidSimCharge sim={values.simType as SimTypeValue | undefined} idType={opts.prepaidActivation.idType(values)} rechargeId={values.rechargeId as string | undefined} productId={values.productId as string | undefined} />
      )}
      {multiCount(values) > 0 && (
        <section aria-labelledby="multi-sim-title" className="mt-8 pt-6 divider-top stack gap-6">
          <div>
            <h3 id="multi-sim-title" className="title title-lg">Multi-SIM Selection</h3>
            <p className="text-secondary mt-1">Provision {multiCount(values) === 1 ? 'the Multi-SIM' : `the ${multiCount(values)} Multi-SIMs`} included with this order.</p>
          </div>
          <MultiSimPanel
            count={multiCount(values)}
            value={multiSimsFor(values, multiCount(values))}
            onChange={(v) => setValue('multiSims', v)}
            device={opts.device}
            approvalRequired={opts.approvalRequired?.(values)}
            otherSerials={[(values.simType as SimTypeValue | undefined)?.simSerial].filter((x): x is string => Boolean(x))}
            otherIccids={[values.simType as SimTypeValue | undefined].filter((x) => x?.simType === 'eSIM').map((x) => x?.simIccid).filter((x): x is string => Boolean(x))}
          />
        </section>
      )}
      {/* "Add Secondary Contact": ticked once a SIM is chosen (or while the section is open); unticking removes the section and everything entered in it. */}
      {opts.withActualUser && (simSelected(values) || actualUserOpen(values)) && (
        <label className="mt-8 flex w-fit choice-label">
          <Checkbox
            checked={actualUserOpen(values)}
            onChange={(e) => setValue('actualUser', e.target.checked ? { ...((values.actualUser as ActualUserValue | undefined) ?? {}), choice: 'other' } : undefined)}
          />
          Add Secondary Contact
        </label>
      )}
      {actualUserOpen(values) && (
        <section aria-label="Secondary Contact" className="mt-4 pt-6 divider-top space-y-4">
          <ActualUser hideChoice value={(values.actualUser as ActualUserValue) ?? {}} onChange={(v) => setValue('actualUser', v)} primaryIdNumber={primaryId(values)} primaryCustomerId={primaryCustomerId(values)} primaryNationality={primaryNationality(values)} />
        </section>
      )}
      </>
    ),
    isValid: (values) => {
      const s = values.simType as SimTypeValue | undefined;
      // Once the Actual User section is open, the person must be identified too (choosing "Same as Primary Customer" in it is complete).
      if (opts.withActualUser && !isActualUserValid(values.actualUser as ActualUserValue | undefined, primaryId(values))) return false;
      // Every Multi-SIM provisioned, and no SIM serial used twice in the order.
      if (multiCount(values) > 0 && (!allMultiSimsComplete(values, multiCount(values)) || hasDuplicateSerial(values, multiCount(values)))) return false;
      if (opts.prePaired?.(values)) return s?.prePaired === true && s.simValid === true && Boolean(values.msisdn);
      // New Prepaid: the order's number (chosen, or allocated from the Free pool) is carried with the SIM; without it there is nothing to activate.
      if (opts.prepaidActivation && !values.msisdn) return false;
      if (s?.simType === 'Physical') return s.simValid === true;
      if (s?.simType === 'eSIM') return s.esimIssued === true;
      return false;
    },
  };
}

/**
 * SIM serial only, stored under `simSerial` with its validity under `simValid` and the ICCID / stock status / kind read from inventory
 * under `simDetails` - for journeys that put a new SIM in a number without choosing a type (port-in). Once the serial is scanned or
 * entered and validates, the journey moves on by itself: nothing is left for the agent to confirm.
 */
export function simSerialStep(): WizardStep {
  return {
    key: 'sim',
    label: SIM_SERIAL_LABEL,
    render: ({ values, setValue }) => (
      <SimSerial
        value={(values.simSerial as string) ?? ''}
        onChange={(v, valid, details) => {
          setValue('simSerial', v);
          setValue('simValid', valid);
          // Only a validated serial has details; an edit or a failed check clears the previous SIM's.
          setValue('simDetails', valid && details ? details : undefined);
        }}
      />
    ),
    isValid: (values) => values.simValid === true,
    autoAdvanceWhen: (values) => values.simValid === true && Boolean(values.simSerial),
  };
}

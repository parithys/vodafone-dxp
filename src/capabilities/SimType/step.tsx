import { SIM_SERIAL_LABEL, SIM_TYPE_LABEL } from '../../data/stepLabels';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { displayedEmail } from '../../components/patterns/guidedContactModel';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import type { DeviceType } from '../../lib/deviceType';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { SimType } from './SimType';
import { SimSerial } from './SimSerial';
import { simTypeSummary } from './summary';
import { Checkbox } from '../../components/primitives/Checkbox';
import { ActualUser } from '../ActualUser/ActualUser';
import { isActualUserValid } from '../ActualUser/actualUserModel';
import type { ActualUserValue } from '../ActualUser/actualUserModel';
import { actualUserSummary } from '../ActualUser/summary';

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
  } = {}
): WizardStep {
  const fromContact = (values: Record<string, unknown>) => {
    const contact = values.contact as GuidedContactValue | undefined;
    return displayedEmail(contact);
  };
  const primaryId = (values: Record<string, unknown>) => (values.contact as GuidedContactValue | undefined)?.idNumber;
  const primaryCustomerId = (values: Record<string, unknown>) => (values.eligibility as { customerId?: string } | undefined)?.customerId;
  // The SIM is selected once its type is chosen and it is valid (a Physical SIM's serial, an eSIM issued, or a Pre-Paired SIM).
  const simSelected = (values: Record<string, unknown>) => {
    const s = values.simType as SimTypeValue | undefined;
    if (opts.prePaired?.(values)) return s?.prePaired === true && s.simValid === true;
    return (s?.simType === 'Physical' && s.simValid === true) || (s?.simType === 'eSIM' && s.esimIssued === true);
  };
  const actualUserOpen = (values: Record<string, unknown>) => Boolean(opts.withActualUser) && (values.actualUser as ActualUserValue | undefined)?.choice === 'other';
  return {
    key: 'simType',
    summary: opts.withActualUser ? [...simTypeSummary, ...actualUserSummary] : simTypeSummary,
    label: SIM_TYPE_LABEL,
    render: ({ values, setValue }) => (
      <>
      <SimType
        value={(values.simType as SimTypeValue) ?? {}}
        customerEmail={(opts.customerEmail ?? fromContact)(values)}
        device={opts.device}
        prePaired={opts.prePaired?.(values)}
        approvalRequired={opts.approvalRequired?.(values)}
        onChange={(v) => {
          setValue('simType', v);
          // A Pre-Paired SIM brings its own number, which is what the rest of the journey reads as the MSISDN.
          if (opts.prePaired?.(values)) setValue('msisdn', v.prePairedMsisdn);
        }}
      />
      {/* "Add Secondary Contact": ticked once a SIM is chosen (or while the section is open); unticking removes the section and everything entered in it. */}
      {opts.withActualUser && (simSelected(values) || actualUserOpen(values)) && (
        <label className="mt-8 flex w-fit cursor-pointer items-center gap-2 text-fg text-[length:var(--fs-body)]">
          <Checkbox
            checked={actualUserOpen(values)}
            onChange={(e) => setValue('actualUser', e.target.checked ? { ...((values.actualUser as ActualUserValue | undefined) ?? {}), choice: 'other' } : undefined)}
          />
          Add Secondary Contact
        </label>
      )}
      {actualUserOpen(values) && (
        <section aria-label="Secondary Contact" className="mt-4 pt-6 border-t border-border-soft space-y-4">
          <ActualUser hideChoice value={(values.actualUser as ActualUserValue) ?? {}} onChange={(v) => setValue('actualUser', v)} primaryIdNumber={primaryId(values)} primaryCustomerId={primaryCustomerId(values)} />
        </section>
      )}
      </>
    ),
    isValid: (values) => {
      const s = values.simType as SimTypeValue | undefined;
      // Once the Actual User section is open, the person must be identified too (choosing "Same as Primary Customer" in it is complete).
      if (opts.withActualUser && !isActualUserValid(values.actualUser as ActualUserValue | undefined, primaryId(values))) return false;
      if (opts.prePaired?.(values)) return s?.prePaired === true && s.simValid === true && Boolean(values.msisdn);
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

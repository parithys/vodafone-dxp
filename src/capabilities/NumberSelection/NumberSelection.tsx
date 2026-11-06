import { MsisdnPicker } from '../../components/domain/MsisdnPicker';
import { Checkbox } from '../../components/primitives/Checkbox';
import type { NumberPickerProfile } from '../../components/domain/msisdnPickerModel';

/**
 * NUMBER SELECTION - the one application-wide capability for choosing a number: search, the Free and Star bands,
 * the Star price-range filter, the plan's Star entitlement note, reservation, and choosing the same number again
 * to clear it.
 *
 * Journeys mount THIS component (usually through numberSelectionStep in wizard/wizardSteps) and state what their
 * context needs; none of them wires MsisdnPicker itself.
 *
 *   variant   'journey' (default): inside a guided journey.
 *             'portal': the standalone Number Management Portal (its own tab order and Reserved tab). Same look either way.
 *   prePaired the journey offers a Pre-Paired SIM (Mobile Prepaid BRSD MPRA_001_NUM_02): choosing it bypasses number
 *             selection, because the number is already on the SIM scanned at the SIM step.
 *   plan      the selected plan's MRC / Star entitlement, when the journey has chosen one, for the
 *             "Star Number up to QAR x is free" note. Omitted where no plan is known.
 */
export interface NumberSelectionProps {
  /** The chosen number, if any. */
  value?: string;
  /** A number was chosen (with its catalogue price) or, with no arguments, the choice was cleared. */
  onChange: (msisdn?: string, priceQAR?: number) => void;
  variant?: 'journey' | 'portal';
  plan?: { mrcQar?: number; starEntitlementQar?: number };
  /** Changes when the agent presses Refresh: the number inventory is read again. */
  refreshKey?: number;
  /** Offer "Use a Pre-Paired SIM" beside picking a number. `checked` hides the picker; the number then comes from the SIM. */
  prePaired?: { checked: boolean; onChange: (checked: boolean) => void };
  /** Portal only: the numbers reserved in this portal session, listed on its Reserved tab. */
  reservedHere?: string[];
  /** Journey: the customer's ID number; the Reserved tab lists only holds placed for it. */
  customerIdNumber?: string;
  /** Portal only: an Unreserve button on each Reserved Numbers card. */
  onUnreserve?: (msisdn: string) => void;
  /** What the journey says about the content by role and plan (Mobile Prepaid: tabs by role, no sorting, no Star lock-in, no plan entitlement). Omitted: as it always was. */
  profile?: NumberPickerProfile;
}

export function NumberSelection({ value, onChange, variant = 'journey', plan, refreshKey, prePaired, reservedHere, onUnreserve, customerIdNumber, profile }: NumberSelectionProps) {
  const inJourney = variant === 'journey';
  const picker = (
    <MsisdnPicker
      selected={value}
      onSelect={(msisdn, priceQAR) => onChange(msisdn, priceQAR)}
      // Choosing a number again clears the choice, in a journey and in the portal alike (in the portal, choosing only selects; the
      // reservation is made after Customer Verification).
      onDeselect={() => onChange()}
      refreshKey={refreshKey}
      planMrcQar={plan?.mrcQar}
      starEntitlementQar={plan?.starEntitlementQar}
      hideReservedBadge={inJourney}
      // The portal alone has its own tab order (Star, Free, Reserved) and shows no number that was already held.
      portalMode={!inJourney}
      reservedHere={reservedHere}
      customerIdNumber={inJourney ? customerIdNumber : undefined}
      onUnreserve={inJourney ? undefined : onUnreserve}
      profile={profile}
    />
  );
  if (!prePaired) return picker;
  return (
    <div className="space-y-4">
      <label className="row-start cursor-pointer card card-inherit-fill p-4">
        <Checkbox className="mt-1" checked={prePaired.checked} onChange={(e) => prePaired.onChange(e.target.checked)} />
        <span>
          <span className="block value-text">Use a Pre-Paired SIM</span>
          <span className="block caption-secondary">
            The number is already on the SIM, so number selection is skipped. The SIM is scanned in the next step.
          </span>
        </span>
      </label>
      {prePaired.checked ? (
        <p role="status" className="placeholder-box pad-panel">
          No number to choose: it is shown, read-only, once the Pre-Paired SIM is scanned.
        </p>
      ) : (
        picker
      )}
    </div>
  );
}

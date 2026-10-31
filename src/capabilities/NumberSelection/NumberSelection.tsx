import { MsisdnPicker } from '../../components/domain/MsisdnPicker';
import { Checkbox } from '../../components/primitives/Checkbox';

/**
 * NUMBER SELECTION - the one application-wide capability for choosing a number: search, the Free and Star bands,
 * the Star price-range filter, the plan's Star entitlement note, reservation, and choosing the same number again
 * to clear it.
 *
 * Journeys mount THIS component (usually through numberSelectionStep in wizard/wizardSteps) and state what their
 * context needs; none of them wires MsisdnPicker itself.
 *
 *   variant   'journey' (default): inside a guided journey - search and sort on one row.
 *             'portal': the standalone Number Management Portal.
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
}

export function NumberSelection({ value, onChange, variant = 'journey', plan, refreshKey, prePaired, reservedHere, onUnreserve, customerIdNumber }: NumberSelectionProps) {
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
      inlineToolbar={inJourney}
      hideReservedBadge={inJourney}
      // The portal alone has its own tab order (Star, Free, Reserved) and shows no number that was already held.
      portalMode={!inJourney}
      reservedHere={reservedHere}
      customerIdNumber={inJourney ? customerIdNumber : undefined}
      onUnreserve={inJourney ? undefined : onUnreserve}
    />
  );
  if (!prePaired) return picker;
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg p-4">
        <Checkbox className="mt-1" checked={prePaired.checked} onChange={(e) => prePaired.onChange(e.target.checked)} />
        <span>
          <span className="block text-fg font-medium text-[length:var(--fs-body)]">Use a Pre-Paired SIM</span>
          <span className="block text-fg-2 text-[length:var(--fs-caption)]">
            The number is already on the SIM, so number selection is skipped. The SIM is scanned in the next step.
          </span>
        </span>
      </label>
      {prePaired.checked ? (
        <p role="status" className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-soft)] px-5 py-4 text-muted text-[length:var(--fs-caption)]">
          No number to choose: it is shown, read-only, once the Pre-Paired SIM is scanned.
        </p>
      ) : (
        picker
      )}
    </div>
  );
}

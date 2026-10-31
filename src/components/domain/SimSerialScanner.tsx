import { useEffect, useRef, useState } from 'react';
import { Input } from '../primitives/Input';
import { Icon } from '../primitives/Icon';
import { Button } from '../primitives/Button';
import type { DeviceType } from '../../lib/deviceType';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { SIM_RESERVED } from '../../data/portInRules';

interface SimRecord {
  simSerial: string;
  iccid: string;
  stockStatus: string;
  /** 'Physical' or 'Printed eSIM' (a card stocked in store that carries an eSIM profile). */
  type?: string;
  /** A Pre-Paired SIM already carries its MSISDN (Mobile Prepaid BRSD MPRA_001_SIM_02). */
  prePaired?: boolean;
  msisdn?: string;
}

/** A row of bars of varying width, standing in for a 1D barcode symbol at the
 * small size this renders at (the field's trailing icon, ~16px) - same icon
 * as QidInput.tsx's barcode scan trigger, for the same control elsewhere in
 * the app. */
const BARCODE_ICON = 'M3 4v16 M6 4v16 M8 4v16 M11 4v16 M13 4v16 M14 4v16 M17 4v16 M19 4v16 M21 4v16';

interface SimSerialScannerProps {
  value: string;
  /**
   * `details` carries ICCID/Stock Status the moment validation succeeds
   * (2026-09-28 request: "display SIM Type, SIM Serial Number, ICCID, and
   * Stock Status") - undefined on every other call, including a failed
   * validation, since there is nothing confirmed to report then.
   */
  onChange: (value: string, valid: boolean, details?: SimDetails) => void;
  /** Set by SimTypeStep only (2026-09-28 "Default focus to the Physical SIM
   * Serial Number scan field") - other callers of this same component keep
   * their existing behaviour, since this defaults to false/unset. */
  autoFocus?: boolean;
  /**
   * Set by SimTypeStep only, true while eSIM is the agent's current choice
   * (2026-09-28: "Require either eSIM selection or SIM Serial Number. If
   * eSIM is selected, suppress the 'SIM Serial is required' validation
   * error."). The wizard step's own isValid already treats the two paths as
   * alternatives - this fixes the display bug where the unused Physical
   * panel still ran its own blur validation and showed an error for a field
   * the agent was never going to fill in. Other callers omit this and keep
   * validating normally.
   */
  suppressValidation?: boolean;
  /**
   * The device the journey is running on. Only the journeys that adapt to the device pass it; the rest are unchanged.
   *   tablet  scan-led: a full-width "Scan SIM barcode" button under the field, a larger scan icon, and no autofocus so
   *           the on-screen keyboard does not cover the screen before the agent has chosen to type.
   *   web     type-led: the field takes focus on arrival; the scan icon stays as the alternative.
   */
  device?: DeviceType;
  /**
   * Which stock the serial is read from. 'standard' (default): ordinary SIMs - a Pre-Paired SIM is refused, since
   * selling it would fix the customer's number without the agent choosing it. 'pre-paired': only Pre-Paired SIMs,
   * and the validated details carry the MSISDN already on the SIM.
   */
  inventory?: 'standard' | 'pre-paired';
  /** The field label; "SIM Serial Number" unless the journey names the SIM kind. */
  label?: string;
}

export type SimDetails = { iccid: string; stockStatus: string; simKind?: string; msisdn?: string };

/** Judges a serial against store stock: what is wrong with it, or the details of the SIM it is. The one definition both the field and the read-back use. */
export async function checkSimSerial(serial: string, inventory: 'standard' | 'pre-paired' = 'standard'): Promise<{ error: string; details?: undefined } | { error?: undefined; details: SimDetails }> {
  const prePairedStock = inventory === 'pre-paired';
  const sims = await mockDataEngine.list<SimRecord>('sims');
  const found = sims.find((s) => s.simSerial === serial);
  if (found && Boolean(found.prePaired) !== prePairedStock) {
    return { error: prePairedStock ? 'This is not a Pre-Paired SIM.' : 'This is a Pre-Paired SIM - choose "Use a Pre-Paired SIM" on the Number step.' };
  }
  // Phrased as store stock rather than "inventory": the agent is standing at one counter and can only issue what is in front of them,
  // so the actionable fact is that THIS store does not hold it.
  if (!found) return { error: prePairedStock ? "Pre-Paired SIM not found in this store's stock." : "SIM not found in this store's stock." };
  if (found.stockStatus === 'Issued') return { error: 'This SIM is already assigned.' };
  // Held for a port-in awaiting NPAS (MNP BR-MNP-008/025): not available to another order until it is released.
  if (found.stockStatus === SIM_RESERVED) return { error: 'This SIM is reserved for another order.' };
  return { details: { iccid: found.iccid, stockStatus: found.stockStatus, simKind: found.type, msisdn: found.msisdn } };
}

// Pattern 11: SIM/Device Serial Capture with Real-Time Inventory Validation -
// barcode-scan input validated against UIM/inventory in real time; blocks
// Continue with an inline error if blank/not-found/already-assigned
// (SCR-093/099/124/158/192).
//
// 2026-09-27 walkthrough added two things: an explicit "Scan SIM" ACTION
// (scanning was previously only implied by placeholder text, so the barcode
// path was invisible unless the agent read the grey hint), and a positive
// stock readout - the step used to say nothing at all when a serial was good,
// so "available in this store's stock" was indistinguishable from "not checked
// yet".
export function SimSerialScanner({ value, onChange, autoFocus, suppressValidation, device, inventory = 'standard', label = 'SIM Serial Number' }: SimSerialScannerProps) {
  const prePairedStock = inventory === 'pre-paired';
  const touch = device === 'tablet';
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [scanning, setScanning] = useState(false);
  // The validated SIM, read back under the field. Kept here, in the one implementation every journey mounts, so none has to show it.
  const [shown, setShown] = useState<{ serial: string; details: SimDetails } | undefined>();
  // Re-reads a serial the journey already holds (Back to the step): the field does not re-validate on arrival.
  useEffect(() => {
    if (!value || suppressValidation || shown?.serial === value) return;
    let live = true;
    void checkSimSerial(value, inventory).then((r) => {
      if (!live) return;
      if (r.details) {
        // The read-back is shown only for a serial that is in stock, so the journey is told it is valid too: a serial typed or pasted into the
        // field (not scanned, not yet blurred) used to show the green read-back while Continue stayed disabled.
        setShown({ serial: value, details: r.details });
        onChange(value, true, r.details);
      }
    });
    return () => {
      live = false;
    };
  }, [value, inventory, suppressValidation, shown?.serial]);
  // True from the moment the scan icon is pressed until the scan has filled the
  // field. Pressing the icon moves focus off the (empty) input, and that blur
  // would otherwise validate the blank value and flash "SIM Serial is required."
  // until the scan populates it - an error about a field the agent is in the
  // middle of filling. Set on pointer-down, i.e. BEFORE the blur fires.
  const scanIntent = useRef(false);

  const validate = async (serial: string) => {
    // eSIM is the agent's current choice - this panel is not the one being
    // filled in, so it has nothing to validate or complain about yet.
    if (suppressValidation) {
      setError(null);
      return;
    }
    if (!serial) {
      // No inline message for an empty field: Continue is already unavailable until a
      // serial is entered or scanned (or eSIM chosen), so the block explains itself.
      setError(null);
      onChange(serial, false);
      return;
    }
    setChecking(true);
    const outcome = await checkSimSerial(serial, inventory);
    setChecking(false);
    if (!outcome.details) {
      setError(outcome.error);
      onChange(serial, false);
      return;
    }
    setError(null);
    setShown({ serial, details: outcome.details });
    onChange(serial, true, outcome.details);
  };

  // Simulated barcode read. Picks a serial that is genuinely available in
  // sims.json rather than inventing one, so the success path it produces is
  // the same path a real reader would produce - and if the store holds nothing
  // available, it reports that instead of fabricating a SIM.
  const scanSim = async () => {
    scanIntent.current = true;
    setError(null);
    setScanning(true);
    const sims = await mockDataEngine.list<SimRecord>('sims');
    await new Promise((r) => setTimeout(r, 600));
    setScanning(false);
    const available = sims.find((s) => s.stockStatus !== 'Issued' && s.stockStatus !== SIM_RESERVED && Boolean(s.prePaired) === prePairedStock);
    if (!available) {
      scanIntent.current = false;
      setError(prePairedStock ? "Pre-Paired SIM not found in this store's stock." : "SIM not found in this store's stock.");
      onChange('', false);
      return;
    }
    onChange(available.simSerial, false);
    await validate(available.simSerial);
    scanIntent.current = false;
  };

  return (
    <div>
      {/* Barcode scan trigger moved INSIDE the field as a trailing icon
          (2026-09-28), replacing the separate "Scan SIM" button below it -
          the icon fills the same box the agent would otherwise type into,
          the way a real barcode reader's output lands in the field it's
          wired to. scanSim's simulated-scan logic is unchanged; only where
          the trigger sits has moved. */}
      <Input
        label={label}
        // Not required while eSIM is the agent's chosen alternative
        // (2026-09-28 asterisk sweep) - same condition as the error
        // suppression above, so the label never asserts a requirement this
        // panel isn't actually enforcing right now. Callers that never set
        // suppressValidation (every other journey sharing this component)
        // get `required` unconditionally, unchanged from before.
        required={!suppressValidation}
        inputMode="numeric"
        placeholder={touch ? "Scan the SIM barcode, or enter the serial number" : "Enter the SIM serial number, or use the barcode scanner"}
        value={value}
        onChange={(e) => onChange(e.target.value, false)}
        onBlur={(e) => {
          if (scanIntent.current) return;
          void validate(e.target.value);
        }}
        error={suppressValidation ? undefined : (error ?? undefined)}
        autoFocus={autoFocus ?? device === 'web'}
        trailingAddon={
          <button
            type="button"
            onPointerDown={() => {
              scanIntent.current = true;
            }}
            onPointerLeave={() => {
              if (!scanning) scanIntent.current = false;
            }}
            onClick={scanSim}
            disabled={scanning || checking}
            aria-label="Scan SIM barcode"
            title={scanning ? 'Scanning…' : 'Scan SIM barcode'}
            className={`${touch ? 'p-3 -mr-3' : 'p-1.5 -mr-1.5'} rounded-[var(--radius-button)] text-muted
              hover:text-accent disabled:opacity-50 disabled:hover:text-muted
              focus:outline-none focus-visible:shadow-[var(--focus-ring)]`}
          >
            <Icon path={BARCODE_ICON} className="w-4 h-4" />
          </button>
        }
      />
      {touch && (
        <Button
          variant="secondary"
          size="lg"
          className="mt-3 w-full"
          onPointerDown={() => {
            scanIntent.current = true;
          }}
          onClick={scanSim}
          disabled={scanning || checking}
        >
          {scanning ? 'Scanning…' : 'Scan SIM barcode'}
        </Button>
      )}
      <div className="mt-2 flex items-center gap-3">
        {/* "Scanning…" used to be the button's own label; now that the
            trigger is an icon, this line is what carries that same visible
            feedback (the icon itself only shows it via a disabled state and
            hover title). */}
        {scanning && <span className="text-[length:var(--fs-caption)] text-muted">Scanning…</span>}
        {checking && !scanning && <span className="text-[length:var(--fs-caption)] text-muted">Checking stock…</span>}
      </div>
      {!suppressValidation && shown && shown.serial === value && !error && (
        <dl className="mt-2 rounded-[var(--radius-card)] border border-success bg-tone-success p-3 space-y-1 text-[length:var(--fs-caption)]">
          <div className="flex justify-between gap-3">
            <dt className="text-fg">SIM Type</dt>
            <dd className="text-fg font-medium">{shown.details.simKind ?? 'Physical'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-fg">SIM Serial Number</dt>
            <dd className="text-fg font-medium">{shown.serial}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

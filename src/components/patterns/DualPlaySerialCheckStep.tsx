import { CpeSerialScanner } from '../domain/CpeSerialScanner';
import { SimSerial } from '../../capabilities/SimType/SimSerial';

export interface DualPlaySerialValue {
  cpeIndoor?: string;
  cpeIndoorValid?: boolean;
  cpeOutdoor?: string;
  cpeOutdoorValid?: boolean;
  simCard?: string;
  simCardValid?: boolean;
}

interface DualPlaySerialCheckStepProps {
  value: DualPlaySerialValue;
  /** Patch-based, not full-value - three independent async inventory checks
   * (CPE Indoor/Outdoor/SIM) resolve out of order, so the caller MUST merge
   * via a functional state update (setX(prev => ({...prev, ...patch}))),
   * never by spreading a value captured at an earlier render (see below). */
  onChange: (patch: Partial<DualPlaySerialValue>) => void;
}

// "Serial Number Check - Dual Play" screen (SCR-093, FLD-410–412) - barcode-scan
// triple capture (CPE Indoor, CPE Outdoor, SIM Card), each validated in real
// time against inventory; blocks Continue until all three resolve, matching
// the FWA Outdoor WFM installation flow (UJ-061).
//
// Bug fixed here: this component used to spread its own `value` prop into
// each child's onChange (`{...value, cpeIndoor: v, ...}`). Since each
// scanner's inventory check is an independent async call, whichever resolved
// last would overwrite sibling fields with a stale snapshot of `value` from
// before they were set - e.g. filling CPE Outdoor while CPE Indoor's check
// was still in flight silently erased the Outdoor value once Indoor resolved.
// Passing a patch instead, merged by the parent via functional setState,
// makes the fields independent regardless of resolution order.
export function DualPlaySerialCheckStep({ value, onChange }: DualPlaySerialCheckStepProps) {
  return (
    <div className="space-y-4">
      <CpeSerialScanner
        label="CPE Indoor"
        deviceType="Indoor IDU"
        value={value.cpeIndoor ?? ''}
        onChange={(v, valid) => onChange({ cpeIndoor: v, cpeIndoorValid: valid })}
      />
      <CpeSerialScanner
        label="CPE Outdoor"
        deviceType="Outdoor ODU"
        value={value.cpeOutdoor ?? ''}
        onChange={(v, valid) => onChange({ cpeOutdoor: v, cpeOutdoorValid: valid })}
      />
      <SimSerial
        value={value.simCard ?? ''}
        onChange={(v, valid) => onChange({ simCard: v, simCardValid: valid })}
      />
    </div>
  );
}

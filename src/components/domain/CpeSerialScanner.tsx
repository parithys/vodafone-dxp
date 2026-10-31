import { useState } from 'react';
import { Input } from '../primitives/Input';
import * as mockDataEngine from '../../engines/mockDataEngine';

interface CpeRecord {
  serialNumber: string;
  deviceType: string;
  stockStatus: string;
}

interface CpeSerialScannerProps {
  label: string;
  deviceType: string;
  value: string;
  onChange: (value: string, valid: boolean) => void;
}

// Barcode-scan input for CPE Indoor/Outdoor serial, validated in real time
// against UIM/inventory (FLD-410/411, FWA Outdoor WFM - Serial Number Check
// screen) - same real-time-inventory-validation shape as Pattern 11's
// SimSerialScanner, applied to CPE devices instead of SIM cards.
export function CpeSerialScanner({ label, deviceType, value, onChange }: CpeSerialScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const validate = async (serial: string) => {
    if (!serial) {
      setError(`${label} is required.`);
      onChange(serial, false);
      return;
    }
    setChecking(true);
    const devices = await mockDataEngine.list<CpeRecord>('cpe-devices');
    const found = devices.find((d) => d.serialNumber === serial);
    setChecking(false);
    if (!found) {
      setError(`${label} not found in inventory.`);
      onChange(serial, false);
      return;
    }
    if (found.deviceType !== deviceType) {
      setError(`This serial is a ${found.deviceType}, not a ${deviceType}.`);
      onChange(serial, false);
      return;
    }
    if (found.stockStatus !== 'In-Stock') {
      setError(`This ${deviceType} is already assigned (${found.stockStatus}).`);
      onChange(serial, false);
      return;
    }
    setError(null);
    onChange(serial, true);
  };

  return (
    <div>
      <Input
        label={label}
        placeholder={`Scan ${deviceType} serial`}
        value={value}
        onChange={(e) => onChange(e.target.value, false)}
        onBlur={(e) => validate(e.target.value)}
        error={error ?? undefined}
      />
      {checking && <p className="text-[length:var(--fs-caption)] text-muted mt-1">Checking inventory…</p>}
    </div>
  );
}

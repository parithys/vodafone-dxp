// Fixed Activation Journey (CBU): ids and value shapes. Kept apart from the New Connection model on purpose -
// the two journeys share components, never state: their drafts, customer holds and route entries are separate.

export const FIXED_WIZARD_ID = 'fixed-activation-cbu';
export const FIXED_JOURNEY_LABEL = 'Fixed Activation (CBU)';

export type FixedServiceType = 'fiber' | 'fwa-indoor' | 'fwa-outdoor';

export const FIXED_SERVICE_TYPES: { value: FixedServiceType; label: string; note: string }[] = [
  { value: 'fiber', label: 'Fiber', note: 'Requires the location to be RFS (Ready For Service).' },
  { value: 'fwa-indoor', label: 'FWA Indoor', note: '5G indoor unit, installed by the customer or a technician.' },
  { value: 'fwa-outdoor', label: 'FWA Outdoor', note: '5G outdoor unit, installed on site.' },
];

export const serviceTypeLabel = (t: unknown) => FIXED_SERVICE_TYPES.find((s) => s.value === t)?.label;

export type FixedRfsStatus = 'rfs' | 'not-rfs' | 'unknown';

/** What the Installation Address step records under values.installation. */
export interface FixedInstallationValue {
  serviceType?: FixedServiceType;
  rfs?: FixedRfsStatus;
}

/** A fixed line number is allocated by the system, never picked: 44 + six digits. */
export const allocateFixedLineNumber = () => `44${String(Math.floor(100000 + Math.random() * 899999))}`;

export interface FixedDevice {
  name: string;
  serial: string;
}

/** CPE sent with the order, by service type (and a set-top box when the plan carries TV). */
export function devicesFor(serviceType: FixedServiceType | undefined, withTv: boolean): FixedDevice[] {
  const rnd = () => `SN${Math.floor(1e7 + Math.random() * 9e7)}`;
  const list: FixedDevice[] = [];
  if (serviceType === 'fiber') list.push({ name: 'Fibre ONT + Wi-Fi router', serial: rnd() });
  if (serviceType === 'fwa-indoor') list.push({ name: '5G indoor CPE', serial: rnd() });
  if (serviceType === 'fwa-outdoor') list.push({ name: '5G outdoor CPE', serial: rnd() });
  if (withTv) list.push({ name: 'GigaHome TV set-top box', serial: rnd() });
  return list;
}

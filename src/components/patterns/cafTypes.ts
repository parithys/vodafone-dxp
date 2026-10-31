import { detectDeviceType } from '../../lib/deviceType';

export type CafType = 'Digital' | 'Manual' | 'Touch Screen';

export const CHECK_ICON = 'M20 6L9 17l-5-5';

const MONITOR_ICON = 'M3 4h18v12H3z M9 20h6 M12 16v4';

const PEN_ICON = 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z';

const TOUCH_ICON = 'M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01';

export const CAF_TYPES: { type: CafType; label: string; icon: string }[] = [
  { type: 'Digital', label: 'CAF-Digital', icon: MONITOR_ICON },
  { type: 'Manual', label: 'CAF-Manual', icon: PEN_ICON },
  { type: 'Touch Screen', label: 'CAF-Touch Screen', icon: TOUCH_ICON },
];

/**
 * Runtime touch-capability check (2026-09-28), standing in for the manual
 * CAF-Type picker on a call site that opts into `autoDetectDeviceType`. Real
 * hardware capability, not a persona/channel guess - a touch-capable device
 * (tablet) resolves to CAF-Touch Screen, everything else to CAF-Digital.
 *
 * CAF-Manual (paper) drops out of the reachable set entirely under
 * auto-detection: it was always an agent override for an edge case (e.g. a
 * system outage), not a device type, so there is nothing for a device check
 * to detect it FROM - per the 2026-09-28 direction confirming this reading.
 */
export function detectCafType(): CafType {
  return detectDeviceType() === 'tablet' ? 'Touch Screen' : 'Digital';
}

/**
 * The signature mode of the device in use - Digital on the web, Touch Screen on a tablet - for every document signed on screen (the CAF,
 * the MNP Form). Nobody chooses it: it is read from the device, here and nowhere else.
 */
export type SignatureMode = Exclude<CafType, 'Manual'>;
export const detectSignatureMode = (): SignatureMode => (detectCafType() === 'Touch Screen' ? 'Touch Screen' : 'Digital');

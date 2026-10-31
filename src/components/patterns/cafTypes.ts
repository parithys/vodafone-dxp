import { detectDeviceType } from '../../lib/deviceType';
import { MONITOR_ICON, PEN_ICON, TOUCH_ICON } from '../../assets/icons';

export type CafType = 'Digital' | 'Manual' | 'Touch Screen';





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

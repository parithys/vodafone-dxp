// Which kind of device the agent is working on: a touch device (tablet, field) or a pointer device (web, desktop).
// One journey serves both; the device only changes how a step is operated, never which steps there are.
//
// Decided by hardware capability, not by persona or channel: the same check the CAF step has always used to choose
// CAF-Touch Screen over CAF-Digital. A touch laptop therefore reads as a tablet.

export type DeviceType = 'web' | 'tablet';

export const DEVICE_LABEL: Record<DeviceType, string> = { web: 'Web', tablet: 'Tablet' };

export function deviceTypeFrom(signals: { maxTouchPoints?: number; coarsePointer?: boolean }): DeviceType {
  return (signals.maxTouchPoints ?? 0) > 0 || signals.coarsePointer ? 'tablet' : 'web';
}

let detected: DeviceType | undefined;

/**
 * The device in use. Read once and kept for the page's life, so a journey does not change behaviour half-way through
 * (a window resize or a docked keyboard must not flip a step that is already on screen).
 */
export function detectDeviceType(): DeviceType {
  if (detected) return detected;
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'web';
  detected = deviceTypeFrom({
    maxTouchPoints: navigator.maxTouchPoints,
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
  });
  return detected;
}

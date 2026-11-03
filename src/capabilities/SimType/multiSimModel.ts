import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import { isSimComplete } from '../../components/patterns/prepaidCartModel';

// Multi-SIM answers are kept in the journey's values under `multiSims`: the SIMs provisioned so far, one SimTypeValue each (the same shape as the
// primary SIM under `simType`), in the order the agent added them. How many the order needs is decided elsewhere (engines/multiSim.ts); the list is
// trimmed to it, so a Multi-SIM whose add-on was removed is dropped rather than submitted.

/** The Multi-SIMs held, at most `count` of them (the order never provisions more than its entitlement). */
export const multiSimsFor = (values: Record<string, unknown>, count: number): SimTypeValue[] =>
  ((values.multiSims as SimTypeValue[] | undefined) ?? []).slice(0, Math.max(0, count));

/** Every Multi-SIM the order needs is in and provisioned (true for none). */
export const allMultiSimsComplete = (values: Record<string, unknown>, count: number): boolean => {
  const held = multiSimsFor(values, count);
  return held.length === Math.max(0, count) && held.every(isSimComplete);
};

/** The physical serials in use across the primary SIM and the Multi-SIMs. */
export const serialsInUse = (values: Record<string, unknown>, count: number): string[] =>
  [(values.simType as SimTypeValue | undefined)?.simSerial, ...multiSimsFor(values, count).map((s) => s.simSerial)].filter((x): x is string => Boolean(x));

/** The eSIM ICCIDs in use across the primary SIM and the Multi-SIMs. */
export const iccidsOfEsims = (values: Record<string, unknown>, count: number): string[] =>
  [values.simType as SimTypeValue | undefined, ...multiSimsFor(values, count)].filter((s) => s?.simType === 'eSIM').map((s) => s?.simIccid).filter((x): x is string => Boolean(x));

/** A serial appears on two SIMs of the order. */
export const hasDuplicateSerial = (values: Record<string, unknown>, count: number): boolean => {
  const all = serialsInUse(values, count);
  return new Set(all).size !== all.length;
};

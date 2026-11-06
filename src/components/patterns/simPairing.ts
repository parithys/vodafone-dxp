import type { SimTypeValue } from '../domain/SimTypeStep';

/**
 * Whether the SIM is already mapped to a mobile number: a Pre-Paired SIM carries its number from stock (Paired); a standard Physical SIM or an eSIM is given the order's number
 * when the order is activated, so until then it is Unpaired. Unknown stays unknown: no SIM yet is "Not selected".
 */
export type SimPairing = 'Paired' | 'Unpaired' | 'Not selected';

export function simPairingOf(sim: SimTypeValue | undefined): SimPairing {
  if (!sim?.simType) return 'Not selected';
  return sim.prePaired === true ? 'Paired' : 'Unpaired';
}

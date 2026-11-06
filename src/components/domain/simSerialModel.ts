import * as mockDataEngine from '../../engines/mockDataEngine';
import { SIM_RESERVED } from '../../data/portInRules';

export interface SimRecord {
  simSerial: string;
  iccid: string;
  stockStatus: string;
  /** 'Physical' or 'Printed eSIM' (a card stocked in store that carries an eSIM profile). */
  type?: string;
  /** A Pre-Paired SIM already carries its MSISDN (Mobile Prepaid BRSD MPRA_001_SIM_02). */
  prePaired?: boolean;
  msisdn?: string;
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

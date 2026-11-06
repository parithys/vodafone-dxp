import type { MsisdnRecord } from '../../components/domain/msisdnPickerModel';

/**
 * The number a New Prepaid order is given when the agent has not chosen one: the first AVAILABLE number of the Free pool (lowest number first, so the same inventory always
 * allocates the same number), leaving out numbers the order already holds. A Star, Reserved or Blocked number is never allocated. Undefined when the pool has none.
 */
export function autoAllocatedFreeNumber(numbers: readonly MsisdnRecord[], exclude: readonly string[] = []): MsisdnRecord | undefined {
  return [...numbers]
    .filter((n) => n.category === 'Free' && n.status === 'AVAILABLE' && !exclude.includes(n.msisdn))
    .sort((a, b) => a.msisdn.localeCompare(b.msisdn))[0];
}

/** Where the order's number came from: picked on Number Selection / the SIM page, or allocated for the agent from the Free pool (which the agent may replace). */
export type MsisdnSource = 'selected' | 'auto';

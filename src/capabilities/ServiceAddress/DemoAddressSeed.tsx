import { useEffect } from 'react';
import { DEMO_ADDRESS, demoAddressOffered } from '../../data/synthetic/demoAddress';
import type { PrefilledAddress } from '../../components/patterns/addressFromBilling';

/**
 * Headless, demonstration only: when the Address step opens with nothing in it (no typed value, no prefill from a billing profile), it is filled with
 * a sample address so the page is not blank. Anything already there, a prefill included, is left alone, and an edit is never overwritten.
 */
export function DemoAddressSeed({ address, onChange }: { address: PrefilledAddress | undefined; onChange: (value: PrefilledAddress) => void }) {
  const empty = !address || Object.values(address).every((v) => v === undefined || v === '');
  useEffect(() => {
    if (demoAddressOffered && empty) onChange({ ...DEMO_ADDRESS });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empty]);
  return null;
}

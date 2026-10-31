import { useEffect } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { addressFromBillingLine, addressIsEntered, ADDRESS_PLACEHOLDER, type PrefilledAddress } from '../../components/patterns/addressFromBilling';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';

/**
 * Headless: fills the Address (the secondary address - never the NAS National Address, which the agent does not see) from the billing profile
 * the journey resolved, or with placeholders when there is none, so the step can be passed over and the agent still sees something to edit.
 * Waits until the billing profile is resolved (or the journey has none). Never overwrites what the agent typed: an edit drops `prefilledKey`.
 */
export function AddressPrefill({
  address,
  billing,
  billingApplies,
  onChange,
}: {
  address: PrefilledAddress | undefined;
  billing: BillingAccountValue | undefined;
  /** Whether this journey has a billing profile at all (a prepaid line has none: its address is the placeholder). */
  billingApplies: boolean;
  onChange: (value: PrefilledAddress) => void;
}) {
  const profileId = billing?.selectedProfileId;
  // The source of the address: a profile on file, or none (resolved with no profile, or a journey with no billing).
  const key = profileId ?? (billing?.autoResolvedFor || !billingApplies ? 'none' : undefined);
  useEffect(() => {
    if (!key || addressIsEntered(address) || address?.prefilledKey === key) return;
    let cancelled = false;
    void (async () => {
      let filled: PrefilledAddress = { zone: ADDRESS_PLACEHOLDER, streetNo: ADDRESS_PLACEHOLDER, buildingNo: ADDRESS_PLACEHOLDER };
      if (profileId) {
        const profiles = await mockDataEngine.list<{ billingProfileId: string; billingAddress?: string | null }>('billing-profiles');
        filled = addressFromBillingLine(profiles.find((p) => p.billingProfileId === profileId)?.billingAddress);
      }
      if (!cancelled) onChange({ ...filled, prefilledKey: key });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, address?.prefilledKey, addressIsEntered(address)]);
  return null;
}

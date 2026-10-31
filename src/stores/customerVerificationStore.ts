import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomerVerificationState {
  verifiedCustomerIds: string[];
  verifyCustomer: (customerId: string) => void;
  isVerified: (customerId: string) => boolean;
}

// Customer 360 BRSD v3.1 Annex_02 status model: Unverified -> Verified, no
// transition back out of Verified. Modeled here as a one-way accumulating
// set rather than a per-customer enum precisely so "no transition out of
// Verified" is structurally impossible to violate - there is no remove/unset
// action anywhere in this store's API.
export const useCustomerVerificationStore = create<CustomerVerificationState>()(
  persist(
    (set, get) => ({
      verifiedCustomerIds: [],
      verifyCustomer: (customerId) =>
        set((state) =>
          state.verifiedCustomerIds.includes(customerId)
            ? state
            : { verifiedCustomerIds: [...state.verifiedCustomerIds, customerId] }
        ),
      isVerified: (customerId) => get().verifiedCustomerIds.includes(customerId),
    }),
    { name: 'vfq-customer-verification-store' }
  )
);

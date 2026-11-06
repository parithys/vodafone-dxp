import { create } from 'zustand';
import { EWALLET_OPENING_BALANCE_QAR } from '../data/prepaidActivation';

/**
 * The prototype's eWallet balances, by role. MOCK: there is no eWallet integration - the opening balance comes from data/prepaidActivation.ts, lives in the front end only
 * (it resets with the page) and is reduced when a payment from the eWallet is confirmed. Never persisted.
 */
interface EWalletState {
  balances: Record<string, number>;
  balanceOf: (roleId: string) => number;
  /** Simulates the automatic deduction on payment confirmation; refuses (returns false, changes nothing) when the balance does not cover the amount. */
  deduct: (roleId: string, amountQar: number) => boolean;
}

export const useEWalletStore = create<EWalletState>((set, get) => ({
  balances: { ...EWALLET_OPENING_BALANCE_QAR },
  balanceOf: (roleId) => get().balances[roleId] ?? 0,
  deduct: (roleId, amountQar) => {
    const balance = get().balances[roleId] ?? 0;
    if (amountQar < 0 || amountQar > balance) return false;
    set((s) => ({ balances: { ...s.balances, [roleId]: Math.round((balance - amountQar) * 100) / 100 } }));
    return true;
  },
}));

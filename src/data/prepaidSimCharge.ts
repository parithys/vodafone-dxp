import { formatQar } from '../lib/format';
// SIM card charge on a Mobile Prepaid activation (BRSD MPRA_001_PAY_02).
//
// The BRSD: the system collects a SIM card charge when the recharge amount in the cart is below a defined limit per ID
// type, and lists "QID - 10 QAR, PASSPORT - 40 QAR". VFQ confirmed (2026-10-13) that 10 and 40 are the CHARGE amounts.
// What the BRSD does not state is the recharge limit below which the charge applies: until VFQ gives it, the limit per
// ID type is a PLACEHOLDER that carries the previous reading of those same figures (QID 10, Passport 40), so behaviour
// does not silently change. Only QID and Passport are specified; no other ID type is charged.

/** The SIM card charge per ID type, in QAR. */
export const SIM_CARD_CHARGE_QAR: Readonly<Record<string, number>> = { QID: 10, Passport: 40 };

/** PLACEHOLDER (open item): the recharge below which the SIM card charge applies, per ID type, in QAR. */
export const MINIMUM_RECHARGE_QAR: Readonly<Record<string, number>> = { QID: 10, Passport: 40 };

export interface SimCardCharge {
  applies: boolean;
  chargeQar: number;
  message: string;
}

/** Whether a SIM card charge applies to a line, and how much, from the customer's ID type and the line's recharge. */
export function simCardCharge(idType: string | undefined, rechargeQar: number): SimCardCharge {
  const charge = idType ? SIM_CARD_CHARGE_QAR[idType] : undefined;
  const limit = idType ? MINIMUM_RECHARGE_QAR[idType] : undefined;
  if (charge === undefined || limit === undefined) {
    return { applies: false, chargeQar: 0, message: `No SIM card charge is defined for ID type "${idType ?? 'unknown'}" - none applies.` };
  }
  return rechargeQar >= limit
    ? { applies: false, chargeQar: 0, message: `Recharge of ${formatQar(rechargeQar)} meets the ${idType} minimum of ${formatQar(limit)} - no SIM card charge.` }
    : { applies: true, chargeQar: charge, message: `Recharge of ${formatQar(rechargeQar)} is below the ${idType} minimum of ${formatQar(limit)} - a SIM card charge of ${formatQar(charge)} applies.` };
}

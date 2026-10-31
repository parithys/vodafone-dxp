import { formatQar } from '../lib/format';
// SIM card charge on a Mobile Prepaid activation (BRSD V0.3, "SIM Price Discounting Rules").
//
// The BRSD (Retail): a customer with a QID or Diplomatic ID who recharges at least 20 QAR (configurable) has the SIM charge waived and pays
// only the recharge; below that they pay the recharge plus the SIM charge. A customer with a Passport or GCC ID gets the waiver at a
// recharge of 35 QAR (configurable). The SIM charge itself is configurable by persona.
//
// Everything configurable is in SIM_CHARGE_GROUPS below, one row per group of ID types. The two groups and their waiver thresholds come
// straight from the BRSD. The CHARGE AMOUNTS are NOT stated there (its "15+35" example is ambiguous): they stay at the previously
// confirmed QID 10 / Passport 40 (VFQ, 2026-10-13), applied to the whole group, until VFQ confirms the real ones. No other ID type is charged.

export interface SimChargeGroup {
  /** The ID types (as the app names them) this row applies to. */
  idTypes: readonly string[];
  /** The SIM card charge in QAR, collected when the recharge is below the waiver threshold. PLACEHOLDER (open item): not stated by the BRSD. */
  chargeQar: number;
  /** The recharge in QAR at or above which the SIM card charge is waived. */
  waiveAtRechargeQar: number;
}

export const SIM_CHARGE_GROUPS: readonly SimChargeGroup[] = [
  { idTypes: ['QID', 'Diplomatic ID'], chargeQar: 10, waiveAtRechargeQar: 20 },
  { idTypes: ['Passport', 'GCC ID'], chargeQar: 40, waiveAtRechargeQar: 35 },
];

export interface SimCardCharge {
  applies: boolean;
  chargeQar: number;
  message: string;
}

/** The charge group an ID type belongs to, if the BRSD defines one for it. */
export const simChargeGroupOf = (idType: string | undefined): SimChargeGroup | undefined => (idType ? SIM_CHARGE_GROUPS.find((g) => g.idTypes.includes(idType)) : undefined);

/** Whether a SIM card charge applies to a line, and how much, from the customer's ID type and the line's recharge. */
export function simCardCharge(idType: string | undefined, rechargeQar: number): SimCardCharge {
  const group = simChargeGroupOf(idType);
  if (!group) {
    return { applies: false, chargeQar: 0, message: `No SIM card charge is defined for ID type "${idType ?? 'unknown'}" - none applies.` };
  }
  return rechargeQar >= group.waiveAtRechargeQar
    ? { applies: false, chargeQar: 0, message: `Recharge of ${formatQar(rechargeQar)} meets the ${idType} waiver level of ${formatQar(group.waiveAtRechargeQar)} - the SIM card charge is waived.` }
    : { applies: true, chargeQar: group.chargeQar, message: `Recharge of ${formatQar(rechargeQar)} is below the ${idType} waiver level of ${formatQar(group.waiveAtRechargeQar)} - a SIM card charge of ${formatQar(group.chargeQar)} applies.` };
}

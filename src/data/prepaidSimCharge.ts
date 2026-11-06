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

/**
 * One row of the SIM charging rules. A row applies to the ID types it lists and, when `roles` is given, only to those roles (a role-specific row is tried before a general one).
 * The charge is Standard below `reduceFromRechargeQar`, Reduced from there (when the row has a reduced tier) and Waived from `waiveAtRechargeQar`.
 */
export interface SimChargeGroup {
  /** The ID types (as the app names them) this row applies to. */
  idTypes: readonly string[];
  /** Only these roles (personas.json ids); absent = every role. */
  roles?: readonly string[];
  /** The Standard SIM card charge in QAR, collected when the recharge is below every threshold. PLACEHOLDER (open item): not stated by the BRSD. */
  chargeQar: number;
  /** The recharge in QAR at or above which the SIM card charge is waived. */
  waiveAtRechargeQar: number;
  /** MOCK (open item): a Reduced charge, from this recharge up to the waiver level. Absent = the row has no reduced tier. */
  reduced?: { fromRechargeQar: number; chargeQar: number };
}

export const SIM_CHARGE_GROUPS: readonly SimChargeGroup[] = [
  // MOCK role rule that shows the Reduced charge: Mass Market pays half the standard charge from a QAR 10 recharge. Not a confirmed business rule.
  { idTypes: ['QID', 'Diplomatic ID'], roles: ['ROLE-05'], chargeQar: 10, waiveAtRechargeQar: 20, reduced: { fromRechargeQar: 10, chargeQar: 5 } },
  { idTypes: ['QID', 'Diplomatic ID'], chargeQar: 10, waiveAtRechargeQar: 20 },
  { idTypes: ['Passport', 'GCC ID'], chargeQar: 40, waiveAtRechargeQar: 35 },
];

/** Standard: the full charge; Reduced: part of it; Waived: none (the recharge reached the waiver level); None: no rule defines a charge for the ID type. */
export type SimChargeKind = 'standard' | 'reduced' | 'waived' | 'none';

export interface SimCardCharge {
  applies: boolean;
  /** What the customer pays for the SIM. */
  chargeQar: number;
  /** The Standard charge before any reduction or waiver (the SIM charge line of the Charge Summary); 0 when no rule applies. */
  standardChargeQar: number;
  kind: SimChargeKind;
  message: string;
}

/** The charge row an ID type (and role) belongs to, if a rule defines one: a role-specific row first, then the general one. */
export const simChargeGroupOf = (idType: string | undefined, roleId?: string): SimChargeGroup | undefined =>
  idType
    ? SIM_CHARGE_GROUPS.find((g) => g.idTypes.includes(idType) && g.roles && roleId !== undefined && g.roles.includes(roleId)) ?? SIM_CHARGE_GROUPS.find((g) => g.idTypes.includes(idType) && !g.roles)
    : undefined;

/** Whether a SIM card charge applies to a line, and how much, from the customer's ID type, the line's recharge and (when the journey passes it) the agent's role. */
export function simCardCharge(idType: string | undefined, rechargeQar: number, roleId?: string): SimCardCharge {
  const group = simChargeGroupOf(idType, roleId);
  if (!group) {
    return { applies: false, chargeQar: 0, standardChargeQar: 0, kind: 'none', message: `No SIM card charge is defined for ID type "${idType ?? 'unknown'}" - none applies.` };
  }
  if (rechargeQar >= group.waiveAtRechargeQar) {
    return { applies: false, chargeQar: 0, standardChargeQar: group.chargeQar, kind: 'waived', message: `Recharge of ${formatQar(rechargeQar)} meets the ${idType} waiver level of ${formatQar(group.waiveAtRechargeQar)} - the SIM card charge is waived.` };
  }
  if (group.reduced && rechargeQar >= group.reduced.fromRechargeQar) {
    return { applies: true, chargeQar: group.reduced.chargeQar, standardChargeQar: group.chargeQar, kind: 'reduced', message: `Recharge of ${formatQar(rechargeQar)} reaches the reduced level of ${formatQar(group.reduced.fromRechargeQar)} - the SIM card charge is reduced to ${formatQar(group.reduced.chargeQar)}.` };
  }
  return { applies: true, chargeQar: group.chargeQar, standardChargeQar: group.chargeQar, kind: 'standard', message: `Recharge of ${formatQar(rechargeQar)} is below the ${idType} waiver level of ${formatQar(group.waiveAtRechargeQar)} - a SIM card charge of ${formatQar(group.chargeQar)} applies.` };
}

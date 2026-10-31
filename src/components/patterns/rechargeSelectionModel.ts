import type { PricingRecharge } from './prepaidCartModel';

// Recharge selection on a Mobile Prepaid activation (BRSD V0.3, "Prepaid Recharge Selection"): the recharge products are listed by category
// (Flex, Combo, Credit, Data) and the agent picks one; whether a recharge is required is a journey / persona rule, never decided here.

/** The BRSD's categories, in the order they are offered. A category the catalogue does not carry is not shown; one it carries beyond these follows. */
export const RECHARGE_CATEGORIES = ['Flex', 'Combo', 'Credit', 'Data'] as const;

export interface RechargeGroup {
  category: string;
  items: PricingRecharge[];
}

/** The active recharge products grouped by category, categories in the BRSD's order, each group's products cheapest first. */
export function groupRecharges(recharges: PricingRecharge[]): RechargeGroup[] {
  const live = recharges.filter((r) => (r.status ?? 'Active') === 'Active');
  const categories = [...RECHARGE_CATEGORIES.filter((c) => live.some((r) => r.category === c)), ...new Set(live.map((r) => r.category).filter((c) => !(RECHARGE_CATEGORIES as readonly string[]).includes(c)))];
  return categories.map((category) => ({ category, items: live.filter((r) => r.category === category).sort((a, b) => a.amountQar - b.amountQar) }));
}

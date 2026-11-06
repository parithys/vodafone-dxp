import { CALENDAR_ICON, CHAT, GLOBE_ICON, ICON_CALL, ICON_CARD, ICON_DATA, ICON_GIFT, MOON, WIFI } from '../../assets/icons';
import type { PricingRecharge, RechargeBenefitKind } from './prepaidCartModel';

// Recharge selection on a Mobile Prepaid activation (BRSD V0.3, "Prepaid Recharge Selection"): the recharge products are listed by category
// (Combo+, Flex, Credit, Data, International, Roamers, Visitors) and the agent picks one; whether a recharge is required is a journey / persona rule, never decided here.

/** The BRSD's categories, in the order they are offered. A category the catalogue does not carry is not shown; one it carries beyond these follows. */
export const RECHARGE_CATEGORIES = ['Combo+', 'Flex', 'Credit', 'Data', 'International', 'Roamers', 'Visitors'] as const;

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

/** The icon of each benefit kind, drawn in the accent colour beside the line (the prepaid pack card's icon rows). `other` has none: it is a plain line ("OR"). */
export const RECHARGE_BENEFIT_ICON: Record<RechargeBenefitKind, string | undefined> = {
  data: ICON_DATA,
  voice: ICON_CALL,
  international: GLOBE_ICON,
  internet: WIFI,
  bonus: ICON_GIFT,
  social: CHAT,
  night: MOON,
  credit: ICON_CARD,
  other: undefined,
};

/** The icon of a recharge's validity line. */
export const RECHARGE_VALIDITY_ICON = CALENDAR_ICON;

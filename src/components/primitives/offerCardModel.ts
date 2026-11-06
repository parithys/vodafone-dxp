import { ICON_CALL, ICON_CARD, ICON_DATA, ICON_GIFT, ICON_SPEED, ICON_TV } from '../../assets/icons';

/** The plan fields a card draws its feature list from (public/mock-data/products.json). */
export interface OfferProduct {
  productId: string;
  name: string;
  dataAllowanceGB?: number | null;
  minutesAllowance?: string;
  speedTier?: string;
  speedTierMbps?: number;
  iptvIncluded?: boolean;
  benefits?: string[];
  features?: string[];
  /** Voice, Broadband or Family (the plan's own `planClass`): the plan-type tag an offer for it carries. */
  planClass?: string;
}

/** Up to four facts about a plan, read from its product record - never typed in per card. */
export function planFeatureRows(plan: OfferProduct | undefined): { icon: string; text: string }[] {
  const rows: { icon: string; text: string }[] = [];
  // A plan that lists its own facts shows exactly those, then its free extras.
  if (plan?.features?.length) {
    plan.features.forEach((f, i) => rows.push({ icon: i === 0 ? ICON_DATA : /minute|call/i.test(f) ? ICON_CALL : ICON_CARD, text: f }));
    (plan.benefits ?? []).forEach((b) => rows.push({ icon: ICON_GIFT, text: b }));
    return rows;
  }
  if (plan?.dataAllowanceGB) rows.push({ icon: ICON_DATA, text: `${plan.dataAllowanceGB} GB data` });
  if (plan?.minutesAllowance) {
    rows.push({ icon: ICON_CALL, text: /minute|call/i.test(plan.minutesAllowance) ? plan.minutesAllowance : `${plan.minutesAllowance} minutes` });
  }
  if (plan?.speedTierMbps) rows.push({ icon: ICON_SPEED, text: `${plan.speedTierMbps} Mbps fibre` });
  if (plan?.iptvIncluded) rows.push({ icon: ICON_TV, text: 'IPTV included' });
  (plan?.benefits ?? []).forEach((b) => rows.push({ icon: ICON_GIFT, text: b }));
  return rows.slice(0, 4);
}

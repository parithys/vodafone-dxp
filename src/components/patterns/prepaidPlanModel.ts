/** A prepaid starter pack, as the products catalogue holds it. */
export interface PrepaidPlan {
  productId: string;
  name: string;
  type: string;
  starterPackChargeQAR: number;
  dataAllowanceGB: number | null;
  minutesAllowance: string;
  packValidityDays: number | null;
  popular?: boolean;
  /** When present, the pack is offered only to these customer segments (MPRA_001_QPC_02); absent = every segment. */
  eligibleSegments?: string[];
}

/**
 * The packs a prepaid journey offers, in the order it lists them: the Prepaid Plan products the customer's segment may take (MPRA_001_QPC_02; a new customer with no
 * segment on record is a Consumer), without the line's current pack when a journey changes it, and - for a line that already has its SIM - only packs that carry a bundle.
 * The cheapest first, the Popular pack before the rest. One definition for the pack page and the Addons page, which must agree on what the chosen pack is.
 */
export function offeredPrepaidPacks<T extends PrepaidPlan>(products: readonly T[], { segment, hiddenProductId, packsOnly }: { segment?: string; hiddenProductId?: string; packsOnly?: boolean } = {}): T[] {
  const customerSegment = segment ?? 'Consumer';
  return products
    .filter((p) => p.type === 'Prepaid Plan' && p.productId !== hiddenProductId && (!packsOnly || (p.dataAllowanceGB != null || p.packValidityDays != null)) && (!p.eligibleSegments || p.eligibleSegments.includes(customerSegment)))
    .sort((a, b) => a.starterPackChargeQAR - b.starterPackChargeQAR)
    .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)));
}

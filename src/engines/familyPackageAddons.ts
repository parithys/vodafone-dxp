import { addonChargeNowQar, isAddonAvailable } from './addonCategories';
import type { CategorisedAddon } from './addonCategories';
import { isAddonEligible } from './addonEligibility';
import type { AddonEligibilityRule } from './addonEligibility';

// Add-ons of a Family Package are managed at the package level, from Customer 360: no Family journey (Primary Line 1, Second Primary, Supplementary,
// Secondary) has an Add-ons step. The package holds one list; every line carries each add-on, and each line pays the add-on's charge as it does today
// (the same catalogue, the same eligibility and the same charge rules as any other line's add-on).

/** One add-on held by a package. */
export interface FamilyPackageAddon {
  addonRecordId: string;
  packageId: string;
  customerId?: string;
  /** The add-on's catalogue product id. */
  addonId: string;
  addedAt: string;
  addedBy?: string;
}

export type FamilyAddonProduct = CategorisedAddon & { productId: string; name: string; type?: string; eligibility?: AddonEligibilityRule; addonStatus?: string; priceLabel?: string };

/** What decides whether the package may be offered an add-on: the package's plan (Primary Line 1's) and the owner's own facts. */
export interface FamilyAddonContext {
  planId: string | undefined;
  nationality?: string;
  idType?: string;
}

/**
 * The add-ons a package can still take: catalogue add-ons that are available, eligible for the package's plan and its owner (the existing rules), and not already
 * held. Nothing before the package has a plan (an unknown plan satisfies no plan restriction).
 */
export function packageAddonOptions<T extends FamilyAddonProduct>(catalogue: readonly T[], held: readonly Pick<FamilyPackageAddon, 'addonId'>[], ctx: FamilyAddonContext): T[] {
  if (!ctx.planId) return [];
  const taken = new Set(held.map((h) => h.addonId));
  return catalogue.filter((a) => a.type === 'Add-on' && !taken.has(a.productId) && isAddonAvailable(a) && isAddonEligible(a, { planId: ctx.planId, nationality: ctx.nationality, idType: ctx.idType, customerType: 'none' }));
}

/** What one line pays for the add-on each month (the same rule as for any line), and what the package's lines pay together. */
export const addonChargePerLineQar = (addon: CategorisedAddon): number => addonChargeNowQar(addon);
export const addonChargeForLinesQar = (addon: CategorisedAddon, lineCount: number): number => Math.round(addonChargePerLineQar(addon) * Math.max(0, lineCount) * 100) / 100;

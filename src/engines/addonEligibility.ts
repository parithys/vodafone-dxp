// Which add-ons a customer may be offered. An add-on lists the conditions it needs in an
// optional `eligibility` block on its record in products.json; every condition present
// must hold, and a condition left out places no restriction (so an add-on without the
// block is offered to everyone). An ineligible add-on is not shown at all.
//
//   "eligibility": {
//     "plans":             ["PROD-104", "PROD-105"],   // only with these plans
//     "nationalityGroups": ["Qatari"],                  // "Qatari" | "Expat"
//     "customerTypes":     ["none", "mada"],            // none = Standard, b2b2c, retired, mada
//     "idTypes":           ["QID"]
//   }

export interface AddonEligibilityRule {
  plans?: string[];
  nationalityGroups?: ('Qatari' | 'Expat')[];
  customerTypes?: string[];
  idTypes?: string[];
}

export interface AddonEligibilityContext {
  /** The selected plan, if one is chosen. An add-on that is limited to certain plans is not eligible until one is. */
  planId?: string;
  nationality?: string;
  /** 'none' (Standard), 'b2b2c', 'retired' or 'mada'. */
  customerType?: string;
  idType?: string;
}

export function isAddonEligible(addon: { eligibility?: AddonEligibilityRule }, ctx: AddonEligibilityContext): boolean {
  const rule = addon.eligibility;
  if (!rule) return true;
  if (rule.plans && rule.plans.length > 0 && !(ctx.planId && rule.plans.includes(ctx.planId))) return false;
  if (rule.nationalityGroups && rule.nationalityGroups.length > 0) {
    // Unknown nationality cannot be shown to satisfy a restriction.
    if (!ctx.nationality) return false;
    const group = ctx.nationality === 'Qatari' ? 'Qatari' : 'Expat';
    if (!rule.nationalityGroups.includes(group)) return false;
  }
  if (rule.customerTypes && rule.customerTypes.length > 0 && !rule.customerTypes.includes(ctx.customerType ?? 'none')) return false;
  if (rule.idTypes && rule.idTypes.length > 0 && !(ctx.idType && rule.idTypes.includes(ctx.idType))) return false;
  return true;
}

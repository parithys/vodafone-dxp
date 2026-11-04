import { familyAdditionalCheck, familyStartCheck, lineCatalogueOf, linesOfCustomer } from '../../engines/familyPackage';
import type { FamilyLine, FamilyOrder, FamilyRole, FamilyStartCheck } from '../../engines/familyPackage';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { Product } from './newConnectionModel';

/** What starts an additional connection: the package it joins and the type the agent chose. Set in the draft when the journey is started from Add Another Connection. */
export interface FamilyLineContext {
  packageId: string;
  role: FamilyRole;
}

export const familyLineContextOf = (values: Record<string, unknown>): FamilyLineContext | undefined => {
  const c = values.familyLine as Partial<FamilyLineContext> | undefined;
  return c && typeof c.packageId === 'string' && typeof c.role === 'string' ? (c as FamilyLineContext) : undefined;
};

/**
 * What the New Postpaid order means for a Family Package, from the journey's own values and the records on file. Two cases, one answer used by the
 * plan step, the Order Summary and the submission so they cannot disagree:
 *  - the agent chose a connection type to add (`familyLine` in the draft): a line of that type joins that existing package, on the package's plan;
 *  - otherwise a selected Family Plan starts a new package: this order is Primary Line 1.
 * A plan that is not a Family Plan, with no connection type chosen, gives `{ applies: false }`: nothing about the order changes.
 */
export function familyStartFor(values: Record<string, unknown>, products: readonly Product[], familyLines: readonly FamilyLine[], orders: readonly FamilyOrder[] = []): FamilyStartCheck {
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const contact = values.contact as GuidedContactValue | undefined;
  const eligibilityCleared = Boolean(eligibility) && !eligibility!.hardStop && !eligibility!.softStop;
  const customerLines = linesOfCustomer(familyLines, { customerId: eligibility?.customerId, idNumber: contact?.idNumber });
  const context = familyLineContextOf(values);
  if (context) {
    // The package must be this customer's: a package id from elsewhere finds no lines here.
    return familyAdditionalCheck({ role: context.role, packageId: context.packageId, eligibilityCleared, packageLines: customerLines.filter((l) => l.packageId === context.packageId), orders, catalogue: lineCatalogueOf(products), chosenPlanId: typeof values.productId === 'string' ? values.productId : undefined });
  }
  return familyStartCheck({ plan: products.find((p) => p.productId === values.productId), eligibilityCleared, customerLines });
}

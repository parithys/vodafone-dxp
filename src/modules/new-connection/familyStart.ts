import { familyAdditionalCheck, familyStartCheck, lineCatalogueOf, linesOfCustomer } from '../../engines/familyPackage';
import type { FamilyLine, FamilyOrder, FamilyRole, FamilyStartCheck } from '../../engines/familyPackage';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { Product } from './newConnectionModel';
import { isNewlyIdentifiedCustomer } from './newCustomerRecords';

/**
 * What starts an additional connection: the package it joins. Set in the draft when the journey is started from Add Another Connection. The line's type is never chosen: it
 * is derived from the package's state and the plan selected (engines/familyPackage.ts, deriveFamilyLine). `role` is a legacy field of drafts saved before that and is ignored.
 */
export interface FamilyLineContext {
  packageId: string;
  role?: FamilyRole;
}

export const familyLineContextOf = (values: Record<string, unknown>): FamilyLineContext | undefined => {
  const c = values.familyLine as Partial<FamilyLineContext> | undefined;
  return c && typeof c.packageId === 'string' ? { packageId: c.packageId } : undefined;
};

/**
 * What the New Postpaid order means for a Family Package, from the journey's own values and the records on file. Two cases, one answer used by the
 * plan step, the Order Summary and the submission so they cannot disagree:
 *  - the journey was started to add a connection (`familyLine` in the draft): a line joins that existing package; its type is derived (Primary Line 2 on the package's plan, or
 *    an additional line on the plan the agent selects: the Family-equivalent plan makes it Supplementary, the Net/Data plan Secondary);
 *  - otherwise a selected Family Plan starts a new package: this order is Primary Line 1.
 * A plan that is not a Family Plan, with no connection type chosen, gives `{ applies: false }`: nothing about the order changes.
 */
export function familyStartFor(values: Record<string, unknown>, products: readonly Product[], familyLines: readonly FamilyLine[], orders: readonly FamilyOrder[] = []): FamilyStartCheck {
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const contact = values.contact as GuidedContactValue | undefined;
  const eligibilityCleared = Boolean(eligibility) && !eligibility!.hardStop && !eligibility!.softStop;
  // A customer the journey identifies for the first time has no Family Package on their account, whatever lines happen to carry the same ID: a Family Plan is
  // selected and activated only as part of this journey, and the package it starts is theirs from then on.
  const customerLines = isNewlyIdentifiedCustomer(contact, eligibility) ? [] : linesOfCustomer(familyLines, { customerId: eligibility?.customerId, idNumber: contact?.idNumber });
  const context = familyLineContextOf(values);
  if (context) {
    // Every connection of a package is registered to its Family Owner: the ID validated must be theirs (the package's own customer), or there is no line to add.
    const packageLines = familyLines.filter((l) => l.packageId === context.packageId);
    return familyAdditionalCheck({ packageId: context.packageId, eligibilityCleared, packageLines, isOwner: customerLines.some((l) => l.packageId === context.packageId), orders, catalogue: lineCatalogueOf(products), chosenPlanId: typeof values.productId === 'string' ? values.productId : undefined });
  }
  return familyStartCheck({ plan: products.find((p) => p.productId === values.productId), eligibilityCleared, customerLines });
}

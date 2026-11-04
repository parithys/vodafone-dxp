// Family Package rules (2026-11-04). A Family Package is the set of lines a customer holds on one Family Plan (an Ahli plan). Three rules:
//   1. It always begins with Primary Line 1. No other line can be added until Primary Line 1's order is approved. After it, Second Primary, Supplementary and
//      Secondary have NO order between them: what is available is decided only by the package's current lines and the limits below.
//   2. Primary Line 1 chooses the package's Ahli plan and Second Primary is on it too. A Supplementary line is on the Supplementary plan; a Secondary line is on
//      a Secondary plan the agent chooses (Ahli Lite, Ahli Net). Their benefits follow the package.
//   3. Line limits: Primary 2, Supplementary 2, Secondary unlimited.
// Pure functions over the package's own records; nothing here reads a name, a code or a price to decide what a line is.

export type FamilyRole = 'Primary' | 'Supplementary' | 'Secondary';

/** In the order the agent is offered them. `null` is no limit. */
export const FAMILY_ROLES: readonly FamilyRole[] = ['Primary', 'Supplementary', 'Secondary'];
export const FAMILY_ROLE_LIMITS: Readonly<Record<FamilyRole, number | null>> = { Primary: 2, Supplementary: 2, Secondary: null };

/** The class of plan (`planClass` in products.json) that makes a plan a Family Plan: the one place that says so. */
export const FAMILY_PLAN_CLASS = 'Postpaid Family Plans';
/** The classes (`planClass` in products.json) of the extra-line plans: a Supplementary line is on the one Supplementary plan, a Secondary line on a Secondary plan the agent chooses. */
export const SUPPLEMENTARY_PLAN_CLASS = 'Postpaid Supplementary Plans';
export const SECONDARY_PLAN_CLASS = 'Postpaid Secondary Plans';

/** What the catalogue offers to put added lines on. A role with nothing here cannot be added (never assumed, never invented). */
export interface LineCatalogue {
  supplementaryPlanId?: string;
  secondaryPlanIds?: readonly string[];
}
export const lineCatalogueOf = (products: readonly { productId: string; planClass?: unknown }[]): LineCatalogue => ({
  supplementaryPlanId: products.find((p) => p.planClass === SUPPLEMENTARY_PLAN_CLASS)?.productId,
  secondaryPlanIds: products.filter((p) => p.planClass === SECONDARY_PLAN_CLASS).map((p) => p.productId),
});
export const isFamilyPlan = (plan: { planClass?: unknown } | undefined): boolean => plan?.planClass === FAMILY_PLAN_CLASS;

export interface FamilyLine {
  lineId: string;
  packageId: string;
  /** The customer's record, when they have one (a customer newly identified in the journey has none yet: `idNumber` then names them). */
  customerId?: string;
  idNumber?: string;
  role: FamilyRole;
  /** 1-based within the role: "Primary Line 1", "Secondary Line 3". */
  sequence: number;
  planId: string;
  /** The order that activates this line; its approval is what "activated" means. */
  orderId: string;
  /** The line's number, once the order has chosen one. */
  msisdn?: string;
  /** The package's Family Plan (Primary Line 1's) a line added to the package is on the tier of: its own plan (Supplementary, Secondary) can differ. */
  tierPlanId?: string;
}

export interface FamilyOrder {
  orderId: string;
  /** The billing account the order is billed on. */
  billingProfileId?: unknown;
  status?: unknown;
  approvalStatus?: unknown;
}

export const lineLabel = (l: Pick<FamilyLine, 'role' | 'sequence'>): string => `${l.role} Line ${l.sequence}`;

/**
 * A line's order is approved: its approval status says Approved, or no approval was ever required and the order is Complete. Anything else
 * (pending any approver, returned, rejected, a draft, an order that cannot be found) is not approved.
 */
export const isOrderApproved = (order: FamilyOrder | undefined): boolean =>
  order?.approvalStatus === 'Approved' || (order?.approvalStatus === 'Not Required' && order?.status === 'Complete');

export const primaryLine1 = (lines: readonly FamilyLine[]): FamilyLine | undefined => lines.find((l) => l.role === 'Primary' && l.sequence === 1);

/** The plan every line of the package is on: Primary Line 1's. Undefined until the package has begun. */
export const packagePlanId = (lines: readonly FamilyLine[]): string | undefined => primaryLine1(lines)?.planId;

/** The one billing account every line of the package is billed under: the one Primary Line 1's order was billed on. Undefined when the package's first order records none (never guessed). */
export function packageBillingProfileId(lines: readonly FamilyLine[], orders: readonly FamilyOrder[]): string | undefined {
  const first = primaryLine1(lines);
  const id = first ? orders.find((o) => o.orderId === first.orderId)?.billingProfileId : undefined;
  return typeof id === 'string' && id !== '' ? id : undefined;
}

/** Primary Line 1 exists and its order is approved: the lines after it are open. */
export function primaryLine1Activated(lines: readonly FamilyLine[], orders: readonly FamilyOrder[]): boolean {
  const first = primaryLine1(lines);
  return Boolean(first) && isOrderApproved(orders.find((o) => o.orderId === first!.orderId));
}

export type AddLineCheck =
  | { ok: true; role: FamilyRole; sequence: number; /** The plan the new line takes: Primary Line 1's for Second Primary, the Supplementary plan for Supplementary. Undefined where the agent chooses it (Primary Line 1, Secondary). */ planId: string | undefined }
  | { ok: false; reason: string };

/**
 * Whether a `role` line can be added to the package now, and what it would be called and be on. Primary Line 1 is the only line a package without
 * one can take (its plan is the agent's choice, so `planId` is undefined here); once it exists, nothing else opens until its order is approved.
 */
export function canAddLine(lines: readonly FamilyLine[], orders: readonly FamilyOrder[], role: FamilyRole, catalogue: LineCatalogue = {}): AddLineCheck {
  const first = primaryLine1(lines);
  if (!first) {
    return role === 'Primary' ? { ok: true, role, sequence: 1, planId: undefined } : { ok: false, reason: 'Start with Primary Line 1: it must be activated first.' };
  }
  if (!primaryLine1Activated(lines, orders)) return { ok: false, reason: 'Primary Line 1 is not approved yet: the other lines open once it is.' };
  // A Supplementary or Secondary line needs a plan to be on; the catalogue says whether there is one (never assumed).
  if (role === 'Supplementary' && !catalogue.supplementaryPlanId) return { ok: false, reason: 'No Supplementary plan is available yet.' };
  if (role === 'Secondary' && !(catalogue.secondaryPlanIds?.length)) return { ok: false, reason: 'No Secondary plan is available yet.' };
  const inRole = lines.filter((l) => l.role === role);
  const limit = FAMILY_ROLE_LIMITS[role];
  if (limit !== null && inRole.length >= limit) return { ok: false, reason: `This package already has its ${limit} ${role} lines.` };
  const planId = role === 'Primary' ? first.planId : role === 'Supplementary' ? catalogue.supplementaryPlanId : undefined;
  return { ok: true, role, sequence: inRole.reduce((n, l) => Math.max(n, l.sequence), 0) + 1, planId };
}

/** Every way the package's lines break the rules, as plain sentences (empty when it is sound). Used to check data, not to gate the UI. */
export function packageViolations(lines: readonly FamilyLine[]): string[] {
  const out: string[] = [];
  const first = primaryLine1(lines);
  if (lines.length > 0 && !first) out.push('The package has no Primary Line 1.');
  // Primary lines share the package's plan; Supplementary and Secondary lines are on their own plans (the catalogue's, checked against its classes where it is known).
  for (const l of lines) if (first && l.role === 'Primary' && l.planId !== first.planId) out.push(`${lineLabel(l)} is not on Primary Line 1's plan.`);
  for (const role of FAMILY_ROLES) {
    const inRole = lines.filter((l) => l.role === role);
    const limit = FAMILY_ROLE_LIMITS[role];
    if (limit !== null && inRole.length > limit) out.push(`${inRole.length} ${role} lines exceed the limit of ${limit}.`);
    const seqs = inRole.map((l) => l.sequence).sort((a, b) => a - b);
    if (seqs.some((n, i) => n !== i + 1)) out.push(`${role} line numbers are not 1..${inRole.length}.`);
  }
  return out;
}

/** The lines of one customer's package: by their record when they have one, otherwise by the ID they were identified with. Neither known: none. */
export function linesOfCustomer(lines: readonly FamilyLine[], who: { customerId?: string; idNumber?: string }): FamilyLine[] {
  return lines.filter((l) => (who.customerId !== undefined && l.customerId === who.customerId) || (who.idNumber !== undefined && l.idNumber === who.idNumber));
}

/** What starting a Family Package with the selected plan means for this order. */
export type FamilyStartCheck =
  | { applies: false }
  | { applies: true; ok: true; /** The first line of a new package is always Primary Line 1. */ lineLabel: string; /** Undefined while a Secondary plan is still to be chosen. */ planId: string | undefined; /** Present for a line added to an existing package. */ additional?: { packageId: string; role: FamilyRole; sequence: number; /** The package's Family Plan: the tier the line follows. */ tierPlanId?: string } }
  | { applies: true; ok: false; kind: 'eligibility' | 'package' | 'owner'; reason: string };

/**
 * New Postpaid with a Family Plan selected starts a Family Package, so the order is Primary Line 1 and the plan is the package's. It can only start
 * when the customer has cleared the journey's eligibility checks (`eligibilityCleared`, the journey's own result, not a second rule) and holds no
 * Family Package yet: a customer who has one adds lines to it, never a second Primary Line 1. A plan that is not a Family Plan is not this rule's.
 */
export function familyStartCheck({ plan, eligibilityCleared, customerLines }: { plan: { productId: string; planClass?: unknown } | undefined; eligibilityCleared: boolean; customerLines: readonly FamilyLine[] }): FamilyStartCheck {
  if (!plan || !isFamilyPlan(plan)) return { applies: false };
  if (!eligibilityCleared) return { applies: true, ok: false, kind: 'eligibility', reason: 'This customer has not cleared eligibility, so a Family Plan cannot be started.' };
  if (customerLines.length > 0) return { applies: true, ok: false, kind: 'package', reason: 'This customer already has a Family Package. Further connections are added to it from Customer 360.' };
  return { applies: true, ok: true, lineLabel: 'Primary Line 1', planId: plan.productId };
}

/** How each role is named to the agent when choosing a connection to add. */
export const CONNECTION_TYPE_LABEL: Readonly<Record<FamilyRole, string>> = { Primary: 'Second Primary', Supplementary: 'Supplementary', Secondary: 'Secondary' };

export interface ConnectionOption {
  role: FamilyRole;
  label: string;
  /** What the line will be called: "Primary Line 2", "Supplementary Line 1". */
  lineLabel: string;
  sequence: number;
}

/**
 * The connection types that can be added to the package right now, in a fixed display order (not an activation order: any of them can be chosen
 * first). None until Primary Line 1 is approved. Recomputed from the package's lines every time it is asked, so a limit reached by the line just added
 * takes that type off the list and nothing else.
 */
export function connectionOptions(lines: readonly FamilyLine[], orders: readonly FamilyOrder[], catalogue: LineCatalogue = {}): ConnectionOption[] {
  if (!primaryLine1Activated(lines, orders)) return [];
  return FAMILY_ROLES.flatMap((role) => {
    const c = canAddLine(lines, orders, role, catalogue);
    return c.ok ? [{ role, label: CONNECTION_TYPE_LABEL[role], lineLabel: lineLabel({ role, sequence: c.sequence }), sequence: c.sequence }] : [];
  });
}

/**
 * A line added to an EXISTING package (the agent chose a connection type after Primary Line 1): the package's lines (this customer's, in this package),
 * the journey's eligibility result and the type chosen decide it, through the same canAddLine the choice list used. The line takes the package's plan; it
 * can never choose another. No package, or a package whose Primary Line 1 is not approved, is a refusal like any other.
 */
export function familyAdditionalCheck({ role, packageId, eligibilityCleared, packageLines, isOwner = true, orders, catalogue, chosenPlanId }: { role: FamilyRole; packageId: string; eligibilityCleared: boolean; /** Every line of the package. */ packageLines: readonly FamilyLine[]; /** The ID validated is the Family Owner's (the customer of the package). */ isOwner?: boolean; orders: readonly FamilyOrder[]; catalogue: LineCatalogue; /** The plan selected so far (a Secondary line's is the agent's choice). */ chosenPlanId?: string }): FamilyStartCheck {
  if (!eligibilityCleared) return { applies: true, ok: false, kind: 'eligibility', reason: 'This customer has not cleared eligibility, so a connection cannot be added to the Family Package.' };
  if (packageLines.length === 0) return { applies: true, ok: false, kind: 'package', reason: 'This Family Package could not be found.' };
  // Every connection is registered to the Family Owner, so the ID validated for it must be theirs.
  if (!isOwner) return { applies: true, ok: false, kind: 'owner', reason: "This ID is not the Family Owner's. Every connection in a Family Package is registered to the Family Owner, so their ID must be validated." };
  const c = canAddLine(packageLines, orders, role, catalogue);
  if (!c.ok) return { applies: true, ok: false, kind: 'package', reason: c.reason };
  // A Secondary line is on a Secondary plan the agent picked, and only one of the catalogue's; until then there is none.
  const planId = role === 'Secondary' ? (chosenPlanId && catalogue.secondaryPlanIds?.includes(chosenPlanId) ? chosenPlanId : undefined) : c.planId;
  return { applies: true, ok: true, lineLabel: lineLabel({ role, sequence: c.sequence }), planId, additional: { packageId, role, sequence: c.sequence, tierPlanId: packagePlanId(packageLines) } };
}

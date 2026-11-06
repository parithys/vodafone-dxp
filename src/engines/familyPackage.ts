// Family Package rules. A Family Package is the set of lines a customer holds on one Family Plan (an Ahli plan). The model is STATE-, ENTITLEMENT- and PLAN-driven:
//
//   package state (Primary Line 1 / Primary Line 2 status, what each entitlement has consumed)
//     -> remaining entitlement -> eligible plans -> the agent SELECTS A PLAN -> the line type is DERIVED -> the existing Postpaid activation.
//
//   NEW PACKAGE + first connection ................................ PRIMARY_LINE_1 (establishes the package and the Family Owner)
//   PRIMARY LINE 1 ACTIVE + included second Primary available ..... PRIMARY_LINE_2 (the SAME package and plan; included, not charged)
//   BOTH PRIMARY LINES ACTIVE + the Family-equivalent plan ........ SUPPLEMENTARY
//   BOTH PRIMARY LINES ACTIVE + a Secondary plan (Ahli Lite, Ahli Net) SECONDARY
//
// The agent is never asked for a connection type. "Active" is an approved order (isOrderApproved); a line awaiting approval is on record but not active.
// Which plan is which is the catalogue's metadata (planClass / secondaryPlanType), never a name or a price. The limits are the configuration below.
// Pure functions over the package's own records; nothing here reads a name, a code or a price to decide what a line is.

export type FamilyRole = 'Primary' | 'Supplementary' | 'Secondary';

/** In the order the agent is offered them. `null` is no limit. */
export const FAMILY_ROLES: readonly FamilyRole[] = ['Primary', 'Supplementary', 'Secondary'];
/**
 * CONFIGURATION. The included Primary Lines are the Family Plan's own (two). The Supplementary and Secondary maximums are open business items: the values here are
 * the ones the business has stated so far (Supplementary 2, Secondary no limit) and the only place that says so - change them here, nowhere else. `null` is no limit.
 */
export const FAMILY_CONFIG = { primaryIncluded: 2, supplementaryMax: 2 as number | null, secondaryMax: null as number | null } as const;
export const FAMILY_ROLE_LIMITS: Readonly<Record<FamilyRole, number | null>> = { Primary: FAMILY_CONFIG.primaryIncluded, Supplementary: FAMILY_CONFIG.supplementaryMax, Secondary: FAMILY_CONFIG.secondaryMax };

/** What a line is, once derived. */
export type FamilyLineType = 'PRIMARY_LINE_1' | 'PRIMARY_LINE_2' | 'SUPPLEMENTARY' | 'SECONDARY';
export const FAMILY_LINE_TYPE_ROLE: Readonly<Record<FamilyLineType, FamilyRole>> = { PRIMARY_LINE_1: 'Primary', PRIMARY_LINE_2: 'Primary', SUPPLEMENTARY: 'Supplementary', SECONDARY: 'Secondary' };
export const familyLineTypeOf = (l: Pick<FamilyLine, 'role' | 'sequence'>): FamilyLineType =>
  l.role === 'Primary' ? (l.sequence === 1 ? 'PRIMARY_LINE_1' : 'PRIMARY_LINE_2') : l.role === 'Supplementary' ? 'SUPPLEMENTARY' : 'SECONDARY';

/** The class of plan (`planClass` in products.json) that makes a plan a Family Plan: the one place that says so. */
export const FAMILY_PLAN_CLASS = 'Postpaid Family Plans';
/** The classes (`planClass` in products.json) of the extra-line plans: a Supplementary line is on the one Supplementary plan, a Secondary line on a Secondary plan the agent chooses. */
export const SUPPLEMENTARY_PLAN_CLASS = 'Postpaid Supplementary Plans';
export const SECONDARY_PLAN_CLASS = 'Postpaid Secondary Plans';

/** What the catalogue offers to put added lines on. A line type with nothing here cannot be added (never assumed, never invented). */
export interface LineCatalogue {
  /** The Family-equivalent plan an additional line is on to be a Supplementary line. */
  supplementaryPlanId?: string;
  /** The Secondary plans (the catalogue's Secondary class: Ahli Lite, the Kids Plan, and Ahli Net, the Data-only Plan): an additional line on any of them is a Secondary line. */
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

/**
 * Which lines a package includes at no charge: the Second Primary (Primary Line 2). Every other added line (Supplementary, Secondary) is paid, at its plan's price.
 * (Business rule 2026-11-04: the free line is always offered first; paid lines open only once it is activated.)
 */
export const FREE_LINE = { role: 'Primary' as FamilyRole, sequence: 2 } as const;
export const isFreeLine = (l: Pick<FamilyLine, 'role' | 'sequence'>): boolean => l.role === FREE_LINE.role && l.sequence === FREE_LINE.sequence;
export type LineCharge = 'Free' | 'Paid';

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

/** The package's free line has not been taken yet (a line awaiting approval counts as taken). */
export const freeLineOpen = (lines: readonly FamilyLine[]): boolean => !lines.some(isFreeLine);

export type AddLineCheck =
  | { ok: true; role: FamilyRole; sequence: number; /** The plan the new line takes: the package's for Primary Line 2, the Family-equivalent plan for Supplementary, a Secondary plan for Secondary. Undefined for Primary Line 1 (the agent's choice). */ planId: string | undefined }
  | { ok: false; reason: string };

/** A line's standing: not on record, on record awaiting approval, or active (its order approved). */
export type LineStatus = 'None' | 'Pending' | 'Active';
const statusOf = (line: FamilyLine | undefined, orders: readonly FamilyOrder[]): LineStatus => (!line ? 'None' : isOrderApproved(orders.find((o) => o.orderId === line.orderId)) ? 'Active' : 'Pending');
const primaryLine2 = (lines: readonly FamilyLine[]): FamilyLine | undefined => lines.find((l) => l.role === 'Primary' && l.sequence === 2);

/** What the package needs next. */
export type FamilyNextAction =
  /** No package: the next connection is Primary Line 1. */
  | 'START_PACKAGE'
  /** Primary Line 1 is on record but not yet active: nothing else opens. */
  | 'AWAIT_PRIMARY_1'
  /** Primary Line 1 active, the included second Primary not on record: it is the next connection. */
  | 'PRIMARY_LINE_2'
  /** Primary Line 2 is on record but not yet active. */
  | 'AWAIT_PRIMARY_2'
  /** Both Primary Lines active: an additional connection, by the plan the agent selects. */
  | 'ADDITIONAL_PLAN';

/** The package as it stands: derived from its lines and their orders every time, never kept as a second copy. */
export interface PackageState {
  exists: boolean;
  packageId: string | undefined;
  /** The package's Family Plan (Primary Line 1's); every Primary Line is on it. */
  planId: string | undefined;
  primary1: LineStatus;
  primary2: LineStatus;
  /** Primary Lines active, and the included ones still to be taken (a line awaiting approval is taken). */
  primaryActive: number;
  primaryRemaining: number;
  supplementaryUsed: number;
  /** null: no limit. */
  supplementaryRemaining: number | null;
  secondaryUsed: number;
  secondaryRemaining: number | null;
  nextAction: FamilyNextAction;
}

export function resolvePackageState(lines: readonly FamilyLine[], orders: readonly FamilyOrder[]): PackageState {
  const first = primaryLine1(lines);
  const primary1 = statusOf(first, orders);
  const primary2 = statusOf(primaryLine2(lines), orders);
  const count = (role: FamilyRole) => lines.filter((l) => l.role === role).length;
  const left = (role: FamilyRole) => (FAMILY_ROLE_LIMITS[role] === null ? null : Math.max(0, FAMILY_ROLE_LIMITS[role]! - count(role)));
  const nextAction: FamilyNextAction = !first ? 'START_PACKAGE' : primary1 !== 'Active' ? 'AWAIT_PRIMARY_1' : primary2 === 'None' ? 'PRIMARY_LINE_2' : primary2 === 'Pending' ? 'AWAIT_PRIMARY_2' : 'ADDITIONAL_PLAN';
  return {
    exists: Boolean(first),
    packageId: first?.packageId,
    planId: first?.planId,
    primary1,
    primary2,
    primaryActive: [primary1, primary2].filter((x) => x === 'Active').length,
    primaryRemaining: Math.max(0, FAMILY_CONFIG.primaryIncluded - count('Primary')),
    supplementaryUsed: count('Supplementary'),
    supplementaryRemaining: left('Supplementary'),
    secondaryUsed: count('Secondary'),
    secondaryRemaining: left('Secondary'),
    nextAction,
  };
}

/** An additional plan the agent may select now, and the line type selecting it makes. */
export interface EligiblePlan {
  planId: string;
  type: 'SUPPLEMENTARY' | 'SECONDARY';
  role: FamilyRole;
}

/**
 * The plans an additional connection can be on, from the package's remaining entitlement: the Family-equivalent plan while Supplementary entitlement remains, the Net/Data
 * plan while Secondary is open. Nothing before both Primary Lines are active; a plan whose entitlement is used up is not listed.
 */
export function eligibleAdditionalPlans(state: PackageState, catalogue: LineCatalogue = {}): EligiblePlan[] {
  if (state.nextAction !== 'ADDITIONAL_PLAN') return [];
  const out: EligiblePlan[] = [];
  if (catalogue.supplementaryPlanId && (state.supplementaryRemaining === null || state.supplementaryRemaining > 0)) out.push({ planId: catalogue.supplementaryPlanId, type: 'SUPPLEMENTARY', role: 'Supplementary' });
  if (state.secondaryRemaining === null || state.secondaryRemaining > 0) for (const planId of catalogue.secondaryPlanIds ?? []) out.push({ planId, type: 'SECONDARY', role: 'Secondary' });
  return out;
}

/** The reason the package cannot take a connection now, when its state is one that cannot (undefined when something can be added). */
function stateRefusal(state: PackageState): string | undefined {
  switch (state.nextAction) {
    case 'AWAIT_PRIMARY_1':
      return 'Primary Line 1 is not approved yet: the other lines open once it is.';
    case 'AWAIT_PRIMARY_2':
      return 'Primary Line 2 is not active yet: additional connections open once both included Primary Lines are active.';
    default:
      return undefined;
  }
}

export type DerivedLine =
  | {
      ok: true;
      type: FamilyLineType;
      role: FamilyRole;
      sequence: number;
      /** The plan the line is on: forced to the package's for Primary Line 2, the selected plan for an additional line. Undefined while the agent has still to select it (and for Primary Line 1). */
      planId: string | undefined;
      /** Primary Line 2 is included in the package; every other line is charged at its plan's price. */
      charge: LineCharge;
    }
  /** Both Primary Lines are active and the agent has still to select a plan: these are the ones they may choose from. */
  | { ok: true; pending: true; eligiblePlans: EligiblePlan[] }
  | { ok: false; reason: string };

/**
 * THE classification: from the package's state, its consumed and remaining entitlement and the plan selected, what the next line is. The agent selects a plan; this derives the
 * type. A Primary Line 2 takes the package's plan whatever was selected; an additional line must be on one of the eligible plans (the Family-equivalent plan -> SUPPLEMENTARY, the
 * a Secondary plan -> SECONDARY) and a plan that is not, or whose entitlement is used up, is refused - so a stale selection cannot be activated.
 */
export function deriveFamilyLine({ lines, orders, catalogue = {}, selectedPlanId }: { lines: readonly FamilyLine[]; orders: readonly FamilyOrder[]; catalogue?: LineCatalogue; selectedPlanId?: string }): DerivedLine {
  const state = resolvePackageState(lines, orders);
  const refusal = stateRefusal(state);
  if (refusal) return { ok: false, reason: refusal };
  if (state.nextAction === 'START_PACKAGE') return { ok: true, type: 'PRIMARY_LINE_1', role: 'Primary', sequence: 1, planId: undefined, charge: 'Paid' };
  if (state.nextAction === 'PRIMARY_LINE_2') return { ok: true, type: 'PRIMARY_LINE_2', role: 'Primary', sequence: 2, planId: state.planId, charge: 'Free' };
  const eligible = eligibleAdditionalPlans(state, catalogue);
  if (eligible.length === 0) {
    const why = [
      !catalogue.supplementaryPlanId ? 'No Family-equivalent plan is available yet.' : state.supplementaryRemaining === 0 ? `This package already has its ${FAMILY_ROLE_LIMITS.Supplementary} Supplementary lines.` : undefined,
      !catalogue.secondaryPlanIds?.length ? 'No Secondary plan is available yet.' : state.secondaryRemaining === 0 ? `This package already has its ${FAMILY_ROLE_LIMITS.Secondary} Secondary lines.` : undefined,
    ].filter(Boolean);
    return { ok: false, reason: why.join(' ') || 'No additional plan can be added to this Family Package now.' };
  }
  if (!selectedPlanId) return { ok: true, pending: true, eligiblePlans: eligible };
  const chosen = eligible.find((e) => e.planId === selectedPlanId);
  if (!chosen) return { ok: false, reason: 'The selected plan cannot be added to this Family Package now.' };
  const used = chosen.role === 'Supplementary' ? state.supplementaryUsed : state.secondaryUsed;
  return { ok: true, type: chosen.type, role: chosen.role, sequence: used + 1, planId: chosen.planId, charge: 'Paid' };
}

/**
 * Whether a `role` line can be added to the package now, and what it would be called and be on. A view of the same state-driven rules (deriveFamilyLine / the eligible
 * plans) for the places that ask about a role; the agent is never asked for one.
 */
export function canAddLine(lines: readonly FamilyLine[], orders: readonly FamilyOrder[], role: FamilyRole, catalogue: LineCatalogue = {}): AddLineCheck {
  const state = resolvePackageState(lines, orders);
  if (state.nextAction === 'START_PACKAGE') return role === 'Primary' ? { ok: true, role, sequence: 1, planId: undefined } : { ok: false, reason: 'Start with Primary Line 1: it must be activated first.' };
  const refusal = stateRefusal(state);
  if (refusal) return { ok: false, reason: refusal };
  if (state.nextAction === 'PRIMARY_LINE_2') {
    return role === 'Primary'
      ? { ok: true, role, sequence: 2, planId: state.planId }
      : { ok: false, reason: 'Primary Line 2 is still available in this package. Activate it before any additional connection.' };
  }
  if (role === 'Primary') return { ok: false, reason: `This package already has its ${FAMILY_CONFIG.primaryIncluded} Primary lines.` };
  const eligible = eligibleAdditionalPlans(state, catalogue).find((e) => e.role === role);
  if (eligible) return { ok: true, role, sequence: (role === 'Supplementary' ? state.supplementaryUsed : state.secondaryUsed) + 1, planId: role === 'Secondary' && (catalogue.secondaryPlanIds?.length ?? 0) > 1 ? undefined : eligible.planId };
  if (role === 'Supplementary') return { ok: false, reason: !catalogue.supplementaryPlanId ? 'No Family-equivalent plan is available yet.' : `This package already has its ${FAMILY_ROLE_LIMITS.Supplementary} Supplementary lines.` };
  return { ok: false, reason: !catalogue.secondaryPlanIds?.length ? 'No Secondary plan is available yet.' : `This package already has its ${FAMILY_ROLE_LIMITS.Secondary} Secondary lines.` };
}

/** Every way the package's lines break the rules, as plain sentences (empty when it is sound). Used to check data, not to gate the UI. */
export function packageViolations(lines: readonly FamilyLine[]): string[] {
  const out: string[] = [];
  const first = primaryLine1(lines);
  if (lines.length > 0 && !first) out.push('The package has no Primary Line 1.');
  // Primary lines share the package's plan; Supplementary and Secondary lines are on their own plans (the catalogue's, checked against its classes where it is known).
  for (const l of lines) if (first && l.role === 'Primary' && l.planId !== first.planId) out.push(`${lineLabel(l)} is not on Primary Line 1's plan.`);
  // An additional connection (Supplementary / Secondary) exists only once both included Primary Lines are on record: they are consumed first.
  if (first && !primaryLine2(lines) && lines.some((l) => l.role !== 'Primary')) out.push('An additional line is on record before Primary Line 2.');
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

/**
 * A line added to an existing package. Either derived (`type`, its role and sequence, and what it costs) or still PENDING the agent's plan selection (`eligiblePlans` are the
 * plans to choose from); the package's Family Plan is the tier the line follows.
 */
export type AdditionalLine = { packageId: string; tierPlanId?: string } & (
  | { pending: true; eligiblePlans: EligiblePlan[] }
  | { pending?: false; role: FamilyRole; sequence: number; /** What the line is, derived from the package's state and the plan selected. */ type: FamilyLineType; /** Primary Line 2 is included; every other line is charged. */ charge: LineCharge }
);

/** What starting a Family Package with the selected plan means for this order. */
export type FamilyStartCheck =
  | { applies: false }
  | { applies: true; ok: true; /** The first line of a new package is always Primary Line 1. */ lineLabel: string; /** Undefined while a Secondary plan is still to be chosen. */ planId: string | undefined; /** Present for a line added to an existing package. */ additional?: AdditionalLine }
  | { applies: true; ok: false; kind: 'eligibility' | 'package' | 'owner'; reason: string };

/**
 * New Postpaid with a Family Plan selected starts a Family Package, so the order is Primary Line 1 and the plan is the package's. It can only start
 * when the customer has cleared the journey's eligibility checks (`eligibilityCleared`, the journey's own result, not a second rule) and holds no
 * Family Package yet: a customer who has one adds lines to it, never a second Primary Line 1. A plan that is not a Family Plan is not this rule's.
 */
export function familyStartCheck({ plan, eligibilityCleared, customerLines }: { plan: { productId: string; planClass?: unknown } | undefined; eligibilityCleared: boolean; customerLines: readonly FamilyLine[] }): FamilyStartCheck {
  if (!plan || !isFamilyPlan(plan)) return { applies: false };
  if (!eligibilityCleared) return { applies: true, ok: false, kind: 'eligibility', reason: 'This customer has not cleared eligibility, so a Family Plan cannot be started.' };
  if (customerLines.length > 0) return { applies: true, ok: false, kind: 'package', reason: 'This customer already has an active Family Package. Further Family Lines can be added to the existing package from Customer 360.' };
  return { applies: true, ok: true, lineLabel: 'Primary Line 1', planId: plan.productId };
}

/** How each role is named to the agent when choosing a connection to add. */
export const CONNECTION_TYPE_LABEL: Readonly<Record<FamilyRole, string>> = { Primary: 'Primary Line', Supplementary: 'Supplementary', Secondary: 'Secondary' };

export interface ConnectionOption {
  role: FamilyRole;
  label: string;
  /** What the line will be called: "Primary Line 2", "Supplementary Line 1". */
  lineLabel: string;
  sequence: number;
  /** Free (the package's included line) or Paid (the line's plan price). */
  charge: LineCharge;
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
    return c.ok ? [{ role, label: CONNECTION_TYPE_LABEL[role], lineLabel: lineLabel({ role, sequence: c.sequence }), sequence: c.sequence, charge: isFreeLine({ role, sequence: c.sequence }) ? 'Free' as const : 'Paid' as const }] : [];
  });
}

/** Why a package that exists has no connection type open to add: the dialog's title and the reasons, each the engine's own (nothing is worded twice). */
export interface ConnectionUnavailable {
  title: string;
  reasons: string[];
}

/**
 * Why a package that exists has nothing to add now, from its state: Primary Line 1 or Primary Line 2 awaiting approval (the order's status named), or both Primary Lines active
 * with no additional plan left to offer (each plan says why). Undefined when something CAN be added.
 */
export function connectionUnavailable(lines: readonly FamilyLine[], orders: readonly FamilyOrder[], catalogue: LineCatalogue = {}): ConnectionUnavailable | undefined {
  const state = resolvePackageState(lines, orders);
  if (!state.exists) return undefined;
  const statusText = (line: FamilyLine | undefined) => {
    const order = line ? orders.find((o) => o.orderId === line.orderId) : undefined;
    const status = order?.approvalStatus ?? (order ? order.status : undefined);
    return status ? ` (its order is ${status})` : '';
  };
  if (state.nextAction === 'AWAIT_PRIMARY_1') return { title: 'Primary Line 1 Awaiting Approval', reasons: [`Primary Line 1 is not approved yet${statusText(primaryLine1(lines))}: the other lines open once it is.`] };
  if (state.nextAction === 'AWAIT_PRIMARY_2') return { title: 'Primary Line 2 Awaiting Approval', reasons: [`Primary Line 2 is not active yet${statusText(primaryLine2(lines))}: additional connections open once both included Primary Lines are active.`] };
  if (state.nextAction === 'ADDITIONAL_PLAN' && eligibleAdditionalPlans(state, catalogue).length === 0) {
    const d = deriveFamilyLine({ lines, orders, catalogue });
    return { title: 'No Additional Plan Is Available', reasons: [d.ok ? 'No additional plan can be added to this Family Package now.' : d.reason] };
  }
  return undefined;
}

export interface PackageSummary {
  /** The package's Family Plan (Primary Line 1's). */
  planId: string | undefined;
  /** The lines on record, by type, each with its names ("Primary Line 1"). */
  activated: { role: FamilyRole; label: string; count: number; lines: string[] }[];
  /** What each type can still take: `remaining` is null where there is no limit. */
  available: { role: FamilyRole; label: string; remaining: number | null }[];
  /** The free lines still to be activated, and the paid types that open once they are (`paidOpen`). */
  free: ConnectionOption[];
  paid: ConnectionOption[];
  /** The paid types the package could take, whether or not they are open yet (they open when no free line is left). */
  paidTypes: { role: FamilyRole; label: string }[];
  paidOpen: boolean;
}

/** The package as the agent is shown it when a customer who has one asks for another: what is on it, what is left, and which of that is free or paid. */
export function packageSummary(lines: readonly FamilyLine[], orders: readonly FamilyOrder[], catalogue: LineCatalogue = {}): PackageSummary {
  const open = connectionOptions(lines, orders, catalogue);
  return {
    planId: packagePlanId(lines),
    activated: FAMILY_ROLES.flatMap((role) => {
      const inRole = lines.filter((l) => l.role === role).sort((a, b) => a.sequence - b.sequence);
      return inRole.length ? [{ role, label: role, count: inRole.length, lines: inRole.map(lineLabel) }] : [];
    }),
    available: FAMILY_ROLES.flatMap((role) => {
      const limit = FAMILY_ROLE_LIMITS[role];
      const used = lines.filter((l) => l.role === role).length;
      return limit !== null && used >= limit ? [] : [{ role, label: CONNECTION_TYPE_LABEL[role], remaining: limit === null ? null : limit - used }];
    }),
    free: open.filter((o) => o.charge === 'Free'),
    paid: open.filter((o) => o.charge === 'Paid'),
    paidTypes: FAMILY_ROLES.filter((r) => r !== FREE_LINE.role && (FAMILY_ROLE_LIMITS[r] === null || lines.filter((l) => l.role === r).length < FAMILY_ROLE_LIMITS[r]!)).map((role) => ({ role, label: CONNECTION_TYPE_LABEL[role] })),
    paidOpen: resolvePackageState(lines, orders).nextAction === 'ADDITIONAL_PLAN',
  };
}

/**
 * A line added to an EXISTING package: the package's lines (this customer's, in this package), the journey's eligibility result and the plan selected decide it, through
 * deriveFamilyLine - the agent never chooses a connection type. Primary Line 2 takes the package's plan; an additional line is on the plan selected (Family-equivalent ->
 * Supplementary, a Secondary plan -> Secondary) and `planId` is undefined until one is. No package, a package whose Primary Lines are not both active, or a selection that is not
 * (or is no longer) eligible is a refusal like any other.
 */
export function familyAdditionalCheck({ packageId, eligibilityCleared, packageLines, isOwner = true, orders, catalogue, chosenPlanId }: { packageId: string; eligibilityCleared: boolean; /** Every line of the package. */ packageLines: readonly FamilyLine[]; /** The ID validated is the Family Owner's (the customer of the package). */ isOwner?: boolean; orders: readonly FamilyOrder[]; catalogue: LineCatalogue; /** The plan selected so far (an additional line's is the agent's choice). */ chosenPlanId?: string }): FamilyStartCheck {
  if (!eligibilityCleared) return { applies: true, ok: false, kind: 'eligibility', reason: 'This customer has not cleared eligibility, so a connection cannot be added to the Family Package.' };
  if (packageLines.length === 0) return { applies: true, ok: false, kind: 'package', reason: 'This Family Package could not be found.' };
  // Every connection is registered to the Family Owner, so the ID validated for it must be theirs.
  if (!isOwner) return { applies: true, ok: false, kind: 'owner', reason: "This ID is not the Family Owner's. Every connection in a Family Package is registered to the Family Owner, so their ID must be validated." };
  const d = deriveFamilyLine({ lines: packageLines, orders, catalogue, selectedPlanId: chosenPlanId });
  if (!d.ok) return { applies: true, ok: false, kind: 'package', reason: d.reason };
  const tierPlanId = packagePlanId(packageLines);
  if ('pending' in d) return { applies: true, ok: true, lineLabel: 'Additional connection', planId: undefined, additional: { packageId, tierPlanId, pending: true, eligiblePlans: d.eligiblePlans } };
  return { applies: true, ok: true, lineLabel: lineLabel({ role: d.role, sequence: d.sequence }), planId: d.planId, additional: { packageId, tierPlanId, role: d.role, sequence: d.sequence, type: d.type, charge: d.charge } };
}

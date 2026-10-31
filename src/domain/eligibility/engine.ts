import { assertValidRuleConfig } from './config/schema';
import { withAlternative } from './config/pendingConfirmations';
import { APPROVAL_ORDER, REASON, message } from './reasonCodes';
import type {
  ApprovalRequirement, CountSnapshot, EligibilityClock, EligibilityDecision, EligibilityRequest, ExistingLine, IdType, RuleConfig, RuleResult, Segment,
  SegmentResolution,
} from './types';
import type { BlockOutcome, RuleContext } from './rules/context';
import { checkOverallLimit } from './rules/overall';
import { checkPostpaidCap, derivePostpaidApprovals } from './rules/postpaid';
import { checkPrepaidCap, derivePrepaidApprovals } from './rules/prepaid';
import { checkFixedFwaCap, deriveFixedFwaApprovals } from './rules/fixedFwa';
import { derivePassportApprovals } from './rules/passport';
import { deriveExceptionApprovals } from './rules/exceptions';

type Core = Omit<EligibilityDecision, 'pendingConfirmations' | 'evaluatedAt'>;

/** Every rule, in the order `rulesEvaluated` reports them. A rule that did not apply (or was not reached) reports SKIPPED. */
const RULE_CATALOGUE = [
  'OE-01', 'OE-02', 'OE-03',
  'PP-01', 'PP-02', 'PP-03', 'PP-04', 'PP-05',
  'PR-01', 'PR-02',
  'FX-01', 'FX-02', 'FX-03', 'FX-04', 'FX-05',
  'PB-01', 'PB-02', 'PB-03',
  'XC-01', 'XC-02', 'XC-03',
] as const;

const CONNECTION_TYPES = ['MOBILE_PREPAID', 'MOBILE_POSTPAID', 'FIXED_FWA'];
const ID_TYPES = ['QID', 'PASSPORT'];
const STATUSES = ['ACTIVE', 'SUSPENDED', 'BARRED', 'PENDING_ACTIVATION', 'TERMINATED'];
const KINDS = ['NEW_ACTIVATION', 'PREPAID_TO_POSTPAID_MIGRATION'];
const HOME_NATIONALITY = 'QA';

const snapshot = (prepaid: number, postpaid: number, fixedFwa: number): CountSnapshot => ({ prepaid, postpaid, mobileTotal: prepaid + postpaid, fixedFwa });
const NO_LINES = snapshot(0, 0, 0);
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** What is wrong with a request's shape (an empty list means it is usable). A missing nationality is NOT a shape problem: it leaves the segment unresolved. */
export function validateRequest(r: unknown): string[] {
  if (!isObject(r)) return ['the request must be an object'];
  const problems: string[] = [];
  if (!nonEmpty(r.requestId)) problems.push('requestId is required');
  const cust = r.customer;
  if (!isObject(cust)) problems.push('customer is required');
  else {
    if (!nonEmpty(cust.customerId)) problems.push('customer.customerId is required');
    if (!ID_TYPES.includes(cust.idType as string)) problems.push('customer.idType must be QID or PASSPORT');
    if (typeof cust.age !== 'number' || !Number.isFinite(cust.age) || cust.age < 0) problems.push('customer.age must be a number, not negative');
  }
  if (!CONNECTION_TYPES.includes(r.requestedType as string)) problems.push('requestedType is not a known connection type');
  if (!KINDS.includes(r.requestKind as string)) problems.push('requestKind is not a known request kind');
  else if (r.requestKind === KINDS[1] && r.requestedType !== 'MOBILE_POSTPAID') problems.push('a prepaid-to-postpaid migration requests a postpaid line');
  if (!Array.isArray(r.existingLines)) problems.push('existingLines must be a list');
  else if (r.existingLines.some((l) => !isObject(l) || !nonEmpty(l.lineId) || !CONNECTION_TYPES.includes(l.type as string) || !STATUSES.includes(l.status as string))) {
    problems.push('every existing line needs a lineId, a known type and a known status');
  }
  if (!Array.isArray(r.pendingOrders)) problems.push('pendingOrders must be a list');
  else if (r.pendingOrders.some((o) => !isObject(o) || !nonEmpty(o.orderId) || !CONNECTION_TYPES.includes(o.type as string))) {
    problems.push('every pending order line needs an orderId and a known type');
  }
  return problems;
}

/** QATARI or EXPATRIATE by the configured strategy; null when the nationality is missing or not a two-letter code. */
export function resolveSegment(nationality: unknown, idType: IdType, strategy: SegmentResolution): Segment | null {
  if (typeof nationality !== 'string' || !/^[A-Za-z]{2}$/.test(nationality)) return null;
  const qatari = nationality.toUpperCase() === HOME_NATIONALITY && (strategy === 'NATIONALITY' || idType === 'QID');
  return qatari ? 'QATARI' : 'EXPATRIATE';
}

/** Existing lines in a counted status, plus the slots reserved by orders in flight when the configuration counts them. */
export function countLines(request: EligibilityRequest, config: RuleConfig): CountSnapshot {
  let prepaid = 0;
  let postpaid = 0;
  let fixedFwa = 0;
  const add = (type: string) => {
    if (type === 'MOBILE_PREPAID') prepaid += 1;
    else if (type === 'MOBILE_POSTPAID') postpaid += 1;
    else fixedFwa += 1;
  };
  for (const line of request.existingLines) if (config.countedStatuses.includes(line.status)) add(line.type);
  if (config.includePendingOrders) for (const order of request.pendingOrders) add(order.type);
  return snapshot(prepaid, postpaid, fixedFwa);
}

const countsAfter = (before: CountSnapshot, request: EligibilityRequest): CountSnapshot => {
  if (request.requestKind === 'PREPAID_TO_POSTPAID_MIGRATION') return snapshot(before.prepaid - 1, before.postpaid + 1, before.fixedFwa);
  if (request.requestedType === 'MOBILE_PREPAID') return snapshot(before.prepaid + 1, before.postpaid, before.fixedFwa);
  if (request.requestedType === 'MOBILE_POSTPAID') return snapshot(before.prepaid, before.postpaid + 1, before.fixedFwa);
  return snapshot(before.prepaid, before.postpaid, before.fixedFwa + 1);
};

const ordinalOf = (before: CountSnapshot, type: string) => (type === 'MOBILE_PREPAID' ? before.prepaid : type === 'MOBILE_POSTPAID' ? before.postpaid : before.fixedFwa) + 1;

function report(results: RuleResult[]): RuleResult[] {
  const byId = new Map(results.map((r) => [r.ruleId, r.result]));
  return RULE_CATALOGUE.map((ruleId) => ({ ruleId, result: byId.get(ruleId) ?? 'SKIPPED' }));
}

const blocked = (requestId: string, segment: Segment | null, before: CountSnapshot, ordinal: number, version: string, b: BlockOutcome, results: RuleResult[]): Core => ({
  requestId, outcome: 'BLOCK', segment, approvals: [], block: b, countsBefore: before, countsAfter: null, requestedOrdinal: ordinal,
  rulesEvaluated: report([...results, { ruleId: 'XC-03', result: 'BLOCKED' }]), ruleSetVersion: version,
});

/** The decision without the clock or the TBC report: the part that is compared when working out which TBC keys mattered. */
function evaluateCore(request: EligibilityRequest, config: RuleConfig): Core {
  const version = config.version;
  const problems = validateRequest(request);
  if (problems.length > 0) {
    const id = isObject(request) && typeof (request as { requestId?: unknown }).requestId === 'string' ? (request as { requestId: string }).requestId : '';
    return {
      requestId: id, outcome: 'BLOCK', segment: null, approvals: [],
      block: { ruleId: 'INPUT_VALIDATION', reasonCode: REASON.INPUT_INVALID, message: message.inputInvalid(problems) },
      countsBefore: NO_LINES, countsAfter: null, requestedOrdinal: 0, rulesEvaluated: [], ruleSetVersion: version,
    };
  }
  const { requestId, customer } = request;
  const before = countLines(request, config);
  const migration = request.requestKind === 'PREPAID_TO_POSTPAID_MIGRATION';
  if (migration && before.prepaid < 1) {
    return {
      requestId, outcome: 'BLOCK', segment: null, approvals: [],
      block: { ruleId: 'INPUT_VALIDATION', reasonCode: REASON.INPUT_INVALID, message: message.inputInvalid(['a migration needs a prepaid line to migrate']) },
      countsBefore: before, countsAfter: null, requestedOrdinal: 0, rulesEvaluated: [], ruleSetVersion: version,
    };
  }
  const segment = resolveSegment(customer.nationality, customer.idType, config.segmentResolution);
  if (segment === null) {
    return {
      requestId, outcome: 'BLOCK', segment: null, approvals: [],
      block: { ruleId: 'XC-03', reasonCode: REASON.PROFILE_UNRESOLVED, message: message.profileUnresolved() },
      countsBefore: before, countsAfter: null, requestedOrdinal: 0, rulesEvaluated: [], ruleSetVersion: version,
    };
  }
  const ordinal = ordinalOf(before, request.requestedType);
  const ctx: RuleContext = { config, segment, requestedType: request.requestedType, kind: request.requestKind, ordinal, before, idType: customer.idType, age: customer.age };

  // Step 4: hard caps, before any approval is derived (XC-03).
  const overall = checkOverallLimit(ctx);
  const passportOverall: RuleResult = {
    ruleId: 'PB-03',
    result: customer.idType === 'PASSPORT' && overall.results.some((r) => r.ruleId === 'OE-01' && r.result !== 'SKIPPED') ? 'PASS' : 'SKIPPED',
  };
  const caps = [overall, checkPostpaidCap(ctx), checkPrepaidCap(ctx), checkFixedFwaCap(ctx)];
  const results: RuleResult[] = [passportOverall, ...caps.flatMap((c) => c.results)];
  const hit = caps.find((c) => c.block !== null);
  if (hit?.block) return blocked(requestId, segment, before, ordinal, version, hit.block, results);

  // Steps 5-7: approvals from the type rule, the passport rule and the exception rule.
  const derivations = [derivePostpaidApprovals(ctx), derivePrepaidApprovals(ctx), deriveFixedFwaApprovals(ctx), derivePassportApprovals(ctx), deriveExceptionApprovals(ctx)];
  const derived: ApprovalRequirement[] = derivations.flatMap((d) => d.approvals);
  // Step 8 (XC-01): approvals stack as a set; the first rule to ask for a type is the one named, and the order is fixed.
  const unique = APPROVAL_ORDER.flatMap((type) => derived.filter((a) => a.type === type).slice(0, 1));
  results.push(...derivations.flatMap((d) => d.results), { ruleId: 'XC-01', result: unique.length < derived.length ? 'TRIGGERED' : 'PASS' }, { ruleId: 'XC-03', result: 'PASS' });
  return {
    requestId, outcome: unique.length === 0 ? 'ALLOW' : 'ALLOW_WITH_APPROVAL', segment, approvals: unique, block: null,
    countsBefore: before, countsAfter: countsAfter(before, request), requestedOrdinal: ordinal, rulesEvaluated: report(results), ruleSetVersion: version,
  };
}

const signature = (d: Core) => JSON.stringify([d.outcome, d.approvals.map((a) => a.type), d.block?.reasonCode ?? null]);

/** The "to be confirmed" keys this decision depends on: those whose alternative reading would have changed the outcome, the approvals or the block. */
function pendingConfirmationsFor(request: EligibilityRequest, config: RuleConfig, core: Core): string[] {
  const keys: string[] = [];
  const own = signature(core);
  for (const key of config.pendingConfirmations) {
    if (key === 'migration.approvalThresholdsApply') {
      if (request.requestKind === 'PREPAID_TO_POSTPAID_MIGRATION') keys.push(key);
      continue;
    }
    const alternative = withAlternative(config, key);
    if (alternative !== null && signature(evaluateCore(request, alternative)) !== own) keys.push(key);
  }
  return keys;
}

export function evaluateEligibility(request: EligibilityRequest, config: RuleConfig, clock: EligibilityClock): EligibilityDecision {
  assertValidRuleConfig(config);
  const core = evaluateCore(request, config);
  return { ...core, pendingConfirmations: validateRequest(request).length === 0 ? pendingConfirmationsFor(request, config, core) : [], evaluatedAt: clock().toISOString() };
}

/**
 * A cart: the lines are evaluated in order, and each line that is not blocked counts toward the next one (its countsAfter is the next
 * countsBefore). Every request carries the customer's lines as they were before the cart; the engine adds the earlier cart lines itself.
 */
export function evaluateCart(requests: EligibilityRequest[], config: RuleConfig, clock: EligibilityClock): EligibilityDecision[] {
  const added: ExistingLine[] = [];
  const migratedAway = new Set<string>();
  return requests.map((request) => {
    const lines = Array.isArray(request.existingLines) ? [...request.existingLines.filter((l) => !migratedAway.has(l.lineId)), ...added] : request.existingLines;
    const decision = evaluateEligibility({ ...request, existingLines: lines }, config, clock);
    if (decision.outcome !== 'BLOCK') {
      if (request.requestKind === 'PREPAID_TO_POSTPAID_MIGRATION') {
        const moved = lines.find((l) => l.type === 'MOBILE_PREPAID' && config.countedStatuses.includes(l.status));
        if (moved) migratedAway.add(moved.lineId);
      }
      added.push({ lineId: `cart:${request.requestId}`, type: request.requestedType, status: 'ACTIVE' });
    }
    return decision;
  });
}

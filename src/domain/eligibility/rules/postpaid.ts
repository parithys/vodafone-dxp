import { REASON, message } from '../reasonCodes';
import type { ApprovalDerivation, CapCheck, RuleContext } from './context';
import { isPostpaidRequest } from './context';

/**
 * PP-03 (expatriate, defensive: past the Credit Control band) and the Qatari postpaid maximum, if one is configured. A migration onto
 * postpaid is judged by the same ordinal.
 */
export function checkPostpaidCap(c: RuleContext): CapCheck {
  if (!isPostpaidRequest(c)) return { results: [], block: null };
  if (c.segment === 'EXPATRIATE') {
    const upTo = c.config.expatriate.postpaid.creditControlUpTo;
    if (c.ordinal > upTo) {
      return {
        results: [{ ruleId: 'PP-03', result: 'BLOCKED' }],
        block: { ruleId: 'PP-03', reasonCode: REASON.ELIG_POSTPAID_CAP_REACHED, message: message.postpaidCap(c.before, upTo) },
      };
    }
    return { results: [], block: null };
  }
  const max = c.config.qatari.postpaid.max;
  if (max !== null && c.ordinal > max) {
    return {
      results: [{ ruleId: 'PP-05', result: 'BLOCKED' }],
      block: { ruleId: 'PP-05', reasonCode: REASON.ELIG_POSTPAID_CAP_REACHED, message: message.postpaidCap(c.before, max) },
    };
  }
  return { results: [], block: null };
}

/** PP-01 / PP-02 (expatriate) and PP-04 / PP-05 (Qatari): free up to a count, Credit Control beyond it. */
export function derivePostpaidApprovals(c: RuleContext): ApprovalDerivation {
  if (!isPostpaidRequest(c)) return { results: [], approvals: [] };
  const expatriate = c.segment === 'EXPATRIATE';
  const freeUpTo = expatriate ? c.config.expatriate.postpaid.freeUpTo : c.config.qatari.postpaid.freeUpTo;
  if (c.ordinal <= freeUpTo) return { results: [{ ruleId: expatriate ? 'PP-01' : 'PP-04', result: 'PASS' }], approvals: [] };
  const ruleId = expatriate ? 'PP-02' : 'PP-05';
  return {
    results: [{ ruleId, result: 'TRIGGERED' }],
    approvals: [{ type: 'CREDIT_CONTROL', ruleId, reasonCode: REASON.APPR_CC_POSTPAID_THRESHOLD, message: message.creditControlPostpaid(c.ordinal) }],
  };
}

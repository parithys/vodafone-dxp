import { REASON, message } from '../reasonCodes';
import type { RuleResult } from '../types';
import type { ApprovalDerivation, CapCheck, RuleContext } from './context';

const isFixedRequest = (c: RuleContext) => c.requestedType === 'FIXED_FWA';

/** FX-02 (expatriate) / FX-04 (Qatari): the Fixed/FWA maximum, if one is configured. Fixed/FWA never counts toward the mobile limit (FX-05). */
export function checkFixedFwaCap(c: RuleContext): CapCheck {
  const results: RuleResult[] = [{ ruleId: 'FX-05', result: 'PASS' }];
  if (!isFixedRequest(c)) return { results: [{ ruleId: 'FX-05', result: 'SKIPPED' }], block: null };
  const expatriate = c.segment === 'EXPATRIATE';
  const max = expatriate ? c.config.expatriate.fixedFwa.max : c.config.qatari.fixedFwa.max;
  if (max !== null && c.ordinal > max) {
    const ruleId = expatriate ? 'FX-02' : 'FX-04';
    return {
      results: [...results, { ruleId, result: 'BLOCKED' }],
      block: { ruleId, reasonCode: REASON.ELIG_FIXED_FWA_CAP_REACHED, message: message.fixedFwaCap(c.before, max) },
    };
  }
  return { results, block: null };
}

/** FX-01 / FX-02 (expatriate) and FX-03 / FX-04 (Qatari): free up to a count, Credit Control beyond it. */
export function deriveFixedFwaApprovals(c: RuleContext): ApprovalDerivation {
  if (!isFixedRequest(c)) return { results: [], approvals: [] };
  const expatriate = c.segment === 'EXPATRIATE';
  const freeUpTo = expatriate ? c.config.expatriate.fixedFwa.freeUpTo : c.config.qatari.fixedFwa.freeUpTo;
  if (c.ordinal <= freeUpTo) return { results: [{ ruleId: expatriate ? 'FX-01' : 'FX-03', result: 'PASS' }], approvals: [] };
  const ruleId = expatriate ? 'FX-02' : 'FX-04';
  return {
    results: [{ ruleId, result: 'TRIGGERED' }],
    approvals: [{ type: 'CREDIT_CONTROL', ruleId, reasonCode: REASON.APPR_CC_FIXED_FWA_THRESHOLD, message: message.creditControlFixedFwa(c.ordinal) }],
  };
}

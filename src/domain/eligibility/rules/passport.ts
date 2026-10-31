import { REASON, message } from '../reasonCodes';
import type { ApprovalRequirement, RuleResult } from '../types';
import type { ApprovalDerivation, RuleContext } from './context';
import { isPostpaidRequest } from './context';

/**
 * PB-01 / PB-02 (pending re-confirmation, behind `passportBauRule.enabled`): every postpaid activation on a passport needs BAU approval,
 * and a postpaid line inside the configured ordinal band also needs Credit Control. PB-03 (the overall mobile limit also applies to a
 * passport) is the overall rule itself and is reported by it.
 */
export function derivePassportApprovals(c: RuleContext): ApprovalDerivation {
  const rule = c.config.passportBauRule;
  if (!rule.enabled || c.idType !== 'PASSPORT' || !isPostpaidRequest(c)) {
    return { results: [{ ruleId: 'PB-01', result: 'SKIPPED' }, { ruleId: 'PB-02', result: 'SKIPPED' }], approvals: [] };
  }
  const approvals: ApprovalRequirement[] = [{ type: 'BAU', ruleId: 'PB-01', reasonCode: REASON.APPR_BAU_PASSPORT_POSTPAID, message: message.bauPassport() }];
  const results: RuleResult[] = [{ ruleId: 'PB-01', result: 'TRIGGERED' }];
  if (c.ordinal >= rule.creditControlFromOrdinal && c.ordinal <= rule.creditControlUpTo) {
    approvals.push({ type: 'CREDIT_CONTROL', ruleId: 'PB-02', reasonCode: REASON.APPR_CC_PASSPORT_POSTPAID_THRESHOLD, message: message.creditControlPassport(c.ordinal) });
    results.push({ ruleId: 'PB-02', result: 'TRIGGERED' });
  } else {
    results.push({ ruleId: 'PB-02', result: 'SKIPPED' });
  }
  return { results, approvals };
}

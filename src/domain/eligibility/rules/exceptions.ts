import { REASON, message } from '../reasonCodes';
import type { ApprovalDerivation, RuleContext } from './context';

/** XC-02: a customer under the configured age adds the under-18 exception approval, whatever the connection type. */
export function deriveExceptionApprovals(c: RuleContext): ApprovalDerivation {
  const rule = c.config.exceptions.under18;
  if (!rule.enabled) return { results: [{ ruleId: 'XC-02', result: 'SKIPPED' }], approvals: [] };
  if (c.age < rule.ageThreshold) {
    return {
      results: [{ ruleId: 'XC-02', result: 'TRIGGERED' }],
      approvals: [{ type: 'EXCEPTION_UNDER_18', ruleId: 'XC-02', reasonCode: REASON.APPR_EXCEPTION_UNDER_18, message: message.exceptionUnder18(c.age) }],
    };
  }
  return { results: [{ ruleId: 'XC-02', result: 'PASS' }], approvals: [] };
}

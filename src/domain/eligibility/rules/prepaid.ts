import { REASON, message } from '../reasonCodes';
import type { ApprovalDerivation, CapCheck, RuleContext } from './context';

const isPrepaidRequest = (c: RuleContext) => c.requestedType === 'MOBILE_PREPAID';

/** PR-01 (expatriate) / PR-02 (Qatari): the prepaid maximum, if one is configured. Prepaid never needs an approval of its own. */
export function checkPrepaidCap(c: RuleContext): CapCheck {
  if (!isPrepaidRequest(c)) return { results: [], block: null };
  const expatriate = c.segment === 'EXPATRIATE';
  const ruleId = expatriate ? 'PR-01' : 'PR-02';
  const max = expatriate ? c.config.expatriate.prepaid.max : c.config.qatari.prepaid.max;
  if (max !== null && c.ordinal > max) {
    return {
      results: [{ ruleId, result: 'BLOCKED' }],
      block: { ruleId, reasonCode: REASON.ELIG_PREPAID_CAP_REACHED, message: message.prepaidCap(c.before, max) },
    };
  }
  return { results: [{ ruleId, result: 'PASS' }], block: null };
}

/** Prepaid adds no approval (PR-01, PR-02). Passport and age rules may still add theirs. */
export function derivePrepaidApprovals(_c: RuleContext): ApprovalDerivation {
  return { results: [], approvals: [] };
}

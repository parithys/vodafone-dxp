import { REASON, message } from '../reasonCodes';
import type { RuleResult } from '../types';
import type { CapCheck, RuleContext } from './context';
import { isMigration } from './context';

/**
 * OE-01 / OE-02 / OE-03 - the overall mobile limit: prepaid and postpaid together, Fixed/FWA never included. The expatriate limit blocks and
 * no approval can override it; a segment with no limit configured (the Qatari) is never blocked here. A migration leaves the mobile total
 * unchanged, so it skips the check.
 */
export function checkOverallLimit(c: RuleContext): CapCheck {
  const mobile = c.requestedType !== 'FIXED_FWA';
  const expatriate = c.segment === 'EXPATRIATE';
  const ruleId = expatriate ? 'OE-01' : 'OE-02';
  const results: RuleResult[] = [{ ruleId: 'OE-03', result: 'PASS' }];
  const other = expatriate ? 'OE-02' : 'OE-01';
  results.push({ ruleId: other, result: 'SKIPPED' });
  if (!mobile || isMigration(c)) {
    results.push({ ruleId, result: 'SKIPPED' });
    return { results, block: null };
  }
  const max = expatriate ? c.config.expatriate.mobileTotalMax : c.config.qatari.mobileTotalMax;
  if (max !== null && c.before.mobileTotal + 1 > max) {
    results.push({ ruleId, result: 'BLOCKED' });
    return { results, block: { ruleId, reasonCode: REASON.ELIG_MOBILE_TOTAL_CAP_REACHED, message: message.mobileTotalCap(c.before, max) } };
  }
  results.push({ ruleId, result: 'PASS' });
  return { results, block: null };
}

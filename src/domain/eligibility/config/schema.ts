import type { RuleConfig } from '../types';

const STATUSES = ['ACTIVE', 'SUSPENDED', 'BARRED', 'PENDING_ACTIVATION', 'TERMINATED'];
const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0;
const isLimit = (v: unknown): v is number | null => v === null || isCount(v);

/** What is wrong with a rule configuration (an empty list means it is usable). Thresholds must be whole numbers, not negative, and a free allowance cannot exceed its maximum. */
export function validateRuleConfig(c: RuleConfig): string[] {
  const problems: string[] = [];
  const count = (path: string, v: unknown) => {
    if (!isCount(v)) problems.push(`${path} must be a whole number, not negative`);
  };
  const limit = (path: string, v: unknown) => {
    if (!isLimit(v)) problems.push(`${path} must be a whole number, not negative, or null for no limit`);
  };
  const within = (path: string, free: unknown, max: unknown) => {
    if (isCount(free) && isCount(max) && free > max) problems.push(`${path}.freeUpTo must not exceed its maximum`);
  };

  if (typeof c.version !== 'string' || c.version.length === 0) problems.push('version must be a non-empty string');
  if (c.segmentResolution !== 'NATIONALITY' && c.segmentResolution !== 'ID_TYPE') problems.push('segmentResolution must be NATIONALITY or ID_TYPE');
  if (!Array.isArray(c.countedStatuses) || c.countedStatuses.some((s) => !STATUSES.includes(s))) problems.push('countedStatuses must list known line statuses');
  if (typeof c.includePendingOrders !== 'boolean') problems.push('includePendingOrders must be true or false');

  limit('expatriate.mobileTotalMax', c.expatriate?.mobileTotalMax);
  count('expatriate.postpaid.freeUpTo', c.expatriate?.postpaid?.freeUpTo);
  count('expatriate.postpaid.creditControlUpTo', c.expatriate?.postpaid?.creditControlUpTo);
  within('expatriate.postpaid', c.expatriate?.postpaid?.freeUpTo, c.expatriate?.postpaid?.creditControlUpTo);
  limit('expatriate.prepaid.max', c.expatriate?.prepaid?.max);
  count('expatriate.fixedFwa.freeUpTo', c.expatriate?.fixedFwa?.freeUpTo);
  limit('expatriate.fixedFwa.max', c.expatriate?.fixedFwa?.max);
  within('expatriate.fixedFwa', c.expatriate?.fixedFwa?.freeUpTo, c.expatriate?.fixedFwa?.max);

  limit('qatari.mobileTotalMax', c.qatari?.mobileTotalMax);
  count('qatari.postpaid.freeUpTo', c.qatari?.postpaid?.freeUpTo);
  limit('qatari.postpaid.max', c.qatari?.postpaid?.max);
  within('qatari.postpaid', c.qatari?.postpaid?.freeUpTo, c.qatari?.postpaid?.max);
  limit('qatari.prepaid.max', c.qatari?.prepaid?.max);
  count('qatari.fixedFwa.freeUpTo', c.qatari?.fixedFwa?.freeUpTo);
  limit('qatari.fixedFwa.max', c.qatari?.fixedFwa?.max);
  within('qatari.fixedFwa', c.qatari?.fixedFwa?.freeUpTo, c.qatari?.fixedFwa?.max);

  if (typeof c.passportBauRule?.enabled !== 'boolean') problems.push('passportBauRule.enabled must be true or false');
  count('passportBauRule.creditControlFromOrdinal', c.passportBauRule?.creditControlFromOrdinal);
  count('passportBauRule.creditControlUpTo', c.passportBauRule?.creditControlUpTo);
  if (isCount(c.passportBauRule?.creditControlFromOrdinal) && isCount(c.passportBauRule?.creditControlUpTo) && c.passportBauRule.creditControlFromOrdinal > c.passportBauRule.creditControlUpTo) {
    problems.push('passportBauRule.creditControlFromOrdinal must not exceed creditControlUpTo');
  }
  if (typeof c.exceptions?.under18?.enabled !== 'boolean') problems.push('exceptions.under18.enabled must be true or false');
  count('exceptions.under18.ageThreshold', c.exceptions?.under18?.ageThreshold);
  if (!Array.isArray(c.pendingConfirmations) || c.pendingConfirmations.some((k) => typeof k !== 'string')) problems.push('pendingConfirmations must be a list of keys');
  return problems;
}

export function assertValidRuleConfig(c: RuleConfig): void {
  const problems = validateRuleConfig(c);
  if (problems.length > 0) throw new Error(`Invalid eligibility rule configuration: ${problems.join('; ')}`);
}

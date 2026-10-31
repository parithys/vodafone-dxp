import type { RuleConfig } from '../types';

/**
 * Rule set 1.0.0. The ONLY place the eligibility thresholds live (`null` = no limit). To change a number, copy this file to
 * eligibility.rules.vN.ts with a new `version`, change it there, and pass that config to the engine: decisions name the version they used.
 */
export const ruleConfigV1: RuleConfig = {
  version: '1.0.0',
  segmentResolution: 'NATIONALITY',
  countedStatuses: ['ACTIVE', 'SUSPENDED', 'BARRED', 'PENDING_ACTIVATION'],
  includePendingOrders: true,
  expatriate: {
    mobileTotalMax: 5,
    postpaid: { freeUpTo: 2, creditControlUpTo: 5 },
    prepaid: { max: 5 },
    fixedFwa: { freeUpTo: 1, max: null },
  },
  qatari: {
    mobileTotalMax: null,
    postpaid: { freeUpTo: 5, max: null },
    prepaid: { max: null }, // TBC: null (unlimited) or 10
    fixedFwa: { freeUpTo: 2, max: null }, // TBC: null (unlimited) or 10
  },
  passportBauRule: { enabled: true, creditControlFromOrdinal: 3, creditControlUpTo: 5 },
  exceptions: { under18: { enabled: true, ageThreshold: 18 } },
  pendingConfirmations: [
    'qatari.prepaid.max',
    'qatari.fixedFwa.max',
    'passportBauRule.enabled',
    'segmentResolution',
    'countedStatuses',
    'migration.approvalThresholdsApply',
  ],
};

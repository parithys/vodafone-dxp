import type { LineStatus, RuleConfig, SegmentResolution } from '../types';

/**
 * How a decision learns which "to be confirmed" configuration keys actually influenced it: it is evaluated again with each key
 * set to its alternative reading, and a key is reported only when the outcome, the approvals or the block change. The alternative
 * readings are data, so they live here with the rest of the configuration rather than in the engine.
 */
export const ALTERNATIVE_MAX = 10;
/** The statuses counted under the narrowest reading (only lines that are live). */
export const ALTERNATIVE_COUNTED_STATUSES: readonly LineStatus[] = ['ACTIVE'];

const flip = (r: SegmentResolution): SegmentResolution => (r === 'NATIONALITY' ? 'ID_TYPE' : 'NATIONALITY');
const otherMax = (v: number | null) => (v === null ? ALTERNATIVE_MAX : null);

/** The configuration with `key` read the other way, or null when the key is not one with an alternative (it is then never reported). */
export function withAlternative(config: RuleConfig, key: string): RuleConfig | null {
  switch (key) {
    case 'qatari.prepaid.max':
      return { ...config, qatari: { ...config.qatari, prepaid: { max: otherMax(config.qatari.prepaid.max) } } };
    case 'qatari.fixedFwa.max':
      return { ...config, qatari: { ...config.qatari, fixedFwa: { ...config.qatari.fixedFwa, max: otherMax(config.qatari.fixedFwa.max) } } };
    case 'passportBauRule.enabled':
      return { ...config, passportBauRule: { ...config.passportBauRule, enabled: !config.passportBauRule.enabled } };
    case 'segmentResolution':
      return { ...config, segmentResolution: flip(config.segmentResolution) };
    case 'countedStatuses':
      return { ...config, countedStatuses: ALTERNATIVE_COUNTED_STATUSES };
    default:
      return null;
  }
}

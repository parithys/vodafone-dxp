import type { ApprovalRequirement, ConnectionType, CountSnapshot, IdType, RequestKind, RuleConfig, RuleResult, Segment } from '../types';

/** What every rule module is given. Rules never read anything else. */
export interface RuleContext {
  config: RuleConfig;
  segment: Segment;
  requestedType: ConnectionType;
  kind: RequestKind;
  /** The position the requested line would take among lines of its type: existing count + 1. */
  ordinal: number;
  before: CountSnapshot;
  idType: IdType;
  age: number;
}

export interface BlockOutcome {
  ruleId: string;
  reasonCode: string;
  message: string;
}

/** The hard-cap half of a rule group (step 4): it may block, and reports the rules it checked. */
export interface CapCheck {
  results: RuleResult[];
  block: BlockOutcome | null;
}

/** The approval half of a rule group (steps 5-7): the approvals the rules add, and the rules that ran. */
export interface ApprovalDerivation {
  results: RuleResult[];
  approvals: ApprovalRequirement[];
}

export const isPostpaidRequest = (c: RuleContext) => c.requestedType === 'MOBILE_POSTPAID';
export const isMigration = (c: RuleContext) => c.kind === 'PREPAID_TO_POSTPAID_MIGRATION';

// Contracts of the Connection Eligibility & Approval Rule Engine. Pure data: nothing here imports from the application.

export type Segment = 'EXPATRIATE' | 'QATARI';
export type ConnectionType = 'MOBILE_PREPAID' | 'MOBILE_POSTPAID' | 'FIXED_FWA';
export type IdType = 'QID' | 'PASSPORT';
export type LineStatus = 'ACTIVE' | 'SUSPENDED' | 'BARRED' | 'PENDING_ACTIVATION' | 'TERMINATED';
export type ApprovalType = 'CREDIT_CONTROL' | 'BAU' | 'EXCEPTION_UNDER_18';
export type RequestKind = 'NEW_ACTIVATION' | 'PREPAID_TO_POSTPAID_MIGRATION';
export type SegmentResolution = 'NATIONALITY' | 'ID_TYPE';

export interface ExistingLine {
  lineId: string;
  type: ConnectionType;
  status: LineStatus;
}
export interface PendingOrderLine {
  orderId: string;
  type: ConnectionType;
}

export interface EligibilityRequest {
  requestId: string;
  customer: {
    customerId: string;
    /** ISO 3166-1 alpha-2. Missing or malformed -> the segment cannot be resolved. */
    nationality: string;
    idType: IdType;
    age: number;
  };
  requestedType: ConnectionType;
  requestKind: RequestKind;
  existingLines: ExistingLine[];
  pendingOrders: PendingOrderLine[];
}

export interface ApprovalRequirement {
  type: ApprovalType;
  ruleId: string;
  reasonCode: string;
  message: string;
}

export interface CountSnapshot {
  prepaid: number;
  postpaid: number;
  mobileTotal: number;
  fixedFwa: number;
}

export type RuleResultKind = 'PASS' | 'TRIGGERED' | 'BLOCKED' | 'SKIPPED';
export interface RuleResult {
  ruleId: string;
  result: RuleResultKind;
}

export interface EligibilityDecision {
  requestId: string;
  outcome: 'ALLOW' | 'ALLOW_WITH_APPROVAL' | 'BLOCK';
  segment: Segment | null;
  /** Empty when ALLOW or BLOCK. Ordered BAU, CREDIT_CONTROL, EXCEPTION_UNDER_18. */
  approvals: ApprovalRequirement[];
  block: { ruleId: string; reasonCode: string; message: string } | null;
  countsBefore: CountSnapshot;
  /** Null when BLOCK. */
  countsAfter: CountSnapshot | null;
  requestedOrdinal: number;
  rulesEvaluated: RuleResult[];
  ruleSetVersion: string;
  /** Config keys marked TBC that influenced this decision. */
  pendingConfirmations: string[];
  /** ISO-8601, from the injected clock. */
  evaluatedAt: string;
}

/** `null` means "no limit". Every number the engine compares against lives here. */
export interface RuleConfig {
  version: string;
  segmentResolution: SegmentResolution;
  countedStatuses: readonly LineStatus[];
  includePendingOrders: boolean;
  expatriate: {
    mobileTotalMax: number | null;
    postpaid: { freeUpTo: number; creditControlUpTo: number };
    prepaid: { max: number | null };
    fixedFwa: { freeUpTo: number; max: number | null };
  };
  qatari: {
    mobileTotalMax: number | null;
    postpaid: { freeUpTo: number; max: number | null };
    prepaid: { max: number | null };
    fixedFwa: { freeUpTo: number; max: number | null };
  };
  passportBauRule: { enabled: boolean; creditControlFromOrdinal: number; creditControlUpTo: number };
  exceptions: { under18: { enabled: boolean; ageThreshold: number } };
  pendingConfirmations: readonly string[];
}

export type EligibilityClock = () => Date;

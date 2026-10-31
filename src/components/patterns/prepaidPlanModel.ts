/** A prepaid starter pack, as the products catalogue holds it. */
export interface PrepaidPlan {
  productId: string;
  name: string;
  type: string;
  starterPackChargeQAR: number;
  dataAllowanceGB: number | null;
  minutesAllowance: string;
  packValidityDays: number | null;
  popular?: boolean;
  /** When present, the pack is offered only to these customer segments (MPRA_001_QPC_02); absent = every segment. */
  eligibleSegments?: string[];
}

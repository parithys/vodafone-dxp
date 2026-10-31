// Credit-limit rules, in one place. Pure: the screens, the order submits and the tests all read these.
//
//   Customer segment (Qatari or Expat) comes from nationality; Customer Category (HRN / Non-HRN) from the nationality MOI returned.
//   Default credit limit: HRN 50, Qatari 4,000, Expat 1,000 (hrnConfiguration.defaultCreditLimit).
//   A new account's limit is chosen from the defaults that apply to the customer's segment (BR-254's preset list, up to the segment's own default);
//   HRN allows no choice. An existing account's limit cannot be changed for a Safwa / Safwa+ / Royal customer, an HRN customer, or when Credit
//   Control has set one - and it can otherwise, by the same options.
//   The limit is shown as: Overall, Default, Credit Control Team, and the increase due to a deposit.
import { defaultCreditLimit, hrnAdvanceQar, isHrn, isQatariNationality } from './hrnConfiguration';
import { restrictedSegmentOf } from '../data/customerSegments';
import { formatQar } from '../lib/format';

export type CreditSegment = 'Qatari' | 'Expat';
export type CustomerCategory = 'HRN' | 'Non-HRN';

/** Qatari or Expat, from the nationality. Undefined when no nationality is known: nothing is guessed. */
export function creditSegmentOf(nationality: string | undefined): CreditSegment | undefined {
  if (!nationality?.trim()) return undefined;
  return isQatariNationality(nationality) ? 'Qatari' : 'Expat';
}

/** HRN or Non-HRN, from the nationality MOI returned. */
export const customerCategoryOf = (nationality: string | undefined): CustomerCategory => (isHrn(nationality) ? 'HRN' : 'Non-HRN');

/** The default credit limit for a nationality (HRN 50, Qatari 4,000, Expat 1,000). */
export const defaultCreditLimitFor = (nationality: string | undefined): number => defaultCreditLimit({ nationality });

/** The account type a journey opens: every journey here is a Consumer one, so the agent's journey decides it and the agent never picks it. */
export type JourneyAccountType = 'Consumer Mobile Postpaid' | 'Consumer Fixed Line (GigaHome)' | 'Consumer Mobile Prepaid';
export function accountTypeForJourney(journey: 'postpaid'): 'Consumer Mobile Postpaid';
export function accountTypeForJourney(journey: 'fixed-line'): 'Consumer Fixed Line (GigaHome)';
export function accountTypeForJourney(journey: 'prepaid'): 'Consumer Mobile Prepaid';
export function accountTypeForJourney(journey: 'postpaid' | 'fixed-line' | 'prepaid'): JourneyAccountType;
export function accountTypeForJourney(journey: 'postpaid' | 'fixed-line' | 'prepaid'): JourneyAccountType {
  return journey === 'fixed-line' ? 'Consumer Fixed Line (GigaHome)' : journey === 'prepaid' ? 'Consumer Mobile Prepaid' : 'Consumer Mobile Postpaid';
}
export const isConsumerAccountType = (accountType: string | undefined): boolean => /^consumer\b/i.test(accountType ?? '');

/** BR-254: an agent selects a credit limit from a fixed list, never a typed number. */
export const CREDIT_LIMIT_PRESETS_QAR: readonly number[] = [0, 50, 200, 500, 800, 1000, 1500, 2000];

/**
 * The credit limits an agent may choose for a customer: the preset values up to the segment's own default (plus that default, when it is not a
 * preset - a Qatari's 4,000). HRN: only the HRN default (no choice). Unknown nationality: the Expat list.
 */
export function creditLimitOptions(nationality: string | undefined): number[] {
  const defaultQar = defaultCreditLimitFor(nationality);
  if (isHrn(nationality)) return [defaultQar];
  return [...new Set([...CREDIT_LIMIT_PRESETS_QAR, defaultQar])].filter((v) => v <= defaultQar).sort((a, b) => a - b);
}

export type CreditLimitLock = 'protected-segment' | 'hrn' | 'credit-control';
export interface CreditLimitPolicy {
  editable: boolean;
  lock?: CreditLimitLock;
  message?: string;
  options: number[];
  defaultQar: number;
}

const LOCK_MESSAGE: Record<CreditLimitLock, string> = {
  'protected-segment': 'The credit limit of a Safwa, Safwa+ or Royal customer cannot be changed.',
  hrn: 'The credit limit of an HRN customer cannot be changed.',
  'credit-control': 'This credit limit was set by the Credit Control Team and cannot be changed by an agent.',
};

/** May an agent change this account's credit limit, and to what. Locks are checked in this order: protected segment, HRN, Credit Control. */
export function creditLimitPolicy(c: { segment?: string; nationality?: string; creditControlLimitQar?: number | null }): CreditLimitPolicy {
  const defaultQar = defaultCreditLimitFor(c.nationality);
  const lock: CreditLimitLock | undefined = restrictedSegmentOf(c.segment)
    ? 'protected-segment'
    : isHrn(c.nationality) || /\bHRN\b/i.test(c.segment ?? '')
      ? 'hrn'
      : typeof c.creditControlLimitQar === 'number'
        ? 'credit-control'
        : undefined;
  return { editable: lock === undefined, lock, message: lock ? LOCK_MESSAGE[lock] : undefined, options: creditLimitOptions(c.nationality), defaultQar };
}

export interface CreditLimitRecord {
  creditLimitQar?: number;
  creditLimitQAR?: number;
  /** The limit an agent chose from the options. */
  selectedCreditLimitQar?: number | null;
  /** The limit the Credit Control Team set; blank (null / absent) when it has not. */
  creditControlLimitQar?: number | null;
}

export interface CreditLimitBreakdown {
  /** What is in force: the Credit Control Team's limit if set, else the agent's choice, else the default - plus any deposit increase. */
  overall: number | undefined;
  default: number;
  creditControl: number | null;
  depositIncrease: number;
}

/**
 * The four figures shown under Credit Limit. A record that predates the breakdown (only `creditLimitQar`) keeps its stored limit as the overall one.
 */
export function creditLimitBreakdown(record: CreditLimitRecord | undefined, defaultQar: number, depositIncreaseQar = 0): CreditLimitBreakdown {
  const stored = record?.creditLimitQar ?? record?.creditLimitQAR;
  const creditControl = typeof record?.creditControlLimitQar === 'number' ? record.creditControlLimitQar : null;
  const selected = typeof record?.selectedCreditLimitQar === 'number' ? record.selectedCreditLimitQar : undefined;
  const hasBreakdown = creditControl !== null || selected !== undefined;
  const overall = hasBreakdown ? (creditControl ?? selected ?? defaultQar) + depositIncreaseQar : stored ?? (record ? defaultQar + depositIncreaseQar : undefined);
  return { overall, default: defaultQar, creditControl, depositIncrease: depositIncreaseQar };
}

/** The increase due to a deposit: the deposits held on the account (an Active deposit bundle), in QAR. */
export const depositIncreaseOf = (accountId: string | undefined, bundles: readonly { accountId?: string; depositAmountQar?: number; status?: string }[]): number =>
  accountId ? bundles.filter((b) => b.accountId === accountId && /^active$/i.test(b.status ?? '')).reduce((s, b) => s + (b.depositAmountQar ?? 0), 0) : 0;

/** What the agent is told is payable alongside the limit: the HRN advance for an HRN customer, nothing for anyone else. */
export function payableAtActivationQar(nationality: string | undefined, personaId?: string): number {
  return hrnAdvanceQar({ nationality, personaId });
}

// ---- HRN fee and Credit Risk ------------------------------------------------------------------------------------------------------------

export interface CreditRiskSource {
  creditRisk?: string;
  creditRiskExemption?: string;
  creditRiskUpdatedAt?: string;
}
export interface BigDataCreditRisk extends CreditRiskSource {
  customerId: string;
}

/**
 * The HRN fee (advance) is NOT marked when the customer's Credit Risk Exemption is Low or No. Any other value - and no value at all (unknown stays
 * unknown, so the nationality rule stands) - leaves the fee as the nationality sets it.
 */
export const hrnFeeApplies = (creditRiskExemption: string | undefined): boolean => !/^(low|no)$/i.test((creditRiskExemption ?? '').trim());

/** The credit risk in force: Big Data's input for the customer when it has one, else what the customer record carries. */
export function resolveCreditRisk(customer: (CreditRiskSource & { customerId?: string }) | undefined, feed: readonly BigDataCreditRisk[]): CreditRiskSource & { source: 'Big Data' | 'Customer record' | undefined } {
  const fromBigData = customer?.customerId ? feed.find((f) => f.customerId === customer.customerId) : undefined;
  if (fromBigData) return { creditRisk: fromBigData.creditRisk, creditRiskExemption: fromBigData.creditRiskExemption, creditRiskUpdatedAt: fromBigData.creditRiskUpdatedAt, source: 'Big Data' };
  const has = customer && (customer.creditRisk !== undefined || customer.creditRiskExemption !== undefined);
  return { creditRisk: customer?.creditRisk, creditRiskExemption: customer?.creditRiskExemption, creditRiskUpdatedAt: customer?.creditRiskUpdatedAt, source: has ? 'Customer record' : undefined };
}

/** Whether the customer record needs Big Data's input written to it (the stored risk differs from the feed's). */
export function creditRiskPatch(customer: (CreditRiskSource & { customerId?: string }) | undefined, feed: readonly BigDataCreditRisk[]): CreditRiskSource | undefined {
  const fromBigData = customer?.customerId ? feed.find((f) => f.customerId === customer.customerId) : undefined;
  if (!fromBigData || !customer) return undefined;
  const same = customer.creditRisk === fromBigData.creditRisk && customer.creditRiskExemption === fromBigData.creditRiskExemption && customer.creditRiskUpdatedAt === fromBigData.creditRiskUpdatedAt;
  return same ? undefined : { creditRisk: fromBigData.creditRisk, creditRiskExemption: fromBigData.creditRiskExemption, creditRiskUpdatedAt: fromBigData.creditRiskUpdatedAt };
}

// ---- Audit trail --------------------------------------------------------------------------------------------------------------------------

export interface CreditLimitAuditInput {
  /** The account the limit belongs to (the record Customer 360's Audit Trail is joined on); else the customer. */
  recordId: string;
  fromQar?: number;
  toQar: number;
  by: string;
  how: 'Selected by agent' | 'Set by Credit Control' | 'Default on a new account' | 'Selected on a new account';
  now?: Date;
}

/** An audit-trail row for a credit-limit change (the shape audit-trail.json uses, with the old value and how it came about). */
export function creditLimitAuditRecord(i: CreditLimitAuditInput): Record<string, unknown> {
  const now = i.now ?? new Date();
  return {
    auditId: `AUD-${now.getTime().toString().slice(-8)}`,
    recordType: 'Credit Limit',
    recordId: i.recordId,
    employeeUser: i.by,
    fieldModified: 'Credit Limit',
    oldValue: i.fromQar === undefined ? undefined : `${formatQar(i.fromQar)}`,
    newValue: `${formatQar(i.toQar)}`,
    changeBasis: i.how,
    timestamp: now.toISOString(),
  };
}

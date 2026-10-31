import { COLLECTION_TEAM_ROLE } from '../../capabilities/CustomerType/customerTypeModel';
import { creditLimitAuditRecord, creditLimitPolicy } from '../../engines/creditLimit';

/**
 * A credit limit change is not applied by the agent: it is REQUESTED, and the relevant team (Credit Control) approves or rejects it. The request is an
 * order of this type in the approval queue; approving it applies the new limit (see applyCreditLimitChange), rejecting it leaves the limit as it was.
 */
export const CREDIT_LIMIT_CHANGE_ORDER_TYPE = 'Credit Limit Change';

export interface CreditLimitChangeOrder {
  orderType?: unknown;
  customerId?: unknown;
  requestedCreditLimitQar?: unknown;
  accountId?: unknown;
}

/** The change a Credit Limit Change order asks for, or undefined when the order is not one (or is missing what it needs). */
export const creditLimitChangeOf = (o: CreditLimitChangeOrder): { customerId: string; creditLimitQar: number; accountId?: string } | undefined =>
  o.orderType === CREDIT_LIMIT_CHANGE_ORDER_TYPE && typeof o.customerId === 'string' && typeof o.requestedCreditLimitQar === 'number'
    ? { customerId: o.customerId, creditLimitQar: o.requestedCreditLimitQar, accountId: typeof o.accountId === 'string' ? o.accountId : undefined }
    : undefined;

interface Deps {
  list: (kind: 'credit-limits') => Promise<{ id: string; customerId?: string; creditLimitQar?: number }[]>;
  updateRecord: (kind: 'credit-limits', idField: string, id: string, patch: Record<string, unknown>) => Promise<void>;
  createRecord: (kind: 'credit-limits' | 'audit-trail', record: Record<string, unknown>) => Promise<void>;
}

/**
 * Writes the limit Credit Control approved. It is the Credit Control Team's limit: it goes onto the customer's credit-limit record as
 * `creditControlLimitQar` (which from then on an agent cannot change), the overall limit follows, and the change is written to the audit trail.
 */
export async function applyCreditLimitChange(
  change: { customerId: string; creditLimitQar: number; accountId?: string; by?: string },
  deps: Deps,
  today = new Date().toISOString().slice(0, 10)
): Promise<void> {
  const existing = (await deps.list('credit-limits')).find((r) => r.customerId === change.customerId);
  const patch = { creditLimitQar: change.creditLimitQar, creditControlLimitQar: change.creditLimitQar, lastUpdated: today };
  if (existing) await deps.updateRecord('credit-limits', 'id', existing.id, patch);
  else await deps.createRecord('credit-limits', { id: `CRL-${Date.now().toString().slice(-6)}`, customerId: change.customerId, accountId: change.accountId, ...patch });
  await deps.createRecord(
    'audit-trail',
    creditLimitAuditRecord({ recordId: change.accountId ?? change.customerId, fromQar: existing?.creditLimitQar, toQar: change.creditLimitQar, by: change.by ?? COLLECTION_TEAM_ROLE, how: 'Set by Credit Control' })
  );
}

/**
 * An AGENT changes an existing account's credit limit - allowed only when the policy says so (not a Safwa / Safwa+ / Royal customer, not HRN, not a
 * limit the Credit Control Team set) and only to one of the values that apply to the customer. Applied directly, and written to the audit trail.
 */
export async function applyAgentCreditLimitChange(
  change: {
    customer: { customerId: string; segment?: string; nationality?: string };
    record: { id?: string; creditLimitQar?: number; creditControlLimitQar?: number | null } | undefined;
    accountId?: string;
    toQar: number;
    agentId: string;
  },
  deps: Deps,
  today = new Date().toISOString().slice(0, 10)
): Promise<{ ok: true } | { ok: false; message: string }> {
  const policy = creditLimitPolicy({ segment: change.customer.segment, nationality: change.customer.nationality, creditControlLimitQar: change.record?.creditControlLimitQar });
  if (!policy.editable) return { ok: false, message: policy.message ?? 'The credit limit cannot be changed.' };
  if (!policy.options.includes(change.toQar)) return { ok: false, message: 'Choose one of the credit limits offered for this customer.' };
  const patch = { creditLimitQar: change.toQar, selectedCreditLimitQar: change.toQar === policy.defaultQar ? null : change.toQar, setByAgentId: change.agentId, lastUpdated: today };
  if (change.record?.id) await deps.updateRecord('credit-limits', 'id', change.record.id, patch);
  else await deps.createRecord('credit-limits', { id: `CRL-${Date.now().toString().slice(-6)}`, customerId: change.customer.customerId, accountId: change.accountId, defaultCreditLimitQar: policy.defaultQar, creditControlLimitQar: null, ...patch });
  await deps.createRecord('audit-trail', creditLimitAuditRecord({ recordId: change.accountId ?? change.customer.customerId, fromQar: change.record?.creditLimitQar, toQar: change.toQar, by: change.agentId, how: 'Selected by agent' }));
  return { ok: true };
}

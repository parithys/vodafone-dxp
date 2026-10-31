import * as mockDataEngine from './mockDataEngine';
import { classifyProductName } from './customerServicesEngine';
import { evaluateEligibility, ruleConfigV1 } from '../domain/eligibility';
import type { ConnectionType, EligibilityDecision, EligibilityRequest, ExistingLine, IdType, LineStatus, PendingOrderLine, RequestKind } from '../domain/eligibility';

// The application's side of the Connection Eligibility & Approval Rule Engine (src/domain/eligibility): it reads what the engine is given -
// the customer's lines, the orders in flight, the identity - from the app's data, asks the engine, and nothing else. The rules are the
// engine's; this file decides no threshold.

/** The ID types the engine has rules for. Any other document (GCC ID, Diplomatic ID, other) is not evaluated by it. */
const ENGINE_ID_TYPE: Record<string, IdType> = { QID: 'QID', Passport: 'PASSPORT' };

/** The engine reads nationality as a country code and only distinguishes the Qatari. The app holds nationality as a name ("Qatari", "Indian"). */
const QATARI = 'Qatari';
const COUNTRY_QATAR = 'QA';
const COUNTRY_OTHER = 'ZZ';

const LINE_STATUS: Record<string, LineStatus> = { active: 'ACTIVE', suspended: 'SUSPENDED', barred: 'BARRED' };
const FIXED_CATEGORIES = new Set(['Fixed Line', 'GigaHome Fibre', 'GigaHome 5G']);

/** The connection a service is, by the one definition Customer 360 uses; services that are neither mobile nor fixed/FWA are not connections here. */
function connectionTypeOfService(name: string | undefined): ConnectionType | undefined {
  const { category } = classifyProductName(name);
  if (category === 'Prepaid') return 'MOBILE_PREPAID';
  if (category === 'Postpaid') return 'MOBILE_POSTPAID';
  return FIXED_CATEGORIES.has(category) ? 'FIXED_FWA' : undefined;
}

/** An order type that adds a line (an activation or a port-in); plan, pack and add-on changes add none. Its connection is read by the same definition as a service's. */
const ADDS_A_LINE = /^(new|mnp) /i;
const FWA = /\bfwa\b/i;
function connectionTypeOfOrder(orderType: string | undefined): ConnectionType | undefined {
  const t = orderType ?? '';
  if (!ADDS_A_LINE.test(t)) return undefined;
  return FWA.test(t) ? 'FIXED_FWA' : connectionTypeOfService(t);
}

const HELD_ORDER_STATUS = 'Submitted for Approval';

const ageOn = (dob: string, now: Date): number | undefined => {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return undefined;
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  if (now.getUTCMonth() < d.getUTCMonth() || (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate())) age -= 1;
  return age;
};

export interface ConnectionEligibilityInput {
  /** The existing customer's record, when there is one; a new customer has no lines and no orders in flight. */
  customerId?: string;
  nationality?: string;
  /** The document type presented ('QID', 'Passport', ...). */
  idType?: string;
  dob?: string;
  requestedType: ConnectionType;
  requestKind?: RequestKind;
  now?: Date;
}

interface AssetRecord { accountId: string; productServiceName?: string; serviceId?: string; installedAssetId?: string; status?: string }
interface AccountRecord { accountId: string; customerId: string; barringStatus?: string }
interface OrderRecord { orderId: string; customerId?: string; orderType?: string; status?: string }

/**
 * The engine's decision for this customer and this connection, or null when the engine does not cover it: an ID type it has no rules for, or
 * a customer whose date of birth is unknown (the under-18 rule cannot be judged). Lines whose status is not one the app knows are left out, not
 * assumed live.
 */
export async function evaluateConnection(input: ConnectionEligibilityInput): Promise<EligibilityDecision | null> {
  const idType = ENGINE_ID_TYPE[input.idType ?? ''];
  const now = input.now ?? new Date();
  const age = input.dob ? ageOn(input.dob, now) : undefined;
  if (!idType || age === undefined) return null;

  const existingLines: ExistingLine[] = [];
  const pendingOrders: PendingOrderLine[] = [];
  if (input.customerId) {
    const [accounts, assets, orders] = await Promise.all([
      mockDataEngine.list<AccountRecord>('accounts'),
      mockDataEngine.list<AssetRecord>('installed-assets'),
      mockDataEngine.list<OrderRecord>('orders'),
    ]);
    const own = new Map(accounts.filter((a) => a.customerId === input.customerId).map((a) => [a.accountId, a]));
    for (const asset of assets) {
      const account = own.get(asset.accountId);
      const type = account ? connectionTypeOfService(asset.productServiceName) : undefined;
      if (!account || !type) continue;
      const barred = account.barringStatus !== undefined && account.barringStatus !== 'Not Barred';
      const status = barred ? 'BARRED' : LINE_STATUS[(asset.status ?? '').toLowerCase()];
      if (status) existingLines.push({ lineId: asset.installedAssetId ?? asset.serviceId ?? `${asset.accountId}:${existingLines.length}`, type, status });
    }
    for (const order of orders) {
      const type = order.customerId === input.customerId && order.status === HELD_ORDER_STATUS ? connectionTypeOfOrder(order.orderType) : undefined;
      if (type) pendingOrders.push({ orderId: order.orderId, type });
    }
  }
  const request: EligibilityRequest = {
    requestId: `conn-${input.customerId ?? 'new'}-${input.requestedType}`,
    customer: {
      customerId: input.customerId ?? 'new',
      nationality: input.nationality === undefined ? (undefined as unknown as string) : input.nationality === QATARI ? COUNTRY_QATAR : COUNTRY_OTHER,
      idType,
      age,
    },
    requestedType: input.requestedType,
    requestKind: input.requestKind ?? 'NEW_ACTIVATION',
    existingLines,
    pendingOrders,
  };
  return evaluateEligibility(request, ruleConfigV1, () => now);
}

/** The Credit Control approval is the one that routes the order to the Credit Control role; the others keep the order's usual approver. */
export const needsCreditControl = (decision: Pick<EligibilityDecision, 'approvals'> | undefined): boolean =>
  Boolean(decision?.approvals.some((a) => a.type === 'CREDIT_CONTROL'));

/** What the order keeps of the engine's decision, so the approver sees which approvals were asked for, why, and under which rule set. */
export function decisionRecord(decision: EligibilityDecision | undefined) {
  if (!decision) return {};
  return {
    lineEligibility: {
      ruleSetVersion: decision.ruleSetVersion,
      outcome: decision.outcome,
      approvals: decision.approvals.map((a) => ({ type: a.type, ruleId: a.ruleId, reasonCode: a.reasonCode, message: a.message })),
      countsBefore: decision.countsBefore,
      requestedOrdinal: decision.requestedOrdinal,
      pendingConfirmations: decision.pendingConfirmations,
    },
  };
}

/** The approvals the engine asked for, in the agent's words, for an order's approval reason. */
export const approvalMessages = (decision: EligibilityDecision | undefined): string =>
  decision && decision.outcome === 'ALLOW_WITH_APPROVAL' ? decision.approvals.map((a) => a.message).join(' ') : '';

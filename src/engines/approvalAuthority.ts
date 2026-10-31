import { canPerformAction } from './personaEngine';
import { getRequiredApproverRole, isApprovalMatrixAvailable } from './configEngine';

// Who may decide an approval, and when - one rule for every approval screen, so the Approve / Reject buttons appear for
// exactly the people authorised to use them and only while there is something to decide.
//
// Three independent conditions, each reported separately so a screen can say WHY it shows no buttons:
//   1. the order / ticket / SIM swap is still awaiting a decision (a decided one shows its outcome, never buttons);
//   2. the signed-in persona holds the Approve level on the approval screen (personas.json grants - View-level roles read
//      the record and get no decision buttons);
//   3. the approver's job title is the role the approval matrix requires for this kind of record (unconfigured = open to
//      any holder of the grant, the stance the app already takes for unconfirmed matrix entries).

/** An order sits in this status from submission until an approver decides it. */
export const ORDER_AWAITING_DECISION = 'Submitted for Approval';
/**
 * A SIM swap request waiting for a decision: what the wizard writes (ORDER_AWAITING_DECISION) and what the seeded records call it
 * ('Pending Approval'). The queue, the dashboard counter and Customer 360 all use this, not a string of their own.
 */
export const isSimSwapAwaitingDecision = (status: unknown): boolean => status === ORDER_AWAITING_DECISION || status === 'Pending Approval';

export type ApprovalBlock = 'not-awaiting' | 'no-grant' | 'wrong-role' | 'matrix-unavailable' | 'own-order';

export interface ApprovalAuthority {
  /** The Approve / Reject / Return actions are offered. */
  mayDecide: boolean;
  /** Why they are not (undefined when mayDecide). */
  blockedBy?: ApprovalBlock;
  /** The role the matrix names for this record, when there is one. */
  requiredRole?: string;
}

/** The Approve level on an approval screen (SCR-061 order approval detail, SCR-196 SIM swap queue ...). */
export const holdsApproveGrant = (personaId: string, screenId: string) => canPerformAction(personaId, screenId, 'Approve');

export function orderApprovalAuthority(args: {
  personaId: string;
  jobTitle?: string;
  status: string;
  orderType: string;
  /** The role the order itself was routed to (line-cap and manual-ID orders carry one); wins over the matrix. */
  approverRole?: string;
  /** Who created the order and who is deciding: nobody decides an order they created themselves (maker-checker). */
  createdBy?: string;
  userId?: string;
}): ApprovalAuthority {
  const requiredRole = args.approverRole ?? getRequiredApproverRole(args.orderType);
  if (args.status !== ORDER_AWAITING_DECISION) return { mayDecide: false, blockedBy: 'not-awaiting', requiredRole };
  if (!holdsApproveGrant(args.personaId, 'SCR-061')) return { mayDecide: false, blockedBy: 'no-grant', requiredRole };
  if (args.createdBy && args.userId && args.createdBy === args.userId) return { mayDecide: false, blockedBy: 'own-order', requiredRole };
  if (requiredRole && requiredRole !== args.jobTitle) return { mayDecide: false, blockedBy: 'wrong-role', requiredRole };
  // No role on the order and no matrix to consult: the approval rules did not load, which is not the same as a category with no restriction.
  if (!requiredRole && !args.approverRole && !isApprovalMatrixAvailable()) return { mayDecide: false, blockedBy: 'matrix-unavailable' };
  return { mayDecide: true, requiredRole };
}

/** Whether a persona + job title may CLAIM / open an order from the queue (the same two checks, ignoring status). */
export const mayClaimOrder = (args: { personaId: string; jobTitle?: string; orderType: string; approverRole?: string; createdBy?: string; userId?: string }): boolean =>
  orderApprovalAuthority({ ...args, status: ORDER_AWAITING_DECISION }).mayDecide;

/** The SIM swap queue is worked by the fulfilment roles (Edit and above on it); sales roles only raise the requests. */
export function simSwapDecisionAuthority(args: { personaId: string; status: string }): ApprovalAuthority {
  if (!isSimSwapAwaitingDecision(args.status)) return { mayDecide: false, blockedBy: 'not-awaiting' };
  if (!canPerformAction(args.personaId, 'SCR-196', 'Edit')) return { mayDecide: false, blockedBy: 'no-grant' };
  return { mayDecide: true };
}

/** A line telling the reader why there are no decision buttons (undefined when there is nothing to explain). */
export function approvalBlockMessage(subject: 'order' | 'ticket' | 'SIM swap', a: ApprovalAuthority): string | undefined {
  if (a.mayDecide || !a.blockedBy || a.blockedBy === 'not-awaiting') return undefined;
  if (a.blockedBy === 'matrix-unavailable') return `The approval rules could not be loaded, so this ${subject} cannot be decided right now. Reload the page.`;
  if (a.blockedBy === 'own-order') return `You created this ${subject}, so someone else has to decide it.`;
  if (a.blockedBy === 'wrong-role') return `Only the ${a.requiredRole} role may approve, reject, or return this ${subject}.`;
  return `You have view access to this ${subject}; approving or rejecting it needs the Approve permission, which your role does not hold.`;
}

// ---- Shared-state views ---------------------------------------------------------------------------------------------
// Every persona reads and writes the same records (the data engine's store), so what each role sees is a VIEW of that
// state: the approver's queue is the orders awaiting a decision that are routed to them, and the creator's inbox is the
// decisions taken on the orders they created. Nothing below is stored - it is recomputed from the orders and activities.

interface OrderLike {
  orderId: string;
  orderType: string;
  status: string;
  approverRole?: string;
  assignedApproverId?: string | null;
  createdBy?: string;
  customerName?: string;
}

/** Orders waiting for THIS viewer to decide: awaiting, routed to their role (or unrouted) and not claimed by someone else. */
export function ordersAwaitingDecisionBy<T extends OrderLike>(orders: T[], who: { personaId: string; jobTitle?: string; userId?: string }): T[] {
  return orders.filter(
    (o) =>
      o.status === ORDER_AWAITING_DECISION &&
      (!o.assignedApproverId || o.assignedApproverId === who.userId) &&
      mayClaimOrder({ personaId: who.personaId, jobTitle: who.jobTitle, orderType: o.orderType, approverRole: o.approverRole, createdBy: o.createdBy, userId: who.userId })
  );
}

export interface DecisionRecord {
  orderId: string;
  actionTaken?: string;
  notes?: string;
  transactionDate?: string;
}

/** A decision taken on an order, as the order's creator reads it. */
export interface OrderDecision {
  orderId: string;
  outcome: 'Approved' | 'Rejected' | 'Dropped' | 'Returned';
  status: string;
  at: number;
  note?: string;
}

const OUTCOME_BY_STATUS: Record<string, OrderDecision['outcome']> = {
  Complete: 'Approved',
  Approved: 'Approved',
  'Rejected - Correction': 'Rejected',
  Cancelled: 'Dropped',
};

/** Decisions on the orders this user created, newest first - the latest approval activity on each decided order. */
export function decisionsOnMyOrders(orders: OrderLike[], activities: DecisionRecord[], userId: string | undefined): OrderDecision[] {
  if (!userId) return [];
  const out: OrderDecision[] = [];
  for (const o of orders) {
    if (o.createdBy !== userId) continue;
    const outcome = OUTCOME_BY_STATUS[o.status];
    if (!outcome) continue;
    const last = activities
      .filter((a) => a.orderId === o.orderId && a.actionTaken && /^(Approved|Rejected|Returned)/.test(a.actionTaken))
      .sort((a, b) => String(b.transactionDate ?? '').localeCompare(String(a.transactionDate ?? '')))[0];
    // A seeded order with no recorded decision (e.g. activated directly) is not a decision anyone needs to be told about.
    if (!last) continue;
    out.push({ orderId: o.orderId, outcome, status: o.status, at: new Date(last.transactionDate ?? 0).getTime() || 0, note: last.notes });
  }
  return out.sort((a, b) => b.at - a.at);
}

/** Whether the creator may send a rejected order back for another decision. */
export const mayResubmitOrder = (o: Pick<OrderLike, 'status' | 'createdBy'>, userId: string | undefined): boolean =>
  o.status === 'Rejected - Correction' && Boolean(userId) && o.createdBy === userId;

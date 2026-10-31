import { useEffect, useMemo, useState } from 'react';
import { useRestrictedCustomers } from '../hooks/useRestrictedCustomers';
import { useEntityStore } from '../stores/entityStore';
import { useAuthStore } from '../stores/authStore';
import { usePersonaStore } from '../stores/personaStore';
import { decisionsOnMyOrders, holdsApproveGrant, ordersAwaitingDecisionBy, type DecisionRecord } from '../engines/approvalAuthority';

// The bell's "workflow updates": what the shared order state means for whoever is signed in right now. An approver sees
// the orders awaiting their decision; the agent who created an order sees the decision taken on it. Derived from the
// orders and activities every role reads and writes - nothing here is stored per role - so switching role immediately
// shows that role's own view of the same evolving state.

export interface InboxItem {
  id: string;
  kind: 'awaiting' | 'decision';
  title: string;
  detail: string;
  to: string;
  at: number;
}

const ORDER_DETAIL = '/order-management/order-approval-detail-attachments-order-details-activities-a';
// Not a "vfq-" key: sign-out clears those, and which updates a person has already seen should outlive it like the orders do.
const SEEN_KEY = 'dxp-seen-workflow-updates';

const readSeen = (): Set<string> => {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
};

interface OrderRow {
  orderId: string;
  orderType: string;
  status: string;
  approverRole?: string;
  assignedApproverId?: string | null;
  createdBy?: string;
  createdAt?: string;
  customerName?: string;
  customerId?: string;
}

export function useWorkflowInbox() {
  const loadKind = useEntityStore((s) => s.loadKind);
  const rawOrders = useEntityStore((s) => s.records.orders);
  const rawActivities = useEntityStore((s) => s.records['customer-activities']);
  const allOrders = useMemo(() => (rawOrders ?? []) as unknown as OrderRow[], [rawOrders]);
  // An order of a protected-segment customer this role may not see is never announced - not its id, not the customer's name; nothing until customers are known.
  const guard = useRestrictedCustomers();
  const orders = useMemo(() => guard.filter(allOrders, (o) => o.customerId).visible, [guard, allOrders]);
  const activities = useMemo(() => (rawActivities ?? []) as unknown as DecisionRecord[], [rawActivities]);
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const jobTitle = useAuthStore((s) => s.profile?.jobTitle);
  const userId = useAuthStore((s) => s.profile?.userId);
  const [seen, setSeen] = useState<Set<string>>(readSeen);

  useEffect(() => {
    loadKind('orders');
    loadKind('customer-activities');
  }, [loadKind]);

  const items = useMemo<InboxItem[]>(() => {
    const out: InboxItem[] = [];
    if (holdsApproveGrant(personaId, 'SCR-061')) {
      for (const o of ordersAwaitingDecisionBy(orders, { personaId, jobTitle, userId })) {
        out.push({
          id: `await-${o.orderId}`,
          kind: 'awaiting',
          title: `Order ${o.orderId} awaits your decision`,
          detail: [o.orderType, o.customerName, o.approverRole ? `routed to ${o.approverRole}` : ''].filter(Boolean).join(' · '),
          to: `${ORDER_DETAIL}?id=${o.orderId}`,
          at: o.createdAt ? new Date(o.createdAt).getTime() : 0,
        });
      }
    }
    for (const d of decisionsOnMyOrders(orders, activities, userId)) {
      out.push({
        id: `decision-${d.orderId}-${d.at}`,
        kind: 'decision',
        title: `Order ${d.orderId} ${d.outcome === 'Approved' ? 'approved' : d.outcome === 'Rejected' ? 'rejected for correction' : d.outcome === 'Dropped' ? 'dropped' : 'returned'}`,
        detail: d.note ?? d.status,
        to: `${ORDER_DETAIL}?id=${d.orderId}`,
        at: d.at,
      });
    }
    return out.sort((a, b) => b.at - a.at).slice(0, 12);
  }, [orders, activities, personaId, jobTitle, userId]);

  // Seen per signed-in agent: after a role switch the next agent has not seen what the previous one opened.
  const seenKey = (id: string) => `${userId ?? ''}|${id}`;
  const unseen = items.filter((i) => !seen.has(seenKey(i.id))).length;
  const markSeen = () => {
    const next = new Set([...seen, ...items.map((i) => seenKey(i.id))]);
    setSeen(next);
    try {
      sessionStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
    } catch {
      // storage blocked: the dot just returns on the next load
    }
  };
  return { items, unseen, markSeen };
}

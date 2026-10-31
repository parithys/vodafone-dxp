import { demoContentColumn, matchesOrderFilters, orderMatchesQuery, type OrderFilters } from './demoContentColumn';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedRowsNotice } from '../../components/patterns/RestrictedRowsNotice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/primitives/DataTable';
import { Button } from '../../components/primitives/Button';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { isVisibleToAgent } from '../../engines/agentTaskEngine';
import { getRequiredApproverRole } from '../../engines/configEngine';
import { mayClaimOrder } from '../../engines/approvalAuthority';
import { usePersonaStore } from '../../stores/personaStore';

interface Order {
  orderId: string;
  orderType: string;
  /** Set when the order needs a specific approver regardless of its category (e.g. manually entered identity). */
  approverRole?: string;
  approvalReason?: string;
  status: string;
  customerName?: string;
  customerId?: string;
  assignedApproverId?: string | null;
  demoTitle?: string;
  demoDetail?: string;
}

// SCR-060/SCR-197: TM SR Queue View / Order Approval Queue - manager queue of
// order-approval activities awaiting assignment ("Assign to Me" per
// guided-journeys-fixed-line-open-ui-tablet-fixed-line-prepatc-aa41d84a).
// Filters to orders in `Submitted for Approval` status - B2B2C orders from the
// New Fixed Line/FWA/Postpaid wizards route here (see those wizards' onSubmit).
//
// Agent 360 AAV-02: "display all approval tasks assigned to the specific
// agent." Previously "Assign to Me" was a pure navigation button - it never
// recorded who claimed the order, so every approver saw the same shared
// queue forever. It now sets assignedApproverId on click, and the queue
// hides orders claimed by someone else (isVisibleToAgent - same rule as
// Agent Task View's per-agent scoping).
//
// Also AAV-01: assignment eligibility is gated by the configured approval
// matrix (getRequiredApproverRole) - see OrderApprovalDetail.tsx for the
// matching enforcement on the action buttons themselves.
interface OrderApprovalQueueProps {
  /** False when embedded in a parent that already provides the same padding
   * (OrdersWorkspace's own p-8 around its Tabs) - true (self-padded) for the
   * standalone legacy-route usage at SCR-060/SCR-197, which has no other
   * padding source. */
  padded?: boolean;
  /** Narrows the queue to orders matching this text (the Orders workspace's search box). */
  query?: string;
  /** Order Type / Status filters from the Orders workspace. */
  filters?: OrderFilters;
}

export function OrderApprovalQueue({ padded = true, query = '', filters }: OrderApprovalQueueProps) {
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as Order[];
  const guard = useRestrictedCustomers();
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const loadError = useEntityStore((s) => s.errors.orders);
  const loading = useEntityStore((s) => s.loading.orders);
  const navigate = useNavigate();
  const currentAgentId = useAuthStore((s) => s.profile?.userId);
  const currentJobTitle = useAuthStore((s) => s.profile?.jobTitle);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);

  useEffect(() => {
    loadKind('orders');
  }, [loadKind]);

  // AAV-01: assignment must follow the configured approval matrix - an
  // order stays visible to everyone in the shared queue (so the right
  // approver can find it), but only an agent whose role matches the
  // category's required role can actually claim it.
  const isEligible = (order: Order) => mayClaimOrder({ personaId: activePersonaId, jobTitle: currentJobTitle, orderType: order.orderType, approverRole: order.approverRole, createdBy: (order as { createdBy?: string }).createdBy, userId: currentAgentId });

  // Orders of a protected-segment customer this role may not see are left out of the queue (and counted), never drawn; nothing is listed until
  // customers are known. Counted among the orders that WOULD be in this queue, so the notice matches the list.
  const { visible, hiddenCount } = guard.filter(
    orders
      .filter((o) => o.status === 'Submitted for Approval')
      .filter((o) => isVisibleToAgent(o.assignedApproverId, currentAgentId))
      .filter((o) => orderMatchesQuery(o, query) && matchesOrderFilters(o, filters)),
    (o) => o.customerId
  );
  // Orders this viewer can decide come first; the rest stay visible (with who they need) below them.
  const pending = [...visible].sort((a, b) => Number(isEligible(b)) - Number(isEligible(a)));

  const assignToMe = (order: Order) => {
    if (order.assignedApproverId !== currentAgentId) {
      updateRecord('orders', 'orderId', order.orderId, { assignedApproverId: currentAgentId ?? null });
    }
    navigate(`/order-management/order-approval-detail-attachments-order-details-activities-a?id=${order.orderId}`);
  };

  return (
    <div className={padded ? 'p-8' : ''}>
      <ErrorBanner message={loadError} />
      <RestrictedRowsNotice count={hiddenCount} />
      <DataTable<Order>
        fixedLayout
        columns={[
          // Order # opens the order's detail page for viewing; "Assign to Me" / "Open" still claim the order first.
          { key: 'orderId', header: 'Order #', cellClassName: 'w-[10%]', linkTo: (r) => `/order-management/order-approval-detail-attachments-order-details-activities-a?id=${r.orderId}` },
          demoContentColumn,
          // Opens the customer's Customer 360 page; a new customer with no record yet stays plain text.
          { key: 'customerName', header: 'Customer Name', cellClassName: 'w-[20%]', linkTo: (r) => (r.customerId ? `/customer/${r.customerId}` : undefined) },
          { key: 'orderType', header: 'Order Type', cellClassName: 'w-[18%] break-words' },
          {
            key: 'action',
            header: '',
            cellClassName: 'w-[24%]',
            render: (r) =>
              isEligible(r) ? (
                <Button variant="secondary" compact onClick={() => assignToMe(r)}>
                  {r.assignedApproverId === currentAgentId ? 'Open' : 'Assign to Me'}
                </Button>
              ) : (
                <span className="text-muted text-[length:var(--fs-caption)]">
                  Requires: {r.approverRole ?? getRequiredApproverRole(r.orderType)}
                </span>
              ),
          },
        ]}
        rows={pending}
        rowKey={(r) => r.orderId}
        emptyMessage={query.trim() || (filters && (filters.orderType !== 'all' || filters.status !== 'all')) ? 'No orders awaiting approval match your search or filters.' : 'No orders awaiting approval.'}
        loading={loading || !guard.ready}
      />
    </div>
  );
}

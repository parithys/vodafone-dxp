import { useEffect, useState } from 'react';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { Tabs } from '../../components/primitives/Tabs';
import { SearchField } from '../../components/primitives/SearchField';
import { MySalesOrders } from '../../modules/order-management/MySalesOrders';
import { OrderApprovalQueue } from '../../modules/order-management/OrderApprovalQueue';
import { PageHeader } from '../../components/patterns/PageHeader';
import { FilterSelect } from '../customer360/sections/C360Kit';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { usePersonaStore } from '../../stores/personaStore';
import { holdsApproveGrant, ordersAwaitingDecisionBy } from '../../engines/approvalAuthority';

// Cross-customer order workspace - the standalone counterpart to Customer
// 360's Orders tab. Wraps the two existing order-management screens
// unchanged (own submitted orders vs. the approval queue) rather than
// re-implementing their table/queue logic. One search box narrows whichever
// tab is open (and the other, so a search carries across the tabs).
export function OrdersWorkspace() {
  const [query, setQuery] = useState('');
  const [orderType, setOrderType] = useState('all');
  const [status, setStatus] = useState('all');
  // The approval tab says how many orders are waiting on THIS role, from the same shared orders every role works on.
  const loadKind = useEntityStore((s) => s.loadKind);
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as { orderId: string; orderType: string; status: string; approverRole?: string; assignedApproverId?: string | null }[];
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const jobTitle = useAuthStore((s) => s.profile?.jobTitle);
  const userId = useAuthStore((s) => s.profile?.userId);
  useEffect(() => {
    loadKind('orders');
  }, [loadKind]);
  const typeOptions = [{ value: 'all', label: 'All' }, ...[...new Set(orders.map((o) => o.orderType))].sort().map((v) => ({ value: v, label: v }))];
  const statusOptions = [{ value: 'all', label: 'All' }, ...[...new Set(orders.map((o) => o.status))].sort().map((v) => ({ value: v, label: v }))];
  const filters = { orderType, status };
  // The tab count follows the list under it: orders of a protected-segment customer this role may not see are not counted.
  const guard = useRestrictedCustomers();
  const visibleOrders = guard.filter(orders, (o) => (o as { customerId?: string }).customerId).visible;
  const mine = holdsApproveGrant(personaId, 'SCR-061') ? ordersAwaitingDecisionBy(visibleOrders, { personaId, jobTitle, userId }).length : 0;
  return (
    <div className="p-8">
      <PageHeader title={<>Orders</>} />
      <Tabs
        label="Order Views"
        // The search sits on the tab row, to the right of the tabs, and fills the rest of the row.
        toolbar={
          <>
            <div className="w-full min-w-0 max-w-[200px]">
              <FilterSelect label="Order Type" value={orderType} options={typeOptions} onChange={setOrderType} />
            </div>
            <div className="w-full min-w-0 max-w-[200px]">
              <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
            </div>
          <SearchField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search by order #, customer, order type, status or scenario"
            aria-label="Search orders"
            wrapperClassName="w-full min-w-0 max-w-[300px]"
          />
          </>
        }
        items={[
          { key: 'mine', label: 'My Orders', content: <MySalesOrders padded={false} query={query} filters={filters} /> },
          { key: 'approval', label: mine > 0 ? `Approval Requested (${mine})` : 'Approval Requested', content: <OrderApprovalQueue padded={false} query={query} filters={filters} /> },
        ]}
      />
    </div>
  );
}

import { badgeVariantFor } from '../../lib/statusTone';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedRowsNotice } from '../../components/patterns/RestrictedRowsNotice';
import { formatDateTime } from '../../lib/format';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/primitives/DataTable';
import { Badge } from '../../components/primitives/Badge';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import { useEntityStore } from '../../stores/entityStore';
import { demoContentColumn, matchesOrderFilters, orderMatchesQuery, type OrderFilters } from './demoContentColumn';

interface Order {
  orderId: string;
  orderType: string;
  status: string;
  customerName?: string;
  customerId?: string;
  msisdn?: string;
  createdAt?: string;
  demoTitle?: string;
  demoDetail?: string;
  /** Epoch ms of the order's last change: its newest recorded activity, or its creation time. Derived, not stored. */
  lastUpdatedMs?: number;
}

interface ActivityRow {
  orderId?: string;
  actionTaken?: string;
  transactionDate?: string;
}

// SCR-059: My Sales Orders / My Pending Approval Orders queue - agent view of
// own submitted orders and their approval status (evidenced across Fixed
// Line/FWA/Postpaid B2B2C guided journeys).
interface MySalesOrdersProps {
  /** False when embedded in a parent that already provides the same padding
   * (OrdersWorkspace's own p-8 around its Tabs) - true (self-padded) for the
   * standalone legacy-route usage at SCR-059, which has no other padding
   * source. */
  padded?: boolean;
  /** Narrows the list to orders matching this text (the Orders workspace's search box). */
  query?: string;
  /** Order Type / Status filters from the Orders workspace. */
  filters?: OrderFilters;
}

export function MySalesOrders({ padded = true, query = '', filters }: MySalesOrdersProps) {
  const navigate = useNavigate();
  const allOrders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as Order[];
  const activities = (useEntityStore((s) => s.records['customer-activities']) ?? []) as unknown as ActivityRow[];
  // Last updated = the newest approval-decision activity on the order, else when it was created. Most recent first;
  // orders with no timestamp go last. A header click still re-sorts.
  const sortedOrders: Order[] = allOrders
    .map((o) => {
      const times = [o.createdAt, ...activities.filter((a) => a.orderId === o.orderId && a.actionTaken).map((a) => a.transactionDate)]
        .map((t) => (t ? new Date(t).getTime() : NaN))
        .filter((n) => !Number.isNaN(n));
      return { ...o, lastUpdatedMs: times.length ? Math.max(...times) : undefined };
    })
    .sort((a, b) => (b.lastUpdatedMs ?? 0) - (a.lastUpdatedMs ?? 0));
  // Orders of a protected-segment customer this role may not see are left out (and counted), never drawn; nothing is listed until customers are known.
  const guard = useRestrictedCustomers();
  const { visible: orders, hiddenCount } = guard.filter(sortedOrders, (o) => o.customerId);
  const loadKind = useEntityStore((s) => s.loadKind);
  const loading = useEntityStore((s) => s.loading.orders);
  const loadError = useEntityStore((s) => s.errors.orders);

  useEffect(() => {
    loadKind('orders');
    loadKind('customer-activities');
  }, [loadKind]);

  return (
    <div className={padded ? 'p-8' : ''}>
      <ErrorBanner message={loadError} />
      <RestrictedRowsNotice count={hiddenCount} />
      <DataTable<Order>
        fixedLayout
        columns={[
          { key: 'orderId', header: 'Order #', cellClassName: 'w-[10%]', linkTo: (r) => `/order-management/order-approval-detail-attachments-order-details-activities-a?id=${r.orderId}` },
          demoContentColumn,
          // Opens the customer's Customer 360 page; a new customer with no record yet stays plain text.
          { key: 'customerName', header: 'Customer Name', cellClassName: 'w-[18%]', linkTo: (r) => (r.customerId ? `/customer/${r.customerId}` : undefined) },
          { key: 'orderType', header: 'Order Type', cellClassName: 'w-[15%] break-words' },
          {
            key: 'lastUpdatedMs',
            header: 'Last Updated On',
            cellClassName: 'w-[12%]',
            render: (r) => <span>{r.lastUpdatedMs ? formatDateTime(r.lastUpdatedMs) : '-'}</span>,
          },
          { key: 'status', header: 'Approval Status', cellClassName: 'w-[17%]', render: (r) => <Badge variant={badgeVariantFor(r.status)}>{r.status}</Badge> },
        ]}
        rows={orders.filter((o) => orderMatchesQuery(o, query) && matchesOrderFilters(o, filters))}
        rowKey={(r) => r.orderId}
        // Matches Customer 360's OrdersSection - same detail route, same
        // whole-row click. This table never wired it, so a row here was
        // read-only where the identical list on a customer's own page
        // already opened the order.
        onRowClick={(r) => navigate(`/order-management/order-approval-detail-attachments-order-details-activities-a?id=${r.orderId}`)}
        emptyMessage={query.trim() || (filters && (filters.orderType !== 'all' || filters.status !== 'all')) ? 'No orders match your search or filters.' : 'No orders submitted yet - build one via a New Fixed Line/FWA/Postpaid wizard first.'}
        loading={loading || !guard.ready}
      />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useCanStartNewConnection, useStartNewConnection } from '../useStartNewConnection';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { ActionButton, DetailRows, FilterSelect, GridTable, IC, Pagination, Panel, Pill, SearchBox, TabPage, ViewPill, fmtDate, fmtDateTime, usePaging } from './C360Kit';
import type { Tone } from './C360Kit';
import { SegmentedTabs } from '../../../components/primitives/SegmentedTabs';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';
import { isTonPending, orderBucket } from '../../../lib/statusTone';

type Rec = Record<string, unknown>;
const dash = (v: string | undefined | null) => (v === undefined || v === null || v === '' ? '-' : v);

// Same detail route the Orders workspace and the Order Approval screen use.
const ORDER_DETAIL_ROUTE = '/order-management/order-approval-detail-attachments-order-details-activities-a';

type Bucket = 'progress' | 'completed' | 'cancelled';
type Kind = 'order' | 'ton' | 'simswap';

interface OrderRow {
  id: string;
  kind: Kind;
  type: string;
  product?: string;
  msisdn?: string;
  status: string;
  statusLabel: string;
  bucket: Bucket;
  pending: boolean;
  createdAt?: string;
  createdBy?: string;
  channel?: string;
  fulfilment?: string;
}

const bucketOf = (status: string): Bucket => orderBucket(status);

const label = (status: string) => (/^complete$/i.test(status) ? 'Completed' : status.charAt(0).toUpperCase() + status.slice(1));
const toneOf = (b: Bucket): Tone => (b === 'completed' ? 'green' : b === 'cancelled' ? 'red' : 'amber');

const RANGES = [
  { value: 'all', label: 'All Time', days: 0 },
  { value: '30', label: 'Last 30 Days', days: 30 },
  { value: '180', label: 'Last 6 Months', days: 180 },
  { value: '365', label: 'Last 12 Months', days: 365 },
];

type TabKey = 'all' | 'progress' | 'completed' | 'cancelled' | 'pending';

/**
 * The Customer 360 "Orders" tab: KPI strip, sub-tabs, search and filters, the orders table and the selected order's
 * detail panel. Orders are the customer's own order records; Pending Actions adds open Transfer of Ownership cases and
 * SIM swap requests. A value with no source on file shows "-".
 */
export function C360Orders({ data }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const navigate = useNavigate();
  const startNewConnection = useStartNewConnection(data.customer.customerId);
  const canStartNewConnection = useCanStartNewConnection();
  const [tab, setTab] = useState<TabKey>('all');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [range, setRange] = useState('all');
  const [now] = useState(() => Date.now());
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const orders: OrderRow[] = useMemo(
    () =>
      (data.orders as Rec[]).map((o) => {
        const status = str(o.status) ?? '-';
        const ids = Array.isArray(o.productIds) ? (o.productIds as unknown[]).map(String) : [];
        return {
          id: String(o.orderId),
          kind: 'order' as const,
          type: str(o.orderType) ?? '-',
          product: ids.length > 0 ? ids.join(', ') : undefined,
          msisdn: str(o.msisdn),
          status,
          statusLabel: label(status),
          bucket: bucketOf(status),
          pending: false,
          createdAt: str(o.createdAt),
          createdBy: str(o.createdBy),
          channel: str(o.sourceChannel),
          fulfilment: str(o.fulfillmentStatus),
        };
      }),
    [data.orders]
  );

  const pendingActions: OrderRow[] = useMemo(() => {
    const ton = (data.tonCases as Rec[])
      .filter((t) => isTonPending(t.status))
      .map((t) => ({ id: String(t.id), kind: 'ton' as const, type: str(t.type) ? `Transfer of Ownership (${str(t.type)})` : 'Transfer of Ownership', product: undefined, msisdn: undefined, status: String(t.status), statusLabel: 'Pending', bucket: 'progress' as const, pending: true }));
    const swap = (data.simSwapOrders as Rec[])
      .filter((s) => /pending/i.test(String(s.status)))
      .map((s) => ({ id: String(s.simSwapOrderId), kind: 'simswap' as const, type: 'SIM Swap', product: 'SIM', msisdn: str(s.msisdn), status: String(s.status), statusLabel: String(s.status), bucket: 'progress' as const, pending: true }));
    return [...ton, ...swap];
  }, [data.tonCases, data.simSwapOrders]);

  const counts = {
    all: orders.length,
    progress: orders.filter((o) => o.bucket === 'progress').length,
    completed: orders.filter((o) => o.bucket === 'completed').length,
    cancelled: orders.filter((o) => o.bucket === 'cancelled').length,
    pending: pendingActions.length,
  };

  const typeOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(orders.map((o) => o.type))).map((t) => ({ value: t, label: t }))];
  const statusOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(orders.map((o) => o.statusLabel))).map((s) => ({ value: s, label: s }))];

  const rows = useMemo(() => {
    const base = tab === 'pending' ? pendingActions : tab === 'all' ? orders : orders.filter((o) => o.bucket === tab);
    const days = RANGES.find((r) => r.value === range)?.days ?? 0;
    const cutoff = days > 0 ? now - days * 86_400_000 : 0;
    const q = query.trim().toLowerCase();
    return base.filter((o) => {
      if (typeFilter !== 'all' && o.type !== typeFilter) return false;
      if (statusFilter !== 'all' && o.statusLabel !== statusFilter) return false;
      if (cutoff && o.createdAt) {
        const t = new Date(o.createdAt).getTime();
        if (!Number.isNaN(t) && t < cutoff) return false;
      }
      if (q && ![o.id, o.type, o.product, o.msisdn, o.statusLabel].some((v) => v && v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [orders, pendingActions, tab, query, typeFilter, statusFilter, range, now]);

  const { page, setPage, slice } = usePaging(rows, 8);
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];
  const goTab = (k: TabKey) => {
    setTab(k);
    setPage(1);
  };

  const when = fmtDateTime(selected?.createdAt);

  return (
    <TabPage
      icon={IC.file}
      title="Orders"
      subtitle="View and track all customer orders, including current, historical and in-progress requests"
      actions={
        <>
          <ActionButton primary icon={IC.plus} onClick={startNewConnection} disabled={!canStartNewConnection}>
            New Order
          </ActionButton>
        </>
      }
    >
      <div className="grid grid-cols-1 @6xl:grid-cols-[minmax(0,1fr)_22rem] gap-4 items-start">
        <section className="card min-w-0">
          <div className="px-4 pt-2">
            {/* The tabs narrow the one list below them by status - a filter, so the pill switcher; underline tabs are for moving between sections. */}
            <SegmentedTabs
              label="Orders by Status"
              active={tab}
              onChange={(k) => goTab(k as TabKey)}
              items={[
                { key: 'all', label: `All Orders (${counts.all})` },
                { key: 'progress', label: `In Progress (${counts.progress})` },
                { key: 'completed', label: `Completed (${counts.completed})` },
                { key: 'cancelled', label: `Cancelled (${counts.cancelled})` },
                { key: 'pending', label: `Pending Actions (${counts.pending})` },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-stretch gap-3 px-4 py-4">
            <SearchBox
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Search by Order ID, product, MSISDN or order type"
            />
            <FilterSelect label="Order Type" value={typeFilter} options={typeOptions} onChange={(v) => { setTypeFilter(v); setPage(1); }} />
            <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={(v) => { setStatusFilter(v); setPage(1); }} />
            <FilterSelect label="Date Range" value={range} options={RANGES.map((r) => ({ value: r.value, label: r.label }))} onChange={(v) => { setRange(v); setPage(1); }} />
          </div>
          <GridTable
            rows={slice}
            rowKey={(r) => r.id}
            selectedKey={selected?.id}
            onSelect={(r) => setSelectedId(r.id)}
            empty="No orders match the current filters."
            cols={[
              { key: 'n', header: '#', render: (_r, i) => (page - 1) * 8 + i + 1 },
              { key: 'id', header: 'Order ID', render: (r) => <span className="whitespace-nowrap">{r.id}</span> },
              { key: 'type', header: 'Order Type', render: (r) => r.type },
              { key: 'product', header: 'Product / Service', render: (r) => dash(r.product) },
              { key: 'msisdn', header: 'MSISDN / Service ID', render: (r) => <span className="whitespace-nowrap">{dash(r.msisdn)}</span> },
              { key: 'status', header: 'Status', render: (r) => <Pill tone={toneOf(r.bucket)}>{r.statusLabel}</Pill> },
              { key: 'date', header: 'Order Date', render: (r) => <span className="whitespace-nowrap">{dash(fmtDate(r.createdAt))}</span> },
              { key: 'by', header: 'Created By', render: (r) => dash(r.createdBy) },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <span className="inline-flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {r.kind === 'order' ? <ViewPill onClick={() => navigate(`${ORDER_DETAIL_ROUTE}?id=${r.id}`)} /> : <span className="text-muted">-</span>}
                  </span>
                ),
              },
            ]}
          />
          <Pagination className="m-3" page={page} total={rows.length} pageSize={8} onPage={setPage} />
        </section>

        <Panel
          icon={IC.file}
          title="Order Details"
          action={selected ? <Pill tone={toneOf(selected.bucket)}>{selected.statusLabel}</Pill> : undefined}
        >
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-12 h-12 rounded-[var(--radius-button)] flex items-center justify-center shrink-0 bg-tone-accent text-accent">
                  <Icon path={IC.file} className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <div className="text-fg font-bold text-[length:var(--fs-body-lg)] break-words">{selected.id}</div>
                  <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">{[selected.type, fmtDate(selected.createdAt), selected.channel].filter(Boolean).join(' | ')}</div>
                </div>
              </div>
              <DetailRows
                rows={[
                  { label: 'Product / Service', value: dash(selected.product) },
                  { label: 'Order Type', value: dash(selected.type) },
                  { label: 'Status', value: <Pill tone={toneOf(selected.bucket)}>{selected.statusLabel}</Pill> },
                  { label: 'MSISDN', value: dash(selected.msisdn) },
                  { label: 'Order Date & Time', value: dash([when.date, when.time].filter(Boolean).join(', ')) },
                  { label: 'Created By', value: dash(selected.createdBy) },
                  { label: 'Sales Channel', value: dash(selected.channel) },
                  { label: 'Related Offers', value: <Dv k="orderRelatedOffers" /> },
                  { label: 'Delivery / Fulfilment', value: selected.fulfilment ?? <Dv k="orderFulfilment" row={{ status: selected.status }} /> },
                  { label: 'Notes', value: <Dv k="orderNotes" row={{ status: selected.status }} /> },
                ]}
              />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <ActionButton disabled={selected.kind !== 'order'} onClick={() => navigate(`${ORDER_DETAIL_ROUTE}?id=${selected.id}`)}>
                  <span className="text-link">View Order Details &rarr;</span>
                </ActionButton>
                <ActionButton disabled>Track Progress</ActionButton>
              </div>
            </div>
          ) : (
            <p className="text-muted text-[length:var(--fs-body)] py-4 text-center">Select an order to see its details.</p>
          )}
        </Panel>
      </div>
    </TabPage>
  );
}


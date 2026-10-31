import { Button } from '../../../components/primitives/Button';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import {
  ActionButton,
  DetailRows,
  FilterSelect,
  IC,
  IconTile,
  KpiGrid,
  KpiTile,
  Pagination,
  Panel,
  Pill,
  SearchBox,
  StatusPill,
  TabPage,
  fmtDate,
  fmtDateTime,
  qar,
  usePaging,
  type Tone,
} from './C360Kit';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';

const ORDER_DETAIL_ROUTE = '/order-management/order-approval-detail-attachments-order-details-activities-a';
const DAY = 86_400_000;

const RANGES = [
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '6m', label: 'Last 6 Months', days: 183 },
  { value: '12m', label: 'Last 12 Months', days: 365 },
  { value: 'all', label: 'All Time', days: 0 },
];

type ActType = 'Customer Interaction' | 'Order' | 'Ticket' | 'Account Change' | 'Payment' | 'OOB Charge' | 'System Activity';

const TYPE_STYLE: Record<ActType, { icon: string; tone: Tone }> = {
  'Customer Interaction': { icon: IC.headset, tone: 'red' },
  Order: { icon: IC.file, tone: 'blue' },
  Ticket: { icon: IC.clipboard, tone: 'amber' },
  'Account Change': { icon: IC.settings, tone: 'purple' },
  Payment: { icon: IC.card, tone: 'green' },
  'OOB Charge': { icon: IC.wallet, tone: 'blue' },
  'System Activity': { icon: IC.database, tone: 'grey' },
};

const stamp = (v: unknown): number => {
  const t = new Date(String(v ?? '')).getTime();
  return Number.isNaN(t) ? 0 : t;
};

interface Activity {
  id: string;
  type: ActType;
  at: number;
  /** Source value carried no time of day. */
  dateOnly: boolean;
  description: string;
  user?: string;
  channel?: string;
  location?: string;
  status?: string;
  orderId?: string;
  ticketId?: string;
  msisdn?: string;
  remarks?: string;
}

function buildActivities(data: Customer360Data): Activity[] {
  const out: Activity[] = [];
  const dateOnly = (v: unknown) => !/T\d/.test(String(v ?? ''));

  for (const a of data.activities) {
    out.push({
      id: String(a.activityNumber),
      type: 'Customer Interaction',
      at: stamp(a.transactionDate),
      dateOnly: dateOnly(a.transactionDate),
      description: str(a.comments) ?? str(a.journey) ?? String(a.activityNumber),
      user: str(a.agentId),
      channel: str(a.channel),
      location: str(a.area),
      status: str(a.status),
      orderId: str(a.orderId),
      msisdn: str(a.msisdn),
      remarks: str(a.comments),
    });
  }
  for (const o of data.orders) {
    out.push({
      id: `ORD-ACT-${String(o.orderId)}`,
      type: 'Order',
      at: stamp(o.createdAt),
      dateOnly: dateOnly(o.createdAt),
      description: `${str(o.orderType) ?? 'Order'} order created`,
      user: str(o.createdBy),
      channel: str(o.sourceChannel),
      status: str(o.status),
      orderId: str(o.orderId),
      msisdn: str(o.msisdn),
    });
  }
  for (const s of data.simSwapOrders) {
    out.push({
      id: String(s.simSwapOrderId),
      type: 'Order',
      at: 0,
      dateOnly: true,
      description: 'SIM Swap order created',
      status: str(s.status),
      msisdn: str(s.msisdn),
      remarks: str(s.comments),
    });
  }
  for (const t of data.tickets) {
    out.push({
      id: `TT-ACT-${String(t.ticketId)}`,
      type: 'Ticket',
      at: stamp(t.createdAt),
      dateOnly: dateOnly(t.createdAt),
      description: `${String(t.ticketId)} - ${str(t.status) ?? 'Created'}`,
      user: str(t.createdBy),
      status: str(t.status),
      ticketId: str(t.ticketId),
      remarks: str(t.actualIssue),
    });
  }
  for (const a of data.auditTrail) {
    const field = str(a.fieldModified) ?? 'Record';
    const value = str(a.newValue);
    out.push({
      id: String(a.auditId),
      type: 'Account Change',
      at: stamp(a.timestamp),
      dateOnly: dateOnly(a.timestamp),
      description: value ? `${field} changed to ${value}` : `${field} changed`,
      user: str(a.employeeUser),
      remarks: `${str(a.recordType) ?? 'Record'} ${str(a.recordId) ?? ''}`.trim(),
    });
  }
  for (const p of data.payments) {
    out.push({
      id: String(p.paymentId),
      type: 'Payment',
      at: stamp(p.capturedAt),
      dateOnly: dateOnly(p.capturedAt),
      description: `${qar(p.amountQar) ?? 'Payment'}${str(p.chargeType) ? ` - ${str(p.chargeType)}` : ''}`,
      channel: str(p.captureChannel),
      status: str(p.status),
      orderId: str(p.orderId),
      remarks: str(p.receiptNumber) ? `Receipt ${str(p.receiptNumber)}` : undefined,
    });
  }
  // A call record is an out-of-bundle charge only where it was actually charged.
  for (const c of data.callDetailRecords) {
    if (!(Number(c.chargeQAR) > 0)) continue;
    out.push({
      id: String(c.cdrId),
      type: 'OOB Charge',
      at: stamp(c.callDate),
      dateOnly: dateOnly(c.callDate),
      description: `${str(c.callType) ?? 'Usage'} out of bundle charge (${qar(c.chargeQAR)})`,
      user: 'System',
      channel: 'System',
    });
  }
  for (const c of data.communications) {
    out.push({
      id: String(c.communicationId),
      type: 'System Activity',
      at: stamp(c.sentAt),
      dateOnly: dateOnly(c.sentAt),
      description: str(c.messageText) ?? `${str(c.channel) ?? 'Message'} sent to customer`,
      user: 'System',
      channel: str(c.channel),
      status: str(c.deliveryState),
    });
  }
  return out.sort((a, b) => b.at - a.at);
}

const rangeText = (days: number, now: number): string => {
  if (!days) return 'All time';
  return `${fmtDate(new Date(now - days * DAY).toISOString())} - ${fmtDate(new Date(now).toISOString())}`;
};

export function C360Activities({ data }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const navigate = useNavigate();
  const [now] = useState(() => Date.now());
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [range, setRange] = useState('6m');
  const pageSize = 10;
  const [pickedId, setPickedId] = useState<string>();

  const all = useMemo(() => buildActivities(data), [data]);
  const days = RANGES.find((r) => r.value === range)?.days ?? 0;
  // Records with no timestamp can't be placed against a range, so they stay visible.
  const inRange = all.filter((a) => days === 0 || a.at === 0 || a.at >= now - days * DAY);

  const count = (types: ActType[]) => inRange.filter((a) => types.includes(a.type)).length;
  const kpi = {
    total: inRange.length,
    interactions: count(['Customer Interaction']),
    changes: count(['Account Change']),
    transactions: count(['Payment', 'OOB Charge']),
    other: count(['Order', 'Ticket', 'System Activity']),
  };

  const TABS: { key: string; label: string; types?: ActType[] }[] = [
    { key: 'all', label: 'All' },
    { key: 'interactions', label: 'Customer Interactions', types: ['Customer Interaction'] },
    { key: 'orders', label: 'Orders', types: ['Order'] },
    { key: 'tickets', label: 'Tickets', types: ['Ticket'] },
    { key: 'changes', label: 'Account Changes', types: ['Account Change'] },
    { key: 'transactions', label: 'Transactions', types: ['Payment', 'OOB Charge'] },
    { key: 'oob', label: 'OOB Charges', types: ['OOB Charge'] },
    { key: 'system', label: 'System Activities', types: ['System Activity'] },
  ];
  const tabTypes = TABS.find((t) => t.key === tab)?.types;
  const q = query.trim().toLowerCase();
  const rows = inRange.filter((a) => {
    if (tabTypes && !tabTypes.includes(a.type)) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (channelFilter !== 'all' && a.channel !== channelFilter) return false;
    if (q && ![a.id, a.description, a.user, a.type].some((v) => v?.toLowerCase().includes(q))) return false;
    return true;
  });

  const paging = usePaging(rows, pageSize);
  const selected = all.find((a) => a.id === pickedId) ?? rows[0];

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    paging.setPage(1);
  };

  // A summary tile opens the list tab it counts.
  const openTab = (k: string) => {
    setTab(tab === k ? 'all' : k);
    paging.setPage(1);
  };

  const typeOptions = [{ value: 'all', label: 'All' }, ...Object.keys(TYPE_STYLE).map((v) => ({ value: v, label: v }))];
  const channelOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(all.map((a) => a.channel).filter(Boolean) as string[])).map((v) => ({ value: v, label: v }))];

  const when = selected && selected.at ? fmtDateTime(new Date(selected.at).toISOString()) : {};

  return (
    <TabPage icon={IC.activity} tone="blue" title="Activities" subtitle="View all customer interactions, activities, transactions and changes across channels">
      <KpiGrid>
        <KpiTile icon={IC.file} tone="blue" label="Total Activities" value={kpi.total} caption={RANGES.find((r) => r.value === range)?.label} chevron onClick={() => openTab('all')} />
        <KpiTile icon={IC.headset} tone="red" label="Customer Interactions" value={kpi.interactions} caption="Calls, Store, Digital" chevron onClick={() => openTab('interactions')} />
        <KpiTile icon={IC.settings} tone="blue" label="Account Changes" value={kpi.changes} caption="Account & Profile" chevron onClick={() => openTab('changes')} />
        <KpiTile icon={IC.swap} tone="red" label="Transactions" value={kpi.transactions} caption="Payments, OOB" chevron onClick={() => openTab('transactions')} />
        <KpiTile icon={IC.clock} tone="purple" label="Other Activities" value={kpi.other} caption="Orders, Tickets, System" chevron onClick={() => openTab('orders')} />
      </KpiGrid>

      {/* Search and filters sit above both columns; they narrow the list on the left. */}
      <div className="flex flex-wrap items-stretch gap-3">
        <SearchBox value={query} onChange={reset(setQuery)} placeholder="Search by activity ID, description or user" />
        <FilterSelect label="Activity Type" value={typeFilter} options={typeOptions} onChange={reset(setTypeFilter)} />
        <FilterSelect label="Date Range" value={range} options={RANGES.map((r) => ({ value: r.value, label: r.label }))} onChange={reset(setRange)} />
        <FilterSelect label="Channel" value={channelFilter} options={channelOptions} onChange={reset(setChannelFilter)} />
      </div>

      <div className="grid grid-cols-1 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start">
        {/* Left: the activities. The summary tiles above filter this list. */}
        <Panel icon={IC.activity} title={`All Activities (${paging.total})`}>
          <div className="space-y-3">
            {tab !== 'all' && (
              <button type="button" onClick={() => openTab('all')} className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--field-card-border)] bg-surface px-2.5 py-0.5 text-[length:var(--fs-caption)] text-fg focus:outline-none focus-visible:shadow-[var(--focus-ring)]">
                {TABS.find((t) => t.key === tab)?.label}
                <Icon path={IC.x} className="w-3 h-3" />
              </button>
            )}
            {paging.slice.length === 0 ? (
              <p className="text-muted text-[length:var(--fs-body)] py-4 text-center">No activities match the current filters.</p>
            ) : (
              <ul className="space-y-2">
                {paging.slice.map((a) => {
                  const d = a.at ? fmtDateTime(new Date(a.at).toISOString()) : undefined;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        aria-pressed={selected?.id === a.id}
                        onClick={() => setPickedId(a.id)}
                        className={`w-full flex items-start gap-3 text-left rounded-[var(--radius-card)] border p-3 transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                          selected?.id === a.id ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)]' : 'border-[var(--field-card-border)] bg-bg hover:bg-surface'
                        }`}
                      >
                        <IconTile icon={TYPE_STYLE[a.type].icon} tone={TYPE_STYLE[a.type].tone} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-fg font-medium text-[length:var(--fs-body)] break-words">{a.description}</span>
                          <span className="block text-fg-2 text-[length:var(--fs-caption)]">
                            {a.type}
                            {d ? ` · ${d.date}${!a.dateOnly && d.time ? ` ${d.time}` : ''}` : ''}
                            {a.channel ? ` · ${a.channel}` : ''}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <Pagination page={paging.page} total={paging.total} pageSize={pageSize} onPage={paging.setPage} />
          </div>
        </Panel>

        {/* Right: the selected activity. */}
        <aside className="card p-4 space-y-4 min-w-0">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <IconTile icon={TYPE_STYLE[selected.type].icon} tone={TYPE_STYLE[selected.type].tone} />
                <span className="text-fg font-bold text-[length:var(--fs-h5)] break-words min-w-0">{selected.description}</span>
                <Pill tone={TYPE_STYLE[selected.type].tone}>{selected.type.replace(' Activity', '')}</Pill>
                <span className="ml-auto flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-[var(--field-card-border)] bg-bg px-3 py-1.5 text-fg text-[length:var(--fs-caption)]">
                    <Icon path={IC.calendar} className="w-4 h-4" />
                    {rangeText(days, now)}
                  </span>
                  <ActionButton icon={IC.download} disabled>
                    Export
                  </ActionButton>
                </span>
              </div>
              <p className="text-fg-2 text-[length:var(--fs-caption)] -mt-2">{when.date ? `${when.date}${!selected.dateOnly && when.time ? `  |  ${when.time}` : ''}` : '-'}</p>

              <Panel icon={IC.clipboard} title="Activity Details" className="bg-surface-half">
                <DetailRows
                  rows={[
                    { label: 'Activity ID', value: selected.id.replace(/^(ORD|TT)-ACT-/, ''), strong: false },
                    { label: 'Activity Type', value: selected.type, strong: false },
                    { label: 'Order ID', value: selected.orderId ?? '-', strong: false },
                    { label: 'Description', value: selected.description, strong: false },
                    { label: 'MSISDN', value: selected.msisdn ?? '-', strong: false },
                    { label: 'User ID', value: selected.user ?? <Dv k="activityUser" row={{ type: selected.type }} />, strong: false },
                    { label: 'Channel', value: selected.channel ?? <Dv k="activityChannel" row={{ type: selected.type }} />, strong: false },
                    { label: 'Location', value: selected.location ?? <Dv k="activityLocation" row={{ type: selected.type }} />, strong: false },
                    { label: 'Status', value: selected.status ? <StatusPill status={selected.status} /> : '-', strong: false },
                    { label: 'Related Ticket', value: selected.ticketId ?? <Dv k="relatedTicket" />, strong: false },
                    { label: 'Related Offer', value: <Dv k="relatedOffer" />, strong: false },
                    { label: 'Remarks', value: selected.remarks ?? <Dv k="activityRemarks" row={{ type: selected.type }} />, strong: false },
                  ]}
                />
              </Panel>

              <Button variant="secondary" compact type="button" disabled={!selected.orderId} onClick={() => selected.orderId && navigate(`${ORDER_DETAIL_ROUTE}?id=${selected.orderId}`)}>
                View Related Order &rarr;
              </Button>
            </>
          ) : (
            <p className="text-muted text-[length:var(--fs-body)] py-6 text-center">Select an activity to see its details.</p>
          )}
        </aside>
      </div>
    </TabPage>
  );
}

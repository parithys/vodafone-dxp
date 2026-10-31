import { isClosedTicket } from '../../../lib/statusTone';
import { currentAgentId } from '../../../stores/authStore';
import { Button } from '../../../components/primitives/Button';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/primitives/Icon';
import { useEntityStore } from '../../../stores/entityStore';
import { TicketCreationModal, type NewTicketValue } from '../../../components/patterns/TicketCreationModal';
import { buildNewTicketRecord } from '../../../data/reference/ticketReferenceData';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import {
  ActionButton,
  FilterSelect,
  GridTable,
  IC,
  IconTile,
  KpiGrid,
  KpiTile,
  LinkAction,
  Pill,
  Panel,
  DetailRows,
  SearchBox,
  StatusPill,
  TabPage,
  fmtDate,
  fmtDateTime,
  type Tone,
} from './C360Kit';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';

const TICKET_DETAIL_ROUTE = '/trouble-ticketing-complaints/ticket-homepage';
const RESOLVED = new Set(['Solved', 'Completed', 'Closed']);
const DAY = 86_400_000;

const RANGES = [
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '6m', label: 'Last 6 Months', days: 183 },
  { value: '12m', label: 'Last 12 Months', days: 365 },
  { value: 'all', label: 'All Time', days: 0 },
];

const time = (v: unknown): number => {
  const t = new Date(String(v ?? '')).getTime();
  return Number.isNaN(t) ? 0 : t;
};

interface Ticket {
  id: string;
  raw: Record<string, unknown>;
  type: string;
  subType?: string;
  issue: string;
  status: string;
  priority: string;
  createdAt: number;
  createdBy?: string;
  assignedTo?: string;
  slaHours?: number;
  open: boolean;
  resolved: boolean;
  overdue: boolean;
  pendingCustomer: boolean;
}

/** "3-Medium" -> "Medium"; the number prefix is the LOV's sort key, not part of the label. */
const priorityLabel = (p: string) => p.replace(/^\d+\s*-\s*/, '');
function priorityTone(p: string): Tone {
  const l = priorityLabel(p).toLowerCase();
  if (/asap|high|critical/.test(l)) return 'red';
  if (/medium/.test(l)) return 'amber';
  if (/low/.test(l)) return 'blue';
  return 'grey';
}

function lastUpdated(t: Record<string, unknown>): number {
  const acts = (t.activities as { createdAt?: string }[] | undefined) ?? [];
  const esc = (t.escalations as { escalatedAt?: string }[] | undefined) ?? [];
  return Math.max(time(t.createdAt), time(t.assignedAt), time(t.closedAt), ...acts.map((a) => time(a.createdAt)), ...esc.map((e) => time(e.escalatedAt)));
}

const fmtStamp = (ms: number): string | undefined => {
  if (!ms) return undefined;
  const { date, time: tm } = fmtDateTime(new Date(ms).toISOString());
  return tm ? `${date}  |  ${tm}` : date;
};

function noteText(n: unknown): string | undefined {
  if (typeof n === 'string') return n;
  if (n && typeof n === 'object') {
    const o = n as Record<string, unknown>;
    return str(o.text) ?? str(o.note) ?? str(o.content) ?? str(o.description);
  }
  return undefined;
}

interface ActivityRow {
  key: string;
  at: number;
  activity: string;
  user: string;
  details: string;
}

function activityFor(t: Ticket): ActivityRow[] {
  const r = t.raw;
  const rows: ActivityRow[] = [{ key: `${t.id}-created`, at: t.createdAt, activity: 'Ticket created', user: t.createdBy ?? '-', details: t.issue }];
  ((r.activities as Record<string, unknown>[] | undefined) ?? []).forEach((a, i) =>
    rows.push({ key: `${t.id}-a${i}`, at: time(a.createdAt), activity: str(a.type) ?? 'Update', user: str(a.createdBy) ?? '-', details: str(a.description) ?? '-' }),
  );
  ((r.escalations as Record<string, unknown>[] | undefined) ?? []).forEach((e, i) =>
    rows.push({ key: `${t.id}-e${i}`, at: time(e.escalatedAt), activity: 'Ticket escalated', user: str(e.escalatedBy) ?? '-', details: str(e.reason) ?? '-' }),
  );
  if (str(r.closedAt)) rows.push({ key: `${t.id}-closed`, at: time(r.closedAt), activity: 'Ticket closed', user: '-', details: str(r.resolutionCode) ?? '-' });
  return rows.sort((a, b) => b.at - a.at);
}

export function C360TicketsSupport({
  data,
  goToTab,
  startNewTicket,
  onTicketCreated,
}: {
  data: Customer360Data;
  services: CustomerService[];
  goToTab?: (key: string) => void;
  /** Starts the Overview's "How can we help today?" search; absent where that search is not shown. */
  startNewTicket?: () => void;
  onTicketCreated?: (ticket: Record<string, unknown>) => void;
}) {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  const [modalOpen, setModalOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [range, setRange] = useState('6m');
  const [pickedId, setPickedId] = useState<string>();

  const tickets: Ticket[] = useMemo(
    () =>
      data.tickets
        .map((t) => {
          const status = String(t.status ?? '-');
          const closed = isClosedTicket(status);
          const due = time(t.slaDueAt);
          return {
            id: String(t.ticketId),
            raw: t,
            type: str(t.category) ?? '-',
            subType: str(t.area),
            issue: str(t.actualIssue) ?? '-',
            status,
            priority: str(t.priority) ?? '-',
            createdAt: time(t.createdAt),
            createdBy: str(t.createdBy),
            assignedTo: str(t.assignedTo),
            slaHours: typeof t.slaTargetHours === 'number' ? t.slaTargetHours : undefined,
            open: !closed,
            resolved: RESOLVED.has(status),
            overdue: !closed && due > 0 && due < now,
            pendingCustomer: !closed && /pending.*customer|customer.*(action|pending)/i.test(status),
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt),
    [data.tickets, now],
  );

  const days = RANGES.find((r) => r.value === range)?.days ?? 0;
  const inRange = tickets.filter((t) => days === 0 || t.createdAt >= now - days * DAY);
  const tabCount = {
    all: inRange.length,
    open: inRange.filter((t) => t.open).length,
    resolved: inRange.filter((t) => t.resolved).length,
    overdue: inRange.filter((t) => t.overdue).length,
    pending: inRange.filter((t) => t.pendingCustomer).length,
  };

  const q = query.trim().toLowerCase();
  const rows = inRange.filter((t) => {
    if (tab === 'open' && !t.open) return false;
    if (tab === 'resolved' && !t.resolved) return false;
    if (tab === 'overdue' && !t.overdue) return false;
    if (tab === 'pending' && !t.pendingCustomer) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (q && ![t.id, t.type, t.subType, t.issue, t.status, t.createdBy].some((v) => v?.toLowerCase().includes(q))) return false;
    return true;
  });

  const selected = tickets.find((t) => t.id === pickedId) ?? rows[0];
  const activity = selected ? activityFor(selected) : [];

  const createTicket = async (value: NewTicketValue) => {
    const ticketId = `TT-${Date.now().toString().slice(-6)}`;
    const record = buildNewTicketRecord({ ticketId, ...value, createdBy: currentAgentId() });
    await createRecord('trouble-tickets', record);
    onTicketCreated?.(record);
    setModalOpen(false);
  };

  const openFull = (id: string) => navigate(`${TICKET_DETAIL_ROUTE}?id=${id}`);

  const complaints = tickets.filter((t) => /complaint/i.test(t.type)).length;
  const related = [
    { label: 'Related Orders', icon: IC.cart, count: data.orders.length, onClick: goToTab ? () => goToTab('orders') : undefined },
    { label: 'Related Activities', icon: IC.activity, count: data.activities.length, onClick: goToTab ? () => goToTab('activities') : undefined },
    {
      label: 'Related Complaints',
      icon: IC.alert,
      count: complaints,
      onClick: () => {
        setTab('all');
        setRange('all');
        setTypeFilter('all');
        setStatusFilter('all');
        setQuery('Complaints');
      },
    },
    { label: 'Related Leads', icon: IC.target, count: data.leads.length, onClick: goToTab ? () => goToTab('offers-leads') : undefined },
  ];

  const typeOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(tickets.map((t) => t.type))).map((v) => ({ value: v, label: v }))];
  const statusOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(tickets.map((t) => t.status))).map((v) => ({ value: v, label: v }))];

  const created = selected ? fmtDateTime(new Date(selected.createdAt).toISOString()) : {};

  return (
    <TabPage
      icon={IC.headset}
      tone="blue"
      title="Tickets & Support"
      subtitle="View and manage all customer support tickets, service requests and related cases"
      actions={
        <>
          <ActionButton primary icon={IC.plus} onClick={startNewTicket ?? (() => setModalOpen(true))}>
            Create Ticket
          </ActionButton>
        </>
      }
    >
      {/* Counts double as filters: click one to list only those tickets (click the same one again for all). */}
      <KpiGrid>
        {(
          [
            { key: 'all', label: 'All Tickets', icon: IC.headset, tone: 'blue' },
            { key: 'open', label: 'Open', icon: IC.tag, tone: 'amber' },
            { key: 'resolved', label: 'Resolved', icon: IC.shieldCheck, tone: 'green' },
            { key: 'overdue', label: 'Overdue', icon: IC.alert, tone: 'red' },
            { key: 'pending', label: 'Pending Customer Action', icon: IC.clock, tone: 'purple' },
          ] as { key: keyof typeof tabCount; label: string; icon: string; tone: Tone }[]
        ).map((k) => (
          <KpiTile key={k.key} icon={k.icon} tone={k.tone} label={k.label} value={tabCount[k.key]} caption={tab === k.key && k.key !== 'all' ? 'Filtered - click to clear' : undefined} onClick={() => setTab(tab === k.key ? 'all' : k.key)} />
        ))}
      </KpiGrid>

      {/* Search and filters sit above both columns; they narrow the list on the left. */}
      <div className="flex flex-wrap items-stretch gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by Ticket ID, issue or service type" />
        <FilterSelect label="Ticket Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
        <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
        <FilterSelect label="Date Range" value={range} options={RANGES.map((r) => ({ value: r.value, label: r.label }))} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start">
        {/* Left: the tickets. */}
        <Panel icon={IC.headset} title={`All Tickets (${rows.length})`}>
          <div className="space-y-3">
            {rows.length === 0 ? (
              <p className="text-muted text-[length:var(--fs-body)] py-4 text-center">No tickets match the current filters.</p>
            ) : (
              <ul className="space-y-2">
                {rows.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      aria-pressed={selected?.id === t.id}
                      onClick={() => setPickedId(t.id)}
                      className={`w-full text-left rounded-[var(--radius-card)] border p-3 transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                        selected?.id === t.id ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)]' : 'border-[var(--field-card-border)] bg-bg hover:bg-surface'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-fg font-semibold text-[length:var(--fs-body)]">{t.id}</span>
                        <span className="text-fg-2 text-[length:var(--fs-caption)] whitespace-nowrap">{fmtDate(new Date(t.createdAt).toISOString()) ?? '-'}</span>
                      </span>
                      <span className="block text-fg-2 text-[length:var(--fs-caption)] break-words">
                        {t.type} · {t.issue}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <StatusPill status={t.status} />
                        {t.priority !== '-' && <Pill tone={priorityTone(t.priority)}>{priorityLabel(t.priority)}</Pill>}
                        {t.overdue && <Pill tone="red">Overdue</Pill>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        {/* Right: the selected ticket - its details, activity and related records. */}
        <aside className="card p-4 space-y-4 min-w-0">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <IconTile icon={IC.tag} tone="blue" />
                <span className="text-fg font-bold text-[length:var(--fs-h5)] min-w-0 break-words">{selected.id}</span>
                <StatusPill status={selected.status} />
                <span className="ml-auto flex items-center gap-2">
                  <Button variant="secondary" compact type="button" onClick={() => openFull(selected.id)}>
                    View Full Ticket &rarr;
                  </Button>
                  <ActionButton disabled>Add Note</ActionButton>
                </span>
              </div>

              <Panel icon={IC.file} title="Ticket Details" className="bg-surface-half">
                <DetailRows
                  rows={[
                    { label: 'Ticket Type', value: selected.type, strong: false },
                    { label: 'Sub Type', value: selected.subType ?? '-', strong: false },
                    { label: 'Actual Issue', value: selected.issue, strong: false },
                    { label: 'Service / MSISDN', value: <Dv k="ticketService" />, strong: false },
                    { label: 'Priority', value: selected.priority === '-' ? '-' : <Pill tone={priorityTone(selected.priority)}>{priorityLabel(selected.priority)}</Pill>, strong: false },
                    { label: 'Created On', value: created.date ? `${created.date}${created.time ? `  |  ${created.time}` : ''}` : '-', strong: false },
                    { label: 'Created By', value: selected.createdBy ?? '-', strong: false },
                    { label: 'Assigned To', value: selected.assignedTo ?? <Dv k="ticketAssignedTo" row={{ queue: selected.raw.queue }} />, strong: false },
                    { label: 'SLA', value: selected.slaHours !== undefined ? `Response within ${selected.slaHours} hours` : '-', strong: false },
                    { label: 'Last Updated', value: fmtStamp(lastUpdated(selected.raw)) ?? '-', strong: false },
                    { label: 'Notes', value: noteText(((selected.raw.publicNotes as unknown[] | undefined) ?? []).at(-1)) ?? <Dv k="ticketNotes" row={{ issue: selected.issue }} />, strong: false },
                  ]}
                />
              </Panel>

              <Panel icon={IC.refresh} title="Recent Ticket Activity" action={<LinkAction onClick={() => openFull(selected.id)}>View All</LinkAction>}>
                <GridTable
                  dense
                  rows={activity}
                  rowKey={(a) => a.key}
                  empty="No activity recorded for this ticket."
                  cols={[
                    { key: 'at', header: 'Date & Time', className: 'whitespace-nowrap', render: (a) => fmtStamp(a.at)?.replace('  |  ', ' ') ?? '-' },
                    { key: 'activity', header: 'Activity', className: 'font-semibold' },
                    { key: 'user', header: 'User', className: 'break-words' },
                    { key: 'details', header: 'Details', className: 'min-w-40 break-words' },
                  ]}
                />
              </Panel>

              <Panel icon={IC.link} title="Related Information">
                <ul>
                  {related.map((r) => (
                    <li key={r.label} className="border-b border-border-soft last:border-0">
                      <button type="button" onClick={r.onClick} disabled={!r.onClick} className="w-full flex items-center gap-3 py-2.5 text-[length:var(--fs-body)] text-left enabled:hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon path={r.icon} className="w-4 h-4 text-fg-2 shrink-0" />
                        <span className="flex-1 text-fg-2">{r.label}</span>
                        <span className="text-fg font-medium">{r.count}</span>
                        <Icon path={IC.chevRight} className="w-4 h-4 text-fg shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          ) : (
            <p className="text-muted text-[length:var(--fs-body)] py-6 text-center">{tickets.length === 0 ? 'No tickets on file for this customer.' : 'Select a ticket to see its details.'}</p>
          )}
        </aside>
      </div>

      <TicketCreationModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={createTicket} initialCustomerId={data.customer.customerId} />
    </TabPage>
  );
}

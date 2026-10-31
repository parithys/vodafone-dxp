import { isClosedTicket } from '../../../lib/statusTone';
import { isSimSwapAwaitingDecision } from '../../../engines/approvalAuthority';
import { useEffect, useMemo, useState } from 'react';
import { computeBillingSummary, type Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { useEntityStore } from '../../../stores/entityStore';
import {
  DetailRows,
  FilterSelect,
  GridTable,
  IC,
  IconTile,
  LinkAction,
  Pagination,
  Panel,
  Pill,
  StatusPill,
  TabPage,
  ViewPill,
  fmtDate,
  fmtDateTime,
  qar,
  usePaging,
  type Tone,
} from './C360Kit';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';

const CLOSED_STAGE = /^(none|no dunning|current)$/i;
const PAGE_SIZE = 10;

type Severity = 'High' | 'Medium' | 'Low';
const SEV_TONE: Record<Severity, Tone> = { High: 'red', Medium: 'amber', Low: 'blue' };
const SEV_RANK: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };

interface AlertRow {
  id: string;
  type: string;
  description: string;
  severity: Severity;
  status: string;
  at?: number;
  icon: string;
  tone: Tone;
  tab?: string;
}

interface Note {
  id: string;
  text: string;
  source: string;
  at: number;
  kind: 'notification' | 'note';
}

const stamp = (v: unknown): number => {
  const t = new Date(String(v ?? '')).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export function C360AlertsRisks({ data, goToTab }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const [now] = useState(() => Date.now());
  const [severity, setSeverity] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [showAllNotes, setShowAllNotes] = useState(false);

  const bell = (useEntityStore((s) => s.records['bell-notifications']) ?? []) as Record<string, unknown>[];
  const bulk = (useEntityStore((s) => s.records['bulk-notes']) ?? []) as Record<string, unknown>[];
  const loadKind = useEntityStore((s) => s.loadKind);
  useEffect(() => {
    loadKind('bell-notifications');
    loadKind('bulk-notes');
  }, [loadKind]);

  const { outstanding, latestBill } = computeBillingSummary(data);
  const dunning = str(data.billingProfiles[0]?.collectionStage);
  const dunningActive = Boolean(dunning) && !CLOSED_STAGE.test(String(dunning));
  const extras = data.overviewExtras.find((e) => e.customerId === data.customer.customerId);
  const aboutToBar = str(extras?.aboutToBar);

  const alerts: AlertRow[] = useMemo(() => {
    const out: AlertRow[] = [];
    const add = (a: Omit<AlertRow, 'status' | 'icon' | 'tone'> & Partial<Pick<AlertRow, 'icon' | 'tone'>>) =>
      out.push({ status: 'Open', icon: IC.alert, tone: SEV_TONE[a.severity], ...a });

    if (data.customer.blacklisted) {
      add({ id: 'blacklist', type: 'Blacklisted', description: str(data.customer.blacklistReason) ?? 'Customer is blacklisted', severity: 'High', icon: IC.ban, tab: 'contact-identity' });
    }
    if (outstanding > 0) {
      add({ id: 'balance', type: 'Outstanding Balance', description: `Total due amount ${qar(outstanding)}`, severity: 'High', at: stamp(latestBill?.dueDate) || undefined, tab: 'billing' });
    }
    if (dunning && dunningActive) {
      add({ id: 'dunning', type: 'Dunning Stage', description: `Currently at ${dunning}`, severity: 'High', tab: 'billing' });
    }
    for (const s of data.simSwapOrders.filter((x) => isSimSwapAwaitingDecision(x.status))) {
      add({ id: `sim-${String(s.simSwapOrderId)}`, type: 'Pending SIM Swap', description: `SIM swap request ${String(s.simSwapOrderId)} awaiting completion`, severity: 'High', icon: IC.flag, tone: 'purple', tab: 'products-services' });
    }
    for (const t of data.tickets) {
      const due = stamp(t.slaDueAt);
      if (!isClosedTicket(t.status) && due > 0 && due < now) {
        add({ id: `sla-${String(t.ticketId)}`, type: 'Pending Out of SLA Ticket', description: `${String(t.ticketId)} (${str(t.actualIssue) ?? str(t.category) ?? 'ticket'}) pending beyond SLA`, severity: 'Medium', at: due, tab: 'tickets-support' });
      }
      const esc = ((t.escalations as { escalatedAt?: string; reason?: string }[] | undefined) ?? []).at(-1);
      if (esc && !isClosedTicket(t.status)) {
        add({ id: `esc-${String(t.ticketId)}`, type: 'Ticket Escalated', description: `${String(t.ticketId)} escalated${esc.reason ? ` - ${esc.reason}` : ''}`, severity: 'High', at: stamp(esc.escalatedAt) || undefined, tab: 'tickets-support' });
      }
    }
    for (const p of data.penalties.filter((x) => /pending/i.test(String(x.status)))) {
      add({
        id: `pen-${String(p.penaltyId)}`,
        type: 'Commitment Penalty',
        description: `${qar(p.calculatedValue) ?? 'Penalty'} pending on ${str(p.actionType) ?? 'account'}${p.blocksNewConnection ? ' - blocks new connection' : ''}`,
        severity: p.blocksNewConnection ? 'High' : 'Medium',
        at: stamp(p.calculatedAt) || undefined,
        tab: 'billing',
      });
    }
    for (const a of data.adjustments.filter((x) => /pending/i.test(String(x.status)))) {
      add({ id: `adj-${String(a.adjustmentId)}`, type: 'Pending Adjustment', description: `${qar(a.amount) ?? 'Adjustment'} ${str(a.direction) ?? ''} adjustment awaiting approval`.replace(/\s+/g, ' '), severity: 'Medium', tab: 'billing' });
    }
    for (const t of data.tonCases.filter((x) => !/complet|reject|cancel|closed/i.test(String(x.status)))) {
      add({ id: `ton-${String(t.id)}`, type: 'Pending TON', description: `${str(t.type) ?? 'Transfer of ownership'} ${String(t.id)}${str(t.currentQueue) ? ` at ${str(t.currentQueue)}` : ''}`, severity: 'Medium', tab: 'account-info' });
    }
    if (data.customer.hrnAdvancePaymentRequired) {
      add({ id: 'advance', type: 'Advance Payment Required', description: 'Advance payment is required for new connections', severity: 'Medium', tab: 'billing' });
    }
    for (const o of data.orders.filter((x) => /pending/i.test(String(x.approvalStatus)))) {
      add({ id: `ord-${String(o.orderId)}`, type: 'Pending Order Approval', description: `${String(o.orderId)} - ${String(o.approvalStatus)}`, severity: 'Low', icon: IC.info, at: stamp(o.createdAt) || undefined, tab: 'orders' });
    }
    if (!data.customer.email) {
      add({ id: 'email', type: 'Email Missing', description: 'No email address on file', severity: 'Low', icon: IC.mail, tab: 'contact-identity' });
    }
    const moi = str(data.customer.moiValidationStatus);
    if (moi && !/^verified$/i.test(moi)) {
      add({ id: 'moi', type: 'ID Validation Pending', description: `MOI validation status: ${moi}`, severity: 'Low', icon: IC.info, tab: 'contact-identity' });
    }
    return out.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || (b.at ?? 0) - (a.at ?? 0));
  }, [data, outstanding, latestBill, dunning, dunningActive, now]);

  const notes: Note[] = (() => {
    const accountIds = data.accounts.map((a) => a.accountId);
    const n: Note[] = [];
    for (const b of bell) {
      if (b.customerId === data.customer.customerId && b.status === 'Published') {
        n.push({ id: String(b.notificationId), text: str(b.message) ?? '-', source: str(b.createdBy) ?? '-', at: stamp(b.publishedAt), kind: 'notification' });
      }
    }
    for (const b of bulk) {
      if (((b.accountIds as string[] | undefined) ?? []).some((id) => accountIds.includes(id))) {
        n.push({ id: String(b.noteId), text: str(b.content) ?? '-', source: str(b.createdBy) ?? '-', at: stamp(b.postedAt), kind: 'note' });
      }
    }
    return n.sort((a, b) => b.at - a.at);
  })();

  const rows = alerts.filter((a) => {
    if (severity !== 'all' && a.severity !== severity) return false;
    if (type !== 'all' && a.type !== type) return false;
    if (status !== 'all' && a.status !== status) return false;
    return true;
  });
  const paging = usePaging(rows, PAGE_SIZE);

  const typeOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(alerts.map((a) => a.type))).map((v) => ({ value: v, label: v }))];
  const statusOptions = [{ value: 'all', label: 'All' }, ...Array.from(new Set(alerts.map((a) => a.status))).map((v) => ({ value: v, label: v }))];

  const blacklisted = data.customer.blacklisted;
  const barring = aboutToBar === undefined ? '-' : aboutToBar;
  const shownNotes = showAllNotes ? notes : notes.slice(0, 3);

  return (
    <TabPage icon={IC.alert} tone="red" title="Alerts & Risks" subtitle="View customer alerts, risks, notifications and important indicators">
      <div className="space-y-4">
        <section className="card p-4 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">All Alerts &amp; Risks ({alerts.length})</h3>
            <div className="flex flex-wrap items-stretch gap-3">
              <FilterSelect
                label="Severity"
                value={severity}
                options={[{ value: 'all', label: 'All' }, ...(['High', 'Medium', 'Low'] as Severity[]).map((v) => ({ value: v, label: v }))]}
                onChange={(v) => {
                  setSeverity(v);
                  paging.setPage(1);
                }}
              />
              <FilterSelect
                label="Alert Type"
                value={type}
                options={typeOptions}
                onChange={(v) => {
                  setType(v);
                  paging.setPage(1);
                }}
              />
              <FilterSelect
                label="Status"
                value={status}
                options={statusOptions}
                onChange={(v) => {
                  setStatus(v);
                  paging.setPage(1);
                }}
              />
            </div>
          </div>
          <GridTable
            rows={paging.slice}
            rowKey={(a) => a.id}
            empty="No alerts or risks match the current filters."
            cols={[
              { key: 'n', header: '#', render: (_a, i) => paging.from + i },
              {
                key: 'type',
                header: 'Alert Type',
                strong: true,
                render: (a) => <span className="break-words">{a.type}</span>,
              },
              { key: 'description', header: 'Description', className: 'min-w-44 break-words' },
              { key: 'severity', header: 'Severity', render: (a) => <Pill tone={SEV_TONE[a.severity]}>{a.severity}</Pill> },
              { key: 'status', header: 'Status', render: (a) => <StatusPill status={a.status} /> },
              { key: 'at', header: 'Raised On', className: 'whitespace-nowrap', render: (a) => (a.at ? fmtDate(new Date(a.at).toISOString()) : <Dv k="alertRaisedOn" />) },
              {
                key: 'actions',
                header: 'Actions',
                render: (a) =>
                  a.tab && goToTab ? (
                    <ViewPill onClick={() => goToTab(a.tab as string)} />
                  ) : (
                    '-'
                  ),
              },
            ]}
          />
          <Pagination page={paging.page} total={rows.length} pageSize={PAGE_SIZE} onPage={paging.setPage} />
        </section>

        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-4 items-start">
          <Panel icon={IC.clipboard} title="Risk & Eligibility Indicators">
            <DetailRows
              rows={[
                { label: 'Blacklist Status', value: <Pill tone={blacklisted ? 'red' : 'green'}>{blacklisted ? 'Blacklisted' : 'Clear'}</Pill> },
                { label: 'Credit Score', value: <Dv k="creditScore" /> },
                { label: 'Eligibility for PTP', value: <Dv k="eligibilityPtp" /> },
                { label: 'About to Be Barred', value: barring === '-' ? '-' : <Pill tone={/^yes/i.test(barring) ? 'red' : 'green'}>{barring}</Pill> },
                { label: 'OG Barring Date', value: <Dv k="ogBarringDate" /> },
                { label: 'IC Barring Date', value: <Dv k="icBarringDate" /> },
                { label: 'Amount Required to Avoid Barring', value: /^yes/i.test(barring) && outstanding > 0 ? qar(outstanding) : <Dv k="amountAvoidBarring" /> },
                { label: 'Special Management Flag', value: <Dv k="specialManagement" /> },
                { label: 'Fraud Risk Indicator', value: <Dv k="fraudRisk" /> },
              ]}
            />
          </Panel>

          <Panel
            icon={IC.bell}
            title="Notifications / Notes"
            action={notes.length > 3 ? <LinkAction onClick={() => setShowAllNotes((v) => !v)}>{showAllNotes ? 'Show Less' : 'View All'}</LinkAction> : undefined}
          >
            {shownNotes.length === 0 ? (
              <p className="text-muted text-[length:var(--fs-body)] py-2 text-center">No notifications or notes for this customer.</p>
            ) : (
              <ul>
                {shownNotes.map((n) => {
                  const d = n.at ? fmtDateTime(new Date(n.at).toISOString()) : {};
                  return (
                    <li key={n.id} className="flex items-start gap-3 py-2.5 border-b border-border-soft last:border-0">
                      <IconTile icon={n.kind === 'notification' ? IC.bell : IC.file} tone={n.kind === 'notification' ? 'blue' : 'grey'} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-fg font-medium text-[length:var(--fs-body)] break-words">{n.text}</div>
                        <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">{[n.source, d.date && `${d.date}${d.time ? ` ${d.time}` : ''}`].filter(Boolean).join('  |  ')}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </TabPage>
  );
}

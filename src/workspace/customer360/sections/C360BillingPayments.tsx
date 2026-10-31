import { Button } from '../../../components/primitives/Button';
import { useMemo, useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { unpaidInvoiceTotal } from '../../../engines/billingBalance';
import { computeBillingSummary, withinBillHistoryWindow, type Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { GridTable, IC, IconTile, KpiGrid, KpiTile, Panel, Pill, StatusPill, TabPage, fmtDate, qar, type GridCol } from './C360Kit';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';
import { formatDate } from '../../../lib/format';

type Rec = Record<string, unknown>;
const DASH = '-';
const PAGE = 5;

/** "2026-07" -> "01 Jul 2026 - 31 Jul 2026". */
function periodRange(period: unknown): string {
  const m = /^(\d{4})-(\d{2})$/.exec(String(period ?? ''));
  if (!m) return str(period) ?? DASH;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const first = new Date(y, mo - 1, 1);
  const last = new Date(y, mo, 0);
  const f = (d: Date) => formatDate(d);
  return `${f(first)} – ${f(last)}`;
}

function billStatusLabel(status: unknown): string {
  const s = String(status ?? '').toLowerCase();
  if (s === 'billed') return 'Unpaid';
  if (!s) return DASH;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function daysUntil(iso: unknown): number | undefined {
  const t = new Date(String(iso ?? '')).getTime();
  if (Number.isNaN(t)) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((t - today.getTime()) / 86_400_000);
}

const isBillRow = (b: Rec) => b.status === 'billed' || b.status === 'paid';

function Chevron() {
  return (
    <button type="button" disabled aria-label="Open" className="text-fg disabled:opacity-60 disabled:cursor-not-allowed">
      <Icon path={IC.chevRight} className="w-4 h-4" />
    </button>
  );
}

/** Red link-styled action that has no destination yet - rendered inert. */
function InertLink({ children }: { children: string }) {
  return (
    <span aria-disabled="true" title="Not available yet" className="text-link font-medium text-[length:var(--fs-body)] opacity-40 cursor-not-allowed whitespace-nowrap">
      {children} &rarr;
    </span>
  );
}

export function C360BillingPayments({ data, goToTab }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const [profileId, setProfileId] = useState('all');
  const [showAllBills, setShowAllBills] = useState(false);

  const profiles = data.billingProfiles as Rec[];
  const selected = profiles.find((p) => p.billingProfileId === profileId);
  const forProfile = (r: Rec) => !selected || r.billingProfileId === selected.billingProfileId;

  const summary = computeBillingSummary(data);
  const bills = useMemo(
    () => (data.bills as Rec[]).filter(forProfile).sort((a, b) => String(b.billPeriod ?? '').localeCompare(String(a.billPeriod ?? ''))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.bills, profileId],
  );
  const billed = bills.filter((b) => withinBillHistoryWindow(b.billPeriod) && isBillRow(b));
  const latestBill = selected ? billed[0] : summary.latestBill;
  // A profile's own invoices (payments are not recorded per profile, so none is netted against it).
  const outstandingOf = (list: Rec[]) => unpaidInvoiceTotal(list);
  const outstanding = selected ? outstandingOf(bills) : summary.outstanding;
  const lastPayment = summary.previousPayment;
  const unbilled = latestBill?.currentChargesQAR;
  const dueIn = daysUntil(latestBill?.dueDate);

  const historyBills = bills.filter(isBillRow);
  const unbilledRows = bills.filter((b) => b.status === 'unbilled' || b.type === 'hotBill');
  const payments = [...(data.payments as Rec[])].sort((a, b) => String(b.capturedAt ?? '').localeCompare(String(a.capturedAt ?? '')));

  const stageProfile = selected ?? profiles[0];
  const ptpStatus = str(stageProfile?.promiseToPayStatus);
  const ptpEligible = stageProfile ? (outstanding > 0 && (ptpStatus ?? 'None') === 'None' ? 'Yes' : 'No') : undefined;
  const ebill = str(stageProfile?.billMedium);

  const billCols: GridCol<Rec>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    { key: 'billId', header: 'Bill Number', render: (r) => str(r.billId) ?? DASH },
    { key: 'period', header: 'Bill Period', render: (r) => periodRange(r.billPeriod) },
    { key: 'billDate', header: 'Bill Date', render: (r) => <Dv k="billDate" row={{ period: str(r.billPeriod) }} /> },
    { key: 'amt', header: 'Amount (QAR)', render: (r) => str(r.totalAmount) ?? DASH },
    { key: 'status', header: 'Status', render: (r) => (r.status ? <StatusPill status={billStatusLabel(r.status)} /> : DASH) },
    { key: 'act', header: 'Actions', className: 'text-center', render: () => <Chevron /> },
  ];

  const paymentCols: GridCol<Rec>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    { key: 'id', header: 'Payment ID', render: (r) => str(r.paymentId) ?? DASH },
    { key: 'date', header: 'Date', render: (r) => fmtDate(r.capturedAt) ?? DASH },
    { key: 'method', header: 'Method', render: (r) => str(r.paymentMethod) ?? DASH },
    { key: 'channel', header: 'Channel', render: (r) => str(r.captureChannel) ?? DASH },
    { key: 'amt', header: 'Amount (QAR)', render: (r) => str(r.amountQar) ?? DASH },
    { key: 'status', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : DASH) },
  ];

  const unbilledCols: GridCol<Rec>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    { key: 'period', header: 'Bill Period', render: (r) => periodRange(r.billPeriod) },
    { key: 'mrc', header: 'MRC (QAR)', render: (r) => str(r.mrc) ?? DASH },
    { key: 'vas', header: 'VAS (QAR)', render: (r) => str(r.vas) ?? DASH },
    { key: 'vat', header: 'VAT (QAR)', render: (r) => str(r.vat) ?? DASH },
    { key: 'cur', header: 'Current Charges (QAR)', render: (r) => str(r.currentChargesQAR) ?? DASH },
  ];

  // Prepaid recharge history only applies to a prepaid profile (or to the all-profiles view when the customer holds one).
  const accountOf = (pr?: Rec) => data.accounts.find((a) => a.accountId === pr?.accountId);
  const showsRecharge = selected ? /prepaid/i.test(String(accountOf(selected)?.accountType ?? '')) : profiles.some((pr) => /prepaid/i.test(String(accountOf(pr)?.accountType ?? '')));

  const shownBills = showAllBills ? historyBills : historyBills.slice(0, PAGE);

  return (
    <TabPage
      icon={IC.wallet}
      tone="blue"
      title="Billing & Payments"
      subtitle="View billing profile, bills, payments, outstanding balance and recharge information"
    >
      <KpiGrid>
        <KpiTile
          icon={IC.alert}
          tone="red"
          label="Outstanding Amount"
          value={<span className="text-accent">{qar(outstanding)}</span>}
          // Pay Now is offered only when there is an amount to pay.
          caption={
            outstanding > 0 ? (
            <Button variant="primary" compact disabled>
              Pay Now
            </Button>
            ) : undefined
          }
        />
        <KpiTile
          icon={IC.calendar}
          tone="blue"
          label="Due Date"
          value={fmtDate(latestBill?.dueDate) ?? DASH}
          caption={
            dueIn !== undefined && outstanding > 0 ? (
              <span className="text-accent">({dueIn >= 0 ? `${dueIn} day${dueIn === 1 ? '' : 's'}` : `${-dueIn} day${dueIn === -1 ? '' : 's'} overdue`})</span>
            ) : undefined
          }
        />
        <KpiTile
          icon={IC.file}
          tone="blue"
          label="Latest Bill"
          value={qar(latestBill?.totalAmount) ?? DASH}
          caption={latestBill ? `Bill Period: ${periodRange(latestBill.billPeriod)}` : undefined}
        />
        <KpiTile
          icon={IC.card}
          tone="amber"
          label="Last Payment"
          value={qar(lastPayment?.amountQar) ?? DASH}
          caption={lastPayment ? [fmtDate(lastPayment.capturedAt), str(lastPayment.captureChannel) && `via ${String(lastPayment.captureChannel)}`].filter(Boolean).join(' ') : undefined}
        />
        <KpiTile icon={IC.bars} tone="red" label="Unbilled Usage" value={qar(unbilled) ?? DASH} />
      </KpiGrid>

      <div className="grid grid-cols-1 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start">
        {/* Left: the billing profiles; picking one scopes the whole page to it (the same master / detail shape as Products & Services). */}
        <Panel icon={IC.bars} title={`Billing Profiles (${profiles.length})`}>
          <ul className="space-y-2">
            {[{ id: 'all', title: 'All Billing Profiles', sub: `${profiles.length} profiles`, out: summary.outstanding, status: undefined as string | undefined }, ...profiles.map((r) => ({
              id: String(r.billingProfileId),
              title: str(r.name) ?? DASH,
              sub: str(r.billingProfileId) ?? DASH,
              out: outstandingOf((data.bills as Rec[]).filter((b) => b.billingProfileId === r.billingProfileId)),
              status: str(r.collectionStatus),
            }))].map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  aria-pressed={profileId === row.id}
                  onClick={() => setProfileId(row.id)}
                  className={`w-full text-left rounded-[var(--radius-card)] border p-3 transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                    profileId === row.id ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)]' : 'border-[var(--field-card-border)] bg-bg hover:bg-surface'
                  }`}
                >
                  <span className="block text-fg font-medium text-[length:var(--fs-body)] break-words">{row.title}</span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-[length:var(--fs-caption)]">
                    <span className="text-fg-2 break-all">{row.sub}</span>
                    <span className={`font-semibold shrink-0 ${row.out > 0 ? 'text-accent' : 'text-fg'}`}>{qar(row.out)}</span>
                  </span>
                  {row.status && (
                    <span className="mt-2 block">
                      <StatusPill status={row.status} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Right: everything for the chosen profile. */}
        <aside className="card p-4 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <IconTile icon={IC.wallet} tone="red" />
            <span className="text-fg font-bold text-[length:var(--fs-h5)] break-words min-w-0">{selected ? (str(selected.name) ?? DASH) : 'All billing profiles'}</span>
            {selected && str(selected.collectionStatus) && <StatusPill status={String(selected.collectionStatus)} />}
            <span className="ml-auto">
              <Button variant="primary" compact disabled>
                Add Payment
              </Button>
            </span>
          </div>

          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 items-stretch">
            <Panel icon={IC.settings} title="Bill Settings" action={<InertLink>Manage</InertLink>}>
              <dl>
                {[
                  { label: 'Bill Email', value: str(stageProfile?.billingContactEmail) ?? DASH },
                  { label: 'Bill Type', value: str(stageProfile?.billingType) ?? DASH },
                  { label: 'Bill Cycle', value: str(stageProfile?.billingCycle) ?? DASH },
                  { label: 'eBill / Paperless', value: ebill ? <Pill tone={/email|ebill|e-bill|paperless/i.test(ebill) ? 'green' : 'grey'}>{/email|ebill|e-bill|paperless/i.test(ebill) ? 'Enabled' : 'Disabled'}</Pill> : DASH },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
                    <dt className="text-fg">{r.label}</dt>
                    <dd className="text-fg font-medium text-right min-w-0 break-words">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel
              icon={IC.shield}
              title="Dunning & Barring"
              action={goToTab ? <Button variant="tertiary" compact className="whitespace-nowrap" onClick={() => goToTab('alerts-risks')}>View Details &rarr;</Button> : undefined}
            >
              <dl>
                {[
                  { label: 'Current Dunning Stage', value: str(stageProfile?.collectionStage) ? <Pill tone="amber">{String(stageProfile?.collectionStage)}</Pill> : DASH },
                  { label: 'Amount Required to Avoid Barring', value: <Dv k="amountAvoidBarring" /> },
                  { label: 'OG Barring Date', value: <Dv k="ogBarringDate" /> },
                  { label: 'IC Barring Date', value: <Dv k="icBarringDate" /> },
                  { label: 'Eligible for PTP', value: ptpEligible ? <Pill tone={ptpEligible === 'Yes' ? 'green' : 'grey'}>{ptpEligible}</Pill> : DASH },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
                    <dt className="text-fg">{r.label}</dt>
                    <dd className="text-fg font-medium text-right min-w-0 break-words">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>

          <Panel icon={IC.card} title="Payment Methods" action={<InertLink>Manage</InertLink>}>
            {str(stageProfile?.paymentMethod) ? (
              <div className="flex items-center gap-3 py-1">
                <span className="w-10 h-10 rounded-[var(--radius-button)] bg-surface flex items-center justify-center shrink-0">
                  <Icon path={IC.card} className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-fg font-medium text-[length:var(--fs-body)] break-words">{String(stageProfile?.paymentMethod)}</div>
                  <div className="text-fg-2 text-[length:var(--fs-caption)]">Auto-pay: {str(stageProfile?.autoPayStatus) ?? DASH}</div>
                </div>
              </div>
            ) : (
              <p className="text-muted text-[length:var(--fs-body)] py-2">No payment method on file.</p>
            )}
          </Panel>

          <Panel icon={IC.file} title={`Bill History (${historyBills.length})`} flush>
            <GridTable cols={billCols} rows={shownBills} rowKey={(r) => String(r.billId)} empty="No bills on file." />
            {historyBills.length > PAGE && (
              <div className="px-4 py-3">
                <Button variant="tertiary" compact onClick={() => setShowAllBills((v) => !v)}>
                  {showAllBills ? 'Show fewer bills' : 'View All Bills'} &rarr;
                </Button>
              </div>
            )}
          </Panel>

          <Panel icon={IC.card} title={`Payment History (${payments.length})`} flush>
            <GridTable cols={paymentCols} rows={payments} rowKey={(r) => String(r.paymentId)} empty="No payments on file." />
          </Panel>

          <Panel icon={IC.bars} title={`Unbilled Usage (${unbilledRows.length})`} flush>
            <GridTable cols={unbilledCols} rows={unbilledRows} rowKey={(r) => String(r.billId)} empty="No unbilled usage on file." />
          </Panel>

          {showsRecharge && (
            <Panel icon={IC.refresh} title="Recharge History (Prepaid)">
              <p className="text-muted text-[length:var(--fs-body)] py-2 text-center">No prepaid recharge history on file.</p>
            </Panel>
          )}
        </aside>
      </div>
    </TabPage>
  );
}

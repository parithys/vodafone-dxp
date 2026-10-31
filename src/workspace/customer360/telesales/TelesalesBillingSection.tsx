import { Button } from '../../../components/primitives/Button';
import { computeBillingSummary } from '../../../engines/customer360Engine';
import { Icon } from '../../../components/primitives/Icon';
import { accountInformationResolvers } from '../sections/accountInformationResolvers';
import { contactInformationResolvers } from '../sections/contactInformationResolvers';
import { Card, KV, Label, Pill, Ring, Value, dateTime, num, type Ctx } from './TelesalesOverview';
import { ActionList, BarChart, HeaderButton, ICON, SectionHeader, Table, pillFor, yesNo } from './TelesalesKit';
import { rowDate, demoOf, arr, type Rec } from './shared';
import { strOrEmpty as str } from '../../../lib/values';
import { qar, monthLabel } from './billingShared';
import { formatQarAny } from '../../../lib/format';

// ============================================================================ Billing & Payments
export function BillingSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const demo = demoOf(ctx);
  const r = (d: string) => accountInformationResolvers[d]?.({ data, services });
  const { outstanding, latestBill, paidTotal } = computeBillingSummary(data);
  const unbilled = Number(latestBill?.currentChargesQAR ?? 0);
  const required = outstanding + unbilled;
  const bills = [...data.bills].sort((a, b) => str(a.billPeriod).localeCompare(str(b.billPeriod)));
  const payments = [...data.payments].sort((a, b) => str(b.capturedAt).localeCompare(str(a.capturedAt))).slice(0, 5);
  const lastPay = payments[0];
  const profile = data.billingProfiles[0] ?? {};
  const emails = arr<string>(demo.billingEmails);
  const dunning = str(r('Current Dunning Stage')) || '-';
  const bar = str(data.overviewExtras[0]?.aboutToBar) || 'No';
  const ptpOpen = str(profile.promiseToPayStatus ?? 'None') !== 'None';
  const ptp = outstanding > 0 && !ptpOpen ? 'Yes' : 'No';
  const ex = data.overviewExtras[0];
  const bal = data.inPlatformBalances[0];
  const use = data.serviceUsage[0];
  const dataTotal = use ? Number(use.currentDataUsageGB) + Number(use.availableDataBalanceGB) : 0;
  const dataLeft = bal?.dataBalanceGB != null ? Number(bal.dataBalanceGB) : Number(use?.availableDataBalanceGB ?? 0);
  const voiceTotal = Number(ex?.voiceAllowanceMin ?? 500);
  const voiceLeft = bal?.voiceBalanceMinutes != null ? Number(bal.voiceBalanceMinutes) : Math.max(0, voiceTotal - Number(use?.currentVoiceUsageMinutes ?? 0));
  const smsTotal = Number(ex?.smsAllowance ?? 500);
  const smsLeft = bal?.smsBalanceCount != null ? Number(bal.smsBalanceCount) : Number(ex?.smsRemaining ?? 0);
  const tile = (label: string, value: string, red?: boolean) => (
    <div key={label} className="rounded-[var(--radius-card)] bg-surface p-3">
      <div className="text-fg font-semibold text-[length:var(--fs-body)] leading-tight">{label}</div>
      <div className={`font-bold text-[length:var(--fs-h4)] mt-1 ${red ? 'text-accent' : 'text-fg'}`}>{value}</div>
    </div>
  );
  return (
    <>
      <SectionHeader />
      <div className="contents">
        <Card title="Billing Summary" icon={ICON.card} link="View Full Details" onLink={() => ctx.goToTab('ts-billing')}>
          <div className="p-5 grid grid-cols-2 gap-3">
            {tile('Outstanding Balance', qar(outstanding), true)}
            {tile('Unbilled Usage', qar(unbilled))}
            {tile('Due Date', latestBill?.dueDate ? dateTime(latestBill.dueDate).d : '-')}
            {tile('Amount Required to Pay', qar(required))}
          </div>
          <KV label="Postpaid - MRC">{str(r('Postpaid - Monthly Recurring Charge')) || (latestBill?.mrc !== undefined ? `${formatQarAny(str(latestBill.mrc))}` : '-')}</KV>
          <KV label="Postpaid - Average Bill">{bills.length ? qar(bills.reduce((a, b) => a + Number(b.totalAmount ?? 0), 0) / bills.length) : '-'}</KV>
          <KV label="Prepaid - Avg. Recharge">{arr<Rec>(demo.recharges).length ? qar(arr<Rec>(demo.recharges).reduce((a, b) => a + Number(b.amountQar ?? 0), 0) / arr<Rec>(demo.recharges).length) : '-'}</KV>
          <KV label="Prepaid - Top Recharge Type">{str(arr<Rec>(demo.recharges)[0]?.type) || '-'}</KV>
          <KV label="Last Payment">
            {lastPay ? (
              <span>
                <b>{qar(Number(lastPay.amountQar))}</b> <span className="text-muted text-[length:var(--fs-caption)]">{dateTime(lastPay.capturedAt).d} · {str(lastPay.captureChannel)}</span>
              </span>
            ) : (
              '-'
            )}
          </KV>
        </Card>

        <Card title="Current Bill" icon={ICON.card} link="View Bill" onLink={() => ctx.goToTab('ts-billing')}>
          <KV label="Bill Period">{latestBill ? monthLabel(str(latestBill.billPeriod)) : '-'}</KV>
          <KV label="Bill Number">{str(latestBill?.billId) || '-'}</KV>
          <KV label="Issue Date">{latestBill?.issueDate ? dateTime(latestBill.issueDate).d : '-'}</KV>
          <KV label="Due Date">{latestBill?.dueDate ? dateTime(latestBill.dueDate).d : '-'}</KV>
          <KV label="Total Amount">{latestBill ? qar(Number(latestBill.totalAmount ?? 0)) : '-'}</KV>
          <KV label="Amount Paid">{qar(paidTotal)}</KV>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-accent font-semibold text-[length:var(--fs-body)]">Outstanding Amount</span>
            <span className="text-accent font-bold text-[length:var(--fs-h4)]">{qar(outstanding)}</span>
          </div>
          <div className="px-5 pb-5 space-y-3">
            <HeaderButton primary>Make a Payment</HeaderButton>
            <div>
              <Button variant="tertiary" type="button" className="inline-flex items-center gap-2">
                <Icon path={ICON.download} className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions" icon={ICON.bars}>
          <ActionList
            items={[
              { title: 'Make a Payment', sub: 'Process a customer payment' },
              { title: 'View Bill', sub: 'Download and view bills' },
              { title: 'Set Up Payment Arrangement', sub: 'Check PTP eligibility' },
              { title: 'Update Billing Email', sub: 'Add or modify billing recipients' },
              { title: 'View Billing Profile', sub: 'See all billing profiles' },
              { title: 'Request Adjustment', sub: 'Submit an adjustment request' },
            ]}
          />
        </Card>
      </div>

      <div className="contents">
        <Card title="Billing History" icon={ICON.refresh} link="View All Bills" onLink={() => ctx.goToTab('ts-billing')}>
          {bills.length > 0 && <BarChart data={bills.slice(-6).map((b) => ({ label: monthLabel(str(b.billPeriod)).replace(' ', ' '), value: Number(b.totalAmount ?? 0) }))} />}
          <Table
            cols={[
              { header: 'Bill Period', render: (b: Rec) => monthLabel(str(b.billPeriod)) },
              { header: 'Bill Number', render: (b: Rec) => str(b.billId) },
              { header: 'Bill Amount', className: 'font-bold', render: (b: Rec) => qar(Number(b.totalAmount ?? 0)) },
              {
                header: 'Status',
                render: (b: Rec) => <Pill tone={str(b.status) === 'billed' ? 'red' : pillFor(str(b.status))}>{str(b.status) === 'billed' ? 'Unpaid' : str(b.status).replace(/^./, (c) => c.toUpperCase())}</Pill>,
              },
              { header: 'Action', className: 'text-link font-semibold', render: () => 'View' },
            ]}
            rows={[...bills].reverse().slice(0, 5)}
            empty="No bills on file."
          />
        </Card>

        <Card title="Payment History" icon={ICON.card} link="View All Payments" onLink={() => ctx.goToTab('ts-billing')}>
          <Table
            cols={[
              { header: 'Date & Time', render: (p: Rec) => rowDate(p.capturedAt) },
              { header: 'Amount', className: 'font-bold', render: (p: Rec) => qar(Number(p.amountQar ?? 0)) },
              { header: 'Channel', render: (p: Rec) => str(p.paymentMethod ?? p.captureChannel) },
              { header: 'Status', render: (p: Rec) => <Pill tone={pillFor(str(p.status ?? 'Successful'))}>{str(p.status ?? 'Successful')}</Pill> },
              { header: 'Ref. No.', render: (p: Rec) => str(p.receiptNumber ?? p.paymentId) },
            ]}
            rows={payments}
            empty="No payments on file."
          />
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--field-card-border)]">
            <span className="inline-flex items-center gap-2 text-fg font-semibold">
              <Icon path={ICON.bars} className="w-4 h-4" />
              Unbilled Usage
            </span>
            <button type="button" onClick={() => ctx.goToTab('ts-products')} className="text-link font-semibold text-[length:var(--fs-body)]">
              View Usage Details →
            </button>
          </div>
          <div className="px-5 pb-5 space-y-4">
            <Ring value={String(dataLeft)} unit="GB" sub={`of ${Math.round(dataTotal)} GB`} fraction={dataTotal ? dataLeft / dataTotal : undefined} label="Data" />
            <Ring value={String(voiceLeft)} sub={`of ${voiceTotal} Mins`} fraction={voiceTotal ? voiceLeft / voiceTotal : undefined} label="Voice" />
            <Ring value={String(smsLeft)} sub={`of ${smsTotal} SMS`} fraction={smsTotal ? smsLeft / smsTotal : undefined} label="SMS" />
            <Ring value={qar(Number(bal?.mainBalanceQAR ?? 0))} fraction={1} label="Primary Balance" wide />
          </div>
        </Card>
      </div>

      <div className="contents">
        <Card title="Dunning & Credit Information" icon={ICON.shield}>
          <div className="p-5 grid grid-cols-3 gap-4">
            <div>
              <Label>Current Dunning Stage</Label>
              <Pill tone={/^(none|no dunning|current)$/i.test(dunning) ? 'green' : 'amber'}>{dunning}</Pill>
            </div>
            <div>
              <Label>About to OG/IC Bar</Label>
              {yesNo(bar)}
            </div>
            <div>
              <Label>OG/IC Barring Dates</Label>
              <Value>{str(r('OG/IC Barring Dates')) || '-'}</Value>
            </div>
            <div>
              <Label>Credit Limit</Label>
              <Value big>{str(r('Credit Limit')) || '-'}</Value>
            </div>
            <div>
              <Label>Amount Required to Pay</Label>
              <Value big>{qar(required)}</Value>
            </div>
            <div>
              <Label>Overdue Amount</Label>
              <div className="text-accent font-bold text-[length:var(--fs-h4)]">{qar(outstanding)}</div>
            </div>
          </div>
        </Card>
        <Card title="Payment Arrangement (PTP)" icon={ICON.card}>
          <KV label="PTP Eligible">{yesNo(ptp)}</KV>
          <KV label="Pending TON Requests">
            <Pill tone="amber">{num(r('Pending TON requests')) ?? 0}</Pill>
          </KV>
          <KV label="Pending Adjustments">
            <Pill tone="amber">{num(r('Pending Adjustments')) ?? 0}</Pill>
          </KV>
          <KV label="Pending SIM Swap">
            <Pill tone="amber">{num(r('Pending Sim swap')) ?? 0}</Pill>
          </KV>
        </Card>
        <Card title="Billing Information" icon={ICON.card}>
          <KV label="Billing Email ID(s)">
            <span className="break-all">{emails.length ? emails.slice(0, 2).join(' ') : str(profile.billingContactEmail) || '-'}</span>
          </KV>
          <KV label="Billing Profile">{str(profile.name) || '-'}</KV>
          <KV label="Bill Delivery Method">{str(profile.billMedium) ? `${str(profile.billMedium)} (eBill)` : '-'}</KV>
          <KV label="Multiple Billing Recipients">{yesNo(emails.length > 1)}</KV>
          <KV label="Preferred Language">{str(contactInformationResolvers['Preferred Language']?.({ data, services })) || '-'}</KV>
        </Card>
        <Card title="Related Links" icon={ICON.search}>
          <ActionList
            items={[
              { title: 'All Billing Profiles', sub: 'View and manage billing profiles', onClick: () => ctx.goToTab('ts-billing') },
              { title: 'Payment Terms & Policies', sub: 'View customer payment terms' },
              { title: 'Request Adjustment', sub: 'Submit a billing adjustment' },
              { title: 'View Orders', sub: 'See recent and past orders', onClick: () => ctx.goToTab('ts-history') },
            ]}
          />
        </Card>
      </div>
    </>
  );
}

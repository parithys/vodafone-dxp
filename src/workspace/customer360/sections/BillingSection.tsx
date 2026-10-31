import { DataTable } from '../../../components/primitives/DataTable';
import { creditBreakdownOf } from '../creditLimitView';
import { hrnFeeApplies } from '../../../engines/creditLimit';
import { Badge } from '../../../components/primitives/Badge';
import { computeBillingSummary, withinBillHistoryWindow, type Customer360Data } from '../../../engines/customer360Engine';
import { MetricCard } from '../MetricCard';
import { isHrn as isHrnNationality } from '../../../engines/hrnConfiguration';
import { InvoiceActions } from '../InvoiceActions';
import { formatAmountAny } from '../../../lib/format';

function capitalize(value: unknown): string {
  const s = String(value ?? '');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '-';
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[length:var(--fs-caption)] text-muted">{label}</div>
      <div className="text-fg text-[length:var(--fs-body)]">{value ?? '-'}</div>
    </div>
  );
}

function SectionCard({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section>
      <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 card p-5">
        {children}
      </div>
      {note && <p className="text-[length:var(--fs-caption)] text-muted mt-1.5">{note}</p>}
    </section>
  );
}

const DR_NOTE =
  'Layout provisional - to be confirmed with VFQ Business.';

// No billing screens exist anywhere in the 213-screen catalogue today (the
// "Billing & Adjustments" module was never given a src/modules folder) - so
// unlike Mobile/Fibre there's no wizard to launch here. This tab is
// deliberately read-only for the core billing profile (BAM edits live on the
// dedicated Billing Account page instead - BAM-01), but the BIV display
// block (barring/PTP/collection/usage/balance/penalty/CDR) is fully wired
// against the placeholder data documented in each SectionCard's note.
export function BillingSection({ data }: { data: Customer360Data }) {
  const account = data.accounts[0];
  const profile = data.billingProfiles[0];
  const { creditLimit, latestBill, outstanding, formattedBillPeriod, previousPayment } = computeBillingSummary(data);
  const hasMetrics = Boolean(creditLimit) || Boolean(latestBill);
  const collectionStatus = profile?.collectionStatus ? String(profile.collectionStatus) : undefined;
  // The HRN fee follows the nationality, but is NOT marked when the customer's Credit Risk Exemption is Low or No.
  const risk = data.customer as { creditRisk?: string; creditRiskExemption?: string; creditRiskUpdatedAt?: string };
  const hrnRequired = isHrnNationality(data.customer.nationality as string | undefined) && hrnFeeApplies(risk.creditRiskExemption);
  const billsInWindow = data.bills.filter((b) => withinBillHistoryWindow(b.billPeriod));

  return (
    <div className="space-y-6">
      {hasMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {creditLimit && (
            <MetricCard
              label="Credit Limit"
              value={`${formatAmountAny(String(creditBreakdownOf(data).overall ?? creditLimit.creditLimitQar ?? creditLimit.creditLimitQAR ?? '-'))} QAR`}
              subtext={
                creditLimit.restrictionApplied
                  ? 'Restriction applied'
                  : String(account?.accountType ?? String(creditLimit.customerSegment ?? '-'))
              }
            />
          )}
          {latestBill && (
            <MetricCard
              label="Current Bill"
              value={`${formatAmountAny(String(latestBill.totalAmount ?? '-'))} QAR`}
              subtext={`${formattedBillPeriod} · ${capitalize(latestBill.status)}`}
            />
          )}
          {latestBill && (
            <MetricCard
              label="Outstanding"
              value={`${formatAmountAny(outstanding)} QAR`}
              subtext={outstanding > 0 ? 'Overdue balance' : 'No overdue balance'}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Current Charges"
          value={latestBill ? `${formatAmountAny(String((latestBill as Record<string, unknown>).currentChargesQAR ?? '-'))} QAR` : '-'}
          subtext="CUS-001-BIV-03"
        />
        <MetricCard
          label="Previous Payment"
          value={previousPayment ? `${formatAmountAny(String(previousPayment.amountQar ?? '-'))} QAR` : '-'}
          subtext={previousPayment ? String(previousPayment.chargeType ?? 'CUS-001-BIV-04') : 'No payments on file'}
        />
        <MetricCard
          label="Previous Outstanding"
          value={profile ? `${formatAmountAny(String(profile.previousOutstandingQAR ?? 0))} QAR` : '-'}
          subtext="CUS-001-BIV-05"
        />
      </div>

      {profile && (
        <section>
          <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Billing Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 card p-5">
            <Field label="Billing Cycle" value={profile.billingCycle ? String(profile.billingCycle) : undefined} />
            <Field label="Billing Type" value={profile.billingType ? String(profile.billingType) : undefined} />
            <Field label="Billing Address" value={profile.billingAddress ? String(profile.billingAddress) : undefined} />
          </div>
        </section>
      )}

      <section>
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Credit Risk</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 card p-5">
          <Field
            label="Collection Status"
            value={
              collectionStatus ? (
                <Badge variant={collectionStatus === 'Good Standing' ? 'success' : 'danger'}>{collectionStatus}</Badge>
              ) : undefined
            }
          />
          <Field label="Credit Risk" value={risk.creditRisk ? `${risk.creditRisk}${risk.creditRiskUpdatedAt ? ` (Big Data, updated ${risk.creditRiskUpdatedAt})` : ''}` : undefined} />
          <Field label="Credit Risk Exemption" value={risk.creditRiskExemption} />
          <Field
            label="HRN Advance Payment Required"
            value={<Badge variant={hrnRequired ? 'warning' : 'filled-neutral'}>{hrnRequired ? 'Yes' : 'No'}</Badge>}
          />
          {profile?.hrnAdvancePaymentQAR !== undefined && (
            <Field label="HRN Advance Payment Amount" value={`${formatAmountAny(String(profile.hrnAdvancePaymentQAR))} QAR`} />
          )}
        </div>
      </section>

      <SectionCard title="Collection Detail" note={DR_NOTE}>
        <Field label="Collection Scenario" value={profile?.collectionScenario ? String(profile.collectionScenario) : undefined} />
        <Field label="Collection Stage" value={profile?.collectionStage ? String(profile.collectionStage) : undefined} />
        <Field label="Collection Action Status" value={profile?.collectionActionStatus ? String(profile.collectionActionStatus) : undefined} />
      </SectionCard>

      <SectionCard title="Promise to Pay" note={DR_NOTE}>
        <Field
          label="Status"
          value={
            profile?.promiseToPayStatus ? (
              <Badge variant={profile.promiseToPayStatus === 'Active' ? 'warning' : profile.promiseToPayStatus === 'Fulfilled' ? 'success' : 'filled-neutral'}>
                {String(profile.promiseToPayStatus)}
              </Badge>
            ) : undefined
          }
        />
        <Field label="Amount" value={profile?.promiseToPayAmountQAR != null ? `${formatAmountAny(String(profile.promiseToPayAmountQAR))} QAR` : undefined} />
        <Field label="Created" value={profile?.promiseToPayCreatedDate ? String(profile.promiseToPayCreatedDate) : undefined} />
        <Field label="Expires" value={profile?.promiseToPayExpiryDate ? String(profile.promiseToPayExpiryDate) : undefined} />
      </SectionCard>

      {data.accounts.map((svc) => {
        const svcAny = svc as unknown as Record<string, unknown>;
        const usage = data.serviceUsage.find((u) => u.accountId === svc.accountId);
        const balance = data.inPlatformBalances.find((b) => b.accountId === svc.accountId);
        const cdrs = data.callDetailRecords.filter((c) => c.accountId === svc.accountId);
        return (
          <div key={svc.accountId} className="space-y-4 rounded-[var(--radius-card)] border border-dashed border-border p-4">
            <p className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-muted">
              {svc.accountType} · {svc.accountId}
            </p>

            <SectionCard title="Barring" note={DR_NOTE}>
              <Field
                label="Barring Status"
                value={
                  <Badge variant={svcAny.barringStatus === 'Not Barred' ? 'success' : 'danger'}>
                    {String(svcAny.barringStatus ?? 'Not Barred')}
                  </Badge>
                }
              />
              <Field label="Barring Type" value={svcAny.barringType ? String(svcAny.barringType) : undefined} />
              <Field label="Barring Reason" value={svcAny.barringReason ? String(svcAny.barringReason) : undefined} />
            </SectionCard>

            <SectionCard title="Usage & Spend" note={DR_NOTE}>
              <Field label="Current Voice Usage" value={usage ? `${String(usage.currentVoiceUsageMinutes)} min` : undefined} />
              <Field label="Current Data Usage" value={usage ? `${String(usage.currentDataUsageGB)} GB` : undefined} />
              <Field label="Available Data Balance" value={usage?.availableDataBalanceGB != null ? `${String(usage.availableDataBalanceGB)} GB` : undefined} />
              <Field label="Current Spend" value={usage ? `${formatAmountAny(String(usage.currentSpendQAR))} QAR` : undefined} />
            </SectionCard>

            <SectionCard title="IN Platform Balance" note={DR_NOTE}>
              <Field label="Main Balance" value={balance ? `${formatAmountAny(String(balance.mainBalanceQAR))} QAR` : undefined} />
              <Field label="Data Balance" value={balance?.dataBalanceGB != null ? `${String(balance.dataBalanceGB)} GB` : undefined} />
              <Field label="Voice Balance" value={balance?.voiceBalanceMinutes != null ? `${String(balance.voiceBalanceMinutes)} min` : undefined} />
              <Field label="SMS Balance" value={balance?.smsBalanceCount != null ? String(balance.smsBalanceCount) : undefined} />
            </SectionCard>

            <section>
              <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Call Detail Records</h3>
              <DataTable
                rows={cdrs}
                rowKey={(r) => String(r.cdrId)}
                emptyMessage="No call detail records on file for this period."
                columns={[
                  { key: 'callDate', header: 'Date' },
                  { key: 'callType', header: 'Type' },
                  { key: 'destination', header: 'Destination' },
                  { key: 'durationSeconds', header: 'Duration (s)' },
                  { key: 'chargeQAR', header: 'Charge (QAR)' },
                ]}
              />
              <p className="text-[length:var(--fs-caption)] text-muted mt-1.5">{DR_NOTE}</p>
            </section>
          </div>
        );
      })}

      <SectionCard title="Penalties" note={DR_NOTE}>
        <DataTable
          rows={data.penalties}
          rowKey={(r) => String(r.penaltyId)}
          emptyMessage="No penalties on file."
          columns={[
            { key: 'actionType', header: 'Penalty Type' },
            { key: 'calculatedValue', header: 'Amount' },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge variant={r.status === 'Applied' ? 'danger' : r.status === 'Waived' ? 'success' : 'warning'}>{String(r.status)}</Badge>,
            },
          ]}
        />
      </SectionCard>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">Bills (Last 12 Months)</h3>
        </div>
        <DataTable
          rows={billsInWindow}
          rowKey={(r) => String(r.billId)}
          emptyMessage="No bills on file within the last 12 months."
          columns={[
            { key: 'billPeriod', header: 'Period' },
            { key: 'type', header: 'Type' },
            { key: 'totalAmount', header: 'Total (QAR)' },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge variant={r.status === 'billed' ? 'success' : 'filled-neutral'}>{String(r.status)}</Badge>,
            },
            { key: 'actions', header: '', sortable: false, render: (r) => <InvoiceActions bill={r} customerName={data.customer.name} /> },
          ]}
        />
      </section>

      <section>
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Payments</h3>
        <DataTable
          rows={data.payments}
          rowKey={(r) => String(r.paymentId)}
          emptyMessage="No payments on file."
          columns={[
            { key: 'capturedAt', header: 'Date' },
            { key: 'chargeType', header: 'Charge' },
            { key: 'amountQar', header: 'Amount (QAR)' },
            { key: 'paymentMethod', header: 'Method' },
            { key: 'status', header: 'Status' },
          ]}
        />
      </section>

      <section>
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Adjustments &amp; Refunds</h3>
        <DataTable
          rows={data.adjustments}
          rowKey={(r) => String(r.adjustmentId)}
          emptyMessage="No adjustments on file."
          columns={[
            { key: 'reason', header: 'Reason' },
            { key: 'direction', header: 'Direction' },
            { key: 'amount', header: 'Amount' },
          ]}
        />
      </section>

      <section>
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Deposits</h3>
        <DataTable
          rows={data.deposits}
          rowKey={(r) => String(r.depositId)}
          emptyMessage="No deposits on file."
          columns={[
            { key: 'amount', header: 'Amount' },
            { key: 'currency', header: 'Currency' },
            { key: 'refundStatus', header: 'Refund status' },
          ]}
        />
      </section>
    </div>
  );
}

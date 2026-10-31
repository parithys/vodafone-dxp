import { defaultCreditLimitForSegment } from '../../../engines/hrnConfiguration';
import { creditSegmentOf, customerCategoryOf } from '../../../engines/creditLimit';
import { creditBreakdownOf } from '../creditLimitView';
import { canChangePrimaryContact, contactName, primaryContactOf } from '../primaryContactModel';
import { Button } from '../../../components/primitives/Button';
import { SegmentedTabs } from '../../../components/primitives/SegmentedTabs';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { computeBillingSummary, withinBillHistoryWindow, type Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { overdueTicketCount } from './accountInformationResolvers';
import { RevealValue, useFieldAccess } from '../fieldAccess';
import { fmtDate, fmtDateTime, IC, IconTile, KpiGrid, KpiTile, LinkAction, Panel, Pill, Progress, qar, TabPage, toneFor } from './C360Kit';
import type { Tone } from './C360Kit';
import { isTonPending } from '../../../lib/statusTone';
import { Dv } from '../demoValues';
import { str, num } from '../../../lib/values';

const ADJUSTMENT_TERMINAL = new Set(['Approved', 'Rejected', 'Failed']);


/** A label / value row in the design's grey-label, dark-value style; a missing value reads "-". */
function Field({ label, requirement, value, strong = true }: { label: string; /** The requirement's own name, when the display label differs from it. */ requirement?: string; value: ReactNode | undefined | null; strong?: boolean }) {
  const mode = useFieldAccess()(requirement ?? label);
  if (mode === 'hidden') return null;
  const empty = value === undefined || value === null || value === '';
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
      <dt className="text-fg shrink-0" data-req={requirement}>{label}</dt>
      <dd className={`text-fg min-w-0 break-words text-right ${strong ? 'font-medium' : ''}`}>{empty ? '-' : mode === 'drill-down' ? <RevealValue>{value}</RevealValue> : value}</dd>
    </div>
  );
}

function toneForStage(stage: string | undefined): Tone {
  if (!stage) return 'grey';
  if (/no dunning|good/i.test(stage)) return 'green';
  return 'amber';
}

function milestoneIcon(topic: string): { icon: string; tone: Tone } {
  const t = topic.toLowerCase();
  if (/payment|recharge/.test(t)) return { icon: IC.checkCircle, tone: 'green' };
  if (/sim/.test(t)) return { icon: IC.file, tone: 'blue' };
  if (/plan|migration|upgrade|downgrade/.test(t)) return { icon: IC.settings, tone: 'purple' };
  if (/ticket|complaint|fault/.test(t)) return { icon: IC.alert, tone: 'red' };
  if (/add-?on|purchase/.test(t)) return { icon: IC.cart, tone: 'amber' };
  return { icon: IC.clipboard, tone: 'grey' };
}

const SERVICE_ROWS: { label: string; icon: string; tone: Tone; match: (s: CustomerService) => boolean }[] = [
  { label: 'Mobile', icon: IC.mobile, tone: 'red', match: (s) => s.category === 'Prepaid' || s.category === 'Postpaid' },
  { label: 'Fixed Line', icon: IC.phone, tone: 'purple', match: (s) => s.category === 'Fixed Line' },
  { label: 'TV', icon: IC.tv, tone: 'amber', match: (s) => s.category === 'TV / Entertainment' },
  { label: 'Home Internet', icon: IC.wifi, tone: 'blue', match: (s) => s.category === 'GigaHome Fibre' || s.category === 'GigaHome 5G' },
  { label: 'IoT / M2M', icon: IC.cpu, tone: 'grey', match: (s) => s.category === 'Smart Devices' },
];

/**
 * Customer 360 "Account Information" tab: header, KPI strip and eight cards, every value bound to the same
 * Customer360Data the standard tabs read. A value with no data on file shows "-".
 */
export function C360AccountInformation({
  data,
  services,
  goToTab,
  onEdit,
  onChangePrimaryContact,
}: {
  data: Customer360Data;
  services: CustomerService[];
  goToTab?: (key: string) => void;
  onEdit?: () => void;
  /** Opens the Primary Contact change (after verification); offered only when the account has more than one contact. */
  onChangePrimaryContact?: () => void;
}) {
  const go = (key: string) => (goToTab ? () => goToTab(key) : undefined);
  const defaultMode = data.customer.lineType === 'Prepaid' ? 'prepaid' : 'postpaid';
  const [mode, setMode] = useState<'postpaid' | 'prepaid'>(defaultMode);

  const account = data.accounts[0];
  const profile = data.billingProfiles[0];
  const summary = computeBillingSummary(data);
  // The limit on file, else the default for the customer's segment.
  const limits = creditBreakdownOf(data);
  const creditLimit = limits.overall ?? defaultCreditLimitForSegment(data.customer.segment);
  const outstanding = data.bills.length > 0 || data.payments.length > 0 ? summary.outstanding : undefined;
  const utilisation = creditLimit && outstanding !== undefined ? Math.round((outstanding / creditLimit) * 100) : undefined;
  const latestTotal = num(summary.latestBill?.totalAmount);
  const recent = data.bills
    .filter((b) => withinBillHistoryWindow(b.billPeriod) && num(b.totalAmount) !== undefined)
    .sort((a, b) => String(b.billPeriod ?? '').localeCompare(String(a.billPeriod ?? '')))
    .slice(0, 6);
  const average = recent.length > 0 ? Math.round(recent.reduce((s, b) => s + Number(b.totalAmount), 0) / recent.length) : undefined;
  const stage = str(profile?.collectionStage);
  const standing = str(profile?.collectionStatus);
  const balance = data.inPlatformBalances[0];
  const digital = data.digitalEngagement[0];

  const counts = SERVICE_ROWS.map((r) => ({ ...r, n: services.filter(r.match).length }));
  const mobileN = counts[0].n;
  const fixedN = counts[1].n + counts[3].n;
  const iotN = counts[4].n;
  const prepaidN = services.filter((s) => s.category === 'Prepaid').length;
  const postpaidN = services.filter((s) => s.category === 'Postpaid').length;

  const pendingTon = data.tonCases.filter((t) => isTonPending(t.status)).length;
  const pendingAdj = data.adjustments.filter((a) => !ADJUSTMENT_TERMINAL.has(String(a.status))).length;
  const pendingSwap = data.simSwapOrders.filter((s) => String(s.status).includes('Pending')).length;
  const overdue = overdueTicketCount(data);

  // Compact account tree: customer -> billing accounts (service accounts counted under each).
  const profileIds = Array.from(new Set(data.accounts.map((a) => a.billingProfileId).filter((x): x is string => Boolean(x))));
  const tree = profileIds.map((id) => {
    const bp = data.billingProfiles.find((p) => p.billingProfileId === id);
    return { id, name: str(bp?.name) ?? id, count: data.accounts.filter((a) => a.billingProfileId === id).length };
  });

  // The Primary Contact: the one chosen on the billing profile, else the first contact.
  const primary = primaryContactOf(data.contacts, data.billingProfiles[0]?.primaryContactId);
  const primaryContactId = primary?.contactRecordId;
  const contactRows = [
    ...data.contacts.map((c) => ({
      key: String(c.contactRecordId),
      name: [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ') || '-',
      sub: str(c.cellNumber) ?? '-',
      badge: c.contactRecordId === primaryContactId ? 'Primary' : undefined,
    })),
    ...data.authorisedContacts.map((a) => ({
      key: String(a.authorisedPersonId),
      name: str(a.name) ?? '-',
      sub: Array.isArray(a.roles) && a.roles.length > 0 ? `Authorised Contact - ${a.roles.join(', ')}` : 'Authorised Contact',
      badge: undefined as string | undefined,
    })),
  ].slice(0, 3);

  const milestones = [...data.activities].sort((a, b) => String(b.transactionDate ?? '').localeCompare(String(a.transactionDate ?? ''))).slice(0, 5);

  const pendingRows: { label: string; value: number; tab: string }[] = [
    { label: 'Pending TON Requests', value: pendingTon, tab: 'orders' },
    { label: 'Pending Adjustments', value: pendingAdj, tab: 'billing' },
    { label: 'Pending SIM Swap', value: pendingSwap, tab: 'orders' },
    { label: 'All Orders', value: data.orders.length, tab: 'orders' },
    { label: 'All Trouble Tickets', value: data.tickets.length, tab: 'tickets-support' },
    { label: 'All Billing Profiles', value: data.billingProfiles.length, tab: 'billing' },
    { label: 'Installed Assets', value: data.installedAssets.length, tab: 'products-services' },
  ];

  const financial = (
    mode === 'postpaid'
      ? [
          { label: 'Monthly Revenue (Current)', value: qar(latestTotal) },
          { label: 'Average Revenue (Last 6 Months)', value: qar(average) },
          { label: 'Outstanding Amount', value: qar(outstanding), red: true },
          { label: 'Total Number of Connections', value: services.length > 0 ? String(postpaidN) : undefined },
          { label: 'Top Recharge Type', value: <Dv k="topRechargeType" /> },
          { label: 'Primary Balance', value: <Dv k="primaryBalance" /> },
        ]
      : [
          { label: 'Last Recharge Amount', value: qar(num(digital?.lastRechargeAmountQar)) },
          { label: 'Last Recharge Date', value: fmtDate(digital?.lastRechargeAt) },
          { label: 'Top Recharge Type', value: str(digital?.lastRechargeType) ?? <Dv k="topRechargeType" /> },
          { label: 'Total Number of Connections', value: services.length > 0 ? String(prepaidN) : undefined },
          { label: 'Primary Balance', value: qar(num(balance?.mainBalanceQAR)) ?? <Dv k="primaryBalance" /> },
          { label: 'Data Balance', value: num(balance?.dataBalanceGB) !== undefined ? `${String(balance?.dataBalanceGB)} GB` : undefined },
        ]
  ) as { label: string; value: string | undefined; red?: boolean }[];

  const empty = (text: string) => <p className="text-muted text-[length:var(--fs-body)] py-3">{text}</p>;

  return (
    <TabPage
      icon={IC.building}
      title="Account Information"
      subtitle="View account details, relationships, financial summary and key indicators"
    >
      <KpiGrid>
        <KpiTile icon={IC.file} tone="green" label="Account Status" value={account?.status ? <Pill tone={toneFor(account.status)}>{account.status}</Pill> : '-'} />
        <KpiTile
          icon={IC.users}
          tone="blue"
          label="Total Connections"
          value={services.length}
          caption={
            <span className="flex flex-wrap gap-x-3">
              <span>Mobile {mobileN}</span>
              <span>Fixed {fixedN}</span>
              <span>IoT {iotN}</span>
            </span>
          }
        />
        <KpiTile
          icon={IC.card}
          tone="blue"
          label="Credit Limit"
          value={qar(creditLimit) ?? '-'}
          caption={
            utilisation !== undefined && (
              <span className="flex items-center gap-2">
                <span className="shrink-0">Utilisation: {utilisation}%</span>
                <span className="flex-1 min-w-12">
                  <Progress pct={utilisation} tone="blue" />
                </span>
              </span>
            )
          }
        />
        <KpiTile icon={IC.bars} tone="purple" label="Monthly Revenue" value={qar(latestTotal) ?? '-'} caption={average !== undefined ? `Avg. (Last 6 Months): ${qar(average)}` : undefined} />
        <KpiTile
          icon={IC.alert}
          tone="red"
          label="Dunning Stage"
          value={
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>{stage ?? '-'}</span>
              {standing && <Pill tone={toneForStage(standing)}>{standing}</Pill>}
            </span>
          }
        />
      </KpiGrid>

      <div className="grid grid-cols-1 @4xl:grid-cols-3 gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <Panel
            icon={IC.file}
            title="Account Details"
            action={
              onEdit && (
                <Button variant="secondary" compact onClick={onEdit}>
                  Edit
                </Button>
              )
            }
          >
            <dl>
              <Field label="Account Name" value={data.customer.name} />
              <Field label="Gender" value={data.contacts[0]?.gender as string | undefined} />
              <Field
                label="Account Number"
                value={
                  account?.accountId && (
                    <span className="inline-flex items-center gap-2">
                      {account.accountId}
                      <button type="button" aria-label="Copy account number" onClick={() => void navigator.clipboard?.writeText(account.accountId)} className="text-fg-2 hover:text-fg">
                        <Icon path={IC.copy} className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )
                }
              />
              <Field label="Customer Type" value={<Dv k="customerType" />} />
              <Field label="Segment" value={data.customer.segment} />
              <Field label="Customer Segment (Qatari / Expat)" value={creditSegmentOf(data.customer.nationality as string | undefined)} />
              <Field label="Customer Category (HRN / Non-HRN)" value={customerCategoryOf(data.customer.nationality as string | undefined)} />
              <Field label="Credit Limit" value={qar(creditLimit)} />
              <Field label="Overall" value={qar(limits.overall)} />
              <Field label="Default" value={qar(limits.default)} />
              <Field label="Credit Control Team" value={limits.creditControl === null ? '-' : qar(limits.creditControl)} />
              <Field label="Credit Limit Increased Due to Deposit" value={limits.depositIncrease ? qar(limits.depositIncrease) : '-'} />
              <Field label="Primary MSISDN" value={data.customer.phone} />
              <Field label="Account Manager Name" requirement="AM name" value={account?.accountManagerName} />
              <Field label="Account Manager Mobile" requirement="AM mobile" value={account?.accountManagerMobile} />
              <Field label="Account Manager Email" requirement="AM Email" value={account?.accountManagerEmail} />
              <Field label="Account Status" value={account?.status ? <Pill tone={toneFor(account.status)}>{account.status}</Pill> : undefined} />
              <Field label="Customer Since" value={<Dv k="customerSince" />} />
            </dl>
            {overdue > 0 && <p className="text-[var(--warn-text)] text-[length:var(--fs-caption)] pt-2">{overdue} trouble ticket{overdue === 1 ? '' : 's'} past SLA.</p>}
          </Panel>

          <Panel
            icon={IC.mail}
            title="Billing Contact"
            action={
              onChangePrimaryContact && canChangePrimaryContact(data.contacts.length) && (
                <Button variant="secondary" compact onClick={onChangePrimaryContact}>
                  Edit
                </Button>
              )
            }
          >
            <dl>
              <Field label="Primary Contact" value={primary ? contactName(primary) : undefined} />
              <Field label="Billing Email ID" value={str(profile?.billingContactEmail)} />
              <Field label="Bill Type" value={str(profile?.billingType)} />
              <Field label="Bill Cycle" value={str(profile?.billingCycle)} />
            </dl>
          </Panel>
        </div>

        <div className="space-y-4 min-w-0">
          <Panel icon={IC.layers} title="Connections by Service Type" action={<LinkAction onClick={go('products-services')}>View All</LinkAction>}>
            {services.length === 0 ? (
              empty('No connections on file.')
            ) : (
              <ul>
                {counts.map((r) => (
                  <li key={r.label} className="flex items-center gap-3 py-1.5 border-b border-border-soft last:border-0">
                    <span className={`flex items-center gap-3 flex-1 min-w-0 rounded-[var(--radius-button)] px-2 py-1.5 bg-surface-half`}>
                      <IconTile icon={r.icon} tone={r.tone} size="sm" />
                      <span className="text-fg text-[length:var(--fs-body)] flex-1 min-w-0 truncate">{r.label}</span>
                    </span>
                    <span className="text-fg font-semibold text-[length:var(--fs-body)] w-8 text-right">{r.n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel icon={IC.layers} title="Account Hierarchy" action={<LinkAction onClick={go('products-services')}>View Hierarchy</LinkAction>}>
            <div className="flex items-center gap-3">
              <IconTile icon={IC.user} tone="blue" size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-fg font-semibold text-[length:var(--fs-body)] break-words">{data.customer.name}</span>
                  {account && !account.parentAccountId && <Pill tone="blue">Primary</Pill>}
                </div>
                <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">Account No: {account?.accountId ?? data.customer.customerId}</div>
              </div>
            </div>
            {tree.length === 0 ? (
              <p className="text-muted text-[length:var(--fs-body)] pt-3 pl-12">No billing accounts on file.</p>
            ) : (
              <ul className="ml-4 mt-1 border-l border-[var(--border)] pl-6 space-y-2 pt-2">
                {tree.map((n, i) => (
                  <li key={n.id} className="flex items-center gap-3">
                    <IconTile icon={i % 2 === 0 ? IC.home : IC.building} tone={i % 2 === 0 ? 'amber' : 'purple'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-fg font-medium text-[length:var(--fs-body)] break-words">{n.name}</div>
                      <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">Account No: {n.id}</div>
                    </div>
                    <span className="rounded-[var(--radius-pill)] bg-surface text-fg min-w-8 text-center px-2 py-0.5 text-[length:var(--fs-caption)]">{n.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel icon={IC.clipboard} title="Pending Work & Actions" action={<LinkAction onClick={go('orders')}>View All</LinkAction>}>
            <ul>
              {pendingRows.map((r) => (
                <li key={r.label}>
                  <button type="button" disabled={!goToTab} onClick={go(r.tab)} className="w-full flex items-center justify-between gap-3 py-1.5 border-b border-border-soft text-[length:var(--fs-body)] enabled:hover:bg-surface">
                    <span className="text-fg-2 text-left">{r.label}</span>
                    <span className="text-fg font-medium">{r.value}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-4 min-w-0">
          <Panel
            icon={IC.bars}
            title="Financial Summary"
            action={
              <SegmentedTabs
                label="Revenue Basis"
                items={[{ key: 'postpaid', label: 'Postpaid' }, { key: 'prepaid', label: 'Prepaid' }]}
                active={mode}
                onChange={setMode}
              />
            }
          >
            <dl>
              {financial.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
                  <dt className="text-fg">{r.label}</dt>
                  <dd className={`font-medium text-right ${r.red && r.value ? 'text-accent' : 'text-fg'}`}>{r.value ?? '-'}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel icon={IC.users} title="Contact Hierarchy" action={<LinkAction onClick={go('contact-identity')}>View Contacts</LinkAction>}>
            {contactRows.length === 0 ? (
              empty('No contacts on file for this customer.')
            ) : (
              <ul>
                {contactRows.map((c, i) => (
                  <li key={c.key} className="flex items-center gap-3 py-2 border-b border-border-soft last:border-0">
                    <IconTile icon={IC.user} tone={i === 0 ? 'blue' : i === 1 ? 'red' : 'purple'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-fg font-semibold text-[length:var(--fs-body)] break-words">{c.name}</div>
                      <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">{c.sub}</div>
                    </div>
                    {c.badge && <Pill tone="blue">{c.badge}</Pill>}
                    <Icon path={IC.chevRight} className="w-4 h-4 text-fg shrink-0" />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel icon={IC.history} title="Recent Milestones or Interactions" action={<LinkAction onClick={go('activities')}>View All</LinkAction>}>
            {milestones.length === 0 ? (
              empty('No activity on file for this customer.')
            ) : (
              <ul>
                {milestones.map((a) => {
                  const topic = str(a.topic) ?? '-';
                  const m = milestoneIcon(topic);
                  const { date, time } = fmtDateTime(a.transactionDate);
                  return (
                    <li key={String(a.activityNumber)}>
                      <button type="button" disabled={!goToTab} onClick={go('activities')} className="w-full flex items-center gap-3 py-2 border-b border-border-soft last:border-0 text-left text-[length:var(--fs-caption)] enabled:hover:bg-surface">
                        <span className="text-fg-2 w-24 shrink-0">{[date, time].filter(Boolean).join(' ') || '-'}</span>
                        <IconTile icon={m.icon} tone={m.tone} size="sm" />
                        <span className="text-fg text-[length:var(--fs-body)] flex-1 min-w-0 break-words">{topic}</span>
                        <span className="text-fg text-[length:var(--fs-body)] shrink-0 max-w-32 truncate">{str(a.orderId) ?? str(a.msisdn) ?? str(a.status) ?? '-'}</span>
                        <Icon path={IC.chevRight} className="w-4 h-4 text-fg shrink-0" />
                      </button>
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

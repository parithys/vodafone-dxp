import { defaultCreditLimitForSegment } from '../../../engines/hrnConfiguration';
import { creditSegmentOf, customerCategoryOf } from '../../../engines/creditLimit';
import { creditBreakdownOf } from '../creditLimitView';
import { isClosedTicket } from '../../../lib/statusTone';
import { isSimSwapAwaitingDecision } from '../../../engines/approvalAuthority';
import { isFixedLineOffer } from '../../../capabilities';
import { isBusinessSegment } from '../../../engines/businessSegment';
import { useState } from 'react';
import { QueryFlowCard } from '../queryFlow/QueryFlowCard';
import type { ReactNode } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { computeBillingSummary, type Customer360Data } from '../../../engines/customer360Engine';
import { groupServicesByCategory, isActiveService, type CustomerService } from '../../../engines/customerServicesEngine';
import { connectionTag } from '../../../lib/connectionType';
import { overdueTicketCount } from './accountInformationResolvers';
import { leadResolvers } from './leadResolvers';
import { IC, IconTile, KpiGrid, KpiTile, LinkAction, Panel, Pill, StatusPill, fmtDate, fmtDateTime, qar, toneFor } from './C360Kit';
import type { Tone } from './C360Kit';
import { RevealValue, useFieldAccess } from '../fieldAccess';
import { Dv } from '../demoValues';
import { strOrEmpty as str } from '../../../lib/values';
import { formatQar, formatQarAny } from '../../../lib/format';

type Rec = Record<string, unknown>;
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const dash = (v: ReactNode | undefined | null | '') => (v === undefined || v === null || v === '' ? '-' : v);

const isSuspended = (s: CustomerService) => /suspend/i.test(s.status ?? '');
// A service with no status of its own is read as active, the same convention the Telesales overview uses.
const isActive = isActiveService;

/** A label / value row; the value cell wraps and aligns right. */
function Row({ label, children, top }: { label: string; children: ReactNode; top?: boolean }) {
  const mode = useFieldAccess()(label);
  if (mode === 'hidden') return null;
  return (
    <div className={`flex justify-between gap-4 py-2 text-[length:var(--fs-body)] ${top ? 'items-start' : 'items-center'}`}>
      <span className="text-fg-2 shrink-0">{label}</span>
      <span className="text-fg font-medium text-right min-w-0 break-words">{mode === 'drill-down' ? <RevealValue>{children}</RevealValue> : children}</span>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-muted text-[length:var(--fs-body)] py-4 text-center">{children}</p>;
}

function Chevron() {
  return <Icon path={IC.chevRight} className="w-4 h-4 text-fg shrink-0" />;
}

interface OfferRow {
  icon: string;
  label: string;
  title: string;
  pill?: { text: string; tone: Tone; solid?: boolean };
}

interface FeedRow {
  at: unknown;
  title: string;
  sub: string;
  icon: string;
}

const TYPE_ICON: Record<CustomerService['category'], string> = {
  Postpaid: IC.mobile,
  Prepaid: IC.mobile,
  'GigaHome Fibre': IC.wifi,
  'GigaHome 5G': IC.wifi,
  'TV / Entertainment': IC.tv,
  'Fixed Line': IC.bars,
  'Smart Devices': IC.cpu,
  Other: IC.cpu,
};

export function C360Overview({ data, services, goToTab, onTicketCreated, queryFocus, hasTab }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void; onTicketCreated?: (ticket: Record<string, unknown>) => void; queryFocus?: number; hasTab?: (key: string) => boolean }) {
  const go = (key: string) => (goToTab ? () => goToTab(key) : undefined);
  const [copied, setCopied] = useState(false);

  const account = data.accounts[0];
  const { outstanding, latestBill, previousPayment } = computeBillingSummary(data);
  const billingProfile = data.billingProfiles[0];
  const extras = data.overviewExtras[0];
  const catalog = (data.demoCatalog[0] ?? {}) as Rec;
  const limits = creditBreakdownOf(data);

  // ---- KPIs
  const openTickets = data.tickets.filter((t) => !isClosedTicket(t.status)).length;

  // ---- Offers: real cross-sell offers first; the shared demo catalogue where the customer has none.
  const topCross = [...data.crossSalesOffers].sort((a, b) => str(a.priorityCode).localeCompare(str(b.priorityCode)))[0];
  const nextBest = topCross ? { name: str(topCross.offerName), badge: 'Recommended' } : arr<{ name: string; badge?: string }>(catalog.nextBestOffers)[0];
  const doi = data.deviceInstallments[0];
  const crossSell = arr<{ service: string; offer: string; eligibility?: string }>(catalog.crossSell);
  const fixedLine = data.crossSalesOffers.find(isFixedLineOffer);
  const fixedOffer = fixedLine ? str(fixedLine.offerName) : crossSell.find((c) => c.service === 'Fixed Line')?.offer;
  const additionalLine = crossSell.find((c) => c.service === 'Additional Line');
  const happy = arr<{ name: string; status?: string }>(catalog.additionalOpportunities).find((o) => /happy/i.test(o.name));
  const offers: OfferRow[] = [
    ...(nextBest ? [{ icon: IC.star, label: 'Next Best Offer', title: nextBest.name, pill: nextBest.badge ? { text: nextBest.badge, tone: 'red' as Tone, solid: true } : undefined }] : []),
    ...(extras?.eligibleDiscount ? [{ icon: IC.shield, label: 'Loyalty Discount', title: str(extras.eligibleDiscount).replace(/^Loyalty\s*/i, ''), pill: { text: 'Eligible', tone: 'green' as Tone } }] : []),
    ...(doi
      ? [
          {
            icon: IC.card,
            label: '',
            title: `${str(doi.deviceName)} - ${formatQarAny(str(doi.monthlyInstallmentQar))}/month`,
            pill: doi.eligibilityListMembership ? { text: str(doi.eligibilityListMembership), tone: toneFor(str(doi.eligibilityListMembership)) } : undefined,
          },
        ]
      : []),
    ...(fixedOffer ? [{ icon: IC.globe, label: '', title: fixedOffer, pill: { text: 'Fixed Line Offer', tone: 'grey' as Tone } }] : []),
    ...(additionalLine ? [{ icon: IC.bars, label: '', title: 'Add a Second Line', pill: { text: 'Cross-Sell', tone: 'grey' as Tone } }] : []),
    ...(happy ? [{ icon: IC.star, label: '', title: happy.name, pill: { text: 'Sales Enhancement', tone: 'grey' as Tone } }] : []),
  ];
  const activeOffers = offers.length;

  // ---- Recent activity: every dated event, newest first.
  const feed: FeedRow[] = [
    ...data.activities.map((a) => ({ at: a.transactionDate, title: str(a.topic ?? a.journey ?? 'Activity'), sub: str(a.comments), icon: IC.bars })),
    ...data.payments.map((p) => ({ at: p.capturedAt, title: 'Payment', sub: `${formatQarAny(str(p.amountQar))}${p.paymentMethod ? ` via ${str(p.paymentMethod)}` : ''}`, icon: IC.card })),
    ...data.orders.map((o) => ({ at: o.createdAt ?? o.orderDate, title: str(o.orderType ?? 'Order'), sub: `${str(o.orderId)} - ${str(o.status)}`, icon: IC.cart })),
    ...data.tickets.map((t) => ({ at: t.createdAt, title: 'Trouble Ticket', sub: `${str(t.ticketId)} - ${str(t.status)}`, icon: IC.headset })),
    ...data.simSwapOrders.map((s) => ({ at: s.createdAt ?? s.requestedAt, title: 'SIM Swap', sub: str(s.simSwapReason ?? s.status), icon: IC.refresh })),
  ]
    .filter((e) => e.at)
    .sort((a, b) => str(b.at).localeCompare(str(a.at)))
    .slice(0, 5);

  // ---- Alerts & Risks: only what the data supports.
  const dunning = str(billingProfile?.collectionStage);
  const dunningActive = Boolean(dunning) && !/^(none|no dunning|current)$/i.test(dunning);
  const overdueTickets = overdueTicketCount(data);
  const pendingSwaps = data.simSwapOrders.filter((s) => isSimSwapAwaitingDecision(s.status)).length;
  const alerts: { icon: string; tone: Tone; title: string; sub: string; level: string }[] = [
    ...(outstanding > 0 || dunningActive
      ? [{ icon: IC.alert, tone: 'red' as Tone, title: dunningActive ? `BP in Collection - ${dunning}` : 'Outstanding Balance', sub: outstanding > 0 ? `${formatQar(outstanding)} overdue` : 'Account in dunning', level: 'High' }]
      : []),
    ...(overdueTickets > 0 ? [{ icon: IC.clock, tone: 'red' as Tone, title: 'Pending Out of SLA Ticket', sub: `${overdueTickets} ticket${overdueTickets === 1 ? '' : 's'}`, level: 'High' }] : []),
    ...(str(extras?.aboutToBar).toLowerCase() === 'yes' ? [{ icon: IC.ban, tone: 'amber' as Tone, title: 'About to OG/IC Bar', sub: 'Barring pending on the account', level: 'Medium' }] : []),
    ...(pendingSwaps > 0 ? [{ icon: IC.swap, tone: 'amber' as Tone, title: 'Pending SIM Swap', sub: `${pendingSwaps} request${pendingSwaps === 1 ? '' : 's'}`, level: 'Medium' }] : []),
    data.customer.blacklisted
      ? { icon: IC.ban, tone: 'red' as Tone, title: 'Customer Blacklisted', sub: str(data.customer.blacklistReason) || 'Blacklist record on file', level: 'High' }
      : { icon: IC.shieldCheck, tone: 'green' as Tone, title: 'Customer Whitelisted', sub: 'No blacklist records', level: 'Clear' },
  ];

  // ---- Lead
  const lead = data.leads[0];
  const lr = (k: string) => (lead ? str(leadResolvers[k]?.(data)) : '');

  const copyAccount = () => {
    if (!account?.accountId) return;
    void navigator.clipboard?.writeText(account.accountId).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const isBusiness = isBusinessSegment(data.customer.segment);

  return (
    <div className="space-y-4">
      <QueryFlowCard data={data} services={services} onTicketCreated={onTicketCreated} focusSignal={queryFocus} goToTab={goToTab} hasTab={hasTab} />
      <KpiGrid cols={3}>
        <KpiTile icon={IC.users} tone="blue" label="Total Connections" value={services.length} chevron onClick={goToTab ? () => goToTab('products-services') : undefined} />
        <KpiTile icon={IC.shieldCheck} tone="green" label="Active Services" value={services.filter(isActive).length} chevron onClick={goToTab ? () => goToTab('products-services') : undefined} />
        <KpiTile icon={IC.swap} tone="red" label="Suspended Services" value={services.filter(isSuspended).length} chevron onClick={goToTab ? () => goToTab('products-services') : undefined} />
        <KpiTile icon={IC.card} tone="red" label="Total Due" value={qar(outstanding)} chevron onClick={goToTab ? () => goToTab('billing') : undefined} />
        <KpiTile icon={IC.layers} tone="purple" label="Active Offers" value={activeOffers} chevron onClick={goToTab ? () => goToTab('offers-leads') : undefined} />
        <KpiTile icon={IC.tag} tone="amber" label="Open Tickets" value={openTickets} chevron onClick={goToTab ? () => goToTab('tickets-support') : undefined} />
      </KpiGrid>

      <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-3 items-stretch">
        {/* Account Summary */}
        <Panel icon={IC.user} title="Account Summary" action={<LinkAction onClick={go('account-info')}>View Details</LinkAction>}>
          <div className="divide-y divide-border-soft">
            <Row label="Account Number">
              <span className="inline-flex items-center gap-2">
                {dash(account?.accountId)}
                {account?.accountId && (
                  <button type="button" onClick={copyAccount} aria-label="Copy account number" title={copied ? 'Copied' : 'Copy'} className="text-fg-2 hover:text-fg">
                    <Icon path={copied ? IC.check : IC.copy} className="w-4 h-4" />
                  </button>
                )}
              </span>
            </Row>
            <Row label="Account Name">
              {goToTab ? (
                <button type="button" onClick={() => goToTab('account-info')} className="inline-flex items-center gap-1 text-right text-link hover:underline">
                  {dash(data.customer.name)}
                  <Icon path={IC.chevRight} className="w-3.5 h-3.5 shrink-0" />
                </button>
              ) : (
                dash(data.customer.name)
              )}
            </Row>
            <Row label="Account Type">{dash(account?.accountType)}</Row>
            <Row label="Customer Type">{isBusiness ? 'Business' : 'Individual'}</Row>
            {/* Category: the customer scheme the record carries (Sawfa, Sawfa Plus); "-" for a customer on none. */}
            <Row label="Category">{dash((data.customer as { customerSubType?: string }).customerSubType)}</Row>
            <Row label="Segment">{dash(data.customer.segment)}</Row>
            {/* Derived from the nationality, centrally (engines/creditLimit): Qatari or Expat, and HRN or Non-HRN. */}
            <Row label="Customer Segment (Qatari / Expat)">{dash(creditSegmentOf(data.customer.nationality as string | undefined))}</Row>
            <Row label="Customer Category (HRN / Non-HRN)">{customerCategoryOf(data.customer.nationality as string | undefined)}</Row>
            <Row label="Credit Limit">{dash(qar(limits.overall ?? defaultCreditLimitForSegment(data.customer.segment)))}</Row>
            <Row label="Overall">{dash(qar(limits.overall ?? defaultCreditLimitForSegment(data.customer.segment)))}</Row>
            <Row label="Default">{dash(qar(limits.default))}</Row>
            <Row label="Credit Control Team">{limits.creditControl === null ? '-' : dash(qar(limits.creditControl))}</Row>
            <Row label="Credit Limit Increased Due to Deposit">{limits.depositIncrease ? dash(qar(limits.depositIncrease)) : '-'}</Row>
            <Row label="Account Status">{account?.status ? <StatusPill status={account.status} /> : '-'}</Row>
            <Row label="Customer Since"><Dv k="customerSince" /></Row>
          </div>
        </Panel>

        {/* Service Types: how many of each kind of connection the customer holds */}
        <Panel icon={IC.layers} title="Service Types" action={<LinkAction onClick={go('products-services')}>View Details</LinkAction>}>
          {services.length === 0 ? (
            <Empty>No connections on file.</Empty>
          ) : (
            <ul>
              {groupServicesByCategory(services).map(({ category, count }) => {
                const tag = connectionTag(category);
                const suspended = services.filter((s) => s.category === category && isSuspended(s)).length;
                return (
                  <li key={category} className="border-b border-border-soft last:border-0">
                    <button type="button" onClick={go('products-services')} disabled={!goToTab} className="flex items-center gap-3 py-2.5 w-full text-left enabled:hover:bg-surface">
                      <IconTile icon={TYPE_ICON[category]} tone={tag.tone} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-fg font-semibold text-[length:var(--fs-body)] break-words">{tag.label}</span>
                        <span className="block text-fg-2 text-[length:var(--fs-caption)]">
                          {count} {count === 1 ? 'service' : 'services'}
                          {suspended > 0 ? ` · ${suspended} suspended` : ''}
                        </span>
                      </span>
                      <span className="text-fg font-bold text-[length:var(--fs-body-lg)]">{count}</span>
                      <Chevron />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Billing & Payments */}
        <Panel icon={IC.card} title="Billing & Payments" action={<LinkAction onClick={go('billing')}>View Details</LinkAction>}>
          <div className="divide-y divide-border-soft">
            <Row label="Outstanding Amount">
              <span className={outstanding > 0 ? 'text-accent font-bold' : ''}>{qar(outstanding)}</span>
            </Row>
            <Row label="Due Date">
              <span className={outstanding > 0 ? 'text-accent font-bold' : ''}>{dash(fmtDate(latestBill?.dueDate))}</span>
            </Row>
            <Row label="Last Payment" top>
              {previousPayment ? (
                <span className="block">
                  {qar(previousPayment.amountQar)}
                  <span className="block text-fg-2 font-normal text-[length:var(--fs-caption)]">{dash(fmtDate(previousPayment.capturedAt))}</span>
                </span>
              ) : (
                '-'
              )}
            </Row>
            <Row label="Unbilled Usage">{dash(qar(latestBill?.currentChargesQAR))}</Row>
            <Row label="Latest Bill" top>
              {latestBill ? (
                <span className="block">
                  {qar(latestBill.totalAmount)}
                  <span className="block text-fg-2 font-normal text-[length:var(--fs-caption)]">{dash(fmtDate(`${str(latestBill.billPeriod)}-01`)?.replace(/^\d+ /, ''))}</span>
                </span>
              ) : (
                '-'
              )}
            </Row>
            <Row label="Bill Cycle">{dash(str(billingProfile?.billingCycle))}</Row>
            <Row label="PTP Eligible">{billingProfile?.promiseToPayStatus ? <StatusPill status={str(billingProfile.promiseToPayStatus)} /> : '-'}</Row>
          </div>
        </Panel>

        {/* Offers & Opportunities */}
        <Panel icon={IC.star} title="Offers & Opportunities" action={<LinkAction onClick={go('offers-leads')}>View All</LinkAction>}>
          {offers.length === 0 ? (
            <Empty>No offers on file.</Empty>
          ) : (
            <ul>
              {offers.map((o, i) => (
                <li key={`${o.label}${o.title}${i}`}>
                  <button type="button" onClick={go('offers-leads')} disabled={!goToTab} className="flex items-center gap-3 py-2.5 w-full text-left border-b border-border-soft last:border-0 enabled:hover:bg-surface">
                    <IconTile icon={o.icon} tone="grey" size="sm" />
                    <span className="min-w-0 flex-1">
                      {o.label && <span className="block text-fg-2 text-[length:var(--fs-caption)]">{o.label}</span>}
                      <span className="block text-fg font-medium text-[length:var(--fs-body)] break-words">{o.title}</span>
                    </span>
                    {o.pill && <Pill tone={o.pill.tone} solid={o.pill.solid}>{o.pill.text}</Pill>}
                    {o.pill?.tone !== 'grey' && <Chevron />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Recent Activity */}
        <Panel icon={IC.history} title="Recent Activity" action={<LinkAction onClick={go('activities')}>View All</LinkAction>}>
          {feed.length === 0 ? (
            <Empty>No recent activity.</Empty>
          ) : (
            <ul>
              {feed.map((e, i) => {
                const t = fmtDateTime(e.at);
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5 border-b border-border-soft last:border-0">
                    <span className="w-20 shrink-0 text-fg-2 text-[length:var(--fs-caption)] leading-snug">
                      {t.date}
                      {t.time && <span className="block">{t.time}</span>}
                    </span>
                    <IconTile icon={e.icon} tone="grey" size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-fg font-semibold text-[length:var(--fs-body)] break-words">{e.title}</span>
                      {e.sub && <span className="block text-fg-2 text-[length:var(--fs-caption)] break-words">{e.sub}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Lead Information */}
        <Panel icon={IC.clipboard} title="Lead Information" action={<LinkAction onClick={go('offers-leads')}>View Details</LinkAction>}>
          {lead ? (
            <div className="divide-y divide-border-soft">
              <Row label="Lead Type">{dash(lr('Lead Type'))}</Row>
              <Row label="MSISDN">{dash(lr('MSISDN'))}</Row>
              <Row label="Created By">{dash(lr('Created By'))}</Row>
              <Row label="Lead Status">{lr('Lead Status') ? <StatusPill status={lr('Lead Status')} /> : '-'}</Row>
              <Row label="Comments">{dash(lr('Comments'))}</Row>
              <Row label="Created On"><Dv k="leadCreatedOn" /></Row>
            </div>
          ) : (
            <Empty>No lead on file for this customer.</Empty>
          )}
        </Panel>

        {/* Alerts & Risks */}
        <Panel icon={IC.shield} title="Alerts & Risks" action={<LinkAction onClick={go('alerts-risks')}>View All</LinkAction>}>
          <ul>
            {alerts.map((a) => (
              <li key={a.title} className="flex items-center gap-3 py-2.5 border-b border-border-soft last:border-0">
                <IconTile icon={a.icon} tone={a.tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-fg font-medium text-[length:var(--fs-body)] break-words">{a.title}</span>
                  <span className="block text-fg-2 text-[length:var(--fs-caption)] break-words">{a.sub}</span>
                </span>
                <StatusPill status={a.level} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

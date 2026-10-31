import { CloseButton } from '../../../components/primitives/CloseButton';
import { overallCreditLimitOf } from '../creditLimitView';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Drawer } from '../../../capabilities';
import { Icon } from '../../../components/primitives/Icon';
import { Button } from '../../../components/primitives/Button';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { outstandingBalance } from '../../../engines/billingBalance';
import { isClosedTicket, orderBucket } from '../../../lib/statusTone';
import { IC, IconTile, Pill, StatusPill, fmtDate, qar } from '../sections/C360Kit';
import { previewFieldsFor, serviceTypeLabel } from './queryFlowModel';
import type { QueryIssue, QueryIssueCatalogue, TicketRouting } from './queryFlowModel';
import { DEFAULT_QUEUE } from '../../../data/reference/ticketReferenceData';

type Rec = Record<string, unknown>;
const NOT_ON_FILE = 'Not on file';
const text = (v: unknown): string | undefined => (v === undefined || v === null || v === '' ? undefined : String(v));

/** A contained section: icon + title header, optionally collapsible. */
function SectionCard({ icon, title, open = true, onToggle, children }: { icon: string; title: string; open?: boolean; onToggle?: () => void; children: ReactNode }) {
  const head = (
    <>
      <Icon path={icon} className="w-5 h-5 shrink-0 text-fg" />
      <h3 className="flex-1 min-w-0 text-fg font-semibold text-[length:var(--fs-body-lg)] text-left">{title}</h3>
      {onToggle && <Icon path={IC.chevDown} className={`w-4 h-4 shrink-0 text-fg-2 transition-transform ${open ? 'rotate-180' : ''}`} />}
    </>
  );
  return (
    <section className="card ">
      {onToggle ? (
        <button type="button" onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-card)] focus:outline-none focus-visible:shadow-[var(--focus-ring)]">
          {head}
        </button>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-3">{head}</div>
      )}
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}

/** One label / value row. Labels are always the secondary text colour; a missing value reads muted. */
function FieldRow({ label, value, strong = false, muted = false }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
      <dt className="text-fg">{label}</dt>
      <dd className={`min-w-0 break-words text-right ${muted ? 'text-muted' : strong ? 'text-fg font-semibold' : 'text-fg'}`}>{value}</dd>
    </div>
  );
}

/** Preview of what the agent should know before raising the ticket - every value read from the customer's own records. */
export function QueryPreviewModal({
  open,
  issue,
  serviceType,
  service,
  data,
  services,
  catalogue,
  onClose,
  onCloseInteraction,
  routing,
  onCreateTicket,
  onOpenTickets,
}: {
  open: boolean;
  issue: QueryIssue;
  serviceType: string;
  /** The selected MSISDN's service, when one was chosen. */
  service: CustomerService | undefined;
  data: Customer360Data;
  services: CustomerService[];
  catalogue: QueryIssueCatalogue;
  onClose: () => void;
  onCloseInteraction: () => void;
  /** The routing rule's result for this issue (queue and why), when there is one. */
  routing?: TicketRouting;
  /** Raises the ticket with this queue and the auto-stamped description. */
  onCreateTicket: (queue: string, description: string) => void | Promise<void>;
  /** Opens the Tickets & Support tab (the preview closes). */
  onOpenTickets: () => void;
}) {
  const account = data.accounts[0] as (Customer360Data['accounts'][number] & { barringStatus?: string; barringType?: string | null }) | undefined;
  const billingProfile = data.billingProfiles[0] as Rec | undefined;
  const creditLimit = data.creditLimits[0] as Rec | undefined;
  const balance = data.inPlatformBalances[0] as Rec | undefined;
  const engagement = data.digitalEngagement[0] as Rec | undefined;
  const contact = data.contacts[0] as Rec | undefined;

  const openTickets = data.tickets.filter((t) => !isClosedTicket(t.status));
  const openOrders = data.orders.filter((o) => orderBucket(o.status) === 'progress');
  const latestOrder = [...data.orders].sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))[0] as Rec | undefined;
  const latestPayment = [...data.payments].sort((a, b) => String(b.capturedAt ?? '').localeCompare(String(a.capturedAt ?? '')))[0] as Rec | undefined;
  const barring = account?.barringType ?? (account?.barringStatus === 'Not Barred' ? 'No' : text(account?.barringStatus));
  const balanceParts = [
    balance?.mainBalanceQAR != null ? qar(Number(balance.mainBalanceQAR)) : undefined,
    balance?.dataBalanceGB != null ? `${balance.dataBalanceGB} GB` : undefined,
    balance?.voiceBalanceMinutes != null ? `${balance.voiceBalanceMinutes} Mins` : undefined,
    balance?.smsBalanceCount != null ? `${balance.smsBalanceCount} SMS` : undefined,
  ].filter(Boolean);
  const limit = (v: unknown) => (v != null ? qar(Number(v)) : undefined);
  const date = (v: unknown) => (v ? fmtDate(v) : undefined);
  const yn = (b: boolean) => (b ? 'Yes' : 'No');
  const outstanding = outstandingBalance(data.bills, data.payments);

  // One resolver per Details field named in the categorization workbook. A field with no source in the customer's
  // records resolves to nothing and shows "Not on file" - nothing is invented.
  const resolve: Record<string, () => string | undefined> = {
    'Account Number': () => account?.accountId,
    'Plan Name': () => service?.label,
    MSISDN: () => service?.identifier,
    'Billing Profile': () => text(billingProfile?.billingType) ?? text(billingProfile?.name),
    'Surepay Balance (Data, SMS, Voice, Text, QR Balance)': () => (balanceParts.length ? balanceParts.join(' | ') : undefined),
    'Asset Barring including OG/IC Bar (Y/N)': () => barring,
    'Credit Limit': () => limit(overallCreditLimitOf(data) ?? billingProfile?.creditLimitQAR),
    'SIM State': () => (service ? (service.status ?? 'Active') : undefined),
    'Bill Limit': () => limit(overallCreditLimitOf(data) ?? creditLimit?.creditLimitQar ?? creditLimit?.creditLimitQAR),
    'In Progress Ticket (Y/N)': () => yn(openTickets.length > 0),
    'Open Order': () => yn(openOrders.length > 0),
    'Recent Payment amount & date': () => (latestPayment ? [qar(Number(latestPayment.amountQar)), date(latestPayment.capturedAt)].filter(Boolean).join(' on ') : undefined),
    'Last Recharge Date & Amount': () => (engagement?.lastRechargeAmountQar != null ? [qar(Number(engagement.lastRechargeAmountQar)), date(engagement.lastRechargeAt)].filter(Boolean).join(' on ') : undefined),
    'Recent Order': () => text(latestOrder?.orderId),
    'Recent Order Created By': () => text(latestOrder?.createdBy),
    'Recent Order Created On': () => date(latestOrder?.createdAt),
    'Recent Order Type': () => [text(latestOrder?.orderType), text(latestOrder?.orderSubType)].filter(Boolean).join(' / ') || undefined,
    'Open Order Type (PYN, FNP, Home Move, Plan Change, Device Replacement, Add-ons, Subscription)': () => openOrders.map((o) => text(o.orderType)).filter(Boolean).join(', ') || undefined,
    'App Version': () => text(engagement?.appVersion),
    'App Last/Recent Login Date & Time': () => (engagement?.appLastLoginAt ? date(engagement.appLastLoginAt) : undefined),
    'Preferred Language': () => text(contact?.preferredLanguage),
    Nationality: () => text(contact?.nationality ?? data.customer.nationality),
    'QID Number': () => (contact?.idType === 'QID' ? text(contact.idNumber) : undefined),
    // Prepaid + postpaid connections only: not the fibre, TV or device services in the same list.
    'Total Number of Connections Prepaid + Postpaid': () => String(services.filter((s) => s.category === 'Prepaid' || s.category === 'Postpaid').length),
    'Total Outstanding Amount': () => (outstanding > 0 ? qar(outstanding) : data.bills.length ? 'QAR 0' : undefined),
    'Reason for Blacklist': () => (data.customer.blacklisted ? text(data.customer.blacklistReason) : undefined),
    'Previous Mobile Tickets (Last 3 Months)': () => String(data.tickets.filter((t) => /mobile/i.test(String(t.category ?? ''))).length),
    'Previous Fixed Tickets (Last 3 Months)': () => String(data.tickets.filter((t) => /fixed/i.test(String(t.category ?? ''))).length),
  };
  const fields = previewFieldsFor(catalogue, issue.category, serviceType);
  const summary = [
    { label: 'Query Issue', value: issue.name },
    { label: 'Query Category', value: issue.category ?? 'Category pending' },
    { label: 'Query Service Type', value: serviceTypeLabel(serviceType) },
  ];
  const rows = fields.map((f) => ({ label: f, value: resolve[f]?.() }));
  // Additional Details sub-groups. A field the workbook lists that fits none of them falls under "Other Details".
  const GROUPS: { title: string; match: RegExp }[] = [
    { title: 'Account & Plan', match: /^(Account Number|Plan Name|MSISDN|SIM State|Billing Profile)$/ },
    { title: 'Limits & Balance', match: /^(Credit Limit|Bill Limit|Surepay Balance|Advance Credit Taken)/ },
    { title: 'Recent Activity', match: /^(In Progress Ticket|Recent OOB Charge|Recent Payment|Last Recharge)/ },
  ];
  const grouped = [...GROUPS.map((g) => ({ title: g.title, rows: rows.filter((r) => g.match.test(r.label)) })), { title: 'Other Details', rows: rows.filter((r) => !GROUPS.some((g) => g.match.test(r.label))) }].filter((g) => g.rows.length > 0);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  // The routing rule picks the team where it has one; every other issue goes to the general complaints team.
  const queue = routing?.queue ?? DEFAULT_QUEUE;
  // Auto-stamped ticket description: the query and every detail the preview shows that has a value.
  const description = [...summary, ...rows.filter((r) => r.value !== undefined).map((r) => ({ label: r.label, value: r.value as string }))].map((r) => `${r.label}: ${r.value}`).join('\n');
  const recentTickets = openTickets.slice(0, 3);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Preview Details"
      header={
        <div className="flex items-start gap-3 px-6 py-4 border-b border-border-soft shrink-0">
          <IconTile icon={IC.phone} tone="red" />
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="text-fg font-semibold text-[length:var(--fs-h5)] break-words">{issue.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Pill tone="blue">{serviceTypeLabel(serviceType)}</Pill>
              {issue.category && <Pill tone={/network/i.test(issue.category) ? 'red' : 'purple'}>{issue.category}</Pill>}
            </div>
          </div>
          <CloseButton onClick={onClose} />
        </div>
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-end gap-3">
          {/* The ticket is auto-assigned to the responsible team, so there is nothing for the agent to choose. */}
          {routing?.queue && <span className="mr-auto text-fg-2 text-[length:var(--fs-caption)]">{routing.queue}: {routing.basis}</span>}
          <Button variant="secondary" onClick={onCloseInteraction}>
            Close Interaction
          </Button>
          <Button
            variant="primary"
            disabled={creating}
            onClick={async () => {
              setCreating(true);
              await onCreateTicket(queue, description);
              setCreating(false);
            }}
          >
            Create Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-6" data-coverage-ignore>
        <SectionCard icon={IC.info} title="Query Summary">
          <dl>
            {summary.map((r) => (
              <FieldRow key={r.label} label={r.label} value={r.value} strong />
            ))}
          </dl>
        </SectionCard>

        <SectionCard icon={IC.headset} title={`Recent Tickets (${openTickets.length})`}>
          {recentTickets.length === 0 ? (
            <p className="text-muted text-[length:var(--fs-body)] py-2">No Recent Tickets</p>
          ) : (
            <ul>
              {recentTickets.map((t) => (
                <li key={String(t.ticketId)} className="border-b border-border-soft last:border-0">
                  <button
                    type="button"
                    onClick={onOpenTickets}
                    aria-label={`Open ${String(t.ticketId)} in Tickets & Support`}
                    className="w-full flex items-center gap-3 py-2.5 text-left text-[length:var(--fs-body)] rounded-[var(--radius-sm)] focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
                  >
                    <span className="text-fg font-semibold shrink-0">{String(t.ticketId)}</span>
                    <span className="flex-1 min-w-0 truncate text-fg-2">{text(t.actualIssue) ?? text(t.category)}</span>
                    <StatusPill status={String(t.status)} />
                    <Icon path={IC.chevRight} className="w-4 h-4 text-fg shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard icon={IC.clipboard} title="Additional Details" open={detailsOpen} onToggle={() => setDetailsOpen((o) => !o)}>
          <div className="space-y-4">
            {grouped.map((g) => (
              <div key={g.title}>
                <h4 className="text-fg font-semibold text-[length:var(--fs-caption)] mb-1">{g.title}</h4>
                <dl>
                  {g.rows.map((r) => (
                    <FieldRow key={r.label} label={r.label} value={r.value ?? NOT_ON_FILE} muted={r.value === undefined} />
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Drawer>
  );
}

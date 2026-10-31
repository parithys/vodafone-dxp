import { isClosedTicket, isTonPending } from '../../../lib/statusTone';
import { overallCreditLimitOf } from '../creditLimitView';
import type { ReactNode } from 'react';
import { DataTable } from '../../../components/primitives/DataTable';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { OrdersSection } from './OrdersSection';
import { TicketsSection } from './TicketsSection';
import { AccountHierarchySection } from './AccountHierarchySection';
import { ProductsAssetsSection } from './MiscSections';
import { formatAmountAny } from '../../../lib/format';

export interface AccountInfoContext {
  data: Customer360Data;
  services: CustomerService[];
}

type Resolver = (ctx: AccountInfoContext) => ReactNode | undefined;

// Same fixed session date customer360Engine.ts uses for its own "is this
// bill within the last 12 months" window (SESSION_TODAY) - this app has no
// live clock-driven billing/SLA cycle, so "overdue" is computed against
// that same frozen date rather than the real Date.now().
const SESSION_TODAY = new Date(2026, 8, 14); // 2026-09-14
const ADJUSTMENT_TERMINAL_STATUSES = new Set(['Approved', 'Rejected', 'Failed']);

function last(n: number, rows: Record<string, unknown>[], dateKey: string) {
  return [...rows].sort((a, b) => String(b[dateKey] ?? '').localeCompare(String(a[dateKey] ?? ''))).slice(0, n);
}

/** Open tickets already past their SLA due date - shared by the Overdue TT field and the profile header. */
export function overdueTicketCount(data: Customer360Data): number {
  return data.tickets.filter(
    (t) => !isClosedTicket(t.status) && t.slaDueAt && new Date(String(t.slaDueAt)) < SESSION_TODAY
  ).length;
}

/** customer360-fields.json's Account Information topic, resolved against
 * real Customer 360 data. Keys are the field's exact `details` string from
 * the source JSON. */
export const accountInformationResolvers: Record<string, Resolver> = {
  'AM name': ({ data }) => data.accounts[0]?.accountManagerName,
  'AM mobile': ({ data }) => data.accounts[0]?.accountManagerMobile,
  'AM Email': ({ data }) => data.accounts[0]?.accountManagerEmail,
  // No matching field exists - accounts.json carries a backup-AM NAME
  // (backupAccountManagerName), not an email. Left out of this map
  // entirely so TopicFieldsSection renders the honest "Not available" state.
  'Availability/escalation contact': ({ data }) => data.accounts[0]?.escalationContact,
  'Primary MSISDN': ({ data }) => data.customer.phone,
  Segment: ({ data }) => data.customer.segment,
  'Service Type Number of Connections (Total Per Account + Total Per Plan Type)': ({ services }) => {
    if (services.length === 0) return undefined;
    const byCategory = new Map<string, number>();
    for (const s of services) byCategory.set(s.category, (byCategory.get(s.category) ?? 0) + 1);
    return `${services.length} total - ${Array.from(byCategory.entries()).map(([c, n]) => `${c}: ${n}`).join(', ')}`;
  },
  'Billing Email ID (It should show all the email Ids which are marked for Billing Recipient)': ({ data }) =>
    data.billingProfiles[0]?.billingContactEmail as string | undefined,
  'Current Dunning Stage': ({ data }) => data.billingProfiles[0]?.collectionStage as string | undefined,
  'Overdue TT': ({ data }) => {
    const overdue = overdueTicketCount(data);
    return overdue > 0 ? `${overdue} overdue (past SLA)` : '0 overdue';
  },
  'Special Management': ({ data }) => (data.accounts[0] as unknown as { specialManagement?: string } | undefined)?.specialManagement,
  // Count summaries for the fields whose detail is a table (shown on the tile;
  // the table itself opens inline on click - see TopicFieldsSection).
  'All Orders': ({ data }) => (data.orders.length > 0 ? `${data.orders.length} order${data.orders.length === 1 ? '' : 's'}` : undefined),
  'Last 5 Orders': ({ data }) => (data.orders.length > 0 ? `Latest: ${last(1, data.orders, 'orderId')[0]?.orderId as string} (${last(1, data.orders, 'orderId')[0]?.status as string})` : undefined),
  'All Trouble Tickets': ({ data }) => `${data.tickets.length} ticket${data.tickets.length === 1 ? '' : 's'}`,
  'All Billing Profiles': ({ data }) => (data.billingProfiles.length > 0 ? `${data.billingProfiles.length} profile${data.billingProfiles.length === 1 ? '' : 's'}` : undefined),
  'Installed Assets': ({ data }) => (data.installedAssets.length > 0 ? `${data.installedAssets.length} asset${data.installedAssets.length === 1 ? '' : 's'}` : undefined),
  'Contact Hierarchy': ({ data }) => (data.contacts.length > 0 ? `${data.contacts.length} contact${data.contacts.length === 1 ? '' : 's'}` : undefined),
  'Pending TON requests': ({ data }) => `${data.tonCases.filter((t) => isTonPending(t.status)).length} pending`,
  'Pending Adjustments': ({ data }) => `${data.adjustments.filter((a) => !ADJUSTMENT_TERMINAL_STATUSES.has(String(a.status))).length} pending`,
  'Pending Sim swap': ({ data }) => `${data.simSwapOrders.filter((s) => String(s.status).includes('Pending')).length} pending`,
  'Activity (last 5)': ({ data }) => (data.activities.length > 0 ? `${Math.min(5, data.activities.length)} most recent` : undefined),
  'Credit Limit': ({ data }) => {
    const cl = data.creditLimits[0];
    if (!cl) return undefined;
    return `${formatAmountAny(String(overallCreditLimitOf(data) ?? cl.creditLimitQar ?? cl.creditLimitQAR ?? '-'))} QAR`;
  },
};

/** Fields whose spec value is itself a list/action surface - rendered
 * full-width via TopicFieldsSection's `richFields`, not squeezed into a
 * flat label/value row. Built per-call (needs live `data`/callbacks), so
 * this is a function rather than a static map like the resolvers above. */
export function accountInformationRichFields({
  data,
  onTicketCreated,
  expandAll = false,
}: {
  data: Customer360Data;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
  /** Show nested detail open, with no expand / collapse controls. */
  expandAll?: boolean;
}): Record<string, ReactNode> {
  const pendingAdjustments = data.adjustments.filter((a) => !ADJUSTMENT_TERMINAL_STATUSES.has(String(a.status)));
  const pendingSimSwaps = data.simSwapOrders.filter((s) => String(s.status).includes('Pending'));
  const pendingTon = data.tonCases.filter((t) => isTonPending(t.status));

  return {
    'Account Hierarchy': <AccountHierarchySection data={data} expandAll={expandAll} />,
    'Contact Hierarchy': (
      <DataTable
        rows={data.contacts}
        rowKey={(r) => String(r.contactRecordId)}
        emptyMessage="No contacts on file for this customer."
        columns={[
          { key: 'firstName', header: 'First Name' },
          { key: 'middleName', header: 'Middle Name' },
          { key: 'lastName', header: 'Last Name' },
          { key: 'idType', header: 'ID Type' },
        ]}
      />
    ),
    'Recent Milestones or Interactions (including all recent purchases add-on, Plan change, activation, change done to MSISDN, account, ticket or activity)':
      (
        <DataTable
          rows={last(5, data.activities, 'transactionDate')}
          rowKey={(r) => String(r.activityNumber)}
          emptyMessage="No activity on file for this customer."
          columns={[
            { key: 'transactionDate', header: 'Date' },
            { key: 'topic', header: 'Topic' },
            { key: 'comments', header: 'Comments' },
          ]}
        />
      ),
    // Full OrdersSection, not a flat table - keeps the existing click-through
    // to order detail rather than demoting it to read-only text.
    'All Orders': <OrdersSection data={data} />,
    'Last 5 Orders': (
      <OrdersSection data={{ ...data, orders: last(5, data.orders, 'orderId') }} />
    ),
    // Full TicketsSection, not a flat table - keeps Create Ticket reachable
    // from the one field the spec actually names it under.
    'All Trouble Tickets': <TicketsSection data={data} onTicketCreated={onTicketCreated} />,
    'All Billing Profiles': (
      <DataTable
        rows={data.billingProfiles}
        rowKey={(r) => String(r.billingProfileId)}
        emptyMessage="No billing profiles on file for this customer."
        columns={[
          { key: 'name', header: 'Profile' },
          { key: 'billingCycle', header: 'Cycle' },
          { key: 'collectionStatus', header: 'Collection Status' },
        ]}
      />
    ),
    'Installed Assets': <ProductsAssetsSection data={data} />,
    'Pending TON requests': (
      <DataTable
        rows={pendingTon}
        rowKey={(r) => String(r.id)}
        emptyMessage="No pending transfer-of-ownership requests for this customer."
        columns={[
          { key: 'id', header: 'TON #' },
          { key: 'type', header: 'Type' },
          { key: 'currentQueue', header: 'Current Queue' },
          { key: 'status', header: 'Status' },
        ]}
      />
    ),
    'Pending Adjustments': (
      <DataTable
        rows={pendingAdjustments}
        rowKey={(r) => String(r.adjustmentId)}
        emptyMessage="No pending adjustments for this customer."
        columns={[
          { key: 'reason', header: 'Reason' },
          { key: 'amount', header: 'Amount' },
          { key: 'status', header: 'Status' },
        ]}
      />
    ),
    'Pending Sim swap': (
      <DataTable
        rows={pendingSimSwaps}
        rowKey={(r) => String(r.simSwapOrderId)}
        emptyMessage="No pending SIM swaps for this customer."
        columns={[
          { key: 'msisdn', header: 'MSISDN' },
          { key: 'simSwapReason', header: 'Reason' },
          { key: 'status', header: 'Status' },
        ]}
      />
    ),
    'Activity (last 5)': (
      <DataTable
        rows={last(5, data.activities, 'transactionDate')}
        rowKey={(r) => String(r.activityNumber)}
        emptyMessage="No activity on file for this customer."
        columns={[
          { key: 'transactionDate', header: 'Date' },
          { key: 'topic', header: 'Topic' },
          { key: 'comments', header: 'Comments' },
        ]}
      />
    ),
  };
}

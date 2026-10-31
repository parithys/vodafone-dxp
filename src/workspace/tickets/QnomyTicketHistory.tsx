import { badgeVariantFor } from '../../lib/statusTone';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedRowsNotice } from '../../components/patterns/RestrictedRowsNotice';
import { useEffect, useMemo, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { mobileMatches, purposeOfVisit } from '../../engines/qnomyQueueEngine';
import { DataTable } from '../../components/primitives/DataTable';
import type { Column } from '../../components/primitives/DataTable';
import { Badge } from '../../components/primitives/Badge';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import { SegmentedTabs } from '../../components/primitives/SegmentedTabs';
import { PageHeader } from '../../components/patterns/PageHeader';

interface QTicketHistoryRecord {
  qTicketId: string;
  kioskMobileNumber: string | null;
  customerId: string | null;
  journeyCode: string | null;
  queueName: string | null;
  status: string;
  handledByUserId: string | null;
  releasedAt: string | null;
  taskType?: string | null;
}

interface CustomerLite {
  customerId: string;
  name: string;
  phone?: string;
}

// The ticket PLUS the customer facts resolved for it, computed once per row.
//
// Not a `render` callback on the DataTable column, which was the first
// version of this: DataTable's own column renderer gives `render` absolute
// priority over `linkTo` on the same column (see DataTable.tsx - `render` is
// checked first and short-circuits the link branch entirely), so a column
// defining both silently loses its link. Precomputing the name and the
// customer id it should link to - as plain fields DataTable can read directly
// off the row - is what lets the Customer Name column use `linkTo` at all.
interface DisplayRow extends QTicketHistoryRecord {
  customerName: string;
  customerLinkId?: string;
}

// Local, matching eligibilityEngine.ts's own private formatDate - this
// codebase's one existing precedent for a date formatter keeps it unexported
// and per-file rather than centralised, so a second one for this page
// follows the same shape rather than introducing a new convention.
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Same local getters as the two formatters above, deliberately - if a
// ticket's release time is DISPLAYED using the viewer's local date parts, it
// must be FILTERED using those same parts, or a row could show "27/09/2026"
// while being excluded from "Today" because a UTC comparison disagreed.
function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Stable identity for "not loaded yet", so the useMemo chains below don't
// invalidate every render on a fresh `?? []` literal before the entity store
// has anything to give them - the store fallback is here rather than at each
// call site because both `tickets` and `customers` need the exact same fix.
const EMPTY: never[] = [];

// The Qnomy Ticket History page - what the "Customers Served" counter in the
// top bar links to (PersonaSwitcher.tsx). That pill answered "how many", with
// nowhere to go to see WHICH ones; this is that destination.
//
// A direct top-level route (see router.tsx), not a registered product-line
// screen - the same family as /tasks and /profile, reached from a header
// control rather than the sidebar or a journey card. See
// feature-catalogue.json's workspace.qnomy-ticket-history entry, which
// carries no screenIds for the same reason those two don't.
//
// Scoped to the LOGGED-IN AGENT, not the active persona - a role can be
// switched mid-session without the person behind it changing, and it is the
// agent's own servicing history this page shows. See SessionReferenceNumbers'
// handleFinish/handleAbandon for where handledByUserId is written; it is
// never cleared once set, unlike agentInDxpSessionId, which still nulls on
// release because it answers a different, session-scoped question.
export function QnomyTicketHistory() {
  const staffUserId = useAuthStore((s) => s.profile?.userId) ?? null;
  const tickets = (useEntityStore((s) => s.records.qtickets) ?? EMPTY) as unknown as QTicketHistoryRecord[];
  const customers = (useEntityStore((s) => s.records.customers) ?? EMPTY) as unknown as CustomerLite[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const loading = useEntityStore((s) => s.loading.qtickets);
  const loadError = useEntityStore((s) => s.errors.qtickets);

  const [view, setView] = useState<'today' | '30days'>('today');

  useEffect(() => {
    loadKind('qtickets');
    loadKind('customers');
  }, [loadKind]);

  // MY released tickets only - Waiting/Fed-to-Agent rows have no releasedAt
  // yet (they are the live queue, not history) and a ticket someone ELSE
  // handled has a different handledByUserId. Newest release first: the
  // agent's most recent interaction is what they are most likely checking on.
  //
  // Customer name/link resolved HERE, once per ticket, rather than in a
  // column `render` - see DisplayRow's own note on why that matters for
  // `linkTo`. "Unknown Customer", not "Not on file": every row here already
  // went through a real interaction (it was released, not merely queued), so
  // the only reason a number resolves to nobody is that it was never a
  // Vodafone number - the same fallback the assignment toast uses for the
  // identical case (SessionReferenceNumbers' ticketToastRows).
  const mine = useMemo<DisplayRow[]>(
    () =>
      tickets
        .filter((t) => t.handledByUserId === staffUserId && t.releasedAt)
        .sort((a, b) => String(b.releasedAt).localeCompare(String(a.releasedAt)))
        .map((t) => {
          const matched = t.kioskMobileNumber ? customers.find((c) => mobileMatches(t.kioskMobileNumber, c.phone)) : undefined;
          return { ...t, customerName: matched?.name ?? 'Unknown Customer', customerLinkId: matched?.customerId };
        }),
    [tickets, customers, staffUserId]
  );
  // A ticket whose customer is in a protected segment this role may not see is left out (and counted), never drawn: nothing is shown until the
  // customers are known.
  const guard = useRestrictedCustomers();
  const { visible: myHistory, hiddenCount } = useMemo(() => guard.filter(mine, (t) => t.customerLinkId), [guard, mine]);

  const now = useMemo(() => new Date(), []);
  const todayRows = useMemo(
    () => myHistory.filter((t) => isSameCalendarDay(new Date(t.releasedAt!), now)),
    [myHistory, now]
  );
  // Last 30 Days INCLUDES today, matching the ordinary reporting convention
  // (a "last 30 days" report that excluded today would be a strange one) -
  // this is deliberately the broader superset of todayRows, not a disjoint
  // "everything except today" bucket.
  const last30Rows = useMemo(
    () => myHistory.filter((t) => now.getTime() - new Date(t.releasedAt!).getTime() <= THIRTY_DAYS_MS),
    [myHistory, now]
  );

  const columns: Column<DisplayRow>[] = [
    { key: 'qTicketId', header: 'Ticket Number' },
    {
      key: 'customerName',
      header: 'Customer Name',
      // No `render` on this one - see DisplayRow's note. Plain field +
      // linkTo is what lets DataTable's own Link branch fire.
      linkTo: (t) => (t.customerLinkId ? `/customer/${t.customerLinkId}` : undefined),
    },
    {
      key: 'taskType',
      header: 'Interaction / Task Type',
      render: (t) => purposeOfVisit(t),
      sortValue: (t) => purposeOfVisit(t),
    },
    { key: 'date', header: 'Date', render: (t) => formatDate(t.releasedAt!), sortValue: (t) => t.releasedAt ?? '' },
    { key: 'time', header: 'Time', render: (t) => formatTime(t.releasedAt!), sortValue: (t) => t.releasedAt ?? '' },
    {
      key: 'status',
      header: 'Ticket Status',
      render: (t) => <Badge variant={badgeVariantFor(t.status)}>{t.status}</Badge>,
    },
  ];

  const table = (rows: DisplayRow[], emptyMessage: string) => (
    <DataTable<DisplayRow>
      columns={columns}
      rows={rows}
      rowKey={(t) => t.qTicketId}
      emptyMessage={emptyMessage}
      loading={loading || !guard.ready}
    />
  );

  // Today / Last 30 Days narrows the same ticket list, so it is a filter: the pill switcher, not the tab strip.
  const views = [
    { key: 'today' as const, label: `Today's Tickets (${todayRows.length})` },
    { key: '30days' as const, label: `Last 30 Days (${last30Rows.length})` },
  ];

  return (
    <div className="p-8">
      <PageHeader title={<>My Ticket History</>} description={<>
        Qnomy queue tickets you have completed or abandoned. Defaults to today; switch to Last 30 Days for the
        fuller record.
      </>} />
      <ErrorBanner message={loadError} />
      <RestrictedRowsNotice count={hiddenCount} />
      <SegmentedTabs items={views} active={view} onChange={setView} label="Ticket Period" />
      <div className="pt-4">
        {view === 'today' ? table(todayRows, 'No tickets handled today yet.') : table(last30Rows, 'No tickets handled in the last 30 days.')}
      </div>
    </div>
  );
}

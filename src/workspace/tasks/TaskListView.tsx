import { badgeVariantFor } from '../../lib/statusTone';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedRowsNotice } from '../../components/patterns/RestrictedRowsNotice';
import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/primitives/DataTable';
import { Badge } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { isVisibleToAgent } from '../../engines/agentTaskEngine';
import { PageHeader } from '../../components/patterns/PageHeader';
import { formatDateTime } from '../../lib/format';
import { STAR } from '../../assets/icons';

interface AgentTask {
  taskId: string;
  taskName: string;
  taskType: string;
  taskStatus: string;
  priorityFlag: boolean;
  assignedAgentId: string | null;
  createdAt: string;
  /** When the task last changed; falls back to createdAt for tasks that have not changed since they were made. */
  updatedAt?: string;
  /** Set on a Draft Order task whose order is stored - see orders.json. */
  relatedOrderId?: string;
  /** The comment the agent entered when saving the order as a draft. */
  draftComment?: string;
  customerId?: string;
}

/** The fields a Draft Order row needs to resume into its journey. */
interface DraftOrder {
  orderId: string;
  status: string;
  draftResumePath?: string;
  customerId?: string;
}

/** The work item's own name: the task names read "<customer> – <work>", and the customer has its own column. */
const workOf = (t: AgentTask) => (t.taskName.includes(' – ') ? t.taskName.split(' – ').slice(1).join(' – ') : t.taskName);
const lastUpdated = (t: AgentTask) => t.updatedAt ?? t.createdAt;
const formatWhen = (iso: string) => formatDateTime(iso);

const FILTER_LABELS: Record<string, string> = {
  open: 'Open Tasks',
  'in-progress': 'In Progress Tasks',
  payments: 'Pending Payments',
  priority: 'Priority Tasks',
  'draft-orders': 'Draft Orders',
};

// Agent 360 ATV-01/04: the task dashboard's 5 category tiles drill into this
// filtered list; selecting a row opens the task detail (ATV-04). Filtering
// logic mirrors Dashboard.tsx's tile counts exactly - see that file's
// comment on how the 5 BRSD categories map onto taskStatus/taskType/
// priorityFlag, since the BRSD itself leaves the derivation open (OI-AGN-14/18).
export function TaskListView() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const filter = params.get('filter') ?? 'open';
  const tasks = (useEntityStore((s) => s.records.tasks) ?? []) as unknown as AgentTask[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const loading = useEntityStore((s) => s.loading.tasks);
  const loadError = useEntityStore((s) => s.errors.tasks);
  const currentAgentId = useAuthStore((s) => s.profile?.userId);

  // Orders too, so a Draft Order row knows where its journey resumes. Read
  // from the store the rest of this screen already uses rather than a separate
  // fetch, so the row click has the path in hand and does not have to await
  // anything mid-navigation.
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as DraftOrder[];
  const draftOrders = Object.fromEntries(
    orders.filter((o) => o.status === 'Draft').map((o) => [o.orderId, o])
  );

  // Where a task leads: a Draft Order RESUMES its journey; every other task opens its detail view. Falls back to task
  // detail when the task carries no related order (TASK-70006 is a GigaHome draft with no seeded fixed-line order, and
  // sending it into a postpaid journey would resume something it is not about). The row and its Task ID link share it.
  const destinationOf = (t: AgentTask): { to: string; state?: { resumeOrderId: string } } => {
    const order = t.relatedOrderId ? draftOrders[t.relatedOrderId] : undefined;
    return order?.draftResumePath ? { to: order.draftResumePath, state: { resumeOrderId: order.orderId } } : { to: `/tasks/${t.taskId}` };
  };

  // The customer a task is about comes from its related order; tasks without one show a dash.
  const customers = (useEntityStore((s) => s.records.customers) ?? []) as unknown as { customerId: string; name: string }[];
  // A task list only ever holds the signed-in agent's own tasks, so there is no assignee column: a saved draft shows the comment its agent left.
  const customerNameOf = (t: AgentTask) => {
    const id = t.relatedOrderId ? orders.find((o) => o.orderId === t.relatedOrderId)?.customerId : undefined;
    return customers.find((c) => c.customerId === id)?.name;
  };

  useEffect(() => {
    // Read fresh: a draft saved a moment ago (its comment, its time) is already in the engine.
    loadKind('tasks', true);
    loadKind('orders', true);
    loadKind('customers');
    loadKind('users-agents');
  }, [loadKind]);

  // ATV-02 - see Dashboard.tsx's tile counts for the same rule; kept
  // consistent via the shared isVisibleToAgent() predicate.
  const openTasks = tasks
    .filter((t) => t.taskStatus !== 'Closed')
    .filter((t) => isVisibleToAgent(t.assignedAgentId, currentAgentId));
  const unfiltered = {
    open: openTasks.filter((t) => t.taskStatus === 'Open'),
    'in-progress': openTasks.filter((t) => t.taskStatus === 'In Progress'),
    payments: openTasks.filter((t) => t.taskType === 'Payment'),
    priority: openTasks.filter((t) => t.priorityFlag),
    'draft-orders': openTasks.filter((t) => t.taskType === 'Draft Order'),
  }[filter] ?? openTasks;
  // A task about a customer in a protected segment this role may not see is left out (and counted): by the customer of its related order, or
  // a customer named in the task's own name. Nothing is listed until the customers are known.
  const guard = useRestrictedCustomers();
  const { visible: guarded, hiddenCount } = guard.exclude(unfiltered, (t) => {
    const customerId = t.customerId ?? (t.relatedOrderId ? orders.find((o) => o.orderId === t.relatedOrderId)?.customerId : undefined);
    return guard.isRestricted(customerId) || guard.mentionsRestricted(t.taskName);
  });
  // Most recently updated first. This is the list's default order; a column header still re-sorts it, and a third click returns here.
  const filtered = [...guarded].sort((a, b) => Date.parse(lastUpdated(b)) - Date.parse(lastUpdated(a)));

  return (
    <div className="p-8">
      <PageHeader title={<>{FILTER_LABELS[filter] ?? 'My Tasks'}</>} description={<>{filtered.length} task(s).</>} />
      <ErrorBanner message={loadError} />
      <RestrictedRowsNotice count={hiddenCount} />
      <DataTable<AgentTask>
        columns={[
          {
            key: 'taskId',
            header: 'Task ID',
            // A left gutter holds the priority star, so flagged and unflagged IDs - and the header - share one left edge.
            cellClassName: '!pl-10',
            render: (t) => (
              <span className="relative inline-block">
                {/* The priority star hangs in the cell's left padding, so every Task ID - flagged or not - starts at the
                    same x as the column header. */}
                {t.priorityFlag && (
                  <span title="Priority" aria-label="Priority" className="priority-marker">
                    <Icon path={STAR} className="size-3.5 fill-current" />
                  </span>
                )}
                <Link
                  to={destinationOf(t).to}
                  state={destinationOf(t).state}
                  onClick={(e) => e.stopPropagation()}
                  className="link font-medium"
                >
                  {t.taskId}
                </Link>
              </span>
            ),
          },
          { key: 'taskName', header: 'Task Name', render: (t) => <span>{workOf(t)}</span>, sortValue: workOf },
          {
            key: 'customerName',
            header: 'Customer Name',
            // From the task's order when it has one; failing that, from the "<customer> – <work>" name (a draft started
            // before the customer was identified reads "New Customer", which is not a customer).
            render: (t) => {
              const named = t.taskName.includes(' – ') ? t.taskName.split(' – ')[0] : undefined;
              return <span>{customerNameOf(t) ?? (named && named !== 'New Customer' ? named : '-')}</span>;
            },
            sortValue: (t) => customerNameOf(t) ?? '',
          },
          { key: 'updatedAt', header: 'Last Updated', render: (t) => <span>{formatWhen(lastUpdated(t))}</span>, sortValue: lastUpdated },
          {
            key: 'taskStatus',
            header: 'Status',
            render: (t) => <Badge variant={badgeVariantFor(t.taskStatus)}>{t.taskStatus}</Badge>,
          },
          { key: 'comments', header: 'Comments', render: (t) => <span>{t.draftComment?.trim() || '-'}</span>, sortValue: (t) => t.draftComment ?? '' },
        ]}
        rows={filtered}
        rowKey={(t) => t.taskId}
        // The whole row leads where the Task ID link does - see destinationOf.
        onRowClick={(t) => {
          const { to, state } = destinationOf(t);
          navigate(to, state ? { state } : undefined);
        }}
        emptyMessage="No tasks in this category."
        loading={loading || !guard.ready}
      />
    </div>
  );
}

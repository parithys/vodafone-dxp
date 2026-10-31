import { useKindPending } from '../../stores/entityStore';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { EntityMissing } from '../../components/patterns/EntityMissing';
import { badgeVariantFor } from '../../lib/statusTone';
import { formatDateTime } from '../../lib/format';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DRAFT_ORDERS_PATH } from '../../capabilities';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Select } from '../../components/primitives/Select';
import { useEntityStore } from '../../stores/entityStore';
import { usePersonaStore } from '../../stores/personaStore';
import { canAssignTasks } from '../../engines/agentPrivilegeEngine';
import { useNotificationStore } from '../../stores/notificationStore';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { PageHeader } from '../../components/patterns/PageHeader';
import { useSubmitGuard } from '../../hooks/useSubmit';

// Agent 360 ATV-06 / Annex_02: Task status model - "Open -> Assigned/In
// Progress/Closed -> (In Progress/Closed) -> Closed; no transition out of
// Closed." Passed to mockDataEngine.transition() so this is a real,
// falsifiable guard rather than the previous UI-only button-hiding (which
// a direct store call could bypass entirely).
const TASK_STATUS_TRANSITIONS: string[][] = [
  ['Open', 'Assigned'],
  ['Open', 'In Progress'],
  ['Open', 'Closed'],
  ['Assigned', 'In Progress'],
  ['Assigned', 'Closed'],
  ['In Progress', 'Closed'],
];

interface AgentDirectoryEntry {
  userId: string;
  firstName: string;
  lastName: string;
}

interface AgentTask {
  taskId: string;
  taskName: string;
  taskDescription?: string;
  taskType: string;
  taskStatus: string;
  priorityFlag: boolean;
  assignedAgentId: string | null;
  createdAt: string;
  /** The order a Draft Order task is about, from which its customer is known. */
  relatedOrderId?: string;
}

// Agent 360 ATV-04/06 (detail view + status transitions) and ATV-03/BR-05
// (supervisor-only assignment). The Assign control below renders for roles
// carrying the `task-assign` capability: Supervisor and Manager/Approver
// (whose "approval and escalation authority" is a superset of supervision),
// plus Dispatcher, whose entire role is "work allocation and scheduling".
// Previously a single PERSONA-024 id comparison - the only supervisor-shaped
// record the 66-persona catalogue offered.
export function TaskDetailView() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const tasks = (useEntityStore((s) => s.records.tasks) ?? []) as unknown as AgentTask[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as { orderId: string; customerId?: string }[];
  const ordersPending = useKindPending('orders');
  const restricted = useRestrictedCustomers();
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const isSupervisor = canAssignTasks(activePersonaId);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const { guard } = useSubmitGuard();

  const [assignTo, setAssignTo] = useState('');
  const [agents, setAgents] = useState<AgentDirectoryEntry[]>([]);

  useEffect(() => {
    loadKind('tasks');
    loadKind('orders');
  }, [loadKind]);

  // Real userIds, not free text - an assignment has to produce an ID that
  // actually matches the assignee's authStore.profile.userId on their next
  // login, or ATV-02's per-agent scoping (agentTaskEngine.ts) would never
  // show them this task.
  useEffect(() => {
    let cancelled = false;
    mockDataEngine
      .list<AgentDirectoryEntry>('users-agents')
      .then((a) => {
        if (!cancelled) setAgents(a);
      })
      .catch(() => {
        if (!cancelled) setAgents([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tasksPending = useKindPending('tasks');
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    return <EntityMissing what="task" loading={tasksPending} backTo="/tasks" backLabel="Back to my tasks" />;
  }
  // A task about a protected-segment customer this role may not see (by the customer of its related order, or a customer named in the task's own
  // name) is not drawn at all - only the restriction, and nothing until the orders and customers are known.
  if (!restricted.ready || (task.relatedOrderId && ordersPending)) return <div className="p-8 text-fg-2" role="status">Loading…</div>;
  const taskCustomerId = task.relatedOrderId ? orders.find((o) => o.orderId === task.relatedOrderId)?.customerId : undefined;
  if (restricted.isRestricted(taskCustomerId) || restricted.mentionsRestricted(task.taskName)) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/tasks" backLabel="Back to my tasks" />
      </div>
    );
  }

  const applyStatusTransition = async (toState: string, patch: Record<string, unknown>): Promise<boolean> => {
    const result = mockDataEngine.transition(TASK_STATUS_TRANSITIONS, task.taskStatus, toState);
    if (!result.ok) {
      pushToast('error', result.reason ?? `Cannot move task from ${task.taskStatus} to ${toState}.`);
      return false;
    }
    await updateRecord('tasks', 'taskId', task.taskId, { ...patch, updatedAt: new Date().toISOString() });
    return true;
  };

  // Moves the task to In Progress, then returns the agent to the Draft Orders list (where the task now reads In Progress).
  const moveToInProgress = () =>
    guard(async () => {
      if (await applyStatusTransition('In Progress', { taskStatus: 'In Progress' })) navigate(DRAFT_ORDERS_PATH);
    });
  const closeTask = () => guard(() => applyStatusTransition('Closed', { taskStatus: 'Closed' }));
  const assign = () =>
    guard(async () => {
    if (!assignTo.trim()) return;
    // Assignment always sets the owner; it only drives the Open -> Assigned
    // status transition for a still-open task. Reassigning a task already
    // In Progress/Assigned changes the owner without illegally moving
    // status sideways or backward per the Annex_02 model above.
    if (task.taskStatus === 'Open') {
      await applyStatusTransition('Assigned', { assignedAgentId: assignTo.trim(), taskStatus: 'Assigned' });
    } else {
      await updateRecord('tasks', 'taskId', task.taskId, { assignedAgentId: assignTo.trim(), updatedAt: new Date().toISOString() });
    }
    setAssignTo('');
    });

  return (
    <div className="p-8">
      <PageHeader
        title={<>{task.taskName}</>}
        badges={<><Badge variant={badgeVariantFor(task.taskStatus)}>{task.taskStatus}</Badge>
        {task.priorityFlag && <Badge variant="danger">Priority</Badge>}</>}
        description={<>
        {task.taskId} · {task.taskType} · Created {formatDateTime(task.createdAt)}
      </>}
      />

      <div className="card p-5 mb-6">
        <div className="text-[length:var(--fs-caption)] text-muted mb-1">Description</div>
        <p className="text-fg text-[length:var(--fs-body)]">{task.taskDescription || 'No description on file.'}</p>
        <div className="text-[length:var(--fs-caption)] text-muted mt-4 mb-1">Assigned To</div>
        <p className="text-fg text-[length:var(--fs-body)]">{task.assignedAgentId ?? 'Unassigned'}</p>
      </div>

      {task.taskStatus !== 'Closed' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {task.taskStatus !== 'In Progress' && (
            <Button variant="secondary" onClick={moveToInProgress}>
              Move to In Progress
            </Button>
          )}
          <Button variant="primary" onClick={closeTask}>
            Close Task
          </Button>
        </div>
      )}

      {isSupervisor && task.taskStatus !== 'Closed' && (
        <div className="card p-5">
          <h2 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-1">Assign to a Team Member</h2>
          <p className="text-fg-2 text-[length:var(--fs-caption)] mb-3">Supervisor-only action.</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                aria-label="Team member"
                placeholder="Select a team member"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                options={agents.map((a) => ({ value: a.userId, label: `${a.firstName} ${a.lastName}` }))}
              />
            </div>
            <Button variant="primary" onClick={assign} disabled={!assignTo.trim()}>
              Assign
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

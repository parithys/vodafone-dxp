import { useEffect } from 'react';
import { useRestrictedCustomers } from '../../../hooks/useRestrictedCustomers';
import { RestrictedRowsNotice } from '../../../components/patterns/RestrictedRowsNotice';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { ErrorBanner } from '../../../components/primitives/ErrorBanner';
import { useEntityStore, useKindPending } from '../../../stores/entityStore';
import { useAuthStore } from '../../../stores/authStore';
import { isVisibleToAgent } from '../../../engines/agentTaskEngine';
import { TICKET_APPROVAL_ELIGIBLE_JOB_TITLES } from '../../../data/reference/ticketReferenceData';
import { PageHeader } from '../../../components/patterns/PageHeader';

interface Ticket {
  ticketId: string;
  customerId: string;
  category: string;
  status: string;
  priority: string;
  assignedApproverId?: string | null;
}

// Screen 16 (Approval Queue & Ticket Review) - mirrors
// src/modules/order-management/OrderApprovalQueue.tsx structurally (claim-
// based visibility via isVisibleToAgent, eligibility gate before the action
// button renders), against a ticket-appropriate eligibility list rather
// than the order module's category-keyed approval-matrix.json - see
// TICKET_APPROVAL_ELIGIBLE_JOB_TITLES's own comment in ticketReferenceData.ts
// for why no per-category matrix exists here.
interface TicketApprovalQueueProps {
  /** False when embedded in a parent that already provides padding
   * (SupportWorkspace's Tabs) - mirrors OrderApprovalQueue's own prop. */
  padded?: boolean;
}

export function TicketApprovalQueue({ padded = true }: TicketApprovalQueueProps) {
  const tickets = (useEntityStore((s) => s.records['trouble-tickets']) ?? []) as unknown as Ticket[];
  const guard = useRestrictedCustomers();
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const loadError = useEntityStore((s) => s.errors['trouble-tickets']);
  const loading = useKindPending('trouble-tickets'); // true until the list has arrived, so the table never flashes "empty" first
  const navigate = useNavigate();
  const currentAgentId = useAuthStore((s) => s.profile?.userId);
  const currentJobTitle = useAuthStore((s) => s.profile?.jobTitle);

  useEffect(() => {
    loadKind('trouble-tickets');
  }, [loadKind]);

  // Tickets of a protected-segment customer this role may not see are left out of the queue (and counted), never drawn; nothing is listed until
  // customers are known. Counted among the tickets that WOULD be in this queue, so the notice matches the list.
  const { visible: pending, hiddenCount } = guard.filter(
    tickets.filter((t) => t.status === 'Pending Approval').filter((t) => isVisibleToAgent(t.assignedApproverId, currentAgentId)),
    (t) => t.customerId
  );

  const isEligible = () => TICKET_APPROVAL_ELIGIBLE_JOB_TITLES.includes(currentJobTitle ?? '');

  const assignToMe = (ticket: Ticket) => {
    if (ticket.assignedApproverId !== currentAgentId) {
      updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { assignedApproverId: currentAgentId ?? null });
    }
    navigate(`/trouble-ticketing-complaints/approval-review?id=${ticket.ticketId}`);
  };

  return (
    <div className={padded ? 'p-8' : ''}>
      <PageHeader title={<>Ticket Approval Queue</>} description={<>Trouble tickets awaiting an approval decision.</>} bleed={padded} level={padded ? 1 : 2} />
      <ErrorBanner message={loadError} />
      <RestrictedRowsNotice count={hiddenCount} />
      <DataTable<Ticket>
        columns={[
          { key: 'ticketId', header: 'Ticket #' },
          { key: 'customerId', header: 'Customer' },
          { key: 'category', header: 'Category' },
          { key: 'priority', header: 'Priority' },
          { key: 'status', header: 'Status', render: () => <Badge variant="accent">Pending Approval</Badge> },
          {
            key: 'action',
            header: '',
            render: (r) =>
              isEligible() ? (
                <Button variant="secondary" compact onClick={() => assignToMe(r)}>
                  {r.assignedApproverId === currentAgentId ? 'Open' : 'Assign to Me'}
                </Button>
              ) : (
                <span className="text-muted text-[length:var(--fs-caption)]">
                  Requires: {TICKET_APPROVAL_ELIGIBLE_JOB_TITLES.join(' or ')}
                </span>
              ),
          },
        ]}
        rows={pending}
        rowKey={(r) => r.ticketId}
        emptyMessage="No tickets awaiting approval."
        loading={loading || !guard.ready}
      />
    </div>
  );
}

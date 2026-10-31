import { Button } from '../../../components/primitives/Button';
import { Select } from '../../../components/primitives/Select';
import { REOPEN_WINDOW_DAYS } from '../../../data/reference/ticketReferenceData';
import type { Activity, Ticket } from './ticketDetailModel';
import { SYNTHETIC_CLASS } from '../../../data/synthetic/syntheticMarker';

interface Props {
  ticket: Ticket;
  terminal: boolean;
  pendingApproval: boolean;
  canResolve: boolean;
  canReassignQueue: boolean;
  openActivities: Activity[];
  withinReopenWindow: boolean;
  reassignQueue: string;
  setReassignQueue: (v: string) => void;
  setEscalateOpen: (v: boolean) => void;
  setResolveOpen: (v: boolean) => void;
  setRetentionCloseOpen: (v: boolean) => void;
  setCancelOpen: (v: boolean) => void;
  setReopenOpen: (v: boolean) => void;
  assignToMe: () => void;
  reassignQueueSubmit: () => void;
  complete: () => void;
  closeTicket: () => void;
  sendToApproval: () => void;
}

export function TicketActionsCard({
  ticket, terminal, pendingApproval, canResolve, canReassignQueue, openActivities, withinReopenWindow,
  reassignQueue, setReassignQueue, setEscalateOpen, setResolveOpen, setRetentionCloseOpen, setCancelOpen, setReopenOpen,
  assignToMe, reassignQueueSubmit, complete, closeTicket, sendToApproval,
}: Props) {
  return (
    <div className="card p-5">
      <h2 className="text-[length:var(--fs-body-lg)] text-fg font-bold mb-3">Actions</h2>
      <div className="flex flex-col gap-2">
        {pendingApproval && (
          <div className="card card-surface p-3 text-[length:var(--fs-body)] text-fg-2">
            Pending approval decision - see the Approval Queue.
            {ticket.approvalDecision && (
              <p className="mt-1 text-[length:var(--fs-caption)]">
                Last decision: {ticket.approvalDecision}{ticket.approvalNotes ? ` - ${ticket.approvalNotes}` : ''}
              </p>
            )}
          </div>
        )}
        {!ticket.assignedTo && !terminal && !pendingApproval && (
          <Button variant="secondary" className="w-full justify-center" onClick={assignToMe}>Assign to Me</Button>
        )}
        {canReassignQueue && !terminal && !pendingApproval && (
          <div className="flex flex-col gap-2">
            <Select aria-label="Reassign queue" value={reassignQueue} onChange={(e) => setReassignQueue(e.target.value)} placeholder="Reassign queue…" options={['FL Agents', 'Complaints Team'].map((q) => ({ value: q, label: q }))} />
            <Button variant="secondary" className="w-full justify-center" onClick={reassignQueueSubmit} disabled={!reassignQueue}>Reassign</Button>
          </div>
        )}
        {!terminal && !pendingApproval && ticket.status !== 'Escalate' && (
          <Button variant="secondary" className="w-full justify-center" onClick={() => setEscalateOpen(true)}>Escalate</Button>
        )}
        {canResolve && !terminal && !pendingApproval && ticket.status !== 'Solved' && ticket.status !== 'Completed' && (
          <Button variant="secondary" className="w-full justify-center" onClick={() => setResolveOpen(true)}>Resolve</Button>
        )}
        {!canResolve && !terminal && !pendingApproval && ticket.status !== 'Solved' && ticket.status !== 'Completed' && (
          <p className="text-[length:var(--fs-caption)] text-muted">Resolution requires Complaints Team - use Escalate to route it.</p>
        )}
        {ticket.status === 'Solved' && (
          <Button variant="secondary" className="w-full justify-center" onClick={complete} disabled={openActivities.length > 0}>
            {openActivities.length > 0 ? `Complete (${openActivities.length} open)` : 'Complete'}
          </Button>
        )}
        {ticket.status === 'Completed' && ticket.category === 'Disconnection' && (
          <Button variant="primary" className="w-full justify-center" onClick={() => setRetentionCloseOpen(true)}>Close Ticket</Button>
        )}
        {ticket.status === 'Completed' && ticket.category !== 'Disconnection' && (
          <Button variant="primary" className="w-full justify-center" onClick={() => closeTicket()}>Close Ticket</Button>
        )}
        {!terminal && !pendingApproval && (
          <Button variant="secondary" className="w-full justify-center" onClick={() => setCancelOpen(true)}>Cancel ticket</Button>
        )}
        {!terminal && !pendingApproval && (
          <button
            type="button"
            onClick={sendToApproval}
            className={`text-[length:var(--fs-caption)] text-link hover:underline self-center mt-1 ${SYNTHETIC_CLASS}`}
          >
            Simulate → Send to Approval (Demo)
          </button>
        )}
        {ticket.status === 'Closed' && (
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => (withinReopenWindow ? setReopenOpen(true) : undefined)}
            disabled={!withinReopenWindow}
          >
            {withinReopenWindow ? 'Reopen' : 'Reopen (outside window)'}
          </Button>
        )}
        {ticket.status === 'Closed' && !withinReopenWindow && (
          <p className="text-[length:var(--fs-caption)] text-danger">
            Outside the {REOPEN_WINDOW_DAYS}-day reopen window (RES-10) - raise a linked ticket instead.
          </p>
        )}
        {ticket.cancelReason && <p className="text-[length:var(--fs-caption)] text-danger">Cancelled: {ticket.cancelReason}</p>}
      </div>
    </div>
  );
}

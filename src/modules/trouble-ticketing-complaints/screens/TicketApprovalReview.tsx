import { useKindPending } from '../../../stores/entityStore';
import { useRestrictedCustomers } from '../../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from '../../../components/patterns/RestrictedCustomerNotice';
import { EntityMissing } from '../../../components/patterns/EntityMissing';
import { formatDateTime } from '../../../lib/format';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/primitives/Button';
import { Badge } from '../../../components/primitives/Badge';
import { Drawer } from '../../../capabilities';
import { Select } from '../../../components/primitives/Select';
import { Textarea } from '../../../components/primitives/Textarea';
import { useEntityStore } from '../../../stores/entityStore';
import { useAuthStore } from '../../../stores/authStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { isVisibleToAgent } from '../../../engines/agentTaskEngine';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { TICKET_APPROVAL_ELIGIBLE_JOB_TITLES, APPROVAL_REJECT_REASONS, APPROVAL_RETURN_REASONS } from '../../../data/reference/ticketReferenceData';
import { PageHeader } from '../../../components/patterns/PageHeader';

const CURRENT_AGENT = 'Current Agent';

interface Activity {
  type: 'Manual' | 'Auto';
  description: string;
  createdAt: string;
  createdBy: string;
  open: boolean;
}
interface Ticket {
  ticketId: string;
  customerId: string;
  category: string;
  status: string;
  priority: string;
  actualIssue?: string;
  assignedApproverId?: string | null;
  activities?: Activity[];
  approvalDecision?: 'Approved' | 'Rejected' | 'Returned' | null;
}
interface AuditRecord {
  auditId: string;
  recordType: string;
  recordId: string;
  employeeUser: string;
  fieldModified: string;
  newValue: string;
  timestamp: string;
}

// Screen 16 (Approval Queue & Ticket Review) - mirrors
// src/modules/order-management/OrderApprovalDetail.tsx's modal-state shape
// and submittingRef double-submit guard exactly (that guard was added there
// after two same-tick clicks both read stale `submitting=false` and created
// duplicate history entries - the same class of bug this session's SLA
// auto-escalation sweep hit and fixed). Only 3 outcomes, not the order
// version's 4 (Approve/Reject-Correction/Reject-Drop/Return) - Reject here
// always maps to Cancelled (the order version's "drop"), since no
// resubmit-for-correction status exists or is evidenced for tickets. Return
// loops the ticket back to 'Pending Approval', still assigned to the same
// approver, matching the order version's own Return behaviour (it loops to
// 'Submitted for Approval' without clearing assignedApproverId) rather than
// exiting the approval flow entirely.
//
// Persistence follows this ticket module's own established convention
// (updateRecord('trouble-tickets', ...) + createRecord('audit-trail', ...) +
// an appended `activities` entry), not the order version's target
// (customer-activities) - consistent with how escalate()/resolve()/
// closeTicket() already log every other decision in TicketDetail.tsx.
export function TicketApprovalReview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ticketId = params.get('id');
  const tickets = (useEntityStore((s) => s.records['trouble-tickets']) ?? []) as unknown as Ticket[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const currentAgentId = useAuthStore((s) => s.profile?.userId);
  const currentJobTitle = useAuthStore((s) => s.profile?.jobTitle);

  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [modal, setModal] = useState<'approve' | 'reject' | 'return' | null>(null);
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    loadKind('trouble-tickets');
  }, [loadKind]);

  useEffect(() => {
    if (!ticketId) return;
    mockDataEngine.list<AuditRecord>('audit-trail').then((all) => {
      setAuditRecords(all.filter((a) => a.recordType === 'Ticket' && a.recordId === ticketId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    });
  }, [ticketId, tickets]);

  const ticketsPending = useKindPending('trouble-tickets');
  const restricted = useRestrictedCustomers();
  const ticket = tickets.find((t) => t.ticketId === ticketId);
  if (!ticket) {
    return <EntityMissing what="ticket" loading={ticketsPending} backTo="/trouble-ticketing-complaints/approval-queue" backLabel="Back to the approval queue" />;
  }
  // The customer is in a protected segment this role may not see: the record is not drawn at all - only the restriction (and nothing until the
  // customers are known).
  if (!restricted.ready) return <div className="p-8 text-fg-2" role="status">Loading…</div>;
  if (restricted.isRestricted(ticket.customerId)) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/trouble-ticketing-complaints/approval-queue" backLabel="Back to the approval queue" />
      </div>
    );
  }

  // Mirrors OrderApprovalDetail's own access-denied guard - an unassigned
  // ticket is still an open queue item anyone eligible can claim; once
  // assigned, only that approver may open this page by direct URL either.
  if (!isVisibleToAgent(ticket.assignedApproverId, currentAgentId)) {
    return (
      <div className="p-8 text-fg-2">
        <p className="text-fg font-medium mb-1">Access denied.</p>
        <p>This ticket is assigned to another approver and is not accessible from your account.</p>
      </div>
    );
  }

  const isEligibleApprover = TICKET_APPROVAL_ELIGIBLE_JOB_TITLES.includes(currentJobTitle ?? '');
  const decided = ticket.status !== 'Pending Approval';

  const audit = async (fieldModified: string, newValue: string) => {
    await createRecord('audit-trail', {
      auditId: `AUD-TT-${Date.now().toString().slice(-6)}`,
      recordType: 'Ticket',
      recordId: ticket.ticketId,
      employeeUser: CURRENT_AGENT,
      fieldModified,
      newValue,
      timestamp: new Date().toISOString(),
    });
  };

  const addActivity = (description: string): Activity[] => [
    ...(ticket.activities ?? []),
    { type: 'Auto', description, createdAt: new Date().toISOString(), createdBy: CURRENT_AGENT, open: false },
  ];

  const approve = async () => {
    if (!isEligibleApprover || decided || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
        status: 'Not Solved',
        approvalDecision: 'Approved',
        approvalNotes: approveNotes,
        approvalDecidedAt: new Date().toISOString(),
        activities: addActivity(`Approved${approveNotes ? ` - ${approveNotes}` : ''}.`),
      });
      await audit('Approval', 'Approved');
      pushToast('success', `Ticket ${ticket.ticketId} approved.`);
      navigate('/trouble-ticketing-complaints/approval-queue');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const reject = async () => {
    if (!isEligibleApprover || decided || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
        status: 'Cancelled',
        cancelReason: rejectReason,
        excludedFromReporting: true,
        approvalDecision: 'Rejected',
        approvalReasonCode: rejectReason,
        approvalNotes: rejectNotes,
        approvalDecidedAt: new Date().toISOString(),
        activities: addActivity(`Rejected - ${rejectReason}: ${rejectNotes}.`),
      });
      await audit('Approval', 'Rejected');
      pushToast('warning', `Ticket ${ticket.ticketId} rejected and cancelled.`);
      navigate('/trouble-ticketing-complaints/approval-queue');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Loops back to 'Pending Approval' rather than exiting the approval flow -
  // mirrors OrderApprovalDetail's own Return (-> 'Submitted for Approval'),
  // including not clearing assignedApproverId, so it stays with this same
  // approver rather than resetting to the open pool.
  const returnTicket = async () => {
    if (!isEligibleApprover || decided || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
        status: 'Pending Approval',
        approvalDecision: 'Returned',
        approvalReasonCode: returnReason,
        approvalNotes: returnNotes,
        approvalDecidedAt: new Date().toISOString(),
        activities: addActivity(`Returned - ${returnReason}: ${returnNotes}.`),
      });
      await audit('Approval', 'Returned');
      pushToast('warning', `Ticket ${ticket.ticketId} returned for further review.`);
      setModal(null);
      setReturnReason('');
      setReturnNotes('');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 w-full">
      <PageHeader
        title={<>Ticket {ticket.ticketId}</>}
        badges={<><Badge variant="outlined-red">{ticket.status}</Badge></>}
        description={<>
        Customer: {ticket.customerId} · {ticket.category} · Priority {ticket.priority}
        {ticket.actualIssue ? ` · ${ticket.actualIssue}` : ''}
      </>}
      />

      <div className="card p-5 mb-4">
        <p className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted mb-2">Decision History</p>
        {auditRecords.length === 0 && <p className="text-fg-2 text-[length:var(--fs-body)]">No approval actions recorded yet for this ticket.</p>}
        {auditRecords.length > 0 && (
          <div className="divide-y divide-border-soft">
            {auditRecords.map((a) => (
              <div key={a.auditId} className="py-2 text-[length:var(--fs-caption)]">
                <span className="text-fg font-medium">{a.fieldModified} → {a.newValue}</span>
                <span className="block text-muted">{a.employeeUser} · {formatDateTime(a.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isEligibleApprover && !decided && (
        <div className="mb-4 rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3 text-[length:var(--fs-body)] text-[var(--warn-text)]">
          Only {TICKET_APPROVAL_ELIGIBLE_JOB_TITLES.join(' or ')} may approve, reject, or return this ticket.
        </div>
      )}

      {decided ? (
        <p className="text-fg-2 text-[length:var(--fs-body)]">This ticket already has a decision recorded - see Decision history above.</p>
      ) : isEligibleApprover ? (
        // Decision buttons are for the authorised approvers only; everyone else sees the notice above and no buttons.
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setModal('approve')}>Approve</Button>
          <Button variant="secondary" className="!text-danger !border-danger" onClick={() => setModal('reject')}>Reject</Button>
          <Button variant="secondary" onClick={() => setModal('return')}>Return</Button>
        </div>
      ) : null}

      <Drawer open={modal === 'approve'} onClose={() => setModal(null)} title="Approve Ticket">
        <Textarea label="Notes (Optional)" value={approveNotes} onChange={(e) => setApproveNotes(e.target.value)} />
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={approve} disabled={submitting}>Submit Approval</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'reject'} onClose={() => setModal(null)} title="Reject Ticket">
        <div className="space-y-3">
          <Select label="Reject Reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Select a reason" options={APPROVAL_REJECT_REASONS.map((r) => ({ value: r, label: r }))} />
          <Textarea label="Notes (Required)" value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={reject} disabled={!rejectReason || !rejectNotes.trim() || submitting}>Reject Ticket</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'return'} onClose={() => setModal(null)} title="Return Ticket">
        <div className="space-y-3">
          <p className="text-fg-2 text-[length:var(--fs-body)]">Returning sends this ticket back into the approval queue for further review, rather than rejecting it outright.</p>
          <Select label="Return Reason" value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder="Select a reason" options={APPROVAL_RETURN_REASONS.map((r) => ({ value: r, label: r }))} />
          <Textarea label="Notes (Required)" value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={returnTicket} disabled={!returnReason || !returnNotes.trim() || submitting}>Return Ticket</Button>
        </div>
      </Drawer>
    </div>
  );
}

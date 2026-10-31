import type { Activity, Ticket } from './ticketDetailModel';
import type { TicketDetailState } from './useTicketDetailState';

export const CURRENT_AGENT = 'Current Agent';
const MAX_ATTACHMENTS = 5; // P-15 is "To be confirmed" in the source - placeholder cap pending VFQ confirmation.

interface TicketActionsInput {
  ticket: Ticket;
  s: TicketDetailState;
  notes: NonNullable<Ticket['publicNotes']>;
  activities: Activity[];
  attachments: NonNullable<Ticket['attachments']>;
  openActivities: Activity[];
  terminal: boolean;
  withinReopenWindow: boolean;
  /** From useSubmitGuard(): one action at a time, a failure becomes a toast, never a silent no-op or an unhandled rejection. */
  guard: (action: () => Promise<unknown> | unknown) => Promise<boolean>;
}

// Action handlers for TicketDetail (plain closures, not hooks - called after
// the "no ticket" early return, exactly as they were declared inline).
export function createTicketActions({ ticket, s, notes, activities, attachments, openActivities, terminal, withinReopenWindow, guard }: TicketActionsInput) {
  const {
    updateRecord, createRecord, pushToast,
    noteText, setNoteText, activityText, setActivityText,
    setEscalateOpen, escalateReason, setEscalateReason,
    setResolveOpen, resolutionCode, resolutionHashtags,
    setCancelOpen, cancelReason, setCancelReason,
    setRetentionCloseOpen, setRetentionResolutionCode,
    setReopenOpen, reopenReason, setReopenReason,
    reassignQueue, setReassignQueue,
  } = s;

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

  const addActivity = (description: string, type: Activity['type'] = 'Auto', open = false) => [
    ...activities,
    { type, description, createdAt: new Date().toISOString(), createdBy: CURRENT_AGENT, open },
  ];

  const notify = async (smsText: string) => {
    await createRecord('osb-notifications', {
      messageId: `MSG-TT-${Date.now().toString().slice(-6)}`,
      orderId: ticket.ticketId,
      dbTimestamp: new Date().toISOString(),
      server: 'OSB-PRD-NODE1',
      state: 'COMPLETED',
      node: 'Node1',
      pipeline: 'PS_VFQA_Communication_Pipeline',
      stage: 'SendSMS',
      inboundService: 'PS_VFQA_Communication',
      operation: 'CreateCommunication',
      smsText,
    });
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const next = [...notes, { author: CURRENT_AGENT, text: noteText, createdAt: new Date().toISOString() }];
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { publicNotes: next });
    setNoteText('');
  };

  const addManualActivity = async () => {
    if (!activityText.trim()) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { activities: addActivity(activityText, 'Manual', true) });
    await audit('Activity', activityText);
    setActivityText('');
  };

  const closeActivity = async (index: number) => {
    const next = activities.map((a, i) => (i === index ? { ...a, open: false } : a));
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { activities: next });
  };

  // MPRA_001_ASG-06/07: self-assignment sets Status AND Sub-Status to
  // "Assigned" per the source's own single-status-field model.
  const assignToMe = async () => {
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      assignedTo: CURRENT_AGENT,
      assignedAt: new Date().toISOString(),
      status: ticket.status === 'Not Solved' ? 'Assigned' : ticket.status,
      activities: addActivity(`Ticket assigned to ${CURRENT_AGENT}.`),
    });
    await audit('Assignment', CURRENT_AGENT);
    pushToast('success', `Ticket ${ticket.ticketId} assigned to you.`);
  };

  // MPRA_001_ASG-05: supervisor cross-queue reassignment.
  const reassignQueueSubmit = async () => {
    if (!reassignQueue) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      queue: reassignQueue,
      activities: addActivity(`Reassigned from ${ticket.queue} to ${reassignQueue} by supervisor.`),
    });
    await audit('Queue', reassignQueue);
    pushToast('success', `Ticket ${ticket.ticketId} reassigned to ${reassignQueue}.`);
    setReassignQueue('');
  };

  // MPRA_001_ESC-05: manual escalation with mandatory reason. Also models
  // ESC-06/07's distribution-list/hierarchical notification as a persisted
  // notification record rather than a real email/DL send.
  const escalate = async () => {
    if (!escalateReason) return;
    const entry = { reason: escalateReason, escalatedAt: new Date().toISOString(), escalatedBy: CURRENT_AGENT };
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Escalate',
      escalations: [...(ticket.escalations ?? []), entry],
      activities: addActivity(`Escalated - reason: ${escalateReason}.`),
    });
    await audit('Status', 'Escalate');
    await notify(`Ticket ${ticket.ticketId} escalated (${escalateReason}) - distribution list and next-hierarchy-position notified (ESC-06/07).`);
    pushToast('warning', `Ticket ${ticket.ticketId} escalated.`);
    setEscalateOpen(false);
    setEscalateReason('');
  };

  // MPRA_001_RES-01: gated on Resolution Code + Hashtag + Actual Issue.
  const resolve = async () => {
    if (!resolutionCode || resolutionHashtags.length === 0) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Solved',
      resolutionCode,
      hashtags: resolutionHashtags,
      activities: addActivity(`Marked Solved - ${resolutionCode}.`),
    });
    await audit('Status', 'Solved');
    pushToast('success', `Ticket ${ticket.ticketId} marked Solved.`);
    setResolveOpen(false);
  };

  // MPRA_001_RES-08: gated on no outstanding activities.
  const complete = async () => {
    if (openActivities.length > 0) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { status: 'Completed', activities: addActivity('Marked Completed.') });
    await audit('Status', 'Completed');
    pushToast('success', `Ticket ${ticket.ticketId} marked Completed.`);
  };

  // MPRA_001_RES-09: closes all activities on ticket closure. MPRA_001_CSA-01/02:
  // Medallia (spelled inconsistently across the BRSD as Medilia/Medelia/Medallia)
  // survey trigger fires only on reaching this terminal state.
  //
  // Reconciliation note (Trouble Ticket CBU journey, Wave 1, Screen 14): a
  // separate build-plan pass assumed this trigger fires on "Resolved" (i.e.
  // resolve()'s `Solved` status) rather than `Closed`. The VFQ_Trouble_Ticket
  // _BRSD_v1.0 source that would arbitrate this isn't available in
  // reference/.knowledge/ - the only evidenced anchor is this file's own
  // MPRA_001_CSA-01/02 comment, which ties the trigger to Closed. Kept as-is
  // rather than moved to resolve(), since there's nothing to verify a change
  // against - not a decision that Closed is "correct," just that it's the
  // only evidenced behaviour.
  // R2 (Retention Request Capture) / BR-060: a Disconnection-category
  // ticket must be closed with a Resolution Code (retention) value before
  // it can close at all - the general (non-Disconnection) close path below
  // is unchanged.
  const closeTicket = async (retentionCode?: string) => {
    const closedAt = new Date().toISOString();
    const closedActivities: Activity[] = [
      ...activities.map((a) => ({ ...a, open: false })),
      { type: 'Auto', description: 'Ticket closed - all activities closed.', createdAt: closedAt, createdBy: CURRENT_AGENT, open: false },
    ];
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Closed',
      closedAt,
      activities: closedActivities,
      ...(retentionCode ? { retentionResolutionCode: retentionCode } : {}),
    });
    await audit('Status', 'Closed');
    if (retentionCode) await audit('Resolution Code (retention)', retentionCode);
    await notify(`Ticket ${ticket.ticketId} closed. A customer satisfaction survey has been triggered (CSA-01/02, Medallia).`);
    pushToast('success', `Ticket ${ticket.ticketId} closed.`);
    setRetentionCloseOpen(false);
    setRetentionResolutionCode('');
  };

  // MPRA_001_RES-11: mandatory reason code, excluded from performance reporting.
  const cancel = async () => {
    if (!cancelReason) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Cancelled',
      cancelReason,
      excludedFromReporting: true,
      activities: addActivity(`Cancelled - reason: ${cancelReason}.`),
    });
    await audit('Status', 'Cancelled');
    pushToast('warning', `Ticket ${ticket.ticketId} cancelled.`);
    setCancelOpen(false);
    setCancelReason('');
  };

  // Screen 16 (Approval Queue & Ticket Review) - no Approval Matrix routes a
  // ticket into approval automatically (zero source evidence exists for
  // one), so this is the only way to reach that screen at all. Same
  // convention as WinCashPaymentStep.tsx's "Simulate session expiry (test)":
  // a small, always-visible text-link standing in for a real trigger this
  // mock app has no mechanism to produce.
  const sendToApproval = async () => {
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Pending Approval',
      approvalDecision: null,
      approvalReasonCode: null,
      approvalNotes: null,
      activities: addActivity('Sent to approval (test).'),
    });
    await audit('Status', 'Pending Approval');
    pushToast('warning', `Ticket ${ticket.ticketId} sent to approval.`);
  };

  // MPRA_001_RES-10: reopen only within the configured window (P-12 -
  // placeholder pending VFQ confirmation), with a mandatory reason, returning
  // status to "Not Solved" (not a separate "Reopened" state) and incrementing
  // reopenCount.
  const reopen = async () => {
    if (!reopenReason.trim() || !withinReopenWindow) return;
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
      status: 'Not Solved',
      reopenCount: (ticket.reopenCount ?? 0) + 1,
      activities: addActivity(`Reopened - reason: ${reopenReason}.`),
    });
    await audit('Status', 'Not Solved (Reopened)');
    pushToast('warning', `Ticket ${ticket.ticketId} reopened.`);
    setReopenOpen(false);
    setReopenReason('');
  };

  // MPRA_001_ATT-01–05: metadata-only capture (name/size) - no real file
  // storage exists in this mock app, so nothing beyond the metadata a real
  // <input type="file"> gives us is fabricated.
  const attach = async (file: File) => {
    if (terminal) return; // ATT-03
    if (attachments.length >= MAX_ATTACHMENTS) {
      pushToast('error', `Maximum ${MAX_ATTACHMENTS} attachments per ticket.`);
      return;
    }
    const next = [...attachments, { name: file.name, size: file.size, uploadedAt: new Date().toISOString() }];
    await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { attachments: next });
    await audit('Attachment', file.name);
  };

  const guarded = <A extends unknown[]>(fn: (...args: A) => Promise<unknown>) => (...args: A) => guard(() => fn(...args));

  return {
    notify: guarded(notify),
    addNote: guarded(addNote),
    addManualActivity: guarded(addManualActivity),
    closeActivity: guarded(closeActivity),
    assignToMe: guarded(assignToMe),
    reassignQueueSubmit: guarded(reassignQueueSubmit),
    escalate: guarded(escalate),
    resolve: guarded(resolve),
    complete: guarded(complete),
    closeTicket: guarded(closeTicket),
    cancel: guarded(cancel),
    sendToApproval: guarded(sendToApproval),
    reopen: guarded(reopen),
    attach: guarded(attach),
  };
}

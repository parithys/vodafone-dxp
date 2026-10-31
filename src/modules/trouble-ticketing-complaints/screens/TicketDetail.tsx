import { useKindPending } from '../../../stores/entityStore';
import { useRestrictedCustomers } from '../../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from '../../../components/patterns/RestrictedCustomerNotice';
import { EntityMissing } from '../../../components/patterns/EntityMissing';
import { Tabs } from '../../../components/primitives/Tabs';
import { evaluateRule } from '../../../engines/ruleEngine';
import { canResolveTicket, canReassignTicketQueue, canSeeTicketAuditTrail } from '../../../engines/agentPrivilegeEngine';
import { REOPEN_WINDOW_DAYS } from '../../../data/reference/ticketReferenceData';
import { TicketCommunicationTab } from './TicketCommunicationTab';
import { useTicketDetailState } from './useTicketDetailState';
import { createTicketActions } from './ticketDetailActions';
import { useSubmitGuard } from '../../../hooks/useSubmit';
import { TicketHeaderCard } from './TicketHeaderCard';
import { TicketNotesCard } from './TicketNotesCard';
import { TicketDetailsTab } from './TicketDetailsTab';
import { TicketActivitiesTab } from './TicketActivitiesTab';
import { TicketAttachmentsTab } from './TicketAttachmentsTab';
import { TicketAuditTab } from './TicketAuditTab';
import { TicketActionsCard } from './TicketActionsCard';
import { TicketOverviewCard } from './TicketOverviewCard';
import { TicketDrawers } from './TicketDrawers';

// SCR-029 (Ticket detail: public notes / bell icon notifications) + SCR-210
// (Ticket Homepage: fields filled by which role is responsible, internal
// Activities) - both describe the same central ticket-management page from
// two evidenced angles, so they share this one component. Extended per the
// Trouble Ticket BRSD gap analysis (2026-09-11) to close the majority of the
// journey's remaining capabilities: Assignment/Reassignment (ASG),
// Escalation (ESC), Resolution/Completion/Closure/Cancellation/Reopen (RES),
// Attachments (ATT), real Activities (VEW), and Audit Trail (AUD) - see the
// per-action comments below for exact requirement/rule citations.
export function TicketDetail() {
  const s = useTicketDetailState();
  const { ticket, updateRecord, activePersonaId, noteText, setNoteText, activityText, setActivityText, auditRecords, surveyNotifications } = s;
  const { guard } = useSubmitGuard();
  const ticketsPending = useKindPending('trouble-tickets');
  const restricted = useRestrictedCustomers();
  if (!ticket) {
    return <EntityMissing what="ticket" loading={ticketsPending} backTo="/trouble-ticketing-complaints/tickets-dashboard" backLabel="Back to tickets" />;
  }
  // The customer is in a protected segment this role may not see: the record is not drawn at all - only the restriction (and nothing until the
  // customers are known).
  if (!restricted.ready) return <div className="p-8 text-fg-2" role="status">Loading…</div>;
  if (restricted.isRestricted(ticket.customerId)) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/trouble-ticketing-complaints/tickets-dashboard" backLabel="Back to tickets" />
      </div>
    );
  }

  // BR-067 (config): "an audit trail exists on tickets... but is role-
  // restricted from agents." Withheld from the Sales & Acquisition group and
  // the customer-side Authorized Officer; care, complaints, dispatch,
  // oversight and platform-admin roles carry `ticket-audit-trail`.
  // (Was a PERSONA-001/066 id comparison - the old model's only two
  // frontline ids. "Frontline" stopped being the right word under the 26:
  // Customer Care is front-line but is a legitimate audit-trail viewer.)
  const canSeeAudit = canSeeTicketAuditTrail(activePersonaId);
  // RBAC-132/144: Resolution Code is a "Filled By Complaints Team"-designated
  // field that agents raising the ticket cannot fill. The 25-row role table
  // had no Complaints Team successor, so a dedicated Complaints role
  // (ROLE-26) owns resolution alongside Supervisor/Manager - keeping the
  // raise-vs-resolve separation rather than widening it to every care agent.
  const canResolve = canResolveTicket(activePersonaId);
  const canReassignQueue = canReassignTicketQueue(activePersonaId);

  const notes = ticket.publicNotes ?? [];
  const activities = ticket.activities ?? [];
  const attachments = ticket.attachments ?? [];
  const openActivities = activities.filter((a) => a.open);
  const terminal = ticket.status === 'Closed' || ticket.status === 'Cancelled';
  const pendingApproval = ticket.status === 'Pending Approval';
  const slaRule = evaluateRule('BR-349', { slaDueAt: ticket.slaDueAt, status: ticket.status });
  const ragVariant = terminal || !ticket.slaDueAt ? 'filled-neutral' : !slaRule.pass ? 'danger' : slaRule.message?.includes('Amber') ? 'warning' : 'success';
  const ragLabel = terminal || !ticket.slaDueAt ? '-' : ragVariant === 'danger' ? 'Red' : ragVariant === 'warning' ? 'Amber' : 'Green';


  // MPRA_001_RES-10: reopen only within the configured window (P-12 -
  // placeholder pending VFQ confirmation), with a mandatory reason, returning
  // status to "Not Solved" (not a separate "Reopened" state) and incrementing
  // reopenCount.
  const withinReopenWindow = ticket.closedAt ? Date.now() - new Date(ticket.closedAt).getTime() <= REOPEN_WINDOW_DAYS * 24 * 60 * 60 * 1000 : false;

  const {
    notify, addNote, addManualActivity, closeActivity, assignToMe, reassignQueueSubmit,
    escalate, resolve, complete, closeTicket, cancel, sendToApproval, reopen, attach,
  } = createTicketActions({ ticket, s, notes, activities, attachments, openActivities, terminal, withinReopenWindow, guard });

  return (
    <div className="p-8 w-full">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <TicketHeaderCard ticket={ticket} ragVariant={ragVariant} ragLabel={ragLabel} notesCount={notes.length} slaMessage={slaRule.message} surveyNotifications={surveyNotifications} />

          <TicketNotesCard notes={notes} noteText={noteText} setNoteText={setNoteText} addNote={addNote} />

          <div className="card p-5">
            <Tabs
              items={[
                { key: 'details', label: 'Details', content: <TicketDetailsTab ticket={ticket} updateRecord={updateRecord} /> },
                {
                  key: 'activities',
                  label: 'Activities',
                  content: <TicketActivitiesTab activities={activities} closeActivity={closeActivity} activityText={activityText} setActivityText={setActivityText} addManualActivity={addManualActivity} />,
                },
                { key: 'attachments', label: 'Attachments', content: <TicketAttachmentsTab attachments={attachments} terminal={terminal} attach={attach} /> },
                {
                  key: 'communication',
                  label: 'Communication',
                  content: <TicketCommunicationTab ticketId={ticket.ticketId} onSend={notify} />,
                },
                { key: 'audit', label: 'Audit Trail', content: <TicketAuditTab canSeeAudit={canSeeAudit} auditRecords={auditRecords} /> },
              ]}
            />
          </div>
        </div>

        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <TicketActionsCard
            ticket={ticket}
            terminal={terminal}
            pendingApproval={pendingApproval}
            canResolve={canResolve}
            canReassignQueue={canReassignQueue}
            openActivities={openActivities}
            withinReopenWindow={withinReopenWindow}
            reassignQueue={s.reassignQueue}
            setReassignQueue={s.setReassignQueue}
            setEscalateOpen={s.setEscalateOpen}
            setResolveOpen={s.setResolveOpen}
            setRetentionCloseOpen={s.setRetentionCloseOpen}
            setCancelOpen={s.setCancelOpen}
            setReopenOpen={s.setReopenOpen}
            assignToMe={assignToMe}
            reassignQueueSubmit={reassignQueueSubmit}
            complete={complete}
            closeTicket={closeTicket}
            sendToApproval={sendToApproval}
          />

          <TicketOverviewCard ticket={ticket} />
        </div>
      </div>

      <TicketDrawers s={s} escalate={escalate} resolve={resolve} cancel={cancel} reopen={reopen} closeTicket={closeTicket} />
    </div>
  );
}

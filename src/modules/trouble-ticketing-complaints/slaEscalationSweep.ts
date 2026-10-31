import { useEffect, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { evaluateRule } from '../../engines/ruleEngine';

interface SweepTicket {
  ticketId: string;
  status: string;
  slaDueAt?: string;
  escalations?: { reason: string; escalatedAt: string; escalatedBy: string }[];
  activities?: { type: 'Manual' | 'Auto'; description: string; createdAt: string; createdBy: string; open: boolean }[];
}

const SYSTEM_ESCALATION_REASON = 'SLA breached (BR-349 auto-escalation)';
const SYSTEM_ACTOR = 'System (BR-349 auto-escalation)';

// Module-level (not component-level) guard: verified live that without this,
// a ticket got double-escalated - two identical audit-trail/osb-notification
// records at the same timestamp. Root cause is exactly the two things
// sidebarStore.ts's own StrictMode comment already warns about in this
// codebase, compounded by real async latency: (1) React StrictMode
// double-invokes effects in dev, and (2) updateRecord/createRecord take
// 200-600ms (mockDataEngine's latency()), so the second invocation's
// candidate check still sees the ticket as not-yet-escalated in its stale
// render-closure `tickets` before the first invocation's write lands. A
// per-render closure guard can't fix this since both invocations get a fresh
// closure; this has to be a module-level Set surviving across invocations
// and across the two screens that call this hook.
const escalationInFlight = new Set<string>();

// Duplicates escalate()'s side effects from TicketDetail.tsx rather than
// importing it - that function is a component-local closure (captures
// CURRENT_AGENT, its own drawer state setters), and this needs to run from
// two different screens with no user-supplied reason and a distinct system
// attribution, so the human agent constant doesn't mislabel the audit trail.
async function escalateForSlaBreach(
  ticket: SweepTicket,
  updateRecord: (kind: 'trouble-tickets' | 'audit-trail' | 'osb-notifications', idField: string, id: string, patch: Record<string, unknown>) => Promise<void>,
  createRecord: (kind: 'audit-trail' | 'osb-notifications', record: Record<string, unknown>) => Promise<void>
) {
  const entry = { reason: SYSTEM_ESCALATION_REASON, escalatedAt: new Date().toISOString(), escalatedBy: SYSTEM_ACTOR };
  const activities = [
    ...(ticket.activities ?? []),
    { type: 'Auto' as const, description: `Auto-escalated - ${SYSTEM_ESCALATION_REASON}.`, createdAt: new Date().toISOString(), createdBy: SYSTEM_ACTOR, open: false },
  ];
  await updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, {
    status: 'Escalate',
    escalations: [...(ticket.escalations ?? []), entry],
    activities,
  });
  await createRecord('audit-trail', {
    auditId: `AUD-TT-${Date.now().toString().slice(-6)}`,
    recordType: 'Ticket',
    recordId: ticket.ticketId,
    employeeUser: SYSTEM_ACTOR,
    fieldModified: 'Status',
    newValue: 'Escalate',
    timestamp: new Date().toISOString(),
  });
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
    smsText: `Ticket ${ticket.ticketId} auto-escalated - distribution list and next-hierarchy-position notified (ESC-06/07).`,
  });
}

// Makes BR-349's own claim ("the system shall...escalate the ticket...
// automatically when SLA is breached", ruleEngine.ts) actually true - today
// it only colours a badge. Follows useBellNotificationExpirySweep's exact
// pattern (bellNotificationExpiry.ts): derive a stable joined-id-string of
// candidates during render (not the raw entity array) so the effect only
// re-fires when the *set* of candidates changes, not on every unrelated
// ticket update - this is what keeps it self-limiting rather than looping,
// since each escalation removes its own ticket from the next render's
// candidate string. Call from every screen that needs the sweep to have
// happened (both TicketsDashboard.tsx and TicketDetail.tsx), matching how
// the bell-notification precedent is called from its two consumer screens.
//
// BR-349 itself reads the live Date.now() rather than this codebase's
// SESSION_TODAY convention (customer360Engine.ts) used for equivalent SLA/
// overdue checks elsewhere - left as-is here; fixing that clock-source
// inconsistency is a separate, unrequested change.
export function useTicketSlaEscalationSweep() {
  const tickets = (useEntityStore((s) => s.records['trouble-tickets']) ?? []) as unknown as SweepTicket[];
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const [now] = useState(() => Date.now());

  const dueForEscalation = tickets
    .filter((t) => {
      // 'Pending Approval' excluded (Screen 16, added after this sweep was
      // first written) - verified live that without this, a ticket sent to
      // approval with an already-Red SLA got immediately re-escalated back
      // to 'Escalate' by this same sweep, silently undoing the approval
      // trigger before the agent could even navigate away.
      if (t.status === 'Escalate' || t.status === 'Closed' || t.status === 'Cancelled' || t.status === 'Pending Approval') return false;
      const rule = evaluateRule('BR-349', { slaDueAt: t.slaDueAt, status: t.status });
      return t.slaDueAt !== undefined && !rule.pass && new Date(t.slaDueAt).getTime() <= now;
    })
    .map((t) => t.ticketId)
    .join(',');

  useEffect(() => {
    if (!dueForEscalation) return;
    dueForEscalation.split(',').forEach((ticketId) => {
      if (escalationInFlight.has(ticketId)) return;
      const ticket = tickets.find((t) => t.ticketId === ticketId);
      if (!ticket) return;
      escalationInFlight.add(ticketId);
      escalateForSlaBreach(ticket, updateRecord, createRecord).catch((err) => {
        console.error(`[slaEscalationSweep] failed to auto-escalate ${ticketId}:`, err);
        escalationInFlight.delete(ticketId); // let a future sweep retry
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueForEscalation, updateRecord, createRecord]);
}

// Exported so any screen rendering the audit trail can distinguish this
// system action from a human agent action by its employeeUser value.
export { SYSTEM_ACTOR as SLA_AUTO_ESCALATION_ACTOR };

import { formatDateTime } from '../../../lib/format';
import { Input } from '../../../components/primitives/Input';
import type { EntityKind } from '../../../engines/mockDataEngine';
import type { Ticket } from './ticketDetailModel';

interface Props {
  ticket: Ticket;
  updateRecord: (kind: EntityKind, key: string, id: string, patch: Record<string, unknown>) => Promise<unknown> | unknown;
}

export function TicketDetailsTab({ ticket, updateRecord }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-[length:var(--fs-body)]">
      <div><dt className="text-[length:var(--fs-caption)] text-fg">Issue</dt><dd className="text-fg">{ticket.actualIssue ?? '-'}</dd></div>
      <div><dt className="text-[length:var(--fs-caption)] text-fg">Priority</dt><dd className="text-fg">{ticket.priority}</dd></div>
      <div><dt className="text-[length:var(--fs-caption)] text-fg">Resolution Code</dt><dd className="text-fg">{ticket.resolutionCode ?? '-'}</dd></div>
      <div><dt className="text-[length:var(--fs-caption)] text-fg">Hashtags</dt><dd className="text-fg">{(ticket.hashtags ?? []).join(', ') || '-'}</dd></div>
      <div><dt className="text-[length:var(--fs-caption)] text-fg">SLA Target</dt><dd className="text-fg">{ticket.slaTargetHours ? `${ticket.slaTargetHours}h, due ${ticket.slaDueAt ? formatDateTime(ticket.slaDueAt) : '-'}` : '-'}</dd></div>
      <div><dt className="text-[length:var(--fs-caption)] text-fg">Reopen Count</dt><dd className="text-fg">{ticket.reopenCount ?? 0}</dd></div>
      {ticket.category === 'Disconnection' && (
        <div><dt className="text-[length:var(--fs-caption)] text-fg">Resolution Code (Retention)</dt><dd className="text-fg">{ticket.retentionResolutionCode ?? '-'}</dd></div>
      )}
      <div className="col-span-2">
        <dt className="text-[length:var(--fs-caption)] text-fg mb-1">L3 Reference (RES-07 - editable while Not Solved)</dt>
        <Input
          aria-label="L3 Reference"
          placeholder="External L3 ticket reference"
          value={ticket.l3Reference ?? ''}
          disabled={ticket.status !== 'Not Solved'}
          onChange={(e) => updateRecord('trouble-tickets', 'ticketId', ticket.ticketId, { l3Reference: e.target.value })}
        />
      </div>
      {(ticket.escalations ?? []).length > 0 && (
        <div className="col-span-2">
          <dt className="text-[length:var(--fs-caption)] text-fg mb-1">Escalation History</dt>
          <ul className="list-disc list-inside text-fg text-[length:var(--fs-caption)]">
            {(ticket.escalations ?? []).map((e, i) => (
              <li key={i}>{e.reason} - {formatDateTime(e.escalatedAt)} by {e.escalatedBy}</li>
            ))}
          </ul>
        </div>
      )}
    </dl>
  );
}

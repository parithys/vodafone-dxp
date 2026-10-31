import { badgeVariantFor } from '../../../lib/statusTone';
import { formatDateTime } from '../../../lib/format';
import { Badge } from '../../../components/primitives/Badge';
import type { OsbNotification, Ticket } from './ticketDetailModel';

interface Props {
  ticket: Ticket;
  ragVariant: 'filled-neutral' | 'danger' | 'warning' | 'success';
  ragLabel: string;
  notesCount: number;
  slaMessage: string | undefined;
  surveyNotifications: OsbNotification[];
}

export function TicketHeaderCard({ ticket, ragVariant, ragLabel, notesCount, slaMessage, surveyNotifications }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-[length:var(--fs-h4)] font-bold text-fg">Ticket {ticket.ticketId}</h1>
        <Badge variant={badgeVariantFor(ticket.status)}>{ticket.status}</Badge>
        <Badge variant={ragVariant}>SLA: {ragLabel}</Badge>
        <span className="ml-auto flex items-center gap-1 text-fg-2" title="Notifications">
          🔔 <span className="text-[length:var(--fs-caption)]">{notesCount}</span>
        </span>
      </div>
      <p className="text-fg-2 mb-1">
        Customer: {ticket.customerId} · {ticket.category}{ticket.area ? ` - ${ticket.area}` : ''} · Queue <Badge variant="outlined-red">{ticket.queue}</Badge>
      </p>
      <p className="text-fg-2 text-[length:var(--fs-caption)]">
        Assigned to: {ticket.assignedTo ?? 'Unassigned'} · {slaMessage}
      </p>
      <p className="text-fg-2 text-[length:var(--fs-caption)] mt-1">
        Customer feedback survey:{' '}
        {surveyNotifications.length > 0 ? (
          <span>Triggered on {formatDateTime(surveyNotifications[surveyNotifications.length - 1].dbTimestamp)}</span>
        ) : (
          <span className="italic text-muted">Not Yet Triggered</span>
        )}
      </p>
    </div>
  );
}

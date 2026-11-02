import { formatDateTime } from '../../../lib/format';
import type { Ticket } from './ticketDetailModel';

interface Props {
  attachments: NonNullable<Ticket['attachments']>;
  terminal: boolean;
  attach: (file: File) => void;
}

export function TicketAttachmentsTab({ attachments, terminal, attach }: Props) {
  return (
      <div className="space-y-2">
        {attachments.length === 0 && <p className="text-secondary">No attachments.</p>}
        {attachments.map((a, i) => (
          <div key={i} className="row-between text-[length:var(--fs-body)] row-rule pb-1">
            <span className="text-fg">{a.name} ({Math.round(a.size / 1024)} KB)</span>
            <span className="caption-muted">{formatDateTime(a.uploadedAt)}</span>
          </div>
        ))}
        {terminal ? (
          <p className="caption-muted">Attachments are blocked on Closed/Cancelled tickets (ATT-03).</p>
        ) : (
          <input
            type="file"
            aria-label="Upload attachment"
            className="caption-secondary"
            onChange={(e) => e.target.files?.[0] && attach(e.target.files[0])}
          />
        )}
      </div>
  );
}

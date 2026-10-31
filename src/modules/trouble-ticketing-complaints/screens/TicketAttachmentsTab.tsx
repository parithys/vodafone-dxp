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
        {attachments.length === 0 && <p className="text-fg-2 text-[length:var(--fs-body)]">No attachments.</p>}
        {attachments.map((a, i) => (
          <div key={i} className="flex items-center justify-between text-[length:var(--fs-body)] border-b border-border-soft pb-1 last:border-0">
            <span className="text-fg">{a.name} ({Math.round(a.size / 1024)} KB)</span>
            <span className="text-[length:var(--fs-caption)] text-muted">{formatDateTime(a.uploadedAt)}</span>
          </div>
        ))}
        {terminal ? (
          <p className="text-[length:var(--fs-caption)] text-muted">Attachments are blocked on Closed/Cancelled tickets (ATT-03).</p>
        ) : (
          <input
            type="file"
            aria-label="Upload attachment"
            className="text-[length:var(--fs-caption)] text-fg-2"
            onChange={(e) => e.target.files?.[0] && attach(e.target.files[0])}
          />
        )}
      </div>
  );
}

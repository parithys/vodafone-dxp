import { formatDateTime } from '../../../lib/format';
import { EmptyState } from '../../../components/primitives/EmptyState';
import type { AuditRecord } from './ticketDetailModel';

interface Props {
  canSeeAudit: boolean;
  auditRecords: AuditRecord[];
}

export function TicketAuditTab({ canSeeAudit, auditRecords }: Props) {
  return canSeeAudit ? (
    <div className="space-y-2">
      {auditRecords.length === 0 && <EmptyState compact message="No audit events yet." />}
      {auditRecords.map((a) => (
        <div key={a.auditId} className="text-[length:var(--fs-caption)] border-b border-border-soft pb-1 last:border-0">
          <span className="text-fg">{a.fieldModified} → {a.newValue}</span>
          <span className="block text-muted">{a.employeeUser} · {formatDateTime(a.timestamp)}</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-fg-2 text-[length:var(--fs-body)]">Audit trail is role-restricted from this persona.</p>
  );
}

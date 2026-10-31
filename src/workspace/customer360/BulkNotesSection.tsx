import { formatDateTime } from '../../lib/format';
import { useEffect } from 'react';
import { useEntityStore, useKindPending } from '../../stores/entityStore';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';

interface BulkNote {
  noteId: string;
  content: string;
  accountIds: string[];
  postedAt: string;
}

// Agent 360 BNT-01/02/03: an agent views notes pushed by the system with
// posting date/time, including notes applied to multiple accounts at once
// (BNT-02) - this view just needs to match any of the customer's own
// account IDs against a note's accountIds array. No expiry rule is applied
// (BNT-03: "display irrespective of timeline... unless business confirms
// an expiry rule" - none has been confirmed).
export function BulkNotesSection({ accountIds }: { accountIds: string[] }) {
  const notes = (useEntityStore((s) => s.records['bulk-notes']) ?? []) as unknown as BulkNote[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const loading = useKindPending('bulk-notes'); // true until the list has arrived, so the table never flashes "empty" first
  const loadError = useEntityStore((s) => s.errors['bulk-notes']);

  useEffect(() => {
    loadKind('bulk-notes');
  }, [loadKind]);

  const applicable = notes
    .filter((n) => n.accountIds.some((id) => accountIds.includes(id)))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  return (
    <div>
      <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">Bulk Notes</h3>
      <ErrorBanner message={loadError} />
      {loading && <p className="text-muted text-[length:var(--fs-body)]">Loading…</p>}
      {!loading && applicable.length === 0 && (
        <p className="text-muted text-[length:var(--fs-body)]">No bulk notes apply to this customer's accounts.</p>
      )}
      {!loading && applicable.length > 0 && (
        <div className="space-y-2">
          {applicable.map((note) => (
            <div key={note.noteId} className="card p-4">
              <p className="text-fg font-medium text-[length:var(--fs-body)]">{note.content}</p>
              <p className="text-muted text-[length:var(--fs-caption-upper)] uppercase tracking-wide mt-1.5">
                Posted {formatDateTime(note.postedAt)} · applies to {note.accountIds.length} account
                {note.accountIds.length === 1 ? '' : 's'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

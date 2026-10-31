import { currentAgentId } from '../../stores/authStore';
import { EmptyState } from '../../components/primitives/EmptyState';
import { formatDate } from '../../lib/format';
import { useEffect, useRef, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { usePersonaStore } from '../../stores/personaStore';
import { isBackofficeOrPrivilegedPersona } from '../../engines/agentPrivilegeEngine';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Textarea } from '../../components/primitives/Textarea';
import { Button } from '../../components/primitives/Button';

interface BulkNote {
  noteId: string;
  templateId: string;
  content: string;
  accountIds: string[];
  postedAt: string;
  createdBy: string;
}

// Canned templates (OI-AGN-12 leaves the real catalogue open).
const TEMPLATES: Record<string, string> = {
  'TMPL-BILLCYCLE': 'System-wide notice: billing cycle processing will run one day later than usual this month.',
  'TMPL-KYC': 'Reminder: please update KYC documents before the end of this month to avoid service interruption.',
  'TMPL-OUTAGE': 'A service outage affected this account - a credit may be applied automatically.',
};

// Agent 360 BNT-04: Backoffice configures a bulk note using a template and
// applies it to one or more customer accounts at once (BNT-02). Role-gated
// via agentPrivilegeEngine.ts's evidenced Backoffice/Supervisory/Approval
// persona set (BR-03), same mechanism as Bell Notifications, pending a more
// specific matrix from VFQ (OI-AGN-13).
export function BulkNotesConfigSection() {
  const notes = (useEntityStore((s) => s.records['bulk-notes']) ?? []) as unknown as BulkNote[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const canConfigure = isBackofficeOrPrivilegedPersona(activePersonaId);

  const [templateId, setTemplateId] = useState('');
  const [content, setContent] = useState('');
  const [accountIdsInput, setAccountIdsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // See BellNotificationsSection.tsx for why this needs to be a ref, not
  // just the `submitting` state.
  const submittingRef = useRef(false);

  useEffect(() => {
    loadKind('bulk-notes');
  }, [loadKind]);

  const publish = async () => {
    // BNT-04/BR-03: enforced here too, not just via a hidden form - a
    // non-privileged persona's call can never actually create a record.
    if (!canConfigure) return;
    const accountIds = accountIdsInput
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    if (!content.trim() || accountIds.length === 0 || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await createRecord('bulk-notes', {
        noteId: `BNOTE-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        templateId: templateId || 'custom',
        content: content.trim(),
        accountIds,
        postedAt: new Date().toISOString(),
        createdBy: currentAgentId(),
      });
      pushToast('success', `Bulk note posted to ${accountIds.length} account(s).`);
      setTemplateId('');
      setContent('');
      setAccountIdsInput('');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div>
      {canConfigure ? (
        <div className="card p-5 mb-6">
          <h2 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-1">Configure a Bulk Note</h2>
          <p className="text-fg-2 text-[length:var(--fs-caption)] mb-4">
            Applies to every account ID listed - agents will see this note when viewing any of those customers.
          </p>
          <div className="space-y-3">
            <Select
              label="Template"
              placeholder="Start from a template (optional)"
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                setContent(TEMPLATES[e.target.value] ?? '');
              }}
              options={Object.keys(TEMPLATES).map((id) => ({ value: id, label: id }))}
            />
            <Textarea label="Note Content" value={content} onChange={(e) => setContent(e.target.value)} />
            <Input
              label="Account IDs (Comma-Separated)"
              placeholder="e.g. ACC-5001, ACC-5002"
              value={accountIdsInput}
              onChange={(e) => setAccountIdsInput(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Button variant="primary" onClick={publish} disabled={!content.trim() || !accountIdsInput.trim() || submitting}>
              Post Note
            </Button>
          </div>
        </div>
      ) : (
        <div className="card p-5 mb-6">
          <h2 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-1">Configure a Bulk Note</h2>
          <p className="text-fg-2 text-[length:var(--fs-caption)]">
            Restricted to Backoffice and privileged staff roles (Agent 360 BNT-04). This persona does not have
            configuration access.
          </p>
        </div>
      )}

      <h3 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-2">All Bulk Notes</h3>
      <div className="card divide-y divide-border-soft">
        {notes.length === 0 && <EmptyState compact message="No bulk notes posted yet." />}
        {notes.map((note) => (
          <div key={note.noteId} className="px-4 py-3">
            <p className="text-fg text-[length:var(--fs-body)]">{note.content}</p>
            <p className="text-muted text-[length:var(--fs-caption)] mt-0.5">
              {note.accountIds.join(', ')} · posted {formatDate(note.postedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

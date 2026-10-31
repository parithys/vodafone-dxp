import { currentAgentId } from '../../stores/authStore';
import { EmptyState } from '../../components/primitives/EmptyState';
import { formatDate } from '../../lib/format';
import { useEffect, useRef, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { usePersonaStore } from '../../stores/personaStore';
import { useBellNotificationExpirySweep } from '../../engines/bellNotificationExpiry';
import { isBackofficeOrPrivilegedPersona } from '../../engines/agentPrivilegeEngine';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Textarea } from '../../components/primitives/Textarea';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';

interface BellNotification {
  notificationId: string;
  customerId: string;
  templateId: string;
  message: string;
  status: 'Draft' | 'Published' | 'Expired';
  publishedAt: string | null;
  expiresAt: string | null;
  createdBy: string;
}

// Canned templates an agent can start from and edit before publishing
// (BIN-02) - VFQ hasn't provided the real template catalogue yet (OI-AGN-09).
const TEMPLATES: Record<string, string> = {
  'TMPL-INSTALL': 'Your fibre installation is scheduled - our technician will confirm the appointment time shortly.',
  'TMPL-MAINTENANCE': 'Planned network maintenance in your area - brief service interruptions may occur.',
  'TMPL-BILLING': 'A change to your billing cycle takes effect next period.',
};

// Agent 360 BIN-01/02: Backoffice/privileged staff configure and publish
// bell icon notifications against a customer, using a template + expiry
// date. Role-gated via agentPrivilegeEngine.ts's evidenced Backoffice/
// Supervisory/Approval persona set (BR-03) - see that file for exactly
// which personas qualify and why, pending a more specific matrix from VFQ
// (OI-AGN-11).
export function BellNotificationsSection() {
  const notifications = (useEntityStore((s) => s.records['bell-notifications']) ?? []) as unknown as BellNotification[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const canConfigure = isBackofficeOrPrivilegedPersona(activePersonaId);

  const [customerId, setCustomerId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // A ref, not just the `submitting` state: two click dispatches landing in
  // the same synchronous tick both read `submitting` as stale `false`,
  // since a state update isn't visible until the next render. The ref
  // updates immediately, so the second call sees it and bails out -
  // observed in practice as this handler otherwise creating two identical
  // records per single click.
  const submittingRef = useRef(false);

  useEffect(() => {
    loadKind('bell-notifications');
  }, [loadKind]);
  useBellNotificationExpirySweep();

  const reset = () => {
    setCustomerId('');
    setTemplateId('');
    setMessage('');
    setExpiresAt('');
  };

  const save = async (status: 'Draft' | 'Published') => {
    // BIN-01/BR-03: enforced here too, not just via disabled buttons - a
    // non-privileged persona's call can never actually create a record.
    if (!canConfigure) return;
    // BR-04: publishing (not drafting) must confirm an expiry before going out.
    if (status === 'Published' && !expiresAt) return;
    if (!customerId.trim() || !message.trim() || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await createRecord('bell-notifications', {
        notificationId: `BELL-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        customerId: customerId.trim(),
        templateId: templateId || 'custom',
        message: message.trim(),
        status,
        publishedAt: status === 'Published' ? new Date().toISOString() : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        createdBy: currentAgentId(),
      });
      pushToast('success', status === 'Published' ? 'Notification published.' : 'Notification saved as draft.');
      reset();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Captured once per mount rather than read impurely during render - see
  // BellNotificationBanner.tsx for the same trade-off applied there.
  const [now] = useState(() => Date.now());
  const displayStatus = (n: BellNotification) =>
    n.status === 'Published' && n.expiresAt && new Date(n.expiresAt).getTime() < now ? 'Expired' : n.status;

  return (
    <div>
      {canConfigure ? (
        <div className="card p-5 mb-6">
          <h2 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-1">Configure a Notification</h2>
          <p className="text-fg-2 text-[length:var(--fs-caption)] mb-4">
            Notifications appear as a banner on the customer's Customer 360 screen until they expire - agents cannot dismiss them
            manually (BIN-06).
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Customer ID" placeholder="e.g. CUST-1001" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
            <Input
              label="Expiry Date"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              helperText="Required to publish - optional only while saving as a draft."
            />
            <div className="col-span-2">
              <Select
                label="Template"
                placeholder="Start from a template (optional)"
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  setMessage(TEMPLATES[e.target.value] ?? '');
                }}
                options={Object.keys(TEMPLATES).map((id) => ({ value: id, label: id }))}
              />
            </div>
            <div className="col-span-2">
              <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => save('Draft')} disabled={!customerId.trim() || !message.trim() || submitting}>
              Save as draft
            </Button>
            <Button
              variant="primary"
              onClick={() => save('Published')}
              disabled={!customerId.trim() || !message.trim() || !expiresAt || submitting}
            >
              Publish
            </Button>
          </div>
        </div>
      ) : (
        <div className="card p-5 mb-6">
          <h2 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-1">Configure a Notification</h2>
          <p className="text-fg-2 text-[length:var(--fs-caption)]">
            Restricted to Backoffice and privileged staff roles (Agent 360 BIN-01). This persona does not have
            configuration access.
          </p>
        </div>
      )}

      <h3 className="text-[length:var(--fs-body-lg)] font-bold text-fg mb-2">All Notifications</h3>
      <div className="card divide-y divide-border-soft">
        {notifications.length === 0 && <EmptyState compact message="No notifications configured yet." />}
        {notifications.map((n) => (
          <div key={n.notificationId} className="px-4 py-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-fg text-[length:var(--fs-body)]">
                {n.customerId} - <span className="text-fg-2">{n.message}</span>
              </div>
              {n.expiresAt && (
                <div className="text-muted text-[length:var(--fs-caption)] mt-0.5">Expires {formatDate(n.expiresAt)}</div>
              )}
            </div>
            <Badge variant={displayStatus(n) === 'Published' ? 'success' : displayStatus(n) === 'Expired' ? 'filled-neutral' : 'warning'}>
              {displayStatus(n)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

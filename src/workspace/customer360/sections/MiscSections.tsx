import { useState } from 'react';
import { EmptyState } from '../../../components/primitives/EmptyState';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Drawer } from '../../../capabilities';
import { Select } from '../../../components/primitives/Select';
import { Input } from '../../../components/primitives/Input';
import { Textarea } from '../../../components/primitives/Textarea';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useEntityStore } from '../../../stores/entityStore';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { formatAmountAny } from '../../../lib/format';

// Seven of Customer 360's thirteen sections are single-purpose read-only
// views over data customer360Engine already joined - no unique interaction
// logic distinguishes them the way Mobile/Fibre/Billing/Orders/Tickets have
// their own. Grouped in one file rather than seven near-identical
// boilerplate files; each is still a real, independently reachable tab.

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">{children}</h3>;
}

const INTERACTION_CHANNELS = ['Email', 'SMS', 'Phone', 'Call Center', 'Store', 'Digital App'] as const;

// CUS-001-VEW-01: channel taxonomy now includes Email/SMS/Phone alongside
// the pre-existing Call Center/Store/Digital App values, so the requirement
// is satisfiable regardless of which channel an interaction was actually
// logged through. CUS-001-VEW-02: Log Interaction generates a real unique
// interaction ID at creation time (INT-<timestamp>), unlike the seeded
// activityNumber values on legacy rows, which predate this action existing.
export function InteractionsSection({
  data,
  onLogged,
}: {
  data: Customer360Data;
  /** Customer360Layout's `data` state is a one-time fetch, not reactive to
   * entityStore mutations - without this callback, a just-logged interaction
   * would only appear after navigating away and back (the record is
   * correctly persisted either way, but the visible table would go stale
   * until then). Mirrors DemographicEditDrawer's onSaved pattern. */
  onLogged?: (record: Record<string, unknown>) => void;
}) {
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [logOpen, setLogOpen] = useState(false);
  const [channel, setChannel] = useState<(typeof INTERACTION_CHANNELS)[number]>('Phone');
  const [topic, setTopic] = useState('');
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);

  const accountId = data.accounts[0]?.accountId;

  const logInteraction = async () => {
    if (!accountId || !topic.trim()) return;
    setSaving(true);
    const interactionId = `INT-${Date.now().toString().slice(-8)}`;
    const record = {
      activityNumber: interactionId,
      accountId,
      channel,
      topic,
      comments,
      status: 'Solved',
      transactionDate: new Date().toISOString().slice(0, 10),
    };
    await createRecord('customer-activities', record);
    onLogged?.(record);
    setSaving(false);
    setLogOpen(false);
    setTopic('');
    setComments('');
    pushToast('success', `Interaction ${interactionId} logged.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>Interactions</SectionTitle>
        <Button variant="primary" compact onClick={() => setLogOpen(true)}>
          Log Interaction
        </Button>
      </div>
      <DataTable
        rows={data.activities}
        rowKey={(r) => String(r.activityNumber)}
        emptyMessage="No interaction history on file."
        columns={[
          { key: 'activityNumber', header: 'Interaction ID' },
          { key: 'transactionDate', header: 'Date' },
          { key: 'channel', header: 'Channel' },
          { key: 'topic', header: 'Topic' },
          { key: 'comments', header: 'Comments' },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge variant={r.status === 'Solved' ? 'success' : 'filled-neutral'}>{String(r.status)}</Badge>,
          },
        ]}
      />
      <Drawer
        open={logOpen}
        onClose={() => setLogOpen(false)}
        title="Log Interaction"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={saving || !topic.trim()} onClick={logInteraction}>
              {saving ? 'Logging…' : 'Log Interaction'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value as (typeof INTERACTION_CHANNELS)[number])}
            options={INTERACTION_CHANNELS.map((c) => ({ value: c, label: c }))}
          />
          <Input label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <Textarea label="Comments" value={comments} onChange={(e) => setComments(e.target.value)} />
        </div>
      </Drawer>
    </div>
  );
}

// CUS-001-VEW-03: sent SMS/email communications tied directly to the
// customer (customer-communications.json), not scoped to order-triggered
// SMS the way NotificationsSection's osb-notifications join is - that join
// stays as-is for its own order-notification purpose; this is the general
// "sent communications" view the requirement actually asks for.
export function CommunicationsSection({ data }: { data: Customer360Data }) {
  return (
    <DataTable
      rows={data.communications}
      rowKey={(r) => String(r.communicationId)}
      emptyMessage="No sent communications on file for this customer."
      columns={[
        { key: 'sentAt', header: 'Sent' },
        {
          key: 'channel',
          header: 'Channel',
          render: (r) => <Badge variant={r.channel === 'Email' ? 'accent' : 'filled-neutral'}>{String(r.channel)}</Badge>,
        },
        { key: 'subject', header: 'Subject' },
        { key: 'messageText', header: 'Message' },
        { key: 'deliveryState', header: 'Delivery State' },
      ]}
    />
  );
}

export function NotificationsSection({ data }: { data: Customer360Data }) {
  return (
    <DataTable
      rows={data.notifications}
      rowKey={(r) => String(r.messageId)}
      emptyMessage="No notifications on file for this customer's orders."
      columns={[
        { key: 'dbTimestamp', header: 'Sent' },
        { key: 'orderId', header: 'Order #' },
        { key: 'smsText', header: 'Message' },
        { key: 'state', header: 'Delivery state' },
      ]}
    />
  );
}

export function ProductsAssetsSection({ data }: { data: Customer360Data }) {
  return (
    <div>
      <SectionTitle>Products &amp; Assets</SectionTitle>
      <DataTable
        rows={data.installedAssets}
        rowKey={(r) => String(r.installedAssetId)}
        emptyMessage="No installed products or assets on file."
        columns={[
          { key: 'productServiceName', header: 'Product / service' },
          { key: 'serviceId', header: 'Service ID' },
          { key: 'effectiveFrom', header: 'Since' },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge variant={r.status === 'Active' ? 'success' : 'filled-neutral'}>{String(r.status)}</Badge>,
          },
        ]}
      />
    </div>
  );
}

export function RecentActivitiesSection({ data }: { data: Customer360Data }) {
  type TimelineEntry = { at: string; label: string };
  const entries: TimelineEntry[] = [
    ...data.activities.map((a) => ({ at: String(a.transactionDate ?? ''), label: `${a.topic ?? a.journey ?? 'Activity'} - ${a.comments ?? ''}` })),
    ...data.payments.map((p) => ({ at: String(p.capturedAt ?? ''), label: `Payment captured - ${p.chargeType ?? ''} (${formatAmountAny(p.amountQar ?? '')} QAR)` })),
    ...data.identityDocuments.map((d) => ({ at: String(d.scannedAt ?? ''), label: `Identity document scanned - ${d.documentType ?? ''}` })),
  ]
    .filter((e) => e.at)
    .sort((a, b) => (a.at < b.at ? 1 : -1));

  if (entries.length === 0) {
    return <EmptyState compact message="No dated activity on file for this customer yet." />;
  }
  return (
    <div>
      <SectionTitle>Recent Activities</SectionTitle>
      <ul className="space-y-2">
        {entries.map((entry, i) => (
          <li key={i} className="flex gap-3 card p-3">
            <span className="text-muted text-[length:var(--fs-caption)] shrink-0 w-40">{entry.at}</span>
            <span className="text-fg text-[length:var(--fs-body)]">{entry.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

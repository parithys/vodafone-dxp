import { useEffect, useState } from 'react';
import { useEntityStore } from '../stores/entityStore';

interface BellNotification {
  notificationId: string;
  status: 'Draft' | 'Published' | 'Expired';
  expiresAt: string | null;
}

// Agent 360 BIN-07: "System shall remove bell icon notification after the
// preconfigured expiration interval." Both consumers (BellNotificationBanner,
// BellNotificationsSection) previously only ever *derived* expiry at render
// time - the stored `status` field never actually transitioned to 'Expired',
// so any future consumer reading `status` directly (rather than re-deriving
// the same check) would see a stale 'Published'. This sweep makes the
// persisted status the real source of truth; call it once from any screen
// that loads bell-notifications.
export function useBellNotificationExpirySweep() {
  const notifications = (useEntityStore((s) => s.records['bell-notifications']) ?? []) as unknown as BellNotification[];
  const updateRecord = useEntityStore((s) => s.updateRecord);
  // Captured once per mount rather than read impurely during render - same
  // trade-off as BellNotificationBanner/BellNotificationsSection's own
  // display-side expiry checks.
  const [now] = useState(() => Date.now());

  // `notifications` is a fresh `[]` literal every render until the entity
  // loads, which would otherwise re-fire this effect on every render - key
  // the effect off a stable string of just the ids actually due to expire.
  const dueForExpiry = notifications
    .filter((n) => n.status === 'Published' && n.expiresAt && new Date(n.expiresAt).getTime() < now)
    .map((n) => n.notificationId)
    .join(',');

  useEffect(() => {
    if (!dueForExpiry) return;
    dueForExpiry.split(',').forEach((id) => updateRecord('bell-notifications', 'notificationId', id, { status: 'Expired' }));
  }, [dueForExpiry, updateRecord]);
}

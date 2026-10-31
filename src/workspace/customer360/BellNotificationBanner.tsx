import { useEffect, useState } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { usePersonaStore } from '../../stores/personaStore';
import { Icon } from '../../components/primitives/Icon';
import { useBellNotificationExpirySweep } from '../../engines/bellNotificationExpiry';
import { canViewBellNotifications } from '../../engines/agentPrivilegeEngine';

interface BellNotification {
  notificationId: string;
  customerId: string;
  templateId?: string;
  message: string;
  status: 'Draft' | 'Published' | 'Expired';
  publishedAt: string | null;
  expiresAt: string | null;
}

const BELL_ICON = 'M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8z M9.5 17a2.5 2.5 0 0 0 5 0';

// Human-readable lead-in derived from the template a notification was
// published from - turns one long sentence into a scannable title +
// description, using data already on the record rather than inventing new
// fields (e.g. a linked order, which no bell-notification record carries).
const TEMPLATE_TITLE: Record<string, string> = {
  'TMPL-INSTALL': 'Installation scheduled',
  'TMPL-MAINTENANCE': 'Network maintenance',
  'TMPL-BILLING': 'Billing update',
};

// Agent 360 BIN-03/04/05/06: banner visible across Customer 360 for this
// customer only (BIN-04), latest-first (BIN-05), no dismiss/expire action
// exposed to the agent (BIN-06) - it disappears on its own once expiresAt
// passes (BIN-07), evaluated client-side against "now" on every render.
// BIN-04's "access permissions" clause is more than customerId scoping: the
// viewing persona must also be a genuine internal agent (see
// agentPrivilegeEngine.ts) - external/customer-side/system-type personas
// never see internal notification banners, regardless of which customer
// record they're looking at.
export function BellNotificationBanner({ customerId }: { customerId: string }) {
  const notifications = (useEntityStore((s) => s.records['bell-notifications']) ?? []) as unknown as BellNotification[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  // Captured once per mount rather than read impurely during render - this
  // page is short-lived enough (an agent viewing one customer) that
  // re-evaluating expiry only on mount/data-change, not on every render, is
  // an acceptable trade-off for a demo/mock environment.
  const [now] = useState(() => Date.now());

  useEffect(() => {
    loadKind('bell-notifications');
  }, [loadKind]);
  useBellNotificationExpirySweep();

  // BIN-04 now has its own capability rather than borrowing the
  // agent-self-service check, which was the closest available proxy
  // under the 66-persona model.
  if (!canViewBellNotifications(activePersonaId)) return null;

  const active = notifications
    .filter(
      (n) =>
        n.customerId === customerId &&
        n.status === 'Published' &&
        (!n.expiresAt || new Date(n.expiresAt).getTime() > now)
    )
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());

  if (active.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {active.map((n) => (
        <div
          key={n.notificationId}
          className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--warn-border)] bg-tone-warn px-4 py-3"
        >
          <Icon path={BELL_ICON} className="w-4.5 h-4.5 text-[var(--warn-text)] shrink-0 mt-0.5" />
          <div>
            <p className="text-[var(--warn-text)] font-medium text-[length:var(--fs-body)]">
              {TEMPLATE_TITLE[n.templateId ?? ''] ?? 'Notice'}
            </p>
            <p className="text-fg text-[length:var(--fs-body)] mt-0.5">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

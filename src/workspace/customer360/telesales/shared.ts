import { dateTime, type Ctx } from './TelesalesOverview';
import { strOrEmpty as str } from '../../../lib/values';
import { formatQarAny } from '../../../lib/format';

export type Rec = Record<string, unknown>;

export const demoOf = (ctx: Ctx) => (ctx.data.overviewDemo[0] ?? {}) as Rec;

export const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export const rowDate = (iso: unknown) => {
  const t = dateTime(iso);
  return t.t ? `${t.d} ${t.t}` : t.d;
};

/** Everything the page's activity-style tables draw on, newest first. */
export function activityEntries(ctx: Ctx) {
  const { data } = ctx;
  return [
    ...data.activities.map((a) => ({ at: a.transactionDate, type: str(a.activityName ?? a.topic ?? a.journey ?? a.actionTaken ?? 'Activity'), detail: str(a.comments ?? a.activityReason ?? a.notes), channel: str(a.channel ?? '-'), tone: 'blue' as const })),
    ...data.payments.map((p) => ({ at: p.capturedAt, type: 'Payment', detail: `${formatQarAny(str(p.amountQar))}`, channel: str(p.captureChannel ?? '-'), tone: 'green' as const })),
    ...data.orders.map((o) => ({ at: o.createdAt ?? o.orderDate, type: str(o.orderType ?? 'Order'), detail: `${str(o.orderId)} - ${str(o.status)}`, channel: str(o.sourceChannel ?? '-'), tone: 'green' as const })),
    ...data.tickets.map((t) => ({ at: t.createdAt, type: 'Trouble Ticket', detail: `${str(t.ticketId)} - ${str(t.status)}`, channel: str(t.channel ?? '-'), tone: 'red' as const })),
    ...data.simSwapOrders.map((s) => ({ at: s.createdAt ?? s.requestedAt, type: 'SIM Swap', detail: str(s.simSwapReason ?? s.status), channel: 'Store', tone: 'amber' as const })),
  ]
    .filter((e) => e.at)
    .sort((a, b) => str(b.at).localeCompare(str(a.at)));
}

export const toneColor = { blue: 'bg-[var(--telesales-blue)]', green: 'bg-success', red: 'bg-danger', amber: 'bg-[var(--telesales-amber)]' } as const;

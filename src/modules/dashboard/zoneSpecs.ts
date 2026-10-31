import { ZONE_ICONS as I, type ZoneSpec } from './DashboardZone';
import type { ProductZoneVariant } from './dashboardLayout';
import type { ZoneMetrics } from './useZoneMetrics';
import { TILE_PILLS } from './heroFigures';

/** Sentence-case a metric label ("Open Tasks" -> "Open tasks") for the softer landing-page tiles. */
const soft = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

// Zone content, kept out of the renderer so the two zones are data and the
// component is layout. `compact` trims the tile/card set for a half-width
// Hybrid column - the same zone at lower density, not a different zone.

interface RecentCustomer {
  customerId: string;
  name: string;
  segment: string;
}

/** `framing` is the role's relationship to the zone; `compact` is only density.
 * They were conflated at first, so a Hybrid role focusing on product saw the
 * zone retitled "My Portfolio" - a product-manager framing for someone who is
 * an oversight role. Size must never change what a zone claims to be. */
export type ZoneFraming = 'primary' | 'one-of-two';

export function customerOpsSpec(
  m: ZoneMetrics,
  opts: {
    compact: boolean;
    framing: ZoneFraming;
    regional: boolean;
    regionLabel: string;
    recentCustomers: RecentCustomer[];
  }
): ZoneSpec {
  const tiles = opts.compact
    ? m.taskTiles.filter((t) => ['open', 'priority', 'draft-orders'].includes(t.key))
    : m.taskTiles;

  const allCards: ZoneSpec['cards'] = [
    { label: 'Open Tickets', sub: 'Across all queues', value: m.openTickets, icon: I.headset, loadingKind: 'trouble-tickets' },
    // A role that can decide orders sees how many are waiting on it; everyone else keeps the shared total.
    m.ordersAwaitingMyDecision !== undefined
      ? { label: 'Orders Awaiting Your Decision', sub: 'routed to your role', value: m.ordersAwaitingMyDecision, icon: I.clipboard, loadingKind: 'orders' }
      : { label: opts.compact ? 'Orders pending' : 'Orders pending approval', sub: opts.compact ? 'Awaiting manager approval' : 'awaiting a manager', value: m.ordersPendingApproval, icon: I.clipboard, loadingKind: 'orders' },
    { label: 'Total Leads', sub: 'created this session', value: m.totalLeads, icon: I.users, loadingKind: 'leads' },
    { label: 'SIM Swaps Pending', sub: 'awaiting approval', value: m.simSwapsPending, icon: I.simCard, loadingKind: 'sim-swap-orders' },
    {
      label: 'Customers on File',
      // Regional roles see the seeded rollup for their scope; everyone else
      // sees the real directory count. The subtext says which, so a figure of
      // 182 next to a directory of 8 is never mistaken for a bug.
      sub: opts.regional ? `in ${opts.regionLabel} (seeded rollup)` : 'in the mock directory',
      value: opts.regional ? m.regionalCustomersOnFile : m.customersOnFile,
      icon: I.users2,
      loadingKind: opts.regional ? 'channel-performance' : 'customers',
    },
    { label: 'Bulk Jobs Processed', sub: 'incl. Pre-to-Post migrations', value: m.bulkJobsProcessed, icon: I.refresh, loadingKind: 'bulk-activation-orders' },
  ];

  return {
    heading: opts.framing === 'one-of-two' ? 'Customer operations' : 'My Tasks',
    subheading: opts.framing === 'one-of-two' ? 'Your daily service workload' : undefined,
    headingIcon: I.users2,
    tiles: tiles.map((t) => ({ ...t, label: soft(t.label), pill: TILE_PILLS[t.key], to: `/tasks?filter=${t.key}`, loadingKind: 'tasks' })),
    cards: opts.compact ? allCards.slice(0, 2) : allCards,
    actions: opts.compact
      ? [
          { label: 'New Connection', path: '/mobile/start-connection' },
          { label: 'Create Ticket', path: '/support' },
        ]
      : [
          { label: 'New Connection', path: '/mobile/start-connection' },
          { label: 'New Postpaid Connection', path: '/mobile/start-connection' },
          { label: 'New Fixed Line', screenId: 'SCR-043' },
          { label: 'Start a Lead', path: '/sales' },
          { label: 'Create Ticket', path: '/support' },
        ],
    listTitle: opts.compact ? undefined : 'Recently viewed customers',
    listEmpty: 'Customers you look up will show up here for quick return access.',
    listItems: opts.compact
      ? undefined
      : opts.recentCustomers.map((c) => ({
          id: c.customerId,
          primary: c.name,
          secondary: `${c.customerId} · ${c.segment}`,
          to: `/customer/${c.customerId}`,
        })),
  };
}

export function productWorkSpec(
  m: ZoneMetrics,
  opts: {
    variant: ProductZoneVariant;
    compact: boolean;
    framing: ZoneFraming;
    regionLabel: string;
    regional: boolean;
    /** Customers waiting in the role's live walk-in queue; null for a role with no queue. */
    queueWaiting?: number | null;
  }
): ZoneSpec {
  const perf = m.perf;
  const period = opts.regional ? `${opts.regionLabel}, this quarter` : 'this quarter';

  if (opts.variant === 'counter-sales') {
    return {
      heading: 'My Sales',
      subheading: 'Your orders, drafts, leads and queue',
      headingIcon: I.clipboard,
      tiles: [
        { key: 'my-orders', label: 'My Orders', count: m.myOrders, to: '/orders', loadingKind: 'orders' },
        { key: 'drafts', label: 'Drafts', count: m.taskTiles.find((t) => t.key === 'draft-orders')?.count ?? 0, to: '/tasks?filter=draft-orders', loadingKind: 'tasks' },
        { key: 'my-leads', label: 'Leads', count: m.myLeads, to: '/leads', loadingKind: 'leads' },
        ...(opts.queueWaiting != null ? [{ key: 'queue', label: 'Queue', count: opts.queueWaiting }] : []),
      ],
      cards: [],
      actions: [
        { label: 'New Connection', path: '/mobile/start-connection' },
        { label: 'Resume a Draft', path: '/tasks?filter=draft-orders' },
      ],
    };
  }

  if (opts.variant === 'field') {
    return {
      heading: 'Field & Workforce',
      headingIcon: I.chart,
      tiles: [
        { key: 'wfm', label: 'Open Activities', count: m.wfmActivitiesOpen, to: '/tasks', loadingKind: 'wfm-activities' },
        { key: 'appointments', label: 'Appointments', count: m.appointmentsBooked, to: '/fibre-home/plans-installation', loadingKind: 'appointments' },
        { key: 'assigned', label: 'Assigned Tasks', count: m.taskTiles[0]?.count ?? 0, to: '/tasks?filter=open', loadingKind: 'tasks' },
      ],
      cards: [
        { label: 'Activities Not Completed', sub: 'across WFM/OFS', value: m.wfmActivitiesOpen, icon: I.chart, loadingKind: 'wfm-activities' },
        { label: 'Priority Tasks', sub: 'flagged for today', value: m.taskTiles[3]?.count ?? 0, icon: I.alert, loadingKind: 'tasks' },
      ],
      actions: [
        { label: 'Serial Number Check', screenId: 'SCR-093' },
        { label: 'View Activities', path: '/tasks' },
      ],
    };
  }

  if (opts.variant === 'fulfilment') {
    return {
      heading: 'Fulfilment Queues',
      headingIcon: I.checkCircle,
      tiles: [
        { key: 'queue', label: 'Orders In Flight', count: m.fulfilmentQueue, to: '/orders', loadingKind: 'orders' },
        { key: 'approval', label: 'Awaiting Approval', count: m.ordersPendingApproval, to: '/orders', loadingKind: 'orders' },
        { key: 'verification', label: 'Verification Backlog', count: m.verificationBacklog, to: '/orders', loadingKind: 'order-approvals' },
        { key: 'simswap', label: 'SIM Swaps Pending', count: m.simSwapsPending, to: '/mobile/service-management', loadingKind: 'sim-swap-orders' },
        { key: 'bulk', label: 'Bulk Jobs Processed', count: m.bulkJobsProcessed, to: '/orders', loadingKind: 'bulk-activation-orders' },
      ],
      cards: [
        { label: 'Orders in Flight', sub: 'not yet completed', value: m.fulfilmentQueue, icon: I.checkCircle, loadingKind: 'orders' },
        { label: 'Verification Backlog', sub: 'documents to check', value: m.verificationBacklog, icon: I.alert, loadingKind: 'order-approvals' },
        { label: 'Open Tickets', sub: 'across all queues', value: m.openTickets, icon: I.ticket, loadingKind: 'trouble-tickets' },
      ],
      actions: [
        { label: 'Order Approval Queue', screenId: 'SCR-060' },
        { label: 'Bulk Jobs', screenId: 'SCR-183' },
        { label: 'My Sales Orders', screenId: 'SCR-059' },
      ],
    };
  }

  // 'catalogue' - the product/channel view.
  const allTiles = [
    { key: 'approvals', label: 'Pending Approvals', count: m.pendingApprovals, to: '/mobile', loadingKind: 'catalog-items' },
    { key: 'exceptions', label: 'Price Exceptions', count: m.priceExceptions, to: '/mobile', loadingKind: 'price-exceptions' },
    { key: 'campaigns', label: 'Campaigns Live', count: m.campaignsLive, to: '/mobile', loadingKind: 'campaigns' },
    { key: 'bundles', label: 'Bundles In Review', count: m.bundlesInReview, to: '/fibre-home', loadingKind: 'catalog-items' },
    { key: 'queued', label: 'Catalog Changes Queued', count: m.changesQueued, to: '/mobile', loadingKind: 'catalog-change-requests' },
  ];

  const allCards: ZoneSpec['cards'] = [
    { label: 'Mobile Attach Rate', sub: opts.regional ? period : 'Current quarter', value: perf ? `${perf.mobileAttachRatePct}%` : '-', icon: I.mobile, loadingKind: 'channel-performance' },
    { label: 'Fibre & Home Take-Up', sub: period, value: perf ? `${perf.fibreHomeTakeUpPct}%` : '-', icon: I.wifi, loadingKind: 'channel-performance' },
    { label: 'Lead → Activation', sub: 'last 30 days', value: perf ? `${perf.leadToActivationPct}%` : '-', icon: I.users, loadingKind: 'channel-performance' },
    { label: 'Top-Performing Plan', sub: perf?.topPerformingPlan ?? '-', value: perf ? `+${perf.topPerformingPlanDeltaPct}%` : '-', icon: I.tag, loadingKind: 'channel-performance' },
    {
      label: 'Channel Mix',
      sub: 'Retail · Direct · Tele',
      value: perf ? `${perf.channelMixRetailPct}/${perf.channelMixDirectPct}/${perf.channelMixTelePct}` : '-',
      icon: I.trending,
      loadingKind: 'channel-performance',
    },
    { label: 'Price Exceptions', sub: 'awaiting finance sign-off', value: m.priceExceptions, icon: I.alert, loadingKind: 'price-exceptions' },
  ];

  return {
    heading: opts.framing === 'one-of-two' ? 'Product performance' : 'My Portfolio',
    subheading: opts.framing === 'one-of-two' ? 'Commercial health at a glance' : undefined,
    cardTone: 'pink',
    headingIcon: I.tag,
    tiles: (opts.compact ? allTiles.filter((t) => ['approvals', 'campaigns', 'exceptions'].includes(t.key)) : allTiles).map((t) => ({ ...t, label: soft(t.label), pill: TILE_PILLS[t.key] })),
    cards: opts.compact ? [allCards[0], allCards[4]] : allCards,
    actions: opts.compact
      ? [{ label: 'Review Exceptions', path: '/mobile' }, { label: 'Start a Campaign', path: '/mobile' }]
      : [
          { label: 'Launch New Plan', path: '/new-connections' },
          { label: 'Update Bundle Pricing', path: '/fibre-home/plans-installation' },
          { label: 'Start a Campaign', path: '/mobile' },
          { label: 'Review Exceptions', path: '/mobile' },
        ],
    listTitle: opts.compact ? undefined : 'Recently updated products',
    listEmpty: 'Catalogue changes will show up here.',
    listItems: opts.compact
      ? undefined
      : m.recentCatalogItems.map((c) => ({
          id: c.catalogItemId ?? c.name,
          primary: c.name,
          secondary: c.productLine,
          badge: c.status,
        })),
  };
}

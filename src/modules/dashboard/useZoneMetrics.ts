import { useEffect } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { isVisibleToAgent } from '../../engines/agentTaskEngine';
import { usePersonaStore } from '../../stores/personaStore';
import { holdsApproveGrant, isSimSwapAwaitingDecision, ordersAwaitingDecisionBy } from '../../engines/approvalAuthority';
import { isClosedTicket, orderBucket } from '../../lib/statusTone';
import type { EntityKind } from '../../engines/mockDataEngine';

// Every kind either zone can need, loaded on mount regardless of which zones
// are currently shown. That is deliberate: a Hybrid role toggling Focus must
// not trigger a refetch, because Focus is layout, not navigation. It costs one
// extra load of small seed files on a Customer-First dashboard and buys the
// guarantee that switching Focus can never show a loading state.
const KINDS: EntityKind[] = [
  'trouble-tickets', 'orders', 'leads', 'sim-swap-orders', 'customers',
  'bulk-activation-orders', 'tasks', 'order-approvals', 'wfm-activities',
  'appointments', 'catalog-items', 'catalog-change-requests', 'price-exceptions',
  'campaigns', 'channel-performance',
];

interface Ticket { status: string }
interface Order { status: string }
interface SimSwapOrder { status: string }
interface BulkJob { overallStatus: string }
interface AgentTask { taskStatus: string; taskType: string; priorityFlag: boolean; assignedAgentId: string | null }
interface OrderApproval { approvalStatus?: string; status?: string }
interface WfmActivity { status?: string; activityStatus?: string }
interface Appointment { status?: string }
interface CatalogItem { catalogItemId: string; itemType: string; status: string; approvalStatus: string; name: string; productLine: string; updatedAt: string }
interface ChangeRequest { status: string }
interface PriceException { status: string }
interface Campaign { status: string }
interface ChannelPerf {
  scopeId: string;
  scopeLabel: string;
  mobileAttachRatePct: number;
  fibreHomeTakeUpPct: number;
  leadToActivationPct: number;
  topPerformingPlan: string;
  topPerformingPlanDeltaPct: number;
  channelMixRetailPct: number;
  channelMixDirectPct: number;
  channelMixTelePct: number;
  customersOnFile: number;
  catalogSyncedMinutesAgo: number;
}

export interface ZoneMetrics {
  taskTiles: { key: string; label: string; count: number }[];
  openTickets: number;
  ordersPendingApproval: number;
  /** Orders waiting on the signed-in role specifically; undefined when the role has no approval rights (the card stays the shared total). */
  ordersAwaitingMyDecision: number | undefined;
  totalLeads: number;
  /** The signed-in agent's own: orders they submitted (drafts are counted as Drafts, not here) and leads they own. */
  myOrders: number;
  myLeads: number;
  simSwapsPending: number;
  customersOnFile: number;
  bulkJobsProcessed: number;
  regionalCustomersOnFile: number;
  // product / work-queue side
  pendingApprovals: number;
  priceExceptions: number;
  campaignsLive: number;
  bundlesInReview: number;
  changesQueued: number;
  fulfilmentQueue: number;
  verificationBacklog: number;
  wfmActivitiesOpen: number;
  appointmentsBooked: number;
  perf: ChannelPerf | undefined;
  recentCatalogItems: CatalogItem[];
  loading: Record<string, boolean>;
  errors: Record<string, string | undefined>;
}

/** `scopeId` selects which channel-performance rollup to read. The caller
 * decides, because the choice is a persona policy (only an oversight role is
 * scoped to a region) and this hook has no business knowing about
 * capabilities. Passing the region unconditionally showed a Doha Central
 * attach rate to a national role. */
export function useZoneMetrics(scopeId: string): ZoneMetrics {
  const loadKind = useEntityStore((s) => s.loadKind);
  const records = useEntityStore((s) => s.records);
  const loading = useEntityStore((s) => s.loading);
  const errors = useEntityStore((s) => s.errors);
  const currentAgentId = useAuthStore((s) => s.profile?.userId);
  const currentJobTitle = useAuthStore((s) => s.profile?.jobTitle);
  const personaId = usePersonaStore((s) => s.activePersonaId);

  useEffect(() => {
    KINDS.forEach((k) => loadKind(k));
  }, [loadKind]);

  // Typed against EntityKind so a typo'd kind is a compile error rather than
  // a silently empty array (which would read as "nothing to show").
  const get = <T,>(kind: EntityKind) => (records[kind] ?? []) as unknown as T[];

  const tasks = get<AgentTask>('tasks');
  const openTasks = tasks
    .filter((t) => t.taskStatus !== 'Closed')
    .filter((t) => isVisibleToAgent(t.assignedAgentId, currentAgentId));

  const catalog = get<CatalogItem>('catalog-items');
  const perfRows = get<ChannelPerf>('channel-performance');
  const perf = perfRows.find((p) => p.scopeId === scopeId) ?? perfRows[0];

  const wfm = get<WfmActivity>('wfm-activities');
  const orderApprovals = get<OrderApproval>('order-approvals');

  return {
    taskTiles: [
      { key: 'open', label: 'Open Tasks', count: openTasks.filter((t) => t.taskStatus === 'Open').length },
      { key: 'in-progress', label: 'In Progress Tasks', count: openTasks.filter((t) => t.taskStatus === 'In Progress').length },
      { key: 'payments', label: 'Pending Payments', count: openTasks.filter((t) => t.taskType === 'Payment').length },
      { key: 'priority', label: 'Priority Tasks', count: openTasks.filter((t) => t.priorityFlag).length },
      { key: 'draft-orders', label: 'Draft Orders', count: openTasks.filter((t) => t.taskType === 'Draft Order').length },
    ],
    openTickets: get<Ticket>('trouble-tickets').filter((t) => !isClosedTicket(t.status)).length,
    ordersPendingApproval: get<Order>('orders').filter((o) => o.status === 'Submitted for Approval').length,
    ordersAwaitingMyDecision: holdsApproveGrant(personaId, 'SCR-061')
      ? ordersAwaitingDecisionBy(get<{ orderId: string; orderType: string; status: string; approverRole?: string; assignedApproverId?: string | null }>('orders'), { personaId, jobTitle: currentJobTitle, userId: currentAgentId }).length
      : undefined,
    totalLeads: get('leads').length,
    myOrders: get<{ createdBy?: string; status: string }>('orders').filter((o) => o.createdBy === currentAgentId && o.status !== 'Draft').length,
    myLeads: get<{ ownerId?: string | null }>('leads').filter((l) => l.ownerId === currentAgentId).length,
    simSwapsPending: get<SimSwapOrder>('sim-swap-orders').filter((s) => isSimSwapAwaitingDecision(s.status)).length,
    customersOnFile: get('customers').length,
    bulkJobsProcessed: get<BulkJob>('bulk-activation-orders')
      .filter((j) => j.overallStatus === 'Processed' || j.overallStatus === 'Completed').length,
    regionalCustomersOnFile: perf?.customersOnFile ?? 0,

    pendingApprovals: catalog.filter((c) => c.approvalStatus === 'Pending').length,
    priceExceptions: get<PriceException>('price-exceptions').filter((p) => p.status === 'Awaiting finance sign-off').length,
    campaignsLive: get<Campaign>('campaigns').filter((c) => c.status === 'Live').length,
    bundlesInReview: catalog.filter((c) => c.itemType === 'Bundle' && c.status === 'In review').length,
    changesQueued: get<ChangeRequest>('catalog-change-requests').filter((c) => c.status === 'Queued').length,

    fulfilmentQueue: get<Order>('orders').filter((o) => orderBucket(o.status) === 'progress').length,
    verificationBacklog: orderApprovals.filter((a) => (a.approvalStatus ?? a.status) === 'Pending').length,
    wfmActivitiesOpen: wfm.filter((a) => (a.status ?? a.activityStatus) !== 'Completed').length,
    appointmentsBooked: get<Appointment>('appointments').length,

    perf,
    recentCatalogItems: [...catalog].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
    loading,
    errors,
  };
}

import { EntityMissing } from '../../../components/patterns/EntityMissing';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { ErrorBanner } from '../../../components/primitives/ErrorBanner';
import { Drawer } from '../../../capabilities';
import { Select } from '../../../components/primitives/Select';
import { Textarea } from '../../../components/primitives/Textarea';
import { useEntityStore, useKindPending } from '../../../stores/entityStore';
import { useSubmitGuard } from '../../../hooks/useSubmit';
import { useNotificationStore } from '../../../stores/notificationStore';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { PageHeader } from '../../../components/patterns/PageHeader';
import { usePersonaStore } from '../../../stores/personaStore';
import { ORDER_AWAITING_DECISION, approvalBlockMessage, isSimSwapAwaitingDecision, simSwapDecisionAuthority } from '../../../engines/approvalAuthority';

interface SimSwapOrder {
  simSwapOrderId: string;
  msisdn: string;
  newSimSerialNumber?: string;
  simSwapReason?: string;
  chargeStatus?: string;
  comments?: string;
  status: string;
}
interface RejectReason {
  reasonCode: string;
  reasonLabel: string;
}

// SCR-196: SIM Swap Queue / Order tasks tab - UJ-091: "Open SIM Swap Queue ->
// Order tasks tab -> select order -> Assign to Me -> open via Order ID
// hyperlink -> Approve or Reject." Only one evidenced screenId covers both
// the queue and its detail/approval facet, so this single component switches
// on the `id` query param rather than inventing a separate detail screenId.
export function SimSwapQueueScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('id');
  const orders = (useEntityStore((s) => s.records['sim-swap-orders']) ?? []) as unknown as SimSwapOrder[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const loading = useKindPending('sim-swap-orders'); // true until the list has arrived, so the table never flashes "empty" first
  const loadError = useEntityStore((s) => s.errors['sim-swap-orders']);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const { guard } = useSubmitGuard();
  const pushToast = useNotificationStore((s) => s.pushToast);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);

  const [reasons, setReasons] = useState<RejectReason[]>([]);
  const [modal, setModal] = useState<'approve' | 'reject' | null>(null);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');

  useEffect(() => {
    loadKind('sim-swap-orders');
    mockDataEngine.list<RejectReason>('reject-reasons').then(setReasons);
  }, [loadKind]);

  if (!orderId) {
    const pending = orders.filter((o) => isSimSwapAwaitingDecision(o.status));
    const canWorkQueue = simSwapDecisionAuthority({ personaId: activePersonaId, status: ORDER_AWAITING_DECISION }).mayDecide;
    return (
      <div className="p-8">
        <PageHeader title={<>SIM Swap Queue</>} description={<>Order tasks tab - tasks awaiting SIM Swap approval.</>} />
        <ErrorBanner message={loadError} />
        <DataTable<SimSwapOrder>
          columns={[
            { key: 'simSwapOrderId', header: 'Order #' },
            { key: 'msisdn', header: 'MSISDN' },
            { key: 'simSwapReason', header: 'Reason' },
            { key: 'status', header: 'Status', render: (r) => <Badge variant="warning">{r.status}</Badge> },
            {
              key: 'action',
              header: '',
              render: (r) => (
                <Button variant="secondary" compact onClick={() => navigate(`/sim-number-management/sim-swap-queue-order-tasks-tab?id=${r.simSwapOrderId}`)}>
                  {canWorkQueue ? 'Assign to Me' : 'View'}
                </Button>
              ),
            },
          ]}
          rows={pending}
          rowKey={(r) => r.simSwapOrderId}
          emptyMessage="No SIM Swap requests awaiting approval."
          loading={loading}
        />
      </div>
    );
  }

  const order = orders.find((o) => o.simSwapOrderId === orderId);
  if (!order) {
    return <EntityMissing what="SIM swap order" loading={Boolean(loading)} backTo="/sim-number-management/sim-swap-queue-order-tasks-tab" backLabel="Back to the SIM swap queue" />;
  }

  const authority = simSwapDecisionAuthority({ personaId: activePersonaId, status: order.status });
  const blockMessage = approvalBlockMessage('SIM swap', authority);

  // The buttons are only offered when the SIM swap may be decided; the handlers check the same authority.
  const approve = () =>
    guard(async () => {
      if (!authority.mayDecide) return;
      await updateRecord('sim-swap-orders', 'simSwapOrderId', order.simSwapOrderId, {
        status: 'Approved/Completed',
        approveComment,
      });
      pushToast('success', `SIM Swap ${order.simSwapOrderId} approved - order completed.`);
      navigate('/sim-number-management/sim-swap-queue-order-tasks-tab');
    });

  const reject = () =>
    guard(async () => {
      if (!authority.mayDecide) return;
      const reasonLabel = reasons.find((r) => r.reasonCode === rejectReason)?.reasonLabel ?? rejectReason;
      await updateRecord('sim-swap-orders', 'simSwapOrderId', order.simSwapOrderId, {
        status: 'Cancelled',
        rejectReasonCode: rejectReason,
        rejectComment,
      });
      pushToast('warning', `SIM Swap ${order.simSwapOrderId} dropped as cancelled - ${reasonLabel}.`);
      navigate('/sim-number-management/sim-swap-queue-order-tasks-tab');
    });

  return (
    <div className="p-8 w-full">
      <PageHeader
        title={<>SIM Swap {order.simSwapOrderId}</>}
        badges={<><Badge variant="outlined-red">{order.status}</Badge></>}
        description={<>MSISDN: {order.msisdn}</>}
      />

      <dl className="grid grid-cols-2 gap-4 text-[length:var(--fs-body)] card p-4 mb-6">
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">New SIM Serial</dt>
          <dd className="text-fg">{order.newSimSerialNumber ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">Reason</dt>
          <dd className="text-fg">{order.simSwapReason ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">Charge</dt>
          <dd className="text-fg">{order.chargeStatus ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">Comments</dt>
          <dd className="text-fg">{order.comments ?? '-'}</dd>
        </div>
      </dl>

      {blockMessage && (
        <div className="mb-4 rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3 text-[length:var(--fs-body)] text-[var(--warn-text)]">{blockMessage}</div>
      )}
      {/* Decision buttons only while the swap is awaiting a decision and only for the roles that work this queue. */}
      {authority.mayDecide && (
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setModal('approve')}>
            Approve
          </Button>
          <Button variant="secondary" className="!text-danger !border-danger" onClick={() => setModal('reject')}>
            Reject
          </Button>
        </div>
      )}

      <Drawer open={modal === 'approve'} onClose={() => setModal(null)} title="Approve SIM Swap">
        <Textarea label="Comments" value={approveComment} onChange={(e) => setApproveComment(e.target.value)} />
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={approve}>Approve SIM Swap</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'reject'} onClose={() => setModal(null)} title="Reject Task">
        <div className="space-y-3">
          <Select
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Select a reason"
            options={reasons.map((r) => ({ value: r.reasonCode, label: r.reasonLabel }))}
          />
          <Textarea label="Comments" value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="destructive" onClick={reject} disabled={!rejectReason}>Drop Order</Button>
        </div>
      </Drawer>
    </div>
  );
}

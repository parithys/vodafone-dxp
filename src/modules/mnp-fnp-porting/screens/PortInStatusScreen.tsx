import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, type BadgeVariant } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { DataTable } from '../../../components/primitives/DataTable';
import { ErrorBanner } from '../../../components/primitives/ErrorBanner';
import { Modal } from '../../../components/primitives/Modal';
import { Select } from '../../../components/primitives/Select';
import { PageHeader } from '../../../components/patterns/PageHeader';
import { SHOW_DEMO_CONTENT } from '../../../data/synthetic/syntheticMarker';
import { REJECTION_REASONS, type PortInOrderStatus } from '../../../data/portInRules';
import { approvePortIn, cancelPortIn, isAwaitingNpas, quickDraftValues, rejectPortIn } from '../../../engines/portInEngine';
import type { PortInChange, PortInRecord } from '../../../engines/portInEngine';
import { useSubmitGuard } from '../../../hooks/useSubmit';
import { useEntityStore, useKindPending } from '../../../stores/entityStore';
import { useWorkflowStore } from '../../../stores/workflowStore';
import { useCustomerContext } from '../../../stores/customerContextStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { WIZARD_ID_BY_FLOW } from '../../new-connection/newConnectionModel';
import { PORT_IN_STATUS_PATH } from './portInStatusPath';
import { formatDateTime } from '../../../lib/format';

const KIND = 'mnp-portin-orders';

const STATUS_VARIANT: Partial<Record<PortInOrderStatus, BadgeVariant>> = {
  Submitted: 'info',
  'Pending NPAS Approval': 'warning',
  'NPAS Approved': 'success',
  Closed: 'danger',
  Cancelled: 'danger',
  'Completed Rejected': 'danger',
};

/** The status as the agent reads it: a closed order says why. */
function statusText(r: PortInRecord): string {
  if (r.orderStatus === 'Closed' && r.portStatus === 'Rejected') return 'Rejected by NPAS (closed)';
  return r.orderStatus;
}

const when = (iso?: string) => (iso ? formatDateTime(iso) : '-');

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[length:var(--fs-caption)] text-muted">{label}</div>
      <div className="text-fg text-[length:var(--fs-body)] break-words">{children || '-'}</div>
    </div>
  );
}

function StatusBadge({ record }: { record: PortInRecord }) {
  return <Badge variant={STATUS_VARIANT[record.orderStatus] ?? 'filled-neutral'}>{statusText(record)}</Badge>;
}

// SCR-136 - the Port-In status of a submitted MNP request (VFQ_Mobile_MNP_PORTIN_PORTOUT_V1.1, CAP-44 Port Status Tracking):
// where it stands with NPAS, the Confirmed Port-In Date once approved, the donor's reason once rejected, the notifications sent,
// and what the agent can do next (cancel while it waits, a Quick Draft from a cancelled order). NPAS is not wired to the app, so
// the "Simulate NPAS response" panel (a demo control, hidden when VITE_SHOW_DEMO=false) stands in for its approval or rejection.
export function PortInStatusScreen() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const loadKind = useEntityStore((s) => s.loadKind);
  const records = (useEntityStore((s) => s.records[KIND]) ?? []) as unknown as PortInRecord[];
  const loadError = useEntityStore((s) => s.errors[KIND]);
  const loading = useKindPending(KIND);
  const navigate = useNavigate();

  useEffect(() => {
    void loadKind(KIND);
  }, [loadKind]);

  const open = id ? records.find((r) => r.id === id || r.orderId === id) : undefined;

  return (
    <div className="p-8">
      <PageHeader
        title={<>Port-In Status</>}
        description={<>Where each MNP port-in request stands with NPAS, and what happens next.</>}
        actions={open ? <Link to={PORT_IN_STATUS_PATH} className="text-on-dark font-medium hover:underline text-[length:var(--fs-body)]">All port-in requests</Link> : undefined}
      />
      <ErrorBanner message={loadError} />
      {open ? (
        <PortInDetail record={open} />
      ) : id && !loading ? (
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          No port-in request <code>{id}</code> was found. <Link to={PORT_IN_STATUS_PATH} className="text-link font-medium hover:underline">Back to all requests</Link>
        </p>
      ) : (
        <DataTable<PortInRecord>
          columns={[
            { key: 'id', header: 'Request' },
            { key: 'orderId', header: 'Order' },
            { key: 'customerName', header: 'Customer' },
            { key: 'portInNumber', header: 'Port-in number' },
            { key: 'donorOperator', header: 'Donor operator' },
            { key: 'orderStatus', header: 'Status', render: (r) => <StatusBadge record={r} /> },
            { key: 'confirmed', header: 'Confirmed port-in', render: (r) => (r.confirmedPortIn ? `${r.confirmedPortIn.date} ${r.confirmedPortIn.start}-${r.confirmedPortIn.end}` : '-') },
          ]}
          rows={records}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`${PORT_IN_STATUS_PATH}?id=${r.id}`)}
          emptyMessage="No port-in requests yet."
          loading={loading}
        />
      )}
    </div>
  );
}

function PortInDetail({ record }: { record: PortInRecord }) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const navigate = useNavigate();
  const { guard, pending } = useSubmitGuard();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reasonCode, setReasonCode] = useState('');
  const waiting = isAwaitingNpas(record);

  // The request and the order it belongs to move together: the order shows the same status the request carries.
  const apply = (change: PortInChange | undefined, message: string) =>
    guard(async () => {
      if (!change) return;
      await updateRecord(KIND, 'id', record.id, change.patch as Record<string, unknown>);
      await updateRecord('orders', 'orderId', record.orderId, { status: change.orderStatus });
      // BR-MNP-025: a rejected or cancelled request puts its reserved SIM back in stock.
      if (change.simRelease) await updateRecord('sims', 'simSerial', change.simRelease.simSerial, { stockStatus: change.simRelease.restoreTo, reservedForOrderId: undefined });
      pushToast('success', message);
    });

  const quickDraft = () => {
    const values = quickDraftValues(record);
    if (!values) return;
    const wizardId = WIZARD_ID_BY_FLOW.new;
    const workflow = useWorkflowStore.getState();
    useCustomerContext.getState().endJourney(wizardId);
    workflow.clearDraft(wizardId);
    // A new draft with a new order reference once submitted; the source order stays Cancelled. The reusable details are filled in,
    // and the journey runs again from Customer Verification so everything is reviewed and re-validated before it is submitted.
    workflow.patchDraft(wizardId, { set: values, progressTo: 0 });
    navigate('/mobile/start-connection');
  };

  return (
    <div className="space-y-6">
      <section className="card p-5 space-y-5" aria-label="Port-in request">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-fg text-[length:var(--fs-body-lg)]">
              {record.portInNumber} <span className="text-muted font-normal">· {record.id}</span>
            </h2>
            <p className="text-fg-2 text-[length:var(--fs-body)]">
              Order {record.orderId}{record.customerName ? ` · ${record.customerName}` : ''}
            </p>
          </div>
          <StatusBadge record={record} />
        </div>

        {record.orderStatus === 'NPAS Approved' && record.confirmedPortIn && (
          <p className="card card-surface px-4 py-3 text-fg text-[length:var(--fs-body)]" role="status">
            Approved by NPAS. Confirmed Port-In Date <strong>{record.confirmedPortIn.date}</strong>, between {record.confirmedPortIn.start} and {record.confirmedPortIn.end}. The
            number is activated in that window; nothing is activated before it.
          </p>
        )}
        {record.portStatus === 'Rejected' && record.rejectionReason && (
          <p className="card card-surface px-4 py-3 text-fg text-[length:var(--fs-body)]" role="status">
            Rejected by the donor operator: <strong>{record.rejectionReasonCode} - {record.rejectionReason}</strong>. The order is closed and the customer has been notified.
          </p>
        )}
        {waiting && (
          <p className="card card-surface px-4 py-3 text-fg-2 text-[length:var(--fs-body)]" role="status">
            Waiting for the final NPAS response, due by {when(record.npasDeadline)}. No inventory, SIM association, activation or billing happens until NPAS approves.
          </p>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <Field label="Port Status">{record.portStatus}</Field>
          <Field label="Tracking Record">{record.trackingStatus}</Field>
          <Field label="NPAS Reference">{record.npasReference}</Field>
          <Field label="Submitted">{when(record.submittedAt)}</Field>
          <Field label="NPAS Response">{when(record.npasResponseAt)}</Field>
          <Field label="Confirmed Port-In Date">{record.confirmedPortIn ? `${record.confirmedPortIn.date}, ${record.confirmedPortIn.start}-${record.confirmedPortIn.end}` : undefined}</Field>
          <Field label="Plan Type">{record.mnpCategory}</Field>
          <Field label="Scheduled Port-In Date">{record.scheduledPortInDate}</Field>
          <Field label="Donor Operator">{record.donorOperator}</Field>
          <Field label="Donor Subscription">{record.donorSubscriptionType}</Field>
          <Field label="Donor Customer Type">{record.donorCustomerType}</Field>
          <Field label="Donor ID">{record.donorCustomerId ? `${record.donorIdType ?? ''} ${record.donorCustomerId}`.trim() : undefined}</Field>
          <Field label="MNP Form">{record.mnpFormNumber ? `${record.mnpFormNumber}${record.mnpFormSigned ? ' (signed)' : ''}` : undefined}</Field>
          <Field label="SIM">{record.simSerial ? `${record.simSerial} (${record.simStatus ?? 'Reserved'})` : undefined}</Field>
          <Field label="Source Cancelled Order">{record.sourceCancelledOrderId}</Field>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-soft">
          {waiting && (
            <Button variant="secondary" onClick={() => setConfirmCancel(true)} disabled={pending}>
              Cancel request
            </Button>
          )}
          {quickDraftValues(record) && (
            <Button variant="primary" onClick={quickDraft}>
              Create Quick Draft
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate(`/order-management/order-approval-detail-attachments-order-details-activities-a?id=${record.orderId}`)}>
            View Order
          </Button>
        </div>
      </section>

      {SHOW_DEMO_CONTENT && waiting && (
        <section className="card card-surface p-5 space-y-3" aria-label="Simulate NPAS response">
          <h3 className="font-bold text-fg text-[length:var(--fs-body)]">Simulate NPAS Response</h3>
          <p className="text-fg-2 text-[length:var(--fs-caption)]">Demo control: NPAS is not connected, so its answer is entered here.</p>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant="primary" disabled={pending} onClick={() => void apply(approvePortIn(record), 'NPAS approved the port-in request.')}>
              NPAS approves
            </Button>
            <div className="w-full max-w-sm">
              <Select
                label="Donor Rejection Reason"
                placeholder="Select a reason"
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                options={REJECTION_REASONS.map((r) => ({ value: r.code, label: `${r.code} - ${r.reason}` }))}
              />
            </div>
            <Button variant="secondary" disabled={pending || !reasonCode} onClick={() => void apply(rejectPortIn(record, reasonCode), 'NPAS rejected the port-in request; the customer was notified.')}>
              NPAS rejects
            </Button>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-label="Status history">
          <h3 className="font-bold text-fg text-[length:var(--fs-body)] mb-3">Status History</h3>
          <ol className="space-y-3">
            {[...record.history].reverse().map((h, i) => (
              <li key={`${h.status}-${i}`} className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-[var(--radius-pill)] bg-accent shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-fg text-[length:var(--fs-body)] font-medium">{h.status}</div>
                  <div className="text-muted text-[length:var(--fs-caption)]">{when(h.at)}</div>
                  {h.note && <div className="text-fg-2 text-[length:var(--fs-caption)]">{h.note}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="card p-5" aria-label="Notifications">
          <h3 className="font-bold text-fg text-[length:var(--fs-body)] mb-3">Customer Notifications</h3>
          {record.notifications.length === 0 ? (
            <p className="text-muted text-[length:var(--fs-body)]">None sent.</p>
          ) : (
            <ul className="space-y-3">
              {[...record.notifications].reverse().map((n, i) => (
                <li key={`${n.type}-${i}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-fg text-[length:var(--fs-body)] font-medium">{n.type}</span>
                    <Badge variant={n.status === 'Sent' ? 'success' : 'danger'}>{n.status}</Badge>
                    <span className="text-muted text-[length:var(--fs-caption)]">{n.channel} to {n.to} · {when(n.at)}</span>
                  </div>
                  <div className="text-fg-2 text-[length:var(--fs-caption)] mt-0.5">{n.message}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel this port-in request?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
              Keep request
            </Button>
            <Button
              variant="primary"
              disabled={pending}
              onClick={() => {
                setConfirmCancel(false);
                void apply(cancelPortIn(record), 'The port-in request was cancelled.');
              }}
            >
              Cancel request
            </Button>
          </>
        }
      >
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          The request is withdrawn before NPAS answers, the reserved SIM is released and the customer is notified. You can start a Quick Draft from the cancelled order afterwards.
        </p>
      </Modal>
    </div>
  );
}

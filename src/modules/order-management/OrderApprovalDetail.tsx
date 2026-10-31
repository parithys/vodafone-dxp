import { useKindPending } from '../../stores/entityStore';
import { useRestrictedCustomers } from '../../hooks/useRestrictedCustomers';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { EntityMissing } from '../../components/patterns/EntityMissing';
import { DataTable } from '../../components/primitives/DataTable';
import { formatDateTime } from '../../lib/format';
import { badgeVariantFor } from '../../lib/statusTone';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NestedTabs } from '../../components/primitives/TabLevel';
import { TabStrip } from '../../components/primitives/TabStrip';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import { Drawer } from '../../capabilities';
import { Select } from '../../components/primitives/Select';
import { Textarea } from '../../components/primitives/Textarea';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { isVisibleToAgent } from '../../engines/agentTaskEngine';
import { Checkbox } from '../../components/primitives/Checkbox';
import { PageHeader } from '../../components/patterns/PageHeader';
import { formatQar } from '../../engines/postpaidPricing';
import { applyCreditLimitChange, creditLimitChangeOf } from '../../workspace/customer360/creditLimitChange';
import { applyLineChange, lineChangeOf } from '../mobile-service-changes/applyServiceChange';
import { usePersonaStore } from '../../stores/personaStore';
import { mayResubmitOrder, ORDER_AWAITING_DECISION, orderApprovalAuthority } from '../../engines/approvalAuthority';
import { evaluateRule } from '../../engines/ruleEngine';
import { Link } from 'react-router-dom';
import { AttachmentPreview, type OrderAttachment } from './AttachmentPreview';

// Same document-icon path CafDocumentUpload.tsx/AdditionalDocumentsUpload.tsx
// already use for their own file rows - reused here for visual consistency
// rather than a second icon meaning the same thing.
const DOC_ICON = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6';

// File-type icons for the Attachments list. The format comes from what the order recorded: a file extension in the
// document's detail or label ("proof.pdf"), or - for the documents captured in the journey - how they were captured
// (scans are images). Anything else is shown as a plain document rather than guessed at.
type FileKind = 'pdf' | 'image' | 'word' | 'sheet' | 'other';
const FILE_KIND_ICON: Record<FileKind, { path: string; tone: string; name: string }> = {
  pdf: { path: `${DOC_ICON} M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6`, tone: 'text-danger', name: 'PDF document' },
  image: { path: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21', tone: 'text-success', name: 'Image' },
  word: { path: `${DOC_ICON} M8 13h8 M8 17h8 M8 9h2`, tone: 'text-[var(--signal-blue)]', name: 'Word document' },
  sheet: { path: `${DOC_ICON} M8 13h8 M8 17h8 M12 13v6`, tone: 'text-success', name: 'Spreadsheet' },
  other: { path: DOC_ICON, tone: 'text-muted', name: 'Document' },
};
function fileKindOf(a: { label: string; detail?: string }): FileKind {
  const ext = /\.([a-z0-9]{2,5})\b(?!.*\.[a-z0-9]{2,5}\b)/i.exec(`${a.detail ?? ''} ${a.label}`)?.[1]?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'bmp', 'tif', 'tiff'].includes(ext)) return 'image';
  if (ext && ['doc', 'docx', 'rtf', 'odt'].includes(ext)) return 'word';
  if (ext && ['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'sheet';
  if (/scanned/i.test(a.detail ?? '')) return 'image';
  return 'other';
}

interface Order {
  orderId: string;
  orderType: string;
  approverRole?: string;
  approvalReason?: string;
  /** The connection eligibility engine's decision, kept on the order when it covered the customer (see engines/connectionEligibility.decisionRecord). */
  lineEligibility?: { ruleSetVersion: string; approvals: { type: string; message: string }[]; countsBefore: { prepaid: number; postpaid: number; mobileTotal: number; fixedFwa: number } };
  approvalStatus?: string;
  manualIdEntry?: boolean;
  rejectReasonCode?: string;
  rejectComment?: string;
  returnReasonCode?: string;
  returnComment?: string;
  status: string;
  customerName?: string;
  msisdn?: string;
  productId?: string;
  createdBy?: string;
  /** Where this order goes once approved - 'Complete' for most journeys, but
   * FWA orders still need WFM installation after approval (UJ-062), so they
   * carry 'Pending WFM Installation' here instead of jumping straight to Complete. */
  nextStatusOnApproval?: string;
  /** Set by "Assign to Me" in the queue - governs both queue visibility and
   * (AAV-00) whether this detail page may be opened at all by direct URL. */
  assignedApproverId?: string | null;
  /**
   * CAF/ID-scan/supporting-document references captured during the guided
   * wizard (2026-09-28) - previously this tab showed one static paragraph
   * with no actual list, because nothing was ever saved onto the order
   * record for it to read (see NewPostpaidWizard's onSubmit, which now
   * builds this array from the same values.caf/qidScans
   * data the wizard already collected). Not every order type populates
   * this yet - other journeys' onSubmit are unchanged - so it stays optional.
   */
  attachments?: OrderAttachment[];
  // Written by the guided journeys' submit (submitNewConnectionOrder); every one is optional because other
  // order types and the seeded orders carry only some of them.
  orderSubType?: string;
  createdAt?: string;
  sourceChannel?: string;
  customerId?: string;
  holdReason?: string | null;
  fulfillmentStatus?: string | null;
  customerEmail?: string;
  customerSponsor?: string;
  customerOccupation?: string;
  idNumber?: string;
  customerType?: string;
  companyName?: string;
  planSource?: string;
  productIds?: string[];
  discountId?: string;
  addonIds?: string[];
  numberPriceQAR?: number;
  simType?: string;
  simSerial?: string;
  billingProfileId?: string;
  newBillingProfileName?: string;
  billCardLast4?: string;
  dueTodayQAR?: number;
  numberWaiver?: number | string;
  numberWaivedQAR?: number;
  numberUpfrontChargeQAR?: number;
  monthlyRecurringQAR?: number;
  mrcTotalQAR?: number;
  nrcTotalQAR?: number;
  totalQAR?: number;
}
interface RejectReason {
  reasonCode: string;
  reasonLabel: string;
}

interface ApprovalHistoryEntry {
  activityNumber: string;
  orderId: string;
  actionTaken: string;
  notes?: string;
  transactionDate: string;
}

// AAV-05: "see task history before confirming Approval, Rejection, or
// Return" - the Activities tab already shows this, but a Drawer overlays
// the page, so this same list is repeated directly inside each confirmation
// Drawer, immediately above the confirm button, rather than relying on the
// agent having scrolled past the Activities tab earlier in the session.
//
// `orderType` param dropped 2026-09-28 (see the matching Activities-tab
// change below) - "Task Name: {orderType}" only ever repeated the order type
// already sitting in the page's own Contact line, and "Task ID: {orderId}"
// repeated the order id already in the page's own H1, so neither told the
// agent anything the label/notes below did not already say better.
/** A rejection reads as danger and a return as a warning, so the decisions that need action stand out in the history. */
function decisionTone(action: string | undefined): { row: string; title: string } {
  if (/^Rejected/i.test(action ?? '')) return { row: 'bg-tone-danger-soft border-l-4 border-l-[var(--danger-border)]', title: 'text-danger font-semibold' };
  if (/^Returned/i.test(action ?? '')) return { row: 'bg-tone-warn-soft border-l-4 border-l-[var(--warn)]', title: 'text-[var(--warn-text)] font-semibold' };
  return { row: '', title: 'text-fg font-medium' };
}

function HistoryPreview({ history }: { history: ApprovalHistoryEntry[] }) {
  if (history.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--field-card-border)] divide-y divide-border-soft">
      <p className="px-3 py-2 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted">Task History</p>
      {history.map((entry) => {
        const tone = decisionTone(entry.actionTaken);
        return (
        <div key={entry.activityNumber} className={`px-3 py-2 ${tone.row}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`${tone.title} text-[length:var(--fs-caption)]`}>{entry.actionTaken}</span>
            <span className="text-muted text-[length:var(--fs-micro)]">{formatDateTime(entry.transactionDate)}</span>
          </div>
          {entry.notes && <div className="text-fg-2 text-[length:var(--fs-micro)] mt-0.5">{entry.notes}</div>}
        </div>
        );
      })}
    </div>
  );
}

const CUSTOMER_TYPE_LABEL: Record<string, string> = {
  none: 'Standard',
  b2b2c: 'B2B2C employee',
  retired: 'Retired',
  mada: 'MADA',
};

const hasValue = (v: unknown) => !(v === undefined || v === null || v === '' || v === false);

const DETAIL_CARD = 'card p-5';
const DETAIL_CARD_TITLE = 'mb-4 border-b border-border-soft pb-3 text-fg font-semibold text-[length:var(--fs-body-lg)]';

/** A titled card of DetailRows. Renders nothing when none of its rows has a value, so no heading stands over an empty card. */
function DetailSection({ title, children }: { title: string; children: React.ReactElement<{ value?: unknown }>[] }) {
  if (!children.some((row) => hasValue(row.props.value))) return null;
  return (
    <section className={DETAIL_CARD}>
      <h3 className={DETAIL_CARD_TITLE}>{title}</h3>
      <dl className={`grid grid-cols-1 gap-x-6 gap-y-4 text-[length:var(--fs-body)] sm:grid-cols-2`}>{children}</dl>
    </section>
  );
}

/** One label/value pair. Renders nothing when the order does not carry the fact, so no row ever claims an empty one. */
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!hasValue(value)) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[length:var(--fs-caption)] text-fg">{label}</dt>
      <dd className="text-fg break-words">{value}</dd>
    </div>
  );
}

const ALERT_ICON = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 8v5 M12 16h.01';

/**
 * Splits the order's stored reason string into one entry per trigger, each with a heading and its explanation. The stored
 * text is what the wizards recorded (other screens match on it); the wording shown here is written for the approver.
 */
function approvalReasonItems(reason: string | undefined): { title: string; detail: string }[] {
  if (!reason) return [];
  const describe = (r: string): { title: string; detail: string } => {
    if (r.startsWith('Active postpaid line limit reached')) return { title: 'Active Line Limit Reached', detail: r };
    if (r.startsWith('ID type requires Credit Control approval')) {
      return { title: 'ID Type Requires Credit Control Approval', detail: 'The selected ID type requires Credit Control approval. The order was routed to Credit Control on submission.' };
    }
    if (r.startsWith('ID type cannot be sold directly')) {
      return { title: 'ID Type Requires Back Office Fulfilment Approval', detail: 'Direct sale is not permitted for this ID type. The order will be routed to Back Office Fulfilment for approval.' };
    }
    if (r.startsWith('Identity manually entered')) return { title: 'Identity Entered Manually', detail: r };
    if (r.startsWith('ID expiry date not on file')) return { title: 'ID Expiry Not on File', detail: r };
    if (r.startsWith('HRN customer')) return { title: 'HRN Advance Payment', detail: r };
    if (r.startsWith('B2B2C employee')) {
      return { title: 'B2B2C Employment Proof Required', detail: 'Proof of Employment must be verified for the B2B2C employee.' };
    }
    const doc = r.match(/^(.*) - supporting document to be verified$/);
    if (doc) {
      return { title: `${doc[1]} Document Required`, detail: `The supporting document for the ${doc[1]} must be verified.` };
    }
    return { title: 'Approval Reason', detail: r };
  };
  return reason.split(' | ').map(describe);
}

const APPROVAL_STATE: Record<string, { variant: 'warning' | 'success' | 'danger' | 'filled-neutral'; headline: string }> = {
  Approved: { variant: 'success', headline: 'Approved' },
  Rejected: { variant: 'danger', headline: 'Rejected' },
  Returned: { variant: 'warning', headline: 'Returned for correction' },
};

// Approval summary (2026-10-10): where the order stands, who decides, what happens on approval and WHY it needs approval,
// one item per trigger (the stored reason is a single "a | b | c" string) - then the outcome once a decision has been
// recorded. Shown in the Order Details tab only, and only for orders that carry a reason or an approval status.
function ApprovalSummary({
  order,
  requiredRole,
  reasonLabel,
}: {
  order: Order;
  requiredRole: string | undefined;
  reasonLabel: (code: string | undefined) => string | undefined;
}) {
  const items = approvalReasonItems(order.approvalReason);
  const status = order.approvalStatus;
  const outcomeShown = Boolean(order.rejectReasonCode || order.returnReasonCode || order.rejectComment || order.returnComment);
  // Status and order status are in the page header now; the card is only for what the header can't say - why the order needs
  // approval, or the decision that was taken. With neither, there is nothing to put in it.
  if (items.length === 0 && !outcomeShown) return null;
  const decided = status === 'Approved' || status === 'Rejected' || status === 'Cancelled';
  const state = APPROVAL_STATE[status ?? ''] ?? { variant: 'warning' as const, headline: status ?? 'Awaiting approval' };
  const outcomeReason = order.rejectReasonCode ? reasonLabel(order.rejectReasonCode) : order.returnReasonCode ? reasonLabel(order.returnReasonCode) : undefined;
  const outcomeComment = order.rejectComment ?? order.returnComment;
  return (
    <section className={`${DETAIL_CARD} mt-4`} aria-label="Approval summary">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-soft pb-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Approval</h3>
        <Badge variant={state.variant}>{state.headline}</Badge>
      </div>

      <dl className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-[length:var(--fs-body)]">
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">Approver Role</dt>
          <dd className="text-fg">{requiredRole ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-[length:var(--fs-caption)] text-fg">{decided ? 'Order status' : 'If approved'}</dt>
          <dd className="text-fg">{decided ? order.status : `Moves to ${order.nextStatusOnApproval ?? 'Complete'}`}</dd>
        </div>
      </dl>

      {items.length > 0 && (
        <div>
          <p className="mb-2 text-fg-2 text-[length:var(--fs-caption-upper)] uppercase tracking-wide">
            Why this order needs approval ({items.length})
          </p>
          <ul className="space-y-2">
            {items.map((r, i) => (
              <li key={`${r.title}-${i}`} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft px-4 py-3">
                <Icon path={ALERT_ICON} className="mt-0.5 w-5 h-5 shrink-0 text-[var(--warn-text)]" />
                <span className="min-w-0">
                  <span className="block text-[var(--warn-text)] font-semibold text-[length:var(--fs-body)]">{r.title}</span>
                  <span className="block text-fg text-[length:var(--fs-caption)]">{r.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(outcomeReason || outcomeComment) && (
        <div className="mt-5 rounded-[var(--radius-card)] bg-surface px-4 py-3">
          <p className="mb-1 text-fg-2 text-[length:var(--fs-caption-upper)] uppercase tracking-wide">
            {status === 'Returned' ? 'Returned because' : 'Decision'}
          </p>
          {outcomeReason && <p className="text-fg font-medium text-[length:var(--fs-body)]">{outcomeReason}</p>}
          {outcomeComment && <p className="text-fg-2 text-[length:var(--fs-body)]">{outcomeComment}</p>}
        </div>
      )}
    </section>
  );
}

const HISTORY_ICON = 'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 2';

// Activities tab (2026-10-10): a titled card with a count, a one-line brief and either the order's approval history (each
// entry unchanged: action, time, notes) or an empty state. The history is the task history Agent 360 AAV-05 asks the
// approver to see before confirming a decision.
function ActivitiesPanel({ history }: { history: ApprovalHistoryEntry[] }) {
  return (
    <section className={DETAIL_CARD}>
      <div className="flex items-baseline gap-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Activities</h3>
        <span className="text-muted text-[length:var(--fs-caption)]">
          {history.length} {history.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>
      <p className="mt-1 pb-4 mb-4 border-b border-border-soft text-fg-2 text-[length:var(--fs-body)]">Approval history for this order.</p>
      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-pill)] bg-surface text-muted">
            <Icon path={HISTORY_ICON} className="w-8 h-8" strokeWidth={1.5} />
          </span>
          <p className="mt-2 text-fg font-semibold text-[length:var(--fs-body-lg)]">No Approval Activity Yet</p>
          <p className="max-w-md text-fg-2 text-[length:var(--fs-body)]">
            Approval actions will appear here once they are recorded. Review this history before confirming a decision.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--field-card-border)] divide-y divide-border-soft">
          {history.map((entry) => {
            const tone = decisionTone(entry.actionTaken);
            return (
            <div key={entry.activityNumber} className={`px-4 py-3 ${tone.row}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`${tone.title} text-[length:var(--fs-body)]`}>{entry.actionTaken}</span>
                <span className="text-muted text-[length:var(--fs-caption)]">{formatDateTime(entry.transactionDate)}</span>
              </div>
              {/* "Task ID / Task Name" lines were dropped 2026-09-28: the page H1 and Contact line already carry both. */}
              {entry.notes && <div className="text-fg text-[length:var(--fs-caption)] mt-0.5">{entry.notes}</div>}
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Attachments tab (2026-10-10): a titled card with the document list on the left and a preview pane on the right. The
// content is the order's own attachment list (label + detail), unchanged; clicking a row selects it into the preview pane,
// which has no file to render for these seeded documents, so it names the document and says so.
function FileIcon({ doc, className = 'w-4 h-4' }: { doc: { label: string; detail?: string }; className?: string }) {
  const k = FILE_KIND_ICON[fileKindOf(doc)];
  return (
    <span className="inline-flex shrink-0" title={k.name} role="img" aria-label={k.name}>
      <Icon path={k.path} className={`${className} ${k.tone}`} />
    </span>
  );
}

function AttachmentsPanel({ attachments, order }: { attachments: OrderAttachment[]; order: Order }) {
  // The first document is open from the start, so the pane shows a document rather than an instruction.
  const [selected, setSelected] = useState<string | null>(attachments.length > 0 ? '0' : null);
  const doc = selected !== null ? attachments[Number(selected)] : undefined;
  return (
    <section className={DETAIL_CARD}>
      <div className="mb-4 flex items-baseline gap-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Attachments</h3>
        <span className="text-muted text-[length:var(--fs-caption)]">
          {attachments.length} document{attachments.length === 1 ? '' : 's'}
        </span>
      </div>
      {attachments.length === 0 ? (
        <p className="text-fg-2 text-[length:var(--fs-body)]">No attachments were recorded for this order.</p>
      ) : (
        <>
          <p className="mb-4 text-fg-2 text-[length:var(--fs-body)]">Documents submitted with this order.</p>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="min-w-0">
              <DataTable
                columns={[
                  {
                    key: 'label',
                    header: 'Document',
                    render: (a) => (
                      <span className="flex items-center gap-3">
                        <FileIcon doc={a} className="w-6 h-6" />
                        <span className="min-w-0">
                          <span className="block text-fg">{a.label}</span>
                          {(a.fileName ?? a.detail) && <span className="block text-muted text-[length:var(--fs-caption)] break-all">{a.fileName ?? a.detail}</span>}
                        </span>
                      </span>
                    ),
                  },
                  { key: 'detail', header: 'Source', render: (a) => <span className="text-fg-2 text-[length:var(--fs-caption)]">{a.detail ?? '-'}</span> },
                ]}
                rows={attachments.map((a, i) => ({ ...a, id: String(i) }))}
                rowKey={(a) => a.id}
                selectedKey={selected ?? undefined}
                onRowClick={(a) => setSelected(a.id)}
              />
            </div>

            <div className="flex min-h-64 flex-col items-center justify-center gap-3 card card-surface p-6 text-center" aria-live="polite">
              {doc ? (
                <AttachmentPreview doc={doc} order={order} />
              ) : (
                <>
                  <Icon path={DOC_ICON} className="w-14 h-14 text-muted" strokeWidth={1.5} />
                  <p className="text-fg-2 text-[length:var(--fs-body)]">Select a document to preview it here.</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// Order Details tab (2026-10-10): everything the order record holds, in sections - was Product + MSISDN only. Plan,
// add-on and discount ids resolve to their catalogue names; a row is omitted when the order has no value for it.
function OrderDetailsPanel({ order, lastUpdatedMs }: { order: Order; lastUpdatedMs?: number }) {
  const [products, setProducts] = useState<{ productId: string; name: string; mrcQAR?: number }[]>([]);
  const [agents, setAgents] = useState<{ userId: string; alias?: string; firstName: string; lastName: string }[]>([]);
  const [customer, setCustomer] = useState<{ nationality?: string; segment?: string; activePostpaidLines?: number; activePrepaidLines?: number } | undefined>();
  const [discounts, setDiscounts] = useState<{ addonDiscountId: string; name: string }[]>([]);
  useEffect(() => {
    mockDataEngine.list<{ productId: string; name: string; mrcQAR?: number }>('products').then(setProducts);
    mockDataEngine.list<{ addonDiscountId: string; name: string }>('addons-discounts').then(setDiscounts);
    mockDataEngine.list<{ userId: string; alias?: string; firstName: string; lastName: string }>('users-agents').then(setAgents);
  }, []);
  useEffect(() => {
    if (order.customerId) mockDataEngine.get<typeof customer & object>('customers', order.customerId).then(setCustomer);
  }, [order.customerId]);
  // The agent who submitted it, as a name: the order stores a user id (or, on the seeded orders, a handle that has no profile).
  const agent = order.createdBy ? agents.find((a) => a.userId === order.createdBy || a.alias === order.createdBy) : undefined;
  const createdByName = order.createdBy ? (agent ? `${agent.firstName} ${agent.lastName}` : order.createdBy) : undefined;
  // Why a line-limit order needs approval, in the rule's own words (BR-288), from the customer's current line counts.
  const lineApproval = order.lineEligibility
    ? `${order.lineEligibility.approvals.map((a) => a.message).join(' ')} (rule set ${order.lineEligibility.ruleSetVersion})`
    : undefined;
  const lineLimit =
    !order.lineEligibility && customer?.nationality && customer.activePostpaidLines !== undefined
      ? evaluateRule('BR-288', { nationality: customer.nationality, activePostpaidLines: customer.activePostpaidLines }).message
      : undefined;

  const planIds = order.productId ? [order.productId] : (order.productIds ?? []);
  const nameOf = (id: string) => products.find((p) => p.productId === id)?.name;
  const planNames = planIds.map((id) => nameOf(id) ?? id);
  const addonNames = (order.addonIds ?? []).map((id) => nameOf(id) ?? id);
  const discountName = order.discountId ? (discounts.find((d) => d.addonDiscountId === order.discountId)?.name ?? order.discountId) : undefined;
  const monthly = order.monthlyRecurringQAR ?? order.mrcTotalQAR;

  const hasCharges = [monthly, order.dueTodayQAR].some((v) => v !== undefined);
  const qar = (v: number | undefined) => (v !== undefined ? formatQar(v) : undefined);

  return (
    <div className="grid gap-4 lg:grid-cols-2 items-start">
      <div className="space-y-4 min-w-0">
        <DetailSection title="Order Information">
          <DetailRow label="Order Type" value={order.orderType} />
          <DetailRow label="Sub-Type" value={order.orderSubType} />
          <DetailRow label="Source Channel" value={order.sourceChannel} />
          <DetailRow label="Status" value={order.status} />
          <DetailRow label="Created" value={order.createdAt ? formatDateTime(order.createdAt) : undefined} />
          <DetailRow label="Created By" value={createdByName} />
          <DetailRow label="Last Updated" value={lastUpdatedMs ? formatDateTime(lastUpdatedMs) : undefined} />
          <DetailRow label="Plan Source" value={order.planSource} />
        </DetailSection>

        <DetailSection title="Customer">
          <DetailRow label="Name" value={order.customerName} />
          <DetailRow label="Customer ID" value={order.customerId} />
          <DetailRow label="Email" value={order.customerEmail} />
          <DetailRow label="ID Number" value={order.idNumber} />
          <DetailRow label="Customer Type" value={order.customerType ? (CUSTOMER_TYPE_LABEL[order.customerType] ?? order.customerType) : undefined} />
          <DetailRow label="Company" value={order.companyName} />
          <DetailRow label="Sponsor" value={order.customerSponsor} />
          <DetailRow label="Occupation" value={order.customerOccupation} />
          <DetailRow label="Nationality" value={customer?.nationality} />
          <DetailRow label="Segment" value={customer?.segment} />
          <DetailRow
            label="Customer 360"
            value={order.customerId ? <Link to={`/customer/${order.customerId}`} className="text-link font-medium hover:underline">Open {order.customerId}</Link> : undefined}
          />
        </DetailSection>

        <DetailSection title="Customer Standing">
          <DetailRow label="Active Postpaid Lines" value={customer?.activePostpaidLines} />
          <DetailRow label="Active Prepaid Lines" value={customer?.activePrepaidLines} />
          {lineApproval ? <DetailRow label="Line Approval" value={lineApproval} /> : <DetailRow label="Postpaid Line Limit" value={lineLimit} />}
        </DetailSection>

      </div>

      <div className="space-y-4 min-w-0">
        <DetailSection title="Plan & Connection">
          <DetailRow
            label={planIds.length > 1 ? 'Products' : 'Plan'}
            value={planNames.length > 0 ? planNames.map((n, i) => <div key={planIds[i]}>{n} <span className="text-muted">({planIds[i]})</span></div>) : undefined}
          />
          <DetailRow label="MSISDN" value={order.msisdn} />
          <DetailRow label="SIM Type" value={order.simType} />
          <DetailRow label="Add-Ons" value={addonNames.length > 0 ? addonNames.join(', ') : undefined} />
          <DetailRow label="Discount" value={discountName} />
          <DetailRow label="SIM Serial" value={order.simSerial} />
        </DetailSection>

        {(hasCharges || order.numberPriceQAR !== undefined || order.nrcTotalQAR !== undefined || order.totalQAR !== undefined) && (
          <section className={DETAIL_CARD}>
            <h3 className={DETAIL_CARD_TITLE}>Charges</h3>
            {hasCharges && (
              <div className="grid grid-cols-2 divide-x divide-border-soft border-b border-border-soft pb-4 mb-4">
                <div className="pr-4">
                  <p className="text-[length:var(--fs-caption)] text-muted">Monthly Recurring</p>
                  <p className="text-fg font-bold text-[length:var(--fs-h5)]">{qar(monthly) ?? '-'}</p>
                </div>
                <div className="pl-4">
                  <p className="text-[length:var(--fs-caption)] text-muted">Due Today</p>
                  <p className="text-fg font-bold text-[length:var(--fs-h5)]">{qar(order.dueTodayQAR) ?? '-'}</p>
                </div>
              </div>
            )}
            <dl className="grid grid-cols-1 gap-y-3 text-[length:var(--fs-body)]">
              <DetailRow label="Number Price" value={qar(order.numberPriceQAR)} />
              {order.numberWaiver && <DetailRow label="Additional Discount" value={`${qar(order.numberWaivedQAR) ?? '-'} waived of ${qar(order.numberUpfrontChargeQAR) ?? '-'}`} />}
              <DetailRow label="One-Time Charges" value={qar(order.nrcTotalQAR)} />
              <DetailRow label="Order Total" value={qar(order.totalQAR)} />
            </dl>
          </section>
        )}

        <DetailSection title="Billing">
          <DetailRow label="Billing Profile" value={order.billingProfileId ?? order.newBillingProfileName} />
          <DetailRow label="Card" value={order.billCardLast4 ? `Ending ${order.billCardLast4}` : undefined} />
        </DetailSection>

        <DetailSection title="Status & Fulfilment">
          <DetailRow label="Hold Reason" value={order.holdReason ?? undefined} />
          <DetailRow label="Fulfilment Status" value={order.fulfillmentStatus ?? undefined} />
        </DetailSection>
      </div>
    </div>
  );
}

// SCR-061: Order Approval detail - header (Contact, Order #) + 4 tabs
// (Order Details/Activities/Attachments - the former Agents Details tab, which held only "Submitted by", is gone) + action buttons
// (Approve, Reject - Correction, Reject - Drop Order, Return, Go Back),
// evidenced identically across Fixed Line/FWA/Postpaid B2B2C-with-approval
// journeys, extended with Agent 360 BRSD's Return action (AAV-03), real
// task history (AAV-05 - `actionTaken` distinguishes an approval-decision
// record from the pre-seeded general `customer-activities` timeline, which
// carries no such field), and approval-matrix role gating (AAV-01/BR-06).
export function OrderApprovalDetail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('id');
  const orders = (useEntityStore((s) => s.records.orders) ?? []) as unknown as Order[];
  const activities = (useEntityStore((s) => s.records['customer-activities']) ?? []) as unknown as ApprovalHistoryEntry[];
  const loadKind = useEntityStore((s) => s.loadKind);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const currentJobTitle = useAuthStore((s) => s.profile?.jobTitle);
  const currentAgentId = useAuthStore((s) => s.profile?.userId);
  // Deciding on an order (approve / reject / return) needs the Approve level on this screen. A persona granted only
  // View (Retail Sales and the other sales roles) reads the order's details and status and gets no decision buttons.
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);

  const [tab, setTab] = useState('order-details');
  const [reasons, setReasons] = useState<RejectReason[]>([]);
  const [modal, setModal] = useState<'approve' | 'reject-correction' | 'reject-drop' | 'return' | 'resubmit' | null>(null);
  const [resubmitComment, setResubmitComment] = useState('');
  const [ackApprove, setAckApprove] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnComment, setReturnComment] = useState('');
  // Guards against duplicate submission. Uses a ref, not just `submitting`
  // state: two click dispatches landing in the same synchronous tick both
  // read `submitting` as stale `false` (a state update isn't visible until
  // the next render) - observed in practice as this handler otherwise
  // creating two near-identical history entries per single click.
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    loadKind('orders');
    loadKind('customer-activities');
    mockDataEngine.list<RejectReason>('reject-reasons').then(setReasons);
  }, [loadKind]);

  const ordersPending = useKindPending('orders');
  const restricted = useRestrictedCustomers();
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) {
    return <EntityMissing what="order" loading={ordersPending} backTo="/orders" backLabel="Back to orders" />;
  }
  // The customer is in a protected segment this role may not see: the record is not drawn at all - only the restriction (and nothing until the
  // customers are known).
  if (!restricted.ready) return <div className="p-8 text-fg-2" role="status">Loading…</div>;
  if (restricted.isRestricted(order.customerId)) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/orders" backLabel="Back to orders" />
      </div>
    );
  }

  // AAV-00 clause (b): "if the task is not assigned or accessible to the
  // agent, access is denied." Unassigned orders (assignedApproverId is null)
  // are still open queue items anyone eligible can claim, so they remain
  // accessible; once assigned, only that approver may open this page -
  // matching the same isVisibleToAgent rule the queue itself already
  // enforces (OrderApprovalQueue.tsx), so a direct URL can no longer bypass
  // the queue's own visibility rule.
  if (!isVisibleToAgent(order.assignedApproverId, currentAgentId)) {
    return (
      <div className="p-8 text-fg-2">
        <p className="text-fg font-medium mb-1">Access denied.</p>
        <p>This order is assigned to another approver and is not accessible from your account.</p>
      </div>
    );
  }

  const history = activities.filter((a) => a.orderId === order.orderId && a.actionTaken);
  // Last updated: the newest recorded decision on the order, else when it was created.
  const stamps = [order.createdAt, ...history.map((a) => a.transactionDate)].map((t) => (t ? new Date(t).getTime() : NaN)).filter((n) => !Number.isNaN(n));
  const lastUpdatedMs = stamps.length ? Math.max(...stamps) : undefined;

  // AAV-01: approve / reject / return need (a) the Approve grant, (b) the role the order was routed to (or the approval
  // matrix names), and (c) an order that is still awaiting a decision - see engines/approvalAuthority.ts. Reaching this
  // page directly by URL changes none of that.
  const authority = orderApprovalAuthority({ personaId: activePersonaId, jobTitle: currentJobTitle, status: order.status, orderType: order.orderType, approverRole: order.approverRole, createdBy: order.createdBy, userId: currentAgentId });
  const isEligibleApprover = authority.mayDecide;

  const logActivity = (actionTaken: string, notes: string) =>
    createRecord('customer-activities', {
      activityNumber: `ACT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: order.orderId,
      actionTaken,
      notes,
      transactionDate: new Date().toISOString(),
    });

  const approve = async () => {
    // The buttons are only offered to an eligible approver; the handler checks the same authority so it cannot be reached another way.
    if (!authority.mayDecide || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const nextStatus = order.nextStatusOnApproval ?? 'Complete';
      await updateRecord('orders', 'orderId', order.orderId, { status: nextStatus, approvalStatus: 'Approved' });
      // A held plan or pack change takes effect on approval: the line moves to the plan the order records (the same step that runs at submit when nothing is held).
      const lineChange = nextStatus === 'Complete' ? lineChangeOf(order as unknown as Record<string, unknown>) : undefined;
      if (lineChange) await applyLineChange(lineChange, updateRecord);
      // An approved credit limit change takes effect: the customer's limit becomes the one requested.
      const limitChange = nextStatus === 'Complete' ? creditLimitChangeOf(order as unknown as Record<string, unknown>) : undefined;
      if (limitChange) await applyCreditLimitChange({ ...limitChange, by: currentAgentId }, { list: (k) => mockDataEngine.list(k) as never, updateRecord: updateRecord as never, createRecord: createRecord as never });
      await logActivity('Approved', approveComment);
      pushToast(
        'success',
        nextStatus === 'Complete'
          ? `Order ${order.orderId} approved.`
          : `Order ${order.orderId} approved - moved to ${nextStatus}.`
      );
      navigate('/order-management');
    } catch (err) {
      console.error('[OrderApprovalDetail] approve failed:', err);
      console.error('[OrderApprovalDetail] approve failed:', err);
      pushToast('error', 'The order could not be approved. Please try again.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const reject = async (drop: boolean) => {
    if (!authority.mayDecide || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const reasonLabel = reasons.find((r) => r.reasonCode === rejectReason)?.reasonLabel ?? rejectReason;
      await updateRecord('orders', 'orderId', order.orderId, {
        status: drop ? 'Cancelled' : 'Rejected - Correction',
        approvalStatus: 'Rejected',
        rejectReasonCode: rejectReason,
        rejectComment,
      });
      await logActivity(`Rejected - ${drop ? 'Drop Order' : 'Correction'}`, `${reasonLabel}: ${rejectComment}`);
      pushToast('warning', `Order ${order.orderId}: ${drop ? 'dropped as cancelled' : 'rejected - SMS sent to agent for correction'}.`);
      navigate('/order-management');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // AAV-03/Annex_02: Return is distinct from Reject - it loops the order back
  // to "Submitted for Approval" (permitted next status per the BRSD's own
  // status model) rather than terminating it, and per BR-06 requires a
  // reason + notes exactly like Reject does.
  const returnOrder = async () => {
    if (!authority.mayDecide || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const reasonLabel = reasons.find((r) => r.reasonCode === returnReason)?.reasonLabel ?? returnReason;
      await updateRecord('orders', 'orderId', order.orderId, {
        status: 'Submitted for Approval',
        approvalStatus: 'Returned',
        returnReasonCode: returnReason,
        returnComment,
      });
      await logActivity('Returned', `${reasonLabel}: ${returnComment}`);
      pushToast('warning', `Order ${order.orderId} returned for correction - back in the approval queue.`);
      navigate('/order-management');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // The creator's next step on an order that was rejected for correction: send it back for another decision. The order
  // goes back to the queue of the role it was routed to (unassigned, so any eligible approver can pick it up), and the
  // resubmission is logged like every other decision so the approver sees what was corrected.
  const mayResubmit = mayResubmitOrder(order, currentAgentId);
  const resubmit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('orders', 'orderId', order.orderId, {
        status: 'Submitted for Approval',
        approvalStatus: 'Resubmitted',
        assignedApproverId: null,
        resubmitComment,
      });
      await logActivity('Resubmitted', resubmitComment);
      pushToast('success', `Order ${order.orderId} resubmitted - back in the approval queue.`);
      setModal(null);
      setResubmitComment('');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const tabItems = [
    {
      key: 'order-details',
      label: 'Order Details',
      content: (
        <>
          <OrderDetailsPanel order={order} lastUpdatedMs={lastUpdatedMs} />
          <ApprovalSummary order={order} requiredRole={authority.requiredRole} reasonLabel={(code) => reasons.find((r) => r.reasonCode === code)?.reasonLabel ?? code} />
        </>
      ),
    },
    {
      key: 'activities',
      label: 'Activities',
      content: <ActivitiesPanel history={history} />,
    },
    {
      key: 'attachments',
      label: 'Attachments',
      content: <AttachmentsPanel attachments={order.attachments ?? []} order={order} />,
    },
  ];
  const activeTab = tabItems.find((t) => t.key === tab) ?? tabItems[0];

  return (
    <div className="p-8">
      <PageHeader
        title={<>Order {order.orderId}</>}
        // The order's status at the right edge of the header band (the `actions` slot). The approval status is shown
        // only when it says something the order status does not: a decision that sent the order back to the agent.
        // Every other approval state is implied by the order status or spelled out in the Approval card.
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {order.status === ORDER_AWAITING_DECISION && (order.approvalStatus === 'Returned' || order.approvalStatus === 'Resubmitted') && (
              <Badge variant={badgeVariantFor(order.approvalStatus)} aria-label={`Approval status: ${order.approvalStatus}`}>
                {order.approvalStatus}
              </Badge>
            )}
            <Badge variant={badgeVariantFor(order.status)} aria-label={`Order status: ${order.status}`}>
              {order.status}
            </Badge>
          </div>
        }
        description={<>
        Contact: {order.customerName ?? '-'} · {order.orderType}
      </>}
      />

      {/* Tab strip straight on the page background (no bar of its own); each tab's content is a set of cards (or one card) on it. */}
      <TabStrip items={tabItems.map(({ key, label }) => ({ key, label }))} active={activeTab.key} onChange={setTab} label="Order sections" />
      <div className="mt-4">
        <NestedTabs>{activeTab.content}</NestedTabs>
      </div>

      {mayResubmit && (
        <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-fg font-medium text-[length:var(--fs-body)]">This order was rejected for correction</p>
            <p className="text-fg-2 text-[length:var(--fs-caption)]">
              {order.rejectComment ? `${order.rejectComment} ` : ''}Correct what was asked for, then send it back for another decision.
            </p>
          </div>
          <Button variant="primary" onClick={() => setModal('resubmit')}>
            Resubmit for approval
          </Button>
        </div>
      )}

      {/* Decision buttons are for approvers only; everyone else sees none. */}
      {isEligibleApprover && (
      <div className="flex flex-wrap gap-2 mt-6">
        <Button variant="primary" onClick={() => setModal('approve')}>
          Approve
        </Button>
        <Button variant="secondary" onClick={() => setModal('reject-correction')}>
          Reject - Correction
        </Button>
        <Button
          variant="secondary"
          className="!text-danger !border-danger"
          onClick={() => setModal('reject-drop')}
         
        >
          Reject - Drop Order
        </Button>
        <Button variant="secondary" onClick={() => setModal('return')}>
          Return
        </Button>
      </div>
      )}

      <Drawer open={modal === 'resubmit'} onClose={() => setModal(null)} title="Resubmit Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <p className="text-fg-2 text-[length:var(--fs-body)]">Tell the approver what you corrected. The order returns to the approval queue it was routed to.</p>
          <Textarea label="What Was Corrected (Required)" value={resubmitComment} onChange={(e) => setResubmitComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={resubmit} disabled={!resubmitComment.trim() || submitting}>Resubmit Order</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'approve'} onClose={() => setModal(null)} title="Approve Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <label className="flex items-start gap-2 text-[length:var(--fs-body)] text-fg">
            <Checkbox className="mt-1" checked={ackApprove} onChange={(e) => setAckApprove(e.target.checked)} />
            By clicking submit, I agree that I have verified all the documents and details to proceed with submission.
          </label>
          <Textarea label="Comments" value={approveComment} onChange={(e) => setApproveComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={approve} disabled={!ackApprove || submitting}>Submit Approval</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'reject-correction' || modal === 'reject-drop'} onClose={() => setModal(null)} title="Reject Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <Select
            label="Reject Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Select a reason"
            options={reasons.map((r) => ({ value: r.reasonCode, label: r.reasonLabel }))}
          />
          <Textarea label="Comments (Required)" value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => reject(modal === 'reject-drop')}
            disabled={!rejectReason || !rejectComment.trim() || submitting}
          >
            Reject Order
          </Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'return'} onClose={() => setModal(null)} title="Return Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <p className="text-fg-2 text-[length:var(--fs-body)]">
            Returning sends this order back to the approval queue for correction, rather than rejecting it outright.
          </p>
          <Select
            label="Return Reason"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="Select a reason"
            options={reasons.map((r) => ({ value: r.reasonCode, label: r.reasonLabel }))}
          />
          <Textarea label="Notes" value={returnComment} onChange={(e) => setReturnComment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={returnOrder} disabled={!returnReason || !returnComment || submitting}>
            Return Order
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

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
import { MissingInformationPanel, type MissingInformationSubmit } from './MissingInformationPanel';
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
import { applyMissingInformation, emptyMissingInformationRequest, isMissingInformationRequestMade, mayResubmitOrder, ORDER_AWAITING_DECISION, ORDER_MISSING_INFORMATION, orderApprovalAuthority, type MissingInformationRequest } from '../../engines/approvalAuthority';
import { evaluateRule } from '../../engines/ruleEngine';
import { Link } from 'react-router-dom';
import { AttachmentPreview } from './AttachmentPreview';
import type { OrderAttachment } from './attachmentModel';
import { ALERT_ICON_ALT, DOC, HISTORY_ICON, IMAGE } from '../../assets/icons';

// Same document-icon path CafDocumentUpload.tsx/AdditionalDocumentsUpload.tsx
// already use for their own file rows - reused here for visual consistency
// rather than a second icon meaning the same thing.

// File-type icons for the Attachments list. The format comes from what the order recorded: a file extension in the
// document's detail or label ("proof.pdf"), or - for the documents captured in the journey - how they were captured
// (scans are images). Anything else is shown as a plain document rather than guessed at.
type FileKind = 'pdf' | 'image' | 'word' | 'sheet' | 'other';
const FILE_KIND_ICON: Record<FileKind, { path: string; tone: string; name: string }> = {
  pdf: { path: `${DOC} M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6`, tone: 'text-danger', name: 'PDF document' },
  image: { path: IMAGE, tone: 'text-success', name: 'Image' },
  word: { path: `${DOC} M8 13h8 M8 17h8 M8 9h2`, tone: 'text-[var(--signal-blue)]', name: 'Word document' },
  sheet: { path: `${DOC} M8 13h8 M8 17h8 M12 13v6`, tone: 'text-success', name: 'Spreadsheet' },
  other: { path: DOC, tone: 'text-muted', name: 'Document' },
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
  /** What the approver asked for when they marked the order Missing Information. */
  missingInfoComment?: string;
  /** What the approver asked for (see engines/approvalAuthority.MissingInformationRequest). */
  missingInfoRequest?: MissingInformationRequest | null;
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
/** A fresh activity number; impure (clock and randomness), so it lives outside the component's render. */
function newActivityNumber(): string {
  return `ACT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function decisionTone(action: string | undefined): { row: string; title: string } {
  if (/^Rejected/i.test(action ?? '')) return { row: 'bg-tone-danger-soft border-l-4 border-l-[var(--danger-border)]', title: 'text-danger font-semibold' };
  if (/^(Returned|Missing Information)/i.test(action ?? '')) return { row: 'bg-tone-warn-soft border-l-4 border-l-[var(--warn)]', title: 'text-[var(--warn-text)] font-semibold' };
  return { row: '', title: 'text-fg font-medium' };
}

function HistoryPreview({ history }: { history: ApprovalHistoryEntry[] }) {
  if (history.length === 0) return null;
  return (
    <div className="list-frame">
      <p className="px-3 py-2 eyebrow">Task History</p>
      {history.map((entry) => {
        const tone = decisionTone(entry.actionTaken);
        return (
        <div key={entry.activityNumber} className={`px-3 py-2 ${tone.row}`}>
          <div className="split-nowrap">
            <span className={`${tone.title} text-[length:var(--fs-caption)]`}>{entry.actionTaken}</span>
            <span className="micro-muted">{formatDateTime(entry.transactionDate)}</span>
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
const DETAIL_CARD_TITLE = 'title title-md font-semibold mb-4 divider-bottom pb-3';

/** A titled card of DetailRows. Renders nothing when none of its rows has a value, so no heading stands over an empty card. */
function DetailSection({ title, children }: { title: string; children: React.ReactElement<{ value?: unknown }>[] }) {
  if (!children.some((row) => hasValue(row.props.value))) return null;
  return (
    <section className={DETAIL_CARD}>
      <h3 className={DETAIL_CARD_TITLE}>{title}</h3>
      <dl className={`cols-1-2 gap-x-6 gap-y-4 text-[length:var(--fs-body)]`}>{children}</dl>
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


/**
 * Splits the order's stored reason string into one entry per trigger, each with a heading and its explanation. The stored
 * text is what the wizards recorded (other screens match on it); the wording shown here is written for the approver.
 */
function approvalReasonItems(reason: string | undefined): { title: string; detail: string }[] {
  if (!reason) return [];
  const describe = (r: string): { title: string; detail: string } => {
    if (r.startsWith('Active postpaid line limit reached')) return { title: 'Active Line Limit Reached', detail: r };
    const passportManager = r.match(/^Passport requires (.+) approval - routed to /);
    if (passportManager) {
      return { title: `Passport Requires ${passportManager[1]} Approval`, detail: `A Passport order is approved by the submitting agent's manager. The order was routed to ${passportManager[1]} on submission.` };
    }
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

/** The request in words, for the activity history: "Recapture: Signed CAF; new CAF signature; supporting documents". */
function requestSummary(r: MissingInformationRequest, attachments: OrderAttachment[]): string {
  return [
    ...r.attachmentIndexes.map((i) => `Recapture: ${attachments[i]?.label ?? `Document ${i + 1}`}`),
    ...(r.resignCaf ? ['new CAF signature'] : []),
    ...(r.supportingDocuments ? ['supporting documents'] : []),
  ].join('; ');
}

const APPROVAL_STATE: Record<string, { variant: 'warning' | 'success' | 'danger' | 'filled-neutral'; headline: string }> = {
  Approved: { variant: 'success', headline: 'Approved' },
  Rejected: { variant: 'danger', headline: 'Rejected' },
  Returned: { variant: 'warning', headline: 'Returned for correction' },
  'Missing Information': { variant: 'warning', headline: 'Missing Information' },
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
  const outcomeShown = Boolean(order.rejectReasonCode || order.returnReasonCode || order.rejectComment || order.returnComment || order.missingInfoComment);
  // Status and order status are in the page header now; the card is only for what the header can't say - why the order needs
  // approval, or the decision that was taken. With neither, there is nothing to put in it.
  if (items.length === 0 && !outcomeShown) return null;
  const decided = status === 'Approved' || status === 'Rejected' || status === 'Cancelled';
  const state = APPROVAL_STATE[status ?? ''] ?? { variant: 'warning' as const, headline: status ?? 'Awaiting approval' };
  const outcomeReason = order.rejectReasonCode ? reasonLabel(order.rejectReasonCode) : order.returnReasonCode ? reasonLabel(order.returnReasonCode) : undefined;
  const outcomeComment = order.missingInfoComment ?? order.rejectComment ?? order.returnComment;
  return (
    <section className={`${DETAIL_CARD} mt-4`} aria-label="Approval summary">
      <div className="mb-4 split divider-bottom pb-3">
        <h3 className="title title-md font-semibold">Approval</h3>
        <Badge variant={state.variant}>{state.headline}</Badge>
      </div>

      <dl className="mb-5 fields-2 text-[length:var(--fs-body)]">
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
          <p className="mb-2 text-fg-2 label-caps">
            Why this order needs approval ({items.length})
          </p>
          <ul className="space-y-2">
            {items.map((r, i) => (
              <li key={`${r.title}-${i}`} className="row-start notice-warning pad-row">
                <Icon path={ALERT_ICON_ALT} className="mt-0.5 icon-md text-[var(--warn-text)]" />
                <span className="min-w-0">
                  <span className="warn-title">{r.title}</span>
                  <span className="label-caption">{r.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(outcomeReason || outcomeComment) && (
        <div className="mt-5 rounded-[var(--radius-card)] bg-surface pad-row">
          <p className="mb-1 text-fg-2 label-caps">
            {status === 'Missing Information' ? 'Information Requested' : status === 'Returned' ? 'Returned because' : 'Decision'}
          </p>
          {outcomeReason && <p className="value-text">{outcomeReason}</p>}
          {outcomeComment && <p className="text-secondary">{outcomeComment}</p>}
        </div>
      )}
    </section>
  );
}


// Activities tab (2026-10-10): a titled card with a count, a one-line brief and either the order's approval history (each
// entry unchanged: action, time, notes) or an empty state. The history is the task history Agent 360 AAV-05 asks the
// approver to see before confirming a decision.
function ActivitiesPanel({ history }: { history: ApprovalHistoryEntry[] }) {
  return (
    <section className={DETAIL_CARD}>
      <div className="row-baseline">
        <h3 className="title title-md font-semibold">Activities</h3>
        <span className="caption-muted">
          {history.length} {history.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>
      <p className="mt-1 pb-4 mb-4 divider-bottom text-secondary">Approval history for this order.</p>
      {history.length === 0 ? (
        <div className="centered-stack gap-2 py-12">
          <span className="disc-lg bg-surface text-muted">
            <Icon path={HISTORY_ICON} className="size-8 " strokeWidth={1.5} />
          </span>
          <p className="mt-2 title title-md font-semibold">No Approval Activity Yet</p>
          <p className="max-w-md text-secondary">
            Approval actions will appear here once they are recorded. Review this history before confirming a decision.
          </p>
        </div>
      ) : (
        <div className="list-frame">
          {history.map((entry) => {
            const tone = decisionTone(entry.actionTaken);
            return (
            <div key={entry.activityNumber} className={`pad-row ${tone.row}`}>
              <div className="split-nowrap">
                <span className={`${tone.title} text-[length:var(--fs-body)]`}>{entry.actionTaken}</span>
                <span className="caption-muted">{formatDateTime(entry.transactionDate)}</span>
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
      <div className="mb-4 row-baseline">
        <h3 className="title title-md font-semibold">Attachments</h3>
        <span className="caption-muted">
          {attachments.length} document{attachments.length === 1 ? '' : 's'}
        </span>
      </div>
      {attachments.length === 0 ? (
        <p className="text-secondary">No attachments were recorded for this order.</p>
      ) : (
        <>
          <p className="mb-4 text-secondary">Documents submitted with this order.</p>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="min-w-0">
              <DataTable
                columns={[
                  {
                    key: 'label',
                    header: 'Document',
                    render: (a) => (
                      <span className="row">
                        <FileIcon doc={a} className="size-6 " />
                        <span className="min-w-0">
                          <span className="block text-fg">{a.label}</span>
                          {(a.fileName ?? a.detail) && <span className="block caption-muted break-all">{a.fileName ?? a.detail}</span>}
                        </span>
                      </span>
                    ),
                  },
                  { key: 'detail', header: 'Source', render: (a) => <span className="caption-secondary">{a.detail ?? '-'}</span> },
                ]}
                rows={attachments.map((a, i) => ({ ...a, id: String(i) }))}
                rowKey={(a) => a.id}
                selectedKey={selected ?? undefined}
                onRowClick={(a) => setSelected(a.id)}
              />
            </div>

            <div className="stack-middle min-h-64 card card-surface p-6 text-center" aria-live="polite">
              {doc ? (
                <AttachmentPreview doc={doc} order={order} />
              ) : (
                <>
                  <Icon path={DOC} className="size-14 text-muted" strokeWidth={1.5} />
                  <p className="text-secondary">Select a document to preview it here.</p>
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
    <div className="two-col-top">
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
            value={order.customerId ? <Link to={`/customer/${order.customerId}`} className="link font-medium">Open {order.customerId}</Link> : undefined}
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
              <div className="divided-pair mb-4">
                <div className="pr-4">
                  <p className="caption-muted">Monthly Recurring</p>
                  <p className="title title-lg">{qar(monthly) ?? '-'}</p>
                </div>
                <div className="pl-4">
                  <p className="caption-muted">Due Today</p>
                  <p className="title title-lg">{qar(order.dueTodayQAR) ?? '-'}</p>
                </div>
              </div>
            )}
            <dl className="fields-rows">
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
  const [modal, setModal] = useState<'approve' | 'reject' | 'missing-information' | 'resubmit' | null>(null);
  const [resubmitComment, setResubmitComment] = useState('');
  const [approveComment, setApproveComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [missingComment, setMissingComment] = useState('');
  const [missingRequest, setMissingRequest] = useState<MissingInformationRequest>(emptyMissingInformationRequest());
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
      activityNumber: newActivityNumber(),
      orderId: order.orderId,
      actionTaken,
      notes,
      transactionDate: new Date().toISOString(),
    });

  const approve = async () => {
    // The buttons are only offered to an eligible approver; the handler checks the same authority so it cannot be reached another way.
    if (!authority.mayDecide || submittingRef.current || !approveComment.trim()) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const nextStatus = order.nextStatusOnApproval ?? 'Complete';
      await updateRecord('orders', 'orderId', order.orderId, { status: nextStatus, approvalStatus: 'Approved', approvalComment: approveComment.trim() });
      // A held plan or pack change takes effect on approval: the line moves to the plan the order records (the same step that runs at submit when nothing is held).
      const lineChange = nextStatus === 'Complete' ? lineChangeOf(order as unknown as Record<string, unknown>) : undefined;
      if (lineChange) await applyLineChange(lineChange, updateRecord);
      // An approved credit limit change takes effect: the customer's limit becomes the one requested.
      const limitChange = nextStatus === 'Complete' ? creditLimitChangeOf(order as unknown as Record<string, unknown>) : undefined;
      if (limitChange) await applyCreditLimitChange({ ...limitChange, by: currentAgentId }, { list: (k) => mockDataEngine.list(k) as never, updateRecord: updateRecord as never, createRecord: createRecord as never });
      await logActivity('Approved', approveComment.trim());
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

  // Reject ends the order: the creator is told (activity + bell) with the approver's reason. The reason is mandatory.
  const reject = async () => {
    if (!authority.mayDecide || submittingRef.current || !rejectComment.trim()) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('orders', 'orderId', order.orderId, {
        status: 'Rejected',
        approvalStatus: 'Rejected',
        rejectComment: rejectComment.trim(),
      });
      await logActivity('Rejected', rejectComment.trim());
      pushToast('warning', `Order ${order.orderId} rejected.`, { detail: 'The agent who submitted it is notified with your reason.' });
      setModal(null);
      navigate('/order-management');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Missing Information sends the order back to its creator, who reopens it, adds what was asked for and resubmits. The comment says what is missing and is mandatory.
  const requestMissingInformation = async () => {
    if (!authority.mayDecide || submittingRef.current || !missingComment.trim()) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('orders', 'orderId', order.orderId, {
        status: ORDER_MISSING_INFORMATION,
        approvalStatus: 'Missing Information',
        missingInfoComment: missingComment.trim(),
        missingInfoRequest: missingRequest,
        // Back to the agent who submitted it: they contact the customer and provide what was asked for.
        assignedApproverId: order.createdBy ?? null,
      });
      const requested = requestSummary(missingRequest, order.attachments ?? []);
      await logActivity('Missing Information', requested ? `${missingComment.trim()} (Requested: ${requested})` : missingComment.trim());
      pushToast('warning', `Order ${order.orderId} marked Missing Information.`, { detail: 'The agent who submitted it is notified and can add the documents and resubmit.' });
      setModal(null);
      setMissingRequest(emptyMissingInformationRequest());
      navigate('/order-management');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // The creator's next step on an order marked Missing Information (or, in older records, rejected for correction): reopen it, add what was asked for, and send it back for another decision. The order
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

  // Missing Information answered: only the requested documents, signature and supporting documents change; the order goes back to the Approval Queue.
  const resubmitMissingInformation = async ({ answer, comment }: MissingInformationSubmit) => {
    if (submittingRef.current || !order.missingInfoRequest || !mayResubmit) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await updateRecord('orders', 'orderId', order.orderId, {
        status: ORDER_AWAITING_DECISION,
        approvalStatus: 'Resubmitted',
        assignedApproverId: null,
        resubmitComment: comment,
        attachments: applyMissingInformation(order.attachments ?? [], order.missingInfoRequest, answer),
        missingInfoRequest: null,
      });
      await logActivity('Resubmitted', `${comment} (Provided: ${requestSummary(order.missingInfoRequest, order.attachments ?? [])})`);
      pushToast('success', `Order ${order.orderId} resubmitted - back in the approval queue.`);
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
          <div className="cluster justify-end gap-2">
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

      {mayResubmit && order.status === ORDER_MISSING_INFORMATION && isMissingInformationRequestMade(order.missingInfoRequest) && (
        <MissingInformationPanel request={order.missingInfoRequest} attachments={order.attachments ?? []} approverComment={order.missingInfoComment} busy={submitting} onResubmit={resubmitMissingInformation} />
      )}
      {mayResubmit && !(order.status === ORDER_MISSING_INFORMATION && isMissingInformationRequestMade(order.missingInfoRequest)) && (
        <div className="mt-4 card card-inherit-fill pad-row cluster">
          <div className="min-w-0 flex-1">
            <p className="value-text">{order.status === ORDER_MISSING_INFORMATION ? 'The approver needs more information' : 'This order was rejected for correction'}</p>
            <p className="caption-secondary">
              {order.missingInfoComment ?? order.rejectComment ? `${order.missingInfoComment ?? order.rejectComment} ` : ''}Add what was asked for, then send it back for another decision.
            </p>
          </div>
          <Button variant="primary" onClick={() => setModal('resubmit')}>
            Reopen and resubmit
          </Button>
        </div>
      )}

      {/* Decision buttons are for approvers only; everyone else sees none. Three actions, each needing a reason. */}
      {isEligibleApprover && (
      <div className="wrap-loose gap-2 mt-6">
        <Button variant="primary" onClick={() => setModal('approve')}>
          Approve
        </Button>
        <Button variant="secondary" onClick={() => setModal('reject')}>
          Reject
        </Button>
        <Button variant="secondary" onClick={() => setModal('missing-information')}>
          Missing Information
        </Button>
      </div>
      )}

      <Drawer open={modal === 'resubmit'} onClose={() => setModal(null)} title="Resubmit Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          {order.missingInfoComment && (
            <div className="notice-warning pad-row">
              <p className="warn-title">Information Requested</p>
              <p className="label-caption">{order.missingInfoComment}</p>
            </div>
          )}
          <p className="text-secondary">Add what the approver asked for and tell them what you provided. The order returns to the approval queue it was routed to.</p>
          <Textarea label="What Was Provided (Required)" value={resubmitComment} onChange={(e) => setResubmitComment(e.target.value)} />
        </div>
        <div className="actions-end mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={resubmit} disabled={!resubmitComment.trim() || submitting}>Resubmit Order</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'approve'} onClose={() => setModal(null)} title="Approve Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <Textarea label="Reason / Comments (Required)" required value={approveComment} onChange={(e) => setApproveComment(e.target.value)} />
        </div>
        <div className="actions-end mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={approve} disabled={!approveComment.trim() || submitting}>Submit Approval</Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'reject'} onClose={() => setModal(null)} title="Reject Order">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <ul className="bullet-list">
            <li>Rejecting ends this order.</li>
            <li>The agent who submitted it is notified with your reason.</li>
          </ul>
          <Textarea label="Reason / Comments (Required)" required value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} />
        </div>
        <div className="actions-end mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="destructive" onClick={reject} disabled={!rejectComment.trim() || submitting}>
            Reject Order
          </Button>
        </div>
      </Drawer>

      <Drawer open={modal === 'missing-information'} onClose={() => setModal(null)} title="Missing Information">
        <div className="space-y-3">
          <HistoryPreview history={history} />
          <p className="text-secondary">
            The order goes back to the agent who submitted it, who can reopen it, add the documents you ask for and resubmit it for approval.
          </p>
          <fieldset className="space-y-2">
            <legend className="title title-sm font-semibold">What Is Needed From The Agent (Optional)</legend>
            {(order.attachments ?? []).map((a, i) => (
              <label key={`${a.label}-${i}`} className="row-start gap-2 body-text">
                <Checkbox
                  checked={missingRequest.attachmentIndexes.includes(i)}
                  onChange={(e) => setMissingRequest((r) => ({ ...r, attachmentIndexes: e.target.checked ? [...r.attachmentIndexes, i].sort((x, y) => x - y) : r.attachmentIndexes.filter((x) => x !== i) }))}
                />
                Recapture or re-upload: {a.label}
              </label>
            ))}
            <label className="row-start gap-2 body-text">
              <Checkbox checked={missingRequest.resignCaf} onChange={(e) => setMissingRequest((r) => ({ ...r, resignCaf: e.target.checked }))} />
              A new customer signature on the CAF
            </label>
            <label className="row-start gap-2 body-text">
              <Checkbox checked={missingRequest.supportingDocuments} onChange={(e) => setMissingRequest((r) => ({ ...r, supportingDocuments: e.target.checked }))} />
              Additional supporting documents, with their document type
            </label>
          </fieldset>
          <Textarea label="Reason / Comments (Required)" required helperText="Say which documents or details are missing." value={missingComment} onChange={(e) => setMissingComment(e.target.value)} />
        </div>
        <div className="actions-end mt-6">
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={requestMissingInformation} disabled={!missingComment.trim() || submitting}>
            Request Missing Information
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

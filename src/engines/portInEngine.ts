import {
  canMoveOrder,
  confirmedPortInWindow,
  npasDeadline,
  rejectionReason,
  type ConfirmedPortInWindow,
  type PortInOrderStatus,
  type PortStatus,
  type TrackingStatus,
} from '../data/portInRules';

// The MNP Port-In request after it is submitted (VFQ_Mobile_MNP_PORTIN_PORTOUT_V1.1): Pending NPAS Approval, then NPAS's answer.
// Approval records the Confirmed Port-In Date and window (BR-MNP-027). Rejection cancels the order, closes it, cancels the tracking
// record, releases the reserved SIM and notifies the customer (BR-MNP-019, SEQ_025/026). Every function here returns the patch to
// apply, so the caller decides where it is stored; none of it touches a store.

export interface PortInNotification {
  type: 'Submission' | 'Cancellation' | 'Approval';
  channel: 'SMS' | 'Email';
  to: string;
  message: string;
  /** DF-MNP-043 / DF-MNP-052. Simulated: the notification platform is not wired, so a notification is recorded as Sent. */
  status: 'Sent' | 'Failed';
  at: string;
}

export interface PortInHistoryEntry {
  status: PortInOrderStatus;
  at: string;
  note?: string;
}

/** One MNP Port-In request: the order, its NPAS request and its tracking record (what the agent sees as "port status"). */
export interface PortInRecord {
  id: string;
  orderId: string;
  customerId?: string;
  customerName?: string;
  idNumber?: string;
  mnpCategory: 'Postpaid Consumer' | 'Prepaid Consumer';
  planSelected?: string;
  /** DF-MNP-009: the service MSISDN, as the donor holds it (974 + 8 digits). */
  portInNumber: string;
  donorCustomerId?: string;
  donorIdType?: string;
  donorCustomerType?: string;
  donorOperator?: string;
  donorSubscriptionType?: string;
  scheduledPortInDate?: string;
  /** DF-MNP-025 / 026. */
  mnpFormNumber?: string;
  mnpFormSigned?: boolean;
  mnpFormType?: string;
  /** DF-MNP-031 / 032 / 034 (as shown) / tracking record. */
  orderStatus: PortInOrderStatus;
  portStatus: PortStatus;
  trackingStatus: TrackingStatus;
  npasReference?: string;
  submittedAt: string;
  /** The SLA for NPAS to answer: 24 hours (OI-MNP-004). */
  npasDeadline?: string;
  /** DF-MNP-035. */
  npasResponseAt?: string;
  rejectionReasonCode?: string;
  rejectionReason?: string;
  /** DF-MNP-053, set when NPAS approves. */
  confirmedPortIn?: ConfirmedPortInWindow;
  /** SIM Inventory (Annex_02): Reserved while waiting, Released on rejection or cancellation. */
  simSerial?: string;
  simStatus?: 'Reserved' | 'Released';
  /** The SIM's stock status before it was reserved: what releasing it restores. */
  simPreviousStockStatus?: string;
  /** DF-MNP-027 / 028 / 029: what was collected before submission (zero when nothing was due) and the receipt. */
  paymentAmountQar?: number;
  paymentStatus?: 'Success' | 'Failed' | 'Pending';
  paymentMethod?: string;
  receiptNumber?: string;
  /** DF-MNP-051: the cancelled order this request was drafted from. */
  sourceCancelledOrderId?: string;
  notifications: PortInNotification[];
  history: PortInHistoryEntry[];
  /** What a Quick Draft carries forward (reusable details only): kept with the request so a cancelled order can be redrafted. */
  draftSnapshot?: Record<string, unknown>;
}

const iso = (d: Date) => d.toISOString();

export interface NewPortInInput {
  id: string;
  orderId: string;
  customerId?: string;
  customerName?: string;
  idNumber?: string;
  mnpCategory: PortInRecord['mnpCategory'];
  planSelected?: string;
  portInNumber: string;
  donor: {
    customerId?: string;
    idType?: string;
    customerType?: string;
    operator?: string;
    subscriptionType?: string;
  };
  scheduledPortInDate?: string;
  mnpForm: { number?: string; signed?: boolean; type?: string };
  simSerial?: string;
  /** The SIM's stock status before this request reserved it. */
  simPreviousStockStatus?: string;
  payment?: { amountQar: number; method?: string; receiptNumber?: string };
  sourceCancelledOrderId?: string;
  /** Where the submission notification goes (DF-MNP-045 / 046). */
  recipient: { phone?: string; email?: string };
  draftSnapshot?: Record<string, unknown>;
}

/** A request as it stands right after submission: Pending NPAS Approval (BR-MNP-013), SIM reserved, tracking In Progress. */
export function buildPortInRecord(input: NewPortInInput, now: Date = new Date()): PortInRecord {
  const at = iso(now);
  const recipient = input.recipient.phone ?? input.recipient.email ?? 'the customer';
  return {
    id: input.id,
    orderId: input.orderId,
    customerId: input.customerId,
    customerName: input.customerName,
    idNumber: input.idNumber,
    mnpCategory: input.mnpCategory,
    planSelected: input.planSelected,
    portInNumber: input.portInNumber,
    donorCustomerId: input.donor.customerId,
    donorIdType: input.donor.idType,
    donorCustomerType: input.donor.customerType,
    donorOperator: input.donor.operator,
    donorSubscriptionType: input.donor.subscriptionType,
    scheduledPortInDate: input.scheduledPortInDate,
    mnpFormNumber: input.mnpForm.number,
    mnpFormSigned: input.mnpForm.signed ?? false,
    mnpFormType: input.mnpForm.type,
    orderStatus: 'Pending NPAS Approval',
    portStatus: 'Pending Approval',
    trackingStatus: 'In Progress',
    // Issued by NPAS on receipt (INT-MNP-010 is asynchronous); the integration is not wired, so the app issues a stand-in.
    npasReference: `NPAS-${input.id.replace(/^MNP-/, '')}`,
    submittedAt: at,
    npasDeadline: npasDeadline(now),
    simSerial: input.simSerial,
    simStatus: input.simSerial ? 'Reserved' : undefined,
    simPreviousStockStatus: input.simPreviousStockStatus,
    paymentAmountQar: input.payment?.amountQar,
    paymentStatus: input.payment ? 'Success' : undefined,
    paymentMethod: input.payment?.method,
    receiptNumber: input.payment?.receiptNumber,
    sourceCancelledOrderId: input.sourceCancelledOrderId,
    notifications: [
      {
        type: 'Submission',
        channel: input.recipient.phone ? 'SMS' : 'Email',
        to: recipient,
        message: `Your request to port ${input.portInNumber} to Vodafone Qatar has been submitted (order ${input.orderId}). We will update you once the donor operator responds.`,
        status: 'Sent',
        at,
      },
    ],
    history: [
      { status: 'Submitted', at, note: 'Order submitted and forwarded to NPAS.' },
      { status: 'Pending NPAS Approval', at, note: 'Waiting for the final NPAS response; nothing is activated until then.' },
    ],
    draftSnapshot: input.draftSnapshot,
  };
}

/** The patch for the request, plus the status the order itself shows. */
export interface PortInChange {
  patch: Partial<PortInRecord>;
  orderStatus: PortInOrderStatus;
  /** The reserved SIM to put back in stock (BR-MNP-025): the caller updates the SIM inventory record. */
  simRelease?: { simSerial: string; restoreTo: string };
}

const simRelease = (r: PortInRecord): PortInChange['simRelease'] =>
  r.simSerial && r.simStatus === 'Reserved' ? { simSerial: r.simSerial, restoreTo: r.simPreviousStockStatus ?? 'Available' } : undefined;

function notify(r: PortInRecord, type: PortInNotification['type'], message: string, at: string): PortInNotification[] {
  const first = r.notifications[0];
  const entry: PortInNotification = { type, channel: first?.channel ?? 'SMS', to: first?.to ?? r.portInNumber, message, status: 'Sent', at };
  return [...r.notifications, entry];
}

/** Whether NPAS can still answer: only a request awaiting its response can be approved, rejected or cancelled. */
export const isAwaitingNpas = (r: Pick<PortInRecord, 'orderStatus'>): boolean => r.orderStatus === 'Pending NPAS Approval';

/**
 * NPAS approves (BR-MNP-013, MNP_PI_001_SEQ_024/031): the order becomes NPAS Approved and the Confirmed Port-In Date and window are
 * recorded from the approval time. UIM inventory, SIM association, activation and billing follow outside the agent journey.
 */
export function approvePortIn(r: PortInRecord, now: Date = new Date()): PortInChange | undefined {
  if (!isAwaitingNpas(r) || !canMoveOrder('Pending NPAS Approval', 'NPAS Approved')) return undefined;
  const at = iso(now);
  const confirmed = confirmedPortInWindow(now);
  return {
    orderStatus: 'NPAS Approved',
    patch: {
      orderStatus: 'NPAS Approved',
      portStatus: 'Approved',
      npasResponseAt: at,
      confirmedPortIn: confirmed,
      notifications: notify(r, 'Approval', `Your request to port ${r.portInNumber} was approved. Your number will move to Vodafone on ${confirmed.date} between ${confirmed.start} and ${confirmed.end}.`, at),
      history: [...r.history, { status: 'NPAS Approved', at, note: `Confirmed Port-In Date ${confirmed.date}, ${confirmed.start}-${confirmed.end}.` }],
    },
  };
}

/**
 * NPAS rejects (BR-MNP-019, SEQ_025/026): the order is rejected, completed as rejected and closed; the tracking record is
 * Cancelled; the reserved SIM is released (BR-MNP-025); the customer is notified with the donor's reason.
 */
export function rejectPortIn(r: PortInRecord, reasonCode: string, now: Date = new Date()): PortInChange | undefined {
  const reason = rejectionReason(reasonCode);
  if (!reason || !isAwaitingNpas(r) || !canMoveOrder('Pending NPAS Approval', 'NPAS Rejected')) return undefined;
  const at = iso(now);
  return {
    orderStatus: 'Closed',
    simRelease: simRelease(r),
    patch: {
      orderStatus: 'Closed',
      portStatus: 'Rejected',
      trackingStatus: 'Cancelled',
      npasResponseAt: at,
      rejectionReasonCode: reason.code,
      rejectionReason: reason.reason,
      simStatus: r.simSerial ? 'Released' : r.simStatus,
      notifications: notify(r, 'Cancellation', `Your request to port ${r.portInNumber} was cancelled: ${reason.reason}.`, at),
      history: [
        ...r.history,
        { status: 'NPAS Rejected', at, note: `Reason ${reason.code}: ${reason.reason}.` },
        { status: 'Completed Rejected', at },
        { status: 'Closed', at },
      ],
    },
  };
}

/** The agent or customer cancels while the request awaits NPAS (Annex_02: Pending NPAS Approval -> Cancelled). */
export function cancelPortIn(r: PortInRecord, now: Date = new Date()): PortInChange | undefined {
  if (!isAwaitingNpas(r) || !canMoveOrder('Pending NPAS Approval', 'Cancelled')) return undefined;
  const at = iso(now);
  return {
    orderStatus: 'Cancelled',
    simRelease: simRelease(r),
    patch: {
      orderStatus: 'Cancelled',
      portStatus: 'Rejected',
      trackingStatus: 'Cancelled',
      simStatus: r.simSerial ? 'Released' : r.simStatus,
      notifications: notify(r, 'Cancellation', `Your request to port ${r.portInNumber} was cancelled.`, at),
      history: [...r.history, { status: 'Cancelled', at, note: 'Cancelled before NPAS responded.' }],
    },
  };
}

/** A Quick Draft can start from a cancelled order: one cancelled outright, or closed after NPAS rejected it (BR-MNP-026). */
export const canQuickDraft = (r: Pick<PortInRecord, 'orderStatus' | 'portStatus' | 'trackingStatus'>): boolean =>
  r.orderStatus === 'Cancelled' || (r.orderStatus === 'Closed' && r.portStatus === 'Rejected' && r.trackingStatus === 'Cancelled');

/**
 * What a Quick Draft copies (BR-MNP-026: "only reusable details"): the customer, billing, product and MNP details. The SIM is
 * released on cancellation, and the signed MNP Form and CAF belong to the cancelled request, so none of those carry over; eligibility
 * is not copied either, so it is judged again. The new draft keeps the source order as lineage and the source stays Cancelled.
 */
export function quickDraftValues(r: PortInRecord): Record<string, unknown> | undefined {
  if (!canQuickDraft(r) || !r.draftSnapshot) return undefined;
  return { ...r.draftSnapshot, product: 'mnp', productPreselected: false, sourceCancelledOrderId: r.orderId };
}

/** The values a submitted wizard leaves behind that a Quick Draft must NOT carry (kept here so submit and quick draft agree). */
export const NOT_REUSABLE_KEYS = ['simSerial', 'simValid', 'eligibility', 'mnpForm', 'donorAttachment', 'caf', 'cafSummary', 'comments', 'sourceCancelledOrderId'] as const;

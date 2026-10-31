import { useEffect, useState } from 'react';
import { resolveFibreServiceability } from '../../engines/fibreServiceability';
import type { AddressParts, FibreServiceability } from '../../engines/fibreServiceability';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';
import { EsimActivationPanel } from '../domain/EsimActivationPanel';
import { useEntityStore } from '../../stores/entityStore';
import { useAuthStore } from '../../stores/authStore';
import { closeOrderActivities, logActivity } from '../../engines/activityEngine';
import type { ActivityInput } from '../../engines/activityEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { Modal } from '../primitives/Modal';
import { Textarea } from '../primitives/Textarea';
import { formatQar } from '../../lib/format';
import { printSupplementaryTerms, printTerms } from './termsPrint';
import { closeHeldQnomyTicket } from '../../engines/qnomyRelease';
import type { OrderTerms } from './cafTermsModel';

/**
 * The standard "Activation complete" page, for every activation journey.
 *
 * One layout, one row order, one set of actions - a journey supplies the facts
 * about its order and nothing else:
 *
 *   Customer | MSISDN | Plan | SIM Type | Due today | Monthly recurring | Status
 *   [Done & Exit (primary)]  [View My Orders]  [Continue with Fibre]  [Create Lead]  [Create Activity]
 *   [Print Order]  [Print CAF]  [Print Supplementary Form - only with an actual user other than the customer]
 *
 * Monthly recurring is omitted for an order that has none (prepaid). An eSIM
 * order adds the QR handover panel beside the receipt. An order held for
 * approval is headed "Order submitted for approval" and reports "Submitted for
 * Approval" as its status.
 */
export interface ActivationCompleteOrder {
  orderId: string;
  /** Number of the automatic activity for this order (reserved at submission; the record is created on Done & Exit). */
  activityId?: string;
  /**
   * The automatic activity, without comments. Done & Exit records it, whether or not the agent also created a manual
   * activity here; the two are independent.
   */
  completionActivity?: ActivityInput;
  pendingApproval: boolean;
  customerName: string;
  /** Customer on file, when there is one - used to read the location's fibre serviceability. */
  customerId?: string;
  /** The address entered in the journey, when one was. */
  address?: AddressParts;
  msisdn: string;
  planName: string;
  simType?: string;
  /** Omit when the order takes no payment (a port-in request): the row and the email line are left out. */
  dueTodayQar?: number;
  /** Overrides the page heading, e.g. "Port-in request submitted". */
  heading?: string;
  /** Overrides the Status row, e.g. "Pending" for a port request that waits on the donor operator. */
  statusLabel?: string;
  /** Further rows after Status (a port-in request's NPAS reference, form number and response deadline). */
  extraLines?: { label: string; value: string }[];
  /** An extra button after View Order, e.g. to the port-in status screen. */
  trackAction?: { label: string; to: string };
  /** Omit when the order carries no recurring charge. */
  monthlyRecurringQar?: number;
  /** The add-ons the line starts with, by name (empty: none). Absent when the journey does not take add-ons. */
  activeAddons?: string[];
  /** The billing cycle of the account the line is billed on. Absent when the journey has no billing account. */
  billingCycle?: string;
  /** eSIM orders only - drives the QR handover panel. */
  esimActivationCode?: string;
  customerEmail?: string;
  /** The address as Customer Verification shows it (masked for a new customer). Defaults to customerEmail. */
  customerEmailDisplay?: string;
  customerEmailVerified?: boolean;
  /** The terms the customer signed, when the journey signs a CAF: Print T&C, and Print Supplement T&C with an actual user. */
  terms?: OrderTerms;
}

/** Cross-sell into the Fixed Line/Fibre wizard for the same counter visit (SCR-043). */
const FIBRE_ACTIVATION_ROUTE = '/fixed-line-fibre/new-fixed-line-wizard-contact-step';
/** The agent's Orders page. */
const MY_ORDERS_ROUTE = '/orders';

// The heading follows the ORDER: "for approval" only when it was actually held (its Status row and the email say the same), "Activation complete"
// when it went through. (It used to follow the submitter's role, which could say "for approval" over a Complete order.)

// Orders whose confirmation email has already been sent this session, so re-rendering (or React's
// double-invoked effects) can never send it twice.
const emailedOrders = new Set<string>();
// Orders whose automatic activity has been recorded, so a second Done & Exit can never record it twice.
const completionLogged = new Set<string>();

// `numberLabel` and `hideSimType` let a journey without a SIM (Fixed Activation) name its number and drop the SIM row;
// both default to the Postpaid wording, so existing callers render exactly as before.
export function ActivationCompleteScreen({
  order,
  numberLabel = 'MSISDN',
  hideSimType = false,
}: {
  order: ActivationCompleteOrder;
  numberLabel?: string;
  hideSimType?: boolean;
}) {
  const navigate = useNavigate();
  const createRecord = useEntityStore((s) => s.createRecord);
  // 'sent' | 'blocked' (address missing or not verified) - never assumed sent.
  const [leadId, setLeadId] = useState<string | undefined>();
  const [closing, setClosing] = useState(false);
  // Fibre serviceability of the customer's location: undefined while it is being read.
  const [fibre, setFibre] = useState<FibreServiceability | undefined>();
  useEffect(() => {
    let cancelled = false;
    void resolveFibreServiceability(order.customerId, order.address).then((r) => !cancelled && setFibre(r));
    return () => {
      cancelled = true;
    };
  }, [order.customerId, order.address]);
  const [emailStatus, setEmailStatus] = useState<'sent' | 'blocked'>(emailedOrders.has(order.orderId) ? 'sent' : 'blocked');
  // Automatically send the order details - and, for an eSIM order, the QR code / activation code -
  // to the customer's VERIFIED email address as soon as the order is submitted. An address that is
  // missing or could not be verified against the ID record is never sent to. The prototype has no
  // mail service, so "sending" records the message against the customer.
  const isMirrorWindow = new URLSearchParams(window.location.search).get('mirror') === '1';
  useEffect(() => {
    // The customer's pop-up only displays: it never sends the email (the agent's window does).
    if (isMirrorWindow) return;
    if (!order.customerEmail || !order.customerEmailVerified) {
      setEmailStatus('blocked');
      return;
    }
    if (emailedOrders.has(order.orderId)) {
      setEmailStatus('sent');
      return;
    }
    emailedOrders.add(order.orderId);
    setEmailStatus('sent');
    const lines = [
      `Order ${order.orderId} - ${order.pendingApproval ? 'submitted for approval' : 'complete'}`,
      `Plan: ${order.planName}`,
      `Number: ${order.msisdn}`,
      `SIM: ${order.simType ?? '-'}`,
      ...(order.dueTodayQar !== undefined ? [`Due today: ${formatQar(order.dueTodayQar)}`] : []),
      ...(order.monthlyRecurringQar !== undefined ? [`Monthly: ${formatQar(order.monthlyRecurringQar)}`] : []),
      ...(order.esimActivationCode && !order.pendingApproval ? [`eSIM QR code attached. Activation code: ${order.esimActivationCode}`] : []),
    ];
    void createRecord('customer-communications', {
      communicationId: `COM-${Date.now().toString(36).toUpperCase()}`,
      channel: 'Email',
      to: order.customerEmail,
      subject: `Your Vodafone order ${order.orderId}`,
      messageText: lines.join('\n'),
      attachments: order.esimActivationCode ? ['eSIM-QR-code.png'] : [],
      sentAt: new Date().toISOString(),
      deliveryState: 'Sent',
      orderId: order.orderId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.orderId]);
  const pushToast = useNotificationStore((s) => s.pushToast);
  // Close Activity: the journey has ended (this page only exists after submit), so the activities
  // it created are closed and the agent returns to Agent 360.
  const closeActivity = async () => {
    if (closing) return;
    setClosing(true);
    // The automatic activity (no comments) is recorded here, independent of any manual activity created below.
    if (order.completionActivity && !completionLogged.has(order.orderId)) {
      completionLogged.add(order.orderId);
      await logActivity(order.completionActivity);
    }
    await closeOrderActivities(order.orderId);
    // Done & Exit closes the Qnomy ticket held for this customer, so the agent can call the next one.
    await closeHeldQnomyTicket();
    // The journey is over: the customer context is released.
    useCustomerContext.getState().endJourney();
    pushToast('success', order.activityId ? `Activity ${order.activityId} closed` : 'Activity closed', { key: `activity-closed-${order.orderId}` });
    navigate('/');
  };
  // Manual activity: an additional record the agent writes, with comments. It never replaces or affects the automatic one.
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityComments, setActivityComments] = useState('');
  const [savingActivity, setSavingActivity] = useState(false);
  const createManualActivity = async () => {
    if (!activityComments.trim() || savingActivity) return;
    setSavingActivity(true);
    const number = await logActivity({
      trigger: 'manual',
      journey: order.completionActivity?.journey ?? 'Order',
      orderId: order.orderId,
      customerId: order.completionActivity?.customerId ?? order.customerId,
      customerName: order.completionActivity?.customerName ?? order.customerName,
      idNumber: order.completionActivity?.idNumber,
      comments: activityComments,
    });
    // Creating an activity closes the held Qnomy ticket too.
    await closeHeldQnomyTicket();
    setSavingActivity(false);
    setActivityOpen(false);
    setActivityComments('');
    pushToast('success', `Activity ${number} created`, { key: `activity-${number}` });
  };
  const createLead = async () => {
    if (leadId) return;
    const id = `LEAD-${Date.now().toString().slice(-6)}`;
    await createRecord('leads', {
      leadId: id,
      serviceNeeded: 'Fixed Line',
      status: 'New',
      ownerId: useAuthStore.getState().profile?.userId ?? null,
      createdVia: 'Final Summary',
      customerName: order.customerName,
      mobileNumber: order.msisdn,
      orderId: order.orderId,
    });
    setLeadId(id);
    pushToast('success', `Lead ${id} created`, { key: `lead-${id}` });
  };
  const heading = order.heading ?? (order.pendingApproval ? 'Order submitted successfully' : 'Activation complete');
  return (
    <div className="p-8">
      <OrderConfirmationScreen
        heading={heading}
        orderId={order.orderId}
        activityId={order.activityId}
        // Two columns only while the QR code is shown (the handover panel); otherwise one column. An eSIM held for approval shows its notice in the
        // header, not in a second column.
        headerNote={
          order.esimActivationCode ? (
            <p className="rounded-[var(--radius-card)] border border-border-soft bg-surface px-4 py-3 text-fg-2 text-[length:var(--fs-body)]">
              Your order details and eSIM QR code will be sent only to your verified email address.
            </p>
          ) : emailStatus === 'sent' ? (
            <p className="text-success text-[length:var(--fs-body)]">Your order details have been sent to your email.</p>
          ) : (
            <p className="text-[var(--warn-text)] text-[length:var(--fs-caption)]">
              {order.customerEmail
                ? 'The email address could not be verified against the customer\'s ID record, so the order details were not sent.'
                : 'No email address is on file, so the order details were not sent.'}
            </p>
          )
        }
        handoverPanel={
          order.esimActivationCode ? (
            <EsimActivationPanel activationCode={order.esimActivationCode} />
          ) : undefined
        }
        summaryLines={[
          { label: 'Customer Name', value: order.customerName },
          { label: numberLabel, value: order.msisdn },
          { label: 'Plan', value: order.planName },
          ...(order.activeAddons ? [{ label: 'Active Add-Ons', value: order.activeAddons.length ? order.activeAddons.join(', ') : 'None' }] : []),
          ...(order.billingCycle ? [{ label: 'Billing Cycle', value: order.billingCycle }] : []),
                    ...(hideSimType ? [] : [{ label: 'SIM Type', value: order.simType ?? '-' }]),
          // A port-in request's own references (NPAS reference, form number, response deadline).
          ...(order.extraLines ?? []),
        ]}
        actions={[
          // Done & Exit closes the activity and is the primary action; View My Orders and the rest follow.
          { label: 'Done & Exit', variant: 'primary', onClick: () => void closeActivity() },
          { label: 'View My Orders', onClick: () => navigate(MY_ORDERS_ROUTE) },
          ...(order.trackAction ? [{ label: order.trackAction.label, onClick: () => navigate(order.trackAction!.to) }] : []),
          // A location that is ready for service can go on to fibre activation. Create Lead (always offered once the
          // location is read) records the fibre interest as a lead straight away and confirms it with a toast.
          ...(fibre === 'rfs' ? [{ label: 'Continue with Fibre', onClick: () => navigate(FIBRE_ACTIVATION_ROUTE) }] : []),
          ...(fibre !== undefined ? [{ label: leadId ? `Lead ${leadId} created` : 'Create Lead', onClick: () => void createLead() }] : []),
          { label: 'Additional Comments', onClick: () => setActivityOpen(true) },
        ]}
        // Print, then the terms the customer signed; the Supplementary Form only for a line with an actual user other than the customer.
        printActions={[
          { label: 'Print Order', onClick: () => window.print() },
          ...(order.terms ? [{ label: 'Print CAF', onClick: () => void printTerms(order) }] : []),
          ...(order.terms?.supplementary ? [{ label: 'Print Supplementary Form', onClick: () => printSupplementaryTerms(order) }] : []),
        ]}
      />
      <Modal
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        title="Add Comments"
        footer={
          <>
            <Button variant="secondary" onClick={() => setActivityOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={savingActivity || !activityComments.trim()} onClick={() => void createManualActivity()}>
              {savingActivity ? 'Saving…' : 'Add Comments'}
            </Button>
          </>
        }
      >
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          Records an additional activity on order {order.orderId}. The automatic activity is still created when you choose Done &amp; Exit.
        </p>
        <div className="mt-4">
          <Textarea
            label="Comments"
            required
            rows={4}
            value={activityComments}
            onChange={(e) => setActivityComments(e.target.value)}
            error={activityComments.length > 0 && !activityComments.trim() ? 'Enter a comment to create the activity.' : undefined}
          />
        </div>
      </Modal>
      {/* Only when there is an offer: the fibre offer for a location that is ready for service. Nothing is shown while the location is being
          read, or when there is none (no location on file, or not ready for fibre). */}
      {fibre === 'rfs' && (
        <section aria-label="Eligible offers" className="w-full max-w-xl mx-auto mt-6 card p-5 text-center no-print print:hidden">
          <h2 className="text-fg font-semibold text-[length:var(--fs-body-lg)] mb-3">This customer location is Ready for Service.</h2>
          <ul className="divide-y divide-border-soft">
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="text-fg text-[length:var(--fs-body)]">Fibre at the customer's location</span>
              <Badge variant="success">RFS - Eligible for Fibre</Badge>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}

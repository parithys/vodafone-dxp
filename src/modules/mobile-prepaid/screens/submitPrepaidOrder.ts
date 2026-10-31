import { currentAgentId } from '../../../stores/authStore';
import { accountTypeForJourney } from '../../../engines/creditLimit';
import { saveLinkedIdDocument } from '../../new-connection/saveLinkedIdDocument';
import { contactIdentityOrderFields } from '../../new-connection/contactIdentityOrderFields';
import { saveCustomerSalutation } from '../../new-connection/saveCustomerSalutation';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { logActivity, newActivityId } from '../../../engines/activityEngine';
import type { ActivityInput } from '../../../engines/activityEngine';
import { allLines, cartTotals, emailVerification, maskEmail, priceLine, COLLECTION_TEAM_ROLE, STORE_MANAGER_ROLE } from '../../../capabilities';
import { orderTerms } from '../../../capabilities';
import { approvalMessages, decisionRecord, needsCreditControl } from '../../../engines/connectionEligibility';
import type { GuidedContactValue, CrossSalesValue, ConfirmedOrder, PrepaidLine, PricingExtra, PricingProduct } from '../../../capabilities';
import { assertEligibilityChecked } from '../../../engines/eligibilityGuard';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { WinCashPaymentValue } from '../../../components/patterns/WinCashPaymentStep';
import type { CafType } from '../../../components/patterns/cafTypes';
import type { AdditionalDocument } from '../../../capabilities';
import type { useEntityStore } from '../../../stores/entityStore';
import { DEVICE_LABEL, type DeviceType } from '../../../lib/deviceType';
import { idScanAttachments } from '../../new-connection/idScanAttachments';

interface AccountRecord {
  accountId: string;
  customerId: string;
  accountType: string;
}

type EntityStore = ReturnType<typeof useEntityStore.getState>;

/** One step of fulfilment as the order records it: what happened, and when. */
interface FulfilmentEvent {
  requirement: string;
  event: string;
  at: string;
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Everything that happens when a New Prepaid Activation is submitted, in the order of the Mobile Prepaid process flow:
 * the prepaid account (no credit limit or billing account), the order with every subscription in the cart, approval
 * routing (only the eligibility outcomes that route - never HRN), SIM stock depletion on payment, the fulfilment
 * sequence that activates each subscription (service, charging account, plan and benefits, CRM status), the welcome
 * message, and the activity. Returns what the confirmation screen shows. The requirement behind each part (MPRA_001_*)
 * is noted inline.
 */
export async function submitPrepaidOrder(
  values: Record<string, unknown>,
  { createRecord, updateRecord }: Pick<EntityStore, 'createRecord' | 'updateRecord'>,
  device: DeviceType
): Promise<ConfirmedOrder> {
  const contact = values.contact as GuidedContactValue | undefined;
  assertEligibilityChecked(values);
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const crossSales = values.crossSales as CrossSalesValue | undefined;
  const lines = allLines(values);
  const customerId = eligibility?.customerId;
  const idType = contact?.idType;
  const [products, extras] = await Promise.all([
    mockDataEngine.list<PricingProduct & { dataAllowanceGB?: number | null; packValidityDays?: number | null }>('products'),
    mockDataEngine.list<PricingExtra>('addons-discounts'),
  ]);
  const totals = cartTotals(lines, idType, products, extras);
  const payment = values.payment as WinCashPaymentValue | undefined;

  // MPRA_001_CAM_01 / CAM_02 / CAM_03: find-or-create the prepaid account for this customer. No billingProfileId or
  // credit limit is set (CAM_02, ECC_03, BAM_01), and the HRN flag derived at eligibility is stored on the account -
  // stored only: no message and no approval follow from it (CAM_04).
  let accountId: string | undefined;
  if (customerId) {
    const [accounts, customerRecord] = await Promise.all([
      mockDataEngine.list<AccountRecord>('accounts'),
      mockDataEngine.get<{ activePrepaidLines?: number }>('customers', customerId),
    ]);
    const existing = accounts.find((a) => a.customerId === customerId && a.accountType === accountTypeForJourney('prepaid'));
    if (existing) {
      accountId = existing.accountId;
      await updateRecord('accounts', 'accountId', accountId, { hrnFlag: Boolean(eligibility?.requiresHrnAdvance) });
    } else {
      // A prepaid account carries no credit limit: the customer pays in advance (balance), so none of the credit-limit rules applies to it.
      accountId = `ACC-${Date.now().toString().slice(-6)}`;
      await createRecord('accounts', {
        accountId,
        customerId,
        accountType: accountTypeForJourney('prepaid'),
        status: 'Active',
        hrnFlag: Boolean(eligibility?.requiresHrnAdvance),
      });
    }
    // Without this, the line cap (BR-347) would never tighten after a successful order.
    await updateRecord('customers', 'customerId', customerId, {
      activePrepaidLines: (customerRecord?.activePrepaidLines ?? 0) + lines.length,
    });
  }

  // Approval routing. Only the eligibility matrix's own approval-routing outcomes divert a prepaid order (the line cap,
  // a missing ID expiry, an ID type outside the permitted four) and a manually entered identity, which always needs the
  // Store Manager. An HRN customer does NOT route: the Mobile Prepaid flow has no HRN approval (CAM_03 / CAM_04).
  const manualIdEntry = Boolean(contact?.manualEntry);
  const routedChecks = eligibility?.checks.filter((c) => c.outcome === 'approval-routing') ?? [];
  const activeLinesCheck = routedChecks.find((c) => c.id === 'active-lines');
  // The rule engine's decision, when it covered this customer: Credit Control approval routes the order to Credit Control (otherwise the older line-limit rule).
  const lineDecision = eligibility?.connectionDecision;
  const creditControl = lineDecision ? needsCreditControl(lineDecision) : false;
  const pendingApproval = manualIdEntry || routedChecks.length > 0;
  const approvalReason = [
    activeLinesCheck ? (lineDecision ? `Line approval required - ${approvalMessages(lineDecision)}` : `Active prepaid line limit reached - ${activeLinesCheck.message.split('\n')[1] ?? activeLinesCheck.message}`) : '',
    manualIdEntry ? 'Identity manually entered - Store Manager approval required' : '',
    routedChecks.some((c) => c.id === 'id-type-routing') ? 'ID type requires Credit Control approval - routed to Credit Control' : '',
    routedChecks.some((c) => c.id === 'id-validity') ? 'ID expiry date not on file - routed for approval' : '',
  ]
    .filter(Boolean)
    .join(' | ');

  // The signed CAF, the ID scans and the agent's additional documents travel with the order.
  const caf = values.caf as { cafType?: CafType; signatureDataUrl?: string; additionalDocuments?: AdditionalDocument[] } | undefined;
  const attachments = [
    ...idScanAttachments(contact?.idType, contact?.qidScans, { idNumber: contact?.idNumber }),
    ...(caf?.signatureDataUrl ? [{ label: 'Signed CAF', detail: `${caf.cafType ?? 'Digital'} signature`, previewUrl: caf.signatureDataUrl }] : []),
    ...(caf?.additionalDocuments ?? []).map((d) => ({ label: d.label, detail: d.fileName })),
  ];

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const now = () => new Date().toISOString();
  const events: FulfilmentEvent[] = [];
  const record = (requirement: string, event: string) => events.push({ requirement, event, at: now() });
  const first = lines[0];

  // MPRA_001_PAY_03: a Physical SIM or a Printed eSIM is stocked in store, so it is depleted when payment completes
  // (through WinCash in production; here the stock record is marked Issued). Payment has completed by the time the
  // order is submitted (ORD_01). A Virtual eSIM has no store stock: it is depleted at fulfilment below (PAY_04).
  for (const line of lines) {
    if (line.simType.simSerial && line.simType.simType === 'Physical') {
      await updateRecord('sims', 'simSerial', line.simType.simSerial, { stockStatus: 'Issued' });
    }
  }

  // The salutation the agent entered is saved to the customer's profile (shown in Customer 360).
  await saveCustomerSalutation(eligibility?.customerId, contact?.salutation, updateRecord);
  // A QID linked to an existing customer through their Passport is added to that customer's documents (no duplicate customer).
  await saveLinkedIdDocument(contact?.moiResult?.linkedIdUpdate, createRecord);
  await createRecord('orders', {
    orderId,
    customerEmail: contact?.email,
    customerSalutation: contact?.salutation,
    ...contactIdentityOrderFields(contact),
    customerWorkEmail: contact?.workEmail,
    // A new customer's National Address as the NAS returned it: kept with the order, unchanged; the address the customer gave is `address`.
    nationalAddress: contact?.moiResult?.nationalAddress,
    orderType: 'New Prepaid Activation',
    ...decisionRecord(lineDecision),
    createdAt: now(),
    orderSubType: 'Consumer',
    status: pendingApproval ? 'Submitted for Approval' : 'Open',
    ...(pendingApproval ? { manualIdEntry: manualIdEntry || undefined, approvalReason, approverRole: creditControl || routedChecks.some((c) => c.id === 'id-type-routing') ? COLLECTION_TEAM_ROLE : manualIdEntry ? STORE_MANAGER_ROLE : undefined } : {}),
    customerName: contact?.moiResult?.name,
    customerId,
    accountId,
    idNumber: contact?.idNumber,
    lineCount: lines.length,
    lines: lines.map((l, i) => lineRecord(l, i, idType, products, extras)),
    // The first subscription's own fields stay on the order for the screens that list one number per order.
    productId: first?.productId,
    discountId: first?.discountId,
    addonIds: first?.addonIds,
    msisdn: first?.msisdn,
    numberPriceQAR: totals.numberPriceQar,
    starterPackChargeQAR: totals.starterPackChargeQar,
    addonsChargeQAR: totals.addonsChargeQar,
    simCardChargeQAR: totals.simCardChargeQar,
    totalQAR: totals.totalDueQar,
    simType: first?.simType.simType,
    simSerial: first?.simType.simSerial,
    cafType: caf?.cafType,
    attachments,
    createdBy: currentAgentId(),
    sourceChannel: DEVICE_LABEL[device],
    planSource: crossSales?.decision === 'accepted' ? 'Sales Offer' : 'General Plan',
    crossSalesOfferId: crossSales?.decision === 'accepted' ? crossSales.offerId : undefined,
  });

  let finalStatus = pendingApproval ? 'Submitted for Approval' : 'Open';
  if (!pendingApproval) {
    // ORD_02 / NET_01-05: the downstream fulfilment, simulated as ordered steps. The order is Open, then In Progress
    // while its subscriptions are activated, then Complete once the outcome has synchronised to the CRM order status.
    await pause(300);
    await updateRecord('orders', 'orderId', orderId, { status: 'In Progress' });
    for (const [i, line] of lines.entries()) {
      const plan = products.find((p) => p.productId === line.productId);
      const label = `Subscription ${i + 1} (${line.msisdn})`;
      // NET_01: create the prepaid service and associate the MSISDN, SIM and customer/service identifiers. For a
      // Pre-Paired SIM the network barring on it is removed once the service is active.
      const serviceId = `SVC-${Date.now().toString().slice(-5)}${i}`;
      await createRecord('installed-assets', {
        installedAssetId: `IA-${Date.now().toString().slice(-6)}${i}`,
        accountId,
        productServiceName: plan?.name ?? 'Prepaid SIM',
        serviceId,
        status: 'Active',
        effectiveFrom: now().slice(0, 10),
        effectiveTo: null,
        price: priceLine(line, idType, products, extras).starterPackQar,
        promotion: line.productId,
        orderDate: now().slice(0, 10),
        orderNumber: orderId,
        orderType: 'New Prepaid Activation',
        msisdn: line.msisdn,
        simSerial: line.simType.simSerial,
        simType: line.prePaired ? 'Pre-Paired SIM' : (line.simType.simKind ?? line.simType.simType),
        barringStatus: line.prePaired ? 'Removed' : 'None',
      });
      record('MPRA_001_NET_01', `${label}: prepaid service ${serviceId} created; MSISDN, SIM and customer associated.`);
      if (line.prePaired) record('MPRA_001_NET_01', `${label}: network barring removed after activation (Pre-Paired SIM).`);
      await pause(150);
      // NET_02: the prepaid balance and plan in the Charging System. A balance figure is not invented: only the pack's
      // own data allowance is carried; the main balance is not set by activation.
      await createRecord('in-platform-balances', {
        balanceId: `INB-${Date.now().toString().slice(-6)}${i}`,
        accountId,
        customerId,
        msisdn: line.msisdn,
        mainBalanceQAR: null,
        dataBalanceGB: plan?.dataAllowanceGB ?? null,
        voiceBalanceMinutes: null,
        smsBalanceCount: null,
        asOf: now(),
      });
      record('MPRA_001_NET_02', `${label}: Charging System account created with plan ${plan?.name ?? 'SIM only'}.`);
      // NET_03: the plan and the benefits selected in the cart (the discount and any add-ons) are activated.
      const benefits = [...(line.discountId ? [line.discountId] : []), ...line.addonIds].map((id) => extras.find((e) => e.addonDiscountId === id)?.name ?? id);
      record('MPRA_001_NET_03', `${label}: plan activated${benefits.length ? ` with ${benefits.join(', ')}` : ''}.`);
      // PAY_04: a Virtual eSIM is not stocked in store, so its stock is depleted here, at fulfilment.
      if (line.simType.simType === 'eSIM') record('MPRA_001_PAY_04', `${label}: Virtual eSIM stock depleted at fulfilment.`);
      await pause(150);
    }
    // NET_04: the activation outcome is synchronised to the CRM order status.
    await updateRecord('orders', 'orderId', orderId, { status: 'Complete' });
    record('MPRA_001_NET_04', 'Activation outcome synchronised to the CRM order status: Complete.');
    finalStatus = 'Complete';
  }
  // PAY_03 / the fulfilment trail, kept on the order so the approver and Customer 360 can read what happened.
  for (const line of lines) {
    if (line.simType.simSerial && line.simType.simType === 'Physical') {
      events.unshift({ requirement: 'MPRA_001_PAY_03', event: `${line.simType.simKind ?? 'Physical SIM'} ${line.simType.simSerial} depleted from stock on payment completion.`, at: now() });
    }
  }
  await updateRecord('orders', 'orderId', orderId, { fulfilmentEvents: events, fulfilmentStatus: finalStatus });

  // NET_05 (P2) / NOT_01: the welcome message. Only the activated numbers are notified; the BRSD's "all active MSISDNs
  // on the QID" needs a directory this schema does not have. The confirmation email is the shared Postpaid one, sent
  // by the confirmation page.
  await createRecord('osb-notifications', {
    messageId: `MSG-${Date.now().toString().slice(-6)}`,
    orderId,
    dbTimestamp: now(),
    server: 'OSB-PRD-NODE1',
    state: 'COMPLETED',
    node: 'Node1',
    pipeline: 'PS_VFQA_Communication_Pipeline',
    stage: 'SendSMS',
    inboundService: 'PS_VFQA_Communication',
    operation: 'CreateCommunication',
    smsText: pendingApproval
      ? `Dear customer, your prepaid activation order ${orderId} has been submitted and is awaiting approval.`
      : `Dear customer, your prepaid activation order ${orderId} is complete. Welcome to Vodafone Qatar prepaid - ${lines.map((l) => l.msisdn).join(', ')}.`,
  });

  // The activities are automatic (activityEngine): a workflow event when routed for approval; the Completed activity is
  // recorded on Done & Exit under the number reserved here.
  const activityCtx = { journey: 'New Prepaid Activation', orderId, customerId, customerName: contact?.moiResult?.name, idNumber: contact?.idNumber };
  const activityId = newActivityId();
  const completionActivity: ActivityInput = {
    ...activityCtx,
    activityNumber: activityId,
    trigger: 'completed',
    reason: pendingApproval
      ? `Order ${orderId} submitted and is awaiting approval.`
      : `Order ${orderId} submitted and activated${payment?.reference ? ` (WinCash ref ${payment.reference})` : payment?.method === 'Cash' ? ' (cash received by the agent)' : ''}.`,
  };
  if (pendingApproval) {
    await logActivity({ ...activityCtx, trigger: 'workflow-event', name: 'Order Routed for Approval', reason: approvalReason || 'Order requires approval before it can complete.' });
  }

  const eSimLine = lines.find((l) => l.simType.simType === 'eSIM');
  return {
    orderId,
    activityId,
    completionActivity,
    pendingApproval,
    customerName: contact?.moiResult?.name ?? '-',
    customerId,
    // Every subscription's number and pack, joined, for the confirmation page.
    msisdn: lines.map((l) => l.msisdn).join(', ') || '-',
    planName: lines.map((l) => products.find((p) => p.productId === l.productId)?.name ?? 'SIM only').join(', ') || 'SIM only',
    dueTodayQar: totals.totalDueQar,
    simType: [...new Set(lines.map((l) => (l.prePaired ? 'Pre-Paired SIM' : l.simType.simType)))].filter(Boolean).join(', ') || undefined,
    // The first eSIM subscription's activation code, for the QR handover panel.
    esimActivationCode: eSimLine?.simType.esimActivationCode,
    customerEmail: contact?.email,
    customerEmailDisplay: contact?.moiResult?.isNewCustomer && !contact?.moiResult?.createdByAgent && contact.email ? maskEmail(contact.email) : contact?.email,
    customerEmailVerified: emailVerification(contact?.email, contact?.moiResult?.email).verified,
    terms: orderTerms(values, 'prepaid'),
    service: 'mobile',
  };
}

/** One subscription as the order records it. */
function lineRecord(line: PrepaidLine, index: number, idType: string | undefined, products: PricingProduct[], extras: PricingExtra[]) {
  const charges = priceLine(line, idType, products, extras);
  return {
    lineNumber: index + 1,
    msisdn: line.msisdn,
    productId: line.productId,
    discountId: line.discountId,
    addonIds: line.addonIds,
    prePaired: line.prePaired,
    numberPriceQAR: charges.numberQar,
    starterPackChargeQAR: charges.starterPackQar,
    addonsChargeQAR: charges.addonsQar,
    simCardChargeQAR: charges.simCardChargeQar,
    totalQAR: charges.totalQar,
    simType: line.simType.simType,
    simKind: line.prePaired ? 'Pre-Paired SIM' : line.simType.simKind,
    simSerial: line.simType.simSerial,
  };
}

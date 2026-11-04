import { currentAgentId } from '../../../stores/authStore';
import { postpaidManagerRoute } from '../../../data/approvalRouting';
import { usePersonaStore } from '../../../stores/personaStore';
import { storedAddressLine } from '../../../components/patterns/addressFromBilling';
import { accountTypeForJourney } from '../../../engines/creditLimit';
import { saveLinkedIdDocument } from '../../new-connection/saveLinkedIdDocument';
import { contactIdentityOrderFields } from '../../new-connection/contactIdentityOrderFields';
import { saveCustomerSalutation } from '../../new-connection/saveCustomerSalutation';
import { idScanAttachments } from '../../new-connection/idScanAttachments';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { logActivity, newActivityId } from '../../../engines/activityEngine';
import type { ActivityInput } from '../../../engines/activityEngine';
import { COLLECTION_TEAM_ROLE, emailVerification, maskEmail, persistBillingAccount } from '../../../capabilities';
import { orderTerms, primaryContactMobile } from '../../../capabilities';
import { approvalMessages, decisionRecord, needsCreditControl } from '../../../engines/connectionEligibility';
import type { BillingAccountValue, ConfirmedOrder, GuidedContactValue } from '../../../capabilities';
import type { DonorDetailsValue } from '../../../components/patterns/DonorDetailsStep';
import type { DonorAttachmentValue } from '../../../components/patterns/DonorAttachmentStep';
import { buildPortInRecord } from '../../../engines/portInEngine';
import { normalizePortInNumber } from '../../../data/portInRules';
import { PORT_IN_STATUS_PATH } from './portInStatusPath';
import { SIM_RESERVED } from '../../../data/portInRules';
import { SUPPORTING_ID_DISCOUNT_TYPES } from '../../../components/patterns/postpaidPlanModel';
import { gatePasses, mnpValidationGate } from './mnpValidationGate';
import type { CheckoutTotals } from '../../../components/patterns/checkoutSummaryModel';
import type { WinCashPaymentValue } from '../../../components/patterns/WinCashPaymentStep';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { ZsbAddressValue } from '../../../components/patterns/ZsbAddressStep';
import type { useEntityStore } from '../../../stores/entityStore';
import { formatDateTime } from '../../../lib/format';

type EntityStore = ReturnType<typeof useEntityStore.getState>;

/** The reusable part of a submitted journey: what a Quick Draft from a cancelled order starts from (BR-MNP-026). */
const REUSABLE_KEYS = ['contact', 'customerType', 'address', 'billingAccount', 'billing', 'billLimit', 'productId', 'discountId', 'addonIds', 'mnpType'] as const;

/**
 * Everything that happens when an MNP port-in is submitted: the order and its port-in request, the activity, and what the
 * confirmation page shows. The request goes to NPAS and the order is Pending NPAS Approval (BR-MNP-013): nothing is created,
 * activated or billed until NPAS answers, and the Port-In Status screen carries it from there. A postpaid B2B2C order additionally
 * goes to manager approval first and is sent to NPAS after it. Before anything is written the validation gate must hold (BR-MNP-009:
 * customer, eligibility, billing, plan, SIM, MNP details, signed MNP Form and CAF, and the payment or zero-value receipt, BR-MNP-011)
 * and the Vodafone SIM is reserved against the order (BR-MNP-008); a SIM that is no longer available stops the submission. A postpaid
 * port-in keeps a billing account like any postpaid line (an existing one, or a new default one).
 */
export async function submitMnpOrder(
  values: Record<string, unknown>,
  { createRecord, updateRecord }: Pick<EntityStore, 'createRecord' | 'updateRecord'>
): Promise<ConfirmedOrder> {
  const gate = mnpValidationGate(values, 'submit');
  if (!gatePasses(gate)) throw new Error(`Port-in validations not complete: ${gate.filter((c) => !c.ok).map((c) => c.label).join(', ')}`);

  const mnpType = (values.mnpType as 'postpaid' | 'prepaid' | undefined) ?? 'postpaid';
  const isPrepaid = mnpType === 'prepaid';
  const contact = values.contact as GuidedContactValue;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const donorDetails = values.donorDetails as DonorDetailsValue;
  const address = values.address as ZsbAddressValue | undefined;
  const attachment = values.donorAttachment as DonorAttachmentValue | undefined;
  // DF-MNP-009: the order carries the number normalised; the agent may have typed it with spaces or without the country code.
  const portInNumber = normalizePortInNumber(donorDetails.portInNumber ?? '') ?? donorDetails.portInNumber ?? '';
  const products = await mockDataEngine.list<{ productId: string; name: string }>('products');
  const plan = products.find((p) => p.productId === values.productId);
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const payment = values.payment as WinCashPaymentValue | undefined;
  const dueTodayQar = (values.checkoutTotals as CheckoutTotals | undefined)?.dueTodayQar ?? 0;

  // BR-MNP-008: the Vodafone SIM is reserved for this request before it is submitted, and stays inactive until NPAS approves. It is
  // released again if NPAS rejects the request or it is cancelled (BR-MNP-025). A SIM taken since it was scanned stops the submission.
  const simSerial = values.simSerial as string | undefined;
  const sims = await mockDataEngine.list<{ simSerial: string; stockStatus: string }>('sims');
  const sim = sims.find((x) => x.simSerial === simSerial);
  if (!sim || sim.stockStatus === 'Issued' || sim.stockStatus === SIM_RESERVED) throw new Error('The SIM is no longer available. Scan another SIM.');
  await updateRecord('sims', 'simSerial', sim.simSerial, { stockStatus: SIM_RESERVED, reservedForOrderId: orderId });
  // B2B2C orders route to manager approval (the generalized UJ-081/UJ-082 pattern); prepaid port-in has no B2B2C concept.
  const isB2B2C = !isPrepaid && Boolean(contact.isB2B2C);
  // As New Mobile Postpaid: a MADA / B2B2C discount needs its supporting document verified, so the order waits for the manager first.
  const discounts = await mockDataEngine.list<{ addonDiscountId: string; addonType?: string }>('addons-discounts');
  const discountNeedsApproval = !isPrepaid && SUPPORTING_ID_DISCOUNT_TYPES.has(discounts.find((d) => d.addonDiscountId === values.discountId)?.addonType ?? '');
  // The rule engine's decision, when it covered this customer: any approval it asks for holds the order; Credit Control approval routes it to Credit Control.
  const lineDecision = eligibility?.connectionDecision;
  const needsApproval = isB2B2C || discountNeedsApproval || lineDecision?.outcome === 'ALLOW_WITH_APPROVAL';

  const billingProfileId = isPrepaid
    ? undefined
    : await persistBillingAccount(values.billingAccount as BillingAccountValue | undefined, {
        createRecord,
        updateRecord,
        kind: accountTypeForJourney('postpaid'),
        customerId: eligibility?.customerId,
        idNumber: contact.idNumber,
        contactName: contact.moiResult?.name,
        contactEmail: contact.email,
        contactPhone: primaryContactMobile(contact),
        addressLine: storedAddressLine(address),
        creditLimitQar: eligibility?.defaultCreditLimitQar,
        nationality: eligibility?.nationality,
        segment: eligibility?.segment,
        agentId: currentAgentId() ?? undefined,
      });

  // The salutation the agent entered is saved to the customer's profile (shown in Customer 360).
  await saveCustomerSalutation(eligibility?.customerId, contact.salutation, updateRecord);
  // A QID linked to an existing customer through their Passport is added to that customer's documents (no duplicate customer).
  await saveLinkedIdDocument(contact.moiResult?.linkedIdUpdate, createRecord);
  await createRecord('orders', {
    orderId,
    orderType: isPrepaid ? 'MNP Prepaid Port-In' : 'MNP Postpaid Port-In',
    orderSubType: isB2B2C ? 'B2B2C' : 'Port-In',
    ...decisionRecord(lineDecision),
    ...(needsApproval && lineDecision?.outcome === 'ALLOW_WITH_APPROVAL' ? { approvalReason: `Line approval required - ${approvalMessages(lineDecision)}`, ...(needsCreditControl(lineDecision) ? { approverRole: COLLECTION_TEAM_ROLE } : {}) } : {}),
    // A postpaid Port-In that needs approval, raised by a persona whose postpaid orders all go to their manager (Retail Sales), goes to that manager.
    ...(needsApproval && !isPrepaid && postpaidManagerRoute(usePersonaStore.getState().activePersonaId) ? { approverRole: postpaidManagerRoute(usePersonaStore.getState().activePersonaId) } : {}),
    // The order shows its Port-In status: Pending NPAS Approval until NPAS answers (Annex_02). B2B2C waits for the manager first.
    status: needsApproval ? 'Submitted for Approval' : 'Pending NPAS Approval',
    createdAt: new Date().toISOString(),
    customerName: contact.moiResult?.name,
    customerId: eligibility?.customerId,
    idNumber: contact.idNumber,
    customerEmail: contact.email,
    customerSalutation: contact.salutation,
    ...contactIdentityOrderFields(contact),
    customerWorkEmail: contact.workEmail,
    // A new customer's National Address as the NAS returned it: kept with the order, unchanged; the address the customer gave is `address`.
    nationalAddress: contact.moiResult?.nationalAddress,
    // The identity document captured at Customer Verification, as scanned or uploaded.
    attachments: idScanAttachments(contact.idType, contact.qidScans, { idNumber: contact.idNumber }),
    productId: values.productId,
    msisdn: portInNumber,
    ...(isPrepaid ? { discountId: values.discountId } : { billLimitQAR: values.billLimit, billingProfileId, discountId: values.discountId, addonIds: (values.addonIds as string[] | undefined) ?? [], addonBilling: values.addonBilling, monthlyRecurringQar: (values.checkoutTotals as CheckoutTotals | undefined)?.monthlyRecurringQar }),
    simSerial: values.simSerial,
    totalQAR: dueTodayQar,
    createdBy: currentAgentId(),
    sourceChannel: 'Desktop',
  });
  const draftSnapshot: Record<string, unknown> = {};
  for (const k of REUSABLE_KEYS) if (values[k] !== undefined) draftSnapshot[k] = values[k];
  draftSnapshot.donorDetails = { ...donorDetails, portInNumberBlocked: undefined };
  const requestId = `MNP-${Date.now().toString().slice(-6)}`;
  const request = buildPortInRecord({
    id: requestId,
    orderId,
    customerId: eligibility?.customerId,
    customerName: contact.moiResult?.name,
    idNumber: contact.idNumber,
    mnpCategory: isPrepaid ? 'Prepaid Consumer' : 'Postpaid Consumer',
    planSelected: values.productId as string | undefined,
    portInNumber,
    donor: {
      customerId: donorDetails.donorId,
      idType: donorDetails.donorIdType,
      customerType: donorDetails.donorCustomerType,
      operator: donorDetails.donorOperator,
      subscriptionType: donorDetails.donorSubscriptionType,
    },
    scheduledPortInDate: donorDetails.scheduledPortInDate,
    mnpForm: { number: attachment?.formNumber, signed: attachment?.signed, type: attachment?.mnpFormType },
    simSerial: values.simSerial as string | undefined,
    simPreviousStockStatus: sim.stockStatus,
    payment: { amountQar: dueTodayQar, method: payment?.method, receiptNumber: payment?.reference },
    sourceCancelledOrderId: values.sourceCancelledOrderId as string | undefined,
    recipient: { phone: contact.moiResult?.phone, email: contact.email },
    draftSnapshot,
  });
  // A B2B2C request is sent to NPAS only once the manager approves it; until then it is Submitted, not awaiting NPAS.
  const record = needsApproval
    ? {
        ...request,
        orderStatus: 'Submitted' as const,
        portStatus: 'Submitted' as const,
        npasReference: undefined,
        npasDeadline: undefined,
        history: [{ ...request.history[0], note: 'Submitted for manager approval; it goes to NPAS once approved.' }],
      }
    : request;
  await createRecord('mnp-portin-orders', record as unknown as Record<string, unknown>);

  const journey = isPrepaid ? 'MNP Prepaid Port-In' : 'MNP Postpaid Port-In';
  const activityCtx = { journey, orderId, customerId: eligibility?.customerId, customerName: contact.moiResult?.name, idNumber: contact.idNumber };
  const comments = (values.comments as string | undefined)?.trim();
  // The agent's note on the Activity step is recorded as a manual activity; the Completed one is automatic, recorded on Done & Exit.
  if (comments) await logActivity({ ...activityCtx, trigger: 'manual', comments });
  const activityId = newActivityId();
  const completionActivity: ActivityInput = {
    ...activityCtx,
    activityNumber: activityId,
    trigger: 'completed',
    reason: needsApproval
      ? `Order ${orderId} submitted for manager approval - porting ${portInNumber} from ${donorDetails.donorOperator ?? 'the donor operator'}.`
      : `Order ${orderId} submitted - porting ${portInNumber} from ${donorDetails.donorOperator ?? 'the donor operator'} (Status: Pending NPAS Approval).`,
  };

  return {
    orderId,
    activityId,
    completionActivity,
    pendingApproval: needsApproval,
    customerName: contact.moiResult?.name ?? '-',
    customerId: eligibility?.customerId,
    msisdn: portInNumber || '-',
    planName: plan?.name ?? '-',
    simType: values.simSerial ? 'Physical' : undefined,
    dueTodayQar,
    heading: needsApproval ? 'Port-in order submitted for approval' : 'Port-in request submitted',
    statusLabel: needsApproval ? 'Submitted for Approval' : 'Pending NPAS Approval',
    extraLines: [
      ...(record.npasReference ? [{ label: 'NPAS Reference', value: record.npasReference }] : []),
      ...(payment?.reference ? [{ label: payment.zeroValue ? 'Zero-value receipt' : 'Receipt', value: payment.reference }] : []),
      ...(attachment?.formNumber ? [{ label: 'MNP Form', value: `${attachment.formNumber} (signed)` }] : []),
      ...(record.npasDeadline ? [{ label: 'NPAS Response Due', value: formatDateTime(record.npasDeadline) }] : []),
    ],
    trackAction: { label: 'Track Port-In Status', to: `${PORT_IN_STATUS_PATH}?id=${requestId}` },
    customerEmail: contact.email,
    customerEmailDisplay: contact.moiResult?.isNewCustomer && !contact.moiResult?.createdByAgent && contact.email ? maskEmail(contact.email) : contact.email,
    customerEmailVerified: emailVerification(contact.email, contact.moiResult?.email).verified,
    terms: orderTerms(values, mnpType),
    service: 'mobile',
  };
}

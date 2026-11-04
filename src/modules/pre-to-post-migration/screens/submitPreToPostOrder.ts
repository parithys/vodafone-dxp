import { currentAgentId } from '../../../stores/authStore';
import { addonChargeNowQar, type AddonBillingFrequency } from '../../../engines/addonCategories';
import { accountTypeForJourney } from '../../../engines/creditLimit';
import { saveLinkedIdDocument } from '../../new-connection/saveLinkedIdDocument';
import { contactIdentityOrderFields } from '../../new-connection/contactIdentityOrderFields';
import { saveCustomerSalutation } from '../../new-connection/saveCustomerSalutation';
import { hrnAdvanceQar } from '../../../engines/hrnConfiguration';
import { usePersonaStore } from '../../../stores/personaStore';
import { postpaidManagerRoute } from '../../../data/approvalRouting';
import { idScanAttachments } from '../../new-connection/idScanAttachments';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { newActivityId } from '../../../engines/activityEngine';
import type { ActivityInput } from '../../../engines/activityEngine';
import { COLLECTION_TEAM_ROLE, emailVerification, maskEmail, persistBillingAccount } from '../../../capabilities';
import { orderTerms, primaryContactMobile } from '../../../capabilities';
import { decisionRecord, needsCreditControl } from '../../../engines/connectionEligibility';
import type { BillingAccountValue, ConfirmedOrder, CustomerLine, GuidedContactValue } from '../../../capabilities';
import type { CustomerTypeValue } from '../../../capabilities/CustomerType/customerTypeModel';
import { monthlyCharges } from '../../../engines/postpaidPricing';
import { applyLineChange } from '../../mobile-service-changes/applyServiceChange';
import { routesToApproval } from '../../new-connection/approvalRouting';
import type { CheckoutTotals } from '../../../components/patterns/checkoutSummaryModel';
import { assertEligibilityChecked } from '../../../engines/eligibilityGuard';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import type { useEntityStore } from '../../../stores/entityStore';
import { formatQar } from '../../../lib/format';

type EntityStore = ReturnType<typeof useEntityStore.getState>;

/**
 * Submits a Prepaid to Postpaid conversion (UJ-086): the Plan Change / Pre2Post order and its confirmation. Priced as
 * New Mobile Postpaid is (plan, add-ons, discount, VAT). A conversion that needs a second look - HRN advance, an eligibility
 * approval route, a B2B2C customer, a MADA / B2B2C discount, a manually entered identity - waits for the manager; otherwise
 * it completes.
 */
export async function submitPreToPostOrder(
  values: Record<string, unknown>,
  { createRecord, updateRecord }: Pick<EntityStore, 'createRecord' | 'updateRecord'>
): Promise<ConfirmedOrder> {
  const contact = values.contact as GuidedContactValue;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const customerType = values.customerType as CustomerTypeValue | undefined;
  const addonIds = (values.addonIds as string[] | undefined) ?? [];
  const addonBilling = (values.addonBilling as Record<string, AddonBillingFrequency> | undefined) ?? {};
  const dueTodayQar = (values.checkoutTotals as CheckoutTotals | undefined)?.dueTodayQar ?? 0;
  const line = values.line as CustomerLine;
  assertEligibilityChecked(values);
  // The order is for the customer identified now and the line chosen for them: not whoever was identified before a later change, and not a draft resumed
  // without its eligibility result (it is never carried over, so the customer must be re-identified).
  const checkedCustomer = (values.eligibility as EligibilityResult | undefined)?.customerId;
  if (!line || !checkedCustomer || line.customerId !== checkedCustomer) {
    throw new Error('The customer\'s eligibility has not been checked for this line. Return to Customer Verification, then choose the line again.');
  }
  const msisdn = line.identifier;

  const products = await mockDataEngine.list<{ productId: string; name: string; mrcQAR: number }>('products');
  const plan = products.find((p) => p.productId === values.productId);
  const discounts = await mockDataEngine.list<{ addonDiscountId: string; price?: number; addonType?: string }>('addons-discounts');
  const discount = discounts.find((d) => d.addonDiscountId === values.discountId);
  const monthlyRecurringQar = monthlyCharges({
    planQar: plan?.mrcQAR ?? 0,
    discountRate: discount?.price,
    addonsQar: products.filter((p) => addonIds.includes(p.productId)).reduce((sum, a) => sum + addonChargeNowQar(a, addonBilling[a.productId]), 0),
  }).totalQar;

  const pendingApproval = routesToApproval({ contact, eligibility, customerType, discountType: discount?.addonType });

  const billingProfileId = await persistBillingAccount(values.billingAccount as BillingAccountValue | undefined, {
    createRecord,
    updateRecord,
    kind: accountTypeForJourney('postpaid'),
    customerId: eligibility?.customerId,
    idNumber: contact.idNumber,
    contactName: contact.moiResult?.name,
    contactEmail: contact.email,
    contactPhone: primaryContactMobile(contact),
    creditLimitQar: eligibility?.defaultCreditLimitQar,
    nationality: eligibility?.nationality,
    segment: eligibility?.segment,
    agentId: currentAgentId() ?? undefined,
  });

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  // The salutation the agent entered is saved to the customer's profile (shown in Customer 360).
  await saveCustomerSalutation(eligibility?.customerId, contact.salutation, updateRecord);
  // A QID linked to an existing customer through their Passport is added to that customer's documents (no duplicate customer).
  await saveLinkedIdDocument(contact.moiResult?.linkedIdUpdate, createRecord);
  await createRecord('orders', {
    orderId,
    orderType: 'Plan Change',
    orderSubType: 'Pre2Post',
    ...decisionRecord(eligibility?.connectionDecision),
    ...(pendingApproval && needsCreditControl(eligibility?.connectionDecision) ? { approverRole: COLLECTION_TEAM_ROLE } : {}),
    ...(pendingApproval && postpaidManagerRoute(usePersonaStore.getState().activePersonaId) ? { approverRole: postpaidManagerRoute(usePersonaStore.getState().activePersonaId) } : {}),
    status: pendingApproval ? 'Submitted for Approval' : 'Complete',
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
    msisdn,
    installedAssetId: line.installedAssetId,
    previousProductId: line.productId,
    productId: values.productId,
    discountId: values.discountId,
    addonIds,
    addonBilling,
    billLimitQAR: values.billLimit,
    billingProfileId,
    monthlyRecurringQar,
    totalQAR: dueTodayQar,
    createdBy: currentAgentId(),
    sourceChannel: 'Desktop',
  });

  // The line is postpaid once the order completes (it is a postpaid line by its service name from then on); a held order leaves it prepaid.
  if (!pendingApproval && plan) await applyLineChange({ installedAssetId: line.installedAssetId, productId: plan.productId }, updateRecord);

  const activityId = newActivityId();
  const completionActivity: ActivityInput = {
    journey: 'Pre-to-Post Conversion',
    orderId,
    customerId: eligibility?.customerId,
    customerName: contact.moiResult?.name,
    idNumber: contact.idNumber,
    activityNumber: activityId,
    trigger: 'completed',
    reason: pendingApproval
      ? `Order ${orderId} submitted for manager approval - converting ${msisdn} to ${plan?.name ?? 'a postpaid plan'}${eligibility?.requiresHrnAdvance ? ` (${formatQar(hrnAdvanceQar({ nationality: eligibility?.nationality, personaId: usePersonaStore.getState().activePersonaId }))} advance payment applies)` : ''}.`
      : `Order ${orderId} complete - ${msisdn} converted to ${plan?.name ?? 'a postpaid plan'}.`,
  };

  return {
    orderId,
    activityId,
    completionActivity,
    pendingApproval,
    customerName: contact.moiResult?.name ?? '-',
    customerId: eligibility?.customerId,
    msisdn: msisdn || '-',
    planName: plan?.name ?? '-',
    dueTodayQar,
    monthlyRecurringQar,
    heading: pendingApproval ? 'Conversion submitted for approval' : 'Conversion complete',
    statusLabel: pendingApproval ? 'Submitted for Approval' : 'Complete',
    customerEmail: contact.email,
    customerEmailDisplay: contact.moiResult?.isNewCustomer && !contact.moiResult?.createdByAgent && contact.email ? maskEmail(contact.email) : contact.email,
    customerEmailVerified: emailVerification(contact.email, contact.moiResult?.email).verified,
    terms: orderTerms(values, 'postpaid'),
    service: 'mobile',
  };
}

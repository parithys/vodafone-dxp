import { currentAgentId } from '../../stores/authStore';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { newActivityId } from '../../engines/activityEngine';
import type { ActivityInput } from '../../engines/activityEngine';
import { monthlyCharges } from '../../engines/postpaidPricing';
import { emailVerification, maskEmail } from '../../capabilities';
import { orderTerms } from '../../capabilities';
import type { ConfirmedOrder, CustomerLine, GuidedContactValue, PrepaidCheckoutTotals } from '../../capabilities';
import type { CustomerTypeValue } from '../../capabilities/CustomerType/customerTypeModel';
import type { CheckoutTotals } from '../../components/patterns/checkoutSummaryModel';
import { assertEligibilityChecked } from '../../engines/eligibilityGuard';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { useEntityStore } from '../../stores/entityStore';
import { applyLineChange } from './applyServiceChange';
import { routesToApproval } from '../new-connection/approvalRouting';

type EntityStore = ReturnType<typeof useEntityStore.getState>;

export type ServiceChangeKind = 'change-postpaid-plan' | 'change-prepaid-pack' | 'add-addon';

const JOURNEY_LABEL: Record<ServiceChangeKind, string> = {
  'change-postpaid-plan': 'Change Postpaid Plan',
  'change-prepaid-pack': 'Change Prepaid Pack',
  'add-addon': 'Add Add-On',
};

interface ProductRecord {
  productId: string;
  name: string;
  mrcQAR?: number;
  starterPackChargeQAR?: number;
}
interface ExtraRecord {
  addonDiscountId: string;
  name: string;
  addonType?: string;
  price?: number;
}

/**
 * Submits Change Postpaid Plan, Change Prepaid Pack or Add Add-On: the order against the chosen line and the confirmation. A plan or pack
 * change also moves the line to the new plan or pack once the order completes. A change that needs a second look (an identity entered by
 * hand, B2B2C, a MADA / B2B2C discount, an eligibility approval route) is held for the manager first and the line stays as it is until
 * then; otherwise the order completes. Priced as the matching new-connection journey prices it.
 */
export async function submitServiceChangeOrder(
  kind: ServiceChangeKind,
  values: Record<string, unknown>,
  { createRecord, updateRecord }: Pick<EntityStore, 'createRecord' | 'updateRecord'>
): Promise<ConfirmedOrder> {
  const line = values.line as CustomerLine;
  const contact = values.contact as GuidedContactValue;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  assertEligibilityChecked(values);
  // The order is for the customer identified now and the line chosen for them: not whoever was identified before a later change, and not a draft resumed
  // without its eligibility result (it is never carried over, so the customer must be re-identified).
  const checkedCustomer = (values.eligibility as EligibilityResult | undefined)?.customerId;
  if (!line || !checkedCustomer || line.customerId !== checkedCustomer) {
    throw new Error('The customer\'s eligibility has not been checked for this line. Return to Customer Verification, then choose the line again.');
  }
  const customerType = values.customerType as CustomerTypeValue | undefined;
  const addonIds = (values.addonIds as string[] | undefined) ?? [];
  const prepaid = line.lineType === 'prepaid';
  const changesPlan = kind !== 'add-addon';

  const [products, extras] = await Promise.all([
    mockDataEngine.list<ProductRecord>('products'),
    mockDataEngine.list<ExtraRecord>('addons-discounts'),
  ]);
  // Prepaid add-ons and discounts are addons-discounts records; postpaid add-ons are products.
  const newPlan = products.find((p) => p.productId === (changesPlan ? values.productId : line.productId));
  const discount = extras.find((d) => d.addonDiscountId === values.discountId);
  const addons = prepaid
    ? extras.filter((d) => addonIds.includes(d.addonDiscountId)).map((d) => ({ name: d.name, price: d.price ?? 0 }))
    : products.filter((p) => addonIds.includes(p.productId)).map((p) => ({ name: p.name, price: p.mrcQAR ?? 0 }));

  const dueTodayQar = prepaid
    ? ((values.checkoutTotals as PrepaidCheckoutTotals | undefined)?.totalDueQar ?? 0)
    : ((values.checkoutTotals as CheckoutTotals | undefined)?.dueTodayQar ?? 0);
  const monthlyRecurringQar = prepaid
    ? undefined
    : monthlyCharges({ planQar: newPlan?.mrcQAR ?? 0, discountRate: discount?.price, addonsQar: addons.reduce((sum, a) => sum + a.price, 0) }).totalQar;

  const pendingApproval = routesToApproval({ contact, eligibility, customerType, discountType: discount?.addonType, prepaid });
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  await createRecord('orders', {
    orderId,
    orderType: kind === 'change-postpaid-plan' ? 'Plan Change' : kind === 'change-prepaid-pack' ? 'Prepaid Pack Change' : 'Add-On',
    orderSubType: kind === 'change-postpaid-plan' ? 'Post2Post' : kind === 'change-prepaid-pack' ? 'Prepaid2Prepaid' : prepaid ? 'Prepaid Add-On' : 'Postpaid Add-On',
    status: pendingApproval ? 'Submitted for Approval' : 'Complete',
    createdAt: new Date().toISOString(),
    customerName: contact.moiResult?.name,
    customerId: eligibility?.customerId,
    idNumber: contact.idNumber,
    customerEmail: contact.email,
    msisdn: line.identifier,
    installedAssetId: line.installedAssetId,
    previousProductId: line.productId,
    productId: newPlan?.productId,
    ...(changesPlan ? { discountId: values.discountId } : {}),
    addonIds,
    billingProfileId: line.billingProfileId,
    ...(monthlyRecurringQar !== undefined ? { monthlyRecurringQar } : {}),
    totalQAR: dueTodayQar,
    createdBy: currentAgentId(),
    sourceChannel: 'Desktop',
  });
  // The line moves to the new plan or pack once the order completes. A held order leaves it as it is; the approver's approval applies it (applyApprovedLineChange).
  if (changesPlan && !pendingApproval && newPlan) await applyLineChange({ installedAssetId: line.installedAssetId, productId: newPlan.productId }, updateRecord);

  const label = JOURNEY_LABEL[kind];
  const activityId = newActivityId();
  const what = changesPlan ? `${line.identifier} moved from ${line.productName} to ${newPlan?.name ?? 'the new plan'}` : `${addons.map((a) => a.name).join(', ')} added to ${line.identifier}`;
  const completionActivity: ActivityInput = {
    journey: label,
    orderId,
    customerId: eligibility?.customerId,
    customerName: contact.moiResult?.name,
    idNumber: contact.idNumber,
    activityNumber: activityId,
    trigger: 'completed',
    reason: pendingApproval ? `Order ${orderId} submitted for manager approval - ${what}.` : `Order ${orderId} complete - ${what}.`,
  };

  return {
    orderId,
    activityId,
    completionActivity,
    pendingApproval,
    customerName: contact.moiResult?.name ?? '-',
    customerId: eligibility?.customerId,
    msisdn: line.identifier,
    planName: changesPlan ? (newPlan?.name ?? '-') : `${line.productName} + ${addons.map((a) => a.name).join(', ')}`,
    dueTodayQar,
    ...(monthlyRecurringQar !== undefined ? { monthlyRecurringQar } : {}),
    heading: pendingApproval ? `${label} submitted for approval` : `${label} complete`,
    statusLabel: pendingApproval ? 'Submitted for Approval' : 'Complete',
    extraLines: [
      ...(changesPlan ? [{ label: 'Previous Plan', value: line.productName }] : []),
      ...(addons.length > 0 ? [{ label: 'Add-Ons', value: addons.map((a) => a.name).join(', ') }] : []),
    ],
    customerEmail: contact.email,
    customerEmailDisplay: contact.moiResult?.isNewCustomer && !contact.moiResult?.createdByAgent && contact.email ? maskEmail(contact.email) : contact.email,
    customerEmailVerified: emailVerification(contact.email, contact.moiResult?.email).verified,
    terms: orderTerms(values, 'postpaid'),
    service: 'mobile',
  };
}

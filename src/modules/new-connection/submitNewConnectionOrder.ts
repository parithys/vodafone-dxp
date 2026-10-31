import { currentAgentId } from '../../stores/authStore';
import { storedAddressLine } from '../../components/patterns/addressFromBilling';
import { accountTypeForJourney } from '../../engines/creditLimit';
import { scanFileName, specialDiscountDocumentLabel } from '../../engines/journeyDocuments';
import { saveLinkedIdDocument } from './saveLinkedIdDocument';
import { contactIdentityOrderFields } from './contactIdentityOrderFields';
import { saveCustomerSalutation } from './saveCustomerSalutation';
import { actualUserOrderFields, saveActualUserContact } from '../../capabilities/ActualUser';
import type { ActualUserValue } from '../../capabilities/ActualUser';
import { hrnAdvanceQar } from '../../engines/hrnConfiguration';
import { usePersonaStore } from '../../stores/personaStore';
import { defaultBillLimitQar, formatQar, monthlyCharges } from '../../engines/postpaidPricing';
import { effectiveCreditLimitQar, emailVerification, maskEmail, persistBillingAccount } from '../../capabilities';
import { orderTerms, primaryContactMobile } from '../../capabilities';
import type { GuidedContactValue } from '../../capabilities';
import type { BillingAccountValue } from '../../capabilities';
import { SUPPORTING_ID_DISCOUNT_TYPES } from '../../components/patterns/postpaidPlanModel';
import { assertEligibilityChecked } from '../../engines/eligibilityGuard';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { SimTypeValue } from '../../components/domain/SimTypeStep';
import type { CheckoutTotals } from '../../components/patterns/checkoutSummaryModel';
import type { WinCashPaymentValue } from '../../components/patterns/WinCashPaymentStep';
import type { CafType } from '../../components/patterns/cafTypes';
import type { AdditionalDocument } from '../../capabilities';
import type { CustomerTypeValue } from '../../capabilities';
import type { CrossSalesValue } from '../../capabilities';
import { STORE_MANAGER_ROLE, COLLECTION_TEAM_ROLE } from '../../capabilities';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { logActivity, newActivityId } from '../../engines/activityEngine';
import type { ActivityInput } from '../../engines/activityEngine';
import type { useEntityStore } from '../../stores/entityStore';
import type { NewConnectionFlow, ConfirmedOrder } from './newConnectionModel';
import { idScanAttachments } from './idScanAttachments';
import { isB2B2COrder } from './approvalRouting';
import { addonChargeNowQar, type AddonBillingFrequency } from '../../engines/addonCategories';
import { isNumberWaiver } from '../../engines/numberWaiver';
import { approvalMessages, decisionRecord, needsCreditControl } from '../../engines/connectionEligibility';

type EntityStore = ReturnType<typeof useEntityStore.getState>;

/**
 * Everything that happens when a New Postpaid Activation is submitted: price the order, decide whether it
 * routes to approval (and why), write the order with its attachments, record the Completed activity (plus a
 * workflow event when routed for approval) and build what the Activity Final page shows.
 */
export async function submitNewConnectionOrder(
  values: Record<string, unknown>,
  { flow, createRecord, updateRecord }: { flow: NewConnectionFlow } & Pick<EntityStore, 'createRecord'> & Partial<Pick<EntityStore, 'updateRecord'>>
): Promise<ConfirmedOrder> {
      const contact = values.contact as GuidedContactValue;
      assertEligibilityChecked(values);
      const eligibility = values.eligibility as EligibilityResult | undefined;
      const simType = values.simType as SimTypeValue | undefined;
      const addonIds = (values.addonIds as string[] | undefined) ?? [];
      const addonBilling = (values.addonBilling as Record<string, AddonBillingFrequency> | undefined) ?? {};
      // numberDelta stays the number's raw sticker price (recorded on the
      // order for reference); dueTodayQar reuses Checkout's own figure,
      // which already applied BR-115's entitlement/overage - see the
      // Payment step's render just above for the fuller note.
      const numberDelta = (values.numberPriceQAR as number | undefined) ?? 0;
      const checkoutTotals = values.checkoutTotals as CheckoutTotals | undefined;
      const dueTodayQar = checkoutTotals?.dueTodayQar ?? 0;
      const products = await mockDataEngine.list<{ productId: string; name: string; mrcQAR: number }>('products');
      const plan = products.find((p) => p.productId === values.productId);
      const addons = products.filter((p) => addonIds.includes(p.productId));
      const discounts = await mockDataEngine.list<{ addonDiscountId: string; price?: number; addonType?: string }>('addons-discounts');
      const discount = discounts.find((d) => d.addonDiscountId === values.discountId);
      // The same itemisation the two display surfaces render, so what the
      // order records is by construction what the agent quoted. See
      // engines/postpaidPricing.ts.
      const charges = monthlyCharges({
        planQar: plan?.mrcQAR ?? 0,
        discountRate: discount?.price,
        addonsQar: addons.reduce((sum, a) => sum + addonChargeNowQar(a, addonBilling[a.productId]), 0),
      });
      const monthlyRecurringQar = charges.totalQar;
      // BR-268: HRN/credit-limit variant routes to manager approval rather
      // than auto-completing, same mechanism as the pre-existing B2B2C
      // approval routing (UJ-081). Extended 2026-09-28 to cover the
      // eligibility matrix's OWN approval-routing outcomes (under-18,
      // active-line cap exceeded, exception ID type) - reaching this point
      // with one of those set means the agent used "Proceed to Approval"
      // rather than Continue (see the Contact step's isValid), and the
      // order this submits has to carry that through to its final status,
      // not silently complete as if nothing had been diverted.
      // "For MADA/special offers, require proof-document upload before
      // finalisation; approval workflow remains pending" (2026-09-28) -
      // added as a fourth trigger alongside the three above. The agent
      // is NOT blocked from submitting without the ID/document (no
      // isValid gate was requested), but the order always lands in
      // Submitted for Approval when one of these discounts was chosen,
      // same as the other three approval-routing reasons - reusing
      // SUPPORTING_ID_DISCOUNT_TYPES rather than repeating the two
      // literal discount-type strings here.
      const customerType = values.customerType as CustomerTypeValue | undefined;
      const crossSales = values.crossSales as CrossSalesValue | undefined;
      // Manually entered identity (scan failed) always needs Store Manager approval.
      const manualIdEntry = Boolean(contact.manualEntry);
      const activeLinesCheck = eligibility?.checks.find((c) => c.id === 'active-lines');
      const lineLimitApproval = activeLinesCheck?.outcome === 'approval-routing';
      // The rule engine's decision, when it covered this customer: Credit Control approval routes the order to Credit Control, the other approvals
      // keep the order's usual approver. Without it (an ID type the engine has no rules for) the older line-limit routing stands.
      const lineDecision = eligibility?.connectionDecision;
      const creditControl = lineDecision ? needsCreditControl(lineDecision) : lineLimitApproval;
      const idTypeRouting = eligibility?.checks.some((c) => c.id === 'id-type-routing' && c.outcome === 'approval-routing') ?? false;
      const waiver = isNumberWaiver(values.numberWaiver) ? values.numberWaiver : undefined;
      const waivedAmountQar = checkoutTotals?.numberWaivedQar ?? 0;
      const waived = Boolean(waiver) && waivedAmountQar > 0;
      const pendingApproval =
        manualIdEntry ||
        isB2B2COrder(contact, customerType) ||
        Boolean(eligibility?.requiresHrnAdvance) ||
        Boolean(eligibility?.checks.some((c) => c.outcome === 'approval-routing')) ||
        // A Waive Off on the Star number's upfront charge is a concession: the order waits for approval.
        waived ||
        Boolean(discount && SUPPORTING_ID_DISCOUNT_TYPES.has(discount.addonType ?? ''));

      // Attachments (2026-09-28) - built from data this wizard already
      // collected but, until now, discarded at submission: the CAF
      // signature, any agent-defined Additional Documents, and the QID scans
      // from Contact. Each entry only appears when the fact it names is
      // actually true.
      const caf = values.caf as
        | { cafType?: CafType; signatureDataUrl?: string; additionalDocuments?: AdditionalDocument[] }
        | undefined;
      const attachments = [
        ...idScanAttachments(contact.idType, contact.qidScans, { idNumber: contact.idNumber }),
        ...(customerType?.officeId?.frontScanned && customerType.officeId.backScanned
          ? [
              {
                // Named for what it is for: only a B2B2C customer's is an office ID card.
                label: specialDiscountDocumentLabel(customerType.type),
                fileName: scanFileName(specialDiscountDocumentLabel(customerType.type), customerType.officeId.combined ? 'Both-Sides' : 'Front', customerType.officeId.frontFile, new Date(), contact.idNumber),
                detail: `${customerType.officeId.source === 'upload' ? 'Uploaded' : 'Scanned'} for ${customerType.type === 'b2b2c' ? 'B2B2C' : customerType.type === 'retired' ? 'Retired' : 'MADA'}`,
              },
            ]
          : []),
        ...(caf?.signatureDataUrl ? [{ label: 'Signed CAF', detail: `${caf.cafType ?? 'Digital'} signature`, previewUrl: caf.signatureDataUrl }] : []),
        ...(caf?.additionalDocuments ?? []).map((d) => ({ label: d.label, detail: d.fileName })),
      ];

      // Billing Profile (2026-09-28) - whichever of the two mutually
      // exclusive paths the agent took, recorded the same way `attachments`
      // above is: only the fact that applies, nothing invented for the
      // other branch.
      const billingAccount = values.billingAccount as BillingAccountValue | undefined;
      const newBillingAccount = billingAccount?.creatingNew ? billingAccount.newAccount : undefined;
      // A customer with no billing account gets the one the journey built, created and set as their default.
      const address = values.address as ConfirmedOrder['address'];
      const billingProfileId = await persistBillingAccount(billingAccount, {
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

      // The cycle of an existing billing account the order is billed on (a new one is read off what the agent entered).
      const billingProfile = billingAccount?.selectedProfileId
        ? (await mockDataEngine.list<{ billingProfileId: string; billingCycle?: string }>('billing-profiles')).find((b) => b.billingProfileId === billingAccount.selectedProfileId)
        : undefined;
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      // The salutation the agent entered is saved to the customer's profile (shown in Customer 360).
      await saveCustomerSalutation(eligibility?.customerId, contact.salutation, updateRecord);
      // A QID linked to an existing customer through their Passport is added to that customer's documents (no duplicate customer).
      await saveLinkedIdDocument(contact.moiResult?.linkedIdUpdate, createRecord);
      // An actual user who is already a customer keeps the contact details confirmed here on their own record.
      await saveActualUserContact(values.actualUser as ActualUserValue | undefined, updateRecord, () => mockDataEngine.list<{ contactRecordId: string; customerId: string }>('customer-contacts'));
      // Every trigger that routed the order is named, so the approver sees all the reasons; the workflow event carries the same text.
      const approvalReason = pendingApproval ? [
                lineLimitApproval ? (lineDecision ? `Line approval required - ${approvalMessages(lineDecision)}` : `Active postpaid line limit reached - ${activeLinesCheck?.message?.split('\nApproval Routing')[0]}`) : '',
                manualIdEntry ? 'Identity manually entered - Store Manager approval required' : '',
                idTypeRouting ? 'ID type requires Credit Control approval - routed to Credit Control' : '',
                eligibility?.checks.some((c) => c.id === 'id-validity' && c.outcome === 'approval-routing') ? 'ID expiry date not on file - routed for approval' : '',
                eligibility?.requiresHrnAdvance ? `HRN customer - ${formatQar(hrnAdvanceQar({ nationality: eligibility?.nationality, personaId: usePersonaStore.getState().activePersonaId }))} advance payment applies` : '',
                isB2B2COrder(contact, customerType) ? 'B2B2C employee - Proof of Employment to be verified' : '',
                waived && waiver ? `Waive Off - ${formatQar(waivedAmountQar)} waived off the Star number upfront charge of ${formatQar(checkoutTotals?.numberChargeQar ?? 0)}` : '',
                discount && SUPPORTING_ID_DISCOUNT_TYPES.has(discount.addonType ?? '') ? `${discount.addonType} - supporting document to be verified` : '',
              ].filter(Boolean).join(' | ') : undefined;
      await createRecord('orders', {
        orderId,
        ...actualUserOrderFields(values.actualUser as ActualUserValue | undefined),
        // The email captured on Customer Verification, carried unchanged.
        customerEmail: contact.email,
        customerSalutation: contact.salutation,
        ...contactIdentityOrderFields(contact),
        customerWorkEmail: contact.workEmail,
        // A new customer's National Address as the NAS returned it: kept with the order, unchanged; the address the customer gave is `address`.
        nationalAddress: contact.moiResult?.nationalAddress,
        orderType: 'New Postpaid Activation',
        ...decisionRecord(eligibility?.connectionDecision),
        createdAt: new Date().toISOString(),
        orderSubType: isB2B2COrder(contact, customerType)
          ? 'B2B2C'
          : customerType?.type === 'mada' && !customerType.rejected
          ? 'MADA'
          : customerType?.type === 'retired' && !customerType.rejected
          ? 'Retiree'
          : eligibility?.requiresHrnAdvance
          ? 'HRN'
          : 'Consumer',
        status: pendingApproval ? 'Submitted for Approval' : 'Complete',
        ...(pendingApproval
          ? {
              manualIdEntry: manualIdEntry || undefined,
              // Every trigger that routed the order is named, so the approver sees all the reasons (2026-10-10:
              // HRN, B2B2C, MADA / B2B2C discount and a missing ID expiry were routed but carried no reason).
              approvalReason,
              // Line-limit cases go to the Collection Team (Credit Control), a manual-entry order to the Store Manager, and an order
              // routed for its ID type to Credit Control as well.
              approverRole: creditControl ? COLLECTION_TEAM_ROLE : manualIdEntry ? STORE_MANAGER_ROLE : idTypeRouting ? COLLECTION_TEAM_ROLE : undefined,
            }
          : {}),
        customerName: contact.moiResult?.name,
        customerId: eligibility?.customerId,
        idNumber: contact.idNumber,
        // Identity evidence: what the scanned ID carried against what MOI returned, per attribute (absent when the journey took no scan).
        idReconciliation: contact.moiResult ? contact.idReconciliation : undefined,
        productId: values.productId,
        discountId: values.discountId,
        addonIds,
        addonBilling,
        msisdn: values.msisdn,
        numberPriceQAR: numberDelta,
        simType: simType?.simType,
        simSerial: simType?.simSerial,
        billingProfileId,
        // What the customer was quoted and agreed to: the spending limits, how the amount was taken, and where the line is installed.
        billLimitQAR: (values.billLimit as number | undefined) ?? (plan ? defaultBillLimitQar(plan.mrcQAR, effectiveCreditLimitQar(eligibility, billingAccount)) : undefined),
        creditLimitQAR: effectiveCreditLimitQar(eligibility, billingAccount),
        paymentMethod: (values.payment as WinCashPaymentValue | undefined)?.method,
        paymentReference: (values.payment as WinCashPaymentValue | undefined)?.reference,
        address: values.address,
        newBillingProfileName: newBillingAccount?.profileName,
        billCardLast4: newBillingAccount?.cardLast4,
        dueTodayQAR: dueTodayQar,
        // The Waive Off chosen on Number Selection and what it took off the Star number's upfront charge.
        ...(waived && waiver ? { numberWaiver: waiver, numberWaivedQAR: waivedAmountQar, numberUpfrontChargeQAR: checkoutTotals?.numberChargeQar } : {}),
        monthlyRecurringQAR: monthlyRecurringQar,
        createdBy: currentAgentId(),
        sourceChannel: 'Desktop',
        attachments,
        customerType: customerType?.type,
        companyName: customerType?.type === 'b2b2c' ? customerType.company?.companyName : undefined,
        // A Sales Offer only when an offer was accepted; a special customer type is a discount, not where the plan came from.
        planSource: crossSales?.decision === 'accepted' || values.selectionSource === 'OFFER' ? 'Sales Offer' : 'General Plan',
        crossSalesOfferId: crossSales?.decision === 'accepted' ? crossSales.offerId : undefined,
      });

      // Activities are created automatically (activityEngine): Completed, plus a workflow
      // event when the order is routed for approval.
      const journeyTitle = flow === 'existing' ? 'New Connection - Existing Customer' : 'New Connection - New Customer';
      const activityCtx = {
        journey: journeyTitle,
        orderId,
        customerId: eligibility?.customerId,
        customerName: contact.moiResult?.name,
        idNumber: contact.idNumber,
      };
      const payment = values.payment as WinCashPaymentValue | undefined;
      // The Completed activity is automatic and carries no comments; it is recorded when the agent hits Done & Exit
      // (ActivationCompleteScreen), under the number reserved here and shown on the confirmation page.
      const activityId = newActivityId();
      const completionActivity: ActivityInput = {
        ...activityCtx,
        activityNumber: activityId,
        trigger: 'completed',
        reason: pendingApproval
          ? `Order ${orderId} submitted and is awaiting approval.`
          : `Order ${orderId} submitted and activated${payment?.zeroValue ? ` (zero-value receipt ${payment.reference ?? ''})` : payment?.reference ? ` (WinCash ref ${payment.reference})` : payment?.method === 'Cash' ? ' (cash received by the agent)' : ''}.`,
      };
      if (pendingApproval) {
        await logActivity({
          ...activityCtx,
          trigger: 'workflow-event',
          name: 'Order Routed for Approval',
          reason: approvalReason || 'Order requires approval before it can complete.',
        });
      }

      // Verified per the SAME definition the Contact step's own tick uses
      // (emailVerification: does the account's contact email match the
      // MOI registry value), not merely "well-formed". This still gates
      // the ONLY email-sending action this screen has (eSIM details, via
      // EsimActivationPanel's `verified` prop) - it no longer also hides
      // the address itself (2026-09-28 "populate it only from existing
      // account contact emails"): the agent sees the real on-file email
      // and why sending is blocked, rather than a blank field.
      const emailVerified = emailVerification(contact.email, contact.moiResult?.email).verified;

      const confirmed: ConfirmedOrder = {
        orderId,
        activityId,
        completionActivity,
        pendingApproval,
        customerName: contact.moiResult?.name ?? '-',
        customerId: eligibility?.customerId,
        address: values.address as ConfirmedOrder['address'],
        msisdn: (values.msisdn as string) ?? '-',
        planName: plan?.name ?? '-',
        dueTodayQar,
        monthlyRecurringQar,
        simType: simType?.simType,
        activeAddons: addons.map((a) => a.name),
        billingCycle: newBillingAccount ? (newBillingAccount.billCycleDay ? `Monthly - Day ${newBillingAccount.billCycleDay}` : 'Monthly') : billingProfile?.billingCycle,
        esimActivationCode: simType?.esimActivationCode,
        customerEmail: contact.email,
        // Shown exactly as on Customer Verification: masked for a new customer (NAS email),
        // the Billing Profile / customer address for an existing one. The message itself is
        // addressed to the real address.
        customerEmailDisplay: contact.moiResult?.isNewCustomer && !contact.moiResult?.createdByAgent && contact.email ? maskEmail(contact.email) : contact.email,
        customerEmailVerified: emailVerified,
        terms: orderTerms(values, 'postpaid'),
      };

  return confirmed;
}

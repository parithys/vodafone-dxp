import { DEFAULT_SERVICE_OPTIONS } from '../../components/patterns/serviceOptions';
import type { ServiceOptions } from '../../components/patterns/serviceOptions';
import { currentAgentId } from '../../stores/authStore';
import { storedAddressLine } from '../../components/patterns/addressFromBilling';
import { accountTypeForJourney } from '../../engines/creditLimit';
import { scanFileName, specialDiscountDocumentLabel } from '../../engines/journeyDocuments';
import { saveLinkedIdDocument } from './saveLinkedIdDocument';
import { contactIdentityOrderFields } from './contactIdentityOrderFields';
import { saveCustomerSalutation } from './saveCustomerSalutation';
import { actualUserOrderFields, isOtherUser, minorExceptionHolds, saveActualUserContact } from '../../capabilities/ActualUser';
import type { ActualUserValue } from '../../capabilities/ActualUser';
import { hrnAdvanceQar } from '../../engines/hrnConfiguration';
import { usePersonaStore } from '../../stores/personaStore';
import { managerRoleOfSubmitter, postpaidManagerRoute } from '../../data/approvalRouting';
import { under18ApproverRole } from '../../data/under18Exception';
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
import { addonChargeNowQar, addonWithBillingChoice, type AddonBillingFrequency } from '../../engines/addonCategories';
import { appliedDiscountFor, discountedAddon, type AddonDiscount, type AppliedAddonDiscounts } from '../../engines/addonDiscounts';
import { isNumberWaiver } from '../../engines/numberWaiver';
import { assignMultiSimMsisdns, multiSimEntitlement } from '../../engines/multiSim';
import { multiSimsFor } from '../../capabilities';
import { approvalMessages, decisionRecord, needsCreditControl } from '../../engines/connectionEligibility';
import { packageBillingProfileId } from '../../engines/familyPackage';
import type { FamilyLine, FamilyOrder } from '../../engines/familyPackage';
import { familyStartFor } from './familyStart';
import { buildNewCustomerRecords, existingCustomerIdFor, isNewlyIdentifiedCustomer, newCustomerId } from './newCustomerRecords';

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
      const products = await mockDataEngine.list<{ productId: string; name: string; mrcQAR: number; multiSimCount?: number; planClass?: string }>('products');
      const plan = products.find((p) => p.productId === values.productId);
      const addons = products.filter((p) => addonIds.includes(p.productId));
      // A Family Plan makes this order Primary Line 1 of a new Family Package; a connection type chosen after that makes it a line of the existing package, on the
      // package's plan. Judged again here, on the lines and orders on record now: a stale draft, a package that changed meanwhile, or a type whose limit was
      // reached must not produce the line.
      const familyLinesNow = await mockDataEngine.list<FamilyLine>('family-package-lines');
      const familyOrdersNow = await mockDataEngine.list<FamilyOrder>('orders');
      const family = familyStartFor(values, products, familyLinesNow, familyOrdersNow);
      if (family.applies && !family.ok) throw new Error(family.reason);
      // The line this order is, as derived: nothing is submitted for a connection whose plan has not been selected.
      const familyDerived = family.applies && family.ok && family.additional && !family.additional.pending ? family.additional : undefined;
      if (family.applies && family.ok && family.additional?.pending) throw new Error('Select the plan for the connection added to the Family Package.');
      const familyLineTag = familyDerived ? `${familyDerived.role[0]}${familyDerived.sequence}` : 'P1';
      if (family.applies && family.ok && addonIds.length > 0) throw new Error("A Family Package's add-ons are managed from Customer 360, not on the order.");
      if (family.applies && family.ok && family.additional && (!family.planId || values.productId !== family.planId)) throw new Error('A connection added to a Family Package needs the plan selected for it.');
      // A customer first identified in this journey has no record, so a Family Package would have no Customer 360 to add its other connections from: the first
      // line of a Family Package creates it (customer, identity document, contact), before anything that belongs to the customer is written.
      const needsRecord = family.applies && family.ok && isNewlyIdentifiedCustomer(contact, eligibility);
      // The person may already have the record an earlier order created: that one is used, never a second record for the same ID.
      const knownCustomerId = needsRecord ? await existingCustomerIdFor(contact.idNumber) : undefined;
      const createdCustomerId = needsRecord && !knownCustomerId ? newCustomerId() : undefined;
      if (createdCustomerId) {
        const records = buildNewCustomerRecords(createdCustomerId, contact, eligibility);
        await createRecord('customers', records.customer);
        await createRecord('identity-documents', records.document);
        await createRecord('customer-contacts', records.contact);
      }
      const customerId = eligibility?.customerId ?? knownCustomerId ?? createdCustomerId;
      const discounts = await mockDataEngine.list<{ addonDiscountId: string; price?: number; addonType?: string }>('addons-discounts');
      const discount = discounts.find((d) => d.addonDiscountId === values.discountId);
      const addonDiscountRecords = await mockDataEngine.list<AddonDiscount>('addon-discounts');
      const addonDiscountsApplied = values.addonDiscounts as AppliedAddonDiscounts | undefined;
      // The same itemisation the two display surfaces render, so what the
      // order records is by construction what the agent quoted. See
      // engines/postpaidPricing.ts.
      const charges = monthlyCharges({
        // Primary Line 2 is included in the package the customer already pays for: its plan's rental is not charged again.
        planQar: family.applies && family.ok && family.additional && !family.additional.pending && family.additional.charge === 'Free' ? 0 : plan?.mrcQAR ?? 0,
        discountRate: discount?.price,
        // The add-ons as the agent quoted them: the chosen billing frequency, then the applied add-on discount (the same derivation as Checkout's).
        addonsQar: addons.reduce((sum, a) => sum + addonChargeNowQar(discountedAddon(addonWithBillingChoice(a, addonBilling[a.productId]), appliedDiscountFor(addonDiscountRecords, addonDiscountsApplied, a))), 0),
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
      // A postpaid Passport is approved by the submitting agent's manager (data/approvalRouting.ts); a persona with no manager route keeps Credit Control.
      const passportManagerRole = idTypeRouting && contact.idType === 'Passport' ? managerRoleOfSubmitter(usePersonaStore.getState().activePersonaId) : undefined;
      // A Secondary Contact under 18 was added through the Exception Request: the order is held for the same approver as an under-18 customer's.
      const minorContactException = minorExceptionHolds(values.actualUser as ActualUserValue | undefined);
      const waiver = isNumberWaiver(values.numberWaiver) ? values.numberWaiver : undefined;
      const waivedAmountQar = checkoutTotals?.numberWaivedQar ?? 0;
      const waived = Boolean(waiver) && waivedAmountQar > 0;
      const pendingApproval =
        manualIdEntry ||
        minorContactException ||
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
        // The Secondary Contact's own identity document, when they are someone other than the customer and it was scanned or uploaded.
        ...((v) => (isOtherUser(v) && v?.identity ? idScanAttachments(v.identity.idType, v.identity.qidScans, { idNumber: v.identity.idNumber }).map((a) => ({ ...a, label: `Secondary Contact: ${a.label}` })) : []))(values.actualUser as ActualUserValue | undefined),
        ...(minorContactException ? [{ label: (values.actualUser as ActualUserValue).exception!.document.label, detail: `${(values.actualUser as ActualUserValue).exception!.document.fileName} - Secondary Contact under 18` }] : []),
      ];

      // Billing Profile (2026-09-28) - whichever of the two mutually
      // exclusive paths the agent took, recorded the same way `attachments`
      // above is: only the fact that applies, nothing invented for the
      // other branch.
      const billingAccount = values.billingAccount as BillingAccountValue | undefined;
      // Every line of a Family Package is billed under the package's one billing account (Primary Line 1's): a line added to a package never picks or creates another.
      const packageBilling = family.applies && family.ok && family.additional ? packageBillingProfileId(familyLinesNow.filter((l) => l.packageId === family.additional!.packageId), familyOrdersNow) : undefined;
      const newBillingAccount = !packageBilling && billingAccount?.creatingNew ? billingAccount.newAccount : undefined;
      // A customer with no billing account gets the one the journey built, created and set as their default.
      const address = values.address as ConfirmedOrder['address'];
      const billingProfileId = packageBilling ?? await persistBillingAccount(billingAccount, {
        createRecord,
        updateRecord,
        kind: accountTypeForJourney('postpaid'),
        customerId,
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
      const billingProfile = (packageBilling ?? billingAccount?.selectedProfileId)
        ? (await mockDataEngine.list<{ billingProfileId: string; billingCycle?: string }>('billing-profiles')).find((b) => b.billingProfileId === (packageBilling ?? billingAccount?.selectedProfileId))
        : undefined;
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const familyPackageId = family.applies && family.ok && family.additional ? family.additional.packageId : `FPK-${orderId.replace('ORD-', '')}`;
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
                eligibility?.under18Exception ? `Under-18 exception - Court Type Order attached; ${under18ApproverRole(usePersonaStore.getState().activePersonaId)} approval required` : '',
                idTypeRouting ? (passportManagerRole ? `Passport requires ${passportManagerRole} approval - routed to ${passportManagerRole}` : 'ID type requires Credit Control approval - routed to Credit Control') : '',
                eligibility?.checks.some((c) => c.id === 'id-validity' && c.outcome === 'approval-routing') ? 'ID expiry date not on file - routed for approval' : '',
                eligibility?.requiresHrnAdvance ? `HRN customer - ${formatQar(hrnAdvanceQar({ nationality: eligibility?.nationality, personaId: usePersonaStore.getState().activePersonaId }))} advance payment applies` : '',
                minorContactException ? `Under-18 Secondary Contact exception - Court Order attached; ${under18ApproverRole(usePersonaStore.getState().activePersonaId)} approval required` : '',
                postpaidManagerRoute(usePersonaStore.getState().activePersonaId) ? `Routed to the ${postpaidManagerRoute(usePersonaStore.getState().activePersonaId)} (Manager/Approver): every Mobile Postpaid order raised by Retail Sales that needs approval is decided by them` : '',
                isB2B2COrder(contact, customerType) ? 'B2B2C employee - Proof of Employment to be verified' : '',
                waived && waiver ? `Waive Off - ${formatQar(waivedAmountQar)} waived off the Star number upfront charge of ${formatQar(checkoutTotals?.numberChargeQar ?? 0)}` : '',
                discount && SUPPORTING_ID_DISCOUNT_TYPES.has(discount.addonType ?? '') ? `${discount.addonType} - supporting document to be verified` : '',
              ].filter(Boolean).join(' | ') : undefined;
      // Multi-SIMs: how many the plan and add-ons provide (held to 4), each taking a Free-pool number automatically. Assigned BEFORE the order is
      // written so an order never exists with a Multi-SIM that has no number; the numbers are kept on the line records only, never shown to the agent.
      const multiSimCount = multiSimEntitlement(plan, addons).provisionable;
      const multiSimSlots = multiSimsFor(values, multiSimCount);
      const multiSimMsisdns =
        multiSimCount > 0
          ? assignMultiSimMsisdns(
              await mockDataEngine.list<{ msisdn: string; category?: string; status?: string }>('numbers'),
              new Set([String(values.msisdn ?? ''), ...(await mockDataEngine.list<{ secondaryMsisdn?: string }>('multi-sim-lines')).map((l) => l.secondaryMsisdn ?? '')]),
              multiSimCount
            )
          : [];
      const multiSimLineIds = multiSimSlots.map((_, i) => `MSIM-${orderId.replace('ORD-', '')}-${i + 1}`);
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
        // The Family Package this order starts (the package's line is written below). Family Package lines open on this order's approval status.
        ...(family.applies && family.ok ? { approvalStatus: pendingApproval ? 'Pending Approval' : 'Not Required', familyPackageId, familyLine: family.lineLabel } : {}),
        ...(pendingApproval
          ? {
              manualIdEntry: manualIdEntry || undefined,
              ...(eligibility?.under18Exception ? { under18Exception: true } : {}),
              // Every trigger that routed the order is named, so the approver sees all the reasons (2026-10-10:
              // HRN, B2B2C, MADA / B2B2C discount and a missing ID expiry were routed but carried no reason).
              approvalReason,
              // Line-limit cases go to the Collection Team (Credit Control), a manual-entry order to the Store Manager, and an order
              // routed for its ID type to Credit Control as well.
              // Every Mobile Postpaid order a Retail Sales agent raises that needs approval goes to their manager, whatever held it; other personas keep the reason's own route.
              approverRole: postpaidManagerRoute(usePersonaStore.getState().activePersonaId) ?? (creditControl ? COLLECTION_TEAM_ROLE : manualIdEntry ? STORE_MANAGER_ROLE : eligibility?.under18Exception || minorContactException ? under18ApproverRole(usePersonaStore.getState().activePersonaId) : idTypeRouting ? passportManagerRole ?? COLLECTION_TEAM_ROLE : undefined),
            }
          : {}),
        customerName: contact.moiResult?.name,
        customerId,
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
        ...(multiSimCount > 0 ? { multiSimLineIds } : {}),
        billingProfileId,
        // What the customer was quoted and agreed to: the spending limits, how the amount was taken, and where the line is installed.
        billLimitQAR: (values.billLimit as number | undefined) ?? (plan ? defaultBillLimitQar(plan.mrcQAR, effectiveCreditLimitQar(eligibility, billingAccount)) : undefined),
        creditLimitQAR: effectiveCreditLimitQar(eligibility, billingAccount),
        serviceOptions: (values.serviceOptions as ServiceOptions | undefined) ?? DEFAULT_SERVICE_OPTIONS,
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
      // The Family Package line: Primary Line 1 of a new package on the plan the agent selected, or the line added to the existing package on its plan, tied to this order and to the line's number. The customer's
      // record when they have one (a customer first identified in this journey is named by the ID they were identified with).
      if (family.applies && family.ok) {
        await createRecord('family-package-lines', {
          lineId: `FPL-${orderId.replace('ORD-', '')}-${familyLineTag}`,
          packageId: familyPackageId,
          customerId,
          idNumber: contact.idNumber,
          role: familyDerived?.role ?? 'Primary',
          sequence: familyDerived?.sequence ?? 1,
          // What the line is, as derived from the package's state and the plan selected (the engine's classification, kept so it is never re-guessed).
          lineType: familyDerived?.type ?? 'PRIMARY_LINE_1',
          charge: familyDerived?.charge ?? 'Paid',
          planId: family.planId,
          ...(family.additional?.tierPlanId ? { tierPlanId: family.additional.tierPlanId } : {}),
          orderId,
          msisdn: values.msisdn,
        });
      }
      // One line per Multi-SIM, joined to the primary line. No customerId and no reservation: a Multi-SIM line is not in the customer's Active Line
      // Count (listCustomerServices reads no Multi-SIM line) and its number is not a Reserved number. Its monthly fee is the plan's to set, so none is written.
      for (const [i, sim] of multiSimSlots.entries()) {
        await createRecord('multi-sim-lines', {
          id: multiSimLineIds[i],
          primaryMsisdn: values.msisdn,
          secondaryMsisdn: multiSimMsisdns[i],
          accountId: billingProfileId,
          lineType: 'Multi-SIM',
          planName: plan?.name,
          sequenceNumber: i + 1,
          simType: sim.simType,
          simSerial: sim.simSerial,
          simIccid: sim.simIccid,
          orderId,
          status: pendingApproval ? 'Submitted for Approval' : 'Active',
        });
      }

      // Activities are created automatically (activityEngine): Completed, plus a workflow
      // event when the order is routed for approval.
      const journeyTitle = flow === 'existing' ? 'New Connection - Existing Customer' : 'New Connection - New Customer';
      const activityCtx = {
        journey: journeyTitle,
        orderId,
        customerId,
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
        customerId,
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
        ...(family.applies && family.ok ? { familyPackage: { packageId: familyPackageId, lineLabel: family.lineLabel, planName: plan?.name ?? '-' } } : {}),
      };

  return confirmed;
}

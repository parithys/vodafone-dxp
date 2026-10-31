import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import * as sums from '../../components/patterns/wizard/commonSummaries';
import { attachSummaries } from '../../components/patterns/wizard/stepSummary';
import {
  addonsSelectionStep,
  cafSignatureStep,
  checkoutSummaryStep,
  customerQualificationStep,
  lineSelectionStep,
  paymentStep,
  planSelectionStep,
  postpaidExtrasStep,
  postpaidPlanStep,
  prepaidExtrasStep,
  prepaidCheckoutStep,
} from '../../capabilities';
import type { CustomerLine, PrepaidCheckoutTotals, QualificationContext } from '../../capabilities';
import type { PrepaidLine } from '../../components/patterns/prepaidCartModel';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { CustomerBenefit } from '../../engines/customerBenefitEngine';
import type { Product } from '../new-connection/newConnectionModel';

/** What the line-change journeys need from their journey: the identification context, the plan catalogue and the customer's benefits. */
export interface ServiceChangeContext extends QualificationContext {
  products: Product[];
  customerBenefits: CustomerBenefit[] | undefined;
}

type Values = Record<string, unknown>;
const lineOf = (values: Values) => values.line as CustomerLine | undefined;
const contactOf = (values: Values) => values.contact as GuidedContactValue | undefined;
const nameOf = (values: Values) => contactOf(values)?.moiResult?.name;
const segmentOf = (values: Values) => (values.eligibility as EligibilityResult | undefined)?.segment;

/** Choosing another line drops whatever was chosen for the previous one. */
export function resetChoices(setValue: (field: string, value: unknown) => void) {
  setValue('productId', undefined);
  setValue('discountId', undefined);
  setValue('addonIds', []);
}

/** The line's own billing profile, so the order bills where the line already does. */
export const billingOf = (line: CustomerLine | undefined) => (line?.billingProfileId ? { selectedProfileId: line.billingProfileId } : undefined);

/** Change Postpaid Plan: a new line drops the previous choices and the order bills where the line already does. */
export function selectLineForPlanChange(line: CustomerLine | undefined, setValue: (field: string, value: unknown) => void) {
  resetChoices(setValue);
  setValue('billingAccount', billingOf(line));
}

/** Add Add-On: the line's own plan is what the add-ons attach to, and Checkout reads it as the order's plan. */
export function selectLineForAddon(line: CustomerLine | undefined, setValue: (field: string, value: unknown) => void) {
  setValue('addonIds', []);
  setValue('productId', line?.productId);
  setValue('billingAccount', billingOf(line));
}

/** The one prepaid line the order changes: its pack (the new one, or the current one for an add-on), discount and add-ons. */
const prepaidLineOf = (values: Values): PrepaidLine[] => {
  const line = lineOf(values);
  const productId = values.productId as string | undefined;
  if (!line || !productId) return [];
  return [
    {
      productId,
      discountId: values.discountId as string | undefined,
      addonIds: (values.addonIds as string[] | undefined) ?? [],
      prePaired: false,
      msisdn: line.identifier,
      numberPriceQAR: 0,
      simType: { simType: 'Physical', simValid: true },
    },
  ];
};
const prepaidDue = (values: Values) => (values.checkoutTotals as PrepaidCheckoutTotals | undefined)?.totalDueQar ?? 0;

/**
 * Change Postpaid Plan: Customer Verification (eligibility, special discounts), the line to change, Offers & Plans (without the line's
 * current plan), Add-ons, Checkout, the full CAF & Signature and Payment (nothing is due today, so a zero-value receipt). The same
 * shared steps as New Mobile Postpaid, without Address, Number or SIM: the line already has them.
 */
export function changePostpaidPlanSteps(ctx: ServiceChangeContext): WizardStep[] {
  const planContext = { products: ctx.products, customerBenefits: ctx.customerBenefits, hiddenProductId: (values: Values) => lineOf(values)?.productId, announceHrn: true };
  return [
    // A plan change adds no line, so the postpaid line limit does not apply.
    customerQualificationStep({ ...ctx, productAgnostic: true, knownCustomer: true, skipLineLimit: true }),
    lineSelectionStep({ lineType: 'postpaid', onSelect: selectLineForPlanChange }),
    postpaidPlanStep(planContext),
    postpaidExtrasStep(planContext),
    checkoutSummaryStep({ msisdn: (values) => lineOf(values)?.identifier, editStepKey: () => 'plan' }),
    cafSignatureStep({ variant: 'full', customerName: nameOf }),
    paymentStep({ zeroValueReceipt: true, submitOnPaid: true }),
  ];
}

/**
 * Change Prepaid Pack: Customer Verification, the prepaid line, the new pack (without the current one) with its discount, its add-ons,
 * the prepaid Checkout (the pack, discount and add-ons; no SIM or SIM card charge, the SIM is the customer's) and Payment of what is due.
 */
export function changePrepaidPackSteps(ctx: ServiceChangeContext): WizardStep[] {
  return attachSummaries(
    [
      // Changing the pack of a line the customer has adds no line, so the line limit does not apply.
      customerQualificationStep({ ...ctx, journeyType: 'prepaid', productAgnostic: true, knownCustomer: true, skipLineLimit: true }),
      lineSelectionStep({ lineType: 'prepaid', onSelect: (_line, setValue) => resetChoices(setValue) }),
      planSelectionStep({ kind: 'prepaid', segment: segmentOf, hiddenProductId: (values) => lineOf(values)?.productId, packsOnly: true }),
      prepaidExtrasStep({ segment: segmentOf }),
      prepaidCheckoutStep({
        idType: (values) => contactOf(values)?.idType,
        customerName: nameOf,
        lines: prepaidLineOf,
        existingLine: { existingSim: true },
        editStepKey: 'plan',
        editLabel: 'Edit pack',
        isValid: (values) => Boolean(lineOf(values) && values.productId),
      }),
      paymentStep({ zeroValueReceipt: true, submitOnPaid: true, amountDue: prepaidDue }),
    ],
    { plan: sums.planSummary(), planExtras: sums.prepaidExtrasSummary, payment: sums.paymentSummary }
  );
}

/**
 * Add Add-On, on a postpaid or a prepaid line: Customer Verification, the line, the add-ons its plan can take, Checkout and Payment. The
 * postpaid Checkout is the shared Checkout Summary (the line's plan with the add-ons priced into the monthly charge); the prepaid one is the
 * prepaid Checkout with the pack as it is (only the add-ons are charged). Each is skipped for the other line type.
 */
export function addAddonSteps(ctx: ServiceChangeContext): WizardStep[] {
  const prepaid = (values: Values) => lineOf(values)?.lineType === 'prepaid';
  const onlyPostpaid = (step: WizardStep): WizardStep => ({ ...step, skip: prepaid });
  const onlyPrepaid = (step: WizardStep): WizardStep => ({ ...step, skip: (values) => !prepaid(values) });
  return attachSummaries(
    [
      // An add-on adds no line, so the postpaid line limit does not apply.
      customerQualificationStep({ ...ctx, productAgnostic: true, knownCustomer: true, skipLineLimit: true }),
      lineSelectionStep({ requirePlan: true, onSelect: selectLineForAddon }),
      addonsSelectionStep({ planId: (values) => lineOf(values)?.productId, source: (values) => (prepaid(values) ? 'prepaid' : 'catalogue') }),
      onlyPostpaid(checkoutSummaryStep({ msisdn: (values) => lineOf(values)?.identifier, editStepKey: () => 'addons' })),
      onlyPrepaid(
        prepaidCheckoutStep({
          idType: (values) => contactOf(values)?.idType,
          customerName: nameOf,
          lines: prepaidLineOf,
          existingLine: { existingSim: true, excludePack: true },
          editStepKey: 'addons',
          editLabel: 'Edit add-ons',
          isValid: (values) => Boolean(lineOf(values) && ((values.addonIds as string[] | undefined) ?? []).length > 0),
        })
      ),
      paymentStep({
        zeroValueReceipt: true,
        submitOnPaid: true,
        amountDue: (values) => (prepaid(values) ? prepaidDue(values) : ((values.checkoutTotals as { dueTodayQar?: number } | undefined)?.dueTodayQar ?? 0)),
      }),
    ],
    { payment: sums.paymentSummary }
  );
}

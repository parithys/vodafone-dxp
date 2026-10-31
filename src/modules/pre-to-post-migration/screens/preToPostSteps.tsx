import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import {
  billingAccountStep,
  cafSignatureStep,
  checkoutSummaryStep,
  customerQualificationStep,
  lineSelectionStep,
  paymentStep,
  postpaidExtrasStep,
  postpaidPlanStep,
} from '../../../capabilities';
import type { QualificationContext } from '../../../capabilities';
import type { PostpaidStepContext } from '../../new-connection/postpaidSteps';
import { resetChoices } from '../../mobile-service-changes/serviceChangeSteps';

/**
 * Prepaid to Postpaid Conversion, on the same shared steps as New Mobile Postpaid: Customer Verification (the
 * eligibility checks and the customer lock), the customer's prepaid line (Line Selection), Billing Profile, Offers & Plans, Add-ons, Checkout, the full
 * CAF & Signature, and Payment, which submits. The line already exists, so there is no address, number or SIM step.
 */
export function preToPostSteps(
  ctx: QualificationContext & Pick<PostpaidStepContext, 'products' | 'customerBenefits'>
): WizardStep[] {
  const planContext = { products: ctx.products, customerBenefits: ctx.customerBenefits };
  return [
    customerQualificationStep({ ...ctx, knownCustomer: true, requestKind: 'PREPAID_TO_POSTPAID_MIGRATION' }),
    // The customer's own prepaid lines, as the line-change journeys offer them - not a typed number nobody checked belongs to them. Checkout and the CAF read
    // the line's identifier as the order's number (`msisdn`).
    lineSelectionStep({
      lineType: 'prepaid',
      onSelect: (line, setValue) => {
        resetChoices(setValue);
        setValue('msisdn', line?.identifier);
      },
    }),
    billingAccountStep(),
    postpaidPlanStep(planContext),
    postpaidExtrasStep(planContext),
    checkoutSummaryStep(),
    cafSignatureStep({ variant: 'full' }),
    paymentStep({ zeroValueReceipt: true, submitOnPaid: true }),
  ];
}

import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { CrossSalesValue } from '../../capabilities';
import type { CustomerBenefit } from '../../engines/customerBenefitEngine';
import {
  billingAccountStep,
  cafSignatureStep,
  checkoutSummaryStep,
  numberSelectionStep,
  paymentStep,
  postpaidExtrasStep,
  postpaidPlanStep,
  serviceAddressStep,
  simTypeStep,
  isSpecialDiscountsValid,
} from '../../capabilities';
import type { SpecialDiscountsValue } from '../../capabilities';
import { starEntitlementQar } from '../../engines/postpaidPricing';
import type { Product } from './newConnectionModel';
import { expectsApproval } from './approvalRouting';
import { isOffersTabPlan } from '../../components/patterns/postpaidPlanModel';
import type { DeviceType } from '../../lib/deviceType';
import { addonReviewStep } from './steps/AddonReviewStep';

/** What the postpaid steps need from the journey: the plan catalogue and the customer's benefits. */
export interface PostpaidStepContext {
  products: Product[];
  customerBenefits: CustomerBenefit[] | undefined;
  /** The device in use: makes the SIM serial scan-led on a tablet and type-led on the web (as the prepaid journey does). */
  device?: DeviceType;
}

// An accepted offer already fixes the plan, so the agent goes straight from the product step to Number Selection; with no
// accepted offer the full path runs.
const offerAccepted = (values: Record<string, unknown>) => (values.crossSales as CrossSalesValue | undefined)?.decision === 'accepted';

/** The customer holds a Special Discount that was validated at Customer Verification (Consumer B2B2C, Retiree or MADA, evidence accepted). */
export const hasValidatedSpecialDiscount = (values: Record<string, unknown>): boolean => {
  const t = values.customerType as SpecialDiscountsValue | undefined;
  return Boolean(t && t.type && t.type !== 'none' && !t.rejected && isSpecialDiscountsValid(t));
};

/** The Addons & Discounts step is skipped for an accepted offer and for a plan chosen on the Offers tab of Offers & Plans: the agent goes on to Number Selection. A plan chosen under Special Offers keeps the step (2026-10-27). */
const extrasSkip = (products: Product[]) => (values: Record<string, unknown>) =>
  offerAccepted(values) ||
  values.selectionSource === 'OFFER' ||
  Boolean(products.find((p) => p.productId === values.productId && isOffersTabPlan(p)));

/**
 * The New Postpaid steps, after Customer Verification and Product Selection: Address, Billing Profile (resolved for the
 * agent), Plan and Add-ons, Number, SIM, Checkout, the full CAF and Payment, which submits.
 */
export function postpaidSteps({ products, customerBenefits, device }: PostpaidStepContext): WizardStep[] {
  const planContext = { products, customerBenefits, skipWhen: offerAccepted, announceHrn: true };
  return [
    serviceAddressStep({ mode: 'structured', autoPass: true, serviceIds: false }),
    billingAccountStep(),
    postpaidPlanStep(planContext),
    postpaidExtrasStep({ ...planContext, skipWhen: extrasSkip(products) }),
    numberSelectionStep({
      priceField: 'numberPriceQAR',
      // Refresh sits at the right of the title row and reloads the number inventory on every tab.
      refresh: true,
      waiveOff: true,
      plan: (values) => {
        const plan = products.find((p) => p.productId === values.productId);
        return plan ? { mrcQar: plan.mrcQAR, starEntitlementQar: starEntitlementQar(plan) } : undefined;
      },
    }),
    // Who will use the line (when it is not the owner) is added on this same page, from "Add Actual User": it is named on the Supplementary Form.
    simTypeStep({ device, approvalRequired: expectsApproval, withActualUser: true }),
    addonReviewStep(products, (values) => !extrasSkip(products)(values)),
    checkoutSummaryStep({
      // An accepted offer fixes the plan, so the Plan & Add-ons step is skipped and 'plan' is not a reachable
      // key - jump to Number Selection (the first step still editable) instead of doing nothing.
      editStepKey: (values) => (offerAccepted(values) ? 'number' : 'plan'),
    }),
    cafSignatureStep({ variant: 'full' }),
    // "On successful WinCash confirmation, return to DXP, submit the order, and create the interaction activity"
    // (2026-09-28): Payment is the last step, so Continue here would only ever mean "submit".
    paymentStep({ zeroValueReceipt: true, submitOnPaid: true }),
  ];
}

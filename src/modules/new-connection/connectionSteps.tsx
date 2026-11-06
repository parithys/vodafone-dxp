import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { billingStep, customerQualificationStep, serviceAddressStep } from '../../capabilities';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { QualificationContext } from '../../capabilities';
import type { DeviceType } from '../../lib/deviceType';
import { mnpSteps } from '../mnp-fnp-porting/screens/mnpSteps';
import { fixedLineSteps } from '../fixed-line-fibre/fixedActivation/fixedSteps';
import { prepaidSteps } from '../mobile-prepaid/screens/prepaidSteps';
import { postpaidSteps } from './postpaidSteps';
import type { PostpaidStepContext } from './postpaidSteps';
import { billingStepActive, forProduct } from './products';
import { packageBillingProfileId } from '../../engines/familyPackage';
import { FamilyBillingApplier } from '../../components/patterns/FamilyPackageNotice';
import { familyLineContextOf } from './familyStart';
import type { BillingAccountValue } from '../../components/patterns/billingAccountModel';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';

/** Step keys New Connection collects once, before Recommended Offers. */
const SHARED_KEYS = ['address', 'billingAccount'];
import { productCardsStep, productStep } from './steps/productStep';
import { IdTypeApprovalNotice } from './steps/IdTypeApprovalNotice';
import { homeKindStep } from './steps/HomeKindStep';
import type { ProductStepContext } from './steps/ProductSelection';

/**
 * Lets the page after a Recommended Offer carry the ID type's approval notice (see IdTypeApprovalNotice): every product step can be that page, and only the first to
 * render shows it.
 */
const withIdTypeNotice = (steps: WizardStep[]): WizardStep[] =>
  steps.map((s) => ({
    ...s,
    render: (c) => (
      <>
        <IdTypeApprovalNotice stepKey={s.key} values={c.values} setValue={c.setValue} />
        {s.render(c)}
      </>
    ),
  }));

/** Everything the steps of a New Connection journey need from it (`journey`: New Connection or New Home Connection). */
export interface ConnectionStepContext extends QualificationContext, ProductStepContext, PostpaidStepContext {
  device: DeviceType;
}

/**
 * The steps of New Connection, all of them in one list: Customer Verification (once, for every product), Product
 * Selection, then each product's own steps. A product's steps are active only while it is the chosen product, so the agent
 * sees one continuous journey and the draft, the customer lock and the title never change.
 */
export function buildConnectionSteps(ctx: ConnectionStepContext): WizardStep[] {
  // New Home Connection is the same journey with only the home products: Identification, Product Selection (Fibre, Fixed-Line,
  // FWA, 5G Home), then the home steps.
  if (ctx.journey === 'home') {
    return [customerQualificationStep({ ...ctx, productAgnostic: true, journeyChosenLater: true }), productStep(ctx), ...forProduct('fixed-line', withIdTypeNotice(fixedLineSteps()))];
  }
  // The Address and the Billing Profile are collected once, after Customer Verification and BEFORE Recommended Offers, for every product:
  // each product's own list drops its copy (a product that has no billing profile skips the shared one, see otherBilling below).
  const shared = (steps: WizardStep[]) => steps.filter((s) => !SHARED_KEYS.includes(s.key));
  // Fixed Line keeps its Installation Address: it needs the connection type chosen after this point, and has its own mandatory fields.
  const installation = fixedLineSteps().filter((s) => s.key !== 'billingAccount').map((s) => (s.key === 'address' ? { ...s, key: 'installation' } : s));
  const billingJourney = (values: Record<string, unknown>): 'fixed-line' | 'postpaid' => (values.product === 'fixed-line' ? 'fixed-line' : 'postpaid');
  // New Postpaid takes its Billing right after SIM Selection (before the Order Summary), so the early copy is out of the way while the product is
  // undecided or Postpaid; every other product keeps Billing where it was, after Address.
  const otherBilling: WizardStep = { ...billingStep({ journey: billingJourney }), skip: (values) => !billingStepActive(values) || values.product === undefined || values.product === 'postpaid' };
  // A line added to a Family Package is billed under the package's one billing account: it is the selection, and the step holds it.
  const familyBilling = (values: Record<string, unknown>): string | undefined => {
    const context = familyLineContextOf(values);
    return context ? packageBillingProfileId(ctx.familyLines.filter((l) => l.packageId === context.packageId), ctx.familyOrders) : undefined;
  };
  const baseBilling = billingStep({ journey: () => 'postpaid' });
  const postpaidBilling: WizardStep = {
    ...baseBilling,
    skip: (values) => values.product !== 'postpaid',
    headless: (c) => (
      <>
        {baseBilling.headless?.(c)}
        <FamilyBillingApplier
          target={familyBilling(c.values)}
          selectedProfileId={(c.values.billingAccount as BillingAccountValue | undefined)?.selectedProfileId}
          resolvedFor={(c.values.eligibility as EligibilityResult | undefined)?.customerId ?? 'new'}
          setValue={c.setValue}
        />
      </>
    ),
    isValid: (values) => {
      const target = familyBilling(values);
      return (baseBilling.isValid?.(values) ?? true) && (!target || (values.billingAccount as BillingAccountValue | undefined)?.selectedProfileId === target);
    },
  };
  const postpaid = shared(postpaidSteps(ctx));
  const billingIndex = postpaid.findIndex((s) => s.key === 'checkout');
  const postpaidInOrder = billingIndex === -1 ? postpaid : [...postpaid.slice(0, billingIndex), postpaidBilling, ...postpaid.slice(billingIndex)];
  return [
    // Identification is the same for every product: scan, MOI, the eligibility checks common to all, special discounts.
    customerQualificationStep({ ...ctx, productAgnostic: true, journeyChosenLater: true }),
    serviceAddressStep({
      mode: 'structured',
      autoPass: true,
      // Every product this page serves is a mobile line (Fixed Line has its own Installation Address): no serviceable premises, so no Kahramaa / Vodafone ID.
      serviceIds: false,
      billing: billingStepActive,
      // Continue passes over this step: the address is filled from the billing profile (or "-" when there is none) and stays editable from the rail. It is
      // never the NAS National Address, which is kept apart, unchanged, and not shown to the agent.
      identity: (values) => {
        const contact = values.contact as GuidedContactValue | undefined;
        return contact?.moiResult?.isNewCustomer ? undefined : { idNumber: contact?.idNumber, nationality: contact?.moiResult?.nationality };
      },
    }),
    otherBilling,
    productStep(ctx),
    productCardsStep(ctx),
    ...forProduct('postpaid', withIdTypeNotice(postpaidInOrder)),
    ...forProduct('prepaid', withIdTypeNotice(shared(prepaidSteps(ctx)))),
    ...forProduct('fixed-line', withIdTypeNotice([homeKindStep(ctx), ...installation])),
    ...forProduct('mnp', withIdTypeNotice(shared(mnpSteps(ctx)))),
  ];
}

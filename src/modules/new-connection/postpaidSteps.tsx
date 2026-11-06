import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { CrossSalesValue } from '../../capabilities';
import type { CustomerBenefit } from '../../engines/customerBenefitEngine';
import {
  billingStep,
  cafSignatureStep,
  checkoutSummaryStep,
  numberSelectionStep,
  paymentStep,
  postpaidAddonsStep,
  postpaidPlanStep,
  serviceAddressStep,
  simTypeStep,
  isSpecialDiscountsValid,
  AdditionalPlanPicker,
} from '../../capabilities';
import type { SpecialDiscountsValue } from '../../capabilities';
import { starEntitlementQar } from '../../engines/postpaidPricing';
import { multiSimEntitlement } from '../../engines/multiSim';
import type { Product } from './newConnectionModel';
import { expectsApproval } from './approvalRouting';
import { isOffersTabPlan } from '../../components/patterns/postpaidPlanModel';
import type { DeviceType } from '../../lib/deviceType';
import type { FamilyLine, FamilyOrder } from '../../engines/familyPackage';
import { FamilyPackageNotice } from '../../components/patterns/FamilyPackageNotice';
import { familyLineContextOf, familyStartFor } from './familyStart';
import { FamilyPlanApplier } from '../../components/patterns/FamilyPackageNotice';
import type { PostpaidPlan } from '../../components/patterns/postpaidPlanModel';
import { linesOfCustomer } from '../../engines/familyPackage';
import { FamilyPackageActiveGate } from './FamilyPackageActiveGate';

/** What the postpaid steps need from the journey: the plan catalogue and the customer's benefits. */
export interface PostpaidStepContext {
  products: Product[];
  customerBenefits: CustomerBenefit[] | undefined;
  /** Every Family Package line on record: a Family Plan starts a package only for a customer who holds none. */
  familyLines: FamilyLine[];
  /** The orders of those lines (a package opens to further connections once Primary Line 1's order is approved). */
  familyOrders: FamilyOrder[];
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

/** The Multi-SIMs the order provisions: the selected plan's `multiSimCount` plus that of each selected add-on, held between 0 and 4. */
export const multiSimCountFor = (products: Product[]) => (values: Record<string, unknown>): number => {
  const addonIds = (values.addonIds as string[] | undefined) ?? [];
  return multiSimEntitlement(
    products.find((p) => p.productId === values.productId),
    products.filter((p) => addonIds.includes(p.productId))
  ).provisionable;
};

/**
 * The New Postpaid steps, after Customer Verification and Product Selection: Address, Billing Profile (resolved for the
 * agent), Plan and Add-ons, Number, SIM, Checkout, the full CAF and Payment, which submits.
 */
export function postpaidSteps({ products, customerBenefits, device, familyLines = [], familyOrders = [] }: PostpaidStepContext): WizardStep[] {
  const family = (values: Record<string, unknown>) => familyStartFor(values, products, familyLines, familyOrders);
  const planName = (values: Record<string, unknown>, id?: string) => products.find((p) => p.productId === (id ?? values.productId))?.name;
  const planContext = {
    products,
    customerBenefits,
    // An accepted offer fixes the plan, so the plan page is passed over - except for a Family Plan, whose page says it starts a Family Package (Primary Line 1) and holds the order if it cannot.
    skipWhen: (values: Record<string, unknown>) => offerAccepted(values) && !family(values).applies,
    announceHrn: true,
    // A Family Package's add-ons are managed from Customer 360 (engines/familyPackageAddons.ts): its journeys have no Add-ons step.
    addonsHidden: (values: Record<string, unknown>) => family(values).applies,
    notice: (values: Record<string, unknown>) => <FamilyPackageNotice check={family(values)} planName={planName(values)} />,
    // A line added to a package also needs its plan (a Secondary line's is chosen on this page).
    canContinue: (values: Record<string, unknown>) => {
      const c = family(values);
      return !c.applies || (c.ok && (!c.additional || Boolean(c.planId)));
    },
  };
  const planBase = postpaidPlanStep(planContext);
  // A connection added to an existing package is on the package's plan and cannot choose another: the plan page is passed over once the check is clear
  // (and shows why, with no way on, when it is not); the plan itself is put in the order by the headless applier, from the package.
  const planStep: WizardStep = {
    ...planBase,
    // Passed over once the check is clear and the plan is settled by the package; a Secondary line stops here for the agent to choose its plan.
    autoPass: (values) => {
      const c = family(values);
      return Boolean(familyLineContextOf(values)) && c.applies && c.ok && Boolean(c.planId);
    },
    // Arriving here anyway (the page can be the one a journey opens on, with nothing before it to pass over it) moves straight on to Number Selection: there is nothing to choose.
    autoAdvanceWhen: (values) => {
      const c = family(values);
      return Boolean(familyLineContextOf(values)) && c.applies && c.ok && Boolean(c.planId);
    },
    headless: ({ values, setValue }) => <FamilyPlanApplier check={family(values)} productId={values.productId as string | undefined} additionalContext={Boolean(familyLineContextOf(values))} setValue={setValue} />,
    render: (c) => {
      if (!familyLineContextOf(c.values)) {
        // A Family Plan for a customer who already has a package: show that package and carry on by adding a connection to it.
        const held = family(c.values);
        const owner = held.applies && !held.ok && held.kind === 'package' ? linesOfCustomer(familyLines, { customerId: (c.values.eligibility as { customerId?: string } | undefined)?.customerId, idNumber: (c.values.contact as { idNumber?: string } | undefined)?.idNumber })[0] : undefined;
        return (
          <>
            {/* A package with no customer record to open (nothing for the dialog to read) is explained in place. */}
            {owner && !owner.customerId && held.applies && !held.ok && (
              <p role="alert" className="notice-danger pad-row mb-6">
                {held.reason}
              </p>
            )}
            {owner?.customerId && (
              <FamilyPackageActiveGate
                customerId={owner.customerId}
                onAdd={(familyLine) => {
                  c.setValue('familyLine', familyLine);
                  c.setValue('productId', undefined);
                }}
              />
            )}
            {planBase.render(c)}
          </>
        );
      }
      const k = family(c.values);
      return (
        <>
          <FamilyPackageNotice check={k} planName={k.applies && k.ok && k.planId ? planName(c.values, k.planId) : undefined} />
          {/* What stops a connection being added to this package (its Primary Lines not both active, a plan that is no longer eligible, the wrong ID) is said here, on this page. */}
          {k.applies && !k.ok && (
            <p role="alert" className="notice-danger pad-row mb-6">
              {k.reason}
            </p>
          )}
          {k.applies && k.ok && k.additional?.pending && (
            <AdditionalPlanPicker
              plans={k.additional.eligiblePlans.flatMap((e) => products.filter((p) => p.productId === e.planId)) as unknown as PostpaidPlan[]}
              selectedProductId={c.values.productId as string | undefined}
              onSelect={(id) => c.setValue('productId', id)}
              onDeselect={() => c.setValue('productId', undefined)}
            />
          )}
        </>
      );
    },
  };
  return [
    serviceAddressStep({ mode: 'structured', autoPass: true, serviceIds: false }),
    billingStep(),
    planStep,
    postpaidAddonsStep({ ...planContext, skipWhen: extrasSkip(products), applyDiscounts: true }),
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
    // Multi-SIMs come from the plan's and the selected add-ons' own `multiSimCount` (held to 4): a Multi-SIM Selection section follows the primary SIM.
    simTypeStep({ device, approvalRequired: expectsApproval, withActualUser: true, multiSimCount: multiSimCountFor(products) }),
    checkoutSummaryStep({
      // An accepted offer fixes the plan, so the Plan & Add-ons step is skipped and 'plan' is not a reachable
      // key - jump to Number Selection (the first step still editable) instead of doing nothing.
      editStepKey: (values) => (offerAccepted(values) && !family(values).applies ? 'number' : 'plan'),
      // Primary Line 2 is included in the package the customer already pays for: its plan rental is not charged again (an additional line is charged at its own plan).
      planRentalIncluded: (values) => {
        const c = family(values);
        return c.applies && c.ok && Boolean(c.additional) && !c.additional?.pending && c.additional?.type === 'PRIMARY_LINE_2';
      },
      // The Order Summary and the CAF say the order is Primary Line 1 of a new Family Package.
      familyRows: (values) => {
        const c = family(values);
        if (!c.applies || !c.ok) return [];
        if (!c.additional) return [{ label: 'Family Package', value: `${c.lineLabel} of a new Family Package` }];
        const tier = planName(values, c.additional.tierPlanId);
        const secondaryType = !c.additional.pending && c.additional.role === 'Secondary' ? products.find((p) => p.productId === c.planId)?.secondaryPlanType : undefined;
        return [
          { label: 'Family Package', value: `${c.lineLabel} of the existing Family Package` },
          ...(tier ? [{ label: 'Family Plan', value: tier }] : []),
          ...(secondaryType ? [{ label: 'Secondary Plan Type', value: secondaryType }] : []),
        ];
      },
    }),
    cafSignatureStep({ variant: 'full' }),
    // "On successful WinCash confirmation, return to DXP, submit the order, and create the interaction activity"
    // (2026-09-28): Payment is the last step, so Continue here would only ever mean "submit".
    paymentStep({ zeroValueReceipt: true, submitOnPaid: true }),
  ];
}

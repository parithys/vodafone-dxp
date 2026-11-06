import type { ReactNode } from 'react';
import { PLAN_SELECTION_LABEL } from '../../data/stepLabels';
import { planChoiceSummary } from './summary';
import type { CustomerBenefit } from '../../engines/customerBenefitEngine';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { PlanSelection } from './PlanSelection';
import { AddDiscountAction } from './AddDiscountAction';
import { CustomiseAddonsAction } from './CustomiseAddonsAction';
import { EligibilityChecksList } from '../../components/domain/EligibilityRows';
import { buildEligibilityRows } from '../../components/domain/eligibilityRowsModel';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { CustomerTypeValue } from '../CustomerType/customerTypeModel';
import { isCustomerTypeValid } from '../CustomerType/customerTypeModel';

/** What the postpaid plan steps need from their journey. */
export interface PostpaidPlanContext {
  /** The plan catalogue (fetched once by the journey, shared with Number Selection's Star entitlement). */
  products: { productId: string; preBundledOffer?: boolean; mrcQAR?: number }[];
  /** The benefits the customer holds, for choosing which discounts to offer. */
  customerBenefits: CustomerBenefit[] | undefined;
  /** Leave the Plan and Addons steps out of the journey (an accepted offer already fixes the plan). */
  skipWhen?: (values: Record<string, unknown>) => boolean;
  /** A plan not offered (the line's current plan, when the journey changes it). */
  hiddenProductId?: (values: Record<string, unknown>) => string | undefined;
  /** The journey identifies the customer before it knows the product, so Customer Verification does not announce the upfront payment (HRN): say it here, once the plan is being chosen. */
  announceHrn?: boolean;
  /** Content above the plan cards for the plan chosen so far (a Family Plan says what it starts). */
  notice?: (values: Record<string, unknown>) => ReactNode;
  /** The journey takes no add-ons (a Family Package's are managed from Customer 360): no Customise Add-ons, and the Add-ons step never stops Continue. */
  addonsHidden?: (values: Record<string, unknown>) => boolean;
  /** A further condition on Continue from the plan page, beyond a plan being chosen. */
  canContinue?: (values: Record<string, unknown>) => boolean;
}

export function postpaidPlanStep(ctx: PostpaidPlanContext): WizardStep {
  return {
    key: 'plan',
    summary: planChoiceSummary,
    skip: ctx.skipWhen,
    label: PLAN_SELECTION_LABEL,
    render: ({ values, setValue }) => renderPlanStep(ctx, values, setValue),
    isValid: (values) => Boolean(values.productId) && (ctx.canContinue?.(values) ?? true),
    // Once a plan is chosen on Standard Plans or Special Offers, Customise Add-ons and Edit Discount sit just before Continue.
    primaryAction: ({ values, setValue, goNext, defaultButton }) => (
      <div className="row">
        {!ctx.addonsHidden?.(values) && (
        <CustomiseAddonsAction
          productId={values.productId as string | undefined}
          preBundled={Boolean(ctx.products.find((p) => p.productId === values.productId)?.preBundledOffer) || values.planTab === 'specials'}
          setCustomise={() => setValue('customiseAddons', true)}
          goNext={goNext}
        />
        )}
        <AddDiscountAction
          productId={values.productId as string | undefined}
          tab={values.planTab as string | undefined}
          discountId={values.discountId as string | undefined}
          onSelectDiscount={(id) => setValue('discountId', id)}
          customerBenefits={ctx.customerBenefits}
          specialDiscountType={specialTypeOf(values)}
          customerBenefit={benefitOf(values)}
          planAmount={ctx.products.find((p) => p.productId === values.productId)?.mrcQAR}
        />
        {defaultButton}
      </div>
    ),
    // "For pre-bundled eligible offers, skip add-on selection" - re-evaluates on every value change.
    autoAdvanceWhen: (values) => Boolean(ctx.products.find((p) => p.productId === values.productId)?.preBundledOffer),
  };
}

/** A Special Discount counts once validated: its details given and, for Retiree and MADA, the supporting document scanned and accepted. */
const specialTypeOf = (values: Record<string, unknown>) =>
  ((v) => (v ? (v.type && v.type !== 'none' && !v.rejected && isCustomerTypeValid(v) ? v.type : 'none') : undefined))(values.customerType as CustomerTypeValue | undefined);
const benefitOf = (values: Record<string, unknown>) => {
  const v = values.customerType as CustomerTypeValue | undefined;
  return v?.officeAccepted || (isCustomerTypeValid(v) && v?.type === 'b2b2c') ? v?.type : undefined;
};

function renderPlanStep(
  { customerBenefits, hiddenProductId, announceHrn, notice }: PostpaidPlanContext,
  values: Record<string, unknown>,
  setValue: (field: string, value: unknown) => void
) {
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const hrnRows = announceHrn && eligibility?.requiresHrnAdvance ? buildEligibilityRows([], true, eligibility.nationality, 'postpaid', eligibility.isExistingCustomer).filter((r) => r.id === 'hrn') : [];
  const addonsChosen = ((values.addonIds as string[] | undefined) ?? []).length > 0;
  return (
    <>
      {hrnRows.length > 0 && <div className="mb-6"><EligibilityChecksList rows={hrnRows} /></div>}
      {notice?.(values)}
      <PlanSelection
        kind="postpaid"
        customerNationality={eligibility?.nationality}
        customerBenefits={customerBenefits}
        // A Special Discount counts once validated: its details given and, for Retiree and MADA, the supporting document scanned and accepted.
        specialDiscountType={specialTypeOf(values)}
        customerBenefit={benefitOf(values)}
        selectedProductId={values.productId as string | undefined}
        // This journey's rule: the add-ons were chosen for the plan they were chosen on, so a different plan (or none) starts the Addons page clean. (The discount is
        // the plan page's own and is cleared with it.)
        onSelectProduct={(id) => {
          if (id !== values.productId && addonsChosen) setValue('addonIds', []);
          setValue('productId', id);
        }}
        onPlanTabChange={(tab) => setValue('planTab', tab)}
        onDeselectProduct={() => {
          setValue('productId', undefined);
          if (addonsChosen) setValue('addonIds', []);
        }}
        discountId={values.discountId as string | undefined}
        onSelectDiscount={(id) => setValue('discountId', id)}
        // Passed on to the later steps: where the plan came from and what an offer bundles.
        onSelectionChange={({ source, bundled }) => {
          setValue('selectionSource', source);
          setValue('bundledItems', bundled);
        }}
        // The limit set on the Addons page, shown on the chosen plan's card.
        billLimit={values.billLimit as number | undefined}
        hiddenProductId={hiddenProductId?.(values)}
      />
    </>
  );
}

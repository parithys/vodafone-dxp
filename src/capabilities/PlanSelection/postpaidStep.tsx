import type { ReactNode } from 'react';
import { PLAN_SELECTION_LABEL, ADDONS_DISCOUNTS_LABEL } from '../../data/stepLabels';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { planChoiceSummary, planExtrasSummary } from './summary';
import type { CustomerBenefit } from '../../engines/customerBenefitEngine';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { PlanSelection } from './PlanSelection';
import { AddDiscountAction } from './AddDiscountAction';
import { CustomiseAddonsAction } from './CustomiseAddonsAction';
import { SpendFlag } from './SpendFlag';
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
  /** Leave the Plan and Add-ons steps out of the journey (an accepted offer already fixes the plan). */
  skipWhen?: (values: Record<string, unknown>) => boolean;
  /** A plan not offered (the line's current plan, when the journey changes it). */
  hiddenProductId?: (values: Record<string, unknown>) => string | undefined;
  /** The journey identifies the customer before it knows the product, so Customer Verification does not announce the upfront payment (HRN): say it here, once the plan is being chosen. */
  announceHrn?: boolean;
  /** Content above the plan cards for the plan chosen so far (a Family Plan says what it starts). */
  notice?: (values: Record<string, unknown>) => ReactNode;
  /** A further condition on Continue from the plan page, beyond a plan being chosen. */
  canContinue?: (values: Record<string, unknown>) => boolean;
}

export function postpaidPlanStep(ctx: PostpaidPlanContext): WizardStep {
  return {
    key: 'plan',
    summary: planChoiceSummary,
    skip: ctx.skipWhen,
    label: PLAN_SELECTION_LABEL,
    render: ({ values, setValue }) => renderPlanStep('plan', ctx, values, setValue),
    isValid: (values) => Boolean(values.productId) && (ctx.canContinue?.(values) ?? true),
    // Once a plan is chosen on Standard Plans or Special Offers, Customise Add-ons and Edit Discount sit just before Continue.
    primaryAction: ({ values, setValue, goNext, defaultButton }) => (
      <div className="row">
        <CustomiseAddonsAction
          productId={values.productId as string | undefined}
          preBundled={Boolean(ctx.products.find((p) => p.productId === values.productId)?.preBundledOffer) || values.planTab === 'specials'}
          setCustomise={() => setValue('customiseAddons', true)}
          goNext={goNext}
        />
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

// The chosen plan's add-ons, bill limit and eligible discounts, with the monthly summary (the step after Plan).
export function postpaidExtrasStep(ctx: PostpaidPlanContext): WizardStep {
  return {
    key: 'planExtras',
    summary: planExtrasSummary,
    skip: ctx.skipWhen,
    label: ADDONS_DISCOUNTS_LABEL,
    subheading: 'Choose optional services and set the spending limit.',
    // Continue from the plan page passes over this step; "Customise Add-ons" on the plan page is the way here. The flag is spent on arrival, so
    // coming Back and pressing Continue goes straight on again.
    autoPass: (values) => !values.customiseAddons,
    render: ({ values, setValue }) => (
      <>
        <SpendFlag active={Boolean(values.customiseAddons)} onSpend={() => setValue('customiseAddons', undefined)} />
        {renderPlanStep('extras', ctx, values, setValue)}
      </>
    ),
    // Bill limit is the only gate; add-ons and discounts never block.
    isValid: (values) => {
      const cap = (values.eligibility as EligibilityResult | undefined)?.defaultCreditLimitQar;
      const limit = values.billLimit as number | undefined;
      return values.billLimitPass !== false && !(cap !== undefined && limit !== undefined && limit > cap);
    },
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
  mode: 'plan' | 'extras',
  { customerBenefits, hiddenProductId, announceHrn, notice }: PostpaidPlanContext,
  values: Record<string, unknown>,
  setValue: (field: string, value: unknown) => void
) {
  {
    {
      const eligibility = values.eligibility as EligibilityResult | undefined;
      const hrnRows = announceHrn && mode === 'plan' && eligibility?.requiresHrnAdvance ? buildEligibilityRows([], true, eligibility.nationality, 'postpaid', eligibility.isExistingCustomer).filter((r) => r.id === 'hrn') : [];
      return (
        <>
        {hrnRows.length > 0 && <div className="mb-6"><EligibilityChecksList rows={hrnRows} /></div>}
        {mode === 'plan' && notice?.(values)}
        <PlanSelection
          kind="postpaid"
          mode={mode}
          customerContext={{
            nationality: eligibility?.nationality,
            // The type the agent validated: a type that was rejected, or never accepted, is Standard here, as it is for the discounts.
            customerType: ((v) => (v && v.type && !v.rejected ? v.type : undefined))(values.customerType as CustomerTypeValue | undefined),
            idType: (values.contact as GuidedContactValue | undefined)?.idType,
          }}
          customerBenefits={customerBenefits}
          // A Special Discount counts once validated: its details given and, for Retiree and MADA, the supporting document scanned and accepted.
          specialDiscountType={specialTypeOf(values)}
          customerBenefit={benefitOf(values)}
          selectedProductId={values.productId as string | undefined}
          onSelectProduct={(id) => setValue('productId', id)}
          onPlanTabChange={(tab) => setValue('planTab', tab)}
          onDeselectProduct={() => setValue('productId', undefined)}
          discountId={values.discountId as string | undefined}
          onSelectDiscount={(id) => setValue('discountId', id)}
          addonIds={(values.addonIds as string[] | undefined) ?? []}
          onAddonsChange={(ids) => setValue('addonIds', ids)}
          addonBilling={(values.addonBilling as Record<string, import('../../engines/addonCategories').AddonBillingFrequency> | undefined) ?? {}}
          onAddonBillingChange={(billing) => setValue('addonBilling', billing)}
          // Passed on to the later steps: where the plan came from and what an offer bundles.
          onSelectionChange={({ source, bundled }) => {
            setValue('selectionSource', source);
            setValue('bundledItems', bundled);
          }}
          billLimit={values.billLimit as number | undefined}
          billLimitMax={eligibility?.defaultCreditLimitQar}
          onBillLimitChange={(amount, pass) => {
            setValue('billLimit', amount);
            setValue('billLimitPass', pass);
          }}
          hiddenProductId={hiddenProductId?.(values)}
        />
        </>
      );
    }
  }
}

import { PLAN_SELECTION_LABEL, ADDONS_DISCOUNTS_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { PlanSelection } from './PlanSelection';
import { planSummary } from './summary';

/**
 * The prepaid pack step (prepaid activation and prepaid port-in): the packs, stored under `productId`. A different pack
 * drops the previous pack's discount and add-ons. Postpaid has its own builders (postpaidPlanStep / postpaidExtrasStep,
 * which read the offer, eligibility and customer type); fixed-line has fixedPlanSelectionStep.
 */
export function planSelectionStep(opts: {
  kind: 'prepaid';
  segment?: (values: Record<string, unknown>) => string | undefined;
  /** A pack not offered (the line's current pack, when the journey changes it). */
  hiddenProductId?: (values: Record<string, unknown>) => string | undefined;
  /** Offer only packs that carry a bundle, not the SIM-only option (changing the pack of a line that already has its SIM). */
  packsOnly?: boolean;
  /** The step's own name where "Offers & Plans" does not fit the journey (port-in onto prepaid: "Prepaid Packs"). It then also stands as the title over the packs. */
  label?: string;
}): WizardStep {
  return {
    key: 'plan',
    label: opts.label ?? PLAN_SELECTION_LABEL,
    render: ({ values, setValue }) => (
      <PlanSelection
        kind="prepaid"
        selectedProductId={values.productId as string | undefined}
        // A different pack carries its own discounts and add-ons, so the previous pack's are dropped.
        onSelectProduct={(id) => {
          if (id !== values.productId) {
            setValue('discountId', undefined);
            setValue('addonIds', []);
          }
          setValue('productId', id);
        }}
        // Clicking the selected pack again clears it, and its discounts and add-ons with it.
        onDeselectProduct={() => {
          setValue('productId', undefined);
          setValue('discountId', undefined);
          setValue('addonIds', []);
        }}
        discountId={values.discountId as string | undefined}
        onSelectDiscount={(id) => setValue('discountId', id)}
        segment={opts.segment?.(values)}
        hiddenProductId={opts.hiddenProductId?.(values)}
        packsOnly={opts.packsOnly}
        showTitle={opts.label === undefined}
      />
    ),
    isValid: (values) => Boolean(values.productId),
  };
}

/**
 * The step after the prepaid pack: the chosen pack, its eligible discounts and optional add-ons, and the starter pack charge
 * (the prepaid counterpart of the postpaid Add-ons step). Both choices are optional, so it is always valid; it is left out
 * of the journey with the pack step.
 */
export function prepaidExtrasStep(opts: { segment?: (values: Record<string, unknown>) => string | undefined }): WizardStep {
  return {
    key: 'planExtras',
    label: ADDONS_DISCOUNTS_LABEL,
    render: ({ values, setValue }) => (
      <PlanSelection
        kind="prepaid"
        mode="extras"
        selectedProductId={values.productId as string | undefined}
        onSelectProduct={(id) => setValue('productId', id)}
        discountId={values.discountId as string | undefined}
        onSelectDiscount={(id) => setValue('discountId', id)}
        segment={opts.segment?.(values)}
        addonIds={(values.addonIds as string[] | undefined) ?? []}
        onSelectAddons={(ids) => setValue('addonIds', ids)}
      />
    ),
    isValid: () => true,
  };
}

/** The fixed-line / fibre / FWA / 5G Home plan step: the fixed plan cards and the credit check; valid once a plan is chosen and the credit check passed or was acknowledged. */
export function fixedPlanSelectionStep(): WizardStep {
  return {
    key: 'plan',
    label: PLAN_SELECTION_LABEL,
    summary: planSummary,
    render: ({ values, setValue }) => <PlanSelection kind="fixed" values={values} setValue={setValue} />,
    isValid: (values) => Boolean(values.productId) && (values.creditCheckPass === true || values.creditCheckAcknowledged === true),
  };
}

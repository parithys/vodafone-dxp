import { PLAN_SELECTION_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { PlanSelection } from './PlanSelection';
import { PrepaidPackActions } from './PrepaidPackActions';
import { loadMandatoryAddonIds } from '../AddonsSelection/usePackHasAddons';
import { planSummary } from './summary';

/**
 * The prepaid pack step (prepaid activation and prepaid port-in): the packs, stored under `productId`. A different pack
 * drops the previous pack's discount and add-ons. Postpaid has its own builder (postpaidPlanStep, which reads the offer,
 * eligibility and customer type); fixed-line has fixedPlanSelectionStep. The step after the plan or pack - its add-ons - is the Add-Ons capability's.
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
  /**
   * New Prepaid activation: a pack carries no discount of its own (no Edit Discount beside Continue, so nothing to clear or carry), and the pack's mandatory
   * products are selected for the agent the moment it is chosen. Off (port-in onto prepaid, a pack change): the pack page keeps Edit Discount and every add-on is optional.
   */
  activation?: boolean;
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
            // The pack's mandatory products are on the order from the moment it is chosen - the agent need not open the Addons page.
            if (opts.activation) void loadMandatoryAddonIds(id).then((ids) => ids.length > 0 && setValue('addonIds', ids));
          }
          setValue('productId', id);
        }}
        // Clicking the selected pack again clears it, and its discounts and add-ons with it.
        onDeselectProduct={() => {
          setValue('productId', undefined);
          setValue('discountId', undefined);
          setValue('addonIds', []);
        }}
        segment={opts.segment?.(values)}
        hiddenProductId={opts.hiddenProductId?.(values)}
        packsOnly={opts.packsOnly}
        showTitle={opts.label === undefined}
      />
    ),
    isValid: (values) => Boolean(values.productId),
    // Once a pack is chosen, Customise Add-ons and Edit Discount sit just before Continue - as on the postpaid plan page.
    primaryAction: ({ values, setValue, goNext, defaultButton }) => (
      <div className="row">
        <PrepaidPackActions
          productId={values.productId as string | undefined}
          discountId={values.discountId as string | undefined}
          onSelectDiscount={(id) => setValue('discountId', id)}
          discountEditable={!opts.activation}
          setCustomise={() => setValue('customiseAddons', true)}
          goNext={goNext}
        />
        {defaultButton}
      </div>
    ),
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

import { ChoiceCards } from '../../../components/primitives/ChoiceCards';
import type { WizardStep } from '../../../components/patterns/wizard/guidedWizardTypes';
import { ProductEligibility } from './ProductEligibility';
import { productEligibilityClear, selectMnpType } from './productChoice';
import type { ProductStepContext } from './ProductSelection';
import type { MnpType } from '../products';

const ICON_PHONE = 'M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M11 18h2';
const ICON_TICKET = 'M3 6h18v12H3z M3 10h18 M6 15h4';

const planTypeLabel = (t: unknown) => (t === 'prepaid' ? 'Prepaid Plan' : t === 'postpaid' ? 'Postpaid Plan' : undefined);

/**
 * "Port the number onto": the step that opens the New MNP flow, whichever way the agent started it - selecting a New MNP offer
 * (which already names its plan type, shown chosen) or the New MNP button (nothing chosen yet). Product Selection no longer asks:
 * it only records that the product is MNP. The plan type decides the eligibility rules, the steps and the billing, so it is judged
 * here, for the type chosen, before the journey goes on.
 */
export function mnpPlanTypeStep(ctx: ProductStepContext): WizardStep {
  return {
    key: 'mnpType',
    // The step is named for what it records (the MNP Form calls it "Plan type"); the question the agent answers is the cards' legend.
    label: 'Plan Type',
    heading: 'Plan Type',
    summary: [{ key: 'mnpType', label: 'Plan Type', type: 'text', value: (v: Record<string, unknown>) => planTypeLabel(v.mnpType) }],
    render: ({ values, setValue }) => {
      // From New MNP with no plan type named, `mnpType` is only a placeholder: nothing is judged, and no card shown chosen, until the agent picks one.
      const chosen = values.mnpTypeUnchosen !== true;
      return (
      <div className="space-y-6">
        <ChoiceCards<MnpType>
          legend="Port the number onto"
          items={[
            { key: 'postpaid', label: 'Postpaid Plan', icon: ICON_PHONE },
            { key: 'prepaid', label: 'Prepaid Plan', icon: ICON_TICKET },
          ]}
          value={chosen ? (values.mnpType as MnpType | undefined) : undefined}
          onChange={(t) => selectMnpType(ctx, values, setValue, t)}
        />
        {chosen && (
          <ProductEligibility
            values={values}
            setValue={setValue}
            flow={ctx.flow}
            existingCustomerId={ctx.existingCustomerId}
            deferredApprovals
            onSwitchToPrepaid={() => selectMnpType(ctx, values, setValue, 'prepaid')}
          />
        )}
      </div>
      );
    },
    isValid: (values) => values.mnpTypeUnchosen !== true && Boolean(values.mnpType) && productEligibilityClear(values),
  };
}

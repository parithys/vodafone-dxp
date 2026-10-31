import { SPECIAL_DISCOUNTS_IDENTIFICATION_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { SpecialDiscountsIdentification } from './SpecialDiscountsIdentification';
import { isCustomerTypeValid } from './specialDiscountsModel';
import type { SpecialDiscountsValue } from './specialDiscountsModel';

/** Special Discounts identification stored under `field`; continues once the chosen benefit's evidence is complete. */
export function specialDiscountsIdentificationStep(opts: { key: string; field: string }): WizardStep {
  return {
    key: opts.key,
    label: SPECIAL_DISCOUNTS_IDENTIFICATION_LABEL,
    render: ({ values, setValue }) => (
      <SpecialDiscountsIdentification value={(values[opts.field] as SpecialDiscountsValue) ?? {}} onChange={(v) => setValue(opts.field, v)} />
    ),
    isValid: (values) => isCustomerTypeValid(values[opts.field] as SpecialDiscountsValue | undefined),
  };
}

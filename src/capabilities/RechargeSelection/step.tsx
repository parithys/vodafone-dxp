import { RECHARGE_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { RechargeSelection } from './RechargeSelection';

type Values = Record<string, unknown>;

/**
 * Recharge selection, stored under `rechargeId` (one recharge per subscription). Optional unless the journey says `required` - the BRSD makes the
 * need for a recharge configurable by persona, so the rule comes from the journey. `idType` reads the customer's ID type for the SIM card charge note.
 */
export function rechargeSelectionStep(opts: { idType?: (values: Values) => string | undefined; required?: (values: Values) => boolean } = {}): WizardStep {
  return {
    key: 'recharge',
    label: RECHARGE_LABEL,
    subheading: 'Choose the recharge the customer pays with this subscription.',
    summary: [
      { key: 'recharge', label: 'Recharge', type: 'select', optional: true, labelFrom: { kind: 'recharge-products', idField: 'rechargeId', labelField: 'name' }, value: (v) => v.rechargeId },
    ],
    render: ({ values, setValue }) => (
      <RechargeSelection
        value={values.rechargeId as string | undefined}
        onChange={(id) => setValue('rechargeId', id)}
        idType={opts.idType?.(values)}
        required={opts.required?.(values) ?? false}
      />
    ),
    isValid: (values) => !(opts.required?.(values) ?? false) || Boolean(values.rechargeId),
  };
}

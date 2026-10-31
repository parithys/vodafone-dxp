import { CUSTOMER_IDENTIFICATION_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { CustomerIdentification } from './CustomerIdentification';
import type { IdLookupValue } from '../../components/patterns/idLookupModel';

/** Identity lookup (ID type, number, MOI fetch) stored under `field`; continues once MOI has resolved. */
export function idLookupStep(opts: { key: string; field: string; manualEntry?: boolean }): WizardStep {
  return {
    key: opts.key,
    label: CUSTOMER_IDENTIFICATION_LABEL,
    render: ({ values, setValue }) => (
      <CustomerIdentification value={(values[opts.field] as IdLookupValue) ?? {}} onChange={(v) => setValue(opts.field, v)} manualEntry={opts.manualEntry} />
    ),
    isValid: (values) => Boolean((values[opts.field] as IdLookupValue | undefined)?.moiResult),
 };
}

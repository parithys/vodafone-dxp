import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import type { CustomerTypeValue } from '../CustomerType/customerTypeModel';
import { AddonsPicker } from './AddonsPicker';

type Values = Record<string, unknown>;

/**
 * Add-ons on their own (Add Add-On), stored under `addonIds`: the add-ons the line's plan can take, one row each, complete once at
 * least one is chosen. `planId` is the plan or pack the add-ons are for; `source` says whether it is a postpaid plan (the add-on
 * products, offered by plan eligibility) or a prepaid pack (its own add-ons, a one-off charge). Eligibility also reads the
 * customer's nationality, customer type and ID type.
 */
export function addonsSelectionStep(opts: {
  planId: (values: Values) => string | undefined;
  source?: (values: Values) => 'catalogue' | 'prepaid';
  emptyMessage?: string;
}): WizardStep {
  const source = (values: Values) => opts.source?.(values) ?? 'catalogue';
  const summary: SummaryField[] = [
    { key: 'addons', label: 'Add-Ons', type: 'multi', labelFrom: { kind: 'products', idField: 'productId', labelField: 'name' }, value: (v) => v.addonIds, when: (v) => source(v) === 'catalogue' },
    { key: 'addons-prepaid', label: 'Add-Ons', type: 'multi', labelFrom: { kind: 'addons-discounts', idField: 'addonDiscountId', labelField: 'name' }, value: (v) => v.addonIds, when: (v) => source(v) === 'prepaid' },
  ];
  return {
    key: 'addons',
    label: 'Add-Ons',
    subheading: 'Choose the add-ons to add to the line.',
    summary,
    render: ({ values, setValue }) => (
      <AddonsPicker
        layout="rows"
        hideHeader
        source={source(values)}
        selectedIds={(values.addonIds as string[] | undefined) ?? []}
        onChange={(ids) => setValue('addonIds', ids)}
        eligibilityContext={{
          planId: opts.planId(values),
          nationality: (values.eligibility as EligibilityResult | undefined)?.nationality,
          customerType: (values.customerType as CustomerTypeValue | undefined)?.type,
          idType: (values.contact as GuidedContactValue | undefined)?.idType,
        }}
        emptyMessage={opts.emptyMessage ?? 'No add-ons are available for this plan.'}
      />
    ),
    isValid: (values) => ((values.addonIds as string[] | undefined) ?? []).length > 0,
  };
}

import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { DEFAULT_SERVICE_OPTIONS } from '../../components/patterns/serviceOptions';
import type { ServiceOptions } from '../../components/patterns/serviceOptions';
import { ADDONS_DISCOUNTS_LABEL } from '../../data/stepLabels';
import type { CustomerTypeValue } from '../CustomerType/customerTypeModel';
import type { AddonBillingFrequency } from '../../engines/addonCategories';
import { AddonsSelection } from './AddonsSelection';
import { AddonsPicker } from './AddonsPicker';
import { SpendFlag } from './SpendFlag';
import { addonsSummary } from './summary';

type Values = Record<string, unknown>;

/** What the postpaid Addons step needs from its journey. */
export interface PostpaidAddonsContext {
  /** Leave the Addons step out of the journey (an accepted offer already fixes the plan, and its extras). */
  skipWhen?: (values: Values) => boolean;
  /** The journey takes no add-ons (a Family Package's are managed from Customer 360): the step never stops Continue. */
  addonsHidden?: (values: Values) => boolean;
}

/** Who the customer is for the add-ons they are eligible for: the nationality from eligibility, the customer type the agent validated (a rejected one is Standard) and the ID type. */
const customerContextOf = (values: Values) => ({
  nationality: (values.eligibility as EligibilityResult | undefined)?.nationality,
  customerType: ((v) => (v && v.type && !v.rejected ? v.type : undefined))(values.customerType as CustomerTypeValue | undefined),
  idType: (values.contact as GuidedContactValue | undefined)?.idType,
});

/** Add Add-On reads the customer type as held (it has no validated/rejected distinction of its own), unlike the activation journey. */
const addOnContextOf = (values: Values) => ({ ...customerContextOf(values), customerType: (values.customerType as CustomerTypeValue | undefined)?.type });

/**
 * The postpaid Addons step, the step after Offers & Plans: the chosen plan's add-ons, the bill limit and the line's service options. Continue from the plan page passes over
 * it; "Customise Add-ons" on the plan page is the way here (it sets `customiseAddons`, spent on arrival, so coming Back and pressing Continue goes straight on again).
 * Bill limit is the only gate; add-ons never block.
 */
export function postpaidAddonsStep(ctx: PostpaidAddonsContext = {}): WizardStep {
  return {
    key: 'planExtras',
    summary: addonsSummary,
    skip: ctx.skipWhen,
    label: ADDONS_DISCOUNTS_LABEL,
    subheading: 'Choose optional services and set the spending limit.',
    autoPass: (values) => !values.customiseAddons || Boolean(ctx.addonsHidden?.(values)),
    render: ({ values, setValue }) => (
      <>
        <SpendFlag active={Boolean(values.customiseAddons)} onSpend={() => setValue('customiseAddons', undefined)} />
        <AddonsSelection
          kind="postpaid"
          planId={values.productId as string | undefined}
          addonIds={(values.addonIds as string[] | undefined) ?? []}
          onAddonsChange={(ids) => setValue('addonIds', ids)}
          addonBilling={(values.addonBilling as Record<string, AddonBillingFrequency> | undefined) ?? {}}
          onAddonBillingChange={(billing) => setValue('addonBilling', billing)}
          customerContext={customerContextOf(values)}
          // A pre-bundled plan (the Offers tab) takes no add-ons and nothing is listed before a plan is chosen: this journey's rule.
          bundledPlansTakeNoAddons
          billLimit={{
            value: values.billLimit as number | undefined,
            max: (values.eligibility as EligibilityResult | undefined)?.defaultCreditLimitQar,
            onChange: (amount, pass) => {
              setValue('billLimit', amount);
              setValue('billLimitPass', pass);
            },
          }}
          serviceOptions={{ value: (values.serviceOptions as ServiceOptions | undefined) ?? DEFAULT_SERVICE_OPTIONS, onChange: (options) => setValue('serviceOptions', options) }}
        />
      </>
    ),
    isValid: (values) => {
      const cap = (values.eligibility as EligibilityResult | undefined)?.defaultCreditLimitQar;
      const limit = values.billLimit as number | undefined;
      return values.billLimitPass !== false && !(cap !== undefined && limit !== undefined && limit > cap);
    },
  };
}

/**
 * The prepaid Addons step, the step after the pack - the prepaid counterpart of the postpaid one: the chosen pack's add-ons. Continue from the pack page passes over it;
 * "Customise Add-ons" on the pack page is the way here (it sets `customiseAddons`, spent on arrival). The add-ons are optional, so it is always valid; it is left out of the
 * journey with the pack step.
 */
export function prepaidAddonsStep(): WizardStep {
  return {
    key: 'planExtras',
    // No summary of its own: a prepaid add-on is an add-ons/discounts record (not a product), so each prepaid journey attaches its own Summary rows (attachSummaries).
    label: ADDONS_DISCOUNTS_LABEL,
    subheading: 'Choose optional services for the pack.',
    autoPass: (values) => !values.customiseAddons,
    render: ({ values, setValue }) => (
      <>
        <SpendFlag active={Boolean(values.customiseAddons)} onSpend={() => setValue('customiseAddons', undefined)} />
        <AddonsSelection
          kind="prepaid"
          selectedProductId={values.productId as string | undefined}
          addonIds={(values.addonIds as string[] | undefined) ?? []}
          onSelectAddons={(ids) => setValue('addonIds', ids)}
        />
      </>
    ),
    isValid: () => true,
  };
}

/**
 * Add-ons on their own (Add Add-On), stored under `addonIds`: the add-ons the line's plan can take, complete once at least one is chosen (this journey's rule). `planId` is
 * the plan or pack the add-ons are for; `source` says whether it is a postpaid plan (the same Addons page the activation journey shows, so the category tabs and Paid / Free
 * columns are the same) or a prepaid pack (its own add-ons, a one-off charge). Eligibility also reads the customer's nationality, customer type and ID type. The line already
 * has its plan, so no bill limit or service options are set here and the billing frequency is not recorded.
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
  const emptyMessage = opts.emptyMessage ?? 'No add-ons are available for this plan.';
  return {
    key: 'addons',
    label: 'Add-Ons',
    subheading: 'Choose the add-ons to add to the line.',
    summary,
    render: ({ values, setValue }) =>
      source(values) === 'catalogue' ? (
        <AddonsSelection
          kind="postpaid"
          planId={opts.planId(values)}
          addonIds={(values.addonIds as string[] | undefined) ?? []}
          onAddonsChange={(ids) => setValue('addonIds', ids)}
          customerContext={addOnContextOf(values)}
          emptyMessage={emptyMessage}
        />
      ) : (
        <AddonsPicker
          layout="rows"
          hideHeader
          source="prepaid"
          selectedIds={(values.addonIds as string[] | undefined) ?? []}
          onChange={(ids) => setValue('addonIds', ids)}
          eligibilityContext={{ planId: opts.planId(values), ...addOnContextOf(values) }}
          emptyMessage={emptyMessage}
        />
      ),
    isValid: (values) => ((values.addonIds as string[] | undefined) ?? []).length > 0,
  };
}

import { NUMBER_SELECTION_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { NumberSelection } from './NumberSelection';
import { numberSummary } from './summary';
import { WaiveOff } from './WaiveOff';
import { FREE_NUMBER_PRICE_CEILING_QAR, starNumberOverageQar } from '../../engines/postpaidPricing';
import { isNumberWaiver } from '../../engines/numberWaiver';
import { requirementForCondition } from '../../engines/journeyDocuments';
import type { AdditionalDocument } from '../DocumentUpload';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';

/**
 * Number selection: the chosen number is stored under `msisdn` (and its price under `priceField`, when given).
 * `plan` reads the journey's selected plan from the values, for the Star entitlement note. `refresh` adds the
 * Refresh action to the step's title row. Journeys that need more (a summary, say) spread this and add it.
 */
export function numberSelectionStep(
  opts: {
    priceField?: string;
    plan?: (values: Record<string, unknown>) => { mrcQar?: number; starEntitlementQar?: number } | undefined;
    refresh?: boolean;
    /** Offer "Use a Pre-Paired SIM" (Mobile Prepaid): the choice is kept under `prePaired`, and the number then comes from the SIM. */
    prePairedOption?: boolean;
    /** Offer "Waive Off" beside Continue: Partial or Full waiver of the Star number's upfront charge (postpaid journeys that price the number). */
    waiveOff?: boolean;
 } = {}
): WizardStep {
  return {
    key: 'number',
    label: NUMBER_SELECTION_LABEL,
    summary: numberSummary(opts.priceField),
    ...(opts.refresh
      ? {
          headerAction: ({ values, setValue }) => (
            <Button
              variant="secondary"
              compact
              onClick={() => setValue('numberRefresh', ((values.numberRefresh as number | undefined) ?? 0) + 1)}
            >
              <Icon path="M21 12a9 9 0 1 1-3-6.7 M21 4v5h-5" className="w-4 h-4" />
              Refresh
            </Button>
          ),
 }
      : {}),
    render: ({ values, setValue }) => (
      <NumberSelection
        value={values.msisdn as string | undefined}
        refreshKey={opts.refresh ? (values.numberRefresh as number | undefined) : undefined}
        plan={opts.plan?.(values)}
        customerIdNumber={(values.contact as { idNumber?: string } | undefined)?.idNumber}
        prePaired={
          opts.prePairedOption
            ? {
                checked: values.prePaired === true,
                onChange: (checked) => {
                  setValue('prePaired', checked);
                  // The number belongs to whichever route is chosen, so switching route drops the other's number and SIM.
                  setValue('msisdn', undefined);
                  if (opts.priceField) setValue(opts.priceField, undefined);
                  setValue('simType', undefined);
                },
              }
            : undefined
        }
        onChange={(msisdn, price) => {
          // A different number has a different charge: a waiver chosen for the old one does not carry over.
          if (msisdn !== values.msisdn) setValue('numberWaiver', undefined);
          // ... and neither does its supporting document.
          const req = requirementForCondition('number-waiver');
          const caf = values.caf as { additionalDocuments?: AdditionalDocument[] } | undefined;
          if (msisdn !== values.msisdn && req && caf?.additionalDocuments?.some((d) => d.requirementId === req.id)) setValue('caf', { ...caf, additionalDocuments: caf.additionalDocuments.filter((d) => d.requirementId !== req.id) });
          setValue('msisdn', msisdn);
          if (opts.priceField) setValue(opts.priceField, price);
 }}
      />
    ),
    // Waive Off sits before Continue.
    ...(opts.waiveOff
      ? {
          primaryAction: ({ values, setValue, defaultButton }) => {
            const plan = opts.plan?.(values);
            const price = values[opts.priceField ?? 'numberPriceQAR'] as number | undefined;
            const charge =
              plan && price !== undefined && price >= FREE_NUMBER_PRICE_CEILING_QAR ? starNumberOverageQar(plan.mrcQar ?? 0, price, plan.starEntitlementQar) : 0;
            const requirement = requirementForCondition('number-waiver');
            const caf = (values.caf as { additionalDocuments?: AdditionalDocument[] } | undefined) ?? {};
            const attachedDocs = caf.additionalDocuments ?? [];
            return (
              <div className="flex items-center gap-3">
                <WaiveOff
                  chargeQar={values.msisdn ? charge : 0}
                  numberChosen={Boolean(values.msisdn)}
                  waiver={isNumberWaiver(values.numberWaiver) ? values.numberWaiver : undefined}
                  onChange={(w) => setValue('numberWaiver', w)}
                  // The supporting document is kept with the CAF's additional documents, under the requirement it satisfies: Additional Documents then
                  // shows it as already attached rather than asking again.
                  {...(requirement
                    ? {
                        documentRequirement: requirement,
                        document: attachedDocs.find((d) => d.requirementId === requirement.id),
                        onDocumentChange: (d: AdditionalDocument | undefined) => setValue('caf', { ...caf, additionalDocuments: [...attachedDocs.filter((x) => x.requirementId !== requirement.id), ...(d ? [d] : [])] }),
                      }
                    : {})}
                />
                {defaultButton}
              </div>
            );
          },
        }
      : {}),
    isValid: (values) => Boolean(values.msisdn) || (opts.prePairedOption === true && values.prePaired === true),
 };
}

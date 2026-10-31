import { LINE_SELECTION_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { lineIneligibility } from '../../components/patterns/lineSelectionModel';
import type { CustomerLine, LineType } from '../../components/patterns/lineSelectionModel';
import { LineSelection } from './LineSelection';
import { at } from '../summaryKit';

/**
 * Line selection, stored under `line`: the customer's postpaid and / or prepaid lines, valid once a line that can be changed is
 * chosen. The customer is the one Customer Verification resolved (`eligibility.customerId`). `onSelect` lets a journey carry
 * what it needs from the line into its own values (the billing account, the plan the add-ons are for).
 */
export function lineSelectionStep(opts: {
  lineType?: LineType;
  /** The journey needs the line's catalogue plan (Add Add-On). */
  requirePlan?: boolean;
  onSelect?: (line: CustomerLine | undefined, setValue: (field: string, value: unknown) => void) => void;
} = {}): WizardStep {
  return {
    key: 'line',
    label: LINE_SELECTION_LABEL,
    summary: [
      { key: 'line', label: 'Line', type: 'text', value: (v) => at(v, 'line', 'identifier') },
      { key: 'plan', label: 'Current Plan', type: 'text', value: (v) => at(v, 'line', 'productName') },
    ],
    render: ({ values, setValue }) => (
      <LineSelection
        customerId={(values.eligibility as EligibilityResult | undefined)?.customerId}
        lineType={opts.lineType}
        requirePlan={opts.requirePlan}
        value={values.line as CustomerLine | undefined}
        onChange={(line) => {
          setValue('line', line);
          opts.onSelect?.(line, setValue);
        }}
      />
    ),
    isValid: (values) => {
      const line = values.line as CustomerLine | undefined;
      // The line has to belong to the customer identified NOW: changing the customer after choosing a line leaves the old line in the draft.
      const customerId = (values.eligibility as EligibilityResult | undefined)?.customerId;
      return Boolean(line) && line!.customerId === customerId && !lineIneligibility(line!, { requirePlan: opts.requirePlan });
    },
  };
}

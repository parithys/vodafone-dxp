import { PostpaidAddonsStep } from './PostpaidAddonsStep';
import type { PostpaidAddonsStepProps } from './PostpaidAddonsStep';
import { PrepaidAddonsStep } from './PrepaidAddonsStep';
import type { PrepaidAddonsStepProps } from './PrepaidAddonsStep';

/**
 * ADD-ONS - the one application-wide capability for choosing what is added to a line, its own page beside Plan Selection (never a half of it).
 *
 * Journeys mount THIS component (usually through postpaidAddonsStep / prepaidAddonsStep / addonsSelectionStep) and say what their context needs; none of them
 * composes the parts itself. The only thing it takes from the plan or pack page is the id of what was chosen there.
 *
 *   kind 'postpaid'   the plan's add-ons under category tabs (Local Data, Local Minutes, International, Roaming, Combo, Others, Frequently Used), Paid and Free side by
 *                     side, billing frequency and the Multi-SIM maximum; and, for the journey that sets them, the Bill Limit and the service options.
 *   kind 'prepaid'    the chosen pack, its optional add-ons, its eligible discounts and the pack total.
 *
 * What a journey does with the page - when it is skipped, when Continue is allowed, what a plan change clears, whether a pre-bundled offer takes add-ons - is the
 * journey's own rule, in its step builder or passed as a prop; the page states none of it.
 */
export type AddonsSelectionProps = ({ kind: 'postpaid' } & PostpaidAddonsStepProps) | ({ kind: 'prepaid' } & PrepaidAddonsStepProps);

export function AddonsSelection(props: AddonsSelectionProps) {
  switch (props.kind) {
    case 'postpaid': {
      const { kind: _kind, ...rest } = props;
      return <PostpaidAddonsStep {...rest} />;
    }
    case 'prepaid': {
      const { kind: _kind, ...rest } = props;
      return <PrepaidAddonsStep {...rest} />;
    }
  }
}

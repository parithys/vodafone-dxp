import type { ComponentProps } from 'react';
import { PostpaidPlanAddonsStep } from '../../components/patterns/PostpaidPlanAddonsStep';
import { PrepaidPlanStep } from '../../components/patterns/PrepaidPlanStep';
import { FixedPlanStep } from '../../components/patterns/FixedPlanStep';

/**
 * PLAN SELECTION - the one application-wide capability for choosing the plan an order is for.
 *
 * Journeys mount THIS component (usually through planSelectionStep in wizard/wizardSteps) and say which kind of
 * plan their context sells; none of them picks between the parts itself.
 *
 *   kind 'postpaid'   postpaid plan cards with offers, add-ons, discounts and bill limit (the plan, then the
 *                     add-ons - `mode` picks which half). New Postpaid, postpaid port-in and Pre-to-Post.
 *   kind 'prepaid'    prepaid packs, then their discounts and add-ons (`mode`). Prepaid activation and prepaid port-in.
 *   kind 'fixed'      the fixed-line / fibre plan cards (the postpaid card with fibre allowances) and the credit check.
 *                     Fixed-line, Fibre, FWA and 5G Home.
 */
export type PlanSelectionProps =
  | ({ kind: 'postpaid' } & ComponentProps<typeof PostpaidPlanAddonsStep>)
  | ({ kind: 'prepaid' } & ComponentProps<typeof PrepaidPlanStep>)
  | ({ kind: 'fixed' } & ComponentProps<typeof FixedPlanStep>);

export function PlanSelection(props: PlanSelectionProps) {
  switch (props.kind) {
    case 'postpaid': {
      const { kind: _kind, ...rest } = props;
      return <PostpaidPlanAddonsStep {...rest} />;
    }
    case 'prepaid': {
      const { kind: _kind, ...rest } = props;
      return <PrepaidPlanStep {...rest} />;
    }
    case 'fixed': {
      const { kind: _kind, ...rest } = props;
      return <FixedPlanStep {...rest} />;
    }
  }
}

import type { ComponentProps } from 'react';
import { PostpaidPlanStep } from '../../components/patterns/PostpaidPlanStep';
import { PrepaidPlanStep } from '../../components/patterns/PrepaidPlanStep';
import { FixedPlanStep } from '../../components/patterns/FixedPlanStep';

/**
 * PLAN SELECTION - the one application-wide capability for choosing the plan an order is for.
 *
 * Journeys mount THIS component (usually through planSelectionStep in wizard/wizardSteps) and say which kind of
 * plan their context sells; none of them picks between the parts itself.
 *
 *   kind 'postpaid'   postpaid plan cards under the Offers / Standard Plans / Special Offers tabs, with search, the plan-type filter and the plan details.
 *                     New Postpaid, postpaid port-in and Pre-to-Post.
 *   kind 'prepaid'    the prepaid packs. Prepaid activation and prepaid port-in.

 * The plan's add-ons (and a prepaid pack's add-ons and discounts) are NOT part of this capability: they are the Add-Ons capability's own page, the step after this one.
 *   kind 'fixed'      the fixed-line / fibre plan cards (the postpaid card with fibre allowances) and the credit check.
 *                     Fixed-line, Fibre, FWA and 5G Home.
 */
export type PlanSelectionProps =
  | ({ kind: 'postpaid' } & ComponentProps<typeof PostpaidPlanStep>)
  | ({ kind: 'prepaid' } & ComponentProps<typeof PrepaidPlanStep>)
  | ({ kind: 'fixed' } & ComponentProps<typeof FixedPlanStep>);

export function PlanSelection(props: PlanSelectionProps) {
  switch (props.kind) {
    case 'postpaid': {
      const { kind: _kind, ...rest } = props;
      return <PostpaidPlanStep {...rest} />;
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

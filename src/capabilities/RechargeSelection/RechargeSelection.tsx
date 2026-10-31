import type { ComponentProps } from 'react';
import { RechargeSelectionStep } from '../../components/patterns/RechargeSelectionStep';

/**
 * RECHARGE SELECTION - the one application-wide capability for choosing the recharge of a prepaid subscription (BRSD V0.3, Prepaid Recharge
 * Selection). Lists the recharge products by category (Flex, Combo, Credit, Data) as selectable cards and says what the choice does to the
 * SIM card charge. Whether a recharge is mandatory is the journey's rule: it passes `required`. Journeys mount THIS component (usually through
 * rechargeSelectionStep); none of them lists recharges itself.
 */
export type RechargeSelectionProps = ComponentProps<typeof RechargeSelectionStep>;

export function RechargeSelection(props: RechargeSelectionProps) {
  return <RechargeSelectionStep {...props} />;
}

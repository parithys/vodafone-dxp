import type { ComponentProps } from 'react';
import { LineSelectionStep } from '../../components/patterns/LineSelectionStep';

/**
 * LINE SELECTION - the one application-wide capability for choosing which of the identified customer's existing mobile
 * lines an order changes: Change Postpaid Plan, Change Prepaid Pack, Add Add-On.
 *
 * Lists the customer's postpaid and / or prepaid lines with their current plan and price. A line that cannot be changed
 * (not active, barred, billing profile in collections) is shown with its reason. Journeys mount THIS component (usually
 * through lineSelectionStep); none of them lists lines itself.
 */
export type LineSelectionProps = ComponentProps<typeof LineSelectionStep>;

export function LineSelection(props: LineSelectionProps) {
  return <LineSelectionStep {...props} />;
}

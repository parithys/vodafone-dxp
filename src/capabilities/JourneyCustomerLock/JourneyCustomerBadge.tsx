import { useCustomerContext } from '../../stores/customerContextStore';

/**
 * The customer a journey is for - name, ID (with its type) and customer ID - shown beside the journey's title so the agent can
 * confirm the context at a glance. One component for every journey, so each shows the same thing.
 *
 * Reads the customer the journey is bound to; until they are identified, an Existing-flow journey (opened from
 * Customer 360 for a known customer) shows the route's customer instead, so the header is never blank.
 */
export function JourneyCustomerBadge({
  wizardId,
  routeCustomer,
}: {
  wizardId: string;
  /** Existing flow: the customer the journey was opened for, from the route. */
  routeCustomer?: { name?: string; customerId?: string };
}) {
  const active = useCustomerContext((s) => s.journey);
  if (active?.wizardId === wizardId) {
    return (
      <span className="text-[length:var(--fs-body)] text-on-dark-2" title="The customer is fixed for this journey">
        <span className="font-medium text-on-dark">{active.customerName}</span> - {active.idType ? `${active.idType} ` : ''}{active.idNumber}
        {active.customerId ? ` - ${active.customerId}` : ''}
      </span>
    );
  }
  if (routeCustomer?.name) {
    return (
      <span className="text-[length:var(--fs-body)] font-medium text-on-dark" title="The customer is fixed for this journey">
        {routeCustomer.name}
        {routeCustomer.customerId ? ` - ${routeCustomer.customerId}` : ''}
      </span>
    );
  }
  return null;
}

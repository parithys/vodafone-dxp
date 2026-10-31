import { useCustomerContext } from '../../stores/customerContextStore';

/**
 * The customer an identification capability (ID scan, MOI lookup, eligibility) works for.
 *
 * Once a customer has been identified or selected - opened in Customer 360, or chosen from Customer Search - that customer stays the
 * context for every journey the agent starts afterwards, from a customer action or from the sidebar: the scanned document is read
 * as THAT customer's own and their details are populated against them. A journey that names its customer explicitly wins. A New
 * Customer journey (`asNewCustomer`) never has one: whoever is scanned is, by definition, not the customer already on screen.
 * The context ends when the agent clears it (Dashboard, a new queue ticket).
 */
export function useActedForCustomer(explicitCustomerId: string | undefined, asNewCustomer = false): string | undefined {
  const contextCustomerId = useCustomerContext((s) => s.customer?.customerId);
  if (asNewCustomer) return undefined;
  return explicitCustomerId ?? contextCustomerId;
}

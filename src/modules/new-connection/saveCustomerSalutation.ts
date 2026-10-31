import type { EntityKind } from '../../engines/mockDataEngine';

/**
 * The salutation the agent entered (optional) is saved to the customer's profile, so Customer 360 shows it. A salutation the agent did not enter changes
 * nothing already on the profile. A new customer has no customer record yet (the journeys create none), so there is nothing to save it to until one exists.
 */
export async function saveCustomerSalutation(
  customerId: string | undefined,
  salutation: string | undefined,
  updateRecord: ((kind: EntityKind, idField: string, id: string, patch: Record<string, unknown>) => Promise<void>) | undefined
): Promise<boolean> {
  const value = salutation?.trim();
  if (!customerId || !value || !updateRecord) return false;
  await updateRecord('customers', 'customerId', customerId, { salutation: value });
  return true;
}

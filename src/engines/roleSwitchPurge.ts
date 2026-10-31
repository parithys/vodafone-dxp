import * as mockDataEngine from './mockDataEngine';
import { canViewCustomerSegment } from './agentPrivilegeEngine';
import { useCustomerContext } from '../stores/customerContextStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useWorkflowStore } from '../stores/workflowStore';

interface CustomerRow {
  customerId: string;
  name: string;
  segment?: string;
}

/** The customers a role may NOT see (a protected segment without its grant). Pure: tests and the purge below both use it. */
export function hiddenCustomersFor(customers: readonly CustomerRow[], personaId: string): CustomerRow[] {
  return customers.filter((c) => !canViewCustomerSegment(personaId, c.segment));
}

/** The customer a wizard draft is about, from what the journey kept: the identified customer, or the eligibility result's. */
export const draftCustomerId = (values: Record<string, unknown> | undefined): string | undefined =>
  (values?.eligibility as { customerId?: string } | undefined)?.customerId ?? (values?.contact as { moiResult?: { customerId?: string } } | undefined)?.moiResult?.customerId;

/**
 * Whatever the app kept in this session about a protected customer the signed-in role may not see - the active customer and the recent list, a journey
 * hold, a journey draft, and the notifications that named them - is dropped. Run when the role changes (and when the app loads with a role that cannot
 * see what a previous role left behind), so switching role never hands one role another's protected data.
 */
export async function purgeProtectedDataForRole(personaId: string): Promise<void> {
  const hidden = hiddenCustomersFor(await mockDataEngine.list<CustomerRow>('customers'), personaId);
  if (hidden.length === 0) return;
  const ids = new Set(hidden.map((c) => c.customerId));
  useCustomerContext.getState().forgetCustomers(ids);
  const drafts = useWorkflowStore.getState().drafts;
  for (const [wizardId, draft] of Object.entries(drafts)) {
    const id = draftCustomerId(draft?.values);
    if (id && ids.has(id)) useWorkflowStore.getState().clearDraft(wizardId);
  }
  useNotificationStore.getState().purgeMentioning(hidden.flatMap((c) => [c.name, c.customerId]));
}

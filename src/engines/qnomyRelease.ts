import { useEntityStore } from '../stores/entityStore';
import { useQnomyQueueStore } from '../stores/qnomyQueueStore';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

/**
 * Closes the Qnomy ticket this session is holding as Completed, and returns the queue to "awaiting next". The agent cannot call the next customer
 * until the held ticket is closed (the header offers Next Customer only with no ticket in hand), and it is closed by any one of: Finish in the
 * header, Done & Exit on the order confirmation, or Create Activity there. All three come through here, so they write the same thing.
 *
 * Does nothing (and returns false) when no ticket is held - a second action on the same page never counts the customer twice.
 */
export async function closeHeldQnomyTicket(): Promise<boolean> {
  const queue = useQnomyQueueStore.getState();
  const ticketId = queue.assignedQTicketId;
  if (!ticketId) return false;
  // Released first, so two quick actions cannot both close it.
  queue.setAssignedQTicketId(null);
  await useEntityStore.getState().updateRecord('qtickets', 'qTicketId', ticketId, {
    status: 'Completed',
    agentInDxpSessionId: null,
    handledByUserId: useAuthStore.getState().profile?.userId ?? null,
    releasedAt: new Date().toISOString(),
  });
  queue.setKioskMobileNumber(null);
  queue.setAwaitingNext(true);
  queue.recordCustomerServed();
  useNotificationStore.getState().pushToast('success', `Customer servicing for ticket ${ticketId} completed.`);
  return true;
}

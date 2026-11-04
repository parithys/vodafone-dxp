import { closeOrderActivities, logActivity } from './activityEngine';
import type { ActivityInput } from './activityEngine';

// Orders whose automatic activity has been recorded, so a second Done & Exit (or Add Another Connection) can never record it twice.
const completionLogged = new Set<string>();

/**
 * Records the order's automatic Completed activity (once) and closes its activities: what Done & Exit does for the order, so a journey that continues for the
 * same customer (Add Another Connection) records the same thing before it starts.
 */
export async function recordOrderCompletion(order: { orderId: string; completionActivity?: ActivityInput }): Promise<void> {
  if (order.completionActivity && !completionLogged.has(order.orderId)) {
    completionLogged.add(order.orderId);
    await logActivity(order.completionActivity);
  }
  await closeOrderActivities(order.orderId);
}

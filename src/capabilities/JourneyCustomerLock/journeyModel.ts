// Shared by every guided journey that holds a customer for its duration.

/**
 * Where a guided journey starts, which decides how the customer is treated:
 *  - 'new'      Agent 360 (Dashboard) or Mobile Connections: the customer is ALWAYS treated as NEW. Full scan -> NAS
 *               lookup; even an ID that has a Siebel record proceeds as a new customer.
 *  - 'existing' Customer Details: the customer is already identified, so Customer Verification opens pre-resolved
 *               with the ID locked (read-only); eligibility still runs.
 */
export type JourneyFlow = 'new' | 'existing';

// Placeholder pending business confirmation (2026-09-28: "Do not assume Agent 360 as the destination, as this has not
// been finalised. Keep the post-exit destination configurable until confirmed"). One named constant for every
// journey's Save as Draft and Abandon - change this one line once the real destination is decided.
export const POST_EXIT_DESTINATION = '/';

// Save as Draft lands on the agent's Draft Orders list.
export const DRAFT_ORDERS_PATH = '/tasks?filter=draft-orders';

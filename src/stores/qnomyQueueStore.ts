import { create } from 'zustand';

interface QnomyQueueState {
  /** The Qnomy ticket THIS login session pulled from the queue, or null.
   *
   * Assignment is session-owned on purpose. The header previously showed any
   * ticket whose status was 'Fed to Agent-in-DXP' for the loaded customer, so a
   * pre-fed seed record made it look as though a customer had been assigned to
   * the agent the moment they logged in. A ticket is now only ever "yours"
   * because you clicked Next Customer in this session. */
  assignedQTicketId: string | null;
  setAssignedQTicketId: (id: string | null) => void;
  /** The mobile number the customer typed on the Qnomy kiosk, carried for the
   * whole interaction. Held here rather than on customerContextStore because it
   * belongs to the INTERACTION, not to a customer record - a walk-in whose
   * number matches nobody on file still has a kiosk number that the journey
   * needs to keep and pre-fill. */
  kioskMobileNumber: string | null;
  setKioskMobileNumber: (m: string | null) => void;
  /** True in the window between an agent clicking Finish and clicking Next
   * Customer - the system must sit here and do nothing on its own; only an
   * explicit Next Customer click may end this state. */
  awaitingNext: boolean;
  setAwaitingNext: (value: boolean) => void;
  /**
   * How many customers this login session has finished servicing.
   *
   * Incremented by Finish only, NOT by Abandoned: a walk-in who left before
   * servicing completed was not served, and counting them would overstate the
   * agent's throughput with the one outcome they did not achieve.
   *
   * Held here rather than derived from qtickets.json because the release path
   * writes `agentInDxpSessionId: null` when it completes a ticket - the record
   * keeps the 'Completed' status but loses the link to who completed it, so
   * the dataset cannot answer "how many did I serve".
   */
  customersServed: number;
  recordCustomerServed: () => void;
}

// Not persisted deliberately: both fields are live front-desk state for the
// current login session, not something that should survive a hard reload as if
// the agent were still holding a customer after restarting the app. A reload
// therefore returns the agent to "no customer called", which is the correct
// starting state.
export const useQnomyQueueStore = create<QnomyQueueState>((set) => ({
  assignedQTicketId: null,
  setAssignedQTicketId: (id) => set({ assignedQTicketId: id }),
  kioskMobileNumber: null,
  setKioskMobileNumber: (m) => set({ kioskMobileNumber: m }),
  awaitingNext: false,
  setAwaitingNext: (value) => set({ awaitingNext: value }),
  customersServed: 0,
  recordCustomerServed: () => set((state) => ({ customersServed: state.customersServed + 1 })),
}));

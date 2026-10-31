import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

// The ONE store that holds who the customer is: ID, name, segment and the rest of the summary. Two
// slices share it, with different lifetimes:
//
//   customer / recentCustomerIds   The customer the agent is looking at or serving (set from Customer
//                                  Search, Customer 360, the session reference box). Cleared from the
//                                  Dashboard and Sales workspace. Survives a browser restart.
//
//   journey                        The customer a journey is being run for, held from the moment they
//                                  are identified until the journey is explicitly ended. Nothing else may
//                                  replace it while it is held:
//                                    - Close Activity on the Activity Final page
//                                    - Save as Draft
//                                    - Abandon Order
//                                    - the session ending (sign-out; it lives in sessionStorage, so
//                                      closing the tab too)
//                                  Every record the journey writes (draft order, order, activity, lead)
//                                  takes its customer from here, so they all name the same person.

export interface ActiveCustomerSummary {
  customerId: string;
  name: string;
  qid: string;
  idType: 'QID' | 'Passport';
  dob: string;
  nationality: string;
  email?: string;
  phone?: string;
  segment: string;
  blacklisted: boolean;
  /** Benefits the customer holds (retired | mada | b2b2c | loyalty | prepaid-welcome); journeys read it to choose which discounts to offer. */
  benefitEligibility?: string[];
}

export interface JourneyContext {
  /** The wizard (draft) this context belongs to. */
  wizardId: string;
  /** Where that journey lives, so another entry point can be sent back to it. */
  path: string;
  journey: string;
  customerName: string;
  idNumber: string;
  /** The kind of document idNumber is (QID, Passport, GCC ID, Diplomatic ID); unknown stays unknown, and is then shown without a type. */
  idType?: string;
  /** Known once the eligibility check has resolved the customer record. */
  customerId?: string;
  /** Known once customerId is: the customer's segment (Consumer, Enterprise ...). */
  segment?: string;
  startedAt: string;
  /** The task reference of this journey, shown wherever the journey is named so it can be quoted; a saved draft keeps it. */
  taskId?: string;
  /** Set once the order is submitted: the Activity Final page can then be shown again until it is closed. */
  finalOrder?: Record<string, unknown>;
}

interface CustomerContextState {
  customer: ActiveCustomerSummary | null;
  recentCustomerIds: string[];
  setActiveCustomer: (customer: ActiveCustomerSummary) => void;
  clearActiveCustomer: () => void;
  /** Forgets these customers everywhere in the context: the active one, the recent list, and a journey held for one of them. */
  forgetCustomers: (customerIds: ReadonlySet<string>) => void;

  journey: JourneyContext | null;
  /** Starts the journey context. A no-op while one is already held - the customer can never be switched. */
  beginJourney: (c: JourneyContext) => void;
  /** Fills in details learned later (customer id, segment, final order) without changing who the customer is. */
  patchJourney: (wizardId: string, patch: Partial<Pick<JourneyContext, 'customerId' | 'segment' | 'finalOrder'>>) => void;
  /** Ends the journey context. With a wizardId, only if that journey owns it. */
  endJourney: (wizardId?: string) => void;
}

// Persistence keeps the two lifetimes (and the storage keys and shapes that existed before the stores were
// merged): the viewed customer in localStorage, the journey hold in sessionStorage.
const VIEWED_KEY = 'vfq-active-customer-store';
const JOURNEY_KEY = 'vfq-journey-customer';

// Corrupt stored JSON, or storage that is full or blocked, must not break startup: unreadable state is dropped
// (so it cannot fail again on every load) and a failed write is ignored - the in-memory state still works.
const splitStorage: StateStorage = {
  getItem: () => {
    try {
      const viewed = localStorage.getItem(VIEWED_KEY);
      const journey = sessionStorage.getItem(JOURNEY_KEY);
      if (viewed === null && journey === null) return null;
      const v = viewed ? (JSON.parse(viewed) as { state?: Record<string, unknown>; version?: number }) : {};
      const j = journey ? (JSON.parse(journey) as { state?: { active?: unknown } }) : {};
      return JSON.stringify({ state: { ...v.state, journey: j.state?.active ?? null }, version: v.version ?? 0 });
    } catch {
      try {
        localStorage.removeItem(VIEWED_KEY);
        sessionStorage.removeItem(JOURNEY_KEY);
      } catch {
        /* storage unavailable */
      }
      return null;
    }
  },
  setItem: (_name, value) => {
    try {
      const { state, version } = JSON.parse(value) as { state: { customer: unknown; recentCustomerIds: unknown; journey: unknown }; version: number };
      localStorage.setItem(VIEWED_KEY, JSON.stringify({ state: { customer: state.customer, recentCustomerIds: state.recentCustomerIds }, version }));
      sessionStorage.setItem(JOURNEY_KEY, JSON.stringify({ state: { active: state.journey }, version }));
    } catch {
      /* storage full or blocked */
    }
  },
  removeItem: () => {
    localStorage.removeItem(VIEWED_KEY);
    sessionStorage.removeItem(JOURNEY_KEY);
  },
};

export const useCustomerContext = create<CustomerContextState>()(
  persist(
    (set, get) => ({
      customer: null,
      recentCustomerIds: [],
      setActiveCustomer: (customer) =>
        set((state) => ({
          customer,
          recentCustomerIds: [customer.customerId, ...state.recentCustomerIds.filter((id) => id !== customer.customerId)].slice(0, 8),
        })),
      clearActiveCustomer: () => set({ customer: null }),
      forgetCustomers: (ids) => {
        if (ids.size === 0) return;
        const s = get();
        const next: Partial<CustomerContextState> = {};
        if (s.customer && ids.has(s.customer.customerId)) next.customer = null;
        if (s.recentCustomerIds.some((id) => ids.has(id))) next.recentCustomerIds = s.recentCustomerIds.filter((id) => !ids.has(id));
        if (s.journey?.customerId && ids.has(s.journey.customerId)) next.journey = null;
        if (Object.keys(next).length) set(next);
      },

      journey: null,
      beginJourney: (c) => {
        if (!get().journey) set({ journey: c });
      },
      patchJourney: (wizardId, p) => {
        const a = get().journey;
        if (!a || a.wizardId !== wizardId) return;
        // No-op when nothing changes: callers patch from effects, and a fresh object every call
        // would re-trigger them forever.
        const changed = (Object.keys(p) as (keyof typeof p)[]).some((k) => p[k] !== undefined && a[k] !== p[k]);
        if (!changed) return;
        // A different customerId means the segment learned for the previous one no longer applies.
        const next = { ...a, ...p };
        if (p.customerId !== undefined && p.customerId !== a.customerId && p.segment === undefined) delete next.segment;
        set({ journey: next });
      },
      endJourney: (wizardId) => {
        const a = get().journey;
        if (a && (!wizardId || a.wizardId === wizardId)) set({ journey: null });
      },
    }),
    {
      name: 'vfq-customer-context',
      storage: createJSONStorage(() => splitStorage),
      partialize: (s) => ({ customer: s.customer, recentCustomerIds: s.recentCustomerIds, journey: s.journey }),
    }
  )
);

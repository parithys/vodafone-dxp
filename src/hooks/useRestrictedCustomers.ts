import { useEffect, useMemo, useState } from 'react';
import * as mockDataEngine from '../engines/mockDataEngine';
import { canViewCustomerSegment } from '../engines/agentPrivilegeEngine';
import { buildRestrictedIndex, type SegmentRow } from '../engines/restrictedCustomers';
import { usePersonaStore } from '../stores/personaStore';

/**
 * Which customers the signed-in role may NOT see (Safwa, Safwa+, Royal without the matching grant), for every screen that lists or opens records
 * that belong to a customer: orders, tickets, tasks, queue facts. Until the customers have loaded nothing is known, so nothing is shown (see
 * engines/restrictedCustomers).
 */
export function useRestrictedCustomers() {
  const personaId = usePersonaStore((s) => s.activePersonaId);
  const [customers, setCustomers] = useState<SegmentRow[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    void mockDataEngine.list<SegmentRow>('customers').then((all) => {
      if (!cancelled) setCustomers(all);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return useMemo(() => buildRestrictedIndex(customers, (segment) => canViewCustomerSegment(personaId, segment)), [customers, personaId]);
}

import { useEffect, useMemo, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { planSelectionOf } from '../../components/patterns/postpaidPlanModel';
import type { PostpaidPlan } from '../../components/patterns/postpaidPlanModel';

/**
 * The postpaid plan the add-ons are for, read from the catalogue by its id, and where it came from (an Offer is pre-bundled, a plan takes optional extras).
 * Add-Ons reads the plan itself rather than being handed it by the plan page: the plan page and the Addons page are two capabilities, and the only thing
 * between them is the plan's id. Any postpaid plan is found, listed or not, so a line already on a plan the plan lists do not offer (a Family Plan, an old
 * plan) still gets its add-ons.
 */
export function useSelectedPostpaidPlan(planId: string | undefined) {
  const [plans, setPlans] = useState<PostpaidPlan[]>([]);
  useEffect(() => {
    void mockDataEngine.list<PostpaidPlan>('products').then((all) => setPlans(all.filter((p) => p.type === 'Postpaid Plan')));
  }, []);
  const selectedPlan = useMemo(() => (planId ? plans.find((p) => p.productId === planId) : undefined), [plans, planId]);
  const selection = useMemo(() => planSelectionOf(selectedPlan), [selectedPlan]);
  return { selectedPlan, preBundled: selection.preBundled, selectionSource: selection.source };
}

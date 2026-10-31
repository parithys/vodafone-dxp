import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { benefitsFor, type CustomerBenefit } from '../../engines/customerBenefitEngine';
import type { CustomerRecord } from '../../engines/customer360Engine';
import { useCustomerContext } from '../../stores/customerContextStore';

/**
 * The benefits (retired, MADA, B2B2C, loyalty, prepaid-welcome) the journey's customer holds, for choosing which
 * discounts to offer. Reads the shared customer context Customer 360 set; if that holds a different customer, or
 * was saved before benefits were recorded on it, the customer's own record is loaded instead - never another
 * customer's data. `undefined` while loading or when no customer is known (nothing is filtered then).
 */
export function useCustomerBenefits(customerId: string | undefined): CustomerBenefit[] | undefined {
  const active = useCustomerContext((s) => s.customer);
  const fromContext = customerId && active?.customerId === customerId && active.benefitEligibility !== undefined ? benefitsFor(active) : undefined;
  const [loaded, setLoaded] = useState<{ id: string; benefits: CustomerBenefit[] } | undefined>();

  useEffect(() => {
    if (!customerId || fromContext) return;
    let cancelled = false;
    void mockDataEngine.list<CustomerRecord>('customers').then((all) => {
      if (!cancelled) setLoaded({ id: customerId, benefits: benefitsFor(all.find((c) => c.customerId === customerId)) });
    });
    return () => {
      cancelled = true;
    };
  }, [customerId, fromContext]);

  if (!customerId) return undefined;
  if (fromContext) return fromContext;
  return loaded?.id === customerId ? loaded.benefits : undefined;
}

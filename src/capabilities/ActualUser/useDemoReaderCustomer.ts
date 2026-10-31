import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { pickDemoReaderCustomer } from './actualUserModel';

/**
 * The demo has no card reader: the simulated one presents some customer's own document. For the primary customer that is the one on screen; for the
 * actual user it must be SOMEONE ELSE who qualifies, so the two never share details. Chosen by rule, not by name: the first customer aged 18 or over, other
 * than the primary, holding an unexpired QID with a real QID number (11-14 digits). Undefined until the data loads, or when nobody qualifies.
 */
export function useDemoReaderCustomer(primaryCustomerId: string | undefined, asOf: Date = new Date()): string | undefined {
  const [id, setId] = useState<string | undefined>();
  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      mockDataEngine.list<{ customerId: string; dob?: string }>('customers'),
      mockDataEngine.list<{ customerId: string; documentType: string; documentNumber: string; expiryDate?: string }>('identity-documents'),
    ]).then(([customers, docs]) => {
      if (cancelled) return;
      const hit = pickDemoReaderCustomer(customers, docs, primaryCustomerId, asOf);
      setId(hit);
    });
    return () => {
      cancelled = true;
    };
  }, [primaryCustomerId, asOf]);
  return id;
}

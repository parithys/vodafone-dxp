import { useEffect, useState } from 'react';
import * as mockDataEngine from '../engines/mockDataEngine';

/**
 * Area / District suggestions for an address form. kid-address-records and qatar-areas carry Qatari area names; addresses.json
 * has a `city` (always "Doha"), which is also offered so a value prefilled from a saved address is selectable. Sorted, no
 * duplicates.
 */
export function useAreaOptions(): string[] {
  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    Promise.all([
      mockDataEngine.list<{ area?: string }>('kid-address-records'),
      mockDataEngine.list<{ city?: string }>('addresses'),
      mockDataEngine.list<{ area?: string }>('qatar-areas'),
    ]).then(([kid, addr, areas]) => {
      const names = [...kid.map((k) => k.area), ...addr.map((a) => a.city), ...areas.map((a) => a.area)].filter(
        (n): n is string => Boolean(n && n.trim())
      );
      setOptions([...new Set(names)].sort());
    });
  }, []);
  return options;
}

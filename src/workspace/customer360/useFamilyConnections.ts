import { useEffect, useMemo } from 'react';
import { connectionOptions, lineCatalogueOf, primaryLine1Activated } from '../../engines/familyPackage';
import type { ConnectionOption, FamilyLine, FamilyOrder } from '../../engines/familyPackage';
import { useEntityStore } from '../../stores/entityStore';

/**
 * What Add Another Connection can do for a customer's Family Package right now, from the records on file (the same rule as the dialog and the journey):
 * whether they hold a package at all, whether Primary Line 1 is approved, and the connection types that can be added. Read again each time the menu mounts.
 */
export function useFamilyConnections(customerId: string | undefined): { hasPackage: boolean; activated: boolean; options: ConnectionOption[] } {
  const records = useEntityStore((s) => s.records);
  const loadKind = useEntityStore((s) => s.loadKind);
  useEffect(() => {
    if (!customerId) return;
    for (const kind of ['family-package-lines', 'orders', 'products'] as const) void loadKind(kind, true);
  }, [customerId, loadKind]);
  return useMemo(() => {
    const lines = ((records['family-package-lines'] ?? []) as unknown as FamilyLine[]).filter((l) => l.customerId === customerId);
    const orders = (records.orders ?? []) as unknown as FamilyOrder[];
    const products = (records.products ?? []) as unknown as { productId: string; planClass?: string }[];
    return { hasPackage: lines.length > 0, activated: primaryLine1Activated(lines, orders), options: connectionOptions(lines, orders, lineCatalogueOf(products)) };
  }, [records, customerId]);
}

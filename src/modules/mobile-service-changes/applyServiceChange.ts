import * as mockDataEngine from '../../engines/mockDataEngine';
import type { useEntityStore } from '../../stores/entityStore';

type EntityStore = ReturnType<typeof useEntityStore.getState>;

// What a completed plan or pack change does to the line: it is now on the new plan. One function for both moments an order completes - at submit when
// nothing needs approval, and when an approver approves a held order - so the line ends up the same either way.

/** The order types that move a line to another plan or pack. An add-on leaves the plan as it is. */
export const LINE_CHANGING_ORDER_TYPES: readonly string[] = ['Plan Change', 'Prepaid Pack Change'];

export interface LineChangeOrder {
  orderType?: unknown;
  installedAssetId?: unknown;
  productId?: unknown;
}

/** Whether the order is one that changes a line's plan, and says which line and which plan. */
export const lineChangeOf = (o: LineChangeOrder): { installedAssetId: string; productId: string } | undefined =>
  typeof o.orderType === 'string' && LINE_CHANGING_ORDER_TYPES.includes(o.orderType) && typeof o.installedAssetId === 'string' && typeof o.productId === 'string'
    ? { installedAssetId: o.installedAssetId, productId: o.productId }
    : undefined;

/** Moves the line to the plan: its service name is the plan's (so it is classified as that kind of line), its code and its price. Returns whether a line was changed. */
export async function applyLineChange(
  change: { installedAssetId: string; productId: string },
  updateRecord: EntityStore['updateRecord']
): Promise<boolean> {
  const plan = (await mockDataEngine.list<{ productId: string; name: string; type: string; mrcQAR?: number; starterPackChargeQAR?: number }>('products')).find((p) => p.productId === change.productId);
  if (!plan) return false;
  await updateRecord('installed-assets', 'installedAssetId', change.installedAssetId, {
    productServiceName: plan.name,
    promotion: plan.productId,
    price: plan.type === 'Prepaid Plan' ? (plan.starterPackChargeQAR ?? 0) : (plan.mrcQAR ?? 0),
  });
  return true;
}

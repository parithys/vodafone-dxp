import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';

/** Whether the catalogue holds an add-on for the pack (a "Paid Add-on" record on that pack). */
export const packHasAddons = (rows: readonly { category: string; planId: string }[], packId: string): boolean => rows.some((r) => r.category === 'Paid Add-on' && r.planId === packId);

/** The ids of the pack's mandatory products (a "Paid Add-on" record on the pack marked `isMandatory`): always on the order, so choosing the pack selects them. */
export const mandatoryAddonIds = (rows: readonly { category: string; planId: string; addonDiscountId: string; isMandatory?: boolean }[], packId: string): string[] =>
  rows.filter((r) => r.category === 'Paid Add-on' && r.planId === packId && r.isMandatory === true).map((r) => r.addonDiscountId);

/** Reads the catalogue for the pack's mandatory product ids (empty when the pack has none). */
export const loadMandatoryAddonIds = (packId: string): Promise<string[]> =>
  mockDataEngine.list<{ category: string; planId: string; addonDiscountId: string; isMandatory?: boolean }>('addons-discounts').then((rows) => mandatoryAddonIds(rows, packId));

/**
 * Whether a prepaid pack has any add-on to offer (the same records the Addons page lists), so the pack page offers "Customise Add-ons" only when there is something to
 * customise. False until it is known and for no pack: unknown stays unknown, so no button is shown on a guess.
 */
export function usePackHasAddons(packId: string | undefined): boolean {
  const [found, setFound] = useState<{ packId: string; has: boolean } | undefined>();
  useEffect(() => {
    if (!packId) return;
    let live = true;
    void mockDataEngine.list<{ category: string; planId: string }>('addons-discounts').then((rows) => {
      if (live) setFound({ packId, has: packHasAddons(rows, packId) });
    });
    return () => {
      live = false;
    };
  }, [packId]);
  return Boolean(found && found.packId === packId && found.has);
}

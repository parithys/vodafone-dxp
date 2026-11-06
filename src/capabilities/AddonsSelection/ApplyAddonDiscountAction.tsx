import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import { DiscountCard } from '../../components/patterns/DiscountCard';
import { discountsForAddon, type AddonDiscount, type AppliedAddonDiscounts } from '../../engines/addonDiscounts';
import type { CategorisedAddon } from '../../engines/addonCategories';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { formatQar } from '../../lib/format';

type SelectedAddon = CategorisedAddon & { productId: string; name: string; description?: string; type: string };

/**
 * "Apply Discount", beside Continue on the postpaid Add-ons page - the add-on counterpart of the plan page's Edit Discount. Opens, for each SELECTED add-on that has discounts it
 * is eligible for (the record names it; a free add-on has none), the choice of one of them or No Discount. Written to the journey (`addonDiscounts`) only on Apply, so Cancel leaves
 * the choices as they were. No supporting document is asked for. With no selected add-on that can be discounted there is no button.
 */
export function ApplyAddonDiscountAction({ selectedIds, applied, onApply }: { selectedIds: string[]; applied: AppliedAddonDiscounts; onApply: (next: AppliedAddonDiscounts) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AppliedAddonDiscounts>(applied);
  const [addons, setAddons] = useState<SelectedAddon[]>([]);
  const [discounts, setDiscounts] = useState<AddonDiscount[]>([]);
  useEffect(() => {
    void mockDataEngine.list<SelectedAddon>('products').then((all) => setAddons(all.filter((p) => p.type === 'Add-on')));
    void mockDataEngine.list<AddonDiscount>('addon-discounts').then(setDiscounts);
  }, []);
  const eligible = selectedIds
    .map((id) => addons.find((a) => a.productId === id))
    .filter((a): a is SelectedAddon => Boolean(a))
    .map((a) => ({ addon: a, options: discountsForAddon(discounts, a) }))
    .filter((e) => e.options.length > 0);
  if (eligible.length === 0) return null;
  const amountOff = (addon: SelectedAddon, d: AddonDiscount) => formatQar(Math.round(addon.mrcQAR * d.percent) / 100);
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setDraft(applied);
          setOpen(true);
        }}
      >
        Apply Discount
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Apply Discount"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Only the add-ons still selected keep a discount.
                onApply(Object.fromEntries(Object.entries(draft).filter(([id]) => selectedIds.includes(id))));
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </>
        }
      >
        <div className="stack gap-6">
          {eligible.map(({ addon, options }) => (
            <section key={addon.productId} aria-label={addon.description ?? addon.name} className="stack">
              <h3 className="title title-md font-semibold">{addon.description ?? addon.name}</h3>
              <DiscountCard
                title="No Discount"
                description="Continue without a discount"
                value="-"
                selected={!draft[addon.productId]}
                onToggle={() => setDraft(Object.fromEntries(Object.entries(draft).filter(([id]) => id !== addon.productId)))}
              />
              {options.map((d) => (
                <DiscountCard
                  key={d.addonDiscountId}
                  title={d.name}
                  description={d.description}
                  value={`-${amountOff(addon, d)}`}
                  selected={draft[addon.productId] === d.addonDiscountId}
                  onToggle={() => setDraft({ ...draft, [addon.productId]: d.addonDiscountId })}
                />
              ))}
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}

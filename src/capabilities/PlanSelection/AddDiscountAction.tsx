import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import { DiscountCard } from '../../components/patterns/DiscountCard';
import { SPECIAL_DISCOUNT_ADDON_TYPES, SPECIAL_DISCOUNT_CARD_TITLE, discountDescription, discountsAscending, discountsForSpecialType, type Discount } from '../../components/patterns/postpaidPlanModel';
import { discountsForCustomer, type CustomerBenefit } from '../../engines/customerBenefitEngine';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { formatQar } from '../../lib/format';

/** The plan tabs a discount can be added from: the plans listed under Standard Plans, the BAU catalogue and Special Offers. An Offers plan is pre-bundled. */
export const ADD_DISCOUNT_TABS: ReadonlySet<string> = new Set(['for-you', 'standard', 'special']);
/** The tab a plan was chosen from; a plan chosen with no tab recorded (a resumed draft, a search pick) is a Standard Plan - only an Offers plan is known to be pre-bundled. */
const tabOf = (tab: string | undefined) => tab ?? 'for-you';

/**
 * "Edit Discount", beside Continue once a plan is chosen on Standard Plans or Special Offers. Opens the discounts the customer can have on THAT plan:
 * the Special Discount they hold (already selected by the plan step) on Special Offers, and - on Standard Plans - the plan's ordinary discounts
 * (Loyalty, ...) with "No Discount" selected until the agent chooses one. Reads the same catalogue and the same customer rules as the Eligible
 * Discounts panel, and writes the same `discountId`.
 */
export function AddDiscountAction({
  productId,
  tab,
  discountId,
  onSelectDiscount,
  customerBenefits,
  specialDiscountType,
  customerBenefit,
  planAmount,
}: {
  productId: string | undefined;
  tab: string | undefined;
  discountId: string | undefined;
  onSelectDiscount: (id: string | undefined) => void;
  customerBenefits: CustomerBenefit[] | undefined;
  specialDiscountType: 'mada' | 'b2b2c' | 'retired' | 'none' | undefined;
  customerBenefit: string | undefined;
  /** The chosen plan's monthly amount (QAR): each discount shows what it takes off this amount, not just its percentage. */
  planAmount?: number;
}) {
  const [open, setOpen] = useState(false);
  // The choice made in the popup: written to the journey only on Apply, so Cancel (or closing it) leaves the chosen discount as it was.
  const [draft, setDraft] = useState<string | undefined>(discountId);
  const [all, setAll] = useState<Discount[]>([]);
  useEffect(() => {
    void mockDataEngine.list<Discount & { category?: string }>('addons-discounts').then((rows) => setAll(rows.filter((d) => d.category === 'Discount')));
  }, []);
  const planTab = tabOf(tab);
  if (!productId || !ADD_DISCOUNT_TABS.has(planTab)) return null;
  const forPlan = all.filter((d) => d.planId === productId);
  const offered = discountsForSpecialType(discountsForCustomer(forPlan, customerBenefits, customerBenefit && customerBenefit !== 'none' ? customerBenefit : undefined), specialDiscountType);
  // Special Offers: the Special Discount is the point of the tab. Standard Plans: the ordinary discounts only - a Special Discount belongs to Special Offers.
  const options = offered.filter((d) => (planTab === 'special' ? true : !SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType)));
  // Nothing to add: no button.
  if (options.length === 0) return null;
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setDraft(discountId);
          setOpen(true);
        }}
      >
        Edit Discount
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Discount"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onSelectDiscount(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </>
        }
      >
        {(
          <div className="flex flex-col gap-3">
            <DiscountCard title="No Discount" description="Continue without a discount" value="-" selected={!draft} onToggle={() => setDraft(undefined)} />
            {discountsAscending(options).map((d) => (
              <DiscountCard
                key={d.addonDiscountId}
                title={SPECIAL_DISCOUNT_ADDON_TYPES.has(d.addonType) ? SPECIAL_DISCOUNT_CARD_TITLE : d.name}
                description={discountDescription(d)}
                value={planAmount === undefined ? `${Math.round(Math.abs(d.price) * 100)}%` : formatQar(Math.round(planAmount * Math.abs(d.price) * 100) / 100)}
                selected={draft === d.addonDiscountId}
                onToggle={() => setDraft(d.addonDiscountId)}
              />
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

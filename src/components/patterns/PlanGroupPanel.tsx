import { SPECIAL_DISCOUNT_RATE, specialOfferPlanName, type PostpaidPlan, type PlanGroupKey, type TabKey } from './postpaidPlanModel';
import { PostpaidPlanCard } from './PostpaidPlanCard';

interface PlanGroupPanelProps {
  groupPlans: (key: PlanGroupKey) => PostpaidPlan[];
  activeTab: TabKey;
  selectedProductId: string | undefined;
  billLimit: number | undefined;
  onSelectProduct: (productId: string) => void;
  onDeselectProduct?: () => void;
  setDetailPlan: (plan: PostpaidPlan) => void;
  /** The customer's validated Special Discount: names the plans on the Special Offers tab. */
  specialDiscountType?: 'mada' | 'b2b2c' | 'retired' | 'none';
  /** The chosen plan's applied discount as a fraction (0.25 = 25%): its card shows the discounted price. */
  discountPct?: number;
}

export function PlanGroupPanel({
  groupPlans,
  activeTab,
  selectedProductId,
  billLimit,
  onSelectProduct,
  onDeselectProduct,
  setDetailPlan,
  specialDiscountType,
  discountPct = 0,
}: PlanGroupPanelProps) {
  return (
    <div className="space-y-3">
      {groupPlans(activeTab as PlanGroupKey).length === 0 ? (
        <p className="text-muted text-[length:var(--fs-body)]">No plans match that search or filter.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] gap-4">
        {groupPlans(activeTab as PlanGroupKey).map((p) => (
          <PostpaidPlanCard
            key={p.productId}
            p={p}
            selectedProductId={selectedProductId}
            billLimit={billLimit}
            onSelectProduct={onSelectProduct}
            onDeselectProduct={onDeselectProduct}
            setDetailPlan={setDetailPlan}
            compact={activeTab === 'specials'}
            // Special Offers are the plans the customer's Special Discount applies to: every card, the chosen one included, shows the discounted price from the
            // start. (The chosen plan's discount is picked a moment after the click, once its discounts load; following it would add the struck-through line then and
            // make the card jump.) Other tabs show a discount only on the chosen plan.
            discountPct={activeTab === 'special' ? SPECIAL_DISCOUNT_RATE : p.productId === selectedProductId ? discountPct : 0}
            displayName={activeTab === 'special' ? specialOfferPlanName(p.name, specialDiscountType) : undefined}
          />
        ))}
        </div>
      )}
    </div>
  );
}

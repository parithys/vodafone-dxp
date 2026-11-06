import { useState } from 'react';
import { PlanDetailsDrawer } from '../../components/patterns/PlanDetailsDrawer';
import { PostpaidPlanCard } from '../../components/patterns/PostpaidPlanCard';
import { SECONDARY_PLAN_TYPE_TAG } from '../../components/patterns/postpaidPlanModel';
import type { PostpaidPlan } from '../../components/patterns/postpaidPlanModel';

/**
 * The plans an additional Family connection can be on, as the same plan cards the rest of Offers & Plans uses (with View details): the agent picks the one the customer
 * needs, and the line's type follows from it (the engine derives it - nothing here says Supplementary or Secondary). Which plans are listed is the package's remaining
 * entitlement (engines/familyPackage.ts, eligibleAdditionalPlans); the name, price and benefits are the catalogue's, never written here.
 */
export function AdditionalPlanPicker({ plans, selectedProductId, onSelect, onDeselect }: { plans: PostpaidPlan[]; selectedProductId: string | undefined; onSelect: (productId: string) => void; onDeselect: () => void }) {
  const [detail, setDetail] = useState<PostpaidPlan | null>(null);
  return (
    <div className="stack gap-4">
      <h3 className="title title-lg">Select The Plan For This Connection</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] gap-4">
        {plans.map((p) => (
          <PostpaidPlanCard key={p.productId} p={p} tagType={SECONDARY_PLAN_TYPE_TAG[(p as { secondaryPlanType?: keyof typeof SECONDARY_PLAN_TYPE_TAG }).secondaryPlanType as keyof typeof SECONDARY_PLAN_TYPE_TAG]} selectedProductId={selectedProductId} billLimit={undefined} onSelectProduct={onSelect} onDeselectProduct={onDeselect} setDetailPlan={setDetail} />
        ))}
      </div>
      <PlanDetailsDrawer detailPlan={detail} onClose={() => setDetail(null)} selectedProductId={selectedProductId} onSelectProduct={onSelect} />
    </div>
  );
}

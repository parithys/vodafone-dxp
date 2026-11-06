import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { PrepaidPlanCard } from './PrepaidPlanCard';
import { PrepaidPackDetailsDrawer } from './PrepaidPackDetailsDrawer';
import { offeredPrepaidPacks } from './prepaidPlanModel';
import type { PrepaidPlan } from './prepaidPlanModel';


interface PrepaidPlanStepProps {
  /** The customer's segment, from eligibility. Packs restricted to other segments are not offered. A new customer with none on record is treated as Consumer. */
  segment?: string;
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
  /** Clicking the selected card again unselects it. Omitted, the selection can only be changed, not cleared. */
  onDeselectProduct?: () => void;
  /** A pack not offered: the line's current pack, when the journey changes it. */
  hiddenProductId?: string;
  /** Only packs that carry a bundle: the SIM-only option (no data, no validity) is not offered, as when changing the pack of a line that already has its SIM. */
  packsOnly?: boolean;
  /** The "Prepaid Packs" title above the grid. Off when the step itself is already titled for the packs (it would only repeat the step heading). */
  showTitle?: boolean;
}

// MPRA_001_QPC_01-02 (prepaid plan selection) - the prepaid counterpart of PostpaidPlanStep: the packs to choose from, filtered by the customer's segment (QPC_02).
// The pack's add-ons and discounts (QPC_01, QPC_03) are the Add-Ons capability's page, the step after this one (PrepaidAddonsStep).
export function PrepaidPlanStep({ hiddenProductId, packsOnly, showTitle = true, selectedProductId, onSelectProduct, onDeselectProduct, segment }: PrepaidPlanStepProps) {
  const [plans, setPlans] = useState<PrepaidPlan[]>([]);
  const [detailPack, setDetailPack] = useState<PrepaidPlan | null>(null);

  useEffect(() => {
    mockDataEngine.list<PrepaidPlan>('products').then((all) => setPlans(offeredPrepaidPacks(all, { segment, hiddenProductId, packsOnly })));
  }, [segment, hiddenProductId, packsOnly]);

  const packGrid = (
    <div className="space-y-3">
      {plans.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
          {plans.map((p) => (
            <PrepaidPlanCard
              key={p.productId}
              p={p}
              selectedProductId={selectedProductId}
              onSelectProduct={onSelectProduct}
              onDeselectProduct={onDeselectProduct}
              setDetailPack={setDetailPack}
            />
          ))}
        </div>
      )}
      {plans.length === 0 && <p className="text-muted">No Prepaid Plan products are available right now.</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        {showTitle && <h3 className="title title-md font-semibold">Prepaid Packs</h3>}
        <p className="caption-muted">Select a starter pack. For a SIM without a bundle, choose New Prepaid Standard SIM.</p>
      </div>
      {packGrid}
      <PrepaidPackDetailsDrawer pack={detailPack} onClose={() => setDetailPack(null)} selectedProductId={selectedProductId} onSelectProduct={onSelectProduct} />
    </div>
  );
}

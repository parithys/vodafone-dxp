import { CARD_SELECTED, SelectedTick, CARD_IDLE, SelectedCardTexture, SelectedPlanFigure } from '../primitives/offerCardParts';
import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { PrepaidPlanCard } from './PrepaidPlanCard';
import { PrepaidPackDetailsDrawer } from './PrepaidPackDetailsDrawer';
import type { PrepaidPlan } from './prepaidPlanModel';
import { Checkbox } from '../primitives/Checkbox';
import { Icon } from '../primitives/Icon';
import { formatQar, formatQarAny, formatAmount } from '../../lib/format';
import { CHECK } from '../../assets/icons';


interface Discount {
  addonDiscountId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  planId: string;
}

interface PrepaidPlanStepProps {
  /** 'plan' (default): the packs to choose from. 'extras': the chosen pack, its eligible discounts and optional add-ons, and the
   * starter pack charge - the step after the pack, like the postpaid Add-ons step. */
  mode?: 'plan' | 'extras';
  /** The customer's segment, from eligibility. Packs restricted to other segments are not offered. A new customer with none on record is treated as Consumer. */
  segment?: string;
  /** The add-ons chosen for this pack (optional) and the change handler. Omitted, the add-ons section is not shown. */
  addonIds?: string[];
  onSelectAddons?: (ids: string[]) => void;
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
  /** Clicking the selected card again unselects it. Omitted, the selection can only be changed, not cleared. */
  onDeselectProduct?: () => void;
  discountId: string | undefined;
  onSelectDiscount: (discountId: string | undefined) => void;
  /** A pack not offered: the line's current pack, when the journey changes it. */
  hiddenProductId?: string;
  /** Only packs that carry a bundle: the SIM-only option (no data, no validity) is not offered, as when changing the pack of a line that already has its SIM. */
  packsOnly?: boolean;
  /** The "Prepaid Packs" title above the grid. Off when the step itself is already titled for the packs (it would only repeat the step heading). */
  showTitle?: boolean;
}

// MPRA_001_QPC_01-03 (prepaid plan/add-on selection, special discount) - the prepaid counterpart of
// PostpaidPlanAddonsStep. Packs are filtered by the customer's segment (QPC_02), the agent may add the pack's
// optional add-ons, and may pick a prepaid-specific discount for the chosen pack (QPC_03). No Bill Limit here:
// BR-002/BR-005 exclude credit limit and bill cycle from Prepaid Activation.
export function PrepaidPlanStep({ mode = 'plan', hiddenProductId, packsOnly, showTitle = true, selectedProductId, onSelectProduct, onDeselectProduct, discountId, onSelectDiscount, segment, addonIds = [], onSelectAddons }: PrepaidPlanStepProps) {
  const [plans, setPlans] = useState<PrepaidPlan[]>([]);
  const [detailPack, setDetailPack] = useState<PrepaidPlan | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [addons, setAddons] = useState<Discount[]>([]);
  const customerSegment = segment ?? 'Consumer';

  useEffect(() => {
    mockDataEngine.list<PrepaidPlan>('products').then((all) => {
      setPlans(
        all
          .filter((p) => p.type === 'Prepaid Plan' && p.productId !== hiddenProductId && (!packsOnly || (p.dataAllowanceGB != null || p.packValidityDays != null)) && (!p.eligibleSegments || p.eligibleSegments.includes(customerSegment)))
          .sort((a, b) => a.starterPackChargeQAR - b.starterPackChargeQAR)
          // The Popular pack is listed first, as on every postpaid tab; the rest stay in starter-pack-charge order.
          .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
      );
    });
  }, [customerSegment, hiddenProductId, packsOnly]);

  useEffect(() => {
    if (!selectedProductId) {
      setDiscounts([]);
      setAddons([]);
      return;
    }
    mockDataEngine.list<Discount>('addons-discounts').then((all) => {
      setDiscounts(all.filter((d) => d.category === 'Discount' && d.planId === selectedProductId));
      setAddons(all.filter((d) => d.category === 'Paid Add-on' && d.planId === selectedProductId));
    });
  }, [selectedProductId]);

  const selectedPlan = plans.find((p) => p.productId === selectedProductId);
  const selectedDiscount = discounts.find((d) => d.addonDiscountId === discountId);
  const chosenAddons = addons.filter((a) => addonIds.includes(a.addonDiscountId));
  const netStarterPack = selectedPlan ? Math.round(selectedPlan.starterPackChargeQAR * (1 + (selectedDiscount?.price ?? 0))) : undefined;

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

  if (mode === 'plan') {
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

  return (
    <div className="space-y-6">
      {/* The step's own heading ("Add-ons") is already shown by the wizard above; only the description is added here. */}
      {/* Pulled up under the wizard's heading (its 16px gap is too loose for a one-line description) and closer to the pack below. */}
      <p className="text-secondary -mt-3 mb-4">Personalise the pack with optional services and discounts.</p>
      {!selectedPlan ? (
        <p className="muted-body">Select a pack first - its discounts and add-ons appear here.</p>
      ) : (
        <>
          <section aria-label="Selected pack" className="space-y-4">
            <div className="split-top flex-wrap gap-4">
              <div className="min-w-0 space-y-2">
                <h3 className="title title-xl leading-snug">{selectedPlan.name}</h3>
                <span className="tag-promo">
                  Selected Pack
                </span>
              </div>
              <SelectedPlanFigure label="Starter Pack">
                <span className="text-[length:var(--fs-body)]">QAR </span>
                <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(selectedPlan.starterPackChargeQAR)}</span>
              </SelectedPlanFigure>
            </div>
            {/* Benefits and the optional add-ons share one row. */}
            <div className={`grid-roomy ${onSelectAddons && addons.length > 0 ? 'sm:grid-cols-2' : ''}`}>
              <div>
                <p className="text-accent caps-label mb-2.5">Benefits</p>
                <ul className="space-y-2">
                  {[
                    selectedPlan.dataAllowanceGB ? `${selectedPlan.dataAllowanceGB} GB data` : 'No data bundle',
                    selectedPlan.minutesAllowance,
                    selectedPlan.packValidityDays ? `Valid for ${selectedPlan.packValidityDays} days` : 'No validity period',
                  ].map((f) => (
                    <li key={f} className="row-start gap-2.5 body-text">
                      <Icon path={CHECK} className="icon-sm text-accent mt-1" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {onSelectAddons && addons.length > 0 && (
            <section aria-labelledby="prepaid-addons" className="space-y-2">
              <h3 id="prepaid-addons" className="title title-md font-semibold">
                Add-ons <span className="caption-muted font-normal">(optional)</span>
              </h3>
              {addons.map((a) => {
                const checked = addonIds.includes(a.addonDiscountId);
                return (
                  <label
                    key={a.addonDiscountId}
                    className={`split-nowrap card-frame p-3 cursor-pointer ${checked ? CARD_SELECTED : CARD_IDLE}`}
                  >
                    <span className="row">
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          onSelectAddons(e.target.checked ? [...addonIds, a.addonDiscountId] : addonIds.filter((id) => id !== a.addonDiscountId))
                        }
                      />
                      <span>
                        <span className="text-fg">{a.name}</span>
                        <span className="block caption-muted">{a.description}</span>
                      </span>
                    </span>
                    <span className="text-fg font-medium shrink-0">{formatQarAny(a.price)}</span>
                  </label>
                );
              })}
            </section>
              )}
            </div>
          </section>

          <section aria-label="Eligible discounts" className="section-rule">
            <h3 className="title title-md font-semibold">Eligible Discounts</h3>
            {/* One choice, shown as selectable cards with a tick mark (like the number cards), not radio buttons. */}
            <div role="radiogroup" aria-label="Eligible discounts" className="grid-2-up-sm">
              {[
                { id: undefined as string | undefined, title: 'No Discount', detail: 'Continue without a discount', value: <span className="text-muted">-</span> },
                ...discounts.map((d) => ({
                  id: d.addonDiscountId as string | undefined,
                  title: d.name,
                  detail: d.description,
                  value: <span className="text-success font-medium">{Math.round(d.price * 100)}%</span>,
                })),
              ].map((o) => {
                const on = (discountId ?? undefined) === o.id;
                return (
                  <button
                    key={o.id ?? 'none'}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onSelectDiscount(o.id)}
                    className={`option-card option-card-tight pad-panel ${
                      on ? CARD_SELECTED : CARD_IDLE
                    }`}
                  >
                    {on && <SelectedCardTexture />}
                    {on && <SelectedTick />}
                    <span className="flex items-baseline gap-2">
                      <span className="title title-sm font-semibold">{o.title}</span>
                      {o.value}
                    </span>
                    <span className="caption-muted">{o.detail}</span>
                  </button>
                );
              })}
            </div>
            {discounts.length === 0 && <p className="caption-muted">No discounts configured for this pack.</p>}
          </section>
        </>
      )}

      {selectedPlan && (
        // The running total, as the postpaid Monthly summary: a dark panel (fixed navy, white text in both themes) with the
        // charges listed at the left and the total at the right. Number and SIM charges join it at checkout.
        <div className="summary-banner split-top flex-wrap gap-4">
          <table className="w-[min(32rem,100%)] text-[length:var(--fs-caption)]">
            <caption className="table-head-faint">Pack summary</caption>
            <tbody className="divide-y divide-[var(--divider-on-dark)]">
              {[
                [selectedPlan.name, `${formatQar(selectedPlan.starterPackChargeQAR)}`],
                ...(selectedDiscount
                  ? [[`${selectedDiscount.name} (${Math.round(Math.abs(selectedDiscount.price) * 100)}%) · Added`, `-${formatQar(selectedPlan.starterPackChargeQAR - (netStarterPack ?? 0))}`]]
                  : []),
                ...chosenAddons.map((a) => [`${a.name} · Added`, `${formatQar(a.price)}`]),
              ].map(([label, value]) => (
                <tr key={label}>
                  <th scope="row" className="table-cell-faint">
                    {label}
                  </th>
                  <td className="font-semibold text-right py-1.5">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right pt-3">
            <p className="opacity-80 text-[length:var(--fs-caption)]">Pack Total</p>
            <p className="font-bold text-[length:var(--fs-h3)] leading-tight">{formatQarAny((netStarterPack ?? 0) + chosenAddons.reduce((t, a) => t + a.price, 0))}</p>
          </div>
        </div>
      )}
    </div>
  );
}

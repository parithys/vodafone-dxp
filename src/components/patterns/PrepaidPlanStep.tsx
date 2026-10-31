import { CARD_SELECTED, SelectedTick, CARD_IDLE, SelectedCardTexture, SelectedPlanFigure } from '../primitives/offerCardParts';
import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { PrepaidPlanCard } from './PrepaidPlanCard';
import { PrepaidPackDetailsDrawer } from './PrepaidPackDetailsDrawer';
import type { PrepaidPlan } from './prepaidPlanModel';
import { Checkbox } from '../primitives/Checkbox';
import { Icon } from '../primitives/Icon';
import { formatQar, formatQarAny, formatAmount } from '../../lib/format';

const CHECK = 'M20 6L9 17l-5-5';

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
          {showTitle && <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Prepaid Packs</h3>}
          <p className="text-muted text-[length:var(--fs-caption)]">Select a starter pack. For a SIM without a bundle, choose New Prepaid Standard SIM.</p>
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
      <p className="text-fg-2 text-[length:var(--fs-body)] -mt-3 mb-4">Personalise the pack with optional services and discounts.</p>
      {!selectedPlan ? (
        <p className="text-muted text-[length:var(--fs-body)]">Select a pack first - its discounts and add-ons appear here.</p>
      ) : (
        <>
          <section aria-label="Selected pack" className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <h3 className="text-fg font-bold text-[length:var(--fs-h4)] leading-snug">{selectedPlan.name}</h3>
                <span className="inline-flex rounded-[var(--radius-pill)] bg-[var(--tint-pink-bg)] px-2.5 py-0.5 text-[var(--tint-pink-fg)] text-[length:var(--fs-tag)] font-semibold uppercase tracking-wide">
                  Selected Pack
                </span>
              </div>
              <SelectedPlanFigure label="Starter Pack">
                <span className="text-[length:var(--fs-body)]">QAR </span>
                <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(selectedPlan.starterPackChargeQAR)}</span>
              </SelectedPlanFigure>
            </div>
            {/* Benefits and the optional add-ons share one row. */}
            <div className={`grid gap-x-8 gap-y-5 ${onSelectAddons && addons.length > 0 ? 'sm:grid-cols-2' : ''}`}>
              <div>
                <p className="text-accent font-bold text-[length:var(--fs-caption)] uppercase tracking-wide mb-2.5">Benefits</p>
                <ul className="space-y-2">
                  {[
                    selectedPlan.dataAllowanceGB ? `${selectedPlan.dataAllowanceGB} GB data` : 'No data bundle',
                    selectedPlan.minutesAllowance,
                    selectedPlan.packValidityDays ? `Valid for ${selectedPlan.packValidityDays} days` : 'No validity period',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-fg text-[length:var(--fs-body)]">
                      <Icon path={CHECK} className="w-4 h-4 shrink-0 text-accent mt-1" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {onSelectAddons && addons.length > 0 && (
            <section aria-labelledby="prepaid-addons" className="space-y-2">
              <h3 id="prepaid-addons" className="text-fg font-semibold text-[length:var(--fs-body-lg)]">
                Add-ons <span className="text-muted font-normal text-[length:var(--fs-caption)]">(optional)</span>
              </h3>
              {addons.map((a) => {
                const checked = addonIds.includes(a.addonDiscountId);
                return (
                  <label
                    key={a.addonDiscountId}
                    className={`flex items-center justify-between gap-3 rounded-[var(--radius-card)] border p-3 cursor-pointer ${checked ? CARD_SELECTED : CARD_IDLE}`}
                  >
                    <span className="flex items-center gap-3">
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          onSelectAddons(e.target.checked ? [...addonIds, a.addonDiscountId] : addonIds.filter((id) => id !== a.addonDiscountId))
                        }
                      />
                      <span>
                        <span className="text-fg">{a.name}</span>
                        <span className="block text-[length:var(--fs-caption)] text-muted">{a.description}</span>
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

          <section aria-label="Eligible discounts" className="space-y-3 border-t border-[var(--field-card-border)] pt-6">
            <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">Eligible Discounts</h3>
            {/* One choice, shown as selectable cards with a tick mark (like the number cards), not radio buttons. */}
            <div role="radiogroup" aria-label="Eligible discounts" className="grid gap-3 sm:grid-cols-2">
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
                    className={`relative isolate flex flex-col gap-1 rounded-[var(--radius-card)] border px-5 py-4 pr-14 text-left cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                      on ? CARD_SELECTED : CARD_IDLE
                    }`}
                  >
                    {on && <SelectedCardTexture />}
                    {on && <SelectedTick />}
                    <span className="flex items-baseline gap-2">
                      <span className="text-fg font-semibold text-[length:var(--fs-body)]">{o.title}</span>
                      {o.value}
                    </span>
                    <span className="text-[length:var(--fs-caption)] text-muted">{o.detail}</span>
                  </button>
                );
              })}
            </div>
            {discounts.length === 0 && <p className="text-muted text-[length:var(--fs-caption)]">No discounts configured for this pack.</p>}
          </section>
        </>
      )}

      {selectedPlan && (
        // The running total, as the postpaid Monthly summary: a dark panel (fixed navy, white text in both themes) with the
        // charges listed at the left and the total at the right. Number and SIM charges join it at checkout.
        <div className="rounded-[var(--radius-card-lg)] bg-[var(--summary-bg)] text-[var(--summary-fg)] p-6 flex items-start justify-between flex-wrap gap-4">
          <table className="w-[min(32rem,100%)] text-[length:var(--fs-caption)]">
            <caption className="opacity-70 text-[length:var(--fs-tag)] font-semibold uppercase tracking-wide text-left pb-2">Pack summary</caption>
            <tbody className="divide-y divide-[var(--divider-on-dark)]">
              {[
                [selectedPlan.name, `${formatQar(selectedPlan.starterPackChargeQAR)}`],
                ...(selectedDiscount
                  ? [[`${selectedDiscount.name} (${Math.round(Math.abs(selectedDiscount.price) * 100)}%) · Added`, `-${formatQar(selectedPlan.starterPackChargeQAR - (netStarterPack ?? 0))}`]]
                  : []),
                ...chosenAddons.map((a) => [`${a.name} · Added`, `${formatQar(a.price)}`]),
              ].map(([label, value]) => (
                <tr key={label}>
                  <th scope="row" className="opacity-80 font-normal text-left py-1.5 pr-4">
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

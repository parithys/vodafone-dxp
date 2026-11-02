import { useEffect, useMemo, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { simCardCharge } from '../../data/prepaidSimCharge';
import { formatQar } from '../../lib/format';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { EmptyState } from '../primitives/EmptyState';
import { SegmentedTabs } from '../primitives/SegmentedTabs';
import type { PricingRecharge } from './prepaidCartModel';
import { groupRecharges } from './rechargeSelectionModel';

/**
 * Choose the recharge for a prepaid subscription: the products by category, one selectable card each. Choosing the selected card again
 * clears it when `required` is false. Beside the cards it says what the choice does to the SIM card charge, which is judged on the recharge.
 */
export function RechargeSelectionStep({
  value,
  onChange,
  idType,
  required = false,
}: {
  value: string | undefined;
  onChange: (rechargeId: string | undefined) => void;
  /** The customer's ID type, for the SIM card charge note. */
  idType?: string;
  /** A recharge must be chosen (a journey / persona rule); when false the agent may go on without one. */
  required?: boolean;
}) {
  const [recharges, setRecharges] = useState<PricingRecharge[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void mockDataEngine.list<PricingRecharge>('recharge-products').then((rows) => {
      if (cancelled) return;
      setRecharges(rows);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => groupRecharges(recharges), [recharges]);
  const selected = recharges.find((r) => r.rechargeId === value);
  // The tab shown follows the chosen product when there is one, otherwise the first category.
  const shown = groups.find((g) => g.category === (category ?? selected?.category)) ?? groups[0];

  if (!loaded) return <p className="muted-body">Loading the recharge options…</p>;
  if (groups.length === 0) return <EmptyState compact message="No recharge options are available." />;

  const note = selected ? simCardCharge(idType, selected.amountQar) : undefined;
  const anySample = recharges.some((r) => r.sample);

  return (
    <div className="space-y-4">
      {anySample && (
        <p className="notice-warning-field px-3 py-2 text-[length:var(--fs-caption)]">
          Sample recharge options: the real catalogue has not been supplied yet.
        </p>
      )}
      <SegmentedTabs
        label="Recharge Category"
        items={groups.map((g) => ({ key: g.category, label: g.category, count: g.items.length }))}
        active={shown?.category}
        onChange={setCategory}
      />
      <div className="grid-2-up-sm lg:grid-cols-3" role="group" aria-label={`${shown?.category ?? ''} recharges`}>
        {shown?.items.map((r) => {
          const chosen = r.rechargeId === value;
          const pick = () => onChange(chosen && !required ? undefined : r.rechargeId);
          return (
            <div
              key={r.rechargeId}
              role="button"
              tabIndex={0}
              aria-pressed={chosen}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  pick();
                }
              }}
              className={`relative cursor-pointer card-option p-4 ${chosen ? CARD_SELECTED : CARD_IDLE}`}
            >
              {chosen && <SelectedTick />}
              <p className="title title-md font-semibold">{r.name}</p>
              {r.description && <p className="mt-1 caption-muted">{r.description}</p>}
              <p className="mt-3 title title-xl leading-none">{formatQar(r.amountQar)}</p>
            </div>
          );
        })}
      </div>
      {note && (
        <p role="status" className="caption-secondary">
          {note.message}
        </p>
      )}
      {!required && !value && <p className="caption-muted">A recharge is optional: continue without one to charge only the pack.</p>}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { simCardCharge } from '../../data/prepaidSimCharge';
import { formatQar } from '../../lib/format';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { EmptyState } from '../primitives/EmptyState';
import { Button } from '../primitives/Button';
import { SegmentedTabs } from '../primitives/SegmentedTabs';
import type { PricingRecharge, RechargeBenefit } from './prepaidCartModel';
import { RechargeCountryDrawer } from './RechargeCountryDrawer';
import { Icon } from '../primitives/Icon';
import { groupRecharges, RECHARGE_BENEFIT_ICON, RECHARGE_VALIDITY_ICON } from './rechargeSelectionModel';

function BenefitRow({ benefit, icon }: { benefit: RechargeBenefit; icon?: string }) {
  const path = icon ?? RECHARGE_BENEFIT_ICON[benefit.kind];
  return (
    <li className="row gap-2 caption-secondary">
      {path && <Icon path={path} className="icon-sm text-accent" />}
      {benefit.text}
    </li>
  );
}

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
  const [countriesFor, setCountriesFor] = useState<PricingRecharge | null>(null);

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

  return (
    <div className="space-y-4">
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
              {r.badge && <span className="badge badge-tag-amber mb-2">{r.badge}</span>}
              <p className="title title-md font-semibold">{r.name}</p>
              {r.description && <p className="mt-1 caption-muted">{r.description}</p>}
              <p className="mt-3 title title-xl leading-none">{formatQar(r.amountQar)}</p>
              {/* The allowances as icon rows - the prepaid pack card's layout: an accent icon, the line, validity last. */}
              {(Boolean(r.benefits?.length) || Boolean(r.validity)) && (
                <ul className="mt-3 space-y-1.5" aria-label="Benefits">
                  {r.benefits?.map((b) => (
                    <BenefitRow key={b.text} benefit={b} />
                  ))}
                  {r.validity && <BenefitRow benefit={{ text: `Valid for ${r.validity}`, kind: 'other' }} icon={RECHARGE_VALIDITY_ICON} />}
                </ul>
              )}
              {r.passes && (
                <div className="mt-3">
                  <p className="caption-heading">{r.passes.title}</p>
                  <ul className="mt-1 space-y-1.5">
                    {r.passes.items.map((p) => (
                      <BenefitRow key={p.text} benefit={p} />
                    ))}
                  </ul>
                </div>
              )}
              {r.note && <p className="mt-3 caption-muted">Note: {r.note}</p>}
              {r.countryInfo && (
                // A control inside the selectable card: it opens the drawer and must not also choose (or clear) the recharge.
                <div className="mt-3" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <Button variant="secondary" compact onClick={() => setCountriesFor(r)}>
                    {r.countryInfo.button}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {note && (
        <p role="status" className="caption-secondary">
          {note.message}
        </p>
      )}
      <RechargeCountryDrawer recharge={countriesFor} onClose={() => setCountriesFor(null)} />
      {!required && !value && <p className="caption-muted">A recharge is optional: continue without one to charge only the pack.</p>}
    </div>
  );
}

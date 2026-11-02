import { useEffect, useState } from 'react';
import { Button } from '../primitives/Button';
import { CreditCheckPanel } from '../domain/CreditCheckPanel';
import { evaluateRule } from '../../engines/ruleEngine';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../primitives/offerCardParts';
import { ICON_CARD, ICON_SPEED, ICON_TV } from '../../assets/icons';
import { Icon } from '../primitives/Icon';
import { ConnectionTypeTag } from '../primitives/ConnectionTypeTag';
import { formatQarAny, formatAmount } from '../../lib/format';

type Values = Record<string, unknown>;

interface FixedPlan {
  productId: string;
  name: string;
  type: string;
  mrcQAR: number;
  speedTierMbps?: number;
  fupGB?: number;
  iptvIncluded?: boolean;
  lockInMonths?: number;
  disconnectionFeeSchedule?: string;
  disconnectionFeeQAR?: number;
}

// Plan & Add-ons: the same card as the Postpaid plan selection (name, price per month, feature rows, Select plan),
// over the fixed-line plans, with the fibre credit check once a plan is chosen.
/**
 * The plan step of the fixed-line / fibre / FWA journeys: the same card as a postpaid plan (type tag, name, price, allowance rows, Select
 * plan), with the fibre allowances (speed, FUP, IPTV, lock-in, early-disconnection fee) as its rows, and the outstanding-balance credit
 * check once a plan is chosen. Mounted through PlanSelection kind 'fixed'.
 */
export function FixedPlanStep({ values, setValue }: { values: Values; setValue: (f: string, v: unknown) => void }) {
  const [plans, setPlans] = useState<FixedPlan[]>([]);
  const [collectionStatus, setCollectionStatus] = useState<string | undefined>();
  const selectedId = values.productId as string | undefined;
  useEffect(() => {
    void mockDataEngine.list<FixedPlan>('products').then((all) => setPlans(all.filter((p) => p.type === 'Fixed Line Plan').sort((a, b) => a.mrcQAR - b.mrcQAR)));
    void mockDataEngine.list<{ collectionStatus: string }>('billing-profiles').then((all) => setCollectionStatus(all[0]?.collectionStatus));
  }, []);
  useEffect(() => {
    if (selectedId && collectionStatus) {
      setValue('creditCheckPass', evaluateRule('BR-FIBRE-OUTSTANDING-THRESHOLD', { collectionStatus }).pass);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, collectionStatus]);

  return (
    <div className="space-y-4">
      <p className="caption-secondary">Please Select a Plan.</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] gap-4">
        {plans.map((p) => {
          const selected = selectedId === p.productId;
          const toggle = () => setValue('productId', selected ? undefined : p.productId);
          const rows = [
            ...(p.speedTierMbps ? [{ icon: ICON_SPEED, text: `${p.speedTierMbps} Mbps fibre` }] : []),
            ...(p.fupGB ? [{ icon: ICON_SPEED, text: `${p.fupGB} GB FUP` }] : []),
            ...(p.iptvIncluded ? [{ icon: ICON_TV, text: 'IPTV included' }] : []),
            ...(p.lockInMonths ? [{ icon: ICON_CARD, text: `${p.lockInMonths}-month lock-in` }] : []),
            ...(p.disconnectionFeeSchedule || p.disconnectionFeeQAR
              ? [{ icon: ICON_CARD, text: `Early disconnection fee: ${p.disconnectionFeeSchedule ?? `${formatQarAny(p.disconnectionFeeQAR)}`}` }]
              : []),
          ];
          return (
            <div
              key={p.productId}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  toggle();
                }
              }}
              className={`option-card gap-3 p-5 ${selected ? CARD_SELECTED : CARD_IDLE}`}
            >
              {selected && <SelectedTick />}
              <div className="row justify-end">
                <ConnectionTypeTag category="GigaHome Fibre" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="title title-lg leading-snug">{p.name}</p>
                <p className="text-accent pt-1">
                  <span className="text-[length:var(--fs-body)] font-semibold">QAR </span>
                  <span className="text-[length:var(--fs-h3)] font-bold">{formatAmount(p.mrcQAR)}</span>
                  <span className="caption-secondary"> /month</span>
                </p>
                <ul className="space-y-1.5">
                  {rows.map((f) => (
                    <li key={f.text} className="row gap-2 caption-secondary">
                      <Icon path={f.icon} className="icon-sm text-accent" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="row justify-end pt-1">
                <Button variant={selected ? 'primary' : 'secondary'} tabIndex={-1} aria-hidden className="pointer-events-none">
                  {selected ? 'Selected' : 'Select plan'}
                </Button>
              </div>
            </div>
          );
        })}
        {plans.length === 0 && <p className="text-muted">No Fixed Line Plan products are available right now.</p>}
      </div>
      {selectedId && collectionStatus && (
        <CreditCheckPanel
          collectionStatus={collectionStatus}
          acknowledged={values.creditCheckAcknowledged === true}
          onAcknowledge={(v) => setValue('creditCheckAcknowledged', v)}
        />
      )}
    </div>
  );
}

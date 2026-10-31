import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { duplicateIn } from './prepaidCartModel';
import type { PrepaidLine, PricingExtra, PricingProduct } from './prepaidCartModel';

// The "Add another subscription?" decision of the Mobile Prepaid process flow (#8.1): the order's subscriptions so far,
// and the choice to add one more (Yes: the plan, number and SIM steps start again) or to go on to checkout (No: the
// iteration ends - the footer's Continue).
export function PrepaidCartStep({ lines, onAddAnother }: { lines: PrepaidLine[]; onAddAnother: () => void }) {
  const [products, setProducts] = useState<PricingProduct[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  useEffect(() => {
    mockDataEngine.list<PricingProduct>('products').then(setProducts);
    mockDataEngine.list<PricingExtra>('addons-discounts').then(setExtras);
  }, []);
  const duplicate = duplicateIn(lines);

  return (
    <div className="space-y-4">
      {lines.length === 0 ? (
        <p role="status" className="text-muted text-[length:var(--fs-body)]">
          Choose the pack, number and SIM first; the subscription then appears here.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Subscriptions on this order">
          {lines.map((line, i) => {
            const plan = products.find((p) => p.productId === line.productId);
            const names = [...(line.discountId ? [line.discountId] : []), ...line.addonIds].map((id) => extras.find((e) => e.addonDiscountId === id)?.name ?? id);
            return (
              <li key={`${line.msisdn}-${i}`} className="card card-surface p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-fg font-semibold">
                    Subscription {i + 1}: {plan?.name ?? line.productId}
                  </p>
                  <p className="text-fg-2 text-[length:var(--fs-caption)]">
                    {line.msisdn} · {line.prePaired ? 'Pre-Paired SIM' : line.simType.simType === 'eSIM' ? 'eSIM' : `SIM ${line.simType.simSerial}`}
                    {names.length > 0 ? ` · ${names.join(', ')}` : ''}
                  </p>
                </div>
                {line.prePaired && <Badge variant="accent">Pre-Paired SIM</Badge>}
              </li>
            );
          })}
        </ul>
      )}
      {duplicate && (
        <p role="alert" className="text-danger text-[length:var(--fs-body)]">
          The {duplicate.kind} {duplicate.value} is on more than one subscription. Go back and choose a different {duplicate.kind}.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={onAddAnother} disabled={lines.length === 0 || Boolean(duplicate)}>
          Add Another Subscription
        </Button>
        <span className="text-muted text-[length:var(--fs-caption)]">Or continue to checkout once the order has every subscription.</span>
      </div>
    </div>
  );
}

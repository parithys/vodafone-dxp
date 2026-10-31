import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { Button } from '../primitives/Button';
import { Badge } from '../primitives/Badge';
import { cartTotals, priceLine } from './prepaidCartModel';
import type { PriceOptions, PrepaidCheckoutTotals, PrepaidLine, PricingExtra, PricingProduct } from './prepaidCartModel';
import { formatQar } from '../../lib/format';

interface SimRecord {
  simSerial: string;
  iccid: string;
}

interface PrepaidCheckoutStepProps {
  customerName: string | undefined;
  idType: string | undefined;
  /** Every subscription on the order (the cart, plus the one just finished). */
  lines: PrepaidLine[];
  onTotalsComputed: (totals: PrepaidCheckoutTotals) => void;
  /** Returns the agent to the Subscriptions step to change or add a subscription. */
  onEdit?: () => void;
  /** Label of the edit button (default "Edit subscriptions"). */
  editLabel?: string;
  /** Further facts about the order, under the customer (a port-in's number and donor operator). */
  details?: { label: string; value: string }[];
  /**
   * The order collects only these fees today, not the pack, add-ons and SIM card charge (a port-in: BR-MNP-011 lists the port-in
   * charge and deposit, and the BRSD gives none). The pack is then listed without a price and the total is the sum of the fees.
   */
  fees?: { label: string; amountQar: number }[];
  /**
   * The order changes a line the customer already has (a pack change, an add-on): the SIM is theirs, so no SIM rows and no SIM card
   * charge; with `excludePack` the pack is the line's current one and not being bought (an add-on), so no starter pack charge.
   */
  existingLine?: PriceOptions;
}

const qar = (n: number) => formatQar(n);

// MPRA_001_CVC_01-03 (cart validation, starter pack and recharge charge collection, payment summary): the read-back of
// the whole cart before the customer signs and pays - each subscription's pack, add-ons, number and SIM, the starter
// pack and any SIM card charge, and the total payable today that the Payment step collects. A prepaid line has no credit
// limit, billing account or monthly charge, so none is shown (CAM_02, ECC_03, BAM_01).
export function PrepaidCheckoutStep({ customerName, idType, lines, onTotalsComputed, onEdit, editLabel = 'Edit subscriptions', details, fees, existingLine }: PrepaidCheckoutStepProps) {
  const [products, setProducts] = useState<PricingProduct[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  const [sims, setSims] = useState<SimRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      mockDataEngine.list<PricingProduct>('products'),
      mockDataEngine.list<PricingExtra>('addons-discounts'),
      mockDataEngine.list<SimRecord>('sims'),
    ]).then(([p, e, s]) => {
      setProducts(p);
      setExtras(e);
      setSims(s);
      setLoaded(true);
    });
  }, []);

  const cart = cartTotals(lines, idType, products, extras, existingLine);
  const feesQar = (fees ?? []).reduce((sum, f) => sum + f.amountQar, 0);
  const totals: PrepaidCheckoutTotals = fees
    ? { starterPackChargeQar: 0, addonsChargeQar: 0, simCardChargeQar: 0, numberPriceQar: 0, totalDueQar: feesQar, lineCount: lines.length }
    : cart;

  useEffect(() => {
    if (loaded) onTotalsComputed(totals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, totals.totalDueQar, totals.simCardChargeQar, totals.addonsChargeQar, totals.starterPackChargeQar, totals.numberPriceQar, totals.lineCount]);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between gap-4 py-2 border-b border-border-soft last:border-0">
      <dt className="text-fg">{label}</dt>
      <dd className="text-fg text-right">{value}</dd>
    </div>
  );

  if (!loaded) return <p className="text-muted text-[length:var(--fs-body)]">Preparing the payment summary…</p>;
  if (lines.length === 0) return <p className="text-danger text-[length:var(--fs-body)]">There is no subscription on this order yet. Go back and complete the pack, number and SIM.</p>;

  return (
    <div className="space-y-4">
      <dl className="card card-surface p-4">
        <Row label="Customer" value={customerName ?? '-'} />
        {!fees && !existingLine && <Row label="Subscriptions" value={String(lines.length)} />}
        {details?.map((d) => (
          <Row key={d.label} label={d.label} value={d.value} />
        ))}
      </dl>

      {lines.map((line, i) => {
        const plan = products.find((p) => p.productId === line.productId);
        const charges = priceLine(line, idType, products, extras, existingLine);
        const discount = extras.find((e) => e.addonDiscountId === line.discountId);
        const addons = line.addonIds.map((id) => extras.find((e) => e.addonDiscountId === id)).filter((e): e is PricingExtra => Boolean(e));
        const iccid = line.simType.simType === 'Physical' ? sims.find((s) => s.simSerial === line.simType.simSerial)?.iccid : undefined;
        return (
          <section key={`${line.msisdn}-${i}`} aria-label={`Subscription ${i + 1}`} className="card card-surface p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)]">{fees || existingLine ? 'Order' : `Subscription ${i + 1}`}</h3>
              {line.prePaired && <Badge variant="accent">Pre-Paired SIM</Badge>}
            </div>
            <dl>
              <Row label="Pack" value={plan ? (fees ? plan.name : existingLine?.excludePack ? `${plan.name} (current pack)` : `${plan.name} - ${qar(charges.starterPackQar)}`) : 'SIM only, no pack selected'} />
              {discount && <Row label="Discount" value={`${discount.name} (${Math.round(Math.abs(discount.price) * 100)}% off the starter pack)`} />}
              {addons.map((a) => (
                <Row key={a.addonDiscountId} label="Add-On" value={`${a.name} - ${qar(a.price)}`} />
              ))}
              <Row label={existingLine ? 'Line' : 'Number'} value={`${line.msisdn}${charges.numberQar > 0 ? ` (premium, ${qar(charges.numberQar)} one-time)` : ''}`} />
              {!existingLine && (
                <>
                  <Row
                    label="SIM Type"
                    value={line.prePaired ? 'Pre-Paired SIM' : line.simType.simType === 'eSIM' ? 'eSIM' : (line.simType.simKind ?? line.simType.simType ?? '-')}
                  />
                  <Row label="ICCID" value={iccid ?? line.simType.simIccid ?? '-'} />
                </>
              )}
              {!fees && !existingLine && <Row label="SIM Card Charge" value={charges.simCardChargeQar > 0 ? qar(charges.simCardChargeQar) : 'Waived'} />}
              {!fees && <Row label="Due for This Subscription" value={qar(charges.totalQar)} />}
            </dl>
            {!fees && !existingLine && <p className="text-[length:var(--fs-caption)] text-muted">{charges.simCardMessage}</p>}
          </section>
        );
      })}

      <div className="rounded-[var(--radius-card)] border border-accent-border bg-surface-warm p-4">
        {fees?.map((f) => (
          <div key={f.label} className="flex justify-between text-fg text-[length:var(--fs-body)] mb-1">
            <span>{f.label}</span>
            <span>{qar(f.amountQar)}</span>
          </div>
        ))}
        <div className="flex justify-between text-fg font-semibold">
          <span>Total Payable Today</span>
          <span>{qar(totals.totalDueQar)}</span>
        </div>
        <p className="mt-1 text-[length:var(--fs-caption)] text-fg-2">
          {fees
            ? totals.totalDueQar === 0
              ? 'Nothing is due, so a zero-value receipt is issued at payment.'
              : 'The port-in charges and deposit due today.'
            : 'Includes the starter pack and any initial recharge, add-ons, premium numbers and SIM card charges. Nothing is billed later.'}
        </p>
      </div>

      {onEdit && (
        <div>
          <Button variant="secondary" compact onClick={onEdit}>
            {editLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

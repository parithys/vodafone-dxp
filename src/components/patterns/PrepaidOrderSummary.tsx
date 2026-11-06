import { useEffect, useState } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { Button } from '../primitives/Button';
import { SummaryTables } from './CheckoutSummaryTables';
import type { SummaryTable } from './CheckoutSummaryTables';
import { cartTotals, priceLine } from './prepaidCartModel';
import type { PrepaidCheckoutTotals, PrepaidLine, PricingExtra, PricingProduct, PricingRecharge } from './prepaidCartModel';
import { prepaidOrderErrors } from './prepaidOrderValidation';
import type { PrepaidPlan } from './prepaidPlanModel';
import { PREPAID_VAT_PERCENT } from '../../data/prepaidActivation';
import { usePersonaStore } from '../../stores/personaStore';
import { formatQar } from '../../lib/format';
import { simPairingOf } from './simPairing';

interface SimRecord {
  simSerial: string;
  iccid: string;
}

interface PrepaidOrderSummaryProps {
  customerName: string | undefined;
  idType: string | undefined;
  idNumber: string | undefined;
  segment?: string;
  lines: PrepaidLine[];
  onTotalsComputed: (totals: PrepaidCheckoutTotals) => void;
  /** The messages the order's checks produced (empty when it passes), reported once the catalogue is loaded; the journey gates Continue on it. */
  onValidated: (errors: string[]) => void;
  /** The read-back the CAF & Signature step shows the customer: label / value rows built from the same figures. */
  onSummaryComputed: (rows: { label: string; value: string }[]) => void;
  onEdit?: () => void;
  editLabel?: string;
}

const money = (n: number) => formatQar(n);
const signed = (n: number) => (n < 0 ? `-${formatQar(Math.abs(n))}` : formatQar(n));

/**
 * The New Prepaid ORDER SUMMARY, in the same two-table design as the Postpaid read-back (SummaryTables): the order's checks (errors under the page title), then an ORDER SUMMARY
 * table - the customer and each subscription's pack, Recharge (what was chosen and its amount; not the add-ons row Postpaid has), mobile number (Star or Free) and SIM - beside
 * UPFRONT CHARGES: every chargeable item with its VAT-exclusive value and VAT, the VAT figures and the Total Payable Today. Nothing postpaid is shown (no plan or Star lock-in, credit or bill limit, advance payment /
 * HRN, approximate bill). The figures come from the same pricing the order is submitted with.
 */
export function PrepaidOrderSummary({ customerName, idType, idNumber, segment, lines, onTotalsComputed, onValidated, onSummaryComputed, onEdit, editLabel = 'Edit subscriptions' }: PrepaidOrderSummaryProps) {
  const roleId = usePersonaStore((s) => s.activePersonaId);
  const [products, setProducts] = useState<(PricingProduct & Partial<PrepaidPlan>)[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  const [recharges, setRecharges] = useState<PricingRecharge[]>([]);
  const [sims, setSims] = useState<SimRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      mockDataEngine.list<PricingProduct & Partial<PrepaidPlan>>('products'),
      mockDataEngine.list<PricingExtra>('addons-discounts'),
      mockDataEngine.list<SimRecord>('sims'),
      mockDataEngine.list<PricingRecharge>('recharge-products'),
    ]).then(([p, e, s, r]) => {
      setProducts(p);
      setExtras(e);
      setSims(s);
      setRecharges(r);
      setLoaded(true);
    });
  }, []);

  const options = { recharges, roleId, vatPercent: PREPAID_VAT_PERCENT };
  const totals = cartTotals(lines, idType, products, extras, options);
  const errors = prepaidOrderErrors({ customerName, idNumber, lines, packs: products.filter((p): p is PrepaidPlan => p.type === 'Prepaid Plan'), segment });
  const errorKey = errors.join('|');

  // What the CAF reads back: the same pack, recharge, number and SIM as above, then every charge with its VAT, then the total.
  const cafRows = lines.flatMap((line, i) => {
    const charges = priceLine(line, idType, products, extras, options);
    const prefix = lines.length > 1 ? `Subscription ${i + 1} - ` : '';
    const recharge = recharges.find((r) => r.rechargeId === line.rechargeId);
    return [
      { label: `${prefix}Plan / Package`, value: products.find((p) => p.productId === line.productId)?.name ?? 'SIM only' },
      { label: `${prefix}Recharge`, value: recharge ? `${recharge.name} (${money(charges.rechargeQar)})` : 'None' },
      { label: `${prefix}Mobile Number`, value: `${line.msisdn} (${charges.numberListQar > 0 ? 'Star Number' : 'Free Number'})` },
      { label: `${prefix}SIM`, value: `${line.prePaired ? 'Pre-Paired SIM' : (line.simType.simKind ?? line.simType.simType ?? '-')}${line.simType.simSerial ? ` ${line.simType.simSerial}` : ''} (${simPairingOf(line.simType)})` },
    ];
  });
  const chargeRows = (totals.chargeSummary?.lines ?? []).map((l) => ({ label: l.label, value: `${signed(l.amounts.exclQar)} + VAT ${l.amounts.vatPercent}% ${signed(l.amounts.vatQar)} = ${signed(l.amounts.inclQar)}` }));
  const rowsKey = JSON.stringify([cafRows, chargeRows]);

  useEffect(() => {
    if (!loaded) return;
    onTotalsComputed(totals);
    onValidated(errors);
    onSummaryComputed([...cafRows, ...chargeRows, { label: 'Total Payable Today (Incl. VAT)', value: money(totals.totalDueQar) }]);
    // The totals are recomputed from the lines each render; what matters is what they came to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, totals.totalDueQar, totals.lineCount, errorKey, rowsKey]);

  if (!loaded) return <p className="muted-body">Preparing the order summary…</p>;

  const summary = totals.chargeSummary;
  // The Order Summary table: the customer, then each subscription's pack, recharge, number and SIM (rows prefixed "Subscription n" when there are several).
  const orderRows: SummaryTable['rows'] = [
    { label: 'Customer Name', value: customerName ?? '-' },
    { label: 'ID', value: [idType, idNumber].filter(Boolean).join(' ') || '-' },
    ...(lines.length > 1 ? [{ label: 'Subscriptions', value: String(lines.length) }] : []),
    ...lines.flatMap((line, i) => {
      const plan = products.find((p) => p.productId === line.productId);
      const charges = priceLine(line, idType, products, extras, options);
      const recharge = recharges.find((r) => r.rechargeId === line.rechargeId);
      const iccid = line.simType.simType === 'Physical' ? sims.find((x) => x.simSerial === line.simType.simSerial)?.iccid : undefined;
      const prefix = lines.length > 1 ? `Subscription ${i + 1} - ` : '';
      return [
        { label: `${prefix}Plan / Package`, value: plan?.name ?? 'SIM only, no pack selected' },
        // Where Postpaid lists Add-Ons, a prepaid order lists its Recharge: what was chosen and its amount.
        { label: `${prefix}Recharge`, value: recharge ? recharge.name : 'No recharge selected' },
        { label: `${prefix}Recharge Amount`, value: money(recharge ? charges.rechargeQar : 0) },
        { label: `${prefix}Mobile Number (MSISDN)`, value: line.msisdn, boldValue: charges.numberListQar > 0 },
        { label: `${prefix}Number Type`, value: charges.numberListQar > 0 ? 'Star Number' : 'Free Number' },
        { label: `${prefix}SIM Type`, value: line.prePaired ? 'Pre-Paired SIM' : line.simType.simType === 'eSIM' ? 'eSIM' : (line.simType.simKind ?? line.simType.simType ?? '-') },
        { label: `${prefix}SIM Serial Number`, value: line.simType.simSerial ?? '-' },
        { label: `${prefix}ICCID`, value: iccid ?? line.simType.simIccid ?? '-' },
        { label: `${prefix}SIM Status`, value: simPairingOf(line.simType), detail: charges.simCardMessage || undefined },
      ];
    }),
  ];
  // Upfront Charges: every chargeable item (VAT-inclusive, its VAT-exclusive value and VAT beneath), then the VAT figures and the total.
  const upfrontRows: SummaryTable['rows'] = summary
    ? [
        ...summary.lines.map((l) => ({ label: l.label, value: signed(l.amounts.inclQar), detail: `${signed(l.amounts.exclQar)} + VAT ${l.amounts.vatPercent}% ${signed(l.amounts.vatQar)}` })),
        { label: 'VAT Exclusive Charge', value: signed(summary.total.exclQar) },
        { label: 'VAT Code (%)', value: `${summary.total.vatPercent}%` },
        { label: 'VAT Charge', value: signed(summary.total.vatQar) },
        { label: 'Total Payable Today', value: money(totals.totalDueQar), boldLabel: true, boldValue: true, detail: 'VAT-inclusive. Nothing is billed later.' },
      ]
    : [];
  const tables: SummaryTable[] = [{ title: 'Order Summary', rows: orderRows }, ...(summary ? [{ title: 'Upfront Charges', rows: upfrontRows }] : [])];

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div role="alert" className="notice-danger-edge p-4 space-y-1">
          <p className="text-fg font-semibold">This order cannot continue until the following is resolved:</p>
          <ul className="bullet-list">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <SummaryTables tables={tables} />

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

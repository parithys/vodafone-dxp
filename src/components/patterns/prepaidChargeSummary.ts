import { VAT_APPLIES_TO } from '../../data/prepaidActivation';
import type { ChargeItemKey } from '../../data/prepaidActivation';
import type { LineCharges } from './prepaidCartModel';

// The Charge Summary of a New Prepaid Activation: each chargeable item with its VAT-exclusive value, VAT %, VAT charge and VAT-inclusive value, and the same four figures
// for the total. A discount is a negative item (it takes VAT off in proportion), so the total is exactly the sum of its rows and cannot disagree with them.

export interface VatAmounts {
  exclQar: number;
  vatPercent: number;
  vatQar: number;
  inclQar: number;
}

const to2 = (n: number) => Math.round(n * 100) / 100;

/** VAT on a VAT-exclusive amount, rounded to the fils on the VAT itself, so the inclusive value is exactly exclusive + VAT. */
export function vatOf(exclQar: number, vatPercent: number): VatAmounts {
  const excl = to2(exclQar);
  const vat = to2((excl * vatPercent) / 100);
  return { exclQar: excl, vatPercent, vatQar: vat, inclQar: to2(excl + vat) };
}

export interface ChargeSummaryLine {
  key: ChargeItemKey;
  label: string;
  /** A discount: shown negative. */
  discount: boolean;
  amounts: VatAmounts;
}

export interface ChargeSummary {
  lines: ChargeSummaryLine[];
  /** The total: the sum of the rows' four figures. Its `vatPercent` is the standard rate (a mix of rates would show the rate of the rows that carry VAT). */
  total: VatAmounts;
}

/** The items of the Charge Summary across every subscription of the order, in the order the customer reads them. An item with nothing to charge has no row. */
export function chargeSummaryOf(charges: readonly LineCharges[], standardVatPercent: number): ChargeSummary {
  const sum = (pick: (c: LineCharges) => number) => charges.reduce((t, c) => t + pick(c), 0);
  const item = (key: ChargeItemKey, label: string, discount: boolean, excl: number): ChargeSummaryLine[] =>
    excl === 0 ? [] : [{ key, label, discount, amounts: vatOf(discount ? -Math.abs(excl) : excl, VAT_APPLIES_TO[key] ? standardVatPercent : 0) }];
  const hasRecharge = charges.some((c) => c.rechargeQar > 0);
  const lines: ChargeSummaryLine[] = [
    ...item('pack', 'Starter Pack', false, sum((c) => c.starterPackQar)),
    ...item('addons', 'Add-Ons', false, sum((c) => c.addonsQar)),
    ...(hasRecharge ? item('recharge', 'Recharge', false, sum((c) => c.rechargeQar)) : []),
    ...item('star-number', 'Star Number Charge', false, sum((c) => c.numberListQar)),
    ...item('star-discount', 'Additional Agent Discount (Star Number)', true, sum((c) => c.numberWaivedQar)),
    ...item('sim-charge', 'SIM Charge', false, sum((c) => c.simStandardChargeQar)),
    ...item('sim-discount', 'SIM Discount', true, sum((c) => c.simDiscountQar)),
  ];
  const total = lines.reduce(
    (t, l) => ({ ...t, exclQar: to2(t.exclQar + l.amounts.exclQar), vatQar: to2(t.vatQar + l.amounts.vatQar), inclQar: to2(t.inclQar + l.amounts.inclQar) }),
    { exclQar: 0, vatPercent: standardVatPercent, vatQar: 0, inclQar: 0 }
  );
  return { lines, total };
}

import type { SimTypeValue } from '../domain/SimTypeStep';
import { simCardCharge } from '../../data/prepaidSimCharge';

// The Mobile Prepaid cart (process flow #8.1 "Iterate to capture multiple subscriptions"): one order holds one or more
// subscriptions, each one base pack + optional add-ons + one number + one SIM. The wizard edits ONE subscription at a
// time through the ordinary per-line keys below; "Add another subscription" commits it into `cart` and clears those keys
// so the plan, number and SIM steps start fresh. Everything downstream (checkout, CAF, payment, submit) reads the
// whole cart through `allLines`, never the per-line keys directly.

/** The draft-value keys that hold the subscription being edited. Cleared when it is committed to the cart. */
export const LINE_KEYS = ['productId', 'discountId', 'addonIds', 'prePaired', 'msisdn', 'priceQAR', 'simType'] as const;

export interface PrepaidLine {
  productId: string;
  discountId?: string;
  addonIds: string[];
  /** Pre-Paired SIM: the number came from the SIM, not from Number Selection. */
  prePaired: boolean;
  msisdn: string;
  /** The one-time price of a premium number; 0 for a free one. */
  numberPriceQAR: number;
  simType: SimTypeValue;
}

type Values = Record<string, unknown>;

/** A SIM that is finished: a Physical serial that validated, or an eSIM that was selected. */
export function isSimComplete(sim: SimTypeValue | undefined): boolean {
  if (sim?.simType === 'Physical') return sim.simValid === true;
  if (sim?.simType === 'eSIM') return sim.esimIssued === true;
  return false;
}

/** The subscription being edited, once it has a pack, a number and a finished SIM; otherwise undefined. */
export function currentLine(values: Values): PrepaidLine | undefined {
  const sim = values.simType as SimTypeValue | undefined;
  const productId = values.productId as string | undefined;
  const msisdn = values.msisdn as string | undefined;
  if (!productId || !msisdn || !isSimComplete(sim)) return undefined;
  return {
    productId,
    discountId: values.discountId as string | undefined,
    addonIds: (values.addonIds as string[] | undefined) ?? [],
    prePaired: values.prePaired === true,
    msisdn,
    numberPriceQAR: (values.priceQAR as number | undefined) ?? 0,
    simType: sim as SimTypeValue,
  };
}

/** The subscriptions already committed to the cart. */
export const committedLines = (values: Values): PrepaidLine[] => (values.cart as PrepaidLine[] | undefined) ?? [];

/** Every subscription on the order: those committed, then the one being edited if it is finished. */
export function allLines(values: Values): PrepaidLine[] {
  const current = currentLine(values);
  return current ? [...committedLines(values), current] : committedLines(values);
}

/** Which number or SIM serial appears on more than one line, if any. A line cannot repeat another's number or SIM. */
export function duplicateIn(lines: PrepaidLine[]): { kind: 'number' | 'SIM'; value: string } | undefined {
  const seenNumber = new Set<string>();
  const seenSim = new Set<string>();
  for (const l of lines) {
    if (seenNumber.has(l.msisdn)) return { kind: 'number', value: l.msisdn };
    seenNumber.add(l.msisdn);
    const serial = l.simType.simSerial;
    if (serial) {
      if (seenSim.has(serial)) return { kind: 'SIM', value: serial };
      seenSim.add(serial);
    }
  }
  return undefined;
}

/** The cart step may continue when there is at least one finished subscription and none repeats a number or SIM. */
export const isCartValid = (values: Values): boolean => {
  const lines = allLines(values);
  return lines.length > 0 && !duplicateIn(lines);
};

// ---------------------------------------------------------------- pricing

export interface PricingProduct {
  productId: string;
  name: string;
  starterPackChargeQAR?: number;
}
export interface PricingExtra {
  addonDiscountId: string;
  name: string;
  /** A discount is a negative fraction (-0.1 = 10% off the starter pack); an add-on is a QAR amount. */
  price: number;
}

export interface LineCharges {
  /** The starter pack after the agent's discount; this is the recharge the SIM card charge rule judges. */
  starterPackQar: number;
  addonsQar: number;
  numberQar: number;
  simCardChargeQar: number;
  totalQar: number;
  simCardMessage: string;
}

/** What a line costs when it is an existing line (a pack change, an add-on) rather than a new SIM. */
export interface PriceOptions {
  /** The SIM is already the customer's: no SIM card charge. */
  existingSim?: boolean;
  /** The pack is not being bought (an add-on on the current pack): no starter pack charge. */
  excludePack?: boolean;
}

/** What one subscription costs today: starter pack (net of discount), add-ons, premium number, SIM card charge. */
export function priceLine(line: PrepaidLine, idType: string | undefined, products: PricingProduct[], extras: PricingExtra[], opts: PriceOptions = {}): LineCharges {
  const plan = products.find((p) => p.productId === line.productId);
  const discount = extras.find((e) => e.addonDiscountId === line.discountId);
  const starterPackQar = plan && !opts.excludePack ? Math.round((plan.starterPackChargeQAR ?? 0) * (1 + (discount?.price ?? 0))) : 0;
  const addonsQar = line.addonIds.reduce((sum, id) => sum + (extras.find((e) => e.addonDiscountId === id)?.price ?? 0), 0);
  const sim = opts.existingSim ? { chargeQar: 0, message: 'The SIM is already the customer\'s, so there is no SIM card charge.' } : simCardCharge(idType, starterPackQar);
  const numberQar = line.numberPriceQAR;
  return {
    starterPackQar,
    addonsQar,
    numberQar,
    simCardChargeQar: sim.chargeQar,
    totalQar: starterPackQar + addonsQar + numberQar + sim.chargeQar,
    simCardMessage: sim.message,
  };
}

export interface PrepaidCheckoutTotals {
  starterPackChargeQar: number;
  addonsChargeQar: number;
  simCardChargeQar: number;
  numberPriceQar: number;
  /** The total payable today across every subscription - the amount the Payment step collects. */
  totalDueQar: number;
  lineCount: number;
}

export function cartTotals(lines: PrepaidLine[], idType: string | undefined, products: PricingProduct[], extras: PricingExtra[], opts: PriceOptions = {}): PrepaidCheckoutTotals {
  const priced = lines.map((l) => priceLine(l, idType, products, extras, opts));
  const sum = (pick: (c: LineCharges) => number) => priced.reduce((t, c) => t + pick(c), 0);
  return {
    starterPackChargeQar: sum((c) => c.starterPackQar),
    addonsChargeQar: sum((c) => c.addonsQar),
    simCardChargeQar: sum((c) => c.simCardChargeQar),
    numberPriceQar: sum((c) => c.numberQar),
    totalDueQar: sum((c) => c.totalQar),
    lineCount: lines.length,
  };
}

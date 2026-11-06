import type { SimTypeValue } from '../domain/SimTypeStep';
import { simCardCharge } from '../../data/prepaidSimCharge';
import type { SimChargeKind } from '../../data/prepaidSimCharge';
import { chargeSummaryOf } from './prepaidChargeSummary';
import type { ChargeSummary } from './prepaidChargeSummary';
import { chargeAfterWaiverQar, waivedQar } from '../../engines/numberWaiver';

// The Mobile Prepaid cart (process flow #8.1 "Iterate to capture multiple subscriptions"): one order holds one or more
// subscriptions, each one base pack + optional add-ons + one number + one SIM. The wizard edits ONE subscription at a
// time through the ordinary per-line keys below; "Add another subscription" commits it into `cart` and clears those keys
// so the plan, number and SIM steps start fresh. Everything downstream (checkout, CAF, payment, submit) reads the
// whole cart through `allLines`, never the per-line keys directly.

/** The draft-value keys that hold the subscription being edited. Cleared when it is committed to the cart. */
export const LINE_KEYS = ['productId', 'discountId', 'addonIds', 'rechargeId', 'prePaired', 'msisdn', 'msisdnSource', 'priceQAR', 'numberWaiver', 'simType'] as const;

export interface PrepaidLine {
  productId: string;
  discountId?: string;
  addonIds: string[];
  /** The recharge chosen on the Recharge step (BRSD V0.3 Prepaid Recharge Selection), if any. */
  rechargeId?: string;
  /** Pre-Paired SIM: the number came from the SIM, not from Number Selection. */
  prePaired: boolean;
  msisdn: string;
  /** The one-time list price of a premium number; 0 for a free one. */
  numberPriceQAR: number;
  /** The fixed amount (QAR) the agent waived off a Star number's list price (Star Number Additional Discount), if any. */
  numberWaiver?: number;
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
    rechargeId: values.rechargeId as string | undefined,
    prePaired: values.prePaired === true,
    msisdn,
    numberPriceQAR: (values.priceQAR as number | undefined) ?? 0,
    numberWaiver: values.numberWaiver as number | undefined,
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

/** What a benefit line is about, set in the catalogue (never read off its wording); it picks the line's icon. */
export type RechargeBenefitKind = 'data' | 'voice' | 'international' | 'internet' | 'bonus' | 'social' | 'night' | 'credit' | 'other';

export interface RechargeBenefit {
  text: string;
  kind: RechargeBenefitKind;
}

/** The countries a recharge's international minutes reach, and any bonus minutes per country, shown in a side drawer from a button on the card. */
export interface RechargeCountryInfo {
  /** The card button: "View eligible countries" (minutes only) or "View Country Bonus" (minutes plus a bonus table). */
  button: string;
  /** The headline ("20 International Minutes to the countries below") and the countries it covers, one entry each. */
  minutes: string;
  countries: string[];
  /** The bonus table: its heading ("Bonus to 7 countries") and one row per country (ISO code, name, bonus as worded). */
  bonus?: { heading: string; rows: { iso: string; country: string; bonus: string }[] };
}

export interface PricingRecharge {
  rechargeId: string;
  name: string;
  category: string;
  amountQar: number;
  description?: string;
  /** How long the recharge lasts, as the catalogue words it ("28 days", "One day"); absent when the catalogue gives none. */
  validity?: string;
  /** What the recharge gives, one line each, in the catalogue's wording. */
  benefits?: RechargeBenefit[];
  /** Passes bundled with the recharge: a heading ("Passes (2 Free Passes of your choice)") and the passes to choose from. */
  passes?: { title: string; items: RechargeBenefit[] };
  /** The countries and bonus minutes behind the card's "View eligible countries" / "View Country Bonus" button. */
  countryInfo?: RechargeCountryInfo;
  /** A highlight on the card ("Best Seller", "15% Extra Online Exclusive"). */
  badge?: string;
  /** A condition shown under the benefits (a fair-usage limit). */
  note?: string;
  status?: string;
  /** Marks sample catalogue data (the real recharge catalogue has not been supplied). */
  sample?: boolean;
}

export interface LineCharges {
  /** The starter pack after the agent's discount. When no recharge is chosen this is what the SIM card charge rule judges. */
  starterPackQar: number;
  addonsQar: number;
  /** The recharge chosen on the Recharge step; when there is one it is what the SIM card charge rule judges. */
  rechargeQar: number;
  /** The number's list price, the amount waived off it, and what the customer pays (list price less the waiver). */
  numberListQar: number;
  numberWaivedQar: number;
  numberQar: number;
  simCardChargeQar: number;
  /** The Standard SIM charge before any reduction or waiver, and the discount that takes it down to `simCardChargeQar` (0 when the charge is Standard or no rule applies). */
  simStandardChargeQar: number;
  simDiscountQar: number;
  simChargeKind: SimChargeKind;
  totalQar: number;
  simCardMessage: string;
}

/** What a line costs when it is an existing line (a pack change, an add-on) rather than a new SIM. */
export interface PriceOptions {
  /** The SIM is already the customer's: no SIM card charge. */
  existingSim?: boolean;
  /** The pack is not being bought (an add-on on the current pack): no starter pack charge. */
  excludePack?: boolean;
  /** The recharge catalogue, to price a line's chosen recharge. */
  recharges?: PricingRecharge[];
  /** The agent's role, for a SIM charging rule that is role-specific (New Prepaid activation only; other journeys leave it off and keep the ID-type rule). */
  roleId?: string;
}

/** What one subscription costs today: starter pack (net of discount), add-ons, premium number, SIM card charge. */
export function priceLine(line: PrepaidLine, idType: string | undefined, products: PricingProduct[], extras: PricingExtra[], opts: PriceOptions = {}): LineCharges {
  const plan = products.find((p) => p.productId === line.productId);
  const discount = extras.find((e) => e.addonDiscountId === line.discountId);
  const starterPackQar = plan && !opts.excludePack ? Math.round((plan.starterPackChargeQAR ?? 0) * (1 + (discount?.price ?? 0))) : 0;
  const addonsQar = line.addonIds.reduce((sum, id) => sum + (extras.find((e) => e.addonDiscountId === id)?.price ?? 0), 0);
  const rechargeQar = line.rechargeId ? opts.recharges?.find((r) => r.rechargeId === line.rechargeId)?.amountQar ?? 0 : 0;
  // BRSD V0.3: the SIM card charge is judged on the recharge. A line with no recharge chosen keeps the earlier reading: its net starter pack.
  const sim = opts.existingSim
    ? { chargeQar: 0, standardChargeQar: 0, kind: 'none' as SimChargeKind, message: 'The SIM is already the customer\'s, so there is no SIM card charge.' }
    : simCardCharge(idType, line.rechargeId ? rechargeQar : starterPackQar, opts.roleId);
  const numberListQar = line.numberPriceQAR;
  const numberWaivedQar = waivedQar(numberListQar, line.numberWaiver);
  const numberQar = chargeAfterWaiverQar(numberListQar, line.numberWaiver);
  return {
    starterPackQar,
    addonsQar,
    rechargeQar,
    numberListQar,
    numberWaivedQar,
    numberQar,
    simCardChargeQar: sim.chargeQar,
    simStandardChargeQar: sim.standardChargeQar,
    simDiscountQar: sim.standardChargeQar - sim.chargeQar,
    simChargeKind: sim.kind,
    totalQar: starterPackQar + addonsQar + rechargeQar + numberQar + sim.chargeQar,
    simCardMessage: sim.message,
  };
}

export interface PrepaidCheckoutTotals {
  starterPackChargeQar: number;
  addonsChargeQar: number;
  rechargeChargeQar: number;
  simCardChargeQar: number;
  /** What the customer pays for the numbers, after any waiver. */
  numberPriceQar: number;
  /** The numbers' list prices and what the agent waived off them. */
  numberListPriceQar: number;
  numberWaivedQar: number;
  /** The total payable today across every subscription - the amount the Payment step collects (VAT-inclusive when `chargeSummary` is present). */
  totalDueQar: number;
  lineCount: number;
  /** New Prepaid activation: the Charge Summary with VAT, whose inclusive total is `totalDueQar`. */
  chargeSummary?: ChargeSummary;
  /** The SIM charge before reduction / waiver, and what was taken off it. */
  simStandardChargeQar?: number;
  simDiscountQar?: number;
}

export function cartTotals(lines: PrepaidLine[], idType: string | undefined, products: PricingProduct[], extras: PricingExtra[], opts: PriceOptions & { vatPercent?: number } = {}): PrepaidCheckoutTotals {
  const priced = lines.map((l) => priceLine(l, idType, products, extras, opts));
  const sum = (pick: (c: LineCharges) => number) => priced.reduce((t, c) => t + pick(c), 0);
  return {
    starterPackChargeQar: sum((c) => c.starterPackQar),
    addonsChargeQar: sum((c) => c.addonsQar),
    rechargeChargeQar: sum((c) => c.rechargeQar),
    simCardChargeQar: sum((c) => c.simCardChargeQar),
    numberPriceQar: sum((c) => c.numberQar),
    numberListPriceQar: sum((c) => c.numberListQar),
    numberWaivedQar: sum((c) => c.numberWaivedQar),
    // New Prepaid activation passes a VAT rate: the order then collects the Charge Summary's VAT-inclusive total.
    ...(opts.vatPercent !== undefined
      ? (() => {
          const chargeSummary = chargeSummaryOf(priced, opts.vatPercent);
          return { totalDueQar: chargeSummary.total.inclQar, chargeSummary };
        })()
      : { totalDueQar: sum((c) => c.totalQar) }),
    simStandardChargeQar: sum((c) => c.simStandardChargeQar),
    simDiscountQar: sum((c) => c.simDiscountQar),
    lineCount: lines.length,
  };
}

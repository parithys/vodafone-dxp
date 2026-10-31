// Synthetic Customer 360 demo values: what each field with no data in the records shows. Every value is
// derived from the selected customer's own record (segment, line type, plan, dates, tickets ...) so the
// screen never contradicts itself, and is wrapped as Synthetic (isSynthetic) by the caller. Nothing here is
// written back to any record. Pure functions - the React context/hook that serves them is
// workspace/customer360/demoValues.tsx.
import type { Customer360Data } from '../../engines/customer360Engine';
import type { CustomerService } from '../../engines/customerServicesEngine';
import { str } from '../../lib/values';
import { outstandingBalance } from '../../engines/billingBalance';
import { isBusinessSegment } from '../../engines/businessSegment';

export interface DemoCtx {
  data: Customer360Data;
  services: CustomerService[];
}

// The app's frozen "today" (customer360Engine's SESSION_TODAY).
const TODAY = new Date(2026, 8, 14);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtTime = (d: Date, h = 9, m = 30) => `${fmt(d)} | ${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const customerId = (c: DemoCtx) => c.data.customer.customerId;
const isBusiness = (c: DemoCtx) => isBusinessSegment(c.data.customer.segment);
// The customer's own line type, as the record states it; else the account's type. Unknown stays unknown (it was read as Postpaid).
const lineType = (c: DemoCtx): 'Prepaid' | 'Postpaid' | undefined => {
  const stated = c.data.customer.lineType;
  if (stated === 'Prepaid' || stated === 'Postpaid') return stated;
  const accountType = String(c.data.accounts[0]?.accountType ?? '');
  return /prepaid/i.test(accountType) ? 'Prepaid' : /postpaid/i.test(accountType) ? 'Postpaid' : undefined;
};
const meta = (c: DemoCtx) => (c.data.overviewDemo[0]?.contactMeta ?? {}) as { tenure?: string; creditScore?: string | number };
const city = (c: DemoCtx) => str(c.data.addresses[0]?.city) ?? 'Doha';
const benefits = (c: DemoCtx) => c.data.customer.benefitEligibility ?? [];

/** Customer since: today minus the recorded tenure (years), else 1-6 years by customer id. */
function customerSince(c: DemoCtx): Date {
  const years = Number(/(\d+)/.exec(meta(c).tenure ?? '')?.[1] ?? 1 + (hash(customerId(c)) % 6));
  const d = addMonths(TODAY, -(years * 12 + (hash(customerId(c)) % 9)));
  return new Date(d.getFullYear(), d.getMonth(), 1 + (hash(customerId(c)) % 27));
}
const tenureText = (c: DemoCtx) => {
  const y = Math.max(1, Math.floor((TODAY.getTime() - customerSince(c).getTime()) / (365.25 * 86400000)));
  return `${y} year${y === 1 ? '' : 's'}`;
};
const primaryPhone = (c: DemoCtx) => str(c.data.customer.phone) ?? '+97455500000';
const latestBill = (c: DemoCtx) => [...c.data.bills].sort((a, b) => str(a.billPeriod)!.localeCompare(str(b.billPeriod)!)).at(-1);
const dueDate = (c: DemoCtx) => {
  const d = str(latestBill(c)?.dueDate);
  return d ? new Date(d) : addDays(TODAY, 14);
};
const outstanding = (c: DemoCtx) => outstandingBalance(c.data.bills, c.data.payments);

/** The customer's single discount (one per order): Retired, MADA, B2B2C, else Loyalty. */
const discountName = (c: DemoCtx) =>
  benefits(c).includes('retired') ? 'Retired Discount 25%' : benefits(c).includes('mada') ? 'MADA Discount 25%' : benefits(c).includes('b2b2c') ? 'B2B2C Discount 25%' : benefits(c).includes('loyalty') ? 'Loyalty Discount 15%' : 'None';
/** The next bill due date after today, on the customer's monthly cycle. */
const nextDue = (c: DemoCtx) => {
  let d = dueDate(c);
  while (d.getTime() <= TODAY.getTime()) d = addMonths(d, 1);
  return d;
};

const AREAS: Record<string, string> = { '12': 'West Bay', '39': 'Al Rayyan', '45': 'Al Sadd', '55': 'Al Waab', '66': 'The Pearl' };

export type DemoKey = keyof typeof DEMO;
export interface DemoRow {
  /** The record a table row stands for (an activity, ticket, order, offer, address or service). */
  [k: string]: unknown;
}

/** Each field's value, from the customer's context (and the row, for table cells). */
export const DEMO = {
  customerSince: (c: DemoCtx) => `${fmt(customerSince(c))} (${tenureText(c)})`,
  customerType: (c: DemoCtx) => (isBusiness(c) ? 'Business' : 'Individual'),
  topRechargeType: (c: DemoCtx) => str(c.data.digitalEngagement[0]?.lastRechargeType) ?? (lineType(c) === 'Prepaid' ? 'Voucher' : lineType(c) === 'Postpaid' ? 'Not applicable (postpaid)' : 'Not on file'),
  primaryBalance: (c: DemoCtx) => (lineType(c) === 'Postpaid' ? 'QAR 0' : lineType(c) === 'Prepaid' ? `QAR ${10 + (hash(customerId(c)) % 40)}.50` : 'Not on file'),
  leadClosedOn: () => fmt(addDays(TODAY, -1)),
  leadCreatedOn: (c: DemoCtx) => fmt(addDays(TODAY, -(3 + (hash(customerId(c)) % 10)))),
  activityLocation: (c: DemoCtx, r?: DemoRow) => (r?.type === 'System' || r?.type === 'System Activity' ? 'System' : str(c.data.addresses[0]?.city) ?? 'Doha'),
  activityChannel: (_c: DemoCtx, r?: DemoRow) => (/ticket/i.test(String(r?.type)) ? 'Call Center' : /system|oob/i.test(String(r?.type)) ? 'System' : /payment/i.test(String(r?.type)) ? 'Mobile App' : 'Retail Store'),
  activityUser: (_c: DemoCtx, r?: DemoRow) => (/system|oob/i.test(String(r?.type)) ? 'System' : 'USR-1101'),
  activityDateTime: (_c: DemoCtx, r?: DemoRow) => fmtTime(addDays(TODAY, -(2 + (hash(String(r?.id ?? 'x')) % 20))), 10, 15),
  relatedTicket: (c: DemoCtx) => str(c.data.tickets[0]?.ticketId) ?? 'None',
  relatedOffer: (c: DemoCtx) => str(c.data.crossSalesOffers[0]?.offerName) ?? 'None',
  activityRemarks: (_c: DemoCtx, r?: DemoRow) => `${String(r?.type ?? 'Activity')} handled and recorded by the agent.`,
  area: (c: DemoCtx) => AREAS[String(c.data.addresses[0]?.zone)] ?? city(c),
  stateProvince: (c: DemoCtx) => (city(c) === 'Doha' ? 'Doha Municipality' : `${city(c)} Municipality`),
  addressSource: () => 'NAS',
  serviceAvailability: () => 'Available',
  lastChecked: () => fmtTime(addDays(TODAY, -1), 9, 24),
  creditScore: (c: DemoCtx) => String(meta(c).creditScore ?? (benefits(c).includes('loyalty') ? 'Excellent' : 'Good')),
  eligibilityPtp: (c: DemoCtx) => (outstanding(c) > 0 ? 'Yes' : 'No'),
  ogBarringDate: (c: DemoCtx) => fmt(addDays(nextDue(c), 15)),
  icBarringDate: (c: DemoCtx) => fmt(addDays(nextDue(c), 30)),
  amountAvoidBarring: (c: DemoCtx) => `QAR ${outstanding(c).toLocaleString('en-US')}`,
  specialManagement: () => 'No',
  fraudRisk: () => 'Low',
  alertRaisedOn: () => fmt(addDays(TODAY, -3)),
  billDate: (_c: DemoCtx, r?: DemoRow) => {
    const p = /^(\d{4})-(\d{2})/.exec(String(r?.period ?? ''));
    return p ? fmt(new Date(Number(p[1]), Number(p[2]), 1)) : fmt(addDays(TODAY, -40));
  },
  secondaryMsisdn: (c: DemoCtx) => `${primaryPhone(c).slice(0, 9)}${String(1000 + (hash(customerId(c)) % 8000)).padStart(4, '0')}`,
  alternateEmail: (c: DemoCtx) => `${c.data.customer.name.toLowerCase().split(/\s+/).filter(Boolean).filter((_, i, a) => i === 0 || i === a.length - 1).join('.').replace(/[^a-z.]/g, '')}@example.com`,
  emailValidation: () => 'Verified',
  accountRole: () => 'Primary Account Holder',
  contactRole: () => 'Owner',
  offerValidity: () => '31 Dec 2026',
  offerBenefits: (_c: DemoCtx, r?: DemoRow) => (/500/.test(String(r?.name)) ? '250 GB data, unlimited local minutes' : /350/.test(String(r?.name)) ? '150 GB data, unlimited local minutes' : 'Data and unlimited local minutes'),
  orderRelatedOffers: (c: DemoCtx) => discountName(c),
  orderFulfilment: (_c: DemoCtx, r?: DemoRow) => (/draft/i.test(String(r?.status)) ? 'Awaiting submission' : /complete/i.test(String(r?.status)) ? 'SIM issued' : 'In progress'),
  orderNotes: (_c: DemoCtx, r?: DemoRow) => (/draft/i.test(String(r?.status)) ? 'Draft saved; customer to confirm the plan.' : 'Customer collected the SIM at the store.'),
  serviceAddons: () => '0',
  serviceBalance: (_c: DemoCtx, r?: DemoRow) => (/fibre|gigahome|broadband|tv/i.test(String(r?.category)) ? 'Unlimited' : 'QAR 0'),
  serviceBillLimit: (_c: DemoCtx, r?: DemoRow) => (/fibre|gigahome|broadband|tv/i.test(String(r?.category)) ? 'QAR 500' : 'QAR 1,000'),
  activationDate: (c: DemoCtx, r?: DemoRow) => fmt(r?.from ? new Date(String(r.from)) : addMonths(customerSince(c), 1)),
  contractEnd: (c: DemoCtx, r?: DemoRow) => {
    // 24-month terms, renewed: the end date is the first term end after today.
    const start = r?.from ? new Date(String(r.from)) : addMonths(customerSince(c), 1);
    let end = addMonths(start, 24);
    while (end.getTime() <= TODAY.getTime()) end = addMonths(end, 24);
    return fmt(end);
  },
  discount: (c: DemoCtx) => discountName(c),
  simSerial: (c: DemoCtx) => str(c.data.orders.find((o) => o.simSerial)?.simSerial) ?? `89744120${String(10000000000 + (hash(customerId(c)) % 80000000000))}`,
  ticketService: (c: DemoCtx) => primaryPhone(c),
  ticketAssignedTo: (_c: DemoCtx, r?: DemoRow) => str(r?.queue) ?? 'Complaints Team',
  ticketNotes: (_c: DemoCtx, r?: DemoRow) => `Customer reported ${String(r?.issue ?? 'the issue').toLowerCase()}; under review.`,
} satisfies Record<string, (c: DemoCtx, r?: DemoRow) => string>;


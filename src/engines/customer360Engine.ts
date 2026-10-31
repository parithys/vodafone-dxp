import * as mockDataEngine from './mockDataEngine';
import { outstandingBalance, unpaidInvoiceTotal } from './billingBalance';
import { planOfAsset } from './customerServicesEngine';
import { formatMonthYear } from '../lib/format';


export interface CustomerRecord {
  customerId: string;
  /** INDIVIDUAL for every customer record; a BUSINESS is an enterprise account (businessAccountEngine). */
  accountType?: 'INDIVIDUAL';
  /** The ENT-ACC ID of the business this user is linked to, and who pays - which decides the segment (businessSegment.ts). */
  parentBusinessId?: string;
  billingResponsibility?: 'COMPANY' | 'USER';
  qid: string;
  idType: 'QID' | 'Passport';
  name: string;
  dob: string;
  nationality: string;
  segment: string;
  email?: string;
  phone?: string;
  preferredLanguage?: string;
  /** Benefits the customer holds (retired | mada | b2b2c | loyalty | prepaid-welcome) - see customerBenefitEngine. */
  benefitEligibility?: string[];
  blacklisted: boolean;
  /** Free-text reason, present in customers.json but previously untyped. */
  blacklistReason?: string;
  /**
   * Which KIND of block, seeded 2026-09-25. The eligibility matrix treats a
   * collections block (soft stop for postpaid, prepaid offered) and a security
   * block (hard stop) as different outcomes, which `blacklisted` alone cannot
   * express. Absent means the block is unclassified, which the eligibility
   * engine treats as a hard stop rather than guessing the lenient branch.
   */
  blacklistCategory?: 'collections' | 'security';
  moiValidationStatus?: string;
  hrnAdvancePaymentRequired?: boolean;
  activePostpaidLines?: number;
  /** Present in customers.json all along; the type was simply not carrying it. */
  activePrepaidLines?: number;
  /**
   * The relationship of the line `phone` identifies - i.e. of the single
   * number, not of the customer. Seeded 2026-09-25 because the two line
   * COUNTS above describe a whole customer and so cannot answer "is this
   * number prepaid or postpaid", which is what the queue notification asks:
   * a customer holding both kinds made them report both at once.
   *
   * Absent for a customer with no active lines, which is a real state here -
   * four of the eight seeded customers are registered with no line at all.
   */
  lineType?: 'Prepaid' | 'Postpaid';
  /** DF-DEMO-001-007 completeness (CUS-001-CAM-08) */
  age?: number;
  gender?: string;
}

export interface AccountRecord {
  accountId: string;
  customerId: string;
  accountType: string;
  status: string;
  billingProfileId?: string;
  subAccountIds?: string[];
  parentAccountId?: string;
  /** Account Information's AM name/mobile/email/escalation-contact fields -
   * seeded on ACC-5001 only (accounts.json's own _amNote), not every
   * account, since Business Care is the only department the source marks
   * Real Time for these. Absent on every other account. */
  accountManagerName?: string;
  accountManagerMobile?: string;
  accountManagerEmail?: string;
  backupAccountManagerName?: string;
  escalationContact?: string;
}

export type CustomerSearchField = 'mobile' | 'qid' | 'customerNumber' | 'accountNumber' | 'name' | 'email' | 'serviceId' | 'idDocument';

export interface CustomerSearchResult {
  customer: CustomerRecord;
  matchedOn: CustomerSearchField[];
  /** Set when the query matched an identity document number (which can differ from the customer record's own `qid`). */
  matchedDocumentNumber?: string;
}

// Universal lookup shared by Customer Search, Support's "create ticket for a
// customer" flow, and Orders - built once rather than re-implemented per
// consumer. "Service ID" has no dedicated field on the customer record
// itself; it's matched via installed-assets.serviceId joined back through
// the owning account.
export async function searchCustomers(query: string): Promise<CustomerSearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const [customers, accounts, installedAssets, identityDocs] = await Promise.all([
    mockDataEngine.list<CustomerRecord>('customers'),
    mockDataEngine.list<AccountRecord>('accounts'),
    mockDataEngine.list<{ accountId: string; serviceId?: string }>('installed-assets'),
    mockDataEngine.list<{ customerId: string; documentNumber: string }>('identity-documents'),
  ]);

  const results: CustomerSearchResult[] = [];
  for (const customer of customers) {
    const matched: CustomerSearchField[] = [];
    if (customer.phone?.toLowerCase().includes(q)) matched.push('mobile');
    if (customer.qid?.toLowerCase().includes(q)) matched.push('qid');
    if (customer.customerId.toLowerCase().includes(q)) matched.push('customerNumber');
    // Every typed word must appear in the full name, in any position: a
    // multi-part name ("Ahmed Abdulla Hassan Al-Sulaiti") must still be found by
    // "first + last" ("Ahmed Al-Sulaiti"), which a plain substring match misses.
    const nameLower = customer.name?.toLowerCase() ?? '';
    if (nameLower && q.split(/\s+/).filter(Boolean).every((w) => nameLower.includes(w))) matched.push('name');
    if (customer.email?.toLowerCase().includes(q)) matched.push('email');
    // The ID an agent reads off a card is the identity DOCUMENT's number, which
    // is what the ID lookup steps resolve on; the customer record's own `qid`
    // can differ from it, so match the documents too.
    const doc = identityDocs.find((d) => d.customerId === customer.customerId && d.documentNumber.toLowerCase().includes(q));
    if (doc && !customer.qid?.toLowerCase().includes(q)) matched.push('idDocument');

    const customerAccounts = accounts.filter((a) => a.customerId === customer.customerId);
    if (customerAccounts.some((a) => a.accountId.toLowerCase().includes(q))) matched.push('accountNumber');

    const customerAccountIds = new Set(customerAccounts.map((a) => a.accountId));
    if (installedAssets.some((asset) => customerAccountIds.has(asset.accountId) && asset.serviceId?.toLowerCase().includes(q))) {
      matched.push('serviceId');
    }

    if (matched.length > 0) results.push({ customer, matchedOn: matched, matchedDocumentNumber: matched.includes('idDocument') ? doc?.documentNumber : undefined });
  }
  return results;
}

export interface Customer360Data {
  customer: CustomerRecord;
  accounts: AccountRecord[];
  billingProfiles: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  bills: Record<string, unknown>[];
  payments: Record<string, unknown>[];
  adjustments: Record<string, unknown>[];
  creditLimits: Record<string, unknown>[];
  deposits: Record<string, unknown>[];
  /** Deposit bundles on the customer's accounts (they raise the credit limit - see engines/creditLimit.depositIncreaseOf). */
  depositBundles: Record<string, unknown>[];
  tickets: Record<string, unknown>[];
  simSwapOrders: Record<string, unknown>[];
  installedAssets: Record<string, unknown>[];
  cafForms: Record<string, unknown>[];
  identityDocuments: Record<string, unknown>[];
  activities: Record<string, unknown>[];
  notifications: Record<string, unknown>[];
  contacts: Record<string, unknown>[];
  addresses: Record<string, unknown>[];
  penalties: Record<string, unknown>[];
  serviceUsage: Record<string, unknown>[];
  inPlatformBalances: Record<string, unknown>[];
  callDetailRecords: Record<string, unknown>[];
  communications: Record<string, unknown>[];
  /** Field-level change history (audit-trail.json), joined by recordId
   * against this customer's own account/contact ids - Customer 360's
   * "Audit Trail" tab. */
  auditTrail: Record<string, unknown>[];
  /** Pre-sale leads (leads.json), joined by mobileNumber against the
   * customer's phone - Customer 360's "Account/Contact Lead" tab. The two
   * seeded leads don't match any of this corpus's customers, so this is
   * legitimately empty today rather than a broken join. */
  leads: Record<string, unknown>[];
  /** Targeted cross-sell offers (cross-sales-offers.json), joined by
   * contactId against this customer's own contact record ids - Customer
   * 360's "Contact/Assets Information" tab. The seeded offers' contactId
   * (CONT-3001) doesn't match this corpus's contactRecordId values
   * (CTC-40xx), so this is legitimately empty today rather than a broken
   * join. */
  crossSalesOffers: Record<string, unknown>[];
  /** Device-on-installment plans (device-installments.json), joined by
   * accountId - also feeds "Contact/Assets Information". */
  deviceInstallments: Record<string, unknown>[];
  /** Add-on/discount catalogue entries (addons-discounts.json), joined by
   * planId against the catalogue plans this customer's own installed assets are on (assetPlanIds) -
   * Assets' Pending Discounts/Active Add-on/Active Discount/Discount Expiry
   * fields. Verified real overlap (PROD-100/200/201 appear in both files),
   * unlike leads/crossSalesOffers above. */
  /** The catalogue plan of each of the customer's installed assets (by installedAssetId), undefined where it cannot be established. */
  assetPlanIds: Record<string, string | undefined>;
  addonsDiscounts: Record<string, unknown>[];
  /** Authorized third parties on an account (authorised-contacts.json),
   * joined by accountId - Contact Information's "Authorized person(s)/
   * Role/email" fields. Carries no phone/mobile field, so "Authorized
   * Mobile" stays unbacked even where this join has rows. */
  authorisedContacts: Record<string, unknown>[];
  /** Transfer-of-ownership cases (ton-cases.json), joined by this customer
   * appearing as partyA or partyB - Account Information's "Pending TON
   * requests" field. */
  tonCases: Record<string, unknown>[];
  /** Last recharge and app login / adoption (digital-engagement.json, a DEMO seed), joined by customerId. */
  digitalEngagement: Record<string, unknown>[];
  /** About-to-bar, eligible discount, phone version, allowances (customer-overview-extras.json, a DEMO seed). */
  overviewExtras: Record<string, unknown>[];
  /** Per-customer demo rows for the Telesales Overview sections (customer-overview-demo.json), used where real records are missing. */
  overviewDemo: Record<string, unknown>[];
  /** Shared demo offer catalogue (telesales-demo-catalog.json). */
  demoCatalog: Record<string, unknown>[];
}

// Read-side aggregation - no unified "Customer 360" entity exists in the mock
// data layer, so this joins across the entity kinds that already carry a
// customerId (orders/bills/payments/adjustments/creditLimits/tickets/
// cafForms/identityDocuments) or an indirect key (accounts.customerId for
// billing profiles/deposits/installed-assets/activities; orders.customerId
// for sim-swap-orders via msisdn and for order-triggered notifications).
export async function getCustomer360(customerId: string): Promise<Customer360Data | undefined> {
  const [
    customers,
    accounts,
    billingProfiles,
    orders,
    bills,
    payments,
    adjustments,
    creditLimits,
    deposits,
    tickets,
    simSwapOrders,
    installedAssets,
    cafForms,
    identityDocuments,
    activities,
    notifications,
    contacts,
    addresses,
    penalties,
    serviceUsage,
    inPlatformBalances,
    callDetailRecords,
    communications,
    auditTrail,
    leads,
    crossSalesOffers,
    deviceInstallments,
    addonsDiscounts,
    authorisedContacts,
    tonCases,
    digitalEngagement,
    overviewExtras,
    overviewDemo,
    demoCatalog,
    products,
    depositBundles,
  ] = await Promise.all([
    mockDataEngine.list<CustomerRecord>('customers'),
    mockDataEngine.list<AccountRecord>('accounts'),
    mockDataEngine.list<Record<string, unknown>>('billing-profiles'),
    mockDataEngine.list<Record<string, unknown>>('orders'),
    mockDataEngine.list<Record<string, unknown>>('bills'),
    mockDataEngine.list<Record<string, unknown>>('payments'),
    mockDataEngine.list<Record<string, unknown>>('adjustments'),
    mockDataEngine.list<Record<string, unknown>>('credit-limits'),
    mockDataEngine.list<Record<string, unknown>>('consumer-deposits'),
    mockDataEngine.list<Record<string, unknown>>('trouble-tickets'),
    mockDataEngine.list<Record<string, unknown>>('sim-swap-orders'),
    mockDataEngine.list<Record<string, unknown>>('installed-assets'),
    mockDataEngine.list<Record<string, unknown>>('caf-forms'),
    mockDataEngine.list<Record<string, unknown>>('identity-documents'),
    mockDataEngine.list<Record<string, unknown>>('customer-activities'),
    mockDataEngine.list<Record<string, unknown>>('osb-notifications'),
    mockDataEngine.list<Record<string, unknown>>('customer-contacts'),
    mockDataEngine.list<Record<string, unknown>>('addresses'),
    mockDataEngine.list<Record<string, unknown>>('commitment-penalties'),
    mockDataEngine.list<Record<string, unknown>>('service-usage'),
    mockDataEngine.list<Record<string, unknown>>('in-platform-balances'),
    mockDataEngine.list<Record<string, unknown>>('call-detail-records'),
    mockDataEngine.list<Record<string, unknown>>('customer-communications'),
    mockDataEngine.list<Record<string, unknown>>('audit-trail'),
    mockDataEngine.list<Record<string, unknown>>('leads'),
    mockDataEngine.list<Record<string, unknown>>('cross-sales-offers'),
    mockDataEngine.list<Record<string, unknown>>('device-installments'),
    mockDataEngine.list<Record<string, unknown>>('addons-discounts'),
    mockDataEngine.list<Record<string, unknown>>('authorised-contacts'),
    mockDataEngine.list<Record<string, unknown>>('ton-cases'),
    mockDataEngine.list<Record<string, unknown>>('digital-engagement'),
    mockDataEngine.list<Record<string, unknown>>('customer-overview-extras'),
    mockDataEngine.list<Record<string, unknown>>('customer-overview-demo'),
    mockDataEngine.list<Record<string, unknown>>('telesales-demo-catalog'),
    mockDataEngine.list<{ productId: string; name: string; type: string }>('products'),
    mockDataEngine.list<Record<string, unknown>>('deposit-bundles'),
  ]);

  const customer = customers.find((c) => c.customerId === customerId);
  if (!customer) return undefined;

  const customerAccounts = accounts.filter((a) => a.customerId === customerId);
  const accountIds = new Set(customerAccounts.map((a) => a.accountId));
  const billingProfileIds = new Set(customerAccounts.map((a) => a.billingProfileId).filter(Boolean));
  const customerOrders = orders.filter((o) => o.customerId === customerId);
  const orderIds = new Set(customerOrders.map((o) => o.orderId));
  const customerMsisdns = new Set(customerOrders.map((o) => o.msisdn).filter(Boolean));
  const customerContacts = contacts.filter((c) => c.customerId === customerId);
  const contactIds = new Set(customerContacts.map((c) => c.contactRecordId));
  const recordIds = new Set([...accountIds, ...contactIds]);
  const customerInstalledAssets = installedAssets.filter((ia) => accountIds.has(ia.accountId as string));
  // The catalogue plan each asset is on (customerServicesEngine.planOfAsset): the promotion code alone is not trusted to name it.
  const assetPlanIds: Record<string, string | undefined> = {};
  for (const ia of customerInstalledAssets) {
    assetPlanIds[String(ia.installedAssetId)] = planOfAsset({ productServiceName: ia.productServiceName as string | undefined, promotion: ia.promotion as string | undefined }, products)?.productId;
  }
  const promotionIds = new Set(Object.values(assetPlanIds).filter(Boolean));

  return {
    customer,
    accounts: customerAccounts,
    billingProfiles: billingProfiles.filter((bp) => billingProfileIds.has(bp.billingProfileId as string)),
    orders: customerOrders,
    bills: bills.filter((b) => b.customerId === customerId),
    payments: payments.filter((p) => p.customerId === customerId),
    adjustments: adjustments.filter((a) => a.customerId === customerId),
    creditLimits: creditLimits.filter((cl) => cl.customerId === customerId),
    deposits: deposits.filter((d) => accountIds.has(d.accountId as string)),
    // The deposits on the customer's accounts AND on the account their credit-limit record is held on (which need not be one of their own - CRL-4003).
    depositBundles: depositBundles.filter(
      (d) => accountIds.has(d.accountId as string) || creditLimits.some((cl) => cl.customerId === customerId && cl.accountId === d.accountId)
    ),
    tickets: tickets.filter((t) => t.customerId === customerId),
    simSwapOrders: simSwapOrders.filter((s) => customerMsisdns.has(s.msisdn as string)),
    installedAssets: customerInstalledAssets,
    cafForms: cafForms.filter((f) => f.customerId === customerId),
    identityDocuments: identityDocuments.filter((d) => d.customerId === customerId),
    activities: activities.filter((a) => accountIds.has(a.accountId as string) || a.customerId === customerId),
    notifications: notifications.filter((n) => orderIds.has(n.orderId as string)),
    contacts: customerContacts,
    addresses: addresses.filter((a) => a.customerId === customerId),
    penalties: penalties.filter((p) => p.customerId === customerId),
    serviceUsage: serviceUsage.filter((u) => accountIds.has(u.accountId as string)),
    inPlatformBalances: inPlatformBalances.filter((b) => accountIds.has(b.accountId as string)),
    callDetailRecords: callDetailRecords.filter((c) => accountIds.has(c.accountId as string)),
    communications: communications.filter((c) => c.customerId === customerId),
    // A row belongs to the customer when it is about one of their accounts or contacts - or about the customer themself (a credit-limit change made with no account yet).
    auditTrail: auditTrail.filter((r) => recordIds.has(r.recordId as string) || r.recordId === customerId),
    leads: leads.filter((l) => l.mobileNumber && l.mobileNumber === customer.phone),
    crossSalesOffers: crossSalesOffers.filter((o) => contactIds.has(o.contactId as string)),
    deviceInstallments: deviceInstallments.filter((d) => accountIds.has(d.accountId as string)),
    assetPlanIds,
    addonsDiscounts: addonsDiscounts.filter((ad) => promotionIds.has(ad.planId as string)),
    authorisedContacts: authorisedContacts.filter((ac) => accountIds.has(ac.accountId as string)),
    tonCases: tonCases.filter((t) => {
      const partyA = t.partyA as { customerId?: string } | undefined;
      const partyB = t.partyB as { customerId?: string } | undefined;
      return partyA?.customerId === customerId || partyB?.customerId === customerId;
    }),
    digitalEngagement: digitalEngagement.filter((d) => d.customerId === customerId),
    overviewExtras: overviewExtras.filter((d) => d.customerId === customerId),
    overviewDemo: overviewDemo.filter((d) => d.customerId === customerId),
    demoCatalog,
  };
}

function formatBillPeriod(period: unknown): string {
  const match = /^(\d{4})-(\d{2})$/.exec(String(period ?? ''));
  if (!match) return String(period ?? '-');
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return formatMonthYear(date);
}

export interface BillingSummary {
  creditLimit: Record<string, unknown> | undefined;
  latestBill: Record<string, unknown> | undefined;
  billedTotal: number;
  paidTotal: number;
  outstanding: number;
  formattedBillPeriod: string;
  /** CUS-001-BIV-04: the most recent payment on file, isolated as its own
   * atomic field rather than requiring the agent to scan the full Payments
   * table for it. */
  previousPayment: Record<string, unknown> | undefined;
}

// CUS-001-BIV-26: hard 12-month boundary on billing history - "now" is the
// fixed session date (2026-09-14) rather than a live Date.now() call, since
// this mock app has no real clock-driven billing cycle.
const BILL_HISTORY_MONTHS = 12;
const SESSION_TODAY = new Date(2026, 8, 14); // 2026-09-14

export function withinBillHistoryWindow(billPeriod: unknown): boolean {
  const match = /^(\d{4})-(\d{2})$/.exec(String(billPeriod ?? ''));
  if (!match) return true; // unparseable period - don't silently hide it
  const period = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  const cutoff = new Date(SESSION_TODAY.getFullYear(), SESSION_TODAY.getMonth() - BILL_HISTORY_MONTHS, 1);
  return period >= cutoff;
}

// Shared by the Billing tab (full detail) and the Customer 360 header's KPI
// strip (headline numbers only) - one source of truth for "what does this
// customer currently owe" rather than two divergent calculations.
export function computeBillingSummary(data: Customer360Data): BillingSummary {
  const creditLimit = data.creditLimits[0];
  const billsInWindow = data.bills.filter((b) => withinBillHistoryWindow(b.billPeriod));
  const latestBill = [...billsInWindow].sort((a, b) =>
    String(a.billPeriod ?? '').localeCompare(String(b.billPeriod ?? '')),
  ).at(-1);
  const previousPayment = [...data.payments].sort((a, b) =>
    String(a.capturedAt ?? '').localeCompare(String(b.capturedAt ?? '')),
  ).at(-1);

  const billedTotal = unpaidInvoiceTotal(data.bills);
  const paidTotal = data.payments.reduce((sum, p) => sum + Number(p.amountQar ?? 0), 0);
  // What the customer owes is the one shared definition (billingBalance.ts): issued, unsettled invoices less collected bill payments - not every
  // payment, and not only the invoices inside the history window (a debt does not age out).
  const outstanding = outstandingBalance(data.bills, data.payments);

  return {
    previousPayment,
    creditLimit,
    latestBill,
    billedTotal,
    paidTotal,
    outstanding,
    formattedBillPeriod: latestBill ? formatBillPeriod(latestBill.billPeriod) : '-',
  };
}

export function toActiveCustomerSummary(customer: CustomerRecord) {
  return {
    customerId: customer.customerId,
    name: customer.name,
    qid: customer.qid,
    idType: customer.idType,
    dob: customer.dob,
    nationality: customer.nationality,
    email: customer.email,
    phone: customer.phone,
    segment: customer.segment,
    blacklisted: customer.blacklisted,
    benefitEligibility: customer.benefitEligibility ?? [],
  };
}

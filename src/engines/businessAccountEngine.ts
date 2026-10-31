import * as mockDataEngine from './mockDataEngine';
import { hasB2b2cBenefit, segmentFor, type BillingResponsibility, type LinkedUserSegment } from './businessSegment';

// A business customer: an enterprise account (accountType BUSINESS) with linked users. Each linked user is an
// individual customer that carries `parentBusinessId` and `billingResponsibility`; their segment is derived from
// the latter (businessSegment.ts), never stored.

export interface BusinessRecord {
  enterpriseAccountId: string;
  accountType?: 'BUSINESS';
  level?: string;
  name: string;
  crNumber?: string;
  businessType?: string;
  accountManagerName?: string;
  accountManagerMobile?: string;
  accountManagerEmail?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

interface LinkedCustomerRow {
  customerId: string;
  name: string;
  phone?: string;
  email?: string;
  qid?: string;
  parentBusinessId?: string;
  billingResponsibility?: BillingResponsibility;
}
interface AccountRow {
  accountId: string;
  customerId: string;
}

export interface LinkedUser {
  customerId: string;
  name: string;
  /** The user's billing account, falling back to their customer ID. */
  subscriberId: string;
  mobile?: string;
  billingResponsibility: BillingResponsibility;
  segment: LinkedUserSegment;
  /** Who receives the bill: the company for COMPANY, the user for USER. */
  billRecipient: string;
  b2b2cBenefit: boolean;
  parentBusinessId: string;
}

export interface BusinessAccount {
  account: BusinessRecord;
  users: LinkedUser[];
}

function linkedUsers(business: BusinessRecord, customers: LinkedCustomerRow[], accounts: AccountRow[]): LinkedUser[] {
  return customers
    .filter((c) => c.parentBusinessId === business.enterpriseAccountId && c.billingResponsibility)
    .map((c) => {
      const billing = c.billingResponsibility as BillingResponsibility;
      return {
        customerId: c.customerId,
        name: c.name,
        subscriberId: accounts.find((a) => a.customerId === c.customerId)?.accountId ?? c.customerId,
        mobile: c.phone,
        billingResponsibility: billing,
        segment: segmentFor(billing),
        billRecipient: billing === 'COMPANY' ? business.name : c.name,
        b2b2cBenefit: hasB2b2cBenefit(billing),
        parentBusinessId: business.enterpriseAccountId,
      };
    });
}

async function load() {
  const [businesses, customers, accounts] = await Promise.all([
    mockDataEngine.list<BusinessRecord>('enterprise-accounts'),
    mockDataEngine.list<LinkedCustomerRow>('customers'),
    mockDataEngine.list<AccountRow>('accounts'),
  ]);
  return { businesses: businesses.filter((b) => b.accountType === 'BUSINESS'), customers, accounts };
}

export async function getBusinessAccount(id: string): Promise<BusinessAccount | undefined> {
  const { businesses, customers, accounts } = await load();
  const account = businesses.find((b) => b.enterpriseAccountId.toLowerCase() === id.toLowerCase());
  return account ? { account, users: linkedUsers(account, customers, accounts) } : undefined;
}

/** Parent business accounts whose ID, name or CR number contains the query. */
export async function searchBusinessAccounts(query: string): Promise<BusinessAccount[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { businesses, customers, accounts } = await load();
  return businesses
    .filter((b) => b.level === 'parent' && [b.enterpriseAccountId, b.name, b.crNumber].some((v) => v?.toLowerCase().includes(q)))
    .map((account) => ({ account, users: linkedUsers(account, customers, accounts) }));
}

export type LinkedBusinessLookup =
  | { status: 'none' }
  | { status: 'unresolved'; parentBusinessId: string }
  | { status: 'linked'; business: BusinessRecord; billingResponsibility: BillingResponsibility; segment: LinkedUserSegment };

/** For an individual's profile: the business they are linked to, if any (and whether that link resolves). */
export async function getLinkedBusiness(customerId: string): Promise<LinkedBusinessLookup> {
  const { businesses, customers } = await load();
  const me = customers.find((c) => c.customerId === customerId);
  if (!me?.parentBusinessId) return { status: 'none' };
  const business = businesses.find((b) => b.enterpriseAccountId === me.parentBusinessId);
  const billing = me.billingResponsibility;
  if (!business || !billing) return { status: 'unresolved', parentBusinessId: me.parentBusinessId };
  return { status: 'linked', business, billingResponsibility: billing, segment: segmentFor(billing) };
}

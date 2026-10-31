import * as mockDataEngine from '../../engines/mockDataEngine';
import { LIVE_SERVICE_STATUSES, mobileLineTypeOfName, planOfAsset } from '../../engines/customerServicesEngine';

// The customer's existing mobile lines, for the journeys that change one (Change Postpaid Plan, Change Prepaid Pack, Add Add-On).

export type LineType = 'postpaid' | 'prepaid';

export interface CustomerLine {
  installedAssetId: string;
  customerId: string;
  /** The MSISDN where the record carries one, otherwise the service id. */
  identifier: string;
  /**
   * The catalogue plan or pack the line is on, found by the line's service name. Undefined when the name is not in the catalogue: the record's
   * promotion code is NOT used as a stand-in, because it does not say what the line is (60 postpaid lines carry the code of an FWA plan).
   */
  productId?: string;
  productName: string;
  lineType: LineType;
  /** Postpaid: the monthly rental. Prepaid: the pack's starter charge. Undefined when the record carries no usable price and the catalogue has none for the line's plan. */
  priceQAR?: number;
  status: string;
  accountId: string;
  billingProfileId?: string;
  /** The account is barred (fully or partly). */
  barred: boolean;
  /** The billing profile is not in good standing. */
  inCollections: boolean;
}

interface AssetRecord {
  installedAssetId: string;
  accountId: string;
  billingProfileId?: string;
  productServiceName: string;
  serviceId: string;
  status: string;
  price?: number;
}
interface AccountRecord {
  accountId: string;
  customerId: string;
  barringStatus?: string;
}
interface ProductRecord {
  productId: string;
  name: string;
  type: string;
  mrcQAR?: number;
  starterPackChargeQAR?: number;
}
interface BillingProfileRecord {
  billingProfileId: string;
  collectionStatus?: string;
}

/**
 * Why a line cannot be changed, or undefined when it can. From the Future Dated Orders training pack's plan-change validations
 * (a non-collections billing profile, a non-barred MSISDN) and the line having to be active.
 */
export function lineIneligibility(line: CustomerLine, opts: { requirePlan?: boolean } = {}): string | undefined {
  if (line.status !== 'Active') return `The line is ${line.status.toLowerCase()}.`;
  if (line.barred) return 'The line is barred.';
  if (line.inCollections) return 'The billing profile is in collections.';
  // Add-ons are offered by plan; a line whose plan is not in the catalogue has none to offer them for (and none is guessed from its promotion code).
  if (opts.requirePlan && !line.productId) return "The line's plan is not in the catalogue, so its add-ons cannot be offered.";
  return undefined;
}

/** The customer's mobile lines of the type (any type when omitted), postpaid and prepaid, in the order the records hold them. */
export async function loadCustomerLines(customerId: string, lineType?: LineType): Promise<CustomerLine[]> {
  const [assets, accounts, products, profiles] = await Promise.all([
    mockDataEngine.list<AssetRecord>('installed-assets'),
    mockDataEngine.list<AccountRecord>('accounts'),
    mockDataEngine.list<ProductRecord>('products'),
    mockDataEngine.list<BillingProfileRecord>('billing-profiles'),
  ]);
  const own = new Map(accounts.filter((a) => a.customerId === customerId).map((a) => [a.accountId, a]));
  const lines: CustomerLine[] = [];
  for (const asset of assets) {
    const account = own.get(asset.accountId);
    // The same definition Customer 360 lists services by (customerServicesEngine): its kind from the service name, only services the customer holds.
    const type = mobileLineTypeOfName(asset.productServiceName);
    if (!account || !type || !LIVE_SERVICE_STATUSES.includes(asset.status) || (lineType && type !== lineType)) continue;
    // The plan the same way Customer 360 establishes it (customerServicesEngine.planOfAsset): by name or by code, only when the product fits the service.
    const product = planOfAsset(asset, products);
    const profile = profiles.find((b) => b.billingProfileId === asset.billingProfileId);
    lines.push({
      installedAssetId: asset.installedAssetId,
      customerId,
      identifier: asset.serviceId,
      productId: product?.productId,
      productName: asset.productServiceName,
      lineType: type,
      // A recorded price of 0 on a priced plan is not a price (8 prepaid records carry 0 for a QAR 25-100 pack): fall back to the catalogue, else unknown.
      priceQAR: [asset.price, type === 'postpaid' ? product?.mrcQAR : product?.starterPackChargeQAR].find((p): p is number => typeof p === 'number' && p > 0),
      status: asset.status,
      accountId: asset.accountId,
      billingProfileId: asset.billingProfileId,
      barred: Boolean(account.barringStatus) && account.barringStatus !== 'Not Barred',
      inCollections: Boolean(profile?.collectionStatus) && profile?.collectionStatus !== 'Good Standing',
    });
  }
  return lines;
}

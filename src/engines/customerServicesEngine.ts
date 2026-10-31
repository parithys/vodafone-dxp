import type { AccountRecord, CustomerRecord } from './customer360Engine';

/** Which Customer 360 tab owns a service type - the tab a link opens. */
export type ServiceTab = 'mobile' | 'fibre' | 'assets';

/**
 * Display categories for the grouped view, in display order.
 *
 * Derived from the 2026-09-25 example list, restricted to what this corpus
 * can actually evidence. Two of that list's categories are deliberately
 * absent rather than rendered as zero:
 *
 *   - 'GigaHome 5G' - nothing distinguishes an FWA/5G home service from fibre
 *     in any dataset here. There is no field to read.
 *   - 'Fixed Line' - accounts.json has "Consumer Fixed Line (GigaHome)", but
 *     that is the fibre account, not a separate fixed-voice service; counting
 *     it would double-count the GigaHome subscription hanging off it. (Since
 *     2026-10-11 an installed asset NAMED as a fixed voice line / landline does
 *     count here - the name is the signal, the account type still is not.)
 *
 * Both are left in this list so the order is stable if the data arrives later
 * - a category with no services simply never renders.
 */
export const SERVICE_CATEGORY_ORDER = [
  'Prepaid',
  'Postpaid',
  'GigaHome Fibre',
  'GigaHome 5G',
  'TV / Entertainment',
  'Fixed Line',
  'Smart Devices',
  // A service whose name matches none of the above. It stays visible under its own heading rather than being counted as a service type it
  // was never shown to be.
  'Other',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORY_ORDER)[number];

export interface CustomerService {
  /**
   * Identifies this service in a deep link. The target tab matches on it to
   * decide which service to load, so it must be stable and unique within a
   * customer - an MSISDN, a service id, a bundle id or a device number.
   */
  ref: string;
  tab: ServiceTab;
  /** Which grouped row this service counts towards. */
  category: ServiceCategory;
  /** What the agent reads: "GigaHome 300 + OSNtv Basic", "Postpaid mobile line". */
  label: string;
  /** The clickable identifier, shown as the link text. */
  identifier: string;
  /** Only where the source carries one - these vocabularies are not uniform. */
  status?: string;
}

interface InstalledAsset {
  installedAssetId?: string;
  accountId?: string;
  productServiceName?: string;
  serviceId?: string;
  status?: string;
}
interface GigahomeSubscription {
  id?: string;
  customerId?: string;
  status?: string;
  acceptanceForm?: { planName?: string };
}
interface IptvBundle {
  iptvBundleId?: string;
  accountId?: string;
  stbCount?: number;
  removedByCustomer?: boolean;
}
interface SmartDevice {
  id?: string;
  customerId?: string;
  deviceCategory?: string;
  assignedNumber?: string;
}

export interface ServiceSources {
  accounts: AccountRecord[];
  installedAssets: InstalledAsset[];
  gigahome: GigahomeSubscription[];
  iptvBundles: IptvBundle[];
  smartDevices: SmartDevice[];
}

/**
 * THE definition of what kind of service an installed asset is, from its product / service name. Customer 360, the line-change journeys,
 * Connection Details and every other screen that has to say "is this a postpaid line, a prepaid line, a fibre service" use this one
 * function; nothing else interprets the name, the promotion code or the plan catalogue for that purpose (the promotion code on an
 * installed-asset record does not say what the service is: 60 postpaid mobile lines carry the code of an FWA plan).
 *
 * The dataset has no service-type field, so the name is the only signal - matched on, not guessed at. A name that matches nothing is
 * 'Other' (tab 'assets'), not forced into Mobile or Fibre.
 */
export function classifyProductName(name: string | undefined): { tab: ServiceTab; category: ServiceCategory } {
  const n = name ?? '';
  // Prepaid and Postpaid are what the NAME says. "SIM" or "mobile" alone does not say which, so a name with neither word is not filed as
  // postpaid (it was: "SIM Card", "Mobile ..." became Postpaid) - it is Other until someone decides what it is.
  if (/prepaid/i.test(n)) return { tab: 'mobile', category: 'Prepaid' };
  if (/postpaid/i.test(n)) return { tab: 'mobile', category: 'Postpaid' };
  if (/\biot\b|\bm2m\b/i.test(n)) return { tab: 'assets', category: 'Smart Devices' };
  if (/iptv|\bosn|\btv\b/i.test(n)) return { tab: 'fibre', category: 'TV / Entertainment' };
  if (/fixed[ -]?(voice )?line|landline/i.test(n)) return { tab: 'fibre', category: 'Fixed Line' };
  if (/broadband|fibre|fiber|gigahome|\bhome\b/i.test(n)) return { tab: 'fibre', category: 'GigaHome Fibre' };
  if (/\bsmart\b|tracker|\bplug\b|\bdevice/i.test(n)) return { tab: 'assets', category: 'Smart Devices' };
  return { tab: 'assets', category: 'Other' };
}

/** 'postpaid' / 'prepaid' for a mobile line, undefined for every other kind of service (fibre, TV, fixed line, devices, unclassified). */
export function mobileLineTypeOfName(name: string | undefined): 'postpaid' | 'prepaid' | undefined {
  const { category } = classifyProductName(name);
  return category === 'Postpaid' ? 'postpaid' : category === 'Prepaid' ? 'prepaid' : undefined;
}

/**
 * Which catalogue product types a service category can legitimately carry as its plan. An installed asset's `promotion` code is only a plan
 * when its product is of such a type: 60 postpaid mobile lines carry the code of an FWA 5G Home plan, a broadband service carries a postpaid
 * plan's, and neither is that service's plan. Categories with no entry (TV, devices, other) have no plan in the catalogue to find.
 */
const PLAN_TYPES_OF_CATEGORY: Partial<Record<ServiceCategory, readonly string[]>> = {
  Prepaid: ['Prepaid Plan'],
  Postpaid: ['Postpaid Plan'],
  'GigaHome Fibre': ['Fixed Line Plan', 'FWA 5G Home Plan'],
  'GigaHome 5G': ['FWA 5G Home Plan'],
  'Fixed Line': ['Fixed Line Plan'],
};

/**
 * THE catalogue plan an installed asset is on, or undefined when it cannot be established: the product of that name, else the product its
 * promotion code names - in both cases only if that product's type fits the kind of service the asset is (classifyProductName). A code
 * that contradicts the service is not taken as its plan, and the asset's plan stays unknown rather than guessed.
 */
export function planOfAsset<P extends { productId: string; name: string; type: string }>(
  asset: { productServiceName?: string; promotion?: string },
  products: readonly P[]
): P | undefined {
  const allowed = PLAN_TYPES_OF_CATEGORY[classifyProductName(asset.productServiceName).category];
  if (!allowed) return undefined;
  return (
    products.find((p) => p.name === asset.productServiceName && allowed.includes(p.type)) ??
    products.find((p) => p.productId === asset.promotion && allowed.includes(p.type))
  );
}

/** The installed-asset statuses that are a service the customer holds: the only ones Customer 360 lists, and so the only ones a journey offers. */
export const LIVE_SERVICE_STATUSES: readonly string[] = ['Active', 'Suspended'];

// Every active Vodafone service a customer holds, across the datasets that
// carry one - not just their mobile lines.
//
// Built because "Active lines" could only ever count MOBILE lines: the two
// count fields on the customer record are mobile-only, so a customer whose
// service is fibre or IoT read as having nothing at all. CUST-1003 holds an
// active GigaHome subscription and CUST-1004 holds GigaHome plus a smart plug,
// and both were reported as having no services.
//
// TWO LINKAGE RULES, deliberately different:
//
//   - customerId-keyed sources (gigahome, smart devices) resolve directly.
//   - account-keyed sources (installed assets, IPTV bundles) resolve through
//     accounts.json, which is the OWNER OF RECORD.
//
// That second rule matters because the seed contradicts itself on ACC-5004:
// accounts.json assigns it to CUST-2001 as an Enterprise parent, while four
// other files attach CUST-1004's credit limit, fibre and IoT device to it.
// Following accounts.json for account-keyed lookups keeps one answer rather
// than attributing the same service to two customers. The contradiction is a
// reference-data defect and is logged, not papered over here.
//
// Sources deliberately NOT used, because nothing links them to a customer:
// cpe-devices (customerId and accountId are null on all five records) and
// multi-sim-lines (customerId null on all four). Including them would mean
// inventing an owner.
export function listCustomerServices(customer: CustomerRecord, sources: ServiceSources): CustomerService[] {
  const services: CustomerService[] = [];
  const myAccountIds = new Set(
    sources.accounts.filter((a) => a.customerId === customer.customerId).map((a) => a.accountId)
  );

  // The mobile line the customer's own number identifies. Gated on lineType
  // rather than on `phone` alone: every customer record has a phone, but only
  // a customer with a live mobile line has a relationship on it, and a contact
  // number for a fibre-only customer is not a mobile service.
  if (customer.lineType && customer.phone) {
    services.push({
      ref: customer.phone,
      tab: 'mobile',
      // lineType IS the category for the customer's own number.
      category: customer.lineType === 'Prepaid' ? 'Prepaid' : 'Postpaid',
      label: `${customer.lineType} mobile line`,
      identifier: customer.phone,
    });
  }

  for (const asset of sources.installedAssets) {
    if (!asset.accountId || !myAccountIds.has(asset.accountId)) continue;
    // The only source here with a real status vocabulary, so it is the only
    // one that can be filtered on "Active" honestly.
    if (!LIVE_SERVICE_STATUSES.includes(asset.status ?? '')) continue;
    // The customer's own number is already listed above from the customer record; its installed asset only carries the plan.
    if (asset.serviceId && asset.serviceId === customer.phone) continue;
    const name = asset.productServiceName ?? 'Installed service';
    const { tab, category } = classifyProductName(name);
    services.push({
      ref: asset.serviceId ?? asset.installedAssetId ?? name,
      tab,
      category,
      label: name,
      identifier: asset.serviceId ?? asset.installedAssetId ?? '-',
      status: asset.status,
    });
  }

  for (const sub of sources.gigahome) {
    if (sub.customerId !== customer.customerId) continue;
    // Statuses here are 'Try & Buy trial' / 'active subscription' /
    // 'Home Move / TON' - all live subscriptions in different lifecycle
    // states, none of them the literal 'Active' used above. They are shown
    // rather than filtered, so the agent sees WHICH state.
    services.push({
      ref: sub.id ?? 'gigahome',
      tab: 'fibre',
      // Counted as FIBRE, not also as TV, even though the plan name bundles
      // OSNtv ("GigaHome 500 + OSNtv Premium"). It is one subscription; the
      // TV package rides on it. Counting it twice would make the category
      // totals sum to more services than the customer holds.
      category: 'GigaHome Fibre',
      label: sub.acceptanceForm?.planName ?? 'GigaHome / OSNtv',
      identifier: sub.id ?? '-',
      status: sub.status,
    });
  }

  for (const bundle of sources.iptvBundles) {
    if (!bundle.accountId || !myAccountIds.has(bundle.accountId)) continue;
    if (bundle.removedByCustomer) continue;
    services.push({
      ref: bundle.iptvBundleId ?? 'iptv',
      tab: 'fibre',
      category: 'TV / Entertainment',
      label: bundle.stbCount ? `IPTV (${bundle.stbCount} STB)` : 'IPTV',
      identifier: bundle.iptvBundleId ?? '-',
    });
  }

  for (const device of sources.smartDevices) {
    if (device.customerId !== customer.customerId) continue;
    services.push({
      ref: device.assignedNumber ?? device.id ?? 'device',
      tab: 'assets',
      category: 'Smart Devices',
      // Capitalised at the boundary: the source stores 'smart plug' and
      // 'indoor tracker' lower-case, mid-sentence style.
      label: device.deviceCategory
        ? device.deviceCategory.charAt(0).toUpperCase() + device.deviceCategory.slice(1)
        : 'Smart device',
      identifier: device.assignedNumber ?? device.id ?? '-',
    });
  }

  return services;
}

export interface ServiceCategoryGroup {
  category: ServiceCategory;
  /** How many services the customer holds in this category. */
  count: number;
  /** Which Customer 360 tab the category opens. */
  tab: ServiceTab;
}

// The grouped view: one row per category the customer actually holds, in
// SERVICE_CATEGORY_ORDER, with a count.
//
// Empty categories are omitted rather than shown as "(0)" - a zero is not a
// fact about this customer, it is the absence of one, and six zero rows would
// bury the one or two that matter.
//
// The tab comes from the category's own services rather than a second
// category->tab table, so a category can never be shown against a tab none of
// its services live on.
export function groupServicesByCategory(services: CustomerService[]): ServiceCategoryGroup[] {
  return SERVICE_CATEGORY_ORDER.flatMap((category) => {
    const inCategory = services.filter((s) => s.category === category);
    if (inCategory.length === 0) return [];
    return [{ category, count: inCategory.length, tab: inCategory[0].tab }];
  });
}

/**
 * Whether a listed service is one the customer is using now, defined once (Overview, Products & Services and Telesales Connections each had
 * their own reading). A source with no status vocabulary (an IPTV bundle, a smart device) lists only services the customer holds, so no
 * status means in use; otherwise the status must be Active - 'active subscription' too, not a Try & Buy trial, a Home Move / TON in
 * progress or a Suspended service.
 */
export const isActiveService = (s: { status?: string }): boolean => !s.status || /^active/i.test(s.status);

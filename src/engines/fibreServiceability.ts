import * as mockDataEngine from './mockDataEngine';

// Whether a customer's location can be served by fibre (RFS = Ready For Service), read from the customer's own address
// and the service-point records (kid-service-points.json). 'unknown' when the customer has no address on file or no
// service point matches it - never assumed either way.

export type FibreServiceability = 'rfs' | 'not-rfs' | 'unknown';

export interface AddressParts {
  zone?: string;
  streetNo?: string;
  buildingNo?: string;
  aptFlatUnit?: string;
}

interface ServicePoint {
  zone?: string;
  street?: string;
  building?: string;
  addressLine?: string;
  rfsStatus?: string;
}
interface AccountAddress extends AddressParts {
  customerId?: string;
  primaryStatus?: string;
}

const digits = (s: string | undefined) => (s ?? '').match(/\d+/g)?.pop();
const filled = (a: AddressParts | undefined): a is AddressParts => Boolean(a?.zone && a.streetNo && a.buildingNo);

export async function resolveFibreServiceability(customerId: string | undefined, entered?: AddressParts): Promise<FibreServiceability> {
  let address: AddressParts | undefined = filled(entered) ? entered : undefined;
  if (!address && customerId) {
    const all = await mockDataEngine.list<AccountAddress>('addresses');
    const mine = all.filter((a) => a.customerId === customerId);
    address = mine.find((a) => a.primaryStatus === 'Primary' && filled(a)) ?? mine.find(filled);
  }
  if (!address) return 'unknown';
  const points = await mockDataEngine.list<ServicePoint>('kid-service-points');
  let match = points.filter((p) => p.zone === address.zone && digits(p.street) === address.streetNo && digits(p.building) === address.buildingNo);
  const unit = address.aptFlatUnit?.trim().toLowerCase();
  if (unit) match = match.filter((p) => (p.addressLine ?? '').toLowerCase().includes(unit));
  if (match.length === 0) return 'unknown';
  return match.some((p) => p.rfsStatus === 'RFS') ? 'rfs' : 'not-rfs';
}

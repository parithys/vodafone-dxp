import * as mockDataEngine from './mockDataEngine';

// Looks up a service location by its Kahramaa Meter ID (KID) or Vodafone Premise ID (VFID) and returns the address it
// belongs to, so the address form can fill itself in. Reads the same records the rest of the app does: the KID service
// points (kid-service-points: a KID, its Vodafone ID and the address it serves), the customers' saved addresses
// (addresses, which carry a kahramaaId) and the KID address records (kid-address-records: area and a free-text line only).
// Nothing is guessed: an ID that matches no record returns `found: false`.

export interface ServiceLocationFields {
  zone?: string;
  streetNo?: string;
  buildingNo?: string;
  aptFlatUnit?: string;
  area?: string;
  poBox?: string;
  kidLocationId?: string;
  vodafoneId?: string;
}

export type ServiceLocationResult = { found: true; fields: ServiceLocationFields; source: string } | { found: false };

interface ServicePoint {
  id: string;
  vfid?: string;
  zone?: string;
  street?: string;
  building?: string;
  addressLine?: string;
  area?: string;
  poBox?: string;
}
interface SavedAddress {
  kahramaaId?: string;
  zone?: string;
  streetNo?: string;
  buildingNo?: string;
  aptFlatUnit?: string;
  city?: string;
}
interface KidAddressRecord {
  kahramaaId: string;
  area?: string;
  addressLine?: string;
}
interface VodafoneId {
  format: string;
  mappedKidIds: string[];
}

const norm = (s: string | undefined) => (s ?? '').trim().toUpperCase();
/** "WKR-0231-A" and "WKR0231A" are the same Vodafone ID. */
const vfidKey = (s: string | undefined) => norm(s).replace(/[^A-Z0-9]/g, '');
const lastNumber = (s: string | undefined) => (s ?? '').match(/\d+/g)?.pop();
const unitOf = (line: string | undefined) => (line ?? '').match(/\b(?:Flat|Unit|Villa|Apt|Apartment)\s*[\w-]+/i)?.[0];
const defined = (f: ServiceLocationFields): ServiceLocationFields =>
  Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== '')) as ServiceLocationFields;

function fromServicePoint(p: ServicePoint, vodafoneId: string | undefined, withUnit: boolean): ServiceLocationFields {
  return defined({
    zone: p.zone,
    streetNo: lastNumber(p.street),
    buildingNo: lastNumber(p.building),
    aptFlatUnit: withUnit ? unitOf(p.addressLine) : undefined,
    area: p.area,
    poBox: p.poBox,
    kidLocationId: p.id,
    vodafoneId,
  });
}

export async function lookupServiceLocation(query: { kid?: string; vodafoneId?: string }): Promise<ServiceLocationResult> {
  const [points, saved, kidRecords, vfids] = await Promise.all([
    mockDataEngine.list<ServicePoint>('kid-service-points'),
    mockDataEngine.list<SavedAddress>('addresses'),
    mockDataEngine.list<KidAddressRecord>('kid-address-records'),
    mockDataEngine.list<VodafoneId>('vodafone-ids'),
  ]);
  const formatOf = (vfid: string | undefined) => vfids.find((v) => vfidKey(v.format) === vfidKey(vfid))?.format ?? vfid;

  // A Vodafone ID names one premise: the service point that carries it (its KID, address and unit).
  if (query.vodafoneId?.trim()) {
    const key = vfidKey(query.vodafoneId);
    const point = points.find((p) => vfidKey(p.vfid) === key);
    if (point) return { found: true, source: 'Vodafone Premise ID', fields: fromServicePoint(point, formatOf(point.vfid), true) };
    // Otherwise, an ID that maps to exactly one KID leads to that KID's record.
    const mapped = vfids.find((v) => vfidKey(v.format) === key)?.mappedKidIds ?? [];
    if (mapped.length === 1) {
      const byKid = await lookupServiceLocation({ kid: mapped[0] });
      if (byKid.found) return { ...byKid, fields: { ...byKid.fields, vodafoneId: formatOf(query.vodafoneId) } };
    }
    return { found: false };
  }

  const kid = norm(query.kid);
  if (!kid) return { found: false };
  const here = points.filter((p) => norm(p.id) === kid);
  if (here.length > 0) {
    // One service point: its Vodafone ID and unit too. Several (a building with a KID shared by flats): only what they share.
    const only = here.length === 1 ? here[0] : undefined;
    const ids = [...new Set(here.map((p) => vfidKey(p.vfid)))];
    const vodafoneId = ids.length === 1 ? formatOf(here[0].vfid) : undefined;
    return { found: true, source: 'Kahramaa Meter ID', fields: fromServicePoint(here[0], vodafoneId, Boolean(only)) };
  }
  const address = saved.find((a) => norm(a.kahramaaId) === kid);
  if (address) {
    const mapped = vfids.filter((v) => v.mappedKidIds.some((m) => norm(m) === kid));
    return {
      found: true,
      source: 'Kahramaa Meter ID',
      fields: defined({
        zone: address.zone,
        streetNo: address.streetNo,
        buildingNo: address.buildingNo,
        aptFlatUnit: address.aptFlatUnit,
        area: address.city,
        kidLocationId: query.kid?.trim(),
        vodafoneId: mapped.length === 1 ? mapped[0].format : undefined,
      }),
    };
  }
  const record = kidRecords.find((r) => norm(r.kahramaaId) === kid);
  if (record) {
    // Only an area and a free-text line are on file: take the street and building numbers out of it where it states them.
    const line = record.addressLine ?? '';
    return {
      found: true,
      source: 'Kahramaa Meter ID',
      fields: defined({
        streetNo: line.match(/Street\s*(\d+)/i)?.[1],
        buildingNo: line.match(/Building\s*(\d+)/i)?.[1],
        aptFlatUnit: unitOf(line),
        area: record.area,
        kidLocationId: query.kid?.trim(),
      }),
    };
  }
  return { found: false };
}

/** One row of a Kahramaa Meter ID / Vodafone Premise ID dropdown: the ID, and what it points at. */
export interface ServiceLocationOption {
  value: string;
  detail: string;
}

/**
 * The IDs the lookup above can resolve, for a searchable dropdown: every Kahramaa Meter ID it finds a record for (a service point,
 * a customer's saved address or a KID address record) and every Vodafone Premise ID that names one premise (carried by a service
 * point, or mapped to exactly one KID). An ID the lookup could not resolve is not offered, so choosing a row always fills the address.
 */
export async function listServiceLocationOptions(): Promise<{ kids: ServiceLocationOption[]; vodafoneIds: ServiceLocationOption[] }> {
  const [points, saved, kidRecords, vfids] = await Promise.all([
    mockDataEngine.list<ServicePoint>('kid-service-points'),
    mockDataEngine.list<SavedAddress>('addresses'),
    mockDataEngine.list<KidAddressRecord>('kid-address-records'),
    mockDataEngine.list<VodafoneId>('vodafone-ids'),
  ]);
  const formatOf = (vfid: string | undefined) => vfids.find((v) => vfidKey(v.format) === vfidKey(vfid))?.format ?? vfid;
  const describe = (parts: (string | undefined)[]) => parts.filter(Boolean).join(', ');

  const kids = new Map<string, ServiceLocationOption>();
  const addKid = (id: string | undefined, detail: string) => {
    if (id && !kids.has(norm(id))) kids.set(norm(id), { value: id.trim(), detail });
  };
  for (const p of points) addKid(p.id, describe([p.addressLine ?? describe([p.zone && `Zone ${p.zone}`, p.street, p.building]), p.area]));
  for (const a of saved) addKid(a.kahramaaId, describe([a.zone && `Zone ${a.zone}`, a.streetNo && `Street ${a.streetNo}`, a.buildingNo && `Building ${a.buildingNo}`, a.city]));
  for (const r of kidRecords) addKid(r.kahramaaId, describe([r.addressLine, r.area]));

  const vodafoneIds = new Map<string, ServiceLocationOption>();
  for (const p of points) {
    if (p.vfid && !vodafoneIds.has(vfidKey(p.vfid))) vodafoneIds.set(vfidKey(p.vfid), { value: formatOf(p.vfid) ?? p.vfid, detail: describe([p.addressLine, p.area]) });
  }
  for (const v of vfids) {
    if (v.mappedKidIds.length === 1 && !vodafoneIds.has(vfidKey(v.format))) {
      vodafoneIds.set(vfidKey(v.format), { value: v.format, detail: kids.get(norm(v.mappedKidIds[0]))?.detail ?? v.mappedKidIds[0] });
    }
  }
  return { kids: [...kids.values()], vodafoneIds: [...vodafoneIds.values()] };
}

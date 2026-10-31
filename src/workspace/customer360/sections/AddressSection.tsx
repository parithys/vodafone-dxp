import { useMemo, useState } from 'react';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Drawer } from '../../../capabilities';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { useEntityStore } from '../../../stores/entityStore';
import { usePersonaStore } from '../../../stores/personaStore';
import { canEditCustomerRecords } from '../../../engines/agentPrivilegeEngine';
import { useProfileChangeTicket } from '../../../engines/profileChangeTicket';
import { useVerificationGate } from '../../../components/patterns/VerificationGate';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { useSubmit } from '../../../hooks/useSubmit';

export interface AddressRecord {
  id: string;
  customerId: string;
  addressLine1?: string;
  addressLine2?: string;
  zone: string;
  streetNo: string;
  buildingNo: string;
  city: string;
  country: string;
  poBox?: string;
  kahramaaId?: string;
  primaryStatus?: string;
  activeFlag?: boolean;
}

// CUS-001-CAM-19: dynamic street/building filtering LOV - reasonable,
// clearly-flagged placeholder (matches ticketReferenceData.ts's TT_AREAS
// pattern) since Annex_01 doesn't enumerate a real Kahramaa zone catalogue.
const ZONE_CATALOGUE: Record<string, { streets: string[]; buildingsByStreet: Record<string, string[]> }> = {
  '55': { streets: ['12', '14', '16'], buildingsByStreet: { '12': ['30', '32', '34'], '14': ['10', '12'], '16': ['5'] } },
  '39': { streets: ['820', '822'], buildingsByStreet: { '820': ['9', '11'], '822': ['3'] } },
  '45': { streets: ['12'], buildingsByStreet: { '12': ['200'] } },
  '66': { streets: ['214'], buildingsByStreet: { '214': ['Tower A', 'Tower B'] } },
  '12': { streets: ['5'], buildingsByStreet: { '5': ['7'] } },
};
const ZONE_OPTIONS = Object.keys(ZONE_CATALOGUE).map((z) => ({ value: z, label: `Zone ${z}` }));

export function AddressSection({
  data,
  onTicketCreated,
}: {
  data: Customer360Data;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  // Seeded once, patched locally on save - see ContactSection.tsx's identical
  // comment: data.addresses is a one-time snapshot, not entityStore-reactive.
  const [addresses, setAddresses] = useState<AddressRecord[]>(() => data.addresses as unknown as AddressRecord[]);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const canEdit = canEditCustomerRecords(activePersonaId);
  const { requireVerification, gate } = useVerificationGate(data.customer.customerId, data.customer.name);
  const [editing, setEditing] = useState<AddressRecord | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
          Customer Addresses
        </h3>
      </div>
      <DataTable
        rows={addresses}
        rowKey={(r) => r.id}
        emptyMessage="No addresses on file for this customer."
        onRowClick={(r) => (canEdit ? requireVerification(() => setEditing(r)) : setEditing(r))}
        columns={[
          { key: 'addressLine1', header: 'Address Line 1' },
          { key: 'city', header: 'City' },
          { key: 'zone', header: 'Zone' },
          {
            key: 'primaryStatus',
            header: 'Status',
            render: (r) => <Badge variant={r.primaryStatus === 'Primary' ? 'success' : 'filled-neutral'}>{r.primaryStatus ?? '-'}</Badge>,
          },
        ]}
      />
      {gate}
      {editing && (
        <AddressEditDrawer
          address={editing}
          customerId={data.customer.customerId}
          readOnly={!canEdit}
          onClose={() => setEditing(null)}
          onSaved={(patch) => setAddresses((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...patch } : a)))}
          onTicketCreated={onTicketCreated}
        />
      )}
    </div>
  );
}

export function AddressEditDrawer({
  address,
  customerId,
  readOnly,
  onClose,
  onSaved,
  onTicketCreated,
}: {
  address: AddressRecord;
  customerId: string;
  readOnly: boolean;
  onClose: () => void;
  onSaved: (patch: Partial<AddressRecord>) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createChangeTicket = useProfileChangeTicket();
  const [addressLine1, setAddressLine1] = useState(address.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(address.addressLine2 ?? '');
  const [zone, setZone] = useState(address.zone);
  const [streetNo, setStreetNo] = useState(address.streetNo);
  const [buildingNo, setBuildingNo] = useState(address.buildingNo);
  const [city, setCity] = useState(address.city);
  const [country, setCountry] = useState(address.country);
  const [poBox, setPoBox] = useState(address.poBox ?? '');
  const [kahramaaId, setKahramaaId] = useState(address.kahramaaId ?? '');

  // Dynamic filtering (CAM-19): street options narrow to the selected zone,
  // building options narrow to the selected zone+street.
  const streetOptions = useMemo(() => {
    const streets = ZONE_CATALOGUE[zone]?.streets ?? [streetNo].filter(Boolean);
    return streets.map((s) => ({ value: s, label: `Street ${s}` }));
  }, [zone, streetNo]);
  const buildingOptions = useMemo(() => {
    const buildings = ZONE_CATALOGUE[zone]?.buildingsByStreet[streetNo] ?? [buildingNo].filter(Boolean);
    return buildings.map((b) => ({ value: b, label: `Building ${b}` }));
  }, [zone, streetNo, buildingNo]);

  const onZoneChange = (nextZone: string) => {
    setZone(nextZone);
    const firstStreet = ZONE_CATALOGUE[nextZone]?.streets[0] ?? '';
    setStreetNo(firstStreet);
    setBuildingNo(ZONE_CATALOGUE[nextZone]?.buildingsByStreet[firstStreet]?.[0] ?? '');
  };
  const onStreetChange = (nextStreet: string) => {
    setStreetNo(nextStreet);
    setBuildingNo(ZONE_CATALOGUE[zone]?.buildingsByStreet[nextStreet]?.[0] ?? '');
  };

  const { run: save, pending: saving } = useSubmit(async () => {
    const patch = { addressLine1, addressLine2, zone, streetNo, buildingNo, city, country, poBox, kahramaaId };
    const changed = (Object.keys(patch) as (keyof typeof patch)[]).filter((k) => patch[k] !== (address as unknown as Record<string, unknown>)[k]);
    await updateRecord('addresses', 'id', address.id, patch);
    if (changed.length > 0) {
      const { record } = await createChangeTicket(customerId, 'Address', changed);
      onTicketCreated(record);
    }
    onSaved(patch);
    onClose();
  }, 'Could not save the address. Please try again.');

  return (
    <Drawer
      open
      onClose={onClose}
      title={readOnly ? 'Address Details' : 'Edit Address Details'}
      footer={
        !readOnly ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={saving || !addressLine1.trim()} onClick={save}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <Input label="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        <Input label="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Zone" value={zone} onChange={(e) => onZoneChange(e.target.value)} options={ZONE_OPTIONS} disabled={readOnly} />
          <Select label="Street No." value={streetNo} onChange={(e) => onStreetChange(e.target.value)} options={streetOptions} disabled={readOnly} />
          <Select label="Building No." value={buildingNo} onChange={(e) => setBuildingNo(e.target.value)} options={buildingOptions} disabled={readOnly} />
        </div>
        <p className="text-[length:var(--fs-caption)] text-muted -mt-2">
          Street and building options filter automatically based on the selected zone (CAM-19).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} readOnly={readOnly} disabled={readOnly} />
          <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="PO Box" value={poBox} onChange={(e) => setPoBox(e.target.value)} readOnly={readOnly} disabled={readOnly} />
          <Input label="Kahramaa ID" value={kahramaaId} onChange={(e) => setKahramaaId(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        </div>
      </div>
    </Drawer>
  );
}

import { useEffect, useState } from 'react';
import type { GuidedContactValue } from '../../../components/patterns/guidedContactModel';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import { CARD_SELECTED, SelectedTick } from '../../../capabilities';
import { Icon } from '../../../components/primitives/Icon';
import { ServiceAddress } from '../../../capabilities';
import type { ZsbAddressValue } from '../../../components/patterns/ZsbAddressStep';
import { resolveFibreServiceability } from '../../../engines/fibreServiceability';
import { FIXED_SERVICE_TYPES, allocateFixedLineNumber, devicesFor, type FixedDevice, type FixedInstallationValue, type FixedServiceType } from './fixedActivationModel';

type Values = Record<string, unknown>;

const CHECK = 'M20 6L9 17l-5-5';
const SERVICE_ICON: Record<FixedServiceType, string> = {
  fiber: 'M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5',
  'fwa-indoor': 'M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01',
  'fwa-outdoor': 'M12 20v-9M8 20h8M6.3 6.3a8 8 0 000 11.4M17.7 6.3a8 8 0 010 11.4M9 9a4 4 0 000 6M15 9a4 4 0 010 6',
};

// Installation Address: service type, the address (shared ZSB address form) and the RFS read-out.
export function InstallationAddressStep({ values, setValue }: { values: Values; setValue: (f: string, v: unknown) => void }) {
  const address = (values.address as ZsbAddressValue | undefined) ?? {};
  const installation = (values.installation as FixedInstallationValue | undefined) ?? {};
  const customerId = (values.eligibility as EligibilityResult | undefined)?.customerId;
  const contact = values.contact as GuidedContactValue | undefined;
  const complete = Boolean(address.zone && address.streetNo && address.buildingNo);
  const [checking, setChecking] = useState(false);

  // Service types by product (business rule): Fibre, Fixed-Line and 5G Home have none to choose; only FWA offers FWA Indoor and
  // FWA Outdoor. Fibre still runs on the Fiber service underneath (set here, not asked) so its fibre-readiness check applies.
  const homeProduct = values.homeProduct as string | undefined;
  const wireless = homeProduct === 'fwa';
  const serviceTypes = FIXED_SERVICE_TYPES.filter((t) => t.value !== 'fiber');
  useEffect(() => {
    if (homeProduct === 'fibre' && installation.serviceType !== 'fiber') setValue('installation', { serviceType: 'fiber', rfs: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeProduct, installation.serviceType]);

  // RFS is read from the service-point records for the address as entered; nothing is assumed when it is unmatched.
  useEffect(() => {
    if (installation.serviceType !== 'fiber' || !complete) return;
    let cancelled = false;
    setChecking(true);
    void resolveFibreServiceability(customerId, address).then((rfs) => {
      if (cancelled) return;
      setChecking(false);
      if (rfs !== installation.rfs) setValue('installation', { ...installation, rfs });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installation.serviceType, address.zone, address.streetNo, address.buildingNo, address.aptFlatUnit, customerId]);

  const rfs = installation.rfs;
  return (
    <div className="space-y-6">
      {wireless && (
      <div>
        <p className="text-[length:var(--fs-label)] text-fg-2 mb-2">Service Type</p>
        {/* Same card selector as the ID Type cards on Contact. */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,11rem),1fr))] gap-3" role="radiogroup" aria-label="Service type">
          {serviceTypes.map((t) => {
            const selected = installation.serviceType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setValue('installation', { serviceType: t.value as FixedServiceType, rfs: undefined })}
                className={`relative flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 ${
                  selected
                    ? `${CARD_SELECTED} text-[var(--field-card-selected)]`
                    : 'border-[var(--field-card-border)] bg-bg text-fg hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]'
                }`}
              >
                {selected && <SelectedTick />}
                <span className={`inline-flex p-2 rounded-[var(--radius-card)] ${selected ? 'bg-[var(--field-card-selected)] text-on-dark' : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'}`}>
                  <Icon path={SERVICE_ICON[t.value]} className="w-6 h-6" />
                </span>
                <span className="text-[length:var(--fs-caption)] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      )}
      {installation.serviceType === 'fiber' && complete && !checking && rfs === 'rfs' && (
        // Fibre Readiness is the RFS verdict: shown only when the location is RFS, above the address it is about.
        <div className="flex items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3 border-success bg-tone-success">
          <Icon path="M5 12.5a10 10 0 0 1 14 0 M8 15.5a6 6 0 0 1 8 0 M12 19h.01" className="w-5 h-5 shrink-0 text-success" />
          <div className="min-w-0 flex-1">
            <p className="text-fg font-semibold text-[length:var(--fs-body)]">Fibre Readiness</p>
            <p className="text-[length:var(--fs-caption)] text-success">Location is RFS (Ready For Service) - fibre can be installed here.</p>
          </div>
          <Icon path={CHECK} className="w-5 h-5 shrink-0 text-success" />
        </div>
      )}
      {installation.serviceType === 'fiber' && complete && !checking && rfs && rfs !== 'rfs' && (
        <p role="status" className="text-[length:var(--fs-caption)] text-[var(--warn-text)]">
          {rfs === 'not-rfs'
            ? 'This location is not RFS, so fibre cannot be installed here. Choose another connection (such as FWA) or enter another address.'
            : 'No service point matches this address - check the zone, street and building.'}
        </p>
      )}
      <ServiceAddress
        mode="structured"
        value={address}
        onChange={(v) => {
          setValue('address', v);
          // The fibre-readiness result belongs to the zone / street / building / unit it was read for: clear it only when one of
          // those changes (the check above then runs again). Editing the floor, area, directions or the Kahramaa / Vodafone IDs
          // must not clear it, or nothing would read it again and Continue would stay disabled.
          const same = (['zone', 'streetNo', 'buildingNo', 'aptFlatUnit'] as const).every((k) => (v[k] ?? '') === (address[k] ?? ''));
          if (installation.rfs && !same) setValue('installation', { ...installation, rfs: undefined });
        }}
        idNumber={contact?.idNumber}
        nationality={(values.eligibility as EligibilityResult | undefined)?.nationality}
      />
    </div>
  );
}

// Number & Devices: the fixed line number is allocated by the system; devices follow from the service type.
export function NumberDevicesStep({ values, setValue }: { values: Values; setValue: (f: string, v: unknown) => void }) {
  const serviceType = (values.installation as FixedInstallationValue | undefined)?.serviceType;
  const devices = values.devices as FixedDevice[] | undefined;
  const msisdn = values.msisdn as string | undefined;
  useEffect(() => {
    if (!msisdn) setValue('msisdn', allocateFixedLineNumber());
    if (!devices) setValue('devices', devicesFor(serviceType, serviceType === 'fiber'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-fg font-semibold text-[length:var(--fs-h5)] mb-2">Fixed Line Number</h3>
        <p className="text-fg-2 text-[length:var(--fs-body)] mb-2">Allocated automatically for this order.</p>
        <p className="text-fg font-bold text-[length:var(--fs-h4)]">{msisdn ?? '…'}</p>
      </section>
      <section>
        <h3 className="text-fg font-semibold text-[length:var(--fs-h5)] mb-2">Devices</h3>
        <ul className="divide-y divide-border-soft border border-[var(--field-card-border)] rounded-[var(--radius-card)]">
          {(devices ?? []).map((d) => (
            <li key={d.serial} className="flex justify-between p-3 text-[length:var(--fs-body)]">
              <span className="text-fg">{d.name}</span>
              <span className="text-fg-2">{d.serial}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


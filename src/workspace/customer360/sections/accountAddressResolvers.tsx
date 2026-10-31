import type { ReactNode } from 'react';
import type { Customer360Data } from '../../../engines/customer360Engine';

type Resolver = (data: Customer360Data) => ReactNode | undefined;

/** customer360-fields.json's Account Address topic. The source JSON lists
 * Zone/Street/Building/RFS Flag TWICE (once under a "National Address"
 * component, once under "Open UI Address") - both trace to the same
 * addresses.json record in this corpus, so they resolve identically here
 * rather than being treated as two different data points. RFS Flag has no
 * real join: rfs-records.json's addressId values (e.g. ADDR-Doha-1140)
 * don't match addresses.json's id values (e.g. ADDR-1101) anywhere in this
 * corpus - verified, not assumed. */
export const accountAddressResolvers: Record<string, Resolver> = {
  Zone: (data) => data.addresses[0]?.zone as string | undefined,
  Street: (data) => data.addresses[0]?.streetNo as string | undefined,
  Building: (data) => data.addresses[0]?.buildingNo as string | undefined,
};

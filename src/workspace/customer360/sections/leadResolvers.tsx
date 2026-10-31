import type { ReactNode } from 'react';
import type { Customer360Data } from '../../../engines/customer360Engine';

type Resolver = (data: Customer360Data) => ReactNode | undefined;

/** customer360-fields.json's Account/Contact Lead topic, over
 * `data.leads` (joined by mobile number - see customer360Engine.ts's own
 * note on why this is legitimately empty for every demo customer: neither
 * seeded lead's mobileNumber matches any customer's phone). `Comments` has
 * no matching field on leads.json even where a lead does match. */
export const leadResolvers: Record<string, Resolver> = {
  'Lead Type': (data) => data.leads[0]?.serviceNeeded as string | undefined,
  MSISDN: (data) => data.leads[0]?.mobileNumber as string | undefined,
  'Created By': (data) => data.leads[0]?.ownerId as string | undefined,
  'Lead Status': (data) => data.leads[0]?.status as string | undefined,
  Comments: (data) => data.leads[0]?.comments as string | undefined,
};

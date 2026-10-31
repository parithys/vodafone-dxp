import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CustomerRoute } from '../../../src/next/routes';

// A static export needs every dynamic URL listed up front. The mock data is the only source of customers, so the list is read from it
// at build time (customers and enterprise accounts) - no ID is invented. A customer opened at runtime that is not in the mock data has
// no exported page; see the spike report on direct navigation.
export const dynamicParams = false;
export function generateStaticParams() {
  const read = (f: string, key: string) =>
    (JSON.parse(readFileSync(join(process.cwd(), 'public/mock-data', f), 'utf8')) as Record<string, string>[]).map((r) => ({ customerId: r[key] }));
  return [...read('customers.json', 'customerId'), ...read('enterprise-accounts.json', 'enterpriseAccountId')];
}

export default function Page() {
  return <CustomerRoute />;
}

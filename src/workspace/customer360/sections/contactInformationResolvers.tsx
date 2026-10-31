import type { ReactNode } from 'react';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';

export interface ContactInfoContext {
  data: Customer360Data;
  services: CustomerService[];
}

type Resolver = (ctx: ContactInfoContext) => ReactNode | undefined;

/** customer360-fields.json's Contact Information topic. Authorized
 * person(s)/Role/email all read the same new `authorisedContacts` join
 * (customer360Engine.ts) - only seeded on ACC-5003/ACC-5004, so most demo
 * customers legitimately show empty here, not a broken join. Tenure,
 * Employer, Credit Score have no matching field anywhere in this corpus. */
export const contactInformationResolvers: Record<string, Resolver> = {
  'Authorized Role': ({ data }) => {
    const roles = new Set(data.authorisedContacts.flatMap((c) => (c.roles as string[]) ?? []));
    return roles.size > 0 ? Array.from(roles).join(', ') : undefined;
  },
  'Authorized email': ({ data }) => {
    const emails = data.authorisedContacts.map((c) => c.email).filter(Boolean);
    return emails.length > 0 ? emails.join(', ') : undefined;
  },
  'Authorized Mobile': ({ data }) => {
    const mobiles = data.authorisedContacts.map((c) => c.mobile).filter(Boolean);
    return mobiles.length > 0 ? mobiles.join(', ') : undefined;
  },
  'QCB Check': ({ data }) => data.deviceInstallments[0]?.qcbCreditCheckStatus as string | undefined,
  'ID Number': ({ data }) => data.contacts[0]?.idNumber as string | undefined,
  'ID Status (Blacklisted/Whitelisted)': ({ data }) => (
    <Badge variant={data.customer.blacklisted ? 'danger' : 'success'}>
      {data.customer.blacklisted ? 'Blacklisted' : 'Whitelisted'}
    </Badge>
  ),
  'Preferred Language': ({ data }) => (data.contacts[0]?.preferredLanguage as string | undefined) ?? data.customer.preferredLanguage,
  'First Name & Last Name (Full Name)': ({ data }) => {
    const c = data.contacts[0];
    return c ? [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ').trim() || undefined : data.customer.name;
  },
  Email: ({ data }) => data.customer.email,
  'Cross sale offers flag': ({ data }) => (data.crossSalesOffers.length > 0 ? 'Yes' : 'No'),
  DOB: ({ data }) => (data.contacts[0]?.dob as string | undefined) ?? data.customer.dob,
  'Notification MSISDN': ({ data }) => data.customer.phone,
  'Total Number of Connections': ({ services }) => (services.length > 0 ? String(services.length) : undefined),
  'ID Type': ({ data }) => (data.contacts[0]?.idType as string | undefined) ?? data.customer.idType,
  'Sales enhansment offers': ({ data }) => (data.crossSalesOffers.length > 0 ? `${data.crossSalesOffers.length} offer(s) on file` : undefined),
};

/** "Authorized person(s)" is the one Contact Information field whose spec
 * value is a list, not a flat value - the full authorisedContacts table
 * (name/role/email), rendered via TopicFieldsSection's richFields. */
export function contactInformationRichFields({ data }: { data: Customer360Data }): Record<string, ReactNode> {
  return {
    'Authorized person(s)': (
      <DataTable
        rows={data.authorisedContacts}
        rowKey={(r) => String(r.authorisedPersonId)}
        emptyMessage="No authorized third parties on file for this customer's accounts."
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'jobTitle', header: 'Job Title' },
          { key: 'email', header: 'Email' },
          { key: 'roles', header: 'Roles', render: (r) => (Array.isArray(r.roles) ? r.roles.join(', ') : '-') },
        ]}
      />
    ),
  };
}

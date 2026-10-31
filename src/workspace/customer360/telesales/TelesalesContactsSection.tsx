import { SearchField } from '../../../components/primitives/SearchField';
import { FilterSelect } from '../sections/C360Kit';
import { useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { contactInformationResolvers } from '../sections/contactInformationResolvers';
import { Card, KV, Pill, asText, dateTime, type Ctx } from './TelesalesOverview';
import { ActionList, Avatar, Field, HeaderButton, ICON, SectionHeader, StatStrip, TableCard, yesNo } from './TelesalesKit';
import { strOrEmpty as str } from '../../../lib/values';
import { demoOf, arr, rowDate } from './shared';
import type { Rec } from './shared';

// ============================================================================ Contacts
interface ContactRow {
  key: string;
  name: string;
  badge?: string;
  badgeTone?: 'solid' | 'green';
  relation: string;
  mobile: string;
  email: string;
  self?: boolean;
}

export function ContactsSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const demo = demoOf(ctx);
  const meta = (demo.contactMeta ?? {}) as Rec;
  const prefs = (demo.commPrefs ?? {}) as Rec;
  const c = (d: string) => asText(contactInformationResolvers[d]?.({ data, services }));
  const [selected, setSelected] = useState('self');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All Roles');
  const authorised = data.authorisedContacts;
  const others = arr<{ name: string; relation: string; mobile: string; email: string }>(demo.otherContacts);
  const rows: ContactRow[] = [
    { key: 'self', name: str(data.customer.name), badge: 'Primary', badgeTone: 'solid', relation: 'Customer (Self)', mobile: str(data.customer.phone), email: str(data.customer.email), self: true },
    ...authorised.map((a, i) => ({ key: `a${i}`, name: str(a.name), badge: 'Authorised', badgeTone: 'green' as const, relation: 'Authorised Person', mobile: str(a.mobile), email: str(a.email) })),
    ...others.map((o, i) => ({ key: `o${i}`, name: o.name, relation: o.relation, mobile: o.mobile, email: o.email })),
  ];
  const shown = rows.filter((r) => (role === 'All Roles' || r.relation === role) && `${r.name} ${r.relation} ${r.email}`.toLowerCase().includes(query.toLowerCase()));
  const cur = rows.find((r) => r.key === selected) ?? rows[0];
  const total = rows.length;
  const notif = rows.filter((r) => r.relation === 'Notification Contact').length;
  const roles = arr<{ role: string; authorised: boolean; from: string; to: string | null; status: string }>([
    { role: 'Account Owner', authorised: true, from: '2018-01-12', to: null, status: 'Active' },
    { role: 'Service Management', authorised: true, from: '2018-01-12', to: null, status: 'Active' },
    { role: 'Billing Management', authorised: true, from: '2018-01-12', to: null, status: 'Active' },
    { role: 'Order Placement', authorised: true, from: '2018-01-12', to: null, status: 'Active' },
  ]);
  const activities = arr<{ at: string; activity: string; by: string }>(demo.contactActivities);
  const idStatus = data.customer.blacklisted ? 'Blacklisted' : 'Whitelisted';
  return (
    <>
      <SectionHeader
       
       
       
        actions={<HeaderButton primary>+ Add Contact ›</HeaderButton>}
      />
      <StatStrip
        items={[
          { value: total, label: 'Total Contacts' },
          { value: 1, label: 'Primary Contact' },
          { value: authorised.length, label: 'Authorised Persons' },
          { value: notif, label: 'Notification Contacts' },
          { value: str(c('Preferred Language')) || '-', label: 'Preferred Language' },
          { value: str(c('Total Number of Connections')) || services.length, label: 'Total Connections' },
        ]}
      />
      <div className="contents">
        <div className="contents">
          <Card title={`Contacts List (${total})`} icon={ICON.user}>
            <div className="px-4 py-3 flex gap-2 border-b border-[var(--field-card-border)]">
              <SearchField value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search contacts by name, role or email..." aria-label="Search contacts" wrapperClassName="flex-1 min-w-48" />
              <FilterSelect label="Filter by Role" value={role} options={['All Roles', 'Customer (Self)', 'Authorised Person', 'Notification Contact', 'Family Member'].map((x) => ({ value: x, label: x }))} onChange={(v) => setRole(v)} />
            </div>
            {shown.map((r) => (
              <button key={r.key} type="button" onClick={() => setSelected(r.key)} className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-[var(--field-card-border)] last:border-0 hover:bg-surface ${cur?.key === r.key ? 'bg-surface' : ''}`}>
                <Avatar name={r.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-fg font-semibold text-[length:var(--fs-body-lg)] truncate">{r.name}</span>
                    {r.badge && <Pill tone={r.badgeTone ?? 'green'}>{r.badge}</Pill>}
                  </span>
                  <span className="block text-fg-2 text-[length:var(--fs-caption)]">{r.relation}</span>
                  <span className="block text-fg-2 text-[length:var(--fs-caption)] truncate">
                    {r.mobile} | {r.email}
                  </span>
                </span>
                <Icon path={ICON.chevron} className="w-4 h-4 text-muted shrink-0 mt-2" />
              </button>
            ))}
          </Card>
          <TableCard
            title={`Authorised Persons (${authorised.length})`}
            icon={ICON.shield}
            link="View All"
            onLink={() => ctx.goToTab('ts-contact')}
            rows={authorised}
            empty="No authorised persons on file."
            cols={[
              { header: 'Name', render: (a) => str(a.name) },
              { header: 'Role', render: (a) => str(a.jobTitle ?? (a.roles as string[] | undefined)?.join(', ')) },
              { header: 'Mobile Number', render: (a) => str(a.mobile) },
            ]}
          />
        </div>

        <div className="contents">
          <Card title="Contact Details" icon={ICON.user} link="Edit">
            <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
              <Avatar name={cur?.name ?? ''} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-fg font-bold text-[length:var(--fs-body-lg)]">{cur?.name}</span>
                  {cur?.badge && <Pill tone={cur.badgeTone ?? 'green'}>{cur.badge === 'Primary' ? 'Primary Contact' : cur.badge}</Pill>}
                </div>
                <div className="text-fg-2 text-[length:var(--fs-caption)]">{cur?.relation}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
            <KV label="ID Type">{str(c('ID Type')) === 'QID' ? 'Qatar ID' : str(c('ID Type')) || '-'}</KV>
            <KV label="ID Number">{str(c('ID Number')) || '-'}</KV>
            <KV label="ID Status">
              <Pill tone={data.customer.blacklisted ? 'red' : 'green'}>{idStatus}</Pill>
            </KV>
            <KV label="Date of Birth">{c('DOB') ? dateTime(c('DOB')).d : '-'}</KV>
            <KV label="Tenure">{str(meta.tenure) || '-'}</KV>
            <KV label="Preferred Language">{str(c('Preferred Language')) || '-'}</KV>
            <KV label="Email">{cur?.email || '-'}</KV>
            <KV label="Mobile Number">{cur?.mobile ? `${cur.mobile}${cur.self ? ' (Primary)' : ''}` : '-'}</KV>
            <KV label="Notification MSISDN">{str(c('Notification MSISDN')) || '-'}</KV>
            <KV label="Employer">{str(meta.employer) || '-'}</KV>
            <KV label="Total Number of Connections">{str(c('Total Number of Connections')) || services.length}</KV>
            <KV label="Credit Score">
              <Pill tone="green">{str(meta.creditScore) || '-'}</Pill>
            </KV>
            </div>
          </Card>
          <TableCard
            title="Authorisation & Roles"
            icon={ICON.shield}
            link="View History"
            rows={roles}
            cols={[
              { header: 'Role', render: (r) => r.role },
              { header: 'Authorised', render: () => yesNo(true) },
              { header: 'From Date', render: (r) => dateTime(r.from).d },
              { header: 'To Date', render: (r) => r.to ?? '-' },
              { header: 'Status', render: (r) => <Pill tone="green">{r.status}</Pill> },
            ]}
          />
          <TableCard
            title="Recent Contact Activities"
            icon={ICON.refresh}
            link="View All"
            rows={activities}
            cols={[
              { header: 'Date & Time', render: (a) => rowDate(a.at) },
              { header: 'Activity', render: (a) => a.activity },
              { header: 'Performed By', render: (a) => a.by },
            ]}
          />
        </div>

        <div className="contents">
          <Card title="Communication Preferences" icon={ICON.phone} link="Edit">
            <Field label="Preferred Language">{str(c('Preferred Language')) || '-'}</Field>
            <Field label="Email for Billing">{yesNo(prefs.emailForBilling as boolean)}</Field>
            <Field label="Email">{str(data.customer.email) || '-'}</Field>
            <Field label="Notification MSISDN">{str(c('Notification MSISDN')) || '-'}</Field>
            <Field label="Marketing Communication">{yesNo(prefs.marketing as boolean)}</Field>
            <Field label="SMS Notifications">{yesNo(prefs.sms as boolean)}</Field>
            <Field label="Email Notifications">{yesNo(prefs.emailNotifications as boolean)}</Field>
          </Card>
          <Card title="Additional Information" icon={ICON.grid}>
            <Field label="QCB Check">
              <Pill tone="green">{str(c('QCB Check')) || '-'}</Pill>
            </Field>
            <Field label="Cross Sale Offers Flag">{yesNo(str(c('Cross sale offers flag')))}</Field>
            <Field label="Sales Enhancement Offers">{yesNo(c('Sales enhansment offers') ? 'Yes' : 'No')}</Field>
          </Card>
          <Card title="Related Actions" icon={ICON.bars}>
            <ActionList
              items={[
                { title: 'View Contact Hierarchy', sub: 'View parent and related contacts' },
                { title: 'Manage Authorisations', sub: 'Update roles and permissions' },
                { title: 'View Audit Trail', sub: 'See all contact related activities', onClick: () => ctx.goToTab('ts-history') },
                { title: 'Create Trouble Ticket', sub: 'Log an issue for this contact', onClick: () => ctx.goToTab('ts-history') },
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

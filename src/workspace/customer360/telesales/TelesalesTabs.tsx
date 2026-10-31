import { useState, type ReactNode } from 'react';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import { Icon } from '../../../components/primitives/Icon';
import type { TabItem } from '../../../components/primitives/Tabs';
import type { FieldGroup } from '../sections/customer360Layouts';
import { TopicFieldsSection } from '../sections/TopicFieldsSection';
import { MasonryGrid, TelesalesOverview } from './TelesalesOverview';
import { AccountSection } from './TelesalesAccountSection';
import { ContactsSection } from './TelesalesContactsSection';
import { ConnectionsSection } from './TelesalesConnectionsSection';
import { BillingSection as BillingPageSection } from './TelesalesBillingSection';
import { OffersSection } from './TelesalesOffersSection';
import { UsageSection } from './TelesalesUsageSection';
import { AddressSection as AddressPageSection } from './TelesalesAddressSection';
import { AuditSection } from './TelesalesAuditSection';
import { LeadsSection } from './TelesalesLeadsSection';
import { OrdersTicketsSection } from './TelesalesOrdersTicketsSection';
import { ToolbarShell } from './TelesalesKit';
import { AssetsSection, type AssetsSubView } from '../sections/AssetsSection';
import { accountInformationResolvers, accountInformationRichFields } from '../sections/accountInformationResolvers';
import { billingResolvers } from '../sections/billingResolvers';
import { BillingSection } from '../sections/BillingSection';
import { contactInformationResolvers, contactInformationRichFields } from '../sections/contactInformationResolvers';
import { accountAddressResolvers } from '../sections/accountAddressResolvers';
import { blacklistResolvers } from '../sections/blacklistResolvers';
import { AlertsRisksSection } from '../sections/AlertsRisksSection';
import { leadResolvers } from '../sections/leadResolvers';
import { buildAssetsFieldResolver, assetsRichFields } from '../sections/assetsResolvers';
import { ContactSection } from '../sections/ContactSection';
import { AddressSection } from '../sections/AddressSection';
import { AuditTrailSection } from '../sections/AuditTrailSection';
import { CommunicationsSection } from '../sections/MiscSections';
import { DevicePenaltyPolicy, StarNumberPenaltyPolicy } from '../sections/penaltyViewResolvers';

// The Telesales (CBU) Customer 360: ten task-shaped tabs (Overview ... Activation & Changes); the
// former deep-dive areas are rows inside the tab they belong to.
// It composes the SAME field-level sections the standard layout uses (TopicFieldsSection over
// customer360-fields.json), so what a department may see - and whether each field is real-time or
// drill-down - is still decided by the visibility engine, not here. A tab with nothing visible to
// the persona is left out.

const CHEVRON_DOWN = 'M6 9l6 6 6-6';
const CHEVRON_UP = 'M18 15l-6-6-6 6';

const RECENT_MILESTONES =
  'Recent Milestones or Interactions (including all recent purchases add-on, Plan change, activation, change done to MSISDN, account, ticket or activity)';
const RECENT_USAGES = '10 Recent Usages (Data, Calls, Text, OOB)';
const AUDIT = 'Audit Trail (Orders, Contact, Account, Activity, TT)';

export interface TelesalesContext {
  personaId: string | undefined;
  data: Customer360Data;
  services: CustomerService[];
  customer: ActiveCustomerSummary;
  servicesLoaded: boolean;
  selectedServiceRef: string | undefined;
  assetsSubView: AssetsSubView;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
  /** Switches the Customer 360 tab (the Overview cards' "View Details" links). */
  goToTab: (key: string) => void;
}

const visibleCount = (personaId: string | undefined, topic: string, only: string[]) =>
  getVisibleTopicFields(personaId, topic).filter(({ field }) => only.includes(field.details)).length;

function Block({
  ctx,
  topic,
  groups,
  resolve,
  rich,
  plain,
}: {
  ctx: TelesalesContext;
  topic: string;
  groups: FieldGroup[];
  resolve?: (details: string) => ReactNode | undefined;
  rich?: Record<string, ReactNode>;
  plain?: boolean;
}) {
  const only = groups.flatMap((g) => g.fields);
  if (visibleCount(ctx.personaId, topic, only) === 0) return null;
  return <TopicFieldsSection personaId={ctx.personaId} topic={topic} only={only} layout={groups} resolveValue={resolve} richFields={rich} plain={plain} />;
}

function DeepDiveRow({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-fg text-[length:var(--fs-body)] hover:bg-surface"
      >
        {title}
        <Icon path={open ? CHEVRON_UP : CHEVRON_DOWN} className="w-4 h-4 text-muted" />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/** A toolbar for the tab's page-level actions, then a masonry of its cards (wide blocks drop to a full-width area). */
function PageFrame({ children }: { children: ReactNode }) {
  return (
    <ToolbarShell>
      <MasonryGrid>{children}</MasonryGrid>
    </ToolbarShell>
  );
}

export function buildTelesalesTabs(ctx: TelesalesContext): TabItem[] {
  const { personaId, data, services } = ctx;
  const accountRich = accountInformationRichFields({ data, onTicketCreated: ctx.onTicketCreated });
  const assetResolve = buildAssetsFieldResolver(undefined, data);
  const assetRich = assetsRichFields(data);
  const resolveAccount = (d: string) => accountInformationResolvers[d]?.({ data, services });

  const tab = (key: string, label: string, content: ReactNode, show = true): TabItem[] => (show ? [{ key, label, content }] : []);
  const has = (topic: string, only: string[]) => visibleCount(personaId, topic, only) > 0;

  // 3. Billing
  const billing: FieldGroup[] = [
    { title: 'Billing Summary', display: 'kpi', fields: ['Latest Bill', 'Outstanding Balance', 'Unbilled Usage', 'Due Date', 'Last Payment & Channel'] },
  ];
  // 5. Recent activities
  const recent: FieldGroup[] = [{ title: 'Recent Activity', display: 'list', fields: [RECENT_MILESTONES, 'Activity (last 5)', 'Last 5 Orders'] }];
  // 7. Contact & address
  const reach: FieldGroup[] = [
    { title: 'Contact Information', display: 'list', fields: ['First Name & Last Name (Full Name)', 'Email', 'Notification MSISDN', 'Preferred Language'] },
    { title: 'Authorised Persons', display: 'list', fields: ['Authorized person(s)', 'Authorized Role', 'Authorized Mobile', 'Authorized email'] },
  ];
  const address: FieldGroup[] = [
    { title: 'National Address', display: 'list', width: 'half', component: 'National Address', fields: [] },
    { title: 'Open UI Address', display: 'list', width: 'half', component: 'Open UI Address', fields: [] },
  ];

  // Deep-dive rows: shown only when the persona may see the field behind them.
  const deep: { group: string; title: string; topic: string; field: string; node: ReactNode }[] = [
    { group: 'activity', title: 'Orders', topic: 'Account Information', field: 'All Orders', node: accountRich['All Orders'] },
    { group: 'activity', title: 'Trouble Tickets', topic: 'Account Information', field: 'All Trouble Tickets', node: accountRich['All Trouble Tickets'] },
    { group: 'billing', title: 'Billing Profiles', topic: 'Account Information', field: 'All Billing Profiles', node: accountRich['All Billing Profiles'] },
    { group: 'products', title: 'Installed Assets', topic: 'Account Information', field: 'Installed Assets', node: accountRich['Installed Assets'] },
    {
      group: 'activity',
      title: 'Audit Trail',
      topic: 'Audit Trail',
      field: AUDIT,
      node: <AuditTrailSection data={data} onTicketCreated={ctx.onTicketCreated} onInteractionLogged={() => undefined} />,
    },
    { group: 'products', title: 'Account Hierarchy', topic: 'Account Information', field: 'Account Hierarchy', node: accountRich['Account Hierarchy'] },
    { group: 'products', title: 'Contact Hierarchy', topic: 'Account Information', field: 'Contact Hierarchy', node: accountRich['Contact Hierarchy'] },
    { group: 'products', title: 'Detailed Usage', topic: 'Assets', field: RECENT_USAGES, node: assetRich[RECENT_USAGES] },
    {
      group: 'penalties',
      title: 'Penalty View',
      topic: 'Penalty View',
      field: 'Star number Penalty',
      node: (
        <div className="space-y-4">
          <StarNumberPenaltyPolicy />
          <DevicePenaltyPolicy />
        </div>
      ),
    },
    {
      group: 'products',
      title: 'DOI Details',
      topic: 'Assets',
      field: 'DOI Handset Type',
      node: (
        <TopicFieldsSection
          personaId={personaId}
          topic="Assets"
          only={['DOI Handset Type', 'DOI Price', 'DOI Remaining Amount', 'DOI Tennure']}
          layout={[{ title: '', display: 'kpi', fields: ['DOI Handset Type', 'DOI Price', 'DOI Remaining Amount', 'DOI Tennure'] }]}
          resolveValue={assetResolve}
        />
      ),
    },
  ].filter((r) => has(r.topic, [r.field]));

  const rows = (group: string) => {
    const list = deep.filter((r) => r.group === group);
    if (list.length === 0) return null;
    return (
      <div className="card divide-y divide-border-soft">
        {list.map((r) => (
          <DeepDiveRow key={r.title} title={r.title}>
            {r.node}
          </DeepDiveRow>
        ))}
      </div>
    );
  };
  const heading = (t: string) => (
    <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-2">{t}</h3>
  );
  const visible = (topic: string) => getVisibleTopicFields(personaId, topic).length > 0;

  return [
    // Overview: the account at a glance, as one card per area (each links to the tab with the full detail).
    ...tab(
      'ts-overview',
      'Overview',
      <PageFrame>
        <AccountSection ctx={ctx} />
        <TelesalesOverview ctx={ctx} />
      </PageFrame>,
      true
    ),
    ...tab(
      'ts-contact',
      'Contact Details',
      <div className="space-y-6">
        <Block
          ctx={ctx}
          topic="Contact Information"
          groups={reach}
          resolve={(d) => contactInformationResolvers[d]?.({ data, services })}
          rich={{
            ...contactInformationRichFields({ data }),
            'First Name & Last Name (Full Name)': <ContactSection data={data} onTicketCreated={ctx.onTicketCreated} />,
          }}
        />
        <PageFrame>
          <ContactsSection ctx={ctx} />
        </PageFrame>
      </div>,
      visible('Contact Information')
    ),
    ...tab(
      'ts-address',
      'Address',
      <div className="space-y-6">
        <TopicFieldsSection
          personaId={personaId}
          topic="Account Address"
          layout={address}
          resolveValue={(d) => accountAddressResolvers[d]?.(data)}
          richFields={{ Zone: <AddressSection data={data} onTicketCreated={ctx.onTicketCreated} /> }}
        />
        <PageFrame>
          <AddressPageSection ctx={ctx} />
        </PageFrame>
      </div>,
      visible('Account Address')
    ),
    ...tab(
      'ts-products',
      'Products & Services',
      <div className="space-y-6">
        <AssetsSection
          customer={ctx.customer}
          services={services}
          servicesLoaded={ctx.servicesLoaded}
          selectedServiceRef={ctx.selectedServiceRef}
          initialSubView={ctx.assetsSubView}
          data={data}
          personaId={personaId}
        />
        {rows('products')}
        <PageFrame>
          <ConnectionsSection ctx={ctx} />
          <OffersSection ctx={ctx} />
          <UsageSection ctx={ctx} />
        </PageFrame>
      </div>,
      visible('Assets')
    ),
    ...tab(
      'ts-billing',
      'Billing & Payments',
      <div className="space-y-6">
        <Block ctx={ctx} topic="Billing & Payments" groups={billing} resolve={(d) => billingResolvers[d]?.(data)} rich={{ 'Latest Bill': <BillingSection data={data} /> }} />
        {rows('billing')}
        <PageFrame>
          <BillingPageSection ctx={ctx} />
        </PageFrame>
      </div>,
      has('Billing & Payments', billing.flatMap((g) => g.fields))
    ),
    ...tab(
      'ts-alerts',
      'Alerts & Risks',
      <div className="space-y-6">
        <TopicFieldsSection personaId={personaId} topic="Alerts & Risks" richFields={{ 'Bell Icon/Bulk Notes': <AlertsRisksSection data={data} /> }} />
        {visible('Blacklist View') && (
          <section>
            {heading('Blacklist view')}
            <TopicFieldsSection personaId={personaId} topic="Blacklist View" resolveValue={(d) => blacklistResolvers[d]?.(data)} />
          </section>
        )}
      </div>,
      visible('Alerts & Risks') || visible('Blacklist View')
    ),
    ...tab(
      'ts-leads',
      'Leads',
      <div className="space-y-6">
        <TopicFieldsSection personaId={personaId} topic="Account/Contact Lead" resolveValue={(d) => leadResolvers[d]?.(data)} />
        <PageFrame>
          <LeadsSection ctx={ctx} />
        </PageFrame>
      </div>,
      visible('Account/Contact Lead')
    ),
    ...tab('ts-penalties', 'Penalties', rows('penalties'), deep.some((r) => r.group === 'penalties')),
    ...tab(
      'ts-history',
      'Activity History',
      <div className="space-y-6">
        <Block ctx={ctx} topic="Account Information" groups={recent} resolve={resolveAccount} rich={accountRich} />
        <section>
          {heading('Interactions')}
          <CommunicationsSection data={data} />
        </section>
        {rows('activity')}
        <PageFrame>
          <OrdersTicketsSection ctx={ctx} />
          <AuditSection ctx={ctx} />
        </PageFrame>
      </div>
    ),
    ...tab(
      'ts-activation',
      'Activation & Changes',
      <TopicFieldsSection personaId={personaId} topic="Activation/Modification Sidebar" />,
      visible('Activation/Modification Sidebar')
    ),
  ];
}

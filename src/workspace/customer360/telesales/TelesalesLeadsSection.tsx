import { SearchField } from '../../../components/primitives/SearchField';
import { FilterSelect } from '../sections/C360Kit';
import { useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { Card, KV, Pill, dateTime, type Ctx } from './TelesalesOverview';
import { ActionList, HeaderLink, ICON, SectionHeader, StatStrip, Table, TableCard, pillFor, WideBlock } from './TelesalesKit';
import { rowDate, demoOf, arr } from './shared';
import { strOrEmpty as str } from '../../../lib/values';

// ============================================================================ Leads
export function LeadsSection({ ctx }: { ctx: Ctx }) {
  const { data } = ctx;
  const demo = demoOf(ctx);
  const leads = data.leads;
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All Lead Types');
  const [status, setStatus] = useState('All Statuses');
  const [picked, setPicked] = useState<string | undefined>();
  const stat = (s: string) => leads.filter((l) => str(l.status).toLowerCase().includes(s)).length;
  const types = ['All Lead Types', ...Array.from(new Set(leads.map((l) => str(l.serviceNeeded)).filter(Boolean)))];
  const statuses = ['All Statuses', ...Array.from(new Set(leads.map((l) => str(l.status)).filter(Boolean)))];
  const shown = leads.filter(
    (l) =>
      (type === 'All Lead Types' || str(l.serviceNeeded) === type) &&
      (status === 'All Statuses' || str(l.status) === status) &&
      `${str(l.leadId)} ${str(l.serviceNeeded)} ${str(l.mobileNumber)} ${str(l.status)} ${str(l.comments)}`.toLowerCase().includes(query.toLowerCase())
  );
  const cur = leads.find((l) => str(l.leadId) === picked);
  const activities = arr<{ at: string; activity: string; by: string }>(demo.leadActivities);
  return (
    <>
      <SectionHeader
       
       
       
        actions={
          <>
            <HeaderLink onClick={() => ctx.goToTab('ts-leads')}>All Leads ›</HeaderLink>
          </>
        }
      />
      <StatStrip
        items={[
          { value: leads.length, label: 'Total Leads', icon: ICON.grid },
          { value: stat('open') + stat('new'), label: 'Open Leads', icon: ICON.refresh },
          { value: stat('progress') + stat('callback') + stat('contacted') + stat('qualified'), label: 'In Progress', icon: ICON.refresh },
          { value: stat('convert'), label: 'Converted', icon: ICON.check },
          { value: stat('closed') + stat('lost'), label: 'Closed / Lost' },
        ]}
      />
      <WideBlock className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4 items-start">
        <div className="space-y-4">
          <Card title={`Leads List (${leads.length})`} icon={ICON.search}>
            <div className="px-4 py-3 flex gap-2 border-b border-[var(--field-card-border)]">
              <SearchField value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search by lead type, MSISDN, status or comments..." aria-label="Search leads" wrapperClassName="flex-1 min-w-48" />
              <FilterSelect label="Lead Type" value={type} options={types.map((x) => ({ value: x, label: x }))} onChange={(v) => setType(v)} />
              <FilterSelect label="Lead Status" value={status} options={statuses.map((x) => ({ value: x, label: x }))} onChange={(v) => setStatus(v)} />
            </div>
            <Table
              rows={shown}
              empty="No leads on file for this customer."
              cols={[
                { header: '#', render: (_l, i) => i + 1 },
                { header: 'Lead ID', render: (l) => <button type="button" className="font-bold" onClick={() => setPicked(str(l.leadId))}>{str(l.leadId)}</button> },
                { header: 'Lead Type', render: (l) => str(l.serviceNeeded) },
                { header: 'MSISDN / Service', render: (l) => str(l.mobileNumber) || '-' },
                { header: 'Created By', render: (l) => str(l.ownerId) },
                { header: 'Created On', render: (l) => (l.createdAt ? rowDate(l.createdAt) : l.callbackDate ? dateTime(l.callbackDate).d : '-') },
                { header: 'Status', render: (l) => <Pill tone={pillFor(str(l.status))}>{str(l.status)}</Pill> },
                { header: 'Comments', render: (l) => str(l.comments) || '-' },
                { header: 'Actions', render: () => <span className="text-accent font-bold">···</span> },
              ]}
            />
          </Card>
          <Card title="Lead Details" icon={ICON.search}>
            {cur ? (
              <>
                <KV label="Lead ID">{str(cur.leadId)}</KV>
                <KV label="Lead Type">{str(cur.serviceNeeded)}</KV>
                <KV label="MSISDN / Service">{str(cur.mobileNumber) || '-'}</KV>
                <KV label="Created By">{str(cur.ownerId)}</KV>
                <KV label="Created Via">{str(cur.createdVia) || '-'}</KV>
                <KV label="Status">
                  <Pill tone={pillFor(str(cur.status))}>{str(cur.status)}</Pill>
                </KV>
                <KV label="Comments">{str(cur.comments) || '-'}</KV>
              </>
            ) : (
              <div className="py-10 text-center text-muted">
                <Icon path={ICON.search} className="w-8 h-8 mx-auto mb-2" />
                <div className="text-[length:var(--fs-body-lg)]">Select a lead from the list</div>
                <div className="text-[length:var(--fs-caption)]">to view full details, update information and add notes.</div>
              </div>
            )}
          </Card>
          <TableCard
            title="Recent Lead Activities"
            icon={ICON.refresh}
            link="View All"
            rows={activities}
            cols={[
              { header: 'Date & Time', render: (r) => rowDate(r.at) },
              { header: 'Activity', render: (r) => r.activity },
              { header: 'Performed By', render: (r) => r.by },
            ]}
          />
        </div>
        <div className="space-y-4">
          <Card title="Quick Actions" icon={ICON.bars}>
            <ActionList
              items={[
                { title: 'Create New Lead', sub: 'Capture a new sales opportunity', icon: ICON.star },
                { title: 'Convert to Sales Order', sub: 'Proceed with eligible journey', icon: ICON.check },
                { title: 'Add Follow-Up', sub: 'Schedule a follow-up reminder', icon: ICON.refresh },
                { title: 'View Lead History', sub: 'See all lead activities for this customer', icon: ICON.search },
              ]}
            />
          </Card>
          <Card title="Lead Guidelines" icon={ICON.shield}>
            <ul className="px-5 py-4 text-fg-2 text-[length:var(--fs-body)] space-y-3">
              <li>Use appropriate Lead Type based on customer interest.</li>
              <li>Add detailed comments to help with follow-up.</li>
              <li>Convert eligible leads to a sales order.</li>
              <li>Follow up on open leads regularly.</li>
            </ul>
          </Card>
          <Card title="Related Information" icon={ICON.search}>
            <ActionList
              items={[
                { title: 'Customer Offers', sub: 'View eligible offers for this customer' },
                { title: 'Connections', sub: "View customer's active connections", onClick: () => ctx.goToTab('ts-products') },
                { title: 'Orders', sub: 'View orders created from leads', onClick: () => ctx.goToTab('ts-history') },
                { title: 'Activity History', sub: 'View all customer activities', onClick: () => ctx.goToTab('ts-history') },
              ]}
            />
          </Card>
        </div>
      </WideBlock>
    </>
  );
}

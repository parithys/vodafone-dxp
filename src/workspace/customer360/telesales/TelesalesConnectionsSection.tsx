import { SearchField } from '../../../components/primitives/SearchField';
import { overallCreditLimitOf } from '../creditLimitView';
import { FilterSelect } from '../sections/C360Kit';
import { useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { ConnectionTypeTag } from '../../../components/primitives/ConnectionTypeTag';
import { buildAssetsFieldResolver } from '../sections/assetsResolvers';
import { isActiveService } from '../../../engines/customerServicesEngine';
import { blacklistResolvers } from '../sections/blacklistResolvers';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import { Card, KV, Pill, dateTime, type Ctx } from './TelesalesOverview';
import { TabStrip } from '../../../components/primitives/TabStrip';
import { ActionList, HeaderButton, ICON, SectionHeader, StatStrip, Table, TableCard, pillFor, yesNo, WideBlock } from './TelesalesKit';
import { strOrEmpty as str } from '../../../lib/values';
import { arr, rowDate, activityEntries } from './shared';
import { formatQarAny } from '../../../lib/format';

// ============================================================================ Connections & Services
const SERVICE_FILTERS = ['All Services', 'Mobile', 'Fixed Line', 'TV', 'GigaHome'];

export function ConnectionsSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All Services');
  const [status, setStatus] = useState('All Status');
  const [picked, setPicked] = useState(services[0]?.ref);
  const [tab, setTab] = useState('overview');
  const group = (cat: string) => (cat === 'Prepaid' || cat === 'Postpaid' ? 'Mobile' : cat === 'TV / Entertainment' ? 'TV' : cat.startsWith('GigaHome') ? 'GigaHome' : cat);
  const shown = services.filter((s) => (type === 'All Services' || group(s.category) === type) && (status === 'All Status' || (status === 'Active' ? isActiveService(s) : (s.status ?? '') === status)) && `${s.identifier} ${s.label} ${s.category}`.toLowerCase().includes(query.toLowerCase()));
  const cur = services.find((s) => s.ref === picked) ?? services[0];
  const res = buildAssetsFieldResolver(cur, data);
  const addons = data.addonsDiscounts.filter((a) => a.category !== 'Discount');
  const discounts = data.addonsDiscounts.filter((a) => a.category === 'Discount');
  const creditLimit = data.creditLimits[0];
  const billLimit = res('Bill Limit') ?? (creditLimit ? `${formatQarAny(overallCreditLimitOf(data) ?? str(creditLimit.creditLimitQar ?? creditLimit.creditLimitQAR))}` : '-');
  const bal = data.inPlatformBalances[0];
  const use = data.serviceUsage[0];
  const ex = data.overviewExtras[0];
  const voiceTotal = Number(ex?.voiceAllowanceMin ?? 500);
  const voiceLeft = bal?.voiceBalanceMinutes != null ? Number(bal.voiceBalanceMinutes) : Math.max(0, voiceTotal - Number(use?.currentVoiceUsageMinutes ?? 0));
  const smsTotal = Number(ex?.smsAllowance ?? 500);
  const smsLeft = bal?.smsBalanceCount != null ? Number(bal.smsBalanceCount) : Number(ex?.smsRemaining ?? 0);
  const dataTotal = use ? Number(use.currentDataUsageGB) + Number(use.availableDataBalanceGB) : 0;
  const dataLeft = bal?.dataBalanceGB != null ? Number(bal.dataBalanceGB) : Number(use?.availableDataBalanceGB ?? 0);
  const bar = (label: string, left: number, total: number, unit: string) => (
    <div key={label} className="flex items-center gap-3 px-5 py-2.5">
      <span className="w-12 text-fg-2 text-[length:var(--fs-caption)]">{label}</span>
      <span className="flex-1 h-2 rounded-[var(--radius-pill)] bg-surface overflow-hidden">
        <span className="block h-full bg-accent" style={{ width: `${total ? Math.min(100, (left / total) * 100) : 0}%` }} />
      </span>
      <span className="text-fg font-semibold text-[length:var(--fs-caption)] whitespace-nowrap">
        {left} of {total} {unit}
      </span>
    </div>
  );
  const entries = activityEntries(ctx).slice(0, 5);
  const cdr = [...data.callDetailRecords].sort((a, b) => str(b.callDate).localeCompare(str(a.callDate))).slice(0, 5);
  const usageBehaviour = arr<{ name: string }>((data.demoCatalog[0] ?? {}).usageInsights).slice(0, 4).map((u) => u.name.replace(/ User$/, ''));
  const pr = (s: string) => str(res(s));
  const c = (cats: string[]) => services.filter((s) => cats.includes(s.category)).length;
  return (
    <>
      <SectionHeader
       
       
       
        actions={
          <>
            <HeaderButton primary>+ New Connection</HeaderButton>
          </>
        }
      />
      <StatStrip
        items={[
          { value: c(['Prepaid', 'Postpaid']), label: 'Mobile Connections' },
          { value: c(['Fixed Line']), label: 'Fixed Line' },
          { value: c(['TV / Entertainment']), label: 'TV Connections' },
          { value: c(['GigaHome Fibre', 'GigaHome 5G']), label: 'GigaHome' },
        ]}
      />
      <WideBlock className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 items-start">
        <Card title="" icon={ICON.bars}>
          <div className="px-4 py-3 flex gap-2 border-b border-[var(--field-card-border)]">
            <SearchField value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search by MSISDN, service number or plan name..." aria-label="Search connections" wrapperClassName="flex-1 min-w-48" />
            <FilterSelect label="Service Type" value={type} options={SERVICE_FILTERS.map((x) => ({ value: x, label: x }))} onChange={(v) => setType(v)} />
            <FilterSelect label="Status" value={status} options={['All Status', 'Active', 'Suspended'].map((x) => ({ value: x, label: x }))} onChange={(v) => setStatus(v)} />
          </div>
          {shown.map((s) => {
            const rr = buildAssetsFieldResolver(s, data);
            return (
              <button key={s.ref} type="button" onClick={() => setPicked(s.ref)} className={`w-full text-left px-5 py-4 border-b border-[var(--field-card-border)] last:border-0 hover:bg-surface ${cur?.ref === s.ref ? 'bg-surface' : ''}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon path={ICON.phone} className="w-4 h-4 shrink-0" />
                    <span className="text-fg font-bold text-[length:var(--fs-body-lg)] truncate">{s.identifier}</span>
                    <Pill tone={pillFor(s.status ?? 'Active') === 'red' ? 'red' : 'green'}>{s.status ?? 'Active'}</Pill>
                    <ConnectionTypeTag category={s.category} />
                  </span>
                  <Icon path={ICON.chevron} className="w-4 h-4 text-muted shrink-0" />
                </div>
                <div className="text-fg-2 text-[length:var(--fs-caption)] mt-1">
                  {group(s.category)} | {s.category} | {s.label}
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2 text-[length:var(--fs-caption)]">
                  {[
                    ['Plan Name', str(rr('Plan Name')) || s.label],
                    ['Bill Limit', str(rr('Bill Limit')) || '-'],
                    ['Active Add-ons', String(addons.length)],
                    ['Active Discount', discounts.length ? `${discounts.length}` : '-'],
                    ['Usage Behaviour', usageBehaviour[0] ?? '-'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-muted uppercase text-[length:var(--fs-micro)]">{k}</div>
                      <div className="text-fg font-semibold">{v}</div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
          {shown.length === 0 && <p className="px-5 py-4 text-muted text-[length:var(--fs-body)]">No connections match.</p>}
        </Card>

        <Card title="" icon={ICON.bars}>
          {cur ? (
            <>
              <div className="px-5 py-4 flex items-start justify-between">
                <div>
                  <div className="text-fg font-bold text-[length:var(--fs-h4)]">{cur.identifier}</div>
                  <div className="text-fg-2 text-[length:var(--fs-body)]">
                    {group(cur.category)} | {cur.category} | {cur.label}
                  </div>
                </div>
                <span className="inline-flex items-center gap-2">
                  <ConnectionTypeTag category={cur.category} />
                  <Pill tone="green">{cur.status ?? 'Active'}</Pill>
                </span>
              </div>
              <div className="px-5 pb-3">
                <TabStrip
                  active={tab}
                  onChange={setTab}
                  items={[
                    { key: 'overview', label: 'Overview' },
                    { key: 'usage', label: 'Usage' },
                    { key: 'plan', label: 'Plan & Add-Ons' },
                    { key: 'benefits', label: 'Benefits' },
                    { key: 'doi', label: 'Device (DOI)' },
                    { key: 'more', label: 'More' },
                  ]}
                />
              </div>
              {tab === 'overview' && (
                <>
                  <div className="grid grid-cols-2 border-t border-[var(--field-card-border)]">
                    <div className="border-r border-[var(--field-card-border)]">
                      <div className="flex items-center justify-between px-5 py-3">
                        <span className="text-fg font-semibold">Service Details</span>
                        <span className="text-link font-semibold text-[length:var(--fs-caption)]">Edit</span>
                      </div>
                      <KV label="MSISDN">{cur.identifier}</KV>
                      <KV label="Service Type">{group(cur.category)}</KV>
                      <KV label="Status">{cur.status ?? 'Active'}</KV>
                      <KV label="Plan Name">{pr('Plan Name') || cur.label}</KV>
                      <KV label="MSISDN Activation Date">{pr('MSISDN Activation Date') ? dateTime(pr('MSISDN Activation Date')).d : '-'}</KV>
                      <KV label="Postpaid Activation Date">{pr('Postpaid Activation Date') ? dateTime(pr('Postpaid Activation Date')).d : '-'}</KV>
                      <KV label="Plan Activation Date">{pr('Plan Activation Date') ? dateTime(pr('Plan Activation Date')).d : '-'}</KV>
                      <KV label="SIM Serial">{pr('Sim serial') || '-'}</KV>
                      <KV label="Star Number Value">{yesNo(res('Star number value') ? 'Yes' : 'No')}</KV>
                      <KV label="AutoBase Eligibility">
                        <Pill tone="green">Eligible</Pill>
                      </KV>
                    </div>
                    <div>
                      <div className="flex items-center justify-between px-5 py-3">
                        <span className="text-fg font-semibold">Financials</span>
                        <button type="button" onClick={() => ctx.goToTab('ts-billing')} className="text-link font-semibold text-[length:var(--fs-caption)]">
                          View Usage
                        </button>
                      </div>
                      <KV label="Bill Limit">{billLimit}</KV>
                      <KV label="Current Balance">{bal ? `${formatQarAny(str(bal.mainBalanceQAR ?? 0))}` : '-'}</KV>
                      <KV label="Pending Discounts">{discounts.length}</KV>
                      <KV label="Active Discount">{discounts[0] ? str(discounts[0].name) : '-'}</KV>
                      {bar('Data', dataLeft, Math.round(dataTotal), 'GB')}
                      {bar('Voice', voiceLeft, voiceTotal, 'Mins')}
                      {bar('SMS', smsLeft, smsTotal, 'SMS')}
                      <KV label="Primary Balance">{bal ? `${formatQarAny(str(bal.mainBalanceQAR ?? 0))}` : '-'}</KV>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-3 border-t border-[var(--field-card-border)] text-[length:var(--fs-body)]">
                    <div>
                      <span className="text-fg font-semibold">✓ Active Add-ons ({addons.length})</span> <span className="text-accent font-semibold">View All</span>
                      <div className="flex flex-wrap gap-3 mt-1 text-fg-2">
                        {addons.length === 0 && <span>None</span>}
                        {addons.map((a) => (
                          <span key={str(a.addonDiscountId)}>
                            {str(a.name)} <Pill tone="green">Active</Pill>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-fg font-semibold">Barring Flags</span> <span className="text-accent font-semibold">View Details</span>
                      <div className="flex flex-wrap gap-3 mt-1 text-fg-2">
                        {['Outgoing Bar', 'Incoming Bar', 'Any Barring Flags'].map((b) => (
                          <span key={b}>
                            {b} <Pill tone="red">No</Pill>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-fg font-semibold">Usage Behaviour</span> <span className="text-accent font-semibold">View Details</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {usageBehaviour.map((u) => (
                          <Pill key={u} tone="amber">
                            {u}
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-fg font-semibold">App &amp; Digital</span> <span className="text-accent font-semibold">View Details</span>
                      <div className="text-fg-2 mt-1">
                        App User: <b className="text-fg">{data.digitalEngagement[0] ? (data.digitalEngagement[0].appActiveUser ? 'Yes' : 'No') : '-'}</b> Last Login:{' '}
                        <b className="text-fg">{data.digitalEngagement[0]?.appLastLoginAt ? dateTime(data.digitalEngagement[0].appLastLoginAt).d : '-'}</b> Digital Adoption:{' '}
                        <b className="text-fg">{data.digitalEngagement[0] ? `${str(data.digitalEngagement[0].appDigitalAdoptionPct)}%` : '-'}</b> App Version: <b className="text-fg">{str(data.digitalEngagement[0]?.appVersion) || '-'}</b> Phone Version:{' '}
                        <b className="text-fg">{str(ex?.phoneVersion) || '-'}</b>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {tab === 'usage' && (
                <div className="border-t border-[var(--field-card-border)] py-2">
                  {bar('Data', dataLeft, Math.round(dataTotal), 'GB')}
                  {bar('Voice', voiceLeft, voiceTotal, 'Mins')}
                  {bar('SMS', smsLeft, smsTotal, 'SMS')}
                </div>
              )}
              {tab === 'plan' && (
                <div className="border-t border-[var(--field-card-border)]">
                  <KV label="Plan Name">{pr('Plan Name') || cur.label}</KV>
                  <KV label="Active Add-Ons">{addons.map((a) => str(a.name)).join(', ') || 'None'}</KV>
                  <KV label="Active Discounts">{discounts.map((a) => str(a.name)).join(', ') || 'None'}</KV>
                  <KV label="Bill Limit">{billLimit}</KV>
                </div>
              )}
              {tab === 'benefits' && (
                <div className="border-t border-[var(--field-card-border)]">
                  <KV label="Plan and Add-Ons Benefits">{pr('Plan and Add-ons Benefits') || '-'}</KV>
                </div>
              )}
              {tab === 'doi' && (
                <div className="border-t border-[var(--field-card-border)]">
                  <KV label="DOI Handset Type">{pr('DOI Handset Type') || '-'}</KV>
                  <KV label="DOI Price">{pr('DOI Price') || '-'}</KV>
                  <KV label="DOI Remaining Amount">{pr('DOI Remaining Amount') || '-'}</KV>
                  <KV label="DOI Tenure">{pr('DOI Tennure') || '-'}</KV>
                </div>
              )}
              {tab === 'more' && (
                <div className="border-t border-[var(--field-card-border)]">
                  <KV label="Service Reference">{cur.ref}</KV>
                  <KV label="Category">{cur.category}</KV>
                </div>
              )}
            </>
          ) : (
            <p className="px-5 py-4 text-muted">No connection selected.</p>
          )}
        </Card>
      </WideBlock>
      <div className="contents">
        <TableCard
          title="Recent Usage (Last 10)"
          icon={ICON.refresh}
          link="View All"
          onLink={() => ctx.goToTab('ts-products')}
          rows={cdr}
          empty="No recent usage on file."
          cols={[
            { header: 'Date & Time', render: (r) => rowDate(r.callDate) },
            { header: 'Type', render: (r) => str(r.callType) },
            { header: 'Details', render: (r) => str(r.destination) },
            { header: 'Amount / Volume', render: (r) => <b>{`${Math.round(Number(r.durationSeconds ?? 0) / 60)} Mins`}</b> },
          ]}
        />
        <TableCard
          title="Recent Activities"
          icon={ICON.star}
          link="View All"
          onLink={() => ctx.goToTab('ts-history')}
          rows={entries}
          cols={[
            { header: 'Date & Time', render: (e) => rowDate(e.at) },
            { header: 'Activity', render: (e) => e.type },
            { header: 'Channel', render: (e) => e.channel },
          ]}
        />
        <Card title="Quick Actions" icon={ICON.bars} link="View All">
          <ActionList
            items={[
              { title: 'Change Plan', sub: 'Modify current plan' },
              { title: 'Add / Remove Add-Ons', sub: 'Manage add-ons' },
              { title: 'Request SIM Swap', sub: 'Initiate SIM replacement' },
              { title: 'View Device / DOI', sub: 'Check device installment' },
              { title: 'Trouble Ticket', sub: 'Log an issue for this line', onClick: () => ctx.goToTab('ts-history') },
            ]}
          />
        </Card>
      </div>
    </>
  );
}

// Re-exported so the Overview page can keep its Blacklist view / table helpers in one place.
export { Table, blacklistResolvers, getVisibleTopicFields };

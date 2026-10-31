import { isBusinessSegment } from '../../../engines/businessSegment';
import { Button } from '../../../components/primitives/Button';
import { useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { accountInformationResolvers } from '../sections/accountInformationResolvers';
import { Card, KV, Label, Pill, Value, asText, dateTime, num, type Ctx } from './TelesalesOverview';
import { ActionList, Avatar, HeaderButton, HeaderLink, ICON, SectionHeader, TableCard, pillFor, yesNo } from './TelesalesKit';
import { strOrEmpty as str } from '../../../lib/values';
import { demoOf, arr, rowDate, activityEntries, toneColor } from './shared';

// ============================================================================ Account
export function AccountSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const r = (d: string) => accountInformationResolvers[d]?.({ data, services });
  const demo = demoOf(ctx);
  const dunning = asText(r('Current Dunning Stage')) as string | undefined;
  const bar = (asText(data.overviewExtras[0]?.aboutToBar as string | undefined) ?? 'No') as string;
  const count = (cats: string[]) => services.filter((s) => cats.includes(s.category)).length;
  const emails = arr<string>(demo.billingEmails).length ? arr<string>(demo.billingEmails) : [str(data.billingProfiles[0]?.billingContactEmail)].filter(Boolean);
  const [allEmails, setAllEmails] = useState(false);
  const keyContacts = arr<{ role: string; name: string | null; mobile: string | null; email: string | null }>(demo.keyContacts);
  const isBusinessSeg = isBusinessSegment(data.customer.segment);
  const entries = activityEntries(ctx).slice(0, 5);
  const orders = [...data.orders].sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt))).slice(0, 5);
  const pend: [string, string][] = [
    ['Pending TON Requests', 'Pending TON requests'],
    ['Pending Adjustments', 'Pending Adjustments'],
    ['Pending SIM Swap', 'Pending Sim swap'],
  ];
  return (
    <>
      <SectionHeader
       
       
       
        actions={
          <>
            <HeaderLink onClick={() => ctx.goToTab('ts-products')}>View Account Hierarchy →</HeaderLink>
            <HeaderButton primary onClick={() => ctx.goToTab('ts-leads')}>
              + Create Lead
            </HeaderButton>
          </>
        }
      />
      <div className="contents">
        <Card title="Account Information" icon={ICON.card} link="View Account Hierarchy" onLink={() => ctx.goToTab('ts-products')}>
          <div className="px-5 py-4 grid grid-cols-3 gap-4">
            <div>
              <Label>Account Number</Label>
              <Value>{str(data.accounts[0]?.accountId)}</Value>
            </div>
            <div>
              <Label>Primary MSISDN</Label>
              <Value>{str(r('Primary MSISDN'))}</Value>
            </div>
            <div>
              <Label>Segment</Label>
              <Value>{str(r('Segment'))}</Value>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 px-0">
            <KV label="Current Dunning Stage">
              <Pill tone={dunning && !/^(none|no dunning|current)$/i.test(dunning) ? 'amber' : 'green'}>{dunning ?? '-'}</Pill>
            </KV>
            <KV label="About to OG/IC Bar">{yesNo(bar)}</KV>
            <KV label="Credit Limit">{str(r('Credit Limit')) || '-'}</KV>
            {pend.map(([label, d]) => (
              <KV key={d} label={label}>
                <Pill tone="amber">{num(r(d)) ?? 0}</Pill>
              </KV>
            ))}
          </div>
          <div className="px-5 py-4 grid grid-cols-4 gap-2">
            {[
              ['Mobile', ICON.phone, ['Prepaid', 'Postpaid']],
              ['Fixed Line', ICON.phone, ['Fixed Line']],
              ['TV', ICON.grid, ['TV / Entertainment']],
              ['GigaHome', ICON.globe, ['GigaHome Fibre', 'GigaHome 5G']],
            ].map(([label, icon, cats]) => (
              <div key={label as string} className="rounded-[var(--radius-card)] bg-surface px-2 py-3 text-center">
                <Icon path={icon as string} className="w-5 h-5 mx-auto text-fg" />
                <div className="text-fg font-bold text-[length:var(--fs-h4)]">{count(cats as string[])}</div>
                <div className="text-muted text-[length:var(--fs-caption)]">{label as string}</div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <div className="text-fg-2 font-semibold text-[length:var(--fs-body)] border-b border-[var(--field-card-border)] pb-2 mb-2">Billing Email ID(s)</div>
            <ul className="text-fg text-[length:var(--fs-body)] space-y-1">
              {(allEmails ? emails : emails.slice(0, 2)).map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
            {emails.length > 2 && (
              <Button variant="tertiary" type="button" className="mt-1" onClick={() => setAllEmails((v) => !v)}>
                {allEmails ? 'Show less' : `+${emails.length - 2} more`}
              </Button>
            )}
          </div>
        </Card>

        {/* Key Contacts (account manager, escalation) belong to business accounts. The seeded list is the same
            three roles for every customer, so it is shown only for the Enterprise (EBU) segment. */}
        {isBusinessSeg && (
          <Card title="Key Contacts" icon={ICON.user} link="View All" onLink={() => ctx.goToTab('ts-contact')}>
            {keyContacts.length === 0 && <p className="px-5 py-4 text-muted text-[length:var(--fs-body)]">No key contacts on file.</p>}
            {keyContacts.map((k) => (
              <div key={k.role} className="flex gap-4 px-5 py-4 border-b border-[var(--field-card-border)] last:border-0">
                <Avatar name={k.name ?? 'Manager'} />
                <div className="min-w-0">
                  <div className="text-muted uppercase tracking-wide text-[length:var(--fs-caption-upper)]">{k.role}</div>
                  {k.name && <div className="text-fg font-semibold text-[length:var(--fs-body-lg)]">{k.name}</div>}
                  {k.mobile && (
                    <div className="text-fg-2 text-[length:var(--fs-body)] inline-flex items-center gap-2">
                      <Icon path={ICON.phone} className="w-3.5 h-3.5" />
                      {k.mobile}
                    </div>
                  )}
                  {k.email && (
                    <div className="text-fg-2 text-[length:var(--fs-body)] flex items-center gap-2">
                      <Icon path={ICON.globe} className="w-3.5 h-3.5" />
                      {k.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}

        <Card title="Related Actions" icon={ICON.bars}>
          <ActionList
            items={[
              { title: 'New Activation / Migration', sub: 'Cross-Sales, AutoBase, Happy Offer', icon: ICON.chevron },
              { title: 'Modify Existing Plan', sub: 'Change plan or add-ons', icon: ICON.refresh },
              { title: 'Request SIM Swap', sub: 'Initiate SIM replacement', icon: ICON.refresh },
              { title: 'Create Trouble Ticket', sub: 'Log an issue for this account', icon: ICON.help, onClick: () => ctx.goToTab('ts-history') },
              { title: 'Create Lead', sub: 'Capture sales opportunity', icon: ICON.star, onClick: () => ctx.goToTab('ts-leads') },
            ]}
          />
        </Card>
      </div>

      <div className="contents">
        <Card title="Recent Milestones / Interactions" icon={ICON.refresh} link="View All" onLink={() => ctx.goToTab('ts-history')}>
          <div className="px-5 py-3">
            {entries.length === 0 && <p className="text-muted text-[length:var(--fs-body)] py-2">Nothing on file.</p>}
            {entries.map((e, i) => {
              const t = dateTime(e.at);
              return (
                <div key={i} className="flex gap-4 py-3">
                  <div className="w-24 shrink-0 text-fg-2 text-[length:var(--fs-caption)]">
                    <div>{t.d}</div>
                    <div>{t.t}</div>
                  </div>
                  <span className={`w-8 h-8 rounded-[var(--radius-pill)] ${toneColor[e.tone]} flex items-center justify-center text-on-dark shrink-0`}>
                    <Icon path={ICON.refresh} className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-fg font-semibold text-[length:var(--fs-body-lg)]">{e.type}</div>
                    <div className="text-fg-2 text-[length:var(--fs-body)]">{e.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <TableCard
          title="Last 5 Activities"
          icon={ICON.star}
          link="View All"
          onLink={() => ctx.goToTab('ts-history')}
          rows={entries}
          empty="No activity on file."
          cols={[
            { header: 'Date & Time', render: (e) => rowDate(e.at) },
            { header: 'Activity Type', render: (e) => e.type },
            { header: 'Details', render: (e) => e.detail },
            { header: 'Channel', render: (e) => e.channel },
          ]}
        />
        <TableCard
          title="Last 5 Orders"
          icon={ICON.card}
          link="View All"
          onLink={() => ctx.goToTab('ts-history')}
          rows={orders}
          empty="No orders on file."
          cols={[
            { header: 'Order Number', render: (o) => <b>{str(o.orderId)}</b> },
            { header: 'Date', render: (o) => (o.createdAt ? dateTime(o.createdAt).d : '-') },
            { header: 'Product / Service', render: (o) => str(o.orderType) },
            { header: 'Status', render: (o) => <Pill tone={pillFor(str(o.status))}>{str(o.status)}</Pill> },
          ]}
        />
      </div>
    </>
  );
}

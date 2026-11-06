import { Icon } from '../../../components/primitives/Icon';
import { contactInformationResolvers } from '../sections/contactInformationResolvers';
import { Card, Pill, type Ctx } from './TelesalesOverview';
import { asText, dateTime } from './telesalesOverviewModel';
import { HeaderButton, SectionHeader, StatStrip, TableCard, WideBlock } from './TelesalesKit';
import { ICON, pillFor } from './telesalesKitModel';
import { demoOf, arr, type Rec } from './shared';
import { strOrEmpty as str } from '../../../lib/values';
import { catalogOf } from './billingShared';
import type { ReactNodeLike } from './billingShared';

// ============================================================================ Offers & Opportunities
export function OffersSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const cat = catalogOf(ctx);
  const demo = demoOf(ctx);
  const nbo = arr<{ badge: string; name: string; tagline: string; benefits: string[]; personalised: boolean }>(cat.nextBestOffers);
  const other = arr<{ name: string; sub: string; icon: string }>(cat.otherEligible);
  const discounts = arr<{ name: string; sub: string }>(cat.eligibleDiscounts);
  const opps = arr<{ name: string; sub: string; status: string }>(cat.additionalOpportunities);
  const cross = arr<Rec>(cat.crossSell);
  const sales = arr<Rec>(cat.salesEnhancement);
  const history = arr<Rec>(demo.offerHistory);
  const real = data.crossSalesOffers;
  // A real next-best offer for this customer leads the recommendations when there is one.
  const lead = real[0] ? str(real[0].offerName) : undefined;
  const cards = nbo.map((o, i) => (i === 0 && lead ? { ...o, name: lead } : o));
  const iconFor = (k: string) => (k === 'globe' ? ICON.globe : k === 'phone' ? ICON.phone : k === 'card' ? ICON.card : k === 'grid' ? ICON.grid : ICON.user);
  const doi = str(data.deviceInstallments[0]?.eligibilityListMembership);
  const c = (d: string) => asText(contactInformationResolvers[d]?.({ data, services }));
  const row = (name: string, sub: string, icon: string, pill?: ReactNodeLike) => (
    <div key={name} className="row pad-panel row-rule-card">
      <span className="text-accent shrink-0">
        <Icon path={icon} className="size-5 " />
      </span>
      <div className="min-w-0 flex-1">
        <div className="title title-md font-semibold">{name}</div>
        <div className="caption-secondary">{sub}</div>
      </div>
      {pill}
      <Icon path={ICON.chevron} className="icon-sm text-muted" />
    </div>
  );
  return (
    <>
      <SectionHeader
       
       
       
        actions={
          <>
            <HeaderButton>⟳ Check Latest Offers</HeaderButton>
            <HeaderButton primary>Start Sales Journey ›</HeaderButton>
          </>
        }
      />
      <StatStrip
        items={[
          { value: other.length ? Math.min(5, other.length) : 0, label: 'Eligible Offers', icon: ICON.grid },
          { value: cards.length, label: 'Next Best Offers', icon: ICON.star },
          { value: discounts.length, label: 'Eligible Discounts', icon: ICON.check },
          { value: doi ? 1 : 0, label: 'DOI Eligible', icon: ICON.phone },
          { value: cross.filter((x) => str(x.service) === 'Fixed Line').length, label: 'Fixed Line Offer', icon: ICON.globe },
          { value: str(c('Cross sale offers flag')) || 'No', label: 'Cross-Sell Flag', tone: 'ok' },
          { value: c('Sales enhansment offers') ? 'Yes' : 'No', label: 'Sales Enhancement', tone: 'ok' },
        ]}
      />
      <div className="contents">
        <Card title="Next Best Offers" icon={ICON.star} link="View All Offers" className="md:[grid-column:span_2]">
          <p className="px-5 py-3 text-secondary">AI recommended offers based on customer profile and usage behaviour.</p>
          <div className="px-5 pb-5 pair-grid">
            {cards.map((o, i) => (
              <div key={o.name} className={`card-frame p-4 ${i === 0 ? 'border-accent border-2' : 'border-[var(--field-card-border)]'}`}>
                <span className={`badge-square font-bold text-on-dark ${i === 0 ? 'bg-accent' : 'bg-[var(--telesales-blue)]'}`}>{o.badge}</span>
                <div className="title title-xl mt-8">{o.name}</div>
                <div className="text-secondary mb-2">{o.tagline}</div>
                <ul className="text-secondary space-y-1 mb-3">
                  {o.benefits.map((b) => (
                    <li key={b}>✓ {b}</li>
                  ))}
                </ul>
                {o.personalised && <div className="text-accent font-semibold text-[length:var(--fs-caption)] mb-3">Personalised for This Customer</div>}
                <div className="flex gap-2">
                  <HeaderButton>View Details</HeaderButton>
                  <HeaderButton primary>Add to Cart</HeaderButton>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Other Eligible Offers" icon={ICON.check} link="View All Offers">
          {other.map((o) => row(o.name, o.sub, iconFor(o.icon), <Pill tone="green">Eligible</Pill>))}
        </Card>
      </div>
      <div className="contents">
        <Card title="Eligible Discounts" icon={ICON.star} link="View All">
          {discounts.map((d) => row(d.name, d.sub, ICON.check, <Pill tone="green">Eligible</Pill>))}
        </Card>
        <Card title="Additional Opportunities" icon={ICON.grid}>
          {opps.map((o) => row(o.name, o.sub, ICON.star, <Pill tone={o.status === 'Targeted' ? 'amber' : 'green'}>{o.status}</Pill>))}
        </Card>
      </div>
      <WideBlock className="space-y-4">
        <TableCard
          title="Cross-Sell Opportunities"
          icon={ICON.grid}
          link="View All"
          rows={cross}
          cols={[
            { header: 'Service Type', render: (x) => str(x.service) },
            { header: 'Offer', render: (x) => <b>{str(x.offer)}</b> },
            { header: 'Benefit', render: (x) => str(x.benefit) },
            { header: 'Eligibility', render: (x) => <Pill tone="green">{str(x.eligibility)}</Pill> },
            { header: 'Action', render: () => <span className="text-link font-semibold">View Offer</span> },
          ]}
        />
        <TableCard
          title="Sales Enhancement Offers"
          icon={ICON.star}
          link="View All"
          rows={sales}
          cols={[
            { header: 'Offer', render: (x) => <b>{str(x.offer)}</b> },
            { header: 'Type', render: (x) => str(x.type) },
            { header: 'Valid Till', render: (x) => dateTime(x.validTill).d },
            { header: 'Status', render: (x) => <Pill tone="green">{str(x.status)}</Pill> },
            { header: 'Action', render: () => <span className="text-link font-semibold">View</span> },
          ]}
        />
        <TableCard
          title="Offer History"
          icon={ICON.refresh}
          link="View All"
          rows={history}
          cols={[
            { header: 'Date', render: (x) => dateTime(x.at).d },
            { header: 'Offer / Campaign', render: (x) => <b>{str(x.offer)}</b> },
            { header: 'Status', render: (x) => <Pill tone={pillFor(str(x.status))}>{str(x.status)}</Pill> },
            { header: 'Channel', render: (x) => str(x.channel) },
          ]}
        />
      </WideBlock>
    </>
  );
}

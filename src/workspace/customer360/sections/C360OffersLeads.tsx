import { Button } from '../../../components/primitives/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { ActionButton, GridTable, IC, IconTile, KpiGrid, KpiTile, Panel, Pill, StatusPill, TabPage, fmtDate, qar, type GridCol, type Tone } from './C360Kit';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';

type Rec = Record<string, unknown>;
const arr = (v: unknown): Rec[] => (Array.isArray(v) ? (v as Rec[]) : []);
const DASH = '-';
const PAGE = 5;

interface OfferRow {
  key: string;
  name: string;
  badge?: string;
  type?: string;
  eligibility?: string;
  validity?: string;
  detail?: string;
}

const CLOSED = /closed|won|lost|converted|rejected|cancel/i;

const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

function InertView() {
  return (
    <Button variant="secondary" compact disabled>
      View
    </Button>
  );
}

function SectionLink({ children, onClick }: { children: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <Button variant="tertiary" type="button" onClick={onClick} className="whitespace-nowrap">
      {children} &rarr;
    </Button>
  );
}

export function C360OffersLeads({ data }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const navigate = useNavigate();
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [openOffer, setOpenOffer] = useState<string>();
  const [showNbo, setShowNbo] = useState(false);

  const catalog = (data.demoCatalog[0] ?? {}) as Rec;
  const realOffers = data.crossSalesOffers as Rec[];
  const usingCatalog = realOffers.length === 0;

  // Offers: the customer's own targeted offers when there are any, otherwise the app's offer catalogue.
  const offers: OfferRow[] = usingCatalog
    ? [
        ...arr(catalog.nextBestOffers).map((o, i) => ({ key: `nbo-${i}`, name: str(o.name) ?? DASH, badge: str(o.badge) === 'Popular' ? 'Most popular' : str(o.badge), type: undefined, eligibility: 'Eligible', detail: [str(o.tagline), ...((o.benefits as string[] | undefined) ?? [])].filter(Boolean).join(' · ') })),
        ...arr(catalog.otherEligible).map((o, i) => ({ key: `oe-${i}`, name: str(o.name) ?? DASH, type: undefined, eligibility: 'Eligible', detail: str(o.sub) })),
        ...arr(catalog.crossSell).map((o, i) => ({ key: `cs-${i}`, name: str(o.offer) ?? DASH, type: str(o.service), eligibility: str(o.eligibility), detail: str(o.benefit) })),
        ...arr(catalog.salesEnhancement).map((o, i) => ({ key: `se-${i}`, name: str(o.offer) ?? DASH, type: str(o.type), eligibility: str(o.status), validity: str(o.validTill), detail: undefined })),
      ]
    : realOffers.map((o) => ({ key: String(o.offerId), name: str(o.offerName) ?? DASH, type: str(o.offerType), eligibility: str(o.status), detail: str(o.offerDescription) }));

  // Next best offer: highest-priority targeted offer, else the catalogue's recommended one.
  const topReal = [...realOffers].sort((a, b) => String(a.priorityCode ?? '').localeCompare(String(b.priorityCode ?? '')))[0];
  const topCat = arr(catalog.nextBestOffers)[0];
  const nbo = topReal
    ? { name: str(topReal.offerName) ?? DASH, tagline: str(topReal.offerDescription), benefits: [] as string[], price: topReal.monthlyRental, status: str(topReal.status), badge: 'Recommended', extra: [str(topReal.campaignCode) && `Campaign ${String(topReal.campaignCode)}`, str(topReal.channel) && `Channel ${String(topReal.channel)}`].filter(Boolean).join(' · ') }
    : topCat
      ? { name: str(topCat.name) ?? DASH, tagline: str(topCat.tagline), benefits: (topCat.benefits as string[] | undefined) ?? [], price: undefined as unknown, status: 'Eligible', badge: str(topCat.badge) ?? 'Recommended', extra: undefined }
      : undefined;

  const discounts = (data.addonsDiscounts as Rec[]).filter((a) => a.category === 'Discount');
  const discountCount = discounts.length > 0 ? discounts.length : arr(catalog.eligibleDiscounts).length;
  const crossSellCount = usingCatalog ? arr(catalog.crossSell).length : realOffers.filter((o) => /cross/i.test(String(o.offerType))).length;

  const leads = data.leads as Rec[];
  const activeLeads = leads.filter((l) => !CLOSED.test(String(l.status ?? '')));
  const historyLeads = leads.filter((l) => CLOSED.test(String(l.status ?? '')));

  // Eligibility list
  const doi = data.deviceInstallments[0] as Rec | undefined;
  const opp = (name: string) => str(arr(catalog.additionalOpportunities).find((o) => String(o.name).toLowerCase().includes(name))?.status);
  const loyalty = discounts.some((d) => /loyalty/i.test(String(d.addonType))) || /loyalty/i.test(String(data.overviewExtras[0]?.eligibleDiscount ?? '')) || arr(catalog.eligibleDiscounts).some((d) => /loyalty/i.test(String(d.name)));
  const eligibility: { label: string; icon: string; tone: Tone; status?: string }[] = [
    { label: 'DOI Eligibility', icon: IC.building, tone: 'amber', status: str(doi?.eligibilityListMembership) },
    { label: '2 Months Free (GigaHome)', icon: IC.users, tone: 'red', status: undefined },
    { label: 'AutoBase Eligibility', icon: IC.target, tone: 'red', status: opp('autobase') },
    { label: 'Handset Upgrade', icon: IC.mobile, tone: 'blue', status: str(doi?.status) },
    { label: 'Loyalty Discount', icon: IC.tag, tone: 'purple', status: loyalty ? 'Eligible' : undefined },
    { label: 'Special Customer Offer', icon: IC.gift, tone: 'amber', status: opp('happy') },
  ];

  const shownOffers = showAllOffers ? offers : offers.slice(0, PAGE);
  const selectedOffer = offers.find((o) => o.key === openOffer);

  const offerCols: GridCol<OfferRow>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    {
      key: 'name',
      header: 'Offer Name',
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium break-words">{r.name}</div>
          {r.badge && <Pill tone="purple">{r.badge}</Pill>}
        </div>
      ),
    },
    { key: 'type', header: 'Offer Type', render: (r) => r.type ?? DASH },
    { key: 'elig', header: 'Eligibility', render: (r) => (r.eligibility ? <StatusPill status={r.eligibility} /> : DASH) },
    { key: 'valid', header: 'Validity', render: (r) => fmtDate(r.validity) ?? <Dv k="offerValidity" /> },
    { key: 'act', header: 'Actions', render: (r) => <Button variant="secondary" compact onClick={() => setOpenOffer(openOffer === r.key ? undefined : r.key)}>{openOffer === r.key ? 'Hide' : 'View'}</Button> },
  ];

  const leadCols: GridCol<Rec>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    { key: 'id', header: 'Lead ID', render: (r) => str(r.leadId) ?? DASH },
    { key: 'type', header: 'Lead Type', render: (r) => str(r.serviceNeeded) ?? DASH },
    { key: 'msisdn', header: 'MSISDN', render: (r) => str(r.mobileNumber) ?? DASH },
    { key: 'status', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : DASH) },
    { key: 'by', header: 'Created By', render: (r) => str(r.ownerId) ?? DASH },
    { key: 'on', header: 'Created On', render: () => <Dv k="leadCreatedOn" /> },
    { key: 'act', header: 'Actions', render: () => <InertView /> },
  ];

  const historyCols: GridCol<Rec>[] = [
    { key: '#', header: '#', render: (_r, i) => i + 1 },
    { key: 'id', header: 'Lead ID', render: (r) => str(r.leadId) ?? DASH },
    { key: 'type', header: 'Lead Type', render: (r) => str(r.serviceNeeded) ?? DASH },
    { key: 'status', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : DASH) },
    { key: 'closed', header: 'Closed On', render: () => <Dv k="leadClosedOn" /> },
  ];

  return (
    <TabPage
      icon={IC.tag}
      tone="blue"
      title="Offers & Leads"
      subtitle="View eligible offers, next best offers, existing leads and cross-sell opportunities"
      actions={
        <>
          <ActionButton primary icon={IC.plus} onClick={() => navigate('/sales')}>
            Create Lead
          </ActionButton>
        </>
      }
    >
      <KpiGrid>
        <KpiTile icon={IC.gift} tone="purple" label="Eligible Offers" value={offers.length} link="View all" onLink={() => jump('c360-all-offers')} />
        <KpiTile
          icon={IC.star}
          tone="amber"
          label="Next Best Offer"
          value={
            <span className="flex items-center justify-between gap-2">
              {nbo ? 1 : 0}
              {nbo && <Pill solid>Recommended</Pill>}
            </span>
          }
          link={nbo ? 'View details' : undefined}
          onLink={() => {
            setShowNbo(true);
            jump('c360-nbo');
          }}
        />
        <KpiTile icon={IC.tag} tone="green" label="Eligible Discounts" value={discountCount} link="View all" onLink={() => jump('c360-eligibility')} />
        <KpiTile icon={IC.target} tone="red" label="Cross-Sell Opportunities" value={crossSellCount} link="View all" onLink={() => jump('c360-all-offers')} />
        <KpiTile icon={IC.users} tone="purple" label="Active Leads" value={activeLeads.length} link="View all" onLink={() => jump('c360-leads')} />
      </KpiGrid>

      <div className="grid grid-cols-1 @6xl:grid-cols-12 gap-4 items-start">
        <div id="c360-nbo" className="@6xl:col-span-4 min-w-0">
          <Panel icon={IC.star} title="Next Best Offer" action={nbo ? <Pill solid>{nbo.badge}</Pill> : undefined}>
            {nbo ? (
              <div className="space-y-4">
                <div className="flex gap-4 min-w-0">
                  <span className="w-24 h-24 rounded-[var(--radius-card)] bg-surface flex items-center justify-center shrink-0 text-accent">
                    <Icon path={IC.gift} className="w-10 h-10" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-fg font-bold text-[length:var(--fs-h5)] break-words">{nbo.name}</div>
                    <div className="text-fg-2 text-[length:var(--fs-body)] break-words">{nbo.tagline ?? DASH}</div>
                    {nbo.status && (
                      <div className="mt-2">
                        <StatusPill status={nbo.status} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  {nbo.benefits.length > 0 ? (
                    <ul className="space-y-1.5 min-w-0">
                      {nbo.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-fg text-[length:var(--fs-body)]">
                          <span className="text-success shrink-0">
                            <Icon path={IC.checkCircle} className="w-4 h-4" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-[length:var(--fs-body)]">Benefits: <Dv k="offerBenefits" row={{ name: nbo.name }} /></p>
                  )}
                  <div className="text-right shrink-0 text-fg-2 text-[length:var(--fs-body)]">
                    <span className="text-fg font-bold">{qar(nbo.price) ?? DASH}</span>
                    {nbo.price !== undefined && ' / month'}
                  </div>
                </div>
                {showNbo && nbo.extra && <p className="text-fg-2 text-[length:var(--fs-caption)] break-words">{nbo.extra}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" compact onClick={() => setShowNbo((v) => !v)}>
                    {showNbo ? 'Hide Details' : 'View Details'}
                  </Button>
                  <ActionButton primary disabled>
                    Add to Basket
                  </ActionButton>
                </div>
              </div>
            ) : (
              <p className="text-muted text-[length:var(--fs-body)] py-4 text-center">No next best offer on file.</p>
            )}
          </Panel>
        </div>

        <div id="c360-all-offers" className="@6xl:col-span-8 min-w-0">
          <Panel
            icon={IC.gift}
            title="All Offers"
            flush
            action={offers.length > PAGE ? <span className="pr-4"><SectionLink onClick={() => setShowAllOffers((v) => !v)}>{showAllOffers ? 'Show fewer' : 'View All'}</SectionLink></span> : undefined}
          >
            <GridTable cols={offerCols} rows={shownOffers} rowKey={(r) => r.key} selectedKey={openOffer} empty="No offers on file." />
            {selectedOffer && (
              <div className="m-4 rounded-[var(--radius-button)] bg-surface p-3 text-[length:var(--fs-body)] break-words">
                <div className="text-fg font-medium">{selectedOffer.name}</div>
                <div className="text-fg-2">{selectedOffer.detail ?? 'No further detail on file.'}</div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      <div>
        <div id="c360-leads" className="min-w-0">
          <Panel icon={IC.users} title={`Active Leads (${activeLeads.length})`} flush>
            <GridTable cols={leadCols} rows={activeLeads} rowKey={(r) => String(r.leadId)} empty="No active leads." />
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-4 items-stretch">
        <div id="c360-eligibility" className="min-w-0">
          <Panel icon={IC.target} title="Your Eligibility">
            <ul>
              {eligibility.map((e) => (
                <li key={e.label} className="flex items-center gap-3 py-2.5 border-b border-border-soft last:border-0">
                  <IconTile icon={e.icon} tone={e.tone} size="sm" />
                  <span className="flex-1 min-w-0 text-fg text-[length:var(--fs-body)] break-words">{e.label}</span>
                  {e.status ? <StatusPill status={e.status} /> : <span className="text-fg-2">{DASH}</span>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel icon={IC.clock} title="Lead History" flush>
          <GridTable cols={historyCols} rows={historyLeads} rowKey={(r) => String(r.leadId)} empty="No lead history." />
        </Panel>
      </div>
    </TabPage>
  );
}

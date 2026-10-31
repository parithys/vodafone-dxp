import { useMemo, useState } from 'react';
import { overallCreditLimitOf } from '../creditLimitView';
import type { ReactNode } from 'react';
import { useCanStartNewConnection, useStartNewConnection } from '../useStartNewConnection';
import { RevealValue, useFieldAccess } from '../fieldAccess';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { isActiveService } from '../../../engines/customerServicesEngine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { buildAssetsFieldResolver } from './assetsResolvers';
import { ActionButton, FilterSelect, fmtDate, fmtDateTime, GridTable, IC, IconTile, KpiTile, Panel, PrimaryTag, qar, SearchBox, StatusPill, TabPage } from './C360Kit';
import type { GridCol, Tone } from './C360Kit';
import { ServiceActionsMenu } from '../CustomerActionsMenu';
import { Dv } from '../demoValues';
import { ConnectionTypeTag } from '../../../components/primitives/ConnectionTypeTag';
import { connectionTag } from '../../../lib/connectionType';
import { str, num } from '../../../lib/values';

const dash = (v: ReactNode | undefined | null): ReactNode => (v === undefined || v === null || v === '' ? '-' : v);

type Row = Record<string, unknown>;

/** Table / panel label for a service's type. */
function typeLabel(s: CustomerService): string {
  switch (s.category) {
    case 'Prepaid':
    case 'Postpaid':
      return 'Mobile';
    case 'GigaHome Fibre':
    case 'GigaHome 5G':
      return 'GigaHome';
    case 'TV / Entertainment':
      return 'TV';
    case 'Fixed Line':
      return 'Fixed Line';
    default:
      return 'IoT';
  }
}

const TYPE_TILES: { label: string; icon: string; tone: Tone }[] = [
  { label: 'Mobile', icon: IC.mobile, tone: 'red' },
  { label: 'Fixed Line', icon: IC.bars, tone: 'purple' },
  { label: 'TV', icon: IC.tv, tone: 'amber' },
  { label: 'GigaHome', icon: IC.wifi, tone: 'blue' },
  { label: 'IoT', icon: IC.cpu, tone: 'grey' },
];

const normStatus = (v: string | undefined): string | undefined => (v === undefined ? undefined : /^active/i.test(v) ? 'Active' : v);

function Field({ label, value }: { label: string; value: ReactNode | undefined | null }) {
  const mode = useFieldAccess()(label);
  if (mode === 'hidden') return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
      <dt className="text-fg shrink-0">{label}</dt>
      <dd className="text-fg font-medium min-w-0 break-words text-right">{mode === 'drill-down' ? <RevealValue>{dash(value)}</RevealValue> : dash(value)}</dd>
    </div>
  );
}

/**
 * Customer 360 "Products & Services" tab: KPI strip, searchable service table, the selected service's
 * detail panel and the per-service sub-tabs. Everything is bound to Customer360Data; a missing value shows "-".
 */
export function C360ProductsServices({ data, services }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void }) {
  const startNewConnection = useStartNewConnection(data.customer.customerId);
  const canStartNewConnection = useCanStartNewConnection();
  const [query, setQuery] = useState('');
  // Set by clicking a Service Types tile; the list shows only that type until the tile is clicked again.
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedRef, setSelectedRef] = useState<string | undefined>(services[0]?.ref);
  const [panelOpen, setPanelOpen] = useState(true);

  const account = data.accounts[0];
  const creditLimit = data.creditLimits[0];
  const billLimit = qar(overallCreditLimitOf(data) ?? num(creditLimit?.creditLimitQar ?? creditLimit?.creditLimitQAR));
  const balance = data.inPlatformBalances[0];
  const barringStatus = (account as unknown as { barringStatus?: string; barringType?: string } | undefined)?.barringStatus;
  const barringType = (account as unknown as { barringType?: string } | undefined)?.barringType;

  const info = useMemo(() => {
    const out = new Map<string, { asset?: Row; status?: string; plan?: string; addons: Row[]; discounts: Row[]; primary: boolean; simSerial?: string }>();
    for (const s of services) {
      const r = buildAssetsFieldResolver(s, data);
      const asset = data.installedAssets.find((ia) => ia.serviceId === s.ref || ia.installedAssetId === s.ref);
      const planId = asset ? data.assetPlanIds[String(asset.installedAssetId)] : undefined;
      const matched = planId ? data.addonsDiscounts.filter((ad) => ad.planId === planId) : [];
      out.set(s.ref, {
        asset,
        status: normStatus(str(s.tab === 'mobile' ? r('MSISDN Status (Active, Suspended, Barred)') : (asset?.status ?? s.status))),
        plan: str(r('Plan Name')),
        addons: matched.filter((a) => a.category !== 'Discount'),
        discounts: matched.filter((a) => a.category === 'Discount'),
        primary: s.identifier === data.customer.phone,
        simSerial: str(r('Sim serial')),
      });
    }
    return out;
  }, [services, data]);

  const get = (s: CustomerService) => info.get(s.ref)!;
  const isMobile = (s: CustomerService) => s.tab === 'mobile';

  const active = services.filter(isActiveService).length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = services.filter((s) => {
      const i = info.get(s.ref)!;
      if (typeFilter && typeLabel(s) !== typeFilter) return false;
      return !q || [s.identifier, s.label, i.plan, typeLabel(s)].some((v) => v?.toLowerCase().includes(q));
    });
    // The customer's own (primary) number always leads; the rest follow in number order.
    return [...list].sort((a, b) => Number(Boolean(info.get(b.ref)?.primary)) - Number(Boolean(info.get(a.ref)?.primary)) || a.identifier.localeCompare(b.identifier, undefined, { numeric: true }));
  }, [services, info, query, typeFilter]);

  const selected = services.find((s) => s.ref === selectedRef);
  const sel = selected ? get(selected) : undefined;
  const select = (s: CustomerService) => {
    setSelectedRef(s.ref);
    setPanelOpen(true);
  };
  // The per-service figures shown in the selected-service panel (they used to be columns of the All Services table).
  const balanceCell = (s: CustomerService) =>
    get(s).primary && isMobile(s) ? (qar(num(balance?.mainBalanceQAR)) ?? '-') : <Dv k="serviceBalance" row={{ category: s.category }} />;

  const columns: GridCol<CustomerService>[] = [
    {
      key: 'msisdn',
      header: 'MSISDN / Service ID',
      strong: true,
      render: (s) => (
        <div className="min-w-0">
          <div className="font-semibold break-words">{s.identifier}</div>
          <div className="flex flex-wrap items-center gap-1.5">
            <ConnectionTypeTag category={s.category} />
            {get(s).primary && <PrimaryTag />}
          </div>
        </div>
      ),
    },
  ];

  // Sub-tab bodies
  const relatedOrders = selected ? data.orders.filter((o) => o.msisdn === selected.ref || (sel?.asset && o.orderId === sel.asset.orderNumber)) : [];
  const dateCell = (v: unknown) => dash(fmtDate(v));

  const penaltiesTable = (
    <GridTable
      rows={data.penalties as Row[]}
      rowKey={(r) => String(r.penaltyId)}
      empty="No lock-in or penalty records for this customer."
      cols={[
        { key: 'type', header: 'Action', render: (r) => <span className="capitalize">{dash(str(r.actionType))}</span> },
        { key: 'amt', header: 'Amount', render: (r) => dash(num(r.calculatedValue) !== undefined ? `${String(r.currency ?? 'QAR')} ${String(r.calculatedValue)}` : undefined) },
        { key: 'status', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : '-') },
        { key: 'at', header: 'Calculated', render: (r) => dash(fmtDateTime(r.calculatedAt).date) },
        { key: 'src', header: 'Source', render: (r) => dash(str(r.calculationSource)) },
      ]}
    />
  );

  const relatedOrdersTable = (
    <GridTable
      rows={relatedOrders as Row[]}
      rowKey={(r) => String(r.orderId)}
      empty="No orders linked to this service."
      cols={[
        { key: 'id', header: 'Order', render: (r) => dash(str(r.orderId)) },
        { key: 'type', header: 'Type', render: (r) => dash(str(r.orderType)) },
        { key: 'st', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : '-') },
        { key: 'at', header: 'Created', render: (r) => dateCell(r.createdAt) },
        { key: 'tot', header: 'Total', render: (r) => dash(qar(num(r.totalQAR))) },
      ]}
    />
  );
  const ticketsTable = (
    <GridTable
      rows={data.tickets as Row[]}
      rowKey={(r) => String(r.ticketId)}
      empty="No tickets for this customer."
      cols={[
        { key: 'id', header: 'Ticket', render: (r) => dash(str(r.ticketId)) },
        { key: 'cat', header: 'Category', render: (r) => dash(str(r.category)) },
        { key: 'st', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : '-') },
        { key: 'pr', header: 'Priority', render: (r) => dash(str(r.priority)) },
        { key: 'at', header: 'Created', render: (r) => dateCell(r.createdAt) },
      ]}
    />
  );

  const planType = selected && isMobile(selected) ? selected.category : undefined;
  const mobileSel = selected ? isMobile(selected) : false;
  const isPostpaidLine = selected?.category === 'Postpaid';
  const isPrepaidLine = selected?.category === 'Prepaid';
  // A discount the customer already holds is locked (read-only). Discounts with isLockedReadOnly false are only what the plan offers, so they are not shown as pending.
  const activeDiscount = sel?.discounts.find((d) => d.isLockedReadOnly !== false);
  const discountText = (d: Row) => `${String(d.name)}${num(d.durationMonths) !== undefined ? ` (${String(d.durationMonths)} months)` : ''}`;
  const discountExpiry = (d: Row | undefined) => {
    const from = sel?.asset?.effectiveFrom ? new Date(String(sel.asset.effectiveFrom)) : undefined;
    const months = d ? num(d.durationMonths) : undefined;
    if (!from || Number.isNaN(from.getTime()) || months === undefined) return undefined;
    from.setMonth(from.getMonth() + months);
    return fmtDate(from.toISOString().slice(0, 10));
  };
  const digital = data.digitalEngagement[0];
  // Only the customer's own number carries the device instalment (it is held per account, not per line).
  const instalments = isPostpaidLine && sel?.primary ? data.deviceInstallments : [];

  return (
    <TabPage
      icon={IC.box}
      title="Products & Services"
      subtitle="View and manage all customer connections, plans, add-ons, devices and services"
      actions={
        <>
          <ActionButton primary icon={IC.plus} onClick={startNewConnection} disabled={!canStartNewConnection}>
            Add Service
          </ActionButton>
        </>
      }
    >
      {/* One card; its cells are divided by thin lines (same construction as KpiGrid). */}
      <div className="card overflow-hidden">
      <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,3.2fr)] -mr-px -mb-px">
        <KpiTile icon={IC.box} tone="blue" label="Total Connections" value={services.length} />
        <KpiTile icon={IC.shieldCheck} tone="green" label="Active Services" value={active} />
        <section className="@lg:col-span-2 @4xl:col-span-1 p-4 min-w-0 border-r border-b border-border-soft">
          <h3 className="text-fg font-semibold text-[length:var(--fs-body)] mb-2">Service Types</h3>
          <ul className="grid grid-cols-2 @lg:grid-cols-5 gap-3">
            {TYPE_TILES.map((t) => {
              const count = services.filter((s) => typeLabel(s) === t.label).length;
              const on = typeFilter === t.label;
              return (
                <li key={t.label} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    disabled={count === 0}
                    onClick={() => setTypeFilter(on ? null : t.label)}
                    title={on ? `Showing ${t.label} only - click to show all` : `Show ${t.label} services only`}
                    className={`flex w-full items-center gap-2 min-w-0 rounded-[var(--radius-button)] p-1.5 -m-1.5 text-left transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-default ${
                      on ? 'bg-[var(--field-card-selected-bg)] ring-1 ring-inset ring-[var(--field-card-selected)]' : count > 0 ? 'hover:bg-surface' : ''
                    }`}
                  >
                    <IconTile icon={t.icon} tone={t.tone} size="sm" />
                    <div className="min-w-0">
                      <div className="text-fg-2 text-[length:var(--fs-caption)] truncate">{t.label}</div>
                      <div className="text-fg font-bold text-[length:var(--fs-body-lg)] leading-tight">{count}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 items-start ${panelOpen ? '@4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : ''}`}>
        <div className="space-y-4 min-w-0">
          <Panel
            icon={IC.bars}
            title={`All Services (${services.length})`}
            action={
              <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
                <div className="w-56 max-w-full flex">
                  <SearchBox value={query} onChange={setQuery} placeholder="Search by MSISDN, plan or service" />
                </div>
                <div className="w-44 max-w-full">
                  <FilterSelect
                    label="Service Type"
                    value={typeFilter ?? ''}
                    onChange={(v) => setTypeFilter(v || null)}
                    options={[
                      { value: '', label: `All (${services.length})` },
                      ...TYPE_TILES.filter((t) => services.some((s) => typeLabel(s) === t.label)).map((t) => ({
                        value: t.label,
                        label: `${t.label} (${services.filter((s) => typeLabel(s) === t.label).length})`,
                      })),
                    ]}
                  />
                </div>
              </div>
            }
          >
            <GridTable
              cols={columns}
              rows={rows}
              rowKey={(s) => s.ref}
              selectedKey={panelOpen ? selectedRef : undefined}
              onSelect={select}
              empty={services.length === 0 ? 'No connections on file for this customer.' : 'No services match the current search or filters.'}
            />
          </Panel>
        </div>

        {panelOpen && (
        <aside className="@container card p-4 space-y-4 min-w-0">
            {!selected || !sel ? (
              <p className="text-muted text-[length:var(--fs-body)] py-6 text-center">{services.length === 0 ? 'No services to show.' : 'Select a service to see its details.'}</p>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <IconTile icon={mobileSel ? IC.mobile : selected.tab === 'fibre' ? IC.wifi : IC.cpu} tone="red" />
                  <span className="text-fg font-bold text-[length:var(--fs-h5)] break-words min-w-0">{selected.identifier}</span>
                  {sel.status && <StatusPill status={sel.status} />}
                  {sel.primary && (
                    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--field-card-border)] bg-surface px-2.5 py-0.5 text-[length:var(--fs-caption)] text-fg-2">
                      <Icon path={IC.star} className="w-3.5 h-3.5" />
                      Primary MSISDN
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-3">
                    <ServiceActionsMenu
                      customerId={data.customer.customerId}
                      customerName={data.customer.name}
                      service={selected}
                      facts={{
                        kind: mobileSel ? 'mobile' : 'home',
                        category: selected.category,
                        status: sel.status,
                        blacklisted: Boolean(data.customer.blacklisted),
                        barred: mobileSel && Boolean(barringStatus) && barringStatus !== 'Not Barred',
                        hasDeviceInstalment: data.deviceInstallments.some((d) => /approved/i.test(String(d.status ?? ''))),
                      }}
                    />
                    <button type="button" aria-label="Close details" onClick={() => setPanelOpen(false)} className="text-fg-2 hover:text-fg">
                      <Icon path={IC.x} className="w-5 h-5" />
                    </button>
                  </span>
                </div>

                <Panel icon={IC.box} title="Plan Details" className="bg-surface-half">
                  <div className="grid grid-cols-1">
                    <dl className="min-w-0">
                      <Field label="Service Type" value={mobileSel ? `Mobile · ${selected.category}` : connectionTag(selected.category).label} />
                      <Field label="Plan Name" value={sel.plan ?? selected.label} />
                      <Field label="Plan Type" value={planType} />
                      <Field label="Price" value={qar(num(sel.asset?.price))} />
                      <Field label="Current Balance" value={balanceCell(selected)} />
                      {/* Dates run oldest to newest: the customer joined, the number went live, the plan started, the contract ends. */}
                      <Field label="Customer Since" value={<Dv k="customerSince" />} />
                      {isPostpaidLine && <Field label="Postpaid Activation Date" value={fmtDate(sel.asset?.postpaidActivationDate)} />}
                      <Field label={isPostpaidLine ? 'Plan Activation Date' : 'Activation Date'} value={fmtDate(sel.asset?.effectiveFrom) ?? <Dv k="activationDate" />} />
                      <Field label="Contract End Date" value={fmtDate(sel.asset?.effectiveTo) ?? <Dv k="contractEnd" row={{ from: sel.asset?.effectiveFrom }} />} />
                    </dl>
                  </div>
                </Panel>

                <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
                  <Panel icon={IC.settings} title="Service Details">
                    <dl>
                      {mobileSel && <Field label="SIM Serial Number" value={sel.simSerial ?? <Dv k="simSerial" />} />}
                      {mobileSel && <Field label="Barrings" value={barringType ?? (barringStatus === 'Not Barred' ? 'None' : barringStatus)} />}
                      {isPostpaidLine && <Field label="Bill Limit" value={billLimit} />}
                      {isPrepaidLine && <Field label="Last Recharge Amount" value={qar(num(digital?.lastRechargeAmountQar))} />}
                      {isPrepaidLine && <Field label="Last Recharge Type" value={str(digital?.lastRechargeType)} />}
                      <Field label="Active Discount" value={activeDiscount ? discountText(activeDiscount) : <Dv k="discount" />} />
                      {activeDiscount && <Field label="Discount Expiry Date" value={discountExpiry(activeDiscount)} />}
                      {mobileSel && <Field label="Registered Email" value={str(data.customer.email)} />}
                    </dl>
                  </Panel>
                    <Panel
                      icon={IC.gift}
                      title={`Add-ons (${sel.addons.length})`}
                    >
                      {sel.addons.length === 0 ? (
                        <p className="text-muted text-[length:var(--fs-body)]">No add-ons on file.</p>
                      ) : (
                        <ul>
                          {sel.addons.map((a) => (
                            <li key={String(a.addonDiscountId)} className="flex items-center justify-between gap-2 py-1.5 text-[length:var(--fs-body)]">
                              <span className="min-w-0">
                                <span className="block text-fg break-words">{String(a.name)}</span>
                                {str(a.description) && <span className="block text-fg-2 text-[length:var(--fs-caption)] break-words">{String(a.description)}</span>}
                              </span>
                              {sel.status && <StatusPill status={sel.status} />}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Panel>
                </div>

                {instalments.length > 0 && (
                  <Panel icon={IC.cart} title={`Device Instalment (${instalments.length})`}>
                    <GridTable
                      rows={instalments as Row[]}
                      rowKey={(r) => String(r.id)}
                      cols={[
                        { key: 'dev', header: 'Handset', render: (r) => dash(str(r.deviceName)) },
                        { key: 'price', header: 'Price', render: (r) => dash(qar(num(r.devicePriceQar))) },
                        { key: 'mon', header: 'Monthly', render: (r) => dash(qar(num(r.monthlyInstallmentQar))) },
                        { key: 'ten', header: 'Tenure', render: (r) => dash(num(r.installmentMonths) !== undefined ? `${String(r.installmentMonths)} months` : undefined) },
                        { key: 'st', header: 'Status', render: (r) => (str(r.status) ? <StatusPill status={String(r.status)} /> : '-') },
                      ]}
                    />
                  </Panel>
                )}

                <Panel icon={IC.alert} title={`Lock-in & Penalties (${data.penalties.length})`}>
                  {penaltiesTable}
                </Panel>

                <Panel icon={IC.cart} title={`Related Orders (${relatedOrders.length})`}>
                  {relatedOrdersTable}
                </Panel>

                <Panel icon={IC.tag} title={`Customer Tickets (${data.tickets.length})`}>
                  {ticketsTable}
                </Panel>
              </>
            )}
        </aside>
        )}
      </div>
    </TabPage>
  );
}

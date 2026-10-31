import { vipTagOf } from '../../data/customerSegments';
import { EmptyState } from '../../components/primitives/EmptyState';
import { overallCreditLimitOf } from './creditLimitView';
import { useEntityStore } from '../../stores/entityStore';
import { creditRiskPatch, type BigDataCreditRisk, type CreditRiskSource } from '../../engines/creditLimit';
import { isClosedTicket } from '../../lib/statusTone';
import { isSimSwapAwaitingDecision } from '../../engines/approvalAuthority';
import { isBusinessSegment } from '../../engines/businessSegment';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getCustomer360, toActiveCustomerSummary, computeBillingSummary, type AccountRecord, type Customer360Data } from '../../engines/customer360Engine';
import { listCustomerServices, type ServiceSources } from '../../engines/customerServicesEngine';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { usePersonaStore } from '../../stores/personaStore';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { getPersona } from '../../engines/configEngine';
import { buildTelesalesTabs } from './telesales/TelesalesTabs';
import { CustomerActionsMenu } from './CustomerActionsMenu';
import { CustomerProfileHeader, type HeaderAlert } from './CustomerProfileHeader';
import { useRequirementCoverage } from './requirementCoverage';
import { segmentLabelFor } from '../../engines/customerBenefitEngine';
import { LinkedBusinessCard, LinkedBusinessLine } from './LinkedBusinessCard';
import { segmentFor } from '../../engines/businessSegment';
import { FieldAccessProvider } from './fieldAccess';
import { DemoProvider } from './demoValues';
import { canEditCustomerRecords } from '../../engines/agentPrivilegeEngine';
import { isTopicVisible } from '../../engines/customer360VisibilityEngine';
import { useVerificationGate } from '../../components/patterns/VerificationGate';
import { Button } from '../../components/primitives/Button';
import { Tooltip } from '../../components/primitives/Tooltip';
import { IC } from './sections/C360Kit';
import { Tabs, type TabItem } from '../../components/primitives/Tabs';
import { MetricCard } from './MetricCard';
import { BellNotificationBanner } from './BellNotificationBanner';
import { DemographicEditDrawer } from './DemographicEditDrawer';
import { AccountEditDrawer } from './AccountEditDrawer';
import { PrimaryContactDrawer } from './PrimaryContactDrawer';
import { primaryContactOf } from './primaryContactModel';
import { AssetsSection, type AssetsSubView } from './sections/AssetsSection';
import { C360AddressService } from './sections/C360AddressService';
import { C360AccountInformation } from './sections/C360AccountInformation';
import { C360Activities } from './sections/C360Activities';
import { C360AlertsRisks } from './sections/C360AlertsRisks';
import { C360BillingPayments } from './sections/C360BillingPayments';
import { C360ContactIdentity } from './sections/C360ContactIdentity';
import { C360OffersLeads } from './sections/C360OffersLeads';
import { C360Orders } from './sections/C360Orders';
import { C360Overview } from './sections/C360Overview';
import { C360ProductsServices } from './sections/C360ProductsServices';
import { C360TicketsSupport } from './sections/C360TicketsSupport';
import { TopicFieldsSection } from './sections/TopicFieldsSection';
import { accountInformationResolvers, accountInformationRichFields } from './sections/accountInformationResolvers';
import { billingResolvers } from './sections/billingResolvers';
import { BillingSection } from './sections/BillingSection';
import { contactInformationResolvers, contactInformationRichFields } from './sections/contactInformationResolvers';
import { accountAddressResolvers } from './sections/accountAddressResolvers';
import { blacklistResolvers } from './sections/blacklistResolvers';
import { contactAssetsResolvers } from './sections/contactAssetsResolvers';
import { leadResolvers } from './sections/leadResolvers';
import { AlertsRisksSection } from './sections/AlertsRisksSection';
import { AuditTrailSection } from './sections/AuditTrailSection';
import { AddressSection } from './sections/AddressSection';
import { ContactSection } from './sections/ContactSection';
import { DevicePenaltyPolicy, StarNumberPenaltyPolicy } from './sections/penaltyViewResolvers';
import { EntityMissing } from '../../components/patterns/EntityMissing';
import { formatQarAny, formatAmountAny } from '../../lib/format';

// Deep links from elsewhere in the app (queue notification, toasts, the
// Linked Services panel) only ever name one of these three ServiceTab
// values - see AssetsSection's own note on why 'assets' lands on Overview.
const SERVICE_TABS = new Set<string>(['mobile', 'fibre', 'assets']);
function toAssetsSubView(tab: string | undefined): AssetsSubView {
  return tab === 'mobile' || tab === 'fibre' ? tab : 'overview';
}

// The central workspace the whole redesign pivots around: one customer, one
// page, every product/action reachable in at most two more clicks (product
// tab -> action group -> action). Reachable either from Customer Search
// (which already set the active-customer bridge) or a direct URL/bookmark -
// re-sets the bridge here too so a direct link still pre-fills downstream
// wizards correctly.

// Icons for the Retail icon rail, by tab key.
const RAIL_ICONS: Record<string, string> = {
  overview: IC.bars,
  'account-info': IC.user,
  'products-services': IC.box,
  billing: IC.wallet,
  'offers-leads': IC.tag,
  'contact-identity': IC.users,
  orders: IC.cart,
  'tickets-support': IC.headset,
  activities: IC.activity,
  'alerts-risks': IC.alert,
  'address-service': IC.pin,
};

export function Customer360Layout() {
  const { customerId } = useParams<{ customerId: string }>();
  const setActiveCustomer = useCustomerContext((s) => s.setActiveCustomer);
  const clearActiveCustomer = useCustomerContext((s) => s.clearActiveCustomer);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const [data, setData] = useState<Customer360Data | undefined | null>(null);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [primaryContactOpen, setPrimaryContactOpen] = useState(false);

  // Deep link from a service link elsewhere in the app - currently the queue
  // notification's Active lines breakdown. `tab` picks the tab, `serviceRef`
  // names which service that tab should load.
  //
  // Seeded as the initial state AND re-applied per navigation, because
  // neither alone is enough:
  //
  //   - Initial state alone breaks the common case. The links live in the
  //     queue notification, which usually sits on top of the very record it
  //     links into, so the target path is the path already open. React Router
  //     does not remount for that, useState keeps its first value, and the tab
  //     never moved. This was the actual observed failure.
  //   - An effect alone flashes Profile for a frame before switching.
  //
  // Keyed on location.key, which React Router changes once per navigation.
  // That is what keeps this from fighting the agent: clicking a tab by hand
  // does not change the key, so the effect does not re-run and drag them back
  // to the linked tab.
  //
  // Location state rather than a URL segment, matching how nav-origin context
  // already travels in this app (see resolveActiveNavPath). The consequence is
  // deliberate: it survives history navigation but is dropped on reload, so a
  // reloaded page falls back to Profile with nothing selected rather than to a
  // half-restored selection.
  const location = useLocation();
  const linked = (location.state ?? {}) as { tab?: string; serviceRef?: string; newTicket?: boolean };
  const [activeTab, setActiveTab] = useState(linked.tab && SERVICE_TABS.has(linked.tab) ? 'assets' : '');
  const [assetsSubView, setAssetsSubView] = useState<AssetsSubView>(toAssetsSubView(linked.tab));
  const [selectedServiceRef, setSelectedServiceRef] = useState(linked.serviceRef);
  // "New Ticket" from anywhere starts the Overview's "How can we help today?" search: each bump moves focus to it.
  const [queryFocus, setQueryFocus] = useState(linked.newTicket ? 1 : 0);
  useEffect(() => {
    if (!linked.newTicket) return;
    setActiveTab('overview');
    setQueryFocus((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (!linked.tab || !SERVICE_TABS.has(linked.tab)) return;
    setActiveTab('assets');
    setAssetsSubView(toAssetsSubView(linked.tab));
    setSelectedServiceRef(linked.serviceRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Service sources Customer360Data does not carry. Loaded here rather than
  // folded into getCustomer360 so that aggregation keeps its existing shape -
  // these four feed the service inventory only.
  const [serviceSources, setServiceSources] = useState<ServiceSources | undefined>(undefined);
  const [loadFailed, setLoadFailed] = useState(false);
  // The loaded customer is in a protected segment this role may not see: the page shows the restriction and nothing about the customer.
  const [blocked, setBlocked] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      mockDataEngine.list<AccountRecord>('accounts'),
      mockDataEngine.list<Record<string, unknown>>('installed-assets'),
      mockDataEngine.list<Record<string, unknown>>('gigahome-osntv-subscriptions'),
      mockDataEngine.list<Record<string, unknown>>('iptv-stb-bundles'),
      mockDataEngine.list<Record<string, unknown>>('smart-devices'),
    ])
      .then(([accounts, installedAssets, gigahome, iptvBundles, smartDevices]) => {
        if (cancelled) return;
        setServiceSources({ accounts, installedAssets, gigahome, iptvBundles, smartDevices });
      })
      .catch((err) => {
        // The page still works without the service inventory; say so in the console rather than leave a rejection unhandled.
        console.error('[Customer360] service sources failed to load:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!customerId) return;
    setData(null);
    setBlocked(false);
    setLoadFailed(false);
    // Cancelled when the customer changes (or the screen unmounts) so a slow earlier response cannot overwrite the
    // customer now on screen; a failed load shows the not-found state rather than "Loading" forever.
    let cancelled = false;
    getCustomer360(customerId)
      .then(async (result) => {
        if (cancelled) return;
        // Authorisation comes BEFORE anything is kept or drawn: a customer in a protected segment the signed-in role may not see is dropped here -
        // never put in state, never in the active-customer context - and the page shows the access restriction in place of the customer.
        if (result && !canViewCustomerSegment(activePersonaId, result.customer.segment)) {
          setBlocked(true);
          clearActiveCustomer();
          return;
        }
        // Big Data's input updates the customer's Credit Risk: written to their record when it differs, and shown as it now is.
        if (result) {
          const patch = creditRiskPatch(result.customer as CreditRiskSource & { customerId?: string }, await mockDataEngine.list<BigDataCreditRisk>('big-data-credit-risk'));
          if (cancelled) return;
          if (patch) {
            void useEntityStore.getState().updateRecord('customers', 'customerId', customerId, patch as Record<string, unknown>, { how: 'Big Data credit risk update', by: 'Big Data' });
            result = { ...result, customer: { ...result.customer, ...patch } };
          }
        }
        setData(result ?? undefined);
        if (result) setActiveCustomer(toActiveCustomerSummary(result.customer));
      })
      .catch((err) => {
        console.error('[Customer360] load failed:', err);
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [customerId, setActiveCustomer, clearActiveCustomer, activePersonaId, reloadKey]);

  const { requireVerification, gate: verificationGate } = useVerificationGate(
    customerId ?? '',
    data && data !== null ? data.customer.name : 'this customer'
  );
  const canEdit = canEditCustomerRecords(activePersonaId);
  const coverageRoot = useRef<HTMLDivElement>(null);
  useRequirementCoverage(coverageRoot, activePersonaId, activeTab || 'overview', Boolean(data));

  if (blocked) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/customer-search" backLabel="Back to Customer Search" />
      </div>
    );
  }
  if (loadFailed) {
    return <EntityMissing what="customer" loading={false} error onRetry={() => setReloadKey((k) => k + 1)} backTo="/customer-search" backLabel="Back to Customer Search" />;
  }
  if (data === null) {
    return <div className="p-8 text-fg-2" role="status">Loading customer…</div>;
  }
  if (data === undefined) {
    return (
      <EmptyState title="Customer Not Found" message={<>No customer found for “{customerId}”. Try Customer Search instead.</>} />
    );
  }

  const customer = toActiveCustomerSummary(data.customer);
  const { outstanding, latestBill } = computeBillingSummary(data);
  const openTicketCount = data.tickets.filter((t) => !isClosedTicket(t.status)).length;
  const accountStatus = data.customer.blacklisted
    ? 'Blocked'
    : data.accounts.some((a) => a.status === 'Active')
      ? 'Active'
      : (data.accounts[0]?.status ?? '-');

  // BR-04: shared by every ticket-creation path (demographic/contact/address
  // auto-tickets and Tickets tab's own manual "Create Ticket") so the new
  // ticket is immediately reflected here - in the Tickets tab and in the
  // header's Open Tickets count - rather than only after navigating away and
  // back. data.tickets itself stays the single source of truth for both.
  const addTicket = (ticket: Record<string, unknown>) =>
    setData((prev) => (prev ? { ...prev, tickets: [ticket, ...prev.tickets] } : prev));

  // Empty until the sources land, so the tabs render their own empty state
  // for a moment rather than briefly claiming the customer has no services.
  const services = serviceSources ? listCustomerServices(data.customer, serviceSources) : [];

  const onInteractionLogged = (record: Record<string, unknown>) =>
    setData((prev) => (prev ? { ...prev, activities: [record, ...prev.activities] } : prev));

  // Customer 360's 13 approved tab sections - each is one of
  // customer360-fields.json's own `topic` values, rendered field-by-field
  // via TopicFieldsSection against the exact field list
  // customer360VisibilityEngine.ts returns for the active persona (2026-09-29
  // full rebuild - see the rebuild plan for the complete field-by-field
  // provenance). Every tab is gated by isTopicVisible uniformly now,
  // including the 7 broad ones that were previously always-on - confirmed
  // with the user this means EBU Operations (VFQ12348) sees zero tabs, since
  // the source data grants that department no access to any of the 13
  // topics; the empty-tabs case is handled below rather than passed to
  // <Tabs>.
  //
  // Ordered by usage/frequency/importance, derived from that same JSON's
  // per-department real-time vs. drill-down density (2026-09-29 request):
  // broad, everyday topics first (Account Information, Assets, Contact
  // Information, Billing & Payments, Account Address), then topics that are
  // frequently glanced but narrow in scope, then the situational/compliance
  // topics that are only opened when directly relevant, with EBU last since
  // it touches only 2 of 11 departments and is real-time for none of them.
  // Persona-specific layout (personas.json `customer360Layout`): the Telesales gets task-shaped
  // tabs over the same field sections; every other persona keeps the standard tabs below.
  const telesales = getPersona(activePersonaId)?.customer360Layout === 'telesales';
  const headerOnly = getPersona(activePersonaId)?.customer360Layout === 'header-only';
  const standardTabs: TabItem[] = [
    ...(isTopicVisible(activePersonaId, 'Account Information')
      ? [
          {
            key: 'account-info',
            label: 'Account Information',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Account Information"
                resolveValue={(details) => accountInformationResolvers[details]?.({ data, services })}
                richFields={accountInformationRichFields({ data, onTicketCreated: addTicket })}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Assets')
      ? [
          {
            key: 'assets',
            label: 'Assets',
            content: (
              <AssetsSection
                customer={customer}
                services={services}
                servicesLoaded={serviceSources !== undefined}
                selectedServiceRef={selectedServiceRef}
                initialSubView={assetsSubView}
                data={data}
                personaId={activePersonaId}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Contact Information')
      ? [
          {
            key: 'contact-info',
            label: 'Contact Information',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Contact Information"
                resolveValue={(details) => contactInformationResolvers[details]?.({ data, services })}
                richFields={{
                  ...contactInformationRichFields({ data }),
                  // The full editable contacts table/drawer, anchored on the
                  // one field it most directly answers - re-anchored, not
                  // removed, from the pre-rebuild Contact Information tab.
                  'First Name & Last Name (Full Name)': <ContactSection data={data} onTicketCreated={addTicket} />,
                }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Billing & Payments')
      ? [
          {
            key: 'billing',
            label: 'Billing & Payments',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Billing & Payments"
                resolveValue={(details) => billingResolvers[details]?.(data)}
                // The full bill/payment/adjustment/deposit history tables and
                // invoice download action, anchored on Latest Bill - re-anchored,
                // not removed, from the pre-rebuild Billing & Payments tab.
                richFields={{ 'Latest Bill': <BillingSection data={data} /> }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Account Address')
      ? [
          {
            key: 'account-address',
            label: 'Account Address',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Account Address"
                resolveValue={(details) => accountAddressResolvers[details]?.(data)}
                // The full editable address table/drawer, anchored on Zone -
                // re-anchored, not removed, from the pre-rebuild tab.
                richFields={{ Zone: <AddressSection data={data} onTicketCreated={addTicket} /> }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Alerts & Risks')
      ? [
          {
            key: 'alerts-risks',
            label: 'Alert & Risks',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Alerts & Risks"
                richFields={{ 'Bell Icon/Bulk Notes': <AlertsRisksSection data={data} /> }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Contact/Assets Information')
      ? [
          {
            key: 'contact-assets-info',
            label: 'Contact/Assets Information',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Contact/Assets Information"
                resolveValue={(details) => contactAssetsResolvers[details]?.(data)}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Blacklist View')
      ? [
          {
            key: 'blacklist',
            label: 'Blacklist View',
            content: <TopicFieldsSection personaId={activePersonaId} topic="Blacklist View" resolveValue={(details) => blacklistResolvers[details]?.(data)} />,
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Account/Contact Lead')
      ? [
          {
            key: 'account-contact-lead',
            label: 'Account/Contact Lead',
            content: <TopicFieldsSection personaId={activePersonaId} topic="Account/Contact Lead" resolveValue={(details) => leadResolvers[details]?.(data)} />,
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Activation/Modification Sidebar')
      ? [
          {
            key: 'activation-modification',
            label: 'Activation/Modification Side Bar',
            content: <TopicFieldsSection personaId={activePersonaId} topic="Activation/Modification Sidebar" />,
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Penalty View')
      ? [
          {
            key: 'penalty-view',
            label: 'Penalty View',
            // Both of the spec's two named fields (Star number Penalty,
            // Device Penalty) have no matching per-customer record - the
            // real commitment-penalties.json dataset only covers
            // disconnection/MNP-port-out/upgrade penalties, a different
            // category. Rather than the honest-but-empty "Not available"
            // default, each renders the actual evidenced lock-in/penalty
            // policy rules (BR-* ids, reference/blueprint/business-rules.md)
            // as a richField, with explicit gap notes for what no source
            // document actually supports (a unified plan table, a
            // per-customer computed amount).
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Penalty View"
                richFields={{
                  'Star number Penalty': <StarNumberPenaltyPolicy />,
                  'Device Penalty (Fiber & 5G)': <DevicePenaltyPolicy />,
                }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'Audit Trail')
      ? [
          {
            key: 'audit-trail',
            label: 'Audit Trail',
            content: (
              <TopicFieldsSection
                personaId={activePersonaId}
                topic="Audit Trail"
                richFields={{
                  'Audit Trail (Orders, Contact, Account, Activity, TT)': (
                    <AuditTrailSection data={data} onTicketCreated={addTicket} onInteractionLogged={onInteractionLogged} />
                  ),
                }}
              />
            ),
          },
        ]
      : []),
    ...(isTopicVisible(activePersonaId, 'EBU')
      ? [{ key: 'ebu', label: 'EBU', content: <TopicFieldsSection personaId={activePersonaId} topic="EBU" /> }]
      : []),
  ];
  // Header-only layout (the Retail module): the eleven agreed tabs. A tab appears only where the persona can see
  // its Customer 360 topic (Customer360 List - FINAL), so e.g. Direct Sales drops Products & Services,
  // Activities and Alerts & Risks.
  const openTab = (key: string) => {
    setActiveTab(key);
    setSelectedServiceRef(undefined);
  };
  const startNewTicket = () => {
    openTab('overview');
    setQueryFocus((n) => n + 1);
  };
  const editContact = canEdit ? () => requireVerification(() => setDemoDrawerOpen(true)) : undefined;
  // Account Details: the customer is verified first (the side drawer), then only Credit Limit, Account Status and Segment can be changed.
  const changePrimaryContact = canEdit ? () => requireVerification(() => setPrimaryContactOpen(true)) : undefined;
  const editAccount = canEdit ? () => requireVerification(() => setAccountDrawerOpen(true)) : undefined;
  const retailTab = (key: string, label: string, topics: string[], content: ReactNode): TabItem[] =>
    topics.some((t) => isTopicVisible(activePersonaId, t))
      ? [{ key, label, icon: RAIL_ICONS[key], content: <FieldAccessProvider personaId={activePersonaId} page={key}>{content}</FieldAccessProvider> }]
      : [];
  const tabProps = { data, services, goToTab: openTab, startNewTicket };
  const tabs: TabItem[] = headerOnly
    ? [
        ...retailTab('overview', 'Overview', ['Account Information'], <C360Overview {...tabProps} onTicketCreated={addTicket} queryFocus={queryFocus} hasTab={(key) => tabs.some((t) => t.key === key)} />),
        ...retailTab('account-info', 'Account Information', ['Account Information'], <C360AccountInformation {...tabProps} onEdit={editAccount} onChangePrimaryContact={changePrimaryContact} />),
        ...retailTab('products-services', 'Products & Services', ['Assets'], <C360ProductsServices {...tabProps} />),
        ...retailTab('billing', 'Billing & Payments', ['Billing & Payments'], <C360BillingPayments {...tabProps} />),
        ...retailTab('offers-leads', 'Offers & Leads', ['Contact/Assets Information', 'Account/Contact Lead'], <C360OffersLeads {...tabProps} />),
        ...retailTab('contact-identity', 'Contact & Identity', ['Contact Information'], <C360ContactIdentity {...tabProps} onEdit={editContact} />),
        ...retailTab('orders', 'Orders', ['Account Information'], <C360Orders {...tabProps} />),
        ...retailTab('tickets-support', 'Tickets & Support', ['Account Information'], <C360TicketsSupport {...tabProps} onTicketCreated={addTicket} />),
        ...retailTab('activities', 'Activities', ['Audit Trail'], <C360Activities {...tabProps} />),
        ...retailTab('alerts-risks', 'Alerts & Risks', ['Alerts & Risks'], <C360AlertsRisks {...tabProps} />),
        ...retailTab('address-service', 'Address & Service', ['Account Address'], <C360AddressService {...tabProps} canEdit={canEdit} requireVerification={requireVerification} onTicketCreated={addTicket} />),
      ]
    : telesales
    ? buildTelesalesTabs({
        personaId: activePersonaId,
        data,
        services,
        customer,
        servicesLoaded: serviceSources !== undefined,
        selectedServiceRef,
        assetsSubView,
        onTicketCreated: addTicket,
        goToTab: (key) => {
          setActiveTab(key);
          setSelectedServiceRef(undefined);
        },
      })
    : standardTabs;

  // The deep-linked / default tab key belongs to the standard layout; map it onto this one.
  const shownTab = tabs.some((t) => t.key === activeTab)
    ? activeTab
    : telesales && activeTab === 'assets'
      ? 'ts-products'
      : (tabs[0]?.key ?? activeTab);

  // Telesales header extras (C360-HDR-01..06). Every value is read from data already on the record and is
  // omitted when absent - nothing is derived or estimated.

  // Alerts & Attention card: customer-level indicators an agent must see first.
  const dunning = data.billingProfiles[0]?.collectionStage as string | undefined;
  const pendingSimSwap = data.simSwapOrders.some((o) => isSimSwapAwaitingDecision(o.status));
  const headerAlerts: HeaderAlert[] = [
    ...(data.customer.blacklisted ? [{ label: 'Blacklisted', tone: 'danger' as const }] : []),
    ...(outstanding > 0 ? [{ label: 'Outstanding Balance', tone: 'danger' as const }] : []),
    ...(dunning && !/^(none|no dunning|current)$/i.test(dunning) ? [{ label: `Dunning: ${dunning}`, tone: 'danger' as const }] : []),
    ...(openTicketCount > 0 ? [{ label: `${openTicketCount} open ticket${openTicketCount === 1 ? '' : 's'}`, tone: 'warning' as const }] : []),
    ...(pendingSimSwap ? [{ label: 'Pending SIM Swap', tone: 'warning' as const }] : []),
  ];

  return (
    <div className={headerOnly ? '' : 'p-8'} ref={coverageRoot}>
      <DemoProvider value={{ data, services }}>
      <FieldAccessProvider personaId={headerOnly ? activePersonaId : undefined} page="header">
        <CustomerProfileHeader
          flush={headerOnly}
          {...(telesales
            ? {
                accountNumber: data.accounts[0]?.accountId ? String(data.accounts[0].accountId) : undefined,
                // The full ID number stays masked until the agent passes the same verification gate that guards
                // profile edits.
                maskId: true,
                onRequestReveal: (reveal: () => void) => requireVerification(reveal),
                pinIdentity: true,
              }
            : {})}
          name={data.customer.name}
          belowFacts={<LinkedBusinessLine customerId={data.customer.customerId} />}
          tags={[
            ...(data.customer.name ? [{ label: 'Primary', variant: 'tag-primary' as const }] : []),
            ...(vipTagOf(data.customer.segment) ? [{ label: vipTagOf(data.customer.segment) as string, variant: 'tag-amber' as const }] : []),
          ]}
          qid={data.customer.qid}
          idType={data.customer.idType}
          blacklisted={Boolean(data.customer.blacklisted)}
          dob={data.customer.dob}
          preferredLanguage={data.customer.preferredLanguage}
          // A reimbursed (CBU) user of a business is shown as B2B2C; a company-paid line leaves the employee's own profile unchanged.
          segment={segmentLabelFor({
            ...data.customer,
            reimbursed: Boolean(data.customer.parentBusinessId && data.customer.billingResponsibility && segmentFor(data.customer.billingResponsibility) === 'CBU'),
            business: isBusinessSegment(data.customer.segment),
          })}
          phone={data.customer.phone}
          email={data.customer.email}
          totalConnections={services.length > 0 ? services.length : undefined}
          creditLimit={data.creditLimits[0] ? `${formatQarAny(String(overallCreditLimitOf(data) ?? data.creditLimits[0].creditLimitQar ?? data.creditLimits[0].creditLimitQAR ?? '-'))}` : undefined}
          alerts={headerAlerts}
          onViewAlerts={tabs.some((t) => t.key === 'alerts-risks') ? () => setActiveTab('alerts-risks') : undefined}
          // Header-only layouts edit the profile from the Contact Information tab, so the header carries no button.
          actions={
            <>
              <CustomerActionsMenu
                customerId={data.customer.customerId}
                customerName={data.customer.name}
                services={serviceSources ? services : undefined}
                onSupport={tabs.some((t) => t.key === 'tickets-support') ? () => setActiveTab('tickets-support') : undefined}
              />
              {headerOnly ? null : canEdit ? (
                <Button variant="primary" compact onClick={() => requireVerification(() => setDemoDrawerOpen(true))}>
                  Edit profile
                </Button>
              ) : (
                <Tooltip content="Not authorised to edit customer records" placement="bottom">
                  <Button variant="primary" compact className="opacity-40 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                    Edit profile
                  </Button>
                </Tooltip>
              )}
            </>
          }
        />
      </FieldAccessProvider>

      <div className={headerOnly ? 'px-8' : ''}>
        <LinkedBusinessCard customerId={data.customer.customerId} />
      </div>

      {!telesales && !headerOnly && (
      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricCard label="Account Status" value={accountStatus} subtext={`${data.accounts.length} account${data.accounts.length === 1 ? '' : 's'}`} />
        <MetricCard
          label="Current Bill"
          value={latestBill ? `${formatAmountAny(String(latestBill.totalAmount ?? '-'))} QAR` : '-'}
          subtext={latestBill ? capitalizeStatus(latestBill.status) : 'No bills on file'}
        />
        <MetricCard
          label="Outstanding"
          value={`${formatAmountAny(outstanding)} QAR`}
          subtext={outstanding > 0 ? 'Overdue balance' : 'No overdue balance'}
        />
        <MetricCard
          label="Open Tickets"
          value={String(openTicketCount)}
          subtext={openTicketCount > 0 ? 'Needs attention' : 'All resolved'}
        />
      </div>
      )}

      {!headerOnly && <BellNotificationBanner customerId={data.customer.customerId} />}
      {tabs.length === 0 ? (
        // Deliberate strict compliance with the source visibility data
        // (2026-09-29 decision): a department granted no real-time or
        // drill-down access to any of the 13 topics (e.g. EBU Operations)
        // sees this rather than a crash or a blank/broken tab strip.
        <p className={`text-fg-2 text-[length:var(--fs-body)] card p-6 ${headerOnly ? 'm-8' : ''}`}>
          No Customer 360 sections are visible for your role.
        </p>
      ) : (
        // Choosing a tab by hand clears the deep-linked selection. Without
        // this, the "Selected" marker would stay on a service in a tab the
        // agent has navigated away from and back to for their own reasons.
        <Tabs
          items={tabs}
          orientation={headerOnly ? 'vertical' : 'horizontal'}
          rail={headerOnly}
          activeKey={shownTab}
          onChange={(key) => {
            setActiveTab(key);
            setSelectedServiceRef(undefined);
          }}
        />
      )}

      {verificationGate}
      <DemographicEditDrawer
        open={demoDrawerOpen}
        onClose={() => setDemoDrawerOpen(false)}
        customer={data.customer}
        onSaved={(patch) => setData((prev) => (prev ? { ...prev, customer: { ...prev.customer, ...patch } } : prev))}
        onTicketCreated={addTicket}
      />
      <PrimaryContactDrawer
        key={`pc-${data.customer.customerId}-${primaryContactOpen}`}
        open={primaryContactOpen}
        onClose={() => setPrimaryContactOpen(false)}
        customerId={data.customer.customerId}
        billingProfileId={data.billingProfiles[0]?.billingProfileId as string | undefined}
        contacts={data.contacts as unknown as { contactRecordId: string; firstName?: string; middleName?: string; lastName?: string }[]}
        currentId={primaryContactOf(data.contacts, data.billingProfiles[0]?.primaryContactId)?.contactRecordId as string | undefined}
        onSaved={(c) =>
          setData((prev) =>
            prev ? { ...prev, billingProfiles: prev.billingProfiles.map((bp, i) => (i === 0 ? { ...bp, primaryContactId: c.contactRecordId, billingContactName: [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ') } : bp)) } : prev
          )
        }
        onTicketCreated={addTicket}
      />
      <AccountEditDrawer
        key={`${data.customer.customerId}-${accountDrawerOpen}`}
        open={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        customer={data.customer}
        account={data.accounts[0]}
        creditLimit={data.creditLimits[0] as { id?: string; creditLimitQar?: number; creditControlLimitQar?: number | null } | undefined}
        onSaved={(p) =>
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  accounts: p.accountStatus ? prev.accounts.map((a, i) => (i === 0 ? { ...a, status: p.accountStatus ?? a.status } : a)) : prev.accounts,
                  creditLimits: p.creditLimitQar !== undefined ? (prev.creditLimits.length ? prev.creditLimits.map((c, i) => (i === 0 ? { ...c, creditLimitQar: p.creditLimitQar, selectedCreditLimitQar: p.selectedCreditLimitQar } : c)) : [{ creditLimitQar: p.creditLimitQar, selectedCreditLimitQar: p.selectedCreditLimitQar }]) : prev.creditLimits,
                }
              : prev
          )
        }
        onTicketCreated={addTicket}
      />
      </DemoProvider>
    </div>
  );
}

function capitalizeStatus(value: unknown): string {
  const s = String(value ?? '');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '-';
}

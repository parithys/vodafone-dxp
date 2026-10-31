import { useEffect, useState } from 'react';
import { Tabs, type TabItem } from '../../../components/primitives/Tabs';
import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import type { CustomerService, ServiceTab } from '../../../engines/customerServicesEngine';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { MobileSection } from './MobileSection';
import { FibreHomeSection } from './FibreHomeSection';
import { EnterpriseSection } from './EnterpriseSection';
import { ProductsAssetsSection } from './MiscSections';
import { TopicFieldsSection } from './TopicFieldsSection';
import { buildAssetsFieldResolver, assetsRichFields } from './assetsResolvers';

export type AssetsSubView = 'overview' | ServiceTab | 'enterprise';

/** Customer 360's "Assets" tab: the former Mobile, Fibre & Home, Enterprise
 * and Products & Assets tabs, behind one inner sub-tab strip -
 * customer360-fields.json's Assets topic is exactly what these four already
 * showed (plan/add-ons, MSISDN status, activation dates, usage). Deep links
 * from elsewhere in the app (queue notification, toasts, the Linked
 * Services panel) still only know `ServiceTab` ('mobile' | 'fibre' |
 * 'assets') - `initialSubView` is seeded from that value by
 * Customer360Layout, with 'assets' landing on Overview since that's the
 * ServiceTab bucket Overview's installed-assets rollup already covers. */
export function AssetsSection({
  customer,
  services,
  servicesLoaded,
  selectedServiceRef,
  initialSubView,
  data,
  personaId,
}: {
  customer: ActiveCustomerSummary;
  services: CustomerService[];
  /** Undefined until the service inventory sources have loaded - see
   * Customer360Layout's own note on why "not yet known" must stay distinct
   * from "definitely none". */
  servicesLoaded: boolean;
  selectedServiceRef?: string;
  initialSubView: AssetsSubView;
  data: Customer360Data;
  personaId: string | undefined;
}) {
  const [subView, setSubView] = useState<AssetsSubView>(initialSubView);

  // Re-applies the deep-linked sub-view per navigation, same mechanism
  // Customer360Layout uses for the outer tab - see its comment on why both
  // the initial value and this effect are needed.
  useEffect(() => {
    setSubView(initialSubView);
  }, [initialSubView]);

  const servicesFor = (tab: ServiceTab) => services.filter((s) => s.tab === tab);
  const hasServiceOn = (tab: ServiceTab) => (servicesLoaded ? servicesFor(tab).length > 0 : undefined);

  const tabs: TabItem[] = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <ProductsAssetsSection data={data} />
          {/* Assets fields this corpus tracks per ACCOUNT rather than per
              individual line (balance, usage, device-installment) - shown
              once here rather than repeated identically on every line's
              expandable panel. */}
          <TopicFieldsSection personaId={personaId} topic="Assets" resolveValue={buildAssetsFieldResolver(undefined, data)} richFields={assetsRichFields(data)} />
        </div>
      ),
    },
    {
      key: 'mobile',
      label: 'Mobile',
      content: (
        <MobileSection
          customer={customer}
          services={servicesFor('mobile')}
          selectedServiceRef={selectedServiceRef}
          hasExistingService={hasServiceOn('mobile')}
          personaId={personaId}
          data={data}
        />
      ),
    },
    {
      key: 'fibre',
      label: 'Fibre & Home',
      content: (
        <FibreHomeSection
          customer={customer}
          services={servicesFor('fibre')}
          selectedServiceRef={selectedServiceRef}
          hasExistingService={hasServiceOn('fibre')}
          personaId={personaId}
          data={data}
        />
      ),
    },
    { key: 'enterprise', label: 'Enterprise', content: <EnterpriseSection customer={customer} /> },
  ];

  return (
    <Tabs
      items={tabs}
      orientation="horizontal"
      activeKey={subView}
      onChange={(key) => setSubView(key as AssetsSubView)}
    />
  );
}

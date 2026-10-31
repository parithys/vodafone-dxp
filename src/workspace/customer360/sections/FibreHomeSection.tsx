import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import { ProductActionGroups, type ProductActionGroup } from '../ProductActionGroups';
import { ServiceList } from '../ServiceList';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { buildAssetsFieldResolver } from './assetsResolvers';

// Fibre Activation (SCR-043) and FWA/5G Home (SCR-077, one shared wizard for
// both per the FWA/5G Home module) are the only real entry points today.
// Relocation/Upgrade/Suspend/Resume/Terminate have no dedicated screen -
// Home Move (SCR-115/116) exists only as unregistered mid-flow steps, not a
// launchable action, so it's listed honestly as not-yet-built rather than
// stretched into a fit.
const GROUPS: ProductActionGroup[] = [
  {
    title: 'Service Management',
    actions: [
      { label: 'Upgrade', appliesWhen: 'has-service', description: 'Move the customer to a higher fibre or broadband speed tier.' },
      { label: 'Relocation', appliesWhen: 'has-service', description: 'Move an existing fibre or home service to a new installation address.' },
      { label: 'Suspend', appliesWhen: 'has-service', description: 'Temporarily pause the home service without cancelling the subscription.' },
      { label: 'Resume', appliesWhen: 'has-service', description: 'Reactivate a suspended fibre or home service.' },
      { label: 'Terminate', appliesWhen: 'has-service', description: 'Permanently close the fibre or home service and stop billing.' },
    ],
  },
  {
    title: 'New Activation',
    actions: [
      { label: 'Fibre Activation', appliesWhen: 'no-service', description: "Install and activate a new fibre broadband connection at the customer's address.", screenId: 'SCR-043' },
      { label: 'FWA', appliesWhen: 'no-service', description: 'Activate Fixed Wireless Access - home broadband delivered over the mobile network, no fibre required.', screenId: 'SCR-077' },
      { label: '5G Home', appliesWhen: 'no-service', description: 'Activate a 5G-based home broadband plan for addresses within 5G coverage.', screenId: 'SCR-077' },
      { label: 'IPTV', appliesWhen: 'has-service', description: "Add IPTV channel packages on top of the customer's home broadband service." },
    ],
  },
];

export function FibreHomeSection({
  customer,
  services,
  selectedServiceRef,
  hasExistingService,
  personaId,
  data,
}: {
  customer: ActiveCustomerSummary;
  services: CustomerService[];
  selectedServiceRef?: string;
  hasExistingService?: boolean;
  personaId: string | undefined;
  data: Customer360Data;
}) {
  return (
    <div>
      {/* This tab listed no services at all before - only actions. */}
      <ServiceList
        services={services}
        selectedRef={selectedServiceRef}
        emptyMessage="No fibre or home services on file."
        personaId={personaId}
        resolveField={(service, details) => buildAssetsFieldResolver(service, data)(details)}
      />
      <ProductActionGroups groups={GROUPS} customer={customer} hasExistingService={hasExistingService} />
    </div>
  );
}

import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import { ProductActionGroups, type ProductActionGroup } from '../ProductActionGroups';
import { ServiceList } from '../ServiceList';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { buildAssetsFieldResolver } from './assetsResolvers';
import { existingCustomerPath } from '../../../navigation/journeyPaths';

// Product taxonomy per the redesign brief. Only MNP/FNP Porting and New
// Connection map to screens that actually exist in the 213-screen catalogue
// today (SCR-121, SCR-037) - the rest render an honest "not yet built" state
// via ProductActionGroups rather than a fabricated screen. This is the
// documented gap, not an oversight.
// Note: SCR-120 ("Choose process") is cataloged but unregistered - SCR-121
// (the wizard's own Contact step) is the real, built entry point.
const GROUPS: ProductActionGroup[] = [
  {
    title: 'Existing Customer Services',
    actions: [
      { label: 'Plan Change', appliesWhen: 'has-service', description: "Move the customer to a different postpaid or prepaid plan, updating their monthly commitment and bundled allowances." },
      { label: 'Add Add-On', appliesWhen: 'has-service', description: "Attach an extra data, voice, or roaming bundle on top of the customer's existing plan." },
      { label: 'Remove Add-On', appliesWhen: 'has-service', description: "Cancel an active add-on bundle and stop its recurring charge from the next billing cycle." },
      { label: 'Device Upgrade', appliesWhen: 'has-service', description: "Move the customer onto a new device, optionally with an installment plan tied to their line." },
      { label: 'Suspend', appliesWhen: 'has-service', description: "Temporarily pause the line's service - no usage, but the plan and number stay reserved." },
      { label: 'Resume', appliesWhen: 'has-service', description: "Reactivate a suspended line and restore normal service." },
      { label: 'Terminate', appliesWhen: 'has-service', description: "Permanently close the line and end billing for this service." },
    ],
  },
  {
    title: 'Number & SIM Services',
    actions: [
      { label: 'SIM Replacement', appliesWhen: 'has-service', description: "Issue a new physical SIM for a lost, damaged, or faulty card while keeping the same number." },
      { label: 'eSIM Management', appliesWhen: 'has-service', description: "Provision, transfer, or remove an eSIM profile for the customer's device." },
      { label: 'Ownership Change', appliesWhen: 'has-service', description: "Transfer the account/line to a new owner's ID, moving billing and usage history with it." },
      { label: 'MNP/FNP Porting', description: 'Port an existing mobile or fixed number in from another carrier onto a Vodafone plan.', screenId: 'SCR-121' },
    ],
  },
  {
    title: 'New Connection',
    actions: [
      // Started from Customer Details, so the customer is treated as EXISTING: the
      // Existing Customer flow opens with their identity pre-resolved and locked.
      // Not gated on 'no-service' - an existing customer with lines can still take a new one.
      { label: 'New Connection', description: 'Start a new postpaid activation for this existing customer - their identity is already verified, so the journey opens pre-filled and goes straight to eligibility.', path: (c) => existingCustomerPath(c.customerId) },
      { label: 'Add Line', appliesWhen: 'has-service', description: "Add an additional line to an existing customer's account, e.g. a family or multi-SIM plan." },
    ],
  },
];

export function MobileSection({
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
  /** Backs each line's expandable Assets field panel (2026-09-29 rebuild) -
   * see ServiceList's own note on why this is per-service, not one flat
   * panel for the tab. */
  personaId: string | undefined;
  data: Customer360Data;
}) {
  return (
    <div>
      {/* The lines themselves, replacing an "N active postpaid lines on file"
          count that named none of them - and that was mobile-only, so a
          fibre-or-IoT customer read as having nothing. */}
      <ServiceList
        services={services}
        selectedRef={selectedServiceRef}
        emptyMessage="No mobile services on file."
        personaId={personaId}
        resolveField={(service, details) => buildAssetsFieldResolver(service, data)(details)}
      />
      <ProductActionGroups groups={GROUPS} customer={customer} hasExistingService={hasExistingService} />
    </div>
  );
}

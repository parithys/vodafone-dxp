import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import type { AssetsSubView } from '../sections/AssetsSection';

export interface TelesalesContext {
  personaId: string | undefined;
  data: Customer360Data;
  services: CustomerService[];
  customer: ActiveCustomerSummary;
  servicesLoaded: boolean;
  selectedServiceRef: string | undefined;
  assetsSubView: AssetsSubView;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
  /** Switches the Customer 360 tab (the Overview cards' "View Details" links). */
  goToTab: (key: string) => void;
}

export const visibleCount = (personaId: string | undefined, topic: string, only: string[]) =>
  getVisibleTopicFields(personaId, topic).filter(({ field }) => only.includes(field.details)).length;


import { matchRanges, queryKeywords } from './queryFlowModel';

// The in-page search index: the TITLES of Customer 360's containers (cards / sections), nothing else. It is a
// configuration - container id, title and the tab it sits on - not a scan of rendered text, so field labels, values,
// table contents and badges are never searchable, and a tab that is not on screen is still found. A container
// added to a tab appears here by adding one line; its id must match the `id` Panel derives from its title (see
// containerId in C360Kit) or is given to it explicitly.

export interface ContainerEntry {
  id: string;
  title: string;
  tab: string;
}

export const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  'account-info': 'Account Information',
  'products-services': 'Products & Services',
  billing: 'Billing & Payments',
  'offers-leads': 'Offers & Leads',
  'contact-identity': 'Contact & Identity',
  orders: 'Orders',
  'tickets-support': 'Tickets & Support',
  activities: 'Activities',
  'alerts-risks': 'Alerts & Risks',
  'address-service': 'Address & Service',
};

const c = (tab: string, titles: string[]): ContainerEntry[] => titles.map((title) => ({ id: containerId(title), title, tab }));

/** Stable id for a container from its title; a trailing count "(3)" is not part of it. */
export function containerId(title: string): string {
  return 'c360-' + title.replace(/\s*\(.*\)\s*$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const CONTAINERS: ContainerEntry[] = [
  ...c('overview', ['Account Summary', 'Connections & Services', 'Billing & Payments', 'Offers & Opportunities', 'Recent Activity', 'Usage & Behaviour', 'Alerts & Risks', 'Lead Information']),
  ...c('account-info', ['Account Details', 'Billing Contact', 'Connections by Service Type', 'Account Hierarchy', 'Pending Work & Actions', 'Financial Summary', 'Contact Hierarchy', 'Recent Milestones or Interactions']),
  ...c('products-services', ['All Services', 'Plan & Usage', 'Service Details', 'Add-ons', 'Device & App']),
  ...c('billing', ['Billing Profile(s)', 'Dunning & Barring', 'Bill Settings', 'Payment Methods']),
  ...c('offers-leads', ['Next Best Offer', 'All Offers', 'Active Leads', 'Your Eligibility', 'Lead History']),
  ...c('contact-identity', ['Identity Information', 'Contact Information', 'Contact Role & Relationship', 'Contact Hierarchy', 'Addresses', 'Additional Information']),
  ...c('orders', ['Order Details']),
  ...c('tickets-support', ['Recent Ticket Activity', 'Related Information', 'Ticket Details']),
  ...c('activities', ['Activity Details']),
  ...c('alerts-risks', ['Risk & Eligibility Indicators', 'Notifications / Notes']),
  ...c('address-service', ['Customer Address', 'Map View', 'Service Availability', 'Installation / Service Information', 'Other Addresses']),
];

/** Containers whose title contains every keyword (matched from the start of a word), on tabs the role has. */
export function searchContainers(term: string, hasTab: (tab: string) => boolean): ContainerEntry[] {
  const keywords = queryKeywords(term);
  if (keywords.length === 0) return [];
  return CONTAINERS.filter((e) => hasTab(e.tab) && matchRanges(e.title, keywords));
}

/**
 * Brings a container into view once its tab has rendered: scrolls to it, opens it if it is collapsed, and flashes the
 * design system's focus ring on it for two seconds.
 */
export function revealContainer(id: string): void {
  let tries = 0;
  const attempt = () => {
    const el = document.querySelector<HTMLElement>(`[data-container-id="${id}"]`);
    if (!el) {
      if (++tries < 20) window.setTimeout(attempt, 50);
      return;
    }
    el.querySelector<HTMLElement>('button[aria-expanded="false"]')?.click();
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const prev = el.style.boxShadow;
    el.style.boxShadow = 'var(--focus-ring)';
    window.setTimeout(() => (el.style.boxShadow = prev), 2000);
  };
  attempt();
}

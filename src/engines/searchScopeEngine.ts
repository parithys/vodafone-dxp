import type { PersonaApproach } from '../types/config';


// What global search looks across, and what it says it looks across, per
// approach. The one `groups` array drives BOTH the fetch set and the section
// render order, so the placeholder can never promise a scope the results
// don't cover.

export type SearchGroup = 'customers' | 'leads' | 'tickets' | 'orders' | 'sim-swaps' | 'catalog';

export interface SearchScope {
  placeholder: string;
  groups: SearchGroup[];
}

const SCOPES: Record<PersonaApproach, SearchScope> = {
  'Customer-First': {
    placeholder: 'Search customers, tickets, orders, leads…',
    groups: ['customers', 'tickets', 'orders', 'leads', 'sim-swaps'],
  },
  'Product-First': {
    placeholder: 'Search products, plans, bundles, campaigns…',
    groups: ['catalog', 'orders', 'leads', 'customers'],
  },
  Hybrid: {
    placeholder: 'Search products, tickets, leads, orders, campaigns…',
    groups: ['customers', 'catalog', 'tickets', 'orders', 'leads', 'sim-swaps'],
  },
  None: {
    placeholder: 'Search customers, tickets, orders…',
    groups: ['customers', 'tickets', 'orders'],
  },
};

export function searchScopeFor(approach: PersonaApproach | undefined): SearchScope {
  return SCOPES[approach ?? 'Customer-First'];
}

import type { Persona, PersonaApproach } from '../../types/config';
import { greeting } from './heroFigures';
import { canSeeQnomyTicketNumber } from '../../engines/agentPrivilegeEngine';

// The dashboard is ONE route rendering one or two zones. Approach - the
// persona's own configured value, resolved automatically at login - decides
// which zones and in what order. There is no agent-facing override: a Hybrid
// role always gets both zones, half and half, rather than a Focus control
// that could narrow to one.
//
// Removed 2026-09-27. Focus let an agent collapse a Hybrid dashboard to a
// single zone, which meant the KPI set on screen was no longer purely a
// function of the signed-in agent's configured approach - two Hybrid agents
// looking at the same role could see different things depending on a filter
// neither of their persona records mentioned. Approach alone deciding the
// view is the whole point of the requirement this satisfies.

export type ZoneId = 'customer-ops' | 'product-work';
export type ZoneSize = 'full' | 'half' | 'collapsed';

export interface ZonePlacement {
  id: ZoneId;
  size: ZoneSize;
}

export interface DashboardLayout {
  zones: ZonePlacement[];
  /** View Only: suppress every quick action and make tiles non-navigating. */
  readOnly: boolean;
  heading: string;
  /** Optional, and carried only where it tells the agent something the page
   * does not already show them - currently just View Only, where it explains
   * why the tiles refuse to navigate. The other three approaches restated the
   * page to someone already looking at it, so they no longer set it. */
  subtitle?: string;
}

/** Which flavour of work the product zone shows. Product-First covers five very
 * different roles - "product-first" for a Field Engineer means work-item-first,
 * not catalogue management - so the zone keeps one structure and swaps content
 * by persona group. */
export type ProductZoneVariant = 'catalogue' | 'fulfilment' | 'field' | 'counter-sales';

export function productZoneVariantFor(persona: Persona | undefined): ProductZoneVariant {
  if (!persona) return 'catalogue';
  if (persona.group === 'Field Operations & Workforce Management') return 'field';
  if (persona.group === 'Order Fulfilment & Back Office') return 'fulfilment';
  // A sales role that works the walk-in queue (Retail Sales) sells at a counter: its zone is its own orders, drafts, leads and queue, not
  // catalogue health (price exceptions, live campaigns, channel mix), which it has no permission to act on.
  if (persona.group === 'Sales & Acquisition' && canSeeQnomyTicketNumber(persona.id)) return 'counter-sales';
  // Platform Administration owns the catalogue; Management/oversight roles see
  // it too, since their Hybrid zone is about product and channel performance.
  return 'catalogue';
}

export function layoutFor(approach: PersonaApproach, firstName: string): DashboardLayout {
  switch (approach) {
    case 'Product-First':
      return {
        zones: [{ id: 'product-work', size: 'full' }],
        readOnly: false,
        heading: `${greeting()}, ${firstName}.`,
      };

    case 'Hybrid':
      return {
        zones: [{ id: 'customer-ops', size: 'half' }, { id: 'product-work', size: 'half' }],
        readOnly: false,
        heading: `${greeting()}, ${firstName}.`,
      };

    case 'None':
      return {
        zones: [{ id: 'customer-ops', size: 'full' }],
        readOnly: true,
        heading: `${greeting()}, ${firstName}.`,
        subtitle: 'Read-only view. You can review records and approve or reject orders.',
      };

    case 'Customer-First':
    default:
      return {
        zones: [{ id: 'customer-ops', size: 'full' }],
        readOnly: false,
        heading: `${greeting()}, ${firstName}.`,
      };
  }
}

import { IS_DEV } from '../lib/buildEnv';
import { getPersona } from './configEngine';
import { canUseFeature } from './personaEngine';
import {
  NAV_BY_KEY,
  NAV_MAX_TOP_LEVEL,
  type NavItem,
  type NavKey,
} from '../navigation/navManifest';
import { reachableCategories, visibleJourneys } from '../navigation/journeyCatalogue';
import { resolveJourneyTarget } from '../navigation/journeyTarget';
import type { PersonaApproach } from '../types/config';


// Approach -> ordered nav subset. This is the literal implementation of the
// design intent "same nav manifest, filtered and reordered per persona": one
// closed manifest (navManifest.ts), four orderings, no per-role nav lists to
// maintain across 26 roles.
//
// Order is meaningful - it IS the information architecture. Customer-First
// leads with the customer; Product-First leads with the product/work item and
// treats the work item first; Hybrid is the union, interleaved so
// each half stays contiguous.
//
// Deliberately NOT access control. Screen- and action-level gating lives in
// personaEngine/agentPrivilegeEngine; a nav label tells you the platform has
// an area, not that you may do everything inside it. The single exception is
// an item declaring `requiresFeature` (Administration), which is a genuine
// boundary rather than IA.
const APPROACH_NAV: Record<PersonaApproach, NavKey[]> = {
  'Customer-First': ['dashboard', 'customer-search', 'sales', 'support', 'orders', 'bill-formatter'],
  'Product-First': ['dashboard', 'new-connections', 'mobile', 'fibre-home', 'operations', 'leads', 'bill-formatter'],
  Hybrid: [
    'dashboard',
    'customer-search',
    'new-connections',
    'mobile',
    'fibre-home',
    'sales',
    'operations',
    'leads',
    'support',
    'orders',
    'bill-formatter',
  ],
  // View Only: a read-only reviewer needs to find a record and read its
  // history, nothing more.
  None: ['dashboard', 'customer-search', 'support'],
};

const FALLBACK_APPROACH: PersonaApproach = 'Customer-First';

/** Never throws, never returns undefined. Falls back when the persona is
 * missing - a persisted role id can outlive a config change, and the whole
 * shell must not disappear because of it. */
export function approachFor(personaId: string | undefined): PersonaApproach {
  if (!personaId) return FALLBACK_APPROACH;
  return getPersona(personaId)?.approach ?? FALLBACK_APPROACH;
}

/** The role's ordered, filtered nav items. Never empty: Dashboard is in every
 * approach, so the shell always has at least one destination. */
export function resolveNavFor(personaId: string | undefined): NavItem[] {
  const keys = APPROACH_NAV[approachFor(personaId)];
  const items = keys
    .map((key) => NAV_BY_KEY.get(key))
    .filter((item): item is NavItem => Boolean(item))
    .filter((item) => !item.requiresFeature || (personaId ? canUseFeature(personaId, item.requiresFeature) : false));

  // Items gated by a feature grant are appended rather than dropped from the
  // ordering, so Administration lands last for the roles that hold it instead
  // of needing a slot in all four approach arrays.
  const extras = [...NAV_BY_KEY.values()].filter(
    (item) =>
      item.requiresFeature
      && !keys.includes(item.key)
      && personaId
      && canUseFeature(personaId, item.requiresFeature)
  );

  // Product lines: restrict the sub-menu to the categories this role can
  // actually reach, so the rail and the page agree (they diverged once - the
  // page hid empty categories while the rail still listed all five, letting a
  // role click a sub-menu item and land on someone else's content).
  //
  // Both lines stay in the rail even when a role reaches NO categories in one
  // of them, and always in Mobile -> Fibre & Home order. They are the platform's
  // two primary product lines, so dropping one made the rail's shape change
  // between roles and read as a missing feature rather than a scoping decision.
  // The line's own page carries the explanation instead.
  const scoped = [...items, ...extras].map((item) => {
    if (item.key !== 'mobile' && item.key !== 'fibre-home') return item;
    const reachable = reachableCategories(item.key, (featureKey) =>
      personaId ? canUseFeature(personaId, featureKey) : false
    );
    const reachableKeys = new Set(reachable.map((c) => `${item.key}.${c.key}`));
    const can = (featureKey: string) => (personaId ? canUseFeature(personaId, featureKey) : false);
    return {
      ...item,
      children: item.children
        ?.filter((c) => reachableKeys.has(c.key))
        .map((c) => {
          const category = reachable.find((r) => `${item.key}.${r.key}` === c.key);
          return category
            ? {
                ...c,
                journeys: visibleJourneys(category, can).map((j) => ({ id: j.id, label: j.title, to: resolveJourneyTarget(j), status: j.status })),
              }
            : c;
        }),
    };
  });

  const resolved = scoped;

  // Warn, never throw. This runs on every Sidebar render for every role, and
  // an over-cap rail is a design smell, not a correctness fault - throwing
  // here took out the entire navigation rail with no visible message the first
  // time a Hybrid role also held the Administration grant (9 + 1 = 10).
  // Breaking navigation is strictly worse than the sprawl it guards against.
  if (IS_DEV && resolved.length > NAV_MAX_TOP_LEVEL && !warnedOverCap.has(personaId ?? '')) {
    warnedOverCap.add(personaId ?? '');
    console.error(
      `navigationEngine: ${personaId} resolves to ${resolved.length} top-level nav items, over the `
      + `NAV_MAX_TOP_LEVEL cap of ${NAV_MAX_TOP_LEVEL} (INV-2). Express extra depth as children `
      + 'instead of new top-level keys, or raise the cap deliberately.'
    );
  }
  return resolved;
}

/** One warning per role, so an over-cap rail doesn't spam every render. */
const warnedOverCap = new Set<string>();

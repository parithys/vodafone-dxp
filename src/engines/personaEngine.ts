import { getPersonaScreenLevel, getPersonaFeatureLevel, getPersonaFeatureGrants } from './configEngine';
import type { PermissionLevel, PersonaFeatureGrant, Route } from '../types/config';


// Persona simulation per frontend-architecture.md §8 - a dev/demo "login-as"
// affordance, NOT a security boundary.
//
// 2026-09-24: access now comes from each persona's explicit feature grants in
// config/personas.json, expanded to screen ids through
// config/feature-catalogue.json. Those grants are EXHAUSTIVE and
// AUTHORITATIVE for the 26 operational roles: absence of a grant means
// DELIBERATELY NOT GRANTED.
//
// That inverts the stance this file used to document. Previously access came
// from rbac.json - 145 rows of sparse, source-derived evidence across 213
// screens and 66 personas - so absence meant "not evidenced", which was
// treated conservatively as hidden precisely because it was not a decision.
// Now it IS a decision, so there is no longer an evidence gap to be cautious
// about. rbac.json itself is archived as config/rbac-legacy-66.json and is
// display-only; see getLegacyRbacForRole().
//
// One thing deliberately unchanged: module names in the sidebar are IA, not
// access grants. Navigation is filtered by approach (navigationEngine), while
// these functions gate per-screen visibility and per-action rights.

export function screensVisibleFor(personaId: string, allScreensInModule: Route[]): {
  route: Route;
  permissionLevel: PermissionLevel | null;
}[] {
  return allScreensInModule.map((route) => ({
    route,
    permissionLevel: permissionLevelFor(personaId, route.screenId),
  }));
}

export function permissionLevelFor(personaId: string, screenId: string): PermissionLevel | null {
  return getPersonaScreenLevel(personaId, screenId);
}

const ACTION_LEVELS: PermissionLevel[] = ['View', 'Create', 'Edit', 'Approve', 'Full'];

export function canPerformAction(personaId: string, screenId: string, minLevel: PermissionLevel): boolean {
  const level = permissionLevelFor(personaId, screenId);
  if (!level) return false;
  return ACTION_LEVELS.indexOf(level) >= ACTION_LEVELS.indexOf(minLevel);
}

/** Feature-key equivalents of the screen functions above, for the workspace
 * surfaces that are routed directly in router.tsx and so carry no SCR- id
 * (dashboard, customer search, tasks, agent profile, administration). */
export function canUseFeature(personaId: string, featureKey: string): boolean {
  return getPersonaFeatureLevel(personaId, featureKey) !== null;
}

export function grantedFeaturesFor(personaId: string): PersonaFeatureGrant[] {
  return getPersonaFeatureGrants(personaId);
}

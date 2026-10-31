import type { ModuleHierarchyEntry, Route } from '../types/config';
import { getReqToScreens } from './configEngine';

export interface FeatureGroup {
  subModule: string;
  feature: string;
  routes: Route[];
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'for', 'and', 'or', 'to', 'in', 'on', 'with', 'view', 'screen', 'step', 'modal',
  'form', 'tab', 'page', 'wizard', 'dashboard', 'popup', 'new', 'order',
]);

function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[()/,&.\-–]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function bestHeuristicMatch(route: Route, module: ModuleHierarchyEntry): { subModule: string; feature: string } | null {
  const screenTokens = tokenize(route.screenName);
  let best: { subModule: string; feature: string; score: number } | null = null;
  for (const sub of module.subModules) {
    for (const feature of sub.features) {
      const featureTokens = tokenize(`${sub.subModule} ${feature.feature}`);
      const score = [...screenTokens].filter((t) => featureTokens.has(t)).length;
      if (score > 0 && (!best || score > best.score)) {
        best = { subModule: sub.subModule, feature: feature.feature, score };
      }
    }
  }
  return best;
}

// Groups a module's screens under their evidenced sub-module/feature where
// possible, falling back to a keyword-overlap heuristic, and leaving
// anything neither evidenced nor heuristically matched in `ungrouped`.
//
// This is NOT a fully evidenced mapping - module-hierarchy.json has no
// direct screen-to-feature field. The best real link available is
// Feature.relatedRequirementIds -> traceability-matrix.md's REQ "Screens:"
// citations, but only 70 of 295 requirements cite a screen at all (~25%
// coverage), so most placements below are the keyword heuristic, not
// evidence. Confirmed example of evidence overriding the "obvious" guess:
// SCR-009 ("Bulk Activation Control Sheet") sits under FWA/5G Home in
// routes.json's own coarse module bucketing, but traceability-matrix.md's
// REQ-020 (its only requirement citation) is owned by Enterprise/IoT/B2B's
// "Bulk Operations" feature - i.e. the module-level bucketing itself may be
// wrong for screens like this, a separate, larger issue from this grouping.
export function groupRoutesByFeature(module: ModuleHierarchyEntry, routes: Route[]): { groups: FeatureGroup[]; ungrouped: Route[] } {
  const reqToScreens = getReqToScreens();
  const assigned = new Set<string>();
  const groups: FeatureGroup[] = [];

  for (const sub of module.subModules) {
    for (const feature of sub.features) {
      const evidencedIds = new Set<string>();
      for (const reqId of feature.relatedRequirementIds) {
        for (const scrId of reqToScreens[reqId] ?? []) evidencedIds.add(scrId);
      }
      const featureRoutes = routes.filter((r) => evidencedIds.has(r.screenId) && !assigned.has(r.screenId));
      featureRoutes.forEach((r) => assigned.add(r.screenId));
      groups.push({ subModule: sub.subModule, feature: feature.feature, routes: featureRoutes });
    }
  }

  for (const route of routes) {
    if (assigned.has(route.screenId)) continue;
    const match = bestHeuristicMatch(route, module);
    if (match) {
      const group = groups.find((g) => g.subModule === match.subModule && g.feature === match.feature);
      group?.routes.push(route);
      assigned.add(route.screenId);
    }
  }

  const ungrouped = routes.filter((r) => !assigned.has(r.screenId));
  return { groups, ungrouped };
}

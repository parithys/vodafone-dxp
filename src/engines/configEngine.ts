import type {
  Route,
  Persona,
  RbacEntry,
  BusinessRule,
  ValidationRule,
  DomainEntity,
  ModuleHierarchyEntry,
  ApprovalMatrixEntry,
  FeatureCatalogueEntry,
  DocumentTypeConfig,
  PermissionLevel,
  PersonaFeatureGrant,
  Customer360Field,
} from '../types/config';
import { appPath } from '../lib/basePath';


interface ConfigData {
  routes: Route[];
  personas: Persona[];
  featureCatalogue: FeatureCatalogueEntry[];
  /** personaId -> featureKey -> granted level. Precomputed at boot. */
  personaFeatureLevel: Record<string, Record<string, PermissionLevel>>;
  /** personaId -> screenId -> highest granted level, expanded from the
   * feature catalogue. Precomputed so permissionLevelFor() is an O(1) lookup
   * rather than the O(n) scan the old rbac.json filter did once per screen
   * row in ModuleScreenList. */
  personaScreenLevel: Record<string, Record<string, PermissionLevel>>;
  /** Archived 66-persona evidence. Display-only - see RbacEntry. */
  rbac: RbacEntry[];
  businessRules: BusinessRule[];
  validationRules: ValidationRule[];
  domainSchema: DomainEntity[];
  moduleHierarchy: ModuleHierarchyEntry[];
  /** REQ-id -> evidenced screen ids, mechanically extracted from
   * traceability-matrix.md's "Screens:" lines. Only 70 of 295 requirements
   * cite a screen - see screenGrouping.ts for how this partial evidence is
   * used (and where it falls back to a heuristic). */
  reqToScreens: Record<string, string[]>;
  journeyCatalogueMap: JourneyCatalogueMap;
  approvalMatrix: ApprovalMatrixEntry[];
  /** Optional config files that failed to load, by file name: the app boots without them, but a consumer that would silently change behaviour must check. */
  degraded: string[];
  /** Customer 360 redesign (2026-09-28) - see Customer360Field's own note. */
  customer360Fields: Customer360Field[];
  /** Staff ID -> one of customer360Fields' department keys, or null for a
   * persona the source spreadsheet's Mapping sheet names but that has no
   * matching column in "Customer 360 List - FINAL" - see
   * customer360-department-mapping.json's own _gaps note. */
  customer360DepartmentMapping: Record<string, string | null>;
  /** Pick-list values (public/config/lookup-lists.json), by list name. */
  lookupLists: Record<string, string[]>;
  /** Document types and their applicability (public/config/document-types.json). */
  documentTypes: DocumentTypeConfig[];
}

/** Crosswalk between CRM_Journeys_Final_Updated_with_Type.xlsx (Page Type
 * sheet, Unique ID column) and this app's screens/modules - see that
 * workbook's Mapping Report sheet for the full mapped/unmapped list and
 * rationale. Only screens/modules with a confident, manually-verified name
 * match are present; anything absent here simply has no journey ID to show. */
interface JourneyCatalogueMap {
  journeys: Record<string, { name: string; type: string }>;
  screens: Record<string, string[]>;
  modules: Record<string, string[]>;
}

const EMPTY_JOURNEY_CATALOGUE_MAP: JourneyCatalogueMap = { journeys: {}, screens: {}, modules: {} };

let cache: ConfigData | null = null;
let loading: Promise<ConfigData> | null = null;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(appPath(path));
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Loads one file from public/config on demand (for config only a single screen needs), with the same error behaviour as the boot load. */
export function loadConfigFile<T>(file: string): Promise<T> {
  return fetchJson<T>(`/config/${file}`);
}

/** Weakest → strongest. Shared with personaEngine.canPerformAction. */
const LEVEL_ORDER: PermissionLevel[] = ['View', 'Create', 'Edit', 'Approve', 'Full'];

function strongest(a: PermissionLevel | undefined, b: PermissionLevel): PermissionLevel {
  if (!a) return b;
  return LEVEL_ORDER.indexOf(b) > LEVEL_ORDER.indexOf(a) ? b : a;
}

/** Expands each persona's feature grants into per-feature and per-screen level
 * maps. Where two granted features share a screen id, the stronger level wins
 * (e.g. orders.approval-detail@Approve beats orders.my-sales-orders@View), so
 * a screen is never accidentally downgraded by an unrelated grant. */
function indexGrants(personas: Persona[], catalogue: FeatureCatalogueEntry[]) {
  const screensByKey = new Map(catalogue.map((f) => [f.key, f.screenIds]));
  const personaFeatureLevel: Record<string, Record<string, PermissionLevel>> = {};
  const personaScreenLevel: Record<string, Record<string, PermissionLevel>> = {};
  for (const persona of personas) {
    const byFeature: Record<string, PermissionLevel> = {};
    const byScreen: Record<string, PermissionLevel> = {};
    for (const grant of persona.features) {
      byFeature[grant.key] = strongest(byFeature[grant.key], grant.level);
      for (const screenId of screensByKey.get(grant.key) ?? []) {
        byScreen[screenId] = strongest(byScreen[screenId], grant.level);
      }
    }
    personaFeatureLevel[persona.id] = byFeature;
    personaScreenLevel[persona.id] = byScreen;
  }
  return { personaFeatureLevel, personaScreenLevel };
}

// Boot-time loader per frontend-architecture.md §10 - no screen/component
// should fetch config/*.json directly; always go through the accessors below.
export async function loadConfig(): Promise<ConfigData> {
  if (cache) return cache;
  if (loading) return loading;
  loading = (async () => {
    const [routes, personas, featureCatalogue, businessRules, validationRules, domainSchema, moduleHierarchy, reqToScreens] =
      await Promise.all([
        fetchJson<Route[]>('/config/routes.json'),
        fetchJson<Persona[]>('/config/personas.json'),
        // Strict, not resilient: feature grants ARE the access model now, so a
        // missing/broken copy would blank the whole app and read as a bug.
        fetchJson<FeatureCatalogueEntry[]>('/config/feature-catalogue.json'),
        fetchJson<BusinessRule[]>('/config/business-rules.json'),
        fetchJson<ValidationRule[]>('/config/validation-rules.json'),
        fetchJson<DomainEntity[]>('/config/domain-schema.json'),
        fetchJson<ModuleHierarchyEntry[]>('/config/module-hierarchy.json'),
        fetchJson<Record<string, string[]>>('/config/req-to-screens.json'),
      ]);
    // Fetched separately, with a silent fallback to "no mappings" - this file
    // is purely additive (traceability-ID badges), so a missing/broken copy
    // must never fail app boot the way a missing core config file should.
    const journeyCatalogueMap = await fetchJson<JourneyCatalogueMap>('/config/journey-catalogue-map.json').catch(
      () => EMPTY_JOURNEY_CATALOGUE_MAP
    );
    // Same resilience stance - AAV-01's matrix is new and additive (gates
    // approval assignment eligibility); a missing/broken copy should fall
    // back to "no matrix configured" (open to any approver) rather than
    // failing app boot.
    const degraded: string[] = [];
    // A load that fails is logged and recorded, and is not the same as a matrix without an entry for a category (that stays "unrestricted").
    const optional = <T,>(file: string, fallback: T) => (e: unknown): T => {
      console.error(`Config file ${file} could not be loaded; continuing without it.`, e);
      degraded.push(file);
      return fallback;
    };
    const approvalMatrix = await fetchJson<ApprovalMatrixEntry[]>('/config/approval-matrix.json').catch(optional<ApprovalMatrixEntry[]>('approval-matrix.json', []));
    // Archived 66-persona RBAC evidence, retired from the access path on
    // 2026-09-24. Resilient load for the same reason as the two above: it is
    // now purely additive (the role/access viewer's evidence panel), so a
    // missing copy must not fail boot.
    const rbac = await fetchJson<RbacEntry[]>('/config/rbac-legacy-66.json').catch(optional<RbacEntry[]>('rbac-legacy-66.json', []));
    // Customer 360 field/visibility registry (2026-09-28) - same resilience
    // stance as the three above: additive to an already-working workspace
    // page, so a missing/broken copy degrades to "show nothing extra" rather
    // than failing boot.
    const customer360Fields = await fetchJson<Customer360Field[]>('/config/customer360-fields.json').catch(optional<Customer360Field[]>('customer360-fields.json', []));
    const customer360DepartmentMapping = await fetchJson<{ staffIdToDepartment: Record<string, string | null> }>(
      '/config/customer360-department-mapping.json'
    )
      .then((d) => d.staffIdToDepartment)
      .catch(optional<Record<string, string | null>>('customer360-department-mapping.json', {}));
    const lookupLists = await fetchJson<Record<string, unknown>>('/config/lookup-lists.json')
      .then((d) => Object.fromEntries(Object.entries(d).filter(([k, v]) => !k.startsWith('_') && Array.isArray(v)).map(([k, v]) => [k, (v as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '')])))
      .catch(optional<Record<string, string[]>>('lookup-lists.json', {}));
    const documentTypes = await fetchJson<{ types: DocumentTypeConfig[] }>('/config/document-types.json')
      .then((d) => (Array.isArray(d.types) ? d.types.filter((x) => x && typeof x.id === 'string' && typeof x.label === 'string') : []))
      .catch(optional<DocumentTypeConfig[]>('document-types.json', []));
    const { personaFeatureLevel, personaScreenLevel } = indexGrants(personas, featureCatalogue);
    cache = {
      routes, personas, featureCatalogue, personaFeatureLevel, personaScreenLevel, rbac,
      businessRules, validationRules, domainSchema, moduleHierarchy,
      reqToScreens, journeyCatalogueMap, approvalMatrix, customer360Fields, customer360DepartmentMapping, lookupLists, documentTypes, degraded,
    };
    return cache;
  })();
  return loading;
}

function requireConfig(): ConfigData {
  if (!cache) {
    throw new Error('Config not loaded yet - call loadConfig() during app boot before using accessors.');
  }
  return cache;
}

/** A configured pick-list (public/config/lookup-lists.json), in its configured order; empty when the config is not loaded or has no such list. */
export function getLookupList(name: string): string[] {
  return cache?.lookupLists[name] ?? [];
}

/** The configured document types, in configured order; empty when the config is not loaded. */
export function getDocumentTypes(): DocumentTypeConfig[] {
  return cache?.documentTypes ?? [];
}

export function getAllRoutes(): Route[] {
  return requireConfig().routes;
}

export function getAllModules(): ModuleHierarchyEntry[] {
  return requireConfig().moduleHierarchy;
}

export function getAllPersonas(): Persona[] {
  return requireConfig().personas;
}

export function getPersona(personaId: string): Persona | undefined {
  return requireConfig().personas.find((p) => p.id === personaId);
}

export function getPersonaByStaffId(staffId: string): Persona | undefined {
  return requireConfig().personas.find((p) => p.staffId === staffId);
}

export function getFeatureEntry(key: string): FeatureCatalogueEntry | undefined {
  return requireConfig().featureCatalogue.find((f) => f.key === key);
}

/** The persona's granted features, in catalogue order. */
export function getPersonaFeatureGrants(personaId: string): PersonaFeatureGrant[] {
  const persona = getPersona(personaId);
  if (!persona) return [];
  const order = new Map(requireConfig().featureCatalogue.map((f, i) => [f.key, i]));
  return [...persona.features].sort((a, b) => (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0));
}

export function getPersonaFeatureLevel(personaId: string, featureKey: string): PermissionLevel | null {
  return requireConfig().personaFeatureLevel[personaId]?.[featureKey] ?? null;
}

export function getPersonaScreenLevel(personaId: string, screenId: string): PermissionLevel | null {
  return requireConfig().personaScreenLevel[personaId]?.[screenId] ?? null;
}

/** Archived 66-persona RBAC rows this role absorbs, resolved through the
 * persona's legacyPersonaIds crosswalk. Feeds the role/access viewer's
 * evidence panel ONLY - it grants nothing. Named "legacy" deliberately so a
 * future reader can't mistake it for the live access path. */
export function getLegacyRbacForRole(personaId: string): RbacEntry[] {
  const persona = getPersona(personaId);
  if (!persona || persona.legacyPersonaIds.length === 0) return [];
  const legacy = new Set(persona.legacyPersonaIds);
  return requireConfig().rbac.filter((r) => legacy.has(r.personaId));
}

export function getReqToScreens(): Record<string, string[]> {
  return requireConfig().reqToScreens;
}

/** Unique IDs from the CRM Journeys catalogue mapped onto this screen, if
 * any - empty when the screen has no confident match (see journey-catalogue-
 * map.json's _comment and the workbook's Mapping Report sheet). */
export function getJourneyIdsForScreen(screenId: string): string[] {
  return requireConfig().journeyCatalogueMap.screens[screenId] ?? [];
}

export function getJourneyMeta(journeyId: string): { name: string; type: string } | undefined {
  return requireConfig().journeyCatalogueMap.journeys[journeyId];
}

/** Whether the approval matrix loaded. When it did not, approvals must not be treated as open to any approver (see approvalAuthority). */
export const isApprovalMatrixAvailable = (): boolean => !requireConfig().degraded.includes('approval-matrix.json');

/** Agent 360 AAV-01 - the role required to be assigned/approve an approval
 * task of this category, or undefined if the category has no matrix entry
 * (open to any approver, same "unconfigured = unrestricted" stance taken
 * elsewhere for unconfirmed RBAC in this app). */
export function getRequiredApproverRole(category: string): string | undefined {
  return requireConfig().approvalMatrix.find((m) => m.category === category)?.requiredRole;
}

/** Every field row for one Customer 360 topic, in source order - see
 * customer360VisibilityEngine.ts for turning these into what a given persona
 * actually sees. */
export function getCustomer360FieldsForTopic(topic: string): Customer360Field[] {
  return requireConfig().customer360Fields.filter((f) => f.topic === topic);
}

/** Staff ID -> department column name in customer360Fields' own department
 * keys, or null for a persona the Mapping sheet names but that has no
 * matching column (see customer360-department-mapping.json's _gaps note). */
export function getCustomer360Department(staffId: string): string | null | undefined {
  return requireConfig().customer360DepartmentMapping[staffId];
}

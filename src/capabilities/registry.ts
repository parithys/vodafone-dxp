import registryJson from './registry.json';
import consumersJson from './consumers.generated.json';

/**
 * The Capability Library's registry: the one list of reusable capabilities (registry.json, hand-maintained) joined
 * with who consumes each (consumers.generated.json, written by reference/scripts/build_reusable_capabilities_inventory.py
 * from the import graph - never edited by hand).
 */
export interface CapabilityDef {
  id: string;
  name: string;
  summary: string;
  /** 'consolidated': lives under src/capabilities/<Name>/. 'registered': a single shared implementation still in place. */
  status: 'consolidated' | 'registered';
  /** Folder (consolidated) or file (registered), relative to src/. */
  home: string;
  /** The component / constant / hook journeys use. */
  entry: string;
  /** Step builders that mount it in a guided wizard. */
  stepBuilders: string[];
  /** Constant (data/stepLabels.ts) holding the step's one name, when it has one. */
  stepLabel: string | null;
  /** The implementation files behind the entry point, relative to src/. */
  parts: string[];
  /** Files journeys may import directly because they ARE the capability's API (e.g. a store whose actions raise a toast). */
  publicApi: string[];
  previewable: boolean;
}

export const CAPABILITY_REGISTRY = registryJson as CapabilityDef[];

export interface CapabilityConsumers {
  /** Journey / workspace areas that reach the capability. */
  areas: string[];
  /** Direct imports of a part that go around the capability's entry point. Should be empty. */
  bypass: string[];
}

export const CAPABILITY_CONSUMERS = consumersJson.capabilities as Record<string, CapabilityConsumers>;
/** Absolute path of the app, for "open in editor" links. */
export const APP_ROOT: string = consumersJson.root;

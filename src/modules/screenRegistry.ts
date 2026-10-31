import type { ComponentType } from 'react';

// Populated by each module's screens/index.ts (side-effect import in router.tsx) -
// keeps config/routes.json (data) and the router (code) from drifting apart per
// folder-structure.md's "Route generation" note. Screens not yet implemented
// (most of the 213 - see build-readiness.md) fall back to <ScreenNotYetBuilt>.
const registry = new Map<string, ComponentType>();

export function registerScreen(screenId: string, component: ComponentType): void {
  registry.set(screenId, component);
}

export function getScreenComponent(screenId: string): ComponentType | undefined {
  return registry.get(screenId);
}

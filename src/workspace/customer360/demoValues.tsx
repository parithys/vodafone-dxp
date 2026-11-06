import type { ReactNode } from 'react';
import type { DemoCtx, DemoKey, DemoRow } from '../../data/synthetic/customer360Demo';
import { DemoContext, useDemoValue } from './demoContext';
import { SyntheticValue } from '../../data/synthetic/SyntheticValue';

/**
 * Serves the synthetic demo values (src/data/synthetic/customer360Demo.ts) to Customer 360 fields the app has
 * no data for. Each comes back marked `isSynthetic` and is drawn violet by the shared marker, so nobody
 * mistakes it for customer data. SHOW_DEMO_CONTENT (src/data/synthetic/syntheticMarker.ts) switches it off:
 * the field then reads "-" again.
 */
export function DemoProvider({ value, children }: { value: DemoCtx; children: ReactNode }) {
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/** A field with no data: its synthetic value in violet, or "-" when demo content is off. */
export function Dv({ k, row, fallback = '-' }: { k: DemoKey; row?: DemoRow; fallback?: string }) {
  return <SyntheticValue of={useDemoValue(k, row)} fallback={fallback} />;
}

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { DEMO, type DemoCtx, type DemoKey, type DemoRow } from '../../data/synthetic/customer360Demo';
import { SyntheticValue } from '../../data/synthetic/SyntheticValue';
import { synthetic, type Synthetic } from '../../data/synthetic/syntheticMarker';

/**
 * Serves the synthetic demo values (src/data/synthetic/customer360Demo.ts) to Customer 360 fields the app has
 * no data for. Each comes back marked `isSynthetic` and is drawn violet by the shared marker, so nobody
 * mistakes it for customer data. SHOW_DEMO_CONTENT (src/data/synthetic/syntheticMarker.ts) switches it off:
 * the field then reads "-" again.
 */
const DemoContext = createContext<DemoCtx | null>(null);
export function DemoProvider({ value, children }: { value: DemoCtx; children: ReactNode }) {
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/** The synthetic value for a field, or undefined without a customer context. */
export function useDemoValue(key: DemoKey, row?: DemoRow): Synthetic<string> | undefined {
  const ctx = useContext(DemoContext);
  return ctx ? synthetic(DEMO[key](ctx, row)) : undefined;
}

/** A field with no data: its synthetic value in violet, or "-" when demo content is off. */
export function Dv({ k, row, fallback = '-' }: { k: DemoKey; row?: DemoRow; fallback?: string }) {
  return <SyntheticValue of={useDemoValue(k, row)} fallback={fallback} />;
}

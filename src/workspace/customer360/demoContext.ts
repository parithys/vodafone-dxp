import { createContext, useContext } from 'react';
import { DEMO, type DemoCtx, type DemoKey, type DemoRow } from '../../data/synthetic/customer360Demo';
import { synthetic, type Synthetic } from '../../data/synthetic/syntheticMarker';

export const DemoContext = createContext<DemoCtx | null>(null);

/** The synthetic value for a field, or undefined without a customer context. */
export function useDemoValue(key: DemoKey, row?: DemoRow): Synthetic<string> | undefined {
  const ctx = useContext(DemoContext);
  return ctx ? synthetic(DEMO[key](ctx, row)) : undefined;
}

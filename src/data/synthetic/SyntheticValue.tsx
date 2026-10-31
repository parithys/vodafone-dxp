import type { ReactNode } from 'react';
import { SHOW_DEMO_CONTENT, SYNTHETIC_CLASS, type Synthetic } from './syntheticMarker';

/** Renders a synthetic value in the violet marker, or `fallback` when demo content is switched off. */
export function SyntheticValue({ of, fallback = '-' }: { of: Synthetic<ReactNode> | undefined; fallback?: ReactNode }) {
  if (!SHOW_DEMO_CONTENT || !of?.isSynthetic || !of.value) return <>{fallback}</>;
  return <span className={SYNTHETIC_CLASS}>{of.value}</span>;
}

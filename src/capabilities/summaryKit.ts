import { formatQar } from '../lib/format';
// Helpers every capability's step summary shares: read a nested value out of the draft values, format QAR.
export type Values = Record<string, unknown>;
export const at = (values: Values, ...path: string[]): unknown =>
  path.reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Values)[k] : undefined), values);
export const qar = (n: unknown) => (typeof n === 'number' ? formatQar(n) : undefined);

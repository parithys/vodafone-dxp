import { formatBytes } from '../../../lib/format';
import type { EntityKind } from '../../../engines/mockDataEngine';

// Step summaries: each wizard step may declare which of the draft's values are worth echoing back once the step is
// done. The Summary panel is generic - it reads these declarations and the single draft-values object, and keeps no
// state of its own.

export type SummaryFieldType = 'text' | 'select' | 'multi' | 'date' | 'toggle' | 'file';

/** Resolves a stored id to the label users see, from a data set (loaded by the panel, never copied into state). */
export interface SummaryLabelSource {
  kind: EntityKind;
  idField: string;
  labelField: string;
}

export interface SummaryField {
  key: string;
  label: string;
  type: SummaryFieldType;
  /** Reads the raw value out of the draft values. */
  value: (values: Record<string, unknown>) => unknown;
  /** select / multi: the display label for each stored value, when it is a fixed list. */
  options?: Record<string, string>;
  /** select / multi: labels come from a data set instead. */
  labelFrom?: SummaryLabelSource;
  /** Identifiers and account numbers: everything but the last 4 characters is masked. */
  sensitive?: boolean;
  /** Left empty on purpose is fine: shows "Not provided". (Every field does when empty; this documents intent.) */
  optional?: boolean;
  /** Return false to leave the field out for this order (e.g. a field that does not apply). */
  when?: (values: Record<string, unknown>) => boolean;
}

export interface FormattedSummaryValue {
  /** Text to show. */
  text: string;
  /** multi with more than 3 entries: the full list, shown on expand. */
  fullList?: string[];
  /** Nothing was entered. */
  empty: boolean;
}

export const MULTI_PREVIEW = 3;
export const NOT_PROVIDED = 'Not provided';

export const maskAllButLast4 = (s: string): string => (s.length <= 4 ? s : `${'•'.repeat(s.length - 4)}${s.slice(-4)}`);

const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);


/** Display text for one field's raw value. `labels` carries the resolved labels for `labelFrom` fields (id -> label). */
export function formatSummaryValue(
  field: SummaryField,
  raw: unknown,
  labels: Record<string, string> | undefined,
  formatDate: (v: unknown) => string | undefined
): FormattedSummaryValue {
  if (field.type === 'toggle') {
    if (raw === undefined || raw === null) return { text: NOT_PROVIDED, empty: true };
    return { text: raw === true || raw === 'Yes' || raw === 'yes' ? 'Yes' : 'No', empty: false };
  }
  if (isEmpty(raw)) return { text: NOT_PROVIDED, empty: true };
  const label = (v: unknown) => {
    const k = String(v);
    return field.options?.[k] ?? labels?.[k] ?? k;
  };
  const mask = (t: string) => (field.sensitive ? maskAllButLast4(t) : t);
  switch (field.type) {
    case 'multi': {
      const list = (Array.isArray(raw) ? raw : [raw]).map((v) => mask(label(v)));
      if (list.length <= MULTI_PREVIEW) return { text: list.join(', '), empty: false };
      return { text: `${list.slice(0, MULTI_PREVIEW).join(', ')} +${list.length - MULTI_PREVIEW} more`, fullList: list, empty: false };
    }
    case 'select':
      return { text: mask(label(raw)), empty: false };
    case 'date':
      return { text: formatDate(raw) ?? String(raw), empty: false };
    case 'file': {
      const f = raw as { name?: string; size?: number } | string;
      if (typeof f === 'string') return { text: f, empty: false };
      return { text: f.name ? `${f.name}${typeof f.size === 'number' ? ` (${formatBytes(f.size)})` : ''}` : NOT_PROVIDED, empty: !f.name };
    }
    default:
      return { text: mask(String(raw).trim()), empty: false };
  }
}

/** Sets each step's `summary` from a map keyed by step key (steps absent from the map keep none). */
export function attachSummaries<S extends { key: string; summary?: SummaryField[] }>(steps: S[], summaries: Record<string, SummaryField[]>): S[] {
  return steps.map((s) => (summaries[s.key] ? { ...s, summary: summaries[s.key] } : s));
}

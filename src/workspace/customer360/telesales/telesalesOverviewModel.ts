import type { ReactNode } from 'react';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import { formatDate } from '../../../lib/format';
import { CHART, CHECK, CHEVRON_RIGHT, GLOBE, GRID, HELP, I_BARS, I_CALENDAR, I_CARD, I_PIN, I_STAR, PERSON, PHONE_ICON, SEARCH_ICON, REFRESH_ALT } from '../../../assets/icons';
import type { TelesalesContext } from './telesalesContext';

type Ctx = TelesalesContext;

export const I = {
  user: PERSON,
  card: I_CARD,
  star: I_STAR,
  refresh: REFRESH_ALT,
  bars: I_BARS,
  chart: CHART,
  pin: I_PIN,
  search: SEARCH_ICON,
  phone: PHONE_ICON,
  grid: GRID,
  globe: GLOBE,
  check: CHECK,
  help: HELP,
  chevron: CHEVRON_RIGHT,
  calendar: I_CALENDAR,
};

/** True when the persona may see this field (real-time or drill-down) under that topic. */
export const can = (ctx: Ctx, topic: string, details: string) =>
  getVisibleTopicFields(ctx.personaId, topic).some(({ field }) => field.details === details);
export const anyOf = (ctx: Ctx, topic: string, list: string[]) => list.some((d) => can(ctx, topic, d));

export const asText = (v: ReactNode | undefined) => (v === undefined || v === null || v === '' ? undefined : v);
export const num = (v: ReactNode | undefined) => {
  const m = /^(\d+)/.exec(String(v ?? ''));
  return m ? Number(m[1]) : undefined;
};
export const dateTime = (iso: unknown) => {
  const d = new Date(String(iso ?? ''));
  return Number.isNaN(d.getTime()) ? { d: String(iso ?? ''), t: '' } : { d: formatDate(d), t: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
};

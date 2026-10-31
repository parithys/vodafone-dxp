import { Button } from '../../../components/primitives/Button';
import type { ReactNode } from 'react';
import { getVisibleTopicFields } from '../../../engines/customer360VisibilityEngine';
import { Badge } from '../../../components/primitives/Badge';
import { Icon } from '../../../components/primitives/Icon';
import { SegmentedTabs } from '../../../components/primitives/SegmentedTabs';
import { useLayoutEffect, useRef, useState } from 'react';
import { accountInformationResolvers, accountInformationRichFields } from '../sections/accountInformationResolvers';
import { TopicFieldsSection } from '../sections/TopicFieldsSection';
import { blacklistResolvers } from '../sections/blacklistResolvers';
import { DevicePenaltyPolicy, StarNumberPenaltyPolicy } from '../sections/penaltyViewResolvers';
import { buildAssetsFieldResolver } from '../sections/assetsResolvers';
import type { TelesalesContext } from './TelesalesTabs';
import { formatDate } from '../../../lib/format';

// Shared pieces of the Telesales Overview page (card shell, rows, pills, masonry grid) and its Additional
// Information strip. The page's sections live in the Telesales*Section.tsx files in this folder.

export const I = {
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  card: 'M3 6h18v12H3z M3 10h18',
  star: 'M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1z',
  refresh: 'M21 12a9 9 0 1 1-3-6.7 M21 4v5h-5',
  bars: 'M5 20V10 M12 20V4 M19 20v-7',
  chart: 'M3 3v18h18 M7 14l4-4 3 3 5-6',
  pin: 'M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z',
  check: 'M20 6L9 17l-5-5',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7 M12 17v.1',
  chevron: 'M9 18l6-6-6-6',
  calendar: 'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4',
};

export type Ctx = TelesalesContext;

// Masonry: cards of different heights packed into as many columns as fit (each at least 20rem wide).
// A grid of thin rows; every card spans as many rows as its measured height, and "dense" placement
// slots each one into the first gap it fits, so no column is left with a hole under a short card.
export function MasonryGrid({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ROW = 4;
    const GAP = 16;
    const apply = (c: HTMLElement) => {
      c.style.gridRowEnd = `span ${Math.ceil((c.getBoundingClientRect().height + GAP) / ROW)}`;
    };
    const ro = new ResizeObserver((entries) => entries.forEach((e) => apply(e.target as HTMLElement)));
    const seen = new WeakSet<Element>();
    const scan = () =>
      el.querySelectorAll<HTMLElement>('[data-mcard]').forEach((c) => {
        if (!seen.has(c)) {
          seen.add(c);
          ro.observe(c);
        }
        apply(c);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className="grid gap-x-4 gap-y-0 [grid-auto-flow:row_dense] [grid-auto-rows:4px] [grid-template-columns:repeat(auto-fill,minmax(max(20rem,calc((100%_-_2rem)/3)),1fr))]">
      {children}
    </div>
  );
}


/** True when the persona may see this field (real-time or drill-down) under that topic. */
export const can = (ctx: Ctx, topic: string, details: string) =>
  getVisibleTopicFields(ctx.personaId, topic).some(({ field }) => field.details === details);
export const anyOf = (ctx: Ctx, topic: string, list: string[]) => list.some((d) => can(ctx, topic, d));

const PILL: Record<string, 'tag-green' | 'tag-amber' | 'tag-blue' | 'tag-red' | 'accent' | 'filled-neutral'> = {
  green: 'tag-green',
  amber: 'tag-amber',
  red: 'tag-red',
  solid: 'accent',
  neutral: 'filled-neutral',
  blue: 'tag-blue',
};

export function Pill({ tone, children }: { tone: keyof typeof PILL; children: ReactNode }) {
  return <Badge variant={PILL[tone]}>{children}</Badge>;
}

export function Card({ title, icon, link, onLink, children, className = '' }: { title: string; icon: string; link?: string; onLink?: () => void; children: ReactNode; className?: string }) {
  return (
    <section data-mcard className={`card overflow-hidden self-start w-full min-w-0 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--field-card-border)]">
        <h3 className="inline-flex items-center gap-2.5 text-fg font-semibold text-[length:var(--fs-body-lg)]">
          <Icon path={icon} className="w-5 h-5" />
          {title}
        </h3>
        {link && onLink && (
          <Button variant="tertiary" type="button" onClick={onLink} className="whitespace-nowrap">
            {link} &rarr;
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

export const Label = ({ children }: { children: ReactNode }) => <div className="text-fg-2 text-[length:var(--fs-caption)]">{children}</div>;
export const Value = ({ children, big }: { children: ReactNode; big?: boolean }) => (
  <div className={`text-fg font-semibold ${big ? 'text-[length:var(--fs-h4)]' : 'text-[length:var(--fs-body-lg)]'}`}>{children}</div>
);

/** Label on the left, value on the right - the Contact / Address / Lead / Usage row. */
export function KV({ label, children, striped }: { label: string; children: ReactNode; striped?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[var(--field-card-border)] last:border-0 ${striped ? 'bg-surface-half' : ''}`}>
      <span className="text-fg-2 text-[length:var(--fs-body)]">{label}</span>
      <span className="text-fg text-[length:var(--fs-body)] font-medium text-right break-words">{children}</span>
    </div>
  );
}

export const asText = (v: ReactNode | undefined) => (v === undefined || v === null || v === '' ? undefined : v);
export const num = (v: ReactNode | undefined) => {
  const m = /^(\d+)/.exec(String(v ?? ''));
  return m ? Number(m[1]) : undefined;
};
export const dateTime = (iso: unknown) => {
  const d = new Date(String(iso ?? ''));
  return Number.isNaN(d.getTime()) ? { d: String(iso ?? ''), t: '' } : { d: formatDate(d), t: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
};

// ---------------------------------------------------------------- Usage & Behaviour
export function Ring({ value, unit, sub, fraction, label, wide }: { value: string; unit?: string; sub?: string; fraction?: number; label: string; wide?: boolean }) {
  // A labelled bar (the rings this replaced are no longer used anywhere). `wide` marks a plain figure with no allowance.
  const f = Math.max(0, Math.min(1, fraction ?? 0));
  return (
    <div className="space-y-1.5 min-w-0">
      <div className="flex items-baseline justify-between gap-3 text-[length:var(--fs-body)]">
        <span className="text-fg-2">{label}</span>
        <span className="text-right">
          <span className="font-bold text-fg">
            {value}
            {unit ? ` ${unit}` : ''}
          </span>
          {sub && <span className="text-muted text-[length:var(--fs-caption)]"> {sub}</span>}
        </span>
      </div>
      {!wide && fraction !== undefined && (
        <div className="h-1.5 rounded-[var(--radius-pill)] bg-border-soft overflow-hidden" role="progressbar" aria-valuenow={Math.round(f * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-[var(--radius-pill)] bg-accent" style={{ width: `${f * 100}%` }} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Additional Information
// The reference's last strip: nine links, each opening its detail inline beneath the strip.
export function AdditionalInformation({ ctx }: { ctx: Ctx }) {
  const { data, services, personaId } = ctx;
  const [open, setOpen] = useState<string | undefined>(); // the chosen tab; falls back to the first one
  const rich = accountInformationRichFields({ data, onTicketCreated: ctx.onTicketCreated, expandAll: true });
  const AI = 'Account Information';
  const resolve = (d: string) => accountInformationResolvers[d]?.({ data, services });
  const only = (topic: string, fields: string[], resolver?: (d: string) => ReactNode | undefined) => (
    <TopicFieldsSection personaId={personaId} topic={topic} only={fields} layout={[{ title: '', display: 'list', fields }]} resolveValue={resolver} richFields={rich} expandAll />
  );
  const doi = ['DOI Handset Type', 'DOI Price', 'DOI Remaining Amount', 'DOI Tennure'];
  const assetRes = buildAssetsFieldResolver(undefined, data);
  const items: { key: string; label: string; show: boolean; node: ReactNode }[] = [
    { key: 'ah', label: 'Account Hierarchy', show: can(ctx, AI, 'Account Hierarchy'), node: rich['Account Hierarchy'] },
    { key: 'bp', label: 'Billing Profiles', show: can(ctx, AI, 'All Billing Profiles'), node: rich['All Billing Profiles'] },
    { key: 'ia', label: 'Installed Assets', show: can(ctx, AI, 'Installed Assets'), node: rich['Installed Assets'] },
    { key: 'ch', label: 'Contact Hierarchy', show: can(ctx, AI, 'Contact Hierarchy'), node: rich['Contact Hierarchy'] },
    { key: 'sm', label: 'Special Management', show: can(ctx, AI, 'Special Management'), node: only(AI, ['Special Management'], resolve) },
    { key: 'nas', label: 'NAS / Address', show: can(ctx, AI, 'NAS/Address'), node: only(AI, ['NAS/Address'], resolve) },
    {
      key: 'pen',
      label: 'Penalty View',
      show: can(ctx, 'Penalty View', 'Star number Penalty'),
      node: (
        <div className="space-y-4">
          <StarNumberPenaltyPolicy />
          <DevicePenaltyPolicy />
        </div>
      ),
    },
    {
      key: 'bl',
      label: 'Blacklist View',
      show: getVisibleTopicFields(personaId, 'Blacklist View').length > 0,
      node: <TopicFieldsSection personaId={personaId} topic="Blacklist View" resolveValue={(d) => blacklistResolvers[d]?.(data)} expandAll />,
    },
    { key: 'doi', label: 'Existing DOI View', show: anyOf(ctx, 'Assets', doi), node: only('Assets', doi, assetRes) },
  ].filter((i) => i.show);
  if (items.length === 0) return null;
  // A tabbed card: one tab is always selected (the first until the agent picks another).
  const current = items.find((i) => i.key === open) ?? items[0];
  return (
    // data-mcard: MasonryGrid sizes only marked cards. Without it this card got a single 4px grid row and its
    // links were clipped away (overflow-hidden), leaving an empty strip above the next card. It spans every
    // column and sits last on the Overview (see telesalesTabs).
    <section data-mcard className="card overflow-hidden self-start w-full min-w-0 [grid-column:1/-1]">
      <div className="px-5 py-4 border-b border-[var(--field-card-border)]">
        <h3 className="inline-flex items-center gap-2.5 text-fg font-semibold text-[length:var(--fs-body-lg)]">
          <Icon path={I.grid} className="w-5 h-5" />
          Additional Information
        </h3>
      </div>
      {/* Tabs inside a card on a page are content-level (Level 2): the pill tabs. */}
      <div className="mx-5 mt-4">
        <SegmentedTabs label="Additional Information" items={items.map((i) => ({ key: i.key, label: i.label }))} active={current?.key} onChange={setOpen} />
      </div>
      {current && (
        <div role="tabpanel" className="p-5">
          {current.node}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Overview
/** The Overview tab's own cards: the account at a glance and the quick links to the deeper account views. */
/** The Overview tab's own card: the quick links to the deeper account views. */
export function TelesalesOverview({ ctx }: { ctx: Ctx }) {
  return <AdditionalInformation ctx={ctx} />;
}

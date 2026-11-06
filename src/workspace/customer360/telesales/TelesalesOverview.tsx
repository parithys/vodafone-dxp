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
import type { TelesalesContext } from './telesalesContext';
import { I, anyOf, can } from './telesalesOverviewModel';

// Shared pieces of the Telesales Overview page (card shell, rows, pills, masonry grid) and its Additional
// Information strip. The page's sections live in the Telesales*Section.tsx files in this folder.

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
    <div ref={ref} className="overview-masonry">
      {children}
    </div>
  );
}


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
    <section data-mcard className={`card panel-fill ${className}`}>
      <div className="split-nowrap pad-panel border-b border-[var(--field-card-border)]">
        <h3 className="inline-title-row title title-md">
          <Icon path={icon} className="size-5 " />
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

export const Label = ({ children }: { children: ReactNode }) => <div className="caption-secondary">{children}</div>;
export const Value = ({ children, big }: { children: ReactNode; big?: boolean }) => (
  <div className={`text-fg font-semibold ${big ? 'text-[length:var(--fs-h4)]' : 'text-[length:var(--fs-body-lg)]'}`}>{children}</div>
);

/** Label on the left, value on the right - the Contact / Address / Lead / Usage row. */
export function KV({ label, children, striped }: { label: string; children: ReactNode; striped?: boolean }) {
  return (
    <div className={`spread items-center pad-panel py-3.5 row-rule-card ${striped ? 'bg-surface-half' : ''}`}>
      <span className="text-secondary">{label}</span>
      <span className="value-end text-[length:var(--fs-body)]">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------- Usage & Behaviour
export function Ring({ value, unit, sub, fraction, label, wide }: { value: string; unit?: string; sub?: string; fraction?: number; label: string; wide?: boolean }) {
  // A labelled bar (the rings this replaced are no longer used anywhere). `wide` marks a plain figure with no allowance.
  const f = Math.max(0, Math.min(1, fraction ?? 0));
  return (
    <div className="space-y-1.5 min-w-0">
      <div className="baseline-row">
        <span className="text-fg-2">{label}</span>
        <span className="text-right">
          <span className="font-bold text-fg">
            {value}
            {unit ? ` ${unit}` : ''}
          </span>
          {sub && <span className="caption-muted"> {sub}</span>}
        </span>
      </div>
      {!wide && fraction !== undefined && (
        <div className="meter-track" role="progressbar" aria-valuenow={Math.round(f * 100)} aria-valuemin={0} aria-valuemax={100}>
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
    <section data-mcard className="card panel-fill [grid-column:1/-1]">
      <div className="pad-panel border-b border-[var(--field-card-border)]">
        <h3 className="inline-title-row title title-md">
          <Icon path={I.grid} className="size-5 " />
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

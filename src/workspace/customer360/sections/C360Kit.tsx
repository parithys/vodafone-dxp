import { DataTable, type Column } from '../../../components/primitives/DataTable';
import { toneFor, type Tone } from '../../../lib/statusTone';
import { formatDate, formatQarLoose, formatTime } from '../../../lib/format';
import { useEffect, useId, useRef, useState } from 'react';
import { containerId } from '../queryFlow/containerIndex';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { SearchField } from '../../../components/primitives/SearchField';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Icon } from '../../../components/primitives/Icon';
import { RevealValue, useFieldAccess } from '../fieldAccess';


/**
 * Building blocks shared by the Customer 360 tab pages (Overview, Account Information, Products & Services,
 * Billing & Payments, Offers & Leads, Contact & Identity, Orders, Tickets & Support, Activities, Alerts & Risks).
 * Everything is styled with design-system tokens; the tone palette maps the design's red / green / amber / blue /
 * purple tiles onto --accent / --success / --warn / --signal-blue / --info.
 */

export const IC = {
  calendar: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M16 2v4 M8 2v4 M3 10h18',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M15 9l-6 6 M9 9l6 6',
  x: 'M18 6L6 18 M6 6l12 12',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  card: 'M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M1 10h22',
  wallet: 'M20 12V8H6a2 2 0 0 1 0-4h12v4 M4 6v12a2 2 0 0 0 2 2h14v-4 M18 12a2 2 0 0 0 0 4h4v-4z',
  bars: 'M6 20V10 M12 20V4 M18 20v-6',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  ban: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M4.93 4.93l14.14 14.14',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  building: 'M6 2h12a1 1 0 0 1 1 1v19H5V3a1 1 0 0 1 1-1z M9 6h2 M13 6h2 M9 10h2 M13 10h2 M9 14h2 M13 14h2 M10 22v-4h4v4',
  pin: 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 21h16',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3',
  plus: 'M12 5v14 M5 12h14',
  edit: 'M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  chevRight: 'M9 18l6-6-6-6',
  chevLeft: 'M15 18l-6-6 6-6',
  chevDown: 'M6 9l6 6 6-6',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  box: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  cart: 'M6 6h15l-1.5 9h-12z M6 6L5 2H2 M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  headset: 'M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l4 2',
  swap: 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3',
  layers: 'M12 2L2 7l10 5 10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  database: 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3 M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5',
  mobile: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  wifi: 'M5 12.55a11 11 0 0 1 14.08 0 M1.42 9a16 16 0 0 1 21.16 0 M8.53 16.11a6 6 0 0 1 6.95 0 M12 20h.01',
  tv: 'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M17 2l-5 5-5-5',
  cpu: 'M6 6h12v12H6z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3',
  clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  copy: 'M9 9h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z M5 15H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1',
  lock: 'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z M8 11V7a4 4 0 0 1 8 0v4',
  receipt: 'M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .67V2l-1 .67L17 2l-3 2-3-2-3 2-3-2z M8 8h8 M8 12h8',
  signalTower: 'M4.9 16.1C1 12.2 1 5.8 4.9 1.9 M7.8 4.7a6.14 6.14 0 0 0-.8 7.5 M16.2 4.7c1.5 1.9 1.7 4.6.8 7.5 M19.1 1.9c3.9 3.9 3.9 10.3 0 14.2 M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 11v11 M9 22h6',
  trend: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
} as const;

/** Tinted fill + foreground per tone, from design tokens. */
export const TONE: Record<Tone, { bg: string; fg: string; border: string }> = {
  red: { bg: 'bg-tone-accent', fg: 'text-accent', border: 'border-[var(--danger-border)]' },
  green: { bg: 'bg-tone-success', fg: 'text-success', border: 'border-[var(--success-border)]' },
  amber: { bg: 'bg-[var(--warn-bg)]', fg: 'text-[var(--warn-text)]', border: 'border-[var(--warn-border)]' },
  blue: { bg: 'bg-tone-blue', fg: 'text-[var(--signal-blue)]', border: 'border-tone-blue-border' },
  purple: { bg: 'bg-tone-info', fg: 'text-[var(--info)]', border: 'border-[var(--info-border)]' },
  grey: { bg: 'bg-[var(--surface)]', fg: 'text-fg-2', border: 'border-[var(--field-card-border)]' },
};

export { toneFor, type Tone } from '../../../lib/statusTone';

const TONE_BADGE = { red: 'tag-red', green: 'tag-green', amber: 'tag-amber', blue: 'tag-blue', purple: 'tag-violet', grey: 'filled-neutral' } as const;

/** Status / tag chip: the shared Badge, with this kit's tone names mapped onto its variants. */
export function Pill({ tone = 'grey', children, solid = false }: { tone?: Tone; children: ReactNode; solid?: boolean }) {
  return <Badge variant={solid ? 'accent' : TONE_BADGE[tone]}>{children}</Badge>;
}

/** The "Primary" marker (primary contact, primary line): one look everywhere, distinct from the tinted tags. */
export function PrimaryTag() {
  return <Badge variant="tag-primary">Primary</Badge>;
}

/** Pill whose tone follows its own text. */
export function StatusPill({ status }: { status: string }) {
  return <Pill tone={toneFor(status)}>{status}</Pill>;
}

export function IconTile({ icon, tone = 'blue', size = 'md' }: { icon: string; tone?: Tone; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const glyph = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span className={`${box} rounded-[var(--radius-button)] flex items-center justify-center shrink-0 ${TONE[tone].bg} ${TONE[tone].fg}`}>
      <Icon path={icon} className={glyph} />
    </span>
  );
}

/** Red "View All →" style link. */
export function LinkAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <Button variant="tertiary" type="button" onClick={onClick} className="whitespace-nowrap">
      {children} &rarr;
    </Button>
  );
}

/** The red "View" pill used in table action columns. */
export function ViewPill({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="secondary" compact onClick={onClick}>
      View
    </Button>
  );
}

export function ActionButton({ children, icon, onClick, primary = false, disabled = false }: { children: ReactNode; icon?: string; onClick?: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <Button variant={primary ? 'primary' : 'secondary'} compact onClick={onClick} disabled={disabled}>
      {icon && <Icon path={icon} className="w-4 h-4" />}
      {children}
    </Button>
  );
}

/**
 * The page card every tab sits in: icon tile + title + subtitle on the left, page actions on the right,
 * then the page body.
 */
export function TabPage({ icon, tone = 'blue', title, subtitle, actions, children }: { icon?: string; tone?: Tone; title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="card p-5 space-y-4">
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            {icon && <IconTile icon={icon} tone={tone} size="lg" />}
            <div className="min-w-0">
              {title && <h2 className="text-fg font-bold text-[length:var(--fs-h5)] leading-tight">{title}</h2>}
              {subtitle && <p className="text-fg-2 text-[length:var(--fs-body)]">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/** A KPI tile: tinted icon, label, big value, optional caption and "View all →" link. */
export function KpiTile({
  icon,
  tone = 'blue',
  label,
  value,
  caption,
  link,
  onLink,
  chevron = false,
  onClick,
}: {
  icon: string;
  tone?: Tone;
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  link?: string;
  onLink?: () => void;
  chevron?: boolean;
  onClick?: () => void;
}) {
  const modeOf = useFieldAccess();
  if (modeOf(label) === 'hidden') return null;
  const body = (
    <>
      <IconTile icon={icon} tone={tone} size="lg" />
      <div className="min-w-0 flex-1 text-left">
        <div className="text-fg-2 text-[length:var(--fs-body)]">{label}</div>
        <div className="text-fg font-bold text-[length:var(--fs-h5)] leading-tight break-words">{value}</div>
        {caption && <div className="text-fg-2 text-[length:var(--fs-caption)] mt-0.5">{caption}</div>}
        {link && onLink && (
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onLink();
            }}
            onKeyDown={(e) => e.key === 'Enter' && onLink()}
            className="inline-block mt-1 text-link font-medium text-[length:var(--fs-body)] hover:underline cursor-pointer"
          >
            {link} &rarr;
          </span>
        )}
      </div>
      {chevron && <Icon path={IC.chevRight} className="w-5 h-5 text-fg shrink-0" />}
    </>
  );
  // A cell of the KPI card (see KpiGrid): its right and bottom edges are the dividers between cells.
  const cls = 'p-4 flex items-center gap-4 min-w-0 border-r border-b border-border-soft';
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} w-full hover:bg-surface`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/**
 * A KPI strip: ONE card holding every KPI as a cell, divided by thin lines, in a grid that follows the card's width.
 * Each cell draws its own right and bottom edge; the grid is pulled 1px out the right and bottom so the edge cells' lines
 * fall outside the card (and are clipped) instead of doubling its border.
 */
export function KpiGrid({ children, cols = 5 }: { children: ReactNode; cols?: 3 | 4 | 5 | 6 }) {
  const c = cols === 3 ? '' : cols === 6 ? '@6xl:grid-cols-6' : cols === 4 ? '@6xl:grid-cols-4' : '@6xl:grid-cols-5';
  return (
    <div className="card overflow-hidden">
      <div className={`grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 ${c} -mr-px -mb-px`}>{children}</div>
    </div>
  );
}

/** A titled card (icon + title, optional right-hand action) holding rows, lists or a table. */
export function Panel({ icon, title, action, children, className = '', flush = false, bodyClassName = '', id }: { icon?: string; title: ReactNode; action?: ReactNode; children: ReactNode; className?: string; flush?: boolean; bodyClassName?: string; /** Container id for in-page search; derived from a text title when omitted. */ id?: string }) {
  const modeOf = useFieldAccess();
  if (typeof title === 'string' && modeOf(title) === 'hidden') return null;
  return (
    // A panel whose rows were all withheld by field access (empty body) is not drawn.
    <section data-container-id={id ?? (typeof title === 'string' ? containerId(title) : undefined)} className={`card min-w-0 has-[>.panel-body:empty]:hidden ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-4 pb-3">
        <h3 className="flex items-center gap-2.5 text-fg font-semibold text-[length:var(--fs-body-lg)] min-w-[10rem]">
          {icon && <Icon path={icon} className="w-5 h-5 shrink-0" />}
          <span className="min-w-0 break-words">{title}</span>
        </h3>
        {action}
      </header>
      <div className={`panel-body empty:hidden ${flush ? '' : 'px-4 pb-4'} ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Label / value rows. A row whose value is undefined, null or '' is left out. */
export function DetailRows({ rows, align = 'right' }: { rows: { label: string; value: ReactNode | undefined | null; strong?: boolean }[]; align?: 'left' | 'right' }) {
  const modeOf = useFieldAccess();
  const shown = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== '' && modeOf(r.label) !== 'hidden');
  if (shown.length === 0) return null;
  return (
    <dl>
      {shown.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4 py-2 border-b border-border-soft last:border-0 text-[length:var(--fs-body)]">
          <dt className="text-fg">{r.label}</dt>
          <dd className={`text-fg min-w-0 break-words ${r.strong === false ? '' : 'font-medium'} ${align === 'right' ? 'text-right' : ''}`}>
            {modeOf(r.label) === 'drill-down' ? <RevealValue>{r.value}</RevealValue> : r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export interface GridCol<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  /** Numeric column: right-aligned in the header and every row, and its values never wrap. */
  numeric?: boolean;
  /** The identifier column: its values are semibold (the only emphasised column). */
  strong?: boolean;
}

/**
 * Customer 360's data grid: the shared DataTable in its `plain` variant (no outer frame - the Panel around it is the card;
 * header stays in view past ~70vh; no sorting, no paging) plus the one thing only Customer 360 has: columns whose header
 * the agent's field-access mode hides are dropped.
 */
export function GridTable<T>({
  cols,
  rows,
  rowKey,
  selectedKey,
  onSelect,
  empty = 'Nothing on file.',
  dense = false,
}: {
  cols: GridCol<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectedKey?: string;
  onSelect?: (row: T) => void;
  empty?: string;
  dense?: boolean;
}) {
  const modeOf = useFieldAccess();
  const columns: Column<T>[] = cols
    .filter((c) => modeOf(c.header) !== 'hidden')
    .map(({ className, ...c }) => ({ ...c, cellClassName: className, sortable: false }));
  return (
    <DataTable
      variant="plain"
      columns={columns}
      rows={rows}
      rowKey={rowKey}
      selectedKey={selectedKey}
      onRowClick={onSelect}
      emptyMessage={empty}
      dense={dense}
      pageSize={Infinity}
    />
  );
}

/** Customer 360's search box: the shared SearchField with the kit's layout (grows to fill the filter row). */
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <SearchField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange('')}
      placeholder={placeholder}
      aria-label={placeholder}
      wrapperClassName="flex-1 min-w-48"
    />
  );
}

/**
 * Compact labelled select used in filter rows (small caption over the value). A custom listbox rather than a native
 * <select>: the browser draws a native popup over the field with the chosen option aligned to it, which is where the
 * misplaced options came from. This one always opens directly under the field.
 */
export function FilterSelect({ label, value, options, onChange, hideLabel = false, captioned = false }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  /** Value only, no caption and no prefix (the name stays available to screen readers) - for a select whose options already say what they are. */
  hideLabel?: boolean;
  /** The older two-line look: a small caption above the value. Use for a picker, not a filter. */
  captioned?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const last = options.length - 1;
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab' && open) {
      setOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setActive(selectedIndex);
        setOpen(true);
      } else {
        setActive((i) => (e.key === 'ArrowDown' ? Math.min(last, i + 1) : Math.max(0, i - 1)));
      }
    } else if (open && (e.key === 'Home' || e.key === 'End')) {
      e.preventDefault();
      setActive(e.key === 'Home' ? 0 : last);
    } else if ((e.key === 'Enter' || e.key === ' ') && open && active >= 0) {
      e.preventDefault();
      choose(active);
    } else if (open && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const from = active + 1;
      const hit = [...options.slice(from), ...options.slice(0, from)].findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit >= 0) setActive((from + hit) % options.length);
    }
  };

  return (
    <div ref={ref} className="relative min-w-36" onKeyDown={onKeyDown}>
      <button
        type="button"
        ref={triggerRef}
        role="combobox"
        // A combobox is not named from its content, so the visible "Order Type: All" gives no name: name it, with the chosen value.
        aria-label={`${label}: ${selected?.label ?? ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
        onClick={() => {
          setActive(selectedIndex);
          setOpen((o) => !o);
        }}
        className={`w-full text-left rounded-[var(--radius-button)] border border-[var(--field-card-border)] bg-bg px-3 pr-10 focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
          captioned ? 'pt-1 pb-1.5' : 'py-2 min-h-[var(--control-h-md)] flex items-center'
        }`}
      >
        {captioned ? (
          <>
            <span className="block text-muted text-[length:var(--fs-caption)] leading-tight">{label}</span>
            <span className="block truncate text-fg text-[length:var(--fs-body)]">{selected?.label}</span>
          </>
        ) : hideLabel ? (
          <>
            <span className="sr-only">{label}</span>
            <span className="block truncate text-fg text-[length:var(--fs-body)]">{selected?.label}</span>
          </>
        ) : (
          // "Severity: All" - the caption becomes a prefix on the value; an "All Modules" / "All Status" option reads as plain "All".
          <span className="block truncate text-fg text-[length:var(--fs-body)]">
            <span className="text-muted">{label}: </span>
            {/^all\b/i.test(selected?.label ?? '') && /^all( \w+)?$/i.test(selected?.label ?? '') ? 'All' : selected?.label}
          </span>
        )}
        <Icon path={IC.chevDown} className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-fg-2" />
      </button>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-[var(--z-raised)] mt-1 min-w-full max-h-64 overflow-y-auto rounded-[var(--radius-button)] border border-[var(--field-card-border)] bg-bg py-1 shadow-raised"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer whitespace-nowrap px-3 py-2 text-[length:var(--fs-body)] text-fg ${i === active ? 'bg-[var(--field-focus-bg)]' : ''} ${o.value === value ? 'font-medium text-accent' : ''}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Progress({ pct, tone = 'red' }: { pct: number; tone?: Tone }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const bar = tone === 'green' ? 'bg-success' : tone === 'amber' ? 'bg-[var(--warn)]' : tone === 'blue' ? 'bg-[var(--signal-blue)]' : 'bg-accent';
  return (
    <div className="h-1.5 rounded-[var(--radius-pill)] bg-border-soft overflow-hidden" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-[var(--radius-pill)] ${bar}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** One allowance as a labelled bar: the label on the left, "value of total" on the right, the fill underneath. */
export function UsageBar({ pct, value, unit, label }: { pct: number; value: ReactNode; unit?: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-[length:var(--fs-body)]">
        <span className="text-fg-2">{label}</span>
        <span className="text-right">
          <span className="font-bold text-fg">{value}</span>
          {unit && <span className="text-muted text-[length:var(--fs-caption)]"> {unit}</span>}
        </span>
      </div>
      <Progress pct={pct} />
    </div>
  );
}

// Paging is the Pagination capability's (capabilities/Pagination): one hook, one bar, one pager for every paged list.
export { usePagination as usePaging, Pagination, Pager } from '../../../capabilities';

export const fmtDate = (v: unknown): string | undefined => (v === undefined || v === null || v === '' ? undefined : formatDate(v));

export const fmtDateTime = (v: unknown): { date?: string; time?: string } => {
  if (v === undefined || v === null || v === '') return {};
  return { date: formatDate(v), time: /T\d/.test(String(v)) ? formatTime(v) : undefined };
};

export const qar = formatQarLoose;

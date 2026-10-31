import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SegmentedTabs } from '../../../components/primitives/SegmentedTabs';
import { GridTable, toneFor } from '../sections/C360Kit';
import { Button } from '../../../components/primitives/Button';
import { Icon } from '../../../components/primitives/Icon';
import { Card, I, Pill } from './TelesalesOverview';


// Building blocks shared by the Telesales Overview page sections (Account, Contacts, Connections,
// Billing, Offers, Usage, Address, Leads, Orders & Tickets, Audit Trail), in the supplied design.

export const ICON = {
  ...I,
  down: 'M6 9l6 6 6-6',
  up: 'M18 15l-6-6-6 6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  plus: 'M12 5v14 M5 12h14',
  check: 'M20 6L9 17l-5-5',
  dots: 'M5 12h.01 M12 12h.01 M19 12h.01',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 21h16',
};

const THIN = 'border-[var(--field-card-border)]';

interface Slots {
  toolbar: HTMLElement | null;
  wide: HTMLElement | null;
}
const SlotsContext = createContext<Slots>({ toolbar: null, wide: null });

/**
 * Page frame for the Overview: a toolbar at the top that gathers every section's page-level actions,
 * then the masonry of compact cards, then a full-width area for the blocks that need the room
 * (wide tables, list + detail panels). Sections render in place and reach both areas through this context.
 */
export function ToolbarShell({ children }: { children: ReactNode }) {
  const [toolbar, setToolbar] = useState<HTMLElement | null>(null);
  const [wide, setWide] = useState<HTMLElement | null>(null);
  return (
    <SlotsContext.Provider value={{ toolbar, wide }}>
      <div ref={setToolbar} className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 mb-4 empty:hidden" aria-label="Page actions" />
      {children}
      <div ref={setWide} className="space-y-4" />
    </SlotsContext.Provider>
  );
}

/** Content that needs the full page width: moved out of the masonry into the full-width area below it. */
export function WideBlock({ className = '', children }: { className?: string; children: ReactNode }) {
  const { wide } = useContext(SlotsContext);
  return wide ? createPortal(<div className={className}>{children}</div>, wide) : null;
}

/** A section's marker on the page: it shows no heading, only hands its actions to the top toolbar. */
export function SectionHeader({ actions }: { actions?: ReactNode }) {
  const el = useContext(SlotsContext).toolbar;
  return el && actions ? createPortal(<>{actions}</>, el) : null;
}

export function HeaderButton({ children, primary, onClick }: { children: ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <Button variant={primary ? 'primary' : 'secondary'} compact onClick={onClick}>
      {children}
    </Button>
  );
}

export function HeaderLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="order-first text-link underline text-[length:var(--fs-body)] font-medium">
      {children}
    </button>
  );
}

/** Key figures as a compact two-up grid card (it sits in a masonry column, so it never needs a wide strip). */
export function StatStrip({ items }: { items: { value: ReactNode; label: string; tone?: 'ok' | 'bad' | 'warn'; icon?: string }[] }) {
  const color = { ok: 'text-success', bad: 'text-danger', warn: 'text-[var(--warn-text)]' };
  return (
    <section data-mcard className={`rounded-[var(--radius-card)] border ${THIN} bg-bg overflow-hidden self-start w-full min-w-0`}>
      <div className="grid grid-cols-2">
        {items.map((i, n) => (
          <div key={i.label} className={`px-4 py-3 border-[var(--field-card-border)] ${n % 2 === 0 ? 'border-r' : ''} ${n < items.length - (items.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''}`}>
            <div className={`flex items-center gap-2 font-bold text-[length:var(--fs-h4)] ${i.tone ? color[i.tone] : 'text-fg'}`}>
              {i.icon && <Icon path={i.icon} className="w-4 h-4 text-fg" />}
              {i.value}
            </div>
            <div className="text-fg-2 text-[length:var(--fs-caption)]">{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export interface Col<T> {
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
}

/** Telesales' simple table: the same GridTable every Customer 360 section uses (one table style), keyed by column header. */
export function Table<T>({ cols, rows, empty = 'Nothing on file.' }: { cols: Col<T>[]; rows: T[]; empty?: string }) {
  return (
    <GridTable<T>
      cols={cols.map((c) => ({ key: c.header, header: c.header, className: c.className, render: (r, i) => c.render(r, i) }))}
      rows={rows}
      rowKey={(r) => String(rows.indexOf(r))}
      empty={empty}
    />
  );
}

export function TableCard<T>({ title, icon, link, onLink, cols, rows, empty, children, headerExtra }: { title: string; icon: string; link?: string; onLink?: () => void; cols: Col<T>[]; rows: T[]; empty?: string; children?: ReactNode; headerExtra?: ReactNode }) {
  return (
    <Card title={title} icon={icon} link={link} onLink={onLink}>
      {headerExtra}
      <Table cols={cols} rows={rows} empty={empty} />
      {children}
    </Card>
  );
}

/** Title + subtitle rows with a chevron or trailing icon: Related Actions, Quick Actions, Related Links. */
export function ActionList({ items }: { items: { title: string; sub: string; icon?: string; onClick?: () => void }[] }) {
  return (
    <div className={`divide-y divide-[var(--field-card-border)]`}>
      {items.map((a) => (
        <button key={a.title} type="button" onClick={a.onClick} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface">
          <span className="min-w-0">
            <span className="block text-fg font-semibold text-[length:var(--fs-body-lg)]">{a.title}</span>
            <span className="block text-fg-2 text-[length:var(--fs-caption)]">{a.sub}</span>
          </span>
          <Icon path={a.icon ?? I.chevron} className="w-4 h-4 text-muted shrink-0" />
        </button>
      ))}
    </div>
  );
}

/** Tile grid of linked items with a short description: Additional Account Information, Related Information. */
export function TileLinks({ items, columns = 5 }: { items: { key: string; title: string; sub: string; icon: string; onClick: () => void; active?: boolean }[]; columns?: number }) {
  return (
    <div className="p-4 grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(max(${columns >= 5 ? '9.5rem' : '16rem'}, calc((100% - 1.5rem) / 3)), 1fr))` }}>
      {items.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={t.onClick}
          className={`flex items-center gap-3 rounded-[var(--radius-card)] border ${THIN} px-4 py-3 text-left hover:bg-surface ${t.active ? 'border-accent bg-surface' : ''}`}
        >
          <span className="text-accent shrink-0">
            <Icon path={t.icon} className="w-4 h-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-fg font-semibold text-[length:var(--fs-body)] truncate">{t.title}</span>
            <span className="block text-fg-2 text-[length:var(--fs-caption)]">{t.sub}</span>
          </span>
          <Icon path={I.chevron} className="w-4 h-4 text-muted shrink-0" />
        </button>
      ))}
    </div>
  );
}

export function PillTabs({ items, active, onChange }: { items: { key: string; label: string }[]; active: string; onChange: (k: string) => void }) {
  return <SegmentedTabs items={items} active={active} onChange={onChange} />;
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const ini = name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return <span className={`inline-flex items-center justify-center font-bold text-accent shrink-0 ${size === 'sm' ? 'w-7 text-[length:var(--fs-caption)]' : 'w-10 text-[length:var(--fs-body)]'}`}>{ini}</span>;
}

/** Vertical red bars (billing history, usage trend); `stack` draws a second series on top in slate. */
export function BarChart({ data, unit = '', height = 150 }: { data: { label: string; value: number; extra?: number }[]; unit?: string; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value + (d.extra ?? 0)));
  const ticks = [max, Math.round((max * 2) / 3), Math.round(max / 3), 0];
  return (
    <div className="flex gap-3 px-5 py-4">
      <div className="flex flex-col justify-between text-muted text-[length:var(--fs-micro)] text-right" style={{ height }}>
        {ticks.map((t, i) => (
          <span key={i}>
            {t}
            {unit && t ? ` ${unit}` : ''}
          </span>
        ))}
      </div>
      <div className="flex-1">
        <div className="flex items-end gap-3" style={{ height }}>
          {data.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col justify-end h-full" title={`${d.label}: ${d.value}${d.extra ? ` + ${d.extra}` : ''}`}>
              {d.extra ? <div className="bg-[var(--telesales-chart-slate)] rounded-t-sm" style={{ height: `${(d.extra / max) * 100}%` }} /> : null}
              <div className={`bg-accent ${d.extra ? '' : 'rounded-t-sm'}`} style={{ height: `${(d.value / max) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-1">
          {data.map((d) => (
            <div key={d.label} className="flex-1 text-center text-muted text-[length:var(--fs-micro)]">
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Label / value rows with a status pill on the value: used by the compact detail cards. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--field-card-border)] last:border-0">
      <span className="text-fg-2 text-[length:var(--fs-body)]">{label}</span>
      <span className="text-fg text-[length:var(--fs-body)] text-right font-medium break-words">{children}</span>
    </div>
  );
}

export const yesNo = (v: boolean | string | undefined | null) => {
  const yes = v === true || v === 'Yes';
  return <Pill tone={yes ? 'green' : 'red'}>{yes ? 'Yes' : 'No'}</Pill>;
};

// One status-to-colour map for Customer 360 and Telesales alike: toneFor in C360Kit.
export const pillFor = (status: string) => {
  const t = toneFor(status);
  return (t === 'grey' || t === 'purple' ? 'neutral' : t) as 'neutral' | 'green' | 'blue' | 'red' | 'amber';
};

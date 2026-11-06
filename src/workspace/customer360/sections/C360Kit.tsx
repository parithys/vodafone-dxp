import { DataTable, type Column } from '../../../components/primitives/DataTable';
import type { Tone } from '../../../lib/statusTone';
import { IC, TONE, toneFor } from './c360KitModel';
import { useEffect, useId, useRef, useState } from 'react';
import { containerId } from '../queryFlow/containerIndex';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { SearchField } from '../../../components/primitives/SearchField';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Icon } from '../../../components/primitives/Icon';
import { RevealValue } from '../fieldAccess';
import { useFieldAccess } from '../fieldAccessContext';


/**
 * Building blocks shared by the Customer 360 tab pages (Overview, Account Information, Products & Services,
 * Billing & Payments, Offers & Leads, Contact & Identity, Orders, Tickets & Support, Activities, Alerts & Risks).
 * Everything is styled with design-system tokens; the tone palette maps the design's red / green / amber / blue /
 * purple tiles onto --accent / --success / --warn / --signal-blue / --info.
 */

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
    <span className={`${box} rounded-[var(--radius-button)] icon-tile ${TONE[tone].bg} ${TONE[tone].fg}`}>
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
      {icon && <Icon path={icon} className="size-4 " />}
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
        <div className="split">
          <div className="row gap-4 min-w-0">
            {icon && <IconTile icon={icon} tone={tone} size="lg" />}
            <div className="min-w-0">
              {title && <h2 className="title title-lg leading-tight">{title}</h2>}
              {subtitle && <p className="text-secondary">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="row gap-2">{actions}</div>}
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
      <div className="fill-start">
        <div className="text-secondary">{label}</div>
        <div className="title title-lg leading-tight break-words">{value}</div>
        {caption && <div className="caption-secondary mt-0.5">{caption}</div>}
        {link && onLink && (
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onLink();
            }}
            onKeyDown={(e) => e.key === 'Enter' && onLink()}
            className="inline-block mt-1 link-body-strong cursor-pointer"
          >
            {link} &rarr;
          </span>
        )}
      </div>
      {chevron && <Icon path={IC.chevRight} className="icon-md text-fg" />}
    </>
  );
  // A cell of the KPI card (see KpiGrid): its right and bottom edges are the dividers between cells.
  const cls = 'row gap-4 cell-ruled';
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
      <div className={`collapsed-grid @4xl:grid-cols-3 ${c}`}>{children}</div>
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
      <header className="card-header-row">
        <h3 className="kit-title">
          {icon && <Icon path={icon} className="icon-md" />}
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
        <div key={r.label} className="data-row">
          <dt className="text-fg">{r.label}</dt>
          <dd className={`value-cell ${r.strong === false ? '' : 'font-medium'} ${align === 'right' ? 'text-right' : ''}`}>
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
        className={`w-full text-left select-trigger ${
          captioned ? 'select-trigger-captioned' : 'select-trigger-plain'
        }`}
      >
        {captioned ? (
          <>
            <span className="block caption-muted leading-tight">{label}</span>
            <span className="line-body">{selected?.label}</span>
          </>
        ) : hideLabel ? (
          <>
            <span className="sr-only">{label}</span>
            <span className="line-body">{selected?.label}</span>
          </>
        ) : (
          // "Severity: All" - the caption becomes a prefix on the value; an "All Modules" / "All Status" option reads as plain "All".
          <span className="line-body">
            <span className="text-muted">{label}: </span>
            {/^all\b/i.test(selected?.label ?? '') && /^all( \w+)?$/i.test(selected?.label ?? '') ? 'All' : selected?.label}
          </span>
        )}
        <Icon path={IC.chevDown} className="select-chevron" />
      </button>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="select-menu"
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
              className={`menu-option ${i === active ? 'bg-[var(--field-focus-bg)]' : ''} ${o.value === value ? 'font-medium text-accent' : ''}`}
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
    <div className="meter-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-[var(--radius-pill)] ${bar}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** One allowance as a labelled bar: the label on the left, "value of total" on the right, the fill underneath. */
export function UsageBar({ pct, value, unit, label }: { pct: number; value: ReactNode; unit?: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="baseline-row">
        <span className="text-fg-2">{label}</span>
        <span className="text-right">
          <span className="font-bold text-fg">{value}</span>
          {unit && <span className="caption-muted"> {unit}</span>}
        </span>
      </div>
      <Progress pct={pct} />
    </div>
  );
}

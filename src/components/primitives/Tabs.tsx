import { Tooltip } from './Tooltip';
import { PanelIcon } from './PanelIcon';
import { TabStrip } from './TabStrip';
import { NestedTabs } from './TabLevel';
import { useState } from 'react';
import { Icon } from './Icon';
import type { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
  /** SVG path for the icon rail (24px grid). Falls back to a list icon. */
  icon?: string;
}

// Backs Customer 360 / Account 360 (Pattern 3) per component-catalogue.md §1.
// `orientation` defaults to the horizontal tab strip (TabStrip, the underline look - every
// existing consumer keeps that look unchanged) - 'vertical' renders the same
// tokens/states (border-accent/text-accent active, border-transparent/text-fg-2
// idle) as a left-hand nav list instead, for consumers with many tabs where a
// side list reads better than a wide underline bar.
export function Tabs({
  items,
  defaultKey,
  orientation = 'horizontal',
  rail = false,
  activeKey,
  onChange,
  toolbar,
  label = 'Sections',
}: {
  items: TabItem[];
  defaultKey?: string;
  orientation?: 'horizontal' | 'vertical';
  /** Vertical only: the numbered step-rail look used by the guided wizards (stacked rows, number badge, warm active row). */
  rail?: boolean;
  /** Controlled active tab - pass alongside onChange when a parent needs to
   * know/drive which tab is active (e.g. to reflect it in a breadcrumb).
   * Omit both for the original self-managed behavior. */
  activeKey?: string;
  onChange?: (key: string) => void;
  /** Horizontal only: controls that sit on the tab row, pushed to its right edge (a search box, filters). */
  toolbar?: ReactNode;
  /** Accessible name of the tab strip (what the tabs are tabs of). */
  label?: string;
}) {
  const [uncontrolledActive, setUncontrolledActive] = useState(defaultKey ?? items[0]?.key);
  const active = activeKey ?? uncontrolledActive;
  const setActive = onChange ?? setUncontrolledActive;
  const activeItem = items.find((i) => i.key === active);

  if (orientation === 'vertical' && rail) {
    return (
      <div className="flex flex-col lg:flex-row items-stretch">
        <IconRail items={items} active={active} onSelect={setActive} />
        <div className="@container flex-1 min-w-0 w-full p-8"><NestedTabs>{activeItem?.content}</NestedTabs></div>
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-56 shrink-0 card overflow-hidden">
          {items.map((item) => (
            <button type="button"
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`block w-full text-left px-4 py-2.5 text-[length:var(--fs-body)] border-l-2 transition-colors
                ${active === item.key ? 'border-accent text-[var(--accent-text)] font-medium bg-surface' : 'border-transparent text-fg-2 hover:text-fg hover:bg-surface'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0"><NestedTabs>{activeItem?.content}</NestedTabs></div>
      </div>
    );
  }

  return (
    <div>
      {toolbar ? (
        <div className="flex flex-wrap items-center gap-3">
          <TabStrip items={items} active={active} onChange={setActive} label={label} className="flex-1 min-w-0" />
          <div className="flex min-w-0 flex-1 basis-[30%] items-center justify-end gap-3">{toolbar}</div>
        </div>
      ) : (
        <TabStrip items={items} active={active} onChange={setActive} label={label} />
      )}
      <div className="pt-4"><NestedTabs>{activeItem?.content}</NestedTabs></div>
    </div>
  );
}

const FALLBACK_ICON = 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01';
const RAIL_KEY = 'vfq-rail-expanded';

/**
 * Vertical icon rail, flush against the left / top / bottom of its area (the page supplies no padding around it).
 * Collapsed it shows icons only; hovering an item - or focusing it - reveals ITS label over the
 * content without moving anything. The toggle at the top pins the rail open so every label is shown in place;
 * that choice is remembered.
 *
 * Touch: there is no hover, and a tap focuses the item, which used to leave the overlay label stuck open over the page
 * (covering what is under it), so the overlay is not drawn on a coarse pointer - the tap goes straight to the item. Below lg
 * the rail is a horizontal strip of 48px icons (the active one also shows its label); at lg and up the pinned (expanded)
 * rail shows every label in place.
 */
function IconRail({ items, active, onSelect }: { items: TabItem[]; active: string | undefined; onSelect: (key: string) => void }) {
  const [expanded, setExpanded] = useState(() => {
    try {
      return localStorage.getItem(RAIL_KEY) !== '0';
    } catch {
      return true; // storage blocked (e.g. private mode): default to expanded
    }
  });
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem(RAIL_KEY, next ? '1' : '0');
    } catch {
      /* the preference just is not remembered */
    }
  };
  const row = 'h-12 flex items-center';
  return (
    <nav
      aria-label="Customer sections"
      className={`shrink-0 self-stretch bg-bg ${expanded ? 'lg:w-64' : 'lg:w-16'}`}
    >
      <div className="lg:sticky lg:top-0 lg:z-[var(--z-raised)]">
        <Tooltip content={expanded ? 'Collapse sections' : 'Expand sections'} placement="right">
          <button
            type="button"
            onClick={toggle}
            aria-label={expanded ? 'Collapse sections' : 'Expand sections'}
            className={`${row} hidden lg:flex w-full border-b border-border-soft text-fg-2 hover:bg-surface focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${expanded ? 'justify-end px-5' : 'justify-center'}`}
          >
            <PanelIcon expanded={expanded} className="w-5 h-5" />
          </button>
        </Tooltip>
        <ol className="flex lg:block overflow-x-auto lg:overflow-visible">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <li key={item.key} aria-current={isActive ? 'step' : undefined} className="group relative shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(item.key)}
                  aria-label={item.label}
                  className={`${row} ${isActive && !expanded ? 'max-lg:w-auto max-lg:gap-2 max-lg:px-3' : 'w-12'} lg:w-full border-l-2 transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                    isActive ? 'bg-accent bg-[image:var(--accent-gradient)] text-accent-on border-l-transparent' : 'border-l-transparent text-fg-2 hover:bg-surface-warm hover:text-accent'
                  } ${expanded ? 'lg:pl-[21px] lg:pr-5 lg:gap-3' : 'justify-center'}`}
                >
                  <Icon path={item.icon ?? FALLBACK_ICON} className="w-5 h-5 shrink-0" />
                  {isActive && !expanded && <span className="lg:hidden whitespace-nowrap text-[length:var(--fs-body)] font-semibold">{item.label}</span>}
                  {expanded && <span className={`hidden lg:inline min-w-0 truncate text-[length:var(--fs-body)] ${isActive ? 'font-semibold' : 'font-medium text-fg'}`}>{item.label}</span>}
                </button>
                {!expanded && (
                  // Overlay label: absolutely positioned from the item's own left edge, over the page, so the layout
                  // never shifts. Shown on hover or keyboard focus of THIS item only. Clickable like the icon under it:
                  // the button stays the accessible control, so this copy is hidden from assistive tech.
                  <span
                    aria-hidden="true"
                    onClick={() => onSelect(item.key)}
                    className={`pointer-coarse:hidden! pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto cursor-pointer absolute left-0 top-0 z-[var(--z-raised)] hidden lg:flex h-12 items-center gap-3 pl-[23px] pr-5 whitespace-nowrap rounded-r-[var(--radius-sm)] border border-l-0 border-[var(--field-card-border)] shadow-raised text-[length:var(--fs-body)] overflow-hidden max-w-16 opacity-0 transition-[max-width,opacity] duration-[var(--motion-slow)] ease-in-out motion-reduce:transition-none group-hover:max-w-64 group-hover:opacity-100 group-focus-within:max-w-64 group-focus-within:opacity-100 ${
                      isActive ? 'bg-accent bg-[image:var(--accent-gradient)] text-accent-on font-semibold border-transparent' : 'bg-surface-warm text-fg font-medium'
                    }`}
                  >
                    <Icon path={item.icon ?? FALLBACK_ICON} className={`w-5 h-5 shrink-0 ${isActive ? '' : 'text-accent'}`} />
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

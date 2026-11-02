import { Tooltip } from './Tooltip';
import { PanelIcon } from './PanelIcon';
import { TabStrip } from './TabStrip';
import { NestedTabs } from './TabLevel';
import { useId, useState } from 'react';
import { Icon } from './Icon';
import type { ReactNode } from 'react';
import { FALLBACK_ICON } from '../../assets/icons';

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
      <div className="tabs-layout">
        <IconRail items={items} active={active} onSelect={setActive} />
        <div className="tabs-panel"><NestedTabs>{activeItem?.content}</NestedTabs></div>
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className="split-pane md:flex-row">
        <div className="tabs-nav-card card">
          {items.map((item) => (
            <button type="button"
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`tab-vertical-item
 ${active === item.key ? 'tab-vertical-active' : 'tab-vertical-idle'}`}
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
        <div className="cluster">
          <TabStrip items={items} active={active} onChange={setActive} label={label} className="flex-1 min-w-0" />
          <div className="row tabs-aside">{toolbar}</div>
        </div>
      ) : (
        <TabStrip items={items} active={active} onChange={setActive} label={label} />
      )}
      <div className="pt-4"><NestedTabs>{activeItem?.content}</NestedTabs></div>
    </div>
  );
}

const RAIL_KEY = 'vfq-rail-expanded';

/**
 * Vertical icon rail, the same pattern as the Journey Summary: a card inset from the top and left of its area that folds sideways.
 * Collapsed it is a 64px rail of icons only (each with a tooltip naming it); expanded it shows every icon with its label. The panel
 * icon at the top toggles it, and the choice is remembered. The active section is the red band, as in the Journey Summary rail.
 *
 * Below lg there is no card: the rail is a horizontal strip of 48px icons (the active one also shows its label).
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
  const row = 'rail-row';
  const listId = useId();
  const toggleLabel = expanded ? 'Collapse sections' : 'Expand sections';
  return (
    <nav
      aria-label="Customer sections"
      className={`rail-start ${expanded ? 'lg:w-64' : 'lg:w-16'}`}
    >
      <Tooltip content={toggleLabel} placement={expanded ? 'bottom' : 'right'}>
        <button
          type="button"
          onClick={toggle}
          aria-label={toggleLabel}
          aria-expanded={expanded}
          aria-controls={listId}
          className={`${row} rail-toggle ${expanded ? 'rail-toggle-wide' : 'justify-center'}`}
        >
          <PanelIcon expanded={expanded} className="size-6 " />
        </button>
      </Tooltip>
      <ol id={listId} className="tabs-scroll">
        {items.map((item) => {
          const isActive = active === item.key;
          const button = (
            <button
              type="button"
              onClick={() => onSelect(item.key)}
              aria-label={item.label}
              className={`${row} rail-item ${isActive && !expanded ? 'rail-item-compact' : 'rail-item-narrow'} ${isActive ? 'nav-active' : 'nav-ghost'} ${expanded ? 'rail-item-wide' : 'justify-center'}`}
            >
              <Icon path={item.icon ?? FALLBACK_ICON} className="size-6 shrink-0" />
              {isActive && !expanded && <span className="tab-label-compact">{item.label}</span>}
              {expanded && <span className={`tab-label-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>}
            </button>
          );
          return (
            <li key={item.key} aria-current={isActive ? 'step' : undefined} className="shrink-0">
              {/* Collapsed, the icon is the only label a row has: a tooltip names it. Expanded, the label is in the row. */}
              {expanded ? button : <Tooltip content={item.label} placement="right">{button}</Tooltip>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

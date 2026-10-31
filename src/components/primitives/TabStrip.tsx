import type { KeyboardEvent } from 'react';
import { SegmentedTabs } from './SegmentedTabs';
import { useTabDepth } from './TabLevel';

export interface TabStripItem<K extends string = string> {
  key: K;
  label: string;
  /** A count shown in a small badge after the label (red on the selected tab, grey on the others). */
  count?: number;
}

/**
 * The horizontal tab strip - the app's original underline tab bar: labels in a row on a thin rule, the selected one in the
 * accent colour and bold with an accent underline, the others charcoal and regular. The rule is --tab-line-w and the selected underline --tab-active-w (thicker); the rule is an inset shadow on the strip (not a border), so
 * the scroll container does not clip the selected underline that sits on it. Colours are design-system
 * tokens only (accent, fg, and --tab-line-color for the rule, which is --field-card-border). Use it for
 * NAVIGATION and CONTENT tabs - tabs that switch the section or view shown below. Tabs that only FILTER the same data use
 * SegmentedTabs (the pill switcher) instead.
 *
 * Level 1 only: inside a tab panel (see TabLevel.tsx) it draws as the pill tabs instead - an underline is never nested.
 *
 * Keyboard and semantics match SegmentedTabs: arrows / Home / End move between tabs and select them, only the selected tab
 * is in the Tab order (WAI-ARIA tabs pattern), and the strip scrolls sideways instead of wrapping.
 */
export function TabStrip<K extends string>({
  items,
  active,
  onChange,
  label,
  className = '',
}: {
  items: TabStripItem<K>[];
  active: K | undefined;
  onChange: (key: K) => void;
  /** Accessible name of the strip. */
  label?: string;
  className?: string;
}) {
  const nested = useTabDepth() > 0;
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((t) => t.key === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].key);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };
  if (nested) return <SegmentedTabs items={items} active={active} onChange={onChange} label={label} className={className} />;
  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`flex max-w-full overflow-x-auto shadow-[inset_0_calc(var(--tab-line-w)*-1)_0_0_var(--tab-line-color)] ${className}`}
    >
      {items.map(({ key, label: text, count }) => {
        const selected = active === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(key)}
            className={`flex shrink-0 items-center gap-2 border-b-[length:var(--tab-active-w)] px-4 py-3 text-[length:var(--fs-body)] whitespace-nowrap transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
              selected ? 'border-accent text-[var(--accent-text)] font-bold' : 'border-transparent text-fg hover:text-[var(--accent-text)]'
            }`}
          >
            {text}
            {count !== undefined && (
              <span
                className={`inline-flex h-6 min-w-6 items-center justify-center rounded-[var(--radius-pill)] px-1.5 text-[length:var(--fs-micro)] font-semibold ${
                  selected ? 'bg-accent text-accent-on' : 'bg-[var(--icon-tile-bg)] text-fg-2'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
